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

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render the human-readable report.md from a machine report object.
 * @param {Object} report - Parsed report.json object (scores, funnel, scenarios, etc.).
 * @returns {string} Markdown document rendered deterministically from the report.
 */
function renderReport(report) {
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
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { renderReport };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.report) {
    process.stderr.write('usage: build-report.cjs --report <report.json> [--output <report.md>]\n');
    process.exit(2);
  }
  const report = JSON.parse(fs.readFileSync(args.report, 'utf8'));
  const md = renderReport(report);
  if (args.output) { fs.writeFileSync(args.output, md); process.stdout.write(`wrote ${args.output}\n`); }
  else process.stdout.write(md + '\n');
  process.exit(0);
}
