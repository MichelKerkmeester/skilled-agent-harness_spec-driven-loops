# Iteration 4: Push notifications, steering/abort/queue UX, and reconnect

## Focus

Close the remaining UX/control gaps: map fire-and-forget `notify` to mobile push, design steer/follow-up/abort/queue interactions, and specify reconnect reconciliation using `get_entries` cursors after Tailscale/WebSocket drops.

## Findings

1. **Push notifications should bridge `extension_ui_request` method `notify` (and optionally blocking dialogs) through the relay to OS push.** `notify` is fire-and-forget with `title`, `message`, `notifyType` (`info`|`warning`|`error`). Relay policy: if PWA is foreground, show in-app toast; if background, forward to Web Push / ntfy / APNs/FCM with deep link `sessionId` + optional request id for approvals. Blocking `confirm`/`select` while backgrounded should also trigger a high-priority push ("Approval needed") that opens the PWA to the pending dialog. Do not invent a second notification channel inside Pi — reuse extension UI. [SOURCE: https://pi.dev/docs/latest/rpc]

2. **Steering interaction model mirrors Claude "interrupt / queue" patterns.** | User intent | RPC | When | |---|---|---| | New turn while idle | `prompt` | `!isStreaming` | | Redirect mid-run | `steer` or `prompt`+`streamingBehavior:"steer"` | After current tool calls, before next LLM call | | After done | `follow_up` or `prompt`+`streamingBehavior:"followUp"` | When agent fully stops | | Stop now | `abort` (+ `abort_bash` / `abort_retry` as needed) | Immediate | Queue visibility comes from `queue_update` (pending steering + follow-up queues) and modes `set_steering_mode` / `set_follow_up_mode` (`all` vs `one-at-a-time`). Composer UX: primary Send; secondary Steer / Follow-up when streaming; Abort button while `isStreaming` or bash active. [SOURCE: https://pi.dev/docs/latest/rpc]

3. **Reconnect algorithm (post Serve/WS drop).** On WebSocket reconnect: (1) re-auth to relay; (2) `get_state` for sessionId, isStreaming, pendingMessageCount, sessionFile; (3) `get_entries` with `since=<lastSeenEntryId>` — if `since` unknown, full hydrate; (4) if `isStreaming`, resume live event subscription and rebuild partial bubble buffers from subsequent `message_update`s (accept possible gap; `message_end` reconciles); (5) re-present any outstanding `extension_ui_request` the relay held. Persist `lastSeenEntryId` + `leafId` in PWA localStorage keyed by sessionId. [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: https://github.com/tailscale/tailscale/issues/18827] [SOURCE: Iteration 1 f-relay-topology]

4. **Double-submit and in-flight turn safety.** Gate duplicate `prompt` while streaming unless explicitly Steer/Follow-up. Use relay-side idempotency keys (`id` on commands) so mobile retries after ambiguous network errors do not double-enqueue. On `prompt` during streaming without `streamingBehavior`, RPC returns error — surface that as UI guidance rather than silent drop. Prefer waiting for `agent_settled` before clearing the in-flight indicator. [SOURCE: https://pi.dev/docs/latest/rpc]

5. **Transport recommendation finalized under max-iterations charter.** Default: Tailscale Serve HTTPS → local WS relay → `pi --mode rpc` for tailnet-only phones with auto TLS. Required mitigations: heartbeat/ping, exponential reconnect, entry cursors, offline banner. Escape hatch: Tailscale TCP forward or non-Serve WS if Serve WS 1001 drops are severe on the operator's Tailscale version. Public Funnel is out of MVP (auth/blast-radius). [SOURCE: https://tailscale.com/docs/reference/tailscale-cli/serve] [SOURCE: Iteration 1]

## Sources Consulted

- https://pi.dev/docs/latest/rpc (notify, steer/follow_up/abort, queue_update, get_entries)
- https://tailscale.com/docs/reference/tailscale-cli/serve
- https://github.com/tailscale/tailscale/issues/18827
- Iterations 001–003

## Assessment

- **newInfoRatio:** 0.75
- **Novelty justification:** Push bridge policy, concrete steer/follow-up composer model, reconnect algorithm with entry cursors, and idempotent double-submit controls are new; transport default consolidates prior evidence.
- **Confidence:** High on RPC control semantics; medium on OS push provider choice (product decision).

## Reflection

### What worked
- Reusing extension `notify` for push avoids inventing Pi-side notification APIs.
- Entry cursors turn Serve WS fragility into a recoverable transport issue.

### What failed / ruled out
- **Ruled out:** Public Tailscale Funnel as MVP exposure path — expands blast radius before auth model exists. [SOURCE: research Non-Goals + security deferral]
- **Ruled out:** Silent auto-`steer` when user taps Send during streaming — RPC requires explicit `streamingBehavior`; implicit conversion hides user intent. [SOURCE: https://pi.dev/docs/latest/rpc]

### Open questions remaining (post-lineage)
- Concrete Web Push VAPID vs ntfy vs native wrapper decision.
- Whether relay should multiplex multiple Pi children (multi-project) under one WS endpoint.

## Recommended Next Focus

Synthesis: consolidate architecture, UX parity matrix, protocol maps, and MVP build plan into `research.md` (max-iterations stop).
