---
title: "063 -- Feature flag governance"
description: "This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance and the compiled-routing tri-state contract."
audited_post_018: true
version: 4.0.0.0
id: governance-feature-flag-governance
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 063 -- Feature flag governance

## 1. OVERVIEW

This scenario validates Feature flag governance for `063`. It focuses on confirming governance policy conformance — every code-declared flag carries its documented governance columns — and on the `SPECKIT_COMPILED_ROUTING` tri-state contract that six other skill catalogs depend on.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm governance policy conformance and that the compiled-routing gate resolves per its documented tri-state.
- Real user request: `Please validate Feature flag governance against the documented validation surface and tell me whether the expected signals are present: all flags enumerated with default state, governing env var, gated automation, and added-in version; no undocumented flags found; SPECKIT_COMPILED_ROUTING honors unset, 1, and 0.`
- Prompt: `Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All flags enumerated with default state, governing env var, gated automation, and added-in version (the documented governance columns); no undocumented flags found; `compiled-route-status.cjs --all` emits one record per eligible hub with a `causeCode`; `SPECKIT_COMPILED_ROUTING=0` forces every eligible hub to legacy
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if every code-declared flag carries the documented governance columns, no undocumented flag exists in code, and the compiled-routing kill-switch demonstrably forces legacy

---

## 3. TEST EXECUTION

### Prompt

```
Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.
```

### Commands

1. Enumerate the `SPECKIT_*` and `SYSTEM_SKILL_ADVISOR_*` tokens declared across the surviving flag read sites, not from one module. The memory engine's `lib/search/search-flags.ts`, which used to be the single enumeration source for this scenario, was deleted with that engine.
2. Diff that token set against the `ENV-REFERENCE.md` feature-flags table and against `.env.example`.
3. Verify each table row carries default state, env var, gated automation, and added-in version.
4. Record any flag present in code but missing from either document, and any row documenting a flag no code reads.
5. Run `node .opencode/bin/compiled-route-status.cjs --all` and confirm one record per eligible hub, each with a `causeCode` from the documented four.
6. Re-run step 5 with `SPECKIT_COMPILED_ROUTING=0` and confirm every eligible hub reports `flag-off`.

### Expected

All flags enumerated with the documented governance columns (default, env, automation, added-in version); zero flags in code missing from the table; zero table rows for flags no surviving code reads; `--all` emits one record per eligible hub; the `=0` kill-switch forces every eligible hub to `flag-off`.

### Evidence

The recorded transcript for this scenario predates the memory decommission. It counted 91 unique `SPECKIT_*` tokens in `lib/search/search-flags.ts` against 120 `ENV-REFERENCE.md` rows — a module and a table that the decommission removed and rewrote. Those numbers were removed rather than reinterpreted, because a stale count reads as a passing audit.

Re-execute the Commands block against the surviving flag surface and capture the transcript here before this scenario carries a verdict again.

### Pass / Fail

**SKIP**

Reason: the enumeration source was rewired from a deleted module to the surviving flag read sites, and the scenario has not been re-executed. The blocker is a missing run, not a governance defect.

### Failure Triage

Verify the enumeration covers every surviving flag read site rather than one module — enumerating from a single file is exactly how this scenario went stale. Diff code-declared flags against the `ENV-REFERENCE.md` table and `.env.example`, patch whichever side drifted, then open the drift as a tracked remediation item (spec folder or issue) and re-run this scenario to confirm closure. A recorded FAIL must not be left un-actioned in the transcript: a detector that fires without routing its finding to remediation is the gap this closure step exists to close. If step 6 does not force legacy, inspect the tri-state parser in `compiled-routing-flag.ts` and the runtime resolver for divergence — they are meant to be single-sourced.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [governance/feature-flag-governance.md](../../feature-catalog/governance/feature-flag-governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 063
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `governance/feature-flag-governance.md`
