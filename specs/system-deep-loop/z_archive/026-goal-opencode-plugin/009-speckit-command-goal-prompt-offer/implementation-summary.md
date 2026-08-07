---
title: "Implementation Summary: Phase 9: speckit-command-goal-prompt-offer"
description: "The Speckit command surfaces now offer optional session-goal help without blocking auto mode or mutating goal state unless a set choice is explicit."
trigger_phrases:
  - "speckit command goal prompt offer implemented"
  - "goal_prompt_choice contract test"
  - "phase 009 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Verified command goal offer; orchestrator refreshed metadata"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/speckit_plan_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_complete_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_implement_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_resume_presentation.txt"
      - ".opencode/plugins/tests/speckit-goal-offer-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:6af2e2258ab05cbf7379f8d258d998b461eba95f03eb6c58a78a1ce2100a7a3d"
      session_id: "032-phase-009-goal-offer-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-speckit-command-goal-prompt-offer |
| **Status** | Complete |
| **Completed** | 2026-07-03 |
| **Level** | 1 |
| **completion_pct** | 100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Speckit plan, complete, implement, and resume now surface one optional Session Goal line inside their existing consolidated setup prompts. Auto mode remains non-blocking because the YAML setup field defaults to `offer`, and goal mutation is gated behind an explicit `set` choice.

### Non-Blocking Offer

Each presentation contract now includes the same line: `Session Goal (optional): A) Offer or reference a session goal for this workflow  B) Skip  C) Set goal: <objective>`. The line stays inside the existing consolidated prompt block, preserving each command's rule to never split setup questions into separate visible prompts. Resume uses the same wording so it can reference a prior session goal during recovery instead of only proposing a new one.

### Workflow Field And Tool Gating

All 8 workflow YAML assets now define `goal_prompt_choice` and `goal_objective`. Plan, complete, and implement variants include `set_mutation` with `field: goal_prompt_choice`, `op: "=="`, `value: set`, `tool: mk_goal`, and the `mk_goal({ action: "set", objective: goal_objective })` invocation. Resume variants include `set_handling` instead and explicitly state that resume does not call `mk_goal`; resume only exposes `mk_goal_status` through its router.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/speckit/assets/speckit_*_presentation.txt` | Modified | Added the shared optional Session Goal line to all four consolidated prompt templates. |
| `.opencode/commands/speckit/assets/speckit_*_{auto,confirm}.yaml` | Modified | Added `goal_prompt_choice`, `goal_objective`, and explicit set-only handling. |
| `.opencode/commands/speckit/plan.md`, `.opencode/commands/speckit/complete.md`, `.opencode/commands/speckit/implement.md` | Modified | Added `mk_goal, mk_goal_status` to allowed tools. |
| `.opencode/commands/speckit/resume.md` | Modified | Added `mk_goal_status` only, keeping resume read/recovery scoped. |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Created | Pins the offer text, YAML field confinement, router tool permissions, and stale-name absence. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was delivered as additive command-surface wiring only: no plugin runtime, goal command, or handover file was modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Default `goal_prompt_choice` to `offer` | `offer` lets the setup text surface without requiring a user answer or mutating goal state. |
| Keep resume status-only | `/speckit:resume` is a recovery surface, so it can reference goal status but cannot call the mutating `mk_goal` tool. |
| Add a focused Node contract test | A grep-shaped contract matches the command surface risk better than a broad integration test and proves drift detection with a red/green mutation check. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `rg -n "goal_prompt_choice|mk_goal" .opencode/commands/speckit/` | PASS, no output before edits. |
| Router `allowed-tools` baseline | PASS, four lines matched the requested pre-edit snapshot. |
| `node --check .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | PASS, no syntax output. |
| `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | PASS, 4 tests passed, 0 failed. |
| Mutation proof | PASS, removing the plan presentation offer produced 1 failing test, then restoring it returned to 4 tests passed, 0 failed. |
| Gating trace | PASS, plan/complete/implement YAML variants call `mk_goal` only under `goal_prompt_choice == set`; resume variants do not call `mk_goal`. |
| Stale name check | PASS, no `goal.md` occurrence in the 16 touched command files. |
| Strict SpecKit validation | PASS with known warnings: `graph-metadata.json`/`description.json` were outside this dispatch's allowed write paths by design; the orchestrator regenerated them post-dispatch. `SPECKIT_VALIDATE_LEGACY=1 validate.sh --strict` now reports Errors: 0, Warnings: 2 (the expected non-blocking `ANCHORS_VALID` custom-anchor warning, plus `FRONTMATTER_MEMORY_BLOCK` on the intentionally-untouched `handover.md`). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Generated `description.json`/`graph-metadata.json` refresh was intentionally scoped to the orchestrator rather than this dispatch (not in its allowed write paths); the orchestrator ran the refresh and confirmed Errors: 0 post-dispatch.
2. `handover.md` still lacks `_memory` frontmatter because the phase instructions explicitly prohibit editing that historical file (preserved as-is; its stale `.opencode/commands/goal.md` reference belongs to a different, already-closed phase).
<!-- /ANCHOR:limitations -->
