# Resource Map - gpt55-fast-10

Generated from this lineage's research deltas. This is an evidence map for the lineage, not the packet root `resource-map.md`.

## Specs

| Path | Role |
|------|------|
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md` | Research charter, scope, GLM fallback risk. |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md` | Fanout invocation and manual fallback workaround. |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md` | Structural layout, path-coupling rule, tooling-borrow scope. |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md` | Reference migration staging and exit gates. |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md` | Optional fallback-router scope and operator question. |

## Runtime Code

| Path | Role |
|------|------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Current retry and retry-exhaustion behavior. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Existing fallback route resolver and guards. |
| `.opencode/skills/deep-loop-runtime/package.json` | Runtime typecheck script borrowing system-spec-kit tsc. |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Runtime typeRoots borrowing system-spec-kit @types. |

## System-Spec-Kit Coupling

| Path | Role |
|------|------|
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Includes `../deep-loop-runtime/tests`. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Test/typecheck entrypoints affected by relative paths. |

## Commands And Agents

| Path | Role |
|------|------|
| `.opencode/commands/doctor/_routes.yaml` | Deep-loop doctor route invokes runtime scripts. |
| `.opencode/commands/deep/assets/*.yaml` | Command workflow path references. |
| `.opencode/agents/orchestrate.md` | OpenCode agent mirror references mode registry. |
| `.claude/agents/orchestrate.md` | Claude agent mirror references mode registry. |

## Advisor

| Path | Role |
|------|------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | `MODE_REGISTRY_PATH` and Python projection code. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Generated routing projection and `MERGED_DEEP_SKILL_ID`. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Hand-authored scoring boosts. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` | Advisor corpus/re-baseline surface. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` | Divergence ledger re-approval surface. |

## Model Profiles

| Path | Role |
|------|------|
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | GLM and MiMo pool/fallback metadata. |
