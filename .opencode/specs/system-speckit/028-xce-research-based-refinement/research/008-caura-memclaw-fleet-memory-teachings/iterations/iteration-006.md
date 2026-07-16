# Iteration 006 — entity / relationship / graph modeling

**Status:** insight · **Findings:** 5 · **newInfoRatio:** 0.78 · **tokens:** 117657 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Mechanism
MemClaw models memories, entities, memory-entity links, and entity-entity relations as separate storage concepts. `Memory` has optional RDF-ish fields (`subject_entity_id`, `predicate`, `object_value`) and one memory-to-memory lifecycle pointer, `supersedes_id`; it does not expose a general memory-to-memory edge table in the inspected model. Evidence: `common/models/memory.py:44`, `common/models/memory.py:45`, `common/models/memory.py:49`, `common/models/memory.py:50`, `common/models/memory.py:80`.

Entity graph storage is explicit but entity-centered: `entities` stores canonical entity rows, `memory_entity_links` is a composite `(memory_id, entity_id)` tagging table with a `role`, and `relations` stores directed entity-to-entity relations with `relation_type`, `weight`, and optional `evidence_memory_id`. Evidence: `common/models/entity.py:12`, `common/models/entity.py:27`, `common/models/entity.py:43`, `common/models/entity.py:53`, `common/models/entity.py:56`, `common/models/entity.py:62`. The initial schema adds a natural-key uniqueness constraint on `(tenant_id, from_entity_id, relation_type, to_entity_id)`, confirming relations are entity edges, not memory edges. Evidence: `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:135`, `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:143`, `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:157`, `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:162`.

Extraction is LLM-first with a structured JSON schema. The prompt asks for `entities`, `relations`, and `mentions`, including canonical names, entity types, roles, relation types, and mention/coreference clusters. Evidence: `core-api/src/core_api/services/entity_extraction.py:15`, `core-api/src/core_api/services/entity_extraction.py:30`, `core-api/src/core_api/services/entity_extraction.py:31`, `core-api/src/core_api/services/entity_extraction.py:32`. The call uses a deterministic CRC32 seed and provider response schema, then validates into `ExtractedGraph`; fallback returns regex-derived entities and no relations. Evidence: `core-api/src/core_api/services/entity_extraction.py:65`, `core-api/src/core_api/services/entity_extraction.py:77`, `core-api/src/core_api/services/entity_extraction.py:104`, `core-api/src/core_api/services/entity_extraction.py:112`, `core-api/src/core_api/services/entity_extraction.py:117`, `core-api/src/core_api/services/entity_extraction.py:122`.

Creation and validation happen in the extraction worker. It filters invalid/generic names, dedupes by canonical name, embeds entity names, resolves exact matches first and similarity matches second, preserves first-seen canonical names while storing aliases, then bulk-upserts entity rows and memory-entity links. Evidence: `core-api/src/core_api/services/entity_extraction_worker.py:22`, `core-api/src/core_api/services/entity_extraction_worker.py:103`, `core-api/src/core_api/services/entity_extraction_worker.py:105`, `core-api/src/core_api/services/entity_extraction_worker.py:127`, `core-api/src/core_api/services/entity_extraction_worker.py:172`, `core-api/src/core_api/services/entity_extraction_worker.py:200`, `core-api/src/core_api/services/entity_extraction_worker.py:253`, `core-api/src/core_api/services/entity_extraction_worker.py:294`, `core-api/src/core_api/services/entity_extraction_worker.py:326`, `core-api/src/core_api/services/entity_extraction_worker.py:341`.

Relations are created only when both endpoint entities resolve; the memory becomes provenance via `evidence_memory_id`. Evidence: `core-api/src/core_api/services/entity_extraction_worker.py:356`, `core-api/src/core_api/services/entity_extraction_worker.py:361`, `core-api/src/core_api/services/entity_extraction_worker.py:362`, `core-api/src/core_api/services/entity_extraction_worker.py:368`, `core-api/src/core_api/services/entity_extraction_worker.py:370`. Storage makes relation writes idempotent with `ON CONFLICT DO UPDATE`, refreshing weight and latest non-null evidence without wiping old evidence on null writes. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:2983`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3011`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3013`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3015`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3021`.

Relationships feed recall in two ways. First, entity-token queries can short-circuit into `ENTITY_LOOKUP`: entity FTS, graph expansion, memory collection through `memory_entity_links`, then scoring by hop/relationship boost instead of vector similarity. Evidence: `core-api/src/core_api/pipeline/steps/search/classify_query.py:3`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:99`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:109`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:125`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:131`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:295`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:313`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:381`. Second, normal scored search can apply an entity/graph boost by matching query tokens to entities, expanding relation hops, collecting linked memories, and multiplying score by hop/relation weights. Evidence: `core-api/src/core_api/services/memory_service.py:2709`, `core-api/src/core_api/services/memory_service.py:2736`, `core-api/src/core_api/services/memory_service.py:2741`, `core-api/src/core_api/services/memory_service.py:2755`, `core-api/src/core_api/services/memory_service.py:2768`, `core-api/src/core_api/services/memory_service.py:2781`, `core-api/src/core_api/services/memory_service.py:2783`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1042`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1053`.

MemClaw also has graph hygiene and inference machinery: cross-link discovery links under-connected memories to semantically similar entities only when text verification passes, and relation inference creates/reinforces `related_to` edges from entity co-occurrence. Evidence: `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:26`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:72`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:92`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:126`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:132`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:21`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:46`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:60`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:152`.

## Teachings for Spec Kit Memory (027/004 + 027/005)
1. **Claim** · Keep causal memory edges separate from entity/relationship tags; use entities as an auxiliary recall and validation channel, not as causal truth.
**Evidence** · MemClaw’s explicit relation table is entity-to-entity with `evidence_memory_id`, while memory-level linkage is `memory_entity_links` plus the special `supersedes_id` pointer. `common/models/entity.py:27`, `common/models/entity.py:43`, `common/models/entity.py:53`, `common/models/memory.py:80`.
**Maps-to** · new sub-packet.
**Verdict** · ADAPT.
**Risk** · Entity extraction noise can make non-causal co-mentions look important.
**Confidence** · High.
**Why it transfers (or not)** · Transfers well to local SQLite if treated as a side-channel; it should not contaminate Spec Kit’s 027/004 causal-edge tombstone lifecycle or 027/005 deterministic metadata-edge promoter.

2. **Claim** · Relationship creation should be evidence-backed and idempotent.
**Evidence** · Extracted relations are written only when both endpoint entities resolve, and each relation carries `evidence_memory_id`; storage upserts on the relation natural key and preserves existing evidence when a new write has null evidence. `core-api/src/core_api/services/entity_extraction_worker.py:361`, `core-api/src/core_api/services/entity_extraction_worker.py:370`, `core-storage-api/src/core_storage_api/services/postgres_service.py:2983`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3013`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3021`.
**Maps-to** · 027/004.
**Verdict** · ADAPT.
**Risk** · Latest-evidence-wins may hide conflicting provenance unless Spec Kit stores evidence history.
**Confidence** · High.
**Why it transfers (or not)** · Spec Kit already has causal edges and tombstones; the transferable part is requiring provenance memory/spec-doc evidence and idempotent natural keys for relationship promotion.

3. **Claim** · Add deterministic guards before promoting relationship metadata.
**Evidence** · MemClaw uses structured response schema plus deterministic seed for LLM extraction, filters blocklisted/too-short names, dedupes first occurrence, preserves first-seen canonical names, and stores aliases instead of allowing longer hallucinated names to become canonical. `core-api/src/core_api/services/entity_extraction.py:112`, `core-api/src/core_api/services/entity_extraction.py:117`, `core-api/src/core_api/services/entity_extraction_worker.py:22`, `core-api/src/core_api/services/entity_extraction_worker.py:103`, `core-api/src/core_api/services/entity_extraction_worker.py:200`, `core-api/src/core_api/services/entity_extraction_worker.py:253`.
**Maps-to** · 027/005.
**Verdict** · ADOPT.
**Risk** · Over-strict canonicalization can miss useful aliases.
**Confidence** · High.
**Why it transfers (or not)** · Strongly transfers because 027/005 is already deterministic; use this as a pattern for validating parent/child/frontmatter entity claims before edge promotion.

4. **Claim** · Entity graph recall should be a bounded boost or explicit short-circuit, never an unbounded traversal.
**Evidence** · MemClaw rejects entity-lookup when entity matches are too broad, caps expanded entities and boosted memories, scores by hop/relationship weights, and falls back to normal search if entity lookup fails. `core-api/src/core_api/pipeline/steps/search/classify_query.py:82`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:90`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:143`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:286`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:322`, `core-api/src/core_api/services/memory_service.py:2787`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:195`.
**Maps-to** · new sub-packet.
**Verdict** · ADAPT.
**Risk** · In a small local store, boosts may overfit and dominate semantic/BM25 ranking.
**Confidence** · Medium-high.
**Why it transfers (or not)** · The bounded/fallback design transfers; the fleet-scale concurrency pieces do not. Spec Kit can use local entity overlap as an explainable recall boost alongside existing graph/degree channels.

5. **Claim** · Co-occurrence-inferred relations should be deferred unless Spec Kit can attach confidence, evidence, and tombstone semantics.
**Evidence** · MemClaw infers `related_to` edges from shared `memory_entity_links`, reinforces weights by co-occurrence, and inserts without direct evidence memory. `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:21`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:46`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:60`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:110`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:123`, `core-api/src/core_api/pipeline/steps/entity_linking/infer_relations.py:152`.
**Maps-to** · 027/004.
**Verdict** · DEFER.
**Risk** · Co-occurrence can create durable false relationships that need deletion/tombstone behavior.
**Confidence** · Medium.
**Why it transfers (or not)** · For single-user local memory, co-occurrence can help discovery but should not become a causal edge without explicit provenance and reversible lifecycle handling.

## Negative knowledge
Do not copy tenant/fleet scoping, cross-tenant visibility widening, per-tenant storage bulkheads, or fleet purge logic. They solve MemClaw’s SaaS/fleet isolation problem, not Spec Kit’s local single-user relationship model. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:130`, `core-storage-api/src/core_storage_api/services/postgres_service.py:171`, `core-storage-api/src/core_storage_api/services/postgres_service.py:195`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:354`.

Do not copy Postgres-specific graph storage machinery as-is: pgvector/HNSW, TSVECTOR/GIN triggers, LATERAL joins, and HTTP storage-client batching are implementation details for a production service. Evidence: `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:21`, `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:68`, `core-storage-api/src/core_storage_api/database/migrations/versions/001_initial_schema.py:85`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:92`.

Do not copy background fleet-worker architecture. MemClaw explicitly frames entity extraction as off-hot-path and future worker/PubSub work; Spec Kit should prefer deterministic local maintenance passes. Evidence: `core-api/src/core_api/services/entity_extraction_worker.py:67`, `core-api/src/core_api/services/entity_extraction_worker.py:72`.

Do not copy automatic cross-linking without safeguards. MemClaw’s cross-linker only targets active embedded memories, under-connected rows, thresholded similar entities, and optional text verification; copying only the “link similar entity” part would create false links. Evidence: `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:47`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:72`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:126`, `core-api/src/core_api/pipeline/steps/entity_linking/discover_cross_links.py:132`.

Do not treat MemClaw’s `relations` as proof it has general memory-to-memory causal edges. The inspected relation model is entity-to-entity; the inspected memory-to-memory mechanism is only `supersedes_id`. Evidence: `common/models/entity.py:35`, `common/models/entity.py:39`, `common/models/entity.py:43`, `common/models/memory.py:80`.

## Open questions
Should Spec Kit introduce a local `entities`/`memory_entity_links` auxiliary schema, or should entity signals live in existing memory metadata/frontmatter only?

Can 027/005’s deterministic metadata-edge promoter also promote entity links, while keeping causal edges restricted to parent/child/parent-chain relationships?

What minimum provenance should a Spec Kit entity relation require: exact frontmatter field, matching spec path hierarchy, textual co-occurrence, or LLM/heuristic extraction evidence?

Should entity/relationship links participate in 027/004 tombstones, or should they have a separate invalidation lifecycle so noisy entity links do not pollute causal-edge history?

Would a subject-entity preflight guard reduce false causal promotions, similar to MemClaw’s “both subject IDs present and different means skip” rule? Evidence: `core-api/src/core_api/services/subject_preflight.py:3`, `core-api/src/core_api/services/subject_preflight.py:24`.

DELTA_JSON: {"iteration":"006","focus":"entity / relationship / graph modeling","findingsCount":5,"newInfoRatio":0.78,"topVerdicts":["ADAPT: separate entity relationship side-channel from causal memory edges","ADOPT: deterministic validation guards before metadata-edge promotion","ADAPT: bounded entity graph recall boost with fallbacks","DEFER: co-occurrence inferred relations without tombstone/provenance semantics"],"sources":["common/models/entity.py:27","common/models/memory.py:80","core-api/src/core_api/services/entity_extraction.py:15","core-api/src/core_api/services/entity_extraction_worker.py:356","core-storage-api/src/core_storage_api/services/postgres_service.py:2983","core-api/src/core_api/pipeline/steps/search/classify_query.py:99","core-api/src/core_api/services/memory_service.py:2709"]}
