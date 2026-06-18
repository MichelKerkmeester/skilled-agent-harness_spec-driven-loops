#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// Confidence-calibration STARTER seed generator (CORPUS-DERIVED PROXY)
// ───────────────────────────────────────────────────────────────
// Emits two artifacts next to this script:
//   - confidence-labeled-set.starter.json   ({query, memoryId, relevant}[])
//   - confidence-calibration-model.starter.json   (fitted isotonic model)
//
// ⚠️ THIS IS A PROXY, NOT GROUND TRUTH. The "labels" are derived from the
// indexed spec corpus: a spec's own title/keywords become the query and that
// spec's memory is the positive; a different spec is the negative. The
// per-pair rawValue is a keyword Jaccard overlap — a weak stand-in for the
// real cosine confidence the live pipeline would assign. The fitted model is
// therefore UNVALIDATED and must not be trusted for production ranking.
//
// The real labeled set is ~50–100 human-judged pairs sampled from live
// `memory_search` traffic, joined to the rawValue the pipeline actually scored
// each pair. That collection is the documented follow-up; this seed only
// proves the fit/apply machinery end-to-end on representative shapes.
//
// Usage:  node fit-calibration.mjs [--limit N] [--specs <dir>]

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '../../../../../../../..'); // assets/ -> repo root (8 levels)
const args = process.argv.slice(2);
const limitArg = args.indexOf('--limit');
const PAIR_DOCS = limitArg >= 0 ? Number(args[limitArg + 1]) : 50; // 50 docs -> ~100 pairs
const specsArg = args.indexOf('--specs');
const SPECS_DIR = specsArg >= 0 ? args[specsArg + 1] : join(REPO_ROOT, '.opencode/specs');

// -- Corpus walk --

function findDescriptions(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        stack.push(p);
      } else if (e.name === 'description.json') {
        out.push(p);
      }
    }
  }
  return out;
}

function loadDoc(path) {
  try {
    const d = JSON.parse(readFileSync(path, 'utf8'));
    const keywords = Array.isArray(d.keywords)
      ? d.keywords.filter((k) => typeof k === 'string' && k.length > 2)
      : [];
    const description = typeof d.description === 'string' ? d.description : '';
    if (keywords.length < 4 || description.length < 40) return null;
    return {
      id: relative(REPO_ROOT, dirname(path)),
      slug: typeof d.folderSlug === 'string' ? d.folderSlug : '',
      keywords,
    };
  } catch {
    return null;
  }
}

// -- Proxy rawValue: keyword Jaccard overlap (weak stand-in for cosine) --

function jaccard(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function queryTerms(doc) {
  // The query is the doc's own leading keywords — the "title/anchor phrase as
  // query" proxy. Deliberately a SUBSET so the positive overlap is high but < 1.
  return doc.keywords.slice(0, 6);
}

// -- Isotonic fit (PAV), mirrors lib/search/confidence-calibration.ts --

function fitCalibration(samples) {
  const clean = samples
    .filter((s) => Number.isFinite(s.rawValue) && (s.relevant === 0 || s.relevant === 1))
    .map((s) => ({ x: Math.max(0, Math.min(1, s.rawValue)), y: s.relevant }))
    .sort((a, b) => a.x - b.x);
  if (clean.length === 0) return { method: 'isotonic', points: [], fittedFrom: 0 };
  const blocks = [];
  for (const { x, y } of clean) {
    blocks.push({ sumX: x, sumY: y, count: 1 });
    while (blocks.length >= 2) {
      const curr = blocks[blocks.length - 1];
      const prev = blocks[blocks.length - 2];
      if (prev.sumY / prev.count <= curr.sumY / curr.count) break;
      prev.sumX += curr.sumX;
      prev.sumY += curr.sumY;
      prev.count += curr.count;
      blocks.pop();
    }
  }
  return {
    method: 'isotonic',
    points: blocks.map((b) => ({
      x: b.sumX / b.count,
      y: Math.max(0, Math.min(1, b.sumY / b.count)),
    })),
    fittedFrom: clean.length,
  };
}

// -- Build --

const docs = findDescriptions(SPECS_DIR)
  .map(loadDoc)
  .filter(Boolean);

// Stable selection (sorted by id) so reruns are deterministic.
docs.sort((a, b) => a.id.localeCompare(b.id));
const seen = new Set();
const selected = [];
for (const d of docs) {
  if (seen.has(d.slug)) continue;
  seen.add(d.slug);
  selected.push(d);
  if (selected.length >= PAIR_DOCS) break;
}

const labeled = [];
const samples = [];
for (let i = 0; i < selected.length; i++) {
  const doc = selected[i];
  const q = queryTerms(doc);
  const query = q.join(' ');
  // Positive: the doc's own memory. rawValue = overlap(query, its own keywords).
  const pos = jaccard(q, doc.keywords);
  labeled.push({ query, memoryId: doc.id, relevant: 1 });
  samples.push({ rawValue: pos, relevant: 1 });
  // Negative: a different doc, picked far away in the sorted list to minimize
  // accidental topical overlap.
  const neg = selected[(i + Math.floor(selected.length / 2)) % selected.length];
  if (neg && neg.id !== doc.id) {
    const negVal = jaccard(q, neg.keywords);
    labeled.push({ query, memoryId: neg.id, relevant: 0 });
    samples.push({ rawValue: negVal, relevant: 0 });
  }
}

const model = fitCalibration(samples);

const labeledPath = join(HERE, 'confidence-labeled-set.starter.json');
const modelPath = join(HERE, 'confidence-calibration-model.starter.json');

writeFileSync(
  labeledPath,
  JSON.stringify(
    {
      _note:
        'CORPUS-DERIVED PROXY, NOT human-judged traffic. Spec keywords as query, the spec memory as positive, a mismatched spec as negative. Replace with ~50-100 labeled pairs from live memory_search before trusting any fitted model.',
      generatedFrom: relative(REPO_ROOT, SPECS_DIR),
      docCount: selected.length,
      pairs: labeled,
    },
    null,
    2,
  ),
);

writeFileSync(
  modelPath,
  JSON.stringify(
    {
      ...model,
      _note:
        'UNVALIDATED: fitted from a keyword-overlap PROXY rawValue, not real pipeline cosine confidence. Demonstrates the fit/apply pipeline only. Do NOT wire as a production model (SPECKIT_CONFIDENCE_CALIBRATION stays OFF) until refit from live labeled traffic.',
    },
    null,
    2,
  ),
);

console.log(`labeled pairs: ${labeled.length} (${selected.length} docs)`);
console.log(`model blocks:  ${model.points.length} (fittedFrom ${model.fittedFrom})`);
console.log(`wrote ${relative(REPO_ROOT, labeledPath)}`);
console.log(`wrote ${relative(REPO_ROOT, modelPath)}`);
