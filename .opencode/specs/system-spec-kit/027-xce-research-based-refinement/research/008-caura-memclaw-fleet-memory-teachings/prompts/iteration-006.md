ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system. Multi-tenant, Postgres + pgvector, event-driven, MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. It has CAUSAL EDGES between memories with a tombstone lifecycle (027/004) and a DETERMINISTIC metadata-edge promoter that promotes validated parent/child/parent-chain frontmatter relationships into causal edges (027/005). Entities/relationships matter here.

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres; Spec Kit is single-user/local/SQLite. Fleet-only machinery = negative knowledge. Surface only teachings improving a SINGLE-USER LOCAL relationship/edge model. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 006): ENTITY / RELATIONSHIP / GRAPH MODELING — how MemClaw extracts and stores relationships between memories/entities (entity extraction, links/edges, how relationships are created, validated, and used in recall).
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "entity", "relation", "edge", "graph", "link", "extract", "associat", "neighbor".
- common/models/entity.py
- common/models/document.py
- common/models/memory.py
- common/enrichment/schema.py
- common/enrichment/service.py
- core-storage-api/src/core_storage_api/database  (relationship/edge tables)
- core-storage-api/src/core_storage_api/services
- core-api/src/core_api/services  (entity/relationship usage)

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
Entity extraction, relationship/edge creation + validation + storage, and how relationships feed recall. file:line evidence. Note whether MemClaw even HAS explicit memory-to-memory edges or only entity tagging.
## Teachings for Spec Kit Memory (027/004 + 027/005)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027/004, 027/005, or "new sub-packet") · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local.
## Negative knowledge
Fleet/scale-specific graph machinery that must NOT be copied.
## Open questions
For the deeper pass (iteration 016).

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"006","focus":"entity / relationship / graph modeling","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
