---
title: "Feature Specification: 027/004/003 Impact Analysis Handler"
description: "Implements the MCP handler and optional LLM risk-enrichment adapter for code_graph_impact_analysis."
trigger_phrases:
  - "027 004 003 handler"
  - "impact analysis handler"
  - "code-graph-llm-risk-enrich"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 003-handler"
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
# Feature Specification: 027/004/003 Impact Analysis Handler

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

The deterministic analyzer needs an MCP-facing entry point with validation, readiness checks, response envelopes, and optional narrative enrichment that cannot run unless explicitly configured. This child owns both `handlers/impact-analysis.ts` and the optional `code-graph-llm-risk-enrich.ts` adapter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/code_graph/handlers/impact-analysis.ts`.
- Register `code_graph_impact_analysis` in the tool surface.
- Validate inputs and map library results to MCP envelopes.
- Optionally add `code-graph-llm-risk-enrich.ts` behind env/provider gating.

### Out of Scope
- Core risk-signal computation.
- Test fixture implementation.
- Enabling remote enrichment by default.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Handler validates request input. | Malformed file arrays and option shapes return structured errors. |
| REQ-002 | Handler calls deterministic analyzer. | Default output is complete with `provider: "none"`. |
| REQ-003 | Tool is registered as `code_graph_impact_analysis`. | MCP tool list includes the new tool after implementation. |
| REQ-004 | Optional enrichment adapter is gated. | Adapter cannot run without explicit provider/env configuration. |
| REQ-005 | Adapter budgets are enforced if implemented. | Timeout, call count, input size, and cache key options are honored. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MCP callers can invoke `code_graph_impact_analysis`.
- **SC-002**: Default handler behavior remains deterministic and local.
- **SC-003**: Optional enrichment can be deferred without blocking handler delivery.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-contract` | Handler schema can drift | Implement after contract publishes. |
| Risk | Enrichment introduces hidden remote dependency | Unexpected latency/cost | Default provider is none and adapter is env gated. |
| Risk | Subprocess provider lifecycle | Stuck child process | Reuse hardened dispatcher contract if CLI provider ships. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Handler returns structured MCP errors without raw exceptions.
- **NFR-S01**: Enrichment input is bounded before any provider call.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty changed-file list.
- Enrichment requested without provider config.
- Provider timeout or budget exhaustion.
- Analyzer returns warnings for files missing from graph.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope | 10/25 |
| Risk | 7/25 |
| Research | 2/20 |
| **Total** | **19/70** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether optional LLM enrichment ships in this child or is deferred behind the same contract.
<!-- /ANCHOR:questions -->
