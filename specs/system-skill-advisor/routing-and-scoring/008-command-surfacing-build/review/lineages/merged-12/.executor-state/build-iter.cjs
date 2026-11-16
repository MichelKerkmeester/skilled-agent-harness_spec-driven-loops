'use strict';
// Build one review iteration record and its delta for the merged-12 lineage.
// Usage: node build-iter.cjs <iteration> <dimension> <focus> <n> <p0> <p1> <p2> <ratio> <durationMs> <novelty> <findingJson> <extraJson>
const fs = require('node:fs');
const crypto = require('node:crypto');

const dir = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12';
const sid = 'fanout-merged-12-1794856957949-n58dw7';
const [iterationArg, dimension, focus, countArg, p0Arg, p1Arg, p2Arg, ratioArg, durationArg, novelty, findingJson, extraJson] = process.argv.slice(2);
const iteration = Number(iterationArg);
const findings = JSON.parse(findingJson);
const extra = JSON.parse(extraJson || '{}');
const files = extra.files || [
  '.skilled/skills/sk-doc/ROUTER.md',
  '.skilled/skills/sk-doc/SKILL.md',
  '.skilled/skills/sk-doc/graph-metadata.json',
  '.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs',
];
const fileLines = extra.fileLines || Object.fromEntries(files.map((f) => [f, 1]));

const nodes = [
  { type: 'node', id: `dimension:${dimension}`, kind: 'DIMENSION', label: dimension },
  ...files.map((f) => ({ type: 'node', id: `file:${f}`, kind: 'FILE', label: f })),
];
const edges = files.map((f, i) => ({
  type: 'edge', id: `e-covers-${dimension}-${i}`, source: `dimension:${dimension}`, target: `file:${f}`, relation: 'COVERS',
}));
for (const finding of findings) {
  nodes.push({ type: 'node', id: `finding:${finding.id}`, kind: 'FINDING', label: finding.title });
  const evidenceLabel = finding.evidenceLabel || finding.file;
  nodes.push({ type: 'node', id: `evidence:${finding.id}`, kind: 'EVIDENCE', label: evidenceLabel });
  edges.push({ type: 'edge', id: `e-in-dimension-${finding.id}`, source: `finding:${finding.id}`, target: `dimension:${dimension}`, relation: 'IN_DIMENSION' });
  const inFile = files.find((f) => finding.file.startsWith(f));
  if (inFile) {
    edges.push({ type: 'edge', id: `e-in-file-${finding.id}`, source: `finding:${finding.id}`, target: `file:${inFile}`, relation: 'IN_FILE' });
  }
  edges.push({ type: 'edge', id: `e-evidence-${finding.id}`, source: `evidence:${finding.id}`, target: `finding:${finding.id}`, relation: 'EVIDENCE_FOR' });
}

const record = {
  type: 'iteration',
  iteration,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: sid,
  status: extra.status || 'complete',
  focus,
  dimensions: [dimension],
  filesReviewed: files.map((f) => `${f}:${fileLines[f]}`),
  findingsCount: Number(countArg),
  findingsSummary: { P0: Number(p0Arg), P1: Number(p1Arg), P2: Number(p2Arg) },
  findingsNew: findings.map((f) => f.id),
  findingDetails: findings,
  traceabilityChecks: { results: extra.traceabilityResults || [] },
  newFindingsRatio: Number(ratioArg),
  noveltyJustification: novelty,
  sessionId: sid,
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: Number(durationArg),
  graphEvents: [...nodes, ...edges],
};

fs.writeFileSync(`${dir}/.executor-state/iter-${String(iteration).padStart(3, '0')}.json`, JSON.stringify(record));
const lines = [JSON.stringify(record)];
for (const line of extra.delta || []) lines.push(JSON.stringify({ ...line, iteration }));
fs.writeFileSync(`${dir}/deltas/iter-${String(iteration).padStart(3, '0')}.jsonl`, `${lines.join('\n')}\n`);
process.stdout.write(`${JSON.stringify({ ok: true, iteration, nodes: nodes.length, edges: edges.length, deltaLines: lines.length })}\n`);
