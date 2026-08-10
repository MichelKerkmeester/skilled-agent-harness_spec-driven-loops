# Deep Research: Claude-App-Style Mobile Client for the Pi Coding Agent

**Lineage:** `cli-pi-deepseek-v4-flash` · **Session:** fanout-cli-pi-deepseek-v4-flash-1786341668505-k2xc4h · **Iterations:** 6 · **Stop:** maxIterationsReached (telemetry only)

## 1. Executive Summary

A Claude-app-style mobile client for the pi coding agent is feasible today on the installed protocol surface, provided the client is a thin PWA over a relay daemon that owns the Pi RPC child process, the event sequence, the session catalog, the mutation ledger, and the approval map. The browser must never talk to `pi --mode rpc` directly, the WebSocket is transport only, and every durable guarantee (no duplicate prompts, no lost deltas, no stale approvals) lives in the relay's state model. The recommended exposure is tailnet-only Tailscale Serve with relay-local authentication and per-action authorization; Funnel and public bridges are rejected as primary paths. Push notifications are Web Push with strict payload discipline; on iOS they require a Home Screen install. Delivery is phased in five gates (0-4), each with an executable acceptance criterion; the relay is read-only for remote clients until the pinned fail-closed approval extension is installed.

## 2. Research Topic and Scope

Design of a custom Claude-app-style mobile client for the pi coding agent driven by `pi --mode rpc` (JSONL protocol), exposed through a relay (Tailscale Serve or WebSocket bridge) to a mobile web app/PWA, with Claude-app UX parity: session list, chat bubbles, streaming, tool activity, approvals, push notifications.

## 3. Architecture

```text
Mobile PWA
  └─ authenticated WSS (clientMutationId, sessionId, lastEventSeq, lastEntryId)
      └─ relay daemon (outlives sockets)
          ├─ auth + connection lease (handshake auth, exact-Origin allowlist)
          ├─ session-file catalog (session-dir scan + entry-tree metadata)
          ├─ mutation ledger (clientMutationId + payload digest, idempotent retry)
          ├─ bounded sequenced event replay (per-stream monotonic seq)
          ├─ outstanding extension-UI/approval map (epoch + lease + CAS)
          └─ per-active-session RPC adapter
              ├─ serialized JSONL stdin (strict LF framing)
              ├─ stdout parser + response/event demux
              └─ pi --mode rpc --session-dir <durable-dir>
                   └─ workspace + Pi JSONL session files
```

Key decisions: one relay-owned child per active session (browser socket is a replaceable attachment, never the lifecycle owner); relay sequence is the only replay surface (Pi events lack replay cursors); session list is relay-built (no list-sessions command exists); approvals are the extension-UI dialog sub-protocol, epoch-scoped and lease-guarded; direct `bash` RPC is a privileged surface requiring explicit authorization or exclusion from the MVP.

## 4. Key Findings

1. **Relay is the lifecycle owner.** RPC is a persistent subprocess protocol with strict LF-only JSONL framing (Node `readline` is non-compliant); the adapter needs a serialized stdin writer, a strict-LF stdout parser, a pending-response map keyed by command `id`, and a separate event fan-out. (I1)
2. **Prompt acceptance ≠ run settlement.** `success: true` means accepted/queued/handled; post-acceptance failures arrive via events. `agent_settled` is the terminal signal — code-verified in the installed `rpc-client.js`. (I1, I6)
3. **Streaming is delta-assembly with authoritative terminals.** `message_update` deltas assemble by `contentIndex`; `message_end.message` and `tool_execution_end.result` are authoritative; tool progress is replace-on-update; `bash_execution_update` correlates by command `id`. (I1)
4. **Durability comes from `get_entries(since)` + `leafId` + `get_state`.** Entry ids are durable cursors across restarts; an invalid cursor forces a full snapshot (`get_messages`/`get_tree`); `get_session_stats` is the active-session dashboard metadata source (tokens, cost, context usage). (I1, I6)
5. **No native idempotency anywhere.** The `id` field is correlation-only; grepping the installed RPC implementation finds no mutation-id/dedup surface. The relay mutation ledger (principal, clientMutationId, payload digest) is mandatory; digest mismatch on retry is a conflict error. (I3, I6)
6. **Reconnect protocol.** Server-assigned monotonic per-stream seq, persist-before-fan-out, replay `seq > cursor`, cumulative ACKs; `seq > cursor+1` ⇒ stop-and-replay; WebSocket provides no backpressure (monitor `bufferedAmount`) and per-connection ordering only. (I1, I3)
7. **Pi-child crash ⇒ indeterminate outcome.** Received acceptance responses are valid persisted outcomes; a crash between stdin write and response leaves the mutation `indeterminate` and the UI surfaces resend-or-cancel — never auto-resend. (I3)
8. **Approvals are extension-UI dialogs, epoch-scoped and lease-guarded.** Unique dialog ids, stale/duplicate responders rejected, child restart invalidates outstanding dialogs, multi-client contention resolved by atomic CAS on a lease; approval payloads are digest-bound and the canonical tool-call digest is recomputed immediately before execution with fail-closed mismatch handling. (I1, I3, I6)
9. **Security model.** Tailscale Serve (tailnet-only, auto-TLS, ACL reachability) + relay-local authN/authZ: wss-only, handshake auth, exact-Origin allowlist (CSWSH defense), per-action authorization matrix, short-lived rotating credentials, rate limits, audit without tokens/payloads. Funnel and public bridges rejected; workspace containment via OS sandbox; session files sensitive; metadata-only retention with digests. The approval extension is admin-owned, hash/version-pinned, fail-closed for side-effect tools (Pi docs: extensions run with full system permissions). (I4)
10. **PWA/mobile contract.** iOS Web Push requires Home Screen install (16.4+), explicit user gesture, userVisibleOnly only; service workers are event-driven (no Background Sync on WebKit, evictable cache) so the relay is the source of truth; pushes are RFC 8291 `aes128gcm`-encrypted committed-transition hints with VAPID discipline — never decision carriers; offline is stale read-only with outbox retry; approvals are never decided offline. (I5)
11. **Phasing.** 0: local MVP (no auth) → 1: exposure/auth, read-only remote clients → 2: pinned approval extension installed, mutation-capable → 3: mobility/push/offline → 4: parity (fork/clone, multi-session, multi-device). Executable gate per phase (G1-G9). (I5, I6)
12. **Session mutations are cancellable.** `new_session`/`switch_session`/`fork`/`clone` can be vetoed by extension handlers (`data.cancelled`); the catalog treats them as request-outcome pairs. (I6)

## 5. Protocol Mapping (Commands/Events → UI)

- Composer/control: `prompt` (with `streamingBehavior: steer|followUp`), `steer`, `follow_up`, `abort`, `abort_retry`, `abort_bash`, `compact`, `set_auto_compaction`, `set_auto_retry`, model/thinking cycling. (I2)
- Actions menu: `get_commands` (extension commands, prompt templates, skills; TUI-only builtins excluded). (I2)
- Chat bubbles: four roles — `UserMessage`, `AssistantMessage` (text/thinking/toolCall blocks, `stopReason`), `ToolResultMessage` (by `toolCallId`), `BashExecutionMessage`. (I2)
- Tool activity: `tool_execution_start/update/end` → expandable tool cards; `bash_execution_update` → streamed terminal output; `queue_update` → queue status. (I2)
- Session list: relay-built from `--session-dir` scan + `get_state`/`get_entries`/`get_tree`; `get_session_stats` is per-active-session dashboard metadata (tokens, cost, context usage), not list-wide; `new_session`, `switch_session`, `fork`, `clone`, `set_session_name` for management UX. (I2, I6)
- Approvals: `extension_ui_request` dialogs (`select`/`confirm`/`input`/`editor`) ↔ `extension_ui_response`; `notify`/`setStatus`/`setWidget`/`setTitle`/`set_editor_text` fire-and-forget. (I1, I2)

## 6. State Model and Reconnect Protocol

Durable relay schema (v1): `sessions` (epoch, lastEntryId, state), `envelopes` (per-stream seq, eventId, epoch, raw event — append-only, bounded retention window, redacted/encrypted raw payloads because they feed replay), `mutations` (clientMutationId, principal, payloadDigest, status: pending/accepted/indeterminate/done/failed, outcome), `approvals` (dialogId, epoch, method, payloadDigest, status, leaseOwner/Token/Expiry, version, responder), `client_cursors` (principal, sessionId, lastEventSeq, lastEntryId). Reconnect: replay → reconcile (`get_entries(since)`; invalid cursor ⇒ snapshot) → resume live; compaction `firstKeptEntryId` acts as a snapshot barrier. (I3)

## 7. Security and Network Exposure

Serve is the correct exposure; Funnel rejected; public WebSocket bridge acceptable only with the full OWASP layer for non-tailnet users. Tailnet identity = reachability, not authorization. Relay-local: handshake auth, exact-Origin allowlist, per-action authorization matrix (default-deny; phase-1 read-only), short-lived rotating credentials, rate limits, audit logging without tokens/payloads, secret-managed VAPID keys, encrypted-at-rest subscription material. Retention is layered: replay envelopes are bounded-window, redacted/encrypted raw events (needed for reconnect replay), while audit and notification surfaces are metadata-only (digests, no payloads). Containment: sandboxed Pi child, least-privilege, sensitive session files. Trust: admin-owned hash/version-pinned approval extension, fail-closed for side-effect tools. (I4, I5)

## 8. PWA and Notifications

Web Push via Service Worker + Push API + VAPID; iOS 16.4+ requires Home Screen install and gesture-triggered permission; userVisibleOnly enforced; payloads RFC 8291-encrypted, ≤ ~4 KB, opaque event-ID hints with fetch-on-receive; TTL/Topic for staleness/coalescing; 410 Gone ⇒ re-subscribe; notifications are committed-transition hints (agent_settled, approval-needed, long job end); foregrounded client uses the live stream and suppresses pushes; offline renders stale read-only snapshot with outbox retry; approvals revalidate in foreground. (I5)

## 9. UX Parity Baseline

Claude-app parity reference: chat-as-control-plane, streaming shells with immediate progress, full-width touch cards (~44pt targets), structured tappable inputs with text fallback, progressive disclosure; Claude Remote Control's approval-fatigue data (93% approve rate) motivates decision-ready approval cards and relay-enforced policy reporting (Pi has no native permission-mode flag). (I2)

## 10. Recommendations

1. Build the relay as the single durable authority; the PWA is a stateful renderer over its envelopes.
2. Ship phase 0 (local MVP, no auth) first, phase 1 read-only remote, and only install the pinned fail-closed approval extension before enabling remote mutations (phase 2).
3. Adopt the G1-G9 acceptance matrix as the release gate; do not claim release readiness until G1-G9 pass on real hardware (real Pi child, relay restart, Serve + Origin checks, iOS device push, two-device contention).
4. Implement mutation ledger with payload digests and digest-conflict rejection; treat crash-without-response as indeterminate and surface resend-or-cancel.
5. Use tailnet-only Serve for personal/team use; treat any public bridge as an internet-facing application with the full OWASP layer.

## 11. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Direct browser-to-Pi connection | Browsers cannot consume child-process stdin/stdout protocol | RPC transport is stdio JSONL; browser transport is HTTP/WS | 1 |
| One Pi process per prompt | Makes the socket the lifecycle owner; loses async run boundary | rpc.md:43-76, 832-888 | 1 |
| Treating prompt acceptance as completion | Contradicted by the RPC contract | rpc.md:71-76 | 1 |
| Transient events as durable session catalog | Durable entries exist separately; events lack replay cursors | rpc.md:694-722, 832-835 | 1 |
| Surfacing TUI-only commands in mobile menu | Do not execute via `prompt` | rpc.md:791-832 | 2 |
| `tool_execution_start` as approval signal | Approvals are exclusively extension-UI dialogs | rpc.md:972-1015, 1144-1160 | 2 |
| Claude Remote Control mode model verbatim | Pi has no equivalent permission-mode flag | code.claude.com permission-modes docs | 2 |
| Wall-clock replay cursors | Must be monotonic server sequence per stream | Ably/Socket.IO patterns, RFC 6455 | 3 |
| Auto-resend in-flight prompts after crash | Duplicate risk; surface indeterminate instead | Acceptance contract + exactly-once literature | 3 |
| Client-side approval timeout tracking | Agent-side timeout auto-resolve is authoritative | rpc.md:1167-1186 | 3 |
| Broker-side dedup alone (e.g., SQS 5-min window) | Bounded windows don't cover long-lived agent runs | Azure/SQS docs | 3 |
| Tailscale Funnel as exposure path | Public listeners without per-visitor identity | tailscale.com/kb/1223/funnel | 4 |
| Tailnet identity as sole authorization | Reachability only; per-action authZ still required | OWASP WebSocket cheat sheet | 4 |
| Public WebSocket bridge as default | Strictly more attack surface than Serve | OWASP + Tailscale Funnel guidance | 4 |
| Full mutation payload retention | Metadata-only + digests is the safer default | Least-privilege data handling | 4 |
| Silent pushes / background compute on iOS | WebKit requires user-visible notifications, may revoke | Apple developer docs | 5 |
| Background Sync reliance | Scheduled, not real-time; WebKit bug open | bugs.webkit.org/201866 | 5 |
| Client cache as canonical state | Evictable under storage pressure | webkit.org/blog/14403 | 5 |
| Decision-carrying push payloads | Pushes are unreliable hints; approvals revalidate foreground | RFC 8291 + W3C Push API | 5 |
| Unconditional session mutations | Cancellable by `session_before_switch`/`session_before_fork` handlers | rpc.md:597-672 | 6 |

## 11A. Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none — all six iterations progressed on distinct angles (architecture, UI mapping, state/reconnect, security, PWA/phasing, validation).
- Remaining frontier: live execution gates G1-G9 (real Pi child transcript, relay crash fixture, deployed Serve + PROXY/Origin checks, iOS push on device, two-device lease contention, extension pinning mechanics).

## 12. Open Questions

None by design: all five key questions plus the validation question are answered with evidence. Residual uncertainty is execution-time, not design-time: (a) session-dir layout is undocumented — the catalog needs a filesystem probe; (b) extension hash/version pinning mechanics depend on Pi's loading implementation; (c) iOS push behavior requires a real device. Each is captured as an acceptance gate or implementation-time verification.

## 13. Residual Risks (ranked)

1. **P0 — Approval argument TOCTOU/post-gate mutation.** Mitigated by approval-time digest binding plus canonical tool-call digest recomputation immediately before execution with fail-closed mismatch handling; gate G5 must include mutate-after-open and execute-with-mismatch attempts.
2. **P0 — Relay crash behavior.** Envelope persistence, mutation-ledger recovery, approval-map restore after relay restart are designed but untested; gate G3 must include relay-restart mid-stream.
3. **P1 — Serve PROXY protocol + Origin validation integration.** Tailscale terminates TLS; source-IP/Origin behavior against the relay is untested.
4. **P1 — iOS push on a real device.** Home Screen install, gesture-grant, delivery (G7) cannot be simulated.
5. **P1 — Extension trust chain.** Hash/version pinning depends on Pi's extension loading mechanics; verification at implementation time.
6. **P2 — Multi-client lease contention UX.** CAS specified; observe-not-answer UX for the non-lease holder needs a live two-device test (G9).

## 14. Acceptance Matrix (executable gates)

| Gate | Phase | Pass criterion |
|---|---|---|
| G1 | 0 | Strict-LF framing round-trip: `pi --mode rpc` + id-correlated response + event stream parsed with LF-only splits |
| G2 | 0 | Settlement: normal LLM prompt run ends with exactly one `agent_settled`; no second `response` for a request id |
| G3 | 1 | Gap-free replay from `lastEventSeq` with cumulative ACKs; passes relay-restart mid-stream |
| G4 | 1 | Unauthenticated handshake rejected; non-allowlisted Origin rejected; per-action matrix enforced (phase-1 read-only) |
| G5 | 2 | Approval round-trip: dialog → card → response; second responder rejected; CAS lease holds; epoch invalidation after child restart; digest recompute-before-execute with fail-closed mismatch |
| G6 | 2 | Same `clientMutationId` + different payload ⇒ conflict error; same payload ⇒ original outcome returned |
| G7 | 3 | iOS: Home Screen install, gesture-grant, push receipt, tap-to-open |
| G8 | 3 | Offline: stale snapshot + stale marking + outbox retry with dedup |
| G9 | 4 | Fork/clone UX + two-device lease contention behaves per spec |

## 15. Sources Consulted (canonical)

- Pi RPC protocol: `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md` (framing, commands, events, extension-UI, types)
- Pi RPC implementation: `dist/modes/rpc/rpc-client.js`, `dist/modes/rpc/rpc-types.d.ts` (settlement resolution, leafId, no idempotency fields)
- Pi CLI reference: `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md`
- Pi extensions trust: `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:111`
- Tailscale: `tailscale.com/kb/1242/tailscale-serve`, `tailscale.com/kb/1223/funnel`, `tailscale.com/docs/features/access-control/acls`, `tailscale.com/blog/introducing-tailscale-funnel`
- OWASP: WebSocket Security Cheat Sheet; WSTG WebSockets testing
- Web Push: RFC 6455, RFC 8291, RFC 8292, W3C Push API, MDN Push API/WebSocket API, WebKit blog 13878, Apple developer docs, web.dev service workers, MDN Background Sync, bugs.webkit.org/201866, webkit.org/blog/14403
- Messaging semantics: Azure Service Bus, Kafka design, AWS SQS, Socket.IO delivery/state-recovery, Ably idempotency
- Claude parity: code.claude.com remote-control/permission-modes/permissions, GitHub issue #29214, claude.com design guidelines, Apple HIG loading
- Resource map: emitted alongside this report from iteration delta sources (`resource-map.md`)

## 16. Convergence Report

- Stop reason: `maxIterationsReached` (stop policy: max-iterations; convergence treated as telemetry)
- Total iterations: 6
- Questions answered: 6 / 6 (5 key + 1 validation)
- Remaining questions: 0
- Last 3 iteration summaries: run 4: security model (0.93) · run 5: PWA/phasing (0.88) · run 6: validation (0.75)
- Convergence threshold: 0.02
- Ratio trend: `1.00 → 0.85 → 0.90 → 0.93 → 0.88 → 0.75`; last-3 rolling avg 0.853; MAD floor ~0.058; question coverage 100%; composite stop score 0.35 ≤ 0.60 — no convergence-driven stop would have fired, consistent with the mandated telemetry-only policy.
- Divergence summary: no pivots; six distinct focus angles; remaining frontier = executable gates G1-G9.

## 17. Disclaimer

This research is evidence-grounded design; it is not a live implementation. Every claim is cited to primary or authoritative secondary sources (installed Pi docs/implementation, RFCs, Tailscale, OWASP, WebKit/Apple, W3C). Release readiness is explicitly blocked on the executable acceptance matrix (G1-G9), none of which were run in this environment.
