---
title: "Feature Specification: 027/004/002 Impact Analysis Library"
description: "Implements code-graph-impact-analysis.ts with deterministic signals, scoring, and existing impact-mode integration."
trigger_phrases:
  - "027 004 002 lib impl"
  - "code-graph-impact-analysis.ts"
  - "impact analysis library"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/009-code-graph-impact-analysis/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 scaffold for 002-lib-impl"
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
# Feature Specification: 027/004/002 Impact Analysis Library

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
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/009-code-graph-impact-analysis` |
| **Depends On** | `001-contract`; `system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/002-lib-impl` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The code graph has change detection and an impact traversal mode, but not deterministic risk-scored file impact analysis. This child implements `code-graph-impact-analysis.ts` against the contract child, reusing existing graph helpers and extending the current impact-mode surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/code_graph/lib/code-graph-impact-analysis.ts`.
- Compute fan-in, fan-out, hub centrality, coverage evidence gap, and edge confidence.
- Apply deterministic normalization and heuristic scoring.
- Enforce 3-hop traversal with explicit visited set.
- Reuse existing impact-mode and detect-changes surfaces where practical.

### Out of Scope
- MCP handler registration.
- Optional LLM enrichment adapter implementation.
- Test-file authoring beyond implementation-local helpers.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `analyzeImpact()` conforms to the contract. | Output includes affected files, risk scores, and summary. |
| REQ-002 | All five deterministic signals are computed. | Fixture-ready implementation exposes fan-in, fan-out, hub centrality, coverage evidence, and edge confidence. |
| REQ-003 | Symbol-level edges aggregate to file-level values. | Implementation walks all `CodeNode` rows for each file and dedupes connected files. |
| REQ-004 | TESTED_BY direction is incoming to production symbols. | Coverage signal uses incoming test-to-production edges. |
| REQ-005 | Traversal is bounded and cycle-safe. | Explicit visited set and depth cap of 3. |
| REQ-006 | Scores are deterministic and heuristic-labeled. | Normalizers are fixed or graph-baseline documented; output labels weight class. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Changed files produce affected files and scores in `[0, 1]`.
- **SC-002**: Missing coverage evidence is represented as unknown or missing.
- **SC-003**: Default behavior has no LLM or subprocess dependency.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-contract` | Implementation cannot stabilize output shape | Start after contract publishes. |
| Dependency | `027/002/002-lib-impl` | Layer fallback details may be unavailable | Emit unavailable/null when absent. |
| Risk | Risk weights are unvalidated | Scores can be overinterpreted | Label weights heuristic until Phase 006 calibration. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: Target under 500ms p95 for changed-file set <=5 on a 10k-symbol graph.
- **NFR-R01**: Missing files produce structured warnings, not raw exceptions.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- File missing from graph.
- File with no incoming or outgoing edges.
- File with no TESTED_BY evidence.
- Cyclic import/call graph during traversal.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope | 16/25 |
| Risk | 10/25 |
| Research | 2/20 |
| **Total** | **28/70** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact normalizer caps may be selected during implementation.
<!-- /ANCHOR:questions -->
