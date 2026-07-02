---
title: Deep Context Dashboard
description: Auto-generated reducer view over the deep-context packet.
---

# Deep Context Dashboard

Auto-generated from the JSONL state log, per-seat findings, and the merged registry. Never manually edited.

## 1. STATUS
- Scope: .opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target
- Started: 2026-07-02T15:36:36.609Z
- Status: COMPLETE
- Iterations (parallel sweeps): 1 of 1
- Session ID: ctx-2026-07-02-1535-r2wqtt
- Lineage mode: new
- Generation: 1

## 2. PROGRESS

| # | Focus | Findings | NewAgr | sliceCov | agrRate | Status |
|---|-------|----------|--------|----------|---------|--------|
| 1 | src/slugify.js :: slugify (seeded frontier slice) | 5 | 5 | 1.00 | 1.00 | evidence |

## 3. MERGED METRICS
- findings (deduped units): 5
- gated findings (>= relevance gate): 5
- low-confidence (below gate): 0
- agreement-eligible (>= agreementMin): 5
- agreementRate: 1.00
- relevanceFloor: 1.00
- reuseCandidates: 1 | integrationPoints: 1 | conventions: 1 | dependencies: 1 | gaps: 1

## 4. REUSE CATALOG (top, agreement-weighted)

| Symbol/Path | Reuse | Agreement (k) | Relevance | Evidence |
|-------------|-------|---------------|-----------|----------|
| slugify | import | 2 | 0.98 | src/slugify.js:9 |

## 5. CONTRADICTIONS (surfaced, never auto-resolved)
- slugify (signature): native-a="slugify(input, maxLen = 60) -> string" vs native-b="slugify(input, maxLen=60) -> string"
- slugify (signature): native-a="no require()/import statements" vs native-b="no require/import statements"
- slugify (signature): native-a="maxLen = maxLen || 60" vs native-b="JSDoc block above function"
- slugify (signature): native-a="returns '' for all-non-alphanumeric input" vs native-b="no Unicode transliteration"

## 6. GRAPH CONVERGENCE
- graphDecision: STOP_ALLOWED
- sliceCoverage: 1.00
- reuseCatalogCoverage: 1.00
- agreementRate: 1.00
- relevanceFloor: 1.00
- dependencyCompleteness: 1.00
- Blockers: none recorded
