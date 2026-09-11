'use strict';
// Report every (connector, label-mask) clearance below a threshold, across the corpus,
// using the shipped family's own detection so the numbers are the rule's numbers.
const fs = require('fs'), path = require('path');
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-design/sk-design-diagram';
const fam = require(path.join(ROOT, 'scripts/families/label-mask-clearance.cjs'));
const check = fs.readFileSync(path.join(ROOT, 'scripts/check-diagram-corpus.cjs'), 'utf8');

const dir = path.join(ROOT, 'assets/diagrams');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort();
const THRESH = Number(process.argv[2] || 8);

// Reimplement the harness bits the family needs.
function flattenTags(markup) { return markup; }
const rows = [];
for (const f of files) {
  const full = path.join(dir, f);
  const html = fs.readFileSync(full, 'utf8');
  const svgStart = html.indexOf('<svg');
  const svgEnd = html.lastIndexOf('</svg>');
  const markup = svgStart === -1 ? '' : html.slice(svgStart, svgEnd + 6);
  const ctx = {
    file: full, path,
    regions: { markup },
    flattenTags,
    tally: () => {},
    record: (_n, _sev, label, msg) => rows.push({ file: f, msg }),
    label: f,
  };
  // Patch CLEARANCE by running a copy of the module source with a raised floor.
  const src = fs.readFileSync(path.join(ROOT, 'scripts/families/label-mask-clearance.cjs'), 'utf8')
    .replace(/const CLEARANCE = 4;/, `const CLEARANCE = ${THRESH};`);
  const m = { exports: {} };
  new Function('module', 'exports', 'require', src)(m, m.exports, require);
  m.exports.run(ctx);
}
for (const r of rows) console.log(`${r.file}: ${r.msg}`);
console.log(`\ntotal ${rows.length} pair(s) under ${THRESH}px across ${files.length} files`);
