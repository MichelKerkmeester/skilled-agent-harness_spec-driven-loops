# Iteration 004 Prompt

Read `iteration-contract.md` in this directory first and follow it exactly.

Iteration: 004

Executor metadata: `{"kind":"cli-claude-code","model":"claude-opus-4-7","reasoningEffort":"high","serviceTier":null}`

Focus: audit cli-X self-invocation guards, nested routing rules, and cross-CLI loop risks across `cli-claude-code`, `cli-codex`, `cli-opencode`, `cli-devin`, and `cli-gemini`. Identify inconsistencies that could allow Claude calling Claude, OpenCode calling OpenCode, Codex calling Codex, or a chain of CLIs recursively dispatching each other.

Write:

- `../iterations/iteration-004.md`
- `../deltas/iter-004.jsonl`
- append one JSONL line to `../deep-research-state.jsonl`
