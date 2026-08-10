# Iteration 1: Pi RPC lifecycle and minimum relay/process architecture

## Focus
This iteration mapped the installed Pi RPC contract and selected the narrow interpretation of “minimum architecture”: a single-host, authenticated mobile MVP that keeps work alive across browser disconnects. High availability, multi-user scheduling, detailed Tailscale configuration, and push delivery are deferred.

## Findings
1. **High — the relay must be a lifecycle owner, not a stateless HTTP adapter.** Pi RPC is a persistent subprocess protocol: commands are JSON objects written one-per-line to stdin, while correlated command responses and asynchronous events share stdout. Framing is strict LF-delimited JSONL, and generic line readers that split Unicode separators are explicitly non-compliant. The minimum adapter therefore needs one serialized stdin writer, one strict-LF stdout parser, a pending-response map keyed by command `id`, and a separate event fan-out path; stderr must remain operational logging rather than protocol data. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1-37] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:181-184]
2. **High — command acceptance and run completion are distinct states.** A successful `prompt` response only means accepted, queued, or handled; later failures arrive through messages/events, not a second correlated response. `agent_end` can still be followed by retry, compaction, or queued continuation, whereas `agent_settled` is the terminal “no automatic continuation remains” signal. The bridge must acknowledge submission separately from marking a run settled, and the mobile UI must not treat either the command response or `agent_end` as final completion. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:43-76] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-888]
3. **High — live UI state must be assembled, correlated, and then replaced by authoritative terminal objects.** Most events have no request `id`; assistant deltas are non-cumulative and must be assembled by `contentIndex`, with `message_end.message` authoritative. Tool activity is independently correlated by `toolCallId`, and tool progress is accumulated rather than delta-only. The relay should normalize these into session-scoped envelopes with its own monotonically increasing event sequence while preserving raw Pi event types and identifiers. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-956] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:972-1015] [INFERENCE: a relay sequence is required because the native event stream generally lacks a replay/event cursor]
4. **Medium — Pi provides durable active-session reconstruction, but the relay must own the session catalog.** `get_state` exposes the current session identity and streaming state; `get_messages` reconstructs the active conversation; `switch_session` loads a known session path. More importantly, `get_entries(since)` uses stable entry IDs as durable cursors across client restarts and returns the current `leafId`. The documented command union has no list-sessions operation, so a session-list UX requires a relay-side index of Pi session files (or a Pi SDK/session-storage API), not discovery from the active RPC child. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:162-213] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:597-722] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts:14-159]
5. **High — the minimum disconnect-safe topology is PWA → authenticated WSS relay → relay-owned Pi child → durable workspace/session storage.** The WebSocket connection must be a replaceable client attachment; closing it must not kill the Pi child. On reconnect, the client presents session identity, its last relay event sequence, and last durable Pi entry ID; the relay replays any retained envelopes, then reconciles with `get_state` plus `get_entries(since)` (falling back to full messages when the cursor is invalid). A client mutation ledger must deduplicate retried prompts because Pi request IDs correlate responses but do not document idempotent submission. Bounded relay/client queues are mandatory because the browser WebSocket API provides no backpressure. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-37] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:694-722] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket] [INFERENCE: reconnect replay and mutation deduplication combine Pi's durable entry cursor with the transient, generally uncorrelated event stream]
6. **High — Claude-style approvals require an explicit Pi extension/policy layer.** RPC forwards extension dialog requests (`select`, `confirm`, `input`, `editor`) with a unique ID and blocks until the matching `extension_ui_response`; agent-side timeouts can auto-resolve. Tool execution events themselves report activity but are not documented as approval requests. The relay must therefore persist and authorize outstanding dialog IDs, reject stale/duplicate responders, and present an approval UI only for a purpose-built extension that gates risky tools; it must not infer approval semantics from `tool_execution_start`. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:972-1015] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1144-1165] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1312-1334] [INFERENCE: a general tool-approval event is absent from the documented event set, so policy must be added by an extension]

### Minimum process blueprint

```text
Mobile PWA
  └─ authenticated WSS (clientMutationId, sessionId, lastEventSeq, lastEntryId)
      └─ relay daemon (outlives sockets)
          ├─ auth + connection lease
          ├─ session-file catalog
          ├─ mutation ledger + bounded sequenced event replay
          ├─ outstanding extension-UI/approval map
          └─ per-active-session RPC adapter
              ├─ serialized JSONL stdin
              ├─ strict-LF stdout parser + response/event demux
              └─ pi --mode rpc --session-dir <durable-dir>
                   └─ workspace and Pi JSONL session files
```

For a minimum single-conversation MVP, one relay-owned child is sufficient. Concurrently running conversations should use one child per active session; idle children can be stopped and later re-opened by session path. [INFERENCE: a Pi RPC child exposes one current session and one streaming state, while `switch_session` targets that current child]

## Ruled Out
- **Direct PWA-to-Pi connection:** browsers cannot consume a local child-process stdin/stdout protocol; an application bridge is unavoidable. [INFERENCE: based on Pi's stdin/stdout JSONL transport and the browser WebSocket network API]
- **One Pi process per prompt:** it makes the mobile socket the de facto lifecycle owner and loses the persistent asynchronous run boundary needed for retries, tool events, and settlement. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:43-76] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-888]
- **Treating a successful `prompt` response as completion:** explicitly contradicted by the RPC contract. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:71-76]
- **Using transient events as the durable session list/history:** RPC supplies durable session entries separately, and events generally have no replay cursor. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:694-722] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-835]

## Dead Ends
No architecture category is exhausted. Direct retrieval of the Tailscale Serve documentation returned HTTP 308 in this environment, so no Tailscale-specific behavior was used as evidence and detailed Serve/Funnel topology remains open.

## Edge Cases
- Ambiguous input: “Minimum” was interpreted as a single-host, authenticated MVP; HA, multiple users, and push/background delivery were deferred.
- Contradictory evidence: none.
- Missing dependencies: the official Tailscale Serve page could not be retrieved (HTTP 308); authoritative installed Pi docs and the MDN WebSocket reference were sufficient for the transport-neutral minimum bridge.
- Partial success: one networking source failed, but six cited findings answered the in-scope architecture question; status remains `complete`.

## Sources Consulted
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1-1357]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts:14-159]
- [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:181-184]
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket]
- Tailscale Serve documentation retrieval attempted at `https://tailscale.com/kb/1242/tailscale-serve` but returned HTTP 308; it was not used to substantiate a finding.

## Assessment
- New information ratio: 1.00 (6 fully new / 6 findings)
- Questions addressed: What process, relay, and client architecture preserves Pi RPC semantics while tolerating mobile disconnects?
- Questions answered: What process, relay, and client architecture preserves Pi RPC semantics while tolerating mobile disconnects? (minimum MVP architecture)

## Reflection
- What worked and why: Reading the installed version's RPC documentation and declaration union exposed both positive capabilities and the important absence of session-list and general approval commands; combining lifecycle and durable-entry sections produced a coherent reconnect boundary.
- What did not work and why: The Tailscale Serve page returned a permanent redirect that the bounded fetch did not follow, so product-specific exposure claims were excluded rather than inferred.
- What I would do differently: Fetch Tailscale's current canonical redirected URL or local CLI documentation, then validate the bridge topology against an actual RPC transcript with prompt, tool, retry, settle, disconnect, and resume cases.

## Recommended Next Focus
Map every Pi RPC command/event to the mobile UX state machine, especially session-list sourcing, streamed message assembly, tool cards, and the extension required to turn risky tool calls into explicit approval dialogs. Define event ordering and idempotency invariants before selecting Tailscale Serve versus another authenticated WebSocket exposure layer.
