---
title: "PI-021 -- Session-isolated goal hook and native command"
description: "Validates Pi native session binding, two-session isolation, lifecycle injection, legacy migration, and disabled fallback."
version: 2.0.0.0
---

# PI-021 -- Session-isolated goal hook and native command

## 1. OVERVIEW

Pi is the fully supported runtime-neutral goal path. `.opencode/hooks/goal/pi/goal-context.ts` obtains `ctx.sessionManager.getSessionId()` for input, session-start, turn-end, and the registered `/goal-pi` command. The command delegates parsing to the shared CLI but appends the native runtime, session, and workspace flags after user arguments, so prompt text cannot override the binding.

The `.pi/prompts/goal-pi.md` file is a fail-closed fallback. If it runs, the native extension command is unavailable and no goal mutation is allowed.

## 2. SCENARIO CONTRACT

- Objective: Prove two real Pi session ids can own different active goals, native management and lifecycle injection resolve the same scope, a resumed id restores its goal, a new id starts empty, explicit legacy migration targets only the current id, and disabled discovery produces no unbound fallback.
- Real user request: `Keep this Pi session on Goal A while another Pi session works on Goal B.`
- Prompt: `Use the native Pi goal command to set different goals in two isolated session ids, prove each id reads and injects only its own goal, then verify resume, missing identity, legacy migration, and disabled fallback behavior.`
- Expected execution process: load the extension explicitly against temporary state -> set A and B through `/goal-pi` -> inspect scoped files and command output -> run the adapter matrix -> exercise legacy migration in temporary state -> disable discovery and confirm the fallback never calls the CLI.
- Expected signals: two opaque `pi-<sha256>.json` files, distinct A/B objectives, same-id resume, new-id no goal, no raw session id in filenames, `MISSING_SESSION_ID` for unbound CLI mutation, and `UNSUPPORTED_SESSION_BINDING` from the prompt fallback.
- Desired user-visible outcome: PASS/FAIL with the two objectives, state-file count, and exact error code for every negative boundary.
- Pass/fail: PASS only if A/B stay isolated through set, read, turn mutation, resume, and completion; migration binds one explicit empty target; and no disabled or missing-id path selects a goal.

## 3. TEST EXECUTION

### Recommended orchestration process

1. Create temporary state and session directories.
2. Invoke two explicit Pi sessions with the goal extension loaded directly.
3. Set one objective per session using the registered `/goal-pi` command.
4. Show each objective using the same native session id.
5. Run the automated adapter matrix for injection, turn-end non-owner preservation, resume/new-id, migration bridge, and missing identity.
6. Confirm `.pi/settings.json` can disable normal discovery without removing the extension source or state.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| PI-021 | Session-isolated goal hook and native command | Two Pi sessions manage and inject different goals without collision | `Use the native Pi goal command to set different goals in two isolated session ids, prove each id reads and injects only its own goal, then verify resume, missing identity, legacy migration, and disabled fallback behavior.` | `MK_GOAL_STATE_DIR=<temp> pi --no-extensions --extension .opencode/hooks/goal/pi/goal-context.ts --offline --session-dir <temp-sessions> --session-id session-a --print --no-tools "/goal-pi set Goal A"`; repeat for `session-b` and `Goal B`; run `node --test .opencode/hooks/goal/pi/goal-pi.test.mjs` | Two scoped files; A output/state contains only Goal A; B contains only Goal B; adapter suite passes native command, input, turn-end, resume/new-id, and missing-id rows | Native command envelopes, scoped JSON inspection, test summary | PASS when state and output stay isolated and every negative boundary fails closed | Verify extension registration first; then inspect appended CLI flags and the native `getSessionId()` value; do not bypass the command with a guessed shell binding |

### Legacy migration and rollback

Use the temporary-state procedure in the hub scenario [`goal-manage-cli.md`](../../../manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md). Run `legacy-migrate` through `/goal-pi` only for the intended native session. An occupied target must return `TARGET_SCOPE_OCCUPIED`.

For rollback, add `-extensions/goal-context.ts` to `.pi/settings.json`, preserve all scoped and quarantined files, and verify a new Pi session receives no `[active_goal]` block. Do not merge session files into a singleton.

### Automated companion gate

```bash
node --test \
  .opencode/hooks/goal/lib/goal-core.test.cjs \
  .opencode/hooks/goal/bin/goal.test.cjs \
  .opencode/hooks/goal/pi/goal-pi.test.mjs
```

## 4. SOURCE FILES

|| File | Role |
||---|---|
|| `../../../../../hooks/goal/pi/goal-context.ts` | Native session identity, lifecycle binding, and registered `/goal-pi`. |
|| `../../../../../hooks/goal/pi/goal-pi.test.mjs` | A/B, resume/new-id, turn-end, native command, override resistance, and missing-id coverage. |
|| `../../../../../hooks/goal/bin/goal.cjs` | Shared parser and command envelope. |
|| `.pi/prompts/goal-pi.md` | Fail-closed fallback when native command registration is unavailable. |
|| `.pi/settings.json` | Normal discovery enable/disable control. |

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: PI-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt equals the table Exact Prompt cell.
