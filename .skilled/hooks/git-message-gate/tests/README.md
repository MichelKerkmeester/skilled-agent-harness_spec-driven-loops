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

`dsh-git-message-gate.test.mjs` is the test suite for the DSH message-gate adapter. It runs under `node --test` and imports the shared support module at `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. The suite builds a stub context, calls `registerGitMessageGate` and fires `tools/pre-execute`. The suite covers the DSH registration only and starts no runtime process. The first test writes inside a temporary repository and removes it in `finally`.

The first test pins the gate against a fixture repository. A nonconforming subject is refused with a `subject.format` match while a conforming one is allowed. The second test pins the adapter's split error policy in two cases. An unexpected core error logs one warning and delegates the call. A `ContractError` denies the call and names the rules it could not read.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-git-message-gate.test.mjs` | The suite for the DSH adapter. It covers the shared contract and the split error policy. |

The suite imports `adapterHarness` from the shared support module. That helper keeps one handler per event and records each log line. The suite also imports `tempDir` and `cleanup` for temporary directories. `tempDir` makes a fresh directory under the system temp root. `cleanup` removes that directory with a recursive, forced `rmSync` call.

The adapter exports `ERROR_POLICY = 'fail-open'` and the first test asserts that string. The second test stubs the core, so no real contract is read.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/git-message-gate/tests/dsh-git-message-gate.test.mjs
```

Expected result: both tests pass and the process exits 0. A failed assertion fails the test process with a nonzero status.

---

## 4. RELATED

- [`../README.md`](../README.md): the feature README, with the per-runtime refusal channels and the contract rules.
- [`../dsh/git-message-gate.mjs`](../dsh/git-message-gate.mjs): the DSH adapter that the suite registers and drives.
