---
title: 'Session list'
description: 'The Home view that lists opaque session cards from the relay catalog.'
trigger_phrases:
  - 'Session list'
  - 'session cards'
  - 'session catalog'
  - 'SessionCatalog'
  - 'Home view'
version: 1.0.0.0
---

# Session list (SessionCatalog, Home)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The Home view that lists opaque session cards from the relay catalog.

Session cards carry only an opaque id, status, message count, and update time, and hydrate from the offline cache before the relay list arrives. Device footer actions log out and revoke the current device.

Current status: shipped.

---

## 2. HOW IT WORKS

### Relay Catalog

The session catalog registers coarse state for server-owned opaque session ids and rejects ids that are not opaque. The store projection reads id, status, updated time, and message count only, so filesystem paths and prompt-derived labels never reach the client.

### Client View

The web client loads the cached session list first, then fetches the relay list and marks the source relay. A stale source disables steering input and shows a freshness note. The device footer shows the host fingerprint and offers log out and revoke actions.

---

## 3. SOURCE FILES

### Implementation

| File                                            | Layer   | Role                                            |
| ----------------------------------------------- | ------- | ----------------------------------------------- |
| `apps/pi-remote-relay/src/sessions/catalog.ts`  | Handler | Registers and lists opaque session cards        |
| `apps/pi-remote-relay/src/store/relay-store.ts` | Handler | Projects session cards from the ledger          |
| `apps/pi-remote-web/src/App.tsx`                | Handler | Renders the Home session grid and device footer |
| `apps/pi-remote-web/src/relay.ts`               | Handler | Fetches sessions from the relay                 |

### Validation And Tests

| File                                       | Type   | Role                                         |
| ------------------------------------------ | ------ | -------------------------------------------- |
| `apps/pi-remote-web/tests/App.test.tsx`    | Vitest | Lists sessions on Home                       |
| `apps/pi-remote-relay/tests/store.test.ts` | Vitest | Covers session card upsert and list ordering |

---

## 4. SOURCE METADATA

- Group: pwa
- Canonical catalog source: `README.md`
- Feature file path: `pwa/session-list.md`
- Current status: shipped

Related references:

- [typed-block-transcript.md](typed-block-transcript.md) - the drill-down target for one session
- [approval-card.md](approval-card.md) - the review view reachable from the header
