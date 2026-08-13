// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: goal-core (runtime-neutral)                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Persist isolated cross-runtime session goals and render the     ║
// ║          passive `[active_goal]` steering block injected into a model's ║
// ║          context. Ported from the OpenCode `mk-goal` plugin's session   ║
// ║          state machine, template, and prompt-injection hardening. Reads ║
// ║          fail open; management mutations raise stable GoalError codes. ║
// ║          This module never writes stdout or stderr.                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  chmodSync,
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeSync,
} = require('node:fs');
const { dirname, isAbsolute, join, relative, resolve, sep } = require('node:path');
const { createHash, randomUUID } = require('node:crypto');

const { isHookEnabled } = require('../../shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIR_ENV = 'MK_GOAL_STATE_DIR';
const DISABLED_ENV = 'MK_GOAL_PLUGIN_DISABLED';
const STATE_SUBDIR = '.opencode/skills/.goal-state';
const LEGACY_STATE_FILENAME = 'active-goal.json';
const ARCHIVE_SUBDIR = '.archive';
const LEGACY_ARCHIVE_SUBDIR = '.legacy';
const LOCK_SUBDIR = '.locks';
const MAX_SESSION_ID_CHARS = 4096;
const RUNTIME_NAMESPACE_PATTERN = /^[a-z][a-z0-9-]{0,63}$/;
const SCOPED_KEY_PATTERN = /^(?:[a-f0-9]{64}|[a-z][a-z0-9-]{0,63}-[a-f0-9]{64})$/;
const SCOPED_STATE_PATTERN = /^(?:[a-f0-9]{64}|[a-z][a-z0-9-]{0,63}-[a-f0-9]{64})\.json$/;
const SAFE_GOAL_ID_SEGMENT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/;
const SAFE_ARCHIVE_FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,254}$/;
const LOCK_RETRY_MS = 10;
const LOCK_TIMEOUT_MS = 10_000;
const LOCK_STALE_MS = 120_000;
const LOCK_WAIT_BUFFER = new Int32Array(new SharedArrayBuffer(4));

const DEFAULT_MAX_OBJECTIVE_CHARS = 4000;
const DEFAULT_MAX_GOAL_PROMPT_CHARS = 4000;
const DEFAULT_MAX_INJECTION_CHARS = 4800;
const DEFAULT_MAX_REASON_CHARS = 280;
const DEFAULT_MAX_EVIDENCE_CHARS = 1200;
const MIN_PROMPT_BUDGET_CHARS = 3;
const GOAL_ID_MAX_CHARS = 160;
const PROMPT_OVERHEAD_CHARS = 1900;
const OBJECTIVE_PREVIEW_RATIO = 0.12;
const OBJECTIVE_PREVIEW_MIN_CHARS = 60;
const OBJECTIVE_PREVIEW_MAX_CHARS = 600;

const VALID_STATUSES = new Set(['active', 'paused', 'completed', 'cleared']);
const ACTIONS = [
  'set',
  'show',
  'clear',
  'complete',
  'pause',
  'resume',
  'history',
  'doctor',
  'health',
  'legacy-inspect',
  'legacy-migrate',
  'legacy-archive',
];
const USAGE_SOURCE = 'turn-count-estimate';

// Ported from mk-goal: folds visually-confusable Cyrillic/Greek letters back to
// Latin before the role-token guard runs, so `аssistant:` cannot dodge redaction.
const ROLE_HOMOGLYPHS = Object.freeze({
  а: 'a', е: 'e', і: 'i', о: 'o', р: 'p', с: 'c', ѕ: 's', у: 'y',
  Α: 'A', Β: 'B', Ε: 'E', Ζ: 'Z', Η: 'H', Ι: 'I', Κ: 'K', Μ: 'M',
  Ν: 'N', Ο: 'O', Ρ: 'P', Τ: 'T', Χ: 'X',
  α: 'a', β: 'b', ε: 'e', η: 'n', ι: 'i', κ: 'k', ο: 'o', ρ: 'p', τ: 't', χ: 'x',
});

const VERIFIER_STOPWORDS = new Set([
  'about', 'after', 'against', 'before', 'build', 'change', 'complete', 'create',
  'done', 'execute', 'finish', 'fix', 'from', 'goal', 'implement', 'into', 'make',
  'mission', 'phase', 'that', 'this', 'update', 'with', 'work',
]);

// Ported verbatim from mk-goal's default heuristic supervisor verifier patterns.
const VERIFIER_BLOCKING_PATTERN = /\b(blocked?|blocker|error|failed|failing|failure|cannot|can't|unable|todo|not yet|partial(?:ly)?|still need(?:s)?|incomplete|not complete|not done|waiting|pending)\b/i;
const VERIFIER_COMPLETION_PATTERN = /\b(done|completed?|finished|implemented|fixed|resolved|delivered|shipped|verified|validated|tests? passed|checks? passed|passing)\b/i;

class GoalError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'GoalError';
    this.code = code;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ENV + PATH RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/** Fail-open check for the shared kill switch honored by every action. */
function isPluginDisabled(env = process.env) {
  return !isHookEnabled('goal', env);
}

/**
 * Walk up from `startDir` looking for a repo root marker (`.git` or the
 * `.opencode` skills tree). Falls back to `startDir` when nothing is found.
 */
function resolveRepoRoot(startDir = process.cwd()) {
  let dir = resolve(startDir);
  for (let depth = 0; depth < 40; depth += 1) {
    if (existsSync(join(dir, '.git')) || existsSync(join(dir, '.opencode', 'skills'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(startDir);
}

/**
 * Resolve the workspace state directory. Precedence: explicit `stateDir` option,
 * then `MK_GOAL_STATE_DIR` env override (tests use this to avoid touching the
 * real `.goal-state/` tree), then the default path under the resolved repo root.
 */
function resolveStateDir(rawOptions = {}) {
  const explicit = typeof rawOptions.stateDir === 'string' && rawOptions.stateDir.trim();
  if (explicit) return resolve(explicit.trim());
  const envDir = typeof process.env[STATE_DIR_ENV] === 'string' && process.env[STATE_DIR_ENV].trim();
  if (envDir) return resolve(envDir.trim());
  const explicitWorkspace = rawOptions.scope?.workspace ?? rawOptions.workspace;
  const workspaceStart = typeof explicitWorkspace === 'string' && explicitWorkspace.trim()
    ? explicitWorkspace.trim()
    : rawOptions.cwd || process.cwd();
  const repoRoot = resolveRepoRoot(workspaceStart);
  return join(repoRoot, STATE_SUBDIR);
}

function normalizeRuntimeNamespace(value) {
  const runtime = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!runtime) throw new GoalError('MISSING_RUNTIME', 'Runtime scope is required');
  if (!RUNTIME_NAMESPACE_PATTERN.test(runtime)) {
    throw new GoalError('INVALID_RUNTIME', 'Runtime scope must use lowercase letters, digits, or hyphens');
  }
  return runtime;
}

/**
 * Resolve validated workspace/runtime/session identity into opaque storage paths.
 *
 * @param {Object} [rawOptions={}] - Core options containing a composite scope.
 * @returns {Readonly<Object>} Validated identity and per-session state paths.
 * @throws {GoalError} When the runtime or native session identity is invalid.
 */
function resolveGoalScope(rawOptions = {}) {
  const rawScope = rawOptions.scope && typeof rawOptions.scope === 'object' ? rawOptions.scope : {};
  const sessionId = typeof rawScope.sessionId === 'string' ? rawScope.sessionId : '';
  if (!sessionId.trim()) throw new GoalError('MISSING_SESSION_ID', 'Session identity is required');
  if (sessionId.length > MAX_SESSION_ID_CHARS) {
    throw new GoalError('INVALID_SESSION_ID', 'Session identity exceeds the supported length');
  }

  const runtime = normalizeRuntimeNamespace(rawScope.runtime);
  const rawWorkspace = rawScope.workspace ?? rawOptions.workspace;
  const workspaceStart = typeof rawWorkspace === 'string' && rawWorkspace.trim()
    ? rawWorkspace.trim()
    : rawOptions.cwd || process.cwd();
  const workspace = resolveRepoRoot(workspaceStart);
  const stateDir = resolveStateDir({ ...rawOptions, scope: { ...rawScope, workspace } });
  const sessionDigest = createHash('sha256').update(sessionId, 'utf8').digest('hex');
  const legacyScopeKey = `${runtime}-${sessionDigest}`;
  const scopeKey = createHash('sha256')
    .update(JSON.stringify([workspace, runtime, sessionId]), 'utf8')
    .digest('hex');
  const workspaceStateDir = join(workspace, STATE_SUBDIR);
  const canAdoptLegacyScope = resolve(stateDir) === resolve(workspaceStateDir);
  return Object.freeze({
    workspace,
    runtime,
    sessionDigest,
    scopeKey,
    legacyScopeKey,
    stateDir,
    statePath: join(stateDir, `${scopeKey}.json`),
    archiveDir: join(stateDir, ARCHIVE_SUBDIR, scopeKey),
    legacyScopedStatePath: canAdoptLegacyScope ? join(stateDir, `${legacyScopeKey}.json`) : null,
    legacyScopedArchiveDir: canAdoptLegacyScope ? join(stateDir, ARCHIVE_SUBDIR, legacyScopeKey) : null,
  });
}

function statePath(rawOptions = {}) {
  return resolveGoalScope(rawOptions).statePath;
}

function archiveDir(rawOptions = {}) {
  return resolveGoalScope(rawOptions).archiveDir;
}

function legacyStatePath(rawOptions = {}) {
  return join(resolveStateDir(rawOptions), LEGACY_STATE_FILENAME);
}

function legacyArchiveDir(rawOptions = {}) {
  return join(resolveStateDir(rawOptions), ARCHIVE_SUBDIR, LEGACY_ARCHIVE_SUBDIR);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TEXT HARDENING (ported from mk-goal normalizeUserAuthoredText)
// ─────────────────────────────────────────────────────────────────────────────

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

/**
 * Prompt-injection hardening ported from mk-goal: NFKC-normalize, strip
 * bidi/zero-width control characters, redact any user-authored attempt to
 * forge the `[active_goal]` markers, downgrade fenced code blocks, fold
 * homoglyph role tokens, and redact common instruction-override phrasing.
 */
function normalizeUserAuthoredText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[​-‏‪-‮⁠-⁯﻿]/g, '')
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
    .replace(/\bBearer\s+[A-Za-z0-9._-]{20,}\b/gi, '[secret-redacted]')
    .replace(/\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[secret-redacted]')
    .replace(/\b(sk-[A-Za-z0-9_-]{8,})\b/g, '[secret-redacted]')
    .replace(/\b(gh[pousr]_[A-Za-z0-9_]{12,})\b/g, '[secret-redacted]')
    .replace(/\b(api[_-]?key|token|password|secret)\s*[:=]\s*['"]?[^'"\s,;]+/gi, '$1=[secret-redacted]');
  return sanitizeInlineText(text, maxChars);
}

function normalizeGoalID(value) {
  const normalized = sanitizeInlineText(value, GOAL_ID_MAX_CHARS).replace(/\s+/g, '-');
  if (SAFE_GOAL_ID_SEGMENT_PATTERN.test(normalized)) return normalized;
  const digest = createHash('sha256').update(String(value ?? ''), 'utf8').digest('hex');
  return `goal-${digest}`;
}

function quoteValue(value) {
  return JSON.stringify(String(value ?? ''));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GOAL PROMPT (RICCE skeleton, parameterized Role line)
// ─────────────────────────────────────────────────────────────────────────────

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

/**
 * Build the RICCE goalPrompt skeleton, ported from mk-goal's
 * `buildEnhancedGoalPrompt` with the Role line parameterized per runtime
 * (mk-goal hardcodes "OpenCode execution agent").
 */
function buildGoalPrompt(objective, rawOptions = {}) {
  const runtimeLabel = sanitizeInlineText(rawOptions.runtimeLabel || 'cross-runtime', 60) || 'cross-runtime';
  const maxGoalPromptChars = Number.isFinite(rawOptions.maxGoalPromptChars) ? rawOptions.maxGoalPromptChars : DEFAULT_MAX_GOAL_PROMPT_CHARS;
  const maxObjectiveChars = Number.isFinite(rawOptions.maxObjectiveChars) ? rawOptions.maxObjectiveChars : DEFAULT_MAX_OBJECTIVE_CHARS;
  const rawObjective = sanitizeInlineText(objective, maxObjectiveChars);
  const objectiveBudget = Math.max(240, Math.min(1200, maxGoalPromptChars - PROMPT_OVERHEAD_CHARS));
  const objectiveSummary = clampText(rawObjective, objectiveBudget);
  const hints = goalFocusHints(rawObjective);
  return sanitizePromptText([
    `Role: Focused ${runtimeLabel} execution agent operating under the active session goal.`,
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
  ].join('\n'), maxGoalPromptChars);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RENDER (byte-compatible marker/field-line template)
// ─────────────────────────────────────────────────────────────────────────────

function calculateObjectivePreviewChars(maxInjectionChars) {
  return Math.max(
    OBJECTIVE_PREVIEW_MIN_CHARS,
    Math.min(OBJECTIVE_PREVIEW_MAX_CHARS, Math.floor(maxInjectionChars * OBJECTIVE_PREVIEW_RATIO)),
  );
}

/**
 * Render the passive `[active_goal]` steering block. Markers and field-line
 * labels (`status:`, `objective:`, `goal_prompt:`, `last_check:`, `usage:`,
 * `directive:`) match mk-goal's `renderGoalInjection` byte-for-byte; the
 * `usage:` line reports turn-count-estimate content honestly since no
 * native token feed exists outside OpenCode. Falls back to a compact block
 * (same shape as mk-goal's fallback) when over `maxChars`.
 */
function renderGoalBrief({ goal, runtimeLabel = 'cross-runtime', maxChars = DEFAULT_MAX_INJECTION_CHARS } = {}) {
  if (!goal || goal.status !== 'active') return '';
  const objectivePreviewLimit = calculateObjectivePreviewChars(maxChars);
  const objective = sanitizeInlineText(goal.objective, Math.min(DEFAULT_MAX_OBJECTIVE_CHARS, objectivePreviewLimit));
  // The Role line is baked at set time from the runtime that created the goal,
  // but the brief should name whichever runtime is reading it now. Relabel it
  // to the caller's runtime so a goal set in one CLI reads correctly in another.
  const safeRuntimeLabel = String(runtimeLabel).replace(/[^A-Za-z0-9 _-]/g, '').trim().slice(0, 40) || 'cross-runtime';
  const storedPrompt = sanitizePromptText(goal.goalPrompt || goal.objective, DEFAULT_MAX_GOAL_PROMPT_CHARS);
  const goalPrompt = storedPrompt.replace(
    /^Role: Focused .+? execution agent operating under the active session goal\./m,
    `Role: Focused ${safeRuntimeLabel} execution agent operating under the active session goal.`,
  );
  const reason = sanitizeInlineText(goal.lastVerifierReason || 'none', DEFAULT_MAX_REASON_CHARS) || 'none';
  const verdict = sanitizeInlineText(goal.lastVerifierVerdict || 'not_evaluated', 80) || 'not_evaluated';
  const tokenBudget = goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : String(goal.tokenBudget);
  const turnsUsed = Number.isFinite(goal.turnsUsed) ? Math.max(0, Math.trunc(goal.turnsUsed)) : 0;
  const startedAtMs = Number.isFinite(goal.startedAtMs) ? goal.startedAtMs : goal.createdAtMs;
  const timeUsedSeconds = Number.isFinite(startedAtMs) ? Math.max(0, Math.round((Date.now() - startedAtMs) / 1000)) : 0;
  const goalId = normalizeGoalID(goal.goalId);
  const directive = 'directive: Continue toward this objective. Before ending, run the goal verifier or explain why it is blocked.';

  const buildBlock = (promptText) => [
    `[active_goal:${goalId}]`,
    'status: active',
    `objective: ${objective}`,
    'goal_prompt:',
    promptText,
    `last_check: ${verdict} ; reason: ${reason}`,
    `usage: tokens n/a/${tokenBudget}; time ${timeUsedSeconds}s; iteration ${turnsUsed} (source: ${USAGE_SOURCE})`,
    directive,
    '[/active_goal]',
  ].join('\n');

  const promptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, maxChars - buildBlock('').length);
  const block = buildBlock(sanitizePromptText(goalPrompt, promptBudget));
  if (block.length <= maxChars) return block;

  const buildCompactBlock = (promptText) => [
    `[active_goal:${goalId}]`,
    'goal_prompt:',
    promptText,
    `last_check: ${verdict} ; reason: ${reason}`,
    directive,
    '[/active_goal]',
  ].join('\n');
  const compactPromptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, maxChars - buildCompactBlock('').length);
  return clampText(buildCompactBlock(sanitizePromptText(goalPrompt, compactPromptBudget)), maxChars);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. HEURISTIC VERIFIER (ported from mk-goal defaultHeuristicSupervisorVerifier)
// ─────────────────────────────────────────────────────────────────────────────

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

function verifierResult(verdict, reason, evidence, confidence) {
  return { verdict, reason, evidence, confidence, source: 'heuristic' };
}

/**
 * Heuristic goal verifier, ported from mk-goal's
 * `defaultHeuristicSupervisorVerifier`. Free-form assistant text can sound
 * conclusive while still describing a blocker, so ambiguous or mixed
 * evidence always stays open (`not-met`/`unclear`) rather than `met`.
 */
function verifyGoalHeuristic({ goal, transcriptText } = {}) {
  const safeEvidence = sanitizeInlineText(transcriptText || '', DEFAULT_MAX_EVIDENCE_CHARS);
  const safeObjective = sanitizeInlineText(goal?.objective || '', DEFAULT_MAX_OBJECTIVE_CHARS);

  if (safeEvidence.length < 24) {
    return verifierResult('unclear', 'Evidence is too short to prove completion', safeEvidence, 0);
  }
  if (VERIFIER_BLOCKING_PATTERN.test(safeEvidence)) {
    return verifierResult('not-met', 'Evidence includes blocking or incomplete-work language', safeEvidence, 0);
  }
  if (/\.\.\.$/.test(safeEvidence) || /\btruncated\b/i.test(safeEvidence)) {
    return verifierResult('unclear', 'Evidence appears truncated before it proves completion', safeEvidence, 0);
  }
  if (!VERIFIER_COMPLETION_PATTERN.test(safeEvidence)) {
    return verifierResult('unclear', 'Evidence lacks an explicit completion signal', safeEvidence, 0);
  }

  const keywords = objectiveKeywords(safeObjective);
  const requiredMatches = keywords.length >= 2 ? 2 : 1;
  if (keywords.length === 0 || countEvidenceKeywordMatches(safeEvidence, keywords) < requiredMatches) {
    return verifierResult('unclear', 'Evidence does not reference the goal objective specifically enough', safeEvidence, 0);
  }

  return verifierResult('met', 'Evidence gives an explicit completion signal tied to the goal objective', safeEvidence, 0.72);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ATOMIC STATE I/O (fail-open)
// ─────────────────────────────────────────────────────────────────────────────

function isPathWithin(basePath, candidatePath) {
  const relation = relative(basePath, candidatePath);
  return relation === '' || (!relation.startsWith(`..${sep}`) && relation !== '..' && !isAbsolute(relation));
}

function resolveArchiveTarget(archiveRoot, stateDir, filename) {
  if (!SAFE_ARCHIVE_FILENAME_PATTERN.test(filename)) {
    throw new GoalError('INVALID_ARCHIVE_PATH', 'Archive filename is not a safe path segment');
  }
  ensureDir(stateDir);
  ensureDir(archiveRoot);
  const realStateDir = realpathSync(stateDir);
  const realArchiveRoot = realpathSync(archiveRoot);
  if (!isPathWithin(realStateDir, realArchiveRoot)) {
    throw new GoalError('INVALID_ARCHIVE_PATH', 'Archive directory escapes the goal state root');
  }
  const targetPath = resolve(archiveRoot, filename);
  if (dirname(targetPath) !== resolve(archiveRoot)) {
    throw new GoalError('INVALID_ARCHIVE_PATH', 'Archive target escapes its archive namespace');
  }
  return targetPath;
}

function archiveFilenameForRecord(record) {
  const goalSegment = normalizeGoalID(record?.goalId);
  const recordDigest = createHash('sha256').update(JSON.stringify(record), 'utf8').digest('hex');
  return `active-goal-${goalSegment}-${recordDigest}.json`;
}

function lockNameDigest(name) {
  return createHash('sha256').update(String(name), 'utf8').digest('hex');
}

function acquireFileLock(stateDir, name) {
  const lockRoot = join(stateDir, LOCK_SUBDIR);
  mkdirSync(lockRoot, { recursive: true, mode: 0o700 });
  const lockPath = join(lockRoot, `${lockNameDigest(name)}.lock`);
  const deadlineMs = Date.now() + LOCK_TIMEOUT_MS;
  while (true) {
    try {
      mkdirSync(lockPath, { mode: 0o700 });
      return lockPath;
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        throw new GoalError('GOAL_LOCK_FAILED', `Failed to acquire goal-state lock: ${error.message}`);
      }
    }

    try {
      if (Date.now() - statSync(lockPath).mtimeMs > LOCK_STALE_MS) {
        rmdirSync(lockPath);
        continue;
      }
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
    }

    if (Date.now() >= deadlineMs) {
      throw new GoalError('GOAL_LOCK_TIMEOUT', 'Timed out waiting for a goal-state mutation lock');
    }
    Atomics.wait(LOCK_WAIT_BUFFER, 0, 0, LOCK_RETRY_MS);
  }
}

function withFileLocks(stateDir, names, operation) {
  const acquired = [];
  try {
    for (const name of [...new Set(names)].sort()) {
      acquired.push(acquireFileLock(stateDir, name));
    }
    return operation();
  } finally {
    for (const lockPath of acquired.reverse()) {
      try { rmdirSync(lockPath); } catch { /* a stale-lock reaper may already have removed it */ }
    }
  }
}

function adoptLegacyScopedState(goalScope) {
  if (!goalScope.legacyScopedStatePath || existsSync(goalScope.statePath)) return;
  try {
    renameSync(goalScope.legacyScopedStatePath, goalScope.statePath);
  } catch (error) {
    if (error?.code !== 'ENOENT' && error?.code !== 'EEXIST') throw error;
  }
  if (!goalScope.legacyScopedArchiveDir || existsSync(goalScope.archiveDir)) return;
  try {
    renameSync(goalScope.legacyScopedArchiveDir, goalScope.archiveDir);
  } catch (error) {
    if (error?.code !== 'ENOENT' && error?.code !== 'EEXIST') throw error;
  }
}

function withScopeMutation(rawOptions, operation) {
  const goalScope = resolveGoalScope(rawOptions);
  return withFileLocks(goalScope.stateDir, [`scope:${goalScope.scopeKey}`], () => {
    adoptLegacyScopedState(goalScope);
    return operation(goalScope);
  });
}

function ensureDir(dir) {
  try {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  } catch {
    // fail open: a mkdir race or permission wrinkle surfaces on the next write attempt
  }
}

/** Atomic temp+rename write at mode 0600, mirroring mk-goal's writeGoalAtomic. */
function writeJsonAtomic(targetPath, record) {
  ensureDir(dirname(targetPath));
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  let fd = null;
  try {
    fd = openSync(tempPath, 'w', 0o600);
    writeSync(fd, `${JSON.stringify(record, null, 2)}\n`, null, 'utf8');
    fsyncSync(fd);
    closeSync(fd);
    fd = null;
    renameSync(tempPath, targetPath);
    return true;
  } catch (error) {
    if (fd !== null) {
      try { closeSync(fd); } catch { /* already closed */ }
    }
    try { unlinkSync(tempPath); } catch { /* nothing to clean up */ }
    throw new GoalError('WRITE_GOAL_FAILED', `Failed to write goal state: ${error.message}`);
  }
}

/** Fail-open read: any missing file, invalid scope, or parse error returns null. */
function readGoalRecordForScope(goalScope) {
  for (const path of [goalScope.statePath, goalScope.legacyScopedStatePath].filter(Boolean)) {
    try {
      const raw = readFileSync(path, 'utf8');
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      continue;
    }
  }
  return null;
}

function readGoalRecord(rawOptions = {}) {
  try {
    return readGoalRecordForScope(resolveGoalScope(rawOptions));
  } catch {
    return null;
  }
}

/** Archive a terminal record before it is cleared/replaced, fail-open. */
function archiveGoalRecord(record, goalScope) {
  if (!record || !record.goalId) return;
  try {
    ensureDir(goalScope.archiveDir);
    const filename = archiveFilenameForRecord(record);
    const targetPath = resolveArchiveTarget(goalScope.archiveDir, goalScope.stateDir, filename);
    writeJsonAtomic(targetPath, record);
  } catch {
    // Archiving is best-effort; never block the mutation it precedes.
  }
}

function removeStateFile(goalScope) {
  for (const path of [goalScope.statePath, goalScope.legacyScopedStatePath].filter(Boolean)) {
    try {
      unlinkSync(path);
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw new GoalError('CLEAR_GOAL_FAILED', `Failed to clear goal state: ${error.message}`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. LEGACY SINGLETON QUARANTINE
// ─────────────────────────────────────────────────────────────────────────────

function inspectLegacyGoal(rawOptions = {}) {
  const path = legacyStatePath(rawOptions);
  try {
    const raw = readFileSync(path, 'utf8');
    const sizeBytes = Buffer.byteLength(raw, 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { present: true, status: 'malformed', path, goal: null, sizeBytes, raw };
    }
    const hasValidShape = parsed
      && typeof parsed === 'object'
      && !Array.isArray(parsed)
      && typeof parsed.goalId === 'string'
      && parsed.goalId.trim()
      && typeof parsed.objective === 'string'
      && parsed.objective.trim()
      && VALID_STATUSES.has(parsed.status);
    return hasValidShape
      ? { present: true, status: 'valid', path, goal: parsed, sizeBytes, raw }
      : { present: true, status: 'malformed', path, goal: null, sizeBytes, raw };
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return { present: false, status: 'absent', path, goal: null, sizeBytes: 0, raw: null };
    }
    return { present: true, status: 'unreadable', path, goal: null, sizeBytes: 0, raw: null };
  }
}

function resolveLegacyArchiveTarget(snapshot, rawOptions = {}) {
  const archiveRoot = legacyArchiveDir(rawOptions);
  const stateDir = resolveStateDir(rawOptions);
  const digest = createHash('sha256').update(snapshot.raw || '', 'utf8').digest('hex');
  const stem = snapshot.status === 'valid'
    ? `active-goal-${normalizeGoalID(snapshot.goal.goalId)}`
    : `active-goal-malformed-${digest}`;
  const primaryFilename = `${stem}.json`;
  const primaryPath = resolveArchiveTarget(archiveRoot, stateDir, primaryFilename);
  if (!existsSync(primaryPath)) {
    return { archiveRoot, archivePath: primaryPath, archiveFilename: primaryFilename, alreadyArchived: false };
  }
  try {
    if (readFileSync(primaryPath, 'utf8') === snapshot.raw) {
      return { archiveRoot, archivePath: primaryPath, archiveFilename: primaryFilename, alreadyArchived: true };
    }
  } catch {
    // A distinct fallback filename keeps an existing archive untouched.
  }
  const fallbackFilename = `${stem}-${digest}.json`;
  const fallbackPath = resolveArchiveTarget(archiveRoot, stateDir, fallbackFilename);
  if (existsSync(fallbackPath)) {
    try {
      if (readFileSync(fallbackPath, 'utf8') === snapshot.raw) {
        return {
          archiveRoot,
          archivePath: fallbackPath,
          archiveFilename: fallbackFilename,
          alreadyArchived: true,
        };
      }
    } catch {
      // The conflict below preserves both the source and existing archive.
    }
    throw new GoalError('LEGACY_ARCHIVE_CONFLICT', 'A different legacy archive already owns the content-derived path');
  }
  return {
    archiveRoot,
    archivePath: fallbackPath,
    archiveFilename: fallbackFilename,
    alreadyArchived: false,
  };
}

function quarantineLegacySnapshot(snapshot, rawOptions = {}) {
  const target = resolveLegacyArchiveTarget(snapshot, rawOptions);
  ensureDir(target.archiveRoot);
  if (target.alreadyArchived) {
    try {
      chmodSync(target.archivePath, 0o600);
      unlinkSync(snapshot.path);
    } catch (error) {
      throw new GoalError('LEGACY_ARCHIVE_FAILED', `Failed to quarantine legacy goal state: ${error.message}`);
    }
    return target;
  }

  try {
    renameSync(snapshot.path, target.archivePath);
    try {
      chmodSync(target.archivePath, 0o600);
    } catch (error) {
      try { renameSync(target.archivePath, snapshot.path); } catch { /* source remains preserved in quarantine */ }
      throw error;
    }
    return target;
  } catch (error) {
    if (error instanceof GoalError) throw error;
    throw new GoalError('LEGACY_ARCHIVE_FAILED', `Failed to quarantine legacy goal state: ${error.message}`);
  }
}

function migrateLegacyGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const goalScope = resolveGoalScope(rawOptions);
  return withFileLocks(goalScope.stateDir, ['legacy-singleton', `scope:${goalScope.scopeKey}`], () => {
    adoptLegacyScopedState(goalScope);
    const snapshot = inspectLegacyGoal(rawOptions);
    if (!snapshot.present) {
      return {
        migrated: false,
        reason: 'no_legacy_state',
        record: null,
        archiveFilename: null,
        archivePath: null,
      };
    }
    if (snapshot.status !== 'valid') {
      throw new GoalError('LEGACY_GOAL_MALFORMED', 'Legacy goal state is not a valid migratable record');
    }
    if (!['active', 'paused'].includes(snapshot.goal.status)) {
      throw new GoalError('LEGACY_GOAL_NOT_ACTIVE', 'Only active or paused legacy goals can migrate to a live session');
    }
    if (existsSync(goalScope.statePath)) {
      throw new GoalError('TARGET_SCOPE_OCCUPIED', 'The target session already has goal state');
    }

    const objective = sanitizeInlineText(snapshot.goal.objective, DEFAULT_MAX_OBJECTIVE_CHARS);
    if (!objective) throw new GoalError('LEGACY_GOAL_MALFORMED', 'Legacy goal objective is invalid');
    const nowMsValue = Date.now();
    const promptRuntimeLabel = rawOptions.runtimeLabel || goalScope.runtime;
    const baseRecord = buildNewRecord(
      objective,
      buildGoalPrompt(objective, { runtimeLabel: promptRuntimeLabel }),
      snapshot.goal.tokenBudget ?? null,
      goalScope.runtime,
      nowMsValue,
    );
    const record = {
      ...baseRecord,
      ...snapshot.goal,
      goalId: normalizeGoalID(snapshot.goal.goalId),
      objective,
      goalPrompt: buildGoalPrompt(objective, { runtimeLabel: promptRuntimeLabel }),
      status: snapshot.goal.status,
      runtime: goalScope.runtime,
      usageSource: snapshot.goal.usageSource || USAGE_SOURCE,
      updatedAt: isoFromMs(nowMsValue),
      updatedAtMs: nowMsValue,
      lastActivityAtMs: nowMsValue,
      revision: (Number.isFinite(snapshot.goal.revision) ? snapshot.goal.revision : 0) + 1,
      migrationSource: 'legacy-singleton',
      migratedAt: isoFromMs(nowMsValue),
      migratedAtMs: nowMsValue,
    };

    writeJsonAtomic(goalScope.statePath, record);
    try {
      const archive = quarantineLegacySnapshot(snapshot, rawOptions);
      return { migrated: true, reason: null, record, ...archive };
    } catch (error) {
      try { removeStateFile(goalScope); } catch { /* source record remains authoritative */ }
      throw error;
    }
  });
}

function archiveLegacyGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const stateDir = resolveStateDir(rawOptions);
  return withFileLocks(stateDir, ['legacy-singleton'], () => {
    const snapshot = inspectLegacyGoal(rawOptions);
    if (!snapshot.present) {
      return {
        archived: false,
        reason: 'no_legacy_state',
        status: 'absent',
        archiveFilename: null,
        archivePath: null,
      };
    }
    if (snapshot.status === 'unreadable') {
      throw new GoalError('LEGACY_GOAL_UNREADABLE', 'Legacy goal state cannot be read safely');
    }
    const archive = quarantineLegacySnapshot(snapshot, rawOptions);
    return { archived: true, reason: null, status: snapshot.status, ...archive };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. GOAL LIFECYCLE
// ─────────────────────────────────────────────────────────────────────────────

function isoFromMs(ms) {
  return new Date(ms).toISOString();
}

function buildNewRecord(objective, goalPrompt, tokenBudget, runtime, nowMsValue) {
  return {
    goalId: normalizeGoalID(`goal-${randomUUID()}`),
    objective,
    goalPrompt,
    status: 'active',
    tokenBudget: tokenBudget ?? null,
    createdAt: isoFromMs(nowMsValue),
    createdAtMs: nowMsValue,
    updatedAt: isoFromMs(nowMsValue),
    updatedAtMs: nowMsValue,
    revision: 1,
    lastVerifierVerdict: 'not_evaluated',
    lastVerifierReason: null,
    lastVerifierSource: null,
    turnsUsed: 0,
    startedAtMs: nowMsValue,
    lastActivityAtMs: nowMsValue,
    usageSource: USAGE_SOURCE,
    runtime: runtime || 'unknown',
  };
}

/**
 * Set or replace the active goal. Mirrors mk-goal's `setGoal` mutation
 * semantics: `refreshed` when the objective is unchanged on an
 * active/paused goal, `created` when no goal existed, `replaced` otherwise.
 */
function setGoal({ objective, tokenBudget = null, runtimeLabel = null } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const sanitizedObjective = sanitizeInlineText(objective, DEFAULT_MAX_OBJECTIVE_CHARS);
  if (!sanitizedObjective) throw new GoalError('INVALID_OBJECTIVE', 'Objective is required');

  return withScopeMutation(rawOptions, (goalScope) => {
    const current = readGoalRecordForScope(goalScope);
    const nowMsValue = Date.now();
    const promptRuntimeLabel = runtimeLabel || goalScope.runtime;
    let mutation = 'created';
    let record;

    if (current && current.objective === sanitizedObjective && (current.status === 'active' || current.status === 'paused')) {
      mutation = 'refreshed';
      const goalPrompt = buildGoalPrompt(sanitizedObjective, { runtimeLabel: promptRuntimeLabel });
      record = {
        ...current,
        status: 'active',
        goalPrompt,
        tokenBudget: tokenBudget ?? current.tokenBudget ?? null,
        startedAtMs: current.status === 'paused' ? nowMsValue : current.startedAtMs,
        updatedAt: isoFromMs(nowMsValue),
        updatedAtMs: nowMsValue,
        lastActivityAtMs: nowMsValue,
        revision: (current.revision || 0) + 1,
        runtime: goalScope.runtime,
      };
    } else {
      mutation = current ? 'replaced' : 'created';
      if (current) archiveGoalRecord(current, goalScope);
      const goalPrompt = buildGoalPrompt(sanitizedObjective, { runtimeLabel: promptRuntimeLabel });
      record = buildNewRecord(
        sanitizedObjective,
        goalPrompt,
        tokenBudget,
        goalScope.runtime,
        nowMsValue,
      );
    }

    writeJsonAtomic(goalScope.statePath, record);
    return { record, mutation };
  });
}

function requireCurrentGoal(goalScope) {
  const current = readGoalRecordForScope(goalScope);
  if (!current) throw new GoalError('GOAL_NOT_FOUND', 'No goal is set');
  return current;
}

/** Mark the goal completed, archive it, then remove the active state file. */
function completeGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const current = requireCurrentGoal(goalScope);
    const nowMsValue = Date.now();
    const record = {
      ...current,
      status: 'completed',
      updatedAt: isoFromMs(nowMsValue),
      updatedAtMs: nowMsValue,
      revision: (current.revision || 0) + 1,
    };
    archiveGoalRecord(record, goalScope);
    removeStateFile(goalScope);
    return record;
  });
}

/** Archive the goal as cleared, then remove the active state file. */
function clearGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const current = readGoalRecordForScope(goalScope);
    if (current) {
      const nowMsValue = Date.now();
      const record = {
        ...current,
        status: 'cleared',
        updatedAt: isoFromMs(nowMsValue),
        updatedAtMs: nowMsValue,
        revision: (current.revision || 0) + 1,
      };
      archiveGoalRecord(record, goalScope);
    }
    removeStateFile(goalScope);
    return null;
  });
}

function pauseGoal({ reason = '' } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const current = requireCurrentGoal(goalScope);
    if (current.status !== 'active') throw new GoalError('INVALID_STATUS_TRANSITION', `Cannot pause a goal in status ${current.status}`);
    const nowMsValue = Date.now();
    const record = {
      ...current,
      status: 'paused',
      pauseReason: sanitizeInlineText(reason, DEFAULT_MAX_REASON_CHARS) || null,
      updatedAt: isoFromMs(nowMsValue),
      updatedAtMs: nowMsValue,
      revision: (current.revision || 0) + 1,
    };
    writeJsonAtomic(goalScope.statePath, record);
    return record;
  });
}

function resumeGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const current = requireCurrentGoal(goalScope);
    if (current.status !== 'paused') throw new GoalError('INVALID_STATUS_TRANSITION', `Cannot resume a goal in status ${current.status}`);
    const nowMsValue = Date.now();
    const record = {
      ...current,
      status: 'active',
      pauseReason: null,
      updatedAt: isoFromMs(nowMsValue),
      updatedAtMs: nowMsValue,
      revision: (current.revision || 0) + 1,
    };
    writeJsonAtomic(goalScope.statePath, record);
    return record;
  });
}

/** Read the current record for display, or null. Never throws. */
function showGoal(rawOptions = {}) {
  return readGoalRecord(rawOptions);
}

/** Increment the turn counter and refresh activity time, fail-open. */
function recordTurn(_input = {}, rawOptions = {}) {
  try {
    if (isPluginDisabled()) return null;
    return withScopeMutation(rawOptions, (goalScope) => {
      const current = readGoalRecordForScope(goalScope);
      if (!current || current.status !== 'active') return null;
      const nowMsValue = Date.now();
      const record = {
        ...current,
        turnsUsed: (Number.isFinite(current.turnsUsed) ? current.turnsUsed : 0) + 1,
        lastActivityAtMs: nowMsValue,
        updatedAt: isoFromMs(nowMsValue),
        updatedAtMs: nowMsValue,
        revision: (current.revision || 0) + 1,
        runtime: goalScope.runtime,
      };
      writeJsonAtomic(goalScope.statePath, record);
      return record;
    });
  } catch {
    return null;
  }
}

function listArchivedGoals(rawOptions = {}) {
  try {
    const goalScope = resolveGoalScope(rawOptions);
    const archiveDirs = [...new Set([goalScope.archiveDir, goalScope.legacyScopedArchiveDir].filter(Boolean))];
    return archiveDirs.flatMap((dir) => {
      try {
        return readdirSync(dir, { withFileTypes: true })
          .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
          .map((entry) => {
            const filePath = join(dir, entry.name);
            try {
              const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
              const sizeBytes = statSync(filePath).size;
              return { filename: entry.name, goal: parsed, sizeBytes };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
      } catch {
        return [];
      }
    })
      .sort((a, b) => (b.goal.updatedAtMs || 0) - (a.goal.updatedAtMs || 0));
  } catch {
    return [];
  }
}

function countArchiveFiles(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) return count + countArchiveFiles(entryPath);
      return count + Number(entry.isFile() && entry.name.endsWith('.json'));
    }, 0);
  } catch {
    return 0;
  }
}

function countScopedArchiveFiles(stateDir) {
  const root = join(stateDir, ARCHIVE_SUBDIR);
  try {
    return readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && SCOPED_KEY_PATTERN.test(entry.name))
      .reduce((count, entry) => count + countArchiveFiles(join(root, entry.name)), 0);
  } catch {
    return 0;
  }
}

function doctorStats(rawOptions = {}) {
  const stateDir = resolveStateDir(rawOptions);
  const legacy = inspectLegacyGoal(rawOptions);
  let activeStateFileCount = 0;
  try {
    activeStateFileCount = readdirSync(stateDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && SCOPED_STATE_PATTERN.test(entry.name))
      .length;
  } catch {
    activeStateFileCount = 0;
  }
  return {
    stateDir,
    activeStateFileCount,
    archiveFileCount: countScopedArchiveFiles(stateDir),
    legacyStatePresent: legacy.present,
    legacyStateStatus: legacy.status,
    pluginDisabled: isPluginDisabled(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  GoalError,
  ACTIONS,
  DISABLED_ENV,
  STATE_DIR_ENV,
  isPluginDisabled,
  resolveRepoRoot,
  resolveStateDir,
  resolveGoalScope,
  statePath,
  archiveDir,
  legacyStatePath,
  legacyArchiveDir,
  normalizeUserAuthoredText,
  sanitizeInlineText,
  sanitizePromptText,
  redactEvidence,
  clampText,
  quoteValue,
  buildGoalPrompt,
  renderGoalBrief,
  verifyGoalHeuristic,
  setGoal,
  showGoal,
  clearGoal,
  completeGoal,
  pauseGoal,
  resumeGoal,
  recordTurn,
  listArchivedGoals,
  inspectLegacyGoal,
  migrateLegacyGoal,
  archiveLegacyGoal,
  doctorStats,
  writeJsonAtomic,
  readGoalRecord,
};
