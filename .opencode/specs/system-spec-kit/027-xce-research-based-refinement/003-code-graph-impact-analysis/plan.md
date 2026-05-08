---
title: "Plan — 027/003 code-graph impact analysis"
description: "Phased plan: lib → handler → detect_changes integration → optional LLM adapter → tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 027/003 code-graph impact analysis

<!-- SPECKIT_LEVEL: 2 -->

## OVERVIEW
~350 LOC. Sequential. Wall-clock 3-4 hours.

## PHASES

### Phase 1: Risk-signal lib + file-level aggregation (REQ-001, REQ-002, REQ-010, REQ-011)
- Create `mcp_server/code_graph/lib/code-graph-impact-analysis.ts`.
- **Implement file→nodes aggregation helper**: `getNodesForFile(filePath, db)` returns all `CodeNode` rows whose `filePath === filePath`.
- Implement `computeRiskSignals(filePath, db)` per REQ-002:
  - **Aggregate symbol-level edges across all nodes** of the file via `queryEdgesTo(node.id)` / `queryEdgesFrom(node.id)`; dedupe connected files at the file level (REQ-010). NOT direct `queryEdgesTo(filePath)` (that wouldn't match — edge subjects are symbol IDs).
  - For coverage: use **incoming** `TESTED_BY` edges via `queryEdgesTo(productionSymbol.id, 'TESTED_BY')` (test→production direction; REQ-011).
  - Encode coverage absence as `{hasTestEdge: false, coverageEvidence: "coverageUnknownOrMissing"}` per REQ-012, NOT "untested".
- Unit-test each signal independently with fixture data including multi-symbol files (T-003A).

### Phase 2: Deterministic normalizers (REQ-009, NEW)
- **Define `normalizeFanIn(rawCount)`, `normalizeHubDegree(rawCount)`, `normalizeTransitiveDepth(rawDepth)`** with fixed caps OR documented graph-baseline semantics.
- Snapshot tests assert reproducible outputs for unchanged graph state (T-003B).
- Outputs labeled `weight_class: "heuristic"` until Phase 005 calibration.

### Phase 3: Score formula + BFS with explicit visited set (REQ-003, REQ-005, REQ-013)
- `RISK_WEIGHTS` constants block.
- `applyRiskFormula(signals, weights)` returns 0..1 score; uses normalizers from Phase 2.
- **Implement BFS depth cap at 3 IN THE NEW IMPACT-ANALYSIS LOOP** with an explicit `visited: Set<string>` (REQ-013) — do NOT rely on `queryFileImportDependents()` to apply a LIMIT (it returns flat 1-hop only).
- Cycle test fixture (T-003D).

### Phase 4: Top-level orchestrator (REQ-001)
- `analyzeImpact(changedFiles, db, opts)` composes signal computation + scoring + summary.
- Build `affected_files` list via reverse-edge walk from changed files; results aggregated to file level.

### Phase 5: Handler + tool reg (REQ-004)
- Create `handlers/impact-analysis.ts` with zod schema + readiness gate.
- Register `code_graph_impact_analysis` in `tools/code-graph-tools.ts`.

### Phase 6: detect_changes integration (REQ-001, REQ-008)
- Edit `handlers/detect-changes.ts` (+50 LOC) to optionally include risk signals when `?includeRisk=true`.

### Phase 7: Optional layer weighting (REQ-015)
- If `opts.includeLayer === true`, call Phase 001's `classifyFileRole(filePath, db)` if available.
- If Phase 001 unavailable, emit `{source: "unavailable", value: null}` OR omit layer weighting. **Do NOT invent a second local layer classifier.**

### Phase 8: Optional LLM enrichment (P1 REQ-007 + REQ-014)
- **Define `LlmNarrativeProvider` interface**: `{generate(payload, opts): Promise<{narrative}>}`.
- **Default provider is `"none"` / skipped** (REQ-007 amended).
- CLI provider is **explicit opt-in** via `enrichment.provider === "cli"` and **MUST use hardened subprocess helper semantics** (REQ-014 + Phase 005 dispatcher contract):
  - `</dev/null` stdin redirect (per cli-opencode CHANGELOG-2026-05-08-stdin-redirect-fix.md).
  - Timeout enforcement, SIGTERM-then-SIGKILL escalation, close-event wait.
  - Budgets: `timeoutMs`, `maxCallsPerSession`, `maxInputBytes`, `cacheKey`.
- Replaces boolean `enrichWithLLM` with options-shape contract per REQ-014.

### Phase 7: Tests + verification (REQ-006)
- Unit tests for each signal + formula + BFS.
- Integration test for full `analyzeImpact()` run.
- ≥80% line coverage.
- `npm run check` green.

## DEPENDENCIES

- Existing `detect_changes`, query APIs (already shipped).
- Optional Phase 027/001 (HLD/LLD) for layer-based criticality in LLM enrichment.
- Optional Phase 027/002 (trace) for trace-based downstream narrative in LLM enrichment.

## OUT OF SCOPE

- Real-time edge-drift tracking.
- Change-intent classification (LLM only).
- Cross-repo impact.
