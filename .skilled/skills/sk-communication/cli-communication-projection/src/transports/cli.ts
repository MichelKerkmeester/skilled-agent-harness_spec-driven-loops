// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Provider Transport
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';

import type {
  ProviderTransport,
  ProviderWireRequest,
  ProviderWireResponse,
} from '../providers/types.js';

const PROVIDER_ID_PREFIX = 'external-cli-';

/** One CLI dispatch derived from a provider wire request. */
export interface CliInvocation {
  readonly engine: string;
  readonly model: string;
  readonly systemInstruction: string;
  readonly userText: string;
  readonly signal: AbortSignal;
}

/** Content-only CLI result; a non-ok status maps to the exact-original fallback. */
export interface CliResult {
  readonly status: 'ok' | 'error';
  readonly text: string;
}

/** Injected subprocess boundary satisfied by the child-process runner or a test double. */
export type CliRunner = (invocation: CliInvocation) => Promise<CliResult>;

/** Options for the external-cli provider transport. */
export interface ExternalCliTransportOptions {
  readonly runner: CliRunner;
  readonly resolveEngine?: (request: ProviderWireRequest) => string | null;
}

/**
 * Transport that routes a provider wire request to a CLI subprocess and returns
 * the rewrite as an OpenAI-chat-shaped response, so the external-cli family flows
 * through the same executor, fidelity validation, and exact-original fallback as
 * every other provider. Any dispatch failure returns a non-2xx response, which
 * the shared adapter parses as a failure and the executor maps to the original.
 */
export function createExternalCliTransport(
  options: ExternalCliTransportOptions,
): ProviderTransport {
  const resolveEngine = options.resolveEngine ?? defaultResolveEngine;
  return async (request: ProviderWireRequest): Promise<ProviderWireResponse> => {
    const engine = resolveEngine(request);
    const messages = extractMessages(request.body);
    if (engine === null || messages === null) {
      return { status: 400, body: null };
    }
    if (request.signal.aborted) {
      return { status: 499, body: null };
    }
    let result: CliResult;
    try {
      result = await options.runner({
        engine,
        model: request.modelId,
        systemInstruction: messages.system,
        userText: messages.user,
        signal: request.signal,
      });
    } catch {
      return { status: 502, body: null };
    }
    if (result.status !== 'ok' || result.text.trim().length === 0) {
      return { status: 502, body: null };
    }
    return {
      status: 200,
      body: { choices: [{ finish_reason: 'stop', message: { content: result.text } }] },
    };
  };
}

/** Resolve the engine from the `external-cli-<engine>` provider id. */
function defaultResolveEngine(request: ProviderWireRequest): string | null {
  const id = request.providerId;
  if (!id.startsWith(PROVIDER_ID_PREFIX)) {
    return null;
  }
  const engine = id.slice(PROVIDER_ID_PREFIX.length);
  return engine.length > 0 ? engine : null;
}

interface CliMessages {
  readonly system: string;
  readonly user: string;
}

/** Pull the system and user content out of the compiled OpenAI-chat body. */
function extractMessages(body: unknown): CliMessages | null {
  if (typeof body !== 'object' || body === null) {
    return null;
  }
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages)) {
    return null;
  }
  let system = '';
  let user: string | null = null;
  for (const entry of messages) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const role = (entry as { role?: unknown }).role;
    const content = (entry as { content?: unknown }).content;
    if (typeof content !== 'string') {
      continue;
    }
    if (role === 'system') {
      system = content;
    } else if (role === 'user') {
      user = content;
    }
  }
  return user === null ? null : { system, user };
}

// ───────────────────────────────────────────────────────────────────
// Generic child-process runner
// ───────────────────────────────────────────────────────────────────

/** Command an engine dispatch resolves to; the prompt is delivered by stdin or as the final argument. */
export interface CliCommandSpec {
  readonly command: string;
  readonly args: readonly string[];
  readonly input: 'stdin' | 'prompt-arg';
  readonly env?: Readonly<Record<string, string>>;
}

/** Map an engine and model to a concrete command, or null when the engine is unknown. */
export type CliCommandResolver = (engine: string, model: string) => CliCommandSpec | null;

/** Fully resolved subprocess request handed to the spawn boundary. */
export interface SpawnRequest {
  readonly command: string;
  readonly args: readonly string[];
  readonly env: Readonly<Record<string, string>>;
  readonly input: string | null;
  readonly signal: AbortSignal;
  readonly timeoutMs: number;
}

/** Content-free subprocess outcome. */
export interface SpawnOutcome {
  readonly code: number | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly timedOut: boolean;
}

/** Injected process boundary satisfied by the default child-process spawn or a test double. */
export type SpawnImpl = (request: SpawnRequest) => Promise<SpawnOutcome>;

/** Options for the child-process CLI runner. */
export interface ChildProcessCliRunnerOptions {
  readonly resolveCommand: CliCommandResolver;
  readonly spawnImpl?: SpawnImpl;
  readonly composePrompt?: (invocation: CliInvocation) => string;
  readonly timeoutMs?: number;
}

/**
 * Build a CLI runner that dispatches through a subprocess. The per-engine command
 * mapping is supplied by the caller because it depends on which CLI binaries are
 * installed and authenticated locally, and the process boundary is injected so
 * argv construction, timeout, and stdout capture are exercised without a live CLI.
 */
export function createChildProcessCliRunner(
  options: ChildProcessCliRunnerOptions,
): CliRunner {
  const spawnImpl = options.spawnImpl ?? defaultChildProcessSpawn;
  const compose = options.composePrompt ?? defaultComposePrompt;
  const timeoutMs = options.timeoutMs ?? 120_000;
  return async (invocation: CliInvocation): Promise<CliResult> => {
    const spec = options.resolveCommand(invocation.engine, invocation.model);
    if (spec === null) {
      return { status: 'error', text: '' };
    }
    const prompt = compose(invocation);
    const args = spec.input === 'prompt-arg' ? [...spec.args, prompt] : [...spec.args];
    try {
      const outcome = await spawnImpl({
        command: spec.command,
        args,
        env: spec.env ? { ...spec.env } : {},
        input: spec.input === 'stdin' ? prompt : null,
        signal: invocation.signal,
        timeoutMs,
      });
      if (outcome.timedOut || outcome.code !== 0) {
        return { status: 'error', text: '' };
      }
      return { status: 'ok', text: outcome.stdout };
    } catch {
      return { status: 'error', text: '' };
    }
  };
}

/** Compose a single prompt string from the system instruction and user text. */
export function defaultComposePrompt(invocation: CliInvocation): string {
  const system = invocation.systemInstruction.trim();
  return system.length > 0 ? `${system}\n\n${invocation.userText}` : invocation.userText;
}

/** Default process boundary; kept thin so the runner logic above stays testable. */
export const defaultChildProcessSpawn: SpawnImpl = (request) =>
  new Promise<SpawnOutcome>((resolve) => {
    // Run the CLI as its own process-group leader. A rewrite tool may fork
    // background helpers (a model server, a language server); killing only the
    // direct child would orphan those and leave them running — and, because a
    // helper inherits the stdout pipe, keep the parent from ever seeing close.
    const child = spawn(request.command, [...request.args], {
      env: { ...process.env, ...request.env },
      detached: true,
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const killTree = (): void => {
      const pid = child.pid;
      if (pid === undefined) {
        return;
      }
      try {
        // A negative pid signals the whole group on POSIX; where process groups
        // are unavailable, fall back to the direct child.
        if (process.platform === 'win32') {
          child.kill('SIGKILL');
        } else {
          process.kill(-pid, 'SIGKILL');
        }
      } catch {
        // The group is already gone; nothing left to signal.
      }
    };

    const timer = setTimeout(() => {
      timedOut = true;
      killTree();
    }, request.timeoutMs);
    const onAbort = (): void => killTree();
    const finish = (outcome: SpawnOutcome): void => {
      clearTimeout(timer);
      request.signal.removeEventListener('abort', onAbort);
      resolve(outcome);
    };

    if (request.signal.aborted) {
      killTree();
    } else {
      request.signal.addEventListener('abort', onAbort, { once: true });
    }

    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    child.on('error', () => {
      finish({ code: null, stdout, stderr, timedOut });
    });
    child.on('close', (code) => {
      finish({ code, stdout, stderr, timedOut });
    });
    // Always close stdin — writing the prompt first when it is delivered that
    // way — so a prompt-arg engine that still reads stdin (opencode in
    // particular) receives EOF instead of blocking forever on an open pipe.
    if (request.input !== null) {
      child.stdin?.write(request.input);
    }
    child.stdin?.end();
  });
