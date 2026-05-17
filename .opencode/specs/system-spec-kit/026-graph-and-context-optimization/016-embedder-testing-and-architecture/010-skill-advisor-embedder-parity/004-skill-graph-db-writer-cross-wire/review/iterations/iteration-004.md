---
title: "Iter 4 — observability (commit c0ec765f4 post-impl review)"
iter_number: 4
dimension: observability
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: c0ec765f4
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — 1124 lines total; read imports at lines 1-120 and refresh/load region at lines 730-989.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` — 201 lines total; read entire file.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — 107 lines total; read entire file.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — 121 lines total; read entire file.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — 22 lines total; read entire file.

## 2. observability CLAIMS

1. The dispatcher has two observability paths: pointer set goes to the adapter helper, pointer unset goes to the legacy helper. Evidence: `refreshSkillEmbeddings()` branches on `hasActiveEmbedderPointer(database)` and returns `refreshSkillEmbeddingsViaAdapter(...)` or `refreshSkillEmbeddingsLegacy(...)` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:788-795`.

2. Per-row embedding failures are consistently surfaced through both return data and console logs in both paths. Adapter failures increment `failed`, delete the stale vec row, push `EMBEDDING-FAILED` into `warnings`, and call `console.warn` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:891-898`. Legacy failures increment `failed`, clear/update the legacy columns, push `EMBEDDING-FAILED`, and call `console.warn` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:962-968`.

3. `getAdapter()` returns `undefined` for an unknown manifest name, which is the direct trigger for the new adapter-unavailable early return. Evidence: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:85-89`.

4. The adapter-unavailable early return includes a returned warning but does not emit `console.warn`. The missing-manifest branch returns `warnings: ["ADAPTER-UNAVAILABLE: ..."]` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:806-814`, and the thrown-error branch does the same at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:817-824`; neither branch logs before returning.

5. The regression test verifies only the returned `warnings[]` signal for adapter-unavailable, not the console signal. Evidence: the test sets `definitely-not-a-real-embedder`, calls `refreshSkillEmbeddings()`, and asserts `result.warnings` contains `ADAPTER-UNAVAILABLE` at `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:169-180`.

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

- P2 — `ADAPTER-UNAVAILABLE` is returned but not logged, so CLI/operator observability is inconsistent with other refresh failures.
  - Reproduction evidence: configure an active pointer to an unknown manifest as the test does with `setActiveEmbedder(getDb(), 'definitely-not-a-real-embedder', 1024)` at `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:169-175`.
  - `getAdapter()` returns `undefined` for that name at `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:85-89`.
  - `refreshSkillEmbeddingsViaAdapter()` then returns `{ embedded: 0, skipped: 0, failed: 0, warnings: ["ADAPTER-UNAVAILABLE: ..."] }` without a `console.warn` call at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:806-814`.
  - The thrown `getAdapter()` path also returns an `ADAPTER-UNAVAILABLE` warning without `console.warn` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:817-824`.
  - This differs from both adapter and legacy per-row failures, which push the warning and call `console.warn` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:895-898` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:966-968`.
  - Impact: automated callers see `warnings[]`, but manual refresh runs can appear as a quiet no-op in terminal logs when the active embedder cannot be resolved.

## 4. FINDINGS COUNTS

- P0: 0
- P1: 0
- P2: 1

## 5. GAPS FOR NEXT ITER

- Static review only; no runtime command was executed to capture actual stderr/stdout behavior.
- Potential follow-up outside this dimension: malformed active pointer observability. `hasActiveEmbedderPointer()` checks only the name key at `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:47-55`, while `getActiveEmbedder()` silently falls back to `DEFAULT_ACTIVE_EMBEDDER` if the dim is missing/invalid at `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:84-94`.
- Test coverage currently confirms returned warnings for adapter-unavailable, but not console logging, at `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:175-180`.

## 6. JSONL DELTA ROW
