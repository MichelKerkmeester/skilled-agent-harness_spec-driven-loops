---
title: "Tasks: Benchmark — Compiled Lane C Parity"
description: "Task breakdown for the non-frozen compiled-routing-parity harness, its two orchestrator hooks, the shape bridge, the vacuous-parity guard, and the flag-state/verdict-substate matrices. Not yet started."
trigger_phrases:
  - "compiled lane c parity tasks"
  - "benchmark parity task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Benchmark — Compiled Lane C Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [ ] T001 Read the hub manifest schema (`010-live-activation/activation/<hub>/manifest.json`) and confirm the 3 frozen-trio digest values against `010-live-activation/implementation-summary.md`.
- [ ] T002 [P] Confirm `leaf-resource-contract.cjs`'s current export surface for an additive `qualifiedIdToLeaf`.
- [ ] T003 [P] Re-anchor `run-skill-benchmark.cjs`'s verdict switch on the named symbol (not the ±2-10 line citation) before editing.
- [ ] T004 [P] Confirm `build-report.cjs`'s current renderer entrypoints for an additive `compiledRouting` block.

**Evidence (planned)**: Each read is checked against the real file at implementation time; no scaffolding is skipped.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author `compiled-routing-parity.cjs` exporting `compiledParity({scenario, legacyObserved, skillRoot, skillId})`.
- [ ] T006 Add `qualifiedIdToLeaf` reverse lookup to `leaf-resource-contract.cjs`, exposed via `selectResourceContract`.
- [ ] T007 Implement the vacuous-parity guard (reads the hub's `activation/<hub>/manifest.json`; `servingAuthority !== 'compiled'` → hard-fail `vacuous`).
- [ ] T008 Implement the flag-state matrix (`unset / '0' / '1' / invalid`).
- [ ] T009 Implement the verdict sub-state (`compiled-serving | legacy-fallback-drifted | broken-compiled-path`) in `run-skill-benchmark.cjs` — non-frozen only. **SAFETY: never in `score-skill-benchmark.cjs`.**
- [ ] T010 Wire the outer verdict switch to inspect the sub-state before deciding BLOCKED/CONDITIONAL/DEGRADED; add the `BLOCKED-BY-COMPILED-DRIFT` branch (exit 3).
- [ ] T011 Attach `row.compiledParity` after `row.routeGold`; add `compiledEligibility` + the status enum `{match|drift|vacuous|n/a|resolver-missing}` to `routeGold.summary`.
- [ ] T012 Add the `compiledRouting` JSON→Markdown render block to `build-report.cjs`.
- [ ] T013 Wire `--compiled-routing-parity` through `loop-host.cjs` + command I/O + both skill-benchmark workflow dispatches (or the unconditional-`auto` fallback if the flag route proves unreachable).
- [ ] T014 Document the single blocking drift-gate owner (this packet); note other consumers as report-only (F-25-8).

**Evidence (planned)**: Each item lands as a scoped diff inside the Files-to-Change table in `spec.md`; no file outside that table is touched.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Frozen-trio SHA-256 diff pre/post the full task set: zero drift.
- [ ] T016 Vacuous-parity fixture sweep across all 7 current hub manifests + one synthetic `servingAuthority: legacy` fixture.
- [ ] T017 `qualifiedIdToLeaf` bijection Vitest against every eligible hub's `leaf-manifest.json`.
- [ ] T018 Flag-state matrix Vitest (4 states, expected outcomes).
- [ ] T019 Verdict sub-state Vitest (3 distinct outer verdicts; assert no OR-collapse).
- [ ] T020 Rendered-report fixture test (`compiledRouting` block populated, not empty/placeholder).
- [ ] T021 `validate.sh --strict` on this phase folder → Errors: 0.

**Evidence (planned)**: None of the above has run yet. This phase defines the acceptance bar; `implementation-summary.md` will be updated with real results once implementation starts.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] `compiled-routing-parity.cjs` ships; frozen trio byte-identical pre/post.
- [ ] Vacuous-parity guard proven on a fixture sweep.
- [ ] Flag-state matrix + verdict sub-state Vitests green.
- [ ] Rendered report includes a populated `compiledRouting` block.
- [ ] Single blocking drift-gate owner documented.
- [ ] Strict Level-2 packet validation passes on this phase folder.

**Evidence**: Not yet executed — Planned. This packet has not been implemented; the criteria above define what MUST be proven before `implementation-summary.md` can honestly claim completion.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream research**: `../001-research/{review-v1.md, synthesis-v1.md}` §2.2 (CF-BM-1..8)

<!-- /ANCHOR:cross-refs -->
