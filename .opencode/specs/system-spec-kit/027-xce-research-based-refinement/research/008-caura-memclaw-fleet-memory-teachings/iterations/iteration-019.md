# Iteration 019 — ADVERSARIAL refute relationship/lifecycle/governance teachings

**Status:** insight · **Findings:** 4 · **newInfoRatio:** 0.25 · **tokens:** 118626 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Citation verification

C1: MISATTRIBUTED. `postgres_service.py:1606-1644` is `memory_archive_stale`, not soft-delete, tombstone, or hard-delete. The actual soft-delete primitive is `postgres_service.py:418-423`, and hard purge is `postgres_service.py:1646-1687`. Grace window is verified, but first-timestamp idempotence is not: direct `memory_soft_delete` rewrites `deleted_at` on repeat. Sticky lifecycle audit is verified in `LifecycleAudit` and finalization: `common/models/lifecycle_audit.py:24-58`, `common/events/lifecycle_handlers.py:127-246`, `postgres_service.py:4315-4374`.

C2: MISATTRIBUTED. `common/enrichment/schema.py` is enrichment/tag/atomic-fact schema, not generated-edge promotion. `common/models/entity.py` defines entity rows, entity-to-entity `Relation`, and `MemoryEntityLink`, but no generated/manual provenance column and no manual-edge skip policy. Natural-key upsert exists elsewhere for entity relations in `postgres_service.py:2983-3048`, but it is not causal memory-edge promotion.

C3: VERIFIED. MemClaw separates entity graph storage from memory lineage: `common/models/entity.py:27-50` defines entity-to-entity relations with optional `evidence_memory_id`, and `common/models/entity.py:53-62` defines memory-entity links. Recall boost is bounded and fallback-safe in `memory_service.py:2709-2810`, with max boosted memories at `memory_service.py:2787` and exception fallback at `memory_service.py:2807-2808`.

MemClaw does not have true generalized memory<->memory causal edges. It has one limited memory self-FK, `Memory.supersedes_id`, for contradiction/supersession at `common/models/memory.py:79-83`, plus entity tags/relations. So 027/004 and 027/005 are only indirectly grounded in MemClaw; MemClaw validates boundary lessons, not a causal-edge implementation pattern.

C4: VERIFIED. README governance claims tenant isolation, visibility scopes, trust tiers, and full audit at `README.md:251-256`. The audit model is minimal append rows at `common/models/audit.py:11-25`. Suppression machinery is fleet/org infrastructure in `common/events/suppression_handlers.py:49-130`. Rejecting tenant/fleet/suppression machinery for local single-user SQLite is correct; adapting provenance trust and automated-mutation audit is plausible but should stay small.

## Refutation analysis

C1: Strongest argument against adoption as-is: it is redundant against 027/004 because tombstone-before-hard-delete is already planned, and the citation points to stale archival, not deletion. The only non-redundant improvement is “do not rewrite the first tombstone timestamp,” but that improves on MemClaw rather than copying it.

C2: Strongest argument against adoption as-is: the claim overstates MemClaw. The cited files do not contain deterministic generated causal-edge promotion, generated/manual provenance, or manual-edge skip. It is also redundant against 027/005, which already plans deterministic metadata promotion and avoiding duplicate manual links.

C3: Strongest argument against adoption as-is: the separation is real, but importing an entity graph into a local SQLite single-user memory system is likely over-engineering unless there is measured retrieval need. The durable teaching is boundary discipline: do not let entity/co-occurrence signals become causal truth.

C4: Strongest argument against adoption as-is: the rejection is right, but “provenance trust weighting” can become fake access-control complexity if copied from fleet trust tiers. Keep only source-confidence scoring and compact audit for automated writes; reject suppression, tenant scopes, cross-fleet trust, and Pub/Sub-style lifecycle controls.

## Verdict adjustments

| Claim | Prior verdict | NEW verdict | Reason |
|---|---|---|---|
| C1 | ADAPT/ADOPT | DOWNGRADE | Basic tombstone-before-hard-delete is already 027/004; cited lines are archive-stale; MemClaw direct soft-delete is not first-timestamp idempotent. |
| C2 | ADOPT | REFUTED | Cited files do not show generated/manual causal-edge provenance or manual-edge skip; natural-key upsert is entity-relation storage, and 027/005 already covers the real teaching. |
| C3 | ADAPT/ADOPT | DOWNGRADE | Citation is grounded, but only the entity-vs-causal boundary survives; entity-graph recall boost is optional and likely overbuilt for local SQLite. |
| C4 | REJECT/ADAPT | UPHELD | Fleet governance rejection is correct; only compact provenance confidence and append-only automated-mutation audit should survive. |

## Surviving teachings

1. Preserve first tombstone timestamp with idempotent `COALESCE`-style behavior; do not let repeat deletes extend retention.

2. Keep entity/co-occurrence relationships strictly separate from causal memory edges; if used, treat them as low-weight recall evidence, not causal truth.

3. Add compact audit/provenance for automated mutations only: promoter runs, tombstone sweeps, bulk deletes, retention, and automated confidence/tier changes.

4. Reject fleet tenant/scope/trust/suppression machinery for Spec Kit Memory’s local single-user SQLite context.

DELTA_JSON: {"iteration":"019","focus":"ADVERSARIAL refute relationship/lifecycle/governance teachings","findingsCount":4,"newInfoRatio":0.25,"topVerdicts":["UPHELD: reject fleet governance; keep only compact provenance/audit","DOWNGRADE: lifecycle teaching to first-timestamp idempotence plus audit, because tombstone-before-hard-delete is already 027/004","REFUTED: generated/manual causal-edge promotion is not grounded in cited MemClaw files and is already 027/005"],"sources":["core-storage-api/src/core_storage_api/services/postgres_service.py:1606","core-storage-api/src/core_storage_api/services/postgres_service.py:418","core-storage-api/src/core_storage_api/services/postgres_service.py:1646","common/models/memory.py:79","common/models/entity.py:27","common/models/entity.py:53","core-api/src/core_api/services/memory_service.py:2709","README.md:251","common/models/audit.py:11","common/events/suppression_handlers.py:49"]}
