// ───────────────────────────────────────────────────────────────────
// MODULE: Jev Transport
// ───────────────────────────────────────────────────────────────────
// Answers a jev `choice` or `noul` question through Pi's native classifier
// runtime when its preflight passes, and through the jev CLI otherwise. A call
// that asks for Pi by name gets one skip line when Pi cannot answer; automatic
// fallback stays quiet so the default route does not add output to the caller.
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
const PI_CLASSIFIERS = new Map([
  ['official', { provider: 'typesafe', model: 'jev-latest' }],
  ['openrouter', { provider: 'openrouter', model: 'typesafe/jev-1.13' }],
]);
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
 * the option wins over the environment. No selection means try Pi automatically.
 *
 * @param {'jev' | 'pi' | undefined} option Per-call transport option.
 * @param {{ JEV_TRANSPORT?: string } | undefined} env Environment the caller passes to jev.
 * @returns {{ transport: 'auto' | 'jev' | 'pi', line: string | null }} Route plus the unknown-value line, or null when silent.
 */
export function resolveTransport(option, env) {
  const environment = (env ?? {})[TRANSPORT_ENV];
  const requested = environment === 'jev'
    ? 'jev'
    : (option !== undefined && option !== '' ? option : environment);
  if (requested === undefined || requested === '') return { transport: 'auto', line: null };
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
 * A supported `noul` invocation, or null when its arguments are not limited to
 * the question and optional provider. State remains on stdin for either route.
 *
 * @param {string[]} args Arguments the caller would pass to `jev`.
 * @returns {{ type: 'noul', provider?: string, question: string } | null} Parsed request, or null.
 */
export function noulRequestFrom(args) {
  if (!Array.isArray(args) || args[0] !== 'noul') return null;

  let question = '';
  let hasQuestion = false;
  let provider;
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
      hasQuestion = true;
      index += 1;
      continue;
    }
    return null;
  }

  if (!hasQuestion) return null;
  return { type: 'noul', ...(provider === undefined ? {} : { provider }), question };
}

/**
 * Pi's classifier context for one choice or yes/no request. It keeps stdin
 * under the `text` key, preserves choice criteria order, and uses Pi's public
 * `bool` question type for yes/no requests. Pi takes a JSON object as state
 * where the CLI sends the bare string; a neutral key keeps Pi's answers
 * closest to the CLI's.
 *
 * @param {{ question: string, keys: string[], criteria: Record<string, string> } | { type: 'noul', question: string }} request Parsed choice or noul request.
 * @param {string} stateText State text the caller feeds to jev on stdin.
 * @returns {{ state: { text: string }, questions: Record<string, { type: 'choice', instructions: string, criteria: Record<string, string> } | { type: 'bool', instructions: string }> }} Context for `classify()`.
 */
export function classifierContextFor(request, stateText) {
  if (request.type === 'noul') {
    return {
      state: { text: stateText },
      questions: {
        [ANSWER_NAME]: { type: 'bool', instructions: request.question },
      },
    };
  }

  const criteria = {};
  for (const key of request.keys) criteria[key] = request.criteria[key];
  return {
    state: { text: stateText },
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

/**
 * The CLI-shaped payload for one yes/no classifier answer, or null when its
 * result does not carry a finite probability in the range a probability allows.
 *
 * @param {object} answer Result from Pi's classifier runtime.
 * @param {string} model Model id the Pi route called.
 * @returns {{ answers: { answer: { noul: number } }, model: string } | null} The CLI payload, or null.
 */
export function noulPayloadFor(answer, model) {
  const picked = answer?.answers?.[ANSWER_NAME];
  if (picked === null || typeof picked !== 'object' || Array.isArray(picked)) return null;
  if (picked.type !== 'bool') return null;

  const probability = picked.probability;
  if (typeof probability !== 'number' || !Number.isFinite(probability) || probability < 0 || probability > 1) return null;

  return {
    answers: { [ANSWER_NAME]: { noul: probability } },
    model,
  };
}

/**
 * The CLI-shaped token counts for one Pi answer, or null when Pi reported none.
 * Both counts must be finite numbers: a reported half would enter a reader as a
 * missing number, so a partial report is dropped rather than printed.
 *
 * @param {{ input?: number, output?: number } | undefined} usage Usage Pi returned with the answer.
 * @returns {{ input_tokens: number, output_tokens: number } | null} Printed token counts, or null.
 */
export function usagePayloadFor(usage) {
  if (usage === null || typeof usage !== 'object') return null;

  const input = usage.input;
  const output = usage.output;
  if (typeof input !== 'number' || !Number.isFinite(input)) return null;
  if (typeof output !== 'number' || !Number.isFinite(output)) return null;

  return { input_tokens: input, output_tokens: output };
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

async function getPiPreflight(env, deps, jevProvider, classifier) {
  const pathKey = env.PATH ?? '';
  const preflightKey = JSON.stringify([pathKey, jevProvider]);
  let preflightPromise = piPreflightPromises.get(preflightKey);
  if (preflightPromise === undefined) {
    preflightPromise = (async () => {
      const pi = resolvePiPackage(env);
      if (pi === null) return { gate: 'package' };
      if (pi.version !== PI_PACKAGE_VERSION) return { gate: 'version' };

      const runtime = deps.runtime ?? await getCachedPiRuntime(
        pi.packageDir,
        deps.createRuntime ?? createPiRuntime,
      );
      const model = runtime.getModelOfType('classifier', classifier.provider, classifier.model);
      if (model === undefined) return { gate: 'model' };

      let available = [];
      try {
        available = await runtime.getAvailableOfType('classifier', classifier.provider);
      } catch {
        available = [];
      }
      if (!Array.isArray(available) || !available.some((entry) => entry?.id === classifier.model)) {
        return { gate: 'credential' };
      }
      return { gate: null, pi, runtime, model };
    })().catch(() => ({ gate: 'package' }));
    piPreflightPromises.set(preflightKey, preflightPromise);
  }
  return preflightPromise;
}

function reportPiPreflightFailureOnce(env, jevProvider, gate, report) {
  const failureKey = JSON.stringify([env.PATH ?? '', jevProvider]);
  if (reportedPiPreflightFailures.has(failureKey)) return;
  reportedPiPreflightFailures.add(failureKey);
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
 * The model named in the JSON a CLI call printed, or null when that text is not
 * an object carrying a string `model`. Unparseable text and a result without the
 * field both name nothing, so both read as null.
 *
 * @param {string} stdout Text the CLI printed.
 * @returns {string | null} The printed model, or null when none can be named.
 */
export function cliModelFrom(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== 'object') return null;
  return typeof parsed.model === 'string' ? parsed.model : null;
}

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
 * One bounded call that reaches the CLI or, when Pi's cached preflight passes
 * for a supported request, Pi. Only an explicit Pi route reports a failed gate;
 * every CLI fallback receives the remaining call budget.
 *
 * @param {{ file: string, args: string[], stdin: string, env?: object, timeoutMs: number, transport?: 'jev' | 'pi', report?: (line: string) => void }} options Call description.
 * @param {{ spawn?: Function, runtime?: object, createRuntime?: (packageDir: string) => Promise<object> | object }} [deps] Test seams for the child spawn and classifier runtime.
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean, transport: 'pi' | 'jev', model: string | null }>} The call outcome.
 */
export async function spawnClassifierCall(options, deps = {}) {
  const env = options.env ?? {};
  const report = options.report ?? ((line) => process.stdout.write(`${line}\n`));
  const spawnFn = deps.spawn ?? spawn;
  const timeoutMs = Number.isFinite(options.timeoutMs)
    ? Math.max(0, options.timeoutMs)
    : DEFAULT_TIMEOUT_MS;
  const startedAt = Date.now();
  // The CLI prints the service's own result, so the model that result names is
  // the one the service answered with.
  const cli = async () => {
    const outcome = await spawnCliWithinBudget(options, spawnFn, startedAt, timeoutMs);
    return { ...outcome, transport: 'jev', model: cliModelFrom(outcome.stdout) };
  };

  // Only supported classifier requests can use Pi. Other invocations run on
  // the CLI unchanged, which remains the authority for their behavior.
  const request = choiceRequestFrom(options.args) ?? noulRequestFrom(options.args);
  if (request === null) return cli();
  const effectiveProvider = request.provider ?? env.JEV_PROVIDER ?? 'official';
  const classifier = PI_CLASSIFIERS.get(effectiveProvider);
  if (classifier === undefined) return cli();

  const route = resolveTransport(options.transport, env);
  if (route.line !== null) report(route.line);
  if (route.transport === 'jev') return cli();

  let preflight;
  try {
    const remaining = timeoutMs - (Date.now() - startedAt);
    if (remaining <= 0) return cli();
    preflight = await promiseWithinTimeout(
      () => getPiPreflight(env, deps, effectiveProvider, classifier),
      remaining,
    );
  } catch {
    if (route.transport === 'pi') reportPiPreflightFailureOnce(env, effectiveProvider, 'backend', report);
    return cli();
  }
  if (preflight.gate !== null) {
    if (route.transport === 'pi') reportPiPreflightFailureOnce(env, effectiveProvider, preflight.gate, report);
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
    if (route.transport === 'pi') report(piSkipLine('backend'));
    return cli();
  }
  const wallMs = Date.now() - startedAt;

  if (result?.stopReason === 'error') {
    if (route.transport === 'pi') report(piSkipLine('backend'));
    return cli();
  }

  const payload = request.type === 'noul'
    ? noulPayloadFor(result, classifier.model)
    : choicePayloadFor(result, request.keys, classifier.model);
  if (payload === null) {
    if (route.transport === 'pi') report(piSkipLine('backend'));
    return cli();
  }

  // The counts ride the payload the caller already reads. The outcome names Pi's
  // provider with its model, while the payload's own `model` key keeps the bare
  // classifier id it has always printed, so a reader keyed on it is unaffected.
  const usage = usagePayloadFor(result?.usage);
  if (usage !== null) payload.usage = usage;
  const answeredProvider = typeof result?.provider === 'string' ? result.provider : classifier.provider;
  const answeredModel = typeof result?.model === 'string' ? result.model : classifier.model;

  return {
    code: 0,
    stdout: `${JSON.stringify(payload)}\n`,
    stderr: '',
    wallMs,
    timedOut: false,
    transport: 'pi',
    model: `${answeredProvider}/${answeredModel}`,
  };
}
