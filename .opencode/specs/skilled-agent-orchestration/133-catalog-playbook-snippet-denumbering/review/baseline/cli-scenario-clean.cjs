// Remove obsolete write-agent test scenarios (feature verified removed: no `write` agent,
// no snippet anywhere) from the cli playbooks: the `### <ID> | ...` scenario block (to the
// next ###/## header, trailing blanks/--- trimmed) + the `- <ID>:` index list item.
// Dry-run by default; --apply to write.
const fs = require('fs');
const TARGETS = [
  { f: '.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md', id: 'CC-025' },
  { f: '.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md', id: 'CO-016' },
];
const APPLY = process.argv.includes('--apply');

for (const { f, id } of TARGETS) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  const remove = new Set();
  let blockRange = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^###\s+([A-Za-z0-9-]+)\s*\|/);
    if (m && m[1] === id) {
      let j = i + 1;
      while (j < lines.length && !/^###\s/.test(lines[j]) && !/^##\s/.test(lines[j])) j++;
      let end = j - 1;
      while (end > i && (lines[end].trim() === '' || lines[end].trim() === '---')) end--;
      for (let k = i; k <= end; k++) remove.add(k);
      blockRange = [i + 1, end + 1];
    }
    if (new RegExp('^- ' + id + ':').test(lines[i])) remove.add(i);
  }
  const kept = lines.filter((_, i) => !remove.has(i));
  console.log(`${f.replace('.opencode/skills/', '')}  [${id}]  block lines ${blockRange ? blockRange.join('-') : 'NONE'}  | removed ${lines.length - kept.length} lines`);
  if (APPLY) fs.writeFileSync(f, kept.join('\n'));
}
console.log(`=== CLI-SCENARIO-CLEAN (${APPLY ? 'APPLIED' : 'DRY-RUN'}) ===`);
