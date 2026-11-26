import { readFileSync } from 'node:fs';
const base = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes';
const load = (f) => new Map(JSON.parse(readFileSync(`${base}/${f}`, 'utf8')).map((r) => [r.id, r]));
const after = load('results-after.json');
const before = load('results-spec-baseline.json');
const short = (r) => r ? `${r.top?.skill ?? 'NONE'} cmd=${r.top?.command ?? '-'} pol=${r.top?.policy ?? '-'} live=${r.freshness}` : 'ABSENT';
const groupOf = (g) => [...after.values()].filter((r) => r.group === g).map((r) => r.id);
console.log('groups:', Object.fromEntries(['gain','stage-one','lose','lose-n9','no-gain','keep','negative','drift','near-miss'].map((g) => [g, groupOf(g).length])));
console.log('gain after:');
for (const id of ['V6','H1a','H1b','E1','E3']) console.log(`  ${id} ${short(after.get(id))}`);
console.log('lose/lose-n9 after:');
for (const id of ['R7','N9']) console.log(`  ${id} ${short(after.get(id))}`);
console.log('no-gain after (deep command present?):');
for (const id of groupOf('no-gain')) { const r = after.get(id); console.log(`  ${id} ${short(r)} deepCmd=${String(r?.top?.command ?? '').startsWith('/deep:')}`); }
const V5 = after.get('V5');
console.log('V5 top:', short(V5), 'mode=', V5?.top?.modes);
console.log('keep drift vs baseline:');
let keepDrift = 0;
for (const id of groupOf('keep')) {
  const a = after.get(id)?.top; const b = before.get(id)?.top;
  if (!a || !b || a.command !== b.command || a.policy !== b.policy) { keepDrift += 1; console.log(`  KEEP-DRIFT ${id} before=${b?.command}/${b?.policy} after=${a?.command}/${a?.policy}`); }
}
console.log(`  keep=${groupOf('keep').length} drift=${keepDrift}`);
console.log('negative drift vs baseline:');
let negDrift = 0;
for (const id of groupOf('negative')) {
  const a = after.get(id)?.top; const b = before.get(id)?.top;
  const aSkill = a?.skill ?? 'NONE'; const bSkill = b?.skill ?? 'NONE';
  if (aSkill !== bSkill || (a?.command ?? '-') !== (b?.command ?? '-')) { negDrift += 1; console.log(`  NEG-DRIFT ${id} before=${bSkill}/${b?.command ?? '-'} after=${aSkill}/${a?.command ?? '-'}`); }
}
console.log(`  negative=${groupOf('negative').length} drift=${negDrift}`);
const allLive = [...after.values()].every((r) => r.freshness === 'live' && r.exit === 0);
console.log('all live and exit 0:', allLive, 'count=', after.size);
