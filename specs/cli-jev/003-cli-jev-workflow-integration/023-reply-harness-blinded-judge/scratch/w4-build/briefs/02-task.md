TASK: add the mechanical baseline to the script and pin it with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read first: S and T in full, then `.skilled/skills/sk-communication/benchmark/reply-harness/score.mjs` lines 234-376 (its flags and the results file it writes). Keep every existing line of S and T unchanged. Same style as S: ESM, single quotes, semicolons, JSDoc on every export.

STEP 1. In S, append section `3. MECHANICAL BASELINE` after section 2, with three exports:
- `levelOfScore(value)`: returns `'absent'` when value === 0, `'fully met'` when value === 1, `'partly met'` when value is a number strictly between 0 and 1, and `null` for anything else (NaN, a negative, above 1, a string, undefined). Put one comment above it saying why: a score of 0 is absent, 1 is fully met and anything strictly between is partly met, fixed before any model run.
- `runBaseline(repliesDirs)`: returns a Map from absolute reply file path to that reply's `dimensionScores` object. For each dir in order: `const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-'))`, then `spawnSync(process.execPath, [SCORE_SCRIPT, '--condition', 'after', '--replies', path.resolve(dir), '--out', path.join(tmp, 'scores.json')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000 })`. A comment says the condition value only labels the output because no `--prompts` is passed. When `result.status !== 0`, throw `new Error(\`score.mjs failed on ${dir}: ${String(result.stderr || result.error?.message || '').trim().slice(0, 300)}\`)`. Otherwise parse `scores.json` and, for every row of `[...results.rows, ...results.noOps]`, set key `path.resolve(row.replyFile)` to `row.dimensionScores`. Remove tmp with `fs.rmSync(tmp, { recursive: true, force: true })` in a `finally`, so it goes on success and on failure. Never print score.mjs output.
- `baselineLevels(dimensionScores, dimensionIds)`: a plain object mapping each id to `levelOfScore(dimensionScores[id])`.

STEP 2. In T, add four tests after the existing ones, importing the new exports:
5. `levelOfScore(0)` is `'absent'`, `levelOfScore(1)` is `'fully met'`, `levelOfScore(0.4)` is `'partly met'`, and `baselineLevels({ a: 0, b: 0.5, c: 1 }, ['a', 'b', 'c'])` deep-equals `{ a: 'absent', b: 'partly met', c: 'fully met' }`.
6. `levelOfScore` returns `null` for each of `-0.1`, `1.5`, `NaN`, `'1'` and `undefined`.
7. `runBaseline(makeFixture().repliesDirs)` returns a Map of size 21, and every value has exactly the keys `answer-position`, `next-action-honesty`, `receipts`, `tone`, `tangent-suppression`, `completeness-under-cap`, `mechanical-tells`. Before the call, record the names in `os.tmpdir()` that start with `judge-agreement-` but not `judge-agreement-test-`. After the call the same filter returns no new name.
8. Delete `C1.md` from the fixture's first replies dir, then `runBaseline` on that one dir throws `/score\.mjs failed on/`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 7.
Checks you run: `node --check S`, `node --check T`, `grep -c "^export function" S`. Do not run `node --test`: the orchestrator runs it.
