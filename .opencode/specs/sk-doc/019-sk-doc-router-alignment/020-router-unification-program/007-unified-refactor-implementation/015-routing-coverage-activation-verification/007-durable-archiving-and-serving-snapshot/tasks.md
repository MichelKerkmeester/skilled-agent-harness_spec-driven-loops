---
title: "Tasks: Durable Archiving & Serving-Snapshot"
description: "Planned task breakdown for the report-path convention, the serving-snapshot.json schema and renderer, the report.compiledRouting render block, repo-relative provenance, and the append-only flip-history log."
trigger_phrases:
  - "durable archiving tasks"
  - "serving snapshot tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Durable Archiving & Serving-Snapshot

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Verified after implementation evidence exists |
| `[P]` | Parallelizable after dependencies are green |
| `[B]` | Blocked by an explicit dependency |

**Task Format**: `T### [P?] Description (requirement; target file) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `../002-runtime-promotion-and-status-foundation/` and `../004-benchmark-compiled-lane-c/` readiness; pin the `010` manifest field shape and the `compiledRoute` parity JSON shape. (REQ-002, REQ-003; dependency confirmation)
- [ ] T002 Pin the `serving-snapshot.json` schema field list against the confirmed manifest shape. (REQ-002; schema fixture)
- [ ] T003 Inventory each hub's `benchmark/` directory naming family to select non-colliding new labels. (REQ-003; per-hub `benchmark/` listing)

**Planned evidence**: dependency-confirmation note, pinned schema fixture, per-hub naming inventory.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement the fail-closed report-path convention `<hub>/benchmark/compiled-routing/<run-label>/`. (REQ-001) {deps: T003}
- [ ] T005 Implement the `serving-snapshot.json` capture step reading the active `010` manifest, flag, freshness, and latest parity. (REQ-002, REQ-004) {deps: T001, T002}
- [ ] T006 [P] Implement the snapshot renderer under `sk-doc:create-benchmark`. (REQ-002) {deps: T005}
- [ ] T007 [P] Add the `report.compiledRouting` block to the non-frozen `build-report.cjs`. (REQ-003) {deps: T001}
- [ ] T008 Implement repo-relative provenance (`rootRel` + immutable digests) for newly-archived artifacts. (REQ-005) {deps: T004}
- [ ] T009 Implement the append-only `flip-history.jsonl` writer per hub. (REQ-006) {deps: T004}
- [ ] T010 Persist the execution-context block (executor, model + variant, CLI version, flag state, runtime digest, manifest digest, scenario IDs, run revision) on every archived artifact. (REQ-007) {deps: T004, T007}
- [ ] T011 [P] Update all 7 hub `benchmark/README.md` index files with the new convention. (REQ-008) {deps: T004}

**Planned evidence**: report-path convention implementation, `serving-snapshot.json` capture + renderer output, `build-report.cjs` diff, provenance fixture, `flip-history.jsonl` fixture, execution-context fixture, 7 updated READMEs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Collision test: re-run against an existing `<run-label>`; confirm a fail-closed, non-zero, no-partial-write result. (REQ-001)
- [ ] T013 Boundary test: point the capture step at a `006-parent-hub-rollout` shadow-candidate manifest; confirm rejection. (REQ-004)
- [ ] T014 Drift test: mutate the active manifest mid-capture; confirm the archive aborts rather than completing. (REQ-004)
- [ ] T015 Confirm the three frozen scorer digests are unchanged and no `baseline/` directory was written to by this packet. (hard constraint restated)
- [ ] T016 Portability test: copy a newly-archived artifact to a different path; confirm it still validates via `rootRel` + digests. (REQ-005)
- [ ] T017 Append-only test: compare `flip-history.jsonl` entry count and byte-prefix before/after a second run; confirm growth-only. (REQ-006)
- [ ] T018 Run strict spec-folder validation on this phase folder. (all REQs)

**Planned evidence**: collision/boundary/drift fixture results, unchanged scorer digests, empty `baseline/` diff, portability fixture, append-only comparison, `validate.sh --strict` output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-001 through REQ-008 have direct fixture or check evidence.
- [ ] The report-path convention fails closed on collision, every time.
- [ ] `serving-snapshot.json` + renderer ship and join manifest + fence + flag + freshness + parity correctly.
- [ ] `report.compiledRouting` renders via the non-frozen orchestrator; `baseline` is never touched.
- [ ] Every archive is traceable to, and gated on, the active `010` manifest.
- [ ] Repo-relative provenance and append-only `flip-history.jsonl` both ship.
- [ ] No frozen scorer file is modified; strict packet validation reports zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Upstream research**: `../001-research/synthesis-v1.md` §2.5, `../001-research/review-v1.md` §4
- **Dependencies**: `../002-runtime-promotion-and-status-foundation/`, `../004-benchmark-compiled-lane-c/`
<!-- /ANCHOR:cross-refs -->
