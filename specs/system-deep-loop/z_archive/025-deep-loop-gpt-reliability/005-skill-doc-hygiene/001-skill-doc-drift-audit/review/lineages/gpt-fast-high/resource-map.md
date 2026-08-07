# Review Evidence Resource Map — gpt-fast-high

## Phase-5 Augmentation

Novel documentation gaps found by this lineage:

| Finding | Source docs | Current truth |
|---|---|---|
| F001 | `.opencode/skills/cli-opencode/SKILL.md:31`, `:285` | `.opencode/agents/ai-council.md:4` is `mode: subagent`; phase 010 says direct invocation is rejected. |
| F002 | `.opencode/skills/cli-opencode/README.md:76`, `:164` | `ai-council` is not a primary top-level `--agent` route. |
| F003 | `.opencode/skills/cli-opencode/manual_testing_playbook/**` CO-017 | The test contract expects a command phase 010 removed. |
| F004 | `.opencode/skills/cli-opencode/assets/prompt_templates.md:385-392` | Template hard-codes direct `--agent ai-council`. |
| F005 | `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279-287`, `:302` | `.opencode/agents/*.toml` had no matches in this workspace. |
| F006 | `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:431-432` | `ai-council` is `mode: subagent` and no `.opencode/agents/ai-council.toml` exists. |
| F007 | `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/output_schema.md:27-29` | No `.opencode/agents/ai-council.toml` exists. |
| F008 | `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:721-724` | No `.opencode/agents/deep-review.toml` exists. |
| F009 | `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md:51-55` | No `.opencode/agents/deep-research.toml` exists. |

## Empty-Result Checks

- Current `mk-deep-loop-guard` catalog/playbook references reviewed in iteration 7 did not preserve stale `deep-route-guard` forward references.
- Orchestrate deep route registry alignment reviewed in iteration 8 did not produce a confirmed finding.
