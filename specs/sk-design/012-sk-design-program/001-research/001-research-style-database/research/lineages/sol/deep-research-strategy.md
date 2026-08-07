# Deep Research Strategy: Indexed Style Database

## 1. RESEARCH TOPIC
Determine how the 1,291-style sk-design library should become a real indexed database, using the repository's SQLite, embedding, graph, indexing, and file-retrieval implementations as primary evidence.

<!-- ANCHOR:key-questions -->
## 2. KEY QUESTIONS (remaining)
- [ ] Q1: Which storage architecture best fits style retrieval: SQLite plus embeddings, graph, or a hybrid?
- [x] Q2: What schema and indexes preserve style identity, metadata, text, provenance, relationships, and embedding lifecycle?
- [x] Q3: How should an incremental indexer detect, parse, validate, upsert, tombstone, and rebuild from the flat style folders?
- [x] Q4: What semantic and structured retrieval API should `styles/_engine` expose, and how should existing file-walking behavior integrate during migration?
- [x] Q5: Should flat files or the database be the source of truth, and what migration, rollback, and verification stages minimize risk?
<!-- /ANCHOR:key-questions -->

## 3. NON-GOALS
- Implementing the database or changing production style retrieval.
- Selecting an external hosted vector or graph service.
- Redesigning style content or taxonomy beyond what retrieval architecture requires.

## 4. STOP CONDITIONS
- Complete exactly 10 evidence-producing iterations per the `max-iterations` stop policy.
- Ground the final recommendation in all named in-repo reference implementations.
- Produce an actionable schema, sync design, retrieval contract, and source-of-truth migration decision with eliminated alternatives.

<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS
- Q2: Use normalized style/provenance/crawl/artifact/term/token/section tables keyed by stable style identity; keep retrieval documents, trigger-maintained FTS5, and profile-addressed vectors as derived projections, with separate aggregate and retrieval hashes (iteration 3).
- Q3: Use a resumable DISCOVER -> VERIFY -> PARSE_VALIDATE -> COMMIT -> VECTOR_DRAIN -> PUBLISH state machine, transactional generation publication, quarantined absence/tombstones, staged rebuilds, and generation-pointer rollback (iteration 4).
- Q4: Expose a v2 API separating hard eligibility from ranking signals; pin generation/profile, fuse structured/FTS/vector ranks with weighted RRF, return channel attribution and keyset cursors, recheck hydration authorization, and preserve v1 via a legacy/shadow/persistent adapter (iteration 5).
- Q5: Flat artifacts remain authoring/content/hydration truth; published SQLite generations become sole normal-query authority after baseline, bootstrap, shadow, canary, parity, and drill gates. Roll back adapters/pointers, never database rows into files (iteration 6).
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED
- Directly tracing manifest construction, eligibility, lexical ranking, cards, and hydration exposed the repeated corpus-wide I/O and preserved safety invariants (iteration 1).
- A bounded full-corpus benchmark quantified the current read-time cost at about 6.25 seconds (iteration 1).
- Tracing schema, mutation, scanner, vector, and hybrid-query modules as one lifecycle separated durable database invariants from rebuildable caches (iteration 2).
- Mapping every manifest field into normalized destinations and running an in-memory SQLite pressure test validated uniqueness, tombstone, FTS-trigger, and index-plan constraints (iteration 3).
- Pairing current manifest invalidation with scanner, retry, transaction, and staged-reindex code exposed concrete crash boundaries and recovery rules (iteration 4).
- Tracing current API/tests before borrowing RRF and degraded-channel behavior preserved compatibility while avoiding memory-specific ranking complexity (iteration 5).
- Separating content and runtime-query authority resolved the false single-store choice while retaining no-walk retrieval and file-byte hydration guarantees (iteration 6).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED
- The prompt's 1,291-style count could not be reconciled with three current repository surfaces, which consistently report 1,290 (iteration 1).
- The requested `mcp_server/database/` path contains runtime artifacts rather than schema source; ownership had to be followed into canonical `mcp-server/lib/` modules (iteration 2).
- An initial pressure-test DDL used invalid quoting; correcting SQL literals preserved the schema and completed the test (iteration 3).
- Broad lifecycle searches were noisy; narrowing by named state transition found the authoritative implementation paths (iteration 4).
- No source path failed; adaptive memory-specific fusion was intentionally excluded for lack of style evidence (iteration 5).
- A single-store authority framing could not satisfy both query and hydration guarantees; plane-specific authority was required (iteration 6).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)
None yet.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS
- Treating `_retrieval-manifest.json` as the indexed database: it is a denormalized snapshot that is fully rebuilt and parsed (iteration 1).
- Treating slug/path as canonical identity: UUID is primary and slug is a separate unique locator (iteration 1).
- Reusing `memory_index` directly: its cognition, governance, chunking, and retention fields are domain-specific (iteration 2).
- Making mtime or vector availability authoritative for retrieval: hashes and lexical fallback are required (iteration 2).
- One JSON blob per style, DESIGN-only freshness, full-artifact embeddings, and independently stored derivable counters (iteration 3).
- In-place rebuilds, one-scan hard deletes, stale vector writes without CAS, and second-transaction generation publication (iteration 4).
- Raw-score addition, post-retrieval eligibility, offset/unpinned pagination, authorization-bearing hydration tokens, and normal-path corpus walking after cutover (iteration 5).
- Editable SQLite content authority, dual-write content authority, permanent dual reads, DB-only deletion, and blind checkpoint restoration (iteration 6).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 10. CARRIED-FORWARD OPEN QUESTIONS
Only Q1 remains open. Q2-Q5 define schema, sync, API, and source-of-truth migration; iterations 7-10 must pressure-test topology, graph value, operations, and final coherence.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Choose the minimum production topology and quantify whether a graph store adds enough retrieval or operational value beyond SQLite, FTS5, vectors, and relational edges.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- Memory record 1092 confirms this packet is dedicated to a 10-iteration style-database architecture study and names `.opencode/skills/sk-design/styles/` as the primary target.
- Memory record 1091 confirms implementation is gated on this research phase.
- The code graph is absent, so direct file reads and exact searches are the primary evidence route.
- `resource-map.md` is absent at the target spec root; the resource-map coverage gate is skipped.
- Required references include `.opencode/skills/sk-design/styles/_engine/`, `.opencode/skills/system-spec-kit/mcp_server/database/`, `.opencode/skills/system-spec-kit/lib/embedders/schema.ts`, `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts`, and `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts`.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05, telemetry only before iteration 10
- Write root: `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/research/lineages/sol`
- Per-iteration leaf boundary: one focus, no sub-dispatch, cited in-repo evidence, write-once narrative and delta
