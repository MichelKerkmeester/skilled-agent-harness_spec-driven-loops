---
title: "Tasks: Live Decontaminated-Holdout Lane + T1 to T2 Circularity Gate"
description: "Task breakdown for the live anti-overfit lane phase, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "live anti-overfit lane tasks"
  - "circularity meter gate tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Live Decontaminated-Holdout Lane + T1 to T2 Circularity Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the existing `--fixtures-dir` e2e result in router mode as the unchanged baseline
- [ ] T002 Capture the dead `computeDivergence` and `divergence` aggregate parameter as the wiring target
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fixture path through the live seam

- [ ] T003 Refactor `runLegacyFixtures` to `runFixtures({traceMode, executor})` using `dispatchScenario` (`run-skill-benchmark.cjs`)
- [ ] T004 Add the fixture to scenario adapter feeding the existing `expectedFromScenario`
- [ ] T005 Confirm T2 holdouts get a live `resourceRecall` against private gold with the post-dispatch join
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Circularity meter and opt-in gate

- [ ] T006 Add `computeCircularityMeter(rows)` — per-tier mean of `dims.d1intra.resourceRecall`
- [ ] T007 Publish `report.circularity` and render a report section
- [ ] T008 Reuse `computeDivergence` for router-versus-live corroboration
- [ ] T009 Add the opt-in `--anti-overfit-gate` verdict (`CIRCULARITY-WARN` soft / `BLOCKED-BY-OVERFIT` hard) behind a minimum sample floor, repeat-and-median and live-mode-only
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T010 Unit-test the circularity gap math and sample-floor status
- [ ] T011 Test the fixture live path via `parseLiveResult` synthetic NDJSON (no network in CI)
- [ ] T012 Confirm the existing `--fixtures-dir` e2e passes unchanged in router mode
- [ ] T013 Confirm the gate stays advisory by default and hard-blocks only behind the explicit flag plus sample floor
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
