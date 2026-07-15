# Resource Map - gpt55-fast-2

## Coverage Summary

| Category | Paths / Evidence | Status | Notes |
|---|---|---|---|
| Specs | `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/{spec.md,plan.md}` | Read | Research scope and fan-out design. |
| Specs | `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/{spec.md,plan.md}` | Read | Structural move and path-repair plan. |
| Specs | `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/{spec.md,plan.md}` | Read | External migration and advisor plan. |
| Specs | `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/{spec.md,plan.md}` | Read | Optional fallback wiring scope. |
| Commands | `.opencode/commands/deep/assets/deep_research_auto.yaml` | Analyzed | Fan-out override, spec mutation, synthesis, resource-map steps. |
| Commands | `.opencode/commands/deep/assets/deep_review_auto.yaml` | Sampled | Fan-out override parity and review command dispatch shape. |
| Commands | `.opencode/commands/deep/{review.md,ai-council.md}` | Cited by grep | Compiled-contract renderer entry points. |
| Skills | `.opencode/skills/deep-loop-workflows/mode-registry.json` | Analyzed | Workflow/runtime/backend discriminator and advisor projection. |
| Skills | `.opencode/skills/deep-loop-workflows/hub-router.json` | Read | Hub vocabulary and mode resources. |
| Skills | `.opencode/skills/deep-loop-workflows/graph-metadata.json` | Read | Current external edges to runtime and system-spec-kit. |
| Skills | `.opencode/skills/deep-loop-runtime/graph-metadata.json` | Read | Current duplicate edges that should collapse after nesting. |
| Scripts | `.opencode/skills/deep-loop-runtime/scripts/{fanout-run.cjs,fanout-pool.cjs,render-command-contract.cjs}` | Analyzed | Fan-out prompt, retry behavior, and runtime-to-workflow imports. |
| Scripts | `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Analyzed | Failure classification and retryability. |
| Scripts | `.opencode/skills/deep-loop-workflows/deep-{research,review}/scripts/{reduce-state.cjs,runtime-capabilities.cjs}` | Analyzed | Reverse runtime imports. |
| Scripts | `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/{orchestrate-topic.cjs,replay-graph-from-artifacts.cjs}` | Analyzed | Runtime council imports and absolute runtime path lookup. |
| Tests | `.opencode/skills/deep-loop-runtime/tests/unit/{artifact-root.vitest.ts,dependency-seams.vitest.ts,fanout-pool.vitest.ts,fallback-router.vitest.ts}` | Analyzed | Path seams, retry, and fallback coverage. |
| Config | `.opencode/skills/deep-loop-runtime/{package.json,tsconfig.json}` | Analyzed | system-spec-kit tooling borrow. |
| Config | `.opencode/skills/system-spec-kit/mcp_server/{package.json,vitest.config.ts}` | Analyzed | Reverse test discovery borrow. |
| Advisor | `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Analyzed | Hardcoded registry path and merged skill id. |
| Advisor | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Analyzed | TypeScript merged identity and alias projection. |
| Advisor | `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Analyzed | Projection drift guard. |
| Advisor | `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` | Analyzed | Approved divergence ledger rows. |
| Model Registry | `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Analyzed | GLM/MiMo pools and fallback targets. |
| Agents | `.opencode/agents/{orchestrate,ai-council,deep-research,deep-review,deep-improvement}.md` | Sampled | Opencode agent path references. |
| Agents | `.claude/agents/{orchestrate,ai-council,deep-research,deep-review,deep-improvement}.md` | Sampled | Claude duplicate agent path references. |
| READMEs | `README.md`, `.opencode/skills/system-spec-kit/README.md`, deep-loop package READMEs | Sampled | User-facing old identity references. |

## Coverage Gaps

- Did not inspect every historical `.opencode/specs/**` mention because child 003 marks specs as historical/out of scope.
- Did not inspect `.worktrees/**`; child 003/005 already classify live worktrees as coordination risk, not immediate migration targets.
- Did not run the full advisor accuracy suite; this lineage validated that the suite is required.

## Evidence-Derived File Set For Child 002

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs`

## Evidence-Derived File Set For Child 003

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json`
- `.opencode/commands/deep/assets/*.yaml`
- `.opencode/agents/*.md`
- `.claude/agents/*.md`
- `README.md`

## Evidence-Derived File Set For Child 004

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs`
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`
