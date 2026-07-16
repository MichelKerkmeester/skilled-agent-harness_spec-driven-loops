---
title: "Implementation Summary: Renumber system-speckit active packets above the archive ceiling"
description: "Planning-only scaffold for the system-speckit 001-016 -> 026-041 renumber and 026-029 stub removal. No execution has run."
trigger_phrases:
  - "system-speckit renumber active packets"
  - "system-speckit archive ceiling overlap"
  - "026-029 stub directory removal"
  - "spec-folder renumbering repair"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored planning-stub implementation-summary"
    next_safe_action: "Await operator stub-deletion approval, then execute"
    blockers:
      - "The 4 untracked stub directories (026-029) contain ~281M of git-unrecoverable content. Operator must confirm rm -rf is safe (or approve a snapshot-first alternative) before Phase 2 executes it."
    key_files:
      - ".opencode/specs/system-speckit/z_archive/"
      - ".opencode/specs/system-speckit/001-cmd-memory-output/"
      - ".opencode/specs/system-speckit/026-graph-and-context-optimization/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-system-speckit-renumber-impl-summary-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the 4 untracked stub directories be snapshotted to scratch before rm -rf, given ~281M of unrecoverable content, or is operator confirmation of abandoned-attempt status sufficient to delete outright?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-system-speckit-renumber |
| **Completed** | Pending (scaffold only, not executed) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet plans the removal of four stale, mismatched-slug stub directories (`026`-`029`) and the order-preserving renumbering of the 16 active system-speckit packets (`001`-`016`) to `026`-`041`, so the active range starts cleanly above the archive's `001`-`025` ceiling. No file has been moved, deleted, or edited outside this packet's own four planning docs. Execution is gated on an explicit operator decision about how to handle the ~281M of unrecoverable content sitting in the stub directories.

### Renumber Plan (026-041) and Stub Removal

The plan enumerates the exact 16-row `git mv` map (source slug to target number, each packet keeping its own slug), the ref-repair surface (~7,164 files matching the qualified `system-speckit/<old-basename>` token), and the metadata-regen-plus-strict-validation steps that follow. Execution is gated on the operator resolving the stub-content blocker (direct `rm -rf` vs. snapshot-first) named in this packet's continuity blockers before Phase 2 of `plan.md` can run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Planned | Remove 4 stale stub dirs (026-029), `git mv` 16 active packets to 026-041, repair self-referential path tokens, regenerate `description.json`/`graph-metadata.json`, run `validate.sh --recursive --strict` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Execution is pending per plan.md / checklist.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Execute the 16 `git mv` renames in ascending target-number order | Two directories colliding mid-sequence on the same numeric prefix would corrupt rename detection; running low-target-first guarantees each target slot is empty when its row runs. |
| Anchor ref-repair to the qualified `system-speckit/<old-basename>` token, never bare digits | A bare `00N-`/`01N-` regex would false-positive on requirement IDs like `REQ-001` inside spec bodies; anchoring on the full qualified path keeps the ~7,164-file repair surgical. |
| Gate stub deletion on explicit operator approval | The 4 untracked stub directories hold ~281M of content git cannot recover, so the plan refuses to run `rm -rf` without an operator decision between direct delete and a snapshot-first alternative. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --recursive --strict` | Not yet run (acceptance criteria in checklist.md) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scaffold only.** No `git mv`, `rm`, or ref-repair has executed; every claim in `plan.md`/`tasks.md` is a planned step, not a completed one.
2. **Destructive-delete gate.** Phase 2 (removing the 4 stub directories) cannot start until the operator explicitly approves handling of ~281M of untracked, unrecoverable content. See REQ-001 and the open question in `spec.md`.
3. **Large ref-repair surface.** The self-referential path-token repair touches ~7,164 files; execution must re-run `validate.sh --recursive --strict` per renamed packet and compare against a pre-rename baseline (delta <= 0) rather than assume zero regressions.
<!-- /ANCHOR:limitations -->

---
