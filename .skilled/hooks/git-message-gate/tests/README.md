---
title: "Git Message Gate (Tests): DSH Adapter Coverage"
description: "The node --test suite for the DSH message-gate adapter. It drives the shared contract on a fixture repository and pins the split error policy."
trigger_phrases:
  - "dsh git message gate tests"
  - "message contract test"
  - "adapter test helper"
version: 1.0.0.0
---

# Git Message Gate (Tests): DSH Adapter Coverage

---

## 1. OVERVIEW

`.skilled/hooks/git-message-gate/tests/` holds the `node --test` suite for the DSH adapter of the git message gate. The suite imports the real `registerGitMessageGate` handler and drives it through a fake plugin context. No DSH runtime starts.

The first case builds a temporary git repository and points `skgit.contractDir` at the repository's own sk-git assets, so the real commit message contract applies. It asserts that `ERROR_POLICY` is `fail-open`, then fires `tools/pre-execute`. A commit whose subject is `update stuff` is denied with a reason that names `subject.format`. The downstream handler is not called. A later commit whose subject is `feat(sk-git): add a thing` reaches the next handler as an allow.

The second case replaces the core with a stub, so no contract file is read. An unexpected `Error` from `evaluateCommand` logs one warning and passes the call on. A `ContractError` logs one warning and denies the call with a reason that states the contract could not be read.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-git-message-gate.test.mjs` | The `node --test` suite. It covers the shared commit contract on a fixture repository. It also covers the adapter's split error policy. |

The folder holds no fixture files. The first case builds its repository at run time. `tempDir()` creates a folder under the system temp root and `git init -q` turns it into a repository. The case then writes `skgit.contractDir` with `git config` so the gate reads the sk-git assets. `cleanup()` removes the folder in a `finally` block.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The real adapter and its `ERROR_POLICY`. The shared `ContractError` comes from the message contract. The fake context comes from the shared test helpers. |
| Test double | The second case passes a `core` whose `evaluateCommand` throws. No contract file is read there. |
| Scope | The adapter acts on a `bash` call whose `command` is a string. Any other call goes to `next()`. |
| Side effects | The first case writes only inside its temporary repository and removes it in a `finally` block. |

The first case follows one path.

```text
╭──────────────────────────────────────────╮
│ node --test                              │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ tempDir() then git init -q               │
│ git config skgit.contractDir             │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ adapterHarness()                         │
│ fake context and recorded log lines      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ registerGitMessageGate(ctx, { cwd })     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers.get('tools/pre-execute')        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ evaluateCommand                          │
│ loadContract then validateCommit         │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ deny, or next() for an allow             │
╰──────────────────────────────────────────╯
```

The second case throws inside `evaluateCommand`, so `loadContract` never runs.

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/git-message-gate/tests/dsh-git-message-gate.test.mjs
```

Expected result: `pass 2` and `fail 0`, with exit status 0.

The first case needs `git` on `PATH`, because it runs `git init` and `git config` inside the temporary repository.

---

## 5. RELATED

- [The parent README](../README.md): the message gate core and the per-runtime refusal channels.
- [The DSH adapter](../dsh/git-message-gate.mjs): the handler the suite registers and drives.
- [The shared DSH test helpers](../../shared/tests/README.md): the fake context and the temporary folder helpers.
- [The message contract](../../../skills/sk-git/scripts/lib/message-contract.mjs): loads the template and validates a commit message.
- [The commit message template](../../../skills/sk-git/assets/commit-message-template.md): the contract the fixture repository points at.
