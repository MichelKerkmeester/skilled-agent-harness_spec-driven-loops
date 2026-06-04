---
title: "003 — Incremental Index Foundation"
description: "Introduce canonical-input memoization, dependency edges, and chunk-level fingerprints for incremental Spec Kit Memory indexing. The goal is to skip unchanged derived work and re-embed only changed document chunks instead of whole files."
trigger_phrases:
  - "memoization dependency dag"
  - "chunk fingerprint"
  - "incremental memory_index_scan"
  - "canonical fingerprint"
  - "skip re-embedding unchanged chunks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027-xce-research-based-refinement/003-incremental-index-foundation"
    last_updated_at: "2026-05-13T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "authored spec"
    next_safe_action: "design schema"
    blockers: []
    key_files:
      - "lib/search/vector-index-schema.ts"
      - "lib/storage/incremental-index.ts"
      - "handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-003-spec-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "chunking strategy"
    answered_questions:
      - "tree-sitter deferred"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 003 — Incremental Index Foundation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-05-13 |
| **Branch** | `scaffold/003-incremental-index-foundation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 001-rename-mcp-namespace-mk-spec-memory |
| **Successor** | 004-causal-edge-tombstones |
| **Handoff Criteria** | Incremental scans use canonical fingerprints, dependency edges, and chunk fingerprints to avoid redundant parsing and embedding work. |

### Research Basis

| Source | Evidence |
|--------|----------|
| `external/cocoindex-main/rust/core/src/state/db_schema.rs:48` | `StablePathEntryKey::ComponentMemoization => e.write_u8(0x20),` shows component-level memo state as a first-class persisted key. |
| `external/cocoindex-main/rust/core/src/state/db_schema.rs:49` | `StablePathEntryKey::FunctionMemoizationPrefix => e.write_u8(0x30),` separates function memo records from component memo records. |
| `external/cocoindex-main/rust/core/src/engine/function.rs:33` | `Returned by [reserve_memoization]. Use [cached()]` describes a cache-hit guard around function-call memo entries. |
| `external/cocoindex-main/rust/core/src/engine/function.rs:108` | `If a cached result exists` establishes the skip-before-execute memoization behavior to port. |
| `external/cocoindex-main/rust/core/src/engine/component.rs:48` | `Fingerprint of the memoization key. When matching, re-processing can be skipped.` is the direct component-level invariant. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:436` | `const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing(files);` shows the current coarse file-level incremental gate. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2412` | `parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE,` shows chunk rows already have a parent-child shape to extend. |
| `research/research.md:234` | Packet 028 scope combines K1.1 and K1.4: canonicalization, memo tables, DAG-aware scan planning, anchor-first chunk rows, and chunk fingerprints. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is the foundation for incremental indexing. The current system can skip at the file level, but it does not model derived state as a graph of inputs and outputs. CocoIndex shows two transferable ideas: memo records keyed by stable fingerprints and dependency-aware invalidation rather than repeating the entire processing path.

**Scope Boundary**: replace the single-pass, whole-file scan behavior with canonical-fingerprint memoization, dependency edges, and chunk-level fingerprints. This packet does not add tree-sitter chunking, async runtime semantics, or multi-LLM extraction.

**Dependencies**:
- Existing `memory_index` parent and chunk columns remain the base storage shape.
- Incremental scan categorization remains the integration point, but becomes DAG-aware.
- Canonical fingerprinting must be deterministic across equivalent structured inputs.

**Deliverables**:
- Additive SQLite schema for memoization records, dependency edges, and chunk fingerprint metadata.
- TypeScript canonical-hash module for normalized input fingerprints and code hashes.
- Anchor-first chunk identity that survives unrelated line additions.
- Scan planner that invalidates downstream rows only when relevant inputs change.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`memory_index_scan` currently reconsiders all discovered files every run, then uses file-level categorization to decide index, update, skip, or delete. The skip path is based on coarse content and mtime state, not on a durable record of which derived outputs depend on which canonical inputs.

That means a single-line edit in a long spec can cause whole-document embedding work even when only one section changed. It also means downstream rows such as embeddings, lexical rows, summaries, graph projections, and chunk records cannot be invalidated precisely because they do not have stable dependency edges.

### Purpose

Cache derived indexing work by canonical input fingerprint and code hash, then use a dependency DAG and chunk fingerprints so unchanged inputs skip reprocessing and changed document sections re-embed only their affected chunk rows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `memoization_records(component_path, input_fingerprint, code_hash, output_blob, computed_at)`.
- Add `dependency_edges(parent_path, child_path, kind)` for derived-state invalidation.
- Extend `memory_index` with `chunk_id`, `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, and `chunk_end_line`.
- Add `lib/storage/canonical-fingerprint.ts` to produce deterministic fingerprints from normalized structured inputs.
- Add `lib/storage/memo.ts` for CRUD over memoization records and dependency edges.
- Add `lib/storage/incremental-index.ts` DAG walking so dependents invalidate when inputs change.
- Extend `lib/parsing/memory-parser.ts` with anchor-first chunk identity.
- Use chunk identity in this order: `anchor:<id>`, then heading slug, then fixed window fallback.
- Update `handlers/memory-index.ts` so scan planning consults memo state before parsing and embedding.

### Out of Scope

- Tree-sitter chunking for code-aware semantic splits.
- Async runtime or long-running worker architecture changes.
- Multi-LLM extraction, summarization arbitration, or causal-edge extraction.
- Replacing all storage writes with statediff; that is packet 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add memo tables, dependency table, chunk metadata columns, indexes, and additive migrations. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts` | Create | Encapsulate memo record reads, writes, and invalidation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/canonical-fingerprint.ts` | Create | Produce deterministic input and code fingerprints for indexing components. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | Modify | Add DAG traversal and dependent invalidation to existing categorization. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Emit stable chunk ids, fingerprints, kinds, and line spans. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Plan scan work from memo and DAG state, then write only affected rows. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Unchanged files skip re-embedding through memoization, not only mtime comparison. | A no-op `memory_index_scan` records zero new embedding writes and reports memo hits for unchanged files. |
| REQ-002 | Chunk fingerprints are stable across line additions outside the chunk. | Adding text above or below an H2 section does not change that section's `chunk_fingerprint` when its own content is unchanged. |
| REQ-003 | The cold scan budget is under 150 ms on a 100-file corpus. | Benchmark fixture with 100 representative spec files reports sub-150 ms planning time before embedding provider latency. |
| REQ-004 | Schema migrations are additive and safe for existing databases. | Existing DBs migrate via `ALTER TABLE` and `CREATE TABLE IF NOT EXISTS` without dropping memory rows. |
| REQ-005 | Dependency DAG traversal invalidates downstream rows. | Changing a canonical source input invalidates child rows listed in `dependency_edges` and leaves unrelated rows untouched. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Chunk identity uses anchor-first fallback order. | Parser tests show `anchor:<id>` wins over heading slug and window fallback. |
| REQ-007 | Memo output records include the code hash that produced them. | Changing the canonicalizer or parser code hash forces recomputation even when source content is unchanged. |
| REQ-008 | Scan output explains why work was skipped. | `memory_index_scan` summary includes memo-hit, chunk-hit, and dependency-invalidated counts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running `memory_index_scan` after a no-op produces zero new embeddings.
- **SC-002**: Editing one H2 section of a 2000-line document re-embeds only that chunk.
- **SC-003**: Adding lines outside a chunk does not change the chunk id or chunk fingerprint for untouched chunks.
- **SC-004**: Existing DBs migrate without losing rows from `memory_index`, embedding cache, or causal graph tables.
- **SC-005**: Scan telemetry distinguishes whole-file skips, chunk-level skips, and DAG-triggered invalidations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Schema migration on existing DBs. | High | Use additive columns and tables, backfill lazily, and keep old file-level skip logic as fallback during migration. |
| Risk | Chunk ids can drift when headings are renamed. | Medium | Prefer anchors, then heading slugs, then window fallback; include line spans only as metadata, not identity. |
| Risk | Code hash churn can invalidate too much work. | Medium | Hash only canonicalizer and parser logic that changes derived outputs, not unrelated formatting. |
| Risk | DAG cycles would make invalidation unsafe. | High | Enforce acyclic dependency insertion and fail scan planning on detected cycles. |
| Dependency | Parser emits stable line spans and content slices. | Medium | Add fixture tests for frontmatter, anchor sections, H2 sections, and fallback windows. |
| Dependency | Packet 006 will depend on stable diff keys. | Medium | Treat `chunk_id` and `chunk_fingerprint` as public storage contract once this packet lands. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the first chunking implementation use H2 sections only, or H2 plus frontmatter and `_memory.continuity` blocks?
- Should `memoization_records.output_blob` store full derived outputs or compact manifests that point to target rows?
- Should dependency edges use file paths for the first version, or canonical memory ids where available?
- What exact code surfaces should be included in the code hash: parser only, canonicalizer only, or parser plus embedding target adapters?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
