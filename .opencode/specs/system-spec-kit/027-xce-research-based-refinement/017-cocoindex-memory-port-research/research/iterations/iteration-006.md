# Iteration 006 - K1.5 auto causal-edge derivation

## Focus

K1.5 asks whether causal edges can be auto-derived from spec-doc relationships such as supersedes, caused-by, and cited-by using CocoIndex's multi-phase knowledge-graph pattern: LLM extraction, embedding-assisted deduplication, canonical entity resolution, and graph declaration. The second half is the important one for this codebase: how to keep LLM-derived edges from polluting the memory graph.

Verdict preview: yes with adaptation. The deterministic metadata path should ship first. The LLM path is viable only as a quarantined, confidence-scored enrichment layer.

## Actions Taken

- Read the CocoIndex conversation-to-knowledge package docs at `external/cocoindex-main/examples/conversation_to_knowledge/README.md`, `design.md`, and `spec.md`.
- Read the concrete multi-phase graph implementation at `external/cocoindex-main/examples/meeting_notes_graph_neo4j/main.py`.
- Read CocoIndex entity resolution and LLM pair-resolver internals in `python/cocoindex/ops/entity_resolution/__init__.py` and `llm_resolver.py`.
- Read our causal graph handler and storage code in `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` and `lib/storage/causal-edges.ts`.
- Surveyed spec metadata and relationship fields in representative `description.json` and `graph-metadata.json` files.
- Checked for prior causal-pollution feedback files under the Claude project memory path; none matched `feedback_*causal*`.

## Findings

### CocoIndex multi-phase shape

The `conversation_to_knowledge` example is a podcast-to-knowledge graph design rather than the implementation file itself. Its README names the pipeline stages explicitly: ingest sessions, transcribe, run LLM extraction, resolve duplicate persons/tech/org entities with embedding similarity plus LLM confirmation, then store graph nodes and relations (`README.md:26-31`). It also states that updates are incremental: reruns skip unchanged sessions (`README.md:95-102`).

The design doc is more concrete. Per session, processing is mounted as a component and memoized (`spec.md:42-49`). It uses two LLM calls per session: metadata/speaker identification, then statement and involved-entity extraction (`design.md:116-150`, `design.md:177-196`). For entity resolution, it computes memoized embeddings, selects nearest already-processed candidates below a distance threshold, calls an LLM only when candidates exist, then creates a deduplication dictionary that maps raw names to canonicals (`spec.md:87-109`).

The concrete graph implementation in `meeting_notes_graph_neo4j/main.py` has the same three-phase pattern. Phase 1 uses a memoized `extract_meeting()` LLM call per meeting section (`main.py:198-211`) inside memoized per-file processing (`main.py:248-287`). Phase 2 resolves raw person names through `resolve_entities()` with a sentence-transformer embedder and `LlmPairResolver` (`main.py:295-301`). Phase 3 declares canonical `Person` nodes and person-touching relations after resolution (`main.py:309-345`). The app mounts per-file components under stable subpaths and mounts resolution plus final relation declaration as separate components (`main.py:400-438`).

For our port, that means the CocoIndex pattern is not "one big LLM graph write." It is a staged pipeline: extract local facts, normalize entities globally, then declare graph target rows from canonicalized IDs.

### Dedup and confidence behavior

CocoIndex entity resolution uses embeddings as a candidate generator, not as the final truth. `resolve_entities()` embeds each unique raw entity (`__init__.py:201-207`), normalizes vectors and stores them in a FAISS inner-product index (`__init__.py:210-225`), and searches only the top-N candidates above a threshold derived from `max_distance` (`__init__.py:244-260`). Only then does it call the pair resolver (`__init__.py:281-297`).

The LLM resolver is structured and contract-checked, but it does not emit a numerical confidence. It returns only `matched` and `canonical` (`llm_resolver.py:22-28`), retries if `matched` is not in the supplied candidate list (`llm_resolver.py:106-123`), and explicitly tells the model to return no match when unsure (`llm_resolver.py:30-46`). So CocoIndex gives useful guardrails and memoization, but not per-edge confidence scoring.

The practical implication: for causal edges, embedding similarity and LLM agreement can contribute to confidence, but the port must define its own score. Relying on the LLM output unconditionally would be weaker than the source pattern.

### Our current causal-edge surface

The live storage relation vocabulary is `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, and `supports` (`causal-edges.ts:18-25`). The handler-facing stats vocabulary still includes `produced` and `cited_by` (`causal-graph.ts:112-119`), so any K1.5 implementation should reconcile relation naming before widening extraction. The schema already stores `strength`, `evidence`, `extracted_at`, and `created_by`, but not `confidence` or `extraction_method` (`vector-index-schema.ts:607-621`).

Manual linking is the main public write path. `memory_causal_link` validates the relation and then calls `insertEdge()` without a `createdBy` override, so it defaults to manual (`causal-graph.ts:668-736`; `causal-edges.ts:253-262`). There is an auto path in storage: when `createdBy === 'auto'`, strength is capped at `0.5`, auto edges are bounded per node, and insert/update writes `created_by` (`causal-edges.ts:269-288`, `causal-edges.ts:326-365`). There is also a deterministic spec-document chain builder that links `spec -> plan -> tasks -> implementation_summary` and support docs (`causal-edges.ts:852-897`). This confirms the current system already accepts programmatic edges, but only for narrow structural chains.

Pollution controls exist, but they are coarse. `memory_causal_stats` computes recent relation balance and flags a skew when one relation dominates a sufficiently large window (`causal-graph.ts:140-181`). It also reports orphaned edges and low coverage hints (`causal-graph.ts:824-870`). Those are graph-health checks, not acceptance gates for new LLM edges.

### Deterministic metadata is already available

Spec metadata already has structured relationship fields. The active K1.5 packet's metadata is sparse, but it still shows the standard slots: `parent_id`, `children_ids`, and `manual.depends_on`, `manual.supersedes`, `manual.related_to` (`013.../graph-metadata.json:3-11`). A representative phase has explicit `manual.depends_on` in `description.json` (`007.../description.json:20-27`) and the normalized equivalent plus `related_to` in `graph-metadata.json` (`007.../graph-metadata.json:7-18`). A phase parent has `children` in `description.json` (`003.../description.json:19-29`) and normalized `children_ids` plus object-form dependency reasons in `graph-metadata.json` (`003.../graph-metadata.json:6-28`).

This means the safest first implementation does not need LLM extraction at all. A deterministic promoter can parse `graph-metadata.json` and `description.json`, resolve packet IDs to memory rows, and emit typed causal edges with evidence strings pointing back to the metadata field.

## Two-Track Derivation Model

| Track | Source | Mechanism | Pollution risk | Verdict |
|-------|--------|-----------|----------------|---------|
| Deterministic | `graph-metadata.json` / `description.json` fields such as `parent_id`, `children_ids`, `manual.depends_on`, `manual.supersedes`, `manual.related_to`, and phase `children` | Parse structured fields, normalize packet IDs, resolve memory rows, then emit edges directly with `created_by='auto'`, `extraction_method='frontmatter'`, and high confidence | Near-zero when packet IDs resolve and relation mapping is constrained | Ship first |
| LLM-derived | Body prose such as "builds on", "fixes", "supersedes", "caused by", "cited by", and research/ADR references | Run extraction per K1.4 chunk, canonicalize packet/doc/entity names through embedding candidates plus LLM pair judge, then produce proposed edges | Real; body prose is ambiguous and LLMs over-connect narratives | Ship only behind confidence gates and quarantine |

Recommended deterministic relation mapping:

1. `manual.depends_on` and hard dependency prose -> `supports` or `caused` depending on direction policy. I would use dependency source `caused` target only when the target work truly follows from the source; otherwise use `supports`.
2. `manual.supersedes` -> `supersedes`.
3. `parent_id` / `children_ids` -> `derived_from` or `supports`, not `caused`, because containment is lineage/context rather than causal proof.
4. `related_to` -> quarantine by default or store as non-causal graph metadata. It is too weak for active causal boost.
5. `cited_by` should not be introduced until the storage vocabulary is reconciled, because live `RELATION_TYPES` does not include it (`causal-edges.ts:18-25`) while the output coverage array still names it (`causal-graph.ts:112-119`).

## Confidence and Validation Scheme

Add explicit acceptance metadata rather than overloading `strength`.

Recommended schema additions:

- `causal_edges.confidence REAL DEFAULT 1.0 CHECK(confidence >= 0 AND confidence <= 1)`
- `causal_edges.extraction_method TEXT CHECK(extraction_method IN ('manual','frontmatter','metadata','llm','embedding_similarity','structural_chain'))`
- `causal_edges.extraction_run_id TEXT`
- `causal_edges.source_chunk_id TEXT`
- `causal_edges.extracted_at` can stay as the timestamp column.
- `causal_edges_pending` mirrors causal edge columns plus `confidence`, `extraction_method`, `rejection_reason`, `reviewed_by`, `reviewed_at`, and `status`.

Scoring:

- Deterministic metadata with resolvable packet IDs: `confidence=0.98`, auto-accept.
- Deterministic metadata with unresolved but syntactically valid packet ID: quarantine, because endpoint resolution failed.
- LLM extraction with explicit quoted evidence, exact target packet match, relation in allowed set, and no contradiction: base `0.78`; add for embedding/entity agreement and metadata corroboration.
- LLM extraction without quote span or with weak `related_to` language: drop or quarantine below threshold.

Thresholds:

- `>= 0.85`: auto-accept only if relation is in live `RELATION_TYPES`, both endpoints resolve, evidence includes a source file/chunk/line span, and relation-window caps pass.
- `0.70-0.85`: insert into `causal_edges_pending`.
- `< 0.70`: drop, but optionally record aggregate extraction metrics.

Validation gates:

- Endpoint gate: both source and target must resolve to existing `memory_index` IDs or stable packet IDs mapped to rows.
- Relation gate: relation must be one of the storage enum values, not the stats-only vocabulary.
- Evidence gate: LLM edges require a quoted source span or chunk ID from K1.4.
- Direction gate: validate relation direction against phrase templates and known metadata direction. For example, "A supersedes B" maps A -> B, while "A depends on B" should not become A -> B `caused` without policy.
- Dedup gate: unique key should include source, target, relation, source chunk, target chunk, and extraction method; repeated evidence updates confidence rather than multiplying edges.
- Burst gate: reuse current relation-window and per-node auto caps, then extend stats to show pending counts and rejected counts.
- Human review gate: expose a quarantine sweep through a new MCP tool or extend `memory_causal_stats` with `pending_edges`.

## Verdict on K1.5 and Pipeline Sketch

YES-WITH-ADAPTATION. CocoIndex's multi-phase pattern transfers cleanly as an architecture: memoized per-chunk extraction, embedding-assisted entity candidate selection, LLM pair resolution, canonical endpoint mapping, then graph declaration. But CocoIndex does not provide per-edge confidence or pollution-safe acceptance semantics; its LLM resolver returns a structured yes/no canonicalization decision, not a calibrated score. Therefore our implementation should use CocoIndex's shape, not its trust policy.

Phase 1 should be a deterministic frontmatter/metadata promoter in TypeScript. It reads `graph-metadata.json` and `description.json`, normalizes packet IDs, resolves memory rows, emits `created_by='auto'` edges with `extraction_method='frontmatter'`, and never calls an LLM. This gives immediate coverage for `depends_on`, `supersedes`, parent/child lineage, and selected support relations with low pollution risk.

Phase 2 should be an LLM extractor gated on K1.4 chunk fingerprints. It runs only for changed chunks, extracts candidate relationship claims with source spans, canonicalizes endpoint names through embedding candidate search plus an LLM pair judge, scores the proposed edge, and either auto-accepts, quarantines, or drops it. The target-state reconciliation from K1.3 should own insert/update/delete behavior so regenerated edge proposals do not leak stale edges.

## Questions Answered

- K1.5 answered: causal edges can be auto-derived, but deterministic metadata promotion should precede LLM-derived graph enrichment.
- CocoIndex confidence answered: no native per-edge confidence was found; pair resolution is structured and memoized but not calibrated.
- Pollution prevention answered: require endpoint, relation, evidence, direction, dedup, burst, and review gates.
- Schema answered: add explicit `confidence` and `extraction_method`, plus a `causal_edges_pending` quarantine table.

## Questions Remaining

- K1.6: decide what DAG/chunk/reconciliation telemetry should be exposed through MCP responses versus internal logs.
- K2.1, K2.2, K2.3, and K2.5 remain open from the strategy.

## Next Focus

Recommend K1.6 next: telemetry and observability for the proposed DAG, chunk, and causal-edge pipelines. K1.5 adds new acceptance and quarantine states, so the next uncertainty is which of those states must be visible to operators through MCP tools.
