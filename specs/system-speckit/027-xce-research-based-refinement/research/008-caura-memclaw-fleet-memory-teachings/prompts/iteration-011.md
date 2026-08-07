ROLE: You are a senior memory-systems research analyst. READ-ONLY analysis. Do NOT write, edit, or create any files. Do NOT run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

WHAT YOU ARE COMPARING:
- TARGET (READ its code): caura-memclaw ("MemClaw"), production fleet-memory system with an MCP server + REST API and an explicit API SURFACE OWNERSHIP CHARTER + SemVer stability policy. Vendored at:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main
- CONSUMER: "Spec Kit Memory" — LOCAL, SINGLE-USER store exposing a 37-tool MCP surface (memory_save/search/context/causal_link/health/stats/learn/...). It has GROWN to 37 tools; surface governance, naming consistency, deprecation, and tool-count discipline are real concerns for it.

CRITICAL JUDGMENT RULE: API-surface governance is largely ARCHITECTURE-NEUTRAL (it applies to any tool surface, single-user or fleet), so this angle may transfer MORE than the data-plane angles. But MemClaw has external/public consumers (SemVer matters); Spec Kit's MCP is internal to one user (SemVer matters less). Judge accordingly. Apache-2.0: design inspiration only.

YOUR ANGLE (iteration 011): MCP SURFACE DESIGN + API SURFACE OWNERSHIP/STABILITY GOVERNANCE. How MemClaw structures its MCP tools (granularity, naming, how many, how grouped), and how the surface-ownership charter governs when to add an operation, what is stable vs internal, and deprecation discipline.
Read these entry points first, follow imports WITHIN caura-memclaw only (cap ~15 files). Grep for: "mcp", "tool", "register", "surface", "stable", "deprecat", "semver", "@tool", "schema".
- docs/api-surfaces.md  (the ownership charter)
- core-api/src/core_api/mcp_server.py  (MCP tool registrations)
- core-api/src/core_api/tools  (per-tool implementations)
- plugin/tools.json
- plugin/openclaw.plugin.json
- README.md  (sections "MCP", "Public API & Stability", "Stable surfaces")

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Mechanism
MemClaw's MCP tool inventory + grouping + naming; the surface-ownership charter rules; stable-vs-internal split; deprecation policy. file:line evidence. State the approximate tool COUNT and how they avoid surface bloat.
## Teachings for Spec Kit Memory (37-tool MCP surface)
2-5 items. For EACH: **Claim** · **Evidence** (file:line) · **Maps-to** (027 child or "new sub-packet"; relate to Spec Kit's 37-tool surface governance) · **Verdict** (ADOPT/ADAPT/REJECT/DEFER) · **Risk** · **Confidence** · **Why it transfers (or not)** to an internal single-user MCP.
## Negative knowledge
Public-API/SemVer/external-consumer machinery with little payoff for an internal single-user surface.
## Open questions
For a deeper pass.

Then output EXACTLY one final line, valid compact JSON, nothing after it:
DELTA_JSON: {"iteration":"011","focus":"MCP surface design + API surface governance","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADOPT: ...","ADAPT: ..."],"sources":["path:line"]}
