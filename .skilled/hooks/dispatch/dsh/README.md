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

`hooks/dispatch/dsh/` holds the DSH pair for the dispatch concern. It exports `registerDispatchPreflightLint` and `registerDispatchAudit`. Both resolve the checkout from this file's own path rather than the working directory, because a DSH session runs in a lineage or scratch folder.

The preflight declares `ERROR_POLICY = 'fail-closed'`. The audit declares `ERROR_POLICY = 'fail-open'`. The `repo-guards` plugin bundle imports both adapters from here.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-preflight-lint.mjs` | `tools/pre-execute` | Checks `isHookEnabled('dispatch-guard')`. For a `bash` call it calls `evaluateDispatch` against this checkout's skills, denies a `block` violation with the joined reasons and logs any `warn` violation. Non-dispatch calls pass to `next()`. | Fails closed. A thrown rule check returns `{kind: 'deny'}` with a reason that names the failed check, and logs the error. |
| `dispatch-audit.mjs` | `tools/post-execute` | Checks `isHookEnabled('dispatch')`, awaits `next()` and calls `recordDispatch` for a `bash` command with output text, byte count, session id and call id. The result passes through unchanged. | Fails open. A throw is logged through `ctx.logger.warn` and the downstream result is returned. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../tests/dsh-dispatch.test.mjs`](../tests/dsh-dispatch.test.mjs): the parity and throw-policy tests for both adapters.
