---
title: 'Transcript projection'
description: 'Projection of the Pi event stream into typed, revisable transcript blocks.'
trigger_phrases:
  - 'Transcript projection'
  - 'typed transcript blocks'
  - 'TranscriptProjector'
  - 'projectSubmittedPrompt'
version: 1.0.0.0
---

# Transcript projection (TranscriptProjector)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Projection of the Pi event stream into typed, revisable transcript blocks.

The projector converts every Pi RPC event into one or more typed blocks that the ledger can store and the web client can render. It also projects submitted phone prompts as user text blocks without persisting any command authority.

Current status: shipped.

---

## 2. HOW IT WORKS

### Event Families

Agent, turn, message, tool, queue, compaction, retry, summarization, and extension events each map to a block body. Streaming text, thinking, and tool call deltas buffer in memory and emit the accumulated value on each update, so the client sees revisions of the same stable block id rather than a growing list.

### Block Identity

Each block carries a stable id derived from its key, an incrementing revision, a monotonic sequence, and an occurrence time. Tool results for file mutation tools also emit a file diff block with the patch, and usage blocks carry token and cost counts.

---

## 3. SOURCE FILES

### Implementation

| File                                                     | Layer  | Role                                                                 |
| -------------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| `apps/pi-remote-relay/src/store/transcript-projector.ts` | Shared | Implements event to block projection and submitted prompt projection |

### Validation And Tests

| File                                                      | Type   | Role                                                 |
| --------------------------------------------------------- | ------ | ---------------------------------------------------- |
| `apps/pi-remote-relay/tests/transcript-projector.test.ts` | Vitest | Covers Pi event to transcript block projection       |
| `apps/pi-remote-web/tests/App.test.tsx`                   | Vitest | Renders every projected block kind in the web client |

---

## 4. SOURCE METADATA

- Group: transport-and-state
- Canonical catalog source: `README.md`
- Feature file path: `transport-and-state/transcript-projection.md`
- Current status: shipped

Related references:

- [lf-jsonl-framing-and-demux.md](lf-jsonl-framing-and-demux.md) - the stream that feeds events to the projector
- [typed-block-transcript.md](../pwa/typed-block-transcript.md) - the client renderer for projected blocks
