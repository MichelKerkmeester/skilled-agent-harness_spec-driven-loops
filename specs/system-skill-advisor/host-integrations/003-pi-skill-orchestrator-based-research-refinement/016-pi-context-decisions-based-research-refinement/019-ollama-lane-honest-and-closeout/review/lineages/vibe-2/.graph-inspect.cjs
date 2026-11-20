// Inspect the lineage coverage graph: list DIMENSION and FILE nodes plus COVERS edges.
// Run: node .graph-inspect.cjs <artifactDir>
const path = require('path');
const Database = require(path.resolve(
  process.cwd(),
  '.skilled/skills/system-deep-loop/runtime/node_modules/better-sqlite3',
));

const L = process.argv[2];
const db = new Database(path.join(L, 'graph-db', 'deep-loop-graph.sqlite'), { readonly: true });

const dims = db.prepare("SELECT id, name FROM coverage_nodes WHERE kind = 'DIMENSION'").all();
const files = db.prepare("SELECT id, name FROM coverage_nodes WHERE kind = 'FILE'").all();
const covers = db.prepare("SELECT source_id, target_id FROM coverage_edges WHERE relation = 'COVERS'").all();
const kinds = db.prepare('SELECT kind, COUNT(*) AS c FROM coverage_nodes GROUP BY kind').all();

console.log('KINDS', JSON.stringify(kinds));
console.log('DIMENSIONS', JSON.stringify(dims, null, 1));
console.log('FILES', JSON.stringify(files.map((f) => f.id), null, 1));
console.log('COVERS', JSON.stringify(covers));
db.close();
