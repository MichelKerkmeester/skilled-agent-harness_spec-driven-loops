# Iteration 11: Leftover entity-extractor still mutates memory_index

## Focus
Angle 1. After graph-metadata-parser was confirmed as the only production importer of `entity-extractor`, check whether the extractor still serves the retired sqlite store.

## Findings

### F-I11-001 — `rebuildAutoEntities` still deletes and rewrites `memory_index` / `memory_entities`. CONFIRMED. P1
The function comment still says it re-extracts from live `memory_index.content_text` and rebuilds `entity_catalog`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:516-522]
The body selects `FROM memory_index`, counts `memory_entities` joined to `memory_index`, then `DELETE FROM memory_entities` in a transaction. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:533-582]
`rebuildEntityCatalog` also takes a `better-sqlite3` Database. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:449]
This is live authored code that still describes and implements the retired store, not a comment in a fixture.

### F-I11-002 — The only production importer uses `extractEntities`, not the sqlite writers. CONFIRMED. P1
`graph-metadata-parser.ts` imports `extractEntities` only. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:11]
Repo search for `rebuildAutoEntities` / `rebuildEntityCatalog` outside the extractor itself hits `runtime/tests/entity-extractor.vitest.ts` (and the compiled `scripts/runtime` symlink copy). No other authored caller.
The lexical helper survived for packet metadata. The sqlite rebuild path survived beside it and is kept green by its own tests (angle 4).
Smallest fix: keep `extractEntities` / `normalizeEntityName`; delete or quarantine `rebuildAutoEntities`, `rebuildEntityCatalog`, and the Database-typed insert helpers; drop those describes from `entity-extractor.vitest.ts`.

### F-I11-003 — Entity-extractor tests still certify the retired schema. CONFIRMED. P1
`runtime/tests/entity-extractor.vitest.ts` imports and describes `rebuildEntityCatalog` / `rebuildAutoEntities`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:13-14 inferred from test import block at runtime/tests/entity-extractor.vitest.ts:13-14,518-616]
Those tests pass by constructing a sqlite file with `memory_index`, not by proving a successor. Same class as F-I6-001 / F-I6-005.
Smallest fix: delete the rebuild describes; keep tests for `extractEntities` on markdown strings.

### F-I11-004 — Header still says "memory content". CONFIRMED. P2
`ExtractedEntity` is documented as extracted from memory content. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:37-40]
Restates F-I2-004 in the live writer register. Smallest fix: say "source text".

## Sources Consulted
- .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:10,37-40,449,516-582
- .opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:11
- .opencode/skills/system-spec-kit/runtime/tests/entity-extractor.vitest.ts:13-14,518-616
- rg for rebuildAutoEntities / rebuildEntityCatalog under system-spec-kit (scoped; leftover mcp-server excluded by path)

## Assessment
- newInfoRatio: 0.75
- Novelty justification: first confirmed live authored writer of `memory_index` after decommission, with no production caller except tests.
- Confidence: high on 001-002. Test line numbers confirmed from the earlier read of the describe block.

## Reflection
- Worked: split the pure extractor (kept) from the sqlite rebuild (residue).
- Failed: none.
- Ruled out: treating all of entity-extractor as retired. `extractEntities` is still used by graph-metadata-parser.

## Dead Ends
- None.

## Recommended Next Focus
Root `sqlite-vec.d.ts` and scripts `sqlite-vec` dependency (F-I5-001) plus eval filenames that still say `mcp-lib`.
