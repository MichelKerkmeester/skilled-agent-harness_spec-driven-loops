# Deep Review Iteration 008

## Dimension

correctness -- feature_catalog claims vs real source (checkpoint-create 038, checkpoint-restore 040, front-proxy 189, schema-history 069, error-code 070, enrichment 162, sk-git 249)

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` -- severity doctrine loaded before final severity calls.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` -- assigned review-scope feature catalog files.
- `.opencode/skills/system-spec-kit/feature_catalog/05--lifecycle/038-checkpoint-creation-checkpointcreate.md:28` -- checkpoint-create catalog claims.
- `.opencode/skills/system-spec-kit/feature_catalog/05--lifecycle/040-checkpoint-restore-checkpointrestore.md:42` -- checkpoint-restore barrier and v2 restore claims.
- `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/069-schema-version-history-v28-v30.md:18` -- schema-history claims.
- `.opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/070-error-code-reference.md:30` -- error-code table claims.
- `.opencode/skills/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/162-post-insert-enrichment-marker.md:26` -- enrichment marker claims.
- `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/189-mcp-launcher-front-proxy.md:40` -- front-proxy replay/error-code claims.
- `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/249-sk-git-worktree-convention.md:26` -- sk-git worktree convention claims.
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3445` -- root feature catalog front-proxy summary.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:971` -- dir-aware v2 checkpoint pruning.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1023` -- vec_memories-only v2 selection gate.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2181` -- `createCheckpointV2` VACUUM snapshot path.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2489` -- `restoreCheckpointV2` whole-file swap path.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336` -- migrations v28-v30.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2802` -- restore barrier in `memory_save`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:302` -- restore barrier and scan coalescing in `memory_index_scan`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62` -- restore barrier in `memory_bulk_delete`.
- `.opencode/bin/lib/launcher-session-proxy.cjs:28` -- `REPLAYABLE_TOOL_NAMES` source.
- `.opencode/bin/mk-spec-memory-launcher.cjs:198` -- proxy bridge source.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126` -- `SPECKIT_BACKEND_ONLY` guard.
- `.opencode/skills/sk-git/SKILL.md:3` -- sk-git owns numbered worktree convention.
- `.opencode/skills/sk-git/references/shared_patterns.md:22` -- `wt/{NNNN}-{name}` branch and `.worktrees/{NNNN}-{name}` directory convention.

## Findings by Severity

### P0

- None.

### P1

- None.

### P2

#### R8-P2-001 [P2] Feature catalog labels the proxy replayable set as read-mostly even though `memory_save` is replayable

- File: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3445`
- Claim: The root catalog says the proxy "replays safe in-flight read-mostly requests (`REPLAYABLE_TOOL_NAMES`)".
- Evidence: The source `REPLAYABLE_TOOL_NAMES` set includes `memory_save` at `.opencode/bin/lib/launcher-session-proxy.cjs:33`, and `classifyFrame` returns true for any tool in that set at `.opencode/bin/lib/launcher-session-proxy.cjs:120` and `.opencode/bin/lib/launcher-session-proxy.cjs:126`. Destructive unsafe tools are separately excluded at `.opencode/bin/lib/launcher-session-proxy.cjs:43`, so the safety boundary is intact, but the catalog label is too narrow for the actual set.
- Counterevidence sought: The per-feature front-proxy entry uses example wording (`such as`) at `.opencode/skills/system-spec-kit/feature_catalog/14--pipeline-architecture/189-mcp-launcher-front-proxy.md:40`, and the unsafe tool set correctly excludes destructive mutations. That downgrades this from a blocking mismatch to a documentation precision advisory.
- Alternative explanation: `memory_save` may be intentionally replay-safe through dedup/idempotency, but then the root catalog should describe the set as replayable/idempotent rather than read-mostly.
- Final severity: P2.
- Confidence: 0.82.
- Downgrade trigger: Remove or downgrade if `memory_save` is removed from `REPLAYABLE_TOOL_NAMES`, or if the catalog wording is explicitly scoped as non-exhaustive examples rather than a label for the set.
- Recommendation: Change the root catalog phrase to "safe replayable/idempotent requests (`REPLAYABLE_TOOL_NAMES`)" and optionally call out that `memory_save` is intentionally replayable while destructive tools remain in `UNSAFE_TOOL_NAMES`.

## Traceability Checks

- `checkpoint_create_v2`: PASS. Catalog claims about v2 full-DB selection, `VACUUM main INTO`, optional `active_vec` snapshot, manifest, `snapshot_format='v2'`, and dir-aware pruning match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1023`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2217`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2220`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2263`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2279`.
- `checkpoint_restore_v2`: PASS. Catalog claims about restore barrier, schema/embedder guards, journal phases, post-restore rebuild, and barrier release match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2539`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2550`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2585`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2666`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`.
- `restore_barrier_consumers`: PASS. The three named mutating handlers check `checkpoints.getRestoreBarrierStatus()` before mutation at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2802`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:302`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62`.
- `schema_history_v28_v30`: PASS. `SCHEMA_VERSION = 30`, migrations v28/v29/v30, and fresh-DB DDL match `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1367`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1385`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2347`, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2551`.
- `error_code_reference`: PASS except the P2 replay wording above. `E429`, `-32001`, and `-32002` source anchors match `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:101`, `.opencode/bin/lib/launcher-session-proxy.cjs:18`, `.opencode/bin/lib/launcher-session-proxy.cjs:23`, and `.opencode/bin/lib/launcher-session-proxy.cjs:607`.
- `enrichment_marker`: PASS. Pending/result recording, status values, repair selection, and schema/index claims match `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:19`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:154`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:169`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2623`.
- `front_proxy`: PARTIAL/P2. Bridge, recycle, backend-only, retryable recycle, protocol mismatch, and terminal closed claims match source; only the root catalog's "read-mostly" set label is too narrow.
- `sk_git_worktree`: PASS. Catalog claims match `.opencode/skills/sk-git/SKILL.md:3` and `.opencode/skills/sk-git/references/shared_patterns.md:22`.
- `code_graph`: BLOCKED. `code_graph_status` reported stale readiness because git HEAD changed and stale/deleted thresholds were exceeded; this pass used graphless fallback with direct reads and exact searches.

## Scope Violations

- None. No reviewed source files, shared state log, registry, or strategy files were modified.

## Verdict

PASS with one P2 advisory. The assigned feature-catalog slice has no new blocking correctness mismatch; source-backed claims for checkpoint v2, restore barriers, schema v28-v30, error codes, enrichment markers, and sk-git are otherwise aligned.

## Next Dimension

Parallel-dispatch merge should ingest this delta and leave existing P1/P2 registry state unchanged except for the new P2 advisory if accepted by the reducer.
Review verdict: PASS
