---
title: "160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)"
description: "This scenario validates shadow feedback (SPECKIT_SHADOW_FEEDBACK) for `160`. It separates library scoring evidence from clean-schema scheduled replay, where an empty replay pool is expected."
audited_post_018: true
---

# 160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)

## 1. OVERVIEW

This scenario validates shadow feedback (SPECKIT_SHADOW_FEEDBACK) for `160`. It focuses on proving the scoring helper works with explicit replay inputs and confirming that clean-schema scheduled replay skips when no privacy-preserving replay pool is available.

---

## 2. SCENARIO CONTRACT


- Objective: Verify shadow scoring helpers create log entries when replay inputs are supplied, and verify clean-schema scheduled replay treats an empty replay pool as expected.
- Real user request: `Please validate Shadow feedback (SPECKIT_SHADOW_FEEDBACK) against SPECKIT_SHADOW_FEEDBACK=true and tell me whether the expected signals are present: explicit replay inputs can create shadow_scoring_log rows with query_id, result_id, live_rank, shadow_rank, delta, direction; compareRanks() produces RankComparisonResult with kendallTau and ndcgDelta; evaluatePromotionGate() returns ready/wait/rollback; clean-schema scheduled replay may skip with no rows; no live ranking columns mutated.`
- Prompt: `Validate Shadow feedback helper logging and clean-schema scheduled replay behavior with SPECKIT_SHADOW_FEEDBACK enabled.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: explicit helper replay can populate shadow_scoring_log with rank deltas; compareRanks() produces RankComparisonResult with kendallTau and ndcgDelta; evaluatePromotionGate() returns ready/wait/rollback; clean-schema scheduled replay with no raw query pool skips without log rows; no live ranking columns mutated
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if helper-driven evaluation logs entries, clean-schema scheduled replay skips safely when no replay pool exists, and live rankings stay unchanged; FAIL if helper replay cannot log rows, scheduled replay throws on clean schema, or live ranking columns were mutated

---

## 3. TEST EXECUTION

### Prompt

```
Validate Shadow feedback helper logging and clean-schema scheduled replay behavior with SPECKIT_SHADOW_FEEDBACK enabled.
```

### Commands

1. `SPECKIT_SHADOW_FEEDBACK=true`
2. Call `runShadowEvaluation(db, queryIds, liveRanksFn, shadowRanksFn)` with explicit replayable query IDs and rank providers
3. Query `SELECT * FROM shadow_scoring_log`
4. Check `evaluatePromotionGate(db)`
5. On a clean-schema install, run or inspect the scheduled runtime path and confirm it skips when `consumption_log.query_text` is absent
6. `npx vitest run tests/shadow-scoring-holdout.vitest.ts`

### Expected

Helper-driven shadow_scoring_log rows with rank deltas; compareRanks() produces Kendall tau and NDCG delta; evaluatePromotionGate() returns recommendation; clean-schema scheduled replay skips without treating the empty pool as a failure; no live ranking mutation

### Evidence

Helper-created shadow_scoring_log rows + ShadowEvaluationReport output + clean-schema scheduled-skip evidence + test transcript

### Pass / Fail

- **Pass**: helper replay writes shadow_scoring_log entries, scheduled replay skips safely on a clean schema without raw query text, and live rankings stay unchanged
- **Fail**: helper replay cannot write scoring rows, scheduled replay throws on a clean schema, or live ranking columns are mutated

### Failure Triage

Verify isShadowFeedbackEnabled() → Check initShadowScoringLog() created tables → Inspect selectHoldoutQueries() output for helper replay → Verify logRankDelta() insert count for explicit replay inputs → Confirm scheduled runtime skips when no replayable query text exists → Check PROMOTION_THRESHOLD_WEEKS (2)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/shadow-feedback-holdout-evaluation.md](../../feature_catalog/11--scoring-and-calibration/shadow-feedback-holdout-evaluation.md)
- Feature flag reference: [19--feature-flag-reference/1-search-pipeline-features-speckit.md](../19--feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/feedback/shadow-scoring.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 160
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/shadow-feedback-speckit-shadow-feedback.md`
