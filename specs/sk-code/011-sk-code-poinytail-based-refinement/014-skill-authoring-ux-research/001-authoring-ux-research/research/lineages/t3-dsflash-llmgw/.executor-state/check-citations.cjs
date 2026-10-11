// Read-only: verify every [SOURCE: ...] tag in the lineage's iteration and delta files resolves.
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
const files = [];
for (const d of ['iterations', 'deltas']) {
  const p = path.join(dir, d);
  if (fs.existsSync(p)) for (const f of fs.readdirSync(p)) files.push(path.join(p, f));
}
const bracketRe = /\[SOURCE:\s*([^\]]+)\]/g;
const pairRe = /((?:\.skilled|specs|\.github)\/[^\s'\],;]+?):(\d+)(?:-(\d+))?/g;
let total = 0, bad = 0; const checked = new Set();
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  let b;
  while ((b = bracketRe.exec(text)) !== null) {
    let p2; pairRe.lastIndex = 0;
    while ((p2 = pairRe.exec(b[1])) !== null) {
      total += 1;
      const p = p2[1].replace(/[`'"]/g, '');
      const line = Number(p2[2]);
      const end = p2[3] ? Number(p2[3]) : line;
      const key = `${p}:${p2[2]}${p2[3] ? '-' + p2[3] : ''}`;
      checked.add(key);
      if (!fs.existsSync(p)) { bad += 1; console.log(`MISSING FILE ${key} (in ${path.basename(file)})`); continue; }
      const lines = fs.readFileSync(p, 'utf8').split('\n').length;
      if (end > lines) { bad += 1; console.log(`LINE OUT OF RANGE ${key} (file has ${lines} lines)`); }
    }
  }
}
console.log(`tag-pairs=${total} unique=${checked.size} bad=${bad}`);
process.exit(bad === 0 ? 0 : 1);
