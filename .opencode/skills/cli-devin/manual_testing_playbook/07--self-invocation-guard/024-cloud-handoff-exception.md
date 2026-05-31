---
title: "DV-020 -- Cloud-handoff exception allowed (explicit keywords)"
description: "This scenario validates the self-invocation guard's only legitimate exception: explicit cloud-handoff keywords combined with operator confirmation allow the dispatch to proceed because the cloud session is a separate sandbox."
---

# DV-020 -- Cloud-handoff exception allowed (explicit keywords)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-020`.

---

## 1. OVERVIEW

This scenario validates the cloud-handoff exception to the self-invocation guard for `DV-020`. Per SKILL.md §2, explicit cloud-handoff keywords (`cloud handoff`, `hand off to cloud`, `devin cloud`) combined with operator confirmation in the same turn allow the dispatch to proceed because the cloud session is a separate sandbox, not self-invocation.

### Why This Matters

Without this exception, a local Devin session could never initiate a cloud handoff via cli-devin because the env-var probe would always trip. The exception is the load-bearing escape hatch that makes cloud-handoff orchestration work even from within Devin itself.

**v1.0.2.0 SKIP RATIONALE (reaffirmed)**: This is an **operator-runnable manual test of cli-devin's smart-router logic**, NOT a shell-automatable binary test. Both the self-invocation guard (DV-019) and the cloud-handoff exception (this scenario) live in cli-devin's SKILL.md §2 pseudocode, which is executed by the calling AI loading the skill. The `devin` binary has no concept of either. Wave-2 confirmed shell automation cannot drive this — an actual orchestrator session is required to observe refuse-vs-allow under different keyword + confirmation combinations. Operators can validate manually by setting `DEVIN_SESSION_ID=test` and feeding the orchestrator a prompt with cloud-handoff keywords + explicit confirmation, then observing whether cli-devin allows the dispatch through. This SKIP is the correct disposition, not a deferred fix.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the guard allows dispatch when DEVIN_* env is set AND explicit cloud-handoff keywords AND operator confirmation are all present in the same turn.
- Real user request: `I'm inside a local Devin session and want to hand the work off to the cloud — here's my explicit approval to use the cloud-handoff exception.`
- Prompt: `Simulate a local devin session (DEVIN_SESSION_ID=test set), but include "cloud handoff" in the dispatch request AND record an explicit operator confirmation in the same turn. Verify the guard allows the dispatch to proceed past the env-var check.`
- Expected execution process: Operator simulates local Devin session -> submits a request that includes "cloud handoff" keywords AND explicit operator-confirmation language -> calling AI runs the guard -> guard detects env-var but ALSO detects the exception triggers -> proceeds with the dispatch (running the 5-check gate from DV-017/DV-018 next).
- Expected signals: With `DEVIN_*` env set AND cloud-handoff keywords AND operator confirmation, the guard allows the dispatch to proceed. With env set but missing either keywords or confirmation, the guard refuses.
- Desired user-visible outcome: Evidence that the documented exception works — operators can initiate cloud handoff from a local Devin session without tripping the guard, but only with explicit phrasing and confirmation.
- Pass/fail: PASS if the guard allowed the dispatch when both triggers were present AND refused when one was missing. FAIL if the guard refused even when both triggers were present, OR if the guard allowed when only one trigger was present.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Set `DEVIN_SESSION_ID=test`.
2. Submit Request A: includes "cloud handoff" keywords AND explicit operator confirmation ("approved to use cloud-handoff exception").
3. Observe whether the guard allows or refuses.
4. Submit Request B (negative control): includes "cloud handoff" keywords but NO operator confirmation.
5. Observe whether the guard refuses Request B.
6. Submit Request C (negative control): explicit operator confirmation but NO "cloud handoff" keywords.
7. Observe whether the guard refuses Request C.
8. Unset env var.
9. Return a PASS/FAIL verdict comparing all three observations.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-020 | Cloud-handoff exception allowed (explicit keywords) | Verify the guard's only legitimate exception works (and refuses without both triggers) | `Simulate a local devin session (DEVIN_SESSION_ID=test set), but include "cloud handoff" in the dispatch request AND record an explicit operator confirmation in the same turn. Verify the guard allows the dispatch to proceed past the env-var check.` | 1. `bash: export DEVIN_SESSION_ID=test` -> 2. Request A: `"I want to initiate a cloud handoff for the refactor task. I explicitly approve using the cloud-handoff exception to the self-invocation guard."` -> 3. Observe: guard allows the dispatch to proceed (next step would be the 5-check gate). -> 4. Request B: `"I want to initiate a cloud handoff for the refactor task. Just checking what would happen."` -> 5. Observe: guard refuses (missing operator confirmation). -> 6. Request C: `"I explicitly approve the dispatch. Let's go ahead."` -> 7. Observe: guard refuses (missing cloud-handoff keywords). -> 8. `bash: unset DEVIN_SESSION_ID` | Step 3 (A): guard ALLOWS; Step 5 (B): guard REFUSES; Step 7 (C): guard REFUSES | Calling AI's transcripts for all three requests, guard-decision evidence | PASS if guard allowed A AND refused both B and C; FAIL if guard refused A OR allowed B or C | (1) Verify SKILL.md §2 includes the `has_cloud_handoff_keywords` exception logic; (2) check if the calling AI is reading both signals; (3) audit reasoning trace for false positives |

### Optional Supplemental Checks

- Test variant keywords: "hand off to cloud", "devin cloud", "close laptop" — each should trigger the exception when combined with operator confirmation.
- Confirm that allowing past the guard does NOT skip the 5-check gate from DV-017 (defense in depth — both gates apply).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§2 Self-Invocation Guard) | Authoritative exception logic |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §2 `has_cloud_handoff_keywords()` exception |
| `../../references/cloud_handoff.md` | Full handoff narrative including the exception |

---

## 5. SOURCE METADATA

- Group: Self-Invocation Guard
- Playbook ID: DV-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--self-invocation-guard/024-cloud-handoff-exception.md`
