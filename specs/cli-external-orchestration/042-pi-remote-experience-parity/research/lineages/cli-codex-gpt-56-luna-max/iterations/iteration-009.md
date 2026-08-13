# Iteration 009 — Opaque browsable and renamable sessions

## Question

How can a user browse and rename sessions when the security posture forbids using filesystem paths or prompt text as identity?

## Evidence

Claude Remote Control shows named sessions, online status, QR pairing, and a mobile session list ([Remote Control](https://code.claude.com/docs/en/remote-control)). Pi get_state exposes an optional sessionName ([RPC](https://pi.dev/docs/latest/rpc)). 041 requires an opaque, relay-owned catalog at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md.

## Findings

The relay owns a catalog keyed by random IDs:

~~~json
{"kind":"session.summary","sessionId":"ses_opaque","catalogRevision":42,"payload":{"displayName":"Payments fix","nameSource":"user","state":"working","attentionClass":null,"lastActivity":"2026-08-12T14:02:00Z","unreadCount":3,"plan":{"done":2,"total":5},"usage":{"costMicros":450000},"workspaceLabel":"project"}}
{"command":"session.rename","mutationId":"mut_opaque","sessionId":"ses_opaque","expectedCatalogRevision":42,"displayName":"Payments fix"}
~~~

The catalog never derives a default title from prompt, path, host, branch, or tool output. A user label is opt-in, length-bounded, normalized, and redacted for control characters; a missing label is “Untitled session” plus a short opaque visual fingerprint. Rename is an idempotent CAS mutation whose result is durable and replayable across devices.

The PWA home is a searchable list by user-provided display name and coarse status, not full-text transcript. Filters are working, needs input, finished, error, and archived. Each row shows a generic status dot, plan count, last activity, unread attention class, and usage chip. Tapping opens the session. The phone can archive/hide a row without deleting relay history.

Security tests prove that catalog responses contain no absolute path, hostname, prompt excerpt, branch, environment value, or raw Pi session-file name. A rename from device A appears on device B in event order; a stale revision returns conflict and cannot overwrite a later name.

## Prior-art comparison

Claude demonstrates high-value naming and online status; Pi supplies sessionName but not a mobile catalog contract. The proposed catalog preserves that usability while making redaction, opaque identity, rename CAS, and cross-device replay explicit.

## Assessment

New information ratio: 0.82. Q5 is answered at the data/UX boundary; full concurrency and lifecycle remain.
