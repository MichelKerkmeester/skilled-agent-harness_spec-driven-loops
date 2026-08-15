# Iteration 1: Typed Envelope, sync.* Semantics, and the Diff-Truth Model

## Focus
Audit the versioned typed event envelope (003 REQ-006), the `sync.delta`/`sync.snapshot`/`sync.gap` recovery vocabulary, and the reconciliation/diff-truth model consumed by 005 reducers and 006/007 attention events. Target gap class (b) underspecified mechanisms and (c) cross-phase inconsistencies.

## Actions Taken
- Read 003 spec in full, focusing on REQ-002 (durable monotonic replay), REQ-006 (typed envelope), REQ-005 (bounds) and scope lines for epochs/sequences (003/spec.md:106-110, 116).
- Read 005 spec, focusing on REQ-001 (authoritative monotonic state), REQ-002 (loss-aware reconnect), SC-002 (retention misses force snapshot barrier) (005/spec.md:109-112, 005 spec §5).
- Read 006 REQ-007 approval event exchange and 007 REQ-005 attention class contract to trace how events cross the envelope (006/spec.md:111, 007/spec.md:108).
- Read parent spec problem statement re "without making the browser socket the process, data, or authority boundary" (041/spec.md §2).

## Findings

### F1.1 — `sync.delta` / `sync.snapshot` / `sync.gap` are named but never defined as message schemas [P0, 003]
003 REQ-006 requires consumers to "request an explicit `sync.snapshot` or `sync.gap` instead of blending state", but no requirement anywhere defines these three request/response message types: their fields, their ordering guarantees, idempotency, rate/size bounds, or how a gap is enumerated (missing range? since-sequence cursor? both). Without a defined schema, 005 REQ-002's "retained replay, state/entry recovery, snapshot barriers" cannot be implemented or tested, and 002 REQ-002's crash-point assertions (002/spec.md:107) have no wire contract to assert against. Remediation: add REQ-010 to 003 defining `sync.delta` (from-sequence cursor), `sync.snapshot` (epoch-bound, atomic apply marker), and `sync.gap` (missing-range request + bounded response) with explicit idempotency keys and a maximum gap-response size under REQ-005 bounds.

### F1.2 — The diff-truth model is undefined: monotonic immutable envelopes vs. mutable draft→terminal replacement [P0, 003+005]
003 REQ-002 makes replay "durable and monotonic" with duplicate suppression over immutable envelopes, while 005 REQ-001 says "terminal messages replace drafts, tool updates replace partial state". These two claims are only consistent if there is a defined projection (reduction) function that maps the immutable envelope stream to replaceable client state. No requirement defines: the canonical projection, its commutativity (do two clients applying the same stream in different orders converge?), or the identity that links a draft to its terminal replacement (draft_id? content index? sequence?). 005 REQ-001's "content index" is itself undefined. Remediation: add REQ-011 to 003 or REQ-010 to 005: "The client state is a pure projection of the envelope stream under a published reduction function; replacement is keyed by a stable contentId carried in causedBy/related-event metadata; any two clients applying the same stream converge to identical state." This makes SC-001 (authoritative monotonic state) testable.

### F1.3 — Reconnect reconciliation ordering race: snapshot-apply vs. live-delta interleaving is unhandled [P0, 005]
005 REQ-002 lists "reauthentication, retained replay, state/entry recovery, snapshot barriers, and live handoff" but no requirement defines the ordering contract between applying a snapshot and applying live deltas that arrive mid-transfer. If a client reconnects and requests a snapshot barrier while live events continue, the events that arrive between snapshot request and snapshot apply must be either (a) buffered and applied after, or (b) included in the snapshot with the client discarding the live window. Without a defined barrier protocol (e.g. snapshot carries a `coversThrough` sequence and the client drops buffered events ≤ that sequence), the result is duplicate or missing visible content — exactly what REQ-002 forbids but does not prevent. Remediation: add REQ-012 to 005: "Snapshot responses carry coversThrough (epoch, sequence); the client applies buffered live deltas only after snapshot apply and drops deltas ≤ coversThrough; ordering is asserted by the browser harness (002 lane)."

### F1.4 — Epoch bump is never coupled to revocation or lease invalidation; stale-state revalidation has no signal [P1→P0, 003+004+007]
004 REQ-006 says revocation "invalidates the device's capabilities and leases and disconnects its sockets", and 007 REQ-002 says opening a hint "revalidates revocation and current epoch" — but no requirement says revocation (or lease invalidation, or enrollment supersession) bumps the stream epoch. If the epoch does not change on revocation, a revoked device's cached offline state remains indistinguishable from live state after reconnect (the client only revalidates "current epoch", and if it is unchanged, nothing forces a snapshot barrier). This is a cross-phase gap: revocation semantics in 004 need a durable consequence in 003's epoch model. Remediation: add REQ-013 to 003: "Revocation, device-key rotation, and lease invalidation MUST bump the affected session's stream epoch and force a snapshot barrier on reconnect; the epoch is the staleness signal consumed by 007 REQ-002."

### F1.5 — Approval events conflict with the "commands are never replayed as events" invariant [P0, 003+006]
003 REQ-006: "commands travel a separate authenticated channel with idempotency keys and preconditions and are never replayed as events." 006 REQ-007: "Approval is a typed event exchange" with `approval.requested` / `approval.decide` / `approval.result` "carrying ... idempotency key". The 006 wording makes the decision look like part of the typed event exchange, which collides with the 003 invariant that commands (which `approval.decide` functionally is — it mutates lease state) never ride the replayable event channel. The spec does not state which channel `approval.decide` travels on, nor whether `approval.result` is broadcast on the envelope (so all devices see the settlement) or returned only to the deciding client. If `approval.result` is broadcast, it must be redacted per 006 REQ-004; if not, other devices cannot converge on lease state — contradicting multi-device consistency implied by 005 REQ-003 and 004 REQ-006. Remediation: add REQ-014 to 006 (or an ADR): "approval.decide is a command on the authenticated command channel (never replayed); approval.requested and approval.result are envelope events with redacted render-safe payloads broadcast to all authorized devices; the client's submitted/verifying state resolves only from approval.result."

### F1.6 — Redaction metadata schema and canonical redaction function are unspecified; approval cards need a render-safe representation [P0, 003+006]
The envelope "redaction metadata" (003 REQ-006) and "shared redaction" (006 key decision) are named but no requirement defines: the redaction metadata fields, the placeholder convention, whether redaction is deterministic (same input → same output across replay/snapshot/audit), or the "shared" boundary (relay vs. extension vs. client). Critically, 006 REQ-007 approval cards must show the user what they are approving — a canonical digest cannot be rendered — so there must be a render-safe representation of the action (tool name + redacted args) that is redaction-consistent with the digest. 006 has no requirement for it. Remediation: add ADR-004 to 006 (or REQ-015): "Define a canonical redaction function shared by relay, extension, and client with deterministic placeholders; approval.requested carries a render-safe redacted action representation bound to the digest; canary tests (006 REQ-004) assert determinism across replay, snapshot, audit, and push paths."

### F1.7 — `causedBy` and replay-eligibility flags have no cardinality or lifecycle contract [P1, 003]
The envelope carries `causedBy` and "replay/snapshot eligibility" flags (003 REQ-006) but nothing defines: whether causedBy is single-cause or many-to-many, whether eligibility flags are immutable once persisted, how eligibility interacts with retention floors (003 REQ-002) and snapshot barriers, or what happens when a cause event is itself redacted or pruned (dangling causedBy). This matters for audit trails and the mutation ledger (003 REQ-003), which is keyed on principal/session/clientMutationId/digest — the linkage between ledger outcomes and envelope causedBy is absent. Remediation: add REQ-016 to 003: "causedBy is a single causal edge (id + kind) with one cardinality; eligibility flags are immutable; pruned causes are replaced by a tombstone marker; the mutation ledger row references the causing envelope id."

## Questions Answered
- KQ-1 partially: identified envelope/sync./diff-truth/causedBy/redaction-metadata mechanisms that are named but undefined.
- KQ-5 partially: documented the approval-event/command-channel contradiction (F1.5) and epoch/revocation inconsistency (F1.4).

## Questions Remaining
- KQ-1 (remainder): containment primitive, Serve identity signal, SQLite/migration, device-key rotation mechanics.
- KQ-2, KQ-3, KQ-4: untouched this iteration (assigned to later iterations).

## Next Focus
Iteration 2: Auth/tailnet boundary + device lifecycle — QR enrollment ceremony, Serve identity signal mechanism, revocation/key rotation, multi-device management, and the loopback-spoofing problem (004 REQ-006/007, 007 REQ-003).

## Sources Consulted
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md:106-110]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md:116]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation/spec.md:109-112]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md:106,111]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md:108]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/spec.md:105-117]

## Assessment
- newInfoRatio: 0.9 — first iteration; 7 distinct findings, all net-new to this packet; the envelope/sync/diff-truth axis has not been analyzed in this adversarial framing.
- Confidence: high for F1.1-F1.6 (directly grounded in spec text); medium for F1.7 (causedBy cardinality is an inference from the absence of a contract).

## Reflection
What worked: tracing each named mechanism (sync.*, content index, epoch, causedBy, redaction metadata) to its consumers in later phases exposed gaps that a per-phase read alone misses.
What failed: no executable source to verify Pi's actual RPC envelope shape — findings are contract-level only, which is appropriate for a planning-gap pass.
Ruled out: not pursuing a full schema draft for the envelope (out of scope for gap research; REQ-level remediation only).
