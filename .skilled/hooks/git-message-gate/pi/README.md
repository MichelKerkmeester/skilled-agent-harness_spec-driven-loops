---
title: "Git Message Gate (Pi): bash Tool Gate"
description: "Pi's link into the shared message-contract extension, which blocks a bash call whose commit message, PR description or branch name breaks the sk-git templates."
trigger_phrases:
  - "pi git message gate"
  - "sk-git message contract"
  - "tool_call block"
version: 1.0.0.0
---

# Git Message Gate (Pi): bash Tool Gate

---

## 1. OVERVIEW

`git-message-gate/pi/` holds the Pi entry for the message contract gate. `git-message-gate.ts` is a relative symlink to `../../../skills/sk-git/scripts/hooks/pi/git-message-gate.ts`. Pi discovers extensions in `.pi/extensions/`, where another relative symlink points at the same real file. This folder keeps the hook tree navigable, and the real source stays under the sk-git scripts.

The extension registers `tool_call` and returns early unless `event.toolName` is `bash` and `event.input.command` is a string. It dynamic-imports the shared gate and the contract module, calls `evaluateCommand` with `ctx.cwd` and returns `{ block: true, reason }` when the gate refuses. Pi reads only `.block` from a `tool_call` handler's return, so that shape is what makes the refusal visible.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-message-gate.ts` | `tool_call` for `bash` | Is a link to the real Pi extension. It applies the shared gate to the commit message, PR body or branch name and returns a block with the reason. There is no kill switch. | Returns `undefined` when either import fails, so the call is allowed. A `ContractError` becomes `sk-git blocked this command: the repository's rules cannot be read: ...` |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime refusal channels and the contract rules.
- [`../../../skills/sk-git/scripts/hooks/pi/git-message-gate.ts`](../../../skills/sk-git/scripts/hooks/pi/git-message-gate.ts): the real extension this link points at.
- [`../../../../.pi/extensions/git-message-gate.ts`](../../../../.pi/extensions/git-message-gate.ts): the discovery symlink Pi loads.
- [`../../../skills/sk-git/scripts/hooks/git-message-gate.mjs`](../../../skills/sk-git/scripts/hooks/git-message-gate.mjs): the shared gate that exports `evaluateCommand`.
