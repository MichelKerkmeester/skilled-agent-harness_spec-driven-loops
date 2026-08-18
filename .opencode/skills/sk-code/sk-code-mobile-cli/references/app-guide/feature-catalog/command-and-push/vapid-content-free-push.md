---
title: 'VAPID content-free push'
description: 'Web Push delivery of content-free attention hints with encrypted stored subscriptions.'
trigger_phrases:
  - 'VAPID content-free push'
  - 'web push'
  - 'push hint'
  - 'PushService'
  - 'serializePushHint'
version: 1.0.0.0
---

# VAPID content-free push (PushService)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Web Push delivery of content-free attention hints with encrypted stored subscriptions.

The relay stores each device push subscription encrypted at rest, sends only a lookup id and attention class in each hint, and suppresses delivery to foreground devices and toggled-off classes. The client can disable push at any time and still use the inbox.

Current status: shipped.

---

## 2. HOW IT WORKS

### Subscription Store

A subscription is validated against the protocol guard, encrypted with AES-256-GCM under a 32 byte key, and upserted per device with default preferences. Preferences for needs input, finished, and error classes are per device, and an invalid stored row fails closed instead of decrypting garbage.

### Hint Delivery

A published attention change payload with a newer generation inserts an attention row and builds a hint with only the lookup id and attention class. Delivery skips foreground devices, respects class preferences, and removes a subscription when the provider returns a 404 or 410 endpoint error.

---

## 3. SOURCE FILES

### Implementation

| File                                            | Layer   | Role                                                                 |
| ----------------------------------------------- | ------- | -------------------------------------------------------------------- |
| `apps/pi-remote-relay/src/push/push-service.ts` | Handler | Implements encryption, subscriptions, preferences, and hint delivery |
| `apps/pi-remote-web/src/attention.ts`           | Handler | Fetches push config and manages subscriptions from the client        |

### Validation And Tests

| File                                                            | Type        | Role                                                                       |
| --------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `apps/pi-remote-relay/tests/push.test.ts`                       | Vitest      | Covers subscriptions, preferences, attention items, and hint serialization |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins push privacy behavior as a fail-closed control                        |

---

## 4. SOURCE METADATA

- Group: command-and-push
- Canonical catalog source: `README.md`
- Feature file path: `command-and-push/vapid-content-free-push.md`
- Current status: shipped

Related references:

- [attention-inbox.md](attention-inbox.md) - the in-app fallback to push
- [session-list.md](../pwa/session-list.md) - the device settings surface for hints
