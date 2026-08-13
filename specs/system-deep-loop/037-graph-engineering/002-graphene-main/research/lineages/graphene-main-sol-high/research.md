# Graphene-Main Graph Engineering Synthesis

## Executive Verdict

The lineage reached its configured terminal condition after 20 iterations with all seven research questions answered. The result is a concrete extension of repo 1, not a replacement architecture and not a cutover certificate: keep repo 1's typed work graph and seven-plane separation, then add seven versioned contracts for belief projection, closed replay cuts, causal-prefix parity, protected mutation, truth admission, authority-zero refusals, and durable human gates. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:26-72] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-config.json:9-29]

The 036 authority plane remains the sole authority mechanism. Graph execution, belief state, checkpoints, parity evidence, refusals, and human choices are projections or inputs to authorization until a mode-scoped 036 compare-and-swap moves the authority state and epoch. This synthesis neither observes nor asserts that any mode has crossed that boundary. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:174-208] [INFERENCE: this lineage contains design evidence but no mode-scoped cutover certificate or authority-state observation]

Graphene is valuable as an executable counterexample suite: its four-valued beliefs, transaction-scoped claim admission, rebuildable fold, actionable refusals, and durable human timeouts expose useful mechanisms, while its fold-equivalent authority-log compaction, incomplete temporal fixture, node-addressed completion, post-admission nogood handling, and unfenced human consequence path identify mechanisms that must not cross into the 036 authority plane unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:136-177] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:157-210] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:342-395] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:30-69]

## Delta From Repo 1

Repo 1 already established the controlling architecture: typed graph IR; readiness derived from ledger state; wave admission separated from mutation authority; gateway-authorized transitions; replayable checkpoints; behavior-level parity; durable human gates; distinct organization and work graphs; and hybrid evidence/knowledge projections. Those decisions remain intact. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:13-95]

| Question | Relation to repo 1 | Concrete delta |
|---|---|---|
| P1 | **REFINE + EXTEND** Decisions 5 and 8 | Make belief truth executable and purpose-bound; require checked quiescence and selected-authority disposition before it can block convergence. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:28-32] |
| P2 | **REFINE** Decision 4; **CONTRADICT** Graphene authority-log compaction | Bind checkpoints to independent, reference-closed domain and audit cuts; retain committed histories. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:34-38] |
| P3 | **REFINE + EXTEND** Decision 6 | Compare causal operation prefixes and require independent checkpoints plus manifest-bound mutants, not terminal equivalence alone. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:40-44] |
| P4 | **CONFIRM + REFINE** Decision 2 | Turn the safe-wave rule into a claimant-addressed, target-complete, atomic compare-and-mutate API. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:46-50] |
| P5 | **EXTEND** Decision 8; **CONTRADICT** Graphene production supersession/nogood admission | Add semantic observation order and prospective serializable fixed-point admission. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:52-56] |
| P6 | **REFINE + EXTEND** repo-1 failure paths | Standardize denial as an actionable but authority-zero outcome that cannot execute its own advice. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:58-62] |
| P7 | **REFINE + EXTEND** Decision 4 | Bind a durable human decision to live topology, evidence, belief, principal, capability, fence, expiry, and consequence dependencies. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:64-68] |

The current `system-deep-loop` hub remains registry-driven: public workflow modes resolve to their existing packets and backend kinds, while runtime loop types remain only `research`, `review`, and `council`. The P1-P7 contracts belong in shared runtime packages and mode adapters; they do not justify a new public mode, a new hub branch, or a graph-specific authority owner. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:36-86] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-102] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:103-199]

## Composed Architecture

```text
verified domain prefix + verified authorization-audit prefix
                  │
                  ▼
        ProjectionCutV1 closure check
                  │
          exact-version reducers
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
GraphCheckpointV1      BeliefProjectionV1
      │                       │
      └───────────┬───────────┘
                  ▼
       purpose-bound control preview
                  │
        gateway allow or P6 refusal
                  │
                  ▼
 GraphMutationCommandV1 / TruthAdmissionCommandV1 /
             HumanGateConsequenceCommandV1
                  │
  atomic claim + head + version + fence revalidation
                  │
                  ▼
       one authorized immutable transition
                  │
      ┌───────────┴────────────┐
      ▼                        ▼
rebuildable projections   separately authorized effect intent
                                │
                                ▼
                         receipt/recovery path
```

This composition preserves 036's separation between immutable authorized domain frames, immutable audit decisions, disposable projections, and external effects. Existing ledger frames already bind authorization references; the gateway records one allow or deny decision and rejects stale heads and authority epochs; effects first persist an intent and then reconcile an independently observed outcome. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-745] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:451-506]

## P1 — Purpose-Bound Belief Projection

**Decision — REFINE + EXTEND repo 1:** adopt `BeliefProjectionV1` as a disposable projection over verified 036 events. It carries orthogonal provenance, source identity, fidelity, validity, staleness, support, contradiction, supersession, and `IN | OUT | BOTH | NEITHER`; only a non-stale `IN` claim is usable. Graphene demonstrates the four states and non-stale premise rule, but the 036 version must also bind purpose and source identities so a claim cannot be reused outside the question it supports. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:136-177] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:368-424] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:22-80]

Settlement is control-safe only when a verifier proves a checked fixed point: no support cycle, oscillation, repeated state, or bound exhaustion; the verification pass changes nothing; and every required answer path is either supported or an explicit blocker. Graphene's bounded loop is useful but its loop bound alone is not proof of quiescence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:693-777] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:9-21]

The first consumer should be deep research, initially advisory. `coverage-graph-signals.ts` may accept belief blockers before its existing verification-rate and contradiction-density telemetry, but STOP eligibility requires `authority_disposition: selected-authority` plus the current 036 authority state and epoch. A shadow projection may explain a disagreement; it cannot vote STOP. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:581-630] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:176-203] [INFERENCE: the optional belief input and package placement are proposed integration seams]

**WHEN NOT TO USE:** direct immutable facts; a validated acyclic dependency set handled by one topological pass; explanation-only output; or a mode where current evidence/coverage signals fully determine the decision. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:30-32]

## P2 — Closed Replay Cuts and Disposable Checkpoints

**Decision — REFINE repo 1 and CONTRADICT Graphene compaction:** adopt `ProjectionCutV1` with independent domain and audit heads. Closure means every included domain frame's authorization reference resolves in the audit cut, while denials and unapplied allows remain explicitly classified; it does not mean equal sequence numbers across the two ledgers. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:27-63] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:29-34]

Every event in the closed domain range must resolve to an exact registered reducer or an explicitly registered deterministic no-op. `GraphCheckpointV1` is accepted only after repeat reduction, cut closure, replay-fingerprint verification, and canonical digest comparison; otherwise discard it and replay from genesis. Existing runtime reduction already resolves exact event/reducer identities and detects nondeterministic repeated reduction, while the 036 replay contract requires stored, effective, and projected component digests. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/deterministic-reducer.ts:43-135] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:65-100]

Committed domain and audit frames are never deleted merely because a later checkpoint is fold-equivalent. Graphene correctly makes fold caches rebuildable, but its `compact()` deletes committed event rows after projection equivalence, which does not preserve 036's audit, replay, authorization, or historical-read contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-store/src/lib.rs:342-395] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:90-116]

**WHEN NOT TO USE:** streams where genesis replay is cheaper than checkpoint validation; a deliberately domain-only read that makes no authorization-completeness claim; or any cut whose event, upcaster, reducer, audit closure, or canonicalizer identity is unknown. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:34-38]

## P3 — Causal-Prefix Cross-Adapter Parity

**Decision — REFINE + EXTEND repo 1:** adopt `CrossAdapterTraceV1` as ordered authorized operation prefixes, not a final snapshot comparison. Each prefix binds operation/correlation/causation identity, request digest, audit decision or refusal, accepted domain range, before/after cuts, checkpoint, budget delta, effect observations, artifact references, and terminal outcome. A refusal prefix must prove zero domain, budget, and effect mutation while retaining its linked audit denial. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:7-33] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:26-55]

Expected checkpoints must be sealed independently of the reducer under test. Normalization is a closed reversible allowlist; partial orders are allowed only for operations whose declared read/write/effect domains are proven disjoint. Every positive scenario must carry a plausible single-defect mutant with an expected divergence class and earliest failing prefix. Current 036 parity already requires isolated inputs, complete declared observations, immutable earliest divergence evidence, and nondeterminism as a blocking class; P3 makes those requirements operation-local. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:60-104] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:166-200]

**WHEN NOT TO USE:** UI rendering, token streaming, transport throughput, deliberately non-semantic formatting, or a local deterministic unit for which a direct independent oracle is stronger and cheaper. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:40-44]

## P4 — Claimant-Addressed Protected Mutation

**Decision — CONFIRM + REFINE repo 1:** adopt `GraphMutationCommandV1` with exact graph/node/session/claim/attempt identity, claim-event sequence, operation identity, payload digest, and a complete canonically ordered target set. Every target binds resource identity, atomicity domain, current monotonic fence, and exactly one expected state version or ledger head. Wave evidence is admission evidence only and cannot replace claim or target proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:134-168] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33-41]

The protected store must atomically revalidate claim identity, authority epoch, idempotency identity, all fences, all expected versions/heads, and the transition rule at commit. Current runtime primitives already enforce canonical multi-resource order, revalidate current leases inside the guarded commit, and compare protected-state version before atomic replacement. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:432-488] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts:110-177]

Multiple fences prevent stale writes; they do not manufacture crash atomicity across independent stores. A multi-resource semantic operation should append one authoritative ledger transition and derive projections/effect intents unless its backend proves a single declared atomicity domain. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:91-102] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:118-124]

**WHEN NOT TO USE:** read-only projection queries or immutable content-addressed writes that cannot replace, alias, debit, append to, or externally effect a protected identity. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:46-50]

## P5 — Temporal Supersession and Serializable Truth Admission

**Decision — EXTEND repo 1 and CONTRADICT Graphene's unsafe paths:** semantic successor selection uses `(observedAt, authorizedSequence)`; deterministic replay remains ledger-sequence ordered. Validity is half-open and history is immutable. Graphene's helper correctly makes observation time primary with sequence as tie-break, but the orientation shows the production supersede path does not consistently enforce it. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/time.rs:84-129] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:38-48]

All support, contradiction, supersession, scope, source-staleness, and nogood candidates must preview from one exact clean base, settle to a checked fixed point, and commit under one serializable belief-admission version/fence before sequence allocation. Refuse non-increasing successors, competing active successors, cycles, and completed nogoods prospectively. Retain a full-replay invariant check as an independent corruption/import/reducer-drift backstop, not as permission to admit then discover an invalid state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:561-628] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:35-42]

**WHEN NOT TO USE:** proven closure-disjoint work whose versioned manifest covers support, successor, nogood, scope, and required-answer domains; offline/import-only data quarantined from control; immutable evidence without truth-affecting relations; or a static invariant enforced by a simpler transaction constraint. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:52-56]

## P6 — Authority-Zero Actionable Refusal

**Decision — REFINE + EXTEND repo 1:** adopt `TransitionRefusalV1` with a versioned outcome, `authority: none`, stable closed code and boundary, typed detail schema, retryability, exact request/head/policy/fence observations, audit-decision reference, and bounded advisory actions. It is never a domain event, command union member, capability, allow proof, effect intent, or executable repair. Every suggestion requires a new authenticated and authorized request. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:180-205] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:1-78]

Unknown refusal versions/codes fail closed. The gateway's durable deny decision remains the authority record; the refusal is a caller-facing projection linked to that decision and must not expose raw capability or protected event payloads. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:234-274]

**WHEN NOT TO USE:** local deterministic parsing/input errors without a gateway decision; presentation-only errors; or a transport whose existing bounded typed error already contains the complete stable contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:58-62]

## P7 — Durable Fenced Human Consequences

**Decision — REFINE + EXTEND repo 1:** open a durable gate against exact topology, evidence, and belief cuts; allowed principals/capabilities; explicit options and consequence map; gate version/fence; expiry; timeout edge; and a minimal semantic dependency vector. At consequence append, atomically revalidate decision identity/idempotency, current gate fence/version, authority epoch, principal capability, expiry, topology, and every dependency. If any moved, invalidate and reopen rather than reinterpret the stale choice. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:207-215] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:51-58]

Graphene usefully persists human asks, choices, context, consequences, and timeouts, and distinguishes escalation from approval; its direct resolve path nonetheless lacks the 036 dependency/fence revalidation required for a consequence-bearing transition. Edge selection is one authorized transition, and an external effect is a later independently authorized intent with receipt/recovery semantics. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:599-705] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:828-887] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:617-688]

**WHEN NOT TO USE:** informational acknowledgements, display-only preferences, or interactions with no consequence-bearing edge, mutation, budget change, or downstream effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:64-68]

## Versioned Schema Set

These are proposed `@1` wire contracts: immutable identity strings, snake-case persisted fields, closed enums, canonical JSON, independent schema versions, and fail-closed unknown versions. The names are implementation proposals; the semantics above are the frozen research decisions. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:18-20] [INFERENCE: final module and field naming requires implementation review]

```ts
interface ProjectionCutV1 {
  cut_version: 'projection-cut@1';
  domain_head: LedgerHead;
  audit_head: LedgerHead;
  covered_domain_start_sequence: number;
  covered_domain_end_sequence: number;
  authorization_reference_closure_digest: string;
  audit_classification_digest: string;
  applied_authorization_refs: readonly string[];
  unapplied_allow_refs: readonly string[];
  denial_refs: readonly string[];
  event_registry_digest: string;
  upcaster_registry_digest: string;
  canonicalizer_version: string;
  replay_fingerprint_version: string;
}

interface GraphCheckpointV1 {
  checkpoint_version: 'graph-checkpoint@1';
  graph_reducer_id: string;
  graph_reducer_version: string;
  projection_schema_version: string;
  projection_cut: ProjectionCutV1;
  topology_digest: string;
  ledger_configuration_digest: string;
  canonical_projection_digest: string;
  replay_fingerprint_digest: string;
  checkpoint_checksum: string;
}

interface BeliefProjectionV1 {
  projection_schema_version: 'belief-projection@1';
  reducer_version: string;
  projection_cut: ProjectionCutV1;
  authority_disposition: 'advisory' | 'selected-authority';
  authority_state: AuthorityState;
  authority_epoch: number;
  belief_admission_head: LedgerHead;
  claims: Readonly<Record<string, {
    claim_id: string;
    claim_version_id: string;
    purpose_id: string;
    truth_state: 'IN' | 'OUT' | 'BOTH' | 'NEITHER';
    premise_usable: boolean;
    stale: boolean;
    source_identity_refs: readonly string[];
    evidence_refs: readonly string[];
    valid_from: string | null;
    valid_until: string | null;
    terminal_successor_claim_id: string | null;
  }>>;
  convergence_blockers: readonly JsonObject[];
  settlement_proof: {
    proof_version: 'belief-settlement-proof@1';
    support_graph_digest: string;
    transition_bound: number;
    work_items_processed: number;
    verification_pass_changed: false;
    repeated_state_detected: false;
    quiescent: true;
    final_state_digest: string;
  };
}

interface GraphMutationCommandV1 {
  command_version: 'graph-mutation-command@1';
  operation_id: string;
  operation_kind: string;
  graph_id: string;
  node_id: string;
  claim_id: string;
  session_id: string;
  attempt_id: string;
  claim_event_sequence: number;
  authority_epoch: number;
  payload_digest: string;
  targets: readonly {
    resource_key: string;
    atomicity_domain: string;
    resource_digest: string;
    fence_token: number;
    expected_version: string | null;
    expected_ledger_head: LedgerHead | null;
  }[];
}

interface TruthAdmissionCommandV1 {
  command_version: 'truth-admission-command@1';
  operation_id: string;
  candidate_kind: 'claim' | 'support' | 'source-staleness' | 'scope' | 'contradiction' | 'supersession' | 'nogood';
  candidate_digest: string;
  base_belief_admission_head: LedgerHead;
  projection_cut: ProjectionCutV1;
  affected_claim_ids: readonly string[];
  declared_transitive_closure_digest: string;
  policy_digest: string;
}

interface TransitionRefusalV1 {
  refusal_version: 'transition-refusal@1';
  outcome: 'refused';
  authority: 'none';
  code: string;
  boundary: 'compile' | 'authorization' | 'claim' | 'fence' | 'budget' | 'belief-admission' | 'human-gate' | 'effect';
  request_digest: string;
  detail_schema: string;
  detail: JsonObject;
  observed_heads: readonly LedgerHead[];
  audit_decision_ref: AuthorizationReference | null;
  advisory_actions: readonly { action_kind: string; prerequisite_codes: readonly string[] }[];
  new_request_required: true;
}

interface HumanGateConsequenceCommandV1 {
  command_version: 'human-gate-consequence-command@1';
  gate_id: string;
  decision_id: string;
  decision_digest: string;
  option_id: string;
  principal_id: string;
  capability_id: string;
  authority_epoch: number;
  gate_version: number;
  gate_fence_token: number;
  expires_at: string;
  topology_digest: string;
  evidence_cut_digest: string;
  belief_cut_digest: string;
  semantic_dependency_vector: readonly { dependency_id: string; expected_version: string }[];
  consequence_digest: string;
}
```

`CrossAdapterTraceV1` remains a manifest-level contract rather than a command: it binds case/BASE/build/adapter/authority identities and an ordered `prefixes[]` array whose entries contain decisions/refusals, accepted domain ranges, before/after cuts, checkpoints, budgets, effects, artifacts, and the expected earliest divergence for its paired mutant. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:124-132]

## Dependency-Safe Implementation Order

1. **P6 first, additive only.** Freeze shared wire/authority vocabulary; add authority-zero refusal encoding/decoding and unknown-version negative tests. No writer changes. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:74-77]
2. **P2 in shadow.** Add dual-ledger cuts, exact/no-op reducer registration, genesis replay, disposable checkpoints, corruption/missing-reference tests, and delete/rebuild negative control. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:76-78]
3. **P3 before control adoption.** Pilot deep-research adapters in isolated roots with suppressed effects, independent checkpoints, A1-A7 schedules, and required mutant detection. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:77-79]
4. **P4 one protected store at a time.** Shadow target completeness, canary one reversible writer, and prove stale-successor plus partial-mutation negative controls before any authority change. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:79-80]
5. **P5 prospective admission.** Replay and quarantine dirty bases, dual-run previews, serialize truth candidates, and retain independent full replay. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:80-81]
6. **P1 advisory, then selected per consumer.** Prove settlement termination and parity; promote only through a mode-scoped 036 authority CAS while retaining legacy convergence for rollback. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:81-82]
7. **P7 last.** Start render-only, then a reversible non-effectful consequence edge, then a separately authorized effect with recovery receipts. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:82-83]
8. **Retire nothing on graph evidence alone.** Keep legacy readers/writers, upcasters, fixtures, rollback anchors, replay, and effect recovery until the 036 retention and rollback contract authorizes retirement. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:210-237]

## Adversarial Parity Plan

| Mutant | Schedule | Expected earliest blocking mismatch |
|---|---|---|
| A1 stale successor | Pause claimant after preflight; advance claim/fence/head; resume old claimant | P4 commit prefix: stale claim/fence/head denial; zero mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:23-28] |
| A2 out-of-order successor | Deliver older observation after newer one with distinct authorized sequences | P5 preview prefix: non-increasing successor refusal; replay order unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:35-42] |
| A3 fold-equivalent history deletion | Remove a committed event while preserving final projection bytes | P2 stored-sequence/replay fingerprint mismatch before checkpoint acceptance. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:90-99] |
| A4 terminal-only adapter drift | Reorder/skip an intermediate authorized operation but preserve final state | P3 earliest causal-prefix mismatch, even if terminal digest matches. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:14-33] |
| A5 post-admission nogood | Candidate completes a nogood that replay would later detect | P5 admission-preview refusal before sequence allocation; zero domain mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:38-48] |
| A6 executable refusal advice | Treat a suggested repair as an authorized command | P6 schema/capability boundary: authority remains `none`; a fresh request is required. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:43-50] |
| A7 stale human allow | Move topology/belief/principal dependency after allow but before consequence | P7 consequence append: dependency/fence/epoch denial, invalidate/reopen gate, zero effect intent. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:51-58] |

Each mutant must run at least twice over the same sealed case; missing observations, nondeterminism, mutant survival, or a mismatch later than the declared earliest prefix blocks the case. No comparison-time rebaseline, tolerance broadening, or scenario removal may turn failure into parity. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:21-55] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:99-116]

## Boundaries and Rollback

Rollout switches are contract-scoped, not graph-wide: projection/read selection (P1/P2), protected writer selection (P4/P5/P7), and effect execution remain independently reversible. A single graph-wide kill switch would couple unrelated failure domains and make rollback evidence ambiguous. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-019.md:19-70] [INFERENCE: independent switches follow the 036 per-mode and per-authority-state rollback model]

Rollback means: stop admissions at a new authority epoch, fence both writer paths, reconcile immutable ledger/audit/effect evidence, restore the retained legacy path by governed CAS, and rebuild projections. It never means truncating an authority ledger, restoring an older fence token, rewriting a denial, or interpreting dark output as authoritative. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:187-203] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:540-608]

The following directions are ruled out: unified Graphene authority; authority-log compaction; timestamp replay order; a synthetic cross-ledger sequence; graph reducer authority; node-only completion; preflight-only fences; post-admission nogood detection; last-write-wins supersession; executable refusal advice; implicit human approval; or a human choice that directly authorizes an external effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:102-110]

## Unresolved Implementation and Measurement Gaps

| Gap | Closing evidence | Current boundary |
|---|---|---|
| Final package/file/field names | Scoped implementation plan and schema review | Semantics are settled; names are not shipped. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:87-100] |
| P1 termination proof | Property tests plus cycle, oscillation, repeated-state, and bound-exhaustion mutants | Belief projection stays advisory. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:91-93] |
| P2 closure/checkpoint implementation | Genesis replay, missing-ref, corruption, same-version drift, delete/rebuild tests | No checkpoint controls execution. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:92-94] |
| P3 trace normalization and A1-A7 execution | Sealed fixtures, independent expected prefixes, first-mismatch evidence, mutant kill matrix | No parity/cutover certificate. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:93-95] |
| P4 caller/target coverage | Writer inventory plus stale-successor and partial-mutation negative controls | No writer cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:94-96] |
| P5 contention and storage choice | Serializable schedules, throughput, and latency baseline | No truth-control cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:95-97] |
| P7 invalidation/effect recovery | Post-allow invalidation, timeout/reopen, stale-principal, and in-doubt effect drills | No consequence/effect cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:96-98] |
| Quality, latency, and cost benefit | Shadow baseline and canary deltas against legacy | This is not a business/performance certificate. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:97-100] |

More document-only iterations would not close these gaps; the next evidence must come from executable mutants, transactional race tests, shadow traces, and measured canaries. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:87-100]

## Twelve-Source Blog Corpus Triangulation

The blog corpus is supporting design evidence, not authority. It consistently favors typed edges, independent verification, narrow graphs, explicit barriers, isolation, bounded loops, and hybrid retrieval; it also contains advisory budgets, self-reported benchmarks, and claims that must not be promoted into runtime guarantees without executable evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md:7-58]

1. `Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md` supports trajectory-level verification, verifier negative controls, pinned judges, shadow rollout, and blast-radius gates; it explicitly says green evidence is not proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:64-88] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:109-180]
2. `From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md` supports graph width only for complex independent work and hybrid retrieval; it identifies simple/low-concurrency tasks and simple fact lookup as non-graph cases. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:11-25] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-196]
3. `Graph Engineering Roadmap.md` supports bounded node/edge contracts, deterministic transforms, real barriers, isolation, and convergent cycles; its worktree advice is isolation, not mutation-side fencing. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:22-95] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:195-239]
4. `Graph Engineering explained: what it is, when to use it and when not to.md` supports contract-shaped nodes, genuine dependency edges, independent verification, and explicit non-use for small, exploratory, tightly supervised, or truly sequential tasks. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:35-80] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:193-231]
5. `Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md` supports explicit entity/relation/provenance paths and cautious fact maintenance; its performance numbers remain candidate evidence, not runtime authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:230-280] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:330-372]
6. `Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md` supports fresh independent verifiers, pipeline-versus-barrier choice, layered fan-in, and hidden shared-resource edges; its workspace isolation still does not authorize a protected write. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:131-155] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:195-230]
7. `Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md` supports separating stable organization graphs from ephemeral work graphs and identifies routing, observability, and failure recovery as harness responsibilities; dynamic topology alone supplies no authority, fencing, budget, or approval proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:215-237]
8. `Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md` places permissions, durable state, tools, audit, and recovery in the harness and warns that graph structure cannot repair broken state or tools. This directly supports retaining the 036 authority plane beneath graph execution. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:4-22] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:82-117]
9. `How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md` supports hard iteration/time/cost stops, per-dimension verdicts, attempt history, human escalation, and adversarial failure tests; escalation must enter as a fresh authorized request in this design. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:76-123] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:128-156]
10. `How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md` supports staged parallelism, explicit validation, persisted cycles, and pre-run human review; it also explicitly identifies a stated `$30` budget as advisory rather than a hard kill switch. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:283-321] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:349-361]
11. `LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md` supports rule-first verification, bounded attempts, fresh adversaries, producer-neutral harnessing, and declared return shapes; the verifier is evidence, not authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:32-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:75-112]
12. `What is Graph Engineering.md` supports a small typed core, hybrid retrieval, temporal supersession, controlled edge vocabularies, and independent evaluation; it explicitly warns against graph-only retrieval and author-only benchmarks. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:140-180] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:184-235]

## Convergence and Stop Record

All P1-P7 questions are answered and no decision conflicts remain. The stop authority is the configured `maxIterations: 20`, not convergence telemetry; the final iteration's `newInfoRatio` is 0.46 and its remaining gaps are implementation/measurement gaps. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:119-139] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-config.json:9-29]
