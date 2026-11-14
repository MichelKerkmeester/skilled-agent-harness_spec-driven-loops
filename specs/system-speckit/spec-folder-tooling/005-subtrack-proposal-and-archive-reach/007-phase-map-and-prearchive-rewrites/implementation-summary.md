---
title: "Implementation Summary"
description: "Nothing is built yet. This phase is planned, and this file records that state until implementation starts."
trigger_phrases:
  - "phase map and prearchive rewrites implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/007-phase-map-and-prearchive-rewrites"
    last_updated_at: "2026-11-14T06:11:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the phase; no code changed"
    next_safe_action: "Wait for the phase 006 commit, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-phase-map-and-prearchive-rewrites"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-phase-map-and-prearchive-rewrites |
| **Completed** | Not completed. Planned on 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. The phase is planned and no file outside this folder has changed.

### Phase 7: phase-map-and-prearchive-rewrites

When built, a renumbered or re-parented phase is named correctly in its parent's documents, and a packet restored onto a new number is named correctly by references written before it was archived. `spec.md` holds the four requirements.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None | None | Implementation has not started |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. `tasks.md` lists the order: reproduce A2 and A8 in a `mktemp` copy, list the places a phase scaffold writes a bare name, add one failing case per requirement, fix, rerun the reproductions and the two suites.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A folder-scoped bare-name rule beside the whole-id pattern | The whole-id pattern runs over every text file under `specs/`, where a bare `NNN-slug` would match other packets' children |
| No new option for the pre-archive id | The second spelling follows from a source path under `z_archive/`, and one caller needs it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The two suites this phase extends, before any change, `vitest run` on `relocate.vitest.ts` and `archive-track.vitest.ts`, 2026-11-14 | PASS: `Test Files  2 passed (2)`, `Tests  77 passed (77)`, exit 0 |
| Acceptance checks of REQ-001 to REQ-004 | Not run. Implementation has not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Bare names in prose** A bare folder name in running text or outside the phase parent's folder is not rewritten. Write the full id where a reference must survive a move.
<!-- /ANCHOR:limitations -->

---
