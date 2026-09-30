# score-stop-rater.cjs: build design

Read-only build contract. One brief implements one section below and nothing else.
S = `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` (create)
V = `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` (create)
R = `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` (shipped sibling: gates, keep rule, verdict line, call log, tests; its test `scripts/model-benchmark/tests/d4-agreement.vitest.ts` is V's harness model)
Node CommonJS, standard library only, `'use strict'`, the box header and numbered section dividers of R. Exported pure functions plus `main(argv, deps)` behind `require.main === module`, the shape of `runtime/scripts/fanout-merge.cjs:1404-1420`. No code comment names a spec path, phase number or requirement id. S never reads, stores, logs or passes a key and holds none of `API_KEY`, `TYPESAFE`, `Bearer`, `Authorization`.

## 1. Premises

Each `file:line` the phase docs cite, checked in today's tree. `ok` = text is there as cited.

| Cite | Verdict | What is there |
|---|---|---|
| `.skilled/commands/deep/assets/deep-research-confirm.yaml:637-661` | ok | `step_check_convergence`; the vote at `:648-661`, weights 0.30/0.35/0.35, `Redistribute weights` `:659`, bar `> 0.60` `:660`; threshold default 0.05 at `:32` |
| `deep-research/references/convergence/convergence-signals.md:41-47` | ok | the three weighted signals, weights and requirements |
| `convergence-signals.md:55-73`, `:59-63` | ok | the five rubric rows the `-l` levels copy, verbatim |
| `deep-research/scripts/reduce-state.cjs:950-990`, `:965-989` | ok | `buildTrendFlatlineAdvisories` and the `novelty_signal_inert` branch; window default 3 (`:28`), `resolveTrendFlatlineWindow` `:902` |
| `runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19` | ok | `authority: 'legacy-convergence'`; STOP stays legacy |
| `runtime/scripts/convergence.cjs:480-486` | ok | `decisionReason`; `:506-549` `buildNoveltyCorroboration`; `:618-631` `applyNoveltyCorroborationGuard`; `:805-808` the guard call |
| `runtime/scripts/fanout-merge.cjs:1404-1420` | ok | `module.exports`, then `require.main === module` |
| `runtime/vitest.config.ts:17` | ok | `include: ['tests/**/*.{vitest,test}.ts']`, `fileParallelism: false` |
| `007-classifier-deep-research/research/research.md:420` | ok | R8 "No gold confirmed" stays `later`; section 12 row 12 = `later`, `score`, Deem for archived evidence |
| `001-deep-research/research/research.md:1273`, `:1139` | ok | R8's promote line; open question 8 (`kq-gold-sanity`) |
| `deep-research/references/state/state-jsonl.md:89-135`, `:181-197`, `:220-233` | ok | iteration record (`iteration`; `run` legacy) and status values; `graph_convergence` events carry `run` and `decision`; blocked-stop event |
| `007-classifier-deep-research/context/deem-local.md:87`, `:37` | ok | `choice`, 1 client: p50 65.6 ms (the spec's label); `score` (3 levels) p50 60.2 ms |
| `cli-classifier/cli-deem/scripts/cli-deem.mjs:471-480`, `:560-583`, `:388-400` | ok | `score` sends `{type,instructions,levels}`; the translation returns `score` (level index) and index-keyed `probabilities`; state reads stdin when `-s` is omitted |
| `sk-communication/benchmark/reply-harness/judge-agreement.mjs:812-822`, `:900`, `:1170` | ok | `parseScoreAnswer` (finite, rounded, in range); the two `score` call shapes with repeated `-l` |
| `002-advisor-jev-tiebreak-arm/goal.md` D2, `implementation-summary.md:154` | ok | P = `JEV_PROVIDER` else `official`, passed to every judgment; the three gate checks and skip lines |
| corpus re-count (this leaf, 2026-09-29) | ok | 486 tracked state files; 449 with a config (37 without); 167 without `deltas/`; lenient movable rule 207, 116 with deltas (planning said 449/203/115) |
| `runtime/scripts/README.md:34-55` | ok | FILES table; the new row sits between `render-command-contract.cjs` and `status.cjs` |
| `runtime/README.md:48` | ok | the public-surface paragraph the one line extends |
| `.skilled/skills/system-deep-loop/SKILL.md:33`, `:111` | ok | the runtime sentences; hub version authority tracks the hub's own `changelog/`, untouched |
| `feature-catalog.md:19`, `:27`, `:392-425` | ok | `54 entries`; scoring row `2 features`; section 6 with `### Convergence score-delta` `:412` |
| `manual-testing-playbook.md:39`, `:106`, `:391`, `:408-419`, `:952` | ok | `54 deterministic scenarios`; release count; scoring `2 scenarios`; DLR-040 block; last coverage-map row |
| `runtime/changelog/` newest | ok | `v1.5.0.1.md`; next = `v1.6.0.0.md` (proposed, §6) |
| `runtime/scripts/score-stop-rater.cjs`, `runtime/tests/unit/score-stop-rater.vitest.ts` | missing | to be created |

## 2. Interface

### Script, switches, exit codes

`node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs [--jev] [--deem] [--out <dir>] [--gold-reads <file>]`
(`USAGE` = that string; `node:util` `parseArgs`, strict, no positionals).

| Switch | Type | Rules |
|---|---|---|
| `--jev` | boolean | Jev column; dormant unless the Jev gate passes |
| `--deem` | boolean | Deem column; dormant unless the Deem gate passes |
| `--out <dir>` | string | Required with `--jev` or `--deem`: else exit 2, stderr `--deem needs --out <dir> so every call is recorded` (the `--jev` form when only `--jev`). Optional without a switch; then it writes only `report.json` |
| `--gold-reads <file>` | string | The operator's JSONL: one row `{lineage, gold_iteration, labeler}`; `lineage` = the repo-relative lineage directory the census printed, `gold_iteration` a positive integer, `labeler` a non-empty string. A bad row or a repeated lineage -> exit 2, stderr `gold reads row <n>: <reason>`. Read and parsed whenever given; its stop lines print only with a switch |

Exit codes: `0` = census printed, skip printed, gate stop printed, verdict printed or a stopped arm printed; `2` = parse error, the `--out` refusal, an unreadable reads file, or an unreadable lineage input (message on stderr, nothing on stdout). No other code. A stopped arm still exits 0 after its stop and partial lines.

### Constants (exported)

`SAMPLE_MAX = 25`, `LABEL_GATE = 5`, `INERT_WINDOW = 3`, `STATE_MAX_CHARS = 24000`,
`LEVEL_LABELS = ['0.0 No new information', '0.2 Mostly confirmation or marginal novelty', '0.5 Mixed new and repeated material', '0.7 Several new findings plus some refinements', '1.0 Mostly new findings or first broad pass']` (the five rows of `convergence-signals.md:59-63`, backticks dropped, lowest first),
`LEVEL_RATIOS = [0.0, 0.2, 0.5, 0.7, 1.0]` (paired with the labels; a test asserts the pairing),
`QUESTION = 'How much new information did this iteration add to the research so far?'` (fixed by REQ-008),
`DEFAULT_CONVERGENCE_THRESHOLD = 0.05` (the YAML default), `DEFAULT_MIN_ITERATIONS = 3`,
`MARGIN_LINE = 'margin: 0.10'`,
`KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)'` (proposed wording, R:34 shape),
`POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 = 0.03125 < 0.05'` (proposed, R:36 wording),
`DEEM_MODEL = 'deem-0.8-v1'`, `DEEM_P50_MS = 65.6` (`deem-local.md:87`), `JEV_VERSION = 'jev 0.6.2'`,
`HEALTH_TIMEOUT_MS = 2000`, `CALL_TIMEOUT_MS = 90000`, `BACKOFF_MS = 2000`.

### stdout lines, in order

Census (always; `t = c + f + d + k`):
```
lineages: tracked <t> no config <c> forced <f> no deltas <d> kept <k> no gold <n> sampled <s> inert <i>   (proposed shape)
gold: derived on <g> of <s> sampled
reads: <p1> g=<g1> | <p2> g=<g2> | <p3> g=<g3> | <p4> g=<g4> | <p5> g=<g5>   (the first five sampled; fewer when sampled < 5)   (proposed shape)
method recorded: right <a> of <s>
method legacy: right <b> of <s>
method sources: right <c> of <s>
baseline: <recorded|legacy|sources> right <r> of <s>
question counts: <q> of <s> sampled lineages carry key/answered counts   (proposed; the risk table's missing-counts line)
margin: 0.10
<keep rule line>
<power line>
<gate line>
```
Gate line, first match: `10*r > 9*s` -> `no headroom`; else `planned calls: deem <n> jev <3n+1>`, where n = every iteration of the sampled lineages.

Label gate (only with a switch, before any backend check; each stop exits 0, runs no arm, writes the report when `--out` is given):
`stop: fewer than 5 confirmed lineages` | `stop: derived gold disagrees on <k> of 5 lineages`.

Arms (each behind its switch and a passing gate; the census prefix stays byte-identical):
```
jev: path=<path|none> provider=<P>
jev: payload: published research delta text; planned calls: <3n+1>; estimated input tokens: <ceil(chars/4)>   (proposed shape)
jev: auth test provider=<P> model=<model>
verdict jev: ... jev_version=<v> provider=<P> model=<m>
```
```
deem: health backend=<b> model=<m> model_commit=<mc> source_commit=<sc>
deem: nothing leaves the machine; planned calls: <n>; estimated wall time: <(n*65.6/1000).toFixed(1)> s at 65.6 ms per call, the 2-option p50 from deem-local.md
verdict deem: ... model=<id> model_commit=<mc> source_commit=<sc>
```
`no headroom` with a switch prints `<backend> arm skipped: no headroom` after the gate passes. Requalify lines print before a verdict: `requalify: model commit changed` (Deem pair differs) | `requalify: model changed` (Jev provider or model differs), read from `<out>/report.json` of an earlier run.
Skip lines (each exits 0): `jev arm skipped: jev not on PATH`; `jev arm skipped: version` then `jev: found="<found>" path=<path>`; `jev arm skipped: no credential`; `deem arm skipped: not reachable`; `deem arm skipped: stub backend`; `deem arm skipped: model` then `deem: found=<JSON>`; `deem arm skipped: bad health response` then `deem: found=<JSON>`.
Stop lines (exit 0, no verdict, then `<backend>: partial lineages=<n>`): Deem `2` usage error, `3` `deem arm stopped: backend refused`, `4` recheck once (`deem arm stopped: model commit changed mid-run` | `deem arm stopped: server gone`; a passing recheck retries once), `130` `deem arm stopped: interrupted`. Jev `2` usage error, `3` `jev arm stopped: key rejected`, `4` one backoff retry, spawn past 90 s `unmeasured_timeout`, `130` `jev arm stopped: interrupted`.

The verdict line (spec format; `formatP` = `p.toPrecision(4)`; counts integers, tails exact):
`verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p=<p> baseline=<method>` + ` model=<id> model_commit=<sha> source_commit=<sha>` (Deem) or ` jev_version=0.6.2 provider=<p> model=<m>` (Jev). `p` = `p_loss` on a kill line, else `p_win` (proposed). The rule order is REQ-004's: coverage, kill, margin, sign test, flips (Jev only), keep — `binomialTail`/`decideVerdict` follow R:275-304, with this spec's `10*F <= C` flips bound and a `C` count of measured calls.

### Files written

Only when `--out` names a directory; a run without it writes nothing.
- `<out>/report.json` (proposed shape): `{ question, generated, census: { tracked, noConfig, forced, noDeltas, kept, noGold, sampled, inert }, lineages: [ { path, gold, lastIteration, stops: { recorded, legacy, sources, deem, jev } } ], baseline: { method, right }, gate: { label, headroom }, columns: { deem, jev }, stopped: {}, skipped: {}, requalify: {} }`. Phase 028 reads this.
- `<out>/calls.jsonl`, created on the first append, one line per spawn or withheld iteration: `{ lineage, iteration, rerun, attempt, wallMs, exitCode, backend, level, probability, status }`, plus `modelId, modelCommit, sourceCommit` (Deem) or `jevVersion, provider, model` (Jev). `status` is `measured | unmeasured | unmeasured_timeout | unmeasured_oversize | unmeasured_unpublished`; `level` is the 0-based position and `probability` is `probabilities[String(position)] ?? probabilities[label] ?? null` (proposed).

### Exported functions

| Function | Behavior |
|---|---|
| `async main(argv, deps = {})` | Parses, walks, prints the census, checks the label gate, runs the requested arms, writes the report; returns the exit code. `deps`: `out`, `err`, `env` (default `process.env`), `repoRoot` (default `process.cwd()`), `timeoutMs` 90000, `backoffMs` 2000 |
| `listStateFiles(repoRoot)` | `git ls-files -z -- '*deep-research-state.jsonl'` under `repoRoot`; a git failure throws |
| `readConfig(lineageDir)` | `deep-research-config.json` parsed, else null |
| `isMovable(config)` | Forced only by an explicit blocker: `stopPolicy` (top level or under `antiConvergence`) `=== 'max-iterations'`, or `convergenceMode === 'off'`, or both `minIterations` and `maxIterations` integers with `min >= max`; otherwise movable (reproduces the census's 207/116) |
| `deltaIterationFiles(lineageDir)` | `deltas/*.jsonl` matching `^(iter|iteration)-(\d+)\.jsonl$`, sorted by iteration |
| `deriveGold(files)` | Reads each file's `type: finding` records; a source is its `source` string. Returns `{ gold, cited: Map<n, count>, firstAppearance: Map<n, count> }`; `gold` = the last iteration with a first-appearance source, else null |
| `readStateRecords(stateFile)` | `{ iterations: [ { n, status, ratio, keyQuestions, answeredQuestions } ] }` (`iteration` else legacy `run`; ratios finite or null) and `blocked` = the `run` values of `graph_convergence` events with `decision: 'STOP_BLOCKED'` |
| `replayVote(series, opts)` | The `deep-research-confirm.yaml:648-661` vote over evidence iterations (`status !== 'thought'`), fed `series` = `[{ n, ratio }]`: rolling mean of the last 3 below `threshold` (w 0.30, needs 3), MAD floor (`MAD * 1.4826`, w 0.35, needs 4), coverage at least 0.85 (w 0.35, when counts exist); weights redistributed over available signals; `weighted > 0.60` nominates STOP. Never before `minIterations`; a `blocked` iteration is skipped. Returns the first STOP iteration or null |
| `stopFor(series, ctx)` | `replayVote(...) ?? lastIteration` |
| `coverageSeries(iterations)` | Per evidence iteration: distinct `answeredQuestions` / distinct `keyQuestions` through it, `null` when no question was asked |
| `rightOf(stop, gold)` | `gold <= stop && stop <= gold + 1` |
| `pickBaseline(counts)` | `{ method, right }`; most right, ties in the order `legacy`, `sources`, `recorded` |
| `gateLine(census)` | `no headroom` or `planned calls: deem <n> jev <3n+1>` |
| `parseGoldReads(text)` | JSONL -> `Map<lineage, goldIteration>`; errors `gold reads row <n>: ...` |
| `labelGate({ sampled, reads })` | `{ passed, line }` with REQ-006's two stop lines |
| `buildState(iterationFiles, iteration)` | The iteration's finding labels and sources, then every earlier finding's label, as plain lines (proposed: `<label> — <source>` then `<label>`); the caller withholds a state over `STATE_MAX_CHARS` |
| `which(name, env)`, `deemCommand(env)` | R:387-413, repo fallback `cli-deem.mjs` under `cli-classifier` |
| `readDeemHealth(cmd, env)`, `deemGate(ctx)` | R:423-500; `ok`, `torch` or `ensemble:` backend, no `stub`, model `deem-0.8-v1`, both commits non-empty |
| `jevGate(ctx)` | R:546-590 shape: identity line, path, `--version` exactly `jev 0.6.2`, `auth status --provider P` exit 0. P = `env.JEV_PROVIDER` else `official` |
| `existsAtOriginMain(repoRoot, relPath)` | `git cat-file -e origin/main:<relPath>` exit 0. A lineage is published only when every delta file passes |
| `spawnCall(file, args, stdinText, env, timeoutMs)` | R:630-665, stdin written then closed |
| `createCallLog(outDir)`, `readStoredReport(outDir)` | R:676-706 |
| `runJevArm(plan, gate, ctx)` | Published checks first, the payload notice, one `jev auth test`, then 3 `jev score --provider P -q <QUESTION> -l <level> x5` per iteration with no answer cache; the median ratio; F counts the dissenters; exits per the table |
| `runDeemArm(plan, gate, ctx)` | The notice, then one `cli-deem score -q <QUESTION> -l <level> x5` per iteration; exits per the table; F is `n/a` |
| `binomialTail(successes, trials)`, `formatP(p)`, `decideVerdict(counts)`, `summarizeColumn(...)`, `verdictLine(summary, suffix)` | R:275-363 with REQ-004's thresholds |
| `buildReport(parts)`, `writeReport(outDir, report)` | §Files written |

## 3. Test cases

V requires S with `createRequire(import.meta.url)` for the pure functions and spawns `node S` for the run cases (R's test harness: temp dirs, `#!/bin/sh` stubs that log `$*` to `<name>.log` and answer from the state text). Walker and published-check cases run in a temp git repo (`git init`, `add`, `commit`, `update-ref refs/remotes/origin/main HEAD`). Both arms are stubs only; no case reaches a live backend. One line per case:

```
walker keeps a movable lineage | a committed fixture lineage with deltas | kept=1 sampled=1 tracked=1
walker drops a max-iterations lineage | stopPolicy max-iterations | forced=1, kept=0
walker drops an off-mode and a min>=max lineage | two more fixture configs | forced=2, kept=0
gold picks the last first-appearance source | iter-001 source A, iter-002 source B, iter-003 source A | gold=2
gold drops a lineage with no source | findings without a source field | no gold=1, sampled=0
inert window sorts first | one lineage with three consecutive ratios >= 0.9 | it sorts before the non-inert one; inert=1
recorded stops at the last iteration | 3 iterations, gold 2 | recorded=3 and right
legacy stop honors minIterations | the vote nominates at 2, minIterations 3, no later STOP | legacy=3, not 2
legacy honors a STOP_BLOCKED event | graph_convergence STOP_BLOCKED at the first STOP | the stop moves to the next STOP iteration
sources stop lands on its gold | iteration 3 cites the first-appearance sources | sources=3 and right
baseline tie goes to legacy | recorded and legacy both right on 5 of 5 | baseline: legacy
census prints no headroom on a saturated fixture | the baseline right on 10 of 10 | last census line `no headroom`; stubs log nothing
vote redistributes weight without counts | records with no key/answered arrays | the coverage signal is unavailable, the vote still scores, `question counts:` names the gap
label gate stops below five reads | --jev --deem --out, no reads file | `stop: fewer than 5 confirmed lineages`; both stub logs absent; exit 0
label gate stops on one disagreement | 5 rows, the fifth gold_iteration differs | `stop: derived gold disagrees on 1 of 5 lineages`; exit 0
label gate passes five agreeing rows | 5 rows equal to the derived gold | no stop line; the arms run
out missing refuses a model arm | --deem without --out | exit 2 before any call; stub log absent
default run with --out writes only report.json | no switch, --out tmp | report.json written, no calls.jsonl, exit 0
jev gate passes a stub | --version `jev 0.6.2`, auth status exit 0 | identity line, then the arm
jev gate skips with no credential | auth status exit 3 | `jev arm skipped: no credential`; census prefix byte-identical; exit 0
jev gate skips on version | --version `jev 0.2.3` | `jev arm skipped: version` then the details line
unpublished lineage is withheld from jev | one delta file absent at origin/main | `unmeasured_unpublished` record; the lineage not measured; no score call for it
jev arm prints keep on scripted answers | stub answers level 4 on every iteration | `verdict jev: keep ... F=0`
jev arm stops on flips | reruns answer 4,4,0 on every iteration | `verdict jev: stop (flips)`
every logged jev call carries one provider | --jev with JEV_PROVIDER=openrouter | every `jev.log` line holds `--provider openrouter`
deem gate passes a fake health | stub health torch/deem-0.8-v1/pair | the health line; the arm runs
deem gate skips a stub backend byte-identically | stub health backend `stub` | `deem arm skipped: stub backend`; the rest equals the default run's lines
deem arm stops on a changed pair at exit 4 | a call exits 4, health then reports a new pair | `deem arm stopped: model commit changed mid-run`; partial line; no verdict
oversize state is withheld | an iteration state over 24,000 chars | `unmeasured_oversize` record; no spawn
verdict keep | scripted answers with W=5, L=0 | `verdict deem: keep` with the counts
verdict kill | scripted answers with W=0, L=5 | `verdict deem: kill`
verdict stop (coverage) | 22 of 25 lineages measured | `verdict deem: stop (coverage)`
verdict stop (margin) | a gain below 10 points | `verdict deem: stop (margin)`
requalify prints before the verdict | a stored report with an older pair | `requalify: model commit changed` then the verdict line
```

34 cases; REQ-011 needs at least 20.

## 4. Build steps

### Code steps (Devin), in order

1. **Walker, gold, census counts.** S: header, imports (`node:fs`, `node:path`, `node:child_process`, `node:util`, `node:crypto`), constants, `USAGE`, `listStateFiles`, `readConfig`, `isMovable`, `deltaIterationFiles`, `deriveGold`, the inert-window computation, `main` with the `--gold-reads`/`--out` parse and the `lineages:`/`gold:`/`reads:` lines. V: `walker keeps a movable lineage`, `walker drops a max-iterations lineage`, `walker drops an off-mode and a min>=max lineage`, `gold picks the last first-appearance source`, `gold drops a lineage with no source`, `inert window sorts first`. No spawn.
2. **Vote, methods, baseline, headroom.** S: `readStateRecords`, `replayVote`, `stopFor`, `coverageSeries`, `rightOf`, `pickBaseline`, `MARGIN_LINE`/`KEEP_RULE_LINE`/`POWER_LINE`, the method lines, `baseline:`, `question counts:`, the gate line. V: `recorded stops at the last iteration`, `legacy stop honors minIterations`, `legacy honors a STOP_BLOCKED event`, `sources stop lands on its gold`, `baseline tie goes to legacy`, `census prints no headroom on a saturated fixture`, `vote redistributes weight without counts`.
3. **Gold reads and the label gate.** S: `parseGoldReads`, `labelGate`, the two stop lines, and the order census -> gate -> arms. V: `label gate stops below five reads`, `label gate stops on one disagreement`, `label gate passes five agreeing rows`.
4. **Report and `--out` rules.** S: `buildReport`, `writeReport`, the `--out`-with-switch refusal. V: `out missing refuses a model arm`, `default run with --out writes only report.json`.
5. **Jev gate and the published check.** S: `which`, `jevGate`, `existsAtOriginMain`, the withheld records. V: `jev gate passes a stub`, `jev gate skips with no credential`, `jev gate skips on version`, `unpublished lineage is withheld from jev`.
6. **Jev arm.** S: `spawnCall`, `buildState`, `createCallLog`, `runJevArm`: published checks, payload notice, `auth test`, 3 `score` calls per iteration, median, F, exits, `calls.jsonl`, the partial line. V: `jev arm prints keep on scripted answers`, `jev arm stops on flips`, `every logged jev call carries one provider`.
7. **Deem gate and arm.** S: `deemCommand`, `readDeemHealth`, `deemGate`, `runDeemArm`: notice, one call per iteration, the exit-4 recheck, the 24,000-char bound, the commit-pair records. V: `deem gate passes a fake health`, `deem gate skips a stub backend byte-identically`, `deem arm stops on a changed pair at exit 4`, `oversize state is withheld`.
8. **Verdict and requalify.** S: `binomialTail`, `formatP`, `summarizeColumn`, `decideVerdict`, `verdictLine`, `readStoredReport`, the two requalify lines. V: `verdict keep`, `verdict kill`, `verdict stop (coverage)`, `verdict stop (margin)`, `requalify prints before the verdict`.

Every step keeps every live loop path byte-identical: no change to `convergence.cjs`, either `reduce-state.cjs`, the workflow YAML, `convergence-signals.md` or any archived lineage file.

### Doc steps (Pi), one doc each

After the runs (plan step 8), so no doc names a verdict that did not print. The doc files are shared with phases 028 to 030, so these steps run one after another.

1. `.skilled/skills/system-deep-loop/runtime/scripts/README.md` — mode `sk-create-readme`. MODEL: its own FILES table `:34-55`. Facts: one row for `score-stop-rater.cjs` (offline lineage replay, zero-call default, `--jev`/`--deem`, `--gold-reads`), placed between `render-command-contract.cjs` and `status.cjs`.
2. `.skilled/skills/system-deep-loop/SKILL.md` — mode `sk-create-skill`. MODEL: the runtime sentences at `:33` and `:111`. Facts: one sentence naming the offline stop-rater replay, its zero-call default, its two switches, and that it changes no stop. Hub `version:` and the hub changelog untouched.
3. `.skilled/skills/system-deep-loop/runtime/README.md` — mode `sk-create-readme`. MODEL: the public-surface paragraph at `:48`. Facts: one line naming the script, its zero-call default and its two switches.
4. `.skilled/skills/system-deep-loop/runtime/changelog/v1.6.0.0.md` — mode `sk-create-changelog`. MODEL: `changelog/v1.5.0.0.md` in the same folder, and the wave-4 sibling `.skilled/skills/system-spec-kit/changelog/v4.4.0.0.md`. Facts: the new script; the census with zero calls; the gold rule and the label gate; the two switches; no verdict claimed unless a run printed one.
5. `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` (Feature ID `F056`, proposed) plus `feature-catalog.md` — mode `sk-create-feature-catalog`. MODEL: `scoring/convergence-score-delta.md` (F038) and the sibling `deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md`. Facts: S, V, the census, the gold rule, the keep rule, the arms, the tests; `version: 1.6.0.0`. Index edits: the `### Stop-rater replay` block after `:425`, the scoring row `:27` `2 features` -> `3 features` with `scripts/score-stop-rater.cjs` added, and `The 54 entries below` `:19` -> 55.
6. `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-rater-replay.md` (Playbook ID `DLR-056`, proposed) plus `manual-testing-playbook.md` — mode `sk-create-manual-testing-playbook`. MODEL: `scoring/convergence-score-delta.md` (DLR-040) and the sibling `deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md`. Facts: the zero-call run with stubs first on `PATH`, the label-gate stop, a stub-backend skip, `git status --porcelain` unchanged, the suite; `version: 1.6.0.0`. Index edits: the `### DLR-056 | Stop-rater replay` block after `:419`, the scoring category `2 scenarios` `:391` -> 3, `54 deterministic scenarios` `:39` -> 55, the release count `:106` -> 55, and the coverage-map row after `:952`.

`validate_document.py` runs on each changed doc. Docs claim only what the runs printed.

## 5. Proof plan

Paths relative to the repository root; stub `jev` and `cli-deem` first on `PATH`, each logging one line per call.

| Goal criterion | Command | Expected |
|---|---|---|
| 1 | `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | exit 0; stdout holds `lineages:`, `gold:`, `method recorded:`, `method legacy:`, `method sources:`, `baseline:` and either `no headroom` or `planned calls:`; both stub logs absent |
| 2 | the same run with `--jev --deem --out <tmp>` and no `--gold-reads`; then with stubs whose `jev auth status --provider official` exits 3 and whose `cli-deem health` reports backend `stub` | `stop: fewer than 5 confirmed lineages` with both logs empty; past the gate the identity line then `jev arm skipped: no credential`, and `deem arm skipped: stub backend`; each exit 0, each stdout the default run's plus only those lines |
| 3 | from `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-rater.vitest.ts` | exit 0; at least 20 passed, 0 failed |
| 4 | `git status --porcelain` before and after every run above; then, only when the operator's reads file exists and the gate passes, one `--deem --out <dir>` run (and one `--jev --out <dir>` on the operator's flag) | `no headroom` printed, or a gate `stop:` line, or `verdict deem:` with its commit pair and a `calls.jsonl` whose every line holds a status and a wall time; porcelain identical |
| 5 | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs`; the build commit's path list | grep prints nothing (exit 1); the commit touches only `system-deep-loop` files, generated copies and this phase folder |
| 6 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc>`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater --strict` | exit 0 `VALID` on each doc; `RESULT: PASSED` |

Criterion 4's accepted end state is the label gate: the census printed its `stop:` line, no arm ran and no verdict exists. The census numbers and every stop or verdict line go in `goal.md`'s log.

## 6. Open questions

| Question | Answer (proposed) |
|---|---|
| The rolling threshold: the problem statement's "(0.30)" is the signal weight, not the threshold | Read `config.convergenceThreshold` when finite, else 0.05 (the YAML default at `:32`) |
| Missing `stopPolicy`/`convergenceMode`/`minIterations` fields | Only explicit blockers force; the lenient rule reproduces the census's 207 movable / 116 kept |
| `minIterations` for the vote when absent (310 of 449 configs) | 3, the config-record default |
| Delta file names (`iter-NNN.jsonl` and `iteration-NNN.jsonl` both exist) | Match `^(iter|iteration)-(\d+)\.jsonl$`, order by the parsed number |
| `sources` ratio definition | First-appearance count / cited count for that iteration, 0 when it cites none |
| Coverage with no question counts | Cumulative distinct answered / distinct asked through the iteration, `null` when none asked; weights redistribute |
| Inert window definition | 3 consecutive evidence ratios at or above 0.9, recomputed from records (the event is not persisted) |
| The `lineage` value in the census and the reads file | The repo-relative lineage directory path |
| Which tail `p=` prints | `p_loss` on a kill line, else `p_win` |
| The calls.jsonl `level` field | The 0-based position; the ratio comes from `LEVEL_RATIOS`, the probability from `probabilities[String(position)] ?? probabilities[label]` |
| `column`/latency stdout lines | Not printed; the spec names no such line and `calls.jsonl` carries wall ms |
| `--out` inside the repository | Not refused (the spec asks for no refusal); the gated runs use a directory outside the repository so porcelain stays identical |
| Oversize and unpublished iterations | One calls.jsonl record each with no spawn, so every iteration has one handling |
| Changelog version and entry versions | `v1.6.0.0.md` (minor: a new script, the 024 sibling's bump); the new catalog and playbook entries carry `1.6.0.0`; the authoring modes recompute at build time |
| Catalog and playbook IDs | `F056` and `DLR-056`, after the highest present (`F055`, `DLR-055`) |
| Hub SKILL.md version | Untouched: the release note is the runtime changelog, and hub SKILL.md edits without a version bump have precedent |
