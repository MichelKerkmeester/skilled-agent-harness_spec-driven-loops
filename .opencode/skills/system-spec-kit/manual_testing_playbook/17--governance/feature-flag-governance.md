---
title: "063 -- Feature flag governance"
description: "This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance."
audited_post_018: true
version: 3.6.0.17
---

# 063 -- Feature flag governance

## 1. OVERVIEW

This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm governance policy conformance.
- Real user request: `Please validate Feature flag governance against the documented validation surface and tell me whether the expected signals are present: All flags enumerated with default state, governing env var, gated automation, and added-in version; no undocumented flags found.`
- Prompt: `Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All flags enumerated with default state, governing env var, gated automation, and added-in version (the documented governance columns); no undocumented flags found
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all flags carry the documented governance columns and no undocumented flag exists in code

---

## 3. TEST EXECUTION

### Prompt

```
Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.
```

### Commands

1. enumerate flags
2. verify each flag row carries default state, env var, gated automation, and added-in version
3. record any flag present in code but missing from the table

### Expected

All flags enumerated with the documented governance columns (default, env, automation, added-in version); no undocumented flags found

### Evidence

Flag inventory from the ENV_REFERENCE feature-flags table + any undocumented-flag gap list

### Pass / Fail

- **Pass**: all flags carry the documented governance columns and any undocumented flags are surfaced
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify flag enumeration covers all source files; diff code-declared flags against the ENV_REFERENCE feature-flags table and patch whichever side drifted

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/feature-flag-governance.md](../../feature_catalog/17--governance/feature-flag-governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 063
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/feature-flag-governance.md`
