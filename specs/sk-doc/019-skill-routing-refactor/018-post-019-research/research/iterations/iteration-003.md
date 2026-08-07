# Iteration 3: Minimum Cross-Runtime Leaf-Use Telemetry

## Focus

This iteration defined the smallest prompt-free telemetry contract that can prove three distinct claims: the intended leaves ran in the intended order, each required leaf completed successfully, and each observed completion was caused by the recorded routing decision. The test was intentionally stronger than “route proof exists” or “an output file exists,” because those establish declaration and artifact presence, not execution.

## Actions Taken

1. Compared the current deep-research route-proof and executor-provenance checks with the canonical iteration state emitted by native and CLI execution.
2. Traced the runtime's existing causal-ledger and boundary-receipt primitives for sequence, correlation, causation, idempotency, stable facts, and hash chaining.
3. Evaluated what an orchestrator-only record can and cannot prove when a leaf never starts, starts with the wrong definition, retries, or produces a stale artifact.
4. Derived a transport-neutral event envelope and success predicate that native, CLI, MCP, and remote adapters can emit without retaining raw prompts.

## Findings

1. **Current route proof proves declared routing, not leaf use.** Post-dispatch validation rejects a wrong mode or target agent and requires executor provenance for non-native runs, but those checks do not establish that a selected leaf acknowledged the dispatch or completed it. The canonical state likewise records `iteration_start`, executor kind/model, and the final iteration route fields without an ordered leaf plan, a leaf-originated start event, or a terminal receipt. `agent_definition_loaded: true` is useful configuration evidence, but it is not execution evidence. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts:63] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts:102] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts:454] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/deep-research-state.jsonl:13]

2. **The fleet already has most low-level proof primitives, but they are not joined into a leaf-use contract.** The runtime validates ledger identity with `ledger_id`, `sequence`, and `record_hash`; effect envelopes carry `correlation_id` and `idempotency_key`; reducer fixtures explicitly chain `causationId` to the preceding event; and boundary receipts bind stable facts across adjacent sequence numbers. These primitives can support a shared contract without inventing a second observability system. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/event-contracts.ts:256] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/event-contracts.ts:358] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-reducers.vitest.ts:121] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/boundary-receipts.ts:189]

3. **The minimum proof is a three-stage causal chain, not a larger lifecycle log.** A route-decision event must commit an immutable plan hash and an ordered target list. Each target then needs a leaf-originated start acknowledgement and a terminal finish receipt. Every event needs `event_id`, `schema_version`, `runtime`, `correlation_id`, `causation_id`, `decision_id`, `plan_hash`, `leaf_identity`, `ordinal`, `role`, `attempt`, `idempotency_key`, and an event timestamp. The decision additionally records the ordered `(hub, workflowMode, leafResourceId)` targets plus required/supplemental role and authority state. Start additionally binds the actual executor and loaded definition digest. Finish additionally records terminal status, output or effect-receipt digest, and bounded error class. This is the minimum because removing any stage loses one claim: no decision loses intent and order, no leaf start loses proof of actual invocation, and no finish receipt loses success.

4. **Order requires logical happens-before evidence; timestamps are insufficient across runtimes.** The verifier must require contiguous ordinals for the committed plan and bind each required leaf's start to the decision or preceding required finish through `causation_id`. Wall-clock timestamps remain diagnostic only because clocks can skew and parallel supplemental leaves may overlap. Retries retain the same decision, plan, leaf, and ordinal while incrementing `attempt` and using a stable idempotency family, preventing a retry from masquerading as a second planned leaf. The existing sequence and idempotency primitives support this rule. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/types.ts:50] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/types.ts:94] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/types.ts:248]

5. **Successful, causally attributable leaf use is a verifier predicate, not an emitted boolean.** A run passes only when the plan hash matches the decision, every required ordinal has exactly one accepted start and one successful terminal receipt, the actual leaf identity and definition digest match the plan, required ordering edges are intact, receipt hashes verify, and no unresolved retry or idempotency conflict remains. Supplemental failures may be reported without invalidating required-leaf success if the plan says so. An orchestrator-authored “success” event, output-file presence, process exit zero, or recommendation acceptance alone must not satisfy the predicate.

6. **Cross-runtime parity should standardize semantics, not transport mechanics.** Native, CLI, MCP, and remote adapters may obtain acknowledgements differently, but all must project into the same three event types and bounded identity fields. Raw prompts and raw outputs are unnecessary: content-addressed plan, definition, and receipt digests plus typed route identities preserve attribution while reducing privacy exposure. The leaf or its trusted runtime boundary must originate the start and finish evidence; an orchestrator cannot independently attest that its own dispatch was received.

## Questions Answered

- **What minimum cross-runtime telemetry proves ordered, successful, causally attributable leaf use?**
  - **Answered at the contract level:** one immutable route-decision plan, one leaf-originated start acknowledgement per attempt, and one terminal finish receipt, joined by decision/plan identity, causation, ordinal, idempotency, runtime, and content digests.
  - **Proof rule:** recompute success from the joined chain. Do not trust a producer-supplied success boolean or infer execution from route proof, exit status, or artifact presence.
  - **Evidence limit:** the repository contains the required ledger primitives but no observed native/CLI/MCP/remote trace demonstrating the full contract end to end. Cross-runtime conformance remains an experiment, not a confirmed fleet property.

## Questions Remaining

- Does two-tier required/supplemental leaf selection beat monolithic unioning on sealed-holdout recall within a preregistered route budget?
- Do authored route-gold and typed fixtures predict behavior on unseen natural prompts, or are they overfit?
- What per-stratum error budgets should govern low-risk versus mutating/external-effect auto-routing once joined operational outcomes exist?
- Can all supported runtime adapters emit and verify the three-stage leaf-use envelope without storing raw prompts?
- The missing primary hypothesis file still prevents direct comparison with the two claimed post-019 surveys.

## Ruled Out Directions

- **Treat route proof as execution proof:** rejected because it validates declared mode, target agent, and executor provenance without a leaf-originated acknowledgement.
- **Use timestamps alone to prove order:** rejected because cross-runtime clock skew and legitimate supplemental concurrency do not encode causal order.
- **Let the orchestrator self-attest leaf success:** rejected because dispatch intent and receipt are not independent evidence.
- **Store raw prompts or outputs for attribution:** rejected because stable identifiers, bounded route fields, and content digests are sufficient for the verifier.

## Assessment

- New information ratio: `0.78`
- Novelty justification: existing work named the joined-outcome need; this iteration added the minimal three-stage leaf evidence model, the logical-order predicate, and the independence requirement for leaf-originated acknowledgements.
- Questions addressed: 1
- Questions answered: 1 at the contract level
- Confidence: high for the logical sufficiency of the event chain; medium for operational feasibility until every runtime adapter produces a conforming trace.

## SCOPE VIOLATIONS

- Progressive synthesis would normally update `research/research.md`, and the reducer would update strategy, registry, and dashboard state. This dispatch authorizes none of those paths, so those mutations were left to the workflow reducer.

## Next Focus

Test two-tier required/supplemental leaf selection against monolithic unioning: preregister route budgets and failure accounting using the decision-plan and required-role semantics derived here, then compare sealed-holdout recall and precision.
