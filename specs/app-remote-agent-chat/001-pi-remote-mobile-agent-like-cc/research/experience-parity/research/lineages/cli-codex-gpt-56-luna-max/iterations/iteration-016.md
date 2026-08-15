# Iteration 016 — Threat model and redaction boundary

## Question

What threats remain when a rich mobile client is added, and how can the relay make each trust decision observable?

## Evidence

OWASP recommends WSS, explicit Origin allowlists, message-level authorization, size/rate limits, replay nonces, backpressure, and logging without sensitive payloads ([WebSocket security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html)). Tailscale Serve says identity headers are only safe when the backend listens on localhost and distinguishes private Serve from public Funnel ([Serve](https://tailscale.com/docs/features/tailscale-serve)). 041 defines loopback relay, redaction, replay, and final-boundary approval.

## Findings

Add security state to the same durable ledger without logging secrets:

~~~json
{"kind":"security.audit","sessionId":"ses_opaque","epoch":8,"seq":744,"payload":{"action":"approval.decide","actorDevice":"dev_opaque","result":"denied","reason":"stale_epoch","requestRef":"apr_opaque","redactionPolicyVersion":"r1"}}
{"kind":"device.revoked","deviceId":"dev_opaque","reason":"operator_revoke","effectiveAt":"2026-08-12T16:00:00Z"}
{"kind":"redaction.policy","policyVersion":"r2","effectiveSeq":745,"rulesHash":"sha256:opaque"}
~~~

Threats and mechanisms:

- A malicious tailnet peer: Tailscale ACL/Serve identity, relay device capability, per-session authorization.
- Cross-site WebSocket hijacking or XSS: same-origin PWA, explicit Origin allowlist, WSS, CSP, schema validation, no event HTML interpretation.
- Compromised or lost phone: device key revoke, short leases, optional WebAuthn step-up, no secret push body, session-scoped capability.
- Push provider/lock screen: opaque class/nonce only; authenticated pull.
- Stale replay: epoch, sequence, nonce, mutation idempotency, CAS, final digest.
- Prompt injection/tool output: treat all agent content as data; never let a displayed label choose a command or expand scope.
- DoS/noisy stream: per-device/session limits, message caps, output truncation, backpressure, fair queues, idle timeout.
- Host crash: persist-before-broadcast, indeterminate outcomes, new epoch and replay/snapshot.

The PWA exposes a small trust strip: tailnet connected, device verified, relay epoch, replay current/gap, approval authority available/unavailable. It never exposes raw security logs or secret values.

## Better-than-parity proof

Automate unauthorized Origin, missing/expired device, cross-session command, stale lease, replayed push, oversized JSON, malformed tool result, output secret, and connection-flood tests. Every denial produces a redacted security.audit and no protected Pi action.

## Assessment

New information ratio: 0.89. The threat model is concrete enough for implementation and verification; performance bounds remain.
