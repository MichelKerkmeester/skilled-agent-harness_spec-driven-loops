# Iteration 013 — Reconnect, replay, and offline behavior

## Question

What does a phone do during sleep, network loss, relay restart, and epoch rotation without losing truth or gaining stale authority?

## Evidence

Claude documents automatic reconnection after sleep/network interruption for local sessions ([Remote Control](https://code.claude.com/docs/en/remote-control)). Pi uses strict JSONL and typed responses/events ([RPC](https://pi.dev/docs/latest/rpc)). 041 requires immutable epochs, durable persist-before-broadcast, replay, and explicit indeterminate outcomes at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md.

## Findings

Use an explicit synchronization handshake:

~~~json
{"command":"sync.hello","clientId":"dev_opaque","sessions":[{"sessionId":"ses_opaque","epoch":7,"lastAckedSeq":388}],"capabilitiesHash":"sha256:opaque"}
{"kind":"sync.delta","sessionId":"ses_opaque","epoch":7,"fromSeq":389,"toSeq":410,"events":[{"eventId":"ev_opaque"}]}
{"kind":"sync.snapshot","sessionId":"ses_opaque","epoch":8,"baseSeq":0,"reason":"epoch_rotated","stateRef":"snap_opaque"}
{"kind":"sync.gap","sessionId":"ses_opaque","epoch":8,"fromSeq":12,"toSeq":20,"reason":"retention_or_corruption"}
~~~

The relay persists an event before broadcast and returns either the contiguous delta, a bounded snapshot plus tail, or an explicit gap. The PWA marks replayed content, reconciles its reducer, and refuses to invent missing blocks. If no connection exists, cached redacted state is read-only: input, approval, rename, policy, and start controls are disabled or visibly queued, never locally committed.

Every mutation includes current epoch, expected revision, action digest where relevant, and idempotency key. A stale command returns stale/reauthenticate; it cannot be applied to a later epoch. Exactly-once is not claimed across a crash; the UI exposes submitted/unknown and offers authenticated status recovery.

## Better-than-parity proof

Inject disconnects after every persisted event, before broadcast, during replay, and after command submission. Two clients must converge to the same durable state; gaps are explicit; old commands never retarget; no secret appears in cached offline artifacts.

## Prior-art comparison

Claude proves reconnection is a core remote-control expectation. 041 supplies the stronger local replay contract; the proposed PWA makes offline authority visibly read-only instead of silently optimistic.

## Assessment

New information ratio: 0.84. Q10 gains the complete recovery contract; final UX and security surfaces remain.
