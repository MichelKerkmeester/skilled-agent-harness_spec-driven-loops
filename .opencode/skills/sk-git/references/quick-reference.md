---
title: Git Workflows - Quick Reference
description: One-page cheat sheet for git-worktrees, git-commit, and git-finish workflows.
trigger_phrases:
  - "git workflow cheat sheet"
  - "worktree commit finish phases"
  - "skill selection flowchart"
  - "branch strategy table"
  - "essential git commands"
importance_tier: normal
contextType: general
version: 1.1.0.12
---

# Git Workflows - Quick Reference

One-page cheat sheet for git-worktrees, git-commit, and git-finish workflows.

---

## 1. OVERVIEW

This quick reference provides a one-page cheat sheet for the three git workflow phases: worktrees (workspace setup), commit (change tracking), and finish (integration).

---

## 2. SKILL SELECTION FLOWCHART

```
┌─────────────────────────────────────┐
│ What are you doing?                 │
└─────────────┬───────────────────────┘
              │
      ┌───────┴───────┐
      │               │
  Starting        Ready to        Tests pass,
  new work?       commit?         ready to
                                  integrate?
      │               │               │
      ▼               ▼               ▼
git-worktrees   git-commit      git-finish
```

---

## 3. PHASE 1: WORKTREE SETUP (GIT-WORKTREES)

### Quick Commands

```bash
# Named feature worktree (recommended): NNNN = next 4-digit global counter
git worktree add -b wt/0001-<name> .worktrees/0001-<name> main

# Long-running feature worktree (needs PR): same scheme, next number
git worktree add -b wt/0002-<name> .worktrees/0002-<name> main

# Experimental (no branch → no number; throwaway dir)
git worktree add --detach .worktrees/0003-<name> main

# List all worktrees
git worktree list

# Remove worktree
git worktree remove .worktrees/0001-<name>
```

### 7-Step Workflow

1. **Gather inputs** - Task description, branch strategy
2. **Select directory** - Existing → AGENTS.md → Ask
3. **Verify safety** - Check `.gitignore` for project-local dirs
4. **Create worktree** - Strategy-dependent command
5. **Setup project** - Auto-detect and install dependencies
6. **Verify baseline** - Run tests (must pass)
7. **Report status** - Location, branch, tests

### Branch Strategies

| Strategy | When to Use | Example |
|----------|-------------|---------|
| `wt/{NNNN}-{name}` (merge back fast) | 80% of work, merge back immediately | `wt/0001-quick-fix` |
| `wt/{NNNN}-{name}` (long-running) | Long-running, needs PR | `wt/0002-user-auth` |
| Detached HEAD | Experiments, throwaway | No branch created (no number) |

---

## 4. PHASE 2: COMMIT WORK (GIT-COMMIT)

### Quick Commands

```bash
# Check status
git status --short

# Stage specific files (not git add .)
git add <specific-files>

# View staged changes
git diff --cached

# Commit with Conventional Commits
git commit -m "type(scope): description"

# Commit with body
git commit -m "Subject" -m "Body explaining why"
```

### 7-Step Workflow

1. **Analyze files** - Categorize changes
2. **Filter artifacts** - Exclude internal files (don't add to .gitignore)
3. **Identify patterns** - Single commit vs. multiple
4. **Determine strategy** - Atomic commits
5. **Write message** - Conventional Commits format
6. **Verify readiness** - Final checklist
7. **Scoped-staging discipline** - Guard against sweeping unrelated WIP into your commit on a dirty tree

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`, `build`, `merge`, `release`, `revert`

**Rules** (canonical: [`../SKILL.md`](../SKILL.md) "Commit Message Logic"):
- Imperative mood ("add" not "added")
- Target 80 characters, hard maximum 100
- Type and scope both required; scope is a stable subsystem name, never numeric
- Lowercase after colon
- No period at end

**Example**:
```
feat(auth): add OAuth2 login support

Implements OAuth2 authentication flow to replace basic auth.
Improves security and enables SSO integration.
```

---

## 5. PHASE 3: COMPLETE WORK (GIT-FINISH)

### Quick Commands

```bash
# Merge locally
git checkout main && git pull && git merge <branch>

# Create PR
git push -u origin <branch>
gh pr create --title "..." --body "..."

# Discard work
git checkout main && git branch -D <branch>

# Cleanup worktree
git worktree remove .worktrees/{NNNN}-<name>
```

### 5-Step Workflow

1. **Verify tests** - Must pass (blocking gate)
2. **Determine base** - Usually `main` or `master`
3. **Present options** - 4 structured choices
4. **Execute choice** - Merge, PR, keep, or discard
5. **Cleanup worktree** - Remove for options 1, 2, 4

### 4 Options

```
1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work
```

**When to use**:
- Option 1: Solo project, simple change, temp branches
- Option 2: Team project, needs review, feature branches
- Option 3: Work in progress, need to switch contexts
- Option 4: Failed experiments, throwaway work

---

## 6. COMMON WORKFLOWS

### Workflow A: Quick Fix (Main-Focused)

```bash
# 1. Create named feature worktree (0001 = next global counter)
git worktree add -b wt/0001-fix .worktrees/0001-fix main

# 2. Make changes
cd .worktrees/0001-fix
# ... fix code ...

# 3. Commit
git add <files>
git commit -m "fix(scope): description"

# 4. Test
npm test

# 5. Merge
cd ../.. && git checkout main && git merge wt/0001-fix

# 6. Cleanup
git branch -d wt/0001-fix
git worktree remove .worktrees/0001-fix
```

### Workflow B: Feature with PR

```bash
# 1. Create named feature worktree (0002 = next global counter)
git worktree add -b wt/0002-name .worktrees/0002-name main

# 2. Develop
cd .worktrees/0002-name
# ... implement feature ...

# 3. Commit
git add <files>
git commit -m "feat(scope): description"

# 4. Test
npm test

# 5. Create PR
git push -u origin wt/0002-name
gh pr create --title "feat(scope): ..." --body "..."

# 6. Cleanup worktree (keep branch)
cd ../.. && git worktree remove .worktrees/0002-name
```

### Workflow C: Experiment

```bash
# 1. Create detached HEAD worktree (no branch → no number)
git worktree add --detach .worktrees/0003-exp main

# 2. Experiment
cd .worktrees/0003-exp
# ... try approach ...

# 3a. Keep: Create a new named worktree and branch (0004 = next counter)
git worktree add -b wt/0004-name .worktrees/0004-name HEAD
cd ../0004-name
git add . && git commit -m "feat(scope): experimental approach"

# 3b. Discard: Remove worktree
cd ../.. && git worktree remove .worktrees/0003-exp
```

---

## 7. DECISION QUICK REFERENCE

| Scenario | Worktree Strategy | Commit Strategy | Finish Option |
|----------|-------------------|-----------------|---------------|
| Small fix | wt/{NNNN}-{name} | Single commit | Option 1 (Merge) |
| Feature (solo) | wt/{NNNN}-{name} | Multiple commits | Option 1 (Merge) |
| Feature (team) | wt/{NNNN}-{name} | Multiple commits | Option 2 (PR) |
| Experiment | Detached HEAD | N/A or commit | Option 4 (Discard) |
| Refactor | wt/{NNNN}-{name} | Single/multiple | Option 1 or 2 |
| Bug fix | wt/{NNNN}-{name} | Single commit | Option 1 or 2 |

---

## 8. ESSENTIAL GIT COMMANDS

### Worktree
```bash
git worktree add <path> -b <branch>    # Create with branch
git worktree add --detach <path>       # Create detached
git worktree list                      # List all
git worktree remove <path>             # Remove
git worktree prune                     # Clean stale refs
```

### Commit
```bash
git status --short                     # Concise status
git add <files>                        # Stage specific
git diff --cached                      # View staged
git commit -m "msg"                    # Commit
git reset HEAD <file>                  # Unstage
```

### Branch Inspection & Cleanup
```bash
git branch                             # List local
git branch -a                          # List all
git checkout <branch>                  # Switch
git branch -d <branch>                 # Delete (safe)
git branch -D <branch>                 # Force delete
```

### Merge & Remote
```bash
git checkout main && git pull          # Update main
git merge <branch>                     # Merge
git push -u origin <branch>            # Push new branch
gh pr create                           # Create PR
```

---

## 9. RULES

### ✅ ALWAYS
- Run baseline tests to completion (don't skip or timeout)
- Filter artifacts from commits (don't add to .gitignore)
- Follow Conventional Commits format
- Run tests before integration (finish: blocking gate)
- Use `git add <files>` not `git add .`
- Cleanup worktrees after merge/PR/discard

### ❌ NEVER
- Skip `.gitignore` verification for project-local worktrees
- Commit internal artifacts or temp files
- Use vague commit messages ("fix stuff", "changes")
- Proceed with failing tests
- Force delete branches without confirmation
- Cleanup worktree when user chooses "keep as-is"

---

## 10. TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Worktree creation fails | Check `git worktree list`, remove stale, `git worktree prune` |
| Tests fail in new worktree | Ask user: investigate, proceed, or abort |
| Can't stage files | Use `git add <files>`, not `git add .` |
| Commit message too long | Move details to body, keep subject ≤80 chars (100 hard max) |
| Merge conflicts | `git status`, resolve manually, `git add`, `git commit` |
| PR creation fails | Check `gh auth status`, `gh auth login` |
| Worktree won't remove | Check for uncommitted changes, `git worktree unlock` |

---

## 11. FILE STRUCTURE REFERENCE

```
.worktrees/                 # Project-local worktrees (add to .gitignore)
  0001-feature-name/        # Individual worktree (NNNN-name)
  0002-quick-fix/
  0003-experiment/

~/.config/superpowers/      # Global worktrees location
  worktrees/
    project-name/
      0001-feature-name/
```

---

## 12. CHECKLISTS

### Pre-Worktree Creation
- [ ] Directory location determined
- [ ] `.gitignore` verification (if project-local)
- [ ] Branch strategy selected
- [ ] Ready to install dependencies

### Pre-Commit
- [ ] Files analyzed and categorized
- [ ] Artifacts filtered out
- [ ] Conventional Commits format
- [ ] Changes are atomic
- [ ] No sensitive information

### Pre-Integration (Finish)
- [ ] All tests pass
- [ ] Base branch determined
- [ ] Appropriate option selected
- [ ] Worktree cleanup planned

---

## 13. EXAMPLES

### Good Commit Messages

```
feat(auth): add OAuth2 login support
fix(api): handle null response in error handler
refactor(utils): extract validation to middleware
docs(api): update API reference with new endpoints
chore(deps): update axios to v1.6.0
```

### Bad Commit Messages

```
fix stuff                          # Too vague
TASK-123: implement feature        # Internal reference
added new feature                  # Past tense, no type
Update                             # No description
```

### Good PR Titles

```
feat(auth): add OAuth2 authentication system
fix(api): resolve memory leak in data processing
refactor(validation): restructure validation layer
```

---

## 14. GITHUB MCP QUICK REFERENCE

### Prerequisites
- PAT configured in `.utcp_config.json` with appropriate scopes

### Quick Commands

**Pull Requests**:
```javascript
// List open PRs
call_tool_chain(`github.github_list_pull_requests({ owner: 'o', repo: 'r', state: 'open' })`)

// Create PR
call_tool_chain(`github.github_create_pull_request({
  owner: 'o', repo: 'r', title: 'feat: add X', head: 'branch', base: 'main', body: 'Description'
})`)

// Merge PR
call_tool_chain(`github.github_merge_pull_request({ owner: 'o', repo: 'r', pull_number: 42 })`)
```

**Issues**:
```javascript
// Create issue
call_tool_chain(`github.github_create_issue({
  owner: 'o', repo: 'r', title: 'Bug: X fails', body: 'Steps to reproduce...'
})`)

// Search issues
call_tool_chain(`github.github_search_issues({ q: 'repo:o/r is:issue is:open label:bug' })`)
```

**CI/CD**:
```javascript
// Check workflow status
call_tool_chain(`github.github_list_workflow_runs({ owner: 'o', repo: 'r', branch: 'main' })`)

// Get job logs
call_tool_chain(`github.github_get_job_logs({ owner: 'o', repo: 'r', job_id: 123 })`)
```

### Decision Guide

| Task | Tool |
|------|------|
| commit, diff, status | Local `git` |
| Create/manage PRs | `gh` CLI or GitHub MCP |
| PR reviews | GitHub MCP |
| Issue tracking | GitHub MCP |
| CI/CD monitoring | GitHub MCP |

---

## 15. RELATED RESOURCES

### Reference Files
- [worktree-workflows.md](./worktree-workflows.md) - Complete git-worktrees workflow documentation
- [commit-workflows.md](./commit-workflows.md) - Complete git-commit workflow documentation
- [finish-workflows.md](./finish-workflows.md) - Complete git-finish workflow documentation
- [shared-patterns.md](./shared-patterns.md) - Common patterns and commands across workflows

### External Resources
- [Conventional Commits](https://www.conventionalcommits.org/) - Standard commit message format
- [Git Worktree Docs](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [GitHub CLI Manual](https://cli.github.com/manual/) - Complete gh CLI reference
