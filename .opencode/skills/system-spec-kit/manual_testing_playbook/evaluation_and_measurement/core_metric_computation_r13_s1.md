---
title: "006 -- Core metric computation (R13-S1)"
description: "This scenario validates Core metric computation (R13-S1) for `006`. It focuses on Confirm metric battery outputs."
version: 3.6.0.16
---

# 006 -- Core metric computation (R13-S1)

## 1. OVERVIEW

This scenario validates Core metric computation (R13-S1) for `006`. It focuses on Confirm metric battery outputs.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm metric battery outputs.
- Real user request: `Please validate Core metric computation (R13-S1) against the documented validation surface and tell me whether the expected signals are present: Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges.`
- Prompt: `Validate core metric computation and cite whether precision, recall, MRR, and NDCG are present and within valid ranges.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All core metrics computed with values in [0,1] range; FAIL: Missing metrics or out-of-range values

---

## 3. TEST EXECUTION

### Prompt

```
Validate core metric computation and cite whether precision, recall, MRR, and NDCG are present and within valid ranges.
```

### Commands

1. Seed ground truth
2. Run eval metrics
3. Verify metric set

### Expected

Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges

### Evidence

Eval metric output with ground truth comparison + per-metric values

### Pass / Fail

- **Pass**: All core metrics computed with values in [0,1] range
- **Fail**: Missing metrics or out-of-range values

### Failure Triage

Verify ground truth corpus is seeded → Check metric computation functions → Inspect edge cases (empty results, single result)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [evaluation_and_measurement/core_metric_computation.md](../../feature_catalog/evaluation_and_measurement/core_metric_computation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `evaluation_and_measurement/core_metric_computation_r13_s1.md`
- audited_post_018: true
