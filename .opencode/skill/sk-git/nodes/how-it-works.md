---
description: "Core git development lifecycle: workspace setup, commit, and integration phases"
---
# How It Works

The git development lifecycle flows through three phases, each handled by a specialized sub-skill.

## Git Development Lifecycle Map

**Phase 1: Workspace Setup** (Isolate your work)
- **git-worktrees** - Create isolated workspace with short-lived temp branches
- Prevents: Branch juggling, stash chaos, context switching
- Output: Clean workspace ready for focused development
- **See**: [worktree_workflows.md](../references/worktree_workflows.md)

**Phase 2: Work & Commit** (Make clean commits)
- **git-commit** - Analyze changes, filter artifacts, write Conventional Commits
- Prevents: Accidental artifact commits, unclear commit history
- Output: Professional commit history following conventions
- **See**: [commit_workflows.md](../references/commit_workflows.md)

**Phase 3: Complete & Integrate** (Finish the work)
- **git-finish** - Merge, create PR, or discard work (with tests gate)
- Prevents: Incomplete work merged, untested code integrated
- Output: Work successfully integrated or cleanly discarded
- **See**: [finish_workflows.md](../references/finish_workflows.md)

## Phase Transitions

- Setup -> Work: Worktree created, ready to code
- Work -> Complete: Changes committed, tests passing
- Complete -> Setup: Work integrated, start next task

## Skill Selection Decision Tree

### Workspace Setup (Phase 1)
- **Starting new feature/fix?** -> **git-worktrees**
  - Need isolated workspace for parallel work
  - Want clean separation from other branches
  - Avoid branch juggling and stash chaos
  - **See**: [worktree_workflows.md](../references/worktree_workflows.md) for complete 7-step workflow
- **Quick fix on current branch?** -> Skip to Phase 2 (commit directly)

### Work & Commit (Phase 2)
- **Ready to commit changes?** -> **git-commit**
  - Analyze what changed (filter artifacts)
  - Determine single vs. multiple commits
  - Write Conventional Commits messages
  - Stage only public-value files
  - **See**: [commit_workflows.md](../references/commit_workflows.md) for complete 6-step workflow
  - **Templates**: [commit_message_template.md](../assets/commit_message_template.md)
- **No changes yet?** -> Continue coding, return when ready

### Complete & Integrate (Phase 3)
- **Tests pass, ready to integrate?** -> **git-finish**
  - Choose: Merge locally, Create PR, Keep as-is, or Discard
  - Cleanup worktree (if used)
  - Verify final integration
  - **See**: [finish_workflows.md](../references/finish_workflows.md) for complete 5-step workflow
  - **Templates**: [pr_template.md](../assets/pr_template.md)
- **Tests failing?** -> Return to Phase 2 (fix and commit)

## Common Workflows

**Full Workflow** (new feature):
```
git-worktrees (create workspace) -> Code -> git-commit (commit changes) -> git-finish (integrate)
```

**Quick Fix** (current branch):
```
Code -> git-commit (commit fix) -> git-finish (integrate)
```

**Parallel Work** (multiple features):
```
git-worktrees (feature A) -> Code -> git-commit
git-worktrees (feature B) -> Code -> git-commit
git-finish (feature A) -> git-finish (feature B)
```

## Cross References

- [[workspace-setup]] - Detailed workspace isolation guidance
- [[commit-workflow]] - Commit creation details
- [[work-completion]] - PR and merge details
- [[when-to-use]] - When to invoke this skill
