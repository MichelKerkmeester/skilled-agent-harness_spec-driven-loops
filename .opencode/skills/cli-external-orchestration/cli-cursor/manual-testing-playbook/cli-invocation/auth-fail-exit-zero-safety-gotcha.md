---
title: "CU-002 -- Auth-fail-but-exit-0 safety gotcha"
description: "This scenario validates the auth-fail-but-exit-0 safety gotcha for `CU-002`. It focuses on confirming the cli-cursor guard keys on cursor-agent about output text, never the exit code, since a -p dispatch without valid auth exits 0."
version: 1.0.0.0
---

# CU-002 -- Auth-fail-but-exit-0 safety gotcha

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-002`.

---

## 1. OVERVIEW

This scenario validates the Cursor-specific auth-fail-but-exit-0 safety gotcha for `CU-002`. It focuses on confirming that the guard in SKILL.md's Provider Auth Pre-Flight checks `cursor-agent about` output text, never the exit code, since a `-p` dispatch without valid auth returns `Error: Authentication required...` but still exits `0`.

### Why This Matters

This is the single most dangerous trap in `cli-cursor`'s dispatch surface. A naive executor guard that treats exit code `0` as proof of a successful, authenticated dispatch will silently report success on a request that never reached a model. SKILL.md §3 "Provider Auth Pre-Flight" and §4 NEVER rule 6 both exist specifically to prevent this. This scenario is on the critical-path list (§5 of the root playbook) and is additionally safety-critical enough to independently gate release readiness: a `FAIL` here means the guard itself cannot be trusted.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify the auth guard keys on `cursor-agent about` output text, never the exit code, citing both the historical live-verified auth-fail-exit-0 evidence from phase 001 of this creation packet and the current authenticated session as the positive-branch check.
- Real user request: `Make sure the Cursor dispatch guard can't be fooled by a "successful-looking" exit code when the account isn't actually logged in.`
- Prompt: `Confirm the cli-cursor auth guard keys on cursor-agent about output text, not exit code, citing the historical live-verified auth-fail-exit-0 evidence and the current session's authenticated state.`
- Expected execution process: Operator reads phase 001's `implementation-summary.md` for the historical live evidence captured on this same machine while it was unauthenticated -> runs `cursor-agent about` today to confirm the current positive-branch state (Pro tier) -> greps SKILL.md's Provider Auth Pre-Flight code block to confirm it checks output text (`grep -qi "not logged in"`) rather than `$?` -> does NOT run `cursor-agent logout` (that would destructively deauthenticate the operator's real, shared Cursor session just to reproduce a failure state already captured honestly elsewhere).
- Expected signals: Phase 001's `implementation-summary.md` shows, verbatim, `cursor-agent about` → `User Email: Not logged in` and `cursor-agent -p` → `Error: Authentication required. Run 'agent login', pass --api-key/--auth-token, or set CURSOR_API_KEY/CURSOR_AUTH_TOKEN.` with exit code `0`. The current `cursor-agent about` shows a real email (Pro tier, live-verified in phase 005). SKILL.md's pre-flight snippet greps for `"not logged in"` in `$CURSOR_ABOUT`, never inspects `$?` for auth purposes.
- Desired user-visible outcome: An auditable trail proving the guard is text-based, not exit-code-based, without requiring a destructive `cursor-agent logout` on the operator's authenticated machine to "prove" the gotcha live today.
- Pass/fail: PASS if the historical evidence, the current positive-branch check, and the SKILL.md guard code all agree that auth state is derived from output text and never from exit code. FAIL if SKILL.md's guard is found to check `$?`/exit status for auth purposes, or if the historical evidence cannot be located. SKIP is not expected for this scenario since the required evidence already exists in this repo and does not require live-reproducing the failure.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read phase 001's `implementation-summary.md` "Auth" and "Non-interactive dispatch" sections for the historical fail-closed evidence.
2. Run `cursor-agent about` today and confirm the current authenticated (Pro tier) state as the positive-branch control.
3. Grep SKILL.md's "Provider Auth Pre-Flight" code block to confirm the guard's exact check.
4. Document the reproduction method an operator WOULD use to re-trigger the failure today (`cursor-agent logout`, then `cursor-agent -p` — noting the exit code would still read `0`), without actually executing it.
5. Return a PASS/FAIL verdict naming the exact grep evidence and the historical exit-code observation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-002 | Auth-fail-but-exit-0 safety gotcha | Verify the guard checks `cursor-agent about` output text, not exit code | `Confirm the cli-cursor auth guard keys on cursor-agent about output text, not exit code, citing the historical live-verified auth-fail-exit-0 evidence and the current session's authenticated state.` | 1. `bash: grep -A3 "User Email: Not logged in" ../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin/implementation-summary.md` -> 2. `bash: grep -A1 "exited 0" ../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin/implementation-summary.md` -> 3. `bash: CURSOR_ABOUT=$(cursor-agent about 2>&1); echo "$CURSOR_ABOUT" \| grep -i "User Email"` -> 4. `bash: grep -A4 "CURSOR_ABOUT=\$(cursor-agent about" ../../SKILL.md` | Step 1: historical "Not logged in" line found; Step 2: historical exit-0-on-auth-failure note found; Step 3: current output shows a real email, not "Not logged in"; Step 4: SKILL.md's pre-flight snippet shown, confirming it greps `$CURSOR_ABOUT` text for `"not logged in"` and never reads `$?` for the auth decision | Grep output for both historical citations, current `about` output, SKILL.md pre-flight code block excerpt | PASS if all four greps return matching evidence AND the SKILL.md snippet never keys the auth decision on exit code; FAIL if the SKILL.md snippet is found to trust exit code, or if the historical citation is missing/contradicted | (1) Re-read phase 001 `implementation-summary.md` in full if the grep misses; (2) re-run `cursor-agent about` if the current session state is ambiguous; (3) escalate to the operator if SKILL.md's guard code has drifted from this documented contract |

### Optional Supplemental Checks

- If an operator explicitly authorizes a destructive live reproduction, run `cursor-agent logout` followed by `cursor-agent -p "say hi" --output-format text </dev/null; echo "exit=$?"` and confirm `exit=0` alongside the `Error: Authentication required` text, then immediately `cursor-agent login` to restore the operator's session. This is NOT the default execution path for `CU-002` given the destructive blast radius to the operator's real, shared account state.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Provider Auth Pre-Flight, §4 NEVER rule 6) | Documents the text-based auth guard and forbids trusting exit code |
| `../../references/cli-reference.md` (§3 Authentication, §6 Exit Codes, §11 Troubleshooting) | Authoritative auth-state and exit-code reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Provider Auth Pre-Flight decision tree (§3) and Dispatch-Critical Gotchas (§3) |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin/implementation-summary.md` | Historical live evidence: unauthenticated `about`/`-p` output and the exit-0 observation, captured on this same machine before login |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CU-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/auth-fail-exit-zero-safety-gotcha.md`
