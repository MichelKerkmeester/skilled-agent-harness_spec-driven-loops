# Iteration 5 — correctness — checkpoint-schema

**Dimension:** correctness
**Dispatch:** gpt-5.5-fast (variant high) via cli-opencode — real verdict returned (dispatchOk=true)
**Scope/focus:** `checkpoint_create` `includeEmbeddings` (commit `15d2e4988d`) — verify `includeEmbeddings: z.boolean().optional()` added to `checkpointCreateSchema` AND to the ~line 567 allowlist, that unknown params are still rejected, and that the handler/storage actually honors `includeEmbeddings` (excludes vec tables).

## Verdict: FAIL

## Findings

- **[P1] includeEmbeddings:false does not exclude main vec_metadata in v2 checkpoints**
  - **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (line 2271)
  - **Evidence:** Line 2271 always snapshots the whole main DB: `database.exec(`VACUUM main INTO ${quoteSqlString(mainSnapshotPath)}`);`. The v2 path is explicitly allowed when main still contains `vec_metadata` because lines 1078-1084 gate only on `vec_memories`, so a runtime with retained `main.vec_metadata` will still include `vec_metadata` in `snapshot-main.sqlite` even when line 2273 skips the vector shard for `includeEmbeddings:false`.
  - **Recommendation:** For `includeEmbeddings:false`, remove or omit `vec_metadata` from the v2 main snapshot after VACUUM, or build a filtered main snapshot. Add a regression test that creates `main.vec_metadata`, calls `createCheckpoint({ includeEmbeddings:false })`, opens `snapshot-main.sqlite`, and asserts `vec_metadata` is absent.
