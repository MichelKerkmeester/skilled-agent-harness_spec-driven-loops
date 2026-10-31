#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compaction Recall Census
// ───────────────────────────────────────────────────────────────────
// Scores what host compactions keep, from transcripts the operator names, with zero model calls.
// The report holds counts, scores, labels, file basenames, boundary uuids and line numbers, never transcript text.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const KNOWN_TYPES = new Set([
  'agent-name',
  'ai-title',
  'artifact-autoreact-ledger',
  'artifact-comment-monitor',
  'assistant',
  'atis-latch',
  'attachment',
  'bridge-session',
  'cost-state',
  'custom-title',
  'file-history-delta',
  'file-history-snapshot',
  'frame-link',
  'history-suppression',
  'last-prompt',
  'mode',
  'permission-mode',
  'pr-link',
  'queue-operation',
  'system',
  'user',
]);

const METHOD = 'method: parsed JSON records with type=system, subtype=compact_boundary and compactMetadata present';

const TRIGGERS = new Set(['auto', 'manual']);

const ENTRYPOINTS = new Set([
  'cli',
  'sdk-cli',
  'sdk-ts',
  'sdk-py',
  'claude-vscode',
  'claude-desktop',
  'mcp',
]);

const DEFAULT_MAX_FILE_BYTES = 1073741824;

/** Parsed records after a boundary that still belong to its recall window. */
const WINDOW_RECORDS = 30;

/** Heading the session-prime hook writes into a recorded brief. */
const BRIEF_MARKER = 'Recovered Context (Post-Compaction)';

const MAX_STATE_TOKENS = 25000;
const PRESERVE_RECENT_MESSAGES = 6;
const TRUNCATE_HEAD_CHARS = 300;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ESTIMATOR PORT
// ─────────────────────────────────────────────────────────────────────────────

// Ported from npm jevctl 0.2.3, src/vendor/compaction/state.ts and compact.ts (vendored there from
// fast-jev-compaction), MIT license. Types dropped; logic unchanged so the fit matches the vendored procedure.

const STATE_CONTEXT =
  'A coding assistant conversation is being compacted to free context. `history` is the whole conversation so far, oldest first; tool outputs are replaced by a short `result` note and long texts may be abridged. Each question asks whether one tool call, or the full output of that call, still needs to stay in the history verbatim. Whatever is not kept is deleted permanently, but the assistant can always re-run a tool or re-read a file.';

/** Successive caps on the serialised tool input included per call. */
const INPUT_CHARS = [1000, 200, 60];
const TEXT_HEAD = 400;
const TEXT_TAIL = 150;

const TOKEN_PIECES = /[A-Za-z]+|\d+|[^\sA-Za-z\d]/g;

/**
 * Estimates tokens without a tokenizer: a word costs one token per six
 * letters, a digit half a token, any other symbol nine tenths. Calibrated
 * against the usage Jev reports for real transcripts, where it lands 2–18%
 * above the true count; a plain characters-per-token ratio undercounts the
 * JSON-heavy states by up to 40%.
 */
export function estimateTokens(text) {
  let tokens = 0;
  for (const [piece] of text.matchAll(TOKEN_PIECES)) {
    const first = piece.charCodeAt(0);
    if (first >= 48 && first <= 57) tokens += piece.length / 2;
    else if ((first >= 65 && first <= 90) || (first >= 97 && first <= 122)) {
      tokens += 1 + Math.floor((piece.length - 1) / 6);
    } else tokens += 0.9;
  }
  return Math.ceil(tokens);
}

function truncate(text, limit) {
  return text.length <= limit ? text : `${text.slice(0, Math.max(0, limit - 1))}…`;
}

function abridge(text, head, tail) {
  if (text.length <= head + tail + 40) return text;
  const omitted = text.length - head - tail;
  return `${text.slice(0, head)}\n[… ${omitted} chars omitted …]\n${text.slice(-tail)}`;
}

/**
 * Keeps the first message and the newest `preserveRecentMessages` messages
 * out of the drop candidates.
 * @param {number} index Message index.
 * @param {number} total Total messages in the state.
 * @param {number} preserveRecentMessages How many newest messages always stay.
 * @returns {boolean} True when the message is protected from dropping.
 */
export function isPinned(index, total, preserveRecentMessages) {
  return index === 0 || index >= total - preserveRecentMessages;
}

/**
 * Pairs every tool_use with its tool_result by `tool_use_id`. Calls without a
 * result are not candidates (there is nothing to drop yet).
 */
export function collectToolCalls(messages, preserveRecentMessages) {
  const results = new Map();
  messages.forEach((message, index) => {
    for (const result of message.toolResults ?? []) {
      results.set(result.tool_use_id, { index, result });
    }
  });
  const calls = [];
  messages.forEach((message, callIndex) => {
    for (const tool of message.toolUses) {
      const found = results.get(tool.tool_use_id);
      if (!found) continue;
      calls.push({
        id: `t${calls.length + 1}`,
        tool_use_id: tool.tool_use_id,
        tool: tool.tool,
        input: tool.input,
        callIndex,
        resultIndex: found.index,
        resultChars: found.result.text.length,
        isError: found.result.isError ?? false,
        pinned:
          isPinned(callIndex, messages.length, preserveRecentMessages) ||
          isPinned(found.index, messages.length, preserveRecentMessages),
      });
    }
  });
  return calls;
}

function inputText(input, limit) {
  let json = '';
  try {
    json = JSON.stringify(input);
  } catch {
    json = '[unserializable input]';
  }
  return truncate(json, limit);
}

function resultNote(call) {
  return `${call.isError ? 'error' : 'ok'}, ${call.resultChars} chars (omitted)`;
}

/** One call as a single line, for when the structured form is too costly. */
function compactCall(call) {
  const input = Object.entries(call.input)
    .map(([key, value]) => {
      const text = typeof value === 'string' ? value : inputText({ [key]: value }, 200);
      return `${key}=${text.replace(/\s+/g, ' ')}`;
    })
    .join(' ');
  return `${call.id} ${call.tool} ${truncate(input, INPUT_CHARS[2])} → ${
    call.isError ? 'error' : 'ok'
  } ${call.resultChars}ch`;
}

/**
 * Folds runs of adjacent call-only entries into one entry each, so the
 * per-entry envelope is paid once per run; the call lines keep their ids.
 */
function mergeCallRuns(history, pinned) {
  const merged = [];
  for (const entry of history) {
    const previous = merged[merged.length - 1];
    const foldable = (e) => !pinned(e) && e.text.length === 0 && typeof e.tool_calls?.[0] === 'string';
    if (previous && foldable(previous) && foldable(entry) && previous.role === entry.role) {
      previous.tool_calls = [...previous.tool_calls, ...entry.tool_calls];
      continue;
    }
    merged.push({ ...entry });
  }
  return merged;
}

function callsByMessage(calls) {
  const byMessage = new Map();
  for (const call of calls) {
    const list = byMessage.get(call.callIndex) ?? [];
    list.push(call);
    byMessage.set(call.callIndex, list);
  }
  return byMessage;
}

function historyEntries(messages, calls, inputChars) {
  const byMessage = callsByMessage(calls);
  const entries = [];
  messages.forEach((message, i) => {
    const toolCalls = (byMessage.get(i) ?? []).map((call) => ({
      id: call.id,
      tool: call.tool,
      input: inputText(call.input, inputChars),
      result: resultNote(call),
    }));
    if (message.text.trim().length === 0 && toolCalls.length === 0) return;
    const entry = { i, role: message.role, text: message.text };
    if (toolCalls.length > 0) entry.tool_calls = toolCalls;
    entries.push(entry);
  });
  return entries;
}

/** The last three user prompts, as the default `goal`. */
function goalFromMessages(messages) {
  return messages
    .filter(
      (message) =>
        message.role === 'user' &&
        message.text.trim().length > 0 &&
        (message.toolResults ?? []).length === 0,
    )
    .slice(-3)
    .map((message) => truncate(message.text, 500))
    .join('\n');
}

/**
 * Builds the Jev state from the whole conversation and shrinks it in stages
 * until it fits `maxStateTokens`: tool inputs are truncated, then long texts
 * are abridged oldest-first (pinned messages last), then old messages collapse
 * to a one-line note, then old tool calls shrink to one line each, then old
 * messages that carry no call are left out, then runs of old call-only
 * messages are folded into one entry. Throws when even that is too big.
 */
export function fitState(messages, calls, options) {
  const goal = options.goal || goalFromMessages(messages);
  const stateOf = (history) => ({
    context: STATE_CONTEXT,
    goal,
    history,
  });
  const entryTokens = (entry) => estimateTokens(JSON.stringify(entry)) + 1;
  const baseTokens = estimateTokens(JSON.stringify(stateOf([])));
  const fitted = (history, tokens, stage) => ({
    state: stateOf(history),
    tokens,
    stage,
  });

  let history = [];
  let perEntry = [];
  let tokens = 0;
  const rebuild = (inputChars) => {
    history = historyEntries(messages, calls, inputChars);
    perEntry = history.map(entryTokens);
    tokens = baseTokens + perEntry.reduce((sum, n) => sum + n, 0);
  };
  const fits = () => tokens <= options.maxStateTokens;
  const shrink = (index, change) => {
    const entry = history[index];
    if (!entry) return;
    change(entry);
    const now = entryTokens(entry);
    tokens += now - (perEntry[index] ?? 0);
    perEntry[index] = now;
  };

  rebuild(INPUT_CHARS[0]);
  if (fits()) return fitted(history, tokens, 'full');

  for (const limit of INPUT_CHARS.slice(1)) {
    rebuild(limit);
    if (fits()) return fitted(history, tokens, `inputs<=${limit}`);
  }

  const pinned = (entry) => isPinned(entry.i, messages.length, options.preserveRecentMessages);
  const indices = history.map((_, index) => index);
  const order = [
    ...indices.filter((index) => !pinned(history[index])),
    ...indices.filter((index) => pinned(history[index])),
  ];

  for (const index of order) {
    const entry = history[index];
    if (entry.text.length <= TEXT_HEAD + TEXT_TAIL + 40) continue;
    shrink(index, (e) => {
      e.text = abridge(e.text, TEXT_HEAD, TEXT_TAIL);
    });
    if (fits()) return fitted(history, tokens, 'texts abridged');
  }

  for (const index of order) {
    const entry = history[index];
    if (pinned(entry) || entry.text.length === 0) continue;
    const original = messages[entry.i]?.text.length ?? entry.text.length;
    shrink(index, (e) => {
      e.text = `[… ${original} chars omitted …]`;
    });
    if (fits()) return fitted(history, tokens, 'old messages collapsed');
  }

  const byMessage = callsByMessage(calls);
  for (const index of order) {
    const entry = history[index];
    const own = byMessage.get(entry.i);
    if (pinned(entry) || !own) continue;
    shrink(index, (e) => {
      e.tool_calls = own.map(compactCall);
    });
    if (fits()) return fitted(history, tokens, 'old calls compacted');
  }

  const left = new Set();
  for (const index of order) {
    const entry = history[index];
    if (pinned(entry) || entry.tool_calls) continue;
    left.add(index);
    tokens -= perEntry[index] ?? 0;
    if (fits()) {
      return fitted(
        history.filter((_, i) => !left.has(i)),
        tokens,
        'old messages left out',
      );
    }
  }

  history = mergeCallRuns(
    history.filter((_, i) => !left.has(i)),
    pinned,
  );
  perEntry = history.map(entryTokens);
  tokens = baseTokens + perEntry.reduce((sum, n) => sum + n, 0);
  if (fits()) return fitted(history, tokens, 'old calls merged');

  throw new Error(
    `history too large for Jev (~${tokens} tokens after truncation, limit ${options.maxStateTokens})`,
  );
}

/**
 * Replaces a dropped tool result with a bounded head and a note, so the state
 * still shows what the call returned without paying for the full text.
 * @param {string} text Full tool result text.
 * @param {boolean} isError Whether the result was an error.
 * @param {number} headChars Characters of the result head to keep.
 * @returns {string} The truncated text, or the original when it is short enough.
 */
export function truncatedResultText(text, isError, headChars) {
  if (text.length <= headChars + 120) return text;
  const head = headChars > 0 ? `${text.slice(0, headChars)}\n` : '';
  return `${head}[fast-jev-compaction truncated ${text.length - headChars} chars of this tool result${
    isError ? ' (error)' : ''
  }; re-run the tool if needed]`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MESSAGES AND REDUCTION
// ─────────────────────────────────────────────────────────────────────────────

function blockText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((b) => (b && typeof b === 'object' && typeof b.text === 'string' ? b.text : ''))
      .filter(Boolean)
      .join('\n');
  }
  if (content === null || content === undefined) return '';
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

/**
 * Converts one Claude Code session record into the compaction Message shape,
 * or null when the record is not a main-session user or assistant message.
 * @param {unknown} record Parsed transcript record.
 * @returns {{ role: string, text: string, toolUses: object[], toolResults?: object[] } | null} The message, or null when the record carries no content.
 */
export function toMessage(record) {
  if (!record || typeof record !== 'object') return null;
  if ((record.type !== 'user' && record.type !== 'assistant') || record.isSidechain) return null;
  const content = record.message?.content;
  const role = record.type;
  const texts = [];
  const toolUses = [];
  const toolResults = [];
  if (typeof content === 'string') texts.push(content);
  else if (Array.isArray(content)) {
    for (const raw of content) {
      if (!raw || typeof raw !== 'object') continue;
      if (raw.type === 'text' && typeof raw.text === 'string') texts.push(raw.text);
      else if (raw.type === 'tool_use' && typeof raw.id === 'string') {
        toolUses.push({
          tool_use_id: raw.id,
          tool: typeof raw.name === 'string' ? raw.name : 'tool',
          input: raw.input && typeof raw.input === 'object' ? raw.input : {},
        });
      } else if (raw.type === 'tool_result' && typeof raw.tool_use_id === 'string') {
        toolResults.push({
          tool_use_id: raw.tool_use_id,
          text: blockText(raw.content),
          isError: Boolean(raw.is_error),
        });
      }
    }
  }
  const message = { role, text: texts.join('\n'), toolUses };
  if (toolResults.length > 0) message.toolResults = toolResults;
  if (message.text.trim().length === 0 && toolUses.length === 0 && toolResults.length === 0) return null;
  return message;
}

/**
 * Bounds the tokens an offline reduction could keep from one segment: every
 * message text and tool input counts once, and each unpinned tool result
 * counts again as the text kept after truncation. Arithmetic only, so the
 * census estimates the reduction without a model call and never rewrites the
 * messages it measures.
 * @param {object[]} messages Segment messages in the toMessage shape.
 * @param {object[]} calls Tool calls paired by collectToolCalls.
 * @param {number} [headChars] Characters of a dropped result head to keep.
 * @returns {{ untruncated: number, truncated: number, reduction: number }} Token totals and the kept share; reduction is 0 when there is nothing to reduce.
 */
export function offlineReductionUpperBound(messages, calls, headChars = TRUNCATE_HEAD_CHARS) {
  const unpinned = new Set(calls.filter((call) => !call.pinned).map((call) => call.tool_use_id));
  let untruncated = 0;
  let truncated = 0;
  for (const message of messages) {
    const text = estimateTokens(message.text);
    untruncated += text;
    truncated += text;
    for (const tool of message.toolUses) {
      const input = estimateTokens(JSON.stringify(tool.input));
      untruncated += input;
      truncated += input;
    }
    for (const result of message.toolResults ?? []) {
      untruncated += estimateTokens(result.text);
      const kept = unpinned.has(result.tool_use_id)
        ? truncatedResultText(result.text, result.isError ?? false, headChars)
        : result.text;
      truncated += estimateTokens(kept);
    }
  }
  return {
    untruncated,
    truncated,
    reduction: untruncated === 0 ? 0 : 1 - truncated / untruncated,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MUST-SURVIVE RULES
// ─────────────────────────────────────────────────────────────────────────────

/** Candidate words: four or more characters, starting with a letter or underscore. */
const WORD_PATTERN = /[A-Za-z_][A-Za-z0-9_]{3,}/g;

/** An inner lower-to-upper step marks camelCase; plain prose lacks it. */
const INNER_CAPITAL_PATTERN = /[a-z0-9][A-Z]/;

/** Tool names whose path argument names a file the session wrote. */
const WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit']);

/** Spec-folder references; the last segment names the packet. */
const SPEC_PATH_PATTERN =
  /specs\/[a-z0-9][a-z0-9._-]*\/[0-9]{3}-[a-z0-9._-]+(?:\/[0-9]{3}-[a-z0-9._-]+)*/g;

/**
 * Identifiers a compaction must survive: words that hold a letter and either
 * an underscore or an inner capital, which keeps prose out and file names,
 * config keys and camelCase symbols in.
 * @param {string} text Text to scan.
 * @returns {Set<string>} The distinct identifiers.
 */
export function identifiers(text) {
  const found = new Set();
  for (const [word] of text.matchAll(WORD_PATTERN)) {
    if (!/[A-Za-z]/.test(word)) continue;
    if (!word.includes('_') && !INNER_CAPITAL_PATTERN.test(word)) continue;
    found.add(word);
  }
  return found;
}

/**
 * Every string nested in an object or array, keys excluded, in walk order.
 * @param {unknown} value Value to walk.
 * @returns {string[]} The nested strings.
 */
export function stringLeaves(value) {
  const leaves = [];
  const walk = (node) => {
    if (typeof node === 'string') {
      leaves.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node === 'object' && node !== null) {
      for (const item of Object.values(node)) walk(item);
    }
  };
  walk(value);
  return leaves;
}

/**
 * The text units a segment offers the rules: every message text, the string
 * leaves of every tool input and every tool result text.
 * @param {object[]} messages Segment messages in the toMessage shape.
 * @returns {string[]} The segment text units.
 */
function segmentTextUnits(messages) {
  const units = [];
  for (const message of messages) {
    units.push(message.text);
    for (const tool of message.toolUses) {
      units.push(...stringLeaves(tool.input));
    }
    for (const result of message.toolResults ?? []) {
      units.push(result.text);
    }
  }
  return units;
}

/**
 * The union of the identifiers the segment text units hold.
 * @param {string[]} units Segment text units.
 * @returns {Set<string>} The distinct identifiers.
 */
function unitIdentifiers(units) {
  const found = new Set();
  for (const unit of units) {
    for (const item of identifiers(unit)) found.add(item);
  }
  return found;
}

/**
 * The identifiers one assistant record adds after a boundary: its text blocks
 * and the string leaves of its tool_use inputs.
 * @param {object} record Parsed transcript record.
 * @returns {Set<string>} The record's identifiers.
 */
function assistantRecordIdentifiers(record) {
  const found = new Set();
  const content = record.message?.content;
  if (!Array.isArray(content)) return found;
  for (const raw of content) {
    if (!raw || typeof raw !== 'object') continue;
    if (raw.type === 'text' && typeof raw.text === 'string') {
      for (const item of identifiers(raw.text)) found.add(item);
    } else if (raw.type === 'tool_use' && typeof raw.input === 'object' && raw.input !== null) {
      for (const leaf of stringLeaves(raw.input)) {
        for (const item of identifiers(leaf)) found.add(item);
      }
    }
  }
  return found;
}

/**
 * Distinct basenames of the files a segment wrote: the file_path or
 * notebook_path argument of every Write, Edit, MultiEdit and NotebookEdit.
 * @param {object[]} messages Segment messages in the toMessage shape.
 * @returns {Set<string>} The written basenames.
 */
export function writtenBasenames(messages) {
  const found = new Set();
  for (const message of messages) {
    for (const tool of message.toolUses) {
      if (!WRITE_TOOLS.has(tool.tool)) continue;
      const path = tool.input.file_path ?? tool.input.notebook_path;
      if (typeof path === 'string' && path.length > 0) {
        found.add(basename(path));
      }
    }
  }
  return found;
}

/**
 * The packet a segment references most often: the most frequent spec-folder
 * path match, ties to the match seen last, reduced to its last segment.
 * @param {string[]} units Segment text units.
 * @returns {string | null} The packet segment, or null when nothing matched.
 */
export function specPacketItem(units) {
  const counts = new Map();
  let item = null;
  let best = 0;
  for (const unit of units) {
    for (const [match] of unit.matchAll(SPEC_PATH_PATTERN)) {
      const count = (counts.get(match) ?? 0) + 1;
      counts.set(match, count);
      if (count >= best) {
        best = count;
        item = match.split('/').pop();
      }
    }
  }
  return item;
}

/**
 * The identifiers of the last user instruction, or null when the record is
 * not one: compact summaries, meta records, tool results and records without
 * text blocks do not carry an instruction.
 * @param {object} record Parsed transcript record.
 * @returns {Set<string> | null} The instruction identifiers, or null when the record is not an instruction.
 */
export function userInstructionIdentifiers(record) {
  if (record.type !== 'user' || record.isCompactSummary === true || record.isMeta === true) {
    return null;
  }
  const content = record.message?.content;
  if (typeof content === 'string') return identifiers(content);
  if (!Array.isArray(content)) return null;
  const texts = [];
  for (const raw of content) {
    if (!raw || typeof raw !== 'object') continue;
    if (raw.type === 'tool_result') return null;
    if (raw.type === 'text' && typeof raw.text === 'string') texts.push(raw.text);
  }
  return texts.length === 0 ? null : identifiers(texts.join('\n'));
}

/**
 * How many items a keeper text carries: identifier items must appear as whole
 * identifiers, path items count as plain substrings.
 * @param {Iterable<string>} items Rule items.
 * @param {string | null} keeperText Summary or brief text; null when the keeper is absent.
 * @param {'identifier' | 'includes'} mode How an item counts as kept.
 * @returns {number | null} The kept count, or null when there is no keeper text.
 */
export function keptCount(items, keeperText, mode) {
  if (keeperText === null) return null;
  const keeper = mode === 'identifier' ? identifiers(keeperText) : null;
  let kept = 0;
  for (const item of items) {
    if (keeper !== null ? keeper.has(item) : keeperText.includes(item)) kept += 1;
  }
  return kept;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TRANSCRIPT PARSER
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finiteNumberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stripCarriageReturn(raw) {
  return raw.length > 0 && raw[raw.length - 1] === 0x0d ? raw.subarray(0, raw.length - 1) : raw;
}

function boundaryRow(record, file, line) {
  const metadata = record.compactMetadata;
  return {
    file: basename(file),
    uuid: record.uuid,
    line,
    trigger: TRIGGERS.has(metadata.trigger) ? metadata.trigger : 'other',
    isSidechain: record.isSidechain === true,
    entrypoint: ENTRYPOINTS.has(record.entrypoint) ? record.entrypoint : 'other',
    preTokens: finiteNumberOrNull(metadata.preTokens),
    postTokens: finiteNumberOrNull(metadata.postTokens),
    durationMs: finiteNumberOrNull(metadata.durationMs),
  };
}

/** The stock summary text a compacted session leaves in a user record. */
function compactSummaryText(record) {
  const content = record.message?.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((block) => (block && typeof block === 'object' && typeof block.text === 'string' ? block.text : ''))
    .filter(Boolean)
    .join('\n');
}

/**
 * Opens the recall window a boundary reads over the next WINDOW_RECORDS
 * records, seeded with the must-survive items captured from the segment
 * before the boundary.
 * @param {object} row Boundary row.
 * @param {object} capture Pre-segment items: identifiers, written basenames, packet item, instruction items and preserved segment.
 * @returns {object} The internal boundary record.
 */
function openWindow(row, capture) {
  return {
    row,
    remaining: WINDOW_RECORDS,
    summaryText: null,
    briefText: null,
    briefFailureStatus: null,
    preIdentifiers: capture.preIdentifiers,
    writtenBasenames: capture.writtenBasenames,
    specItem: capture.specItem,
    instructionItems: capture.instructionItems,
    preservedSegment: capture.preservedSegment,
    postIdentifiers: new Set(),
  };
}

/**
 * Lets one parsed record answer an open window: the first compact summary
 * and the first session-prime hook brief win, and the first non-success
 * hook decides the window status when no brief answers.
 */
function feedWindow(boundary, record) {
  boundary.remaining -= 1;
  if (boundary.summaryText === null && record.type === 'user' && record.isCompactSummary === true) {
    boundary.summaryText = compactSummaryText(record);
  }
  const attachment = record.attachment;
  if (
    record.type !== 'attachment' ||
    !isPlainObject(attachment) ||
    attachment.hookName !== 'SessionStart:compact' ||
    boundary.briefText !== null
  ) {
    return;
  }
  if (attachment.type === 'hook_success') {
    // Several hooks answer the compact event; only the session-prime hook
    // writes the brief the census scores.
    if (typeof attachment.command === 'string' && attachment.command.includes('session-prime')) {
      boundary.briefText =
        typeof attachment.content === 'string'
          ? attachment.content
          : typeof attachment.stdout === 'string'
            ? attachment.stdout
            : '';
    }
    return;
  }
  if (boundary.briefFailureStatus === null) {
    boundary.briefFailureStatus =
      attachment.type === 'hook_cancelled' || attachment.type === 'hook_non_blocking_error'
        ? attachment.type
        : 'other';
  }
}

/**
 * Closes a window, adding the recall row fields in report order; the summary
 * and brief texts stay on the internal record and never reach the row.
 */
function closeWindow(boundary) {
  const row = boundary.row;
  row.summaryPresent = boundary.summaryText !== null;
  if (boundary.briefText !== null) {
    row.briefStatus = 'recorded';
    row.briefWindowStatus = 'hook_success';
    row.briefMarker = boundary.briefText.includes(BRIEF_MARKER);
    row.briefChars = boundary.briefText.length;
  } else {
    row.briefStatus = 'absent';
    row.briefWindowStatus = boundary.briefFailureStatus ?? 'none';
    row.briefMarker = null;
    row.briefChars = null;
  }
}

/**
 * Whether the boundary's preserved segment names records of this file: absent
 * without a segment object, ok when all three uuids exist here, else fail.
 * @param {object | null} segment The compactMetadata preservedSegment, or null when it was not an object.
 * @param {Set<string>} uuids Every record uuid seen in the file.
 * @returns {'absent' | 'ok' | 'fail'} The rule status.
 */
function rule5Status(segment, uuids) {
  if (segment === null) return 'absent';
  const refs = [segment.headUuid, segment.anchorUuid, segment.tailUuid];
  return refs.every((ref) => typeof ref === 'string' && uuids.has(ref)) ? 'ok' : 'fail';
}

/**
 * The share of rule items a keeper text carries: kept over found summed over
 * rules 1 to 4, rule 4 left out when uncheckable.
 * @param {object} row Scored row.
 * @param {'Summary' | 'Brief'} kind Which keeper's counts to sum.
 * @returns {number | null} The recall share, or null when nothing was found.
 */
function recallShare(row, kind) {
  let found = 0;
  let kept = 0;
  for (const rule of [1, 2, 3, 4]) {
    const ruleFound = row[`r${rule}Found`];
    const ruleKept = row[`r${rule}${kind}`];
    if (typeof ruleFound !== 'number' || ruleKept === null) continue;
    found += ruleFound;
    kept += ruleKept;
  }
  return found === 0 ? null : kept / found;
}

/**
 * Items the summary lost across rules 1 to 4, plus one for a broken
 * preserved segment.
 * @param {object} row Scored row.
 * @returns {number} The violation count.
 */
function violationsOf(row) {
  let violations = row.r5 === 'fail' ? 1 : 0;
  for (const rule of [1, 2, 3, 4]) {
    const ruleFound = row[`r${rule}Found`];
    if (typeof ruleFound !== 'number') continue;
    violations += ruleFound - row[`r${rule}Summary`];
  }
  return violations;
}

/**
 * Scores the must-survive rules for one boundary and appends the counts to
 * its row in report order, then drops the internal texts and sets so only
 * counts, status labels, numbers and null stay behind.
 * @param {object} boundary Internal boundary record holding its recall window.
 * @param {Set<string>} uuids Every record uuid seen in the file.
 */
function scoreBoundary(boundary, uuids) {
  const row = boundary.row;
  const summary = boundary.summaryText ?? '';
  const brief = boundary.briefText;
  const r1Items = [...boundary.postIdentifiers].filter((item) => boundary.preIdentifiers.has(item));
  const r2Items = boundary.writtenBasenames;
  const r3Items = boundary.specItem === null ? [] : [boundary.specItem];
  const r4Items = boundary.instructionItems;
  const uncheckable = r4Items === null || r4Items.size === 0;
  row.r1Found = r1Items.length;
  row.r1Summary = keptCount(r1Items, summary, 'identifier');
  row.r1Brief = keptCount(r1Items, brief, 'identifier');
  row.r2Found = r2Items.size;
  row.r2Summary = keptCount(r2Items, summary, 'includes');
  row.r2Brief = keptCount(r2Items, brief, 'includes');
  row.r3Found = r3Items.length;
  row.r3Summary = keptCount(r3Items, summary, 'includes');
  row.r3Brief = keptCount(r3Items, brief, 'includes');
  row.r4Found = uncheckable ? null : r4Items.size;
  row.r4Summary = uncheckable ? null : keptCount(r4Items, summary, 'identifier');
  row.r4Brief = uncheckable ? null : keptCount(r4Items, brief, 'identifier');
  row.uncheckable = uncheckable ? 1 : 0;
  row.r5 = rule5Status(boundary.preservedSegment, uuids);
  row.summaryRecall = recallShare(row, 'Summary');
  row.briefRecall = recallShare(row, 'Brief');
  row.violations = violationsOf(row);
  delete boundary.summaryText;
  delete boundary.briefText;
  delete boundary.preIdentifiers;
  delete boundary.writtenBasenames;
  delete boundary.specItem;
  delete boundary.instructionItems;
  delete boundary.preservedSegment;
  delete boundary.postIdentifiers;
}

/**
 * Streams a transcript file as lines split on 0x0A bytes only, so a Unicode
 * line separator inside a JSON string never splits a record.
 * @param {string} file Transcript path.
 * @param {number} byteLimit Maximum number of bytes to read; zero yields nothing.
 * @yields {{ line: number, text: string, terminated: boolean }} 1-based line number, text without one trailing carriage return, and whether the line ended with a newline.
 */
export async function* splitLines(file, byteLimit) {
  if (byteLimit <= 0) {
    return;
  }
  const stream = createReadStream(file, { start: 0, end: byteLimit - 1 });
  let pending = Buffer.alloc(0);
  let line = 0;
  for await (const chunk of stream) {
    pending = Buffer.concat([pending, chunk]);
    let newline = pending.indexOf(0x0a);
    while (newline !== -1) {
      const raw = stripCarriageReturn(pending.subarray(0, newline));
      pending = pending.subarray(newline + 1);
      line += 1;
      yield { line, text: raw.toString('utf8'), terminated: true };
      newline = pending.indexOf(0x0a);
    }
  }
  if (pending.length > 0) {
    const raw = stripCarriageReturn(pending);
    if (raw.length > 0) {
      line += 1;
      yield { line, text: raw.toString('utf8'), terminated: false };
    }
  }
}

/**
 * Parses one transcript up to the byte limit recorded at stat time, keeping
 * every boundary row until the first invalid record stops the file.
 * @param {string} file Transcript path.
 * @param {{ byteLimit?: number }} [options] Byte limit, defaulting to the stat size.
 * @returns {Promise<{ rows: object[], error: { line: number, code: string, message: string } | null, boundariesSeen: number, partialTail: boolean }>} Boundary rows, the first error or null, the boundary count seen, and whether an unterminated tail failed to parse.
 */
export async function parseTranscript(file, options = {}) {
  const stats = statSync(file);
  const byteLimit = options.byteLimit === undefined ? stats.size : Math.min(options.byteLimit, stats.size);
  const rows = [];
  // Each boundary keeps a recall window: the next WINDOW_RECORDS parsed
  // records may carry its stock summary and its hook brief, and the kept
  // texts stay on this record, off the row, for the must-survive rules.
  const boundaries = [];
  let firstOpen = 0;
  let boundariesSeen = 0;
  let partialTail = false;
  let segmentMessages = [];
  // The last user instruction is tracked across the whole file, not reset at
  // a boundary, so a boundary with no instruction of its own still scores it.
  let lastInstructionItems = null;
  // Only the latest boundary is still collecting assistant identifiers; the
  // next boundary ends its post segment.
  let openPostBoundary = null;
  const uuids = new Set();
  for await (const entry of splitLines(file, byteLimit)) {
    if (entry.text === '') {
      continue;
    }
    let record;
    try {
      record = JSON.parse(entry.text);
    } catch {
      if (!entry.terminated) {
        partialTail = true;
        continue;
      }
      return { rows: [], error: { line: entry.line, code: 'not_json', message: 'not JSON' }, boundariesSeen, partialTail };
    }
    if (!isPlainObject(record) || typeof record.type !== 'string') {
      return { rows: [], error: { line: entry.line, code: 'missing_field', message: 'missing field type' }, boundariesSeen, partialTail };
    }
    if (!KNOWN_TYPES.has(record.type)) {
      const label = record.type.length < 40 && /^[a-z-]+$/.test(record.type) ? record.type : '(label withheld)';
      return { rows: [], error: { line: entry.line, code: 'unknown_type', message: `unknown type ${label}` }, boundariesSeen, partialTail };
    }
    if (typeof record.uuid === 'string') {
      uuids.add(record.uuid);
    }
    // Every parsed record feeds the open windows, so a record that opens its
    // own window still counts against the boundaries before it.
    for (let index = firstOpen; index < boundaries.length; index += 1) {
      feedWindow(boundaries[index], record);
    }
    while (firstOpen < boundaries.length && boundaries[firstOpen].remaining === 0) {
      closeWindow(boundaries[firstOpen]);
      firstOpen += 1;
    }
    if (record.type === 'user' || record.type === 'assistant') {
      if (record.type === 'user') {
        const instruction = userInstructionIdentifiers(record);
        if (instruction !== null) {
          lastInstructionItems = instruction;
        }
      } else if (openPostBoundary !== null) {
        for (const item of assistantRecordIdentifiers(record)) {
          openPostBoundary.postIdentifiers.add(item);
        }
      }
      const message = toMessage(record);
      if (message !== null) {
        segmentMessages.push(message);
      }
      continue;
    }
    if (record.type === 'system' && record.subtype === 'compact_boundary') {
      if (!isPlainObject(record.compactMetadata)) {
        return { rows: [], error: { line: entry.line, code: 'missing_field', message: 'missing field compactMetadata' }, boundariesSeen, partialTail };
      }
      if (typeof record.uuid !== 'string') {
        return { rows: [], error: { line: entry.line, code: 'missing_field', message: 'missing field uuid' }, boundariesSeen, partialTail };
      }
      boundariesSeen += 1;
      const row = boundaryRow(record, file, entry.line);
      const calls = collectToolCalls(segmentMessages, PRESERVE_RECENT_MESSAGES);
      try {
        const fitted = fitState(segmentMessages, calls, {
          maxStateTokens: MAX_STATE_TOKENS,
          preserveRecentMessages: PRESERVE_RECENT_MESSAGES,
          goal: '',
        });
        row.fitStage = fitted.stage;
        row.fitTokens = fitted.tokens;
      } catch {
        row.fitStage = 'fit_throw';
        row.fitTokens = null;
      }
      const { untruncated, truncated, reduction } = offlineReductionUpperBound(segmentMessages, calls);
      row.untruncatedTokens = untruncated;
      row.keptTokens = truncated;
      row.offlineReduction = reduction;
      row.keptTokensRatio = row.postTokens > 0 ? row.keptTokens / row.postTokens : null;
      rows.push(row);
      const units = segmentTextUnits(segmentMessages);
      const boundary = openWindow(row, {
        preIdentifiers: unitIdentifiers(units),
        writtenBasenames: writtenBasenames(segmentMessages),
        specItem: specPacketItem(units),
        instructionItems: lastInstructionItems,
        preservedSegment: isPlainObject(record.compactMetadata.preservedSegment)
          ? record.compactMetadata.preservedSegment
          : null,
      });
      boundaries.push(boundary);
      openPostBoundary = boundary;
      segmentMessages = [];
    }
  }
  for (let index = firstOpen; index < boundaries.length; index += 1) {
    closeWindow(boundaries[index]);
  }
  for (const boundary of boundaries) {
    scoreBoundary(boundary, uuids);
  }
  return { rows, error: null, boundariesSeen, partialTail };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SESSION SELECTION
// ─────────────────────────────────────────────────────────────────────────────

function isPositiveInteger(value) {
  return typeof value === 'string' && /^[0-9]+$/.test(value) && Number(value) > 0;
}

function realOutputPath(out) {
  let ancestor = resolve(out);
  const tail = [];
  while (!existsSync(ancestor)) {
    tail.unshift(basename(ancestor));
    const parent = dirname(ancestor);
    if (parent === ancestor) {
      break;
    }
    ancestor = parent;
  }
  return join(realpathSync(ancestor), ...tail);
}

function isInsideDirectory(directory, candidate) {
  const rel = relative(directory, candidate);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function outputInsideTranscripts(paths, out) {
  const outCandidates = [resolve(out), realOutputPath(out)];
  for (const named of paths) {
    const stats = statSync(named);
    const directory = stats.isDirectory() ? named : dirname(named);
    const dirCandidates = [resolve(directory), realpathSync(directory)];
    for (const dir of dirCandidates) {
      for (const candidate of outCandidates) {
        if (isInsideDirectory(dir, candidate)) {
          return true;
        }
      }
    }
  }
  return false;
}

function collectJsonl(directory, found) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      collectJsonl(full, found);
    } else if (entry.isFile() && entry.name.endsWith('.jsonl')) {
      found.push(full);
    }
  }
}

/**
 * Parses the census CLI arguments, validating them in a fixed order before any
 * transcript is read.
 * @param {string[]} argv Raw arguments after the script name.
 * @returns {{ ok: true, options: object } | { ok: false, message: string }} The normalized options, or the first refusal message for stderr.
 */
export function parseCliArgs(argv) {
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        transcripts: { type: 'string', multiple: true },
        out: { type: 'string' },
        'newest-compacted': { type: 'string' },
        replay: { type: 'boolean' },
        'max-file-bytes': { type: 'string' },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    return { ok: false, message: `usage error: ${error.message}` };
  }
  if (!values.transcripts || values.transcripts.length === 0) {
    return { ok: false, message: 'no transcripts named' };
  }
  if (values.out === undefined) {
    return { ok: false, message: 'no report path named' };
  }
  if (values['newest-compacted'] !== undefined && !isPositiveInteger(values['newest-compacted'])) {
    return { ok: false, message: 'invalid --newest-compacted' };
  }
  if (values['max-file-bytes'] !== undefined && !isPositiveInteger(values['max-file-bytes'])) {
    return { ok: false, message: 'invalid --max-file-bytes' };
  }
  for (const named of values.transcripts) {
    if (!existsSync(named)) {
      return { ok: false, message: 'transcripts path not found' };
    }
  }
  if (outputInsideTranscripts(values.transcripts, values.out)) {
    return { ok: false, message: 'refused: report path inside transcript directory' };
  }
  return {
    ok: true,
    options: {
      transcripts: values.transcripts,
      out: values.out,
      newestCompacted: values['newest-compacted'] === undefined ? null : Number(values['newest-compacted']),
      replay: values.replay === true,
      maxFileBytes: values['max-file-bytes'] === undefined ? DEFAULT_MAX_FILE_BYTES : Number(values['max-file-bytes']),
    },
  };
}

/**
 * Expands the named transcript paths into files: a named file stands alone,
 * and a named directory contributes its *.jsonl files recursively.
 * @param {string[]} paths Named transcript files or directories.
 * @returns {{ path: string, name: string, subagent: boolean, size: number }[]} Discovered files in named-path order.
 */
export function listTranscriptFiles(paths) {
  const files = [];
  for (const named of paths) {
    const stats = statSync(named);
    if (!stats.isDirectory()) {
      files.push({ path: named, name: basename(named), subagent: false, size: stats.size });
      continue;
    }
    const found = [];
    collectJsonl(named, found);
    found.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (const full of found) {
      const subagent = relative(named, full).split(sep).includes('subagents');
      files.push({ path: full, name: basename(full), subagent, size: statSync(full).size });
    }
  }
  return files;
}

/**
 * Lists the newest-first selection candidates: the *.jsonl files directly in
 * each named directory, stat'ed once, ordered by modification time descending
 * and then by name ascending.
 * @param {string[]} dirs Named transcript directories.
 * @returns {{ path: string, name: string, size: number, mtimeMs: number }[]} Candidate files, newest first.
 */
export function listNewestCandidates(dirs) {
  const candidates = [];
  for (const dir of dirs) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.jsonl')) {
        continue;
      }
      const path = join(dir, entry.name);
      const stats = statSync(path);
      candidates.push({ path, name: entry.name, size: stats.size, mtimeMs: stats.mtimeMs });
    }
  }
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return candidates;
}

/**
 * Walks the newest-first candidates and stops opening them once n compacted
 * files are selected, so a census over a live transcript directory never reads
 * more files than the quota needs.
 * @param {string[]} dirs Named transcript directories.
 * @param {number} n How many compacted files to select.
 * @param {{ maxFileBytes: number }} options Byte ceiling above which a candidate is skipped unread.
 * @returns {Promise<{ selected: { name: string, subagent: boolean, result: object }[], read: number, stopped: { file: string, line: number, code: string }[], skippedOversized: { file: string, bytes: number }[] }>} Selected files with their parse results, how many candidates were opened, and the stopped and oversized candidates.
 */
export async function selectNewestCompacted(dirs, n, { maxFileBytes }) {
  const selected = [];
  const stopped = [];
  const skippedOversized = [];
  let read = 0;
  for (const candidate of listNewestCandidates(dirs)) {
    if (selected.length >= n) {
      break;
    }
    if (candidate.size > maxFileBytes) {
      skippedOversized.push({ file: candidate.name, bytes: candidate.size });
      continue;
    }
    read += 1;
    const result = await parseTranscript(candidate.path, { byteLimit: candidate.size });
    if (result.error) {
      process.stderr.write(`parse error: ${candidate.name}:${result.error.line}: ${result.error.message}\n`);
      stopped.push({ file: candidate.name, line: result.error.line, code: result.error.code });
      if (result.boundariesSeen > 0) {
        selected.push({ name: candidate.name, subagent: false, result });
      }
      continue;
    }
    if (result.rows.length > 0) {
      selected.push({ name: candidate.name, subagent: false, result });
    }
  }
  return { selected, read, stopped, skippedOversized };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. REPORT
// ─────────────────────────────────────────────────────────────────────────────

function formatValue(value) {
  return value === null ? 'n/a' : String(value);
}

function formatNumber(value) {
  return value === null ? 'n/a' : value.toFixed(2);
}

function median(values) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * The mean of the given recall shares, rounded to two places for the report.
 * @param {number[]} values Non-null recall shares.
 * @returns {number | null} The rounded mean, or null when there is nothing to average.
 */
function roundedMean(values) {
  if (values.length === 0) {
    return null;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(mean * 100) / 100;
}

/**
 * Renders the must-survive columns of one row line; null values print as n/a
 * and an uncheckable instruction rule prints its label instead of counts.
 * @param {object} row Boundary row.
 * @returns {string} The r1..violations columns.
 */
function recallColumns(row) {
  const r1 = `${formatValue(row.r1Found)}/${formatValue(row.r1Summary)}/${formatValue(row.r1Brief)}`;
  const r2 = `${formatValue(row.r2Found)}/${formatValue(row.r2Summary)}/${formatValue(row.r2Brief)}`;
  const r3 = `${formatValue(row.r3Found)}/${formatValue(row.r3Summary)}/${formatValue(row.r3Brief)}`;
  const r4 = row.uncheckable === 1
    ? 'uncheckable'
    : `${formatValue(row.r4Found)}/${formatValue(row.r4Summary)}/${formatValue(row.r4Brief)}`;
  return `r1=${r1} r2=${r2} r3=${r3} r4=${r4} r5=${row.r5} summary_recall=${formatNumber(row.summaryRecall)} brief_recall=${formatNumber(row.briefRecall)} violations=${row.violations}`;
}

/**
 * Renders one boundary row as the census row line; null values print as n/a.
 * @param {object} row Boundary row.
 * @returns {string} The row line.
 */
export function formatRow(row) {
  return `row ${row.file} line=${row.line} uuid=${row.uuid} trigger=${row.trigger} sidechain=${row.isSidechain} entrypoint=${row.entrypoint} pre=${formatValue(row.preTokens)} post=${formatValue(row.postTokens)} ms=${formatValue(row.durationMs)} fit=${row.fitStage.replace(/ /g, '_')} fit_tokens=${formatValue(row.fitTokens)} reduction=${row.offlineReduction.toFixed(4)} kept=${row.keptTokens} kept_ratio=${formatNumber(row.keptTokensRatio)} summary=${row.summaryPresent} brief=${row.briefStatus} brief_window=${row.briefWindowStatus} marker=${formatValue(row.briefMarker)} brief_chars=${formatValue(row.briefChars)} ${recallColumns(row)}`;
}

/**
 * Picks the census stop line: unknown-shape void first, then no boundaries,
 * then the arm verdict from the fit throw share and the median reductions.
 * @param {object[]} rows Boundary rows.
 * @param {object} totals Census totals.
 * @returns {string} The stop line.
 */
export function stopLine(rows, totals) {
  const read = totals.sessions_read;
  const stopped = totals.sessions_stopped;
  if (read > 0 && 2 * stopped > read) {
    return `stop: census void (unknown shape in ${stopped} of ${read} sessions)`;
  }
  if (rows.length === 0) {
    return 'stop: no boundaries';
  }
  const throwShare = rows.filter((row) => row.fitStage === 'fit_throw').length / rows.length;
  const fitted = rows.filter((row) => row.fitStage !== 'fit_throw');
  const reduction = median(fitted.map((row) => row.offlineReduction).filter((value) => typeof value === 'number'));
  const ratio = median(fitted.map((row) => row.keptTokensRatio).filter((value) => typeof value === 'number'));
  const fields = `fit_throws=${formatNumber(throwShare)}, offline_reduction_upper_bound=${formatNumber(reduction)}, kept_tokens_ratio=${formatNumber(ratio)}`;
  if (throwShare >= 0.5 || (reduction !== null && reduction < 0.25) || (ratio !== null && ratio > 3)) {
    return `stop: arm not built (${fields})`;
  }
  return `stop: arm may be specified (${fields})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs the census end to end and returns the process exit code.
 * @param {string[]} argv Raw arguments after the script name.
 * @returns {Promise<number>} 0 for a clean census, 1 for a stopped or void census, 2 for a refused command line.
 */
export async function main(argv) {
  const parsed = parseCliArgs(argv);
  if (!parsed.ok) {
    process.stderr.write(`${parsed.message}\n`);
    return 2;
  }
  const { transcripts, out, newestCompacted, maxFileBytes } = parsed.options;
  if (newestCompacted !== null) {
    for (const named of transcripts) {
      if (!statSync(named).isDirectory()) {
        process.stderr.write('--newest-compacted needs a directory\n');
        return 2;
      }
    }
  }
  const rows = [];
  const stoppedSessions = [];
  const skippedOversized = [];
  let sessionsRead = 0;
  let mainFiles = 0;
  let subagentFiles = 0;
  let mainBoundaries = 0;
  let subagentBoundaries = 0;
  let partialTails = 0;
  let selection = null;
  if (newestCompacted === null) {
    for (const file of listTranscriptFiles(transcripts)) {
      if (file.size > maxFileBytes) {
        skippedOversized.push({ file: file.name, bytes: file.size });
        continue;
      }
      sessionsRead += 1;
      if (file.subagent) {
        subagentFiles += 1;
      } else {
        mainFiles += 1;
      }
      const result = await parseTranscript(file.path, { byteLimit: maxFileBytes });
      if (result.error) {
        process.stderr.write(`parse error: ${file.name}:${result.error.line}: ${result.error.message}\n`);
        stoppedSessions.push({ file: file.name, line: result.error.line, code: result.error.code });
        continue;
      }
      if (result.partialTail) {
        partialTails += 1;
      }
      if (file.subagent) {
        subagentBoundaries += result.rows.length;
      } else {
        mainBoundaries += result.rows.length;
      }
      rows.push(...result.rows);
    }
  } else {
    const picked = await selectNewestCompacted(transcripts, newestCompacted, { maxFileBytes });
    sessionsRead = picked.read;
    selection = { newest: picked.selected.length, read: picked.read };
    stoppedSessions.push(...picked.stopped);
    skippedOversized.push(...picked.skippedOversized);
    for (const item of picked.selected) {
      mainFiles += 1;
      if (!item.result.error && item.result.partialTail) {
        partialTails += 1;
      }
      mainBoundaries += item.result.rows.length;
      rows.push(...item.result.rows);
    }
  }
  const totals = {
    compactions: rows.length,
    sessions_read: sessionsRead,
    sessions_stopped: stoppedSessions.length,
    sessions_skipped_oversized: skippedOversized.length,
    partial_tails: partialTails,
    fit_throws: rows.filter((row) => row.fitStage === 'fit_throw').length,
    briefs_recorded: rows.filter((row) => row.briefStatus === 'recorded').length,
    briefs_absent: rows.filter((row) => row.briefStatus === 'absent').length,
    markers: rows.filter((row) => row.briefMarker === true).length,
    summary_recall_avg: roundedMean(
      rows.map((row) => row.summaryRecall).filter((value) => typeof value === 'number'),
    ),
    brief_recall_avg: roundedMean(
      rows.map((row) => row.briefRecall).filter((value) => typeof value === 'number'),
    ),
    uncheckable: rows.reduce((sum, row) => sum + row.uncheckable, 0),
    violations: rows.reduce((sum, row) => sum + row.violations, 0),
  };
  const stop = stopLine(rows, totals);
  const report = {
    method: METHOD,
    scope: { mainFiles, subagentFiles, boundaries: rows.length, mainBoundaries, subagentBoundaries },
    selection,
    rows,
    totals,
    stoppedSessions,
    skippedOversized,
    stop,
  };
  process.stdout.write(`${METHOD}\n`);
  process.stdout.write(`scope: ${mainFiles} main-session files, ${subagentFiles} subagent files, ${rows.length} boundaries (${mainBoundaries} main, ${subagentBoundaries} subagent)\n`);
  if (selection !== null) {
    process.stdout.write(`selection: newest ${selection.newest} compacted main-session files by modification time, ${selection.read} read\n`);
  }
  for (const row of rows) {
    process.stdout.write(`${formatRow(row)}\n`);
  }
  process.stdout.write(`totals: compactions=${totals.compactions} sessions_read=${totals.sessions_read} sessions_stopped=${totals.sessions_stopped} sessions_skipped_oversized=${totals.sessions_skipped_oversized} partial_tails=${totals.partial_tails} fit_throws=${totals.fit_throws} briefs_recorded=${totals.briefs_recorded} briefs_absent=${totals.briefs_absent} markers=${totals.markers} summary_recall_avg=${formatNumber(totals.summary_recall_avg)} brief_recall_avg=${formatNumber(totals.brief_recall_avg)} uncheckable=${totals.uncheckable} violations=${totals.violations}\n`);
  process.stdout.write(`${stop}\n`);
  const outPath = resolve(out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  return stoppedSessions.length > 0 || stop.startsWith('stop: census void') ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
