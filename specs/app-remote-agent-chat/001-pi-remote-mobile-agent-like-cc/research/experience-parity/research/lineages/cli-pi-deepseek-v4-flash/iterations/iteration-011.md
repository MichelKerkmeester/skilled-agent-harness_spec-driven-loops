# Iteration 11: Cross-Cutting Security Reconciliation (All Axes vs 001 Baseline)

## Focus
Reconcile every convenience design from iterations 2-10 against the 041-001 threat baseline risk classes (auth, path, crash, replay, approval, containment, leakage), the 004/007 redaction boundaries, and mobile lock-screen exposure realities. Hunt violations and gaps before synthesis.

## Findings

### F1. Tailscale Serve hardening facts (transport layer)
- Serve with Funnel disabled exposes the backend only to ACL-permitted tailnet identities — but it is still an exposure surface for overbroad ACLs; bind backend to 127.0.0.1 and expose only via Serve; deny-by-default grants; tag the host as a service node; identity headers from Serve must be accepted only from the local proxy; `--bg` configs persist across reboots — audit with `tailscale serve status` ([SOURCE: tailscale.com/docs/features/tailscale-serve], [SOURCE: tailscale.com/docs/reference/tailscale-cli/serve], [SOURCE: tailscale.com/docs/features/access-control/grants]).
- Implication: pairing UX (axis 7) must *surface* the tailnet ACL reality, and the relay must validate identity headers are locally proxied (no header spoofing from direct clients).

### F2. Lock-screen notification exposure (mobile layer)
- Treat every lock-screen notification as public: minimal generic copy ("Action needed in the app"); unlock-to-reveal; Android `VISIBILITY_PRIVATE` + sanitized `setPublicVersion()` / `VISIBILITY_SECRET`; iOS honors `lockScreenSetting`; notifications may appear on wearables/car displays ([SOURCE: developer.android.com/develop/ui/compose/notifications/create-notification], [SOURCE: developer.apple.com/documentation/usernotifications/unnotificationsettings/lockscreensetting], [SOURCE: owasp.org/www-project-mobile-top-10/2023-risks/m5-insecure-communication.html]).
- Implication: even the *rich local notification* from iteration 5 must degrade to generic copy when the device is locked — the local cache renders detail only in-app after unlock.

## Reconciliation: design-by-design verdicts

| Design (iteration) | Risk classes checked | Verdict | Gap or fix |
|---|---|---|---|
| Transcript kinds + redacted projections (2,3) | leakage, path | PASS with fix | Paths are ws-relative; **add redaction-class field per envelope** (001 REQ-002 redaction classes) so policy is machine-enforced, not renderer-enforced |
| Diff streaming (3) | leakage, path | PASS | LSP edits carry ws-relative path only; hunks may contain secrets → policy-masked lines; digest chain covers true bytes host-side |
| Approval tiered friction (4) | approval, replay, auth | PASS | Lease CAS + digest; biometric per high-risk; number matching optional; **add: approval card must re-fetch after lock-screen to avoid stale render** (unlock = fresh state) |
| Notification cache (5) | leakage | PASS with fix | Rich local notification must honor device lock state — locked → generic copy only; unlock → rich render (F2) |
| Policy-backed leases (6) | approval, containment | PASS | Deny precedence incl. symlink-resolved targets; no bypass mode exists |
| Session labels (7) | leakage | PASS | Labels are device-local; ciphertext-only sync |
| Unattended park (8) | crash, approval | PASS | Park is visible state; supervision events; no auto-approve |
| QR pairing (9) | auth, replay | PASS with fix | Ephemeral nonce + device keypair; **add: pairing must also verify the relay is the local Serve proxy** (header validation) and surface tailnet ACL scope (F1) |
| Concurrency (10) | containment | PASS | Workspace write leases; per-session isolation |

### Gaps requiring new design (carried forward)
1. **Machine-enforced redaction classes**: renderer-side masking is not enough — every envelope must carry a redaction class token validated at the relay (001 REQ-002), so a PWA bug cannot leak.
2. **Lock-state-aware notifications**: the SW must know device lock state (Visibility API / iOS heuristics) to choose generic vs rich local copy (F2).
3. **Serve-proxy identity validation**: relay must verify the peer is the local Tailscale Serve proxy (loopback source + injected header trust) so direct tailnet clients cannot spoof (F1).

## Sources Consulted
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/spec.md]
- [SOURCE: https://tailscale.com/docs/features/tailscale-serve]
- [SOURCE: https://tailscale.com/docs/reference/tailscale-cli/serve]
- [SOURCE: https://tailscale.com/docs/features/access-control/grants]
- [SOURCE: https://developer.android.com/develop/ui/compose/notifications/create-notification]
- [SOURCE: https://developer.apple.com/documentation/usernotifications/unnotificationsettings/lockscreensetting]
- [SOURCE: https://owasp.org/www-project-mobile-top-10/2023-risks/m5-insecure-communication.html]
- Iterations 2-10 (this lineage)

## Assessment
- newInfoRatio: 0.55
- Novelty justification: reconciliation table + three new gap items (machine-enforced redaction classes, lock-state-aware notifications, Serve-proxy validation) are new; Serve/lock-screen facts are new citations.
- Confidence: high; gaps are concrete and actionable.

## Reflection
- What worked: a per-design verdict table against the frozen risk classes turned "we are compliant" into three concrete machine-enforced fixes.
- What failed / ruled out: nothing this iteration; no design was found to violate the posture outright — all fixes are additive hardening.

## Recommended Next Focus
Cross-cutting pass B: the canonical combined relay event schema — one complete schema document merging axes 1-4 vocabulary onto the 003 envelope (the buildable artifact).
