# Tasks: Index Large Files — Chunked Indexing, Bulk Delete, and CLI

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Schema Migration and Chunking Utility

- [x] T001 Add `parent_id`, `chunk_index`, `chunk_label` columns to schema definition for fresh DBs (`mcp_server/lib/search/vector-index-impl.ts`)
- [x] T002 Write v15-to-v16 migration: `PRAGMA table_info` guard + `ALTER TABLE` statements in a single transaction (`mcp_server/lib/search/vector-index-impl.ts`)
- [x] T003 Create `idx_parent_id` and `idx_parent_chunk` indexes in schema and migration (`mcp_server/lib/search/vector-index-impl.ts`)
- [x] T004 [P] Create `mcp_server/lib/chunking/anchor-chunker.ts` — export `needsChunking()`, `chunkLargeFile()`, `CHUNKING_THRESHOLD` (50000), `TARGET_CHUNK_CHARS` (4000), `MAX_CHUNK_CHARS` (12000)
- [x] T005 [P] Implement anchor extraction in `anchor-chunker.ts` — regex match on `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` tags
- [x] T006 [P] Implement structure-based fallback in `anchor-chunker.ts` — split on markdown headings when no anchors present
- [x] T007 [P] Implement character-boundary fallback in `anchor-chunker.ts` — split at `MAX_CHUNK_CHARS` when no headings present; log warning
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Chunking Branch in Save Handler and Preflight Relaxation

- [x] T008 Import `needsChunking`, `chunkLargeFile`, `CHUNKING_THRESHOLD` in `memory-save.ts`
- [x] T009 Write `indexChunkedMemoryFile()` function in `memory-save.ts` — creates parent record (`status='partial'`, no embedding), iterates chunks, generates embedding per child, inserts child records with `parent_id`, `chunk_index`, `chunk_label`
- [x] T010 Insert chunking branch in `indexMemoryFile()` after preflight validation and before existing single-record path (`memory-save.ts`)
- [x] T011 Update `preflight.ts:538` — detect `isChunkEligible` (content >= `CHUNKING_THRESHOLD`), convert `PF030 CONTENT_TOO_LARGE` hard error to non-blocking warning for chunk-eligible files
- [x] T012 Update `preflight.ts` token budget error — similarly convert to warning when file is chunk-eligible
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Bulk Delete MCP Tool

- [x] T013 Create `mcp_server/handlers/memory-bulk-delete.ts` — main handler skeleton with `confirm` check
- [x] T014 Implement tier scope safety gate in `memory-bulk-delete.ts` — reject unscoped deletion of `constitutional` or `critical` tier
- [x] T015 Implement auto-checkpoint in `memory-bulk-delete.ts` — call `checkpoint_create` before any deletion; halt and return error if checkpoint fails
- [x] T016 Implement `DELETE WHERE importance_tier = ? [AND spec_folder LIKE ?] [AND created_at < ?]` in `memory-bulk-delete.ts`
- [x] T017 Implement causal edge cleanup in `memory-bulk-delete.ts` — `DELETE FROM causal_edges WHERE source_id IN (deleted_ids) OR target_id IN (deleted_ids)`
- [x] T018 Add mutation ledger entry in `memory-bulk-delete.ts` — record operation type, tier, count, timestamp
- [x] T019 Add `BulkDeleteArgs` interface to `mcp_server/tools/types.ts` — fields: `tier`, `specFolder?`, `confirm`, `olderThanDays?`
- [x] T020 Add `memoryBulkDelete` tool definition to `mcp_server/tool-schemas.ts` under L4: Mutation section
- [x] T021 Add `'memory_bulk_delete'` to `TOOL_NAMES` set in `mcp_server/tools/memory-tools.ts`
- [x] T022 Add dispatch case for `memory_bulk_delete` in `mcp_server/tools/memory-tools.ts`
- [x] T023 Add import and re-export of `memoryBulkDelete` and `handleMemoryBulkDelete` in `mcp_server/handlers/index.ts`
- [x] T024 Update `mcp_server/package.json` — update description from "22 tools" to "23 tools"
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: CLI Entry Point

- [x] T025 Create `mcp_server/cli.ts` — scaffold with `process.argv[2]` dispatch and `--help` / no-subcommand usage output
- [x] T026 Implement `__dirname`-relative module resolution for `better-sqlite3` and DB path in `cli.ts`
- [x] T027 Implement `stats` subcommand in `cli.ts` — tier distribution, top folders, schema version, chunked memory counts
- [x] T028 Implement `bulk-delete` subcommand in `cli.ts` — flags: `--tier`, `--folder`, `--older-than`, `--dry-run`; calls bulk-delete handler logic directly
- [x] T029 Implement `reindex` subcommand in `cli.ts` — flags: `--force`; dynamic `import()` for embedding model (loaded only here)
- [x] T030 Add `spec-kit-cli` bin entry to `mcp_server/package.json` pointing to `dist/cli.js`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [x] T031 Create 120KB test memory file with multiple ANCHOR sections — run `memory_save` — inspect DB for parent record (`status='partial'`) + child records with embeddings
- [x] T032 Run `memory_save` on a 40KB file — confirm single record created, no parent-child split (regression check)
- [x] T033 Seed 10 deprecated memories — call `memory_bulk_delete({ tier: "deprecated", confirm: true })` — verify count returned matches 10, checkpoint exists in DB
- [x] T034 Call `memory_bulk_delete({ tier: "deprecated", confirm: true })` without seeded data — verify returns 0 deleted without error
- [x] T035 Call `memory_bulk_delete({ tier: "constitutional", confirm: true })` without `specFolder` — verify error returned, zero deletions
- [x] T036 Run `node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats` from project root — verify exit 0, tier distribution printed
- [x] T037 Re-index the 4 previously-failed 101-104KB memory files via `memory_index_scan({ force: true })` — verify each now has parent + child records in DB
- [x] T038 Verify `memory_index_scan({ force: true })` on all existing sub-50K files — confirm no parent-child splits introduced
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T031-T038 all green)
- [x] 4 previously-rejected files now indexed
- [x] `memory_bulk_delete` tool registered and callable
- [x] CLI resolves modules from project root
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
