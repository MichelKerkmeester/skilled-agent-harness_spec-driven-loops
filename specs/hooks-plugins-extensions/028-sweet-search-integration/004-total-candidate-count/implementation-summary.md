---
title: "Implementation Summary: Phase 4: total-candidate-count"
description: "Not built yet. The trigger lookup will say how many documents matched before the `--limit` cut, not only that it cut."
trigger_phrases:
  - "total candidate count implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count"
    last_updated_at: "2026-11-09T16:18:07Z"
    last_updated_by: "template-author"
    recent_action: "Planning docs written; build not started"
    next_safe_action: "Run tasks.md T001 and T002, then build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-total-candidate-count"
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
| **Spec Folder** | 004-total-candidate-count |
| **Completed** | Not started (planned 2026-11-09) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Not built yet. The trigger lookup will say how many documents matched before the `--limit` cut, not only that it cut.

### Phase 4: total-candidate-count

An answer with `truncated: true` and no total tells you nothing about how much you missed. After this phase the JSON answer carries `totalCandidates`, and a truncated human run prints `2 of N (truncated)`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lookup-trigger-index.mjs` | Modified (planned) | Add `totalCandidates` and the truncated human line |
| `retrieval-conventions.md` | Modified (planned) | Section 8 sentence, section 9 research-folder row |
| `trigger-index.vitest.ts`, `retrieval-coverage-parity.vitest.ts` | Modified (planned) | Nine new cases |
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
| Print the total only when truncated | An untruncated run already shows every result, so its output stays byte-identical (phase 3 design) |
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
| Benchmark: Truncated answers that state a total | Before: 0/6 (measured today). After: not run yet (target 6/6) |
| Benchmark: Untruncated human output changed | Before: n/a. After: not run yet (target 0/6 byte-identical) |
| Benchmark: Median lookup time, 5 runs per query | Before: record. After: not run yet (target within 10% of before) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Planned limit.** Callers that read only `truncated` see no change until they read the new field.
<!-- /ANCHOR:limitations -->

---


