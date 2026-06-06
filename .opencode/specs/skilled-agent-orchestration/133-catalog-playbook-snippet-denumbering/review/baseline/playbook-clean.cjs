// Remove dead-feature scenarios from system-spec-kit/manual_testing_playbook.md:
// for each dead-feature ID (a §12 index row whose links are all dead), remove BOTH
// (a) its §12 cross-reference index row and (b) its inline scenario block
// (`### <ID> | ...` through the line before the next `###`/`##` header).
// Dead refs are read from the refreshed baseline. Dry-run by default; --apply to write.
const fs = require('fs');
const path = require('path');
const APPLY = process.argv.includes('--apply');
const FILE = '.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md';
const baseline = require(path.resolve('.opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review/baseline/baseline-findings.json'));
const deadRefs = [...new Set(baseline.broken.filter((b) => b.file.endsWith('manual_testing_playbook/manual_testing_playbook.md')).map((b) => b.ref))];
const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const isDead = (line) => deadRefs.some((r) => line.includes('](' + r + ')'));

// Pass 1: dead IDs from §12 index rows (| ID | ... | with a dead link)
const deadIds = new Set();
const indexRowIdx = new Set();
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.trim().startsWith('|') && isDead(l)) {
    const m = l.match(/^\s*\|\s*([A-Za-z0-9-]+)\s*\|/);
    if (m) { deadIds.add(m[1]); indexRowIdx.add(i); }
  }
}

// Pass 2: scenario blocks `### <ID> ` ... until next ### or ## header
const remove = new Set(indexRowIdx);
const blocks = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^###\s+([A-Za-z0-9-]+)\s*\|/);
  if (m && deadIds.has(m[1])) {
    let j = i + 1;
    while (j < lines.length && !/^###\s/.test(lines[j]) && !/^##\s/.test(lines[j])) j++;
    // trim trailing blank lines / a lone '---' separator just before next header
    let end = j - 1;
    while (end > i && (lines[end].trim() === '' || lines[end].trim() === '---')) end--;
    for (let k = i; k <= end; k++) remove.add(k);
    blocks.push({ id: m[1], header: lines[i], from: i + 1, to: end + 1 });
  }
}

const kept = lines.filter((_, i) => !remove.has(i));
console.log(`=== PLAYBOOK-CLEAN (${APPLY ? 'APPLIED' : 'DRY-RUN'}) ===`);
console.log('dead refs:', deadRefs.length, '| dead IDs:', deadIds.size, '| index rows removed:', indexRowIdx.size, '| scenario blocks removed:', blocks.length);
console.log('lines:', lines.length, '->', kept.length, '(removed', lines.length - kept.length + ')');
console.log('\n--- scenario blocks (review bounds) ---');
blocks.forEach((b) => console.log(`  ${b.header.slice(0, 90)}   [lines ${b.from}-${b.to}]`));
console.log('\n--- dead IDs with index row but NO scenario block found (row-only removal) ---');
[...deadIds].filter((id) => !blocks.some((b) => b.id === id)).forEach((id) => console.log('  ' + id));
// safety: confirm no dead ref survives in kept output
const survivors = kept.filter((l) => isDead(l));
console.log('\ndead-ref lines surviving after removal:', survivors.length, survivors.length ? '(REVIEW!)' : '(clean)');
if (APPLY) fs.writeFileSync(FILE, kept.join('\n'));
