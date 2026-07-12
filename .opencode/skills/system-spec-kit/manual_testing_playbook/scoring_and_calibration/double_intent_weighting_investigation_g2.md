---
title: "029 -- Double intent weighting investigation (G2)"
description: "This scenario validates Double intent weighting investigation (G2) for `029`. It focuses on Confirm no hybrid double-weight."
audited_post_018: true
version: 3.6.0.16
---

# 029 -- Double intent weighting investigation (G2)

## 1. OVERVIEW

This scenario validates Double intent weighting investigation (G2) for `029`. It focuses on Confirm no hybrid double-weight.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm no hybrid double-weight.
- Real user request: `Please validate Double intent weighting investigation (G2) against the documented validation surface and tell me whether the expected signals are present: Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally.`
- Prompt: `Validate double intent weighting handling for hybrid and non-hybrid queries.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case; FAIL: Double intent weighting detected in hybrid path

---

## 3. TEST EXECUTION

### Prompt

```
Validate double intent weighting handling for hybrid and non-hybrid queries.
```

### Commands

1. Run hybrid query
2. Inspect stage trace
3. Confirm stage-2 intent skip

### Expected

Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally

### Evidence

Stage trace output for hybrid vs non-hybrid queries + intent weight comparison

### Pass / Fail

- **Pass**: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case
- **Fail**: Double intent weighting detected in hybrid path

### Failure Triage

Check hybrid detection logic → Verify stage-2 guard condition → Inspect intent weight application point

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [scoring_and_calibration/double_intent_weighting_investigation.md](../../feature_catalog/scoring_and_calibration/double_intent_weighting_investigation.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `scoring_and_calibration/double_intent_weighting_investigation_g2.md`
