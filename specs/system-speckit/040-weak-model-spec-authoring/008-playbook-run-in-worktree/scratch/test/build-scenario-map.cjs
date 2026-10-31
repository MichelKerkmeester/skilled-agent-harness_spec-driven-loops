const fs = require('fs');
const path = require('path');
const [indexPath, playbookRoot, outPath] = process.argv.slice(2);
if (!indexPath || !playbookRoot || !outPath) {
  console.error('usage: build-scenario-map.cjs <index> <playbook-root> <out.tsv>');
  process.exit(2);
}
const rows = fs.readFileSync(indexPath, 'utf8').split('\n').map((line) => {
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(([^)]+)\)\s*\|/);
  return m ? { id: m[1].trim(), title: m[2].trim(), file: m[3].trim() } : null;
}).filter(Boolean);
const labels = [
  ['S1', /placeholder.*draft|draft.*placeholder/i, 'unfilled value token\\(s\\) in a Draft packet', 'RESULT: PASSED'],
  ['S2', /placeholder.*complete|placeholder.*error|complete.*placeholder/i, 'placeholder\\(s\\) found', 'RESULT: FAILED'],
  ['S3', /placeholder.*v2\\.2|v2\\.2.*placeholder|legacy.*placeholder|placeholder.*unchanged/i, 'placeholder\\(s\\) found', 'RESULT: FAILED'],
  ['S4', /example.*drift|drift.*example/i, 'EXAMPLE_DRIFT_OK', ''],
  ['S5', /golden/i, 'Tests\\s+12 passed \\(12\\)', ''],
  ['S6', /(router|routing|intent).*card|card.*(router|routing|intent)/i, '^4$', '^0$'],
  ['S7', /card.*sync|sync.*card/i, 'CARD SYNC OK', ''],
  ['S8', /(deepseek|weak model).*(author|packet)|(author|packet).*(deepseek|weak model)/i, 'RESULT: PASSED', ''],
];
const out = [];
const problems = [];
for (const [label, re, passA, passB] of labels) {
  const hits = rows.filter((row) => re.test(row.title));
  if (hits.length !== 1) {
    problems.push(`${hits.length === 0 ? 'MISSING' : 'AMBIGUOUS'} ${label}`);
    continue;
  }
  const hit = hits[0];
  const abs = path.resolve(playbookRoot, hit.file);
  if (!fs.existsSync(abs)) {
    problems.push(`NO_FILE ${label} ${hit.file}`);
    continue;
  }
  out.push([label, hit.id, abs, passA, passB].join('\t'));
}
if (problems.length > 0) {
  console.log(problems.join('\n'));
  process.exit(1);
}
fs.writeFileSync(outPath, out.join('\n') + '\n');
console.log(`SCENARIO_MAP_OK ${out.length}`);
