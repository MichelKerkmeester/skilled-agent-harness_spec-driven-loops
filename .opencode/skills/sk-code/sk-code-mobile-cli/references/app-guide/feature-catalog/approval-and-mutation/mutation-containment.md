---
title: 'Mutation containment'
description: 'The extension boundary that blocks protected tool calls before execution and the loopback authority routes that back it.'
trigger_phrases:
  - 'Mutation containment'
  - 'approval extension'
  - 'final boundary handler'
  - 'extension authority'
  - 'createFinalBoundaryHandler'
version: 1.0.0.0
---

# Mutation containment (createFinalBoundaryHandler)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The extension boundary that blocks protected tool calls before execution and the loopback authority routes that back it.

A Pi extension hooks the final tool call boundary, digests every protected action, and requests and consumes leases from the relay authority routes with a shared secret. A non-matching action, digest, or authority configuration blocks the tool call before execution.

Current status: shipped.

---

## 2. HOW IT WORKS

### Final Boundary

`createFinalBoundaryHandler` registers on the Pi tool call event and acts only for tools in the protected family set. For a protected call it builds the exact action with the configured principal, session, epoch, and policy version, digests it, requests a lease, and polls the consume route until the lease settles or its TTL passes.

### Authority Routes

The relay exposes two loopback-only routes guarded by a shared secret and a pinned authority identity. The request route refuses a digest that does not match the action, and the consume route refuses a mismatched authority and returns the final gate result. The extension deletes the secret from the environment after reading it.

---

## 3. SOURCE FILES

### Implementation

| File                                         | Layer   | Role                                                                 |
| -------------------------------------------- | ------- | -------------------------------------------------------------------- |
| `extensions/pi-remote-approval/src/index.ts` | Handler | Implements the final boundary handler and the relay lease authorizer |
| `apps/pi-remote-relay/src/http/server.ts`    | Handler | Implements the extension authority request and consume routes        |

### Validation And Tests

| File                                                         | Type        | Role                                                                       |
| ------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------- |
| `extensions/pi-remote-approval/tests/final-boundary.test.ts` | Vitest      | Covers the final boundary fixture for protected tools                      |
| `apps/pi-remote-relay/tests/authority-loop.test.ts`          | Integration | Runs the live protected-mutation authority loop across relay and extension |

---

## 4. SOURCE METADATA

- Group: approval-and-mutation
- Canonical catalog source: `README.md`
- Feature file path: `approval-and-mutation/mutation-containment.md`
- Current status: shipped

Related references:

- [final-gate-digest.md](final-gate-digest.md) - the digest recheck behind the consume route
- [kill-switch.md](kill-switch.md) - the family policy that selects protected tools
