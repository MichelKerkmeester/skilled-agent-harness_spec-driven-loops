---
title: "FAIL-001 -- Missing Auth Recovery"
description: "This scenario validates Missing Auth Recovery for `FAIL-001`. Objective: Verify that after `cupt logout`, commands fail with AuthError and `cupt auth` re."
---

# FAIL-001 -- Missing Auth Recovery

---

## 1. OVERVIEW

Validates that **Missing Auth Recovery** behaves as defined in the feature catalog.

### Why This Matters

Verify that after `cupt logout`, commands fail with AuthError and `cupt auth` restores function is required for correct agent operation. Failure here means step 2 does not show autherror (logout failed) or step 4 fails after recovery.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify that after `cupt logout`, commands fail with AuthError and `cupt auth` restores function
- **Real user request:** `Simulate missing credentials and recover.`
- **Prompt:** `Simulate missing auth by logging out, then recover with re-authentication.`
- **Expected signals:** Step 2: AuthError message; exit non-zero. Step 4: workspace name displayed; exit 0.
- **Desired user-visible outcome:** Agent reports: credentials cleared; re-authenticated successfully; workspace accessible.
- **Pass/fail:** PASS if step 2 shows AuthError AND step 4 shows workspace name; FAIL if step 2 does NOT show AuthError (logout failed) OR step 4 fails after recovery

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Run against a non-production workspace; have credentials ready to re-enter.
1. `cupt logout`  # → exit 0
2. `cupt status`  # → AuthError: No credentials found
3. `cupt config --api-token pk_TEST_TOKEN`  # → exit 0
4. `cupt status`  # → workspace name displayed

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| FAIL-001 | Missing Auth Recovery | Verify that after `cupt logout`, commands fail with Aut | `Simulate missing auth by logging out, then recover with` | Step 2: AuthError message; exit non-zero. Step 4: workspace name displayed; exit | PASS if step 2 shows AuthError AND step 4 shows workspace name; FAIL if step 2 does NOT show AuthError (logout failed) OR step  | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/01--cupt-authentication/008-logout.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: Recovery
- Playbook ID: FAIL-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--recovery-and-failure/001-missing-auth.md`
