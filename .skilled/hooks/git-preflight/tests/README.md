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

`.skilled/hooks/git-preflight/tests/` holds the DSH suite for the git preflight advisory. The suite imports the real adapter and the shared DSH test helpers. Those helpers live in `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. The suite runs under `node --test`.

Both cases replace the rule core and the switch with stubs. No test reads a repository or spawns a git process.

The first case checks a successful advisory. The accepted result keeps `kind` equal to `accept` and gains one `additionalContexts` notice. That notice names the rule that fired.

The second case checks the failure policy. It asserts the exported `ERROR_POLICY` is `fail-open`. A core that throws then logs once and returns the result with no advisory attached.

DSH registers the adapter through the `repo-guards` bundle. `.dsh/plugins/repo-guards/index.mjs` imports `registerGitPreflightAdvisory` and calls it from `apply`. This suite is the only place that handler runs under test.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-git-preflight-advisory.test.mjs` | The `node --test` suite for the DSH adapter. |

Both cases build a fake plugin context with `adapterHarness`. That helper keeps one handler per event and records every `logger.warn` line. Each case registers `registerGitPreflightAdvisory` on the context and fires `tools/post-execute`.

The stub core supplies `GIT_SHAPE`, `GIT_CHECKS`, `readHardRules`, `createGitContext` and `evaluate`. Both cases pass `isEnabled: enabled` and an empty `env`. The command under test is a branch-creating `git checkout`.

A failed assertion fails the test process with a nonzero status.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/git-preflight/tests/dsh-git-preflight-advisory.test.mjs
```

Expected result: both cases pass and the run reports no failures.

---

## 4. RELATED

- [`../README.md`](../README.md): the git preflight advisory, its switches and its runtime coverage.
- [`../dsh/git-preflight-advisory.mjs`](../dsh/git-preflight-advisory.mjs): the adapter under test.
- [`../../shared/tests/`](../../shared/tests/): the shared DSH plugin test helpers.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers the adapter.
