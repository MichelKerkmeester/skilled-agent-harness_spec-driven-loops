---
title: "Continuity Identity"
description: "Dark, non-authoritative continuity-identity service that builds a canonical frontier of active references at one ledger cursor."
---

# Continuity Identity

---

## 1. OVERVIEW

Resume-identity substrate for `system-deep-loop`, so a session that stops and restarts can recognize the same references it left off with. The continuity frontier only advances once every active reference resolves at one shared ledger cursor. The service stays non-authoritative. Its only durable writes travel through the shared authorized-ledger gateway rather than a private store.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `continuity-frontier.ts` | `createContinuityFrontier`, building a canonical frontier whose active references all resolve at one ledger cursor |
| `continuity-identity-events.ts` | `createContinuityIdentityEventRegistry`, the validator-bound frozen registry for continuity events |
| `continuity-identity-schema.ts` | Payload guards such as `isPlainRecord` shared by the service and event registry |
| `continuity-identity-service.ts` | `ContinuityIdentityService`, the dark, non-authoritative service whose only durable writes traverse the gateway |
| `continuity-identity-types.ts` | `ContinuityIdentityError` and shared type definitions |
| `index.ts` | Public API surface |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/cycle-detection/cycle-observation.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-service.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/continuity-identities.vitest.ts`

## 5. RELATED

- [`deep-loop README`](../README.md)
- [`runtime/lib README`](../../README.md)
- [`claim-continuity`](../../claim-continuity/README.md)
