// Static runtime import closure of TypeScript entry files, type-only imports left out.
// Usage: node import-closure.mjs <runtime folder> <entry.ts> [...]. Prints the file count and the
// packages each entry loads, so a reader can see whether an entry pulls a native module.
import fs from 'node:fs'; import path from 'node:path';
const [root, ...entries] = process.argv.slice(2);
for (const entry of entries) {
  const seen = new Set(); const natives = new Set(); const stack = [path.resolve(root, entry)];
  while (stack.length) {
    const f = stack.pop(); if (seen.has(f) || !fs.existsSync(f)) continue; seen.add(f);
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/(?:^|\n)\s*(?:import|export)\s(?!type\s)[^'"]*?from\s+['"]([^'"]+)['"]/g)) {
      const spec = m[1];
      if (spec.startsWith('.')) stack.push(path.resolve(path.dirname(f), spec.replace(/\.js$/, '.ts')));
      else if (!spec.startsWith('node:')) natives.add(spec);
    }
  }
  console.log(entry, 'files', seen.size, 'packages', [...natives].sort().join(','));
}
