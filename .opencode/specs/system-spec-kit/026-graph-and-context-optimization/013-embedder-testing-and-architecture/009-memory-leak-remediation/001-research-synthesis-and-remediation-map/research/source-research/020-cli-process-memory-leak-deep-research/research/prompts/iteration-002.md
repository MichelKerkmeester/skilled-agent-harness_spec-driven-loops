# Iteration 002 Prompt

Read `iteration-contract.md` in this directory first and follow it exactly.

Iteration: 002

Executor metadata: `{"kind":"cli-claude-code","model":"claude-opus-4-7","reasoningEffort":"high","serviceTier":null}`

Focus: audit `/deep:start-research-loop` state, advisory locks, reducer writes, post-dispatch validation, executor-audit behavior, failure recovery, and cleanup responsibilities. Look for paths where a failed dispatch can leave state inconsistent or launch the next iteration incorrectly.

Write:

- `../iterations/iteration-002.md`
- `../deltas/iter-002.jsonl`
- append one JSONL line to `../deep-research-state.jsonl`
