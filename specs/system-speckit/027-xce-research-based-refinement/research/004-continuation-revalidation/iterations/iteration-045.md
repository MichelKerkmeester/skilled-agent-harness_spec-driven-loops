# Iteration 045: Incremental index foundation revalidation

## Scope
Revalidate `003-incremental-index-foundation` against current `handlers/memory-index.ts`, `lib/storage/incremental-index.ts`, `lib/search/vector-index-schema.ts`, parser/chunk rows, and confirm whether chunk fingerprints, memoization, and dependency DAG support are still missing.

## Method
- Read packet state first from the continuation artifact root.
- Read the 003 spec and current memory indexing, incremental indexing, schema, parser, and chunking files.
- Searched current repository code for memo tables, dependency edges, chunk metadata, and parser chunk-fingerprint support.

## Cited Findings
1. Current incremental scan planning is still file-level: `memory-index.ts` imports `incremental-index.ts` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:26], categorizes discovered files via `incrementalIndex.categorizeFilesForIndexing(files)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:662], and records only `fast_path_skips` plus `mtime_changed` in the summary [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:642]. There are no memo-hit, chunk-hit, or dependency-invalidated counters in the current result shape.
2. `incremental-index.ts` remains mtime/content-hash based, not memo/DAG based: stored metadata includes `file_mtime_ms`, `content_hash`, and `embedding_status` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:36]; `shouldReindex()` skips on near-equal mtime, optionally checks whole-file content hash, and otherwise marks the file modified [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:206]. The exported API includes categorization, stale path deletion, move reconciliation, and mtime updates, but no memo or dependency traversal API [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:660].
3. The requested memoization/dependency files are absent: `lib/storage/memo.ts` and `lib/storage/canonical-fingerprint.ts` were not found [INFERENCE: based on current Glob for `.opencode/skills/system-spec-kit/mcp_server/lib/storage/{memo,canonical-fingerprint}.ts` returning no files]. Current grep also found no `memoization_records` or `dependency_edges` schema entries in `mcp_server` TypeScript [INFERENCE: based on repository grep for `memoization_records|dependency_edges|chunk_id|chunk_fingerprint|chunk_kind|chunk_start_line|chunk_end_line|parent_id`].
4. Existing chunk storage is parent/ordinal/label based, not fingerprint/span based: vector schema migration v16 adds `parent_id`, `chunk_index`, and `chunk_label` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:969], and the create-table schema contains the same three fields [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2641]. The requested `chunk_id`, `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, and `chunk_end_line` are absent [INFERENCE: based on grep result above].
5. Parser output does not emit chunks or chunk fingerprints: `ParsedMemory` has `contentHash`, `content`, file metadata, type fields, causal links, `documentType`, and quality fields [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:61], and `parseMemoryContent()` computes one whole-content hash [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:342]. It does not expose stable chunk ids, chunk kinds, line spans, or chunk fingerprints.
6. Chunking currently uses labels and an embedding-cache hash, not durable chunk fingerprints: `chunking-orchestrator.ts` indexes each retained chunk, sets `anchorId: chunk.label`, and stores `chunk_index`/`chunk_label` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:295]. It computes a normalized chunk cache key for embedding reuse [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:275], but metadata applied to child rows uses the whole parsed file `contentHash`, not a per-chunk fingerprint [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:331].

## Negative Knowledge / Ruled-Out Directions
- Do not count the existing embedding cache as full 003 completion; it can skip provider calls for unchanged chunk text, but it is not persisted as chunk identity/fingerprint metadata in `memory_index`.
- Do not count mtime fast-path skips as memoization; the 003 spec requires canonical-input memoization with code hashes and dependency invalidation.
- Do not assume current chunk labels satisfy anchor-first identity; current chunk rows store labels and ordinals, but not stable chunk ids, line spans, or per-chunk fingerprints.
- Do not implement tree-sitter or multi-LLM extraction in this packet; the spec explicitly keeps those out of scope.

## Answer / Decision
`003-incremental-index-foundation` remains valid and materially unimplemented. Current indexing has useful coarse file-level incremental behavior and chunked indexing infrastructure, but it lacks canonical-input memo tables, dependency DAG rows/traversal, and durable chunk fingerprints/spans.

## Next-Step Recommendation
Start with additive schema and typed storage helpers: add memoization/dependency tables plus chunk metadata columns, then extend `incremental-index.ts` to expose memo/dependency planning before changing `memory-index.ts` scan behavior.
