---
title: "003 -- Co-activation fan-effect divisor (R17)"
description: "This scenario validates Co-activation fan-effect divisor (R17) for `003`. It focuses on Confirm hub dampening."
audited_post_018: true
version: 3.6.0.16
---

# 003 -- Co-activation fan-effect divisor (R17)

## 1. OVERVIEW

This scenario validates Co-activation fan-effect divisor (R17) for `003`. It focuses on Confirm hub dampening.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm hub dampening.
- Real user request: `Please validate Co-activation fan-effect divisor (R17) against the documented validation surface and tell me whether the expected signals are present: Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected.`
- Prompt: `Validate co-activation fan-effect divisor (R17) and confirm hub scores dampen by fan-out without changing non-hub scores.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Hub node contribution decreases as degree increases; no single hub dominates >50% of top-5; FAIL: Hub monopolizes results

---

## 3. TEST EXECUTION

### Prompt

```
Validate co-activation fan-effect divisor (R17) and confirm hub scores dampen by fan-out without changing non-hub scores.
```

### Commands

1. Create high-degree hub
2. Run repeated queries
3. Compare dominance

### Expected

Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected

### Evidence

Query output showing hub vs non-hub score comparison across repeated queries

### Pass / Fail

- **Pass**: Hub node contribution decreases as degree increases; no single hub dominates >50% of top-5
- **Fail**: Hub monopolizes results

### Failure Triage

Check fan-effect divisor formula → Verify degree count accuracy → Inspect co-activation weight cap

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [bug-fixes-and-data-integrity/co-activation-fan-effect-divisor.md](../../feature_catalog/bug-fixes-and-data-integrity/co-activation-fan-effect-divisor.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `bug-fixes-and-data-integrity/co-activation-fan-effect-divisor-r17.md`
