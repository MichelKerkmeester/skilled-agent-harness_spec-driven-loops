# Iteration 018 — Versioned schemas, runtime seams, and staged adoption for P1–P7

## Focus

Convert the integrated and adversarial P1–P7 decisions into implementable versioned contracts for `.opencode/skills/system-deep-loop`, including exact owning modules, dependencies, migration behavior, compatibility posture, adoption order, and explicit boundaries where the contracts should not be adopted.

## Sources Consulted

- Repo 1 synthesis and delivery order: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-120`.
- Graphene orientation and repo-1 comparison: `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:1-180`.
- Integrated, corpus, parity, and adversarial passes: `iterations/iteration-014.md` through `iterations/iteration-017.md`.
- Existing reducer and dual-ledger primitives: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types.ts,authorization-replay.ts,deterministic-reducer.ts,transition-authorization-gateway.ts}`.
- Existing relation and convergence projections: `.opencode/skills/system-deep-loop/runtime/lib/{contradiction-supersession,coverage-graph}`.
- Existing commit protection and scheduling: `.opencode/skills/system-deep-loop/runtime/lib/{locks-and-fencing,branch-leases-waves,write-set-conflict-graph}`.
- Existing compatibility and parity infrastructure: `.opencode/skills/system-deep-loop/runtime/lib/{compatibility-shadow,shadow-parity,mixed-version-fixtures,deep-research-shadow-parity}`.
- 036 migration authority: `specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:174-301` and `008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:74-148`.

## Cross-contract wire rules

All new persisted or cross-module contracts use immutable `@1` identity strings, closed enums, canonical JSON bytes, SHA-256 digests, and snake-case wire fields. TypeScript may expose camel-case accessors only at an adapter boundary; persisted bytes retain the wire names. Unknown future schema or event versions fail closed. Additive readers may supply a default only when a mixed-version fixture proves that the omitted field had no semantic meaning in the old version. Reducer, projection, checkpoint, command, refusal, and trace versions remain independent identities; no implementation may infer one from another. This follows the existing event-envelope and mode-contract policy rather than creating a graph-local version regime. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/deterministic-reducer.ts:21-84`] [SOURCE: `specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:275-301`]

## P1 — Belief projection and convergence guard

**Repo-1 relation: REFINE Decision 8 and CONFIRM the evidence graph remains a projection.** Repo 1 separated evidence/knowledge projections from authority; Graphene adds executable four-valued premise state, while iteration 017 requires explicit termination proof and authority-disposition taint. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:85-95`] [SOURCE: `iterations/iteration-017.md:17-33`]

Adopt these schemas:

```ts
type BeliefTruthStateV1 = 'IN' | 'OUT' | 'BOTH' | 'NEITHER';

interface BeliefProjectionClaimV1 {
  claim_id: string;
  claim_version_id: string;
  purpose_id: string;
  truth_state: BeliefTruthStateV1;
  premise_usable: boolean;
  stale: boolean;
  fidelity: number;
  support_mode: 'all' | 'any';
  support_claim_ids: readonly string[];
  evidence_refs: readonly string[];
  source_identity_refs: readonly string[];
  valid_from: string | null;
  valid_until: string | null;
  observed_domain_sequence: number;
  contradiction_relation_ids: readonly string[];
  predecessor_claim_ids: readonly string[];
  terminal_successor_claim_id: string | null;
}

interface BeliefSettlementProofV1 {
  proof_version: 'belief-settlement-proof@1';
  support_graph_digest: string;
  transition_measure: 'monotone-four-state@1';
  work_items_processed: number;
  transition_bound: number;
  final_state_digest: string;
  verification_pass_changed: false;
  repeated_state_detected: false;
  quiescent: true;
}

interface BeliefProjectionV1 {
  projection_schema_version: 'belief-projection@1';
  reducer_version: string;
  projection_cut: ProjectionCutV1;
  authority_disposition: 'advisory' | 'selected-authority';
  authority_state: AuthorityState;
  authority_epoch: number;
  belief_admission_head: LedgerHead;
  claims: Readonly<Record<string, BeliefProjectionClaimV1>>;
  required_answer_paths: Readonly<Record<string, readonly string[]>>;
  convergence_blockers: readonly BeliefConvergenceBlockerV1[];
  settlement_proof: BeliefSettlementProofV1;
}
```

The implementation seam is a new `runtime/lib/belief-projection/` package with `types.ts`, `event-registry.ts`, `support-graph.ts`, `settlement.ts`, `reducer.ts`, `convergence-guard.ts`, and `index.ts`. It consumes verified claim/support/source events plus the existing immutable output of `contradiction-supersession/projection.ts`; it does not write that projection or `coverage-graph-db.ts`. `coverage-graph-signals.ts` gains an optional `beliefProjection` input and returns the new blockers before its existing density/coverage telemetry. The first consumer is deep research only, behind an explicit `authority_disposition === 'selected-authority'` guard; shadow projections are reportable but cannot vote STOP. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:581-630`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:171-209`] [INFERENCE: package names and field names are proposed seams consistent with current runtime package layout]

Dependencies are P2's verified `ProjectionCutV1`, the existing contradiction/supersession replay, the event-envelope canonicalizer, and a clean P5 belief-admission head. Migration is rebuild-only: old claims without support or purpose identity enter `NEITHER` and produce an explicit `legacy_support_unknown` blocker; they are never guessed `IN`. Existing contradiction-density metrics remain unchanged and authoritative legacy convergence continues until per-mode cutover. Do **not** adopt iterative settlement for a simple DAG that a single validated topological pass can evaluate, for modes with no derived premises, or for offline explanation that cannot affect control flow.

## P2 — Closed dual-ledger cut and disposable graph checkpoint

**Repo-1 relation: REFINE Decision 4.** Repo 1's checkpoint fields were correct but insufficiently explicit about independent domain/audit heads; iteration 017 proves the required invariant is authorization-reference closure, not equal heads. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:53-59`] [SOURCE: `iterations/iteration-017.md:34-44`]

Adopt:

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
```

Add `authorized-ledger/projection-cut.ts` to classify the audit prefix and verify every included domain frame's existing `authorization_ref` against the cut. Add `runtime/lib/graph-projection/{types,reducer-registry,checkpoint-store,rebuild,index}.ts`; it wraps, rather than weakens, `TypedReducerRegistry` and `rebuildProjection`. Every effective event in the closed range resolves to a versioned transition or an explicitly registered deterministic no-op. Checkpoint publication uses the existing transactional-projection/fenced-state-store boundary and is atomic only after repeat reduction and cut verification. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:16-76`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/deterministic-reducer.ts:43-135`] [INFERENCE: new module placement is derived from the current single-purpose runtime packages]

This is the first implementation dependency for P1, P3 checkpoints, P5 previews, and P7 gate context. Migration starts with no checkpoint: verify and replay genesis-to-head, publish a shadow checkpoint, discard it on any missing version/digest/closure proof, and never rewrite legacy JSONL or either ledger. Compatible readers may ignore denial classifications only when they make no claim of authorization completeness; they still verify each domain event's allow reference. Do **not** adopt `GraphCheckpointV1` for small streams where full replay is cheaper, and never compact committed domain or audit events merely because a checkpoint is fold-equivalent.

## P3 — Prefix parity and manifest-bound mutants

**Repo-1 relation: EXTEND Decision 6.** Repo 1 required normalized authorized traces; iterations 016–017 make each operation prefix and the comparator's sensitivity a first-class proof object. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:69-75`] [SOURCE: `iterations/iteration-016.md:14-58`]

Adopt `CrossAdapterTraceV1` with `trace_version`, case/manifest/base/build identities, adapter identity/version, authority state/epoch/disposition, sealed-input digest, closed normalization-policy identity, and ordered `prefixes[]`. Each `OperationPrefixV1` contains `prefix_index`, operation/correlation/causation IDs, semantic step key, request digest, audit decision/refusal reference, optional domain receipt and authorization reference, before/after `ProjectionCutV1`, projection/checkpoint digest, budget delta, effect-intent/receipt refs, artifact refs, terminal decision, and a `zero_mutation_assertion` for refused prefixes. `GoldenScenarioV1` declares required/forbidden event patterns, required fields, partial-order constraints, expected independent checkpoint digests, expected refusal/mutation/effect outcomes, and one or more `MutantExpectationV1 { mutant_id, single_defect, expected_divergence_class, earliest_prefix_index }`.

Own the generic contracts in `runtime/lib/shadow-parity/`; add prefix comparison and mutant-runner files beside its existing case/certificate code. Extend `mixed-version-fixtures/` for old/new trace cases. Use `deep-research-shadow-parity/harness-adapter.ts` as the pilot because it already binds sealed inputs, lifecycle events, projection fingerprints, receipts, budgets, artifacts, and terminal decisions. Independent expected checkpoints live in sealed fixture data and must not call the reducer under test. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/types.ts:1-180`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts:1-190`] [SOURCE: `specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:124-148`]

P3 depends on P2's cut verifier but precedes every control-path adoption: A1–A7 become blocking fixtures before the corresponding consumer can leave shadow mode. Existing terminal and legacy-byte observations remain required; prefix parity is additive, not a replacement. Do **not** use the full trace for UI rendering, token streaming, or transport performance tests whose differences are intentionally non-semantic; use the closed reversible normalization allowlist and never global sorting or broad field scrubbing.

## P4 — Claimant-addressed, target-complete mutation command

**Repo-1 relation: CONFIRM and REFINE Decision 2.** Repo 1 already required write-set admission plus mutation-side fencing; Graphene supplies the stale-successor counterexample that fixes the command's exact identity and commit seam. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33-41`] [SOURCE: `iterations/iteration-006.md:15-41`]

Adopt:

```ts
interface GraphMutationTargetV1 {
  resource_key: string;
  atomicity_domain: string;
  resource_digest: string;
  fence_token: number;
  expected_version: string | null;
  expected_ledger_head: LedgerHead | null;
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
  payload_digest: string;
  targets: readonly GraphMutationTargetV1[];
  wave_evidence: { wave_id: string; plan_fingerprint: string; authorization_id: string } | null;
}
```

Every target has exactly one expected-version form, targets are sorted and non-empty, and wave evidence cannot replace claim or target proof. Add a `commitGraphMutationV1` coordinator under `locks-and-fencing/` that resolves protected-resource registrations, enters the existing fenced store/ledger transaction, and validates claim, attempt, current resource fence, expected version/head, payload digest, and authority epoch at compare-and-mutate. `branch-leases-waves/types.ts` carries the command reference and accepted receipt, while `wave-plan.ts` and `write-set-conflict-graph` continue to own admission. Do not place commit authority in the graph reducer. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts:1-260`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/types.ts:1-240`] [INFERENCE: the coordinator name is proposed; the protected-store seam is observed]

P4 depends on existing fences/wave plans, P2 current heads, P3's takeover fixture, and a current gateway allow proof. Migration is per writer: first shadow-validate `@1` commands beside the legacy write, then fence one low-risk writer, then expand only after pause-after-preflight takeover tests pass. V0/node-addressed calls remain on the legacy authority path; the `@1` decoder refuses missing claimant/target fields instead of defaulting them. Do **not** require a fence for read-only projection queries or immutable content-addressed writes that cannot replace, append, alias, debit, or externally effect a protected resource.

## P5 — Serializable truth admission

**Repo-1 relation: EXTEND Decision 8.** Repo 1 preserved contradictions and temporal supersession; Graphene and iteration 017 show that safe projection also needs prospective fixed-point admission under one truth conflict domain. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:85-91`] [SOURCE: `iterations/iteration-017.md:45-55`]

Adopt `TruthAdmissionCommandV1 { command_version, operation_id, candidate_kind, candidate_digest, base_belief_admission_head, projection_cut, affected_claim_ids, declared_transitive_closure_digest, policy_digest }`, where `candidate_kind` is closed over claim/support/source-staleness/scope/contradiction/supersession/nogood changes. The preview result is `TruthAdmissionPreviewV1 { candidate_digest, base_head, hypothetical_projection_digest, settlement_proof, violated_nogood_sets, successor_conflicts, required_answer_blockers }`. Successful commit appends one authorized domain event and advances one `belief-admission` protected-resource version; refusal uses P6.

Place the serializable service in a new `runtime/lib/belief-admission/` package. It composes the pure P1 settlement engine and current contradiction/supersession event registry, then commits through P4. `contradiction-supersession/service.ts` becomes an adapter into this boundary for new writers; replay remains able to consume historical events. G8-equivalent full replay stays an independent corruption/import/reducer-drift backstop. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/{event-registry.ts,service.ts,projection.ts}`] [SOURCE: `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:38-48`] [INFERENCE: one belief-admission protected resource is the simplest current implementation of the serializable conflict domain]

Dependencies are P1 settlement, P2 cuts, P4 commit protection, P6 refusals, and P3 A2/A5 fixtures. Migration first replays all existing truth events into a head, runs G8/backstop validation, and quarantines a dirty base; it does not retroactively attribute legacy corruption to the first new candidate. New truth writers then dual-run preview before single-writing through the gateway. Do **not** adopt global serialization when a versioned manifest proves disjoint transitive support, successor, nogood, scope, and required-answer closures; direct-ID disjointness alone is not proof.

## P6 — Authority-zero actionable refusal

**Repo-1 relation: REFINE the failure-path boundary across Decisions 1–4.** Repo 1 required fail-closed transitions but did not define a reusable, non-command recovery object; Graphene supplies actionable alternatives and the adversarial pass removes their implied authority. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23-59`] [SOURCE: `iterations/iteration-017.md:56-64`]

Adopt:

```ts
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
  retry: { allowed: boolean; new_request_required: true; predicate_codes: readonly string[] };
}
```

The schema expressly forbids event payloads, capability material, allow proofs, fence tokens, executable callbacks/patches, effect intents, and reusable idempotency identities. Add `authorized-ledger/transition-refusal.ts` to map gateway decisions and boundary errors into the closed envelope. Add command-decoder guards in gateway, fenced writers, belief admission, and effect adapters so a refusal can never satisfy a command union. Durable audit references appear only after a gateway decision; deterministic local parse errors use ordinary typed errors and no fabricated denial. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:77-220`] [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:680-895`] [INFERENCE: a branded refusal/non-command decoder is required to machine-enforce the adversarial authority-zero rule]

P6 can land first because it is additive and supplies the refusal shape for P4/P5/P7. Compatibility adapters preserve current error codes and exit behavior while adding a semantic `outcome`; transport success never means transition success. Existing parity-certificate refusals remain their own schema and are not silently upcast. Do **not** persist a gateway denial for pure local validation that reached no policy/mutation boundary, and do not use an actionable refusal where an ordinary bounded typed error is sufficient.

## P7 — Fenced human gate with semantic dependency vector

**Repo-1 relation: EXTEND Decision 4.** Repo 1 already made human gates durable ledger entities; Graphene adds belief/consequence context, while iteration 017 closes the allow-to-append invalidation race. [SOURCE: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:53-59`] [SOURCE: `iterations/iteration-017.md:65-73`]

Adopt four contracts: `HumanGateContextSnapshotV1`, `GateSemanticDependencyVectorV1`, `HumanGateDecisionCommandV1`, and the event family `human_gate.opened@1|invalidated@1|reopened@1|edge_selected@1|timed_out@1`. The context snapshot binds gate/run/node/attempt IDs, exact question/options, consequence-map digest, sorted load-bearing belief rows with truth/support/staleness, evidence references, topology and policy digests, allowed principal/group assignments, gate version/fence, context epoch, expiry, and display digest. The dependency vector separately binds belief-admission head, evidence head/digest, topology version/digest, consequence version/digest, assignment version/digest, policy version/digest, domain head, audit head, authority epoch, and gate fence. The decision command binds an authenticated principal/capability, selected option, observed gate version/fence/context epoch, the exact dependency-vector digest, a command idempotency key, and a fresh authorization request; it is not an effect command.

Create `runtime/lib/human-gates/{types,event-registry,context-projection,service,index}.ts`. The service opens/reopens through the gateway, validates positive identity using the existing gateway resolver, and commits `edge_selected@1` through P4. The protected mutation atomically compares gate version/fence and the declared semantic vector after allow; any load-bearing invalidation must advance the guarded gate context version before the old decision can append. Only the committed edge may seed a separately authorized effect intent through `receipts-and-effect-recovery/effect-gateway.ts`. Timeout is its own fenced system transition and never synthesizes a human principal. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-823`] [SOURCE: `iterations/iteration-013.md:7-25`] [INFERENCE: a shared human-gates package is absent today and should own the cross-mode contract rather than a mode reducer]

P7 is last among the control contracts: it depends on P1 live belief context, P2 cuts, P3 A7 schedules, P4 commit fencing, P5 current belief-admission head, P6 refusals, and effect recovery. Migration inventories existing wait/approval surfaces but does not reinterpret old approvals as `@1` decisions. Pilot one non-effectful, reversible deep-research edge in shadow; only later enable consequence edges, then effect intents, and only mode-by-mode under 036 cutover. Do **not** adopt the full gate vector for informational acknowledgements, display-only choices, or interactions with no consequence edge, mutation, budget, or effect; a simple receipt is safer and cheaper.

## Dependency and staged-adoption order

| Stage | Deliverable | Authority posture | Exit evidence |
|---|---|---|---|
| 0 | Freeze `@1` schemas, registries, canonical fixtures, and version ownership | No writers or consumers | Unknown/future versions fail closed; mixed-version inventory complete |
| 1 | P6 refusal envelope and P2 cut verifier/rebuild/checkpoint library | Additive, read-only; legacy authoritative | Dual-head closure negatives and rebuild determinism pass |
| 2 | P3 prefix trace, independent checkpoints, and A1–A7 mutant corpus in deep-research parity | Shadow-only | Every mutant fails at its declared earliest prefix; no live effects |
| 3 | P1 belief projection and convergence blocker emission | Advisory shadow; existing STOP remains authoritative | Rebuild parity, quiescence proof, and consumer authority-taint tests pass |
| 4 | P4 claimant/target-complete commit coordinator for one reversible writer | New path shadow-validates; legacy single-writes | Pause/takeover/resume rejects stale writer at atomic seam |
| 5 | P5 serializable truth admission and G8 replay backstop | New truth writers gated; old history replay-only | Both same-base winner orders pass; dirty base quarantines |
| 6 | P7 non-effectful gate, then consequence edge, then separately authorized effect | One mode, reversible authority window | Decision/invalidation/timeout/reopen schedules and effect recovery pass |
| 7 | Opt-in P1 convergence control and broader P4/P5/P7 writers | Per-mode `new_authoritative_reversible` only | Current parity certificate, rollback drill, measured latency/cost, zero unresolved divergence |
| 8 | Final per-mode cutover or rejection | Governed 036 CAS; never fleet-wide inference | Acceptance certificate and retained legacy rollback/archival reader |

This order deliberately places schema/cut/refusal/parity foundations before control. P1 may shadow before P5, but it must not become a selected-authority convergence input until P5 prevents unsafe new truth states. P7 is last because it composes every other boundary and can authorize consequence-bearing edges. A failed stage leaves the previous authority owner and readers intact; rollback changes authority epoch, fences writers, preserves both ledgers, and never downcasts or deletes history. [SOURCE: `specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/transition-versioning-and-rollback-policy.md:282-299`]

## Findings

1. **REFINE repo 1 — P1 is one derived package, not an expansion of the coverage graph.** `belief-projection/` composes verified relation history and emits premise blockers; the coverage graph remains diagnostic and non-authoritative. [SOURCE: repo-1 Decisions 5 and 8; current `coverage-graph-signals.ts`] [INFERENCE: package placement]
2. **REFINE repo 1 — P2's smallest safe replay identity is a reference-closed dual-ledger cut.** `ProjectionCutV1` becomes the shared dependency for checkpoints, parity, admission previews, and human context. [SOURCE: `authorized-ledger-types.ts:16-76`] [INFERENCE: closure digest and classification schema]
3. **EXTEND repo 1 — P3 must land before any control consumer.** The shipped deep-research parity adapter is the lowest-friction pilot for prefix traces and A1–A7 mutants. [SOURCE: `deep-research-shadow-parity/harness-adapter.ts:1-190`] [INFERENCE: pilot selection]
4. **CONFIRM repo 1 — P4 belongs at the protected store, not in scheduling or reduction.** Claim/wave evidence admits work; only target-complete commit-time CAS rejects a stale worker. [SOURCE: repo-1 Decision 2; `locks-and-fencing/fenced-state-store.ts`]
5. **EXTEND repo 1 — P5 requires one explicit belief-admission version before truth control is enabled.** Historical relation events stay replayable, but all new truth-affecting writers share the prospective closure boundary. [SOURCE: Graphene fold/G8 gap in `orientation.md:38-48`] [INFERENCE: protected-resource implementation]
6. **REFINE repo 1 — P6 is the first safe additive schema.** Its authority-zero/non-command shape can stabilize recovery without moving writers, readers, or authority. [SOURCE: `transition-authorization-gateway.ts:680-895`] [INFERENCE: staged placement]
7. **EXTEND repo 1 — P7 must be adopted last and incrementally.** A non-effectful shadow gate precedes consequence edges, which precede separately authorized effects; informational acknowledgements never need this machinery. [SOURCE: repo-1 Decision 4; iterations 012–013 and 017] [INFERENCE: migration order]

## Ruled Out / Do Not Adopt

- A graph-local event envelope, authority state machine, checkpoint truth source, or version inference.
- Retrofitting `coverage-graph-db.ts` into a truth/admission store.
- Publishing a partially settled belief state after a round bound.
- Replacing current mode reducers or legacy readers before prefix parity and rollback evidence.
- Using a global trace sort, reducer-generated oracle, or positive-only golden fixture.
- Accepting a node-only mutation, preflight-only fence check, or wave authorization as commit authority.
- Retrofitting historical contradictions/nogoods by mutation or blaming a new candidate for a dirty base.
- Treating a refusal action, human choice, checkpoint, projection, or allow proof as an executable effect capability.
- Imposing the graph stack on direct deterministic transforms, small replays, simple topological truth, read-only immutable writes, or informational acknowledgements.

## Assessment

- **newInfoRatio:** 0.71
- **Novelty justification:** P1–P7 semantics were already settled, but this pass adds the concrete `@1` wire fields, owning runtime packages, explicit dependency DAG, compatibility/migration rules, a reversible eight-stage adoption sequence, and per-contract non-adoption boundaries.
- **Questions addressed:** P1, P2, P3, P4, P5, P6, P7.
- **Questions answered:** all seven now have implementable schema and seam decisions; performance thresholds and rollback kill-switch details remain deliberately assigned to the next focus.
- **Confidence:** high for module adjacency, authority ordering, and compatibility posture because they reuse shipped 036 packages; medium-high for new file and field names, which are proposed implementation contracts rather than observed code.

## Reflection

- **What worked:** mapping each contract to one existing ownership boundary prevented the graph projection, scheduler, gateway, and effect system from collapsing into a second authority.
- **What failed:** a single “graph runtime v1” migration would combine read-model, writer, truth-admission, human, and effect risks and would be neither independently reversible nor certifiable.
- **Key implementation constraint:** no stage may silently reclassify a shadow projection, old approval, legacy refusal, checkpoint, or diagnostic metric as selected authority.

## Recommended Next Focus

When-not-to-use boundary matrix and rollback/kill-switch analysis
