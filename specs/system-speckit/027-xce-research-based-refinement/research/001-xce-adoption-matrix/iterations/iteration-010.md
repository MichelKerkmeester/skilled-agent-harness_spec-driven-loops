# Iteration 001 — IRQ1 Phase 001 HLD/LLD Determinism + Edge Cases

## Focus

IRQ1 stress-tested Phase 001's deterministic `generateHLD()`, `generateLLD()`, and `generateFileNarrative()` contract against edge cases called out in the phase spec: determinism is a P0 acceptance criterion for `generateHLD()` (`001-code-graph-hld-lld/spec.md:150`), all generation must derive from existing graph data with no LLM dependency (`001-code-graph-hld-lld/spec.md:41-43`), and the phase explicitly targets a new `code-graph-hld-lld.ts` generation layer (`001-code-graph-hld-lld/spec.md:100-104`).

## Actions Taken

- Read Phase 001 spec requirements and edge cases: determinism (`001-code-graph-hld-lld/spec.md:150`), LLD null/docstring fallback (`001-code-graph-hld-lld/spec.md:151`), high-fan-in threshold (`001-code-graph-hld-lld/spec.md:163`), and L2 data/state boundaries (`001-code-graph-hld-lld/spec.md:223-234`).
- Read SQLite schema: `code_files` tracks language, content hash, mtime, parse health, and indexed timestamp (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:107-118`); `code_nodes` stores nullable signature/docstring and per-node language/content hash (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:120-136`); `code_edges` stores source/target ids without declared foreign keys (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:138-145`).
- Read graph type surface: `SymbolKind` includes `module`, `import`, and `export` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-15`), and `EdgeType` includes `CONTAINS`, `CALLS`, `IMPORTS`, and other relationship types (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:18-21`).
- Read node capture behavior: `capturesToNodes()` creates one synthetic module node for non-empty content (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-963`) and omits that module node for empty content (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:988-992`).
- Read pass-1 baseline: the original research selected a template-only HLD/LLD schema from existing graph data (`research/research.md:26-29`) and selected template-only generation as Phase 1 over LLM generation (`research/research.md:231-249`).

## Findings

### f-iter001-001 — BLOCKING — Truncation determinism needs an explicit stable sort before slicing

Evidence: REQ-001 requires identical output across 100 calls for identical db state (`001-code-graph-hld-lld/spec.md:150`), while the 1000+ symbol edge case caps LLD output at 50 primary symbols (`001-code-graph-hld-lld/spec.md:225`). The schema exposes stable tie-break fields that can be used for ordering, including `kind`, `name`, `start_line`, `end_line`, and `symbol_id` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:122-129`), but the phase spec does not require any explicit ordering before selecting `primary_symbols[]` or `lld[]` (`001-code-graph-hld-lld/spec.md:100-104`).

Verdict: BLOCKING for Phase 001 implementation quality. Add an acceptance rule and tests requiring a stable sort before truncation, for example `kind priority -> start_line -> name -> symbol_id`, before the 50-symbol cap is applied.

### f-iter001-002 — CONFIRMED — Empty file behavior is coherent with current indexer behavior

Evidence: The phase spec requires `file_role: "empty"` and summary `"Empty file or no parsable symbols."` for files with 0 symbols (`001-code-graph-hld-lld/spec.md:223-225`). The indexer constructs a module node for the file (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-963`) but returns only captured symbol nodes when `content.trim().length === 0`, which means an empty file can naturally have no module node in `code_nodes` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:988-990`).

Verdict: CONFIRMED. No spec amendment needed for the empty-file case, but the fixture should include both an actually empty file and a comment-only file because the spec names both (`001-code-graph-hld-lld/spec.md:224`).

### f-iter001-003 — BLOCKING — Dangling edges can leak nondeterministic or invalid dependencies

Evidence: `code_edges` stores `source_id` and `target_id` as plain text fields and declares no `REFERENCES code_nodes(symbol_id)` foreign keys (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:138-145`). Phase 001 requires `generateLLD()` to emit `direct_dependencies[]` from graph edges (`001-code-graph-hld-lld/spec.md:101-103`) and pass-1 says the HLD/LLD schema derives dependencies from existing `code_edges` data (`research/research.md:26-29`).

Verdict: BLOCKING for deterministic output. `generateLLD()` should decide one deterministic policy for edge targets missing from `code_nodes`: filter them, or include a structured unresolved dependency such as `{symbol_id, unresolved: true}`. The current spec does not state which policy prevails.

### f-iter001-004 — CONFIRMED — Missing docstrings have an explicit fallback

Evidence: `code_nodes.docstring` is nullable in the schema (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:133-134`), and REQ-002 requires `docstring "" when missing` (`001-code-graph-hld-lld/spec.md:151`). The generation surface is template-only and JSON-serializable (`001-code-graph-hld-lld/spec.md:43-54`), so empty-string fallback preserves the deterministic baseline without extra parsing.

Verdict: CONFIRMED. Keep the fallback as specified and add a test with both `NULL` and empty-string docstrings because the schema permits nullable storage (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:133-134`).

### f-iter001-005 — BLOCKING — Multiple `module` symbols need a primary-module selection rule

Evidence: `SymbolKind` includes `module` as a normal symbol kind (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-15`). `capturesToNodes()` always creates one synthetic module node for non-empty content (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-963`) and also converts captures into symbol nodes using each capture's `c.kind` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:966-985`). The spec derives file role from per-file SymbolKind counts (`001-code-graph-hld-lld/spec.md:82-86`) but does not say how to treat more than one top-level `module` symbol.

Verdict: BLOCKING for the "multiple top-level module symbols" stress case. Add a deterministic rule: prefer the synthetic file module by `fq_name === getModuleName(filePath)` when available, then fall back to lowest `start_line`, then `symbol_id`.

### f-iter001-006 — NO-CHANGE-NEEDED — Mixed embedded language content should not expand Phase 001 scope

Evidence: `code_files` has one `language` value per indexed file (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:109-116`), `code_nodes` also stores one language per node (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:132-135`), and Phase 001 explicitly forbids parser/indexer changes (`001-code-graph-hld-lld/spec.md:51-53`, `001-code-graph-hld-lld/spec.md:112-114`). The selected pass-1 approach is template-only over existing graph fields, not embedded-language parsing (`research/research.md:231-249`).

Verdict: NO-CHANGE-NEEDED. Phase 001 should narrate the indexed graph it has; embedded SQL, regex, or markdown should only appear if existing upstream parsing already emitted nodes/edges.

### f-iter001-007 — CONFIRMED — Stale db output is deterministic but should surface staleness at the handler boundary

Evidence: The spec states stale db output is still valid for prior content and `code_graph_status` informs the caller of staleness (`001-code-graph-hld-lld/spec.md:232-234`). The file table stores `content_hash`, `file_mtime_ms`, `parse_health`, and `indexed_at`, which are the metadata needed to identify indexed state (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:109-117`). Phase 001 also says the new handler should reuse the existing readiness gate (`001-code-graph-hld-lld/spec.md:105`).

Verdict: CONFIRMED. No change needed for deterministic generation itself; ensure the MCP handler preserves the readiness/status envelope so stale-but-valid output is not mistaken for current file content.

## Questions Answered

- Empty file: handled by the spec and consistent with indexer behavior (`001-code-graph-hld-lld/spec.md:224`; `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:988-990`).
- 1000+ symbols: cap is specified, but deterministic ordering before cap is missing (`001-code-graph-hld-lld/spec.md:225`; `001-code-graph-hld-lld/spec.md:150`).
- Missing docstrings: fallback to `""` is specified and matches nullable schema (`001-code-graph-hld-lld/spec.md:151`; `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:133-134`).
- Mixed-language content: no Phase 001 parser change is warranted because the phase forbids structural-indexer/tree-sitter changes (`001-code-graph-hld-lld/spec.md:51-53`, `001-code-graph-hld-lld/spec.md:112-114`).
- Multiple module symbols: unresolved; `module` is a valid `SymbolKind`, and captures may also create module-kind nodes (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:12-15`; `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:966-985`).
- High fan-in: threshold `> 10` is specified (`001-code-graph-hld-lld/spec.md:163`), but caller counting should use deterministic edge filtering because `code_edges` can contain dangling target/source ids (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:138-145`).
- Dangling edge targets: unresolved; the schema allows them because `code_edges.source_id` and `code_edges.target_id` have no declared foreign keys (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:138-145`).
- Stale db: deterministic but stale output is accepted by spec, provided handler status communicates staleness (`001-code-graph-hld-lld/spec.md:232-234`).

## Questions Remaining

- Should unresolved edge targets be filtered, represented, or counted separately in `complexity_hints`? The schema permits dangling edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:138-145`), while REQ-002 requires populated direct dependency fields for valid symbols (`001-code-graph-hld-lld/spec.md:151`).
- What exact stable sort should Phase 001 require before truncating `primary_symbols[]` and `lld[]`? The spec requires deterministic output (`001-code-graph-hld-lld/spec.md:150`) and truncation at 50 primary symbols (`001-code-graph-hld-lld/spec.md:225`) but does not define tie-breakers.
- Should `complexity_hints` remain a flat string array or become structured? The spec already lists this as an open question (`001-code-graph-hld-lld/spec.md:254-256`), and dangling/high-fan-in handling makes the structured shape more attractive.

## Next Focus

IRQ2 — Phase 002 `CONTAINS` edge cross-language population: verify whether trace population is TypeScript-only or all supported languages, and whether symbol-to-file-to-module traversal remains deterministic when non-TS parsers emit sparse or differently shaped containment data.
