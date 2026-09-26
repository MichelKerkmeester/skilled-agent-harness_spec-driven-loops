// Routing: pick a handler for a request and fill its closed-set arguments in
// one call. Argument questions for every handler are asked speculatively in the
// same request; code reads only the chosen handler's answers.
// Patterns: function_calling and intent-routing.

import { choice, noul, score } from "@typesafe-ai/sdk";
import { z } from "zod";
import { formatZodError } from "../config.js";
import { sanitizeId } from "../lib.js";
import type { AskFn, Usage } from "../provider.js";

const entry = z.union([z.string(), z.null()]);

const argSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("choice"),
    instructions: z.string().optional(),
    options: z.union([z.array(z.string().min(1)).min(2), z.record(z.string().min(1), entry)]),
  }),
  z.object({ type: z.literal("noul"), instructions: z.string() }),
  z.object({
    type: z.literal("score"),
    instructions: z.string().optional(),
    levels: z.array(z.string()).min(2),
  }),
]);

const handlerSchema = z.object({
  description: z.string().nullable().optional(),
  args: z.record(z.string().regex(/^[A-Za-z0-9_.-]+$/), argSchema).optional(),
});

export const handlersSchema = z.record(z.string().min(1), z.union([handlerSchema, z.string(), z.null()]));

export type ArgSpec = z.infer<typeof argSchema>;
export interface HandlerSpec {
  description: string | null;
  args: Record<string, ArgSpec>;
}
export type Handlers = Record<string, HandlerSpec>;

export const NONE_HANDLER = "none";

/** Accept `{name: "description"}`, `{name: null}`, or `{name: {description, args}}`. */
export function parseHandlers(input: unknown): Handlers {
  const result = handlersSchema.safeParse(input);
  if (!result.success) throw new Error(`Invalid handlers: ${formatZodError(result.error)}`);
  const out: Handlers = {};
  for (const [name, spec] of Object.entries(result.data)) {
    if (name === NONE_HANDLER) throw new Error(`"${NONE_HANDLER}" is reserved; rename that handler.`);
    if (!sanitizeId(name) || sanitizeId(name) !== name) {
      throw new Error(`Handler name "${name}" must use only letters, digits, _, -, or . (no spaces).`);
    }
    if (spec === null || typeof spec === "string") out[name] = { description: spec, args: {} };
    else out[name] = { description: spec.description ?? null, args: spec.args ?? {} };
  }
  if (Object.keys(out).length === 0) throw new Error("At least one handler is required.");
  return out;
}

/** Parse the `a:description,b,c:description` shorthand. */
export function parseHandlerList(raw: string): Handlers {
  const out: Handlers = {};
  for (const part of raw
    .split(/(?<!\\),/)
    .map((s) => s.replace(/\\,/g, ",").trim())
    .filter(Boolean)) {
    const colon = part.indexOf(":");
    const name = (colon === -1 ? part : part.slice(0, colon)).trim();
    const description = colon === -1 ? null : part.slice(colon + 1).trim() || null;
    out[name] = { description, args: {} };
  }
  return parseHandlers(
    Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { description: v.description }])),
  );
}

export interface RouteInput {
  request: unknown;
  handlers: Handlers;
  instructions?: string;
  minConfidence: number;
}

export interface RoutedArg {
  type: ArgSpec["type"];
  value: string | number | null;
  probability?: number;
  confidence?: number;
  probabilities?: Record<string, number>;
}

export interface RouteOutput {
  command: "route";
  model: string;
  provider: string;
  handler: string | null;
  confidence: number | null;
  action: "auto" | "review" | "none";
  probabilities: Record<string, number>;
  args: Record<string, RoutedArg>;
  min_confidence: number;
  usage: Usage;
}

function argKey(handler: string, arg: string) {
  return `arg__${handler}__${arg}`;
}

export function buildRouteRequest(input: Pick<RouteInput, "request" | "handlers" | "instructions">) {
  const criteria: Record<string, string | null> = Object.fromEntries(
    Object.entries(input.handlers).map(([name, h]) => [name, h.description]),
  );
  criteria[NONE_HANDLER] = "None of the handlers applies to this request";
  const questions: Record<string, unknown> = {
    handler: choice(input.instructions ?? "Which handler should process this request?", criteria),
  };
  for (const [name, h] of Object.entries(input.handlers)) {
    for (const [arg, spec] of Object.entries(h.args)) {
      const premise = `Assuming the request should be handled by \`${name}\``;
      if (spec.type === "choice") {
        const options = Array.isArray(spec.options)
          ? Object.fromEntries(spec.options.map((o) => [o, null]))
          : spec.options;
        questions[argKey(name, arg)] = choice(
          `${premise}: ${spec.instructions ?? `which value should the argument \`${arg}\` take?`}`,
          { ...options, unspecified: "The request does not say" },
        );
      } else if (spec.type === "noul") {
        questions[argKey(name, arg)] = noul(`${premise}: ${spec.instructions}`);
      } else {
        questions[argKey(name, arg)] = score(
          `${premise}: ${spec.instructions ?? `how should the argument \`${arg}\` be rated?`}`,
          spec.levels as unknown as [string, string, ...string[]],
        );
      }
    }
  }
  return { state: input.request, questions };
}

export async function runRoute(ask: AskFn, input: RouteInput): Promise<RouteOutput> {
  const { state, questions } = buildRouteRequest(input);
  const { answers, usage, provider, model } = await ask(state, questions);
  const h = answers.handler;
  const chosen: string | undefined = h?.choice;
  const confidence: number | null = typeof h?.confidence === "number" ? h.confidence : null;
  const probabilities: Record<string, number> = h?.probabilities ?? {};

  const args: Record<string, RoutedArg> = {};
  if (chosen && chosen !== NONE_HANDLER && input.handlers[chosen]) {
    for (const [arg, spec] of Object.entries(input.handlers[chosen].args)) {
      const a = answers[argKey(chosen, arg)];
      if (spec.type === "noul") {
        const p = typeof a?.noul === "number" ? a.noul : null;
        args[arg] = {
          type: "noul",
          value: p === null ? null : p >= 0.5 ? "yes" : "no",
          probability: p ?? undefined,
        };
      } else if (spec.type === "choice") {
        const v: string | undefined = a?.choice;
        args[arg] = {
          type: "choice",
          value: v === undefined || v === "unspecified" ? null : v,
          confidence: typeof a?.confidence === "number" ? a.confidence : undefined,
          probabilities: a?.probabilities ?? undefined,
        };
      } else {
        args[arg] = {
          type: "score",
          value: typeof a?.score === "number" ? Number(a.score.toFixed(4)) : null,
          confidence: typeof a?.confidence === "number" ? a.confidence : undefined,
          probabilities: a?.probabilities ?? undefined,
        };
      }
    }
  }

  const handler = chosen === undefined || chosen === NONE_HANDLER ? null : chosen;
  return {
    command: "route",
    model,
    provider,
    handler,
    confidence,
    action:
      handler === null
        ? "none"
        : confidence !== null && confidence >= input.minConfidence
          ? "auto"
          : "review",
    probabilities,
    args,
    min_confidence: input.minConfidence,
    usage,
  };
}

export const ROUTE_FAIL_CONDITIONS = ["review", "unrouted"] as const;
export type RouteFailCondition = (typeof ROUTE_FAIL_CONDITIONS)[number];

export function routeFailed(out: RouteOutput, conditions: readonly RouteFailCondition[]): boolean {
  return (
    (conditions.includes("review") && out.action === "review") ||
    (conditions.includes("unrouted") && out.action === "none")
  );
}
