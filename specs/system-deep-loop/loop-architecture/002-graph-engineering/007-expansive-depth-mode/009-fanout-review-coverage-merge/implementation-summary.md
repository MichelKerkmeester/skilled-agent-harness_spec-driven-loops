---
title: "Implementation Summary: fan-out merge carries review coverage"
description: "The merged review registry of a fan-out run now carries the six coverage surfaces its lineages produced, merged by union, strongest restriction or per lineage, in a deterministic order."
trigger_phrases:
  - "fanout review coverage merge"
  - "divergence by lineage merge"
  - "merged review registry coverage"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/009-fanout-review-coverage-merge"
    last_updated_at: "2026-11-17T21:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Six coverage surfaces merged; five suites pass; readers audited"
    next_safe_action: "Final full-suite rerun after phase 014"
    blockers:
      - "None open for this phase; the final full-suite rerun after phase 014 is the remaining check"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-fanout-review-coverage-merge |
| **Completed** | 2026-11-17, merged into integration. Playbook scenario DRV-071 and changelog `changelog/v2.1.2.0.md` written by `@markdown` in integration. The merge gate on the integration branch after this phase merged printed 185 files, 3136 passed, 9 skipped, 1 failed. The one failure is `fanout-pool.vitest.ts` (orphan grace window, 15 ms), which passes 42 of 42 run alone and sits in a file no wave-1 phase changed; the final full-suite rerun decides it |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mergeReviewRegistries` now returns the coverage its lineages recorded, following the rules in `plan.md` §3:
- `dimensionCoverage`: a union with sorted keys.
- `traceability`: per protocol, the strictest status wins (`fail` over `blocked` over `partial` over `pass` over `notApplicable`), and an undecided status never replaces a decided one. The `summary` is recomputed with the reducer's counting rules, and `unfinishedCoreProtocols` is a sorted union.
- `searchCoverage`: sorted unions. `graphCoverageMode` is kept only when every lineage agrees.
- `candidateCoverage`: sorted bucket unions. A shared bug class has its flags ORed, its iterations unioned and a `lineages` list added.
- `divergenceByLineage`: each lineage's pivot state, kept whole under its label.
- `ruledOutCandidates`: entries carry a `lineage` field and are deduped on lineage plus id, then sorted.

Every merge walks lineages in label order, so the output does not depend on arrival order. This slice adds data only, and the guard that reads it ships with Slice K.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modified | Six merge helpers and `mergeReviewCoverageSurfaces`, spread into the merged review registry |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Nine cases: presence, one per surface, order swap, missing fields |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Modified | End-to-end case through the `fanout-merge.cjs` script |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four one-change DeepSeek V4.1 Flash dispatches on the OpenCode Go lane, in this order:
1. The nine unit cases, written first. Seven failed before the merge was wired.
2. The helper block.
3. The one-line wiring.
4. The end-to-end case.

The orchestrator read each diff and reran each check. Briefs and results are in `scratch/dispatch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Merge rules from `plan.md` §3 | Goal D1 |
| `divergenceByLineage`, never a merged `divergence` | A merged current focus would be invented; pivot state is lineage-local |
| No `frontier` merge | Goal D3: Slice K owns it |
| T003-T008 as one helper dispatch plus one wiring dispatch | The six helpers share three small utilities, and the tests went in first, so each surface still has its own named case |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Five REQ-004 suites | Pass | 5 files, 102 passed, exit 0; the baseline was 92, plus 10 new cases |
| Fail before, pass after | Pass | The seven per-surface cases failed before the wiring and pass after it |
| Measured behavior (T012) | Pass | `rg -c` in `fanout-merge.cjs`: `dimensionCoverage` 2, `traceability` 5, `searchCoverage` 2, `candidateCoverage` 2, `divergence` 3, `ruledOutCandidates` 3 |
| Readers (REQ-007) | Pass | Seven files recorded as safe or changed in `goal.md` §4 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Playbook scenario written** as DRV-071 in `deep-review/manual-testing-playbook/fanout/fan-out-merged-coverage-surfaces.md`.
2. **Changelog entry written** as `changelog/v2.1.2.0.md`.
3. **Iteration numbers in `candidateCoverage.byBugClass` are per lineage.** The union mixes them, and the `lineages` list is what keeps them attributable.
<!-- /ANCHOR:limitations -->
