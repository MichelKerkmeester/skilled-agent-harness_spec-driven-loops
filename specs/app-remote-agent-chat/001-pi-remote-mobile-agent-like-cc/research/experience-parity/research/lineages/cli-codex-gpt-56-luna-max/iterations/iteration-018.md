# Iteration 018 — Integrated end-to-end state machine

## Question

What single protocol story ties the eight experience axes together without introducing a second authority?

## Reference sequence

1. The host starts Pi in RPC mode and the TypeScript relay owns the loopback child. Tailscale Serve exposes only the relay through HTTPS/WSS on the tailnet.
2. The host emits pairing.started; the phone scans a one-time QR, registers a device key, and receives device.registered.
3. The relay creates an opaque session catalog row and session.lifecycle with epoch 1. The phone sends work.queue or a foreground prompt command; the relay persists the command identity before forwarding to Pi.
4. Pi RPC events are normalized into the common envelope: turn.started, message.text.delta, thinking.summary.delta, plan.snapshot, tool.call.started/input/output/ended, file.diff, usage.snapshot, and turn.settled. Every event has eventId, sessionId, epoch, seq, visibility/redaction metadata, and replay state.
5. A protected tool produces approval.requested and attention.changed(needs_input). Web Push carries only class, opaque references, generation, nonce, and route. The phone opens the PWA, authenticates, and pulls the current redacted approval.
6. The phone sends approval.decide with approval ID, expected epoch/revision, digest, lease, decision, and mutation ID. The relay CASes the record. Pi recomputes the exact action at the final boundary, consumes the lease or finite grant, then emits approval.result and tool.call.ended.
7. Pi emits turn.settled and usage.snapshot. The relay emits attention.changed(finished) and an optional generic push. The session catalog updates in order.
8. A second device sync.hello with its lastAckedSeq receives the same durable delta or snapshot-plus-tail. A stale command or old push returns stale/no-longer-current; it never retargets a later action.
9. If the host dies, the session receives a new epoch. The PWA shows replay/snapshot/gap state and cannot approve until a current host lease and digest exist.

## Canonical envelope

~~~json
{"v":1,"eventId":"ev_opaque","kind":"tool.call.started","sessionId":"ses_opaque","epoch":7,"seq":1842,"occurredAt":"2026-08-12T16:30:00Z","causedBy":{"rpcRequestId":"rpc_opaque","parentSeq":1841},"visibility":"private_session","payload":{"callId":"call_opaque","tool":"bash","actionDigest":"sha256:opaque","riskClass":"protected"},"redaction":{"policyVersion":"r1","removed":0},"replay":{"durable":true,"snapshotEligible":false}}
~~~

Commands are not event payloads and cannot be replayed as authority. A command must name its session, current epoch, capability, mutation/idempotency key, and expected revision/digest as applicable. The relay may return accepted, queued, stale, denied, or indeterminate; only Pi final-boundary confirmation proves execution.

## Shared invariants

- Persist before broadcast; replay by contiguous epoch/sequence.
- Redact before persistence and mark omissions/truncation.
- Keep opaque IDs; user labels are the only catalog text.
- Separate read events from commands and never accept displayed payload as authority.
- Bind actions to lease/CAS/digest at the last boundary.
- Push is content-free and fetch-on-open.
- Background work requires host-minted bounded authority.
- Per-session process, epoch, queue, and capability isolate concurrency.

## Assessment

New information ratio: 0.69. Q10 has an integrated contract; iterations 019–020 will attack it with verification and negative knowledge before synthesis.
