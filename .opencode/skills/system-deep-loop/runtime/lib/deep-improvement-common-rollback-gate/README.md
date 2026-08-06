---
title: "deep-improvement-common-rollback-gate: Rollback Gate"
description: "Deep Improvement Common rollback gate layer for the durable runtime event spine."
trigger_phrases:
  - "deep-improvement-common-rollback-gate"
  - "deep-improvement-common rollback gate"
---

# Deep Improvement Common Rollback Gate

---

## 1. OVERVIEW

This folder evaluates rollback evidence and controls the lane's migration switch for the Deep Improvement Common runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

The module is documentation-only at this boundary. Callers should use the exported API in `index.ts` and leave filesystem, ledger and migration ownership to the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `index.ts` | Public barrel for the lane-specific API and types. |
| `mode-gate.ts` | rollback-window evaluation, mode-gate decisions and rollback switch control |
| `rollback-switch.ts` | Controlled rollback or cutover switch behavior. |
| `types.ts` | Lane-specific types, constants and contract values. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` | Re-exports the lane's supported types, constants, parsers and runtime helpers. |
| Primary implementation | `mode-gate.ts` | rollback-window evaluation, mode-gate decisions and rollback switch control. |

Consumers import from the barrel. Direct imports from private implementation files bypass the lane contract and should remain limited to tests or internal composition.

---

## 4. SPINE ROLE

closes the lane spine by admitting only validated rollback or cutover decisions. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the rollback gate step for Deep Improvement Common. It does not replace the shared substrate or decide consumer-facing workflow policy.

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
