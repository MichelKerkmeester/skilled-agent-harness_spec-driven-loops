# Iteration 04 - ROOT CAUSE + SEVERITY

## Severity Model Used

P0 means data loss, stream corruption, silent hang, or severed pipe. P1 means wrong behavior on recycle. P2 means hardening or non-default edge behavior.

## Confirmed Findings

| Finding | Severity | Root cause | Contract violated | Fix direction |
|---|---:|---|---|---|
| Keepalive private ID can collide with a client request ID and consume the real response. | P0 | The proxy uses a normal JSON-RPC request ID namespace for internal keepalive and consumes matching responses before normal pending-request handling (`launcher-session-proxy.cjs:464-475`, `508-520`). It does not reject or guard client IDs that use the private prefix (`launcher-session-proxy.cjs:129-137`, `485-491`). | Frame-aware proxy must never corrupt or hide client-visible frames; spec requires no stream corruption (`spec.md:130-137`, `decision-record.md:223-235`). | Do not use a collision-prone JSON-RPC ID for keepalive, or reject/fail any client request ID in the reserved prefix while a keepalive can exist. Add a unit test where the client request ID equals the pending keepalive ID and its response must be delivered or the request must be rejected up front. |
| Second-launcher bridge path is still severed by daemon recycle. | P0 for shared launcher; known out-of-scope for single-client contract. | Lease-held launchers still use raw `bridgeStdioToSocket()` rather than `createSessionProxy()` (`launcher-ipc-bridge.cjs:79-121`, `304-357`). Raw bridge exits on socket close (`launcher-ipc-bridge.cjs:86-93`, `106-107`). | The packet explicitly excludes multi-client transparency (`spec.md:83-87`), but the user's merge target is the shared launcher. A shared launcher cannot silently sever a second client during recycle. | Either keep merge scoped to single-client deployments, or route bridge mode through the reconnecting frame proxy as well. At minimum, add an integration test documenting second-launcher severance and make the merge gate explicit. |
| `memory_save` replay after commit-before-enrichment can skip enrichment. | P2 | Dedup correctly prevents duplicate primary rows after full commit (`memory-save.ts:2248-2259`; `dedup.ts:213-282`), but post-insert enrichment runs after commit (`memory-save.ts:2648-2655`). If the daemon dies after commit and before enrichment, replay returns `unchanged` and does not re-run enrichment. | The design calls out secondary-index partial-commit idempotency as a safety-phase concern (`tasks.md:116-118`). | Add an idempotency/recovery token or make replay of `unchanged` rows verify and repair enrichment completion. Alternatively schedule a deterministic backfill on replay when a committed row lacks required enrichment markers. |
| Re-handshake ignores protocol-version drift. | P2 | `internalHandshake()` only validates response ID and result/error presence (`launcher-session-proxy.cjs:212-268`); it never compares the backend's negotiated protocol version to the cached initialize result. | Packet task T023 requires fail-closed on re-handshake protocol mismatch (`tasks.md:95-98`). | Parse the cached initialize params and internal initialize response; if response protocol version differs from the original negotiated version, synthesize retryable errors and EOF instead of replaying. Add a unit test for mismatch. |

## Negative Results

| Hypothesis | Result |
|---|---|
| Backend-only liveness without stdio | Refuted for default path; IPC server is a refed event-loop handle. |
| hf-model-server recycle interaction | Refuted in traced code; child and sidecar teardown are preserved before context-server recycle. |
| Multi-recycle duplicate/loss | Refuted by state machine and existing replay-after-fresh-socket-failure test. |
| Backpressure plus recycle | Refuted; stale drain wait is explicitly cleared on detach. |
| Crash-loop exhaustion hangs | Refuted by `failPendingAndEnd()` and existing exhaustion test. |
| Partial backend frame leaks | Refuted by splitter discard and existing truncated-frame test. |
| Partial client frame lost | Refuted; client splitter is not discarded on backend failure. |
| Notification/no-id frame loss | Refuted; gap frames queue and flush even without pending IDs. |
| Frame ordering/reorder | Refuted except for the keepalive ID collision, which is a distinct ID-namespace bug. |
