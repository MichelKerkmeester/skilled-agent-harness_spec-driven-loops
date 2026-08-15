# Deep Research Strategy

## 1. Research Topic
Design a custom Claude-app-style mobile client for the pi coding agent, driven by `pi --mode rpc` (JSONL protocol) exposed through a relay (Tailscale Serve or WebSocket bridge) to a mobile web app/PWA, with Claude-app UX parity: session list, chat bubbles, streaming, tool activity, approvals, and push notifications.

## 2. Known Context
- Startup memory supplied no cached continuity for this lineage.
- `resource-map.md` was not present at initialization; coverage-gate inventory is unavailable.
- The lineage is detached and may write only inside its own artifact directory; the target `spec.md` and root-level research packet must remain untouched.
- The executor is this pi session (cli-pi, deepseek-v4-flash), running the loop phases directly as a leaf; no nested CLI dispatch occurs.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)
- [x] What process, relay, and client architecture preserves Pi RPC semantics while tolerating mobile disconnects? (MVP blueprint)
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
- Writing to any path outside this lineage artifact directory.

## 5. Stop Conditions
- Run exactly six evidence iterations, regardless of earlier convergence telemetry (stopPolicy: max-iterations).
- Synthesize after iteration six or after an unrecoverable state/write-boundary failure.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions
- Minimum topology is PWA → authenticated WSS relay → relay-owned persistent Pi RPC child → durable workspace/session storage; the relay owns framing (strict-LF demux), sequencing, session catalog, mutation ledger, and approval map. (iteration 1)
- Command/event → UI contract: prompt/steer/follow_up/abort/compact/model/thinking controls; get_commands actions menu (no TUI-only builtins); four message roles render as bubbles; direct bash is a privileged surface (auth + audit or out of MVP); session list relay-built from --session-dir scan + entry tree; approvals are extension-UI dialogs rendered as decision-ready cards; the relay reports and enforces the extension/relay policy — Pi has no native permission-mode flag to mirror. (iteration 2)
- Reconnect model: relay monotonic per-stream seq, persist-before-fan-out, replay seq>cursor with cumulative ACKs; clientMutationId + payload digest + relay idempotency ledger (Pi id is correlation-only); get_entries(since)+leafId+get_state reconciliation with full-snapshot fallback; acceptance response is a valid persisted outcome, crash-without-response is indeterminate and surfaced; approvals epoch-scoped with lease CAS and stale-responder rejection; compaction firstKeptEntryId as snapshot barrier. (iteration 3)
- Security model: tailnet-only Tailscale Serve (auto-TLS, ACL reachability) + relay-local authN/authZ (OWASP: wss-only, handshake auth, exact Origin allowlist, per-action authorization matrix, short-lived rotating credentials, rate limits, audit); Funnel/public bridge rejected; OS sandbox containment, session files sensitive, metadata-only retention with payload digests; audit/incident-response design; approval extension is admin-owned, hash/version-pinned, fail-closed for side-effect tools. (iteration 4)
- PWA contract: iOS push requires Home Screen install (16.4+), explicit gesture, userVisibleOnly only; service workers event-driven (no Background Sync on WebKit, evictable cache) so the relay is the source of truth; pushes are RFC-8291-encrypted committed-transition hints with VAPID discipline, never decision carriers; offline is stale read-only with outbox retry; five phases (0 local MVP → 1 read-only exposure/auth → 2 approvals (mutation-capable) → 3 mobility/push → 4 parity), each with an executable gate; Phase 1 is read-only until the pinned fail-closed approval extension is installed. (iteration 5)
- Validation: agent_settled is code-verified terminal (rpc-client); get_session_stats is the session/dashboard metadata source; no idempotency fields anywhere in the RPC implementation (negative evidence); session mutations are cancellable by extension handlers (catalog treats them as request-outcome pairs); session-dir layout undocumented; acceptance matrix G1-G9 defined with per-phase pass criteria; top residual risks: approval TOCTOU (P0), relay crash behavior (P0). (iteration 6)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked
- Reading the installed RPC doc in full-band ranges yielded exact framing, acceptance/settlement, cursor, and approval semantics with precise line citations. (iteration 1)
- Pairing MDN/RFC-6455 browser transport constraints with Pi's stdio protocol forced the relay-side sequencing/replay/dedup requirements. (iteration 1)
- The command/type sections of the RPC doc are enumerable, so the UI mapping table fell out mechanically. (iteration 2)
- Claude Remote Control docs supplied a direct parity benchmark, including approval-fatigue data (93% approve rate) and the host-permission-mode mirroring gap. (iteration 2)
- Inspecting installed type declarations proved the absence of RPC idempotency fields — negative evidence that forces the relay-owned ledger. (iteration 3)
- Messaging literature (Azure/Kafka/SQS/Socket.IO/Ably) supplied canonical idempotent-consumer and replay protocols that map 1:1 onto the relay. (iteration 3)
- Official Tailscale Serve/Funnel docs resolved the identity boundary precisely; the OWASP WebSocket cheat sheet mapped 1:1 onto the relay surfaces. (iteration 4)
- WebKit/Apple/W3C push sources settled the Home Screen/gesture/userVisibleOnly contract and RFC 8291/8292 payload+VAPID discipline in one pass. (iteration 5)
- Reading the installed client implementation (rpc-client.js) converted settlement semantics from doc-claim to code-verified; grepping dist for idempotency fields made the negative evidence formal. (iteration 6)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. What Failed
- No failures; Tailscale-specific evidence intentionally deferred to the security iteration. (iteration 1)
- Finding 6 (browser WebSocket backpressure) rests on MDN secondary documentation; labeled medium confidence accordingly. (iteration 2)
- No live end-to-end transcript (real Pi child + browser client) available in this environment; queue-update rendering unverified. (iteration 2)
- No live Pi crash fixture; the indeterminate-outcome path is inferred from the acceptance contract. (iteration 3)
- No live deployment to validate Serve PROXY protocol or origin checks against the relay; penetration testing remains an executable gate. (iteration 4)
- No real-device iOS push/Home Screen validation; no live service-worker lifecycle test. (iteration 5)
- No live Pi child, deployed Serve instance, or real device in this environment; every G-gate is executable future work, none run here. (iteration 6)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Direct browser-to-Pi stdio: browsers cannot consume a child-process stdin/stdout protocol. (iteration 1)
- One-shot Pi process per prompt: makes the socket the lifecycle owner and loses the async run boundary. (iteration 1)
- Treating prompt acceptance as run completion: contradicted by the RPC contract. (iteration 1)
- Transient RPC events as the durable session catalog: durable entries exist separately; events lack replay cursors. (iteration 1)
- Surfacing TUI-only commands in the mobile menu: they do not execute via prompt. (iteration 2)
- Treating tool_execution_start as an approval request: approvals are exclusively extension-UI dialogs. (iteration 2)
- Copying Claude Remote Control's permission-mode model verbatim: Pi has no equivalent flag; relay must mirror Pi's actual tool policy. (iteration 2)
- Wall-clock replay cursors: must be monotonic server sequence per stream. (iteration 3)
- Auto-resending in-flight prompts after Pi-child crash: duplicate risk; surface indeterminate instead. (iteration 3)
- Client-side approval timeout tracking: agent-side timeout auto-resolve is authoritative. (iteration 3)
- Broker-side dedup alone: bounded windows do not cover long-lived runs; consumer-side idempotency mandatory. (iteration 3)
- Tailscale Funnel as the exposure path: public-internet listeners without per-visitor identity. (iteration 4)
- Tailnet identity as sole authorization: it authenticates reachability only. (iteration 4)
- Direct public WebSocket bridge as the default: strictly more attack surface than Serve. (iteration 4)
- Storing full mutation payloads indefinitely: metadata-only retention with digests is safer. (iteration 4)
- Silent pushes or background compute on iOS: WebKit requires user-visible notifications. (iteration 5)
- Relying on Background Sync for delivery: scheduled, not real-time; broken on WebKit. (iteration 5)
- Client cache as canonical state: evictable under storage pressure. (iteration 5)
- Decision-carrying push payloads: pushes are unreliable hints. (iteration 5)
- Treating switch_session/fork/clone as unconditional transitions: cancellable by extension handlers. (iteration 6)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis: consolidate the six iterations into the final research report with the Eliminated Alternatives table, Divergence Map, and Convergence Report; emit the resource map from delta sources.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. RESEARCH BOUNDARIES
- Max iterations: 6
- Convergence threshold: 0.02 (telemetry only; hard cap is max-iterations)
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (written by this executor at synthesis)
- Lifecycle branches: `new` (this run); `resume`, `restart` (live)
- Machine-owned sections: Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-08-10T08:04:06Z
