// Read-only: resolve every [SOURCE: path:line] tag in research.md.
const fs = require('fs');
const bracketRe = /\[SOURCE:\s*([^\]]+)\]/g;
const pairRe = /((?:\.skilled|specs|\.github)\/[^\s'\`,;]+?):(\d+)(?:-(\d+))?/g;
const text = fs.readFileSync(process.argv[2], 'utf8');
let total = 0, bad = 0; const checked = new Set();
let b;
while ((b = bracketRe.exec(text)) !== null) {
  let p; pairRe.lastIndex = 0;
  while ((p = pairRe.exec(b[1])) !== null) {
    total += 1;
    const file = p[1].replace(/[`'"]/g, '');
    const start = Number(p[2]); const end = p[3] ? Number(p[3]) : start;
    checked.add(`${file}:${p[2]}${p[3] ? '-' + p[3] : ''}`);
    if (!fs.existsSync(file)) { bad += 1; console.log(`MISSING ${file}:${p[2]}`); continue; }
    const lines = fs.readFileSync(file, 'utf8').split('\n').length;
    if (end > lines) { bad += 1; console.log(`OUT OF RANGE ${file}:${p[2]}-${end} (has ${lines})`); }
  }
}
console.log(`tag-pairs=${total} unique=${checked.size} bad=${bad}`);
process.exit(bad === 0 ? 0 : 1);
