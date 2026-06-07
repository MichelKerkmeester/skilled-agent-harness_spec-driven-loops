---
title: sk-git
description: Git workflow orchestrator that runs workspace setup, clean commits and work completion across the git-worktrees, git-commit and git-finish workflows.
trigger_phrases:
  - "git workflow orchestrator"
  - "conventional commits worktree"
  - "git workspace commit finish"
  - "git worktree branch setup"
  - "pull request commit hygiene"
---

# sk-git

> Move from a clean workspace to a merged PR, with worktree setup, Conventional Commits and branch cleanup handled at each step.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Worktrees, Conventional Commits and finishing work into a PR or merge |
| **Invoke with** | "worktree", "commit", "finish work", "pull request" or auto-routing on git keywords |
| **Works on** | Local git plus GitHub remotes (PRs, issues and CI status) through the GitHub MCP |
| **Produces** | An isolated workspace, a clean commit history and an integrated, cleaned-up branch |

---

## 2. OVERVIEW

### Why This Skill Exists

Git mistakes stay quiet until they get expensive. An AI picks a branch strategy you never wanted. Build artifacts slip into a commit. A feature branch lingers for weeks after its PR merged. Commit subjects drift until the history reads like five different people wrote it. None of these stop you in the moment, so they pile up. sk-git takes the guesswork out: it asks before it touches your workspace, writes commits in one deterministic format and cleans up once the work lands.

### What It Does

sk-git is the single orchestrator for git work. It runs three phases in order: workspace setup (an isolated worktree or the current branch), commit hygiene (Conventional Commits with artifact filtering) and completion (PR, merge or discard, then cleanup). A smart router loads only the reference for the phase you are in, so the agent reads focused guidance instead of the whole library.

It does not write code or manage spec folders. `sk-code` owns the code that gets committed, and `system-spec-kit` owns spec folders, memory and continuity. sk-git commits and integrates that work without claiming it.

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 routing fires on git keywords, or you read the skill directly.

```bash
# Auto-routing through the skill advisor
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "commit my changes" --threshold 0.8

# Or read the runtime instructions
Read(".opencode/skills/sk-git/SKILL.md")
```

**Step 2: Pick your phase.** New work starts at setup, staged changes go to commit, finished work goes to integration.

**Step 3: Confirm the workspace (setup only).** The skill asks before it creates anything. Choose an isolated worktree for parallel or long-running work, or stay on the current branch for a quick fix.

```bash
# Worktree path: compute the next global number, then create branch + directory together
n=$(printf '%04d' $(( $(ls -1 .worktrees 2>/dev/null | grep -oE '^[0-9]{4}' | sort -n | tail -1 | sed 's/^0*//' || echo 0) + 1 )))
git worktree add -b "wt/${n}-add-oauth-login" ".worktrees/${n}-add-oauth-login" main
```

A worktree leaves you in an isolated directory on a `wt/{NNNN}-{name}` branch, ready to code.

---

## 4. HOW IT WORKS

### The Three Phases

Work flows through setup, commit and finish, and the router pulls the matching reference at each step.

| Phase | What happens | Reference |
|---|---|---|
| Workspace setup | Isolate the work in a worktree, or stay on the current branch | `references/worktree_workflows.md` |
| Work and commit | Filter artifacts, then write a Conventional Commit | `references/commit_workflows.md` |
| Complete and integrate | Open a PR or merge, run the test gate, then clean up | `references/finish_workflows.md` |

A large rename or reorg follows a stricter runbook: do the file moves in a worktree but run the spec-kit toolchain and any memory reindex on `main` after merge, because a bare worktree is missing the gitignored dependencies. That path lives in `references/large_reorg_playbook.md`.

### Workspace Choice Is Always Yours

The skill never decides your branch strategy on its own. Every session that starts new work asks you to choose an isolated worktree or the current branch, and it holds that choice for the rest of the session. New branches are created one way only, through `git worktree add -b ...`. The direct commands `git branch`, `git checkout -b` and `git switch -c` are off the table, so a branch never exists without a worktree set up for it.

### Deterministic Commit Messages

The same diff and metadata always produce the same commit subject. Type inference takes the first match in a fixed order (merge, release, docs, fix, feat, refactor, test, chore). Scope inference maps file paths the same way, resolving to the skill name, then the agent or command directory, then the dominant top-level path. The history reads consistently no matter which session or model produced it.

### Cleanup Is Part Of Finishing

Finishing is not done when the PR merges. The completion flow removes the worktree directory, deletes the local feature branch and drops the remote tracking branch, so branches and worktrees do not accumulate. A test gate blocks the merge or PR while tests fail.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-git when you start new git-based work, when you are about to commit and when you are ready to open a PR or merge. Reach for it too when you want the house rules on branch naming and commit format. Skip it for a bare `git status` or `git log`, where Bash is faster.

One rule worth knowing up front: on a protected branch, when you hold bypass rights and explicitly ask for a direct push, sk-git does the direct push instead of forcing a PR detour. It still scopes the commit to your intended files and reports that the push bypassed protection.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns spec folders, memory and continuity. sk-git references the spec folder in the commit body and commits the work. |
| `sk-code` | Owns code standards and tests. sk-git commits and integrates what sk-code produces. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Merge conflicts the AI will not resolve | Overlapping edits need a human call on which version wins | Escalate. The skill does not auto-resolve semantic conflicts. |
| GitHub MCP returns 401 or 403 | PAT expired or missing scopes | Regenerate the PAT and update `.utcp_config.json` with `repo`, `issues`, `pull_requests` and `workflow` |
| Worktree shows "already exists" or is locked | A previous worktree was not removed cleanly | Run `git worktree prune`, then retry |
| Branch divergence over 50 commits from base | A long-running branch fell behind main | Merge or rebase the base in incrementally before opening a PR |
| A bare worktree's strict-validate looks green on zero files | The worktree lacks gitignored deps so the run is a silent no-op | Re-run the toolchain on `main` after merge (see `large_reorg_playbook.md`) |

---

## 7. FAQ

**Q: Why does it always ask before creating a branch?**

A: Workspace strategy has real consequences. An unnecessary worktree adds overhead, and staying in place when parallel work is planned causes conflicts. Context alone does not say which is right, so the skill asks every time.

**Q: Why can I not use `git checkout -b` or `git switch -c`?**

A: Those create a branch with no worktree isolation. sk-git keeps branch creation and workspace setup atomic through `git worktree add -b ...`. For an in-place branch, choose the current-branch option and skip setup.

**Q: When do I use the `gh` CLI versus the GitHub MCP?**

A: Use `gh` for simple PR creation and listing. Use the GitHub MCP when you need structured data back (PR reviews, issue fields, CI run details) or bulk operations across many PRs or issues.

**Q: A PR merged but the worktree was never cleaned up. Now what?**

A: Run `git worktree list` to find the stale one, remove it with `git worktree remove .worktrees/{NNNN}-{name}`, delete the local branch with `git branch -d wt/{NNNN}-{name}` and the remote with `git push origin --delete wt/{NNNN}-{name}`, then `git worktree prune`.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios for worktree, commit and finish behavior.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-git/README.md --type readme` reports zero issues |
| Playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md` |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/<NN>--<topic>/` in a live session |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/worktree_workflows.md`](./references/worktree_workflows.md) | Workspace creation, directory and branch strategy |
| [`references/commit_workflows.md`](./references/commit_workflows.md) | Commit flow with artifact filtering and scoped staging |
| [`references/finish_workflows.md`](./references/finish_workflows.md) | Completion: PR, merge, cleanup and release-note handling |
| [`references/large_reorg_playbook.md`](./references/large_reorg_playbook.md) | Worktree-only renames with toolchain on main after merge |
| [`references/shared_patterns.md`](./references/shared_patterns.md) | Error recovery, conflict resolution and merge verification |
| [`references/github_mcp_integration.md`](./references/github_mcp_integration.md) | Remote PR, issue and CI operations through Code Mode |
| [`assets/pr_template.md`](./assets/pr_template.md) | The structure every PR description follows |
