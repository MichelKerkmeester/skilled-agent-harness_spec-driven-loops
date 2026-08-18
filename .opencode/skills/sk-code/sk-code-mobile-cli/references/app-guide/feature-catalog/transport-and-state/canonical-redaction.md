---
title: 'Canonical redaction'
description: 'The single redaction policy applied to every envelope before persistence or broadcast.'
trigger_phrases:
  - 'Canonical redaction'
  - 'redaction policy'
  - 'redactEnvelope'
  - 'redactJson'
version: 1.0.0.0
---

# Canonical redaction (redactEnvelope)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The single redaction policy applied to every envelope before persistence or broadcast.

Every envelope that enters the relay store is redacted first, so the ledger, sync messages, approval cards, and transcripts never carry raw path, secret, or private-text material. The same policy redacts approval arguments before they are shown to an operator.

Current status: shipped.

---

## 2. HOW IT WORKS

### Field Policy

A recursive walker replaces known path keys, secret keys, and private-text keys with fixed markers. String values are scanned for inline secret assignments, bearer tokens, provider token prefixes, and POSIX or Windows path patterns, and each replacement is counted.

### Envelope Stamp

`redactEnvelope` returns the payload redacted and stamps the envelope with a policy version, a redacted field count, and a sorted list of reasons. The stamp travels with the envelope through persistence, so readers can see what was removed and why.

---

## 3. SOURCE FILES

### Implementation

| File                                          | Layer  | Role                                                        |
| --------------------------------------------- | ------ | ----------------------------------------------------------- |
| `apps/pi-remote-relay/src/store/redaction.ts` | Shared | Implements the canonical field and pattern redaction policy |

### Validation And Tests

| File                                                            | Type        | Role                                             |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `apps/pi-remote-relay/tests/redaction.test.ts`                  | Vitest      | Covers the canonical envelope redaction policy   |
| `apps/pi-remote-relay/tests/security/negative-controls.test.ts` | Integration | Pins redaction as a fail-closed negative control |

---

## 4. SOURCE METADATA

- Group: transport-and-state
- Canonical catalog source: `README.md`
- Feature file path: `transport-and-state/canonical-redaction.md`
- Current status: shipped

Related references:

- [redacted-durable-ledger.md](redacted-durable-ledger.md) - applies redaction before every append
- [exact-action-leases.md](../approval-and-mutation/exact-action-leases.md) - redacts approval arguments for display
