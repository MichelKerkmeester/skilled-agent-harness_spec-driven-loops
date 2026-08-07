# Iteration 4: Comment Hygiene Live Set

## Focus

Re-grep ephemeral finding-id markers.

## Findings

- The six original command YAML markers remain live in `deep_research_auto.yaml` and `deep_review_auto.yaml`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:301] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:319] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1099] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:395] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:408] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:988]
- The marker class is broader than round 1's command files: `cli-opencode` skill references also contain `F-007-B2-*` markers in durable skill docs. [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:225] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:289]

## Novelty

newInfoRatio: 0.72. Existing finding still live, with expanded scope.
