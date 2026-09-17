---
title: "deep-research-ledger-schema: Ledger Schema"
description: "Deep Research ledger-schema layer for the durable runtime event spine."
trigger_phrases:
  - "deep-research-ledger-schema"
  - "deep research ledger-schema"
---

# Deep Research Ledger Schema

---

## 1. OVERVIEW

This folder defines the lane's durable event and ledger payload contract for the Deep Research runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

Callers should use the exported API in `index.ts`. Filesystem, ledger and workflow policy remain owned by the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `deep-research-ledger-schema.ts` | Lane event definitions, payload builders and schema guards. |
| `deep-research-ledger-types.ts` | Lane-specific event, payload and compatibility types. |
| `index.ts` | Public barrel for schema builders, guards and types. |
| `legacy-compatibility.ts` | Compatibility parsing for older lane payload shapes. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` |
| Primary implementation | `deep-research-ledger-schema.ts` |

The barrel re-exports the lane's supported types, constants, parsers and runtime helpers. Event definitions, payload builders and schema guards. Direct imports from implementation files bypass the lane contract and should remain limited to internal composition and focused tests.

---

## 4. SPINE ROLE

This module turns shared event envelopes into lane-specific durable ledger entries. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the ledger schema step for Deep Research. It does not replace the shared substrate or decide consumer-facing workflow policy.

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
