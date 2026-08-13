# Iteration 8: Replay History, Checkpoints, and External Effects

## Focus

AgentSwarms has concrete resumability, while 036 provides the stronger authority and effect-recovery plane. This pass assigns each state kind exactly one role.

## Findings

1. AgentSwarms checkpoints capture context, last output, completed/skipped nodes, dead edges, topological level, and suspended approval. This is a good acceleration snapshot because it preserves branch decisions and avoids rerunning non-idempotent nodes. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmCheckpoint.ts:11-63]
2. Its defensive reader degrades malformed checkpoint fields toward restart-from-beginning. That is acceptable only if side effects are independently protected; otherwise a restart can replay effects. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmCheckpoint.ts:107-133]
3. Decision: the authorized 036 event ledger is the sole history. A `GraphCheckpoint` is a disposable projection containing `last_applied_sequence`, replay fingerprint, topology digest, reducer versions, projected node/edge state, and checksum. On mismatch or corruption, discard it and replay events; never infer “not executed” solely from missing checkpoint data. [INFERENCE: separates authoritative facts from AgentSwarms' mutable acceleration state]
4. Decision: each effectful node follows `intent_recorded → execute → confirmed`; resume classifies unresolved intent as `not_applied|applied|in_doubt|conflict`. Replay is permitted only with the same stable idempotency key or proof the effect did not occur. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md:56-75]
5. Decision: checkpoint publication is itself a fenced, atomic effect after ledger commit. A crash may lose the newest checkpoint but not the event; recovery resumes from an older checkpoint and replays forward. A checkpoint may never advance beyond a verified ledger head. [INFERENCE: combines 036 atomic/fenced writes with event-sourced replay]
6. AgentSwarms' checkpoint saver logs and swallows save failures, confirming why checkpoints must be best-effort accelerators rather than correctness authorities. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/utils/swarmCheckpoint.server.ts:6-37]

## Ruled Out

- Checkpoint-as-history.
- Re-executing an unresolved external effect because the process lacks a completion record.
- Treating process exit as durable confirmation.

## Dead Ends

Exactly-once execution cannot be claimed for targets without durable idempotency or trustworthy read-after-write reconciliation.

## Edge Cases

- Ambiguous input: pure-node recomputation is allowed, but its output must match replay policy or create a new attempt event.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: approval-specific resume is next.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmCheckpoint.ts:11-133]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/utils/swarmCheckpoint.server.ts:6-37]
- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md:56-84]

## Assessment

- New information ratio: 0.83
- Novelty: assigns distinct authority to events, checkpoints, and effect receipts with exact crash rules.
- Questions addressed/answered: q-replay history/checkpoint/effect separation.

## Reflection

- What worked and why: AgentSwarms' checkpoint fields are practical, while 036 supplies the missing effect truth.
- What did not work and why: restart-on-malformed is unsafe without receipts.
- What I would do differently: make checkpoint disposal an ordinary tested recovery path.

## Recommended Next Focus

Define resumable human-gate tokens, decision freshness, reassignment, timeout, and stale-approval rejection.
