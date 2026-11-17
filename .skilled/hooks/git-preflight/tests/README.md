---
title: "Git Preflight Tests: DSH Advisory Adapter Coverage"
description: "The node --test suite for the DSH advisory adapter, covering the context it appends and the fail-open policy when its rule core throws."
trigger_phrases:
  - "dsh git preflight tests"
  - "advisory adapter test"
  - "fail open coverage"
version: 1.0.0.0
---

# Git Preflight Tests: DSH Advisory Adapter Coverage

---

## 1. OVERVIEW

`.skilled/hooks/git-preflight/tests/` holds the DSH suite for the git preflight advisory. The suite imports the adapter from `../dsh/git-preflight-advisory.mjs`. It also imports shared test helpers that live under `../../shared/tests/`. It runs under `node --test`.

Both cases stub the rule core and the enable check. Neither case reads repository state or spawns a git process.

The first case pins the advisory path. The handler takes a `git checkout -b feature/x` command and keeps `kind` at `accept`. It appends one notice to `additionalContexts`. The notice text carries the stub rule id `fixture-rule`.

The second case pins the failure path. The file asserts the exported `ERROR_POLICY` is `fail-open`. A core whose `evaluate` throws keeps the result untouched and adds no `additionalContexts`. The case also asserts one log line.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-git-preflight-advisory.test.mjs` | The `node --test` suite for the DSH adapter, from both the passing and the throwing core paths. |

Both cases call `adapterHarness` to build a fake context. The helper keeps one handler per event and collects log lines in `logs`. Each case registers `registerGitPreflightAdvisory` on the context and calls the handler registered for `tools/post-execute`.

The stub core supplies `GIT_SHAPE` and `GIT_CHECKS`. It also supplies `readHardRules` and `createGitContext`. Its `evaluate` returns the findings or throws in the second case. Each case passes `isEnabled: enabled` and an empty `env`. The first case also passes a `createNotice` stub that returns a user message.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/git-preflight/tests/dsh-git-preflight-advisory.test.mjs
```

Expected output: a `✔` line for each case, then `ℹ pass 2` and `ℹ fail 0`. The command exits `0`.

---

## 4. RELATED

- [The advisory README](../README.md): the switches and the runtime coverage for the git preflight advisory.
- [The adapter under test](../dsh/git-preflight-advisory.mjs): the DSH handler the suite imports.
- [The shared DSH test helpers](../../shared/tests/): the fake context and the fixed stubs.
- [The repo-guards bundle](../../../../.dsh/plugins/repo-guards/index.mjs): the plugin that registers the adapter in a real session.
