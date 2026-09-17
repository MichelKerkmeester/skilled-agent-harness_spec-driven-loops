---
title: "deep-improvement-common-reducers: Reducers"
description: "Deep Improvement Common reducers layer for the durable runtime event spine."
trigger_phrases:
  - "deep-improvement-common-reducers"
  - "deep-improvement-common reducers"
---

# Deep Improvement Common Reducers

---

## 1. OVERVIEW

This folder folds verified lane events into immutable projection state for the Deep Improvement Common runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

The module is documentation-only at this boundary. Callers should use the exported API in `index.ts` and leave filesystem, ledger and migration ownership to the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `deep-improvement-common-projection-schema.ts` | Projection shape checks and immutable-state guards. |
| `deep-improvement-common-projection-types.ts` | Lane-specific types, constants and contract values. |
| `deep-improvement-common-reducer.ts` | projection reduction, integrity checks and legacy-view projection |
| `index.ts` | Public barrel for the lane-specific API and types. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` | Re-exports the lane's supported types, constants, parsers and runtime helpers. |
| Primary implementation | `deep-improvement-common-reducer.ts` | projection reduction, integrity checks and legacy-view projection. |

Consumers import from the barrel. Direct imports from private implementation files bypass the lane contract and should remain limited to tests or internal composition.

---

## 4. SPINE ROLE

consumes the ledger schema and feeds sealed artifacts, certificates and resume. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the reducers step for Deep Improvement Common. It does not replace the shared substrate or decide consumer-facing workflow policy.

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
