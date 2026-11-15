---
title: "Implementation Summary"
description: "The deep-review reducer now shows only explicit dead ends as BLOCKED and folds a refinement that names its target into that finding, so the registry counts one finding instead of two."
trigger_phrases:
  - "reducer traceability and refines implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/review-lineage/004-reducer-traceability-and-refines"
    last_updated_at: "2026-11-14T18:20:00Z"
    last_updated_by: "builder"
    recent_action: "Built the reducer change, the regression test file and the prompt line"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "builder-004-reducer-traceability-and-refines"
      parent_session_id: null
    completion_pct: 100
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-reducer-traceability-and-refines |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A review strategy now lists only directions a reviewer explicitly ruled out as BLOCKED, and a refinement that names the finding it sharpens updates that finding instead of appearing as a second open finding. On the evidence run that reported 33 false BLOCKED traceability lines and two rows for `R1-P2-001`, the same inputs now produce no traceability dead end and one registry entry.

### Truthful dead ends

`parseIterationFile` used the `Traceability Checks` markdown section as a fallback for `Dead Ends`. Every deferred or partial protocol line then reached `buildExhaustedApproaches` and rendered as `### ... -- BLOCKED` with `Do NOT retry`. The parser now reads only `Dead Ends`, while `buildTraceabilityRollup` keeps the structured protocol status in `registry.traceability`. An explicit dead end and a `Ruled Out` entry still render as BLOCKED.

### One registry entry per refinement

Both structured finding converters now carry an optional `refines` value, read from `refines` or the observed `refinementOf` spelling. `upsertFinding` resolves it against the in-memory finding map before the content-based id-reuse split. A resolved target takes the newer title, description, `lastSeen` and one refinement transition, and no second row is inserted. An unresolved value falls through to the ordinary insert path, and an unlinked id reuse keeps both findings as it does today. The churn buckets ignore a transition whose `from` equals `to`, so a same-severity refinement stays in `persistentSameSeverity`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | Drop the traceability dead-end fallback, carry `refines`, fold a linked refinement and ignore no-op severity transitions |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` | Created | Four cases: no false BLOCKED, the fold, the unknown-target fallback and the unlinked id-reuse guard |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modified | One line that says when a finding writes `refines` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The new test file ran first against the unedited reducer and failed for the two intended reasons. The reducer edit followed, then the same file passed. Every existing test file that loads the reducer ran before and after the change, and both runs reported the same 10 files and 59 tests passing. Strict packet validation ran last.

The baseline commands and their exit statuses are in `scratch/baseline.txt`. The failing run is in `scratch/red.txt` and the passing run is in `scratch/green.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the fallback rather than filter its entries | The section describes protocol status, and the structured rollup already owns that. Filtering would keep a second, weaker copy of the same state. |
| Fold on `refines` before the id-reuse split | The explicit link is stronger evidence than a content comparison. A row without that link keeps today's one-entry-per-content behavior. |
| Accept `refinementOf` as an alias | The reported review run records the link under that spelling, and dropping it would leave the evidence run uncorrected. |
| Keep the fold in `upsertFinding` | Both structured sources converge there, so the two converters only normalize the field and one place decides how a link resolves. |
| Split the unknown-target fallback into its own case | The fold criterion pins its fixture to one open finding, so the fallback needs a fixture of its own. The plan counts it inside the refines case, which is why the file runs four cases rather than three. |
| Ignore same-severity transitions only in the churn buckets | The transition stays on the finding as history. Excluding it from churn is what keeps a refinement from looking like a severity adjustment. |
| Leave the narrative `Refines:` line unparsed | No observed run carries a machine link in the prose, and the structured row is the source the reducer already trusts. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red run: `env -u AI_SESSION_CHILD node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` before the edit | Exit 1. 4 tests, 2 pass, 2 fail. `traceability checks do not become blocked dead ends` and `a refines row folds into its target` failed, the unknown-target and id-reuse cases passed. `scratch/red.txt`. |
| Green run: the same command after the edit | Exit 0. 4 tests, 4 pass, 0 fail. `scratch/green.txt`. |
| Existing reducer suite: `reduce-state-summary-fallback.test.cjs` before and after | Exit 0 both times, 1 test pass. |
| Existing progress record suite: `progress-record.test.cjs` before and after | Exit 0 both times, 1 test pass. |
| Deep-loop runtime unit tests that load the reducer, before and after | Exit 0 both times, 4 files and 34 tests pass. |
| System-spec-kit root reducer test, before and after | Exit 0 both times, 1 file and 1 test pass. |
| System-spec-kit cli reducer tests, before and after | Exit 0 both times, 3 files and 22 tests pass. |
| Total compatibility count | 10 files and 59 tests pass before the edit, the same 10 files and 59 tests pass after it. |
| `node --check` on the reducer and the new test file | Exit 0 for both. |
| Reducer exports | `node -p` printed `function function` for `reduceReviewState` and `parseIterationFile`. |
| Prompt template line | `rg -n "refines" .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` printed one line, at line 165. |
| Strict packet validation | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A prose-only refinement is still counted as a new finding.** The numbered markdown narrative is not parsed for a `Refines:` line, so only a structured `findingDetails[]` row or a `type:"finding"` delta row folds. Record the link in the structured row when the refinement must reduce to one finding.
2. **The folded entry keeps no copy of the earlier title or description.** The refinement transition records the severity on both sides, not the wording it replaced. The prior text remains in the iteration file that first reported it.
<!-- /ANCHOR:limitations -->
