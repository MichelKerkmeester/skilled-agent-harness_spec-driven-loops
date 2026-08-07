# Research Resource Map: gpt-fast-high

## Phase Evidence

| Resource | Role |
|---|---|
| `014-skill-doc-drift-audit/spec.md` | In-scope file list, NFRs, and TOML mirror-removal charter |
| `009-orchestrate-universal-routing/implementation-summary.md` | Orchestrate routing rows, registry-backed Deep Route, NDP boundary |
| `010-ai-council-subagent-only/implementation-summary.md` | ai-council `mode: subagent`, direct invocation rejected, caller redirects |
| `011-deep-route-guard-plugin/implementation-summary.md` | mk-deep-loop-guard creation, rename, env var, tests |
| `012-gpt-claude-benchmark/implementation-summary.md` | zero Mode-D recurrence, route mismatch results, latency benchmark |
| `013-fix5-checkpoint/implementation-summary.md` | FIX-5 closed as unnecessary |

## Stale Candidate Docs

| Resource | Finding Cluster |
|---|---|
| `.opencode/skills/cli-opencode/SKILL.md` | Direct ai-council drift; deep-review/orchestrate routing drift |
| `.opencode/skills/cli-opencode/README.md` | Direct ai-council drift |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Direct ai-council drift |
| `.opencode/plugins/README.md` | Plugin inventory omits `mk-deep-loop-guard.js` |
| `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md` | Removed TOML mirror drift |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Removed TOML mirror drift |
| `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | Removed TOML mirror drift |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Removed TOML mirror drift |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md` | Primary identity drift; removed TOML mirror drift |
| `.opencode/skills/deep-loop-workflows/deep-improvement/README.md` | Scanner mirror surface drift |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md` | Scanner mirror surface drift |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/mirror_drift_policy.md` | Scanner mirror surface drift |
| `.opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/integration-scanning/runtime-mirrors.md` | Scanner mirror surface drift |

## Ruled-Out Docs

| Resource | Reason |
|---|---|
| `AGENTS.md` | Mentions `/deep:ai-council` and `ai-council/**`, not direct `--agent` or `mode: all` |
| `README.md` | Neutral roster/artifact references remain current |
| `cli-opencode/references/agent_delegation.md` | Already updated to command-only/direct-forbidden ai-council wording |
| `deep-loop-runtime/feature_catalog/validation/mk-deep-loop-guard.md` | Correctly documents new guard name/env/log behavior |
