# Resource Map - gpt55-fast-8

## Scope

Lineage-local evidence map for `gpt55-fast-8`. The parent 001 spec folder did not contain a `resource-map.md` at init, so this file is emitted from the lineage's converged evidence rather than inherited inventory.

## Specs

| Path | Coverage |
|------|----------|
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/spec.md` | Parent scope, open fallback question, sequencing |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/001-reference-research/spec.md` | Research phase constraints and fanout acceptance criteria |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/001-reference-research/plan.md` | Fanout executor payload and convergence-floor assumptions |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md` | Target layout and structural scope |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md` | Path-repair tables and verification gates |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/003-external-reference-migration/spec.md` | External migration requirements |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/003-external-reference-migration/plan.md` | Advisor/codegen/corpus migration staging |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring/spec.md` | Optional fallback scope |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring/plan.md` | Proposed fallback-router integration point |

## Skills And Runtime Code

| Path | Coverage |
|------|----------|
| `.opencode/skills/deep-loop-workflows/SKILL.md` | Hub/runtime identity contract |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Workflow mode registry and runtime-loop backend discriminator |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reverse workflow-to-runtime import and resolver-driven reducer path |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs` | system-spec-kit resolver seam |
| `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs` | Forward runtime-to-workflows import |
| `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs` | Generated contract sources and path literals |
| `.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs` | Drift authority source paths |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Detached lineage prompt and executor command construction |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Same-model retry and retry-exhausted behavior |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Existing fallback route resolver and graph validator |
| `.opencode/skills/deep-loop-runtime/package.json` | Runtime typecheck borrow from system-spec-kit |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Runtime type roots borrow from system-spec-kit |

## Advisor And Model Routing

| Path | Coverage |
|------|----------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python advisor registry path and merged deep skill id |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | TypeScript merged deep skill id and generated alias projection |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Registry path and projection hash drift guard |
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | GLM/MiMo quota pools and fallback metadata |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | MiMo/GLM dispatch and substitution rules |

## Tests And Verification Surfaces

| Path | Coverage |
|------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Cross-package deep-loop-runtime test include |
| `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` | Existing fallback-router unit coverage found by Grep |
| `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs` | Iteration artifact verification used by this lineage |

## Gaps

- Full residual reference inventory is not recomputed here; child 003 Stage A owns it.
- Runtime and system-spec-kit tests are not executed here; child 002 owns them.
- Code graph is stale; graph queries are excluded from proof.
