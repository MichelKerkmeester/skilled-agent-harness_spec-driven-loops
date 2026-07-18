# Iteration 4: Acknowledged No-Wrong-Door Handoff

## Focus
Specify and stress-test a no-wrong-door protocol where a mode can accept intake and offer a typed transfer, while execution authority remains with the destination packet. The narrow interpretation is a bounded control-plane handoff for ambiguous routes, not an unbounded peer conversation and not a replacement for confident single-shot routes.

## Findings
1. A safe handoff needs an acknowledgment boundary, because accepting a transfer request is distinct from completing the referred work. SIP REFER requires one target, permits immediate rejection, requires the recipient to reject targets it cannot access, returns `202 Accepted` before the transaction expires, and then reports the referred action separately through correlated NOTIFY status. The transferable shape is `INTAKE -> OFFERED -> ACCEPTED -> ACTIVE -> terminal`, with `REJECTED` and `TIMED_OUT` returning control to intake; an `ACCEPTED` response atomically transfers execution ownership but does not claim successful execution. [SOURCE: https://www.rfc-editor.org/rfc/rfc3515.html] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:108] [INFERENCE: separating transfer acceptance from work status prevents both premature success and dual execution]
2. The destination must validate capability before acceptance, and every non-success path must be typed. A2A distinguishes `input-required`, `canceled`, `failed`, `rejected`, `auth-required`, and `unknown`; specifically, rejection means the task was not started. The local packet contract independently assigns tool and mutation authority per mode. Therefore an offer can request a capability, but only the destination may accept after checking registry membership, packet kind, requested operation class, and its own `toolSurface`; otherwise it returns a reason-coded rejection without executing. [SOURCE: https://a2a-protocol.org/v0.3.0/specification/] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:65] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:87] [INFERENCE: a transfer request is evidence for routing, not a grant of authority]
3. Typed dialogue should be a bounded recovery branch, not a free-form transcript handoff. MCP elicitation uses a JSON Schema request and distinguishes `accept`, `decline`, and `cancel`, while requiring clear requester identity, validation, and rate limiting. A2A preserves `taskId`/`contextId`, permits task references, and lets callers bound returned history with `historyLength`. The corresponding router branch is `NEEDS_INPUT(schema, options, reason)` with at most one clarification round by default; the transfer envelope carries a request digest, normalized intent summary, required capability, selected structured slots, policy identities, and references, not the full conversation. [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation] [SOURCE: https://a2a-protocol.org/v0.3.0/specification/] [INFERENCE: schema-bound slots plus references make context cost proportional to unresolved routing evidence rather than transcript length]
4. Authority should remain destination-local and delegation should be audience- and scope-bound. OAuth token exchange distinguishes the subject from the acting party, lets the requester name resource/audience/scope, requires validation of presented tokens, and does not invalidate the input token merely because an exchange occurred. For a hub, the analogue is an offer containing `sourceMode`, `candidateMode`, `requestedCapability`, `operationClass`, and policy hashes; acceptance creates a short-lived execution lease valid only for the destination packet and requested operation. It does not copy the source mode's permissions or widen the destination's declared tool surface. [SOURCE: https://www.rfc-editor.org/rfc/rfc8693.html] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:23] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:65] [INFERENCE: audience/scope-bound delegation preserves packet authority while permitting correlated continuation]
5. The protocol can replace one-shot classification only on the uncertain path, under explicit latency and cycle budgets. Each offer carries an idempotent `transferId`, `visitedModes`, `hopBudget`, and deadline; destinations reject a repeated mode or exhausted budget, paralleling SIP's transaction identity and Max-Forwards loop bound. High-confidence routes still execute in one step; an ambiguous route pays one offer/response round trip and at most one clarification turn. Before `ACTIVE`, rejection, timeout, or cancellation rolls control back to the intake mode with no mutation; after `ACTIVE`, rollback means destination-owned cancellation or compensation, never automatic re-execution by the source. This structurally bounds cost, but whether the bound is acceptable in real traffic remains an empirical benchmark question because this packet has no observed request corpus. [SOURCE: https://www.rfc-editor.org/rfc/rfc3261.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc3515.html] [SOURCE: https://a2a-protocol.org/v0.3.0/specification/] [INFERENCE: one conditional round trip, one clarification, compact context, and a finite hop budget replace unbounded dialogue with a measurable control path]

## Proposed State Machine

| State | Owner | Allowed transition | Required effect |
| --- | --- | --- | --- |
| `INTAKE` | Source mode | `OFFERED` or local response | Preserve conversational continuity; do not execute outside source authority. |
| `OFFERED` | Source pending destination decision | `ACCEPTED`, `REJECTED`, `NEEDS_INPUT`, `TIMED_OUT` | Send one compact, idempotent envelope; destination performs capability and authority checks. |
| `NEEDS_INPUT` | Source/user interaction | `OFFERED`, `REJECTED`, `TIMED_OUT` | Ask one schema-bound clarification with compressed options; retain the same transfer identity. |
| `ACCEPTED` | Destination | `ACTIVE` | Atomically acquire the scoped execution lease; source ceases mutation attempts. |
| `ACTIVE` | Destination | `COMPLETED`, `FAILED`, `CANCELED` | Execute only under destination packet/tool authority and emit correlated status. |
| terminal | Source resumes conversational delivery | none | Report outcome; never reinterpret transfer acceptance as work success. |

The minimum offer is `{transferId, sourceMode, candidateMode, requestDigest, intentSummary, requiredCapability, operationClass, contextRefs, policyHashes, visitedModes, hopBudget, deadline}`. Repeated `transferId` values are idempotent; a candidate already in `visitedModes`, a zero hop budget, or an expired deadline produces a typed rejection or timeout rather than another transfer.

## Ruled Out
- Full-transcript peer handoff: it makes context cost grow with conversation length and transfers unrelated or sensitive material when structured slots and references suffice.
- Treating `ACCEPTED` as `COMPLETED`: SIP explicitly separates accepting REFER from the later status of the referred action.
- Unbounded clarification or rerouting: MCP's rate-limit guidance and SIP's hop bound point to explicit budgets, not conversational recursion.
- Generic rollback after destination mutation: cancellation is not guaranteed even in A2A, so post-execution recovery must be defined by the destination workflow rather than fabricated by the router.

## Dead Ends
An unconstrained “modes talk until they agree” protocol is a candidate for reducer promotion to exhausted approaches. It lacks a finite cost model, obscures authority, and reintroduces routing loops.

## Edge Cases
- Ambiguous input: selected the narrow ambiguous-route control path; universal replacement of confident one-shot routing is deferred and ruled out by the cost model.
- Contradictory evidence: none. SIP's `202 Accepted` and A2A's terminal task states describe different phases and become compatible once transfer acceptance is separated from execution completion.
- Missing dependencies: none.
- Partial success: none. The design is protocol-grounded, but real latency acceptability remains unmeasured without a request corpus.

## Sources Consulted
- https://www.rfc-editor.org/rfc/rfc3515.html
- https://www.rfc-editor.org/rfc/rfc3261.html
- https://a2a-protocol.org/v0.3.0/specification/
- https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation
- https://www.rfc-editor.org/rfc/rfc8693.html
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:108
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:23
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:65
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:87

## Assessment
- New information ratio: 1.00
- Questions addressed: Can recoverable handoffs or typed dialogue replace one-shot classification without unacceptable latency and context cost?
- Questions answered: Can recoverable handoffs or typed dialogue replace one-shot classification without unacceptable latency and context cost?

Answer: yes for ambiguous or low-confidence routes when the protocol is conditional and bounded to one acknowledged offer, at most one typed clarification, compact referenced context, a finite hop budget, destination-local authority, and explicit timeout/rollback semantics. It should not replace confident one-shot routes. Structural cost is bounded; empirical latency acceptance still requires corpus-backed measurement.

## Reflection
- What worked and why: combining SIP's acknowledged referral, A2A's task lifecycle, MCP's schema-bound elicitation, and OAuth's scoped delegation produced one small state machine in which transfer, dialogue, execution, and authority remain distinct.
- What did not work and why: treating any single protocol as the whole answer failed conceptually—SIP lacks the packet authority model, A2A permits richer history than this router should transfer, MCP governs clarification rather than execution, and token exchange does not define conversational ownership.
- What I would do differently: benchmark the control path on a real ambiguity corpus, measuring offer acceptance, clarification frequency, added turns, transferred bytes/tokens, cycle rejections, and wrong-authority prevention against one-shot routing.

## Recommended Next Focus
Routing as a one-turn typed negotiation with calibrated confidence, option compression, and a measurable clarification budget.
