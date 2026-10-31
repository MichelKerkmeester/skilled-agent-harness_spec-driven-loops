TASK: make an empty or missing reply file cost only that reply its baseline, instead of stopping the whole census.
Why: the committed runs hold five empty reply files (failed generations), and `score.mjs` refuses a whole replies directory when one reply is empty or missing, so the census exits 2 on real data. score.mjs scores each case's reply on its own, so a stand-in text for the unusable file changes no other reply's scores.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read S and T in full first. Change only what the steps name. Same style as S.

STEP 1. In S section 1, add exported `CASES_PATH = path.join(SCRIPT_DIR, 'cases.json')` below `RUBRIC_PATH`, with a one-line JSDoc.

STEP 2. Rewrite the body of `runBaseline(repliesDirs)` (keep its name and return type) and its JSDoc. For each dir in order: make `tmp` as today; create `tmp/replies`; for each case `id` of `JSON.parse(fs.readFileSync(CASES_PATH, 'utf8')).map((c) => c.id)`: when `dir/<id>.md` exists and its text is non-empty after trim, copy that text to `tmp/replies/<id>.md`; otherwise write `'placeholder for an empty or missing reply\n'` there and remember the id as a stand-in. Copy `dir/<id>.meta.json` beside it when it exists. Spawn `score.mjs` exactly as today but with `--replies` set to `tmp/replies`. On a non-zero status throw the same `score.mjs failed on ${dir}: ...` error as today. For every row of `[...rows, ...noOps]`, take `id = path.basename(row.replyFile, '.md')`, skip stand-in ids, and set key `path.resolve(dir, \`${id}.md\`)` to `row.dimensionScores`. Remove tmp in the `finally` as today. A comment says why: a stand-in keeps score.mjs from refusing the directory, and its row is dropped, so no reply is ever scored without its own text.

STEP 3. In `summaryLines`, accept an extra input `noBaseline` (a number, default 0) and add the line `` `no baseline: ${noBaseline}` `` directly after the `unmatched:` line. When `labelsInfo` is not null, the labels line becomes `` `labels: rows=${rows} sha256=${sha256} unmatched=${unmatchedRows} no_baseline=${labelsInfo.noBaselineRows ?? 0}` ``.

STEP 4. In `main`: when building `baseline`, a matched SHA whose reply file has no scores no longer returns 2. Count it in `noBaseline` and leave it out of `baseline`. Then build `labeled` as `joined.labeled` without the SHAs missing from `baseline`, count the dropped ones as `noBaselineRows`, pass that `labeled` to `summaryLines`, add `noBaselineRows` to `labelsInfo`, and pass `noBaseline`. Remove the `score.mjs gave no scores for` error path.

STEP 5. In T:
a. Test 8 (the one deleting `C1.md` and expecting a throw) becomes: delete `C1.md` and empty `C2.md` in the fixture's first replies dir; `runBaseline([thatDir])` returns a Map of size 5 without the `C1.md` and `C2.md` paths. Keep its title meaningful.
b. New test: write `'{not json'` to `C3.meta.json` in the first replies dir; `runBaseline([thatDir])` throws `/score\.mjs failed on/`.
c. New test: in `makeFixture()`, before calling `run`, overwrite `r1/C1.md` and the one masked file that carries it (`m1/C1-A.md`) so the reply text is empty: write `'\n'` to `r1/C1.md` and `'Case: C1\n\nPrompt for C1\n\nReply A:\n\n\n'` to `m1/C1-A.md`. The default run exits 0, its lines include `matched: 21` and `no baseline: 1`, and the last line is `stop: fewer than 20 labeled replies`.
d. Wherever an existing test asserts the exact first lines of a default run, keep it passing; a `no baseline: 0` line now follows `unmatched: 0`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "score.mjs gave no scores" S` prints 0.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.
