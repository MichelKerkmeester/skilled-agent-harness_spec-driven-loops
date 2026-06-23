<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Search-Quality Fixes

<!-- ANCHOR:tasks -->
## TASKS

| ID | Task | Fix | Status | Evidence |
|----|------|-----|--------|----------|
| T1 | Bridge `stage4.evidenceGapDetected` into `extraData.evidenceGap` (activate the cap) | Q1 | pending | |
| T2 | Verify recovery classification on a true gap (the blast radius) | Q1 | pending | |
| T3 | Add a separate `retrievalProfileApplied` status; stop overloading `weightsApplied` | Q4 | pending | |
| T4 | Surface the resolved row score on graph/degree rows | Q5a | pending | |
| T5 | Deterministic ranking behind default-off `SPECKIT_DETERMINISTIC_RANKING` | Q6 | pending | |
| T6 | Three-tier-aware `citeCorrect` in `extract-metrics.mjs` | Q3 | pending | |
| T7 | Presentation contract: count equals rows shown; render leaf title | Q5b/c | pending | |
| T8 | Focused vitests + rebuild dist + recycle daemon | all | pending | |
| T9 | Fast-subset benchmark re-run; confirm Q1 caps + honest metric | verify | pending | |
<!-- /ANCHOR:tasks -->
