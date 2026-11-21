---
title: "Event Envelope"
description: "Foundational canonical-serialization and event-schema registry substrate underneath every runtime/lib domain."
---

# Event Envelope

---

## 1. OVERVIEW

Base substrate for the `system-deep-loop` runtime library. Every sibling domain in the runtime library ([`../`](../README.md)) validates, canonicalizes and reads its events through this module before an authorized write or a replay can happen. Canonical JSON serialization keeps object keys in a deterministic order so a hash never depends on insertion order. The event-type registry rejects any payload that does not match a registered schema and upcaster chain.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `canonical-json.ts` | `canonicalJson`, `canonicalBytes`, `canonicalBytesEqual` and `sha256Bytes`, serializing a bounded JSON value with recursively sorted object keys and comparing two canonical byte sequences directly |
| `event-envelope-boundary.ts` | `prepareEventWrite` and `readEvent`, validating and canonicalizing an event before append and after read |
| `event-envelope-errors.ts` | `EventEnvelopeError`, the base typed failure shared by every envelope boundary phase |
| `event-envelope.ts` | `validateEventEnvelope` and `validateEventTypeNamespace`, validating an exact namespaced event discriminator |
| `event-type-registry.ts` | `EventTypeRegistry`, the deterministic startup registry for event schemas and adjacent upcasters |
| `index.ts` | Public API surface |

---

## 3. CONSUMERS

Every sibling domain in [`../`](../README.md) builds on this module for canonical bytes, envelope validation and the schema registry. Direct import sites include `authorized-ledger`, `blinded-adjudication`, `claim-continuity`, `conditional-fanin`, `contradiction-supersession`, `cycle-detection`, `deep-loop/continuity-identity` and `dispatch-receipts`.

---

## 4. TESTS

- [`../../tests/unit/event-envelope.vitest.ts`](../../tests/unit/event-envelope.vitest.ts)
- [`../../tests/fixtures/event-envelope-producers.ts`](../../tests/fixtures/event-envelope-producers.ts)

Run from the repository root:

```bash
cd .skilled/skills/system-deep-loop/runtime
npx vitest run tests/unit/event-envelope.vitest.ts
```

Expected: vitest reports `Test Files  1 passed (1)` and no failed tests.

---

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`authorized-ledger`](../authorized-ledger/README.md)
