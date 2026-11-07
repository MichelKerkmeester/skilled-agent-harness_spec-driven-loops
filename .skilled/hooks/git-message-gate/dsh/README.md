---
title: "Git Message Gate (DSH): bash Pre-Execute Gate"
description: "DSH's link into the shared message-contract adapter, which denies a bash call whose commit message, PR description or branch name breaks the repository's sk-git templates."
trigger_phrases:
  - "dsh git message gate"
  - "repo-guards message contract"
  - "bash pre-execute deny"
version: 1.0.0.0
---

# Git Message Gate (DSH): bash Pre-Execute Gate

---

## 1. OVERVIEW

`git-message-gate/dsh/` holds the DSH adapter for the message contract gate. `git-message-gate.mjs` is a relative symlink to `../../../skills/sk-git/scripts/hooks/dsh/git-message-gate.mjs`. The `repo-guards` bundle imports `registerGitMessageGate` from that real file and calls it with the plugin context, so the handler rides the bundle's `tools/pre-execute` event.

The handler runs only when `call.name` is `bash` and `call.arguments.command` is a string. It resolves the project directory from `call.agent.session.header.cwd`, then `call.cwd`, then the adapter's own `cwd`, and hands the command to the shared `evaluateCommand`. A returned reason becomes `{ kind: 'deny', reason }`. A null reason continues to the next handler.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-message-gate.mjs` | `tools/pre-execute` for `bash` | Is a link to the real DSH adapter. It exports `ERROR_POLICY` as `fail-open` and registers the gate, which denies a message, PR body or branch name that breaks the templates. | Logs `repo-guards git-message-gate: ...` and delegates on an unexpected error. A `ContractError` denies with `sk-git blocked this command because its contract could not be read: ...` |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime refusal channels and the contract rules.
- [`../../../skills/sk-git/scripts/hooks/dsh/git-message-gate.mjs`](../../../skills/sk-git/scripts/hooks/dsh/git-message-gate.mjs): the real adapter this link points at.
- [`../../../skills/sk-git/scripts/hooks/git-message-gate.mjs`](../../../skills/sk-git/scripts/hooks/git-message-gate.mjs): the shared gate that exports `evaluateCommand`.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers the adapter.
