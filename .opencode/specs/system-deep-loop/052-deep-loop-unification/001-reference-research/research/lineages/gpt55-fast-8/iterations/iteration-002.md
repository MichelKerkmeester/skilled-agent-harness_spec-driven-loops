# Iteration 2: External Reference And Advisor Migration Risk

## Focus

Validate whether child 003's staged external-reference migration is necessary, especially for advisor and command-contract surfaces.

## Findings

1. Advisor migration is a hard gate, not prose cleanup. The Python advisor reads the mode registry from `.opencode/skills/deep-loop-workflows/mode-registry.json` and hardcodes the merged skill id as `deep-loop-workflows`; the TypeScript aliases layer also hardcodes `MERGED_DEEP_SKILL_ID = 'deep-loop-workflows'`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2570] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:95] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109]
2. The drift guard also embeds the old skill identity in both the registry path and the projection hash input, so advisor codegen and tests must move together. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:74]
3. Command-contract artifacts are generated and hash-sensitive. The compiler's shared source set points at `deep-loop-workflows`, the command definitions point at mode skill paths under that folder, and the drift checker repeats the shared authority paths. Hand-editing compiled contracts would be the wrong repair method. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:13] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:44] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs:38] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:89]
4. Child 003's grep-before/grep-after bracketing and staged codegen plan is justified. The plan distinguishes structured executable data from historical spec references and sequences hardcoded constants, generated projection/codegen, command contract regeneration, docs, graph edges, and routing corpus rebaseline. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:71] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:101]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs`

## Assessment

- newInfoRatio: 0.62
- Novelty justification: second pass confirmed the advisor and compiled-contract surfaces are harder gates than ordinary prose references.
- Confidence: high for staged migration; medium for exact hit counts because this lineage did not run a full pre-change inventory count.

## Reflection

- Worked: reading drift guards and generated projection constants clarified why Stage C/D/I cannot collapse into one replacement.
- Failed: treating all references uniformly would miss command-contract hash/codegen constraints.
- Ruled out: blind repo-wide find/replace.

## Recommended Next Focus

Fanout lineage override, fallback-router wiring, and final recommendation.
