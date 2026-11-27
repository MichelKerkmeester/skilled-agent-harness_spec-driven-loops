#!/usr/bin/env node
// Resolves every [SOURCE: path:line] tag in the given markdown files against the
// repository, so a reader can compare each claim with the line it cites.
// Usage: node cite-check.cjs <repo-root> [--text] <file.md>...
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const repoRoot = args.shift();
const showText = args[0] === '--text' ? (args.shift(), true) : false;
const lineCache = new Map();

function linesOf(abs) {
  if (!lineCache.has(abs)) {
    let lines = null;
    try {
      if (fs.statSync(abs).isFile()) lines = fs.readFileSync(abs, 'utf8').split('\n');
    } catch (_) { /* missing path stays null */ }
    lineCache.set(abs, lines);
  }
  return lineCache.get(abs);
}

// The synthesis shortens long roots to a prefix, listed in its own prefix table.
const RESEARCH_ROOT = 'specs/system-skilled-bots/002-openbot-parity-research/';
const PREFIXES = [
  ['C/', 'specs/system-skilled-bots/context/'],
  ['B/', 'specs/system-skilled-bots/003-openbot-parity-build/'],
  ['L/', '.skilled/skills/system-skilled-bots/runtime/lib/'],
  ['S1/', RESEARCH_ROOT + '001-openbot-parity-research/research/'],
  ['S2/', RESEARCH_ROOT + '002-plan-review-research/research/'],
  ['S3/', RESEARCH_ROOT + '003-plan-depth-research/research/'],
];
const TAG = /\[SOURCE:\s*([^\]]+?)\]/g;
const totals = { ok: 0, missing: 0, range: 0, noline: 0, dir: 0 };
const problems = [];

for (const file of args) {
  const body = fs.readFileSync(file, 'utf8').split('\n');
  body.forEach((text, idx) => {
    let m;
    TAG.lastIndex = 0;
    while ((m = TAG.exec(text)) !== null) {
      const raw = m[1].trim();
      const lm = raw.match(/^(.*?):(\d+)(?:\s*[-–]\s*(\d+))?\s*$/);
      let rel = (lm ? lm[1] : raw).trim().replace(/^`|`$/g, '');
      for (const [prefix, full] of PREFIXES) {
        if (rel.startsWith(prefix)) { rel = full + rel.slice(prefix.length); break; }
      }
      const abs = path.resolve(repoRoot, rel);
      const where = `${path.basename(path.dirname(path.dirname(file)))}/${path.basename(file)}:${idx + 1}`;
      let exists = false; let isDir = false;
      try { const st = fs.statSync(abs); exists = true; isDir = st.isDirectory(); } catch (_) { /* absent */ }
      if (!exists) { totals.missing++; problems.push(`MISSING ${where} ${raw}`); continue; }
      if (isDir) { totals.dir++; continue; }
      if (!lm) { totals.noline++; problems.push(`NOLINE ${where} ${raw}`); continue; }
      const lines = linesOf(abs);
      const from = Number(lm[2]); const to = Number(lm[3] || lm[2]);
      if (!lines || from < 1 || to > lines.length || to < from) {
        totals.range++; problems.push(`RANGE ${where} ${raw} (file has ${lines ? lines.length : '?'} lines)`);
        continue;
      }
      totals.ok++;
      if (showText) {
        const cited = lines.slice(from - 1, Math.min(to, from + 5)).join(' | ').replace(/\s+/g, ' ').slice(0, 300);
        console.log(`OK ${where} ${rel}:${from}${to !== from ? '-' + to : ''} => ${cited}`);
      }
    }
  });
}
problems.forEach((p) => console.log(p));
console.log(JSON.stringify(totals));
