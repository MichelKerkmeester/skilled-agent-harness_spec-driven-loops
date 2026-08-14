// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-communication-projection OpenCode Plugin (adapter)          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the communication-projection    ║
// ║          runtime. Registers the native chat.message hook and, when the   ║
// ║          projection is opted in AND this hook class is not killed,       ║
// ║          replaces the assistant text parts with the projected text by    ║
// ║          calling projectMessage(). Every non-accept terminal restores    ║
// ║          the byte-exact original from a message-id keyed in-memory       ║
// ║          snapshot, and any error fails open (the original parts stay     ║
// ║          untouched, nothing is thrown into the session). Never writes    ║
// ║          stdout/stderr, which OpenCode's TUI paints onto the prompt.     ║
// ║          Default-export-only.                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import {
  createExactOriginalRecord,
  isProjectionEnabled,
  loadLocalProjectionConfig,
  projectMessage,
} from '../skills/sk-communication/cli-communication-projection/dist/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DISABLED_ENV = 'MK_COMMUNICATION_PROJECTION_DISABLED';
const CONCERN = 'communication-projection';
const MAX_SNAPSHOTS = 1_000;
const CONTENT_TYPE = 'text/markdown; charset=utf-8';

// The chat.message seam exposes only the current message (no transcript), so a
// projection cannot select bounded context here yet. Fall back to the exact
// original rather than rewriting without context: projection must stay a no-op
// until a later seam supplies the surrounding transcript.
const NO_CONTEXT_FALLBACK = 'exact-original';

const CAPABILITIES = Object.freeze({
  atomicReplace: true,
  appendAfterOriginal: true,
  sidecar: true,
});

const POLICY = Object.freeze({
  allowedPrivacyClasses: [],
  egressConsent: false,
  requiredKnownFacts: [],
});

const PROMPT = Object.freeze({
  contractKind: 'prompt-profile',
  schemaVersion: '1.0.0',
  promptVersion: '1.0.0',
  systemInstruction: '',
  copyEditingScope: 'assistant-message-only',
  protectedValuePolicyVersion: '1.0.0',
  temperature: 0.2,
  thinkingMode: 'provider-default',
  providerControlMappings: Object.freeze([]),
  unsupportedControlBehavior: 'exact-original',
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. HOOK KILL-SWITCH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide whether this hook class is enabled. Fail-open by default: the only
 * way to disable is the per-plugin kill-switch env var, which an operator can
 * set without touching the projection enablement file. The concern name is
 * retained for parity with the shared kill-switch surface this seam was
 * designed against.
 */
function isHookEnabled(_concern = CONCERN) {
  return process.env[DISABLED_ENV] !== '1';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PART HELPERS -- pure
// ─────────────────────────────────────────────────────────────────────────────

function isTextPart(part) {
  return part !== null
    && typeof part === 'object'
    && part.type === 'text'
    && typeof part.text === 'string';
}

/** Concatenate the assistant text parts, or null when none carry text. */
function extractText(parts) {
  const texts = [];
  for (const part of parts) {
    if (isTextPart(part)) texts.push(part.text);
  }
  return texts.length === 0 ? null : texts.join('\n');
}

/**
 * Replace the assistant text with the projected text. The first text part
 * carries the projection and any further text parts are dropped; non-text
 * parts (tool calls, step markers, file attachments) keep their order.
 * Returns null when there is no text part to replace.
 */
function applyProjection(parts, projectedText) {
  const next = [];
  let applied = false;
  for (const part of parts) {
    if (isTextPart(part)) {
      if (!applied) {
        next.push({ ...part, text: projectedText });
        applied = true;
      }
    } else {
      next.push(part);
    }
  }
  return applied ? next : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SNAPSHOT MAP -- message-id keyed original parts for byte-exact restore
// ─────────────────────────────────────────────────────────────────────────────

function cloneParts(parts) {
  try {
    return structuredClone(parts);
  } catch {
    return null;
  }
}

/**
 * Bounded message-id -> original-parts map. Snapshots are set once per id and
 * evicted oldest-first when the bound is reached; every read returns a fresh
 * clone so the stored original can never be mutated through the caller.
 */
function createSnapshotMap(maxEntries = MAX_SNAPSHOTS) {
  const map = new Map();
  return {
    has(id) {
      return map.has(id);
    },
    set(id, parts) {
      if (map.has(id)) return false;
      const clone = cloneParts(parts);
      if (clone === null) return false;
      if (map.size >= maxEntries) {
        const oldest = map.keys().next().value;
        if (oldest !== undefined) map.delete(oldest);
      }
      map.set(id, clone);
      return true;
    },
    get(id) {
      return map.has(id) ? cloneParts(map.get(id)) : null;
    },
    size() {
      return map.size;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INPUT CONSTRUCTION -- OpenCode message -> projectMessage() input
// ─────────────────────────────────────────────────────────────────────────────

function createCompletedAssistantEvent(key, exactOriginal) {
  return Object.freeze({
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime: key.runtime,
    runtimeVersion: '1.0.0',
    adapterSchemaVersion: '1.0.0',
    sessionId: key.sessionId,
    turnId: key.turnId,
    messageId: key.messageId,
    itemId: null,
    partId: 'part-0',
    toolCallId: null,
    parentId: null,
    eventId: `${key.messageId}:terminal`,
    kind: 'assistant-message',
    phase: 'final',
    sourceTimestamp: null,
    order: { sourceSequence: 0, arrivalIndex: 0, assemblyIndex: null },
    canonicalPayloadRef: exactOriginal.originalId,
    payload: { textOriginalId: exactOriginal.originalId },
    extensions: {},
    terminalStatus: 'completed',
    capabilityConfidence: 'confirmed',
  });
}

function createContext(sessionID, now) {
  return Object.freeze({
    contextId: `${sessionID}:context`,
    transcript: null,
    privacy: Object.freeze({
      contractKind: 'privacy-decision',
      schemaVersion: '1.0.0',
      privacyClass: 'local-offline',
      route: 'local',
      egressConsent: false,
      decision: 'allow',
      reasonCode: 'allowed-by-policy',
    }),
    now,
    maximumAgeMs: 600_000,
    limitCodepoints: 4_000,
    noContextFallback: NO_CONTEXT_FALLBACK,
  });
}

/**
 * Build the projectMessage() input from the current message. The exact text
 * bytes become the exact-original record so any non-accept terminal returns
 * them verbatim. When the shared local-provider loader returns a config, that
 * config supplies the provider, policy, judge, prompt, transport, and a
 * rewrite-without-context context so a configured local model projects here.
 * When the loader returns null the provider and prompt configuration stay
 * empty, the context keeps its exact-original fallback, and the exact-original
 * outcome is the guaranteed result.
 */
function buildProjectionInput({ sessionID, messageID, text, now, config }) {
  const startedAtMs = Date.now();
  const originalId = messageID || `${sessionID}:assistant`;
  const exactOriginal = createExactOriginalRecord(
    originalId,
    new TextEncoder().encode(text),
    CONTENT_TYPE,
    {
      sourceFamily: 'opencode',
      sourceVersion: '1.0.0',
      captureMethod: 'primary-source',
      sanitizationStatus: 'synthetic',
      capturedAt: now,
    },
  );
  const key = Object.freeze({
    runtime: 'opencode',
    sessionId: sessionID,
    turnId: sessionID,
    messageId: messageID || originalId,
    generationId: `${originalId}:generation`,
    attempt: 1,
  });
  const local = config !== undefined ? config : loadLocalProjectionConfig();
  const input = {
    generation: { key, exactOriginal, startedAtMs },
    events: [{
      key,
      event: createCompletedAssistantEvent(key, exactOriginal),
      original: exactOriginal,
      observedAtMs: startedAtMs,
    }],
    context: local !== null ? local.context : createContext(sessionID, now),
    prompt: local !== null ? local.prompt : PROMPT,
    records: local !== null ? local.records : [],
    candidateProviderIds: local !== null ? local.candidateProviderIds : [],
    policy: local !== null ? local.policy : POLICY,
    judgeMode: local !== null ? local.judgeMode : 'disabled',
    capabilities: local !== null ? local.capabilities : CAPABILITIES,
    now,
  };
  if (local !== null) {
    input.transport = local.transport;
  }
  return input;
}

function resolveMessageId(input, parts) {
  if (typeof input?.messageID === 'string' && input.messageID) return input.messageID;
  for (const part of parts) {
    if (part && typeof part.messageID === 'string' && part.messageID) return part.messageID;
  }
  if (typeof input?.sessionID === 'string' && input.sessionID) return input.sessionID;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PROJECTION CORE -- gated, snapshot-backed chat.message handler
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the chat.message handler with its dependencies injected so the gate
 * and restore behavior is directly testable without booting the host or a
 * live provider. Fails open on every path: a disabled gate, a missing or
 * malformed parts array, a non-accept projection, or a thrown error all leave
 * the original parts untouched.
 */
function createProjectionCore({
  projectMessage: project,
  isProjectionEnabled: projectionEnabled,
  isHookEnabled: hookEnabled,
  loadProjectionConfig: loadConfig = loadLocalProjectionConfig,
}) {
  const snapshots = createSnapshotMap();

  async function chatMessage(input, output) {
    let messageId = null;
    try {
      if (!hookEnabled()) return;
      if (!projectionEnabled()) return;

      const parts = output?.parts;
      if (!Array.isArray(parts)) return;

      messageId = resolveMessageId(input, parts);
      if (messageId === null) return;

      // A repeat invocation for an already-handled message restores the
      // original rather than projecting the projected text a second time.
      if (snapshots.has(messageId)) {
        const original = snapshots.get(messageId);
        if (original !== null) output.parts = original;
        return;
      }

      const text = extractText(parts);
      if (text === null) return;

      // Snapshot before any mutation so the original is always restorable.
      if (!snapshots.set(messageId, parts)) return;

      const result = await project(buildProjectionInput({
        sessionID: input?.sessionID || '',
        messageID: messageId,
        text,
        now: new Date().toISOString(),
        config: loadConfig(),
      }));

      if (result?.status === 'projection' && typeof result.text === 'string') {
        const projected = applyProjection(parts, result.text);
        if (projected !== null) output.parts = projected;
      }
      // exact-original (and any other outcome): leave the parts as-is.
    } catch {
      // Fail open: restore the original we captured, if any.
      if (messageId !== null && snapshots.has(messageId)) {
        const original = snapshots.get(messageId);
        if (original !== null) output.parts = original;
      }
    }
  }

  return Object.freeze({ chatMessage });
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-communication-projection OpenCode plugin hooks.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkCommunicationProjectionPlugin(_ctx) {
  const core = createProjectionCore({
    projectMessage,
    isProjectionEnabled,
    isHookEnabled,
  });

  return {
    async 'chat.message'(input, output) {
      await core.chatMessage(input, output);
    },
  };
}

// Test surface hung off the default export (never a separate named export --
// OpenCode loads every export as its own plugin and a stray one silently
// drops this entire file).
MkCommunicationProjectionPlugin.__test = Object.freeze({
  DISABLED_ENV,
  CONCERN,
  MAX_SNAPSHOTS,
  isHookEnabled,
  isTextPart,
  extractText,
  applyProjection,
  createSnapshotMap,
  buildProjectionInput,
  createProjectionCore,
});
