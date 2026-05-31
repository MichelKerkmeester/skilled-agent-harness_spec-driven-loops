---
title: "Feature Specification: 027/004/001 Impact Analysis Contract"
description: "Defines TypeScript interfaces for code_graph_impact_analysis, RiskSignal, RiskScore, and enrichment options."
trigger_phrases:
  - "027 004 001 contract"
  - "impact analysis contract"
  - "RiskSignal"
  - "RiskScore"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/001-contract"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 001-contract"
    next_safe_action: "Implement this child phase when its dependencies are available"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/004/001 Impact Analysis Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | scaffolded |
| **Created** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis` |
| **Soft Dependency** | `system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/001-contract` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 003 needs a stable contract before implementation workers touch the library, handler, and tests. Without the contract first, downstream phases can drift on output names, coverage-evidence semantics, or enrichment-provider options.

The purpose of this child is to publish the TypeScript interfaces for `code_graph_impact_analysis`, including `RiskSignal`, `RiskScore`, deterministic summary fields, and optional enrichment configuration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define request and response interfaces for the MCP tool.
- Define `RiskSignal`, `RiskScore`, risk-weight labels, and coverage evidence types.
- Define enrichment options with explicit provider, timeout, budget, input-size, and cache fields.
- Keep the contract compatible with Phase 001 HLD/LLD outputs when available.

### Out of Scope
- Implementing risk-signal computation.
- Registering the MCP handler.
- Writing correctness fixtures beyond type-level expectations.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Contract defines `code_graph_impact_analysis` input and output shapes. | Types include changed files, affected files, risk scores, summary, and enrichment status. |
| REQ-002 | Contract defines the five risk signals. | `fanIn`, `fanOut`, `hubCentrality`, `coverageEvidence`, and `edgeConfidence` are represented without implementation assumptions. |
| REQ-003 | Contract labels default scoring as heuristic. | `weightClass` or equivalent field can represent `heuristic`. |
| REQ-004 | Contract represents missing test evidence honestly. | Coverage absence can be expressed as unknown-or-missing, not proven untested. |
| REQ-005 | Enrichment contract requires explicit provider configuration. | No boolean-only `enrichWithLLM` shape remains in the new contract. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Downstream implementation can import the contract without redefining risk output types.
- **SC-002**: Handler and test phases can share the same request and response shape.
- **SC-003**: The optional enrichment adapter can be omitted without changing deterministic output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Soft dependency | Phase 001 contract | Layer metadata may not exist yet | Keep layer fields optional or unavailable/null. |
| Risk | Contract overfits implementation details | Downstream churn | Model observable API shape, not internal helper names. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01**: Contract names should be stable and readable for MCP clients.
- **NFR-R01**: Missing optional dependencies must be representable without throwing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Changed file not in graph: response supports warnings and omitted scores.
- No coverage evidence: output states unknown or missing.
- Enrichment disabled: narrative field may be null while deterministic result remains complete.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope | 6/25 |
| Risk | 4/25 |
| Research | 2/20 |
| **Total** | **12/70** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for scaffold. Implementation may refine exact field names while preserving these semantics.
<!-- /ANCHOR:questions -->
