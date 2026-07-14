---
title: "Finish and integration workflows"
description: "Structured completion flow that gates on passing tests, presents four integration choices, and executes the chosen path safely, including release-notes H1 handling."
trigger_phrases:
  - "finish and integration workflows"
  - "four integration options"
  - "discard failed experiment branch"
  - "create github release tag"
version: 1.0.0.0
---

# Finish and integration workflows

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

sk-git's finish workflow is how completed work gets integrated: verify tests pass, determine the base branch, present exactly four structured integration choices, execute the chosen one safely, and clean up the worktree when appropriate.

Under the continuous-integration model, a launch-wrapper session's commits are already autosynced to the shared live branch by the time finish runs, so finish becomes primarily the final PR/merge decision rather than a manual publish step.

---

## 2. HOW IT WORKS

### Test Gate and the Four Options

Tests must pass before the AI presents any integration choice; a failing test suite blocks progress until the user explicitly overrides. The four options presented, always in the same form, are: merge back to the base branch locally, push and create a pull request, keep the branch as-is, or discard the work. Discard requires the user to type the exact word `discard` after a warning listing every commit that would be permanently deleted — any other input cancels the discard.

### Worktree Cleanup Rules

Cleanup follows the chosen option: merge and discard always remove the worktree afterward; keep-as-is never removes it; push-and-PR asks the user whether to preserve the worktree for addressing review feedback or remove it immediately.

### Reconciling a Worktree Push to a Shared Branch

`git push origin HEAD:<branch>` from a detached HEAD or an isolated worktree advances the remote branch but never moves the local `<branch>` ref that another checkout — typically the operator's primary tree — has checked out, so the pushed work can look "lost" when it is only invisible. After such a push the AI verifies whether the primary checkout's branch actually contains the pushed commit; if the primary tree is clean it offers a fast-forward, but if it is dirty, diverged, or owned by a concurrent session, the AI never stashes/rebases/resets it — it hands over the safe sync recipe instead, since forcing a sync there risks orphaning that session's own in-flight work.

### Release Creation

An optional release step is available only when explicitly requested. It creates an annotated git tag and, critically, also runs `gh release create` — pushing a tag alone never produces a GitHub release page. When publishing release notes from a repo changelog file, the leading `# vX.X.X.X` heading and following blank lines are stripped into a temporary notes file first: the release title field already renders the version and title, so a body-leading H1 would duplicate it on the GitHub Releases page. The H1 stays in the changelog file itself, since that heading is the file's identity in the repo.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-git/references/finish-workflows.md` | Shared | Five-step completion flow, release step, primary-checkout reconciliation |
| `.opencode/skills/sk-git/assets/pr-template.md` | Shared | PR description structure and examples |
| `.opencode/bin/git-sync.sh` | Script | Publishes a worktree's commits during continuous-integration finish |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/manual-testing-playbook/integration-and-pr/finish-merge-to-main.md` | Manual playbook | Validates the local-merge integration option |
| `.opencode/skills/sk-git/manual-testing-playbook/integration-and-pr/finish-create-pr-with-template.md` | Manual playbook | Validates the push-and-PR integration option |
| `.opencode/skills/sk-git/manual-testing-playbook/integration-and-pr/branch-cleanup-after-merge.md` | Manual playbook | Validates post-merge worktree/branch cleanup |
| `.opencode/skills/sk-git/manual-testing-playbook/integration-and-pr/failing-tests-block-merge.md` | Manual playbook | Validates the test gate blocks integration on failure |

---

## 4. SOURCE METADATA

- Group: Workflow Playbooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `workflow-playbooks/finish-and-integration-workflows.md`

Related references:
- [conventional-commit-workflows.md](conventional-commit-workflows.md) — Conventional commit workflows
- [numbered-worktree-workflows.md](numbered-worktree-workflows.md) — Numbered worktree workflows
