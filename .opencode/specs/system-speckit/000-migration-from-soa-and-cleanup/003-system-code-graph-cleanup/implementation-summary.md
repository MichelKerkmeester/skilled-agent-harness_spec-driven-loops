---
title: "Implementation Summary: Remove untracked stub packets below the system-code-graph archive ceiling"
description: "Deleted the two untracked system-code-graph stub directories (007/009); their tracked content had already migrated to 031/033. Number-line is now archive max 024 immediately followed by active min 025, no gap-filler between."
trigger_phrases:
  - "system-code-graph stub cleanup"
  - "remove untracked spec stubs"
  - "archive ceiling packet cleanup"
  - "007 009 stub directory removal"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Removed 007 009 untracked stubs"
    next_safe_action: "Phase complete return to parent"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/z_archive/"
      - ".opencode/specs/system-code-graph/context-index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-system-code-graph-cleanup-executed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "descriptions.json 152 stale specFolder entries: deferred to a separate reindex follow-up (search-index staleness, not a live reference; does not block this deletion)."
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
| **Spec Folder** | 003-system-code-graph-cleanup |
| **Completed** | Yes — both stub directories removed; number-line verified |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two untracked, zero-tracked-file stub directories (`007-code-graph-buildout`, `009-advisor-codegraph-shared-features`) that squatted below the `system-code-graph` archive ceiling were removed. Their real content had already migrated to `031`/`033` in a prior renumber; what remained was stray untracked scratch/log residue. No tracked file was touched.

### Stub Directory Cleanup (executed)

Both stub paths are now absent (`ls` reports no such directory). The `system-code-graph` number-line is verified as archive max `024` immediately followed by active min `025`, with no gap-filler directory between the archive and the compliant active range (`025`-`035`). The `context-index.md` rename-mapping table (`007->031`, `009->033`) is preserved as historical migration record.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/system-code-graph/007-code-graph-buildout/` | `rm -rf` (untracked) | Remove stray scratch/log residue occupying a below-ceiling number |
| `.opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/` | `rm -rf` (untracked) | Remove stray review-lineage log residue occupying a below-ceiling number |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Filesystem-only deletion of untracked scratch (no git operation, no commit needed for the deletion itself since nothing was tracked). Confirmed via `git ls-files` (empty for both paths, so no tracked content lost) and a post-deletion number-line check. This implementation-summary update is the only committed artifact for the phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Classify remaining references before deleting | The classification pass (context-index.md = historical, descriptions.json = stale index) confirmed no live reference would break on deletion. |
| Leave the 152 stale `descriptions.json` entries out of scope | Search-index staleness is a separate reindex follow-up, not a reason to block this low-risk untracked-only cleanup. |
| Treat `context-index.md`'s rename-mapping table as historical record | The table intentionally documents `007->031` and `009->033` as completed migration history and is preserved as-is. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git ls-files` on both stub paths | Empty (0 tracked files) — no tracked content lost |
| Both stub directories absent | `ls` reports no such directory for both |
| Number-line invariant | archive max `024` immediately followed by active min `025`; no gap-filler |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reindex follow-up not covered.** The 152 stale `descriptions.json` `specFolder` entries still reading `007-`/`009-` basenames are search-index staleness, deferred to a separate reindex packet.
2. **Deletion is not git-reversible.** The removed content was untracked scratch/log residue; it was git-unrecoverable to begin with (0 tracked files), so no rollback path exists or is needed.
<!-- /ANCHOR:limitations -->

---
