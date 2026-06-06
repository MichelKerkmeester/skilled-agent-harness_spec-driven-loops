ROLE: You are a senior memory-systems research analyst. This is READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (study this; READ its code): caura-memclaw ("MemClaw"), a PRODUCTION fleet-memory system for multi-agent AI fleets. Multi-tenant, Postgres + pgvector, event-driven (pubsub), MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER (who the teachings are FOR): "Spec Kit Memory" — a LOCAL, SINGLE-USER, SINGLE-TENANT continuity/memory store for one developer's AI coding workflow. Architecture: SQLite index file + a SEPARATE vector store (ollama nomic, 768-dim); hybrid lexical + semantic trigger matching; importance tiers (constitutional > critical > important > normal > temporary); causal edges between memories (with tombstone lifecycle); FSRS-style decay + co-activation; a self-maintaining incremental index; shadow-first learning-feedback reducers; a 37-tool MCP surface (memory_save / memory_search / memory_context / memory_causal_link / etc.). Refined under packet 027, children: 002 write-safety, 003 incremental-index, 004 causal-edge-tombstones, 005 metadata-edge-promoter, 006 write-path-reconciliation, 007 semantic-trigger-fallback, 008 learning-feedback-reducers.

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres; Spec Kit Memory is single-user/local/SQLite. A pattern that exists ONLY to solve fleet-scale or multi-tenant problems usually does NOT transfer — say so explicitly (negative knowledge). Only surface teachings that improve a SINGLE-USER LOCAL memory store. MemClaw is Apache-2.0: design inspiration only, never code copying.

YOUR ANGLE (iteration 001): WRITE / SAVE PATH — write-safety, deduplication, idempotency, provenance, and protection of human/manual data from automated overwrite.
Read these entry points first, then follow imports/usages WITHIN caura-memclaw only (cap ~15 files). Use Grep for: "idempoten", "dedup", "provenance", "created_by", "source", "upsert", "conflict".
- common/models/memory.py
- common/models/dedup_review.py
- common/models/idempotency.py
- common/models/audit.py
- common/models/document.py
- core-storage-api/src/core_storage_api/services  (write/persist services)
- core-storage-api/src/core_storage_api/database
- core-api/src/core_api/pipeline  (ingest/write pipeline)
- core-api/src/core_api/routes  (write/ingest routes)
- README.md  (section "Memory Pipeline")

DELIVERABLE — output a markdown report with EXACTLY these sections (cite file:line throughout):
## Mechanism
How MemClaw makes writes safe: dedup strategy, idempotency keys, provenance/source tracking, and whether/how it protects manually-curated data from automated clobber. Concrete file:line evidence.
## Teachings for Spec Kit Memory
2-5 items. For EACH: **Claim** · **Evidence** (memclaw file:line) · **Maps-to** (027 child 002-008, or "new sub-packet") · **Verdict** (ADOPT / ADAPT / REJECT / DEFER) · **Risk** (LOW/MED/HIGH) · **Confidence** (0.0-1.0) · **Why it transfers (or not)** to a single-user/local/SQLite store.
## Negative knowledge
What here is fleet/multi-tenant/Postgres-specific and must NOT be copied into a single-user local store.
## Open questions
For a deeper second pass (iteration 013).

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"001","focus":"write-safety / dedup / idempotency / provenance","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADOPT: ...","ADAPT: ..."],"sources":["path:line"]}
