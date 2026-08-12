# Iteration 6: Independent end-to-end architecture validation

## Focus
This terminal iteration independently checked the architecture from iterations 1-5 for cross-iteration contradictions, missing controls, unjustified assumptions, implementation seam boundaries, and release acceptance criteria. The selected interpretation is architecture validation, not implementation certification: there is no relay/PWA implementation, isolated Pi crash fixture, or real-device evidence in this lineage. Relay-only exactly-once submission and public exposure by default remain exhausted and were not reopened.

Evidence labels below are strict: **confirmed** means directly supported by the installed Pi 0.84.1 contract/source or a current primary source; **inferred** means a design conclusion composed from confirmed boundaries; **unverified** means an executable or real-device gate remains open.

## Route Proof
```json
{"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research"}
```

## Findings
1. **High — the core topology is confirmed, but only with explicit trust seams and ordering.** **Confirmed:** Pi RPC 0.84.1 is strict-LF JSONL over a persistent child; prompt success is acceptance rather than completion; asynchronous events generally lack request IDs; `agent_settled` is the terminal session-level signal; and `get_entries(since)` supplies a durable entry cursor. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-76] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:694-722] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-888] **Inferred:** the recommended topology remains `PWA -> authenticated tailnet HTTPS/WSS Serve -> loopback relay -> isolated, relay-owned Pi RPC child`, with browser attachment replaceable and relay state durable. The minimum implementation seams are browser/PWA, trusted ingress and identity bootstrap, relay domain state, strict RPC adapter, pinned approval gate, and OS isolation; no layer may silently inherit the authority of the layer before it. [INFERENCE: based on the confirmed RPC lifecycle plus iterations 1, 3, and 4] **Unverified:** a live end-to-end child/relay trace has not demonstrated these seams.

2. **Critical — the prior “signed decision capability” at the approval hook is unsupported by the standard `confirm` wire contract and must be revised.** **Confirmed:** an RPC `confirm` response contains only matching request `id` plus `confirmed: true`, cancellation, or the timeout default; Pi resolves and deletes a process-local pending request. Separately, `tool_call` input is mutable, later handlers see mutations, and Pi performs no validation after those mutations. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1144-1153] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1312-1334] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:43-77] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:753-765] **Contradiction resolved:** iteration 4's signed-capability wording is not available through standard `confirm`; the relay decision ledger and Pi pending request ID are the trusted transport. The gate must canonicalize and retain the exact tool name/input before requesting approval, allow only that frozen value, run as the final audited pre-execution handler (or wrap the tool), prohibit later untrusted mutators, and fail closed on timeout/restart/hash mismatch. A cryptographic capability at the extension boundary requires a deliberate protocol/custom-extension change and is not an MVP property. [INFERENCE: the boolean response cannot itself carry or prove a signed payload capability] **Unverified:** mutation-after-approval, handler-order, timeout, restart, and two-responder races are release blockers.

3. **Critical — current Serve documentation closes the identity-header evidence gap, but not application authorization or upgrade testing.** **Confirmed:** current Tailscale Serve documentation says tailnet Serve traffic adds `Tailscale-User-Login`, `Tailscale-User-Name`, and profile headers to the local backend and removes incoming copies to prevent spoofing; Funnel does not supply those identity headers. Grants separately distinguish network and application capabilities. [SOURCE: https://tailscale.com/docs/features/tailscale-serve] [SOURCE: https://tailscale.com/docs/features/access-control/grants] **Revision:** with a pinned Tailscale version, loopback-only backend, startup attestation, and no bypass route, `Tailscale-User-Login` can bootstrap the relay principal and a short-lived application session. It is not workspace/session/action authorization; every message still needs server-owned policy checks, exact Origin, a one-use connection ticket, expiry/revocation, and per-principal limits. [SOURCE: https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/WebSocket_Security_Cheat_Sheet.md] [INFERENCE: anti-spoofed proxy identity is an authentication assertion only within the attested proxy boundary] **Unverified:** the retrieved Serve page did not explicitly mention WebSocket upgrades, so identity-header propagation on the deployed WSS upgrade and direct-backend rejection require a pinned-version integration test.

4. **Critical — reconnect behavior is internally consistent but remains a relay-level guarantee, not a Pi guarantee.** **Confirmed:** Pi forwards events to stdout, handles prompt acceptance asynchronously, returns a synchronous `get_entries` response from current in-memory entries, and only correlates RPC responses by request ID. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:263-319] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:502-512] **Inferred:** immutable epoch/sequence, durable-before-broadcast replay, a committed snapshot barrier, foreign-cursor full replacement, and a client mutation ledger are coherent. However, neither snapshot-barrier atomicity nor relay/Pi cross-process exactly-once submission exists in Pi's contract. Recovered `dispatching` must remain `indeterminate`, never auto-resend. [SOURCE: iterations/iteration-003.md] [INFERENCE: Pi has no durable mobile mutation identifier that can share the relay transaction] **Unverified:** process-kill points, stdout/DB crash boundaries, replay eviction, duplicate/gap reduction, and barrier interleavings need a real isolated fault harness.

5. **High — redaction must precede every durable or remote representation, which fixes a cross-iteration seam ambiguity.** Iteration 3 requires event persistence before broadcast, while iteration 4 requires redaction before persistence/fan-out. The only safe composition is `parse -> validate child/session/epoch -> normalize/classify -> redact -> commit sequenced envelope -> broadcast/push`; reconciliation snapshots, session previews, offline cache, audits, and push lookup records must use the same versioned policy. [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-004.md] [INFERENCE: committing raw Pi output first would violate the later security boundary even if fan-out were redacted] **Unverified:** secret-canary tests have not proven that raw tool arguments/results, paths, credentials, or push endpoints stay out of replay, logs, snapshots, caches, and notifications.

6. **High — session-list navigation must not invoke destructive shared-child switching.** **Confirmed:** RPC accepts a server path for `switch_session` and rebinds the active session after success; iteration 3's version-matched runtime inspection showed outgoing-session abort/disposal during replacement. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:597-613] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:473-478] [SOURCE: iterations/iteration-003.md] **Inferred:** mobile session selection should attach to an existing per-session binding or spawn/reopen an isolated child; a shared child may switch only under an exclusive idle lock, with server-resolved path, cancellation handling, new epoch after verification, and no other observer/run. [INFERENCE: a navigation action cannot be allowed to abort another session's work] **Unverified:** concurrent selection/run/abort tests remain open.

7. **High — platform documentation narrows the support matrix, but release readiness still depends on real devices and assistive technology.** **Confirmed:** current MDN browser-compat data records PushManager support for Firefox Android from 48, Chrome Android via its mirrored desktop record, no Android WebView support, and iOS Safari from 16.4 with Home Screen installation notes; the current Tailscale Android guide documents Play Store install, VPN configuration, and SSO onboarding. WCAG 2.2 requires keyboard operation, programmatic status semantics, and a Level-AA target-size rule of at least 24 by 24 CSS pixels subject to listed exceptions. [SOURCE: https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/PushManager.json] [SOURCE: https://tailscale.com/docs/install/android] [SOURCE: https://www.w3.org/TR/WCAG22/] **Inferred:** the initial declared matrix should be pinned iOS Safari Home Screen plus selected Chrome/Firefox Android releases, explicitly excluding Android WebView; capability checks remain necessary. [INFERENCE: compatibility data establishes an API baseline, not successful private-origin delivery or UX] **Unverified:** tailnet-origin iOS push, Android subscription/delivery, kill/background/reinstall, Focus/permission behavior, stale approval activation, VoiceOver, TalkBack, keyboard, zoom/reflow, and streaming live-region behavior have not been tested.

## Cross-Iteration Consistency Check

| Claim | Validation result | Disposition |
|---|---|---|
| Tool updates are “accumulated.” | RPC says each `partialResult` contains accumulated output. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:985-1015] | No contradiction: replace each update; never append it. |
| Serve identity was previously unverified. | Current Serve docs now document injected identity headers and spoof stripping. [SOURCE: https://tailscale.com/docs/features/tailscale-serve] | Revise auth bootstrap, but retain relay session and per-action authorization. |
| Approval gate rechecks a signed capability. | Standard `confirm` returns a boolean keyed by pending ID. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1312-1334] | Remove from MVP unless the protocol is extended; test canonical-input TOCTOU instead. |
| Snapshot barrier is available. | Pi exposes ordered stdout records and synchronous entry reads, not a native barrier. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:502-512] | Retain as a relay inference; integration-test before claiming lossless recovery. |
| Session selection can reuse one child. | `switch_session` rebinds the active child; prior runtime inspection established destructive replacement. [SOURCE: iterations/iteration-003.md] | Use isolated active-session children or exclusive idle switching only. |
| Completion push uses `agent_settled`. | Directly matches the installed contract. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-888] | Confirmed; keep `agent_end` non-terminal. |
| Relay-only exactly-once/public-default exposure. | No materially new evidence removes either prior limitation. [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-004.md] | Remain blocked/exhausted. |

## Implementation Seam Boundaries

| Seam | Owns | Must not own | Release invariant |
|---|---|---|---|
| Mobile PWA | Rendering, capability checks, opaque IDs, reconnect cursor, foreground approval intent | Pi paths, durable authority, child lifecycle, offline mutation queue | Closing/suspending the page never ends work; stale/offline UI cannot mutate. |
| Serve ingress | Tailnet reachability, TLS, verified injected user identity | Workspace/session/action authorization | Backend is loopback-only; spoofed headers are removed; WSS upgrade identity is proven on pinned version. |
| Relay domain | Principal session, catalog, authz, replay, mutation/approval ledgers, redaction, push decisions | Raw browser paths, trust in visual approval, exactly-once claims | Every mutation derives from committed identity/authz/epoch state; raw sensitive content is never retained. |
| RPC adapter | Strict-LF parser, serialized writer, response demux, child supervision, epoch binding | Product authorization or durable replay semantics | Malformed/interleaved output cannot cross-correlate sessions; stderr is never protocol input. |
| Approval gate | Canonical tool input, final pre-execution block/allow, negative default | User authentication, mutable post-approval arguments | Only the exact approved canonical call executes; any dependency mismatch denies. |
| OS/container boundary | Filesystem, process, network, credential, UID containment | Reliance on model or extension behavior | Agent compromise cannot escape the allowlisted workspace/credential boundary. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:31-37] |

## Ranked Residual Risks

| Rank | Severity | Residual risk | Smallest closure evidence |
|---:|---|---|---|
| 1 | **P0 / Critical** | Approval TOCTOU or later extension mutation can execute inputs different from the approved canonical call. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:753-765] | Pinned final-handler/wrapper test with mutated args, timeout, restart, two responders, revocation, and hash mismatch; all unsafe paths deny. |
| 2 | **P0 / Critical** | Relay crash/barrier behavior is inferred; duplicate, missing, or falsely acknowledged prompts remain possible if transactions are implemented incorrectly. [SOURCE: iterations/iteration-003.md] | Real Pi isolated fault harness across every stdin/response/DB kill point; recovered `dispatching` is always visibly `indeterminate`, never resent. |
| 3 | **P0 / Critical** | Ingress identity, direct-backend bypass, per-action authz, and OS containment are deployment controls rather than protocol properties. [SOURCE: https://tailscale.com/docs/features/tailscale-serve] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:31-37] | Pinned Serve WSS/header/spoof/revocation test plus sandbox escape/secret canaries and startup attestation. |
| 4 | **P1 / High** | Raw Pi data can leak if any replay/snapshot/catalog/cache/audit/push path bypasses redaction. [SOURCE: iterations/iteration-004.md] | Storage and transport canary scan proves zero forbidden raw values after success, crash, replay, logout, and notification delivery. |
| 5 | **P1 / High** | Private-origin Web Push, stale approval activation, and background/reinstall behavior vary by mobile platform. [SOURCE: https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/PushManager.json] | Recorded iOS and Android device matrix with duplicate/delay/deny/Focus/kill/reinstall/revocation cases. |
| 6 | **P1 / High** | Accessibility requirements are specified but not demonstrated under streaming and reconciliation. [SOURCE: https://www.w3.org/TR/WCAG22/] | Automated AA checks plus VoiceOver/TalkBack/keyboard/zoom evidence; deltas neither steal focus nor flood live regions. |
| 7 | **P2 / Medium** | Pi/Tailscale/browser behavior can drift from the inspected versions. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/package.json] [INFERENCE: all source-backed protocol assertions are version-sensitive] | Lock versions; rerun the full contract/device matrix on every upgrade. |

## Executable Acceptance Matrix

These are objective **required command contracts**, not tests claimed to exist or pass. Every row is currently `NOT RUN / UNVERIFIED`; release acceptance requires the named path to exist, the command to exit 0, and its machine-readable evidence to be retained.

| Gate | Area / severity | Required executable command | Objective pass condition | Current state |
|---|---|---|---|---|
| RPC-01 | Relay/RPC framing — P0 | `pnpm vitest run tests/acceptance/rpc-framing.spec.ts` | Strict LF/CRLF handling passes; U+2028/U+2029 stay inside JSON; responses/events interleave without mis-correlation; stderr never parses as protocol. | NOT RUN |
| RPC-02 | Lifecycle — P0 | `PI_BIN=pi pnpm vitest run tests/acceptance/rpc-lifecycle.integration.spec.ts` | Prompt acceptance, queued work, retry after `agent_end`, terminal `agent_settled`, tool accumulated-replace, and child exit all match the 0.84.1 fixture. | NOT RUN |
| REC-01 | Reconnect/replay — P0 | `pnpm vitest run tests/fault/replay-reconcile.spec.ts -- --seed=006` | Duplicate ignored; gap pauses; old/ahead/cross-epoch cursor snapshots; foreign entry cursor full-replaces; barrier excludes pre-barrier transients. | NOT RUN |
| IDEM-01 | Idempotency/crash — P0 | `PI_BIN=pi pnpm vitest run tests/fault/mutation-crash-window.integration.spec.ts` | Same key/digest writes once; changed digest conflicts; every recovered `dispatching` state is `indeterminate`; no automatic resend occurs. | NOT RUN |
| SES-01 | Session isolation — P0 | `PI_BIN=pi pnpm vitest run tests/fault/session-binding.integration.spec.ts` | Selecting session B cannot abort/observe session A; cancelled switch retains old epoch; successful exclusive switch verifies state before publishing new epoch. | NOT RUN |
| SEC-01 | Serve/auth/WSS — P0 | `TAILSCALE_VERSION="$PINNED" ./scripts/accept/serve-boundary.sh` | Tailnet WSS succeeds with verified identity; spoofed header is replaced; bad/missing Origin/ticket fails before allocation; direct backend and Funnel are unreachable; revocation closes sockets. | NOT RUN |
| SEC-02 | Sandbox/redaction — P0 | `./scripts/accept/security-canaries.sh --report artifacts/security-canaries.json` | Agent cannot escape root/UID/network policy; zero canary secrets occur in replay, snapshots, logs, cache, audit, or push; redactor/audit failure denies destructive work. | NOT RUN |
| APP-01 | Approval — P0 | `PI_BIN=pi pnpm vitest run tests/fault/approval-gate.integration.spec.ts` | Exact canonical args only; deny default; timeout/abort/restart/revocation/old epoch/late duplicate/two responders/post-gate mutation all execute zero protected tools. | NOT RUN |
| PUSH-01 | Push/dedup — P1 | `pnpm vitest run tests/acceptance/push-transitions.spec.ts` | Only committed settlement/pending-approval/indeterminate transitions notify; duplicate/delay is idempotent; payload is generic lookup metadata; click only triggers foreground reconcile. | NOT RUN |
| PWA-01 | Offline/service worker — P1 | `pnpm playwright test tests/acceptance/pwa-lifecycle.spec.ts` | Worker owns no persistent WSS; killed/background page loses no relay work; offline is timestamped/read-only; logout/account change purges cache/subscription binding. | NOT RUN |
| A11Y-01 | Accessibility — P1 | `pnpm playwright test tests/a11y/mobile-streaming.spec.ts && pnpm axe tests/a11y` | WCAG 2.2 AA automated set passes; keyboard/focus/status/24px targets/zoom/reflow pass; streaming announcements are coalesced. | NOT RUN |
| DEV-01 | Real devices — P0 | `node scripts/verify-device-evidence.mjs artifacts/device-matrix/*.json` | Signed recordings cover pinned iOS Safari Home Screen and Android Chrome/Firefox: install, tailnet auth, push subscribe/deliver, kill/Focus/deny/reinstall, reconnect, stale approval, logout/revocation; Android WebView is rejected. | NOT RUN |

## Recommended MVP — Confirmed with Revisions

Keep the tailnet-only, relay-owned architecture and behavioral PWA scope, subject to these revisions:

1. Pin Pi 0.84.1 (or rerun the RPC contract suite on upgrade), Tailscale, supported browsers, and the approval extension hash.
2. Use Serve's injected, anti-spoofed login header only as an attested authentication bootstrap; issue a short-lived relay application session and enforce exact Origin/connection ticket/per-message workspace-session-action authorization. A separate OIDC/passkey flow remains the fallback where trusted Serve identity cannot be proven.
3. Use one isolated Pi child per concurrently active session; permit shared-child `switch_session` only as an exclusive idle operation.
4. Keep at-most-once retry behavior with explicit `indeterminate`; do not claim relay-only exactly-once.
5. Replace the unsupported signed-`confirm` claim with a pinned final approval gate over frozen canonical arguments and an atomic relay decision ledger; side-effect tools remain disabled until APP-01 passes.
6. Redact before sequenced persistence and apply the same policy to snapshots, catalogs, offline cache, audit, and push.
7. Ship push only for a pinned, real-device-passed matrix; exclude Android WebView and keep all notifications generic/non-authoritative.
8. Treat accessibility and device evidence as MVP gates, not post-MVP polish.

[INFERENCE: these revisions preserve the validated topology while removing unsupported authority and platform claims]

## Ruled Out
- **A signed approval capability transported by standard `confirm`:** the response surface is boolean/cancel keyed by ID. [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1312-1334]
- **Serve identity as blanket app authority:** official grants distinguish application capabilities, and message authorization remains relay-owned. [SOURCE: https://tailscale.com/docs/features/access-control/grants] [SOURCE: https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/WebSocket_Security_Cheat_Sheet.md]
- **Redacting only after durable replay persistence:** raw data would already cross the retention boundary. [SOURCE: iterations/iteration-004.md]
- **Ordinary navigation via destructive shared-child switching:** it can disturb another run. [SOURCE: iterations/iteration-003.md]
- **Calling the MVP release-ready from documentation review:** crash scheduling, proxy behavior, devices, and assistive technology require execution evidence. [INFERENCE: none of the required integration/device gates has been run]

## Dead Ends
- Relay-only exactly-once prompt delivery remains blocked by the uncoordinated Pi stdin/relay transaction boundary. [SOURCE: iterations/iteration-003.md]
- Public Funnel/Internet WSS remains rejected as the default. [SOURCE: iterations/iteration-004.md]
- Broad “Android supported” claims remain invalid; only pinned browser/device rows can graduate. [SOURCE: https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/PushManager.json]

## Edge Cases
- Ambiguous input: “validate” was narrowed to evidence and acceptance-contract validation, not a claim that absent software or devices were tested.
- Contradictory evidence: iteration 4's signed-decision wording conflicts with the standard boolean `confirm` contract and is revised; current Serve identity documentation supplies evidence that was previously absent, without weakening per-action authorization.
- Missing dependencies: no implementation, isolated Pi fault fixture, deployed pinned Serve instance, iOS/Android devices, VoiceOver, or TalkBack evidence was available. Exact required gates are recorded rather than treated as passed.
- Partial success: the first retrieval of the legacy Serve URL returned HTTP 308; the canonical current Serve URL succeeded. A WebKit literal extraction missed one phrase, but the source was retrieved and no new unsupported claim depends on that miss. The architecture question is answered with explicit release blockers, so status is `complete`.

## Sources Consulted
- [SOURCE: deep-research-config.json]
- [SOURCE: deep-research-state.jsonl]
- [SOURCE: deep-research-strategy.md]
- [SOURCE: findings-registry.json]
- [SOURCE: deep-research-dashboard.md]
- [SOURCE: iterations/iteration-001.md]
- [SOURCE: iterations/iteration-002.md]
- [SOURCE: iterations/iteration-003.md]
- [SOURCE: iterations/iteration-004.md]
- [SOURCE: iterations/iteration-005.md]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/package.json]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:20-76]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:597-722]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:832-888]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:972-1015]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1144-1165]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md:1312-1334]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:43-77]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:263-319]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:473-516]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-mode.js:590-637]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:753-765]
- [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:27-37]
- [SOURCE: https://tailscale.com/docs/features/tailscale-serve]
- [SOURCE: https://tailscale.com/docs/features/access-control/grants]
- [SOURCE: https://tailscale.com/docs/install/android]
- [SOURCE: https://raw.githubusercontent.com/OWASP/CheatSheetSeries/master/cheatsheets/WebSocket_Security_Cheat_Sheet.md]
- [SOURCE: https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/PushManager.json]
- [SOURCE: https://webkit.org/blog/13966/webkit-features-in-safari-16-4/]
- [SOURCE: https://www.w3.org/TR/WCAG22/]

## Assessment
- New information ratio: 0.74 (2 fully new + 5 partially new findings over 7 = 0.64 raw, plus 0.10 simplicity bonus for resolving two authority ambiguities and producing one acceptance model)
- Questions addressed: Does the architecture from iterations 1-5 remain internally consistent and implementation-ready, and what objective gates must close its residual risks?
- Questions answered: The topology remains the recommended MVP with the identity, approval, session-isolation, and redaction revisions above; it is design-ready but not release-ready until the P0/P1 acceptance gates pass.

## Reflection
- What worked and why: Re-reading the complete lineage before inspecting the pinned Pi source exposed the exact boundary between confirmed RPC behavior and relay inference. Current Serve documentation closed the identity-header gap, while the approval wire format and mutable tool hook exposed one overclaimed control. Converting every residual risk into an exit-code gate prevents design confidence from masquerading as implementation evidence.
- What did not work and why: The legacy Serve URL again returned 308 until replaced by the canonical current URL. Documentation and compatibility data cannot reproduce crash timing, WSS proxy behavior, mobile OS lifecycle, or assistive-technology output.
- What I would do differently: Start implementation with the acceptance harness and a disposable isolated workspace, then build the relay/approval/PWA only behind failing P0 gates so every authority transition has observable evidence before feature polish.

## Recommended Next Focus
No seventh research iteration is recommended under the max-iterations policy. The reducer should synthesize iterations 1-6, then implementation should begin with APP-01, IDEM-01/REC-01, SEC-01/SEC-02, and DEV-01 evidence in that order; unresolved failures should feed a new explicitly authorized validation lineage rather than reopening exhausted retry or public-exposure variants.
