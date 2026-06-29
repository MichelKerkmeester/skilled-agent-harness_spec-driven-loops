// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Goal OpenCode Plugin (mk-goal)                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Persist session goals and inject passive goal steering.        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import { appendFile, mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
import { join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin/tool';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'mk-goal';
const DEFAULT_STATE_DIR = fileURLToPath(new URL('../skills/.goal-state/', import.meta.url));
const DEFAULT_MAX_OBJECTIVE_CHARS = 2000;
const DEFAULT_MAX_INJECTION_CHARS = 2400;
const DEFAULT_MAX_REASON_CHARS = 280;
const DEFAULT_MAX_EVIDENCE_CHARS = 1200;
const DEFAULT_MAX_AUTO_TURNS = 8;
const DEFAULT_CONTINUATION_COOLDOWN_MS = 1500;
const DEFAULT_MAX_WALL_MS = 30 * 60 * 1000;
const DISABLED_ENV = 'MK_GOAL_PLUGIN_DISABLED';
const AUTONOMY_ENV = 'MK_GOAL_AUTONOMY';
const DEBUG_ENV = 'MK_GOAL_DEBUG';
const CONTINUATION_LOG_FILENAME = '.continuation.log';
const GOAL_EVENTS_LOG_FILENAME = '.goal-events.log';
const AUTONOMY_ACTIVE_MODES = new Set(['active', 'smoke']);
const VALID_STATUSES = new Set([
  'active',
  'paused',
  'blocked',
  'usage_limited',
  'budget_limited',
  'complete',
]);
const VALID_VERIFIER_VERDICTS = new Set(['met', 'not_met', 'blocked']);
const EMPTY_INJECTION_PREVIEW = '';
const GOAL_ACTIONS = ['set', 'show', 'clear', 'complete', 'pause'];
const mutationQueues = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS
// ─────────────────────────────────────────────────────────────────────────────

class GoalError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'GoalError';
    this.code = code;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PURE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function normalizePositiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function normalizeOptions(rawOptions = {}) {
  const envMaxObjectiveChars = Number(process.env.MK_GOAL_MAX_OBJECTIVE_CHARS);
  const envMaxInjectionChars = Number(process.env.MK_GOAL_MAX_INJECTION_CHARS);
  const envMaxEvidenceChars = Number(process.env.MK_GOAL_MAX_EVIDENCE_CHARS);
  const options = rawOptions && typeof rawOptions === 'object' ? rawOptions : {};

  return {
    enabled: options.enabled !== false && process.env[DISABLED_ENV] !== '1',
    stateDir: resolvePath(typeof options.stateDir === 'string' && options.stateDir.trim()
      ? options.stateDir.trim()
      : DEFAULT_STATE_DIR),
    maxObjectiveChars: normalizePositiveInt(
      options.maxObjectiveChars,
      normalizePositiveInt(envMaxObjectiveChars, DEFAULT_MAX_OBJECTIVE_CHARS),
    ),
    maxInjectionChars: normalizePositiveInt(
      options.maxInjectionChars,
      normalizePositiveInt(envMaxInjectionChars, DEFAULT_MAX_INJECTION_CHARS),
    ),
    maxEvidenceChars: normalizePositiveInt(
      options.maxEvidenceChars,
      normalizePositiveInt(envMaxEvidenceChars, DEFAULT_MAX_EVIDENCE_CHARS),
    ),
    nowMs: Number.isFinite(options.nowMs) ? Math.trunc(options.nowMs) : null,
    goalIdFactory: typeof options.goalIdFactory === 'function' ? options.goalIdFactory : null,
    supervisorVerifier: typeof options.supervisorVerifier === 'function' ? options.supervisorVerifier : null,
  };
}

function nowMs(options = {}) {
  return Number.isFinite(options.nowMs) ? Math.trunc(options.nowMs) : Date.now();
}

function isoFromMs(value) {
  return new Date(value).toISOString();
}

function stableStringify(value) {
  if (!value || typeof value !== 'object') return JSON.stringify(String(value));
  if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function normalizeSessionID(value) {
  if (value === null || value === undefined) return null;
  const normalized = typeof value === 'object' ? stableStringify(value) : String(value);
  const trimmed = normalized.trim();
  return trimmed ? trimmed : null;
}

function requireSessionID(value) {
  const sessionID = normalizeSessionID(value);
  if (!sessionID) {
    throw new GoalError('MISSING_SESSION_ID', 'Missing session id; refusing to read or write shared goal state');
  }
  return sessionID;
}

function sessionIdFromInput(input) {
  if (!input || typeof input !== 'object') return null;
  return normalizeSessionID(
    input.sessionID
      || input.sessionId
      || input.session?.id
      || input.properties?.sessionID
      || input.properties?.info?.sessionID
      || null,
  );
}

function sessionIdFromContext(context) {
  if (!context || typeof context !== 'object') return null;
  return normalizeSessionID(context.sessionID || context.sessionId || context.session?.id || null);
}

function sessionKeyForSession(sessionID) {
  return Buffer.from(requireSessionID(sessionID), 'utf8').toString('hex');
}

function clampText(value, maxChars) {
  const text = String(value ?? '');
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(1, maxChars - 3)).trimEnd()}...`;
}

function sanitizeInlineText(value, maxChars = DEFAULT_MAX_OBJECTIVE_CHARS) {
  const text = String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\[\/?active_goal[^\]]*\]/gi, '[goal-marker-redacted]')
    .replace(/`{3,}/g, '\'\'\'')
    .replace(/\b(system|developer|assistant|tool|user)\s*:/gi, '$1-role:')
    .replace(/\b(ignore|disregard)\s+(all\s+)?(previous|prior)\s+(instructions?|messages?)\b/gi, '[instruction-redacted]');
  return clampText(text, maxChars);
}

function redactEvidence(value, maxChars = DEFAULT_MAX_EVIDENCE_CHARS) {
  const text = sanitizeInlineText(value, maxChars)
    .replace(/\b(sk-[A-Za-z0-9_-]{8,})\b/g, '[secret-redacted]')
    .replace(/\b(gh[pousr]_[A-Za-z0-9_]{12,})\b/g, '[secret-redacted]')
    .replace(/\b(xox[baprs]-[A-Za-z0-9-]{12,})\b/g, '[secret-redacted]')
    .replace(/\b(AKIA[0-9A-Z]{12,})\b/g, '[secret-redacted]')
    .replace(/\b(api[_-]?key|token|password|secret)\s*[:=]\s*['"]?[^'"\s,;]+/gi, '$1=[secret-redacted]');
  return clampText(text, maxChars);
}

function normalizeTokenBudget(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new GoalError('INVALID_TOKEN_BUDGET', 'Token budget must be a positive integer or null');
  }
  return Math.trunc(numeric);
}

function quoteValue(value) {
  return JSON.stringify(String(value ?? ''));
}

function goalIdFromFactory(options) {
  const candidate = options.goalIdFactory ? options.goalIdFactory() : null;
  const normalized = sanitizeInlineText(candidate || `goal-${randomUUID()}`, 160);
  if (!normalized) return `goal-${randomUUID()}`;
  return normalized.replace(/\s+/g, '-');
}

function eventPayloadFrom(event) {
  if (event?.payload && typeof event.payload === 'object') return event.payload;
  return event;
}

function eventTypeFrom(event) {
  const payload = eventPayloadFrom(event);
  return typeof payload?.type === 'string' ? payload.type : null;
}

function eventPropertiesFrom(event) {
  const payload = eventPayloadFrom(event);
  return payload?.properties && typeof payload.properties === 'object' ? payload.properties : {};
}

function extractEventSessionID(event) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  return normalizeSessionID(
    payload?.sessionID
      || payload?.sessionId
      || payload?.session?.id
      || properties.sessionID
      || properties.sessionId
      || properties.session?.id
      || properties.info?.sessionID
      || properties.info?.sessionId
      || properties.message?.sessionID
      || properties.message?.sessionId
      || properties.part?.sessionID
      || properties.part?.sessionId
      || null,
  );
}

function extractEventMessageID(event) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  return normalizeSessionID(
    payload?.messageID
      || payload?.messageId
      || payload?.id
      || payload?.message?.id
      || properties.messageID
      || properties.messageId
      || properties.id
      || properties.info?.messageID
      || properties.info?.messageId
      || properties.info?.id
      || properties.message?.id
      || properties.part?.messageID
      || properties.part?.messageId
      || null,
  );
}

function extractEventGoalID(event) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  return sanitizeInlineText(
    payload?.goalID
      || payload?.goalId
      || properties.goalID
      || properties.goalId
      || properties.info?.goalID
      || properties.info?.goalId
      || null,
    160,
  ).replace(/\s+/g, '-');
}

function extractEventSessionStatus(event) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  const status = payload?.status || properties.status || properties.info?.status || null;
  return sanitizeInlineText(status?.type || status || '', 80).toLowerCase() || null;
}

function autonomyModeFromEnv() {
  return sanitizeInlineText(process.env[AUTONOMY_ENV] || '', 40).toLowerCase();
}

function disabledAutonomyReason(mode) {
  return mode === 'passive' ? 'autonomy_passive' : 'autonomy_disabled';
}

function normalizeAutoTurns(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(DEFAULT_MAX_AUTO_TURNS, Math.trunc(value)));
}

async function appendGoalJsonl(filename, payload, rawOptions = {}) {
  try {
    const stateDir = await ensureGoalStateDir(rawOptions);
    await appendFile(join(stateDir, filename), `${JSON.stringify(payload)}\n`, 'utf8');
  } catch {
    return;
  }
}

async function logContinuationDecision(sessionID, decision, reason, autoTurnsUsed, rawOptions = {}) {
  await appendGoalJsonl(CONTINUATION_LOG_FILENAME, {
    sid: sessionID || null,
    decision,
    reason: sanitizeInlineText(reason, DEFAULT_MAX_REASON_CHARS) || 'unknown',
    autoTurnsUsed: normalizeAutoTurns(autoTurnsUsed),
  }, rawOptions);
}

async function logDebugEvent(eventType, sessionID, rawOptions = {}) {
  if (process.env[DEBUG_ENV] !== '1') return;
  await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {
    type: sanitizeInlineText(eventType || 'unknown', 80),
    sid: sessionID || null,
  }, rawOptions);
}

function numericField(source, keys) {
  if (!source || typeof source !== 'object') return null;
  for (const key of keys) {
    const value = Number(source[key]);
    if (Number.isFinite(value) && value > 0) return Math.trunc(value);
  }
  return null;
}

function tokenCountFromUsage(usage) {
  if (!usage || typeof usage !== 'object') return 0;
  const direct = numericField(usage, [
    'tokenDelta',
    'token_delta',
    'tokensDelta',
    'tokens_delta',
    'totalTokens',
    'total_tokens',
    'tokens',
    'tokenCount',
    'token_count',
  ]);
  if (direct !== null) return direct;
  const input = numericField(usage, ['inputTokens', 'input_tokens', 'promptTokens', 'prompt_tokens']) || 0;
  const output = numericField(usage, ['outputTokens', 'output_tokens', 'completionTokens', 'completion_tokens']) || 0;
  return input + output;
}

function secondsFromUsage(usage) {
  if (!usage || typeof usage !== 'object') return 0;
  const direct = numericField(usage, ['timeSeconds', 'time_seconds', 'seconds', 'durationSeconds', 'duration_seconds']);
  if (direct !== null) return direct;
  const millis = numericField(usage, ['timeMs', 'time_ms', 'durationMs', 'duration_ms']);
  return millis === null ? 0 : Math.max(1, Math.trunc(millis / 1000));
}

function extractUsageFromEvent(event) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  const candidates = [
    payload?.usage,
    payload?.message?.usage,
    properties.usage,
    properties.info?.usage,
    properties.info?.tokens,
    properties.message?.usage,
    properties.part?.usage,
  ].filter((candidate) => candidate && typeof candidate === 'object');
  const usage = candidates.find((candidate) => tokenCountFromUsage(candidate) > 0) || candidates[0] || null;
  const tokenDelta = tokenCountFromUsage(usage);
  const timeDeltaSeconds = secondsFromUsage(usage);
  const source = sanitizeInlineText(usage?.source || usage?.usageSource || (tokenDelta > 0 ? 'message.updated' : 'unavailable'), 80);
  return {
    tokenDelta,
    timeDeltaSeconds,
    usageSource: source || 'unavailable',
  };
}

function roleFromObject(value) {
  if (!value || typeof value !== 'object') return null;
  return sanitizeInlineText(value.role || value.author?.role || value.sender?.role || '', 80).toLowerCase() || null;
}

function textFromValue(value, depth = 0) {
  if (depth > 4 || value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((entry) => textFromValue(entry, depth + 1)).filter(Boolean).join(' ');
  if (typeof value !== 'object') return '';
  for (const key of ['text', 'content', 'markdown', 'output', 'summary']) {
    const text = textFromValue(value[key], depth + 1);
    if (text) return text;
  }
  return '';
}

function extractAssistantEvidence(event, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  const candidates = [
    payload?.message,
    payload?.info,
    payload?.part,
    properties.message,
    properties.info,
    properties.part,
    payload,
  ].filter((candidate) => candidate && typeof candidate === 'object');
  const role = candidates.map(roleFromObject).find(Boolean);
  if (role && role !== 'assistant') return null;
  const text = candidates.map((candidate) => textFromValue(candidate)).find(Boolean);
  const redacted = redactEvidence(text, options.maxEvidenceChars);
  return redacted || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STATE STORE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ensure the goal state directory exists.
 *
 * @param {Object} [rawOptions] - State helper options
 * @param {string} [rawOptions.stateDir] - Override directory for tests
 * @returns {Promise<string>} Absolute state directory path
 */
async function ensureGoalStateDir(rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  await mkdir(options.stateDir, { recursive: true, mode: 0o700 });
  return options.stateDir;
}

/**
 * Resolve a per-session goal state file path.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Object} [rawOptions] - State helper options
 * @returns {string} Absolute JSON file path
 */
function goalPathForSession(sessionID, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  return join(options.stateDir, `${sessionKeyForSession(sessionID)}.json`);
}

function normalizeStoredGoal(rawGoal, fallbackSessionID, rawOptions = {}) {
  if (!rawGoal || typeof rawGoal !== 'object') {
    throw new GoalError('INVALID_GOAL_STATE', 'Goal state is not a JSON object');
  }
  const options = normalizeOptions(rawOptions);
  const sessionID = requireSessionID(rawGoal.sessionId ?? fallbackSessionID);
  const objective = sanitizeInlineText(rawGoal.objective, options.maxObjectiveChars);
  if (!objective) {
    throw new GoalError('INVALID_GOAL_STATE', 'Goal state is missing an objective');
  }
  if (!VALID_STATUSES.has(rawGoal.status)) {
    throw new GoalError('INVALID_GOAL_STATE', `Goal state has invalid status: ${rawGoal.status}`);
  }

  const createdAtMs = Number.isFinite(rawGoal.createdAtMs) ? Math.trunc(rawGoal.createdAtMs) : nowMs(options);
  const updatedAtMs = Number.isFinite(rawGoal.updatedAtMs) ? Math.trunc(rawGoal.updatedAtMs) : createdAtMs;

  return {
    ...rawGoal,
    sessionId: sessionID,
    goalId: sanitizeInlineText(rawGoal.goalId || goalIdFromFactory(options), 160).replace(/\s+/g, '-'),
    objective,
    status: rawGoal.status,
    tokenBudget: rawGoal.tokenBudget === undefined ? null : rawGoal.tokenBudget,
    tokensUsed: Number.isFinite(rawGoal.tokensUsed) ? Math.max(0, Math.trunc(rawGoal.tokensUsed)) : 0,
    timeUsedSeconds: Number.isFinite(rawGoal.timeUsedSeconds) ? Math.max(0, Math.trunc(rawGoal.timeUsedSeconds)) : 0,
    createdAtMs,
    updatedAtMs,
    createdAt: typeof rawGoal.createdAt === 'string' ? rawGoal.createdAt : isoFromMs(createdAtMs),
    updatedAt: typeof rawGoal.updatedAt === 'string' ? rawGoal.updatedAt : isoFromMs(updatedAtMs),
    continuationSuppressed: rawGoal.continuationSuppressed === true,
    autoTurnsUsed: normalizeAutoTurns(rawGoal.autoTurnsUsed),
    maxAutoTurns: Number.isFinite(rawGoal.maxAutoTurns)
      ? Math.max(0, Math.min(DEFAULT_MAX_AUTO_TURNS, Math.trunc(rawGoal.maxAutoTurns)))
      : DEFAULT_MAX_AUTO_TURNS,
    startedAtMs: Number.isFinite(rawGoal.startedAtMs) ? Math.max(0, Math.trunc(rawGoal.startedAtMs)) : createdAtMs,
    lastActivityAtMs: Number.isFinite(rawGoal.lastActivityAtMs) ? Math.max(0, Math.trunc(rawGoal.lastActivityAtMs)) : 0,
    lastActivityMessageID: rawGoal.lastActivityMessageID === null || rawGoal.lastActivityMessageID === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastActivityMessageID, 160),
    lastContinuationAtMs: Number.isFinite(rawGoal.lastContinuationAtMs)
      ? Math.max(0, Math.trunc(rawGoal.lastContinuationAtMs))
      : 0,
    lastContinuationMessageId: rawGoal.lastContinuationMessageId === null || rawGoal.lastContinuationMessageId === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastContinuationMessageId, 160),
    lastContinuationError: rawGoal.lastContinuationError === null || rawGoal.lastContinuationError === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastContinuationError, DEFAULT_MAX_REASON_CHARS),
    continuationSuppressedReason: rawGoal.continuationSuppressedReason === null || rawGoal.continuationSuppressedReason === undefined
      ? null
      : sanitizeInlineText(rawGoal.continuationSuppressedReason, DEFAULT_MAX_REASON_CHARS),
    blockedByPrompt: rawGoal.blockedByPrompt === true,
    iterations: Number.isFinite(rawGoal.iterations) ? Math.max(0, Math.trunc(rawGoal.iterations)) : 0,
    lastVerifierVerdict: sanitizeInlineText(rawGoal.lastVerifierVerdict || 'not_evaluated', 80),
    lastVerifierReason: rawGoal.lastVerifierReason === null || rawGoal.lastVerifierReason === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastVerifierReason, DEFAULT_MAX_REASON_CHARS),
    lastVerifierConfidence: Number.isFinite(rawGoal.lastVerifierConfidence)
      ? Math.max(0, Math.min(1, Number(rawGoal.lastVerifierConfidence)))
      : null,
    lastCheckAtMs: Number.isFinite(rawGoal.lastCheckAtMs) ? Math.max(0, Math.trunc(rawGoal.lastCheckAtMs)) : 0,
    lastEvidence: rawGoal.lastEvidence === null || rawGoal.lastEvidence === undefined
      ? null
      : redactEvidence(rawGoal.lastEvidence, options.maxEvidenceChars),
    completionSource: rawGoal.completionSource === null || rawGoal.completionSource === undefined
      ? null
      : sanitizeInlineText(rawGoal.completionSource, 80),
    verifierRunID: rawGoal.verifierRunID === null || rawGoal.verifierRunID === undefined
      ? null
      : sanitizeInlineText(rawGoal.verifierRunID, 160),
    lastAccountedMessageID: rawGoal.lastAccountedMessageID === null || rawGoal.lastAccountedMessageID === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastAccountedMessageID, 160),
    usageSource: sanitizeInlineText(rawGoal.usageSource || 'unavailable', 80),
  };
}

/**
 * Read the current goal for a session.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<Object|null>} Goal record, or null when none is set
 */
async function readGoal(sessionID, rawOptions = {}) {
  const path = goalPathForSession(sessionID, rawOptions);
  try {
    const raw = await readFile(path, 'utf8');
    return normalizeStoredGoal(JSON.parse(raw), sessionID, rawOptions);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    if (error instanceof GoalError) throw error;
    throw new GoalError('READ_GOAL_FAILED', `Failed to read goal state: ${error.message}`);
  }
}

async function fsyncDirectory(directoryPath) {
  let handle = null;
  try {
    handle = await open(directoryPath, 'r');
    await handle.sync();
  } catch {
    return;
  } finally {
    if (handle) await handle.close().catch(() => {});
  }
}

/**
 * Atomically write a goal record.
 *
 * @param {Object} goal - Goal record to persist
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<Object>} Written goal record
 */
async function writeGoalAtomic(goal, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const normalized = normalizeStoredGoal(goal, goal?.sessionId, options);
  const stateDir = await ensureGoalStateDir(options);
  const finalPath = goalPathForSession(normalized.sessionId, options);
  const tempPath = `${finalPath}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  let handle = null;

  try {
    handle = await open(tempPath, 'w', 0o600);
    await handle.writeFile(`${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
    await handle.sync();
    await handle.close();
    handle = null;
    await rename(tempPath, finalPath);
    await fsyncDirectory(stateDir);
    return normalized;
  } catch (error) {
    if (handle) await handle.close().catch(() => {});
    await unlink(tempPath).catch(() => {});
    if (error instanceof GoalError) throw error;
    throw new GoalError('WRITE_GOAL_FAILED', `Failed to write goal state: ${error.message}`);
  }
}

async function deleteGoalFile(sessionID, rawOptions = {}) {
  const path = goalPathForSession(sessionID, rawOptions);
  try {
    await unlink(path);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw new GoalError('CLEAR_GOAL_FAILED', `Failed to clear goal state: ${error.message}`);
    }
  }
  await fsyncDirectory(normalizeOptions(rawOptions).stateDir);
  return null;
}

/**
 * Mutate a session goal through the in-process write queue.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Function} mutator - Function receiving the current goal
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<Object|null>} Mutated goal, or null after delete
 */
async function mutateGoal(sessionID, mutator, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const normalizedSessionID = requireSessionID(sessionID);
  const queueKey = `${options.stateDir}:${sessionKeyForSession(normalizedSessionID)}`;
  const previous = mutationQueues.get(queueKey) || Promise.resolve();
  const run = previous.catch(() => undefined).then(async () => {
    const current = await readGoal(normalizedSessionID, options);
    const next = await mutator(current);
    if (next === null) return deleteGoalFile(normalizedSessionID, options);
    if (next === undefined) return current;
    return writeGoalAtomic(next, options);
  });

  mutationQueues.set(queueKey, run);
  try {
    return await run;
  } finally {
    if (mutationQueues.get(queueKey) === run) mutationQueues.delete(queueKey);
  }
}

function buildNewGoal(sessionID, objective, tokenBudget, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const timestamp = nowMs(options);

  return {
    sessionId: requireSessionID(sessionID),
    goalId: goalIdFromFactory(options),
    objective,
    status: 'active',
    tokenBudget,
    tokensUsed: 0,
    timeUsedSeconds: 0,
    createdAtMs: timestamp,
    updatedAtMs: timestamp,
    createdAt: isoFromMs(timestamp),
    updatedAt: isoFromMs(timestamp),
    continuationSuppressed: false,
    autoTurnsUsed: 0,
    maxAutoTurns: DEFAULT_MAX_AUTO_TURNS,
    startedAtMs: timestamp,
    lastActivityAtMs: 0,
    lastActivityMessageID: null,
    lastContinuationAtMs: 0,
    lastContinuationMessageId: null,
    lastContinuationError: null,
    continuationSuppressedReason: null,
    blockedByPrompt: false,
    iterations: 0,
    lastCheckAtMs: 0,
    lastVerifierVerdict: 'not_evaluated',
    lastVerifierReason: null,
    lastVerifierConfidence: null,
    lastEvidence: null,
    completionSource: null,
    verifierRunID: null,
    lastAccountedMessageID: null,
    usageSource: 'unavailable',
  };
}

/**
 * Set or replace the current session goal.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {string} objective - User-authored completion condition
 * @param {Object} [rawOptions] - State helper options
 * @param {number|null} [rawOptions.tokenBudget] - Optional token budget
 * @returns {Promise<Object>} Active goal record
 */
async function setGoal(sessionID, objective, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const sanitizedObjective = sanitizeInlineText(objective, options.maxObjectiveChars);
  if (!sanitizedObjective) {
    throw new GoalError('INVALID_OBJECTIVE', 'Objective is required');
  }
  const requestedBudget = normalizeTokenBudget(rawOptions.tokenBudget);

  return mutateGoal(sessionID, (current) => {
    const timestamp = nowMs(options);
    const tokenBudget = requestedBudget === undefined ? current?.tokenBudget ?? null : requestedBudget;
    if (current && current.objective === sanitizedObjective) {
      return {
        ...current,
        status: 'active',
        tokenBudget,
        updatedAtMs: timestamp,
        updatedAt: isoFromMs(timestamp),
        continuationSuppressed: false,
        continuationSuppressedReason: null,
        blockedByPrompt: false,
      };
    }
    return buildNewGoal(sessionID, sanitizedObjective, tokenBudget, options);
  }, options);
}

/**
 * Clear the current session goal.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<null>} Null after deletion
 */
async function clearGoal(sessionID, rawOptions = {}) {
  return mutateGoal(sessionID, () => null, rawOptions);
}

async function markGoalStatus(sessionID, status, rawOptions = {}) {
  if (!VALID_STATUSES.has(status)) {
    throw new GoalError('INVALID_STATUS', `Unsupported goal status: ${status}`);
  }
  const reason = sanitizeInlineText(rawOptions.reason || '', DEFAULT_MAX_REASON_CHARS);
  return mutateGoal(sessionID, (current) => {
    if (!current) throw new GoalError('GOAL_NOT_FOUND', 'No goal is set for this session');
    const timestamp = nowMs(rawOptions);
    return {
      ...current,
      status,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
      continuationSuppressed: status === 'paused' || status === 'complete' ? true : current.continuationSuppressed,
      continuationSuppressedReason: reason || (status === 'paused' ? 'paused' : current.continuationSuppressedReason),
      completionSource: status === 'complete' ? 'manual' : current.completionSource,
    };
  }, rawOptions);
}

function budgetWasCrossed(nextTokensUsed, tokenBudget) {
  return Number.isFinite(tokenBudget) && tokenBudget > 0 && nextTokensUsed >= tokenBudget;
}

/**
 * Charge token usage to the active goal when the event still belongs to it.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {string} expectedGoalID - Goal id observed before accounting
 * @param {Object} usage - Usage details extracted from a lifecycle event
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<Object|null>} Updated goal, unchanged goal, or null
 */
async function accountUsage(sessionID, expectedGoalID, usage = {}, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const normalizedExpectedGoalID = sanitizeInlineText(expectedGoalID, 160).replace(/\s+/g, '-');
  const messageID = usage.messageID === null || usage.messageID === undefined
    ? null
    : sanitizeInlineText(usage.messageID, 160);
  const tokenDelta = Number.isFinite(usage.tokenDelta) && usage.tokenDelta > 0 ? Math.trunc(usage.tokenDelta) : 0;
  const timeDeltaSeconds = Number.isFinite(usage.timeDeltaSeconds) && usage.timeDeltaSeconds > 0
    ? Math.trunc(usage.timeDeltaSeconds)
    : 0;
  const usageSource = sanitizeInlineText(usage.usageSource || 'unavailable', 80) || 'unavailable';

  return mutateGoal(sessionID, (current) => {
    if (!current) return null;
    if (current.status !== 'active') return current;
    if (!normalizedExpectedGoalID || current.goalId !== normalizedExpectedGoalID) return current;
    if (messageID && current.lastAccountedMessageID === messageID) return current;

    const timestamp = nowMs(options);
    if (tokenDelta <= 0) {
      return {
        ...current,
        usageSource,
        updatedAtMs: timestamp,
        updatedAt: isoFromMs(timestamp),
      };
    }

    const nextTokensUsed = current.tokensUsed + tokenDelta;
    const nextStatus = budgetWasCrossed(nextTokensUsed, current.tokenBudget) ? 'budget_limited' : current.status;
    return {
      ...current,
      status: nextStatus,
      tokensUsed: nextTokensUsed,
      timeUsedSeconds: current.timeUsedSeconds + timeDeltaSeconds,
      lastAccountedMessageID: messageID || current.lastAccountedMessageID,
      usageSource,
      continuationSuppressed: nextStatus === 'budget_limited' ? true : current.continuationSuppressed,
      continuationSuppressedReason: nextStatus === 'budget_limited' ? 'token budget reached' : current.continuationSuppressedReason,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, options);
}

async function refreshGoalActivity(sessionID, event, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const messageID = extractEventMessageID(event);
  const evidence = extractAssistantEvidence(event, options);

  return mutateGoal(sessionID, (current) => {
    if (!current) return null;
    const timestamp = nowMs(options);
    return {
      ...current,
      lastActivityAtMs: timestamp,
      lastActivityMessageID: messageID || current.lastActivityMessageID,
      lastEvidence: evidence || current.lastEvidence,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, options);
}

async function recordMessageUpdated(sessionID, event, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const goalAfterActivity = await refreshGoalActivity(sessionID, event, options);
  if (!goalAfterActivity) return null;
  const usage = extractUsageFromEvent(event);
  const eventGoalID = extractEventGoalID(event);
  return accountUsage(sessionID, eventGoalID || goalAfterActivity.goalId, {
    ...usage,
    messageID: extractEventMessageID(event),
  }, options);
}

async function setBlockedByPrompt(sessionID, blockedByPrompt, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  return mutateGoal(sessionID, (current) => {
    if (!current) return null;
    const timestamp = nowMs(options);
    return {
      ...current,
      blockedByPrompt: blockedByPrompt === true,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, options);
}

async function restoreActiveGoal(sessionID, rawOptions = {}) {
  const goal = await readGoal(sessionID, rawOptions);
  return goal?.status === 'active' ? goal : null;
}

function defaultVerifierResult(reason, evidence = null) {
  return {
    verdict: 'not_met',
    confidence: 0,
    reason,
    evidence,
  };
}

function normalizeVerifierResult(rawResult, fallbackEvidence, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  if (!rawResult || typeof rawResult !== 'object') {
    return defaultVerifierResult('Verifier returned no usable result', redactEvidence(fallbackEvidence, options.maxEvidenceChars));
  }
  const verdict = VALID_VERIFIER_VERDICTS.has(rawResult.verdict) ? rawResult.verdict : 'not_met';
  const confidence = Number.isFinite(rawResult.confidence)
    ? Math.max(0, Math.min(1, Number(rawResult.confidence)))
    : 0;
  const reason = sanitizeInlineText(
    rawResult.reason || (verdict === 'not_met' ? 'Evidence does not prove the goal is met' : verdict),
    DEFAULT_MAX_REASON_CHARS,
  );
  const evidence = redactEvidence(rawResult.evidence ?? fallbackEvidence, options.maxEvidenceChars) || null;
  return {
    verdict,
    confidence,
    reason,
    evidence,
  };
}

async function runSupervisorVerifier(goal, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  if (!goal?.lastEvidence) {
    return defaultVerifierResult('No verifier evidence is available', null);
  }
  if (!options.supervisorVerifier) {
    return defaultVerifierResult('Supervisor verifier is not configured', goal.lastEvidence);
  }
  try {
    const result = await options.supervisorVerifier({
      goal,
      sessionID: goal.sessionId,
      evidence: goal.lastEvidence,
    });
    return normalizeVerifierResult(result, goal.lastEvidence, options);
  } catch (error) {
    return {
      verdict: 'blocked',
      confidence: 0,
      reason: sanitizeInlineText(`Verifier failed: ${error?.message || 'unknown error'}`, DEFAULT_MAX_REASON_CHARS),
      evidence: redactEvidence(goal.lastEvidence, options.maxEvidenceChars),
    };
  }
}

/**
 * Run the goal supervisor once and apply only compare-safe state transitions.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<Object>} Verifier verdict envelope
 */
async function maybeVerifyGoal(sessionID, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const goal = await readGoal(sessionID, options);
  if (!goal || goal.status !== 'active') {
    return defaultVerifierResult('No active goal to verify', null);
  }

  const result = await runSupervisorVerifier(goal, options);
  const verifierRunID = `verifier-${randomUUID()}`;
  await mutateGoal(sessionID, (current) => {
    if (!current || current.goalId !== goal.goalId || current.status !== 'active') return current;
    const timestamp = nowMs(options);
    const next = {
      ...current,
      lastCheckAtMs: timestamp,
      lastVerifierVerdict: result.verdict,
      lastVerifierReason: result.reason,
      lastVerifierConfidence: result.confidence,
      lastEvidence: result.evidence || current.lastEvidence,
      verifierRunID,
      iterations: result.verdict === 'not_met' ? current.iterations + 1 : current.iterations,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
    if (result.verdict === 'met') {
      return {
        ...next,
        status: 'complete',
        completionSource: 'supervisor',
        continuationSuppressed: true,
        continuationSuppressedReason: 'goal verified complete',
      };
    }
    if (result.verdict === 'blocked') {
      return {
        ...next,
        status: 'blocked',
        continuationSuppressed: true,
        continuationSuppressedReason: result.reason,
      };
    }
    return next;
  }, options);

  return result;
}

function renderContinuationPrompt(goal, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const objective = sanitizeInlineText(goal?.objective, options.maxObjectiveChars);
  const reason = sanitizeInlineText(goal?.lastVerifierReason || 'not verified complete', DEFAULT_MAX_REASON_CHARS);
  return clampText([
    '[active_goal_continuation]',
    `objective: ${objective}`,
    `last_check: ${goal?.lastVerifierVerdict || 'not_evaluated'} ; reason: ${reason}`,
    'instruction: Continue the active goal from the current session context. Do not ask for confirmation unless blocked by missing permission or user input. End only when the verifier can prove completion or the work is blocked.',
    '[/active_goal_continuation]',
  ].join('\n'), options.maxInjectionChars);
}

function continuationRuntimeStatus(runtimeState, sessionID) {
  const rawStatus = runtimeState?.sessionStatuses?.get?.(sessionID) || null;
  return sanitizeInlineText(rawStatus?.type || rawStatus || '', 80).toLowerCase() || null;
}

function continuationCapReason(goal, timestamp) {
  const maxAutoTurns = Math.min(goal.maxAutoTurns || DEFAULT_MAX_AUTO_TURNS, DEFAULT_MAX_AUTO_TURNS);
  if (goal.autoTurnsUsed >= maxAutoTurns) return 'auto_turn_cap_reached';
  if (timestamp - goal.startedAtMs >= DEFAULT_MAX_WALL_MS) return 'wall_clock_cap_reached';
  return null;
}

function continuationBudgetReason(goal) {
  if (Number.isFinite(goal.tokenBudget) && goal.tokenBudget > 0 && goal.tokensUsed >= goal.tokenBudget) {
    return 'budget_exhausted';
  }
  return null;
}

async function recordContinuationReason(sessionID, goalID, reason, rawOptions = {}, suppress = false, errorText = null) {
  const normalizedGoalID = sanitizeInlineText(goalID, 160).replace(/\s+/g, '-');
  if (!normalizedGoalID) return null;
  return mutateGoal(sessionID, (current) => {
    if (!current || current.goalId !== normalizedGoalID) return current;
    const timestamp = nowMs(rawOptions);
    return {
      ...current,
      continuationSuppressed: suppress ? true : current.continuationSuppressed,
      continuationSuppressedReason: sanitizeInlineText(reason, DEFAULT_MAX_REASON_CHARS),
      lastContinuationError: errorText
        ? sanitizeInlineText(errorText, DEFAULT_MAX_REASON_CHARS)
        : current.lastContinuationError,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, rawOptions);
}

async function recordContinuationBudgetStop(sessionID, goalID, rawOptions = {}) {
  const normalizedGoalID = sanitizeInlineText(goalID, 160).replace(/\s+/g, '-');
  if (!normalizedGoalID) return null;
  return mutateGoal(sessionID, (current) => {
    if (!current || current.goalId !== normalizedGoalID) return current;
    const timestamp = nowMs(rawOptions);
    return {
      ...current,
      status: 'budget_limited',
      continuationSuppressed: true,
      continuationSuppressedReason: 'budget_exhausted',
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, rawOptions);
}

async function reserveContinuationTurn(sessionID, goalID, rawOptions = {}) {
  const normalizedGoalID = sanitizeInlineText(goalID, 160).replace(/\s+/g, '-');
  const messageID = `goal-continuation-${randomUUID()}`;
  let didReserve = false;
  const goal = await mutateGoal(sessionID, (current) => {
    if (!current || current.goalId !== normalizedGoalID || current.status !== 'active') return current;
    const maxAutoTurns = Math.min(current.maxAutoTurns || DEFAULT_MAX_AUTO_TURNS, DEFAULT_MAX_AUTO_TURNS);
    if (current.autoTurnsUsed >= maxAutoTurns) return current;
    const timestamp = nowMs(rawOptions);
    didReserve = true;
    return {
      ...current,
      autoTurnsUsed: current.autoTurnsUsed + 1,
      lastContinuationAtMs: timestamp,
      lastContinuationMessageId: messageID,
      lastContinuationError: null,
      continuationSuppressedReason: null,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, rawOptions);

  return { didReserve, goal, messageID };
}

function buildPromptAsyncOptions(sessionID, goal, messageID, rawOptions = {}) {
  const directory = sanitizeInlineText(rawOptions.directory || '', 1000);
  return {
    path: { id: sessionID },
    query: directory ? { directory } : undefined,
    body: {
      messageID,
      parts: [{
        type: 'text',
        text: renderContinuationPrompt(goal, rawOptions),
      }],
    },
  };
}

/**
 * Continue an active goal once all autonomy gates pass.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Object} [rawOptions] - Continuation options
 * @returns {Promise<Object>} Decision envelope
 */
async function maybeContinueGoal(sessionID, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const runtimeState = rawOptions.runtimeState || {};
  const normalizedSessionID = normalizeSessionID(sessionID);

  async function decision(decisionType, reason, autoTurnsUsed = 0) {
    await logContinuationDecision(normalizedSessionID, decisionType, reason, autoTurnsUsed, options);
    return {
      decision: decisionType,
      reason,
      autoTurnsUsed: normalizeAutoTurns(autoTurnsUsed),
    };
  }

  if (!options.enabled) return decision('suppressed', 'plugin_disabled');

  const autonomyMode = autonomyModeFromEnv();
  if (!AUTONOMY_ACTIVE_MODES.has(autonomyMode)) {
    return decision('suppressed', disabledAutonomyReason(autonomyMode));
  }

  if (!normalizedSessionID) return decision('suppressed', 'missing_session_id');

  const goal = await readGoal(normalizedSessionID, options);
  const autoTurnsUsed = goal?.autoTurnsUsed || 0;
  if (!goal || goal.status !== 'active') return decision('suppressed', 'goal_not_active', autoTurnsUsed);

  if (goal.continuationSuppressed) {
    return decision('suppressed', goal.continuationSuppressedReason || 'continuation_suppressed', autoTurnsUsed);
  }

  const continuationLocks = runtimeState.inFlightContinuations;
  if (continuationLocks?.has?.(normalizedSessionID)) {
    return decision('suppressed', 'continuation_in_flight', autoTurnsUsed);
  }

  if (goal.blockedByPrompt || runtimeState.blockedByPromptSessions?.has?.(normalizedSessionID)) {
    await recordContinuationReason(normalizedSessionID, goal.goalId, 'permission_or_question_block', options);
    return decision('suppressed', 'permission_or_question_block', autoTurnsUsed);
  }

  const runtimeStatus = continuationRuntimeStatus(runtimeState, normalizedSessionID);
  if (runtimeStatus === 'busy' || runtimeStatus === 'retry') {
    const reason = `session_${runtimeStatus}`;
    await recordContinuationReason(normalizedSessionID, goal.goalId, reason, options);
    return decision('suppressed', reason, autoTurnsUsed);
  }

  const timestamp = nowMs(options);
  if (goal.lastContinuationAtMs > 0 && timestamp - goal.lastContinuationAtMs < DEFAULT_CONTINUATION_COOLDOWN_MS) {
    await recordContinuationReason(normalizedSessionID, goal.goalId, 'cooldown', options);
    return decision('suppressed', 'cooldown', autoTurnsUsed);
  }

  const capReason = continuationCapReason(goal, timestamp);
  if (capReason) {
    await recordContinuationReason(normalizedSessionID, goal.goalId, capReason, options, true);
    return decision('suppressed', capReason, autoTurnsUsed);
  }

  const budgetReason = continuationBudgetReason(goal);
  if (budgetReason) {
    await recordContinuationBudgetStop(normalizedSessionID, goal.goalId, options);
    return decision('suppressed', budgetReason, autoTurnsUsed);
  }

  if (autonomyMode === 'smoke') return decision('would_fire', 'smoke_mode', autoTurnsUsed);

  const promptAsync = rawOptions.client?.session?.promptAsync;
  if (typeof promptAsync !== 'function') {
    await recordContinuationReason(normalizedSessionID, goal.goalId, 'prompt_async_unavailable', options, true);
    return decision('suppressed', 'prompt_async_unavailable', autoTurnsUsed);
  }

  continuationLocks?.add?.(normalizedSessionID);
  const reserved = await reserveContinuationTurn(normalizedSessionID, goal.goalId, options);
  if (!reserved.didReserve) {
    continuationLocks?.delete?.(normalizedSessionID);
    return decision('suppressed', 'auto_turn_cap_reached', reserved.goal?.autoTurnsUsed || autoTurnsUsed);
  }

  try {
    await promptAsync.call(
      rawOptions.client.session,
      buildPromptAsyncOptions(normalizedSessionID, reserved.goal, reserved.messageID, rawOptions),
    );
    return decision('fired', 'prompt_async_sent', reserved.goal.autoTurnsUsed);
  } catch (error) {
    await recordContinuationReason(
      normalizedSessionID,
      reserved.goal.goalId,
      'prompt_async_failed',
      options,
      true,
      error?.message || 'promptAsync failed',
    );
    return decision('suppressed', 'prompt_async_failed', reserved.goal.autoTurnsUsed);
  } finally {
    continuationLocks?.delete?.(normalizedSessionID);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. INJECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render the exact passive goal block used by the system transform.
 *
 * @param {Object|null} goal - Goal record
 * @param {Object} [rawOptions] - Render options
 * @returns {string} Injection block, or empty string when no block should render
 */
function renderGoalInjection(goal, rawOptions = {}) {
  if (!goal || goal.status !== 'active') return EMPTY_INJECTION_PREVIEW;
  const options = normalizeOptions(rawOptions);
  const objective = sanitizeInlineText(goal.objective, options.maxObjectiveChars);
  const reason = sanitizeInlineText(goal.lastVerifierReason || 'none', DEFAULT_MAX_REASON_CHARS) || 'none';
  const tokenBudget = goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : String(goal.tokenBudget);
  const tokensUsed = Number.isFinite(goal.tokensUsed) ? Math.max(0, Math.trunc(goal.tokensUsed)) : 0;
  const timeUsedSeconds = Number.isFinite(goal.timeUsedSeconds) ? Math.max(0, Math.trunc(goal.timeUsedSeconds)) : 0;
  const autoTurnsUsed = Number.isFinite(goal.autoTurnsUsed) ? Math.max(0, Math.trunc(goal.autoTurnsUsed)) : 0;
  const maxAutoTurns = Number.isFinite(goal.maxAutoTurns) ? Math.max(0, Math.trunc(goal.maxAutoTurns)) : DEFAULT_MAX_AUTO_TURNS;
  const verdict = sanitizeInlineText(goal.lastVerifierVerdict || 'not_evaluated', 80) || 'not_evaluated';
  const goalId = sanitizeInlineText(goal.goalId, 160).replace(/\s+/g, '-');
  const block = [
    `[active_goal:${goalId}]`,
    'status: active',
    `objective: ${objective}`,
    `last_check: ${verdict} ; reason: ${reason}`,
    `usage: tokens ${tokensUsed}/${tokenBudget}; time ${timeUsedSeconds}s; iteration ${autoTurnsUsed}/${maxAutoTurns}`,
    'directive: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.',
    '[/active_goal]',
  ].join('\n');

  return clampText(block, options.maxInjectionChars);
}

async function appendGoalBrief(input = {}, output = { system: [] }, rawOptions = {}) {
  try {
    if (!output || typeof output !== 'object') return;
    output.system = Array.isArray(output.system) ? output.system : [];
    const sessionID = sessionIdFromInput(input);
    if (!sessionID) return;
    const goal = await readGoal(sessionID, rawOptions);
    const block = renderGoalInjection(goal, rawOptions);
    if (!block) return;
    const marker = `[active_goal:${goal.goalId}]`;
    if (output.system.some((entry) => typeof entry === 'string' && entry.includes(marker))) return;
    output.system.push(block);
  } catch {
    return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TOOL OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function goalStateLines(action, goal, rawOptions = {}) {
  const injectionPreview = renderGoalInjection(goal, rawOptions);
  if (!goal) {
    return [
      `STATUS=OK ACTION=${action}`,
      'goal_present=false',
      `injection_preview=${JSON.stringify(injectionPreview)}`,
    ].join('\n');
  }

  return [
    `STATUS=OK ACTION=${action}`,
    'goal_present=true',
    `plugin_id=${PLUGIN_ID}`,
    `goal_id=${goal.goalId}`,
    `status=${goal.status}`,
    `objective=${quoteValue(goal.objective)}`,
    `token_budget=${goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : goal.tokenBudget}`,
    `tokens_used=${goal.tokensUsed}`,
    `time_used_seconds=${goal.timeUsedSeconds}`,
    `usage_source=${goal.usageSource || 'unavailable'}`,
    `budget_tokens_used=${goal.tokensUsed}`,
    `budget_token_budget=${goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : goal.tokenBudget}`,
    `budget_usage_source=${goal.usageSource || 'unavailable'}`,
    `created_at_ms=${goal.createdAtMs}`,
    `updated_at_ms=${goal.updatedAtMs}`,
    `last_check=${goal.lastVerifierVerdict || 'not_evaluated'}`,
    `verifier_last_verdict=${goal.lastVerifierVerdict || 'not_evaluated'}`,
    `verifier_last_evidence=${quoteValue(redactEvidence(goal.lastEvidence || '', normalizeOptions(rawOptions).maxEvidenceChars))}`,
    `blocked_by_prompt=${goal.blockedByPrompt === true}`,
    `continuation_suppressed=${goal.continuationSuppressed === true}`,
    `continuation_attempts=${goal.autoTurnsUsed}`,
    `continuation_suppressed_reason=${quoteValue(goal.continuationSuppressedReason || '')}`,
    `injection_preview=${JSON.stringify(injectionPreview)}`,
  ].join('\n');
}

function failureLines(error) {
  const code = error?.code || 'GOAL_ERROR';
  const message = error?.message || 'Goal operation failed';
  return [
    `STATUS=FAIL ERROR=${quoteValue(message)}`,
    `code=${code}`,
  ].join('\n');
}

async function executeGoalAction(args, context, rawOptions = {}) {
  const action = GOAL_ACTIONS.includes(args?.action) ? args.action : 'show';
  const sessionID = sessionIdFromContext(context);

  try {
    if (action === 'set') {
      const goal = await setGoal(sessionID, args?.objective, {
        ...rawOptions,
        tokenBudget: args?.tokenBudget,
      });
      return goalStateLines(action, goal, rawOptions);
    }
    if (action === 'clear') {
      await clearGoal(sessionID, rawOptions);
      return goalStateLines(action, null, rawOptions);
    }
    if (action === 'complete') {
      const goal = await markGoalStatus(sessionID, 'complete', rawOptions);
      return goalStateLines(action, goal, rawOptions);
    }
    if (action === 'pause') {
      const goal = await markGoalStatus(sessionID, 'paused', {
        ...rawOptions,
        reason: args?.reason,
      });
      return goalStateLines(action, goal, rawOptions);
    }
    const goal = await readGoal(sessionID, rawOptions);
    return goalStateLines('show', goal, rawOptions);
  } catch (error) {
    return failureLines(error);
  }
}

async function executeGoalStatus(context, rawOptions = {}) {
  try {
    const sessionID = sessionIdFromContext(context);
    const goal = await readGoal(sessionID, rawOptions);
    return goalStateLines('show', goal, rawOptions);
  } catch (error) {
    return failureLines(error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the Goal OpenCode plugin hooks.
 *
 * @param {import('@opencode-ai/plugin').PluginInput} ctx - OpenCode plugin context
 * @param {Object} [rawOptions] - Plugin options
 * @param {boolean} [rawOptions.enabled] - Whether passive injection is enabled
 * @param {string} [rawOptions.stateDir] - State directory override
 * @param {number} [rawOptions.maxObjectiveChars] - Maximum stored objective characters
 * @param {number} [rawOptions.maxInjectionChars] - Maximum injected block characters
 * @returns {Promise<Object>} Hooks with `experimental.chat.system.transform` and goal tools
 */
export default async function MkGoalPlugin(ctx, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const runtimeState = {
    inFlightVerifications: new Set(),
    inFlightContinuations: new Set(),
    blockedByPromptSessions: new Set(),
    sessionStatuses: new Map(),
  };

  function flushVolatileLocks(sessionID = null) {
    if (sessionID) {
      runtimeState.inFlightVerifications.delete(sessionID);
      runtimeState.inFlightContinuations.delete(sessionID);
      runtimeState.blockedByPromptSessions.delete(sessionID);
      runtimeState.sessionStatuses.delete(sessionID);
      return;
    }
    runtimeState.inFlightVerifications.clear();
    runtimeState.inFlightContinuations.clear();
    runtimeState.blockedByPromptSessions.clear();
    runtimeState.sessionStatuses.clear();
  }

  async function handleEvent(event) {
    const eventType = eventTypeFrom(event);
    const sessionID = extractEventSessionID(event);
    if (!eventType) return;
    await logDebugEvent(eventType, sessionID, options);

    if (eventType === 'session.created') {
      if (sessionID) await restoreActiveGoal(sessionID, options);
      return;
    }

    if (eventType === 'message.updated') {
      if (sessionID) await recordMessageUpdated(sessionID, event, options);
      return;
    }

    if (eventType === 'session.status') {
      const status = extractEventSessionStatus(event);
      if (sessionID && status) runtimeState.sessionStatuses.set(sessionID, status);
      return;
    }

    if (eventType === 'permission.asked' || eventType === 'question.asked') {
      if (sessionID) {
        runtimeState.blockedByPromptSessions.add(sessionID);
        await setBlockedByPrompt(sessionID, true, options);
      }
      return;
    }

    if (eventType === 'permission.replied' || eventType === 'question.replied' || eventType === 'question.rejected') {
      if (sessionID) {
        runtimeState.blockedByPromptSessions.delete(sessionID);
        await setBlockedByPrompt(sessionID, false, options);
      }
      return;
    }

    if (eventType === 'session.idle') {
      if (!sessionID) {
        await maybeContinueGoal(sessionID, {
          ...options,
          client: ctx?.client,
          directory: ctx?.directory,
          runtimeState,
        });
        return;
      }
      runtimeState.sessionStatuses.set(sessionID, 'idle');
      if (runtimeState.inFlightVerifications.has(sessionID)) return;
      runtimeState.inFlightVerifications.add(sessionID);
      try {
        await maybeVerifyGoal(sessionID, options);
      } finally {
        runtimeState.inFlightVerifications.delete(sessionID);
      }
      await maybeContinueGoal(sessionID, {
        ...options,
        client: ctx?.client,
        directory: ctx?.directory,
        runtimeState,
      });
      return;
    }

    if (eventType === 'session.deleted') {
      flushVolatileLocks(sessionID);
      return;
    }

    if (eventType.endsWith('.disposed')) {
      flushVolatileLocks();
    }
  }

  return {
    event: async (input = {}) => {
      try {
        await handleEvent(input.event || input);
      } catch {
        return;
      }
    },

    'experimental.chat.system.transform': async (input, output) => {
      if (!options.enabled) return;
      await appendGoalBrief(input, output, options);
    },

    tool: {
      mk_goal: tool({
        description: 'Set, show, clear, complete, or pause the active session goal',
        args: {
          action: tool.schema.enum(GOAL_ACTIONS),
          objective: tool.schema.string().optional(),
          tokenBudget: tool.schema.number().int().positive().nullable().optional(),
          reason: tool.schema.string().optional(),
        },
        async execute(args, context) {
          return executeGoalAction(args, context, options);
        },
      }),
      mk_goal_status: tool({
        description: 'Show the active session goal and exact injection preview',
        args: {},
        async execute(_args, context) {
          return executeGoalStatus(context, options);
        },
      }),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. TEST SURFACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Expose pure helpers to unit tests without adding sibling plugin files.
 *
 * @type {Object}
 */
const __test = Object.freeze({
  GoalError,
  accountUsage,
  clearGoal,
  ensureGoalStateDir,
  executeGoalAction,
  executeGoalStatus,
  goalPathForSession,
  maybeContinueGoal,
  maybeVerifyGoal,
  readGoal,
  renderGoalInjection,
  setGoal,
  sessionKeyForSession,
  writeGoalAtomic,
});

MkGoalPlugin.__test = __test;
