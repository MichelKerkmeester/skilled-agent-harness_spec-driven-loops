---
title: "EX-034 -- 7. CI and Build (informational)"
description: "This scenario validates 7. CI and Build (informational) for `EX-034`. It focuses on Branch metadata source audit."
audited_post_018: true
version: 3.6.0.15
---

# EX-034 -- 7. CI and Build (informational)

## 1. OVERVIEW

This scenario validates 7. CI and Build (informational) for `EX-034`. It focuses on Branch metadata source audit.

---

## 2. SCENARIO CONTRACT


- Objective: Branch metadata source audit.
- Real user request: `Please validate 7. CI and Build (informational) against memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 }) and tell me whether the expected signals are present: Branch source vars surfaced.`
- Prompt: `Validate 7. CI and Build (informational) against memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 }).`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Branch source vars surfaced
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all listed vars are found

---

## 3. TEST EXECUTION

### Prompt

```
Validate 7. CI and Build (informational) against memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 }).
```

### Commands

1. memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 })

### Expected

Branch source vars surfaced

### Evidence

Search output

### Pass / Fail

- **Pass**: all listed vars are found
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Search CI scripts and runtime helpers

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [feature_flag_reference/7_ci_and_build_informational.md](../../feature_catalog/feature_flag_reference/7_ci_and_build_informational.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-034
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `feature_flag_reference/7_ci_and_build_informational.md`
