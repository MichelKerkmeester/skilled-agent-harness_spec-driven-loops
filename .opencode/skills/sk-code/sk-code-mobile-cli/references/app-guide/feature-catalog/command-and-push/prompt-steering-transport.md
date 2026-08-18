---
title: 'Prompt steering transport'
description: 'Steering prompt submission through the supervised RPC child with redacted projection.'
trigger_phrases:
  - 'Prompt steering transport'
  - 'steering prompt'
  - 'prompt submit'
  - 'PromptService'
  - 'streamingBehavior steer'
version: 1.0.0.0
---

# Prompt steering transport (PromptService)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Steering prompt submission through the supervised RPC child with redacted projection.

The web client sends a prompt through the relay, which forwards it to the Pi child with the steer streaming behavior and commits only the redacted transcript projection back to the ledger. The prompt command itself never persists.

Current status: shipped.

---

## 2. HOW IT WORKS

### Single Flight

One submission is in flight at a time, and each submission id is single-use. A reused id with different content is refused, a complete submission returns its stored block, and a delivery-unknown outcome blocks automatic retry because the execution result is unknowable.

### Commit Path

A successful child response projects the submitted message as a user text block and publishes it through the sync hub. A publish failure marks the record delivery-unknown, and a successful commit stores the returned block so a retried client call returns the same committed block. The compose box shows the optimistic block until the committed block replaces it.

---

## 3. SOURCE FILES

### Implementation

| File                                                | Layer   | Role                                                           |
| --------------------------------------------------- | ------- | -------------------------------------------------------------- |
| `apps/pi-remote-relay/src/prompt/prompt-service.ts` | Handler | Implements submission, single-flight, and committed projection |
| `apps/pi-remote-relay/src/http/server.ts`           | Handler | Exposes the prompt submit route with ticket and rate guards    |
| `apps/pi-remote-web/src/relay.ts`                   | Handler | Submits prompts from the compose box                           |

### Validation And Tests

| File                                                                   | Type        | Role                                                         |
| ---------------------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| `apps/pi-remote-relay/tests/prompt.test.ts`                            | Vitest      | Covers live prompt command transport through the supervisor  |
| `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts` | Integration | Covers optimistic prompt reconciliation with the web reducer |
| `apps/pi-remote-web/tests/App.test.tsx`                                | Vitest      | Submits the compose box through the relay command path       |

---

## 4. SOURCE METADATA

- Group: command-and-push
- Canonical catalog source: `README.md`
- Feature file path: `command-and-push/prompt-steering-transport.md`
- Current status: shipped

Related references:

- [rpc-supervision.md](../transport-and-state/rpc-supervision.md) - the child that carries the prompt command
- [compose-box.md](../pwa/compose-box.md) - the client surface that sends prompts
