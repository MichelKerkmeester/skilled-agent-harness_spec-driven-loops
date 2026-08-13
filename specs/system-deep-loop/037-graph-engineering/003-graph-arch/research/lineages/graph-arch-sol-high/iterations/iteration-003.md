# Iteration 3: GraphAdmissionProofV1 Before 036 Authorization

## Focus

This iteration derives a concrete `GraphAdmissionProofV1` precondition for graph-originated transition requests. It separates the deterministic structural facts GraphARC already checks from the trust, freshness, and live authority facts absent from `AdmissionResult`; defines issuer and verifier responsibilities; gives the exact verification order at the 036 gateway; and maps local admission refusal versus gateway denial. The proof is evidence for authorization, never authorization itself.

## Findings

1. **GraphARC's check set is valuable but its result is not a proof — CONFIRM Decision 1 and REFINE iteration 2's four-boundary chain.** The checker deterministically covers registry membership, endpoint existence/collision, node policy, edge policy, worst-case budget against observed remainder, depth, optional reachability, and optional acyclicity; it records status, proposal id/fingerprint, ordered rejections, checks executed, cost completeness, budget remainder, depth, and node count. It does not bind checker/compiler version, registry or policy content digests, known-live-graph digest, budget observation identity/head, issuer, issuance/expiry, or materializer identity. `GraphAdmissionProofV1` must preserve exactly which checks ran and must not claim checks disabled by configuration. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:431-477] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:509-600] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:583-633]

2. **Non-forgeability requires a trust-separated issuer, not a stronger Pydantic shape — CONFIRM repo study 1's graph-over-036 authority decision and CONTRADICT GraphARC's broad “admission authorises” wording outside its planner boundary.** `AdmissionResult` is ordinary caller-constructible data; GraphARC explicitly says a hand-built matching result materializes anything, and its tests state that no library check can stop code already holding the interpreter. The proof issuer must therefore be outside the untrusted planner/operator request boundary and authenticate canonical proof bytes with a configured key or durable opaque receipt. If such separation does not exist, 036 must rerun admission itself and accept no caller-supplied proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py:1058-1075] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-9]

3. **The proof subject must use full canonical digests and bind every mutable checker dependency — EXTEND Decision 1's sealed IR and Decision 7's organization/work separation.** GraphARC's proposal fingerprint is a 16-hex-character prefix over serialized model bytes and binds rationale and key order as identity, but it does not bind the executable registry, organization policies, known graph, budget source, compiler, or materializer. The proof should bind a full canonical proposal digest plus topology digest, schema/compiler/materializer contract versions, frozen registry/capability digest, node/edge/organization-policy digests, known-graph digest, checker configuration, parent depth, and budget observation. Dynamic work remains ephemeral, while these stable governance dependencies come from the organization/authority side. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/proposal.py:248-255] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:228-277] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:12-24] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170]

4. **036 must verify admission first, then independently re-bind authorization facts — CONFIRM the 036 gateway contract and EXTEND it with a graph-specific precondition.** The current gateway already validates request shape, event-registry digest, current verified head, authority epoch, optional actor/capability/evidence identity, exact policy identity/digest, bounded policy evaluation, durable audit, proof freshness, and single-use exact append linkage. Graph admission verification belongs before policy evaluation, but it cannot replace current head/state, authority, actor, capability, evidence, transition-policy, idempotency, fence, or effect checks. Current graph registry/policy/materializer/budget-reservation identities must also be independently resolved and compared with the proof rather than trusted from request bytes. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:168-225] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:629-777] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:52-70]

5. **Admission refusal and authorization denial are distinct persistence boundaries — EXTEND Graphene P6 authority-zero refusal.** A local checker rejection returns complete, stable, multi-cause `check/code/subject/detail/remedy` feedback and must not fabricate a 036 authorization decision because authorization was never requested. A malformed, missing, untrusted, expired, incomplete, subject-mismatched, or dependency-stale proof presented to the gateway is instead a gateway denial recorded in the non-domain authorization audit and advances no domain state, budget debit, projection, receipt, or effect. `TransitionRefusalV1` should add an `admission` boundary so clients can distinguish structural refusal from policy authorization denial without turning remedies into executable commands. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:117-149] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:586-610] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87-98] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330-382]

6. **Freshness is dependency-version freshness, not time-to-live alone — REFINE Decision 2's commit-time revalidation and the 036 single-use allow contract.** The admission proof needs a short expiry, but it is stale immediately if proposal/topology, frozen registry, organization policy, known graph, compiler/materializer contract, budget reservation/head, or required checker configuration changes. After gateway allow, the domain append still rechecks decision digest, event identity/digest, prior head, policy, epoch, decision time/expiry, current authority state, fence, and single-use linkage under lock. This closes the admission-to-authorization and authorization-to-append TOCTOU windows without making admission a second authority. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:279-310] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:378-440] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87-96]

## Proposed Schema

```ts
interface GraphAdmissionProofV1 {
  proof_version: 'graph-admission-proof@1';
  proof_id: string;
  issuer: {
    issuer_id: string;
    issuer_build_digest: string;
    key_id: string;
    algorithm: 'ed25519' | 'opaque-durable-receipt';
  };
  issued_at: string;
  expires_at: string;
  subject: {
    proposal_id: string;
    proposal_digest: string;       // full SHA-256 over canonical proposal bytes
    topology_digest: string;
    graph_definition_version: string;
    run_scope_id: string;
  };
  dependencies: {
    admission_schema_version: string;
    compiler_version: string;
    compiler_digest: string;
    materializer_contract_version: string;
    materializer_digest: string;
    registry_digest: string;
    capability_catalog_digest: string;
    organization_policy_digest: string;
    node_policy_digest: string;
    edge_policy_digest: string;
    known_graph_digest: string;
    checker_config_digest: string;
    parent_depth: number;
    budget_observation: {
      budget_scope_id: string;
      budget_head: string;
      reservation_request_digest: string;
      remaining: { tokens: number | null; iterations: number | null; seconds: number | null };
    };
  };
  result: {
    status: 'admitted';
    checks_run: readonly (
      | 'registry'
      | 'policy'
      | 'budget'
      | 'depth'
      | 'reachability'
      | 'acyclicity'
    )[];
    mandatory_check_set_digest: string;
    node_count: number;
    measured_depth: number;
    worst_case: { tokens: number; iterations: number; seconds: number };
    worst_case_complete: true;
    refusals: readonly [];
    args_contract: { mode: 'dropped' | 'typed-and-validated'; schema_set_digest: string | null };
  };
  canonical_payload_digest: string;
  attestation: string; // signature or durable receipt authentication over canonical payload
}
```

The schema deliberately cannot contain an authorization verdict, capability, fence, effect intent, append receipt, reusable allow token, or command payload. `status` is closed to `admitted`; rejected/needs-approval outcomes remain `TransitionRefusalV1` evidence rather than proof instances. The `args_contract` cannot say `typed-and-validated` unless a separate check actually ran; raw `forward_args=True` is ineligible. [INFERENCE: schema combines GraphARC's observed result fields with the current 036 exact-digest, durable-proof, freshness, and single-use patterns] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:457-477] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:290-353]

## Issuer / Verifier Boundary

- **Issuer:** a `GraphAdmissionService` owns frozen registry and policy snapshots, canonicalizes the proposal, executes the mandatory checker profile, derives dependency digests, refuses incomplete cost/check coverage, and signs or durably records the canonical proof. The planner receives only proof bytes/reference and refusals; it cannot access issuer signing material or mutate issuer snapshots. [INFERENCE: required to turn caller-constructible `AdmissionResult` data into authenticated evidence]
- **Gateway verifier:** a configured `GraphAdmissionProofVerifier` accepts only the closed version/issuer/key/algorithm allowlist, authenticates the payload, checks time and unique proof identity, recomputes payload digest, matches request/event graph subject, and resolves current dependency values independently. It returns verified facts to policy evaluation; callers cannot set a “verified” Boolean. [INFERENCE: follows the gateway's existing `identityResolver` separation, which records only positively confirmed fields as verified] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:319-353]
- **Fallback:** when issuer/verifier separation is impossible because the caller shares the interpreter and keys, the gateway reruns canonical admission against gateway-owned snapshots. It does not accept `AdmissionResult` or self-signed proof data. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-60]

## Verification Order

1. Envelope preflight validates canonical current-version event bytes before sequence allocation. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:62-70]
2. Parse the transition request and closed `GraphAdmissionProofV1`; reject missing/unknown/extra/malformed fields.
3. Authenticate issuer/key/algorithm or durable receipt; recompute `canonical_payload_digest`; verify `issued_at < expires_at` and current freshness.
4. Match proof subject to the exact proposal/graph/topology/run-scope references carried by the requested event and bind its digest into `evidenceDigest` plus the authorization request digest.
5. Require `status=admitted`, empty refusals, complete worst-case, the configured mandatory check-set digest, and a safe args contract; reject any omitted/disabled required invariant.
6. Independently resolve and compare current registry/capability, organization/node/edge policy, known graph, compiler/materializer, checker configuration, and budget reservation/head. Any mismatch is `admission_proof_stale` and requires new admission.
7. Continue the current 036 gateway order: reject audit recursion/unsupported event registry; load verified domain head; compare prior head; load current authority state/epoch; compare request and event epochs. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-746]
8. Require positive actor, capability, evidence, and admission-proof subject verification for graph-originated transitions; an omitted resolver field is not verified. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:779-823]
9. Resolve exact transition policy/version/digest, evaluate over the full current request plus verified admission facts, normalize output, and default every exception/timeout/ambiguity to deny. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:753-776]
10. Durably append one allow or deny decision; only a durable allow produces `GatewayAllowProof`. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-627]
11. Under the domain ledger lock and current fence, revalidate the allow's audit linkage, exact event/digest, prior head, policy, authority state/epoch, freshness, and single-use/idempotent-retry rules before append. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:279-310] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:378-440]

Steps 3–6 verify admission evidence; steps 7–11 authorize and commit a transition. Their order is load-bearing: a valid graph proof cannot rescue stale authority, and a current authority snapshot cannot authenticate a forged admission result. [INFERENCE: derived from GraphARC's planner/operator trust boundary plus 036's exact current-state gateway]

## Refusal Mapping

| Boundary | Stable code family | Persistence and recovery |
|---|---|---|
| Local admission | Existing GraphARC codes: `unregistered_node`, `name_collides_with_existing_node`, `unknown_edge_endpoint`, `node_denied`, `node_needs_approval`, `edge_denied`, `edge_needs_approval`, `over_token_budget`, `over_iteration_budget`, `over_time_budget`, `too_deep`, `no_entry_edge`, `unreachable_node`, `cycle` | `TransitionRefusalV1(boundary='admission', authority='none')`; no gateway decision. Remedy is advisory; change proposal/dependencies and rerun admission. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:616-715] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:583-628] |
| Proof decode/authentication | `admission_proof_required`, `admission_proof_invalid`, `admission_proof_version_unknown`, `admission_issuer_untrusted`, `admission_attestation_invalid` | Gateway deny in non-domain audit; no domain/budget/effect mutation. Unknown versions remain renderable but fail closed for automation. [INFERENCE: graph-specific refinement of 036 `invalid_input`/`unsupported_event` and Graphene P6]
| Proof subject/coverage | `admission_subject_mismatch`, `admission_checkset_incomplete`, `admission_cost_incomplete`, `admission_args_ungoverned` | Gateway deny; new proof required after corrected admission. Never downgrade checks or silently drop work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:23-41]
| Proof freshness | `admission_proof_expired`, `admission_dependency_stale`, `admission_budget_stale` | Gateway deny; refresh dependencies/reservation and rerun admission. Do not retry the same proof. [INFERENCE: required by independently resolved mutable dependencies and 036 stale-head/epoch semantics]
| Authorization after valid admission | Existing `invalid_input`, `unknown_policy`, `policy_denied`, `unsupported_event`, `stale_head`, `stale_authority_epoch`, evaluator/storage/idempotency failures | Existing durable gateway deny; admission remains valid only if its dependencies remain current, but a new authorization request is always required. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:126-145] |

## When Not to Use

- Do not require graph admission proof for a direct deterministic harness action or small transform with no dynamic graph proposal; apply the harness/capability and ordinary transition policy at the layer owning the action. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:55-72]
- Do not mint a proof for plan-only visualization, advisory topology, or rejected/approval-pending work. Proof becomes necessary only when the graph is proposed as precondition evidence for execution or a state-changing 036 request. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:117-122]
- Do not duplicate the proof for a statically deployed `GraphDefinitionV1` already covered by an equivalent immutable compilation certificate; use one certificate abstraction with the same dependency and freshness semantics. [INFERENCE: avoids two proof formats for the same compiled subject]
- Do not accept caller-signed proof when the caller shares issuer keys or interpreter authority; rerun admission at the gateway-owned boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-60]
- Do not treat an admission proof as permission for effects, writes, budget debit, session resume, or future topology patches; each consequence remains a current 036 transition/effect request, and every new dynamic graph fragment is separately admitted. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:12-31]

## Ruled Out

- Extending `AdmissionResult` with an `authorized=true` or self-asserted signature field: the caller can construct both and the library trust boundary remains unchanged. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-60]
- Using the 16-character proposal fingerprint as the only proof subject: it omits mutable governance dependencies and is shorter than the full canonical digest used by 036. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/proposal.py:248-255] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:169-188]
- Letting a valid admission proof bypass current head/epoch/policy/identity evaluation: 036 explicitly requires exact live request and state binding before append. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87-98]

## Dead Ends

None promoted. The proof schema and gateway order expose the next materialization-sealing questions without reopening the blocked admission-as-authorization direction.

## Edge Cases

- Ambiguous input: none; the prompt and iteration 2 next-focus align exactly.
- Contradictory evidence: GraphARC calls `AdmissionResult` authorization within its planner/operator boundary, while its materializer and tests prove it is forgeable to an interpreter-capable caller. Resolved by narrowing the term to planner admission and requiring trust-separated proof before 036. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:1-7] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/materialize.py:54-60]
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `context/graph-arch/grapharc/planner/{admission.py,proposal.py,materialize.py,loop.py}`
- `context/graph-arch/tests/{test_admission.py,test_planner_loop.py}`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types.ts,transition-authorization-gateway.ts,append-only-ledger.ts,README.md}`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md`
- `context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`
- `context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md`
- Lineage iterations 1–2 and reducer-owned state.

## Assessment

- New information ratio: 0.83 (4 fully new schema/order/refusal decisions and 2 partially new trust-boundary refinements: `(4 + 0.5 × 2) / 6 = 0.833`, rounded).
- Questions addressed: Which admission facts become authenticated proof, which facts must 036 re-bind, and in what order?
- Questions answered: The admission-proof schema, issuer/verifier boundary, freshness model, verification sequence, refusal mapping, and non-applicability boundaries are decided at design level.

## Reflection

- What worked and why: Following the proof from checker output through materialization and into the existing gateway/append verifier separated precondition evidence from authorization and commit revalidation cleanly.
- What did not work and why: Broad source reads again truncated around large modules; the final narrow read of gateway evaluation and append proof validation recovered the load-bearing order.
- What I would do differently: The next iteration should treat the admitted proof as fixed input and enumerate every execution artifact field that materialization must seal, rather than revisiting checker semantics.

## Recommended Next Focus

Specify the sealed compiled-graph/materialization artifact and TOCTOU closure: bind registry-owned bodies, typed arguments, declared writes, adapters, gates, effects, dynamic destinations, compiler/materializer versions, and revalidation at execution.
