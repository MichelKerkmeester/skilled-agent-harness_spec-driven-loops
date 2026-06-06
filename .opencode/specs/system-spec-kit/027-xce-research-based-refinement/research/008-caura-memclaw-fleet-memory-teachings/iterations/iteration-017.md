# Iteration 017 — ADVERSARIAL refute write-safety/indexing/reconciliation teachings

**Status:** insight · **Findings:** 4 · **newInfoRatio:** 0.7 · **tokens:** 69506 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Citation verification
C1: MISATTRIBUTED. `common/models/idempotency.py:30-53` defines `IdempotencyResponse` with `(tenant_id, idempotency_key)`, `request_hash`, response fields, TTL, and pending state. `core-api/src/core_api/middleware/idempotency.py:158-169` documents lookup → claim → poll, and `:198-203` rejects same key with a different body. But this is route-level HTTP idempotency. `POST /memories` and bulk write use it, while `PATCH /memories/{memory_id}` explicitly remains last-write-wins and does not call `idempotency_for`.

C2: VERIFIED with caveat. `merge_enrichment_fields.py:28-33` says LLM fills gaps and agent-provided `memory_type`/`weight` win. `:41-45` applies LLM dates only when absent. `memory_service.py:1656-1660` says `agent_provided_fields` is forwarded so worker redelivery does not overwrite explicit write-time fields. Caveat: `merge_enrichment_fields.py:34-40` and `:46-50` overwrite/enrich metadata keys like `summary`, `tags`, `llm_ms`, `contains_pii`, so the evidence is not a universal field-source lattice.

C3: MISATTRIBUTED. `check_semantic_duplicate.py:7-10` documents a hard 409 auto-reject and LLM-judge tier, and `:193-210` raises `HTTPException(409)` for confident duplicates. Advisory preview exists in `detect_near_duplicate.py:25-27` and `:106-107`, where metadata receives `near_duplicate_of` and `near_duplicate_similarity` without rejection. The cited pair does not support “tiered semantic dedup as advisory only”; it supports two separate paths, one hard-reject and one advisory.

C4: MISATTRIBUTED. `common/embedding/_service.py` contains provider resolution, retry, degraded-state, document/query embedding paths, but not persisted embedder tuple columns. `common/models/memory.py:24` has a `Vector(VECTOR_DIM)` column, `:33-39` has `content_hash` and `client_request_id`, and `:85-105` indexes those fields. `postgres_service.py:581-591` updates embeddings, and `:597-662` looks up by `content_hash`. I did not find the claimed persisted embedder tuple `(id, dim, version)`, chunk fingerprint columns, or derived-state columns in the cited files.

## Refutation analysis
C1: Strongest objection: this is an HTTP multi-request replay pattern with polling, TTL, conflict handling, and storage outage behavior. For a single-user local SQLite store, adopting the full table/pending-sentinel/TTL/poll loop is likely cargo-cult unless Spec Kit has a real lost-response or concurrent retry failure mode. It is also only evidenced for create/bulk, not update. A local store can often get the same practical safety from a transaction plus a small operation receipt keyed by operation/body hash, without route middleware semantics.

C2: Strongest objection: the valuable part is already planned. 027 already includes manual-edge overwrite protection, auto provenance, and async post-insert enrichment. As a new teaching, C2 is redundant or validation-only. The cited Caura implementation is also partial: typed fields are guarded, worker patches carry `agent_provided_fields`, but metadata is still mutated by enrichment. Directly porting it could create a false sense that all caller-provided fields are protected.

C3: Strongest objection: the hard-reject tier, LLM judge, subject preflight, and human review queue are over-engineered for a single-user local corpus and increase false-positive risk. The only transferable part is the advisory near-duplicate metadata if embeddings already exist. The “tiered” form should not be adopted as-is.

C4: Strongest objection: the citation does not prove the main claim. It proves content hashes, per-attempt IDs, pgvector persistence, and cache keys that include model/dimension in one search cache path. The chunk-fingerprint and chunk-line-span portion is already planned in 027 incremental-index, while persisted embedder tuple columns are not evidenced in the cited code. PostgreSQL/pgvector assumptions also port poorly to SQLite/vector-store without a concrete migration model.

## Verdict adjustments
| Claim | Prior verdict | NEW verdict (UPHELD/DOWNGRADE-to-X/REFUTED) | Reason |
| --- | --- | --- | --- |
| C1 | UNKNOWN, not provided in prompt | DOWNGRADE-to-minimal local operation receipt | Evidence is real for HTTP create/bulk idempotency, not update; full pending/TTL/poll design is overbuilt for local SQLite. |
| C2 | UNKNOWN, not provided in prompt | DOWNGRADE-to-validation-only | Real evidence supports caller-provided field precedence, but it is already covered by 027 write-safety/reconciliation and is not universal across metadata. |
| C3 | UNKNOWN, not provided in prompt | DOWNGRADE-to-advisory-only | Advisory `near_duplicate_of` is real, but the cited tiered dedup also hard-rejects; only non-blocking metadata survives. |
| C4 | UNKNOWN, not provided in prompt | REFUTED | Cited files do not show persisted embedder tuple, chunk fingerprints, or derived-state columns; content-hash/chunk-fingerprint work is redundant with 027 incremental-index. |

## Surviving teachings
C1 survives only as a narrow local receipt concept: if Spec Kit Memory has retryable `memory_save` writes, store a minimal operation/body hash receipt in SQLite and replay the same result for identical retries. Do not import HTTP pending polling, TTL cleanup, or update idempotency unless a real local failure mode requires it.

C2 survives as a validation criterion: automated enrichment must merge into gaps and must not overwrite caller/manual fields. Treat this as confirmation of already-planned 027 safety, not a new feature.

C3 survives as optional advisory metadata: compute `near_duplicate_of` and similarity only when embeddings are already available, never hard reject, never require an LLM judge or human review queue for the local single-user store.

DELTA_JSON: {"iteration":"017","focus":"ADVERSARIAL refute write-safety/indexing/reconciliation teachings","findingsCount":4,"newInfoRatio":0.7,"topVerdicts":["DOWNGRADE: C1 only supports minimal local operation receipts, not full HTTP idempotency for update","DOWNGRADE: C2 is validation-only because field precedence is already planned and metadata protection is partial","REFUTED: C4 citations do not show persisted embedder tuple or chunk fingerprint columns"],"sources":["common/models/idempotency.py:30","core-api/src/core_api/middleware/idempotency.py:158","core-api/src/core_api/routes/memories.py:1331","core-api/src/core_api/pipeline/steps/write/merge_enrichment_fields.py:28","core-api/src/core_api/services/memory_service.py:1656","core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:7","core-api/src/core_api/pipeline/steps/write/detect_near_duplicate.py:25","common/models/memory.py:24","core-storage-api/src/core_storage_api/services/postgres_service.py:581"]}
