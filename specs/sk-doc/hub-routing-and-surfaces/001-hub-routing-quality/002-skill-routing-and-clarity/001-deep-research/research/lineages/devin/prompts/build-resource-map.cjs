'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const deltas = path.join(root, 'deltas');
const repo = path.resolve(root, '..', '..', '..', '..', '..', '..', '..');
const files = fs.readdirSync(deltas).filter((name) => /^iter-\d+\.jsonl$/.test(name)).sort();
const sources = new Map();

for (const file of files) {
  for (const line of fs.readFileSync(path.join(deltas, file), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }
    if (record.type !== 'finding') continue;
    for (const source of record.sources || []) {
      const filePath = source.replace(/:\d+$/, '');
      if (!sources.has(filePath)) sources.set(filePath, new Set());
      sources.get(filePath).add(record.id);
    }
  }
}

const rows = [...sources.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const resolved = rows.filter(([filePath]) => fs.existsSync(path.join(repo, filePath)));
const lines = [
  '---',
  'title: "Resource Map — devin lineage"',
  'description: "Sources cited by this lineage\'s finding records, with on-disk status."',
  '---',
  '',
  '# Resource Map — devin lineage',
  '',
  '<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->',
  '',
  '## Summary',
  '',
  `- **Total references**: ${rows.length}`,
  `- **Resolved on disk**: ${resolved.length}`,
  `- **Missing on disk**: ${rows.length - resolved.length}`,
  `- **Generated**: ${new Date().toISOString()}`,
  '',
  '> **Status vocabulary**: `OK` · `MISSING`.',
  '',
  '## References',
  '',
  '| Path | Status | Cited by |',
  '|---|---|---|',
];

for (const [filePath, ids] of rows) {
  const status = fs.existsSync(path.join(repo, filePath)) ? 'OK' : 'MISSING';
  lines.push(`| \`${filePath}\` | ${status} | ${[...ids].sort().join(', ')} |`);
}

fs.writeFileSync(path.join(root, 'resource-map.md'), `${lines.join('\n')}\n`);
process.stdout.write(`wrote ${rows.length} refs, ${resolved.length} ok\n`);
