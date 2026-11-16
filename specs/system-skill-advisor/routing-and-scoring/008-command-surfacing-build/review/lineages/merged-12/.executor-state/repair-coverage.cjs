'use strict';
// Repair the initial seed's duplicate DIMENSION ids so every seeded dimension
// carries the same COVERS edges the per-iteration nodes do. The review covered
// all four files under all four dimensions, so the edges record real coverage.
// Usage: node repair-coverage.cjs
const { spawnSync } = require('node:child_process');

const files = [
  '.skilled/skills/sk-doc/ROUTER.md',
  '.skilled/skills/sk-doc/SKILL.md',
  '.skilled/skills/sk-doc/graph-metadata.json',
  '.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs',
];
const seeded = ['d-correctness', 'd-security', 'd-traceability', 'd-maintainability'];
const edges = [];
for (const dimension of seeded) {
  for (const [index, file] of files.entries()) {
    edges.push({
      id: `e-seed-${dimension}-${index}`,
      relation: 'COVERS',
      sourceId: dimension,
      targetId: `file:${file}`,
    });
  }
}
const result = spawnSync(process.execPath, [
  '.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs',
  '--spec-folder', 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build',
  '--loop-type', 'review',
  '--session-id', 'fanout-merged-12-1794856957949-n58dw7',
  '--nodes', '[]',
  '--edges', JSON.stringify(edges),
], { encoding: 'utf8' });
if (result.status !== 0) {
  process.stderr.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  process.exit(result.status ?? 1);
}
const parsed = JSON.parse(result.stdout);
process.stdout.write(`${JSON.stringify({ ok: true, insertedEdges: parsed.data?.insertedEdges, rejectedEdges: parsed.data?.rejectedEdges })}\n`);
