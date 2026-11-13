// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Transcript Reader
// ───────────────────────────────────────────────────────────────────
// Claude hands a hook the transcript it is already writing. The reader trusts
// that path only after the identity guard proves it lives under the Claude
// store and that the file's own session id equals the requested one. A
// subagent transcript is a side conversation, so it can never stand in for the
// parent session.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { homeDir, isSafeSessionId, resolveInside } from './identity.mjs';
import {
  contentText,
  imageBlock,
  parseJsonObject,
  textBlock,
  thinkingBlock,
  toolCallBlock,
} from './project.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'claude';
const LOCATOR_KIND = 'transcript_path';

// ─────────────────────────────────────────────────────────────────────────────
// 3. STORE
// ─────────────────────────────────────────────────────────────────────────────

export function claudeStoreRoot(options = {}) {
  return options.claudeRoot ?? join(homeDir(options), '.claude', 'projects');
}

function recordedSessionId(entries, transcriptPath) {
  const declared = entries.find((entry) => typeof entry?.sessionId === 'string' && entry.sessionId)?.sessionId;
  if (declared) return declared;
  return basename(transcriptPath).replace(/\.jsonl$/, '');
}

function isSubagentPath(filePath) {
  return filePath.split(/[\\/]+/).includes('subagents');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRY MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function assistantBlocks(content) {
  const blocks = [];
  for (const block of Array.isArray(content) ? content : []) {
    if (!block || typeof block !== 'object') continue;
    if (block.type === 'text' && typeof block.text === 'string') {
      blocks.push(textBlock(block.text));
    } else if (block.type === 'thinking' && typeof block.thinking === 'string') {
      blocks.push(thinkingBlock(block.thinking));
    } else if (block.type === 'tool_use' && typeof block.id === 'string' && typeof block.name === 'string') {
      blocks.push(toolCallBlock({ id: block.id, name: block.name, arguments: block.input }));
    } else if (block.type === 'image' && block.source) {
      blocks.push(imageBlock({
        data: block.source.data,
        mimeType: block.source.media_type ?? block.source.mediaType,
      }));
    }
  }
  return blocks;
}

function toolResultBlocks(content) {
  if (typeof content === 'string') return [textBlock(content)];
  const blocks = [];
  for (const item of Array.isArray(content) ? content : []) {
    if (!item || typeof item !== 'object') continue;
    if (item.type === 'text' && typeof item.text === 'string') blocks.push(textBlock(item.text));
    if (item.type === 'image' && item.source) {
      blocks.push(imageBlock({
        data: item.source.data,
        mimeType: item.source.media_type ?? item.source.mediaType,
      }));
    }
  }
  return blocks;
}

function userRecords(entry, index, timestamp) {
  const content = entry?.message?.content;
  const uuid = typeof entry.uuid === 'string' && entry.uuid ? entry.uuid : `claude-entry-${index}`;
  const blocks = Array.isArray(content) ? content.filter((block) => block && typeof block === 'object') : [];
  const toolResults = blocks.filter((block) => block.type === 'tool_result' && typeof block.tool_use_id === 'string');

  // A tool result must directly follow the assistant call it answers, or the
  // projection treats the whole turn as broken. A user message that also
  // carries typed text or an image therefore emits its results first and keeps
  // the operator content as the user entry that follows them.
  const records = toolResults.map((block) => ({
    id: `${uuid}:result:${block.tool_use_id}`.slice(0, 128),
    role: 'toolResult',
    timestamp,
    content: toolResultBlocks(block.content),
    toolCallId: block.tool_use_id,
    isError: block.is_error === true,
  }));

  const text = contentText(content);
  const images = blocks.filter((block) => block.type === 'image' && block.source);
  if (text || images.length > 0) {
    const mapped = blocks.length > 0
      ? blocks
        .filter((block) => (block.type === 'text' && typeof block.text === 'string')
          || (block.type === 'image' && block.source))
        .map((block) => (
          block.type === 'text'
            ? textBlock(block.text)
            : imageBlock({ data: block.source?.data, mimeType: block.source?.media_type ?? block.source?.mediaType })
        ))
      : [textBlock(text)];
    records.push({ id: uuid, role: 'user', timestamp, content: mapped });
  }
  return records;
}

// Claude Code records the printed output of a local command, such as the
// `/compact` report, as a user entry. The operator never typed it, so it is
// host output rather than conversation and stays out of the history. The
// command the operator typed stays in.
const LOCAL_COMMAND_OUTPUT = /^\s*<local-command-(?:stdout|stderr)>/u;

function isLocalCommandOutput(entry) {
  const content = entry?.message?.content;
  return typeof content === 'string' && LOCAL_COMMAND_OUTPUT.test(content);
}

function recordsFromEntries(entries) {
  const records = [];
  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return;
    if (entry.isSidechain === true || entry.isMeta === true || entry.isCompactSummary === true) return;

    const timestamp = entry.timestamp;
    if (entry.type === 'assistant') {
      const id = typeof entry.uuid === 'string' && entry.uuid ? entry.uuid : `claude-entry-${index}`;
      const content = assistantBlocks(entry?.message?.content);
      if (content.length > 0) records.push({ id, role: 'assistant', timestamp, content });
      return;
    }

    if (entry.type === 'user') {
      if (isLocalCommandOutput(entry)) return;
      records.push(...userRecords(entry, index, timestamp));
    }
  });
  return records;
}

// Claude records the context a hook adds as an attachment entry rather than a
// message, so the history never carried it. A caller that asks whether the
// advisor brief reached the turn needs that text, and it has to stay apart from
// the operator and assistant records.
function attachmentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((item) => (typeof item === 'string' ? item : item?.text))
    .filter((text) => typeof text === 'string' && text.length > 0)
    .join('\n');
}

function injectedFromEntries(entries) {
  const injected = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    if (entry.type !== 'attachment' || entry?.attachment?.type !== 'hook_additional_context') continue;
    const text = attachmentText(entry.attachment.content);
    if (text) injected.push({ source: 'hook_additional_context', text });
  }
  return injected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOADER
// ─────────────────────────────────────────────────────────────────────────────

export function loadClaudeSession({ sessionId, transcriptPath, ...options } = {}) {
  if (typeof transcriptPath !== 'string' || !transcriptPath.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: sessionId ? 'session_mismatch' : 'locator_unavailable' };
  }
  if (isSubagentPath(transcriptPath)) {
    return { ok: false, code: 'session_mismatch' };
  }

  // Containment is decided before the file is opened, so a path outside the
  // store is refused without its content ever being read.
  const root = claudeStoreRoot(options);
  const containment = resolveInside({ path: transcriptPath, root });
  if (!containment.ok) {
    if (containment.code === 'session_mismatch') return containment;
    try {
      statSync(root);
      return { ok: false, code: 'session_not_found' };
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
  }
  const storePath = containment.path;

  let raw;
  try {
    raw = readFileSync(transcriptPath, 'utf8');
  } catch {
    try {
      statSync(root);
      return { ok: false, code: 'session_not_found' };
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
  }

  const entries = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const parsed = parseJsonObject(line);
    if (parsed) entries.push(parsed);
  }

  if (recordedSessionId(entries, transcriptPath) !== sessionId) {
    return { ok: false, code: 'session_mismatch' };
  }

  return {
    ok: true,
    source: {
      runtime: RUNTIME,
      sessionId,
      locatorKind: LOCATOR_KIND,
      storePath,
    },
    records: recordsFromEntries(entries),
    injected: injectedFromEntries(entries),
  };
}
