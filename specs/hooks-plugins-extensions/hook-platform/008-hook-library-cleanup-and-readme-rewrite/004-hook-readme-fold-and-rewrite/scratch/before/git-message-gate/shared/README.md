---
title: "Git Message Gate (Shared): Stdin Contract Hook"
description: "The shared stdin hook behind every runtime's message gate, which exports evaluateCommand and emits the Claude, Codex, Devin or Cursor denial envelope."
trigger_phrases:
  - "shared git message gate"
  - "evaluateCommand commit message"
  - "pretooluse deny envelope"
version: 1.0.0.0
---

# Git Message Gate (Shared): Stdin Contract Hook

---

## 1. OVERVIEW

`git-message-gate/shared/` holds the one real gate every runtime calls. `git-message-gate.mjs` is a relative symlink to `../../../skills/sk-git/scripts/hooks/git-message-gate.mjs`. Run as a program, it reads a `PreToolUse` payload from stdin and exits with a denial when the visible command breaks the repository's contract. Imported, it exports `evaluateCommand(command, cwd)`, which returns a refusal reason or `null`.

One file serves Claude and Codex 0.160+ (`Bash`), older Codex and Devin (`exec`) and Cursor (`Shell`). The gate reads what it can see: the `-m` or `-F` message of `git commit`, the `--body` or `--body-file` of `gh pr create` and `gh pr edit`, and the name a branch-creating command would make. A command it cannot parse is allowed, because the commit-msg hook, the pre-push hook and CI stand behind it. There is no suppression switch.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-message-gate.mjs` | `PreToolUse` for `Bash`, `exec` or `Shell` | Is a link to the shared stdin hook. It loads the contract for the repository root, validates the visible message, PR body or branch name and writes the runtime's denial envelope. Cursor gets `{ permission: "deny", user_message, agent_message }` and exit 2. The other runtimes get `hookSpecificOutput.permissionDecision: "deny"` and exit 0. | Exits 0 on unreadable stdin or an uncaught rejection. A contract that exists but cannot be read produces the `sk-git blocked this command: the repository's rules cannot be read: ...` refusal. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime adapters and the contract rules.
- [`../../../skills/sk-git/scripts/hooks/git-message-gate.mjs`](../../../skills/sk-git/scripts/hooks/git-message-gate.mjs): the real shared hook this link points at.
- [`../../../skills/sk-git/scripts/lib/message-contract.mjs`](../../../skills/sk-git/scripts/lib/message-contract.mjs): the contract loader, `ContractError` and the three validators.
