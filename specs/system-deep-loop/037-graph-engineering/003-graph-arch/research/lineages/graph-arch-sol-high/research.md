# GraphARC Governance Patterns for Graph-Based Deep-Loop

## 1. Executive Decision

Adopt GraphARC as a source of governance mechanisms, not as an authority implementation. Its admission checks, policy model, approval forms, materialization discipline, traces, budgets, and staged tests materially extend the agent-swarms and graphene-main studies, but its in-process result objects, callback approvals, checkpoint/session state, local meters, traces, and OTel spans cannot authorize a transition or define canonical truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md:21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-002.md:9]

The governing boundary remains the 036 authority plane: graph compilation and admission produce evidence; current gateway evaluation authorizes; a fenced typed append changes domain truth; replay verifies it; OTel and legacy views are projections. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99]

## 2. Relationship to Studies 1 and 2

| Prior decision | GraphARC result | Final delta |
|---|---|---|
| Study 1: typed executable graph IR | Admission and materialization operate on declared nodes, edges, writes, destinations, and costs. | **REFINE:** compile to a sealed graph plus a separate admission proof; neither is authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:101] |
| Study 1: safe waves and reducers | GraphARC validates DAG/fan-out structure and converts worker failures to typed data. | **CONFIRM + EXTEND:** require closed branch observations, deterministic reducer identity, reservation/fence ownership, and causal-prefix parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/fanout.py:1] |
| Study 1: human gates and replay | GraphARC supplies three approval mechanisms and observational replay. | **REFINE:** unify approvals into a durable task-instance gate and keep GraphARC replay as compatibility evidence beneath canonical 036 replay. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/approval.py:1] |
| Study 1: organization/work graphs | GraphARC policy distinguishes tool, node, edge, and spend resources with tenant/role context. | **EXTEND:** compile a provenance-preserving organization policy while keeping mode registry, tenant policy, admission, and authorization separately owned. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:141] |
| Study 2: compiled projection, not truth | GraphARC proposals and admitted/materialized objects are process-local and forgeable. | **CONFIRM:** every graph object remains a candidate or evidence artifact until live 036 verification and append. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-003.md:9] |
| Study 2: authority-zero refusal | Admission returns complete multi-check diagnostics and remedies. | **EXTEND:** add compile/admission refusal variants that can guide replanning but cannot decode as approval, authorization, budget, or domain evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:551] |
| Study 2: reference-closed replay and parity | GraphARC trace, audit, session, checkpoint, cost, and OTel records are separate and sometimes inferred. | **REFINE:** replay closed domain/authorization cuts, then compare causal prefixes in shadow parity; telemetry never repairs the ledger. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:19] |

## 3. Governing Principles

1. **Evidence is not authority.** Proofs, seals, approvals, refusals, quotes, parity certificates, traces, and spans constrain or describe a request; none selects a writer or changes domain state. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-015.md:9]
2. **Immutable and fresh facts stay separate.** Proposal topology, compiler/check versions, canonical arguments, registry bodies, and reducers can be sealed. Actor, capability, policy, domain head, authority epoch, budget availability, gate freshness, lease, and fence must be checked live. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-004.md:9]
3. **One fact, one owner.** Mode registry describes canonical modes and capability ceilings; organization policy governs tenant/role rules; admission proves graph validity; budgets own reservation and settlement; locks own leases/fences; 036 owns allow/deny and domain append; OTel owns no truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-012.md:9]
4. **Failures stop at their earliest owner.** Compile failure never reaches admission, admission failure never opens an approval, stale approval never reserves budget, stale fence never appends, and ambiguous opaque effects never auto-retry. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-010.md:9]
5. **Compatibility is projection-only.** GraphARC session rows, checkpoint files, trace JSONL, local cost, and direct callbacks may remain legacy observations during migration; they do not become alternate authorities. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-013.md:9]

## 4. Decision — GraphAdmissionProofV1

`GraphAdmissionProofV1` is a non-forgeable, immutable proof that a specific canonical proposal passed a named admission check set against a specific registry and bounded context. It is a prerequisite to 036 authorization, never an authorization result. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-003.md:9]

Required bindings include proposal/topology digest; entry/exit; node and edge identities; declared writes and destinations; compiler, schema, registry, admission-check-set, and canonicalization versions; cost quote inputs; reachable/acyclic/depth results; issue digest; issuer; issuance time; and proof digest/signature or trusted store reference. The verifier independently canonicalizes the proposal, validates issuer/schema/version/digest/subject/freshness, checks the proof was an all-pass result, and then hands only verified evidence to the gateway. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:9] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:1456]

The gateway must still re-bind actor, capability, tenant, canonical mode, current policy and registry heads, authority epoch, domain head, budget reservation, task-instance gate, lease/fence, and exact candidate event. A plain GraphARC `AdmissionResult` is forgeable process data and fails this boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-003.md:21]

## 5. Decision — SealedCompiledGraphV1 and TOCTOU Closure

`SealedCompiledGraphV1` seals executable closure separately from admission closure. Its digest covers the verified admission proof reference, canonical proposal/topology, registry-owned factory/body identities, canonical arguments, declared reads/writes/resources/destinations, reducers/routes, policy reference, and compiler/materializer/canonicalization versions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:1] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-004.md:23]

At execution, verify the seal and every immutable reference, then re-check live facts. Changes to the proposal, registry, factory/body, arguments, writes, destinations, reducer, policy head, dependency head, gate decision, budget reservation, claim, lease, or fence invalidate or block execution at the owning stage. `forward_args` defaults false; exceptions require a registered argument schema and sealed canonical bytes. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:1] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:31]

Use the sealed-reference-artifact store for the compiled artifact, with its registered artifact canonicalization profile. Other records use the encoding/version of their own owner contract; do not label every record `deep-loop-json@1`. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-types.ts:13] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:17]

## 6. Decision — OrganizationGraphPolicyV1

`OrganizationGraphPolicyV1` is an immutable tenant-scoped source document over `tool | node | edge | spend`. A compiled form preserves the exact source rule id, source digest/version, precedence explanation, tenant/role scope, matched resource/operation, decision, reason, and approver-role requirements. Deny outranks ask, which outranks allow; ambiguity, missing rule provenance, unknown fields/versions, handler failure, or malformed ASK fails closed. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/document.py:14] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:316] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:88]

Mode registry contributes canonical mode identity, structural metadata, and capability ceilings only. Policy binds the semantic canonical-mode projection; it cannot authorize by alias, rename, executor label, or presentation metadata. Tenant roles and gate kinds do not belong in mode registry. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-012.md:17]

The 036 audit must carry the compiled decision's source-rule reference/digest so a compiled adapter cannot erase provenance. Unknown policy aliases fail closed; any successor name for `CompiledOrganizationPolicyV1` requires an explicit schema alias/upcaster fixture. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-005.md:9]

## 7. Decision — GraphApprovalGateV1

GraphARC has three approval styles—proposal fingerprint files, role-routed ASK callbacks, and session holds—but the governed runtime uses one durable task-instance gate. `GraphApprovalGateV1` follows `open → decided | timed_out | cancelled`, followed by fresh dependency revalidation before any protected action. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/approval_file.py:1] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:1] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:31]

The gate binds run/task/attempt/branch, consequence digest, policy/rule/role, proposal/admission/seal references, dependency vector, opened/expiry time, decision identity, and idempotency key. Approval permits only a fresh gateway reevaluation; it never directly dispatches, reserves budget, acquires a lease, appends domain state, or invokes an effect. Direct callback and checkpoint-file bypasses are forbidden. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-006.md:9]

This requires a new non-domain graph-gate persistence service or adapter; the current shared runtime does not ship a generic graph approval store. The service remains authority-neutral. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:15]

## 8. Decision — Authority-Zero TransitionRefusalV1

Compile and admission failures emit variants of `TransitionRefusalV1` containing stable code, phase, subject, details, evidence references, violated invariant/rule, and advisory remedies. All applicable checks run so one response can preserve the complete rejection set. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:551] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:1456]

Refusal has zero authority: it cannot decode as a domain event, gate decision, authorization audit, budget receipt, seal, or effect intent. Remedies can seed a new proposal, but the replan gets a new candidate identity and must compile, admit, seal, gate, reserve, and authorize anew. Partial admission or trimming rejected work is forbidden. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-007.md:9]

Persist these non-domain records in a new refusal journal/adapter rather than the canonical domain ledger. Parser, UI, transport, and infrastructure errors that occur before a governed candidate exists are not `TransitionRefusalV1`. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-011.md:13]

## 9. Decision — Ledger-First Observability and Replay-to-OTel

`GraphExecutionEventV1` is a registered payload family inside the existing 036 domain envelope/ledger, not a graph-local log. It records bounded transition facts and references for runs, tasks/attempts, nodes/routes, state commits, gate/refusal links, budgets, effects, graph/seal/reducer identities, causation, and artifacts. Envelope sequence, previous hash, authority epoch, canonical bytes, and append receipt remain owned by 036. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-008.md:9] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62]

Canonical replay verifies reference-closed domain and authorization cuts, hashes, schemas/upcasters, graph/topology/reducer/projection versions, causal references, sealed payload/artifact digests, and final fingerprints before folding domain events in ledger order. Unknown versions, open references, corruption, nondeterminism, or checkpoint drift make the projection unavailable. GraphARC's last-write-wins trace replay remains observational only. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:199] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:105]

OTel is a redacted, idempotent projection keyed by closed cut, exporter contract, sink, and redaction policy. Stable span identity derives from canonical event/causation identities. Export lag, sampling, duplicates, provider outage, or missing SDK cannot alter runtime outcome. A send with unknown receipt becomes `export_unknown` and is reconciled, not blindly resent. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/otel.py:148]

Disagreement is asymmetric: projection/trace/session/checkpoint/OTel disagreement quarantines and rebuilds the projection; canonical ledger verification failure blocks dependent reads and promotion. Never select the newest timestamp or rewrite committed history. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-008.md:162]

## 10. Decision — Budget Admission, Reservation, Debit, and Receipt

GraphARC's registry-derived worst-case cost improves admission but is only `GraphBudgetQuoteV1`. The existing hierarchical-budget authority owns real reservations, child allocations, debits, settlements, releases/refunds, exhaustion, and receipts. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/budget.py:1] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/gateway/spend.py:1] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:1]

Order the lifecycle as quote/admission → human wait without reservation → fresh gate revalidation → atomic reservation/child allocation → claim/lease/fence → live authorization → dispatch debit → observed settlement → release/refund of unused capacity. Every attempt, including failure, debits and settles. Exact retries use stable operation/dispatch/receipt identities. Unknown or excess usage blocks; budget, time, or iteration exhaustion is an explicit incomplete/escalated outcome, never convergence. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-009.md:9] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-014.md:9]

Hard provider spend requires authenticated usage and pricing receipts. Local token/call/time meters cannot promise it. Resume cannot reset spent or reserved balances; fencing protects budget mutations in their declared store. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_budget_enforcement.py:1]

## 11. Decision — Runtime Composition and 036 Verification Order

The end-to-end protocol is a receipt-linked saga, not a cross-ledger ACID transaction:

1. Canonicalize proposal and identities.
2. Compile source policy and graph IR.
3. Evaluate admission and emit proof or authority-zero refusal.
4. Materialize and seal executable closure.
5. Evaluate organization policy; DENY refuses, ASK opens a gate, ALLOW continues.
6. Wait without holding scarce reservation/lease/fence resources.
7. Revalidate gate consequence and dependency vector.
8. Atomically reserve hierarchical budget and allocate child envelopes.
9. Acquire claim/lease/fence in canonical resource order.
10. Build `GraphTransitionEvidenceV1` as a reference-closed verification bundle.
11. Invoke the graph-specific 036 adapter, which makes identity/evidence verification mandatory and re-checks current actor, capability, policy, registry, domain head, authority epoch, reservation, lease/fence, and candidate event.
12. Durably append the authorization audit, then perform one exact fenced domain append.
13. Persist effect intent before invocation; use target idempotency or conclusive reconciliation for retries.
14. Debit/settle usage, release unused resources, and record all terminal branch observations.
15. Replay closed cuts, project to compatibility views/OTel, and compare shadow causal prefixes.

[SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-015.md:9] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-014.md:23]

The graph evidence-resolver is a mandatory new seam because generic gateway identity/evidence binding is optional. Missing or unverified graph identity/evidence denies. Opaque effects that may have applied become `in_doubt`; without idempotency or trustworthy read-after-write reconciliation, only an operator may resolve them. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-015.md:11]

## 12. Decision — Governance Mutants and Staged Promotion

Promotion requires a governance mutant corpus, not only happy-path examples. The lineage defines 28 core mutants across admission bypass, proposal/seal mutation, policy rename laundering, rule-provenance loss, argument escalation, stale or cross-task approval, partial-denial execution, budget double-spend/reset, stale fence/ABA, missing intent, opaque retry, trace/audit disagreement, open replay references, normalization laundering, incomplete fan-in, legacy effect leakage, and certificate-selected authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-010.md:45]

Each mutant specifies its earliest owning gate, expected refusal/evidence, zero-mutation invariants, and required shadow observation. Later layers must not turn an earlier failure into success. Tests must cover absent, malformed, stale, mismatched, duplicated, reordered, torn, corrupt, and ambiguous evidence, not only explicit denial. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:23]

Use staged gates G0–G7: schema/codec → admission/seal → policy/gate/refusal → budget/fence/effect → canonical replay/OTel → shadow causal-prefix parity → gated canary/rollback → separate 036 cutover. `GraphParityPromotionEvidenceV1` wraps a fresh generic parity certificate; neither selects the writer. Cutover and rollback are distinct 036 transitions, and post-selection requests never fall back per request to legacy. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-013.md:9]

## 13. Blog Corpus Grounding

All 12 posts were read in two bounded passes. They support typed topology, fan-out/reduce, deterministic gates, maker/checker separation, evaluation fixtures, isolation, explicit budgets, observability, and choosing graphs only when topology/control state has value. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-016.md:23] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-017.md:23]

They do not prove that graphs replace RAG universally, deliver claimed product/economic outcomes, make model votes independent, turn manager PASS into authorization, make worktrees fences, make local token estimates hard spend, or make retrieval paths truth. Repeated claims across the corpus are not independent corroboration. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-016.md:74] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-017.md:86]

GraphARC faithfully instantiates much of the structural guidance—typed graphs, admission, policy, approvals, verification, budgets, traces, replay, retrieval, and staged examples—but it does not supply trust-separated proof, canonical authority, multi-host fencing, hard provider accounting, or exactly-once opaque effects. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/orientation.md:36]

## 14. Explicit When-Not-to-Use Boundaries

- Use a typed function, harness, loop, manual process, or ordinary retrieval when work is small, sequential, read-only, directly testable, tightly supervised, or lacks material coordination benefit. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:1]
- Do not add durable graph governance to presentation-only work, deterministic local computation, or immutable content-addressed writes unless another protected consequence exists. [INFERENCE: governance cost is justified by a protected consequence, not topology alone]
- Do not treat topology, worktrees, fresh context, model diversity, majority vote, manager PASS, or retrieved paths as identity, evidence independence, ownership, fencing, authorization, or truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:21]
- Do not deploy state-changing graphs without durable identity, current 036 authorization, canonical append, recovery, and rollback. Missing controls make high-risk work manual or unavailable; risk is not a waiver. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:129]
- Do not promise hard provider spend without authenticated usage/pricing receipts, multi-host fencing without a target atomic primitive or durable broker, or exactly-once effects without target idempotency/reconciliation. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:131]
- Do not use a human gate for acknowledgement/preference with no protected consequence, and do not use `TransitionRefusalV1` for parser/UI/infrastructure errors before a governed candidate exists. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:132]
- Do not infer success or convergence from budget, time, or iteration exhaustion. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-009.md:21]

## 15. Implementation Dependency Order

This research does not authorize implementation.

1. Freeze terminology, wire names, owner-specific canonicalization/version labels, and negative guarantees in an implementation spec/ADR.
2. Register graph artifact kinds and implement admission proof, compiled seal, and independent verifiers.
3. Implement source/compiled organization policy with mode-registry projection and preserved 036 audit provenance.
4. Implement the non-domain refusal journal and durable task-instance graph gate.
5. Implement the graph transition evidence resolver and mandatory gateway profile.
6. Register graph domain payloads and deterministic reducer/projection inside the existing 036 ledger.
7. Integrate budget authority, locks/fences, and effect recovery in receipt-linked order.
8. Build verified replay-to-OTel as a one-way projection.
9. Implement independent shadow adapters, closed observations, mutants, and promotion evidence.
10. Run dark read, shadow, gated canary, separate 036 cutover, and rollback drills before retiring compatibility surfaces.

[SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:93]

## 16. Acceptance Checks

1. New payloads reject unknown fields/versions, noncanonical bytes, invalid digests, unbounded collections, and subject mismatch under their owning encoding.
2. Any relevant proposal, compiler/check, registry, mode, policy, argument, body, reducer, write, destination, or dependency-head change invalidates the correct proof/seal before execution.
3. ASK creates one task-instance gate; stale or cross-context reuse causes zero reservation, lease, append, or effect.
4. Compile/admission refusal preserves complete diagnostics and cannot decode as authority-bearing evidence.
5. Every graph transition requires verified actor, capability, evidence bundle, domain head, authority epoch, policy, and event registry.
6. Authorization audit durably precedes one exact fenced domain append.
7. Reservations follow gate revalidation; every attempt debits and settles; unknown usage blocks.
8. Fence comparison occurs atomically with the protected mutation in the declared store.
9. Effect intent precedes invocation; ambiguous opaque application is never blindly resent.
10. Replay verifies closed references, hashes, authorization linkage, causal order, versions, and final fingerprint before export.
11. Shadow parity observes every expected branch/case, suppresses live effects/authority mutation, and rejects mutants at the earliest owner.
12. Promotion evidence cannot select a writer; a separate 036 transition performs cutover/rollback.
13. Compatibility aliases/upcasters are explicit; unknown names fail closed.
14. A final applicability review proves coordination/risk value and target-owner primitive availability.

[SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:106]

## 17. Residual Open Questions and Confidence

| Open question | Confidence in boundary | Closure evidence |
|---|---:|---|
| Durable storage/envelope for graph gate and refusal records | 0.85 | Implementation spec choosing owner, replay, retention, and authority-neutral event types. |
| Graph evidence-resolver interface and mandatory gateway profile | 0.85 | Typed API plus negative tests that unverified identity/evidence always denies. |
| Provider usage normalization and hard-cost settlement | 0.70 | Authenticated provider receipts with currency/model/pricing version and unknown-usage blocking. |
| Multi-host protected mutation | 0.70 | Backend atomic compare-fence-and-write or one durable fenced broker. |
| Opaque effects | 0.95 that auto-retry is unsafe | Target idempotency or trustworthy read-after-write reconciliation; otherwise permanent operator resolution. |
| Final wire names and owner encodings | 0.85 | One implementation spec/ADR and compatibility fixtures. |

[SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-020.md:82]

## Eliminated Alternatives

- A graph-local omnibus ledger or cross-ledger ACID transaction: duplicates authority and is unsupported by the consulted runtime. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:195]
- Treating admission, materialization, approval, quote, refusal, trace, checkpoint, OTel, or parity certificate as authorization: violates the authority plane. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-015.md:47]
- Direct compiled-policy or session/checkpoint invocation: bypasses audit, task identity, and fresh verification. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:37]
- Holding budget reservations or leases across human wait: invites starvation/deadlock and stale authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-014.md:31]
- Final-state-only parity or normalization of semantic governance fields: can hide earlier unauthorized effects or reordered causation. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-013.md:21]
- Blind retry after opaque effects: duplicates consequences when application is ambiguous. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-014.md:37]

## Divergence Map

No divergent pivots were executed because the configured stop policy forced the full 20 iterations and treated early convergence as telemetry. Breadth was created explicitly through eight mechanism passes, five runtime/authority integration passes, two blog-corpus passes, one falsification pass, one schema matrix, and one independent final cross-check. The remaining frontier is implementation-specific: gate/refusal persistence, mandatory evidence resolution, provider receipts, backend fencing, and target effect reconciliation. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/deep-research-dashboard.md:1]

## Open Questions

The reducer still lists four broad initial questions as open because several iteration records answered them through detailed findings rather than exact question-text matching. Substantively, the research conclusions are present in Sections 5–12. The genuine unresolved items are the six target/implementation dependencies in Section 17; they must not weaken the governing contracts. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/findings-registry.json:1]

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 20
- Questions answered by reducer: 1 / 5
- Substantive coverage: all 8 prioritized angles, all 12 blog posts, all 5 named runtime integration surfaces, and the 036 authority plane
- Average `newInfoRatio`: 0.75
- Last three ratios: iteration 18 = 0.79, iteration 19 = 0.79, iteration 20 = 0.60
- Convergence threshold: 0.05
- Convergence behavior: pre-cap convergence was telemetry only under `max-iterations`; no early synthesis occurred
- Divergent pivots: none
- Final status: hard cap reached with implementation-specific questions retained

## References

- [Orientation seed](../../../../orientation.md)
- [Study 1 synthesis](../../../../../001-agent-swarms/research/research.md)
- [Study 2 synthesis](../../../../../002-graphene-main/research/research.md)
- [Iteration evidence](iterations/)
- [Structured delta resource map](resource-map.md)
- GraphARC source under `specs/system-deep-loop/037-graph-engineering/context/graph-arch/`
- All 12 graph-engineering posts under `specs/system-deep-loop/037-graph-engineering/context/blog-posts/`
- 036 authority plane under `specs/system-deep-loop/036-deep-loop-innovation/`
- Shared runtime owners under `.opencode/skills/system-deep-loop/runtime/lib/`
