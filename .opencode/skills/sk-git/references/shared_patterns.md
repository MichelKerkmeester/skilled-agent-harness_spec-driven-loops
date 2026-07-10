---
title: Shared Patterns - Cross-Workflow Reference
description: Common patterns, commands, and conventions used across all git workflows.
trigger_phrases:
  - "branch naming conventions"
  - "rename-heavy merge verification"
  - "detached head recovery"
  - "undo last commit"
  - "stale worktree references"
  - "failed push rejected remote"
importance_tier: normal
contextType: general
version: 1.1.0.12
---

# Shared Patterns - Cross-Workflow Reference

Common patterns, commands, and conventions used across all git workflows.

---

## 1. OVERVIEW

This reference consolidates common patterns, commands, and conventions used across all git workflows (worktrees, commits, and finish). Use this as a quick lookup for branch naming, git commands, Conventional Commits format, and error handling patterns.

---

## 2. BRANCH NAMING CONVENTIONS

### Named Feature Branches — Merge Back Fast

**Pattern**: `wt/{NNNN}-{name}` (directory `.worktrees/{NNNN}-{name}`)

`{NNNN}` is a 4-digit zero-padded global counter: `max(existing NNNN under .worktrees/) + 1`.

**Purpose**: Short-lived branches that merge back to main immediately

**Examples**:
```bash
wt/0001-modal-fix
wt/0002-auth-bug
wt/0003-quick-refactor
```

**Lifecycle**:
1. Create from main
2. Implement change
3. Commit work
4. Run tests
5. Merge back to main
6. Delete branch

**Best for**: 80% of development work

### Named Feature Branches — Long-Running Work

**Pattern**: `wt/{NNNN}-{name}` (same unified scheme; the next global number)

**Purpose**: Long-running features requiring PR review

**Examples**:
```bash
wt/0004-user-auth
wt/0005-payment-integration
wt/0006-dashboard-redesign
```

**Lifecycle**:
1. Create from main
2. Develop feature (multiple commits)
3. Run tests
4. Push and create PR
5. Code review
6. Merge via PR
7. Delete branch after merge

**Best for**: Major features, team collaboration

### Experimental Branches

**Pattern**: Detached HEAD (no branch → no number)

**Purpose**: Quick experiments without branch pollution

Detached experiments create no branch, so there is no counter to assign. The
directory may use the numbered `.worktrees/{NNNN}-{name}` form or a descriptive
throwaway dir.

**Command**:
```bash
git worktree add --detach .worktrees/0001-experiment main
```

**Lifecycle**:
1. Create detached HEAD worktree
2. Experiment with changes
3. If keeping: Create branch and commit
4. If discarding: Remove worktree
5. No branch cleanup needed (never created)

**Best for**: Throwaway work, proof-of-concepts

---

## 3. GIT COMMAND REFERENCE

### Worktree Operations

**List worktrees**:
```bash
git worktree list
```

**Create worktree with branch**:
```bash
git worktree add <path> -b <branch-name>
```

**Create worktree from existing branch**:
```bash
git worktree add <path> <existing-branch>
```

**Create detached HEAD worktree**:
```bash
git worktree add --detach <path> <commit>
```

**Remove worktree**:
```bash
git worktree remove <path>
```

**Prune stale worktree references**:
```bash
git worktree prune
```

### Commit Operations

**Check status**:
```bash
git status --short                 # Concise status
git status                         # Full status
```

**View changes**:
```bash
git diff                           # Unstaged changes
git diff --cached                  # Staged changes
git diff --name-only               # Changed file names only
```

**Stage files**:
```bash
git add <specific-files>           # Targeted staging (preferred)
git add src/ tests/                # Stage directories
git add -p                         # Interactive staging
```

**Unstage files**:
```bash
git reset HEAD <file>              # Unstage specific file
git reset HEAD .                   # Unstage all
```

**Commit**:
```bash
git commit -m "type(scope): description"
git commit -m "Subject" -m "Body"
git commit -v                      # Commit with diff in editor
```

**Amend last commit** (use sparingly):
```bash
git commit --amend                 # Modify last commit
git commit --amend --no-edit       # Keep message, add changes
```

### Branch Operations

**Policy note**: Never create new branches directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`. When a new branch is needed, create it through `git worktree add -b ...`.

**List branches**:
```bash
git branch                         # Local branches
git branch -a                      # All branches (local + remote)
git branch -r                      # Remote branches only
```

**Switch branches**:
```bash
git checkout <branch-name>
git switch <branch-name>           # Modern alternative
```

**Delete branch**:
```bash
git branch -d <branch-name>        # Safe delete (merged only)
git branch -D <branch-name>        # Force delete (any state)
```

**Rename branch**:
```bash
git branch -m <old-name> <new-name>
git branch -m <new-name>           # Rename current branch
```

### Merge & Integration Operations

**Merge branch**:
```bash
git checkout main
git pull                           # Update main first
git merge <feature-branch>
```

**Abort merge** (if conflicts):
```bash
git merge --abort
```

**Check merge base**:
```bash
git merge-base <branch1> <branch2>
```

### Remote Operations

**Push branch**:
```bash
git push -u origin <branch-name>   # First push (set upstream)
git push                           # Subsequent pushes
```

**Pull changes**:
```bash
git pull                           # Fetch + merge
git pull --rebase                  # Fetch + rebase
```

**Check remotes**:
```bash
git remote -v                      # List remotes
git remote show origin             # Show remote details
```

---

## 4. CONVENTIONAL COMMITS FORMAT

### Structure

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(api): handle null response` |
| `refactor` | Code restructuring | `refactor(validation): extract validation logic` |
| `docs` | Documentation | `docs(api): update API reference` |
| `style` | Formatting changes | `style(lint): fix indentation` |
| `test` | Add/update tests | `test(user-service): add user service tests` |
| `chore` | Build, deps, tooling | `chore(deps): update dependencies` |
| `perf` | Performance improvement | `perf(query): optimize query caching` |
| `ci` | CI/CD changes | `ci(deploy): add deployment workflow` |
| `build` | Build system or external dependencies | `build(deps): bump webpack to v5` |
| `merge` | Merge commits (usually Git-generated) | `merge(main): integrate feature branch` |
| `release` | Version bump / release cut | `release(core): tag v1.2.0` |
| `revert` | Revert a previous commit | `revert(api): revert null-response fix` |

### Scope (Required)

Type and scope are both required — see [`../SKILL.md`](../SKILL.md) "Commit Message Logic" for the canonical contract. Scope names a stable, lowercase kebab-case subsystem, never a packet, phase, or numeric identifier. Common areas in this repo:
- `auth` - Authentication
- `api` - API layer
- `ui` - User interface
- `db` - Database
- `config` - Configuration

### Description

- Use imperative mood: "add" not "added"
- Lowercase after colon
- No period at end
- Target 80 characters, hard maximum 100 (canonical: [`../SKILL.md`](../SKILL.md) "Commit Message Logic")
- Specific and descriptive

### Body (Optional)

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (Optional)

**Breaking changes**:
```
BREAKING CHANGE: authentication now requires API key
```

**Issue references**:
```
Fixes #123
Closes #456
Related to #789
```

### Complete Examples

**Feature with body**:
```
feat(auth): add OAuth2 login support

Implements OAuth2 authentication flow to replace basic auth.
Improves security and enables SSO integration.
```

**Bug fix with issue**:
```
fix(api): handle null response in error handler

Prevents crash when error response body is null.

Fixes #234
```

**Breaking change**:
```
feat(api): change response format to JSON

Standardizes all API responses to use JSON format.

BREAKING CHANGE: XML response format no longer supported.
Clients must update to handle JSON responses.
```

---

## 5. COMMON GIT PATTERNS

### Pattern 1: Quick Fix Workflow

```bash
# 1. Create named feature worktree (0001 = next global counter)
git worktree add -b wt/0001-quick-fix .worktrees/0001-quick-fix main

# 2. Navigate and fix
cd .worktrees/0001-quick-fix
# ... make changes ...

# 3. Commit
git add <files>
git commit -m "fix(scope): description"

# 4. Run tests
npm test  # or appropriate test command

# 5. Merge back to main
cd ../..
git checkout main
git merge wt/0001-quick-fix

# 6. Cleanup
git branch -d wt/0001-quick-fix
git worktree remove .worktrees/0001-quick-fix
```

### Pattern 2: Feature Branch with PR

```bash
# 1. Create named feature worktree (0002 = next global counter)
git worktree add -b wt/0002-new-feature .worktrees/0002-new-feature main

# 2. Navigate and develop
cd .worktrees/0002-new-feature
# ... develop feature (multiple commits) ...

# 3. Commit changes
git add <files>
git commit -m "feat(scope): description"

# 4. Run tests
npm test

# 5. Push and create PR
git push -u origin wt/0002-new-feature
gh pr create --title "feat(scope): description" --body "..."

# 6. Cleanup worktree (keep branch for PR)
cd ../..
git worktree remove .worktrees/0002-new-feature
```

### Pattern 3: Experimental Work

```bash
# 1. Create detached HEAD worktree (no branch → no number)
git worktree add --detach .worktrees/0003-experiment main

# 2. Experiment
cd .worktrees/0003-experiment
# ... try different approach ...

# 3a. If keeping: Create a new named worktree and branch (0004 = next counter)
git worktree add -b wt/0004-new-approach .worktrees/0004-new-approach HEAD
cd ../0004-new-approach
git add .
git commit -m "feat(scope): experimental approach"

# 3b. If discarding: Just remove
cd ../..
git worktree remove .worktrees/0003-experiment
```

---

## 6. ERROR HANDLING PATTERNS

### Pattern: Tests Fail After Changes

```bash
# Don't proceed with merge/PR
# Instead:

# 1. Review failures
npm test

# 2. Fix issues
# ... address test failures ...

# 3. Commit fixes
git add <files>
git commit -m "fix(scope): address test failures"

# 4. Re-run tests
npm test

# 5. Only then proceed with integration
```

### Pattern: Merge Conflicts

```bash
# 1. Attempt merge
git merge wt/0001-feature
# CONFLICT detected

# 2. View conflicts
git status
git diff --name-only --diff-filter=U

# 3. Resolve conflicts manually
# Edit conflicted files

# 4. Mark as resolved
git add <resolved-files>

# 5. Complete merge
git commit

# 6. Verify with tests
npm test
```

### Pattern: Undo Last Commit (Not Pushed)

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Undo commit and changes (DANGEROUS)
git reset --hard HEAD~1

# Amend commit instead
git commit --amend
```

### Pattern: Detached HEAD Recovery

**Symptom**: `You are in 'detached HEAD' state`

```bash
# 1. Check current state
git status
# HEAD detached at abc1234

# 2. If you have uncommitted changes you want to keep:
git stash

# 3. Create a recovery worktree and branch to save work
git worktree add ../recovery -b recovery-branch HEAD

# 4. Restore stashed changes in the recovery worktree (if any)
cd ../recovery
git stash pop

# 5. Return to main branch
cd -
git checkout main

# 6. Merge recovery branch if needed
git merge recovery-branch
git branch -d recovery-branch
```

### Pattern: Worktree Branch Already Exists

**Symptom**: `fatal: 'wt/0007-feature' is already checked out`

```bash
# 1. List existing worktrees
git worktree list

# 2. Option A: Use the next global number for a fresh worktree
git worktree add -b wt/0008-feature .worktrees/0008-feature main

# 3. Option B: Remove existing worktree first, then reuse the name
git worktree remove .worktrees/0007-feature
git branch -d wt/0007-feature
git worktree add -b wt/0007-feature .worktrees/0007-feature main

# 4. Option C: Continue work in existing worktree
cd .worktrees/0007-feature  # Navigate to existing
```

### Pattern: Failed Push (Remote Rejected)

**Symptom**: `! [rejected] main -> main (non-fast-forward)`

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Option A: Rebase (cleaner history)
git rebase origin/main
# Resolve any conflicts, then:
git push

# 3. Option B: Merge (preserves history)
git merge origin/main
# Resolve any conflicts, then:
git push

# NEVER: git push --force (on shared branches)
# Only use --force on personal feature branches
```

### Pattern: Stale Worktree References

**Symptom**: `fatal: '.worktrees/old' is a missing linked worktree`

```bash
# 1. List worktrees (shows missing ones)
git worktree list

# 2. Prune stale references
git worktree prune

# 3. Verify cleanup
git worktree list
```

---

## 7. QUALITY CHECK PATTERNS

### Pre-Commit Checklist

```markdown
□ Files analyzed and categorized
□ Artifacts filtered out
□ Changes are atomic (one logical unit)
□ Commit message follows Conventional Commits
□ No sensitive information included
□ Tests pass
```

### Pre-Merge Checklist

```markdown
□ All tests pass
□ Base branch is up to date (git pull)
□ Feature branch rebased if needed
□ No merge conflicts
□ Commit history is clean
□ Rename-heavy branch? Run the §10 verification (disjointness, rename limits, tree-not-ls, R-status)
```

### Pre-PR Checklist

```markdown
□ All tests pass
□ Branch pushed to remote
□ PR title follows conventions
□ PR body includes summary
□ Related issues linked
□ Ready for review
```

---

## 8. FILE TYPE PATTERNS

### Files to Always Commit

- Source code (*.js, *.ts, *.py, *.java, etc.)
- Tests (*.test.*, *.spec.*, test_*.py)
- Configuration (package.json, requirements.txt, Cargo.toml)
- Documentation (README.md, API.md)
- Build config (.github/workflows/, Dockerfile)

### Files to Never Commit (Add to .gitignore)

- Dependencies (node_modules/, vendor/, venv/)
- Build artifacts (dist/, build/, target/)
- Environment files (.env, .env.local)
- OS files (.DS_Store, Thumbs.db)
- IDE files (.vscode/, .idea/)
- Logs (*.log, logs/)

### Files to Exclude from Commits (Don't Add to .gitignore)

- Task lists (TASK_*.md, TODO_*.md)
- Personal notes (notes.txt, scratch.md)
- Coverage reports (coverage/, htmlcov/)
- Debug files (debug_*.txt)
- Temporary analysis (analysis.md)

**Why not .gitignore?**: These are project-related files useful during development but not part of version history.

---

## 9. GITHUB MCP PATTERNS

GitHub MCP provides programmatic access to GitHub's remote operations via Code Mode. Use these patterns for remote collaboration tasks.

### Prerequisites

- **PAT configured** in `.utcp_config.json` with appropriate scopes

### Access Pattern

```typescript
call_tool_chain({
  code: `await github.github_{tool_name}({...})`
})
```

### Pattern 1: Issue Management

```typescript
// Create issue
call_tool_chain({
  code: `await github.github_create_issue({
    owner: 'owner',
    repo: 'repo',
    title: 'Bug: Login fails on Safari',
    body: '## Description\\nLogin button unresponsive on Safari 17.\\n\\n## Steps\\n1. Navigate to login\\n2. Click login button',
    labels: ['bug', 'browser-compat']
  })`
})

// Get issue details
call_tool_chain({
  code: `await github.github_get_issue({
    owner: 'owner',
    repo: 'repo',
    issue_number: 123
  })`
})

// Search issues
call_tool_chain({
  code: `await github.github_search_issues({
    q: 'repo:owner/repo is:issue is:open label:bug'
  })`
})

// Add comment to issue
call_tool_chain({
  code: `await github.github_add_issue_comment({
    owner: 'owner',
    repo: 'repo',
    issue_number: 123,
    body: 'Investigated - this is related to WebKit changes in Safari 17.'
  })`
})
```

### Pattern 2: Pull Request Review

```typescript
// List PRs needing review
call_tool_chain({
  code: `await github.github_list_pull_requests({
    owner: 'owner',
    repo: 'repo',
    state: 'open'
  })`
})

// Get PR details with diff
call_tool_chain({
  code: `await github.github_get_pull_request({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`
})

// Create PR review
call_tool_chain({
  code: `await github.github_create_pull_request_review({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42,
    event: 'APPROVE',  // or 'REQUEST_CHANGES', 'COMMENT'
    body: 'LGTM! Clean implementation.'
  })`
})
```

### Pattern 3: CI/CD Status Check

> **Note**: CI/CD workflow status requires the `gh` CLI (not available in GitHub MCP):

```bash
# List recent workflow runs
gh run list --branch main --status completed

# Get specific workflow run
gh run view 12345

# Get job logs for debugging failures
gh run view 12345 --log
```

### Pattern 4: Remote File Access

```typescript
// Read file from remote repo (useful for checking configs)
call_tool_chain({
  code: `await github.github_get_file_contents({
    owner: 'owner',
    repo: 'repo',
    path: 'package.json',
    ref: 'main'  // branch, tag, or commit SHA
  })`
})

// Search repositories
call_tool_chain({
  code: `await github.github_search_repositories({
    q: 'oauth2 language:javascript stars:>100'
  })`
})
```

> **Note**: Branch listing requires the `gh` CLI:
> ```bash
> gh api repos/{owner}/{repo}/branches
> ```

### When to Use GitHub MCP vs Local Git

| Task | Use | Rationale |
|------|-----|-----------|
| Commit changes | Local `git` | Local operation, no network |
| Check status/diff | Local `git` | Faster, works offline |
| Create worktree | Local `git` | Filesystem operation |
| Create/manage PRs | GitHub MCP or `gh` | Remote collaboration |
| Review PRs | GitHub MCP | Rich review API |
| Track issues | GitHub MCP | Remote state management |
| Check CI status | GitHub MCP | Workflow monitoring |
| Read remote files | GitHub MCP | No need to clone |

---

## 10. RENAME-HEAVY MERGE VERIFICATION

Merging a branch that renamed thousands of files (e.g. a `git mv`-driven spec-folder reorg/renumber) into a main that has diverged is a distinct, high-risk operation. The tree can end up *correct* while the working directory and `ls` *look* broken, and git's own rename detection can silently give up at scale. This section codifies the verification the 026 wave-4 reorg needed (the scoped-staging half of that same incident lives in `commit_workflows.md` §3 Step 7).

### 10.1 Before the merge — prove disjointness

A rename-heavy merge is conflict-free only if the two sides changed *disjoint* sets of files since their merge base. Verify this BEFORE merging:

```bash
BASE=$(git merge-base main reorg-branch)

# Files each side changed since the common ancestor
git diff --name-only "$BASE" main          | sort -u > /tmp/changed-main.txt
git diff --name-only "$BASE" reorg-branch  | sort -u > /tmp/changed-reorg.txt

# Overlap MUST be empty for a clean, conflict-free merge
comm -12 /tmp/changed-main.txt /tmp/changed-reorg.txt
```
An empty `comm -12` (intersection) means the sides are disjoint and the merge should apply cleanly. Any lines printed are files touched on both sides — expect conflicts there and resolve deliberately (a renamed-on-one-side, edited-on-other file is the classic rename/edit conflict).

### 10.2 Raise rename limits for large rename sets

Git's rename detection is capped. With thousands of renames it can exceed the default limit and fall back to treating renames as delete+add, producing spurious conflicts and a misleading diff. Raise the limits for the operation:

```bash
git -c merge.renameLimit=20000 -c diff.renameLimit=20000 merge reorg-branch
```
Watch the merge output for a `inexact rename detection was skipped due to too many files` / `you may want to set your ...renameLimit` warning — if you see it, the limit was too low; abort (`git merge --abort`) and re-run with a higher cap.

### 10.3 After the merge — verify the TREE, not just `ls`

Critical gotcha: `git mv` only moves *tracked* files. Any **gitignored** content (build outputs, `node_modules/`, local DBs, generated artifacts) sitting under an old folder is left physically in place. After the merge the commit tree is correct — the old folders have **0 tracked files** — yet `ls` shows BOTH old and new "double" folders because the ignored leftovers are still on disk. Do not trust `ls`; trust `git ls-files`.

```bash
# A truly-renamed-away old folder has ZERO tracked files:
git ls-files old/path/ | wc -l        # expect 0 → folder is gone as far as git is concerned

# The new location should hold the tracked files:
git ls-files new/path/ | wc -l        # expect the moved count

# Find old dirs that still exist on disk but are empty of tracked files
# (these are gitignored-leftover "ghost" folders — safe to delete from the working tree):
while IFS= read -r d; do
  [ -z "$(git ls-files "$d")" ] && echo "GHOST (0 tracked): $d"
done < <(find old-root -type d)
```
Ghost folders are a working-directory artifact only; they are NOT in the commit. Remove them from the working tree separately (`rm -rf <ghost>`), and confirm they are gitignored (so removal does not register as a deletion in `git status`).

### 10.4 Confirm renames landed as `R` status

A correct rename shows up as `R` (rename) — not as a paired `D` (delete) + `A`/`??` (add). Verify the merge commit recorded renames, not delete+add churn:

```bash
# Rename status in the merge result (-M enables rename detection in the diff)
git -c diff.renameLimit=20000 diff -M --name-status HEAD~1 HEAD | grep -E '^R' | wc -l

# Sanity: there should be (near) zero deletes paired with adds of the same content
git -c diff.renameLimit=20000 diff -M --name-status HEAD~1 HEAD | grep -E '^[DA]'
```
If renames show as `D`+`A` instead of `R`, rename detection was under-resourced (re-check §10.2) — the history is harder to follow but the tree content is still correct.

### 10.5 Rename-heavy merge checklist

```markdown
□ merge-base computed; comm -12 of each side's changed files is EMPTY (disjoint)  [§10.1]
□ merge run with raised merge.renameLimit / diff.renameLimit; no "rename detection skipped" warning  [§10.2]
□ git ls-files <old> == 0 for every renamed-away folder (not `ls`)  [§10.3]
□ gitignored ghost folders identified and cleaned from working tree (not in commit)  [§10.3]
□ renames recorded as R status, not D+A churn  [§10.4]
□ scoped-staging discipline applied if the tree held unrelated WIP  [commit_workflows.md §3 Step 7]
```

---

## 11. RELATED RESOURCES

### Reference Files
- [worktree_workflows.md](./worktree_workflows.md) - Complete git-worktrees workflow documentation
- [commit_workflows.md](./commit_workflows.md) - Complete git-commit workflow documentation (§3 Step 7: scoped-staging discipline)
- [finish_workflows.md](./finish_workflows.md) - Complete git-finish workflow documentation
- [quick_reference.md](./quick_reference.md) - One-page cheat sheet for all git workflows

### External Resources
- [Git Documentation](https://git-scm.com/doc) - Official git documentation home
- [Conventional Commits Specification](https://www.conventionalcommits.org/) - Standard commit message format
- [GitHub CLI Manual](https://cli.github.com/manual/) - Complete gh CLI reference
- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [Semantic Versioning](https://semver.org/) - Version numbering based on changes
