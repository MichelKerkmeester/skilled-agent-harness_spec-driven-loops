---
title: "090 -- INT8 quantization evaluation (R5)"
description: "This scenario validates INT8 quantization evaluation (R5) for `090`. It focuses on confirming whether the prior no-go still holds or current data warrants re-evaluation."
version: 3.6.0.16
id: evaluation-and-measurement-int8-quantization-evaluation-r5
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 090 -- INT8 quantization evaluation (R5)

## 1. OVERVIEW

This scenario validates INT8 quantization evaluation (R5) for `090`. It focuses on confirming whether the prior no-go still holds or current data warrants re-evaluation.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm whether the prior no-go decision remains valid or current data warrants re-evaluation.
- Real user request: `Please validate INT8 quantization evaluation (R5) against the documented validation surface and tell me whether the expected signals are present: Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data.`
- Prompt: `Validate the INT8 quantization no-go decision and cite current degradation metrics, criteria, and rationale evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Quality degradation metrics and activation criteria are checked against current data; the decision rationale documents either no-go reaffirmation or re-evaluation when criteria are now met
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale

---

## 3. TEST EXECUTION

### Prompt

```text
Validate the INT8 quantization no-go decision and cite current degradation metrics, criteria, and rationale evidence.
```

### Commands

1. gather thresholds metrics
2. compare go/no-go criteria
3. record decision

### Expected

Quality degradation metrics and activation criteria are checked against current data; the decision rationale documents either no-go reaffirmation or re-evaluation when criteria are now met

### Evidence

Threshold metrics summary + go/no-go criteria comparison + documented decision with evidence

### Current Verdict (2026-07-03)

**PASS** - Current read-only measurements warrant re-evaluation rather than a simple no-go reaffirmation. The live active vector-backed corpus is 18,466 embedded memories versus the 10,000 threshold; `memory_index` marks 18,840 active rows as successful, with 374 missing active vector payloads. The active embedder remains `nomic-embed-text-v1.5` via `ollama` at 768 dimensions, below the 1,536 threshold. Persisted eval latency is sparse (`n=2`) but currently records p95 123ms versus the 50ms threshold, so a sustained latency benchmark should be part of the follow-up re-evaluation. The feature-catalog decision record now documents these current values and the re-evaluation rationale.

### Pass / Fail

- **Pass**: no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Review original no-go rationale; gather updated benchmark data; compare quality degradation thresholds with current acceptable limits

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [evaluation_and_measurement/int8_quantization_evaluation.md](../../feature_catalog/evaluation_and_measurement/int8_quantization_evaluation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 090
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `evaluation_and_measurement/int8_quantization_evaluation_r5.md`
- audited_post_018: true
