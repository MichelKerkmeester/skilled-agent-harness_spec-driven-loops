# Iteration 004 - Maintainability

Focus: save sub-handler decomposition, transaction boundaries, and whether existing findings duplicate broader maintainability problems.

## Files Reviewed

| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md` | Save package topology and boundaries |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | Atomic file promotion and rollback flow |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Record creation and index writes |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | Embedding cache/provider path |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | Reconsolidation and checkpoint-gated path |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | Enrichment lanes and retry handling |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Response envelopes and post-mutation feedback |

## Result

No new maintainability findings.

The decomposed `handlers/save/` package has clear stage ownership and the README accurately describes the dependency direction. The write path keeps storage mutations in concrete stages, with response formatting isolated in `response-builder.ts`. The top-level save handler is still large, but the code under direct review already pushes most specialized work into focused modules.

The existing active findings are not just style issues:

- F001 is a missing invalidation edge in the update mutation surface.
- F002 is predicate drift between dry-run reporting and apply mutation.
- F003 is operator contract drift between docs and live schema.
- F004 is a small public-option cleanup.

## Test Gaps Noted

- Entity-density integration coverage exercises direct invalidation, save, and bulk-delete, but not `memory_update`.
- Success-vector coverage tests currently miss the rowid-present/dimension-missing success case.
- Reconcile docs/schema parity is not guarded by a targeted test.

Review verdict: PASS
