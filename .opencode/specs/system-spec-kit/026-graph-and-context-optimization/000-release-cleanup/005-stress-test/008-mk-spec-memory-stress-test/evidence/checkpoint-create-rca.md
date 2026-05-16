# checkpoint_create RCA

## 1. Root cause hypothesis

1. **Likely: SQLite write-lock / busy failure during a large checkpoint transaction under paired-parallel sweep load. Confidence: 65%.**  
   `checkpoint_create` snapshots many tables, gzips the full snapshot, inserts a large BLOB, and prunes old checkpoints inside one `better-sqlite3` transaction. Earlier single-user checkpoint creation succeeded; the later failure happened during a sweep with concurrent mutating tools. The handler collapses all storage-layer exceptions to `CHECKPOINT_CREATE_FAILED`, so the exact SQLite error is not preserved in the MCP response.

2. **Possible: checkpoint snapshot duration/size amplified lock contention rather than hitting a hard size cap. Confidence: 20%.**  
   The existing successful checkpoint is 123.77 MiB compressed. The live DB is now 584 MiB with a 129 MiB WAL and a large `memory_conflicts` table. There is no checkpoint size cap in the code or schema, but a second global checkpoint requires reading and compressing a large state while other workers are writing.

3. **Less likely: duplicate checkpoint name or checkpoint table constraint. Confidence: 5%.**  
   The schema has `name TEXT NOT NULL UNIQUE`, but the failed name is absent. The table currently contains only the earlier global rollback checkpoint.

4. **Less likely: disk exhaustion. Confidence: 2%.**  
   The volume has about 1.0 TiB available.

5. **Unknown but worth instrumenting: sqlite-vec / virtual-table read failure. Confidence: 8%.**  
   The checkpoint manifest includes `vec_memories` and `vec_metadata`. A plain `sqlite3` process without sqlite-vec cannot query the vector virtual table, but the MCP path successfully created the earlier checkpoint, so this is not the best explanation for a temporal failure under load.

## 2. Evidence

- Failure record: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test/evidence/tool-sweep.jsonl:30` records `checkpoint_create` failing at `2026-05-16T16:20:00.000Z` with `CHECKPOINT_CREATE_FAILED`.
- Handler error collapse: `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:318` calls `checkpoints.createCheckpoint(...)`; `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:325` maps a null result to `CHECKPOINT_CREATE_FAILED`.
- Storage layer swallow point: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1407` starts a transaction; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1450` JSON-serializes the snapshot; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1451` gzips it; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1456` inserts the BLOB; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1510` catches any thrown error and returns `null`.
- Snapshot breadth: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:111` includes `memory_index`, vector tables, causal tables, history, mutation ledger, conflicts, session tables, and summaries in the snapshot manifest.
- Schema constraint: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2208` creates `checkpoints`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2210` makes `name` unique. SQLite confirms the same live schema.
- Live checkpoint table: current DB query shows only `id=2`, `name=pre-008-sweep-20260516T144620Z`, `created_at=2026-05-16T14:46:52.127Z`, `snapshot=123.77 MiB`, `memoryCount=11426`, `vectorCount=11426`.
- No intervening auto-checkpoint evidence: current DB query shows checkpoint count `1`, min/max `created_at=2026-05-16T14:46:52.127Z`. No `pre-bulk-delete-*` row exists.
- `memory_bulk_delete` auto-checkpoint behavior: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:158` begins auto-checkpoint creation unless skipped; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:176` treats null checkpoint creation as failure; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:181` proceeds without rollback for lower tiers.
- Sweep order evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/008-mk-spec-memory-stress-test/evidence/tool-sweep.jsonl:35` records `memory_bulk_delete` at `16:25Z`, after the checkpoint_create failure, using CLI dry-run with zero affected memories.
- Current DB size: `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` is 584 MiB; WAL is 129 MiB; SHM mtime is `2026-05-16T16:46:52Z`.
- Current high-volume tables sampled without mutating: `memory_index=12544`, `memory_history=14449`, `mutation_ledger=13052`, `memory_conflicts=58392`, `causal_edges=1375`.
- Disk: `df -h` on the repo and `/tmp` volume reports `1.0Ti` available.
- Recent commits: `git log --all --grep="checkpoint" --since="2026-05-01" --oneline` shows recent 008 docs commits and older checkpoint-named WIP commits, but no clear recent checkpoint-handler code change in the targeted source paths since 2026-05-01.

## 3. Reproduction steps

Not reproduced. Creating another global checkpoint would add another ~124+ MiB BLOB and compound the live Phase 2/Phase 4 state, which the investigation constraints explicitly forbid.

Safe theoretical reproduction after the packet closes:

1. Copy the SQLite DB to a disposable temp path.
2. Start two or more MCP/Node workers against that temp DB.
3. In worker A, run a global `checkpoint_create` while worker B performs repeated `memory_save` / `memory_update` / graph upserts.
4. Capture MCP stderr and storage-layer warnings, especially `[checkpoints] createCheckpoint error: ...`.
5. Repeat with a scoped `specFolder` checkpoint to compare snapshot size and lock duration.

## 4. Remediation proposal

Small, surgical fix:

1. Preserve the underlying storage error in the handler response details. Change `createCheckpoint` to return `{ ok: false, errorCode, message }` or throw a typed error instead of returning `null`; then map `SQLITE_BUSY`, duplicate names, permission errors, and generic failures separately.
2. Add a busy-timeout / retry wrapper around checkpoint creation for `SQLITE_BUSY` and `SQLITE_LOCKED`, with short bounded retries and jitter.
3. Avoid doing `JSON.stringify` + `gzipSync` inside the write transaction. Build/compress the snapshot before opening the write transaction, then use a short transaction only for `INSERT` and retention pruning. This directly reduces lock hold time.
4. For sweep fixtures, prefer scoped checkpoints or `includeEmbeddings=false` where rollback semantics allow it. A global embedding-inclusive checkpoint is expensive enough that parallel sweep harnesses should treat it as a serialized lifecycle operation.

## 5. Severity

**P1.** This does not corrupt existing data and the pre-sweep rollback checkpoint still exists, so it is not P0. It does block lifecycle rollback tooling under exactly the conditions where checkpoint reliability matters most: destructive or parallel maintenance sweeps. The hidden underlying DB error also slows recovery because operators see only `CHECKPOINT_CREATE_FAILED`.

## 6. Phase 4 follow-on note

Once 008 closes, add to `implementation-summary.md` that Phase 1 found a lifecycle reliability defect: `checkpoint_create` can fail under sweep load after a successful baseline checkpoint, likely because global snapshot creation holds a large transaction while concurrent writers are active. Record the existing rollback checkpoint (`pre-008-sweep-20260516T144620Z`, id=2, 123.77 MiB) remained intact, no intervening checkpoint rows were present, and Phase 4 should track typed error propagation plus bounded `SQLITE_BUSY` retry / shorter transaction scope as the remediation.
