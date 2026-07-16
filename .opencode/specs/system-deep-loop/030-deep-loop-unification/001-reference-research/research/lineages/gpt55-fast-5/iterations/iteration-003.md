# Iteration 3: External Reference Migration And Advisor/Routing Blast Radius

## Focus

Determine whether child 003 covers the full migration surface beyond the physical move.

## Findings

1. Child 003 correctly states there is no safe intermediate state where files are moved but references remain stale. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:42] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:71]
2. Advisor code constants, generated projections, hardcoded tests, routing corpora, and divergence ledgers are migration-critical. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:84] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:101] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:30]
3. Command migration spans source YAML, router markdown, and regenerated compiled outputs. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:89] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:90] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:92] [SOURCE: file:.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:40]
4. `system-spec-kit` is a high-risk integration consumer through package scripts, vitest globs, workflow docs, and reducer tests. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:31] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:20] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:17] [SOURCE: file:.opencode/skills/system-spec-kit/SKILL.md:127]
5. Parent-skill examples need semantic updates, not only path replacement, because `system-deep-loop` introduces a prefix exception. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:99] [SOURCE: file:.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:153]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/skills/system-skill-advisor/**`
- `.opencode/commands/deep/assets/**`
- `.opencode/skills/system-spec-kit/**`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`

## Assessment

- `newInfoRatio`: 0.42
- Novelty justification: expanded the migration surface and confirmed non-obvious generated/test/ledger consumers.
- Confidence: high for the identified surfaces; medium for exact final residual count because grep output was intentionally sampled by category.

## Reflection

What worked: category-specific grep avoided treating all old names equally. What failed: broad grep output truncates, so the migration must still use child 003's baseline inventory step. Ruled out: hand-editing compiled command contracts.

## Recommended Next Focus

Check the fallback-router and GLM-to-MiMo assumptions before stopping.
