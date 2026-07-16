---
title: "Checklist: Recommendation Ledger — Bijective Classified Map"
description: "Blocking verification contract for the 178-row recommendation ledger, source bijection, stable identity, single disposition, and complete manifest-phase coverage."
trigger_phrases:
  - "recommendation ledger checklist"
  - "178 row bijection checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
    last_updated_at: "2026-07-15T13:25:45Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking ledger integrity and phase-coverage checks"
    next_safe_action: "Execute every P0 check against the emitted 178-row ledger"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Recommendation Ledger — Bijective Classified Map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the recommendation-ledger child. The execution report pins the
source paths + SHA-256 digests, ledger/schema/CSV/validation-report hashes, validator command + exit code, and the
8/59/111 extraction counts. Verification fails on zero extracted rows, source drift, a count other than 178, any
duplicate or omitted mapping, any invalid disposition/reference, or any silently absent disposition or phase bucket.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 006 parent spec, phase-tree manifest, phase-003 taxonomy, and three source-run inputs are pinned by repo-relative path and digest
- [ ] CHK-002 [P0] Source adapters prove run-a 8, run-b 59, run-c 111, total 178 before IDs are minted
- [ ] CHK-003 [P2] The execution report records the pinned commit and the reviewer responsible for ambiguous target/disposition decisions
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] The schema and validator are deterministic, fail closed on malformed or drifting input, and perform no writes outside this phase folder
- [ ] CHK-005 [P1] Stable IDs are persisted values derived once from frozen locators, not recommendation text hashes or mutable array order
- [ ] CHK-006 [P1] Raw source fields are preserved; target normalization never erases compound source targets or optional-empty metadata
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Canonical ledger row count is exactly 178 and source-run counts are exactly 8, 59, and 111
- [ ] CHK-008 [P0] Stable-ID set has exactly 178 unique values in the reserved `DLR-A/B/C-NNN` ranges with no gaps or reuse
- [ ] CHK-009 [P0] Source-locator set has exactly 178 unique values and equals the independently extracted source set in both directions
- [ ] CHK-010 [P0] Every row has one allowed phase-003 taxonomy layer/key and no `unknown`, blank, or out-of-enum target
- [ ] CHK-011 [P0] Every row has exactly one disposition matching `adopt-as-phase-NNN`, `merge-into-<id>`, `defer-with-reason`, or `reject-with-reason`
- [ ] CHK-012 [P0] Every merge/defer/reject row has a non-empty reason; merge targets exist, are non-self, and the merge graph is acyclic
- [ ] CHK-013 [P0] Every adoption's `NNN` exists in `manifest/phase-tree.json`; no free-text or nonexistent phase target passes
- [ ] CHK-014 [P0] Coverage report names all four disposition buckets with counts and row IDs; every zero-count bucket is explicit and reasoned
- [ ] CHK-015 [P0] Coverage report names every manifest phase `000..014` with adopted-row IDs and counts; every zero-adoption phase is explicit and reasoned
- [ ] CHK-016 [P0] Canonical JSON validates against the schema and deterministic CSV contains the identical 178-ID set and disposition/target values
- [ ] CHK-017 [P0] Two clean regenerations from the frozen inputs produce identical canonical, CSV, and validation-report hashes
- [ ] CHK-018 [P0] Negative fixtures fail non-zero for missing/extra rows, duplicate IDs/locators, invalid targets, multiple dispositions, blank reasons, invalid phases, self/missing merges, and merge cycles
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P1] Every source recommendation remains a ledger row even when merged, deferred, or rejected; no disposition removes source provenance
- [ ] CHK-020 [P1] Every ambiguous compound target has a documented primary-target rationale and retains its original target string
- [ ] CHK-021 [P1] Source, disposition, and phase coverage counts reconcile to the same 178-row canonical set
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P2] Extraction copies no credentials, host-specific secrets, or mutable runtime state; research inputs remain read-only
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P1] Packet docs name the canonical artifacts, stable-ID/disposition grammar, source-shape exception, validation command, and exact evidence locations
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-024 [P1] Canonical ledger, CSV, schema, validator, and validation report live under this phase folder; neither research packet nor the program manifest is modified
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when the independently extracted source set and canonical ledger form a 178-by-178
bijection, every row carries one stable ID, one normalized target, and one disposition, all references resolve, all
four disposition buckets and all 15 phases are explicit, deterministic projections match, negative fixtures fail
closed, and strict spec-kit validation is green.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records the frozen source and artifact hashes, the ledger validator reports 178/178
bijective rows with zero integrity violations, every P0 item has machine-detectable evidence, and the packet strict
validation reports no non-metadata error.
<!-- /ANCHOR:sign-off -->
