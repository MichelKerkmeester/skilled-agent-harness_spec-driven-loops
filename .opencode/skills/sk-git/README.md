---
title: sk-git
description: Takes a git workflow from a clean workspace to a merged pull request with numbered worktrees, deterministic commit subjects, an ask-first workspace rule and cleanup at every step.
trigger_phrases:
  - "git workflow orchestrator"
  - "numbered worktree naming"
  - "conventional commits worktree"
  - "git workspace commit finish"
  - "pull request commit hygiene"
version: 1.4.1.0
---

# sk-git

> Move from a clean workspace to a merged pull request, with numbered worktrees and deterministic commit subjects at each step.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Git workflow from a clean workspace to a merged PR for AI sessions and operators sharing one repository: worktree setup, commit hygiene, completion and cleanup |
| **Invoke with** | Git-workflow keywords ("commit", "worktree", "pull request", "finish work") through the skill advisor, plus a direct `SKILL.md` read path |
| **Works on** | Any repository with numbered worktrees, staged changes ready to commit or finished work ready to integrate |
| **Produces** | Numbered worktrees and branches, deterministic Conventional Commit subjects, merged or closed PRs with cleanup |

---

## 2. OVERVIEW

### Why This Skill Exists

A shared repository with many AI sessions fails quietly unless the git workflow has rules. Branch names drift, numbers collide, commits become unreproducible and cleanup stalls. sk-git exists to hold those rules so a fleet of sessions can share one repository without stepping on each other.

### What It Does

sk-git runs the git workflow in three phases, from workspace setup through commit hygiene to completion. Setup creates an isolated worktree or keeps the current branch. Commit hygiene turns staged changes into deterministic Conventional Commit subjects with artifact filtering. Completion opens a PR, merges or discards, then cleans up. A smart router loads only the reference for the phase you are in, so the agent reads focused guidance instead of the whole library.

What makes sk-git different from raw git is the rule set it holds. Branch names carry their owner. Numbers come from a clone-wide allocator under a lock, never a hand-count. The skill asks before it touches your workspace. Commits are byte-for-byte reproducible from the same diff. None of these are git defaults. Each one exists to stop a specific quiet failure before it compounds.

### What It Does Not Own

sk-git does not write code or manage spec folders. `sk-code` owns the code that gets committed. `system-spec-kit` owns spec folders with their memory and continuity layers. sk-git commits and integrates that work without claiming it.

### The Git Workspace Safety Layer

| Feature | What the skill operates |
|---|---|
| **Numbered worktree grammar** | Worktree-backed branches use `worktrees/NNN-slug` with the directory `.worktrees/NNN-slug`; dedicated branches without a worktree use `branches/NNN-slug` |
| **Per-namespace number allocator** | Reserves the next `NNN` under a lock per namespace (`worktrees/` and `branches/` each number independently), reading that namespace's high-water mark plus every matching worktree and ref |
| **Ask-first workspace rule** | Never picks worktree vs current branch on its own. Holds your choice for the session |
| **Launch-wrapper isolation** | An operator opt-in that places each top-level session in its own worktree and branch, with isolated MCP databases |
| **Continuous-integration autosync** | Publishes each commit to one shared live branch so the operator's IDE stays current |
| **Worktree reaper** | Auto-reaps qualifying wrapper worktrees. Keeps the rest and reports orphan daemons without acting |
| **Deterministic commits** | The same diff and metadata always produce the same Conventional Commit subject |
| **Safety refusals** | Blocks no-verify bypasses, secrets in a diff, amending published commits and force-pushing main |
| **Preflight advisory** | Evaluates every git command against 17 state-gated rules across all six AI runtimes and prints the matching rule before it runs. Advisory only, never blocking (see `scripts/hooks/README.md`) |

---

## 3. QUICK START

### Requirements

| Requirement | Minimum | Notes |
|---|---|---|
| git | 2.20 | Worktree, linked-worktree and `git-common-dir` support |
| bash | 4 or 5 | The allocator uses arrays and `set -euo pipefail` under direct execution |
| GitHub MCP | Optional | Structured PR, issue and CI data through Code Mode |
| `gh` CLI | Optional | Simple PR creation and listing |

**Step 1: Invoke it.** Gate 2 routing fires on git keywords. You can also read the skill directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "commit my changes" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-git/SKILL.md")
```

The advisor prints a routing recommendation. The Read call opens the runtime instructions.

**Step 2: Pick your phase.** New work starts at setup. Staged changes go to commit. Finished work goes to integration.

**Step 3: Confirm the workspace (setup only).** The skill asks before it creates anything. Choose an isolated worktree for parallel or long-running work. Stay on the current branch for a quick fix.

```bash
# Numbered worktree: the allocator reserves a collision-free number under a
# per-namespace lock and creates the branch plus directory together.
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create add-oauth-login
# -> branch worktrees/007-add-oauth-login, directory .worktrees/007-add-oauth-login

# Dedicated branch with no worktree (branches/ numbers independently):
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create-branch external-dep
# -> branch branches/003-external-dep
```

Expected result: an isolated directory on a numbered `worktrees/{NNN}-{slug}` branch (or a standalone `branches/{NNN}-{slug}` branch), ready to code.

---

## 4. HOW IT WORKS

### Numbered Worktree Grammar

Every managed name follows one grammar:

```text
WORKTREE_BRANCH := "worktrees/" NNN "-" SLUG        (NNN 3-digit 001..999)
WORKTREE_DIR    := ".worktrees/" NNN "-" SLUG
DEDICATED_BRANCH:= "branches/" NNN "-" SLUG          (a branch with NO worktree)
RELEASE         := "skilled/v" A "." B "." C "." D
BACKUP          := "backup/" ANYTHING                (safety refs; legal, not numbered)
RESERVED        := "main"
WRAPPER         := "work/" RUNTIME "/" SLUG          (launch-wrapper lane, exempt)
```

Two flat spec-style namespaces — `worktrees/` and `branches/` — keep a Git-UI branch tree legible as a few clean folders instead of a per-skill pile, and they number **independently**: a `worktrees/003` and a `branches/003` may coexist. Strictly sequential, never skipped, never reused; deleting a middle number never back-fills the gap. `backup/<anything>` safety refs and the launch wrapper's `work/{runtime}/{slug}` lane stay distinct legal-but-not-numbered namespaces.

### The Number Allocator And Its Lock

Git cannot enforce sequential uniqueness itself, so each namespace's counter is allocated under a lock in the shared common Git dir, seeded from that namespace's stored high-water mark first, then every matching local + remote ref and (for `worktrees/`) every registered worktree basename. Because the lock serializes contenders and the scan reads the high-water mark first, a partial scan can never reissue a live number, even when several sessions allocate at the same moment. Never hand-compute `NNN`. Call `worktree-naming.sh create`, `create-branch`, or `allocate` and let the lock do its job.

The allocator exposes `create`, `create-branch`, `create-detached`, `allocate`, `next` and `scan-max`, plus validators (`is_valid_slug`, `is_valid_nnn`, `is_valid_branch`, `is_wrapper_branch`, `is_backup_branch`, `is_valid_pair`, `is_remote_push_allowlisted`).

### Workspace Choice Is Always Yours

The skill never decides your branch strategy on its own. Every session that starts new work asks you to choose an isolated worktree or the current branch. The skill holds that choice for the rest of the session.

New branches are created one way only, through `git worktree add -b ...`. The direct commands never create branches:

- `git branch`
- `git checkout -b`
- `git switch -c`

A branch never exists without a worktree set up for it.

### Launch Wrapper And Continuous Integration

The ask-first rule governs in-session decisions. It is separate from `.opencode/bin/worktree-session.sh`, a launch wrapper the operator opts into at the shell (for example `alias claude='bash /abs/.opencode/bin/worktree-session.sh claude'`). The wrapper runs before the AI starts and places each top-level session in its own worktree and branch, with isolated MCP databases. Orchestrated children exec in place. Because the operator aliased the launch, the choice was already made, so the wrapper does not violate the in-session rule.

Worktree isolation keeps concurrent sessions safe, but it also hides each session's work from the operator's IDE, which is open on the primary checkout. Continuous integration resolves that without giving up isolation. Each session autosyncs every commit to one shared live branch. The IDE fast-forward-follows it. Visibility is at commit granularity only, never another session's uncommitted buffer. The `post-commit` hook publishes through `git-sync.sh`. The script fetches and fast-forwards the shared branch or aborts on conflict. It pushes without force.

### Deterministic Commit Messages

The same diff and metadata always produce the same commit subject. Type inference takes the first match in a fixed priority order: release, docs, fix, feat, perf, refactor, test, ci, build then style. Scope inference maps file paths the same way, with the skill name taking priority over the agent or command directory, which beats the dominant top-level path. The history reads consistently no matter which session or model produced it.

### Cleanup And Safety Refusals

Finishing is not done when the PR merges. The completion flow removes the worktree directory and deletes the local feature branch. It drops the remote tracking branch too, so branches and worktrees do not accumulate. A test gate blocks the merge or PR while tests fail.

The skill also refuses a fixed set of unsafe actions: a `--no-verify` bypass, a diff carrying secrets, amending a published commit and a force push to `main`. It never stashes or rebases a primary tree that is dirty or diverged. It also never resets a tree owned by a concurrent session, because forcing a sync there can orphan that session's work.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-git whenever a git task starts with a clean workspace and ends with integrated work:

- Worktree setup for new or parallel work
- Commit hygiene for staged changes
- Completion with cleanup after a merge or discard

Use `gh` for simple PR creation and listing. Use the GitHub MCP when you need structured data back, such as PR reviews and issue fields, plus CI run details.

### How This Compares

| Capability | sk-git | Raw git |
|---|---|---|
| Branch naming | `worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}`, number from a per-namespace locked allocator | Freeform, chosen by hand |
| Workspace choice | Asks worktree vs current branch, holds the answer | Whatever you type |
| Commit subjects | Deterministic from diff and metadata | Freeform, drifts across authors |
| Concurrent sessions | Isolated worktrees plus autosync to one live branch | Manual coordination |
| Cleanup | Part of finishing: worktree, local branch, remote branch | Left to you |

### Related Skills

| Skill | Relationship |
|---|---|
| [`system-spec-kit`](../system-spec-kit/SKILL.md) | Owns spec folders, memory and continuity. sk-git references the spec folder in the commit body and commits the work |
| [`sk-code`](../sk-code/SKILL.md) | Owns code standards and tests. sk-git commits and integrates what sk-code produces |

### Skill Layout

```text
sk-git/
+-- SKILL.md                       # Runtime instructions, smart router and rules
+-- README.md                      # This file
+-- scripts/                       # Allocator and validator, plus tests
+-- references/                    # Phase workflows loaded by the router
+-- assets/                        # PR template, commit template, worktree checklist
+-- feature-catalog/               # Capability catalog by category
+-- manual-testing-playbook/       # 42 manual scenarios across 8 categories
`-- changelog/                     # Versioned change history
```

| Path | Purpose |
|---|---|
| `scripts/worktree-naming.sh` | Numbered-worktree allocator, worktree creators and grammar validators |
| `references/worktree-workflows.md` | Workspace creation, directory and branch strategy |
| `references/commit-workflows.md` | Commit flow with artifact filtering and scoped staging |
| `references/finish-workflows.md` | Completion: PR, merge, cleanup and release notes |
| `references/large-reorg-playbook.md` | Worktree-only renames with the toolchain run on main after merge |
| `feature-catalog/feature-catalog.md` | Every capability and its entry point |
| `manual-testing-playbook/manual-testing-playbook.md` | Manual validation scenarios |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Merge conflicts the AI will not resolve | Overlapping edits need a human call on which version wins | Escalate. The skill does not auto-resolve semantic conflicts |
| GitHub MCP returns 401 or 403 | PAT expired or missing scopes | Regenerate the PAT, then expose it as `GITHUB_PERSONAL_ACCESS_TOKEN` in `.utcp_config.json` |
| Worktree shows "already exists" or is locked | A previous worktree was not removed cleanly | Run `git worktree prune`, then retry |
| Branch divergence over 50 commits from base | A long-running branch fell behind main | Merge or rebase the base in incrementally before opening a PR |
| A bare worktree's strict-validate looks green on zero files | The worktree lacks gitignored deps so the run is a silent no-op | Re-run the toolchain on `main` after merge, per `references/large-reorg-playbook.md` |

---

## 7. FAQ

**Q: Why does it always ask before creating a branch?**

A: Workspace strategy has real consequences. An unnecessary worktree adds overhead. Staying in place when parallel work is planned causes conflicts. Context alone does not say which is right, so the skill asks every time.

**Q: Why can I not use `git checkout -b` or `git switch -c`?**

A: Those create a branch with no worktree isolation. sk-git keeps branch creation and workspace setup atomic through `git worktree add -b ...`. For an in-place branch, choose the current-branch option and skip setup.

**Q: Why an allocator instead of just picking the next free number?**

A: Several sessions allocate at once. Picking a number by eye races: two sessions read the same maximum and both reserve it. The allocator takes a clone-wide lock and seeds from the high-water mark plus every worktree and ref, so a live number is never reissued.

**Q: When do I use the `gh` CLI versus the GitHub MCP?**

A: Use `gh` for simple PR creation and listing. Use the GitHub MCP when you need structured data back, such as PR reviews and issue fields, plus CI run details. It also handles bulk operations across many PRs or issues.

**Q: A PR merged but the worktree was never cleaned up. Now what?**

A: Run `git worktree list` to find the stale one, remove it with `git worktree remove .worktrees/{NNN}-{slug}`, delete the local branch with `git branch -d worktrees/{NNN}-{slug}` (or `branches/{NNN}-{slug}`) and the remote with `git push origin --delete worktrees/{NNN}-{slug}`, then `git worktree prune`. Remove the worktree before deleting its branch, because a branch checked out by a worktree cannot be deleted.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with scenarios across 8 categories and a feature catalog covering worktree, commit, finish, GitKraken and numbered worktree tooling.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-git/README.md --type readme` reports zero issues |
| Skill packaging and structure | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-git --check` reports `PASS` (snake_case findings on `references/`/`assets/` are advisory ahead of the hyphen-naming program) |
| Allocator behavior | `bash .opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` ends in `FAIL=0` |
| Live behavior | Run the playbook scenarios under `manual-testing-playbook/<topic>/` in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`scripts/README.md`](./scripts/README.md) | The allocator and validator surface |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Catalog of every capability and its entry point |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual validation scenarios across 8 categories |
| [`references/worktree-workflows.md`](./references/worktree-workflows.md) | Workspace creation, directory and branch strategy |
| [`references/commit-workflows.md`](./references/commit-workflows.md) | Commit flow with artifact filtering and scoped staging |
| [`references/finish-workflows.md`](./references/finish-workflows.md) | Completion: PR, merge, cleanup and release-note handling |
| [`references/large-reorg-playbook.md`](./references/large-reorg-playbook.md) | Worktree-only renames with the toolchain on main after merge |
| [`references/shared-patterns.md`](./references/shared-patterns.md) | Error recovery, conflict resolution and merge verification |
| [`references/github-mcp-integration.md`](./references/github-mcp-integration.md) | Remote PR, issue and CI operations through Code Mode |
| [`references/gitkraken-mcp-integration.md`](./references/gitkraken-mcp-integration.md) | GitKraken MCP GitLens AI and cross-provider operations |
| [`assets/pr-template.md`](./assets/pr-template.md) | The structure every PR description follows |
