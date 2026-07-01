# Iteration 003 — Security/Correctness: dispatch template boundaries

## Focus

Checked whether prompt templates still route around the command/orchestrate boundary.

## Findings

### F004 — P1 — `cli-opencode` prompt template hard-codes direct `--agent ai-council`

The prompt template for multi-strategy planning includes a bash invocation with `--agent ai-council`. The same skill's `agent_delegation.md` now says direct `opencode run --agent ai-council` is forbidden as of `mode: subagent`, so this template contradicts the corrected reference inside the same skill. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:385-392] [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:197] [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:229] [SOURCE: .opencode/agents/ai-council.md:4]

## Verdict Rationale

P1 because templates are copied directly into operator commands; stale dispatch snippets can reliably fail.

Review verdict: CONDITIONAL
