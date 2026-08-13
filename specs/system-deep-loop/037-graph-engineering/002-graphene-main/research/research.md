# Graph-Based Deep-Loop: Graphene-Main Synthesis (Repo Study 2)

## Grounding (terms and sources)

- **036 / authority plane** — a separate, in-flight program (packet `036-deep-loop-innovation`) that is the sole authority for state change: an append-only typed event ledger behind a fail-closed transition-authorization gateway, with sealed artifacts, side-effect receipts, monotonic fences, and blinded adjudication. A **transition** is any state-changing step; the graph may propose one, but only 036 admits it and records history.
- **graphene-main** — the reference implementation studied here: a Rust workspace (crates `graphene-core`, `graphene-exec`, `graphene-store`, `graphene-check`, `graphene-server`, `graphene-cli`) that coordinates a work graph through a SQLite event log plus a deterministic fold, with an integrated four-valued belief/truth-maintenance layer. It records topology, claims, outputs, beliefs, and human decisions; it executes no work itself.
- **P1–P7** — the seven prioritized research angles from `orientation.md`; the body sections below are labeled `P1`–`P7`. Repo-1's own decisions are labeled `Decision 1`–`Decision 8` in the comparison table only.
- **Citation traceability** — every `[SOURCE: iteration-NNN.md:…]` resolves to a per-iteration narrative in this packet's lineage; those iterations in turn cite graphene primary source (e.g. `crates/graphene-core/src/fold.rs`, `graphene-exec/src/lib.rs:450-515`). "OBSERVED-IN-CODE" claims are therefore code-grounded one hop through the cited iteration.
- **Status** — this is a DESIGN-level synthesis. All schema and package names are proposed contracts, not shipped runtime APIs; the run stopped at `maxIterationsReached`, not convergence.

## Executive Decision

Keep repo study 1’s controlling architecture: a versioned compiled work graph proposes transitions over the seven-plane design, while the 036 authority plane alone admits transitions, appends history, fences mutations, authorizes effects, records denials, and governs cutover. Graphene does not justify a replacement authority stack. It hardens seven parts repo 1 left underspecified into proposed (not-yet-shipped) contracts: truth-maintaining beliefs, closed replay cuts, causal-prefix parity, claimant-addressed mutation, serializable truth admission, authority-zero refusals, and live-context human gates. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:69-79]

Graphene’s strongest contribution is executable negative knowledge. Its four-valued beliefs and cascades show how convergence can depend on the status of a required premise rather than aggregate contradiction density. Its event fold shows how graph state can be disposable. Its structured refusals and consequence-bearing human nodes improve recovery and explanation. Its transactional claims improve admission. None of those mechanisms independently authorizes a 036 transition. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-014.md:7-74]

Graphene also supplies counterexamples that tighten the target design. Fold-equivalent compaction destroys authority history. Production supersession bypasses the repository’s own semantic-time comparator. Nogoods are detected after admission rather than refused before it. Several golden fixtures prove filenames or final snapshots rather than the advertised behavior. `done(node, ...)` omits claimant identity and mutation fencing. Human choices lack the dependency-vector revalidation required between allow and consequence append. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:11-25]

The result is an implementation design, not a cutover certificate. P1–P7 are resolved at design-decision level. Promotion still requires executable mutants, race tests, independent prefix oracles, shadow traces, rollback drills, and measured quality, latency, and cost baselines. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:87-118]

## What Graphene Confirms / Refines / Extends / Contradicts

| Repo-1 decision | Graphene verdict | Authoritative delta |
|---|---|---|
| Graph projection over the 036 authority plane | **CONFIRMS and REFINES** | A pure event fold is the right disposable projection model. Projection validity or freshness still cannot select authority; every control consumer must verify the governed authority state and epoch. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:9-21] |
| Decision 1 — Typed executable graph IR | **CONFIRMS** | Typed nodes, bindings, dependencies, budgets, and deterministic folds support repo 1’s closed IR. P1–P7 extend runtime contracts beneath that IR; they do not replace `GraphDefinitionV1`, port typing, readiness modes, or graph compilation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:69-72] |
| Decision 2 — Scheduler, reducers, and safe waves | **CONFIRMS repo-1 lease-insufficiency; REFINES it into an exact commit API; CONTRADICTS Graphene's revoked-claim guarantee** | Graphene contributes transactional read-set and claim admission. Its node-addressed mutation APIs prove that claim-time exclusivity is insufficient — confirming repo 1's rule that leases alone are not enough, and contradicting Graphene's own documented revoked-claim safety. Every protected commit needs exact claimant identity, per-resource monotonic fences, expected versions or heads, and atomic revalidation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-006.md:13-41] |
| Decision 3 — Verdicts as structural control edges | **CONFIRMS and EXTENDS** | Consequence-bearing choices confirm that a verdict must select a declared edge. `TransitionRefusalV1` adds a typed negative outcome, while P7 binds human edge selection to current belief, topology, policy, principal, version, and fence state. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:7-35] |
| Decision 4 — Replay, effects, and human gates | **REFINES and EXTENDS; CONTRADICTS compaction** | Replay must use a reference-closed domain/audit cut and disposable checkpoints. Committed authority histories are not compactable by fold equivalence. Human edge selection and external effect intent remain separately authorized transitions. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-013.md:7-49] |
| Decision 5 — Loops as typed subgraphs | **REFINES** | Belief state can block a proposed terminal transition, but convergence remains mode-specific and becomes another 036 transition intent. A belief reducer cannot terminate a loop directly. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-014.md:62-70] |
| Decision 6 — Behavioral parity | **STRONGLY EXTENDS** | Exact final snapshots are necessary but insufficient. Parity becomes an ordered causal-prefix contract with independent checkpoints, explicit refusal non-mutation, semantic timing schedules, closed normalization, and pinned single-defect mutants. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:7-58] |
| Decision 7 — Organization and work graphs | **CONFIRMS; NO REPLACEMENT** | Graphene supplies a per-work coordinator, not a versioned organization-policy graph. Dynamic topology, belief state, or claimability cannot mint capability, budget, access, or authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md:7-35] |
| Decision 8 — Hybrid evidence and knowledge routing | **EXTENDS and PARTLY CONTRADICTS** | Four-valued truth, source identity, temporal supersession, and prospective nogood admission make the evidence projection executable. Graphene’s production supersession and nogood paths are too weak to copy. Retrieved paths remain evidence candidates, never authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md:37-58] |

## P1 — Purpose-Bound Truth-Maintaining Convergence

**Verdict: REFINE repo-1 Decisions 5 and 8; EXTEND them with executable truth maintenance.**

**OBSERVED-IN-CODE.** Graphene separates `IN`, `OUT`, `BOTH`, and `NEITHER`; only `IN` and non-stale beliefs are usable premises. Its fold propagates contradiction, withdrawal, and source staleness through dependent beliefs. This is materially stronger than treating contradiction as a global edge-density statistic. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-001.md:7-26]

**OBSERVED-IN-CODE.** Graphene’s bounded settlement loop can terminate after its round cap while changes remain pending. Deterministic iteration order does not prove quiescence. Publishing that last pass could make convergence depend on insertion order or an admitted support cycle. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:15-21]

**DESIGN DECISION.** Adopt a disposable, purpose-bound `BeliefProjectionV1`. Keep truth, staleness, fidelity, provenance, source identity, support, contradiction, validity, and supersession orthogonal. Require a checked settlement proof. Require an explicit selected-authority disposition before any consumer may use the result for STOP, dispatch, gate selection, or mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:18-80] [INFERENCE: the schema and package names are proposed implementation contracts, not shipped runtime APIs]

```ts
type BeliefTruthStateV1 = 'IN' | 'OUT' | 'BOTH' | 'NEITHER';

interface BeliefProjectionClaimV1 {
  claim_id: string;
  claim_version_id: string;
  purpose_id: string;
  truth_state: BeliefTruthStateV1;
  premise_usable: boolean; // true only for IN && !stale
  stale: boolean;
  fidelity: number;
  support_mode: 'all' | 'any';
  support_claim_ids: readonly string[];
  source_identity_refs: readonly string[];
  evidence_refs: readonly string[];
  valid_from: string | null;
  valid_until: string | null;
  contradiction_relation_ids: readonly string[];
  terminal_successor_claim_id: string | null;
}

interface BeliefSettlementProofV1 {
  proof_version: 'belief-settlement-proof@1';
  support_graph_digest: string;
  transition_measure: 'monotone-four-state@1';
  transition_bound: number;
  work_items_processed: number;
  verification_pass_changed: false;
  repeated_state_detected: false;
  quiescent: true;
  final_state_digest: string;
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

The settlement algorithm must validate referenced-node closure and support-graph acyclicity, process a stable worklist, track a declared monotone transition measure, detect repeated whole-state digests, and run a final no-write verification pass. A cycle, oscillation, repeated state, unknown rule, pending change, or exhausted bound makes the projection unavailable; it does not publish a partial answer or STOP vote. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:15-21]

A required question is answered only when its selected terminal claim has a usable premise path. `BOTH`, `NEITHER`, staleness, missing terminal successors, and policy-defined fidelity failures become typed blockers. Non-load-bearing disagreement remains visible but does not block convergence. Novelty, coverage, diversity, and source-quality checks run only after this guard passes. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-001.md:18-31]

**Exact insertion point.** Add `runtime/lib/belief-projection/{types.ts,event-registry.ts,support-graph.ts,settlement.ts,reducer.ts,convergence-guard.ts,index.ts}`. Consume verified claim/support/source events and the immutable output of `runtime/lib/contradiction-supersession/projection.ts`. Add an optional belief input to `runtime/lib/coverage-graph/coverage-graph-signals.ts`; do not turn `coverage-graph-db.ts` into a truth store. Pilot deep research in advisory mode before any selected-authority use. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:61-80] [INFERENCE: module placement follows the existing single-purpose runtime package boundaries]

## P2 — 036-Ledger-to-Graph Fold and Audit-Preserving Replay

**Verdict: REFINE repo-1 Decision 4; CONTRADICT Graphene’s authority-log compaction.**

**OBSERVED-IN-CODE.** Graphene’s event fold is deterministic, ordered by store sequence, independent of wall time, rebuildable, and suitable for point-in-time projection. Its cache is disposable. Its `compact()` operation nevertheless deletes committed events after establishing current-fold equivalence. That preserves present state, not prior projections, denials, authorization provenance, causal history, or replay fingerprints. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:7-31]

**DESIGN DECISION.** `GraphProjectionReducerV1` consumes only verified 036 domain events. Its exact dispatch identity is event type, effective event version, and graph-reducer version. Every event in the covered range resolves to a typed transition or an explicitly registered deterministic no-op. Wall-clock fields remain query metadata and never determine replay order. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:17-23]

The projection cut is a closure relation over two independently sequenced ledgers. Equal domain and audit sequence numbers are neither required nor meaningful. Every included domain event must resolve its authorization reference within the selected audit cut. Audit entries are classified as applied allows, unapplied allows, or denials without being folded into domain state. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:29-34]

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

Checkpoint acceptance requires cut closure, exact reducer/upcaster/canonicalizer identity, checksum validation, replay-fingerprint validation, repeat reduction, and canonical digest equality. Any missing historical implementation, unknown version, corrupt reference, nondeterminism, or same-version code drift discards the checkpoint and replays from genesis. Publication is atomic; partial rebuild output is not served as trusted state. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-003.md:17-31]

Committed domain and authorization-audit frames are never deleted because a projection is fold-equivalent. Safe garbage collection is limited to disposable projections, indexes, caches, and redundant checkpoints. Byte-preserving export is only a copy until a separately governed storage migration proves canonical-byte recovery, hash-chain continuity, authorization linkage, and retained-reader parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-003.md:31-35]

**Exact insertion point.** Add `runtime/lib/authorized-ledger/projection-cut.ts` and `runtime/lib/graph-projection/{types.ts,reducer-registry.ts,checkpoint-store.ts,rebuild.ts,index.ts}`. Wrap the existing typed reducer and replay contracts. Do not create a graph-local ledger, event envelope, authority state machine, or compaction policy. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:81-123] [INFERENCE: module placement is proposed; ownership by the authorized-ledger and projection packages is the settled boundary]

## P3 — Adversarial Causal-Prefix Parity

**Verdict: REFINE and EXTEND repo-1 Decision 6.**

**OBSERVED-IN-CODE.** Graphene’s golden runner compares exact final folded states and checks full versus incremental replay. Those are useful determinism checks. They are not independent semantic oracles. The required-fixture test checks filenames rather than event patterns; `claim-lease`, `nogood`, `out-of-order`, and `human-timeout` do not fully exercise their advertised mechanisms. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-004.md:13-32]

**DESIGN DECISION.** `CrossAdapterTraceV1` is an ordered sequence of operation prefixes. Each prefix joins the request, authorization or commit-guard decision, outcome or refusal, accepted event range, before/after cuts, independent projection checkpoint, budget delta, effect state, and artifacts. Terminal equality cannot clear an earlier causal mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:7-33]

```ts
interface CrossAdapterTraceV1 {
  trace_version: 'cross-adapter-trace@1';
  case_id: string;
  manifest_digest: string;
  base_digest: string;
  build_digest: string;
  sealed_input_digest: string;
  adapter: { id: string; version: string; contract_digest: string };
  authority_state: AuthorityState;
  authority_epoch: number;
  normalization_policy_digest: string;
  prefixes: readonly OperationPrefixV1[];
  comparison: {
    equivalent: boolean;
    earliest_mismatch: {
      class: string;
      prefix_index: number;
      stage: string;
      component: string;
    } | null;
  };
}

interface OperationPrefixV1 {
  prefix_index: number;
  operation_id: string;
  correlation_id: string;
  causation_id: string | null;
  request_digest: string;
  audit_decision_ref: AuthorizationReference | null;
  refusal: TransitionRefusalV1 | null;
  accepted_domain_range: readonly [number, number] | null;
  cut_before: ProjectionCutV1;
  cut_after: ProjectionCutV1;
  checkpoint_digest: string;
  budget_delta_digest: string;
  effect_observation_digest: string;
  zero_mutation_assertion: boolean;
}

interface MutantExpectationV1 {
  mutant_id: string;
  single_defect: string;
  expected_divergence_class: string;
  earliest_prefix_index: number;
}
```

Accepted prefixes require the exact allow reference, contiguous domain range, effective event identities, causation, and before/after heads. Refused prefixes require zero domain, projection, budget, and effect mutation. A gateway denial additionally requires one linked non-domain audit append. A local compiler or commit-guard refusal must not forge a gateway decision. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-005.md:17-42]

Normalization is a closed, versioned, reversible allowlist. Transport IDs, sandbox roots, raw record time, token chunks, and presentation prose may be mapped when the manifest declares them non-semantic. Actor, capability, policy, authority epoch, claim, fence, semantic deadline, observed-world time, causation, refusal, budget, effect, and checkpoint identity may not be scrubbed. Missing required observations fail as `missing-observation`. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:24-39]

Nondeterminism is represented only by a manifest-declared partial order over operations proven disjoint in read, write, effect, budget, gate, claim, head, and policy domains. Whole-trace sorting is forbidden. Every allowed schedule must still satisfy its own legal prefix outcomes. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:34-48]

The blocking adversarial corpus is:

| Mutant | Schedule | Required earliest failure |
|---|---|---|
| A1 — projection authority leakage | A fresher shadow belief projection disagrees with selected legacy authority | Consumer authority guard before STOP or dispatch. |
| A2 — non-quiescent settlement | Admit a cycle, oscillating rule, or insufficient transition bound | Reducer failure before checkpoint publication. |
| A3 — stale claimant | Pause C1 after preflight; revoke; commit C2; resume C1 | Protected-store claim/fence/version guard; zero stale mutation. |
| A4 — open dual-ledger cut | Include a domain event whose allow is beyond the audit cut | Cut-closure verification before checkpoint acceptance. |
| A5 — truth admission race | Supersession and nogood-affecting writers preview one base | Second serializable truth-admission commit. |
| A6 — executable refusal | Feed advisory repair into command or effect adapter | Command decoder or authorization boundary. |
| A7 — stale human allow | Change belief, topology, assignment, or policy after allow and before edge append | Gate dependency/fence commit guard; zero edge/effect mutation. |

The schedules and earliest-failure requirements are frozen by the terminal adversarial audit. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:71-81]

**Exact insertion point.** Extend `runtime/lib/shadow-parity/` with prefix comparison, semantic manifests, independent checkpoints, schedule execution, and a mutant runner. Add mixed-version cases under `runtime/lib/mixed-version-fixtures/`. Pilot through `runtime/lib/deep-research-shadow-parity/harness-adapter.ts` with isolated roots and suppressed dark effects. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:124-132] [INFERENCE: deep-research is the proposed pilot because its parity adapter already exposes the required lifecycle, budget, artifact, and terminal boundaries]

## P4 — Claim-and-Fence Mutation Safety; Waves Remain Conditional

**Verdict: CONFIRM and REFINE repo-1 Decision 2; CONTRADICT Graphene’s documented revoked-claim guarantee.**

**OBSERVED-IN-CODE.** Graphene assigns stable claim IDs and validates claims transactionally. `done`, `renew`, `release`, and `checkpoint` nevertheless accept a node and resolve or detect whichever claim is currently active. `done` accepts no claim ID, attempt version, session, or fence. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-006.md:7-35]

**INFERRED SAFETY FAILURE.** C1 can expire or be revoked, C2 can reclaim the node, and stale C1 can call `done(node, old_output)`. The check sees an active claim because C2 exists, but the mutation cannot distinguish C1 from C2. The SQL transaction prevents interleaving; it cannot recover missing claimant identity. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-006.md:13-25] [INFERENCE: the stale-successor execution follows directly from the observed public mutation signature and active-claim predicate]

**DESIGN DECISION.** Every claim-derived mutation is claimant-addressed and target-complete.

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
  authority_epoch: number;
  payload_digest: string;
  targets: readonly GraphMutationTargetV1[];
  wave_evidence: {
    wave_id: string;
    plan_fingerprint: string;
    authorization_id: string;
  } | null;
}
```

The protected store must atomically revalidate exact claimant identity, attempt, authority epoch, idempotency identity, every current fence, every expected version or ledger head, the complete target set, and the transition rule. A mismatch changes no domain state, projection, checkpoint, budget, or effect state. Claim identity answers which attempt owns the work. The monotonic fence answers which resource epoch may mutate. The expected version or head prevents same-epoch lost updates. All three are required. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-007.md:7-59]

Multiple fences exclude stale writers but do not create crash atomicity across independent stores. The preferred commit is one authorized ledger transition under the complete target proof, followed by rebuilt projections and separately authorized effect intents. A direct multi-store mutation is allowed only when one backend transaction proves all comparisons and writes are atomic. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-007.md:35-46]

Graphene read sets, deterministic readiness, claimability, and stable claim IDs may propose wave candidates. They do not unblock an unsafe or rejected write wave. Wave admission still requires immutable membership, complete canonical read/write sets, alias closure, conflict analysis, predecessor proof, authorization, and fences for every protected target. Every later mutation revalidates its claimant and target proof. A rejected wave must be recomputed and reauthorized at current state; no Graphene claim or readiness result can bypass that boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-007.md:47-70]

**Exact insertion point.** Add a `commitGraphMutationV1` coordinator under `runtime/lib/locks-and-fencing/`. Carry command and receipt references through `runtime/lib/branch-leases-waves/types.ts`. Leave wave-plan compilation and conflict admission in `branch-leases-waves` and `write-set-conflict-graph`; do not place commit authority in the scheduler or graph reducer. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:134-168] [INFERENCE: coordinator naming is proposed; the protected-store ownership boundary is settled]

## P5 — Temporal Supersession and Serializable Truth Admission

**Verdict: EXTEND repo-1 Decision 8; CONTRADICT Graphene’s production supersession and nogood admission.**

**OBSERVED-IN-CODE.** Graphene has an observation-time comparator in which sequence breaks equal-time ties. Its production supersession fold does not use that helper. It unconditionally links the proposed successor and closes the predecessor using record time. Its advertised out-of-order fixture has monotonically increasing observation and arrival times and contains no supersession event. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:7-24]

**DESIGN DECISION.** Semantic successor ordering uses:

```text
ObservationOrderKey = (observed_at, authorized_sequence)
```

`observed_at` is primary. Authorized sequence breaks equal-time ties and remains the sole replay order. Validity is half-open over the same composite key. A late older observation remains immutable audit evidence but cannot displace the active terminal successor. Missing observation time must be explicitly imputed; it cannot silently inherit receipt time. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:7-31]

Supersession admission previews the effective relation graph before sequence allocation. It rejects self-relations, missing claims, non-increasing successors, cycles, and competing active successors. Replacement proceeds from the active terminal or after an explicit withdrawal. Last-write-wins repair is forbidden. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:25-44]

**OBSERVED-IN-CODE.** Graphene’s `BELIEF_ADD` path does not check active nogoods. Nogood insertion sorts and stores members without enforcing prospective truth closure. G8 detects an all-`IN` set after admission, and the golden fixture successfully records a nogood over already-`IN` beliefs. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:45-64]

**DESIGN DECISION.** Every truth-affecting candidate previews from one exact, clean belief-admission head, applies the canonical candidate in isolation, and runs the same settlement engine to a checked fixed point. It refuses a candidate that creates a non-increasing successor, cycle, competing successor, unusable required answer, or completed nogood. It allocates no domain sequence during preview. The clean proof is valid only at the serialized base head used by the protected commit. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-009.md:7-89]

```ts
interface TruthAdmissionCommandV1 {
  command_version: 'truth-admission-command@1';
  operation_id: string;
  candidate_kind:
    | 'claim'
    | 'support'
    | 'source-staleness'
    | 'scope'
    | 'contradiction'
    | 'supersession'
    | 'nogood';
  candidate_digest: string;
  base_belief_admission_head: LedgerHead;
  projection_cut: ProjectionCutV1;
  affected_claim_ids: readonly string[];
  declared_transitive_closure_digest: string;
  policy_digest: string;
}

interface TruthAdmissionPreviewV1 {
  candidate_digest: string;
  base_head: LedgerHead;
  hypothetical_projection_digest: string;
  settlement_proof: BeliefSettlementProofV1;
  violated_nogood_sets: readonly string[];
  successor_conflicts: readonly string[];
  required_answer_blockers: readonly string[];
}
```

All truth, support, staleness, scope, contradiction, supersession, and nogood writers share one serializable belief-admission head unless a versioned manifest proves disjoint transitive support, successor, nogood, scope, and required-answer closures. Direct-ID disjointness is insufficient. G8-like full replay remains an independent corruption, import, legacy, and reducer-drift backstop; it is not normal append-then-compensate control flow. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:35-42]

**Exact insertion point.** Add `runtime/lib/belief-admission/{types.ts,preview.ts,service.ts,event-registry.ts,index.ts}`. Compose the pure P1 settlement engine with current contradiction/supersession events. Route new writes from `runtime/lib/contradiction-supersession/service.ts` through this boundary and commit through P4. Preserve historical relation replay unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:169-179] [INFERENCE: one belief-admission protected resource is the proposed first implementation of the required serializable conflict domain]

## P6 — Authority-Zero Actionable Refusal

**Verdict: REFINE and EXTEND repo-1 failure paths.**

**OBSERVED-IN-CODE.** Graphene makes refusal an expected result with a stable code, typed detail, a human reason, and a mandatory alternative. This is more actionable than an unstructured exception. Some suggestions nevertheless collapse materially different authority requirements, and transport success can be mistaken for transition success. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-010.md:7-49]

**DESIGN DECISION.** `TransitionRefusalV1` is a non-command response linked to the boundary that rejected an attempt.

```ts
interface TransitionRefusalV1 {
  refusal_version: 'transition-refusal@1';
  outcome: 'refused';
  authority: 'none';
  code: string;
  boundary:
    | 'compile'
    | 'authorization'
    | 'claim'
    | 'fence'
    | 'budget'
    | 'belief-admission'
    | 'human-gate'
    | 'effect';
  request_digest: string;
  detail_schema: string;
  detail: JsonObject;
  observed_heads: readonly LedgerHead[];
  audit_decision_ref: AuthorizationReference | null;
  advisory_actions: readonly {
    action_kind: string;
    prerequisite_codes: readonly string[];
  }[];
  retry: {
    allowed: boolean;
    new_request_required: true;
    predicate_codes: readonly string[];
  };
}
```

The schema cannot contain a command payload, capability, allow proof, lease, reusable fence, effect intent, executable callback, auto-applicable patch, or transferable idempotency identity. Advice describes how to form a future request. It never grants that request. Unknown schema versions, codes, boundaries, and detail variants remain renderable but fail closed for automation. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:43-50]

Retryability is code-owned, not a Boolean guessed by callers. Compile defects require changed proposal or compiler inputs. Stale claims, fences, heads, and versions require refresh, recomputation, a new request, and full reauthorization. Budget failures require governed allocation or scope change. Human and belief failures require named prerequisite changes. `already-applied` means verify the receipt. In-doubt effects enter recovery and must not re-execute. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-011.md:7-77]

Persistence boundaries remain distinct:

- The refusal response is non-authoritative.
- A gateway denial creates exactly one immutable non-domain audit decision.
- Compiler and local guard refusals do not fabricate an audit decision.
- Bounded telemetry may record the stable code and observed digests.
- The refused domain transition, budget debit, and effect do not occur.

[SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-011.md:59-77]

**Exact insertion point.** Add `runtime/lib/authorized-ledger/transition-refusal.ts`. Add decoder guards at the transition gateway, fenced writers, belief-admission service, human-gate service, and effect adapters so a refusal cannot satisfy any command union. Preserve current error codes and transport behavior during additive rollout. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:180-205] [INFERENCE: the branded non-command decoder is the proposed enforcement mechanism]

## P7 — Durable Human Gates over Live Belief Context

**Verdict: REFINE and EXTEND repo-1 Decision 4.**

**OBSERVED-IN-CODE.** Graphene human nodes declare a question, options, belief IDs, consequences, and an explicit `wait|expire|escalate` timeout. Choice selects declared dependents and skips alternatives. Silence does not mean approval. These are strong local fold semantics. The current event and decision shapes do not bind gate version, principal, belief/evidence/topology digest, authority epoch, idempotency identity, or mutation fence. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:7-47]

**DESIGN DECISION.** Opening a gate records a bounded, policy-filtered `HumanGateContextSnapshotV1` containing:

- exact question and stable option IDs;
- option-to-consequence-edge map;
- load-bearing belief IDs and terminal successors;
- `IN|OUT|BOTH|NEITHER`, staleness, fidelity, support, contradiction, and evidence references;
- explicit missing and redacted markers;
- topology, consequence-map, evidence, and belief digests;
- allowed principals/groups and capability policy;
- domain and audit cuts;
- reducer and policy identities;
- gate version, context epoch, fence, opening time, expiry, and timeout edge.

A display snapshot explains what the person saw. It is not permanent authority. `contextSnapshotFresh` is distinct from each belief’s truth and staleness. Any declared semantic dependency change invalidates the outstanding decision context; cosmetic or non-load-bearing changes do not. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:7-33]

```ts
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
  context_epoch: number;
  expires_at: string;
  topology_digest: string;
  evidence_cut_digest: string;
  belief_cut_digest: string;
  semantic_dependency_vector: readonly {
    dependency_id: string;
    expected_version: string;
  }[];
  consequence_digest: string;
}
```

At consequence append, the protected commit atomically revalidates the decision identity, current gate fence and version, context epoch, authority epoch, authenticated principal and capability, expiry, topology, consequence map, and every declared belief/evidence/assignment/policy dependency. If anything load-bearing moved, record invalidation and reopen at a higher gate version; never reinterpret the old choice against new context. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:51-58]

The authority chain is:

```text
authenticated human command
  -> gateway allow or authority-zero refusal
  -> fenced GateEdgeSelectedV1 append
  -> current downstream claim/write/budget checks
  -> separately authorized EffectIntentV1
  -> adapter execution
  -> receipt and recovery
```

A human choice is not a bearer capability for an external effect. Gate reopen or revocation can stop an unconsumed edge or future effect intent. Once effect intent is durable, the system owes reconciliation rather than retroactive denial. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-013.md:7-49]

Timeout is a fenced system transition, not a synthetic human answer. At the exact deadline, the declared timeout policy wins. `wait` keeps the gate pending, `expire` closes it without approval, and `escalate` changes routing through a separately authorized event. A stale timeout worker cannot close a reopened gate. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:29-35]

**Exact insertion point.** Add `runtime/lib/human-gates/{types.ts,event-registry.ts,context-projection.ts,service.ts,index.ts}`. Own `human_gate.opened@1`, `invalidated@1`, `reopened@1`, `edge_selected@1`, and `timed_out@1` there. Commit edge selection through P4. Send external effects through the existing receipts-and-effect-recovery gateway. Pilot render-only context, then one reversible non-effectful edge, then a separately authorized effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:207-241] [INFERENCE: the package and event names are proposed; shared cross-mode ownership and effect separation are settled]

## Cross-Cutting: Observability, Budget, and Integration

The integrated control protocol is:

```text
observe
  -> propose and preview at an exact verified cut
  -> authorize through 036
  -> revalidate and commit under current claim/fence/version
  -> reduce into disposable projections
  -> explain through receipts, traces, or authority-zero refusals
```

No graph row, preview, projection, checkpoint, refusal, alert, claim, human click, or parity certificate is independently executable. A successful audit allow is admission evidence for one exact event, not proof that the event or effect occurred. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-014.md:7-74]

Observability must preserve authority-relevant boundaries rather than only terminal status:

| Surface | Required observations |
|---|---|
| Projection | Verified domain/audit cut, reducer identities, authority disposition, head lag, rebuild state, settlement proof, blockers, last good checkpoint. |
| Authorization/refusal | Request digest, stable code and boundary, decision or guard reference, observed heads, zero-mutation assertion, retry class. |
| Protected mutation | Claim and attempt, target-set digest, supplied/current fence comparison, expected/current versions, preflight-versus-commit result. |
| Truth admission | Base head, candidate digest, fixed-point proof, successor/nogood conflicts, serialization retries, dirty-base quarantine. |
| Human gate | Gate version/fence/context epoch, dependency-vector component changes, principal/capability result, expiry, edge selection, effect receipt or recovery state. |
| Parity | Adapter/build identities, normalization rule used, earliest mismatching prefix, missing observations, nondeterminism, mutant survival, dark-effect leakage. |

These observations explain, block, quarantine, freeze, or request rollback. They never grant transition or effect authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-019.md:19-70]

Budget remains an authority-plane contract. A refusal must identify the budget scope, dimension, policy/version, allocation, committed debit, reservation, requested delta, and observation head. `reduce-scope` requires a newly compiled smaller intent. `request-budget-change` requires an independently authorized allocation change. Resume does not mint a fresh root budget, reset spend, ignore prior debits, or weaken evidence and gate requirements. Graphene’s claim-time budget checks are useful, but node-addressed completion makes spend attribution inherit the stale-successor risk. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-011.md:27-40]

Three controls must remain distinct:

1. **Projection disablement** stops one advisory producer or consumer and routes that named consumer to a retained legacy signal or full replay. It does not change authority state or epoch.
2. **Promotion abort** invalidates shadow or canary readiness evidence. It does not move authority.
3. **Authority rollback** freezes admission, advances the epoch, fences writers, reconciles immutable ledger/audit/effect evidence, and restores the retained legacy path through governed 036 transitions.

A graph-wide `GRAPH_ENABLED` switch would collapse unrelated failure domains and create ambiguous rollback evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-019.md:19-70]

P1–P7 belong in shared runtime packages and existing mode adapters. They do not require a new public workflow mode or a graph-specific authority owner. Legacy convergence readers, full-replay readers, V0 writers, mixed-version fixtures, error clients, gate/resume adapters, archival readers, and effect-recovery tooling remain deliberate rollback assets until their independent retirement gates pass. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-019.md:71-86] [INFERENCE: retaining current public modes follows from placing every new contract in shared runtime ownership]

## Explicit When-Not-to-Use Boundaries

- Do not use `BeliefProjectionV1` for direct immutable facts, explanation-only output, or a validated acyclic dependency set that one topological pass can evaluate. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:28-32]
- Do not introduce checkpoints where genesis replay is cheaper than checkpoint verification or where event, upcaster, reducer, canonicalizer, or audit-closure identity is unknown. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:34-38]
- Do not use full causal-prefix parity for UI rendering, token streaming, transport throughput, intentionally non-semantic formatting, or a local deterministic unit with a stronger direct oracle. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:40-44]
- Do not require claim fences for read-only projection queries or immutable content-addressed writes that cannot replace, append, alias, debit, checkpoint, or externally effect a protected identity. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:46-50]
- Do not globally serialize truth work when a versioned manifest proves disjoint transitive support, successor, nogood, scope, and required-answer closures. Direct-ID disjointness alone is insufficient proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:52-56]
- Do not apply prospective truth admission to offline quarantined imports, immutable evidence with no truth-affecting relation, or static invariants fully enforced by a simpler transaction. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:52-56]
- Do not use `TransitionRefusalV1` for local parser errors that reached no policy boundary, presentation-only errors, infrastructure faults, corrupt storage, or an existing bounded typed error that already supplies the complete contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:58-62]
- Do not create a durable human gate for informational acknowledgement, display-only preference, or an interaction with no consequence edge, mutation, budget change, or downstream effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:64-68]
- Do not use topology to repair a harness, permission, state, tool, or effect-recovery defect. The graph may expose the defect; it cannot supply missing authority or durability. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md:7-58]
- Do not deploy P1–P7 as one “Graphene stack.” Their projection, parity, writer, truth, refusal, gate, and effect risks have different rollback and evidence boundaries. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-019.md:19-70]

## Staged Delivery Order

Repo 1’s nine-step rollout remains controlling [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110-120]. Graphene adds dependency gates inside it; it does not reorder authority around the graph.

> NOTE: the table below is a synthesis reconstruction. It maps graphene's own **8-stage** dependency-safe order (iteration-020) onto repo 1's **9** stages, so the per-row `iteration-020` line ranges are approximate and overlap, and stages 7–8 draw on `iteration-015`. The controlling dependency invariant is stated exactly after the table.

| Repo-1 stage | Graphene-derived extension |
|---|---|
| 1. Shadow-emit graph IR and normalized traces | Freeze all `@1` wire/version ownership. Add P6 refusal decoding first because it is additive. Add P2 cut verification and disposable replay in shadow. Add P3 prefix traces and A1–A7 mutants before any control consumer. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:74-79] |
| 2. Execute pure deterministic nodes and reducers | Exercise `GraphProjectionReducerV1` from genesis, registered no-ops, dual-cut closure, same-version drift, corrupt checkpoints, and delete/rebuild controls. No checkpoint may control execution yet. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:76-78] |
| 3. Add read-only fan-out and deterministic fan-in | Run P3 schedule families in isolated roots with suppressed effects. Validate declared partial orders and require independent prefix oracles. No parity result moves authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:34-58] |
| 4. Add write-set admission, isolation, and effects | Introduce P4 one protected store at a time. Shadow target completeness, then canary one reversible writer. The stale-successor and same-epoch version-conflict mutants must pass before writer cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:79-80] |
| 5. Add typed gates, certificates, human gates, and effect recovery | Insert P5 before truth-bearing gates can control execution. Replay and quarantine dirty bases, dual-run previews, serialize truth candidates, and retain the full-replay backstop. Begin P7 render-only; do not authorize effects yet. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:80-83] |
| 6. Add mode-specific typed subgraphs | Add P1 as advisory for one consumer. Prove settlement termination and blocker parity. Promote per consumer only through a mode-scoped 036 authority transition while retaining legacy convergence for rollback. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:81-82] |
| 7. Add organization-governed work-graph generation | Keep generated topology outside authority. Generated work may propose belief, mutation, gate, or effect commands but cannot mint capability, budget, fence, policy, or selected-authority disposition. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md:7-35] |
| 8. Add hybrid evidence and knowledge routing | Use P1 and P5 for purpose-bound temporal truth and contradiction handling. Keep retrieval routes non-authoritative. Do not promote fuzzy identity, typed relation labels, or graph paths directly into usable premises. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md:37-58] |
| 9. Cut over mode by mode | Complete P7 in three steps: render-only context, reversible non-effectful edge, separately authorized effect with recovery. Require current P3 parity, rollback rehearsal, latency/cost baseline, and zero unresolved divergence. Retire nothing solely because graph evidence is green. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:82-83] |

The dependency invariant is `P6 → P2 → P3 → P4 → P5 → P1 control → P7 consequence/effect`. P1 may run advisory before P5, but it cannot become a selected truth-control consumer while unsafe truth writes remain possible. P7 is last because it composes current belief, replay cuts, parity, fencing, truth admission, identity, and effect recovery. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:233-241]

## Graphene's Own Gaps (do NOT copy)

| Gap | OBSERVED-IN-CODE or inferred consequence | Target rule |
|---|---|---|
| `gr compact` deletes committed history | **OBSERVED-IN-CODE:** deletion is allowed after present-fold equivalence. That does not preserve point-in-time state, denials, authorization provenance, or replay fingerprints. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:25-31] | Never compact committed 036 domain or audit history. Compact only disposable projections, indexes, caches, and redundant checkpoints. |
| Supersession bypasses its own time rule | **OBSERVED-IN-CODE:** the semantic-time helper orders by observation time and sequence, but production supersession does not invoke it and closes validity using record time. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:13-24] | Admit only increasing `(observedAt, authorizedSequence)` successors; preserve immutable half-open validity. |
| Nogoods are not rejected at add-time | **OBSERVED-IN-CODE:** belief add does not run prospective nogood closure; G8 detects an invalid all-`IN` set afterward. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:45-64] | Preview every truth-affecting candidate to a checked fixed point before sequence allocation; retain G8 only as an independent replay backstop. |
| Golden coverage can be name-complete but behavior-incomplete | **OBSERVED-IN-CODE:** required stems are checked without required event patterns. Claim lease, nogood, out-of-order, and timeout fixtures omit advertised mechanisms or variants. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-004.md:13-32] | Require semantic manifests, external prefix checkpoints, refusal outcomes, timing permutations, and pinned mutants. |
| `done` omits claimant identity and fencing | **OBSERVED-IN-CODE:** completion is node-addressed and checks only for an active claim. **INFERRED:** stale C1 may complete under successor C2. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-006.md:7-25] | Require claim ID, attempt identity, per-target monotonic fence, expected version/head, and atomic compare-and-mutate on every claim-derived mutation. |
| Settlement bound does not prove quiescence | **OBSERVED-IN-CODE:** the bounded loop can exit with pending change and does not withhold the result. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:15-21] | Publish only a checked fixed point with cycle, repeated-state, oscillation, and bound-exhaustion failure modes. |
| Human consequence paths lack live dependency fencing | **OBSERVED-IN-CODE:** local consequence and timeout folds exist, but commands omit current principal, gate version/fence, topology/evidence/belief cuts, and authority epoch. **INFERRED:** a valid allow can become stale before append. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:35-47] | Atomically revalidate gate fence/version and a minimal semantic dependency vector at consequence append; authorize effects separately. |

## Terminal Audit and Remaining Evidence

The research answers architecture and contract semantics at design-decision level (the run stopped at `maxIterationsReached` with a terminal `newInfoRatio` of 0.46, not at convergence). It does not prove the proposed packages work, outperform the legacy runtime, or are safe to promote.

| Area | Design-level result | Evidence still required before promotion |
|---|---|---|
| P1 | Four-valued, purpose-bound belief projection; required-answer blockers; authority disposition; checked quiescence. | Property tests plus cycle, oscillation, repeated-state, reversed-order, long-chain, and bound-exhaustion mutants. Until then P1 remains advisory. |
| P2 | Exact-version fold, reference-closed domain/audit cut, disposable checkpoint, no authority compaction. | Genesis replay; missing-reference, corruption, same-version drift, unknown reducer, checksum, delete/rebuild, and historical-cut tests. |
| P3 | Causal-prefix trace, closed normalization, independent oracles, schedule families, A1–A7 mutants. | Sealed fixtures across real adapters; repeated runs; first-mismatch evidence; mutant kill matrix; proof that dark effects remain suppressed. |
| P4 | Claimant-addressed, target-complete atomic commit. | Complete caller/target inventory; pause-after-preflight takeover; same-epoch version conflict; partial-mutation and effect-intent negative controls. |
| P5 | Composite semantic time and serializable prospective truth admission. | Both winner orders for same-base conflicts; dirty-base quarantine; contention, throughput, storage, and latency measurements. |
| P6 | Authority-zero refusal schema and boundary-specific recovery. | Unknown-version/code tests; decoder rejection at command/effect boundaries; suggestion-execution mutants; zero-mutation verification. |
| P7 | Snapshot-bound human context, live dependency revalidation, edge/effect separation. | Post-allow invalidation, stale principal, timeout/reopen, decision/reassignment, stale scheduler, effect ambiguity, and recovery drills. |
| Operational benefit | No claim established. | Shadow and canary deltas for certified quality, critical-path latency, queue/barrier wait, contention, retry rate, cost, operator load, and effect ambiguity. |

The missing evidence blocks control adoption and cutover, not synthesis. Another document-only pass cannot establish it. The next confirming instruments are executable mutants, transactional race tests, shadow traces, reversible canaries, and measured baselines. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:87-118]

Rollback evidence must also prove that projection disablement, promotion abort, and selected-authority rollback remain distinct. A selected writer failure must freeze admission and enter the governed epoch/fencing/reconciliation process; it must not fall back to the legacy writer within the same request. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-019.md:19-70]

## Convergence Report

- Iterations completed: **20**.
- Stop reason: **`maxIterationsReached`**.
- Convergence telemetry was not stop authority.
- Angle coverage: **P1–P7 all answered at design-decision level**.
- Open design conflicts: **none found within the 20-iteration budget** (convergence telemetry was not stop authority, so this is a bounded-search result, not a proof of absence).
- Remaining gaps: implementation, adversarial verification, rollback rehearsal, and measurement only. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:7-25] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:119-129]

Coverage progressed in deliberate phases:

| Iterations | Coverage |
|---|---|
| 001 | P1 belief projection and convergence guard |
| 002–003 | P2 replay, authority mapping, dual cuts, checkpoints, and compaction |
| 004–005 | P3 fixture audit, prefix oracles, timing, refusals, and adapter parity |
| 006–007 | P4 stale-successor proof, command schema, and wave boundary |
| 008–009 | P5 semantic time, prospective nogood admission, and serialized commit |
| 010–011 | P6 refusal wire contract and boundary-specific recovery |
| 012–013 | P7 live belief context, durable decision, consequence, and effect separation |
| 014 | Integrated single-authority control plane |
| 015 | All-12-blog triangulation |
| 016 | Exact cross-adapter trace and schedule matrix |
| 017 | A1–A7 adversarial safety audit |
| 018 | Versioned schemas, insertion points, and dependency order |
| 019 | When-not-to-use, canary, kill-switch, rollback, and retained-consumer boundaries |
| 020 | Terminal conflict closure and synthesis-ready verdicts |

The novelty trend was not monotonic. Early contract discovery remained high (`0.79` at iteration 2 and `0.74` at iteration 4), boundary-specific recovery fell to `0.48` at iteration 11, integration rebounded to `0.73` at iteration 14, adversarial and schema passes rose again to `0.68` and `0.71` at iterations 17–18, and the terminal audit declined to `0.46`. The late rebounds came from cross-contract counterexamples, concrete schemas, and rollback boundaries; they did not reopen the settled P1–P7 decisions. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:42-46] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-004.md:54-58] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-011.md:88-92] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-014.md:99-103] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:105-109] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:257-267] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-020.md:119-129]