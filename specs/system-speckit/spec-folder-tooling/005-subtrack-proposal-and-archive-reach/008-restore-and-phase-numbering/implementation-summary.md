---
title: "Implementation Summary"
description: "Nothing is built yet. This phase is planned, and this file records that state until implementation starts."
trigger_phrases:
  - "restore and phase numbering implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering"
    last_updated_at: "2026-11-14T06:11:01Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the phase; no code changed"
    next_safe_action: "Wait for the phase 006 and 007 commits, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-restore-and-phase-numbering"
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
| **Spec Folder** | 008-restore-and-phase-numbering |
| **Completed** | Not completed. Planned on 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. The phase is planned and no file outside this folder has changed.

### Phase 8: restore-and-phase-numbering

When built, a restore onto a new number reports what happened, a restore never leaves a flat packet beside sub-tracks, and a new phase never takes the number of an archived one. `spec.md` holds the three requirements.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None | None | Implementation has not started |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. `tasks.md` lists the order: reproduce A6, A7 and A9 in a `mktemp` copy, list the callers of `relocate.mjs`, add one failing case per requirement, fix, rerun the reproductions and the three suites.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One added exit status in `relocate.mjs` for a close whose only failure is a moved packet's validation | Exit 2 covers a failed step and a failed closing validation today, so the restore cannot tell a stopped run from a finished one |
| The restore asks the relocate preflight for the mixed-track rule | The preflight already holds the rule, and the parent spec lists the copies of the sub-track predicate as a separate change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Two of the suites this phase extends, before any change, `vitest run` on `relocate.vitest.ts` and `archive-track.vitest.ts`, 2026-11-14 | PASS: `Test Files  2 passed (2)`, `Tests  77 passed (77)`, exit 0 |
| The numbering loop as measured while planning, `grep -n 'for dir in "$FEATURE_DIR"' create.sh`, 2026-11-14 | Confirms A9: line 1808 globs live phase folders only |
| Acceptance checks of REQ-001 to REQ-003 | Not run. Implementation has not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Archived packets that fail validation** A restored packet that failed strict validation before it was archived still fails after the restore. The restore names it in a warning. Run `validate.sh <packet> --strict` and repair the packet itself.
<!-- /ANCHOR:limitations -->

---
