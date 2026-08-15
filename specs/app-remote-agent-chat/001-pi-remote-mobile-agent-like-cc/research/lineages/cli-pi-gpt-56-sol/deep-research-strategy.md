# Deep Research Strategy

## 1. Research Topic
Design a custom Claude-app-style mobile client for the pi coding agent, using `pi --mode rpc` behind a secure relay and a mobile web app/PWA with session management, streamed chat, tool activity, approvals, and push notifications.

## 2. Known Context
- Startup memory supplied no cached continuity.
- `resource-map.md` was not present at initialization; coverage-gate inventory is unavailable.
- The lineage is detached and may write only inside this artifact directory.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)
- [x] What process, relay, and client architecture preserves Pi RPC semantics while tolerating mobile disconnects?
- [x] Which Pi RPC commands and events map to session lists, streaming chat, tool activity, and approvals?
- [x] What state model and reconnection protocol prevent duplicated prompts, lost deltas, or stale approvals?
- [x] Which security and network exposure model is safe for a coding agent with workspace tool authority?
- [x] How should PWA notifications, background limits, and Claude-style mobile UX be implemented and phased?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals
- Implementing the client, bridge, or Pi changes.
- Exposing Pi RPC directly to the public internet.
- Claiming native-app background execution parity where PWA platforms do not provide it.
- Replacing Pi's session format or tool execution engine.

## 5. Stop Conditions
- Run exactly six evidence iterations, regardless of earlier convergence telemetry.
- Synthesize after iteration six or after an unrecoverable state/write-boundary failure.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions
- Minimum topology: PWA → authenticated WSS relay → relay-owned persistent Pi RPC child → durable workspace/session storage. Reconnect uses relay event sequence plus Pi `get_entries(since)` cursor reconciliation. (iteration 1)
- UI mapping: use orthogonal mutation/run/render/approval/reconciliation state; authoritative terminal events replace accumulated drafts; session paths remain server-side. (iteration 2)
- Reconnect model: immutable child/session epochs, committed replay windows and snapshot barriers, full replacement on foreign entry cursors, explicit `indeterminate` mutation outcome after crash, and epoch-scoped first-decision approval leases. (iteration 3)
- Security baseline: tailnet-only Tailscale Serve → loopback relay; separate relay identity and per-action authorization; exact Origin/WSS/session controls; OS workspace containment; metadata-only retention; pinned fail-closed approval extension. (iteration 4)
- PWA contract: relay owns background work; iOS push requires Home Screen install; pushes are generic committed-transition hints; approvals revalidate foreground; offline is stale/read-only; MVP phases by verified authority, not visual parity. (iteration 5)
- Independent validation: topology holds with revisions—Serve identity is authentication bootstrap only; standard `confirm` carries no signed capability; redact before persistence; isolate active-session children; release remains blocked on P0/P1 executable gates. (iteration 6)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked
- Installed Pi RPC docs plus declaration inspection exposed lifecycle boundaries, event correlation, durable cursors, and absent session-list/approval surfaces. (iteration 1)
- Version-matched RPC implementation and SessionManager declarations converted absence claims into concrete reducer and authorization invariants. (iteration 2)
- A deterministic no-write fault model forced duplicates, gaps, cursor mismatches, crash windows, switching, restarts, and approval races into observable transitions. (iteration 3)
- Official Serve/grants, RFC/OWASP, and version-matched Pi security/extension docs separated reachability, identity, authorization, browser controls, and extension trust. (iteration 4)
- WebKit/Apple, W3C/MDN, Pi settlement/dialog contracts, and prior relay invariants turned background limits and stale notifications into explicit product behavior. (iteration 5)
- A full-lineage contradiction pass against current Pi/Tailscale/platform sources produced corrected authority seams, ranked risks, and an executable acceptance matrix. (iteration 6)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed
- The first Tailscale Serve documentation URL returned HTTP 308, so no Tailscale-specific claim was accepted. (iteration 1)
- A secondary literal RFC grep missed; no finding depended on it. A live interleaving transcript remains unverified. (iteration 2)
- No implementation, isolated Pi crash fixture, deployed pinned Serve instance, real mobile device, VoiceOver, or TalkBack evidence existed; release readiness remains unverified. (iteration 6)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches
### Relay-only exactly-once prompt delivery — BLOCKED (iteration 3)
- The relay/Pi crash window cannot be closed without a Pi-side durable mutation primitive.
- Use explicit `indeterminate` recovery instead of varying retry logic.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled-Out Directions
- Direct browser-to-Pi stdio: browsers require a network bridge.
- One Pi process per prompt: loses persistent asynchronous lifecycle.
- Treating prompt acceptance or `agent_end` as final completion: contradicted by RPC semantics.
- Treating transient events as durable session history: durable entries are a separate surface. (iteration 1)
- RPC request `id` as mutation idempotency token.
- Appending accumulated tool progress values.
- Treating every extension UI request as an approval.
- Browser-supplied session paths or unrestricted cross-workspace `listAll`. (iteration 2)
- Blind resend of recovered `dispatching` mutations.
- Continuing transient reducers across epoch changes or gaps.
- `get_messages`-only cursor recovery.
- Switching a shared active child.
- Treating an approval lease as authorization. (iteration 3)
- Public Funnel/Internet WSS as default.
- Tailnet membership as workspace authority.
- Origin or cookies alone as authentication.
- Mobile confirmation card as enforcement gate.
- Raw-content audit logs and unbounded queues/replay. (iteration 4)
- Persistent WSS/Pi work in a service worker.
- `agent_end` or deltas as push completion triggers.
- Sensitive/approval data in push.
- Notification/offline approval.
- Offline prompt queue via Background Sync.
- OS-name/install-prompt support inference. (iteration 5)
- Signed approval capability over standard boolean `confirm`.
- Serve identity as per-action application authority.
- Redaction after replay persistence.
- Shared-child session switching as ordinary navigation.
- Documentation review as implementation/device certification. (iteration 6)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions
None yet.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus
No seventh research iteration. Use the synthesis and begin implementation by making the approval, reconnect/idempotency, Serve/sandbox, redaction, push/device, and accessibility acceptance gates fail before building the corresponding feature seams.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Research Boundaries
- Maximum iterations: 6
- Convergence threshold: 0.02
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls / 10 minutes
- Progressive synthesis: true
- Writes: lineage artifact directory only
