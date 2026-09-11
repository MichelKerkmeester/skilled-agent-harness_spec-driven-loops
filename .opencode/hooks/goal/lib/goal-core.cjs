// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: goal-core (runtime-neutral)                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Persist isolated cross-runtime session goals and render the     ║
// ║          passive `[active_goal]` steering block injected into a model's ║
// ║          context. Ported from the OpenCode `opencode-goal` plugin's session   ║
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
const goalSlice = require('./goal-slice.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIR_ENV = 'OPENCODE_GOAL_STATE_DIR';
const DISABLED_ENV = 'OPENCODE_GOAL_PLUGIN_DISABLED';
const STATE_SUBDIR = '.opencode/skills/.state/goal';
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
  'bind',
  'unbind',
  'resent',
  'log',
  'packet',
  'packet-log',
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

// Ported from opencode-goal: folds visually-confusable Cyrillic/Greek letters back to
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

// Ported verbatim from opencode-goal's default heuristic supervisor verifier patterns.
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
 * then `OPENCODE_GOAL_STATE_DIR` env override (tests use this to avoid touching the
 * real `.state/goal/` tree), then the default path under the resolved repo root.
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
// 4. TEXT HARDENING (ported from opencode-goal normalizeUserAuthoredText)
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
 * Prompt-injection hardening ported from opencode-goal: NFKC-normalize, strip
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
 * Build the RICCE goalPrompt skeleton, ported from opencode-goal's
 * `buildEnhancedGoalPrompt` with the Role line parameterized per runtime
 * (opencode-goal hardcodes "OpenCode execution agent").
 */
function buildGoalPrompt(objective, rawOptions = {}) {
  const runtimeLabel = sanitizeInlineText(rawOptions.runtimeLabel || 'cross-runtime', 60) || 'cross-runtime';
  const maxGoalPromptChars = Number.isFinite(rawOptions.maxGoalPromptChars) ? rawOptions.maxGoalPromptChars : DEFAULT_MAX_GOAL_PROMPT_CHARS;
  const maxObjectiveChars = Number.isFinite(rawOptions.maxObjectiveChars) ? rawOptions.maxObjectiveChars : DEFAULT_MAX_OBJECTIVE_CHARS;
  const rawObjective = sanitizeInlineText(objective, maxObjectiveChars);
  const objectiveBudget = Math.max(240, Math.min(1200, maxGoalPromptChars - PROMPT_OVERHEAD_CHARS));
  // The criteria are carried as their own field beside this prompt, so naming
  // only the packet here keeps one copy instead of two and leaves the budget
  // to the part a reader cannot reconstruct.
  const objectiveSummary = clampText(
    sanitizeInlineText(goalSlice.splitObjectiveSlice(objective).headline, maxObjectiveChars),
    objectiveBudget,
  );
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

/**
 * Render the criteria block that follows the objective line.
 *
 * Criteria are the part of a goal that decides when work is done, and they sit
 * at the tail where any truncation lands first. Giving them their own labelled
 * lines keeps each one whole and lets a trimmed list say so, instead of running
 * them together into one sentence that a cut can end mid-requirement.
 *
 * @param {string[]} criteria - Ordered completion criteria.
 * @param {number} budgetChars - Characters available for the block.
 * @returns {string[]} Field lines, empty when there is nothing to show.
 */
function renderCriteriaField(criteria, budgetChars) {
  if (!Array.isArray(criteria) || criteria.length === 0) return [];
  const { shown, omitted } = goalSlice.selectCriteriaWithin(criteria, budgetChars);
  if (shown.length === 0) return [`criteria: ${criteria.length} in the goal file`];
  const lines = ['criteria:', ...shown.map((item) => `- ${sanitizeInlineText(item, DEFAULT_MAX_OBJECTIVE_CHARS)}`)];
  if (omitted > 0) lines.push(`- (${omitted} more in the goal file)`);
  return lines;
}

function calculateObjectivePreviewChars(maxInjectionChars) {
  return Math.max(
    OBJECTIVE_PREVIEW_MIN_CHARS,
    Math.min(OBJECTIVE_PREVIEW_MAX_CHARS, Math.floor(maxInjectionChars * OBJECTIVE_PREVIEW_RATIO)),
  );
}

/**
 * Render the passive `[active_goal]` steering block. Markers and field-line
 * labels (`status:`, `objective:`, `goal_prompt:`, `last_check:`, `usage:`,
 * `directive:`) match opencode-goal's `renderGoalInjection` byte-for-byte; the
 * `usage:` line reports turn-count-estimate content honestly since no
 * native token feed exists outside OpenCode. Falls back to a compact block
 * (same shape as opencode-goal's fallback) when over `maxChars`.
 */
function renderGoalBrief({ goal, runtimeLabel = 'cross-runtime', maxChars = DEFAULT_MAX_INJECTION_CHARS, workspace = null } = {}) {
  if (!goal || goal.status !== 'active') return '';
  // A bound session renders from the packet goal.md, never from a remembered
  // copy: the file is the source and the record only points at it. A bound
  // record whose document is gone is unbound and injects nothing.
  let objectiveSource = goal.objective;
  let promptSource = goal.goalPrompt || goal.objective;
  if (typeof goal.packetPath === 'string' && goal.packetPath) {
    const packet = resolvePacketGoal(goal, workspace);
    if (!packet) return '';
    objectiveSource = packet.objectiveSlice;
    promptSource = buildGoalPrompt(packet.objectiveSlice, { runtimeLabel });
  }
  const objectivePreviewLimit = calculateObjectivePreviewChars(maxChars);
  const split = goalSlice.splitObjectiveSlice(objectiveSource);
  const objective = sanitizeInlineText(split.headline, Math.min(DEFAULT_MAX_OBJECTIVE_CHARS, objectivePreviewLimit));
  const criteriaLines = renderCriteriaField(split.criteria, objectivePreviewLimit - objective.length);
  // The Role line is baked at set time from the runtime that created the goal,
  // but the brief should name whichever runtime is reading it now. Relabel it
  // to the caller's runtime so a goal set in one CLI reads correctly in another.
  const safeRuntimeLabel = String(runtimeLabel).replace(/[^A-Za-z0-9 _-]/g, '').trim().slice(0, 40) || 'cross-runtime';
  const storedPrompt = sanitizePromptText(promptSource, DEFAULT_MAX_GOAL_PROMPT_CHARS);
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
    ...criteriaLines,
    'goal_prompt:',
    promptText,
    `last_check: ${verdict} ; reason: ${reason}`,
    // Every label here is shared with the OpenCode plugin's renderer and
    // pinned by a parity test. The one intended difference is this line's
    // content: no runtime here exposes a native token feed, so the count is
    // honestly absent and the iteration is a turn estimate.
    `usage: tokens n/a/${tokenBudget}; time ${timeUsedSeconds}s; iteration ${turnsUsed} (source: ${USAGE_SOURCE})`,
    directive,
    '[/active_goal]',
  ].join('\n');

  const promptBudget = Math.max(MIN_PROMPT_BUDGET_CHARS, maxChars - buildBlock('').length);
  const block = buildBlock(sanitizePromptText(goalPrompt, promptBudget));
  if (block.length <= maxChars) return block;

  const buildCompactBlock = (promptText) => [
    `[active_goal:${goalId}]`,
    ...criteriaLines,
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
// 7. HEURISTIC VERIFIER (ported from opencode-goal defaultHeuristicSupervisorVerifier)
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
 * Heuristic goal verifier, ported from opencode-goal's
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

/** Atomic temp+rename write at mode 0600, mirroring opencode-goal's writeGoalAtomic. */
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
// 9b. PACKET BINDING (the packet goal.md is the source of the directive)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read the bound packet's goal document for a record. Null when the record is
 * unbound or the document is gone, and every caller treats null as unbound:
 * no injection, no fallback to a remembered objective.
 */
function resolvePacketGoal(record, workspace) {
  if (!record || typeof record.packetPath !== 'string' || !record.packetPath) return null;
  const root = typeof workspace === 'string' && workspace ? workspace : record.workspace;
  if (!root) return null;
  return goalSlice.readPacketGoal(root, record.packetPath);
}

// A packet lock is keyed on the packet's real path, so an alias and its
// target contend, and it lives under the workspace's own state root rather
// than whatever state dir a session was given, so two sessions that keep
// their records in different places still serialize their appends.
function packetLockName(packetRealPath) {
  return `packet:${createHash('sha256').update(packetRealPath, 'utf8').digest('hex')}`;
}

// The packet lock root is the workspace's own state directory, and it
// deliberately ignores the record-store override. Mutual exclusion over a file
// two sessions share cannot depend on where each session keeps its private
// records: honoring the override gives each session its own lock, and the
// appends interleave and lose rows. The lock belongs to the packet, and the
// packet belongs to the workspace.
function packetLockRoot(workspace) {
  return join(workspace, STATE_SUBDIR);
}

// A log row is table text: a pipe would split the row and an HTML comment
// could open or close an anchor, so both are neutralized before the write.
function sanitizeLogCell(value, maxChars) {
  return sanitizeInlineText(value, maxChars)
    .replace(/<!--/g, '<! --')
    .replace(/-->/g, '-- >')
    .replace(/\|/g, '/');
}

/** Atomic text write for a tracked document: temp, fsync, rename, default mode. */
function writeTextAtomic(targetPath, text) {
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  let fd = null;
  try {
    fd = openSync(tempPath, 'w');
    writeSync(fd, text, null, 'utf8');
    fsyncSync(fd);
    closeSync(fd);
    fd = null;
    renameSync(tempPath, targetPath);
  } catch (error) {
    if (fd !== null) {
      try { closeSync(fd); } catch { /* already closed */ }
    }
    try { unlinkSync(tempPath); } catch { /* nothing to clean up */ }
    throw new GoalError('WRITE_GOAL_FAILED', `Failed to write goal document: ${error.message}`);
  }
}

/**
 * Bind the session to a packet. The packet's goal.md becomes the directive;
 * the record keeps only the pointer, the operator copy derived from it, and
 * bookkeeping. Binding never guesses: the path must resolve inside the
 * workspace and the document must exist.
 */
function bindGoal({ packetPath, tokenBudget = null, runtimeLabel = null } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const packet = goalSlice.readPacketGoal(goalScope.workspace, packetPath);
    if (!packet) throw new GoalError('PACKET_GOAL_NOT_FOUND', 'No goal.md at that packet path inside the workspace');
    const current = readGoalRecordForScope(goalScope);
    const nowMsValue = Date.now();
    const promptRuntimeLabel = runtimeLabel || goalScope.runtime;
    const objective = sanitizeInlineText(packet.objectiveSlice, DEFAULT_MAX_OBJECTIVE_CHARS);
    const goalPrompt = buildGoalPrompt(packet.objectiveSlice, { runtimeLabel: promptRuntimeLabel });
    const base = current && (current.status === 'active' || current.status === 'paused')
      ? { ...current, status: 'active', revision: (current.revision || 0) + 1 }
      : buildNewRecord(objective, goalPrompt, tokenBudget, goalScope.runtime, nowMsValue);
    // A rebind to a different packet, or a bind over a terminal record, leaves
    // the prior record behind in the archive so history keeps it.
    if (current && (current.packetPath !== packet.packetPath || base !== current && current.status !== 'active' && current.status !== 'paused')) {
      archiveGoalRecord(current, goalScope);
    }
    const record = {
      ...base,
      objective,
      goalPrompt,
      tokenBudget: tokenBudget ?? base.tokenBudget ?? null,
      packetPath: packet.packetPath,
      workspace: goalScope.workspace,
      boundAtMs: nowMsValue,
      boundBy: goalScope.runtime,
      lastResentSliceHash: base.packetPath === packet.packetPath ? (base.lastResentSliceHash || null) : null,
      updatedAt: isoFromMs(nowMsValue),
      updatedAtMs: nowMsValue,
      lastActivityAtMs: nowMsValue,
      runtime: goalScope.runtime,
    };
    writeJsonAtomic(goalScope.statePath, record);
    return { record, packet, mutation: current ? 'rebound' : 'bound' };
  });
}

/** Drop the packet pointer. The record and its operator copy stay as they are. */
function unbindGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const current = requireCurrentGoal(goalScope);
    const nowMsValue = Date.now();
    const record = { ...current, updatedAt: isoFromMs(nowMsValue), updatedAtMs: nowMsValue, revision: (current.revision || 0) + 1 };
    delete record.packetPath;
    delete record.boundAtMs;
    delete record.boundBy;
    delete record.lastResentSliceHash;
    writeJsonAtomic(goalScope.statePath, record);
    return { record, mutation: 'unbound' };
  });
}

/**
 * Session-free read of a packet's goal document: what any runtime may show
 * without a session identity, because it binds nothing and writes nothing.
 * Returns null when the path escapes the workspace or has no goal document.
 */
function describePacketGoal(packetPath, rawOptions = {}) {
  const workspaceStart = typeof rawOptions.workspace === 'string' && rawOptions.workspace.trim()
    ? rawOptions.workspace.trim()
    : rawOptions.cwd || process.cwd();
  const workspace = resolveRepoRoot(workspaceStart);
  const packet = goalSlice.readPacketGoal(workspace, packetPath);
  if (!packet) return null;
  return {
    packetPath: packet.packetPath,
    nested: packet.nested,
    durableChars: packet.durableChars,
    budgetState: packet.budgetState,
    hash: packet.hash,
    chatSlice: packet.chatSlice,
    objectiveSlice: packet.objectiveSlice,
  };
}

/**
 * The one-line reminder a runtime appends to its injection while the operator
 * copy is behind the packet. It never blocks and never repeats a resend on its
 * own; it tells the agent to do both.
 */
function renderResendReminder(goal, workspace, options = {}) {
  if (!goal || goal.status !== 'active' || !resendPending(goal, workspace)) return '';
  return goalSlice.renderResendReminderText(goal.packetPath, options);
}

/**
 * Whether the operator's copy is behind the packet. True when the durable
 * slice hash differs from the one last resent; a log edit never changes it.
 */
function resendPending(record, workspace) {
  const packet = resolvePacketGoal(record, workspace);
  if (!packet) return false;
  return packet.hash !== (record.lastResentSliceHash || null);
}

/**
 * The truth about a record's packet: `unbound` when it never pointed at one,
 * `bound` when the document resolves, `missing` when the pointer is set but
 * the document is gone or escapes the workspace. Injection is silent in the
 * missing case, so the envelope must say why.
 */
function packetState(record, workspace) {
  if (!record || typeof record.packetPath !== 'string' || !record.packetPath) return 'unbound';
  return resolvePacketGoal(record, workspace) ? 'bound' : 'missing';
}

/** Record that the current durable slice was resent in chat, so the reminder stops. */
function noteResent(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  return withScopeMutation(rawOptions, (goalScope) => {
    const current = requireCurrentGoal(goalScope);
    const packet = resolvePacketGoal(current, goalScope.workspace);
    if (!packet) throw new GoalError('PACKET_GOAL_NOT_FOUND', 'The bound packet goal.md is missing');
    const nowMsValue = Date.now();
    const record = { ...current, lastResentSliceHash: packet.hash, updatedAt: isoFromMs(nowMsValue), updatedAtMs: nowMsValue };
    writeJsonAtomic(goalScope.statePath, record);
    return { record, packet, mutation: 'resent' };
  });
}

/**
 * Append one row to a packet goal's progress table without needing a session
 * record. The log is the only region tooling may write unprompted; it sits
 * below the durable slice, so the hash and the operator copy are untouched.
 * Serialized per packet on its real path, under the workspace's state root,
 * so two sessions appending at once cannot interleave whatever state dir
 * each keeps its record in. The OpenCode plugin calls this directly.
 */
function appendPacketLog({ workspace, packetPath, item, state = 'Done', evidence = '' } = {}) {
  const safeItem = sanitizeLogCell(item, 200);
  if (!safeItem) throw new GoalError('INVALID_LOG_ITEM', 'A log item is required');
  const safeState = sanitizeLogCell(state, 40) || 'Done';
  const safeEvidence = sanitizeLogCell(evidence, 400);
  const root = resolveRepoRoot(workspace || process.cwd());
  const packet = goalSlice.readPacketGoal(root, packetPath);
  if (!packet) throw new GoalError('PACKET_GOAL_NOT_FOUND', 'No goal.md at that packet path inside the workspace');
  return withFileLocks(packetLockRoot(root), [packetLockName(packet.packetRealPath)], () => {
    const bytes = readFileSync(packet.goalPath);
    const content = bytes.toString('utf8');
    // Node replacement-decodes invalid bytes instead of throwing, so writing
    // the decoded string back would silently rewrite the author's bytes as
    // U+FFFD. Refuse the row and leave the document exactly as it was: a goal
    // is authored text, and losing it to a progress note is the worse trade.
    if (!Buffer.from(content, 'utf8').equals(bytes)) {
      throw new GoalError('GOAL_NOT_UTF8', 'The goal document is not valid UTF-8; no row was appended');
    }
    const hashBefore = goalSlice.durableSliceHash(content);
    const logIndex = content.indexOf(goalSlice.LOG_ANCHOR);
    if (logIndex < 0) throw new GoalError('GOAL_LOG_MISSING', 'The goal document has no log anchor');
    const row = `| ${safeItem} | ${safeState} | ${safeEvidence} |`;
    const head = content.slice(0, logIndex);
    const tail = content.slice(logIndex);
    // A CRLF document keeps CRLF: the inserted row reuses the terminator the
    // file already uses, so one append never mixes line endings.
    const terminator = /\r\n/.test(content) ? '\r\n' : '\n';
    // The progress table is the first table in the log; its last row is where
    // a new row goes. Without a table the row lands right after the heading.
    const lines = tail.split(terminator);
    let insertAt = -1;
    let inTable = false;
    for (let index = 0; index < lines.length; index += 1) {
      const isRow = /^\|.*\|\s*$/.test(lines[index]);
      if (isRow) { inTable = true; insertAt = index; continue; }
      if (inTable) break;
    }
    if (insertAt < 0) {
      throw new GoalError('GOAL_LOG_MISSING', 'The goal log has no progress table to append to');
    }
    lines.splice(insertAt + 1, 0, row);
    const updated = head + lines.join(terminator);
    if (goalSlice.durableSliceHash(updated) !== hashBefore) {
      throw new GoalError('GOAL_LOG_WRITE_REFUSED', 'A log append must not change the durable slice');
    }
    writeTextAtomic(packet.goalPath, updated);
    return { packetPath: packet.packetPath, row };
  });
}

/** Append a log row against the session's bound packet. */
function appendGoalLog({ item, state = 'Done', evidence = '' } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const goalScope = resolveGoalScope(rawOptions);
  const current = readGoalRecordForScope(goalScope);
  const packet = resolvePacketGoal(current, goalScope.workspace);
  if (!packet) throw new GoalError('PACKET_GOAL_NOT_FOUND', 'No bound packet goal.md to log against');
  return appendPacketLog({ workspace: goalScope.workspace, packetPath: packet.packetPath, item, state, evidence });
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
 * Set or replace the active goal. Mirrors opencode-goal's `setGoal` mutation
 * semantics: `refreshed` when the objective is unchanged on an
 * active/paused goal, `created` when no goal existed, `replaced` otherwise.
 */
function setGoal({ objective, tokenBudget = null, runtimeLabel = null } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const sanitizedObjective = sanitizeInlineText(objective, DEFAULT_MAX_OBJECTIVE_CHARS);
  if (!sanitizedObjective) throw new GoalError('INVALID_OBJECTIVE', 'Objective is required');
  // A text objective past the cap is clamped, and a clamp is a silent loss of
  // whatever sat at the tail, which is where criteria live. Report it.
  const rawLength = String(objective || '').length;
  const truncated = rawLength > DEFAULT_MAX_OBJECTIVE_CHARS;

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
    return { record, mutation, truncated: truncated ? { rawLength, maxChars: DEFAULT_MAX_OBJECTIVE_CHARS } : null };
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
  bindGoal,
  unbindGoal,
  noteResent,
  resendPending,
  resolvePacketGoal,
  packetState,
  describePacketGoal,
  renderResendReminder,
  appendPacketLog,
  appendGoalLog,
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
