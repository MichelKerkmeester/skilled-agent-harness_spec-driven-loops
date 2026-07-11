#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-git.cjs — deep-alignment sk-git authority adapter                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Implements the three-method adapter contract for the sk-git              ║
// ║ authority: discover(scope), standardSource(authority), check(artifact,   ║
// ║ rules). Shape copied from the reference adapter (sk-doc.cjs);            ║
// ║ content is sk-git's own (100% deterministic, single-layer).              ║
// ║                                                                          ║
// ║ Full specification: ../../references/adapters/sk_git_adapter.md          ║
// ║ Suppression list:    ../../references/adapters/sk_git_known_deviations.md║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * sk-git.cjs — wraps real `git` commands (log, show, diff-tree, branch,
 * worktree) plus a line-cited port of `.opencode/scripts/git-hooks/commit-msg`'s
 * structural grammar, behind the deep-alignment adapter contract. Checks two
 * dimensions: conventional-commit message grammar, and `wt/{NNNN}-{name}`
 * branch-naming conformance for worktree-created branches.
 *
 * discover(scope) takes the real, live scope shape from
 * ../../references/discover_contract.md §3 / ../../references/lane_config_schema.md §5.
 * sk-git's registered artifact-class is `git-history`, which pairs with a
 * `branchRange` scope (`{type:'branchRange', from, to}`); a `paths`/`globs`
 * scope resolves to an empty result — see discover()'s own comment for why.
 *
 * Module usage:
 *   const adapter = require('./sk-git.cjs');
 *   const { artifacts, nodes } = adapter.discover({ type: 'branchRange', from: 'main', to: 'HEAD' });
 *   const rules = adapter.standardSource('sk-git');
 *   const findings = adapter.check(artifacts[0], rules);
 *
 * CLI usage (manual dry-run, no engine wiring required):
 *   node sk-git.cjs discover <from> <to>
 *   node sk-git.cjs check --commit <sha>
 *   node sk-git.cjs check --branch <name>
 *   node sk-git.cjs standard-source
 *
 * Examples:
 *   node sk-git.cjs discover HEAD~5 HEAD
 *   node sk-git.cjs check --commit 7ea5cfb7c14103ca621601dd2f03508bc36209e2
 *   node sk-git.cjs check --branch wt/0001-mcp-front-proxy
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors sk-doc.cjs's own SKILLS_DIR computation (4 levels up from a
// mode-packet's scripts/<subdir>/*.cjs file).
const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..'); // .opencode/skills
const REPO_ROOT = path.resolve(SKILLS_DIR, '..', '..'); // repo root

const SK_GIT_DIR = path.join(SKILLS_DIR, 'sk-git');
const SK_GIT_SKILL_MD = path.join(SK_GIT_DIR, 'SKILL.md');
const COMMIT_MSG_HOOK = path.join(REPO_ROOT, '.opencode', 'scripts', 'git-hooks', 'commit-msg');
const KNOWN_DEVIATIONS_MD = path.resolve(__dirname, '..', '..', 'references', 'adapters', 'sk_git_known_deviations.md');

// Ported verbatim from .opencode/scripts/git-hooks/commit-msg:44-48's case
// statement, and confirmed identical to SKILL.md:322-323's exemption list
// ("Classify Special Git Messages"). Order does not matter; each is an
// independent prefix test.
const EXEMPT_SUBJECT_PATTERNS = [
  /^Merge /,
  /^Revert "/,
  /^fixup! /,
  /^squash! /,
  /^amend! /,
];

// Ported verbatim from .opencode/scripts/git-hooks/commit-msg:72 (SUBJECT_RE).
const SUBJECT_RE = /^(build|chore|ci|docs|feat|fix|merge|perf|refactor|release|revert|style|test)\(([a-z0-9]+(?:-[a-z0-9]+)*)\)(!)?: (.+)$/;

// Ported verbatim from commit-msg:96-100's vague-summary `case` list.
const VAGUE_SUMMARIES = new Set([
  'change files', 'changes', 'checkpoint', 'cleanup', 'fix', 'fix bug', 'misc',
  'misc changes', 'miscellaneous changes', 'stuff', 'update', 'update files',
  'update stuff', 'various changes', 'work in progress', 'wip',
]);

// Ported from commit-msg:102 (PROCESS_LABEL_RE) — a WARNING, not an ERROR.
const PROCESS_LABEL_RE = /(Phase[ ][A-Z0-9]|wave[ ][+A-Za-z0-9]|Lane[ ][A-Z]|[0-9]+[ ]tasks?|swarm|tranche|WU[0-9]+)/;

// Ported from commit-msg:91 (TRAILING_PUNCT_RE) and commit-msg:120 (BREAKING_FOOTER_RE).
const TRAILING_PUNCT_RE = /[.!?;:,]$/;
const BREAKING_FOOTER_RE = /^BREAKING CHANGE: .+$/m;

// Ported from commit-msg:119 (TRAILER_RE) — trailer lines never count toward
// "explanatory body" for the body-required-if->=4-files rule.
const TRAILER_RE = /^((Co-Authored-By|Signed-off-by|Reviewed-by|Tested-by|Refs)(:|\s)|(Fixes|Closes|Related to)\s)/;

const SUBJECT_MAX_HARD = 100; // commit-msg:111
const SUBJECT_MAX_SOFT = 80; // commit-msg:113
const BODY_MIN_FILES_FOR_REQUIRED_BODY = 4; // commit-msg:155 (re-derived from historical diff-tree — see checkCommitGrammar's own comment)

// wt/{NNNN}-{name} numbered namespace, SKILL.md:298.
const WT_BRANCH_RE = /^wt\/(\d{4})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

// Launch-wrapper ephemeral per-session worktree branches, SKILL.md:298's own
// parenthetical: "work/{runtime}/{slug}" ... "auto-managed, auto-reaped, and
// intentionally not numbered". Exempt from the numbered-namespace rule by
// design — see sk_git_known_deviations.md Section 2.
const LAUNCH_WRAPPER_BRANCH_RE = /^work\//;

const GIT_TIMEOUT_MS = 30000;
const MAX_BUFFER = 8 * 1024 * 1024;

// Hook-installation cutover point (see sk_git_known_deviations.md Section 3
// for the full evidence trail). Hardcoded as a policy constant, mirroring
// sk-doc.cjs's DQI_FLOOR pattern — an authored commit's date is immutable
// once made, so re-deriving this via a live `git log` subprocess on every
// check() call would add latency for a value that cannot change.
const HOOK_INSTALL_COMMIT_SHA = '7ea5cfb7c14103ca621601dd2f03508bc36209e2';
const HOOK_INSTALL_DATE = '2026-07-10T15:17:16+02:00';

// ─────────────────────────────────────────────────────────────────────────────
// 3. GIT SUBPROCESS WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a `git` subcommand against the repo root and capture its result.
 * @param {string[]} args
 * @returns {{ok:boolean, stdout:string, stderr:string, status:number|null, adapterError:string|null}}
 */
function runGit(args) {
  const res = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
    maxBuffer: MAX_BUFFER,
  });
  if (res.error) {
    return { ok: false, stdout: '', stderr: '', status: null, adapterError: res.error.message };
  }
  return {
    ok: res.status === 0,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    status: res.status,
    adapterError: res.status === 0 ? null : (res.stderr || `git ${args[0]} exited ${res.status}`),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVER(SCOPE)
// ─────────────────────────────────────────────────────────────────────────────

function discoverCommits(from, to) {
  const res = runGit(['log', '--pretty=format:%H', `${from}..${to}`]);
  if (!res.ok) return [];
  return res.stdout.split('\n').map((l) => l.trim()).filter(Boolean);
}

function discoverBranches() {
  // Unbounded by `from`/`to` — a branch's *name* has no commit-range-bounded
  // identity the way a commit does, so there is nothing to range-filter.
  // `git branch --list` is a ref listing (O(branch count)), not a history
  // walk, so this stays compliant with the "no full-repo git log scan"
  // constraint even though it is not scope-bounded — see
  // sk_git_adapter.md Section 3 "Branch Discovery Is Not Range-Scoped" for
  // the full rationale, named explicitly rather than silently done.
  const res = runGit(['branch', '--list', '--format=%(refname:short)']);
  if (!res.ok) return [];
  return res.stdout.split('\n').map((l) => l.trim()).filter(Boolean);
}

/**
 * discover(scope) -> { artifacts, nodes }, for the sk-git authority's
 * git-history artifact-class.
 *
 * @param {{type:'branchRange', from:string, to:string}|{type:'paths'|'globs', values:string[]}} scope
 * @returns {{artifacts:Array<{path:string, ref:string, artifactKind:'commit'|'branch'}>, nodes:Array<Object>}}
 */
function discover(scope) {
  if (!scope || typeof scope !== 'object' || typeof scope.type !== 'string') {
    throw new Error('discover(scope): scope must be an object with a "type" field (see discover_contract.md Section 3)');
  }

  if (scope.type !== 'branchRange') {
    // sk-git's only registered artifact-class is `git-history`
    // (scripts/scoping.cjs's AUTHORITY_ARTIFACT_CLASSES), which pairs with a
    // branchRange scope (lane_config_schema.md Section 4) — a paths/globs
    // scope has no git-history meaning for this authority. Mirrors
    // sk-doc.cjs's reciprocal branchRange -> empty-result treatment so an
    // out-of-contract call fails predictably instead of throwing.
    return { artifacts: [], nodes: [] };
  }

  const from = typeof scope.from === 'string' ? scope.from.trim() : '';
  const to = typeof scope.to === 'string' ? scope.to.trim() : '';
  if (!from || !to) {
    // scripts/scoping.cjs's validateScope() already enforces non-empty
    // from/to before DISCOVER calls this method (defense-in-depth, not the
    // primary enforcement point — mirrors sk-doc.cjs's isInsideRepoRoot()).
    return { artifacts: [], nodes: [] };
  }

  const commitShas = discoverCommits(from, to);
  const branchNames = discoverBranches();

  const artifacts = [];
  const nodes = [];

  for (const sha of commitShas) {
    // discover_contract.md §4.1: "the exact path/ref identity convention...
    // is each adapter's own design choice." A
    // commit has no filesystem path, so `path` and `ref` both carry the sha;
    // the `git-log/` prefix keeps `path` unambiguous as a synthetic
    // git-history identifier, never confusable with a real repo file path.
    const idPath = `git-log/${sha}`;
    artifacts.push({ path: idPath, ref: sha, artifactKind: 'commit' });
    nodes.push({
      id: `commit:${sha}`,
      kind: 'FILE',
      name: idPath,
      metadata: { authority: 'sk-git', artifactClass: 'git-history', artifactKind: 'commit', ref: sha },
    });
  }
  for (const name of branchNames) {
    const idPath = `git-branch/${name}`;
    artifacts.push({ path: idPath, ref: name, artifactKind: 'branch' });
    nodes.push({
      id: `branch:${name}`,
      kind: 'FILE',
      name: idPath,
      metadata: { authority: 'sk-git', artifactClass: 'git-history', artifactKind: 'branch', ref: name },
    });
  }
  return { artifacts, nodes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KNOWN-DEVIATION SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load and parse the machine-readable deviation list embedded in
 * sk_git_known_deviations.md's fenced ```json block. That file is the single
 * source of truth; there is no separate hand-synced copy of this list.
 * @returns {Array<Object>}
 */
function loadKnownDeviations() {
  let raw;
  try {
    raw = fs.readFileSync(KNOWN_DEVIATIONS_MD, 'utf8');
  } catch (err) {
    return [];
  }
  const match = raw.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed.deviations) ? parsed.deviations : [];
  } catch (err) {
    return [];
  }
}

function matchesDeviation(finding, deviation) {
  if (!Array.isArray(deviation.matchTypes) || deviation.matchTypes.length === 0) return false;
  if (!deviation.matchTypes.includes(finding.type)) return false;
  if (Array.isArray(deviation.matchArtifactKinds) && !deviation.matchArtifactKinds.includes(finding.artifactKind)) return false;
  if (deviation.requiresCommitBeforeHookInstall) {
    if (!finding.detail || typeof finding.detail.commitDate !== 'string') return false;
    if (!(finding.detail.commitDate < HOOK_INSTALL_DATE)) return false;
  }
  return true;
}

/**
 * Filter findings through the known-deviation list. A match suppresses only
 * that finding — never the whole artifact (spec.md's "Data Boundaries" edge
 * case, same invariant as sk-doc.cjs's suppressKnownDeviations()).
 * @param {Array<Object>} findings
 * @param {Array<Object>} knownDeviations
 * @returns {Array<Object>}
 */
function suppressKnownDeviations(findings, knownDeviations) {
  if (!Array.isArray(knownDeviations) || knownDeviations.length === 0) return findings;
  return findings.filter((finding) => !knownDeviations.some((dev) => matchesDeviation(finding, dev)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STANDARDSOURCE(AUTHORITY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * standardSource(authority) -> {rules, ...}, for the sk-git authority.
 * @param {string} authority - Must be 'sk-git'.
 * @returns {Object}
 */
function standardSource(authority) {
  if (authority !== 'sk-git') {
    throw new Error(`sk-git adapter standardSource() called with unsupported authority "${authority}"`);
  }
  return {
    authority: 'sk-git',
    determinism: 'deterministic', // deterministic: conventional-commit + worktree/branch rules already AI-scannable in sk-git/SKILL.md
    rules: {
      commitGrammar: { doc: 'SKILL.md', path: SK_GIT_SKILL_MD, section: 'Commit Message Logic', lines: '310-457' },
      branchNaming: { doc: 'SKILL.md', path: SK_GIT_SKILL_MD, rule: 'wt/{NNNN}-{name}', line: 298 },
      exemptionList: { doc: 'SKILL.md', path: SK_GIT_SKILL_MD, section: 'Classify Special Git Messages', lines: '319-326' },
    },
    enforcementHook: { tool: 'commit-msg hook', path: COMMIT_MSG_HOOK },
    exemptSubjectPrefixes: ['Merge ', 'Revert "', 'fixup! ', 'squash! ', 'amend! '],
    knownDeviations: loadKnownDeviations(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. LIVE GIT READS (VERIFY-FIRST)
// ─────────────────────────────────────────────────────────────────────────────

function commitExists(sha) {
  return runGit(['cat-file', '-e', sha]).ok;
}

function getCommitMessage(sha) {
  const res = runGit(['log', '-1', '--format=%B', sha]);
  if (!res.ok) return null;
  // A committed message is already git-stripspace-normalized at commit time
  // (git runs stripspace on every commit message before storing it), so no
  // further normalization is needed here — unlike the hook's own live
  // pre-commit-buffer read, which still carries un-stripped comment lines.
  return res.stdout.replace(/\n$/, '');
}

function getCommitDate(sha) {
  const res = runGit(['log', '-1', '--format=%aI', sha]);
  if (!res.ok) return null;
  return res.stdout.trim();
}

function getHistoricalFileCount(sha) {
  const res = runGit(['diff-tree', '--no-commit-id', '--name-only', '-r', sha]);
  if (!res.ok) return null;
  return res.stdout.split('\n').filter((l) => l.trim().length > 0).length;
}

function branchExists(name) {
  const res = runGit(['branch', '--list', name]);
  return res.ok && res.stdout.trim().length > 0;
}

/**
 * Whether `name` currently backs a *linked* worktree, via `git worktree list
 * --porcelain` (the only live signal this adapter has for "was this branch
 * worktree-created" — see checkBranch()'s own comment).
 *
 * `git worktree list --porcelain` always includes the main checkout itself as
 * its first block, in the identical `worktree <path>` / `branch
 * refs/heads/<name>` shape as any linked (`git worktree add`-created)
 * worktree — confirmed by live re-probe 2026-07-11 (the main checkout's own
 * block reported `branch refs/heads/skilled/v4.0.0.0` with no distinguishing
 * "main" marker). Without excluding it, the primary long-lived integration
 * branch checked out at the repo root would false-positive as a
 * worktree-created branch missing the wt/ namespace on every run — this was
 * caught by dry-running this adapter against live state while building it,
 * not assumed. The main block's `worktree` path always equals `REPO_ROOT`
 * (`git rev-parse --show-toplevel`), which is what this function excludes on,
 * rather than relying on positional "always first" ordering.
 * @param {string} name
 * @returns {boolean|null} null when git worktree list itself failed to run.
 */
function branchIsBackedByWorktree(name) {
  const res = runGit(['worktree', 'list', '--porcelain']);
  if (!res.ok) return null;
  const wantedRef = `refs/heads/${name}`;
  const blocks = res.stdout.split('\n\n');
  for (const block of blocks) {
    const lines = block.split('\n');
    const worktreeLine = lines.find((l) => l.startsWith('worktree '));
    if (worktreeLine && worktreeLine.slice('worktree '.length).trim() === REPO_ROOT) continue; // main checkout, never worktree-created
    const branchLine = lines.find((l) => l.startsWith('branch '));
    if (branchLine && branchLine.slice('branch '.length).trim() === wantedRef) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CHECK(ARTIFACT, RULES) — COMMIT-MESSAGE GRAMMAR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split a commit message into subject/body exactly as
 * .opencode/scripts/git-hooks/commit-msg:41,50-61 does, including the
 * "missing blank-line separator" error the hook emits inline at that point.
 * @param {string} message
 * @returns {{subject:string, body:string, separatorError:{type:string,message:string}|null}}
 */
function splitMessage(message) {
  const firstNl = message.indexOf('\n');
  if (firstNl === -1) {
    return { subject: message, body: '', separatorError: null };
  }
  const subject = message.slice(0, firstNl);
  const rest = message.slice(firstNl + 1);
  if (rest.length === 0) {
    return { subject, body: '', separatorError: null };
  }
  if (rest.startsWith('\n')) {
    return { subject, body: rest.slice(1), separatorError: null };
  }
  return {
    subject,
    body: rest,
    separatorError: { type: 'missing-blank-line-separator', message: 'Separate the subject from the body with a blank line.' },
  };
}

function isExemptSubject(subject) {
  return EXEMPT_SUBJECT_PATTERNS.some((re) => re.test(subject));
}

/**
 * Port of .opencode/scripts/git-hooks/commit-msg:64-157's structural grammar
 * checks, with ONE deliberate deviation: the hook's own body-required-if
 * ->=4-files rule (commit-msg:145-157) reads `git diff --cached` (the LIVE
 * staging index) via STAGED_FILE_COUNT — meaningful only at pre-commit time
 * against whatever is *currently* staged, which has no relationship to a
 * commit already made in the past. Naively re-invoking the hook script
 * against an already-made commit would silently score it against today's
 * unrelated staging area. This function instead takes `historicalFileCount`
 * (the commit's OWN changed-file count, from `git diff-tree`) and applies
 * the identical >=4-rule against that instead — see sk_git_adapter.md
 * Section 8 for the full discrepancy writeup.
 * @param {string} message
 * @param {number|null} historicalFileCount
 * @returns {{errors:Array<{type:string,message:string}>, warnings:Array<{type:string,message:string}>}}
 */
function checkCommitGrammar(message, historicalFileCount) {
  const errors = [];
  const warnings = [];
  const { subject, body, separatorError } = splitMessage(message);
  if (separatorError) errors.push(separatorError);

  const match = subject.match(SUBJECT_RE);
  if (!match) {
    errors.push({ type: 'invalid-subject-format', message: 'Authored subject must match type(scope)[!]: imperative summary using an allowed type.' });
  } else {
    const scope = match[2];
    const breaking = match[3];
    const summary = match[4];

    if (/^[0-9]+$/.test(scope)) {
      errors.push({ type: 'numeric-only-scope', message: `Scope '${scope}' is numeric-only; use the stable owning subsystem.` });
    }
    if (!/^[a-z]/.test(summary)) {
      errors.push({ type: 'summary-not-imperative', message: 'Summary must start with a lowercase imperative verb.' });
    }
    if (summary.includes('  ')) {
      errors.push({ type: 'summary-repeated-spaces', message: 'Summary contains repeated spaces.' });
    }
    if (TRAILING_PUNCT_RE.test(summary)) {
      errors.push({ type: 'summary-trailing-punctuation', message: 'Summary must not end with punctuation.' });
    }
    if (VAGUE_SUMMARIES.has(summary)) {
      errors.push({ type: 'vague-summary', message: `Summary '${summary}' is too vague; name the changed behavior or artifact.` });
    }
    if (PROCESS_LABEL_RE.test(summary)) {
      warnings.push({ type: 'process-label-in-subject', message: 'Subject contains internal process language; move it to Context or Refs when it does not describe behavior.' });
    }
    if (breaking === '!' && !BREAKING_FOOTER_RE.test(body)) {
      errors.push({ type: 'missing-breaking-footer', message: "A breaking '!' subject requires a 'BREAKING CHANGE: <description>' footer line." });
    }
  }

  if (subject.length > SUBJECT_MAX_HARD) {
    errors.push({ type: 'subject-too-long', message: `Subject is ${subject.length} characters; maximum is 100.` });
  } else if (subject.length > SUBJECT_MAX_SOFT) {
    warnings.push({ type: 'subject-long', message: `Subject is ${subject.length} characters; target 80 or fewer for readable git logs.` });
  }

  if (body) {
    const bodyLines = body.split('\n');
    bodyLines.forEach((line, i) => {
      if (line.length > 100) {
        warnings.push({ type: 'body-line-too-long', message: `Body line ${i + 3} exceeds 100 characters.` });
      }
    });
  }

  if (typeof historicalFileCount === 'number' && historicalFileCount >= BODY_MIN_FILES_FOR_REQUIRED_BODY) {
    const hasExplanatoryBody = body.split('\n').some((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      return !TRAILER_RE.test(trimmed);
    });
    if (!hasExplanatoryBody) {
      errors.push({ type: 'missing-required-body', message: `${historicalFileCount} paths changed in this commit; SKILL.md requires a body when four or more paths are staged.` });
    }
  }

  return { errors, warnings };
}

function checkCommit(artifact) {
  const sha = artifact.ref;
  const findings = [];

  // VERIFY-FIRST: re-fetch live git state right now — discover()
  // only ever returned the sha, never a cached message, so there is nothing
  // to re-verify against except live git itself.
  if (!commitExists(sha)) {
    findings.push(makeFinding({
      severity: 'P1', type: 'adapter-error', artifact, sourceTool: 'git cat-file',
      message: `Commit ${sha} no longer exists in the live repository (rewritten history since discover()?).`,
    }));
    return findings;
  }

  const message = getCommitMessage(sha);
  if (message === null) {
    findings.push(makeFinding({
      severity: 'P1', type: 'adapter-error', artifact, sourceTool: 'git log',
      message: `git log could not read commit ${sha}'s message.`,
    }));
    return findings;
  }

  const { subject } = splitMessage(message);
  if (isExemptSubject(subject)) {
    // commit-msg:44-48 / SKILL.md:322-323: Git-generated subjects
    // are a structural PRE-CHECK exemption (never even evaluated), mirroring
    // the hook's own `case ... exit 0` — not a post-hoc known-deviation
    // suppression, because it must be structurally guaranteed.
    return findings; // empty
  }

  const commitDate = getCommitDate(sha);
  const historicalFileCount = getHistoricalFileCount(sha);
  const { errors, warnings } = checkCommitGrammar(message, historicalFileCount);

  for (const err of errors) {
    findings.push(makeFinding({
      severity: 'P0', type: err.type, artifact, sourceTool: 'commit-msg grammar (ported)',
      message: err.message, detail: { sha, subject, commitDate },
    }));
  }
  for (const warn of warnings) {
    findings.push(makeFinding({
      severity: 'P2', type: warn.type, artifact, sourceTool: 'commit-msg grammar (ported)',
      message: warn.message, detail: { sha, subject, commitDate },
    }));
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CHECK(ARTIFACT, RULES) — BRANCH NAMING
// ─────────────────────────────────────────────────────────────────────────────

function checkBranch(artifact) {
  const name = artifact.ref;
  const findings = [];

  // VERIFY-FIRST: re-confirm live existence right now.
  if (!branchExists(name)) {
    findings.push(makeFinding({
      severity: 'P1', type: 'adapter-error', artifact, sourceTool: 'git branch --list',
      message: `Branch '${name}' no longer exists in the live repository (deleted since discover()?).`,
    }));
    return findings;
  }

  if (LAUNCH_WRAPPER_BRANCH_RE.test(name)) {
    // work/{runtime}/{slug} launch-wrapper branch — SKILL.md:298's own
    // exemption. See sk_git_known_deviations.md Section 2.
    return findings; // empty
  }

  if (WT_BRANCH_RE.test(name)) {
    return findings; // conforms
  }

  // Not wt/-prefixed and not a work/ launch-wrapper branch. Per SKILL.md
  // ALWAYS #4 the numbered namespace applies to *worktree-created* branches
  // specifically, not every branch in the repo (main, long-lived integration
  // branches, etc. are legitimately unprefixed). The only live signal this
  // adapter has for "was this branch worktree-created" is whether it
  // currently backs a live worktree (git worktree list --porcelain) — a
  // branch not backing any live worktree is out of this check's evidentiary
  // reach and is not flagged either way. See sk_git_adapter.md Section 4.2.
  const backedByWorktree = branchIsBackedByWorktree(name);
  if (backedByWorktree === true) {
    findings.push(makeFinding({
      severity: 'P1', type: 'worktree-branch-missing-namespace', artifact, sourceTool: 'git worktree list --porcelain',
      message: `Branch '${name}' backs a live worktree but is not named wt/{NNNN}-{name} (SKILL.md line 298).`,
      detail: { branch: name },
    }));
  } else if (backedByWorktree === null) {
    findings.push(makeFinding({
      severity: 'P1', type: 'adapter-error', artifact, sourceTool: 'git worktree list --porcelain',
      message: `git worktree list --porcelain failed; could not determine whether '${name}' backs a live worktree.`,
    }));
  }
  // backedByWorktree === false: not evidenced as worktree-created, no finding.
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CHECK(ARTIFACT, RULES) — SHARED
// ─────────────────────────────────────────────────────────────────────────────

function makeFinding({ severity, type, artifact, sourceTool, message, detail }) {
  return {
    severity,
    type,
    subcheck: artifact.artifactKind === 'commit' ? 'commit-message-grammar' : 'branch-naming',
    layer: 'deterministic', // sk-git is 100% deterministic — no reasoning-agent layer (see sk_git_adapter.md Section 4.3)
    message,
    artifactId: artifact.path || artifact.ref,
    artifactPath: artifact.path || null,
    artifactRef: artifact.ref,
    artifactKind: artifact.artifactKind,
    sourceTool,
    detail: detail === undefined ? null : detail,
  };
}

function normalizeArtifact(artifact) {
  if (artifact && typeof artifact === 'object' && typeof artifact.ref === 'string'
    && (artifact.artifactKind === 'commit' || artifact.artifactKind === 'branch')) {
    return artifact;
  }
  throw new Error('check(artifact, rules): artifact must be a discover()-shaped object with {ref, artifactKind: "commit"|"branch"}');
}

/**
 * check(artifact, rules) -> findings, for the sk-git authority. Single
 * deterministic layer — no reasoning-agent sub-check, unlike
 * sk-doc's two-layer shape (sk_doc_adapter.md Section 4.2), because both of
 * sk-git's checked dimensions are regex/lookup-checkable against live git
 * state with no judgment call. See sk_git_adapter.md Section 4.3 for the
 * full determinism statement.
 * @param {{ref:string, artifactKind:'commit'|'branch', path?:string}} artifact
 * @param {Object} [rules] - standardSource('sk-git') output; knownDeviations reloaded if omitted.
 * @returns {Array<Object>} Findings after suppression.
 */
function check(artifact, rules) {
  const normalized = normalizeArtifact(artifact);
  const knownDeviations = (rules && Array.isArray(rules.knownDeviations)) ? rules.knownDeviations : loadKnownDeviations();
  let findings;
  if (normalized.artifactKind === 'commit') {
    findings = checkCommit(normalized);
  } else {
    findings = checkBranch(normalized);
  }
  return suppressKnownDeviations(findings, knownDeviations);
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function runCli(argv) {
  const [subcommand, ...rest] = argv;

  if (subcommand === 'discover') {
    const [from, to] = rest;
    if (!from || !to) {
      process.stderr.write('Usage: sk-git.cjs discover <from> <to>\n');
      process.exitCode = 1;
      return;
    }
    printJson(discover({ type: 'branchRange', from, to }));
    return;
  }

  if (subcommand === 'check') {
    const kindFlag = rest[0];
    const value = rest[1];
    if (kindFlag === '--commit' && value) {
      printJson(check({ path: `git-log/${value}`, ref: value, artifactKind: 'commit' }, standardSource('sk-git')));
      return;
    }
    if (kindFlag === '--branch' && value) {
      printJson(check({ path: `git-branch/${value}`, ref: value, artifactKind: 'branch' }, standardSource('sk-git')));
      return;
    }
    process.stderr.write('Usage: sk-git.cjs check --commit <sha> | --branch <name>\n');
    process.exitCode = 1;
    return;
  }

  if (subcommand === 'standard-source') {
    printJson(standardSource('sk-git'));
    return;
  }

  process.stderr.write('Usage: sk-git.cjs <discover|check|standard-source> [args...]\n');
  process.exitCode = 1;
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  discover,
  standardSource,
  check,
  checkCommitGrammar,
  splitMessage,
  isExemptSubject,
  loadKnownDeviations,
  HOOK_INSTALL_COMMIT_SHA,
  HOOK_INSTALL_DATE,
};
