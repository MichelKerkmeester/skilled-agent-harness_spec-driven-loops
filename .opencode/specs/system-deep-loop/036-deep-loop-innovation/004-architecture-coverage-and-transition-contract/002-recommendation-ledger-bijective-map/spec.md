---
title: "Feature Specification: Recommendation Ledger — Bijective Classified Map"
description: "Freeze the 178 deep-loop recommendations into one immutable classified ledger with stable IDs, normalized taxonomy targets, exactly one disposition per source recommendation, and machine-verifiable corpus and phase coverage."
trigger_phrases:
  - "recommendation ledger bijective map"
  - "178 recommendation classified ledger"
  - "deep-loop recommendation coverage"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
    last_updated_at: "2026-07-15T13:25:45Z"
    last_updated_by: "codex"
    recent_action: "Specified the 178-row ledger schema and bijective coverage contract"
    next_safe_action: "Extract the three source runs and construct the classified ledger"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Recommendation Ledger — Bijective Classified Map

> Child adjacency under the 001 parent (grouping order, not a dependency): predecessor `001-spine-architecture-adr`; successor `003-transition-versioning-and-rollback-policy`; `depends_on: []`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Child 002 of the phase-004 architecture, coverage, and transition planning gate |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The [006 parent program](../../spec.md) promises auditable coverage of 178 recommendations, and
[`manifest/phase-tree.json`](../../manifest/phase-tree.json) fixes the corpus arithmetic at 8 run-a + 59 run-b + 111
run-c. That promise is not yet provable. The source records have no durable recommendation IDs; their target strings
mix modes, runtime subsystems, file names, and multi-target prose; and no record carries exactly one program
disposition. Downstream phases therefore cannot cite a recommendation without relying on a mutable array position or
prove that a recommendation was adopted, merged, deferred, or rejected exactly once.

The source shapes also differ. Run-a's eight ranked recommendations are enumerated in
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research/research/research.md` §17 and
are backed by that packet's `research/findings-registry.json`; the registry itself has no `recommendations` array.
Run-b and run-c expose 59 and 111 records in
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/findings-registry.json`
and `research/findings-registry-modes.json`. This phase defines a source-specific extraction contract, freezes the
source digests and ordinals, mints immutable `DLR-A/B/C-NNN` IDs once, normalizes each primary target against the
phase-003 5-family / 7-workflowMode / 8-workstream and eight-subsystem taxonomy, and assigns one disposition from the
closed disposition vocabulary.

The literal 178-row ledger is an execution artifact, not prose in this document. The canonical JSON ledger, a
deterministic CSV review projection, and a machine-readable validation report will live in this phase folder. Their
validator proves source-to-row bijection, unique stable IDs, one disposition per row, explicit disposition-bucket
counts, referential integrity, and complete enumeration of the program phases in the coverage summary.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Freeze the three corpus inputs by repo-relative path, digest, extraction rule, and source ordinal: run-a ranks 1-8, run-b JSON pointers `/recommendations/0..58`, and run-c pointers `/recommendations/0..110`.
- Emit exactly one canonical row per source recommendation with immutable ID ranges `DLR-A-001..008`, `DLR-B-001..059`, and `DLR-C-001..111`; IDs are never recomputed from recommendation text or reassigned after publication.
- Preserve source provenance per row: run, source path, source locator, source digest, original recommendation text, original target text, iteration/rank, and available evidence fields.
- Normalize one primary target per row as a `taxonomy_layer` + `taxonomy_key` pair drawn from phase 003's runtime-subsystem, workflow-family, workflow-mode, or research-workstream vocabulary; preserve compound raw targets without pretending they were singular.
- Assign exactly one disposition string per row: `adopt-as-phase-NNN`, `merge-into-<id>`, `defer-with-reason`, or `reject-with-reason`. Merge, defer, and reject rows require a non-empty rationale.
- Validate every adoption phase against the manifest's real `003..017` phase IDs; validate merge targets as existing, non-self stable IDs with no cycles.
- Publish a coverage summary that names all four disposition buckets and all manifest phases, including explicit zero counts and reasons rather than omitted or silently empty buckets.
- Produce phase-local artifacts such as `recommendation-ledger.json`, `recommendation-ledger.csv`, `recommendation-ledger.schema.json`, and `recommendation-ledger-validation.json`, plus a deterministic validator owned by this phase.

### Out of Scope
- Hand-writing or embedding the 178 ledger rows in `spec.md`, `plan.md`, `tasks.md`, or `checklist.md`.
- Rewriting either research packet or mutating any `findings-registry*.json` source.
- Implementing the recommendations, ratifying the spine ADR, or defining transition/versioning/rollback policy; sibling 001 and 003 and program phases 002-014 own those outcomes.
- Changing the phase-003 taxonomy or the phase-tree manifest. Drift in either input invalidates the ledger build and requires an explicit reclassification pass rather than silent normalization.
- Adding `ai-system-improvement`, speculative recommendations, or an `unknown` target/disposition bucket.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The source corpus is frozen and totals 178 | Source adapters extract 8, 59, and 111 records; their disjoint union is exactly 178 and every source digest is recorded |
| REQ-002 | Every recommendation receives one immutable stable ID | The three reserved ID ranges contain 178 unique IDs with no gaps, duplicates, reuse, or content-derived reminting |
| REQ-003 | Every row remains traceable to exactly one source record | Each row has one unique source run + locator and preserves the raw recommendation and raw target; every extracted source locator appears once |
| REQ-004 | Targets use the phase-003 taxonomy | Every row has one allowed `taxonomy_layer` and canonical `taxonomy_key`; compound source targets remain in provenance and no `unknown` key exists |
| REQ-005 | Every row has exactly one closed-vocabulary disposition | One and only one `disposition` value matches the four allowed forms; no parallel disposition flags or unclassified rows exist |
| REQ-006 | Non-adoption dispositions are justified and referentially sound | Merge/defer/reject rows have non-empty reasons; merge targets exist, are non-self, and resolve without cycles |
| REQ-007 | Adoption targets are real program phases | Every `adopt-as-phase-NNN` value names a phase present in `manifest/phase-tree.json`; no free-text or non-manifest phase is accepted |
| REQ-008 | Disposition coverage is explicit | The validation report includes all four bucket keys, their row IDs and counts; a zero-count bucket is present with an explicit rationale |
| REQ-009 | Phase coverage is complete and auditable | The coverage report enumerates every manifest phase `003..017` with adopted-row IDs and counts; zero-adoption phases are explicit and reasoned |
| REQ-010 | Canonical and review artifacts cannot drift | JSON validates against the schema, CSV is a deterministic projection of the same 178 IDs, and the validator exits non-zero on any corpus, bijection, disposition, reference, or phase-coverage violation |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The canonical ledger has exactly 178 rows split 8/59/111, with 178 unique stable IDs and 178 unique source locators.
- **SC-002**: Every row has one normalized target and exactly one disposition; no `unknown`, missing, or multi-disposition row exists.
- **SC-003**: Every adoption resolves to a real phase, every merge resolves to a real non-self ID without cycles, and every required reason is non-empty.
- **SC-004**: All four disposition buckets and all 15 implementation phases (`003..017`) appear in the validation report, including explicit reasoned zero counts.
- **SC-005**: The canonical JSON, CSV projection, schema, and validation report reproduce deterministically from the frozen source digests and pass the phase-local validator.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The governing sources are the [006 parent spec](../../spec.md),
[`manifest/phase-tree.json`](../../manifest/phase-tree.json), the phase-003 taxonomy contract in
`../../003-baseline-taxonomy-and-state-census/spec.md`, the run-a packet's `research/findings-registry.json` plus
ranked §17 list, and the run-b/run-c registries in the 005 packet. The child has `depends_on: []`; the 001 parent
inherits the program dependency on phase 003, while this child consumes the frozen taxonomy as a read-only input.

The main risks are source-shape mismatch in run-a, source-order drift after IDs are minted, inconsistent free-text
target delimiters, accidental loss of secondary targets during primary normalization, classification bias, merge
cycles, and phase-tree drift after adoption assignments. Mitigations are separate extraction adapters, frozen digests
and locators, immutable ID assignments, raw-field preservation, closed taxonomy enums, explicit reviewer rationale,
cycle detection, and fail-closed manifest reconciliation. Four run-c records currently have an empty optional
`uniqueness` field; extraction must preserve that fact without treating optional source metadata as a missing
recommendation.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The canonical form is JSON with a deterministic CSV projection; run-a uses its ranked §17 list as the
recommendation source and its findings registry as companion evidence; zero-count disposition or phase buckets are
allowed only when explicitly present with a rationale. Any taxonomy or manifest drift stops regeneration and requires
an reviewed ledger revision that preserves all previously published IDs.
<!-- /ANCHOR:questions -->
