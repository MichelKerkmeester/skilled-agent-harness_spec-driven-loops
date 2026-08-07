---
title: Deep Context Dashboard
description: Auto-generated reducer view over the deep-context packet.
---

# Deep Context Dashboard

Auto-generated from the JSONL state log, per-seat findings, and the merged registry. Never manually edited.

## 1. STATUS
- Scope: Phase 004 route proof smoke for context
- Started: 2026-06-30T20:45:20.009Z
- Status: ITERATING
- Iterations (parallel sweeps): 1 of 1
- Session ID: deep-context-20260630T204520Z-gpt-context-smoke
- Lineage mode: new
- Generation: 1

## 2. PROGRESS

| # | Focus | Findings | NewAgr | sliceCov | agrRate | Status |
|---|-------|----------|--------|----------|---------|--------|
| 1 | fallback frontier: deep-context router, presentation, auto workflow, cli-opencode contract, phase smoke docs | 0 | 0 | 0.00 | 0.00 | blocked |

## 3. MERGED METRICS
- findings (deduped units): 0
- gated findings (>= relevance gate): 0
- low-confidence (below gate): 0
- agreement-eligible (>= agreementMin): 0
- agreementRate: 0.00
- relevanceFloor: 0.00
- reuseCandidates: 0 | integrationPoints: 0 | conventions: 0 | dependencies: 0 | gaps: 0

## 4. REUSE CATALOG (top, agreement-weighted)

| Symbol/Path | Reuse | Agreement (k) | Relevance | Evidence |
|-------------|-------|---------------|-----------|----------|
| none yet | - | 0 | 0.00 | - |

## 5. CONTRADICTIONS (surfaced, never auto-resolved)
- None surfaced

## 6. GRAPH CONVERGENCE
- graphDecision: STOP_BLOCKED
- sliceCoverage: 0.00
- reuseCatalogCoverage: 0.00
- agreementRate: 0.00
- relevanceFloor: 0.00
- dependencyCompleteness: 0.00
- Blocker: sliceCoverage<0.70
- Blocker: relevanceFloor<0.50
- Blocker: agreementRate<0.50
- Blocker: cli-opencode self-invocation guard
