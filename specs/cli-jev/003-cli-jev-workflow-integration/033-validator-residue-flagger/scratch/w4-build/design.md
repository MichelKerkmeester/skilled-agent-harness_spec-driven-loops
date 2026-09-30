# Build Design: validator-residue-flagger

Script `S` = `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`, test `T` = `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs`, labels `L` = `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl`. Patterns: the shipped CommonJS sibling `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` (1,566 lines; exported pure functions, `main(argv, deps)`, `require.main === module` guard) with its test (646 lines, `node --test`); and for `--draw`, the label file, the two gates, the keep rule, the verdict line and the test harness, `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` (1,699 lines) with `labels.jsonl` (90 rows) and `tests/score-injection-screen.test.mjs` (716 lines). All names below are proposed.

## 1. Premises

| Premise (as the spec cites it) | Today | Status |
|---|---|---|
| `research.md:886-905` R26 block (`:890` verdict later, `:894` metric, `:899` keep-or-kill, `:900` checklist, `:905` promote-when) | `../007-classifier-deep-research/research/research.md` same lines | ok |
| `research.md:460-480` (D: Validators), `:475` review-findings row, `:113` K9 | same file, same lines | ok |
| `research.md:1042` row 92, `:1045` row 95, `:1047` row 97, `:1076` one-judgment row | `007-classifier-deep-research/research/research.md` same lines | ok |
| `../001-deep-research/research/research.md:1059` BASE1 row 15; `:1052` BASE1 row 8 | `001-deep-research/research/research.md` same lines | ok |
| `../007-.../research/lineages/mimo/steer.md:152` DEFECT line | same line | ok |
| `../007-.../research/lineages/glm/iterations/iteration-004.md` F3 | F3 at `:29`, heading `:39` | ok |
| `../007-.../research/lineages/mimo/iterations/iteration-002.md` Q4 | Q4 at `:113` | ok |
| `../006-goal-criteria-lint/spec.md:166` Deem stability = commit pair | same line (REQ-013) | ok |
| `../017-deem-search-narrowing-arm/spec.md:148` exit table | same line (REQ-008) | ok |
| `../002-advisor-jev-tiebreak-arm/implementation-summary.md:104` calibration, `:107` reading | same lines | ok |
| `../003-goal-verifier-jev-shadow/goal.md:64` D9 payload gate | same line | ok |
| `deem-local.md:38` `noul` p50 60.5 ms, `:53` temperature 1.0, `:92` deterministic | same lines | ok |
| `.skilled/skills/cli-classifier/cli-deem/SKILL.md:49-57` health check | same lines | ok |
| `score-track-narrowing.mjs:1076-1080` (`deemCommand`) — the spec names the file only | resolved at `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1076-1080` | ok |
| `deep-review/SKILL.md:306-313` dimensions, `:310` correctness, `:312` traceability | same lines | ok |
| `assets/prompt-pack-iteration.md.tmpl:53` severity, `:113` narrative, `:157` finding record | same lines | ok |
| 008 Complete `ee3a1b057c`; 009 Complete `ea883967d4` | both spec `Status` Complete; both commits resolve (`git cat-file -t` -> commit) | ok |
| `jev` 0.6.2 on `PATH` | `command -v jev` -> `~/.local/bin/jev` (PATH check only; the version claim is `plan.md:135`'s, not re-run) | ok |
| Files to Change targets | `scripts/README.md`, `scripts/tests/README.md`, `SKILL.md`, `.hermes/skills/deep-review/SKILL.md`, `README.md`, `changelog/v1.11.0.36.md` (newest; SKILL.md `version: 1.11.0.36`), `feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` all exist | ok |
| The three Create rows | no `score-residue-flagger*` or `residue-flagger-labels*` exists anywhere | new |
| Sibling files | score-clarify-default.cjs 1,566 lines, its test 646; score-injection-screen.mjs 1,699, labels.jsonl 90 rows; `render-contract-snapshot.cjs` 551 and `tests/reduce-state-summary-fallback.test.cjs` 286 beside the new files | ok |

## 2. Interface

### 2.1 CLI switches and exit codes

| Switch | Type | Rule |
|---|---|---|
| `--draw` | boolean | needs `--seed <n>`; takes only `--seed` and `--labels`; writes `L`; refuses (exit 2, stderr `draw refused: <path> holds a label`) when any row carries a non-null `label`; with fewer than 25 resolvable rows in a category exits 2 naming the shortfall |
| `--seed <n>` | string | read only with `--draw`; a non-integer exits 2 |
| `--jev` | boolean | needs `--out <dir>`; else exit 2 before any output or call |
| `--deem` | boolean | needs `--out <dir>`; else exit 2 before any output or call |
| `--out <dir>` | string | report directory; `report.json` written only when a column ran or an arm stopped |
| `--labels <file>` | string | default `LABELS_PATH` beside the script |

Exit codes: `0` = the report printed (a skipped or stopped arm included) or rows drawn; `2` = bad invocation, unreadable input, a `--draw` over a label, or a missing `--out` — all before any call. A child's own exit 130 maps to that arm's stop line and the script still exits 0; the script installs no signal handler, so a SIGINT on itself is the shell's 130.

### 2.2 stdout lines (verbatim formats)

Census, always first:

```
census: commit=<sha12> files=<n> tables=<n> rows=<n> skipped=<n>
severity P0=<n> P1=<n> P2=<n>
dimension correctness=<n> security=<n> traceability=<n> maintainability=<n>
header "<Severity|Sev>|<Dimension>|<File:Line|File|Evidence>": tables=<n> rows=<n>
census skipped: <review-file>:<line>
resolvable: correctness=<n> traceability=<n> refused=<n> dropped=<n>
```

One `header` line per recognized shape and one `census skipped:` line per skipped table, both sorted; no finding text, title or passage text ever prints.

Fixed rules, every run, before any call:

```
margin: 0.10
keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)
instruction correctness sha256=<hex>: Does this passage claim behavior that its own text shows to be wrong or inconsistent?
instruction traceability sha256=<hex>: Does this passage name a spec item or requirement that the text it describes does not match or does not contain?
```

Label gate, baseline and headroom, in this order:

```
stop: fewer than 100 labeled rows
baseline: flag-nothing right=<n> of <K>
baseline: defect share=<n> of <K>
headroom: a 10-point gain fits above <n>/<K>
no headroom
underpowered
```

The `stop:` line prints when fewer than 100 rows carry a label, and no arm starts. With 100: the two `baseline:` lines, then `no headroom` when `10*right > 9*K`, `underpowered` when fewer than 5 rows are labeled `defect`, else the headroom line. Neither line starts an arm.

Draw mode, one line: `draw: path=<p> seed=<n> commit=<sha12> rows=100 positives=50 negatives=50`.

Deem arm:

```
deem: health backend=<b> model=<m> model_commit=<c> source_commit=<c>
deem arm skipped: not reachable|stub backend|model|bad health response
deem: found=<json>                                  (after `model` and `bad health response` only)
deem: nothing leaves the machine; planned calls: <K>; estimated wall time: <x> s at 60.5 ms per call, the noul p50 in deem-local.md
brier deem: <value>
flips: not applicable (deem noul)
deem arm skipped: fewer than 100 labeled rows
deem arm skipped: no headroom|underpowered
deem arm stopped: backend refused|server gone|model commit changed mid-run|usage error|interrupted
deem: partial rows=<n>
requalify: model commit changed
```

Jev arm:

```
jev: path=<p> provider=<P>
jev arm skipped: jev not on PATH|version|no credential
jev: found=<json> path=<p>                            (after `version` only)
jev: payload: windows of committed documents; planned calls: 301; estimated input tokens: <n>
jev: auth test provider=<P> model=<m>
brier jev: <value>
jev arm skipped: fewer than 100 labeled rows
jev arm skipped: no headroom|underpowered
jev arm stopped: key rejected|usage error|interrupted|auth test failed
jev: partial rows=<n>
requalify: model changed
```

The gate runs whenever its switch is set, after the census/baseline block; the arm starts only when the label gate is complete, the headroom line printed and the gate passed. A stop prints its line and `partial rows=<n>` and no verdict.

Verdict line, one per column, last:

```
verdict <backend>: <keep|kill (precision)|stop (coverage)|stop (margin)|stop (sign test)|stop (flips)> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> TP=<TP> FP=<FP> F=<F|n/a> p=<p> <suffix>
```

The suffix is `model=<m> model_commit=<c> source_commit=<c>` for Deem and `jev_version=0.6.2 provider=<P> model=<m>` for Jev; `F=n/a` for Deem. `p` is the exact sign-test p. The same line goes into that column of `report.json`.

### 2.3 Files written

| Path | When | Body |
|---|---|---|
| `--labels <file>` (default `LABELS_PATH`) | `--draw` only | 100 JSON lines, no text: `{id, source, category, doc, line, window_start, window_end, commit, window_sha12, kind, label, labeler}`; 50 `positive` (25 per category) and 50 `negative`; every `label` and `labeler` null |
| `<out>/calls.jsonl` | first call of an arm | one line per call: `{rowId, rerun, wallMs, exitCode, backend, probability, flag, status}`; Deem adds `modelId`, `modelCommit`, `sourceCommit`; Jev adds `jevVersion`, `provider`, `model`; `status` is `measured`, `unmeasured` or `unmeasured_timeout` |
| `<out>/report.json` | after the arms, when a column ran or an arm stopped | `{commit, census, labels:{path,sha256,rows,labeled}, baseline:{right,defect,K}, headroom, margin, keepRule, instructions:{correctness:{sha256},traceability:{sha256}}, columns:{jev,deem}, requalify:{jev,deem}, stopped, skipped}` |

Nothing else is ever written. The default run writes no file; a gate skip writes no file.

### 2.4 Exported functions

```
sha256Hex(text) -> hex
git(repoRoot, args) -> stdout                        # spawnSync git -C, GIT_* redirectors deleted
trackedFiles(repoRoot) -> string[]                   # git ls-files -z
headCommit(repoRoot) -> sha
readAtCommit(repoRoot, commit, path) -> text         # git show <commit>:<path>
walkReviewFiles(tracked) -> path[]                   # specs/**/*.md with /review/ or /ai-council/, no /context/ or /scratch/
parseFindingTables(text, file) -> {tables:[{shape, headerLine, rows:[{line, severity, dimension, location}]}], skipped:[{line, header}]}
addingCommit(repoRoot, path) -> sha|null             # git log --diff-filter=A -1 --format=%H
reviewedCommit(repoRoot, path) -> sha|null           # first parent of addingCommit
resolveLocation(cell, {commit, tracked, repoRoot}) -> {status: 'resolved'|'refused'|'dropped', path, line}
buildCensus(repoRoot, tracked) -> {commit, files, tables, rows, bySeverity, byDimension, byShape, skipped[], resolvable:{correctness,traceability}, refused, dropped}
censusLines(census) -> string[]
mulberry32(seed) -> () => number
drawRows(census, repoRoot, commit, seed) -> row[]    # 100 rows, no text
readJsonl(file) -> row[]|null
writeJsonl(file, rows) -> void
holdsLabels(rows) -> boolean
labelGate(rows) -> {complete, labeled}
baselineLines(summary) -> string[]
headroomLine(summary) -> string
ruleLines() -> string[]
instructionLines() -> string[]
signTestP(wins, losses) -> {p, below}                # exact BigInt, 20n*num < den
brierScore(calls, rows) -> number|null
decideVerdict({backend, K, M, A, B, W, L, TP, FP, F}) -> {outcome, reason, p}
verdictText(v) -> string
verdictLine(backend, counts, decision, suffix) -> string
which(name, env) -> string|null
deemCommand(env, repoRoot) -> string[]               # PATH cli-deem, else the repo copy under node
readDeemHealth(cmd, env) -> {ok:true, backend, model, modelCommit, sourceCommit} | {ok:false, reason, found}
deemGate(ctx) -> {passed, cmd, reason?}
jevGate(ctx) -> {passed, path, provider, reason?}
spawnCall(file, args, stdinText, env, timeoutMs) -> Promise<{code, stdout, stderr, wallMs, timedOut}>
createCallLog(outDir) -> {append(record)}
readStoredReport(outDir) -> object|null
runDeemArm(plan, gate, ctx) -> Promise<{column}|{stopped, partialRows}>
runJevArm(plan, gate, ctx) -> Promise<{column}|{stopped, partialRows}>
buildReport(input) -> object
parseArgs(argv) -> flags|{error}
main(argv, deps) -> Promise<0|2>                     # deps: repoRoot, out, err, env, timeoutMs, backoffMs
```

Behavior rules not obvious from the signatures:

- Corpus walk: a tracked path is read when it ends `.md`, starts `specs/`, holds `/review/` or `/ai-council/`, and holds neither `/context/` nor `/scratch/`; every read goes through `git show`, never the worktree.
- Table parser: a recognized header carries a severity column (`Severity` or `Sev`), a `Dimension` column and a location column (`File:Line`, `File` or `Evidence`); the shape is the three column names joined by `|`. A finding row is a table row whose severity cell is `P0`, `P1` or `P2`. A table whose header lacks any of the three is counted in `skipped` with its header line.
- Dimension mapping: a lowercased cell containing `correctness` -> correctness, `security` -> security, `traceab` -> traceability, `maintainab` -> maintainability, else `other` (in no canonical bucket).
- Commit resolution: `reviewedCommit` = the first parent of the commit that added the review file; a root commit or an untracked review file drops that file's rows.
- Location: the cell's first `.md` token with an optional `:line`. A basename starting `.env`, or a path outside `git ls-files`, is `refused`, never opened; a missing line, or a line past the file's end at the reviewed commit, is `dropped`; both are counted and the row leaves the frame.
- Draw: positives are a seeded sample of resolvable correctness and traceability rows, 25 each, window = cited line ±10 clamped to the file, `window_sha12` = `sha256Hex(window lines joined '\n').slice(0,12)`; negatives are seeded lines in the same documents at the same commits, 25 per category, at least 20 lines from every cited line in that document; ids `r001`..`r100`; one seed reproduces one file byte for byte.
- Label gate: complete when exactly 100 rows carry `label` `defect` or `clean`.
- Baseline: flag-nothing is right on every `clean` row, so `right` = the clean count and the sample's share is the `defect` count.
- Arms: a call's flag is `probability >= 0.5`; a Jev row's flag is the modal flag over its 3 calls and `F` adds `3 - most common flag count`; a Deem row is one call; a row that did not measure leaves the column and is counted; every spawn reaches `calls.jsonl` before any stop.
- Requalify: `readStoredReport` compares the stored column's identity with the live one and prints `requalify: model commit changed` (Deem pair) or `requalify: model changed` (Jev provider or model) before the verdict.
- `decideVerdict`, first failure wins: coverage `10*M >= 9*K` -> `stop (coverage)`; precision `TP+FP >= 1 && 5*TP >= 4*(TP+FP)` -> `kill (precision)`; margin `10*(A-B) >= M` -> `stop (margin)`; `signTestP(W, L).below` -> `stop (sign test)`; Jev flips `10*F <= 3*M` -> `stop (flips)`; all passing -> `keep`.
- `main`: zero calls and zero writes unless `--jev` or `--deem` is set; `--draw` reads the census only to draw and writes only the labels file.

### 2.5 Constants

`SCRIPT_DIR`, `REPO_ROOT` (five levels up), `LABELS_PATH` = `path.join(SCRIPT_DIR, 'residue-flagger-labels.jsonl')`, `CATEGORIES = ['correctness', 'traceability']`, `CANONICAL_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability']`, `LABEL_GATE = 100`, `ROWS_TOTAL = 100`, `POSITIVES = 50`, `NEGATIVES = 50`, `PER_CATEGORY = 25`, `WINDOW_RADIUS = 10`, `NEGATIVE_MIN_GAP = 20`, `FLAG_AT = 0.5`, `JEV_RERUNS = 3`, `MARGIN_LINE = 'margin: 0.10'`, `KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)'`, `USAGE`, `INSTRUCTION_CORRECTNESS`, `INSTRUCTION_TRACEABILITY`, `JEV_VERSION = 'jev 0.6.2'`, `DEEM_MODEL = 'deem-0.8-v1'`, `HEALTH_TIMEOUT_MS = 2000`, `CALL_TIMEOUT_MS = 90000`, `BACKOFF_MS = 2000`, `DEEM_P50_MS = 60.5`. No key literal and no key variable name anywhere; the words `API_KEY`, `TYPESAFE`, `Bearer` and `Authorization` appear in no comment, string or identifier.

## 3. Test cases

Fixture: a temp git repository with two commits (commit 1 adds the cited documents, commit 2 adds the review files), review folders holding the three recognized header shapes and one unrecognized shape, an untracked review file and a `.env` location, plus stub `jev` and `cli-deem` binaries that log one line per call (the injection-screen stub shape); the fixture deletes the `GIT_*` redirectors and `JEV_PROVIDER`/`CLI_DEEM_URL` from its env. Both arms are driven by stubs only; no case touches a live backend or the network.

| name | input | expected |
|---|---|---|
| corpus walk | review files under `/review/`, `/ai-council/`, plus `/context/`, `/scratch/` and non-md paths | only the first two read |
| parser three shapes | tables headed `Severity\|Dimension\|File:Line`, `Sev\|Dimension\|File`, `Severity\|Dimension\|Evidence` | rows counted per shape; P0/P1/P2 counts |
| parser skipped shape | a `Level\|Area\|Where` table | one skipped table counted, no rows from it |
| dimension mapping | `Correctness` and `Spec-Alignment / Traceability` cells | canonical correctness / traceability counts |
| commit resolution | review file added in commit 2, documents in commit 1 | reviewed commit = commit 1 |
| untracked review file | a review file not in `git ls-files` | not read; no rows |
| location resolves | `docs/a.md:5` on a tracked doc at the reviewed commit | resolved; correctness count 1 |
| location dropped | `docs/a.md:999` on a 10-line doc | dropped and counted |
| refused `.env` | `.env.example:3` | refused, never opened |
| draw reproducible | `--draw --seed 1 --labels <tmp>` twice | byte-identical; 100 rows; no text field; 50/50; 25 per category |
| draw spacing | the drawn rows | every negative at least 20 lines from every cited line in its document |
| draw refuses labels | a labels file with one `label: defect` row | exit 2; file unchanged |
| draw shortfall | fewer than 25 resolvable rows in a category | exit 2 naming the shortfall |
| label gate 99 | a labels file with 99 labeled rows | `stop: fewer than 100 labeled rows`; zero stub calls |
| default zero calls | the default run, stubs first on `PATH` | exit 0; census lines; both stub logs empty; no file written |
| baseline and headroom | 100 labeled rows with headroom | `baseline:` lines, `margin:`, `keep rule:`, headroom line |
| no headroom | 95 clean / 5 defect | `no headroom`; zero calls |
| underpowered | 4 defect rows | `underpowered`; zero calls |
| deem gate pass | stub health `torch` / `deem-0.8-v1` / pair | `deem: health ...` then the arm |
| deem stub backend | stub health exit 3 with `stub` | `deem arm skipped: stub backend`; exit 0; earlier lines byte-identical |
| deem keep | stub `noul` 0.9 on defect rows, 0.1 on clean | `verdict deem: keep`; 100 `calls.jsonl` lines with `wallMs`, `exitCode`, `modelCommit`, `sourceCommit` |
| deem exit 4 changed pair | a call exits 4; the recheck returns a new pair | `deem arm stopped: model commit changed mid-run`; no verdict |
| jev gate pass | stub `--version` `jev 0.6.2`, `auth status` exit 0 | identity line then the arm |
| jev no credential | stub `auth status --provider official` exit 3 | identity line then `jev arm skipped: no credential` |
| jev one provider | a passing stub, one row, 3 reruns | every logged `jev` call carries `--provider official` |
| jev exit 3 after gate | a stub that exits 3 on `noul` | `jev arm stopped: key rejected`; no verdict |
| `--out` required | `--jev` without `--out` | exit 2; no call; no file |
| verdict keep | all five conditions met | `verdict jev: keep` |
| verdict kill precision | `TP+FP >= 1` and `5*TP < 4*(TP+FP)` | `kill (precision)` |
| verdict stop coverage | 2 of 10 rows unmeasured | `stop (coverage)` |
| verdict stop margin | `10*(A-B) < M` | `stop (margin)` |
| requalify | a stored report with a different Deem pair, then a different Jev provider | `requalify: model commit changed` / `requalify: model changed` before the verdict |

## 4. Build steps

Order note: the verdict functions (step 5) land before the arms (steps 6 and 7), because each arm prints its column's verdict line; the plan's own checks are unchanged. Steps 1, 9 and 11 are the session's; every other step is one change for one executor.

1. **Baseline (session).** Record `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/`, output and exit code, before any change.
2. **Census (Devin).** Create `S` sections 1-3: constants, `git`, `trackedFiles`, `headCommit`, `readAtCommit`, `walkReviewFiles`, `parseFindingTables`, `addingCommit`, `reviewedCommit`, `resolveLocation`, `buildCensus`, `censusLines`, plus the `parseArgs` skeleton and the `main()` that prints the census and returns 0. Create `T` with the fixture builder (temp git repo, two commits, stub bins, clean env) and cases `corpus walk`, `parser three shapes`, `parser skipped shape`, `dimension mapping`, `commit resolution`, `untracked review file`, `location resolves`, `location dropped`, `refused .env`. Check: those nine pass.
3. **Draw (Devin).** Add `mulberry32`, `drawRows`, `readJsonl`, `writeJsonl`, `holdsLabels` and the `--draw`/`--seed`/`--labels` handling, with cases `draw reproducible`, `draw spacing`, `draw refuses labels`, `draw shortfall`. Check: all pass and two same-seed draws are byte-identical.
4. **Gate, baseline, headroom, rules (Devin).** Add `sha256Hex`, `labelGate`, `baselineLines`, `headroomLine`, `ruleLines`, `instructionLines`, with cases `label gate 99`, `default zero calls`, `baseline and headroom`, `no headroom`, `underpowered`. Check: all pass and the default run spawns nothing.
5. **Keep rule and verdict (Devin).** Add `signTestP`, `brierScore`, `decideVerdict`, `verdictText`, `verdictLine`, with cases `verdict keep`, `verdict kill precision`, `verdict stop coverage`, `verdict stop margin`. Check: all pass.
6. **Deem gate and arm (Devin).** Add `which`, `deemCommand`, `readDeemHealth`, `deemGate`, `spawnCall`, `createCallLog`, `readStoredReport`, `runDeemArm`, `buildReport` and the `--deem`/`--out` handling, with cases `deem gate pass`, `deem stub backend`, `deem keep`, `deem exit 4 changed pair`, `--out` required, `requalify`. Check: all pass and the `report.json` keys match 2.3.
7. **Jev gate and arm (Devin).** Add `jevGate`, `runJevArm` and the `--jev` handling, with cases `jev gate pass`, `jev no credential`, `jev one provider`, `jev exit 3 after gate`. Check: all pass.
8. **README rows (Pi, one doc each).** `scripts/README.md`: one row in the section 2 table after the `render-contract-snapshot.cjs` row (`:24`), modelled on that row — `score-residue-flagger.cjs` (the census, the zero-call default, `--jev`/`--deem`) and the labels file named in it. `scripts/tests/README.md`: one row in the section 2 table after the `reduce-state-summary-fallback.test.cjs` row (`:20`), modelled on that row. Mode for both: `sk-create-readme`. Check: `validate_document.py --type readme` exits 0 on each.
9. **Label gate and runs (session + operator).** `--draw --seed <n>` on the real tree, commit the drawn file, the operator labels 100 rows (no model writes a label). Then one zero-call run; unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes; each verdict or skip line, with p50, p95 and what it was measured on, goes into `goal.md`'s log.
10. **Skill docs (Pi, one doc each).** Each names the script, its zero-call default and both switches, and names no verdict the runs did not print; they are written even if the phase holds at the label gate. In order:
    - `SKILL.md`, mode `sk-create-skill`: one sentence after the Review Dimensions table (`:313`), modelled on that section — the offline measurement, its zero-call default, both switches and that it adds no column.
    - `.hermes/skills/deep-review/SKILL.md`: regenerate with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, not authored.
    - `README.md`, mode `sk-create-readme`: one row in the section 9 table after `scripts/runtime-capabilities.cjs` (`:262`), modelled on that row.
    - `changelog/v1.11.0.37.md`, mode `sk-create-changelog` (build bump from the newest `v1.11.0.36.md`; re-derive at build), modelled on `v1.11.0.36.md`; then `node .skilled/skills/sk-doc/scripts/frontmatter-version.mjs apply --skill deep-review` syncs `SKILL.md`'s `version:`.
    - `feature-catalog/review-dimensions/residue-flagger-measurement.md`, mode `sk-create-feature-catalog`, modelled on `review-dimensions/correctness.md`: sections 1 to 4, `title: "Residue Flagger Measurement"`, the SOURCE FILES tables (implementation: the script and the labels file; validation: the test as `Node test` and the playbook scenario as `Manual playbook`).
    - `feature-catalog/feature-catalog.md`, same mode: one H3 block in section 4 after the Maintainability block (`:352-364`), modelled on the Correctness block (`:304-316`); the H3 title must equal the leaf's `title` and its `#### Description` must normalize-equal the leaf's `description`.
    - `manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md`, mode `sk-create-manual-testing-playbook`, modelled on `entry-points-and-modes/auto-mode-deep-review-kickoff.md`: sections 1 to 4, `DRV-069`, the zero-call run and a stub-backend skip.
    - `manual-testing-playbook/manual-testing-playbook.md`, same mode: one scenario row in the summary and one line in the index list, modelled on DRV-001's rows (`:142`, `:641`).
    Check: `validate_document.py` exits 0 on each changed doc.
11. **Verification, review, commit (session).** Run the proof plan in section 5, a cross-family review of `S` and `T`, then path-scoped commits. A pre-commit hook may re-mint generated files; those are expected and are not hand-edited.

## 5. Proof plan

| Criterion (this phase's `goal.md`) | Command | Expected |
|---|---|---|
| The default run exits 0, prints finding rows per severity and dimension, and stub binaries log zero calls | `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` with the stub bins first on `PATH` | exit 0; `census:` and `severity`/`dimension` lines; `stop: fewer than 100 labeled rows` (or `baseline:` plus a headroom line once labeled); both stub logs empty; `git status --porcelain` unchanged |
| The two skip lines, each exit 0, other output byte-identical | the same with `--deem --out <tmp>` and a stub health reporting `stub`; then with `--jev --out <tmp>` and a stub `auth status --provider official` exiting 3 | `deem arm skipped: stub backend`; the `jev: path=... provider=official` line then `jev arm skipped: no credential`; each exit 0; `diff` against the default run shows only those lines |
| The test file exits 0 with at least 18 passed and 0 failed | `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` | exit 0, `# fail 0`, `# pass` at least 18 |
| One verdict line per backend whose gate passed, with per-call records; or `no headroom`/`underpowered` | after the operator's labels: `--jev --out <dir>` and `--deem --out <dir>` | one `verdict <backend>:` line per column that ran; every `calls.jsonl` line carries `wallMs` and `exitCode`, Deem lines `modelCommit` and `sourceCommit`, Jev lines `provider` and `model`; or the zero-call run printed `no headroom` or `underpowered` |
| No key grep match, no workspace change, docs valid | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on `S`; `git status --porcelain` before and after each run; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc> --type <readme\|skill\|changelog\|feature_catalog\|playbook\|playbook_feature>` per changed doc | no match; identical status apart from the report directory; exit 0 per doc |
| Spec validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger --strict` | `RESULT: PASSED` |

The label gate stop line is an accepted end state for criterion 4, per parent D4.

## 6. Open questions

| Open | Answer |
|---|---|
| Which playbook category | `entry-points-and-modes/`, a new operator-facing script entrypoint (proposed) |
| The scenario id | `DRV-069`, the next after DRV-068 (proposed) |
| Where the SKILL.md sentence goes | After the Review Dimensions table (`:313`); the `Scripts:` line at `:417` stays (proposed) |
| The next changelog version | `v1.11.0.37.md`, a build bump from `v1.11.0.36`; re-derive at build, then sync `SKILL.md`'s `version:` with `frontmatter-version.mjs apply` (proposed) |
| The census line formats and the draw line | As in 2.2 (proposed) |
| `--labels <file>` | Added so `--draw` can write two temp paths in tests; the default stays beside the script (proposed) |
| The label row's `source` field | The review file that supplied the row's frame (proposed) |
| The fixed rules print on the unlabeled run too | Yes; they print before the gate line on every run (proposed) |
| Dimension cells outside the four canonical stems | Counted as `other`, in no canonical bucket (proposed) |
| A `File` location cell with no line | Dropped and counted; only a `path:line` resolves (proposed) |
| A passing gate with the label gate unmet or headroom failed | `jev arm skipped: fewer than 100 labeled rows` / `jev arm skipped: no headroom` / `jev arm skipped: underpowered`, per the sibling (proposed) |
| The operator's `labeler` value | `operator` (proposed) |
| `F` on a Deem verdict line | `F=n/a` (proposed) |
| When `report.json` is written | Only when a column ran or an arm stopped; a gate skip writes nothing (proposed) |
