---
title: "Implementation Summary: Phase 5: stale-index-fallback"
description: "Not built yet. A lookup that finds nothing in the committed index will check the declared phrases of spec docs git reports as changed."
trigger_phrases:
  - "stale index fallback implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/005-stale-index-fallback"
    last_updated_at: "2026-11-09T16:18:07Z"
    last_updated_by: "template-author"
    recent_action: "Planning docs written; build not started"
    next_safe_action: "Run tasks.md T001 and T002, then build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-stale-index-fallback"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-stale-index-fallback |
| **Completed** | Not started (planned 2026-11-09) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Not built yet. A lookup that finds nothing in the committed index will check the declared phrases of spec docs git reports as changed.

### Phase 5: stale-index-fallback

New and edited packets stay invisible to the Gate 1 lookup until someone rebuilds the index. After this phase a zero-hit lookup in a work tree reads the `trigger_phrases` of changed spec docs and reports them under `staleFallback`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/changed-docs.mjs` | Created (planned) | Git candidate list, phrase read, scoring |
| `lookup-trigger-index.mjs` | Modified (planned) | `lookupWithFallback()`, `--no-stale-fallback`, async `main` |
| `retrieval-conventions.md`, retrieval `README.md` | Modified (planned) | Sections 4 and 5, flag docs |
| `stale-fallback.vitest.ts` | Created (planned) | 18-case matrix plus merged count |
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
| Run only on a zero-hit | Every lookup that already finds a match keeps its exact output and speed (phase 3 design) |
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
| Benchmark: Stale phrases found | Before: 0/10 (measured today: exit 1). After: not run yet (target 10/10) |
| Benchmark: Already-matching queries with identical output | Before: n/a. After: not run yet (target 10/10) |
| Benchmark: Undeclared phrases still exit 1 | Before: 5/5. After: not run yet (target 5/5) |
| Benchmark: Median time, matching queries | Before: record. After: not run yet (target within 10% of before) |
| Benchmark: Cold-lookup p95 over `fixtures/prompt-set.json` | Before: record. After: not run yet (target at or under 200 ms, the `/doctor:speckit` budget) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Planned limit.** The fallback reads declared phrases only, so a changed doc without `trigger_phrases` stays invisible; the ripgrep lane still finds it by body text.
<!-- /ANCHOR:limitations -->

---


