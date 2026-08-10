---
title: "CU-027 -- Session-bound Cursor goal injection"
description: "Validates Cursor A/B injection isolation, missing-identity behavior, registration truth, and unsupported management."
version: 2.0.0.0
---

# CU-027 -- Session-bound Cursor goal injection

## 1. OVERVIEW

Cursor's `sessionStart` payload supplies `session_id`, with `conversation_id` as a fallback. `.opencode/hooks/goal/cursor/goal-inject.mjs` uses that native value with runtime `cursor` and the payload workspace. It injects only the matching scoped goal and records a turn touch.

Cursor management is intentionally unsupported. The prompt command does not receive the hook's current-session identity, so `.cursor/commands/goal-cursor.md` returns `UNSUPPORTED_SESSION_BINDING` and never invokes the shared CLI.

## 2. SCENARIO CONTRACT

- Objective: Prove two Cursor identities receive different goal blocks, missing identity and legacy-only state inject nothing, the registration points to the tracked adapter, and the management prompt cannot bypass native identity.
- Real user request: `Keep two Cursor conversations on separate goals.`
- Prompt: `Invoke the Cursor goal adapter with two native session payloads, prove each response contains only its own objective, then verify missing identity, legacy-only state, registration, and unsupported management behavior.`
- Expected execution process: set A/B with explicit CLI bindings in temporary state -> invoke the adapter once per native payload -> compare responses and state bytes -> invoke missing-id and legacy-only cases -> inspect `.cursor/hooks.json` and `/goal-cursor`.
- Expected signals: A and B return distinct `agent_message` blocks; A's turn touch leaves B byte-equivalent; `{}` returns only `{"permission":"allow"}`; legacy-only state never injects; command output is `UNSUPPORTED_SESSION_BINDING` with no CLI call.
- Desired user-visible outcome: PASS/FAIL naming injection support and management non-support separately.
- Pass/fail: PASS when scoped injection is isolated and every ambiguous management or identity path fails closed. A hook response alone is not a claim that a specific Cursor client build made the text model-visible.

## 3. TEST EXECUTION

### Recommended orchestration process

1. Create a temporary `MK_GOAL_STATE_DIR`.
2. Set Goal A and Goal B with explicit Cursor session flags.
3. Invoke the adapter with `session_id: session-a` and `session_id: session-b`.
4. Verify the response objectives and non-owner file bytes.
5. Repeat with `conversation_id`, missing identity, disabled state, malformed scoped state, and legacy-only state.
6. Parse `.cursor/hooks.json` and inspect the fail-closed command document.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CU-027 | Session-bound Cursor goal injection | A/B payload isolation and unsupported management | `Invoke the Cursor goal adapter with two native session payloads, prove each response contains only its own objective, then verify missing identity, legacy-only state, registration, and unsupported management behavior.` | Set A/B with `node .opencode/hooks/goal/bin/goal.cjs --runtime cursor --session <id> --workspace "$PWD" set <goal>`; pipe matching JSON payloads to `node .opencode/hooks/goal/cursor/goal-inject.mjs`; run `node --test .opencode/hooks/goal/cursor/goal-cursor.test.mjs` | Distinct A/B blocks, turn touch isolation, missing-id no-op, valid registration, command without CLI invocation | Adapter JSON, byte comparison, parsed config, test summary | PASS when injection is session-bound and management stays explicitly unsupported | Check payload identity first; then workspace and runtime; never repair management by inventing a default id |

### Rollback

Set `MK_GOAL_PLUGIN_DISABLED=1` or remove the Cursor goal registration as one controlled change. Preserve scoped and quarantined state. A disabled adapter must return only `{"permission":"allow"}` and must not increment any goal record.

## 4. SOURCE FILES

|| File | Role |
||---|---|
|| `../../../../../hooks/goal/cursor/goal-inject.mjs` | Session-bound Cursor injection. |
|| `../../../../../hooks/goal/cursor/goal-cursor.test.mjs` | A/B, fallback, missing-id, corrupt-state, and command-safety coverage. |
|| `.cursor/hooks.json` | Registers the tracked adapter under `sessionStart`. |
|| `.cursor/commands/goal-cursor.md` | Explicit unsupported-management response. |
|| `../../../../../hooks/goal/README.md` | Current runtime support matrix. |

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CU-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt equals the table Exact Prompt cell.
