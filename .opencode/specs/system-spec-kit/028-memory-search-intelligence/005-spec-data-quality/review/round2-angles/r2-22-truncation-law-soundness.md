# R2-22 Truncation Law Soundness

**Angle summary:** The truncation law's two conclusions (retrieval gated, write-time ships on cost) are sound and corroborated by live code, but the law's stated mechanism mis-reads `minResults=3` as a 3-result cap when the code makes it a floor, and it pins the gate at completeRecall@3 when the live harness and prod window already span 3/5/8.

**Slice:** truncation-law-soundness (seat 22, angle effectiveness)
**Verdict:** law's conclusions hold, law's mechanism statement does not. 0 P0, 2 P1, 2 P2.

---

## FINDING 1 (P1) — "3-result floor" conflates a guaranteed minimum with a cap

The parent spec states the law as a cap that hides the tail: "The prod retrieval path truncates to a 3-result floor ... the external brief's recall@K numbers are mechanically hidden by the K=3 prod floor" (`spec.md` §EXECUTIVE SUMMARY lines 50-51). SUMMARY.md restates it harder: "Search only ever shows the top 3 results" (`SUMMARY.md` line 9).

Live code makes `minResults=3` a FLOOR, not a cap. `truncateByConfidence` returns unchanged when `validResults.length <= minResults` (`confidence-truncation.ts:130`) and only searches for a cutoff starting at `i = minResults - 1` (`confidence-truncation.ts:166`), so results 4..N are kept unless a gap past index 2 exceeds 2x the median gap. With no qualifying gap it returns all results (`confidence-truncation.ts:175-185`), bounded above by `DEFAULT_LIMIT = 20` (`hybrid-search.ts:329`). Test T13 proves the semantics: a 0.80 gap at index 0 is deliberately not acted on, and the assertion is `toBeGreaterThanOrEqual(DEFAULT_MIN_RESULTS)` (`confidence-truncation.vitest.ts:198-215`). A floor of 3 cannot mechanically hide results 4 through 20. The tail is trimmed only on a conditional relevance cliff, not by the number 3.

- **Evidence:** `confidence-truncation.ts:35,130,166,175-185` and `confidence-truncation.vitest.ts:198-215` (live) vs `spec.md` §EXECUTIVE SUMMARY lines 50-51 and `SUMMARY.md` line 9 (premise).
- **Type:** SPEC-PREMISE issue.

---

## FINDING 2 (P1) — Gate pinned at completeRecall@3 under-measures the real prod window

The decision is "gate every retrieval candidate on a prod-mode completeRecall@3 read" (`spec.md` line 53, restated in build-order dependency line 211 and phase 015 scope line 183). A single K=3 gate is narrower than both the live prod window and the live eval harness.

Production context does not return 3. `memory_context` strategies default to limits of 5, 8 and 10 (`memory-context.ts:1077,1097,1127`), trimmed by gap-conditional confidence truncation that floors at 3. The live eval-v2 driver already computes completeRecall at 3, 5 and 8 (`run-eval-v2.mjs:41` `COMPLETE_RECALL_KS = '3,5,8'`) over a SEARCH_LIMIT of 20 (`run-eval-v2.mjs:44-46`). A retrieval candidate that improves which docs land in positions 4 through 8, still shown in prod, is invisible to a recall@3 gate and would be wrongly rejected. The gate cutoff should track the actual prod window the harness already measures, not collapse to @3.

- **Evidence:** `memory-context.ts:1077,1097,1127` and `run-eval-v2.mjs:41,44-46` (live) vs `spec.md` lines 53,183,211 (premise).
- **Type:** SPEC-PREMISE issue.

---

## FINDING 3 (P2) — Mechanism mis-named: confidence floor vs token-budget truncation

The law attributes the prod cut to "the K=3 prod floor" (`spec.md` line 51), borrowing the number from `DEFAULT_MIN_RESULTS = 3` (`confidence-truncation.ts:35`). The live prod-limiting mechanism the eval harness names is different: "prod path: ... token-budget truncation is active" and "the prod path is truncation-limited (not window-limited)" (`run-eval-v2.mjs:18-20,44`). Confidence truncation (the source of the 3) is a separate, gap-conditional stage that is skipped entirely in evaluationMode (`hybrid-search.ts:2049` `if (!evaluationMode)`). The law fuses a floor constant from one stage with a cap behaviour from another. The direction is right, the named cause is not, and a builder calibrating the gate from this premise would tune the wrong knob.

- **Evidence:** `confidence-truncation.ts:35`, `hybrid-search.ts:2049`, `run-eval-v2.mjs:18-20,44` (live) vs `spec.md` line 51 (premise).
- **Type:** SPEC-PREMISE issue.

---

## FINDING 4 (P2, mostly clean) — The law's two CONCLUSIONS are sound and live-code corroborated

The defective mechanism statement does not collapse the program, because the conclusions the tiering rests on hold independently.

- "Retrieval gated" holds. The eval-vs-prod divergence is real and already first-class in live code: eval path runs forceAllChannels with no truncation, prod path runs the routed, truncation-active default, and the delta is reported as a FIDELITY metric (`run-eval-v2.mjs:16-23`). Test DRV-02 guards exactly this eval-vs-prod delta per cutoff (`eval-v2-measurability.vitest.ts:154-158`). So external recall@K alone genuinely cannot promote a retrieval candidate, which is the gated-Tier-C conclusion.
- "Write-time ships on cost" holds. Confidence truncation runs only inside the retrieval pipeline as Stage D (`hybrid-search.ts:2046-2073`) and never touches write-time authoring, so adherence, logic and write-time candidates do bypass the floor as claimed.

One internal inconsistency to note: the parent EXECUTIVE SUMMARY implies the dual-mode eval-v2 measurement still needs building (`spec.md` line 51), while phase 015's own spec correctly records that `run-eval-v2.mjs` already reports the fidelity delta and only needs a baseline, multi-target goldens and a gate (`015-c2-prodmode-recall-gate/spec.md` description line 3). The phase is accurate, the parent overstates what is missing.

- **Evidence:** `run-eval-v2.mjs:16-23`, `eval-v2-measurability.vitest.ts:154-158`, `hybrid-search.ts:2046-2073` (live, corroborating); `spec.md` line 51 vs `015-.../spec.md` line 3 (premise inconsistency).
- **Type:** LIVE-CODE corroboration plus minor SPEC-PREMISE inconsistency.

---

## What I checked and did not modify

Read only: `confidence-truncation.ts`, `confidence-truncation.vitest.ts`, `hybrid-search.ts` (truncation Stage D + DEFAULT_LIMIT), `memory-context.ts` (strategy default limits), `run-eval-v2.mjs`, `eval-v2-measurability.vitest.ts`, `metrics.ts`, and the program docs `spec.md`, `SUMMARY.md`, `015-c2-prodmode-recall-gate/spec.md`. No reviewed file was modified.
