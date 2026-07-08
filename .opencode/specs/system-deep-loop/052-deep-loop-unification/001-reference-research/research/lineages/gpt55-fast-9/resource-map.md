# Resource Map - gpt55-fast-9

## Overview

Evidence-derived map for this detached lineage. The spec folder had no `resource-map.md` at init, so this map is emitted from lineage deltas and final synthesis.

## Commands

- `.opencode/commands/deep/assets/deep_research_auto.yaml` - Deep-research workflow contract, state paths, skill references, and CLI executor branch.
- `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml` - Council command references requiring system-deep-loop/runtime migration.
- `.opencode/commands/deep/research.md` - Public `/deep:research` entrypoint; command name remains stable.

## Agents

- `.opencode/agents/orchestrate.md` - Stable deep agent slugs and registry-backed route contract.
- `.opencode/agents/ai-council.md` - Council helper paths and runtime reducer ownership references.
- `.opencode/agents/deep-research.md` - Leaf iteration contract used by this lineage.

## Skills And Runtime

- `.opencode/skills/deep-loop-workflows/SKILL.md` - Current public hub contract.
- `.opencode/skills/deep-loop-workflows/README.md` - Public/backend split, stable command/agent integration.
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - Mode routing source of truth.
- `.opencode/skills/deep-loop-runtime/SKILL.md` - Current runtime skill identity slated for demotion.
- `.opencode/skills/deep-loop-runtime/README.md` - Runtime backend contract.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` - Optional model fallback router.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` - Current same-model retry exhaustion branch.

## Tests

- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` - Router behavior and graph validation tests.
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` - Caller-approved substitution guard.
- `.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts` - Runtime-capability shim path expectations.
- `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts` - Artifact-root system-spec-kit seam.
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` - Council anchor/runtime path fixture.

## Advisor Corpus And Metadata

- `.opencode/skills/deep-loop-workflows/graph-metadata.json` - Current public skill graph identity.
- `.opencode/skills/deep-loop-runtime/graph-metadata.json` - Current runtime graph identity to fold into one graph.
- `.opencode/skills/system-skill-advisor/graph-metadata.json` - Advisor routes deep-loop requests to the current hub name.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` - Deep-loop merge re-baseline fixture with stale runtime top-1 case.

## Model Profiles

- `.opencode/skills/sk-prompt-models/assets/model_profiles.json` - GLM-5.2 and MiMo V2.5 Pro quota pools and model profile facts.
- `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` - Dispatch prompt profile references for GLM-5.2 and MiMo.
- `.opencode/skills/cli-opencode/SKILL.md` - CLI model selection, MiMo routing, GLM routing, and model-profile ownership.

## Specs

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md` - Research-phase scope and accepted fallback risk.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md` - Physical move and path-repair plan.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md` - Optional fallback-router wiring scope.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md` - Registry-driven GLM -> MiMo fallback implementation sketch.
