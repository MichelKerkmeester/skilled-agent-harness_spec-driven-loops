---
title: "Implementation Summary: Setup guide for using Skilled in your own project"
description: "A new root SETUP.md guides a user through linking Skilled into a project or copying it in with overlays, every step tested, and the root README now points to it."
trigger_phrases:
  - "setup guide implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/006-setup-guide"
    last_updated_at: "2026-11-08T10:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "SETUP.md written from tested runs, README section 5 cut to a pointer"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - "SETUP.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "setup guide"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-setup-guide |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Setting Skilled up in your own project now has one guide. `SETUP.md` helps you choose between linking and copying and walks through either one, and the root README stays an overview.

### One Guide for Both Setups

The link path follows `/doctor:install` and `/doctor:symlink` from plan to undo. The copy path starts from nothing: make the copy, write the manifest, add a first `file` and `directory` overlay, apply it, handle a live edit, re-pin and roll back. A health table and a troubleshooting table close it, each row a line you would see and the fix.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SETUP.md` | Created | The setup guide |
| `README.md` | Modified | Section 5 is a short pointer, the Quick Start paragraph and four command entries link the guide, and the related documents list it |
| `.skilled/skills/system-skilled-doctor/README.md` | Modified | Its related documents list the guide |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every step was run before it was written. The link path ran on an empty git repo, twice for `link` and twice for `unlink`. The copy path ran on a real copy archived from `877c9b021c` and re-pinned to `49b79d094a`. The guide quotes what those runs printed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Write the two link rough edges as they behave | The guide must match the engine today, and fixing the engine is a separate change |
| Keep Install in the root README | Installing this checkout comes before either setup path, and the guide links to it |
| Show only `file` and `directory` overlays as examples | Most projects need only those, and the reference covers the rest |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Link path, empty repo | Second `link` ends `linked-merge`, `unlink` leaves a clean tree |
| Copy path, real copy | status, apply, capture, staged and live re-pin and rollback all behave as the guide says |
| `validate_document.py SETUP.md` | No blocking error (one note: README rules were applied) |
| `check_readme_references.py` on the three docs | `fail=0` |
| Root README issues | 2, the same 2 as before the change |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Both link rough edges are fixed since.** `specs/system-skilled-doctor/002-symlink-first-link` made one `link` run enough on a new project and ignored the relative links, and removed the two notes from the guide.
<!-- /ANCHOR:limitations -->

---
