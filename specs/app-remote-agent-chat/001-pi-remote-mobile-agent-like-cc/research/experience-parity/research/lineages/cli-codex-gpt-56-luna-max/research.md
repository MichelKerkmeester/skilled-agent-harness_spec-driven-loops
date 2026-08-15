---
title: "Research Synthesis — Pi Remote Experience Parity"
description: "Best-in-class private mobile remote-control design anchored to the 041 Pi RPC relay architecture."
session_id: "fanout-cli-codex-gpt-56-luna-max-1786514481346-vicu2t"
loop_type: "research"
iterations: 20
stop_policy: "max-iterations"
---

# 1. Executive Summary

The best product is a private Pi Remote PWA: a mobile-native client that feels as immediate as Claude Code Remote Control, but exposes a richer, replayable, security-legible experience without moving Pi authority into the phone or a cloud account.

The decisive design is a relay-owned event ledger, not a chat mirror:

- Pi remains a local child started with pi --mode rpc and strict JSONL framing.
- A TypeScript loopback relay is the only browser-facing process. Tailscale Serve exposes that relay over HTTPS/WSS to the tailnet and never exposes Pi directly.
- The relay redacts before durable persistence, assigns immutable epoch and sequence identity, persists before broadcast, and serves replay/snapshot/gap synchronization.
- The PWA renders typed text, permitted reasoning summaries, plans, tool inputs/results, file diffs, usage, approvals, attention, and settlement as an ordered block graph.
- Phone approval is one tap after authenticated pull, but the command contains only opaque approval identity, expected epoch/revision, action digest, lease, decision, and idempotency key. Pi recomputes the exact action at the final execution boundary.
- Web Push is useful without leaking decisions: only the bounded class needs_input, finished, or error plus opaque references, generation, nonce, and route is sent. The PWA fetches the current redacted record after authentication.
- Session-wide accept-edits is a finite lease/CAS policy grant, not a wildcard. Every use still reaches the final digest boundary.
- Background work is possible only under a host-minted bounded run lease. Away submissions are visibly queued when the host authority is absent.
- Pairing is one QR scan plus a foreground host confirmation and device-key registration over the existing tailnet; it removes ticket copying without weakening tailnet-only ingress.
- One host can run multiple sessions through independent Pi children, epochs, queues, replay cursors, leases, and fair backpressure.

The product can demonstrably exceed shipping remote-control experiences on typed transcript richness, deterministic replay, exact-action approval, notification privacy, local data locality, and per-session isolation. It should not claim to exceed Claude or Cursor on unrestricted away autonomy while retaining foreground authority; that is a deliberate security trade-off.

# 2. Research Question and Decision Frame

The question was how to design the best-in-class private mobile experience for Pi coding agent sessions, using Claude Code plus Claude mobile as the interaction baseline while exceeding it on eight axes:

1. live transcript richness;
2. low-friction exact-action approval;
3. needs_input/finished/error attention with content-free push;
4. scoped accept-edits/session allow-list;
5. opaque browsable and renamable session list;
6. background sessions and starting work while away;
7. simpler pairing than Tailscale plus a ticket;
8. single-host multi-session concurrency.

The fixed architectural frame came from the 041 packet:

- pi --mode rpc JSONL;
- TypeScript loopback relay;
- immutable stream epochs;
- durable persist-before-broadcast replay;
- final-boundary approval extension;
- redaction and opaque identifiers;
- tailnet-only ingress and foreground authority.

The design therefore optimizes for remote legibility and safe control, not cloud-agent feature parity at any cost.

# 3. Method, Evidence, and Confidence

The loop ran all 20 iterations because stopPolicy was max-iterations and minIterations was 20. The final new-information ratios descended from 1.00 to 0.42; convergence was telemetry only and did not synthesize early. Each iteration produced a narrative, state record, and delta file. The iteration artifacts and reducer-owned registry/dashboard are in this lineage directory.

Evidence was triangulated across:

- local 041 specification and phase packets;
- Pi RPC documentation;
- Claude Remote Control and agent-view documentation;
- Cursor mobile/background-agent documentation;
- Tailscale Serve and identity documentation;
- MDN Web Push, PWA, and WebAuthn guidance;
- OWASP WebSocket security guidance;
- W3C WCAG 2.2 guidance;
- OpenTelemetry GenAI semantic conventions;
- Anthropic and OpenAI streaming references.

Documented product behavior is separated from inference. Public pages establish the interaction patterns; they do not establish undocumented internal schemas. Proposed Pi relay schemas below are design decisions, not claims about current Pi APIs.

The strongest confirmed local anchors are:

- 041 phase 003: per-session Pi child, strict JSONL, opaque catalog, immutable epochs, durable replay;
- 041 phase 005: PWA streaming reducers, reconnect, controls, and offline read-only behavior;
- 041 phase 006: final-boundary canonical action digest, one relay-authorized lease, default deny;
- 041 phase 007: encrypted push subscription lifecycle, generic hints, authenticated fetch-on-open.

# 4. Product Principles

1. The phone is a control surface, not the authority. It can request, review, and decide within a current lease; it cannot invent an action.
2. The relay is the privacy and durability boundary. Redaction, sequencing, persistence, replay, catalog, and push policy happen there.
3. Pi is the execution authority. Protected execution is accepted only after final-boundary recomputation and lease/CAS validation.
4. Every visible state has provenance. Plan, queue, tool, approval, attention, and lifecycle are distinct kinds.
5. Offline is a read mode. Cached data is useful, but stale controls do not become queued authority by implication.
6. Push is an attention hint. The authoritative record is fetched after authentication.
7. Convenience is bounded, not binary. A finite policy grant can remove repetitive taps without becoming unrestricted accept-edits.
8. Richness must survive interruption. If a UI state cannot be reconstructed from the durable ledger, it is not a reliable remote-control feature.
9. Opaque identity is a product feature. The session list is useful through user labels and coarse metadata, not path or prompt leakage.
10. Negative knowledge is part of the contract. No public Funnel, browser-to-Pi direct transport, terminal scraping, decision-bearing push, arbitrary background authority, or exactly-once crash claim.

# 5. Common Relay Event Contract

Every event uses one envelope. Payload schemas vary by kind, but identity, ordering, visibility, redaction, and replay semantics do not.

~~~json
{
  "v": 1,
  "eventId": "ev_opaque",
  "kind": "tool.call.started",
  "workspaceId": "ws_opaque",
  "sessionId": "ses_opaque",
  "epoch": 7,
  "seq": 1842,
  "occurredAt": "2026-08-12T16:30:00Z",
  "causedBy": {
    "rpcRequestId": "rpc_opaque",
    "parentSeq": 1841
  },
  "visibility": "private_session",
  "payload": {},
  "redaction": {
    "policyVersion": "r1",
    "removed": 0,
    "truncated": false
  },
  "replay": {
    "durable": true,
    "snapshotEligible": false
  }
}
~~~

The minimum event vocabulary is:

- turn.started and turn.settled;
- message.text.delta and message.text.final;
- thinking.summary.delta, thinking.summary.final, and thinking.summary.unavailable;
- plan.snapshot;
- tool.call.started, tool.input.delta, tool.output.delta, and tool.call.ended;
- file.diff;
- usage.snapshot;
- approval.requested and approval.result;
- policy.proposal, policy.grant, policy.use, and policy.revoked;
- attention.changed;
- session.summary, session.lifecycle, and device/security events;
- sync.delta, sync.snapshot, and sync.gap;
- error and capability snapshots.

Commands are separate from events. A command is an authenticated, idempotent request with current-state preconditions; it is never replayed as if it were an event.

The relay can coalesce presentation chunks, but canonical durable sequence identity cannot be dropped. The PWA reducer must tolerate unknown future event kinds and show an explicit replay gap rather than silently repair missing state.

# 6. Eight-Axis Design Matrix

The following sections answer each requested axis with a concrete event schema, PWA pattern, security-preserving mechanism, prior-art comparison, and a measurable superiority claim.

## 6.1 Live Transcript Richness

Concrete event schema:

~~~json
{
  "kind": "message.text.delta",
  "sessionId": "ses_opaque",
  "epoch": 12,
  "seq": 847,
  "turnId": "turn_opaque",
  "itemId": "item_opaque",
  "payload": {
    "contentIndex": 0,
    "delta": "const "
  },
  "source": {
    "rpcEvent": "message_update",
    "contentDelta": "text_delta"
  }
}
~~~

Related events are:

- thinking.summary.delta: only provider-permitted summary/progress, never fabricated private chain-of-thought;
- plan.snapshot: stable task IDs, monotonic revision, item state and evidence sequence;
- tool.call.started/input.delta/output.delta/ended: call identity, bounded streaming input/output, result class, redaction flags;
- file.diff: opaque file reference, allowed display label, old/new hashes, bounded hunks, truncation bit;
- usage.snapshot: integer tokens, costMicros, context, reported/estimated quality;
- turn.settled: the session-level fully settled boundary from Pi.

PWA pattern:

The Session surface is a vertical timeline of typed cards, not terminal scrollback. A live turn has a text surface, a compact working strip showing plan progress/current tool/elapsed time, a collapsible reasoning-summary block, tool cards, diff cards, and a usage chip. The plan rail is collapsed by default and evidence-linked when opened. Tool cards say partial, redacted, or truncated explicitly. A reconnect inserts a replay marker and reconciles the same block graph.

Security mechanism:

Normalize and redact before persist-before-broadcast. Strip environment values, credentials, authorization headers, disallowed absolute paths, binary payloads, and unbounded output. Store hashes and sizes where useful. The PWA receives a read projection; neither a diff nor displayed tool arguments are commands. The final action digest is owned by relay/Pi, not reconstructed from the UI.

Prior art:

Pi RPC already exposes message_update, tool execution lifecycle, agent_settled, and session statistics [SOURCE: https://pi.dev/docs/latest/rpc]. Anthropic publishes separate content-block, text, thinking, input-JSON, signature, and cumulative-usage events [SOURCE: https://platform.claude.com/docs/en/build-with-claude/streaming]. OpenAI publishes typed output/reasoning/usage stream fields [SOURCE: https://platform.openai.com/docs/api-reference/responses-streaming/response/code_interpreter_call_code/delta]. Claude Remote Control proves local cross-surface continuity [SOURCE: https://code.claude.com/docs/en/remote-control]. The proposed contract combines these patterns with 041 replay/redaction.

Demonstrably better:

Disconnect the client after every persisted event, reconnect from lastAckedSeq, and compare two devices. The ordered text/thinking/plan/tool/diff/usage graph, redaction flags, hashes, and settled state must match. A missing event produces a visible gap or snapshot request. A chat-only client cannot pass this test because it loses provenance and intermediate tool state.

## 6.2 Low-Friction Exact-Action Phone Approval

Concrete event and command:

~~~json
{
  "kind": "approval.requested",
  "sessionId": "ses_opaque",
  "epoch": 15,
  "seq": 1204,
  "payload": {
    "approvalId": "apr_opaque",
    "requestRevision": 2,
    "actionDigest": "sha256:opaque",
    "actionKind": "file_write",
    "riskClass": "protected",
    "display": {
      "title": "Review requested",
      "summary": "A protected action is waiting",
      "workspaceLabel": "project",
      "fileCount": 2,
      "diffRef": "diff_opaque"
    },
    "expiresAt": "2026-08-12T13:20:00Z",
    "leaseId": "lease_opaque"
  }
}
~~~

~~~json
{
  "command": "approval.decide",
  "mutationId": "mut_opaque",
  "approvalId": "apr_opaque",
  "expectedEpoch": 15,
  "expectedRequestRevision": 2,
  "actionDigest": "sha256:opaque",
  "leaseId": "lease_opaque",
  "decision": "allow_once"
}
~~~

PWA pattern:

A generic attention opens the fetched Review surface. The user sees redacted scope, risk, diff preview, expiry, and Allow once/Deny. One tap submits. The card then says decision submitted; verifying on host, and only an event-backed result changes it to executed or denied. A policy-grant affordance is separate and more explicit.

Security mechanism:

The relay resolves approvalId server-side, checks device/session capability, lease, epoch, revision, digest, and mutation idempotency, then forwards a server-side canonical reference. The Pi final-boundary extension recomputes the canonical action immediately before protected execution and defaults to deny on mismatch, expiry, crash ambiguity, or lost authority. Two devices race through CAS; only one can transition pending.

Prior art:

Claude documents remote continuation and mobile decisions [SOURCE: https://code.claude.com/docs/en/remote-control]. 041 phase 006 supplies the stronger exact digest and final-boundary contract [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md].

Demonstrably better:

Race two phones, reconnect one with a stale card, change the displayed diff, rotate the epoch, and submit duplicate mutation IDs. Exactly one current action may be approved; stale or altered presentations cannot retarget a later action. This proves low friction without optimistic execution or parameter substitution.

## 6.3 Actionable Attention Push Without Decision Leakage

Concrete durable event and push hint:

~~~json
{
  "kind": "attention.changed",
  "sessionId": "ses_opaque",
  "epoch": 8,
  "seq": 701,
  "payload": {
    "attentionId": "att_opaque",
    "class": "needs_input",
    "state": "open",
    "generation": 3,
    "resourceRef": "apr_opaque",
    "expiresAt": "2026-08-12T14:00:00Z"
  }
}
~~~

~~~json
{
  "v": 1,
  "kind": "attention",
  "attentionId": "att_opaque",
  "sessionRef": "ses_opaque",
  "class": "needs_input",
  "generation": 3,
  "hintNonce": "nonce_opaque",
  "route": "/s/ses_opaque/a/att_opaque"
}
~~~

Only needs_input, finished, and error are allowed. The lock-screen title/body is generic: Pi session needs your attention, Pi session finished, or Pi session encountered an error. No project name, session title, prompt, path, tool, arguments, diff, error text, decision, digest, or result enters push.

PWA pattern:

The service worker opens the PWA at an opaque route. The app authenticates through the tailnet and fetches the current attention record. It then renders the current redacted approval, finished result, or error summary. Duplicate pushes collapse by attentionId and generation. A stale nonce opens the session list with no-longer-current, never a later approval. The same attention inbox works when push is denied or unavailable.

Security mechanism:

Treat Web Push as unauthenticated, replayable, lossy wake-up. Bind pull to device capability, session authorization, nonce, and current epoch. Do not accept a push as state or command. The content-free contract resolves the lock-screen/provider trust problem without making push useless.

Prior art:

Claude pushes after long tasks or when it needs a decision, but its public Remote Control docs describe a broad on/off policy rather than a public per-event vocabulary [SOURCE: https://code.claude.com/docs/en/remote-control]. MDN confirms a service worker can receive push data and open a URL, while recommending useful, permissioned, opt-out notifications [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/PushEvent/data] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices]. 041 phase 007 establishes generic hints and fetch-on-open [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md].

Demonstrably better:

Run a push payload leak scanner and assert zero decision-bearing bytes. Replay, delay, duplicate, and reorder pushes; none may authorize or reveal a later state. The PWA must still reach the current approval through authenticated pull after a generic needs_input wake.

## 6.4 Scoped Accept-Edits and Session Allow-List

Concrete policy events:

~~~json
{
  "kind": "policy.proposal",
  "sessionId": "ses_opaque",
  "epoch": 16,
  "seq": 1300,
  "payload": {
    "policyId": "pol_opaque",
    "scope": {
      "operationClass": "file_write",
      "workspaceRef": "ws_opaque",
      "pathSetHash": "sha256:opaque"
    },
    "maxActions": 5,
    "expiresAt": "2026-08-12T15:00:00Z",
    "basePolicyVersion": 4
  }
}
~~~

~~~json
{
  "kind": "policy.grant",
  "sessionId": "ses_opaque",
  "epoch": 16,
  "seq": 1304,
  "payload": {
    "grantId": "gr_opaque",
    "policyId": "pol_opaque",
    "policyVersion": 5,
    "leaseId": "lease_opaque",
    "casVersion": 9,
    "remainingActions": 5,
    "expiresAt": "2026-08-12T15:00:00Z"
  }
}
~~~

PWA pattern:

The Review sheet says 5 file writes in project scope until 15:00. Allow similar actions is never hidden behind Allow once. A separate policy screen shows operation class, workspace label, path-set summary, remaining count, expiry, device, and revoke. The user never sees a misleading always allow control.

Security mechanism:

A grant is finite and bound to operation class, workspace capability, hashed path set/safe prefix, action count, expiry, rate limit, device/session, policy version, epoch, and lease. Every use still creates an exact action record. The final Pi boundary recomputes the action digest, checks scope, decrements the grant with CAS, and records use. Revoke increments policy version and invalidates stale grants; restart or lease loss denies. No wildcard shell, all-tools, arbitrary path, or client-submitted parameters.

Prior art:

Cursor documents that auto-running background commands create exfiltration risk [SOURCE: https://docs.cursor.com/background-agent]. 041 provides local final-boundary and lease primitives. The proposed design trades some convenience for finite, auditable scope.

Demonstrably better:

Grant five writes, revoke after two, change a path, rotate epoch, restart host, and race two phones. Every stale or out-of-scope use denies. Valid uses remove repetitive taps while preserving one final-boundary decision per action.

## 6.5 Opaque Browsable and Renamable Session List

Concrete catalog events:

~~~json
{
  "kind": "session.summary",
  "sessionId": "ses_opaque",
  "catalogRevision": 42,
  "payload": {
    "displayName": "Payments fix",
    "nameSource": "user",
    "state": "working",
    "attentionClass": null,
    "lastActivity": "2026-08-12T14:02:00Z",
    "unreadCount": 3,
    "plan": {"done": 2, "total": 5},
    "usage": {"costMicros": 450000},
    "workspaceLabel": "project"
  }
}
~~~

~~~json
{
  "command": "session.rename",
  "mutationId": "mut_opaque",
  "sessionId": "ses_opaque",
  "expectedCatalogRevision": 42,
  "displayName": "Payments fix"
}
~~~

PWA pattern:

Home is a searchable-by-user-label session list with working, needs input, finished, error, and archived filters. Rows show generic status, plan count, last activity, unread attention class, and usage. A user label is optional; the fallback is Untitled session plus an opaque visual fingerprint. Archive hides a row; it does not delete replay history.

Security mechanism:

The catalog is relay-owned and never derives a label from prompt, path, branch, hostname, tool output, or Pi session-file name. Labels are length-bounded and control-character normalized. Rename is idempotent CAS and replayable. Catalog responses pass an absolute-path, hostname, prompt-excerpt, and raw-session-file scanner.

Prior art:

Claude Remote Control shows named sessions, online indicators, QR setup, and a mobile list [SOURCE: https://code.claude.com/docs/en/remote-control]. Pi exposes sessionName in get_state [SOURCE: https://pi.dev/docs/latest/rpc]. 041 establishes opaque catalog ownership. The proposed version preserves naming ergonomics while making leakage and rename conflicts explicit.

Demonstrably better:

Rename on device A and stale-rename on device B; only the current revision wins and both devices converge. Scan every catalog response and persisted summary for sensitive metadata; zero matches is the acceptance gate.

## 6.6 Background Sessions and Starting New Work While Away

Concrete lifecycle and command:

~~~json
{
  "kind": "session.lifecycle",
  "sessionId": "ses_opaque",
  "epoch": 5,
  "seq": 200,
  "payload": {
    "state": "background_ready",
    "runLease": {
      "leaseId": "run_opaque",
      "hostAuthority": "host_opaque",
      "workspaceRef": "ws_opaque",
      "expiresAt": "2026-08-12T18:00:00Z",
      "maxDurationSec": 3600,
      "requiresHeartbeat": true
    }
  }
}
~~~

~~~json
{
  "command": "work.queue",
  "mutationId": "mut_opaque",
  "sessionId": "ses_opaque",
  "runLeaseId": "run_opaque",
  "promptRef": "prompt_opaque",
  "clientNonce": "nonce_opaque"
}
~~~

PWA pattern:

The list distinguishes working, background-running, queued, blocked-on-host, needs input, finished, and error. A Start while away action exists only when a valid host run lease is visible. Without it, the phone can save a bounded queued intent and says queued—not running. When the host heartbeat is lost, new work and approvals stop; the existing item becomes blocked-on-host or indeterminate, never silently authorized.

Security mechanism:

The host foreground process mints the run lease with workspace, duration, prompt-size, policy, device, and heartbeat constraints. The relay persists a queued intent but starts Pi only while the lease is current. Per-action approval/grant and final-boundary digest remain required. A phone never supplies an arbitrary path or shell command as a background authority.

Prior art:

Claude Remote Control keeps a local process running and documents mobile dispatch [SOURCE: https://code.claude.com/docs/en/remote-control]. Claude agent view backgrounds multiple local processes under a supervisor [SOURCE: https://code.claude.com/docs/en/agent-view]. Cursor launches always-on isolated cloud agents and exposes mobile remote control [SOURCE: https://cursor.com/mobile]. Pi can exceed them on authority transparency and local data locality, but intentionally does not match unrestricted cloud dispatch.

Demonstrably better:

Expire the host lease while a queued item waits, stop the heartbeat mid-turn, and attempt a new remote approval. The user sees the exact blocked state and no new protected action executes. This proves that “away” does not mean “authority moved to the phone.”

## 6.7 Pairing Simpler Than Tailscale Plus Ticket

Concrete pairing events:

~~~json
{
  "kind": "pairing.started",
  "pairingId": "pair_opaque",
  "tailnetOrigin": "https://pi-host.tailnet.ts.net",
  "challenge": "one_time_opaque",
  "expiresAt": "2026-08-12T15:30:00Z",
  "hostApprovalRequired": true
}
~~~

~~~json
{
  "command": "pairing.confirm",
  "pairingId": "pair_opaque",
  "challenge": "one_time_opaque",
  "deviceKey": "ed25519_public_opaque",
  "webauthnCredentialId": "credential_opaque"
}
~~~

PWA pattern:

The host command displays a QR. The phone scans, reaches the tailnet Serve origin, and the host confirms the friendly device label and capability. There is no ticket copy/paste or static bearer secret. A passkey may be registered for approval step-up. Reinstall or device replacement uses an explicit new pairing/recovery ceremony.

Security mechanism:

The QR contains only tailnet origin, pairing ID, and single-use challenge. The relay checks Tailscale identity, consumes the challenge once, stores only the public device key, and grants scoped capabilities. Device revoke removes that key and invalidates leases. If the phone is off-tailnet, onboarding explains the prerequisite and never opens a public fallback.

Prior art:

Claude uses session URL/QR for quick mobile access [SOURCE: https://code.claude.com/docs/en/remote-control]. Tailscale Serve is private to the tailnet, supports HTTPS and identity headers, and recommends a localhost-only backend so forwarded identity headers cannot be spoofed [SOURCE: https://tailscale.com/docs/features/tailscale-serve]. WebAuthn is public-key based in secure contexts [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API].

Demonstrably better:

One scan plus one host confirmation completes pairing with no reusable ticket. Expired QR, screenshot replay, off-tailnet access, and revoked-device access all fail closed.

## 6.8 Single-Host Multi-Session Concurrency

Concrete multiplexing events:

~~~json
{
  "kind": "host.capacity",
  "hostId": "host_opaque",
  "epoch": 2,
  "seq": 80,
  "payload": {
    "maxSessions": 8,
    "activeSessions": 5,
    "maxBufferedEventsPerSession": 2000,
    "maxClientsPerSession": 3,
    "policyVersion": "r1"
  }
}
~~~

~~~json
{
  "kind": "session.stream.window",
  "sessionId": "ses_opaque",
  "epoch": 7,
  "seq": 410,
  "payload": {
    "windowEvents": 256,
    "lastAckedSeq": 388,
    "dropped": 0
  }
}
~~~

PWA pattern:

Home subscribes to compact summaries. Session opens one rich stream at a time; other sessions continue as durable rows and attention inbox entries. A noisy session shows throttled status without freezing other rows. Capacity refusal is queued with a reason, not silent loss.

Security mechanism:

Every active session has an independent Pi child, stdin/stdout framing, command IDs, event queue, epoch, replay cursor, approval lease, and capability. Every command names session and expected epoch. A lease, diff, path label, or device capability from session A is invalid for B. Fair scheduling and bounded per-session windows prevent head-of-line blocking.

Prior art:

Claude agent view explicitly manages many background sessions, each with waiting/working/done state, and its supervisor gives each process independent lifecycle [SOURCE: https://code.claude.com/docs/en/agent-view]. Cursor documents large-scale isolated cloud agents [SOURCE: https://docs.cursor.com/background-agent/api/overview]. The Pi design makes local fairness and per-session authority visible.

Demonstrably better:

Flood one child with output while another needs approval, a third settles, and a fourth reconnects after crash. Other sessions stay responsive within the measured bound, no event crosses a session ID, and the restarted child receives a new epoch.

# 7. PWA Information Architecture and Interaction Vocabulary

Home, Session, and Review are sufficient if the protocol makes authority state explicit.

Home:

- opaque session rows;
- filters by working, needs input, finished, error, archived;
- attention inbox;
- pair/device status;
- generic tailnet/relay trust strip.

Session:

- plan rail;
- typed transcript;
- tool and diff cards;
- usage chip;
- current epoch/replay/connection state;
- queued/background state;
- input control only when current authority permits it.

Review:

- fetched approval or policy proposal;
- redacted action summary;
- scope, risk, diff reference, expiry, lease state;
- Allow once/Deny or bounded policy decision;
- submitted/verifying/current-result state.

Use a single coarse aria-live region for completed blocks rather than announcing every token delta. Keep visible focus, large targets, keyboard paths, reduced motion, focus restoration, virtualized long lists, and explicit offline/read-only banners. WCAG 2.2 target-size and focus guidance are relevant [SOURCE: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/]. Cursor's PWA documentation validates a native-feeling web/mobile surface [SOURCE: https://docs.cursor.com/en/background-agent/web-and-mobile].

# 8. End-to-End State Machine

1. Host starts Pi RPC child and loopback relay.
2. Serve exposes only the relay through private tailnet HTTPS/WSS.
3. Host emits pairing.started; phone registers device; relay emits device.registered.
4. Relay creates opaque catalog row and session epoch.
5. Prompt or bounded work.queue is persisted before forwarding to Pi.
6. Pi events normalize into the common ledger; PWA renders live cards and usage.
7. Protected tool emits approval.requested and attention.changed(needs_input).
8. Push contains only generic class/opaque route; PWA fetches current approval.
9. Phone sends approval.decide; relay validates capability/lease/CAS/digest.
10. Pi recomputes exact action at final boundary, executes or denies, and emits result.
11. Pi settles; usage and session summary update; optional finished attention push fires.
12. Any client reconnects with sync.hello and receives contiguous delta, snapshot-plus-tail, or explicit gap.
13. Host restart rotates epoch. Stale commands, pushes, grants, and approval cards become no-longer-current.
14. Host lease loss blocks new away work and approvals; existing ambiguity is visible.

Shared invariants:

- persist before broadcast;
- redact before persistence;
- opaque IDs throughout;
- events are read state, commands are requests;
- action digest/lease/CAS at final boundary;
- generic push plus authenticated pull;
- host-minted bounded background lease;
- per-session isolation and fair backpressure.

# 9. Security and Threat Model

The main threats are malicious tailnet peers, cross-site WebSocket hijacking, XSS, compromised/lost phones, push provider/lock-screen exposure, stale replay, prompt injection through tool output, and stream/resource exhaustion.

Controls:

- Tailscale ACLs and Serve identity; relay listens on loopback;
- HTTPS/WSS and explicit Origin allowlist;
- device public-key capability and per-message/session authorization;
- optional WebAuthn step-up;
- field-level redaction before durable store;
- no decision-bearing push;
- epoch, sequence, nonce, idempotency, and CAS checks;
- message/output/diff limits, fair queues, backpressure, heartbeats;
- redacted security.audit events;
- final Pi digest recomputation and default deny.

OWASP specifically recommends WSS, explicit Origin checks, message-level authorization, JSON-schema validation, size/rate limits, replay nonces, heartbeats, backpressure, and avoiding sensitive message logging [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html]. Tailscale warns that identity headers should be trusted only through a localhost backend [SOURCE: https://tailscale.com/docs/features/tailscale-serve].

# 10. Implementation Handoff

Implement in this order:

1. Common versioned envelope, redaction policy, opaque IDs, sequence/epoch, and JSON schema allow-list.
2. Pi RPC child manager with strict LF framing, response correlation, event normalization, and settle handling.
3. Durable event store with persist-before-broadcast, replay cursor, snapshots, retention, and crash indeterminate state.
4. Relay-owned opaque catalog, user labels, rename CAS, session summaries, and capability snapshot.
5. PWA Home/Session/Review reducers and offline read-only state.
6. Approval.requested/decide/result and final Pi extension digest/lease/CAS.
7. Policy proposal/grant/use/revoke and host-minted run lease.
8. Attention event, encrypted subscription storage, generic push, authenticated pull, deep-link dedupe.
9. Pairing QR challenge, device key, optional WebAuthn, revoke/recovery.
10. Fair multi-session scheduler, per-session windows, backpressure, and capacity state.
11. Adversarial security, replay, accessibility, performance, and mobile battery tests.

# 11. Recommendations

Ship the smallest complete experience in three milestones:

Milestone A — Trustworthy window:
common event envelope, rich read-only transcript, plan/tool/diff/usage cards, catalog, pairing, replay, and generic attention inbox.

Milestone B — Safe control:
exact-action approval, final-boundary extension, submitted/verifying UX, device revoke, and content-free push/pull.

Milestone C — Bounded scale:
finite policy grants, host run lease, queued away work, multi-session fair scheduler, backpressure, retention, and performance proof.

Use explicit product language:

- “Allow once” means one current action, not a parameter editor.
- “Session policy” means finite scope/count/time, not unrestricted accept-edits.
- “Queued” means not running.
- “Push” means attention only.
- “Offline” means read-only.
- “Reasoning summary” means permitted summary, not private chain-of-thought.
- “Executed” means Pi final-boundary confirmation, not a phone animation.

# 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Chat-only transcript projection | Loses tool, plan, diff, usage, provenance, and deterministic replay | Pi RPC; 041 relay | 1–2 |
| Cloud account/session as authority | Breaks local authority and data-locality posture | 041 scope; Claude local-vs-web distinction | 1 |
| Client-edited diff or parameters | Display content is redacted/untrusted and cannot be exact action | 041 approval contract | 2, 4, 6 |
| Synthetic private chain-of-thought | Relay must not fabricate hidden model reasoning | Anthropic thinking display semantics | 2, 20 |
| Client-editable plan checkbox as execution | UI state is informational | 041 final boundary | 3 |
| Redact after persistence | Replay/crash store would already contain secrets | 041 replay/redaction | 4 |
| Missing usage rendered as zero | False accounting and hidden compaction uncertainty | Pi stats | 5 |
| Optimistic execution success | Phone cannot prove Pi execution | 041 approval boundary | 6 |
| Decision-bearing push | Provider/lock-screen is outside relay trust | 041 push contract; MDN | 7 |
| Wildcard/all-tools accept-edits | Unbounded exfiltration and authority bypass | Cursor background-agent security; 041 | 8 |
| Prompt/path-derived session name | Metadata leakage | 041 opaque catalog | 9 |
| Permanent arbitrary phone-launched work | Transfers foreground authority | 041 scope | 10 |
| Public fallback or reusable QR ticket | Weakens tailnet-only and creates bearer secret | Tailscale Serve/identity | 11 |
| Global shared queue/capability | Head-of-line blocking and cross-session risk | 041 per-session model | 12 |
| Offline queued approval without revalidation | Lease/epoch/action may change | 041 approval/replay | 13 |
| Raw terminal as primary mobile UI | Hard to scan and express authority/redaction state | 041 PWA goals; WCAG | 14 |
| Screenshots as superiority proof | Cannot establish protocol/security behavior | prior-art docs | 15 |
| Origin-only authorization | Origin can be spoofed outside browsers; per-message auth still needed | OWASP | 16 |
| Drop durable events under pressure | Breaks replay and hides boundaries | 041 replay | 17 |
| Replay commands as events | Could retarget later epoch/action | 041 relay/approval | 18 |
| Happy-path demo only | Ignores interruption, stale authority, redaction, and concurrency | verification matrix | 19 |
| Relax security for cloud-like convenience | No longer the requested product | 041 invariants | 20 |

# 13. Open Questions and Bounded Risks

1. Which Pi extension hooks produce authoritative plan snapshots, diff derivation, and final approval records? Confirm against the implementation before coding.
2. What exact replay retention and encrypted-at-rest policy fits a local host without persisting raw paths or secrets?
3. Which browser/OS combinations support Web Push and installed PWA behavior reliably? Keep attention inbox/reconnect fallback.
4. What device/tailnet conditions meet the proposed first-text, approval-fetch, reconnect, memory, and battery targets? These are hypotheses until measured.
5. Which thinking summaries are provider-permitted and useful enough to expose? Default to unavailable rather than infer.
6. What host lease UI makes foreground authority legible without making the user think the phone can create permanent authority?
7. What catalog retention and archive semantics preserve user labels while satisfying local privacy expectations?
8. What concurrency defaults are safe for a target host, and how should capacity be configured?

These are implementation decisions, not reasons to weaken the core contract.

# 14. Verification Plan

The authoritative acceptance suite should include:

- schema parse and unknown-event tolerance;
- Pi RPC framing/response/event correlation;
- event persist-before-broadcast ordering;
- replay after disconnect at every sequence boundary;
- epoch rotation and explicit gap/snapshot behavior;
- redaction corpus for tokens, credentials, paths, controls, binary, and output limits;
- two-device approval CAS and duplicate mutation idempotency;
- final digest mismatch/expiry/crash default-deny;
- policy grant scope/count/expiry/revoke/restart tests;
- push payload leak scan, stale nonce, duplicate, reorder, and authenticated pull;
- catalog metadata leak scanner and rename CAS;
- host lease heartbeat loss and queued/not-running state;
- QR expiry/screenshot/revoke/off-tailnet pairing;
- N-session flood/fairness/cross-session isolation;
- Origin/CSWSH, malformed JSON, oversized message, rate-limit, and idle cleanup;
- WCAG target/focus/live-region/reduced-motion tests;
- cold start, first text, approval fetch, reconnect, memory, battery, and multi-session latency measurements.

A completion claim should report measured baselines and deltas. The research does not claim these runtime results; it defines the proof plan.

# 15. Prior-Art and Source Notes

Confirmed public prior art:

- Pi RPC: strict LF JSONL, command responses, message/tool lifecycle, settle, session stats [SOURCE: https://pi.dev/docs/latest/rpc].
- Claude Remote Control: local process, QR, mobile/browser continuation, session list, reconnect, generic push [SOURCE: https://code.claude.com/docs/en/remote-control].
- Claude agent view: multi-session background processes, status/peek/reply, supervisor [SOURCE: https://code.claude.com/docs/en/agent-view].
- Cursor mobile: remote control, cloud/local modes, Live Activities, push, focused diffs and mobile lifecycle [SOURCE: https://cursor.com/mobile] [SOURCE: https://cursor.com/changelog/ios-mobile-app].
- Tailscale Serve: private tailnet routing, HTTPS, identity headers, localhost backend requirement [SOURCE: https://tailscale.com/docs/features/tailscale-serve].
- Web Push/PWA/WebAuthn: service-worker push data/click, notification ethics, offline/background limits, public-key authentication [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/PushEvent/data] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API].
- OWASP WebSocket security: WSS, Origin, authorization, limits, replay, backpressure, monitoring [SOURCE: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html].
- WCAG 2.2 target/focus guidance [SOURCE: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/].
- OpenTelemetry GenAI usage vocabulary [SOURCE: https://opentelemetry.io/docs/specs/semconv/registry/gen-ai/].
- Anthropic/OpenAI stream vocabularies [SOURCE: https://platform.claude.com/docs/en/build-with-claude/streaming] [SOURCE: https://platform.openai.com/docs/api-reference/responses-streaming/response/code_interpreter_call_code/delta].

Local architectural authority:

- 041 root: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/spec.md
- 041 relay: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md
- 041 PWA: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation/spec.md
- 041 approval: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md
- 041 push: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md
- Lineage resource index: research/resource-map.md

# 16. Convergence and Completion Record

All 20 iterations completed under stopPolicy max-iterations. Convergence signals were retained as telemetry; the observed final newInfoRatio was 0.42, above the configured 0.02 threshold, but no early synthesis was allowed. The final design review found no reason to reopen exhausted directions.

The lineage produced:

- 20 iteration narratives;
- 20 per-iteration delta logs;
- 20 route-proofed canonical state records;
- append-only deep-research-state.jsonl;
- reducer-owned findings registry and dashboard;
- strategy state;
- resource map;
- this final research synthesis.

The final design is research-complete, not implementation-verified. The implementation handoff and verification plan above are required before claiming the remote client works in production.

# 17. Final Recommendation

Proceed with the private Pi Remote PWA as a typed, replayable, redacted, lease-aware relay product. Make the user experience feel faster than a terminal by giving the phone a clear session list, rich block timeline, plan rail, focused diff review, one-tap exact approvals, generic attention inbox, and safe background/away states.

The winning distinction is not “more remote autonomy.” It is “more useful truth per byte and more authority clarity per tap”:

- richer than a chat window;
- safer than a broad accept-edits toggle;
- more private than decision-bearing push;
- more honest than optimistic offline control;
- more inspectable than opaque session status;
- more resilient than a live-only stream;
- simpler to pair without removing the tailnet;
- fairer across sessions without centralizing authority.

That is the best-in-class design compatible with 041.
