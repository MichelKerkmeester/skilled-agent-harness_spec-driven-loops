ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system. Multi-tenant, Postgres + pgvector, event-driven, MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. SQLite index + SEPARATE vector store (ollama nomic 768d). It has a SELF-MAINTAINING INCREMENTAL INDEX (027 child 003 is exactly: memoization records, dependency DAG, chunk fingerprints, chunk kinds, chunk line-spans before handler scan changes). Embedding model is FIXED (ollama nomic 768d) — do NOT propose changing it.

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres; Spec Kit Memory is single-user/local/SQLite. Fleet-only machinery = negative knowledge. Surface only teachings that improve a SINGLE-USER LOCAL incremental index. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 005): INDEXING / EMBEDDING / ENRICHMENT PIPELINE — how content becomes embedded + enriched: chunking, what triggers (re)embedding, idempotent re-embed, embedding versioning, and the enrichment schema/flow.
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "chunk", "embed", "reembed", "re-embed", "enrich", "version", "model_version", "fingerprint", "dirty", "stale".
- common/embedding/_service.py
- common/embedding/_registry.py
- common/embedding/protocols.py
- common/embedding/constants.py
- common/enrichment/service.py
- common/enrichment/schema.py
- common/enrichment/_prompts.py
- core-worker/src/core_worker  (the worker that consumes embed/enrich events)
- common/events/memory_embed_request.py
- common/events/memory_enrich_request.py
- docs/local-embedder.md

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
Chunking, embedding trigger/versioning, idempotent re-embed, enrichment schema + flow. file:line evidence.
## Teachings for Spec Kit Memory (027/003)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027/003, or other child / "new sub-packet") · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local/SQLite with a fixed nomic-768d embedder.
## Negative knowledge
Fleet/distributed-worker/pgvector-specific indexing machinery that must NOT be copied.
## Open questions
For the deeper pass (iteration 015).

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"005","focus":"indexing / embedding / enrichment pipeline","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
