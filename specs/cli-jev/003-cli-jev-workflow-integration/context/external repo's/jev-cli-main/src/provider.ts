// Jev transport: TypeSafe direct (default), OpenRouter Decisions, or Cloudflare
// Workers AI. All speak the {state, questions} -> answers contract; URL, auth,
// and model slugs differ. Proxies add hops, so direct TypeSafe is the
// recommended default.

import { type Questions, TypeSafeClient } from "@typesafe-ai/sdk";
import type { ProviderName } from "./config.js";
import { CliError } from "./errors.js";

export type ResolvedProvider = Exclude<ProviderName, "auto">;

export interface Usage {
  input_tokens: number;
  output_tokens: number;
}

export interface AskResult {
  /** One answer per question id, validated by `validateAnswers`; commands narrow by question type. */
  // biome-ignore lint/suspicious/noExplicitAny: answers are a discriminated union the SDK types loosely
  answers: Record<string, any>;
  usage: Usage;
  provider: ResolvedProvider;
  model: string;
}

/** The single dependency every command needs: ask Jev questions about state. */
export type AskFn = (state: unknown, questions: Record<string, unknown>) => Promise<AskResult>;

export interface ProviderOptions {
  provider: ProviderName;
  model: string;
  timeoutMs: number;
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  signal?: AbortSignal;
  /** Where the third-party hop notice goes; defaults to stderr. */
  notify?: (message: string) => void;
}

const USER_AGENT = "jevctl";

interface ProxyBody {
  answers?: unknown;
  usage?: { input_tokens?: number; output_tokens?: number };
  model?: string;
}
interface CloudflareBody extends ProxyBody {
  success?: boolean;
  errors?: unknown;
  result?: ProxyBody & { state?: string; result?: ProxyBody };
}
const REFERER = "https://github.com/Nasrallah-AL/jev-cli";

/** OpenRouter has no `latest` alias; map it to the current pinned release. */
export const OPENROUTER_LATEST = "jev-1.13";

/** Decide which transport to use from explicit choice plus available credentials. */
export function resolveProvider(env: NodeJS.ProcessEnv, explicit: ProviderName = "auto"): ResolvedProvider {
  const hasTypesafe = Boolean(env.TYPESAFE_API_KEY?.trim());
  const hasOpenRouter = /^sk-or-/.test(env.OPENROUTER_API_KEY ?? "");
  const cfToken = env.JEV_CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_API_TOKEN;
  const hasCloudflare = Boolean(cfToken && env.CLOUDFLARE_ACCOUNT_ID);

  switch (explicit) {
    case "typesafe":
      if (!hasTypesafe) {
        throw new CliError(
          "Provider is typesafe but TYPESAFE_API_KEY is not set. Run `jev auth login` to store a key.",
        );
      }
      return "typesafe";
    case "openrouter":
      if (!hasOpenRouter) {
        throw new CliError(
          "Provider is openrouter but OPENROUTER_API_KEY is not set or is not an sk-or- key. " +
            "Run `jev auth login openrouter` to store one.",
        );
      }
      return "openrouter";
    case "cloudflare":
      if (!hasCloudflare) {
        throw new CliError(
          "Provider is cloudflare but CLOUDFLARE_API_TOKEN (or JEV_CLOUDFLARE_API_TOKEN) and CLOUDFLARE_ACCOUNT_ID are not both set.",
        );
      }
      return "cloudflare";
    case "auto":
      if (hasTypesafe) return "typesafe";
      if (hasOpenRouter) return "openrouter";
      if (hasCloudflare) return "cloudflare";
      throw new CliError(
        "No credentials found. Run `jev auth login` to store a key, or set TYPESAFE_API_KEY " +
          "(https://console.typesafe.ai/settings/keys), OPENROUTER_API_KEY (sk-or-...), " +
          "or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.",
      );
    default: {
      const never: never = explicit;
      throw new CliError(`Unknown provider ${String(never)}`);
    }
  }
}

/** Model slug as each proxy expects it. */
export function providerModel(provider: ResolvedProvider, model: string): string {
  if (provider === "openrouter") {
    const effective = model === "jev-latest" ? OPENROUTER_LATEST : model;
    return effective.startsWith("typesafe/") ? effective : `typesafe/${effective}`;
  }
  if (provider === "cloudflare") {
    if (model.startsWith("typesafe/")) return model;
    return `typesafe/${model === "jev-latest" ? "jev" : model}`;
  }
  return model;
}

/**
 * Reject a response that is not the answers the request asked for. Jev either
 * answers every question or the request fails; a missing or mistyped answer
 * means a proxy or transport problem, and treating it as "probability 0" would
 * let a screen pass or a claim verify by accident.
 */
export function validateAnswers(
  questions: Record<string, unknown>,
  answers: unknown,
  model: string,
  // biome-ignore lint/suspicious/noExplicitAny: see AskResult.answers
): Record<string, any> {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new CliError(
      `Malformed response from ${model}: no answers object. Retry, or check TYPESAFE_BASE_URL.`,
    );
  }
  const got = answers as Record<string, Record<string, unknown>>;
  const missing = Object.keys(questions).filter((id) => !(id in got));
  if (missing.length > 0) {
    const shown = missing.slice(0, 5).join(", ") + (missing.length > 5 ? `, … (${missing.length})` : "");
    throw new CliError(`Malformed response from ${model}: no answer for ${shown}.`);
  }
  for (const [id, q] of Object.entries(questions)) {
    const asked = (q as { type?: string })?.type;
    const a = got[id];
    const problem =
      !a || typeof a !== "object"
        ? "is not an object"
        : asked && a.type !== asked
          ? `has type ${String(a.type)} but the question was ${asked}`
          : a.type === "noul" && typeof a.noul !== "number"
            ? "has a non-numeric noul probability"
            : a.type === "choice" && typeof a.choice !== "string"
              ? "has no choice"
              : a.type === "score" && typeof a.score !== "number"
                ? "has a non-numeric score"
                : null;
    if (problem) throw new CliError(`Malformed response from ${model}: answer "${id}" ${problem}.`);
  }
  return got;
}

const HOP_HOSTS: Record<ResolvedProvider, string> = {
  typesafe: "api.typesafe.ai",
  openrouter: "openrouter.ai",
  cloudflare: "api.cloudflare.com",
};

/**
 * `auto` falls back to a proxy when no TypeSafe key is present, and an
 * OPENROUTER_API_KEY another tool left in the environment is enough to trigger
 * it. Say so on stderr, so a third party is never in the path unannounced.
 * One `AskFn` is built per command, so this prints once per run.
 */
export function noticeThirdPartyHop(
  provider: ResolvedProvider,
  requested: ProviderName,
  notify: (message: string) => void,
): void {
  if (requested !== "auto" || provider === "typesafe") return;
  notify(
    `jev: no TypeSafe key found, using ${provider}: your state and questions pass through ` +
      `${HOP_HOSTS[provider]}. Run \`jev auth login\` for TypeSafe direct, or pass -P ${provider} ` +
      "to choose it deliberately and silence this.\n",
  );
}

/** Build an `AskFn` bound to the resolved provider. */
export function createAsk(opts: ProviderOptions): AskFn {
  const env = opts.env ?? process.env;
  const provider = resolveProvider(env, opts.provider);
  noticeThirdPartyHop(provider, opts.provider, opts.notify ?? ((m) => process.stderr.write(m)));
  const fetchImpl = opts.fetch ?? globalThis.fetch;
  const model = providerModel(provider, opts.model);

  if (provider === "typesafe") {
    const client = new TypeSafeClient({
      apiKey: env.TYPESAFE_API_KEY,
      baseURL: env.TYPESAFE_BASE_URL || undefined,
      defaultModel: model,
      timeout: opts.timeoutMs,
      // biome-ignore lint/suspicious/noExplicitAny: the SDK declares its own fetch type
      fetch: fetchImpl as any,
      defaultHeaders: { "User-Agent": USER_AGENT },
    });
    return async (state, questions) => {
      const response = await client.systemOne(
        {
          state: state as Parameters<typeof client.systemOne>[0]["state"],
          questions: questions as Questions,
          model,
        },
        { signal: opts.signal },
      );
      return {
        answers: validateAnswers(questions, response.answers, response.model ?? model),
        usage: {
          input_tokens: response.usage?.input_tokens ?? 0,
          output_tokens: response.usage?.output_tokens ?? 0,
        },
        provider,
        model: response.model ?? model,
      };
    };
  }

  if (provider === "openrouter") {
    return async (state, questions) => {
      const response = await fetchWithTimeout(
        fetchImpl,
        "https://openrouter.ai/api/alpha/decisions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": REFERER,
            "X-Title": USER_AGENT,
          },
          body: JSON.stringify({ model, state, questions }),
        },
        opts.timeoutMs,
        opts.signal,
      );
      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new CliError(`OpenRouter decisions API ${response.status}: ${body.slice(0, 300)}`);
      }
      const body = (await response.json()) as ProxyBody;
      return {
        answers: validateAnswers(questions, body.answers, body.model ?? model),
        usage: { input_tokens: body.usage?.input_tokens ?? 0, output_tokens: body.usage?.output_tokens ?? 0 },
        provider,
        model: body.model ?? model,
      };
    };
  }

  // Cloudflare Workers AI wraps the same contract in {model, input} and the
  // v4 {result, success} envelope. Single alias; no version pinning.
  return async (state, questions) => {
    const response = await fetchWithTimeout(
      fetchImpl,
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.JEV_CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, input: { state, questions } }),
      },
      opts.timeoutMs,
      opts.signal,
    );
    const body = (await response.json().catch(() => ({}))) as CloudflareBody;
    if (!response.ok || body.success === false) {
      throw new CliError(
        `Cloudflare AI run ${response.status}: ${JSON.stringify(body.errors ?? body).slice(0, 300)}`,
      );
    }
    const outer = body.result;
    if (outer && typeof outer.state === "string" && outer.state !== "Completed") {
      throw new CliError(
        `Cloudflare AI run state ${outer.state}: ${JSON.stringify(body.errors ?? []).slice(0, 300)}`,
      );
    }
    const payload = outer?.result ?? outer ?? body;
    return {
      answers: validateAnswers(questions, payload.answers, payload.model ?? model),
      usage: {
        input_tokens: payload.usage?.input_tokens ?? 0,
        output_tokens: payload.usage?.output_tokens ?? 0,
      },
      provider,
      model: payload.model ?? model,
    };
  };
}

async function fetchWithTimeout(
  fetchImpl: typeof fetch,
  url: string,
  init: RequestInit,
  timeoutMs: number,
  outer?: AbortSignal,
): Promise<Response> {
  const signals = [AbortSignal.timeout(timeoutMs)];
  if (outer) signals.push(outer);
  try {
    return await fetchImpl(url, { ...init, signal: AbortSignal.any(signals) });
  } catch (err) {
    if ((err as Error).name === "TimeoutError")
      throw new CliError(`Request timed out after ${timeoutMs} ms.`);
    throw err;
  }
}
