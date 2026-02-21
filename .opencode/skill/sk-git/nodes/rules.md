---
description: "ALWAYS/NEVER/ESCALATE rules governing git workflow behavior"
---
# Rules

Hard constraints that apply to every git workflow operation.

## ALWAYS

1. **Use conventional commit format** - All commits must follow `type(scope): description` pattern
2. **Create worktree for parallel work** - Never work on multiple features in the same worktree
3. **Verify branch is up-to-date** - Pull latest changes before creating PR
4. **Use descriptive branch names** - Format: `type/short-description` (e.g., `feat/add-auth`, `fix/login-bug`)
5. **Reference spec folder in commits** - Include spec folder path in commit body when applicable
6. **Clean up after merge** - Delete local and remote feature branches after successful merge
7. **Squash commits for clean history** - Use squash merge for feature branches with many WIP commits

## NEVER

1. **Force push to main/master** - Protected branches must never receive force pushes
2. **Commit directly to protected branches** - Always use feature branches and PRs
3. **Leave worktrees uncleaned** - Remove worktree directories after merge
4. **Commit secrets or credentials** - Use environment variables or secret management
5. **Create PRs without description** - Always include context, changes, and testing notes
6. **Merge without CI passing** - Wait for all checks to complete
7. **Rebase public/shared branches** - Only rebase local, unpushed commits

## ESCALATE IF

1. **Merge conflicts cannot be auto-resolved** - Complex conflicts require human decision on which changes to keep
2. **GitHub MCP returns authentication errors** - Token may be expired or permissions insufficient
3. **Worktree directory is locked or corrupted** - May require manual cleanup with `git worktree prune`
4. **Force push to protected branch is requested** - This requires explicit approval and understanding of consequences
5. **CI/CD pipeline fails repeatedly** - May indicate infrastructure issues beyond code problems
6. **Branch divergence exceeds 50 commits** - Large divergence suggests need for incremental merging strategy
7. **Submodule conflicts detected** - Submodule updates require careful coordination

## Cross References

- [[success-criteria]] - Quality gates that enforce these rules
- [[commit-workflow]] - Commit formatting conventions
- [[workspace-setup]] - Worktree management rules
