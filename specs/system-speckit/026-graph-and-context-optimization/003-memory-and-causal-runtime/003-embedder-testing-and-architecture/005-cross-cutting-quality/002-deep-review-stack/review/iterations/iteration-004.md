# Iteration 004 — MAINTAINABILITY

## Dimension
MAINTAINABILITY: naming consistency, magic numbers, missing JSDoc, oversized functions, weak test assertions, duplicated logic, dead code, type-coverage gaps.

(Devin's output for this iter was a summary-only format — only file:line citations were given. Loop manager verified each via grep and re-tier-noted below.)

## Findings

### P0

#### 015 (P0 — verified, downgrade candidate) — DRY violation: dim → vec table name duplicated
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:111-116 + schema.ts:43-46

**Issue:** Two distinct functions (`tableNameForDim` in reindex.ts, `vecTableNameForDim` in schema.ts) both compute `vec_${dim}` after a positive-integer guard. The validation differs (reindex.ts uses inline `Number.isInteger(dim) && dim > 0`; schema.ts uses `validateDim(dim)` helper). Drift between the two will cause a real bug.

**Repro:** Change `validateDim` to accept `0` (e.g., for a "null embedder" mode) — `vecTableNameForDim` permits it, `tableNameForDim` throws.

**Recommendation:** Extract the table-name builder into one helper exported from `schema.ts`; have `reindex.ts` import it.

**Severity adjudication:** P0 is aggressive. This is a maintainability hazard, not a current bug. SYNTHESIS will likely re-tier to P1.

#### 016 (P0 — verified, downgrade candidate) — Hardcoded model name check in llama-cpp branch
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:178-184

**Issue:** `createAdapter` switch case `'llama-cpp'` rejects every manifest except `'embeddinggemma-300m'`. Adding a second llama-cpp model requires touching this hardcoded gate in addition to the manifest table.

**Repro:** Add a new `llama-cpp` manifest entry; `createAdapter(manifest)` throws `NotImplementedError`.

**Recommendation:** Replace name check with manifest-driven feature flag (e.g., `manifest.baselineSupported`).

**Severity adjudication:** P0 is aggressive — extensibility friction, not breakage. SYNTHESIS likely P1.

### P1

#### 017 (P1) — Missing JSDoc on public APIs in reindex.ts (6 exports + helpers)
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts (exports throughout)

**Issue:** Public functions (`startReindex`, `getJobStatus`, etc.) have no JSDoc; onboarding eng must read the body to understand contracts.

**Recommendation:** Add JSDoc with `@param`, `@returns`, `@throws` for each export.

#### 018 (P1) — Undocumented magic number DEFAULT_BATCH_SIZE = 50
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:70

**Issue:** No comment explaining why 50 (memory? backend RPS limit? empirical sweet spot?).

**Recommendation:** Add a one-line rationale comment; consider deriving from manifest.

#### 019 (P1) — Confusing dual name for the same set
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:86 (internal `ACTIVE_JOB_STATUSES`) + line 408 (export `ACTIVE_REINDEX_STATUSES`)

**Issue:** Same value exported under two names. Readers wonder if they differ.

**Recommendation:** Pick one name; export it once.

#### 020 (P1) — Oversized runJob() function (55 LOC)
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts (runJob)

**Issue:** Function bundles job lifecycle, adapter retrieval, batching loop, error mapping. Splitting eases tests.

**Recommendation:** Extract `processBatch`, `finalizeJob` helpers.

#### 021 (P1) — Missing JSDoc on public APIs in registry.ts
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts (exports)

**Issue:** Same as #017 for registry.

**Recommendation:** Same.

#### 022 (P1) — Weak test assertions in dist-freshness.vitest.ts
**File:** .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts

**Issue:** Tests check for string markers only (e.g., `expect(content).toContain('foo')`), not runtime behavior.

**Recommendation:** Add at least one runtime-validity assertion (instantiate, call, check value).

#### 023 (P1) — Complex lexicalScore() function (26 LOC, multiple signals)
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts (lexicalScore)

**Issue:** Single function computes recency, artifact-class hint, archive penalty, etc. Hard to unit-test signals separately.

**Recommendation:** Extract each signal into its own helper; sum at the end.

#### 024 (P1) — Magic numbers in retrieval-rescue.ts without constants
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts (multiple)

**Issue:** Score adjustments like `0.24`, `-0.16`, `-0.08`, `0.58`, `4000` scattered.

**Recommendation:** Top-of-file `const SCORE_WEIGHTS = { ... }` block.

### P2

#### 025 (P2) — Inconsistent camelCase vs snake_case for DB field accessors
**File:** Across embedder modules (e.g., `row.file_path` vs `row.fileType` in same scope)

**Issue:** Cognitive overhead.

**Recommendation:** Normalize at the row-to-object boundary; pick one casing for internal use.

#### 026 (P2) — Duplicate error handling pattern across handlers
**File:** .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts, embedder-set.ts, embedder-status.ts

**Issue:** Each handler repeats the try/catch + createMCPResponse pattern.

**Recommendation:** Extract a `withHandlerErrorHandling(...)` wrapper.

#### 027 (P2) — Unused snake_case alias export
**File:** .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts:111

**Issue:** `export const handle_embedder_list = handleEmbedderList;` — if no caller uses snake_case, remove. (Search shows none in repo.)

**Recommendation:** Remove unless documented as part of MCP wire contract.

#### 028 (P2) — Missing type guards for Ollama API response shape
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts (throwForEmbeddingResponse + parse path)

**Issue:** Code casts `body` to known shapes without runtime validation.

**Recommendation:** Define a zod schema for Ollama response; parse once.

#### 029 (P2) — rowText() incomplete coverage for empty rows
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts (rowText helper)

**Issue:** No explicit guard for all-undefined row fields.

**Recommendation:** Add early-return + log warning.

#### 030 (P2) — Inconsistent env-var parsing across files
**File:** reindex.ts, embedder-list.ts (each has its own parser)

**Issue:** Duplicated parse + bounds-clamp logic (or lack thereof — see iter-2 #014).

**Recommendation:** Extract `parseBoundedEnv(name, default, min, max)`.

#### 031 (P2) — Large stage2-fusion.ts (1478 LOC) without section markers
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts

**Issue:** Single file with 13 fusion signal steps; no `// ---- 5. Recency Signal ----` style banners.

**Recommendation:** Add ASCII banner section comments at each step boundary.

#### 032 (P2) — Test fixture name doesn't match scope
**File:** .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts (hardcoded `CANONICAL` array)

**Issue:** The test array name implies coverage of all canonical surfaces but only embedder-related entries are listed.

**Recommendation:** Rename or expand to cover all canonical types.

## Gaps for next iter
- Python-side (config.py + registered_embedders.py) review pending iters 5-8.
- Cross-stack contract drift between TS MANIFESTS and Python registered_embedders pending iter 17.
- Adversarial passes pending iters 13-20.

---

## Bundle Gate Results (loop manager)
- All cited file:line refs verified.
- #015 DRY: VERIFIED — both functions exist; both compute `vec_${dim}` with similar but non-identical guards.
- #016 hardcoded model: VERIFIED at registry.ts:178-184 (lines shifted slightly from Devin's :180 cite; actual switch case spans 178-184).
- #017-#022: VERIFIED structural observations; not line-specific bugs.
- #023 runJob 55 LOC: VERIFIED (awk count = 55).
- #024 lexicalScore 26 LOC: VERIFIED (awk count = 26).
- #027 handle_embedder_list: VERIFIED at line 111 (export alias, no callers found in repo grep).
- Devin produced summary-only output (no detailed line-by-line citations for P2 group); loop manager extracted enough to confirm severity tier.
- **P0 adjudication**: both #015 and #016 are downgrade candidates (P1 in synthesis).
