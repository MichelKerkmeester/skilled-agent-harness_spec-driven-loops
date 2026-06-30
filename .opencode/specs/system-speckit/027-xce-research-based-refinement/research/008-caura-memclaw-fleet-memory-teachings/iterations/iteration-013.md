# Iteration 013 — DEEP write-safety internals + SQLite adoption sketch

**Status:** insight · **Findings:** 12 · **newInfoRatio:** 0.82 · **tokens:** 127246 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Verified mechanism (deep)
(a) `dedup_review` queue flow end-to-end

The queue is only on the strong semantic-dedup path, not the fast advisory path. Strong/persist pipelines run `CheckSemanticDuplicate` before `WriteMemoryRow`; fast mode runs `DetectNearDuplicate`, which only annotates metadata and still writes. See `core-api/src/core_api/pipeline/compositions/write.py:35-47`, `core-api/src/core_api/pipeline/compositions/write.py:51-74`, `core-api/src/core_api/pipeline/compositions/write.py:90-105`.

`CheckSemanticDuplicate` flow:

- Skips when semantic dedup is disabled or no embedding exists, and skips identifier-bearing content to avoid false semantic collisions. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:107-122`
- Finds nearest semantic candidate at the judge threshold, then records elapsed dedup time. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:124-135`
- Auto-reject band enqueues `decision_band="auto_reject"` with `new_memory_id=None`, snapshots both contents, then raises `409`. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:144-166`
- Subject preflight can bypass the judge and accept the write when new and candidate subjects certainly differ; no queue row is created. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:168-180`
- Judge band calls `_llm_dedup_check`; high-confidence duplicate enqueues `judge_band_reject` with `new_memory_id=None`, then raises `409`. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:182-210`
- Low-confidence duplicate enqueues `judge_low_conf_accept`, but still returns `None` so the write proceeds. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:212-231`

Correction to prior pass: the queue is a snapshot advisory queue, not a reliable persisted-row reconciliation link. The low-confidence accepted path queues before `WriteMemoryRow`, so it also passes `new_memory_id=None`; the comment says the row will persist downstream, but no later code patches the review row with that ID. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:215-227`

Storage flow:

- API client posts to `/memories/dedup-reviews`, lists pending reviews, and posts terminal decisions. `core-api/src/core_api/clients/storage_client.py:544-565`
- Storage router exposes enqueue/list/decide endpoints. `core-storage-api/src/core_storage_api/routers/memories.py:854-887`
- Storage service validates `decision_band`, inserts a `pending` row, stores content snapshots, lists by `tenant_id/status`, and transitions pending rows to terminal statuses. `core-storage-api/src/core_storage_api/services/postgres_service.py:722-804`
- Model statuses are `pending`, `confirmed_duplicate`, `override_not_duplicate`, `dismissed`; bands are `auto_reject`, `judge_band_reject`, `judge_low_conf_accept`. `common/models/dedup_review.py:24-42`
- Schema preserves `new_content` and `candidate_content` even if rows are later deleted. `core-storage-api/src/core_storage_api/database/migrations/versions/018_dedup_reviews.py:43-89`

Fast-mode near duplicate is separate: it writes `metadata["near_duplicate_of"]` and `metadata["near_duplicate_similarity"]`, logs, and does not reject or enqueue review. `core-api/src/core_api/pipeline/steps/write/detect_near_duplicate.py:79-114`

(b) idempotency-key claim/poll race handling

Response-level `Idempotency-Key`:

- The guard namespaces keys by transport source, hashes raw request bytes, and treats non-byte-identical retries as conflicts. `core-api/src/core_api/middleware/idempotency.py:147-187`
- Completed cache hit with same hash replays; same key with different body returns `422`. `core-api/src/core_api/middleware/idempotency.py:198-204`
- Pending hit first hash-checks, then polls until completion, storage error, vanished row, or budget exhaustion. `core-api/src/core_api/middleware/idempotency.py:206-239`, `core-api/src/core_api/middleware/idempotency.py:296-333`
- No row means claim with a short pending TTL; winner proceeds, loser polls. `core-api/src/core_api/middleware/idempotency.py:241-293`
- Storage reads go to the writer, not replica, to avoid stale replay misses. `core-api/src/core_api/clients/storage_client.py:1212-1226`
- Storage claim uses `(tenant_id, idempotency_key)` as primary key and `is_pending` as the in-flight sentinel. `common/models/idempotency.py:30-59`
- Claim is atomic `INSERT ... ON CONFLICT DO UPDATE` only when the existing row is expired; a live row returns no row so the caller polls. `core-storage-api/src/core_storage_api/services/postgres_service.py:4558-4615`
- Completion first updates only the pending row with matching `request_hash`; stale completions cannot overwrite a reclaimed key. `core-storage-api/src/core_storage_api/services/postgres_service.py:4617-4659`
- If update misses, fallback insert/select detects “new pending claim” and “different completed hash” races and raises instead of caching wrong data. `core-storage-api/src/core_storage_api/services/postgres_service.py:4662-4728`
- Storage claim router returns `409` with explicit `found` to distinguish live conflict from vanished row. `core-storage-api/src/core_storage_api/routers/idempotency.py:44-75`

Row-level bulk idempotency is separate:

- Bulk route requires `X-Bulk-Attempt-Id`; `Idempotency-Key` is only response-level replay. `core-api/src/core_api/routes/memories.py:991-1021`
- Missing or malformed bulk attempt ID is a `400`. `core-api/src/core_api/routes/memories.py:1043-1056`
- Timeout/storage 5xx paths do not record the response-level idempotency receipt; clients must retry with the same `X-Bulk-Attempt-Id`. `core-api/src/core_api/routes/memories.py:1122-1165`, `core-api/src/core_api/routes/memories.py:1183-1195`
- Successful bulk response is recorded for response replay with the real `200` or `207` status. `core-api/src/core_api/routes/memories.py:1221-1227`
- Service derives per-item `client_request_id = f"{bulk_attempt_id}:{index}"`. `core-api/src/core_api/services/memory_service.py:992-1017`, `core-api/src/core_api/services/memory_service.py:1123-1128`
- Existing same content with same `client_request_id` becomes `duplicate_attempt`; same content with different attempt becomes `duplicate_content`. `core-api/src/core_api/services/memory_service.py:1144-1179`
- Storage enforces every bulk item has `client_request_id`, inserts with `ON CONFLICT DO NOTHING`, then rereads swallowed conflicts to return canonical IDs. `core-storage-api/src/core_storage_api/services/postgres_service.py:282-416`
- Memory model defines the partial unique attempt index over tenant, coalesced fleet, and `client_request_id`. `common/models/memory.py:34-39`, `common/models/memory.py:89-104`

(c) `merge_enrichment_fields` precedence and deferred-enrichment snapshot

Inline write merge:

- Agent-provided `memory_type`, `weight`, and temporal fields win; enrichment fills only `None` fields. `core-api/src/core_api/pipeline/steps/write/merge_enrichment_fields.py:21-45`
- Status precedence is agent value, then enrichment value, then `"active"`. `core-api/src/core_api/pipeline/steps/write/merge_enrichment_fields.py:58-63`
- Fast mode with no inline enrichment marks `metadata["enrichment_pending"] = True`. `core-api/src/core_api/pipeline/steps/write/merge_enrichment_fields.py:65-70`
- Strong mode always inlines enrichment; fast mode always defers enrichment. `core-api/src/core_api/pipeline/steps/write/parallel_embed_enrich.py:95-103`

Deferred snapshot:

- Background scheduling passes `_agent_provided_enrichment_fields(data)` into `_schedule_enrich_or_inline`. `core-api/src/core_api/pipeline/steps/write/schedule_background_tasks.py:39-57`, `core-api/src/core_api/pipeline/steps/write/schedule_background_tasks.py:149-176`
- The snapshot reads Pydantic `model_fields_set` and only tracks enrichment override columns: `memory_type`, `weight`, `status`, `ts_valid_start`, `ts_valid_end`. `core-api/src/core_api/services/memory_service.py:1572-1632`
- Publisher includes `agent_provided_fields` in the enrich event. `common/events/memory_enrich_publisher.py:27-35`, `common/events/memory_enrich_publisher.py:69-85`
- Event schema documents that these fields must not be overwritten by the worker. `common/events/memory_enrich_request.py:130-136`
- Worker `_build_patch` converts enrichment to a patch and skips any field in `agent_provided_fields`. `core-worker/src/core_worker/consumer.py:359-390`, `core-worker/src/core_worker/consumer.py:413-429`
- Worker clears `enrichment_pending` with `metadata_patch`, and only overwrites volatile metadata from a real LLM run (`llm_ms > 0`) to avoid heuristic fallback clobber. `core-worker/src/core_worker/consumer.py:431-468`
- Worker handler passes the snapshot into `_build_patch` before PATCHing storage. `core-worker/src/core_worker/consumer.py:480-553`
- Storage applies scalar fields and `metadata_patch` in one locked operation; metadata merge is shallow JSONB merge. `core-storage-api/src/core_storage_api/services/postgres_service.py:425-536`

Correction/nuance: metadata-side overwrite protection is weaker than ORM-column protection. `_build_patch` can skip metadata fields if they are in `agent_provided_fields`, but the publisher helper only snapshots the fixed ORM override set, not user metadata keys such as `summary` or `tags`. `core-api/src/core_api/services/memory_service.py:1576-1584`, `core-worker/src/core_worker/consumer.py:441-468`

Metadata PATCH default is merge, not replace:

- API PATCH treats `metadata_mode=None` as `"merge"`, routes metadata through `metadata_patch`, rejects `metadata=null` in merge mode, and only replaces on explicit `metadata_mode="replace"`. `core-api/src/core_api/services/memory_service.py:2359-2415`

(d) Keystone TOCTOU overwrite guard

- Trust helper sets self-agent scope at trust 1 and everything else at trust 2. `core-api/src/core_api/trust_utils.py:14-37`
- Upsert floor is `max(new_shape_floor, stored_shape_floor)`, preventing a low-trust caller from overwriting a broader stored rule with a narrower self-agent body. `core-api/src/core_api/trust_utils.py:40-70`
- MCP setter performs one trust lookup at minimum 1, reads the existing keystone, computes effective trust using both new and stored shapes, and rejects if caller trust is below that floor. `core-api/src/core_api/mcp_server.py:2272-2329`
- Immediately before upsert, setter rereads the row and returns `CONFLICT` if presence, `scope`, or `agent_id` changed. `core-api/src/core_api/mcp_server.py:2331-2356`
- Delete path similarly reads stored shape, checks trust floor from stored data, rereads before delete, and rejects if `scope` or `agent_id` changed. `core-api/src/core_api/mcp_server.py:2434-2484`
- Storage upsert/delete are unconditional once called; storage-side compare-and-upsert/delete is explicitly not implemented. `core-storage-api/src/core_storage_api/services/postgres_service.py:3660-3701`, `core-storage-api/src/core_storage_api/services/postgres_service.py:3807-3833`

Important correction: the TOCTOU mitigation reduces but does not eliminate the race. The code itself states the remaining `recheck -> write/delete` window needs a storage-side conditional operation to close fully. `core-api/src/core_api/mcp_server.py:2331-2339`, `core-api/src/core_api/mcp_server.py:2460-2468`

## Concrete Spec-Kit-native adoption sketch
Adopt highest-value teaching 1: local write idempotency with pending sentinel

SQLite table shape:

```sql
CREATE TABLE memory_write_claims (
  key TEXT PRIMARY KEY,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending','completed')),
  response_json TEXT,
  status_code INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL
);

CREATE TABLE memory_write_items (
  attempt_item_id TEXT PRIMARY KEY,
  memory_id TEXT,
  content_hash TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('created','duplicate_attempt','duplicate_content','error')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX ux_memory_content_hash_active
ON memories(content_hash)
WHERE deleted_at IS NULL;
```

Minimal write gate:

```python
def guarded_write(key, raw_request_body, items):
    request_hash = sha256(raw_request_body).hexdigest()
    now = utc_now()

    with sqlite_transaction("BEGIN IMMEDIATE"):
        claim = select_one("SELECT * FROM memory_write_claims WHERE key = ?", key)

        if claim and claim["expires_at"] <= now:
            delete("DELETE FROM memory_write_claims WHERE key = ?", key)
            claim = None

        if claim and claim["request_hash"] != request_hash:
            return http_422("idempotency key reused with different body")

        if claim and claim["state"] == "completed":
            return replay(claim["response_json"], claim["status_code"])

        if claim and claim["state"] == "pending":
            return http_409("write still in progress; retry shortly")

        insert("""
          INSERT INTO memory_write_claims(key, request_hash, state, expires_at)
          VALUES (?, ?, 'pending', ?)
        """, key, request_hash, now + PENDING_TTL)

        results = []
        for i, item in enumerate(items):
            attempt_item_id = f"{key}:{i}"
            content_hash = canonical_hash(item.content)

            prior_attempt = select_one(
                "SELECT memory_id FROM memory_write_items WHERE attempt_item_id = ?",
                attempt_item_id,
            )
            if prior_attempt:
                results.append({"status": "duplicate_attempt", "id": prior_attempt["memory_id"]})
                continue

            existing = select_one(
                "SELECT id FROM memories WHERE content_hash = ? AND deleted_at IS NULL",
                content_hash,
            )
            if existing:
                insert_review_snapshot(item, existing, reason="exact_duplicate")
                results.append({"status": "duplicate_content", "id": existing["id"]})
                continue

            memory_id = insert_memory_with_precedence(item)
            insert("""
              INSERT INTO memory_write_items(attempt_item_id, memory_id, content_hash, outcome)
              VALUES (?, ?, ?, 'created')
            """, attempt_item_id, memory_id, content_hash)
            results.append({"status": "created", "id": memory_id})

        response = {"results": results}
        update("""
          UPDATE memory_write_claims
          SET state='completed', response_json=?, status_code=?, expires_at=?
          WHERE key=? AND request_hash=? AND state='pending'
        """, json(response), 200, now + COMPLETED_TTL, key, request_hash)

        return response
```

Adopt highest-value teaching 2: auto may not overwrite manual/constitutional

SQLite table shape:

```sql
CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  field_sources_json TEXT NOT NULL DEFAULT '{}',
  authority_rank INTEGER NOT NULL DEFAULT 10,
  deleted_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reconciliation_reviews (
  id TEXT PRIMARY KEY,
  memory_id TEXT,
  incoming_content TEXT NOT NULL,
  incoming_content_hash TEXT NOT NULL,
  candidate_snapshot_json TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','rejected','dismissed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at TEXT
);
```

Ranks:

```text
auto = 10
manual = 50
constitutional = 100
```

Minimal precedence algorithm:

```python
PROTECTED = {"constitutional", "manual"}

def patch_memory(memory_id, patch, patch_source):
    row = select_one("SELECT metadata_json, field_sources_json FROM memories WHERE id=?", memory_id)
    metadata = json_load(row["metadata_json"])
    sources = json_load(row["field_sources_json"])

    changed = {}

    for field, new_value in patch.items():
        old_source = sources.get(field, "auto")

        if patch_source == "auto" and old_source in PROTECTED:
            insert_reconciliation_review(
                memory_id=memory_id,
                incoming_content=json({"field": field, "value": new_value}),
                reason=f"auto_attempted_overwrite_{old_source}",
                candidate_snapshot={"old_value": metadata.get(field), "old_source": old_source},
            )
            continue

        metadata[field] = new_value
        sources[field] = patch_source
        changed[field] = new_value

    if changed:
        update("""
          UPDATE memories
          SET metadata_json=?, field_sources_json=?, updated_at=CURRENT_TIMESTAMP
          WHERE id=?
        """, json(metadata), json(sources), memory_id)
```

Minimal reconciliation rule:

```python
def reconcile_auto_candidate(candidate, existing):
    if existing.authority_rank >= 50:
        insert_reconciliation_review(
            memory_id=existing.id,
            incoming_content=candidate.content,
            incoming_content_hash=canonical_hash(candidate.content),
            candidate_snapshot=existing,
            reason="auto_candidate_conflicts_with_manual_or_constitutional",
        )
        return "queued_no_overwrite"

    return patch_memory(existing.id, candidate.auto_patch, patch_source="auto")
```

This maps directly to 027/002 write safety and 027/006 reconciliation: use exact hash and explicit claims for retry safety; use field-level provenance to ensure generated enrichment/reconciliation cannot erase manual or constitutional memory.

## Verdict table
| Claim | Maps-to | Verdict | Risk | Confidence |
|---|---|---:|---|---:|
| Response-level idempotency with pending sentinel, request hash, replay, and reclaim | 027/002 write-safety | ADOPT | SQLite needs `BEGIN IMMEDIATE` or equivalent writer lock to avoid double execution | High |
| Bulk row-level attempt IDs separate from response replay | 027/002 write-safety | ADAPT | Spec Kit may not need bulk, but per-item IDs are useful for multi-save batches | High |
| Dedup review queue as content-snapshot advisory queue | 027/006 reconciliation | ADAPT | Do not assume `new_memory_id` exists; accepted low-conf rows are not linked in current implementation | High |
| Fast-mode near duplicate metadata as advisory only | 027/006 reconciliation | ADAPT | Without an LLM judge, keep it non-blocking by default | Medium |
| Agent/manual fields beat enrichment fields | 027/006 reconciliation | ADOPT | Must track field provenance explicitly; metadata fields need stronger protection than MemClaw currently snapshots | High |
| Metadata PATCH merge by default | 027/002 write-safety | ADOPT | Shallow merge can replace nested objects; document that intentionally | High |
| Keystone stored-shape plus new-shape trust floor | Constitutional/manual protection | ADAPT | Local Spec Kit should use authority ranks and CAS/version checks, not fleet trust levels | High |
| Keystone recheck-before-write TOCTOU guard | 027/002 write-safety | DEFER | Double-read is weaker than conditional write; SQLite can do better with one transaction and `WHERE version=?` | High |
| LLM judge semantic dedup bands | 027/006 reconciliation | DEFER | Cost/latency and false-positive risk are unnecessary for local default | Medium |
| Postgres partial unique index over tenant/fleet/client_request_id | 027/002 write-safety | ADAPT | Keep uniqueness, drop tenancy/fleet dimensions | High |

## Negative knowledge (confirmed)
- Do not port tenant/fleet/agent scoping. MemClaw’s queue, idempotency, bulk uniqueness, and keystone logic all include tenant/fleet/agent dimensions; Spec Kit is local single-user and should collapse those to one local namespace.
- Do not port the LLM judge as default. The useful local default is exact hash plus optional advisory semantic review; hard semantic rejection should be opt-in.
- Do not port Postgres-specific conflict-target expression matching. The `COALESCE(fleet_id, '')` partial unique index matching is a Postgres concern, not a SQLite local-store requirement. `core-storage-api/src/core_storage_api/services/postgres_service.py:337-369`
- Do not port Pub/Sub/deferred-worker mechanics or secret-bearing enrich events. Local Spec Kit can run enrichment synchronously or as a local job without shipping tenant credentials. `common/events/memory_enrich_request.py:10-23`, `common/events/memory_enrich_request.py:89-94`
- Do not port JSONB `||` semantics blindly. SQLite JSON merge behavior should be specified as shallow merge or field-by-field `json_set`; nested overwrite semantics must be explicit. `core-storage-api/src/core_storage_api/services/postgres_service.py:507-535`
- Do not port MemClaw keystone double-read as the final safety model. It is an application-level mitigation with a remaining `recheck -> write/delete` race; use SQLite transaction/CAS instead. `core-api/src/core_api/mcp_server.py:2331-2339`, `core-api/src/core_api/mcp_server.py:2460-2468`
- Do not treat `dedup_reviews.new_memory_id` as a guaranteed link to the accepted row. The accepted low-confidence path currently queues before persistence with `new_memory_id=None`. `core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:215-227`
- Do not let auto enrichment overwrite manual or constitutional metadata. MemClaw strongly protects selected ORM fields but does not snapshot arbitrary manual metadata keys by default; Spec Kit should use explicit field provenance.

DELTA_JSON: {"iteration":"013","focus":"DEEP write-safety internals + SQLite adoption sketch","findingsCount":12,"newInfoRatio":0.82,"topVerdicts":["ADOPT: response-level idempotency with pending sentinel and request-hash replay for local SQLite writes","ADAPT: enrichment/reconciliation precedence into field-source ranks so auto may not overwrite manual/constitutional"],"sources":["core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:49","core-storage-api/src/core_storage_api/services/postgres_service.py:722","core-api/src/core_api/middleware/idempotency.py:130","core-storage-api/src/core_storage_api/services/postgres_service.py:4558","common/models/idempotency.py:30","core-api/src/core_api/services/memory_service.py:1572","core-worker/src/core_worker/consumer.py:359","core-storage-api/src/core_storage_api/services/postgres_service.py:425","core-api/src/core_api/mcp_server.py:2331","core-api/src/core_api/trust_utils.py:40"]}
