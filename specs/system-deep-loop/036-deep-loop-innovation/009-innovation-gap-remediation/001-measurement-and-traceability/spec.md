---
title: "Feature Specification: Measurement and Traceability"
description: "Plan the derived recommendation-to-runtime traceability join, three-field composition status schema, and consolidation alias manifest without rewriting the frozen recommendation ledger."
trigger_phrases:
  - "measurement and traceability"
  - "recommendation implementation traceability"
  - "deep-loop consolidation alias manifest"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability"
    last_updated_at: "2026-08-14T21:15:00Z"
    last_updated_by: "cursor"
    recent_action: "Built the derived 72-row traceability join, aliases, and fail-closed validator"
    next_safe_action: "Use the measurement baseline in the substrate-identity successor"
    blockers: []
    key_files:
      - "recommendation-traceability.json"
      - "consolidation-alias-manifest.json"
      - "traceability-validation.json"
      - "build-traceability.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Measurement and Traceability

> Phase adjacency under `009-innovation-gap-remediation`: predecessor none; successor `002-substrate-identity-fail-closed`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/001-measurement-and-traceability |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of the innovation-gap-remediation packet |
| **Depends on** | None (`[]`) |
| **Successor** | `002-substrate-identity-fail-closed` consumes this phase's status and traceability baseline |
| **Authority posture** | Measurement-only; this phase does not wire shadow roots or change runtime authority |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The frozen recommendation ledger proves a source-to-planning bijection, stable IDs, one disposition per source row,
and phase ownership. Its contract explicitly places the canonical JSON ledger and machine-readable validation report
in the ledger packet and excludes implementation of the recommendations
(`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md:70-73`,
`:89-93`). The delivered report confirms 178 immutable source rows and 72 adoptions assigned to phase 013, but it does
not claim that those 72 rows are implemented, tested, composed into a mode root, shadow-wired, or authoritative
(`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:52-60`,
`:98-103`, `:125-135`). A planning disposition therefore cannot serve as an implementation-status record.

The program architecture also requires status to preserve three different facts. The migration is additive and dark
first, then changes authority one mode at a time (`specs/system-deep-loop/036-deep-loop-innovation/goal.md:23-29`).
The authority-flip implementation states that its package is dark and not imported by a live mode adapter
(`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/implementation-summary.md:119-129`),
and the coordinator source repeats that no real mode registry or ledger calls it
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:5-11`). Library presence,
shadow composition, and authority must therefore be recorded separately rather than compressed into a single
"implemented" claim.

This phase builds an append-only derived evidence layer over the frozen ledger. It joins every canonical phase-013
adoption row, plus each merged recommendation that resolves into that adoption set, to verified runtime symbols,
composition roots, test evidence, and one scalar composition status. Every canonical row also inherits the shared
transition-authorization dependency `DLR-B-057` through the relation `inherited_phase_contract`. The source ledger
places that recommendation in phase 006 and describes it as the transition-authorized ledger core
(`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/recommendation-ledger.json:1807-1829`).

A separate consolidation alias manifest preserves resolvability of frozen pre-consolidation paths without editing
their historical bytes. This is necessary because frozen rows retain source paths such as the `.opencode/specs/...`
pointer at `recommendation-ledger.json:1807-1811`, while the execution contract declares `specs/` canonical and treats
`.opencode/specs` only as a topology alias (`specs/system-deep-loop/036-deep-loop-innovation/goal.md:142-153`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A machine-readable derived traceability artifact whose canonical adoption set is selected from the frozen ledger's
  `adopt-as-phase-013` rows and whose expected cardinality is checked against the delivered 72-row phase count.
- A merge-lineage closure that retains each merged recommendation as a distinct provenance record, resolves it to one
  canonical phase-013 adoption, and does not inflate the 72-row adoption denominator.
- For every selected adoption and merged-lineage record: `depends_on_recommendation`, `runtime_symbol`,
  `composition_root`, `test_evidence`, and one scalar `composition_status`.
- The inherited dependency pair `DLR-B-057` + `inherited_phase_contract`, recorded without reclassifying DLR-B-057 as
  a phase-013 adoption.
- A three-field status object with closed fields and values: `library` is `absent`, `present_unverified`, or
  `test_verified`; `shadow` is `not_wired` or `shadow_wired`; and `authority` is `legacy_authoritative` or `cut_over`.
- A deterministic derivation of `composition_status`: `cut_over` when authority is `cut_over`; `shadow_wired` when
  authority remains legacy and shadow is wired; otherwise `legacy_authoritative`. Shadow or authority advancement
  requires non-empty, verified symbol, composition-root, and test evidence.
- A consolidation alias manifest mapping each frozen stale pre-consolidation pointer to one current canonical path,
  with existence, uniqueness, and escape-boundary validation.
- Schemas and a deterministic validator that prove source selection, merge closure, field shape, status derivation,
  alias resolution, and byte preservation of the frozen ledger inputs.

### Out of Scope
- Editing `recommendation-ledger.json`, its CSV or schema projection, `recommendation-ledger-validation.json`, or the
  frozen research sources from which they were built.
- Implementing any of the 72 phase-013 recommendations, adding missing runtime symbols or tests, or treating an empty
  verified-reference list as evidence that implementation exists.
- Wiring a mode root for shadow execution, invoking the authority-flip coordinator against live state, changing an
  authority record, or performing a cutover.
- Repairing identity, lock, write-boundary, or cutover defects owned by successor phases.
- Guessing runtime symbols from recommendation prose. A reference enters the join only after the implementation pass
  confirms its exact current path, exported or local symbol, and test evidence.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The frozen ledger remains the read-only planning authority | The join records the source ledger and validation-report digests before generation, reads them without write access, and proves their bytes are unchanged after generation and validation |
| REQ-002 | The canonical adoption set contains exactly the phase-013 rows | Selection derives from `adopt-as-phase-013`; exactly 72 unique canonical recommendation IDs are present, and merged-lineage records resolve to those IDs without changing the denominator |
| REQ-003 | Every row carries the inherited transition contract | Each canonical adoption row contains `depends_on_recommendation` identifying `DLR-B-057` with relation `inherited_phase_contract`; validation rejects a missing, changed, or phase-013-reclassified dependency |
| REQ-004 | Runtime traceability is evidence-bound | `runtime_symbol`, `composition_root`, and `test_evidence` contain only file/symbol/test references confirmed against the current tree; absent evidence is represented explicitly and never replaced by an inferred symbol |
| REQ-005 | Status has three independent fields and one derived scalar | Every canonical adoption has exactly one valid `library`, `shadow`, and `authority` value and exactly one scalar `composition_status`; the derivation rules are deterministic and contradictory combinations fail validation |
| REQ-006 | Frozen pre-consolidation paths remain resolvable | Every stale frozen pointer in the selected source and evidence set appears exactly once in the alias manifest, maps inside the repository to one existing current path, and unresolved, duplicate, cyclic, or escaping aliases fail validation |
| REQ-007 | Validation is deterministic and machine-readable | Two builds over identical frozen inputs produce byte-identical traceability, schema, alias, and validation artifacts; positive verification exits zero and negative fixtures reject count, lineage, evidence, status, alias, and mutation defects |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The derived artifact contains exactly 72 unique canonical phase-013 adoption rows, while all merged rows
  in their merge closure remain traceable without being counted as additional adoptions.
- **SC-002**: Every canonical adoption records `DLR-B-057` as `inherited_phase_contract` and provides explicit runtime,
  composition, test, and status fields without invented symbols.
- **SC-003**: Each of the 72 canonical rows has one and only one `composition_status` value from
  `legacy_authoritative`, `shadow_wired`, or `cut_over`, and that value agrees with the three-field status object.
- **SC-004**: Every stale frozen pre-consolidation pointer discovered in the selected evidence resolves through exactly
  one alias to an existing current canonical path.
- **SC-005**: Before-and-after digests prove that the frozen 178-row ledger and its validation report were not mutated.
- **SC-006**: Deterministic rebuild, schema validation, status/lineage checks, alias resolution, and negative fixtures
  all pass with machine-readable results.

**Given** the immutable recommendation ledger and its validation report, **When** the traceability builder selects the
phase-013 adoption set, **Then** it emits 72 unique canonical rows and preserves merged recommendations as lineage.

**Given** a row with no confirmed implementation symbol or test, **When** the join is built, **Then** the reference
fields remain explicitly empty, `library` cannot be `test_verified`, and no inferred symbol is serialized.

**Given** a row whose authority remains legacy but whose composition root is proven shadow-wired, **When** status is
derived, **Then** its scalar status is `shadow_wired`; authority evidence is required before `cut_over` is permitted.

**Given** a frozen pointer that no longer names the canonical current location, **When** alias validation runs, **Then**
the pointer resolves uniquely inside the repository or the phase fails.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This phase has no predecessor dependency. It is the measurement baseline for successor
`002-substrate-identity-fail-closed` and for later pilot and fleet cutover reporting. Its read-only inputs are the
frozen recommendation ledger, validation report, current runtime tree, current tests, phase composition roots, and
canonical path topology. The confirmed ledger validation reports 178 source rows and a 72-row phase-013 adoption bucket
(`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/recommendation-ledger-validation.json:5-20`,
`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:125-135`).

The highest risk is status inflation: a library can exist without being composed, and a composed dark path can exist
without authority. The three-field schema, evidence requirements, and deterministic scalar derivation keep those facts
separate. A second risk is false traceability from recommendation prose that resembles a symbol name. Exact current
file and symbol confirmation is mandatory; unresolved rows remain explicit rather than guessed. A third risk is
silently "repairing" stale frozen paths in place. The alias manifest is additive, and before-and-after source digests
make any ledger mutation a hard failure.

Merged recommendations may form chains or target an adoption outside phase 013. The builder must follow the frozen
merge relation, reject cycles and missing targets, and include only lineage that resolves to the canonical phase-013
set. Consolidation can also create multiple plausible current paths; non-unique resolution blocks publication rather
than selecting one heuristically.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Exact runtime symbols, composition roots, and tests are execution-time discovery outputs
and must be confirmed against the current tree before serialization. The implementation may choose phase-local artifact
filenames and validator module structure, but it may not alter the frozen ledger, the 72-row denominator, the status
vocabularies, the inherited `DLR-B-057` relation, or fail-closed alias resolution.
<!-- /ANCHOR:questions -->
