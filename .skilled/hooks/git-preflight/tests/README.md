---
title: "Git Preflight (Tests): DSH Adapter Coverage"
description: "The node --test suite for the DSH advisory adapter, covering the context it appends and the fail-open policy when its rule core throws."
trigger_phrases:
  - "dsh git preflight tests"
  - "advisory adapter test"
  - "fail open coverage"
version: 1.0.0.0
---

# Git Preflight (Tests): DSH Adapter Coverage

---

## 1. OVERVIEW

`git-preflight/tests/` holds the DSH adapter test suite for the git preflight advisory. The file runs under `node --test` and drives the adapter through the shared DSH test support module at `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. Every dependency the adapter would normally load is stubbed, so the tests stay offline and touch no repository.

Two behaviors are covered. The first is the shape of a successful advisory: the downstream result keeps `kind` equal to `accept` and gains one `additionalContexts` notice that names the rule. The second is the failure policy: a core that throws logs once and returns the original result with no advisory attached.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `dsh-git-preflight-advisory.test.mjs` | `node --test` | Registers `registerGitPreflightAdvisory` on a stub context and fires `tools/post-execute`. It asserts the exported `ERROR_POLICY` is `fail-open`, that a finding lands in `additionalContexts` and that a thrown core leaves the result untouched with one log line. | A failed assertion fails the test process with a nonzero status. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime delivery matrix.
- [`../dsh/git-preflight-advisory.mjs`](../dsh/git-preflight-advisory.mjs): the adapter under test.
