// Applies the canonical part of the deep-review workflow's step_graph_upsert to a
// finished fan-out review lineage: one DIMENSION node per configured dimension, one
// FILE node per file an iteration reviewed, and a COVERS edge from each of that
// iteration's dimensions to each of its files. The fan-out runner leaves this step
// to the lineage, and its leaves never ran it, so the review stop decision had no
// coverage to read. Usage: node review-graph-project.mjs <spec-folder> <lineage-dir>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const [specFolder, lineageDir] = process.argv.slice(2);
const config = JSON.parse(readFileSync(join(lineageDir, 'deep-review-config.json'), 'utf8'));
const sessionId = config.sessionId;
const dimensions = Array.isArray(config.dimensions) && config.dimensions.length > 0
  ? config.dimensions
  : ['correctness', 'security', 'traceability', 'maintainability'];
const iterations = readFileSync(join(lineageDir, 'deep-review-state.jsonl'), 'utf8')
  .split('\n').filter((line) => line.trim() !== '')
  .map((line) => JSON.parse(line)).filter((record) => record.type === 'iteration');

let index = 0;
for (const record of iterations) {
  index += 1;
  const nodes = dimensions.map((dimension) => ({ id: `dimension:${dimension}`, kind: 'DIMENSION', name: dimension, iteration: index }));
  const edges = [];
  for (const file of record.filesReviewed ?? []) {
    const path = typeof file === 'string' ? file : file?.path;
    if (typeof path !== 'string' || path === '') continue;
    nodes.push({ id: `file:${path}`, kind: 'FILE', name: path, iteration: index });
    for (const dimension of record.dimensions ?? []) {
      edges.push({ id: `covers:${dimension}:${path}`, relation: 'COVERS', sourceId: `dimension:${dimension}`, targetId: `file:${path}` });
    }
  }
  const result = spawnSync('node', ['.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs',
    '--spec-folder', specFolder, '--loop-type', 'review', '--session-id', sessionId,
    '--nodes', JSON.stringify(nodes), '--edges', JSON.stringify(edges)], { encoding: 'utf8' });
  const data = (() => { try { return JSON.parse(result.stdout).data ?? {}; } catch { return { raw: result.stdout.slice(0, 200) }; } })();
  console.log(`${sessionId} iteration ${index} exit ${result.status} nodes ${data.insertedNodes ?? '?'} edges ${data.insertedEdges ?? '?'}${data.validationErrors ? ` errors ${JSON.stringify(data.validationErrors).slice(0, 200)}` : ''}`);
}
