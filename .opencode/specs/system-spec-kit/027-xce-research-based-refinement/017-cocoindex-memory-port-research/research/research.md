# 027/013 - cocoindex-main -> spec_kit_memory port + MCP namespace shortening - RESEARCH SYNTHESIS

<!-- ANCHOR:research-synthesis -->

## 1. Executive Summary

This packet investigated two related questions. Track 1 asked which upstream `cocoindex-main` concepts should be ported into the non-code `spec_kit_memory` MCP: memoization, dependency-aware indexing, stable lifecycle tracking, state reconciliation, chunked embeddings, causal-edge derivation, and query intelligence. Track 2 asked whether the long MCP namespace `mcp__mk_spec_memory__*` should be shortened, and if so, how to do it without breaking Claude Code, OpenCode, Codex, Gemini, or provider tool-name constraints.

The headline answer is clear: most ingestion and reconciliation ideas from CocoIndex transfer, but the implementation substrate does not. The right port is TypeScript and SQLite-native: deterministic canonical fingerprints, additive memo/dependency tables, anchor-first chunk identity, active causal-edge hard deletes with tombstone audit rows, and a typed state-diff action layer. Do not attempt to recreate Rust/PyO3 callbacks or CocoIndex's heed encoded-key storage.

The negative finding is also important. CocoIndex has no portable query-intelligence layer for the current memory router. Its query surface is application/backend-local, while this MCP already owns routing across vector, FTS, BM25, graph, and degree channels. Future work should not reopen CocoIndex as a source for intent classification, channel routing, RRF-style fusion, or entity-density query orchestration unless upstream adds a new retrieval framework.

For namespace shortening, the recommended move is a server-only rename from `spec_kit_memory` to `mk-memory`, preserving all 59 raw tool names. This saves about six characters per fully-qualified Claude-style reference, removes Gemini's documented underscore ambiguity, and keeps migration bounded to the 166 counted `mcp__mk_spec_memory__` callsites. Dropping `memory_` from raw tool names is real but deferred; it adds churn and weakens standalone meaning for commands such as `memory_delete`, `memory_health`, and `memory_validate`.

## 2. Research Context

This is Phase 13 of parent packet 027, the XCE research-based refinement stream. The phase intentionally opened a new research lane after earlier 027 phases focused on `code_graph`, `skill_advisor`, and the `cocoindex-code` wrapper. The scope here is the non-code memory subsystem under `.opencode/skills/system-spec-kit/mcp_server/`, using the upstream library at `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/` as the reference source.

The packet spec defines the phase as research-only and names the handoff criterion: produce `research/research.md` with per-axis findings, cross-axis recommendations, and ranked downstream implementation packets. It explicitly excludes implementation of any port or rename, code_graph and skill_advisor improvements, the cocoindex-code wrapper, embedding-provider changes, and network operations (`spec.md:72-87`, `spec.md:129-135`).

The scope split matters because CocoIndex is not being treated as a vendored dependency. It is an architectural source of patterns. The target system has its own constraints: a local MCP server, TypeScript handlers, SQLite-backed memory storage, existing vector and lexical search, spec-folder metadata, and multiple runtime surfaces. The useful question is therefore not "can we port CocoIndex?" but "which invariants survive translation into this stack?"

## 3. Methodology

The research ran nine discovery and decision iterations, followed by this tenth synthesis iteration. Iteration 1 established ground truth across upstream files and target MCP files. Iterations 2 through 6 handled Track 1 questions K1.1 through K1.5. Iteration 7 closed K1.6 and opened K2.1. Iterations 8 and 9 closed the namespace questions K2.2, K2.3, and K2.5. K2.4, the raw callsite count, was answered in iteration 1.

Each prior iteration was executed as a bounded `cli-codex` pass with `gpt-5.5`, high reasoning, and fast service tier, then externalized into `research/iterations/iteration-001.md` through `iteration-009.md`. The state file shows the same executor pattern for later passes, including iteration 8 and 9 dispatch rows. Convergence is now justified by both caps: maxIterations reached and all 11 key questions answered.

Evidence was source-first. The upstream files included `memo_fingerprint.py`, `stable_path.rs`, `db_schema.rs`, `execution.rs`, `statediff.py`, code embedding examples, entity-resolution examples, and connector targets. Target files included `handlers/memory-index.ts`, `handlers/memory-save.ts`, `handlers/causal-graph.ts`, `lib/search/vector-index-schema.ts`, `lib/search/query-router.ts`, `lib/storage/causal-edges.ts`, runtime MCP configs, and `tool-schemas.ts`.

## 4. Scope Re-Check Against Packet Spec

The final synthesis remains inside the packet boundaries. No implementation code is changed. No MCP server alias is renamed here. No schema migration is applied. The produced artifacts are research outputs: this canonical `research/research.md`, the iteration-10 narrative, an iteration-10 delta, and a state row recording convergence.

The packet spec requires each Track 1 axis to receive concrete file-path citations and a clear port or non-port conclusion (`spec.md:157-174`). It also requires Track 2 to produce runtime evidence, a callsite count, and a final naming recommendation. This report satisfies those requirements with axis-level verdicts, source citations, a runtime matrix, a migration recommendation, and downstream packet proposals.

One evidence caveat is worth making explicit before the findings: the cited line numbers come from the prior iteration narratives' direct source reads, not from a fresh re-scan inside this synthesis pass. That is deliberate. Iteration 10 is constrained to consolidation, so it treats the iteration narratives as the evidence ledger and only re-checks scope and destination artifacts. If a downstream implementation packet needs exact edit context, it should re-open the target source files before changing them, because line numbers in active TypeScript files can drift after unrelated work.

The synthesis also separates "portable invariant" from "suggested first implementation." For example, canonical fingerprints are a portable invariant; the specific table names in this report are implementation sketches, not frozen migration names. Likewise, anchor-first chunk identity is the recommendation, but the exact parser behavior for unclosed `<!-- ANCHOR:* -->` markers belongs in packet 028. This distinction matters because the research is meant to seed planning packets without pretending the design phase has already resolved every migration detail.

## 5. Track 1 Findings - cocoindex-main -> spec_kit_memory Port

Track 1's pattern is consistent. CocoIndex's high-level invariants transfer; its runtime mechanics generally do not. The portable layer is deterministic identity, explicit dependency state, planned reconciliation, and staged graph extraction. The non-portable layer is Rust transaction orchestration, Python callback state handlers, heed prefix-key storage, and backend-specific query execution.

The current `spec_kit_memory` baseline is simpler. Iteration 1 found a linear scan plus content-hash skip path in `memory-index.ts`: files are discovered, deduplicated by canonical path, categorized, then batch-indexed (`handlers/memory-index.ts:263`, `handlers/memory-index.ts:279`, `handlers/memory-index.ts:436`, `handlers/memory-index.ts:467`). That makes the first port opportunity a better invalidation model, not a wholesale framework replacement.

## 6. K1.1 - Memoization + Dependency-DAG Indexing

Verdict: YES-WITH-ADAPTATION.

CocoIndex's memoization model is grounded in canonical fingerprints. The Python memo module describes Python-side canonicalization with Rust performing the fixed-size fingerprint (`memo_fingerprint.py:4`), canonicalizes hooks, registries, dataclasses, pydantic objects, and containers (`memo_fingerprint.py:268`), and exposes `memo_fingerprint` plus call fingerprinting (`memo_fingerprint.py:404`, `memo_fingerprint.py:412`). Iteration 2 confirmed the Rust side tags primitive and structured values before fingerprinting (`memo_fingerprint.rs:13-143`).

The target stack already has a coarse version of this. The incremental indexer computes SHA-256 over file bytes and uses mtime as a fast path before checking stored content hashes (`incremental-index.ts:139-186`). The parser also computes normalized content hashes (`memory-parser.ts:342-370`, `memory-parser.ts:888-890`). Existing `memory_index` rows store `content_hash`, `file_mtime_ms`, `canonical_file_path`, embedding status, and content (`vector-index-schema.ts:2356-2419`) with indexes on content hash, canonical path, and mtime (`vector-index-schema.ts:2507-2526`).

The adaptation is to keep that file cache as the front door and add durable memo/dependency state. The first implementation should introduce TypeScript canonicalization plus SQLite tables for `memoization_records`, `memoization_logic_deps`, `dependency_edges`, `target_state_tracking`, and `target_state_owner`. `memory_index_scan` can then enqueue changed files, walk dependency edges, validate memo records by input and code hash, and skip expensive parse/embed/project work when all fingerprints still match.

Schema sketch:

```sql
CREATE TABLE memoization_records (
  component_path TEXT NOT NULL,
  memo_kind TEXT NOT NULL,
  input_fingerprint BLOB NOT NULL,
  code_hash BLOB NOT NULL,
  output_fingerprint BLOB,
  output_blob BLOB,
  memo_state_blob BLOB,
  computed_at INTEGER NOT NULL,
  PRIMARY KEY (component_path, memo_kind, input_fingerprint, code_hash)
);

CREATE TABLE dependency_edges (
  parent_component_path TEXT NOT NULL,
  child_component_path TEXT NOT NULL,
  edge_kind TEXT NOT NULL,
  child_key TEXT NOT NULL,
  child_fingerprint BLOB,
  PRIMARY KEY (parent_component_path, child_component_path, edge_kind, child_key)
);
```

Do not port the heed KV layout or Rust/PyO3 callback execution. CocoIndex uses encoded prefix keys and managed transaction batchers (`db_schema.rs:20-42`, `execution.rs:514-535`, `execution.rs:612-720`). SQLite should use relational tables, indexes, and recursive CTE-style traversal where needed.

## 7. K1.2 - Stable-Path Tracking for Causal Graph

Verdict: YES-WITH-ADAPTATION.

CocoIndex separates stable path identity from lifecycle reconciliation. `stable_path.rs` defines typed stable keys, stable path references, root paths, and concatenation (`stable_path.rs:5`, `stable_path.rs:203`, `stable_path.rs:262`, `stable_path.rs:280`, `stable_path.rs:287`). The lifecycle symbols live in `db_schema.rs`: `ChildExistencePrefix`, `ChildExistence(StableKey)`, `ChildComponentTombstonePrefix`, and `ChildComponentTombstone(StablePath)` (`db_schema.rs:35-41`). Their encoded prefixes distinguish child existence and tombstones (`db_schema.rs:55-63`).

The transferable invariant is lifecycle reconciliation, not path encoding. CocoIndex diffs current children against stored existence rows, routes missing children through deletion, writes tombstones for component children, and later consumes tombstones through a GC/delete path (`execution.rs:612-660`, `execution.rs:746-780`, `execution.rs:570-573`, `execution.rs:725-742`, `execution.rs:1472-1498`). The schema even notes a future generation field to avoid delete/recreate races (`db_schema.rs:311-319`), which is directly relevant to causal edge cleanup.

The current target causal graph is a flat active-edge table. `causal_edges` stores source, target, anchors, relation, strength, evidence, creator, and timestamps, with source/target/relation/strength/anchor indexes (`vector-index-schema.ts:607-637`). Normal memory deletes already call `deleteEdgesForMemory`, and the storage module hard-deletes edges by source or target (`memory-crud-delete.ts:94-118`, `memory-bulk-delete.ts:221-255`, `causal-edges.ts:761-774`). But stale index deletion currently deletes memory rows through `vectorIndex.deleteMemory`, and the ancillary delete helper does not include `causal_edges` (`memory-index.ts:310-325`, `vector-index-mutations.ts:103-110`, `vector-index-mutations.ts:614-631`).

The adapted port should keep active reads simple. Hard-delete active `causal_edges`, but snapshot deleted edges into a separate `causal_edge_tombstones` table with reason, triggering memory id, lifecycle generation, metadata, and optional restore fields. Route every delete path through one helper: normal memory delete, bulk delete, stale index cleanup, manual unlink, and orphan sweep. `memory_health({ autoRepair: true })` should tombstone-orphan then delete, rather than merely cleaning active rows.

Schema sketch:

```sql
CREATE TABLE causal_edge_tombstones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edge_id INTEGER,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relation TEXT NOT NULL,
  strength REAL,
  evidence TEXT,
  created_by TEXT,
  tombstoned_at TEXT NOT NULL DEFAULT (datetime('now')),
  tombstone_reason TEXT NOT NULL,
  triggering_memory_id TEXT,
  lifecycle_generation INTEGER NOT NULL DEFAULT 1,
  restored_at TEXT,
  metadata_json TEXT
);
```

## 8. K1.3 - State-Diff Reconciliation

Verdict: YES-WITH-ADAPTATION.

CocoIndex's `statediff.py` is a small, durable-target reconciliation model. It defines `DiffAction = Literal["insert", "upsert", "replace", "delete"]` (`statediff.py:52`) and wraps desired state, previous state, and `prev_may_be_missing` in `TrackingRecordTransition` (`statediff.py:85-95`). Its decision tree maps desired non-existence to delete, differing observed prior rows to replace, missing known prior rows to insert, incomplete prior knowledge to upsert, and converged state to no action (`statediff.py:149-186`). Composite state extends this to a main record plus keyed substates (`statediff.py:55-72`, `statediff.py:189-251`).

That model fits durable memory projections. A memory document can be treated as a composite target with child rows for embedding, BM25/FTS, chunks, entities, summaries, generated causal edges, and graph projections. It also fits `memory_index_scan`, which already computes implicit target categories: index, update, skip, and delete (`memory-index.ts:431-440`) and defers stale cleanup when replacement indexing fails (`memory-index.ts:567-574`).

The current post-mutation hooks are not statediff targets. They clear process-local caches: trigger matcher cache, tool cache, constitutional cache, graph/degree caches, and co-activation cache (`mutation-hooks.ts:27-95`). Their callsites in `memory_index_scan`, `memory_bulk_delete`, and `memory_save` are post-write hygiene (`memory-index.ts:351-370`, `memory-index.ts:647-654`, `memory-bulk-delete.ts:277-293`, `memory-save.ts:3296-3315`). They should become subscribers to applied action batches, not durable desired/prior rows.

The adapted architecture is two-step:

1. Build a target-state plan from desired rows and prior rows.
2. Apply typed actions through sinks for memory index, embedding, FTS/BM25, graph, cache, trigger, co-activation, alias, and causal-edge targets.

Suggested module shape:

```ts
export type DiffAction = 'insert' | 'upsert' | 'replace' | 'delete';
export const NON_EXISTENCE = Symbol('NON_EXISTENCE');

export interface TrackingRecordTransition<T> {
  desired: T | typeof NON_EXISTENCE;
  prior: readonly T[];
  priorMayBeMissing: boolean;
}
```

Packet 030 should introduce `lib/storage/statediff.ts` and use it first where the current system already behaves like a reconciler: `memory_index_scan`, alias/divergence reconciliation, embedding rows, and lexical rows. Manual `memory_causal_link` can stay imperative until generated edge sets need declarative reconciliation.

## 9. K1.4 - Incremental Chunked Embeddings

Verdict: YES-WITH-ADAPTATION.

CocoIndex's code embedding example chunks every supported file, maps a per-chunk processing function, embeds chunks independently, and stores filename plus line bounds (`examples/code_embedding/main.py:69-107`). The splitters return position-aware chunks (`text.py:39-84`, `text.py:120-209`), and `Chunk` carries text plus positions, not semantic identity (`chunk.py:25-36`). `IdGenerator` produces distinct IDs for repeated chunk content while keeping sequence stability across runs (`id.py:89-99`, `id.py:126-149`), but that is still content-plus-ordinal rather than a stable spec-section identity.

The target already has partial chunk support. Normal parsing returns one `ParsedMemory` per file and one content hash (`memory-parser.ts:342-385`). Normal save generates a weighted whole-document embedding before later optional chunk indexing (`embedding-pipeline.ts:119-155`, `memory-save.ts:2190-2217`, `memory-save.ts:2339-2348`). Chunking is gated to full-auto planner mode and very large content, with the threshold around 50,000 characters (`chunking-orchestrator.ts:121-126`, `anchor-chunker.ts:60-62`, `anchor-chunker.ts:303-307`).

The schema and retrieval path are ready enough to support a better model. `memory_index` already has `parent_id`, `chunk_index`, `chunk_label`, and `anchor_id`, plus uniqueness over `(spec_folder, file_path, anchor_id)` (`vector-index-schema.ts:2360-2364`, `vector-index-schema.ts:2412-2419`). Hybrid search can aggregate chunk hits back to parent documents with `_chunkHits` metadata (`hybrid-search.ts:1358-1389`).

The missing piece is stable chunk identity. Heading slugs break on rename, window offsets break on earlier edits, and chunk indexes break on insertions and reorders. The right identity scheme is anchor-first:

- `frontmatter:<block>` for YAML/frontmatter and `_memory.continuity`.
- `anchor:<anchor_id>` for explicit anchored sections.
- `anchor:<anchor_id>#part:<n>` for oversized sections.
- `heading:<slug>#ordinal:<n>` only as a bootstrap fallback.
- `window:<seq>` only as last resort, marked as fallback.

Add `chunk_id`, `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, and `chunk_end_line` to child rows, either in `memory_index` first or a later `memory_chunks` table. Prefer extending `memory_index` in the first pass because parent/child rows and search aggregation already exist.

## 10. K1.5 - Auto Causal-Edge Derivation

Verdict: YES-WITH-ADAPTATION.

CocoIndex provides a useful multi-phase graph extraction shape. The conversation-to-knowledge example ingests sessions, transcribes, extracts with LLMs, resolves duplicates through embedding similarity plus LLM confirmation, and stores graph nodes and relations (`conversation_to_knowledge/README.md:26-31`). The design uses memoized per-session components and separate LLM calls for metadata/speaker identification and statement/entity extraction (`conversation_to_knowledge/spec.md:42-49`, `conversation_to_knowledge/design.md:116-150`, `conversation_to_knowledge/design.md:177-196`). The meeting-notes graph implementation follows the same phases: memoized extraction, entity resolution, and graph declaration (`meeting_notes_graph_neo4j/main.py:198-211`, `main.py:248-301`, `main.py:309-345`, `main.py:400-438`).

The trust policy does not transfer. CocoIndex entity resolution uses embeddings to generate candidates and an LLM pair resolver to choose matches, but the resolver returns structured match/canonical decisions rather than calibrated edge confidence (`entity_resolution/__init__.py:201-260`, `entity_resolution/__init__.py:281-297`, `llm_resolver.py:22-46`, `llm_resolver.py:106-123`). For causal edges, this MCP needs its own confidence, extraction method, evidence, quarantine, and acceptance gates.

The target graph is already prepared for narrow programmatic edges but not broad LLM extraction. The live relation vocabulary is `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, and `supports` (`causal-edges.ts:18-25`), while stats still mention `produced` and `cited_by` (`causal-graph.ts:112-119`). The schema stores `strength`, `evidence`, `extracted_at`, and `created_by`, but not confidence or extraction method (`vector-index-schema.ts:607-621`). Storage caps auto-created edges and relation skew, which helps but is not enough for LLM acceptance (`causal-edges.ts:269-288`, `causal-edges.ts:326-365`, `causal-graph.ts:140-181`).

Ship two tracks:

1. Phase 1 deterministic frontmatter promoter. Parse `graph-metadata.json` and `description.json`, normalize packet IDs, resolve memory rows, and emit constrained `created_by='auto'` edges with `extraction_method='frontmatter'`. This can cover `depends_on`, `supersedes`, parent/child lineage, and selected support relations with near-zero pollution risk.
2. Phase 2 LLM extractor. Defer until K1.4 chunk fingerprints exist. Extract candidate relationship claims from changed chunks, canonicalize endpoints through embedding candidates plus LLM judgment, score proposed edges, then auto-accept, quarantine, or drop.

Add `confidence`, `extraction_method`, `extraction_run_id`, `source_chunk_id`, and a `causal_edges_pending` table before any LLM path. The default acceptance policy should require resolvable endpoints, allowed relation, evidence span or chunk id, direction validation, deduplication, burst limits, and review for medium-confidence edges.

## 11. K1.6 - Query Intelligence

Verdict: NON-PORT CONFIRMED.

CocoIndex does not contain a portable query-intelligence layer matching this MCP's router. The only top-level Python file with query semantics found in the survey was `query_handler.py`, which defines result metadata and a `QueryOutput` wrapper for application-provided results (`query_handler.py:9-18`, `query_handler.py:29-37`, `query_handler.py:42-52`). That is not a router, classifier, retriever, reranker, fusion engine, or channel selector.

Connectors manage backend-local targets. The Postgres connector handles pgvector operator classes, vector index actions, and table target declarations (`postgres/_target.py:394-460`, `postgres/_target.py:1211-1248`). The Qdrant connector manages collection create/drop and point upsert/delete, vector schema, distance metadata, and collection targets (`qdrant/_target.py:1-7`, `qdrant/_target.py:50-68`, `qdrant/_target.py:107-180`, `qdrant/_target.py:520-606`). This is target declaration and storage synchronization, not query routing.

The target MCP already has the query intelligence boundary. `query-router.ts` defines the channel set as vector, FTS, BM25, graph, and degree (`query-router.ts:35-37`), maps query tiers to channel subsets (`query-router.ts:98-108`), preserves BM25 for authority-oriented intents (`query-router.ts:149-170`), preserves graph and degree for intent/entity-density signals (`query-router.ts:206-255`), and plans routes in `routeQuery()` (`query-router.ts:325-447`).

So the action is no implementation packet. Keep retrieval intelligence in the existing TypeScript router. Use CocoIndex-like reconciliation to keep backend targets clean, then let the current router decide which clean targets to query.

## 12. Track 2 Findings - MCP Namespace Shortening

Track 2 closed all five namespace questions. The visible `mcp__mk_spec_memory__...` prefix is not emitted by the MCP server itself. Raw tools are defined without host prefixes, e.g. `memory_context`, `memory_search`, `memory_quick_search`, and `memory_match_triggers` (`tool-schemas.ts:47-56`, `tool-schemas.ts:195`, `tool-schemas.ts:214`). `ToolDefinition.name` is a raw string (`tool-schemas.ts:32-39`), and `TOOL_DEFINITIONS` aggregates the registrations (`tool-schemas.ts:1038-1110`).

The server-name segment comes from each runtime config key: `.claude/mcp.json` `mcpServers.spec_kit_memory`, `opencode.json` `mcp.spec_kit_memory`, `.codex/config.toml` `[mcp_servers.spec_kit_memory]`, and `.gemini/settings.json` `mcpServers.spec_kit_memory`. Claude Code documents `mcp__<server-name>__<tool-name>`. Gemini documents `mcp_<serverName>_<toolName>` and warns not to use underscores in MCP server names because its policy parser splits after `mcp_`.

The live tool surface is larger than the original prompt assumed. Iteration 8 counted 59 raw tool registrations, including four imported advisor tools. The largest family is `memory_*` with 22 tools, but the server also includes code graph, skill graph, checkpoint, CCC, session, task, eval, deep-loop graph, council graph, advisor, and standalone tools. That mixed surface is why raw tool prefixes still carry semantic value.

## 13. K2.1-K2.5 Decision Matrix

| Option | Server alias | Raw tools | Char delta vs current Claude-style `mcp__mk_spec_memory__memory_context` | Migration | Gemini policy | Verdict |
| --- | --- | --- | ---: | ---: | --- | --- |
| Status quo | `spec_kit_memory` | unchanged | 0 | 0 | Ambiguous | Do not keep long-term |
| A | `mk-memory` | unchanged | -6 | 166 prefix callsites | OK | Recommended |
| B | `mk-memory` | drop `memory_` where possible | -13 to -19 | 166 plus tool references | OK | Defer |
| C | `mk` | unchanged | -13 | 166 | OK | Too generic |
| D | split servers | drop family prefixes | varies | 166 plus broad config/docs/test churn | OK | Too large |

K2.2 rejects `mk_memory`. It saves the same six characters as `mk-memory`, but it preserves the Gemini underscore ambiguity. Hyphenated `mk-memory` is representable in JSON keys and TOML keys, stays inside known provider-safe character classes, avoids `:` and `@`, and leaves room for future siblings such as `mk-code` or `mk-skill`.

K2.3 rejects raw tool renames for the first migration. Dropping `memory_` is the only semantically plausible family-level tool rename, but even there names such as `list`, `stats`, `health`, `delete`, `update`, and `validate` become too generic. Dropping prefixes from graph families is worse because `query`, `status`, `context`, `upsert`, and `convergence` collide across concepts.

K2.4 measured the migration ceiling at 166 raw `mcp__mk_spec_memory__` occurrences across markdown, TypeScript, JSON, and shell under the requested filter. That count includes packet-local prompts/spec content and historical docs, so an implementation packet should separate active runtime references from archival examples. Still, it is bounded enough for a straight rename.

K2.5 therefore confirms Option A: rename the MCP server alias from `spec_kit_memory` to `mk-memory`, keep all 59 raw tool names unchanged, and do not ship a backward-compatible shim by default.

## 14. Cross-Axis Cohesion

The Track 1 ports compose into a small number of implementation packets rather than one giant "CocoIndex port." K1.1 and K1.4 belong together because chunk identity and per-chunk fingerprints are the most valuable first consumers of memo/dependency state. K1.2 is independent and should ship before generated causal edges increase graph volume. K1.3 is broader and should wait until stable memo/chunk identities exist. K1.5 Phase 1 can ship without LLMs once K1.2 protects edge lifecycle. K1.6 intentionally produces no implementation packet.

Track 2 is independent. The namespace rename should ship first because it is high-visibility, low-risk, and does not depend on data-model work. It also reduces prompt/tool-call friction before the deeper memory changes begin.

The only sequencing tension is between K1.2 and K1.5. A deterministic frontmatter promoter is low-risk, but even deterministic generated edges can create stale active rows if lifecycle cleanup remains incomplete. So K1.2 should precede K1.5 Phase 1 unless the promoter is written in dry-run/report-only mode first.

## 15. Proposed Downstream Implementation Packets

### Packet 028 - Memoization + dependency-DAG indexing foundation

Scope: K1.1 plus K1.4. Add deterministic TypeScript canonicalization, SQLite memo/dependency tables, DAG-aware scan planning, and anchor-first chunk rows with chunk fingerprints.

Primary files: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`, new `lib/storage/memo.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`, and chunk/search aggregation paths.

Estimated LOC: 800-1200. Dependencies: none. ROI x effort: HIGH x MEDIUM.

### Packet 029 - Causal-graph lifecycle tombstones + sweep

Scope: K1.2. Add `causal_edge_tombstones`, a sweep helper, lifecycle generation, and route every memory deletion path through the tombstoning helper.

Primary files: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`, and new `lib/causal/sweep.ts`.

Estimated LOC: 300-500. Dependencies: none. ROI x effort: MEDIUM x LOW.

### Packet 030 - Statediff reconciliation layer

Scope: K1.3. Add a durable target-state planner, typed action model, target sinks, and cache/action subscribers. Start with `memory_index_scan`, alias reconciliation, embedding/FTS/BM25 projections, and later generated causal-edge sets.

Primary files: new `.opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`, causal graph mutation paths, post-mutation hooks, and storage target adapters.

Estimated LOC: 600-900 for the first stage, likely higher if all sinks are included. Dependencies: 028. ROI x effort: MEDIUM x HIGH.

### Packet 031 - Auto causal-edge derivation Phase 1

Scope: K1.5 Phase 1 only. Implement deterministic frontmatter/metadata promotion. Do not include LLM extraction, embedding candidate matching, or quarantine review UI in this packet.

Primary files: new `.opencode/skills/system-spec-kit/mcp_server/lib/causal/frontmatter-promoter.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/spec/graph-metadata.ts`, and schema additions for confidence/extraction metadata if needed for deterministic provenance.

Estimated LOC: 300-500. Dependencies: 029 preferred. ROI x effort: HIGH x LOW.

### Packet 032 - MCP namespace rename

Scope: K2.x. Rename configured server alias `spec_kit_memory` to `mk-memory` across runtime configs and update fully-qualified documentation/code references. Keep all raw tool names unchanged.

Primary files: `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`, plus docs/prompts/tests containing `mcp__mk_spec_memory__`.

Estimated LOC: about 10 config lines plus roughly 166 search-and-replace references. Dependencies: none. ROI x effort: HIGH x LOW. This should ship first.

## 16. Recommended Sequencing

1. 032 - namespace rename. It is independent, visible, low effort, and fixes Gemini policy ambiguity.
2. 028 - memoization + DAG + chunk fingerprint foundation. This unlocks later stable reconciliation and LLM-safe chunk evidence.
3. 029 - causal lifecycle tombstones + sweep. This reduces orphan risk and prepares for generated edges.
4. 031 - deterministic frontmatter causal-edge promoter. Ship metadata-derived edges before any LLM extraction.
5. 030 - statediff layer. It is valuable but broader; it benefits from stable memo and chunk identities first.
6. Deferred - K1.5 LLM Phase 2. Revisit only after 031 proves value and 028 provides chunk-level evidence/fingerprint units.

This ordering optimizes for low-risk wins first, then foundation, then richer automation. It also prevents the most expensive abstraction, statediff, from landing before it has stable targets to reconcile.

Each packet should re-open source before editing.

## 17. Non-Goals, Open Questions, References, and Convergence

Non-goals: no implementation in this packet; no code_graph or skill_advisor changes; no cocoindex-code wrapper changes; no embedding-provider migration; no Linear/Notion external documentation impact analysis for the namespace rename; no LLM causal-edge extraction in the first causal-edge packet.

Open downstream questions:

- Packet 028: chunking strategy detail. Should the first implementation chunk H2 sections only, or H2 plus frontmatter and `_memory.continuity` blocks?
- Packet 030: sink order. Should embedding rows or FTS/BM25 rows be the first statediff target?
- Packet 032: backward-compat shim. Current recommendation is no shim, aligned with the packet's straight-rename policy, but the implementation packet should re-check active runtime scripts before deleting old references.
- Packet 031: relation direction policy. `depends_on` can become `supports` or `caused` depending on direction semantics; this should be explicit before promotion.

References:

- External library: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/`
- Target MCP: `.opencode/skills/system-spec-kit/mcp_server/`
- Iteration narratives: `research/iterations/iteration-001.md` through `research/iterations/iteration-009.md`
- Convergence dashboard: `research/deep-research-dashboard.md`
- Packet spec: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-cocoindex-memory-port-research/spec.md`

Convergence report: stop reason is max_iterations plus all_questions_answered. Ten iterations executed including this synthesis pass; all 11 K-questions are answered. Prior newInfoRatio trajectory ended at approximately 0.78 -> 0.62 -> 0.22 before this low-novelty synthesis pass. The iteration-10 newInfoRatio is recorded as 0.09 because it consolidates prior findings rather than adding new source discovery. Executor convention was `cli-codex gpt-5.5 high fast`, with roughly 30 minutes total wall-clock across iterations 1-9 according to the iteration state records.

<!-- /ANCHOR:research-synthesis -->
