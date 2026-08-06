---
title: "receipts and effect recovery"
description: "Receipt-backed effect intent, confirmation, reconciliation and recovery contracts."
trigger_phrases:
  - "receipts and effect recovery"
  - "effect recovery gateway"
---

# Receipts and Effect Recovery

---

## 1. OVERVIEW

This folder owns the durable boundary between an effect intent and its verified outcome. It defines receipt events, certification, replay projection, effect adapters, authorization and the gateway that coordinates confirmation, conflict, reconciliation and operator-resolved recovery.

The module is current runtime infrastructure. It observes legacy-compatible shapes through an explicit adapter and does not delegate ownership of new writes to historical formats.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `authorized-writer.ts` | Appends ledger records under valid transition authorization. |
| `boundary-receipts.ts` | Issues and verifies certified boundary receipt events. |
| `certification.ts` | Registers certification providers and signs or verifies receipt envelopes. |
| `effect-adapters.ts` | Provides replay-safe atomic filesystem effect adapters. |
| `effect-gateway.ts` | Coordinates effect intent, confirmation, conflict, reconciliation and operator resolution. |
| `errors.ts` | Defines stable error codes for receipt and effect boundaries. |
| `event-contracts.ts` | Defines receipt and effect lifecycle event contracts and registries. |
| `legacy-compatibility.ts` | Parses compatible legacy fields without assigning them new write ownership. |
| `replay-projection.ts` | Projects receipt and effect events for replay-fingerprint verification. |
| `types.ts` | Defines boundary, action, intent, confirmation and recovery-verdict contracts. |
| `index.ts` | Public barrel for the receipt and effect recovery API. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Gateway | `effect-gateway.ts` |
| Receipt API | `boundary-receipts.ts`, `certification.ts` |
| Effect adapters | `effect-adapters.ts` |
| Public barrel | `index.ts` |

Consumers use the barrel or the gateway-owned functions. Authorization, certification and replay projection remain separate contracts so each boundary can fail closed independently.

---

## 4. SPINE ROLE

Receipt and effect recovery sits after an intent is accepted and before a consumer treats the side effect as durable. It records intent, confirmation and recovery evidence, then exposes a replay projection that can be checked against the runtime fingerprint.

---

## 5. VALIDATION

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

---

## 6. RELATED

- [Runtime library map](../README.md)
- [Authorized ledger](../authorized-ledger/README.md)
- [Replay fingerprint](../replay-fingerprint/README.md)
- [Sealed reference artifacts](../sealed-reference-artifacts/README.md)
- [Runtime unit tests](../../tests/unit/README.md)
