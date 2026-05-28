# 027 pt-02 Cross-Validation Synthesis

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/research.md.
## IRQ4 - Phase 004 Skill Advisor Mandate

- Detail file: [iterations/iteration-004.md](iterations/iteration-004.md).
- Verdict: **BLOCKING** until render-layer guardrails and tests are added.
- Phase scaffold anchor: Phase 004 is scoped to `skill_advisor/lib/render.ts`, expects concise hints, and bans scorer changes (`../../004-skill-advisor-first-action-mandate/spec.md:47-48`, `../../004-skill-advisor-first-action-mandate/spec.md:92-96`, `../../004-skill-advisor-first-action-mandate/spec.md:137-162`).
- mcp_server anchor: renderer and producer accept `passes_threshold === true` before checking numeric confidence/uncertainty, so high-uncertainty records can render (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:153-162`).
- Finding: stronger wording is unsafe unless the renderer re-checks uncertainty or fixtures prove `passes_threshold` already encodes the dual threshold (`iterations/iteration-004.md:25-29`).
- Confirmed ground: the confidence boundary is inclusive at 0.80, concise hints fit current token caps, and cache hit rate should not change because the cache key excludes rendered brief text (`iterations/iteration-004.md:19-35`, `iterations/iteration-004.md:55-59`).
- Required amendment: add fallback hint behavior for unknown skill labels and intentionally update exact string-pinned renderer/producer tests (`iterations/iteration-004.md:37-53`).

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/research.md.
