---
title: 'RPC supervision'
description: 'Persistent supervision of one Pi RPC child with bounded restart and recorded fixture fallback.'
trigger_phrases:
  - 'RPC supervision'
  - 'pi rpc child supervision'
  - 'RpcSupervisor'
  - 'fixture fallback'
version: 1.0.0.0
---

# RPC supervision (RpcSupervisor)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Persistent supervision of one Pi RPC child with bounded restart and recorded fixture fallback.

The relay owns exactly one `pi --mode rpc` child and exposes send, event, error, health, start, and stop operations. The supervisor is the single command path for prompt steering and the fallback source of recorded Pi RPC events when the live child is unavailable.

Current status: shipped.

---

## 2. HOW IT WORKS

### Core Behavior

The supervisor spawns the child with a fixed argument set, pipes stdin, stdout, and stderr, and serializes every command write through one promise chain so the stream stays ordered. Each command carries a generated id when the caller does not supply one, and the response promise is registered with the demultiplexer before the write lands.

### Restart and Fallback

A missing binary or an unexpected child exit triggers exponential backoff restarts up to a fixed bound, after which the state becomes failed. When the binary is absent or the fixture flag is set, the supervisor replays the recorded fixture stream through the same decoder and demultiplexer, and reports the fixture state. Stopping the supervisor rejects all pending responses and terminates the owned child without touching unrelated processes.

### Health and Events

Health returns state, restart count, and stderr byte count only. Parsed events and framing or protocol errors reach subscribers through independent listener sets, and every pending response is rejected when the child exits.

---

## 3. SOURCE FILES

### Implementation

| File                                             | Layer   | Role                                                                                |
| ------------------------------------------------ | ------- | ----------------------------------------------------------------------------------- |
| `apps/pi-remote-relay/src/rpc/supervisor.ts`     | Handler | Owns the child lifecycle, serialized writes, restart policy, and fixture activation |
| `apps/pi-remote-relay/src/rpc/demux.ts`          | Shared  | Correlates responses by id and delivers events                                      |
| `apps/pi-remote-relay/src/rpc/framing.ts`        | Shared  | Decodes the stdout stream into records                                              |
| `apps/pi-remote-relay/src/fixtures/pi-rpc.jsonl` | Fixture | Recorded Pi RPC stream used for fallback                                            |

### Validation And Tests

| File                                                      | Type        | Role                                                                     |
| --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `apps/pi-remote-relay/tests/rpc.test.ts`                  | Vitest      | Covers supervisor command writes, restart bounds, and fixture activation |
| `apps/pi-remote-relay/tests/prompt.test.ts`               | Vitest      | Drives prompt commands through the live supervisor                       |
| `apps/pi-remote-relay/tests/kill-points/recovery.test.ts` | Integration | Exercises child exit and restart outcomes at process boundaries          |

---

## 4. SOURCE METADATA

- Group: transport-and-state
- Canonical catalog source: `README.md`
- Feature file path: `transport-and-state/rpc-supervision.md`
- Current status: shipped

Related references:

- [lf-jsonl-framing-and-demux.md](lf-jsonl-framing-and-demux.md) - framing and demultiplexing contract
- [prompt-steering-transport.md](../command-and-push/prompt-steering-transport.md) - the main consumer of the supervised child
