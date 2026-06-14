#!/usr/bin/env node
'use strict';
// Host-side iteration writer for the deep-context sweep in this packet.
// Consumes the host-merge.cjs result and produces the canonical per-iteration
// artifacts: iteration narrative, state-log appends (sweep_settled + iteration),
// the delta JSONL, and coverage-graph node/edge payloads for upsert.cjs.
// Single-writer: only the host runs this; seats and the reducer never do.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha1(s) { return crypto.createHash('sha1').update(s).digest('hex').slice(0, 16); }

function main() {
  const [, , contextDir, iterStr, focusLabel, mergePath, durationMsStr, sessionId, sliceFilesCsv] = process.argv;
  if (!contextDir || !iterStr || !mergePath) {
    console.error('usage: host-write-iteration.cjs <contextDir> <N> <focusLabel> <mergeJson> <durationMs> <sessionId> [sliceCsv]');
    process.exit(2);
  }
  const N = Number(iterStr);
  const NNN = String(N).padStart(3, '0');
  const merge = JSON.parse(fs.readFileSync(mergePath, 'utf8'));
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const durationMs = Number(durationMsStr) || 0;
  const sliceFiles = (sliceFilesCsv || '').split(',').map((s) => s.trim()).filter(Boolean);

  const deps = merge.keptUnits.filter((u) => u.kind === 'dependency');
  const depsWithNotes = deps.filter((u) => u.notes && u.notes.length > 10);
  const dependencyCompleteness = deps.length ? Number((depsWithNotes.length / deps.length).toFixed(3)) : 0;

  // cumulative agreement-eligible = prior + new (registry recomputes exactly later)
  let cumulative = merge.agreementEligibleThisIter;
  const stateLog = path.join(contextDir, 'deep-context-state.jsonl');
  for (const line of fs.readFileSync(stateLog, 'utf8').split('\n')) {
    try {
      const r = JSON.parse(line);
      if (r.type === 'iteration' && Number.isFinite(r.agreementEligible)) cumulative = r.agreementEligible + merge.newAgreementEligible;
    } catch { /* skip */ }
  }

  // 1. iteration narrative
  const topAgreed = merge.keptUnits.filter((u) => u.agreement >= 2).slice(0, 12);
  const narrative = [
    `# Iteration ${N}: ${focusLabel}`,
    '',
    `## Focus`,
    `${focusLabel} (${sliceFiles.length} slice files, shared across all seats)`,
    '',
    `## Per-Seat Contribution`,
    `Succeeded: ${merge.seatsSucceeded.join(', ') || 'none'} | Failed: ${merge.seatsFailed.join(', ') || 'none'}`,
    '',
    `## Merged Findings (relevance-gated at 0.55)`,
    `Kept ${merge.mergedFindingsCount} units (${merge.marginalCount} marginal in [0.40,0.55)); ${merge.agreementEligibleThisIter} agreement-eligible (>=2 seats), ${merge.newAgreementEligible} new this iteration.`,
    '',
    `### Agreement-eligible units`,
    ...topAgreed.map((u) => `- [${u.agreement}x] \`${u.path}\` :: \`${u.symbol}\` (${u.kind}, rel ${u.relevance}) — ${u.notes}`),
    '',
    `## Coverage`,
    `sliceCoverage ${merge.sliceCoverage} · agreementRate ${merge.agreementRate.toFixed(3)} · relevanceFloor ${merge.relevanceFloor} · reuseCatalogCoverage ${merge.reuseCatalogCoverage}`,
    '',
  ].join('\n');
  fs.mkdirSync(path.join(contextDir, 'iterations'), { recursive: true });
  fs.writeFileSync(path.join(contextDir, 'iterations', `iteration-${NNN}.md`), narrative);

  // 2. state-log appends
  const sweepEvent = {
    type: 'event', event: 'sweep_settled', mode: 'context', run: N,
    focusSliceCount: sliceFiles.length, seatsSucceeded: merge.seatsSucceeded, seatsFailed: merge.seatsFailed,
    timestamp: now, sessionId, generation: 1,
  };
  const iterRecord = {
    type: 'iteration', run: N, mode: 'context', status: 'evidence', focus: focusLabel,
    findingsCount: merge.mergedFindingsCount, newAgreementEligible: merge.newAgreementEligible,
    agreementEligible: cumulative, sliceCoverage: merge.sliceCoverage,
    reuseCatalogCoverage: merge.reuseCatalogCoverage, agreementRate: Number(merge.agreementRate.toFixed(3)),
    relevanceFloor: merge.relevanceFloor, dependencyCompleteness,
    contradictions: 0, seatsSucceeded: merge.seatsSucceeded.length,
    durationMs, timestamp: now, sessionId, generation: 1,
  };
  fs.appendFileSync(stateLog, JSON.stringify(sweepEvent) + '\n' + JSON.stringify(iterRecord) + '\n');

  // 3. delta file
  fs.mkdirSync(path.join(contextDir, 'deltas'), { recursive: true });
  const deltaLines = [JSON.stringify(iterRecord)];
  for (const u of merge.keptUnits) deltaLines.push(JSON.stringify({ type: 'finding', run: N, ...u }));
  fs.writeFileSync(path.join(contextDir, 'deltas', `iter-${NNN}.jsonl`), deltaLines.join('\n') + '\n');

  // 4. coverage-graph payloads
  // Signal contract (coverage-graph-signals.ts): sliceCoverage counts SLICE nodes that are
  // the SOURCE of a COVERED_BY edge; CONFIRMS counts in-edges on the finding (target);
  // a DEPENDENCY is resolved when it is the TARGET of a DEPENDS_ON edge; relevance and
  // confirmations are read from node metadata, which must be a plain object (the store
  // stringifies once — pre-stringifying double-encodes and reads back as a string).
  const sliceId = `slice-${sha1(focusLabel)}`;
  const nodes = [{ id: sliceId, kind: 'SLICE', name: focusLabel, iteration: N }];
  const edges = [];
  const kindMap = { reuse_candidate: 'REUSE_CANDIDATE', integration_point: 'PATTERN', convention: 'PATTERN', dependency: 'DEPENDENCY', gap: 'GAP' };
  const fileIds = new Map();
  for (const f of sliceFiles) {
    const fid = `file-${sha1(f)}`;
    fileIds.set(f, fid);
    nodes.push({ id: fid, kind: 'FILE', name: f, iteration: N });
    edges.push({ id: `e-cov-${sha1(f + NNN)}`, sourceId: sliceId, targetId: fid, relation: 'COVERED_BY' });
  }
  for (const u of merge.keptUnits) {
    const uid = `unit-${sha1(`${u.path}|${u.symbol}|${u.kind}`)}`;
    nodes.push({
      id: uid, kind: kindMap[u.kind] || 'SYMBOL', name: `${u.path}:${u.symbol}`, iteration: N,
      metadata: { producedBy: u.producedBy, relevance: u.relevance, confirmations: u.agreement },
    });
    const fid = fileIds.get(u.path);
    if (fid) edges.push({ id: `e-ref-${sha1(uid)}`, sourceId: fid, targetId: uid, relation: 'REFERENCES' });
    if (u.agreement >= 2) edges.push({ id: `e-conf-${sha1(uid + 'c')}`, sourceId: sliceId, targetId: uid, relation: 'CONFIRMS' });
    if ((kindMap[u.kind] || '') === 'DEPENDENCY' && fid) edges.push({ id: `e-dep-${sha1(uid + 'd')}`, sourceId: fid, targetId: uid, relation: 'DEPENDS_ON' });
  }
  fs.writeFileSync(`/tmp/ctx-iter-${NNN}-nodes.json`, JSON.stringify(nodes));
  fs.writeFileSync(`/tmp/ctx-iter-${NNN}-edges.json`, JSON.stringify(edges));

  console.log(JSON.stringify({ iteration: N, written: [`iterations/iteration-${NNN}.md`, `deltas/iter-${NNN}.jsonl`], cumulativeAgreementEligible: cumulative, dependencyCompleteness, nodeCount: nodes.length, edgeCount: edges.length }));
}

main();
