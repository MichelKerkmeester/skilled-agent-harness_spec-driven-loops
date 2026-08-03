---
title: Worktree Creation Checklist
description: Step-by-step checklist for creating git worktrees safely and reliably.
trigger_phrases:
  - "worktree creation checklist"
  - "gitignore safety verification"
  - "baseline test verification"
  - "compute global worktree number"
  - "worktree status report"
importance_tier: normal
contextType: implementation
version: 1.1.0.10
---

# Worktree Creation Checklist - Branch Isolation Setup

Step-by-step checklist for safe and reliable git worktree creation.

---

## 1. OVERVIEW

### Purpose

This checklist ensures git worktrees are created safely with proper .gitignore configuration, dependency installation, and baseline test verification. Use it when setting up isolated development environments.

### Usage

1. Complete the pre-creation checklist (gather info, select directory, verify safety)
2. Follow the creation steps for your worktree strategy
3. Run post-creation verification
4. Report status to user using the template

Any new branch must be created through the naming allocator, never by `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`.

> **Scope**: this checklist covers *named feature worktrees*, which use the numbered
> `{OWNER}/{NNNN}-{slug}` branch + `.worktrees/{NNNN}-{OWNER}-{slug}` directory convention. It does
> not cover the launch wrapper's ephemeral per-session worktrees (`work/{runtime}/{slug}`
> + `.worktrees/{runtime}-{slug}`), which are auto-allocated and auto-reaped, and are
> intentionally not numbered.

---

## 2. PRE-CREATION CHECKLIST

### Step 1: Gather Information

- [ ] **Task/feature description** - What will you work on?
- [ ] **Lifecycle decided** - fast-merge, long-running, or detached experiment?
- [ ] **Kebab `{slug}` chosen** (if a branch is needed) - short description for `{OWNER}/{NNNN}-{slug}`?

**Decision guide** (named feature worktrees all use the owner-first `{OWNER}/{NNNN}-{slug}` namespace):
- **Fast-merge**: 80% of work (merge back to main immediately)
- **Long-running**: features needing PR review across multiple days
- **Detached experiment**: throwaway work, no branch (so no number assigned)

### Step 2: Directory Selection

- [ ] **Check for existing directories**
  ```bash
  ls -d .worktrees 2>/dev/null
  ls -d worktrees 2>/dev/null
  ```

- [ ] **Check AGENTS.md for preferences**
  ```bash
  grep -i "worktree.*directory" AGENTS.md 2>/dev/null
  ```

- [ ] **Decide on location**:
  - Project-local: `.worktrees/` (recommended)
  - Project-local: `worktrees/`
  - Global: `~/.config/superpowers/worktrees/<project>/`

**Priority**: Existing directory > AGENTS.md preference > Ask user

### Step 3: Safety Verification

**For project-local directories only** (`.worktrees/` or `worktrees/`):

- [ ] **Check .gitignore status**
  ```bash
  git check-ignore -n .worktrees 2>/dev/null || \
  git check-ignore -n worktrees 2>/dev/null || \
  echo "NOT_IGNORED"
  ```

- [ ] **If NOT ignored, add to .gitignore**
  ```bash
  echo ".worktrees/" >> .gitignore
  # OR
  echo "worktrees/" >> .gitignore
  ```

- [ ] **Commit .gitignore update**
  ```bash
  git add .gitignore
  git commit -m "chore: ignore worktree directories"
  ```

**For global directory**: Skip safety verification (outside project)

**Why this matters**: Prevents accidentally committing worktree contents to git.

---

## 3. CREATION CHECKLIST

### Step 4: Create Worktree

Choose a lifecycle, then let the allocator reserve the global number. Named branches use
`{OWNER}/{NNNN}-{slug}` — only how the branch merges differs between fast-merge and long-running.

**Option A: Fast-merge** (default) — named branch off main
- [ ] Create worktree
  ```bash
  bash .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git <slug> main
  ```

**Option B: Long-running** — same owner-first branch, kept for PR review
- [ ] Create worktree
  ```bash
  bash .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git <slug> main
  ```

**Option C: Detached experiment** — no branch, allocator-managed directory
- [ ] Create detached HEAD worktree
  ```bash
  bash .opencode/skills/sk-git/scripts/worktree-naming.sh create-detached <slug> main
  ```

- [ ] **Navigate to worktree**
  ```bash
  cd ".worktrees/<NNNN>-sk-git-<slug>"   # (or .worktrees/<NNNN>-detached-<slug>)
  ```

- [ ] **Verify creation**
  ```bash
  git worktree list
  git status
  ```

### Step 5: Project Setup

Auto-detect project type and install dependencies:

**Node.js Projects**:
- [ ] Detect package manager
  ```bash
  # Check for lockfiles
  ls -la | grep -E "yarn.lock|pnpm-lock.yaml|bun.lockb|package-lock.json"
  ```

- [ ] Install dependencies
  ```bash
  # If yarn.lock exists
  yarn install

  # If pnpm-lock.yaml exists
  pnpm install

  # If bun.lockb exists
  bun install

  # Otherwise
  npm install
  ```

**Rust Projects**:
- [ ] Build project
  ```bash
  cargo build
  ```

**Python Projects**:
- [ ] Install dependencies
  ```bash
  # If requirements.txt exists
  pip install -r requirements.txt

  # If pyproject.toml exists
  poetry install
  ```

**Go Projects**:
- [ ] Download dependencies
  ```bash
  go mod download
  ```

**Cannot detect project type**:
- [ ] Ask user for setup command
- [ ] Document in AGENTS.md for future use

### Step 6: Baseline Verification

Run tests to ensure worktree starts in known-good state:

**Node.js**:
- [ ] Run tests
  ```bash
  npm test
  ```

**Rust**:
- [ ] Run tests
  ```bash
  cargo test
  ```

**Python**:
- [ ] Run tests
  ```bash
  pytest
  # OR
  python -m pytest
  ```

**Go**:
- [ ] Run tests
  ```bash
  go test ./...
  ```

**Test Results**:
- [ ] **All tests pass** → Continue
- [ ] **Tests fail** → Ask user:
  - Investigate now?
  - Proceed anyway? (document baseline is broken)
  - Abort?

**Fast mode** (for large repos):
- [ ] User explicitly requested fast mode?
- [ ] Confirmed with user before skipping tests?

---

## 4. POST-CREATION CHECKLIST

### Step 7: Final Verification

- [ ] **Worktree path confirmed**
  ```bash
  pwd
  # Should be in .worktrees/<name>
  ```

- [ ] **Branch verified**
  ```bash
  git branch --show-current
  # Should show correct branch name
  ```

- [ ] **Tests passing** (or failure documented)

- [ ] **Dependencies installed successfully**

- [ ] **Ready to start work**

---

## 5. STATUS REPORT TEMPLATE

Provide this information to user:

```
✓ Worktree ready at <full-path>
✓ Branch: <branch-name> (<strategy>)
✓ Tests passing (<N> tests, 0 failures)
✓ Ready to implement <feature-name>
```

Example:
```
✓ Worktree ready at /Users/user/project/.worktrees/0002-sk-git-user-auth
✓ Branch: sk-git/0002-user-auth (long-running)
✓ Tests passing (152 tests, 0 failures)
✓ Ready to implement user authentication
```

---

## 6. COMMON ISSUES CHECKLIST

### Issue: Worktree Creation Fails

- [ ] Check if directory already exists
  ```bash
  ls -d .worktrees/<name>
  ```

- [ ] Check if branch already in use
  ```bash
  git worktree list | grep <branch-name>
  ```

- [ ] Verify git repository
  ```bash
  git rev-parse --git-dir
  ```

- [ ] Check permissions
  ```bash
  ls -la .
  ```

**Solution**:
```bash
# Remove existing worktree if stale
git worktree remove ".worktrees/${n}-${name}"

# Prune stale references
git worktree prune

# Try again
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git <slug> main
```

### Issue: Tests Fail in New Worktree

- [ ] Review test output for specific failures
- [ ] Check if same tests fail in main worktree
- [ ] Verify all dependencies installed
- [ ] Check for environment-specific issues

**Actions**:
- [ ] Report failures to user
- [ ] Provide options: Investigate / Proceed anyway / Abort
- [ ] Document baseline if proceeding with failures

### Issue: Cannot Determine Project Type

- [ ] No package.json, Cargo.toml, requirements.txt, or go.mod found

**Actions**:
- [ ] Skip automated dependency install
- [ ] Ask user for setup command
- [ ] Document command in AGENTS.md:
  ```markdown
  ## Worktree Setup
  Run: <user-provided-command>
  ```

### Issue: Directory Not in .gitignore

- [ ] Verify with git check-ignore
  ```bash
  git check-ignore -n .worktrees
  ```

**Actions**:
- [ ] Add to .gitignore
  ```bash
  echo ".worktrees/" >> .gitignore
  ```

- [ ] Commit immediately
  ```bash
  git add .gitignore
  git commit -m "chore: ignore worktree directories"
  ```

- [ ] Proceed with worktree creation

---

## 7. QUICK REFERENCE COMMANDS

**List all worktrees**:
```bash
git worktree list
```

**Check worktree status**:
```bash
cd .worktrees/<name>
git status
```

**Remove worktree**:
```bash
git worktree remove .worktrees/<name>
```

**Prune stale references**:
```bash
git worktree prune
```

**Check current branch**:
```bash
git branch --show-current
```

**Verify .gitignore**:
```bash
git check-ignore -n .worktrees
```

---

## 8. SUCCESS CRITERIA

Worktree creation is successful when:

- ✅ Directory selected following priority system
- ✅ Safety verification passed (`.gitignore` check)
- ✅ Worktree created with appropriate worktree strategy
- ✅ Dependencies installed successfully
- ✅ Tests pass (baseline verified)
- ✅ User informed of location and status

**Quality gates**:
- Directory must be in `.gitignore` (if project-local)
- Tests must pass OR user explicitly approves proceeding with failures
- Full path and status reported to user

---

## 9. RELATED RESOURCES

- [worktree-workflows.md](../references/worktree-workflows.md) - Complete workflow details
- [shared-patterns.md](../references/shared-patterns.md) - Common git patterns
- [quick-reference.md](../references/quick-reference.md) - Command cheat sheet
