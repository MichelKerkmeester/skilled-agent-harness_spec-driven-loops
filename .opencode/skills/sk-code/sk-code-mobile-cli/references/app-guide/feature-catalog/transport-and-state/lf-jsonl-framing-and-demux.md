---
title: 'LF JSONL framing and demux'
description: 'Strict LF-delimited JSONL framing and request id demultiplexing for the Pi RPC stream.'
trigger_phrases:
  - 'LF JSONL framing and demux'
  - 'strict jsonl decoder'
  - 'response demultiplexer'
  - 'StrictJsonlDecoder'
  - 'RpcDemultiplexer'
version: 1.0.0.0
---

# LF JSONL framing and demux (StrictJsonlDecoder, RpcDemultiplexer)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Strict LF-delimited JSONL framing and request id demultiplexing for the Pi RPC stream.

Two modules sit between the supervised child and the rest of the relay: a decoder turns raw stdout chunks into records, and a demultiplexer routes each record to a pending response or an event listener. The pair enforces the wire shape before any higher layer sees a value.

Current status: shipped.

---

## 2. HOW IT WORKS

### Framing

The decoder buffers UTF-8 chunks and splits on LF as the only delimiter. It rejects empty records, carriage returns, records over the byte limit, trailing partial records at stream end, and JSON that fails to parse. Every rejection raises a framing error instead of guessing at a recovery point.

### Demultiplexing

The demultiplexer registers one pending response per request id before the command write, and resolves it only for a response that carries the same id. Events flow to listeners independently, and a record that matches neither a pinned response nor an event raises a protocol error. Duplicate ids and unknown response ids are rejected, and a timeout or a child exit rejects every pending response.

---

## 3. SOURCE FILES

### Implementation

| File                                      | Layer  | Role                                                              |
| ----------------------------------------- | ------ | ----------------------------------------------------------------- |
| `apps/pi-remote-relay/src/rpc/framing.ts` | Shared | Implements `StrictJsonlDecoder` with the byte and delimiter rules |
| `apps/pi-remote-relay/src/rpc/demux.ts`   | Shared | Implements `RpcDemultiplexer` with pending response correlation   |

### Validation And Tests

| File                                                      | Type        | Role                                                           |
| --------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `apps/pi-remote-relay/tests/rpc.test.ts`                  | Vitest      | Covers strict LF framing and response and event demultiplexing |
| `apps/pi-remote-relay/tests/kill-points/recovery.test.ts` | Integration | Verifies reject-all behavior when the owning child exits       |

---

## 4. SOURCE METADATA

- Group: transport-and-state
- Canonical catalog source: `README.md`
- Feature file path: `transport-and-state/lf-jsonl-framing-and-demux.md`
- Current status: shipped

Related references:

- [rpc-supervision.md](rpc-supervision.md) - owns the decoder and demultiplexer instances
- [transcript-projection.md](transcript-projection.md) - consumes the event stream after demux
