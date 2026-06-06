---
title: "062 -- Progressive validation for spec documents (PI-B2)"
description: "This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior."
---

# 062 -- Progressive validation for spec documents (PI-B2)

## 1. OVERVIEW

This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm level 1-4 behavior.
- Real user request: `Please validate Progressive validation for spec documents (PI-B2) against the documented validation surface and tell me whether the expected signals are present: Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels.`
- Prompt: `Validate Progressive validation for spec documents (PI-B2) against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if levels 1-4 produce progressively stricter validation and exit codes match severity

---

## 3. TEST EXECUTION

### Prompt

```
Validate Progressive validation for spec documents (PI-B2) against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. run level1..4
2. inspect fixes/diffs
3. verify exit/report behavior

### Expected

Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels

### Evidence

Validation output per level + exit codes + applied fix diffs

### Pass / Fail

- **Pass**: levels 1-4 produce progressively stricter validation and exit codes match severity
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify validation level definitions; check exit code mapping; inspect auto-fix application logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 062
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/progressive-validation-for-spec-documents-pi-b2.md`
