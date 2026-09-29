# Build design: score-debug-next-check

Phase `031-debug-next-check`, one read-only measurement script, its vitest file and the skill docs. Code follows sk-code's OpenCode route (JavaScript `.mjs`: `references/javascript/style-guide.md`, `quality-standards/overview-modules-and-docs.md`, `security-testing-and-exemptions.md`, `quick-reference.md`, plus the shared tier); docs follow sk-doc's modes (parent D6). Code comments carry no spec path, phase number or requirement id.

## 1. Premises

Every `file:line` the spec cites, checked in today's tree.

| Cited | Checked state | Verdict |
|---|---|---|
| `../context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:10-15` | `NEXT_CHECK_OPTIONS` with the four descriptions, verbatim | ok |
| same file `:41-45` | `next_check_${id}` `choice` question; the `-q` source | ok |
| `.skilled/agents/debug.md:246-276` | Phase 3 HYPOTHESIZE: "Validation Test", ranking criteria; no code line runs | ok |
| `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:79-94` | Phase 3 table, "Test ONE variable at a time" | ok |
| `../007-classifier-deep-research/research/research.md:428` | `| R18, the debug next_check choice | No seam, no reader | Keeps | Stays later |` | ok |
| same file section 12, ranked 20th | `:705` `| 20 | R18 | Debug next_check choice | later | choice | either | not phased |` | ok |
| `../001-deep-research/research/research.md` section 11 | `### R18.` at `:953`; promote line `:1281` | ok |
| `spec.md:70` "`git grep -l next_check -- ':!specs'` prints nothing" | prints `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:27782` (`"debug next_check choice"`, this spec's own trigger phrase; committed by `bf830c3d47`) | drifted |
| Tracked `debug-delegation.md` outside `templates/` | 1 (`specs/cli-external-orchestration/z_archive/021-cli-gemini-deprecation/001-runtime-surface-and-skill-deletion/debug-delegation.md`), no hypothesis heading | ok, `mined rows: 0` |
| Tracked spec files with a `### Hypothesis <n>` heading | 0 | ok |
| Files to change | `runtime/scripts/README.md` (tree `:30-38`, inventory `:46`), `SKILL.md` (version 4.4.0.0, a concurrent edit; compaction row `:571`, alignment row `:572`), `README.md` (compaction `:313-317`, alignment `:319-323`), `feature-catalog/tooling-and-scripts/` + `feature-catalog.md` §2, `manual-testing-playbook/tooling-and-scripts/` + index §7.1 (max id 461) | ok |
| Changelog | newest on disk `v4.4.0.0.md` (untracked, phase 022 in flight); newest tracked `v4.3.0.0.md` | ok |
| Siblings read | `score-compaction-recall.mjs` 1,627 lines, `compaction-recall.vitest.ts` 479, `judge-agreement.mjs` 1,479, `judge-agreement.test.mjs` 920, `score-track-narrowing.mjs` 2,049 | ok |
| Test include | `.skilled/skills/system-spec-kit/vitest.config.ts:36-39` `runtime/tests/**/*.vitest.ts`; `runtime/vitest.config.ts` include `runtime/tests/**/*.{vitest,test}.ts` | ok |

No cited `file:line` is `moved` or `missing`. The one drift is the seam-search command; §2's rule and §6 Q1 answer it.

## 2. Interface

**Script** `S` = `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`. Node ESM, standard library only, `#!/usr/bin/env node`, sections in the shape of `score-compaction-recall.mjs` (constants, seam search, fixture, baselines, gates, arms, keep rule, report, main) and the `isEntryPoint()` guard at `score-compaction-recall.mjs:1617-1623`. Repo root = `resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..')`, as `score-alignment-suggestion.ts:71`.

**Switches** (strict `parseArgs`, no positionals; every refusal writes stderr and exits 2 before any call):

| Switch | Rule |
|---|---|
| `--fixture <file>` | JSON Lines file; must resolve outside the repository (identity check, `score-compaction-recall.mjs:1105-1147`), else `refused: fixture path inside the repository`. Missing/unreadable file exits 2. A bad row exits 2 naming the row id (Q6). |
| `--jev` | Run the Jev arm. Needs `--out`, else stderr `--jev or --deem need --out <dir> so every call is recorded` (Q5), exit 2. |
| `--deem` | Run the Deem arm. Same `--out` rule. |
| `--out <dir>` | Report directory. Every run with `--out` writes `report.json`; an arm adds `calls.jsonl`. Without `--out` no file is written. |

**Exit codes** 0 = census printed (a skipped or stopped arm included); 2 = bad invocation or refused input, before any call. Call exits never set the script's code.

**stdout lines, exact** (order top to bottom):

1. `seam: none`, or one `seam: <path>` line per hit (repo-relative, sorted). Rule: `git -C <root> grep -l next_check -- ':!specs' ':!.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures'` (Q1).
2. `mined: debug_delegation=<n> hypothesis_files=<n>` (Q3), then `mined rows: <n>`; `mined rows: 0` when both sources give no row. Sources: `git ls-files` filtered to `debug-delegation.md` outside `templates/`; `git grep -lE '^### Hypothesis [0-9]' -- specs/`.
3. With `--fixture`: `fixture: rows=<n> sha256=<sha>` and `labels: read_code=<n> run_test=<n> reproduce=<n> instrument=<n>` (Q10).
4. Four `constant <key>: <right>/<K>` lines in the fixed order read_code, run_test, reproduce, instrument; then `baseline: <key> <right>/<K>`. The best count wins; a tie goes to the earlier key in that order, whose first key is `read_code`.
5. `no headroom` when `10 * best > 9 * K`; no arm runs.
6. `stop: fewer than 30 labeled rows` when K < 30; no arm runs, exit 0.
7. `keep rule: coverage 10*M>=9*K, kill P(X>=L)<0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M` (Q9), before any call.
8. Jev gate, in `judge-agreement.mjs:983-1016` order: `jev: path=<path|none> provider=<P>`; `jev arm skipped: jev not on PATH`; `jev arm skipped: version` + `jev: found=<json> path=<path>`; `jev arm skipped: no credential`. P = `JEV_PROVIDER` or `official`.
9. `jev: payload: operator debug notes marked jev_ok; planned calls: <3A+1>; estimated input tokens: <n>` (A = accepted rows; tokens = ceil(chars/4) over the state text, the question and the four option pairs, times 3).
10. `jev: auth test provider=<P> model=<m>` after one `jev auth test --provider P`.
11. `jev arm skipped: payload not accepted` when A = 0.
12. Deem gate (`judge-agreement.mjs:629-706`): `deem: health backend=<b> model=<m> model_commit=<c> source_commit=<c>`; else `deem arm skipped: not reachable|stub backend|model|bad health response`, with `deem: found=<json>` for the last two.
13. `deem: nothing leaves the machine; planned calls: <3K>; estimated wall time: <(3K*65.6/1000).toFixed(1)> s at 65.6 ms per call, the 2-option p50 in deem-local.md`.
14. `column <backend>: rows=<K> measured=<M> unmeasured=<K-M> unstable=<u> latency_p50_ms=<p50> latency_p95_ms=<p95>`, with `withheld=<n>` after `unstable=` on the Jev line (Q9).
15. Stops: `jev arm stopped: usage error|key rejected|interrupted|auth test failed`; `deem arm stopped: usage error|backend refused|interrupted|server gone|model commit changed mid-run`; then `jev: partial rows=<n>` / `deem: partial rows=<n>`. A stopped arm prints no column and no verdict.
16. `requalify: model commit changed` (Deem) / `requalify: model changed` (Jev) before the verdict, when `report.json` in `--out` names another identity (`judge-agreement.mjs:1215-1220`).
17. `verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p=<p> baseline=<key>` + `model=<id> model_commit=<sha> source_commit=<sha>` (Deem) or `jev_version=0.6.2 provider=<p> model=<m>` (Jev). Same line in the column of `report.json`.

**Keep rule**, in this order, exact tails in BigInt (`judge-agreement.mjs:429-439`, `below` = `20*num < den`): 1) `10*M >= 9*K` else `stop (coverage)`; 2) `killP = P(X >= L)`, `X ~ Bin(W+L, 0.5)`, below 0.05 -> `kill`; 3) `10*(A-B) >= M` else `stop (margin)`; 4) `signP = P(X >= W)`, 1 when `W+L = 0`, below 0.05 else `stop (sign test)`; 5) `10*F <= 3*M` else `stop (flips)`; 6) `keep`. `p` on the line is the deciding tail: 1 for coverage, `killP` for kill, else `signP`; formatted `toPrecision(4)` (Q2). A row is measured with three submitted keys; `unstable` is a miss and `F` adds `3 - top`.

**Files written**: `<out>/report.json` (`{ seam, mined, fixtureSha256, labels, constants, baseline, keepRule, columns, skipped, stopped, requalify }`, Q11); `<out>/calls.jsonl`, one line per call: `{ backend, rowId, order, attempt, wallMs, exitCode, pick, pickProb, status }` + `modelId|modelCommit|sourceCommit` (Deem) or `jevVersion|provider|model` (Jev); status `measured|unmeasured|unmeasured_timeout|unmeasured_withheld`; never row text.

**Exported functions**: `seamSearch(root)`; `minedCorpus(root)`; `isInsideRepository(root, candidate)`; `readFixture(file, root)`; `constantAccuracies(rows)`; `chooseBaseline(counts)`; `payloadSplit(rows)`; `which(name, env)`; `deemCommand(env)`; `readDeemHealth(cmd, env)`; `jevGate(ctx)`; `deemGate(ctx)`; `spawnCall(file, args, stdinText, env, timeoutMs)` (`judge-agreement.mjs:742-777`); `createCallLog(outDir)` (`:788-802`); `stateText(row)`; `rotateOptions(pairs, order)`; `parseChoiceAnswer(stdout, keys)`; `runJevArm(plan, gate, ctx)`; `runDeemArm(plan, gate, ctx)`; `binomialTail(k, n)`; `modalPick(picks)`; `summarizeColumn(input)`; `decideVerdict(counts)`; `formatP(p)`; `verdictLine(...)`; `buildReport(...)`; `main(argv, deps)`.

**Calls**: one `choice` per row per order: `jev choice --provider <P> -q "<question>" -o <key>=<desc>` x4 or `cli-deem choice -q "<question>" -o <key>=<desc>` x4 (`score-track-narrowing.mjs:1346-1349`, `:1658-1661`); stdin = `Symptom: <symptom>` / `Hypothesis: <claim>` / `Evidence: <evidence>`; question = `What is the cheapest way to confirm or rule out this hypothesis?`; option pairs verbatim from `hypotheses.ts:11-14`; orders 0, 1, 2 = list order, rotated left by 1, by 2; answer read as `answers.answer.choice` + `probabilities[pick]` (`:1381-1388`). Exits: Jev 1 `unmeasured`, 2/3/130 stop, 4 one retry after `BACKOFF_MS`, timeout `unmeasured_timeout`; Deem 1/400 `unmeasured`, 2/3/130 stop, 4 one health recheck (`server gone` / `model commit changed mid-run`). Jev runs first; no failover.

**Constants**: `LABEL_GATE = 30`; `ORDERS = 3`; `JEV_VERSION = 'jev 0.6.2'`; `DEEM_MODEL = 'deem-0.8-v1'`; `DEEM_P50_MS = 65.6`; `HEALTH_TIMEOUT_MS = 10000` (probe bound; `cli-deem` bounds its own HTTP health request at 2,000 ms, so a health answer lands within 2,000 ms); `CALL_TIMEOUT_MS = 90000` (past it `unmeasured_timeout`); `BACKOFF_MS = 2000`.

## 3. Test cases

`V` = `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts`. One line per case: `name | input | expected`. Every arm case uses stub `jev` and `cli-deem` binaries first on `PATH`, written from a stub table (`judge-agreement.test.mjs:51-102`); no live backend.

| Case | Input | Expected |
|---|---|---|
| default run | no switches, stubs first | exit 0; `seam: none`; `mined rows: 0`; no stub log; no file written |
| `--jev` without `--out` | `--jev --fixture <tmp>` | exit 2; stderr names `--out`; stub logs empty |
| `--deem` without `--out` | `--deem --fixture <tmp>` | exit 2 |
| seam planted | temp git repo, `git add` a file naming next_check | `seamSearch` hits that path |
| seam clean | temp git repo, unrelated tracked file | `seamSearch` hits `[]` |
| mined corpus | real repo root | `{ debugDelegation: 1, hypothesisFiles: 0, rows: 0 }` |
| fixture valid | one-line JSONL, all fields | `{ ok: true }`, row read |
| unknown label | `label: "look"` | exit 2, stderr names the row id |
| fixture inside repo | `--fixture specs/...jsonl` | exit 2, `refused: fixture path inside the repository` |
| gate at 29 | 29 rows, `--jev --deem --out` | `stop: fewer than 30 labeled rows`; exit 0; stub logs empty; no `calls.jsonl` |
| gate at 30 | 30 rows | four `constant` lines, `baseline:` line, no stop line |
| baseline best | run_test right 20/30 | `baseline: run_test 20/30` |
| baseline tie | read_code and reproduce both 18/30 | `baseline: read_code 18/30` |
| no headroom | read_code right 28/30 | `no headroom`; no stub call |
| withheld row | 30 rows, one `jev_ok:false`, `--jev --out` | 3 `unmeasured_withheld` lines for that row; no spawn for it |
| no accepted row | none `jev_ok` | `jev arm skipped: payload not accepted`, exit 0 |
| jev gate pass | stub version `jev 0.6.2`, auth status 0 | `jev: path=...`; `jev: auth test ... model=stub-model` |
| jev gate skip | stub auth status exit 3 | `jev arm skipped: no credential`, exit 0 |
| jev wrong version | `STUB_JEV_VERSION='jev 0.6.1'` | `jev arm skipped: version` + details line |
| deem gate pass | stub health torch pair | `deem: health ...`; notice `planned calls: 90`, `5.9 s` |
| deem stub backend | stub health exit 3 `stub` | `deem arm skipped: stub backend`; census lines byte-identical to a run without the arm |
| deem exit 4 new pair | first choice exit 4; recheck reports a new `model_commit` | `deem arm stopped: model commit changed mid-run`; no verdict; exit 0 |
| no row text | stub run, canary in the fixture | `calls.jsonl` and `report.json` hold no `CANARY-` |
| verdict keep | stub answers strictly better | `verdict deem: keep K=... baseline=read_code model=...` |
| verdict kill | stub answers lose to the baseline | `verdict deem: kill ...` |
| verdict coverage | one order unanswered | `verdict jev: stop (coverage) ...` |
| requalify | prior `report.json` with another pair | `requalify: model commit changed` before the verdict |
| report line | full stub run | `report.json` column line equals the stdout verdict line |
| unstable row | three different picks | `unstable=1`; `F` adds 2 |
| jev K | 30 rows, 12 accepted | Jev verdict `K=12`; Deem verdict `K=30` |

## 4. Build steps

Order: S1-S8 (Devin `deepseek-v4-1-flash-max`, one brief each, by Bash), D1-D6 (Pi `llmgateway/mimo-v2.6-pro`, `high`, one doc each, through sk-doc), C1 (orchestrator). Steps 2-8 each start from the previous step's committed file; every step runs `node --check S` and its named test cases.

**S1 - seam search, mined corpus, CLI skeleton** (`S`, `V`). Functions in file order: `seamSearch`, `minedCorpus`, `parseCliArgs`, `main`, `isEntryPoint`. Prints lines 1-2 of §2 and exits 0. Tests: `default run`, `seam planted`, `seam clean`, `mined corpus`.
**S2 - fixture reader, refusals, label gate** (`S`, `V`). Functions: `isInsideRepository`, `readFixture`, the `--fixture`/`--out` rules. Prints lines 3 and 6. Tests: `--jev without --out`, `--deem without --out`, `fixture valid`, `unknown label`, `fixture inside repo`, `gate at 29`, `gate at 30`.
**S3 - constant baselines, label counts, headroom** (`S`, `V`). Functions: `constantAccuracies`, `chooseBaseline`. Prints lines 3-5. Tests: `baseline best`, `baseline tie`, `no headroom`.
**S4 - payload gate and call log** (`S`, `V`). Functions: `payloadSplit`, `createCallLog`. Withheld rows: 3 `unmeasured_withheld` records each, no spawn (Q4). Tests: `withheld row`, `no accepted row`.
**S5 - Jev gate and arm** (`S`, `V`). Functions: `which`, `jevGate`, `spawnCall`, `stateText`, `rotateOptions`, `parseChoiceAnswer`, `runJevArm`; `CALL_TIMEOUT_MS`, `BACKOFF_MS`, exit handling of §2. Tests: `jev gate pass`, `jev gate skip`, `jev wrong version`, `jev K`.
**S6 - Deem gate and arm** (`S`, `V`). Functions: `deemCommand`, `readDeemHealth`, `deemGate`, `runDeemArm` with the exit-4 recheck; `HEALTH_TIMEOUT_MS`, `DEEM_P50_MS`. Tests: `deem gate pass`, `deem stub backend`, `deem exit 4 new pair`.
**S7 - keep rule, verdict, report** (`S`, `V`). Functions: `binomialTail`, `modalPick`, `summarizeColumn`, `decideVerdict`, `formatP`, `verdictLine`, `buildReport`, requalify. Tests: `verdict keep`, `verdict kill`, `verdict coverage`, `requalify`, `report line`, `unstable row`, `no row text`.
**S8 - coverage close-out** (`V`). Confirm every §3 case exists by name, add any missing, then from `.skilled/skills/system-spec-kit/runtime` run `npx vitest run tests/debug-next-check.vitest.ts`; expect exit 0, >= 22 passed, 0 failed. Record the count in `goal.md`'s log.
**D1 - `SKILL.md`** (sk-create-skill). Model: the compaction row `:571` and alignment row `:572`. One quick-reference row after the newest measurement row: script path, zero-call default, `--jev`/`--deem` behind their own gates, no debug step changes; bump `version:` to the new changelog version.
**D2 - `README.md`** (sk-create-readme). Model: `:313-317` and `:319-323`. One paragraph after the newest measurement paragraph: the script, its zero-call default, the 30-row label gate, the payload gate, both switches, no debug step changes.
**D3 - `runtime/scripts/README.md`** (sk-create-readme). Model: the `compaction-recall/` tree line `:32-33` and inventory row `:46`. One tree line and one inventory row: reads an operator fixture outside the repository, no model call by default, `--jev`/`--deem` add a verdict column behind their gates, writes only under `--out`.
**D4 - `changelog/v4.5.0.0.md`** (sk-create-changelog). Model: `v4.4.0.0.md`. Facts: the script, the seam search and `mined rows: 0`, the gates, the keep rule, the label-gate stop as today's state, the tests, the docs. Version = the next after the newest file present at doc time (Q8).
**D5 - catalog** (sk-create-feature-catalog). Entry `feature-catalog/tooling-and-scripts/debug-next-check.md` + index block in `feature-catalog.md` §2 after the newest measurement block. Model: `tooling-and-scripts/compaction-recall-census.md`. Facts: seam search, fixture and gates, baselines and headroom, both arms, keep rule, the script and its test file, version = D4's.
**D6 - playbook** (sk-create-manual-testing-playbook). Scenario 462, `manual-testing-playbook/tooling-and-scripts/debug-next-check.md` + index row in §7.1 after row 461. Model: `tooling-and-scripts/compaction-recall-census.md` (scenario 460). Facts: the census run with stubs, the label-gate stop, a stub-backend skip, the vitest invocation.
**C1 - generated copies and doc validation** (orchestrator). Run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-spec-kit`, `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check`; regenerate only what reports this skill stale (`--check` dropped; leaf manifest via `ci-skill-root-metadata.cjs --fix`). Run `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on every changed doc; read `VALID` and exit 0.

D1-D6 run after the concurrent phase 022 build commits, because `SKILL.md`, `README.md`, `feature-catalog.md` and `manual-testing-playbook.md` are shared (plan §6); re-read each file before editing.

## 5. Proof plan

One row per criterion in `goal.md`; the label-gate stop line is an accepted end state.

| # | Command | Expected |
|---|---|---|
| 1 | `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` with logging stubs first on `PATH` | exit 0; `seam: none`; `mined rows: 0`; both stub logs absent |
| 2 | `--fixture <inside-repo>`; then `--fixture <29 rows> --jev --deem --out <tmp>`; then a 30-row fixture with no `jev_ok`; then a stub `cli-deem health` reporting `stub` | exit 2; `stop: fewer than 30 labeled rows` with both stub logs empty; `jev arm skipped: payload not accepted`; `deem arm skipped: stub backend` |
| 3 | from `.skilled/skills/system-spec-kit/runtime`: `npx vitest run tests/debug-next-check.vitest.ts` | exit 0; >= 22 passed; 0 failed |
| 4 | the gate stop line recorded in `goal.md`'s log, or one live `--deem --out <dir>` run | `stop: fewer than 30 labeled rows` / `no headroom`, or one `verdict deem:` line with its commit pair and a `calls.jsonl` holding no row text |
| 5 | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' S`; `git status --porcelain` before/after each run; `git diff --stat .skilled/agents/`; `git show --name-only <build commit>` | no match; identical status; empty diff; every path under `system-spec-kit`, a generated copy or this phase folder |
| 6 | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <each changed doc>`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check --strict` | `VALID`, exit 0 on each; `RESULT: PASSED` |

## 6. Open questions

| # | What the spec leaves undecided | Proposed answer |
|---|---|---|
| 1 | REQ-002's seam search vs the generated fixture that now names `next_check` | Exclude `runtime/cli/retrieval/fixtures/` from the grep (it mirrors spec trigger phrases, so counting it makes the search self-referential); the goal criterion's `seam: none` then holds and a planted file outside that folder still flips the line. Amendment wording for the orchestrator. |
| 2 | The single `p=` on the verdict line | The deciding tail: 1 for `stop (coverage)`, the loss tail for `kill`, the sign-test tail otherwise (`score-alignment-suggestion.ts:681-692`); `toPrecision(4)` (`judge-agreement.mjs:479-481`). |
| 3 | The `mined:` counts line | `mined: debug_delegation=<files> hypothesis_files=<spec files>`; rows = hypothesis headings found, 0 today. |
| 4 | `unmeasured_withheld` line shape | Three records per withheld row, one per order, `wallMs: 0`, `exitCode: null`, no spawn; withheld rows never enter the Jev column's K or M. |
| 5 | The `--out` refusal message | `--jev or --deem need --out <dir> so every call is recorded` (`judge-agreement.mjs:1343-1346`). |
| 6 | Fixture errors other than a bad label | Exit 2 naming the row (line number and id): not JSON, missing/extra field, duplicate id, non-boolean `jev_ok`, unreadable file. |
| 7 | The Deem per-call timeout | `CALL_TIMEOUT_MS = 90000`, the Jev value; past it `unmeasured_timeout`. |
| 8 | The changelog version number | The next after the newest file present at doc time; today `v4.4.0.0.md` is on disk (untracked, 022 in flight) so write `v4.5.0.0.md`, and re-list the folder first. |
| 9 | Column and keep-rule stdout lines the spec does not pin | Print the column line in the sibling's shape (`score-track-narrowing.mjs:1008-1013`), with `withheld=<n>` where that line has `abstained`; print the keep rule before any call. |
| 10 | `fixture:`/`labels:` line formats | `fixture: rows=<n> sha256=<sha>`; `labels: read_code=<n> run_test=<n> reproduce=<n> instrument=<n>`. |
| 11 | Where the fixture SHA and the run record live | stdout `sha256=` and `report.json`; the report never holds the fixture path or row text. |
