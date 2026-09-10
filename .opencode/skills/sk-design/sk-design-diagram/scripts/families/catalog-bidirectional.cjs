'use strict';

// A hand-kept index drifts in both directions: a row for a file that left, and a file nobody
// indexed. Columns are matched by header name so the table can be re-ordered freely; the
// sentinels bound what is asserted so the prose around the table stays free.
const BEGIN = '<!-- DIAGRAM_CATALOG:BEGIN -->';
const END = '<!-- DIAGRAM_CATALOG:END -->';

function cells(line) {
  return line.split('|').slice(1, -1).map((c) => c.trim().replace(/[`*]/g, ''));
}

module.exports = {
  name: 'catalog-bidirectional',
  scope: 'corpus',
  run(ctx) {
    const { fs, path, root, tally, record, exampleDir } = ctx;
    const catalog = path.join(root, 'references', 'catalog.md');
    tally('catalog-bidirectional', 1);
    if (!fs.existsSync(catalog)) {
      record('catalog-bidirectional', 'error', 'references/catalog.md', 'the catalog is missing, so nothing indexes the corpus');
      return;
    }
    const src = fs.readFileSync(catalog, 'utf8');
    const start = src.indexOf(BEGIN);
    const end = src.indexOf(END);
    if (start === -1 || end === -1 || end < start) {
      record('catalog-bidirectional', 'error', 'references/catalog.md', 'no DIAGRAM_CATALOG sentinel pair around the index table');
      return;
    }
    const lines = src.slice(start + BEGIN.length, end).split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'));
    const headers = cells(lines[0]).map((h) => h.toLowerCase());
    const col = (name) => headers.indexOf(name);
    tally('catalog-bidirectional', 1);
    for (const needed of ['id', 'canonical', 'variants', 'imports']) {
      if (col(needed) === -1) {
        record('catalog-bidirectional', 'error', 'references/catalog.md', `the index table needs a "${needed}" column and has [${headers.join(', ')}]`);
        return;
      }
    }
    const referenced = new Map();
    for (const row of lines.slice(2).map(cells)) {
      const id = row[col('id')];
      const files = [row[col('canonical')], row[col('variants')], row[col('imports')]]
        .join(',').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none')
        .map((s) => (s.startsWith('assets/') ? s : `assets/examples/${s}`));
      tally('catalog-bidirectional', 1);
      if (!files.some((f) => f.endsWith(`example-${id}.html`))) {
        record('catalog-bidirectional', 'error', 'references/catalog.md', `row "${id}" names no canonical file example-${id}.html`);
      }
      for (const f of files) {
        tally('catalog-bidirectional', 1);
        if (!fs.existsSync(path.join(root, f))) {
          record('catalog-bidirectional', 'error', 'references/catalog.md', `row "${id}" names ${f}, which does not exist. A row for a file that left is a reader sent to nothing`);
        }
        referenced.set(f, (referenced.get(f) || 0) + 1);
      }
    }
    for (const file of fs.readdirSync(exampleDir).filter((n) => n.endsWith('.html')).sort()) {
      tally('catalog-bidirectional', 1);
      if (!referenced.has(`assets/examples/${file}`)) {
        record('catalog-bidirectional', 'error', `assets/examples/${file}`, 'no catalog row names this file. A diagram nothing indexes is a diagram nobody finds');
      }
    }
  },
};
