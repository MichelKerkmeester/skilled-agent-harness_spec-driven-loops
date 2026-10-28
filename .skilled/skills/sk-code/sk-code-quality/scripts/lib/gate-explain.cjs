// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Explain Mode
// ───────────────────────────────────────────────────────────────────
'use strict';

// Why each surface, checklist and check applies to a named file, with nothing started. Every
// answer comes from the same readers a run uses, so an explanation can never name a checklist a
// run would not load. One resolution covers every named file, and with a single path the
// per-file fields also stay at the top level, where a single-file caller has always read them.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

const { CHECKS, GATE_EXIT, TRUST_REPAIR } = require('./gate-core.cjs');
const { namedFiles } = require('./gate-context.cjs');
const { authored, declaredSurfaces, fileFacts, fileLabels } = require('./gate-files.cjs');
const { applicability } = require('./gate-check-plan.cjs');
const { configuredEntries, configuredMatches } = require('./gate-configured-checks.cjs');
const { resolveChecklists } = require('./gate-checklists.cjs');
const { overridesReader, runOverrides } = require('./gate-overrides.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EXPLAIN_SCHEMA = 'code-quality-explain/v1';

// ─────────────────────────────────────────────────────────────────────────────
// 3. SURFACE OWNERS
// ─────────────────────────────────────────────────────────────────────────────

// The folder a caller loads a surface from. A hub surface lives in its packet, and an
// outside surface in the skill folder the declared-surfaces reader listed, so a private
// surface that declares no quality block can still be loaded by its folder. The test is
// the one fileLabels recorded, which keeps a label an outside skill shares with the hub
// from pointing at the wrong folder.
function surfaceSkills(facts, surfaces, context) {
  const owners = [];
  for (const surface of surfaces) {
    const outside = Boolean(surface.skillRoot);
    const matched = outside ? facts.skillRoots.has(path.resolve(surface.skillRoot)) : facts.hubLabels.has(surface.label);
    if (!matched) continue;
    const folder = outside ? path.resolve(surface.skillRoot) : (surface.packet ? path.join(context.declHub, surface.packet) : null);
    owners.push({ label: surface.label, owner: outside ? 'outside-skill' : 'hub', folder });
  }
  return owners;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPLANATION
// ─────────────────────────────────────────────────────────────────────────────

function explainFile(facts, resolved, context, readOverrides, conflicts) {
  const reasons = applicability(facts, context, { explain: true });
  // A configured check an explanation lists as applying still starts nothing when no trust
  // rule vouched for the config, so the row says that beside the match it reports.
  const untrusted = context.config.trust.checks === 'untrusted' ? `, but it will not run until trusted: ${TRUST_REPAIR}` : '';
  const repository = configuredEntries(context).map((entry) => {
    const applies = configuredMatches(entry, [facts]).length > 0;
    const selectors = [entry.languages ? `languages ${entry.languages.join(' ')}` : null, entry.paths ? `paths ${entry.paths.join(' ')}` : null]
      .filter(Boolean).join(', ') || 'every file the runner reads';
    return { id: entry.id, origin: entry.kind === 'generated' ? 'generated' : 'configured', applies,
      why: applies ? `matches ${selectors} in ${context.config.path}${untrusted}` : `does not match ${selectors}` };
  });
  const checklists = resolved.checklists.filter((entry) => entry.files.includes(facts.rel)).map(({ file, path: where, why }) => {
    const sources = [...new Set((resolved.seats.get(file) || []).filter((item) => item.file === facts.rel).map((item) => item.seat))];
    return { file, path: where, why, source: sources[0] || null, sources, overrides: readOverrides(where) };
  });
  return {
    file: facts.rel,
    language: facts.language,
    language_source: facts.languageSource,
    unchecked: facts.unchecked,
    surfaces: facts.labels,
    surface_skills: surfaceSkills(facts, resolved.surfaces, context),
    checklists,
    checks: [...CHECKS.map((check) => ({
      id: check.id,
      applies: Boolean(reasons[check.id]),
      why: reasons[check.id] || (facts.unchecked ? `the file is unchecked: ${facts.unchecked}` : 'not this file\'s language or path'),
    })), ...repository],
    rule_conflicts: conflicts.filter((row) => row.scope.includes(facts.rel)).map(({ id, files }) => ({ id, files })),
  };
}

// One resolution covers every named file, as one run does, so a declaration fault is an
// error exactly when some named file reaches it. With one path the per-file fields also
// stay at the top level, where a single-file caller has always read them.
function explain(context) {
  const named = namedFiles(context, context.options.explain);
  const surfaces = declaredSurfaces(context.declHub);
  const files = named.map((file) => fileFacts({ ...file, changed: new Set() }, context));
  for (const facts of files) if (authored(facts)) facts.labels = fileLabels(facts, surfaces);
  const resolved = { ...resolveChecklists(files, context), surfaces };
  const readOverrides = overridesReader();
  // The conflicts come from the run's own override pass, so an explanation names exactly
  // the rules a run over these files would hold open. Its refusals stay the run's to report.
  const { conflicts } = runOverrides(resolved.checklists, resolved.seats, surfaces);
  const entries = files.map((facts) => explainFile(facts, resolved, context, readOverrides, conflicts));
  const single = entries.length === 1 ? entries[0] : null;
  return {
    schema: EXPLAIN_SCHEMA,
    status: 'advisory',
    exit_code: GATE_EXIT.NOTHING_CHECKED,
    ...(single ? {
      file: single.file,
      language: single.language,
      language_source: single.language_source,
      unchecked: single.unchecked,
      surfaces: single.surfaces,
      surface_skills: single.surface_skills,
    } : {}),
    config: { ...context.config, warnings: [...context.config.warnings, ...resolved.warnings] },
    ...(single ? { checklists: single.checklists, checks: single.checks, rule_conflicts: single.rule_conflicts } : {}),
    files: entries,
    errors: resolved.errors,
    note: 'nothing was run',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { explain };
