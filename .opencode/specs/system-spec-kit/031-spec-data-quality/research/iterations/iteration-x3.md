# Iteration X3 - description.json schema redesign (opus, cross-cutting)

## TITLE

Cohort X3. Model opus via claude2. Wave-3 redesign of `perFolderDescriptionSchema` into five optional blocks, each judged go or no-go against the three surfaces description.json lands on and against the 3-result truncation law.

## FINDINGS

description.json lands on three distinct surfaces and the surface a field reaches decides its reader and its relation to truncation. Surface 1 is on-disk JSON only. `perFolderDescriptionSchema` is `.passthrough()` (`description-schema.ts:69`) so any new field persists on disk and is read directly by `validate.sh`, the resume ladder, phase-parent detection and the validation orchestrator. These readers bypass the truncation floor by construction because they read the file not a retrieval candidate. Surface 2 is the embedded retrieval vector. description.json is indexed as a `description_metadata` record (`memory-parser.ts:435`) but the embedded text is composed by `descriptionMetadataToIndexableText` (`memory-parser.ts:595-607`) from a hardcoded subset, and the `DescriptionMetadataContent` interface plus its return block (`memory-parser.ts:528-592`) form a fixed allow-list that silently drops passthrough fields. Surface 3 is trigger phrases via `buildDescriptionTriggerPhrases` (`memory-parser.ts:609-621`).

The truncation consequence is the 028 lesson restated. A `description_metadata` record is one candidate in the truncated pool. Landing a field on Surface 2 makes that single candidate vector richer with better odds of entering top-3, it does not multiply candidates or escape the floor. So the unconstrained wins are Surface-1 fields serving adherence, logic and ops. Surface-2 fields are enrichment not floor-escape.

Two feasibility facts de-risk the redesign. The embedding metadata the brief wants already exists at chunk grain. `model_id`, `dimensions`, `content_hash` and `chunk_fingerprint` are live columns (`vector-index-schema.ts:128,171,181,591`) and the embeddings-cache PK is `(content_hash, model_id, dimensions)` at `vector-index-schema.ts:319`, so a packet-level embedding block is a cheap rollup of existing data not new infrastructure. A backfill harness precedent already exists. `scripts/memory/backfill-research-metadata.ts:5-24` does missing-only description.json backfill via `loadPerFolderDescription` and `savePerFolderDescription`.

## CONCRETE CHANGE

Five new optional blocks on `perFolderDescriptionSchema`, with the parser allow-list extended only for the fields meant to reach retrieval.

Block A `embedding` go. Fields `model_id`, `dimensions`, `chunk_strategy_version`, `content_fingerprint`, `embedded_at`, optional `chunk_count`. On-write in the canonical-save workflow reading `model_id` and `dimensions` back from the embeddings the save just wrote and hashing the canonical docs it just read, chunker version is a constant. Backfill extends `backfill-research-metadata.ts`, recompute the fingerprint and pull `model_id` and `dimensions` from existing `memory_index` rows, no re-embed needed. Surface 1 so it bypasses truncation. It is the substrate for drift-triggered re-index not a measured retrieval lift, classify it as a validated enabler.

Block B `quality` conditional go for governance and no-go for default retrieval. Fields `score` 1 to 5 Likert, `judged_by`, `judged_at`, optional `rubric_version`. On-write an optional LLM-judge call kept off the hot path, populate async or only on complete. Backfill is the Langfuse score-backfill pattern. Surface 1 adherence and governance gate surfaced in `validate.sh`. It moves retrieval only if wired into the folder pre-filter ranker or a rerank tiebreaker, embedding the scalar as Surface-2 text is noise. The 82.5 vs 73.3 brief number validates metadata fusion not a quality scalar, do not borrow it here.

Block C `semantics` split. `content_type` go, deterministic from level plus filename plus phase-parent flag all already computed in `generatePerFolderDescription`, add to the parser allow-list plus `descriptionMetadataToIndexableText` and `buildDescriptionTriggerPhrases`, reader retrieval plus adherence. `answerable_questions` conditional go and highest retrieval value, most aligned with the brief query-doc alignment number but only when landed on Surface 2 and even then it enriches one candidate not the floor, conditional on LLM generation cost at write time. `semantic_intent` go as Surface-2 and Surface-3 enrichment, moderate value via LLM or heuristic. These three are the only new fields that justify touching `memory-parser.ts:528,595,609`, skipping that makes them inert.

Block D `temporal` go for logic and governance, no-go for retrieval rerank. Fields `created`, optional `last_verified`, optional `shelf_life_class` enum volatile stable durable, optional `stale_after`. On-write `created` set once and preserved on re-save the way `memorySequence` is preserved at `folder-discovery.ts:901`, `last_verified` stamped by the completion gate, `shelf_life_class` defaulted by `content_type`. Backfill `created` from git first-commit or ctime. Surface 1 logic freshness plus the `validate.sh` staleness gate, bypasses truncation. Do not claim a retrieval lift, freshness-as-rerank is the set-merge mirage.

Block E `provenance` go for logic and audit, supersedes-pointer no-go for retrieval. Fields `generating_model`, `source_commit`, optional nullable `supersedes`. On-write `generating_model` from runtime env and `source_commit` from `git rev-parse`, both cheap and deterministic. Backfill `source_commit` from the last touching commit and `generating_model` UNKNOWN for legacy. Surface 1 logic and audit. `supersedes` is go as stored lineage but no-go to power retrieval because its natural consumer is the typed-edge layer, storing it in description.json is the cheap honest place to keep lineage without depending on that layer.

## EVIDENCE

- Three surfaces and the parser drop: `memory-parser.ts:435` (description.json indexed as `description_metadata`), `memory-parser.ts:528-592` (hardcoded allow-list dropping passthrough), `memory-parser.ts:595-607` (embedded-text composer), `memory-parser.ts:609-621` (trigger phrases), `description-schema.ts:69` (`.passthrough()`), `folder-discovery.ts:552` (pre-filter not a vector-search replacement).
- Block A is a rollup of live chunk-grain metadata: `vector-index-schema.ts:128,171,181,319,591`.
- Backfill precedent: `scripts/memory/backfill-research-metadata.ts:5-24`.
- On-write composers: `folder-discovery.ts:851-904` (`generatePerFolderDescription`), `folder-discovery.ts:962-986` (`savePerFolderDescription`), `scripts/memory/generate-context.ts` (canonical-save entry).

## READER

Retrieval Block A as an indirect enabler plus Block C `content_type`, `answerable_questions` and `semantic_intent` as enrichment of one candidate not floor-escape. Adherence Block B governance gate, Block C `content_type`, Block D staleness gate. Logic Block D temporal and Block E provenance and lineage.

## ON-WRITE OR RETROACTIVE

All five blocks are on-write in the canonical-save workflow plus retroactive via the existing backfill harness. Surface-1 blocks A, D, E and B backfill cleanly from git and existing DB columns with no re-embed. Surface-2 fields in Block C require a re-index to take retrieval effect, sequence them behind the same coverage guard as the header-path re-index because both touch embedded text and a partial re-index splits the corpus across two chunk-strategy versions.

## RISK

The single biggest failure mode is the parser-drop gotcha. Adding fields to the zod schema feels like a retrieval win because `.passthrough()` persists them but `memory-parser.ts:528` and `memory-parser.ts:595` silently strip them from the embedded vector, so any field claimed to serve retrieval must also extend the parser allow-list or it is inert. Second caveat, the redesign is prove-first only for the enablers A and C. The measured retrieval numbers in the brief belong to chunk-grain prefixing and fusion, description.json inherits them only insofar as Block C fields are injected into the embedded text and even then they enrich one truncated candidate rather than beating the floor. The honest default-quality wins are the Surface-1 governance, logic and ops fields B-as-gate, D, E and A-as-drift-substrate which bypass truncation by construction.
