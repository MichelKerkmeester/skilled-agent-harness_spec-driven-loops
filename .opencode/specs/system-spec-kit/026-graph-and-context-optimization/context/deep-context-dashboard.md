---
title: Deep Context Dashboard
description: Auto-generated reducer view over the deep-context packet.
---

# Deep Context Dashboard

Auto-generated from the JSONL state log, per-seat findings, and the merged registry. Never manually edited.

## 1. STATUS
- Scope: All work done in system-spec-kit/026-graph-and-context-optimization — BOTH the documentation narrative (what each of the 9 phases / 110 sub-phases delivered) AND the underlying code subsystems the program produced/modified (system-code-graph MCP, mk-spec-memory memory+embedder runtime, deep-loop-runtime fan-out/dispatch, daemon launchers + IPC bridge, runtime hooks, doctor surface, template system, skill-advisor).
- Started: 2026-06-07T08:34:48.000Z
- Status: COMPLETE
- Iterations (parallel sweeps): 5 of 10
- Session ID: ctx-026-1780821288
- Lineage mode: new
- Generation: 1

## 2. PROGRESS

| # | Focus | Findings | NewAgr | sliceCov | agrRate | Status |
|---|-------|----------|--------|----------|---------|--------|
| 1 | docs-band program narrative (anchors 1-11) | 24 | 23 | 0.55 | 1.00 | evidence |
| 2 | docs-band deep: decisions/research/defect-fix | 23 | 23 | 0.55 | 1.00 | evidence |
| 3 | code band pt1: code-graph/memory/embedders | 32 | 32 | 0.70 | 1.00 | evidence |
| 4 | code band pt2: deep-loop/launchers/hooks/doctor/advisor | 31 | 31 | 0.95 | 1.00 | evidence |
| 5 | gap-fill / completeness-critic | 8 | 8 | 0.95 | 1.00 | evidence |

## 3. MERGED METRICS
- findings (deduped units): 118
- gated findings (>= relevance gate): 117
- low-confidence (below gate): 1
- agreement-eligible (>= agreementMin): 117
- agreementRate: 1.00
- relevanceFloor: 0.99
- reuseCandidates: 53 | integrationPoints: 16 | conventions: 37 | dependencies: 3 | gaps: 8

## 4. REUSE CATALOG (top, agreement-weighted)

| Symbol/Path | Reuse | Agreement (k) | Relevance | Evidence |
|-------------|-------|---------------|-----------|----------|
| runCappedPool | Concurrency-capped parallel pool primitive with never-throw settlement and ordered results. Generalizes council dispatchSeats with K-in-flight cap. Inject worker pattern. | 1 | 0.95 | fanout-pool.cjs:138 |
| buildLineageCommand | - | 1 | 0.95 | fanout-run.cjs:259 |
| handleCodeGraphQuery | compose | 1 | 0.95 | .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1198 |
| ensureCodeGraphReady | compose | 1 | 0.95 | .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:624 |
| code-graph-structural-indexing | extend | 1 | 0.95 | 004-code-graph/spec.md:88-98 |
| program-topology | extend | 1 | 0.95 | spec.md:95-123 |
| memory-continuity-substrate | extend | 1 | 0.92 | 003-memory-and-causal-runtime/spec.md:89 |
| evaluateCouncilConvergence | - | 1 | 0.90 | convergence.cjs:147 |
| dispatchCouncilSeats | - | 1 | 0.90 | multi-seat-dispatch.cjs:129 |
| evaluateContext | Convergence evaluator for context loops. Five signals (sliceCoverage, reuseCatalogCoverage, agreementRate, relevanceFloor, dependencyCompleteness). Three blocking guards. | 1 | 0.90 | convergence.cjs:262 |
| evaluateResearch | Convergence evaluator for research loops. Five signals (questionCoverage, claimVerificationRate, contradictionDensity, sourceDiversity, evidenceDepth) with blocking guards and weighted thresholds. | 1 | 0.90 | convergence.cjs:200 |
| evaluateReview | Convergence evaluator for review loops. Five signals (dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation). P0 resolution rate is blocking_guard. | 1 | 0.90 | convergence.cjs:234 |
| runLineageProcess | - | 1 | 0.90 | fanout-run.cjs:188 |
| handleCodeGraphContext | compose | 1 | 0.90 | .opencode/skills/system-code-graph/mcp_server/handlers/context.ts:170 |
| handleCodeGraphScan | compose | 1 | 0.90 | .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:312 |

## 5. CONTRADICTIONS (surfaced, never auto-resolved)
- None surfaced

## 6. GRAPH CONVERGENCE
- graphDecision: STOP_ALLOWED
- sliceCoverage: [n/a]
- reuseCatalogCoverage: [n/a]
- agreementRate: [n/a]
- relevanceFloor: [n/a]
- dependencyCompleteness: [n/a]
- Blockers: none recorded
