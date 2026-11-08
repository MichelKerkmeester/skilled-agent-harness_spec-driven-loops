// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Rollout Reader
// ───────────────────────────────────────────────────────────────────
// Codex supplies a nullable transcript path. A missing path has no owner to
// fall back to, so the reader stops rather than guessing at another runtime's
// store. The rollout header is the identity authority: its `session_meta`
// payload id wins over the file name when the two disagree.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { envOf, homeDir, isSafeSessionId, resolveInside } from './identity.mjs';
import {
  contentText,
  parseJsonLines,
  parseJsonObject,
  textBlock,
  thinkingBlock,
  toolCallBlock,
} from './project.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'codex';
const LOCATOR_KIND = 'transcript_path';
const TRANSCRIPT_EXT = '.jsonl';
const ROLLOUT_PATTERN = /^rollout-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-(.+)\.jsonl$/;
// Codex delivers harness context as user-role messages, so the reader has to
// recognize those tags explicitly; any other text is operator content even when
// it happens to open with a tag-like string.
const INJECTED_USER_TAGS = ['<environment_context>', '<user_instructions>', '<permissions instructions>'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. STORE
// ─────────────────────────────────────────────────────────────────────────────

export function codexStoreRoot(options = {}) {
  if (options.codexRoot) return options.codexRoot;
  return join(envOf(options).CODEX_HOME || join(homeDir(options), '.codex'), 'sessions');
}

function recordedSessionId(lines, transcriptPath) {
  const metadata = lines.find((line) => line?.type === 'session_meta');
  const declared = metadata?.payload?.id;
  if (typeof declared === 'string' && declared) return declared;

  const fileName = basename(transcriptPath);
  const match = fileName.match(ROLLOUT_PATTERN);
  if (match?.[1]) return match[1];
  return fileName.endsWith(TRANSCRIPT_EXT) ? fileName.slice(0, -TRANSCRIPT_EXT.length) : fileName;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRY MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function messageBlocks(payload) {
  const blocks = [];
  const itemType = payload.role === 'assistant' ? 'output_text' : 'input_text';
  for (const item of Array.isArray(payload.content) ? payload.content : []) {
    if (!item || typeof item !== 'object') continue;
    if ((item.type === itemType || item.type === 'text') && typeof item.text === 'string') {
      blocks.push(textBlock(item.text));
    } else if (item.type === 'thinking' && typeof item.thinking === 'string') {
      blocks.push(thinkingBlock(item.thinking));
    }
  }
  return blocks;
}

function recordsFromLines(lines) {
  const records = [];

  lines.forEach((line, index) => {
    if (line?.type !== 'response_item') return;
    const payload = line.payload;
    if (!payload || typeof payload !== 'object') return;

    const timestamp = line.timestamp;
    const id = typeof payload.id === 'string' && payload.id
      ? payload.id
      : typeof payload.call_id === 'string' && payload.call_id
        ? payload.call_id
        : `codex-entry-${index}`;

    if (payload.type === 'message') {
      if (payload.role !== 'user' && payload.role !== 'assistant') return;
      const blocks = messageBlocks(payload);
      const text = contentText(blocks);
      if (!text) return;
      // Codex injects environment context and harness notes as user messages;
      // they are attached to the turn, not typed by the operator.
      if (payload.role === 'user' && INJECTED_USER_TAGS.some((tag) => text.startsWith(tag))) return;
      records.push({ id, role: payload.role, timestamp, content: blocks });
      return;
    }

    if (payload.type === 'function_call' || payload.type === 'custom_tool_call') {
      records.push({
        id: (typeof payload.id === 'string' && payload.id ? payload.id : `codex-call-${payload.call_id}`).slice(0, 128),
        role: 'assistant',
        timestamp,
        content: [toolCallBlock({
          id: payload.call_id ?? id,
          name: payload.name,
          arguments: parseJsonObject(payload.arguments) ?? {},
        })],
      });
      return;
    }

    if (payload.type === 'function_call_output' || payload.type === 'custom_tool_call_output') {
      const output = typeof payload.output === 'string'
        ? payload.output
        : JSON.stringify(payload.output ?? '');
      records.push({
        id: (typeof payload.id === 'string' && payload.id ? payload.id : `codex-output-${payload.call_id}`).slice(0, 128),
        role: 'toolResult',
        timestamp,
        content: [textBlock(output)],
        toolCallId: payload.call_id,
        isError: false,
      });
    }
  });

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOADER
// ─────────────────────────────────────────────────────────────────────────────

export function loadCodexSession({ sessionId, transcriptPath, ...options } = {}) {
  if (typeof transcriptPath !== 'string' || !transcriptPath.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: sessionId ? 'session_mismatch' : 'locator_unavailable' };
  }

  // Containment is decided before the file is opened, so a path outside the
  // store is refused without its content ever being read.
  const root = codexStoreRoot(options);
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

  const lines = parseJsonLines(raw);
  if (recordedSessionId(lines, transcriptPath) !== sessionId) {
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
    records: recordsFromLines(lines),
  };
}
