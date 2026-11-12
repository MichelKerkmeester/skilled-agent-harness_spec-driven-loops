---
title: "Implementation Summary"
description: "Planned, not built. This phase will bind a surfaced command to its own document through Gate 2 and carry that rule to every runtime."
trigger_phrases:
  - "gate 2 binding and runtime pointers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers"
    last_updated_at: "2026-11-12T20:30:00Z"
    last_updated_by: "planner"
    recent_action: "Planned phase 6 at Level 2"
    next_safe_action: "Run T001 and T002, then wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-gate-2-binding-and-runtime-pointers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-gate-2-binding-and-runtime-pointers |
| **Completed** | Not started. Planned on 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The phase is planned, and no file outside this folder has changed.

### Phase 6: gate-2-binding-and-runtime-pointers

When this phase is built, a command the advisor names will come with one rule on every runtime: read its document in full and follow it under its policy, or take the skill path whole. Cursor and Devin will carry that rule in their own rule file, a hub skill will name its mode's command, a new folder will name the plan workflow and a dispatched child will see a surfaced command only as parent-named.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/measure-policies.mjs`, `scratch/hub-commands.mjs`, `scratch/advisor-top.sh`, `scratch/hook-first-line.sh`, `scratch/bullet-draft.txt` | Created | Read-only probes and the drafted bullet behind the Measured Behavior block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned through `speckit-plan.yaml` in auto mode with the spec authoring card. Every number in `spec.md` comes from a command run on 2026-11-12 in this worktree. The budget after the change was measured by running the agents-md check on a copy of `AGENTS.md` with the drafted bullet, made outside the repository.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Level 2, not the Level 1 the helper printed | The packet asks for `acceptance-criteria.md`, and `speckit-plan.yaml` says to go higher when the helper and judgment differ |
| Extend `sync-gate1-pointers.cjs` instead of writing a new generator | The agents-md check already runs its `--check` for the Cursor rule, so a second block is checked with no new wiring |
| Read the child downgrade class from `commandPolicies` | All 68 policy records carry `mutating`, while only 23 of 62 bridge entries do |
| Plan `copilot` removal with a test of the old-record path | The operator chose removal on 2026-11-12. Both metrics readers filter on the enum, so a stored record is skipped rather than thrown on, and the test pins that |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `/doctor:agents-md check` before the change | PASS, `STATUS=OK`, 15629 of 16384 bytes to the last anchor |
| Same check on a copy with the drafted bullet | A6 PASS at 16092. A4 shows 1 edited until the manifest is rewritten |
| `validate.sh --strict` on this folder | Run at the end of planning |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The child downgrade waits on phase 005.** Phase 005 is not built, and the downgrade edits the command line it adds to the brief. T002 marks those tasks blocked if the line is absent, and the rest of the phase can still ship.
<!-- /ANCHOR:limitations -->

---
