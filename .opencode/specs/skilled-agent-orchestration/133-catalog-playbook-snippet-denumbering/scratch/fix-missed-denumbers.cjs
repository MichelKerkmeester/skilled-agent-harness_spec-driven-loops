// For each broken relative .md link in the given skills' catalog/playbook trees,
// if de-numbering the basename (strip leading NNN-) makes it resolve, rewrite the link.
// Reports FIXABLE (fixed) vs PREEXIST (no de-numbered target — left alone). Read-resolves only known renames.
const fs = require('fs');
const path = require('path');
const skills = process.argv.slice(2);
let fixed = 0;
const preexist = [];
const fixedList = [];
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (p.includes('node_modules')) continue;
    if (e.isDirectory()) walk(p, cb);
    else if (e.isFile() && p.endsWith('.md')) cb(p);
  }
}
for (const s of skills) {
  for (const tree of ['feature_catalog', 'manual_testing_playbook']) {
    const root = path.join('.opencode/skills', s, tree);
    if (!fs.existsSync(root)) continue;
    walk(root, (f) => {
      const d = path.dirname(f);
      let content = fs.readFileSync(f, 'utf8');
      let changed = false;
      content = content.replace(/\]\(([^)\s]+\.md)(#[^)]*)?\)/g, (m, lnk, anchor) => {
        anchor = anchor || '';
        if (/^https?:/.test(lnk) || lnk.startsWith('/')) return m;
        if (fs.existsSync(path.join(d, lnk))) return m; // already resolves
        const b = path.basename(lnk);
        const dd = path.dirname(lnk);
        const den = b.replace(/^[0-9]+-/, '');
        if (den !== b && fs.existsSync(path.join(d, dd, den))) {
          fixed++; changed = true;
          const newlnk = (dd === '.' ? '' : dd + '/') + den;
          fixedList.push(`${f.replace('.opencode/skills/', '')}: ${lnk} -> ${newlnk}`);
          return '](' + newlnk + anchor + ')';
        }
        preexist.push(`${f.replace('.opencode/skills/', '')}: ${lnk}`);
        return m;
      });
      if (changed) fs.writeFileSync(f, content);
    });
  }
}
console.log('FIXED=' + fixed + '  PREEXIST=' + preexist.length);
if (fixedList.length) { console.log('--- fixed ---'); fixedList.forEach((x) => console.log('  ' + x)); }
