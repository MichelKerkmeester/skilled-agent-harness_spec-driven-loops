# Iteration 2: Auth/Tailnet Boundary and Device Lifecycle — QR Ceremony, Serve Identity, Rotation, Multi-Device

## Focus
Audit 004 (auth and tailnet boundary) and 007 (push/platform) device lifecycle requirements: the single-use QR enrollment ceremony (004 REQ-006), the authenticated Serve identity signal (004 REQ-007), revocation semantics, device-key rotation, multi-device management, and the loopback-spoofing problem. Target gap classes (b) underspecified mechanisms, (e) unhandled edge cases, (f) security holes.

## Actions Taken
- Read 004 spec fully: REQ-001..007 (004/spec.md:105-110, 116), scope (private ingress, sessions, tickets, Origin), risk matrix R-001 proxy-header trust (004/spec.md §6).
- Read 007 spec fully: REQ-001..005 (007/spec.md:105-108, 114), subscription lifecycle, iOS/Android rows.
- Read 001 REQ-004 (first supported host/mobile matrix) and parent open questions on "deployment identity" (041/spec.md §4) and ADR-002 WebAuthn/passkeys step-up.
- Cross-checked 003 epoch model from iteration 1 (F1.4) against revocation.

## Findings

### F2.1 — The "authenticated Serve identity signal" mechanism is undefined, and loopback binding does not prevent local spoofing [P0, 004]
004 REQ-007 requires the relay to "accept the deployment identity signal only from the loopback Serve proxy" and "prove that a direct-loopback or alternate-tailnet path cannot spoof the trusted boundary." The mechanism is not specified anywhere: is it a Tailscale-Serve-injected header (e.g. `Tailscale-User-Login`), a unix-socket peer-credential check, a shared secret between the Serve config and the relay, or an ephemeral token in the Serve command line? The critical unhandled case: the relay binds loopback, and ANY local process can connect to 127.0.0.1 — including a malicious process running as the same user (or another user if the relay port is not protected). "Strip client-supplied headers" alone does not help because a direct loopback connection bypasses Serve entirely and can supply any headers. If the identity signal is a header, a local attacker trivially spoofs it; if it is a token, the token must never appear in logs/process lists. Remediation: add ADR-005 to 004: "The trusted boundary is a unix domain socket (or loopback port) whose client is verified by SO_PEERCRED-style identity + a per-deployment ephemeral secret injected only into the Serve process environment (never CLI args, never logged); direct-loopback and alternate-path connections without the secret fail closed; negative control proves local-process spoofing fails."

### F2.2 — QR enrollment has no challenge TTL, no host→device mutual authentication, and no partial-enrollment recovery [P0, 004]
004 REQ-006 binds "origin, pairing id, host fingerprint, a single-use challenge, and a device public key" but does not define: (a) the challenge lifetime (a QR sitting on screen for an hour is a stolen-token window; a device pubkey arriving minutes later reuses it — is that the "single use"?), (b) device→host authentication of the Serve identity (an attacker's Serve endpoint with a swapped QR would capture the device's key — the device must verify the host fingerprint AND that the enrollment endpoint is the real loopback-bound Serve), (c) recovery from a crash between device-key receipt and host commit (partial enrollment orphan state: the device holds a "paired" belief the host never recorded), and (d) whether the enrollment itself is logged/audited and bounded by rate limits (QR brute-force/replay). Remediation: add REQ-017 to 004: "The QR challenge has an explicit TTL (e.g. 5 min) and is single-use across that window; enrollment performs host-to-device authentication (device verifies host fingerprint over the authenticated Serve channel before sending its key); enrollment is transactional — a host crash before commit invalidates the challenge and the device returns to unpaired state; enrollment attempts are rate-limited and audited with metadata only."

### F2.3 — Device-key rotation is absent; the plan only covers push-subscription rotation [P0, 004+007]
007 REQ-003 lists "preferences, encryption, rotation, unsubscribe, logout, revocation, reinstall" for push SUBSCRIPTIONS, but nothing anywhere specifies rotation of the DEVICE PUBLIC KEY enrolled in 004 REQ-006 (the key that authenticates the device and signs its tickets). A device key compromised on a lost/stolen phone is permanent unless the operator re-enrolls (revoke + re-pair), which the plan never specifies as a flow, and there is no re-key ceremony or key-versioning. Additionally the WebAuthn/passkeys step-up from ADR-002 (001/decision-record.md:155) is mentioned for approval step-up but its credential lifecycle (recovery, backup, per-device vs roaming authenticator) is not tied into device enrollment — two credential systems (enrollment key + passkey) with no defined relationship. Remediation: add REQ-018 to 004: "Device keys carry a version and a rotation ceremony: revoke-old/issue-new with epoch bump (ties to 003 REQ-013); rotated keys never grant tickets minted under the prior key; ADR-006 documents the relationship between enrollment keys and WebAuthn passkeys (which credential authorizes what)."

### F2.4 — Multi-device management has no surface: no device inventory, no per-device revocation UI, no remote-kill of a lost device [P1, 004+005]
004 REQ-006 revokes "the device's capabilities and leases and disconnects its sockets" but there is no requirement for: a device inventory endpoint (opaque device ids + last-seen + redacted label), a management surface in the 005 IA (Home/Session/Review/Attention-Inbox have no device-management surface — 005 REQ-008), or a flow to revoke a device from ANOTHER device (lost-phone scenario requires operating from the remaining device or the host). The parent spec's "multi-device" ambition (041/spec.md §2 problem statement) is unmet by the IA. Remediation: add REQ-019 to 004: "A read-only device inventory endpoint (opaque ids, last-seen, redacted metadata) plus an operator surface to revoke any device and to re-run enrollment; device revocation propagates within bounded latency and bumps epoch per 003 REQ-013."

### F2.5 — One-use WebSocket tickets lack a validity window, renewal, and reconnection semantics [P0, 004]
004 REQ-002 rejects "expired/replayed ticket" and REQ-006 uses one-use tickets, but 005 REQ-002 requires reconnect/reauthentication — a one-use ticket conflicts with reconnect unless the client re-authenticates (new ticket) on every reconnect, which the plan never specifies as a flow, nor does it define ticket TTL, ticket lifetime vs. session lifetime, or a renewal endpoint. A mobile PWA in background/suspend will reconnect frequently; every reconnect minting a fresh ticket is an attackable and rate-limited surface, and the interaction between ticket reuse and the envelope session is undefined. Remediation: add REQ-020 to 004: "Tickets are single-use with explicit TTL, bound to (session, deviceKeyVersion, epoch); reconnects mint a fresh ticket via the authenticated device channel; ticket minting is rate-limited; negative controls prove replay of a consumed ticket fails even within TTL."

### F2.6 — iOS push platform limits are unquantified; the attention class can leak session activity via lock-screen [P1→P0, 007]
007 REQ-001 bounds payload to an opaque id + one class from {needs_input, finished, error} and 007 REQ-004 documents "delivery limits" per platform — but the SPECIFIC iOS constraints are unstated: iOS Home Screen web apps (non-Safari-installed PWAs) do NOT receive Web Push at all in practice (iOS 16.4+ Safari-only), APNs payload size (4KB) and priority, and the lock-screen display of the generic copy. More subtly: a lock-screen notification saying "needs_input" on a session the user thought finished is a covert activity signal; the plan has no requirement for notification privacy mode (e.g. hide-on-lock default, per-device toggle) or for honest documentation that iOS standalone PWAs may not receive push. 007 REQ-004 says "document" limits, but "document" is not a functional acceptance criterion — the fallback path (Attention Inbox covers push-denied users, which 007 REQ-005 does) is the only mitigation and it requires the app to be open. Remediation: add REQ-021 to 007: "The supported-rows table states iOS standalone-PWA push availability explicitly (expected: unavailable without a native wrapper) with the Attention Inbox as the declared fallback; notification privacy default hides content on lock screen; a per-device toggle exists; device tests assert the declared behavior, not just documentation."

### F2.7 — Origin validation scope is incomplete: only one Origin is named, and PWA scope/redirect handling is unspecified [P1, 004+005]
004 REQ-002 rejects "wrong/missing Origin" but does not define the Origin allowlist policy (single static Origin? dynamic per-enrollment?), how the PWA's manifest scope interacts with Origin checks, or redirect/`Origin: null` cases (some mobile browsers send `Origin: null` for cross-origin navigation and WebSocket). A too-strict policy breaks legitimate browsers; a too-loose policy (accepting null) reopens the spoof. Remediation: add REQ-022 to 004: "The Origin policy is an explicit allowlist of {scheme, host, port} tuples pinned at enrollment, with a documented, tested decision for `Origin: null` (default: reject) and for service-worker-initiated fetches; the browser harness (002 lane) covers redirect and null-Origin cases."

## Questions Answered
- KQ-1: serve identity signal mechanism now analyzed (F2.1); device-key rotation identified as absent (F2.3).
- KQ-3 (partial): QR TTL/partial enrollment (F2.2), ticket/reconnect (F2.5), iOS limits (F2.6).
- KQ-4 (partial): local loopback spoofing (F2.1), lock-screen leak (F2.6).

## Questions Remaining
- KQ-2 (untestable criteria), KQ-3 remainder (crash/TOCTOU/offline), KQ-4 remainder (redaction/privacy) — assigned to iterations 3-5.

## Next Focus
Iteration 3: Approval, containment, and remote mutation — containment primitive, TOCTOU/CAS races, kill switch, accept-edits grant edge cases, audit metadata (006 + 002 security lane).

## Sources Consulted
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary/spec.md:105-110,116]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md:105-108,114]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/spec.md:113]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/decision-record.md:155]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/spec.md §2,§4]

## Assessment
- newInfoRatio: 0.85 — device-lifecycle axis (rotation, multi-device surface, ticket renewal, iOS push reality) is new to this packet; F2.1 builds on iteration 1's epoch finding.
- Confidence: high for F2.1-F2.5 (spec-grounded); medium-high for F2.6 (platform facts are external knowledge — the spec itself confirms "document delivery limits" without functional criteria).

## Reflection
What worked: reading 004 and 007 as one device-lifecycle system rather than separate phases surfaced the enrollment-key rotation gap and the missing multi-device management surface.
What failed: could not verify Tailscale Serve header specifics from local sources; mechanism remediation intentionally left ADR-level.
Ruled out: not proposing a specific third-party MDM-style device management product; the gap is a missing requirement, not a tooling choice.
