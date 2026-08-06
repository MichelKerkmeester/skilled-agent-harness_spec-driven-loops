---
title: "Git plugin file-layer operations"
description: "Read and edit obsidian-git settings in data.json with backup discipline and inspect vault repository state with a read-only git command allowlist."
trigger_phrases:
  - "git backup status"
  - "obsidian git settings"
  - "vault repository state"
  - "git commit and sync"
  - "git ignore rules"
  - "git conflict file"
version: "0.10.0.0"
---

# Git plugin file-layer operations (`obsidian-git`)

## 1. OVERVIEW

Git (repo `Vinzent03/obsidian-git`, installed v2.38.6 in the vault manifest) turns the vault into a git repository. Its ENTIRE configuration is `.obsidian/plugins/obsidian-git/data.json`: flat keys plus two nested objects (`hunks`, `lineAuthor`). The mode reads and edits the JSON with backup discipline and inspects repository state with the read-only git allowlist. The app renders, commits and syncs after reload. The vault has no data.json yet, so built-in defaults apply and that is valid state.

---

## 2. HOW IT WORKS

Read `data.json` fresh (absence means defaults apply) → back up (`.bak` copy) → merge only the requested keys (preserve everything else) → write + re-parse. Repository state is read with `git status --short`, `git log --oneline -n 5`, `git remote -v`, `git branch --show-current` and `git diff --stat`. Settings edits prove intent, only the app confirms an executed sync.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/git/git.md`
- Data contract: `references/plugins/git/data-model.md`
- Recipes: `references/plugins/git/workflows.md`
- Diagnostics: `references/plugins/git/troubleshooting.md`

### Assets

- `assets/plugins/git/git-settings.example.json` is a defaults-style settings sample with every key verified in the data model. It is a copy-and-adapt template, never a live vault file
- `assets/plugins/git/git-commands.example.md` is a safe read-only command list with what each command proves

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/git-status-roundtrip.md`

---

## 4. GUARDRAILS

- Backup before EVERY write. Merge instead of replace and preserve user-customized settings.
- Never run state-changing or destructive git operations on a real vault. Validate those workflows in throwaway repositories only.
- Never touch files inside `.git/` and never add invented settings keys.
- A missing data.json is default state, never report it as data loss.
- Only the app can confirm push, pull and rendering outcomes.
