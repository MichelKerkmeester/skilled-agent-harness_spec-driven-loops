// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: goal-core (runtime-neutral)                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Persist a single cross-runtime session goal in a shared state   ║
// ║          file and render the passive `[active_goal]` steering block     ║
// ║          injected into a model's context. Ported from the OpenCode      ║
// ║          `mk-goal` plugin's per-session state machine, template, and    ║
// ║          prompt-injection hardening, generalized to a single shared     ║
// ║          record any runtime adapter (Devin, Cursor, Pi, or the manage   ║
// ║          CLI in this same folder) can read and write. This module never ║
// ║          writes stdout/stderr and never throws past its own boundary:   ║
// ║          every read/parse failure resolves to null/no-op so a state-    ║
// ║          file bug can never block the runtime it steers.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeSync,
} = require('node:fs');
const { dirname, join, resolve } = require('node:path');
const { randomUUID } = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STATE_DIR_ENV = 'MK_GOAL_STATE_DIR';
const DISABLED_ENV = 'MK_GOAL_PLUGIN_DISABLED';
const STATE_SUBDIR = '.opencode/skills/.goal-state';
const STATE_FILENAME = 'active-goal.json';
const ARCHIVE_SUBDIR = '.archive';

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
const ACTIONS = ['set', 'show', 'clear', 'complete', 'pause', 'resume', 'history', 'doctor', 'health'];
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
  return env?.[DISABLED_ENV] === '1';
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
 * Resolve the shared state directory. Precedence: explicit `stateDir` option,
 * then `MK_GOAL_STATE_DIR` env override (tests use this to avoid touching the
 * real `.goal-state/` tree), then the default path under the resolved repo root.
 */
function resolveStateDir(rawOptions = {}) {
  const explicit = typeof rawOptions.stateDir === 'string' && rawOptions.stateDir.trim();
  if (explicit) return resolve(explicit.trim());
  const envDir = typeof process.env[STATE_DIR_ENV] === 'string' && process.env[STATE_DIR_ENV].trim();
  if (envDir) return resolve(envDir.trim());
  const repoRoot = resolveRepoRoot(rawOptions.cwd || process.cwd());
  return join(repoRoot, STATE_SUBDIR);
}

function statePath(stateDir) {
  return join(stateDir, STATE_FILENAME);
}

function archiveDir(stateDir) {
  return join(stateDir, ARCHIVE_SUBDIR);
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
  return sanitizeInlineText(value, GOAL_ID_MAX_CHARS).replace(/\s+/g, '-');
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

/** Fail-open read: any missing file, parse error, or unreadable path returns null. */
function readGoalRecord(rawOptions = {}) {
  const stateDir = resolveStateDir(rawOptions);
  try {
    const raw = readFileSync(statePath(stateDir), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/** Archive a terminal record before it is cleared/replaced, fail-open. */
function archiveGoalRecord(record, rawOptions = {}) {
  if (!record || !record.goalId) return;
  const stateDir = resolveStateDir(rawOptions);
  const dir = archiveDir(stateDir);
  try {
    ensureDir(dir);
    writeJsonAtomic(join(dir, `active-goal-${normalizeGoalID(record.goalId)}.json`), record);
  } catch {
    // archiving is best-effort; never block the mutation it precedes
  }
}

function removeStateFile(rawOptions = {}) {
  const stateDir = resolveStateDir(rawOptions);
  try {
    unlinkSync(statePath(stateDir));
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw new GoalError('CLEAR_GOAL_FAILED', `Failed to clear goal state: ${error.message}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. GOAL LIFECYCLE
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
function setGoal({ objective, tokenBudget = null, runtime = 'unknown' } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const sanitizedObjective = sanitizeInlineText(objective, DEFAULT_MAX_OBJECTIVE_CHARS);
  if (!sanitizedObjective) throw new GoalError('INVALID_OBJECTIVE', 'Objective is required');

  const stateDir = resolveStateDir(rawOptions);
  const current = readGoalRecord(rawOptions);
  const nowMsValue = Date.now();
  let mutation = 'created';
  let record;

  if (current && current.objective === sanitizedObjective && (current.status === 'active' || current.status === 'paused')) {
    mutation = 'refreshed';
    const goalPrompt = buildGoalPrompt(sanitizedObjective, { runtimeLabel: runtime });
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
      runtime,
    };
  } else {
    mutation = current ? 'replaced' : 'created';
    if (current) archiveGoalRecord(current, rawOptions);
    const goalPrompt = buildGoalPrompt(sanitizedObjective, { runtimeLabel: runtime });
    record = buildNewRecord(sanitizedObjective, goalPrompt, tokenBudget, runtime, nowMsValue);
  }

  writeJsonAtomic(statePath(stateDir), record);
  return { record, mutation };
}

function requireCurrentGoal(rawOptions) {
  const current = readGoalRecord(rawOptions);
  if (!current) throw new GoalError('GOAL_NOT_FOUND', 'No goal is set');
  return current;
}

/** Mark the goal completed, archive it, then remove the active state file. */
function completeGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const current = requireCurrentGoal(rawOptions);
  const nowMsValue = Date.now();
  const record = { ...current, status: 'completed', updatedAt: isoFromMs(nowMsValue), updatedAtMs: nowMsValue };
  archiveGoalRecord(record, rawOptions);
  removeStateFile(rawOptions);
  return record;
}

/** Archive the goal as cleared, then remove the active state file. */
function clearGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const current = readGoalRecord(rawOptions);
  if (current) {
    const nowMsValue = Date.now();
    const record = { ...current, status: 'cleared', updatedAt: isoFromMs(nowMsValue), updatedAtMs: nowMsValue };
    archiveGoalRecord(record, rawOptions);
  }
  removeStateFile(rawOptions);
  return null;
}

function pauseGoal({ reason = '' } = {}, rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const current = requireCurrentGoal(rawOptions);
  if (current.status !== 'active') throw new GoalError('INVALID_STATUS_TRANSITION', `Cannot pause a goal in status ${current.status}`);
  const nowMsValue = Date.now();
  const record = {
    ...current,
    status: 'paused',
    pauseReason: sanitizeInlineText(reason, DEFAULT_MAX_REASON_CHARS) || null,
    updatedAt: isoFromMs(nowMsValue),
    updatedAtMs: nowMsValue,
  };
  writeJsonAtomic(statePath(resolveStateDir(rawOptions)), record);
  return record;
}

function resumeGoal(rawOptions = {}) {
  if (isPluginDisabled()) throw new GoalError('PLUGIN_DISABLED', `${DISABLED_ENV}=1 disables goal core execution`);
  const current = requireCurrentGoal(rawOptions);
  if (current.status !== 'paused') throw new GoalError('INVALID_STATUS_TRANSITION', `Cannot resume a goal in status ${current.status}`);
  const nowMsValue = Date.now();
  const record = {
    ...current,
    status: 'active',
    pauseReason: null,
    updatedAt: isoFromMs(nowMsValue),
    updatedAtMs: nowMsValue,
  };
  writeJsonAtomic(statePath(resolveStateDir(rawOptions)), record);
  return record;
}

/** Read the current record for display, or null. Never throws. */
function showGoal(rawOptions = {}) {
  return readGoalRecord(rawOptions);
}

/** Increment the turn counter and refresh activity time, fail-open. */
function recordTurn({ runtime = 'unknown' } = {}, rawOptions = {}) {
  try {
    if (isPluginDisabled()) return null;
    const current = readGoalRecord(rawOptions);
    if (!current || current.status !== 'active') return null;
    const nowMsValue = Date.now();
    const record = {
      ...current,
      turnsUsed: (Number.isFinite(current.turnsUsed) ? current.turnsUsed : 0) + 1,
      lastActivityAtMs: nowMsValue,
      updatedAt: isoFromMs(nowMsValue),
      updatedAtMs: nowMsValue,
      runtime,
    };
    writeJsonAtomic(statePath(resolveStateDir(rawOptions)), record);
    return record;
  } catch {
    return null;
  }
}

function listArchivedGoals(rawOptions = {}) {
  const stateDir = resolveStateDir(rawOptions);
  const dir = archiveDir(stateDir);
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
      .filter(Boolean)
      .sort((a, b) => (b.goal.updatedAtMs || 0) - (a.goal.updatedAtMs || 0));
  } catch {
    return [];
  }
}

function doctorStats(rawOptions = {}) {
  const stateDir = resolveStateDir(rawOptions);
  const active = readGoalRecord(rawOptions);
  const archived = listArchivedGoals(rawOptions);
  return {
    stateDir,
    activeStateFileCount: active ? 1 : 0,
    archiveFileCount: archived.length,
    pluginDisabled: isPluginDisabled(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  GoalError,
  ACTIONS,
  DISABLED_ENV,
  STATE_DIR_ENV,
  isPluginDisabled,
  resolveRepoRoot,
  resolveStateDir,
  statePath,
  archiveDir,
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
  doctorStats,
  writeJsonAtomic,
  readGoalRecord,
};
