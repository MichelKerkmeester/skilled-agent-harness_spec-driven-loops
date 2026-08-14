# Alignment leaf — iteration 2 of 22

You are a deep-alignment LEAF performing ONE conformance iteration over one lane slice.
The orchestrator owns all state files. You are READ-ONLY: do not create, modify, or
delete ANY file. Your entire output is your final message.

GATE-3 PRE-RESOLVED (A) — write authority belongs to the orchestrator; never ask the
A-E documentation question.

## Lane
- Authority (the STANDARD being enforced): `sk-code`
- Artifact class: `code`
- Adapter module: `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs`
- Remaining after this slice: 472

## Your job
Check each artifact below for CONFORMANCE to the `sk-code` authority's
documented standards. Alignment is not open-ended review: you are asking "does this
artifact conform to the named standard?", not "is this code good?".

1. Establish the standard: read the authority's own contract (its SKILL.md and the
   references it names) so your findings cite a real documented rule, not taste.
2. Run the adapter's deterministic checks where useful — the adapter exposes a
   `check` surface; you may invoke it (read-only) to get mechanical signal.
3. Read each artifact and judge conformance. Cite the specific rule each finding violates.

## Artifacts in this slice (60)
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-schema.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-types.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-reducer.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/types.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/rollback-switch.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/types.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/types.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-replay.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-errors.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/deterministic-reducer.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/blinding.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/contracts.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/event-data.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/event-registry.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/judging.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/reducer.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/replay.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/service.ts
- .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/validation.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/errors.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/event-contract.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/index.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/ledger-fold.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/logical-branch-registry.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/types.ts
- .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts
- .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-continuity-events.ts
- .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-continuity-types.ts
- .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-frontier.ts
- .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts

## Output contract (STRICT)
Output ONLY a fenced JSON block, nothing after it:

```json
{
  "iteration": 2,
  "laneId": "sk-code::code::.opencode/skills/system-deep-loop/runtime/lib, .opencode/skills/system-deep-loop/runtime/scripts",
  "authority": "sk-code",
  "artifactsChecked": ["<every artifact path you actually examined>"],
  "summary": "<3-5 sentences: conformance picture for this slice>",
  "findings": [ { "severity": "P0|P1|P2", "artifactPath": "<path>", "rule": "<the documented rule violated>", "message": "<what is non-conforming>", "evidence": "<what you read there>", "recommendation": "<fix direction>" } ]
}
```

`artifactsChecked` MUST list only artifacts you genuinely examined, using the exact
paths given above — coverage is computed from this list and unknown identifiers are
rejected. Severity: P0 = violates a mandatory/hard rule; P1 = real violation of a
documented standard; P2 = advisory/style. An empty findings array with honest coverage
is a valid and useful result — do not invent violations.
