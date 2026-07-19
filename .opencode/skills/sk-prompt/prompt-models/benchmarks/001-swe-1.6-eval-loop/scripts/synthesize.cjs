#!/usr/bin/env node
/**
 * scripts/synthesize.cjs
 *
 * Final synthesis writer. Reads the iteration state + best-variant + mutation
 * coverage, ranks variants, computes interaction-term diagnostics, writes
 * synthesis.md — the binding handoff for 004-skill-uplift.
 */

const fs = require('fs');
const path = require('path');

const PACKET_ROOT = path.resolve(__dirname, '..');

function readState(statePath) {
  if (!fs.existsSync(statePath)) return [];
  return fs.readFileSync(statePath, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

function rankVariants(rows) {
  const variants = {};
  for (const r of rows) {
    if (r.type !== 'iteration') continue;
    const id = r.variantId;
    if (!variants[id]) {
      variants[id] = { variantId: id, scores: [], meta: r.mutationTo || r.parentVariantId, runs: [] };
    }
    variants[id].scores.push(r.variantScore);
    variants[id].runs.push(r.run);
  }
  const ranked = Object.values(variants).map((v) => ({
    ...v,
    bestScore: Math.max(...v.scores),
    avgScore: v.scores.reduce((a, b) => a + b, 0) / v.scores.length,
    sampleCount: v.scores.length,
  })).sort((a, b) => b.bestScore - a.bestScore);
  return ranked;
}

function aggregateInteractionTerms(rows) {
  let total = 0;
  let d2_x_d1_decoupled = 0;
  let d4_x_d1_inverse = 0;
  let d5_x_d1_inverse = 0;
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    for (const fr of r.fixtureResults) {
      total += 1;
      const it = fr.interaction_terms || {};
      if (it.d2_x_d1_decoupled) d2_x_d1_decoupled++;
      if (it.d4_x_d1_inverse) d4_x_d1_inverse++;
      if (it.d5_x_d1_inverse) d5_x_d1_inverse++;
    }
  }
  return {
    total_fixture_results: total,
    d2_x_d1_decoupling_rate: total ? d2_x_d1_decoupled / total : 0,
    d4_x_d1_inverse_rate: total ? d4_x_d1_inverse / total : 0,
    d5_x_d1_inverse_rate: total ? d5_x_d1_inverse / total : 0,
  };
}

function fixtureCoverage(rows) {
  const counts = {};
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    for (const fr of r.fixtureResults) {
      counts[fr.fixtureId] = (counts[fr.fixtureId] || 0) + 1;
    }
  }
  return counts;
}

function dispatchCounts(rows) {
  let cacheHits = 0;
  let dispatches = 0;
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    for (const fr of r.fixtureResults) {
      if (fr.cache_hit) cacheHits++;
      else dispatches++;
    }
  }
  return { dispatches, cache_hits: cacheHits };
}

function writeSynthesis(opts) {
  const { statePath, bestVariantPath, outputPath } = opts;
  const rows = readState(statePath);
  const best = bestVariantPath && fs.existsSync(bestVariantPath)
    ? JSON.parse(fs.readFileSync(bestVariantPath, 'utf8'))
    : null;
  const ranked = rankVariants(rows);
  const interactions = aggregateInteractionTerms(rows);
  const coverage = fixtureCoverage(rows);
  const counts = dispatchCounts(rows);
  const itersCount = rows.filter((r) => r.type === 'iteration').length;
  const convergedAt = rows.find((r) => r.type === 'converged');
  const pausedAt = rows.find((r) => r.type === 'paused');

  const top3 = ranked.slice(0, 3);

  const lines = [
    '# Synthesis — cli-devin SWE 1.6 prompt-optimization run',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    `**Iterations**: ${itersCount}`,
    `**Total SWE 1.6 dispatches**: ${counts.dispatches}`,
    `**Cache hits**: ${counts.cache_hits}`,
    `**Final outcome**: ${convergedAt ? `CONVERGED at iter ${convergedAt.at_iter}` : pausedAt ? `PAUSED at iter ${pausedAt.at_iter}` : 'BUDGET EXHAUSTED'}`,
    '',
    '## Top-ranked variants',
    '',
    '| Rank | Variant | Best score | Avg score | Sample count |',
    '|------|---------|------------|-----------|--------------|',
  ];
  top3.forEach((v, i) => {
    lines.push(`| ${i + 1} | ${v.variantId} | ${v.bestScore.toFixed(4)} | ${v.avgScore.toFixed(4)} | ${v.sampleCount} |`);
  });
  lines.push('');
  lines.push('## Winning variant');
  if (best) {
    lines.push(`**${best.variantId}** with score **${best.variantScore}** at iter ${best.at_iter}.`);
    lines.push('');
    lines.push('**Variant metadata** (the prompt-scaffolding configuration that won):');
    lines.push('```json');
    lines.push(JSON.stringify(best.meta || {}, null, 2));
    lines.push('```');
  } else {
    lines.push('No best variant recorded.');
  }
  lines.push('');

  lines.push('## Interaction-term diagnostics');
  lines.push('');
  lines.push(`- **D2×D1 decoupling rate**: ${(interactions.d2_x_d1_decoupling_rate * 100).toFixed(1)}% (high = bundle passes but acceptance fails; possible rubber-stamp)`);
  lines.push(`- **D4×D1 inverse rate**: ${(interactions.d4_x_d1_inverse_rate * 100).toFixed(1)}% (high = no hallucination but task too hard regardless of prompt)`);
  lines.push(`- **D5×D1 inverse rate**: ${(interactions.d5_x_d1_inverse_rate * 100).toFixed(1)}% (high = pre-plan present but scaffold not translating to correctness)`);
  lines.push('');

  lines.push('## Fixture coverage');
  lines.push('');
  lines.push('| Fixture | Variants scored |');
  lines.push('|---------|-----------------|');
  for (const [k, v] of Object.entries(coverage).sort()) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Insights for 004-skill-uplift');
  lines.push('');
  if (best) {
    const meta = best.meta || {};
    lines.push(`- Apply framework **${meta.framework || 'STAR'}** as the primary template in \`assets/prompt-templates.md\` §2 SWE-1.6.`);
    lines.push(`- Set pre-planning density to **${meta.preplanning_density || 'medium'}**.`);
    lines.push(`- Sequential_thinking threshold winning variant used: **${meta.thinking_threshold || '5'}** thoughts.`);
    lines.push(`- Bundle-gate strictness: **${meta.bundle_gate_strictness || 'standard'}**.`);
    lines.push(`- Anti-hallucination wording: **${meta.anti_hallucination_strength || 'standard'}**.`);
  } else {
    lines.push('- No winning variant; consider revising rubric or fixtures before retry.');
  }
  if (interactions.d2_x_d1_decoupling_rate > 0.2) {
    lines.push(`- **WARNING**: D2×D1 decoupling rate is ${(interactions.d2_x_d1_decoupling_rate * 100).toFixed(1)}%. Bundle-gate is rubber-stamping. Recommend tightening bundle-gate before 004 ships.`);
  }
  if (interactions.d4_x_d1_inverse_rate > 0.3) {
    lines.push(`- **NOTE**: D4×D1 inverse rate is ${(interactions.d4_x_d1_inverse_rate * 100).toFixed(1)}%. Fixtures may be too hard for SWE 1.6 regardless of prompt. Recommend reviewing fixture difficulty.`);
  }

  lines.push('');
  lines.push('## Handoff to 004-skill-uplift');
  lines.push('');
  lines.push('004 reads this file as the BINDING contract. Apply winners to:');
  lines.push('- `.opencode/skills/cli-devin/SKILL.md` (§2 SMART ROUTING + §4 RULES)');
  lines.push('- `.opencode/skills/cli-devin/assets/prompt-templates.md` (replace winners)');
  lines.push('- `.opencode/skills/cli-devin/assets/prompt-quality-card.md` (refine CLEAR cutoffs if needed)');
  lines.push('- `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` (new entry)');
  lines.push('');
  lines.push('Strict-validate after each authored doc write. No 4-runtime mirror (skill, not agent per ADR-001 in 004).');

  fs.writeFileSync(outputPath, lines.join('\n') + '\n');
  return { outputPath, lineCount: lines.length };
}

function main() {
  const args = process.argv.slice(2);
  const statePath = args[0] || path.join(PACKET_ROOT, 'state', 'eval-loop-state.jsonl');
  const bestPath = path.join(PACKET_ROOT, 'state', 'best-variant.json');
  const outputPath = path.join(PACKET_ROOT, 'synthesis.md');
  const result = writeSynthesis({ statePath, bestVariantPath: bestPath, outputPath });
  process.stdout.write(`synthesis.md written: ${result.outputPath} (${result.lineCount} lines)\n`);
}

if (require.main === module) main();

module.exports = { writeSynthesis, rankVariants, aggregateInteractionTerms };
