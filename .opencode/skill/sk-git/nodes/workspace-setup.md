---
description: "Git worktree setup, workspace choice enforcement, branch management, and conflict-safe cross-skill handoff to implementation and validation workflows"
---
# Workspace Setup

Guidance on creating isolated workspaces using worktrees, branches, or the current branch.

## Workspace Choice Enforcement

**MANDATORY**: The AI must NEVER autonomously decide between creating a branch or worktree.

When git workspace triggers are detected (new feature, create branch, worktree, etc.), the **AI MUST ask** the user to explicitly choose:

| Option                        | Description                              | Best For                        |
| ----------------------------- | ---------------------------------------- | ------------------------------- |
| **A) Create a new branch**    | Standard branch on current repo          | Quick fixes, small changes      |
| **B) Create a git worktree**  | Isolated workspace in separate directory | Parallel work, complex features |
| **C) Work on current branch** | No new branch created                    | Trivial changes, exploration    |

## AI Behavior Requirements

1. **ASK** user for workspace choice before proceeding with git work
2. **WAIT** for explicit user selection (A/B/C)
3. **NEVER** assume which workspace strategy the user wants
4. **RESPECT** the user's choice throughout the workflow
5. If user has already answered this session, reuse their preference

## Override Phrases

Power users can state preference explicitly:
- `"use branch"` / `"create branch"` -> Branch selected
- `"use worktree"` / `"in a worktree"` -> Worktree selected
- `"current branch"` / `"on this branch"` -> Current branch selected

## Session Persistence

Once user chooses, reuse their preference for the session unless:
- User explicitly requests a different strategy
- User starts a new conversation

## Worktree Workflow

For worktree creation, follow the 7-step workflow in [worktree_workflows.md](../references/worktree_workflows.md).

Key outcomes:
- Worktree created in correct directory (`.worktrees/` or user-specified)
- Branch naming follows convention (`type/short-description`)
- Working directory is clean and isolated

## Cross References

- [[how-it-works]] - Phase 1 in the lifecycle
- [[rules]] - Branch naming and worktree cleanup rules
- [[work-completion]] - Worktree cleanup after merge
- [Web Implementation Workflow](../../sk-code--web/nodes/implementation-workflow.md) - Handoff from workspace setup to feature implementation
- [Validation Workflow](../../system-spec-kit/nodes/validation-workflow.md) - Completion and quality gate before merge
