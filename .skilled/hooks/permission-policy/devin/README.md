---
title: "Permission Policy: Devin PermissionRequest Adapter"
description: "Devin-only adapter that answers PermissionRequest with an allow or deny decision composed from the shared write-target and dispatch hard-rule cores."
trigger_phrases:
  - "devin permission request"
  - "permission decision policy"
  - "devin approval adapter"
version: 1.0.0.0
---

# Permission Policy: Devin PermissionRequest Adapter

---

## 1. OVERVIEW

`devin/` holds the Devin adapter for the permission policy concern. `permission-request-policy.mjs` is a relative symlink to `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`, and `.devin/hooks.v1.json` registers it in the `PermissionRequest` array. The adapter reads a JSON payload from stdin and emits a decision envelope. Write-class tools delegate to `spec-gate-core.isExemptTargetPath()`, exec-class tools delegate to `dispatch-rule-checks.evaluate()`, and every other tool class denies. This is the one adapter in the tree that fails closed.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`permission-request-policy.mjs`](./permission-request-policy.mjs) | Symlink, `PermissionRequest` | Points at `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`. The target checks the identity fields, classifies the tool and emits `{decision: approve|block, reason, hookSpecificOutput}`. | Fails closed. Invalid JSON, a missing identity field, an unknown tool class or an evaluation error emits `deny`. A missing resolver leaves the policy enabled. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision flow and the per-runtime matrix.
- [`../../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`](../../../skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs): the real adapter.
- [`../../dispatch/lib/dispatch-rule-checks.mjs`](../../dispatch/lib/dispatch-rule-checks.mjs): the hard-rule evaluator behind the exec branch.
