# Iteration 3: Disconnect-safe state model and reconnection protocol

## Focus
Design the state model and reconnect protocol that prevents duplicated prompts, lost deltas, and stale approvals across browser disconnects, Pi-child restarts, and relay restarts — grounded in Pi's actual durability surfaces (`get_entries(since)`, `leafId`, request `id` correlation) and established exactly-once/idempotent-consumer patterns.

## Findings
1. **High — the reconnect protocol is an application subprotocol: server-assigned monotonic `seq` per session stream, persist-before-fan-out, replay `seq > cursor`, cumulative ACKs.** WebSocket is only a transport (RFC 6455 defines no replay/cursor/dedup); the relay must assign a per-stream monotonic `seq` (never wall-clock), persist envelopes before fan-out, and have the client ACK `processedThroughSeq` cumulatively — lost ACKs are safe because replay is idempotent. If the client sees `seq > cursor + 1` it must stop applying live events and request replay/snapshot; gap-free handoff requires replay-then-live ordering. [SOURCE: https://www.rfc-editor.org/info/rfc6455/] [SOURCE: https://socket.io/docs/v4/delivery-guarantees/] [SOURCE: https://socket.io/docs/v4/connection-state-recovery/] [SOURCE: https://ably.com/docs/platform/architecture/idempotency]
2. **High — client mutations need a stable `clientMutationId` and a server-side idempotency record that also stores a payload digest; Pi's `id` field is correlation-only.** Pi RPC supports an optional `id` for request/response correlation (and `bash_execution_update` correlation), but inspection of `rpc-types.d.ts`/`rpc-types.ts` found no idempotency, client-id, or dedup fields: nothing documents duplicate-safe prompt submission. The relay therefore assigns each client mutation a stable ID, persists an outcome record keyed by (authenticated principal, clientMutationId) **plus a canonical payload digest**, and on retry (a) returns the recorded outcome when the digest matches, (b) rejects with a conflict error when the same ID arrives with a different payload — an altered retry must never silently alias the original outcome. This is the standard "at-least-once transport + exactly-once effect via idempotent handlers" pattern; a blanket end-to-end exactly-once claim is explicitly not available because the external effect (agent run) is outside the broker. [SOURCE: rpc.md:20-38] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts] [SOURCE: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-message-loss-and-duplicates] [SOURCE: https://ably.com/docs/platform/architecture/idempotency]
3. **High — Pi's reconciliation surface is `get_entries(since)` + `leafId` + `get_state`; entry ids are the durable cursor, and an invalid cursor forces a full snapshot.** On reconnect the relay (a) replays retained envelopes after the client's last event seq, then (b) reconciles with Pi: `get_entries(since=lastEntryId)` returns strictly-newer entries plus `leafId` (null for empty sessions), and `success:false` on an unknown `since` means the client must fall back to `get_messages`/`get_tree` for an authoritative snapshot with a new watermark. `get_state` reports `isStreaming`/`isCompacting`/`pendingMessageCount`, which lets the relay distinguish "agent still running" from "idle" after reconnect. [SOURCE: rpc.md:162-215] [SOURCE: rpc.md:694-722] [SOURCE: rpc.md:597-614]
4. **High — the Pi-child crash window makes prompt outcome indeterminate only when no acceptance response arrives; a received success response is a legitimate persisted outcome.** Pi's contract: `success: true` means accepted/queued/handled — that response, when received, is exactly what the relay should record as the mutation outcome for dedup. The indeterminate case is bounded: relay/Pi crash between stdin write and response delivery. Exactly-once is bounded per system: the relay should (a) persist each mutation before writing to stdin, (b) on child restart re-open the session (`switch_session` by path), (c) resolve each in-flight mutation that never got a response by checking `get_entries(since=lastEntryId)` for a matching user entry, marking the outcome `indeterminate` when no entry proves delivery, and (d) surface "may not have been sent; resend or cancel" in the UI rather than auto-resending, because an auto-resend could duplicate a prompt that actually was accepted. `queue_update` (steering/followUp arrays) restores queue visibility after reconnect. [SOURCE: rpc.md:43-76] [SOURCE: rpc.md:1017-1029] [SOURCE: https://kafka.apache.org/22/design/design/] [SOURCE: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/single-producer-single-consumer.html]
5. **High — approvals are epoch-scoped and lease-guarded: unique dialog ids, duplicate/stale responders rejected, child restart invalidates outstanding dialogs, and multi-client contention resolves by atomic compare-and-set on a lease.** The extension-UI sub-protocol blocks until a matching `extension_ui_response`; the agent auto-resolves dialogs with a `timeout` when present (client needs no own timer, but must still render expiry). After a child restart there is no agent side waiting for the old dialog id, so the relay must (a) track the child/session epoch, (b) drop or mark-stale all outstanding dialogs on epoch change, (c) reject `extension_ui_response` whose id is not in the outstanding map, and (d) never apply a first-response from before the epoch boundary. For multi-client contention the relay gives each open dialog a lease (owner, token, expiry, version) and applies only the first decision via an atomic CAS on `(status=open, version)` — the lease prevents two devices racing to answer the same dialog; while the lease is held by one client, other clients see the dialog as pending-on-other-device and are routed to observe rather than answer (or the lease can be explicitly transferred). [SOURCE: rpc.md:1144-1335] [SOURCE: rpc.md:882-888]
6. **Medium — compaction and forks move the entry landscape; `firstKeptEntryId` and the entry-tree APIs act as snapshot barriers.** `compaction_end` returns `result.firstKeptEntryId` (history before it is summarized) and `willRetry` semantics; `get_tree` exposes the branch structure; `fork`/`clone` create new branch contexts. A client holding a cursor older than `firstKeptEntryId` must accept a full-entry refresh rather than partial replay. The relay should treat compaction_end and session switches as snapshot barriers: replay normal envelopes up to the barrier, then issue a full reconciliation from the barrier's watermark. [SOURCE: rpc.md:374-412] [SOURCE: rpc.md:574-694] [SOURCE: rpc.md:1029-1069]

### Durable relay schema (v1)
```text
sessions:      sessionId, sessionPath, displayName, epoch, lastEntryId, state (active/idle/stopped)
envelopes:     seq (per session stream), eventId, epoch, rawEvent, created_at   -- append-only, bounded retention
mutations:     clientMutationId, principal, sessionId, kind (prompt/steer/...), payloadDigest, payload, status (pending/accepted/indeterminate/done/failed), outcome, created_at   -- digest mismatch on same ID => conflict error
approvals:     dialogId, sessionId, epoch, method, payload, payloadDigest, status (open/answered/expired/stale), leaseOwner, leaseToken, leaseExpiry, version, responder, answered_at   -- first decision wins via atomic CAS on (status=open, version); lease for multi-client contention
client_cursors: principal, sessionId, lastEventSeq, lastEntryId                 -- per client watermark
```

## Questions Answered
- What state model and reconnection protocol prevent duplicated prompts, lost deltas, or stale approvals? (answered with the envelope/mutation/approval/epoch model above)

## Questions Remaining
- Which security and network exposure model is safe for a coding agent with workspace tool authority? (iteration 4)
- How should PWA notifications, background limits, and Claude-style mobile UX be implemented and phased? (iteration 5)

## Ruled Out
- **Wall-clock-based replay cursors:** must be monotonic server sequence per stream. [SOURCE: https://ably.com/docs/platform/architecture/idempotency]
- **Auto-resending in-flight prompts after a Pi-child crash:** duplicate risk; UI must surface `indeterminate` and ask. [INFERENCE from finding 4]
- **Client-side approval timeout tracking:** the agent-side `timeout` auto-resolve is authoritative; client only renders expiry. [SOURCE: rpc.md:1167-1186]
- **Broker-side dedup alone (e.g., SQS FIFO 5-minute window):** bounded windows do not cover long-lived agent runs; consumer-side idempotency is mandatory. [SOURCE: https://docs.aws.amazon.com/cli/latest/reference/sqs/send-message.html]

## Dead Ends
- No replay/event-cursor exists in Pi's raw event stream — confirmed again by the absence of replay fields in rpc-types; the relay sequence is the only replay surface. Not exhausted: live transcript of a crash fixture.

## Edge Cases
- Contradictory evidence: none; RFC 6455 (transport-only) vs application subprotocols (Socket.IO/Ably) agree on where replay must live.
- Missing dependencies: no Pi-native idempotency field — relay-owned ledger is required.
- Ambiguous input: "exactly-once" interpreted as bounded at-least-once transport with idempotent effects, per messaging-systems literature.

## Sources Consulted
- [SOURCE: rpc.md:43-76, 162-215, 374-412, 574-694, 882-888, 1017-1069, 1144-1335]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts]
- [SOURCE: https://www.rfc-editor.org/info/rfc6455/]
- [SOURCE: https://socket.io/docs/v4/delivery-guarantees/]
- [SOURCE: https://socket.io/docs/v4/connection-state-recovery/]
- [SOURCE: https://ably.com/docs/platform/architecture/idempotency]
- [SOURCE: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-message-loss-and-duplicates]
- [SOURCE: https://kafka.apache.org/22/design/design/]
- [SOURCE: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/single-producer-single-consumer.html]
- [SOURCE: https://docs.aws.amazon.com/cli/latest/reference/sqs/send-message.html]

## Assessment
- New information ratio: 0.90 (5 of 6 findings fully new; finding 1 partially anticipated by iteration 1 finding 6's sequencing note)
- Questions addressed: 1 of 3 remaining key questions (reconnect protocol), answered.
- Confidence: high on Pi surfaces (primary docs + type declarations); high on replay/dedup patterns (vendor + RFC sources); medium on crash-window behavior (inferred, no live crash fixture).

## Reflection
What worked: inspecting the installed type declarations to prove the absence of idempotency fields — negative evidence is strong here; the messaging literature supplied canonical idempotent-consumer and replay protocols that map 1:1 onto the relay.
What failed: no live Pi crash fixture; the indeterminate-outcome path is inferred from the acceptance contract.
What was ruled out: wall-clock cursors, auto-resend after crash, client-side approval timers, broker-dedup-only.

## Recommended Next Focus
Security and network exposure: Tailscale Serve vs WebSocket-bridge threat model, authN/authZ for the relay (identity, per-action authorization, origin/session controls), secrets and workspace containment, and audit; ground in official Tailscale Serve/grants docs and OWASP WebSocket guidance.
