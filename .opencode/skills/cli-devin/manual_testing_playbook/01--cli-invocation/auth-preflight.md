---
title: "DV-004 -- Auth pre-flight (devin auth status)"
description: "This scenario validates the cli-devin Provider Auth Pre-Flight contract: devin auth status MUST be checked before first dispatch and the skill never auto-substitutes auth state."
---

# DV-004 -- Auth pre-flight (devin auth status)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-004`.

---

## 1. OVERVIEW

This scenario validates the cli-devin Provider Auth Pre-Flight contract for `DV-004`. Per SKILL.md §3, the skill MUST run `devin auth status` once per session before first dispatch and MUST NOT silently substitute auth state when the operator is unauthenticated.

### Why This Matters

Auth pre-flight failures are a leading cause of silent dispatch failures across the cli-* family. Without the pre-flight, a calling AI may dispatch and receive an opaque error mid-session. The skill body's contract is "never auto-login" — pre-flight surfaces `devin auth login` and the token source URL to the operator, then waits.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin auth status` is checked before first dispatch and that an unauthenticated state surfaces a clear operator-facing message without auto-logging in.
- Real user request: `Verify that cli-devin checks devin auth status before dispatching, and that if I'm not logged in it tells me how to log in instead of silently failing.`
- Prompt: `Run devin auth status. If authenticated, dispatch a trivial default invocation. If not, surface devin auth login to the operator and refuse to dispatch — do NOT auto-login.`
- Expected execution process: Operator runs `devin auth status` -> if authenticated, dispatches a trivial default invocation -> if unauthenticated, the calling AI surfaces `devin auth login` and the token URL to the operator and refuses to dispatch.
- Expected signals: `devin auth status` exits 0 when authenticated (output names the handle/profile). When unauthenticated, exit non-zero and stderr names `devin auth login` and the token source `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge). The skill body never auto-substitutes auth state.
- Desired user-visible outcome: Operator-visible proof the auth pre-flight is wired correctly and that the skill respects the documented "never substitute" contract.
- Pass/fail: PASS if authenticated → dispatch succeeds, OR unauthenticated → operator gets the documented login command and URL with no auto-login. FAIL if the skill auto-logs-in or silently dispatches with stale auth.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `devin auth status` to capture the current state.
2. Branch on result:
   - Authenticated → dispatch a small default invocation, confirm exit 0.
   - Unauthenticated → confirm the calling AI surfaces `devin auth login` with the token URL and does NOT proceed.
3. (Optional) Test the negative path by temporarily logging out (`devin auth logout`), running pre-flight, then logging back in.
4. Return a PASS/FAIL verdict naming the auth state observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-004 | Auth pre-flight (`devin auth status`) | Verify auth pre-flight check + "never substitute" contract | `Run devin auth status. If authenticated, dispatch a trivial default invocation. If not, surface devin auth login to the operator and refuse to dispatch — do NOT auto-login.` | 1. `bash: devin auth status > /tmp/dv-004-status.txt 2>&1; echo "Exit: $?"` -> 2. `bash: cat /tmp/dv-004-status.txt` -> 3. If authenticated: `devin "say hi in one word" --model swe-1.6 --permission-mode auto > /tmp/dv-004-dispatch.txt 2>&1 </dev/null; echo "Dispatch exit: $?"` -> 4. If not authenticated: confirm the calling AI's output names `devin auth login` AND `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge) | Step 1: exit 0 or non-zero; Step 2: parseable status; Step 3 (authenticated path): dispatch exit 0; Step 4 (unauthenticated path): operator-visible message names login command + URL | `/tmp/dv-004-status.txt`, `/tmp/dv-004-dispatch.txt`, terminal transcript | PASS if authenticated→dispatch succeeds OR unauthenticated→operator gets login command and URL with no auto-login; FAIL if skill auto-logs-in or silently uses stale auth | (1) Confirm `~/.config/devin/config.json` exists; (2) try `devin --config <alt-path>` to test profile override; (3) check `devin --help` for current auth subcommands |

### Optional Supplemental Checks

- Test the explicit profile override: run with `--config /tmp/dv-004-alt-config.json` and verify auth state is read from the alternate file.
- Confirm token rotation: `devin auth logout && devin auth status` should report unauthenticated.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 Provider Auth Pre-Flight) | Documents the auth pre-flight contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Provider Auth Pre-Flight + RULES ALWAYS #2 |
| `../../references/cli_reference.md` | Auth subcommands and `--config` reference |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/auth-preflight.md`
