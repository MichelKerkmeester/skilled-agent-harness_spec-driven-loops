# Pi Remote Experience Parity — Consolidated Research (SOL-high synthesis of 2 lineages × 20 iterations)

## 1. Executive summary

The best-in-class Pi remote experience is not a mobile terminal or chat mirror. It is a private, typed control plane built around a relay-owned, redacted, replayable event ledger:

- Pi remains a local `pi --mode rpc` child.
- A loopback-only relay supervises Pi, persists redacted events before broadcast, and exposes only HTTPS/WSS through Tailscale Serve.
- The PWA renders text, permitted reasoning summaries, plans, tools, diffs, results, usage, approvals, attention, and lifecycle as typed state.
- The phone requests decisions but never invents or rewrites executable parameters.
- Every protected action is rebound to its canonical digest at Pi’s final execution boundary.
- Push carries only a bounded attention class and opaque pointer; authoritative content is fetched after authentication.
- “Accept edits” becomes a finite policy-backed lease whose every use still passes exact-action validation.
- Away work is allowed only inside a host-minted run lease; anything beyond the lease parks visibly.
- Pairing collapses to one QR ceremony without public ingress or a reusable application ticket.
- Multiple sessions remain independent Pi children with separate epochs, queues, capabilities, leases, and replay cursors.

This can exceed Claude Code Remote Control on transcript richness, deterministic replay, approval integrity, notification privacy, user-legible authority, session isolation, and local data control. It should not claim unrestricted cloud-agent autonomy: retaining foreground authority necessarily means that expired or absent host authorization queues or parks work instead of silently transferring authority to the phone. [codex-luna §§1–5][codex-luna] [pi-deepseek §§1–3][pi-deepseek]

### Common relay envelope

All eight experience axes should ride one versioned envelope:

```json
{
  "v": 1,
  "eventId": "ev_opaque",
  "kind": "tool.call.started",
  "hostId": "host_opaque",
  "workspaceRef": "ws_opaque",
  "sessionId": "ses_opaque",
  "epoch": 7,
  "seq": 1842,
  "occurredAt": "2026-08-12T16:30:00Z",
  "causedBy": {
    "rpcRequestId": "rpc_opaque",
    "parentSeq": 1841
  },
  "payload": {},
  "redaction": {
    "policyVersion": "redact-1",
    "class": "session_private",
    "removedFields": [],
    "truncated": false
  },
  "replay": {
    "durable": true,
    "snapshotEligible": false
  }
}
```

Commands are a separate authenticated protocol. They include an idempotency key and current-state preconditions and are never replayed as events. Unknown future event kinds must be ignored safely; missing sequence ranges must produce an explicit gap or snapshot request rather than silent repair. [codex-luna §5][codex-luna] [pi-deepseek §§4,12][pi-deepseek]

---

## 2. Eight experience axes

## 2.1 Live transcript richness

### Merged recommendation

Render a typed block graph rather than terminal scrollback:

- streaming assistant text;
- provider-permitted reasoning summaries, including an explicit unavailable state;
- revisioned TODO/plan snapshots with stable item IDs;
- tool identity, bounded inputs, progress, outputs, status, and duration;
- file edits with base/new hashes and bounded hunks;
- turn and session token/cost data with provenance;
- compaction, retry, queue, replay, and settlement markers.

Canonical events should preserve Pi RPC distinctions instead of flattening `message_update`, tool lifecycle, queue, retry, compaction, and `agent_settled` into assistant prose. Reconnect reconstructs the same block graph from snapshot plus ordered tail. [codex-luna §§6.1, 7–8][codex-luna] [pi-deepseek §§3–4][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS.** The reference establishes cross-surface transcript continuity, but Pi can expose a documented typed vocabulary, replay provenance, redaction state, plan/tool/diff structure, and usage accounting that remain deterministic after interruption. [codex-luna §§6.1, 15][codex-luna] [pi-deepseek §§3–4, 16][pi-deepseek]

### Concrete relay schema and PWA pattern

```json
{
  "kind": "message.text.delta",
  "sessionId": "ses_opaque",
  "epoch": 12,
  "seq": 847,
  "payload": {
    "turnId": "turn_opaque",
    "itemId": "msg_opaque",
    "contentIndex": 0,
    "delta": "const "
  }
}
```

```json
{
  "kind": "plan.snapshot",
  "sessionId": "ses_opaque",
  "epoch": 12,
  "seq": 852,
  "payload": {
    "planId": "plan_opaque",
    "revision": 6,
    "items": [
      {
        "itemId": "todo_opaque",
        "label": "Update relay reducer",
        "state": "in_progress",
        "evidenceSeq": 851
      }
    ]
  }
}
```

```json
{
  "kind": "file.diff",
  "sessionId": "ses_opaque",
  "epoch": 12,
  "seq": 861,
  "payload": {
    "toolCallId": "tool_opaque",
    "fileRef": "file_opaque",
    "displayPath": "project/src/relay.ts",
    "baseHash": "sha256:opaque",
    "newHash": "sha256:opaque",
    "version": 4,
    "hunks": [
      {
        "oldStart": 18,
        "oldLines": 2,
        "newStart": 18,
        "newLines": 4,
        "lines": [" context", "-old", "+new"]
      }
    ],
    "truncated": false
  }
}
```

```json
{
  "kind": "usage.snapshot",
  "sessionId": "ses_opaque",
  "epoch": 12,
  "seq": 868,
  "payload": {
    "turnId": "turn_opaque",
    "inputTokens": 18420,
    "outputTokens": 2130,
    "cacheReadTokens": 9000,
    "costMicros": 420000,
    "quality": "reported"
  }
}
```

The PWA session screen should contain:

1. a live response block;
2. a compact working strip with current plan item, current tool, and elapsed time;
3. collapsible reasoning-summary blocks;
4. tool cards with partial/redacted/truncated labels;
5. focused diff cards;
6. a usage chip and budget drawer;
7. reconnect, gap, compaction, retry, and settled markers.

Search and bookmarks should be anchored to `{sessionId, epoch, seq}` and operate over the device’s redacted projection rather than a server-side transcript index. LSP-style incremental ranges are useful for live diff updates, but the durable record should retain hashes and reconnectable snapshots rather than depend on fuzzy patch application. The search/bookmark and LSP-range proposals were surfaced only by pi-deepseek and remain secondary enhancements. [pi-deepseek §§4, 12][pi-deepseek]

### Security-preserving mechanism

Redact before both persistence and broadcast:

- strip credentials, environment values, authorization headers, disallowed absolute paths, binary content, and control characters;
- cap argument, result, and diff sizes;
- expose hashes and sizes when content is withheld;
- mark usage as `reported`, `estimated`, or `unavailable`, never silently zero;
- expose only provider-permitted reasoning summaries, never synthesized private chain-of-thought;
- treat every displayed tool input and diff as read-only projection, not executable input.

### Prior art

Pi RPC already provides message deltas, thinking/tool-call deltas, tool execution lifecycle, queue state, retry/compaction state, statistics, and settlement. Anthropic and OpenAI streaming APIs establish typed content-block and usage vocabularies. Claude Remote Control establishes local multi-surface continuity. Cursor establishes focused mobile diff review. [codex-luna §§3, 6.1, 15][codex-luna] [pi-deepseek §§3–4, 17][pi-deepseek]

### What makes it better than anything shipping

A client disconnected after any persisted sequence can reconstruct the same ordered text/reasoning/plan/tool/diff/usage graph on another device. Redaction and truncation remain visible, missing events produce explicit gaps, and settlement comes from Pi rather than a UI animation. The superiority claim is testable protocol behavior, not visual polish.

---

## 2.2 Low-friction phone approval with exact-action binding

### Merged recommendation

Use a fetched Review sheet with tiered—but never bypassing—friction:

- an action already covered by a valid policy grant requires no new prompt but still receives a one-action lease and final-boundary digest check;
- ordinary in-workspace protected edits use one-tap Allow once or Deny after the card is fetched;
- shell, network, credential-adjacent, or destructive actions require expanded exact details and optional biometric or number-matching step-up;
- every card has an expiry countdown;
- submission changes the card to “Decision submitted; verifying on host”;
- only a relay/Pi result event changes it to executed, denied, expired, invalidated, or indeterminate.

Digest visibility is useful as an integrity indicator, but the digest itself is not a substitute for a human-readable redacted action summary. Tiered friction, digest chips, and glance submissions were emphasized only by pi-deepseek; the exact-action command contract and submitted/verifying state were independently specified by codex-luna. [codex-luna §6.2][codex-luna] [pi-deepseek §5][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS.** The experience can remain one tap for a current ordinary action while preventing stale-card execution, parameter substitution, optimistic success, and permanently frozen approvals.

### Concrete relay schema and command

```json
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
      "summary": "Two files will be edited",
      "workspaceLabel": "project",
      "fileCount": 2,
      "diffRef": "diff_opaque"
    },
    "leaseId": "lease_opaque",
    "expiresAt": "2026-08-12T13:20:00Z"
  }
}
```

```json
{
  "command": "approval.decide",
  "mutationId": "mut_opaque",
  "approvalId": "apr_opaque",
  "expectedEpoch": 15,
  "expectedRequestRevision": 2,
  "actionDigest": "sha256:opaque",
  "leaseId": "lease_opaque",
  "decision": "allow_once",
  "stepUpProof": "optional_opaque"
}
```

```json
{
  "kind": "approval.result",
  "sessionId": "ses_opaque",
  "epoch": 15,
  "seq": 1209,
  "payload": {
    "approvalId": "apr_opaque",
    "requestRevision": 2,
    "outcome": "executed",
    "decidedBy": "device",
    "decisionMutationId": "mut_opaque",
    "settledAt": "2026-08-12T13:18:04Z"
  }
}
```

### Security-preserving mechanism

The relay resolves `approvalId` server-side and validates:

- device and session capability;
- epoch and request revision;
- current lease;
- canonical action digest;
- expiry;
- mutation idempotency;
- exactly-one CAS transition from `pending`.

Pi then recomputes the canonical action immediately before execution. Digest mismatch, changed arguments, expiry, restart, lease loss, or crash ambiguity defaults to deny or explicit indeterminate state. Two devices may race; only one current CAS settlement succeeds.

### Prior art

Claude Remote Control establishes mobile permission decisions. OWASP transaction-authorization guidance supports binding authorization to the exact transaction. The Pi architecture adds a local final-boundary extension, canonical digest, lease, CAS, and replay-aware result. [codex-luna §§6.2, 9][codex-luna] [pi-deepseek §§5, 12][pi-deepseek]

### What makes it better than anything shipping

Race two phones, alter the action after display, replay a stale card, rotate the session epoch, expire the lease, and duplicate the mutation ID. Exactly one unchanged current action may execute. Every other path terminates visibly rather than hanging or retargeting a later action.

---

## 2.3 Actionable notification-as-pull without decision leakage

### Merged recommendation

Define exactly three push-worthy attention classes:

```text
needs_input | finished | error
```

A notification is “actionable” because tapping it opens the precise current attention resource after authenticated pull—not because the lock screen contains decision content or approval controls.

The durable event carries authoritative state. The push carries only an opaque wake-up pointer, bounded class, generation, and nonce. The service worker displays generic copy and opens an opaque route. After the PWA authenticates through the tailnet and application layer, it fetches the current redacted approval, completion, or error record.

This resolves the content-free-push contradiction: routing is not decision content, and push never becomes either state or authority. [codex-luna §6.3][codex-luna] [pi-deepseek §6][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS.** Pi gains per-class attention, deterministic deduplication, stale-hint handling, an in-app attention inbox, and a leak-testable payload contract while retaining generic lock-screen content.

### Concrete durable event and push payload

```json
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
```

```json
{
  "v": 1,
  "kind": "attention",
  "attentionId": "att_opaque",
  "sessionRef": "ses_opaque",
  "class": "needs_input",
  "generation": 3,
  "hintNonce": "nonce_opaque",
  "route": "/attention/att_opaque"
}
```

Forbidden push fields include:

```text
projectName, sessionTitle, prompt, path, toolName, arguments,
diff, command, decision, actionDigest, result, errorText
```

PWA/service-worker behavior:

1. deduplicate by `{attentionId, generation}`;
2. display generic class-aware copy such as “Pi needs your attention”;
3. set notification tag to an opaque session/class key;
4. on tap, open `/attention/<opaque-id>`;
5. authenticate and fetch the authoritative record;
6. if stale or resolved, show “No longer current” and the session list;
7. never let an old nonce resolve to a newer approval.

An encrypted local cache may accelerate the post-open transition, but it must not be relied on for lock-screen content or correctness. Pi-deepseek alone proposed rich locally cached notification copy and a UnifiedPush/ntfy Android path; browser lifecycle and lock-state limitations make those optional experiments, not the baseline. [pi-deepseek §§6, 12, 14][pi-deepseek]

### Security-preserving mechanism

Treat Web Push as lossy, replayable, provider-visible attention transport:

- no decision-bearing bytes;
- no approval action in the notification;
- current device/session capability required on pull;
- nonce, generation, and epoch validation;
- generic rendering while locked;
- push denial or platform failure falls back to the in-app attention inbox and normal reconnect;
- subscription data is encrypted at rest and revocable.

### Prior art

Claude Remote Control demonstrates notification-on-finish and notification-on-decision patterns. MDN and platform documentation establish service-worker push/click behavior and mobile lifecycle limits. Web Push tagging supplies coalescing semantics. [codex-luna §§6.3, 15][codex-luna] [pi-deepseek §§3, 6, 12][pi-deepseek]

### What makes it better than anything shipping

A payload scanner can prove zero transcript, path, tool, argument, diff, decision, or error content. Replayed, duplicated, delayed, and reordered notifications cannot reveal or authorize later state. Yet one tap still reaches the exact current review through authenticated pull.

---

## 2.4 Scoped accept-edits and session allow-list

### Merged recommendation

Replace broad “accept edits” with explicit, finite policy grants. A matching policy does not bypass approval infrastructure; it acts as an auditable decider that mints a one-action lease through the same CAS ledger used by human decisions.

A grant must be bounded by:

- session and device capability;
- operation class;
- workspace;
- exact path set or safe prefix after symlink resolution;
- for shell, exact canonical argument pattern—never a wildcard command class;
- maximum number of actions;
- expiry;
- rate limit;
- policy version;
- current epoch and host lease.

Deny rules take precedence. Every use emits an event, decrements the remaining count atomically, and still undergoes canonical digest recomputation at Pi’s final boundary. [codex-luna §6.4][codex-luna] [pi-deepseek §7][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS.** It removes repetitive taps without offering an “always allow,” all-tools, wildcard-shell, or permission-bypass mode.

### Concrete policy schema

```json
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
```

```json
{
  "command": "policy.grant",
  "mutationId": "mut_opaque",
  "policyId": "pol_opaque",
  "expectedEpoch": 16,
  "expectedPolicyVersion": 4,
  "maxActions": 5,
  "expiresAt": "2026-08-12T15:00:00Z",
  "decision": "allow_bounded"
}
```

```json
{
  "kind": "policy.use",
  "sessionId": "ses_opaque",
  "epoch": 16,
  "seq": 1318,
  "payload": {
    "grantId": "gr_opaque",
    "policyId": "pol_opaque",
    "policyVersion": 5,
    "leaseId": "lease_action_opaque",
    "actionDigest": "sha256:opaque",
    "decidedBy": "policy",
    "casVersion": 11,
    "remainingActions": 3
  }
}
```

The PWA should display “Allow up to 5 file writes in project until 15:00,” not “Always allow.” A separate policy screen shows scope, expiry, remaining actions, granting device, recent uses, and Revoke.

### Security-preserving mechanism

- policy match only proposes or mints a bounded lease;
- exact action remains digest-bound;
- CAS prevents concurrent over-consumption;
- revocation increments policy version;
- restart, epoch rotation, lease loss, path mismatch, or argument change invalidates the grant;
- expiry defaults to no action, never auto-approval;
- all uses are auditable without persisting sensitive raw arguments.

### Prior art

Claude permission modes and Cursor background-agent warnings establish the convenience and danger of broad auto-run policies. `sudo`-style time windows offer useful finite-authority vocabulary. Pi’s lease/CAS/final-boundary primitives allow narrower semantics. [codex-luna §§6.4, 12][codex-luna] [pi-deepseek §§7, 12][pi-deepseek]

### What makes it better than anything shipping

Grant five writes, consume two concurrently, revoke, change a path through a symlink, rotate the epoch, and restart the host. Only in-scope current actions consume the grant; every stale or out-of-scope use denies visibly.

---

## 2.5 Browsable and renamable session list under opaque identity

### Merged recommendation

Use three layers:

1. **Immutable server identity:** `sessionId` is opaque and never derived from path, prompt, repository, branch, hostname, or Pi session filename.
2. **Safe relay summary:** status, coarse workspace label, model, timestamps, unread count, plan progress, cost, attention class, and lifecycle only.
3. **User label:** device-local by default; optionally synchronized as ciphertext using a paired-device group key and relay-side CAS revision.

This reconciles the lineages’ main divergence. Codex-luna proposed relay-owned plaintext user labels with rename CAS for cross-device convergence. Pi-deepseek proposed device-local labels and optional ciphertext sync so the relay cannot leak their contents. The consolidated recommendation keeps CAS convergence without requiring the relay to hold label plaintext. [codex-luna §6.5][codex-luna] [pi-deepseek §8][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS.** The result is a useful, searchable session home whose identity and default metadata are privacy-safe by construction.

### Concrete catalog schema and rename command

```json
{
  "kind": "session.summary",
  "sessionId": "ses_opaque",
  "catalogRevision": 42,
  "payload": {
    "state": "working",
    "attentionClass": null,
    "model": "provider/model",
    "startedAt": "2026-08-12T13:30:00Z",
    "lastActivity": "2026-08-12T14:02:00Z",
    "unreadCount": 3,
    "plan": {
      "done": 2,
      "total": 5
    },
    "usage": {
      "costMicros": 450000
    },
    "workspaceLabel": "project",
    "labelRevision": 7,
    "labelCiphertext": {
      "alg": "AES-GCM",
      "keyId": "device-group-1",
      "nonce": "unique_opaque",
      "ciphertext": "opaque"
    }
  }
}
```

```json
{
  "command": "session.rename",
  "mutationId": "mut_opaque",
  "sessionId": "ses_opaque",
  "expectedCatalogRevision": 42,
  "expectedLabelRevision": 7,
  "labelCiphertext": {
    "alg": "AES-GCM",
    "keyId": "device-group-1",
    "nonce": "new_unique_opaque",
    "ciphertext": "opaque"
  }
}
```

The Home screen should support working, needs input, finished, error, queued, parked, and archived filters. Rows show decrypted user label when available; otherwise `Untitled · <opaque visual fingerprint>`. Search over labels occurs locally. Archive hides a row but does not imply deletion of replay history.

### Security-preserving mechanism

- never auto-name from prompts, paths, branches, hostnames, or tool output;
- normalize label length and control characters before encryption;
- relay searches only safe metadata;
- ciphertext rename uses CAS to prevent silent last-write-wins;
- paired-device revocation rotates or removes group-key access;
- catalog responses pass path, hostname, prompt-excerpt, and raw-session-name leak scans.

### Prior art

Claude Remote Control establishes a mobile session list and online state. Pi exposes session state that can feed a catalog. Tailscale’s separation of stable identity from human-readable names is a useful identity pattern. [codex-luna §§6.5, 15][codex-luna] [pi-deepseek §§8, 12][pi-deepseek]

### What makes it better than anything shipping

Users get private renaming, deterministic cross-device convergence, safe local search, and explicit metadata boundaries. A catalog leak scanner can prove that neither identity nor fallback naming reveals host context.

---

## 2.6 Background sessions and starting work while away

### Merged recommendation

Separate three capabilities:

1. **Continue after disconnect:** the relay supervises the existing Pi child; zero connected clients does not stop the session.
2. **Start while away:** allowed only inside a current host-minted run lease for a host-registered workspace.
3. **Proceed unattended:** only actions within existing policy grants continue; anything else emits `run.parked` and `needs_input`.

The run lease should bind workspace, device capability, maximum duration, prompt size, cost/token budget, allowed policy set, heartbeat requirement, and expiry. If authority is unavailable, the phone may save a bounded queued intent, but the UI must say “Queued—not running.” [codex-luna §6.6][codex-luna] [pi-deepseek §9][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS the reference on safe away operation and authority transparency.** It does not exceed unrestricted cloud agents on autonomy; that limitation is required by the foreground-authority posture.

### Concrete lifecycle schema and command

```json
{
  "kind": "session.lifecycle",
  "sessionId": "ses_opaque",
  "epoch": 5,
  "seq": 200,
  "payload": {
    "state": "background_ready",
    "connectedClients": 0,
    "runLease": {
      "leaseId": "run_opaque",
      "hostAuthority": "host_opaque",
      "workspaceRef": "ws_opaque",
      "expiresAt": "2026-08-12T18:00:00Z",
      "maxDurationSec": 3600,
      "maxCostMicros": 2000000,
      "requiresHeartbeat": true
    }
  }
}
```

```json
{
  "command": "session.create",
  "mutationId": "mut_opaque",
  "runLeaseId": "run_opaque",
  "workspaceRef": "ws_opaque",
  "promptRef": "prompt_opaque",
  "clientNonce": "nonce_opaque",
  "stepUpProof": "biometric_opaque"
}
```

```json
{
  "kind": "run.parked",
  "sessionId": "ses_opaque",
  "epoch": 5,
  "seq": 244,
  "payload": {
    "reason": "approval_required",
    "resumeRef": "apr_opaque",
    "budget": {
      "costMicros": 1420000,
      "limitMicros": 2000000
    },
    "attentionId": "att_opaque"
  }
}
```

The PWA distinguishes:

```text
working
background-running
queued
blocked-on-host
parked-needs-input
finished
error
indeterminate
```

The create card shows registered workspace, run-lease expiry, allowed policy surface, and cost cap before submission. Cost forecasting and progressive budget parking were surfaced only by pi-deepseek and should begin as advisory until accuracy is measured. [pi-deepseek §§9, 12][pi-deepseek]

### Security-preserving mechanism

- only the foreground host mints run authority;
- phone cannot choose arbitrary host paths;
- heartbeats and expiry fence new work;
- per-action approval and final digest remain mandatory;
- lost authority blocks new approvals;
- budget caps park at a safe step boundary, never during a mutation;
- cleanly stopped sessions are not automatically restarted;
- crash recovery rotates epoch and reconciles durable state.

### Prior art

Claude Remote Control keeps local work available across surfaces. Claude agent view supervises multiple background processes. Cursor offers always-on cloud agents and mobile dispatch. Pi’s distinction is explicit local authority, queue/park truthfulness, and no cloud execution boundary. [codex-luna §§6.6, 15][codex-luna] [pi-deepseek §§3, 9][pi-deepseek]

### What makes it better than anything shipping

Expire the host lease with queued work, stop the heartbeat mid-run, exhaust the budget, and request an ungranted action. The UI shows precisely why work queued or parked, and no protected operation gains authority merely because the user is away.

---

## 2.7 Simpler onboarding and pairing

### Merged recommendation

The hard constraint is unavoidable: Tailscale Serve is tailnet-only, so a phone must have Tailscale connectivity and tailnet membership. The product can collapse those prerequisites into one guided ceremony, but it cannot remove them without changing the security posture.

Provide two safe paths:

- **Baseline:** when the phone is already in the tailnet, `pi remote pair` shows one QR containing the Serve origin, pairing ID, host-key fingerprint, and single-use challenge. The phone enrolls a device public key; no app-auth ticket is copied.
- **Managed bootstrap:** optionally include a one-off, tagged, pre-approved, two-minute tailnet enrollment link created just in time by a narrowly scoped Tailscale OAuth client. After joining, the same flow continues over tailnet HTTPS/WSS and consumes the pairing challenge.

The host displays and confirms the phone’s friendly label and key fingerprint. The PWA provides linked-device inventory, last-seen state, capability scope, and one-tap revoke. [codex-luna §6.7][codex-luna] [pi-deepseek §10][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS for already-tailnet devices; conditionally EXCEEDS for first-time devices after managed-bootstrap validation.** It removes reusable application tickets and cloud-account dependency while preserving private ingress.

### Concrete pairing schema

```json
{
  "kind": "pairing.started",
  "payload": {
    "pairingId": "pair_opaque",
    "tailnetOrigin": "https://pi-host.tailnet.ts.net",
    "hostKeyFingerprint": "sha256:opaque",
    "challenge": "single_use_opaque",
    "expiresAt": "2026-08-12T15:30:00Z",
    "hostApprovalRequired": true,
    "tailnetJoin": {
      "mode": "optional_managed_bootstrap",
      "joinRef": "join_opaque",
      "tag": "tag:pi-remote-phone"
    }
  }
}
```

```json
{
  "command": "pairing.confirm",
  "pairingId": "pair_opaque",
  "challenge": "single_use_opaque",
  "tailscaleIdentity": "validated_proxy_identity",
  "deviceKey": "ed25519_public_opaque",
  "webauthnCredentialId": "optional_credential_opaque",
  "hostFingerprintSeen": "sha256:opaque"
}
```

```json
{
  "kind": "device.registered",
  "payload": {
    "deviceId": "dev_opaque",
    "deviceKeyFingerprint": "sha256:opaque",
    "capabilities": [
      "session.read",
      "session.prompt",
      "approval.decide"
    ],
    "registeredAt": "2026-08-12T15:29:12Z"
  }
}
```

### Security-preserving mechanism

- QR challenge is single-use and short-lived;
- no static bearer ticket;
- device enrollment completes only over tailnet HTTPS/WSS;
- relay trusts Tailscale identity headers only from the loopback Serve proxy;
- managed join credentials are one-off, narrowly tagged, short-lived, and never stored in the event ledger;
- host confirms device identity before capabilities activate;
- device revocation invalidates capabilities and leases;
- off-tailnet failure never falls back to Funnel or public ingress.

The QR-assisted tailnet join is a pi-deepseek-only finding and requires explicit implementation validation. Codex-luna recommended the safer already-tailnet QR ceremony. [codex-luna §6.7][codex-luna] [pi-deepseek §§10, 12][pi-deepseek]

### Prior art

Claude uses QR/session links for mobile continuation. Tailscale supports private Serve origins, identity propagation, auth keys, and QR-based login patterns. WebAuthn and Signal-style linked devices establish public-key enrollment and revocable device inventory patterns. [codex-luna §§6.7, 15][codex-luna] [pi-deepseek §§10, 17][pi-deepseek]

### What makes it better than anything shipping

One scan and one host confirmation replace manual URL and application-ticket entry. Expired QR, screenshot replay, wrong host fingerprint, off-tailnet access, reused join credential, and revoked-device access all fail closed.

---

## 2.8 Single-host multi-session concurrency

### Merged recommendation

Run one relay supervising N independent Pi children. Each session owns its own:

- process lifecycle and JSONL framing;
- epoch and sequence space;
- command-response correlation;
- durable event queue and replay cursor;
- capability set;
- approval and policy leases;
- flow-control window;
- crash and ambiguity state.

One WSS may multiplex compact session summaries and rich streams, but every message names the session and expected epoch. Use fair scheduling, per-session buffers, global capacity limits, and explicit queue reasons.

Add a workspace write lease: sessions sharing a workspace may read concurrently, but protected writes are serialized or require isolated worktrees. Do not claim container isolation where only process, workspace, and resource isolation exist. Workspace write leases were emphasized only by pi-deepseek; codex-luna independently established fair per-session windows and cross-session capability isolation. [codex-luna §6.8][codex-luna] [pi-deepseek §11][pi-deepseek]

### Parity-vs-EXCEED verdict

**EXCEEDS.** The differentiator is not the largest session count; it is durable fault isolation, prevention of silent same-workspace write conflicts, fair responsiveness, and cross-session authority transparency.

### Concrete capacity and workspace-lease schema

```json
{
  "kind": "host.capacity",
  "hostId": "host_opaque",
  "epoch": 2,
  "seq": 80,
  "payload": {
    "maxSessions": 8,
    "activeSessions": 5,
    "queuedSessions": 1,
    "maxBufferedEventsPerSession": 2000,
    "maxClientsPerSession": 3,
    "hostCostLimitMicros": 10000000
  }
}
```

```json
{
  "kind": "session.stream.window",
  "sessionId": "ses_opaque",
  "epoch": 7,
  "seq": 410,
  "payload": {
    "windowEvents": 256,
    "lastAckedSeq": 388,
    "droppedDurableEvents": 0,
    "presentationCoalesced": true
  }
}
```

```json
{
  "kind": "workspace.write_lease",
  "sessionId": "ses_opaque",
  "epoch": 7,
  "seq": 414,
  "payload": {
    "workspaceRef": "ws_opaque",
    "leaseId": "write_opaque",
    "mode": "exclusive_write",
    "holderSessionId": "ses_opaque",
    "fencingToken": 19,
    "expiresAt": "2026-08-12T16:45:00Z"
  }
}
```

The Home screen subscribes to compact summaries. Opening a session activates its rich stream; other sessions continue through durable summaries and the global attention inbox. A noisy session displays throttling without freezing siblings. Capacity refusal becomes a visible queued state.

### Security-preserving mechanism

- session A’s capability, lease, diff, label, event, and command are invalid for session B;
- epoch rotation is per session;
- durable events are never dropped under pressure;
- presentation deltas may be coalesced while canonical sequence identity remains intact;
- workspace writes use fenced leases rather than last-write-wins;
- host capacity and cost budgets are explicit global governors;
- one child crash cannot implicitly abort or authorize another session.

### Prior art

Claude agent view manages many background processes and exposes waiting/working/done states. Cursor supports larger-scale cloud agents. Pi can make local resource bounds, workspace conflicts, replay, and per-session authority visible instead of treating concurrency as a process-count feature. [codex-luna §§6.8, 15][codex-luna] [pi-deepseek §§11, 17][pi-deepseek]

### What makes it better than anything shipping

Flood one child while another awaits approval, a third settles, and a fourth reconnects after a crash. Other sessions remain responsive within a measured bound; no event or capability crosses sessions; same-workspace writes serialize or move to isolated worktrees; restarted children receive new epochs.

---

## 3. Model convergence vs divergence

### Strong convergence

Both lineages independently converged on these load-bearing conclusions:

| Area | Converged conclusion |
|---|---|
| Product shape | A typed PWA over a loopback relay, not terminal mirroring or direct browser-to-Pi transport |
| Transcript | Preserve typed Pi lifecycle distinctions, redact before persistence, and support durable replay |
| Approval | Exact-action digest, lease, epoch, idempotency, CAS, and final-boundary recomputation |
| Push | `needs_input`, `finished`, and `error` only; opaque pointer plus authenticated pull |
| Allow-list | Bounded policy-backed leases, no wildcard or bypass mode |
| Session identity | Immutable opaque server ID; never derive names from prompts or paths |
| Background work | Existing work survives disconnect; unattended reach is bounded; unmet authority parks |
| Pairing | QR challenge, device public key, revocation, and no public fallback |
| Concurrency | One relay, independent Pi children, per-session state, capacity controls, and no cross-session authority |
| Failure semantics | Stale/offline clients display state but cannot decide; expiry defaults to no action |
| Superiority proof | Measurable replay, leak, race, expiry, and isolation behavior—not screenshots |

[codex-luna §§4–14][codex-luna] [pi-deepseek §§4–16][pi-deepseek]

### Material divergence and reconciliation

| Topic | Codex-luna | Pi-deepseek | Consolidated decision |
|---|---|---|---|
| Session labels | Relay-held user label with rename CAS | Device-local label; optional ciphertext sync | Opaque relay identity plus local/E2EE label with CAS revision |
| Away work | Host-minted run lease and heartbeat; otherwise queued | Authenticated remote `session.create` in a registered workspace | Remote creation only inside a current host-minted run lease |
| Pairing | QR enrollment after tailnet membership | QR also carries a short-lived managed tailnet join path | Ship already-tailnet QR first; validate managed bootstrap separately |
| Push actionability | Generic push, pull on open | Optional encrypted local cache and richer unlocked rendering | Generic notification baseline; cache may optimize post-open only |
| Diff representation | Hashes plus bounded reconnectable hunks | LSP incremental range edits plus snapshot | LSP ranges for live presentation; hashes/snapshots for durable truth |
| Approval friction | One-tap fetched review; separate grant flow | Risk-tiered biometrics, number matching, glance actions | One tap for ordinary current actions; step-up only for high risk |
| Background verdict | Better safety/locality, not unrestricted autonomy | EXCEEDS reference outright | EXCEEDS safe reference experience; explicitly not cloud autonomy |
| Concurrency | Fair per-session flow control | Workspace write leases and host budgets | Adopt both; write leases require implementation validation |

### Findings surfaced only by codex-luna

- A single envelope with explicit `visibility`, redaction, replay, and snapshot eligibility.
- Presentation coalescing without dropping canonical durable sequence identity.
- Explicit `sync.delta`, `sync.snapshot`, and `sync.gap` behavior.
- Host run-lease heartbeat as the boundary for starting away work.
- “Decision submitted; verifying on host” as a distinct approval state.
- A concrete host-capacity and per-session stream-window protocol.
- Superiority tests based on disconnecting after every persisted event.

[codex-luna §§5–6, 14][codex-luna] [codex-luna registry][codex-luna-registry]

### Findings surfaced only by pi-deepseek

- LSP-range live diff updates with full snapshots on reconnect.
- Sequence-anchored local search and bookmarks.
- Risk-tiered biometric/number-matching approval friction.
- Android/Wear glance submissions through the same CAS; no equivalent iOS Web Push action.
- Local encrypted attention cache and optional UnifiedPush/ntfy path.
- Device-local labels with optional ciphertext-only cross-device synchronization.
- Cost forecasts, progressive thresholds, and recoverable budget parking.
- Waiting countdowns and classified recovery cards.
- Managed QR tailnet join using a one-off tagged auth key.
- Workspace write leases preventing silent same-directory conflicts.
- Explicit denial of server-side transcript indexing and last-write-wins settlements.

These are promising but remain single-lineage recommendations until validated against the implementation and target mobile platforms. [pi-deepseek §§4–12][pi-deepseek] [pi-deepseek registry][pi-deepseek-registry]

---

## 4. Ranked recommendations for the 041 implementation packet

### [P0] Adopt the common typed relay envelope and ordered block reducer

Amend the relay and PWA phases with the versioned envelope, typed transcript vocabulary, redaction metadata, replay cursor, explicit gap/snapshot semantics, and unknown-event tolerance.

**Feel-per-effort:** transforms the experience from remote chat into a legible coding-agent timeline while using Pi events already available.

**Security reconciliation:** redact before persistence and broadcast; UI projections never become commands; durable sequence identity survives presentation coalescing.

### [P0] Make Home, Session, Review, and Attention Inbox the complete information architecture

Home provides safe session summaries; Session renders the typed block graph; Review owns fetched approvals and policy proposals; Attention Inbox mirrors the three bounded push classes.

**Feel-per-effort:** eliminates navigation ambiguity and gives push-denied users the same attention workflow.

**Security reconciliation:** opaque IDs, safe catalog fields, no prompt/path-derived names, offline read-only state.

### [P0] Add exact-action approval events and submitted/verifying UX

Implement `approval.requested`, `approval.decide`, and `approval.result`, including epoch, revision, digest, lease, idempotency, expiry, and CAS.

**Feel-per-effort:** one-tap phone decisions feel immediate while failures stop looking frozen.

**Security reconciliation:** final-boundary digest recomputation; no optimistic execution; stale and duplicate decisions fail closed.

### [P0] Add the content-free attention contract

Implement `attention.changed`, the `needs_input | finished | error` allow-list, opaque push payload, generic notification copy, generation/nonce deduplication, and authenticated deep-link pull.

**Feel-per-effort:** turns long-running sessions into a useful pull loop without building a second content channel.

**Security reconciliation:** no decision, transcript, tool, path, diff, or error content in push; no lock-screen approval action.

### [P0] Make queue, park, expiry, invalidation, and indeterminate first-class states

Every pending approval, run, and session must terminate or transition visibly. Add countdowns and precise reasons.

**Feel-per-effort:** directly prevents the most damaging mobile experience—an apparently frozen session.

**Security reconciliation:** expiry defaults to no action; crash ambiguity remains explicit; offline displays but never decides.

### [P1] Add finite policy-backed session grants

Implement policy proposal, grant, use, revoke, remaining-action count, expiry, deny precedence, and final-boundary validation.

**Feel-per-effort:** removes repetitive edit approvals during normal coding work.

**Security reconciliation:** every use mints a one-action lease; no wildcard shell, all-tools, arbitrary path, or bypass mode.

### [P1] Add a safe, renamable session catalog

Start with immutable opaque identity and device-local labels. Add ciphertext CAS synchronization after paired-device key distribution is proven.

**Feel-per-effort:** session naming and filtering make multi-session mobile use immediately comprehensible.

**Security reconciliation:** relay never needs plaintext user labels; no automatic naming from sensitive host context.

### [P1] Add host-minted run leases and visible away-work parking

Allow remote `session.create` only for host-registered workspaces covered by a current bounded run lease. Add duration, budget, heartbeat, and policy constraints.

**Feel-per-effort:** makes “start from phone” real while preserving the distinction between queued and running.

**Security reconciliation:** phone cannot invent workspace or execution authority; ungranted actions park.

### [P1] Replace application-ticket entry with QR device enrollment

Ship the already-tailnet QR flow first: origin, pairing ID, host fingerprint, single-use challenge, device public key, host confirmation, and device inventory.

**Feel-per-effort:** removes the most visibly awkward onboarding step.

**Security reconciliation:** enrollment only over tailnet HTTPS/WSS; no reusable ticket; revocation invalidates capabilities and leases.

### [P1] Add fair multi-session flow control and workspace write fencing

Implement independent per-session windows and queues, global capacity, explicit queue reasons, and a ledger-backed workspace write lease or enforced worktree mode.

**Feel-per-effort:** keeps the session list responsive and avoids hard-to-explain concurrent edit conflicts.

**Security reconciliation:** no cross-session capabilities, no durable-event dropping, no same-workspace last-write-wins.

### [P2] Add sequence-anchored local search, bookmarks, and cost controls

Search the redacted device projection, bookmark `{sessionId, epoch, seq}`, expose reported cost, and optionally park at measured budget thresholds.

**Security reconciliation:** no server-side content index; cost limits never interrupt a mutation mid-boundary.

### [P2] Validate managed one-QR tailnet bootstrap

Prototype a just-in-time, single-use, tagged, short-lived Tailscale join credential created by a narrowly scoped OAuth client.

**Security reconciliation:** no Funnel, no reusable key, no event-ledger persistence, host fingerprint confirmation, explicit node inventory and revoke.

### [P2] Evaluate platform-specific glance and alternative push surfaces

Test Android/Wear submissions through the same approval command, UnifiedPush/ntfy on Android, and browser fallbacks. Do not promise equivalent iOS Web Push actions.

**Security reconciliation:** glance actions carry only opaque approval identity and still require live lease/CAS validation; no tool or argument content appears on the lock screen.

---

## 5. Open questions and required validation

1. **Pi RPC conformance:** Which live Pi events and extension hooks authoritatively supply thinking summaries, plans, tool input deltas, file diffs, usage, and final approval records? Validate with recorded and live children before freezing the schema.

2. **Reasoning visibility:** Which providers permit which reasoning summaries? Unsupported content must emit `thinking.summary.unavailable`, not a fabricated explanation.

3. **Diff truth model:** Can LSP-range updates be produced reliably for every file-edit tool? Retain hash/snapshot fallback and never use fuzzy client patches as execution truth.

4. **Approval timeout policy:** Measure appropriate defaults by risk class. Every expiry must settle as denied or expired; no timeout may approve.

5. **Biometric portability:** Determine what WebAuthn/passkey gesture can reliably step up approvals across installed iOS and Android PWAs without making ordinary approvals cumbersome.

6. **Push platform matrix:** Test installed PWA push, notification clicks, tailnet reachability after wake, subscription rotation, storage eviction, battery use, duplicate delivery, and absence of notification actions on iOS.

7. **Content-free payload proof:** Add a byte-level scanner asserting the push payload is within its size bound and contains no project, title, prompt, path, tool, arguments, diff, decision, digest, result, or error text.

8. **Local attention cache:** Determine whether encrypted cached summaries provide value after process termination and device lock. They must remain optional and never weaken generic notification copy.

9. **Label synchronization:** Define paired-device group-key creation, addition, revocation, rotation, recovery, and ciphertext CAS behavior before enabling cross-device labels.

10. **Background authority UX:** Test whether users understand `queued`, `background-running`, `blocked-on-host`, and `parked-needs-input`. The UI must not imply that the phone owns permanent authority.

11. **Run-lease constraints:** Establish safe defaults for workspace set, maximum duration, prompt size, heartbeat interval, token/cost budget, and allowed policy surface.

12. **Managed tailnet bootstrap:** Confirm Tailscale OAuth scopes, auth-key delivery mechanics, PWA/native handoff, tag ownership, single-use enforcement, auditability, and recovery. Do not ship this path if it requires broader tailnet authority than the convenience justifies.

13. **Serve identity boundary:** Prove that forwarded Tailscale identity headers are accepted only from the loopback Serve proxy and cannot be spoofed through another local or tailnet path.

14. **Workspace concurrency:** Decide whether same-workspace writes serialize, force worktrees, or support both modes. Test stale fencing tokens, lease expiry, host restart, and read/write interaction.

15. **Capacity defaults:** Measure safe session, buffer, client, token, and cost defaults on the target host. Avoid copying cloud-agent concurrency numbers into a local-host product.

16. **Replay and retention:** Select event-store encryption, retention tiers, snapshot frequency, compaction rules, and deletion semantics without persisting raw secrets or paths.

17. **Adversarial approval tests:** Race two devices, replay stale cards, mutate parameters after display, duplicate mutation IDs, revoke grants mid-use, rotate epochs, and crash between relay acknowledgement and Pi execution.

18. **Cross-session isolation tests:** Flood one child, crash another, approve a third, and reconnect a fourth. Verify bounded latency, zero event/capability crossover, and independent epoch rotation.

19. **Mobile performance targets:** Establish baselines for cold open, first text, approval fetch, reconnect, long-list rendering, memory, network use, and battery. Superiority claims remain hypotheses until measured.

20. **Accessibility:** Validate large touch targets, visible focus, focus restoration, reduced motion, virtualized-list navigation, and a coarse `aria-live` strategy that announces completed blocks rather than every token delta.

The two research lineages are complete, but the resulting design remains implementation guidance. The decisive product thesis is nevertheless stable: Pi should compete through richer truth, tighter action binding, clearer authority, and stronger privacy—not by weakening the loopback, tailnet, foreground-authority, or redaction boundaries.

[codex-luna]: lineages/cli-codex-gpt-56-luna-max/research.md
[codex-luna-registry]: lineages/cli-codex-gpt-56-luna-max/findings-registry.json
[pi-deepseek]: lineages/cli-pi-deepseek-v4-flash/research.md
[pi-deepseek-registry]: lineages/cli-pi-deepseek-v4-flash/findings-registry.json