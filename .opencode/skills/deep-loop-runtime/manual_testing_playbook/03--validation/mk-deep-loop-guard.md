---
title: "DLR-052 -- mk-deep-loop-guard"
description: "Manual validation scenario for mk-deep-loop-guard in the deep-loop-runtime skill."
version: 1.0.0.0
---

# DLR-052 -- mk-deep-loop-guard

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-052`.

---

## 1. OVERVIEW

Detection-layer OpenCode plugin (`tool.execute.before` hook) that flags/blocks a Task dispatch whose declared Deep Route mode disagrees with `mode-registry.json`'s entry for the actual `subagent_type` being dispatched.

### Why This Matters

If this plugin silently stops firing (hook deregistered, registry path resolution breaks, or the warn/reject toggle inverts), a real Deep Route mismatch could go undetected in production dispatch, or a false positive could start blocking unrelated correctly-routed work.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm mk-deep-loop-guard fires on a real Task dispatch, respects the warn/reject toggle, fails open on registry errors, and ignores non-deep-mode dispatches.
- Layer partition: validation runtime (OpenCode plugin surface, pre-dispatch side).
- Real user request: `Verify mk-deep-loop-guard still detects a Deep Route mode mismatch and respects MK_DEEP_LOOP_GUARD_REJECT.`
- Expected signals: Hook fires and logs a warning on mismatch (default); throws and blocks the dispatch when `MK_DEEP_LOOP_GUARD_REJECT=1` is set; stays silent on matching modes, non-deep `subagent_type` values, and when the registry is unreadable.
- Pass/fail: PASS only if the automated test exits 0 AND a live dispatch reproduces both the warn and reject behaviors; FAIL if the hook doesn't fire, the toggle doesn't change behavior, or a registry read failure blocks an unrelated dispatch.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `opencode` CLI is installed and reachable (`opencode --version`).
- Feature catalog entry exists at `feature_catalog/03--validation/mk-deep-loop-guard.md`.

### Steps

1. Run the automated regression test: `node .opencode/plugins/__tests__/mk-deep-loop-guard.test.cjs` and require EXIT 0.
2. Live warn-mode check: dispatch a Task call with `subagent_type=ai-council` and a prompt containing `mode=research` via `opencode run --agent general "..."`; confirm `[mk-deep-loop-guard] WARN: ... mode mismatch ...` appears and the dispatch still completes.
3. Live reject-mode check: repeat step 2 with `MK_DEEP_LOOP_GUARD_REJECT=1` set; confirm the `task` tool call's status becomes `"error"` and the dispatch is blocked.
4. Live fail-open check: temporarily move `mode-registry.json` aside, repeat step 3; confirm the dispatch completes normally (not blocked) despite reject mode being on.
5. Live passthrough check: with reject mode still on, dispatch `subagent_type=review` (not a registry entry); confirm it completes normally.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

The automated test passes, and all four live-dispatch checks (warn, reject, fail-open, passthrough) match their expected signal.

### Failure Modes

- Hook never fires (plugin loader silently drops the file — check for accidental named exports alongside the default export; the `.opencode/plugins/README.md` load-bearing warning covers this).
- `MK_DEEP_LOOP_GUARD_REJECT=1` no longer blocks the dispatch (OpenCode host behavior change, or a regression in the throw path).
- A missing/corrupt `mode-registry.json` starts blocking unrelated dispatches instead of failing open.
- Evidence is inferred from memory instead of captured from current source or live command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `.opencode/plugins/mk-deep-loop-guard.js` | OpenCode plugin entrypoint; registers and implements the `tool.execute.before` hook. |

### Validation

| File | Role |
|---|---|
| `.opencode/plugins/__tests__/mk-deep-loop-guard.test.cjs` | Hermetic regression coverage for export shape, warn/reject toggle, fail-open, and non-deep passthrough. |

---

## 5. SOURCE_METADATA

- Group: Validation
- Playbook ID: DLR-052
- Feature catalog entry: `feature_catalog/03--validation/mk-deep-loop-guard.md`
- Scenario file path: `manual_testing_playbook/03--validation/mk-deep-loop-guard.md`
- Expected verdict mode: GREEN when the automated test and all 4 live-dispatch checks pass
- Wall-time estimate: 10-20 min (live checks require real `opencode` dispatches)
