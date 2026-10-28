// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Report
// ───────────────────────────────────────────────────────────────────
'use strict';

// The three forms a caller can print: the JSON run document, the line report an operator reads,
// and the envelope a tracked handoff carries. Rendering decides nothing, so the only rule it
// holds of its own is that a private surface prints by its label, because a tracked file may not
// name a private skill and an envelope gets pasted into one.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

const { RUN_SCHEMA } = require('./gate-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ENVELOPE_SCHEMA = 'code-quality/v1';

const PENDING = 'PENDING_AGENT_JUDGMENT';

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRIVATE NAMES
// ─────────────────────────────────────────────────────────────────────────────

// A private surface prints by its label only, because an envelope gets pasted into
// tracked handoffs and no tracked file may name a private skill. A private name starts
// a path segment or a word, so a public name that only holds the text, such as
// nonlocal-config.js or .local-env.sh, prints as it is. The name is matched without
// regard to case, because a filesystem that ignores case lets one folder carry a
// tracked spelling the ignore rule also covers. A checklist row is named after the
// folder its path resolves through, so that name carries the label too, which keeps a
// skill whose folder and skill id differ out of the envelope.
function privateLabels(surfaces) {
  const pairs = [];
  for (const surface of surfaces) {
    const names = [surface.skillId, surface.skillRoot ? path.basename(surface.skillRoot) : null];
    for (const name of names) if (name && /^local-/i.test(name)) pairs.push([name, surface.label]);
  }
  return pairs;
}

function redactPrivate(text, labelled) {
  const labels = new Map(labelled || []);
  return text.replace(/(^|[^A-Za-z0-9_.-])(local-[A-Za-z0-9._-]*)/gim, (match, lead, name) => `${lead}<${labels.get(name) || 'PRIVATE'}>`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FIELDS
// ─────────────────────────────────────────────────────────────────────────────

function checkerOutputs(verdict) {
  const { summary, layers } = verdict;
  const unverified = summary.unverified.length > 0 ? summary.unverified.join(',') : 'none';
  return `${RUN_SCHEMA} gate=${verdict.gate} exit=${verdict.exit_code} p0_blocking=${summary.p0_blocking} `
    + `unverified=${unverified} unchecked=${verdict.coverage.unchecked.length} `
    + `layers=pc:${layers.pre_commit_hygiene},ci:${layers.ci_hygiene},pe:${layers.post_edit}`;
}

// An applied override is a decision the runner already knows, so it is recorded in front of
// the marker. The marker stays, because the per-severity dispositions are still the agent's.
function decisionsField(verdict) {
  const applied = (verdict.rule_overrides || []).filter((row) => row.files.length > 0)
    .map((row) => `override ${row.id} ${row.action} from ${row.file}`);
  const conflicts = (verdict.rule_conflicts || []).map((row) => `override-conflict ${row.id} ${row.files.join(' ')}`);
  return [...applied, ...conflicts, PENDING].join(', ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

function renderEnvelope(verdict) {
  const lines = [
    'CODE_QUALITY_RESULT v1',
    `schema_version: ${ENVELOPE_SCHEMA}`,
    'status: advisory',
    `modified_files: ${verdict.scope.files.length > 0 ? verdict.scope.files.join(', ') : 'none'}`,
    `resolved_surface: ${verdict.resolved_surface.join(', ')}`,
    `checklists_loaded: ${verdict.checklists.length > 0 ? verdict.checklists.map((entry) => entry.file).join(', ') : 'none'}`,
    `checker_outputs: ${checkerOutputs(verdict)}`,
    `p0_p1_p2_decisions: ${decisionsField(verdict)}`,
    `accepted_deferrals: ${PENDING}`,
    'verification_handoff: workflow-verify.md',
    `remaining_accepted_risk: ${PENDING}`,
  ];
  return redactPrivate(lines.join('\n'), verdict.private_labels);
}

function renderText(verdict) {
  const out = [`${RUN_SCHEMA} gate=${verdict.gate} exit=${verdict.exit_code} status=advisory`];
  out.push(`scope: ${verdict.scope.mode}, lines ${verdict.scope.lines}, ${verdict.scope.files.length} file(s)`);
  out.push(`surfaces: ${verdict.resolved_surface.join(', ')}`);
  out.push(`layers: pre-commit ${verdict.layers.pre_commit_hygiene}, ci ${verdict.layers.ci_hygiene}, post-edit ${verdict.layers.post_edit}`);
  out.push(`config: ${verdict.config.source || 'not read'}${verdict.config.path ? ` ${verdict.config.path}` : ''}`);
  out.push(`trust: ${verdict.config.trust.checks} (${verdict.config.trust.reason})`);
  const disabled = verdict.config.hygiene ? verdict.config.hygiene.disabled : [];
  if (disabled.length > 0) out.push(`hygiene disabled: ${disabled.join(', ')}`);
  for (const error of verdict.errors.concat(verdict.config.errors)) out.push(`error ${error.code}: ${error.message} (repair: ${error.repair})`);
  for (const warning of verdict.config.warnings) out.push(`warning ${warning.code}: ${warning.message} (repair: ${warning.repair})`);
  out.push('checks:');
  for (const check of verdict.checks) {
    const origin = check.origin === 'builtin' ? '' : ` ${check.origin}`;
    const code = check.code ? ` ${check.code}` : '';
    out.push(`  ${check.id}${origin} ${check.state}${code} ${check.severity}${check.required ? ' required' : ''}${check.repair ? ` (${check.repair})` : ''}`);
  }
  out.push(`findings: ${verdict.findings.length}`);
  for (const entry of verdict.findings) {
    const where = entry.line ? `${entry.file}:${entry.line}` : entry.file;
    const flags = `${entry.severity} ${entry.confidence}${entry.blocking ? ' blocking' : ''} ${entry.origin}`;
    out.push(`  ${where} ${entry.rule} ${flags}: ${entry.reason}${entry.excerpt ? ` | ${entry.excerpt}` : ''}`);
  }
  out.push('checklists to load:');
  for (const entry of verdict.checklists) out.push(`  ${entry.file} (${entry.why})`);
  for (const row of verdict.rule_overrides || []) {
    if (row.files.length === 0) continue;
    out.push(`override applied: ${row.id} ${row.action === 'replace' ? `replace: ${row.text}` : 'none'} from ${row.file}`);
  }
  for (const row of verdict.rule_conflicts || []) {
    out.push(`override conflict: ${row.id} between ${row.files.join(' and ')}, the default applies to ${row.scope.join(', ')}`);
  }
  for (const entry of verdict.coverage.unchecked) out.push(`unchecked: ${entry.file} (${entry.reason})`);
  for (const item of verdict.suggested_checks) out.push(`suggested, never run: ${item.id} from ${item.source}: ${item.entry.argv.join(' ')}`);
  out.push(`judgment required: ${verdict.judgment_required.join(', ')}`);
  return out.join('\n');
}

function render(verdict, format) {
  if (format === 'envelope') return renderEnvelope(verdict);
  if (format === 'text') return renderText(verdict);
  const { private_labels: omitted, ...printable } = verdict;
  return JSON.stringify(printable, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { privateLabels, render };
