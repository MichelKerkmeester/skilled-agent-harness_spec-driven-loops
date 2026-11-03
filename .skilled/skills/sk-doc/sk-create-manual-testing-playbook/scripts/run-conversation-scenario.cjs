#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Conversation Scenario Runner
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Play one conversation script into a real interactive session of each requested runtime.
 *
 * A conversation script is only worth writing if something can drive it. This runner starts the
 * runtime's own interactive CLI inside a private tmux server, types each turn, answers the
 * questions the subject asks, runs the turn's state check and keeps the screens and check output
 * as evidence. It refuses to run anywhere except a marked scratch project outside this repository,
 * because adapters launch with permission prompts bypassed and must not be able to write into a
 * real packet.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const {
  CONVERSATION_RUNTIMES,
  parseConversationScript,
} = require('./validate-playbook-package.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EXIT_PASS = 0;
const EXIT_FAIL = 1;
const EXIT_USAGE = 2;
// Preserve the skip status that setup commands and checks use to distinguish skips from failures.
const CHECK_EXIT_SKIP = 77;
const SETUP_SKIP_FALLBACK_BLOCKER = 'setup reported skip';
// Preserve the conventional timeout status for bounded shell commands.
const TIMEOUT_EXIT_CODE = 124;
// Preserve the conventional process status for SIGINT.
const SIGINT_EXIT_CODE = 130;
// Preserve the conventional process status for SIGTERM.
const SIGTERM_EXIT_CODE = 143;

const POLL_MS = 500;
const SETTLE_MS = 1500;
const SETUP_TIMEOUT_MS = 120000;
const CHECK_TIMEOUT_MS = 60000;
const KILL_GRACE_MS = 5000;
// Bound tmux calls when a caller does not provide a deadline.
const TMUX_TIMEOUT_MS = 30000;
// Keep large tmux captures from being truncated.
const TMUX_MAX_BUFFER_BYTES = 64 * 1024 * 1024;
// Check process-group exit at a bounded teardown interval.
const KILL_POLL_MS = 100;
// Let forced termination settle before the final liveness check.
const KILL_SETTLE_MS = 200;
const LAUNCH_TIMEOUT_MS = 60000;
const EXIT_TIMEOUT_MS = 20000;
const DEFAULT_TURN_DELAY_MS = 2000;
const DEFAULT_TURN_TIMEOUT_MS = 300000;
const DEFAULT_QUESTION_DELAY_MS = 1000;

const DEFAULT_WATCH = 'decision-capture';
const SCRATCH_MARKER = '.conversation-scratch';
const FAKE_ENV = 'CONVERSATION_RUNNER_FAKE';
const WATCH_ENV = 'CONVERSATION_WATCH';
const CHECK_TIMEOUT_ENV = 'CONVERSATION_CHECK_TIMEOUT_MS';
const SANDBOX_EXEC = '/usr/bin/sandbox-exec';
const CODEX_SANDBOX_RUNTIMES = new Set(['codex']);

const SESSION = 'subject';
const PANE_WIDTH = 200;
const PANE_HEIGHT = 50;
const HISTORY_LIMIT = 50000;
const TMUX = 'tmux';

// The Codex wording is fixture-confirmed; the other known runtime messages are unconfirmed live.
const QUOTA_SCREEN_PATTERNS = [
  /you[’']ve hit your usage limit/i,
  /usage limit reached/i,
  /you[’']ve (hit|reached) your (session |weekly |5-hour )?limit/i,
  /rate limit exceeded/i,
  /quota exceeded/i,
  /insufficient (credits|quota)/i,
  /out of credits/i,
];

const FAKE_SUBJECT = path.join(__dirname, 'tests', 'fixtures', 'fake-subject.cjs');

const activeContexts = new Set();
const setupChildren = new Set();
let areSignalsInstalled = false;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Write one diagnostic line to stderr.
 *
 * One helper ends every diagnostic with exactly one newline, so no call site has to remember the
 * terminator. A multi-line message, such as an error stack, is written as it is.
 *
 * @param {string} message - Line text, without a trailing newline.
 * @returns {void}
 */
function writeDiagnostic(message) {
  process.stderr.write(`${message}\n`);
}

/**
 * Wait without blocking the event loop, so a signal handler still runs mid-turn.
 *
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>} Resolves after the wait.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait while blocking. Only used from a signal handler, where the event loop is about to be
 * abandoned and the grace period must be observed before the process exits.
 *
 * @param {number} ms - Milliseconds to wait.
 */
function sleepSync(ms) {
  const buffer = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(buffer, 0, 0, ms);
}

/**
 * Create a directory tree, ignoring an existing tree.
 *
 * @param {string} dir - Directory to create.
 */
function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Read a file's size, treating a missing file as empty.
 *
 * @param {string} file - Path to inspect.
 * @returns {number} Size in bytes.
 */
function fileSize(file) {
  try {
    return fs.statSync(file).size;
  } catch (error) {
    if (error.code === 'ENOENT') return 0;
    throw error;
  }
}

/**
 * Test whether a path sits at or below another one.
 *
 * @param {string} child - Candidate descendant.
 * @param {string} parent - Candidate ancestor.
 * @returns {boolean} True when child is inside parent.
 */
function isInside(child, parent) {
  if (child === parent) return true;
  return child.startsWith(parent.endsWith(path.sep) ? parent : parent + path.sep);
}

/**
 * Resolve a path that may not exist yet by resolving its nearest existing ancestor and re-joining
 * the missing tail. A plain `realpathSync` on a not-yet-created scratch folder would throw, and a
 * lexical compare would miss a symlinked ancestor.
 *
 * @param {string} target - Path to resolve.
 * @returns {string} Absolute resolved path.
 */
function resolveThroughExistingAncestor(target) {
  const tail = [];
  let current = path.resolve(target);
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) break;
    tail.unshift(path.basename(current));
    current = parent;
  }
  const base = fs.existsSync(current) ? fs.realpathSync(current) : current;
  return tail.length ? path.join(base, ...tail) : base;
}

/**
 * Find existing repository paths that the subject must not be able to write.
 *
 * @param {Object} ctx - Run context containing the repository root.
 * @returns {string[]} Unique real paths to deny.
 */
function sandboxDenyPaths(ctx) {
  const candidates = [ctx.repoRoot];
  const scriptRepository = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: __dirname,
    encoding: 'utf8',
  });
  if (scriptRepository.status === 0) candidates.push(String(scriptRepository.stdout).trim());

  if (ctx.repoRoot) {
    const commonDirectory = spawnSync('git', [
      '-C', ctx.repoRoot, 'rev-parse', '--path-format=absolute', '--git-common-dir',
    ], { encoding: 'utf8' });
    if (commonDirectory.status === 0) candidates.push(String(commonDirectory.stdout).trim());
  }

  const paths = [];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || candidate.length === 0) continue;
    try {
      const realPath = fs.realpathSync(candidate);
      if (!paths.includes(realPath)) paths.push(realPath);
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') continue;
      throw error;
    }
  }
  return paths;
}

/**
 * Build a macOS profile that denies writes below each repository path.
 *
 * @param {string[]} denyPaths - Existing repository paths to protect.
 * @returns {string} Seatbelt profile.
 */
function sandboxPolicy(denyPaths) {
  const denyRules = denyPaths.map((denyPath) => {
    const escapedPath = String(denyPath).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `(deny file-write* (subpath "${escapedPath}"))`;
  });
  return `(version 1)(allow default)${denyRules.join('')}`;
}

/**
 * Select the sandbox recorded for a runtime.
 *
 * @param {string} runtime - Runtime id.
 * @param {boolean} noSandbox - Whether the seatbelt wrapper was disabled.
 * @returns {string} Sandbox mode recorded in result.json.
 */
function sandboxMode(runtime, noSandbox) {
  if (CODEX_SANDBOX_RUNTIMES.has(runtime)) return 'codex-workspace-write';
  if (noSandbox) return 'off';
  return process.platform === 'darwin' && fs.existsSync(SANDBOX_EXEC) ? 'seatbelt' : 'unavailable';
}

/**
 * Test whether an entry exists at all, including a dangling symlink.
 *
 * @param {string} target - Path to inspect.
 * @returns {boolean} True when an entry is present.
 */
function pathEntryExists(target) {
  try {
    fs.lstatSync(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Quote a value for a POSIX shell command line.
 *
 * @param {string} value - Raw value.
 * @returns {string} Single quoted, escaped value.
 */
function quoteForShell(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

/**
 * Extract the first non-empty line of a block of text.
 *
 * @param {string} text - Source text.
 * @returns {string} First non-empty line, or an empty string.
 */
function firstNonEmptyLine(text) {
  const line = String(text).split('\n').find((candidate) => candidate.trim() !== '');
  return line ? line.trim() : '';
}

/**
 * Find the first non-empty line that identifies a usage-limit screen.
 *
 * @param {string} text - Captured terminal screen.
 * @returns {string|null} Matching trimmed screen line, or null.
 */
function detectQuotaScreen(text) {
  for (const candidate of String(text ?? '').split(/\r?\n/)) {
    const line = candidate.trim();
    if (line && QUOTA_SCREEN_PATTERNS.some((pattern) => pattern.test(line))) return line;
  }
  return null;
}

/**
 * Keep only what the subject wrote after the turn's own typed line.
 *
 * A chat question belongs to the current turn only when it follows the echo of what the runner
 * sent. The echo is the last line that starts with the prompt glyph and then the send text; long
 * sends wrap, so the line is matched on the start of the send. Without a visible echo, the typed
 * text is removed from the whole screen instead, because it often repeats the words a reply
 * entry matches.
 *
 * @param {string} screen - Settled screen text.
 * @param {string|undefined} send - Text the turn typed, if any.
 * @param {string} [glyph] - Mark the runtime draws before a sent line.
 * @returns {string} Screen text a chat question is tested against.
 */
function textAfterSentLine(screen, send, glyph = '❯') {
  if (typeof send !== 'string' || send.trim() === '') return screen;
  const prefix = send.trim().slice(0, 24);
  const lines = screen.split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (line.startsWith(`${glyph} `) && line.slice(glyph.length).trim().startsWith(prefix)) {
      return lines.slice(index + 1).join('\n').split(send).join('');
    }
  }
  return screen.split(send).join('');
}

/**
 * Extract the last non-empty line of a block of text, which is the value a check observed.
 *
 * @param {string} text - Source text.
 * @returns {string} Last non-empty line, or an empty string.
 */
function lastNonEmptyLine(text) {
  const lines = String(text).split('\n').filter((candidate) => candidate.trim() !== '');
  return lines.length ? lines[lines.length - 1].trim() : '';
}

/**
 * Hash a file's contents.
 *
 * @param {string} file - Path to hash.
 * @returns {string} Lowercase hex sha256.
 */
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/**
 * Turn a request into an action step that types literal text.
 *
 * @param {string} text - Text to type.
 * @returns {{text: string}} Typing step.
 */
function typeStep(text) {
  return { text };
}

/**
 * Turn a request into an action step that presses one key by name.
 *
 * @param {string} key - tmux key name, such as `Enter`.
 * @returns {{key: string}} Key step.
 */
function keyStep(key) {
  return { key };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SEEDED DELAYS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a small deterministic generator, so a `[min, max]` pause can be replayed from `--seed`.
 *
 * @param {number} seed - Any integer.
 * @returns {() => number} Generator returning a value in [0, 1).
 */
function mulberry32(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Resolve a delay field, drawing from the seeded generator when the script gives a range.
 *
 * @param {(number|number[]|undefined)} value - Fixed delay, `[min, max]` pair, or nothing.
 * @param {() => number} rng - Seeded generator.
 * @param {number} fallback - Value used when the field is absent.
 * @returns {number} Delay in milliseconds.
 */
function drawDelay(value, rng, fallback) {
  if (value == null) return fallback;
  if (Array.isArray(value)) {
    const min = value[0];
    const max = value[1];
    if (max <= min) return min;
    return min + Math.floor(rng() * (max - min + 1));
  }
  return value;
}

/** @returns {number} Bound for one check command, overridable so a suite need not wait a minute. */
function checkTimeoutMs() {
  const override = Number.parseInt(process.env[CHECK_TIMEOUT_ENV] || '', 10);
  return Number.isInteger(override) && override > 0 ? override : CHECK_TIMEOUT_MS;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RUNTIME ADAPTERS
// ─────────────────────────────────────────────────────────────────────────────
//
// Each adapter holds everything that differs per runtime: how to start it, how its screen shows
// ready, busy and a question, and which keys answer that question. Each runtime adapter is
// written from screens recorded in a live probe, kept under `tests/fixtures/question-screens/`.
// An adapter without a ready marker settles on a stable screen alone.

/**
 * Describe one runtime.
 *
 * @param {string} id - Runtime id, matching `CONVERSATION_RUNTIMES`.
 * @param {Object} spec - Everything the adapter knows about the runtime.
 * @returns {Object} Adapter object consumed by the runner.
 */
function makeAdapter(id, spec) {
  return {
    id,
    probed: spec.probed === true,
    bin: spec.bin,
    launch: spec.launch,
    resume: spec.resume,
    compact: spec.compact == null ? null : spec.compact,
    exitKeys: spec.exitKeys,
    ready: spec.ready == null ? null : spec.ready,
    busy: spec.busy == null ? null : spec.busy,
    startup: spec.startup == null ? null : spec.startup,
    startupDetect: spec.startupDetect == null ? null : spec.startupDetect,
    startupScreens: startupScreensOf(spec),
    hookTrust: spec.hookTrust === true,
    busyAnywhere: spec.busyAnywhere === true,
    keyAfterTextMs: Number.isInteger(spec.keyAfterTextMs) ? spec.keyAfterTextMs : 0,
    confirm: spec.confirm == null ? null : spec.confirm,
    confirmDetect: spec.confirmDetect == null ? null : spec.confirmDetect,
    echoGlyph: spec.echoGlyph == null ? '❯' : spec.echoGlyph,
    parseQuestion: spec.parseQuestion,
    answerKeys: spec.answerKeys,
  };
}

/**
 * List the screens a runtime may show before its prompt, each with the keys that pass it. A
 * runtime with one such screen names it with `startup` and `startupDetect`.
 *
 * @param {Object} spec - Adapter description.
 * @returns {Array<Object>} Startup screens in no particular order.
 */
function startupScreensOf(spec) {
  if (Array.isArray(spec.startupScreens)) return spec.startupScreens;
  if (spec.startupDetect && Array.isArray(spec.startup) && spec.startup.length > 0) {
    return [{ detect: spec.startupDetect, keys: spec.startup }];
  }
  return [];
}

/**
 * Resolve Codex's per-user configuration file.
 *
 * @returns {string} Absolute path to config.toml.
 */
function codexConfigPath() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  return path.resolve(codexHome, 'config.toml');
}

/**
 * Count project hook handlers so global Codex hooks cannot be mistaken for project hooks.
 *
 * @param {string} project - Scratch project folder owned by this run.
 * @returns {number} Number of handlers declared in the project's hooks.json.
 */
function countProjectHookHandlers(project) {
  try {
    const hooksFile = path.join(project, '.codex', 'hooks.json');
    const config = JSON.parse(fs.readFileSync(hooksFile, 'utf8'));
    const events = config && typeof config === 'object' && !Array.isArray(config)
      ? config.hooks
      : null;
    if (!events || typeof events !== 'object' || Array.isArray(events)) return 0;

    let count = 0;
    for (const entries of Object.values(events)) {
      if (!Array.isArray(entries)) continue;
      for (const entry of entries) {
        if (entry && Array.isArray(entry.hooks)) count += entry.hooks.length;
      }
    }
    return count;
  } catch {
    // An unavailable or malformed project config cannot contribute a confirmed handler count.
    return 0;
  }
}

/**
 * Read Codex's config, treating a new user's missing file as an empty config.
 *
 * @param {string} config - Config file path.
 * @returns {string} Config contents or an empty string when the file is missing.
 */
function readHookTrustConfig(config) {
  try {
    return fs.readFileSync(config, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return '';
    throw error;
  }
}

/**
 * Locate Codex hook-state tables while retaining exact header and body offsets for restoration.
 *
 * @param {string} configText - TOML source.
 * @returns {Map<string, Object>} Hook tables keyed by their TOML string key.
 */
function parseHookTrustTables(configText) {
  const source = String(configText || '');
  const lines = [];
  let offset = 0;
  while (offset < source.length) {
    const newline = source.indexOf('\n', offset);
    const lineEnd = newline < 0 ? source.length : newline;
    const raw = source.slice(offset, lineEnd);
    lines.push({
      start: offset,
      end: newline < 0 ? source.length : newline + 1,
      text: raw.endsWith('\r') ? raw.slice(0, -1) : raw,
    });
    if (newline < 0) break;
    offset = newline + 1;
  }

  const boundaries = lines.filter((line) => line.text.startsWith('['));
  const tables = new Map();
  for (let index = 0; index < boundaries.length; index += 1) {
    const headerLine = boundaries[index];
    const match = /^\[hooks\.state\."((?:\\.|[^"\\])*)"\]\s*(?:#.*)?$/.exec(headerLine.text);
    if (!match) continue;

    let key;
    try {
      key = JSON.parse(`"${match[1]}"`);
    } catch {
      // Undecodable keys cannot be matched safely when restoring runner-owned tables.
      continue;
    }
    const end = boundaries[index + 1] ? boundaries[index + 1].start : source.length;
    const headerEnd = headerLine.end;
    tables.set(key, {
      key,
      start: headerLine.start,
      headerEnd,
      end,
      header: source.slice(headerLine.start, headerEnd),
      body: source.slice(headerEnd, end),
      raw: source.slice(headerLine.start, end),
    });
  }
  return tables;
}

/**
 * Capture the hook tables Codex may change before its first launch.
 *
 * @param {string} [config] - Config file path, defaulting to the active Codex home.
 * @param {string} project - Scratch project folder owned by this run.
 * @returns {{config: string, content: string, tables: Map<string, Object>, projectRoots: string[]}} Snapshot.
 */
function captureHookTrust(config = codexConfigPath(), project) {
  const existed = pathEntryExists(config);
  const content = readHookTrustConfig(config);
  const projectRoots = [path.resolve(project), fs.realpathSync(project)].map((root) => (
    root.endsWith('/') ? root : `${root}/`
  ));
  return { config, content, tables: parseHookTrustTables(content), projectRoots, existed };
}

/**
 * Remove newly trusted hook tables and restore changed bodies without rewriting other config text.
 *
 * @param {{config: string, tables: Map<string, Object>, projectRoots: string[]}} snapshot - Pre-launch snapshot.
 * @returns {Object} Audit with config, added, changed, missing, outside_project,
 *   removed, restored and ok fields.
 */
function restoreHookTrust(snapshot) {
  const added = [];
  const changed = [];
  const missing = [];
  const outsideProject = [];
  const removed = [];
  const restored = [];
  const isProjectTable = (key) => snapshot.projectRoots.some((root) => key.startsWith(root));

  try {
    const current = readHookTrustConfig(snapshot.config);
    const currentTables = parseHookTrustTables(current);
    for (const [key, table] of currentTables) {
      const before = snapshot.tables.get(key);
      if (!isProjectTable(key)) {
        if (!before || table.body !== before.body) outsideProject.push(key);
      } else if (!before) added.push(key);
      else if (table.body !== before.body) changed.push(key);
    }
    for (const key of snapshot.tables.keys()) {
      if (isProjectTable(key) && !currentTables.has(key)) missing.push(key);
    }

    const edits = [];
    for (const key of added) {
      const table = currentTables.get(key);
      edits.push({ start: table.start, end: table.end, replacement: '' });
    }
    for (const key of changed) {
      const table = currentTables.get(key);
      edits.push({
        start: table.headerEnd,
        end: table.end,
        replacement: snapshot.tables.get(key).body,
      });
    }
    let restoredText = current;
    for (const edit of edits.sort((left, right) => right.start - left.start)) {
      restoredText = restoredText.slice(0, edit.start)
        + edit.replacement
        + restoredText.slice(edit.end);
    }

    const tablesAfterEdits = parseHookTrustTables(restoredText);
    const snapshotKeys = Array.from(snapshot.tables.keys());
    const missingInsertions = new Map();
    // Restore tables beside their snapshot neighbors so unrelated entries keep their order.
    for (const key of missing) {
      const snapshotIndex = snapshotKeys.indexOf(key);
      let insertAt;
      for (let index = snapshotIndex + 1; index < snapshotKeys.length; index += 1) {
        const nextTable = tablesAfterEdits.get(snapshotKeys[index]);
        if (nextTable) {
          insertAt = nextTable.start;
          break;
        }
      }
      if (insertAt === undefined) {
        for (let index = snapshotIndex - 1; index >= 0; index -= 1) {
          const previousTable = tablesAfterEdits.get(snapshotKeys[index]);
          if (previousTable) {
            insertAt = previousTable.end;
            break;
          }
        }
      }
      if (insertAt === undefined) {
        insertAt = Math.min(snapshot.tables.get(key).start, restoredText.length);
      }
      const rawTables = missingInsertions.get(insertAt) || [];
      rawTables.push(snapshot.tables.get(key).raw);
      missingInsertions.set(insertAt, rawTables);
    }

    const missingEdits = Array.from(missingInsertions, ([start, rawTables]) => ({
      start,
      end: start,
      replacement: rawTables.join(''),
    }));
    for (const edit of missingEdits.sort((left, right) => right.start - left.start)) {
      restoredText = restoredText.slice(0, edit.start)
        + edit.replacement
        + restoredText.slice(edit.end);
    }

    if (edits.length > 0 || missingEdits.length > 0) {
      if (snapshot.existed === false && restoredText === '') fs.unlinkSync(snapshot.config);
      else fs.writeFileSync(snapshot.config, restoredText);
    } else if (snapshot.existed === false && current === '' && pathEntryExists(snapshot.config)) {
      fs.unlinkSync(snapshot.config);
    }

    const freshTables = parseHookTrustTables(readHookTrustConfig(snapshot.config));
    for (const key of added) {
      if (!freshTables.has(key)) removed.push(key);
    }
    for (const key of changed) {
      if (freshTables.has(key) && freshTables.get(key).body === snapshot.tables.get(key).body) {
        restored.push(key);
      }
    }
    const hasAddedKey = Array.from(freshTables.keys()).some((key) => (
      isProjectTable(key) && !snapshot.tables.has(key)
    ));
    const areAllChangedRestored = changed.every((key) => restored.includes(key));
    const allProjectTablesPresent = Array.from(snapshot.tables.keys())
      .filter(isProjectTable)
      .every((key) => freshTables.has(key));
    const areAllMissingRestored = missing.every((key) => (
      freshTables.has(key) && freshTables.get(key).raw === snapshot.tables.get(key).raw
    ));
    return {
      config: snapshot.config,
      added,
      changed,
      missing,
      outside_project: outsideProject,
      removed,
      restored,
      ok: !hasAddedKey && areAllChangedRestored && allProjectTablesPresent && areAllMissingRestored,
    };
  } catch {
    // Preserve a failed audit result when restoration cannot finish.
    return {
      config: snapshot.config,
      added,
      changed,
      missing,
      outside_project: outsideProject,
      removed,
      restored,
      ok: false,
    };
  }
}

// A long question wraps onto several screen lines, and a scenario's `match` is written against the
// whole sentence, so the parsers join the wrapped lines. The cap stops a dialog drawn without a
// blank line above it from pulling earlier conversation text into the question.
const QUESTION_TEXT_MAX_LINES = 6;

/**
 * Read the question drawn above a dialog's first option, joining its wrapped lines.
 *
 * Blank and stop lines between the options and the question are skipped; the question then runs
 * upward until the next blank or stop line.
 *
 * @param {string[]} lines - Screen lines, already stripped of any frame characters.
 * @param {number} firstOptionLine - Index of the first option row.
 * @param {(line: string) => boolean} isStop - True for a trimmed line that cannot be question text.
 * @returns {string} The question text, or '' when none is found.
 */
function questionTextAbove(lines, firstOptionLine, isStop) {
  let index = firstOptionLine - 1;
  while (index >= 0) {
    const line = lines[index].trim();
    if (line && !isStop(line)) break;
    index -= 1;
  }
  const collected = [];
  for (; index >= 0 && collected.length < QUESTION_TEXT_MAX_LINES; index -= 1) {
    const line = lines[index].trim();
    if (!line || isStop(line)) break;
    collected.unshift(line);
  }
  return collected.join(' ');
}

/**
 * Use the selection footer to avoid treating old conversation text as an active question.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean}|null} Parsed question or null.
 */
function parseClaudeQuestion(screen) {
  const lines = String(screen).split('\n');
  let footerIndex = -1;
  for (let index = 0; index < lines.length; index += 1) {
    if (/Enter to select/.test(lines[index])) footerIndex = index;
  }
  if (footerIndex < 0) return null;

  const rows = [];
  for (let index = 0; index < footerIndex; index += 1) {
    const match = /^\s*(?:❯\s*)?(\d+)\.\s+(.*)$/.exec(lines[index]);
    if (!match) continue;
    let label = match[2].trim();
    const isCheckbox = /^\[(?:\s|✔|✓|x|X)\]\s*/.test(label);
    if (isCheckbox) label = label.replace(/^\[(?:\s|✔|✓|x|X)\]\s*/, '').trim();
    rows.push({ index, number: Number(match[1]), label, checkbox: isCheckbox });
  }

  let firstRowIndex = -1;
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].number === 1) {
      firstRowIndex = index;
      break;
    }
  }
  if (firstRowIndex < 0) return null;

  const optionRows = [];
  let expectedNumber = 1;
  for (let index = firstRowIndex; index < rows.length; index += 1) {
    const row = rows[index];
    if (row.number !== expectedNumber) break;
    optionRows.push(row);
    expectedNumber += 1;
  }

  const choices = optionRows.filter((row) => (
    !/^Type something\.?$/i.test(row.label)
    && !/^Chat about this$/i.test(row.label)
  ));
  if (choices.length === 0) return null;

  // The question sits above the options and may end in a hint sentence rather than a question
  // mark. The tab header, the prompt echo and the rule above the dialog are not part of it.
  const questionText = questionTextAbove(
    lines,
    optionRows[0].index,
    (line) => /^(?:←|☐|☒|✔)/.test(line) || line.startsWith('❯') || /^─+$/.test(line),
  );
  if (!questionText) return null;

  return {
    text: questionText,
    options: choices.map((row) => row.label),
    multi: choices.some((row) => row.checkbox),
  };
}

/**
 * Keep cursor movement consistent when answers target rows in different orders.
 *
 * @param {number} from - Current row index.
 * @param {number} to - Target row index.
 * @returns {Array<Object>} Ordered navigation keys.
 */
function moveClaudeCursor(from, to) {
  const key = to >= from ? 'Down' : 'Up';
  return Array.from({ length: Math.abs(to - from) }, () => keyStep(key));
}

/**
 * Keep each answer type on the navigation path its panel expects.
 *
 * @param {{options: string[], multi: boolean}} question - Parsed question.
 * @param {Object} answer - Script answer with one of `select`, `other` or `reply`.
 * @returns {Array<Object>} Ordered tmux send-keys steps.
 */
function claudeAnswerKeys(question, answer) {
  if (!answer) return [];
  if (typeof answer.reply === 'string') return [typeStep(answer.reply), keyStep('Enter')];
  if (typeof answer.other === 'string') {
    return [
      ...moveClaudeCursor(0, question.options.length),
      typeStep(answer.other),
      keyStep('Enter'),
    ];
  }
  if (!Array.isArray(answer.select) || answer.select.length === 0) return [];

  if (!question.multi) {
    const optionIndex = findOptionIndex(question.options, answer.select[0]);
    return [...moveClaudeCursor(0, optionIndex), keyStep('Enter')];
  }

  const steps = [];
  let cursor = 0;
  for (const label of answer.select) {
    const optionIndex = findOptionIndex(question.options, label);
    steps.push(...moveClaudeCursor(cursor, optionIndex), keyStep('Enter'));
    cursor = optionIndex;
  }
  const submitIndex = question.options.length + 1;
  // The review screen that follows the last tab is confirmed by the adapter's confirm step,
  // because in a tabbed dialog this Enter only moves to the next question.
  steps.push(...moveClaudeCursor(cursor, submitIndex), keyStep('Enter'));
  return steps;
}

/**
 * Derive an OpenCode session id from the run's UUID, so a restart reaches the same session.
 *
 * @param {Object} ctx - Run context.
 * @returns {string} `ses_` followed by 26 lowercase hex characters.
 */
function openCodeSessionId(ctx) {
  return `ses_${ctx.sessionId.replace(/-/g, '').toLowerCase().slice(0, 26)}`;
}

/**
 * Parse OpenCode's question dialog. The dialog is drawn inside the input frame, so each line
 * starts with the frame bar, and its footer names `esc dismiss`, or `esc close` while the
 * free-text row is being typed. A review tab has the footer but no numbered rows.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean}|null} Parsed question or null.
 */
function parseOpenCodeQuestion(screen) {
  const lines = String(screen).split('\n').map((line) => line.replace(/^\s*┃\s?/, '').replace(/\s*█?\s*$/, ''));
  let footerIndex = -1;
  lines.forEach((line, index) => {
    if (/esc (?:dismiss|close)\s*$/.test(line)) footerIndex = index;
  });
  if (footerIndex < 0) return null;

  const rows = [];
  for (let index = 0; index < footerIndex; index += 1) {
    const match = /^\s*(\d+)\.\s+(.*)$/.exec(lines[index]);
    if (!match) continue;
    let label = match[2].trim();
    const isCheckbox = /^\[(?:\s|✓|✔|x|X)\]\s*/.test(label);
    if (isCheckbox) label = label.replace(/^\[(?:\s|✓|✔|x|X)\]\s*/, '').trim();
    rows.push({ index, number: Number(match[1]), label, checkbox: isCheckbox });
  }
  let first = -1;
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].number === 1) {
      first = index;
      break;
    }
  }
  if (first < 0) return null;
  const optionRows = [];
  for (
    let index = first, expected = 1;
    index < rows.length && rows[index].number === expected;
    index += 1, expected += 1
  ) {
    optionRows.push(rows[index]);
  }
  // The last row is the free-text row; while it is being typed it shows the typed text instead.
  // A question can offer that row alone, which leaves no choices but is still a question.
  const choices = optionRows.slice(0, -1);

  // The dialog's `Questions` heading and the tool-call line above it are not part of the question.
  const text = questionTextAbove(
    lines,
    optionRows[0].index,
    (line) => /^Questions?$/.test(line) || line.startsWith('→ ') || /^─+$/.test(line),
  );
  if (!text) return null;
  return { text, options: choices.map((row) => row.label), multi: choices.some((row) => row.checkbox) };
}

/**
 * Find a scripted label among a dialog's options. The model writes its own option labels, so the
 * same choice reads "D) Skip" in one run and "D) Skip documentation (Recommended)" in the next. An
 * exact match wins, ignoring case; otherwise the one option that contains the label is chosen, and
 * a label that fits several options is refused rather than guessed.
 *
 * @param {string[]} options - Labels on screen.
 * @param {string} label - Scripted label.
 * @returns {number} Option index.
 */
function findOptionIndex(options, label) {
  const wanted = String(label).trim().toLowerCase();
  const exact = options.findIndex((option) => option.trim().toLowerCase() === wanted);
  if (exact >= 0) return exact;
  const containing = [];
  options.forEach((option, index) => {
    if (wanted && option.toLowerCase().includes(wanted)) containing.push(index);
  });
  if (containing.length > 1) throw new Error(`option ambiguous: ${label}`);
  if (containing.length === 0) throw new Error(`option not on screen: ${label}`);
  return containing[0];
}

/**
 * Answer OpenCode's dialog. The cursor starts on the first row. Enter submits a single choice and
 * toggles a row in a multi choice, whose answers are then sent from the Submit tab. The free-text
 * row is the last row: Enter opens it for typing and a second Enter submits the text.
 *
 * @param {{options: string[], multi: boolean}|null} question - Parsed question.
 * @param {Object} answer - Script answer with one of `select`, `other` or `reply`.
 * @returns {Array<Object>} Ordered tmux send-keys steps.
 */
function openCodeAnswerKeys(question, answer) {
  if (!answer) return [];
  if (typeof answer.reply === 'string') return [typeStep(answer.reply), keyStep('Enter')];
  if (typeof answer.other === 'string') {
    return [
      ...moveClaudeCursor(0, question.options.length),
      keyStep('Enter'),
      typeStep(answer.other),
      keyStep('Enter'),
    ];
  }
  if (!Array.isArray(answer.select) || answer.select.length === 0) return [];
  if (!question.multi) {
    return [...moveClaudeCursor(0, findOptionIndex(question.options, answer.select[0])), keyStep('Enter')];
  }
  const steps = [];
  let cursor = 0;
  for (const label of answer.select) {
    const target = findOptionIndex(question.options, label);
    steps.push(...moveClaudeCursor(cursor, target), keyStep('Enter'));
    cursor = target;
  }
  steps.push(keyStep('Tab'), keyStep('Enter'));
  return steps;
}

/**
 * Parse Codex's `request_user_input` dialog. Its footer names `enter to submit answer`, each
 * option row is a label and a description in two columns, and the last row is Codex's own
 * `None of the above`, which takes free text as a note.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean}|null} Parsed question or null.
 */
function parseCodexQuestion(screen) {
  const lines = String(screen).split('\n');
  let footerIndex = -1;
  lines.forEach((line, index) => {
    if (/enter to submit answer/.test(line)) footerIndex = index;
  });
  if (footerIndex < 0) return null;
  const rows = [];
  for (let index = 0; index < footerIndex; index += 1) {
    const match = /^\s*(?:›\s*)?(\d+)\.\s+(.*)$/.exec(lines[index]);
    if (match) rows.push({ index, number: Number(match[1]), label: match[2].split(/\s{2,}/)[0].trim() });
  }
  let first = -1;
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].number === 1) {
      first = index;
      break;
    }
  }
  if (first < 0) return null;
  const optionRows = [];
  for (
    let index = first, expected = 1;
    index < rows.length && rows[index].number === expected;
    index += 1, expected += 1
  ) {
    optionRows.push(rows[index]);
  }
  const choices = optionRows.filter((row) => !/^None of the above$/i.test(row.label));
  if (choices.length === 0) return null;
  let text = '';
  for (let index = optionRows[0].index - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (!line || /^Question \d+\/\d+/.test(line)) continue;
    text = line;
    break;
  }
  if (!text) return null;
  return { text, options: choices.map((row) => row.label), multi: false };
}

/**
 * Answer Codex's dialog. It offers one choice per question, so a scripted answer with several
 * choices, like an Other answer, is typed as a note on the `None of the above` row, which the
 * subject reads with the answer.
 *
 * @param {{options: string[]}|null} question - Parsed question.
 * @param {Object} answer - Script answer with one of `select`, `other` or `reply`.
 * @returns {Array<Object>} Ordered tmux send-keys steps.
 */
function codexAnswerKeys(question, answer) {
  if (!answer) return [];
  if (typeof answer.reply === 'string') return [typeStep(answer.reply), keyStep('Enter')];
  const noteRow = question.options.length;
  const note = (text) => [...moveClaudeCursor(0, noteRow), keyStep('Tab'), typeStep(text), keyStep('Enter')];
  if (typeof answer.other === 'string') return note(answer.other);
  if (!Array.isArray(answer.select) || answer.select.length === 0) return [];
  const indexes = answer.select.map((label) => findOptionIndex(question.options, label));
  if (indexes.length > 1) return note(answer.select.join(', '));
  return [...moveClaudeCursor(0, indexes[0]), keyStep('Enter')];
}

/**
 * Parse Devin's `ask_user_question` dialog. A titled rule opens it, the question line follows,
 * then numbered rows with a description line under each, a checkbox on each row of a
 * multi-select, and a free-text `Other (type your own)` row. The footer names `↵ confirm`.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean}|null} Parsed question or null.
 */
function parseDevinQuestion(screen) {
  const lines = String(screen).split('\n').map((line) => line.replace(/\s+$/, ''));
  let footerIndex = -1;
  lines.forEach((line, index) => {
    if (/↑↓ select .*↵ confirm/.test(line)) footerIndex = index;
  });
  if (footerIndex < 0) return null;
  let titleIndex = -1;
  for (let index = footerIndex - 1; index >= 0; index -= 1) {
    if (/^── .+ ─+$/.test(lines[index].trim())) {
      titleIndex = index;
      break;
    }
  }
  if (titleIndex < 0) return null;
  let text = '';
  const rows = [];
  for (let index = titleIndex + 1; index < footerIndex; index += 1) {
    const line = lines[index].trim();
    if (!line || /^─+$/.test(line)) continue;
    const row = /^(?:❭\s*)?([□■])?\s*(\d+)\s+(.*)$/.exec(line);
    if (row) {
      rows.push({ label: row[3].trim(), checkbox: Boolean(row[1]) });
    } else if (!text) {
      text = line;
    }
  }
  const choices = rows.filter((row) => !/^Other \(type your own\)$/.test(row.label));
  if (!text || choices.length === 0) return null;
  return { text, options: choices.map((row) => row.label), multi: choices.some((row) => row.checkbox) };
}

/**
 * Answer Devin's dialog. The cursor starts on the first row. Space toggles a row of a
 * multi-select and Enter confirms; the free-text row follows the options and takes typed text
 * directly.
 *
 * @param {{options: string[], multi: boolean}|null} question - Parsed question.
 * @param {Object} answer - Script answer with one of `select`, `other` or `reply`.
 * @returns {Array<Object>} Ordered tmux send-keys steps.
 */
function devinAnswerKeys(question, answer) {
  if (!answer) return [];
  if (typeof answer.reply === 'string') return [typeStep(answer.reply), keyStep('Enter')];
  if (typeof answer.other === 'string') {
    return [...moveClaudeCursor(0, question.options.length), typeStep(answer.other), keyStep('Enter')];
  }
  if (!Array.isArray(answer.select) || answer.select.length === 0) return [];
  if (!question.multi) {
    return [...moveClaudeCursor(0, findOptionIndex(question.options, answer.select[0])), keyStep('Enter')];
  }
  const steps = [];
  let cursor = 0;
  for (const label of answer.select) {
    const target = findOptionIndex(question.options, label);
    steps.push(...moveClaudeCursor(cursor, target), keyStep('Space'));
    cursor = target;
  }
  steps.push(keyStep('Enter'));
  return steps;
}

/** Rows of Pi's dialog that are not answer choices. */
const PI_CONTROL_ROW = /^(?:Type your own answer|Add a custom answer|Done \(.*\))$/;

/**
 * Parse either of Pi's two question tools. The `question` tool draws a pick list; the
 * `ask_user_question` dialog draws numbered rows with checkboxes, a `Type something.` row and a
 * `Submit` row in the same shape as Claude Code's dialog, and is marked `dialog` so its answer
 * keys can differ.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean, dialog?: boolean}|null} Question or null.
 */
function parsePiQuestion(screen) {
  const pickList = parsePiPickList(screen);
  if (pickList) return pickList;
  const dialog = parseClaudeQuestion(screen);
  return dialog ? { ...dialog, dialog: true } : null;
}

/**
 * Parse Pi's pick list. It is drawn between two rules: a `<header>: <question>` line, one row
 * per option with an arrow on the current row, and a `↑↓ navigate` footer. A multi-select
 * prefixes each remaining option with `Add: `.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean}|null} Parsed question or null.
 */
function parsePiPickList(screen) {
  const lines = String(screen).split('\n').map((line) => line.replace(/\s+$/, ''));
  let footerIndex = -1;
  lines.forEach((line, index) => {
    if (/↑↓ navigate\s+enter select/.test(line)) footerIndex = index;
  });
  if (footerIndex < 0) return null;
  let ruleIndex = -1;
  for (let index = footerIndex - 1; index >= 0; index -= 1) {
    if (/^─+$/.test(lines[index].trim())) {
      ruleIndex = index;
      break;
    }
  }
  if (ruleIndex < 0) return null;
  let headerIndex = ruleIndex + 1;
  while (headerIndex < footerIndex && lines[headerIndex].trim() === '') headerIndex += 1;
  if (headerIndex >= footerIndex) return null;
  const text = lines[headerIndex].trim();
  const labels = lines
    .slice(headerIndex + 1, footerIndex)
    .map((line) => line.replace(/^\s*(?:→\s*)?/, '').trim())
    .filter((line) => line !== '' && !PI_CONTROL_ROW.test(line));
  if (!text || labels.length === 0) return null;
  const isMulti = labels.every((label) => label.startsWith('Add: '));
  const options = labels.map((label) => label.replace(/^Add: /, '').split(' \u2014 ')[0].trim());
  return { text, options, multi: isMulti };
}

/**
 * Answer Pi's dialog. The cursor starts on the first row and returns there after each pick in a
 * multi-select, which removes the picked option from the list; the free-text row follows the
 * options, and a multi-select ends on its `Done` row below that.
 *
 * @param {{options: string[], multi: boolean}|null} question - Parsed question.
 * @param {Object} answer - Script answer with one of `select`, `other` or `reply`.
 * @returns {Array<Object>} Ordered tmux send-keys steps.
 */
function piAnswerKeys(question, answer) {
  if (!answer) return [];
  if (typeof answer.reply === 'string') return [typeStep(answer.reply), keyStep('Enter')];
  if (typeof answer.other === 'string') {
    // The pick list opens its free-text row with Enter; the dialog's row takes typed text directly.
    const open = question.dialog ? [] : [keyStep('Enter')];
    return [...moveClaudeCursor(0, question.options.length), ...open, typeStep(answer.other), keyStep('Enter')];
  }
  if (!Array.isArray(answer.select) || answer.select.length === 0) return [];
  if (!question.multi) {
    return [...moveClaudeCursor(0, findOptionIndex(question.options, answer.select[0])), keyStep('Enter')];
  }
  if (question.dialog) {
    // The dialog toggles a row with Space and sends from its `Submit` row, below `Type something.`.
    const steps = [];
    let cursor = 0;
    for (const label of answer.select) {
      const target = findOptionIndex(question.options, label);
      steps.push(...moveClaudeCursor(cursor, target), keyStep('Space'));
      cursor = target;
    }
    steps.push(...moveClaudeCursor(cursor, question.options.length + 1), keyStep('Enter'));
    return steps;
  }
  const remaining = question.options.slice();
  const steps = [];
  for (const label of answer.select) {
    const index = findOptionIndex(remaining, label);
    steps.push(...moveClaudeCursor(0, index), keyStep('Enter'));
    remaining.splice(index, 1);
  }
  steps.push(...moveClaudeCursor(0, remaining.length + 1), keyStep('Enter'));
  return steps;
}

const ADAPTERS = {
  'claude-code': makeAdapter('claude-code', {
    probed: true,
    bin: 'claude',
    launch: (ctx) => ['claude', '--session-id', ctx.sessionId, '--dangerously-skip-permissions'],
    resume: (ctx) => ['claude', '--resume', ctx.sessionId, '--dangerously-skip-permissions'],
    compact: '/compact',
    exitKeys: [typeStep('/exit'), keyStep('Enter')],
    ready: /^❯\s*$/m,
    busy: /^✻(?!.*\bdone\b).*$/m,
    startup: [keyStep('Down'), keyStep('Enter')],
    startupDetect: /Yes, I trust this folder/,
    confirm: [keyStep('Enter')],
    confirmDetect: /Ready to submit your answers\?[\s\S]*❯ 1\. Submit answers/,
    parseQuestion: parseClaudeQuestion,
    answerKeys: claudeAnswerKeys,
  }),
  opencode: makeAdapter('opencode', {
    probed: true,
    bin: 'opencode',
    // OpenCode accepts only its own `ses_` session ids, and the same flag creates the session on
    // the first launch and continues it on a restart.
    launch: (ctx) => ['opencode', '--standalone', '--auto', '--session', openCodeSessionId(ctx)],
    resume: (ctx) => ['opencode', '--standalone', '--auto', '--session', openCodeSessionId(ctx)],
    compact: '/compact',
    exitKeys: [typeStep('/exit'), keyStep('Enter')],
    ready: /^(?!.*esc interrupt).*ctrl\+p commands/,
    busy: /esc interrupt/,
    echoGlyph: '┃',
    parseQuestion: parseOpenCodeQuestion,
    answerKeys: openCodeAnswerKeys,
  }),
  codex: makeAdapter('codex', {
    probed: true,
    bin: 'codex',
    // Keep Codex's own writes inside the disposable scratch project while skipping approval prompts.
    launch: () => [
      'codex', '--no-alt-screen', '--no-daemon',
      '--sandbox', 'workspace-write', '--ask-for-approval', 'never',
    ],
    // Codex picks its own session id, and `resume --last` is limited to sessions started in the
    // current folder, which is the scratch project and holds only this run's session.
    resume: () => [
      'codex', 'resume', '--last', '--no-alt-screen', '--no-daemon',
      '--sandbox', 'workspace-write', '--ask-for-approval', 'never',
    ],
    compact: '/compact',
    exitKeys: [typeStep('/exit'), keyStep('Enter')],
    // The prompt line starts with the glyph; a startup picker's selected row does too, so a
    // numbered row is not the prompt.
    ready: /^› (?!\d+\. )/,
    busy: /esc to interrupt/,
    busyAnywhere: true,
    keyAfterTextMs: 500,
    // Folder trust is accepted. An update offer is skipped, never installed. Hooks are left
    // opt-in because Codex records hook trust in the operator's own config.
    startupScreens: [
      { detect: /Trust this folder\?[\s\S]*1\. Trust and continue/, keys: [keyStep('Enter')] },
      { detect: /Update available[\s\S]*Skip until next version/, keys: [keyStep('Down'), keyStep('Enter')] },
      {
        detect: /Hooks need review[\s\S]*Continue without trusting/,
        keys: (ctx, screen) => {
          if (!ctx.trustHooks) return [keyStep('Down'), keyStep('Down'), keyStep('Enter')];

          const match = /(\d+)\s+hooks are new or changed\b/i.exec(String(screen || ''));
          const displayedCount = match ? Number(match[1]) : Number.NaN;
          if (!Number.isSafeInteger(displayedCount) || displayedCount > countProjectHookHandlers(ctx.project)) {
            ctx.hookTrustRefused = true;
            return [keyStep('Down'), keyStep('Down'), keyStep('Enter')];
          }
          return [keyStep('Down'), keyStep('Enter')];
        },
      },
    ],
    hookTrust: true,
    echoGlyph: '›',
    parseQuestion: parseCodexQuestion,
    answerKeys: codexAnswerKeys,
  }),
  pi: makeAdapter('pi', {
    probed: true,
    bin: 'pi',
    launch: (ctx) => ['pi', '--session-id', ctx.sessionId, '--approve', '--tui-mode', 'regular'],
    resume: (ctx) => ['pi', '--session-id', ctx.sessionId, '--approve', '--tui-mode', 'regular'],
    compact: '/compact',
    // Pi has no `/exit` command and sends that text to the model, so the run quits with `/quit`.
    exitKeys: [typeStep('/quit'), keyStep('Enter')],
    ready: /^╰ .*─╯$/,
    busy: /…\s*\(.*↓ [\d.,]+k? tokens/,
    busyAnywhere: true,
    parseQuestion: parsePiQuestion,
    answerKeys: piAnswerKeys,
  }),
  devin: makeAdapter('devin', {
    probed: true,
    bin: 'devin',
    launch: () => ['devin', '--permission-mode', 'dangerous'],
    // Devin names its own sessions, and `--continue` takes the latest one in the current folder,
    // which is the scratch project and holds only this run's session.
    resume: () => ['devin', '--continue', '--permission-mode', 'dangerous'],
    compact: '/compact',
    exitKeys: [typeStep('/exit'), keyStep('Enter')],
    ready: /^❭ /,
    busy: /esc twice to interrupt|Compacting…/,
    busyAnywhere: true,
    keyAfterTextMs: 500,
    startupScreens: [{ detect: /Do you trust the authors of this directory\?/, keys: [keyStep('Enter')] }],
    echoGlyph: '❭',
    parseQuestion: parseDevinQuestion,
    answerKeys: devinAnswerKeys,
  }),
};

/**
 * Parse the stand-in's screen. Two shapes exist: a numbered dialog terminated by `[select]` or
 * `[multi]`, and a chat question prefixed `CHAT?`. The newest of the two wins, because an answered
 * dialog stays in the pane's scrollback after the subject moves on.
 *
 * @param {string} screen - Captured pane text.
 * @returns {{text: string, options: string[], multi: boolean, chat: boolean}|null} Question or null.
 */
function parseFakeQuestion(screen) {
  const lines = String(screen).split('\n');
  let chatIndex = -1;
  let toolIndex = -1;
  lines.forEach((line, index) => {
    if (line.startsWith('CHAT? ')) chatIndex = index;
    if (line.startsWith('[?] ')) toolIndex = index;
  });
  if (chatIndex < 0 && toolIndex < 0) return null;
  if (chatIndex > toolIndex) {
    return {
      text: lines[chatIndex].slice('CHAT? '.length).trim(),
      options: [],
      multi: false,
      chat: true,
    };
  }
  const text = lines[toolIndex].slice('[?] '.length).trim();
  const options = [];
  let isMulti = false;
  for (let index = toolIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const option = /^\s+\d+\.\s+(.*)$/.exec(line);
    if (option) {
      options.push(option[1].trim());
      continue;
    }
    if (line === '[multi]') {
      isMulti = true;
      break;
    }
    if (line === '[select]') break;
    if (line.trim() === '') continue;
    break;
  }
  return { text, options, multi: isMulti, chat: false };
}

/**
 * Build the keystrokes that answer a question for the stand-in: option numbers then Enter, the
 * free-text row, or a plain chat line.
 *
 * @param {{options: string[]}} question - Parsed question.
 * @param {Object} answer - Script answer with one of `select`, `other` or `reply`.
 * @returns {Array<Object>} Ordered tmux send-keys steps.
 */
function fakeAnswerKeys(question, answer) {
  if (!answer) return [];
  if (typeof answer.reply === 'string') return [typeStep(answer.reply), keyStep('Enter')];
  if (typeof answer.other === 'string') return [typeStep(`o: ${answer.other}`), keyStep('Enter')];
  if (Array.isArray(answer.select) && answer.select.length > 0) {
    const numbers = answer.select.map((label) => {
      const index = question.options.indexOf(label);
      if (index < 0) throw new Error(`option not on screen: ${label}`);
      return String(index + 1);
    });
    return [typeStep(numbers.join(' ')), keyStep('Enter')];
  }
  return [];
}

ADAPTERS.fake = makeAdapter('fake', {
  probed: true,
  bin: process.execPath,
  launch: (ctx) => [process.execPath, FAKE_SUBJECT, '--session', ctx.sessionId, '--project', ctx.project],
  resume: (ctx) => [process.execPath, FAKE_SUBJECT, '--session', ctx.sessionId, '--project', ctx.project],
  compact: '/compact',
  exitKeys: [typeStep('/exit'), keyStep('Enter')],
  ready: /FAKE READY>/,
  busy: /FAKE BUSY/,
  startupScreens: [{ detect: /FAKE TRUST STARTUP/, keys: [keyStep('Down'), keyStep('Enter')] }],
  hookTrust: true,
  parseQuestion: parseFakeQuestion,
  answerKeys: fakeAnswerKeys,
});

/** @returns {boolean} True when the test double may be selected. */
function fakeEnabled() {
  return process.env[FAKE_ENV] === '1';
}

/**
 * Resolve requested runtime ids to adapters, rejecting an id this runner does not implement.
 *
 * @param {string[]} runtimeIds - Requested ids.
 * @returns {{errors: string[], byId: Object}} Errors and the usable adapter table.
 */
function resolveAdapters(runtimeIds) {
  const usable = {};
  for (const [id, adapter] of Object.entries(ADAPTERS)) {
    if (id === 'fake' && !fakeEnabled()) continue;
    usable[id] = adapter;
  }
  const errors = runtimeIds.filter((id) => !usable[id]).map((id) => `unknown runtime: ${id}`);
  return { errors, byId: usable };
}

/**
 * Report adapters this runner is missing for a supported runtime. A missing adapter would mean a
 * script for that runtime silently gets no row, so it is a startup error instead.
 *
 * @returns {string[]} Runtime ids without an adapter.
 */
function missingAdapters() {
  return CONVERSATION_RUNTIMES.filter((id) => !ADAPTERS[id]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPOSITORY SNAPSHOT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Walk every regular file below a directory, skipping symlinks so a linked tree cannot be walked
 * twice or escape the repository.
 *
 * @param {string} root - Directory to walk.
 * @param {(file: string) => void} visit - Called once per regular file.
 * @param {(path: string, error: Error) => void} onError - Called when a directory cannot be read.
 * @param {string} [watchedRoot=root] - Root where a missing directory is allowed.
 */
function walkFiles(root, visit, onError, watchedRoot = root) {
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch (error) {
    if (root === watchedRoot && error.code === 'ENOENT') return;
    onError(root, error);
    return;
  }
  entries.sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) walkFiles(full, visit, onError, watchedRoot);
    else if (entry.isFile()) visit(full);
  }
}

/**
 * Record path, size and content hash of every file the subject's writes could reach.
 *
 * A listing alone cannot prove nothing was written: an appended queue file keeps the same path,
 * and a fully ignored folder collapses to one entry in a git listing. Hashing the contents makes
 * an append visible.
 *
 * The runner's own evidence folder is left out, because a run may keep its evidence inside the
 * repository's `specs/` and those writes are the runner's, not the subject's.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string[]} watched - State subfolders to watch, relative to `.skilled/skills/.state`.
 * @param {string} [excludeDir] - Folder whose files are not recorded, such as the evidence folder.
 * @returns {string[]} Sorted `<path>\t<size>\t<sha256>` lines.
 */
function snapshotRepo(repoRoot, watched, excludeDir) {
  const excluded = excludedPrefix(repoRoot, excludeDir);
  const watchedNames = Array.isArray(watched) ? watched : watchedSubfolders();
  const roots = [path.join(repoRoot, 'specs')];
  for (const name of watchedNames) roots.push(path.join(repoRoot, '.skilled', 'skills', '.state', name));
  const lines = [];
  const isExcluded = (relative) => Boolean(
    excluded
    && (relative.startsWith(excluded) || `${relative}${path.sep}`.startsWith(excluded)),
  );
  const recordError = (target, error) => {
    const relative = path.relative(repoRoot, target);
    if (isExcluded(relative)) return;
    const code = error && error.code ? error.code : 'UNKNOWN';
    lines.push(`!${relative}\tERROR\t${code}`);
  };
  for (const root of roots) {
    walkFiles(root, (file) => {
      const relative = path.relative(repoRoot, file);
      if (isExcluded(relative)) return;
      try {
        const stats = fs.statSync(file);
        lines.push(`${relative}\t${stats.size}\t${sha256(file)}`);
      } catch (error) {
        recordError(file, error);
      }
    }, recordError);
  }
  lines.sort();
  return lines;
}

/**
 * Express a folder to leave out of the snapshot as a path prefix relative to the repository.
 * Both sides resolve through symlinks first, and a missing evidence folder resolves through its
 * nearest existing ancestor so before and after snapshots use the same exclusion.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string} [excludeDir] - Folder to leave out.
 * @returns {string|null} Relative prefix ending in a separator, or null when nothing is left out.
 */
function excludedPrefix(repoRoot, excludeDir) {
  if (!excludeDir) return null;
  let relative;
  try {
    relative = path.relative(
      fs.realpathSync(repoRoot),
      resolveThroughExistingAncestor(excludeDir),
    );
  } catch {
    // Keep the snapshot inclusive when its exclusion cannot be resolved.
    return null;
  }
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return relative + path.sep;
}

/** @returns {string[]} State subfolders to watch, from the environment or the default. */
function watchedSubfolders() {
  const raw = process.env[WATCH_ENV];
  if (!raw || raw.trim() === '') return [DEFAULT_WATCH];
  return raw
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

/**
 * Compare two snapshots as text.
 *
 * @param {string[]} before - Earlier snapshot lines.
 * @param {string[]} after - Later snapshot lines.
 * @returns {boolean} True when the two are identical.
 */
function snapshotsMatch(before, after) {
  if (before.length !== after.length) return false;
  return before.every((line, index) => line === after[index]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. BOUNDED COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kill a child and everything it started. A check or setup command can fork, so the whole process
 * group has to go or a survivor outlives the run.
 *
 * @param {number} pid - Process id, used as the group id.
 */
function killTree(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return;
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // The process is already gone; nothing to kill.
    }
  }
}

/**
 * Run a shell command with a deadline, capturing its output.
 *
 * @param {Object} options - Command, working directory, environment, deadline and child tracker.
 * @returns {Promise<{code: number, output: string, timedOut: boolean}>} Outcome.
 */
function runBoundedCommand(options) {
  const { command, cwd, env, timeoutMs, ctx } = options;
  const trackedChildren = options.children || (ctx && ctx.children);
  return new Promise((resolve) => {
    const child = spawn('bash', ['-c', command], {
      cwd,
      env,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    let hasTimedOut = false;
    let isSettled = false;
    if (trackedChildren && Number.isInteger(child.pid)) trackedChildren.add(child.pid);
    const forgetChildIfGone = () => {
      if (trackedChildren && Number.isInteger(child.pid) && !groupAlive(child.pid)) {
        trackedChildren.delete(child.pid);
      }
    };
    const finish = (code) => {
      if (isSettled) {
        forgetChildIfGone();
        return;
      }
      isSettled = true;
      clearTimeout(timer);
      forgetChildIfGone();
      resolve({ code, output, timedOut: hasTimedOut });
    };
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('error', (error) => {
      output += `${error.message}\n`;
      finish(1);
    });
    child.on('close', (code) => finish(code == null ? 1 : code));
    const timer = setTimeout(() => {
      hasTimedOut = true;
      killTree(child.pid);
      finish(TIMEOUT_EXIT_CODE);
    }, timeoutMs);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SCRATCH GUARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Describe one refusal.
 *
 * @param {string} code - Stable refusal code.
 * @param {string} message - Operator-facing reason.
 * @returns {{ok: false, code: string, message: string, project: null, setupOutput: string}} Refusal.
 */
function refuse(code, message) {
  return { ok: false, code, message, project: null, setupOutput: '' };
}

/**
 * Check scratch and runtime project paths without writing to either location.
 *
 * @param {Object} options - Scratch root, repository root and runtime id.
 * @returns {Object} `{ok, code, message, project, setupOutput}`.
 */
function checkScratch(options) {
  const { scratch, repoRoot, runtime } = options;
  if (!scratch) return refuse('SCRATCH_MISSING', '--scratch is required');

  const scratchPath = resolveThroughExistingAncestor(scratch);
  const repoPath = resolveThroughExistingAncestor(repoRoot);
  if (isInside(scratchPath, repoPath)) {
    return refuse(
      'SCRATCH_INSIDE_REPO',
      `--scratch resolves inside the repository: ${scratchPath}`,
    );
  }

  if (fs.existsSync(scratchPath)) {
    const entries = fs.readdirSync(scratchPath);
    if (entries.length > 0 && !entries.includes(SCRATCH_MARKER)) {
      return refuse(
        'SCRATCH_UNMARKED',
        `--scratch is a non-empty directory without ${SCRATCH_MARKER}: ${scratchPath}`,
      );
    }
  }

  const project = path.join(scratchPath, runtime);
  if (pathEntryExists(project) && fs.lstatSync(project).isSymbolicLink()) {
    let resolvedProject;
    try {
      resolvedProject = fs.realpathSync(project);
    } catch {
      resolvedProject = path.resolve(path.dirname(project), fs.readlinkSync(project));
    }
    return refuse(
      'PROJECT_ESCAPED',
      `scratch project symlink resolves to an unsafe path: ${resolvedProject}`,
    );
  }
  if (pathEntryExists(project)) {
    const expectedProject = path.join(scratchPath, runtime);
    const resolvedProject = fs.realpathSync(project);
    if (resolvedProject !== expectedProject || isInside(resolvedProject, repoPath)) {
      return refuse(
        'PROJECT_ESCAPED',
        `scratch project resolves to an unsafe path: ${resolvedProject}`,
      );
    }
    const leaves = ['specs', path.join('.skilled', 'skills', '.state')];
    for (const leaf of leaves) {
      const target = path.join(project, leaf);
      if (!pathEntryExists(target)) continue;
      const resolved = fs.realpathSync(target);
      if (!isInside(resolved, resolvedProject)) {
        return refuse(
          'CONTAINMENT_ESCAPED',
          `${leaf} resolves outside the scratch project: ${resolved}`,
        );
      }
    }
  }

  return { ok: true, code: null, message: null, project, setupOutput: '' };
}

/**
 * Prepare a guarded scratch project: markers, setup commands and post-setup containment check.
 *
 * The scratch root is checked before its marker is written, so an early scratch refusal leaves no
 * new artifact. The runtime project is checked before its marker or setup because setup may
 * remove project contents and must not follow a symlink into this repository. Setup may create
 * linked leaf folders, so those are checked after its commands finish.
 *
 * Setup output is returned rather than written, so a refusal cannot leave a file behind in the
 * evidence folder and make the next attempt look like a reuse of someone else's results.
 *
 * @param {Object} options - Scratch root, repository root, runtime id and setup commands.
 * @returns {Promise<Object>} Guard result, with `skip` and `blocker` when setup reports a skip.
 */
async function prepareScratch(options) {
  const { scratch, repoRoot, runtime, setup, ctx } = options;
  if (!scratch) return refuse('SCRATCH_MISSING', '--scratch is required');

  const scratchPath = resolveThroughExistingAncestor(scratch);
  const repoPath = resolveThroughExistingAncestor(repoRoot);
  if (isInside(scratchPath, repoPath)) {
    return refuse(
      'SCRATCH_INSIDE_REPO',
      `--scratch resolves inside the repository: ${scratchPath}`,
    );
  }

  if (fs.existsSync(scratchPath)) {
    const entries = fs.readdirSync(scratchPath);
    if (entries.length > 0 && !entries.includes(SCRATCH_MARKER)) {
      return refuse(
        'SCRATCH_UNMARKED',
        `--scratch is a non-empty directory without ${SCRATCH_MARKER}: ${scratchPath}`,
      );
    }
  }

  mkdirp(scratchPath);
  const markerBody = `conversation runner scratch created ${new Date().toISOString()}\n`;
  fs.writeFileSync(path.join(scratchPath, SCRATCH_MARKER), markerBody);

  const project = path.join(scratchPath, runtime);
  if (pathEntryExists(project) && fs.lstatSync(project).isSymbolicLink()) {
    let resolvedProject;
    try {
      resolvedProject = fs.realpathSync(project);
    } catch {
      resolvedProject = path.resolve(path.dirname(project), fs.readlinkSync(project));
    }
    return refuse(
      'PROJECT_ESCAPED',
      `scratch project symlink resolves to an unsafe path: ${resolvedProject}`,
    );
  }
  mkdirp(project);
  const scratchReal = fs.realpathSync(scratchPath);
  const expectedProject = path.join(scratchReal, runtime);
  const resolvedProject = fs.realpathSync(project);
  if (resolvedProject !== expectedProject || isInside(resolvedProject, repoPath)) {
    return refuse(
      'PROJECT_ESCAPED',
      `scratch project resolves to an unsafe path: ${resolvedProject}`,
    );
  }
  fs.writeFileSync(path.join(project, SCRATCH_MARKER), markerBody);

  const log = [];
  const commands = Array.isArray(setup) ? setup : [];
  let setupBlocker = null;
  for (const command of commands) {
    const outcome = await runBoundedCommand({
      command,
      cwd: project,
      // Setup builds the project from the repository, so it needs the same roots a check gets.
      env: { ...process.env, CONVERSATION_REPO_ROOT: repoRoot, CONVERSATION_RUNTIME: runtime },
      timeoutMs: SETUP_TIMEOUT_MS,
      children: setupChildren,
    });
    if (!terminateTrackedGroups(setupChildren)) {
      return refuse('CLEANUP_INCOMPLETE', `setup process group survived cleanup: ${command}`);
    }
    log.push(`$ ${command}\n${outcome.output}[exit ${outcome.code}]\n`);
    if (outcome.timedOut) {
      return refuse('SETUP_TIMEOUT', `setup command exceeded ${SETUP_TIMEOUT_MS} ms: ${command}`);
    }
    if (outcome.code === CHECK_EXIT_SKIP) {
      setupBlocker = firstNonEmptyLine(outcome.output) || SETUP_SKIP_FALLBACK_BLOCKER;
      break;
    }
    if (outcome.code !== 0) {
      return refuse('SETUP_FAILED', `setup command failed with exit ${outcome.code}: ${command}`);
    }
  }
  const setupOutput = log.join('');

  const projectReal = fs.realpathSync(project);
  if (projectReal !== expectedProject || isInside(projectReal, repoPath)) {
    return refuse(
      'PROJECT_ESCAPED',
      `scratch project resolves to an unsafe path after setup: ${projectReal}`,
    );
  }
  const leaves = ['specs', path.join('.skilled', 'skills', '.state')];
  for (const leaf of leaves) {
    const target = path.join(project, leaf);
    if (!pathEntryExists(target)) continue;
    const resolved = fs.realpathSync(target);
    if (!isInside(resolved, projectReal)) {
      return refuse(
        'CONTAINMENT_ESCAPED',
        `${leaf} resolves outside the scratch project: ${resolved}`,
      );
    }
  }

  return {
    ok: true,
    code: null,
    message: null,
    project,
    setupOutput,
    skip: setupBlocker !== null,
    blocker: setupBlocker,
  };
}

/**
 * Check and prepare one project for direct callers.
 *
 * @param {Object} options - Scratch root, repository root, runtime id and setup commands.
 * @returns {Promise<Object>} Guard result with setup skip details when `skip` is true.
 */
async function guardScratch(options) {
  const guard = checkScratch(options);
  if (!guard.ok) return guard;
  return prepareScratch(options);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. TMUX DRIVER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the private socket name for one runtime. The default socket is never addressed, so a run
 * cannot see or disturb the operator's own server.
 *
 * @param {string} runtime - Runtime id.
 * @returns {string} Socket name.
 */
function socketName(runtime) {
  return `conv-${process.pid}-${String(runtime).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

/**
 * Invoke tmux against a private socket.
 *
 * @param {string} socket - Socket name passed to `-L`.
 * @param {string[]} args - tmux arguments after the socket selection.
 * @param {{conf?: string, timeout?: number}} [options] - Server config file and call deadline.
 * @returns {{status: number, stdout: string, stderr: string}} Outcome.
 */
function runTmux(socket, args, options = {}) {
  const full = ['-L', socket];
  if (options.conf) full.push('-f', options.conf);
  full.push(...args);
  const result = spawnSync(TMUX, full, {
    encoding: 'utf8',
    timeout: options.timeout || TMUX_TIMEOUT_MS,
    maxBuffer: TMUX_MAX_BUFFER_BYTES,
  });
  const stderr = result.stderr || (result.error ? String(result.error.message) : '');
  return {
    status: result.status == null ? 1 : result.status,
    stdout: result.stdout || '',
    stderr,
  };
}

/**
 * Write the runner's own server config. `remain-on-exit` keeps a dead subject's last screen
 * readable, which is the evidence a failed turn needs.
 *
 * @param {Object} ctx - Run context.
 */
function ensureTmuxConfig(ctx) {
  const body = [
    'set-option -g remain-on-exit on',
    `set-option -g history-limit ${HISTORY_LIMIT}`,
    'set-option -g monitor-bell on',
    '',
  ].join('\n');
  fs.writeFileSync(ctx.confPath, body);
}

/**
 * Start the pipe that copies raw pane output into the run's log.
 *
 * @param {Object} ctx - Run context.
 */
function startPipe(ctx) {
  runTmux(ctx.socket, ['pipe-pane', '-o', '-t', SESSION, `cat >> ${quoteForShell(ctx.rawPanePath)}`]);
}

/**
 * Start the subject in a fresh private server.
 *
 * @param {Object} ctx - Run context.
 * @param {string[]} argv - Program and arguments, as the adapter produced them.
 */
function startSubject(ctx, argv) {
  ensureTmuxConfig(ctx);
  const subjectArgv = ctx.sandbox === 'seatbelt'
    ? [SANDBOX_EXEC, '-p', sandboxPolicy(sandboxDenyPaths(ctx)), ...argv]
    : argv;
  const envArgs = [];
  for (const [key, value] of Object.entries(ctx.scriptEnv)) envArgs.push('-e', `${key}=${value}`);
  const result = runTmux(ctx.socket, [
    'new-session',
    '-d',
    '-s',
    SESSION,
    '-x',
    String(PANE_WIDTH),
    '-y',
    String(PANE_HEIGHT),
    '-c',
    ctx.project,
    ...envArgs,
    ...subjectArgv,
  ], { conf: ctx.confPath });
  if (result.status !== 0) {
    throw new Error(`tmux new-session failed: ${result.stderr.trim() || `exit ${result.status}`}`);
  }
  startPipe(ctx);
  ctx.panePid = readPanePid(ctx);
}

/**
 * Read the pane's root process id, which is also the process group the runner kills.
 *
 * @param {Object} ctx - Run context.
 * @returns {number} Pane pid, or 0 when the server is gone.
 */
function readPanePid(ctx) {
  const result = runTmux(ctx.socket, ['display-message', '-p', '-t', SESSION, '#{pane_pid}']);
  if (result.status !== 0) return 0;
  const pid = Number.parseInt(result.stdout.trim(), 10);
  return Number.isInteger(pid) && pid > 0 ? pid : 0;
}

/**
 * Read the pane's settled screen as plain text.
 *
 * @param {Object} ctx - Run context.
 * @returns {string} Captured screen.
 */
function captureScreen(ctx) {
  const result = runTmux(ctx.socket, ['capture-pane', '-p', '-J', '-t', SESSION]);
  return result.status === 0 ? result.stdout : '';
}

/**
 * Test whether the subject's process has ended. `remain-on-exit` keeps the pane, so the screen is
 * still readable after the process is gone.
 *
 * @param {Object} ctx - Run context.
 * @returns {boolean} True when the pane reports a dead process.
 */
function paneDead(ctx) {
  const result = runTmux(ctx.socket, ['display-message', '-p', '-t', SESSION, '#{pane_dead}']);
  if (result.status !== 0) return true;
  return String(result.stdout).trim() === '1';
}

/**
 * Test whether the subject is idle: its ready marker is the last marker on screen and nothing busy
 * follows it. Testing the whole screen would match a busy line that has long scrolled past.
 *
 * @param {Object} ctx - Run context.
 * @param {string} screen - Captured screen.
 * @returns {boolean} True when the screen shows an idle subject.
 */
function isIdle(ctx, screen) {
  const adapter = ctx.adapter;
  if (!adapter.ready) return true;
  const lines = String(screen).split('\n');
  let lastReady = -1;
  lines.forEach((line, index) => {
    if (adapter.ready.test(line)) lastReady = index;
  });
  if (lastReady < 0) return false;
  if (!adapter.busy) return true;
  // Most runtimes draw their busy line below the prompt. One that draws it above the prompt is
  // tested across the whole screen instead.
  const tail = adapter.busyAnywhere ? lines.join('\n') : lines.slice(lastReady + 1).join('\n');
  return !adapter.busy.test(tail);
}

/**
 * Wait until the subject is idle, bounded by the launch deadline. An unprobed adapter has no ready
 * marker, so any non-empty screen counts as started.
 *
 * @param {Object} ctx - Run context.
 * @returns {Promise<boolean>} True when the subject came up.
 */
async function waitForLaunch(ctx) {
  const deadline = Date.now() + LAUNCH_TIMEOUT_MS;
  const adapter = ctx.adapter;
  // Startup screens can redraw after their first paint, so answer only the settled version.
  const passed = new Set();
  // A runtime can draw its prompt for a moment before a startup screen replaces it, so the
  // prompt counts only once the screen has held still for the settle window.
  let lastScreen = null;
  let changedAt = Date.now();
  while (Date.now() < deadline) {
    if (paneDead(ctx)) return false;
    const screen = captureScreen(ctx);
    if (screen !== lastScreen) {
      lastScreen = screen;
      changedAt = Date.now();
    }
    const startupIndex = adapter.startupScreens.findIndex((entry, index) => (
      !passed.has(index) && entry.detect.test(screen)
    ));
    const screenSettled = Date.now() - changedAt >= SETTLE_MS;
    if (startupIndex >= 0) {
      if (screenSettled) {
        const startup = adapter.startupScreens[startupIndex];
        passed.add(startupIndex);
        const keys = typeof startup.keys === 'function' ? startup.keys(ctx, screen) : startup.keys;
        sendSteps(ctx, 'startup', 'startup', keys);
      }
      await sleep(POLL_MS);
      continue;
    }
    if (screen.trim() !== '' && screenSettled && isIdle(ctx, screen)) return true;
    await sleep(POLL_MS);
  }
  return false;
}

/**
 * Run one send-keys command and refuse to continue when tmux rejects it.
 *
 * @param {Object} ctx - Run context.
 * @param {string[]} args - tmux command arguments.
 */
function sendTmuxKeys(ctx, args) {
  const outcome = runTmux(ctx.socket, args);
  if (outcome.status !== 0) {
    const stderr = String(outcome.stderr || '');
    const detail = stderr.trim() || `tmux exited with status ${outcome.status}`;
    const error = new Error(`SEND_KEYS_FAILED: ${detail}`);
    error.code = 'SEND_KEYS_FAILED';
    error.stderr = stderr;
    ctx.sendKeysError = stderr || error.message;
    throw error;
  }
}

/**
 * Send one group of keystrokes and log the group. Literal text goes through `send-keys -l` so a
 * key name inside the text is typed rather than pressed.
 *
 * @param {Object} ctx - Run context.
 * @param {string} turnKey - Turn whose evidence folder owns the entry.
 * @param {string} kind - `send`, `question`, `exit`, `compact` or `startup`.
 * @param {Array<Object>} steps - Typing and key steps.
 */
function sendSteps(ctx, turnKey, kind, steps) {
  const applied = [];
  const pauseMs = ctx.adapter && ctx.adapter.keyAfterTextMs > 0 ? ctx.adapter.keyAfterTextMs : 0;
  let hasAfterText = false;
  for (const step of steps || []) {
    if (step && typeof step.text === 'string') {
      const trailingSemicolons = /;+$/u.exec(step.text);
      const semicolonCount = trailingSemicolons ? trailingSemicolons[0].length : 0;
      const literalText = step.text.slice(0, step.text.length - semicolonCount);
      if (literalText || semicolonCount === 0) {
        sendTmuxKeys(ctx, ['send-keys', '-l', '-t', SESSION, '--', literalText]);
      }
      // tmux parses trailing semicolons as command separators, so send those characters by key code.
      for (let index = 0; index < semicolonCount; index += 1) {
        sendTmuxKeys(ctx, ['send-keys', '-t', SESSION, '-H', '3b']);
      }
      applied.push({ text: step.text });
      hasAfterText = true;
    } else if (step && typeof step.key === 'string') {
      // A runtime that reads a fast burst of typed text as a paste turns an Enter that arrives
      // inside the burst into a newline, so the key waits until the burst is over.
      if (hasAfterText && pauseMs > 0) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, pauseMs);
      }
      hasAfterText = false;
      sendTmuxKeys(ctx, ['send-keys', '-t', SESSION, step.key]);
      applied.push({ key: step.key });
    }
  }
  appendAction(ctx, { time: new Date().toISOString(), turn: turnKey, kind, steps: applied });
}

/**
 * Append one line to the run's action log.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} entry - Entry to record.
 */
function appendAction(ctx, entry) {
  fs.appendFileSync(ctx.actionsPath, `${JSON.stringify({ runtime: ctx.runtime, ...entry })}\n`);
}

/**
 * Stop the private server. Used by both the restart action and cleanup.
 *
 * @param {Object} ctx - Run context.
 */
function stopServer(ctx) {
  runTmux(ctx.socket, ['kill-server']);
}

/**
 * Match tmux's uid-scoped socket directory so cleanup targets only this private server.
 *
 * @param {string} socket - Socket name passed to `-L`.
 * @returns {string} Filesystem path for the private socket.
 */
function privateSocketPath(socket) {
  const tempDir = process.env.TMUX_TMPDIR || '/tmp';
  return path.join(tempDir, `tmux-${process.getuid()}`, socket);
}

/**
 * A killed server can leave its address behind, so unlink only a stale socket entry.
 *
 * @param {string} socket - Socket name passed to `-L`.
 * @param {boolean} serverStopped - Whether a tmux client no longer answers on the socket.
 * @returns {boolean} True when no socket file remains.
 */
function removePrivateSocketIfStopped(socket, serverStopped) {
  const socketPath = privateSocketPath(socket);
  if (!serverStopped) return !pathEntryExists(socketPath);

  try {
    if (!fs.lstatSync(socketPath).isSocket()) return false;
    fs.unlinkSync(socketPath);
  } catch (error) {
    if (error.code !== 'ENOENT') return false;
  }
  return !pathEntryExists(socketPath);
}

/**
 * Test whether any process still belongs to a group.
 *
 * @param {number} pid - Group id.
 * @returns {boolean} True when a member remains.
 */
function groupAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  const result = spawnSync('pgrep', ['-g', String(pid)], { encoding: 'utf8' });
  if (result.status === 1 && !result.error) return false;
  return true;
}

/**
 * Signal the pane's process group, wait for the grace period, then insist.
 *
 * @param {number} pid - Group id.
 * @returns {boolean} True when the group is gone.
 */
function terminateGroup(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return true;
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      return !groupAlive(pid);
    }
  }
  const deadline = Date.now() + KILL_GRACE_MS;
  while (Date.now() < deadline) {
    if (!groupAlive(pid)) return true;
    sleepSync(KILL_POLL_MS);
  }
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Already gone.
    }
  }
  sleepSync(KILL_SETTLE_MS);
  return !groupAlive(pid);
}

/**
 * Terminate tracked child groups and remove only groups verified to be gone.
 *
 * @param {Set<number>} groups - Tracked process group ids.
 * @returns {boolean} True when no tracked group survives.
 */
function terminateTrackedGroups(groups) {
  for (const pid of Array.from(groups)) {
    terminateGroup(pid);
    if (!groupAlive(pid)) groups.delete(pid);
  }
  return groups.size === 0;
}

/**
 * Tear one runtime down: its children, process group, server and socket file. Safe to call twice.
 *
 * @param {Object} ctx - Run context.
 * @returns {{ok: boolean, sessionsGone: boolean, socketGone: boolean, groupGone: boolean,
 *   childrenGone: boolean}} Outcome.
 */
function cleanupContext(ctx) {
  const emptyResult = {
    ok: true,
    sessionsGone: true,
    socketGone: true,
    groupGone: true,
    childrenGone: true,
  };
  if (!ctx) return emptyResult;
  if (ctx.cleaned) return ctx.cleanupResult || emptyResult;
  ctx.cleaned = true;

  const contextChildrenGone = terminateTrackedGroups(ctx.children);
  const setupChildrenGone = terminateTrackedGroups(setupChildren);
  const childrenGone = contextChildrenGone && setupChildrenGone;

  const panePid = ctx.panePid || readPanePid(ctx);
  const groupGone = panePid > 0 ? terminateGroup(panePid) : true;
  ctx.panePid = 0;

  stopServer(ctx);

  if (ctx.hookTrustSnapshot) {
    ctx.hookTrustResult = restoreHookTrust(ctx.hookTrustSnapshot);
    fs.writeFileSync(
      path.join(ctx.outDir, 'hook-trust.json'),
      `${JSON.stringify(ctx.hookTrustResult, null, 2)}\n`,
    );
  }

  const sessions = spawnSync(TMUX, ['-L', ctx.socket, 'list-sessions'], { encoding: 'utf8' });
  const areSessionsGone = sessions.status !== 0;
  const socketGone = removePrivateSocketIfStopped(ctx.socket, areSessionsGone);
  const result = {
    ok: areSessionsGone && socketGone && groupGone && childrenGone,
    sessionsGone: areSessionsGone,
    socketGone,
    groupGone,
    childrenGone,
  };
  ctx.cleanupResult = result;
  activeContexts.delete(ctx);
  return result;
}

/** Tear every active runtime down. Used by the signal and crash paths, where no code follows. */
function cleanupAll() {
  for (const ctx of Array.from(activeContexts)) {
    try {
      cleanupContext(ctx);
    } catch {
      // A failing teardown must not stop the remaining ones.
    }
  }
  terminateTrackedGroups(setupChildren);
}

/** Register the exit paths that must all tear down the same way. */
function installSignalHandlers() {
  if (areSignalsInstalled) return;
  areSignalsInstalled = true;
  process.on('SIGINT', () => {
    cleanupAll();
    process.exit(SIGINT_EXIT_CODE);
  });
  process.on('SIGTERM', () => {
    cleanupAll();
    process.exit(SIGTERM_EXIT_CODE);
  });
  process.on('uncaughtException', (error) => {
    writeDiagnostic(`run-conversation-scenario: ${error && error.stack ? error.stack : error}`);
    cleanupAll();
    process.exit(EXIT_FAIL);
  });
  process.on('unhandledRejection', (error) => {
    writeDiagnostic(`run-conversation-scenario: ${error && error.stack ? error.stack : error}`);
    cleanupAll();
    process.exit(EXIT_FAIL);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. TURN EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a turn's evidence folder. A retry gets its own folder so the first attempt's screen and
 * check output survive.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} turn - Turn being run.
 * @param {number} attempt - 1-based attempt number.
 * @returns {string} Folder path.
 */
function turnEvidenceDir(ctx, turn, attempt) {
  const base = path.join(ctx.outDir, 'turns', turn.key);
  return attempt > 1 ? path.join(base, `attempt-${attempt}`) : base;
}

/**
 * Write the pending question's screen. The dialog is the only record of what was asked, so it is
 * captured before the answer is typed.
 *
 * @param {string} dir - Turn evidence folder.
 * @param {number} index - 1-based question number within the attempt.
 * @param {string} screen - Captured screen.
 */
function writeQuestion(dir, index, screen) {
  mkdirp(dir);
  fs.writeFileSync(path.join(dir, `question-${index}.txt`), `${screen}\n`);
}

/**
 * Copy this turn's slice of raw pane output, so a turn can be read back without the whole log.
 *
 * @param {Object} ctx - Run context.
 * @param {string} dir - Turn evidence folder.
 * @param {number} offset - Byte offset where the turn began.
 */
function writeRawSlice(ctx, dir, offset) {
  mkdirp(dir);
  let data = Buffer.alloc(0);
  try {
    const handle = fs.openSync(ctx.rawPanePath, 'r');
    try {
      const size = fs.fstatSync(handle).size;
      if (size > offset) {
        data = Buffer.alloc(size - offset);
        fs.readSync(handle, data, 0, data.length, offset);
      }
    } finally {
      fs.closeSync(handle);
    }
  } catch {
    // A pane read failure must not block the turn's remaining evidence from being recorded.
    data = Buffer.alloc(0);
  }
  fs.writeFileSync(path.join(dir, 'raw-pane.log'), data);
}

/**
 * Write the pane's full plain-text scrollback. The screen holds only the visible rows, so a long
 * reply can scroll past it; the history keeps the whole buffer searchable.
 *
 * @param {Object} ctx - Run context.
 * @param {string} dir - Turn evidence folder.
 */
function writeHistory(ctx, dir) {
  mkdirp(dir);
  const result = runTmux(ctx.socket, ['capture-pane', '-p', '-J', '-S', '-', '-t', SESSION]);
  fs.writeFileSync(path.join(dir, 'history.txt'), result.status === 0 ? result.stdout : '');
}

/**
 * Wait for the subject to ask, answer what it asks, then settle.
 *
 * A settled turn means: the ready marker is the last marker on screen, nothing busy follows it, and
 * the screen has not changed for the settle window. Questions are handled before the settle test,
 * because a chat question is printed on the same screen as the prompt that invites the answer.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} turn - Turn being run.
 * @param {string} dir - Turn evidence folder.
 * @returns {Promise<Object>} `{status, reason, detail, entries, questionCount}`.
 */
async function waitForSettle(ctx, turn, dir) {
  const adapter = ctx.adapter;
  const entries = (turn.questions || []).map((entry) => ({
    match: entry.match,
    answer: entry.answer,
    optional: entry.optional === true,
    delayMs: drawDelay(entry.delay_ms, ctx.rng, DEFAULT_QUESTION_DELAY_MS),
    re: new RegExp(entry.match),
    consumed: false,
  }));
  const timeoutMs = turn.timeout_ms == null ? DEFAULT_TURN_TIMEOUT_MS : turn.timeout_ms;
  const deadline = Date.now() + timeoutMs;

  let lastScreen = null;
  let changedAt = Date.now();
  let questionCount = 0;

  while (Date.now() < deadline) {
    if (paneDead(ctx)) return { status: 'FAIL', reason: 'SUBJECT_EXITED', entries, questionCount };
    const screen = captureScreen(ctx);
    const question = adapter.parseQuestion(screen);

    // A dialog that asked several questions ends on a review screen. Confirm it once per screen,
    // so a review left on screen while the subject works is not pressed again.
    if (adapter.confirmDetect && adapter.confirmDetect.test(screen) && ctx.lastConfirmScreen !== screen) {
      ctx.lastConfirmScreen = screen;
      sendSteps(ctx, turn.key, 'confirm', adapter.confirm);
      await sleep(POLL_MS);
      continue;
    }

    // A pane's scrollback keeps an answered dialog on screen for the rest of the session. Only a
    // question the runner has not already seen is a new event, otherwise the next turn would read
    // the previous turn's dialog and fail it as unexpected.
    if (question && question.text !== ctx.lastQuestionText) {
      ctx.lastQuestionText = question.text;
      const entry = entries.find((candidate) => !candidate.consumed && candidate.re.test(question.text));
      questionCount += 1;
      writeQuestion(dir, questionCount, screen);
      if (!entry) {
        return {
          status: 'FAIL',
          reason: 'UNEXPECTED_QUESTION',
          detail: firstNonEmptyLine(question.text),
          entries,
          questionCount,
        };
      }
      entry.consumed = true;
      await sleep(entry.delayMs);
      let steps;
      try {
        steps = adapter.answerKeys(question, entry.answer);
      } catch (error) {
        return {
          status: 'FAIL',
          reason: 'ANSWER_UNSUPPORTED',
          detail: error.message,
          entries,
          questionCount,
        };
      }
      if (!Array.isArray(steps) || steps.length === 0) {
        return {
          status: 'FAIL',
          reason: 'ANSWER_UNSUPPORTED',
          detail: question.text,
          entries,
          questionCount,
        };
      }
      sendSteps(ctx, turn.key, 'question', steps);
      lastScreen = null;
      changedAt = Date.now();
      await sleep(POLL_MS);
      continue;
    }

    if (screen !== lastScreen) {
      lastScreen = screen;
      changedAt = Date.now();
    } else if (Date.now() - changedAt >= SETTLE_MS && isIdle(ctx, screen)) {
      // A question asked in plain chat leaves the subject idle, so it is only seen once the screen
      // settles, and only text written after this turn's typed line can hold it.
      const chatText = textAfterSentLine(screen, turn.send, adapter.echoGlyph);
      const chatEntry = entries.find((candidate) => (
        !candidate.consumed
        && candidate.answer
        && typeof candidate.answer.reply === 'string'
        && candidate.re.test(chatText)
      ));
      if (chatEntry) {
        chatEntry.consumed = true;
        questionCount += 1;
        writeQuestion(dir, questionCount, screen);
        await sleep(chatEntry.delayMs);
        sendSteps(ctx, turn.key, 'question', adapter.answerKeys(null, chatEntry.answer));
        lastScreen = null;
        changedAt = Date.now();
        await sleep(POLL_MS);
        continue;
      }
      return { status: 'settled', reason: null, entries, questionCount };
    }
    await sleep(POLL_MS);
  }
  return { status: 'FAIL', reason: 'TIMEOUT', entries, questionCount };
}

/**
 * Apply a turn's input: a typed line, a restart, a compaction, or nothing for a check-only turn.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} turn - Turn being run.
 * @returns {Promise<{status: string, reason?: string, blocker?: string}>} `ok`, `FAIL` or `SKIP`.
 */
async function performInput(ctx, turn) {
  if (typeof turn.send === 'string') {
    sendSteps(ctx, turn.key, 'send', [typeStep(turn.send), keyStep('Enter')]);
    return { status: 'ok' };
  }
  if (turn.action === 'restart') {
    sendSteps(ctx, turn.key, 'exit', ctx.adapter.exitKeys || []);
    const deadline = Date.now() + EXIT_TIMEOUT_MS;
    while (Date.now() < deadline && !paneDead(ctx)) await sleep(POLL_MS);
    stopServer(ctx);
    ctx.panePid = 0;
    try {
      startSubject(ctx, ctx.adapter.resume(ctx));
    } catch (error) {
      return { status: 'FAIL', reason: 'RESTART_FAILED', blocker: error.message };
    }
    if (!(await waitForLaunch(ctx))) return { status: 'FAIL', reason: 'LAUNCH_TIMEOUT' };
    // A restarted subject starts on a fresh screen, so a question it asks again is a new one.
    ctx.lastQuestionText = null;
    return { status: 'ok' };
  }
  if (turn.action === 'compact') {
    if (!ctx.adapter.compact) {
      return { status: 'SKIP', blocker: 'adapter has no compact command yet' };
    }
    sendSteps(ctx, turn.key, 'compact', [typeStep(ctx.adapter.compact), keyStep('Enter')]);
    return { status: 'ok' };
  }
  return { status: 'ok' };
}

/**
 * Run the turn's state check in the scratch project and classify its exit.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} turn - Turn being run.
 * @param {string} dir - Turn evidence folder.
 * @returns {Promise<{status: string, reason: (string|null), blocker: (string|null), observed: string}>} Outcome.
 */
async function runCheck(ctx, turn, dir) {
  const env = {
    ...process.env,
    ...ctx.scriptEnv,
    CONVERSATION_REPO_ROOT: ctx.repoRoot,
    CONVERSATION_RUN_DIR: ctx.outDir,
    CONVERSATION_TURN_DIR: dir,
    CONVERSATION_RUNTIME: ctx.runtime,
  };
  const outcome = await runBoundedCommand({
    command: turn.check,
    cwd: ctx.project,
    env,
    timeoutMs: checkTimeoutMs(),
    ctx,
  });
  mkdirp(dir);
  const checkBody = `$ ${turn.check}\n${outcome.output}`;
  const checkBreak = outcome.output.endsWith('\n') || outcome.output === '' ? '' : '\n';
  const exitLabel = `[exit ${outcome.code}${outcome.timedOut ? ' timeout' : ''}]`;
  fs.writeFileSync(
    path.join(dir, 'check.txt'),
    `${checkBody}${checkBreak}${exitLabel}\n`,
  );
  const observed = lastNonEmptyLine(outcome.output);
  if (outcome.timedOut) {
    return { status: 'FAIL', reason: 'CHECK_TIMEOUT', blocker: null, observed };
  }
  if (outcome.code === 0) return { status: 'PASS', reason: null, blocker: null, observed };
  if (outcome.code === CHECK_EXIT_SKIP) {
    return {
      status: 'SKIP',
      reason: null,
      blocker: firstNonEmptyLine(outcome.output) || 'check reported skip',
      observed,
    };
  }
  return { status: 'FAIL', reason: 'CHECK_FAILED', blocker: null, observed };
}

/**
 * Run one attempt of one turn and leave its evidence behind.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} turn - Turn being run.
 * @param {number} attempt - 1-based attempt number.
 * @returns {Promise<Object>} Turn outcome with status, reason, blocker and observed value.
 */
async function runTurn(ctx, turn, attempt) {
  const dir = turnEvidenceDir(ctx, turn, attempt);
  mkdirp(dir);
  const rawOffset = fileSize(ctx.rawPanePath);

  try {
    await sleep(drawDelay(turn.delay_ms, ctx.rng, DEFAULT_TURN_DELAY_MS));

    const input = await performInput(ctx, turn);
    if (input.status === 'SKIP') {
      fs.writeFileSync(path.join(dir, 'screen.txt'), `${captureScreen(ctx)}\n`);
      writeHistory(ctx, dir);
      appendCheckpoint(ctx, { turn, attempt, status: 'SKIP', evidence: dir, observed: input.blocker });
      return { status: 'SKIP', reason: null, blocker: input.blocker, observed: '' };
    }
    if (input.status !== 'ok') {
      fs.writeFileSync(path.join(dir, 'screen.txt'), `${captureScreen(ctx)}\n`);
      writeHistory(ctx, dir);
      writeRawSlice(ctx, dir, rawOffset);
      appendCheckpoint(ctx, { turn, attempt, status: 'FAIL', evidence: dir, observed: input.reason });
      return { status: 'FAIL', reason: input.reason, blocker: input.blocker || null, observed: '' };
    }

    const settled = await waitForSettle(ctx, turn, dir);
    if (settled.status !== 'settled') {
      fs.writeFileSync(path.join(dir, 'screen.txt'), `${captureScreen(ctx)}\n`);
      writeHistory(ctx, dir);
      writeRawSlice(ctx, dir, rawOffset);
      appendCheckpoint(ctx, { turn, attempt, status: 'FAIL', evidence: dir, observed: settled.reason });
      return {
        status: 'FAIL',
        reason: settled.reason,
        blocker: settled.detail || null,
        observed: '',
      };
    }

    const missing = settled.entries.find((entry) => !entry.consumed && !entry.optional);
    if (missing) {
      fs.writeFileSync(path.join(dir, 'screen.txt'), `${captureScreen(ctx)}\n`);
      writeHistory(ctx, dir);
      writeRawSlice(ctx, dir, rawOffset);
      appendCheckpoint(ctx, { turn, attempt, status: 'FAIL', evidence: dir, observed: 'MISSING_QUESTION' });
      return { status: 'FAIL', reason: 'MISSING_QUESTION', blocker: missing.match, observed: '' };
    }

    // The turn's evidence is saved before the check runs, so a check can read the same files a
    // reviewer inspects afterwards, and the screen still shows the state the check judged.
    fs.writeFileSync(path.join(dir, 'screen.txt'), `${captureScreen(ctx)}\n`);
    writeHistory(ctx, dir);
    writeRawSlice(ctx, dir, rawOffset);
    const check = await runCheck(ctx, turn, dir);
    appendCheckpoint(ctx, {
      turn,
      attempt,
      status: check.status,
      evidence: dir,
      observed: check.reason || check.blocker || check.observed,
    });
    return check;
  } catch (error) {
    if (error.code !== 'SEND_KEYS_FAILED') throw error;
    const stderr = String(error.stderr || error.message);
    fs.writeFileSync(path.join(dir, 'screen.txt'), `${captureScreen(ctx)}\n`);
    writeHistory(ctx, dir);
    writeRawSlice(ctx, dir, rawOffset);
    appendCheckpoint(ctx, { turn, attempt, status: 'FAIL', evidence: dir, observed: stderr });
    return { status: 'FAIL', reason: 'SEND_KEYS_FAILED', blocker: 'SEND_KEYS_FAILED', observed: stderr };
  }
}

/**
 * Run a turn, honouring a single retry before the failure ends the runtime's run.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} turn - Turn being run.
 * @returns {Promise<Object>} Final outcome plus the attempt count.
 */
async function runTurnWithRetry(ctx, turn) {
  const attempts = turn.retry === 1 ? 2 : 1;
  let outcome = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    outcome = await runTurn(ctx, turn, attempt);
    if (outcome.status !== 'FAIL') return { ...outcome, attempts: attempt };
  }
  return { ...outcome, attempts };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EVIDENCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append one row to the run's checkpoint table.
 *
 * @param {Object} ctx - Run context.
 * @param {{turn: Object, attempt: number, status: string, evidence: string, observed: string}} row - Row to write.
 */
function appendCheckpoint(ctx, row) {
  const evidence = path.relative(ctx.outDir, row.evidence) || '.';
  const observed = row.observed == null ? '' : String(row.observed).replace(/[\t\n\r]+/g, ' ');
  fs.appendFileSync(
    ctx.checkpointsPath,
    `${row.turn.id}\t${row.status}\t${row.attempt}\t${evidence}\t${observed}\n`,
  );
}

/**
 * Write one runtime's result document.
 *
 * @param {Object} ctx - Run context.
 * @param {Object} result - Result body.
 */
function writeResult(ctx, result) {
  mkdirp(ctx.outDir);
  fs.writeFileSync(path.join(ctx.outDir, 'result.json'), `${JSON.stringify(result, null, 2)}\n`);
}

/**
 * Write the cross-runtime matrix.
 *
 * @param {string} outDir - Run output folder.
 * @param {Array<Object>} rows - One row per requested runtime.
 */
function writeMatrix(outDir, rows) {
  const lines = [
    '# Conversation Run Matrix',
    '',
    '| Runtime | Verdict | Turns passed | First failure | Evidence |',
    '|---------|---------|--------------|---------------|----------|',
  ];
  for (const row of rows) {
    const firstFailure = row.firstFailure || (row.verdict === 'FAIL' ? row.blocker : null);
    lines.push(
      `| ${row.runtime} | ${row.verdict} | ${row.passed}/${row.total} | ${firstFailure || '-'} | ${row.evidence} |`,
    );
  }
  fs.writeFileSync(path.join(outDir, 'matrix.md'), `${lines.join('\n')}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. RUNTIME RUNS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the per-runtime run context.
 *
 * @param {Object} options - Everything one runtime's run needs.
 * @returns {Object} Run context.
 */
function createContext(options) {
  const outDir = path.join(options.out, options.runtime);
  mkdirp(outDir);
  const ctx = {
    runtime: options.runtime,
    sandbox: sandboxMode(options.runtime, options.noSandbox),
    adapter: options.adapter,
    trustHooks: Boolean(options.script && options.script.trust_hooks === true),
    project: options.project,
    outDir,
    outRoot: options.out,
    repoRoot: options.repoRoot,
    watched: options.watched,
    scriptEnv: options.scriptEnv,
    rng: options.rng,
    seed: options.seed,
    socket: socketName(options.runtime),
    sessionId: crypto.randomUUID(),
    panePid: 0,
    lastQuestionText: null,
    children: new Set(),
    cleaned: false,
    cleanupResult: null,
    confPath: path.join(outDir, 'tmux.conf'),
    actionsPath: path.join(outDir, 'actions.jsonl'),
    rawPanePath: path.join(outDir, 'raw-pane.log'),
    checkpointsPath: path.join(outDir, 'checkpoints.tsv'),
  };
  return ctx;
}

/**
 * Run one runtime end to end: prepare, launch, play the turns, snapshot, clean up, report.
 *
 * @param {Object} options - Script, adapters and paths for this run.
 * @returns {Promise<Object>} Matrix row for the runtime.
 */
async function runRuntime(options) {
  const { runtime, adapter, turns, out } = options;
  const ctx = createContext({ ...options, adapter });
  activeContexts.add(ctx);
  if (ctx.sandbox === 'unavailable') {
    writeDiagnostic(`${runtime}: subject runs unsandboxed because macOS sandbox-exec is unavailable`);
  }

  fs.writeFileSync(ctx.actionsPath, '');
  fs.writeFileSync(ctx.checkpointsPath, 'turn\tstatus\tattempts\tevidence\tobserved\n');

  const startedAt = new Date().toISOString();
  const before = snapshotRepo(ctx.repoRoot, ctx.watched, ctx.outRoot);
  fs.writeFileSync(path.join(ctx.outDir, 'repo-before.txt'), before.join('\n'));

  const results = [];
  let blocker = null;
  let failureReason = null;
  let isAborted = false;

  try {
    if (adapter.hookTrust && ctx.trustHooks) {
      ctx.hookTrustSnapshot = captureHookTrust(codexConfigPath(), ctx.project);
    }
    startSubject(ctx, adapter.launch(ctx));
    const launched = await waitForLaunch(ctx);
    if (ctx.hookTrustRefused) {
      blocker = 'HOOK_TRUST_OUTSIDE_PROJECT';
      isAborted = true;
    } else if (!launched) {
      const quotaLine = detectQuotaScreen(captureScreen(ctx));
      if (quotaLine) {
        failureReason = 'QUOTA_EXHAUSTED';
        blocker = quotaLine;
      } else {
        blocker = 'LAUNCH_TIMEOUT';
      }
      isAborted = true;
    }
  } catch (error) {
    blocker = error.code === 'SEND_KEYS_FAILED' ? 'SEND_KEYS_FAILED' : `LAUNCH_FAILED: ${error.message}`;
    isAborted = true;
  }

  for (const turn of turns) {
    if (isAborted) {
      const reason = failureReason || blocker;
      results.push({
        turn,
        status: 'FAIL',
        reason,
        blocker: reason === 'QUOTA_EXHAUSTED' ? blocker : null,
        observed: '',
        attempts: 0,
        notRun: true,
      });
      appendCheckpoint(ctx, {
        turn,
        attempt: 0,
        status: 'NOT_RUN',
        evidence: path.join(ctx.outDir, 'turns', turn.key),
        observed: reason || '',
      });
      continue;
    }
    const outcome = await runTurnWithRetry(ctx, turn);
    if (outcome.status === 'FAIL') {
      const quotaLine = detectQuotaScreen(captureScreen(ctx));
      if (quotaLine) {
        outcome.reason = 'QUOTA_EXHAUSTED';
        outcome.blocker = quotaLine;
      }
    }
    results.push({ turn, ...outcome });
    if (outcome.status === 'FAIL') {
      failureReason = outcome.reason;
      blocker = blocker || (
        outcome.reason === 'QUOTA_EXHAUSTED' ? outcome.blocker : outcome.reason
      );
      isAborted = true;
    }
  }

  const cleanup = cleanupContext(ctx);

  const after = snapshotRepo(ctx.repoRoot, ctx.watched, ctx.outRoot);
  fs.writeFileSync(path.join(ctx.outDir, 'repo-after.txt'), after.join('\n'));
  const isSnapshotIncomplete = [before, after].some((snapshot) => (
    snapshot.some((line) => line.startsWith('!'))
  ));
  const repoChanged = isSnapshotIncomplete ? null : !snapshotsMatch(before, after);

  let verdict = ctx.hookTrustRefused ? 'FAIL' : 'PASS';
  if (results.some((entry) => entry.status === 'FAIL')) verdict = 'FAIL';
  else if (results.every((entry) => entry.status === 'SKIP')) verdict = 'SKIP';
  if (repoChanged) {
    verdict = 'FAIL';
    blocker = blocker || 'REPO_CHANGED';
  }
  if (!cleanup.ok) {
    verdict = 'FAIL';
    blocker = blocker || 'CLEANUP_INCOMPLETE';
  }
  if (!blocker && results.some((entry) => entry.status === 'SKIP')) {
    const skipped = results.find((entry) => entry.status === 'SKIP');
    blocker = skipped.blocker || null;
  }
  const hookTrust = ctx.hookTrustResult || null;
  if (hookTrust && !hookTrust.ok) {
    verdict = 'FAIL';
    blocker = 'HOOK_TRUST_NOT_UNDONE';
  }
  if (ctx.hookTrustRefused) {
    verdict = 'FAIL';
    blocker = 'HOOK_TRUST_OUTSIDE_PROJECT';
  }
  if (isSnapshotIncomplete) {
    verdict = 'FAIL';
    blocker = 'SNAPSHOT_INCOMPLETE';
  }

  const passed = results.filter((entry) => entry.status === 'PASS').length;
  const firstFailure = results.find((entry) => entry.status === 'FAIL');

  const result = {
    runtime,
    verdict,
    blocker,
    seed: ctx.seed,
    socket: ctx.socket,
    session_id: ctx.sessionId,
    project: ctx.project,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    adapter: { bin: adapter.bin, probed: adapter.probed },
    repo: {
      changed: repoChanged,
      watched: ctx.watched,
      before: 'repo-before.txt',
      after: 'repo-after.txt',
    },
    cleanup,
    hook_trust: hookTrust,
    sandbox: ctx.sandbox,
    send_keys_stderr: ctx.sendKeysError || null,
    turns: results.map((entry) => ({
      id: entry.turn.id,
      status: entry.status,
      attempts: entry.attempts,
      reason: entry.reason || null,
      blocker: entry.blocker || null,
      observed: entry.observed || '',
      evidence: path.relative(ctx.outDir, path.join(ctx.outDir, 'turns', entry.turn.key)) || '.',
    })),
  };
  writeResult(ctx, result);
  if (ctx.sendKeysError) writeDiagnostic(`tmux send-keys stderr (${runtime}): ${ctx.sendKeysError}`);

  return {
    runtime,
    verdict,
    passed,
    total: turns.length,
    firstFailure: firstFailure ? `${firstFailure.turn.id} ${firstFailure.reason}` : null,
    evidence: path.relative(options.out, ctx.outDir) || '.',
    blocker,
  };
}

/**
 * Record a runtime that never started, so its row still explains itself.
 *
 * @param {string} runtime - Runtime id.
 * @param {string} out - Run output folder.
 * @param {string} blocker - Why the runtime was skipped.
 * @param {number} total - Turns the script asked for.
 * @returns {Object} Matrix row.
 */
function skipRuntime(runtime, out, blocker, total, noSandbox) {
  const outDir = path.join(out, runtime);
  mkdirp(outDir);
  const ctx = { outDir, runtime };
  writeResult(ctx, {
    runtime,
    verdict: 'SKIP',
    blocker,
    hook_trust: null,
    sandbox: sandboxMode(runtime, noSandbox),
    turns: [],
  });
  return { runtime, verdict: 'SKIP', passed: 0, total, firstFailure: blocker, evidence: runtime, blocker };
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. CLI
// ─────────────────────────────────────────────────────────────────────────────

/** @returns {string} Usage text. */
function usage() {
  return [
    'Usage: node run-conversation-scenario.cjs --scenario <file.md> --runtime <id[,id...]>',
    '       --scratch <dir> --out <dir> [--seed N] [--overwrite] [--repo-root <dir>]',
    '',
    'Plays a scenario\'s json conversation block into each runtime\'s interactive CLI inside a',
    'marked scratch project, then writes screens, checks and a matrix as evidence.',
    '',
    'Options:',
    '  --scenario PATH     Scenario markdown holding the json conversation block',
    '  --runtime LIST      Comma separated runtime ids',
    '  --scratch DIR       Scratch root, outside this repository',
    `  --out DIR           Evidence root, one subfolder per runtime`,
    '  --seed N            Seed for a [min, max] delay pair',
    '  --overwrite         Replace existing evidence for a runtime',
    '  --repo-root DIR     Repository to snapshot (default: git top level)',
    '  --no-sandbox        Disable the macOS write sandbox wrapper',
    '  --help              Show this message',
    '',
    'Exit: 0 every runtime PASS or SKIP, 1 any FAIL, 2 usage error or refusal.',
  ].join('\n');
}

/**
 * Parse the command line.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @returns {Object} Options plus a list of errors.
 */
function parseArgs(argv) {
  const opts = {
    scenario: null,
    runtimeList: null,
    scratch: null,
    out: null,
    seed: null,
    overwrite: false,
    repoRoot: null,
    noSandbox: false,
    help: false,
    errors: [],
  };
  const take = (index, flag) => {
    if (index + 1 >= argv.length) {
      opts.errors.push(`${flag} needs a value`);
      return null;
    }
    return argv[index + 1];
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--overwrite') opts.overwrite = true;
    else if (arg === '--no-sandbox') opts.noSandbox = true;
    else if (arg === '--scenario') {
      opts.scenario = take(index, arg);
      index += 1;
    } else if (arg === '--runtime') {
      opts.runtimeList = take(index, arg);
      index += 1;
    } else if (arg === '--scratch') {
      opts.scratch = take(index, arg);
      index += 1;
    } else if (arg === '--out') {
      opts.out = take(index, arg);
      index += 1;
    } else if (arg === '--repo-root') {
      opts.repoRoot = take(index, arg);
      index += 1;
    } else if (arg === '--seed') {
      const value = take(index, arg);
      index += 1;
      const seed = Number.parseInt(value == null ? '' : value, 10);
      if (Number.isInteger(seed)) opts.seed = seed;
      else opts.errors.push('--seed needs an integer');
    } else {
      opts.errors.push(`unknown argument: ${arg}`);
    }
  }
  if (opts.help) return opts;
  if (!opts.scenario) opts.errors.push('--scenario is required');
  if (!opts.runtimeList) opts.errors.push('--runtime is required');
  if (!opts.scratch) opts.errors.push('--scratch is required');
  if (!opts.out) opts.errors.push('--out is required');
  return opts;
}

/**
 * Read the scenario and parse its conversation block. The runner reads a script only through the
 * package validator's parser, so the runner and the validator cannot disagree about the format.
 *
 * @param {string} scenarioPath - Scenario file.
 * @returns {{ok: boolean, script: (Object|null), message: (string|null), findings: Array<Object>}}
 * Parsed script or a refusal.
 */
function loadScript(scenarioPath) {
  let text;
  try {
    text = fs.readFileSync(scenarioPath, 'utf8');
  } catch (error) {
    return { ok: false, script: null, message: `cannot read scenario: ${error.message}`, findings: [] };
  }
  const { script, findings } = parseConversationScript(text);
  if (!script) {
    return {
      ok: false,
      script: null,
      message: 'no json conversation block found',
      findings: findings || [],
    };
  }
  if (findings && findings.length > 0) {
    return { ok: false, script: null, message: null, findings };
  }
  return { ok: true, script, message: null, findings: [] };
}

/**
 * Turn a turn's script entry into the runner's internal shape.
 *
 * @param {Object} turn - Script turn.
 * @param {number} index - 0-based position.
 * @returns {Object} Turn with a stable id and an evidence folder name.
 */
function normalizeTurn(turn, index) {
  const id = typeof turn.id === 'string' && turn.id.trim() !== '' ? turn.id.trim() : String(index + 1);
  const key = id.replace(/[^a-zA-Z0-9._-]/g, '-');
  return { ...turn, id, key: key === '' ? String(index + 1) : key };
}

/**
 * Resolve the repository root that is snapshotted and that the scratch may not sit inside.
 *
 * @param {string|null} explicit - `--repo-root` value.
 * @returns {string} Absolute repository root, or the working directory when git cannot answer.
 */
function resolveRepoRoot(explicit) {
  if (explicit) return resolveThroughExistingAncestor(explicit);
  const result = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  if (result.status === 0 && String(result.stdout).trim() !== '') {
    return fs.realpathSync(String(result.stdout).trim());
  }
  return fs.realpathSync(process.cwd());
}

/**
 * Decide whether an existing evidence folder blocks the run.
 *
 * @param {string} outDir - Runtime evidence folder.
 * @param {boolean} overwrite - Whether `--overwrite` was given.
 * @returns {string|null} Refusal message, or null when the folder may be used.
 */
function inspectOutDir(outDir, overwrite) {
  if (!fs.existsSync(outDir)) return null;
  const entries = fs.readdirSync(outDir);
  if (entries.length === 0) return null;
  if (overwrite) return null;
  return `refusing to reuse a non-empty evidence folder without --overwrite: ${outDir}`;
}

/**
 * Test whether a runtime's program can be found.
 *
 * @param {string} bin - Program name or absolute path.
 * @returns {boolean} True when the shell can resolve it.
 */
function binExists(bin) {
  const result = spawnSync('bash', ['-c', `command -v ${quoteForShell(bin)}`], { encoding: 'utf8' });
  return result.status === 0 && String(result.stdout).trim() !== '';
}

/**
 * Load a scenario and play it into each requested runtime.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @returns {Promise<number>} Process exit code.
 */
async function main(argv) {
  installSignalHandlers();
  const opts = parseArgs(argv);
  if (opts.help) {
    process.stdout.write(`${usage()}\n`);
    return EXIT_PASS;
  }
  if (opts.errors.length > 0) {
    for (const error of opts.errors) writeDiagnostic(`usage: ${error}`);
    writeDiagnostic(usage());
    return EXIT_USAGE;
  }

  const runtimeIds = opts.runtimeList
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (runtimeIds.length === 0) {
    writeDiagnostic('usage: --runtime needs at least one runtime id');
    return EXIT_USAGE;
  }

  const missing = missingAdapters();
  if (missing.length > 0) {
    writeDiagnostic(`runner is missing adapters for: ${missing.join(', ')}`);
    return EXIT_USAGE;
  }

  const { errors, byId } = resolveAdapters(runtimeIds);
  if (errors.length > 0) {
    for (const error of errors) writeDiagnostic(`usage: ${error}`);
    return EXIT_USAGE;
  }

  const loaded = loadScript(opts.scenario);
  if (!loaded.ok) {
    if (loaded.message) writeDiagnostic(`scenario: ${loaded.message}`);
    for (const finding of loaded.findings) {
      writeDiagnostic(`scenario: ${opts.scenario}:${finding.line || 0} ${finding.path}: ${finding.message}`);
    }
    return EXIT_USAGE;
  }
  const script = loaded.script;
  const turns = script.turns.map(normalizeTurn);
  const scriptRuntimes = Array.isArray(script.runtimes) ? script.runtimes : [];

  const out = path.resolve(opts.out);
  const scratch = path.resolve(opts.scratch);
  const repoRoot = resolveRepoRoot(opts.repoRoot);
  const watched = watchedSubfolders();
  const seed = opts.seed == null ? crypto.randomInt(0, 2 ** 31) : opts.seed;
  const rng = mulberry32(seed);

  for (const runtime of runtimeIds) {
    const refusal = inspectOutDir(path.join(out, runtime), opts.overwrite);
    if (refusal) {
      writeDiagnostic(refusal);
      return EXIT_USAGE;
    }
  }

  const planned = runtimeIds.map((runtime) => {
    const adapter = byId[runtime];
    let skip = null;
    // The test double stands in for any runtime, so the script's own list does not restrict it.
    if (runtime !== 'fake' && !scriptRuntimes.includes(runtime)) {
      skip = `scenario does not list runtime: ${runtime}`;
    } else if (!binExists(adapter.bin)) {
      skip = `binary not found: ${adapter.bin}`;
    }
    return { runtime, adapter, skip };
  });

  // Check every runtime path before removing evidence or running any setup commands.
  let guardRefusal = null;
  for (const entry of planned) {
    if (entry.skip) continue;
    const guard = checkScratch({
      scratch,
      repoRoot,
      runtime: entry.runtime,
    });
    if (!guard.ok) {
      guardRefusal = guardRefusal || guard;
      continue;
    }
    entry.project = guard.project;
  }

  if (guardRefusal) {
    writeDiagnostic(`refused (${guardRefusal.code}): ${guardRefusal.message}`);
    return EXIT_USAGE;
  }

  // Setup changes are compared against a repository snapshot taken after every path guard passes.
  const setupRepoBefore = planned.some((entry) => !entry.skip)
    ? snapshotRepo(repoRoot, watched, out)
    : null;
  for (const entry of planned) {
    if (entry.skip) continue;
    const outDir = path.join(out, entry.runtime);
    if (opts.overwrite) fs.rmSync(outDir, { recursive: true, force: true });
    mkdirp(outDir);
    const guard = await prepareScratch({
      scratch,
      repoRoot,
      runtime: entry.runtime,
      setup: script.setup || [],
    });
    // A refused setup leaves the evidence folder empty, so a rerun is not refused for reusing it.
    if (!guard.ok) {
      guardRefusal = guard;
      break;
    }
    fs.writeFileSync(path.join(outDir, 'setup.log'), guard.setupOutput);
    if (guard.skip) {
      entry.skip = guard.blocker;
      continue;
    }
    entry.project = guard.project;
  }

  if (setupRepoBefore !== null) {
    const setupRepoAfter = snapshotRepo(repoRoot, watched, out);
    if (!snapshotsMatch(setupRepoBefore, setupRepoAfter)) {
      const beforePath = path.join(out, 'setup-repo-before.txt');
      const afterPath = path.join(out, 'setup-repo-after.txt');
      mkdirp(out);
      fs.writeFileSync(beforePath, setupRepoBefore.join('\n'));
      fs.writeFileSync(afterPath, setupRepoAfter.join('\n'));
      writeDiagnostic(
        `refused (SETUP_CHANGED_REPO): setup changed watched repository state; see ${beforePath} and ${afterPath}`,
      );
      return EXIT_USAGE;
    }
  }

  if (guardRefusal) {
    writeDiagnostic(`refused (${guardRefusal.code}): ${guardRefusal.message}`);
    return EXIT_USAGE;
  }

  const rows = [];
  for (const entry of planned) {
    if (entry.skip) {
      process.stdout.write(`runtime ${entry.runtime}: SKIP ${entry.skip}\n`);
      rows.push(skipRuntime(entry.runtime, out, entry.skip, turns.length, opts.noSandbox));
      continue;
    }
    process.stdout.write(`runtime ${entry.runtime}: socket ${socketName(entry.runtime)}\n`);
    const row = await runRuntime({
      runtime: entry.runtime,
      adapter: entry.adapter,
      script,
      turns,
      out,
      scratch,
      repoRoot,
      watched,
      project: entry.project,
      scriptEnv: script.env || {},
      rng,
      seed,
      overwrite: opts.overwrite,
      noSandbox: opts.noSandbox,
    });
    process.stdout.write(
      `runtime ${entry.runtime}: ${row.verdict} ${row.passed}/${row.total}${row.blocker ? ` ${row.blocker}` : ''}\n`,
    );
    rows.push(row);
  }

  writeMatrix(out, rows);
  return rows.some((row) => row.verdict === 'FAIL') ? EXIT_FAIL : EXIT_PASS;
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  main,
  ADAPTERS,
  sandboxDenyPaths,
  sandboxPolicy,
  mulberry32,
  snapshotRepo,
  guardScratch,
  textAfterSentLine,
  detectQuotaScreen,
  codexConfigPath,
  readHookTrustConfig,
  countProjectHookHandlers,
  parseHookTrustTables,
  captureHookTrust,
  restoreHookTrust,
  parseOpenCodeQuestion,
  parseCodexQuestion,
  findOptionIndex,
};

if (require.main === module) {
  main(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      writeDiagnostic(`run-conversation-scenario: ${error && error.stack ? error.stack : error}`);
      cleanupAll();
      process.exitCode = EXIT_FAIL;
    });
}
