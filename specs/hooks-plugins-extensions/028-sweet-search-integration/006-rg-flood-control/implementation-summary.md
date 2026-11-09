---
title: "Implementation Summary: Phase 6: rg-flood-control"
description: "Not built yet. The ripgrep wrapper will show each matching file once, cut to `--limit`, and say what it hid."
trigger_phrases:
  - "rg flood control implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/006-rg-flood-control"
    last_updated_at: "2026-11-09T16:18:08Z"
    last_updated_by: "template-author"
    recent_action: "Planning docs written; build not started"
    next_safe_action: "Run tasks.md T001 and T002, then build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-rg-flood-control"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-rg-flood-control |
| **Completed** | Not started (planned 2026-11-09) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Not built yet. The ripgrep wrapper will show each matching file once, cut to `--limit`, and say what it hid.

### Phase 6: rg-flood-control

Today one file with many matches fills the view and hides the rest without saying so. After this phase each file appears once at its best line with `(+N more in this file)`, and a tail line counts the hidden files and matches.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/rg-lane.mjs` | Modified (planned) | `shapeRankedMatches`, `DEFAULT_LIMIT`, delete `structuredCappedRecipe` |
| `rg-wrapper.mjs` | Modified (planned) | `--limit`, schema version 2, new record fields, human suffixes |
| `ops/retrofit-convention.mjs` | Modified (planned) | Read `matchCount` first |
| `rg-wrapper-recipes.vitest.ts` | Modified (planned) | Fixture fix and 11 cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Not delivered yet. The plan: record the retrieval-suite baseline, make the edits in `tasks.md` order, rerun the full suite and report the delta here, then validate this folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Bump `SCHEMA_VERSION` to 2 | `results` now holds one row per file, so a reader of version 1 must see the meaning changed (phase 3 design) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Retrieval test suite | Not run yet; fill with before and after counts |
| `validate.sh --strict` on this folder | Planning docs only so far |
| `/local-skilled-alignment` recheck | Not run yet; fill with open P0/P1/P2 counts |
| Benchmark: Distinct files in the shown rows (measured query) | Before: 2 (measured today). After: not run yet (target 14) |
| Benchmark: Most rows from one file (measured query) | Before: 19 of 20. After: not run yet (target 1) |
| Benchmark: Queries that report hidden files and matches | Before: 0/8. After: not run yet (target 8/8 where anything was hidden) |
| Benchmark: Median query time, 5 runs per query | Before: record. After: not run yet (target within 10% of before) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Planned limit.** A second match in the same file is hidden behind its count; rerun with a narrower `--search-root` to see it.
<!-- /ANCHOR:limitations -->

---


