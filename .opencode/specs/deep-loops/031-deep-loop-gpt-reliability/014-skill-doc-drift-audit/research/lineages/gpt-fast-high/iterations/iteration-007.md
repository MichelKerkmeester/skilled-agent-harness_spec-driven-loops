# Iteration 7: deep-improvement Scanner Docs and Implementation-Coupled TOML Drift

## Focus

Inspect deep-improvement docs that describe integration scanning and mirror gates for stale `.opencode/agents/{name}.toml` assumptions.

## Findings

1. `deep-improvement/README.md` says `scan-integration.cjs` inventories three runtime mirrors and lists `.opencode/agents/`, `.claude/agents/`, and `.opencode/agents/` again, which is internally ambiguous and stale relative to the removed TOML mirror requirement. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:81]
2. The same README FAQ says the scanner finds the canonical definition plus three runtime mirrors. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/README.md:161]
3. `feature_catalog/02--integration-scanning/runtime-mirrors.md` explicitly says the hardcoded templates include `.opencode/agents/{name}.toml`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/02--integration-scanning/runtime-mirrors.md:27-30]
4. `references/agent_improvement/integration_scanning.md` lists `.opencode/agents/{name}.toml` as an OpenCode mirror and includes it in example output. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md:42-47] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md:80-85]
5. `references/agent_improvement/mirror_drift_policy.md` requires `.opencode/agents/`, `.claude/agents/`, and `.opencode/agents/` to contain the corresponding agent and says OpenCode TOML is compared by extracted `developer_instructions`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/mirror_drift_policy.md:41-43]
6. This is implementation-coupled drift, not only prose: `scan-integration.cjs` still has `.opencode/agents/{name}.toml` in its mirror templates. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs:18]

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/deep-improvement/README.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/02--integration-scanning/runtime-mirrors.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/integration_scanning.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/mirror_drift_policy.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs`

## Assessment

- newInfoRatio: 0.70
- Novelty: found the same stale mirror assumption propagated through README, feature catalog, references, and implementation.
- Confidence: high on drift existence; follow-up should treat this as doc-plus-code alignment, not a doc-only typo.

## Reflection

- Worked: reading the implementation clarified why the docs may still say TOML.
- Failed: this expands beyond pure documentation; fixing docs alone may make them lie about scanner behavior unless the scanner changes too.
- Ruled out: generic phrases like "runtime mirrors may be stale" are not stale by themselves; the stale part is the active `.opencode/agents/{name}.toml` surface.

## Recommended Next Focus

Check deep-ai-council mode/identity docs for stale primary-agent and TOML mirror claims.
