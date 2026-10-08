---
title: "Implementation Summary"
description: "This phase is planned and not yet built."
trigger_phrases:
  - "doctor update compatibility implementation summary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Planned the phase"
    next_safe_action: "Execute against the acceptance criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-doctor-update-compatibility |
| **Status** | Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-will-be-built -->
## What Will Be Built

This phase is planned but not yet implemented. The plan calls for a read-only compatibility section in `/doctor:update check` and a separate gated action that moves v3 layout to v4 and runs `upgrade-legacy --apply` without involving the release transaction. External users will be able to detect whether their repo needs a layout move and upgrade, preview the path map for collisions, approve the action explicitly, and then run it safely outside the release engine's transaction bounds.

The compatibility check calls Phase 8's era report to show layout (v3 vs v4) and signal counts. A new path map collision-checker function in upgrade-legacy.mjs detects folder name conflicts that would block a move. The action workflow manages the preview, approval, move execution with logging, and upgrade apply with baseline recording. Both workflows are driven by doctor menu options and show results in the doctor presentation.

### Files to Be Created
- `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` (new workflow, ~200 lines)
- Test fixtures for v3 and v4 repos

### Files to Be Modified
- `.skilled/commands/doctor/assets/doctor-update-check.yaml` (add compatibility section)
- `.skilled/commands/doctor/_routes.yaml` (add compat action route)
- `.skilled/commands/doctor/assets/doctor-update-presentation.txt` (add menu option)
- `.skilled/commands/doctor/update.md` (add external-user documentation)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (add collision-check function)
<!-- /ANCHOR:what-will-be-built -->

---

<!-- ANCHOR:how-will-be-delivered -->
## How It Will Be Delivered

Tasks T001 through T016 (listed in tasks.md) follow three phases: setup (fixtures, collision algorithm), implementation (YAML workflows, checking functions, documentation), verification (unit tests on collision detection, integration tests on full workflow, manual testing on real v3 repo). The phase is not yet executed.
<!-- /ANCHOR:how-will-be-delivered -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Separate action outside release transaction | Release engine covers only `.skilled/` units; specs moves and corpus repairs need independent approval and rollback |
| Mandatory preview and collision detection | Wrong path maps can corrupt a repo; user must review before any writes happen |
| Path map stored and logged for recovery | Interrupted moves are recoverable if each step is logged and state is persistent |
| Baseline recording limits rollback to upgrade units | Release apply handles its own reversal; upgrade applies its own baseline so the two are independent |
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:status -->
## Status: Planned, Not Yet Built

This packet is in the planning phase. Spec, plan, tasks, acceptance criteria and implementation summary are complete. The coordinator will set a goal once the planning documents pass validation. The phase is ready for implementation in a future session.
<!-- /ANCHOR:status -->
