ROLE: Senior memory-systems research analyst, DEEP second pass. READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET: caura-memclaw (multi-tenant, Postgres/pgvector, distributed workers). CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite + vector store; FIXED ollama nomic-768d embedder) — 027/003 incremental-index-foundation = memo records, dependency DAG, chunk fingerprints, chunk kinds, chunk line-spans before handler scan changes. MemClaw is Apache-2.0 — design inspiration only.
Path: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main

PRIOR PASS (iteration 005) ALREADY FOUND (go DEEPER + verify): fingerprint-gated idempotent embedding reuse; explicit pending/stale derived-state transitions; durable embedding provenance; "store retrieval hints as metadata, not hinted write vectors"; enrichment merge-only.

YOUR ANGLE (iteration 015): DEEP incremental indexing/enrichment internals -> design 027/003. Verify with exact file:line: what exactly triggers (re)embedding; how a chunk/content fingerprint is computed and compared; how embedding model/version is recorded so a model change invalidates only what's needed; how the worker makes embed/enrich idempotent under redelivery; what "pending/stale/embedded" state machine columns exist. Then translate to a single-daemon SQLite incremental index.
Read deeply (cap ~18 files): common/embedding/_service.py, common/embedding/_registry.py, common/embedding/protocols.py, common/enrichment/service.py, core-worker/src/core_worker/* (embed/enrich consumers), common/events/{memory_embed_request,memory_embedded,memory_enrich_request,memory_enriched}.py, common/models/memory.py (embedding/version/state columns), core-storage-api/src/core_storage_api/services/postgres_service.py (embedding persistence).

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Verified mechanism (deep)
Re-embed trigger, fingerprint computation, model-version invalidation, worker idempotency, derived-state machine. Confirm/correct 085.
## Concrete Spec-Kit-native adoption sketch (027/003)
A CONCRETE incremental-index design for single-daemon SQLite: the memo/fingerprint record shape (chunk id, content hash, embedder id+dim+version, derived-state, line-span, kind), the change-detection algorithm (what to re-embed when a doc edits), and how a future embedder change invalidates minimally. Respect the FIXED nomic-768d default but make version explicit.
## Verdict table
Each teaching: Claim · Maps-to (027/003 or other) · Verdict · Risk · Confidence.
## Negative knowledge (confirmed)
Distributed-worker/broker/pgvector indexing machinery not to port.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"015","focus":"DEEP incremental indexing/enrichment -> 027/003 design","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ...","ADOPT: ..."],"sources":["path:line"]}
