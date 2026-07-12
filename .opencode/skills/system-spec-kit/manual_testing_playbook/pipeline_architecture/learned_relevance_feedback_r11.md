---
title: "054 -- Learned relevance feedback (R11)"
description: "This scenario validates Learned relevance feedback (R11) for `054`. It focuses on Confirm learned trigger safeguards."
audited_post_018: true
version: 3.6.0.16
---

# 054 -- Learned relevance feedback (R11)

## 1. OVERVIEW

This scenario validates Learned relevance feedback (R11) for `054`. It focuses on Confirm learned trigger safeguards.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm learned trigger safeguards.
- Real user request: `Please validate Learned relevance feedback (R11) against the documented validation surface and tell me whether the expected signals are present: Learned triggers added from helpful validations; safeguards prevent trigger flooding; queryId required for trigger learning.`
- Prompt: `Validate learned relevance feedback (R11) against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Helpful validations with `queryId` report capped learnable terms; the 7-day shadow-period safeguard logs but does not apply learned triggers while active; queryId and rank safeguards prevent invalid learning
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Helpful validations with queryId return capped `termsLearned` and either apply after shadow mode or return `reason: "shadow_period"` while the shadow-period safeguard is active; safeguards prevent learning without queryId and exclude top-3 selections; FAIL: Triggers learned without queryId, safeguard limits exceeded, or shadow mode applies triggers early

---

## 3. TEST EXECUTION

### Prompt

```
Validate learned relevance feedback (R11) against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. submit helpful validation/queryId
2. inspect learned triggers
3. verify safeguards

### Expected

Helpful validations with `queryId` return capped learnable terms; while the 7-day shadow-period safeguard is active, learned feedback is audited but not persisted/applied; safeguards prevent trigger flooding, no-queryId learning, and top-3 learning.

### Evidence

Preconditions section: not present in this scenario file.

Command 1, submit helpful validation/queryId: `memory_validate({ id: 7470, wasUseful: true, queryId: "manual-r11-20260702-with-queryid", queryTerms: ["r11-alpha-learned", "r11-beta-learned", "r11-gamma-learned", "r11-delta-overflow", "r11-epsilon-overflow"], resultRank: 4, totalResultsShown: 10, searchMode: "manual_testing_playbook", intent: "find_spec", sessionId: "", notes: "Manual scenario 054 R11 helpful validation with queryId to verify learned relevance feedback." })`

```json
{
  "summary": "Positive validation recorded (confidence: 0.60)",
  "data": {
    "memoryId": 7470,
    "wasUseful": true,
    "confidence": 0.6,
    "validationCount": 1,
    "positiveValidationCount": 1,
    "promotionEligible": false,
    "autoPromotion": {
      "attempted": true,
      "promoted": false,
      "previousTier": "important",
      "newTier": "important",
      "reason": "below_threshold: positive_validation_count=1/10"
    },
    "learnedFeedback": {
      "attempted": true,
      "applied": false,
      "termsLearned": [
        "r11-alpha-learned",
        "r11-beta-learned",
        "r11-gamma-learned"
      ],
      "reason": "shadow_period"
    },
    "groundTruthSelectionId": 1
  },
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call."
  ],
  "meta": {
    "tool": "memory_validate",
    "tokenCount": 242,
    "latencyMs": 6,
    "cacheHit": false,
    "tokenBudget": 1000
  }
}
```

Command 2, inspect learned triggers: the returned learned trigger list was exactly `termsLearned: ["r11-alpha-learned", "r11-beta-learned", "r11-gamma-learned"]`; the fourth and fifth submitted terms (`"r11-delta-overflow"`, `"r11-epsilon-overflow"`) were not returned, showing the per-selection cap. `applied` was `false` and `reason` was `"shadow_period"`, which is the expected log-only behavior while the 7-day shadow-period safeguard is active.

Command 3, verify safeguards, no-queryId control: `memory_validate({ id: 7471, wasUseful: true, queryId: "", queryTerms: ["r11-no-queryid-term"], resultRank: 4, totalResultsShown: 10, searchMode: "manual_testing_playbook", intent: "find_spec", sessionId: "", notes: "Manual scenario 054 R11 control validation without queryId to verify learning is not attempted." })`

```json
{
  "summary": "Positive validation recorded (confidence: 0.60)",
  "data": {
    "memoryId": 7471,
    "wasUseful": true,
    "confidence": 0.6,
    "validationCount": 1,
    "positiveValidationCount": 1,
    "promotionEligible": false,
    "autoPromotion": {
      "attempted": true,
      "promoted": false,
      "previousTier": "important",
      "newTier": "important",
      "reason": "below_threshold: positive_validation_count=1/10"
    },
    "learnedFeedback": null,
    "groundTruthSelectionId": null
  },
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call."
  ],
  "meta": {
    "tool": "memory_validate",
    "tokenCount": 193,
    "latencyMs": 1,
    "cacheHit": false,
    "tokenBudget": 1000
  }
}
```

Command 3, verify safeguards, top-3 exclusion: `memory_validate({ id: 7470, wasUseful: true, queryId: "manual-r11-20260702-top3-safeguard", queryTerms: ["r11-top3-safeguard"], resultRank: 2, totalResultsShown: 10, searchMode: "manual_testing_playbook", intent: "find_spec", sessionId: "", notes: "Manual scenario 054 R11 top-3 safeguard validation." })`

```json
{
  "summary": "Positive validation recorded (confidence: 0.70)",
  "data": {
    "memoryId": 7470,
    "wasUseful": true,
    "confidence": 0.7,
    "validationCount": 2,
    "positiveValidationCount": 2,
    "promotionEligible": false,
    "autoPromotion": {
      "attempted": true,
      "promoted": false,
      "previousTier": "important",
      "newTier": "important",
      "reason": "below_threshold: positive_validation_count=2/10"
    },
    "learnedFeedback": {
      "attempted": true,
      "applied": false,
      "termsLearned": [],
      "reason": "top_3_exclusion"
    },
    "groundTruthSelectionId": 2
  },
  "hints": [
    "[session] Context quality is degraded. Session may benefit from a `session_resume` call."
  ],
  "meta": {
    "tool": "memory_validate",
    "tokenCount": 220,
    "latencyMs": 1,
    "cacheHit": false,
    "tokenBudget": 1000
  }
}
```

Validation surface command: `npx vitest run tests/learned-feedback.vitest.ts`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  76 passed (76)
   Start at  14:53:17
   Duration  580ms (transform 315ms, setup 14ms, import 403ms, tests 95ms, environment 0ms)
```

### Pass / Fail

- **PASS**: QueryId gating and safeguard checks were present. The production `memory_validate` call returned capped `termsLearned` and `"reason": "shadow_period"`, matching the active 7-day log-only shadow-period safeguard rather than requiring immediate persistence.

### Failure Triage

Verify trigger learning pipeline → Check safeguard limits → Inspect queryId validation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/learned_relevance_feedback.md](../../feature_catalog/pipeline_architecture/learned_relevance_feedback.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 054
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/learned_relevance_feedback_r11.md`
