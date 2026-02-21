# Implementation Plan: Index Large Files — Chunked Indexing, Bulk Delete, and CLI

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite via `better-sqlite3` |
| **Testing** | Manual verification + `memory_index_scan` |

### Overview

This plan covers three coordinated tasks in the Spec Kit Memory MCP Server: (1) anchor-aware chunked indexing that splits files exceeding 50K chars into parent-child records instead of rejecting them, (2) a new `memory_bulk_delete` MCP tool for tier-scoped deletion with safety gates and auto-checkpoint, and (3) a standalone CLI entry point that resolves its own `node_modules` via `__dirname` so it works from any working directory. The three tasks share a strict ordering dependency: the schema migration (T1) must land before the save handler (T1 continued) can write chunked records, and the CLI (T3) depends on the bulk delete handler (T2) being compiled.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified — `better-sqlite3`, schema v15, existing `memory-save.ts` patterns

### Definition of Done

- [x] All acceptance criteria in `spec.md` met
- [x] TypeScript compiles without errors (`tsc --noEmit`)
- [x] Docs updated: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline Extension — the existing indexing pipeline is extended with a new chunking branch; no new top-level service is introduced.

### Key Components

- **`anchor-chunker.ts`**: Pure utility. Exports `needsChunking(content)`, `chunkLargeFile(content, filePath)`, and constants (`CHUNKING_THRESHOLD=50000`, `TARGET_CHUNK_CHARS=4000`, `MAX_CHUNK_CHARS=12000`). No DB dependencies.
- **`memory-save.ts` (chunking branch)**: Calls `needsChunking` after preflight validation passes. If true, delegates to `indexChunkedMemoryFile()` which creates the parent record (no embedding, `status='partial'`) then iterates chunks and creates child records each with their own embedding.
- **`vector-index-impl.ts` (schema v16)**: Adds `parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE`, `chunk_index INTEGER`, `chunk_label TEXT` to the schema. Migration is a single transaction with `ALTER TABLE` statements guarded by `IF NOT EXISTS` equivalents (checked via `PRAGMA table_info`).
- **`memory-bulk-delete.ts`**: Validates `confirm: true` and tier scope rules, calls `checkpoint_create` internally, runs `DELETE FROM memory_index WHERE importance_tier = ? [AND spec_folder = ?] [AND created_at < ?]`, cleans orphaned causal edges, writes mutation ledger entry.
- **`cli.ts`**: Uses `path.resolve(__dirname, '../node_modules')` to locate `better-sqlite3` independent of CWD. Three subcommands dispatched with `process.argv[2]`. Dynamic `import()` for the embedding model inside `reindex` only.

### Data Flow

```
memory_save(filePath)
    → preflight validation
    → needsChunking? ──Yes──► chunkLargeFile()
    │                             → anchor extraction
    │                             → grouping into TARGET_CHUNK_CHARS chunks
    │                             → insert parent record (status='partial', no embedding)
    │                             → for each chunk: generate embedding → insert child record
    └──No──► existing single-record indexing path (unchanged)

memory_bulk_delete({ tier, specFolder?, confirm, olderThanDays? })
    → validate confirm + tier scope rules
    → checkpoint_create (auto)
    → DELETE WHERE tier [AND specFolder] [AND age]
    → DELETE orphaned causal edges
    → write mutation ledger
    → return { deleted: N, restoreCommand }

cli.js stats|bulk-delete|reindex
    → resolve DB path via __dirname
    → open DB read-only (stats) or read-write (bulk-delete, reindex)
    → dispatch subcommand
    → load embedding model only for reindex (dynamic import)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema Migration and Chunking Utility

- [x] Add `parent_id`, `chunk_index`, `chunk_label` columns to `vector-index-impl.ts` schema (v15 to v16)
- [x] Write migration logic guarded by `PRAGMA table_info` check; wrap in transaction
- [x] Create `mcp_server/lib/chunking/anchor-chunker.ts` with all exports and constants
- [x] Unit-level verification: confirm constants are importable from `memory-save.ts`

### Phase 2: Chunking Branch in Save Handler

- [x] Import `needsChunking`, `chunkLargeFile` in `memory-save.ts`
- [x] Write `indexChunkedMemoryFile()` function: parent record creation, chunk loop, embedding per child
- [x] Insert chunking branch in `indexMemoryFile()` after preflight validation, before existing single-record path
- [x] Update `preflight.ts`: convert `PF030` hard error to non-blocking warning for files at or above `CHUNKING_THRESHOLD`

### Phase 3: Bulk Delete Tool

- [x] Create `mcp_server/handlers/memory-bulk-delete.ts` with safety gates and auto-checkpoint
- [x] Add `BulkDeleteArgs` interface to `mcp_server/tools/types.ts`
- [x] Add `memoryBulkDelete` tool definition to `mcp_server/tool-schemas.ts`
- [x] Register `memory_bulk_delete` in `memory-tools.ts` and dispatch in handler index
- [x] Update `package.json` description to "23 tools"

### Phase 4: CLI Entry Point

- [x] Create `mcp_server/cli.ts` with `stats`, `bulk-delete`, `reindex` subcommands
- [x] Implement `__dirname`-based module resolution for `better-sqlite3`
- [x] Add dynamic `import()` for embedding model inside `reindex` only
- [x] Add `spec-kit-cli` bin entry to `package.json`

### Phase 5: Verification

- [x] Test 120KB file with anchors through `memory_save` — verify parent + child records
- [x] Test 40KB file — verify single record (no regression)
- [x] Seed 10 deprecated memories — call `memory_bulk_delete` — verify all deleted, checkpoint created
- [x] Run `node .../cli.js stats` from project root — verify exit 0, no module errors
- [x] Re-index the 4 previously-failed 101-104KB files — verify they now index as chunked records
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual — chunked indexing | 120KB test file with anchors: parent + child records created | `memory_save` MCP tool + DB inspection |
| Manual — no regression | 40KB file indexes as single record | `memory_save` MCP tool + DB inspection |
| Manual — bulk delete | 10 seeded deprecated memories deleted in one call, checkpoint exists | `memory_bulk_delete` MCP tool |
| Manual — CLI module resolution | `stats` from project root exits 0 | `node .../cli.js stats` from `~/...Public/` |
| Manual — re-index previously failed | 4 × 101-104KB files now index | `memory_index_scan({ force: true })` |
| Manual — safety gates | `memory_bulk_delete` without `confirm` returns error | MCP tool call |
| Manual — constitutional tier protection | Unscoped constitutional delete returns error | MCP tool call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | Internal (MCP server `node_modules`) | Green | All DB operations fail; CLI cannot start |
| Schema v15 (existing) | Internal | Green | Migration is additive; v15 data preserved |
| MCP tool dispatch infrastructure | Internal | Green | `memory_bulk_delete` tool is unreachable |
| Embedding model (for chunked indexing and `reindex`) | Internal | Green | Child records created with `status='pending_embed'`; degraded but non-fatal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Schema migration corrupts existing data, or chunked indexing creates orphaned child records without a parent
- **Procedure**: Restore the database from the pre-migration checkpoint created by `checkpoint_create` before migration runs. Revert to the previous compiled `dist/` by re-running `tsc` on the pre-change source. The schema migration is wrapped in a transaction so a partial failure rolls back automatically.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema + Chunker) ──────┐
                                  ├──► Phase 2 (Save Handler) ──► Phase 3 (Bulk Delete) ──► Phase 4 (CLI)
                                  └──────────────────────────────────────────────────────────────────────►
                                                                                             Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema + Chunker | None | Save Handler, Verify |
| Save Handler | Schema + Chunker | Verify |
| Bulk Delete | None (parallel with Save Handler) | CLI, Verify |
| CLI | Bulk Delete (compiled) | Verify |
| Verify | All phases | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema + Chunking Utility | High | 3-4 hours |
| Chunking Branch in Save Handler | High | 3-4 hours |
| Bulk Delete Tool | Medium | 2-3 hours |
| CLI Entry Point | Medium | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **11-16 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] DB checkpoint created before schema migration runs
- [x] No feature flag required — chunking is gated by file size, not a flag
- [x] Monitoring: `PRAGMA table_info(memory_index)` confirms v16 columns exist

### Rollback Procedure

1. Restore database from auto-checkpoint created before migration
2. Revert compiled `dist/` to pre-change build (`tsc` on prior source commit)
3. Verify: confirm `PRAGMA table_info` no longer shows `parent_id` column
4. Notify: internal note only (no user-facing surface)

### Data Reversal

- **Has data migrations?** Yes — schema v15 to v16
- **Reversal procedure**: Restore from pre-migration checkpoint. The `ALTER TABLE` additions are not reversible with `DROP COLUMN` in all SQLite versions; checkpoint restore is the canonical rollback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│  Phase 1           │────►│  Phase 2             │     │  Phase 5            │
│  Schema + Chunker  │     │  Save Handler Branch │────►│  Verification       │
└────────────────────┘     └──────────────────────┘     └─────────────────────┘
                                                                ▲
┌────────────────────┐     ┌──────────────────────┐           │
│  Phase 3           │────►│  Phase 4             │───────────┘
│  Bulk Delete Tool  │     │  CLI Entry Point     │
└────────────────────┘     └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| anchor-chunker.ts | None | `chunkLargeFile`, `needsChunking` | memory-save.ts (chunking branch) |
| vector-index-impl.ts (v16) | None | Schema with `parent_id`, `chunk_index`, `chunk_label` | memory-save.ts (chunking branch) |
| memory-save.ts (chunking branch) | anchor-chunker.ts, v16 schema | Chunked index records | Verify phase |
| memory-bulk-delete.ts | Existing checkpoint + DB | Tier-scoped deletion, auto-checkpoint | cli.ts |
| cli.ts | memory-bulk-delete.ts (compiled) | `stats`, `bulk-delete`, `reindex` commands | Verify phase |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Schema v16 migration** — 1-2 hours — CRITICAL (blocks all chunked indexing)
2. **`anchor-chunker.ts`** — 1-2 hours — CRITICAL (blocks save handler chunking branch)
3. **`indexChunkedMemoryFile()` in `memory-save.ts`** — 2-3 hours — CRITICAL (core feature)
4. **Preflight `PF030` relaxation** — 0.5 hours — CRITICAL (without this, chunked files still get rejected before save is reached)
5. **Verification of 4 previously-failed files** — 0.5 hours — CRITICAL

**Total Critical Path**: ~5-8.5 hours

**Parallel Opportunities**:
- `memory-bulk-delete.ts` (Phase 3) and `anchor-chunker.ts` (Phase 1) can be written simultaneously
- CLI subcommand scaffolding can begin during Phase 2 once Phase 3 handler interface is defined
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema + Chunker Ready | v16 schema live, `anchor-chunker.ts` exports importable | End of Phase 1 |
| M2 | Chunked Indexing Live | 120KB test file indexes as parent + children | End of Phase 2 |
| M3 | Bulk Delete + CLI Shipped | `memory_bulk_delete` tool registered; `cli.js stats` runs from project root | End of Phase 4 |
| M4 | Full Verification | All 5 SC items confirmed; previously-failed files indexed | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for all ADRs (ADR-001 through ADR-005).

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation

**Files**: `vector-index-impl.ts` (schema migration), `anchor-chunker.ts`
**Duration**: ~90s
**Agent**: Primary — schema must land before save handler can be modified

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Save Handler Agent | Chunking branch + preflight relaxation | `memory-save.ts`, `preflight.ts` |
| Bulk Delete Agent | Handler + tool registration | `memory-bulk-delete.ts`, `tool-schemas.ts`, `types.ts`, `memory-tools.ts`, `handlers/index.ts` |

**Duration**: ~120s (parallel)

### Tier 3: Integration

**Agent**: Primary
**Task**: CLI entry point (depends on bulk delete handler being compiled), final verification
**Duration**: ~60s
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Schema + Chunker | Primary | `vector-index-impl.ts`, `anchor-chunker.ts` | Complete |
| W-B | Save Handler + Preflight | Primary | `memory-save.ts`, `preflight.ts` | Complete |
| W-C | Bulk Delete Tool | Primary | `memory-bulk-delete.ts`, `tool-schemas.ts`, `types.ts`, `memory-tools.ts`, `handlers/index.ts`, `package.json` | Complete |
| W-D | CLI | Primary | `cli.ts` | Complete |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | W-A, W-B | Save handler can import `needsChunking` and use v16 schema |
| SYNC-002 | W-B and W-C complete | All | CLI compiled; verification can begin |

### File Ownership Rules

- Each file is owned by one workstream; no cross-workstream edits required
- `package.json` owned by W-C (bin entry addition is part of tool registration)
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints

- **Per Phase**: `checklist.md` updated with evidence at each phase completion
- **Blockers**: Schema migration failure triggers immediate halt and rollback

### Escalation Path

1. Schema migration failure → halt, restore checkpoint, re-examine `PRAGMA table_info` output
2. Embedding model unavailable during chunked indexing → mark child as `status='pending_embed'`, log, continue
3. CLI module resolution failure → verify `__dirname` path, check `better-sqlite3` binary ABI compatibility
<!-- /ANCHOR:communication -->
