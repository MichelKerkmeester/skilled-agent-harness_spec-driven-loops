---
title: Git Worktrees - Detailed Workflow Reference
description: Complete workflow documentation for creating isolated git workspaces with minimal branching.
trigger_phrases:
  - "numbered worktree branches"
  - "worktree naming convention"
  - "create a git worktree"
  - "global worktree counter"
  - "fast-merge worktree lifecycle"
  - "detached experiment worktree"
  - "ephemeral session worktrees"
importance_tier: important
contextType: implementation
version: 1.1.1.0
---

# Git Worktrees - Detailed Workflow Reference

Complete workflow documentation for creating isolated git workspaces with minimal branching.

---

## 1. OVERVIEW

Git worktrees create isolated working directories sharing the same repository database. Each worktree can have a different branch checked out, allowing parallel work without context switching.

**Core principle**: Systematic directory selection + safety verification = reliable isolation

---

## 2. WORKSPACE CHOICE ENFORCEMENT

**This workflow only applies when user has explicitly chosen "Create a git worktree" (Option A).**

The AI must enforce workspace choice manually by asking the user before proceeding.

The AI:
- **MUST ASK** user for workspace choice before executing any commands
- **MUST WAIT** for explicit user selection (A/B)
- **NEVER** autonomously decides between git worktree and current branch
- **NEVER** creates a new branch directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`
- Only proceeds with worktree creation after user selects Option A

If the user has not been prompted or selected a different option:
- Option B (Current branch) → Do NOT use this workflow, work on the existing branch

---

## 3. PROCESS OVERVIEW

1. Confirm the owner (a skill id, or `skilled` for cross-cutting work) and the kebab `{slug}`, then allocate `{NNNN}` via the naming allocator
2. Verify safety (`.gitignore` check for the `.worktrees/` home)
3. Create worktree with appropriate lifecycle strategy under the owner-first `{OWNER}/{NNNN}-{slug}` branch grammar
4. Run project setup (auto-detect and install dependencies)
5. Verify clean baseline (run tests)
6. Report location and status

**Branch namespace**: every named feature worktree uses the owner-first `{OWNER}/{NNNN}-{slug}` branch and the `.worktrees/{NNNN}-{OWNER}-{slug}` directory (see Naming Convention below). `{OWNER}` is a canonical skill id (the `name:` frontmatter of an `.opencode/skills/**/SKILL.md`) or the literal `skilled` for cross-cutting/system/release work. The lifecycle strategy below only changes *how the branch is managed after creation*, not how it is named.

**Lifecycle strategies**:
- **Fast-merge (default)**: short-lived branch that merges straight back to main after testing
- **Long-running**: same `{OWNER}/{NNNN}-{slug}` branch kept across multiple days for PR review
- **Detached experiment**: quick throwaway work with detached HEAD (no branch and no owner; the directory is still numbered by the allocator)

---

## 4. COMPLETE WORKFLOW

### Step 1: Gather User Inputs

**Purpose**: Collect the owner, task description, and lifecycle strategy

**Actions**:
- Confirm the `{OWNER}` — a canonical skill id (the `name:` frontmatter of an `.opencode/skills/**/SKILL.md`, e.g. `sk-git`) or the literal `skilled` for cross-cutting/system/release work — and derive a short kebab `{slug}` from the feature/task description
- Confirm lifecycle strategy (default: fast-merge for most work)
- The branch is always `{OWNER}/{NNNN}-{slug}` — only the lifecycle (how it merges) varies. `{NNNN}` is allocated in Step 4.

**Default Strategy**: fast-merge (short-lived `{OWNER}/{NNNN}-{slug}` branch merging back to main)

**When to use other strategies**:
- Long-running: features requiring PR review across multiple days (same `{OWNER}/{NNNN}-{slug}` branch)
- Detached experiment: quick experiments with no branch (no owner; the directory is still numbered)

**Validation**: `inputs_collected`

---

### Step 2: Directory Selection

**Purpose**: Confirm the worktree home (standardized on `.worktrees/`)

Named feature worktrees live under the repo-local, already-gitignored `.worktrees/`
home. Each worktree is a numbered subdirectory: `.worktrees/{NNNN}-{OWNER}-{slug}` (the
`{NNNN}` is allocated in Step 4). You normally do not need to ask — `.worktrees/` is
the default.

**Priority Order**:

1. **Confirm the `.worktrees/` home exists (create on first use)**
```bash
ls -d .worktrees 2>/dev/null || echo "NONE_YET"   # repo-local, hidden, gitignored
```
   `.worktrees/` is the standard. `git worktree add` will create it on first use.

2. **Check AGENTS.md only for an explicit override**
```bash
grep -i "worktree.*directory" AGENTS.md 2>/dev/null
```
   Honor an explicit override if one is recorded; otherwise use `.worktrees/`.

3. **Ask only if an override is ambiguous**
   `.worktrees/` is the default and needs no prompt. Ask only when AGENTS.md records a
   conflicting or unclear directory preference.

**Validation**: `directory_determined`

### Step 3: Safety Verification

**Purpose**: Ensure the `.worktrees/` home won't pollute the repository

**Critical Check**:
```bash
# Prefer git's matcher to verify ignore status. A match means the path is ignored.
git check-ignore -n .worktrees 2>/dev/null || echo "NOT_IGNORED"
```

`.worktrees/` is normally already gitignored in this repo. If the check reports
`NOT_IGNORED`:
1. Add `.worktrees/` to `.gitignore`
2. Ask for approval, then commit the change
3. Proceed with worktree creation

**Rationale**: Prevents accidentally committing worktree contents to the repository.

**Validation**: `safety_verified`

### Step 4: Create Worktree

**Purpose**: Create the isolated workspace under the owner-first `{OWNER}/{NNNN}-{slug}` grammar

#### Naming Convention

Named feature worktrees — the ones a human creates for a feature or a parallel task —
use one unified, owner-first grammar:

- **Branch**: `{OWNER}/{NNNN}-{slug}` — e.g. `sk-git/0001-add-oauth`. `{OWNER}` is a
  canonical skill id (the `name:` frontmatter of any `.opencode/skills/**/SKILL.md`,
  e.g. `sk-git`, `sk-code`) or the literal `skilled` for cross-cutting/system/release
  work. Owner-first grouping makes every feature-worktree branch legible by owning
  skill in a Git UI, instead of a flat pile. `{slug}` is a short kebab description.
- **Directory**: `<repo-root>/.worktrees/{NNNN}-{OWNER}-{slug}` — e.g.
  `.worktrees/0001-sk-git-add-oauth`. `.worktrees/` is the repo-local,
  already-gitignored worktree home.
- **`{NNNN}`** is a 4-digit zero-padded **clone-wide** counter. Git has no
  cross-prefix uniqueness, so the counter cannot be enforced per-owner — it is
  allocated by `.opencode/skills/sk-git/scripts/worktree-naming.sh`, which holds a
  lock in the shared common git dir and seeds its max from the stored high-water
  mark, every registered worktree basename, and all local + remote refs, so a
  partial scan can never reissue a live number. Never hand-compute `{NNNN}`.

> **Two distinct lanes.** This owner-first `{OWNER}/{NNNN}-{slug}` grammar is for *named
> feature worktrees a human creates*. It is separate from the per-session **ephemeral**
> worktrees allocated by the launch wrapper `.opencode/bin/worktree-session.sh`, which
> keep their own auto-managed namespace — branch `work/{runtime}/{slug}`, directory
> `.worktrees/{runtime}-{slug}` — and are auto-reaped by `worktree-reaper.sh` (which keys
> on the branch prefix `work/`, and only when the wrapper worktree is clean, merged into
> the live integration tip, and proven inactive by its session marker). Those ephemeral
> session worktrees are intentionally **not** numbered or owner-scoped; do not assign
> them an `{NNNN}` or an `{OWNER}`.
>
> **Legacy branches.** `wt/{NNNN}-{name}` branches created before this convention are
> permitted-but-non-conformant. Migrate them by renaming the branch (and its directory)
> into the owner-first form — never by rewriting history.

**Actions**:

1. **Create the worktree and allocate `{NNNN}` in one step** (covers both fast-merge
   and long-running — the creation command is identical; only downstream lifecycle
   handling differs):
```bash
.opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git add-oauth main
# -> sk-git/0001-add-oauth .worktrees/0001-sk-git-add-oauth   (branch, then dir)
```
   This locks the clone-wide counter, creates the branch + worktree with
   `git worktree add -b`, and prints `<branch> <dir>` on success. Omit the trailing
   base argument to branch off the current checked-out branch (or `HEAD` if
   detached) instead of an explicit `main`.

2. **Detached experiment** (no branch, so no `{OWNER}`/`{NNNN}` pairing — but the
   directory is still numbered):
```bash
.opencode/skills/sk-git/scripts/worktree-naming.sh create-detached experiment main
# -> .worktrees/0002-detached-experiment
```

3. **Navigate**:
```bash
cd "$path"   # the directory printed by create / create-detached
```

**Validation**: `worktree_created`

### Step 5: Project Setup

**Purpose**: Install dependencies and prepare environment

**Auto-Detection**:

```bash
# Node.js — respect lockfiles and package manager
if [ -f package.json ]; then
  if [ -f yarn.lock ]; then yarn install;
  elif [ -f pnpm-lock.yaml ]; then pnpm install;
  elif [ -f bun.lockb ]; then bun install;
  else npm install; fi
fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

**Monorepo Support**:

For monorepos, install dependencies at the correct scope instead of assuming repo root:

| Tool | Command | Notes |
|------|---------|-------|
| **npm workspaces** | `npm install` at root | Installs all workspace packages |
| **yarn workspaces** | `yarn install` at root | Uses `workspace:*` protocol |
| **pnpm workspaces** | `pnpm install` at root | Uses `workspace:` protocol |
| **Lerna** | `lerna bootstrap` or `npx lerna run install` | For older Lerna setups |
| **Nx** | `nx run-many --target=install` | Nx workspace management |

If working in a specific package within a monorepo:
```bash
# Navigate to package directory first
cd packages/my-package
npm install  # or yarn/pnpm
```

**Corepack Support**:

Corepack is Node.js's built-in package manager manager (available since Node 16.9+). Use it when `package.json` specifies a `packageManager` field:

```bash
# Enable corepack (one-time setup)
corepack enable

# Prepare specific version (if specified in package.json)
corepack prepare

# Example package.json with packageManager field:
# { "packageManager": "pnpm@8.15.0" }
```

**Why use corepack?** Ensures consistent package manager versions across the team, avoiding "works on my machine" issues.

**Validation**: `dependencies_installed`

### Step 6: Baseline Verification

**Purpose**: Ensure worktree starts in known-good state

**Actions**:
```bash
# Run project-appropriate tests
if [ -f package.json ]; then npm test; fi    # Node.js
if [ -f Cargo.toml ]; then cargo test; fi   # Rust
if [ -f pyproject.toml ] || [ -f requirements.txt ]; then pytest; fi  # Python
if [ -f go.mod ]; then go test ./...; fi    # Go
```

Fast mode (large repos):
- Optionally run a reduced subset or skip baseline tests when explicitly requested (e.g., set `FAST_BASELINE=true`). Confirm with the user before skipping tests.

**If tests fail**:
- Report failures with details
- Ask: "Tests are failing. Proceed anyway or investigate first?"

**If tests pass**:
- Continue to final report

**Validation**: `baseline_verified`

### Step 7: Final Report

**Purpose**: Communicate location and status

**Report Format**:
```text
✓ Worktree ready at <full-path>
✓ Branch: <branch-name> (<strategy>)
✓ Tests passing (<N> tests, 0 failures)
✓ Ready to implement <feature-name>
```

**Validation**: `worktree_complete`

---

## 5. BRANCH STRATEGY GUIDE

All named feature worktrees share the unified `{OWNER}/{NNNN}-{slug}` branch grammar and
the `.worktrees/{NNNN}-{OWNER}-{slug}` directory (see Step 4 → Naming Convention). The
strategies below differ only in how the branch is *managed after creation*, not in how
it is named.

### Fast-merge (Default - Recommended) ⭐

**When to use**:
- Most development work (default choice)
- Quick fixes or small changes
- Want to keep codebase on main
- Immediate merge-back after testing
- Avoid long-lived branches

**Example** (`{NNNN}` allocated in Step 4, e.g. `0001`):
```bash
.opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git fix-modal main
# -> sk-git/0001-fix-modal .worktrees/0001-sk-git-fix-modal
# ... make changes ...
cd ../.. && git checkout main && git merge sk-git/0001-fix-modal
git worktree remove .worktrees/0001-sk-git-fix-modal && git branch -d sk-git/0001-fix-modal
```

**Advantages**:
- Minimal branching, stays close to main
- Reduces merge conflicts
- Simpler mental model
- Branch cleanup automatic

**Best for**: 80% of development work

### Long-running

**When to use**:
- Long-running features (multiple days/weeks)
- Work that needs PR review before merging
- Complex features requiring multiple iterations
- When you want branch history preserved

**Example**:
```bash
.opencode/skills/sk-git/scripts/worktree-naming.sh create sk-code user-auth main
# -> sk-code/0002-user-auth .worktrees/0002-sk-code-user-auth
# ... develop feature ...
# Create PR, review, merge
```

**Best for**: Major features, team collaboration requiring review

### Detached experiment

**When to use**:
- Quick experiments
- Testing ideas without creating branches
- Throwaway work

**Example** (no branch and no owner, but the directory is still numbered by the allocator):
```bash
.opencode/skills/sk-git/scripts/worktree-naming.sh create-detached experiment main
# -> .worktrees/{NNNN}-detached-experiment
# ... experiment ...
# If keeping: promote to an owner-first {OWNER}/{NNNN}-{slug} branch and commit
# If discarding: just remove the worktree
```

**Advantage**: No branch pollution

---

## 6. DECISION MATRIX

| Situation | Directory | Branch / Lifecycle |
|-----------|-----------|--------------------|
| Named feature worktree | `.worktrees/{NNNN}-{OWNER}-{slug}` (allocate `{NNNN}` via the naming allocator) | `{OWNER}/{NNNN}-{slug}`, fast-merge by default |
| Long-running feature | `.worktrees/{NNNN}-{OWNER}-{slug}` | `{OWNER}/{NNNN}-{slug}`, kept for PR review |
| Quick throwaway experiment | `.worktrees/{NNNN}-detached-{slug}` (still numbered) | Detached HEAD (no branch, no owner) |
| Ephemeral per-session (launch wrapper) | `.worktrees/{runtime}-{slug}` (auto) | `work/{runtime}/{slug}` (auto-reaped, not numbered) |
| `.worktrees/` not in .gitignore | Add + commit immediately | — |
| Tests fail during baseline | Report + ask permission | — |
| No package.json/Cargo.toml | Skip dependency install | — |

---

## 7. COMMON MISTAKES

**Skipping .gitignore verification**:
- **Problem**: Worktree contents get tracked, pollute git status
- **Fix**: Always check .gitignore before creating project-local worktree

**Assuming directory location**:
- **Problem**: Creates inconsistency, violates project conventions
- **Fix**: Follow priority: existing > AGENTS.md > ask

**Proceeding with failing tests**:
- **Problem**: Can't distinguish new bugs from pre-existing issues
- **Fix**: Report failures, get explicit permission to proceed

**Hardcoding setup commands**:
- **Problem**: Breaks on projects using different tools
- **Fix**: Auto-detect from project files (package.json, etc.)

**Avoid checking out the same branch in multiple worktrees**:
- **Problem**: Git prevents checking out the same branch in multiple worktrees
- **Fix**: Use different branches or detached HEAD for parallel work on the same codebase state

---

## 8. EXAMPLE WORKFLOWS

### Example 1: Fast-merge (Default Workflow) ⭐

```text
User: "Quick fix for modal close button"
Agent: "I'm using the git-worktrees skill with the fast-merge strategy (default)."

[Step 1: Gather inputs - lifecycle: fast-merge (default), owner: sk-design, slug: modal-fix]
[Step 2: Directory selection - .worktrees/ home confirmed]
[Step 3: Safety verification - .gitignore contains .worktrees/]
[Step 4: Allocate + create worktree via the naming allocator]
> .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-design modal-fix main
  -> sk-design/0001-modal-fix .worktrees/0001-sk-design-modal-fix
[Step 5: Project setup]
> npm install
[Step 6: Baseline verification]
> npm test
✓ All tests passing

✓ Worktree ready at /Users/user/project/.worktrees/0001-sk-design-modal-fix
✓ Branch: sk-design/0001-modal-fix (fast-merge - merges back to main immediately)
✓ Tests passing
✓ Ready for quick fix

[After fix is committed and tested]
User: "Fix is done and tested"
Agent: "Merging back to main and cleaning up the branch..."
> git checkout main && git merge sk-design/0001-modal-fix
> git worktree remove .worktrees/0001-sk-design-modal-fix && git branch -d sk-design/0001-modal-fix
```

### Example 2: Long-running Work

```text
User: "I need to implement user authentication - this will take a few days"

Agent: "I'm using the git-worktrees skill with the long-running lifecycle."

[Step 1: Gather inputs - lifecycle: long-running, owner: sk-code, slug: user-auth]
[Step 2: Directory selection - .worktrees/ home confirmed]
[Step 3: Safety verification - .gitignore contains .worktrees/]
[Step 4: Allocate + create worktree via the naming allocator]
> .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-code user-auth main
  -> sk-code/0002-user-auth .worktrees/0002-sk-code-user-auth
[Step 5: Project setup - detected Node.js]
> npm install
[Step 6: Baseline verification]
> npm test
✓ 47 tests passing

✓ Worktree ready at /Users/user/project/.worktrees/0002-sk-code-user-auth
✓ Branch: sk-code/0002-user-auth (long-running)
✓ Tests passing (47 tests, 0 failures)
✓ Ready to implement user authentication
```

### Example 3: Detached experiment

```text
User: "Want to experiment with a new approach, not sure if I'll keep it"

Agent: "I'm using a detached HEAD worktree for experimentation (no branch, no owner)."

[Step 1: Gather inputs - lifecycle: detached experiment, slug: new-approach]
[Step 2: Directory selection - .worktrees/ home confirmed]
[Step 3: Safety verification - .gitignore contains .worktrees/]
[Step 4: Create worktree detached via the naming allocator]
> .opencode/skills/sk-git/scripts/worktree-naming.sh create-detached new-approach main
  -> .worktrees/0003-detached-new-approach
[Step 5: Project setup]
> npm install
[Step 6: Baseline verification]
> npm test

✓ Worktree ready at /Users/user/project/.worktrees/0003-detached-new-approach
✓ Branch: detached HEAD at main (no branch, no owner — the directory is still numbered)
✓ Tests passing
✓ Ready for experimentation

[If keeping the changes]
User: "This worked great, let's keep it"
Agent: "Promoting to an owner-first branch from this detached HEAD state..."
> sha=$(git -C .worktrees/0003-detached-new-approach rev-parse HEAD)
> .opencode/skills/sk-git/scripts/worktree-naming.sh create skilled new-approach-promoted "$sha"
  -> skilled/0004-new-approach-promoted .worktrees/0004-skilled-new-approach-promoted
> cd .worktrees/0004-skilled-new-approach-promoted
> git add . && git commit -m "feat: experimental approach"
```

---

## 8b. LARGE REORG IN A WORKTREE - CAVEATS

A fresh worktree is a clean checkout of tracked files only. For a large rename/reorg
(hundreds-to-thousands of `git mv`), this creates three sharp edges. Use the worktree
for **file/rename ops only**; defer all toolchain + DB work to `main` after merge. The
full step-ordered runbook lives in [large-reorg-playbook.md](./large-reorg-playbook.md).

### Caveat 1: Fresh worktrees lack gitignored build deps

`node_modules/`, `dist/`, `build/`, and similar are gitignored, so a new worktree does
NOT contain them. Toolchains that depend on them break **silently**:

- `validate.sh --strict`, `generate-context.js`, and other spec-kit generators import
  from `dist/` / `node_modules/`. Inside a bare worktree these either crash on a missing
  module or — worse — no-op and report success on **zero** files.
- **Do NOT symlink deps into the worktree.** Symlinking `node_modules`/`dist` makes Node
  resolve paths relative to the symlink target, which silently processes nothing (the
  generator walks the wrong root and exits 0 having touched no files). This looks like a
  pass but did no work.

**Rule:** Run the spec-kit toolchain (strict validate, generators, metadata regen) on
`main` AFTER the merge. NEVER trust a strict-validate run executed inside a bare worktree
— treat its exit code as meaningless.

### Caveat 2: The memory / vector DBs are a SINGLE global instance

The continuity DB and vector DBs live under
`.opencode/skills/system-spec-kit/mcp-server/database/` and are **gitignored** — there is
exactly one instance shared across the repo, NOT one per worktree. Consequences:

- DB-dependent ops (`memory_index_scan`, `generate-context.js` indexing, re-embed) read
  and write the same global DB regardless of which worktree you run them from.
- Running them from a worktree mid-reorg indexes paths that do not yet exist on `main`,
  producing stale/duplicate rows once the merge lands.

**Rule:** The worktree is for file/rename ops only. Run ALL memory reindex / re-embed /
indexing on `main` AFTER the merge, so the DB reflects the final tree exactly once.

### Caveat 3: `git mv` leaves gitignored files behind

`git mv old/ new/` moves tracked files but ignores untracked/gitignored cruft
(`.DS_Store`, `*.log`, `*.pyc`, `__pycache__/`, editor swap files). After the rename the
old source folder can linger on disk holding only ignored files — a confusing "double"
folder. The commit/tree is correct (0 tracked files in the old dir) but the working
directory is cluttered.

**Detect + clean leftover dirs (0 tracked files, nothing committable):**

```bash
# List dirs that still exist on disk but have ZERO tracked files.
# A dir is a safe-to-remove leftover when: git ls-files <dir> is empty
# AND git status --porcelain --untracked-files=all shows nothing committable in it.
while IFS= read -r d; do
  [ -z "$(git ls-files -- "$d")" ] \
    && [ -z "$(git status --porcelain --untracked-files=all -- "$d")" ] \
    && echo "LEFTOVER (safe rm): $d"
done < <(find . -type d -not -path './.git/*' -mindepth 1 | sort)
```

Each printed dir holds only ignored cruft and is safe to `rm -rf`. **Run this on `main`
after the merge** (the merged tree is the source of truth), then remove the confirmed
leftovers. See the playbook step 4 for placement in the full flow.

---

## 9. TROUBLESHOOTING

### Worktree Creation Fails

**Symptom**: `fatal: cannot create worktree` error

**Common Causes**:
- Directory already exists
- Branch already checked out in another worktree
- Insufficient permissions

**Solutions**:
```bash
# Remove worktree safely
git worktree remove .worktrees/branch-name

# Check existing worktrees
git worktree list

# Prune stale references (if needed)
git worktree prune
```

### Tests Fail After Creation

**Symptom**: Baseline tests fail in new worktree

**Actions**:
1. Report failure details to user
2. Ask: "Tests failing. Options: (A) Investigate now (B) Proceed anyway (C) Abort"
3. If investigate: Review test output, check dependencies are installed, verify environment matches main worktree
4. If proceed: Document that baseline is broken
5. If abort: Remove worktree

### Cannot Determine Project Type

**Symptom**: No package.json, Cargo.toml, requirements.txt, etc.

**Actions**:
1. Skip automated dependency install
2. Ask user: "Cannot detect project type. What command should I run to set up dependencies?"
3. Document command in AGENTS.md for future use

### Directory Not in .gitignore

**Symptom**: Worktree directory would be tracked by git

**Actions**:
1. Add appropriate pattern to .gitignore
2. Commit immediately: `git add .gitignore && git commit -m "chore: ignore worktree directories"`
3. Proceed with worktree creation

---

## 10. SUCCESS CRITERIA

**Worktree creation is successful when**:
- ✅ Directory selected following priority system
- ✅ Safety verification passed (`.gitignore` check)
- ✅ Worktree created with appropriate branch strategy
- ✅ Dependencies installed successfully
- ✅ Tests pass (baseline verified)
- ✅ User informed of location and status

**Quality gates**:
- Directory must be in `.gitignore` (if project-local)
- Tests must pass OR user explicitly approves proceeding with failures
- Full path and status reported to user

---

## 11. RELATED RESOURCES

### Reference Files
- [commit-workflows.md](./commit-workflows.md) - Professional commit practices with Conventional Commits
- [finish-workflows.md](./finish-workflows.md) - Complete development work with structured integration options
- [quick-reference.md](./quick-reference.md) - One-page cheat sheet for all git workflows
- [shared-patterns.md](./shared-patterns.md) - Common patterns and conventions across workflows

### External Resources
- [Git Documentation: git-worktree](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [Superpowers using-git-worktrees skill](https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md) - Original worktree skill reference
