---
title: Deep Context Dashboard
description: Auto-generated reducer view over the deep-context packet.
---

# Deep Context Dashboard

Auto-generated from the JSONL state log, per-seat findings, and the merged registry. Never manually edited.

## 1. STATUS
- Scope: Gather context on .opencode/skills/system-code-graph, .opencode/skills/system-skill-advisor, and .opencode/skills/system-spec-kit for use in specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition
- Started: 2026-06-07T08:30:00Z
- Status: COMPLETE
- Iterations (parallel sweeps): 1 of 8
- Session ID: dc-2026-06-07T08-30-00Z-028
- Lineage mode: new
- Generation: 1

## 2. PROGRESS

| # | Focus | Findings | NewAgr | sliceCov | agrRate | Status |
|---|-------|----------|--------|----------|---------|--------|
| 1 | MCP-to-CLI transition ownership boundaries across system-code-graph, system-skill-advisor, and system-spec-kit | 12 | 10 | 1.00 | 0.83 | evidence |

## 3. MERGED METRICS
- findings (deduped units): 12
- gated findings (>= relevance gate): 12
- low-confidence (below gate): 0
- agreement-eligible (>= agreementMin): 9
- agreementRate: 0.75
- relevanceFloor: 1.00
- reuseCandidates: 2 | integrationPoints: 4 | conventions: 2 | dependencies: 1 | gaps: 3

## 4. REUSE CATALOG (top, agreement-weighted)

| Symbol/Path | Reuse | Agreement (k) | Relevance | Evidence |
|-------------|-------|---------------|-----------|----------|
| CODE_GRAPH_TOOL_SCHEMAS | import | 2 | 0.98 | .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:186 |
| TOOL_DEFINITIONS | import | 2 | 0.97 | .opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37 |

## 5. CONTRADICTIONS (surfaced, never auto-resolved)
- None surfaced

## 6. GRAPH CONVERGENCE
- graphDecision: STOP_ALLOWED
- sliceCoverage: 1.00
- reuseCatalogCoverage: 1.00
- agreementRate: 0.83
- relevanceFloor: 1.00
- dependencyCompleteness: 1.00
- Blockers: none recorded
