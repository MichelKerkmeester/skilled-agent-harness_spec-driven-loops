# Iteration 5: PWA notifications, background limits, and product phasing

## Focus
Define the mobile behavior contract: Web Push (including iOS/WebKit Home Screen constraints), service-worker background limits, offline/foreground modes, and a phased product plan that sequences surfaces by verified authority rather than visual parity.

## Findings
1. **High — iOS Web Push is available but gated: Home Screen install required, explicit user gesture, user-visible notifications only.** Since iOS/iPadOS 16.4, WebKit supports standards-based web push (Service Worker + Push API + Notifications API + VAPID) for installed web apps only — a normal Safari tab cannot request permission; the manifest needs `display: standalone`/`fullscreen` and the user must install via "Add to Home Screen". Permission must be triggered by an explicit user gesture (never auto-prompt on load). Safari forbids silent/invisible pushes (`userVisibleOnly`) and may revoke permission if abused; after grant, the installed app's notifications behave like a native app (Lock Screen, Notification Center, Watch, Focus). No Apple Developer Program membership is required. [SOURCE: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/] [SOURCE: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers]
2. **High — service workers are event-driven, not daemons: do not rely on a persistent service-worker WebSocket, no timers, no guaranteed sync; the relay remains the source of truth.** Browsers start the worker for events and terminate it after idleness; worker APIs may expose WebSocket, but the worker lifetime is event-driven so the connection cannot be treated as a daemon. Handlers must be restart-safe and persist state in IndexedDB/Cache with `waitUntil()`. Background Sync is deliberately scheduled, not real-time (Android/Chrome), and WebKit's Background Sync remains an open tracking bug — do not plan on it for iOS. WebKit can evict origin storage under pressure or prolonged inactivity, so the client cache is recoverable state, never canonical: on launch/focus/connectivity change the client must re-sync from the relay (envelope seq + `get_entries` cursor per iteration 3). [SOURCE: https://web.dev/learn/pwa/service-workers] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API] [SOURCE: https://bugs.webkit.org/show_bug.cgi?id=201866] [SOURCE: https://webkit.org/blog/14403/updates-to-storage-policy/]
3. **High — the push payload contract: RFC 8291 `aes128gcm` encryption, small opaque payloads, secret subscription material, VAPID discipline.** Encrypt every message (never plaintext or alternate encodings); payloads should stay under ~4 KB and prefer an opaque event ID/version with fetch-on-receive — never put message text or tokens in the push body. Treat the push endpoint as a capability URL/secret (encrypt at rest, redact logs); VAPID uses ES256 with `aud` = push endpoint origin, `exp` ≤ 24h, monitored `mailto:`/`https:` `sub`, private key in a secret manager, and `applicationServerKey` binding so only the holder of the VAPID key can send. Set TTL deliberately (short for stale events), coalesce replaceable updates via `Topic`, and recreate subscriptions after permanent failures (`410 Gone`). [SOURCE: https://www.rfc-editor.org/info/rfc8291/] [SOURCE: https://www.rfc-editor.org/info/rfc8292/] [SOURCE: https://www.w3.org/TR/push-api/] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Push_API]
4. **High — the notification semantic is a committed-transition hint, never a decision carrier.** Because pushes are unreliable and payloads are opaque, the client must treat a notification as "something changed — fetch and render", not as the content itself. Pi-mapped triggers: `agent_settled` (run complete), new approval dialog (decision needed — push only as a hint; the approval itself is revalidated in the foreground against the relay's lease/epoch rules from iteration 3), `tool_execution_end` for long-running jobs, and extension `notify` events (translated to in-app toasts when foregrounded). Foreground/background rules: while foregrounded, the live WSS stream is the only source (push is suppressed); while backgrounded, pushes are hints and the relay is the authority; on return to foreground the client reconciles cursor + seq before rendering anything. [INFERENCE: composes iteration 1-3 event semantics with the push constraints from findings 1-3]
5. **Medium — offline is stale read-only, with an explicit outbox for retryable mutations.** With no guaranteed background execution, the offline UX is: render the last IndexedDB snapshot (bubbles, tool cards, approval states as last known), mark it stale, disable send (or queue into an outbox only when the user explicitly confirms), and re-sync on next connectivity/focus. Retrying mutations follows the iteration-3 ledger: same `clientMutationId` + payload digest, so the relay dedups; changed payloads are rejected with a conflict. Approval decisions are never made offline (epoch/lease semantics require the live relay). [INFERENCE: applies iteration 3 ledger rules to the PWA lifecycle constraints from findings 1-2]
6. **Medium — phase by verified authority, not visual parity: security/approval mechanics precede chrome polish, and no mutation-capable remote prompting exists before the fail-closed approval extension is installed.** Proposed phases: (0) local MVP — desktop browser → relay → one session, streaming + session list, no auth beyond loopback; (1) exposure — tailnet Serve + handshake auth + exact-Origin checks + per-action authorization + audit (iteration 4), PWA installable shell; **Phase 1 is explicitly read-only for remote clients: view sessions and stream, no prompt submission**, because the approval extension is not yet installed; (2) approvals — install the pinned fail-closed approval extension (iteration 4 finding 7), then enable mutation-capable prompts with extension-UI dialogs as decision-ready cards, epoch/lease semantics, privileged-action gating — this is the gate that flips the relay from read-only to mutation-capable; (3) mobility — Web Push (VAPID + RFC 8291) with committed-transition hints, offline stale/read-only, outbox retry; (4) parity — fork/clone/branch tree UX, multi-session management, multi-device contention polish, token/cost dashboard. Each phase has an executable gate (e.g., phase 2 gates on a real extension-UI approval round-trip under relay authZ; phase 3 gates on iOS Home Screen install + push receipt) before the next phase starts. [INFERENCE: sequencing derived from dependency order across iterations 1-4; read-only Phase 1 follows from finding 7's trust control]

## Questions Answered
- How should PWA notifications, background limits, and Claude-style mobile UX be implemented and phased? (answered: Home Screen-gated push with hint semantics, event-driven SW with relay authority, stale-read-only offline, 5-phase plan)

## Questions Remaining
- None among the original five key questions. Validation iteration 6 will independently re-check the full lineage against primary sources and surface residual risks.

## Ruled Out
- **Silent pushes / background compute on iOS:** WebKit requires user-visible notifications and may revoke permission. [SOURCE: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers]
- **Relying on Background Sync for delivery:** scheduled, not real-time; broken on WebKit. [SOURCE: https://bugs.webkit.org/show_bug.cgi?id=201866]
- **Client cache as canonical state:** evictable under storage pressure; the relay is the source of truth. [SOURCE: https://webkit.org/blog/14403/updates-to-storage-policy/]
- **Decision-carrying push payloads:** pushes are unreliable hints; approvals revalidate in foreground. [INFERENCE from findings 3-4]

## Dead Ends
- No real-device validation of iOS push behavior or a Home Screen install flow in this environment; phase 3 gates on it.
- No live service-worker lifecycle test against the relay.

## Edge Cases
- Contradictory evidence: none; WebKit/Apple docs and W3C push spec agree on userVisibleOnly and gesture requirements.
- Missing dependencies: push endpoint secret handling and VAPID key management need a secret manager at implementation time.
- Ambiguous input: "push notifications" interpreted as Web Push for an installable PWA (no native app), per the research topic.

## Sources Consulted
- [SOURCE: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/]
- [SOURCE: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers]
- [SOURCE: https://web.dev/learn/pwa/service-workers]
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API]
- [SOURCE: https://bugs.webkit.org/show_bug.cgi?id=201866]
- [SOURCE: https://webkit.org/blog/14403/updates-to-storage-policy/]
- [SOURCE: https://www.rfc-editor.org/info/rfc8291/]
- [SOURCE: https://www.rfc-editor.org/info/rfc8292/]
- [SOURCE: https://www.w3.org/TR/push-api/]
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Push_API]

## Assessment
- New information ratio: 0.88 (5 of 6 findings fully new; finding 5 overlaps iteration 3 ledger semantics by design)
- Questions addressed: 1 of 1 remaining key questions (PWA/phasing), answered.
- Confidence: high on WebKit/Apple/W3C push constraints (primary documentation); high on service-worker limits (web.dev/MDN/WebKit); medium on the phase-gate specifics (design inference).

## Reflection
What worked: WebKit's own push blog + Apple's developer docs settled the Home Screen/gesture/userVisibleOnly contract in one pass; RFC 8291/8292 gave the payload and VAPID discipline precisely.
What failed: no real-device iOS validation; Background Sync unusability confirmed as a WebKit bug, so the design leans on push-as-hint + foreground reconciliation.
What was ruled out: silent pushes, Background Sync reliance, client-cache-as-truth, decision-carrying payloads.

## Recommended Next Focus
Independent validation: re-check the full lineage's load-bearing claims against primary sources (Pi RPC docs, RFC 6455/8291/8292, Tailscale, OWASP, WebKit/Apple), search for contradictions or stale assumptions, rank residual risks, and define the executable acceptance matrix for the MVP.
