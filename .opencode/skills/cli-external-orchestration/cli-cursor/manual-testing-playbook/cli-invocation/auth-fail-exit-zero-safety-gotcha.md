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

- Objective: Verify the auth guard keys on `cursor-agent about` output text, never the exit code, citing both the historical live-verified auth-fail-exit-0 evidence quoted below and the current authenticated session as the positive-branch check.
- Real user request: `Make sure the Cursor dispatch guard can't be fooled by a "successful-looking" exit code when the account isn't actually logged in.`
- Prompt: `Confirm the cli-cursor auth guard keys on cursor-agent about output text, not exit code, citing the historical live-verified auth-fail-exit-0 evidence and the current session's authenticated state.`
- Expected execution process: Operator reviews the historical live evidence quoted in this section for the unauthenticated failure state captured earlier on this same machine -> runs `cursor-agent about` today to confirm the current positive-branch state (Pro tier) -> greps SKILL.md's Provider Auth Pre-Flight code block to confirm it checks output text (`grep -qi "not logged in"`) rather than `$?` -> does NOT run `cursor-agent logout` (that would destructively deauthenticate the operator's real, shared Cursor session just to reproduce a failure state already captured honestly elsewhere).
- Expected signals: The retained historical evidence shows, verbatim, `cursor-agent about` → `User Email: Not logged in` and `cursor-agent -p` → `Error: Authentication required. Run 'agent login', pass --api-key/--auth-token, or set CURSOR_API_KEY/CURSOR_AUTH_TOKEN.` with exit code `0`. The current `cursor-agent about` shows a real email (Pro tier). SKILL.md's pre-flight snippet greps for `"not logged in"` in `$CURSOR_ABOUT`, never inspects `$?` for auth purposes.
- Desired user-visible outcome: An auditable trail proving the guard is text-based, not exit-code-based, without requiring a destructive `cursor-agent logout` on the operator's authenticated machine to "prove" the gotcha live today.
- Pass/fail: PASS if the historical evidence, the current positive-branch check, and the SKILL.md guard code all agree that auth state is derived from output text and never from exit code. FAIL if SKILL.md's guard is found to check `$?`/exit status for auth purposes, or if the current positive-branch check contradicts the retained historical evidence. SKIP applies only when `cursor-agent` itself is unavailable or the current session cannot run the positive-branch `about` check for an environment reason; the retained historical citation never needs a live SKIP because it is quoted directly in this scenario.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Review the historical fail-closed evidence quoted in §2 (the unauthenticated `about`/`-p` output and the exit-0 observation).
2. Run `cursor-agent about` today and confirm the current authenticated (Pro tier) state as the positive-branch control.
3. Grep SKILL.md's "Provider Auth Pre-Flight" code block to confirm the guard's exact check.
4. Document the reproduction method an operator WOULD use to re-trigger the failure today (`cursor-agent logout`, then `cursor-agent -p` — noting the exit code would still read `0`), without actually executing it.
5. Return a PASS/FAIL verdict naming the exact grep evidence and the historical exit-code observation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-002 | Auth-fail-but-exit-0 safety gotcha | Verify the guard checks `cursor-agent about` output text, not exit code | `Confirm the cli-cursor auth guard keys on cursor-agent about output text, not exit code, citing the historical live-verified auth-fail-exit-0 evidence and the current session's authenticated state.` | 1. `bash: CURSOR_ABOUT=$(cursor-agent about 2>&1); echo "$CURSOR_ABOUT" \| grep -i "User Email"` -> 2. `bash: grep -A4 "CURSOR_ABOUT=\$(cursor-agent about" ../../SKILL.md` | Step 1: current output shows a real email, not "Not logged in" (the positive-branch control, contrasted with the historical "Not logged in" citation in §2); Step 2: SKILL.md's pre-flight snippet shown, confirming it greps `$CURSOR_ABOUT` text for `"not logged in"` and never reads `$?` for the auth decision | Current `about` output, SKILL.md pre-flight code block excerpt, and the historical unauthenticated evidence quoted in §2 | PASS if both live checks confirm the guard is text-based AND the quoted historical evidence in §2 remains uncontradicted; FAIL if the SKILL.md snippet is found to trust exit code, or if the current positive-branch check contradicts the retained historical evidence | (1) Re-run `cursor-agent about` if the current session state is ambiguous; (2) escalate to the operator if SKILL.md's guard code has drifted from this documented contract; SKIP only if `cursor-agent` itself is unavailable, blocking even the positive-branch `about` check |

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

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CU-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/auth-fail-exit-zero-safety-gotcha.md`
