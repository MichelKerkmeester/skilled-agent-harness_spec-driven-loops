---
title: "Git Message Gate (Tests): DSH Adapter Coverage"
description: "The node --test suite for the DSH message-gate adapter, covering the shared contract on fixture repositories and the split fail-open and fail-closed error policy."
trigger_phrases:
  - "dsh git message gate tests"
  - "message contract test"
  - "adapter test helper"
version: 1.0.0.0
---

# Git Message Gate (Tests): DSH Adapter Coverage

---

## 1. OVERVIEW

`git-message-gate/tests/` holds the DSH adapter test suite for the message gate. The file runs under `node --test` and drives the adapter through the shared DSH test support module at `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. It spawns no real runtime and writes only inside temporary repositories that each test removes when it finishes.

Two behaviors are covered. The first is the gate itself against fixture repositories, with a nonconforming subject refused and a conforming one allowed. The second is the adapter's split policy: an unexpected core error logs and delegates, while a `ContractError` denies with the rules-unreadable message.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `dsh-git-message-gate.test.mjs` | `node --test` | Registers `registerGitMessageGate` on a stub context and fires `tools/pre-execute`. The first test asserts the policy string is `fail-open`, that a bad subject is denied with a `subject.format` match and that a conforming subject is allowed. The second asserts one log line and delegated control for an unexpected error, then a deny for a `ContractError`. | A failed assertion fails the test process with a nonzero status. Temporary directories are removed in `finally`. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime refusal channels and the contract rules.
- [`../dsh/git-message-gate.mjs`](../dsh/git-message-gate.mjs): the adapter under test.
