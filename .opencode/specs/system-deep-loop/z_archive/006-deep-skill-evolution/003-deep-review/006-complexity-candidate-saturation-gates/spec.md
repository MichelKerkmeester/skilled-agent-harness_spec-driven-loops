---
title: "Feature Specification: 116/006 - Candidate Saturation and Graphless Gates"
description: "Level 3 Phase F spec for named deep-review legal-stop gates that block STOP when reducer-owned candidate coverage or graphless fallback evidence is unresolved."
trigger_phrases:
  - "candidate coverage gate"
  - "graphless fallback gate"
  - "review STOP blocked"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/003-deep-review/006-complexity-candidate-saturation-gates"
    last_updated_at: "2026-05-22T12:09:15Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 3 Phase F spec for candidate and graphless legal-stop gates."
    next_safe_action: "Validate YAML gate semantics and strict spec docs."
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - "decision-record.md"
---

# Feature Specification: 116/006 - Candidate Saturation and Graphless Gates

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase F adds two named review legal-stop gates to the deep-review command workflows: `candidateCoverageGate` and `graphlessFallbackGate`. The gates consume reducer-owned Phase E state and prevent a standard or complex v2 review from claiming STOP while search debt remains, required bug classes are uncovered, or graphless mode lacks cited fallback ledger proof.

**Key Decision**: ADR-001 accepts named legal-stop gates instead of extending claim adjudication, hard-failing in the validator, or relying on dashboard-only visibility.

**Critical Dependencies**: Phase 003 schema/prompt contract, Phase 004 validator warnings, Phase 005 reducer registry fields, and the existing coverage-graph handler's graph-empty `CONTINUE` behavior.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 8 |
| **Predecessor** | `../005-search-ledger-persistence-and-reporting/spec.md` |
| **Successor** | `../007-ledger-led-graph-vocabulary/spec.md` |
| **Estimated LOC** | ~90 YAML + Level 3 docs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Before this phase, deep-review could make dimension coverage, evidence density, and graph convergence look complete while still leaving v2 candidate-search obligations unresolved. Phase E made `candidateCoverage`, `searchDebt`, and `searchCoverage` durable, but STOP legality did not yet read those fields.

Graphless runs had a second gap: the coverage-graph handler correctly returns `CONTINUE` for empty graphs, but the workflow layer lacked an explicit legal-stop fallback proof requirement for `graphless_fallback` and `unavailable_blocked` modes.

### Purpose

Make absence-of-finding STOP claims auditable. A standard or complex v2 review can stop only when reducer-owned search debt is clear, required bug classes are covered, and graphless fallback mode cites direct ledger evidence for every required class.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `candidateCoverageGate` to the review legal-stop decision tree in auto and confirm YAML.
- Add `graphlessFallbackGate` to the same decision tree.
- Include both gates in `blockedBy`, `gateResults`, and recovery strategy text for blocked-stop events.
- Keep v1 legacy records exempt when `reviewDepthSchemaVersion` is not `2`.
- Preserve the graph-empty handler behavior; graphless fallback is workflow-level policy.
- Populate the Phase 006 packet to Level 3 with ADR-001.

### Out of Scope

- Coverage graph node vocabulary and database/upsert changes; those belong to Phase G.
- `coverage-graph/convergence.ts` changes; graph-empty `CONTINUE` stays as-is.
- Reducer registry shape changes; Phase E already shipped `candidateCoverage`, `searchDebt`, and `searchCoverage`.
- Validator changes; Phase D owns validator semantics.
- Iteration-default changes; Phase H owns default tuning and runner integration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Add candidate and graphless legal-stop gates plus blocked-stop payload fields. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Mirror auto workflow legal-stop semantics. |
| `.opencode/specs/.../006-candidate-saturation-and-graphless-gates/*` | Modify/Create | Populate Level 3 docs, checklist, ADR, summary, and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add `candidateCoverageGate`. | STOP is blocked for v2 non-trivial reviews when reducer `searchDebt` is non-empty or `candidateCoverage.covered` does not cover `searchCoverage.requiredBugClasses`. |
| REQ-002 | Add `graphlessFallbackGate`. | STOP is blocked for `graphless_fallback` without cited fallback ledger rows per required class, and always blocked for `unavailable_blocked`. |
| REQ-003 | Preserve legacy compatibility. | Latest records without `reviewDepthSchemaVersion: 2` skip both new gates. |
| REQ-004 | Mirror auto/confirm semantics. | Auto and confirm YAML contain the same gate names, pass rules, recovery text, and blocked-stop outputs. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Emit named blockers. | `blocked_stop.blockedBy` can include `candidateCoverageGate` and `graphlessFallbackGate`. |
| REQ-006 | Preserve event schema. | The existing blocked-stop shape stays array/object based; new fields extend `gateResults` without renaming old keys. |
| REQ-007 | Keep Phase G/H boundaries. | No graph vocabulary, handler, reducer, validator, or iteration-default changes are made in this phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `candidateCoverageGate` and `graphlessFallbackGate` are present in both YAML workflows.
- The blocked-stop event includes both gates under `blockedBy` and `gateResults`.
- Trivial `scopeClass: "trivial"` plus `enforcement: "skip"` remains a valid cited exemption.
- `graphless_fallback` requires cited `searchLedger` evidence; `unavailable_blocked` fails closed.
- Phase B validator/reducer fixtures stay green; graph vocabulary fixture stays at Phase B state.
- Strict validation passes for this Level 3 spec folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 reducer fields | Gates need durable `searchDebt`, `candidateCoverage`, and `searchCoverage`. | Limit this phase to YAML consumption of those fields. |
| Risk | Workflow prose outruns executable runner support | YAML contract may not be exercised by handler-level unit tests. | Document runner limitation and keep handler unchanged. |
| Risk | Over-blocking trivial changes | Small review targets could be forced into ledger ceremony. | Exempt v2 trivial+skip only with non-empty evidence refs. |
| Risk | Graph outages block review indefinitely | Graphless fallback can pass with direct read/search/trace evidence. | Require fallback ledger evidence instead of graph data. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Backward compatibility | v1/legacy records skip new gates. |
| NFR-002 | Mirror consistency | Auto and confirm YAML remain semantically equivalent. |
| NFR-003 | Schema stability | No existing blocked-stop keys are renamed or removed. |
| NFR-004 | Phase isolation | No changes to graph DB, graph upsert, convergence handler, reducer, validator, or tests unless the fixture cannot consume YAML. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Legacy v1 latest iteration**: both new gates skip so older packets stay readable.
- **Trivial v2 target**: `scopeClass: "trivial"` with `enforcement: "skip"` passes only when `reviewDepthApplicability.evidenceRefs` is non-empty.
- **Deferred required class**: `searchDebt` blocks STOP and is recorded as candidate gate evidence.
- **Graph mode**: `graphCoverageMode: "graph"` skips the graphless fallback gate because handler graph convergence owns that path.
- **Unavailable blocked mode**: `graphCoverageMode: "unavailable_blocked"` fails the graphless gate with an explicit unavailability reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Two YAML mirrors plus Level 3 docs. |
| Risk | 18/25 | STOP legality changes can alter review termination behavior. |
| Research | 16/20 | Implements Phase 001 R6/R7 and Phase 014 graphless fallback refinement. |
| Multi-Agent | 8/15 | Workflow instructions affect dispatched review agents and operator cadence. |
| Coordination | 15/15 | Depends on Phases B-E and deliberately avoids Phases G/H. |
| **Total** | **69/100** | **Level 3 warranted because legal-stop semantics affect correctness and require ADR traceability.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | STOP becomes blocked for valid trivial reviews | M | L | Explicit trivial+skip evidence exemption. |
| R-002 | Handler-level tests do not observe YAML policy | M | M | Document runner integration boundary; keep Phase H scoped. |
| R-003 | Gate names drift between auto and confirm | H | L | Patch both mirrors and grep for parity. |
| R-004 | `unavailable_blocked` treated as passable fallback | H | L | Gate text says fail automatically with reason. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator Sees Search Debt Block STOP

**As a** deep-review operator, **I want** STOP to be blocked when candidate search debt remains, **so that** a no-finding review cannot pass while required bug classes are deferred or blocked.

### US-002: Graphless Review Has Equal Evidence Burden

**As a** reviewer running without graph data, **I want** fallback ledger rows to prove direct reads, exact searches, traces, or negative-test inspection, **so that** graphless mode is auditable rather than a waiver.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance -->
## 12. ACCEPTANCE CHECKS

| Check | Evidence |
|-------|----------|
| Phase B convergence fixture | `pnpm vitest run --no-coverage review-depth-convergence` |
| Phase B validator/reducer/graph fixtures | `pnpm vitest run --no-coverage review-depth-validator review-depth-reducer review-depth-graph` |
| Existing coverage graph tests | `pnpm vitest run --no-coverage coverage-graph` |
| Spec validation | `validate.sh .../006-candidate-saturation-and-graphless-gates --strict` |
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research synthesis**: `../001-research-synthesis/research/research.md`
- **Seeded fixture harness**: `../002-seeded-fixture-harness/`
- **Schema and prompt contract**: `../003-review-depth-schema-and-prompt-contract/`
- **Validator enforcement**: `../004-validator-v2-enforcement/`
- **Reducer persistence and reporting**: `../005-search-ledger-persistence-and-reporting/`
- **Decision record**: `decision-record.md`
