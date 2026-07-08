# Iteration 4: External Reference Migration Completeness

## Focus

Validate whether the child 003 plan covers the live external reference surfaces that still speak `deep-loop-workflows` or `deep-loop-runtime`: commands, assets, generated command contracts, advisor code, tests, hooks, CI, plugins, routing corpus, and sibling graph metadata.

## Findings

1. **The child 003 migration plan is directionally complete and correctly category-driven rather than a blind replacement.** It explicitly stages hardcoded constants, structured identity fields and codegen, source command assets plus compiled contracts, prose/docs, sibling graph metadata, grandfather examples, advisor corpus fields, and final residual-grep/verification gates. This matches the observed spread of old identifiers across executable code, generated files, structured JSON, tests, and docs. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:84] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:89] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:95]
2. **Advisor migration must keep `skill_advisor.py`, `aliases.ts`, `explicit.ts`, and the drift guard synchronized as one codegen unit.** The Python entrypoint still hardcodes `MODE_REGISTRY_PATH`, `_projection_hash()`'s skill literal, and `MERGED_DEEP_SKILL_ID`; the TypeScript scorer files still project the merged ID and boosts to `deep-loop-workflows`; the drift guard independently hardcodes both the registry path and projection hash skill. Stage C-D-J's codegen/drift-guard sequence is therefore load-bearing. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:349] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:105] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26]
3. **Hook, CI, plugin, and doctor surfaces are first-class migration targets, not documentation cleanup.** The pre-commit hook and GitHub Actions workflow both hardcode the deep-improvement mirror checker under `deep-loop-workflows`; the loop guard plugin hardcodes the mode-registry path; the doctor parent-skill checker is the family-wide audit that must still locate the advisor drift guard after the rename. The plan's matched-pair hook/CI edit and plugin/doctor staging are justified. [SOURCE: file:.opencode/hooks/pre-commit:40] [SOURCE: file:.github/workflows/agent-mirror-sync.yml:17] [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:35] [SOURCE: file:.opencode/commands/doctor/scripts/parent-skill-check.cjs:79]
4. **Sibling graph metadata migration should explicitly dedupe duplicate edges while renaming them.** The 003 plan already includes `system-spec-kit`, `system-skill-advisor`, `cli-opencode`, `sk-code`, and `sk-prompt`; live evidence confirms all matter. `cli-opencode` currently lists `deep-loop-workflows` twice, while `system-skill-advisor` has multiple distinct contextual edges and `sk-prompt` has an improvement peer edge. The migration should preserve meaningful contexts but collapse literal duplicate targets. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:97] [SOURCE: file:.opencode/skills/cli-opencode/graph-metadata.json:31] [SOURCE: file:.opencode/skills/system-skill-advisor/graph-metadata.json:35] [SOURCE: file:.opencode/skills/sk-prompt/graph-metadata.json:22]
5. **Compiled command contracts must remain generated output.** Live command assets and compiled contracts both carry old skill paths, including source YAML `skill_reference` blocks and generated contract `sourceDigests`/resource paths. The plan correctly says to edit command assets and router one-liners, then run `compile-command-contracts.cjs`, not hand-edit compiled contract markdown. [SOURCE: file:.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:39] [SOURCE: file:.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:47] [SOURCE: file:.opencode/commands/deep/assets/compiled/deep_research.contract.md:6] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:89]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/hooks/pre-commit`
- `.github/workflows/agent-mirror-sync.yml`
- `.opencode/plugins/mk-deep-loop-guard.js`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/cli-opencode/graph-metadata.json`
- `.opencode/skills/system-skill-advisor/graph-metadata.json`
- `.opencode/skills/sk-prompt/graph-metadata.json`
- `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md`

## Assessment

- `newInfoRatio`: 0.70
- Novelty justification: The broad category plan was expected, but this pass corrected stale assumptions, confirmed current advisor/scorer paths, and found a duplicate graph-edge cleanup detail.
- Confidence: High that the 003 plan covers the major external surfaces; medium on residual inventory completeness until Stage A/J run the full scoped grep and verification suite.

## Reflection

- Worked: Verifying the current plan against live files prevented treating already-covered items as gaps.
- Failed: A raw old-name inventory is not sufficient to judge completeness because generated contracts, live source assets, routing fixtures, and historical spec docs require different handling.
- Ruled out: Hand-editing compiled command contracts; source YAML/router assets plus contract codegen is the safer path.

## Recommended Next Focus

Validate fallback-router wiring: inspect `fallback-router.ts`, its tests, and `fanout-run.cjs` failure paths to decide whether GLM-5.2 to MiMo-v2.5-Pro fallback should land now or remain optional.
