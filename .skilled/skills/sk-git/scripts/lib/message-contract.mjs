// ───────────────────────────────────────────────────────────────────
// MODULE: Message Contract Loader and Validator
// ───────────────────────────────────────────────────────────────────
//
// The rules used to live twice: as prose in the templates and as regexes in a bash hook. Editing
// the template changed nothing that was enforced, and because the hook is installed machine-wide,
// every other repository inherited this one's format. Here the template IS the rulebook: each one
// carries a fenced `json` block under an "Enforced rules" heading, and this module reads that block
// from whichever repository is being committed to. A repository whose templates declare no block
// gets no enforcement at all; there is deliberately no machine-wide default.
//
// Every gate (commit-msg, pre-push, the agent PreToolUse gate and CI) calls into this module, so a
// rule exists exactly once and the gates cannot disagree.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GIT_TIMEOUT_MS = 10_000;

// Contract patterns come from a file a person edits, and JavaScript regexes have no timeout. The
// input is capped instead, so a pathological pattern can only ever run over a bounded string.
const MAX_INPUT_CHARS = 200_000;

// One template per kind. A repository supplies its own copies under the resolved contract dir.
export const TEMPLATE_FILES = Object.freeze({
  commit: 'commit-message-template.md',
  pr: 'pr-template.md',
  branch: 'worktree-checklist.md',
});

const RULES_HEADING = /^#{1,6}\s+.*\bEnforced rules\b/i;

// Every key a contract may carry. An unknown key is an error rather than something to ignore,
// because a typo in a rule name would otherwise switch that rule off without anyone noticing.
const SHAPES = Object.freeze({
  commit: {
    kind: 'string',
    version: 'number',
    help: { expected: 'string', example: 'string' },
    passthroughSubjects: 'string[]',
    subject: {
      types: 'string[]',
      scopeRequired: 'boolean',
      scopePattern: 'string',
      forbidNumericScope: 'boolean',
      allowBreakingMarker: 'boolean',
      summaryStart: { pattern: 'string', hint: 'string' },
      forbidTrailingPattern: 'string',
      forbidRepeatedSpaces: 'boolean',
      maxLength: 'number',
      vagueSummaries: 'string[]',
      warnPatterns: 'object[]',
    },
    body: {
      required: 'boolean',
      blankLineAfterSubject: 'boolean',
      warnLineLength: 'number',
    },
    trailers: {
      looseKeys: 'string[]',
      strictKeys: 'string[]',
      machineKeys: 'string[]',
      machineKeysInFinalParagraph: 'boolean',
      commitId: { key: 'string', pattern: 'string', hint: 'string', unique: 'boolean' },
      spec: { key: 'string', root: 'string', forbiddenPrefix: 'string', mustExist: 'boolean' },
    },
    attribution: { forbiddenKeys: 'string[]', forbiddenTrailerValuePattern: 'string' },
    breakingFooterPattern: 'string',
  },
  pr: {
    kind: 'string',
    version: 'number',
    requiredSections: 'string[]',
    sectionHeadingLevel: 'number',
    requireSectionContent: 'boolean',
    placeholderPattern: 'string',
    forbiddenPatterns: 'object[]',
  },
  branch: {
    kind: 'string',
    version: 'number',
    hint: 'string',
    allowedPatterns: 'string[]',
    worktreePairPattern: 'string',
  },
});

const WARN_PATTERN_SHAPE = { id: 'string', pattern: 'string', message: 'string' };
const FORBIDDEN_PATTERN_SHAPE = { id: 'string', pattern: 'string', message: 'string' };

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS
// ─────────────────────────────────────────────────────────────────────────────

/** A contract that exists but cannot be read. Gates treat it as a block, never as a pass. */
export class ContractError extends Error {
  constructor(message, file) {
    super(file ? `${message} (${file})` : message);
    this.name = 'ContractError';
    this.file = file;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTRACT EXTRACTION AND SHAPE CHECK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pull the contract block out of a template. Returns null when the template declares no
 * "Enforced rules" heading, which means the repository enforces nothing for this kind.
 */
export function extractContract(markdown, file = '') {
  const lines = String(markdown).split('\n');
  const headingAt = lines.findIndex((line) => RULES_HEADING.test(line));
  if (headingAt === -1) return null;

  const openAt = lines.findIndex((line, i) => i > headingAt && /^```json\s*$/.test(line.trim()));
  if (openAt === -1) throw new ContractError('"Enforced rules" heading has no ```json block under it', file);
  const closeAt = lines.findIndex((line, i) => i > openAt && /^```\s*$/.test(line.trim()));
  if (closeAt === -1) throw new ContractError('the ```json rules block is never closed', file);

  try {
    return JSON.parse(lines.slice(openAt + 1, closeAt).join('\n'));
  } catch (err) {
    throw new ContractError(`the rules block is not valid JSON: ${err.message}`, file);
  }
}

function typeOf(value) {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) return 'string[]';
    if (value.every((v) => v && typeof v === 'object' && !Array.isArray(v))) return 'object[]';
    return 'array';
  }
  return value === null ? 'null' : typeof value;
}

function checkShape(value, shape, where, errors) {
  for (const [key, child] of Object.entries(value)) {
    const expected = shape[key];
    const at = where ? `${where}.${key}` : key;
    if (expected === undefined) {
      errors.push(`unknown key "${at}"`);
      continue;
    }
    if (typeof expected === 'object') {
      if (typeOf(child) !== 'object') errors.push(`"${at}" must be an object`);
      else checkShape(child, expected, at, errors);
      continue;
    }
    // An empty array satisfies either list type.
    const actual = Array.isArray(child) && child.length === 0 ? expected : typeOf(child);
    if (actual !== expected) errors.push(`"${at}" must be ${expected}, got ${typeOf(child)}`);
  }
}

function checkRegex(source, at, errors) {
  try {
    new RegExp(source);
  } catch (err) {
    errors.push(`"${at}" is not a valid regular expression: ${err.message}`);
  }
}

/** Validate a parsed contract for one kind. Returns a list of problems; empty means usable. */
export function contractShapeErrors(contract, kind) {
  const errors = [];
  if (typeOf(contract) !== 'object') return ['the rules block must be a JSON object'];
  if (contract.kind !== kind) errors.push(`"kind" must be "${kind}"`);
  checkShape(contract, SHAPES[kind], '', errors);

  if (kind === 'commit') {
    const s = contract.subject || {};
    if (s.scopePattern) checkRegex(s.scopePattern, 'subject.scopePattern', errors);
    if (s.summaryStart?.pattern) checkRegex(s.summaryStart.pattern, 'subject.summaryStart.pattern', errors);
    if (s.forbidTrailingPattern) checkRegex(s.forbidTrailingPattern, 'subject.forbidTrailingPattern', errors);
    (s.warnPatterns || []).forEach((w, i) => {
      checkShape(w, WARN_PATTERN_SHAPE, `subject.warnPatterns[${i}]`, errors);
      if (typeof w.pattern === 'string') checkRegex(w.pattern, `subject.warnPatterns[${i}].pattern`, errors);
    });
    (contract.passthroughSubjects || []).forEach((p, i) => checkRegex(p, `passthroughSubjects[${i}]`, errors));
    const t = contract.trailers || {};
    if (t.commitId?.pattern) checkRegex(t.commitId.pattern, 'trailers.commitId.pattern', errors);
    if (contract.attribution?.forbiddenTrailerValuePattern) {
      checkRegex(contract.attribution.forbiddenTrailerValuePattern, 'attribution.forbiddenTrailerValuePattern', errors);
    }
    if (contract.breakingFooterPattern) checkRegex(contract.breakingFooterPattern, 'breakingFooterPattern', errors);
  }
  if (kind === 'pr') {
    if (contract.placeholderPattern) checkRegex(contract.placeholderPattern, 'placeholderPattern', errors);
    (contract.forbiddenPatterns || []).forEach((f, i) => {
      checkShape(f, FORBIDDEN_PATTERN_SHAPE, `forbiddenPatterns[${i}]`, errors);
      if (typeof f.pattern === 'string') checkRegex(f.pattern, `forbiddenPatterns[${i}].pattern`, errors);
    });
  }
  if (kind === 'branch') {
    (contract.allowedPatterns || []).forEach((p, i) => checkRegex(p, `allowedPatterns[${i}]`, errors));
    if (contract.worktreePairPattern) checkRegex(contract.worktreePairPattern, 'worktreePairPattern', errors);
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

function git(repoRoot, args) {
  return execFileSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf8',
    timeout: GIT_TIMEOUT_MS,
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 64 * 1024 * 1024,
  });
}

function gitOrNull(repoRoot, args) {
  try {
    return git(repoRoot, args);
  } catch {
    return null;
  }
}

/**
 * Decide which directory holds this repository's templates, most explicit first:
 * the `skgit.contractDir` git config, a repo-root `.sk-git/` folder, then the repository's own
 * sk-git skill assets. Returns null when none exists, which means no enforcement.
 */
export function resolveContractDir(repoRoot) {
  // Only a setting stored in a config file counts. A `git -c` flag or a GIT_CONFIG_* variable
  // reports scope "command", and honoring it would let one invocation switch the rules off.
  const scoped = gitOrNull(repoRoot, ['config', '--show-scope', '--get-all', 'skgit.contractDir']) || '';
  const configured = scoped.split('\n')
    .filter((line) => line && !line.startsWith('command\t'))
    .map((line) => line.slice(line.indexOf('\t') + 1).trim())
    .filter(Boolean)
    .pop() || '';
  if (configured) {
    const dir = path.resolve(repoRoot, configured);
    // An explicit setting that points nowhere is a broken install, not an opt-out.
    if (!fs.existsSync(dir)) throw new ContractError(`skgit.contractDir points to a missing directory: ${dir}`);
    return { dir, source: 'git config skgit.contractDir' };
  }
  const candidates = [
    [path.join(repoRoot, '.sk-git'), '.sk-git/'],
    [path.join(repoRoot, '.skilled', 'skills', 'sk-git', 'assets'), '.skilled/skills/sk-git/assets/'],
    [path.join(repoRoot, '.opencode', 'skills', 'sk-git', 'assets'), '.opencode/skills/sk-git/assets/'],
  ];
  for (const [dir, source] of candidates) {
    if (fs.existsSync(dir)) return { dir, source };
  }
  return null;
}

/**
 * Load the contract for one kind. Returns `{ contract, file, source }`, or null when the
 * repository declares no rules for that kind. Throws ContractError when a declared contract is
 * broken, so a gate blocks rather than passing on a rulebook it could not read.
 */
export function loadContract(repoRoot, kind) {
  const resolved = resolveContractDir(repoRoot);
  if (!resolved) return null;
  const file = path.join(resolved.dir, TEMPLATE_FILES[kind]);
  if (!fs.existsSync(file)) return null;
  const contract = extractContract(fs.readFileSync(file, 'utf8'), file);
  if (!contract) return null;
  const problems = contractShapeErrors(contract, kind);
  if (problems.length > 0) throw new ContractError(`the ${kind} rules block is malformed: ${problems.join('; ')}`, file);
  return { contract, file, source: resolved.source };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. COMMIT VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clean a pending commit message the way git will before storing it. git drops comment lines
 * only when it opened an editor, whose hint block always carries a line holding just the comment
 * character, or when commit.cleanup is `strip`. A message given with -m or -F keeps lines that
 * start with the comment character, so they are kept here too. `cleanup` is commit.cleanup.
 */
export function stripCommitMessage(raw, commentChar = '#', cleanup = '') {
  const scissors = `${commentChar} ------------------------ >8 ------------------------`;
  const lines = String(raw).replace(/\r\n/g, '\n').split('\n');
  const keepAll = cleanup === 'whitespace' || cleanup === 'verbatim';
  const stripComments = cleanup === 'strip'
    || ((cleanup === '' || cleanup === 'default') && lines.some((line) => line === commentChar || line === scissors));
  const out = [];
  for (const line of lines) {
    if (line === scissors && !keepAll) break;
    if (stripComments && line.startsWith(commentChar)) continue;
    const trimmed = line.replace(/\s+$/, '');
    if (trimmed === '' && (out.length === 0 || out[out.length - 1] === '')) continue;
    out.push(trimmed);
  }
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out.join('\n');
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keyAlternation(keys) {
  return keys.map((k) => escapeRegex(k).replace(/\\? /g, '\\s')).join('|');
}

function trailerRegex(trailers = {}) {
  const parts = [];
  if (trailers.looseKeys?.length) parts.push(`(?:${keyAlternation(trailers.looseKeys)})(?::|\\s)`);
  if (trailers.strictKeys?.length) parts.push(`(?:${keyAlternation(trailers.strictKeys)}):`);
  return parts.length ? new RegExp(`^(?:${parts.join('|')})`) : null;
}

function isForbiddenAttribution(line, attribution) {
  if (!attribution) return false;
  const keys = attribution.forbiddenKeys || [];
  if (keys.length && new RegExp(`^(?:${keyAlternation(keys)}):`).test(line)) return true;
  if (!attribution.forbiddenTrailerValuePattern) return false;
  // Only trailer-shaped lines are machine data: a prose mention of a vendor stays prose.
  if (!/^[A-Za-z][A-Za-z0-9-]*:\s+\S/.test(line)) return false;
  return new RegExp(attribution.forbiddenTrailerValuePattern, 'i').test(line);
}

/**
 * The rule ids a commit contract switches on. The template's prose must name each one, which is
 * what keeps the explanation and the enforcement from drifting apart.
 */
export function commitRuleIds(contract) {
  const ids = ['message.empty', 'subject.format'];
  const s = contract.subject || {};
  const b = contract.body || {};
  const t = contract.trailers || {};
  if (s.forbidNumericScope) ids.push('subject.scope-numeric');
  if (s.summaryStart) ids.push('subject.summary-start');
  if (s.forbidRepeatedSpaces) ids.push('subject.repeated-spaces');
  if (s.forbidTrailingPattern) ids.push('subject.trailing-punctuation');
  if (s.vagueSummaries?.length) ids.push('subject.vague');
  if (typeof s.maxLength === 'number') ids.push('subject.max-length');
  for (const w of s.warnPatterns || []) ids.push(w.id);
  if (b.blankLineAfterSubject) ids.push('body.blank-line');
  if (b.required) ids.push('body.required');
  if (typeof b.warnLineLength === 'number') ids.push('body.line-length');
  if (t.machineKeysInFinalParagraph) ids.push('trailer.final-paragraph');
  if (t.commitId) ids.push('trailer.commit-id-format');
  if (t.commitId?.unique) ids.push('trailer.commit-id-unique');
  if (t.spec?.forbiddenPrefix) ids.push('trailer.spec-prefix');
  if (t.spec?.mustExist) ids.push('trailer.spec-exists');
  if (contract.attribution) ids.push('attribution.forbidden');
  if (contract.breakingFooterPattern) ids.push('breaking.footer');
  return ids;
}

/**
 * Check one commit message against a commit contract.
 *
 * `ctx` answers the questions only the repository can: `specExists(relPath)` and
 * `commitIdOwner(id)` each return null when they cannot tell, and the rule is then skipped
 * rather than guessed. `ctx.stage === 'pre-stamp'` validates a message before the
 * prepare-commit-msg hook has run, so the lines that hook removes are removed here too.
 * `ctx.cleanup` is the repository's commit.cleanup setting, which decides whether comment lines go.
 */
export function validateCommit(raw, contract, ctx = {}) {
  const errors = [];
  const warnings = [];
  const err = (id, message) => errors.push({ id, message });
  const warn = (id, message) => warnings.push({ id, message });

  let message = ctx.alreadyClean ? String(raw).replace(/\s+$/, '') : stripCommitMessage(raw, ctx.commentChar, ctx.cleanup);
  if (message.length > MAX_INPUT_CHARS) message = message.slice(0, MAX_INPUT_CHARS);

  if (ctx.stage === 'pre-stamp' && contract.attribution) {
    // The stamper removes only the forbidden keys, and never the subject line. A trailer that
    // merely names the vendor survives it, so it is left here for the rule below to report.
    const keys = contract.attribution.forbiddenKeys || [];
    const keyRe = keys.length ? new RegExp(`^(?:${keyAlternation(keys)}):`) : null;
    message = message.split('\n').filter((line, i) => i === 0 || !keyRe || !keyRe.test(line)).join('\n');
    message = stripCommitMessage(message);
  }

  if (message === '') {
    err('message.empty', 'Commit message is empty.');
    return { errors, warnings, passthrough: false };
  }

  const [subject, ...restLines] = message.split('\n');
  if ((contract.passthroughSubjects || []).some((p) => new RegExp(p).test(subject))) {
    return { errors, warnings, passthrough: true };
  }

  const s = contract.subject || {};
  const b = contract.body || {};
  const t = contract.trailers || {};

  // Body: everything after the subject, minus the blank separator line.
  let body = '';
  if (restLines.length > 0) {
    if (restLines[0] === '') {
      body = restLines.slice(1).join('\n');
    } else {
      body = restLines.join('\n');
      if (b.blankLineAfterSubject) err('body.blank-line', 'Separate the subject from the body with a blank line.');
    }
  }

  // Subject grammar. The structure is fixed by the conventional-commit shape; what fills it
  // (types, scope pattern, limits) is the contract's.
  let breaking = false;
  const parts = subject.match(/^([^\s(:!]+)(?:\(([^)]*)\))?(!)?: (.+)$/);
  const types = s.types || [];
  const scopeOk = (scope) => {
    if (scope === undefined) return !s.scopeRequired;
    return s.scopePattern ? new RegExp(s.scopePattern).test(scope) : scope.length > 0;
  };
  const formatOk = parts
    && (types.length === 0 || types.includes(parts[1]))
    && scopeOk(parts[2])
    && (!parts[3] || s.allowBreakingMarker !== false);

  if (formatOk) {
    const scope = parts[2];
    const summary = parts[4];
    breaking = parts[3] === '!';
    if (s.forbidNumericScope && scope !== undefined && /^[0-9]+$/.test(scope)) {
      err('subject.scope-numeric', `Scope '${scope}' is numeric-only; use the stable owning subsystem.`);
    }
    if (s.summaryStart && !new RegExp(s.summaryStart.pattern).test(summary)) {
      err('subject.summary-start', `Summary must start with ${s.summaryStart.hint || `text matching ${s.summaryStart.pattern}`}.`);
    }
    if (s.forbidRepeatedSpaces && summary.includes('  ')) {
      err('subject.repeated-spaces', 'Summary contains repeated spaces.');
    }
    if (s.forbidTrailingPattern && new RegExp(s.forbidTrailingPattern).test(summary)) {
      err('subject.trailing-punctuation', 'Summary must not end with punctuation.');
    }
    if ((s.vagueSummaries || []).includes(summary)) {
      err('subject.vague', `Summary '${summary}' is too vague; name the changed behavior or artifact.`);
    }
    for (const w of s.warnPatterns || []) {
      if (new RegExp(w.pattern).test(summary)) warn(w.id, w.message);
    }
  } else {
    const shape = contract.help?.expected || 'type(scope)[!]: summary';
    err('subject.format', `Authored subject must match ${shape} using an allowed type${types.length ? ` (${types.join(', ')})` : ''}.`);
  }

  const subjectLength = [...subject].length;
  if (typeof s.maxLength === 'number' && subjectLength > s.maxLength) {
    err('subject.max-length', `Subject is ${subjectLength} characters; maximum is ${s.maxLength}.`);
  }

  // Body lines: attribution, length, prose, breaking footer, machine trailers.
  const trailerRe = trailerRegex(t);
  const isTrailer = (line) => Boolean(trailerRe && trailerRe.test(line));
  const breakingRe = contract.breakingFooterPattern ? new RegExp(contract.breakingFooterPattern) : null;
  const bodyLines = body === '' ? [] : body.split('\n');
  let hasProse = false;
  let hasBreakingFooter = false;

  bodyLines.forEach((line, i) => {
    if (isForbiddenAttribution(line, contract.attribution)) {
      err('attribution.forbidden', `Forbidden attribution line: '${line}'.`);
    }
    if (typeof b.warnLineLength === 'number' && [...line].length > b.warnLineLength && !isTrailer(line)) {
      warn('body.line-length', `Body line ${i + 3} exceeds ${b.warnLineLength} characters.`);
    }
    if (line !== '' && !isTrailer(line)) hasProse = true;
    if (breakingRe && breakingRe.test(line)) hasBreakingFooter = true;
  });

  if (t.commitId) {
    const key = t.commitId.key || 'Commit-Id';
    const valueRe = new RegExp(t.commitId.pattern || '.+');
    for (const line of bodyLines) {
      if (!line.startsWith(`${key}:`)) continue;
      const m = line.match(new RegExp(`^${escapeRegex(key)}: (.*)$`));
      if (!m || !valueRe.test(m[1])) {
        err('trailer.commit-id-format', `${key} must be ${t.commitId.hint || `a value matching ${t.commitId.pattern}`}: '${line}'.`);
        continue;
      }
      if (t.commitId.unique && typeof ctx.commitIdOwner === 'function') {
        const owner = ctx.commitIdOwner(m[1]);
        if (owner) err('trailer.commit-id-unique', `${key} '${m[1]}' already belongs to another commit (${owner}).`);
      }
    }
  }

  if (t.spec) {
    const key = t.spec.key || 'Spec';
    for (const line of bodyLines) {
      if (!line.startsWith(`${key}:`)) continue;
      const value = line.slice(key.length + 1).trim();
      if (t.spec.forbiddenPrefix && value.startsWith(t.spec.forbiddenPrefix)) {
        err('trailer.spec-prefix', `${key} names the packet below ${t.spec.forbiddenPrefix} without that prefix, or searches for it miss: '${line}'.`);
        continue;
      }
      if (t.spec.mustExist && typeof ctx.specExists === 'function') {
        const root = t.spec.root || '';
        const rel = path.posix.join(root, value);
        if (rel === '..' || rel.startsWith('../') || path.posix.isAbsolute(value) || (root && rel !== root && !rel.startsWith(`${path.posix.normalize(root)}/`))) {
          err('trailer.spec-exists', `${key} '${value}' leaves the packet root ${root || '.'}/.`);
        } else if (ctx.specExists(rel) === false) {
          err('trailer.spec-exists', `${key} '${value}' does not name an existing packet folder (${rel}).`);
        }
      }
    }
  }

  // Every reader of the machine keys, git's own trailer parser included, sees only the final
  // paragraph. A key above prose is invisible to them.
  const machineKeys = t.machineKeys || [];
  if (t.machineKeysInFinalParagraph && machineKeys.length) {
    const machineRe = new RegExp(`^(?:${keyAlternation(machineKeys)}):`);
    if (bodyLines.some((line) => machineRe.test(line))) {
      const lastBlank = bodyLines.lastIndexOf('');
      const finalParagraph = bodyLines.slice(lastBlank + 1).filter((line) => line !== '');
      const allTrailers = finalParagraph.every(isTrailer);
      const hasKey = finalParagraph.some((line) => machineRe.test(line));
      if (!allTrailers || !hasKey) {
        err('trailer.final-paragraph', `${machineKeys.join(' and ')} must sit in the final paragraph with no prose beside them, or git's trailer parser cannot see them.`);
      }
    }
  }

  if (breaking && breakingRe && !hasBreakingFooter) {
    err('breaking.footer', "A breaking '!' subject requires a 'BREAKING CHANGE: <description>' footer line.");
  }

  if (b.required && !hasProse) {
    err('body.required', 'A prose body is required on every authored commit: add at least one prose line above the trailers.');
  }

  return { errors, warnings, passthrough: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PR DESCRIPTION VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export function prRuleIds(contract) {
  const ids = ['pr.empty'];
  if (contract.requiredSections?.length) ids.push('pr.section-missing');
  if (contract.requiredSections?.length && contract.requireSectionContent) ids.push('pr.section-empty');
  if (contract.placeholderPattern) ids.push('pr.placeholder');
  for (const f of contract.forbiddenPatterns || []) ids.push(f.id);
  return ids;
}

export function validatePrBody(raw, contract) {
  const errors = [];
  const err = (id, message) => errors.push({ id, message });
  const body = String(raw ?? '').replace(/\r\n/g, '\n').slice(0, MAX_INPUT_CHARS);

  if (body.trim() === '') {
    err('pr.empty', 'PR description is empty.');
    return { errors, warnings: [] };
  }

  const lines = body.split('\n');
  const level = contract.sectionHeadingLevel || 2;
  const headingRe = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
  // Fenced examples are quoted text, never the description's own structure.
  let inFence = false;
  const headings = [];
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) return;
    const m = line.match(headingRe);
    if (m) headings.push({ depth: m[1].length, title: m[2].trim(), line: i });
  });

  for (const name of contract.requiredSections || []) {
    const h = headings.find((x) => x.depth === level && x.title.toLowerCase() === name.toLowerCase());
    if (!h) {
      err('pr.section-missing', `Required section '${'#'.repeat(level)} ${name}' is missing.`);
      continue;
    }
    if (!contract.requireSectionContent) continue;
    const next = headings.find((x) => x.line > h.line && x.depth <= level);
    const content = lines.slice(h.line + 1, next ? next.line : lines.length).filter((l) => l.trim() !== '');
    if (content.length === 0) err('pr.section-empty', `Section '${name}' is empty.`);
  }

  if (contract.placeholderPattern) {
    const placeholderRe = new RegExp(contract.placeholderPattern);
    inFence = false;
    lines.forEach((line, i) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      if (!inFence && placeholderRe.test(line)) {
        err('pr.placeholder', `Line ${i + 1} is an unfilled template placeholder: '${line.trim()}'.`);
      }
    });
  }

  for (const f of contract.forbiddenPatterns || []) {
    const re = new RegExp(f.pattern, 'im');
    if (re.test(body)) err(f.id, f.message);
  }

  return { errors, warnings: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. BRANCH VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export function branchRuleIds(contract) {
  const ids = ['branch.name'];
  if (contract.worktreePairPattern) ids.push('branch.worktree-pair');
  return ids;
}

export function validateBranch(name, contract, worktreeDir) {
  const errors = [];
  const allowed = (contract.allowedPatterns || []).some((p) => new RegExp(p).test(name));
  if (!allowed) {
    errors.push({ id: 'branch.name', message: `Branch '${name}' is outside the naming contract${contract.hint ? `: ${contract.hint}` : '.'}` });
  }
  if (allowed && worktreeDir && contract.worktreePairPattern) {
    const m = name.match(new RegExp(contract.worktreePairPattern));
    const base = path.basename(worktreeDir.replace(/\/+$/, ''));
    if (m && m[1] && base !== m[1]) {
      errors.push({ id: 'branch.worktree-pair', message: `Worktree directory '${base}' must match the branch tail '${m[1]}'.` });
    }
  }
  return { errors, warnings: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. TEMPLATE DRIFT
// ─────────────────────────────────────────────────────────────────────────────

export function ruleIdsFor(kind, contract) {
  if (kind === 'commit') return commitRuleIds(contract);
  if (kind === 'pr') return prRuleIds(contract);
  return branchRuleIds(contract);
}

/**
 * Prove a template's prose and its rules block agree: every rule the block switches on is named
 * in the prose as `rule-id`, and every rule id the prose names is one the block switches on.
 */
export function templateDriftErrors(markdown, kind, file = '') {
  const contract = extractContract(markdown, file);
  if (!contract) return [];
  const shape = contractShapeErrors(contract, kind);
  if (shape.length) return shape;

  const ids = new Set(ruleIdsFor(kind, contract));
  const lines = String(markdown).split('\n');
  const openAt = lines.findIndex((line, i) => i > lines.findIndex((l) => RULES_HEADING.test(l)) && /^```json\s*$/.test(line.trim()));
  const closeAt = lines.findIndex((line, i) => i > openAt && /^```\s*$/.test(line.trim()));
  const prose = [...lines.slice(0, openAt), ...lines.slice(closeAt + 1)].join('\n');

  const named = new Set([...prose.matchAll(/`((?:message|subject|body|trailer|attribution|breaking|pr|branch)\.[a-z0-9-]+)`/g)].map((m) => m[1]));
  const problems = [];
  for (const id of ids) if (!named.has(id)) problems.push(`rule \`${id}\` is enforced but the template prose never names it`);
  for (const id of named) if (!ids.has(id)) problems.push(`the template prose names \`${id}\` but the rules block does not enforce it`);
  return problems;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. REPOSITORY CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

// A copy of a commit keeps its author and author date; these two fields identify one.
const AUTHOR_FORMAT = '%ae%x09%at';

// The author the commit being written will carry, as `email<TAB>seconds`, or null. git exports
// the original author date during an amend and a rebase, and `git var` reports it.
function pendingAuthor(repoRoot) {
  const ident = gitOrNull(repoRoot, ['var', 'GIT_AUTHOR_IDENT']) || '';
  const m = ident.match(/<([^>]*)>\s+(\d+)/);
  return m ? `${m[1]}\t${m[2]}` : null;
}

/**
 * Context for a message about to be committed in a working tree: packets are looked up on disk
 * and a Commit-Id collides when a commit other than HEAD carries it and is not a copy of the one
 * being written. HEAD is excluded so an amend keeps its own id, and a copy left behind by a
 * rebase is recognised by its author and author date.
 */
export function worktreeContext(repoRoot) {
  return {
    specExists: (rel) => fs.existsSync(path.join(repoRoot, rel)),
    commitIdOwner: (id) => {
      const out = gitOrNull(repoRoot, ['log', '--all', '--not', 'HEAD', '-E', `--grep=^Commit-Id: ${escapeRegex(id)}$`, `--format=%h%x09${AUTHOR_FORMAT}`]);
      if (!out || !out.trim()) return null;
      const mine = pendingAuthor(repoRoot);
      const other = out.trim().split('\n').find((row) => row.slice(row.indexOf('\t') + 1) !== mine);
      return other ? other.split('\t')[0] : null;
    },
  };
}

/**
 * Context for commits that already exist, as pre-push and CI see them. A packet counts as existing
 * when the commit's own tree or the tip of the range holds it: code commits routinely land before
 * the commit that adds their packet docs, and both arrive in the same push. A repository that keeps
 * its packets out of git, through an ignore rule, has them in no tree at all, so a folder on disk
 * also counts, as it does when the commit is written. An id collides with any remote commit outside
 * the checked range unless that commit has the same author and author date, which marks it as an
 * earlier copy left behind by a rebase or an amend. `excludeRefs` drops the ref being overwritten.
 */
export function rangeContext(repoRoot, shas, excludeRefs = []) {
  const inRange = new Set(shas);
  const tip = shas[shas.length - 1];
  const inTree = (sha, rel) => gitOrNull(repoRoot, ['cat-file', '-e', `${sha}:${rel}`]) !== null;
  // Most packets exist at the tip, so one directory listing of the tip answers nearly every
  // lookup; a per-commit cat-file runs only for a path the tip does not hold.
  let tipDirs = null;
  const atTip = (rel) => {
    if (!tip) return false;
    if (!tipDirs) {
      tipDirs = new Set((gitOrNull(repoRoot, ['ls-tree', '-r', '-d', '--name-only', tip]) || '').split('\n').filter(Boolean));
    }
    return tipDirs.has(rel.replace(/\/+$/, ''));
  };
  let idOwners = null;
  const owners = () => {
    if (idOwners) return idOwners;
    idOwners = new Map();
    // git matches --exclude against the short remote name (origin/main), never refs/remotes/…,
    // so a full ref name would silently exclude nothing. A remote's HEAD is only an alias of one
    // of its branches, which --remotes lists anyway; leaving it in would re-include the very ref
    // excludeRefs drops.
    const args = ['log', '--exclude=*/HEAD'];
    for (const ref of excludeRefs) args.push(`--exclude=${ref.replace(/^refs\/remotes\//, '')}`);
    args.push('--remotes', `--format=%H%x09${AUTHOR_FORMAT}%x09%(trailers:key=Commit-Id,valueonly=true,separator=%x2C)`);
    for (const row of (gitOrNull(repoRoot, args) || '').split('\n')) {
      const [sha, email, date, ids] = row.split('\t');
      if (!sha || !ids || inRange.has(sha)) continue;
      for (const id of ids.split(',').map((v) => v.trim()).filter(Boolean)) {
        if (!idOwners.has(id)) idOwners.set(id, []);
        idOwners.get(id).push({ sha, author: `${email}\t${date}` });
      }
    }
    return idOwners;
  };
  // The author is read only for a commit whose id some remote commit also carries.
  const authors = new Map();
  const authorOf = (sha) => {
    if (!authors.has(sha)) authors.set(sha, (gitOrNull(repoRoot, ['log', '-1', `--format=${AUTHOR_FORMAT}`, sha]) || '').trim() || null);
    return authors.get(sha);
  };
  const seenInRange = new Map();
  return (sha) => ({
    specExists: (rel) => atTip(rel) || inTree(sha, rel) || fs.existsSync(path.join(repoRoot, rel)),
    commitIdOwner: (id) => {
      const earlier = seenInRange.get(id);
      if (earlier && earlier !== sha) return earlier.slice(0, 10);
      seenInRange.set(id, sha);
      const found = owners().get(id);
      if (!found) return null;
      const mine = authorOf(sha);
      const other = found.find((owner) => owner.author !== mine);
      return other ? other.sha.slice(0, 10) : null;
    },
  });
}
