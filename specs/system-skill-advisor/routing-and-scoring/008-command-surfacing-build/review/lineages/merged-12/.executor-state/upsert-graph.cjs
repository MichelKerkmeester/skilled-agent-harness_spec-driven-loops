'use strict';
// Project one iteration's graphEvents through upsert.cjs for the merged-12 lineage.
// Usage: node upsert-graph.cjs <iteration>
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const dir = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12';
const iteration = Number(process.argv[2]);
const record = JSON.parse(fs.readFileSync(`${dir}/.executor-state/iter-${String(iteration).padStart(3, '0')}.json`, 'utf8'));
const nodes = [];
const seenNodes = new Set();
const edges = [];
const seenEdges = new Set();
for (const event of record.graphEvents || []) {
  if (event.type === 'node') {
    if (seenNodes.has(event.id)) continue;
    seenNodes.add(event.id);
    nodes.push({ id: event.id, type: event.kind, name: event.label, iteration });
  } else if (event.type === 'edge') {
    if (seenEdges.has(event.id)) continue;
    seenEdges.add(event.id);
    edges.push({ id: event.id, relation: event.relation, sourceId: event.source, targetId: event.target });
  }
}
const result = spawnSync(process.execPath, [
  '.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs',
  '--spec-folder', 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build',
  '--loop-type', 'review',
  '--session-id', record.sessionId,
  '--nodes', JSON.stringify(nodes),
  '--edges', JSON.stringify(edges),
], { encoding: 'utf8' });
if (result.status !== 0) {
  process.stderr.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  process.exit(result.status ?? 1);
}
const parsed = JSON.parse(result.stdout);
process.stdout.write(`${JSON.stringify({ ok: true, iteration, nodes: nodes.length, edges: edges.length, insertedNodes: parsed.data?.insertedNodes, insertedEdges: parsed.data?.insertedEdges })}\n`);
