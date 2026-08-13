# Iteration 001: Product baseline and durable event envelope

## Focus

Establish what Claude Code Remote Control ships today, then define the first relay event contract that lets Pi exceed it without moving process, data, or authority boundaries out of the 041 TypeScript relay.

## Actions Taken

- Read the 041 parent and relay/PWA/approval/push phase packets as the local architectural baseline.
- Read official Claude Code Remote Control documentation and the current Pi RPC documentation.
- Compared Claude's “window into a local session” model with a relay-owned, replayable event model.

## Findings

1. **Claude's strongest parity baseline is local execution plus multi-surface continuity.** Remote Control keeps the session running on the user's machine, exposes it to claude.ai/code and the iOS/Android app, syncs terminal/browser/phone surfaces, reconnects after sleep or network interruption, offers a QR-code pairing path, and surfaces online status in the mobile session list. This is the minimum parity bar, not a reason to copy its cloud account or trust model. [SOURCE: https://code.claude.com/docs/en/remote-control]

2. **Claude's current attention model is deliberately coarse.** Official docs describe push for a long-running task finishing or Claude needing a decision, but expose no public typed event vocabulary or per-event policy beyond an on/off setting. Pi can exceed this by making attention a bounded enum (`needs_input | finished | error`) derived only from committed relay transitions, while keeping all decision content behind authenticated pull. [SOURCE: https://code.claude.com/docs/en/remote-control]

3. **Pi already supplies a richer source stream than a chat-only remote window.** RPC is strict LF-delimited JSONL, has correlated responses, asynchronous events, delta-only message updates, tool execution lifecycle events, queue state, compaction/retry state, session stats, and an explicit `agent_settled` terminality signal. The relay should preserve those distinctions instead of flattening them into “assistant text.” [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]

4. **Recommended event envelope: durable, redacted, replayable, and typed by visibility.**

   ```json
   {
     "v": 1,
     "eventId": "ev_opaque_256bit",
     "kind": "transcript.text_delta",
     "workspaceId": "ws_opaque",
     "sessionId": "ses_opaque",
     "epoch": 7,
     "seq": 1842,
     "occurredAt": "2026-08-12T12:00:00.000Z",
     "causedBy": {"rpcRequestId": "rpc_opaque", "parentSeq": 1841},
     "visibility": "private_session",
     "attention": null,
     "payload": {"messageId": "msg_opaque", "contentIndex": 0, "delta": "..."},
     "redaction": {"policyVersion": "r1", "pathsRemoved": 0},
     "replay": {"persistedAt": "...", "snapshotEligible": true}
   }
   ```

   `epoch` and `seq` are relay-owned; `eventId` is never a filesystem path; payloads are redacted before SQLite persistence and before broadcast; `visibility` prevents a push/catalog projection from accidentally receiving transcript data. Use separate event kinds for `thinking.delta`, `plan.snapshot`, `tool.call`, `tool.input.delta`, `tool.result`, `file.diff`, `usage.snapshot`, `control.approval_pending`, `attention.changed`, and `session.settled`.

5. **The better-than-shipping proof is observable, not aesthetic.** A test can prove every connected device receives the same ordered event stream after a disconnect, a replay begins at `lastAckedSeq + 1`, a stale epoch cannot mutate, and a push payload contains only `{attentionClass, opaqueSessionId, hintNonce}`. Claude's public contract proves continuity and push; this proposed contract proves continuity plus inspectable provenance, replay, redaction, and authority separation. [SOURCE: https://code.claude.com/docs/en/remote-control] [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]

## Questions Answered

- Q1: Partially answered — the envelope and event family are defined; per-axis payload schemas remain to be researched.
- Q9: Partially answered — Claude Remote Control is the parity baseline; its public surface leaves event/provenance richness as an opportunity.

## Questions Remaining

- Exact schemas for thinking, plans, tool inputs/results, diffs, cost, and approval leases.
- How push deep links can be content-free while still opening the right approval.
- How to measure multi-session, pairing, and background superiority.

## Next Focus

Iteration 002: live transcript richness — extended thinking, plan/TODO state, tool inputs/results, diff blocks, and token/cost vocabulary.

## Ruled-Out Directions

- **Chat-only `message` projection:** loses tool/plan/usage/approval semantics and cannot support auditable replay. [SOURCE: https://pi.dev/docs/latest/rpc]
- **Cloud account/session as the authority boundary:** contradicts 041's loopback-relay, tailnet-only, and foreground-authority posture. [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/spec.md]

## Sources Consulted

- https://code.claude.com/docs/en/remote-control
- https://pi.dev/docs/latest/rpc
- specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/spec.md
- specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md

## Assessment

- **newInfoRatio:** 1.00
- **Novelty justification:** This first pass converts Claude's documented continuity/push baseline and Pi's richer RPC stream into a concrete redacted, epoch/sequence event envelope and an observable superiority test.
- **Confidence:** High for the cited public behavior and 041 constraints; medium for the proposed envelope until it is reconciled against all eight axis schemas.

## Reflection

- What worked: official product documentation plus the 041 local contracts separated shipping parity from proposed relay behavior.
- What failed: no public Claude event schema was available, so a direct wire-level comparison is not claimed.
