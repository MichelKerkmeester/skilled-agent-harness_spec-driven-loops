---
title: "227 -- Feedback-driven revalidation"
description: "This scenario validates Feedback-driven revalidation for `227`. It focuses on Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals."
audited_post_018: true
phase_018_change: "Post-018 audit kept the scenario aligned to the live `memory_validate` feedback loop, guarded promotion path, and bounded learned feedback."
version: 3.6.0.13
---

# 227 -- Feedback-driven revalidation

## 1. OVERVIEW

This scenario validates Feedback-driven revalidation for `227`. It focuses on Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm memory_validate persists confidence updates, adaptive feedback, promotion decisions, and bounded learned-feedback signals.
- Real user request: `Please validate Feedback-driven revalidation against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts and tell me whether the expected signals are present: Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded.`
- Prompt: `Validate feedback-driven revalidation against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms memory_validate preserves confidence tracking, adaptive feedback, guarded promotion, negative-feedback persistence, and bounded learned-feedback behavior

---

## 3. TEST EXECUTION

### Prompt

```
Validate feedback-driven revalidation against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts`
2. inspect assertions covering confidence and validation-counter updates for positive and negative `memory_validate` calls
3. inspect assertions covering best-effort adaptive feedback writes plus positive-only promotion thresholds and non-promotable tiers
4. inspect assertions covering persisted negative-feedback events, bounded learned-feedback behavior, and ground-truth capture fields

### Expected

Validation, learned-feedback, and promotion suites pass; positive and negative validations update confidence and counters correctly; adaptive signals stay best-effort instead of failing the request; promotion thresholds honor positive-validation semantics and rate limits; and learned-feedback or ground-truth outputs remain explicitly bounded

### Evidence

Command run exactly as specified:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/learned-feedback.vitest.ts tests/promotion-positive-validation-semantics.vitest.ts tests/mcp-input-validation.vitest.ts
```

Observed transcript:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:60946) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  3 passed (3)
      Tests  114 passed (114)
   Start at  01:49:39
   Duration  1.73s (transform 934ms, setup 18ms, import 191ms, tests 1.34s, environment 0ms)
```

Key inspected assertions:

```text
tests/promotion-positive-validation-semantics.vitest.ts:62:   it('confidence-tracker eligibility subtracts negative validations from threshold counts', () => {
tests/promotion-positive-validation-semantics.vitest.ts:69:     expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(false);
tests/promotion-positive-validation-semantics.vitest.ts:72:     expect(info.validationCount).toBe(5);
tests/promotion-positive-validation-semantics.vitest.ts:73:     expect(info.positiveValidationCount).toBe(3);
tests/promotion-positive-validation-semantics.vitest.ts:77:   it('recordValidation reports positiveValidationCount separately from total validationCount', () => {
tests/promotion-positive-validation-semantics.vitest.ts:80:     const negativeResult = confidenceTracker.recordValidation(db, 2, false);
tests/promotion-positive-validation-semantics.vitest.ts:81:     expect(negativeResult.validationCount).toBe(5);
tests/promotion-positive-validation-semantics.vitest.ts:83:     expect(negativeResult.positiveValidationCount).toBe(4);
tests/promotion-positive-validation-semantics.vitest.ts:84:     expect(negativeResult.promotionEligible).toBe(false);
tests/promotion-positive-validation-semantics.vitest.ts:89:     const positiveResult = confidenceTracker.recordValidation(db, 2, true);
tests/promotion-positive-validation-semantics.vitest.ts:90:     expect(positiveResult.validationCount).toBe(6);
tests/promotion-positive-validation-semantics.vitest.ts:91:     expect(positiveResult.positiveValidationCount).toBe(5);
tests/promotion-positive-validation-semantics.vitest.ts:92:     expect(positiveResult.promotionEligible).toBe(true);
tests/promotion-positive-validation-semantics.vitest.ts:100:     const blocked = checkAutoPromotion(db, 3);
tests/promotion-positive-validation-semantics.vitest.ts:101:     expect(blocked.promoted).toBe(false);
tests/promotion-positive-validation-semantics.vitest.ts:102:     expect(blocked.validationCount).toBe(3);
tests/promotion-positive-validation-semantics.vitest.ts:103:     expect(blocked.reason).toContain('positive_validation_count=3/5');
tests/promotion-positive-validation-semantics.vitest.ts:109:     const eligible = checkAutoPromotion(db, 4);
tests/promotion-positive-validation-semantics.vitest.ts:110:     expect(eligible.promoted).toBe(true);
tests/promotion-positive-validation-semantics.vitest.ts:111:     expect(eligible.validationCount).toBe(5);
tests/promotion-positive-validation-semantics.vitest.ts:113:     const executed = executeAutoPromotion(db, 4);
tests/promotion-positive-validation-semantics.vitest.ts:114:     expect(executed.promoted).toBe(true);
tests/promotion-positive-validation-semantics.vitest.ts:125:     expect(row.importance_tier).toBe('important');
tests/promotion-positive-validation-semantics.vitest.ts:126:     expect(row.source_kind).toBe('feedback');
tests/promotion-positive-validation-semantics.vitest.ts:127:     expect(row.provenance_source).toBe('auto-promotion');
tests/promotion-positive-validation-semantics.vitest.ts:128:     expect(row.provenance_actor).toBe('memory_validate');
tests/promotion-positive-validation-semantics.vitest.ts:137:     const eligible = scanForPromotions(db);
tests/promotion-positive-validation-semantics.vitest.ts:138:     expect(eligible).toHaveLength(1);
tests/promotion-positive-validation-semantics.vitest.ts:139:     expect(eligible[0].reason).toContain('positive_validation_count=5>=5');
tests/mcp-input-validation.vitest.ts:271:     it('T534-feedback: adaptive writes stay best-effort and validation feedback fields remain surfaced', () => {
tests/mcp-input-validation.vitest.ts:274:       expect(source).toContain('recordAdaptiveSignal');
tests/mcp-input-validation.vitest.ts:275:       expect(source).toMatch(/catch\s*\(_error: unknown\)\s*\{\s*\/\/ Adaptive signals are best-effort only\s*\}/s);
tests/mcp-input-validation.vitest.ts:276:       expect(source).toContain('learnedFeedback');
tests/mcp-input-validation.vitest.ts:277:       expect(source).toContain('groundTruthSelectionId');
tests/learned-feedback.vitest.ts:483:   it('R11-CO02b: learned-feedback behavior is explicitly bounded by term, age, and rank safeguards', () => {
tests/learned-feedback.vitest.ts:484:     expect(MAX_TERMS_PER_SELECTION).toBe(3);
tests/learned-feedback.vitest.ts:485:     expect(MAX_TERMS_PER_MEMORY).toBe(8);
tests/learned-feedback.vitest.ts:486:     expect(MIN_MEMORY_AGE_MS).toBe(72 * 60 * 60 * 1000);
tests/learned-feedback.vitest.ts:487:     expect(TOP_N_EXCLUSION).toBe(3);
tests/learned-feedback.vitest.ts:488:     expect(LEARNED_TERM_TTL_MS).toBe(30 * 24 * 60 * 60 * 1000);
tests/learned-feedback.vitest.ts:503:     expect(result.terms.length).toBeLessThanOrEqual(MAX_TERMS_PER_SELECTION);
tests/learned-feedback.vitest.ts:519:     const result = recordSelection('q-shadow-core', 1, ['authentication'], 5, testDb);
tests/learned-feedback.vitest.ts:520:     expect(result.applied).toBe(false);
tests/learned-feedback.vitest.ts:521:     expect(result.reason).toBe('shadow_period');
tests/learned-feedback.vitest.ts:527:     expect(entries.length).toBe(0);
tests/learned-feedback.vitest.ts:530:     const audit = getAuditLog(testDb, 1);
tests/learned-feedback.vitest.ts:532:     expect(shadowEntry).toBeDefined();
tests/learned-feedback.vitest.ts:533:     expect(shadowEntry!.shadowMode).toBe(true);
tests/learned-feedback.vitest.ts:754:   it('R11-GT01: user selections persist bounded ground-truth context fields', () => {
tests/learned-feedback.vitest.ts:764:     expect(id).toBeGreaterThan(0);
tests/learned-feedback.vitest.ts:766:     expect(selection).toMatchObject({
tests/learned-feedback.vitest.ts:770:         searchMode: 'search',
tests/learned-feedback.vitest.ts:771:         intent: 'debug',
tests/learned-feedback.vitest.ts:772:         selectedRank: 4,
tests/learned-feedback.vitest.ts:773:         totalResultsShown: 9,
tests/learned-feedback.vitest.ts:774:         sessionId: 'session-gt-1',
tests/learned-feedback.vitest.ts:775:         notes: 'validated result',
tests/learned-feedback.vitest.ts:889:   it('R11-AP12: safeguards cap promotions to 3 per 8-hour rolling window', () => {
tests/learned-feedback.vitest.ts:900:     expect(r1.promoted).toBe(true);
tests/learned-feedback.vitest.ts:901:     expect(r2.promoted).toBe(true);
tests/learned-feedback.vitest.ts:902:     expect(r3.promoted).toBe(true);
tests/learned-feedback.vitest.ts:903:     expect(r4.promoted).toBe(false);
tests/learned-feedback.vitest.ts:904:     expect(r4.reason).toContain('promotion_window_rate_limited');
tests/learned-feedback.vitest.ts:947:   it('R11-NF02: each negative reduces multiplier by 0.1', () => {
tests/learned-feedback.vitest.ts:949:     expect(m1).toBeCloseTo(0.9, 2);
tests/learned-feedback.vitest.ts:952:     expect(m2).toBeCloseTo(0.8, 2);
tests/learned-feedback.vitest.ts:955:     expect(m3).toBeCloseTo(0.7, 2);
tests/learned-feedback.vitest.ts:958:   it('R11-NF03: multiplier floor at 0.3 (Safeguard)', () => {
tests/learned-feedback.vitest.ts:960:     expect(multiplier).toBe(CONFIDENCE_MULTIPLIER_FLOOR);
tests/learned-feedback.vitest.ts:961:     expect(multiplier).toBe(0.3);
```

### Pass / Fail

PASS

### Failure Triage

Inspect `mcp_server/handlers/checkpoints.ts`, `mcp_server/lib/scoring/confidence-tracker.ts`, `mcp_server/lib/cognitive/adaptive-ranking.ts`, `mcp_server/lib/search/auto-promotion.ts`, `mcp_server/lib/scoring/negative-feedback.ts`, `mcp_server/lib/search/learned-feedback.ts`, and `mcp_server/lib/eval/ground-truth-feedback.ts` if validation outcomes or bounded learning signals regress

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [remediation_revalidation/feedback_driven_revalidation.md](../../feature_catalog/remediation_revalidation/feedback_driven_revalidation.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 227
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `remediation_revalidation/feedback_driven_revalidation.md`
