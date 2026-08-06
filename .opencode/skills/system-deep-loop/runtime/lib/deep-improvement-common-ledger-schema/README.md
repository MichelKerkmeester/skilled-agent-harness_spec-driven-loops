---
title: "deep-improvement-common-ledger-schema: Ledger Schema"
description: "Deep Improvement Common ledger schema layer for the durable runtime event spine."
trigger_phrases:
  - "deep-improvement-common-ledger-schema"
  - "deep-improvement-common ledger schema"
---

# Deep Improvement Common Ledger Schema

---

## 1. OVERVIEW

This folder defines the lane's durable event stems, payloads and compatibility types for the Deep Improvement Common runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

The module is documentation-only at this boundary. Callers should use the exported API in `index.ts` and leave filesystem, ledger and migration ownership to the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `deep-improvement-common-ledger-schema.ts` | event definitions, payload construction and schema validation |
| `deep-improvement-common-ledger-types.ts` | Lane-specific types, constants and contract values. |
| `index.ts` | Public barrel for the lane-specific API and types. |
| `legacy-compatibility.ts` | Compatibility decisions and upcasting for older lane records. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` | Re-exports the lane's supported types, constants, parsers and runtime helpers. |
| Primary implementation | `deep-improvement-common-ledger-schema.ts` | event definitions, payload construction and schema validation. |

Consumers import from the barrel. Direct imports from private implementation files bypass the lane contract and should remain limited to tests or internal composition.

---

## 4. SPINE ROLE

is the event contract at the start of the durable lane spine. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the ledger schema step for Deep Improvement Common. It does not replace the shared substrate or decide consumer-facing workflow policy.

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
