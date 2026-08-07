# Research Synthesis (lineage dq-automation-impl): the build-ready implementation of the keystone DQ automations

<!-- ANCHOR:dq-automation-impl-index -->
Fan-out lineage `dq-automation-impl` under packet 003-spec-data-quality. The parent converged on the **truncation law**; `dq-deep` named the keystones **A1/B1/B2/B3/C2**; `dq-probe` named the **DQI scorer**; `dq-skilldoc-cmd-ctx` named the **empty cron tier** and per-surface detectors. Every prior lineage answered *what to do*. This lineage answers *how to build it* — the exact files, exported functions, hook lines, env flags, timing, rollback, and rollout order for those five named keystones. The unit is an implementation design, not a verdict. The truncation law and the tiering are inherited as settled and are NOT re-derived.

## 1. Executive finding: the program is a wiring job over two existing machineries plus one new gate

Reading the live code at file:line dissolves most of the "build" into reuse, and isolates the genuinely new work to three small artifacts:

1. **There are TWO quality machineries with opposite safety profiles, and the obvious one is the wrong one to extend.** `quality-loop.ts` (`runQualityLoop:582`) is a verify-**fix**-verify loop whose `attemptAutoFix` **trims content by `substring` (`:463-468`, 8000-char budget at `:82-85`)** — destructive on any 8KB+ authored doc (the 005 spec.md is 10.6KB). `post-save-review.ts` (`reviewPostSaveQuality:573`) is a **non-mutating** severity reviewer with a composite blocker (`:1041`). **The whole A1 design hinges on reusing the PURE scorer (`computeMemoryQualityScore:392`) + the non-mutating reviewer, and never running the destructive loop on an authored body.** dq-deep's literal "extend quality-loop.ts" is the wrong machine.

2. **The retrieval-measurement instrument already exists.** `scripts/evals/run-eval-v2.mjs` already computes **prod-mode completeRecall@3 in dual-mode** (eval path vs prod path on the same copy DB) and reports the **eval-vs-prod fidelity delta** — the exact promotion instrument the parent's "unblock condition" demands. C2 is therefore not "build a harness"; it is "author a spec-corpus golden set + add a baseline regression gate" (the gate genuinely does not exist — verified: `run-eval-v2.mjs:357` is an error-catch, not a recall verdict).

3. **The negative-feedback signal does not exist and must be captured.** `learned-feedback.ts` implements only the POSITIVE edge (`recordSelection:257`, learn from a selected result). There is no impression/never-retrieved telemetry (grep empty). B3's new work is capturing that signal and splitting it by the floor.

The honest headline: **A1/B1/B2 are floor-bypassing write-time wins that ship on cost via one shared engine; C2 is a small but real new gate; B3 is new telemetry + a report-only queue. The retrieval half stays frozen behind C2 — exactly the parent's doctrine, now with a build sequence.**

## 2. The five keystones, build-ready

### A1 — extend the quality machinery to the authored + metadata-JSON write surface
- **Reuse:** the pure scorer `computeMemoryQualityScore` (`quality-loop.ts:392`, exported `:747`) + the non-mutating `reviewPostSaveQuality` (`post-save-review.ts:573`).
- **Seams (verified, two files):** H1 metadata-JSON scoring at `generate-context.ts:398 atomicWriteJson`; H2 authored-body advisory review at `core/workflow.ts:1854` (where `reviewPostSaveQuality` already runs); H3 a new `CONTENT_QUALITY` rule in `validate.sh` (mirror `:832 run_continuity_freshness_check`) registered in `validator-registry.json` (alongside the warn-only `DESCRIPTION_SHAPE`/`GRAPH_METADATA_SHAPE` at `:192-206`).
- **Scorer transfer:** triggers/anchors/coherence transfer; budget is ADVISORY ONLY (8KB ceiling is wrong for specs); `attemptAutoFix` is HARD-EXCLUDED. The only safe body mutation is a separate length-neutral fence-aware HVR linter, opt-in `--fix`.
- **Timing:** on-write (H1 sync JSON checks, H2 advisory body score) + retroactive (H3). **Rollback:** single-commit revert of hooks; additive scorer modules dormant if unwired.

### B1 — the standing scheduled DQ sweep with a guarded auto-fix tier
- **Scheduler:** PRIMARY = new `.github/workflows/dq-corpus-sweep.yml` on `{schedule: cron, workflow_dispatch}` (the empirically-empty tier; 8 existing workflows are all `on: pull_request`), report-only in CI. SECONDARY = opt-in `.opencode/scripts/git-hooks/post-merge` (zero installer change — `install-git-hooks.sh:42-52` already globs the hook dir), advisory.
- **Runner:** new `scripts/sweep/dq-sweep.ts`, a thin caller over the A1 detectors + `validate.sh --recursive` (`:955`), with the backfill report contract verbatim (`--dry-run` default / `--apply` / `--report` / `--roots` / `--limit`, `backfill-frontmatter.ts:131-144`).
- **Safe-vs-risky:** a frozen **deny-by-default `fixClass` allow-list**. `safe` = deterministic, length-neutral, metadata-only (HVR swaps, anchor close, enum case-normalize, frontmatter→description trigger propagation). `risky`/`none` = report-only. **Invariant: a fix touching an authored BODY is never `safe`.**
- **Idempotency:** skip-if-conformant + content_hash guard (`memory-save.ts:546`) + atomic writes (`generate-context.ts:398`) + batched git commits. **Rollback:** delete workflow; `--uninstall` hook; `git revert` fix batches.

### B2 — the /doctor auto-remediation tier
- **Bolt-on:** append a `data-quality` route to `_routes.yaml` modeled on the **`code-graph`** route (read-only diagnostic + `--operation`/`--dry-run`/`--confirm` mutate tier, `_routes.yaml:79-84`), NOT on read-only `memory`. Author `doctor_data-quality.yaml` reusing `doctor_memory.yaml:65-94`'s `mutation_boundaries`+`validate_targets` machinery, INVERTED (allow the JSONs/docs, forbid the DBs).
- **Detectors:** DIAGNOSE (default, report) vs APPLY (`--confirm`, safe tier only). `--confirm` unlocks the `safe` tier, never the `risky` tier.
- **Factoring:** B2 is the interactive front door over the B1 engine — one `dq-engine.ts`, three front doors. **Rollback:** delete route + asset, re-run `route-validate.py`.

### B3 — the retrieval-learning feedback edge
- **The floor splits the signal:** edge (a) never-appeared = recall gap, write-time-fixable, BYPASSES the floor; edge (b) appeared-but-below-3 = truncation casualty, retrieval-class, PAYS the floor and is C2-gated. The discriminator is `min_rank_seen` (any impression ⇒ edge b).
- **Seams:** (1) capture impressions at the result-assembly seam into a `retrieval_impressions` aggregate (non-FTS5, async, mirror `learned-feedback.ts:103-113`); (2) `scripts/memory/detect-retrieval-gaps.ts` computes the gap set reusing `isMemoryEligible:181`/`isInShadowPeriod:422`; (3) a `refinement_queue` table (mirror the audit schema + a status col) that B1/B2 surface as REPORT-ONLY, edge-tagged.
- **Gate:** `SPECKIT_RETRIEVAL_GAP_DETECT` default-OFF. B3 queues; it never refines. **Rollback:** `clearRefinementQueue` (the `clearAllLearnedTriggers:577` analogue); no doc was ever mutated.

### C2 — the prod-mode completeRecall@3 benchmark + regression loop (the unblocker)
- **Engine exists:** `run-eval-v2.mjs` already does prod+eval dual-mode completeRecall@3/5/8 over multi-target classes with a fidelity delta, read-only via copy DB (`:5-26,38-50,233-238`). `computeCompleteRecallProfile` (`eval-metrics.ts:408`) is the primitive.
- **New work (two artifacts):** C2-1 `spec-corpus-golden.json` (generator-derived multi-target queries over real packets — the shipped goldens are single-target and saturate); C2-2 `run-spec-recall-gate.mjs` + a committed `spec-corpus-baseline.json` porting the `skill_advisor_bench.py:248` blocking-gate pattern (PROMOTION: prod@3 must RISE; REGRESSION: fail on prod@3 drop). The gate reads ONLY the prod column.
- **Role:** C2 is the single promotion path for every retrieval-class item (A1 prefix, B3 edge-b, fusion). Built BEFORE the retrieval candidates. **Rollback:** additive files; the harness is unchanged.

## 3. The shared architecture (one engine, three front doors, one registry)

`detector-registry.ts` (each entry `{id, surface, detect, fixClass, fix?}`, frozen deny-by-default allow-list) + `dq-engine.ts` (`runDetectors(target, {mode, allowFixClass:['safe']})`, reuses the shipped scorers, content_hash idempotency, atomic writes). Three front doors call it: **A1** (on-write, report-only), **B1** (scheduled/headless, report + operator-local safe-apply), **B2** (interactive, report + `--confirm` safe-apply). **B3** is a detector feeding a report-only queue. **C2** is the gate every `risky`/retrieval detector's promotion must pass. This is the literal instantiation of every prior lineage's "one safe-fix engine, reuse-first, no new lane."

## 4. End-to-end rollout (the safety property is the order)

| Stage | Keystone | Lands as | Rollback |
|---|---|---|---|
| 0 baseline census (report-only engine over corpus) | A1 | read-only | none |
| 1 `dq-engine.ts` + `detector-registry.ts` + pure scorers | A1 | dormant | delete modules |
| 2 wire A1 H1/H2/H3 | A1 | WARN-only | revert hooks |
| 3 `dq-sweep.ts` + `dq-corpus-sweep.yml` | B1 | report-only CI | delete workflow |
| 4 safe-fix executors + allow-list; local `--apply` safe | B1 | safe-apply local | `git revert` batch |
| 5 `/doctor data-quality` (DIAGNOSE→APPLY `--confirm`) | B2 | report→safe | drop route |
| 6 flip JSON/enum/shape to `--strict` error; drop legacy bypass | A1 | ERROR | revert to warn |
| 7 B3 impression capture (default-off) accrues a window | B3 | telemetry-only | flag off |
| 8 `spec-corpus-golden.json` + capture baseline | C2 | measurement | revert files |
| 9 `run-spec-recall-gate.mjs` (PROMOTION+REGRESSION) | C2 | gate live | delete gate |
| 10 `detect-retrieval-gaps.ts` + `refinement_queue`, surfaced report-only | B3 | report-only | clear queue |
| 11 retrieval candidates (prefix/edge-b/fusion) default-off, promoted via C2 only | CONDITIONAL | default-off | version fallback |

Stages 0-6 ship the floor-bypassing half on cost. Stages 7-11 build the measurement (C2) FIRST, then touch the retrieval half — the parent's doctrine, sequenced.

## 5. The two hard rails (survived adversarial verification)

1. **No body-mutating auto-fix.** Structural: the `fixClass` registry makes body-touching ⇒ never `safe`; the `computeAuthoredDocQuality` wrapper throws on `full-auto`; `quality-loop.ts:463-468` budget-trim stays quarantined to memory-save.
2. **No retrieval promotion without a prod@3 read** — and that gate (C2-2) is real net-new code, not a flag flip (verified: `run-eval-v2.mjs:357` is an error-catch, the harness reports but does not gate).

## 6. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iter |
|---|---|---|---|
| Extend `runQualityLoop` wholesale onto authored docs (dq-deep's literal A1) | `attemptAutoFix` substring budget-trim amputates 8KB+ docs | `quality-loop.ts:463-468,82-85` | 1 |
| Build a new reviewer for description.json | `reviewPostSaveQuality` already has the contract + blocker | `post-save-review.ts:573,1041` | 1 |
| Gate on the token-budget sub-score for authored docs | wrong ceiling; advisory only | `quality-loop.ts:82-85` | 1 |
| post-merge hook as the PRIMARY sweep trigger | per-dev/unenforced; corpus property needs CI `schedule:` | `.git/hooks/pre-commit` advisory | 2 |
| CI that auto-commits fixes | corpus-wide blast radius; CI stays report-only | design | 2 |
| Per-detector ad-hoc safe/risky flags | classification is a property of the FIX; deny-by-default allow-list | parent net-negative rail | 2 |
| Mutate `doctor_memory.yaml` to add a fix tier | read-only by contract; DBs are its targets; add a new route | `doctor_memory.yaml:21-27` | 3 |
| `--confirm` unlocks risky fixes | risky/none always report-only; `--confirm` gates only safe | parent rail | 3 |
| Derive never-retrieved from `learned_feedback_audit` alone | selection != impression | `learned-feedback.ts:257-341` | 4 |
| Treat all never-retrieved as one fixable class | the floor splits edge-a (bypass) vs edge-b (pays) | parent truncation law | 4 |
| Build a new prod-mode @3 harness | `run-eval-v2.mjs` already does prod+eval dual-mode @3 | `run-eval-v2.mjs:5-26` | 5 |
| Reuse the single-target goldens for C2 | they saturate and hide wins | `run-eval-v2.mjs:5-9` | 5 |
| Five separate per-surface fix engines | would diverge in classification; one engine + one registry | prior-lineage one-engine rule | 6 |
| Treat `run-eval-v2.mjs:357` as an existing regression gate | it is the uncaught-error catch, not a recall verdict | `run-eval-v2.mjs:351-358` | 7 |

## 7. Prove-First Caveats

This is an implementation DESIGN, not a build. Nothing here is shipped.
- **Confirmed by file:line:** the two-machinery split, the A1 seams (`generate-context.ts:398`, `workflow.ts:1854`, `validate.sh:832`), the scheduler-tier emptiness, the `fixClass` reuse basis, the doctor route contract, the absent negative-signal, the existing dual-mode harness, the truncation floor (`confidence-truncation.ts:35`), and the two corrections from iter 7.
- **Asserted, not counted:** the per-detector corpus-wide failure counts (Stage-0 census, deferred to a build) and the actual write-latency of on-write A1 scoring on a large spec (inherited open Q).
- **Hypothesis-until-prod-measured:** every retrieval-class item (A1 header-prefix, B3 edge-b, metadata fusion) stays frozen until C2's gate reads a prod-mode completeRecall@3 RISE — never the eval column.

## 8. Convergence Report
- **Stop reason:** converged / all_questions_answered (KQ1-KQ6 resolved with file:line seams; adversarial pass complete with 2 confirmations + 2 corrections, no verdict overturned).
- **Total iterations:** 7.
- **Questions answered:** 6/6 key questions; 2 open questions deferred to a build (Stage-0 census counts; on-write latency on large specs).
- **newInfoRatio trend:** 0.90 → 0.82 → 0.70 → 0.74 → 0.66 → 0.55 → 0.22 (descending; two insight iterations at 4 and 5; one verification at 7).
- **Quality guards:** source diversity PASS (quality-loop, post-save-review, generate-context, validate.sh, validator-registry, install-git-hooks, backfill, doctor_memory, _routes.yaml, route-validate, learned-feedback, run-eval-v2, eval-metrics, confidence-truncation, workflow.ts — independent file:line sources); focus alignment PASS (every finding is build-ready HOW, not WHAT); no-single-weak-source PASS.

## References
- Parent: `../../research.md` (truncation law). Siblings: `../dq-deep/research.md` (named A1/B1/B2/B3/C2), `../dq-probe/research.md` (DQI scorer), `../dq-skilldoc-cmd-ctx/research.md` (empty cron tier, per-surface detectors).
- A1: `quality-loop.ts:82-85,392,463-468,747`; `post-save-review.ts:573,1041,1077`; `generate-context.ts:398`; `core/workflow.ts:1854-1860`; `validate.sh:832,420`; `validator-registry.json:192-206`.
- B1: `.github/workflows/` (8 files, no schedule); `install-git-hooks.sh:42-52`; `.git/hooks/pre-commit`; `validate.sh:955`; `backfill-frontmatter.ts:131-144`; `memory-save.ts:546`.
- B2: `_routes.yaml:79-90`; `route-validate.py:7-21,46`; `doctor_memory.yaml:65-94`.
- B3: `learned-feedback.ts:103-113,169,181,257-341,422,523,577`.
- C2: `run-eval-v2.mjs:5-26,38-50,233-238,307,351-358`; `eval-metrics.ts:372,408`; `skill_advisor_bench.py:248,306`; `context-recall-golden.json`.
- Floor: `confidence-truncation.ts:35,106`.

(`resource-map.md` not present at init; no coverage gate cited.)
<!-- /ANCHOR:dq-automation-impl-index -->
