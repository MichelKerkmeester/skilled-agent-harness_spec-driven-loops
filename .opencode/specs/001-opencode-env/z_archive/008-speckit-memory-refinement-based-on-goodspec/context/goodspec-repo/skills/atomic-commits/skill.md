---
name: atomic-commits
description: Create small, focused commits that each represent a single logical change.
category: code
triggers:
  - commit
  - git
  - atomic
  - history
version: 0.1.0
---

# Atomic Commits Skill

## Purpose
Create small, focused commits that each represent a single logical change.

## Principles

1. **One Change Per Commit** - Each commit should do one thing
2. **Buildable State** - Every commit should leave the code in a working state
3. **Meaningful Messages** - Commit messages explain the why, not just the what
4. **Reviewable Size** - Commits should be easy to review (< 200 lines ideal)

## Commit Structure

```
type(scope): short description

Longer explanation of why this change was made.
Include context that helps future readers understand
the decision.

Closes #123
```

## Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring
- `docs` - Documentation only
- `test` - Test additions/changes
- `chore` - Maintenance tasks
- `perf` - Performance improvements

## Anti-Patterns to Avoid

- "WIP" commits
- "Fix typo" without context
- Multiple unrelated changes in one commit
- Breaking commits (code doesn't build)
- Giant commits that do everything
