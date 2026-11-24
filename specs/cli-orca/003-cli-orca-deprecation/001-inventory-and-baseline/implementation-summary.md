---
title: "Implementation Summary"
description: "The inventory found 40 files outside `specs/` that mention Orca with a word boundary."
trigger_phrases:
  - "cli orca removal inventory"
  - "cli orca removal baseline"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation/001-inventory-and-baseline"
    last_updated_at: "2026-11-24T10:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed phase 1: inventory-and-baseline"
    next_safe_action: "Run phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-orca-deprecation-001-inventory-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove cli-orca completely, including its changelog folder"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-inventory-and-baseline |
| **Status** | Complete |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The inventory found 40 files outside `specs/` that mention Orca with a word boundary. Twenty-two are delete, edit or regenerate targets. The other 18 are kept because they are not the skill: the `openorca` model family, transcript fixtures, captured screens, a captured process list and released changelogs. The baseline was recorded before any change.

### Phase 1: inventory-and-baseline

Produce a classified removal manifest and a baseline that later phases compare against.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/removal-manifest.md` | Create | Classified inventory |
| `scratch/baseline-*` | Create | Baseline logs and exit codes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I ran the inventory and the baselines directly in the worktree. Two baselines already fail: 13 advisor tests and the README manifest check, which reports three sk-code benchmark directories added on 2026-11-23.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Search with a word boundary | A bare `orca` substring matches about 30 unrelated identifiers |
| Keep the cite-drift label rows | They are read at their pinned commit, so the deletion cannot break them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Inventory | `rg -l -i "cli-orca\|\borca\b"` outside `specs/`: 40 files, all classified in `scratch/removal-manifest.md` |
| Baseline | `scratch/baseline-exits.txt`: 7 suites recorded; `npx vitest run` in the advisor runtime printed 13 failed, and `test_readme_manifest.py` exited 1 before any change |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The README manifest check fails at baseline on three sk-code benchmark directories that predate this packet.
<!-- /ANCHOR:limitations -->

---
