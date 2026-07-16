---
title: "Tasks: Recommendation Ledger — Bijective Classified Map"
description: "Tasks to extract, identify, normalize, classify, emit, and verify all 178 recommendations as one bijective single-disposition ledger."
trigger_phrases:
  - "recommendation ledger tasks"
  - "bijective map verification tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
    last_updated_at: "2026-07-15T13:25:45Z"
    last_updated_by: "codex"
    recent_action: "Sequenced ledger construction and bijection verification tasks"
    next_safe_action: "Run T001 to freeze source paths, digests, and extraction ordinals"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Recommendation Ledger — Bijective Classified Map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze repo-relative source paths, SHA-256 digests, expected counts, and locator schemes for run-a, run-b, and run-c
- [ ] T002 Extract run-a ranks 1-8 from the 001 research synthesis and bind the packet's findings registry as companion provenance
- [ ] T003 Extract run-b JSON pointers `/recommendations/0..58` and assert 59 unique recommendation texts
- [ ] T004 Extract run-c JSON pointers `/recommendations/0..110`, assert 111 unique recommendation texts, and preserve optional empty metadata
- [ ] T005 Freeze the `DLR-A/B/C-NNN` ID ranges, phase-003 taxonomy enum, and manifest phase IDs before classification starts
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Define the canonical ledger schema, source manifest, row provenance fields, normalized-target object, disposition grammar, and coverage-report contract
- [ ] T007 Mint and persist `DLR-A-001..008`, `DLR-B-001..059`, and `DLR-C-001..111` from frozen source locators without content-derived IDs
- [ ] T008 Preserve raw recommendation, target, rationale, evidence, iteration/rank, source path, source locator, and source digest on every row
- [ ] T009 Normalize one primary taxonomy layer/key per row; retain compound raw targets and document ambiguous-primary reviewer rationale
- [ ] T010 Assign exactly one disposition per row from the four allowed forms and require reasons for merge, defer, and reject
- [ ] T011 Validate merge targets as existing non-self IDs, reject cycles, and retain every merged recommendation as its own ledger row
- [ ] T012 Generate explicit disposition and phase coverage matrices, including reasoned zero-count buckets and phases
- [ ] T013 Emit canonical JSON, deterministic CSV, JSON schema, validator, and machine-readable validation report inside the phase folder
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify the source arithmetic and ledger cardinality are exactly `8 + 59 + 111 = 178`
- [ ] T015 Verify 178 unique stable IDs and 178 unique source locators form a two-way bijection with the extracted corpus
- [ ] T016 Verify every row has one allowed normalized target and exactly one allowed disposition; no `unknown` or parallel flags exist
- [ ] T017 Verify all four disposition bucket keys are present and any zero count carries an explicit rationale
- [ ] T018 Verify every adoption maps to a real manifest phase and every merge/defer/reject row satisfies its reason/reference contract
- [ ] T019 Verify the phase coverage report enumerates every manifest phase `000..014`, including explicit reasoned zero-adoption phases
- [ ] T020 Regenerate CSV and validation report twice; compare ID sets and hashes with the canonical JSON for deterministic parity
- [ ] T021 Run negative fixtures for missing rows, duplicate IDs, duplicate locators, invalid targets, multi-disposition rows, blank reasons, invalid phases, and merge cycles
- [ ] T022 Run `validate.sh --strict` for this packet and attach the ledger-validator command, exit code, counts, and artifact hashes to execution evidence
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (178-row ledger validator, deterministic projection checks, and strict spec-kit validation)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
