---
title: "Checklist — 027/003 code-graph impact analysis"
description: "QA checklist for the impact analysis phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 027/003 code-graph impact analysis

<!-- SPECKIT_LEVEL: 2 -->

Mark each item `[x]` only with file:line evidence after completion.

## P0
- [ ] **C-001**: `analyzeImpact()` returns `{affected_files[], risk_scores[], summary}`
- [ ] **C-002**: All 5 risk signals computed deterministically — fan-in, fan-out, hub centrality, test-coverage gap, edge confidence
- [ ] **C-003**: `RISK_WEIGHTS` constants centralized at module level (tunable)
- [ ] **C-004**: `code_graph_impact_analysis` MCP tool registered + callable
- [ ] **C-005**: BFS transitive depth capped at 3 hops with cycle detection
- [ ] **C-006**: Vitest ≥80% line coverage
- [ ] **C-007**: `detect_changes` opt-in `includeRisk=true` passthrough working

## P0 — pt-02 amendments (NEW)
- [ ] **C-009** (REQ-009): Deterministic normalizers (`normalizeFanIn`, `normalizeHubDegree`, `normalizeTransitiveDepth`) defined with fixed caps OR documented graph-baseline; snapshot tests assert reproducibility
- [ ] **C-010** (REQ-010): Risk signals computed via file-level aggregation over all `CodeNode` rows per file (NOT direct `queryEdgesTo(filePath)`); deduped at file level
- [ ] **C-011** (REQ-011): Coverage signal uses **incoming** `TESTED_BY` via `queryEdgesTo(productionSymbol.id)` (test→production direction)
- [ ] **C-012** (REQ-012): Coverage absence emitted as `coverageUnknownOrMissing` OR `{hasTestEdge: false, coverageEvidence: ...}` — NEVER "proven untested"
- [ ] **C-013** (REQ-013): BFS depth cap implemented in new impact-analysis loop with explicit `visited` set; does NOT rely on `queryFileImportDependents()` LIMIT

## P1
- [ ] **C-008**: Default `provider: "none"` returns complete deterministic output with `narrative: null`
- [ ] **C-008b** (REQ-014): Enrichment options schema `{enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}` enforced; boolean `enrichWithLLM` removed
- [ ] **C-008c** (REQ-015): Layer fallback emits `{source: "unavailable", value: null}` when Phase 001 layer data missing; no second local layer classifier
- [ ] **C-008d**: If CLI provider used, subprocess hardening contract from Phase 005 reused (`</dev/null`, timeouts, SIGTERM/SIGKILL escalation)
- [ ] **C-009-old**: Risk weights overridable via env/config (existing C-009 retained as `weight_class: "heuristic"` until Phase 005 calibration)

## Verification
- [ ] **C-V01**: `npm run check` green
- [ ] **C-V02**: `npx vitest run code-graph-impact-analysis.vitest.ts` all pass
- [ ] **C-V03**: strict validate passes
- [ ] **C-V04**: implementation-summary.md authored
