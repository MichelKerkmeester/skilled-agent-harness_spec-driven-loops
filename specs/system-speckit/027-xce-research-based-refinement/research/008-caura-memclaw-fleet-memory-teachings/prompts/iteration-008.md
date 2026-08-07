ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system. Multi-tenant, Postgres + pgvector, EVENT-DRIVEN (pubsub), MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. 027 child 006 (write-path-reconciliation) treats statediff as an explicit action/subscriber aid, NOT an implicit source of truth, and prefers an async post-insert-enrichment model. So how MemClaw decouples write from enrichment/embedding via events, and how it keeps the index consistent with the store, is directly relevant.

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres with distributed workers; Spec Kit is single-user/local/SQLite, likely in-process or a single daemon. Distributed-broker machinery may be negative knowledge, but the DECOUPLING PATTERN + CONSISTENCY/RECONCILIATION guarantees may transfer. Separate the pattern from the infrastructure. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 008): EVENT-DRIVEN ASYNC PIPELINE + RECONCILIATION/CONSISTENCY — how write triggers downstream embed/enrich/lifecycle work, delivery guarantees (at-least-once? outbox? retry? idempotent handlers?), and how eventual consistency between the store and the index is reconciled.
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "publish", "subscribe", "handler", "outbox", "retry", "reconcile", "consisten", "idempoten", "redeliver", "dead_letter", "pending".
- common/events/base.py
- common/events/factory.py
- common/events/pubsub.py
- common/events/inprocess.py
- common/events/events_manifest.json
- common/events/memory_enrich_publisher.py
- common/events/lifecycle_handlers.py
- core-worker/src/core_worker
- core-api/src/core_api/pipeline  (where writes emit events)

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
Event flow from write to downstream processing; delivery guarantees; handler idempotency; how store/index inconsistency is detected + reconciled. file:line evidence.
## Teachings for Spec Kit Memory (027/006)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027/006, or other child / "new sub-packet") · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local (in-process or single-daemon).
## Negative knowledge
Distributed-broker/multi-worker machinery that must NOT be copied into a local store.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"008","focus":"event-driven async pipeline + reconciliation/consistency","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
