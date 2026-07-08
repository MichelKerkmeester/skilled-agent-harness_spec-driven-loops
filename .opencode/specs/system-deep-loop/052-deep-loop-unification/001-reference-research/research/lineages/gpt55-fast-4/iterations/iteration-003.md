# Iteration 3: External Reference Migration And Advisor Corpus

## Focus

Validate child 003's staged reference migration across commands, agents, READMEs, plugin/hook surfaces, graph metadata, and advisor routing corpus.

## Findings

1. The Stage C-J migration order is sound because it updates load-bearing constants before generated projections and compiled contracts, then handles prose/corpus and final verification. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:71] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:106]

2. Advisor migration is high risk because the old merged skill id is duplicated in Python and TypeScript. Python points `MODE_REGISTRY_PATH` at `deep-loop-workflows` and sets `MERGED_DEEP_SKILL_ID = "deep-loop-workflows"`; TypeScript exports the same merged id. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109]

3. The routing drift guard itself has two old-identity anchors: `registryPath` points at `.opencode/skills/deep-loop-workflows/mode-registry.json`, and its projection hash input includes `skill: 'deep-loop-workflows'`. Both must change before codegen freshness can be trusted. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:76]

4. Agent mirrors are real duplicates that need separate edits. Both `.opencode/agents` and `.claude/agents` contain old deep-loop paths in `orchestrate`, `deep-research`, `deep-review`, `deep-improvement`, and `ai-council`. [SOURCE: .opencode/agents/orchestrate.md:185] [SOURCE: .claude/agents/orchestrate.md:174] [SOURCE: .opencode/agents/ai-council.md:398] [SOURCE: .claude/agents/ai-council.md:380]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/agents/**`
- `.claude/agents/**`
- `.github/workflows/agent-mirror-sync.yml`
- `.opencode/plugins/mk-deep-loop-guard.js`
- `README.md`

## Assessment

- newInfoRatio: 0.52
- Novelty justification: Mostly confirmed the Stage C-J sequencing, with extra emphasis on paired Python/TypeScript advisor constants and projection-hash regeneration.
- Confidence: High for migration surfaces; medium for exact hit counts because this lineage did not rerun a full filtered inventory count.

## Reflection

- What worked: Category-based grep exposed load-bearing references across commands, agents, plugin, CI, and README surfaces.
- What failed: Full count verification was intentionally not repeated here because the plan already owns Stage A count capture.
- Ruled out: Blind repository-wide replacement, especially in advisor labeled prompts and divergence ledgers.

## Recommended Next Focus

Inspect `fallback-router.ts`, its tests, and fanout retry mechanics to decide whether GLM-5.2 -> MiMo-v2.5-Pro should be wired in this packet.
