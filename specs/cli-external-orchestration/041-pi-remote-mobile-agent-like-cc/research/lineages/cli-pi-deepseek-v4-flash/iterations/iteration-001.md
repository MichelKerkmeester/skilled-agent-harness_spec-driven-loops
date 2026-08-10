# Iteration 1: Pi RPC lifecycle and minimum relay/process architecture

## Focus
Map the installed Pi RPC contract end-to-end (framing, command/response, event stream, session state, extension-UI sub-protocol) and define the minimum relay/process architecture that lets a mobile PWA drive a long-lived agent without the browser owning the process lifecycle.

## Findings
1. **High — the relay must be a lifecycle owner, not a stateless HTTP adapter.** RPC mode is a persistent subprocess protocol: commands are JSON objects written one per line to stdin; correlated responses and asynchronous events share stdout. Framing is strict LF-only JSONL — Node `readline` is explicitly non-compliant because it also splits on U+2028/U+2029, which are legal inside JSON strings. The minimum adapter therefore needs one serialized stdin writer, a strict-LF stdout parser, a pending-response map keyed by command `id`, and a separate event fan-out path; stderr remains operational logging, not protocol data. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-38] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:181-184]
2. **High — prompt acceptance and run completion are distinct states.** A `prompt` response with `success: true` only means accepted/queued/handled; post-acceptance failures arrive through the event/message stream, never as a second response. `agent_end` may still be followed by retry (`willRetry`), compaction, or queued continuations, whereas `agent_settled` is the terminal "no automatic continuation remains" signal. The mobile UI must distinguish submission ack from run settlement and never render the command response or `agent_end` as final completion. [SOURCE: rpc.md:43-76] [SOURCE: rpc.md:862-888]
3. **High — live UI state is assembled from non-cumulative deltas and then replaced by authoritative terminal objects.** `message_update` events carry `assistantMessageEvent` deltas (`text_delta`, `thinking_delta`, `toolcall_delta`) keyed by `contentIndex`; clients must assemble the partial message themselves and treat `message_end.message` as authoritative. Tool activity is correlated by `toolCallId`; `tool_execution_update.partialResult` is an accumulated snapshot (replace-on-update), and `tool_execution_end.result` is terminal. Direct `bash` output chunks are correlated by the command `id`. The relay should normalize these into session-scoped envelopes with its own monotonic sequence while preserving raw event types and identifiers. [SOURCE: rpc.md:906-1015]
4. **Medium — Pi exposes durable cursors but no session-list command; the relay must own the session catalog.** `get_entries(since)` returns stable entry ids in append order (including pre-compaction history and abandoned branches) plus the current `leafId`, so an entry id works as a durable cursor across client restarts; `get_state` reports the active session identity/streaming state, `get_messages` reconstructs the active conversation, and `switch_session` loads a known session file (cancelable by extension). The documented command union has no list-sessions operation, so a Claude-app-style session list requires a relay-side index of Pi session files (or a `--session-dir` scan), not discovery from the RPC child. [SOURCE: rpc.md:162-215] [SOURCE: rpc.md:597-694] [SOURCE: rpc.md:724-772]
5. **High — Claude-style approvals map to the Extension UI sub-protocol, which is fully functional in RPC mode.** Dialog methods (`select`, `confirm`, `input`, `editor`) emit `extension_ui_request` on stdout with a unique `id` and block until the client sends the matching `extension_ui_response` on stdin (value/confirmed/cancelled); agent-side `timeout` auto-resolves. Fire-and-forget methods (`notify`, `setStatus`, `setWidget`, `setTitle`, `set_editor_text`) need no response. Several TUI-only methods are no-ops or degraded in RPC mode (`custom()`, `setWorkingMessage()`, `pasteToEditor()` semantics, etc.), and `ctx.mode === "rpc"` with `ctx.hasUI === true`. A mobile approval UI is therefore a purpose-built extension whose dialogs the relay must persist, deduplicate, and authorize — the base event set reports tool activity but does not define approval semantics. [SOURCE: rpc.md:1144-1360]
6. **Medium — the browser WebSocket API dictates the relay design: no backpressure, per-connection ordering only.** `send()` returns immediately; producers must monitor `bufferedAmount` against a high-water mark. Ordering is guaranteed only within one established connection (TCP + RFC 6455); there is no cross-reconnect exactly-once delivery — `send()` acceptance is not server processing. Application-level guarantees require sequence numbers, server-side durable processing, replay after reconnect, and idempotent (deduplicating) handlers — exactly the relay responsibilities identified in findings 1-4. `WebSocketStream` (streams-based backpressure) is experimental and not broadly supported. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications] [SOURCE: https://www.rfc-editor.org/rfc/rfc6455.html]

### Minimum process blueprint
```text
Mobile PWA
  └─ authenticated WSS (clientMutationId, sessionId, lastEventSeq, lastEntryId)
      └─ relay daemon (outlives sockets)
          ├─ auth + connection lease
          ├─ session-file catalog (session-dir scan + metadata index)
          ├─ mutation ledger + bounded sequenced event replay
          ├─ outstanding extension-UI/approval map (id-keyed, dedup)
          └─ per-active-session RPC adapter
              ├─ serialized JSONL stdin
              ├─ strict-LF stdout parser + response/event demux
              └─ pi --mode rpc --session-dir <durable-dir>
                   └─ workspace + Pi JSONL session files
```
One relay-owned child serves a single active conversation for an MVP; concurrent conversations use one child per active session, with idle children stopped and re-opened by session path via `switch_session`. [INFERENCE: an RPC child exposes one current session and one streaming state; `switch_session` targets that current child]

## Questions Answered
- What process, relay, and client architecture preserves Pi RPC semantics while tolerating mobile disconnects? (MVP architecture answered; disconnect protocol deferred to iteration 3)

## Questions Remaining
- Which Pi RPC commands and events map to session lists, streaming chat, tool activity, and approvals? (iteration 2)
- What state model and reconnection protocol prevent duplicated prompts, lost deltas, or stale approvals? (iteration 3)
- Which security and network exposure model is safe for a coding agent with workspace tool authority? (iteration 4)
- How should PWA notifications, background limits, and Claude-style mobile UX be implemented and phased? (iteration 5)

## Ruled Out
- **Direct PWA-to-Pi connection:** browsers cannot consume a child-process stdin/stdout protocol; an application bridge is unavoidable. [INFERENCE: Pi RPC transport is stdio JSONL; browser transport is HTTP/WS]
- **One Pi process per prompt:** makes the browser socket the de facto lifecycle owner and loses the persistent asynchronous run boundary needed for retries, tool events, and settlement. [SOURCE: rpc.md:43-76] [SOURCE: rpc.md:862-888]
- **Treating a successful `prompt` response as completion:** explicitly contradicted by the RPC contract. [SOURCE: rpc.md:71-76]
- **Using transient events as the durable session list/history:** RPC supplies durable session entries separately (`get_entries`), and events have no replay cursor. [SOURCE: rpc.md:694-722] [SOURCE: rpc.md:832-835]

## Dead Ends
No architecture category is exhausted. The official Tailscale Serve page was not consulted this iteration (deferred to the security iteration); no Tailscale-specific claim is made here.

## Edge Cases
- Ambiguous input: "minimum architecture" interpreted as a single-host, authenticated MVP; HA, multi-user, and push/background delivery deferred.
- Contradictory evidence: none found.
- Missing dependencies: no list-sessions RPC command exists; the relay must own the catalog (flagged as a finding, not a gap in the design).
- Partial success: five findings were substantiated from primary sources; finding 6 (no browser WebSocket backpressure) rests on MDN secondary documentation plus RFC 6455 for per-connection ordering, and is labeled medium confidence accordingly.

## Sources Consulted
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-1015]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1144-1360]
- [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:181-184]
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API]
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications]
- [SOURCE: https://www.rfc-editor.org/rfc/rfc6455.html]

## Assessment
- New information ratio: 1.00 (6 of 6 findings fully new in an empty lineage)
- Questions addressed: 1 of 5 key questions (architecture), partially answered with the MVP blueprint; disconnect semantics deferred.
- Confidence: high on framing/acceptance/cursor facts (primary installed docs); medium on browser-behavior generalizations (MDN).

## Reflection
What worked: reading the installed RPC doc in full-band ranges gave exact framing, state, cursor, and approval semantics without web round-trips; MDN + RFC 6455 provided the transport-side constraints that force relay-side sequencing.
What failed: nothing substantive; Tailscale specifics intentionally deferred.
What was ruled out: the four negative directions above; all are structural exclusions, not cost trade-offs.

## Recommended Next Focus
Map every RPC command and event type to a concrete mobile UI surface (session list, chat bubbles, streaming assembly, tool activity panel, approval dialogs, status/fire-and-forget), producing the exact command/event → UI contract and flagging surfaces with no native RPC support (e.g., session list).
