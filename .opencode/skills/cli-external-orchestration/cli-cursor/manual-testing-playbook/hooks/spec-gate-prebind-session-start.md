---
title: "CU-020 -- Session-start spec-gate prebind matrix"
description: "Execute the Cursor prebind process suite across folder, enforcement, child, disabled, malformed, and repeated-start cases."
version: 2.0.0.0
---

# CU-020 -- Session-start spec-gate prebind matrix

This document captures the executable session-start prebind contract for `CU-020`.

---

## 1. OVERVIEW

This scenario executes `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs`. The suite invokes the real startup and enforce adapters in isolated workspaces so it can inspect persisted state without touching this repository's live gate-state directory.

### Why This Matters

Cursor's prompt event does not open Gate-3 state under the tested CLI build. The startup adapter makes enforcement reachable, so its no-op boundaries and handoff to the existing pre-tool consumer must be proven together rather than inferred from source.

---

## 2. SCENARIO CONTRACT

Operators run the isolated Node process suite and verify the committed configuration points to the tested real path.

- Objective: Prove startup state transitions and exemptions through the real adapter processes.
- Real user request: `Verify Cursor Gate-3 prebinding without changing autonomous child behavior.`
- Prompt: `Run the Cursor session-start spec-gate prebind matrix and report every state and exemption result.`
- Expected execution process: Run the Node test file, parse `.cursor/hooks.json`, and confirm the discovery symlink resolves.
- Expected signals: Nine passing subtests; valid binding allows, enforce-only startup denies, and disabled/child/malformed/missing-session rows write no state.
- Desired user-visible outcome: Safe opt-in enforcement for top-level Cursor sessions with explicit proof of child and fail-open behavior.
- Pass/fail: PASS only when all process tests and wiring checks succeed. FAIL on any state write in a no-op row, any invalid satisfied binding, or any unresolved configured path.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the real prebind process suite.
2. Confirm `.cursor/hooks.json` includes the real prebind path under `sessionStart`.
3. Confirm `.cursor/hooks/spec-gate-prebind.mjs` is a resolving relative symlink.
4. Record PASS only when all checks succeed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-020 | Session-start spec-gate prebind matrix | Prove startup state and exemption behavior | `Run the Cursor session-start spec-gate prebind matrix and report every state and exemption result.` | 1. `node --test .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` -> 2. parse `.cursor/hooks.json` and locate the prebind under `sessionStart` -> 3. `test -L .cursor/hooks/spec-gate-prebind.mjs && test -e .cursor/hooks/spec-gate-prebind.mjs` | Step 1 reports 9/9; step 2 resolves the tested real path; step 3 proves the mirror resolves | TAP output, parsed hook entry, symlink result | PASS when all three checks succeed; FAIL otherwise | Inspect the first failed matrix row, then compare persisted state with the shared core contract. |

### Optional Supplemental Checks

- Run the shared `spec-gate-core.test.mjs` suite to detect policy regressions outside the adapter.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| [`cursor-hooks-and-spec-gate.md`](../../../feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md) | Current implementation, registration, and test authority for Cursor hooks. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Session-start adapter under test. |
| `../../../../system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` | Isolated process matrix. |
| `../../../../system-spec-kit/runtime/hooks/cursor/README.md` | Runtime status and fail-open boundary. |
| `../../../../system-spec-kit/mcp-server/hooks/cursor/README.md` | Cursor event-delivery and shared-configuration reference for the `beforeSubmitPrompt` non-delivery premise |

---

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: CU-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/spec-gate-prebind-session-start.md`
- Feature catalog source: [`cursor-hooks-and-spec-gate.md`](../../../feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md)
- Default verdict: `PASS` when all process and wiring checks succeed
