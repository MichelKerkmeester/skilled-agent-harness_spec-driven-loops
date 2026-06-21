# Iteration R3 - graph-metadata.json schema redesign (opus, cross-cutting)

## TITLE

Cohort R3. Model opus via claude2. Wave-3 redesign of `graph-metadata.json` that corrects two false loop assumptions against the real corpus and lands the candidate-6 rollup win on the existing first-class embedded parent record rather than chasing dead edges.

## FINDINGS

Two inherited loop assumptions are wrong against the real corpus and reshape the design.

The claim that 0 of 2022 typed edges are populated is false. A scan across all 2022 `graph-metadata.json` files shows 57 files at 2.8 percent carry at least one manual edge for 103 total entries, 52 `depends_on`, 1 `supersedes`, 22 `related_to`. A real hand-authored example is `028-memory-search-intelligence/009-reranker-research/graph-metadata.json` with a `depends_on` to `008-new-feature-research-build` and a `related_to` to `001-speckit-memory`. The edges are sparse not absent and `supersedes` is effectively dead at 1 file. Dropping the slots would destroy 103 real edges and break `packetReferencesToCausalLinks` consumers.

The rollup record does not need to be invented because it already exists first-class. `graph_metadata` is a real embedded document type with weight 0.75 (`lib/storage/document-helpers.ts:34`), higher than `description_metadata` at 0.55, `plan` at 0.7 and `tasks` plus `research` at 0.6. It flows through `parseMemoryFile` returning a content field (`lib/parsing/memory-parser.ts:333,353`) and gets a plus 0.12 on packet-oriented queries (`lib/search/pipeline/stage1-candidate-gen.ts:341-368`). So the candidate-6 escape via a first-class embedded record is already 90 percent done, the parent record is first-class but semantically empty about its children. The literal 0.02 keyword-fallback multiplier could not be located in `lib/search`, nearest 0.02 values are the adaptive-ranking outcome weight and the cross-channel bonus, treat the 0.02 as inherited loop context and ground the actionable half in the weight table.

This flips the iteration. The win is enriching the existing embedded parent record through child aggregation plus a rollup field, not building a new node type and not chasing dead edges.

## CONCRETE CHANGE

Children-aggregation in `graphMetadataToIndexableText` go and highest leverage, do first. `graph-metadata-parser.ts:1327-1329` emits only bare child IDs with zero child content, and the parser never loads children because `resolveChildrenIds` at `graph-metadata-parser.ts:681` reads directory names only and `loadGraphMetadata` at `graph-metadata-parser.ts:1268` is called for the packet own file. Replace the bare `Children:` line with a rollup emission that reads `metadata.derived.rollup`, pushing aggregated child topics, per-child summary lines and the aggregated summary. Pure function, no schema change of its own, inert when `rollup` is absent.

Rollup fields on `derived` go for cheap-concat on-write and no-go opt-in only for LLM-aggregation. `graphMetadataDerivedSchema` (`graph-metadata-schema.ts:40-59`) is per-packet only with no aggregate field. Add an optional `rollup` object with `child_count`, freq-ranked `aggregated_key_topics` max 20, `child_summaries` of `{packet_id, status, causal_summary}` max 24, optional `aggregated_summary`, `rollup_source` enum concat or llm, and `rollup_generated_at`. Keep `schema_version` at `literal(1)` because a bump to `literal(2)` instant-fails all 2022 existing v1 files while optional fields are backward-compatible. A `deriveRollup(specFolderPath, childrenIds)` runs only when `children_ids.length > 0`, calls the existing `loadGraphMetadata` per child and folds the aggregates, wired into `deriveGraphMetadata` after `resolveChildrenIds`. Cheap-concat is the deterministic default, LLM-aggregation is opt-in behind a flag tracked by `rollup_source` so staleness and cost are visible.

Typed-edge population conditional-go for auto-derived `depends_on` plus `supersedes` flagged warn-only and no-go on dropping slots. The structural tree is fully populated, `parent_id` on 1700 of 2022 and `children_ids` on 211 parents, it is the semantic cross-references that are sparse at 2.8 percent. `PacketReference` already has a `source` discriminator (`graph-metadata-schema.ts:22`) and the parser hard-preserves manual edges never deriving them (`graph-metadata-parser.ts:1133`). Do not pollute the manual bucket, add a sibling `derived_edges` on `derived` with `depends_on` and `supersedes` arrays, omit `related_to` as too noisy to auto-derive. A conservative `deriveEdges(docs)` extracts explicit sibling packet-id mentions from spec.md and plan.md only in dependency or supersession phrasing, tagged `source: 'derived'`, then unions manual and derived in `graphMetadataToIndexableText` (`graph-metadata-parser.ts:1339-1347`) and `packetReferencesToCausalLinks` (`graph-metadata-parser.ts:1361-1367`) with manual winning on conflict.

## EVIDENCE

- Children omission and the parser never loading children: `graph-metadata-parser.ts:1311-1353`, `graph-metadata-parser.ts:681`, `graph-metadata-parser.ts:1268`.
- First-class embedded parent record carrier: `lib/storage/document-helpers.ts:34` (graph_metadata 0.75 above description_metadata 0.55), `lib/parsing/memory-parser.ts:333,353`, `lib/search/pipeline/stage1-candidate-gen.ts:341-368` (plus 0.12 packet boost).
- Rollup schema site: `graph-metadata-schema.ts:40-59`, derive wiring at `deriveGraphMetadata` after `resolveChildrenIds`.
- Edge preservation and source discriminator: `graph-metadata-schema.ts:22`, `graph-metadata-parser.ts:1133`, union sites `graph-metadata-parser.ts:1339-1347,1361-1367`.
- Real corpus edges: 57 files with 103 entries, example `028-memory-search-intelligence/009-reranker-research/graph-metadata.json`, parent thin example `028-memory-search-intelligence/graph-metadata.json` with 9 children.

## READER

Retrieval for children-aggregation and rollup because they make broad and navigational queries reach a parent. Logic for all three because the parent reads as an index of its children and the typed edges serve relationship navigation. The edge retrieval payoff is weak and unproven.

## ON-WRITE OR RETROACTIVE

Children-aggregation emit-change is retroactive on next re-index and on-write for new saves but inert until rollup is populated. Cheap-concat rollup is on-write at parent derive time plus one retroactive backfill sweep over the 211 phase-parents. The cascade gap is the real cost, a child save staleness the parent rollup because today the parent only re-derives from its own docs, so either re-derive the immediate parent whenever a child saves or accept eventual consistency plus periodic backfill. LLM-aggregation stays opt-in never on the default write path. Auto-edges are on-write at derive time via regex over docs already loaded plus optional retroactive backfill.

## RISK

The rollup retrieval lift is still a hypothesis not measured, candidate-6 was conditional. The sharp risk is a rollup-fattened parent has more surface area and could outrank the precise child on a specific query, the opposite of what is wanted. Mandatory mitigations are a broad-vs-specific query gate so the plus 0.12 parent boost (`stage1-candidate-gen.ts:355-357`) applies only when the query lacks child-identifying tokens, plus a coverage guard before defaulting on. Per the 028 lesson the rollup is still floor-bounded, it helps a parent win one of the 3 slots on broad queries but does not lift the floor, honest ceiling is navigational queries. Auto-edge extraction is noisy because packet-id mentions are not true dependencies, keep it `source: 'derived'` warn-only and never auto-write to manual. No-go on dropping `supersedes` or `related_to`, they hold real data and feed `packetReferencesToCausalLinks` so deletion is destructive.
