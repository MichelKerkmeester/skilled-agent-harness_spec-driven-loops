# Iteration 006 — Exact-action phone approval

## Question

What is the smallest approval interaction that feels instant on a phone while remaining an exact-action, final-boundary decision?

## Evidence

041 requires final-boundary canonical digest recomputation and one relay-authorized lease at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md. Its relay state defines immutable epochs, replay, and mutation identity at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md. Claude remote control establishes mobile continuation and decision prompts ([Remote Control](https://code.claude.com/docs/en/remote-control)).

## Findings

The relay emits an approval.requested view only after it has an opaque approval record:

~~~json
{"kind":"approval.requested","sessionId":"ses_opaque","epoch":15,"seq":1204,"payload":{"approvalId":"apr_opaque","requestRevision":2,"actionDigest":"sha256:opaque","actionKind":"file_write","riskClass":"protected","display":{"title":"Review requested","summary":"A protected action is waiting","args":{"workspaceLabel":"project","fileCount":2},"diffRef":"diff_opaque"},"expiresAt":"2026-08-12T13:20:00Z","lease":{"leaseId":"lease_opaque","expiresAt":"2026-08-12T13:20:00Z"}}}
{"command":"approval.decide","mutationId":"mut_opaque","approvalId":"apr_opaque","expectedEpoch":15,"expectedRequestRevision":2,"actionDigest":"sha256:opaque","leaseId":"lease_opaque","decision":"allow_once"}
~~~

The relay resolves the approval record, checks the phone capability and lease, and forwards only a server-side canonical action reference. Pi recomputes the action digest immediately before execution. Responses are accepted, denied, stale, or expired; accepted is not executed until Pi confirms.

The default card has Allow once and Deny. Allow similar actions in this session is a separate policy proposal, never an implicit second effect. Two devices and a reconnect race the same approval; exactly one CAS winner may leave pending. Altering displayed arguments, diff text, or session name cannot change the digest.

The PWA shows redacted summary, scope, diff preview, expiry, and a clear Allow once; after tap it says decision submitted; verifying on host, then shows an event-backed result. Haptic animation is not execution success.

## Prior-art comparison

Claude proves that remote decisions can continue a local session. This design adds digest visibility and submitted/verifying states so the user never mistakes a tap for proof of execution.

## Assessment

New information ratio: 0.91. Q2 is substantially answered; notification semantics and session-wide policy remain.
