# Iteration 9: Resumable Human Gates

## Focus

The orientation requires durable human gates rather than process-local pauses. This pass converts AgentSwarms approval routing into a ledger-authorized resume protocol.

## Findings

1. AgentSwarms persists run identity, explicit user/group approvers, deciding identity, and notification time; its access policy permits only routed approvers to view and decide. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/supabase/migrations/20260724100000_swarm_approvals_and_runs.sql:17-58]
2. Decision: emit `HumanGateOpenedV1` with gate id, run/attempt id, graph/topology digest, suspended node, input-evidence digest, allowed principals/groups, policy version, opened sequence, expiry, and fencing token. The UI notification is a projection, not the gate. [INFERENCE: combines persisted AgentSwarms routing with the 036 ledger/transition authority established by orientation.md:126-170]
3. A decision command must bind `gate_id`, `decision_id`, principal, decision enum, observed gate version, evidence digest, and idempotency key; the transition gateway accepts exactly one decision for the current fence and rejects stale topology, evidence, assignment, expiry, or superseded attempts. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-distributed-locks-and-fencing/spec.md:65-102]
4. Reassignment is a new `HumanGateReassignedV1` event that increments gate version and invalidates outstanding links. Timeout is also an event selecting an explicit edge (`escalate|cancel|retry|manual_hold`); absence of a response must never imply approval. [INFERENCE: makes reassignment and timeout replayable structural control rather than mutable-row side effects]
5. Resume reconstructs the suspended node from the authoritative ledger and verifies the decision certificate before emitting `GateEdgeSelectedV1`; it never trusts a browser tab, notification delivery, or checkpoint alone. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/025-gate-edge-certificate-bindings/spec.md:82-123]
6. When not to use: do not insert a human gate for low-blast, deterministic, automatically reversible transitions; use it where policy requires accountability, evidence is genuinely ambiguous, or the effect is high-blast/irreversible. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:92-118]

## Ruled Out

- Approval URLs as authority; mutable in-place reassignment; timeout-as-approval.
- Resuming from UI/checkpoint state without ledger freshness checks.

## Assessment

- New information ratio: 0.77
- Novelty: defines a versioned, fenced decision token and explicit timeout/reassignment edges.
- Questions addressed/answered: q-replay human-gate durability.

## Recommended Next Focus

Define loops as typed subgraphs with independent state, budgets, convergence, and exit verdicts.
