// Lists basename, size and mtime of every top-level *.jsonl in a directory (no content read).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2];
for (const e of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile() && d.name.endsWith('.jsonl')).sort((a, b) => a.name.localeCompare(b.name))) {
  const s = statSync(join(dir, e.name));
  console.log(`${e.name} ${s.size} ${Math.trunc(s.mtimeMs)}`);
}
