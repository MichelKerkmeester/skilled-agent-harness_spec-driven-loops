ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system. Multi-tenant, Postgres + pgvector, event-driven, MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. It has importance tiers, FSRS-style decay/co-activation, retention sweeps, and CAUSAL-EDGE TOMBSTONES (027/004: all active causal-edge delete paths must tombstone before hard-delete). Lifecycle correctness is a live concern.

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres; Spec Kit is single-user/local/SQLite. Fleet-only machinery = negative knowledge. Surface only teachings improving SINGLE-USER LOCAL lifecycle/retention/tombstoning. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 007): LIFECYCLE — retention, archive, purge, soft-delete/tombstones, supersession, and the lifecycle audit. How does MemClaw decide what to archive/purge, how does it tombstone vs hard-delete, and how is the lifecycle made idempotent/auditable?
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "archive", "purge", "tombstone", "soft_delete", "deleted_at", "supersede", "retention", "expire", "ttl", "lifecycle".
- common/events/lifecycle_archive_request.py
- common/events/lifecycle_purge_request.py
- common/events/lifecycle_handlers.py
- common/events/lifecycle_publishers.py
- common/models/lifecycle_audit.py
- common/models/memory.py  (soft-delete / supersession fields)
- core-operations/src/core_operations  (retention/purge scheduled ops)
- core-storage-api/src/core_storage_api/services  (the actual archive/purge SQL)

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
Retention/archive/purge criteria; tombstone vs hard-delete; supersession; idempotency + audit of lifecycle transitions. file:line evidence.
## Teachings for Spec Kit Memory (027/004)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027/004, or other child / "new sub-packet") · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local.
## Negative knowledge
Fleet/distributed-scheduler-specific lifecycle machinery that must NOT be copied.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"007","focus":"lifecycle / retention / archive / purge / tombstones","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
