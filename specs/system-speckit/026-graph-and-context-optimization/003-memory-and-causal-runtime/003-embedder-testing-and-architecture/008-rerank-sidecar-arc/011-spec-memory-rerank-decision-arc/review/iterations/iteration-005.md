# Iteration 005: Correctness Edge Cases and Error Paths

## Dimension
**Correctness (re-pass: edge cases + error paths)**

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:1-325`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:1-558`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:1-674`
- `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:1-108`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:1-226`

## Findings by Severity

### P1 Findings

#### P1-001 [P1] TypeError vulnerability when env vars are null/undefined
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:105-106,121-122`
- **Evidence:** Both `isCrossEncoderEnabled()` (lines 103-109) and `isRerankerExpected()` (lines 120-126) call `.trim()` on `process.env.VOYAGE_API_KEY` and `process.env.COHERE_API_KEY` without null checks. If these environment variables are `undefined` or `null`, calling `.trim()` will throw `TypeError: Cannot read properties of undefined (reading 'trim')`, crashing the MCP server on startup.
- **Finding class:** instance-only
- **Scope proof:** The vulnerable pattern appears in exactly two functions: `isCrossEncoderEnabled()` and `isRerankerExpected()`. Grep confirms these are the only consumers of the vulnerable pattern in this file.
- **Affected surface hints:** ["isCrossEncoderEnabled", "isRerankerExpected", "env var validation"]
- **Recommendation:** Add null checks before calling `.trim()`: `if (process.env.VOYAGE_API_KEY?.trim())` or use optional chaining: `process.env.VOYAGE_API_KEY?.trim() ?? ''`.

### P2 Findings

#### P2-001 [P2] Confusing opt-in validation only accepts 'true' or '1'
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:103`
- **Evidence:** `isOptInEnabled()` (lines 21-24) only accepts literal strings `'true'` or `'1'` (case-insensitive). Invalid values like `'TRUE'`, `'yes'`, `'1.0'`, empty string, or whitespace-only strings are treated as `false`. While this fails closed (safe), it creates confusing operator behavior where `SPECKIT_CROSS_ENCODER='yes'` appears to enable the feature but does not.
- **Finding class:** instance-only
- **Scope proof:** `isOptInEnabled()` is a helper function used by multiple flags, but the confusing validation only affects opt-in flags like `SPECKIT_CROSS_ENCODER` and `SPECKIT_RECONSOLIDATION_ENABLED`.
- **Affected surface hints:** ["isOptInEnabled", "env var parsing", "operator experience"]
- **Recommendation:** Either expand validation to accept common truthy values (`'yes'`, `'on'`, `'enabled'`) or document the exact accepted values in function docstrings.

#### P2-002 [P2] Test isolation issue with ORIGINAL_ENV capture timing
- **File:** `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:66-68`
- **Evidence:** `ORIGINAL_ENV` capture happens outside the `describe` block (lines 66-68), meaning it runs once before all tests. If a test modifies environment variables and throws an error before calling `restoreRerankerEnv()` (lines 23-31), subsequent tests will see the modified environment state, causing test isolation failures.
- **Finding class:** test-isolation
- **Scope proof:** This pattern is specific to this test file. The `afterEach` hook (lines 62-64) attempts to restore, but if a test throws before reaching its cleanup, the state is corrupted.
- **Affected surface hints:** ["test isolation", "env var mocking", "vitest hooks"]
- **Recommendation:** Move `ORIGINAL_ENV` capture inside a `beforeEach` hook to ensure each test starts with a fresh baseline, or add a `beforeEach` that calls `resetRerankerEnv()` to guarantee clean state.

#### P2-003 [P2] Model name mismatch requires explicit env var configuration
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:54`
- **Evidence:** The local provider hardcodes model name `'cross-encoder/ms-marco-MiniLM-L-6-v2'` (line 54), but the sidecar defaults to `'Qwen/Qwen3-Reranker-0.6B'` (rerank_sidecar.py:28). The ms-marco model must be explicitly added to `RERANK_ALLOWED_MODELS` env var or the local reranker will fail with HTTP 400 error ("model not in allowlist"). This creates a configuration gap where the code assumes a model that isn't available by default.
- **Finding class:** cross-consumer
- **Scope proof:** The model name in cross-encoder.ts:54 is consumed by rerankLocal() (line 408) which calls the sidecar endpoint. The sidecar validates against ALLOWED_MODELS (rerank_sidecar.py:42,104).
- **Affected surface hints:** ["local reranker", "sidecar allowlist", "model configuration"]
- **Recommendation:** Either (a) update cross-encoder.ts:54 to use the sidecar's default model, or (b) document that `RERANK_ALLOWED_MODELS` must include `'cross-encoder/ms-marco-MiniLM-L-6-v2'` for local reranking to work.

## Traceability Checks
- **spec_code:** Not applicable - this is a correctness review, not a spec implementation review
- **checklist_evidence:** Not applicable - no checklist-based verification in this iteration

## Verdict
**CONDITIONAL** - 1 P1 finding (TypeError crash risk) + 3 P2 findings. The P1 is a correctness bug that can crash the MCP server on startup when environment variables are unset. The P2s are non-blocking but represent confusing operator behavior and configuration gaps.

## Next Dimension
**Maintainability** - Review code structure, duplication, and long-term maintenance considerations in the rerank decision arc implementation.
