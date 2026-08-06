---
title: Git plugin read-only command list
description: "Example safe read-only git command allowlist for inspecting vault repository state, what each command proves and how to read the output."
trigger_phrases:
  - "git read only commands"
  - "vault git status check"
  - "git log inspection"
  - "git remote inspection"
  - "safe git commands"
  - "git branch check"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Git plugin read-only command list

Example companion for the git file-layer workflows: the exact read-only command allowlist the mode may run inside a real vault, what each command proves and how to read the output. This is an example, not a live contract: copy and adapt the commands, never extend the list with state-changing git operations.

## 1. OVERVIEW

The mode inspects a vault repository by running read-only git commands from the vault root (or the `basePath` folder). Every command below changes nothing: it only reads repository state. Anything outside this allowlist counts as state-changing and moves to a throwaway repository.

---

## 2. COMMAND LIST

| Command | What it proves | How to read the output |
| --- | --- | --- |
| `git status --short` | Which files changed, staged or untracked | Two-column code per line, `??` means untracked, ` M` means modified |
| `git log --oneline -n 5` | The five most recent commits | One line per commit, hash plus message |
| `git remote -v` | Which remotes are configured | Empty output means no remote, that is a valid absence |
| `git branch --show-current` | The current branch name | One line with the branch name, empty means detached HEAD |
| `git diff --stat` | A summary of unstaged changes | Per-file add and delete counts, empty means no unstaged changes |

---

## 3. USAGE

Run the commands from the repository root so git resolves the vault repository. Combine them with a settings read to answer a user question about backup health: read the settings file first, then run the allowlist, then report version, repo state, identity and conflicts.

---

## 4. LIMITS

- These commands prove repository state, not sync outcomes. A clean status does not prove a push succeeded.
- A missing `.git` directory makes every command fail. Report that the repository is not initialized and let the user run the plugin initialize command in the app.
- Never run commit, push, pull, reset, rebase or history rewrite commands against a real vault.
- Credentials and git binary path live in Obsidian localStorage and stay app-managed.
