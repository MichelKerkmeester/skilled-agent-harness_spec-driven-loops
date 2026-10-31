TASK: add the call plumbing both model arms share, and the score-answer parser, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, the model)
Read S and T in full, then M lines 979-990, 1169-1250 and 1762-1776. Keep every existing line unchanged. Same style as S.

STEP 1. In S, at the end of section 7 (after `deemGate`), copy from M with their JSDoc, changing nothing: `nearestRank` (M:979-990), `spawnCall` (M:1169-1225) and `createCallLog` (M:1227-1250).

STEP 2. In S, also at the end of section 7, add:
```
/**
 * Level position from one score answer. A backend may return a fractional
 * position, so it rounds to the nearest level, and a value outside 0 to 2
 * or a body that does not parse is an unmeasured call, not a crash.
 *
 * @param {string} stdout Raw stdout of one score call.
 * @returns {0 | 1 | 2 | null} Level position, or null when unmeasured.
 */
export function parseScoreAnswer(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return null;
  }
  const score = parsed?.answers?.answer?.score;
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 2) return null;
  return Math.round(score);
}
```

STEP 3. In S, in section 9 above `main`, copy `readStoredReport` from M:1762-1776 with its JSDoc, changing nothing.

STEP 4. In T, add three tests:
30. `parseScoreAnswer` on `'{"answers":{"answer":{"score":1.4}}}'` is 1, on score 1.5 is 2, on score 0 is 0, on score 2.2 is null, on score -0.1 is null, on `'not json'` is null and on `'{}'` is null.
31. `createCallLog(undefined).append({ a: 1 })` creates no file. On a fresh temp dir `d`, `createCallLog(path.join(d, 'out'))` appended `{ a: 1 }` twice leaves `out/calls.jsonl` with exactly two lines, each `'{"a":1}'`. `readStoredReport(path.join(d, 'none'))` is null.
32. `await spawnCall(process.execPath, ['-e', 'process.stdin.pipe(process.stdout)'], 'hi', process.env, 5000)` resolves with code 0, stdout `'hi'` and timedOut false. `await spawnCall(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], '', process.env, 200)` resolves with timedOut true.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 28.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.
