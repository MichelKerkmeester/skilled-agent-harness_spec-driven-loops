---
title: "Feature Specification: 116/005 — Search Ledger Persistence and Reporting"
description: "Level 3 reducer/dashboard/report phase for persisted search ledger state and search debt visibility."
trigger_phrases:
  - "search ledger persistence"
  - "reducer registry v2"
  - "search debt dashboard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/005-complexity-search-ledger-persistence"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented reducer search ledger persistence and reporting surface."
    next_safe_action: "Run final validation and use bundled commit handoff."
---
# Feature Specification: 116/005 — Search Ledger Persistence and Reporting

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 005 makes Phase D validator output survivable and visible. The reducer registry now carries `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`; the dashboard shows search debt before active risks; and review-report compiler instructions include an always-visible Search Ledger section before the audit appendix.

**Key Decision**: ADR-001 accepts extending the reducer-owned registry shape instead of report-only enrichment, a sidecar registry, or collapsing search proof into findings.

**Critical Dependencies**: Phase 004 validator warnings and v2 checks, Phase 003 schema contract, and Phase 006 convergence gates.
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
| **Phase** | 5 of 8 |
| **Predecessor** | `../004-validator-v2-enforcement/spec.md` |
| **Successor** | `../006-candidate-saturation-and-graphless-gates/spec.md` |
| **Estimated LOC** | ~220 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Valid v2 ledger rows are not useful if the reducer drops them. Before this phase, the registry and dashboard were severity/finding-centric, so deferred bug classes, blocked search obligations, and clean-search proof could disappear from operator view.

### Purpose
Persist search-coverage state in the reducer and surface it in dashboard/report outputs so no-finding claims become auditable and remaining search debt cannot hide behind a PASS verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend reducer registry shape with candidate/search state.
- Aggregate v2 `searchLedger[]` and `searchCoverage` from iteration records.
- Downgrade PASS to CONDITIONAL when search debt exists.
- Render dashboard Search Debt section before Active Risks.
- Update auto and confirm report compiler instructions with Search Ledger section.

### Out of Scope
- STOP-gate candidate saturation, owned by Phase 006.
- Graph vocabulary/upsert, owned by Phase 007.
- Coverage graph database writes, explicitly forbidden in this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modify | Aggregate and render search ledger state. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Add Search Ledger report section instructions. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Mirror auto report instructions. |
| `.opencode/specs/.../005-search-ledger-persistence-and-reporting/*` | Modify/Create | Populate Level 3 documentation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Persist candidate coverage. | Registry includes `candidateCoverage.covered`, `ruledOut`, `deferred`, `blocked`, and `byBugClass`. |
| REQ-002 | Persist search debt. | Deferred and blocked ledger rows become `searchDebt[]` with iteration/evidence refs. |
| REQ-003 | Preserve clean proof. | Ruled-out and not-applicable rows become visible `cleanSearchProof[]`; ruled-out rows also populate `ruledOutCandidates[]`. |
| REQ-004 | Carry search coverage aggregate. | Registry includes last-iteration `searchCoverage` passthrough. |
| REQ-005 | Adjust dashboard verdict. | Search debt downgrades PASS to CONDITIONAL while P0 FAIL behavior remains unchanged. |
| REQ-006 | Render report section. | YAML instructions require Search Ledger before Audit Appendix, even for legacy empty state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Phase B reducer fixture sees all new registry fields.
- Dashboard includes `hasSearchDebt` and a Search Debt section.
- Report compiler instructions name all new reducer fields.
- Strict spec validation passes for this Level 3 folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 validator behavior | Reducer assumes v2 records are parseable. | Bundle D+E so contract continuity is local. |
| Risk | Search debt over-blocks PASS | Search debt is not the same as active P0. | Downgrade to CONDITIONAL, not FAIL. |
| Risk | Report-only visibility is too late | STOP gates need machine state later. | Store state in reducer registry first. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Backward compatibility | Legacy v1 rows produce zero-shape fields. |
| NFR-002 | No new files | Runtime changes stay in `reduce-state.cjs` and YAML assets. |
| NFR-003 | Deterministic aggregation | Registry output is stable for identical JSONL input. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Legacy v1 records**: New fields exist with empty arrays and default coverage shape.
- **Multiple v2 iterations**: Ledger rows aggregate across iterations; `searchCoverage` reflects the latest v2 aggregate.
- **Search debt with active P0**: Verdict remains FAIL because P0 behavior is unchanged.
- **Search debt without active findings**: Verdict is CONDITIONAL.
- **Ruled-out row without evidence**: Validator owns rejection; reducer preserves evidence refs when present.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Reducer registry, dashboard, YAML report instructions, docs. |
| Risk | 17/25 | Registry shape is consumed by future STOP gates. |
| Research | 17/20 | Directly implements Phase 001 recommendation R3. |
| Multi-Agent | 4/15 | Output read by operator and future workflow steps. |
| Coordination | 15/15 | Bundled with Phase 004 and feeds Phase 006. |
| **Total** | **69/100** | **Level 3 warranted.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Search state hidden from final report | H | L | YAML mandates always-visible Search Ledger section. |
| R-002 | v1 runs produce undefined fields | M | M | Reducer emits zero-shape fields for legacy records. |
| R-003 | Search debt confused with severity debt | M | M | Verdict uses CONDITIONAL; dashboard labels `hasSearchDebt`. |
| R-004 | Future STOP gate lacks machine state | H | L | Store in registry, not prose-only report. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator Sees Search Debt

**As a** deep-review operator, **I want** deferred and blocked search obligations surfaced in the dashboard, **so that** a PASS cannot hide unsearched bug classes.

### US-002: Future Gate Reads Durable State

**As a** Phase F implementer, **I want** reducer-owned search coverage fields, **so that** candidate-saturation STOP gates do not need to parse prose.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance -->
## 12. ACCEPTANCE CHECKS

| Check | Evidence |
|-------|----------|
| Reducer fixture | `pnpm vitest run --no-coverage review-depth-validator review-depth-reducer` |
| Legacy validator regression | `pnpm vitest run --no-coverage post-dispatch-validate` |
| Prompt regression | `pnpm vitest run --no-coverage prompt-pack` |
| Spec validation | `validate.sh .../005-search-ledger-persistence-and-reporting --strict` |
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
- **Validator phase**: `../004-validator-v2-enforcement/spec.md`
- **Implementation plan**: `plan.md`
- **Decision record**: `decision-record.md`
