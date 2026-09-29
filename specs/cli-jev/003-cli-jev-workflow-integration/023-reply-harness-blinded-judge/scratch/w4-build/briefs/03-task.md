TASK: add the rubric loader, the operator labels parser and the label join to the script, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read first: S and T in full, and `.skilled/skills/sk-communication/benchmark/reply-harness/rubric.json`. Keep every existing line unchanged. Same style as S.

STEP 1. In S, append section `4. LABELS` after section 3, with three exports:
- `loadRubric(rubricPath = RUBRIC_PATH)`: read and parse the JSON. Require `dimensions` to be a non-empty array whose items each carry a non-empty string `id` and a non-empty string `judgeGuidance`, with no id repeated. Return an array of `{ id, judgeGuidance }` in file order. Any failure throws `new Error(\`${rubricPath}: ${problem}\`)`.
- `parseLabels(text, dimensionIds)`: the operator's JSONL. Split on `/\r?\n/`, skip lines that are empty after trim, and call a line's 1-based position n. Each line must parse to a JSON object with `masked`, a non-empty string, and `grades`, an object whose keys are exactly `dimensionIds` and whose values are each one of `LEVELS`. A failure throws `new Error(\`labels row ${n}: ${problem}\`)` with problem exactly one of: `not JSON`, `masked must be a non-empty path`, `grades must be an object`, `missing dimension ${id}`, `unknown dimension ${key}`, `${id} must be absent, partly met or fully met`. Check missing dimensions in `dimensionIds` order before unknown keys. Returns `[{ row: n, masked, grades }]`.
- `joinLabels(rows, census, repoRoot)`: for each row, resolve `path.resolve(repoRoot, row.masked)` and find the entry of `census.maskedFiles` whose `path.resolve(file)` equals it. None found throws `new Error(\`labels row ${row.row}: masked file is not in the census: ${row.masked}\`)`. A row whose masked `sha` is not in `census.replyBySha` is skipped and counted in `unmatchedRows`. Otherwise the reply SHA keys a Map `labeled` to `{ grades, maskedFile, text, row }`, where the first row for a SHA wins. A later row for the same SHA with any grade that differs sets `conflict` to `` `labels rows ${first.row} and ${row.row} grade the same reply differently` `` and returns at once. Returns `{ labeled, unmatchedRows, conflict }`, conflict `null` when none.
A comment above `joinLabels` says why the join goes through the reply text's SHA: the operator grades masked files, and two masked files can carry the same reply.

STEP 2. In T, add five tests after the existing ones. `ids` below is `loadRubric().map((d) => d.id)` and `all(level)` is an object mapping every id to that level.
9. `parseLabels('\n' + JSON.stringify({ masked: 'x.md', grades: all('absent') }), ids)` returns one row with `row` 2 and `masked` `'x.md'`.
10. The same line with `tone` removed from grades throws `/labels row 1: missing dimension tone/`.
11. The same line with `tone` set to `'mostly'` throws `/tone must be absent, partly met or fully met/`.
12. On `makeFixture()`, with `census = buildCensus(maskedDirs, repliesDirs)`: rows for `m1/C1-B.md` and `m2/C1-A.md` (both carry `r2/C1.md`, so one SHA) with `all('absent')` give `labeled.size` 1 and `conflict` null. Change one grade in the second row and `conflict` matches `/rows 1 and 2 grade the same reply differently/`. Pass absolute masked paths and `repoRoot` `'/'`.
13. On `makeFixture({ editOneAfterMasking: true })`, a row for `m2/C1-B.md` (the edited reply) gives `labeled.size` 0 and `unmatchedRows` 1, and a row for a path outside the census throws `/masked file is not in the census/`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 10.
Checks you run: `node --check S`, `node --check T`, `grep -c "^export function" S`. Do not run `node --test`: the orchestrator runs it.
