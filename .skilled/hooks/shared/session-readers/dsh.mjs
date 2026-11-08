// ───────────────────────────────────────────────────────────────────
// MODULE: DeepSeek Harness Session Log Reader
// ───────────────────────────────────────────────────────────────────
// The harness writes a session log under a project key that collapses path
// separators, so two projects can share one directory name. The session id is
// the directory name and the log's own header is checked against both the id
// and the caller's cwd before any event becomes an entry. Logs may be written
// as a chain of Zstandard frames, one per append batch.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { zstdDecompressSync } from 'node:zlib';
import {
  envOf,
  homeDir,
  isSafeSessionId,
  resolveInside,
  samePath,
} from './identity.mjs';
import {
  contentText,
  parseJsonObject,
  textBlock,
  thinkingBlock,
  toolCallBlock,
} from './project.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'dsh';
const LOCATOR_KIND = 'session_log';
const OPERATOR_SOURCE = 'user';
const SESSION_LOG_NAME = /^session(?:\.v([1-9]\d*))?\.jsonl(\.zstd)?$/;

const ZSTD_FRAME_MAGIC = 0xfd2fb528;
const SKIPPABLE_MAGIC_MASK = 0xfffffff0;
const SKIPPABLE_MAGIC = 0x184d2a50;

// ─────────────────────────────────────────────────────────────────────────────
// 3. LOG DECODING
// ─────────────────────────────────────────────────────────────────────────────

// Length of one Zstandard frame from its header and block headers (RFC 8878
// §3.1.1). Node decodes only the first frame of a buffer, so the frames are cut
// out and decoded one by one.
function zstdFrameLength(buffer, start) {
  let offset = start + 4;
  const descriptor = buffer[offset];
  if (descriptor === undefined) throw new Error('truncated Zstandard frame header');
  offset += 1;

  const contentSizeFlag = descriptor >> 6;
  const singleSegment = (descriptor >> 5) & 1;
  const hasChecksum = (descriptor >> 2) & 1;
  const dictionaryIdFlag = descriptor & 3;
  if (!singleSegment) offset += 1;
  offset += [0, 1, 2, 4][dictionaryIdFlag];
  offset += [singleSegment ? 1 : 0, 2, 4, 8][contentSizeFlag];

  for (;;) {
    if (offset + 3 > buffer.length) throw new Error('truncated Zstandard block header');
    const header = buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
    offset += 3;
    const lastBlock = header & 1;
    const blockType = (header >> 1) & 3;
    const blockSize = header >>> 3;
    if (blockType === 3) throw new Error('reserved Zstandard block type');
    offset += blockType === 1 ? 1 : blockSize;
    if (lastBlock) break;
  }
  if (hasChecksum) offset += 4;
  if (offset > buffer.length) throw new Error('truncated Zstandard frame');
  return offset - start;
}

export function decodeSessionLog(buffer, fileName) {
  if (!fileName.endsWith('.zstd')) return buffer.toString('utf8');

  const parts = [];
  let offset = 0;
  while (offset + 4 <= buffer.length) {
    const magic = buffer.readUInt32LE(offset);
    if ((magic & SKIPPABLE_MAGIC_MASK) >>> 0 === SKIPPABLE_MAGIC) {
      if (offset + 8 > buffer.length) throw new Error('truncated skippable frame');
      offset += 8 + buffer.readUInt32LE(offset + 4);
      continue;
    }
    if (magic !== ZSTD_FRAME_MAGIC) throw new Error(`unknown frame at byte ${offset}`);
    const length = zstdFrameLength(buffer, offset);
    parts.push(zstdDecompressSync(buffer.subarray(offset, offset + length)));
    offset += length;
  }
  return Buffer.concat(parts).toString('utf8');
}

function parseEvents(text) {
  const events = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const parsed = parseJsonObject(line);
    if (parsed) events.push(parsed);
  }
  return events;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STORE
// ─────────────────────────────────────────────────────────────────────────────

export function dshStoreRoot(options = {}) {
  if (options.dshRoot) return options.dshRoot;
  return join(envOf(options).DSH_HOME || join(homeDir(options), '.dsh'), 'sessions');
}

// The harness's own project-directory key: separators collapse to one `-`, and
// any other unsafe code unit becomes a `~XXXX` escape.
export function dshProjectKey(cwd) {
  let readable = '';
  let separatorRun = false;
  for (let index = 0; index < cwd.length; index += 1) {
    const code = cwd.charCodeAt(index);
    const ch = String.fromCharCode(code);
    if (ch === '/' || ch === '\\' || ch === ':') {
      if (!separatorRun) readable += '-';
      separatorRun = true;
    } else if (ch !== '~' && /^[A-Za-z0-9._-]$/.test(ch)) {
      readable += ch;
      separatorRun = false;
    } else {
      readable += '~' + code.toString(16).toUpperCase().padStart(4, '0');
      separatorRun = false;
    }
  }
  return `--${(readable.replace(/^-+/, '') || 'root').slice(0, 251)}--`;
}

function sessionLogIn(directory) {
  let best = null;
  for (const fileName of readdirSync(directory)) {
    const match = SESSION_LOG_NAME.exec(fileName);
    if (!match) continue;
    const version = Number(match[1] ?? 0);
    if (!best || version > best.version) best = { version, path: join(directory, fileName) };
  }
  return best?.path ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRY MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function assistantBlocks(content) {
  const blocks = [];
  for (const item of Array.isArray(content) ? content : []) {
    if (!item || typeof item !== 'object') continue;
    if (item.type === 'text' && typeof item.text === 'string') {
      blocks.push(textBlock(item.text));
    } else if (item.type === 'thinking' && typeof item.thinking === 'string') {
      blocks.push(thinkingBlock(item.thinking));
    } else if (item.type === 'tool-call' && typeof item.id === 'string' && typeof item.name === 'string') {
      blocks.push(toolCallBlock({
        id: item.id,
        name: item.name,
        arguments: parseJsonObject(item.arguments) ?? item.arguments,
      }));
    }
  }
  return blocks;
}

function recordsFromEvents(events) {
  const records = [];
  const seenIds = new Set();
  const keepFirst = (record) => {
    // A compaction prune re-emits a shortened tool result under the same
    // message id. The first copy holds the full output, which is what a
    // lookup after compaction is for, so a repeated id is dropped.
    if (seenIds.has(record.id)) return;
    seenIds.add(record.id);
    records.push(record);
  };

  events.forEach((event, index) => {
    const data = event?.data;
    if (!data || typeof data !== 'object') return;
    // DSH stamps each event with `time` in epoch milliseconds.
    const timestamp = event.time ?? event.timestamp ?? data.timestamp;

    if (event.type === 'user/message' && data.source?.kind === OPERATOR_SOURCE) {
      // Injected notices carry a non-operator source kind, so this text is
      // operator content even when it opens with '<'.
      const text = contentText(data.content);
      if (!text) return;
      keepFirst({
        id: String(data.id ?? `dsh-user-${index}`).slice(0, 128),
        role: 'user',
        timestamp,
        content: [textBlock(text)],
      });
      return;
    }

    if (event.type === 'assistant/message') {
      const message = data.message;
      const blocks = assistantBlocks(message?.content);
      if (blocks.length === 0) return;
      keepFirst({
        id: String(message?.id ?? data.id ?? `dsh-assistant-${index}`).slice(0, 128),
        role: 'assistant',
        timestamp,
        content: blocks,
      });
      return;
    }

    if (event.type === 'tool/result') {
      const message = data.message;
      if (typeof message?.toolCallId !== 'string' || !message.toolCallId) return;
      const text = contentText(message.content);
      const record = {
        id: String(message.id ?? `dsh-result-${index}`).slice(0, 128),
        role: 'toolResult',
        timestamp,
        content: [textBlock(text)],
        toolCallId: message.toolCallId,
      };
      if (message.isError === true) record.isError = true;
      keepFirst(record);
    }
  });

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LOADER
// ─────────────────────────────────────────────────────────────────────────────

export function loadDshSession({ sessionId, projectDir, sessionPath, ...options } = {}) {
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: sessionId ? 'session_mismatch' : 'locator_unavailable' };
  }
  if (typeof projectDir !== 'string' || !projectDir.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }

  const root = dshStoreRoot(options);
  let logPath = sessionPath;

  if (!logPath) {
    const projectRoot = join(root, dshProjectKey(projectDir));
    try {
      statSync(root);
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
    try {
      statSync(projectRoot);
    } catch {
      return { ok: false, code: 'session_not_found' };
    }

    // The session directory is named by the exact id, so a newer decoy session
    // is never opened while the requested one is missing.
    const sessionDirectory = join(projectRoot, sessionId);
    try {
      statSync(sessionDirectory);
    } catch {
      return { ok: false, code: 'session_not_found' };
    }
    try {
      logPath = sessionLogIn(sessionDirectory);
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
    if (!logPath) return { ok: false, code: 'session_not_found' };
  }

  // Containment is decided before the file is opened, so a path outside the
  // store is refused without its content ever being read.
  const containment = resolveInside({ path: logPath, root });
  if (!containment.ok) return containment;
  const storePath = containment.path;

  let events;
  try {
    events = parseEvents(decodeSessionLog(readFileSync(logPath), logPath));
  } catch {
    return { ok: false, code: 'store_unreadable' };
  }

  const header = events[0]?.type === 'session' ? events[0] : null;
  if (typeof header?.id !== 'string' || !header.id) {
    return { ok: false, code: 'store_unreadable' };
  }
  if (header.id !== sessionId) return { ok: false, code: 'session_mismatch' };
  if (!samePath(header.cwd, projectDir)) return { ok: false, code: 'session_mismatch' };

  return {
    ok: true,
    source: {
      runtime: RUNTIME,
      sessionId,
      locatorKind: LOCATOR_KIND,
      storePath,
    },
    records: recordsFromEvents(events),
  };
}
