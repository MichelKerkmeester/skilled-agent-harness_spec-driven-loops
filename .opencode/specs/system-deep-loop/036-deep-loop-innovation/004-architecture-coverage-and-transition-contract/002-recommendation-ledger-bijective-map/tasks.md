---
title: "Tasks: Recommendation Ledger — Bijective Classified Map"
description: "Tasks to extract, identify, normalize, classify, emit, and verify all 178 recommendations as one bijective single-disposition ledger."
trigger_phrases:
  - "recommendation ledger tasks"
  - "bijective map verification tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
    last_updated_at: "2026-07-20T18:39:30Z"
    last_updated_by: "codex"
    recent_action: "Completed ledger construction and all phase-local and strict validation tasks"
    next_safe_action: "Use the immutable ledger as the downstream phase ownership source"
    blockers: []
    key_files:
      - "recommendation-ledger.json"
      - "recommendation-ledger-validation.json"
      - "validate-ledger.cjs"
    completion_pct: 100
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

- [x] T001 Freeze repo-relative source paths, SHA-256 digests, expected counts, and locator schemes for run-a, run-b, and run-c. [Evidence: `recommendation-ledger-validation.json` source manifest]
- [x] T002 Extract run-a ranks 1-8 from the 001 research synthesis and bind the packet's findings registry as companion provenance. [Evidence: `node validate-ledger.cjs --verify` source-adapter checks pass]
- [x] T003 Extract run-b JSON pointers `/recommendations/0..58` and assert 59 unique recommendation texts. [Evidence: `recommendation-ledger-validation.json` reports 59 run-b rows]
- [x] T004 Extract run-c JSON pointers `/recommendations/0..110`, assert 111 unique recommendation texts, and preserve optional empty metadata. [Evidence: `recommendation-ledger-validation.json` reports 111 run-c rows and four empty `uniqueness` values]
- [x] T005 Freeze the `DLR-A/B/C-NNN` ID ranges, phase-003 taxonomy enum, and manifest phase IDs before classification starts. [Evidence: `validate-ledger.cjs` frozen constants]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Define the canonical ledger schema, source manifest, row provenance fields, normalized-target object, disposition grammar, and coverage-report contract. [Evidence: `recommendation-ledger.schema.json`]
- [x] T007 Mint and persist `DLR-A-001..008`, `DLR-B-001..059`, and `DLR-C-001..111` from frozen source locators without content-derived IDs. [Evidence: `recommendation-ledger.json`]
- [x] T008 Preserve raw recommendation, target, rationale, evidence, iteration/rank, source path, source locator, and source digest on every row. [Evidence: `node validate-ledger.cjs --verify` schema and semantic row checks pass]
- [x] T009 Normalize one primary taxonomy layer/key per row; retain compound raw targets and document ambiguous-primary reviewer rationale. [Evidence: `node validate-ledger.cjs --verify` frozen taxonomy checks pass]
- [x] T010 Assign exactly one disposition per row from the four allowed forms and require reasons for merge, defer, and reject. [Evidence: `node validate-ledger.cjs --verify` disposition cardinality and reason checks pass]
- [x] T011 Validate merge targets as existing non-self IDs, reject cycles, and retain every merged recommendation as its own ledger row. [Evidence: `node validate-ledger.cjs --verify` merge graph checks and negative fixtures pass]
- [x] T012 Generate explicit disposition and phase coverage matrices, including reasoned zero-count buckets and phases. [Evidence: `recommendation-ledger-validation.json` coverage blocks]
- [x] T013 Emit canonical JSON, deterministic CSV, JSON schema, validator, and machine-readable validation report inside the phase folder. [Evidence: `recommendation-ledger-validation.json` artifact hashes]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify the source arithmetic and ledger cardinality are exactly `8 + 59 + 111 = 178`. [Evidence: `node validate-ledger.cjs --verify` exits 0]
- [x] T015 Verify 178 unique stable IDs and 178 unique source locators form a two-way bijection with the extracted corpus. [Evidence: `node validate-ledger.cjs --verify` bijection checks pass]
- [x] T016 Verify every row has one allowed normalized target and exactly one allowed disposition; no `unknown` or parallel flags exist. [Evidence: `node validate-ledger.cjs --verify` taxonomy and disposition checks pass]
- [x] T017 Verify all four disposition bucket keys are present and any zero count carries an explicit rationale. [Evidence: `recommendation-ledger-validation.json` four-bucket coverage]
- [x] T018 Verify every adoption maps to a real manifest phase and every merge/defer/reject row satisfies its reason/reference contract. [Evidence: `node validate-ledger.cjs --verify` manifest and reference checks pass]
- [x] T019 Verify the phase coverage report enumerates every manifest phase `003..017`, including explicit reasoned zero-adoption phases. [Evidence: `recommendation-ledger-validation.json` enumerates all 15 phases]
- [x] T020 Regenerate CSV and validation report twice; compare ID sets and hashes with the canonical JSON for deterministic parity. [Evidence: `recommendation-ledger-validation.json` records byte-identical ledger, CSV, and schema hashes across both builds]
- [x] T021 Run negative fixtures for missing rows, duplicate IDs, duplicate locators, invalid targets, multi-disposition rows, blank reasons, invalid phases, and merge cycles. [Evidence: `recommendation-ledger-validation.json` records 11 passing fixtures]
- [x] T022 Run `validate.sh --strict` for this packet and attach the ledger-validator command, exit code, counts, and artifact hashes to execution evidence. [Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0 with Errors 0; `implementation-summary.md` records ledger evidence]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [Evidence: T001-T022 are checked with substantive evidence]
- [x] All requirements in spec.md met with evidence. [Evidence: `recommendation-ledger-validation.json`]
- [x] Phase gate green (178-row ledger validator, deterministic projection checks, and strict spec-kit validation). [Evidence: `node validate-ledger.cjs --verify` and `validate.sh --strict` exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
