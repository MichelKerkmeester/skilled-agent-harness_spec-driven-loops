// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Context Usage
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
  let tail;
  try {
    tail = readTail(transcriptPath, tailBytes);
  } catch {
    return null;
  }

  const lines = tail.text.split(/\r?\n/);
  if (
    !tail.startsAtBeginning
    && lines.length > 0
    && parseTranscriptEntry(lines[0]) === null
  ) {
    lines.shift();
  }

  let lastAssistant = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const entry = parseTranscriptEntry(line);
    if (entry?.type === 'assistant' && entry.isSidechain !== true) lastAssistant = entry;
  }
  if (lastAssistant === null) return null;

  const usage = lastAssistant.message?.usage || lastAssistant.usage || {};
  const fillTokens = ['input_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens']
    .reduce((total, key) => total + (positiveNumber(usage[key]) ?? 0), 0);
  return { fillTokens, model: lastAssistant.message?.model ?? null };
}

/** Read the latest Codex rollout token count from a transcript tail. */
function readCodexUsage(transcriptPath, { tailBytes = DEFAULT_TAIL_BYTES } = {}) {
  let tail;
  try {
    tail = readTail(transcriptPath, tailBytes);
  } catch {
    return null;
  }

  const lines = tail.text.split(/\r?\n/);
  if (
    !tail.startsAtBeginning
    && lines.length > 0
    && parseTranscriptEntry(lines[0]) === null
  ) {
    lines.shift();
  }

  let latestInfo = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const entry = parseTranscriptEntry(line);
    if (entry?.type === 'event_msg' && entry.payload?.type === 'token_count') {
      latestInfo = entry.payload.info ?? null;
    }
  }
  if (latestInfo === null) return null;

  return {
    fillTokens: tokenCount(latestInfo.last_token_usage?.input_tokens),
    modelContextWindow: positiveNumber(latestInfo.model_context_window),
  };
}

/** Prefer the shared window override to the window recorded by Codex. */
function resolveCodexWindow(modelContextWindow, env = process.env) {
  return positiveNumber(env?.SESSION_RELAUNCH_WINDOW_TOKENS)
    ?? positiveNumber(modelContextWindow);
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
 * @returns {number} Configured window or the model-aware default.
 */
function resolveWindow({
  env = process.env,
  cwd = process.cwd(),
  home = env.HOME || os.homedir(),
  model = '',
} = {}) {
  const fromEnvironment = positiveNumber(env.SESSION_RELAUNCH_WINDOW_TOKENS);
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

  return String(model).includes('[1m]') ? 1000000 : 200000;
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

/** Sum Hermes prompt and cache tokens without counting completion tokens. */
function fillFromHermesUsage(usage) {
  return tokenCount(usage?.input_tokens)
    + tokenCount(usage?.cache_read_tokens ?? usage?.cache_read_input_tokens)
    + tokenCount(usage?.cache_write_tokens ?? usage?.cache_creation_input_tokens);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  readClaudeFill,
  resolveWindow,
  fillRatio,
  fillFromPiUsage,
  fillFromOpenCodeTokens,
  fillFromHermesUsage,
  readCodexUsage,
  resolveCodexWindow,
};
