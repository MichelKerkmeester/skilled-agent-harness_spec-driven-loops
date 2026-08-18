---
title: 'Attention inbox'
description: 'A bounded in-app attention list that resolves hints to current relay state.'
trigger_phrases:
  - 'Attention inbox'
  - 'attention items'
  - 'open attention'
  - 'lookup id'
  - 'AttentionInbox'
version: 1.0.0.0
---

# Attention inbox (AttentionInbox)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A bounded in-app attention list that resolves hints to current relay state.

Attention items persist with class, generation, and nonce metadata only, and opening one reauthenticates, resolves the current epoch, and routes to the review or session view. The inbox remains available when notifications are denied.

Current status: shipped.

---

## 2. HOW IT WORKS

### Item Store

The relay keeps the most recent attention rows with a lookup id, attention class, generation, nonce, session, epoch, target, and focus id. Resolve returns the current epoch check plus the session and target, and a stale lookup resolves to null so the client shows a stale hint error.

### Client Flow

The inbox fetches the item list, and opening an item reestablishes the device session, resolves the lookup, and routes to the review view for a needs-input item or the session view otherwise. A deep link with an attention id performs the same resolution on load.

---

## 3. SOURCE FILES

### Implementation

| File                                            | Layer   | Role                                          |
| ----------------------------------------------- | ------- | --------------------------------------------- |
| `apps/pi-remote-relay/src/push/push-service.ts` | Handler | Persists and resolves bounded attention items |
| `apps/pi-remote-web/src/attention.ts`           | Handler | Fetches items and opens hints from the client |
| `apps/pi-remote-web/src/App.tsx`                | Handler | Renders the inbox view and deep link routing  |

### Validation And Tests

| File                                      | Type   | Role                                  |
| ----------------------------------------- | ------ | ------------------------------------- |
| `apps/pi-remote-relay/tests/push.test.ts` | Vitest | Covers attention items and resolution |
| `apps/pi-remote-web/tests/App.test.tsx`   | Vitest | Renders the Attention Inbox           |

---

## 4. SOURCE METADATA

- Group: command-and-push
- Canonical catalog source: `README.md`
- Feature file path: `command-and-push/attention-inbox.md`
- Current status: shipped

Related references:

- [vapid-content-free-push.md](vapid-content-free-push.md) - the delivery path that creates attention items
- [approval-card.md](../pwa/approval-card.md) - the review target for needs-input hints
