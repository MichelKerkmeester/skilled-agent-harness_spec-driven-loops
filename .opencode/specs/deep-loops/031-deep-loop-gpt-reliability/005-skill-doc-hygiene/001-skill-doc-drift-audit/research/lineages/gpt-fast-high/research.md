# Deep Research Synthesis: Skill Documentation Drift Audit

## Verdict

Stale docs were found. The drift clusters are concrete and evidence-cited below. The highest-risk fixes are `cli-opencode` direct `ai-council` dispatch instructions, `.opencode/plugins/README.md` missing `mk-deep-loop-guard.js`, and the still-active `.opencode/agents/*.toml` mirror requirement across core deep-loop and deep-improvement docs.

## Stale Documentation Findings

### F-A: `cli-opencode` Still Teaches Direct `ai-council` Dispatch

Contradicts phase 010, which converted `.opencode/agents/ai-council.md` from `mode: all` to `mode: subagent` and verified direct `opencode run --agent ai-council` is rejected. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60] Current frontmatter confirms `mode: subagent`. [SOURCE: .opencode/agents/ai-council.md:4]

Stale docs:

- `.opencode/skills/cli-opencode/SKILL.md:31` lists `ai-council` as a primary directly invokable via `--agent`. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:31]
- `.opencode/skills/cli-opencode/SKILL.md:285` says OpenCode defines `ai-council` as a primary and allows pinning `--agent ... ai-council`. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:285]
- `.opencode/skills/cli-opencode/README.md:76` says direct top-level `--agent` is conditionally allowed for primary agents such as `ai-council`. [SOURCE: .opencode/skills/cli-opencode/README.md:76]
- `.opencode/skills/cli-opencode/README.md:164` tells users to use `orchestrate` or `ai-council` when they are documented primary routes. [SOURCE: .opencode/skills/cli-opencode/README.md:164]
- `.opencode/skills/cli-opencode/assets/prompt_templates.md:372` and `:386-392` define the multi-strategy template with `Agent: ai-council` and a copy-paste `--agent ai-council` command. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:372] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:386-392]

Related living-doc drift outside the spec's explicit SKILL/README candidate list:

- `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:417` still verifies `--agent ai-council`. [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:417]
- `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy.md:27-43` and `:51` require direct `--agent ai-council`. [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy.md:27-43] [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy.md:51]

### F-B: `cli-opencode/SKILL.md` Partially Contradicts Orchestrate Deep-Review Routing

Phase 009 added `@deep-review` to the orchestrate priority table for explicit `/deep:review` convergence requests and made `Deep Route:` registry-backed. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing/implementation-summary.md:50-57] Current `orchestrate.md` has the `/deep:review` -> `@deep-review` row. [SOURCE: .opencode/agents/orchestrate.md:79]

Stale doc:

- `.opencode/skills/cli-opencode/SKILL.md:292` says command-owned loop executors including `deep-review` are dispatched only by parent commands and must never route through orchestrate. This should preserve the valid prohibition on raw direct `--agent deep-review`, but remove or qualify the false "never route through orchestrate" part for `/deep:review`. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:292]

### F-C: `.opencode/plugins/README.md` Omits `mk-deep-loop-guard.js`

Phase 011 added `.opencode/plugins/mk-deep-loop-guard.js`, renamed it from `deep-route-guard.js`, renamed the env var to `MK_DEEP_LOOP_GUARD_REJECT`, and added tests. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:129-139] Current file exists and implements the new name/env/log prefix. [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:1-8] [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:22-24] [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:97-103]

Stale doc:

- `.opencode/plugins/README.md:3` says there are "Three plugin entrypoint files" and `.opencode/plugins/README.md:42-50` lists current entrypoints without `mk-deep-loop-guard.js`. The directory currently has six `.js` entrypoints including `mk-deep-loop-guard.js`. [SOURCE: .opencode/plugins/README.md:3] [SOURCE: .opencode/plugins/README.md:42-50]

### F-D: Core Deep-Loop Docs Still Require Removed `.opencode/agents/*.toml` Mirrors

The 014 audit charter records `.opencode/agents/*.toml` mirrors as removed obsolete requirements. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:56] Current filesystem check found no `.opencode/agents/*.toml` files.

Stale docs:

- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:17-20` lists `.opencode/agents/*.toml` as OpenCode runtime path resolution. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:17-20]
- `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:16-20` lists `.opencode/agents/*.toml` when running directly in OpenCode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/SKILL.md:16-20]
- `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279-287` lists `.opencode/agents/deep-context.toml` as an OpenCode mirror, and `:302` mandates keeping it in sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279-287] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:302]
- `.opencode/skills/deep-loop-runtime/SKILL.md:253-261` says each deep-loop agent has a `.opencode/agents/<name>.toml` mirror and missing mirrors silently fail dispatch. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:253-261]

### F-E: deep-improvement Scanner Docs Still Encode `.opencode/agents/{name}.toml`

This cluster is not doc-only: the docs mirror an implementation assumption still present in `scan-integration.cjs`. Fixing docs without deciding the scanner contract may create a new contradiction.

Stale docs and implementation-coupled evidence:

- `.opencode/skills/deep-loop-workflows/deep-improvement/README.md:81` says the scanner inventories three runtime mirrors and duplicates `.opencode/agents/` in the parenthetical. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:81]
- `.opencode/skills/deep-loop-workflows/deep-improvement/README.md:161` says the scanner finds the canonical definition plus three runtime mirrors. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:161]
- `.opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/02--integration-scanning/runtime-mirrors.md:29` says hardcoded templates include `.opencode/agents/{name}.toml`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/02--integration-scanning/runtime-mirrors.md:29]
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md:42-47` lists `.opencode/agents/{name}.toml` as an OpenCode mirror, and `:80-85` shows it in example output. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md:42-47] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md:80-85]
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/mirror_drift_policy.md:41-43` requires the TOML surface and says OpenCode TOML is compared by extracted body tokens. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/mirror_drift_policy.md:41-43]
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md:94` requires agent-definition targets across all four runtime mirrors and mentions OpenCode TOML extraction. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md:94]
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs:18` still includes `.opencode/agents/{name}.toml`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs:18]

### F-F: `deep-ai-council/SKILL.md` Still Calls `@ai-council` Primary and Lists a TOML Mirror

Stale doc:

- `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:431-432` says runtime mirrors dispatch `@ai-council` as the primary agent identity and lists `.opencode/agents/ai-council.toml`. This contradicts phase 010/current `mode: subagent` and the removed TOML mirror requirement. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:431-432] [SOURCE: .opencode/agents/ai-council.md:4] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60]

Related pre-existing identity drift, likely not caused by 031:

- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:25-31` expects `@deep-ai-council` as current runtime name, but the registry's dispatched `agent` remains `ai-council`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:25-31] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72]

## Confirmed Non-Findings

- `cli-opencode/references/agent_delegation.md` already states direct `opencode run --agent ai-council` is forbidden as of `mode: subagent`. [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:197]
- `deep-loop-runtime/feature_catalog/03--validation/mk-deep-loop-guard.md` correctly documents the new guard name, env var, and live validation. [SOURCE: .opencode/skills/deep-loop-runtime/feature_catalog/03--validation/mk-deep-loop-guard.md:12-34]
- `AGENTS.md` and root `README.md` checked lines contain neutral `/deep:ai-council`, `@ai-council`, or `ai-council/**` references, not stale direct `--agent` or `mode: all` claims. [SOURCE: AGENTS.md:453] [SOURCE: README.md:850] [SOURCE: README.md:1169-1170]
- Historical old-name mentions inside phase 011's implementation summary are intentional history, not living-doc drift. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:129-133]

## Convergence Report

- Stop reason: `maxIterationsReached`
- Iterations completed: 10
- Questions answered: 5/5
- Average newInfoRatio trend: `[1.00, 0.90, 0.75, 0.65, 0.70, 0.80, 0.70, 0.65, 0.35, 0.20]`
- Final composite stop score: telemetry only; max-iterations policy controlled stop.

## Recommended Follow-Up

1. Patch direct `ai-council` dispatch claims in `cli-opencode` docs and assets to use `/deep:ai-council` or a Task-dispatch route through an allowed primary.
2. Update `.opencode/plugins/README.md` entrypoint count and table to include `mk-deep-loop-guard.js`.
3. Decide whether `.opencode/agents/*.toml` removal is doc-only or requires changing `deep-improvement/scripts/agent-improvement/scan-integration.cjs`; then update the deep-loop runtime/skill docs consistently.
