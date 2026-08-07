# Iteration 009 - Final Broad Discovery Sweep

## Dimension

Final broad discovery sweep across correctness, security, traceability, and maintainability. Emphasis: WAL connection lifecycle, embed dimension adoption/normalization, auto-select cascade behavior under partial provider availability, and data drop/duplication error paths.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:259`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:474`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1202`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1312`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1345`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:258`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:348`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:350`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:373`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:378`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:451`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:477`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:787`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:812`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:852`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:925`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:478`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:765`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:968`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1014`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1037`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1056`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1079`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1129`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:74`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:161`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:198`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:157`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:223`
- `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:66`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:194`

## Findings by Severity

### P0

None.

### P1

#### DR-009-P1-001 - Reindex shard writer bypasses the WAL TRUNCATE durability path

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:348`
- Claim: `writeVectorsToShard` opens a direct `better-sqlite3` connection to the target vector shard, enables WAL, writes the canonical and KNN vector rows, and closes the connection without the explicit `wal_checkpoint(TRUNCATE)` sequence that the daemon shutdown path treats as required for at-rest durability.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:348`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:350`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:373`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:378`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:451`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:477`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1345`
- Counterevidence sought: checked whether reindex registers the shard connection with `vector-index-store` tracking, calls `checkpointAllWal`, checkpoints before `shard.close()`, or relies on `attachActiveVectorShard` to checkpoint after the active pointer flips. None of those paths are present; `attachActiveVectorShard` attaches and ensures schema but does not checkpoint.
- Alternative explanation: SQLite WAL is normally recoverable with the `-wal` file, so this is not immediate logical corruption. The program, however, added explicit TRUNCATE checkpointing because passive close was judged insufficient for the daemon's at-rest durability guarantee; this writer bypasses that same guarantee after bulk shard writes.
- Final severity: P1.
- Confidence: 0.87.
- Downgrade trigger: downgrade to P2 if the durability contract is explicitly narrowed to daemon shutdown only, or if `better-sqlite3` close is accepted as sufficient for short-lived reindex shard writers despite the existing close-db comments.

### P2

None.

## Traceability Checks

- `spec_code`: partial. The new finding is a code-level durability gap in the reindex shard writer; no matching spec exception was found in the reviewed prompt scope.
- `checklist_evidence`: partial. Existing checkpoint tests cover `vector-index-store.close_db` active DB/shard checkpointing, but the search found no reindex-specific WAL checkpoint test.
- `skill_agent`: pending.
- `agent_cross_runtime`: pending.
- `feature_catalog_code`: partial.
- `playbook_capability`: pending.

## SCOPE VIOLATIONS

None.

## Ruled Out

- No separate P0/data-corruption path found in `attachActiveVectorShard`/`detachActiveVectorShard` ordering beyond the active/non-active checkpoint issues already recorded.
- HF local dimension adoption validates response row count, adopts server-reported/custom dimensions, validates each row against the adopted dimension, normalizes vectors, and preserves null slots for skipped batch inputs.
- Auto-select still probes local-first (`ollama`, `hf-local`, then cloud). Factory fallback can change provider/dimension, but persistence/search paths validate embedding length before vector writes, so I did not elevate that to a new required finding in this pass.
- Save/index paths guard against wrong-dimension vector writes through `index_memory`, `update_memory`, and `SQLiteVectorStore` dimension checks.

## Verdict

CONDITIONAL, `hasAdvisories=true`. The sweep found one new P1 in the WAL durability cluster. No P0 found.

## Next Dimension

Convergence/synthesis after adjudicating DR-009-P1-001 with the existing WAL durability workstream.
