---
title: "Iter 5 — P1-Group-4 Architecture (commit ba6816a49 re-review)"
iter_number: 5
dimension: p1-group-4-architecture
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ba6816a490b1a20d4f74135179c10096c5348921
---

# Iter 5 — P1-Group-4 Architecture

## 1. SCOPED ANGLE

Re-review of commit `ba6816a49` claims to close P1-Group-4 "Architecture / DRY" with two changes: (1) registry.ts gate removal for llama-cpp backend, (2) tableNameForDim deduplication. This iteration verifies the architectural soundness of these changes and identifies any unaddressed sub-findings or new risks.

## 2. REFERENCES READ

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` (189 LOC) — full read to confirm gate removal and MANIFESTS registry
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` (410 LOC) — confirmed tableNameForDim deletion and vecTableNameForDim import
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts` (136 LOC) — confirmed vecTableNameForDim export visibility change
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` (461 LOC) — analyzed LlamaCppProvider singleton runtime model
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-deep-review-stack/review/review-report.md` (282 LOC) — read §4 P1-Group-4 to identify all sub-findings
- Git diff for commit ba6816a49 (registry.ts, reindex.ts, schema.ts) — confirmed exact changes

## 3. FINDINGS

### Probe 1 — registry.ts gate removal callers

**Change confirmed:** The hardcoded gate was removed from registry.ts:179-180. The diff shows deletion of:
```typescript
if (manifest.name !== 'embeddinggemma-300m') {
  throw new NotImplementedError(manifest.backend);
}
```
Now ANY manifest with `backend: 'llama-cpp'` returns `new LlamaCppBaselineAdapter(manifest)`.

**MANIFESTS registry analysis:** registry.ts:29-93 contains exactly ONE entry with `backend: 'llama-cpp'`:
- Line 30-36: `embeddinggemma-300m` (dim: 768, backend: 'llama-cpp')

**Test coverage:** Grep across `.opencode/skills/system-spec-kit/` and `.opencode/skills/system-skill-advisor/` found NO tests asserting the NotImplementedError throw for llama-cpp. No stale tests exist.

**Architectural concern:** The gate removal allows FUTURE manifests with `backend: 'llama-cpp'` to silently bind to LlamaCppBaselineAdapter. Today only embeddinggemma-300m exists, but the architectural guard is now absent.

### Probe 2 — tableNameForDim dedupe callers

**Change confirmed:** reindex.ts:111-116 deleted local `tableNameForDim` function (5 lines including validation). reindex.ts:15 now imports `vecTableNameForDim` from schema.ts, and reindex.ts:259 calls `vecTableNameForDim(initialJob.toDim)`.

**Orphan check:** Grep for `tableNameForDim` (without `vec` prefix) across `.opencode/skills/system-spec-kit/mcp_server/` returned ZERO matches. No orphans exist.

**Export visibility:** schema.ts:43 changed from `function vecTableNameForDim` to `export function vecTableNameForDim`. This is appropriate — the function is a pure helper with no side effects, and reindex.ts is within the same module boundary. Other local helpers in schema.ts (e.g., `validateDim`, `ensureVecMetadataTable`, `readActivePointerRows`) remain intentionally non-exported as they are implementation details.

**Verdict:** The deduplication is clean and safe.

### Probe 3 — Other P1-Group-4 sub-findings (status table)

From review-report.md §4 P1-Group-4, THREE sub-findings existed:

| Sub-finding | Description | Status in ba6816a49 |
|-------------|-------------|---------------------|
| #1 | `registry.ts:178-184` — hardcoded 'embeddinggemma-300m' gate for llama-cpp backend | ✅ ADDRESSED — gate removed |
| #2 | `stage2-fusion.ts` approaching god-module size at 1478 LOC | ❌ NOT ADDRESSED — no changes to stage2-fusion.ts in this commit |
| #3 | Duplicate `tableNameForDim` / `vecTableNameForDim` between reindex.ts:111-116 and schema.ts:43-46 | ✅ ADDRESSED — deduplicated via import |

**Finding:** P1-Group-4 sub-finding #2 (stage2-fusion.ts god-module size) remains unaddressed and is still an open P1 architectural concern.

### Probe 4 — LlamaCppBaselineAdapter assumptions

**Adapter implementation:** LlamaCppBaselineAdapter (registry.ts:103-137) is a thin wrapper that:
- Stores manifest fields: name, dim, prefixQuery, prefixDocument
- Calls `generateEmbedding(text)` from shared embeddings provider (line 120)
- Validates embedding dimension matches manifest.dim (lines 124-128)
- Checks `isModelLoaded()` and `getEmbeddingDimension()` from shared provider (line 135)

**Provider singleton constraint:** The underlying llama-cpp provider (llama-cpp.ts) uses a GLOBAL singleton runtime:
- Line 76: `let cachedRuntime: LlamaCppRuntimeState | null = null;`
- Lines 210-212: Runtime is cached by modelPath; only ONE model loaded at a time
- Lines 304-306: Constructor reads modelPath from options, env vars, or DEFAULT_MODEL_PATH (hardcoded to embeddinggemma-300m)

**Architectural mismatch:** LlamaCppBaselineAdapter assumes the underlying llama-cpp provider is configured for the specific manifest. However, the provider is a singleton that loads ONE model globally. If a non-embeddinggemma llama-cpp manifest were added to MANIFESTS, the adapter would:
1. Instantiate successfully (no gate to block it)
2. Call `generateEmbedding()` which uses the globally-loaded model (likely still embeddinggemma-300m)
3. Potentially produce wrong embeddings or fail silently if dimensions mismatch

**Runtime failure mode:** The adapter's dimension check (registry.ts:124-128) would catch a dimension mismatch and throw a loud error. However, if a future llama-cpp model happens to also be 768-dimensional, the check would pass but embeddings would be from the wrong model — silent corruption.

**Current state:** Since only embeddinggemma-300m exists in MANIFESTS today, this is a FUTURE risk, not a current bug. The removed gate was protecting against this architectural mismatch.

### NEW P0/P1/P2 findings

**P1 — Unaddressed P1-Group-4 sub-finding #2**
- **File:** `stage2-fusion.ts` (not modified in ba6816a49)
- **Issue:** stage2-fusion.ts is approaching god-module size at 1478 LOC (per review-report.md §4 P1-Group-4). This commit did NOT address this architectural concern.
- **Severity:** P1 — maintainability/onboarding pain
- **Evidence:** review-report.md:142; git diff shows no stage2-fusion.ts changes in ba6816a49

**P2 — Architectural risk from llama-cpp gate removal**
- **File:** `registry.ts:179-180`
- **Issue:** Removing the hardcoded gate allows future llama-cpp manifests to silently bind to LlamaCppBaselineAdapter, but the underlying llama-cpp provider is a singleton that loads only one model globally. This creates a runtime mismatch risk if multiple llama-cpp models are registered.
- **Severity:** P2 — future risk, not a current bug (only embeddinggemma-300m exists today)
- **Evidence:** registry.ts:179-180 (gate removed); llama-cpp.ts:76 (singleton runtime); llama-cpp.ts:304-306 (hardcoded DEFAULT_MODEL_PATH for embeddinggemma-300m)
- **Mitigation:** The dimension check at registry.ts:124-128 provides a loud failure mode for dimension mismatches, but same-dimension models would silently corrupt.
- **Recommendation:** Either (a) restore the gate with a more permissive check (e.g., validate manifest.modelPath matches the provider's loaded model), or (b) document that llama-cpp backend is single-model-only and future manifests must use a different backend.

## 4. POSITIVE OBSERVATIONS

1. **Clean deduplication:** The tableNameForDim → vecTableNameForDim deduplication is well-executed. No orphan functions, appropriate export visibility, and correct import usage.

2. **No stale tests:** Grep confirmed no tests asserted the NotImplementedError throw for llama-cpp, so the gate removal does not break existing test coverage.

3. **Dimension safety net:** LlamaCppBaselineAdapter's dimension check (registry.ts:124-128) provides a loud failure mode if a future llama-cpp manifest has a different dimension than the globally-loaded model.

4. **Current MANIFESTS consistency:** Only one llama-cpp manifest exists (embeddinggemma-300m), so the architectural mismatch is a future risk, not a current defect.

## 5. JSONL DELTA ROW

```json
{"ts":"2026-05-17T21:33:22Z","event":"iter_complete","iter":5,"dimension":"p1-group-4-architecture","p0_count":0,"p1_count":1,"p2_count":1,"refs_read_count":6,"llama_cpp_callers":2,"orphan_table_name_for_dim":0,"verdict_so_far":"PARTIAL — 2/3 P1-Group-4 sub-findings addressed; stage2-fusion.ts god-module (P1) remains; architectural risk from gate removal (P2) noted"}
```

