---
title: "DLR-052 -- mk-deep-loop-guard"
description: "Manual validation scenario for mk-deep-loop-guard in the runtime/ skill."
version: 1.1.0.0
---

# DLR-052 -- mk-deep-loop-guard

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-052`.

---

## 1. OVERVIEW

Detection-layer OpenCode plugin (`tool.execute.before` hook) with two independent checks: (1) flags/blocks a Task dispatch whose declared Deep Route mode disagrees with `mode-registry.json`'s entry for the resolved target agent; (2) flags/blocks a session-scoped loop-like repeated hand-off from `orchestrate` to a command-owned loop executor (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) that lacks a command-driven iteration marker. Both checks share `resolveTargetIdentity()`, which parses the real target agent from `Deep Route: ... target_agent=@X` / `Agent: @X` prompt text, since real `orchestrate`-issued dispatches always set `subagent_type: "general"`.

### Why This Matters

If this plugin silently stops firing (hook deregistered, registry path resolution breaks, or the warn/reject toggle inverts), a real Deep Route mismatch could go undetected in production dispatch, or a false positive could start blocking unrelated correctly-routed work. If identity resolution regresses, both checks silently no-op for every real `orchestrate`-routed dispatch (the exact path they were built to guard), since `orchestrate.md` always sets `subagent_type: "general"`. If loop-repeat detection regresses, `orchestrate` could re-implement a `/deep:*` command's own iteration loop by repeatedly hand-dispatching the same loop executor without the parent command's convergence/state ownership.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm mk-deep-loop-guard fires on a real Task dispatch, respects the warn/reject toggle for both checks, resolves identity correctly under `subagent_type="general"`, fails open on registry/state errors, and ignores non-deep-mode and non-loop-executor dispatches.
- Layer partition: validation runtime (OpenCode plugin surface, pre-dispatch side).
- Real user request: `Verify mk-deep-loop-guard still detects a Deep Route mode mismatch and a loop-like repeated dispatch, and respects MK_DEEP_LOOP_GUARD_REJECT / MK_DEEP_LOOP_GUARD_REJECT_LOOP.`
- Expected signals: Hook fires and logs a warning on mismatch or loop-repeat (default); throws and blocks the dispatch when the matching reject env var is set; stays silent on matching modes, command-driven iterations, non-deep/non-loop-executor `subagent_type` values, and when the registry/state directory is unreadable.
- Pass/fail: PASS only if the automated test exits 0 AND a live dispatch reproduces the mismatch+reject behavior; FAIL if the hook doesn't fire, either toggle doesn't change behavior, or a registry/state read failure blocks an unrelated dispatch.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `opencode` CLI is installed and reachable (`opencode --version`).
- Feature catalog entry exists at `feature-catalog/validation/mk-deep-loop-guard.md`.

### Steps

1. Run the automated regression test: `node .opencode/plugins/tests/mk-deep-loop-guard.test.cjs` and require EXIT 0 (covers identity resolution, loop-repeat thresholds, command-driven exemption, non-loop-executor exemption, cross-session isolation, and both fail-open paths hermetically).
2. Live warn-mode check: dispatch a Task call with a prompt containing `Agent: @ai-council` (or a direct `subagent_type=ai-council`) and `mode=research` via `opencode run --agent general "..."`; confirm a `[mk-deep-loop-guard] WARN: ... mode mismatch ...` line is appended to `.opencode/skills/.loop-guard-state/guard-warnings.log` (not printed to the console/TUI) and the dispatch still completes.
3. Live reject-mode check: repeat step 2 with `MK_DEEP_LOOP_GUARD_REJECT=1` set; confirm the `task` tool call's status becomes `"error"` and the dispatch is blocked, and that identity resolution correctly named the resolved agent (not the literal `"general"` placeholder) in the thrown message.
4. Live fail-open check: temporarily move `mode-registry.json` aside, repeat step 3; confirm the dispatch completes normally (not blocked) despite reject mode being on.
5. Live passthrough check: with reject mode still on, dispatch `subagent_type=review` (not a registry entry); confirm it completes normally.
6. Confirm no `.opencode/skills/.loop-guard-state/` file is created for a non-loop-executor target (e.g. `ai-council`) after any of the above live dispatches.
7. Retention check: with `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS=1` set, write a per-session state file, backdate its mtime with `touch -t` (or `utimes`) to more than 1 day in the past, then fire a `session.created` event (a fresh OpenCode session, or the automated test's direct `hooks.event({ event: { type: 'session.created' } })` call); confirm the file moves into `.loop-guard-state/.archive/`. Confirm a recently-touched sibling file stays in the active directory.
8. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

The automated test passes, and the live-dispatch checks (warn, reject with correct identity resolution, fail-open, passthrough, no stray loop-guard state for non-loop-executors) match their expected signal.

### Failure Modes

- Hook never fires (plugin loader silently drops the file — check for accidental named exports alongside the default export; the `.opencode/plugins/README.md` load-bearing warning covers this).
- `MK_DEEP_LOOP_GUARD_REJECT=1` or `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` no longer blocks the dispatch (OpenCode host behavior change, or a regression in either throw path).
- A missing/corrupt `mode-registry.json`, or an unwritable `.opencode/skills/.loop-guard-state/` directory, starts blocking unrelated dispatches instead of failing open.
- `resolveTargetIdentity()` regresses and resolves `"general"` literally instead of parsing prompt text, silently disabling both checks for real `orchestrate` dispatches.
- A command-driven iteration (carrying `Iteration: N of M` / `STATE SUMMARY`) is miscounted toward the loop-repeat threshold.
- The retention sweep never fires (the `event` hook is not registered, or `session.created` is not recognized), so `.loop-guard-state/` grows unbounded.
- The sweep fires but archives a recently-touched file, or fails to archive a genuinely stale one (retention-days/interval env parsing regression).
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
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Hermetic regression coverage for export shape, identity resolution, warn/reject toggles (mode-mismatch and loop-repeat), command-driven/non-loop-executor exemptions, cross-session isolation, and both fail-open paths. |

---

## 5. SOURCE_METADATA

- Group: Validation
- Playbook ID: DLR-052
- Feature catalog entry: `feature-catalog/validation/mk-deep-loop-guard.md`
- Scenario file path: `manual-testing-playbook/validation/mk-deep-loop-guard.md`
- Expected verdict mode: GREEN when the automated test and all live-dispatch checks pass
- Wall-time estimate: 10-20 min (live checks require real `opencode` dispatches)
