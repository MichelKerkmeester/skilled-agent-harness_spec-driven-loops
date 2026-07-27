#!/usr/bin/env node
/**
 * scripts/synthesize-v2.cjs
 *
 * Reads 113/005/state/eval-loop-state-v2.jsonl, computes v2 ranking, compares
 * against 113/003 v1 synthesis, writes 113/005/synthesis-v2.md with verdict.
 */

const fs = require('fs');
const path = require('path');

const PACKET_ROOT = path.resolve(__dirname, '..');
const STATE_V2 = path.join(PACKET_ROOT, 'state', 'eval-loop-state-v2.jsonl');
const SYNTHESIS_V1 = path.resolve(PACKET_ROOT, '..', '003-eval-loop', 'synthesis.md');
const OUTPUT = path.join(PACKET_ROOT, 'synthesis-v2.md');

function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

function rankFromState(rows) {
  const variants = {};
  for (const r of rows) {
    if (r.type !== 'iteration') continue;
    const id = r.variantId;
    if (!variants[id]) variants[id] = { variantId: id, scores: [], runs: [] };
    variants[id].scores.push(r.variantScore);
    variants[id].runs.push(r.run);
  }
  return Object.values(variants).map((v) => ({
    ...v,
    bestScore: Math.max(...v.scores),
    avgScore: v.scores.reduce((a, b) => a + b, 0) / v.scores.length,
  })).sort((a, b) => b.bestScore - a.bestScore);
}

function aggregateExtraction(rows) {
  let written = 0;
  let skipped = 0;
  let total = 0;
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    for (const fr of r.fixtureResults) {
      total += 1;
      if (fr.extraction) {
        written += fr.extraction.written_count || 0;
        skipped += fr.extraction.skipped_count || 0;
      }
    }
  }
  return {
    total_fixture_results: total,
    files_written: written,
    blocks_skipped: skipped,
  };
}

function aggregateInteractions(rows) {
  let total = 0, d2d1 = 0, d4d1 = 0, d5d1 = 0;
  for (const r of rows) {
    if (r.type !== 'iteration' || !r.fixtureResults) continue;
    for (const fr of r.fixtureResults) {
      total += 1;
      const it = fr.interaction_terms || {};
      if (it.d2_x_d1_decoupled) d2d1++;
      if (it.d4_x_d1_inverse) d4d1++;
      if (it.d5_x_d1_inverse) d5d1++;
    }
  }
  return {
    d2_x_d1_decoupling_rate: total ? d2d1 / total : 0,
    d4_x_d1_inverse_rate: total ? d4d1 / total : 0,
    d5_x_d1_inverse_rate: total ? d5d1 / total : 0,
  };
}

// Parse v1 synthesis to extract ranking
function parseV1Ranking() {
  if (!fs.existsSync(SYNTHESIS_V1)) return [];
  const raw = fs.readFileSync(SYNTHESIS_V1, 'utf8');
  const lines = raw.split('\n');
  const rows = [];
  let inTable = false;
  for (const line of lines) {
    if (line.includes('| Rank | Variant | Best score')) { inTable = true; continue; }
    if (inTable) {
      if (line.startsWith('| ') && !line.includes('---')) {
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 3) {
          rows.push({ rank: cells[0], variantId: cells[1], bestScore: parseFloat(cells[2]) });
        }
      } else if (line.trim() === '' || line.startsWith('## ')) {
        break;
      }
    }
  }
  return rows;
}

function writeSynthesis() {
  const rows = readJsonl(STATE_V2);
  const v2Ranking = rankFromState(rows);
  const v1Ranking = parseV1Ranking();
  const extraction = aggregateExtraction(rows);
  const interactions = aggregateInteractions(rows);
  const itersCount = rows.filter((r) => r.type === 'iteration').length;

  const v1Winner = v1Ranking[0];
  const v2Winner = v2Ranking[0];
  const sameWinner = v1Winner && v2Winner && v1Winner.variantId === v2Winner.variantId;
  const verdict = sameWinner ? 'ranking stable: ' + v2Winner.variantId + ' still wins' :
    v2Winner && v1Winner ? 'ranking shifted: v1 winner ' + v1Winner.variantId + ' -> v2 winner ' + v2Winner.variantId :
    'no winner determined';

  const lines = [
    '# Synthesis v2 — cli-devin SWE 1.6 re-run with file extraction + live grader',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    `**Iterations completed**: ${itersCount}`,
    `**Files extracted**: ${extraction.files_written} across ${extraction.total_fixture_results} fixture-result rows`,
    `**Blocks skipped (no path inferred)**: ${extraction.blocks_skipped}`,
    `**Final verdict**: ${verdict}`,
    '',
    '## v1 vs v2 ranking comparison',
    '',
    '| Rank | v1 (text-only, mocked grader) | v2 (extraction + live grader) | Score delta |',
    '|------|-------------------------------|-------------------------------|-------------|',
  ];
  const maxRows = Math.max(v1Ranking.length, v2Ranking.length);
  for (let i = 0; i < maxRows; i++) {
    const v1 = v1Ranking[i];
    const v2 = v2Ranking[i];
    const v1Cell = v1 ? `${v1.variantId} (${v1.bestScore.toFixed(4)})` : '—';
    const v2Cell = v2 ? `${v2.variantId} (${v2.bestScore.toFixed(4)})` : '—';
    const delta = (v1 && v2) ? (v2.bestScore - v1.bestScore).toFixed(4) : '—';
    lines.push(`| ${i + 1} | ${v1Cell} | ${v2Cell} | ${delta} |`);
  }
  lines.push('');

  lines.push('## v2 detailed rankings');
  lines.push('');
  lines.push('| Variant | Best score | Avg score | Sample count |');
  lines.push('|---------|------------|-----------|--------------|');
  for (const v of v2Ranking) {
    lines.push(`| ${v.variantId} | ${v.bestScore.toFixed(4)} | ${v.avgScore.toFixed(4)} | ${v.scores.length} |`);
  }
  lines.push('');

  lines.push('## Interaction-term diagnostics (v2)');
  lines.push('');
  lines.push(`- **D2×D1 decoupling rate**: ${(interactions.d2_x_d1_decoupling_rate * 100).toFixed(1)}%`);
  lines.push(`- **D4×D1 inverse rate**: ${(interactions.d4_x_d1_inverse_rate * 100).toFixed(1)}% (v1 was 59.5% — extraction should reduce this)`);
  lines.push(`- **D5×D1 inverse rate**: ${(interactions.d5_x_d1_inverse_rate * 100).toFixed(1)}%`);
  lines.push('');

  lines.push('## Verdict for cli-devin v1.0.6.0');
  lines.push('');
  if (sameWinner) {
    lines.push(`**Ranking stable** — ${v2Winner.variantId} wins under both text-only (v1) and full-D1 (v2) scoring regimes. The 113/004 RCAF default is confirmed. **No v1.0.6.0 uplift needed.**`);
  } else if (v2Winner && v1Winner) {
    lines.push(`**Ranking shifted** — v1 winner ${v1Winner.variantId} no longer leads under full-D1 scoring. New winner: ${v2Winner.variantId} (${v2Winner.bestScore.toFixed(4)}).`);
    lines.push('');
    lines.push('**Recommend cli-devin v1.0.6.0 uplift**: apply ' + v2Winner.variantId + ' as the new default. See `cli-devin-v1.0.6.0-draft.md` for the draft changelog.');
  } else {
    lines.push('**Inconclusive** — verify state-v2.jsonl is complete; consider re-running.');
  }
  lines.push('');

  fs.writeFileSync(OUTPUT, lines.join('\n') + '\n');
  return { output: OUTPUT, sameWinner, v1Winner, v2Winner, lineCount: lines.length };
}

function main() {
  const result = writeSynthesis();
  process.stdout.write(`synthesis-v2.md written: ${result.output}\n`);
  process.stdout.write(`  verdict: ${result.sameWinner ? 'ranking stable' : 'ranking shifted'}\n`);
  if (result.v1Winner) process.stdout.write(`  v1 winner: ${result.v1Winner.variantId}\n`);
  if (result.v2Winner) process.stdout.write(`  v2 winner: ${result.v2Winner.variantId}\n`);
}

if (require.main === module) main();

module.exports = { writeSynthesis };
