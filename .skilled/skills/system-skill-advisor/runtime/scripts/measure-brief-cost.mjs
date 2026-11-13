// ───────────────────────────────────────────────────────────────────
// MODULE: BRIEF COST MEASUREMENT
// ───────────────────────────────────────────────────────────────────
//
// Measures what the Claude prompt hook actually sends the model for one typed
// command prompt. Each row is piped through the installed hook, and the
// `additionalContext` string it emits is counted in UTF-8 bytes, with an
// estimated token count at the renderer's own four characters per token.
//
// The run keeps its IPC socket in a fresh directory so it never reaches the
// operator's warm daemon. The directory is the only thing that ties the hook
// processes together, and it is removed once every row has been measured.
//
// Usage:
//   node measure-brief-cost.mjs [--rows <id,id>] [--root <dir>]
//
// `--root` names a checkout the corpus and hook are read from, and defaults to
// the current directory. `--rows` narrows the run to named corpus ids.
//
// A holdout row is refused before anything is spawned, and its prompt is never
// printed. That keeps the held-out half of the corpus out of a measurement that
// could otherwise leak it into a bug report.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CORPUS_REL = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl';
const HOOK_REL = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
const SANDBOX_PREFIX = 'ssa-cost-';
const HOOK_TIMEOUT_MS = 30000;
const MAX_STDOUT_BYTES = 8 * 1024 * 1024;
// The renderer budgets in tokens at four characters per token, so the byte
// count is converted with the same divisor rather than a model-specific one.
const BYTES_PER_TOKEN = 4;

// ───────────────────────────────────────────────────────────────────
// 3. ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────────

function usageError(message) {
  process.stderr.write(`measure-brief-cost.mjs: ${message}\n`);
  process.stderr.write('usage: measure-brief-cost.mjs [--rows <id,id>] [--root <dir>]\n');
  process.exit(2);
}

function parseArgs(argv) {
  const options = { rows: null, root: process.cwd() };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token !== '--rows' && token !== '--root') usageError(`unknown option: ${token}`);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) usageError(`${token} needs a value`);
    if (token === '--rows') {
      const ids = value.split(',').map((id) => id.trim()).filter((id) => id.length > 0);
      if (ids.length === 0) usageError('--rows needs at least one id');
      options.rows = ids;
    } else {
      options.root = resolve(value);
    }
    index += 1;
  }
  return options;
}

// ───────────────────────────────────────────────────────────────────
// 4. CORPUS SELECTION
// ───────────────────────────────────────────────────────────────────

function readCorpus(path) {
  if (!existsSync(path)) {
    process.stderr.write(`measure-brief-cost.mjs: corpus file missing: ${path}\n`);
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
      process.stderr.write(`measure-brief-cost.mjs: invalid JSON on corpus line ${index + 1}: ${error.message}\n`);
      process.exit(2);
    }
  }
  return rows;
}

function refuseRow(error, id) {
  process.stdout.write(`${JSON.stringify({ error, id })}\n`);
  process.exit(2);
}

// The selected set is always the measured half of the corpus. A named id is
// checked against every row first, so a holdout id is refused as holdout rather
// than reported as missing, and no prompt reaches a process argument or a log.
function selectRows(rows, requested) {
  const typed = rows.filter((row) => row.row_type === 'typed' && row.split === 'none');
  if (requested === null) return typed;

  const byId = new Map();
  for (const row of rows) {
    if (!byId.has(row.id)) byId.set(row.id, row);
  }
  const byIdTyped = new Map(typed.map((row) => [row.id, row]));
  for (const id of requested) {
    const row = byId.get(id);
    if (row === undefined) refuseRow('unknown_row', id);
    if (row.split === 'holdout') refuseRow('holdout_row', id);
    if (!byIdTyped.has(id)) refuseRow('unknown_row', id);
  }

  const wanted = new Set(requested);
  const seen = new Set();
  const selected = [];
  for (const row of typed) {
    if (!wanted.has(row.id) || seen.has(row.id)) continue;
    seen.add(row.id);
    selected.push(row);
  }
  return selected;
}

// ───────────────────────────────────────────────────────────────────
// 5. HOOK MEASUREMENT
// ───────────────────────────────────────────────────────────────────

// The hook fails open with a directive block, so a missing context field is an
// empty measurement rather than an error. Stdout is parsed whole because the
// shim prints exactly one JSON envelope.
function additionalContextFrom(stdout) {
  if (typeof stdout !== 'string' || stdout.trim() === '') return '';
  try {
    const value = JSON.parse(stdout)?.hookSpecificOutput?.additionalContext;
    return typeof value === 'string' ? value : '';
  } catch {
    return '';
  }
}

function measureRow(row, root, socketDir, hookPath) {
  const payload = JSON.stringify({
    prompt: row.prompt,
    cwd: root,
    hook_event_name: 'UserPromptSubmit',
    session_id: `cost-${row.id}`,
  });
  const result = spawnSync(process.execPath, [hookPath], {
    cwd: root,
    input: payload,
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_IPC_SOCKET_DIR: socketDir },
    timeout: HOOK_TIMEOUT_MS,
    maxBuffer: MAX_STDOUT_BYTES,
  });
  const context = additionalContextFrom(result.stdout);
  const bytes = Buffer.byteLength(context, 'utf8');
  return { id: row.id, bytes, estimatedTokens: Math.ceil(bytes / BYTES_PER_TOKEN) };
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

// A sandbox process is identified by the directory on its own command line, so
// no pid is signalled on trust alone and an unrelated daemon is never touched.
function stopSandboxProcesses(socketDir) {
  for (const row of processRows()) {
    if (row.pid === process.pid || !row.command.includes(socketDir)) continue;
    try {
      process.kill(row.pid, 'SIGTERM');
    } catch (error) {
      if (error?.code !== 'ESRCH') throw error;
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. SUMMARY
// ───────────────────────────────────────────────────────────────────

// The nearest-rank definition matches the runtime metrics, so a median here
// counts the same way as a percentile in a routing capture.
function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length - 1, Math.ceil(0.5 * sorted.length) - 1);
  return sorted[rank];
}

function summarise(rows) {
  const values = rows.map((row) => row.bytes);
  return {
    rows,
    totalBytes: values.reduce((sum, value) => sum + value, 0),
    medianBytes: median(values),
    maxBytes: values.length === 0 ? 0 : Math.max(...values),
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. ENTRY
// ───────────────────────────────────────────────────────────────────

function main() {
  const options = parseArgs(process.argv.slice(2));
  const corpusPath = join(options.root, CORPUS_REL);
  const hookPath = join(options.root, HOOK_REL);
  const selected = selectRows(readCorpus(corpusPath), options.rows);
  if (!existsSync(hookPath)) {
    process.stderr.write(`measure-brief-cost.mjs: hook file missing: ${hookPath}\n`);
    process.exit(2);
  }

  const socketDir = mkdtempSync(join(tmpdir(), SANDBOX_PREFIX));
  try {
    const rows = [];
    for (const row of selected) rows.push(measureRow(row, options.root, socketDir, hookPath));
    process.stdout.write(`${JSON.stringify(summarise(rows))}\n`);
  } finally {
    stopSandboxProcesses(socketDir);
    rmSync(socketDir, { recursive: true, force: true });
  }
}

main();
