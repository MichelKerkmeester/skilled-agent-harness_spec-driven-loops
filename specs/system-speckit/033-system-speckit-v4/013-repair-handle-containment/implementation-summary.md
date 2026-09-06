---
title: "Implementation Summary: Path Containment Follow-Ups"
description: "The repair write now proves the handle it opened is the file the scan classified, and truncates only after that — the refusal was otherwise landing after the damage."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/046-path-containment-followups"
    last_updated_at: "2026-08-30T14:17:45Z"
    last_updated_by: "template-author"
    recent_action: "Closed the scan-to-write gap and removed the guard branch that decided nothing"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-046-path-containment-followups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Date** | 2026-08-30 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mcp-server/scripts/repair-graph-metadata.mjs` now proves the file it writes is the file it
scanned. `graphFiles` records each candidate's device and inode at the moment
`entry.isFile()` classifies it, and `writeExistingFileNoFollow` compares the opened handle
against that record before writing anything.

Two changes were needed, not one. The identity check closes the vector; moving truncation
off the open is what makes the refusal mean something. `O_TRUNC` empties the file as part
of `openSync`, so the first version refused the swapped destination *after* it had already
destroyed the victim. The open is now `O_WRONLY | O_NOFOLLOW`, and `ftruncateSync` runs
only once identity is proven.

`scripts/tests/repair-write-symlink-refusal.sh` gained the directory-swap case and, more
usefully, an assertion that the bystander outside the tree still holds its content. That
second assertion is what caught the truncation defect.

The graph-metadata write guard lost its process-derived root source, which was measured to
change no outcome, and its containment suite gained a case pinning the condition that
defeats it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduction first, then the fix, then the negative control — in that order, because the
predecessor packet shipped a suite that passed against code with no protection at all.
Every case here exercises the shipped function rather than a local reimplementation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Identity, not path.** The path is what an attacker changes, so it cannot be the thing
that is checked. Device and inode describe the file itself and survive any renaming of the
route to it.

**Truncate last.** A check that runs after the destructive step is not a check. This is the
same error the packet exists to fix, one level down, and only the bystander assertion
surfaced it.

**A criterion that cannot be exercised is retired, not faked.** The symlinked-track case is
superseded: the walk never yields such a path. See the decision record.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scripts/tests/repair-write-symlink-refusal.sh` | 7/7 |
| Negative control | Check disabled and `O_TRUNC` restored: swapped directory writes through, bystander reads `REPAIRED` |
| Live repair sweep | `node mcp-server/scripts/repair-graph-metadata.mjs --dry-run` reports 363 candidates before, 0 after |
| `scripts/tests/graph-metadata-write-containment.sh` | 8/8; 4/8 with the guard neutered |
| Surrounding suites | ac-coverage 16/16, ac-closure 29/29, docset 6/6 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Symlinked tracks remain outside the repair sweep.** Unchanged from before; the walk classifies with `entry.isDirectory()`, which is false for a link. Recorded in the decision record because it is what makes one criterion unexercisable.
2. **A window remains between `openSync` and `fstatSync`.** It cannot be closed without `openat`, which Node does not expose. What the check removes is the far larger window between the scan and the write.
<!-- /ANCHOR:limitations -->
