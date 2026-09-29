TASK: add the entry point that runs the zero-call census end to end, with integration tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read S and T in full first, then `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` lines 1882-1920 (the `main(argv, deps)` shape to follow). Keep every existing line unchanged except the two JSDoc lines in STEP 0. Same style as S.

STEP 0. In S section 5, replace `/** Fixed margin M the keep rule reads. */` with `/** The 10-point gain over the baseline that the keep rule requires. */`, and replace `/** Kill, margin, sign and flip thresholds restated for the report reader. */` with `/** Every keep-rule check in its order, restated for the report reader. */`.

STEP 1. In S, append section `9. ENTRY POINT` after section 5 (sections 6 to 8 come later and go between them). Add:
- exported constant `USAGE = 'usage: node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]'`.
- `export async function main(argv, deps = {})`, returning the exit code. Defaults: `repoRoot` REPO_ROOT, `out` writes the line plus `'\n'` to stdout, `err` the same to stderr, `env` process.env, `timeoutMs` 90000, `backoffMs` 2000. Steps in order:
 1. `parseArgs({ args: argv, strict: true, allowPositionals: false, options: { masked: { type: 'string', multiple: true }, replies: { type: 'string', multiple: true }, labels: { type: 'string' }, deem: { type: 'boolean' }, jev: { type: 'boolean' }, out: { type: 'string' }, 'accept-payload': { type: 'boolean' } } })`. A throw: `err(message)`, return 2.
 2. No `--masked` or no `--replies`: `err(USAGE)`, return 2.
 3. `--deem` or `--jev` without a non-empty `--out`: `err('--deem and --jev need --out <dir> so every call is recorded')`, return 2. This runs before any file is read.
 4. In one try block: `dimensions = loadRubric()`, `census = buildCensus(masked, replies)`, `scores = runBaseline(replies)`, `labelsText` from `--labels` via `fs.readFileSync(file, 'utf8')` or `null`, `rows` from `parseLabels` or `[]`, `joined = joinLabels(rows, census, repoRoot)`. Any throw: `err(error.message)`, return 2.
 5. When `joined.conflict`: `out('stop: label conflict')`, `err(joined.conflict)`, return 2.
 6. `baseline`: a Map over each unique `sha` of `census.maskedFiles` that `census.replyBySha` holds, to `baselineLevels(scores.get(path.resolve(reply.file)), ids)`. A missing score: `err(\`score.mjs gave no scores for ${reply.file}\`)`, return 2.
 7. `summaryLines({ census, dimensionIds: ids, questionsSha: questionSetSha(dimensions), baseline, labelsInfo, labeled: joined.labeled })`, labelsInfo `null` or `{ rows: rows.length, sha256: sha256Hex(labelsText), unmatchedRows: joined.unmatchedRows }`. Print every line with `out`. Return 0.
 A comment above `main` says the default run writes no file and spawns no model binary, so its stdout is the same on every run.
- Last lines of the file: `if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) { process.exitCode = await main(process.argv.slice(2)); }`.

STEP 2. In T, add helper `run(argv, env)`: calls `main(argv, { out, err, env })` with `out` and `err` pushing to arrays, returns `{ code, lines, errors }`. Then five tests, each on `makeFixture()` plus `makeStubBin(fixture.root)`, env `stubEnv(fixture.root)`, args `--masked m1 --masked m2 --replies r1 --replies r2 --replies r3` (absolute paths):
19. Default run: code 0, lines start `['masked: 28', 'distinct: 21', 'matched: 21', 'unmatched: 0']`, include `labels: none` and `labeled: 0`, end with `stop: fewer than 20 labeled replies`; `readStubLog(root)` is `[]`; and the fixture root holds the same entry names before and after.
20. `--deem` without `--out`: code 2, `lines` is `[]`, errors include the `--out` message, stub log `[]`.
21. A labels file whose one row drops `tone`: code 2, lines `[]`, an error matching `/labels row 1: missing dimension tone/`.
22. Two label rows for `m1/C1-B.md` and `m2/C1-A.md` with one grade different: code 2, lines `['stop: label conflict']`.
23. `node judge-agreement.mjs --masked <m1>` (no `--replies`) spawned with `spawnSync(process.execPath, ...)`: status 2 and stderr includes `usage:`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export async function main" S` prints 1.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.
