---
title: "DSH Dispatch: tools/pre-execute and tools/post-execute Adapters"
description: "DSH adapters that deny a bash dispatch which breaks a blocking hard rule and record each dispatch-shaped command after it runs."
trigger_phrases:
  - "dsh dispatch preflight"
  - "dsh dispatch audit"
  - "dsh bash dispatch lint"
version: 1.0.0.0
---

# DSH Dispatch: tools/pre-execute and tools/post-execute Adapters

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/dsh/` holds the DSH adapters for the dispatch concern. The preflight runs at `tools/pre-execute`. It denies a `bash` dispatch that breaks a blocking hard rule and logs an advisory for a warning rule. The audit runs at `tools/post-execute`. It records a dispatch-shaped `bash` command after the call completes and leaves the tool result unchanged. The preflight calls `evaluateDispatch` in `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs`. The audit calls `recordDispatch` in `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs`.

DSH registers both adapters in `.dsh/plugins/repo-guards/index.mjs`. The bundle imports them through the `dispatch-preflight-lint.mjs` and `dispatch-audit.mjs` links under `.dsh/plugins/repo-guards/adapters/`. Its `apply()` calls `registerDispatchAudit` and `registerDispatchPreflightLint`.

Each register function checks its switch first and returns without a handler when the concern is off. The preflight key is `dispatch-guard` and its switch is `SYSTEM_DISPATCH_GUARD_DISABLED`. The audit key is `dispatch` and its switch is `CLI_DISPATCH_AUDIT_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch. `SYSTEM_DISPATCH_DISABLED` also disables both concerns.

Both adapters resolve the checkout from this folder's own path, not from the working directory. A DSH session can run in a lineage or scratch folder. The audit writes to `.skilled/logs/cli-dispatch-audit.log` in the checkout.

The preflight fails closed. A throw from the shared rule check reaches `ctx.logger.error` and the call returns `{kind: 'deny'}` with a reason that says the rule check could not complete. A logging failure cannot change that deny. The audit fails open. A throw inside its record reaches `ctx.logger.warn` and the downstream result still returns.

---

## 2. DIRECTORY TREE

The folder is flat. It holds the README and one adapter per event.

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `tools/pre-execute` adapter. It evaluates a `bash` command against the shared hard rules and denies a blocking violation. |
| `dispatch-audit.mjs` | The `tools/post-execute` adapter. It waits for the downstream result and records a dispatch-shaped command in the audit log. |

---

## 3. VALIDATION

Run the suite from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/tests/dsh-dispatch.test.mjs
```

Expected result: every test passes. The runner reports `fail 0` and exits 0.

The suite checks shared-core parity for both adapters and the throw policy of each. One case runs the preflight from a folder outside the checkout and expects the deny.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, its shared cores and its rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-execute adapter calls.
- [`../tests/dsh-dispatch.test.mjs`](../tests/dsh-dispatch.test.mjs): the suite that drives both adapters.
- [`../../../../.dsh/plugins/repo-guards/index.mjs`](../../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers both adapters.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver both adapters call.
