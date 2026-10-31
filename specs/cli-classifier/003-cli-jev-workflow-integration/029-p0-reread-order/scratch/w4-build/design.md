# Build design: score-severity-replay (029-p0-reread-order)

One read-only CommonJS script and its vitest file in the system-deep-loop runtime, the skill docs parent D6 requires, and the proof commands. Every path, line, number and string below was read from this tree on 2026-09-29 unless marked `(proposed)`. The shipped sibling is `deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` with `tests/d4-agreement.vitest.ts`; the gates, keep rule, verdict line and test harness follow it.

## 1. Premises

| Spec citation | State in today's tree |
|---|---|
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:61-63` | ok — severity coverage, advisory `riskScore`, adversarial replay |
| same file `:75` | ok — FAIL = any P0 confirmed after adversarial self-check |
| `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:398-400` | moved: 398-400 -> 399-401 — 398 is the table separator; the P0/P1/P2 description rows are 399-401 |
| `.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts:59` | ok — `authorityPosture: 'legacy-canonical-shadow-only'` |
| same file `:63-72` | ok — `createDeepReviewAdjudicationRequest` |
| `../004-deep-research-expansion/research/lineages/grok/iterations/iteration-004.md:48-66` | ok — the five phrases sit at `:57-61` |
| `../007-classifier-deep-research/research/research.md:422` | ok — R10 stays later, no gold |
| `../001-deep-research/research/research.md:1079` | ok — What Not To Build row 35 |
| `../001-deep-research/research/research.md:1275` | ok — R10's promote line, 20 labeled P0 negatives |
| `../004-deep-research-expansion/research/research.md:101`, `:138`, `:800` | ok — C27, question 7 resolved no, row 50 |
| `../007-classifier-deep-research/context/deem-local.md` 65.6 ms | ok at `:87` (`choice`, 1 client p50 65.6 ms). The label "the 2-option p50" is the packet's fixed phrase: 017's built `score-track-narrowing.mjs:1027`, `:1308`. Keep it |
| Files to create | missing by design: `runtime/scripts/score-severity-replay.cjs`, `runtime/tests/unit/score-severity-replay.vitest.ts`, `runtime/changelog/v1.6.0.0.md`, `feature-catalog/scoring/severity-replay.md`, `manual-testing-playbook/scoring/severity-replay.md` |
| Files to modify | ok: `runtime/scripts/README.md` (row after the `render-command-contract.cjs` row), `SKILL.md` (section 3 Backend paragraph, line 111), `runtime/README.md` (section 3 consumer paragraph), `feature-catalog.md`, `manual-testing-playbook.md`; newest runtime changelog `v1.5.0.1.md` |
| Census preview numbers (412/2,852/95/36/44) | drifted — today 413 registries, 2,855 findings, 96 P0 objects (95 rows after dedupe), 37 P0 registries, 47 transitions into P0 and 0 out, 3,270 iteration files, phrase hits 0,1,1,1,1. Every count is computed at run time, so this is context, not a premise |

## 2. Interface

### 2.1 Script, switches, exit codes

Path `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs`. CommonJS, node standard library only, `main()` behind `require.main === module`, every behavior exported for the tests. `USAGE = 'usage: score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--deem] [--out <dir>]'`.

| Switch | Rule |
|---|---|
| none | Prints the census and the gate state. Spawns only `git`. Writes no file |
| `--write-label-sheet <path>` | One JSON line per P0 row: `registry`, `finding_id`, `title`, `dimension`, `evidence_refs`, `label: ""`. Refuses a resolved path inside the repository root (stderr, exit 2, before the census and before any write). Creates parent directories. Prints `label sheet: <path> rows=<n>` |
| `--labels <file>` | Reads the filled sheet. `label` must be `""` (unlabeled, dropped) or one of `real`, `P1`, `P2`, `not_a_finding`; any other value names the row on stderr and exits 2 |
| `--jev` | Jev arm. Requires `--out` |
| `--deem` | Deem arm. Requires `--out` |
| `--out <dir>` | `report.json`, and `calls.jsonl` once an arm calls. Written only when `--jev` or `--deem` is set |

Exit codes: `0` = report printed (census, stops, skips, verdicts); `2` = bad invocation or unreadable input. `--jev`/`--deem` without `--out` exits 2 on stderr (`--jev needs --out <dir> so every call is recorded`) before any call.

Order in `main(argv, deps)`: strict `parseArgs` (no positionals) -> `--out` refusal -> repo root via `git rev-parse --show-toplevel` (failure prints `not a git repository`, exit 2) -> label-sheet path refusal -> census -> label sheet -> labels, baseline and gate -> `question:`/`margin:`/`keep rule:`/`power:` -> gate line -> Jev then Deem -> `report.json` when an arm switch is set -> 0.

Gates, in this order. Label gate: fewer than 20 rows labeled other than `real` prints `stop: fewer than 20 labeled P0 negatives`; headroom: `10*R > 9*K` (R = rows labeled `real`) prints `no headroom`; else `gate: open K=<k> negatives=<n>`. A closed gate spawns no `jev` and no `cli-deem` and prints `<backend> arm skipped: label gate` (or `no headroom`) for each requested arm. Past the gate, each requested arm runs its own backend gate first.

Jev gate (only with `--jev`): identity line `jev: path=<p> provider=<P>` (P = `JEV_PROVIDER` or `official`), then the sibling's `which()` lookup (`jev arm skipped: jev not on PATH`), `jev --version` equal to `jev 0.6.2` (`jev arm skipped: version` plus `jev: found="<v>" path=<p>`), `jev auth status --provider P` exit 0 (`jev arm skipped: no credential`). One `jev auth test --provider P` opens the arm; the same P goes to every call.

Deem gate (only with `--deem`): `cli-deem health` under `HEALTH_TIMEOUT_MS`, printing `deem: health backend=<b> model=<m> model_commit=<c> source_commit=<s>`; failures print `deem arm skipped: not reachable`, `stub backend`, `model` plus `deem: found="<m>"` or `bad health response` plus a found line. Model must be `deem-0.8-v1`; backend `torch` or `ensemble:*`; `stub` in the backend or in exit-3 stderr is `stub backend`. The script never starts the server. Each skip leaves the census and the other column byte-identical and exits 0.

### 2.2 Keep Rule (per backend column, fixed before any run)

K = labeled rows. M = rows whose three severity calls each returned a submitted key. The modal pick is the key named in at least two of the three orders; three different keys make the row `unstable` (measured, counts wrong, F += 3). The column is right on a row when the modal pick is `P0` and the label is `real`, or the modal pick is `P1`, `P2` or `not_a_finding` and the label is not `real`. A = rows the column gets right among the M rows, B = rows the baseline (recorded severity: every row `real`) gets right, W = negatives only the column gets right, L = real P0s only the baseline gets right, F = the non-modal picks (3 minus the modal count), C = 3M.

Thresholds, in order: 1 coverage `10*M >= 9*K` else `stop (coverage)`; 2 kill `P(X >= L) < 0.05` for X ~ Binomial(W + L, 0.5) else continue; 3 margin `10*(A-B) >= M` else `stop (margin)`; 4 sign test `P(X >= W) < 0.05`, p = 1 when W + L is 0, else `stop (sign test)`; 5 flips `10*F <= C` else `stop (flips)`; 6 `keep`. Tails are exact BigInt sums over 2^(W+L) and the 0.05 test stays `20n * num < den` (sibling).

Verdict line: `verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p=<p>` then `model=<id> model_commit=<sha> source_commit=<sha>` (Deem) or `jev_version=<v> provider=<p> model=<m>` (Jev). `p` is the win tail `P(X >= W)` at `toPrecision(4)`; 019's and 017's built lines both read that way, and the kill tail prints as `p_loss=` on the column line. A later run whose stored `report.json` carries a different pair or model prints `requalify: model commit changed` or `requalify: model changed` first. A stub, fake-server or vitest verdict never counts.

### 2.3 Arms, calls.jsonl, report.json

Both arms run three `choice` calls per row, one per option order (`P0, P1, P2, not_a_finding`; then rotated left by one; then by two), no answer cache, with `-q "<QUESTION_SEVERITY>"` and one `-o KEY=<description>` per option. Jev: `jev choice --provider P -q ... -o ...`; Deem: `cli-deem choice -q ... -o ...`; the row state goes on stdin, closed after writing. The state is the row's `title`, `dimension`, `evidence refs` and `recommendation`, never the finding id.

Each arm prints its notice before its first call. Deem: `deem: nothing leaves the machine; planned calls: <4K>; estimated wall time: <s> s at 65.6 ms per call, the 2-option p50 from deem-local.md`. Jev: `jev: payload: published review registry text; planned calls: <4K + 1>; estimated input tokens: <ceil(chars/4)>`. The 4K counts three severity orders plus one funnel call per row; the +1 is `jev auth test`. Neither prints a dollar figure.

Jev sends a row only when its registry exists at `origin/main` (`git cat-file -e origin/main:<path>`, checked once per registry); other rows are `unmeasured_unpublished` and get no call. Deem runs every row.

Funnel (report-only): after the severity calls, one `noul` per severity-measured row with `-q "<QUESTION_FUNNEL>"`, one call, no rerun because it never decides.

`calls.jsonl`, one line per call: `{backend, call: "severity"|"funnel"|"auth_test", row, order, attempt, wallMs, exitCode, pick, pickProbability, p0Probability, noul, status, ...}` with `row` the first 16 hex of `sha256(registry + '#' + finding_id)` so no finding id reaches a line, `order` null for funnel and auth-test lines, and status `measured`, `unmeasured`, `unmeasured_timeout` or `unmeasured_unpublished`. Deem lines add `modelId`, `modelCommit`, `sourceCommit`; Jev lines add `jevVersion`, `provider`, `model`.

Exit handling. Deem: 1 or HTTP 400 `unmeasured`; 2 stop `deem arm stopped: usage error`; 3 stop `deem arm stopped: backend refused`; 4 one health recheck (`deem arm stopped: model commit changed mid-run` or `deem arm stopped: server gone`), a passing recheck retries once; 130 stop `deem arm stopped: interrupted`; a spawn past `CALL_TIMEOUT_MS` `unmeasured_timeout`. Jev: 1 `unmeasured`; 2 stop `jev arm stopped: usage error`; 3 after the gate stop `jev arm stopped: key rejected`; 4 one `BACKOFF_MS` retry; a spawn past 90 s `unmeasured_timeout`; 130 stop `jev arm stopped: interrupted`. A stopped arm prints `<backend>: partial rows=<n>` and no verdict.

`report.json`: `census`, `labels` (`sha256`, `K`, `real`, `negatives`, `dropped`), `baseline` (`right`, `of`), `gate`, `columns.<backend>` (verdict, reason, line, K, M, A, B, W, L, F, p, pLoss, unmeasured, latency, identity), `stopped.<backend>`, `skipped.<backend>`, `requalify.<backend>`.

### 2.4 stdout lines (exact)

- `registries: <n>`
- `findings: <n> (P0 <a>, P1 <b>, P2 <c>, other <d>)`
- `transitions: <from|none> -> <to|none> <n>` — one per pair, sorted by `from` then `to`
- `p0 rows: <n> in <r> registries (one <o>, two or more <m>)`
- `phrases: <files> review iteration files; "downgraded from P0" <h1>; "from P0 to P1" <h2>; "from P0 to P2" <h3>; "retracted from P0" <h4>; "P0 was retracted" <h5>`
- `labels needed: 20 P0 negatives among <n> P0 rows` — the census ender
- `labels: none` or `labels: sha256=<sha> rows=<n>`; `labeled: <K> (real <r>, P1 <a>, P2 <b>, not_a_finding <c>)`; `labels dropped: <n>`; `baseline: right <r> of <K>`
- `question: <QUESTION_SEVERITY>`; `margin: 0.10`; `keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C`; `power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031`
- gate line: `stop: fewer than 20 labeled P0 negatives` or `no headroom` or `gate: open K=<k> negatives=<n>`
- `label sheet: <path> rows=<n>`
- skips: `jev arm skipped: jev not on PATH` / `version` / `no credential`; `deem arm skipped: not reachable` / `stub backend` / `model` / `bad health response`; `<backend> arm skipped: label gate`; `<backend> arm skipped: no headroom`
- stops: `<backend> arm stopped: usage error|backend refused|key rejected|server gone|model commit changed mid-run|interrupted`; `deem: partial rows=<n>`; `jev: partial rows=<n>`
- `column <backend>: K=<k> measured=<m> unmeasured=<u> p_loss=<p> latency_p50_ms=<n|none> latency_p95_ms=<n|none>`
- `order <backend>: registries=<n> first_real_rank=<x> recorded=<y>` — per registry with two or more labeled rows and at least one `real` row, the rank of its first `real` row when rows sort by the column's mean `P0` probability, against the registry's own order; x and y are means over those registries, one decimal
- `funnel <backend>: asked=<n> measured=<m> yes=<y> no=<z>` — yes at noul >= 0.5
- `exact <backend>: <n> of <m> negatives` — modal pick equals the row's own label
- `requalify: model commit changed` or `requalify: model changed`
- the verdict line of 2.2

### 2.5 Exported functions

`runGit(args, env) -> {status, stdout, stderr}` (the default `deps.git`); `repoRoot(git) -> string`; `listTrackedFiles(git, root) -> string[]`; `loadRegistries(root, files) -> Map<path, registry>` (throws on a malformed file); `p0RowsOf(registries) -> row[]` (deduped by registry + finding id, first occurrence wins, `findingId ?? id`); `rowKey(registry, findingId) -> string`; `censusFindings(registries) -> {registries, findings, bySeverity, transitions, p0Rows, singleP0, multiP0}`; `countPhrases(root, files, phrases) -> {files, hits[]}` over files whose path holds `/review/` and `/iterations/` and whose basename matches `iteration-*.md`; `censusLines(census, phrases) -> string[]`; `buildLabelSheetLines(rows) -> string[]`; `writeLabelSheet(target, lines, root) -> number`; `parseLabels(text) -> Map<rowKey, label>`; `gateLine(K, negatives, realRight) -> {state, line}`; `buildRowState(row) -> string`; `isPublished(git, root, registry) -> boolean`; `binomialTail(successes, trials) -> {num, den, p}`; `modalPick(answers) -> {pick, top}`; `decideVerdict({backend, K, M, A, B, W, L, F}) -> {outcome, reason, p, pLoss}`; `formatP(p) -> string`; `summarizeColumn(backend, rows, answers, baselineRight, suffix) -> column`; `orderLine(backend, rows, answers) -> string|null`; `funnelLine(backend, asked, values) -> string`; `exactLine(backend, rows, answers) -> string`; `nearestRank(values, q) -> number|null`; `spawnCall(file, args, stdinText, env, timeoutMs) -> Promise`; `createCallLog(outDir) -> {append}`; `readStoredReport(outDir) -> object|null`; `buildReport(parts) -> object`; `which(name, env) -> string|null`; `deemCommand(env) -> string[]`; `readDeemHealth(cmd, env) -> {ok, ...}`; `deemGate(ctx)`; `jevGate(ctx)`; `runDeemArm(plan, gate, ctx)`; `runJevArm(plan, gate, ctx)`; `main(argv, deps) -> Promise<number>` with `deps = {out, err, env, timeoutMs, backoffMs, git}` (the sibling's injection pattern; `deps.git` keeps the census and the published check hermetic in vitest).

### 2.6 Constants

`QUESTION_SEVERITY = 'Which severity does this review finding deserve?'`; `QUESTION_FUNNEL = 'Does the cited evidence show the defect this finding claims?'`; `OPTIONS` = P0, P1, P2 with the verbatim `convergence.md:399-401` descriptions plus `not_a_finding = 'The cited evidence does not show a defect'`; `PHRASES` = the five strings of 2.4; `LABEL_GATE = 20`; `ORDERS = 3`; `DEEM_MODEL = 'deem-0.8-v1'`; `DEEM_P50_MS = 65.6`; `JEV_VERSION = 'jev 0.6.2'`; `HEALTH_TIMEOUT_MS = 2000`; `CALL_TIMEOUT_MS = 90000`; `BACKOFF_MS = 2000`; `MARGIN_LINE`, `KEEP_RULE_LINE`, `POWER_LINE` (printed, fixed); `USAGE`.

## 3. Test cases

`runtime/tests/unit/score-severity-replay.vitest.ts`, one `it` per line, stubs only, never a live backend. Fixtures: registries and iteration files in temp dirs; an injected `deps.git` for the tracked list and `cat-file`; `#!/bin/sh` stub `jev` and `cli-deem` first on `PATH`, logging `$*` to `<name>.log`.

- census counts a fixture's P0 rows and transitions | 2 fixture registries holding 2 P0, 1 P1, 1 P2 and transitions none->P0 and P1->P2 | `registries: 2`, `findings: 4 (P0 2, P1 1, P2 1, other 0)`, two `transitions:` lines, `p0 rows: 2 in 2 registries (one 2, two or more 0)`
- phrase counter finds a planted phrase | 2 iteration fixture files, one holding `from P0 to P1` | `phrases: 2 review iteration files;` with hit 1 for that phrase and 0 for the other four
- an unreadable registry exits 2 | a registry file that is not JSON | exit 2, stderr `cannot read registry <path>`
- a duplicate P0 row dedupes by registry and finding id | one registry holding the same findingId twice at P0 | `p0 rows: 1 in 1 registries (one 1, two or more 0)`
- the finding id never enters the row state | P0 row with findingId `P2-001` and title `T` | `buildRowState` holds `T` and not `P2-001`
- the label sheet writes outside the repository | `--write-label-sheet <tmp>/labels.jsonl` | exit 0; one JSON line per P0 row with `registry`, `finding_id`, `title`, `dimension`, `evidence_refs`, `label: ""`; line `label sheet: <path> rows=<n>`
- the label sheet refuses a path inside the repository | `--write-label-sheet specs/tmp-labels.jsonl` | exit 2 and the file does not exist
- the label reader rejects an unknown label | a sheet row with `label: "maybe"` | exit 2, stderr names the row
- the label reader drops an empty label | one `""` row and one `real` row | `labeled: 1 (real 1, P1 0, P2 0, not_a_finding 0)`, `labels dropped: 1`
- the gate stops at 19 negatives | 20 labeled rows, 19 non-real | `stop: fewer than 20 labeled P0 negatives`, exit 0
- the gate passes at 20 negatives | 20 non-real rows, headroom | `gate: open K=20 negatives=20`
- no headroom prints above 90 percent | 30 labeled rows, 28 real | `no headroom`, no arm spawn
- the default run makes zero model calls | stubs on PATH, injected git | exit 0, the census and gate lines print, no stub `.log` exists
- 19 negatives spawn neither backend | `--jev --deem --out <tmp> --labels <19>` | the stop line, `<backend> arm skipped: label gate` for both, both logs empty
- the Jev gate passes a stub | stub `--version` `jev 0.6.2`, `auth status` exit 0, 20 negatives | `jev: path=... provider=official`, `jev: auth test provider=official model=<m>`, then the verdict line
- the Jev gate skips on no credential and a wrong version | stub `auth status` exit 3; stub `--version` `0.2.3` | `jev arm skipped: no credential`; `jev arm skipped: version` plus `jev: found="0.2.3" path=...`
- the Deem gate passes a fake health and skips a stub backend byte-identically | health torch/deem-0.8-v1/m1/s1; then backend `stub` | the health line; `deem arm skipped: stub backend`; the rest of stdout equals the no-arm run
- an unpublished row is withheld from Jev | injected `cat-file` fails for one registry | no Jev call for that row; its lines are `unmeasured_unpublished`
- a Deem exit 4 with a new pair stops the arm | stub exits 4 once and the recheck reports commit m2 | `deem arm stopped: model commit changed mid-run`, `deem: partial rows=<n>`, no verdict line
- the verdict prints keep | every real row picked P0, every negative a non-P0 key, K=30 M=30 A=30 B=20 W=10 L=0 F=0 | `verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0009766 ...`
- the verdict prints kill | 8 real rows picked a non-P0 key | `verdict deem: kill ...`
- the verdict prints stop (coverage) | 4 rows return no value, K=30 M=26 | `verdict deem: stop (coverage) K=30 M=26 ...`
- three different keys make a row unstable and count as wrong | one row answers P0, P1, P2 | A excludes it and F adds 3; `stop (flips)` once the rate passes 0.10
- the funnel asks one noul per measured row and never decides | stub answers noul 0.9 | `funnel deem: asked=<m> measured=<m> yes=<m> no=0` and the verdict line unchanged
- the reread order line prints without moving the verdict | fixture registry with 3 labeled rows and one real | `order deem: registries=1 first_real_rank=<x> recorded=<y>`
- `--jev` without `--out` exits 2 before any call | `--jev` alone | exit 2, stderr `--jev needs --out <dir> so every call is recorded`, no stub log
- a report.json records the gate and the column | `--deem --out <tmp>` at 20 negatives with a healthy stub | `report.json` holds census, labels, baseline, gate and `columns.deem.verdict`

## 4. Build steps

Session-owned before the briefs: record the runtime vitest baseline at HEAD (`.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts`) in `goal.md`'s log. Steps 1-7 are Devin `deepseek-v4-1-flash-max` briefs, one behavior plus its named test cases each, all in `runtime/scripts/score-severity-replay.cjs` and `runtime/tests/unit/score-severity-replay.vitest.ts`. Steps 8-15 are Pi `llmgateway/mimo-v2.6-pro` doc briefs, one doc each.

1. Census core. Constants; `runGit`, `repoRoot`, `listTrackedFiles`, `loadRegistries`, `p0RowsOf`, `rowKey`, `censusFindings`, `countPhrases`, `censusLines`. Tests: census counts, phrase counter, unreadable registry, duplicate row, no id in the state.
2. Label sheet, reader, gate. `buildLabelSheetLines`, `writeLabelSheet`, `parseLabels`, `gateLine`. Tests: sheet outside and inside, unknown label, empty label, gate at 19 and 20, no headroom.
3. Keep rule and column. `binomialTail`, `modalPick`, `decideVerdict`, `formatP`, `summarizeColumn`, `orderLine`, `funnelLine`, `exactLine`, `nearestRank`. Tests: keep, kill, coverage, unstable, flips, sign test, reread order.
4. Deem gate and arm. `which`, `deemCommand`, `readDeemHealth`, `deemGate`, `spawnCall`, `createCallLog`, `readStoredReport`, `runDeemArm` (three severity orders plus the funnel calls). Tests: fake health, stub-backend skip, exit 4 changed pair, funnel counts, report.json.
5. Jev gate and arm. `jevGate`, `isPublished`, `runJevArm` (notice, auth test, orders, exits). Tests: gate pass, no credential, missing and wrong version, unpublished withheld, key rejected.
6. `main` and report. Strict parseArgs, USAGE, the `--out` refusal, the gate ordering with zero spawns when closed, `buildReport`, requalify. Tests: default run zero calls, 19-negative stop, `--jev` without `--out`, 20-negative pass.
7. Suite hardening to the REQ-011 list: confirm at least 22 passed tests, cover the remaining edge, no live backend.
8. `runtime/scripts/README.md` — sk-create-readme, shape from the existing FILES table. Add one row after the `render-command-contract.cjs` row naming the script, its zero-call default, the label gate, both switches and that no severity changes.
9. `SKILL.md` — sk-create-skill. Append one sentence to the section 3 Backend paragraph (line 111) naming the offline severity replay, its zero-call default and that it changes no severity.
10. `runtime/README.md` — sk-create-readme. Append one sentence to the section 3 consumer paragraph: the script, its zero-call default, the label gate, both switches.
11. `runtime/changelog/v1.6.0.0.md` — sk-create-changelog, shape from `runtime/changelog/v1.5.0.1.md` and the compact format of `deep-improvement/changelog/v1.18.0.0.md`; facts: the zero-call census, the label gate, both switches, no severity changes; `> Spec folder: specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order (Level 1)`. Re-read the newest file first (027, 028 and 030 share this folder); the expected number is v1.6.0.0.
12. `runtime/feature-catalog/scoring/severity-replay.md` — sk-create-feature-catalog, shape from `scoring/convergence-score-delta.md`: Group Scoring, Feature ID F056, the script as implementation, the vitest file as validation, the same facts.
13. `feature-catalog.md` index — sk-create-feature-catalog: one `### Severity replay` block under section 6 plus the counts (scoring `2 features` -> `3 features`, `The 54 entries` -> `55`).
14. `runtime/manual-testing-playbook/scoring/severity-replay.md` — sk-create-manual-testing-playbook, shape from `scoring/convergence-score-delta.md`: DLR-056, Group Scoring, the census run, the label-gate stop and a stub-backend skip.
15. `manual-testing-playbook.md` index — sk-create-manual-testing-playbook: one `### DLR-056 | Severity replay` block under section 10 plus the counts (`2 scenarios` -> `3`, `54 deterministic scenarios` -> `55`).

Session-owned after the briefs: the proof runs of section 5, the operator's real label sheet outside the repository, the gated model runs, the Hermes sync (`node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`, then without `--check` when it reports drift) and the trigger-index rebuild (`node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check`) only when stale, the cross-family review (fix P0 and P1, record P2), and one path-scoped commit. Doc steps run one after another.

## 5. Proof plan

| Criterion (goal.md) | Command | Expected |
|---|---|---|
| 1. Default run, zero calls | stub `jev` and `cli-deem` first on `PATH`, then `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | exit 0; `registries:`, `findings:`, `transitions:`, `p0 rows:`, `phrases:`, `labels needed:` all present; no stub `.log` file |
| 2. Sheet, gate, skips | `--write-label-sheet specs/...` (inside) -> exit 2, file absent; `--write-label-sheet "$T/labels.jsonl"` -> exit 0; `--jev --deem --out "$T/out" --labels "$T/19.jsonl"` -> stop line, both logs empty; at 20 negatives with a `stub` health -> `deem arm skipped: stub backend`; with `auth status` exit 3 -> `jev arm skipped: no credential` | each line and exit as stated |
| 3. Suite | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-severity-replay.vitest.ts` | `Test Files 1 passed`, `Tests 22 passed` or more, `0 failed`, exit 0 |
| 4. Closure | `--labels` at 19 -> the stop line (accepted end state); or the operator's 20 or more negatives then one `--deem --out "$T/out"` run | `no headroom` or the stop line, or `verdict deem: ... model=... model_commit=... source_commit=...` with `grep -cE '"row":"[0-9a-f]{16}"' "$T/out/calls.jsonl"` equal to the line count |
| 5. Hygiene | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' <script>`; `git status --porcelain` before and after each run; `git show --stat <commit>` | grep exit 1 with no match; identical status; only system-deep-loop files, generated copies and this phase folder |
| 6. Docs and phase | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <each changed doc>`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order --strict` | each validator exit 0 `VALID`; `RESULT: PASSED` |

## 6. Open questions

1. Empty labels in the operator's file. (proposed) `""` is allowed and dropped; any other unknown value exits 2. The gate counts "rows labeled other than real", and the sheet ships with empty labels.
2. What `p=<p>` holds. (proposed) the win tail `P(X >= W)` at `toPrecision(4)`, as 019's and 017's built lines print; the kill tail prints as `p_loss=` on the column line.
3. F for an unstable row. (proposed) 3, all three picks non-modal, and the row counts wrong.
4. Reread-order aggregation. (proposed) means over registries with two or more labeled rows, at least one `real` row and at least one row carrying a `P0` probability, one decimal; a row without a `P0` probability leaves the sort.
5. Changelog target and version. (proposed) the spec's path `runtime/changelog/v1.6.0.0.md`, not the hub's `changelog/` (newest `v3.0.1.0.md`), because the changed surface is the runtime and the runtime folder's newest is `v1.5.0.1.md`; v1.6.0.0 is a minor bump for a new feature, sk-create-changelog's calculation owns the final number, and the doc step re-reads the newest file because 027, 028 and 030 share the folder.
6. `SKILL.md` version bump. (proposed) none: the changelog lives in the runtime, and bumping the hub without a hub changelog entry would desync `version: 3.0.1.0` from the newest `changelog/v3.0.1.0.md`.
7. `deps.git` test seam. (proposed) an injected runner beside `out`/`err`/`env`/`timeoutMs`/`backoffMs` (the sibling pattern) so the census and the published check stay hermetic; no new CLI switch.
8. Duplicate P0 rows. (proposed) dedupe by registry + finding id, first occurrence wins; today 96 P0 objects reduce to 95 rows, the number the spec preview carries.
9. The `deem-local.md` label. (proposed) keep the packet's fixed phrase "the 2-option p50 from deem-local.md" at 65.6 ms, exactly as 017's built script prints it.
