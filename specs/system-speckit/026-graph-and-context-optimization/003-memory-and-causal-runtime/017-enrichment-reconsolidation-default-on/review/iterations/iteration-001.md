# Iteration 1 — correctness — e081-classification

**Dispatch:** `gpt-5.5-fast` (variant high) via cli-opencode. dispatchOk: true (real verdict returned).

**Verdict:** FAIL

**Scope:** memory_save error classification (commit c0bb8aefd6) — verify every reachable failure in `handleMemorySave` returns a CLASSIFIED `createMCPErrorResponse` (E085/E086/E087/E088/E089) and that no reachable bare `throw new Error(...)` escapes to the dispatcher's generic E081 catch-all. Files reviewed: `handlers/memory-save.ts`, `handlers/save/response-builder.ts`.

## Findings

- **[P1] Pre-index validation/setup failures can still escape handleMemorySave unclassified** — `handlers/memory-save.ts` (line ~2916)
  - Evidence: Line 2916 calls `const validatedPath: string = validateFilePathLocal(file_path);`; `validators.ts` lines 123-129 throw `new Error('Access denied: ...')`, and this happens before the only broad index try/catch at lines 3308-3345.
  - Recommendation: Wrap the pre-index setup block (including `checkDatabaseUpdated`, `validateFilePathLocal`, `resolveCanonicalPath`, `requireDb`, and governance runtime setup) and return `createMCPErrorResponse` with E089 for validation/path failures and E087/E088 for DB failures.

- **[P1] Handler-produced error results still classify to E081** — `handlers/save/response-builder.ts` (line ~521)
  - Evidence: Line 521 returns `return 'E081';`; reachable IndexResult errors include memory-save.ts lines 679-692 (`status: 'error'` with `error: args.message ?? \`Save-time reconsolidation failed: ${args.failure.reason}\``) and line 2647 passing `Save aborted before commit: candidate_changed`, which matches none of `classifySaveErrorCode`'s E085-E089 patterns.
  - Recommendation: Add classification coverage for all handler-produced `status='error'` messages, especially save-time reconsolidation and predecessor/supersede failures, mapping them to E088 or a deliberate non-E081 classified code.

- **[P1] Rejected save failures bypass classified error responses entirely** — `handlers/save/response-builder.ts` (line ~584)
  - Evidence: Lines 584-587 handle `if (result.status === 'rejected')` by returning `createMCPSuccessResponse({ tool: 'memory_save', ... })`; reachable rejected results are produced for quality/template/sufficiency failures, e.g. memory-save.ts lines 2176-2193 and 2203-2221.
  - Recommendation: If rejected saves are considered failures under this contract, return `createMCPErrorResponse` with a classified code (likely E089 for validation/quality/template/sufficiency rejections) while preserving rejection details in `data`.
