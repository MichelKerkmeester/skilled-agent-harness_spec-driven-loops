// Fixture author simulation; product commands never write acknowledgement tokens.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
export function acknowledgeMap(query, mapFile, map = JSON.parse(readFileSync(mapFile, 'utf8'))) {
  const write = () => writeFileSync(mapFile, JSON.stringify(map, null, 2) + '\n');
  const changes = query('report', '--view', 'changes', '--limit', '1000').items;
  if (changes.length) {
    // affectedFlows is the author's judgement, not a restatement of knownFlows.
    // This fixture author reads the edit and finds no claim it invalidates,
    // which is the ordinary outcome and the one worth exercising here.
    map.changeAssessments = changes.map(c => ({id:c.id,basis:null,affectedFlows:[],explanation:'Fixture author inspected this source edit and the claims that depend on it.'}));
    write();
    const validation = query('validate');
    for (const r of map.changeAssessments) r.basis = validation.changes.find(c => c.id === r.id).expectedBasis;
    write();
  }
  const validation = query('validate');
  for (const a of map.assertions) for (const f of a.flows) {
    f.basis = validation.flows.find(r => r.id === `${a.id}/${f.id}`).expectedBasis;
    assert.match(f.basis, /^scov3:[a-f0-9]{64}$/);
  }
  write();
  return map;
}
