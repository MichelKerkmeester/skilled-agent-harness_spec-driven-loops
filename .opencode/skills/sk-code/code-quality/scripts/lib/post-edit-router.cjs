// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: post-edit-router core (runtime-neutral policy)                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: One path-dispatch table deciding which quality checker(s) run   ║
// ║          for an edited file, shared by the Claude PostToolUse hook and   ║
// ║          the OpenCode plugin so the two runtimes cannot drift on policy. ║
// ║          resolveDispatch() is a pure, side-effect-free path/string       ║
// ║          resolver (deterministic given the same inputs); runChecks()     ║
// ║          spawns the resolved checkers under a shared deadline and        ║
// ║          returns bounded, redacted findings. Neither function writes to  ║
// ║          stdout/stderr or throws -- every failure path (missing checker, ║
// ║          non-{0,1} exit, spawn error, exhausted deadline) resolves to no ║
// ║          finding so a bug here can never block the edit it observes.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { existsSync } = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Canonical checker paths (repo-relative). Pinned here so a future move of any
// checker script only requires a one-line update, not a per-runtime hunt.
// Comment-hygiene = sk-code/code-quality (not the older system-spec-kit/rules
// variant); placeholders = spec/ (rules/check-placeholders.sh is sourced-only,
// not CLI-invocable); links = rules/; frontmatter + flowchart canonical live
// under sk-doc.
const CHECKER_RELATIVE_PATHS = {
  commentHygiene: '.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh',
  flowchart: '.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh',
  frontmatterVersions: '.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh',
  placeholders: '.opencode/skills/system-spec-kit/scripts/spec/check-placeholders.sh',
  wikilinks: '.opencode/skills/system-spec-kit/scripts/rules/check-links.sh',
  distStaleness: '.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh',
};

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.py', '.sh', '.bash', '.jsonc']);
const EXCLUDED_DIR_SEGMENTS = new Set(['dist', 'node_modules', '.git']);
// Mirrors frontmatter-version.mjs's own SCOPE_SUBTREES so the router's match
// stays aligned with what the checker itself actually validates.
const SKILL_SCOPE_SUBTREES = new Set(['references', 'assets', 'feature_catalog', 'manual_testing_playbook']);
const SPEC_DOC_BASENAMES = new Set(['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md']);
const WIKILINKS_ENABLE_ENV = 'SPECKIT_VALIDATE_LINKS';

const DEFAULT_MAX_FINDING_CHARS = 2000;
const DEFAULT_MAX_FINDINGS = 20;

// Claude PostToolUse budget -- preserves the pre-existing Python hook's 9s
// host timeout with an 8s per-checker cap and a 0.5s minimum worth running.
const CLAUDE_HOOK_BUDGET_MS = 9000;
const CLAUDE_CHECKER_TIMEOUT_MS = 8000;
const CLAUDE_MIN_CHECKER_MS = 500;

// OpenCode's tool.execute.after has no host timeout wrapper, so the plugin
// self-imposes a tighter budget to keep a slow or hung checker from ever
// being perceived as blocking tool completion.
const OPENCODE_DEADLINE_MS = 4000;
const OPENCODE_CHECKER_TIMEOUT_MS = 3000;
const OPENCODE_MIN_CHECKER_MS = 300;

// Fallback defaults used only when a caller invokes runChecks without any of
// the runtime-specific budgets above (e.g. a bare unit test).
const DEFAULT_CHECKER_TIMEOUT_MS = 8000;
const DEFAULT_MIN_CHECKER_MS = 300;

// Redacts common secret-shaped assignments before any finding text is ever
// logged or printed. Scoped to keyworded assignments (api_key=, token:, ...)
// rather than any long string, so an ordinary hash or identifier in a
// checker's stdout is not needlessly mangled.
const SECRET_PATTERN = /((?:api[_-]?key|access[_-]?key|secret|token|password|passwd|bearer|authorization)\s*[:=]\s*)['"]?([A-Za-z0-9\-_.]{8,})['"]?/gi;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- path + scope resolution
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split an absolute file path into path segments relative to projectDir, or
 * null when the path cannot be expressed as a descendant of projectDir (an
 * empty relative path, or one that climbs above the root via `..`).
 */
function relativeSegments(absFilePath, projectDir) {
  const rel = path.relative(projectDir, absFilePath);
  if (!rel || rel === '.' || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return rel.split(path.sep);
}

/**
 * True when a relative-path-segment array names a file that is a "flowchart"
 * candidate for validate_flowchart.sh.
 *
 * Deliberately path-based only (filename contains "flowchart", or the file
 * lives under a create-flowchart skill's assets/ output dir) rather than also
 * sniffing file content for box-drawing glyphs as an OR clause. Measured
 * against this repo's real docs (e.g. system-spec-kit/ARCHITECTURE.md), a
 * generic box-drawing-glyph check false-positives on ordinary architecture
 * diagrams embedded in reference docs -- exactly the adversarial case this
 * router must not flag. Path-based matching resolves every named test case
 * with zero false positives.
 */
function isFlowchartCandidate(basename, segments) {
  if (/flowchart/i.test(basename)) return true;
  return segments.includes('create-flowchart') && segments.includes('assets');
}

/**
 * Resolve the versioned-skill-doc scope for frontmatter-versions: true when
 * the file is SKILL.md anywhere under a skill dir, README.md adjacent to a
 * SKILL.md, or any file under one of the in-scope subtrees. Mirrors
 * frontmatter-version.mjs's own classify()/inScope() so the router's match
 * stays aligned with what the checker itself actually validates.
 */
function isVersionedSkillDoc(absFilePath, basename, segments) {
  if (basename === 'SKILL.md') return true;
  if (basename === 'README.md') {
    return existsSync(path.join(path.dirname(absFilePath), 'SKILL.md'));
  }
  // segments = [skillName, ...rest, basename]; only the middle segments count.
  const restSegments = segments.slice(1, -1);
  return restSegments.some((seg) => SKILL_SCOPE_SUBTREES.has(seg));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISPATCH TABLE (runtime-neutral, deterministic, side-effect-free)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the ordered checker dispatch for one edited file. Returns at most
 * one entry -- the table is deliberately narrow and near-mutually-exclusive
 * so a typical edit fires 0-1 checkers, and rows are evaluated in priority
 * order so an overlapping path (e.g. a markdown file that is both a skill doc
 * and lives in a skill dir) resolves to exactly one checker, never two.
 *
 * @param {string} absFilePath - the edited file's path (absolute, or resolved
 *   against projectDir if relative)
 * @param {string} projectDir - project root the checker paths are joined to
 * @param {{ env?: NodeJS.ProcessEnv }} [opts]
 * @returns {Array<{ label: string, checkerPath: string, args: string[], surfaceRule: string, dedupeKey?: string }>}
 */
function resolveDispatch(absFilePath, projectDir, opts = {}) {
  try {
    if (typeof absFilePath !== 'string' || !absFilePath) return [];
    if (typeof projectDir !== 'string' || !projectDir) return [];
    const environment = opts.env || process.env;

    const resolvedFile = path.isAbsolute(absFilePath) ? absFilePath : path.resolve(projectDir, absFilePath);
    const segments = relativeSegments(resolvedFile, projectDir);
    if (!segments || segments.length === 0) return [];

    const ext = path.extname(resolvedFile).toLowerCase();
    const basename = path.basename(resolvedFile);
    const basenameLower = basename.toLowerCase();

    // Row 1: comment hygiene -- any in-scope source file outside dist/node_modules/.git.
    if (SOURCE_EXTENSIONS.has(ext) && !segments.some((seg) => EXCLUDED_DIR_SEGMENTS.has(seg))) {
      return [{
        label: 'comment-hygiene',
        checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.commentHygiene),
        args: [resolvedFile],
        surfaceRule: 'exit1-with-stdout',
      }];
    }

    if (ext !== '.md') return [];

    // Row 2: flowchart -- checked before the skill-doc row so a flowchart
    // asset living under a skill's assets/ subtree (in-scope for both rows)
    // resolves to the flowchart checker, not frontmatter-versions.
    if (isFlowchartCandidate(basename, segments)) {
      return [{
        label: 'flowchart',
        checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.flowchart),
        args: [resolvedFile],
        surfaceRule: 'exit1',
      }];
    }

    const underSkillsRoot = segments[0] === '.opencode' && segments[1] === 'skills' && segments.length >= 4;

    // Row 3: frontmatter-versions -- versioned skill doc, scoped by --skill.
    if (underSkillsRoot) {
      const skillName = segments[2];
      const skillRelativeSegments = segments.slice(2); // [skillName, ...rest, basename]
      if (isVersionedSkillDoc(resolvedFile, basename, skillRelativeSegments)) {
        return [{
          label: 'frontmatter-versions',
          checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.frontmatterVersions),
          args: ['--skill', skillName],
          surfaceRule: 'exit1',
          dedupeKey: `frontmatter:${skillName}`,
        }];
      }
    }

    // Row 4: placeholders -- spec-folder doc, scoped by the containing folder.
    if (SPEC_DOC_BASENAMES.has(basenameLower)) {
      const underSpecsDir = segments[0] === 'specs' || (segments[0] === '.opencode' && segments[1] === 'specs');
      if (underSpecsDir) {
        return [{
          label: 'placeholders',
          checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.placeholders),
          args: [path.dirname(resolvedFile)],
          surfaceRule: 'exit1',
        }];
      }
    }

    // Row 5: wikilinks -- opt-in only, scoped to the containing skill dir.
    // Bounded cost is the point: this is the heaviest checker (whole-tree
    // scan), so it stays default-off and only fires for markdown edits
    // already inside a skill directory.
    if (underSkillsRoot && String(environment[WIKILINKS_ENABLE_ENV]).toLowerCase() === 'true') {
      const skillName = segments[2];
      return [{
        label: 'wikilinks',
        checkerPath: path.join(projectDir, CHECKER_RELATIVE_PATHS.wikilinks),
        args: [path.join(projectDir, '.opencode', 'skills', skillName)],
        surfaceRule: 'exit1',
      }];
    }

    return [];
  } catch (_) {
    // Fail open: a resolver bug must never block the edit it observed.
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FINDING SHAPING -- bounding + redaction
// ─────────────────────────────────────────────────────────────────────────────

function redactSecrets(text) {
  if (typeof text !== 'string' || !text) return text;
  SECRET_PATTERN.lastIndex = 0;
  return text.replace(SECRET_PATTERN, (_match, prefix) => `${prefix}[REDACTED]`);
}

function truncateAndRedact(text, maxChars = DEFAULT_MAX_FINDING_CHARS) {
  if (typeof text !== 'string') return '';
  const redacted = redactSecrets(text);
  if (redacted.length <= maxChars) return redacted;
  return `${redacted.slice(0, maxChars)}\n... [truncated]`;
}

/**
 * Whether a checker's exit/stdout should surface a finding, per its own
 * surface convention. Every checker treats exit 1 as "violations found"; only
 * comment-hygiene additionally requires non-empty stdout (its historical
 * convention -- exit 1 with nothing to print means nothing to show).
 */
function shouldSurface(surfaceRule, exitCode, stdout) {
  if (exitCode !== 1) return false;
  if (surfaceRule === 'exit1-with-stdout') return typeof stdout === 'string' && stdout.trim().length > 0;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DEDUPE TRACKER -- per-skill-per-session suppression (caller-owned state)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a session-scoped dedupe tracker for entries carrying a `dedupeKey`
 * (currently only frontmatter-versions, keyed by skill). The tracker itself
 * holds no I/O -- callers own its lifetime, so the OpenCode plugin can keep
 * one alive for its whole process/session and the Claude adapter can simply
 * omit it (each invocation is a fresh process, so cross-invocation dedupe
 * would need persisted state; omitting it just means every invocation may
 * re-surface, which is a fail-open direction, never a fail-closed one).
 */
function createDedupeTracker() {
  const seen = new Set();
  return {
    shouldSurface(key) {
      if (typeof key !== 'string' || !key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    },
    reset() {
      seen.clear();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. RUN CHECKS -- spawn under a shared deadline, return bounded findings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a resolved dispatch list under a shared deadline. Spawns each checker
 * synchronously with a per-child timeout carved from the remaining budget,
 * in priority order, skipping any entry once the deadline is exhausted.
 * Every failure path (missing checker file, spawn error, timeout/signal kill,
 * exit code outside {0,1}) resolves to "no finding" for that entry -- this
 * function never throws and never writes to stdout/stderr.
 *
 * @param {Array<{label,checkerPath,args,surfaceRule,dedupeKey?}>} entries
 * @param {number} deadlineMs - total budget remaining for this call, ms
 * @param {{ perChildTimeoutMs?: number, minCheckerMs?: number, maxFindings?: number,
 *           dedupeTracker?: { shouldSurface(key: string): boolean }, cwd?: string }} [opts]
 * @returns {Array<{ label: string, exitCode: number, stdout: string }>}
 */
function runChecks(entries, deadlineMs, opts = {}) {
  const findings = [];
  try {
    if (!Array.isArray(entries) || entries.length === 0) return findings;
    // A finite, non-positive deadline means the shared budget is already
    // exhausted (an upstream caller carving a deadline down to 0 or below) --
    // that must resolve to zero work, not silently fall back to the default
    // timeout. Only an absent/non-finite deadline (caller didn't pass one)
    // uses the default.
    if (Number.isFinite(deadlineMs) && deadlineMs <= 0) return findings;

    const totalBudgetMs = Number.isFinite(deadlineMs) && deadlineMs > 0 ? deadlineMs : DEFAULT_CHECKER_TIMEOUT_MS;
    const perChildCapMs = Number.isFinite(opts.perChildTimeoutMs) ? opts.perChildTimeoutMs : DEFAULT_CHECKER_TIMEOUT_MS;
    const minCheckerMs = Number.isFinite(opts.minCheckerMs) ? opts.minCheckerMs : DEFAULT_MIN_CHECKER_MS;
    const maxFindings = Number.isFinite(opts.maxFindings) ? opts.maxFindings : DEFAULT_MAX_FINDINGS;
    const dedupeTracker = opts.dedupeTracker && typeof opts.dedupeTracker.shouldSurface === 'function'
      ? opts.dedupeTracker
      : null;

    const startedAt = Date.now();
    for (const entry of entries) {
      if (findings.length >= maxFindings) break;
      if (!entry || typeof entry.checkerPath !== 'string') continue;

      const remainingMs = totalBudgetMs - (Date.now() - startedAt);
      if (remainingMs < minCheckerMs) break; // deadline exhausted -- skip remaining entries

      if (dedupeTracker && entry.dedupeKey && !dedupeTracker.shouldSurface(entry.dedupeKey)) continue;
      if (!existsSync(entry.checkerPath)) continue; // fail-open: checker missing

      const timeoutMs = Math.max(minCheckerMs, Math.min(remainingMs, perChildCapMs));
      let result;
      try {
        result = spawnSync(entry.checkerPath, Array.isArray(entry.args) ? entry.args : [], {
          timeout: timeoutMs,
          encoding: 'utf8',
          cwd: typeof opts.cwd === 'string' ? opts.cwd : undefined,
        });
      } catch (_) {
        continue; // fail-open: spawn threw synchronously
      }
      if (!result || result.error) continue; // fail-open: ENOENT/EACCES/etc.
      const exitCode = result.status;
      if (exitCode === null || exitCode === undefined) continue; // killed by timeout/signal -- unavailable
      if (exitCode !== 0 && exitCode !== 1) continue; // non-{0,1} -- checker unavailable, not a finding

      if (!shouldSurface(entry.surfaceRule, exitCode, result.stdout)) continue;

      findings.push({
        label: entry.label || 'unknown',
        exitCode,
        stdout: truncateAndRedact(result.stdout || ''),
      });
    }
  } catch (_) {
    // Fail open on any unexpected internal error -- never surface a partial,
    // possibly-misleading finding set.
    return [];
  }
  return findings;
}

/**
 * Preserve the legacy dist-staleness coverage the Python PostToolUse hook
 * always ran alongside comment hygiene. Kept as its own entrypoint (not a
 * dispatch-table row) because it is unconditional per edited file rather than
 * path-matched, and because OpenCode already has independent dist-freshness
 * coverage via mk-dist-freshness-guard.js -- folding it into the shared table
 * would duplicate that plugin's own checks on every OpenCode edit.
 *
 * Always returns null on any failure path (missing checker, spawn error,
 * exhausted budget, empty stdout); the checker itself always exits 0.
 *
 * @param {string} absFilePath
 * @param {string} projectDir
 * @param {{ timeoutMs?: number }} [opts]
 * @returns {string|null}
 */
function runDistStalenessCheck(absFilePath, projectDir, opts = {}) {
  try {
    if (typeof absFilePath !== 'string' || !absFilePath) return null;
    const checkerPath = path.join(projectDir, CHECKER_RELATIVE_PATHS.distStaleness);
    if (!existsSync(checkerPath)) return null;

    const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : DEFAULT_CHECKER_TIMEOUT_MS;
    if (timeoutMs < DEFAULT_MIN_CHECKER_MS) return null;

    let result;
    try {
      result = spawnSync(checkerPath, [absFilePath], { timeout: timeoutMs, encoding: 'utf8' });
    } catch (_) {
      return null;
    }
    if (!result || result.error) return null;
    const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
    if (!stdout) return null;
    return truncateAndRedact(stdout);
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // constants
  CHECKER_RELATIVE_PATHS,
  SOURCE_EXTENSIONS,
  EXCLUDED_DIR_SEGMENTS,
  SKILL_SCOPE_SUBTREES,
  SPEC_DOC_BASENAMES,
  WIKILINKS_ENABLE_ENV,
  DEFAULT_MAX_FINDING_CHARS,
  DEFAULT_MAX_FINDINGS,
  CLAUDE_HOOK_BUDGET_MS,
  CLAUDE_CHECKER_TIMEOUT_MS,
  CLAUDE_MIN_CHECKER_MS,
  OPENCODE_DEADLINE_MS,
  OPENCODE_CHECKER_TIMEOUT_MS,
  OPENCODE_MIN_CHECKER_MS,
  // path/scope helpers (exposed for table-driven testing)
  relativeSegments,
  isFlowchartCandidate,
  isVersionedSkillDoc,
  // policy
  resolveDispatch,
  shouldSurface,
  createDedupeTracker,
  // I/O (spawns; never throws, never writes stdout/stderr)
  runChecks,
  runDistStalenessCheck,
  // finding shaping
  truncateAndRedact,
  redactSecrets,
};
