---
title: "Checklist: Measurement and Traceability"
description: "Blocking verification checklist for the derived recommendation traceability join, independent composition status, consolidation aliases, and frozen-ledger preservation."
trigger_phrases:
  - "measurement traceability checklist"
  - "recommendation composition verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
    last_updated_at: "2026-08-14T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned measurement and traceability verification contract"
    next_safe_action: "Implement and verify the derived join, status schema, and alias manifest"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Measurement and Traceability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the measurement and traceability phase. Every item remains pending
until the derived artifacts exist and the verifier records source and output digests, selected and merged row counts,
evidence-reference checks, status derivation, alias resolution, deterministic rebuild results, negative-fixture results,
and before-and-after frozen-ledger bytes. A missing row, inflated denominator, inferred runtime symbol, contradictory
status, unresolved alias, nondeterministic artifact, or source mutation fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The frozen recommendation ledger and validation report are identified as read-only inputs and their initial digests are recorded before generation (REQ-001, SC-005)
- [ ] CHK-002 [P0] The selection baseline confirms 178 immutable source rows and exactly 72 unique `adopt-as-phase-013` canonical IDs without treating merged lineage as additional adoptions (REQ-002, SC-001)
- [ ] CHK-003 [P0] The current tree is inspected before any `runtime_symbol`, `composition_root`, or `test_evidence` reference is accepted, and unresolved references have an explicit empty representation (REQ-004, SC-002)
- [ ] CHK-004 [P1] Every stale pre-consolidation pointer in the selected source and evidence set is inventoried before the consolidation alias manifest is emitted (REQ-006, SC-004)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The traceability schema requires each canonical row to carry `DLR-B-057` with relation `inherited_phase_contract` without reclassifying that dependency as a phase-013 adoption (REQ-003, SC-002)
- [ ] CHK-006 [P0] The status object accepts only the specified `library`, `shadow`, and `authority` values and exactly one scalar `composition_status` (REQ-005, SC-003)
- [ ] CHK-007 [P0] Scalar derivation is deterministic: authority `cut_over` wins, verified shadow wiring yields `shadow_wired` while authority remains legacy, and all other valid rows yield `legacy_authoritative` (REQ-005, SC-003)
- [ ] CHK-008 [P0] Shadow or authority advancement is rejected unless symbol, composition-root, and test evidence are non-empty and verified against the current tree (REQ-004, REQ-005)
- [ ] CHK-009 [P1] Merge-lineage traversal rejects cycles, missing targets, and targets outside the canonical phase-013 adoption set while preserving each merged recommendation as distinct provenance (REQ-002, SC-001)
- [ ] CHK-010 [P1] Alias validation rejects unresolved, duplicate, cyclic, non-existing, non-unique, or repository-escaping mappings (REQ-006, SC-004)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] A positive build emits exactly 72 unique canonical adoption rows and preserves the complete merged-lineage closure without changing the adoption denominator (REQ-002, SC-001)
- [ ] CHK-012 [P0] Validation rejects a missing, changed, or phase-013-reclassified `DLR-B-057` dependency on every canonical row (REQ-003, SC-002)
- [ ] CHK-013 [P0] A row with no confirmed implementation symbol or test remains explicitly empty, cannot be `test_verified`, and serializes no inferred symbol (REQ-004, SC-002)
- [ ] CHK-014 [P0] Every canonical row has one valid three-field status object and one scalar status that agrees with it; contradictory combinations fail validation (REQ-005, SC-003)
- [ ] CHK-015 [P0] Every inventoried stale pointer resolves through exactly one alias to an existing canonical path inside the repository (REQ-006, SC-004)
- [ ] CHK-016 [P0] Before-and-after digest checks prove that the frozen 178-row ledger and its validation report retain identical bytes (REQ-001, SC-005)
- [ ] CHK-017 [P0] Two builds over identical frozen inputs produce byte-identical traceability, schema, alias, and validation artifacts (REQ-007, SC-006)
- [ ] CHK-018 [P0] Positive verification exits zero and emits machine-readable counts, lineage, evidence, status, alias, digest, and determinism results (REQ-007, SC-006)
- [ ] CHK-019 [P0] Negative fixtures independently reject wrong adoption counts, duplicate IDs, broken merge lineage, invented evidence, invalid status, alias defects, and frozen-input mutation (REQ-007, SC-006)
- [ ] CHK-020 [P1] Status fixtures prove legacy authority plus verified shadow wiring derives `shadow_wired`, while `cut_over` remains impossible without verified authority evidence (REQ-005, SC-003)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P0] All 72 canonical rows, all merged-lineage records, and all inherited transition dependencies are accounted for with zero unexplained omissions (REQ-002, REQ-003)
- [ ] CHK-022 [P0] The stale-pointer inventory closes with every entry uniquely resolved or the phase remains blocked (REQ-006, SC-004)
- [ ] CHK-023 [P1] Any repaired count, lineage, evidence, status, alias, or mutation defect reruns the complete deterministic validator and source-digest checks (REQ-007, SC-006)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] Generation and validation have no write access to the frozen ledger, its CSV or schema projection, its validation report, or frozen research inputs (REQ-001, SC-005)
- [ ] CHK-025 [P0] Alias targets are normalized and constrained to existing paths inside the repository; path traversal and escape attempts fail closed (REQ-006, SC-004)
- [ ] CHK-026 [P1] Runtime, composition, and test evidence enters the join only after exact current file, symbol, and test confirmation; recommendation prose is never trusted as identity (REQ-004, SC-002)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P1] The implemented traceability, merge-lineage, status, alias, and validator contracts match `spec.md` and `plan.md` without claiming recommendation implementation from adoption alone
- [ ] CHK-028 [P1] Machine-readable results explain the 72-row denominator, merged-lineage count, inherited `DLR-B-057` relation, explicit absent evidence, and scalar status derivation (SC-001, SC-002, SC-003)
- [ ] CHK-029 [P2] Alias documentation distinguishes additive current-path resolution from any forbidden rewrite of historical frozen pointers (REQ-001, REQ-006)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P0] Derived traceability, schema, alias, and validation artifacts are stored outside the frozen ledger inputs and cannot overwrite them (REQ-001)
- [ ] CHK-031 [P1] Canonical and merged-lineage records remain structurally distinct so provenance is retained without inflating the adoption count (REQ-002, SC-001)
- [ ] CHK-032 [P1] Rebuilds leave no unexpected tracked mutation beyond the declared derived artifact set (REQ-007, SC-006)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when exactly 72 canonical phase-013 adoptions and their complete merged lineage are traceable,
every canonical row carries the inherited transition contract and evidence-bound independent status, every stale pointer
resolves uniquely inside the repository, deterministic positive and negative validation passes, and digest evidence proves
the frozen ledger and validation report remain byte-identical.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records the exact source and output identities, row and lineage closure, status and alias
results, negative-fixture outcomes, deterministic rebuild, and frozen-input preservation. Until then the phase remains
Planned and every checklist item stays unchecked.
<!-- /ANCHOR:sign-off -->
