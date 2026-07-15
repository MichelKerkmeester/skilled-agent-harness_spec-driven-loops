ROLE: You are a senior memory-systems research analyst. This is READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (study this; READ its code): caura-memclaw ("MemClaw"), a PRODUCTION fleet-memory system for multi-agent AI fleets. Multi-tenant, Postgres + pgvector, event-driven (pubsub), MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER (who the teachings are FOR): "Spec Kit Memory" — a LOCAL, SINGLE-USER, SINGLE-TENANT continuity/memory store. SQLite index + SEPARATE vector store (ollama nomic 768-dim); hybrid lexical + semantic trigger matching; importance tiers (constitutional > critical > important > normal > temporary); causal edges (tombstone lifecycle); FSRS decay + co-activation; self-maintaining incremental index; shadow-first learning-feedback reducers; 37-tool MCP surface. Refined under packet 027 (children 002-008 as listed in the strategy).

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres; Spec Kit Memory is single-user/local/SQLite. Patterns that exist ONLY for fleet-scale/multi-tenant usually do NOT transfer — say so (negative knowledge). Surface only teachings that improve a SINGLE-USER LOCAL store. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 002): RECALL / SEARCH / RETRIEVAL ARCHITECTURE — how a query becomes ranked results: candidate generation (lexical vs vector), fusion/reranking, scope filtering, and result shaping for token efficiency.
Read these entry points first, then follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "search", "rank", "rerank", "rrf", "hybrid", "vector", "recall", "score".
- core-storage-api/src/core_storage_api/routers
- core-storage-api/src/core_storage_api/services
- core-storage-api/src/core_storage_api/database
- core-api/src/core_api/routes  (the /search route)
- core-api/src/core_api/services
- common/embedding  (query-side embedding)
- README.md  (sections "API Reference" / the POST /search description)
- docs/api-surfaces.md

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
The end-to-end recall pipeline: candidate generation, hybrid fusion / reranking, scope filtering, and how results are trimmed for token efficiency. file:line evidence.
## Teachings for Spec Kit Memory
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027 child or "new sub-packet"; note Spec Kit already has a hybrid lexical+semantic pipeline + 007 semantic-trigger-fallback) · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local/SQLite.
## Negative knowledge
Fleet/multi-tenant/pgvector-specific retrieval machinery that must NOT be copied.
## Open questions
For a deeper pass (iteration 009 covers ranking/decay).

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"002","focus":"recall / search / retrieval architecture","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
