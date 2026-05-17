# Iteration 001 — CORRECTNESS

## Dimension
CORRECTNESS: null/undefined safety, off-by-one, race conditions, swallowed errors, wrong default values, inconsistent return types, missing fallbacks, broken Promise chains, incorrect type narrowing, hash/cache key collisions, dimension/vector size mismatches, retry budget exhaustion, infinite loops, dead branches.

## Findings

### P0

#### 001 (P0) — setActiveEmbedder writes wrong default values on initial insert
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:112-115

**Issue:** The `INSERT OR IGNORE` statement in `setActiveEmbedder` uses `DEFAULT_ACTIVE_EMBEDDER.name` and `DEFAULT_ACTIVE_EMBEDDER.dim` instead of the actual `trimmedName` and `dim` parameters. This means the first time a row is inserted (when the key doesn't exist), it writes the default values instead of the intended values. The subsequent UPDATE then overwrites them, but if the UPDATE fails or is interrupted, the database is left with incorrect default values.

**Repro:**
1. Call `setActiveEmbedder(db, 'nomic-embed-text-v1.5', 768)` on a fresh database with no existing vec_metadata rows.
2. Query the vec_metadata table immediately after the INSERT OR IGNORE step (before UPDATE executes).
3. Observe that the values are `embeddinggemma-300m` and `768` (the defaults) instead of `nomic-embed-text-v1.5` and `768`.

**Recommendation:** Change the INSERT OR IGNORE values from `DEFAULT_ACTIVE_EMBEDDER.name` and `DEFAULT_ACTIVE_EMBEDDER.dim` to `trimmedName` and `String(dim)` respectively. This ensures the initial insert writes the correct values.

### P1

#### 002 (P1) — OllamaAdapter.embed signature violates EmbedderAdapter interface
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:189

**Issue:** The `OllamaAdapter.embed` method accepts a second optional parameter `options: OllamaEmbedOptions = {}`, but the `EmbedderAdapter` interface in adapter.ts:50 defines `embed(texts: ReadonlyArray<string>): Promise<Float32Array[]>` with only one parameter. This is a contract violation that could cause runtime errors if code calls `embed` via the interface type without the second parameter, or if other adapter implementations don't support this signature.

**Repro:**
1. Create an `EmbedderAdapter` typed reference to an `OllamaAdapter` instance.
2. Call `adapter.embed(['test'])` with only the texts parameter (per the interface).
3. TypeScript compiles successfully, but at runtime the OllamaAdapter implementation expects the second parameter.
4. While the default value handles this, it's still a type safety violation.

**Recommendation:** Either update the `EmbedderAdapter` interface to include the optional `options` parameter, or remove the `options` parameter from `OllamaAdapter.embed` and handle input type determination through a different mechanism (e.g., a separate method or instance configuration).

#### 003 (P1) — Document type typo in documentHintScore prevents decision record matching
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:177

**Issue:** The code checks `docType === 'decision record'` (with a space), but the `DOCUMENT_HINTS` array at line 46 uses `'decision_record'` (with an underscore), and the database likely stores underscore variants. This typo means the artifact class hint for decision records will never match, resulting in missed scoring opportunities.

**Repro:**
1. Query with artifact class containing 'decision' and a row with `document_type = 'decision_record'`.
2. The condition at line 177 checks `docType === 'decision record'` (space).
3. Since `normalizeText('decision_record')` returns 'decision record' but the comparison is against the literal string 'decision record' with a space, and the actual docType after normalization is 'decisionrecord' (spaces removed), the match fails.
4. The score boost of 0.24 is never applied.

**Recommendation:** Change the comparison from `docType === 'decision record'` to check if the normalized docType includes 'decision' or use the same normalization logic as the DOCUMENT_HINTS types mapping.

#### 004 (P1) — Regex escape bug in archive penalty check
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:197

**Issue:** The regex `/\\bz_archive\b/` uses a double-escaped backslash, which in the actual regex becomes `\bz_archive\b`. However, in the test() call on a string, this should be `/\bz_archive\b/` (single backslash in the regex literal) or the string should contain the actual backslash. The current code may not correctly match word boundaries as intended.

**Repro:**
1. Create a row with `file_path = 'some/path/z_archive/file.ts'`.
2. Call `lexicalScore` with a query that doesn't include 'archive'.
3. The regex test at line 197 may fail to match due to incorrect escaping.
4. The archive penalty of -0.16 is not applied when it should be.

**Recommendation:** Fix the regex to `/\bz_archive\b/` (single backslash in the regex literal) for proper word boundary matching, or verify the actual string content being tested against.

### P2

#### 005 (P2) — Fire-and-forget enqueueJob has edge case with finally cleanup
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:242-249

**Issue:** The `enqueueJob` function uses `void runJob(db, jobId).finally(() => { runningJobs.delete(jobId); })`. If `runJob` throws synchronously before the promise is created (e.g., during the initial `selectJob` call), the finally block may not execute, leaving the jobId in `runningJobs` forever. This is a minor edge case since most errors in `runJob` are async.

**Repro:**
1. Modify `selectJob` to throw a synchronous error instead of returning null.
2. Call `enqueueJob(db, jobId)`.
3. The error throws before the promise is created.
4. The finally block never executes, and `runningJobs` still contains the jobId.
5. Subsequent calls to `enqueueJob` for the same job return early without executing.

**Recommendation:** Wrap the `runningJobs.add(jobId)` call in a try-finally block outside the promise chain, or move it before the async call to ensure cleanup happens even on synchronous errors.

#### 006 (P2) — Redundant Math.floor on already-integer maxInputChars
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:234

**Issue:** The code calls `Math.floor(this.maxInputChars)` on line 234, but `maxInputChars` comes from the manifest which is already typed as `number` and should be an integer. The Math.floor is redundant and suggests the type definition might be incorrect or there's missing validation.

**Repro:**
1. Create a manifest with `maxInputChars: 5000` (an integer).
2. Call `prepareInput` with a long text.
3. The Math.floor call on line 234 operates on an already-integer value.
4. No functional bug, but indicates potential type safety issue.

**Recommendation:** Remove the redundant Math.floor call, or add validation in the manifest/schema to ensure maxInputChars is always an integer.

#### 007 (P2) — SQL construction using string interpolation (defense-in-depth)
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:276-278

**Issue:** The `fetchLexicalBackfillRows` function constructs SQL clauses using string interpolation with `tokens.map(() => \`...\`)`. While the tokens are normalized through `queryTokens` which only allows alphanumeric characters, this construction pattern is fragile and could be vulnerable if the normalization logic changes. Parameterized queries would be safer.

**Repro:**
1. Call `fetchLexicalBackfillRows` with a query containing special characters.
2. The tokens are normalized, so current implementation is safe.
3. However, if `queryTokens` is modified to allow other characters, SQL injection becomes possible.
4. The current implementation relies on implicit security through normalization.

**Recommendation:** Refactor to use parameterized queries with proper placeholder binding instead of string interpolation, even though the current normalization makes it safe.

## Gaps for next iter
- **SECURITY dimension**: Review SQL construction patterns, input validation, and potential injection vectors across the embedder stack
- **PERFORMANCE dimension**: Analyze the reindex batching strategy, adapter embed() call patterns, and rescue layer query efficiency
- **RELIABILITY dimension**: Examine error handling, retry logic, and transaction boundaries in the reindex orchestrator
- **ollama.ts adapter**: Deeper review of HTTP error handling, retry policies, and timeout configuration
- **registry.ts LlamaCppBaselineAdapter**: Review the hardcoded embeddinggemma-300m check and potential extension points for other llama-cpp models


---

## Bundle Gate Results (loop manager)
- All file paths exist (Check 1 PASS).
- P0 #001 schema.ts:112-115: VERIFIED — INSERT OR IGNORE uses DEFAULT_ACTIVE_EMBEDDER.name/dim instead of trimmedName/dim.
- P1 #002 ollama.ts:189 vs adapter.ts:50: VERIFIED — OllamaAdapter.embed has 2nd param `options` not in EmbedderAdapter interface.
- P1 #003 retrieval-rescue.ts:177: VERIFIED — code compares `docType === 'decision record'` (space) but DOCUMENT_HINTS use 'decision_record' (underscore); types map back to underscore form throughout. The literal-string comparison will never match.
- P1 #004 retrieval-rescue.ts:197: FALSE-POSITIVE — actual source uses single-backslash `/\bz_archive\b/` correctly; Devin misread as double-backslash. Downgraded to NOT-A-BUG.
- P2 #005 reindex.ts:241-249: VERIFIED — fire-and-forget pattern with runningJobs delete only in `.finally()` of the promise; if `runJob` throws synchronously before promise creation, runningJobs leaks. (Pre-existing risk; selectJob currently does not throw sync.)
- P2 #006 ollama.ts:234: PARTIALLY VERIFIED — Math.floor on `maxInputChars?: number` (optional) is harmless defense; not strictly a bug.
- P2 #007 retrieval-rescue.ts:272-278: VERIFIED — string interpolation pattern in SQL clause; currently safe via queryTokens normalization at line 81.
