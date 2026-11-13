// ───────────────────────────────────────────────────────────────────
// MODULE: TYPED HEAD OFFERS
// ───────────────────────────────────────────────────────────────────
//
// Checks what the Claude prompt hook really puts on the first line of the
// advisor head for a typed command prompt. Every row runs through the installed
// hook, and the recorded command and policy are read back with the same parser
// the run log uses, so the measurement answers for the text a session receives
// rather than for what the ranking was expected to say.
//
// The run keeps its IPC socket and its advisor database in one fresh directory
// so it never reaches the operator's warm daemon. The directory is the only
// thing that ties the hook processes together, and it is removed once every row
// has run.
//
// Usage:
//   node typed-heads.mjs [--root <dir>]
//
// `--root` names a checkout the corpus and hook are read from, and defaults to
// the current directory. The result is written beside this script.
//
// A prompt is never printed, so a failure report carries row ids only.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(HERE, 'typed-heads.json');
const CORPUS_REL = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl';
const OFFER_REL = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs';
const HOOK_REL = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
const SANDBOX_PREFIX = 'ssa-typed-';
const SANDBOX_PROCESS_HINTS = ['advisor-server.js', 'system-skill-advisor-launcher.cjs'];
const HOOK_TIMEOUT_MS = 30000;
const MAX_STDOUT_BYTES = 8 * 1024 * 1024;
const COMMAND_PATTERN = /^\/[a-z][a-z-]*:[a-z][a-z-]*$/;
const POLICIES = new Set(['run', 'start', 'ask']);

// ───────────────────────────────────────────────────────────────────
// 3. ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────────

function usageError(message) {
  process.stderr.write(`typed-heads.mjs: ${message}\n`);
  process.stderr.write('usage: typed-heads.mjs [--root <dir>]\n');
  process.exit(2);
}

function parseArgs(argv) {
  const options = { root: process.cwd() };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token !== '--root') usageError(`unknown option: ${token}`);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) usageError(`${token} needs a value`);
    options.root = resolve(value);
    index += 1;
  }
  return options;
}

// ───────────────────────────────────────────────────────────────────
// 4. CORPUS SELECTION
// ───────────────────────────────────────────────────────────────────

function readCorpus(path) {
  if (!existsSync(path)) {
    process.stderr.write(`typed-heads.mjs: corpus file missing: ${path}\n`);
    process.exit(2);
  }
  const rows = [];
  const lines = readFileSync(path, 'utf8').split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line === '') continue;
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      process.stderr.write(`typed-heads.mjs: invalid JSON on corpus line ${index + 1}: ${error.message}\n`);
      process.exit(2);
    }
  }
  return rows;
}

// The measured half is the only half read here. A holdout row is skipped by the
// split filter before any prompt is touched, so its text never reaches a process
// argument and never appears in the output.
function selectRows(rows) {
  return rows.filter((row) => row.row_type === 'typed' && row.split === 'none');
}

// ───────────────────────────────────────────────────────────────────
// 5. HEAD MEASUREMENT
// ───────────────────────────────────────────────────────────────────

// The hook fails open with a directive block, so a missing context field is a
// missing head rather than an error. Stdout is parsed whole because the shim
// prints exactly one JSON envelope.
function firstHeadLine(stdout) {
  if (typeof stdout !== 'string' || stdout.trim() === '') return '';
  try {
    const value = JSON.parse(stdout)?.hookSpecificOutput?.additionalContext;
    if (typeof value !== 'string') return '';
    const [firstLine = ''] = value.split(/\r?\n/);
    return firstLine;
  } catch {
    return '';
  }
}

// The offer may carry a trailing example argument. Only the command token is
// compared, because the corpus records the command without an argument.
function commandToken(offer) {
  if (typeof offer !== 'string') return null;
  const [token = ''] = offer.split(' ');
  return COMMAND_PATTERN.test(token) ? token : null;
}

// A worker session renders start and ask offers as parent-named only, which
// would measure the worker context instead of what a reader is shown.
function hookEnv(sandboxDir) {
  const env = {
    ...process.env,
    SPECKIT_IPC_SOCKET_DIR: sandboxDir,
    SYSTEM_SKILL_ADVISOR_DB_DIR: join(sandboxDir, 'db'),
  };
  delete env.AI_SESSION_CHILD;
  return env;
}

function measureRow(row, root, sandboxDir, hookPath, parseOffer) {
  const payload = JSON.stringify({
    prompt: row.prompt,
    cwd: root,
    hook_event_name: 'UserPromptSubmit',
    session_id: `typed-${row.id}`,
  });
  const result = spawnSync(process.execPath, [hookPath], {
    cwd: root,
    input: payload,
    encoding: 'utf8',
    env: hookEnv(sandboxDir),
    timeout: HOOK_TIMEOUT_MS,
    maxBuffer: MAX_STDOUT_BYTES,
  });
  const { offeredCommand, offeredPolicy } = parseOffer(firstHeadLine(result.stdout));
  const offeredToken = commandToken(offeredCommand);
  return {
    id: row.id,
    offeredCommand,
    offeredPolicy,
    commandMatches: offeredToken !== null && offeredToken === row.expected_command,
    policyPresent: typeof offeredPolicy === 'string' && POLICIES.has(offeredPolicy),
    labelAgrees: offeredPolicy === row.expected_policy,
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. SANDBOX CLEANUP
// ───────────────────────────────────────────────────────────────────

function processRows() {
  const output = execFileSync('ps', ['-axo', 'pid=,command='], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const rows = [];
  for (const line of output.split('\n')) {
    const match = /^\s*(\d+)\s+(.*)$/.exec(line);
    if (match === null) continue;
    rows.push({ pid: Number(match[1]), command: match[2] });
  }
  return rows;
}

// A sandbox process is identified by the directory on its own command line or in
// its own environment, because the daemon takes its paths from the environment
// rather than from arguments. No pid is signalled on trust alone, so an
// unrelated daemon is never touched.
function processNamesSandbox(pid, command, sandboxDir) {
  if (command.includes(sandboxDir)) return true;
  if (!SANDBOX_PROCESS_HINTS.some((hint) => command.includes(hint))) return false;
  try {
    const environment = execFileSync('ps', ['-p', String(pid), '-E', '-o', 'command='], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return environment.includes(sandboxDir);
  } catch {
    return false;
  }
}

function stopSandboxProcesses(sandboxDir) {
  for (const row of processRows()) {
    if (row.pid === process.pid || !processNamesSandbox(row.pid, row.command, sandboxDir)) continue;
    try {
      process.kill(row.pid, 'SIGTERM');
    } catch (error) {
      if (error?.code !== 'ESRCH') throw error;
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. ENTRY
// ───────────────────────────────────────────────────────────────────

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const corpusPath = join(options.root, CORPUS_REL);
  const hookPath = join(options.root, HOOK_REL);
  const offerModulePath = join(options.root, OFFER_REL);
  if (!existsSync(hookPath)) {
    process.stderr.write(`typed-heads.mjs: hook file missing: ${hookPath}\n`);
    process.exit(2);
  }
  if (!existsSync(offerModulePath)) {
    process.stderr.write(`typed-heads.mjs: offer module missing: ${offerModulePath}\n`);
    process.exit(2);
  }
  const { parseOffer } = await import(pathToFileURL(offerModulePath).href);
  const selected = selectRows(readCorpus(corpusPath));

  const sandboxDir = mkdtempSync(join(tmpdir(), SANDBOX_PREFIX));
  try {
    const rows = [];
    for (const row of selected) {
      rows.push(measureRow(row, options.root, sandboxDir, hookPath, parseOffer));
    }
    // Id order keeps the artifact stable across corpus reorderings, so two runs
    // of the same checkout produce the same file.
    rows.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
    writeFileSync(OUTPUT_PATH, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
  } finally {
    stopSandboxProcesses(sandboxDir);
    rmSync(sandboxDir, { recursive: true, force: true });
  }
}

await main();
