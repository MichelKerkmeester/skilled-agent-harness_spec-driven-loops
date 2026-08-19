---
title: "Slash Commands"
description: "Typing / in the composer opens a nonmodal autocomplete that filters a relay-filtered command catalog and inserts commands on explicit Send only."
trigger_phrases:
  - "use a slash command"
  - "type a / command"
  - "insert a slash command"
version: 1.0.0.0
---

# Slash Commands (slash-commands)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Typing `/` in the composer opens a nonmodal autocomplete that filters a relay-filtered command catalog and inserts commands on explicit Send only.

The autocomplete is an inline, nonmodal surface anchored above the textarea. It is populated exclusively from the host command catalog as projected by the relay. Further typing filters an in-memory snapshot locally, and only explicit Send revalidates and submits. The textarea remains the sole editing field and keeps DOM focus throughout, and the feature never auto-submits.

Current status: shipped.

---

## 2. HOW IT WORKS

### Trigger and catalog projection

As the operator types a leading `/` in the composer, a nonmodal autocomplete opens anchored above the textarea. The candidate list is populated only from the relay-filtered host command catalog — the relay requests `get_commands` from Pi and projects a bounded, filtered catalog. As an honored invariant, that projection applies structural redaction through an allowlist, removing path-like and privileged command names before anything reaches the interface.

### Local filtering and virtual focus

Further typing narrows the results by filtering the in-memory snapshot locally with deterministic ranking; it never hits the network while the operator is typing. The textarea stays the only editing field and keeps DOM focus, with the highlighted candidate tracked via `aria-activedescendant` so keyboard users navigate without a second focus target. This honors the shipped layout constraint of a 390px keyboard-open view with no second editing control.

### Insertion and explicit send

Selecting a result inserts the canonical `/name` plus a trailing space without submitting, requesting a ticket, or touching the host. Send is the only execution path and revalidates the command against the current host, session, and catalog revisions under a one-use, revision-bound ticket before submission; the mutation path is fail-closed if the binding does not match. No auto-submit path exists, so inserting a command never by itself triggers execution.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `apps/pi-remote-web/src/ComposerCommandAutocomplete.tsx` | Component | Inline nonmodal command autocomplete surface |
| `apps/pi-remote-web/src/insertSlashCommand.ts` | Shared | Insertion reducer replacing the leading token with canonical command |
| `apps/pi-remote-web/src/submitSlashDraft.ts` | Shared | Explicit-send path with revision-binding validation before ticketed submit |
| `apps/pi-remote-relay/src/commands/command-service.ts` | Handler | Requests Pi get_commands and projects the bounded filtered catalog |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `apps/pi-remote-web/tests/ComposerCommandAutocomplete.test.tsx` | component | Slash trigger, filtering, virtual focus, insertion |
| `apps/pi-remote-web/tests/submitSlashDraft.test.ts` | unit | Revision-binding validation and fail-closed send |
| `apps/pi-remote-relay/tests/commands.test.ts` | integration | Relay catalog projection and privileged-name filtering |

---

## 4. SOURCE METADATA

- Group: mobile-ui-features
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mobile-ui-features/slash-commands.md`
- Current status: shipped

Related references:

- [composer.md](composer.md) - the composer surface that hosts the slash autocomplete