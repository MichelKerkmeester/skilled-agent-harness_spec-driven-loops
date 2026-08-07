ROLE: You are a senior memory-systems research analyst. This is READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (study this; READ its code): caura-memclaw ("MemClaw"), a PRODUCTION fleet-memory system. Multi-tenant, Postgres + pgvector, event-driven, MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store. SQLite + vector store; importance tiers; causal edges; FSRS decay; self-maintaining index; **shadow-first learning-feedback reducers (027 child 008)** that learn from outcomes to adjust ranking/retention; 37-tool MCP. This angle is the HIGHEST-VALUE overlap: 027/008 is exactly a "learn from feedback to improve memory" system.

CRITICAL JUDGMENT RULE: MemClaw's self-improvement is CROSS-AGENT ("agent #17's mistake prevents agents #1-40 repeating it"). Spec Kit has ONE user/agent — there is no fleet to propagate to. The hard question: does MemClaw's outcome->insight loop have ANY single-agent analog (e.g., one agent's outcomes improving its OWN future recall/ranking/retention over time)? Distinguish the cross-agent propagation (likely negative knowledge) from the outcome-capture + insight-derivation + shadow-gating MECHANISM (potentially transferable to 027/008). Be concrete and skeptical.

YOUR ANGLE (iteration 004): SELF-IMPROVING MEMORY — the outcome-propagation / compounding loop (the "memclaw_evolve -> memclaw_insights" loop referenced in docs/performance.md), how outcomes are captured, how insights are derived, and how/whether they are gated before they affect recall.
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "evolve", "insight", "outcome", "feedback", "propagat", "learn", "review", "analysis_report".
- README.md  (section "Self-Improving Memory")
- docs/performance.md  (the evolve -> insights description)
- common/models/analysis_report.py
- common/models/dedup_review.py
- common/models/background_task.py
- core-operations/src/core_operations  (the operations that run evolve/insights)
- core-api/src/core_api/tools  (MCP tools incl. evolve/insights)
- common/enrichment  (if insights reuse enrichment)

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
The full outcome -> insight loop: capture, derivation, storage, gating, and how insights feed back into recall/retention. file:line evidence. State clearly which parts are inherently cross-agent.
## Teachings for Spec Kit Memory (027/008)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027/008, or "new sub-packet") · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to a single-agent local store.
## Negative knowledge
Cross-agent/fleet propagation machinery with no single-user analog.
## Open questions
For the deeper pass (iteration 014).

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"004","focus":"self-improving memory / outcome propagation loop","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ...","REJECT: ..."],"sources":["path:line"]}
