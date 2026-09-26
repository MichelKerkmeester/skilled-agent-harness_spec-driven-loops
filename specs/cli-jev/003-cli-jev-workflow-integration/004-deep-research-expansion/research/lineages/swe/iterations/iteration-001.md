---
title: "Iteration 1: R1 as code — score-jev-tiebreak.mjs function by function"
trigger_phrases: []
---
# Iteration 1: R1 as code — score-jev-tiebreak.mjs function by function

**Angle:** swe-01 · **Lens:** code-level slice design · **Jev package under study:** Python `jev-cli` 0.6.2 (wrapped by `.skilled/skills/cli-jev/cli-usage/`); the npm `jevctl` 0.2.3 is vendored research material only, named apart where it appears

Independent: no round-2 sibling file read.

## Focus

Turn BASE's R1 record into a checkable first slice: the functions `score-jev-tiebreak.mjs` needs, the imports it can reuse, the pseudocode a reviewer can check line by line against the keep rule, the cases the rule leaves undefined, the test fixtures, and every place 002's `spec.md`/`plan.md`/`tasks.md` already diverge from BASE's proposed amendments.

## Actions Taken (opened this iteration)

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs` (whole file; metrics `:83-112`, split `:118-123`, rerank arm `:129-133`, flip rule `:149-150`, runs on import `:159`, zero exports)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` (whole file; env `:35-46`, alias match `:49`, `:70-76`, abstention handling `:94-98`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs` (whole file; `TAU` `:35`, margin `:62-66`, `includeAllCandidates` `:63`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` (whole file; margins `:7-8`, cluster `:22-36`, `applyAmbiguity` `:44-58`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:749-799` (adjusted-score sort, `passes_threshold` `:785-787`, `applyAmbiguity` at `:789`, low-info abstention `:796-799`)
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:86-108` (`stddev`, `stabilityCoefficient`)
- `specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md`, `plan.md`, `tasks.md` (whole files)
- `.skilled/skills/cli-jev/cli-usage/SKILL.md` (grep only: `choice` cardinality rule `:15-17`, `-s/--state` accepts `-` for stdin `:146-155`)
- Counts run this iteration (read-only, no module executed): `labeled-prompts.jsonl` 195 rows, 18 gold-none, **177 skill-firing**; `holdout-prompts.jsonl` 70 rows, 6 gold-none, **64 skill-firing**; `ambiguity-prompts.jsonl` 24 rows, 5 gold-none, **19 skill-firing**. One-sided sign test tail computed exactly: min wins for p<0.05 by decided count below.

## Per-Idea Records

### R1 — the slice as code: `score-jev-tiebreak.mjs`

| Field | Content |
|---|---|
| **Idea** | R1 — offline `choice` over the advisor's near-tie cluster, scored beside the scorer's order and three zero-call comparators, under a keep rule that can fail. Type: `choice`, Python `jev-cli` 0.6.2. |
| **Builds on** | BASE §11 R1 and §13 phase 002; questions 1, 2, 3, 12, 16, 30. |
| **Value** | The first measured answer to "does a Jev `choice` order near-ties better", with a rule that can print `kill`. The operator gets the first per-call latency record even when the arm cannot keep (R21 fallback). |
| **Seam** | New file `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`. Imports the built scorer the way the eval does (`score-outcome-rerank.mjs:35-38`): `scoreAdvisorPrompt` and `loadAdvisorProjection` from `dist/runtime/lib/scorer/{fusion,projection}.js`, `outcomeWeightedRerank` from `dist/runtime/lib/scorer/outcome-weighted-rerank.js`, plus `mergedSkillForAlias` and `skillMatchesAlias` from `dist/runtime/lib/scorer/aliases.js` and `findAdvisorWorkspaceRoot` from `dist/runtime/lib/utils/workspace-root.js` (the two imports `capture-scorer-eval-baseline.mjs:49-50` adds). |
| **Metric, baseline, harness** | H2 (MRR, right@1, right@3) and H1 (holdout top-1 53/70 = 0.7571, ambiguity slice 18/24 = 0.75). Baselines confirmed from `scorer-eval-baseline.json` via BASE; row counts re-counted this iteration: 177 + 64 skill-firing = **241 census rows** (BASE's number confirmed). H2's rerank baseline is UNKNOWN until run — the baseline column produces it. |
| **Cost, latency, privacy** | Census zero calls. Arm ceiling 241 eligible-max × 3 passes = 723 + 1 `auth test`; real count follows census. Corpus prompts and skill descriptions leave the machine (low class; provenance unchecked). No deadline — a person runs it. |
| **Key gate and no-key behavior** | `--jev` flag; gate order `command -v jev` → `jev --version` == `jev 0.6.2` → `jev auth status` exit 0; first failure prints `jev arm skipped: <check>` (version failure also prints the found version line and the resolved binary path); exit 0 always, census output byte-identical. No key: never spawns `jev`. Exit 3 after the gate = rejected key → `jev arm stopped: key rejected`, finished rows `partial`. |
| **Rough LOC** | Function table below; **~330 LOC total** — above BASE's 250-320 band, driven by the three comparators and the exact sign test BASE added but 002 never carried. |
| **Verdict** | build-now (unchanged) — but the slice is bigger than 002's docs say, and one undefined case below can bias the keep rule toward `kill` unless fixed in code. |
| **Confidence** | Confirmed from code for every import, the split, the metric shapes, the env list and the run-on-import constraint. Inferred: that movable rows exist and that 3 reruns separate signal from noise. The sign-test tail table is computed exactly this iteration. |

### The functions, signatures and LOC

Written so a reviewer can check each against BASE's rule. `dist` imports must be dynamic and after the env block (run-on-import eval semantics do not apply here, but lane behavior depends on env, so set env first like `capture-scorer-eval-baseline.mjs:35-46`).

| # | Function | Signature | Body (checkable pseudocode) | LOC |
|---|---|---|---|---|
| 1 | env setup | top-level statements | `SYSTEM_SKILL_ADVISOR_DB_DIR=mkdtemp`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1`, **`VITEST='true'`**, delete the three lane-weight vars — copies `capture-scorer-eval-baseline.mjs:35-46` verbatim including VITEST | 10 |
| 2 | `loadJsonl` | `(path) → rows` | as eval `:40-51`; **keep gold-none rows** (baseline column needs all 70 holdout) but tag `skillFiring` | 12 |
| 3 | `clusterFor` | `(recommendations) → members[]` | `recommendations.filter(r => Array.isArray(r.ambiguousWith))` — `applyAmbiguity` marks exactly the ≥2-member cluster (`ambiguity.ts:47-56`); members already rank-ordered. **Do not pass `includeAllCandidates`** — live callers don't (`derive-ambiguity-slice.mjs:63` uses it only for the frozen-slice margin, a different rule) | 6 |
| 4 | `rrAlias` | `(order, gold) → number` | reciprocal rank where membership test is `mergedSkillForAlias(id) === mergedSkillForAlias(gold) || skillMatchesAlias(id, gold)` — alias-aware version of eval `:85-88`, per BASE R-c | 10 |
| 5 | `inTopKAlias` | `(order, gold, k) → bool` | same matcher over `order.slice(0,k)` | 5 |
| 6 | `scoreOrdering` | `(rows, orderFor) → {mrr, at1, at3}` | copy eval `:96-112` verbatim, swapping the matcher calls | 16 |
| 7 | `census` | `(rows) → counts` | per row: `order = scoreAdvisorPrompt(prompt).recommendations`; `cluster = clusterFor(order)`; `eligible = cluster.length >= 2`; `goldInCluster` alias-aware; `movable = eligible && goldInCluster && top ≠ gold`; `goldFirst = top ≡ gold`; tau-0.03 membership by id ∈ `ambiguity-prompts.jsonl` (frozen id set — the file carries `id`, `:77-86`); aggregates per file | 35 |
| 8 | `comparators` | 3 fns | `confidenceOrder`: reorder cluster members by `confidence` desc, tie → keep fused order (deterministic); `alwaysSecond`: move `cluster[1]` first; `rerank`: `outcomeWeightedRerank(cands, {fold, betaMean})` on **held-out rows only**, fold built per eval `:60-75` from the train half | 45 |
| 9 | `gate` | `() → ok \| skip(check)` | `command -v jev` → `jev --version` → `jev auth status`; single skip line `jev arm skipped: <check>`; version failure echoes found version + binary path; `auth test` once before the loop records provider/model | 35 |
| 10 | `callChoice` | `(row, cluster, pass) → callRecord` | `jev choice -q 'Which skill fits this request best?' -o '<skill>=<projection description>' … -o 'none=None of these fits' -s -`, prompt on stdin, stdin closed; arg array, no shell; records wall ms, exit, version, provider, model, pick, `pickProbability`, `noneProbability`, status | 40 |
| 11 | `exitMap` | `(exit, stdout, submitted) → status` | 0 + submitted key → `measured`; 0 + `none` → `abstained`; 0 + foreign key or bad JSON → `unmeasured`; 1 → `unmeasured`; 2 → `unmeasured` + stop (`bad command`); 3 → stop + `partial` + `jev arm stopped: key rejected`; 4 → one backoff retry then `unmeasured`; 130 → stop `interrupted` | 30 |
| 12 | `modalPick` | `(picks[]) → {pick, stable}` | 3-pass pigeonhole: `A,A,A`/`A,A,B` → modal A; `A,B,C` → `unstable`; a 2-way tie is **unreachable with 3 passes** — code asserts it | 10 |
| 13 | `flipRate` | `(rowResults) → {rate, over}` | per row with all 3 passes measured: flip = not all picks equal (incl. `none` as a pick value); rate = flipped / measured-3-pass rows; `unmeasured` rows excluded from numerator and denominator, counted apart | 12 |
| 14 | `signTail` | `(wins, decided) → p` | exact one-sided binomial tail `Σ_{i=wins}^{decided} C(n,i)/2ⁿ`; ties and abstained and unmeasured are not decided | 12 |
| 15 | `verdict` | `(columns, flips) → line` | `underpowered` if census movable < 5 or arm decided < 5; else `kill` if `signTail(losses, decided) < 0.05` (favors scorer); else `keep` iff all four: `signTail(wins, decided) < 0.05`, `mrrJev > mrr_c` for each comparator c on `rowsFor(c)`, `at3Jev >= at3Scorer` on decided rows, `flipRate <= 0.10`; else `inconclusive` | 30 |
| 16 | `report` | `() → report.json + stdout` | counts per file/split, baseline column, comparator columns, wins/losses/ties, p, flip rate, tau-0.03 split (reported, **no veto**), unmeasured/abstained counts, one verdict line | 35 |
| 17 | `calibrateGate3` | `() → metrics` | R21 increment, run only when verdict is `underpowered`: `jev noul -q 'Does this request require writing a file?'` per `gate3_triggers` row (127 yes / 68 no — BASE; corpus field census confirms `gate3_triggers` is the label field), accuracy/F1/Brier + flip rate, reuses 9-11 | 50 |

Undefined cases BASE's rule leaves open — each needs a line in code:

1. **Gold-first rows can only lose, never win.** A row whose scorer top is already gold: Jev picking gold → tie; Jev picking another member → reciprocal rank falls → loss. Counting those losses in the sign test stacks it against Jev. Fix: the decided universe is **movable rows** (gold in cluster, not first); gold-first rows get a separate printed column `gold_demoted` and the right@3 guard catches real harm. BASE's "each other row scores a win, a loss or a tie" never names the universe.
2. **Gold outside the cluster can only tie.** All cluster members stay ranked above gold, so every outcome is a tie; include them and they dilute nothing (ties are not decided), but the code should still say so rather than rely on the tie semantics.
3. **A comparator with no rows.** `rerank` scores held-out rows only; on a corpus edit where held-out ∩ eligible is empty the "win over each comparator" clause is vacuous — code must print `comparator void: rerank` and treat that clause as failed-open-to-`inconclusive`, never silently satisfied.
4. **All-`none` / modal-`none` rows.** Modal pick `none` = abstained: keeps scorer order, excluded from decided, reported apart (matches 002's abstention semantics, spec.md:137).
5. **Tie on reciprocal rank.** A `tie` is any measured row neither win nor loss — excluded from `decided` by the sign test's own definition; state it, because 002's docs never define win/loss/tie.
6. **Unmeasured rows leave both columns.** Scorer and Jev columns are scored on identical row sets (decided ∪ tie ∪ abstained); unmeasured rows print beside each metric (002 spec.md:138 already says this — keep it).
7. **`includeAllCandidates` asymmetry.** The live cluster rule is what the census must reproduce; the frozen slice's margin rule (`includeAllCandidates: true`) is only for tau membership lookup by row id — do not recompute margins.

### Exact sign-test floor (computed this iteration)

`keep` requires `P(X ≥ wins | decided, p=0.5) < 0.05`. Minimum wins by decided count n: n<5 never; 5→5/5; 6→6/6; 7→7/7; 8→7/8; 9→8/9; 10→9/10; 11→9/11; 12→10/12; 13→10/13; 14→11/14; 16→12/16; 18→13/18; 20→15/20; 24→17/24. **The rule is not "no losses"** — at n≥8 a loss is tolerable; BASE's "at least 5 wins and no loss" is only the entry floor. The code must compute the tail, not a literal no-loss check.

### Test cases and fixtures (maps to 002 plan.md:103-114, extended)

| Case | Fixture | Asserts |
|---|---|---|
| default run | stub `jev` first on PATH that appends argv to a log | log empty; exit 0; census + baseline print |
| baseline mismatch | corpus/env perturbed (or fixture copy) | `baseline mismatch: comparison void`, arm skipped even with `--jev` |
| zero movable | synthetic corpus, no cluster contains gold | `no headroom`; arm never reached |
| 1-4 movable | synthetic corpus | `underpowered`; R21 offer line |
| exit 4 | stub exits 4 on row N | one retry logged, row `unmeasured` |
| exit 2 | stub exits 2 | arm stops, `bad command`, finished rows `partial` |
| foreign key | stub exits 0 with key not submitted | row `unmeasured`, no crash |
| all `none` | stub answers `none` × 3 | row `abstained`, scorer order kept |
| three distinct picks | stub cycles keys A,B,C | row `unstable`, excluded from decided |
| gold-first demotion | stub always picks non-gold member | `gold_demoted` column increments, right@3 guard reports |
| alias gold | corpus row whose gold is an alias of a cluster member | census counts it `movable`, not outside |
| wrong package | stub prints `jevctl 0.2.3` to `--version` | `jev arm skipped: version` + found version + binary path |
| exit 3 mid-run | stub exits 3 after K rows | `jev arm stopped: key rejected`, K rows `partial` |

### Divergences between 002's committed docs and BASE's proposed amendments (found line by line)

| 002 line | Says | BASE amendment | Divergence |
|---|---|---|---|
| spec.md:114 (REQ-004) | census on held-out half + holdout | all 177 + 64 skill-firing rows, both halves (R-b) | scope half missing |
| spec.md:115, plan.md:63 | env list | adds `VITEST=true` (R-d) | **omitted in both** — confirmed |
| spec.md:115, plan.md:64 | alias-aware on holdout only | alias-aware in **every** metric and in census gold-membership (R-c) | held-out MRR/right@k and census exact-match |
| spec.md:122 (REQ-007) | keep = MRR↑ ∧ right@3 not↓ | four-outcome rule: sign test + comparators + flip ≤0.10 (R-a) | unfalsifiable rule still written |
| spec.md:123 (REQ-008), spec.md:33 | stability coefficient ≥0.95 | per-row flip rate ≤0.10 (R-a) | wrong statistic |
| spec.md:124 (REQ-009) | records answer key | + `pickProbability`, `noneProbability` (R-e) | two fields missing |
| spec.md:125 (REQ-010) | exit map | + `unstable` rows, pick-tie assert (BASE Modified) | `unstable` absent |
| spec.md:127 (REQ-012) | gain-only-inside-slice → "not kept" | report split, **no veto** (D4 resolved) | a veto BASE rejected |
| spec.md:131, spec.md:112 | `jev arm skipped: no credential`, `jev arm refused: expected jev 0.6.2` | one form `jev arm skipped: <check>` + found-version + binary-path echo | wording and echo missing |
| spec.md:125 | exit 3 → `partial` | + `jev arm stopped: key rejected` line | stop line missing |
| spec.md:160, tasks | kill = "does not beat on MRR/right@3" | only literal `kill` closes R3; inconclusive/underpowered close nothing | over-broad kill |
| spec.md:78, :114 | `no headroom` at 0 movable | + `underpowered` <5 movable / <5 decided; + R21 conditional scope (entire REQ absent) | fourth outcome and R21 absent |
| spec.md:96, :176 | 150-200 LOC; ≤456 calls ≈$0.05 | 250-320 LOC; ≤723 + R21's 585 (R-f, R-h) | stale size and cost — my table lands ~330, near BASE's top |
| plan.md:71 | `jev choice -q … -o …` with prompt on stdin | transport needs `-s -` to read state from stdin (`cli-usage/SKILL.md:155`) | **missing `-s -` flag — the arm as written sends no state** |
| plan.md:33, tasks.md T004-T011 | census+arm structure | comparators (confidence order, always-second, rerank-held-out) | **all three comparators absent** from plan and tasks |

## Findings

1. **The keep rule's decided-row universe is undefined and asymmetric.** Gold-first rows inject possible losses with no possible wins (finding 1 above); unless the sign test runs over movable rows only, a no-signal judge accumulates losses on rows where winning was impossible. This is a defect in the rule as BASE states it, found by tracing reciprocal rank through the reorder operation — new against BASE.
2. **002's committed docs still carry the rule the council rejected.** Every BASE amendment R-a through R-h is absent: the unfalsifiable keep rule (spec.md:122), the 0.95 coefficient (spec.md:123), the tau veto (spec.md:127), no comparators, no R21, no `underpowered`. The phase cannot be implemented as committed; the amendment list in BASE §13 is the real spec.
3. **plan.md:71's `jev choice` invocation omits `-s -`.** The transport reads state via `-s` (text, `@file`, or `-` for stdin, `cli-usage/SKILL.md:155`); as written the arm would send a question with no state. One flag, caught here before the build.
4. **`applyAmbiguity` membership is directly readable.** `recommendations.filter(r => Array.isArray(r.ambiguousWith))` returns the cluster; no need to recompute margins — but `includeAllCandidates` must NOT be passed, or the census measures a different cluster than live (`fusion.ts:785-789` pipeline order confirmed).
5. **Alias-aware matching must reach the census, not only the metrics.** A gold labeled under a folded id inside the cluster reads as "gold outside cluster" under exact match — undercounting movable rows at the census stage, where undercounting can print `underpowered` and skip the arm entirely. `mergedSkillForAlias`/`skillMatchesAlias` are importable (`capture-scorer-eval-baseline.mjs:49`).
6. **The sign test needs the exact tail, not "no losses".** Min-wins table above; at decided ≥ 8 the "no loss" intuition is wrong (7/8 passes at p=0.0352). `underpowered` at decided < 5 is confirmed correct (n=4 best possible p=0.0625).

## Ruled Out

- **Scoring the sign test over all eligible rows** — gold-first/gold-outside asymmetry makes the deck unfair; decided = movable rows, with `gold_demoted` reported apart.
- **Recomputing tau-0.03 margins for census membership** — the frozen slice is an id set (`derive-ambiguity-slice.mjs:77-86`); recomputing under `includeAllCandidates` measures a different margin than the live cluster rule.
- **Extracting shared metric code from the eval** — it exports nothing and runs on import (`score-outcome-rerank.mjs:159`); copying ~35 lines is the correct call (002 plan.md:59 agrees).
- **`includeAllCandidates: true` in the census scorer call** — measures a non-live cluster.

## Questions Answered

- Function list, signatures and LOC: table above, ~330 LOC + ~50 for R21.
- Imports from `dist`: `scoreAdvisorPrompt`, `loadAdvisorProjection`, `outcomeWeightedRerank`, `mergedSkillForAlias`, `skillMatchesAlias`, `findAdvisorWorkspaceRoot`; eval functions copied because the eval exports nothing (`loadCorpus`, `reciprocalRank`→`rrAlias`, `inTopK`→`inTopKAlias`, `scoreOrdering`, `buildFold`, `betaMean` ≈ 90 LOC copied).
- Undefined cases named: 7 (finding 1 list).
- 002 divergences: 15 rows above.
- LOC: ~330 (over BASE's 250-320, driven by comparators + exact sign test); R21 +~50.

## Questions Remaining

- Does `scoreAdvisorPrompt` return `recommendations` post-`applyAmbiguity` for a direct call (confirmed from `fusion.ts:789` — but worth a smoke assertion at script start: a synthetic near-tie prompt produces `ambiguousWith` fields)?
- Where do provider/model fields live in a `choice` JSON answer — readable at build time from one `auth test`/`choice` output (002's open question stands).
- Whether `passes_threshold` on the top rec can differ between eval env and live env in a way that changes the cluster (assumed same env; flagged).

## Hand-off

- swe-02 should reuse the pattern: copy-don't-import for read-only scripts, alias-aware membership tests, and the exit-map contract.
- The `gold_demoted` guard column and the movable-rows-only decided set are the two fixes the 002 amendment must carry that BASE did not enumerate.
- The `-s -` stdin flag and the three missing comparators are the concrete defects to hand the phase-002 amendment.
- Sign-test implementation: precompute the min-wins table or compute the tail inline; assert `decided < 5 → underpowered` before the test.

## Assessment

- `newInfoRatio`: `0.85`
- Novelty justification: named the keep rule's asymmetric decided-universe defect (new), produced the exact sign-test min-wins table (new), found the missing `-s -` stdin flag in 002's planned invocation (new), enumerated 15 concrete doc divergences with lines (new), and confirmed corpus counts independently (177/64/19 skill-firing).
- Confidence: high on code structure and divergences; medium on LOC estimate (±15%); the sign-test table is exact.

## Sources Consulted

- `score-outcome-rerank.mjs`, `capture-scorer-eval-baseline.mjs`, `derive-ambiguity-slice.mjs` (routing-accuracy scripts, whole files)
- `ambiguity.ts`, `fusion.ts:749-799` (scorer lib)
- `benchmark-stability.cjs:86-108`
- `002-advisor-jev-tiebreak-arm/{spec,plan,tasks}.md` (whole files)
- `cli-usage/SKILL.md` (grep: `choice` cardinality, `-s` contract)
- `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` (counts only)
- BASE `research.md` §4, §11 R1/R21, §13 002 amendments (baseline, not reopened beyond named lines)
