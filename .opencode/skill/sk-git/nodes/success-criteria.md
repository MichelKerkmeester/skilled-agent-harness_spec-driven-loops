---
description: "Completion gates and quality checks for workspace setup, commits, and integration"
---
# Success Criteria

Verification checklists and quality gates for each phase of the git workflow.

## Workspace Setup Complete

- Worktree created in correct directory (`.worktrees/` or user-specified)
- Branch naming follows convention (`type/short-description`)
- Working directory is clean and isolated
- User confirmed workspace choice (branch/worktree/current)

## Commit Complete

- All changes reviewed and categorized
- Artifacts filtered out (build files, coverage, etc.)
- Commit message follows Conventional Commits format
- Only public-value files staged

## Integration Complete

- Tests pass before merge/PR
- PR description includes context, changes, and testing notes
- Branch up-to-date with base branch
- Worktree cleaned up after merge (if used)
- Local and remote feature branches deleted

## Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| **Pre-commit** | Artifacts excluded, message formatted | Yes |
| **Pre-merge** | Tests pass, branch up-to-date | Yes |
| **Pre-PR** | Description complete, CI passing | Yes |
| **Post-merge** | Worktree removed, branches cleaned | No |

## Cross References

- [[rules]] - Governing rules these gates enforce
- [[commit-workflow]] - Commit quality specifics
- [[work-completion]] - Integration quality specifics
