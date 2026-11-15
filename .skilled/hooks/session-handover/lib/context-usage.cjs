// ───────────────────────────────────────────────────────────────────
// MODULE: Session Handover Context Usage
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TAIL_BYTES = 262144;
// A single tool result or image row can outgrow the default tail, so a miss widens the
// read up to this bound before the usage counts as absent.
const MAX_TAIL_BYTES = 16 * 1024 * 1024;
// Provider model names announce the million-token window with this marker.
const LARGE_WINDOW_MARKER = '[1m]';
const LARGE_WINDOW_TOKENS = 1000000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function settingsWindow(filePath) {
  try {
    const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return positiveNumber(settings?.autoCompactWindow);
  } catch {
    return null;
  }
}

function readTail(filePath, tailBytes) {
  const fileDescriptor = fs.openSync(filePath, 'r');
  try {
    const size = fs.fstatSync(fileDescriptor).size;
    const requestedBytes = Number(tailBytes);
    const byteCount = Number.isFinite(requestedBytes)
      ? Math.max(0, Math.floor(requestedBytes))
      : DEFAULT_TAIL_BYTES;
    const start = Math.max(0, size - byteCount);
    const buffer = Buffer.alloc(size - start);
    let bytesRead = 0;
    while (bytesRead < buffer.length) {
      const count = fs.readSync(
        fileDescriptor,
        buffer,
        bytesRead,
        buffer.length - bytesRead,
        start + bytesRead,
      );
      if (count === 0) break;
      bytesRead += count;
    }
    return { text: buffer.subarray(0, bytesRead).toString('utf8'), startsAtBeginning: start === 0 };
  } finally {
    fs.closeSync(fileDescriptor);
  }
}

function parseTranscriptEntry(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

// Returns the last entry `matches` accepts, widening the tail while the read starts
// mid-file and holds no match. A read error propagates to the caller.
function latestTailEntry(transcriptPath, tailBytes, matches) {
  return latestTailEntryWithTrail(transcriptPath, tailBytes, matches).entry;
}

// A tail read can begin mid-row, so the partial first line is dropped, and blank or
// unparsable rows are skipped, leaving the entries in the order they were written.
function tailEntries(tail) {
  const lines = tail.text.split(/\r?\n/);
  if (
    !tail.startsAtBeginning
    && lines.length > 0
    && parseTranscriptEntry(lines[0]) === null
  ) {
    lines.shift();
  }

  const entries = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const entry = parseTranscriptEntry(line);
    if (entry !== null) entries.push(entry);
  }
  return entries;
}

// Same search, also returning the parsed entries written after the match, in order.
function latestTailEntryWithTrail(transcriptPath, tailBytes, matches) {
  let byteCount = tailBytes;
  for (;;) {
    const tail = readTail(transcriptPath, byteCount);
    let latest = null;
    let trail = [];
    for (const entry of tailEntries(tail)) {
      if (matches(entry)) {
        latest = entry;
        trail = [];
      } else {
        trail.push(entry);
      }
    }
    if (latest !== null || tail.startsAtBeginning || byteCount >= MAX_TAIL_BYTES) {
      return { entry: latest, trail };
    }
    byteCount = Math.min(Math.max(byteCount * 4, DEFAULT_TAIL_BYTES), MAX_TAIL_BYTES);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read the most recent main-chain assistant usage from a transcript tail.
 *
 * @param {string} transcriptPath - Claude JSONL transcript path.
 * @param {{tailBytes?: number}} [options] - Maximum transcript bytes to read.
 * @returns {{fillTokens: number, model: string|null}|null} Usage, or null when no
 * assistant entry exists or the transcript cannot be read.
 */
function readClaudeFill(transcriptPath, { tailBytes = DEFAULT_TAIL_BYTES } = {}) {
  let lastAssistant;
  try {
    lastAssistant = latestTailEntry(
      transcriptPath,
      tailBytes,
      (entry) => entry.type === 'assistant' && entry.isSidechain !== true,
    );
  } catch {
    return null;
  }
  if (lastAssistant === null) return null;

  const usage = lastAssistant.message?.usage || lastAssistant.usage || {};
  const fillTokens = ['input_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens']
    .reduce((total, key) => total + (positiveNumber(usage[key]) ?? 0), 0);
  return { fillTokens, model: lastAssistant.message?.model ?? null };
}

// A model or effort comes back as a trimmed string, or '' when the entry holds none, so a
// caller can tell "not proven" from a value without checking types.
function settingText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const LOCAL_COMMAND_PATTERN = /<command-name>\/(model|effort)<\/command-name>[\s\S]*?<command-args>([\s\S]*?)<\/command-args>/;
const LOCAL_COMMAND_STDOUT_PATTERN = /<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/;
const MODEL_SET_PATTERN = /^Set model to `([^`]+)`/;
const EFFORT_SET_PATTERN = /^Set effort level to ([A-Za-z]+)\b/;
const MODEL_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:[\]-]*$/;
// Terminal colour codes are presentation, not part of the confirmation text.
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

function entryText(entry) {
  const content = entry.message?.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part) => (typeof part?.text === 'string' ? part.text : '')).join('');
}

// The id a confirmed /model switch moved to. Typed arguments are the id or alias Claude
// accepted, and the picker leaves them empty and confirms with a display name, which is an id
// only when it looks like one. '' means the switch happened but its id is not proven.
function switchedModel(args, confirmedName) {
  const typed = args.trim();
  if (typed !== '') return typed;
  return MODEL_ID_PATTERN.test(confirmedName) ? confirmedName : '';
}

// Claude writes a /model or /effort switch to the log as soon as it is confirmed, as a
// command entry followed by its stdout, so a switch made after the last assistant turn is
// still the session's current setting. A cancelled or failed command confirms nothing.
function applyLocalSwitches(settings, entries) {
  let { model, effort } = settings;
  let effortSwitched = false;
  let pending = null;
  for (const entry of entries) {
    if (entry.type !== 'user' || entry.isSidechain === true) continue;
    const text = entryText(entry);
    const command = LOCAL_COMMAND_PATTERN.exec(text);
    if (command !== null) {
      pending = { name: command[1], args: command[2] };
      continue;
    }
    const stdout = LOCAL_COMMAND_STDOUT_PATTERN.exec(text);
    if (pending === null || stdout === null) continue;
    const confirmation = stdout[1].replace(ANSI_PATTERN, '').trim();
    if (pending.name === 'effort') {
      const level = EFFORT_SET_PATTERN.exec(confirmation);
      if (level !== null) {
        effort = level[1];
        effortSwitched = true;
      }
    } else {
      const confirmed = MODEL_SET_PATTERN.exec(confirmation);
      const nextModel = confirmed === null ? null : switchedModel(pending.args, confirmed[1]);
      // An effort belongs to the model it was chosen for, so the old turn's effort does not
      // follow the session onto a new model; an effort switched on its own still does.
      if (nextModel !== null && nextModel !== model) {
        model = nextModel;
        if (!effortSwitched) effort = '';
      }
    }
    pending = null;
  }
  return { model, effort };
}

/**
 * Read the model, effort and name the main Claude session runs on now: the last main-chain
 * assistant turn, updated by any /model or /effort switch confirmed after it, and the last
 * /rename title. The title sits wherever the operator renamed, often before the last turn,
 * so it needs a tail search of its own. The title Claude generated for the session is read
 * the same way and reported apart, because it names the session only while nothing else does.
 *
 * @param {string} transcriptPath - Claude JSONL transcript path.
 * @param {{tailBytes?: number}} [options] - Maximum transcript bytes to read.
 * @returns {{model: string, effort: string, name: string, generatedName?: string}|null} The
 * values, `''` for each one the log does not prove, with `generatedName` present only when
 * the log holds a generated title, or null when neither an assistant entry nor a title
 * exists, or the transcript cannot be read.
 */
function readClaudeSettings(transcriptPath, { tailBytes = DEFAULT_TAIL_BYTES } = {}) {
  let found;
  let name = '';
  let generatedName = '';
  try {
    found = latestTailEntryWithTrail(
      transcriptPath,
      tailBytes,
      (entry) => entry.type === 'assistant' && entry.isSidechain !== true,
    );
    const title = latestTailEntry(
      transcriptPath,
      tailBytes,
      (entry) => entry.type === 'custom-title' && settingText(entry.customTitle) !== '',
    );
    if (title !== null) name = settingText(title.customTitle);
    const generated = latestTailEntry(
      transcriptPath,
      tailBytes,
      (entry) => entry.type === 'ai-title' && settingText(entry.aiTitle) !== '',
    );
    if (generated !== null) generatedName = settingText(generated.aiTitle);
  } catch {
    return null;
  }
  const lastAssistant = found.entry;
  let fromTurn = { model: '', effort: '' };
  if (lastAssistant !== null) {
    // The session's own request names the model it asked for, which is what a relaunch has
    // to ask for too. The response model is the fallback, and a synthetic marker is no model.
    const model = settingText(lastAssistant.requestedModel)
      || settingText(lastAssistant.message?.model);
    fromTurn = {
      model: model.startsWith('<') ? '' : model,
      effort: settingText(lastAssistant.effort),
    };
  }
  const settings = applyLocalSwitches(fromTurn, found.trail);
  if (lastAssistant === null && settings.model === '' && settings.effort === ''
    && name === '' && generatedName === '') {
    return null;
  }
  return { ...settings, name, ...(generatedName === '' ? {} : { generatedName }) };
}

/**
 * Read the model and effort of the latest Codex turn from a rollout tail.
 *
 * @param {string} rolloutPath - Codex rollout JSONL path.
 * @param {{tailBytes?: number}} [options] - Maximum rollout bytes to read.
 * @returns {{model: string, effort: string}|null} The values, or null when the rollout
 * holds no turn context or cannot be read.
 */
function readCodexSettings(rolloutPath, { tailBytes = DEFAULT_TAIL_BYTES } = {}) {
  let latestTurn;
  try {
    latestTurn = latestTailEntry(
      rolloutPath,
      tailBytes,
      (entry) => entry.type === 'turn_context' && typeof entry.payload === 'object',
    );
  } catch {
    return null;
  }
  if (latestTurn === null) return null;
  return {
    model: settingText(latestTurn.payload.model),
    effort: settingText(latestTurn.payload.effort),
  };
}

/** Read the latest Codex rollout token count from a transcript tail. */
function readCodexUsage(transcriptPath, { tailBytes = DEFAULT_TAIL_BYTES } = {}) {
  let latestCount;
  try {
    latestCount = latestTailEntry(
      transcriptPath,
      tailBytes,
      (entry) => entry.type === 'event_msg' && entry.payload?.type === 'token_count',
    );
  } catch {
    return null;
  }
  const latestInfo = latestCount?.payload.info ?? null;
  if (latestInfo === null) return null;

  return {
    fillTokens: tokenCount(latestInfo.last_token_usage?.input_tokens),
    modelContextWindow: positiveNumber(latestInfo.model_context_window),
  };
}

/** Prefer the shared window override to the window recorded by Codex. */
function resolveCodexWindow(modelContextWindow, env = process.env) {
  return positiveNumber(env?.SESSION_HANDOVER_WINDOW_TOKENS)
    ?? positiveNumber(modelContextWindow);
}

const VIBE_JOURNAL_NAME = /^\d+\.jsonl$/;

// A segment is named by a zero-padded counter, so a numeric sort puts the newest one first
// however wide the counter grows.
function vibeJournalSegments(sessionRoot) {
  const directory = path.join(sessionRoot, 'journal');
  return fs.readdirSync(directory)
    .filter((name) => VIBE_JOURNAL_NAME.test(name))
    .sort((left, right) => Number.parseInt(right, 10) - Number.parseInt(left, 10))
    .map((name) => path.join(directory, name));
}

// A compaction's summarizer call is a model call too, and its input is the whole context it is
// about to replace, so its usage describes a window the session no longer carries. The intent
// names the compaction it serves, which is what tells its result apart from the turn whose fill
// the session actually starts from.
function compactionSummarizerIds(entries) {
  const ids = new Set();
  for (const entry of entries) {
    if (entry.type !== 'action_intent') continue;
    if (entry.payload?.request?.compaction_id === undefined) continue;
    const actionId = entry.payload?.action_id;
    if (typeof actionId === 'string') ids.add(actionId);
  }
  return ids;
}

function segmentFillTokens(segmentPath) {
  let byteCount = DEFAULT_TAIL_BYTES;
  for (;;) {
    const tail = readTail(segmentPath, byteCount);
    const entries = tailEntries(tail);
    const summarizerIds = compactionSummarizerIds(entries);
    let latest = null;
    for (const entry of entries) {
      if (entry.type !== 'action_result') continue;
      if (summarizerIds.has(entry.payload?.action_id)) continue;
      const inputTokens = positiveNumber(entry.payload?.result?.result?.usage?.input_tokens);
      if (inputTokens !== null) latest = inputTokens;
    }
    if (latest !== null || tail.startsAtBeginning || byteCount >= MAX_TAIL_BYTES) return latest;
    byteCount = Math.min(Math.max(byteCount * 4, DEFAULT_TAIL_BYTES), MAX_TAIL_BYTES);
  }
}

// The newest segment can be empty while the turn that filled it is still being written, so a
// segment without a counted model call falls through to the one before it.
function vibeFillTokens(sessionRoot) {
  for (const segmentPath of vibeJournalSegments(sessionRoot)) {
    const fillTokens = segmentFillTokens(segmentPath);
    if (fillTokens !== null) return fillTokens;
  }
  return null;
}

// The threshold lives in the runtime state of the generation the session is on, so the state
// of a generation the session left behind is never the answer.
function vibeCompactionThreshold(sessionRoot) {
  try {
    const current = JSON.parse(fs.readFileSync(path.join(sessionRoot, 'CURRENT'), 'utf8'));
    const generation = typeof current?.generation === 'string' ? current.generation.trim() : '';
    if (generation === '') return null;
    const statePath = path.join(sessionRoot, 'generations', generation, 'runtime-state.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return positiveNumber(state?.core_settings?.context?.model_facts?.compaction_threshold);
  } catch {
    return null;
  }
}

/**
 * Read the latest Vibe model-call usage from a session's journal segments.
 *
 * @param {string} sessionRoot - Vibe session folder holding `CURRENT` and `journal`.
 * @returns {{fillTokens: number, compactionThreshold: number|null}|null} Usage, with a
 * null threshold when the runtime state records none, or null when no segment holds a
 * model call or the journal cannot be read.
 */
function readVibeUsage(sessionRoot) {
  let fillTokens;
  try {
    fillTokens = vibeFillTokens(sessionRoot);
  } catch {
    return null;
  }
  if (fillTokens === null) return null;
  return { fillTokens, compactionThreshold: vibeCompactionThreshold(sessionRoot) };
}

/** Prefer the shared window override to the window recorded by Vibe. */
function resolveVibeWindow(compactionThreshold, env = process.env) {
  return positiveNumber(env?.SESSION_HANDOVER_WINDOW_TOKENS)
    ?? positiveNumber(compactionThreshold);
}

// A session can start in a subdirectory while the project settings sit at the repository
// root, so the walk climbs to the directory holding `.git` (a directory, or a file in a
// worktree). Outside a repository there is no boundary to stop at, so only the cwd counts.
function projectDirectories(cwd) {
  const directories = [];
  let directory = path.resolve(cwd);
  for (;;) {
    directories.push(directory);
    if (fs.existsSync(path.join(directory, '.git'))) return directories;
    const parent = path.dirname(directory);
    if (parent === directory) return [path.resolve(cwd)];
    directory = parent;
  }
}

/**
 * Resolve the context window from the configured setting sources.
 *
 * @param {{env?: NodeJS.ProcessEnv, cwd?: string, home?: string, model?: string}}
 *   [options] - Runtime paths and model.
 * @returns {number|null} Configured window, or null when unknown.
 */
function resolveWindow({
  env = process.env,
  cwd = process.cwd(),
  home = env.HOME || os.homedir(),
  model = '',
} = {}) {
  const fromEnvironment = positiveNumber(env.SESSION_HANDOVER_WINDOW_TOKENS);
  if (fromEnvironment !== null) return fromEnvironment;

  const settingsPaths = [];
  for (const directory of projectDirectories(cwd)) {
    settingsPaths.push(
      path.join(directory, '.claude', 'settings.local.json'),
      path.join(directory, '.claude', 'settings.json'),
    );
  }
  settingsPaths.push(path.join(home, '.claude', 'settings.json'));
  for (const settingsPath of settingsPaths) {
    const windowTokens = settingsWindow(settingsPath);
    if (windowTokens !== null) return windowTokens;
  }

  // With no setting and no marker the window is unknown. Assuming a size here made a larger
  // real window nudge far too early, so the caller decides what an unknown window means.
  return String(model).includes(LARGE_WINDOW_MARKER)
    ? LARGE_WINDOW_TOKENS
    : null;
}

/**
 * Divide observed fill by the configured context window.
 *
 * @param {number} fillTokens - Observed main-chain assistant token fill.
 * @param {number} windowTokens - Context window size.
 * @returns {number} Fill ratio, or zero for an empty window.
 */
function fillRatio(fillTokens, windowTokens) {
  return Number(windowTokens) === 0 ? 0 : Number(fillTokens) / Number(windowTokens);
}

function tokenCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

/** Sum the token usage fields emitted by Pi assistant messages. */
function fillFromPiUsage(usage) {
  return tokenCount(usage?.input)
    + tokenCount(usage?.cacheRead)
    + tokenCount(usage?.cacheWrite);
}

/** Sum the completed assistant token fields emitted by OpenCode. */
function fillFromOpenCodeTokens(tokens) {
  return tokenCount(tokens?.input)
    + tokenCount(tokens?.cache?.read)
    + tokenCount(tokens?.cache?.write);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  readClaudeFill,
  readClaudeSettings,
  readCodexSettings,
  resolveWindow,
  fillRatio,
  fillFromPiUsage,
  fillFromOpenCodeTokens,
  readCodexUsage,
  resolveCodexWindow,
  readVibeUsage,
  resolveVibeWindow,
};
