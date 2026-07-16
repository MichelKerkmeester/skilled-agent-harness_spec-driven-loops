ROLE: You are a senior memory-systems research analyst. This is READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (study this; READ its code): caura-memclaw ("MemClaw"), a PRODUCTION fleet-memory system. Multi-tenant, Postgres + pgvector, event-driven, MCP + REST. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER, SINGLE-TENANT store. SQLite index + vector store (ollama nomic 768d); importance tiers (constitutional > critical > important > normal > temporary); causal edges; FSRS decay; self-maintaining index; shadow-first feedback reducers; 37-tool MCP. NOTE: Spec Kit ALREADY has importance tiers and "constitutional" always-surface memories. Refined under packet 027.

CRITICAL JUDGMENT RULE: MemClaw's governance solves MULTI-TENANT data-isolation + cross-team-leak problems that DO NOT EXIST in a single-user local store. Be ruthless: most multi-scope/trust-tier/PII-quarantine machinery is negative knowledge here. BUT the *concepts* (tiering trust, audit trail, suppression, default-deny scoping) may have a single-user analog (e.g., trust-weighting auto-derived vs human-authored memories; an audit trail for automated mutations). Separate the transferable CONCEPT from the fleet-scale MECHANISM.

YOUR ANGLE (iteration 003): GOVERNANCE — trust tiers, memory scoping (agent / fleet / cross-fleet), suppression, PII quarantine, and the audit log.
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "scope", "tier", "trust", "suppress", "audit", "tenant", "fleet", "quarantine", "pii".
- common/models/organization_settings.py
- common/models/fleet.py
- common/models/agent.py
- common/models/audit.py
- common/models/lifecycle_audit.py
- common/events/suppression_handlers.py
- common/events/org_suppression_event.py
- core-api/src/core_api/middleware  (scope enforcement)
- README.md  (section "Governance")
- docs/api-surfaces.md

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
How MemClaw enforces governance: scope model, trust tiers, suppression, audit logging. file:line evidence.
## Teachings for Spec Kit Memory
2-5 items, each separating transferable CONCEPT from fleet-scale MECHANISM. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027 child or "new sub-packet") · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to single-user/local.
## Negative knowledge
The (likely large) set of multi-tenant/cross-fleet/PII-isolation machinery with NO single-user analog.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"003","focus":"governance / trust tiers / scoping / audit","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["REJECT: ...","ADAPT: ..."],"sources":["path:line"]}
