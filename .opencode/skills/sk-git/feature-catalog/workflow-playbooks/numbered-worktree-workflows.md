---
title: "Numbered worktree workflows"
description: "The end-to-end workflow an AI follows to gather inputs, verify safety, create a numbered owner-first worktree, and report status."
trigger_phrases:
  - "numbered worktree workflows"
  - "create a git worktree"
  - "fast-merge worktree lifecycle"
  - "detached experiment worktree"
version: 1.0.0.0
---

# Numbered worktree workflows

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Git worktrees create isolated working directories sharing one repository database, letting an AI work on multiple features in parallel without stash chaos or context switching. sk-git wraps raw `git worktree` usage in a seven-step workflow — gather inputs, verify safety, create, install dependencies, verify a clean baseline, and report — built around the owner-first naming grammar.

The workflow only applies once the user has explicitly chosen to create a worktree; the AI must never decide this on its own.

---

## 2. HOW IT WORKS

### Workspace Choice Enforcement

The AI must ask the user to choose between creating a git worktree or working on the current branch before proceeding, and must wait for an explicit selection. It must never create a new branch directly with `git branch`, `git checkout -b`, or `git switch -c` — every branch is created only through `git worktree add -b`, in practice via the naming allocator's `create` command.

### Directory and Safety Verification

Named feature worktrees live under the repo-local `.worktrees/` home, which is normally already gitignored. The AI verifies this with `git check-ignore` before creating anything; if the directory is not ignored, it adds the pattern, asks for approval, and commits the change before proceeding — preventing worktree contents from being accidentally tracked.

### Lifecycle Strategies

All three strategies share the identical owner-first `{OWNER}/{NNNN}-{slug}` branch and `.worktrees/{NNNN}-{OWNER}-{slug}` directory; they differ only in how the branch is managed afterward. Fast-merge (the default) is a short-lived branch merged straight back after testing. Long-running keeps the same branch across multiple days for PR review. Detached experiment uses a numbered-but-unbranched detached HEAD for throwaway work, with no owner and no branch — promoting it later means creating a fresh owner-first branch from that commit.

### Project Setup and Baseline Verification

After creation, the AI auto-detects the project's dependency manager (npm/yarn/pnpm/bun, Cargo, pip/poetry, Go modules, including monorepo workspace tooling and Corepack's `packageManager` field) and installs dependencies, then runs the project's test suite as a baseline. A failing baseline is reported to the user rather than silently proceeding; the user decides whether to investigate or continue.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/references/worktree-workflows.md` | Shared | Seven-step workflow reference: inputs, directory, safety, creation, setup, baseline, report |
| `.opencode/skills/sk-git/assets/worktree-checklist.md` | Shared | Pre-flight worktree creation checklist |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Script | Underlying allocator invoked by the creation step |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/manual-testing-playbook/worktree-setup/fresh-feature-isolated-worktree.md` | Manual playbook | Validates the fast-merge worktree-creation path end to end |
| `.opencode/skills/sk-git/manual-testing-playbook/worktree-setup/current-branch-no-worktree.md` | Manual playbook | Validates the Option-B (current branch) path is honored |
| `.opencode/skills/sk-git/manual-testing-playbook/worktree-setup/stay-on-main-no-feature-branches.md` | Manual playbook | Validates the AI never autonomously creates a branch |

---

## 4. SOURCE METADATA

- Group: Workflow Playbooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow_playbooks/numbered_worktree_workflows.md`

Related references:
- [conventional_commit_workflows.md](conventional-commit-workflows.md) — Conventional commit workflows
- [large_reorg_playbook.md](large-reorg-playbook.md) — Large reorg playbook
