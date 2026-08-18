---
title: 'Approval card'
description: 'The review view that presents exact-action approvals with decision and grant actions.'
trigger_phrases:
  - 'Approval card'
  - 'review view'
  - 'approve decision'
  - 'deny decision'
  - 'Review view'
version: 1.0.0.0
---

# Approval card (Review)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The review view that presents exact-action approvals with decision and grant actions.

Each card shows the relay-redacted canonical input, the digest, and a live countdown, with approve, deny, and accept-next-edits actions for edit and write tools. Decisions submit through the relay and results refresh every second.

Current status: shipped.

---

## 2. HOW IT WORKS

### Card Content

The review view loads approvals across all sessions, sorted by request time, and renders one card per lease. Each card names the tool, shows the redacted canonical arguments in a pre block, and displays the digest head and tail plus a running countdown to expiry.

### Decisions and Grants

Approve and deny send a decision command with the lease revision, epoch, and digest, and the card then shows the settled status and reason. Edit and write cards offer an accept-next-edits action that creates a bounded grant and shows the active grant banner. A live region announces submitted decisions for screen readers.

---

## 3. SOURCE FILES

### Implementation

| File                                                    | Layer   | Role                                                   |
| ------------------------------------------------------- | ------- | ------------------------------------------------------ |
| `apps/pi-remote-web/src/App.tsx`                        | Handler | Renders the review view and approval cards             |
| `apps/pi-remote-web/src/relay.ts`                       | Handler | Fetches approvals, sends decisions, and creates grants |
| `apps/pi-remote-relay/src/approval/approval-service.ts` | Handler | Serves the lease list behind the view                  |

### Validation And Tests

| File                                          | Type   | Role                                                              |
| --------------------------------------------- | ------ | ----------------------------------------------------------------- |
| `apps/pi-remote-web/tests/App.test.tsx`       | Vitest | Renders a pending approval and submits approve and deny decisions |
| `apps/pi-remote-relay/tests/approval.test.ts` | Vitest | Covers the lease and decision semantics the card drives           |

---

## 4. SOURCE METADATA

- Group: pwa
- Canonical catalog source: `README.md`
- Feature file path: `pwa/approval-card.md`
- Current status: shipped

Related references:

- [exact-action-leases.md](../approval-and-mutation/exact-action-leases.md) - the leases the cards present
- [accept-edits-grants.md](../approval-and-mutation/accept-edits-grants.md) - the grant action on edit cards
