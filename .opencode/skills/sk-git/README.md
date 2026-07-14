---
title: sk-git
description: Git workflow orchestrator with an owner-first worktree grammar, a clone-wide number allocator, deterministic Conventional Commits and an ask-first workspace rule, spanning worktree setup, commit hygiene and work completion.
trigger_phrases:
  - "git workflow orchestrator"
  - "owner-first worktree naming"
  - "conventional commits worktree"
  - "git workspace commit finish"
  - "pull request commit hygiene"
version: 1.3.1.0
---

# sk-git

> Move from a clean workspace to a merged PR: owner-first worktrees, one deterministic commit format and branch cleanup handled at each step.

---

## 1. OVERVIEW

sk-git is the single orchestrator for git work. It runs three phases in order: workspace setup (an isolated worktree or the current branch), commit hygiene (Conventional Commits with artifact filtering) and completion (PR, merge or discard, then cleanup). A smart router loads only the reference for the phase you are in, so the agent reads focused guidance instead of the whole library.

What makes sk-git different from raw git is the set of rules it holds so a fleet of AI sessions can share one repository without stepping on each other. Branch names carry their owner. Numbers come from a clone-wide allocator under a lock, never a hand-count. The skill asks before it touches your workspace. Commits are byte-for-byte reproducible from the same diff. None of these are git defaults, and each one exists to stop a specific quiet failure before it compounds.

It does not write code or manage spec folders. `sk-code` owns the code that gets committed, and `system-spec-kit` owns spec folders, memory and continuity. sk-git commits and integrates that work without claiming it.

### Key Statistics

| Metric | Value |
|---|---|
| Status | Active |
| Version | 1.3.1.0 |
| Main audience | AI sessions and operators sharing one repository |
| Phases | Setup, commit, finish |
| Allocator subcommands | `create`, `create-detached`, `allocate`, `next`, `scan-max`, plus four validators |
| Verification | 41 manual scenarios across 7 categories, plus a feature catalog |

### How This Compares

| Capability | sk-git | Raw git |
|---|---|---|
| Branch naming | Owner-first `{owner}/{NNNN}-{slug}`, number from a locked allocator | Freeform, chosen by hand |
| Workspace choice | Asks worktree vs current branch, holds the answer | Whatever you type |
| Commit subjects | Deterministic from diff and metadata | Freeform, drifts across authors |
| Concurrent sessions | Isolated worktrees plus autosync to one live branch | Manual coordination |
| Cleanup | Part of finishing: worktree, local branch, remote branch | Left to you |

---

## 2. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on git keywords, or read the skill directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "commit my changes" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-git/SKILL.md")
```

**Step 2: Pick your phase.** New work starts at setup, staged changes go to commit and finished work goes to integration.

**Step 3: Confirm the workspace (setup only).** The skill asks before it creates anything. Choose an isolated worktree for parallel or long-running work, or stay on the current branch for a quick fix.

```bash
# Owner-first worktree: the allocator reserves a collision-free number under a
# clone-wide lock and creates the branch plus directory together.
bash .opencode/skills/sk-git/scripts/worktree-naming.sh create sk-git add-oauth-login
# -> branch sk-git/0007-add-oauth-login, directory .worktrees/0007-sk-git-add-oauth-login
```

Expected result: an isolated directory on an owner-first `{owner}/{NNNN}-{slug}` branch, ready to code. `{owner}` is the owning skill id, or `skilled` for cross-cutting work.

---

## 3. FEATURES

### Key Features

| Feature | What It Does |
|---|---|
| Owner-first worktree grammar | Every managed branch starts with its owner, so a Git-UI branch tree is legible at a glance |
| Clone-wide number allocator | Reserves a globally unique `NNNN` under a lock that reads a high-water mark plus every worktree and ref |
| Ask-first workspace rule | Never picks worktree vs current branch on its own, and holds your choice for the session |
| Launch-wrapper isolation | An operator opt-in that places each top-level session in its own worktree, branch and MCP databases |
| Continuous-integration autosync | Publishes each commit to one shared live branch so the operator's IDE stays current |
| Worktree reaper | Auto-reaps qualifying wrapper worktrees, keeps the rest and reports orphan daemons without acting |
| Deterministic commits | The same diff and metadata always produce the same Conventional Commit subject |
| Safety refusals | Blocks no-verify bypasses, secrets in a diff, amending published commits and force-pushing main |

---

## 4. HOW IT WORKS

This section is the why behind the rules. Each one trades a little friction now for a failure it prevents later.

### Owner-First Worktree Grammar

Every managed name follows one grammar:

```text
OWNER        := <skill-id> | "skilled"
TASK_BRANCH  := OWNER "/" NNNN "-" SLUG        (NNNN 4-digit, SLUG lowercase kebab)
TASK_DIR     := ".worktrees/" NNNN "-" OWNER "-" SLUG
RELEASE      := "skilled/v" A "." B "." C "." D
RESERVED     := "main"
WRAPPER      := "work/" RUNTIME "/" SLUG        (launch-wrapper lane, exempt)
```

The owner prefix groups every feature branch under its skill in a Git UI instead of a flat pile, so a reviewer can read who owns what at a glance. The `wt/` and `work/` lanes stay distinct: `wt/{NNNN}-{slug}` is the numbered lane for deliberate feature worktrees, and `work/{runtime}/{slug}` is the launch wrapper's ephemeral, auto-reaped, unnumbered lane.

### The Number Allocator And Its Lock

Git has no cross-prefix uniqueness, so a per-owner counter cannot be enforced by git itself. Allocation instead holds a lock in the shared common Git dir and seeds its maximum from three sources at once: the stored high-water mark, every registered worktree basename and all local plus remote refs. Because the lock serializes contenders and the scan reads the high-water mark first, a partial scan can never reissue a live number, even when several sessions allocate at the same moment. Never hand-compute `NNNN`. Call `worktree-naming.sh create` or `allocate` and let the lock do its job.

### Workspace Choice Is Always Yours

The skill never decides your branch strategy on its own. Every session that starts new work asks you to choose an isolated worktree or the current branch, and it holds that choice for the rest of the session. New branches are created one way only, through `git worktree add -b ...`. The direct commands `git branch`, `git checkout -b` and `git switch -c` are off the table, so a branch never exists without a worktree set up for it.

### Launch Wrapper And Continuous Integration

The ask-first rule governs in-session decisions. It is separate from `.opencode/bin/worktree-session.sh`, a launch wrapper the operator opts into at the shell (for example `alias claude='bash /abs/.opencode/bin/worktree-session.sh claude'`). The wrapper runs before the AI starts and places each top-level session in its own worktree, branch and isolated MCP databases. Orchestrated children exec in place. Because the operator aliased the launch, the choice was already made, so the wrapper does not violate the in-session rule.

Worktree isolation keeps concurrent sessions safe, but it also hides each session's work from the operator's IDE, which is open on the primary checkout. Continuous integration resolves that without giving up isolation: each session autosyncs every commit to one shared live branch, and the IDE fast-forward-follows it. Visibility is at commit granularity only, never another session's uncommitted buffer. The `post-commit` hook publishes through `git-sync.sh`, which fetches, fast-forwards or aborts on conflict and pushes without force.

### Deterministic Commit Messages

The same diff and metadata always produce the same commit subject. Type inference takes the first match in a fixed order: merge, release, docs, fix, feat, refactor, test then chore. Scope inference maps file paths the same way, resolving to the skill name, then the agent or command directory, then the dominant top-level path. The history reads consistently no matter which session or model produced it.

### Cleanup And Safety Refusals

Finishing is not done when the PR merges. The completion flow removes the worktree directory, deletes the local feature branch and drops the remote tracking branch, so branches and worktrees do not accumulate. A test gate blocks the merge or PR while tests fail. The skill also refuses a fixed set of unsafe actions: a `--no-verify` bypass, a diff carrying secrets, amending a published commit and a force push to `main`. It never stashes, rebases or resets a primary tree that is dirty, diverged or owned by a concurrent session, because forcing a sync there can orphan that session's work.

---

## 5. STRUCTURE

```text
sk-git/
+-- SKILL.md                       # Runtime instructions, smart router and rules
+-- README.md                      # This file
+-- scripts/                       # Allocator and validator, plus its test harness
+-- references/                    # Phase workflows loaded by the router
+-- assets/                        # PR template, commit template, worktree checklist
+-- feature-catalog/               # Capability catalog by category
+-- manual-testing-playbook/       # 41 manual scenarios across 7 categories
`-- changelog/                     # Versioned change history
```

| Path | Purpose |
|---|---|
| `scripts/worktree-naming.sh` | Owner-first allocator, worktree creators and grammar validators |
| `references/worktree-workflows.md` | Workspace creation, directory and branch strategy |
| `references/commit-workflows.md` | Commit flow with artifact filtering and scoped staging |
| `references/finish-workflows.md` | Completion: PR, merge, cleanup and release notes |
| `references/large-reorg-playbook.md` | Worktree-only renames with the toolchain run on main after merge |
| `feature-catalog/feature-catalog.md` | Every capability and its entry point |
| `manual-testing-playbook/manual-testing-playbook.md` | Manual validation scenarios |

---

## 6. REQUIREMENTS

| Requirement | Minimum | Notes |
|---|---|---|
| git | 2.20 | Worktree, linked-worktree and `git-common-dir` support |
| bash | 4 or 5 | The allocator uses arrays and `set -euo pipefail` under direct execution |
| GitHub MCP | Optional | Structured PR, issue and CI data through Code Mode |
| `gh` CLI | Optional | Simple PR creation and listing |

---

## 7. TROUBLESHOOTING

| What you see | Cause | Fix |
|---|---|---|
| Merge conflicts the AI will not resolve | Overlapping edits need a human call on which version wins | Escalate. The skill does not auto-resolve semantic conflicts |
| GitHub MCP returns 401 or 403 | PAT expired or missing scopes | Regenerate the PAT, then expose it as `GITHUB_PERSONAL_ACCESS_TOKEN` in `.utcp_config.json` |
| Worktree shows "already exists" or is locked | A previous worktree was not removed cleanly | Run `git worktree prune`, then retry |
| Branch divergence over 50 commits from base | A long-running branch fell behind main | Merge or rebase the base in incrementally before opening a PR |
| A bare worktree's strict-validate looks green on zero files | The worktree lacks gitignored deps so the run is a silent no-op | Re-run the toolchain on `main` after merge, per `references/large-reorg-playbook.md` |

---

## 8. FAQ

**Q: Why does it always ask before creating a branch?**

A: Workspace strategy has real consequences. An unnecessary worktree adds overhead, and staying in place when parallel work is planned causes conflicts. Context alone does not say which is right, so the skill asks every time.

**Q: Why can I not use `git checkout -b` or `git switch -c`?**

A: Those create a branch with no worktree isolation. sk-git keeps branch creation and workspace setup atomic through `git worktree add -b ...`. For an in-place branch, choose the current-branch option and skip setup.

**Q: Why an allocator instead of just picking the next free number?**

A: Several sessions allocate at once. Picking a number by eye races: two sessions read the same maximum and both reserve it. The allocator takes a clone-wide lock and seeds from the high-water mark plus every worktree and ref, so a live number is never reissued.

**Q: When do I use the `gh` CLI versus the GitHub MCP?**

A: Use `gh` for simple PR creation and listing. Use the GitHub MCP when you need structured data back, such as PR reviews, issue fields or CI run details, or for bulk operations across many PRs or issues.

**Q: A PR merged but the worktree was never cleaned up. Now what?**

A: Run `git worktree list` to find the stale one, remove it with `git worktree remove .worktrees/{NNNN}-{owner}-{slug}`, delete the local branch with `git branch -d {owner}/{NNNN}-{slug}` and the remote with `git push origin --delete {owner}/{NNNN}-{slug}`, then `git worktree prune`. Remove the worktree before deleting its branch, because a branch checked out by a worktree cannot be deleted.

---

## 9. VERIFICATION

The skill ships a manual testing playbook (41 scenarios across 7 categories) and a feature catalog covering worktree, commit, finish and the owner-first worktree tooling.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-git/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` |
| Allocator behavior | `bash .opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` |
| Live behavior | Run the playbook scenarios under `manual-testing-playbook/<topic>/` in a live session |

---

## 10. RELATED RESOURCES

### Related Skills

| Skill | Relationship | Use When |
|---|---|---|
| [`system-spec-kit`](../system-spec-kit/SKILL.md) | Owns spec folders, memory and continuity | sk-git references the spec folder in the commit body and commits the work |
| [`sk-code`](../sk-code/SKILL.md) | Owns code standards and tests | sk-git commits and integrates what sk-code produces |

### Related Documents

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`scripts/README.md`](./scripts/README.md) | The allocator and validator surface |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Catalog of every capability and its entry point |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual validation scenarios across 7 categories |
| [`references/worktree-workflows.md`](./references/worktree-workflows.md) | Workspace creation, directory and branch strategy |
| [`references/commit-workflows.md`](./references/commit-workflows.md) | Commit flow with artifact filtering and scoped staging |
| [`references/finish-workflows.md`](./references/finish-workflows.md) | Completion: PR, merge, cleanup and release-note handling |
| [`references/large-reorg-playbook.md`](./references/large-reorg-playbook.md) | Worktree-only renames with the toolchain on main after merge |
| [`references/shared-patterns.md`](./references/shared-patterns.md) | Error recovery, conflict resolution and merge verification |
| [`references/github-mcp-integration.md`](./references/github-mcp-integration.md) | Remote PR, issue and CI operations through Code Mode |
| [`assets/pr-template.md`](./assets/pr-template.md) | The structure every PR description follows |
