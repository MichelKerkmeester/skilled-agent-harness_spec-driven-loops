# The three probe prompts, used before the cut and to be reused word for word after it

Each probe is a `general-purpose` agent on Sonnet (the Agent call needs `model: "sonnet"`). Copy `sum-range.js` and `sum-range.test.js` from this folder to a fresh folder outside the repository first, and put that folder's path where `<TASK DIR>` stands. `<WORKTREE>` is the worktree root.

## context

Read the file <WORKTREE>/.claude/agents/context.md and act as that agent for this one task. It is a read-only agent: write nothing and run no shell command. Treat <WORKTREE> as the repository root for every path.

Dispatch (from the orchestrator, Depth: 1):
Topic: where the agent roster check is implemented and which CI workflow runs it.
Thoroughness: quick.
Output Size: summary-only.

Follow the agent file's workflow and return exactly what that agent file says the agent returns, in the agent's own output format, complete and unabridged. Do not add commentary about this instruction. After the agent's return, add one final line: `tool calls: <N>`.

## review

Read the file <WORKTREE>/.claude/agents/review.md and act as that agent for this one task. It is a read-only agent: write nothing and change nothing. Treat <WORKTREE> as the repository root for every path the agent file names.

Dispatch (from the orchestrator, Depth: 1):
Review the two files <TASK DIR>/sum-range.js and sum-range.test.js in the same folder. The function is meant to return the sum of the whole numbers from start to end, both included. Complexity: low.

Follow the agent file's workflow and return exactly what that agent file says the agent returns, in the agent's own output format, complete and unabridged. Do not add commentary about this instruction. After the agent's return, add one final line: `tool calls: <N>`.

## code

Read the file <WORKTREE>/.claude/agents/code.md and act as that agent for this one task. Treat <WORKTREE> as the repository root for every path the agent file names (for example the sk-code skill), and read from it only: do NOT write, stage or commit anything inside that repository.

Dispatch (from the orchestrator):
Depth: 1. You are dispatched by @orchestrate.
Task: fix the bug in <TASK DIR>/sum-range.js. `sumRange(start, end)` must return the sum of the whole numbers from start to end, both included. The check is `node sum-range.test.js`, run in that folder.
Scope: that one file only. No spec folder applies; this is a scratch task outside the repository, and the spec-folder question is already answered: skip.
Complexity: low.

Follow the agent file's workflow and return exactly what that agent file says the agent returns, in the agent's own return format, complete and unabridged. Do not add commentary about this instruction. After the agent's return, add one final line: `tool calls: <N>`.
