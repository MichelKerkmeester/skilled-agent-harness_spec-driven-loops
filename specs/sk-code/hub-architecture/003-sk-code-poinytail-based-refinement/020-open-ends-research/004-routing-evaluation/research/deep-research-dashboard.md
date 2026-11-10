---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Recommend what a realistic held-out evaluation set and a cross-path parity check should look like for system-skill-advisor, comparing the Python path .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py with the Node path .skilled/bin/skill-advisor.cjs, and how to keep both cheap to run and honest given that the current batteries are 17 prompts plus 5 negatives, ties land at confidence 0.82, and hub admission runs in CI with --warn-only. Read-only research. Out of scope: proposing any fix for probe P4, probe P7 or admission scenario DOC-331, whose fix is in flight elsewhere.
- Started: 2026-10-11T16:23:50Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-10-11T16:23:50Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: realistic held-out evaluation set for system-skill-advisor - size, prompt source, negatives, and holdout discipline against every scorer tuning surface | eval-design | 0.92 | 6 | complete |
| 2 | Follow-up on residual holdout-overlap risk: scope the holdout's independence claim against every tuning surface and every consumer of the fixtures that feed holdout-prompts.jsonl | evaluation-integrity | 0.83 | 6 | complete |
| 3 | Enforceable shape of the union-of-surfaces independence rule: complete the consumer union of the holdout source fixtures, measure the harder-fixture overlap, and state the cheapest bidirectional check | evaluation-integrity | 0.75 | 6 | complete |
| 4 | Q2 cross-path parity contract: what a parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs should compare (top-1, ranked list, confidence, abstain) and when it should fail, grounded in the three existing parity harnesses and their CI wiring | parity-contract | 0.83 | 6 | complete |
| 5 | Q3 cost and honesty of the held-out evaluation set and the cross-path parity check: two-tier CI placement, confidence ties at 0.82, and the fail-open --warn-only admission posture | evaluation-integrity | 0.83 | 6 | complete |
| 6 | Live measurement of the residual uncertainty: 0.82 exact-tie frequency, per-prompt cost, and cross-path top-1 agreement on the 17+5 battery, with cold-start behavior | evaluation-integrity | 0.83 | 6 | complete |
| 7 | Cold-runner daemon behavior of the Node path and live cross-path top-1 agreement on a 49-prompt stride sample of the 217-prompt union, under envelope trust checks | evaluation-integrity | 0.92 | 6 | complete |
| 8 | Ratchet matching semantics and reconciliation of the 3 uncovered divergences: path-semantics correction of skill_advisor.py --force-native | parity-evaluation | 0.93 | 6 | complete |
| 9 | Settle iteration 8's named residuals by direct in-process measurement: the in-process TS scorer ordering and the full 217-row engine-level divergence pass, reconciled against the 73-entry approved-divergence ledger | engine-parity | 0.93 | 6 | complete |
| 10 | Terminal consolidation: assemble the segment's measured recommendation package for the held-out evaluation set and the cross-path parity check, and narrow the rr-iter3-168 native-flip attribution with read-only commit-diff inspection | evaluation-and-parity | 0.60 | 6 | insight |

- iterationsCompleted: 10
- keyFindings: 60
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] Q1: What should a realistic held-out evaluation set for system-skill-advisor look like: its size, the source of its prompts, its negatives, and how it stays held out from the prompts the scorer is tuned against?
- [x] Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail?
- [x] Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only?
- [x] Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▅▆▆▆▆▆▆▇█████▄▁
- score sparkline: █▇▆▅▄▅▆▆▆▆▆▆▇█████▄▁
- Last 3 ratios: 0.93 -> 0.93 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":4,"other":71}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None this iteration; no direction was eliminated. No candidates for reducer promotion to Exhausted Approaches. (iteration 2)
- Using tests/scorer/fixtures/README.md's one-test-file-consumes-all-fixtures claim (:27) as the consumer map: true only for tests/scorer consumers and stale for tests/parity, where local-native-divergence-ratchet.vitest.ts also imports the harder fixture (:24). The consumer map came from symbol-level ripgrep instead. (iteration 2)
- Assuming all three holdout source fixtures co-locate under tests/scorer/fixtures: only harder-intent-prompt-corpus.ts lives there; skill-advisor-regression-cases.jsonl is under runtime/scripts/fixtures and executor-delegation-cases.json under runtime/tests/parity/fixtures. find-by-name, not assumed paths, is the working route. (iteration 3)
- Repo-root symbol scan over the whole worktree as the consumer census: it did not complete inside the first 90-second budget; bounded roots (.skilled/bin, .skilled/skills/system-skill-advisor, the 011 spec packet) returned the complete consumer list instead. (iteration 3)
- Comparing raw confidence values or full ranked lists as parity dimensions: no existing harness does it, no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors/ties, and the CLI parity already requests topK:1. Candidate for reducer promotion to Ruled Out Directions. (iteration 4)
- No other attempted approach failed this iteration; one command ran from the packet directory instead of the repo root and was re-run from the correct root. (iteration 4)
- None eliminated beyond the ruled-out comparison dimension above. (iteration 4)
- None eliminated beyond the ruled-out enforcement placement above. No direction investigated this iteration was exhausted. (iteration 5)
- Relying on, or nesting the parity gate behind, the existing `--warn-only` admission step: its contract is always exit 0 under the flag (`compiled-route-admission.cjs:19-21`, :104), so a check there can never fail CI. (iteration 5)
- The first `rg` for warn-only used a `-g` glob without the required `--` separator and failed with `rg: -g: No such file or directory`; the corrected bounded search returned the admission line and the workflow reference. No evidence was lost; the failure was command shape, not scope. (iteration 5)
- Comparing raw top-1 confidence values: live measurement adds support to the earlier elimination (iteration-004.md:26) — 2/20 comparable probes drift on confidence while agreeing on top-1. (iteration 6)
- No other direction was exhausted this iteration; nothing new for the reducer's Exhausted Approaches beyond the two Ruled Out items above. (iteration 6)
- Single-shot parity scoring without warm-up or retry: eliminated by the P1 NATIVE_CALL_FAILED observation — three replays of the same prompt succeeded, so a no-retry pass would record false divergences. (iteration 6)
- **Inducing a cold daemon spawn through the CLI**: `warm` is not a command (exit 64) and `--warm-only` fails ENOENT (exit 75) in an empty custom dir; the plain call degrades instead. Daemon lifecycle is launcher-owned, so no CLI-shaped cold-spawn measurement exists. Candidate for reducer promotion to Exhausted Approaches. (iteration 7)
- **Using a custom `SPECKIT_IPC_SOCKET_DIR` as an isolated measurement channel**: every call there silently degrades to the local scorer, so the channel cannot carry trusted parity data. Candidate for reducer promotion (it also generalizes: any CI runner without the live daemon is in this state). (iteration 7)
- Reading `freshness` as a per-call diagnostic on the degraded path — the field does not exist there; absence is the signal, which is exactly why the battery's envelope rule requires it to be present and live/stale. (iteration 7)
- The first degraded pass as parity evidence — dead as measurement, recycled as the honesty evidence in Finding 1/2. (iteration 7)
- **Reading `--force-native` as "the local Python scorer"**: the help text says the opposite and the run's own output marks those rows `"source": "native"`. (iteration 8)
- **Running the ratchet test itself inside this read-only packet**: repo test tooling was avoided; the ratchet's exact local call plus both CLI surfaces were used instead. The test run is the recommended settlement step for a normal dev environment (next focus). (iteration 8)
- **Treating iteration 7's five CLI-path divergences as engine (ratchet-axis) divergences**: falsified by the flag semantics (skill_advisor.py:4744-4745) and the fresh probes — the three `memory:save` rows agree at engine level. Candidate for reducer promotion to Ruled Out Directions. (iteration 8)
- None new beyond the ruled-out reading above; no direction was attempted and abandoned without recording why. (iteration 8)
- **Reading iteration 8's "the native in-process side needs test tooling" as a hard limit**: a Node resolver hook (`.js` → `.ts` fallback) made `scoreAdvisorPrompt` directly runnable in-process; the full pass ran without vitest. Candidate for reducer promotion. (iteration 9)
- **Treating `rr-iter3-168`'s `nativeTop` mismatch as a bridge-vs-daemon client-order case**: falsified by the live daemon probe — both native clients return `system-spec-kit` first; the mismatch is stale ledger history from before the native engine moved. Candidate for reducer promotion to Ruled Out Directions. (iteration 9)
- **Attributing the rr-iter3-168 flip to 4e69fb4d45's removed native phrase boosts**: none of the four removed keys occurs in the entry's prompt, and rg finds none of them in the current explicit lane (exit 1). (iteration 10)
- **Treating the rr-iter3-168 native flip as caused by the fusion.ts change 3a4d1a8927**: its complete diff for fusion.ts is section banners plus one import-path change — no scoring semantics. Candidate for reducer promotion to Ruled Out Directions. (iteration 10)
- None beyond the two ruled-out attributions above. The remaining attribution gap is a tooling limit (no checkout in a read-only packet), not an attempted-and-abandoned approach. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
