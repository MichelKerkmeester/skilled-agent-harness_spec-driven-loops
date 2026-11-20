// Seed DIMENSION nodes and COVERS edges for the dimensions reviewed so far.
// Run: node .graph-seed-dimensions.cjs <artifactDir> <dim1,dim2,...>
// The graph's dimensionCoverage signal counts DIMENSION nodes that have at least
// one outgoing COVERS edge, so a dimension with no node reads as uncovered even
// when the registry marks it reviewed.
const path = require('path');
const { spawnSync } = require('child_process');

const L = process.argv[2];
const reviewed = (process.argv[3] || '').split(',').map((s) => s.trim()).filter(Boolean);

const ALL = ['correctness', 'security', 'traceability', 'maintainability'];

// FILE node ids the graph already holds, grouped by the dimension that read them.
const FILES_BY_DIMENSION = {
  correctness: [
    'FILE--skilled-skills-system-skill-advisor',
    'FILE--skilled-bin-system-skill-advisor-launcher-cjs',
    'FILE--skilled-changelog-skilled-v4-1-0-0-md',
    'file:.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts',
  ],
  security: [
    'FILE--skilled-bin-system-skill-advisor-launcher-cjs',
    'FILE--github-workflows-skill-advisor-stress-yml',
    'FILE--env-example',
    'file:.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts',
  ],
  traceability: [
    'FILE--skilled-skills-system-skill-advisor',
    'FILE--skilled-changelog-skilled-v4-1-0-0-md',
    'FILE--skilled-skills-sk-doc-hub-router-json',
    'FILE--skilled-skills-sk-doc-sk-create-readme-SKILL-md',
    'FILE-specs-decision-record-md',
  ],
  maintainability: [
    'FILE--skilled-skills-system-skill-advisor',
    'FILE--skilled-commands-doctor-assets',
    'FILE--skilled-commands-create-assets',
    'FILE--skilled-skills-system-spec-kit-runtime-ENV-REFERENCE-md',
    'FILE-INSTALL-SKILLED-md',
    'FILE-README-md',
  ],
};

const nodes = ALL.map((dimension) => ({
  id: `DIMENSION-${dimension}`,
  kind: 'DIMENSION',
  name: dimension,
  metadata: { dimension },
}));

const edges = [];
for (const dimension of reviewed) {
  for (const target of FILES_BY_DIMENSION[dimension] || []) {
    edges.push({
      id: `COVERS-${dimension}-${target}`,
      source: `DIMENSION-${dimension}`,
      target,
      relation: 'COVERS',
      weight: 1,
    });
  }
}

const result = spawnSync(
  process.execPath,
  [
    path.resolve(process.cwd(), '.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs'),
    '--specFolder', 'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout',
    '--loopType', 'review',
    '--sessionId', 'fanout-vibe-2-1795172940208-84a42n',
    '--nodes', JSON.stringify(nodes),
    '--edges', JSON.stringify(edges),
  ],
  { encoding: 'utf8', env: { ...process.env, DEEP_LOOP_COVERAGE_DB_DIR: path.resolve(process.cwd(), L, 'graph-db') } },
);

process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
console.log(`seeded ${nodes.length} dimension nodes, ${edges.length} COVERS edges, exit ${result.status}`);
