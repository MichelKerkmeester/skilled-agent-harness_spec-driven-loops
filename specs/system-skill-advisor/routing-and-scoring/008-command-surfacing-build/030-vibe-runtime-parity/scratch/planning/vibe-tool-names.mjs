// Planning probe: tallies the tool effects recorded in committed Vibe journals, by
// tool name and the sorted keys of its input, so the scorer's Vibe table is taken
// from recorded calls and not from a reading of the hook matchers.
import { readFileSync } from 'node:fs';

for (const file of process.argv.slice(2)) {
  const tally = new Map();
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let record;
    try { record = JSON.parse(line); } catch { continue; }
    const delta = record?.payload?.delta;
    if (!Array.isArray(delta)) continue;
    for (const operation of delta) {
      const entry = operation?.entry;
      if (operation?.op !== 'append_entry' || entry?.type !== 'effect' || entry.detail?.kind !== 'tool') continue;
      const key = `${entry.detail.toolName} {${Object.keys(entry.detail.input ?? {}).sort().join(',')}}`;
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
  }
  console.log(file);
  for (const [key, count] of tally) console.log(`  ${count} ${key}`);
}
