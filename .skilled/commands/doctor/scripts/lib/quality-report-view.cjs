// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Report View
// ───────────────────────────────────────────────────────────────────
'use strict';

// The two read-only modes: `status` reports the config, its trust, the tools it names,
// the hygiene layers and what the gate would apply here, and `check` stops at the config
// itself. Both render the same lines the route prints for a person, and the same
// document --json carries to a machine, from the one set of readings.
//
// Nothing here starts a configured check or writes a file: a tool is looked up on PATH
// and the applied rules come from the runner's own explanation.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

const { findTool, probeLayers, qualityConfig } = require('./quality-skill-paths.cjs');
const { emit } = require('./quality-script-io.cjs');
const {
  appliedHygiene,
  describeSource,
  disabledHygieneRules,
  errorCode,
  load,
  trustState,
} = require('./quality-config-source.cjs');
const { SAMPLE_LIMIT, appliedRules } = require('./quality-applied-rules.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRUST AND TOOLS
// ─────────────────────────────────────────────────────────────────────────────

function trustLine(trust) {
  return `Trust: ${trust.checks} (${trust.reason})${trust.repair ? ` (repair: ${trust.repair})` : ''}`;
}

/**
 * A tool a configured check names is PASS when PATH holds it and DEGRADED when it does
 * not. A tool only a suggestion names is SKIP, because no check would look for it.
 */
function probeTools(ctx, loaded) {
  const entries = loaded.merged
    ? [...loaded.merged.checks, ...loaded.merged.generated.filter((row) => row.layer === 'repo')]
    : [];
  const tools = new Map();
  for (const entry of entries) {
    if (!tools.has(entry.requires)) tools.set(entry.requires, { tool: entry.requires, checks: [], suggested: [] });
    tools.get(entry.requires).checks.push(entry.id);
  }
  for (const item of qualityConfig.readSuggestions(ctx.root)) {
    if (entries.some((entry) => entry.id === item.id)) continue;
    const tool = item.entry.requires;
    if (!tools.has(tool)) tools.set(tool, { tool, checks: [], suggested: [] });
    tools.get(tool).suggested.push(item.id);
  }
  return [...tools.values()].map((row) => {
    if (row.checks.length === 0) return { ...row, state: 'SKIP', found: null, repair: null };
    const name = row.tool.includes('/') ? path.resolve(ctx.root, row.tool) : row.tool;
    const found = findTool(name, ctx.env);
    return found
      ? { ...row, state: 'PASS', found, repair: null }
      : { ...row, state: 'DEGRADED', found: null, repair: `install '${row.tool}' or remove ${row.checks.join(', ')} from ${loaded.display}` };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. APPLIED RULES
// ─────────────────────────────────────────────────────────────────────────────

function overrideLines(overrides, unknown = []) {
  if (overrides === null) return ['    no override section read: the file is missing'];
  if (!overrides.found) return [];
  const reasons = overrides.refused ? overrides.errors : unknown;
  if (reasons.length > 0) {
    return ['    overrides REFUSED, none of its rows apply:',
      ...reasons.map((row) => `      ${row.line === null ? '' : `line ${row.line}: `}${row.message}`)];
  }
  return overrides.rows.map((row) => `    override ${row.id} ${row.action === 'replace' ? `replace: ${row.text}` : 'none'}${row.reason ? ` (${row.reason})` : ''}`);
}

function appliedLines(applies) {
  const { hygiene } = applies;
  const lines = [];
  if (!applies.resolved) {
    lines.push(`Checklists: not resolved, ${applies.reason}`);
  } else {
    const { sample } = applies;
    lines.push(
      `Checklists: ${applies.checklists.length}, resolved by quality-gate.cjs --explain `
        + `over ${sample.files} of ${sample.listed} listed files `
        + `(${sample.rule}${sample.capped ? `, capped at ${SAMPLE_LIMIT}` : ''})`,
    );
    for (const item of applies.checklists) {
      const reach = item.reached
        ? `${item.files} sampled ${item.files === 1 ? 'file' : 'files'}`
        : 'declared, not reached by the sample: run quality-gate.cjs --explain <path> on a file it selects';
      lines.push(`  ${item.seats.join(', ').padEnd(12)} ${item.file} (${item.why}, ${reach})`);
      lines.push(...overrideLines(item.overrides, item.unknown));
    }
    for (const row of applies.conflicts) {
      lines.push(`  override-conflict ${row.id} ${row.files.join(' ')} (neither row applies, so the gate reads UNVERIFIED for ${row.sampled.join(', ')})`);
    }
    for (const row of applies.errors) lines.push(`  ERROR  ${row.code}: ${row.message}${row.repair ? ` (repair: ${row.repair})` : ''}`);
    for (const row of applies.warnings) lines.push(`  warning ${row.code}: ${row.message}`);
  }
  if (hygiene === null) lines.push('Hygiene rules: none apply, the gate stops on the config errors above');
  else if (hygiene.active === null) lines.push(`Hygiene rules: unknown, ${hygiene.error}`);
  else lines.push(`Hygiene rules: ${hygiene.active.length} apply (${hygiene.active.join(', ')}), disabled ${hygiene.disabled.length > 0 ? hygiene.disabled.join(', ') : 'none'}`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STATUS
// ─────────────────────────────────────────────────────────────────────────────

// The runner's explanation is handed in by the entry point, which owns the one place
// this script starts a process.
function status(ctx, opts, explain) {
  const loaded = load(ctx, opts);
  const trust = trustState(loaded, ctx);
  const tools = probeTools(ctx, loaded);
  const layers = probeLayers({ git: true, root: ctx.root, env: ctx.env });
  const lines = [`Repository: ${ctx.root}`, `Config: ${describeSource(loaded, ctx.root)}`, trustLine(trust)];
  if (loaded.errors.length === 0) lines.push('Errors: none');
  for (const entry of loaded.errors) lines.push(`  ERROR  ${entry.message}`);
  if (tools.length === 0) lines.push('Tools: none named');
  for (const row of tools) {
    const names = row.checks.length > 0 ? `checks ${row.checks.join(', ')}` : `suggested ${row.suggested.join(', ')}, no configured check names it`;
    lines.push(`  ${row.state.padEnd(8)} ${row.tool} (${names})${row.repair ? `: ${row.repair}` : ''}`);
  }
  lines.push(`Layers: pre-commit ${layers.pre_commit_hygiene}, ci ${layers.ci_hygiene}, post-edit ${layers.post_edit}`);
  const hygiene = { disabled: disabledHygieneRules(loaded) };
  lines.push(`Hygiene: ${hygiene.disabled.length > 0 ? `disabled ${hygiene.disabled.join(', ')}` : 'every core rule applies'}`);
  const applies = { ...appliedRules(ctx, loaded, explain), hygiene: appliedHygiene(loaded) };
  lines.push(...appliedLines(applies));
  // A checklist the gate cannot read makes every run that reaches it stop with exit 3, so
  // the status fails on it the way it fails on a config error. A rule conflict stops no
  // run: the gate reads UNVERIFIED, exit 4, for the files it covers, so the status lists it
  // and stays as it is.
  const failed = loaded.errors.length > 0 || applies.errors.length > 0;
  const degraded = tools.some((row) => row.state === 'DEGRADED') || applies.failed;
  const state = failed ? 'FAIL' : degraded ? 'DEGRADED' : 'OK';
  const code = loaded.errors.length > 0 ? errorCode(loaded) : applies.errors.length > 0 ? applies.errors[0].code : null;
  const source = loaded.source || 'unknown';
  emit(opts, {
    repo: ctx.root,
    config: { source: loaded.source, path: loaded.display, bytes: loaded.bytes, errors: loaded.errors, trust },
    tools,
    layers,
    hygiene,
    applies,
  }, lines, `STATUS=${state} SOURCE="${source}" TRUST=${trust.checks}${code ? ` ERROR=${code}` : ''}`);
  return failed ? 1 : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CHECK
// ─────────────────────────────────────────────────────────────────────────────

function check(ctx, opts) {
  const loaded = load(ctx, opts);
  const trust = trustState(loaded, ctx);
  const lines = [`Config: ${describeSource(loaded, ctx.root)}`, trustLine(trust)];
  for (const entry of loaded.errors) lines.push(`  ERROR  ${entry.message}`);
  if (loaded.errors.length === 0) lines.push(loaded.source === 'none' ? 'Nothing to check.' : 'Valid against the schema.');
  const failed = loaded.errors.length > 0;
  emit(opts, { repo: ctx.root, config: { source: loaded.source, path: loaded.display, bytes: loaded.bytes, errors: loaded.errors, trust } }, lines,
    `STATUS=${failed ? 'FAIL' : 'OK'} SOURCE="${loaded.source || 'unknown'}" TRUST=${trust.checks} ERRORS=${loaded.errors.length}${failed ? ` ERROR=${errorCode(loaded)}` : ''}`);
  return failed ? 1 : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { check, status };
