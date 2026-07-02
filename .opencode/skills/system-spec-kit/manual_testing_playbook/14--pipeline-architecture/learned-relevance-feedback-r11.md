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
- Expected signals: Learned triggers added from helpful validations; safeguards prevent trigger flooding; queryId required for trigger learning
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Triggers learned from helpful validations with queryId; safeguards cap total learned triggers; FAIL: Triggers learned without queryId or safeguard limits exceeded

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

Learned triggers added from helpful validations; safeguards prevent trigger flooding; queryId required for trigger learning

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

Command 2, inspect learned triggers: the returned learned trigger list was exactly `termsLearned: ["r11-alpha-learned", "r11-beta-learned", "r11-gamma-learned"]`; the fourth and fifth submitted terms (`"r11-delta-overflow"`, `"r11-epsilon-overflow"`) were not returned, showing the per-selection cap. However, `applied` was `false` and `reason` was `"shadow_period"`, so the expected persisted/additive learned-trigger outcome did not hold in the current runtime.

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

- **FAIL**: QueryId gating and safeguard checks were present, but the production `memory_validate` call returned `"applied": false` with `"reason": "shadow_period"`, so learned triggers were not actually added/persisted from the helpful validation as the Expected section requires.

### Failure Triage

Verify trigger learning pipeline → Check safeguard limits → Inspect queryId validation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/learned-relevance-feedback.md](../../feature_catalog/14--pipeline-architecture/learned-relevance-feedback.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 054
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/learned-relevance-feedback-r11.md`
