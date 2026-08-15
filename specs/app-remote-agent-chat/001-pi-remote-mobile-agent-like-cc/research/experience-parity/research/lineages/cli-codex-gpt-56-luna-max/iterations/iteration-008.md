# Iteration 008 — Session accept-edits allow-list

## Question

How can a user approve a bounded family of edits without bypassing the final action boundary?

## Evidence

041 defines final-boundary approval and lease semantics at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md. Its relay state defines epochs and mutation identity at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md. Cursor's background-agent documentation shows why broad automatic execution increases exfiltration risk: [Background Agents](https://docs.cursor.com/background-agent).

## Findings

Treat accept-edits as a policy proposal followed by individually consumed grants:

~~~json
{"kind":"policy.proposal","sessionId":"ses_opaque","epoch":16,"seq":1300,"payload":{"policyId":"pol_opaque","scope":{"operationClass":"file_write","workspaceRef":"ws_opaque","pathSetHash":"sha256:opaque"},"maxActions":5,"expiresAt":"2026-08-12T15:00:00Z","requestedBy":"device_opaque","basePolicyVersion":4}}
{"kind":"policy.grant","sessionId":"ses_opaque","epoch":16,"seq":1304,"payload":{"grantId":"gr_opaque","policyId":"pol_opaque","policyVersion":5,"leaseId":"lease_opaque","casVersion":9,"scope":{"operationClass":"file_write","workspaceRef":"ws_opaque","pathSetHash":"sha256:opaque"},"remainingActions":5,"expiresAt":"2026-08-12T15:00:00Z"}}
{"command":"policy.decide","policyId":"pol_opaque","expectedEpoch":16,"expectedPolicyVersion":4,"leaseId":"lease_opaque","decision":"grant"}
~~~

Every protected action still reaches Pi's final boundary, which recomputes its canonical digest, checks the grant's operation/path scope, decrements remainingActions with CAS, and records grant use. The grant is not a command parameter override.

The policy must be finite: explicit operation class, workspace capability, hashed path set or safe path prefix, maximum actions, short expiry, optional rate limit, and a device/session binding. Revoke increments policyVersion and may rotate the session epoch. Any reconnect or host restart can invalidate the lease. The UI says “5 file writes in project scope until 15:00,” never “always allow.”

A phone may approve the proposal only through the same authenticated relay and lease. A one-action approval and a policy grant have different review screens. No wildcard shell, arbitrary path, or “all tools” selector is exposed.

## Better-than-parity proof

Race two devices, revoke mid-run, alter a path after policy creation, and restart the host. Every changed scope, epoch, version, lease, expiry, or action digest must deny. A valid grant can reduce taps while still producing one final-boundary audit record per action. That is safer than convenience-only accept-edits.

## Prior-art comparison

Cursor explicitly warns that background agents auto-run commands and create exfiltration risk. 041 provides the stronger local final-boundary primitive. The proposed grant adds bounded convenience without copying broad background authority.

## Assessment

New information ratio: 0.9. Q4 is answered: accept-edits is a lease-bound, finite policy that never replaces exact-action final validation.
