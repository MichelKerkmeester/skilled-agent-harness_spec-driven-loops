---
title: 'Compose box'
description: 'The prompt composer that submits steering input with optimistic blocks and retry.'
trigger_phrases:
  - 'Compose box'
  - 'prompt composer'
  - 'steer pi'
  - 'optimistic prompt'
  - 'promptOptimistic'
version: 1.0.0.0
---

# Compose box (prompt-composer)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The prompt composer that submits steering input with optimistic blocks and retry.

Sending inserts an optimistic user block, submits through the relay command path, and replaces the optimistic block with the committed block on acceptance. Rejection restores the draft and keeps the same submission id for retry.

Current status: shipped.

---

## 2. HOW IT WORKS

### Submit Flow

The composer is enabled only when the connection is live, the snapshot barrier is clear, and no submission is in flight. Sending dispatches an optimistic block with the next sequence, clears the input, and calls the relay submit path. Acceptance replaces the optimistic block with the committed block, and rejection removes the optimistic block, restores the draft, and keeps the submission id.

### Guards

A delivery-unknown relay outcome blocks automatic retry because the execution result is unknowable. Enter sends while shift and enter insert a new line, and the composer disables entirely when the connection drops or the snapshot barrier is active.

---

## 3. SOURCE FILES

### Implementation

| File                              | Layer   | Role                                                      |
| --------------------------------- | ------- | --------------------------------------------------------- |
| `apps/pi-remote-web/src/App.tsx`  | Handler | Renders the composer and owns the submit flow             |
| `apps/pi-remote-web/src/relay.ts` | Handler | Submits prompts through the relay command path            |
| `apps/pi-remote-web/src/state.ts` | Shared  | Applies optimistic, accepted, and rejected prompt actions |

### Validation And Tests

| File                                        | Type   | Role                                                   |
| ------------------------------------------- | ------ | ------------------------------------------------------ |
| `apps/pi-remote-web/tests/App.test.tsx`     | Vitest | Submits the compose box through the relay command path |
| `apps/pi-remote-relay/tests/prompt.test.ts` | Vitest | Covers the relay side of the submit path               |

---

## 4. SOURCE METADATA

- Group: pwa
- Canonical catalog source: `README.md`
- Feature file path: `pwa/compose-box.md`
- Current status: shipped

Related references:

- [typed-block-transcript.md](typed-block-transcript.md) - the transcript state the composer writes into
- [prompt-steering-transport.md](../command-and-push/prompt-steering-transport.md) - the relay path behind the send action
