---
title: "DESKTOP-001 -- Figma Desktop Required"
description: "This scenario validates the Figma Desktop precondition for `DESKTOP-001`. It focuses on enforcing the Desktop-open requirement and failing the no-session path clearly with a recovery."
version: 1.0.0.1
---

# DESKTOP-001 -- Figma Desktop Required

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DESKTOP-001`.

---

## 1. OVERVIEW

This scenario validates the Figma Desktop precondition for `DESKTOP-001`. It focuses on confirming the skill requires Figma Desktop open with a file before any CLI or daemon operation, and that with no live session the failure is clear and names the recovery, not a silent or fabricated success.

### Why This Matters

The CLI drives the live Figma Desktop session and has no Figma API key, so it cannot work without a Desktop session open with a file. The failure mode this guards against is the agent claiming to have read a Figma file when no live session exists. This is a critical-path scenario: the precondition must fail clearly, not silently.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `DESKTOP-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the Desktop-open precondition is enforced and the no-session path fails gracefully
- Real user request: `Show me the structure of my current Figma file.`
- Prompt: `Show me the structure of my current Figma file.`
- Expected execution process: confirm Figma Desktop is open with a file; if it is not, surface the requirement and recovery (open Figma with a file, then `connect --safe`) instead of proceeding
- Expected signals: with Figma open, the operation can proceed; with Figma closed or no file open, the agent reports the unmet precondition and the recovery path
- Desired user-visible outcome: the agent never claims to have read a Figma file when no live Desktop session exists
- Pass/fail: PASS if the precondition is enforced AND the no-session branch fails clearly with recovery; FAIL if the agent proceeds or fabricates a read with no live session

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. The precondition check stays local.
3. Execute the deterministic steps exactly as written, including the no-session negative branch.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: This scenario's negative branch deliberately runs with Figma Desktop closed or no file open; all other scenarios require Figma open.

1. agent confirms Figma Desktop is open with a file  # -> precondition stated
2. if not open, `figma-ds-cli daemon status` / a read verb surfaces the unreachable session  # -> clear "not running / no file open" failure
3. agent reports the requirement and recovery  # -> open Figma + `connect --safe`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DESKTOP-001 | Figma Desktop required | Verify the Desktop-open precondition is enforced and the no-session path fails clearly | `Show me the structure of my current Figma file.` | 1. agent confirms Figma Desktop is open with a file -> 2. if not open, `figma-ds-cli daemon status` / a read verb surfaces the unreachable session -> 3. agent reports the requirement and recovery | Step 1: precondition stated. Step 2: with no session, a clear "Figma Desktop not running / no file open" style failure. Step 3: recovery named (open Figma + `connect --safe`) | Transcript showing the precondition check and, for the negative branch, the clear failure plus recovery message | PASS if the precondition is enforced AND the no-session branch fails clearly with recovery. FAIL if the agent proceeds or fabricates a read with no live session | 1. Confirm the agent checked Figma was open before any read. 2. Confirm the closed-app branch produced a meaningful error. 3. Confirm the recovery path was surfaced, not a fake success. |

### Optional Supplemental Checks

Confirm the recovery instruction is consistent with the connect path: the recommended recovery is to open Figma with a file then `connect --safe` (the safe plugin bridge), never the yolo patch.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/connect_and_daemon/connect_and_daemon.md` | Feature-catalog source describing the connection prerequisite |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp_wiring.md` | Desktop-open requirement and the daemon model |
| `../../references/troubleshooting.md` | No-session failure modes and recovery paths |

---

## 5. SOURCE METADATA

- Group: Detection and Setup
- Playbook ID: DESKTOP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `detection-setup/figma-desktop-required.md`
