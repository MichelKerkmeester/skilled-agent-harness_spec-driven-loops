# Iteration 5: Maintainability Pass

**Dimension:** Maintainability  
**Date:** 2026-05-11  
**Verdict:** CONDITIONAL (hasAdvisories=true)  
**Findings This Iteration:** P0=0, P1=0, P2=7  
**New Findings Ratio:** 1.0 (7/7)

---

## Files Reviewed

| File | LOC | Role |
|------|-----|------|
| `query-router.ts` | 1-396 | Core channel routing + preservation overrides |
| `entity-density.ts` | 1-172 | High-degree entity cache lookup |
| `routing-telemetry.ts` | 1-93 | In-process routing decision telemetry |
| `memory-crud-health.ts` | 1-30, 626-672 | Consumer of telemetry snapshot |
| `query-router.vitest.ts` | 1-658 | Query router + 012 preservation tests |
| `entity-density.vitest.ts` | 1-172 | Entity density unit tests |
| `routing-telemetry-stress.vitest.ts` | 1-275 | Stress/overflow/latency tests |

---

## Answers to Specific Questions

### 1. Three Most-Likely-to-Be-Touched Functions (Clarity 1-5)

| Function | File:Line | Clarity | Rationale |
|----------|-----------|---------|-----------|
| `routeQuery` | query-router.ts:258 | 4/5 | Good JSDoc, clear section structure. -1 for hardcoded routing-reason magic strings (`'bm25-preserved-for-authority-artifact'`, `'graph-preserved-by-intent'`) scattered across both feature-flag branches. |
| `shouldPreserveGraph` | query-router.ts:183 | 5/5 | Excellent JSDoc citing REQ-001/REQ-003, clear logic flow for intent+entity-density dual-path activation, explicit cold-start mention. |
| `getEntityDensityScore` | entity-density.ts:128 | 4/5 | JSDoc is good and describes return semantics. -1 because the side-effect (`refreshIfStale` mutates module-level cache state) is invisible from the JSDoc signature — a future caller might not realize this triggers a potential DB query. |

### 2. Inconsistent Error-Handling Patterns

All four modified files use a **universal silent-swallow pattern**:

| Site | File:Line | Pattern |
|------|-----------|---------|
| `safeGetDb()` | query-router.ts:207-213 | `try { return vectorIndex.getDb() } catch { return null }` — no log |
| `resolveArtifactClass()` | query-router.ts:215-221 | `try { return getStrategyForQuery(query)... } catch { return 'unknown' }` — no log |
| `refreshIfStale()` | entity-density.ts:105-116 | `try { cachedTerms = buildIndex(db) } catch { cachedTerms = new Set(); lastBuildOk = false }` — no log |
| `parseTriggerPhrases()` | entity-density.ts:46-58 | catch block returns `[raw]` — no log; non-array parse returns `[]` with no log |

All sites silently degrade without observability. Additionally, `parseTriggerPhrases` has an **asymmetric** fallback: JSON parse throw → `[raw]` vs. JSON non-array success → `[]` — two different silence strategies in the same function (see P2-021).

### 3. Duplicated Logic (Beyond Prior Findings)

| Duplication | Locations | Severity |
|-------------|-----------|----------|
| `setEnv`/`restoreEnv` test helpers | query-router.vitest.ts:37-57, routing-telemetry-stress.vitest.ts:23-35 | P2-023 |
| `FEATURE_FLAG` / `COMPLEXITY_FLAG` constant | query-router.vitest.ts:33, 415 | P2-022 |

### 4. Dead/Orphan Code

**None found.** All exports are consumed. All imports are used. `parseTriggerPhrases` in entity-density.ts has reachable non-array-parse path (line 57) but it is not dead — it handles the case where `JSON.parse(raw)` succeeds but returns a non-array value.

---

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required Fixes

None.

### P2 — Advisory

#### P2-017 [P2] Missing JSDoc on exported `getSnapshot`

- **File:** routing-telemetry.ts:50
- **Evidence:** `getSnapshot` is exported and consumed by `memory-crud-health.ts` via `import { getSnapshot as getRoutingTelemetrySnapshot }`. The function computes and returns a `RoutingTelemetrySnapshot` containing channel rates surfaced in the MCP `memory_health` response. No JSDoc block exists. Contrast with `recordInvocation` (line 25) which has a proper JSDoc block.
- **Finding class:** instance-only
- **Scope proof:** Grep for `getSnapshot` confirms single export site in routing-telemetry.ts and single import in memory-crud-health.ts.
- **Recommendation:** Add JSDoc describing the returned `RoutingTelemetrySnapshot` shape and that it is pure in-memory with no side effects.

#### P2-018 [P2] Missing JSDoc on exported `shouldPreserveBm25`

- **File:** query-router.ts:144
- **Evidence:** `shouldPreserveBm25` is exported (line 394) and plays a critical role in simple-tier channel routing. It calls `classifyIntent` and `resolveArtifactClass` internally. No JSDoc block exists. Contrast with `shouldPreserveGraph` (lines 171-182) which has a comprehensive JSDoc block referencing REQs.
- **Finding class:** instance-only
- **Scope proof:** Grep for `shouldPreserveBm25` shows export at line 394 and consumption at line 308 within `routeQuery`.
- **Affected surface hints:** ["query-router"]
- **Recommendation:** Add JSDoc documenting the intent-check and artifact-class resolution against `BM25_PRESERVING_ARTIFACTS`.

#### P2-019 [P2] Missing JSDoc on exported `isGraphChannelPreservationEnabled`

- **File:** query-router.ts:160
- **Evidence:** The function is exported (line 393) and tested directly (012-T2.6, 012-T2.7). It has inline comments referencing REQ-008 but no formal JSDoc (`/** ... */`) block. Inline comments are not visible to IDE tooling.
- **Finding class:** instance-only
- **Scope proof:** Grep for `isGraphChannelPreservationEnabled` shows export at line 393, consumption at line 325, and test usage at lines 520, 525.
- **Affected surface hints:** ["query-router"]
- **Recommendation:** Convert the inline comments at lines 155-159 into a JSDoc block with `@returns boolean`.

#### P2-020 [P2] Module header stale — omits channel preservation overrides

- **File:** query-router.ts:1-6
- **Evidence:** The module header reads "Tier-to-channel-subset routing for query complexity. Maps classifier tiers to channel subsets for selective pipeline execution." It does not mention the BM25 preservation override (`shouldPreserveBm25`, line 144) or the graph-channel preservation override (`shouldPreserveGraph`, line 183) that are the primary additions of this packet to the file. A new maintainer reading the header would miss the entire preservation-override layer.
- **Finding class:** instance-only
- **Scope proof:** The module header covers lines 1-6. The preservation overrides span lines 74-82 (`BM25_PRESERVING_ARTIFACTS`), 144-152 (`shouldPreserveBm25`), 160-163 (`isGraphChannelPreservationEnabled`), and 183-205 (`shouldPreserveGraph`).
- **Affected surface hints:** ["query-router"]
- **Recommendation:** Append to the module header: "Also applies BM25 preservation for spec/artifact intent queries and graph-channel preservation for entity-dense queries."

#### P2-021 [P2] `parseTriggerPhrases` asymmetric and undocumented fallback behavior

- **File:** entity-density.ts:46-58
- **Evidence:** Two divergent fallback paths exist within the same function:
  - `JSON.parse(raw)` throws → catch block → returns `[raw]` (line 55)
  - `JSON.parse(raw)` succeeds but returns non-array (object, number, string) → returns `[]` (line 57)
  - These produce different results for semantically similar inputs. Neither path is documented. A maintainer reading this would ask: why does malformed JSON return one strategy while valid-but-wrong-shaped JSON silently drops?
- **Finding class:** instance-only
- **Scope proof:** `parseTriggerPhrases` is private to entity-density.ts, called only from `buildIndex` (line 86). The catch-path at line 55 returns `[raw]` which, if `raw` is a non-string JSON value (e.g., `true`), would inject an empty string or `"true"` into the tokenization pipeline.
- **Affected surface hints:** ["entity-density"]
- **Recommendation:** Document the asymmetry or unify to a single fallback strategy (e.g., always return `[]` on any parse anomaly and log the unexpected input).

#### P2-022 [P2] Duplicate env-flag constant in same test file

- **File:** query-router.vitest.ts:33, 415
- **Evidence:** `const FEATURE_FLAG = 'SPECKIT_COMPLEXITY_ROUTER'` (line 33) and `const COMPLEXITY_FLAG = 'SPECKIT_COMPLEXITY_ROUTER'` (line 415) both bind the same env var string. `FEATURE_FLAG` is used by pre-012 test blocks (T026-04 through T026-06); `COMPLEXITY_FLAG` is used by packet-012 test blocks (012-T1 through 006-T1). A maintainer running `grep SPECKIT_COMPLEXITY_ROUTER` would find two different variables and must resolve which one is the reference binding.
- **Finding class:** instance-only
- **Scope proof:** Grep confirms: `FEATURE_FLAG` appears at lines 33, 262, 319, 346, 359. `COMPLEXITY_FLAG` appears at lines 415, 420, 469, 535, 574, 616. Both resolve to the same string.
- **Affected surface hints:** ["query-router.vitest.ts"]
- **Recommendation:** Drop the duplicate at line 415 and reuse `FEATURE_FLAG` throughout, or rename line 33 to `COMPLEXITY_FLAG` for consistency with the new test blocks. Either way, keep one binding.

#### P2-023 [P2] Duplicated `setEnv`/`restoreEnv` helpers across test files

- **File:** query-router.vitest.ts:37-57, routing-telemetry-stress.vitest.ts:23-35
- **Evidence:** Both files define identical `function setEnv(key, value: string | undefined)` and `function restoreEnv()` functions using the same `savedEnv: Record<string, string | undefined>` pattern. The same pattern also appears in `adaptive-fusion.vitest.ts:31-43` and `learned-combiner.vitest.ts:34-46`. A change to the env-save/restore contract (e.g., adding an allowlist) would require editing 4+ files.
- **Finding class:** class-of-bug
- **Scope proof:** Diff of `query-router.vitest.ts:37-57` vs `routing-telemetry-stress.vitest.ts:23-35` shows identical logic (variable names, object shape, iteration pattern). The only difference is one uses `const savedEnv` and the other uses `const savedEnv` — functionally identical.
- **Affected surface hints:** ["query-router.vitest.ts", "routing-telemetry-stress.vitest.ts", "adaptive-fusion.vitest.ts", "learned-combiner.vitest.ts"]
- **Recommendation:** Extract `setEnv`/`restoreEnv` into a shared test utility (e.g., `tests/helpers/env-test-utils.ts`) and import from all test files. This is a non-breaking extraction — the function signatures are already identical.

---

## Traceability Checks

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | n/a | Maintainability pass; deferred to traceability dimension (iter 4) |
| `checklist_evidence` | n/a | Maintainability pass |
| `resource_map_cross_check` | deferred | resource-map.md coverage gate belongs to traceability dimension |

---

## Verdict: CONDITIONAL (hasAdvisories=true)

No P0 or P1 findings. Seven P2 advisories across documentation gaps (4), clarity issues (2), and code duplication (1). The implementation is mechanically sound — functions are well-structured, error handling is consistent (silent-swallow), and no dead code exists. The findings are primarily documentation debt: JSDoc gaps on exported functions and a stale module header that would mislead a first-time reader.

The test code has two instances of duplicated constants and helpers that would benefit from consolidation but do not affect correctness.

---

## Next Dimension

All 4 dimensions are now covered:
- [x] Correctness (iter 2) — CONDITIONAL
- [x] Security (iter 3) — PASS
- [x] Traceability (iter 4) — completed
- [x] Maintainability (iter 5) — CONDITIONAL

Remaining iterations (6-10) are available for deep-replay, adversarial review, and final synthesis per the iteration plan in `deep-review-strategy.md`.
