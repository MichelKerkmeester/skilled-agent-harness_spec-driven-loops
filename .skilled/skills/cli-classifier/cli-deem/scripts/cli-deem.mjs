#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ cli-deem                                                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// ───────────────────────────────────────────────────────────────────
// MODULE: cli-deem
// ───────────────────────────────────────────────────────────────────
// Local Deem client. health reads GET /health, refuses a stub backend or a
// model other than the pin, then prints the checkpoint and source commits.
// noul, choice, and score POST one question. run POSTs a batch already written
// in Deem's shape. The client validates and passes through numeric noul and
// score fields, while mapping choice descriptions back to submitted keys.
// Counts are checked before any request, because the server rejects a score
// outside 2 to 10 levels, a choice outside 2 to 26 options and a batch over
// 64 questions.
// It never starts or stops the server.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PINNED_MODEL = 'deem-0.8-v1';
const DEFAULT_URL = 'http://127.0.0.1:8300';
const LOOPBACK_HOSTS = ['127.0.0.1', 'localhost', '[::1]'];
const HEALTH_TIMEOUT_MS = 2000;
const HOOK_TIMEOUT_MS = 500;
const DECISION_TIMEOUT_MS = 60000;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 26;
const MIN_LEVELS = 2;
const MAX_LEVELS = 10;
const MAX_QUESTIONS = 64;
const SUBCOMMANDS = ['health', 'noul', 'choice', 'score', 'run'];

// A hook sets these, and rev-parse would then read the caller repository
// instead of the deem source tree.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_COMMON_DIR',
  'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG',
  'GIT_CONFIG_GLOBAL',
  'GIT_CONFIG_SYSTEM',
  'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE',
  'GIT_CEILING_DIRECTORIES',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Failure the process reports as JSON on stderr.
 * Exit 0 is success. 1 is an unexpected response. 2 is usage or config.
 * 3 is a refused backend or model. 4 is unreachable, a timeout, or HTTP 5xx.
 * 130 is an interrupt.
 */
class CliError extends Error {
  /**
   * @param {string} message - Text printed as the error field
   * @param {number} exitCode - Process exit code
   */
  constructor(message, exitCode) {
    super(message);
    this.name = 'CliError';
    this.exitCode = exitCode;
  }
}

/**
 * Resolve the Deem base URL.
 * @returns {string} URL without a trailing slash
 * @throws {CliError} When CLI_DEEM_URL is not http:// on 127.0.0.1, localhost or [::1]
 */
function baseUrl() {
  const configured = process.env.CLI_DEEM_URL || DEFAULT_URL;
  let parsed;
  try {
    parsed = new URL(configured);
  } catch {
    throw new CliError(
      `CLI_DEEM_URL must be http:// on 127.0.0.1, localhost or [::1], got: ${configured}`,
      2,
    );
  }
  if (parsed.protocol !== 'http:' || !LOOPBACK_HOSTS.includes(parsed.hostname)) {
    throw new CliError(
      `CLI_DEEM_URL must be http:// on 127.0.0.1, localhost or [::1], got: ${configured}`,
      2,
    );
  }
  return configured.replace(/\/+$/, '');
}

/**
 * Resolve the local Deem home directory.
 * @returns {string} CLI_DEEM_HOME or the default under the user home
 */
function deemHome() {
  if (process.env.CLI_DEEM_HOME) {
    return process.env.CLI_DEEM_HOME;
  }
  return path.join(os.homedir(), '.local', 'share', 'deem');
}

/**
 * Copy of the process environment with git directory redirects removed.
 * @returns {NodeJS.ProcessEnv} Environment for the source-commit git command
 */
function gitEnv() {
  const env = { ...process.env };
  for (const key of GIT_ENV_REDIRECTORS) {
    delete env[key];
  }
  return env;
}

/**
 * @param {unknown} value - Parsed JSON value
 * @returns {boolean} True when value is a plain object
 */
function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Backend names the health check will accept.
 * @param {unknown} backend - backend field from the health body
 * @returns {boolean} True for torch, or an ensemble name that is not a stub
 */
function isAcceptedBackend(backend) {
  if (backend === 'torch') {
    return true;
  }
  return typeof backend === 'string'
    && backend.startsWith('ensemble:')
    && !backend.includes('stub');
}

/**
 * Send one JSON request and return the status plus the parsed body.
 * A body that is not JSON yields json null. Each failure rejects once.
 * @param {string} method - HTTP method
 * @param {string} url - Absolute http URL
 * @param {unknown} [body] - JSON body, omitted when undefined
 * @param {number} timeoutMs - Socket timeout
 * @returns {Promise<{ status: number, json: unknown, text: string }>}
 * @throws {CliError} When the server is unreachable, times out, or returns 5xx
 */
function requestJson(method, url, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const agent = new http.Agent({ keepAlive: false });

    /**
     * Resolve or reject the request promise once.
     * @param {Function} handler - resolve or reject
     * @param {unknown} value - Value passed to the handler
     */
    function settle(handler, value) {
      if (settled) {
        return;
      }
      settled = true;
      agent.destroy();
      handler(value);
    }

    const target = new URL(url);
    const headers = {};
    let payload;
    if (body !== undefined) {
      payload = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        protocol: target.protocol,
        // WHATWG URL keeps the brackets on an IPv6 host. http.request needs the bare address.
        hostname: target.hostname.replace(/^\[(.*)\]$/, '$1'),
        port: target.port,
        method,
        path: `${target.pathname}${target.search}`,
        headers,
        agent,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          const status = res.statusCode ?? 0;
          if (status >= 500) {
            settle(reject, new CliError(`Deem HTTP ${status}: ${text}`, 4));
            return;
          }
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {
            json = null;
          }
          settle(resolve, { status, json, text });
        });
        res.on('error', (error) => {
          const detail = error.code || error.message;
          settle(reject, new CliError(`Deem unreachable: ${detail}`, 4));
        });
      },
    );

    req.on('error', (error) => {
      const detail = error.code || error.message;
      settle(reject, new CliError(`Deem unreachable: ${detail}`, 4));
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      settle(reject, new CliError(`Deem timed out after ${timeoutMs} ms`, 4));
    });

    if (payload !== undefined) {
      req.write(payload);
    }
    req.end();
  });
}

/**
 * Parse argv into a subcommand and flag values.
 * @param {string[]} argv - Arguments after the script path
 * @returns {{ subcommand: string, positionals: string[], values: import('node:util').ParsedResults<Record<string, never>>['values'] }}
 * @throws {CliError} On a parse error, a missing subcommand, or an unknown one
 */
function parseCli(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      strict: true,
      options: {
        question: { type: 'string', short: 'q' },
        state: { type: 'string', short: 's' },
        option: { type: 'string', short: 'o', multiple: true },
        level: { type: 'string', short: 'l', multiple: true },
        value: { type: 'boolean' },
        hook: { type: 'boolean' },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new CliError(message, 2);
  }

  const [subcommand, ...positionals] = parsed.positionals;
  if (!subcommand || !SUBCOMMANDS.includes(subcommand)) {
    throw new CliError(
      'usage: cli-deem <health|noul|choice|score|run> [flags]',
      2,
    );
  }

  return {
    subcommand,
    positionals,
    values: parsed.values,
  };
}

/**
 * Print a failure as JSON on stderr and set the process exit code.
 * @param {unknown} error - Caught failure
 */
function reportFailure(error) {
  if (error instanceof CliError) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: error.message })}\n`);
    process.exitCode = error.exitCode;
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${JSON.stringify({ ok: false, error: `unexpected: ${message}` })}\n`);
  process.exitCode = 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check the local Deem server and print one JSON line.
 * @param {object} values - Parsed flags
 * @param {string} [values.question] - Disallowed on health
 * @param {string} [values.state] - Disallowed on health
 * @param {string[]} [values.option] - Disallowed on health
 * @param {string[]} [values.level] - Disallowed on health
 * @param {boolean} [values.value] - Disallowed on health
 * @param {boolean} [values.hook] - Use the shorter hook timeout
 * @returns {Promise<void>}
 * @throws {CliError} When the flags, response, backend, model, or commits fail
 */
async function health(values) {
  if (
    values.question !== undefined
    || values.state !== undefined
    || values.option !== undefined
    || values.level !== undefined
    || values.value === true
  ) {
    throw new CliError('health takes only --hook', 2);
  }

  const timeoutMs = values.hook ? HOOK_TIMEOUT_MS : HEALTH_TIMEOUT_MS;
  const response = await requestJson(
    'GET',
    `${baseUrl()}/health`,
    undefined,
    timeoutMs,
  );
  if (response.status !== 200) {
    throw new CliError(`Deem health HTTP ${response.status}`, 1);
  }
  if (!isPlainObject(response.json) || response.json.status !== 'ok') {
    throw new CliError('unexpected health response', 1);
  }

  const backend = response.json.backend;
  if (!isAcceptedBackend(backend)) {
    throw new CliError(`refused backend: ${backend}`, 3);
  }
  const model = response.json.model;
  if (model !== PINNED_MODEL) {
    throw new CliError(`refused model: ${model}, expected ${PINNED_MODEL}`, 3);
  }

  const home = deemHome();
  const checkpointLink = path.join(home, 'models', 'current');
  let modelCommit;
  try {
    modelCommit = path.basename(fs.readlinkSync(checkpointLink));
  } catch {
    throw new CliError(`missing checkpoint link: ${checkpointLink}`, 2);
  }

  const sourceTree = path.join(home, 'src');
  let sourceCommit;
  try {
    sourceCommit = execFileSync(
      'git',
      ['-C', sourceTree, 'rev-parse', 'HEAD'],
      {
        env: gitEnv(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    ).trim();
  } catch {
    throw new CliError(`missing source tree: ${sourceTree}`, 2);
  }

  process.stdout.write(`${JSON.stringify({
    ok: true,
    backend,
    model,
    model_commit: modelCommit,
    source_commit: sourceCommit,
  })}\n`);
}

/**
 * Read decision state from an argument, an @file, or stdin.
 * A terminal has nothing to read, so that case is a usage error.
 * @param {string | undefined} flag - -s text, @path, '-', or omitted
 * @returns {string} State text
 * @throws {CliError} When a terminal has no state, or the file cannot be read
 */
function readState(flag) {
  if (flag === undefined || flag === '-') {
    if (process.stdin.isTTY) {
      throw new CliError('state is required as an argument, @file, or stdin', 2);
    }
    return fs.readFileSync(0, 'utf8');
  }
  if (flag.startsWith('@')) {
    try {
      return fs.readFileSync(flag.slice(1), 'utf8');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new CliError(`cannot read state file: ${message}`, 2);
    }
  }
  return flag;
}

/**
 * Build one Deem question and, for choice, a map back to the submitted keys.
 * Deem stores option text. The map restores the key the caller passed.
 * @param {string} subcommand - noul, choice, or score
 * @param {object} values - Parsed flags
 * @param {string} [values.question] - Instruction text from -q
 * @param {string[]} [values.option] - KEY=DESCRIPTION pairs from -o
 * @param {string[]} [values.level] - Ordered level labels from -l
 * @returns {{ question: { type: string, instructions: string, options?: string[], levels?: string[] }, keyByDescription: Map<string, string> | null }}
 * @throws {CliError} When -q is missing, a choice option is not KEY=DESCRIPTION,
 *   or an option or level count is out of range
 */
function buildQuestion(subcommand, values) {
  if (values.question === undefined) {
    throw new CliError('missing -q QUESTION', 2);
  }
  if (subcommand !== 'choice' && values.option !== undefined) {
    throw new CliError('-o is only valid with choice', 2);
  }
  if (subcommand !== 'score' && values.level !== undefined) {
    throw new CliError('-l is only valid with score', 2);
  }
  const instructions = values.question;
  if (subcommand === 'noul') {
    return {
      question: { type: 'noul', instructions },
      keyByDescription: null,
    };
  }
  if (subcommand === 'choice') {
    const rawOptions = values.option ?? [];
    if (rawOptions.length === 0) {
      throw new CliError('choice needs at least one -o KEY=DESCRIPTION', 2);
    }
    const options = [];
    const keyByDescription = new Map();
    const seenKeys = new Set();
    for (const raw of rawOptions) {
      const separator = raw.indexOf('=');
      const key = separator === -1 ? '' : raw.slice(0, separator);
      const description = separator === -1 ? '' : raw.slice(separator + 1);
      if (key === '' || description === '') {
        throw new CliError(`expected KEY=DESCRIPTION, got: ${raw}`, 2);
      }
      if (keyByDescription.has(description)) {
        throw new CliError(`duplicate option description: ${description}`, 2);
      }
      if (seenKeys.has(key)) {
        throw new CliError(`duplicate option key: ${key}`, 2);
      }
      seenKeys.add(key);
      options.push(description);
      keyByDescription.set(description, key);
    }
    if (options.length < MIN_OPTIONS) {
      throw new CliError(`choice needs at least ${MIN_OPTIONS} -o options`, 2);
    }
    if (options.length > MAX_OPTIONS) {
      throw new CliError(`choice exceeds the ${MAX_OPTIONS}-option cap (got ${options.length})`, 2);
    }
    return {
      question: { type: 'choice', instructions, options },
      keyByDescription,
    };
  }
  if (subcommand === 'score') {
    const levels = values.level ?? [];
    if (levels.length === 0) {
      throw new CliError('score needs at least one -l DESCRIPTION', 2);
    }
    if (levels.length < MIN_LEVELS || levels.length > MAX_LEVELS) {
      throw new CliError(`score needs ${MIN_LEVELS} to ${MAX_LEVELS} -l levels`, 2);
    }
    return {
      question: { type: 'score', instructions, levels },
      keyByDescription: null,
    };
  }
  throw new CliError(`unexpected response: unsupported type ${subcommand}`, 1);
}

/**
 * POST one systemone body and accept only the pinned model.
 * @param {object} payload - Request body
 * @param {number} timeoutMs - Socket timeout
 * @returns {Promise<object>} Parsed response object
 * @throws {CliError} On a non-200 status, a body without answers, or a wrong model
 */
async function decide(payload, timeoutMs) {
  const response = await requestJson(
    'POST',
    `${baseUrl()}/v1/systemone`,
    payload,
    timeoutMs,
  );
  if (response.status !== 200) {
    throw new CliError(`Deem HTTP ${response.status}: ${response.text}`, 1);
  }
  const json = response.json;
  if (!isPlainObject(json) || !isPlainObject(json.answers)) {
    throw new CliError('unexpected response: no answers object', 1);
  }
  if (json.model !== PINNED_MODEL) {
    throw new CliError(`refused model: ${json.model}, expected ${PINNED_MODEL}`, 3);
  }
  return json;
}

/**
 * Validate one Deem answer and map choice descriptions to submitted keys.
 * @param {unknown} answer - answers.answer from the response
 * @param {{ type: string, levels?: string[] }} question - Question that was sent
 * @param {Map<string, string> | null} keyByDescription - Choice text to submitted key
 * @returns {object} Validated answer, with choice descriptions mapped when required
 * @throws {CliError} When the answer shape does not match the question
 */
function translateAnswer(answer, question, keyByDescription) {
  if (!isPlainObject(answer)) {
    throw new CliError('unexpected response: answer is not an object', 1);
  }
  if (question.type === 'noul') {
    if (
      typeof answer.noul !== 'number'
      || !Number.isFinite(answer.noul)
      || answer.noul < 0
      || answer.noul > 1
    ) {
      throw new CliError('unexpected response: noul is not a number in [0, 1]', 1);
    }
    return answer;
  }
  if (question.type === 'choice') {
    if (keyByDescription === null) {
      return answer;
    }
    if (typeof answer.choice !== 'string' || !keyByDescription.has(answer.choice)) {
      throw new CliError('unexpected response: choice is not a known description', 1);
    }
    const translated = {
      ...answer,
      choice: keyByDescription.get(answer.choice),
    };
    if (answer.probabilities !== undefined) {
      if (!isPlainObject(answer.probabilities)) {
        throw new CliError('unexpected response: probabilities are not an object', 1);
      }
      const probabilities = {};
      for (const [description, probability] of Object.entries(answer.probabilities)) {
        if (!keyByDescription.has(description)) {
          throw new CliError(
            'unexpected response: probability key is not a known description',
            1,
          );
        }
        probabilities[keyByDescription.get(description)] = probability;
      }
      translated.probabilities = probabilities;
    }
    return translated;
  }
  if (question.type === 'score') {
    // The server reads a score's ordered levels from criteria first and levels as the alias.
    const levels = Array.isArray(question.criteria) ? question.criteria : (question.levels ?? []);
    if (
      typeof answer.score !== 'number'
      || !Number.isFinite(answer.score)
      || answer.score < 0
      || answer.score > levels.length - 1
    ) {
      throw new CliError('unexpected response: score is not a number in range', 1);
    }
    return answer;
  }
  throw new CliError(`unexpected response: unsupported type ${question.type}`, 1);
}

/**
 * Ask one question and print the translated answer.
 * --value prints only the primary field. Otherwise the whole response is
 * printed with that one answer rewritten.
 * @param {string} subcommand - noul, choice, or score
 * @param {object} values - Parsed flags
 * @param {string} [values.question] - Instruction text from -q
 * @param {string} [values.state] - State text, @path, or '-'
 * @param {string[]} [values.option] - KEY=DESCRIPTION pairs from -o
 * @param {string[]} [values.level] - Ordered level labels from -l
 * @param {boolean} [values.value] - Print only the primary field
 * @param {boolean} [values.hook] - Use the shorter hook timeout
 * @returns {Promise<void>}
 * @throws {CliError} When the question, state, or response is unusable
 */
async function judge(subcommand, values) {
  const built = buildQuestion(subcommand, values);
  const state = readState(values.state);
  const timeoutMs = values.hook ? HOOK_TIMEOUT_MS : DECISION_TIMEOUT_MS;
  const json = await decide(
    { state, questions: { answer: built.question } },
    timeoutMs,
  );
  if (json.answers.answer === undefined || json.answers.answer === null) {
    throw new CliError('unexpected response: missing answer', 1);
  }
  const translated = translateAnswer(
    json.answers.answer,
    built.question,
    built.keyByDescription,
  );
  if (values.value === true) {
    process.stdout.write(`${translated[subcommand]}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify({
    ...json,
    answers: { answer: translated },
  })}\n`);
}

/**
 * Pair each question spec with the id the response will use.
 * An object is already keyed. A list carries id, or qid when id is absent.
 * @param {unknown} questions - questions field from the request
 * @returns {Array<[string, unknown]>} Id and spec pairs
 * @throws {CliError} When questions is neither an object nor a list
 */
function questionSpecs(questions) {
  if (isPlainObject(questions)) {
    return Object.entries(questions);
  }
  if (Array.isArray(questions)) {
    return questions.map((item) => {
      const id = isPlainObject(item) ? (item.id ?? item.qid) : undefined;
      return [id, item];
    });
  }
  throw new CliError('questions must be an object or a list', 2);
}

/**
 * POST a Deem-shaped batch and print each answer after validation.
 * The server rejects more than 64 questions or 26 choice options, so both
 * are counted before the request. --value is refused because a batch has no
 * single primary value. Choice text is left as the server sent it: this
 * request shape lists options without keys.
 * @param {string[]} positionals - Request path, or '-' for stdin
 * @param {object} values - Parsed flags
 * @param {string} [values.question] - Disallowed on run
 * @param {string} [values.state] - Disallowed on run
 * @param {string[]} [values.option] - Disallowed on run
 * @param {string[]} [values.level] - Disallowed on run
 * @param {boolean} [values.value] - Disallowed on run
 * @param {boolean} [values.hook] - Use the shorter hook timeout
 * @returns {Promise<void>}
 * @throws {CliError} When the request, a cap, or the response is unusable
 */
async function runBatch(positionals, values) {
  if (
    values.question !== undefined
    || values.state !== undefined
    || values.option !== undefined
    || values.level !== undefined
    || values.value === true
  ) {
    throw new CliError('run takes a request file or - and --hook only', 2);
  }
  const source = positionals[0];
  if (source === undefined) {
    throw new CliError('run needs a request file or -', 2);
  }

  let raw;
  if (source === '-') {
    if (process.stdin.isTTY) {
      throw new CliError('request is required as a file or stdin', 2);
    }
    raw = fs.readFileSync(0, 'utf8');
  } else {
    try {
      raw = fs.readFileSync(source, 'utf8');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new CliError(`cannot read request file: ${message}`, 2);
    }
  }

  let request;
  try {
    request = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new CliError(`invalid request JSON: ${message}`, 2);
  }
  if (
    !isPlainObject(request)
    || !Object.hasOwn(request, 'state')
    || !Object.hasOwn(request, 'questions')
  ) {
    throw new CliError('request must be an object containing state and questions', 2);
  }

  const specs = questionSpecs(request.questions);
  if (specs.length > MAX_QUESTIONS) {
    throw new CliError(
      `run exceeds the ${MAX_QUESTIONS}-question cap (got ${specs.length})`,
      2,
    );
  }
  const specById = {};
  for (const [id, spec] of specs) {
    if (
      isPlainObject(spec)
      && spec.type === 'choice'
      && Array.isArray(spec.options)
      && spec.options.length > MAX_OPTIONS
    ) {
      throw new CliError(
        `question ${id} exceeds the ${MAX_OPTIONS}-option cap (got ${spec.options.length})`,
        2,
      );
    }
    specById[id] = spec;
  }

  const json = await decide(
    request,
    values.hook ? HOOK_TIMEOUT_MS : DECISION_TIMEOUT_MS,
  );
  const translated = {};
  for (const [key, answer] of Object.entries(json.answers)) {
    if (!Object.hasOwn(specById, key)) {
      throw new CliError(`unexpected response: unknown question ${key}`, 1);
    }
    translated[key] = translateAnswer(answer, specById[key], null);
  }
  process.stdout.write(`${JSON.stringify({ ...json, answers: translated })}\n`);
}

/**
 * Parse argv, run the subcommand, and map failures to stderr JSON.
 * @returns {Promise<void>}
 */
async function main() {
  process.on('SIGINT', () => {
    process.stderr.write(`${JSON.stringify({ ok: false, error: 'interrupted' })}\n`);
    process.exit(130);
  });

  try {
    const parsed = parseCli(process.argv.slice(2));
    if (parsed.subcommand === 'health') {
      await health(parsed.values);
      return;
    }
    if (
      parsed.subcommand === 'noul'
      || parsed.subcommand === 'choice'
      || parsed.subcommand === 'score'
    ) {
      await judge(parsed.subcommand, parsed.values);
      return;
    }
    if (parsed.subcommand === 'run') {
      await runBatch(parsed.positionals, parsed.values);
      return;
    }
  } catch (error) {
    reportFailure(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

main();
