---
title: "skill-benchmark-reducers: Reducers"
description: "Skill Benchmark reducers layer for the durable runtime event spine."
trigger_phrases:
  - "skill-benchmark-reducers"
  - "skill benchmark reducers"
---

# Skill Benchmark Reducers

---

## 1. OVERVIEW

This folder folds verified lane events into deterministic projection state for the Skill Benchmark runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

Callers should use the exported API in `index.ts`. Filesystem, ledger and workflow policy remain owned by the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `skill-benchmark-projection-schema.ts` | Projection field ownership, schema versions and guards. |
| `skill-benchmark-projection-types.ts` | Projection state and reducer contract types. |
| `skill-benchmark-reducer.ts` | Deterministic event folding and legacy projection logic. |
| `index.ts` | Public barrel for reducer, projection and verification helpers. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` |
| Primary implementation | `skill-benchmark-reducer.ts` |

The barrel re-exports the lane's supported types, constants, parsers and runtime helpers. Deterministic event folding and legacy projection logic. Direct imports from implementation files bypass the lane contract and should remain limited to internal composition and focused tests.

---

## 4. SPINE ROLE

This module projects ordered ledger evidence into the lane's current read model. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the reducers step for Skill Benchmark. It does not replace the shared substrate or decide consumer-facing workflow policy.

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
