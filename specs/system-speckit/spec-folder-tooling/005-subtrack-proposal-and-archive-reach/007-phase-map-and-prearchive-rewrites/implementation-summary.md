---
title: "Implementation Summary"
description: "A moved phase child's bare folder name is now rewritten in its parent's documents, a re-parented phase moves its rows, and a restored packet's pre-archive id is rewritten."
trigger_phrases:
  - "phase map and prearchive rewrites implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/007-phase-map-and-prearchive-rewrites"
    last_updated_at: "2026-11-14T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built and verified all four requirements, committed 2202b6b0f7"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-phase-map-and-prearchive-rewrites"
      parent_session_id: null
    completion_pct: 100
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
| **Completed** | 2026-11-14, commit `2202b6b0f7` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

After a renumber, a phase parent's documents now name the moved child by its new folder name. A re-parented phase leaves its old parent and joins the new one, and a packet restored under a new number loses its pre-archive id too.

### Phase 7: phase-map-and-prearchive-rewrites

- **Renumber.** For a move inside one phase parent, the bare old folder name is rewritten in that parent's `spec.md` and `goal.md`, its children's `spec.md` and the moved child's Spec Folder row (`bareNameEdits`, `bareNamePattern`). The match is bounded so a longer name or `scaffold-003-gamma` stays as written. A second parent that holds the same child name is untouched.
- **Re-parent.** The bare-name pass does not run. The old parent loses the map row, every handoff row and the goal binding row, and its siblings' links move to the nearest remaining phase. The new parent gains a map row and a goal binding row, and the moved child's links point at its new neighbours (`phaseRowEdits`, `applyPhaseRows`). The run prints one line per row removed, added or set, and names the two cases where nothing is added.
- **Pre-archive id.** A source under `z_archive/` restored outside it also has its pre-archive id rewritten, unless a live folder still holds that id or another entry claims it (`preArchiveAliases`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Modified | The three rewrites above |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Modified | Four renumber and re-parent cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modified | Two pre-archive id cases, with the restore setup extracted into shared helpers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three briefs went to DeepSeek V4.1 Flash at max reasoning through `dsh`, each writing its failing cases first. The orchestrator reran the suites after each brief and the full CLI suite before the commit. The reports are in `scratch/build-evidence.md`. As in phase 006, the reproductions are the failing-first tests and not separate files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bare names are rewritten only inside the phase parent's own documents | Three digits plus a slug are too common to match bare anywhere else |
| No handoff row is added to a new parent | Its criteria cannot be derived from the old row |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Relocate and archive suites, baseline after phase 006 | 88 passed |
| The same suites after each brief | 90, 92, 94 passed, exit 0 |
| Full CLI `npm test` after the phase | PASS: 2586 passed, 0 failed, exit 0 |
| Dry run prints the new rewrites | By reading: `printPlan` prints the phase-row lines in both modes. Not run separately |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase numbers in titles.** The Phase column number of a map row, a `Phase N` title and a `Phase N of M` row keep the old number after a renumber or a re-parent. The spec names this residual against decision D3.
2. **Fixtures.** The renumber cases use fixtures shaped like a `create.sh --phase` scaffold rather than calling `create.sh`.
<!-- /ANCHOR:limitations -->

---
