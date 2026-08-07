# Resource Map — gpt55r2-c-6

## Evidence Map

| Finding | Primary Files | Evidence Anchors |
| --- | --- | --- |
| P1-001 | `socket-server.ts`, `context-server.ts`, `spec-memory.cjs`, `launcher-ipc-bridge.cjs`, `model-server-supervision.cjs`, `ENV_REFERENCE.md` | `ENV_REFERENCE.md:180`, `spec-memory.cjs:108`, `launcher-ipc-bridge.cjs:81`, `model-server-supervision.cjs:444`, `context-server.ts:2319`, `socket-server.ts:201`, `socket-server.ts:273` |
| P1-002 | `launcher-session-proxy.cjs`, `launcher-session-proxy.vitest.ts`, `daemon-recycle-transparency-stress.vitest.ts`, `README.md` | `launcher-session-proxy.cjs:33`, `launcher-session-proxy.cjs:146`, `launcher-session-proxy.vitest.ts:258`, `daemon-recycle-transparency-stress.vitest.ts:184`, `README.md:266` |

## Phase-5 Augmentation

Novel logic gaps identified:
- TCP IPC support is present in downstream listen/connect layers but not preserved by the spec-memory backend socket-path resolver.
- `memory_save` replay has documented primary-row idempotency but lacks secondary-index idempotency, while the proxy still classifies it replayable.
