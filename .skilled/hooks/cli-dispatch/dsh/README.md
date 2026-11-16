---
title: "DSH Dispatch Hooks: Fail-Closed Preflight and Fail-Open Audit"
description: "DeepSeek Harness adapters that deny a bash dispatch which breaks a blocking hard rule and record every completed bash command for the audit trail."
trigger_phrases:
  - "dsh dispatch preflight"
  - "dsh dispatch audit"
  - "dsh bash dispatch lint"
version: 1.0.0.0
---

# DSH Dispatch Hooks: Fail-Closed Preflight and Fail-Open Audit

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/dsh/` holds the DSH pair for the dispatch concern. It exports `registerDispatchPreflightLint` and `registerDispatchAudit`. Both resolve the checkout from this file's own path, not the working directory. A DSH session runs in a lineage or scratch folder.

The preflight declares `ERROR_POLICY = 'fail-closed'`. The audit declares `ERROR_POLICY = 'fail-open'`. The `repo-guards` plugin bundle imports both adapters. `.dsh/plugins/repo-guards/index.mjs` calls both from `apply()`, through the links in `.dsh/plugins/repo-guards/adapters/`. DSH is the only runtime that runs this pair.

Two concern keys gate the pair. `dispatch-guard` gates the preflight and `dispatch` gates the audit.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `tools/pre-execute` adapter. It denies a `bash` dispatch that breaks a blocking hard rule. |
| `dispatch-audit.mjs` | The `tools/post-execute` adapter. It records each completed `bash` command in the shared audit log. |

**Preflight.** `registerDispatchPreflightLint` returns at once unless `isHookEnabled('dispatch-guard')` is true. A call that is not `bash` or that carries no command string passes to `next()`. Otherwise it calls `evaluateDispatch` against this checkout's skills. A `block` violation denies the call with `{kind: 'deny'}` and the joined reasons. A `warn` violation goes to `ctx.logger.warn` and does not deny. A `bash` call with no `block` violation also passes to `next()`.

A throw from the rule check fails closed. The adapter logs the error through `ctx.logger.error` and returns `{kind: 'deny'}`. The reason says the shared rule check could not complete.

**Audit.** `registerDispatchAudit` returns at once unless `isHookEnabled('dispatch')` is true. It awaits `next()` first, so the downstream result is in hand before it records anything. A call that is not `bash` or that carries no command string returns that result untouched. Otherwise it calls `recordDispatch` with the command, the log path and `runtime: 'dsh'`. The record also carries the session id, the call id, the output text, the byte count and the error metadata.

A throw inside the record is logged through `ctx.logger.warn` and the downstream result still returns. The audit never changes a tool result.

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-execute adapter calls.
- [`../tests/dsh-dispatch.test.mjs`](../tests/dsh-dispatch.test.mjs): the parity and throw-policy tests for both adapters.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers both adapters.
