---
title: "Permissions gate"
description: "Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules."
trigger_phrases:
  - "permissions gate"
  - "permissions-gate.ts"
  - "evaluate tool permissions"
  - "default-deny tool access"
  - "glob specificity permission rules"
version: 1.4.0.4
---

# Permissions gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

This feature belongs to the state safety group and is catalogued as F009 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat the module itself as shipped: it is built and its test suite passes. It is not wired into any executor dispatch path — `evaluateToolCall` and `evaluatePreDispatchToolCalls` have zero production callers today, so no live dispatch is currently gated by this code. Prompt-level and sandbox-level controls remain the active protection until it is connected.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/permissions-gate.ts` | Runtime | Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/permissions-gate.vitest.ts` | Test | Primary regression coverage for Permissions gate. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F009
- Feature file path: `state-safety/permissions-gate.md`
- Primary sources: `lib/deep-loop/permissions-gate.ts`, `tests/unit/permissions-gate.vitest.ts`
Related references:
- [loop-lock.md](../../feature-catalog/state-safety/loop-lock.md) — Loop lock
