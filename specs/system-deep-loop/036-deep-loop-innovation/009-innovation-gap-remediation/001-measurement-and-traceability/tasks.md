---
title: "Tasks: Measurement and Traceability"
description: "Tasks for the derived recommendation traceability join, three-field status schema, and consolidation alias manifest."
trigger_phrases:
  - "measurement traceability tasks"
  - "recommendation status join tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "cursor"
    recent_action: "Built the derived 72-row traceability join, aliases, and fail-closed validator"
    next_safe_action: "Use the measurement baseline in the substrate-identity successor"
    blockers: []
    key_files:
      - "recommendation-traceability.json"
      - "build-traceability.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Measurement and Traceability

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

- [x] T001 Record SHA-256 digests for the frozen recommendation ledger and validation report and verify both are read-only inputs [Evidence: `source-digests.json`; `node build-traceability.ts --verify` exit 0; frozen files opened with `O_RDONLY`]
- [x] T002 Confirm the validation report's 178-row source bijection and the delivered 72-row phase-013 adoption count [Evidence: `traceability-validation.json` counts `frozen_source_rows=178` `canonical_adoptions=72`]
- [x] T003 Define closed schemas for canonical adoption rows, merged lineage, verified evidence references, inherited dependencies, three-field status, scalar status, aliases, and validation output [Evidence: `recommendation-traceability.schema.json`, `consolidation-alias-manifest.schema.json`, `traceability-validation.schema.json`]
- [x] T004 Inventory every frozen path-bearing field that can contain a pre-consolidation pointer and define repository-root canonicalization rules [Evidence: `frozen-path-inventory.json`]
- [x] T005 Inventory exact current runtime file/symbol declarations, composition roots, and named tests without assigning prose-derived or unverified references [Evidence: `current-tree-inventory.json`; published rows keep `presence=absent`]
- [x] T006 Define deterministic ordering and byte-canonicalization rules for every emitted artifact [Evidence: `traceability-validation.json` determinism `build_1` hashes equal `build_2`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Implement read-only selection of unique `adopt-as-phase-013` rows and require exactly 72 canonical adoption IDs [Evidence: `recommendation-traceability.json` `canonical_adoptions.count=72`]
- [x] T008 Implement deterministic traversal of `merge-into-<id>` edges and reject missing targets, self-links, cycles, and terminal targets outside the phase-013 set [Evidence: `--fixture merge-missing-target|merge-self-link|merge-cycle|merge-terminal-outside-set` each exit 1]
- [x] T009 Preserve merged recommendations as lineage records that resolve to one canonical adoption without inflating the 72-row denominator [Evidence: `traceability-validation.json` `merged_lineage=48` `denominator=72` `lineage_excluded_from_denominator=true`]
- [x] T010 Attach `DLR-B-057` with relation `inherited_phase_contract` to every canonical adoption while preserving its frozen phase-006 disposition [Evidence: every canonical row in `recommendation-traceability.json`; `--fixture dependency-reclassified-phase-013` exit 1]
- [x] T011 Populate `runtime_symbol`, `composition_root`, and `test_evidence` only from exact current-tree evidence and represent absent evidence explicitly [Evidence: published rows `presence=absent`; `--fixture evidence-invented-path|evidence-inferred-from-prose` exit 1]
- [x] T012 Implement the `library`, `shadow`, and `authority` closed fields and their evidence prerequisites [Evidence: `recommendation-traceability.schema.json` enums; `--fixture status-advanced-without-evidence` exit 1]
- [x] T013 Derive exactly one scalar `composition_status` per canonical row as `legacy_authoritative`, `shadow_wired`, or `cut_over` [Evidence: all 72 rows `legacy_authoritative`; `--fixture status-scalar-mismatch|status-multiple-scalars` exit 1]
- [x] T014 Build the consolidation alias manifest with one old-path to current-path mapping for every inventoried stale frozen pointer [Evidence: `consolidation-alias-manifest.json` 4 unique entries]
- [x] T015 Reject unresolved, duplicate, ambiguous, cyclic, escaping, or non-existent alias targets [Evidence: `--fixture alias-missing|alias-duplicate|alias-ambiguous|alias-cyclic|alias-escaping|alias-nonexistent-target` each exit 1]
- [x] T016 Emit deterministic phase-local traceability, schema, alias, and validation artifacts without modifying frozen inputs [Evidence: `git status` clean on the ledger packet; digest MATCH]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verify exactly 72 unique canonical adoption rows and complete merged lineage into that set [Evidence: `node build-traceability.ts --verify` exit 0; `canonical=72 lineage=48`]
- [x] T018 Verify every canonical row contains the inherited dependency, all required traceability fields, three valid status fields, and one derived scalar status [Evidence: `recommendation-traceability.json` plus schema validation]
- [x] T019 Resolve every non-empty runtime symbol, composition root, and named test against the current tree and fail on fabricated or stale references [Evidence: `--fixture evidence-invented-path|evidence-invented-symbol` exit 1; published refs empty]
- [x] T020 Exercise every permitted status combination and reject invalid enums, contradictory combinations, multiple scalar values, or advanced status without evidence [Evidence: `traceability-validation.json` `permitted_combinations` length 6; status fixtures exit 1]
- [x] T021 Exercise alias negative fixtures for missing, duplicate, ambiguous, cyclic, escaping, and non-existent targets [Evidence: six `alias-*` fixtures each exit 1]
- [x] T022 Exercise selection, merge, dependency, evidence, status, and source-mutation negative fixtures and require non-zero results [Evidence: 27/27 `--fixture` runs exited 1]
- [x] T023 Run two deterministic builds and compare all traceability, schema, alias, and validation bytes [Evidence: `traceability-validation.json` determinism `build_1` equals `build_2`; `--write` then `--verify` both exit 0]
- [x] T024 Recompute frozen input digests and prove the 178-row ledger and validation report are unchanged [Evidence: recomputed SHA-256 MATCH `source-digests.json`; ledger packet `git status` clean]
- [x] T025 Run strict spec validation and record the summary, exit status, and only the expected orchestrator-owned metadata exceptions [Evidence: `validate.sh --strict` exit 2; packet-local FILE_EXISTS/EVIDENCE_CITED/TEMPLATE_HEADERS pass; remaining errors are missing `tsx`, missing `level-contract-resolver.js`, and fleet `COMMAND_TREE_PARITY`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] The 72-row canonical adoption set has exactly one scalar composition status per row
- [x] Every relevant merged recommendation resolves into the canonical set without changing its count
- [x] Every stale frozen pre-consolidation pointer resolves through the alias manifest
- [x] Frozen ledger and validation-report digests are unchanged
- [x] Deterministic and negative validation gates pass
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent remediation packet**: See `../spec.md`
- **Frozen ledger contract**: See `../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md`
- **Ledger implementation evidence**: See `../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md`
- **Ledger validation report**: See `../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/recommendation-ledger-validation.json`
- **Authority-flip evidence**: See `../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/implementation-summary.md`
- **Program architecture and cutover intent**: See `../../goal.md`
<!-- /ANCHOR:cross-refs -->
