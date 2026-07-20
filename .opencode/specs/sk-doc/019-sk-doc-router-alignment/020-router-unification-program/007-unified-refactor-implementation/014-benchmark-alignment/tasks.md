---
title: "Tasks: Lane C Compiled-Routing Benchmark Alignment"
description: "Planned tasks for a flag-on compiled parity harness, shared status classification, Lane C report gating, and frozen-file regression proof."
trigger_phrases:
  - "Lane C compiled routing tasks"
  - "benchmark parity task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Lane C Compiled-Routing Benchmark Alignment

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

- [ ] T001 Capture SHA-256 baselines for the three frozen Lane C files. (REQ-001; frozen files)
- [ ] T002 Capture representative hub/non-hub reports, D1-D5 values, verdicts, and exit codes. (REQ-005; temp outputs)
- [ ] T003 Pin the P0 front-door/status and P3 eligibility/discovery APIs. (REQ-002, REQ-004; shared interfaces)
- [ ] T004 Define the normalized routing projection and ordered identifier mapping for all hub archetypes. (REQ-003; registry normalization)
- [ ] T005 Design isolated fixture states for fresh, divergent, drifted, missing, and broken cases. (REQ-004, REQ-006, REQ-007; test fixtures)

**Planned evidence**: digest ledger, baseline reports, API note, normalization schema, and fixture matrix.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Create `compiled-routing-parity.cjs` with child-process compiled invocation and parent-env isolation. (REQ-002, REQ-006) {deps: T003}
- [ ] T007 Add registry-driven normalization for legacy intents and compiled targets. (REQ-003) {deps: T004, T006}
- [ ] T008 Call the frozen route-gold evaluator for both observations and compare normalized routing projections. (REQ-003) {deps: T007}
- [ ] T009 Add shared eligibility/status handling for fresh, drifted, missing, and broken states. (REQ-004) {deps: T003, T006}
- [ ] T010 Verify frozen digests at harness start/end and include them in the result. (REQ-001) {deps: T001, T006}
- [ ] T011 Integrate eligible route-gold rows into `run-skill-benchmark.cjs` without changing D1-D5 aggregation. (REQ-005) {deps: T008-T010}
- [ ] T012 Add `report.compiledRouting`, distinct gate/verdict handling, and process signal behavior. (REQ-005) {deps: T011}
- [ ] T013 [P] Render the JSON block in Markdown and update README/CLI semantics. (REQ-008) {deps: T012}

**Planned evidence**: module API tests, sample report JSON/Markdown, unchanged score aggregates, and distinct status outputs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify fresh eligible scenarios run flag-on and pass legacy gold, compiled gold, and mutual routing equality. (REQ-002, REQ-003, REQ-007)
- [ ] T015 Verify forced routing divergence reports the first differing field and blocks the parity gate. (REQ-003, REQ-005, REQ-007)
- [ ] T016 Verify stale manifests report drift/re-mint-required and no-manifest hubs report legacy-by-construction. (REQ-004, REQ-007)
- [ ] T017 Verify fresh-manifest resolver/front-door failure reports breakage, not drift. (REQ-004, REQ-007)
- [ ] T018 Verify child env isolation and zero manifest/routing-input mutation. (REQ-006, REQ-007)
- [ ] T019 Verify legacy D1-D5 and non-applicable runs match captured baselines. (REQ-005, REQ-007)
- [ ] T020 Run all existing Lane C suites plus the new parity suite; re-hash frozen files. (REQ-001, REQ-007, REQ-008)
- [ ] T021 Run strict spec-folder validation and record parent-owned metadata warnings separately. (REQ-008)

**Planned evidence**: Vitest output, before/after report comparison, environment snapshot assertion, manifest hash inventory, frozen digest equality, and strict validation output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-001 through REQ-008 have direct evidence.
- [ ] Every eligible route-gold row exercises the public flag-on compiled front door.
- [ ] Both paths pass the same gold and compare equal on routing fields.
- [ ] Drift, missing-manifest legacy, and breakage remain distinguishable.
- [ ] Existing D1-D5 values remain unchanged.
- [ ] The three frozen files remain byte-identical.
- [ ] Strict packet validation reports zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Consumed contract authority**: `../012-default-on-decision/decision-record.md`
<!-- /ANCHOR:cross-refs -->

