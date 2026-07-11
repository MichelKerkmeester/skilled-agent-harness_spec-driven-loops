// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Goal OpenCode Plugin (mk-goal)                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Persist session goals and inject passive goal steering.         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { randomUUID } from 'node:crypto';
import { appendFile, mkdir, open, readFile, readdir, rename, stat, unlink } from 'node:fs/promises';
import { join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin/tool';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'mk-goal';
const DEFAULT_STATE_DIR = fileURLToPath(new URL('../skills/.goal-state/', import.meta.url));
const DEFAULT_MAX_OBJECTIVE_CHARS = 4000;
const DEFAULT_MAX_GOAL_PROMPT_CHARS = 4000;
const DEFAULT_MAX_INJECTION_CHARS = 4800;
const DEFAULT_MAX_REASON_CHARS = 280;
const DEFAULT_MAX_EVIDENCE_CHARS = 1200;
const DEFAULT_MAX_AUTO_TURNS = 8;
const DEFAULT_CONTINUATION_COOLDOWN_MS = 1500;
const DEFAULT_MAX_WALL_MS = 30 * 60 * 1000;
const DEFAULT_ARCHIVE_RETENTION_DAYS = 90;
const DEFAULT_ACTIVE_RETENTION_DAYS = 2;
const DEFAULT_SWEEP_INTERVAL_MS = 60 * 60 * 1000;
const DEFAULT_VERIFIER_TIMEOUT_MS = 30 * 1000;
const DEFAULT_CONTINUATION_TIMEOUT_MS = 30 * 1000;
const DEFAULT_JSONL_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_GOAL_BRIEF_CACHE_ENTRIES = 512;
const GOAL_ID_MAX_CHARS = 160;
const PROMPT_OVERHEAD_CHARS = 1900;
const OBJECTIVE_PREVIEW_RATIO = 0.12;
const OBJECTIVE_PREVIEW_MIN_CHARS = 60;
const OBJECTIVE_PREVIEW_MAX_CHARS = 600;
const MIN_PROMPT_BUDGET_CHARS = 3;
const NORMALIZED_OPTIONS_MARKER = Symbol('mkGoalNormalizedOptions');
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DISABLED_ENV = 'MK_GOAL_PLUGIN_DISABLED';
const AUTONOMY_ENV = 'MK_GOAL_AUTONOMY';
const DEBUG_ENV = 'MK_GOAL_DEBUG';
const VERIFIER_ENV = 'MK_GOAL_VERIFIER';
const DEFAULT_VERIFIER_MODE = 'heuristic';
const ARCHIVE_RETENTION_DAYS_ENV = 'MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS';
const ACTIVE_RETENTION_DAYS_ENV = 'MK_GOAL_STATE_ACTIVE_RETENTION_DAYS';
const SWEEP_INTERVAL_MS_ENV = 'MK_GOAL_STATE_SWEEP_INTERVAL_MS';
const MAX_AUTO_TURNS_ENV = 'MK_GOAL_MAX_AUTO_TURNS';
const MAX_WALL_MS_ENV = 'MK_GOAL_MAX_WALL_MS';
const VERIFIER_TIMEOUT_MS_ENV = 'MK_GOAL_VERIFIER_TIMEOUT_MS';
const CONTINUATION_TIMEOUT_MS_ENV = 'MK_GOAL_CONTINUATION_TIMEOUT_MS';
const JSONL_MAX_BYTES_ENV = 'MK_GOAL_JSONL_MAX_BYTES';
const CONTINUATION_LOG_FILENAME = '.continuation.log';
const GOAL_EVENTS_LOG_FILENAME = '.goal-events.log';
const OWNED_JSONL_LOGS = new Set([CONTINUATION_LOG_FILENAME, GOAL_EVENTS_LOG_FILENAME]);
const QUIET_CONTINUATION_REASONS = new Set(['plugin_disabled', 'autonomy_disabled', 'autonomy_passive']);
const ROLE_HOMOGLYPHS = Object.freeze({
  а: 'a',
  е: 'e',
  і: 'i',
  о: 'o',
  р: 'p',
  с: 'c',
  ѕ: 's',
  у: 'y',
  Α: 'A',
  Β: 'B',
  Ε: 'E',
  Ζ: 'Z',
  Η: 'H',
  Ι: 'I',
  Κ: 'K',
  Μ: 'M',
  Ν: 'N',
  Ο: 'O',
  Ρ: 'P',
  Τ: 'T',
  Χ: 'X',
  α: 'a',
  β: 'b',
  ε: 'e',
  η: 'n',
  ι: 'i',
  κ: 'k',
  ο: 'o',
  ρ: 'p',
  τ: 't',
  χ: 'x',
});
const PROMPT_ENHANCEMENT_VERSION = 'sk-prompt-goal-v1';
const PROMPT_ENHANCEMENT_FRAMEWORK = 'CRAFT+TIDD-EC';
const PROMPT_ENHANCEMENT_METHODOLOGY = 'DEPTH';
const PROMPT_ENHANCEMENT_MODE = 'standard';
const PROMPT_ENHANCEMENT_RICCE = Object.freeze({
  name: 'RICCE',
  structure: ['Role', 'Objective', 'Context', 'Method', 'Success Criteria', 'Stop Conditions'],
});
const PROMPT_ENHANCEMENT_PERSPECTIVES = [
  'prompt_engineering',
  'ai_interpretation',
  'user_clarity',
  'framework_fit',
  'token_efficiency',
];
const AUTONOMY_ACTIVE_MODES = new Set(['active', 'smoke']);
const VALID_VERIFIER_MODES = new Set(['heuristic', 'llm']);
const VERIFIER_BLOCKING_PATTERN = /\b(blocked?|blocker|error|failed|failing|failure|cannot|can't|unable|todo|not yet|partial(?:ly)?|still need(?:s)?|incomplete|not complete|not done|waiting|pending)\b/i;
const VERIFIER_COMPLETION_PATTERN = /\b(done|completed?|finished|implemented|fixed|resolved|delivered|shipped|verified|validated|tests? passed|checks? passed|passing)\b/i;
const VERIFIER_STOPWORDS = new Set([
  'about',
  'after',
  'against',
  'before',
  'build',
  'change',
  'complete',
  'create',
  'done',
  'execute',
  'finish',
  'fix',
  'from',
  'goal',
  'implement',
  'into',
  'make',
  'mission',
  'phase',
  'that',
  'this',
  'update',
  'with',
  'work',
]);
const VALID_STATUSES = new Set([
  'active',
  'paused',
  'blocked',
  'usage_limited',
  'budget_limited',
  'complete',
]);
const STATUS_TRANSITIONS = Object.freeze({
  active: new Set(['active', 'paused', 'complete']),
  paused: new Set(['active', 'paused', 'complete']),
  blocked: new Set(['blocked', 'complete']),
  usage_limited: new Set(['active', 'usage_limited', 'complete']),
  budget_limited: new Set(['active', 'budget_limited', 'complete']),
  complete: new Set(['complete']),
});
const VALID_VERIFIER_VERDICTS = new Set(['met', 'not_met', 'blocked']);
const EMPTY_INJECTION_PREVIEW = '';
const GOAL_ACTIONS = ['set', 'show', 'clear', 'complete', 'pause', 'history', 'resume', 'doctor', 'health'];
const mutationQueues = new Map();
const jsonlAppendQueues = new Map();
const knownStateDirs = new Set();
const goalBriefCache = new Map();
const lastArchivePruneAtMs = new Map();

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

function normalizeMaxGoalPromptChars(value, fallback = DEFAULT_MAX_GOAL_PROMPT_CHARS) {
  return Math.min(DEFAULT_MAX_GOAL_PROMPT_CHARS, normalizePositiveInt(value, fallback));
}

function countMetric(rawOptions, name, amount = 1) {
  const metrics = rawOptions?.metrics;
  if (!metrics || typeof metrics !== 'object') return;
  metrics[name] = (metrics[name] || 0) + amount;
}

function markNormalizedOptions(options) {
  Object.defineProperty(options, NORMALIZED_OPTIONS_MARKER, {
    value: true,
    enumerable: false,
  });
  return options;
}

function normalizeVerifierMode(value) {
  const mode = sanitizeInlineText(value || DEFAULT_VERIFIER_MODE, 40).toLowerCase();
  return VALID_VERIFIER_MODES.has(mode) ? mode : DEFAULT_VERIFIER_MODE;
}

function defaultSupervisorVerifierForMode(mode, normalizedOptions) {
  if (mode === 'llm') return (input) => defaultLlmSupervisorVerifier(input, normalizedOptions);
  return (input) => defaultHeuristicSupervisorVerifier(input);
}

function normalizeOptions(rawOptions = {}) {
  if (rawOptions?.[NORMALIZED_OPTIONS_MARKER]) return rawOptions;
  countMetric(rawOptions, 'normalizeOptions');
  const envMaxObjectiveChars = Number(process.env.MK_GOAL_MAX_OBJECTIVE_CHARS);
  const envMaxGoalPromptChars = Number(process.env.MK_GOAL_MAX_GOAL_PROMPT_CHARS);
  const envMaxInjectionChars = Number(process.env.MK_GOAL_MAX_INJECTION_CHARS);
  const envMaxEvidenceChars = Number(process.env.MK_GOAL_MAX_EVIDENCE_CHARS);
  const envMaxAutoTurns = Number(process.env[MAX_AUTO_TURNS_ENV]);
  const envMaxWallMs = Number(process.env[MAX_WALL_MS_ENV]);
  const envVerifierTimeoutMs = Number(process.env[VERIFIER_TIMEOUT_MS_ENV]);
  const envContinuationTimeoutMs = Number(process.env[CONTINUATION_TIMEOUT_MS_ENV]);
  const envJsonlMaxBytes = Number(process.env[JSONL_MAX_BYTES_ENV]);
  const options = rawOptions && typeof rawOptions === 'object' ? rawOptions : {};
  const verifierMode = normalizeVerifierMode(options.verifierMode || process.env[VERIFIER_ENV]);
  const injectedSupervisorVerifier = typeof options.supervisorVerifier === 'function' ? options.supervisorVerifier : null;

  const normalized = {
    enabled: options.enabled !== false && process.env[DISABLED_ENV] !== '1',
    stateDir: resolvePath(typeof options.stateDir === 'string' && options.stateDir.trim()
      ? options.stateDir.trim()
      : DEFAULT_STATE_DIR),
    metrics: options.metrics && typeof options.metrics === 'object' ? options.metrics : null,
    maxObjectiveChars: normalizePositiveInt(
      options.maxObjectiveChars,
      normalizePositiveInt(envMaxObjectiveChars, DEFAULT_MAX_OBJECTIVE_CHARS),
    ),
    maxGoalPromptChars: normalizeMaxGoalPromptChars(
      options.maxGoalPromptChars,
      normalizeMaxGoalPromptChars(envMaxGoalPromptChars, DEFAULT_MAX_GOAL_PROMPT_CHARS),
    ),
    maxInjectionChars: normalizePositiveInt(
      options.maxInjectionChars,
      normalizePositiveInt(envMaxInjectionChars, DEFAULT_MAX_INJECTION_CHARS),
    ),
    maxEvidenceChars: normalizePositiveInt(
      options.maxEvidenceChars,
      normalizePositiveInt(envMaxEvidenceChars, DEFAULT_MAX_EVIDENCE_CHARS),
    ),
    maxAutoTurns: normalizePositiveInt(
      options.maxAutoTurns,
      normalizePositiveInt(envMaxAutoTurns, DEFAULT_MAX_AUTO_TURNS),
    ),
    maxWallMs: normalizePositiveInt(
      options.maxWallMs,
      normalizePositiveInt(envMaxWallMs, DEFAULT_MAX_WALL_MS),
    ),
    verifierTimeoutMs: normalizePositiveInt(
      options.verifierTimeoutMs,
      normalizePositiveInt(envVerifierTimeoutMs, DEFAULT_VERIFIER_TIMEOUT_MS),
    ),
    continuationTimeoutMs: normalizePositiveInt(
      options.continuationTimeoutMs,
      normalizePositiveInt(envContinuationTimeoutMs, DEFAULT_CONTINUATION_TIMEOUT_MS),
    ),
    jsonlMaxBytes: normalizePositiveInt(
      options.jsonlMaxBytes,
      normalizePositiveInt(envJsonlMaxBytes, DEFAULT_JSONL_MAX_BYTES),
    ),
    nowMs: Number.isFinite(options.nowMs) ? Math.trunc(options.nowMs) : null,
    goalIdFactory: typeof options.goalIdFactory === 'function' ? options.goalIdFactory : null,
    client: options.client && typeof options.client === 'object' ? options.client : null,
    directory: typeof options.directory === 'string' ? options.directory.trim() : '',
    verifierMode,
    supervisorVerifier: injectedSupervisorVerifier,
    supervisorVerifierSource: injectedSupervisorVerifier ? 'injected' : `default-${verifierMode}`,
  };
  normalized.supervisorVerifier ||= defaultSupervisorVerifierForMode(verifierMode, normalized);
  return markNormalizedOptions(normalized);
}

function nowMs(options = {}) {
  return Number.isFinite(options.nowMs) ? Math.trunc(options.nowMs) : Date.now();
}

async function withDeadline(operation, timeoutMs, code, message) {
  const controller = new AbortController();
  let timer = null;
  const operationPromise = Promise.resolve().then(() => operation(controller.signal));
  operationPromise.catch(() => { });
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new GoalError(code, message));
    }, timeoutMs);
  });
  try {
    return await Promise.race([operationPromise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function retentionNowMs(rawOptions = {}) {
  return nowMs(rawOptions);
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
  const limit = Number.isFinite(maxChars) ? Math.max(0, Math.trunc(maxChars)) : text.length;
  if (text.length <= limit) return text;
  if (limit <= 0) return '';
  if (limit <= 3) return '.'.repeat(limit);
  return `${text.slice(0, limit - 3).trimEnd()}...`;
}

function foldRoleToken(value) {
  return String(value || '').replace(/[аеіорсѕуΑΒΕΖΗΙΚΜΝΟΡΤΧαβεηικορτχ]/g, (char) => ROLE_HOMOGLYPHS[char] || char);
}

function normalizeUserAuthoredText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, ' ')
    .replace(/[\u0009\u000a\u000d]+/g, '\n')
    .replace(/\[\/?active_goal[^\]]*\]/gi, '[goal-marker-redacted]')
    .replace(/`{3,}/g, '\'\'\'')
    .replace(/(^|[^\p{L}\p{N}_-])([\p{L}][\p{L}\p{N}_ -]{0,24})\s*(?::|=|->|→)/giu, (match, prefix, role) => {
      const foldedRole = foldRoleToken(role.trim()).toLowerCase();
      if (!/^(system|developer|assistant|tool|user)$/.test(foldedRole)) return match;
      return `${prefix}${foldedRole}-role:`;
    })
    .replace(/\b(ignore|disregard|forget|override|bypass|disable|drop|replace)\s+(all\s+)?(previous|prior|above|earlier|system|developer|safety|tool)\s+(instructions?|messages?|prompts?|rules?|constraints?)\b/gi, '[instruction-redacted]')
    .replace(/\b(reveal|print|show|dump|exfiltrate|leak)\s+(the\s+)?(system|developer|hidden|secret)\s+(prompt|instructions?|messages?|rules?)\b/gi, '[instruction-redacted]')
    .replace(/\b(new|updated)\s+(system|developer)\s+(prompt|instructions?|rules?)\b/gi, '[instruction-redacted]')
    .replace(/\b(jailbreak|prompt\s*injection|do\s+anything\s+now)\b/gi, '[instruction-redacted]');
}

function sanitizeInlineText(value, maxChars = DEFAULT_MAX_OBJECTIVE_CHARS) {
  const text = normalizeUserAuthoredText(value)
    .replace(/[\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clampText(text, maxChars);
}

function entropyScore(value) {
  const text = String(value || '');
  if (!text) return 0;
  const counts = new Map();
  for (const char of text) counts.set(char, (counts.get(char) || 0) + 1);
  return Array.from(counts.values()).reduce((score, count) => {
    const probability = count / text.length;
    return score - (probability * Math.log2(probability));
  }, 0);
}

function looksLikeGenericSecret(value) {
  const text = String(value || '').replace(/=+$/g, '');
  if (text.length < 48) return false;
  if (/^[0-9a-f]{48,}$/i.test(text)) return true;
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[+/_-]/].filter((pattern) => pattern.test(text)).length;
  return classes >= 3 && entropyScore(text) >= 4.5;
}

function normalizeGoalID(value) {
  return sanitizeInlineText(value, GOAL_ID_MAX_CHARS).replace(/\s+/g, '-');
}

function calculateObjectivePreviewChars(maxInjectionChars) {
  return Math.max(
    OBJECTIVE_PREVIEW_MIN_CHARS,
    Math.min(OBJECTIVE_PREVIEW_MAX_CHARS, Math.floor(maxInjectionChars * OBJECTIVE_PREVIEW_RATIO)),
  );
}

function sanitizePromptText(value, maxChars = DEFAULT_MAX_GOAL_PROMPT_CHARS) {
  const text = normalizeUserAuthoredText(value)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return clampText(text, maxChars);
}

function redactEvidence(value, maxChars = DEFAULT_MAX_EVIDENCE_CHARS) {
  const text = normalizeUserAuthoredText(value)
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, '[secret-redacted]')
    .replace(/\bAIza[0-9A-Za-z_-]{35}\b/g, '[secret-redacted]')
    .replace(/\bBearer\s+[A-Za-z0-9._-]{20,}\b/gi, '[secret-redacted]')
    .replace(/\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[secret-redacted]')
    .replace(/\b(sk-[A-Za-z0-9_-]{8,})\b/g, '[secret-redacted]')
    .replace(/\b(gh[pousr]_[A-Za-z0-9_]{12,})\b/g, '[secret-redacted]')
    .replace(/\b(xox[baprs]-[A-Za-z0-9-]{12,})\b/g, '[secret-redacted]')
    .replace(/\b(AKIA[0-9A-Z]{12,})\b/g, '[secret-redacted]')
    .replace(/\b[A-Za-z0-9+/_=-]{48,}\b/g, (match) => (looksLikeGenericSecret(match) ? '[secret-redacted]' : match))
    .replace(/\b(api[_-]?key|token|password|secret)\s*[:=]\s*['"]?[^'"\s,;]+/gi, '$1=[secret-redacted]');
  return sanitizeInlineText(text, maxChars);
}

function scoreEnhancedGoalPrompt(goalPrompt, rawOptions = {}) {
  countMetric(rawOptions, 'scoreEnhancedGoalPrompt');
  const prompt = String(goalPrompt || '');
  const hasRole = /(^|\n)Role:/i.test(prompt);
  const hasObjective = /(^|\n)Objective:/i.test(prompt);
  const hasMethod = /(^|\n)Method:/i.test(prompt);
  const hasSuccess = /(^|\n)Success Criteria:/i.test(prompt);
  const hasStop = /(^|\n)Stop Conditions:/i.test(prompt);
  const hasNoPlaceholders = !/\[[A-Z_ ]+\]|TODO|TBD|placeholder/i.test(prompt);
  const safeLength = prompt.length > 120 && prompt.length <= DEFAULT_MAX_GOAL_PROMPT_CHARS;

  const correctness = hasObjective && hasNoPlaceholders ? 9 : 7;
  const logic = hasMethod && hasStop ? 9 : 7;
  const expression = safeLength && hasNoPlaceholders ? 13 : 10;
  const arrangement = [hasRole, hasObjective, hasMethod, hasSuccess, hasStop].filter(Boolean).length >= 5 ? 9 : 7;
  const reusability = 4;

  return {
    total: correctness + logic + expression + arrangement + reusability,
    breakdown: {
      correctness,
      logic,
      expression,
      arrangement,
      reusability,
    },
  };
}

function goalFocusHints(objective) {
  const text = String(objective || '').toLowerCase();
  const hints = [];
  if (/\b(fix|bug|error|fail|failing|broken|regression|debug)\b/.test(text)) {
    hints.push('Find the root cause before changing code; verify the fix against the failing symptom.');
  }
  if (/\b(implement|build|add|create|upgrade|refactor|change|modify|patch)\b/.test(text)) {
    hints.push('Make the smallest correct implementation that satisfies the requested behavior.');
  }
  if (/\b(test|tests|verify|validation|lint|green|pass)\b/.test(text)) {
    hints.push('Run the relevant verification commands and report exact pass/fail evidence.');
  }
  if (/\b(review|audit|inspect|analy[sz]e|research)\b/.test(text)) {
    hints.push('Ground conclusions in concrete files, outputs, or cited evidence.');
  }
  if (hints.length === 0) {
    hints.push('Clarify the concrete completion condition from available context, then execute until it is met or blocked.');
  }
  return hints;
}

function buildEnhancedGoalPrompt(objective, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const rawObjective = sanitizeInlineText(objective, options.maxObjectiveChars);
  const objectiveBudget = Math.max(240, Math.min(1200, options.maxGoalPromptChars - PROMPT_OVERHEAD_CHARS));
  const objectiveSummary = clampText(rawObjective, objectiveBudget);
  const hints = goalFocusHints(rawObjective);
  const prompt = sanitizePromptText([
    'Role: Focused OpenCode execution agent operating under the active session goal.',
    `Objective: ${objectiveSummary}`,
    'Context: Use the current conversation, repository files, tests, and active spec constraints as source of truth. Preserve unrelated worktree changes and do not broaden scope.',
    'Method:',
    '- Restate the concrete completion condition from available evidence before acting.',
    ...hints.map((hint) => `- ${hint}`),
    '- Prefer direct, reversible changes; ask only when blocked by missing information, permissions, or contradictory requirements.',
    'Success Criteria:',
    '- The requested outcome is materially complete, not merely analyzed or partially prepared.',
    '- Required verification has run, or any inability to run it is reported with the exact blocker.',
    '- Status output distinguishes confirmed evidence from inference.',
    'Stop Conditions:',
    '- Stop only when the goal verifier can mark the goal met, when the user changes or clears the goal, or when progress is blocked by a decision the user must make.',
    '- If blocked, preserve state and name the next safe action.',
  ].join('\n'), options.maxGoalPromptChars);
  const score = scoreEnhancedGoalPrompt(prompt, options);

  return {
    goalPrompt: prompt,
    promptEnhancement: {
      version: PROMPT_ENHANCEMENT_VERSION,
      methodology: PROMPT_ENHANCEMENT_METHODOLOGY,
      mode: PROMPT_ENHANCEMENT_MODE,
      framework: PROMPT_ENHANCEMENT_FRAMEWORK,
      ricce: PROMPT_ENHANCEMENT_RICCE,
      perspectives: PROMPT_ENHANCEMENT_PERSPECTIVES,
      clearScore: score.total,
      clearBreakdown: score.breakdown,
      maxChars: options.maxGoalPromptChars,
      charCount: prompt.length,
    },
  };
}

function hasUsableStoredPromptEnhancement(rawEnhancement, goalPrompt, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const raw = rawEnhancement && typeof rawEnhancement === 'object' ? rawEnhancement : null;
  if (!raw) return false;
  if (!sanitizeInlineText(raw.version || '', 80)) return false;
  if (!sanitizeInlineText(raw.methodology || '', 80)) return false;
  if (!sanitizeInlineText(raw.mode || '', 80)) return false;
  if (!sanitizeInlineText(raw.framework || '', 80)) return false;
  if (!Number.isFinite(raw.clearScore)) return false;
  if (!raw.clearBreakdown || typeof raw.clearBreakdown !== 'object') return false;
  const breakdownKeys = ['correctness', 'logic', 'expression', 'arrangement', 'reusability'];
  if (!breakdownKeys.every((key) => Number.isFinite(raw.clearBreakdown[key]))) return false;
  if (!Number.isFinite(raw.charCount) || Math.trunc(raw.charCount) !== goalPrompt.length) return false;
  if (!Number.isFinite(raw.maxChars) || Math.trunc(raw.maxChars) !== options.maxGoalPromptChars) return false;
  return true;
}

function normalizeStoredPromptEnhancement(rawEnhancement, goalPrompt, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const raw = rawEnhancement && typeof rawEnhancement === 'object' ? rawEnhancement : {};
  return {
    version: sanitizeInlineText(raw.version || PROMPT_ENHANCEMENT_VERSION, 80),
    methodology: sanitizeInlineText(raw.methodology || PROMPT_ENHANCEMENT_METHODOLOGY, 80),
    mode: sanitizeInlineText(raw.mode || PROMPT_ENHANCEMENT_MODE, 80),
    framework: sanitizeInlineText(raw.framework || PROMPT_ENHANCEMENT_FRAMEWORK, 80),
    ricce: PROMPT_ENHANCEMENT_RICCE,
    perspectives: Array.isArray(raw.perspectives) && raw.perspectives.length > 0
      ? raw.perspectives.map((entry) => sanitizeInlineText(entry, 80)).filter(Boolean).slice(0, 8)
      : PROMPT_ENHANCEMENT_PERSPECTIVES,
    clearScore: Math.trunc(raw.clearScore),
    clearBreakdown: {
      correctness: Math.trunc(raw.clearBreakdown.correctness),
      logic: Math.trunc(raw.clearBreakdown.logic),
      expression: Math.trunc(raw.clearBreakdown.expression),
      arrangement: Math.trunc(raw.clearBreakdown.arrangement),
      reusability: Math.trunc(raw.clearBreakdown.reusability),
    },
    maxChars: options.maxGoalPromptChars,
    charCount: goalPrompt.length,
  };
}

function normalizePromptEnhancement(rawEnhancement, goalPrompt, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const raw = rawEnhancement && typeof rawEnhancement === 'object' ? rawEnhancement : {};
  const score = scoreEnhancedGoalPrompt(goalPrompt, options);
  return {
    version: sanitizeInlineText(raw.version || PROMPT_ENHANCEMENT_VERSION, 80),
    methodology: sanitizeInlineText(raw.methodology || PROMPT_ENHANCEMENT_METHODOLOGY, 80),
    mode: sanitizeInlineText(raw.mode || PROMPT_ENHANCEMENT_MODE, 80),
    framework: sanitizeInlineText(raw.framework || PROMPT_ENHANCEMENT_FRAMEWORK, 80),
    ricce: PROMPT_ENHANCEMENT_RICCE,
    perspectives: Array.isArray(raw.perspectives) && raw.perspectives.length > 0
      ? raw.perspectives.map((entry) => sanitizeInlineText(entry, 80)).filter(Boolean).slice(0, 8)
      : PROMPT_ENHANCEMENT_PERSPECTIVES,
    clearScore: score.total,
    clearBreakdown: score.breakdown,
    maxChars: options.maxGoalPromptChars,
    charCount: goalPrompt.length,
  };
}

function normalizeGoalPromptFields(rawGoal, objective, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const storedPrompt = sanitizePromptText(rawGoal?.goalPrompt || '', options.maxGoalPromptChars);
  if (storedPrompt && hasUsableStoredPromptEnhancement(rawGoal?.promptEnhancement, storedPrompt, options)) {
    return {
      goalPrompt: storedPrompt,
      promptEnhancement: normalizeStoredPromptEnhancement(rawGoal.promptEnhancement, storedPrompt, options),
    };
  }
  const fallback = buildEnhancedGoalPrompt(objective, options);
  const goalPrompt = storedPrompt || fallback.goalPrompt;
  return {
    goalPrompt,
    promptEnhancement: normalizePromptEnhancement(rawGoal?.promptEnhancement || fallback.promptEnhancement, goalPrompt, options),
  };
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
  const normalized = normalizeGoalID(candidate || `goal-${randomUUID()}`);
  if (!normalized) return `goal-${randomUUID()}`;
  return normalized;
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
  const eventType = eventTypeFrom(payload);
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
    || ((eventType === 'session.created' || eventType === 'session.deleted') ? properties.info?.id : null)
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
  return normalizeGoalID(
    payload?.goalID
    || payload?.goalId
    || properties.goalID
    || properties.goalId
    || properties.info?.goalID
    || properties.info?.goalId
    || null,
  );
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

function normalizeAutoTurns(value, maxAutoTurns = DEFAULT_MAX_AUTO_TURNS) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(maxAutoTurns, Math.trunc(value)));
}

function normalizeDeadlineMs(value) {
  if (!Number.isFinite(value)) return null;
  const timestamp = Math.trunc(value);
  return timestamp > 0 ? timestamp : null;
}

function normalizeAccountedMessageUsage(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .map(([key, entry]) => [sanitizeInlineText(key, GOAL_ID_MAX_CHARS), Number(entry)])
    .filter(([key, entry]) => key && Number.isFinite(entry) && entry > 0)
    .map(([key, entry]) => [key, Math.trunc(entry)]));
}

function rememberAccountedMessage(accountedMessageUsage, messageID, tokenTotal) {
  const next = { ...normalizeAccountedMessageUsage(accountedMessageUsage) };
  delete next[messageID];
  next[messageID] = Math.trunc(tokenTotal);
  return next;
}

async function appendGoalJsonl(filename, payload, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  try {
    const stateDir = await ensureGoalStateDir(options);
    const timestamp = isoFromMs(nowMs(options));
    const entry = {
      ts: timestamp,
      goalId: payload?.goalId === undefined ? null : payload.goalId,
      ...payload,
    };
    const line = `${JSON.stringify(entry)}\n`;
    const path = join(stateDir, filename);
    const previous = jsonlAppendQueues.get(path) || Promise.resolve();
    const run = previous.catch(() => undefined).then(async () => {
      await pruneJsonlLog(filename, stateDir, options);
      await rotateJsonlLog(filename, stateDir, Buffer.byteLength(line), options);
      await appendFile(path, line, 'utf8');
    });
    jsonlAppendQueues.set(path, run);
    try {
      await run;
    } finally {
      if (jsonlAppendQueues.get(path) === run) jsonlAppendQueues.delete(path);
    }
  } catch (error) {
    writeDebugStderr('appendGoalJsonl', error);
    return;
  }
}

async function rotateJsonlLog(filename, stateDir, incomingBytes, rawOptions = {}) {
  if (!OWNED_JSONL_LOGS.has(filename)) return;
  const options = normalizeOptions(rawOptions);
  const path = join(stateDir, filename);
  try {
    const fileStats = await stat(path);
    if (fileStats.size + incomingBytes <= options.jsonlMaxBytes) return;
    const segmentPath = `${path}.${nowMs(options)}-${randomUUID()}`;
    await rename(path, segmentPath);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function writeDebugStderr(source, error) {
  if (!process.env[DEBUG_ENV]) return;
  try {
    const message = redactEvidence(error?.message || 'unknown error', DEFAULT_MAX_REASON_CHARS);
    process.stderr.write(`[mk-goal] ${source}: ${message}\n`);
  } catch {
    return;
  }
}

async function pruneJsonlLog(filename, stateDir, rawOptions = {}) {
  if (!OWNED_JSONL_LOGS.has(filename)) return;
  try {
    const retentionMs = retentionDaysFromEnv(ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;
    const timestamp = retentionNowMs(rawOptions);
    const path = join(stateDir, filename);
    try {
      const fileStats = await stat(path);
      if (timestamp - fileStats.mtimeMs > retentionMs) await unlink(path);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
    const entries = await readdir(stateDir, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      if (!entry.isFile() || !entry.name.startsWith(`${filename}.`)) return;
      const segmentPath = join(stateDir, entry.name);
      const segmentStats = await stat(segmentPath);
      if (timestamp - segmentStats.mtimeMs > retentionMs) await unlink(segmentPath);
    }));
  } catch {
    return;
  }
}

async function logContinuationDecision(sessionID, decision, reason, autoTurnsUsed, rawOptions = {}, goalId = null) {
  if (QUIET_CONTINUATION_REASONS.has(reason)) return;
  await appendGoalJsonl(CONTINUATION_LOG_FILENAME, {
    sid: sessionID || null,
    goalId: goalId || null,
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
    goalId: null,
  }, rawOptions);
}

async function logDebugEventError(event, error, rawOptions = {}) {
  await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {
    type: 'event_error',
    eventType: sanitizeInlineText(eventTypeFrom(event) || 'unknown', 80),
    sid: extractEventSessionID(event),
    goalId: extractEventGoalID(event) || null,
    error: redactEvidence(error?.message || 'unknown error', DEFAULT_MAX_REASON_CHARS),
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
  const hasNativeFields = ['input', 'output', 'reasoning'].some((key) => Object.hasOwn(usage, key))
    || (usage.cache && typeof usage.cache === 'object');
  if (hasNativeFields) {
    return (numericField(usage, ['input']) || 0)
      + (numericField(usage, ['output']) || 0)
      + (numericField(usage, ['reasoning']) || 0)
      + (numericField(usage.cache, ['read']) || 0)
      + (numericField(usage.cache, ['write']) || 0);
  }
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
  const nativeUsage = usage === properties.info?.tokens;
  const source = sanitizeInlineText(
    usage?.source || usage?.usageSource || (nativeUsage ? 'opencode-native-tokens' : tokenDelta > 0 ? 'message.updated' : 'unavailable'),
    80,
  );
  return {
    tokenDelta,
    timeDeltaSeconds,
    usageSource: source || 'unavailable',
  };
}

function extractErrorFromEvent(event) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  return [
    payload?.error,
    payload?.message?.error,
    properties.error,
    properties.info?.error,
    properties.message?.error,
    properties.part?.error,
  ].find((candidate) => candidate && typeof candidate === 'object') || null;
}

function firstValue(source, keys) {
  if (!source || typeof source !== 'object') return undefined;
  for (const key of keys) {
    if (source[key] !== undefined) return source[key];
  }
  return undefined;
}

function statusCodeFromError(error) {
  const candidates = [
    error?.statusCode,
    error?.status,
    error?.code,
    error?.data?.statusCode,
    error?.data?.status,
    error?.response?.statusCode,
    error?.response?.status,
  ];
  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric)) return Math.trunc(numeric);
  }
  return null;
}

function errorMessageText(error) {
  return [
    error?.message,
    error?.data?.message,
    error?.data?.error,
    error?.body?.message,
    error?.response?.message,
  ].map((entry) => (entry === null || entry === undefined ? '' : String(entry))).filter(Boolean).join(' ');
}

function isProviderUsageLimit(error) {
  if (!error || typeof error !== 'object') return false;
  if (statusCodeFromError(error) === 429) return true;
  return /\b(?:rate\s*limit(?:ed)?|too many requests|usage[_ -]?limit(?:ed)?|insufficient quota|quota (?:exceeded|limit|reached))\b/i.test(errorMessageText(error));
}

function retryAfterDeadlineFromValue(value, unit, rawOptions = {}) {
  if (value === null || value === undefined || value === '') return null;
  const timestamp = nowMs(rawOptions);
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    const normalizedUnit = sanitizeInlineText(unit || '', 20).toLowerCase();
    if (unit === 'ms') return Math.trunc(timestamp + numeric);
    if (normalizedUnit === 'ms' || normalizedUnit === 'millisecond' || normalizedUnit === 'milliseconds') {
      return Math.trunc(timestamp + numeric);
    }
    if (normalizedUnit === 's' || normalizedUnit === 'sec' || normalizedUnit === 'second' || normalizedUnit === 'seconds') {
      return Math.trunc(timestamp + (numeric * 1000));
    }
    if (numeric > 1000000000000) return Math.trunc(numeric);
    return Math.trunc(timestamp + (numeric * 1000));
  }
  const dateMs = Date.parse(String(value));
  return Number.isFinite(dateMs) && dateMs > timestamp ? Math.trunc(dateMs) : null;
}

function providerRetryAfterDeadlineMs(error, rawOptions = {}) {
  const headerRetryAfter = firstValue(error?.headers, ['retry-after', 'Retry-After'])
    ?? firstValue(error?.data?.headers, ['retry-after', 'Retry-After'])
    ?? firstValue(error?.response?.headers, ['retry-after', 'Retry-After']);
  const candidates = [
    [error?.retryAfterMs, 'ms'],
    [error?.data?.retryAfterMs, 'ms'],
    [error?.retryAfter, 'seconds'],
    [error?.retry_after, 'seconds'],
    [error?.data?.retryAfter, 'seconds'],
    [error?.data?.retry_after, 'seconds'],
    [headerRetryAfter, 'seconds'],
  ];
  for (const [value, unit] of candidates) {
    const deadline = retryAfterDeadlineFromValue(value, unit, rawOptions);
    if (deadline !== null) return deadline;
  }
  return null;
}

function providerUsageLimitPatch(error, rawOptions = {}) {
  return {
    status: 'usage_limited',
    continuationSuppressed: true,
    continuationSuppressedReason: 'usage_limited',
    providerRetryAfterMs: providerRetryAfterDeadlineMs(error, rawOptions),
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

function extractAssistantTextPartEvidence(event, rawOptions = {}) {
  const payload = eventPayloadFrom(event);
  const properties = eventPropertiesFrom(payload);
  const part = payload?.part || properties.part;
  if (!part || part.type !== 'text') return null;
  const role = [part, payload?.info, properties.info, payload].map(roleFromObject).find(Boolean);
  if (role !== 'assistant') return null;
  return extractAssistantEvidence(event, rawOptions);
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
  if (knownStateDirs.has(options.stateDir)) return options.stateDir;
  countMetric(options, 'mkdirStateDir');
  await mkdir(options.stateDir, { recursive: true, mode: 0o700 });
  knownStateDirs.add(options.stateDir);
  return options.stateDir;
}

async function ensureGoalArchiveDir(rawOptions = {}) {
  const stateDir = await ensureGoalStateDir(rawOptions);
  const archiveDir = join(stateDir, '.archive');
  countMetric(rawOptions, 'mkdirArchiveDir');
  await mkdir(archiveDir, { recursive: true, mode: 0o700 });
  return archiveDir;
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

function invalidateGoalBriefCache(sessionID, rawOptions = {}) {
  try {
    goalBriefCache.delete(goalPathForSession(sessionID, rawOptions));
  } catch {
    return;
  }
}

function setGoalBriefCache(path, value, rawOptions = {}) {
  goalBriefCache.delete(path);
  goalBriefCache.set(path, value);
  while (goalBriefCache.size > DEFAULT_GOAL_BRIEF_CACHE_ENTRIES) {
    goalBriefCache.delete(goalBriefCache.keys().next().value);
  }
  if (rawOptions.metrics) rawOptions.metrics.goalBriefCacheSize = goalBriefCache.size;
}

function touchGoalBriefCache(path, value, rawOptions = {}) {
  setGoalBriefCache(path, value, rawOptions);
  return value;
}

function normalizeStoredGoal(rawGoal, fallbackSessionID, rawOptions = {}, expectedSessionID = null) {
  if (!rawGoal || typeof rawGoal !== 'object') {
    throw new GoalError('INVALID_GOAL_STATE', 'Goal state is not a JSON object');
  }
  const options = normalizeOptions(rawOptions);
  const expected = normalizeSessionID(expectedSessionID);
  const embedded = normalizeSessionID(rawGoal.sessionId);
  if (expected && embedded && embedded !== expected) {
    throw new GoalError('INVALID_GOAL_STATE', 'Goal state session id does not match its file path');
  }
  const sessionID = requireSessionID(expected || embedded || fallbackSessionID);
  const objective = sanitizeInlineText(rawGoal.objective, options.maxObjectiveChars);
  if (!objective) {
    throw new GoalError('INVALID_GOAL_STATE', 'Goal state is missing an objective');
  }
  if (!VALID_STATUSES.has(rawGoal.status)) {
    throw new GoalError('INVALID_GOAL_STATE', `Goal state has invalid status: ${rawGoal.status}`);
  }

  const createdAtMs = Number.isFinite(rawGoal.createdAtMs) ? Math.trunc(rawGoal.createdAtMs) : nowMs(options);
  const updatedAtMs = Number.isFinite(rawGoal.updatedAtMs) ? Math.trunc(rawGoal.updatedAtMs) : createdAtMs;
  const promptFields = normalizeGoalPromptFields(rawGoal, objective, options);
  const tokenBudget = rawGoal.tokenBudget === undefined ? null : normalizeTokenBudget(rawGoal.tokenBudget);

  return {
    sessionId: sessionID,
    goalId: normalizeGoalID(rawGoal.goalId || goalIdFromFactory(options)),
    objective,
    goalPrompt: promptFields.goalPrompt,
    promptEnhancement: promptFields.promptEnhancement,
    status: rawGoal.status,
    tokenBudget,
    tokensUsed: Number.isFinite(rawGoal.tokensUsed) ? Math.max(0, Math.trunc(rawGoal.tokensUsed)) : 0,
    timeUsedSeconds: Number.isFinite(rawGoal.timeUsedSeconds) ? Math.max(0, Math.trunc(rawGoal.timeUsedSeconds)) : 0,
    createdAtMs,
    updatedAtMs,
    revision: Number.isFinite(rawGoal.revision) ? Math.max(0, Math.trunc(rawGoal.revision)) : 0,
    createdAt: typeof rawGoal.createdAt === 'string' ? rawGoal.createdAt : isoFromMs(createdAtMs),
    updatedAt: typeof rawGoal.updatedAt === 'string' ? rawGoal.updatedAt : isoFromMs(updatedAtMs),
    continuationSuppressed: rawGoal.continuationSuppressed === true,
    autoTurnsUsed: normalizeAutoTurns(rawGoal.autoTurnsUsed, options.maxAutoTurns),
    maxAutoTurns: Number.isFinite(rawGoal.maxAutoTurns)
      ? Math.max(0, Math.min(options.maxAutoTurns, Math.trunc(rawGoal.maxAutoTurns)))
      : options.maxAutoTurns,
    startedAtMs: Number.isFinite(rawGoal.startedAtMs) ? Math.max(0, Math.trunc(rawGoal.startedAtMs)) : createdAtMs,
    activeWallMs: Number.isFinite(rawGoal.activeWallMs) ? Math.max(0, Math.trunc(rawGoal.activeWallMs)) : 0,
    lastActivityAtMs: Number.isFinite(rawGoal.lastActivityAtMs) ? Math.max(0, Math.trunc(rawGoal.lastActivityAtMs)) : 0,
    lastActivityMessageID: rawGoal.lastActivityMessageID === null || rawGoal.lastActivityMessageID === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastActivityMessageID, GOAL_ID_MAX_CHARS),
    lastContinuationAtMs: Number.isFinite(rawGoal.lastContinuationAtMs)
      ? Math.max(0, Math.trunc(rawGoal.lastContinuationAtMs))
      : 0,
    lastContinuationMessageId: rawGoal.lastContinuationMessageId === null || rawGoal.lastContinuationMessageId === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastContinuationMessageId, GOAL_ID_MAX_CHARS),
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
      : redactEvidence(rawGoal.lastVerifierReason, DEFAULT_MAX_REASON_CHARS),
    lastVerifierConfidence: Number.isFinite(rawGoal.lastVerifierConfidence)
      ? Math.max(0, Math.min(1, Number(rawGoal.lastVerifierConfidence)))
      : null,
    lastVerifierSource: rawGoal.lastVerifierSource === null || rawGoal.lastVerifierSource === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastVerifierSource, 80),
    lastCheckAtMs: Number.isFinite(rawGoal.lastCheckAtMs) ? Math.max(0, Math.trunc(rawGoal.lastCheckAtMs)) : 0,
    lastEvidence: rawGoal.lastEvidence === null || rawGoal.lastEvidence === undefined
      ? null
      : redactEvidence(rawGoal.lastEvidence, options.maxEvidenceChars),
    completionSource: rawGoal.completionSource === null || rawGoal.completionSource === undefined
      ? null
      : sanitizeInlineText(rawGoal.completionSource, 80),
    verifierRunID: rawGoal.verifierRunID === null || rawGoal.verifierRunID === undefined
      ? null
      : sanitizeInlineText(rawGoal.verifierRunID, GOAL_ID_MAX_CHARS),
    lastAccountedMessageID: rawGoal.lastAccountedMessageID === null || rawGoal.lastAccountedMessageID === undefined
      ? null
      : sanitizeInlineText(rawGoal.lastAccountedMessageID, GOAL_ID_MAX_CHARS),
    accountedMessageUsage: normalizeAccountedMessageUsage(rawGoal.accountedMessageUsage),
    usageSource: sanitizeInlineText(rawGoal.usageSource || 'unavailable', 80),
    providerRetryAfterMs: normalizeDeadlineMs(rawGoal.providerRetryAfterMs),
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
    countMetric(rawOptions, 'readGoalReadFile');
    const raw = await readFile(path, 'utf8');
    return normalizeStoredGoal(JSON.parse(raw), sessionID, rawOptions, requireSessionID(sessionID));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    if (error instanceof GoalError) throw error;
    throw new GoalError('READ_GOAL_FAILED', `Failed to read goal state: ${error.message}`);
  }
}

async function fsyncDirectory(directoryPath, rawOptions = {}) {
  let handle = null;
  try {
    handle = await open(directoryPath, 'r');
    await handle.sync();
  } catch (error) {
    if (process.env[DEBUG_ENV] === '1') {
      const options = normalizeOptions(rawOptions);
      await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {
        type: 'fsync_directory_error',
        directory: sanitizeInlineText(directoryPath, 1000),
        error: redactEvidence(error?.message || 'unknown error', DEFAULT_MAX_REASON_CHARS),
      }, { ...options, stateDir: options.stateDir });
    }
    return;
  } finally {
    if (handle) await handle.close().catch(() => { });
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
  const normalized = normalizeStoredGoal(goal, goal?.sessionId, options, goal?.sessionId);
  const stateDir = await ensureGoalStateDir(options);
  const finalPath = goalPathForSession(normalized.sessionId, options);
  const tempPath = `${finalPath}.${process.pid}.${nowMs(options)}.${Math.random().toString(16).slice(2)}.tmp`;
  let handle = null;

  try {
    handle = await open(tempPath, 'w', 0o600);
    await handle.writeFile(`${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
    await handle.sync();
    await handle.close();
    handle = null;
    countMetric(options, 'writeCycles');
    await rename(tempPath, finalPath);
    await fsyncDirectory(stateDir, options);
    invalidateGoalBriefCache(normalized.sessionId, options);
    return normalized;
  } catch (error) {
    if (handle) await handle.close().catch(() => { });
    await unlink(tempPath).catch(() => { });
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
  invalidateGoalBriefCache(sessionID, rawOptions);
  return null;
}

function retentionDaysFromEnv(name, fallback) {
  return normalizePositiveInt(Number(process.env[name]), fallback);
}

async function pruneArchive(rawOptions = {}) {
  try {
    const options = normalizeOptions(rawOptions);
    countMetric(options, 'pruneArchive');
    const archiveDir = join(options.stateDir, '.archive');
    const retentionMs = retentionDaysFromEnv(ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;
    const timestamp = retentionNowMs(options);
    const entries = await readdir(archiveDir, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      if (!entry.isFile()) return;
      const path = join(archiveDir, entry.name);
      try {
        const fileStats = await stat(path);
        if (timestamp - fileStats.mtimeMs > retentionMs) await unlink(path);
      } catch {
        return;
      }
    }));
  } catch {
    return;
  }
}

async function maybePruneArchive(rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const intervalMs = normalizePositiveInt(Number(process.env[SWEEP_INTERVAL_MS_ENV]), DEFAULT_SWEEP_INTERVAL_MS);
  const timestamp = nowMs(options);
  const lastPruneAtMs = lastArchivePruneAtMs.get(options.stateDir) || 0;
  if (timestamp - lastPruneAtMs <= intervalMs) return;
  lastArchivePruneAtMs.set(options.stateDir, timestamp);
  await pruneArchive(options);
}

async function archiveGoalStateFile(sessionID, rawOptions = {}) {
  const sweepArchiveStaleBeforeMs = Number.isFinite(rawOptions.sweepArchiveStaleBeforeMs)
    ? Math.trunc(rawOptions.sweepArchiveStaleBeforeMs)
    : null;
  return enqueueGoalMutation(sessionID, rawOptions, async (normalizedSessionID, options) => {
    const sourcePath = goalPathForSession(normalizedSessionID, options);
    if (sweepArchiveStaleBeforeMs !== null) {
      try {
        const raw = await readFile(sourcePath, 'utf8');
        const updatedAtMs = Number(JSON.parse(raw)?.updatedAtMs);
        if (!Number.isFinite(updatedAtMs) || updatedAtMs >= sweepArchiveStaleBeforeMs) return null;
      } catch {
        return null;
      }
    }
    const archiveDir = await ensureGoalArchiveDir(options);
    const archivePath = join(archiveDir, `${sessionKeyForSession(normalizedSessionID)}.json`);
    try {
      await rename(sourcePath, archivePath);
    } catch (error) {
      if (error?.code === 'ENOENT') return null;
      await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {
        type: 'event_error',
        eventType: 'session.deleted',
        sid: normalizedSessionID,
        error: redactEvidence(error?.message || 'archive failed', DEFAULT_MAX_REASON_CHARS),
      }, options);
      return null;
    }
    await fsyncDirectory(options.stateDir, options);
    await fsyncDirectory(archiveDir, options);
    invalidateGoalBriefCache(normalizedSessionID, options);
    await maybePruneArchive(options);
    return archivePath;
  }).catch(async (error) => {
    await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {
      type: 'event_error',
      eventType: 'session.deleted',
      sid: normalizeSessionID(sessionID),
      error: redactEvidence(error?.message || 'archive failed', DEFAULT_MAX_REASON_CHARS),
    }, rawOptions);
    return null;
  });
}

function sessionIDFromStateFilename(filename) {
  if (!filename.endsWith('.json')) return null;
  const key = filename.slice(0, -'.json'.length);
  if (!key || key.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(key)) return null;
  return normalizeSessionID(Buffer.from(key, 'hex').toString('utf8'));
}

async function sweepOrphanedActiveStates(rawOptions = {}, runtimeState = {}) {
  try {
    const intervalMs = normalizePositiveInt(Number(process.env[SWEEP_INTERVAL_MS_ENV]), DEFAULT_SWEEP_INTERVAL_MS);
    const sweepTimestamp = nowMs(rawOptions);
    if (sweepTimestamp - (runtimeState.lastSweepAtMs || 0) <= intervalMs) return;
    runtimeState.lastSweepAtMs = sweepTimestamp;

    const options = normalizeOptions(rawOptions);
    const stateDir = await ensureGoalStateDir(options);
    const retentionMs = retentionDaysFromEnv(ACTIVE_RETENTION_DAYS_ENV, DEFAULT_ACTIVE_RETENTION_DAYS) * MS_PER_DAY;
    const timestamp = retentionNowMs(options);
    const entries = await readdir(stateDir, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      if (!entry.isFile() || !entry.name.endsWith('.json')) return;
      const path = join(stateDir, entry.name);
      try {
        const fileStats = await stat(path);
        if (timestamp - fileStats.mtimeMs <= retentionMs) return;
        const raw = await readFile(path, 'utf8');
        countMetric(options, 'sweepJsonParse');
        const updatedAtMs = Number(JSON.parse(raw)?.updatedAtMs);
        if (!Number.isFinite(updatedAtMs) || timestamp - updatedAtMs <= retentionMs) return;
        const archivedSessionID = sessionIDFromStateFilename(entry.name);
        if (archivedSessionID) {
          await archiveGoalStateFile(archivedSessionID, {
            ...options,
            sweepArchiveStaleBeforeMs: timestamp - retentionMs,
          });
        }
      } catch (error) {
        writeDebugStderr('sweepOrphanedActiveStates', error);
        return;
      }
    }));
  } catch (error) {
    writeDebugStderr('sweepOrphanedActiveStates', error);
    return;
  }
}

async function readDirectoryEntries(directoryPath) {
  try {
    return await readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

async function listArchivedGoalRecords(rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const archiveDir = join(options.stateDir, '.archive');
  const entries = await readDirectoryEntries(archiveDir);
  const records = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const path = join(archiveDir, entry.name);
    try {
      const [fileStats, raw] = await Promise.all([stat(path), readFile(path, 'utf8')]);
      const fallbackSessionID = sessionIDFromStateFilename(entry.name) || 'archived-session';
      const goal = normalizeStoredGoal(JSON.parse(raw), fallbackSessionID, options);
      records.push({ filename: entry.name, sizeBytes: fileStats.size, mtimeMs: fileStats.mtimeMs, goal });
    } catch {
      continue;
    }
  }
  return records.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

async function fileSizeBytes(path) {
  try {
    return (await stat(path)).size;
  } catch (error) {
    if (error?.code === 'ENOENT') return 0;
    throw error;
  }
}

async function countOrphanCandidates(entries, stateDir, rawOptions = {}) {
  const retentionMs = retentionDaysFromEnv(ACTIVE_RETENTION_DAYS_ENV, DEFAULT_ACTIVE_RETENTION_DAYS) * MS_PER_DAY;
  const timestamp = retentionNowMs(rawOptions);
  let count = 0;
  await Promise.all(entries.map(async (entry) => {
    if (!entry.isFile() || !entry.name.endsWith('.json')) return;
    const path = join(stateDir, entry.name);
    try {
      const fileStats = await stat(path);
      if (timestamp - fileStats.mtimeMs <= retentionMs) return;
      const raw = await readFile(path, 'utf8');
      const updatedAtMs = Number(JSON.parse(raw)?.updatedAtMs);
      if (Number.isFinite(updatedAtMs) && timestamp - updatedAtMs > retentionMs) count += 1;
    } catch {
      return;
    }
  }));
  return count;
}

async function inspectGoalHealth(rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const stateEntries = await readDirectoryEntries(options.stateDir);
  const archiveEntries = await readDirectoryEntries(join(options.stateDir, '.archive'));
  const activeStateFiles = stateEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.json'));
  const archiveFiles = archiveEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.json'));
  const lastSweepAtMs = normalizeDeadlineMs(rawOptions?.runtimeState?.lastSweepAtMs);
  return {
    activeStateFileCount: activeStateFiles.length,
    archiveFileCount: archiveFiles.length,
    continuationLogBytes: await fileSizeBytes(join(options.stateDir, CONTINUATION_LOG_FILENAME)),
    goalEventsLogBytes: await fileSizeBytes(join(options.stateDir, GOAL_EVENTS_LOG_FILENAME)),
    lastSweepAtMs,
    orphanCandidateCount: await countOrphanCandidates(activeStateFiles, options.stateDir, options),
  };
}

/**
 * Mutate a session goal through the in-process write queue.
 *
 * @param {string} sessionID - OpenCode session id
 * @param {Function} mutator - Function receiving the current goal
 * @param {Object} [rawOptions] - State helper options
 * @returns {Promise<Object|null>} Mutated goal, or null after delete
 */
async function enqueueGoalMutation(sessionID, rawOptions = {}, operation) {
  const options = normalizeOptions(rawOptions);
  const normalizedSessionID = requireSessionID(sessionID);
  const queueKey = `${options.stateDir}:${sessionKeyForSession(normalizedSessionID)}`;
  const previous = mutationQueues.get(queueKey) || Promise.resolve();
  const run = previous.catch(() => undefined).then(() => operation(normalizedSessionID, options));

  mutationQueues.set(queueKey, run);
  try {
    return await run;
  } finally {
    if (mutationQueues.get(queueKey) === run) mutationQueues.delete(queueKey);
  }
}

async function mutateGoal(sessionID, mutator, rawOptions = {}) {
  return enqueueGoalMutation(sessionID, rawOptions, async (normalizedSessionID, options) => {
    const current = await readGoal(normalizedSessionID, options);
    const next = await mutator(current);
    if (next === null) return deleteGoalFile(normalizedSessionID, options);
    if (next === undefined) return current;
    const revision = Math.max(current?.revision || 0, next?.revision || 0) + 1;
    return writeGoalAtomic({ ...next, revision }, options);
  });
}

function buildNewGoal(sessionID, objective, tokenBudget, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const timestamp = nowMs(options);
  const promptFields = buildEnhancedGoalPrompt(objective, options);

  return {
    sessionId: requireSessionID(sessionID),
    goalId: goalIdFromFactory(options),
    objective,
    goalPrompt: promptFields.goalPrompt,
    promptEnhancement: promptFields.promptEnhancement,
    status: 'active',
    tokenBudget,
    tokensUsed: 0,
    timeUsedSeconds: 0,
    createdAtMs: timestamp,
    updatedAtMs: timestamp,
    revision: 0,
    createdAt: isoFromMs(timestamp),
    updatedAt: isoFromMs(timestamp),
    continuationSuppressed: false,
    autoTurnsUsed: 0,
    maxAutoTurns: options.maxAutoTurns,
    startedAtMs: timestamp,
    activeWallMs: 0,
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
    lastVerifierSource: null,
    lastEvidence: null,
    completionSource: null,
    verifierRunID: null,
    lastAccountedMessageID: null,
    accountedMessageUsage: {},
    usageSource: 'unavailable',
    providerRetryAfterMs: null,
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
  let mutation = 'created';

  const goal = await mutateGoal(sessionID, (current) => {
    const timestamp = nowMs(options);
    const tokenBudget = requestedBudget === undefined ? current?.tokenBudget ?? null : requestedBudget;
    const promptFields = buildEnhancedGoalPrompt(sanitizedObjective, options);
    if (current && current.objective === sanitizedObjective) {
      if (current.status !== 'active' && current.status !== 'paused') {
        mutation = 'replaced';
        return buildNewGoal(sessionID, sanitizedObjective, tokenBudget, options);
      }
      mutation = 'refreshed';
      return {
        ...current,
        status: 'active',
        goalPrompt: promptFields.goalPrompt,
        promptEnhancement: promptFields.promptEnhancement,
        tokenBudget,
        startedAtMs: current.status === 'paused'
          ? Math.max(0, timestamp - (current.activeWallMs || 0))
          : current.startedAtMs,
        activeWallMs: current.status === 'paused' ? 0 : current.activeWallMs,
        updatedAtMs: timestamp,
        updatedAt: isoFromMs(timestamp),
        continuationSuppressed: false,
        continuationSuppressedReason: null,
        blockedByPrompt: false,
      };
    }
    mutation = current ? 'replaced' : 'created';
    return buildNewGoal(sessionID, sanitizedObjective, tokenBudget, options);
  }, options);
  if (goal && typeof goal === 'object') {
    Object.defineProperty(goal, 'mutation', {
      value: mutation,
      enumerable: false,
      configurable: true,
    });
  }
  return goal;
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
  const allowedFrom = Array.isArray(rawOptions.allowedFrom)
    ? new Set(rawOptions.allowedFrom.map((entry) => sanitizeInlineText(entry, 80)).filter(Boolean))
    : null;
  return mutateGoal(sessionID, (current) => {
    if (!current) throw new GoalError('GOAL_NOT_FOUND', 'No goal is set for this session');
    if (allowedFrom && !allowedFrom.has(current.status)) {
      throw new GoalError('INVALID_STATUS_TRANSITION', `Cannot transition goal status from ${current.status} to ${status}`);
    }
    if (!STATUS_TRANSITIONS[current.status]?.has(status)) {
      throw new GoalError('INVALID_STATUS_TRANSITION', `Cannot transition goal status from ${current.status} to ${status}`);
    }
    const timestamp = nowMs(rawOptions);
    if (current.status === 'budget_limited' && status === 'active' && budgetWasCrossed(current.tokensUsed, current.tokenBudget)) {
      throw new GoalError('INVALID_STATUS_TRANSITION', 'Cannot resume goal while token budget is still exhausted');
    }
    const activeWallMs = current.status !== 'paused' && status === 'paused'
      ? Math.max(0, (current.activeWallMs || 0) + (timestamp - current.startedAtMs))
      : current.activeWallMs || 0;
    const startedAtMs = status === 'active' && current.status !== 'active'
      ? Math.max(0, timestamp - activeWallMs)
      : current.startedAtMs;
    return {
      ...current,
      status,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
      startedAtMs,
      activeWallMs: status === 'active' ? 0 : activeWallMs,
      continuationSuppressed: status === 'active' ? false : status === 'paused' || status === 'complete' ? true : current.continuationSuppressed,
      continuationSuppressedReason: status === 'active' ? null : reason || (status === 'paused' ? 'paused' : current.continuationSuppressedReason),
      completionSource: status === 'complete' ? 'manual' : current.completionSource,
      providerRetryAfterMs: status === 'active' ? null : current.providerRetryAfterMs,
    };
  }, rawOptions);
}

async function resumeGoal(sessionID, rawOptions = {}) {
  return markGoalStatus(sessionID, 'active', {
    ...rawOptions,
    allowedFrom: ['paused', 'usage_limited', 'budget_limited'],
  });
}

async function recoverProviderUsageLimitIfDue(sessionID, rawOptions = {}) {
  const normalizedSessionID = normalizeSessionID(sessionID);
  if (!normalizedSessionID) return null;
  const goal = await readGoal(normalizedSessionID, rawOptions);
  const deadline = normalizeDeadlineMs(goal?.providerRetryAfterMs);
  if (!goal || goal.status !== 'usage_limited' || deadline === null || nowMs(rawOptions) < deadline) return goal;
  return resumeGoal(normalizedSessionID, rawOptions);
}

function budgetWasCrossed(nextTokensUsed, tokenBudget) {
  return Number.isFinite(tokenBudget) && tokenBudget > 0 && nextTokensUsed >= tokenBudget;
}

async function patchGoalIfCurrent(sessionID, goalID, patch, rawOptions = {}) {
  const normalizedGoalID = normalizeGoalID(goalID);
  if (!normalizedGoalID) return null;
  return mutateGoal(sessionID, (current) => {
    if (!current || current.goalId !== normalizedGoalID) return current;
    const timestamp = nowMs(rawOptions);
    const patchFields = typeof patch === 'function' ? patch(current) : patch;
    return {
      ...current,
      ...patchFields,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, rawOptions);
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
  const normalizedExpectedGoalID = normalizeGoalID(expectedGoalID);
  const messageID = usage.messageID === null || usage.messageID === undefined
    ? null
    : sanitizeInlineText(usage.messageID, GOAL_ID_MAX_CHARS);
  const tokenDelta = Number.isFinite(usage.tokenDelta) && usage.tokenDelta > 0 ? Math.trunc(usage.tokenDelta) : 0;
  const timeDeltaSeconds = Number.isFinite(usage.timeDeltaSeconds) && usage.timeDeltaSeconds > 0
    ? Math.trunc(usage.timeDeltaSeconds)
    : 0;
  const usageSource = sanitizeInlineText(usage.usageSource || 'unavailable', 80) || 'unavailable';

  return mutateGoal(sessionID, (current) => {
    if (!current) return null;
    if (current.status !== 'active') return current;
    if (!normalizedExpectedGoalID || current.goalId !== normalizedExpectedGoalID) return current;
    const accountedMessageUsage = normalizeAccountedMessageUsage(current.accountedMessageUsage);
    const previousMessageTokens = messageID ? accountedMessageUsage[messageID] || 0 : 0;
    const chargeTokenDelta = messageID ? Math.max(0, tokenDelta - previousMessageTokens) : tokenDelta;

    const timestamp = nowMs(options);
    if (chargeTokenDelta <= 0) {
      return {
        ...current,
        accountedMessageUsage,
        usageSource,
        updatedAtMs: timestamp,
        updatedAt: isoFromMs(timestamp),
      };
    }

    const nextTokensUsed = current.tokensUsed + chargeTokenDelta;
    const nextStatus = budgetWasCrossed(nextTokensUsed, current.tokenBudget) ? 'budget_limited' : current.status;
    return {
      ...current,
      status: nextStatus,
      tokensUsed: nextTokensUsed,
      timeUsedSeconds: current.timeUsedSeconds + timeDeltaSeconds,
      lastAccountedMessageID: messageID || current.lastAccountedMessageID,
      accountedMessageUsage: messageID
        ? rememberAccountedMessage(accountedMessageUsage, messageID, tokenDelta)
        : accountedMessageUsage,
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

async function recordMessagePartUpdated(sessionID, event, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const messageID = extractEventMessageID(event);
  const evidence = extractAssistantTextPartEvidence(event, options);
  if (!evidence) return readGoal(sessionID, options);

  return mutateGoal(sessionID, (current) => {
    if (!current) return null;
    const timestamp = nowMs(options);
    return {
      ...current,
      lastActivityAtMs: timestamp,
      lastActivityMessageID: messageID || current.lastActivityMessageID,
      lastEvidence: evidence,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };
  }, options);
}

async function recordMessageUpdated(sessionID, event, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  await recoverProviderUsageLimitIfDue(sessionID, options);
  const messageID = extractEventMessageID(event);
  const evidence = extractAssistantEvidence(event, options);
  const error = extractErrorFromEvent(event);
  const usage = extractUsageFromEvent(event);
  const eventGoalID = extractEventGoalID(event);

  return mutateGoal(sessionID, (current) => {
    if (!current) return null;
    const timestamp = nowMs(options);
    const afterActivity = {
      ...current,
      lastActivityAtMs: timestamp,
      lastActivityMessageID: messageID || current.lastActivityMessageID,
      lastEvidence: evidence || current.lastEvidence,
      updatedAtMs: timestamp,
      updatedAt: isoFromMs(timestamp),
    };

    const expectedGoalID = normalizeGoalID(eventGoalID || afterActivity.goalId);
    if (isProviderUsageLimit(error)) {
      if (!expectedGoalID || afterActivity.goalId !== expectedGoalID) return afterActivity;
      return {
        ...afterActivity,
        ...providerUsageLimitPatch(error, options),
      };
    }

    if (afterActivity.status !== 'active') return afterActivity;
    if (!expectedGoalID || afterActivity.goalId !== expectedGoalID) return afterActivity;

    const tokenDelta = Number.isFinite(usage.tokenDelta) && usage.tokenDelta > 0 ? Math.trunc(usage.tokenDelta) : 0;
    const timeDeltaSeconds = Number.isFinite(usage.timeDeltaSeconds) && usage.timeDeltaSeconds > 0
      ? Math.trunc(usage.timeDeltaSeconds)
      : 0;
    const usageSource = sanitizeInlineText(usage.usageSource || 'unavailable', 80) || 'unavailable';
    const accountedMessageUsage = normalizeAccountedMessageUsage(afterActivity.accountedMessageUsage);
    const previousMessageTokens = messageID ? accountedMessageUsage[messageID] || 0 : 0;
    const chargeTokenDelta = messageID ? Math.max(0, tokenDelta - previousMessageTokens) : tokenDelta;

    if (chargeTokenDelta <= 0) {
      return {
        ...afterActivity,
        accountedMessageUsage,
        usageSource,
      };
    }

    const nextTokensUsed = afterActivity.tokensUsed + chargeTokenDelta;
    const nextStatus = budgetWasCrossed(nextTokensUsed, afterActivity.tokenBudget) ? 'budget_limited' : afterActivity.status;
    return {
      ...afterActivity,
      status: nextStatus,
      tokensUsed: nextTokensUsed,
      timeUsedSeconds: afterActivity.timeUsedSeconds + timeDeltaSeconds,
      lastAccountedMessageID: messageID || afterActivity.lastAccountedMessageID,
      accountedMessageUsage: messageID
        ? rememberAccountedMessage(accountedMessageUsage, messageID, tokenDelta)
        : accountedMessageUsage,
      usageSource,
      continuationSuppressed: nextStatus === 'budget_limited' ? true : afterActivity.continuationSuppressed,
      continuationSuppressedReason: nextStatus === 'budget_limited' ? 'token budget reached' : afterActivity.continuationSuppressedReason,
    };
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

function objectiveKeywords(objective) {
  return [...new Set(String(objective || '')
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9_-]{3,}/g) || [])]
    .filter((token) => !VERIFIER_STOPWORDS.has(token))
    .slice(0, 12);
}

function countEvidenceKeywordMatches(evidenceText, keywords) {
  const normalizedEvidence = String(evidenceText || '').toLowerCase();
  return keywords.filter((keyword) => normalizedEvidence.includes(keyword)).length;
}

function defaultHeuristicSupervisorVerifier({ goal, evidence }) {
  // Free-form assistant text can sound conclusive while still describing a blocker, so ambiguous or mixed evidence always stays open.
  const safeEvidence = sanitizeInlineText(evidence || '', DEFAULT_MAX_EVIDENCE_CHARS);
  const safeObjective = sanitizeInlineText(goal?.objective || '', DEFAULT_MAX_OBJECTIVE_CHARS);
  if (safeEvidence.length < 24) {
    return defaultVerifierResult('Evidence is too short to prove completion', safeEvidence, 'default-heuristic');
  }

  if (VERIFIER_BLOCKING_PATTERN.test(safeEvidence)) {
    return defaultVerifierResult('Evidence includes blocking or incomplete-work language', safeEvidence, 'default-heuristic');
  }

  if (/\.\.\.$/.test(safeEvidence) || /\btruncated\b/i.test(safeEvidence)) {
    return defaultVerifierResult('Evidence appears truncated before it proves completion', safeEvidence, 'default-heuristic');
  }

  if (!VERIFIER_COMPLETION_PATTERN.test(safeEvidence)) {
    return defaultVerifierResult('Evidence lacks an explicit completion signal', safeEvidence, 'default-heuristic');
  }

  const keywords = objectiveKeywords(safeObjective);
  const requiredMatches = keywords.length >= 2 ? 2 : 1;
  if (keywords.length === 0 || countEvidenceKeywordMatches(safeEvidence, keywords) < requiredMatches) {
    return defaultVerifierResult('Evidence does not reference the goal objective specifically enough', safeEvidence, 'default-heuristic');
  }

  return {
    verdict: 'met',
    confidence: 0.72,
    reason: 'Evidence gives an explicit completion signal tied to the goal objective',
    evidence: safeEvidence,
    verifierSource: 'default-heuristic',
  };
}

function buildLlmVerifierPrompt(goal, evidence) {
  return sanitizePromptText([
    'Judge whether the active goal is complete from the latest assistant evidence.',
    'Return only JSON with keys: verdict, confidence, reason, evidence.',
    'Allowed verdict values: met, not_met, blocked.',
    'Use not_met unless the evidence positively proves completion. Use blocked for errors, blockers, or required user action.',
    `Goal objective: ${sanitizeInlineText(goal?.objective || '', DEFAULT_MAX_OBJECTIVE_CHARS)}`,
    `Latest assistant evidence: ${sanitizeInlineText(evidence || '', DEFAULT_MAX_EVIDENCE_CHARS)}`,
  ].join('\n'), DEFAULT_MAX_GOAL_PROMPT_CHARS);
}

function verifierResponseText(value, depth = 0) {
  if (depth > 5 || value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((entry) => verifierResponseText(entry, depth + 1)).filter(Boolean).join(' ');
  if (typeof value !== 'object') return '';
  const direct = textFromValue(value);
  if (direct) return direct;
  return Object.values(value).map((entry) => verifierResponseText(entry, depth + 1)).filter(Boolean).join(' ');
}

function parseLlmVerifierResponse(response) {
  if (response && typeof response === 'object' && !Array.isArray(response) && typeof response.verdict === 'string') {
    return response;
  }
  const text = verifierResponseText(response) || String(response ?? '');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced || text.match(/\{[\s\S]*\}/)?.[0] || '';
  if (!candidate) throw new Error('verifier response missing structured JSON');
  return JSON.parse(candidate);
}

async function defaultLlmSupervisorVerifier({ goal, evidence, signal }, rawOptions = {}) {
  const sessionClient = rawOptions.client?.session;
  if (typeof sessionClient?.create !== 'function'
    || typeof sessionClient?.prompt !== 'function'
    || typeof sessionClient?.delete !== 'function') {
    throw new Error('isolated session APIs unavailable for default verifier');
  }

  const query = rawOptions.directory ? { directory: resolvePath(rawOptions.directory) } : undefined;
  let verifierSessionID = null;
  try {
    const createdResponse = await sessionClient.create.call(sessionClient, {
      query,
      body: {},
    }, { signal });
    const created = createdResponse?.data || createdResponse;
    verifierSessionID = normalizeSessionID(created?.id || created?.info?.id);
    if (!verifierSessionID) throw new Error('isolated verifier session missing id');

    const response = await sessionClient.prompt.call(sessionClient, {
      path: { id: verifierSessionID },
      query,
      body: {
        parts: [{
          type: 'text',
          text: buildLlmVerifierPrompt(goal, evidence),
        }],
        tools: {},
      },
    }, { signal });
    return {
      ...parseLlmVerifierResponse(response?.data || response),
      verifierSource: 'default-llm',
    };
  } finally {
    if (verifierSessionID) {
      await Promise.resolve(sessionClient.delete.call(sessionClient, {
        path: { id: verifierSessionID },
        query,
      })).catch(() => { });
    }
  }
}

function defaultVerifierResult(reason, evidence = null, verifierSource = null) {
  return {
    verdict: 'not_met',
    confidence: 0,
    reason,
    evidence,
    verifierSource,
    timedOut: false,
  };
}

function verifierResultEnvelope(result, fields = {}) {
  return {
    ...result,
    goalId: fields.goalId || null,
    currentGoalId: fields.currentGoalId || null,
    verifierRunID: fields.verifierRunID || null,
    stale: fields.stale === true,
    timedOut: result?.timedOut === true,
  };
}

function normalizeVerifierResult(rawResult, fallbackEvidence, rawOptions = {}, verifierSource = null) {
  const options = normalizeOptions(rawOptions);
  if (!rawResult || typeof rawResult !== 'object') {
    return defaultVerifierResult('Verifier returned no usable result', redactEvidence(fallbackEvidence, options.maxEvidenceChars), verifierSource);
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
    verifierSource,
    timedOut: rawResult.timedOut === true,
  };
}

async function runSupervisorVerifier(goal, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  if (!goal?.lastEvidence) {
    return defaultVerifierResult('No verifier evidence is available', null, options.supervisorVerifierSource);
  }
  try {
    const result = await withDeadline((signal) => options.supervisorVerifier({
      goal,
      sessionID: goal.sessionId,
      evidence: goal.lastEvidence,
      signal,
    }), options.verifierTimeoutMs, 'VERIFIER_TIMEOUT', 'verifier_timeout');
    return normalizeVerifierResult(result, goal.lastEvidence, options, options.supervisorVerifierSource);
  } catch (error) {
    if (error?.code === 'VERIFIER_TIMEOUT') {
      return {
        ...defaultVerifierResult(
          'verifier_timeout',
          redactEvidence(goal.lastEvidence, options.maxEvidenceChars),
          options.supervisorVerifierSource,
        ),
        timedOut: true,
      };
    }
    const reason = redactEvidence(`Verifier failed: ${error?.message || 'unknown error'}`, DEFAULT_MAX_REASON_CHARS);
    return {
      verdict: 'blocked',
      confidence: 0,
      reason,
      evidence: redactEvidence(goal.lastEvidence, options.maxEvidenceChars),
      verifierSource: options.supervisorVerifierSource,
      timedOut: false,
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
    return verifierResultEnvelope(defaultVerifierResult('No active goal to verify', null), {
      goalId: goal?.goalId || null,
      currentGoalId: goal?.goalId || null,
    });
  }

  const snapshotRevision = goal.revision;
  const result = await runSupervisorVerifier(goal, options);
  const verifierRunID = `verifier-${randomUUID()}`;
  let resultApplied = false;
  let currentGoalID = null;
  await mutateGoal(sessionID, (current) => {
    currentGoalID = current?.goalId || null;
    if (!current
      || current.goalId !== goal.goalId
      || current.status !== 'active'
      || current.revision !== snapshotRevision) return undefined;
    resultApplied = true;
    const timestamp = nowMs(options);
    const next = {
      ...current,
      lastCheckAtMs: timestamp,
      lastVerifierVerdict: result.verdict,
      lastVerifierReason: result.reason,
      lastVerifierConfidence: result.confidence,
      lastVerifierSource: result.verifierSource,
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

  return verifierResultEnvelope(result, {
    goalId: goal.goalId,
    currentGoalId: currentGoalID,
    verifierRunID,
    stale: !resultApplied,
  });
}

function renderContinuationPrompt(goal, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const objectivePreviewLimit = calculateObjectivePreviewChars(options.maxInjectionChars);
  const objective = sanitizeInlineText(goal?.objective, Math.min(options.maxObjectiveChars, objectivePreviewLimit));
  const goalPrompt = sanitizePromptText(goal?.goalPrompt || goal?.objective, options.maxGoalPromptChars);
  const reason = sanitizeInlineText(goal?.lastVerifierReason || 'not verified complete', DEFAULT_MAX_REASON_CHARS);
  return clampText([
    '[active_goal_continuation]',
    `objective: ${objective}`,
    'goal_prompt:',
    goalPrompt,
    `last_check: ${goal?.lastVerifierVerdict || 'not_evaluated'} ; reason: ${reason}`,
    'instruction: Continue the active goal from the current session context. Do not ask for confirmation unless blocked by missing permission or user input. End only when the verifier can prove completion or the work is blocked.',
    '[/active_goal_continuation]',
  ].join('\n'), options.maxInjectionChars);
}

function continuationRuntimeStatus(runtimeState, sessionID) {
  const rawStatus = runtimeState?.sessionStatuses?.get?.(sessionID) || null;
  return sanitizeInlineText(rawStatus?.type || rawStatus || '', 80).toLowerCase() || null;
}

function continuationCapReason(goal, timestamp, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const maxAutoTurns = Math.min(goal.maxAutoTurns || options.maxAutoTurns, options.maxAutoTurns);
  if (goal.autoTurnsUsed >= maxAutoTurns) return 'auto_turn_cap_reached';
  if (timestamp - goal.startedAtMs >= options.maxWallMs) return 'wall_clock_cap_reached';
  return null;
}

function continuationBudgetReason(goal) {
  if (Number.isFinite(goal.tokenBudget) && goal.tokenBudget > 0 && goal.tokensUsed >= goal.tokenBudget) {
    return 'budget_exhausted';
  }
  return null;
}

async function recordContinuationReason(sessionID, goalID, reason, rawOptions = {}, suppress = false, errorText = null) {
  return patchGoalIfCurrent(sessionID, goalID, (current) => ({
    continuationSuppressed: suppress ? true : current.continuationSuppressed,
    continuationSuppressedReason: sanitizeInlineText(reason, DEFAULT_MAX_REASON_CHARS),
    lastContinuationError: errorText
      ? sanitizeInlineText(errorText, DEFAULT_MAX_REASON_CHARS)
      : current.lastContinuationError,
  }), rawOptions);
}

async function recordContinuationBudgetStop(sessionID, goalID, rawOptions = {}) {
  return patchGoalIfCurrent(sessionID, goalID, {
    status: 'budget_limited',
    continuationSuppressed: true,
    continuationSuppressedReason: 'budget_exhausted',
  }, rawOptions);
}

async function recordProviderUsageLimit(sessionID, goalID, error = null, rawOptions = {}) {
  return patchGoalIfCurrent(sessionID, goalID, providerUsageLimitPatch(error, rawOptions), rawOptions);
}

async function reserveContinuationTurn(sessionID, goalID, rawOptions = {}) {
  const normalizedGoalID = normalizeGoalID(goalID);
  const messageID = `goal-continuation-${randomUUID()}`;
  let didReserve = false;
  let previousReservation = null;
  const goal = await mutateGoal(sessionID, (current) => {
    if (!current || current.goalId !== normalizedGoalID || current.status !== 'active') return undefined;
    const maxAutoTurns = Math.min(current.maxAutoTurns || rawOptions.maxAutoTurns || DEFAULT_MAX_AUTO_TURNS, rawOptions.maxAutoTurns || DEFAULT_MAX_AUTO_TURNS);
    if (current.autoTurnsUsed >= maxAutoTurns) return undefined;
    const timestamp = nowMs(rawOptions);
    didReserve = true;
    previousReservation = {
      autoTurnsUsed: current.autoTurnsUsed,
      lastContinuationAtMs: current.lastContinuationAtMs,
      lastContinuationMessageId: current.lastContinuationMessageId,
    };
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

  return { didReserve, goal, messageID, previousReservation };
}

async function rollbackContinuationReservation(sessionID, goalID, reservation, error, rawOptions = {}) {
  return mutateGoal(sessionID, (current) => {
    if (!current
      || current.goalId !== normalizeGoalID(goalID)
      || current.lastContinuationMessageId !== reservation.messageID) return undefined;
    return {
      ...current,
      autoTurnsUsed: reservation.previousReservation.autoTurnsUsed,
      lastContinuationAtMs: reservation.previousReservation.lastContinuationAtMs,
      lastContinuationMessageId: reservation.previousReservation.lastContinuationMessageId,
      lastContinuationError: sanitizeInlineText(error?.message || 'promptAsync failed', DEFAULT_MAX_REASON_CHARS),
      continuationSuppressed: true,
      continuationSuppressedReason: 'prompt_async_failed',
    };
  }, rawOptions);
}

async function buildPromptAsyncOptions(sessionID, goal, messageID, rawOptions = {}) {
  const rawDirectory = typeof rawOptions.directory === 'string' ? rawOptions.directory.trim() : '';
  let directory = '';
  if (rawDirectory) {
    try {
      const resolvedDirectory = resolvePath(rawDirectory);
      if ((await stat(resolvedDirectory)).isDirectory()) directory = resolvedDirectory;
    } catch {
      directory = '';
    }
  }
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
  let decisionGoalID = null;

  async function decision(decisionType, reason, autoTurnsUsed = 0) {
    await logContinuationDecision(normalizedSessionID, decisionType, reason, autoTurnsUsed, options, decisionGoalID);
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

  await recoverProviderUsageLimitIfDue(normalizedSessionID, options);

  const continuationLocks = runtimeState.inFlightContinuations;
  if (continuationLocks?.has?.(normalizedSessionID)) {
    return decision('suppressed', 'continuation_in_flight', 0);
  }
  continuationLocks?.add?.(normalizedSessionID);

  try {
    const goal = await readGoal(normalizedSessionID, options);
    decisionGoalID = goal?.goalId || null;
    const autoTurnsUsed = goal?.autoTurnsUsed || 0;
    if (!goal || goal.status !== 'active') return decision('suppressed', 'goal_not_active', autoTurnsUsed);

    const verifierResult = rawOptions.verifierResult || null;
    if (verifierResult?.timedOut) return decision('suppressed', 'verifier_timeout', autoTurnsUsed);
    if (verifierResult?.stale) return decision('suppressed', 'stale_verifier_result', autoTurnsUsed);
    if (verifierResult?.goalId && verifierResult.goalId !== goal.goalId) {
      return decision('suppressed', 'verifier_goal_mismatch', autoTurnsUsed);
    }

    if (goal.continuationSuppressed) {
      return decision('suppressed', goal.continuationSuppressedReason || 'continuation_suppressed', autoTurnsUsed);
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

    const capReason = continuationCapReason(goal, timestamp, options);
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

    const reserved = await reserveContinuationTurn(normalizedSessionID, goal.goalId, options);
    if (!reserved.didReserve) {
      return decision('suppressed', 'auto_turn_cap_reached', reserved.goal?.autoTurnsUsed || autoTurnsUsed);
    }

    try {
      await withDeadline(async (signal) => promptAsync.call(
        rawOptions.client.session,
        await buildPromptAsyncOptions(normalizedSessionID, reserved.goal, reserved.messageID, rawOptions),
        { signal },
      ), options.continuationTimeoutMs, 'CONTINUATION_TIMEOUT', 'prompt_async_timeout');
      return decision('fired', 'prompt_async_sent', reserved.goal.autoTurnsUsed);
    } catch (error) {
      if (error?.code === 'CONTINUATION_TIMEOUT') {
        const timedOutGoal = await recordContinuationReason(
          normalizedSessionID,
          reserved.goal.goalId,
          'prompt_async_timeout',
          options,
          true,
          'prompt_async_timeout',
        );
        return decision('suppressed', 'prompt_async_timeout', timedOutGoal?.autoTurnsUsed || reserved.goal.autoTurnsUsed);
      }
      const rolledBackGoal = await rollbackContinuationReservation(
        normalizedSessionID,
        reserved.goal.goalId,
        reserved,
        error,
        options,
      );
      return decision('suppressed', 'prompt_async_failed', rolledBackGoal?.autoTurnsUsed || 0);
    }
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
  countMetric(rawOptions, 'renderGoalInjection');
  const options = normalizeOptions(rawOptions);
  const objectivePreviewLimit = calculateObjectivePreviewChars(options.maxInjectionChars);
  const objective = sanitizeInlineText(goal.objective, Math.min(options.maxObjectiveChars, objectivePreviewLimit));
  const goalPrompt = sanitizePromptText(goal.goalPrompt || goal.objective, options.maxGoalPromptChars);
  const reason = sanitizeInlineText(goal.lastVerifierReason || 'none', DEFAULT_MAX_REASON_CHARS) || 'none';
  const tokenBudget = goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : String(goal.tokenBudget);
  const tokensUsed = Number.isFinite(goal.tokensUsed) ? Math.max(0, Math.trunc(goal.tokensUsed)) : 0;
  const timeUsedSeconds = Number.isFinite(goal.timeUsedSeconds) ? Math.max(0, Math.trunc(goal.timeUsedSeconds)) : 0;
  const autoTurnsUsed = Number.isFinite(goal.autoTurnsUsed) ? Math.max(0, Math.trunc(goal.autoTurnsUsed)) : 0;
  const maxAutoTurns = Number.isFinite(goal.maxAutoTurns) ? Math.max(0, Math.trunc(goal.maxAutoTurns)) : DEFAULT_MAX_AUTO_TURNS;
  const verdict = sanitizeInlineText(goal.lastVerifierVerdict || 'not_evaluated', 80) || 'not_evaluated';
  const goalId = normalizeGoalID(goal.goalId);
  const directive = 'directive: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.';
  const buildBlock = (promptText) => [
    `[active_goal:${goalId}]`,
    'status: active',
    `objective: ${objective}`,
    'goal_prompt:',
    promptText,
    `last_check: ${verdict} ; reason: ${reason}`,
    `usage: tokens ${tokensUsed}/${tokenBudget}; time ${timeUsedSeconds}s; iteration ${autoTurnsUsed}/${maxAutoTurns}`,
    directive,
    '[/active_goal]',
  ].join('\n');
  const promptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, options.maxInjectionChars - buildBlock('').length);
  const block = buildBlock(sanitizePromptText(goalPrompt, promptBudget));
  if (block.length <= options.maxInjectionChars) return block;

  const buildCompactBlock = (promptText) => [
    `[active_goal:${goalId}]`,
    'goal_prompt:',
    promptText,
    `last_check: ${verdict} ; reason: ${reason}`,
    directive,
    '[/active_goal]',
  ].join('\n');
  const compactPromptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, options.maxInjectionChars - buildCompactBlock('').length);

  return clampText(buildCompactBlock(sanitizePromptText(goalPrompt, compactPromptBudget)), options.maxInjectionChars);
}

async function readGoalForBrief(sessionID, rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const path = goalPathForSession(sessionID, options);
  const cached = goalBriefCache.get(path);
  let fileStats = null;
  try {
    fileStats = await stat(path);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    if (cached?.missing === true) {
      touchGoalBriefCache(path, cached, options);
      return null;
    }
    setGoalBriefCache(path, { missing: true }, options);
    return null;
  }

  const cacheKey = `${fileStats.mtimeMs}:${fileStats.size}`;
  if (cached?.cacheKey === cacheKey) return touchGoalBriefCache(path, cached, options).goal;

  try {
    countMetric(options, 'briefReadFile');
    const raw = await readFile(path, 'utf8');
    const goal = normalizeStoredGoal(JSON.parse(raw), sessionID, options, requireSessionID(sessionID));
    setGoalBriefCache(path, { cacheKey, goal }, options);
    return goal;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      setGoalBriefCache(path, { missing: true }, options);
      return null;
    }
    throw error;
  }
}

async function appendGoalBrief(input = {}, output = { system: [] }, rawOptions = {}) {
  try {
    if (!output || typeof output !== 'object') return;
    output.system = Array.isArray(output.system) ? output.system : [];
    const sessionID = sessionIdFromInput(input);
    if (!sessionID) return;
    const goal = await readGoalForBrief(sessionID, rawOptions);
    const block = renderGoalInjection(goal, rawOptions);
    if (!block) return;
    const marker = `[active_goal:${goal.goalId}]`;
    if (output.system.some((entry) => typeof entry === 'string' && entry.includes(marker))) return;
    output.system.push(block);
  } catch (error) {
    writeDebugStderr('appendGoalBrief', error);
    await appendGoalJsonl(GOAL_EVENTS_LOG_FILENAME, {
      type: 'event_error',
      eventType: 'system.transform',
      sid: sessionIdFromInput(input),
      error: redactEvidence(error?.message || 'unknown error', DEFAULT_MAX_REASON_CHARS),
    }, rawOptions);
    return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TOOL OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function goalStateLines(action, goal, rawOptions = {}, mutation = null, renderOptions = {}) {
  const includeInjectionPreview = renderOptions.includeInjectionPreview !== false;
  const injectionPreview = includeInjectionPreview ? renderGoalInjection(goal, rawOptions) : EMPTY_INJECTION_PREVIEW;
  if (!goal) {
    const lines = [
      `STATUS=OK ACTION=${action}`,
      'goal_present=false',
      'store_health=no_active_goal',
    ];
    if (includeInjectionPreview) lines.push(`injection_preview=${JSON.stringify(injectionPreview)}`);
    return lines.join('\n');
  }

  const stateAgeMs = Math.max(0, nowMs(rawOptions) - goal.updatedAtMs);
  const options = normalizeOptions(rawOptions);
  const maxAutoTurns = Number.isFinite(goal.maxAutoTurns) ? Math.max(0, Math.trunc(goal.maxAutoTurns)) : options.maxAutoTurns;
  const autoTurnsUsed = Number.isFinite(goal.autoTurnsUsed) ? Math.max(0, Math.trunc(goal.autoTurnsUsed)) : 0;
  const wallElapsedMs = goal.status === 'active'
    ? Math.max(0, nowMs(options) - goal.startedAtMs)
    : Math.max(0, goal.activeWallMs || 0);
  const remainingWallMs = Math.max(0, options.maxWallMs - wallElapsedMs);
  const lines = [
    `STATUS=OK ACTION=${action}`,
    'goal_present=true',
    `plugin_id=${PLUGIN_ID}`,
    `goal_id=${goal.goalId}`,
    `status=${goal.status}`,
    `objective=${quoteValue(goal.objective)}`,
    `goal_prompt=${quoteValue(goal.goalPrompt || '')}`,
    `prompt_framework=${quoteValue(goal.promptEnhancement?.framework || '')}`,
    `prompt_methodology=${quoteValue(goal.promptEnhancement?.methodology || '')}`,
    `prompt_clear_score=${goal.promptEnhancement?.clearScore ?? 'unknown'}`,
    `prompt_char_count=${goal.promptEnhancement?.charCount ?? String(goal.goalPrompt || '').length}`,
    `prompt_max_chars=${goal.promptEnhancement?.maxChars ?? options.maxGoalPromptChars}`,
    `token_budget=${goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : goal.tokenBudget}`,
    `tokens_used=${goal.tokensUsed}`,
    `time_used_seconds=${goal.timeUsedSeconds}`,
    `max_auto_turns=${maxAutoTurns}`,
    `remaining_auto_turns=${Math.max(0, maxAutoTurns - autoTurnsUsed)}`,
    `max_wall_ms=${options.maxWallMs}`,
    `remaining_wall_ms=${remainingWallMs}`,
    `provider_retry_after_ms=${goal.providerRetryAfterMs === null || goal.providerRetryAfterMs === undefined ? 'none' : goal.providerRetryAfterMs}`,
    `usage_source=${goal.usageSource || 'unavailable'}`,
    `budget_tokens_used=${goal.tokensUsed}`,
    `budget_token_budget=${goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : goal.tokenBudget}`,
    `budget_usage_source=${goal.usageSource || 'unavailable'}`,
    `created_at_ms=${goal.createdAtMs}`,
    `updated_at_ms=${goal.updatedAtMs}`,
    `store_health=state_age_ms:${stateAgeMs}`,
    `last_check=${goal.lastVerifierVerdict || 'not_evaluated'}`,
    `verifier_last_verdict=${goal.lastVerifierVerdict || 'not_evaluated'}`,
    `verifier_source=${goal.lastVerifierSource || 'none'}`,
    `verifier_last_evidence=${quoteValue(redactEvidence(goal.lastEvidence || '', options.maxEvidenceChars))}`,
    `blocked_by_prompt=${goal.blockedByPrompt === true}`,
    `continuation_suppressed=${goal.continuationSuppressed === true}`,
    `continuation_attempts=${goal.autoTurnsUsed}`,
    `continuation_suppressed_reason=${quoteValue(goal.continuationSuppressedReason || '')}`,
  ];
  if (includeInjectionPreview) lines.push(`injection_preview=${JSON.stringify(injectionPreview)}`);
  if (mutation) lines.splice(1, 0, `mutation=${mutation}`);
  return lines.join('\n');
}

function historyLines(records) {
  const lines = [
    'STATUS=OK ACTION=history',
    `archive_count=${records.length}`,
  ];
  records.forEach((record, index) => {
    lines.push(
      `archive_${index}_file=${quoteValue(record.filename)}`,
      `archive_${index}_goal_id=${quoteValue(record.goal.goalId)}`,
      `archive_${index}_session_id=${quoteValue(record.goal.sessionId)}`,
      `archive_${index}_status=${quoteValue(record.goal.status)}`,
      `archive_${index}_objective=${quoteValue(record.goal.objective)}`,
      `archive_${index}_updated_at_ms=${record.goal.updatedAtMs}`,
      `archive_${index}_size_bytes=${record.sizeBytes}`,
    );
  });
  return lines.join('\n');
}

function healthLines(action, health) {
  const lastSweepAtMs = health.lastSweepAtMs || 0;
  return [
    `STATUS=OK ACTION=${action}`,
    `active_state_file_count=${health.activeStateFileCount}`,
    `archive_file_count=${health.archiveFileCount}`,
    `continuation_log_bytes=${health.continuationLogBytes}`,
    `goal_events_log_bytes=${health.goalEventsLogBytes}`,
    `last_sweep_at_ms=${lastSweepAtMs}`,
    `last_sweep_at=${quoteValue(lastSweepAtMs > 0 ? isoFromMs(lastSweepAtMs) : 'never')}`,
    `orphan_candidate_count=${health.orphanCandidateCount}`,
  ].join('\n');
}

function failureLines(error, action = 'show') {
  const code = error?.code || 'GOAL_ERROR';
  const message = error?.message || 'Goal operation failed';
  const normalizedAction = GOAL_ACTIONS.includes(action) ? action : 'show';
  return [
    `STATUS=FAIL ACTION=${normalizedAction} ERROR=${quoteValue(message)}`,
    `code=${code}`,
  ].join('\n');
}

async function executeGoalAction(args, context, rawOptions = {}) {
  const action = GOAL_ACTIONS.includes(args?.action) ? args.action : 'show';
  const sessionID = sessionIdFromContext(context);
  const options = normalizeOptions(rawOptions);
  const renderOptions = { includeInjectionPreview: rawOptions.includeInjectionPreview !== false };

  try {
    if (!options.enabled) {
      throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal plugin tool execution`);
    }
    if (action === 'history') {
      const records = await listArchivedGoalRecords(options);
      return historyLines(records);
    }
    if (action === 'doctor' || action === 'health') {
      const health = await inspectGoalHealth({ ...options, runtimeState: rawOptions.runtimeState });
      return healthLines(action, health);
    }
    if (action === 'set') {
      const goal = await setGoal(sessionID, args?.objective, {
        ...options,
        tokenBudget: args?.tokenBudget,
      });
      return goalStateLines(action, goal, options, goal.mutation || 'created', renderOptions);
    }
    if (action === 'clear') {
      await clearGoal(sessionID, options);
      return goalStateLines(action, null, options, null, renderOptions);
    }
    if (action === 'complete') {
      const goal = await markGoalStatus(sessionID, 'complete', options);
      return goalStateLines(action, goal, options, null, renderOptions);
    }
    if (action === 'pause') {
      const goal = await markGoalStatus(sessionID, 'paused', {
        ...options,
        reason: args?.reason,
      });
      return goalStateLines(action, goal, options, null, renderOptions);
    }
    if (action === 'resume') {
      const goal = await resumeGoal(sessionID, options);
      return goalStateLines(action, goal, options, null, renderOptions);
    }
    const goal = await readGoal(sessionID, options);
    return goalStateLines('show', goal, options, null, renderOptions);
  } catch (error) {
    return failureLines(error, action);
  }
}

async function executeGoalStatus(context, rawOptions = {}) {
  try {
    const options = normalizeOptions(rawOptions);
    if (!options.enabled) {
      throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal plugin tool execution`);
    }
    const sessionID = sessionIdFromContext(context);
    const goal = await readGoal(sessionID, options);
    return goalStateLines('show', goal, options);
  } catch (error) {
    return failureLines(error, 'show');
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
    lastSweepAtMs: 0,
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
    goalBriefCache.clear();
  }

  async function handleEvent(event) {
    const eventOptions = normalizeOptions(rawOptions);
    if (!eventOptions.enabled) return;
    const eventType = eventTypeFrom(event);
    const sessionID = extractEventSessionID(event);
    if (!eventType) return;
    await logDebugEvent(eventType, sessionID, eventOptions);

    if (eventType === 'session.created') {
      if (sessionID) await restoreActiveGoal(sessionID, eventOptions);
      try {
        await sweepOrphanedActiveStates(eventOptions, runtimeState);
      } catch {
        return;
      }
      return;
    }

    if (eventType === 'message.updated') {
      if (sessionID) await recordMessageUpdated(sessionID, event, eventOptions);
      return;
    }

    if (eventType === 'message.part.updated') {
      if (sessionID) await recordMessagePartUpdated(sessionID, event, eventOptions);
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
        await setBlockedByPrompt(sessionID, true, eventOptions);
      }
      return;
    }

    if (eventType === 'permission.replied' || eventType === 'question.replied' || eventType === 'question.rejected') {
      if (sessionID) {
        runtimeState.blockedByPromptSessions.delete(sessionID);
        await setBlockedByPrompt(sessionID, false, eventOptions);
      }
      return;
    }

    if (eventType === 'session.idle') {
      if (!sessionID) {
        await maybeContinueGoal(sessionID, {
          ...eventOptions,
          client: ctx?.client,
          directory: ctx?.directory,
          runtimeState,
        });
        return;
      }
      runtimeState.sessionStatuses.set(sessionID, 'idle');
      if (runtimeState.inFlightVerifications.has(sessionID)) return;
      runtimeState.inFlightVerifications.add(sessionID);
      let verifierResult = null;
      try {
        verifierResult = await maybeVerifyGoal(sessionID, {
          ...rawOptions,
          client: ctx?.client,
          directory: ctx?.directory,
        });
      } finally {
        runtimeState.inFlightVerifications.delete(sessionID);
      }
      await maybeContinueGoal(sessionID, {
        ...eventOptions,
        client: ctx?.client,
        directory: ctx?.directory,
        runtimeState,
        verifierResult,
      });
      return;
    }

    if (eventType === 'session.deleted') {
      if (!sessionID) {
        await logDebugEventError(event, new GoalError('MISSING_SESSION_ID', 'session.deleted missing session id'), eventOptions);
        return;
      }
      flushVolatileLocks(sessionID);
      invalidateGoalBriefCache(sessionID, eventOptions);
      await archiveGoalStateFile(sessionID, eventOptions);
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
      } catch (error) {
        await logDebugEventError(input.event || input, error, normalizeOptions(rawOptions));
        return;
      }
    },

    'experimental.chat.system.transform': async (input, output) => {
      const transformOptions = normalizeOptions(rawOptions);
      if (!transformOptions.enabled) return;
      await appendGoalBrief(input, output, transformOptions);
    },

    tool: {
      mk_goal: tool({
        description: 'Set, show, clear, complete, pause, resume, inspect history, or check goal plugin health',
        args: {
          action: tool.schema.enum(GOAL_ACTIONS),
          objective: tool.schema.string().optional(),
          tokenBudget: tool.schema.number().int().positive().nullable().optional(),
          reason: tool.schema.string().optional(),
        },
        async execute(args, context) {
          return executeGoalAction(args, context, { ...rawOptions, runtimeState });
        },
      }),
      mk_goal_status: tool({
        description: 'Show the active session goal and exact injection preview',
        args: {},
        async execute(_args, context) {
          return executeGoalStatus(context, rawOptions);
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
  buildEnhancedGoalPrompt,
  clearGoal,
  ensureGoalStateDir,
  executeGoalAction,
  executeGoalStatus,
  fsyncDirectory,
  goalPathForSession,
  markGoalStatus,
  maybeContinueGoal,
  maybeVerifyGoal,
  readGoal,
  renderGoalInjection,
  setGoal,
  sessionKeyForSession,
  writeGoalAtomic,
});

MkGoalPlugin.__test = __test;
