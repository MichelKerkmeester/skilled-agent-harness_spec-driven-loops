# score-completion-claims.mjs: build design

Read-only build contract. One brief implements one section below and nothing else.
S = `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` (create)
T = `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` (create)
X = `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/` (create)
F = `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` (50 rows, untracked, read-only)
J = `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` (gates, keep rule, verdict line, call log)
C = `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` (script shape)
Node ES module, standard library only, the section-divider and JSDoc layout of C. The sentinel is loaded through
`createRequire(import.meta.url)` and never copied. No code comment names a spec path, phase number or requirement id.
S never reads, stores, logs or passes a key and holds none of `API_KEY`, `TYPESAFE`, `Bearer`, `Authorization`.

## 1. Premises

Each `file:line` the phase docs cite, checked in today's tree. `ok` = text is there as cited.

| Cite | Verdict | What is there |
|---|---|---|
| `completion-evidence-sentinel.cjs:64` | ok | `COMPLETION_CLAIM_PATTERN`, the ten words |
| `:70` | ok | `CLAIM_ANCHOR_TAIL_CHARS = 400` |
| `:113-119` | ok | `detectCompletionClaim` (trim, last 400, pattern test) |
| `:84` | ok | `KILL_SWITCH_ENV` |
| `:60-63` | ok | pattern-mirror comment ("Keep both copies byte-identical") |
| `:553-578` | ok | `module.exports`; `:568` is `detectCompletionClaim`, `:555` the pattern |
| `hooks/claude/completion-evidence-stop.cjs:118-119` | ok | `last_assistant_message` read, then `detectCompletionClaim` |
| `:132-139` | ok | advisory log, then `approve()`; never blocks |
| `.claude/settings.json:172-177` | ok | async Stop entry, `timeout: 10` |
| `001-deep-research/research/research.md:694` | ok | R4's `noul` wording; R4 record at `:689`, open question 9 at `:1140` |
| `007-classifier-deep-research/research/research.md:88` | ok | C4: a Deem `noul` has no rerun clause, stability is the commit pair |
| `007-.../research.md` section 12 | ok | ranking row 8 = R4 `later`; carried table `R3 to R18 and R22` at `:907` |
| `verifier-labeled-set.jsonl` (F) | ok | 50 rows, keys `id` + `raw_text`; `git status --porcelain` prints nothing for it |
| `runtime/scripts/README.md` | ok | tree block `:30-38`, File Inventory `:44-49` |
| `runtime/vitest.config.ts` | ok | include `runtime/tests/**/*.{vitest,test}.ts`, root one level up |
| `runtime/tests/compaction-recall.vitest.ts` | ok | spawn + temp stub binaries + fixtures pattern (`:22-49`) |
| `changelog/` newest | ok | `v4.3.0.0.md` top-level; older files in `v3+/`; next = `v4.4.0.0.md` (proposed, §6) |
| `feature-catalog/tooling-and-scripts/compaction-recall-census.md` | ok | entry model; `feature-catalog.md` block `### Compaction recall census` at `:106` |
| `manual-testing-playbook/tooling-and-scripts/compaction-recall-census.md` | ok | scenario model, ID 460; index row `| 460 |` at `:202`; highest ID is 461 |
| `judge-agreement.mjs` | ok | `:48` `LABEL_GATE`, `:329` `MARGIN_LINE`, `:332` `KEEP_RULE_LINE`, `:335` `POWER_LINE`, `:429` `binomialTail`, `:464` `decideVerdict`, `:542` `verdictLine`, `:593-706` `which`/`deemCommand`/`readDeemHealth`/`deemGate`, `:969-1016` `JEV_VERSION`/`jevGate` |
| `SKILL.md` sentinel mention | missing | no `sentinel`/`completion-evidence` line in SKILL.md (grep, 2026-09-29); the spec's "beside the completion-evidence sentinel's mention" has no anchor — see §6 |
| fixture census count | ok | this leaf re-ran the exported detector on F's 50 `raw_text` values: `rows: 50 fires: 4`, words `deployed=1 fixed=1 completed=1 resolved=1` (counts only) |

## 2. Interface

### Script, switches, exit codes

`node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> [--labels <file>] [--deem] [--jev] [--out <dir>] [--accept-payload]`
(`USAGE` = that string; `node:util` `parseArgs`, strict, no positionals).

| Switch | Type | Rules |
|---|---|---|
| `--rows <file>` | string, required | JSONL, one row per turn with a non-empty string `id` and a string `raw_text`. Missing -> exit 2, stderr `no rows named`; unreadable or not JSON -> exit 2 with the parse error |
| `--labels <file>` | string, optional | JSONL, one row `{ id, claim }`; `id` must be in the rows file and `claim` exactly `yes` or `no`. Any other value or unknown id -> exit 2, stderr `labels row <n>: <reason>`; the file's SHA-256 prints on the `labels:` line |
| `--deem` | boolean | Deem arm |
| `--jev` | boolean | Jev arm |
| `--out <dir>` | string | Required with `--deem` or `--jev`: else exit 2, `--deem needs --out <dir> so every call is recorded` (the `--jev` form when only `--jev`). Must resolve outside the repository root (realpath): else exit 2, `refused: report directory inside the repository` (proposed). Both checks run before any call |
| `--accept-payload` | boolean (proposed name, REQ-008) | Required for the Jev arm's calls; without it `jev arm skipped: payload not accepted`. The Deem arm still runs |

Exit codes: `0` = census printed, skip printed, verdict printed, or a stopped arm printed (proposed: follows J's and 017's shape, whose stops still exit 0 after the report); `2` = the five refusals above. No other code.

### Constants (exported)

`LABEL_GATE = 30`, `CLASS_GATE = 5`, `YES_THRESHOLD = 0.5`, `JEV_RERUNS = 3`, `TAIL_CHARS = 400`,
`MARGIN_LINE = 'margin: 0.10'`,
`KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= M, then sign test p_win < 0.05, then for jev flips 10*F <= 3*M'` (proposed wording, J:332 shape),
`POWER_LINE = 'power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05'` (proposed; J:335 verbatim),
`QUESTION = 'Does this turn end by claiming the work is complete?'` (fixed by REQ-009),
`DEEM_MODEL = 'deem-0.8-v1'`, `DEEM_P50_MS = 60.5` (`noul` p50, `deem-local.md:38`), `JEV_VERSION = 'jev 0.6.2'`,
`HEALTH_TIMEOUT_MS = 10000` (bounds the spawn; cli-deem bounds its own health HTTP at 2,000 ms), `CALL_TIMEOUT_MS = 90000`, `BACKOFF_MS = 2000`.

### stdout lines, in order

Census (always):
```
rows: <n> fires: <n>
words: completed=<n> resolved=<n> fixed=<n> finished=<n> shipped=<n> released=<n> deployed=<n> implemented=<n> occurred=<n> happened=<n>   (pattern order, zeros included) (proposed)
labels: none            |  labels: rows=<n> sha256=<hex>
labeled: <k> (yes <Y>, no <N>)
regex accuracy: <B> of <K> = <0.xxxx>   |  regex accuracy: n/a (no labels)   (proposed)
regex false fires: <n> (by word: <w>=<n> ... | none)   (proposed)
regex missed claims: <n> (by word: ... | none)         (proposed)
margin: 0.10
<keep rule line>
<power line>
<gate line>
```
Gate line, first match: `K < 30` -> `stop: fewer than 30 labeled rows`; `Y < 5` -> `stop: fewer than 5 labeled yes rows`;
`N < 5` -> `stop: fewer than 5 labeled no rows`; `10*B > 9*K` -> `no headroom`; else `planned calls: deem=<K> jev=<3*K+1>`.
Only the last opens the arms. The first two words of each fired row's tail are not printed; the per-word count takes
the first pattern word found in the tail, and no line holds row text (ids, counts and hashes only).

Arms (only behind their switch; a skip leaves every census line byte-identical and appends its own lines):
```
deem: health backend=<b> model=<m> model_commit=<c> source_commit=<c>
deem: nothing leaves the machine; planned calls: <K>; estimated wall time: <(K*60.5/1000).toFixed(1)> s at 60.5 ms per call, the noul p50 from deem-local.md
column deem: rows=<K> measured=<M> unmeasured=<K-M> latency_p50_ms=<n|none> latency_p95_ms=<n|none>   (proposed, J shape)
flips: n/a (commit pair)
<requalify line, when a stored report holds another commit pair>
verdict deem: <keep|kill|stop (<reason>)> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> F=n/a p_win=<p> p_loss=<p> labels_sha256=<hash> model=<id> model_commit=<sha> source_commit=<sha>
```
```
jev: path=<path|none> provider=<P>
jev: auth test provider=<P> model=<model>
jev: payload: the operator's session text, secrets stripped by the operator; planned calls: <3*K+1>; estimated input tokens: <ceil(3*sum(tail+QUESTION)/4)>   (proposed)
column jev: ...
verdict jev: ... F=<F> p_win=<p> p_loss=<p> labels_sha256=<hash> jev_version=0.6.2 provider=<P> model=<model>
```
P = `env.JEV_PROVIDER` or `official`, passed to `auth status`, `auth test` and every judgment. The verdict line is the
spec's format; `formatP` = `p.toPrecision(4)`.

Skip lines (each exits 0): `deem arm skipped: not reachable | stub backend | model | bad health response` (after `model`
and `bad health response` a `deem: found=<JSON>` line follows, J:702-704); `jev arm skipped: jev not on PATH | version |
no credential` (after `version` a `jev: found=<JSON> path=<path>` line, J:1005); `jev arm skipped: payload not accepted`;
`<backend> arm skipped: label gate | no headroom` (proposed; J:1433/1449 print them, 017 prints `no headroom` only).
Stop lines, 017's REQ-008 exit table: Deem `1`/HTTP 400 -> row `unmeasured`, `2` -> `deem arm stopped: usage error`,
`3` -> `deem arm stopped: backend refused`, `4` -> recheck health once (changed pair -> `deem arm stopped: model commit
changed mid-run`, gone -> `deem arm stopped: server gone`, pass -> retry once), `130` -> `deem arm stopped: interrupted`;
Jev `1`, unparseable stdout or a number outside [0,1] -> row `unmeasured`, `2` -> `jev arm stopped: usage error`, `3` ->
`jev arm stopped: key rejected`, `4` -> one backoff retry then `unmeasured`, spawn past 90 s -> `unmeasured_timeout`,
`130` -> `jev arm stopped: interrupted`. A stopped arm prints `<backend>: partial rows=<n>` (proposed) and no verdict.

### Files written

Only with a model switch and `--out`; the default run writes none.
- `<out>/report.json` (proposed shape, J:1269): `{ rowsSha256, labelsSha256, K, census: { rows, fires, words }, regex: { B, falseFires, missedClaims, byWord }, gate, margin, keepRule, columns, stopped, skipped, requalify }`.
- `<out>/calls.jsonl`, one line per spawn (fixed names per the goal): `{ backend, rowId, pass, attempt, wallMs, exitCode, noul, status, modelId, modelCommit, sourceCommit }` (deem) and `{ backend, rowId, pass, attempt, wallMs, exitCode, noul, status, jevVersion, provider, model }` (jev). `status` is `measured | unmeasured | unmeasured_timeout`; `pass` is the rerun index (0 for Deem).

### Exported functions

| Function | Behavior |
|---|---|
| `async main(argv, deps = {})` | Parses, runs the census, prints, runs the requested arms, writes the report; returns the exit code. `deps`: `repoRoot`, `out`, `err`, `env`, `timeoutMs` 90000, `backoffMs` 2000 |
| `parseRows(text)` | JSONL -> rows; `Error('rows row <n>: ...')` on a bad line or missing `id`/`raw_text` |
| `parseLabels(text, rowIds)` | JSONL -> `Map<id, 'yes'|'no'>`; errors `labels row <n>: not JSON`, `...: claim must be yes or no, got <JSON.stringify(v)>`, `...: unknown id <id>` |
| `sha256Hex(value)` | Lowercase hex SHA-256 |
| `detectTail(rawText)` | `rawText.trim().slice(-TAIL_CHARS)`; the one slice both the census and the arms read |
| `runCensus(rows)` | `{ rows, fires, words, firedIds }`; imports `detectCompletionClaim` and `COMPLETION_CLAIM_PATTERN` from the sentinel and never copies the pattern |
| `classCounts(labels)` | `{ yes, no }` |
| `regexErrors(labeled, rowsById)` | `{ B, falseFires, missedClaims, byWord }`; the regex's call is `detectCompletionClaim(raw_text)` on the full text, false fire = fired + labeled `no`, miss = silent + labeled `yes` |
| `gateLine({ k, counts, b })` | `{ line, gate: 'stop'|'no headroom'|'planned' }`, first match wins |
| `binomialTail(k, n)` | Exact one-sided tail in BigInt, J:429; `{ num, den, p, below }`, `below` = `20n * num < den`, `n = 0` -> p 1 |
| `decideVerdict({ backend, K, M, A, B, W, L, F })` | The spec's order: coverage, kill, margin, sign test, flips (jev only); `{ verdict, pWin, pLoss }`, J:464 with the spec's numbers |
| `formatP(p)` | `p.toPrecision(4)` |
| `summarizeColumn({ backend, K, labeled, answers })` | Counts M, A, B, W, L, F over measured rows; the column's call is `yes` at 0.5 or more, the Jev row's call the modal one; `{ backend, K, M, A, B, W, L, F, verdict, pWin, pLoss }` |
| `verdictLine(summary, labelsSha, suffix)` | The one line above; suffix appended when non-empty |
| `which(name, env)`, `deemCommand(env)` | J:593-619; repo fallback `path.resolve(__dirname, '../../../..', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs')` |
| `readDeemHealth(cmd, env)`, `deemGate(ctx)` | J:629-706, the four reasons and their lines |
| `jevGate(ctx)` | J:983-1016: identity line, `which('jev')`, `--version` exactly `jev 0.6.2`, `auth status --provider P` exit 0 |
| `spawnCall(cmd, args, stdin, env, timeoutMs)` | Async spawn, stdin written then closed, `{ code, stdout, stderr, wallMs, timedOut }` (017:1190-1250 shape) |
| `createCallLog(outDir)` | `{ append(record) }`, one JSON line per call |
| `readStoredReport(outDir)` | Parsed `<out>/report.json`, else null |
| `nearestRank(values, q)` | J:715, for the `column` line |
| `runDeemArm(plan, gate, ctx)` / `runJevArm(plan, gate, ctx)` | One arm each: the printed lines above, the exit table, the call log, the column line, `flips: n/a (commit pair)` / the flip count, the requalify check, the verdict line |

`runCensus` and the arms read the row text; only ids, counts and hashes leave them. The Jev arm's answer parse is
`JSON.parse(stdout).answers.answer.noul` (002's `score-jev-tiebreak.mjs:982`); the Deem arm's is `JSON.parse(stdout).noul`.

## 3. Test cases

T spawns S with `spawnSync(process.execPath, [S, ...args])`, a temp stub dir first on `PATH` (C:22-32) and
`STUB_ANSWERS`, `STUB_HEALTH`, `STUB_JEV_VERSION`, `STUB_AUTH_STATUS_EXIT` in `env` (J's test double). Stubs log one
line per call; no test reaches a live backend. Cases, one line each:

```
census happy | X rows: claims inside and outside the tail, one per pattern word | exit 0; rows:/fires: match the file; words: line counts the first word per fired row; stop: fewer than 30 labeled rows
census edge | a row with "fixed" 500 characters before its end | that row does not fire
per-word split happy | one fired row per word | each word's count is 1
per-word split edge | a tail holding "fixed" then "completed" | counted under fixed only
labels happy | 30 labels, 15 yes / 15 no | labels: sha256 line, labeled: 30, planned calls: deem=30 jev=91
labels edge (unknown id) | a label id not in the rows file | exit 2; stderr names the row; no call
labels edge (bad value) | claim "maybe" | exit 2; stderr names the row
class gate edge | 30 labels with 4 no | stop: fewer than 5 labeled no rows; stubs log nothing
headroom edge | labels the regex is right on 28 of 30 | no headroom; stubs log nothing
default run | no switch, stubs first on PATH | stubs log nothing; no 40-char slice of any fixture row's text on stdout
deem gate happy | STUB_HEALTH torch, deem-0.8-v1, commit pair | deem: health line; arm runs on stub answers
deem gate edge | STUB_HEALTH stub (exit 3, stderr names stub) | deem arm skipped: stub backend; census lines byte-identical; exit 0
jev gate happy | STUB_JEV_VERSION jev 0.6.2, STUB_AUTH_STATUS_EXIT 0, --accept-payload | jev: path= line; arm runs
jev gate edge | STUB_AUTH_STATUS_EXIT 3 | jev arm skipped: no credential; exit 0
payload gate edge | --jev --deem without --accept-payload, both stubs | jev arm skipped: payload not accepted; deem arm still runs
out missing | --deem without --out | exit 2 before any call; stub log empty
out inside repo | --deem --out <repo>/tmp-x | exit 2 before any call; stub log empty
verdict keep | 30 measured rows, stub answers A=30, B=25 (W=5, L=0) | verdict deem: keep ... p_win=0.03125
verdict kill | A=25, B=30 (W=0, L=5) | verdict deem: kill
verdict stop (margin) | A=27, B=25 | verdict deem: stop (margin)
verdict stop (coverage) | 26 of 30 rows measured | verdict deem: stop (coverage)
verdict Jev stop (flips) | 3 reruns that flip 2-1 on every row, A=30, B=25 | verdict jev: stop (flips); F=30
```

22 cases; REQ-012 needs at least 16.

## 4. Build steps

### Code steps (Devin), in order

1. **Skeleton + census.** S: header, imports (`node:fs`, `node:path`, `node:url`, `node:util`, `node:crypto`, `node:child_process`, `createRequire`), constants, `USAGE`, `parseRows`, `detectTail`, `runCensus`, `main` with `--rows` parse, exit 2s for a parse error and no `--rows`, and the `rows:`/`words:` lines. T: `census happy`, `census edge`. No spawn yet.
2. **No-text guarantee.** S: every printed value passes a small allowlist check (ids, counts, hashes only; C's guard shape) before any line or file. T: `default run`.
3. **Labels, gate, zero-call output.** S: `parseLabels`, `sha256Hex`, `classCounts`, `regexErrors`, `gateLine`, `MARGIN_LINE`/`KEEP_RULE_LINE`/`POWER_LINE` and the `labels:`/`labeled:`/`regex *`/`margin:`/`keep rule:`/`power:`/gate lines. T: `labels happy`, `labels edge (unknown id)`, `labels edge (bad value)`, `class gate edge`, `headroom edge`.
4. **`--out` refusals and the call log.** S: realpath check against the repo root, the `--out`-with-switch rule, `createCallLog`, `readStoredReport`. T: `out missing`, `out inside repo`.
5. **Deem gate.** S: `which`, `deemCommand`, `readDeemHealth`, `deemGate`, ported from J:593-706, and the `--deem` block in `main` (health first, then the gate line, then the arm). T: `deem gate happy`, `deem gate edge`.
6. **Deem arm.** S: `spawnCall`, `runDeemArm` — the "nothing leaves the machine" line, `cli-deem noul -q <QUESTION>` once per labeled row with `detectTail` on stdin closed, 0.5 threshold, the exit table, `calls.jsonl` with the commit pair, `column deem:` + `flips: n/a (commit pair)`. T: `verdict keep`, `verdict kill`, `verdict stop (margin)`, `verdict stop (coverage)`.
7. **Jev gate, payload gate and Jev arm.** S: `jevGate` (J:983-1016), the payload class and token line, `--accept-payload`, `jev auth test --provider P`, three `noul` calls per row with no answer cache, the modal call, `F`, the exit table, `calls.jsonl` with version/provider/model, `runJevArm`. T: `jev gate happy`, `jev gate edge`, `payload gate edge`, `verdict Jev stop (flips)`.
8. **Verdict, requalify and report.** S: `binomialTail`, `formatP`, `summarizeColumn`, `decideVerdict`, `verdictLine`, `nearestRank`, the requalify lines (`requalify: model commit changed` / `requalify: model changed`, J:949/1218) and `report.json`. T: all verdict cases rerun end-to-end, plus a stored-report requalify case. Also `per-word split happy`, `per-word split edge` land here if not already green.

Every step keeps the sentinel, both Stop adapters, `.claude/settings.json`, 003's fixture and 003's scorer byte-identical.

### Doc steps (Pi), one doc each

1. `runtime/scripts/README.md` — mode `sk-create-readme`. MODEL: its own tree block `:30-38` and File Inventory `:44-49`. Facts: a `completion-claim-audit/score-completion-claims.mjs` tree line and inventory row; zero-call default; `--deem`/`--jev` behind each backend's own check; `--accept-payload` for Jev; `--out` outside the repository.
2. `.skilled/skills/system-spec-kit/SKILL.md` — mode `sk-create-skill`. MODEL: the one-sentence `score-track-narrowing.mjs` paragraph at `:468`, or the Quick Reference Commands table `:559-577`. Facts: one sentence naming the offline completion-claim audit, its zero-call default and its two switches. The spec's anchor ("beside the completion-evidence sentinel's mention") is absent — §6.
3. `.skilled/skills/system-spec-kit/README.md` — mode `sk-create-readme`. MODEL: the `score-compaction-recall.mjs` paragraph `:313-317`. Facts: one line naming the script, the zero-call default, `--deem`/`--jev` and `--accept-payload`; nothing called, nothing changed.
4. `.skilled/skills/system-spec-kit/changelog/v4.4.0.0.md` — mode `sk-create-changelog`. MODEL: `changelog/v4.3.0.0.md`. Facts: the new script; the census with zero calls; the label gate; the two switches; no verdict is claimed unless a run printed one.
5. `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md` + a `### Completion claim audit` block after `### Compaction recall census` (`feature-catalog.md:106`) — mode `sk-create-feature-catalog`. MODEL: `compaction-recall-census.md` and its `feature-catalog.md` block. Facts: S, T, X, the census, the arms, the tests; `version: 4.4.0.0`.
6. `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md` (ID 462, proposed) + an index row after `| 461 |` (`manual-testing-playbook.md:203`) — mode `sk-create-manual-testing-playbook`. MODEL: `compaction-recall-census.md` (ID 460). Facts: the census command on synthetic rows with stubs on `PATH`, the stub-backend skip, `git status` unchanged, the suite.

Docs claim only what the runs printed. `validate_document.py` runs on each changed doc.

## 5. Proof plan

Paths relative to `.skilled/skills/system-spec-kit/runtime`; F is phase 003's fixture; stub dir first on `PATH`.

| Goal criterion | Command | Expected |
|---|---|---|
| 1 | `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <F>` | exit 0; stdout holds `rows: 50 fires: 4` and `stop: fewer than 30 labeled rows`; both stub logs absent/empty |
| 2 | `node ... --rows <F> --deem --out <tmp>` with a stub `cli-deem health` reporting backend `stub`; then `node ... --rows <F> --jev --out <tmp>` with stubs and no `--accept-payload` | `deem arm skipped: stub backend` and `jev arm skipped: payload not accepted`; each exit 0; the census prefix byte-identical to criterion 1's |
| 3 | `npx vitest run tests/completion-claim-audit.vitest.ts` | exit 0; `Tests  22 passed` (>= 16), 0 failed |
| 4 | `git status --porcelain` before/after; then either the criterion-1 `stop:` line stands (label gate, accepted end state), or one live `--deem --out <dir>` run | `verdict deem:` line printed; every `calls.jsonl` line holds `wallMs`, `exitCode`, `modelId`, `modelCommit`, `sourceCommit` |
| 5 | `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' scripts/completion-claim-audit/score-completion-claims.mjs`; a 40-char slice of a fixture row searched in each run's stdout; `git status --porcelain` before/after each run | grep prints nothing (exit 1); no slice found; the two statuses match |
| 6 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit --strict` | `RESULT: PASSED` |

Criterion 4's accepted end state is the label gate: the census printed its `stop:` line, no arm ran and no verdict exists.

## 6. Open questions

| Question | Answer (proposed) |
|---|---|
| The spec says SKILL.md gets "one sentence beside the completion-evidence sentinel's mention"; SKILL.md has no such mention (grep, 2026-09-29) | Put the sentence beside the completion-claim text in §3 "Validation and Recovery" (`:483`) or as a Quick Reference Commands row beside `:571`; the doc step picks one and says so |
| `words:` line shape | All ten words, pattern order, zeros included; fired-only words would hide the ten-word basis |
| `regex accuracy` / false fire / missed claim line wording | As in §2; with no labels the accuracy line reads `n/a (no labels)` |
| `--labels` switch name | `--labels <file>`, J's name |
| `label gate` / `no headroom` arm skip lines | Print them (J:1433/1449); the spec's four Deem and three Jev skips are the check ones |
| Exit code for a mid-run stop | 0, after the stop line and `<backend>: partial rows=<n>`; 017's stops exit 0 |
| Changelog version | `v4.4.0.0.md` (minor: a new script); the authoring mode recomputes it from the folder at build time |
| Playbook ID | 462, after 461 |
| `report.json` shape | §2's; J's shape with the census and regex blocks added |
| `column` and `partial rows=` lines | Keep both, J/017 shapes; they carry M and the stop's finished count the verdict line needs |
