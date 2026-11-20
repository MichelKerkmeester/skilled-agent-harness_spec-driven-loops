// Builds the step_graph_upsert node/edge batch for one iteration from the
// lineage's own state log, then writes it to /tmp for upsert.cjs.
const fs = require('fs');
const path = require('path');

const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max';
const iteration = Number(process.argv[2]);
if (!Number.isInteger(iteration) || iteration < 1) throw new Error('usage: node graph-batch.cjs <iteration>');

const config = JSON.parse(fs.readFileSync(path.join(L, 'deep-review-config.json'), 'utf8'));
const rows = fs.readFileSync(path.join(L, 'deep-review-state.jsonl'), 'utf8')
  .trim().split('\n').map((line) => JSON.parse(line));
const record = rows.filter((row) => row.type === 'iteration' && Number(row.iteration) === iteration).pop();
if (!record) throw new Error(`no iteration record for ${iteration}`);

const dimensions = Array.isArray(config.reviewDimensions) && config.reviewDimensions.length > 0
  ? config.reviewDimensions
  : ['correctness', 'security', 'traceability', 'maintainability'];
const reviewedDimensions = Array.isArray(record.dimensions) && record.dimensions.length > 0
  ? record.dimensions
  : dimensions;

const filePath = (ref) => String(ref).replace(/:\d+(?:[-:]\d+)?$/, '').trim();
const slug = (value) => String(value).replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

const nodes = [];
const edges = [];
const seen = new Set();
const pushNode = (node) => {
  if (seen.has(node.id)) return;
  seen.add(node.id);
  nodes.push(node);
};

for (const dimension of dimensions) {
  pushNode({ id: `dimension:${dimension}`, kind: 'DIMENSION', name: dimension, metadata: { iteration } });
}

const files = [...new Set((record.filesReviewed || []).map(filePath))];
for (const file of files) {
  pushNode({ id: `file:${file}`, kind: 'FILE', name: file, metadata: { iteration } });
}

let edgeSeq = 0;
for (const dimension of reviewedDimensions) {
  for (const file of files) {
    edgeSeq += 1;
    edges.push({
      id: `edge:covers:${slug(dimension)}:${slug(file)}`,
      sourceId: `dimension:${dimension}`,
      targetId: `file:${file}`,
      relation: 'COVERS',
      metadata: { iteration },
    });
  }
}

for (const event of Array.isArray(record.graphEvents) ? record.graphEvents : []) {
  if (event.type === 'node') {
    pushNode({
      id: event.id,
      kind: String(event.kind || event.nodeKind || 'SLICE').toUpperCase(),
      name: event.label || event.name || event.id,
      metadata: { iteration },
    });
  } else if (event.type === 'edge') {
    edges.push({
      id: event.id,
      sourceId: event.source || event.sourceId,
      targetId: event.target || event.targetId,
      relation: String(event.relation || '').toUpperCase(),
      metadata: { iteration },
    });
  }
}

fs.writeFileSync('/tmp/graph-nodes.json', JSON.stringify(nodes));
fs.writeFileSync('/tmp/graph-edges.json', JSON.stringify(edges));
console.log(`iteration ${iteration}: nodes=${nodes.length} edges=${edges.length} files=${files.length} dimensions=${reviewedDimensions.join(',')}`);
