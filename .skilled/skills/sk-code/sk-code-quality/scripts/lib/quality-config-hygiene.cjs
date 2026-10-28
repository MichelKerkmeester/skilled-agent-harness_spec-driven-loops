// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Comment-Hygiene Policy
// ───────────────────────────────────────────────────────────────────
'use strict';

// The comment-hygiene checker owns its rule names and the regex dialect it can compile,
// and this module reads both from the checker itself, so a rule added there can be
// disabled here with no edit. It also turns a merged commentHygiene block into the flags
// the runner, the pre-commit hook and the CI job pass.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The skill root comes from this file's real path, so a repository that reaches
// the hub through a link still reads the hub's own assets.
const QUALITY_ROOT = path.resolve(path.dirname(fs.realpathSync(__filename)), '..', '..');
const HYGIENE_CHECKER_PATH = path.join(QUALITY_ROOT, 'scripts', 'check-comment-hygiene.sh');

const HYGIENE_CLASS = 'hygiene';

// The rules that point at this framework's own planning vocabulary. A repository with no
// specs/ folder has nothing for them to point at, so init offers them as a suggestion. The
// tracker-id rules (adr, req, rc, chk, task, issue) stay out, because any repository can
// carry those ids.
const SPEC_KIT_HYGIENE_RULES = Object.freeze([
  'packet-slash', 'packet-number', 'packet-reversed', 'phase-number', 'phase-path', 'feature-catalog',
  'generic-label', 'spec-path', 'worktree-session', 'deep-review', 'council-seat', 'review-finding',
  'checklist-item', 'finding-id', 'finding-number',
]);

// The checker compiles a repository pattern with Python's re, which accepts none of these
// constructs. Each expression allows a run of escaped backslashes in front, so a backslash
// the author meant as text does not hide the construct after it.
const PYTHON_REJECTED_PATTERN = [
  [/(?<!\\)(?:\\\\)*\\[pP]/, 'a \\p or \\P property escape'],
];

// Python reads the other metacharacters literally inside a character class too, so a
// construct there is not a fault. \p and \P stay in the list above because Python refuses
// them inside a class as well.
const PYTHON_REJECTED_OUTSIDE_CLASS_PATTERN = [
  [/(?<!\\)(?:\\\\)*\\k</, 'a \\k<name> backreference'],
  [/(?<!\\)(?:\\\\)*\(\?<(?![=!])/, 'a (?<name> named group, which Python spells (?P<name>)'],
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATTERN DIALECT
// ─────────────────────────────────────────────────────────────────────────────

// A character class makes its contents literal in both engines, so a construct only faults
// where it sits outside one. The scan is escape aware, a "]" right after "[" or "[^" is a
// literal member and an unclosed "[" is no class at all, so the rest of the pattern is kept
// as it is.
function withoutCharacterClasses(pattern) {
  let outside = '';
  let index = 0;
  while (index < pattern.length) {
    const char = pattern[index];
    if (char === '\\') {
      outside += pattern.slice(index, index + 2);
      index += 2;
      continue;
    }
    if (char !== '[') {
      outside += char;
      index += 1;
      continue;
    }
    const open = index;
    index += 1;
    if (pattern[index] === '^') index += 1;
    if (pattern[index] === ']') index += 1;
    let closed = false;
    while (index < pattern.length) {
      if (pattern[index] === '\\') {
        index += 2;
        continue;
      }
      if (pattern[index] === ']') {
        index += 1;
        closed = true;
        break;
      }
      index += 1;
    }
    if (!closed) outside += pattern.slice(open);
  }
  return outside;
}

// A construct that only JavaScript accepts compiles above and then makes the checker
// refuse its whole argument list, so it is named here as the config fault it is.
function pythonRejectedConstruct(pattern) {
  const outsideClasses = withoutCharacterClasses(pattern);
  for (const [construct, label] of PYTHON_REJECTED_PATTERN) {
    if (construct.test(pattern)) return label;
  }
  for (const [construct, label] of PYTHON_REJECTED_OUTSIDE_CLASS_PATTERN) {
    if (construct.test(outsideClasses)) return label;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RULE TABLE
// ─────────────────────────────────────────────────────────────────────────────

// The checker owns its rule names, so they are read from its pattern table rather than
// copied here, and a rule added to the checker can be disabled with no edit to this file.
let hygieneRulesCache = null;
/**
 * Read the core rule names from the checker's VIOLATION_PATTERNS table, once per process.
 *
 * @returns {ReadonlyArray<string>} The rule names, in the checker's order.
 * @throws {Error} When the checker cannot be read or holds no rule table.
 */
function readHygieneRules() {
  if (hygieneRulesCache) return hygieneRulesCache;
  const source = fs.readFileSync(HYGIENE_CHECKER_PATH, 'utf8');
  const start = source.indexOf('\nVIOLATION_PATTERNS = [');
  const end = start < 0 ? -1 : source.indexOf('\n]', start);
  if (start < 0 || end < 0) throw new Error(`${HYGIENE_CHECKER_PATH} holds no VIOLATION_PATTERNS table`);
  const rules = [...source.slice(start, end).matchAll(/^\s*\("([a-z0-9-]+)",\s*re\.compile/gm)].map((match) => match[1]);
  if (rules.length === 0) throw new Error(`${HYGIENE_CHECKER_PATH} names no rule in its VIOLATION_PATTERNS table`);
  hygieneRulesCache = Object.freeze(rules);
  return hygieneRulesCache;
}

/**
 * Name the core hygiene rule a disableRules entry switches off, or say why it cannot.
 * An entry is a bare rule name or the same name with its class, the way a finding names
 * it. An id the shared rule-override contract fixes is refused before anything else.
 *
 * @param {string} entry - One disableRules value.
 * @param {string[]} rules - The checker's core rule names.
 * @param {Array<{id:string}>} fixed - The contract's fixed entries.
 * @returns {{name:string|null, error:string|null}} The bare rule name, or the refusal.
 */
function disabledHygieneRule(entry, rules, fixed) {
  const dot = entry.indexOf('.');
  const ruleClass = dot < 0 ? HYGIENE_CLASS : entry.slice(0, dot);
  const name = dot < 0 ? entry : entry.slice(dot + 1);
  const id = `${ruleClass}.${name}`;
  if (fixed.some((row) => row.id === id || row.id === `${ruleClass}.*`)) {
    return { name: null, error: `${JSON.stringify(entry)} is fixed by the shared rule-override contract (rule-overrides.json) and cannot be disabled` };
  }
  if (ruleClass !== HYGIENE_CLASS || !rules.includes(name)) {
    return { name: null, error: `${JSON.stringify(entry)} names no core comment-hygiene rule (${rules.join(', ')})` };
  }
  return { name, error: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CHECKER FLAGS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One --disable-rule per core rule the merged commentHygiene layer switches off. The
 * pre-commit hook and the CI job take only these flags: the repository's additions
 * tighten the author gate alone, and those layers keep the core set minus what the
 * repository switched off, so a rule disabled here never blocks a commit.
 *
 * @param {Object} hygiene - The merged commentHygiene block.
 * @returns {string[]} The arguments to place before the checker's --.
 */
function hygieneDisableFlags(hygiene) {
  const { disableRules = [] } = hygiene || {};
  return disableRules.flatMap((rule) => ['--disable-rule', rule]);
}

/**
 * The checker flags the runner passes for a merged commentHygiene layer: the additions in
 * the order the runner has always passed them, then the disabled rules.
 *
 * @param {Object} hygiene - The merged commentHygiene block.
 * @returns {string[]} The arguments to place before the checker's --.
 */
function hygieneCheckerFlags(hygiene) {
  const { ticketPrefixes = [], extraPatterns = [], extensions = {} } = hygiene || {};
  return [
    ...ticketPrefixes.flatMap((prefix) => ['--ticket-prefix', prefix]),
    ...Object.entries(extensions).flatMap(([ext, family]) => ['--extension', `${ext}=${family}`]),
    ...extraPatterns.flatMap((pattern) => ['--extra-pattern', pattern]),
    ...hygieneDisableFlags(hygiene),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SPEC_KIT_HYGIENE_RULES,
  disabledHygieneRule,
  hygieneCheckerFlags,
  hygieneDisableFlags,
  pythonRejectedConstruct,
  readHygieneRules,
};
