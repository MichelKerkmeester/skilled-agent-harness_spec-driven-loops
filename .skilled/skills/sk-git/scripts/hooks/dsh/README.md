---
title: "DSH Hooks: Git Preflight Advisory and Message Gate"
description: "DeepSeek Harness adapters bridging sk-git's warn-only git advisories and its message-contract gate onto bash calls, loaded through relative symlinks in .dsh/plugins/repo-guards/adapters/."
trigger_phrases:
  - "dsh git preflight"
  - "dsh git message gate"
version: 1.0.0.0
---

# DSH Hooks: Git Preflight Advisory and Message Gate

---

## 1. OVERVIEW

`hooks/dsh/` holds the real files behind the `.dsh/plugins/repo-guards/adapters/git-preflight-advisory.mjs` and `git-message-gate.mjs` links. Node resolves a link to its real path before it resolves the file's own imports, so each relative import here is written for this folder. The index links in `.skilled/hooks/git-preflight/dsh/` and `.skilled/hooks/git-message-gate/dsh/` point back at these files.

---

## 2. WHAT IT DOES AND INJECTS

`git-preflight-advisory.mjs` reads a finished bash call on `tools/post-execute` and appends any matching advisory to the result as additional context the model reads. Warn-only: it never blocks, and an internal error resolves to silence. It reads the hard rules of this checkout, found from its own location, even when the session runs elsewhere.

`git-message-gate.mjs` reads a bash call on `tools/pre-execute`. It hands the command to the shared gate, and when a `git commit` message, a `gh pr` description or a new branch name breaks the repository's own sk-git templates, it denies the call with the gate's reason. A contract error denies. Any other gate failure allows the call, because the git hooks and CI still enforce the rules.

Rule set and messages: [`../git-preflight-advisory.mjs`](../git-preflight-advisory.mjs) and [`../../lib/git-rule-checks.mjs`](../../lib/git-rule-checks.mjs).

---

## 3. RELATED

- [`../pi/README.md`](../pi/README.md): the Pi extensions for the same two concerns.
- [`../git-message-gate.mjs`](../git-message-gate.mjs): the shared message-contract gate both runtimes call.
- [`../../../../../../.dsh/plugins/repo-guards/README.md`](../../../../../../.dsh/plugins/repo-guards/README.md): the bundle, its adapter links and its tests.
