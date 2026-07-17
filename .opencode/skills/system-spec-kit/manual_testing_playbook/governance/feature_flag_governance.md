---
title: "063 -- Feature flag governance"
description: "This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance."
audited_post_018: true
version: 3.6.0.17
id: governance-feature-flag-governance
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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

Observed command transcript:

```text
Feature Flags Reference Table rows: 120
Unique SPECKIT_* tokens in lib/search/search-flags.ts: 91
Source SPECKIT_* tokens missing from table: 0
Rows missing required columns or env var: 0
```

Every `SPECKIT_*` token referenced in `lib/search/search-flags.ts` (91 unique) resolves to a governed row in the `ENV_REFERENCE.md` feature-flags table (120 rows). The table is the union of flags across all modules, so a table row with no match in `search-flags.ts` is expected, not drift: completion-freshness, semantic-trigger, feedback-retention, idempotency, and soft-delete flags are declared in their own modules and legitimately carry a table row without appearing in the search-flags source.

### Pass / Fail

- **PASS**: Every source flag carries the documented governance columns and no `search-flags.ts` token is missing from the feature-flags table (0 missing). An earlier evidence capture recorded 17 source flags missing; that drift has since been closed — the table now enumerates every `search-flags.ts` token, so re-running the scan reproduces 0 missing.

### Failure Triage

Verify flag enumeration covers all source files; diff code-declared flags against the ENV_REFERENCE feature-flags table and patch whichever side drifted — then open the drift as a tracked remediation item (spec folder or issue) and re-run this scenario to confirm closure. A recorded FAIL must not be left un-actioned in the transcript: a detector that fires without routing its finding to remediation is the gap this closure step exists to close.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [governance/feature_flag_governance.md](../../feature_catalog/governance/feature_flag_governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 063
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `governance/feature_flag_governance.md`
