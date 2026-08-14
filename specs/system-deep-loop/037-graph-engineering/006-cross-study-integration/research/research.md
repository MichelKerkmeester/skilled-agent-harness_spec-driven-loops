# The Integrated Graph-Based Agent-Loop Design: Cross-Study Synthesis (Study 6, Capstone)

## Grounding (terms and sources)

**036** is the designated transition-authority plane for `system-deep-loop`. Its target-state responsibilities include authorization, append-only history, fencing, budgets, protected effects, receipts, cutover, and rollback. It currently runs **DARK**: legacy writers remain operationally authoritative, dark processing occurs after the legacy result is final, and the legacy result is returned unchanged. Every statement below that subordinates graph execution to 036 is therefore a target-state contract, not a claim of live enforcement. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:16]

This capstone integrates five studies, each a completed 20-iteration research run:

| Study | Layer it owns |
|---|---|
| **S1 — AgentSwarms** | Product-runtime graph architecture: seven planes, typed compiled IR, scheduling, reducers, typed subgraphs, parity, and the nine-stage delivery spine. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5-9] |
| **S2 — Graphene** | Event-derived truth and mutation safety: reference-closed ledger folds, belief settlement, causal-prefix parity, claimant fencing, prospective truth admission, refusals, and live-context gates. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:11-19] |
| **S3 — GraphARC** | Governance: admission and sealing, organization-policy compilation, durable approvals, hierarchical budgets, authority-zero refusals, governance mutants, and staged promotion. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:14-20] |
| **S4 — Graph Engineering Master** | Knowledge/evidence production: competency-driven modeling, ontology, extraction, quality, reversible fusion, hybrid serving, and maintenance. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:15-21] |
| **S5 — NOOA and loop theory** | The inner loop and harness: typed iteration returns, curated continuity, bounded context, fixed LEAF tactics, separated evaluations, and harness mutants. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:14-20] |

This is integration, not re-study. Source-level claims cite the relevant S1–S5 synthesis. Cross-study constructions are labeled as inferences. The ten Study 6 iteration narratives are the primary integration record.

The result is **DESIGN-level**. It defines proposed doctrine, ownership, ordering, and interfaces and reconciles them internally. It does not establish shipped behavior, production fitness, or cutover authority.

Ten integration iterations ran under `stopPolicy=max-iterations`. Novelty and convergence values are executor-reported telemetry, not independent measurements. The maximum-iteration policy remained the actual stop authority even after the reported threshold was crossed. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-009.md:30-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-010.md:25-30]

## Executive Synthesis

The integrated target is a **graph-governed, event-derived agent-loop engine**. An organization graph defines stable policy, capabilities, ownership, and budget ceilings. A per-run work graph proposes bounded work. A deterministic compiler admits and seals that proposal into typed executable topology. Each executable node contains either a direct action or a mode-specific loop subgraph. Inside that node, the S5 harness manages bounded context, closed local tactics, typed returns, reducer-owned continuity proposals, and evaluation. Graph and loop are therefore compositional: the graph owns eligible work and dependencies; the loop owns one bounded attempt to produce a candidate. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:13-31] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:7-20] [INFERENCE: S1–S4 define the graph/control exterior while S5 defines the node-local iteration interior.]

The single most important invariant is: **no proposal, projection, validation, score, belief, convergence result, policy verdict, or human approval becomes mutation authority**. Every protected consequence must become one exact canonical request whose current actor, capability, evidence, policy, budget, gate, head, epoch, claim, and fence are revalidated at the selected authority boundary. In the target state, only 036 can authorize and append that request. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452-465] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18] [INFERENCE: the enumerated list is a Study-6 composite of per-study negatives — projection, claim, and refusal non-authority from S2 (452-465); typed-return non-promotion from S5; score non-masking from S3 and S5; belief non-authority from S2 belief settlement; convergence non-authority from S1; and policy and human-approval non-bypass from S3 — which together make the five studies one acyclic system. No single source study states the full list.]

The honest current-state headline is different: 036 is designated but dark. Legacy remains authoritative. Graph compilation, harness evaluation, knowledge production, belief, policy, and promotion evidence can presently operate only as shadow observations after the legacy result. The architecture is coherent at design level, but all authority subordination remains target-state until a measured, operator-gated, per-mode cutover.

## The Cross-Cutting Spine

### Proposal never implies authority

**DIRECTLY-STATED cross-link — S1, S2, S3, S4, and S5.** S1 makes the graph a projection that proposes transitions. S2 makes projections, refusals, and claims non-executable without authority revalidation. S3 makes admission explicitly different from authorization. S4 keeps knowledge artifacts non-authoritative. S5 separates accepted iteration returns from transition authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452-465] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:153-158] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:48]

**Unifying statement:** every upstream component produces typed proposals, evidence, or prerequisites. None produces a bearer capability for protected mutation.

### Graph and loop are composition, not alternatives

S1–S4 define graph identity, policy, topology, event-derived state, knowledge, belief, and governance. S5 defines how one admitted node performs a bounded iteration. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23-41] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:38-48]

[INFERENCE: the graph owns readiness, branching, fan-out, fan-in, reducers, subgraphs, and escalation; the harness owns node-local context, tactics, return formation, and limited shape repair.]

### One monotonic evidence and gate stack

The integrated ordering is:

`graph admission and sealing → return admission → artifact/evidence and trajectory acceptance → purpose-bound belief usability → mode-specific convergence legality → organization policy → human ASK settlement when required → exact authority request`

S5 supplies return and evidence separation. S2 supplies belief, settlement, and live-context gates. S3 supplies structural admission and the admission-versus-authorization separation. S1 supplies convergence as typed subgraph control. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95-112] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43-77] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61-67]

[INFERENCE: the stack is monotonic because an earlier failure cannot be repaired by a later score, while an earlier success grants no later authority.]

### Memory, knowledge, and belief form one pipeline

The composition is:

`memory locates → knowledge supplies assertions → belief settles purpose-bound usability`

Memory may rank, retrieve, suppress from a working set, or abstract with source handles. Knowledge production may create provenance-bearing assertions and reversible identity projections. Belief may determine whether an assertion is a usable premise for one purpose. None may authorize STOP, topology change, or protected mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:38-65] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43]

[INFERENCE: this pipeline prevents retrieval convenience, identity confidence, or belief state from becoming a competing source of authority.]

### One promotion-evidence bundle

Promotion requires six independently blocking families:

- `D` — data, knowledge, producer, and artifact quality;
- `C` — causal-prefix and replay correctness;
- `G` — governance-mutant survival;
- `H` — harness-mutant survival;
- `R` — recovery and rollback drills;
- `M` — measured baseline and candidate deltas.

S2 supplies prefix comparison and earliest divergence. S3 supplies governance mutants and earliest-owner failure. S4 supplies independent data and retrieval quality. S5 supplies harness mutants and measurement obligations. S1 supplies normalized cross-adapter traces and staged authority change. The recovery family `R` draws on S2 reconciliation and reference rebuild, S3 rollback governance, and S1 rollback-window and cutover assets. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147-224] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131-143] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77-91] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126-148]

[INFERENCE: a reference-closed D/C/G/H/R/M bundle may nominate a canary or cutover request; it can never select a writer or perform cutover.]

### One staged sequence

S1’s nine stages remain the delivery spine. S2 constrains their internal safety order. S3 installs governance across them. S4 adds an orthogonal knowledge-maturity axis. S5 makes mutants precede trust. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110-120] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505-523] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:192-207] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:122-136] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126-159]

[INFERENCE: the unified sequence is contract and mutant freeze; dark adapters; pure graph and harness execution; read-only fan-out and knowledge production; governance and epistemic joins; fenced writes and effects; parity and recovery; promotion certification; reversible per-mode cutover; rollback-window observation; then writer retirement.]

## P1 — Authority-Subordination Contract

**Proposed unified artifact (nominal schema, unimplemented):** a two-mode authority contract with one no-bypass chain.

| Concern | Current state: `legacy_authoritative_dark_observer` | Target state: `036_authoritative` |
|---|---|---|
| Selected writer | Legacy runtime | 036-selected per-mode writer |
| External result | Legacy result only | Exact 036-authorized candidate |
| Graph | Shadow proposal and projection | Live proposal and projection |
| Harness, evidence, belief, convergence | Candidate observations | Typed prerequisites for an authority request |
| Policy and human gates | Missing, prototyped, or shadow-only where available | Durable, current, digest-bound prerequisites |
| 036 | Designated, dark, observes after legacy | Revalidates, authorizes, appends, fences, and receipts |
| Legacy path | Operationally authoritative | Retained through the reversible rollback window |

The current-state order is `legacy executes → legacy result becomes final → dark graph/036 processing records comparison evidence → caller receives the unchanged legacy result`. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:110-120]

The target-state order is:

`proposal → structural admission → executable sealing → typed return admission → evidence-family gates → belief usability → convergence eligibility when terminal → organization policy ALLOW|DENY|ASK → current human decision when ASK → live head/epoch/claim/fence/budget revalidation → exact 036 append request → effect intent and receipt`

[SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452-465] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:147-174] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95-112] [INFERENCE: this total order is the smallest composition that preserves every owner’s jurisdiction.]

The no-bypass invariants are:

- no graph edge authorizes;
- no admission proof or sealed graph authorizes;
- no type-valid return promotes itself;
- no aggregate score masks missing evidence;
- no belief state overrides incomplete evidence;
- no convergence result bypasses policy;
- no `ASK` defaults to allow;
- no human approval overrides `DENY` or stale authority facts;
- no stale certificate becomes a capability;
- no dark-mode output changes the external legacy result.

**Interconnects:** S1, S2, S3, and S5, with S4 contributing the non-authority status of knowledge evidence.

**Design-settled:** the two modes, the single final authority owner, and the no-bypass ordering.

**Open:** exact per-mode cutover order, deployed 036 revalidation coverage, and the implementation of missing policy, gate, refusal, and graph-evidence producers.

## P2 — Unified Promotion-Evidence Model

**Proposed unified artifact (nominal schema, unimplemented):** a candidate-bound promotion bundle:

```text
PromotionBundle {
  candidateDigest,
  sourceDigest,
  buildDigest,
  policyDigest,
  authorityEpoch,
  D: not_run | pass | fail | stale,
  C: not_run | pass | fail | stale,
  G: not_run | pass | fail | stale,
  H: not_run | pass | fail | stale,
  R: not_run | pass | fail | stale,
  M: not_run | pass | fail | stale
}
```

Promotion eligibility is conjunctive. Every required family must be `pass`. `not_run`, `fail`, and `stale` block. A summary score may aid reporting but may not hide a failed or missing family. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77-91] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131-143] [INFERENCE: four-state evidence families make the non-substitution rule mechanically auditable.]

The bundle contains:

- frozen case and mutant manifests;
- exact candidate, source, build, policy, schema, and adapter identities;
- causal-prefix comparisons with the earliest mismatch;
- deterministic replay fingerprints;
- expected earliest owner for every mutant;
- forbidden-event and forbidden-effect assertions;
- data, retrieval, and runtime quality evidence;
- recovery and rollback drill receipts;
- baselines, candidate deltas, populations, and exclusions;
- freshness and expiry information.

The earliest-owner oracle evaluates promotion evidence in the integration order `D → C → G → H → R → M`. It assigns remediation to the first causal failure and retains downstream symptoms without allowing them to reassign ownership. This is a promotion-diagnostics order, not the per-request gate order in P6. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-002.md:11-17]

A complete bundle proves candidate readiness only. It does not transfer authority. The selected authority must still verify current mutation facts at commit time.

**Interconnects:** S1–S5.

**Design-settled:** conjunctive families, anti-masking, digest binding, earliest-owner attribution, and separation between promotion and cutover.

**Open:** numeric thresholds, evidence retention periods, graph-specific certificate representation, and measured false-positive or false-negative rates.

## P3 — Memory, Knowledge, and Belief Non-Collision Layering

**Proposed unified artifact (nominal schema, unimplemented):** an ownership and read-through contract.

| Layer | Owned artifact | May decide | Must never decide |
|---|---|---|---|
| Memory | Locator or working-set entry with digest, provenance, recency, and retention class | What to retrieve, rank, suppress, abstract, or restore | Proposition truth, contradiction resolution, STOP, or authority |
| Knowledge | Provenance-bearing assertion with ontology, production method, quality evidence, temporal validity, and reversible identity lineage | Whether an assertion is publishable as evidence | Whether it is a usable premise for a specific transition |
| Belief | Purpose-bound deterministic fold over assertions, support, contradiction, supersession, recency, and authority context | Whether a premise is currently usable | Whether a protected mutation is authorized |
| Authority | Canonical owner records and exact transition requests | Whether one protected consequence may append | Retrieval or epistemic convenience |

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:38-65] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43]

The read path is fail-closed:

`memory locator → digest-verified knowledge assertion → current purpose-bound belief settlement`

A missing, stale, contradicted, insufficient, unresolved, out-of-scope, or authority-zero reference produces a typed blocker. It never silently falls back to a cached assertion or a convenient ranking.

Memory compaction may replace bulky payloads with verified handles. It may not sever reference closure. Never-forget classes include:

- authoritative requests, decisions, denials, refusals, claims, fences, budgets, effects, and receipts;
- human `ASK`, approval, rejection, expiry, revocation, and invalidation;
- source assertions and provenance;
- contradiction and supersession lineage;
- negative tests and ruled-out approaches;
- rollback anchors;
- unresolved questions and blockers.

Authoritative records are always read through from their owning ledgers. A memory copy is never authoritative. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:52-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99-145]

**Interconnects:** S2, S4, and S5, with S1 supplying evidence and knowledge projection boundaries.

**Design-settled:** the three distinct semantics, fail-closed read-through, provenance preservation, and never-forget classes.

**Open:** retention durations, invalidation propagation latency, belief calibration, and the exact adapter schemas.

## P4 — The 036 Capability and Ownership Gap Inventory

**Proposed unified artifact (nominal schema, unimplemented):** a four-state capability matrix.

The Study 6 audit establishes a static repository inventory. It does not prove that the capabilities are deployed, correctly composed, or production-ready.

| Assumed primitive | Classification | Integrated finding |
|---|---|---|
| Transition gateway and typed authority ledger | **Present** | Reusable authority substrate exists in source. |
| Current-head and authority-epoch checks | **Present** | Available for target commit-time revalidation. |
| Replay fingerprinting | **Present** | Can support deterministic projection verification. |
| Single-host locks and fences | **Present** | Reusable locally; multi-host semantics remain unproven. |
| Hierarchical budgets | **Present** | Authority-owned accounting exists; graph normalization is still required. |
| Effect receipts and recovery | **Present** | Reusable for separately authorized graph-originated effects. |
| Cutover certificates and rollback windows | **Present** | Evidence-binding and reversible authority states exist. |
| Authorization-audit denial | **Present** | Gateway denial exists; this is distinct from graph-local refusal persistence. |
| Dark ledger adapter | **Shadow-only** | Executes after legacy and cannot change the returned result. |
| Shadow parity | **Shadow-only** | Comparison machinery exists without authority effect. |
| Per-mode authority flip | **Shadow-only** | Explicitly dark and unwired; unknown modes default to legacy. |
| Rollback drills | **Shadow-only** | Drill machinery exists, but the audited path lacked a live sibling consumer. |
| Typed graph admission and materialization | **Missing** | No graph compiler/admission producer currently closes executable meaning. |
| Purpose-bound belief projection | **Missing** | No integrated graph belief reducer currently supplies checked usability. |
| Organization-policy compiler | **Missing** | No provenance-preserving graph policy producer is wired into authorization. |
| Durable human-gate and graph-refusal journal | **Missing** | Decision provenance required by S2/S3 is absent as an integrated graph service. |
| Graph event schemas and identity/evidence resolver | **Adapter-owned** | 036 owns the hook; graph semantics must be supplied by the integration adapter. |
| Knowledge and memory projections | **Adapter-owned** | Non-authoritative graph projections must be implemented outside the authority core. |
| Budget normalization and graph effect policies | **Adapter-owned** | Existing owners remain authoritative; graph coordinates and policies require adapters. |
| Graph-to-036 bridge and promotion-bundle assembly | **Adapter-owned** | The bridge must resolve references and form the exact canonical request. |

[SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-004.md:9-17]

The minimum cutover-critical build is an adapter slice, not a second authority plane:

1. typed graph IR compiler and materializer;
2. graph admission plus identity/evidence resolver;
3. memory, knowledge, and belief reducers;
4. organization policy plus durable gate/refusal persistence;
5. graph-specific budget and effect adapters;
6. a dark bridge that assembles D/C/G/H/R/M evidence for the existing 036 cutover gateway.

[INFERENCE: reusing the existing ledger, gateway, budget, receipt, and rollback substrate minimizes new authority code and avoids a competing ledger.]

**Interconnects:** S1, S2, S3, and S5.

**Design-settled:** reuse rather than duplicate the present authority substrate; keep graph semantics adapter-owned; refuse target authority until decision provenance exists.

**Open:** operational verification of every “present” capability, multi-host fencing, provider-usage normalization, durable graph gate/refusal implementation, graph-evidence resolution, and live deployment wiring.

## P5 — Graph, Subgraph, and LEAF Execution Boundary

**Proposed unified artifact (nominal schema, unimplemented):** a closed action and escalation algebra with monotonic subgraph inheritance.

| Boundary | Owns | Cannot do |
|---|---|---|
| Graph | Topology, readiness, branching, fan-out, fan-in, reducers, expected cardinality, capabilities, policies, budgets, gates, and scheduling | Perform protected mutation without authority |
| Sealed subgraph | Bounded internal topology, local state, evaluator set, child budget, convergence, and typed exits | Widen parent policy, capability, budget, deadline, or authority |
| LEAF harness | Node-local context, model/tool calls, local transforms, candidate validation, and return formation | Create lineages, mutate topology, mint capability, alter budgets, or perform unreceipted effects |

The integrated LEAF action vocabulary is:

`READ_CONTEXT`, `CALL_MODEL`, `CALL_TOOL`, `EMIT_ARTIFACT`, `REQUEST_SUBGRAPH`, `RETURN_RESULT`

`REQUEST_SUBGRAPH` is a typed request to the graph reducer. It is not direct spawning.

The escalation vocabulary is:

`ASK_HUMAN`, `REQUEST_BUDGET`, `REQUEST_CAPABILITY`, `REPORT_BLOCKER`, `ABSTAIN`

Escalation ends the local action lease and returns control to workflow ownership. It never defaults to approval.

A sealed child binds the parent digest, schemas, evaluator set, policy digest, capability subset, conserved budget slice, deadline, maximum depth, and child count. A child may only narrow those constraints. It cannot outlive its parent lease. It returns through parent evaluation and reduction. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61-67] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55-65] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83-93]

Dispatch and result admission bind graph, subgraph, node, attempt, lease, claim, fence, input digest, and policy digest. Late or duplicate results remain evidence but cannot update the canonical reducer. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226-273]

**Interconnects:** S1, S3, and S5, hardened by S2 claimant fencing.

**Design-settled:** graph ownership of structure, bounded LEAF tactics, workflow-owned escalation, and monotonic child inheritance.

**Open:** executable recursive sealing, exact wire names, proof that the action vocabulary is minimal, depth limits, and concurrency behavior.

## P6 — The End-to-End Typed Gate and Evaluation State Machine

**Proposed unified artifact (nominal schema, unimplemented):** a reason-preserving discriminated state machine.

```text
ReturnAdmission {
  accepted | repairable | rejected
}
→ Evidence {
  complete | blocked(family, reason) | stale(family)
}
→ Belief {
  usable | contradicted | insufficient | stale | authority_zero
}
→ Convergence {
  continue | stop_eligible | terminal_blocked
}
→ OrgPolicy {
  allow | deny | ask
}
→ HumanGate {
  not_required | pending | approved | rejected | expired | revoked
}
→ Authority {
  shadow_recorded | authorized_append | denied(reason)
}
```

[SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-006.md:9-17]

The guards are monotonic:

- only `accepted` enters evidence evaluation;
- terminal promotion requires complete applicable evidence families;
- belief must be usable for any load-bearing premise;
- `stop_eligible` is required only for a terminal transition;
- policy `deny` blocks;
- policy `ask` requires a current, scoped approval;
- approval may be expired, revoked, or invalidated;
- 036 must recheck current head, epoch, claim, fence, capability, budget, and policy before append.

Ordinary nonterminal loop work need not traverse a terminal-promotion path. It also gains no authority by stopping earlier.

This target `Convergence` stage does not replace S5's shipped `StopDecision`. In current operation, the S5 inner loop's `StopDecision` remains the live per-loop stop mechanism and runs unchanged. The graph-level convergence reducer is a proposed target-state addition that governs only terminal-transition eligibility; it is not present in any source study as shipped code. [INFERENCE: separating the shipped inner-loop stop from a proposed graph-terminal convergence gate keeps the current harness authoritative for stopping while target doctrine adds a distinct terminal-eligibility check.]

Each block records:

`{owner, state, reasonCode, evidenceDigests, candidateDigest, policyDigest, observedHead, epoch, fence, timestamp}`

Repair creates a linked attempt. It never rewrites the failed attempt or skips its owner.

In current mode, the terminal state is `shadow_recorded` after the legacy result. In target mode, `authorized_append` is the only successful mutation state.

**Interconnects:** S1, S2, S3, S4, and S5.

**Design-settled:** typed outcomes, owner-specific reasons, monotonic attempts, current/target terminal distinction, and append-time revalidation.

**Open:** local repair budgets beyond shape repair, timeout policy, retry classification, and durable event schemas for intermediate states.

## P7 — The Unified Rollout and Rollback DAG

**Proposed unified artifact (nominal schema, unimplemented):** one dependency DAG rather than concatenated study stage lists.

```text
R0  Freeze legacy baseline, taxonomy, identities, fixtures
 ↓
R1  Freeze typed IR, event, policy, canonicalization, and adapter contracts
 ↓
R2  Build mutant manifests and earliest-owner oracles
 ↓
R3  Reuse 036 dark ledger, gateway, budget, receipt, and rollback adapters
 ↓
R4a Graph admission and sealed subgraphs
R4b Typed returns, bounded context, and LEAF harness
R4c K0–K6 knowledge/evidence production
  \   |   /
   R5 Memory/knowledge/belief join plus policy, gates, and refusal
    ↓
R6  Claims, fences, budgets, effect intents, receipts, and recovery
 ↓
R7  Causal-prefix shadow parity
 ↓
R8  Mixed-version, crash, reconciliation, and rollback drills
 ↓
R9  Conjunctive D/C/G/H/R/M promotion certificate
 ↓
R10 Per-mode reversible cutover
 ↓
R11 Rollback-window and legacy-zero-use observation
 ↓
R12 Legacy-writer retirement and final whole-system gate
```

R4a, R4b, and R4c may proceed in parallel only against frozen R1 identities and isolated output namespaces. R5 joins them by digest. R6 cannot begin until governance and epistemic producers exist. R7 cannot begin until every candidate path emits comparable events. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-007.md:9-17]

Rollback assets are stage outputs:

- R0 retains legacy fixtures and snapshots.
- R1 retains schemas, upcasters, canonicalizers, and compatibility declarations.
- R2 retains executable mutants.
- R3–R6 retain adapters and projection rebuilders.
- R7 retains the mismatch corpus and prefix oracles.
- R8 produces drill receipts.
- R9 binds exact evidence digests.
- R10–R11 retain legacy readers, writers, rollback anchors, and authority epochs.
- R12 retires live writers only after the reversible window and zero-use evidence; archival readers remain.

**Interconnects:** S1–S5.

**Design-settled:** additive-dark rollout, mutants before trust, one bounded parallel wave, per-mode reversible cutover, and rollback assets owned by each forward stage.

**Open:** per-mode ordering, exit thresholds, rollback-window duration, mixed-version deployment behavior, and retirement criteria under measured traffic.

## P8 — Measurement and Owner-Disagreement Arbitration

**Proposed unified artifact (nominal schema, unimplemented):** a provenance-bound benchmark envelope plus a jurisdictional arbitration protocol.

Seven measurement families are required:

| Family | Required observations |
|---|---|
| Correctness | Causal-prefix mismatches, replay determinism, stale claimant rejection, fence rejection, and unauthorized append count |
| Epistemics | Source coverage, contradiction recall, never-forget retention, belief calibration, and supersession correctness |
| Harness | First-pass validity, repair distribution, runaway rate, context pollution, fan-in completeness, and mutant kill rate |
| Governance | `DENY`, `ASK`, approval, expiry, revocation, direct-invoke attempts, and unauthorized consequence attempts |
| Performance | p50/p95 latency, tokens, cost, tool calls, queue time, barrier wait, graph overhead, and storage |
| Recovery | Detection, reconciliation, rollback time, receipt completeness, and drill success |
| Rollout | Shadow divergence, per-mode health, rollback-window incidents, and legacy zero-use |

[SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:93-97] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452-490] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:197-216] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193-206]

Every metric binds its population, exclusions, baseline and candidate digests, mode, authority state and epoch, policy version, time window, raw observations, and calculation version. Missing or incomparable baselines block promotion. They do not become zero.

Arbitration is jurisdictional:

- return admission owns shape;
- evidence evaluators own their families;
- the belief reducer owns premise usability;
- the convergence reducer owns terminal-transition stop eligibility in the target state, while S5's shipped `StopDecision` remains the live per-loop stop owner in current operation and is retained, not replaced;
- organization policy owns `ALLOW|DENY|ASK`;
- a human may settle only a scoped `ASK`;
- 036 owns target-state mutation admission.

An earlier-owner block remains blocking. Multiple policies compose as `DENY > ASK > ALLOW`. A human cannot override `DENY`; changing it requires a new policy version. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67-77] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386-450]

A disagreement produces an immutable record containing candidate, scope, owners, verdicts, reasons, evidence, and policy version. The system identifies the earliest jurisdiction. Contested factual derivations may be rerun against blinded independent evidence. Persistent policy ambiguity becomes an expiring `ASK` to a named human owner. Until new evidence or policy resolves the conflict, the state is `blocked_disagreement`; target-state 036 refuses mutation. [INFERENCE: independent re-derivation resolves facts, while human action resolves scoped policy ambiguity rather than failed safety evidence.]

**Interconnects:** S1, S2, S3, S4, and S5.

**Design-settled:** multi-family measurement, explicit denominators, jurisdictional ownership, restrictive policy composition, and fail-closed disagreement.

**Open:** every numeric threshold, real disagreement frequency, arbitration latency, belief calibration, operator load, and the deployment owner for independent reruns.

## Tensions Resolved

| Tension | Resolution |
|---|---|
| **Curated memory versus settled belief** | Memory operations alter retrieval projections only. They preserve source handles and never-forget classes. They cannot rewrite assertions, resolve contradiction, close questions, or authorize STOP. Belief remains a deterministic purpose-bound fold over reference-closed assertions. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43] |
| **Programmable LEAF versus typed subgraph** | A LEAF may adapt within a closed local action vocabulary. Parallel work, topology changes, new capabilities, budgets, gates, and protected effects return as typed proposals to the graph owner. Recursive subgraphs must be separately admitted and sealed. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83-93] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61-67] |
| **“Prefer newer” versus semantic supersession** | Recency ranks retrieval candidates only after valid time, observation time, provenance, contradiction, supersession, uncertainty, and purpose have been processed. It never determines truth. Composite semantic ordering and prospective truth admission remain controlling. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:21] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:275-327] |
| **Many projections versus one truth** | Memory, belief, checkpoints, graph state, parity results, evidence graphs, metrics, and OTel declare owner, source cut, reducer/version, freshness, and failure state. They are rebuildable views. Unresolved references make a projection unavailable rather than approximate. Authoritative records remain in their owning ledgers. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99-145] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:103-115] |
| **Target authority versus 036-dark reality** | Current and target modes share the upstream evidence trace but have different terminal owners. Current mode observes only after legacy. Target mode submits the exact candidate to 036 after audited, measured, operator-gated cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:5] [INFERENCE: dual-mode semantics prevent target doctrine from being misreported as current enforcement.] |
| **Completeness versus bounded autonomy** | Completeness means accounting for every scoped obligation, including blockers and negative results. It does not require manufacturing a successful answer. A bounded loop may correctly end `abstain`, `blocked`, or `exhausted`. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:23-36] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83-93] |
| **Parity versus intentional improvement** | Compatibility and improvement are separate candidate lanes. Compatibility requires exact causal-prefix parity. Improvement requires a new candidate and policy digest plus the full evidence and mutant suite. Improvement evidence cannot erase a parity mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147-224] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:69-75] [INFERENCE: lane separation prevents intentional change from laundering compatibility failure.] |

## The Single Integrated Architecture

The target system composes seven operational planes around one authority boundary. [INFERENCE: this seven-plane grouping is a Study-6 integration taxonomy and is distinct from S1's own seven-plane model, which counts the 036 authority plane as one of its seven.]

| Plane | Responsibility |
|---|---|
| Organization and governance | Stable roles, capabilities, policy ceilings, ownership, budgets, and allowed handoffs |
| Work proposal and compilation | Per-run work proposal, structural admission, deterministic compilation, and executable sealing |
| Graph execution | Readiness, scheduling, branches, reducers, fan-out, fan-in, claims, fences, and typed subgraphs |
| Loop and harness | Bounded context, fixed LEAF tactics, typed returns, limited shape repair, and iteration evidence |
| Knowledge and epistemics | Ontology-governed assertion production, reversible fusion, memory retrieval, and belief settlement |
| Event, replay, and observability | Append-derived projections, causal-prefix parity, checkpoints, refusals, receipts, and telemetry |
| Promotion and recovery | D/C/G/H/R/M certification, canaries, rollback drills, reconciliation, and retirement evidence |
| Authority boundary | Legacy today; target-state 036 after per-mode cutover |

The authority spine is:

`work proposal → admission proof → sealed graph → admitted node/subgraph → typed iteration result → evidence acceptance → belief usability → convergence eligibility → organization policy → current human decision when required → resolved graph transition evidence → exact authority request → fenced append → separately authorized effect → receipt → replay and projections`

In current operation, that spine ends in shadow recording after legacy. In the target state, it ends in a 036 authorization decision and fenced append.

The loop contract sits inside an admitted executable node. It receives bounded, digest-pinned context and declared capabilities. It may call only admitted models or tools. It may produce artifacts, observations, memory proposals, escalation requests, and one typed return. It cannot create topology, mint capability, change budgets, mutate authority, or perform an unreceipted protected effect.

The epistemic contract remains layered. S4 produces assertions and reversible identity projections. S5 memory locates relevant continuity without deleting history. S2 belief settles whether an assertion is usable for a stated purpose. S1’s evidence graph explains coverage and causality. None becomes authoritative.

Evaluation remains layered. Return shape, artifact integrity, evidence and trajectory, belief, convergence, policy, human decision, and authorization each emit scoped results. There is no generic `validated` flag.

Promotion remains evidence-driven. D/C/G/H/R/M families must pass independently. Causal-prefix comparison identifies the earliest divergence. Mutants identify the earliest responsible owner. Recovery drills demonstrate reversibility. Measurements report actual deltas. That evidence may nominate a per-mode canary; it may not perform cutover.

The staged path is additive and reversible. Contracts and mutants come first. Pure and read-only behavior follows. Governance and epistemic producers precede protected writes. Parity and recovery precede promotion. Promotion precedes a reversible authority canary. Legacy writers remain until the rollback window and zero-use evidence pass.

**Design-settled:**

- proposal and authority separation;
- current-state and target-state modes;
- stable organization policy versus per-run work proposals;
- typed compiled IR and executable sealing;
- graph/loop composition;
- ledger-derived replay and disposable projections;
- claimant-addressed fencing;
- prospective truth admission;
- durable context-sensitive gates;
- authority-zero refusal;
- hierarchical budget ceilings and separately authorized effects as doctrine (graph-side budget normalization remains open per P4);
- memory/knowledge/belief non-collision;
- closed LEAF and escalation boundaries;
- typed gate states and jurisdictional arbitration;
- conjunctive promotion evidence;
- shadow-first, mutant-gated, reversible rollout.

**Still open:**

- operational audit of 036 capabilities;
- graph identity and evidence-resolver implementation;
- durable gate and refusal persistence;
- recursive sealed-subgraph implementation;
- multi-host fencing and provider-usage normalization;
- issuer and trust-root security for capability and policy minting (the S3 threat-model gap: who may mint capabilities and compile policy, and how that trust root is fenced);
- concurrency and contention behavior;
- belief calibration and retention policy;
- per-mode cutover ordering;
- numeric quality, latency, cost, storage, recovery, and operator-load thresholds;
- every production-fitness claim.

## What Remains Unproven

036 remains dark. The static Study 6 inventory found substantial authority, budget, receipt, and rollback code, but that is not an operational capability audit. Deployment wiring, multi-host behavior, current consumers, failure semantics, and production enforcement remain unverified.

Zero target-system measurements exist. There are no established graph-overhead, latency, cost, storage, contention, recall, belief-calibration, human-gate, recovery, or operator-load baselines.

The design is coherent at doctrine and interface level. Production fitness is unproven. Authority cutover is unproven. No green document, local test count, or self-reported convergence value closes that gap.

The next evidence class is one mutant-driven shadow vertical slice:

1. freeze a representative deep-research corpus and exact legacy build;
2. record legacy outcome distributions, causal prefixes, replay hashes, p50/p95 latency, token/tool/cost usage, receipts, recovery time, and human-gate timing;
3. compile one typed graph and execute its admitted sealed nodes through the full return/evidence/belief/policy machine;
4. invoke the dark adapter only after the legacy result;
5. preserve zero externally visible result difference;
6. inject wrong identity, unknown LEAF action, capability or budget widening, malformed return, missing evidence families, causal reorder, stale belief, premature convergence, policy bypass, stale gate, stale head/epoch/fence, lost never-forget references, receipt loss, and rollback crash;
7. require every safety mutant to fail at its expected earliest owner;
8. require deterministic replay, zero unauthorized appends, complete reference closure, passed recovery drills, and fully reported performance deltas.

[SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-010.md:13-17]

Only that evidence can move the program from integrated design toward implementation qualification. It still would not itself authorize production cutover.

## Convergence Report

- **Iterations:** 10 of 10 integration narratives completed.
- **Stop reason:** `maxIterationsReached`. Iteration 10 states that the maximum was reached and synthesis should proceed regardless of convergence telemetry. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-010.md:25-30]
- **Angle coverage:** iterations 1–8 addressed P1–P8 directly. Iteration 9 performed a cross-angle contradiction and no-bypass audit. Iteration 10 closed the settled/open split and specified the next evidence class. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/orientation.md:73-89] [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-009.md:3-19]
- **Recorded novelty trajectory:** `0.88 → 0.82 → 0.76 → 0.91 → 0.72 → 0.66 → 0.63 → 0.69 → 0.04 → 0.03`.
- **P4 spike:** iteration 4 rose to `0.91` because it replaced assumed 036 capabilities with a four-state source inventory and a six-component minimum build. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-004.md:27-31]
- **Late trend:** iteration 9 fell to `0.04` after finding no new component and resolving cross-angle tensions. Iteration 10 fell to `0.03` after converting residual uncertainty into a measurable shadow experiment. [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-009.md:30-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/006-cross-study-integration/research/lineages/cross-integration-sol-xhigh/iterations/iteration-010.md:25-30]
- **Convergence judgment:** P1–P8 are closed at integration-design level. The novelty series is self-reported executor telemetry under a maximum-iteration policy. It supports a narrative of declining conceptual novelty, but it is not an independent proof of completeness, correctness, or production readiness.