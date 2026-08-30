---
title: "Implementation Summary: Repair Write Symlink Refusal"
description: "The repair script decided a path was a regular file during its scan and wrote it later. The write now refuses to traverse a symlink itself. Also records why the sibling resume-containment finding was declined: its remedy would break every symlinked track."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/044-repair-write-symlink-refusal"
    last_updated_at: "2026-08-30T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Made the repair write refuse symlink traversal"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-044-repair-write-symlink-refusal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-repair-write-symlink-refusal |
| **Completed** | 2026-08-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A write that enforces its own precondition. The repair script decides whether a candidate is a regular file while walking the tree, reading the directory entry — which describes the link rather than its target, so symlinks are correctly skipped there. That decision was then acted on later by a write call that follows symlinks, so a path replaced between the two was written through.

The destination is now opened with traversal disabled. A swapped path fails at open rather than being followed, and reports a refusal instead of a raw errno.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-server/scripts/repair-graph-metadata.mjs` | Modified | The write refuses to traverse a symlink |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The sibling containment finding is declined, and this is the evidence.** A review flagged that the resume ladder's containment test is lexical, so a symlink planted inside a root passes it, and recommended canonicalizing before the test. The finding is accurate. The remedy is not: four tracks in this repository are symlinks into sibling repositories, and canonicalizing first places them outside every root. Measured directly — lexical containment returns true for a symlinked-track packet, canonical containment returns false. Adopting the remedy would break resume for every one of those repositories to close a hole that already requires write access to the repository.

That is the same trade-off the graph-metadata write boundary settled the same way, and for the same reason: these guards bound arbitrary destinations, they do not replace filesystem permissions.

**This one is different, which is why it was fixed.** Refusing traversal at open costs nothing: symlinked tracks are directories, and the write only ever targets a file inside one.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Normal destination | Written, content replaced |
| Destination swapped to a symlink | Refused |
| The symlink's target | Unchanged |
| `scripts/tests/repair-write-symlink-refusal.sh` | 5/5, against the shipped function |
| Negative control | Protection removed: 2 failures, victim file overwritten |
| Repair script end to end | `node mcp-server/scripts/repair-graph-metadata.mjs --dry-run` reports 366 candidates, 0 remaining, writes nothing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:incident -->
## What the first attempt got wrong

The first commit of this packet shipped the documentation and the test but not
the fix. A review lineage running concurrently reverted ten paths it considered
outside its write scope — including this script and this packet — and the commit
captured that reverted state. The push therefore claimed a change it did not
contain.

The test did not catch it, because the test had reimplemented the open flags
inline instead of calling the shipped function. It proved its own copy worked
and said nothing about the code that ships, so it passed against a script with
no protection at all.

Both are fixed. The suite imports the function the script exports, and the
script now runs its sweep only when invoked as a command so importing it is
side-effect free. The control that was missing is now run: with the protection
removed the suite fails on the symlink case, reporting the victim file
overwritten.
<!-- /ANCHOR:incident -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A test that reimplements what it checks proves nothing.** The first version of this suite did exactly that and passed on unfixed code; it now imports the shipped function and is pinned by a negative control.
2. **A symlink already in place before the scan is skipped, not reported.** The walk drops it silently, as it did before; this change only closes the gap between that decision and the write.
3. **The resume containment gap remains open by decision**, with the measurement above as the reason.
<!-- /ANCHOR:limitations -->

---
