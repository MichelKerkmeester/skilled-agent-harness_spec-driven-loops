---
title: "Verification Checklist: 027/003 Code Graph Impact Analysis"
description: "QA validation checklist for deterministic file-level impact analysis."
trigger_phrases:
  - "027 phase 003 checklist"
  - "code graph impact analysis checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned checklist with deterministic aggregation, coverage, and enrichment amendments"
    next_safe_action: "Implement Phase 003 after Phase 001/002 data contracts are available"
---
# Verification Checklist: 027/003 Code Graph Impact Analysis

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the phase implemented until complete |
| **[P1]** | Required | Must complete or explicitly defer with approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-015 are present in spec.md.
- [ ] CHK-002 [P0] Plan states risk is deterministic by default and LLM enrichment is explicit provider configuration.
- [ ] CHK-003 [P0] Tasks sequence file-level aggregation and coverage honesty before report narrative work.
- [ ] CHK-004 [P1] Dependency on Phase 001 layer data is documented with unavailable fallback behavior.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `analyzeImpact()` returns `{affected_files[], risk_scores[], summary}`.
- [ ] CHK-011 [P0] Fan-in, fan-out, hub centrality, test-coverage gap, and edge-confidence signals are deterministic.
- [ ] CHK-012 [P0] `RISK_WEIGHTS` constants are centralized at module scope.
- [ ] CHK-013 [P0] `code_graph_impact_analysis` is registered and callable through the MCP surface.
- [ ] CHK-014 [P0] BFS transitive depth uses an explicit `visited` set and a 3-hop cap.
- [ ] CHK-015 [P0] `detect_changes` can opt into risk output with `includeRisk=true`.
- [ ] CHK-016 [P0] Normalizers use fixed caps or a documented graph baseline with snapshot tests.
- [ ] CHK-017 [P0] Risk signals aggregate symbol-level edges across all CodeNode rows for a file, deduped at file level.
- [ ] CHK-018 [P0] Coverage signal uses incoming `TESTED_BY` edges via production symbol IDs.
- [ ] CHK-019 [P0] Missing coverage evidence is reported as unknown or missing, never as proven untested.
- [ ] CHK-020 [P1] Default `provider: "none"` returns deterministic output with `narrative: null`.
- [ ] CHK-021 [P1] Enrichment options schema replaces boolean `enrichWithLLM`.
- [ ] CHK-022 [P1] Layer fallback emits `{source: "unavailable", value: null}` if Phase 001 layer data is absent.
- [ ] CHK-023 [P1] CLI provider subprocess handling reuses the Phase 005 hardening contract if enabled.
- [ ] CHK-024 [P1] Risk weight overrides are marked heuristic until Phase 005 calibration.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Aggregation fixtures prove file-level fan-in/fan-out from symbol edges.
- [ ] CHK-031 [P0] Coverage fixtures prove incoming TESTED_BY direction and unknown/missing wording.
- [ ] CHK-032 [P0] BFS cycle fixture proves visited-set behavior.
- [ ] CHK-033 [P0] `npx vitest run code-graph-impact-analysis.vitest.ts` passes.
- [ ] CHK-034 [P0] New Phase 003 code reaches at least 80 percent line coverage.
- [ ] CHK-035 [P0] `npm run check` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-040 [P0] Every P0 requirement has file:line evidence in implementation-summary.md after implementation.
- [ ] CHK-041 [P0] All pt-02 amendments are mapped to tests or explicit out-of-scope decisions.
- [ ] CHK-042 [P1] Provider-enrichment behavior is documented for disabled, unavailable, and configured states.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] MCP input validation rejects malformed file paths and options without raw exceptions.
- [ ] CHK-051 [P1] LLM enrichment, if enabled, applies timeout, call-count, and input-size limits.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md remain synchronized.
- [ ] CHK-061 [P0] Strict spec-kit validation passes for the phase folder.
- [ ] CHK-062 [P1] Risk signal definitions and coverage-evidence semantics are documented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] New impact-analysis source, test, and fixture files follow the existing mcp_server layout.
- [ ] CHK-071 [P1] No generated reports or run artifacts are committed outside approved locations.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 0/28 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
