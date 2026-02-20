---
description: "Activation triggers, use cases, and when NOT to use the workflows-git skill"
---
# When To Use

Guidance on when to invoke the workflows-git orchestrator and when to skip it.

## When to Use This Orchestrator

Use this orchestrator when:
- Starting new git-based work
- Unsure which git skill to use
- Following complete git workflow (setup -> work -> complete)
- Looking for git best practices (branch naming, commit conventions)

## When NOT to Use

- Simple `git status` or `git log` queries (use Bash directly)
- Non-git version control systems

## Keyword Triggers

`worktree`, `branch`, `commit`, `merge`, `pr`, `pull request`, `git workflow`, `conventional commits`, `finish work`, `integrate changes`, `github`, `issue`, `review`

## Cross References

- [[smart-routing]] - Intent scoring and resource loading logic
- [[how-it-works]] - Core lifecycle phases
