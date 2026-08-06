---
title: "deep-review-rollback-gate: Rollback Gate"
description: "Deep Review rollback-gate layer for the durable runtime event spine."
trigger_phrases:
  - "deep-review-rollback-gate"
  - "deep review rollback-gate"
---

# Deep Review Rollback Gate

---

## 1. OVERVIEW

This folder evaluates safe rollback and mode-transition boundaries for the Deep Review runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

Callers should use the exported API in `index.ts`. Filesystem, ledger and workflow policy remain owned by the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public barrel for gate, switch and contract types. |
| `mode-gate.ts` | Mode migration and rollback-window evaluation. |
| `rollback-switch.ts` | Rollback switch state and transition behavior. |
| `types.ts` | Rollback gate, switch and policy contract types. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` |
| Primary implementation | `mode-gate.ts` |

The barrel re-exports the lane's supported types, constants, parsers and runtime helpers. Mode migration and rollback-window evaluation. Direct imports from implementation files bypass the lane contract and should remain limited to internal composition and focused tests.

---

## 4. SPINE ROLE

This module keeps rollback decisions explicit, bounded and tied to durable lane evidence. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the rollback gate step for Deep Review. It does not replace the shared substrate or decide consumer-facing workflow policy.

---

## 5. VALIDATION

Run the runtime typecheck from the repository root. The lane-specific unit suite, when present, uses the same runtime Vitest configuration.

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

Expected result: exit code 0 with no TypeScript diagnostics.

---

## 6. RELATED

- [Runtime library map](../README.md)
- [Runtime unit tests](../../tests/unit/README.md)
- [Shared event envelope](../event-envelope/README.md)
- [Shared replay fingerprint](../replay-fingerprint/README.md)
