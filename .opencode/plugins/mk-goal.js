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
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
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
const DEFAULT_MAX_AUTO_TURNS = 8;
const DISABLED_ENV = 'MK_GOAL_PLUGIN_DISABLED';
const VALID_STATUSES = new Set([
  'active',
  'paused',
  'blocked',
  'usage_limited',
  'budget_limited',
  'complete',
]);
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
    nowMs: Number.isFinite(options.nowMs) ? Math.trunc(options.nowMs) : null,
    goalIdFactory: typeof options.goalIdFactory === 'function' ? options.goalIdFactory : null,
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
export async function ensureGoalStateDir(rawOptions = {}) {
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
export function goalPathForSession(sessionID, rawOptions = {}) {
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
    autoTurnsUsed: Number.isFinite(rawGoal.autoTurnsUsed) ? Math.max(0, Math.trunc(rawGoal.autoTurnsUsed)) : 0,
    maxAutoTurns: Number.isFinite(rawGoal.maxAutoTurns) ? Math.max(0, Math.trunc(rawGoal.maxAutoTurns)) : DEFAULT_MAX_AUTO_TURNS,
    iterations: Number.isFinite(rawGoal.iterations) ? Math.max(0, Math.trunc(rawGoal.iterations)) : 0,
    lastVerifierVerdict: sanitizeInlineText(rawGoal.lastVerifierVerdict || 'not_evaluated', 80),
    lastVerifierReason: rawGoal.lastVerifierReason === null || rawGoal.lastVerifierReason === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastVerifierReason, DEFAULT_MAX_REASON_CHARS),
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
export async function readGoal(sessionID, rawOptions = {}) {
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
export async function writeGoalAtomic(goal, rawOptions = {}) {
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
export async function mutateGoal(sessionID, mutator, rawOptions = {}) {
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
    lastContinuationAtMs: 0,
    lastContinuationMessageId: null,
    lastContinuationError: null,
    continuationSuppressedReason: null,
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
export async function setGoal(sessionID, objective, rawOptions = {}) {
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
export async function clearGoal(sessionID, rawOptions = {}) {
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
export function renderGoalInjection(goal, rawOptions = {}) {
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
    `created_at_ms=${goal.createdAtMs}`,
    `updated_at_ms=${goal.updatedAtMs}`,
    `last_check=${goal.lastVerifierVerdict || 'not_evaluated'}`,
    `continuation_suppressed=${goal.continuationSuppressed === true}`,
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
  void ctx;

  return {
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
export const __test = Object.freeze({
  GoalError,
  clearGoal,
  ensureGoalStateDir,
  executeGoalAction,
  executeGoalStatus,
  goalPathForSession,
  readGoal,
  renderGoalInjection,
  setGoal,
  sessionKeyForSession,
  writeGoalAtomic,
});
