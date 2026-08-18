---
title: 'Serve-identity anchor'
description: 'Fail-closed loopback ingress that trusts only the Serve secret path and the Tailscale identity headers.'
trigger_phrases:
  - 'Serve-identity anchor'
  - 'loopback ingress'
  - 'serve secret path'
  - 'tailscale identity'
  - 'authenticateIngress'
version: 1.0.0.0
---

# Serve-identity anchor (authenticateIngress)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Fail-closed loopback ingress that trusts only the Serve secret path and the Tailscale identity headers.

The read-only HTTP and WebSocket server binds to IPv4 loopback only and refuses any request that does not carry the secret path prefix, the exact public origin, and a Tailscale user login header. The server never reads those identity headers after authentication.

Current status: shipped.

---

## 2. HOW IT WORKS

### Ingress Check

Every request path must start with the Serve secret prefix, compared in constant time, and the origin header must equal the configured public origin. The principal comes from the `tailscale-user-login` header, and all identity headers are deleted before the handler runs so downstream code cannot trust them again.

### Fail-Closed Surface

The server rejects non-POST methods, oversized bodies, unknown paths, and requests without a valid session. The WebSocket upgrade consumes a one-use ticket, enforces connection and per-device limits, and accepts exactly one read-only subscription per socket. Extension authority routes accept only loopback traffic with the shared extension secret.

---

## 3. SOURCE FILES

### Implementation

| File                                      | Layer   | Role                                                                           |
| ----------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| `apps/pi-remote-relay/src/http/server.ts` | Handler | Implements ingress authentication, the HTTP surface, and the WebSocket upgrade |

### Validation And Tests

| File                                                            | Type        | Role                                                                           |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `apps/pi-remote-relay/tests/auth.test.ts`                       | Vitest      | Covers the authenticated tailnet boundary                                      |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins forbidden, oversized, and unauthenticated ingress as fail-closed controls |

---

## 4. SOURCE METADATA

- Group: auth-and-boundary
- Canonical catalog source: `README.md`
- Feature file path: `auth-and-boundary/serve-identity-anchor.md`
- Current status: shipped

Related references:

- [device-enrollment.md](device-enrollment.md) - the enrollment endpoint behind the ingress
- [mutation-containment.md](../approval-and-mutation/mutation-containment.md) - the loopback authority routes
