---
title: 'Typed-block transcript'
description: 'The live transcript view that renders typed, revisable blocks from sync messages.'
trigger_phrases:
  - 'Typed-block transcript'
  - 'live transcript'
  - 'transcript reducer'
  - 'transcriptReducer'
  - 'sync snapshot'
version: 1.0.0.0
---

# Typed-block transcript (transcriptReducer, Session)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The live transcript view that renders typed, revisable blocks from sync messages.

Blocks normalize by stable id and revision, an epoch change triggers a reconciliation barrier until a fresh snapshot arrives, and the list virtualizes long transcripts. Every block kind has a dedicated renderer, including redacted file diffs and usage rows.

Current status: shipped.

---

## 2. HOW IT WORKS

### Reducer Semantics

The transcript reducer hydrates from cache, applies a fetched page, then consumes snapshots, deltas, and gaps from the sync socket. Blocks deduplicate by id with the highest revision winning, and a delta for a new epoch resets the view and raises the awaiting-snapshot barrier until the snapshot lands.

### Rendering

The list virtualizes rows and announces completed blocks for screen readers. Text, thinking, plan, tool call, tool result, file diff, and usage kinds each render with their own layout, and an unrecognized but shape-valid block renders as an unsupported block with its original kind named.

---

## 3. SOURCE FILES

### Implementation

| File                              | Layer   | Role                                                      |
| --------------------------------- | ------- | --------------------------------------------------------- |
| `apps/pi-remote-web/src/state.ts` | Shared  | Implements the transcript reducer and block normalization |
| `apps/pi-remote-web/src/App.tsx`  | Handler | Renders the live transcript view and block renderers      |
| `apps/pi-remote-web/src/relay.ts` | Handler | Fetches transcript pages and opens the sync socket        |

### Validation And Tests

| File                                                                   | Type        | Role                                               |
| ---------------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `apps/pi-remote-web/tests/App.test.tsx`                                | Vitest      | Renders every projected transcript block kind      |
| `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts` | Integration | Reconciles optimistic prompts with the web reducer |

---

## 4. SOURCE METADATA

- Group: pwa
- Canonical catalog source: `README.md`
- Feature file path: `pwa/typed-block-transcript.md`
- Current status: shipped

Related references:

- [transcript-projection.md](../transport-and-state/transcript-projection.md) - the relay source of typed blocks
- [compose-box.md](compose-box.md) - the composer bound to the same transcript state
