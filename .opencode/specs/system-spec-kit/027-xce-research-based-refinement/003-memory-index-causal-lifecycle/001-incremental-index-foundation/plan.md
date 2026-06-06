---
title: "Implementation Plan: 027/003 Incremental Index Foundation"
description: "Plan for additive memoization, dependency DAG, and durable chunk fingerprint support in Spec Kit memory indexing. The current system keeps file-level fast paths; this phase adds precise derived-state invalidation before scan behavior changes."
trigger_phrases:
  - "027 phase 003"
  - "incremental memory index"
  - "memoization dependency dag"
  - "chunk fingerprints"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/001-incremental-index-foundation"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Planned memo, DAG, and chunk-fingerprint foundation"
    next_safe_action: "Start with additive schema/storage helpers before modifying scan behavior."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-003-research-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Memo tables, dependency edges, chunk fingerprints, and chunk line spans are absent."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 027/003 Incremental Index Foundation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | SQLite memory index, embedding cache, parser/chunk rows |
| **Testing** | Vitest plus scan-planning fixtures |

### Overview

Phase 003 adds the storage and planning foundation for precise incremental indexing. It does not replace the current file-level fast path immediately; it first adds canonical fingerprints, memo records, dependency edges, and stable chunk metadata so scan planning can prove what changed before parsing and embedding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Continuation research confirmed current indexing is mtime/content-hash based.
- [x] Missing primitives are identified: memo tables, dependency edges, canonical fingerprints, chunk fingerprints, chunk kind, and chunk line spans.
- [x] Existing hash and chunk infrastructure are known reuse points.

### Definition of Done
- [ ] Additive schema for memo records, dependency edges, and chunk metadata is migrated safely.
- [ ] Typed storage helpers exist before handler behavior changes.
- [ ] Parser/chunking produces stable chunk ids, fingerprints, kinds, and line spans.
- [ ] Scan planning reports memo hits, chunk hits, and dependency-invalidated counts.
- [ ] Existing whole-file skip fallback remains available during rollout.
- [ ] Strict validation passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive storage foundation with conservative handler integration. The memo/DAG layer sits below `memory-index.ts` and above parser/chunk/embedding sinks.

### Key Components
- **Canonical fingerprint helper**: produces deterministic input and code fingerprints from normalized parser inputs.
- **Memo storage helper**: owns memo records, code-hash checks, dependency edges, and invalidation traversal.
- **Chunk identity metadata**: adds stable chunk ids, fingerprints, kinds, and source line spans to indexed rows.
- **Scan planning adapter**: consults memo/DAG state before parsing or embedding and reports why work was skipped or invalidated.

### Data Flow

`memory_index_scan` discovers candidate files, calls incremental planning, checks memo records and dependency edges, parses only changed inputs, computes chunk fingerprints, writes changed rows, and records dependency edges for future invalidation. If memo state is absent or stale, the existing file-level path remains the safe fallback.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/search/vector-index-schema.ts` | Owns SQLite memory schema and migrations | Add memo/dependency tables and chunk metadata columns | Migration fixture on existing DB |
| `mcp_server/lib/storage/memo.ts` | Missing | Create typed memo and dependency-edge storage helper | Unit tests for CRUD and invalidation |
| `mcp_server/lib/storage/canonical-fingerprint.ts` | Missing | Create deterministic input/code fingerprint helper | Golden fingerprint tests |
| `mcp_server/lib/storage/incremental-index.ts` | File-level mtime/content-hash skip planner | Add DAG traversal and memo planning APIs | Planning tests with changed/unchanged inputs |
| `mcp_server/lib/parsing/memory-parser.ts` | Emits whole-content hash only | Emit stable chunk metadata | Parser fixtures for anchors/headings/fallbacks |
| `mcp_server/handlers/chunking-orchestrator.ts` | Stores parent/chunk index/label | Persist chunk identity metadata | Chunk row fixture tests |
| `mcp_server/handlers/memory-index.ts` | Orchestrates scan planning and writes | Consult memo/DAG state before parse/embed | Scan summary includes memo/chunk/dependency counters |

Revalidated 2026-06-05 (relevance audit): STILL-RELEVANT — current indexing is still file-level mtime/content-hash (`lib/storage/incremental-index.ts`); recent async-scan/orphan-sweep commits (`9998edfd37`, `156a0b469f`, `9156d60cc3`) added no memoization, dependency-DAG, or chunk-fingerprint mechanism. Planned `memoization_records`/`dependency_edges`/`canonical-fingerprint.ts`/`memo.ts` and chunk-fingerprint columns remain unbuilt.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema and Helpers
- [ ] Add additive migrations for `memoization_records` and `dependency_edges`.
- [ ] Add chunk metadata columns: `chunk_id`, `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, and `chunk_end_line`.
- [ ] Create `canonical-fingerprint.ts` and golden tests.
- [ ] Create `memo.ts` with memo CRUD, code-hash checks, dependency insertion, and cycle rejection.

### Phase 2: Parser and Chunk Metadata
- [ ] Extend parser output with anchor-first chunk identity.
- [ ] Prefer `anchor:<id>`, then heading slug, then fixed window fallback.
- [ ] Compute chunk fingerprints from chunk-local normalized content, not whole-file content.
- [ ] Persist chunk kind and line spans as metadata only, not identity.

### Phase 3: Scan Planning Integration
- [ ] Extend `incremental-index.ts` to expose memo/dependency planning.
- [ ] Update `memory-index.ts` to consult planning before parse/embed.
- [ ] Preserve existing whole-file skip fallback for missing or corrupt memo state.
- [ ] Add scan summary fields for memo hits, chunk hits, and dependency-invalidated rows.

### Phase 4: Verification
- [ ] Test no-op scans produce memo hits and zero new embedding writes.
- [ ] Test external line additions do not change untouched chunk fingerprints.
- [ ] Test changing one chunk invalidates only its dependent rows.
- [ ] Test code-hash changes force recomputation.
- [ ] Run strict validation for this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Canonical fingerprint stability and code-hash invalidation | Vitest |
| Unit | Memo/dependency CRUD, cycle rejection, dependency traversal | Vitest |
| Parser fixture | Anchor, heading, frontmatter, and fallback chunk identity | Vitest |
| Integration | Scan summary counters and no-op embedding behavior | Vitest |
| Migration | Existing DB additive migration | Vitest/SQLite fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `memory_index` parent/chunk rows | Internal | Available | Base storage shape for additive columns. |
| Existing file-level incremental index | Internal | Available | Safe fallback during memo rollout. |
| Phase 006 statediff | Downstream | Waits on this phase | Needs stable diff keys and chunk identities. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Memo planning invalidates unrelated rows, causes scan failures, or changes chunk identity unpredictably.
- **Procedure**: Disable memo/DAG planning and fall back to the existing file-level skip path; leave additive schema inert.
- **Data Safety**: Additive tables/columns can remain unused until fixed; no destructive migration is planned.
<!-- /ANCHOR:rollback -->
