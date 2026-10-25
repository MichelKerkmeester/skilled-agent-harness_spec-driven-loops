// Maps the eight frozen scenario labels to the playbook scenario files. The
// ids and paths are literal, so a renamed file stops the run instead of
// silently mapping the wrong scenario. A playbook id carried by two index rows
// is ambiguous and stops the build before any scenario runs.
const fs = require('fs');
const path = require('path');

const [playbookRoot, outPath] = process.argv.slice(2);
if (!playbookRoot || !outPath) {
  console.error('usage: build-scenario-map.cjs <playbook-root> <out.tsv>');
  process.exit(2);
}

const rows = [
  ['S1', '476', 'template-authoring/placeholder-token-warning-while-draft.md', '^warn$', '^true$', 'cleanup=ok'],
  ['S2', '477', 'template-authoring/placeholder-token-error-after-draft.md', '^error$', '^false$', 'cleanup=ok'],
  ['S3', '478', 'template-authoring/placeholder-gate-legacy-stamp-unchanged.md', '^error$', '^false$', 'cleanup=ok'],
  ['S4', '479', 'template-authoring/example-drift-guard-catches-leak.md', 'EXAMPLE_DRIFT_OK', 'broken_exit=1', 'cleanup=ok'],
  ['S5', '480', 'template-authoring/golden-render-all-levels.md', 'Tests\\s+12 passed \\(12\\)', 'Tests\\s+16 passed \\(16\\)', 'cleanup=ok'],
  ['S6', '481', 'template-authoring/authoring-card-router-intents.md', '^4$', '^0$', '^1$'],
  ['S7', '482', 'template-authoring/authoring-card-sync-guard.md', 'CARD SYNC OK', 'CARD SYNC FAILED', 'cleanup=ok'],
  ['S8', '483', 'template-authoring/level-1-packet-authored-from-card.md', '^devin_exit=0$', '^packet=specs/zz-pb-card/001-card-authoring\\nval_exit=0\\nRESULT: PASSED\\n0$', 'cleanup=ok'],
];

const indexPath = path.join(playbookRoot, 'manual-testing-playbook.md');
const indexText = fs.readFileSync(indexPath, 'utf8');
const out = [];
const problems = [];
for (const [label, id, file, passA, passB, passC] of rows) {
  const indexRows = indexText.split('\n').filter((line) => new RegExp('^\\| *' + id + ' *\\|').test(line));
  if (indexRows.length > 1) {
    problems.push(`AMBIGUOUS ${label} ${id}`);
    continue;
  }
  const abs = path.resolve(playbookRoot, file);
  if (!fs.existsSync(abs)) {
    problems.push(`NO_FILE ${label} ${file}`);
    continue;
  }
  out.push([label, id, abs, passA, passB, passC].join('\t'));
}

if (problems.length > 0) {
  console.log(problems.join('\n'));
  process.exit(1);
}
fs.writeFileSync(outPath, out.join('\n') + '\n');
console.log(`SCENARIO_MAP_OK ${out.length}`);
