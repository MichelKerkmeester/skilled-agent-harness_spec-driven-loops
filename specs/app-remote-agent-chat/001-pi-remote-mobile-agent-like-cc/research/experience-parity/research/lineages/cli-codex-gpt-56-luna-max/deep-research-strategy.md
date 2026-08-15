# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

This detached lineage investigates experience parity and superiority for a private Pi remote-control client. The 041 packet is the architectural authority; this packet adds product-level contracts, prior-art comparisons, and release-testable proof obligations. All 20 iterations are required; convergence is telemetry only.

## 2. TOPIC

Design the best-in-class remote-control experience for the Pi coding agent: a private mobile client that pairs with Pi like the Claude Code + Claude mobile app but must exceed it, while retaining loopback-relay, tailnet-only, foreground-authority, and redaction security posture.

## 3. KEY QUESTIONS (remaining)

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: What event vocabulary and reducer model make a live Pi transcript richer than current mobile coding-agent experiences?
- [x] Q2: How can phone approvals be low-friction while binding the exact canonical action at the final execution boundary?
- [x] Q3: How should content-free push reconcile needs_input, finished, and error attention with authenticated pull and deep links?
- [x] Q4: How should accept-edits/session allow-lists compose with lease, CAS, epoch, and revocation semantics without bypass?
- [x] Q5: How can opaque session IDs support browsable, renamable, searchable session lists without leaking paths or prompt content?
- [x] Q6: What background-session model lets work continue and new work start away from the phone while foreground authority remains explicit?
- [x] Q7: What pairing flow is simpler than Tailscale plus a ticket while preserving tailnet-only ingress and device revocation?
- [x] Q8: How should one host safely support many concurrent Pi sessions, devices, subscriptions, and approval requests?
- [x] Q9: Which shipping products and platform primitives establish prior art, and where can Pi demonstrably exceed them?
- [x] Q10: What integrated event/schema, PWA, security, and verification contract is ready to hand to 042 implementation?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- No implementation, dependency installation, deployment, public Internet exposure, native app, multi-host orchestration, or change to the 041 security posture.
- No claim that a third-party product exposes undocumented internals; distinguish observed public behavior, documented contract, and inference.
- No decision-bearing push payloads, background approvals, raw path/transcript persistence, exactly-once claims across an unacknowledged crash boundary, or unrestricted accept-edits.

## 5. STOP CONDITIONS

- Run all 20 iterations unless an unrecoverable state failure occurs.
- Keep all artifacts inside this lineage directory; do not mutate 042 spec.md, 041 docs, source code, memory surfaces, or the git index.
- Every iteration must include source-backed findings, a concrete schema or UX/security decision, negative knowledge, and a next focus.

## 6. ANSWERED QUESTIONS

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: What event vocabulary and reducer model make a live Pi transcript richer than current mobile coding-agent experiences?
- Q2: How can phone approvals be low-friction while binding the exact canonical action at the final execution boundary?
- Q3: How should content-free push reconcile needs_input, finished, and error attention with authenticated pull and deep links?
- Q4: How should accept-edits/session allow-lists compose with lease, CAS, epoch, and revocation semantics without bypass?
- Q5: How can opaque session IDs support browsable, renamable, searchable session lists without leaking paths or prompt content?
- Q6: What background-session model lets work continue and new work start away from the phone while foreground authority remains explicit?
- Q7: What pairing flow is simpler than Tailscale plus a ticket while preserving tailnet-only ingress and device revocation?
- Q8: How should one host safely support many concurrent Pi sessions, devices, subscriptions, and approval requests?
- Q9: Which shipping products and platform primitives establish prior art, and where can Pi demonstrably exceed them?
- Q10: What integrated event/schema, PWA, security, and verification contract is ready to hand to 042 implementation?

<!-- /ANCHOR:answered-questions -->

## 7. WHAT WORKED

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

## 8. WHAT FAILED

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

## 9. EXHAUSTED APPROACHES

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

## 10. RULED OUT DIRECTIONS

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- How push deep links can be content-free while still opening the right approval. (iteration 1)
- Exact schemas for thinking, plans, tool inputs/results, diffs, cost, and approval leases. (iteration 1)
- How to measure multi-session, pairing, and background superiority. (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

## 11. NEXT FOCUS

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT

- 041 phases 003/005/006/007 establish durable persist-before-broadcast replay, immutable epochs, relay-owned catalog, PWA reconciliation, final-boundary approval, and generic push/fetch-on-open.
- Primary external source families to triangulate: Pi RPC docs, Anthropic Claude Code remote control/mobile docs, Tailscale Serve/auth docs, W3C Web Push, OWASP WebSocket/mobile guidance, MDN PWA APIs, and OpenTelemetry GenAI conventions.

## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.02; stop policy: max-iterations
- Per-iteration budget: 12 tool calls / 15 minutes
- Current generation: 1
- Session ID: fanout-cli-codex-gpt-56-luna-max-1786514481346-vicu2t
