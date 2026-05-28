---
title: "003 — Code Graph Impact Analysis"
description: "Phase-parent control spec for contract-first implementation of risk-scored code graph impact analysis."
trigger_phrases:
  - "027 phase 004"
  - "code-graph impact analysis"
  - "code_graph_impact_analysis"
  - "impact analysis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Refactored populated packet into phase-parent scaffold"
    next_safe_action: "Resume one of the child phase folders"
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
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# Feature Specification: 003 — Code Graph Impact Analysis

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | phase-parent |
| **Created** | 2026-05-08 |
| **Updated** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex` |
| **Packet ID** | `system-spec-kit/028-code-graph-and-cocoindex/003-code-graph-impact-analysis` |
| **Primary Dependency** | `system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`detect_changes` reports affected symbols and the existing code graph context surface already has an `impact` mode over incoming `CALLS` and `IMPORTS`. This phase adds deterministic file-level risk scoring on top of those existing surfaces so agents can ask what a changed file affects and receive affected files, risk signals, normalized scores, and a structured summary.

> **pt-04 audit note (2026-05-11):** Phase 003 extends existing impact surfaces instead of creating a parallel impact concept. The implementation must add the five risk signals and risk-score formula on top of existing `detect_changes` and `impact` behavior.

The five deterministic risk signals are:

1. **fan-in**: incoming symbol-level edges aggregated to the file.
2. **fan-out**: outgoing symbol-level edges aggregated to the file.
3. **hub centrality**: file-degree connectedness from graph degree helpers.
4. **coverage evidence gap**: incoming `TESTED_BY` evidence, reported as unknown or missing when absent.
5. **edge confidence**: average edge-confidence metadata with existing defaults as a floor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- TypeScript contracts for `code_graph_impact_analysis`, risk signals, risk scores, and enrichment options.
- Deterministic library implementation for aggregation, 5 risk signals, normalization, scoring, and bounded traversal.
- MCP handler for impact analysis plus optional LLM risk-enrichment adapter behind explicit provider configuration.
- Correctness fixtures for file-level aggregation, TESTED_BY direction, coverage evidence semantics, and traversal depth.

### Out of Scope
- Product code implementation outside the child phase currently being executed.
- Remote enrichment by default.
- New persistence tables for impact scoring.
- Calibrated risk weights; Phase 004 owns empirical calibration.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-contract` | TS interfaces for impact tool contracts, `RiskSignal`, and `RiskScore` types. | scaffolded |
| 002 | `002-lib-impl` | `code-graph-impact-analysis.ts`, 5 deterministic risk signals, scoring, and existing impact-mode integration. | scaffolded |
| 003 | `003-handler` | `handlers/impact-analysis.ts` plus optional `code-graph-llm-risk-enrich.ts` adapter. | scaffolded |
| 004 | `004-test` | `code-graph-impact-analysis.vitest.ts` correctness fixtures. | scaffolded |

### Phase Transition Rules
- `001-contract` can start when `028/001-code-graph-hld-lld/001-contract` publishes its contract.
- `002-lib-impl` starts after `001-contract` and after `028/001-code-graph-hld-lld/002-lib-impl` is merged.
- `003-handler` can start after `001-contract`; the optional LLM enrichment adapter may ship later behind an env flag.
- `004-test` can start after `001-contract` and should validate the pt-02 correctness fixtures.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-contract` | `002-lib-impl` | Impact-analysis interfaces and risk types are stable enough for implementation. | Child strict validation passes. |
| `001-contract` | `003-handler` | Handler input/output contracts are available. | Child strict validation passes. |
| `001-contract` | `004-test` | Fixture expectations can type against contract outputs. | Child strict validation passes. |
| `002-lib-impl` | `004-test` | Library behavior is available for correctness tests. | Vitest target passes in implementation phase. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for scaffolding. Implementation children carry any phase-local technical questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-contract/`, `002-lib-impl/`, `003-handler/`, `004-test/`
- **Graph metadata**: `graph-metadata.json`
- **Description metadata**: `description.json`
