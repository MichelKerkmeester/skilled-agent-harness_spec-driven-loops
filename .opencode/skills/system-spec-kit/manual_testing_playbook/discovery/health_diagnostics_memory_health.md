---
title: "EX-013 -- Health diagnostics (memory_health)"
description: "This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check."
version: 3.6.0.15
---

# EX-013 -- Health diagnostics (memory_health)

## 1. OVERVIEW

This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check.

---

## 2. SCENARIO CONTRACT


- Objective: Index/FTS integrity check.
- Real user request: `Please validate Health diagnostics (memory_health) against memory_health(reportMode:full) and tell me whether the expected signals are present: healthy/degraded status and diagnostics.`
- Prompt: `Validate memory_health full diagnostics and confirm healthy/degraded status with actionable pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: healthy/degraded status and diagnostics
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if report completes with actionable diagnostics

---

## 3. TEST EXECUTION

### Prompt

```
Validate memory_health full diagnostics and confirm healthy/degraded status with actionable pass/fail evidence.
```

### Commands

1. memory_health(reportMode:full)
2. memory_health(reportMode:divergent_aliases)

### Expected

healthy/degraded status and diagnostics

### Evidence

Health outputs

### Pass / Fail

- **Pass**: report completes with actionable diagnostics
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Run index_scan(force) if FTS mismatch

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [discovery/health_diagnostics_memoryhealth.md](../../feature_catalog/discovery/health_diagnostics_memoryhealth.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery/health_diagnostics_memory_health.md`
- audited_post_018: true
