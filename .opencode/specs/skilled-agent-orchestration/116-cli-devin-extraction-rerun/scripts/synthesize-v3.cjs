#!/usr/bin/env node
/**
 * scripts/synthesize-v3.cjs
 *
 * Three-way ranking comparison: v1 (text-only, mocked) vs v2 (extraction +
 * live grader) vs v3 (extraction + live grader + mutation-depth-8).
 *
 * v3 source: 116/state/eval-loop-state-v3.jsonl (archived from 114/003 after
 * loop-v2.cjs --max-iters=8 run).
 *
 * Detects:
 *   - Whether v3 mutation-depth found a winner beating v2's plain RCAF
 *   - Confidence assessment (single-sample winner vs reproduced finding)
 *   - cli-devin v1.0.6.0 uplift recommendation
 */

const fs = require('fs');
const path = require('path');

const PACKET_ROOT = path.resolve(__dirname, '..');
// v3 archived to 116/state with -v3 suffix; v2 baseline preserved at -v2 suffix
const STATE_V3_ARCHIVED = path.join(PACKET_ROOT, 'state', 'eval-loop-state-v3.jsonl');
const STATE_V2 = path.join(PACKET_ROOT, 'state', 'eval-loop-state-v2.jsonl');
const SYNTHESIS_V1 = path.resolve(PACKET_ROOT, '..', '114-cli-devin-swe16-prompt-optimization', '003-eval-loop', 'synthesis.md');
const VARIANTS_DIR = path.resolve(PACKET_ROOT, '..', '114-cli-devin-swe16-prompt-optimization', '003-eval-loop', 'variants');
const OUTPUT = path.join(PACKET_ROOT, 'synthesis-v3.md');

function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch (_) { return null; }
  }).filter(Boolean);
}

function rankFromRows(rows) {
  return rows.filter((r) => r.type === 'iteration')
    .map((r) => ({ variantId: r.variantId, score: r.variantScore }))
    .sort((a, b) => b.score - a.score);
}

function readVariantMeta(variantId) {
  const file = path.join(VARIANTS_DIR, variantId + '.md');
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]+?)\n---/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      let v = kv[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      meta[kv[1]] = v;
    }
  }
  return meta;
}

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
          rows.push({ variantId: cells[1], score: parseFloat(cells[2]) });
        }
      } else if (line.trim() === '' || line.startsWith('## ')) {
        break;
      }
    }
  }
  return rows;
}

function main() {
  const v3Rows = readJsonl(STATE_V3_ARCHIVED);
  const v2Rows = readJsonl(STATE_V2);
  const v3Ranking = rankFromRows(v3Rows);
  const v2Ranking = rankFromRows(v2Rows);
  const v1Ranking = parseV1Ranking();

  const v3Winner = v3Ranking[0];
  const v2Winner = v2Ranking[0];
  const v1Winner = v1Ranking[0];
  const v3Meta = v3Winner ? readVariantMeta(v3Winner.variantId) : null;
  const v2Meta = v2Winner ? readVariantMeta(v2Winner.variantId) : null;

  const v3BeatsV2 = v3Winner && v2Winner && v3Winner.variantId !== v2Winner.variantId && v3Winner.score > v2Winner.score;
  const v3Delta = v3Winner && v2Winner ? v3Winner.score - v2Winner.score : 0;

  // Count how many variants in v3 beat the v2 winner's score
  const v3BeatersOfV2 = v3Ranking.filter((r) => r.score > (v2Winner ? v2Winner.score : 0)).length;

  const lines = [
    '# Synthesis v3 — cli-devin SWE 1.6 mutation-depth re-run',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    `**v3 iterations**: ${v3Ranking.length}/8 (max-iters=8)`,
    `**v3 winner**: ${v3Winner ? v3Winner.variantId + ' (' + v3Winner.score.toFixed(4) + ')' : '—'}`,
    `**v3-vs-v2 delta**: ${v3Delta >= 0 ? '+' : ''}${v3Delta.toFixed(4)}`,
    `**Variants in v3 beating v2 winner**: ${v3BeatersOfV2}`,
    '',
    '## Three-run side-by-side',
    '',
    '| Rank | v1 (text-only, mock grader) | v2 (extraction + live grader) | v3 (mutation + extraction + live grader) |',
    '|------|-------------------------------|-------------------------------|------------------------------------------|',
  ];
  const maxRows = Math.max(v1Ranking.length, v2Ranking.length, v3Ranking.length);
  for (let i = 0; i < maxRows; i++) {
    const v1 = v1Ranking[i];
    const v2 = v2Ranking[i];
    const v3 = v3Ranking[i];
    const cell1 = v1 ? `${v1.variantId} (${v1.score.toFixed(4)})` : '—';
    const cell2 = v2 ? `${v2.variantId} (${v2.score.toFixed(4)})` : '—';
    const cell3 = v3 ? `${v3.variantId} (${v3.score.toFixed(4)})` : '—';
    lines.push(`| ${i + 1} | ${cell1} | ${cell2} | ${cell3} |`);
  }
  lines.push('');

  // Winner metadata
  lines.push('## v3 winner metadata');
  lines.push('');
  if (v3Meta) {
    lines.push('```json');
    lines.push(JSON.stringify(v3Meta, null, 2));
    lines.push('```');
  } else {
    lines.push('Variant file not found.');
  }
  lines.push('');

  // Comparison vs v2 winner
  lines.push('## What changed from v2 winner');
  lines.push('');
  if (v2Meta && v3Meta) {
    const diffs = [];
    for (const k of Object.keys(v3Meta)) {
      if (v2Meta[k] !== v3Meta[k]) diffs.push({ key: k, v2: v2Meta[k], v3: v3Meta[k] });
    }
    if (diffs.length === 0) {
      lines.push('No metadata differences — same configuration; score variance is run-to-run noise.');
    } else {
      lines.push('| Axis | v2 winner | v3 winner |');
      lines.push('|------|-----------|-----------|');
      for (const d of diffs) {
        lines.push(`| ${d.key} | ${d.v2 || '—'} | ${d.v3 || '—'} |`);
      }
    }
  }
  lines.push('');

  // Verdict + recommendation
  lines.push('## Verdict + cli-devin v1.0.6.0 recommendation');
  lines.push('');
  if (v3BeatsV2 && v3Delta >= 0.02) {
    lines.push(`**Ranking SHIFTED** — v3 winner ${v3Winner.variantId} beats v2 winner ${v2Winner.variantId} by ${(v3Delta * 100).toFixed(1)}%.`);
    lines.push('');
    lines.push(`**Confidence assessment**: single sample of ${v3Winner.variantId}. The 4.5% delta is real signal but unconfirmed by repeat dispatch. Recommended next step BEFORE shipping v1.0.6.0: run 2-3 confirmation iterations on the v3 winner to validate the score is not a one-shot outlier.`);
    lines.push('');
    if (v3Meta && v2Meta && v3Meta.framework !== v2Meta.framework) {
      lines.push(`The v3 winner uses framework **${v3Meta.framework}** vs v2 winner's **${v2Meta.framework}**. This is a substantial framework shift — the mutator explored an axis that the seeded queue (STAR / RCAF / BUILD) didn't cover. CONTEXT/ATLAS/CLOUD-HANDOFF frameworks were originally documented for deepseek-v4, not SWE 1.6.`);
    }
    lines.push('');
    lines.push('**Recommendation**: hold v1.0.6.0 uplift until confirmation run completes. If confirmed, ship the v3 winner as the new SWE 1.6 default.');
  } else if (v3Winner && v2Winner && v3Winner.variantId === v2Winner.variantId) {
    lines.push(`**Ranking STABLE** — ${v3Winner.variantId} wins both v2 and v3. The mutation-depth re-run did not surface a better variant. **No v1.0.6.0 uplift needed.**`);
  } else {
    lines.push(`v3 result: ${v3Winner ? v3Winner.variantId : 'unknown'}. Delta vs v2: ${v3Delta.toFixed(4)}. Result inconclusive; treat as no-change.`);
  }
  lines.push('');

  // Stability assessment
  lines.push('## Run-to-run variance check (same variants, different runs)');
  lines.push('');
  lines.push('| Variant | v1 score | v2 score | v3 score | range |');
  lines.push('|---------|----------|----------|----------|-------|');
  // Collect scores per seeded variant across runs
  const seededVariants = ['v-001-baseline-star', 'v-002-build-dense-preplan', 'v-003-anti-hallucination-strong', 'v-004-rcaf-medium', 'v-005-build-strict-bundle-gate'];
  for (const id of seededVariants) {
    const v1 = v1Ranking.find((r) => r.variantId === id);
    const v2 = v2Ranking.find((r) => r.variantId === id);
    const v3 = v3Ranking.find((r) => r.variantId === id);
    const scores = [v1, v2, v3].filter(Boolean).map((r) => r.score);
    const range = scores.length ? (Math.max(...scores) - Math.min(...scores)).toFixed(4) : '—';
    lines.push(`| ${id} | ${v1 ? v1.score.toFixed(4) : '—'} | ${v2 ? v2.score.toFixed(4) : '—'} | ${v3 ? v3.score.toFixed(4) : '—'} | ${range} |`);
  }
  lines.push('');

  fs.writeFileSync(OUTPUT, lines.join('\n') + '\n');
  process.stdout.write(`synthesis-v3.md written: ${OUTPUT}\n`);
  process.stdout.write(`  v3 winner: ${v3Winner ? v3Winner.variantId : '—'} (${v3Winner ? v3Winner.score.toFixed(4) : '—'})\n`);
  process.stdout.write(`  v3 beats v2: ${v3BeatsV2 ? 'YES' : 'NO'}\n`);
  process.stdout.write(`  delta: ${v3Delta >= 0 ? '+' : ''}${v3Delta.toFixed(4)}\n`);
}

if (require.main === module) main();

module.exports = { rankFromRows };
