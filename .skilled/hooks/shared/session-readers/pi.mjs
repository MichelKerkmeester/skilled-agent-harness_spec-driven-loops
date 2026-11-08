// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Session Reader
// ───────────────────────────────────────────────────────────────────
// Pi exposes its live branch in-process, so the current session needs no disk
// read at all. An older session is found only by an exact header id inside the
// caller's project directory. The header's `cwd` is the tie-breaker because
// separator flattening lets two projects share one directory name.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';
import { closeSync, openSync, readFileSync, readSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  guardSessionPath,
  homeDir,
  isSafeSessionId,
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

const RUNTIME = 'pi';
// One vocabulary across the capability table and both source envelopes.
const LOCATOR_KIND = 'live_branch_or_session_log';
const TRANSCRIPT_EXT = '.jsonl';
const HEADER_PROBE_BYTES = 64 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. STORE
// ─────────────────────────────────────────────────────────────────────────────

export function piStoreRoot(options = {}) {
  return options.piRoot ?? join(homeDir(options), '.pi', 'agent', 'sessions');
}

export function piProjectDirectory(projectDir) {
  const projectKey = projectDir.replace(/^\/+/, '').replaceAll('/', '-');
  return '--' + projectKey + '--';
}

function headerOf(filePath) {
  // Only the first line is needed, so the probe reads a bounded prefix rather
  // than a whole session file that may run to many megabytes.
  const buffer = Buffer.alloc(HEADER_PROBE_BYTES);
  const fd = openSync(filePath, 'r');
  let length;
  try {
    length = readSync(fd, buffer, 0, HEADER_PROBE_BYTES, 0);
  } finally {
    closeSync(fd);
  }
  const head = buffer.subarray(0, length).toString('utf8');
  return parseJsonObject(head.split('\n')[0]);
}

// Session file names start with their creation time and end with the session
// id, so the id filters candidates before any file is opened.
function idFromFileName(fileName) {
  const withoutExtension = fileName.endsWith(TRANSCRIPT_EXT)
    ? fileName.slice(0, -TRANSCRIPT_EXT.length)
    : fileName;
  const separator = withoutExtension.indexOf('_');
  return separator === -1 ? withoutExtension : withoutExtension.slice(separator + 1) || withoutExtension;
}

function liveSessionId(sessionManager) {
  if (!sessionManager || typeof sessionManager !== 'object') return null;
  const value = typeof sessionManager.getSessionId === 'function'
    ? sessionManager.getSessionId()
    : sessionManager.sessionId;
  return typeof value === 'string' && value ? value : null;
}

function branchEntries(sessionManager) {
  if (typeof sessionManager.getBranch === 'function') return sessionManager.getBranch();
  if (Array.isArray(sessionManager.branch)) return sessionManager.branch;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRY MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function assistantBlocks(content) {
  const blocks = [];
  for (const item of Array.isArray(content) ? content : []) {
    if (!item || typeof item !== 'object') continue;
    if (item.type === 'text' && typeof item.text === 'string') {
      blocks.push(textBlock(item.text));
    } else if (item.type === 'thinking' && typeof item.thinking === 'string') {
      blocks.push(thinkingBlock(item.thinking));
    } else if (item.type === 'toolCall' && typeof item.id === 'string' && typeof item.name === 'string') {
      blocks.push(toolCallBlock({ id: item.id, name: item.name, arguments: item.arguments }));
    }
  }
  return blocks;
}

function recordsFromLines(lines) {
  const records = [];

  lines.forEach((line, index) => {
    if (line?.type !== 'message' || !line.message || typeof line.message !== 'object') return;
    const message = line.message;
    const id = typeof line.id === 'string' && line.id ? line.id : `pi-entry-${index}`;
    const timestamp = line.timestamp;

    if (message.role === 'user') {
      const blocks = [];
      for (const item of Array.isArray(message.content) ? message.content : []) {
        if (item?.type === 'text' && typeof item.text === 'string') blocks.push(textBlock(item.text));
      }
      // Pi records harness injections as their own `custom_message` entry type,
      // which this mapping never reads, so a user message is operator content
      // even when it opens with '<'.
      const text = contentText(blocks);
      if (!text) return;
      records.push({ id, role: 'user', timestamp, content: blocks });
      return;
    }

    if (message.role === 'assistant') {
      const blocks = assistantBlocks(message.content);
      if (blocks.length === 0) return;
      records.push({ id, role: 'assistant', timestamp, content: blocks });
      return;
    }

    if (message.role === 'toolResult') {
      if (typeof message.toolCallId !== 'string' || !message.toolCallId) return;
      const blocks = [];
      for (const item of Array.isArray(message.content) ? message.content : []) {
        if (item?.type === 'text' && typeof item.text === 'string') blocks.push(textBlock(item.text));
      }
      const record = {
        id,
        role: 'toolResult',
        timestamp,
        content: blocks.length > 0 ? blocks : [textBlock(contentText(message.content))],
        toolCallId: message.toolCallId,
      };
      if (message.isError === true) record.isError = true;
      records.push(record);
    }
  });

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOADER
// ─────────────────────────────────────────────────────────────────────────────

function liveResult({ sessionId, sessionManager, options }) {
  const entries = branchEntries(sessionManager);
  if (!Array.isArray(entries)) return { ok: false, code: 'store_unreadable' };
  if (entries.length === 0) return { ok: false, code: 'session_not_found' };
  return {
    ok: true,
    source: {
      runtime: RUNTIME,
      sessionId,
      locatorKind: LOCATOR_KIND,
      mode: 'live',
      storePath: typeof sessionManager.getSessionFile === 'function'
        ? String(sessionManager.getSessionFile())
        : piStoreRoot(options),
    },
    records: recordsFromLines(entries),
  };
}

function diskResult({ sessionId, projectDir, options }) {
  if (typeof projectDir !== 'string' || !projectDir.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }

  const root = piStoreRoot(options);
  const directory = join(root, piProjectDirectory(projectDir));

  let names;
  try {
    names = readdirSync(directory);
  } catch {
    // A missing root means the store itself cannot be read; a known root with
    // no project directory means this project simply has no saved session.
    try {
      statSync(root);
      return { ok: false, code: 'session_not_found' };
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
  }

  const candidates = names.filter(
    (name) => name.endsWith(TRANSCRIPT_EXT) && idFromFileName(name) === sessionId,
  );
  if (candidates.length === 0) return { ok: false, code: 'session_not_found' };
  // Two files that decode to one id are two possible sessions, and neither the
  // name nor the header can choose between them, so a recovery read refuses
  // rather than guessing.
  if (candidates.length > 1) return { ok: false, code: 'session_ambiguous' };

  const filePath = join(directory, candidates[0]);
  let header;
  try {
    header = headerOf(filePath);
  } catch {
    return { ok: false, code: 'store_unreadable' };
  }

  if (header?.type !== 'session' || header.id !== sessionId) {
    return { ok: false, code: 'session_mismatch' };
  }
  if (!samePath(header.cwd, projectDir)) {
    return { ok: false, code: 'session_mismatch' };
  }

  const guard = guardSessionPath({
    path: filePath,
    root,
    sessionId,
    recordedId: header.id,
  });
  if (!guard.ok) return guard;

  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    return { ok: false, code: 'store_unreadable' };
  }

  const lines = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const parsed = parseJsonObject(line);
    if (parsed) lines.push(parsed);
  }

  return {
    ok: true,
    source: {
      runtime: RUNTIME,
      sessionId,
      locatorKind: LOCATOR_KIND,
      mode: 'disk',
      storePath: guard.path,
    },
    records: recordsFromLines(lines),
  };
}

export function loadPiSession({ sessionId, projectDir, sessionManager, ...options } = {}) {
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: sessionId ? 'session_mismatch' : 'locator_unavailable' };
  }

  if (sessionManager && liveSessionId(sessionManager) === sessionId) {
    return liveResult({ sessionId, sessionManager, options });
  }
  return diskResult({ sessionId, projectDir, options });
}
