---
title: 'Device enrollment'
description: 'Short-lived QR pairing challenges and ECDSA key proof for binding one device.'
trigger_phrases:
  - 'Device enrollment'
  - 'QR pairing'
  - 'enrollment registry'
  - 'enrollmentProof'
  - 'EnrollmentRegistry'
version: 1.0.0.0
---

# Device enrollment (EnrollmentRegistry)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Short-lived QR pairing challenges and ECDSA key proof for binding one device.

The relay mints a one-time pairing payload intended to be transferred once by QR, and a phone proves possession of a fresh P-256 key by signing the byte-stable enrollment statement. Only then is the device registered.

Current status: shipped.

---

## 2. HOW IT WORKS

### Challenge Lifecycle

`createChallenge` returns a payload with a pairing id, the host fingerprint, a challenge, and an expiry, and keeps it pending. Challenges are pruned on use or expiry, and the host fingerprint is derived from the host id so the phone can confirm the relay it is talking to.

### Proof and Registration

`enroll` accepts the challenge, the device public key, and a signature, and validates the shape, the origin, the fingerprint, the expiry, and the signature over the canonical statement. A valid enrollment consumes the challenge and registers the device with an opaque device id, the principal, and the origin.

---

## 3. SOURCE FILES

### Implementation

| File                                          | Layer   | Role                                                                       |
| --------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `apps/pi-remote-relay/src/auth/enrollment.ts` | Handler | Implements the challenge registry, proof verification, and device registry |
| `packages/pi-rpc-protocol/src/auth.ts`        | Shared  | Builds the byte-stable `enrollmentProof` statement                         |

### Validation And Tests

| File                                                            | Type        | Role                                                         |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| `apps/pi-remote-relay/tests/auth.test.ts`                       | Vitest      | Covers enrollment through the authenticated tailnet boundary |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins enrollment rejection as a fail-closed control           |

---

## 4. SOURCE METADATA

- Group: auth-and-boundary
- Canonical catalog source: `README.md`
- Feature file path: `auth-and-boundary/device-enrollment.md`
- Current status: shipped

Related references:

- [application-sessions.md](application-sessions.md) - the session layer that trusts enrolled devices
- [serve-identity-anchor.md](serve-identity-anchor.md) - the ingress that guards the enrollment endpoint
