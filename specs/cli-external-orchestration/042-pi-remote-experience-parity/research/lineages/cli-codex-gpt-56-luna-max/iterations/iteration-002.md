# Iteration 002 — Live transcript richness

## Question

How should the relay expose a rich, replayable mobile transcript without turning the PWA into a privileged terminal or leaking sensitive tool data?

## Evidence reviewed

- Pi RPC documents strict LF-delimited JSONL, `message_update` streaming deltas, `tool_execution_start/update/end`, `agent_settled`, and `get_session_stats` with tokens, cost, and context usage: [Pi RPC mode](https://pi.dev/docs/latest/rpc).
- Anthropic's current streaming contract separates message/content-block lifecycle, text deltas, partial tool-input JSON, thinking deltas, signatures, cumulative usage, and unknown-event tolerance: [Anthropic streaming](https://platform.claude.com/docs/en/build-with-claude/streaming) and [fine-grained tool streaming](https://platform.claude.com/docs/en/docs/agents-and-tools/tool-use/fine-grained-tool-streaming).
- OpenAI's Responses stream similarly identifies output items and reasoning summaries and reports token usage: [Responses streaming reference](https://platform.openai.com/docs/api-reference/responses-streaming/response/code_interpreter_call_code/delta).
- The 041 relay contract already requires immutable epochs, durable persist-before-broadcast replay, opaque identifiers, and redacted envelopes: `specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md`.

## Findings

### 1. Use a typed event ledger, not a rendered transcript

The relay should normalize Pi events into a small versioned envelope while retaining the source event kind in an audit field. The PWA reducer can then render a stable timeline, and a future client can ignore unknown kinds without losing ordering. A representative event is:

```json
{
  "v": 1,
  "eventId": "ev_opaque",
  "kind": "message.text.delta",
  "sessionId": "ses_opaque",
  "epoch": 12,
  "seq": 847,
  "turnId": "turn_opaque",
  "itemId": "item_opaque",
  "occurredAt": "2026-08-12T12:02:03.000Z",
  "payload": {"delta": "const "},
  "redaction": {"policyVersion": "r1", "removed": 0},
  "source": {"rpcEvent": "message_update", "contentDelta": "text_delta"},
  "replay": {"durable": true, "snapshotEligible": false}
}
```

The minimum public `kind` set is `turn.started`, `message.text.delta`, `thinking.summary.delta`, `plan.snapshot`, `tool.call.started`, `tool.input.delta`, `tool.output.delta`, `tool.call.ended`, `file.diff`, `usage.snapshot`, `turn.settled`, and `error`. Each event has the same epoch/sequence identity; payload schemas vary by kind.

### 2. Richness requires block lifecycle and snapshots

Text and thinking are append-only deltas inside an item. Tool arguments are streamed as opaque fragments plus a final canonical JSON value; the mobile UI must mark the preview as “assembling” until the final value is accepted. Plans are snapshots with stable task IDs and statuses (`pending`, `active`, `done`, `blocked`), not a fragile stream of individual checkbox mutations. Usage is a monotonic snapshot keyed by turn and includes `inputTokens`, `outputTokens`, `cacheReadTokens`, `cacheWriteTokens`, `totalTokens`, `costMicros`, and `contextPercent`; absent fields remain unknown rather than zero.

### 3. File diffs are a derived, redacted view

`file.diff` should carry opaque file IDs, a display label after path policy, old/new content hashes, hunks, and a `truncated` flag. It must never be the authority for applying edits. The relay derives it from Pi tool results or an extension, removes secrets and ignored paths before persistence, and binds any approval to the original exact action digest. A client may display and copy a diff, but cannot submit a modified diff as an approval.

### 4. Thinking must be an explicit policy surface

Expose only the model/provider's permitted summarized reasoning or progress rationale. Represent hidden/omitted thinking as a `thinking.summary.unavailable` state with a reason code, not as an empty string. The relay must not manufacture chain-of-thought from tool traces. The PWA labels the block “Reasoning summary” and lets the user collapse it; it does not imply that the displayed summary is the model's private internal trace.

### 5. The superiority test is lossless replay under interruption

The parity baseline proves that a user can see a remote session. The better design proves that after killing the WebSocket at every event boundary, reconnecting with `lastAckedSeq`, and rotating the epoch after a relay restart, the phone reconstructs the same ordered block graph, tool/action digest, plan state, diff hashes, and usage totals—without receiving a secret field that the live client did not receive. Any missing event becomes a visible “replay gap” requiring a snapshot, never silent UI repair.

## Product pattern

The PWA opens a turn card with a live text surface, a compact “working” strip (plan progress, current tool, elapsed time), expandable reasoning summary, tool cards, and diff cards. A bottom sheet exposes “what changed,” “what needs me,” and cost/context. The timeline is append-only; reconnect inserts a local “replayed” marker and reconciles against a durable session snapshot.

## Security-preserving mechanism

Normalize and redact before persistence, persist before broadcast, and keep the PWA on a capability-scoped read stream. All client-originated mutations use separate command endpoints and never accept event payloads, diff hunks, or displayed arguments as authority. The relay validates epoch and sequence cursors, and the final Pi boundary recomputes the canonical action digest.

## Open questions carried forward

- How should a push attention record point to a pending tool without revealing its name, path, or arguments?
- What exact lease/CAS extension is required for “accept edits in this session” while preserving one-action authority?

## Assessment

New information ratio: 0.96. This pass converts the source streaming vocabularies into a mobile relay ledger and defines a testable replay/richness contract. Q1 is substantially answered; Q2 and Q3 are opened for dedicated passes.

