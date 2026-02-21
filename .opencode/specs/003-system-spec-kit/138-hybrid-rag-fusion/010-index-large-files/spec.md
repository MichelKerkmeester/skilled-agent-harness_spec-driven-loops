<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Index Large Files — Chunked Indexing, Bulk Delete, and CLI

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Three related failures in the Spec Kit Memory MCP Server's indexing pipeline were found during a `/memory:manage cleanup` session: large memory files (>100KB) were rejected outright by a hard gate, there was no tier-based bulk delete tool forcing dangerous direct DB access, and running direct DB scripts required a fragile `cd` workaround because module resolution was broken from the project root. This spec covers three coordinated fixes: anchor-aware chunked indexing for large files (replacing rejection with splitting), a new `memory_bulk_delete` MCP tool with safety gates, and a standalone CLI entry point that resolves its own modules correctly from any working directory.

**Key Decisions**: 50K-char chunking threshold (not 100K), anchor-first splitting strategy to preserve semantic coherence within chunks

**Critical Dependencies**: SQLite schema migration (v15 to v16) must land before any chunked indexing can succeed
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-21 |
| **Branch** | `010-index-large-files` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four memory files (101-104KB) fail indexing with `PF030: CONTENT_TOO_LARGE` because `preflight.ts:538` enforces a 100KB hard limit on `MCP_MAX_CONTENT_LENGTH`. The actual embedding quality ceiling is far lower (~28K chars based on the 8000-token budget at 3.5 chars/token), so the hard gate was rejecting files unnecessarily early. Separately, `memory_delete` only accepts a single `id` or a `specFolder` scope — with 722 deprecated memories and a ~7-result MCP token budget per list call, bulk cleanup was impossible without bypassing MCP tools and accessing SQLite directly. That direct access was itself broken: running `node -e "require('better-sqlite3')"` from the project root fails because the package only exists inside the MCP server's `node_modules/`, and the workaround (manually `cd`-ing to the server directory first) was fragile and undocumented.

### Purpose

Replace the hard rejection of large files with anchor-aware chunked indexing, add a safe tier-scoped bulk delete MCP tool, and ship a standalone CLI that resolves modules correctly from any directory — so the indexing pipeline handles all realistic file sizes, bulk operations are possible within MCP tooling, and direct DB workflows are no longer fragile.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Chunked indexing for files exceeding 50K chars: anchor-first splitting with structure-based fallback, parent-child storage model, schema v16 migration
- New `memory_bulk_delete` MCP tool: tier-based filter, `confirm` required, auto-checkpoint before deletion, causal edge cleanup, mutation ledger
- Standalone `cli.ts` entry point: `stats`, `bulk-delete`, `reindex` subcommands, `__dirname`-based module resolution, `--dry-run` support
- Preflight relaxation: files at or above 50K chars get non-blocking warnings rather than hard `PF030` errors

### Out of Scope

- Retrieval-time chunk reassembly (chunks return the parent `file_path` for full-content loading; merging is caller responsibility)
- Streaming or incremental indexing of files above the 50K threshold
- UI or dashboard for monitoring chunked records

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Create | Core chunking utility: `chunkLargeFile()`, `needsChunking()`, constants |
| `mcp_server/handlers/memory-bulk-delete.ts` | Create | Tier-based bulk delete handler with safety gates |
| `mcp_server/cli.ts` | Create | Standalone CLI with `stats`, `bulk-delete`, `reindex` subcommands |
| `mcp_server/lib/search/vector-index-impl.ts` | Modify | Schema v15 to v16 migration: `parent_id`, `chunk_index`, `chunk_label` columns and indexes |
| `mcp_server/handlers/memory-save.ts` | Modify | Add chunking branch via `needsChunking` / `chunkLargeFile`, new `indexChunkedMemoryFile()` |
| `mcp_server/lib/validation/preflight.ts` | Modify | Convert hard `PF030` size errors to non-blocking warnings for chunk-eligible files |
| `mcp_server/tool-schemas.ts` | Modify | Add `memoryBulkDelete` tool definition to `TOOL_DEFINITIONS` |
| `mcp_server/tools/types.ts` | Modify | Add `BulkDeleteArgs` interface |
| `mcp_server/tools/memory-tools.ts` | Modify | Add `memory_bulk_delete` to `TOOL_NAMES` and dispatch case |
| `mcp_server/handlers/index.ts` | Modify | Import and export `memoryBulkDelete` / `handleMemoryBulkDelete` |
| `mcp_server/package.json` | Modify | Add `spec-kit-cli` bin entry, update description to "23 tools" |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Files exceeding 50K chars must index successfully as chunked records rather than fail with `PF030` | A 120KB test memory file passes `memory_save` and produces one parent record (status='partial', no embedding) and multiple child records each with their own embedding |
| REQ-002 | Schema v16 migration must succeed for both fresh installs and upgrades from v15 | `parent_id`, `chunk_index`, `chunk_label` columns and `idx_parent_id` / `idx_parent_chunk` indexes exist after startup; existing records unaffected |
| REQ-003 | `memory_bulk_delete` must require `confirm: true` and refuse to delete constitutional/critical tier without an explicit `specFolder` scope | Calling `memory_bulk_delete({ tier: "constitutional", confirm: true })` without `specFolder` returns an error; calling with `specFolder` succeeds after auto-checkpoint |
| REQ-004 | CLI `stats` subcommand must resolve `better-sqlite3` from any working directory without requiring `cd` to the MCP server directory first | Running `node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats` from the project root exits 0 and prints tier distribution |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Anchor-first chunking strategy must keep semantically related content together | Chunks respect ANCHOR tag boundaries; no chunk splits content across an anchor boundary mid-sentence |
| REQ-006 | Files under 50K chars must continue to index as single records with no change in behavior | `memory_index_scan({ force: true })` on a sub-50K file produces one record, not a parent-child set |
| REQ-007 | `memory_bulk_delete` must create an auto-checkpoint before deleting and return a restore command in its response | Response body includes `restoreCommand` with the exact checkpoint name to restore from |
| REQ-008 | CLI `reindex` must load the embedding model only when invoked, not on `stats` or `bulk-delete` | `stats` and `bulk-delete` complete in under 2 seconds; `reindex` may take longer due to model load |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 4 previously-rejected 101-104KB memory files index successfully as chunked records after the fix ships
- **SC-002**: `memory_bulk_delete({ tier: "deprecated", confirm: true })` deletes all deprecated memories in a single call with an auto-created checkpoint
- **SC-003**: `node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats` runs from the project root without module resolution errors
- **SC-004**: Files under 50K chars continue to index as single records with no behavioral change
- **SC-005**: Schema v16 migration completes without data loss on existing databases
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SQLite schema v15 to v16 migration | Chunked indexing is completely non-functional if migration fails on upgrade | Migration wrapped in transaction; logs error and preserves existing schema on failure |
| Dependency | `better-sqlite3` native binary compatibility | CLI and all direct DB operations break if binary does not match the Node.js ABI | CLI uses `__dirname`-based resolution to the MCP server's own `node_modules/`; no new dependency |
| Risk | Parent-child retrieval returning only `file_path` instead of chunk content | Callers expecting chunk content in search results may receive less context | Document clearly in tool schema that child records return parent `file_path` for full-content loading |
| Risk | Chunking splits a sentence at MAX_CHUNK_CHARS boundary | Degraded embedding quality for the affected chunk | Anchor-first strategy minimises this; structure-based fallback targets heading boundaries, not arbitrary character positions |
| Risk | Auto-checkpoint during `memory_bulk_delete` fails silently | Deletion proceeds without a restore point | Checkpoint failure returns an error and halts deletion; user must retry or pass `--skip-checkpoint` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `memory_save` for a 120KB file must complete within 30 seconds (embedding generation is the bottleneck, not chunking overhead)
- **NFR-P02**: CLI `stats` and `bulk-delete` (without embedding) must complete within 2 seconds from project root

### Security

- **NFR-S01**: `memory_bulk_delete` must require explicit `confirm: true`; omitting it returns an error before any deletion
- **NFR-S02**: Constitutional and critical tier deletion requires an explicit `specFolder` scope to prevent accidental mass deletion of high-importance memories

### Reliability

- **NFR-R01**: Schema migration must be idempotent — running it twice does not error or corrupt data
- **NFR-R02**: Chunking threshold and chunk size constants (`CHUNKING_THRESHOLD`, `TARGET_CHUNK_CHARS`, `MAX_CHUNK_CHARS`) are exported from `anchor-chunker.ts` so tests and the save handler can share the same values without duplication
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- File exactly at 50K chars: `needsChunking()` returns `false` (threshold is strictly greater-than); file indexes as single record
- File with no ANCHOR tags: chunking falls back to structure-based markdown heading splitting; if no headings exist, falls back to MAX_CHUNK_CHARS character splits
- File with a single ANCHOR section larger than MAX_CHUNK_CHARS (12K chars): that section is split at MAX_CHUNK_CHARS boundary; a warning is logged but indexing continues

### Error Scenarios

- Schema migration fails mid-run: transaction rollback preserves v15 schema; MCP server starts without chunking support and logs a startup warning
- `memory_bulk_delete` auto-checkpoint fails: handler returns error immediately and performs zero deletions
- CLI invoked without a subcommand: prints usage and exits with code 1
- Embedding model unavailable during `reindex`: command logs the error per file, marks those records as `status='pending_embed'`, and continues with the remaining files
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 11, LOC: ~990, Systems: DB schema + indexing pipeline + MCP tools + CLI |
| Risk | 20/25 | DB schema migration, native binary, breaking change to PF030 behaviour |
| Research | 14/20 | Anchor-first chunking strategy required investigation of existing file patterns |
| Multi-Agent | 8/15 | Single implementation agent; no parallel workstreams required |
| Coordination | 10/15 | Three tightly-coupled tasks (schema, handler, CLI) with ordering dependencies |
| **Total** | **74/100** | **Level 3+** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Schema v16 migration fails on upgrade from v15 | H | L | Wrapped in transaction; idempotent design; existing data preserved on failure |
| R-002 | Chunking splits mid-anchor and degrades embedding quality | M | L | Anchor-first strategy; MAX_CHUNK_CHARS applied only when anchor boundaries are absent |
| R-003 | `memory_bulk_delete` auto-checkpoint fails and deletion proceeds without a restore point | H | L | Checkpoint failure halts deletion and returns error before any rows are removed |
| R-004 | CLI module resolution breaks in a future Node.js ABI upgrade | M | M | Resolution path is `__dirname`-relative; update is localised to `cli.ts` only |
| R-005 | Files in the 50-100K zone grow beyond MAX_CHUNK_CHARS per anchor section | M | M | Fallback to character splitting with logged warning; no failure |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Large Memory File Indexing (Priority: P0)

**As a** spec kit user, **I want** memory files over 50KB to index successfully, **so that** large context files accumulated over long sessions are searchable instead of permanently rejected.

**Acceptance Criteria**:
1. Given a memory file of 120KB with ANCHOR sections, When `memory_save` is called, Then a parent record and multiple child records appear in the index with embeddings on each child
2. Given a memory file of 40KB, When `memory_save` is called, Then a single record is created with no parent-child split (behaviour unchanged)

### US-002: Tier-Based Bulk Delete (Priority: P0)

**As a** spec kit operator, **I want** to delete all memories of a given tier in a single MCP tool call, **so that** I can run cleanup workflows without bypassing MCP tools or writing raw SQL.

**Acceptance Criteria**:
1. Given 722 deprecated memories, When `memory_bulk_delete({ tier: "deprecated", confirm: true })` is called, Then all 722 are deleted, a checkpoint is auto-created, and the response includes the restore command
2. Given no `confirm: true` in the call, When `memory_bulk_delete` is called, Then it returns an error and deletes nothing

### US-003: CLI from Any Directory (Priority: P1)

**As a** spec kit operator, **I want** to run CLI commands from the project root without `cd`-ing into the MCP server directory, **so that** bulk operations integrate cleanly into project-root shell scripts.

**Acceptance Criteria**:
1. Given the project root as working directory, When `node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats` is run, Then it exits 0 and prints tier distribution without module resolution errors
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Engineering Lead | Approved | 2026-02-21 |
| Design Review | Engineering Lead | Approved | 2026-02-21 |
| Implementation Review | Engineering Lead | Approved | 2026-02-21 |
| Launch Approval | Engineering Lead | Approved | 2026-02-21 |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance

- [x] Security review completed — bulk delete requires `confirm: true`; constitutional/critical tiers require `specFolder` scope
- [x] OWASP Top 10 addressed — no user-facing endpoints; all inputs validated at handler level
- [x] Data protection requirements met — auto-checkpoint before deletion provides undo path

### Code Compliance

- [x] Coding standards followed — TypeScript throughout; consistent with MCP server patterns
- [x] License compliance verified — no new external dependencies introduced
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Engineering Lead | Implementation | High — schema changes touch live DB | Sync at schema migration gate |
| Spec Kit Users | End users | High — indexing reliability directly affects session context | Release note in SKILL.md |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-21)
**Initial specification** — covers all three tasks: chunked indexing, bulk delete tool, CLI entry point
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None — all questions resolved during implementation. Retrieval-time chunk reassembly deferred to a follow-up spec.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md` (138-hybrid-rag-fusion)
