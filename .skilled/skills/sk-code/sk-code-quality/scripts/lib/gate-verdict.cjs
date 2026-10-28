// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Verdict
// ───────────────────────────────────────────────────────────────────
'use strict';

// The gate a run ends in, and the shape every outcome takes. Precedence is fixed: an error, then
// a blocker, then a required check with no evidence, then a run that checked nothing, then no
// blocker found, so two runs over the same evidence always print the same gate. Secret values
// are removed here rather than at each reporter, because an excerpt or a parser message can
// quote one whichever check produced it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  DEFAULTS_FILE, GATE_EXIT, GateError, JUDGMENT_REQUIRED, REPAIRS, REPOSITORY_ORIGINS, RUN_SCHEMA,
  UNVERIFIED_STATES, lines,
} = require('./gate-core.cjs');
const { SECRET_RULES, SECRET_WINDOW } = require('./gate-check-plan.cjs');
const { noTrust } = require('./gate-context.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. GATE DECISION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick the gate by precedence: ERROR, then BLOCKED, then UNVERIFIED, then
 * NOTHING_CHECKED, then NO_BLOCKER_FOUND. No gate means pass.
 *
 * @param {Object} facts - errors, findings, checks and filesChecked.
 * @returns {{gate:string, exit_code:number, unverified:string[]}}
 */
// A rule two override sources at one level disagree on is an open claim, the same kind a
// required check with no evidence is, so it joins the unverified list under its rule id.
function decideGate({ errors = [], findings = [], checks = [], filesChecked = 0, openRules = [] }) {
  const unverified = [...checks.filter((check) => check.required && UNVERIFIED_STATES.has(check.state)).map((check) => check.id), ...openRules];
  const blocked = findings.some((entry) => entry.blocking && entry.severity === 'P0' && entry.confidence === 'exact')
    || checks.some((check) => REPOSITORY_ORIGINS.has(check.origin) && check.severity === 'P0' && check.required && check.state === 'RAN_FAIL');
  let gate = 'NO_BLOCKER_FOUND';
  if (errors.length > 0) gate = 'ERROR';
  else if (blocked) gate = 'BLOCKED';
  else if (unverified.length > 0) gate = 'UNVERIFIED';
  else if (filesChecked === 0) gate = 'NOTHING_CHECKED';
  return { gate, exit_code: GATE_EXIT[gate], unverified };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SECRET REDACTION
// ─────────────────────────────────────────────────────────────────────────────

// Every secret value in one file's text, found the way the sensor finds them.
function secretValues(text) {
  const values = [];
  for (const { pattern } of SECRET_RULES) {
    for (const match of text.matchAll(new RegExp(pattern.source, 'g'))) values.push(match[0]);
  }
  return values;
}

function quotesSecret(field, values) {
  return values.some((value) => {
    if (field.includes(value)) return true;
    for (let at = 0; at + SECRET_WINDOW <= value.length; at += 1) {
      if (field.includes(value.slice(at, at + SECRET_WINDOW))) return true;
    }
    return false;
  });
}

function withheld(reason, values) {
  const at = reason.indexOf(': ');
  const head = at > 0 ? reason.slice(0, at) : null;
  const note = 'the message is withheld, because this file holds a secret signature';
  return head && !quotesSecret(head, values) ? `${head}: ${note}` : note;
}

// A key never reaches a finding, whichever check reported it, and whether or not the
// secret sensor ran. The decision reads the whole source line and the file's own keys,
// because an excerpt is cut to its length limit and a parser quotes only a window of
// text, and either cut can leave part of a key that no signature matches any more. A
// parser message in a file that holds a key is withheld whole, since the window it
// quotes can sit anywhere.
function redactSecrets(findings, files) {
  const byRel = new Map(files.map((facts) => [facts.rel, facts]));
  const keys = new Map();
  return findings.map((entry) => {
    const facts = byRel.get(entry.file);
    if (!facts || !facts.text) return entry;
    if (!keys.has(entry.file)) keys.set(entry.file, secretValues(facts.text));
    const values = keys.get(entry.file);
    if (values.length === 0) return entry;
    const source = entry.line ? lines(facts.text)[entry.line - 1] || '' : '';
    const keyOnLine = SECRET_RULES.some((rule) => rule.pattern.test(source));
    const excerptOut = entry.excerpt && (keyOnLine || quotesSecret(entry.excerpt, values)) ? null : entry.excerpt;
    const parser = String(entry.check).startsWith('syntax-');
    const reasonOut = entry.reason && (parser || quotesSecret(entry.reason, values)) ? withheld(entry.reason, values) : entry.reason;
    return { ...entry, excerpt: excerptOut, reason: reasonOut };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VERDICT SHAPES
// ─────────────────────────────────────────────────────────────────────────────

function summarize(findings, unverified) {
  return {
    p0_blocking: findings.filter((entry) => entry.severity === 'P0' && entry.blocking).length,
    p0_heuristic: findings.filter((entry) => entry.severity === 'P0' && entry.confidence === 'heuristic').length,
    p1_open: findings.filter((entry) => entry.severity === 'P1').length,
    p2_open: findings.filter((entry) => entry.severity === 'P2').length,
    touched_file_debt: findings.filter((entry) => entry.origin === 'touched-file' && !entry.blocking).length,
    unverified,
  };
}

function emptyVerdict(options) {
  return {
    schema: RUN_SCHEMA,
    status: 'advisory',
    gate: 'ERROR',
    exit_code: GATE_EXIT.ERROR,
    scope: { mode: options ? options.scope : null, base: options ? options.base : null, merge_base: null,
      lines: options ? options.lines : 'changed', files: [] },
    config: { source: null, path: null, bytes: null, defaults: DEFAULTS_FILE, trust: noTrust('the run stopped before it read a config'), errors: [], warnings: [],
      hygiene: { disabled: [] } },
    resolved_surface: ['unknown'],
    surfaces: [],
    layers: { pre_commit_hygiene: 'unknown', ci_hygiene: 'unknown', post_edit: 'unknown' },
    checklists: [],
    rule_overrides: [],
    rule_conflicts: [],
    checks: [],
    findings: [],
    suggested_checks: [],
    judgment_required: [...JUDGMENT_REQUIRED],
    coverage: { files_total: 0, files_checked: 0, unchecked: [] },
    summary: summarize([], []),
    errors: [],
  };
}

function errorVerdict(error, options) {
  const code = error instanceof GateError ? error.code : 'INTERNAL_ERROR';
  const verdict = emptyVerdict(options);
  return {
    ...verdict,
    config: error.config || verdict.config,
    errors: [{ code, message: error.message, repair: REPAIRS[code] || REPAIRS.INTERNAL_ERROR }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { decideGate, redactSecrets, summarize, errorVerdict };
