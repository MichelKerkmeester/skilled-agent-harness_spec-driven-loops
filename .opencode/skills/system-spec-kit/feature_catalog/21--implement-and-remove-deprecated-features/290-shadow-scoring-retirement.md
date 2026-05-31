---
title: "Shadow-scoring retirement"
description: "The shadow-scoring module now preserves read-only comparison helpers and historical stats access while runtime scoring and persistence remain permanently retired."
trigger_phrases:
  - "shadow-scoring retirement"
  - "SPECKIT_SHADOW_SCORING"
  - "retire shadow scoring runtime"
  - "read-only comparison helpers"
  - "shadow scoring persistence disabled"
---

# Shadow-scoring retirement

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This entry documents the retirement posture of the legacy shadow-scoring runtime.

The requested source file shows that the module still carries the data types, comparison logic, schema bootstrap, and historical stats surface that older code and tests can rely on. What has been removed is the live runtime path that would execute alternative scoring in parallel with production and persist new comparison rows.

---

## 2. HOW IT WORKS

### Retired Runtime Entry Points

The retirement boundary is explicit in `mcp_server/lib/eval/shadow-scoring.ts`. `runShadowScoring()` is marked deprecated and immediately returns `null` without invoking the supplied shadow-scoring function. The compatibility flag `SPECKIT_SHADOW_SCORING` is mentioned only to explain why the old entrypoint still exists; it no longer enables any production scoring path.

Persistence is retired in the same way. `logShadowComparison()` now immediately returns `false`, so new shadow-comparison rows are not written through this module even though the eval-table schema definition is still present.

### Live Analysis Surface

What remains live is the pure analysis surface. `compareShadowResults()` still computes per-result deltas, overlap counts, mean absolute score and rank deltas, and Kendall-tau-like rank correlation. The implementation is wrapped so failures stay non-fatal and callers still receive a safe fallback object. `getShadowStats()` also remains active as a historical read helper: it ensures the schema exists, queries `eval_shadow_comparisons`, and returns aggregated metrics when rows are present or a zero-case object when they are not.

### Module Posture

That makes the module read-oriented and compatibility-oriented rather than runtime-oriented. Historical data can still be inspected, comparison math can still be reused, and schema/bootstrap assumptions remain intact for older tests, but the production-era shadow-scoring execution and write paths are intentionally shut off.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/eval/shadow-scoring.ts` | Eval | Retains comparison types, schema helpers, read-only stats access, and pure diff logic while retiring runtime execution and persistence |

---

## 4. SOURCE METADATA
- Group: Implement And Remove Deprecated Features
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `21--implement-and-remove-deprecated-features/290-shadow-scoring-retirement.md`
Related references:
- [289-lazy-loading-migration-and-warmup-compatibility.md](289-lazy-loading-migration-and-warmup-compatibility.md) — Lazy-loading migration and warmup compatibility
- [291-inert-scoring-flags-and-compatibility-shims.md](291-inert-scoring-flags-and-compatibility-shims.md) — Inert scoring flags and compatibility shims
