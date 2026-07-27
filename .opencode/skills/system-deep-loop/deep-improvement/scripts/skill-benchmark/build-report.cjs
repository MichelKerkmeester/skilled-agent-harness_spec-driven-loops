#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ build-report.cjs — render report.md from report.json (anti-drift)        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * build-report.cjs — render report.md FROM report.json (anti-drift).
 *
 * The converged design requires a dual artifact: a machine report.json and a
 * human report.md, with the markdown rendered from the JSON so they cannot drift.
 * There is no pre-existing Lane B renderer to reuse (Lane B emits JSON only), so
 * this renderer is Lane-C-specific. It is the ONLY writer of report.md — it
 * accepts no score arguments, only the report object.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function dimLine(name, d) {
  if (!d) return `| ${name} | — | — |`;
  const score = d.score == null ? `_${d.status || 'unscored'}_` : `${d.score}/100`;
  const gate = d.hardGate ? ' (hard gate)' : '';
  return `| ${name}${gate} | ${d.points}pts | ${score} |`;
}

/**
 * Fail-closed provenance guard. Scoped to the gated typed-pair taxonomy only:
 * a plain report (no excluded rows, no row carrying an errorClass) never
 * enters this check, so it can never trip for any pre-existing report shape.
 * Once a report DOES carry gated rows, it must be able to say which skill
 * root and manifest digest they were scored against, and every gated/excluded
 * row must be individually identifiable — otherwise the report is rendered
 * without knowing what it is claiming, which is worse than not rendering it.
 *
 * @param {Object} report - Candidate report object.
 * @returns {string[]} Provenance problems; empty when the report is clean or ungated.
 */
function validateProvenance(report) {
  const problems = [];
  const excluded = Array.isArray(report && report.excludedRows) ? report.excludedRows : [];
  const rows = Array.isArray(report && report.scenarioRows) ? report.scenarioRows : [];
  const gatedRows = rows.filter((row) => row && row.errorClass != null);
  if (excluded.length === 0 && gatedRows.length === 0) return problems;

  if (!report || !report.targetSkill || !(report.targetSkill.root || report.targetSkill.rootRel)) {
    problems.push('missing provenance: targetSkill.root or targetSkill.rootRel (skill root)');
  }
  if (!report.topologyDigest) {
    problems.push('missing provenance: topologyDigest (manifest digest)');
  }
  for (const row of [...excluded, ...gatedRows]) {
    if (!row.scenarioId) problems.push('missing provenance: a gated/excluded row has no scenarioId');
  }
  return problems;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render the human-readable report.md from a machine report object.
 * @param {Object} report - Parsed report.json object (scores, funnel, scenarios, etc.).
 * @returns {string} Markdown document rendered deterministically from the report.
 */
function renderReport(report) {
  const provenanceProblems = validateProvenance(report);
  if (provenanceProblems.length) {
    throw new Error(`build-report: fail-closed on missing provenance — ${provenanceProblems.join('; ')}`);
  }
  const r = report;
  const lines = [];
  lines.push(`# Skill Benchmark Report — ${r.targetSkill ? r.targetSkill.id : 'unknown'}`);
  lines.push('');
  lines.push(`> Rendered from report.json (do not hand-edit). Scoring: \`${r.scoringMethod}\` · trace mode: \`${r.traceMode}\`.`);
  lines.push('');
  lines.push(`**Verdict: ${r.verdict}**${r.aggregateScore != null ? ` · aggregate ${r.aggregateScore}/100` : ''}`);
  if (r.gate && r.gate.gateFailed) lines.push(`\n⚠ **${r.gate.reason}** — verdict capped regardless of weighted score.`);
  lines.push('');

  if (r.coverage) {
    const c = r.coverage;
    lines.push('## Coverage');
    lines.push('');
    lines.push(`- Scored (text executors): **${c.scored}** · routed out to browser harness: **${c.routedOut}**`);
    lines.push(`- By class — routing: ${c.routing} · advisor: ${c.advisor} · browser: ${c.browser}`);
    if (c.holdout || c.negative) {
      lines.push(`- By stage — holdout: ${c.holdout || 0} · negative (suppression): ${c.negative || 0}`);
    }
    lines.push('');
  }

  if (r.generalization) {
    const g = r.generalization;
    lines.push('## Generalization (fitted vs holdout)');
    lines.push('');
    if (!g.holdoutCount) {
      lines.push(`- Fitted aggregate: **${g.fittedScore != null ? `${g.fittedScore}/100` : '—'}** · holdout: _none declared_ · negatives: ${g.negativeCount}`);
    } else {
      const gapSign = g.generalizationGap >= 0 ? '+' : '';
      lines.push(`- Fitted (${g.fittedCount}): **${g.fittedScore}/100** · Holdout (${g.holdoutCount}): **${g.holdoutScore}/100** · Gap: **${gapSign}${g.generalizationGap}**`);
      lines.push(`- Negatives (suppression): ${g.negativeCount}`);
    }
    lines.push(`- _${g.note}_`);
    lines.push('');
  }

  lines.push('## Dimension scores');
  lines.push('');
  lines.push('| Dimension | Weight | Score |');
  lines.push('| --------- | ------ | ----- |');
  const d = r.dimensionScores || {};
  lines.push(dimLine('D1 inter (advisor)', d.D1inter));
  lines.push(dimLine('D1 intra (router)', d.D1intra));
  lines.push(dimLine('D2 discovery', d.D2));
  lines.push(dimLine('D3 efficiency', d.D3));
  lines.push(dimLine('D4 usefulness', d.D4));
  lines.push(dimLine('D5 connectivity', d.D5));
  if (r.unscoredDimensions && r.unscoredDimensions.length) {
    lines.push('');
    lines.push(`_Unscored in this run (need live mode): ${r.unscoredDimensions.join(', ')}._`);
  }
  if (r.excludedDimensions && r.excludedDimensions.length) {
    lines.push('');
    const reasons = r.excludedDimensions.map((k) => {
      const dim = (r.dimensionScores || {})[k] || {};
      const owner = dim.delegatedMeasure && dim.delegatedMeasure.targetSkill;
      return `${k} — ${dim.reason || 'excluded by design'}${owner ? ` (measured via ${owner})` : ''}`;
    });
    lines.push(`_Excluded by design (structurally N/A, not a gap): ${reasons.join('; ')}._`);
  }
  lines.push('');

  if (r.advisorySignals) {
    const a = r.advisorySignals;
    const fmt = (s) => (s && typeof s.score === 'number' ? `${s.score}/100` : `_${(s && s.status) || 'unscored'}_`);
    lines.push('### Advisory signals (NOT in the weighted aggregate)');
    lines.push('');
    if (a.D4_task_outcome) lines.push(`- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: ${fmt(a.D4_task_outcome)}`);
    if (a.assetRecall) lines.push(`- **Asset support recall** — deferred \`assets/*\` gold (router defers these on demand): ${fmt(a.assetRecall)}`);
    lines.push('');
  }

  if (r.routeGold) {
    const g = r.routeGold;
    lines.push('## Route gold (hard lane)');
    lines.push('');
    lines.push(`- Gate: **${g.enabled ? 'ENFORCED' : 'not enforced'}** (flag \`${g.mode}\`) · rows scored: **${g.rows}** · matches: **${g.matches}** · violations: **${g.violations}** (gold parse failures: ${g.parseFailures})`);
    if (g.failed) lines.push('- ⚠ **Route-gold violation(s) fail this run** — a route mismatch cannot remain a PASS while the gate is on.');
    if (g.details && g.details.length) {
      lines.push('');
      lines.push('| Scenario | Intent | Resources | Expected | Observed |');
      lines.push('| -------- | ------ | --------- | -------- | -------- |');
      const cell = (v) => (Array.isArray(v) ? (v.length ? v.join('<br>') : '_empty set_') : (v == null ? '—' : String(v)));
      for (const d of g.details) {
        if (d.reason === 'gold-parse-failure') {
          lines.push(`| ${d.scenarioId || '—'} | — | — | _gold parse failure_ | ${String(d.detail || '').replace(/\|/g, '\\|')} |`);
          continue;
        }
        const expected = `intent: ${cell(d.expectedIntents)}<br>resources: ${cell(d.expectedResources)}`;
        const observed = `intent: ${cell(d.observedIntents)}<br>resources: ${cell(d.observedResources)}`;
        lines.push(`| ${d.scenarioId || '—'} | ${d.intentOk === false ? 'MISMATCH' : 'ok'} | ${d.resourceOk === false ? 'MISMATCH' : 'ok'} | ${expected.replace(/\|/g, '\\|')} | ${observed.replace(/\|/g, '\\|')} |`);
      }
    }
    lines.push('');
  }

  if (r.compiledRouting) {
    const c = r.compiledRouting;
    const ct = c.counts || {};
    lines.push('## Compiled routing parity');
    lines.push('');
    lines.push(`- Sub-verdict: **${c.subVerdict}**${c.blocking ? ' — ⚠ blocks the run' : ''} · child flag forced on: **${c.flagForcedOn === true ? 'yes' : 'no'}** · parent flag: \`${c.flagState ? c.flagState.state : 'unset'}\` · parity mode: \`${c.mode}\``);
    lines.push(`- Scored: **${c.scored || 0}** · match: **${ct.match || 0}** · drift: **${ct.drift || 0}** · vacuous: **${ct.vacuous || 0}** · resolver-missing: **${ct['resolver-missing'] || 0}** · n/a: **${ct['n/a'] || 0}**`);
    lines.push(`- Eligible rows: **${Array.isArray(c.eligibleRows) ? c.eligibleRows.length : 0}** · drift rows: **${Array.isArray(c.driftRows) ? c.driftRows.length : 0}** · breakages: **${Array.isArray(c.breakages) ? c.breakages.length : 0}**`);
    if (c.frozenHashes) {
      lines.push(`- Frozen scorer hashes unchanged: **${c.frozenHashes.unchanged === true ? 'yes' : 'no'}**`);
    }
    if (c.gate) {
      const consumers = (c.gate.reportOnlyConsumers || []).join(', ');
      lines.push(`- Drift gate: single blocking owner \`${c.gate.owner}\`${consumers ? ` · report-only consumers: ${consumers}` : ''}`);
    }
    if (Array.isArray(c.rows) && c.rows.length) {
      lines.push('');
      lines.push('| Scenario | Hub | Status | Front door | Reason | First difference |');
      lines.push('| -------- | --- | ------ | ---------- | ------ | ---------------- |');
      for (const row of c.rows) {
        const difference = row.firstDifference
          ? `${row.firstDifference.field}: ${JSON.stringify(row.firstDifference.legacy)} -> ${JSON.stringify(row.firstDifference.compiled)}`
          : '';
        lines.push(`| ${row.scenarioId || '—'} | ${row.hubId || '—'} | ${row.status || '—'} | ${row.frontDoorOutcome || '—'} | ${String(row.reason == null ? '' : row.reason).replace(/\|/g, '\\|')} | ${difference.replace(/\|/g, '\\|')} |`);
      }
    }
    lines.push('');
  }

  // Rendered only for archived artifacts, which carry a provenance/execution
  // block; a live run report has neither key, so this section never appears in
  // the ordinary report and cannot drift an existing shape. It exists so an
  // archived pair proves — with no absolute checkout path — which skill root,
  // serving manifest, model, and flag state produced it.
  if (r.provenance || r.executionContext) {
    const pv = r.provenance || {};
    const ec = r.executionContext || {};
    lines.push('## Provenance & execution context');
    lines.push('');
    lines.push('_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._');
    lines.push('');
    lines.push('| Field | Value |');
    lines.push('| ----- | ----- |');
    lines.push(`| Skill root (repo-relative) | \`${pv.rootRel || (r.targetSkill && r.targetSkill.rootRel) || '—'}\` |`);
    lines.push(`| Captured at | ${pv.capturedAt || '—'} |`);
    lines.push(`| Active manifest | \`${pv.activationManifestRel || '—'}\` · digest \`${pv.manifestDigest || ec.manifestDigest || '—'}\` |`);
    lines.push(`| Engine resolver | \`${pv.engineResolverPath || '—'}\` |`);
    lines.push(`| Source report digest | \`${pv.sourceReportDigest || '—'}\` |`);
    lines.push(`| Executor / model | ${ec.executor || '—'} / ${ec.model || '—'}${ec.variant ? ` (${ec.variant})` : ''} |`);
    lines.push(`| CLI version | ${ec.cliVersion || '—'} |`);
    lines.push(`| Flag state | \`${ec.flagState || '—'}\` |`);
    lines.push(`| Runtime digest | \`${ec.runtimeDigest || '—'}\` |`);
    lines.push(`| Run revision | ${ec.runRevision || '—'} |`);
    if (Array.isArray(ec.scenarioIds) && ec.scenarioIds.length) {
      lines.push(`| Scenario IDs | ${ec.scenarioIds.join(', ')} |`);
    }
    lines.push('');
  }

  lines.push('## Funnel');
  lines.push('');
  for (const [stage, count] of Object.entries(r.funnel || {})) {
    lines.push(`- ${stage}: ${count}`);
  }
  if (r.headlineBottleneck) lines.push(`\n**Headline bottleneck: ${r.headlineBottleneck}**`);
  lines.push('');

  lines.push('## Ranked bottlenecks');
  lines.push('');
  const bn = r.bottlenecks || [];
  if (!bn.length) lines.push('_None._');
  else {
    lines.push('| Severity | Class | Locus | Finding |');
    lines.push('| -------- | ----- | ----- | ------- |');
    for (const b of bn) {
      lines.push(`| ${b.severity || '—'} | ${b.class || '—'} | ${b.locus || b.stage || '—'} | ${(b.detail || '').replace(/\|/g, '\\|')} |`);
    }
  }
  lines.push('');

  lines.push('## Scenarios');
  lines.push('');
  const rows = r.scenarioRows || [];
  if (!rows.length) lines.push('_No scenarios._');
  else {
    lines.push('| Scenario | Class | Stage | Score | First failing stage |');
    lines.push('| -------- | ----- | ----- | ----- | ------------------- |');
    for (const s of rows) {
      const score = s.routedOut ? '_routed-out_' : (typeof s.modeAScore === 'number' ? `${s.modeAScore}/100` : '—');
      const failStage = s.routedOut ? (s.reason || 'browser harness') : (s.firstFailingStage || 'passed');
      const benchStage = s.stage || 'routing';
      lines.push(`| ${s.scenarioId} | ${s.classKind || s.tier || '—'} | ${benchStage} | ${score} | ${String(failStage).replace(/\|/g, '\\|')} |`);
    }
  }
  lines.push('');

  if (r.excludedRows && r.excludedRows.length) {
    lines.push('## Excluded (fixture/oracle faults — not scored)');
    lines.push('');
    lines.push('_Excluded from every denominator above rather than counted as zero recall — a bad oracle, not a routing miss._');
    lines.push('');
    lines.push('| Scenario | Error class | Problems |');
    lines.push('| -------- | ----------- | -------- |');
    for (const e of r.excludedRows) {
      lines.push(`| ${e.scenarioId || '—'} | ${e.errorClass || '—'} | ${(e.problems || []).join('; ').replace(/\|/g, '\\|')} |`);
    }
    lines.push('');
  }

  if (r.divergence && r.divergence.length) {
    lines.push('## A↔B divergence (router vs live)');
    lines.push('');
    lines.push('| Scenario | Surface agree | Router-only refs | Live-only refs | Severity |');
    lines.push('| -------- | ------------- | ---------------- | -------------- | -------- |');
    for (const d of r.divergence) {
      lines.push(`| ${d.scenarioId} | ${d.surfaceAgree == null ? '—' : d.surfaceAgree} | ${d.resourceDelta.onlyRouter.length} | ${d.resourceDelta.onlyLive.length} | ${d.severity} |`);
    }
    lines.push('');
  }

  if (r.lintFindings && r.lintFindings.length) {
    lines.push('## Contamination findings (router mode — drift, not failures)');
    lines.push('');
    lines.push('_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._');
    for (const f of r.lintFindings) {
      lines.push(`- ${f.scenarioId}: ${(f.leaks || []).slice(0, 6).join(', ')}`);
    }
    lines.push('');
  }

  lines.push('## Methodology / caveats');
  lines.push('');
  lines.push(`- ${r.runQuality ? r.runQuality.note : 'Mode A deterministic router-replay.'}`);
  lines.push(`- Scenario count: ${r.runQuality ? r.runQuality.scenarioCount : (rows.length)}.`);
  lines.push('');
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CURATED REPORT COMPANIONS
// ─────────────────────────────────────────────────────────────────────────────
//
// A run folder carries a machine table, two narrative files and an authority map
// beside the rendered report. Every one of them is derived STRICTLY from what the
// run record contains. A run that captured no per-case detail produces a file
// saying exactly that: an absent finding is information, and inventing one would
// make the folder lie about what was measured.
//
// Two row shapes reach these emitters and both must read correctly. A live
// dispatch lane writes an explicit `verdict` and `reason`. The deterministic
// router-replay scorer writes neither: it records `firstFailingStage`, which is
// null exactly when the scenario cleared every gate it was applicable to. Reading
// only the first shape would report every replay run as having no failures, which
// is the specific way this file could lie.

const NOT_RECORDED = 'not recorded';

/**
 * Collapse either row shape onto one vocabulary. Every field comes from a
 * recorded value or falls back to a recorded run-level value; nothing here
 * infers an outcome the record does not state.
 *
 * @param {Object} row - One scenarioRows entry.
 * @param {Object} report - The enclosing report, for run-level fallbacks.
 * @returns {Object} Normalized row fields.
 */
function normalizeRow(row, report) {
  const explicit = row.verdict == null ? null : String(row.verdict).toUpperCase();
  let verdict;
  if (explicit) verdict = explicit;
  else if (row.applicable === false) verdict = 'SKIP';
  else verdict = row.firstFailingStage == null ? 'PASS' : 'FAIL';

  const reason = row.reason
    || (row.firstFailingStage ? `first failing stage: ${row.firstFailingStage}` : '');

  return {
    scenarioId: row.scenarioId,
    hubId: row.hubId || (report.targetSkill && report.targetSkill.id),
    tier: row.tier,
    stage: row.stage,
    classKind: row.classKind,
    goldMode: row.goldMode || row.expectedWorkflowMode,
    providerModel: row.providerModel || report.model,
    variant: row.variant || report.variant,
    score: typeof row.modeAScore === 'number' ? row.modeAScore : '',
    verdict,
    reason,
  };
}

function normalizedRows(report) {
  const rows = Array.isArray(report.scenarioRows) ? report.scenarioRows : [];
  return rows.map((row) => normalizeRow(row, report));
}

function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function renderResultsCsv(report) {
  const header = [
    'scenario_id', 'hub_id', 'tier', 'stage', 'class_kind',
    'gold_mode', 'provider_model', 'variant', 'score', 'verdict', 'reason',
  ];
  const lines = [header.join(',')];
  for (const row of normalizedRows(report)) {
    lines.push([
      row.scenarioId, row.hubId, row.tier, row.stage, row.classKind,
      row.goldMode, row.providerModel, row.variant, row.score, row.verdict, row.reason,
    ].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function runHeading(report) {
  // targetSkill is an object carrying the skill id and its root.
  const skill = report.targetSkill && typeof report.targetSkill === 'object'
    ? report.targetSkill.id
    : report.targetSkill;
  const parts = [skill, report.traceMode, report.executor, report.model, report.variant]
    .filter(Boolean).join(' · ');
  return parts || 'skill benchmark run';
}

function tallyVerdicts(rows) {
  const tally = new Map();
  for (const row of rows) tally.set(row.verdict, (tally.get(row.verdict) || 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1]);
}

function renderFailedRuns(report) {
  const rows = normalizedRows(report);
  const failed = rows.filter((row) => row.verdict === 'FAIL');
  const out = ['# Failed Runs\n', `> ${runHeading(report)}\n`];

  if (rows.length === 0) {
    out.push('This run record contains no per-scenario rows, so no failure detail was captured.\n');
    return out.join('\n');
  }
  if (failed.length === 0) {
    const tally = tallyVerdicts(rows).map(([v, n]) => `${n} ${v}`).join(', ');
    out.push(`No scenario recorded a FAIL verdict across ${rows.length} scenario(s): ${tally}.\n`);
    return out.join('\n');
  }

  out.push(`${failed.length} of ${rows.length} scenario(s) recorded a FAIL verdict.\n`);
  for (const row of failed) {
    out.push(`## ${row.scenarioId || 'unnamed scenario'}\n`);
    out.push('| Field | Value |');
    out.push('|---|---|');
    out.push(`| Hub | ${row.hubId || NOT_RECORDED} |`);
    out.push(`| Stage | ${row.stage || NOT_RECORDED} |`);
    out.push(`| Expected route | ${row.goldMode || NOT_RECORDED} |`);
    out.push(`| Score | ${row.score === '' ? NOT_RECORDED : `${row.score}/100`} |`);
    out.push(`| Model | ${row.providerModel || NOT_RECORDED}${row.variant ? ` (${row.variant})` : ''} |`);
    out.push('');
    out.push(row.reason
      ? `**Recorded reason.** ${row.reason}\n`
      : 'This run captured no reason for the failure. Re-run with transcript capture to obtain one.\n');
  }
  return out.join('\n');
}

function renderFindings(report) {
  const rows = normalizedRows(report);
  const failed = rows.filter((row) => row.verdict === 'FAIL');
  const out = ['# Findings And Recommendations\n', `> ${runHeading(report)}\n`];

  if (failed.length === 0) {
    out.push(rows.length === 0
      ? 'This run record contains no per-scenario rows, so no findings can be derived from it.\n'
      : `No FAIL verdicts were recorded across ${rows.length} scenario(s), so this run yields no remediation findings.\n`);
    return out.join('\n');
  }

  // Group by the recorded reason: repetition across scenarios is the only pattern
  // the record actually supports. Anything beyond that would be interpretation.
  const byReason = new Map();
  for (const row of failed) {
    const key = row.reason || '(no reason recorded)';
    if (!byReason.has(key)) byReason.set(key, []);
    byReason.get(key).push(row.scenarioId || 'unnamed');
  }

  out.push(`${failed.length} failing scenario(s) grouped into ${byReason.size} recorded pattern(s).\n`);
  let index = 0;
  for (const [reason, ids] of [...byReason.entries()].sort((a, b) => b[1].length - a[1].length)) {
    index += 1;
    out.push(`## ${index}. ${reason}\n`);
    out.push(`Affects ${ids.length} scenario(s): ${ids.join(', ')}.\n`);
  }
  out.push('---\n');
  out.push('Grouping reflects only the reasons this run recorded. Scenarios whose reason was not captured are grouped together and need a re-run before they can be diagnosed.\n');
  return out.join('\n');
}

/**
 * The folder-level summary a reader meets first. It states the outcome and the
 * shape of the evidence, and nothing the record does not carry.
 *
 * @param {Object} report - Parsed report object.
 * @param {Object} [context] - Run-time paths the report itself does not carry.
 * @returns {string} Markdown document.
 */
function renderRunReadme(report, context = {}) {
  const rows = normalizedRows(report);
  const tally = tallyVerdicts(rows);
  const skill = report.targetSkill && report.targetSkill.id;
  const out = [];

  out.push(`# ${context.runLabel || `${skill || 'Skill'} benchmark run`}\n`);
  out.push(`> ${runHeading(report)}\n`);
  out.push(`**Verdict: ${report.verdict || NOT_RECORDED}**${report.aggregateScore != null ? ` · aggregate ${report.aggregateScore}/100` : ''}\n`);

  out.push('## Run');
  out.push('');
  out.push('| Field | Value |');
  out.push('|---|---|');
  out.push(`| Target skill | ${skill || NOT_RECORDED} |`);
  out.push(`| Scoring method | ${report.scoringMethod || NOT_RECORDED} |`);
  out.push(`| Trace mode | ${report.traceMode || NOT_RECORDED} |`);
  out.push(`| Executor | ${report.executor || NOT_RECORDED} |`);
  out.push(`| Model | ${report.model || NOT_RECORDED}${report.variant ? ` (${report.variant})` : ''} |`);
  out.push(`| Scenarios | ${rows.length} |`);
  out.push(`| Outcome tally | ${tally.length ? tally.map(([v, n]) => `${n} ${v}`).join(', ') : NOT_RECORDED} |`);
  out.push('');

  out.push('## Files');
  out.push('');
  out.push('| File | Contents |');
  out.push('|---|---|');
  out.push('| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |');
  out.push('| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | Rendered scoring report, regenerated from the JSON and never hand-edited |');
  out.push('| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |');
  out.push('| [`failed-runs.md`](./failed-runs.md) | Per-scenario failure detail, or a statement that none was captured |');
  out.push('| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded reason |');
  out.push('| [`source.md`](./source.md) | Where the corpus, the gold and the raw evidence live |');
  out.push('');

  out.push('## Reading This Folder');
  out.push('');
  out.push('This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the run record: a field this run did not capture reads as not recorded rather than being filled in.');
  out.push('');
  return out.join('\n');
}

/**
 * The authority and evidence map. Paths the report object does not carry are
 * supplied by the runner; anything still absent is stated as absent.
 *
 * @param {Object} report - Parsed report object.
 * @param {Object} [context] - Run-time paths the report itself does not carry.
 * @returns {string} Markdown document.
 */
function renderSource(report, context = {}) {
  const skill = report.targetSkill && report.targetSkill.id;
  const out = [];
  out.push(`# ${skill ? `${skill} ` : ''}Benchmark Sources\n`);
  out.push(`> ${runHeading(report)}\n`);
  out.push('This map separates the canonical contracts, the private gold, and the curated outputs in this folder.\n');

  out.push('| Resource | Purpose |');
  out.push('|---|---|');
  out.push(`| Target skill | \`${(report.targetSkill && (report.targetSkill.rootRel || report.targetSkill.root)) || NOT_RECORDED}\` |`);
  out.push(`| Scenario corpus | ${context.corpus ? `\`${context.corpus}\`` : NOT_RECORDED} |`);
  out.push(`| Scoring method | \`${report.scoringMethod || NOT_RECORDED}\` |`);
  out.push(`| Topology digest | \`${report.topologyDigest || NOT_RECORDED}\` |`);
  out.push('| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |');
  out.push('| Curated result set | [`results.csv`](./results.csv) |');
  out.push('');

  out.push('## Boundary');
  out.push('');
  out.push('The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.');
  out.push('');
  return out.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  renderReport,
  renderResultsCsv,
  renderFailedRuns,
  renderFindings,
  renderRunReadme,
  renderSource,
};
