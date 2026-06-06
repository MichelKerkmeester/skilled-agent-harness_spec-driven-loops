ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system. Multi-tenant, Postgres + pgvector, event-driven, MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. Recall ALREADY blends: semantic+lexical match, importance tiers, FSRS-style decay, co-activation, recency. 027/007 is hybrid lexical+semantic trigger fallback. So MemClaw's RANKING FORMULA (how it weights freshness, recall-boost, weight, temporal/currency, status penalty, entity boost) is the comparable surface.

CRITICAL JUDGMENT RULE: MemClaw is multi-tenant/fleet/Postgres; Spec Kit is single-user/local/SQLite. Fleet-only machinery = negative knowledge. Surface only ranking/decay/activation teachings that improve a SINGLE-USER LOCAL recall. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 009): RECALL RANKING / ACTIVATION / DECAY — the exact scoring composition: how similarity, memory weight, freshness/recency, recall-boost (activation), temporal/currency factors, status penalty, and entity boost combine into a final ordered score; and any decay/aging applied to weight or recency.
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "score", "weight", "freshness", "recall_boost", "decay", "boost", "rank", "temporal", "currency", "penalty", "half_life", "recency".
- core-storage-api/src/core_storage_api/services/postgres_service.py  (search scoring ~lines 900-1210)
- core-api/src/core_api/services  (search orchestration)
- core-api/src/core_api/constants.py  (scoring constants)
- common/constants.py  (decay/retention constants)
- common/models/memory.py  (weight, recall counters, timestamps)

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
The full ranking formula with each factor + its constants; how/whether weight and recency decay over time; how activation (recall count) boosts. file:line evidence.
## Teachings for Spec Kit Memory (027/007 + recall scoring)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027 child or "new sub-packet"; compare to Spec Kit's existing FSRS decay + tiers + co-activation) · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local.
## Negative knowledge
Fleet/pgvector-specific ranking machinery that must NOT be copied.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"009","focus":"recall ranking / activation / decay","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ..."],"sources":["path:line"]}
