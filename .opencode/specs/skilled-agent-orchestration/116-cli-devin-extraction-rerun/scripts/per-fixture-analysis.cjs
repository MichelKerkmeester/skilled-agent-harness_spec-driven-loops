#!/usr/bin/env node
/**
 * scripts/per-fixture-analysis.cjs
 *
 * Computes per-fixture v1 vs v2 score deltas and identifies per-fixture
 * winners. Surfaces "RCAF wins overall but variant X dominates fixture Y"
 * patterns that aggregate ranking hides.
 *
 * Inputs:
 *   - 114/003/state/eval-loop-state.jsonl (v1 — text-only, mocked grader)
 *   - 116/state/eval-loop-state-v2.jsonl  (v2 — extraction + live grader)
 *
 * Output:
 *   - 116/per-fixture-analysis.md
 */

const fs = require('fs');
const path = require('path');

const PACKET_ROOT = path.resolve(__dirname, '..');
const STATE_V1 = path.resolve(PACKET_ROOT, '..', '114-cli-devin-swe16-prompt-optimization', '003-eval-loop', 'state', 'eval-loop-state.jsonl');
const STATE_V2 = path.join(PACKET_ROOT, 'state', 'eval-loop-state-v2.jsonl');
const OUTPUT = path.join(PACKET_ROOT, 'per-fixture-analysis.md');

function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

function buildScoreMatrix(rows) {
  // Returns { [variantId]: { [fixtureId]: weightedScore } }
  const m = {};
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    if (!m[r.variantId]) m[r.variantId] = {};
    for (const fr of r.fixtureResults) {
      m[r.variantId][fr.fixtureId] = fr.weightedScore;
    }
  }
  return m;
}

function buildExtractionMatrix(rows) {
  const m = {};
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    if (!m[r.variantId]) m[r.variantId] = {};
    for (const fr of r.fixtureResults) {
      m[r.variantId][fr.fixtureId] = fr.extraction ? fr.extraction.written_count : 0;
    }
  }
  return m;
}

function main() {
  const v1Rows = readJsonl(STATE_V1);
  const v2Rows = readJsonl(STATE_V2);
  const v1Matrix = buildScoreMatrix(v1Rows);
  const v2Matrix = buildScoreMatrix(v2Rows);
  const v2Ext = buildExtractionMatrix(v2Rows);

  // Get fixture list from v2 (canonical)
  const fixtures = new Set();
  for (const v of Object.values(v2Matrix)) Object.keys(v).forEach((f) => fixtures.add(f));
  const fixtureList = Array.from(fixtures).sort();

  // Get variant list from v2 ordered by variant-aggregate (mean of fixture scores),
  // which matches synthesis-v2's ranking.
  const variantsByBest = Object.entries(v2Matrix).map(([id, scores]) => {
    const vals = Object.values(scores);
    const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
    return { id, mean };
  }).sort((a, b) => b.mean - a.mean).map((v) => v.id);

  const lines = [
    '# Per-fixture D1 unlock analysis — 116 follow-on',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    '**Source**: 114/003/state.jsonl (v1) + 116/state/eval-loop-state-v2.jsonl (v2)',
    '',
    '## Per-fixture × variant scores (v2)',
    '',
    'Each cell shows the v2 weightedScore. **Bold** = fixture-level winner.',
    '',
    '| Fixture | ' + variantsByBest.join(' | ') + ' |',
    '|---------| ' + variantsByBest.map(() => '---').join(' | ') + ' |',
  ];

  // Per-fixture-winner table
  const fixtureWinners = {};
  for (const fixture of fixtureList) {
    const cells = [fixture];
    let best = -Infinity;
    let bestVar = null;
    for (const v of variantsByBest) {
      const s = v2Matrix[v] && v2Matrix[v][fixture];
      if (s !== undefined && s > best) { best = s; bestVar = v; }
    }
    fixtureWinners[fixture] = bestVar;
    for (const v of variantsByBest) {
      const s = v2Matrix[v] && v2Matrix[v][fixture];
      const cell = s === undefined ? '-' : s.toFixed(3);
      cells.push(v === bestVar ? `**${cell}**` : cell);
    }
    lines.push('| ' + cells.join(' | ') + ' |');
  }
  lines.push('');

  // Per-variant fixture-win count
  lines.push('## Variant fixture-win count');
  lines.push('');
  lines.push('| Variant | Fixtures won (v2) |');
  lines.push('|---------|-------------------|');
  const winCounts = {};
  for (const v of variantsByBest) winCounts[v] = 0;
  for (const w of Object.values(fixtureWinners)) winCounts[w] = (winCounts[w] || 0) + 1;
  for (const v of variantsByBest) {
    lines.push(`| ${v} | ${winCounts[v] || 0} / ${fixtureList.length} |`);
  }
  lines.push('');

  // v1 vs v2 delta table
  lines.push('## v1 vs v2 score deltas per fixture × variant');
  lines.push('');
  lines.push('Each cell shows `v2 - v1` (positive = extraction + live grader lifted; negative = dropped).');
  lines.push('');
  lines.push('| Fixture | ' + variantsByBest.join(' | ') + ' |');
  lines.push('|---------| ' + variantsByBest.map(() => '---').join(' | ') + ' |');
  for (const fixture of fixtureList) {
    const cells = [fixture];
    for (const v of variantsByBest) {
      const v1s = v1Matrix[v] && v1Matrix[v][fixture];
      const v2s = v2Matrix[v] && v2Matrix[v][fixture];
      if (v1s === undefined || v2s === undefined) {
        cells.push('-');
      } else {
        const d = v2s - v1s;
        cells.push((d >= 0 ? '+' : '') + d.toFixed(3));
      }
    }
    lines.push('| ' + cells.join(' | ') + ' |');
  }
  lines.push('');

  // Extraction count per fixture × variant
  lines.push('## Files extracted per fixture × variant (v2)');
  lines.push('');
  lines.push('| Fixture | ' + variantsByBest.join(' | ') + ' |');
  lines.push('|---------| ' + variantsByBest.map(() => '---').join(' | ') + ' |');
  for (const fixture of fixtureList) {
    const cells = [fixture];
    for (const v of variantsByBest) {
      const ext = v2Ext[v] && v2Ext[v][fixture];
      cells.push(ext === undefined ? '-' : String(ext));
    }
    lines.push('| ' + cells.join(' | ') + ' |');
  }
  lines.push('');

  // Key findings — surface "RCAF wins overall but variant X dominates fixture Y" patterns
  lines.push('## Key per-fixture findings');
  lines.push('');
  const overallWinner = variantsByBest[0];
  for (const fixture of fixtureList) {
    const winner = fixtureWinners[fixture];
    if (winner && winner !== overallWinner) {
      const winnerScore = v2Matrix[winner][fixture];
      const overallScore = v2Matrix[overallWinner] && v2Matrix[overallWinner][fixture];
      const delta = overallScore !== undefined ? (winnerScore - overallScore).toFixed(3) : 'n/a';
      lines.push(`- **${fixture}**: dominated by **${winner}** (${winnerScore.toFixed(3)}); overall winner ${overallWinner} only scored ${overallScore !== undefined ? overallScore.toFixed(3) : 'n/a'} here (Δ ${delta}). Possible improvement: tune ${overallWinner} on this fixture's failure pattern.`);
    }
  }
  if (!fixtureList.some((f) => fixtureWinners[f] !== overallWinner)) {
    lines.push(`- **${overallWinner}** wins every fixture. The aggregate ranking is not hiding any per-fixture surprises.`);
  }
  lines.push('');

  // v1 vs v2 fixture deltas — surface where extraction helped most/least
  lines.push('## Where extraction + live grader changed scores most');
  lines.push('');
  const deltas = [];
  for (const v of variantsByBest) {
    for (const fixture of fixtureList) {
      const v1s = v1Matrix[v] && v1Matrix[v][fixture];
      const v2s = v2Matrix[v] && v2Matrix[v][fixture];
      if (v1s !== undefined && v2s !== undefined) {
        deltas.push({ variant: v, fixture, v1: v1s, v2: v2s, delta: v2s - v1s });
      }
    }
  }
  deltas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  lines.push('Top-5 absolute deltas:');
  lines.push('');
  for (const d of deltas.slice(0, 5)) {
    lines.push(`- ${d.variant} on ${d.fixture}: ${d.v1.toFixed(3)} → ${d.v2.toFixed(3)} (${d.delta >= 0 ? '+' : ''}${d.delta.toFixed(3)})`);
  }
  lines.push('');

  // Verdict
  lines.push('## Verdict');
  lines.push('');
  const aggregateRankingStable = variantsByBest[0] === overallWinner;
  if (Object.values(fixtureWinners).every((w) => w === overallWinner)) {
    lines.push(`${overallWinner} wins every fixture under v2 scoring. The aggregate ranking is robust and per-fixture analysis reveals no hidden variant strength. **No additional uplift recommended.**`);
  } else {
    const dominated = Object.entries(fixtureWinners).filter(([, w]) => w !== overallWinner);
    lines.push(`${overallWinner} wins the aggregate but does NOT dominate all fixtures (${dominated.length}/${fixtureList.length} fixtures have a different winner). The cli-devin v1.0.5.0 RCAF default is correct for the average case; for specific fixture clusters (${dominated.map(([f]) => f).join(', ')}), a future packet could explore fixture-specific framework recommendations.`);
  }

  fs.writeFileSync(OUTPUT, lines.join('\n') + '\n');
  process.stdout.write(`per-fixture-analysis.md written: ${OUTPUT}\n`);
  process.stdout.write(`  overall winner: ${overallWinner}\n`);
  process.stdout.write(`  fixtures won by overall winner: ${Object.values(fixtureWinners).filter((w) => w === overallWinner).length}/${fixtureList.length}\n`);
}

if (require.main === module) main();

module.exports = { buildScoreMatrix, buildExtractionMatrix };
