# Iteration 2: Axis 1a — Relay Transcript Event Schema

## Focus
Design the relay transcript event schema for the PWA: streaming assistant text, extended thinking, TODO/plan lists, tool-call inputs, edit diffs, tool results, token/cost — as first-class relay events mapped onto the 041-003 epoch/envelope persistence model. Prior art: Claude Code `stream-json` vocabulary, Anthropic Messages API content-block streaming, OpenCode's typed transcript envelope proposal.

## Findings

### F1. Reference vocabulary (Claude Code stream-json) — what we must at least match
Top-level NDJSON types: `system` (init/compact_boundary), `assistant` (complete content blocks), `user` (tool results), `stream_event` (raw partial API events), `result` (terminal outcome + usage/cost). Nested stream events mirror the Messages API: `message_start`, `content_block_start`, `content_block_delta` (`text_delta`, `input_json_delta` with `partial_json` for streamed tool args), `content_block_stop`, `message_delta`, `message_stop`; wrappers carry `event`, `uuid`, `session_id`, `parent_tool_use_id`, optional `ttft_ms`. The full schema is NOT officially published — community parsers are the reference ([SOURCE: github.com/anthropics/claude-code/issues/24612], [SOURCE: code.claude.com/docs/en/agent-sdk/streaming-output]).
Implication: parity is cheap (Pi RPC already emits structured events); the design space is the *enriched* vocabulary plus redaction-aware fields.

### F2. Extended thinking streaming (Messages API)
Thinking streams as `content_block_delta` with `delta.type == "thinking_delta"` between `content_block_start` and a `signature_delta` immediately before `content_block_stop`; `thinking.display: "omitted"` suppresses thinking deltas entirely while still billing ([SOURCE: platform.claude.com/docs/en/build-with-claude/extended-thinking]). Pi's RPC must classify thinking vs text deltas; the PWA renders thinking collapsible, and `display: omitted` maps to a redaction-preserving "hide reasoning" policy option.

### F3. OpenCode's typed transcript envelope — the best open prior art
Community-proposed envelope: `{schemaVersion, eventId, seq, occurredAt, runId, sessionID, parentSessionID, rootSessionID, type, properties, source, replay, messageID, partID, causationId, correlationId}` with event families `session.status`, `message.part.updated` (authoritative snapshot + optional append-only delta), `todo.updated`, `question.asked/replied`, `permission.asked/replied`, `subtask_delta` (child session envelope preserving parent/child tree, not flattened) ([SOURCE: opencode.ai/v2/docs/build/client], [SOURCE: github.com/anomalyco/opencode/issues/33397]). Storage rule: NDJSON in seq order; derive materialized views; keep `properties` lossless for forward compatibility.
Implication: this validates the 041-003 design (epoch/seq envelopes, persist-before-broadcast) as the industry-shaped pattern, and confirms `todo` and `permission` as first-class event families — Claude Code stream-json lacks both as structured events.

## Design: Pi Relay Transcript Vocabulary (axis 1 deliverable)

All events ride the existing 003 envelope `{epoch, seq, ts, kind, payload}` — immutable, ordered, persisted before broadcast; `kind` is the new vocabulary:

| kind | payload (redacted projection) | purpose |
|------|-------------------------------|---------|
| `transcript.assistant.delta` | `{text}` | streamed assistant text (append by seq) |
| `transcript.thinking.delta` | `{text, display: shown\|omitted}` | extended thinking; `omitted` = policy-redacted |
| `transcript.todo` | `{items:[{id,status,label}]}` | TODO/plan list snapshot; status ∈ pending/in_progress/done |
| `transcript.tool.call` | `{callId, tool, inputRedacted, digest}` | tool invocation; exact-action digest (006 contract) |
| `transcript.tool.diff` | `{callId, pathWs, hunks[]}` | streamed edit diff; workspace-relative path |
| `transcript.tool.result` | `{callId, ok, exit, durationMs, sizeBytes, summary}` | tool outcome; full output stays host-side |
| `transcript.usage` | `{model, tokens:{input,output,cacheRead,cacheWrite,thinking}, cost:{amount,currency}, period}` | per-message-boundary usage + cost event |
| `transcript.run.status` | `{state}` | state ∈ running/waiting/needs_input/finished/error — the attention class (axis 3) |
| `transcript.session.meta` | `{label, model, startedAt, epochFloor, workspaceLabel}` | redacted session metadata |

Redaction rules (binding 003 "redacted envelopes" + 004/006 posture):
- Paths: relay maps absolute host paths → `ws-<opaque>:relative/path`; only the opaque workspace id + relative path cross the boundary.
- Tool inputs: sensitive classes (API keys, tokens, private paths, raw command args flagged by policy) are masked in `inputRedacted`; the exact-action `digest` still commits the *unredacted* canonical payload host-side (006 recomputes pre-execution).
- Thinking: `display: omitted` when reasoning may contain policy-flagged content (or user preference "hide reasoning").
- Tool results: summary + metadata only; full output remains host-side, fetch-on-open per 007 rules.

PWA rendering vocabulary (005 mapping):
- Assistant turns as cards; thinking as dimmed collapsible (tap to expand, copy-hold to copy) — exceeds Claude mobile which does not surface thinking.
- TODO list as a live checklist with strikethrough on completion; plan items tappable to scroll to the related tool call.
- Tool timeline rail: per-call status (queued → running → needs_input → done) with the digest chip; diff viewer with syntax-highlighted hunks and workspace-relative file tabs; result card with exit code, duration, size.
- Usage chips per message + session budget ring (cost + tokens), model name — streamed, not end-of-session-only.

## Sources Consulted
- [SOURCE: https://github.com/anthropics/claude-code/issues/24612]
- [SOURCE: https://code.claude.com/docs/en/agent-sdk/streaming-output]
- [SOURCE: https://platform.claude.com/docs/en/build-with-claude/extended-thinking]
- [SOURCE: https://opencode.ai/v2/docs/build/client]
- [SOURCE: https://github.com/anomalyco/opencode/issues/33397]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md]

## Assessment
- newInfoRatio: 0.90
- Novelty justification: prior-art facts (stream-json vocabulary, thinking deltas, OpenCode envelope) consolidate iteration-1 findings; the concrete `transcript.*` kind vocabulary, redacted-projection rules, and PWA rendering mapping are new design output.
- Confidence: high on API facts; the schema is a design proposal to be validated against 003's envelope implementation in a later iteration.

## Reflection
- What worked: comparing three vocabularies (stream-json, Messages API blocks, OpenCode envelope) made the gaps obvious: no todo events, no thinking events, no per-message usage in the reference.
- What failed / ruled out: copying stream-json verbatim (no redaction projection, no digest binding, undocumented); flattening subagent output into the parent transcript (loses the execution tree — OpenCode's `subtask_delta` pattern is better).
- Design decision: keep `kind` vocabulary open (forward-compatible `properties` bag), matching 003's envelope contract.

## Recommended Next Focus
Axis 1b: diff streaming + token/cost rendering vocabulary in depth — incremental hunk events, cost attribution model, and the PWA budget UX (sustained novelty; half of axis 1's deliverable).
