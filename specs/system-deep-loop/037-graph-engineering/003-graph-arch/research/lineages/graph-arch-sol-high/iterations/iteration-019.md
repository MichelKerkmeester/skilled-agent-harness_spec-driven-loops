# Iteration 19: Concrete Graph Contract and Protocol Matrix

## Executive result

The implementation boundary is now closed enough to code without inventing a second authority plane. Eight graph-specific semantic families are required, but only the 036 transition ledger and the already-owned budget, receipt/effect, fencing, sealed-artifact, mode-registry, and parity services remain authoritative. A graph contract may describe or reference their facts; it must not reproduce their mutable lifecycle fields.

1. **Create graph semantic payloads, compose infrastructure authority — REFINE Decision 1 and EXTEND iteration 15's evidence bundle.** The new families are `GraphAdmissionProofV1`, `SealedCompiledGraphV1`, `OrganizationGraphPolicyV1`, `CompiledOrganizationGraphPolicyV1`, `GraphApprovalGateV1`, the two `TransitionRefusalV1` variants, `GraphExecutionEventV1`, `GraphBudgetQuoteV1`, and `GraphParityPromotionEvidenceV1`. `GraphTransitionEvidenceV1` is a reference-closed request bundle, not an additional authority record. Ledger frames, gateway decisions, append receipts, reservations/debits/settlements, effect intents/confirmations/recoveries, fence capabilities, sealed-object references, registry identity, and generic parity certificates are existing primitives and must be composed. [SOURCE: iteration-015.md:25-44] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:213-317] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-types.ts:75-115]

2. **Admission and sealing are two immutable evidence stages, not one self-attested object — CONFIRM iterations 3-4 and REFINE iteration 18.** Admission binds the deterministic check closure and observed dependency heads; sealing subsequently binds the executable closure. Neither grants authority or guarantees freshness. Governed `forward_args` is false unless a registered schema validated canonical argument bytes that appear in both proof and seal. [SOURCE: iteration-003.md:9-17] [SOURCE: iteration-004.md:9-26] [SOURCE: iteration-018.md:9-11]

3. **Policy ASK, refusal, and authorization denial remain three different protocols — REFINE iterations 5-7.** Organization policy is a source artifact plus deterministic compiled projection; pure ASK opens a task-instance gate; compile/admission failures produce authority-zero refusals; and stale/malformed evidence presented to 036 produces an authorization denial in its audit. `GraphApprovalDecisionV1` and `GovernancePromotionEvidenceV1` are eliminated aliases, not parallel families. [SOURCE: iteration-005.md:5-13] [SOURCE: iteration-006.md:5-9] [SOURCE: iteration-007.md:118-172]

4. **Graph execution is a registered 036 payload family and replay-to-OTel is one-way — CONFIRM Decision 4 and iteration 8.** `GraphExecutionEventV1` specializes domain meaning while the 036 envelope owns stream sequence, previous hash, authority epoch, canonical bytes, and append receipt. A verified, reference-closed ledger cut is folded into a projection and exported idempotently to OTel; OTel data never repairs or authorizes the ledger. [SOURCE: iteration-008.md:5-11] [SOURCE: iteration-008.md:134-181] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:41-79]

5. **Budget, effect, and fence lifecycles stay with their existing owners — CONFIRM iterations 9, 14, and 15.** Only `GraphBudgetQuoteV1` is graph-specific. Reservation, per-attempt debit, settlement/release receipts, effect intent/confirmation/recovery, and fence capabilities are referenced owner records. They bind stable dispatch identity and execute in the ordered receipt-linked saga; graph events cannot copy a balance, effect status, or fence epoch and call it authoritative. [SOURCE: iteration-009.md:9-48] [SOURCE: iteration-014.md:5-24] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-types.ts:10-91] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/types.ts:183-243]

6. **Promotion evidence is a graph closure layered over the generic parity certificate — REFINE iterations 10 and 13.** The canonical name is `GraphParityPromotionEvidenceV1`. It adds graph contract digests, the normalization allowlist, known-defect dispositions, and complete mutant results to an existing fresh `ParityCertificate`; a separate 036 transition consumes it. It cannot choose the writer, enable effects, or waive divergence. [SOURCE: iteration-013.md:21-21] [SOURCE: iteration-013.md:131-155] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:260-310]

7. **Compatibility is a governed adapter migration, not a GraphARC authority upgrade — EXTEND iteration 18's adoption boundary.** GraphARC proposal, admission, materialization, session, trace, and cost objects remain inputs or projections behind the adapter. Migration proceeds dark-read, shadow, gated canary, then 036-authorized cutover with rollback; direct compiled invocation stays hidden. Small static/read-only workflows and environments lacking durable identity, storage, or atomicity should not adopt the full stack. [SOURCE: iteration-018.md:9-28] [SOURCE: iteration-018.md:63-108] [SOURCE: iteration-010.md:9-21]

## Master decision matrix

| Contract | Kind and owner | Producer / verifier | Immutable closure | Freshness / lifecycle | Integration and 036 order |
|---|---|---|---|---|---|
| `GraphAdmissionProofV1` | **New payload**; graph admission service | Deterministic checker / trusted graph evidence resolver and 036 adapter | Proposal/IR digest, compiler/check profile, registry and policy digests, enabled check set, ordered diagnostic closure, topology/port/state/reducer/write/resource/capability/effect/gate/budget-estimate digests, canonical args contract | Candidate -> admitted proof; immutable thereafter. Dependency head or policy/registry/compiler drift makes it ineligible and requires a new candidate/proof. | Produced before materialization; referenced by seal and `GraphTransitionEvidenceV1`; verified before live policy/authority evaluation. |
| `SealedCompiledGraphV1` | **New payload stored through existing sealed-artifact service**; governed materializer | Materializer/sealer / graph seal resolver | Admission digest, graph IR, node body/factory/artifact digests, validated typed arguments, declared reads/writes/state/reducer, destinations, effect/gate/resource manifests, compiler/materializer/kernel flags and dependency digests | Materialized -> sealed -> verified; content immutable. Fresh authority, leases, budgets, and policy are deliberately external. | Produced after admission; resolved before gate/036. Never expose raw runnable on the governed surface. |
| `OrganizationGraphPolicyV1` | **New source payload**; organization policy authority | Authenticated policy publisher / policy compiler | Policy identity, organization/tenant scope, default deny, ordered stable rule IDs, subject/resource/action, `deny|ask|allow`, roles, spend bases/thresholds, source provenance and digest | Draft -> published -> superseded/revoked. A digest is immutable; current deployment is live state. | Source to compiled form; never itself an authorization decision. |
| `CompiledOrganizationGraphPolicyV1` | **New deterministic projection**; policy compiler | Compiler / 036 policy registry and evaluator | Source digest, compiler/version, canonical mode identity and registry projection digest, effective ceiling, exact precedence, normalized matchers, decisive/considered rule IDs, ASK/gate requirements | Compile -> register -> active/superseded. Source, compiler, mode-registry, or ceiling drift requires recompilation/reregistration. | Registered as a 036 `TransitionPolicyDefinition`; evaluation precedes any allow and is audited by 036. |
| `GraphApprovalGateV1` | **New aggregate payload/events using existing durable event storage**; gate service | Policy/gate adapter and authenticated approver / live gate resolver | Gate/request ID, exact run/task/branch/consequence, proof/seal/policy/quote digests, actor/role requirements, allowed principals, dependency vector/heads/epoch, expiry and decision-event reference | `requested -> pending -> approved | denied | expired | revoked`; terminal decision immutable. No reservation or lease during wait. Approval only permits revalidation. | Pure ASK opens gate. Approved gate is referenced in a new 036 request after all live facts are rechecked; it never directly releases execution. |
| `CompileTransitionRefusalV1` / `AdmissionTransitionRefusalV1` | **New discriminated payload variants**; compiler/admission boundary | Failed stage / caller or replanner | Candidate/request digest, stage/profile/check set, observed dependencies, complete sorted diagnostics with stable codes, retry predicate, new-candidate requirement | Terminal diagnostic for one candidate; no mutation, capability, receipt, reservation, patch, or command. | Returned before 036. Pure ASK is not a refusal; malformed/stale proof at 036 is a gateway denial instead. |
| `GraphExecutionEventV1` | **New registered domain-event payload in existing 036 ledger**; graph execution adapter | Authorized/fenced executor / ledger schema plus deterministic reducer | Event variant, run/task/node/attempt/branch coordinates, state transition/version, causal references, evidence/seal/proof/policy/gate/budget/fence/effect/output references, explicit terminal/incomplete reason | Append-only event. 036 envelope supplies sequence/hash/authority/receipt; projection is rebuildable. | Emitted only after fresh gateway allow and required fence; append receipt precedes dispatch/effect continuation as specified by the saga. |
| `GraphExecutionProjectionV1` and replay-to-OTel | **New derived projection/export adapter**, never authority | Deterministic reducer / replay fingerprint and parity comparator | Reducer/schema/normalization versions, verified source heads, reference closure, causal ordering, projection fingerprint | Rebuild on a closed verified cut; gap/corruption/redaction marks incomplete. OTel export is idempotent and disposable. | Fold 036 graph events plus referenced owner receipts; export after verification. No OTel-to-ledger writeback. |
| `GraphBudgetQuoteV1` | **New informational payload**; pricing/admission adapter | Registry/pricing estimator / admission and gate display | Proposal/seal basis, pricing/registry/replay digests, full four-dimensional estimate, multiplicities/cycle bound, observed budget head, expiry | Quote -> consumed/stale/expired; never reserves. | Before gate/admission proof finalization; 036 request later references owner budget evidence. |
| Reservation / debit / settlement records | **Composition of existing hierarchical-budget primitives**; budget authority | Budget authority / dispatch and settlement adapters | Scope path vector, stable dispatch identity, proof/seal/pricing digests, reserved/debited/returned vectors and owner receipts | Reserve only after gate revalidation; debit before each attempt; commit every attempt including failure; release only proven unused amount; anomaly blocks. | Owner receipts join `GraphTransitionEvidenceV1`; graph event references them after corresponding durable operations. |
| `GraphParityPromotionEvidenceV1` | **New graph wrapper over existing `ParityCertificate`**; graph promotion evaluator | Parity harness / 036 promotion-policy evaluator | Generic certificate reference, graph contract/build/adapter/replay/reducer/policy/seal digests, closed case and mutant manifests/results, normalization allowlist, defect dispositions, complete observations | Candidate evidence -> verified/fresh -> consumed or expired/superseded. It is never a writer lease. | A distinct 036 cutover transition consumes fresh evidence; authority remains legacy until its durable append. |

All new JSON payloads use closed schemas, UTF-8 canonical JSON under the existing `deep-loop-json@1` canonicalizer, SHA-256 lower-case 64-hex digests, explicit `schema_version: 1`, bounded strings/collections, and rejection of unknown fields. The sealed-artifact service already defines `sha256` and `deep-loop-json@1`; introducing a second graph canonicalizer would create unverifiable cross-service equality. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-types.ts:13-18] [SOURCE: iteration-003.md:24-86]

## Per-contract field and failure decisions

### Admission proof and compiled seal

`GraphAdmissionProofV1` has `proof_id`, `schema_version`, `status='admitted'`, `proposal_id`, `proposal_digest`, `graph_ir_digest`, `compiler_id/version/flags`, `check_profile_digest`, `checks_executed`, `diagnostic_closure_digest`, `registry_snapshot_digest`, `capability_snapshot_digest`, `organization_policy_source_digest`, `compiled_policy_digest`, `mode_projection_digest`, `known_live_graph_digest`, `budget_quote_digest`, `budget_observation_head`, and digest fields for topology, ports, state, reducer, effective writes, resources, gates, effects, and canonical typed arguments. It carries issuer identity and an issuance time for audit, but freshness is verified from referenced heads rather than trusted from time alone.

`SealedCompiledGraphV1` has `seal_id`, `schema_version`, the proof and proposal/IR digests, ordered node/edge manifests, factory and body artifact references, canonical typed argument bytes plus schema digest, declared read/write/state/reducer contracts, route destinations, gate/effect/resource manifests, and compiler/materializer/kernel/dependency/environment digests. Secrets and live credentials are references resolved only after authorization, never seal content.

Stable failures include `unsupported_schema`, `noncanonical_payload`, `digest_mismatch`, `unknown_check`, `incomplete_check_set`, `proposal_mismatch`, `dependency_stale`, `policy_stale`, `registry_stale`, `budget_observation_stale`, `unvalidated_arguments`, `unsealed_factory`, `undeclared_write`, `unknown_destination`, and `materializer_mismatch`. A verification failure produces refusal before the gateway or a 036 denial when discovered at that boundary; it never patches the proof/seal in place. [SOURCE: iteration-003.md:86-114] [SOURCE: iteration-004.md:110-113] [SOURCE: iteration-018.md:9-9]

### Organization policy and approval gate

`OrganizationGraphPolicyV1` retains author-specified order and provenance. `CompiledOrganizationGraphPolicyV1` contains a normalized resource index and exact precedence: platform ceiling, canonical mode ceiling, organization deny, ASK, then allow only within every ceiling; default is deny. Evaluation returns policy/source/compiled digests, decisive rule, considered rule IDs, reason code, required approver role, and matched spend basis. Identity resolution is mandatory for governed actions.

`GraphApprovalGateV1` is the aggregate view over immutable request and decision events. Required fields include `gate_id`, `request_event_ref`, `status`, `boundary`, `run_id`, `task_instance_id`, `branch_id`, exact `consequence_digest`, proof/seal/policy/quote refs, actor identity, required and allowed approver roles/principals, dependency vector with authority/policy/registry/budget heads and epochs, `expires_at`, decision identity/time/reason/signature, and terminal event reference. Codes are `approval_required`, `approver_not_allowed`, `role_mismatch`, `consequence_mismatch`, `dependency_mismatch`, `gate_expired`, `gate_revoked`, `gate_denied`, and `ambiguous_task_instance`. Session files, callbacks, and checkpoints are projections or transports only. [SOURCE: iteration-005.md:9-13] [SOURCE: iteration-006.md:9-26] [SOURCE: iteration-018.md:11-11]

### Refusals

`TransitionRefusalV1` is a closed union with shared `refusal_id`, `schema_version`, `boundary`, `candidate_id/digest`, `profile_digest`, `observed_dependency_vector`, `checks_executed`, complete sorted `diagnostics`, `retry_predicate`, `requires_new_candidate`, and audit time. `CompileTransitionRefusalV1` adds parser/compiler/schema coordinates; `AdmissionTransitionRefusalV1` adds proof/check-profile/registry/policy/budget observation coordinates. Existing GraphARC codes are preserved under a namespace; protocol codes add malformed/incomplete/noncanonical/stale conditions. Remedies are bounded prose/data and never executable patches. [SOURCE: iteration-007.md:9-79] [SOURCE: iteration-007.md:118-118]

### Execution, replay, and observability

The event variant set covers run/task/attempt/branch lifecycle, route choice, state commit, explicit incomplete state, and references to gate/refusal/budget/effect facts. It excludes 036 envelope fields and excludes copied owner status. The reducer first verifies each ledger frame and append receipt, then resolves referenced owner facts at their recorded heads, validates causal closure, applies the registered reducer, and emits a projection fingerprint. Missing or redacted nonessential observations produce a marked partial observability view; missing authority or causal facts make replay unverifiable. OTel spans use deterministic event/task-based export keys and links, but host time, duration, token chunks, trace IDs, and rendered state remain observational. [SOURCE: iteration-008.md:44-155] [SOURCE: iteration-008.md:181-218]

### Budgets and promotion

The graph quote is never consumed as balance truth. The owner reservation binds the hierarchical path (`program/mode/lineage/iteration` as applicable), stable dispatch identity, seal/proof/pricing digests, vector amount, head, and expiry. Attempt debit occurs before spawn; settlement records observed usage, remaining reservation, returned amount, source receipt, and anomalies. Codes include `quote_stale`, `estimate_incomplete`, `reservation_denied`, `reservation_expired`, `budget_exhausted`, `deadline_exhausted`, `unknown_usage`, `actual_exceeds_reservation`, and `settlement_conflict`. Mid-run exhaustion is explicit `incomplete-budget-exhausted`, never success or convergence. [SOURCE: iteration-009.md:9-9] [SOURCE: iteration-009.md:162-199] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-types.ts:10-91]

`GraphParityPromotionEvidenceV1` binds one verified generic certificate, the graph observation/comparator schema, admission/seal/policy/mode/gate/budget/authorization/effect contract digests, build and adapter digests, replay/reducer/projection digests, complete case and mutant manifests/results, causal-normalization allowlist, known-defect dispositions, observation completeness, legacy-authority assertion, issuance/expiry, and evidence digest. Codes include `certificate_invalid`, `certificate_stale`, `case_set_incomplete`, `mutant_set_incomplete`, `divergence_present`, `authority_mutation_observed`, `effect_observed`, `normalization_unapproved`, and `legacy_not_authoritative`. [SOURCE: iteration-013.md:21-21] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:260-310]

## Integration dependency and ordering table

| Order | Owner action | Durable output | Consumer / stop rule |
|---:|---|---|---|
| 1 | Compiler validates governed candidate | Compile refusal or canonical IR | Stop on refusal. |
| 2 | Admission checker resolves frozen registry/policy/mode/budget observations | Admission refusal or `GraphAdmissionProofV1` | Pure ASK diverts to gate; any deny rejects whole candidate. |
| 3 | Materializer resolves factories/bodies and canonical typed args | `SealedCompiledGraphV1` in existing artifact store | Stop on seal verification or dependency drift. |
| 4 | Policy evaluator opens ASK when needed | `GraphApprovalGateV1` request/terminal event | Wait holds no budget reservation, fence, or runnable authority. |
| 5 | Governed adapter revalidates gate, seal, proof, policy, registry, quote, actor, heads | Closed `GraphTransitionEvidenceV1` | Any mismatch creates new candidate/gate as required. |
| 6 | Budget authority reserves the exact hierarchical vector | Owner reservation receipt | Stop on denial/staleness; never infer reservation from quote. |
| 7 | 036 gateway evaluates the exact request and writes audit | `GatewayAllowProof` or durable deny | Deny advances no domain state. |
| 8 | Resource owner acquires fence in its declared atomicity domain | Fence capability/receipt | Stop if freshness/atomicity cannot be proven. |
| 9 | 036 ledger appends `GraphExecutionEventV1` under allow proof | Durable append receipt | Receipt, not API return, establishes the transition. |
| 10 | Budget authority debits attempt; effect owner records intent before external action | Debit and effect-intent receipts | Ambiguous opaque effect becomes `in_doubt`; no blind retry. |
| 11 | Worker dispatches, then owners settle usage/effect outcome | Settlement, confirmation/recovery receipts and referenced graph events | Every attempt settles, including failures. |
| 12 | Replay verifies closed cuts; exporter emits OTel | Projection fingerprint and disposable telemetry | Projection never feeds authority. |
| 13 | Parity issuer wraps generic certificate with graph closure | `GraphParityPromotionEvidenceV1` | Separate 036 transition performs cutover; rollback remains available. |

## Eliminated alternatives and naming resolutions

- `CompiledOrganizationPolicyV1` is renamed `CompiledOrganizationGraphPolicyV1` to avoid collision with non-graph organization policy compilers while preserving the iteration-5 semantics.
- `GraphApprovalDecisionV1` is not a sibling contract. Decision is one terminal event/reference in the `GraphApprovalGateV1` lifecycle.
- `GovernancePromotionEvidenceV1` is retired in favor of `GraphParityPromotionEvidenceV1`, which states both scope and dependency on generic parity.
- `MaterializationSealV1` is not additional state. The canonical manifest is `SealedCompiledGraphV1`; the existing sealed-artifact reference is its storage reference.
- `AdmissionProofV1` is shorthand only; wire/schema identity is `GraphAdmissionProofV1`.
- `TransitionRefusalV1` is a discriminated union, not a third concrete wire payload in addition to compile/admission variants.
- No graph-local authorization ledger, budget ledger, effect ledger, gate-release authority, telemetry ledger, or promotion authority is introduced.
- No schema copies mutable owner facts such as current balance, gate status, fence freshness, effect result, or writer selection; it holds canonical references and verifies them at use.

## Compatibility and migration

1. Put the governed adapter in front of GraphARC; use proposals and local checker results only as candidate inputs.
2. Disable `forward_args`; selectively enable it only after per-kind schema registration and canonical validation are proven in admission and seal.
3. Hide raw `CompiledGraphARC.invoke`; expose a task-instance-bound governed invocation API.
4. Initially write/verify new payloads in dark mode while legacy remains authoritative; compare closed observations without effects.
5. Shadow replay and policy decisions, then issue graph parity evidence only for complete case/mutant sets with zero unapproved divergence.
6. Canary through a separate 036 authority transition; retain legacy rollback for the certificate's required window.
7. Remove compatibility projections only after no installed producer/consumer reads the old aliases. Unknown versions and missing canonical references fail closed throughout.

## Mutant coverage

| Mutant | Required detection boundary |
|---|---|
| Change proposal, registry, policy, mode, compiler, budget head, or check set after proof | Admission-proof freshness verifier rejects before materialization/036. |
| Enable unvalidated `forward_args`, swap factory/body, add undeclared write, or change reducer/destination | Seal verifier rejects; no raw runnable exists. |
| Reorder deny/ASK/allow, drop provenance, use noncanonical mode alias, or omit actor identity | Compiled-policy registration/evaluation rejects. |
| Approve a node name rather than task instance, replay approval for sibling branch, alter consequence, or decide after expiry | Gate resolver rejects and requires a new task-bound request. |
| Put executable patch/capability/receipt in refusal, omit one diagnostic, or treat pure ASK as refusal | Refusal schema/semantic verifier rejects. |
| Duplicate 036 envelope fields, copy owner status, append without allow/fence, reorder causal parent, or treat incomplete as success | Event schema, gateway, ledger, or replay rejects. |
| Treat quote as reservation, double-debit, omit failed-attempt settlement, release unproven capacity, or map exhaustion to convergence | Budget authority/reducer rejects and blocks. |
| Retry an ambiguous opaque effect or infer confirmation from worker success | Effect-recovery owner records `in_doubt`; dispatch remains blocked. |
| Export OTel before verified replay, feed telemetry back into projection, or normalize a material difference | Replay/parity fingerprint diverges; promotion evidence is refused. |
| Omit mutant/case, use stale generic certificate, allow graph path to mutate authority/effects, or cut over directly from evidence | Promotion verifier/036 policy rejects. |

These mutants operationalize the falsification boundaries from iteration 18 rather than merely restating happy paths. [SOURCE: iteration-018.md:28-108]

## Non-applicability

Do not deploy the full protocol for a static single-process DAG with no governed mutation, external effects, human approval, shared budget, or recovery requirement when a typed function/harness and ordinary tests give sufficient assurance. Do not use `GraphApprovalGateV1` for ordinary UI confirmation that gates no protected consequence; do not emit `TransitionRefusalV1` for parser errors before a governed candidate exists; do not use `GraphExecutionEventV1` for high-volume token chunks or host metrics; do not require promotion evidence outside an authority cutover; and do not claim hard fencing, exact cost, or automatic effect recovery where the target backend/provider exposes no corresponding atomic/idempotent primitive. Use simpler loops/manual review for low-volume uncertain work, and ordinary retrieval rather than graph retrieval when relationships do not materially improve the task. [SOURCE: iteration-007.md:224-226] [SOURCE: iteration-008.md:134-155] [SOURCE: iteration-018.md:63-108]

## Novelty accounting

All seven findings are partially new because they consolidate earlier evidence into implementation-ready naming, ownership, composition, lifecycle, and ordering decisions without introducing a new empirical mechanism: `(0 + 0.5 * 7) / 7 = 0.50`. The result is material because it eliminates duplicate-authority interpretations and closes wire-family boundaries, not because it claims new runtime implementation.

## Iteration metadata

- Status: `complete`
- Focus track: `concrete-schema-protocol-decision-matrix`
- Route: `mode=research`, `target_agent=deep-research`, iteration/run `19/19`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Progressive synthesis: disabled; `research.md` intentionally not written
- Continuation: proceed to iteration 20 regardless of convergence
