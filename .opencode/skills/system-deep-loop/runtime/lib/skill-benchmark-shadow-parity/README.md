---
title: "skill-benchmark-shadow-parity: Shadow Parity"
description: "Skill Benchmark shadow-parity layer for the durable runtime event spine."
trigger_phrases:
  - "skill-benchmark-shadow-parity"
  - "skill benchmark shadow-parity"
---

# Skill Benchmark Shadow Parity

---

## 1. OVERVIEW

This folder runs deterministic parity checks against the lane's shadow execution for the Skill Benchmark runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

Callers should use the exported API in `index.ts`. Filesystem, ledger and workflow policy remain owned by the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `harness-adapter.ts` | Adapter between the parity harness and lane execution. |
| `index.ts` | Public barrel for parity execution, comparison and types. |
| `types.ts` | Parity scenario, manifest, comparison and result types. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` |
| Primary implementation | `harness-adapter.ts` |

The barrel re-exports the lane's supported types, constants, parsers and runtime helpers. Adapter between the parity harness and lane execution. Direct imports from implementation files bypass the lane contract and should remain limited to internal composition and focused tests.

---

## 4. SPINE ROLE

This module compares canonical lane outcomes before promotion or rollback. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the shadow parity step for Skill Benchmark. It does not replace the shared substrate or decide consumer-facing workflow policy.

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
