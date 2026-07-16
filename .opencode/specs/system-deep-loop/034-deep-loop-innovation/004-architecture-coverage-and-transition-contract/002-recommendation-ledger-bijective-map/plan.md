---
title: "Implementation Plan: Recommendation Ledger — Bijective Classified Map"
description: "Construct and verify the frozen 178-row recommendation ledger from three research runs, preserving source provenance while normalizing targets and enforcing one auditable disposition per recommendation."
trigger_phrases:
  - "recommendation ledger implementation plan"
  - "178 row ledger construction"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map"
    last_updated_at: "2026-07-15T13:25:45Z"
    last_updated_by: "codex"
    recent_action: "Planned source extraction, classification, artifact emission, and validation"
    next_safe_action: "Freeze source digests and extract the 8, 59, and 111 recommendation sets"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Recommendation Ledger — Bijective Classified Map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop 006 / phase 004 / child 002 |
| **Change class** | Phase-local data contract, classified ledger, projection, and verifier |
| **Execution** | Deterministic extraction and review against frozen source digests; `depends_on: []` |

### Overview
Build one canonical ledger from three source adapters rather than treating unlike research outputs as one implicit
array. Run-a yields eight ranked entries from the 001 research synthesis with its registry attached as evidence;
run-b and run-c yield 59 and 111 JSON recommendation records. Freeze source hashes and locators, assign the reserved
`DLR-A/B/C-NNN` ranges once, preserve raw provenance, normalize a single primary target against the phase-003
taxonomy, classify one disposition per row, then emit JSON + deterministic CSV and a validation report. The validator
must prove 178-row source bijection, stable-ID uniqueness, closed dispositions, referential integrity, and explicit
coverage of every disposition bucket and manifest phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 006 parent spec, phase-tree manifest, phase-003 taxonomy, and all three source-run inputs are pinned by path and digest
- [ ] Source adapters define run-a rank locators and run-b/run-c JSON-pointer locators without mutating the research packets
- [ ] The stable-ID ranges, normalized-target enum, disposition grammar, and phase manifest enum are frozen before classification
- [ ] Reviewers agree that raw compound targets remain preserved while one primary normalized target drives ownership

### Definition of Done
- [ ] Canonical JSON contains exactly 178 rows with 8/59/111 source counts, unique stable IDs, and unique source locators
- [ ] Every row has one allowed normalized target and exactly one allowed disposition with required reasons and valid references
- [ ] All four disposition buckets and all manifest phases are explicitly represented in the coverage report
- [ ] JSON schema, CSV parity, source-digest reproduction, and the fail-closed validator are green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Source manifest**: records each input path, SHA-256 digest, extraction adapter, expected count, and locator scheme. Digest or count drift stops the build.
- **Extraction adapters**: run-a maps ranked §17 entries 1-8 and attaches the 001 registry as companion provenance; run-b and run-c map JSON recommendation arrays at frozen zero-based pointers.
- **Stable identity**: assign `DLR-A-001..008`, `DLR-B-001..059`, and `DLR-C-001..111` from the frozen source locators. IDs are stored, never recalculated from text, and never reused.
- **Row contract**: retain source run/path/locator/digest, raw recommendation, raw target, rank or iteration, and available rationale/evidence fields; optional missing metadata remains explicit.
- **Normalized target**: store exactly one `taxonomy_layer` + `taxonomy_key` primary pair from the phase-003 eight subsystems or 5/7/8 mode taxonomy. Preserve the raw compound target for audit and optional secondary-target review.
- **Disposition contract**: one scalar value matching `adopt-as-phase-NNN`, `merge-into-<id>`, `defer-with-reason`, or `reject-with-reason`; merge/defer/reject require a rationale and merge edges must be acyclic.
- **Artifacts**: `recommendation-ledger.json` is canonical; `recommendation-ledger.csv` is a deterministic review projection; `recommendation-ledger.schema.json` constrains structure; `recommendation-ledger-validation.json` records counts, IDs, buckets, phases, hashes, and verdict.
- **Verifier**: recomputes source extraction, schema validity, bijection, ID ranges, disposition cardinality, reason requirements, merge integrity, manifest phase validity, bucket enumeration, phase enumeration, and CSV parity; any mismatch exits non-zero.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the source paths and SHA-256 digests; confirm extraction counts 8, 59, and 111 and total 178.
- Freeze the run-specific locator schemes, stable-ID ranges, phase-003 taxonomy enum, and manifest phase IDs `000..014`.
- Record the run-a source-shape exception and verify its eight ranked entries against the 001 research synthesis.

### Phase 2: Implementation
- Define the canonical schema and source manifest, then extract the three source sets without altering raw inputs.
- Mint and persist stable IDs; copy raw provenance; normalize one primary target per row with reviewer rationale for ambiguous compound targets.
- Assign exactly one disposition per row, validate reasons and merge targets, and generate the all-bucket/all-phase coverage matrices.
- Emit the canonical JSON, deterministic CSV projection, schema, validator, and machine-readable validation report inside this phase folder.

### Phase 3: Verification
- Re-extract from frozen inputs and prove exactly 178 source locators map one-to-one onto 178 ledger rows and 178 unique stable IDs.
- Prove each row has one normalized target and one disposition; reject unknowns, multiple flags, missing reasons, invalid phases, self-merges, missing merge targets, and cycles.
- Prove all four disposition buckets and all 15 manifest phases appear explicitly, with reasoned zero counts where applicable.
- Rebuild the CSV and validation report twice and compare hashes; run this packet's strict spec-kit validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Source-manifest test asserts digests and exact `8 + 59 + 111 = 178` extraction counts |
| REQ-002 | ID-range test asserts 178 unique, gap-free IDs and rejects reminting or reuse |
| REQ-003 | Bijection test compares the extracted source-locator set to the ledger source-locator set in both directions |
| REQ-004 | Taxonomy test rejects any layer/key outside the frozen phase-003 enum and rejects `unknown` |
| REQ-005 | Schema and semantic tests require one scalar disposition matching exactly one allowed form |
| REQ-006 | Reason/reference tests reject blank rationales, missing/self merge targets, and merge cycles |
| REQ-007 | Adoption test derives allowed `NNN` values from `manifest/phase-tree.json` and rejects non-manifest phases |
| REQ-008 | Bucket-coverage test requires all four bucket keys, counts, row-ID lists, and reasons for zero counts |
| REQ-009 | Phase-coverage test requires every manifest phase `000..014`, adopted-row IDs, counts, and reasons for zero-adoption phases |
| REQ-010 | JSON-schema validation, regenerated CSV equality, repeated-build hash parity, and non-zero negative fixtures prove fail-closed behavior |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The child dependency list is empty. Inputs are the 006 parent `spec.md`, `manifest/phase-tree.json`, phase 003's frozen
taxonomy contract, the 001 research packet's ranked §17 recommendations and companion `findings-registry.json`, and
the 005 packet's run-b `findings-registry.json` plus run-c `findings-registry-modes.json`. The parent phase-004 gate
coordinates this output with sibling 001's architecture ADR and sibling 003's transition policy; neither sibling is a
construction dependency, but all three must be frozen before program phase 006 may build a writer.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All implementation artifacts are phase-local and source registries remain read-only. Revert the phase commit or remove
the generated ledger/schema/CSV/report/validator set to return to the pre-ledger state. Once stable IDs have been
published downstream, rollback may remove an invalid artifact version but must not reissue or renumber those IDs;
repair uses a new ledger revision with preserved identity and an explicit supersession record.
<!-- /ANCHOR:rollback -->
