# Research: Phase 10 — Type Error Remediation

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: research-core | v2.0 -->

---

## Research Context

This document captures the diagnostic analysis performed during Phase 9 verification that identified the 275 remaining type errors, plus additional investigation into root causes and fix strategies.

---

## 1. Error Distribution Analysis

### Source Data

Errors collected via: `tsc --noEmit -p mcp_server/tsconfig.json 2>&1`

**Date:** 2026-02-07
**TypeScript version:** 5.9.3
**Node.js version:** v25.2.1

### Error Concentration

The error distribution is highly skewed — a single test file accounts for 92% of all errors:

```
253 errors  mcp_server/tests/provider-chain.test.ts    (92.0%)
  5 errors  mcp_server/lib/storage/index.ts             (1.8%)
  3 errors  mcp_server/lib/search/index.ts              (1.1%)
  3 errors  mcp_server/lib/scoring/composite-scoring.ts  (1.1%)
  3 errors  mcp_server/formatters/search-results.ts      (1.1%)
  2 errors  mcp_server/handlers/memory-triggers.ts       (0.7%)
  1 error   mcp_server/tests/session-manager.test.ts     (0.4%)
  1 error   mcp_server/lib/search/hybrid-search.ts       (0.4%)
  1 error   mcp_server/lib/search/fuzzy-match.ts         (0.4%)
  1 error   mcp_server/lib/parsing/trigger-matcher.ts    (0.4%)
  1 error   mcp_server/lib/parsing/memory-parser.ts      (0.4%)
  1 error   mcp_server/formatters/index.ts               (0.4%)
```

### Error Code Analysis

| Code | Count | Category | Systemic? |
|------|------:|----------|-----------|
| TS2339 | 168 | Property does not exist on type | Yes — API changed |
| TS2554 | 67 | Wrong argument count | Yes — constructor changed |
| TS2551 | 16 | Property name suggestion (camelCase↔snake_case) | Yes — naming convention |
| TS2308 | 8 | Ambiguous re-export | Yes — barrel pattern |
| TS2739 | 7 | Missing required properties | Partial |
| TS2322 | 2 | Type not assignable | Isolated |
| TS1192 | 2 | No default export | Isolated |
| Other | 5 | Various | Isolated |

---

## 2. Root Cause: provider-chain.test.ts (253 errors)

### API Surface Drift

During Phase 5, the `EmbeddingProviderChain` class was converted to TypeScript with API changes:

| Old API (tested) | New API (actual) | Error Type |
|-------------------|------------------|------------|
| `new EmbeddingProviderChain(providers)` | `new EmbeddingProviderChain()` (no-arg) | TS2554 |
| `chain.initialize()` | Removed or renamed | TS2339 |
| `chain.embed(text)` | `chain.generateEmbedding(text)` | TS2339 |
| `chain.embedQuery(text)` | `chain.embed_query(text)` | TS2551 |
| `chain.embedDocument(text)` | `chain.embed_document(text)` | TS2551 |
| `chain.getDimension()` | Changed access pattern | TS2339 |
| `chain.isReady` | Changed access pattern | TS2339 |
| `chain.initialized` | Removed | TS2339 |
| `chain.activeProvider` | Changed access pattern | TS2339 |
| `chain.activeTier` | Changed access pattern | TS2339 |
| `ProviderTier.TERTIARY` | Removed | TS2339 |
| `FallbackReason.API_KEY_INVALID` | Consolidated | TS2339 |

### Error Category Breakdown (253 total)

| Category | Est. Count | Fix Approach |
|----------|-----------|-------------|
| Method name changes | ~80 | Find-and-replace with correct method names |
| Constructor signature | ~67 | Update all `new` calls |
| Property access changes | ~50 | Map to current property names |
| Enum value changes | ~30 | Map to current enum values |
| Mock type mismatches | ~15 | Align MockProvider with IEmbeddingProvider |
| Type assertion gaps | ~11 | Add appropriate type assertions |

---

## 3. Root Cause: Barrel Export Conflicts (8 errors)

### Storage Barrel (`lib/storage/index.ts`)

5 modules export `init`:
- `history.ts` → `export function init(db: Database)`
- `causal-edges.ts` → `export function init(db: Database)`
- `checkpoints.ts` → `export function init(db: Database)`
- `incremental-index.ts` → `export function init(db: Database)`
- `index-refresh.ts` → `export function init(db: Database)`

When the barrel uses `export * from './history'` etc., TypeScript cannot resolve which `init` to export.

### Search Barrel (`lib/search/index.ts`)

3 exports duplicated between `reranker.ts` and `cross-encoder.ts`:
- `RerankResult`
- `isRerankerAvailable`
- `rerankResults`

Both modules define these (cross-encoder likely wraps reranker), causing ambiguity.

---

## 4. Root Cause: vector-index.js Self-Require

### Hypothesis

`vector-index.js` likely has a pattern like:
```javascript
const { someHelper } = require('./vector-index');  // self-require
```

Or the barrel `search/index.ts` re-exports from `vector-index`, and `vector-index` imports from the barrel, creating an indirect circular require.

### Impact

- `test:mcp` fails with stack overflow
- MCP server cannot start
- All database operations blocked

### Investigation Required

Need to read `vector-index.js` initialization code to confirm the exact circular pattern. Fix will involve restructuring to break the cycle (e.g., lazy require, or extracting the shared code into a separate module).

---

## 5. Fix Effort Estimates

| Stream | Files | Errors | Effort | Risk |
|--------|------:|-------:|--------|------|
| 10a: Barrel conflicts | 3 | 8 | 1 hour | Low |
| 10b: Production types | 9 | 14 | 1–2 hours | Low |
| 10c: Test remediation | 2 | 254 | 2–3 hours | Medium |
| 10d: vector-index fix | 1 | 1 (runtime) | 30–60 min | Medium |
| **Total** | **15** | **277** | **4–6 hours** | **Medium** |

### Confidence Assessment

- **Stream 10a:** 95% confidence — mechanical barrel refactoring
- **Stream 10b:** 90% confidence — isolated type fixes, well-understood patterns
- **Stream 10c:** 75% confidence — large file, API mapping needed, possible cascading issues
- **Stream 10d:** 70% confidence — depends on complexity of circular require pattern

---

## Cross-References

- **Phase 9 Verification Agent Output:** (contains full tsc error output)
- **Phase 5 Plan:** `phase-6-mcp-server-upper/plan.md` (API design decisions)
- **Phase 7 Plan:** `phase-8-convert-tests/plan.md` (test conversion approach)
- **Spec:** See `spec.md`
