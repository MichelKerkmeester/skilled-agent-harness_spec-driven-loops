# Build design: 030-fanout-merge-shadow-record

Read with `spec.md`, `plan.md`, `tasks.md`, `goal.md`. Code route: `sk-code-opencode` + `sk-create-quality`. Docs: sk-doc modes named per step. Facts below are from the tree at HEAD `812dc819ca`.

## 1. Premises

| Cited site | Status | Checked fact |
|---|---|---|
| `runtime/scripts/fanout-merge.cjs:345-354` | ok | `nearDuplicateContentKey` joins `summary\|description\|finding\|question\|direction`, else `contentIdentityKey` |
| `:358-392` | ok | `TITLE_STOPWORDS` 358, `titleContentTokens` 364, `titleOverlap` 376-383, `TITLE_DISTINCT_OVERLAP_THRESHOLD = 0.15` 392 |
| `:376-383` | ok | overlap is 1 when both token sets are empty, 0 when one is, else Jaccard |
| `:399-402` | ok | `nearDuplicateMatches` = body-key equality first, then `overlap >= 0.15` |
| `:504-510` | ok | `resolveMergeOptions` reads `enableNearDuplicateDedup` or `SPECKIT_FANOUT_NEAR_DUP_DEDUP` |
| `:1404` | ok | exports `mergeResearchRegistries`, `mergeReviewRegistries` (+4). The seven selection helpers above are **not** exported, so the script copies them |
| `001-deep-research/research/research.md:1055` citing `fanout-merge.cjs:341`, `:348-351` | moved | `341 -> 392`, `348-351 -> 399-402` (phase 015 `7de30fb16f`); matches the goal log's seam-drift row |
| `001-deep-research/research/research.md:1278` | ok | R15 promote row, wording unchanged |
| `007-classifier-deep-research/research/research.md:425` | ok | `\| R15, the fan-out shadow pair record \| No gold, no reader \| Keeps \| Stays later \|` |
| `001-deep-research/.../lineages/deepseek/iterations/iteration-005.md:70` | ok | names the body gate first; its `:349`/`:341` are the moved pair above |
| `runtime/scripts/fanout-run.cjs:841-842` (not cited, load-bearing) | ok | `LINEAGE_REGISTRY_FILES` = research `['findings-registry.json','deep-research-findings-registry.json']`, review `['deep-review-findings-registry.json']`; not exported |
| `runtime/scripts/fanout-merge.cjs` (Files table, read only) | ok | 1,421 lines; review merge drops any finding whose `disposition ?? status !== 'active'` (`:860`), research drops an id-less finding (`:741`) |
| `runtime/scripts/README.md`, `runtime/README.md`, `SKILL.md` | ok | all three exist; `SKILL.md` has no fanout mention, so its one sentence lands in §3 Backend |
| `runtime/changelog/` newest | ok | `v1.5.0.1.md`; 7 files; next by the minor rule is `v1.6.0.0.md` |
| `feature-catalog/fanout/` + `feature-catalog.md` | ok | 8 leaves; index row `[fanout](fanout/) \| 8 features`; index says "The 54 entries below"; `F053` unused |
| `manual-testing-playbook/fanout/` + index | ok | 10 leaves; index says "54 deterministic scenarios across 12 categories"; `DLR-053` unused |
| `deep-improvement/.../scorer/score-d4-agreement.cjs` | ok | 1,323 lines: gates, `decideVerdict`, `summarizeColumn`, `createCallLog`, `buildReport`, `main(argv, deps)` |
| `deep-improvement/.../tests/d4-agreement.vitest.ts` | ok | 741 lines: `tempDir`, `stubDir`, `runMain`, `createRequire` of the `.cjs` |
| `system-skill-advisor/.../score-jev-tiebreak.mjs:29` | ok | `DEEM_P50_MS = 65.6`, the same p50 as `007/context/deem-local.md:87` (`choice`, 2 options) |
| Corpus | ok | 230 research + 225 review tracked lineage registries here; 218 + 227 at `origin/main`, so the Jev published-only rule withholds 12 research runs' registries |

## 2. Interface

**Script**: `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` (new, ~520 lines, CommonJS, no new dependency).

**CLI switches** (`node:util` `parseArgs`, `strict: true`, `allowPositionals: false`; unknown flag or positional -> `USAGE` on stderr, exit 2):

| Switch | Rule | Exit |
|---|---|---|
| `--out <dir>` | written by any arm; required by `--jev` or `--deem`, refusal **before** any call or census write | 2 when missing/empty with an arm |
| `--labels <file>` | pair sheet with `label` filled; absent means K=0 | 2 when unreadable |
| `--write-pair-sheet <path>` | at most 60 rows per class, ascending SHA-256 of the pair key; a path resolving inside the repo root | 2, nothing written |
| `--jev`, `--deem` | independent switches; neither means zero calls and zero writes unless `--write-pair-sheet` names one | 0 |

Script exits: 0 on every completed run including a gate stop, 2 on bad invocation or unreadable input, 1 on an unexpected throw `(proposed)`.

**stdout lines, in order**: `runs: research=<n> review=<n>` / `pairs: research=<n> review=<n>` / `class near-line: research=<n> review=<n>` / `class cross-body: research=<n> review=<n>` / `merge decisions: <class> <kind> dedup-on same=<n> different=<n> dedup-off same=<n> different=<n>` (one per class per kind) / `title rule: research=<n> of <n> findings carry a title` / `body fields: review=<n> of <n>` / `merge undecidable: <n>` (all `(proposed)` except the five required prefixes), then one gate line, then per arm: identity line, cost line, skips, or the verdict line.

**Files written**: the `--write-pair-sheet` path (JSONL), `<out>/report.json`, `<out>/calls.jsonl`. Nothing else, ever.

**Constants**: `LABEL_GATE = 40`; `CROSS_BODY_LABEL_GATE = 10`; `SHEET_PER_CLASS = 60`; `NEAR_LINE_MIN_OVERLAP = 0.05`; `NEAR_LINE_MAX_OVERLAP = 0.30` (exclusive); `CROSS_BODY_MIN_OVERLAP = 0.5`; `HEADROOM = 0.9` (strict `>`); `QUESTIONS`/`NOUL_QUESTION = 'Do these two findings describe the same problem?'`; `SAME_AT = 0.5`; `JEV_ORDERS = ['AB','BA','AB']`; `DEEM_ORDERS = ['AB','BA']`; `DEEM_P50_MS = 65.6`; `HEALTH_TIMEOUT_MS = 2000`; `JEV_CALL_TIMEOUT_MS = 90000`; `JEV_BACKOFF_MS = 2000`; `JEV_VERSION = 'jev 0.6.2'`; `DEEM_MODEL = 'deem-0.8-v1'`.

**Exported functions** (tests `require` them; `main` takes injected deps like the sibling):

| Signature | Behaviour |
|---|---|
| `listTrackedFiles(root, run = spawnSync)` | `git ls-files -z` at root, split, sorted; empty set on a git failure |
| `walkRuns(root, {listTracked})` | groups tracked `{research,review}/lineages/<label>/<registry>` paths into runs; a run needs 2+ lineages and is keyed `<loop>:<runDir>` |
| `findingsOf(root, loop, registry)` | reads `keyFindings` (research) / `openFindings` (review); keeps findings with `id ?? title` (research) or `findingId ?? title` (review) |
| `findingId(loop, f)` | the id above, `null` when absent |
| `bodyKey(f)` | copy of `nearDuplicateContentKey` |
| `titleTokens(f)` / `overlap(a, b)` | copies of `titleContentTokens` / `titleOverlap` |
| `findingText(f)` | `bodyKey` text, else `title`, else `JSON.stringify(f)` `(proposed)` |
| `titleOrTextOverlap(a, b)` | title overlap, or overlap of `findingText` when either title is empty |
| `classifyPair(a, b)` | `'near-line'` when `bodyKey` equal and title overlap in `[0.05, 0.30)`; `'cross-body'` when keys differ and `titleOrTextOverlap >= 0.5`; else `null` |
| `pairKey(loop, runDir, a, b)` | `<loop>:<runDir>#<la>@<idA>|<lb>@<idB>` with the two lineages sorted `(proposed)` |
| `sha256Hex(text)` | lowercase hex |
| `selectCandidates(root, deps)` | all classed pairs per kind with their lineage labels and texts |
| `mergeDecision(loop, la, fa, lb, fb, dedup)` | calls the exported merge on a two-registry copy via `normalizeRegistrySchema`'s own shape; `same` when the merged findings array holds 1, `different` when 2, `undecidable` when 0 |
| `readBaseline(labeled)` | `{method:'dedup-on'\|'dedup-off', onRight, offRight, right}`, dedup off on a tie |
| `writePairSheet(pairs, sheetPath, root)` | JSONL, ≤60 per class by `sha256Hex(pairKey)`; throws the in-repo refusal before opening the file |
| `parseLabels(text, root)` | `Map(pairKey -> 'same'\|'different')`; a row naming neither value or repeating a key throws `labels row <n>: …` |
| `gateState(labels, pairIndex, baseline)` | `{kind:'label'\|'cross-body'\|'headroom'\|'open', line}`; the two stop lines and `no headroom` verbatim; open prints `planned calls: jev <3K+1>, deem <2K>` `(proposed)` |
| `binomialTail(successes, trials)` | exact `{num, den, p}` in BigInt, the sibling's function |
| `decideVerdict({backend,K,M,A,B,W,L,F,C})` | the six steps in spec order; below 0.05 as `20n*num < den`; `p` is the tail the deciding step read `(proposed)` |
| `formatP(p)` | `toPrecision(4)`, `1` when `W+L` is 0 |
| `summarizeColumn(backend, rows, answers, baselineCalls, suffix)` | counts plus the verdict line ending `… baseline=<method> reader=none named` and the Deem or Jev suffix |
| `which` / `deemCommand` / `readDeemHealth` / `deemGate` | the sibling's shapes; health timeout 2,000 ms; skips `not reachable`, `stub backend`, `model`, `bad health response` |
| `publishedAt(relPath, {git})` | `git cat-file -e origin/main:<relPath>` exit 0 |
| `jevGate(ctx)` | identity line `jev: path=<p> provider=<P>` first, then `command -v jev`, `jev --version`, `jev auth status --provider P`; skips `jev not on PATH`, `version` + details, `no credential` |
| `spawnCall(file, args, stdinText, env, timeoutMs)` | one bounded child (the sibling's): stdin closed, timer kill, `{code, stdout, stderr, wallMs, timedOut}` |
| `createCallLog(outDir)` / `readStoredReport(outDir)` | append-only `calls.jsonl`; the earlier `report.json` for the requalify lines |
| `stateText(a, b, order)` | `Finding A:\n<text>\n\nFinding B:\n<text>\n`, swapped for `BA` `(proposed)` |
| `runDeemArm(plan, gate, ctx)` | cost line, then 2 `cli-deem noul -q "<question>"` calls per pair (AB, BA); answers read at `answers.answer.noul`; modal decides, a split pair is `unstable`; exits 1/400 `unmeasured`, 2/3/130 stop, 4 one health recheck then `server gone` or `model commit changed mid-run` |
| `runJevArm(plan, gate, ctx)` | cost line, one `jev auth test --provider P`, then 3 `jev noul --provider P -q "<question>"` calls per pair (AB, BA, AB), no cache; unpublished pairs are `unmeasured_unpublished`; exits 1 `unmeasured`, 2/3/130 stop, 4 one backoff retry, `>90 s` `unmeasured_timeout` |
| `buildReport(parts)` | `{question, census, labeled, baseline, gate, columns, stopped, skipped, requalify}`; the columns bucket carries every verdict line |
| `main(argv, deps = {})` | `deps.out/err/env/timeoutMs/backoffMs/healthTimeoutMs/root/listTracked/git`; tests point `root` at a temp tree and inject both git seams |

**calls.jsonl line** `(proposed field names)`: `{pair_key, backend, order, wall_ms, exit_code, probability, status}` plus `model, model_commit, source_commit` on Deem lines and `jev_version, provider, model` on Jev lines; `status` in `measured|unmeasured|unmeasured_timeout|unmeasured_unpublished`.

**Keep rule** (spec §4, fixed): coverage `10*M >= 9*K` else `stop (coverage)`; kill when the exact `P(X>=L)` is below 0.05; margin `10*(A-B) >= M` else `stop (margin)`; sign test `P(X>=W)` below 0.05 with `p = 1` at `W+L = 0` else `stop (sign test)`; flips `10*F <= C` else `stop (flips)`; else `keep`. Verdict line verbatim per spec §4 "The line", suffix last.

## 3. Test cases

`score-fanout-pairs.vitest.ts`, all on temp fixture registries and stub `jev` / `cli-deem` first on `PATH`; no live backend, ever.

| name | input | expected |
|---|---|---|
| walker skips a one-lineage run | a 2-lineage run and a 1-lineage run | one run, 2 lineages |
| walker accepts both research registry names | lineages writing `findings-registry.json` and `deep-research-findings-registry.json` | one run, 2 lineages |
| walker reads the review findings field | review run with `openFindings` | findings read from `openFindings` |
| near-line admits its pair | equal bodies, title overlap 0.05 | `near-line` |
| near-line admits the upper edge | overlap 0.29 | `near-line` |
| near-line rejects below the band | overlap 0.04 | `null` |
| near-line rejects at the upper bound | overlap 0.30 | `null` |
| cross-body admits its pair | different bodies, one empty title, text overlap 0.5 | `cross-body` |
| cross-body rejects below 0.5 | overlap 0.49 | `null` |
| cross-body rejects an equal-body pair | equal bodies, text overlap 0.9 | `near-line` or `null`, never `cross-body` |
| parity: body key agrees with the merge | 4 fixture pairs, equal and unequal keys, dedup on | selection class matches the merge collapse on each |
| parity: a title-only pair stays out of near-line | equal keys, overlap 0.0 | merge splits it, selection rejects it |
| oracle reads both decisions | a pair that collapses only with dedup on | `same` then `different` |
| oracle reads today's default | a pair whose ids match | `same` with dedup off |
| oracle marks an unreadable pair | review pair whose findings are not `active` | `undecidable`, excluded from the classes |
| baseline picks the better decision | dedup on right 30 of 40, off 25 | `dedup-on` |
| baseline ties to dedup off | both right 30 of 40 | `dedup-off` |
| no headroom above 90 percent | baseline right 37 of 40 | `no headroom`, no arm, exit 0 |
| pair sheet writes outside the repository | a temp path | ≤60 rows per class, `label` empty, JSON parses |
| pair sheet refuses an inside path | `<root>/sheet.jsonl` | exit 2, file absent |
| label reader stops under 40 pairs | 39 rows | `stop: fewer than 40 labeled pairs`, no call |
| label reader stops under 10 cross-body | 40 rows, 9 cross-body | `stop: fewer than 10 labeled cross-body pairs` |
| label reader names a bad value by row | row 3 `label: "maybe"` | exit 2, `labels row 3:` |
| label reader drops an unknown key | a key outside the sheet | `labels dropped: 1`, no error |
| deem gate passes a fake health | stub `health` exit 0, `backend=torch` | identity line with the commit pair |
| deem gate skips a stub backend | stub `backend=stub` | `deem arm skipped: stub backend`, census bytes identical |
| deem gate skips an unreachable server | stub exit 4 | `deem arm skipped: not reachable` |
| jev gate passes a stub | `--version` `jev 0.6.2`, `auth status` exit 0 | gate passes, both calls carry `--provider official` |
| jev gate skips on exit 3 | `auth status --provider official` exit 3 | `jev arm skipped: no credential` |
| jev arm withholds an unpublished pair | injected `publishedAt` false | `unmeasured_unpublished` line, no stub call |
| jev arm prints keep | stub noul 0.9 | `verdict jev: keep … reader=none named jev_version=0.6.2 provider=official model=…` |
| deem arm marks a disagreeing pair unstable | stub noul 0.9 then 0.1 | pair counted wrong, `unstable` |
| verdict prints kill | fixture with the loss tail below 0.05 | `verdict deem: kill` |
| verdict prints stop (coverage) | 8 of 10 pairs measured | `verdict jev: stop (coverage)` |
| verdict stops on flips | 3 answers off the modal of 3 | `verdict jev: stop (flips)` |
| default run makes no call | both stubs first on `PATH` | exit 0, five census prefixes, both stub logs empty |
| refuses a model arm without --out | `--jev` alone | exit 2, zero calls, no file |
| report and calls.jsonl written once | `--deem --out <tmp>` past the gate | `report.json` with the verdict line, one `calls.jsonl` line per call |

## 4. Build steps

Executor per parent D5: **Devin `deepseek-v4-1-flash-max`** for code, **Pi `llmgateway/mimo-v2.6-pro`** for docs, **orchestrator** for gates, runs, review, commit. Code steps follow `sk-code-opencode` (JS standards + `references/shared/universal-patterns/naming-and-commenting.md`): comments carry the durable WHY only, never a spec path, phase number or requirement id. Doc steps follow sk-doc.

**X1 (orchestrator, tasks T001/T002).** Record the runtime vitest baseline at HEAD in `goal.md`'s log: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage` — 1,xxx passed, record the exact line. Re-check the §1 premises in `fanout-merge.cjs`; log any drift.

**C1 (Devin, T003/T004) — fixtures and stubs in `V`.** Helpers `tempDir`, `writeRun(root, loop, run, lineages)`, `stubDir(bodies)`, `runMain(argv, env, deps)`, `labeledFixture(root, K, crossBody)`. Layout: `V:1-120`. Tests: `walker skips a one-lineage run`, `walker accepts both research registry names`, `walker reads the review findings field`.

**C2 (Devin, T005) — walker, `S:31-100`.** `listTrackedFiles`, `walkRuns`, `findingsOf`, `findingId`. Copy the registry-name map from `fanout-run.cjs:841-842` with the WHY comment. Tests as in C1 plus `parity` fixtures are written here: `S:76-165` block, tests `walker…` above.

**C3 (Devin, T006) — selection, `S:166-230`.** `bodyKey`, `titleTokens`, `overlap`, `findingText`, `titleOrTextOverlap`, `classifyPair`, `pairKey`, `sha256Hex`, `selectCandidates`. WHY comments name the merge as the source of the body key and the copy. Tests: the six `near-line`/`cross-body` cases above.

**C4 (Devin, T007) — merge oracle, `S:231-270`.** `mergeDecision`, `readBaseline`; the two-registry copy is `[{label: la, registry: {<field>: [fa]}}, {label: lb, registry: {<field>: [fb]}}]` built through `normalizeRegistrySchema`'s accepted shape. Tests: `oracle reads both decisions`, `oracle reads today's default`, `oracle marks an unreadable pair`, `baseline picks the better decision`, `baseline ties to dedup off`.

**C5 (Devin, T007) — parity, `V` only.** `parity: body key agrees with the merge` drives `classifyPair` and `mergeDecision` over the same 4 fixture pairs; `parity: a title-only pair stays out of near-line`. No production change.

**C6 (Devin, T008) — sheet, labels, gate, `S:271-340`.** `writePairSheet`, `parseLabels`, `gateState`. Tests: the sheet, label and no-headroom cases above.

**C7 (Devin, T009) — Jev gate and arm, `S:341-420`.** `which`, `publishedAt`, `jevGate`, `stateText`, `spawnCall`, `createCallLog`, `runJevArm`. Tests: `jev gate passes a stub`, `jev gate skips on exit 3`, `jev arm withholds an unpublished pair`, `jev arm prints keep`.

**C8 (Devin, T010) — Deem gate and arm, `S:421-470`.** `deemCommand`, `readDeemHealth`, `deemGate`, `runDeemArm`, `readStoredReport`, `nearestRank`. Tests: `deem gate passes a fake health`, `deem gate skips a stub backend`, `deem gate skips an unreachable server`, `deem arm marks a disagreeing pair unstable`.

**C9 (Devin, T011) — Keep Rule, verdict, report, main, `S:471-540`.** `binomialTail`, `decideVerdict`, `formatP`, `summarizeColumn`, `buildReport`, `main`, `module.exports`, `require.main === module`. Tests: `verdict prints keep`, `verdict prints kill`, `verdict prints stop (coverage)`, `verdict stops on flips`, `default run makes no call`, `refuses a model arm without --out`, `report and calls.jsonl written once`.

**V1 (orchestrator, T012/T019).** `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-fanout-pairs.vitest.ts` — expect exit 0, ≥22 passed, 0 failed. Then the whole runtime suite against X1's baseline.

**D1 (Pi, `kind: code_folder` field rule) — `runtime/scripts/README.md`.** Mode `sk-create-readme`; MODEL the file itself. One row in §3 FILES between `render-command-contract.cjs` and `status.cjs`: `score-fanout-pairs.cjs` reads recorded fan-out registries, prints the near-line and cross-body pair census and the merge's own decision per pair, and behind `--jev` or `--deem` scores that backend against the operator's labels; the merge is unchanged and the default run makes no call.

**D2 (Pi) — `runtime/README.md`.** Mode `sk-create-readme`; MODEL the file itself. One line under §3 PUBLIC SURFACE naming the script, its zero-call default, the 40-pair and 10-cross-body label gate and both switches.

**D3 (Pi) — `SKILL.md`.** Mode `sk-create-skill`; MODEL `SKILL.md` §3 Backend. One sentence after the `runtime/` enumeration: the runtime also carries the offline fan-out pair replay, which reads the merge's own decisions on near-line and cross-body pairs and compares a backend's judgment with the operator's labels, and the merge itself is unchanged.

**D4 (Pi) — `runtime/changelog/v1.6.0.0.md`.** Mode `sk-create-changelog` (minor: new feature); MODEL `runtime/changelog/v1.5.0.1.md` for frontmatter, title, glance list, upgrade line. Facts: the new script, the zero-call census, the two gates, the two arms, the Keep Rule, the merge unchanged. Verify the filename against `ls runtime/changelog | sort -V | tail -1`.

**D5 (Pi) — catalog.** Mode `sk-create-feature-catalog`. Create `runtime/feature-catalog/fanout/fanout-pair-replay.md` (MODEL `fanout/fanout-merge.md`); add the `### Fan-out pair replay` block to §14 FAN-OUT of `feature-catalog.md` (MODEL the `Fixed-rate overrun accounting` block) and its `fanout/fanout-pair-replay.md` link line; bump the `[fanout](fanout/)` row to `9 features` and the "54 entries" count to 55. Take the lowest free `F0xx` at step time (`F053` today, checked with `grep -oE 'F[0-9]{3}' feature-catalog.md | sort -u | tail -3`). State: census over tracked runs, the merge's decisions with dedup on and off, the pair sheet, the label gate, `--jev`/`--deem`, the Keep Rule, `reader=none named`.

**D6 (Pi) — playbook.** Mode `sk-create-manual-testing-playbook`. Create `runtime/manual-testing-playbook/fanout/fanout-pair-replay.md` (MODEL `fanout/fanout-merge-research.md`, `DLR-0xx` numbering) covering the census, the label-gate stop and a stub-backend skip; add its §14 FAN-OUT block and its `DLR-0xx` row to §19 of `manual-testing-playbook.md`, and update "54 deterministic scenarios across 12 categories" to 55. Lowest free `DLR-0xx` (`DLR-053` today). Take the next free number atomically if 027, 028 or 029 lands first.

**D7 (Pi) — version pass.** Run `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs apply --skill system-deep-loop` in the same commit as D1-D6 (new files get anchor `3.0.1.0`, `W = 0`; existing runtime docs keep their version, `skip-conflict`), then `… gate --skill system-deep-loop` for exit 0. Copy the nearest sibling's shape where the engine skips.

**D8 (Pi) — generated copies, only if their own checks report them stale:** `.hermes/skills/system-deep-loop/SKILL.md` (the D3 sentence), `leaf-manifest.json`, and the trigger index via `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` + `--check`.

**R1 (orchestrator, T013/T015/T016) — runs.** The census with logging stubs first on `PATH`; `--write-pair-sheet` to an operator-named path outside the repo; the merge diff, the secret grep and `git status --porcelain` before and after each run. Record every line in `goal.md`'s log.

**R2 (orchestrator, T017) — blocked on the operator's labels.** Only past the gate: one `--deem --out <dir>` run and, on the operator's flag, one `--jev --out <dir>`.

**R3 (orchestrator, T018/T019/T020) — review, validate, close.** Cross-family review (P0/P1 fixed, P2 recorded), `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc> --type <skill|readme|code_folder|changelog|feature_catalog|playbook|playbook_feature>`, `validate.sh --strict`, `check-goal.cjs`, path-scoped commit, then `implementation-summary.md` and `goal.md` log.

## 5. Proof plan

| Criterion (goal.md §3) | Command | Expected |
|---|---|---|
| 1 census, zero calls | `PATH=<stubdir>:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | exit 0; `runs:`, `pairs:`, `class near-line:`, `class cross-body:`, `merge decisions:` lines; both stub logs 0 bytes |
| 2 sheet refusal, both stop lines, both skips | `… --write-pair-sheet ./.pair-sheet.jsonl` then `… --jev --deem --out <tmp> --labels <39-row fixture>` and the stub-backend and exit-3 fixtures | exit 2 and no file; `stop: fewer than 40 labeled pairs`; `deem arm skipped: stub backend`; `jev arm skipped: no credential`; stub logs empty at the gate |
| 3 vitest | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-fanout-pairs.vitest.ts` | exit 0, ≥22 passed, 0 failed |
| 4 close on a stop line | the census and sheet record in `goal.md`, then EITHER the label gate line `stop: fewer than 40 labeled pairs` (accepted end state) or one live `--deem --out` line ending `reader=none named` | the stop line in `goal.md`'s log, or the verdict line with its `model= model_commit= source_commit=` suffix |
| 5 merge untouched | `git diff --stat -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`; `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' <script>`; `git status --porcelain` | empty; no match; identical before and after every run; the build commit touches only `system-deep-loop` paths, generated copies and the phase folder |
| 6 docs and packet gates | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc> --type <class>`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record --strict` | exit 0 `VALID` each; `RESULT: PASSED` |

## 6. Open questions

| Question the spec leaves open | Answer |
|---|---|
| Label file shape and what an unknown key does | The pair sheet with `label` filled; a key outside the sheet is dropped and counted as `labels dropped`, never an error `(proposed)` |
| A pair both merges drop (review non-`active`, or no id) | Third state `undecidable`, printed and excluded from both classes and from K `(proposed)` |
| Which tail `p=` prints | The tail the deciding step read: `P(X>=L)` on `kill`, else `P(X>=W)` `(proposed)` |
| The open-gate line | `planned calls: jev <3K+1>, deem <2K>` `(proposed)`; the spec fixes only the two stop lines and `no headroom` |
| Where the `SKILL.md` sentence goes | §3 HOW IT WORKS, `### Backend` `(proposed)`; the file has no fanout section today |
| The changelog version | `v1.6.0.0` (minor, new feature; newest is `v1.5.0.1`) `(proposed)` |
| Section 7's "who reads a shadow record" | Stays UNKNOWN; every verdict line ends `reader=none named` and the phase closes at its gate |
| A pair whose two registries are on this branch only | Jev withholds it (`unmeasured_unpublished`); a sunk coverage prints `stop (coverage)`. 12 research runs' registries are branch-only today |
