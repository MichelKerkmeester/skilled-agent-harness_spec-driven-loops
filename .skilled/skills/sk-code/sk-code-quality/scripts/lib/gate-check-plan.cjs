// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Check Plan
// ───────────────────────────────────────────────────────────────────
'use strict';

// Which check applies to which file, and why, before anything starts. A run and an explanation
// read this one plan, so an explanation can never disagree with what a run does. The in-process
// sensors and parsers live here too, because they answer the same question without starting a
// process and report the finding shape a spawned check reports, so a caller reads one list.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const vm = require('node:vm');

const {
  CHECKS, excerpt, fileOrigin, finding, hasChanges, lineFromJsonError, lines, matchesGlob, originFor,
  parsesAsJsonc, stripJsonComments,
} = require('./gate-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. SENSOR RULES
// ─────────────────────────────────────────────────────────────────────────────

// Signatures that are exact enough to block. A secret finding carries the rule and the
// line only, so the matched text never reaches any output.
const SECRET_RULES = Object.freeze([
  { rule: 'secret.private-key', pattern: /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/, reason: 'private key header' },
  { rule: 'secret.aws-access-key', pattern: /\bAKIA[0-9A-Z]{16}\b/, reason: 'AWS access key id' },
  { rule: 'secret.github-token', pattern: /\bghp_[A-Za-z0-9]{36}\b/, reason: 'GitHub personal access token' },
  { rule: 'secret.github-pat', pattern: /\bgithub_pat_[A-Za-z0-9_]{22,}\b/, reason: 'GitHub fine-grained token' },
  { rule: 'secret.slack-token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, reason: 'Slack token' },
]);
const CONFLICT_START = /^<{7}(?: |$)/;
const CONFLICT_END = /^>{7}(?: |$)/;
const DEBUG_RULES = Object.freeze([
  { rule: 'debug.debugger', pattern: /^\s*debugger\s*;?\s*$/, reason: 'a debugger statement left in' },
  { rule: 'debug.breakpoint', pattern: /^\s*breakpoint\(\s*\)/, reason: 'a Python breakpoint call left in' },
  { rule: 'debug.pdb', pattern: /\bpdb\.set_trace\(\s*\)/, reason: 'a pdb trace call left in' },
  { rule: 'debug.pry', pattern: /\bbinding\.pry\b/, reason: 'a Ruby pry breakpoint left in' },
]);

// A parser quotes a window of text near its fault, and that window can hold part of a
// key, so a field that shares this many characters with a key in its file is withheld.
const SECRET_WINDOW = 8;

const CJS_PARAMETERS = Object.freeze(['exports', 'require', 'module', '__filename', '__dirname']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. APPLICABILITY
// ─────────────────────────────────────────────────────────────────────────────

function sensorExcluded(context, sensor, facts) {
  const settings = context.merged.sensors[sensor] || {};
  return matchesGlob(settings.exclude, facts.rel);
}

// Which files each check applies to, and why. The run and --explain read the same
// plan, so an explanation can never disagree with what a run does.
function applicability(facts, context, { explain = false } = {}) {
  const textual = !facts.unchecked && !facts.generated;
  // The conflict and secret sensors read raw text, so they also scan a file with no
  // comment family, such as a .env or a Markdown file, where a marker or a key matters
  // as much as in code. A debugger line in such a file is an example, not a leftover.
  const readable = facts.text !== null;
  const debugOn = (context.merged.sensors.debugLeftovers || {}).enabled !== false;
  const kind = facts.syntax;
  return {
    'comment-hygiene': textual && facts.family && !matchesGlob(context.merged.commentHygiene.exclude, facts.rel)
      ? (facts.language
        ? `${facts.language} comments, ${facts.family} family, chosen by ${facts.languageSource}`
        : `${facts.family} comments, the family the repository config maps ${path.extname(facts.rel).toLowerCase()} to`)
      : null,
    'conflict-markers': readable && !sensorExcluded(context, 'conflictMarkers', facts) ? 'every readable text file' : null,
    secrets: readable && !sensorExcluded(context, 'secrets', facts) ? 'every readable text file' : null,
    'debug-leftovers': textual && debugOn && !sensorExcluded(context, 'debugLeftovers', facts) && (explain || hasChanges(facts))
      ? 'changed lines only' : null,
    'syntax-json': textual && (kind === 'json' || kind === 'jsonc') ? `${kind} parse in process` : null,
    'syntax-cjs': textual && kind === 'cjs' ? 'CommonJS compiled in process, never run' : null,
    'syntax-node': textual && (kind === 'mjs' || kind === 'js')
      ? `node --check, ${kind === 'mjs' ? 'exact' : 'heuristic, because plain .js may hold JSX or Flow'}` : null,
    'syntax-python': textual && kind === 'python' ? `ast.parse, Python chosen by ${facts.languageSource}` : null,
    'syntax-shell': textual && kind === 'shell' ? 'bash -n' : null,
    'syntax-yaml': textual && kind === 'yaml' ? 'PyYAML compose, when python3 can import it' : null,
    'syntax-toml': textual && kind === 'toml' ? 'tomllib, when python3 can import it' : null,
    'dist-staleness': facts.generated ? 'a declared generated path' : null,
  };
}

function planChecks(files, context) {
  const plan = new Map(CHECKS.map((check) => [check.id, []]));
  for (const facts of files) {
    const reasons = applicability(facts, context);
    for (const [id, why] of Object.entries(reasons)) if (why) plan.get(id).push(facts);
  }
  return plan;
}

function selected(context, id) {
  const { only, skip } = context;
  return (!only || only.has(id)) && !skip.has(id);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. IN-PROCESS CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function runSensors(plan, context) {
  const findings = [];
  for (const facts of plan.get('conflict-markers')) {
    let open = false;
    lines(facts.text).forEach((text, index) => {
      const line = index + 1;
      const start = CONFLICT_START.test(text);
      if (start || (CONFLICT_END.test(text) && !open)) {
        findings.push(finding({ rule: 'conflict.marker', severity: 'P0', confidence: 'exact', file: facts.rel, line,
          origin: originFor(facts, line), reason: 'merge-conflict marker', excerpt: excerpt(text), check: 'conflict-markers' }));
      }
      if (start) open = true;
      else if (CONFLICT_END.test(text)) open = false;
    });
  }
  for (const facts of plan.get('secrets')) {
    lines(facts.text).forEach((text, index) => {
      const rule = SECRET_RULES.find((candidate) => candidate.pattern.test(text));
      if (!rule) return;
      const line = index + 1;
      findings.push(finding({ rule: rule.rule, severity: 'P0', confidence: 'exact', file: facts.rel, line,
        origin: originFor(facts, line), reason: rule.reason, excerpt: null, check: 'secrets' }));
    });
  }
  for (const facts of plan.get('debug-leftovers')) {
    lines(facts.text).forEach((text, index) => {
      const line = index + 1;
      if (originFor(facts, line) !== 'changed-line') return;
      const rule = DEBUG_RULES.find((candidate) => candidate.pattern.test(text));
      if (!rule) return;
      findings.push(finding({ rule: rule.rule, severity: 'P1', confidence: 'heuristic', file: facts.rel, line,
        origin: 'changed-line', reason: rule.reason, excerpt: excerpt(text), check: 'debug-leftovers' }));
    });
  }
  return findings;
}

function cjsFault(facts) {
  const source = facts.text.startsWith('#!') ? `//${facts.text.slice(2)}` : facts.text;
  try {
    vm.compileFunction(source, [...CJS_PARAMETERS], { filename: facts.abs });
    return null;
  } catch (error) {
    const where = /:(\d+)\s*$/.exec(String(error.stack || '').split('\n')[0]);
    return { line: where ? Number(where[1]) : null, message: error.message };
  }
}

function runInProcessSyntax(plan) {
  const findings = [];
  for (const facts of plan.get('syntax-json')) {
    try {
      JSON.parse(facts.syntax === 'jsonc' ? stripJsonComments(facts.text) : facts.text);
    } catch (error) {
      // Many tools read their own .json files as JSONC, so a file that parses once its
      // comments and trailing commas leave may be valid where it is read, and the fault
      // cannot block.
      const jsoncOnly = facts.syntax === 'json' && parsesAsJsonc(facts.text);
      findings.push(finding({ rule: 'syntax.json', severity: 'P0', confidence: jsoncOnly ? 'heuristic' : 'exact', file: facts.rel,
        line: lineFromJsonError(error.message, facts.text), origin: fileOrigin(facts),
        reason: jsoncOnly
          ? `does not parse as JSON, and parses as JSONC, which the tool that reads it may accept: ${error.message}`
          : `does not parse as ${facts.syntax.toUpperCase()}: ${error.message}`,
        check: 'syntax-json' }));
    }
  }
  for (const facts of plan.get('syntax-cjs')) {
    const fault = cjsFault(facts);
    if (!fault) continue;
    findings.push(finding({ rule: 'syntax.cjs', severity: 'P0', confidence: 'exact', file: facts.rel, line: fault.line,
      origin: fileOrigin(facts), reason: `does not compile as CommonJS: ${fault.message}`, check: 'syntax-cjs' }));
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SECRET_RULES, SECRET_WINDOW, applicability, planChecks, runInProcessSyntax, runSensors, selected,
};
