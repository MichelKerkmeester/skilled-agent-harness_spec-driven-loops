---
title: "Feature Specification: 027/004/004 Impact Analysis Tests"
description: "Defines Vitest correctness fixtures for code_graph_impact_analysis."
trigger_phrases:
  - "027 004 004 test"
  - "code-graph-impact-analysis.vitest"
  - "impact analysis tests"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/003-code-graph-impact-analysis/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 004-test"
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
# Feature Specification: 027/004/004 Impact Analysis Tests

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
| **Depends On** | `001-contract` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 003's correctness hinges on pt-02 fixes: symbol-level file aggregation, incoming TESTED_BY direction, honest coverage evidence, deterministic normalization, and bounded traversal. This child owns `code-graph-impact-analysis.vitest.ts` fixtures that prove those behaviors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/tests/code-graph-impact-analysis.vitest.ts`.
- Add fixtures for multi-symbol file aggregation.
- Add TESTED_BY direction and missing-evidence fixtures.
- Add BFS depth and cycle fixtures.
- Add default provider-none enrichment fixture.

### Out of Scope
- Implementing production analyzer code.
- Full calibration of risk weights.
- Remote-provider integration tests unless adapter ships.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Aggregation fixture proves symbol-to-file behavior. | Fan-in and fan-out dedupe connected files across all nodes for one file. |
| REQ-002 | Coverage fixture proves incoming TESTED_BY direction. | Test-to-production edge yields coverage evidence for production file. |
| REQ-003 | Missing coverage is not called proven untested. | Output uses unknown/missing evidence class. |
| REQ-004 | Traversal fixture proves depth cap and cycle handling. | Graph cycles terminate and results do not exceed 3 hops. |
| REQ-005 | Provider-none fixture proves deterministic default. | Narrative is null or skipped while risk scores remain complete. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run code-graph-impact-analysis.vitest.ts` passes.
- **SC-002**: The fixture suite exercises each of the five risk signals.
- **SC-003**: Coverage evidence wording cannot regress to "proven untested".
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-contract` | Test assertions may drift | Start after contract publishes. |
| Dependency | `002-lib-impl` | Runtime tests cannot pass until library exists | Scaffold fixtures from contract, execute after implementation. |
| Risk | Fixtures encode implementation internals | Brittle tests | Assert public output semantics only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01**: Fixtures should be small enough to diagnose failures quickly.
- **NFR-R01**: Tests should be deterministic and not require external providers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Multi-symbol file with duplicate edges.
- Production file with supported TESTED_BY edge.
- Production file with no TESTED_BY evidence.
- Cyclic dependency graph.
- Enrichment config absent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope | 9/25 |
| Risk | 5/25 |
| Research | 2/20 |
| **Total** | **16/70** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether CLI provider hardening tests are added here depends on the `003-handler` adapter decision.
<!-- /ANCHOR:questions -->
