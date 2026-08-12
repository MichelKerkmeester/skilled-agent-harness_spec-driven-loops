# Iteration 3: Streaming deltas, tool activity, and approval dialogs

## Focus

Design the mobile rendering model for streaming assistant content, tool execution activity, and approval/confirm flows using RPC `message_update`, `tool_execution_*`, and `extension_ui_request`/`extension_ui_response`.

## Findings

1. **Streaming bubbles assemble from delta-only `message_update` events.** Wire events omit cumulative `message` and `assistantMessageEvent.partial`. Clients must maintain per-message buffers keyed by active message and apply `assistantMessageEvent` variants (notably `text_delta`, thinking deltas, and tool-call argument deltas) using `contentIndex` + `delta`. `message_end` is authoritative; discard/reconcile partial buffers against the final message. [SOURCE: https://pi.dev/docs/latest/json] [SOURCE: https://pi.dev/docs/latest/rpc]

2. **Recommended mobile bubble model.** User bubbles: from accepted `prompt`/`steer`/`follow_up` echoes plus hydrated user entries. Assistant bubble: one streaming container with optional collapsible Thinking section, main Markdown text, and inline tool-call chips that expand into tool cards. On `message_end`, freeze the bubble and attach final content blocks. Show a subtle "settling…" until `agent_settled` (not merely `agent_end`, which can precede retries/compaction/queued continuations). [SOURCE: https://pi.dev/docs/latest/rpc]

3. **Tool activity is a first-class parallel timeline.** `tool_execution_start` → `tool_execution_update` (partialResult) → `tool_execution_end` (result, isError) keyed by `toolCallId`/`toolName`. Render as expandable cards under the assistant turn (name, args preview, streaming output, error badge). Pair with `bash_execution_update` for direct RPC `bash` commands (correlated by request `id`). Do not wait for `turn_end.toolResults` alone — that is turn-final, not live. [SOURCE: https://pi.dev/docs/latest/rpc]

4. **Approvals = blocking extension UI dialogs with id-correlated responses.** `confirm` → modal with title/message → respond `{type:"extension_ui_response", id, confirmed}` or `cancelled`. `select` → option list → respond with `value` or `cancelled`. `input`/`editor` → text capture. If request includes `timeout`, agent auto-resolves; client need not race. Fire-and-forget methods (`notify`, `setStatus`, `setWidget`, `setTitle`, `set_editor_text`) must not block the UI thread waiting for a response. [SOURCE: https://pi.dev/docs/latest/rpc]

5. **Relay must preserve request/response correlation under concurrency.** While a dialog is open, events may still stream (or the agent is blocked waiting). The relay should: pause outbound `prompt` from the composer when a blocking dialog is outstanding (or queue them), forward `extension_ui_request` immediately to the PWA with high priority push/foreground banner, and reject mismatched response ids. Double-submit prevention: disable Send while `get_state.isStreaming` or local optimistic "in-flight" flag is set, unless the user explicitly chooses Steer/Follow-up. [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: Iteration 2 f-relay-locking]

## Sources Consulted

- https://pi.dev/docs/latest/rpc (Events + Extension UI Protocol)
- https://pi.dev/docs/latest/json (`message_update` delta-only contract)
- Iterations 001–002

## Assessment

- **newInfoRatio:** 0.8
- **Novelty justification:** Concrete bubble/tool-card/approval rendering contracts and agent_settled idle semantics go beyond the raw event inventory from iteration 1.
- **Confidence:** High — directly grounded in official event schemas.

## Reflection

### What worked
- Separating live tool_execution stream from turn_end aggregation clarifies mobile card updates.
- Treating extension UI timeouts as agent-owned removes client timer complexity.

### What failed / ruled out
- **Ruled out:** Rendering only from cumulative message snapshots on each update — JSON/RPC docs omit cumulative snapshots on purpose for linear stream size. [SOURCE: https://pi.dev/docs/latest/json]
- **Ruled out:** Using `agent_end` alone as "ready for next prompt" — retries/compaction/queues may follow; use `agent_settled` + `queue_update`. [SOURCE: https://pi.dev/docs/latest/rpc]

### Open questions carried forward
- Exact `assistantMessageEvent.type` enum list for thinking vs tool-call deltas in this Pi version (docs describe family; live fixture not captured).
- How aggressively to truncate tool partialResult on mobile for battery/memory.

## Recommended Next Focus

Iteration 004: Push notifications via `notify` + mobile OS push, plus steering/abort/queue UX and reconnect/`get_entries` reconciliation.
