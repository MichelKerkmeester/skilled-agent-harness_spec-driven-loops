---
title: "Decision Record: Index Large Files — Chunked Indexing, Bulk Delete, and CLI [010-index-large-files/decision-record]"
description: "The MCP server enforced a 100KB hard gate (MCP_MAX_CONTENT_LENGTH in preflight.ts:538) that rejected files outright before they reached the embedding pipeline. The real constrai..."
trigger_phrases:
  - "decision"
  - "record"
  - "index"
  - "large"
  - "files"
  - "decision record"
  - "010"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Index Large Files — Chunked Indexing, Bulk Delete, and CLI

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: 50K Character Chunking Threshold

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Engineering Lead |

---

### Context

The MCP server enforced a 100KB hard gate (`MCP_MAX_CONTENT_LENGTH` in `preflight.ts:538`) that rejected files outright before they reached the embedding pipeline. The real constraint is the embedding quality ceiling: at 8000 tokens and ~3.5 chars/token, the usable embedding window is approximately 28K chars. We needed a chunking threshold that would stay well under that window while leaving room for anchor-section overhead and still treating the 100KB gate as a safety net rather than a processing limit.

### Constraints

- Embedding model input window: 8000 tokens (~28K chars effective limit)
- Existing `MCP_MAX_CONTENT_LENGTH` hard gate: 100K chars (retained as outer bound)
- Target chunk size: small enough for clean embeddings, large enough to avoid excessive child record counts
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Trigger chunking at 50K chars (`CHUNKING_THRESHOLD=50000`), with target chunk size of 4K chars (`TARGET_CHUNK_CHARS=4000`) and a hard maximum per chunk of 12K chars (`MAX_CHUNK_CHARS=12000`).

**How it works**: Files at or below 50K chars index as single records via the existing path. Files above 50K enter the chunking branch where `anchor-chunker.ts` splits them into segments. Each segment targets 4K chars, allowing natural grouping of multiple small anchors. No individual chunk exceeds 12K chars regardless of anchor structure.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **50K threshold (chosen)** | Well under 28K embedding window; leaves headroom; clear margin from 100K outer gate | Chunks large-but-reasonable files (50-100K) that are common in production | 9/10 |
| 100K threshold | Matches existing gate exactly; minimal changes to preflight | Pushes chunks near or over the embedding window; embedding quality degrades silently | 4/10 |
| 28K threshold | Perfectly matches embedding window | Chunks many more files than necessary; inflates DB record count for moderate-sized files | 6/10 |

**Why this one**: 50K sits in the middle of the embedding window, giving a clean 1.8x safety margin. Files between 50-100K are chunked instead of rejected, which addresses all four currently-failing files. Files under 50K (the vast majority) are unaffected.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Files up to 100K now index successfully instead of failing with `PF030`
- Embedding quality stays high because no chunk approaches the model's input limit

**What it costs**:
- Files in the 50-100K range produce 13-25 child records each, increasing DB record count. Mitigation: parent record has no embedding; child records are small and share the parent's `file_path` for retrieval.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future files exceed 100K and hit the outer hard gate | M | Outer gate remains; files above 100K still fail with `PF030`; threshold can be raised in a follow-up |
| 12K MAX_CHUNK_CHARS splits a large anchor section mid-paragraph | L | Fallback logs a warning; embedding quality impact is minor for oversized single sections |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four 101-104KB files failing `PF030`; 27 more in danger zone |
| 2 | **Beyond Local Maxima?** | PASS | Three threshold options evaluated (28K, 50K, 100K) with trade-offs documented |
| 3 | **Sufficient?** | PASS | 50K covers all currently-failing files with clean embedding margin |
| 4 | **Fits Goal?** | PASS | Directly unblocks the four rejected files without changing behaviour for sub-50K files |
| 5 | **Open Horizons?** | PASS | Threshold is a named constant (`CHUNKING_THRESHOLD`); adjustable without code changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `anchor-chunker.ts`: exports `CHUNKING_THRESHOLD=50000`, `TARGET_CHUNK_CHARS=4000`, `MAX_CHUNK_CHARS=12000`
- `preflight.ts`: converts `PF030` from hard error to warning for files >= `CHUNKING_THRESHOLD`

**How to roll back**: Revert the `CHUNKING_THRESHOLD` constant to a value above 100K (e.g., `Infinity`) to make `needsChunking()` always return `false`; restore the hard `PF030` error in `preflight.ts`. No DB changes required for rollback.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Anchor-First Chunking Strategy

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Engineering Lead |

---

### Context

Once the chunking threshold was set, we needed a strategy for deciding where to split files. Memory files in this system already use ANCHOR tags extensively (observed: 47-48 anchors per large file in production). Splitting at arbitrary character boundaries would cut across semantic units, degrading retrieval precision. We needed a splitting strategy that respects the existing structure of memory files.

### Constraints

- Memory files use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` markup throughout
- A single anchor section can range from a few hundred to several thousand characters
- Chunking must be predictable: same file always produces same chunk boundaries
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Anchor-first splitting — extract all ANCHOR sections first, group small sections until the group reaches `TARGET_CHUNK_CHARS` (4K), cap at `MAX_CHUNK_CHARS` (12K), then fall back to markdown heading splits, then character splits.

**How it works**: `chunkLargeFile()` runs a regex over the file to extract named ANCHOR blocks. Blocks are accumulated into a working chunk until the next block would push it over `TARGET_CHUNK_CHARS`. The current chunk is sealed and a new one begins. If no ANCHOR tags exist, the function tries splitting on `##` / `###` headings. If no headings exist, it falls back to hard character splits at `MAX_CHUNK_CHARS`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Anchor-first (chosen)** | Uses existing semantic structure; no splits mid-anchor; chunk labels inherit anchor names | Requires files to have anchors for best results; fallback is less precise | 9/10 |
| Sentence-level splitting | Very fine-grained; never splits a sentence | 4K-char chunks from sentence boundaries are arbitrary; no semantic coherence | 5/10 |
| Fixed character splits only | Simple implementation; predictable | Completely ignores semantic structure; splits mid-paragraph, mid-anchor | 3/10 |
| Heading-only splits | Uses document structure | Memory files may have flat anchor structure without headings | 6/10 |

**Why this one**: Anchor tags are already the primary semantic unit in memory files. Using them as split boundaries means each chunk corresponds to a complete thought or decision record, which produces higher-quality embeddings for retrieval.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Each chunk corresponds to a named, semantically coherent section (anchor name becomes `chunk_label`)
- Retrieval returns the parent `file_path` so callers can load the full file if needed

**What it costs**:
- Files without ANCHOR tags get lower-quality splits (heading or character boundary). Mitigation: all standard memory files use anchors; this only affects non-standard files.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Single anchor section exceeds MAX_CHUNK_CHARS (12K) | L | Section is split at character boundary with a warning logged; retrieval still works |
| Future memory file format drops ANCHOR tags | M | Heading fallback activates automatically; no code change needed |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without structure-aware splitting, embedding quality degrades for large files |
| 2 | **Beyond Local Maxima?** | PASS | Four strategies evaluated (anchor, sentence, fixed, heading) |
| 3 | **Sufficient?** | PASS | Three-level fallback handles all realistic file structures |
| 4 | **Fits Goal?** | PASS | Directly produces high-quality searchable chunks from existing memory file format |
| 5 | **Open Horizons?** | PASS | Fallback chain is extensible; new splitting strategies can be added without changing the main path |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `anchor-chunker.ts`: anchor extraction regex, grouping loop, three-level fallback
- `memory-save.ts`: uses `chunk_label` from anchor name for each child record's `chunk_label` column

**How to roll back**: Remove the chunking branch in `memory-save.ts`; existing chunked records remain but new saves revert to single-record behaviour. Chunked child records do not break retrieval — they simply become orphaned (no parent relationship). A cleanup query can remove them.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Parent-Child Storage Model for Chunked Records

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Engineering Lead |

---

### Context

Once a file is chunked into segments, we needed a storage model that allows vector search to operate on individual chunks while still exposing the originating file path to callers. Options ranged from embedding only the first chunk under the original record ID to creating fully independent records per chunk.

### Constraints

- Vector search operates on the embedding column per record; a record with no embedding cannot be retrieved
- Callers need the originating `file_path` to load the full file if a chunk matches
- `ON DELETE CASCADE` must clean child records when a parent is deleted
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: One parent record (no embedding, `status='partial'`) plus N child records (each with embedding, `parent_id` FK to parent, `chunk_index`, `chunk_label`).

**How it works**: `indexChunkedMemoryFile()` inserts the parent row first (gets an `id`), then iterates chunks and inserts child rows with `parent_id = parent.id`. Search returns child records that match the query vector; the child row includes the parent's `file_path` via a JOIN or via the child inheriting the `file_path` value at insert time. The parent record is excluded from vector search results because it has no embedding.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parent-child (chosen)** | Clean cascade delete; file_path on each child avoids JOIN; parent record tracks total chunk count | Increases record count; parent excluded from search | 9/10 |
| Embed only first chunk, discard rest | Simple; no schema change | Loses all information beyond first ~4K chars; defeats the purpose | 1/10 |
| Fully independent records per chunk | Simplest query; no FK needed | No way to know which records came from the same file; cascade delete impossible | 4/10 |
| Single record with JSON chunk array | One row per file | JSON embedding array is non-standard; vector search cannot operate on it | 2/10 |

**Why this one**: The parent-child model gives exact DELETE CASCADE semantics, makes chunk provenance explicit (which file, which chunk index, which anchor section), and keeps each child independently searchable without requiring a JOIN at retrieval time.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Deleting the parent automatically deletes all its children via `ON DELETE CASCADE`
- Each child record is independently searchable by vector distance
- `chunk_label` stores the anchor name, making chunk identity human-readable

**What it costs**:
- Record count increases by 13-25 per chunked file. Mitigation: parent has no embedding, so vector search skips it entirely; DB size impact is proportional to chunk count, not a hidden multiplier.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Child records returned in search missing parent context | M | `file_path` is stored on each child at insert time; no JOIN required to get the source file |
| Schema v16 migration fails leaving orphaned child columns | H | Migration is transactional; rollback preserves v15 schema |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a storage model, chunking cannot persist to DB |
| 2 | **Beyond Local Maxima?** | PASS | Four storage models evaluated |
| 3 | **Sufficient?** | PASS | Satisfies cascade delete, independent search, and file provenance requirements |
| 4 | **Fits Goal?** | PASS | Directly enables chunked file retrieval with minimal JOIN overhead |
| 5 | **Open Horizons?** | PASS | `parent_id` FK is a standard relational pattern; future tooling can traverse parent-child without schema changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `vector-index-impl.ts`: schema v16 adds `parent_id`, `chunk_index`, `chunk_label`; migration adds `idx_parent_id` and `idx_parent_chunk`
- `memory-save.ts`: `indexChunkedMemoryFile()` inserts parent then children

**How to roll back**: Remove the three v16 columns is not cleanly reversible in all SQLite versions. Roll back via checkpoint restore (pre-migration snapshot). New saves after rollback use single-record path; existing chunked records remain inert (no embedding on parent, children retrievable).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Safety Gates for `memory_bulk_delete`

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Engineering Lead |

---

### Context

Bulk deletion of memories is a destructive, irreversible operation if done without a restore point. The existing `memory_delete` tool only deletes by `id` or `specFolder`, making bulk cleanup of 722 deprecated memories impossible within MCP tooling. We needed a new tool that could operate at tier scope but with meaningful safety constraints to prevent accidental mass deletion of high-importance memories.

### Constraints

- Constitutional and critical tier memories are the system's highest-value records
- Auto-checkpoint must be atomic with deletion: if checkpoint fails, deletion must not proceed
- Tool must be callable without operator writing raw SQL
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: `confirm: true` required for all calls; constitutional and critical tier deletions additionally require an explicit `specFolder` scope; auto-checkpoint created before any deletion with halt-on-failure semantics.

**How it works**: Handler validates `confirm === true` first; returns error immediately if absent. For `constitutional` or `critical` tier, validates `specFolder` is non-empty. Calls `checkpoint_create` and captures the checkpoint name. If checkpoint fails, returns error and exits without running the `DELETE` statement. On success, runs `DELETE WHERE importance_tier = ? [AND spec_folder LIKE ?] [AND created_at < ?]`, cleans causal edges, writes mutation ledger, returns `{ deleted: N, restoreCommand }`.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **confirm + tier scope + auto-checkpoint (chosen)** | Layered safety; undo capability; explicit intent required | Slightly more verbose call; auto-checkpoint adds ~500ms | 9/10 |
| confirm only, no auto-checkpoint | Simpler | No undo if operator makes a mistake | 4/10 |
| No safety gates, direct delete | Simplest implementation | Dangerous; one mistyped tier wipes all memories of that class | 1/10 |
| Soft delete (set status='deleted') | Reversible without checkpoint | Doubles DB storage; complicates all query paths | 5/10 |

**Why this one**: Layered gates (confirm, then scope, then checkpoint) mean multiple independent checks must pass before irreversible data loss is possible. The auto-checkpoint means a mistake is recoverable without manual intervention.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Bulk cleanup of 722 deprecated memories is now possible in one MCP tool call
- Auto-checkpoint provides a recovery path for any accidental deletion
- Constitutional/critical memories cannot be mass-deleted without explicit scope

**What it costs**:
- Auto-checkpoint adds ~500ms per bulk-delete call. Mitigation: this is a maintenance operation, not a hot path; latency is acceptable.
- Callers must pass `confirm: true` explicitly; tooling that calls without it gets an error. Mitigation: the error message explains the required parameter.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auto-checkpoint failure leaves operator unable to delete | M | Error message includes suggestion to check DB disk space; checkpoint failure does not corrupt data |
| Operator passes correct `specFolder` but accidentally wipes a critical folder | M | Auto-checkpoint allows restore via `checkpoint_restore({ name: restoreCommand })` |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 722 deprecated memories cannot be cleaned within existing MCP tooling |
| 2 | **Beyond Local Maxima?** | PASS | Four approaches evaluated (layered gates, confirm-only, no gates, soft delete) |
| 3 | **Sufficient?** | PASS | Three-layer safety (confirm + scope + checkpoint) covers all realistic accidental-deletion scenarios |
| 4 | **Fits Goal?** | PASS | Directly enables the `/memory:manage cleanup` workflow without bypassing MCP tools |
| 5 | **Open Horizons?** | PASS | `olderThanDays` filter is optional; future filters (e.g., by quality score) can be added without changing the safety gate structure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `memory-bulk-delete.ts`: full handler with layered safety
- `tool-schemas.ts`: `memoryBulkDelete` schema with `confirm`, `tier`, `specFolder`, `olderThanDays`
- `types.ts`: `BulkDeleteArgs` interface
- `memory-tools.ts`: dispatch registration
- `handlers/index.ts`: export

**How to roll back**: Remove `'memory_bulk_delete'` from `TOOL_NAMES` and the dispatch case in `memory-tools.ts`. The handler file can remain; it becomes unreachable. DB and schema are unaffected.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: `__dirname`-Based Module Resolution for CLI

<!-- ANCHOR:adr-005-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Engineering Lead |

---

### Context

Running `node -e "require('better-sqlite3')"` from the project root fails because `better-sqlite3` only exists inside the MCP server's own `node_modules/` at `mcp_server/node_modules/`. Operators needed to `cd` into `mcp_server/` before running any direct DB script, which was fragile and undocumented. The CLI entry point needed to work from the project root.

### Constraints

- `better-sqlite3` is a native module; its binary is tied to the specific Node.js ABI that compiled it
- The CLI must not introduce a new copy of `better-sqlite3`; it must use the one already compiled for the MCP server
- `process.cwd()` varies by caller; it cannot be used to locate `node_modules`
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Resolve `better-sqlite3` using `path.resolve(__dirname, '../node_modules')` added to `module.paths` at CLI startup, where `__dirname` is the compiled `dist/` directory (always adjacent to `node_modules/`).

**How it works**: At the top of `cli.ts`, before any `require`, the script inserts `path.resolve(__dirname, '../node_modules')` into `module.paths`. Since `cli.ts` compiles to `dist/cli.js` and `node_modules/` is a sibling of `dist/`, `__dirname` resolves correctly regardless of the caller's working directory.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`__dirname`-relative module path injection (chosen)** | Works from any CWD; no new dependency; no copy of `better-sqlite3` | Relies on compiled output layout staying stable | 9/10 |
| Document the `cd` workaround | Zero code changes | Fragile; breaks if caller script changes CWD; undiscoverable | 2/10 |
| Copy `better-sqlite3` to project root `node_modules` | Works from project root natively | Creates a second native binary that must be kept in sync with the MCP server's version | 3/10 |
| Use a shell wrapper script | Transparent to callers | Platform-specific (`sh` vs. `bat`); harder to maintain | 5/10 |

**Why this one**: `__dirname` is a Node.js built-in that is always the directory of the executing file, independent of CWD. Because the compiled output layout is deterministic (`dist/cli.js` next to `node_modules/`), this approach is reliable without any platform-specific logic.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- `cli.js stats` and other subcommands run correctly from the project root
- No documentation burden; the fix is self-contained in the compiled binary

**What it costs**:
- If `dist/` is moved relative to `node_modules/`, the path injection breaks. Mitigation: this layout is conventional for TypeScript projects and unlikely to change.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Node.js ABI upgrade requires recompiling `better-sqlite3` | M | Already required for the MCP server; no additional surface introduced by the CLI |
| `dist/cli.js` moved outside the `mcp_server/` directory | M | `__dirname` path resolves to the wrong directory; fix is a one-line path update in `cli.ts` |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CLI fails to start from project root without this fix |
| 2 | **Beyond Local Maxima?** | PASS | Four approaches evaluated |
| 3 | **Sufficient?** | PASS | Single `module.paths` insertion resolves all `require` calls in CLI to the correct `node_modules` |
| 4 | **Fits Goal?** | PASS | Directly unblocks project-root CLI invocation |
| 5 | **Open Horizons?** | PASS | Approach is localised to `cli.ts`; does not affect MCP server or any other module |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `cli.ts`: `module.paths.unshift(path.resolve(__dirname, '../node_modules'))` before any `require`
- `package.json`: `spec-kit-cli` bin entry pointing to `dist/cli.js`

**How to roll back**: Delete `cli.ts` and remove the `spec-kit-cli` bin entry from `package.json`. No DB or schema changes required.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
