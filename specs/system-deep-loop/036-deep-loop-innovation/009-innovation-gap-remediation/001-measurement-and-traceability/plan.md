---
title: "Implementation Plan: Measurement and Traceability"
description: "Implementation plan for the derived recommendation traceability join, composition status schema, and consolidation alias manifest."
trigger_phrases:
  - "measurement traceability implementation plan"
  - "recommendation status join plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
    last_updated_at: "2026-08-17T04:04:40Z"
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
# Implementation Plan: Measurement and Traceability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop recommendation evidence and consolidated path topology |
| **Change class** | Additive derived artifacts, schemas, and deterministic validation |
| **Authority** | Measurement-only; no shadow wiring or authority transition |
| **Primary inputs** | Frozen 178-row ledger, ledger validation report, current runtime symbols/tests, composition roots, and canonical path topology |

### Overview
Build a deterministic read-only join over the frozen recommendation ledger. Select the 72 canonical
`adopt-as-phase-013` rows, compute the merge lineage that resolves into those rows, attach only verified current
runtime symbols, composition roots, and test evidence, and derive one composition status from independent library,
shadow, and authority fields. Add a consolidation alias manifest so frozen historical pointers continue to resolve to
current canonical paths without rewriting the ledger. The ledger's planning role and 72-row phase count are confirmed
in `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:98-103`
and `:125-135`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Record the frozen ledger and validation-report digests and confirm both inputs are unchanged before implementation
- [x] Confirm the validation report's 178-row source bijection and the delivered 72-row phase-013 adoption count
- [x] Freeze the closed merge-lineage, dependency-relation, status-field, composition-status, and alias schemas
- [x] Define the repository boundary and canonical path rules used by alias resolution
- [x] Inventory current runtime and test files before assigning any symbol, composition root, or test evidence
- [x] Confirm the implementation writes only phase-local derived artifacts and never opens the frozen ledger for write

### Definition of Done
- [x] Exactly 72 unique canonical phase-013 adoption rows validate
- [x] Every merged recommendation resolving into the canonical set remains present as lineage without inflating 72
- [x] Every canonical row records `DLR-B-057` with relation `inherited_phase_contract`
- [x] Every canonical row has one valid three-field status object and one deterministically derived scalar status
- [x] Every stale frozen pre-consolidation pointer resolves uniquely to an existing current path
- [x] Negative fixtures fail closed for count, lineage, reference, status, alias, and source-mutation defects
- [x] Repeated builds are byte-identical and before-and-after source digests match
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Frozen-input reader**: reads and digests the canonical ledger and validation report, verifies the source report's
  pass state and expected counts, and exposes no write path to either input.
- **Adoption selector**: selects unique rows whose frozen disposition is `adopt-as-phase-013` and requires exactly 72.
- **Merge-lineage resolver**: follows frozen `merge-into-<id>` edges, rejects missing targets, self-links, and cycles,
  and retains only merged rows whose terminal adoption belongs to the selected phase-013 set.
- **Traceability evidence collector**: records exact current file/symbol references, composition roots, and named test
  evidence. It permits explicit absence but never converts recommendation prose into an uncited runtime symbol.
- **Inherited-contract binder**: attaches `DLR-B-057` + `inherited_phase_contract` to every canonical adoption while
  preserving DLR-B-057's frozen phase-006 disposition. The source row and phase assignment are confirmed at
  `recommendation-ledger.json:1807-1829` and `recommendation-ledger-validation.json:258-267` in the ledger packet.
- **Status projector**: validates `library`, `shadow`, and `authority` independently, enforces evidence prerequisites,
  and derives exactly one scalar `legacy_authoritative`, `shadow_wired`, or `cut_over` value.
- **Alias resolver**: inventories stale frozen pointers, maps each old path to one canonical current path, rejects
  duplicate/cyclic/escaping entries, and verifies the target exists without changing historical source bytes.
- **Artifact validator**: validates schemas, cardinality, merge closure, dependency inheritance, evidence shape, status
  derivation, alias resolution, deterministic bytes, and frozen-input digest preservation.

The data flow is fixed: digest frozen inputs -> verify ledger report -> select 72 adoptions -> resolve merged lineage ->
bind inherited contract -> collect confirmed evidence -> validate three status fields -> derive scalar status -> build
aliases -> verify targets -> rebuild deterministically -> compare source and output digests. Any earlier failure blocks
publication of downstream artifacts.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze artifact schemas and closed vocabularies for canonical adoptions, merged lineage, evidence references, inherited dependency, three-field status, scalar status, aliases, and validation results.
- Capture source digests and verify the existing ledger report's source bijection and phase-013 count.
- Inventory all frozen path-bearing fields and define canonical current-path resolution under the repository root.
- Build a current-tree evidence inventory of candidate runtime files, exact symbols, composition roots, and named tests without assigning unverified matches.

### Phase 2: Implementation
- Implement read-only phase-013 selection and require 72 unique canonical adoption IDs.
- Implement merge-closure traversal with deterministic ordering and cycle, missing-target, and cross-phase rejection.
- Attach `DLR-B-057` as `inherited_phase_contract` to every canonical adoption without changing its frozen disposition.
- Populate runtime, composition, and test references from exact current-tree evidence; preserve explicit empty states.
- Implement three-field validation and deterministic scalar `composition_status` derivation with evidence prerequisites.
- Build the consolidation alias manifest from stale frozen pointers and verify every current target exists uniquely.
- Emit deterministic machine-readable traceability, schema, alias, and validation artifacts in the phase folder.

### Phase 3: Verification
- Verify the canonical adoption denominator is exactly 72 and each ID appears once.
- Verify every relevant merged row resolves to one selected adoption and cannot alter the denominator.
- Verify every canonical row has the inherited dependency, traceability fields, three status fields, and one scalar status.
- Inject malformed status combinations, invented or missing references, lineage cycles, bad aliases, and source drift and prove each fails closed.
- Build twice from identical inputs and compare all output bytes.
- Recompute the frozen ledger and validation-report digests and prove no mutation occurred.
- Run strict packet validation and record command output, exit status, and any orchestrator-owned metadata exceptions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Snapshot source digests before and after positive and negative runs; any byte change fails and no write-capable source API is exposed |
| REQ-002 | Positive selection yields 72 unique canonical phase-013 IDs; duplicate, missing, extra, wrong-phase, cyclic, and unresolved merge fixtures fail |
| REQ-003 | Remove or alter the `DLR-B-057` relation on one row and require failure; verify the source row remains assigned to phase 006 |
| REQ-004 | Resolve every non-empty reference against the current tree and exact symbol/test declaration; fake paths, fake symbols, and unsupported evidence fail while explicit absence remains valid |
| REQ-005 | Exhaustively exercise allowed field combinations and reject multiple scalar values, invalid enums, contradictory states, or advanced status without required evidence |
| REQ-006 | Verify every inventoried stale pointer has one in-repository existing target; missing, duplicate, cyclic, ambiguous, and path-escape aliases fail |
| REQ-007 | Run two independent in-memory builds and two written verification passes; all artifact bytes and digests must match, and each malformed fixture must exit non-zero |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

There is no predecessor. The implementation consumes the frozen ledger artifacts in
`../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/`,
the current runtime tree under `.opencode/skills/system-deep-loop/runtime/`, current mode composition roots, and current
tests. The ledger spec requires its artifacts to remain separate from implementation work
(`../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md:70-73`,
`:89-93`).

The successor is `002-substrate-identity-fail-closed`; pilot and fleet cutover phases also consume this phase's
status vocabulary and traceability outputs. Those consumers must treat `library`, `shadow`, and `authority` as separate
facts. The current authority-flip source is explicitly dark and unit-test-only
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:5-11`), so this phase
cannot infer live wiring or authority from library presence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive and non-authoritative. Rollback removes or reverts only the phase-local generated join,
schemas, alias manifest, validator, and validation outputs. The frozen ledger, its validation report, runtime source,
tests, mode composition, and authority records remain untouched, so rollback requires no data migration or authority
restoration.

Before rollback, retain the source digests and the last validation report for audit. After rollback, recompute the
frozen input digests and verify they still match the pre-build values. If they differ, rollback is incomplete: restore
the frozen bytes from their tracked source and investigate the mutation before any successor consumes status evidence.
No alias entry may be copied back into a historical ledger field as a rollback shortcut.
<!-- /ANCHOR:rollback -->
