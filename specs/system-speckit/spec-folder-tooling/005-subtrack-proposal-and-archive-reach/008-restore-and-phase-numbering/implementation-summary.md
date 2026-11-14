---
title: "Implementation Summary"
description: "A restore that landed is reported as done, a restore that would mix a track is refused, and a new phase is numbered past the parent's archive."
trigger_phrases:
  - "restore and phase numbering implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering"
    last_updated_at: "2026-11-14T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built and verified all three requirements, committed 31493fb263"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-restore-and-phase-numbering"
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
| **Spec Folder** | 008-restore-and-phase-numbering |
| **Completed** | 2026-11-14, commit `31493fb263` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A renumbering restore whose steps all landed is now reported as done. A restore that would put a flat packet beside sub-tracks is refused before anything moves. A new phase takes a number above every live and archived phase.

### Phase 8: restore-and-phase-numbering

- **Exit status 3.** `relocate.mjs` exits 3 when every step and the close's sweep passed and the only failure is a moved packet's own validation. A rerun after it finds nothing to do. Any other failure still exits 2. The header and the `relocate.mjs` row of `spec/README.md` state the new status.
- **Restore reads it.** `restore_on_next_number` in `archive.sh` captures the status under `set -euo pipefail`. On 3 it prints the `Restored:` line and one warning naming the packet and exits 0. Any other non-zero still prints `Restore did not finish` and exits 1.
- **Mixed-track refusal.** Before either restore path moves anything, `refuse_mixed_track_restore` runs the relocate dry run and refuses only when its output holds `would hold flat packets`. The error names the track and the `relocate.mjs` command that moves the packet into a sub-track. Every other preflight result leaves the restore as it was, so an archive followed by a restore with no commit in between still works.
- **Phase numbering.** The phase numbering loop in `create.sh` also reads the parent's `z_archive/`, while the predecessor link stays on the highest live phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Modified | Exit status 3 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | The exit codes row |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | Status 3 handling and the mixed-track refusal |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Archive-aware phase numbering |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts`, `archive-track.vitest.ts`, `archive-numbering.vitest.ts` | Modified | Nine cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three briefs went to DeepSeek V4.1 Flash at max reasoning through `dsh`, each writing its failing cases first. The orchestrator reran the three suites after each brief, checked `bash -n` and `node --check`, ran the full CLI suite and committed. The reports are in `scratch/build-evidence.md`, and the callers of `relocate.mjs` are in `scratch/relocate-callers.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One added exit status rather than a flag | `archive.sh` is the only caller that reads the status, and an unaware caller still treats 3 as a failure |
| The earlier case for an always-failing moved packet now expects 3 on run 1 | This phase changes that outcome deliberately |
| The refusal asks the relocate preflight instead of copying the sub-track rule | The rule already has several copies, so this phase does not add another |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three suites, baseline after phase 007 | 98 passed |
| The same suites after each brief | 100, 104, 107 passed, exit 0 |
| `bash -n archive.sh`, `bash -n create.sh`, `node --check relocate.mjs` | Exit 0 each |
| Full CLI `npm test` after the phase | PASS: 2595 passed, 0 failed, exit 0 |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Suggested command.** The refusal keeps the archived packet's own `NNN-slug` in the command it names. If that number is taken in the sub-track, the operator adjusts it.
2. **Several sub-tracks.** The message names the first declared sub-track in glob order. Choosing one stays out of scope.
3. **Phase count.** With an archived phase, the `Phase N of M` total counts the archived number too.
<!-- /ANCHOR:limitations -->

---
