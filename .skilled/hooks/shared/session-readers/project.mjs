// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Projection
// ───────────────────────────────────────────────────────────────────
// Readers hand over neutral entries in the store's own order. This module
// owns the one entry-list contract those entries become: stable ids, a
// zero-based sequence, an ISO timestamp, role-discriminated content blocks,
// and the tool-call/result pairing rule. A pairing defect fails the whole
// read so a caller never receives a partial conversation.

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTION_ERRORS = Object.freeze({
  DUPLICATE_ENTRY_ID: 'DUPLICATE_ENTRY_ID',
  INVALID_ENTRY: 'INVALID_ENTRY',
  DUPLICATE_TOOL_CALL: 'DUPLICATE_TOOL_CALL',
  ORPHAN_TOOL_RESULT: 'ORPHAN_TOOL_RESULT',
  DUPLICATE_TOOL_RESULT: 'DUPLICATE_TOOL_RESULT',
  MISMATCHED_TOOL_RESULT: 'MISMATCHED_TOOL_RESULT',
  INCOMPLETE_TOOL_RESULTS: 'INCOMPLETE_TOOL_RESULTS',
});

const ROLES = new Set(['user', 'assistant', 'toolResult']);
const MAX_ID_LENGTH = 128;
const EPOCH = new Date(0).toISOString();

// ─────────────────────────────────────────────────────────────────────────────
// 2. BLOCK HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function textBlock(text) {
  return { type: 'text', text: String(text) };
}

export function thinkingBlock(thinking) {
  return { type: 'thinking', thinking: String(thinking) };
}

export function toolCallBlock({ id, name, arguments: args } = {}) {
  return {
    type: 'toolCall',
    id: String(id),
    name: String(name),
    arguments: args && typeof args === 'object' && !Array.isArray(args) ? args : {},
  };
}

export function imageBlock({ data, mimeType } = {}) {
  return { type: 'image', data: String(data), mimeType: String(mimeType) };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validBlock(block) {
  if (!isRecord(block) || typeof block.type !== 'string') return false;
  if (block.type === 'text') return typeof block.text === 'string';
  if (block.type === 'thinking') return typeof block.thinking === 'string';
  if (block.type === 'toolCall') {
    return typeof block.id === 'string'
      && block.id.length > 0
      && typeof block.name === 'string'
      && block.name.length > 0
      && isRecord(block.arguments);
  }
  if (block.type === 'image') {
    return typeof block.data === 'string' && typeof block.mimeType === 'string';
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. STORE PARSING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function parseJsonObject(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// A killed process can leave a torn final line, so a malformed line is skipped
// rather than failing a read that still holds every complete entry.
export function parseJsonLines(text) {
  const lines = [];
  for (const line of String(text).split('\n')) {
    if (!line.trim()) continue;
    const parsed = parseJsonObject(line);
    if (parsed) lines.push(parsed);
  }
  return lines;
}

export function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((item) => isRecord(item) && item.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TIMESTAMP NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

export function isoOr(value, fallback = EPOCH) {
  if (typeof value === 'string' && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    // A finite number can still sit outside the Date range, so the constructed
    // date is checked before serializing rather than trusting the guard alone.
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAIRING VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function fail(reason) {
  return { ok: false, reason };
}

function checkedRecord(record) {
  if (!isRecord(record)) return false;
  if (typeof record.id !== 'string' || !record.id || record.id.length > MAX_ID_LENGTH) return false;
  if (!ROLES.has(record.role)) return false;
  if (!Array.isArray(record.content) || !record.content.every(validBlock)) return false;
  if (record.role === 'toolResult') {
    if (typeof record.toolCallId !== 'string' || !record.toolCallId) return false;
    if (record.isError !== undefined && typeof record.isError !== 'boolean') return false;
  }
  return true;
}

// The order is the store's order. An assistant entry owns the tool results that
// immediately follow it; a result that arrives without that owner, twice, or
// under a call id the owner never made is a broken projection, not a skippable
// line. A turn still streaming at the end of the file is the one incomplete
// case that is accepted, because its result may not be written yet.
export function projectEntries(records) {
  if (!Array.isArray(records)) return fail(PROJECTION_ERRORS.INVALID_ENTRY);

  const items = [];
  const seenIds = new Set();
  const seenCallIds = new Set();
  let lastTimestamp = EPOCH;

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (!checkedRecord(record)) return fail(PROJECTION_ERRORS.INVALID_ENTRY);
    if (seenIds.has(record.id)) return fail(PROJECTION_ERRORS.DUPLICATE_ENTRY_ID);
    seenIds.add(record.id);

    lastTimestamp = isoOr(record.timestamp, lastTimestamp);

    if (record.role !== 'assistant') {
      if (record.role === 'toolResult') return fail(PROJECTION_ERRORS.ORPHAN_TOOL_RESULT);
      items.push({
        id: record.id,
        role: record.role,
        sequence: items.length,
        timestamp: lastTimestamp,
        content: record.content,
      });
      continue;
    }

    const calls = record.content.filter((block) => block.type === 'toolCall');
    const expected = new Set();
    for (const call of calls) {
      if (seenCallIds.has(call.id)) return fail(PROJECTION_ERRORS.DUPLICATE_TOOL_CALL);
      seenCallIds.add(call.id);
      expected.add(call.id);
    }

    items.push({
      id: record.id,
      role: record.role,
      sequence: items.length,
      timestamp: lastTimestamp,
      content: record.content,
    });

    const seenResults = new Set();
    let cursor = index + 1;
    while (cursor < records.length && isRecord(records[cursor]) && records[cursor].role === 'toolResult') {
      const result = records[cursor];
      if (!checkedRecord(result)) return fail(PROJECTION_ERRORS.INVALID_ENTRY);
      if (seenIds.has(result.id)) return fail(PROJECTION_ERRORS.DUPLICATE_ENTRY_ID);
      seenIds.add(result.id);

      if (!expected.has(result.toolCallId)) return fail(PROJECTION_ERRORS.MISMATCHED_TOOL_RESULT);
      if (seenResults.has(result.toolCallId)) return fail(PROJECTION_ERRORS.DUPLICATE_TOOL_RESULT);
      seenResults.add(result.toolCallId);

      lastTimestamp = isoOr(result.timestamp, lastTimestamp);
      const item = {
        id: result.id,
        role: 'toolResult',
        sequence: items.length,
        timestamp: lastTimestamp,
        content: result.content,
        toolCallId: result.toolCallId,
      };
      if (result.isError === true) item.isError = true;
      items.push(item);
      cursor += 1;
    }

    if (seenResults.size !== expected.size && cursor < records.length) {
      return fail(PROJECTION_ERRORS.INCOMPLETE_TOOL_RESULTS);
    }
    index = cursor - 1;
  }

  return { ok: true, items };
}
