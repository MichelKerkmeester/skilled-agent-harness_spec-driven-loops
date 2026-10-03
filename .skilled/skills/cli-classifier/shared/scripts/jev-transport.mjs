// ───────────────────────────────────────────────────────────────────
// MODULE: Jev Transport
// ───────────────────────────────────────────────────────────────────
// Answers a jev `choice` question through either the jev CLI or Pi's native
// classifier runtime, whichever the caller's own option or the caller's own
// JEV_TRANSPORT value names. The CLI is the default and the fallback: a Pi
// gate that fails prints exactly one skip line, then the CLI runs, so a caller
// always receives a CLI-shaped outcome and never loses its bytes.
//
// The module never holds, reads, prints or passes a credential. The Pi route
// calls ModelRuntime.create() and lets Pi resolve credentials from its own
// store.
//
// The two `.cjs` callers require this file, so it ships no top-level await and
// reaches the Pi SDK with a lazy import inside the Pi branch only.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const TRANSPORT_ENV = 'JEV_TRANSPORT';
const PI_PROVIDER = 'openrouter';
const PI_MODEL_ID = 'typesafe/jev-1.13';
const PI_PACKAGE_VERSION = '0.99.2';
const ANSWER_NAME = 'answer';
const PI_PACKAGE_NAME = '@earendil-works/pi-coding-agent';
const DEFAULT_TIMEOUT_MS = 30000;
const piRuntimePromises = new Map();
const piPreflightPromises = new Map();
const reportedPiPreflightFailures = new Set();

// One line per failed gate, then the CLI runs. The wording is the caller-visible
// signal that Pi was asked for and did not answer, so only the gate name in it
// changes; the rule around it never does.
function piSkipLine(gate) {
  return `skip: pi transport unavailable (${gate}), using jev CLI`;
}

// ───────────────────────────────────────────────────────────────────
// 3. TRANSPORT SELECTION
// ───────────────────────────────────────────────────────────────────

/**
 * The transport one call uses, from the caller's option and the caller's own
 * environment object. An environment kill switch to the CLI wins; otherwise
 * the option wins over the environment. Only the empty string counts as unset.
 *
 * @param {'jev' | 'pi' | undefined} option Per-call transport option.
 * @param {{ JEV_TRANSPORT?: string } | undefined} env Environment the caller passes to jev.
 * @returns {{ transport: 'jev' | 'pi', line: string | null }} Route plus the unknown-value line, or null when silent.
 */
export function resolveTransport(option, env) {
  const environment = (env ?? {})[TRANSPORT_ENV];
  const requested = environment === 'jev'
    ? 'jev'
    : (option !== undefined && option !== '' ? option : environment);
  if (requested === undefined || requested === '') return { transport: 'jev', line: null };
  if (requested === 'jev') return { transport: 'jev', line: null };
  if (requested === 'pi') return { transport: 'pi', line: null };
  return { transport: 'jev', line: `skip: unknown transport '${requested}', using jev CLI` };
}

// ───────────────────────────────────────────────────────────────────
// 4. REQUEST MAPPING
// ───────────────────────────────────────────────────────────────────

/**
 * The declared `choice` invocation, or null when the arguments are not it. The
 * shape is one `choice` subcommand, one optional provider, one optional
 * question and one or more option pairs; every other flag or subcommand leaves
 * the call on the CLI, because only `choice` has a transport decision to make.
 *
 * @param {string[]} args Arguments the caller would pass to `jev`.
 * @returns {{ provider?: string, question: string, keys: string[], criteria: Record<string, string> } | null} Parsed request, or null.
 */
export function choiceRequestFrom(args) {
  if (!Array.isArray(args) || args[0] !== 'choice') return null;

  let question = '';
  let provider;
  const keys = [];
  const criteria = {};

  for (let index = 1; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--provider') {
      if (index + 1 >= args.length) return null;
      provider = args[index + 1];
      index += 1;
      continue;
    }
    if (token === '-q' || token === '--question') {
      if (index + 1 >= args.length) return null;
      question = args[index + 1];
      index += 1;
      continue;
    }
    if (token === '-o' || token === '--option') {
      if (index + 1 >= args.length) return null;
      const pair = args[index + 1];
      index += 1;
      const separator = pair.indexOf('=');
      // A pair with no `=` carries no key, so it is dropped exactly as the
      // CLI's own criteria reader drops it.
      if (separator === -1) continue;
      const key = pair.slice(0, separator);
      criteria[key] = pair.slice(separator + 1);
      keys.push(key);
      continue;
    }
    return null;
  }

  if (keys.length === 0) return null;
  return { provider, question, keys, criteria };
}

/**
 * Pi's classifier context for one choice request: the stdin state under the
 * request key, and one named question carrying the caller's own instructions
 * and option descriptions. Criteria are rebuilt in submitted-key order, so the
 * model sees the options in the order the CLI would have offered them.
 *
 * @param {{ question: string, keys: string[], criteria: Record<string, string> }} request Parsed choice request.
 * @param {string} stateText State text the caller feeds to jev on stdin.
 * @returns {{ state: { request: string }, questions: Record<string, { type: 'choice', instructions: string, criteria: Record<string, string> }> }} Context for `classify()`.
 */
export function classifierContextFor(request, stateText) {
  const criteria = {};
  for (const key of request.keys) criteria[key] = request.criteria[key];
  return {
    state: { request: stateText },
    questions: {
      [ANSWER_NAME]: { type: 'choice', instructions: request.question, criteria },
    },
  };
}

/**
 * The CLI-shaped payload for one classifier answer, or null when the answer
 * cannot be read as a choice over the submitted keys. Every submitted key must
 * hold a finite number, so a partial map stays unmeasured instead of entering
 * a reader as a missing key, and the pick must be one of the submitted keys.
 *
 * @param {object} answer Classifier result from `classify()`.
 * @param {string[]} keys Option keys that were submitted.
 * @param {string} model Model id the Pi route called.
 * @returns {{ answers: Record<string, object>, model: string } | null} The payload the CLI would have printed, or null.
 */
export function choicePayloadFor(answer, keys, model) {
  const picked = answer?.answers?.[ANSWER_NAME];
  if (picked === null || typeof picked !== 'object' || Array.isArray(picked)) return null;

  const probabilities = picked.probabilities;
  if (probabilities === null || typeof probabilities !== 'object' || Array.isArray(probabilities)) return null;
  if (!keys.includes(picked.choice)) return null;

  const full = {};
  for (const key of keys) {
    const value = probabilities[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    full[key] = value;
  }

  return {
    answers: {
      [ANSWER_NAME]: { choice: picked.choice, probabilities: full, confidence: picked.confidence },
    },
    model,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. PI BACKEND
// ───────────────────────────────────────────────────────────────────

// The package lookup, the criteria reader, the context builder and the
// probability rule are ports of the Pi transport scorer's helpers rather than
// imports: the scorer's static import graph reaches a top-level await, so
// requiring it from the `.cjs` callers that need this module fails with
// ERR_REQUIRE_ASYNC_MODULE. Copying keeps this file require-able, and keeps a
// shipped transport off another packet's benchmark tree at runtime.

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 *
 * @param {string} name Executable file name.
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {string | null} First executable match, or null when none is executable.
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Directory and version of the Pi coding-agent package that `pi` resolves to,
 * or null when no `pi` on PATH belongs to that package. The executable sits
 * inside the package's own dist tree, so the climb starts at its directory and
 * keeps going until a manifest names the package.
 *
 * @param {{ PATH?: string }} env Environment whose PATH is searched.
 * @returns {{ packageDir: string, version: string | null } | null} Resolved package, or null.
 */
function resolvePiPackage(env) {
  const found = which('pi', env);
  if (found === null) return null;

  let dir;
  try {
    dir = path.dirname(fs.realpathSync(found));
  } catch {
    return null;
  }

  for (;;) {
    // A manifest that is absent or unparseable says nothing about the executable's
    // package, so the climb continues past it.
    try {
      const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      if (manifest.name === PI_PACKAGE_NAME) {
        return { packageDir: dir, version: typeof manifest.version === 'string' ? manifest.version : null };
      }
    } catch {
      // Keep climbing.
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// The runtime is imported from the package `pi` resolves to, so the transport
// acts on the install the caller's PATH names rather than on a copy this module
// might be run with. create() takes no options: credentials stay in Pi's own
// store, and this module never holds one.
async function createPiRuntime(packageDir) {
  const entry = pathToFileURL(path.join(packageDir, 'dist', 'index.js'));
  const { ModelRuntime } = await import(entry.href);
  return ModelRuntime.create();
}

function getCachedPiRuntime(packageDir, createRuntime) {
  let runtimePromise = piRuntimePromises.get(packageDir);
  if (runtimePromise === undefined) {
    runtimePromise = Promise.resolve().then(() => createRuntime(packageDir));
    piRuntimePromises.set(packageDir, runtimePromise);
  }
  return runtimePromise;
}

async function getPiPreflight(env, deps) {
  const pathKey = env.PATH ?? '';
  let preflightPromise = piPreflightPromises.get(pathKey);
  if (preflightPromise === undefined) {
    preflightPromise = (async () => {
      const pi = resolvePiPackage(env);
      if (pi === null) return { gate: 'package' };
      if (pi.version !== PI_PACKAGE_VERSION) return { gate: 'version' };

      const runtime = deps.runtime ?? await getCachedPiRuntime(
        pi.packageDir,
        deps.createRuntime ?? createPiRuntime,
      );
      const model = runtime.getModelOfType('classifier', PI_PROVIDER, PI_MODEL_ID);
      if (model === undefined) return { gate: 'model' };

      let available = [];
      try {
        available = await runtime.getAvailableOfType('classifier', PI_PROVIDER);
      } catch {
        available = [];
      }
      if (!Array.isArray(available) || !available.some((entry) => entry?.id === PI_MODEL_ID)) {
        return { gate: 'credential' };
      }
      return { gate: null, pi, runtime, model };
    })().catch(() => ({ gate: 'package' }));
    piPreflightPromises.set(pathKey, preflightPromise);
  }
  return preflightPromise;
}

function reportPiPreflightFailureOnce(env, gate, report) {
  const pathKey = env.PATH ?? '';
  if (reportedPiPreflightFailures.has(pathKey)) return;
  reportedPiPreflightFailures.add(pathKey);
  report(piSkipLine(gate));
}

function promiseWithinTimeout(operation, timeoutMs, onTimeout) {
  let timer;
  const operationPromise = Promise.resolve().then(operation);
  const timeoutPromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      onTimeout?.();
      const error = new Error('Pi transport timed out');
      error.code = 'ETIMEDOUT';
      reject(error);
    }, Math.max(0, timeoutMs));
  });
  return Promise.race([operationPromise, timeoutPromise]).finally(() => clearTimeout(timer));
}

// ───────────────────────────────────────────────────────────────────
// 6. CALL SPAWN
// ───────────────────────────────────────────────────────────────────

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the local client reads stdin to EOF and exits 2 on an
 * inherited terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {{ file: string, args: string[], stdin: string, env?: object, timeoutMs: number }} options Call description.
 * @param {Function} spawnFn Child spawner, so a test can drive the outcome.
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} The call outcome.
 */
function spawnCli(options, spawnFn) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawnFn(options.file, options.args, {
      env: options.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(options.stdin);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, options.timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

async function spawnCliWithinBudget(options, spawnFn, startedAt, timeoutMs) {
  const elapsed = Date.now() - startedAt;
  const remaining = timeoutMs - elapsed;
  if (remaining <= 0) {
    return { code: null, stdout: '', stderr: '', wallMs: elapsed, timedOut: true };
  }
  const result = await spawnCli({ ...options, timeoutMs: remaining }, spawnFn);
  return { ...result, wallMs: Date.now() - startedAt };
}

/**
 * One bounded call that reaches the CLI or, when the switch names it and the
 * request is a supported choice, Pi. Pi preflight is cached per process and
 * only its first failure is reported; any CLI fallback receives the remaining
 * call budget. The returned shape is the caller's own spawn contract.
 *
 * @param {{ file: string, args: string[], stdin: string, env?: object, timeoutMs: number, transport?: 'jev' | 'pi', report?: (line: string) => void }} options Call description.
 * @param {{ spawn?: Function, runtime?: object, createRuntime?: (packageDir: string) => Promise<object> | object }} [deps] Test seams for the child spawn and classifier runtime.
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} The call outcome.
 */
export async function spawnClassifierCall(options, deps = {}) {
  const env = options.env ?? {};
  const report = options.report ?? ((line) => process.stdout.write(`${line}\n`));
  const spawnFn = deps.spawn ?? spawn;
  const timeoutMs = Number.isFinite(options.timeoutMs)
    ? Math.max(0, options.timeoutMs)
    : DEFAULT_TIMEOUT_MS;
  const startedAt = Date.now();
  const cli = () => spawnCliWithinBudget(options, spawnFn, startedAt, timeoutMs);

  // Only a choice request has a transport decision to make, so every other
  // invocation is spawned on the CLI unchanged and prints nothing.
  const request = choiceRequestFrom(options.args);
  if (request === null) return cli();
  const effectiveProvider = request.provider ?? env.JEV_PROVIDER ?? 'official';
  if (effectiveProvider !== PI_PROVIDER) return cli();

  const route = resolveTransport(options.transport, env);
  if (route.line !== null) report(route.line);
  if (route.transport !== 'pi') return cli();

  let preflight;
  try {
    const remaining = timeoutMs - (Date.now() - startedAt);
    if (remaining <= 0) return cli();
    preflight = await promiseWithinTimeout(() => getPiPreflight(env, deps), remaining);
  } catch {
    reportPiPreflightFailureOnce(env, 'backend', report);
    return cli();
  }
  if (preflight.gate !== null) {
    reportPiPreflightFailureOnce(env, preflight.gate, report);
    return cli();
  }

  const context = classifierContextFor(request, options.stdin ?? '');
  const remaining = timeoutMs - (Date.now() - startedAt);
  if (remaining <= 0) return cli();
  const controller = new AbortController();
  let result;
  try {
    result = await promiseWithinTimeout(
      () => preflight.runtime.classify(preflight.model, context, { signal: controller.signal }),
      remaining,
      () => controller.abort(),
    );
  } catch {
    report(piSkipLine('backend'));
    return cli();
  }
  const wallMs = Date.now() - startedAt;

  if (result?.stopReason === 'error') {
    report(piSkipLine('backend'));
    return cli();
  }

  const payload = choicePayloadFor(result, request.keys, PI_MODEL_ID);
  if (payload === null) {
    report(piSkipLine('backend'));
    return cli();
  }

  return { code: 0, stdout: `${JSON.stringify(payload)}\n`, stderr: '', wallMs, timedOut: false };
}
