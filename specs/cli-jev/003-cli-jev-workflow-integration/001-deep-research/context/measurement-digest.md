# Measurement Digest

## 1. How to use this digest

Every Jev recommendation must name a metric, a baseline and a harness. Pick the harness from section 2 whose metric matches the decision Jev would make, quote its baseline with the citation given, and state the A/B or shadow design.

If no harness fits, the recommendation belongs in section 3 as a gap, and the smallest harness named there is part of its first slice.

Citations are repo-relative `path:line` and were opened while writing this digest. Lines marked "inferred" were not confirmed by running anything. No harness was run for this digest, so run cost and time are inferred unless a report records them.

## 2. Harnesses

### H1. Advisor scorer-eval baseline ratchet

- **Measures.** Top-1 routing accuracy over the full labeled corpus, the independent holdout, the frozen ambiguity slice and three intent buckets, held exactly to a committed baseline (`.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:5-14`). A drop fails, and a gain must be recaptured into the baseline. Fixture hashes are pinned so a corpus edit forces a re-baseline (`...scorer-eval-baseline-ratchet.vitest.ts:11-12`). Release floors sit underneath: 0.75 full corpus, 0.725 holdout (`...scorer-eval-baseline-ratchet.vitest.ts:29-30`).
- **Corpus.** `labeled-prompts.jsonl` (195 rows), `holdout-prompts.jsonl` (70), `ambiguity-prompts.jsonl` (24), read from `scripts/routing-accuracy/` (`...scorer-eval-baseline-ratchet.vitest.ts:69-74`). Row counts come from a `wc -l` run for this digest. Each row carries `skill_top_1`, `bucket` and Gate 3 labels (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1`).
- **Run.** `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts`, the same step CI runs (`.github/workflows/routing-registry-drift.yml:247-250`). The test sets its own reproducible env: empty DB dir, built-in semantic lane off, force-local, shadow lanes cleared (`...scorer-eval-baseline-ratchet.vitest.ts:100-105`). Recapture with `node capture-scorer-eval-baseline.mjs --write` (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:16-18`).
- **Baseline** (captured 2026-09-23 at `2dbaa8fd66`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:3-4`):
  - full corpus top-1 152/195 = 0.7795; unknown 13; gold-none false fires 5 (`scorer-eval-baseline.json:14-24`)
  - holdout top-1 53/70 = 0.7571 (`scorer-eval-baseline.json:25-29`)
  - ambiguity top-1 18/24 = 0.75 at margin tau 0.03 (`scorer-eval-baseline.json:30-35`)
  - buckets: review 24/31, memory_save 27/32, delegation 9/9 (`scorer-eval-baseline.json:36-51`)
- **Headroom for a tie-break.** An older capture recorded full-corpus top-3 at 176/195 = 0.9026 against top-1 151/195 (`specs/sk-doc/z_archive/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/routing-baseline.json:35,59`). A reranker that only reorders the top 3 can gain at most about 24 rows on that capture. It used a 72-row holdout, not today's 70, so treat it as a ceiling estimate, not a baseline.
- **Cost.** Local, deterministic, no model calls. Inferred: seconds to a minute.
- **Jev A/B (inferred).** Wrap the scorer so that when the top-2 margin is under tau 0.03, `jev choice` picks among the top 2 or 3 skill ids. Score both arms on the ambiguity slice and holdout only. The holdout is the honest arm, because the slice was chosen by low margin. Never write the Jev arm into the ratchet baseline: it calls a network model and is not deterministic.

### H2. Outcome-weighted rerank eval (MRR and right@3)

- **Measures.** Whether a reranker beats the similarity-only order, reported as MRR and right@3, not @1 alone, because a near-tie reorder mostly moves a skill one rank (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:6-10`). It trains on one split and measures only on a disjoint held-out split (`score-outcome-rerank.mjs:17-19`). The metric returns `mrr`, right@1 and right@3 (`score-outcome-rerank.mjs:95,108`).
- **Run.** `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs`. It imports the built `dist` scorer (`score-outcome-rerank.mjs:38`), so the runtime must be built first.
- **Baseline.** UNKNOWN. No recorded output was found for this digest. The first run of the baseline arm produces it.
- **Jev A/B (inferred).** This is the closest existing template for a Jev tie-break. The rerank arm is one function over candidates (`score-outcome-rerank.mjs:125-132`). A Jev arm replaces it with a `jev choice` over the candidate ids and keeps the same split, so MRR and right@3 are directly comparable.

### H3. Routing corpus gate with Gate 3 classifier F1

- **Measures.** Two decisions on the same 195 prompts: advisor accuracy in CI's no-sqlite fallback regime, and the Gate 3 write classifier (does this prompt write a file) as precision, recall and F1, plus a joint table (`.github/workflows/routing-registry-drift.yml:251-262`).
- **Run.** `python3 scripts/routing-accuracy/score-routing-corpus.py --dataset "$PWD/scripts/routing-accuracy/labeled-prompts.jsonl" --min-advisor-accuracy 0.5333 --min-gate3-f1 0.9843 --min-joint-tt 101 --max-joint-ft 3 --max-joint-ff 1 --require-historical-clean` from the advisor runtime (`.github/workflows/routing-registry-drift.yml:284-291`). CI first checks corpus hashes against the pinned baseline (`routing-registry-drift.yml:269-282`). The classifier alone runs through `gate3-corpus-runner.mjs <labeled-prompts.jsonl>` (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/gate3-corpus-runner.mjs:9-13`), which needs the built shared `dist` (`gate3-corpus-runner.mjs:7`).
- **Baseline.** Gate 3 precision, recall and F1 all 0.9843 (tp 125, fp 2, fn 2, tn 66); advisor accuracy 0.5692; joint TT 108, FT 3, FF 1 (`specs/sk-doc/z_archive/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture/baseline/routing-baseline.json:48-53`).
- **Cost.** Local, deterministic. Inferred: under a minute.
- **Jev A/B (inferred).** Gate 3 is a regex classifier that already scores 0.9843 F1, so a `jev noul` "does this prompt write a file" arm has at most 4 errors to fix on this corpus. Useful as a negative control and a cost check, weak as a build target.

### H4. Local-versus-native divergence ratchet

- **Measures.** Top-1 disagreement between the Python and TypeScript scorers over a union corpus, ratcheted against an approved-divergence ledger (`.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:5-13`). Abstention is normalized to `"none"` on both sides (`local-native-divergence-ratchet.vitest.ts:26-28`).
- **Run.** `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` from the advisor runtime (inferred from the package script `vitest run`, `.skilled/skills/system-skill-advisor/runtime/package.json:11`). It shells out to Python.
- **Baseline.** The ledger `tests/parity/fixtures/local-native-approved-divergences.json` (listed, not opened).
- **Jev use (inferred).** The divergent prompts are a ready-made hard set: the two scorers disagree, so a third opinion is at least testable there. It needs gold labels before it can score anyone.

### H5. Advisor shadow sink and shadow lanes

- **Measures.** Nothing by itself. It appends live-versus-shadow deltas as JSONL (`.skilled/skills/system-skill-advisor/runtime/tests/shadow-sink.vitest.ts:19-27`), enabled by `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED` (`.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:86,152-153`). Shadow lane weights and a BM25 shadow lane already use the same pattern (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:27,38`).
- **Baseline.** None. It is a collection surface.
- **Jev shadow (inferred).** The natural opt-in seam: run Jev beside the live scorer, log both picks and never serve Jev's. Scoring the log still needs gold, which H1 or H2 supply offline.

### H6. Gate-2 golden prompts

- **Measures.** Pinned top-1 or top-3 skill for labelled prompts, plus the compiled `workflowMode` for hubs that serve compiled routes (`.skilled/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts:5-9`). Scorer runs unmocked in the force-local regime (`routing-golden-prompts.vitest.ts:11-15`).
- **Run.** `npx vitest run tests/routing-golden-prompts.vitest.ts` from the advisor runtime (`.github/workflows/routing-registry-drift.yml:234-238`).
- **Baseline.** Pass or fail per case. Numeric pass count not recorded here.

### H7. Compiled routing: canary fixtures, admission and guard

- **Measures.** Admission scores each hub's compiled decisions against the routing gold in its own playbook (`.skilled/bin/lib/compiled-route-admission.cjs:6-10`). Negative, `UNKNOWN` and `defer` gold pass only when the engine does not route, and concrete gold fails on any non-route decision including `clarify` (`compiled-route-admission.cjs:15-17`). The guard reports stale manifests and authored drift (`.skilled/bin/compiled-route-guard.cjs:13-17`).
- **Canary fixtures.** Seven hubs carry `canary-cases.v1.json` under `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/`. Across them a grep counted 62 `route`, 10 `defer`, 9 `reject` and 3 `clarify` expectations. The cli-jev set has 11 cases, including zero-signal `defer` rows (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/fixtures/canary-cases.v1.json:70-72`).
- **Run.** `node .skilled/bin/compiled-route-admission.cjs --all --json` (usage at `.skilled/bin/compiled-route-admission.cjs:14-21`; exit 0 pass, 1 fail, 2 usage). `node .skilled/bin/compiled-route-guard.cjs --json` (`.skilled/bin/compiled-route-guard.cjs:21-24`). CI runs both (`.github/workflows/routing-registry-drift.yml:168,176`).
- **Baseline.** Per-hub pass or fail. No numeric clarify or defer accuracy is recorded.
- **Cost.** Local, deterministic. Inferred: seconds.
- **Jev A/B (inferred).** Only 13 clarify and defer rows exist across all hubs, too few to show a Jev clarify-or-route judgment beats the engine. The fixtures show the shape a larger gold set would take.

### H8. cli-jev hub routing and transport playbook runs

- **Measures.** Pass or fail per playbook scenario. The latest hub-routing run: 3 PASS, 0 FAIL, 0 SKIP, with out-of-domain prompts answering `action: defer` (`.skilled/skills/cli-jev/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/skill-benchmark-report.md:38-44`). The transport run: 22 PASS, 0 FAIL, 0 SKIP (`.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md:48`).
- **Recorded Jev behavior.** One live judgment per type exited 0: `noul` printed `0.95`, `choice` returned `billing` with probabilities, `score` printed `2.0` (`.../2026-09-20-post-migration-reverification/skill-benchmark-report.md:75`). The dispatch audit suite ran 75/75 (`same file:70`), and the credential-leak check found 0 hits (`same file:64`).
- **Run.** The raw scripts sit beside each report, for example `raw/hub-routing-run.sh` and `raw/probe-matrix.sh` (listed, not opened).
- **Gap.** These prove Jev runs and never leaks a key. None records latency, cost per call or judgment accuracy.

### H9. Deep-improvement model-benchmark (Lane B) with LLM grader

- **Measures.** A model or prompt framework against held-out oracles on a 5-dimension scorer (`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:8-21`). The D4 grader is pluggable: `llm` (real Claude), `mock` or `noop`, default `mock` (`score-model-variant.cjs:20-21`). The LLM grader dispatches through the Claude CLI only (`.../scorer/grader/harness.cjs:8-10`). A dispute hook escalates to a second skeptic call when grader confidence is under 0.7 or the dispute rate over three iterations exceeds 0.15 (`.../scorer/grader/dispute.cjs:12-19`). The runner enforces a different-family grader and N-sample aggregation (`.../model-benchmark/run-benchmark.cjs:16-17`).
- **Reviewer fixtures.** Reviewer-prompt fixtures carry an expected verdict of `pass`, `fail` or `block` and expected findings, with visible and hidden cases (`.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:20,59-66`). Four reviewer fixtures and a `reviewer-regression.json` profile exist (listed).
- **Run.** `node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--scorer pattern|5dim] [--grader noop|mock|llm] [--samples <n>]` (`.../model-benchmark/run-benchmark.cjs:582`), or `/deep:model-benchmark`.
- **Baseline.** UNKNOWN for grader agreement. No recorded grader-versus-oracle agreement was found.
- **Cost.** `llm` grader means one or two Claude calls per graded output. Inferred: minutes per profile.
- **Jev A/B (inferred).** The best seam for RQ1. Add a `jev` grader kind beside `llm`, `mock` and `noop`, run both on the same outputs, and report agreement with the hidden oracle plus cost and latency per grade. Reviewer fixtures give a three-way `jev choice` target with gold already written.

### H10. Deep-loop behavior benchmark

- **Measures.** One scenario against one executor leg, scored on five dimensions: D1 invocation, D2 presentation, D3 delegation, D4 completion, D5 latency against baseline (`.skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:121-160`). A scored failure is still a runner success, and exit 75 marks a provider quota rejection (`.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:4-7,17-21`).
- **Run.** `node .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs --scenario <file> --leg <leg> --out-dir <dir>` (`behavior-bench-run.cjs:1095-1096,1486`).
- **Baseline.** 32 scenario contracts and about 120 scored live runs across three legs (`specs/system-deep-loop/z_archive/027-deep-loop-behavior-benchmarks/005-scorecard-and-integration/scorecard.md:3`). The runs were single-sample, and contested cells owe 3-sample reruns before rates are quoted (`.../005-scorecard-and-integration/implementation-summary.md:93`).
- **Cost.** Live CLI runs. Inferred: minutes per cell and real provider spend.
- **Jev use (inferred).** Measures whole-workflow behavior, not a single judgment. It could show whether a Jev stop rule shortens loops (D5) without hurting completion (D4), at high cost per sample.

### H11. Deep-research convergence telemetry (newInfoRatio)

- **Measures.** Three weighted stop votes: rolling average of the last three `newInfoRatio` values below `convergenceThreshold` (weight 0.30), MAD noise floor (0.35) and question-entropy coverage of at least 0.85 (0.35) (`.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:41-47`). The default threshold is 0.05 (`.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:4`). The reducer warns when `newInfoRatio` sits flat at 0.9 or higher, because the signal is then uninformative (`.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:965-985`).
- **Run.** Read from each lineage's `deep-research-state.jsonl` and dashboard after a run. No standalone scorer exists.
- **Baseline.** None as an accuracy number. No gold says when a loop should have stopped.
- **Jev shadow (inferred).** Replay recorded state files, ask `jev noul` "is this research exhausted" per iteration, and compare the first Jev stop with the recorded stop and with the iteration after which no new cited finding appeared. That comparison point is itself a gap (section 3).

### H12. Goal hook verifier tests

- **Measures.** Behavior of `verifyGoalHeuristic`, a regex supervisor: blocking words give `not-met`, a completion word tied to objective keywords gives `met` at a fixed confidence 0.72, anything else `unclear` (`.skilled/hooks/goal/README.md:46`; `.skilled/hooks/goal/lib/goal-core.cjs:132-133,596,619`). Three verifier tests cover met, not-met and unclear (`.skilled/hooks/goal/lib/goal-core.test.cjs:631-651`).
- **Run.** `node --test .skilled/hooks/goal/lib/goal-core.test.cjs` (inferred from the `node:test` style `test(` calls; 74 tests counted by grep).
- **Baseline.** Tests pass or fail. No labeled transcript set measures verifier accuracy.
- **Jev A/B (inferred).** A `jev noul` "is the goal met" arm is the most natural replacement for a hard-coded 0.72. It cannot be measured until labeled transcripts exist.

### H13. sk-communication reply harness (blinded A/B)

- **Measures.** Before-and-after reply quality over a frozen case set with a seven-dimension rubric and a negative control (`.skilled/skills/sk-communication/benchmark/reply-harness/README.md:7-8`). `blind.mjs` masks provenance for a judge, and `compare.mjs` fails when the control moves (`README.md:11-12`). No script calls a model (`README.md:3`), and the judge scores by `rubric.json` outside the scripts (`README.md:20`).
- **Run.** `generate-prompts.mjs`, then `score.mjs`, `blind.mjs` and `compare.mjs` in order (`README.md:17-21`).
- **Jev use (inferred).** The blinded judge slot is empty today. A Jev judge scoring the masked replies per dimension, checked against a human pass on a subset, is a direct RQ1 grading test.

### H14. Blinded adjudication service (deep-loop runtime)

- **Measures.** A counterfactual verdict comparing a baseline judgment with a policy-linked intervention, without exposing candidate identity (`.skilled/skills/system-deep-loop/runtime/lib/blinded-adjudication/README.md:12`). It has a deep-review adapter for validity and severity comparisons (`README.md:26`). Tests: `runtime/tests/unit/blinded-adjudication.vitest.ts` (`README.md:43`).
- **Baseline.** None. It is infrastructure, described as additive-dark (`README.md:12`).
- **Jev use (inferred).** A place to run a Jev severity call beside the reviewer's without either seeing the other, for finding triage.

### H15. Retired skill-benchmark runner (reference only)

The mode-A and mode-B skill-benchmark reports record aggregates, for example system-deep-loop CONDITIONAL 71/100 (`.skilled/skills/system-deep-loop/benchmark/reports/baseline/skill-benchmark-report.md:5`). D4 usefulness stayed unscored in router mode (`same file:20-23`). The harness was retired, so no report can be reproduced from the current tree (`.skilled/skills/system-deep-loop/benchmark/README.md:58`). Do not name it as the harness for a new recommendation.

### Playbooks in general

A tracked-file listing found 83 `manual-testing-playbook.md` roots. Run records land as dated report folders under each skill's `benchmark/reports/` (`.skilled/skills/cli-jev/benchmark/README.md:12`). They record PASS, FAIL or SKIP per scenario, never a graded quality score, so they fit a Jev "grade this playbook verdict" test only after a scored gold set is added.

## 3. Gaps

| Metric a Jev integration needs | Why nothing measures it today | Smallest harness that fills it |
|---|---|---|
| Jev latency and cost per call | H8 records exit codes and outputs, never time or spend (`.../2026-09-20-post-migration-reverification/skill-benchmark-report.md:54-75`) | A script that runs each judgment type N times on fixed inputs and records wall time, tokens if returned, and exit code to JSONL |
| Jev judgment accuracy against gold | No harness compares a Jev answer to a labeled answer | Reuse H1's corpus: a `jev choice` over top-3 candidates on the 70-row holdout, scored right@1 against `skill_top_1` |
| Goal verifier accuracy | H12 has three unit cases and no labeled transcripts | 30 to 50 labeled transcript excerpts (met, not-met, unclear) scored for both the heuristic and a Jev arm |
| Correct stop point for deep loops | H11 has telemetry but no gold stop | A replay script over archived lineages that marks the last iteration adding a new cited finding, then compares recorded, heuristic and Jev stops |
| Compaction recovery quality | The precompact and merger tests (`.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts`, listed) check mechanics, not what survives | A fixed set of transcripts, each with 5 to 10 must-survive facts, compacted with and without a Jev keep-or-drop pass, scored by fact recall and output length |
| Finding triage agreement | Reviewer fixtures (H9) grade verdicts, not per-finding severity | Take archived deep-review findings with the final adjudicated severity as gold and score a `jev score` severity call against it |
| Grader agreement with oracle | H9 has the grader seam but no recorded agreement number | One run of `reviewer-regression` with `--grader llm` and one with a Jev grader, reporting agreement with `expectedVerdict` |
| Judgment stability | Jev returns probabilities, but no harness checks repeat agreement | Rerun the gap-2 set three times and report the flip rate; H9's stability pattern (`.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:24-25`) gives the formula |

## 4. Use case to harness map

| Jev use case | Best-fit harness | Metric to quote | Baseline available |
|---|---|---|---|
| Grading model output | H9 reviewer fixtures, H13 blinded judge | Agreement with hidden oracle; per-dimension delta | No (gap) |
| Advisor tie-break on close scores | H1 ambiguity slice and holdout, H2 MRR | Ambiguity top-1 18/24, holdout 53/70; MRR and right@3 | Yes for H1, no for H2 |
| Advisor shadow before any serving | H5 shadow sink scored offline by H1 | Shadow-versus-live disagreement rate, then accuracy on gold | Partial |
| Goal progress or completion | H12 plus a labeled transcript set | Verifier accuracy per class | No (gap) |
| Compaction keep-or-drop | None today | Must-survive fact recall at equal length | No (gap) |
| Deep-loop stop | H11 replay, H10 D4 and D5 | Iterations saved at equal cited-finding count | No (gap) |
| Finding triage | H14 adjudication, H9 reviewer fixtures | Severity agreement with adjudicated gold | No (gap) |
| Routing clarify or defer | H7 canary and admission, H8 hub routing | Clarify and defer accuracy on 13 existing rows | Pass or fail only; too few rows |
| Write-intent classification | H3 Gate 3 F1 | F1 0.9843 | Yes; little headroom |
