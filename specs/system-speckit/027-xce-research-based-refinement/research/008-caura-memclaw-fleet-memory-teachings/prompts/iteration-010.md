ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system whose HEADLINE competitive axes are LATENCY and TOKEN EFFICIENCY (96-98% token savings vs full context; 23ms p50 search). Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. Its MCP tools have explicit per-tool TOKEN BUDGETS (e.g. memory_match_triggers tokenBudget ~3500) and return trimmed slices. Latency matters less (local, single user) but TOKEN EFFICIENCY of recall output directly affects the coding agent's context budget.

CRITICAL JUDGMENT RULE: MemClaw optimizes for FLEET-scale latency (millions of calls/day). For a single local user, raw latency is rarely the bottleneck — be skeptical of latency-driven complexity (caching layers, warm-cache assumptions) as negative knowledge. TOKEN-EFFICIENCY techniques are far more likely to transfer. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 010): PERFORMANCE — LATENCY + TOKEN-EFFICIENCY ENGINEERING. How MemClaw keeps recall token-cheap (result trimming, field selection, summary-vs-full, returning the relevant slice not the transcript) and how it keeps latency low (caching, indexes, query shaping). Separate token-efficiency teachings (likely transferable) from latency machinery (likely not).
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "token", "trim", "truncat", "summary", "limit", "top_k", "cache", "latency", "warm", "budget", "compact", "slice".
- docs/performance.md
- core-api/src/core_api/services  (search result shaping)
- core-api/src/core_api/routes  (search response model / field selection)
- core-api/src/core_api/middleware  (caching)
- common/embedding/_service.py  (embedding cache)
- README.md  (sections "Performance", "Rate limiting")

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
Token-efficiency techniques (what shrinks the recall payload) AND latency techniques (caching/indexing). file:line evidence. Clearly separate the two.
## Teachings for Spec Kit Memory
2-5 items, PRIORITIZING token-efficiency over latency. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027 child or "new sub-packet"; relate to Spec Kit's per-tool tokenBudget design) · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local.
## Negative knowledge
Latency/fleet-throughput machinery (warm-cache assumptions, distributed caches) with little single-user payoff.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"010","focus":"performance: latency + token-efficiency","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ...","REJECT: ..."],"sources":["path:line"]}
