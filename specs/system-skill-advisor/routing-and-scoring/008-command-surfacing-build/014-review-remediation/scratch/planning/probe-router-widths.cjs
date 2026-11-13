// Run from the repository root: node <this file> [router file]
// Reads the trigger and index tables the way the AGENTS.md check parses them and
// prints each table's header width, its row count and any row of another width.
const fs = require('fs');
const text = fs.readFileSync(process.argv[2] || 'REPO RULES.md', 'utf8');
for (const anchor of ['TRIGGER TABLE', 'INDEX']) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith('#') && l.includes(anchor));
  let width = 0; let rows = 0; const bad = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith('#')) break;
    if (!line.startsWith('|')) { if (rows > 0 && line === '') break; continue; }
    const cells = line.replace(/^\|/u, '').replace(/\|$/u, '').split('|').map((c) => c.trim());
    if (cells.every((c) => /^:?-+:?$/u.test(c) || c === '')) continue;
    if (width === 0) { width = cells.length; continue; }
    if (cells.length !== width) { bad.push(i + 1); continue; }
    rows += 1;
  }
  console.log(anchor, 'start', start + 1, 'width', width, 'rows', rows, 'mismatched lines', JSON.stringify(bad));
}
