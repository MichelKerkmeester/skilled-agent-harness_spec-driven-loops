# Research: Claude-Style Mobile Client for Pi RPC

## 1. Executive Summary

Build the product as a **relay-owned remote agent**, not as a browser wrapper around a Pi process. The recommended MVP is:

```text
Installed mobile PWA
  → tailnet HTTPS/WSS through Tailscale Serve
  → loopback-only authenticated relay
  → one isolated Pi RPC child per concurrently active session
  → durable Pi session storage plus relay replay/mutation/approval state
```

Pi RPC supplies the necessary live primitives: strict LF-delimited JSONL, accepted/queued prompts, streamed message/tool events, `agent_settled`, current-state snapshots, durable `get_entries(since)` cursors, session switching, and extension UI dialogs. It does **not** supply a browser transport, a session catalog, event replay, prompt idempotency, mobile authorization, general tool approvals, push delivery, or process-crash exactly-once semantics. Those belong to the relay, a pinned Pi approval extension, and the PWA. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-76] [SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-006.md]

The architecture is design-ready but not release-ready. The release gates are approval TOCTOU protection, real Pi crash/replay tests, Serve WSS identity and backend-bypass tests, OS containment, redaction canaries, mobile-device push/reconnect tests, and accessibility evidence. [SOURCE: iterations/iteration-006.md]

## 2. Scope and Method

Six sequential evidence passes covered: RPC/process architecture; RPC-to-UI mapping; reconnect and durable relay state; security and network exposure; PWA/push/product phasing; and an independent contradiction/acceptance review. The loop was forced to six iterations under `max-iterations`; convergence telemetry never terminated it early. Each iteration produced a cited narrative, canonical JSONL record, and structured delta. [SOURCE: deep-research-state.jsonl] [SOURCE: deep-research-dashboard.md]

The research did not implement a relay, PWA, extension, sandbox, or test harness. A deterministic in-memory transition model passed 21/21 checks, but real scheduling, persistence, proxy, device, and assistive-technology behavior remains unverified. [SOURCE: deltas/iter-006.jsonl]

## 3. Confirmed Pi RPC Contract

- RPC is a persistent subprocess protocol: commands go to stdin and responses/events share stdout as strict LF-delimited JSONL. Node `readline` is explicitly unsafe because it can split Unicode separators inside JSON. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-37]
- A successful `prompt` response means accepted, queued, or handled—not completed. `agent_end` may be followed by retry, compaction, or queued work. `agent_settled` is the terminal automatic-work boundary. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:43-76] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-888]
- `message_update` is delta-only and keyed by `contentIndex`; `message_end.message` is authoritative. Tool progress uses `toolCallId`; `tool_execution_update.partialResult` is accumulated replacement state, not an append delta. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:906-1015]
- `get_entries(since)` returns append-order entries after a stable entry ID and the current `leafId`; it includes pre-compaction and abandoned-branch history. An unknown cursor fails. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:694-722]
- Dialog extension UI requests (`confirm`, `select`, `input`, `editor`) block on a matching response ID; fire-and-forget UI requests do not. Standard `confirm` returns a boolean/cancel result and carries no signed approval capability. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1144-1165] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1312-1334]

## 4. Recommended Architecture

Use six explicit seams:

1. **Mobile PWA:** rendering, capability checks, opaque session IDs, reconnect cursors, foreground approval intent.
2. **Serve ingress:** tailnet reachability, TLS, and attested Tailscale identity bootstrap.
3. **Relay domain:** application sessions, workspace/session/action authorization, session catalog, event replay, mutation/approval ledgers, redaction, and push decisions.
4. **RPC adapter:** strict-LF parser, serialized stdin writer, response/event demultiplexing, child supervision, and epoch binding.
5. **Approval gate:** frozen canonical tool input and final pre-execution negative-default decision.
6. **OS/container boundary:** workspace filesystem, process, credential, UID, and network containment.

No seam inherits the authority of the previous seam. Tailnet admission is not application authorization; an approval card is not the execution gate; and project trust is not a sandbox. [SOURCE: iterations/iteration-004.md] [SOURCE: iterations/iteration-006.md] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:31-37]

## 5. Relay Process and Data Model

The relay outlives mobile sockets and owns one RPC child per concurrently active session. Idle sessions can close and reopen from server-held Pi session paths. A shared child may use `switch_session` only under an exclusive idle lock, because switching aborts/disposes the outgoing session. [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-006.md]

Minimum durable relations:

| Relation | Identity and purpose |
|---|---|
| `session_catalog` | Opaque relay session ID → private Pi session ID/path, workspace, display metadata |
| `child_binding` | Immutable stream epoch → session, child identity, lifecycle state |
| `replay_event` | `(session, epoch, seq)` redacted envelope plus floor/high watermarks |
| `entry_cache` | Pi entry IDs, append order, cursor, leaf, snapshot revision |
| `mutation_ledger` | `(principal, session, clientMutationId)` digest and prepared/dispatching/accepted/rejected/indeterminate state |
| `approval_request` | `(session, epoch, Pi request ID, payload digest)` policy, lease, first decision, audit outcome |

Redaction must precede sequenced persistence: `parse → validate binding → normalize/classify → redact → commit envelope → broadcast/push`. [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-006.md]

## 6. Mobile UI State Machine

Do not model one linear “request status.” Maintain orthogonal axes:

- connection: offline / connecting / reconciling / live / degraded;
- mutation: local / prepared / dispatching / accepted / rejected / indeterminate;
- run: idle / running / retrying / compacting / settled / interrupted;
- message: draft blocks keyed by `contentIndex` → terminal authoritative message;
- tool: constructing call → running card → succeeded/failed terminal card;
- approval: pending / leased / responded / denied / expired / stale;
- queue: steering and follow-up items separate from the active turn.

Sequence and deduplicate the relay envelope before applying Pi deltas. Never let a late command acknowledgement regress a run already advanced by events. [SOURCE: iterations/iteration-002.md]

## 7. Reconnect, Replay, and Idempotency

Every spawn, restart, or successful session rebind creates a fresh immutable `streamEpoch`; `eventSeq` starts at 1. Commit envelopes before broadcast and retain bounded floor/high watermarks. A cursor is replayable only for the same session/epoch and within the retained window. Duplicates are ignored; a sequence gap pauses reduction and triggers reconciliation. [SOURCE: iterations/iteration-003.md]

On replay miss, freeze transient reducers, serialize against session switching, query `get_state` and `get_entries`, append a relay `snapshot_barrier`, send the snapshot through that barrier, then release later envelopes. Unknown Pi entry cursors require full entry/cache/leaf replacement, not `get_messages` alone. The barrier is a relay inference and requires real interleaving tests. [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-006.md]

RPC request IDs correlate responses but do not deduplicate mutations. Persist a client mutation ledger before the Pi write. Normal retries with the same key/digest return recorded state; digest changes conflict. A relay crash after stdin write but before response persistence is unavoidably `indeterminate`; blind resend can duplicate work. Exactly-once across that boundary requires a new Pi-side durable mutation primitive. [SOURCE: iterations/iteration-003.md]

## 8. Session Catalog and Navigation

RPC can switch to a known session path but does not document a list-sessions command. Use version-matched `SessionManager.list(cwd, sessionDir)` on the server, expose opaque relay IDs and redacted metadata, and keep paths private. Do not accept browser-supplied filesystem paths or unrestricted cross-workspace `listAll`. [SOURCE: iterations/iteration-002.md]

Opening a session attaches to or creates its isolated active binding. It must not casually rebind a child that is running or observed by another client. [SOURCE: iterations/iteration-003.md]

## 9. Approval Model

Tool activity is observability, not approval. A pinned privileged extension must gate protected tools before execution and use RPC extension UI for the user interaction. The relay scopes the pending request to principal, session, epoch, request ID, canonical payload digest, deadline, and policy; it authorizes the principal and accepts exactly one current decision. [SOURCE: iterations/iteration-002.md] [SOURCE: iterations/iteration-003.md]

Revision from the validation pass: standard `confirm` carries no signed capability. The MVP must freeze canonical tool name/arguments before asking, run the gate as the final audited handler or wrapper, prevent later untrusted mutation, and fail closed on timeout, restart, revocation, epoch change, extension hash mismatch, or relay failure. A signed capability would require an explicit protocol/custom-extension design. [SOURCE: iterations/iteration-006.md] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:753-765]

## 10. Security and Network Exposure

Default to tailnet-only Tailscale Serve with a loopback backend; do not configure Funnel. Current Serve docs state that it injects anti-spoofed Tailscale user headers for local backends. Treat that identity as an attested authentication bootstrap only, then issue a short-lived relay application session and enforce server-owned workspace/session/action authorization for every message. WSS upgrade identity propagation and direct-backend rejection must pass on the pinned deployment. [SOURCE: https://tailscale.com/docs/features/tailscale-serve] [SOURCE: https://tailscale.com/docs/features/access-control/grants] [SOURCE: iterations/iteration-006.md]

For the browser endpoint require WSS, exact Origin allowlisting, a secure SameSite session cookie, a one-use connection ticket, expiry/revocation, message-size and per-principal rate limits, bounded replay/queues, and a reserved control lane for abort/deny/revocation/settlement. Public Internet WSS is a separately reviewed exception, never the default maturity path. [SOURCE: https://www.rfc-editor.org/rfc/rfc6455#section-10.2] [SOURCE: https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/WebSocket_Security_Cheat_Sheet.md] [SOURCE: iterations/iteration-004.md]

Prevent secret access at the workspace/tool boundary, redact before every remote or durable representation, and retain structured metadata rather than raw prompts/tool output. [SOURCE: iterations/iteration-004.md]

## 11. Recommendations

1. Keep the tailnet-only, relay-owned topology.
2. Pin Pi, Tailscale, browsers, and the approval-extension hash; rerun contract suites on upgrades.
3. Use one isolated Pi child per concurrently active session.
4. Treat prompt crash recovery as at-most-once with explicit `indeterminate`, not exactly-once.
5. Freeze canonical tool inputs and ship side-effecting tools only after approval-gate tests pass.
6. Redact before replay persistence; use the same policy for snapshots, catalogs, offline cache, audit, and push.
7. Ship push only for a pinned, device-tested matrix.
8. Make crash, security, device, and accessibility gates MVP requirements rather than post-launch polish.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Direct PWA → Pi stdio | Browser cannot own a local child protocol | Pi RPC is stdin/stdout JSONL | 1 |
| One Pi process per prompt | Breaks persistent event/settlement lifecycle | Prompt acceptance and settlement are separate | 1 |
| RPC request ID as idempotency key | Correlation has no durable dedup guarantee | RPC command contract | 2-3 |
| Blind resend after relay crash | Can duplicate an already accepted prompt | Uncoordinated relay/Pi commit boundary | 3 |
| Shared-child navigation switching | May abort/dispose another active session | Runtime switch behavior | 3, 6 |
| Public Funnel/WSS by default | Unnecessarily widens a tool-authorized service | Serve/Funnel reachability distinction | 4 |
| Tailnet membership as app authority | Network admission is not per-action authorization | Grants and relay policy boundary | 4, 6 |
| Mobile card as tool gate | UI display cannot block execution | Pi extension/tool-hook contract | 2, 4 |
| Signed capability over standard `confirm` | Wire response is boolean/cancel keyed by ID | Pi RPC extension UI contract | 6 |
| Service worker owning WSS/Pi | Worker lifetime is event-bounded | Service Worker specification | 5 |
| Sensitive/actionable push | Lock-screen and stale-state leakage/authority | Push and approval boundaries | 5 |
| Offline/background prompt queue | Limited background execution plus crash ambiguity | Background Sync and mutation model | 5 |
| Documentation-only release certification | Cannot prove timing, deployment, devices, or accessibility | Validation pass | 6 |

## Divergence Map

The research broadened from transport to protocol durability, then security, product behavior, and release validation. Saturated directions are relay-only exactly-once delivery and public exposure by default. The remaining frontier is implementation evidence: approval ordering, relay/Pi kill points, Serve WSS behavior, containment/redaction canaries, mobile push, and accessibility. No divergent Council pivot occurred. [SOURCE: deep-research-strategy.md] [SOURCE: iterations/iteration-006.md]

## 12. Open Questions

The five design questions are answered. Remaining questions are empirical release questions:

- Does the pinned Serve deployment preserve anti-spoofed identity on WSS upgrade and reject direct backend access?
- Does the final approval wrapper block mutated arguments across handler ordering, timeout, restart, and racing responders?
- Do real Pi crash points preserve replay/barrier behavior and expose every uncertain submission as `indeterminate`?
- Which exact iOS/Android/browser rows pass private-origin install, push, reconnect, stale approval, and logout/revocation tests?
- Do VoiceOver, TalkBack, keyboard, zoom/reflow, and live-region tests pass while messages/tools stream?

[UNVERIFIED: each item requires the executable/device evidence in Section 16]

## 13. Claude-Style Mobile UX

The MVP needs four clear surfaces:

- **Session list:** redacted title/preview, last activity, running/needs-attention/settled/interrupted/offline status.
- **Thread:** user/assistant bubbles, one replaceable streaming draft, collapsed sanitized tool cards, explicit queue chips.
- **Approval sheet:** canonical action/risk/workspace summary, deadline, Deny and Allow once, stale terminal state.
- **Connection banner:** offline/connecting/reconciling/degraded status; never an ambiguous spinner.

The composer distinguishes local, accepted, queued, running, rejected, and indeterminate. Streaming updates must not steal focus or flood assistive live regions. [SOURCE: iterations/iteration-005.md] [SOURCE: https://www.w3.org/TR/WCAG22/]

## 14. Push, Background, and Offline Behavior

The relay owns all background work. Service workers only process bounded push/notification events; opening a notification launches/focuses the PWA, which reauthenticates and reconciles. iOS/iPadOS Web Push is confirmed for Home Screen web apps from 16.4; Android must use a pinned device/browser matrix and exclude Android WebView unless later evidence changes that boundary. [SOURCE: https://webkit.org/blog/13966/webkit-features-in-safari-16-4/] [SOURCE: https://www.w3.org/TR/service-workers/#service-worker-lifetime] [SOURCE: iterations/iteration-006.md]

Push notifications are generic, deduplicated hints for committed `agent_settled`, pending-approval, interrupted, or indeterminate transitions. They contain an opaque lookup ID, not transcript/tool/workspace/approval content. Approval always requires foreground reauthentication and live pending-state validation. Offline mode is a timestamped, redacted, read-only snapshot; all mutations remain disabled. [SOURCE: iterations/iteration-005.md]

## 15. Implementation Phases

### Phase A — Acceptance harness and trusted core

Create failing P0 tests for RPC framing/lifecycle, replay/reconcile, crash idempotency, session isolation, Serve/auth, sandbox/redaction, and approval gating. Build the strict RPC adapter, relay state model, and isolated workspace runner only behind those gates.

### Phase B — Foreground mobile MVP

Add relay auth/session catalog, responsive installable PWA, session/thread/tool/connection surfaces, foreground prompt/abort, and revalidated approvals. Keep public exposure, offline mutations, and push disabled.

### Phase C — Pinned push/device release

Implement metadata-only push, offline read-only cache, notification preferences/deduplication, and the declared iOS/Android matrix. Run stale approval, kill/background/reinstall, logout/revocation, and accessibility gates.

### Phase D — Hardening and optional enhancements

Add multi-device preferences, richer sanitized history, attachments/voice, administration, and possibly a native wrapper only when a verified requirement exceeds PWA platform capability. Public WSS remains an exceptional security project.

## 16. Acceptance Matrix

| Gate | Objective pass condition | Status |
|---|---|---|
| RPC framing/lifecycle | LF/CRLF safe, Unicode separators preserved, stderr isolated, acceptance/retry/settlement/tool semantics match pinned Pi | NOT RUN |
| Replay/reconcile | Duplicate ignored, gap pauses, replay miss snapshots, foreign entry cursor fully replaces, barrier interleavings safe | NOT RUN |
| Mutation crash | Same key writes once; changed digest conflicts; recovered dispatching is indeterminate and never resent | NOT RUN |
| Session isolation | Selecting B cannot abort/observe A; exclusive idle switch verifies before new epoch | NOT RUN |
| Serve/auth/WSS | Identity header anti-spoofing, Origin/ticket checks, direct backend/Funnel rejection, revocation close | NOT RUN |
| Sandbox/redaction | Workspace escape blocked; zero canary secrets in replay/snapshot/log/cache/audit/push | NOT RUN |
| Approval | Frozen exact args only; timeout/restart/revocation/old epoch/duplicate/race/post-gate mutation all deny | NOT RUN |
| Push/PWA | Only committed transitions notify; payload generic; click reconciles; worker owns no persistent socket; offline is read-only | NOT RUN |
| Accessibility | WCAG 2.2 AA automation plus keyboard, VoiceOver, TalkBack, zoom/reflow, coalesced streaming status | NOT RUN |
| Real devices | Pinned iOS Home Screen and Android Chrome/Firefox install/push/kill/Focus/reinstall/reconnect/stale-approval/logout evidence | NOT RUN |

Detailed proposed commands and artifact paths are in `iterations/iteration-006.md`. The deterministic no-write model passed 21/21 logical transition checks, but it does not satisfy these release gates. [SOURCE: deltas/iter-006.jsonl]

## 17. References

Primary references:

- Pi RPC contract: `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md`
- Pi extension and security contracts: `docs/extensions.md`, `docs/security.md` in the installed package
- Pi version-matched RPC/session implementation under the installed package `dist/`
- Tailscale Serve and grants: `https://tailscale.com/docs/features/tailscale-serve`, `https://tailscale.com/docs/features/access-control/grants`
- RFC 6455 and OWASP WebSocket Security Cheat Sheet
- WebKit Safari 16.4 Web Push, MDN Push/PWA/Cache APIs, W3C Service Workers and WCAG 2.2
- Iteration evidence: `iterations/iteration-001.md` through `iterations/iteration-006.md`

## Convergence Report

- Stop reason: `maxIterationsReached`
- Iterations completed: 6 / 6
- Questions answered: 5 / 5 original plus 1 / 1 validation question
- newInfoRatio trend: `[1.00, 0.81, 0.89, 0.91, 0.91, 0.74]`
- Last-three rolling average: `0.853` versus threshold `0.02` → CONTINUE vote
- MAD noise floor: approximately `0.074`; latest `0.74` → CONTINUE vote
- Question coverage: `100%` → STOP vote
- Composite stop score: `0.35`, below `0.60`
- Terminal decision: hard maximum reached; synthesize with the residual risks and unrun gates above
