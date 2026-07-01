# Resource Map: gpt-fast-high Lineage

## READMEs

- `.opencode/plugins/README.md:24-50` - local plugin auto-load, default-export-only rule, current mk-deep-loop-guard role.

## Documents

- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md:47-60` - GPT-5.5 enforcement inconsistency evidence.
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/016-mk-deep-loop-guard-hardening/spec.md:52-89` - phase problem, scope, and requirements.

## Commands

- No command files were read in this lineage. The research used skill and agent contracts instead.

## Agents

- `.opencode/agents/orchestrate.md:71-80` - deep-review priority row.
- `.opencode/agents/orchestrate.md:186-210` - Task prompt schema and Deep Route fields.
- `.opencode/agents/deep-review.md:34-64` - single-iteration, leaf-only review executor contract.
- `.opencode/agents/deep-review.md:276-284` - caller/coordinator integration table.

## Skills

- `.opencode/skills/cli-opencode/SKILL.md:279-295` - current Agent Delegation wording: command-owned loop executors and one bounded orchestrate hand-off.
- `.opencode/skills/cli-opencode/references/agent_delegation.md:203-230` - direct CLI command-only restrictions for loop executors.
- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md` - loop workflow contract loaded before execution.

## Specs

- `.opencode/skills/deep-loop-workflows/mode-registry.json:33-99` - registry identities for research, review, and agent-improvement modes.

## Scripts

- No executable scripts were run for research logic.

## Tests

- No tests were run; this is a research/design lineage.

## Config

- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-258` - plugin SDK hook signatures.

## Meta

- `.opencode/plugins/mk-deep-loop-guard.js:78-106` - current guard implementation.
- `.opencode/plugins/mk-goal.js:647-793` - durable per-session state precedent.
- `.opencode/plugins/mk-goal.js:1728-1854` - plugin-local runtime state precedent.
