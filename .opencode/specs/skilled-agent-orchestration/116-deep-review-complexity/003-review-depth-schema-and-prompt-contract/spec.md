---
title: "Feature Specification: 116/003 - Review-Depth Schema and Prompt Contract"
description: "Level 3 contract phase defining reviewDepthSchemaVersion v2, applicability-driven enforcement, target selection, search coverage, and searchLedger prompt obligations."
trigger_phrases:
  - "review depth schema"
  - "review depth prompt contract"
  - "searchLedger contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 3 phase 003 contract docs."
    next_safe_action: "Use this contract in phase 004 validator v2 enforcement."
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/references/state_format.md"
      - ".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl"
      - "../002-seeded-fixture-harness/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1160033000000000000000000000000000000000000000000000000000000000"
      session_id: "116-003-review-depth-schema"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 003 owns the documentation and prompt contract only; validator, reducer, gates, and graph vocabulary remain later phases."
---

# Feature Specification: 116/003 - Review-Depth Schema and Prompt Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 003 defines the canonical v2 review-depth contract for `deep-review` iteration records and the rendered prompt pack. The contract adds the discriminator `reviewDepthSchemaVersion: 2`, applicability-driven enforcement through `reviewDepthApplicability`, explicit target proof through `targetSelection`, coverage accounting through `searchCoverage`, and auditable search rows through `searchLedger[]`.

**Key Decision**: ADR-001 accepts versioned v2 records with applicability-driven enforcement rather than an unversioned additive shape.

**Critical Dependency**: Phase 002 seeded fixtures already encode the frozen contract names used by later validator, reducer, convergence, and graph phases.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 8 |
| **Predecessor** | `../002-seeded-fixture-harness/spec.md` |
| **Successor** | `../004-validator-v2-enforcement/spec.md` |
| **Handoff Criteria** | State docs and prompt pack define v2 fields without changing validator, reducer, gate, or graph runtime behavior. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`deep-review` records findings and graph events, but it has no versioned way to prove target selection, bug-class search coverage, ruled-out candidates, or remaining search debt before a no-finding or low-finding review counts as deep enough.

### Purpose

Provide the live reference contract for the Phase B fixtures and for Phases D-G. After this phase, all later work can target the same field names, compatibility rules, and prompt obligations instead of reinterpreting the research synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Document `reviewDepthSchemaVersion: 2` as the discriminator for v2 review-depth records.
- Document `reviewDepthApplicability` with `scopeClass`, `enforcement`, `reason`, and `evidenceRefs`.
- Document `targetSelection` with selected targets, discovery methods, omitted high-risk targets, graph status, semantic search status, and evidence.
- Document `searchCoverage` with required, covered, ruled-out, deferred, blocked classes and `graphCoverageMode`.
- Document `searchLedger[]` row fields, required/conditional shape, and disposition-specific links.
- Update the iteration prompt pack so standard and complex scopes are asked to emit the v2 fields.
- Preserve legacy v1 readability by making v2 enforcement discriminator-driven.

### Out of Scope

- Changing `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`.
- Changing `.opencode/skills/deep-review/scripts/reduce-state.cjs`.
- Changing `/spec_kit:deep-review` YAML gates.
- Changing coverage graph DB or handler vocabulary.
- Editing Phase B review-depth fixture files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/references/state_format.md` | Modify | Add the v2 review-depth state contract. |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | Add v2 search-depth output obligations. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract/` | Modify/Create | Populate Level 3 spec packet and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the v2 discriminator. | `state_format.md` states that `reviewDepthSchemaVersion: 2` enables v2 behavior and absent/other values remain legacy v1. |
| REQ-002 | Define applicability-driven enforcement. | `reviewDepthApplicability` includes `scopeClass: 'trivial'\|'standard'\|'complex'`, `enforcement: 'strict'\|'warn'\|'skip'`, `reason`, and `evidenceRefs`. |
| REQ-003 | Define target-selection proof. | `targetSelection` includes `selectedTargets`, `selectionReason`, `discoveryMethods`, `omittedHighRiskTargets`, `graphStatus`, `semanticSearchStatus`, and `evidenceRefs`. |
| REQ-004 | Define search coverage accounting. | `searchCoverage` includes all required bug-class arrays and `graphCoverageMode: 'graph'\|'graphless_fallback'\|'unavailable_blocked'`. |
| REQ-005 | Define ledger row semantics. | `searchLedger[]` documents required fields, hypothesis/invariant requirement, search actions, and exactly-one disposition link. |
| REQ-006 | Preserve trivial-scope exemption. | Docs and prompt say `scopeClass: 'trivial'` plus `enforcement: 'skip'` may use `searchLedger: []` with cited scope proof. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Add compatibility guidance. | A table explains v1 parse behavior, v2 enforcement, and warning-only legacy rollout. |
| REQ-008 | Cross-reference downstream reducer/report fields. | Docs name `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage` as Phase E deliverables. |
| REQ-009 | Keep prompt template variables intact. | Required validation renders the production prompt pack without unresolved-template regressions. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `state_format.md` contains a 60-120 line `## Review Depth Schema (v2)` section with tables and a JSON example.
- `prompt_pack_iteration.md.tmpl` tells standard/complex review agents to emit `reviewDepthSchemaVersion: 2`.
- The prompt contract includes `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, `searchLedger[]`, `bugClass`, `invariant`, `evidenceRefs`, and `linkedFindingId`.
- Legacy unversioned records remain valid, with strict validator behavior deferred to Phase D.
- `pnpm vitest run --no-coverage prompt-pack` remains green.
- Strict spec validation exits 0 with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 fixtures | Later phases depend on frozen names | Read fixture helper names and preserve the exact field vocabulary. |
| Risk | Schema becomes checkbox output | Agents may emit ledger rows without real search proof | Require evidence refs, search actions, disposition links, and coverage reconciliation. |
| Risk | Legacy packet breakage | Historical review JSONL lacks v2 fields | Gate strict behavior on `reviewDepthSchemaVersion: 2`. |
| Risk | Graph unavailable false blocks | Reviews without graph support could fail despite direct proof | Include `graphless_fallback` as a first-class coverage mode. |
| Risk | Prompt bloat | LEAF agent has tight tool-call budget | Add compact contract text and point field detail to `state_format.md`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-M01 | Contract readability | Field names are grouped by top-level object and ledger row shape. |
| NFR-M02 | Compatibility clarity | v1/v2 behavior is explicit enough for Phase D validator implementation. |
| NFR-M03 | Phase discipline | No production behavior changes land before validator/reducer/gate phases. |
| NFR-V01 | Verification repeatability | Required commands can be rerun from repo root without extra setup. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **Legacy records**: Records without `reviewDepthSchemaVersion: 2` remain v1 and do not need v2 objects.
- **Trivial records**: `scopeClass: 'trivial'` plus `enforcement: 'skip'` may use `searchLedger: []` only with cited scope proof.
- **Graphless records**: Standard/complex records may use `graphCoverageMode: 'graphless_fallback'` when direct reads and searches provide equivalent proof.

### Error Scenarios

- **Missing v2 object**: Phase D validator should fail explicit standard/complex v2 records.
- **Broken finding link**: A `finding` ledger disposition must reference an id in `findingDetails[]`.
- **Uncited ledger row**: Search actions without `evidenceRefs` are invalid in strict v2 mode.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Two shared deep-review docs plus Level 3 packet docs. |
| Risk | 15/25 | Versioned schema affects future validator, reducer, gates, and graph phases. |
| Research | 16/20 | Phase 001 research and Phase 002 fixtures drive the contract. |
| Multi-Agent | 3/15 | Single-agent implementation; later review executors consume the prompt. |
| Coordination | 14/15 | Eight-phase dependency chain with strict phase boundaries. |
| **Total** | **60/100** | **Level 3 warranted by versioned schema and ADR.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Contract names drift from Phase B fixtures | H | L | Use exact frozen names from `review-depth-validator.vitest.ts`. |
| R-002 | Agents over-produce ledger boilerplate | M | M | Tie rows to selected targets, evidence refs, and disposition-specific reasons. |
| R-003 | Validator phase misreads legacy behavior | H | L | Compatibility table states legacy records parse and v2 strictness requires discriminator. |
| R-004 | Downstream reducer obligations get lost | M | M | Cross-reference Phase E registry/report fields in state docs. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Validator Implements the Same Contract (Priority: P0)

**As a** Phase D implementer, **I want** a canonical v2 schema reference, **so that** validator enforcement matches Phase B fixtures.

**Acceptance Criteria**:
1. **Given** `reviewDepthSchemaVersion: 2`, **When** Phase D validates standard/complex records, **Then** it enforces all v2 top-level objects and ledger row links.

### US-002: Review Agent Emits Search Proof (Priority: P0)

**As a** deep-review iteration agent, **I want** prompt-pack instructions for target selection and search ledgers, **so that** no-finding records can prove what was searched.

**Acceptance Criteria**:
1. **Given** standard or complex scope, **When** the prompt renders, **Then** it asks for `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger[]`.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance -->
## 12. ACCEPTANCE CHECKS

| Check | Evidence |
|-------|----------|
| State contract documented | `state_format.md` includes v2 discriminator, applicability, target selection, search coverage, ledger row matrix, compatibility, and downstream obligations. |
| Prompt contract documented | `prompt_pack_iteration.md.tmpl` includes the v2 output subsection after the existing JSONL schema block. |
| Metadata refreshed | `generate-context.js --json ...` refreshes `description.json` and `graph-metadata.json`. |
| Spec packet Level 3 | `checklist.md` and `decision-record.md` exist and validate. |
| Verification complete | Prompt-pack Vitest and strict spec validation pass. |
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: `../spec.md`
- **Research synthesis**: `../001-research-synthesis/research/research.md`
- **Seeded fixture summary**: `../002-seeded-fixture-harness/implementation-summary.md`
- **Implementation plan**: `plan.md`
- **Decision record**: `decision-record.md`
