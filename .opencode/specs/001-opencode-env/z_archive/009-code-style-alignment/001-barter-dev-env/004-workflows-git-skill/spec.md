# workflows-git Skill for Barter Environment

## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 004-workflows-git-skill |
| **Parent** | 001-barter-dev-env |
| **Status** | Draft |
| **Created** | 2026-01-06 |
| **Level** | 3 (Complex) |

## Problem Statement

The Barter development environment needs a git workflow skill, but with **strict read-only enforcement**. Unlike the anobel.com environment where developers have full git access, Barter's Coder agent operates in a controlled environment where write operations to git must be prohibited to prevent accidental or unintended repository modifications.

### Current State
- Barter's Coder environment at `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/` lacks git workflow guidance
- No skill exists to help the agent understand git history, branches, or tags
- No guardrails exist to prevent destructive git operations

### Desired State
- A `workflows-git` skill that provides git **read-only** operations guidance
- Hard enforcement preventing any write operations (commits, pushes, branch creation)
- Consistent skill structure matching Barter's existing skills (mcp-narsil, workflows-code, etc.)

## Requirements

### From Dev Lead - STRICT READ-ONLY POLICY

**FORBIDDEN Operations (HARD BLOCK):**
- `git commit` - Creating commits
- `git push` - Pushing to remote
- `git branch -b` / `git checkout -b` - Creating branches
- `git tag` - Creating tags
- `git push --tags` - Pushing tags
- `git push --force` - Force pushing
- `git merge` - Merging branches
- `git rebase` - Rebasing
- `git reset` - Resetting HEAD
- `git stash` - Stashing changes
- `git cherry-pick` - Cherry-picking commits

**ALLOWED Operations (READ-ONLY):**
- `git status` - View working tree status
- `git log` - Read git history
- `git show` - Show commit details
- `git diff` - View differences
- `git branch` (list only) - View branches
- `git tag` (list only) - View tags
- `git fetch` - Fetch specific commits (no push)
- `git remote -v` - View remotes
- `git blame` - View file history
- `git shortlog` - Summarized log

### Functional Requirements

1. **FR-1**: Skill MUST block all write operations with clear error messaging
2. **FR-2**: Skill MUST provide guidance for read-only git operations
3. **FR-3**: Skill MUST integrate with skill_advisor.py for routing
4. **FR-4**: Skill MUST follow Barter skill structure conventions
5. **FR-5**: Skill MUST include quick reference for allowed commands

### Non-Functional Requirements

1. **NFR-1**: Clear documentation in SKILL.md
2. **NFR-2**: Consistent with Barter's existing skill patterns
3. **NFR-3**: Easy to maintain and update

## User Stories

### US-1: Read Git History
**As a** Barter Coder agent  
**I want to** read git history and commit details  
**So that** I can understand code evolution without modifying the repository

**Acceptance Criteria:**
- Can execute `git log`, `git show`, `git blame`
- Receives guidance on interpreting output
- Blocked from any write operations

### US-2: View Branch Information
**As a** Barter Coder agent  
**I want to** list and view branch information  
**So that** I can understand the repository structure

**Acceptance Criteria:**
- Can execute `git branch` (list mode)
- Can execute `git branch -a` and `git branch -r`
- Blocked from creating new branches

### US-3: Understand Differences
**As a** Barter Coder agent  
**I want to** view diffs between commits, branches, or files  
**So that** I can understand what changed

**Acceptance Criteria:**
- Can execute `git diff` with various flags
- Can compare commits, branches, tags
- Read-only access to diff output

## Success Criteria

| Criteria | Measurement |
|----------|-------------|
| All FORBIDDEN operations blocked | 100% coverage in SKILL.md rules |
| All ALLOWED operations documented | Quick reference with examples |
| Skill structure matches Barter pattern | Passes structure validation |
| Integration with skill_advisor.py | Routing works correctly |
| AGENTS.md updated | Skill listed in tool routing |

## Out of Scope

- Git worktree management (write operation)
- Commit workflow guidance (write operation)
- PR/merge workflow guidance (write operation)
- GitHub MCP integration for write operations

## Dependencies

- Existing Barter skill structure as template
- anobel.com workflows-git as reference (for read-only portions)
- skill_advisor.py update required

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent bypasses skill and runs git directly | High | Document in AGENTS.md rules section |
| Incomplete forbidden list | High | Comprehensive testing of edge cases |
| Confusion with anobel.com version | Medium | Clear naming and documentation |

## References

- anobel.com workflows-git: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/workflows-git/`
- Barter skill structure: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/`
