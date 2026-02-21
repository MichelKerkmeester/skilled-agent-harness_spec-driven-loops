---
description: "PR creation, conflict resolution, branch cleanup, merge strategies, deployment, and finish workflow"
---
# Work Completion

Guidance on integrating finished work through PRs, merges, or discarding, plus cleanup.

## Finish Workflow

The 5-step completion flow is detailed in [finish_workflows.md](../references/finish_workflows.md).

Integration options:
- **Merge locally** - Direct merge to base branch
- **Create PR** - Open pull request for review
- **Keep as-is** - Leave branch for later
- **Discard** - Abandon changes and clean up

## PR Creation

Every PR must include:
- Descriptive title following commit conventions
- Summary of changes
- Testing notes
- Link to related issues

Use the [pr_template.md](../assets/pr_template.md) for consistent formatting.

## Branch Cleanup

After successful merge:
1. Delete remote feature branch
2. Delete local feature branch
3. Remove worktree directory (if used)
4. Prune stale worktree references

## Integration Examples

### New Feature
1. **Setup**: git-worktrees -> `.worktrees/auth-feature` with `temp/auth`
2. **Work**: Code OAuth2 flow -> Run tests
3. **Commit**: git-commit -> Stage auth files -> `feat(auth): add OAuth2 login flow`
4. **Complete**: git-finish -> Merge to main -> Tests pass -> Cleanup worktree
5. **Result**: Feature integrated, clean history, workspace removed

### Quick Hotfix
1. **Work**: Fix null reference bug on current branch
2. **Commit**: git-commit -> Filter coverage reports -> `fix(api): handle null user response`
3. **Complete**: git-finish -> Create PR -> Link to issue #123
4. **Result**: PR created with descriptive commit, ready for review

### Parallel Features
1. **Setup A**: git-worktrees -> `.worktrees/feature-a`
2. **Setup B**: git-worktrees -> `.worktrees/feature-b`
3. **Work**: Switch between terminals, code both features
4. **Commit A**: cd feature-a -> git-commit -> `feat(search): add filters`
5. **Commit B**: cd feature-b -> git-commit -> `feat(export): add CSV export`
6. **Complete A**: git-finish -> Merge A
7. **Complete B**: git-finish -> Merge B
8. **Result**: Two features developed in parallel, integrated sequentially

## Cross References

- [[rules]] - Branch cleanup and merge rules
- [[success-criteria]] - Pre-merge and pre-PR quality gates
- [[how-it-works]] - Phase 3 in the lifecycle
- [[github-integration]] - Remote PR and issue operations
