# Goal Plugin Review Extraction

This folder carries the goal-plugin review context extracted from the earlier mixed loop-system review packet.

## Extracted Scope

The goal-plugin review surface is:

| Surface | Path |
|---------|------|
| Plugin | `.opencode/plugins/mk-goal.js` |
| Command | `.opencode/commands/goal.md` |
| Playbook | `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md` |

## Review Evidence

- Native review configuration originally included `.opencode/plugins/mk-goal.js` and `.opencode/commands/goal.md` in the owned surface list.
- Native review strategy identified `mk-goal.js` as a high-complexity hotspot for later correctness and security passes.
- GLM resource mapping recorded the plugin and command as named surfaces with no active goal-specific findings at that point.
- Remediation phase evidence added adversarial scenarios for terminal-goal same-objective revival and active-goal injection clamp behavior, backed by `mk-goal-lifecycle.test.cjs` and `mk-goal-state.test.cjs` passing with exit 0.

## Boundary

Mixed loop-system remediation records remain in `030-agent-loops-improved/008-loop-systems-remediation` because they group runtime, workflow, command and goal-plugin regression evidence in one remediation phase. This packet is now the feature owner for future `/goal` plugin review and follow-up work.
