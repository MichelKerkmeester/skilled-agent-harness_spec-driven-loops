// Differential check of the census port against the vendored TypeScript, on synthetic messages only.
// usage (repo root): node <this file>
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

const V = resolve("specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src");
const S = resolve('.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs');
const F = resolve('.skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures');

const vs = await import(pathToFileURL(`${V}/vendor/compaction/state.ts`).href);
const vt = await import(pathToFileURL(`${V}/core/transcript.ts`).href);
const s = await import(pathToFileURL(S).href);

let seed = 7;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = (a) => a[Math.floor(rand() * a.length)];
const words = ['alpha', 'beta_gamma', 'fooBar', 'x', 'CANARY-synthetic', '/tmp/a/b.md', 'spec', ' ', 'long '.repeat(40)];
const text = (n) => Array.from({ length: n }, () => pick(words)).join(' ');

function makeMessages(nMsgs, maxCalls) {
  const messages = [];
  let id = 0;
  for (let m = 0; m < nMsgs; m += 1) {
    const calls = Math.floor(rand() * maxCalls);
    const toolUses = Array.from({ length: calls }, () => {
      id += 1;
      return { tool_use_id: `toolu_${id}`, tool: pick(['Read', 'Edit', 'Write', 'Bash', 'Grep']), input: { file_path: `/tmp/f${id}.md`, q: text(Math.floor(rand() * 30)) } };
    });
    messages.push({ role: 'assistant', text: text(Math.floor(rand() * 50)), toolUses });
    messages.push({
      role: 'user',
      text: text(Math.floor(rand() * 20)),
      toolUses: [],
      toolResults: toolUses.map((u) => ({ tool_use_id: u.tool_use_id, text: text(Math.floor(rand() * 400)), isError: rand() < 0.1 })),
    });
  }
  return messages;
}

const run = (f) => { try { return { ok: f() }; } catch (e) { return { throw: String(e && e.message) }; } };
let cases = 0;
let mismatches = 0;
const stages = {};
for (const [n, c] of [[1, 1], [3, 4], [8, 6], [20, 10], [60, 20], [150, 30], [400, 40], [800, 8]]) {
  for (let k = 0; k < 4; k += 1) {
    const messages = makeMessages(n, c);
    for (const keep of [0, 6]) {
      cases += 1;
      const a = run(() => vs.collectToolCalls(messages, keep));
      const b = run(() => s.collectToolCalls(messages, keep));
      if (JSON.stringify(a) !== JSON.stringify(b)) mismatches += 1;
      const calls = vs.collectToolCalls(messages, keep);
      for (const max of [25000, 4000]) {
        cases += 1;
        const x = run(() => vs.fitState(messages, calls, { maxStateTokens: max, preserveRecentMessages: keep, goal: '' }));
        const y = run(() => s.fitState(messages, calls, { maxStateTokens: max, preserveRecentMessages: keep, goal: '' }));
        const label = x.throw ? 'throw' : x.ok.stage;
        stages[label] = (stages[label] || 0) + 1;
        if (JSON.stringify(x) !== JSON.stringify(y)) mismatches += 1;
      }
    }
  }
}
for (let k = 0; k < 200; k += 1) {
  cases += 1;
  const t = text(Math.floor(rand() * 300));
  if (vs.estimateTokens(t) !== s.estimateTokens(t)) mismatches += 1;
}
let recs = 0;
for (const name of readdirSync(F)) {
  for (const line of readFileSync(`${F}/${name}`, 'utf8').split('\n')) {
    let r;
    try { r = JSON.parse(line); } catch { continue; }
    recs += 1;
    cases += 1;
    if (JSON.stringify(run(() => vt.sessionRecordToMessage(r))) !== JSON.stringify(run(() => s.toMessage(r)))) mismatches += 1;
  }
}
console.log(`cases=${cases} mismatches=${mismatches} fixture_records=${recs} stages=${JSON.stringify(stages)}`);
process.exitCode = mismatches === 0 ? 0 : 1;
