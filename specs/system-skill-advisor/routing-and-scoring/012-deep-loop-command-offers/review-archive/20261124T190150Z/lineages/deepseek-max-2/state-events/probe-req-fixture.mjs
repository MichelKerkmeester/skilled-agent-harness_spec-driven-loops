import { readFileSync } from 'node:fs';
const spec = readFileSync('specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md', 'utf8').split('\n');
const fixture = JSON.parse(readFileSync('.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json', 'utf8')).cases;
const norm = (s) => s.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim();
const byPrompt = new Map(fixture.map((c) => [norm(c.prompt), c]));
const want = process.argv.slice(2);
for (const line of spec) {
  const m = /^\| (REQ-\d{3}) \|/.exec(line);
  if (!m || !want.includes(m[1])) continue;
  const quoted = [...line.matchAll(/"([^"]{12,})"/g)].map((x) => x[1]).filter((q) => q.includes(' ') && !/^[a-z]+$/.test(q));
  console.log(`${m[1]} (spec line ${spec.indexOf(line) + 1}) quotes=${quoted.length}`);
  for (const q of quoted) {
    const row = byPrompt.get(norm(q));
    console.log(`   ${row ? `row=${row.id} asks=${row.asksForLoopRun} stuck=${row.stuckRun} doctorWithheld=${row.doctorWithheld ?? '-'}` : 'NO-FIXTURE-ROW'} :: ${q}`);
  }
}
