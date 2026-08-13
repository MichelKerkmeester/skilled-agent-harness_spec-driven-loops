# Iteration 11: Authorized-Ledger Integration Map

## Focus

This iteration maps the concrete graph-governance decisions from iterations 3–10 onto the shipped 036 authorized-ledger substrate. The result is an additive integration contract: graph transitions reuse the canonical event envelope, default-deny gateway, dedicated decision audit, proof-required append, fence capability, immutable domain frame, replay verifier, and dark adapter. Graph admission, sealing, policy compilation, approval, budget, refusal, and effect evidence extend the inputs and registered event families around that spine; none becomes a second authorization system.

## Findings

1. **The existing gateway-to-fenced-append chain is the graph authority spine — CONFIRM Decision 1 and iteration 8.** `TransitionAuthorizationGateway.authorize()` validates a closed request, resolves current authority and policy, compares the verified domain head and authority epoch, records an allow or deny in the dedicated audit ledger, and returns a durable allow proof only after that audit append. `AppendOnlyLedger` then verifies the exact audit row, event digest, registry, stream, prior head, epoch, freshness, and current authority under the writer boundary before committing an immutable domain frame. Graph execution must register domain event types and use this chain unchanged; a graph ledger, graph allow token, or direct compiled-graph writer would duplicate authority and break the existing single proof-required append seam. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:540-625] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:660-745] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87-98]

2. **The current single `evidenceDigest` is a binding slot, not sufficient graph-evidence verification — REFINE iterations 3–6 and 9.** `TransitionAuthorizationRequest` carries one evidence digest and the decision records whether a configured identity resolver actually verified it. Current tests deliberately show that policy may allow while `evidence_digest_verified` is false when no resolver can pin the value. Therefore graph integration must add a closed `GraphTransitionEvidenceV1` resolver/verifier before policy allow, require `evidence_digest_verified=true`, and bind admission proof, sealed artifact, compiled policy, gate decision, budget reservation/head, and protected resource heads into the one canonical evidence digest. The least invasive implementation is an additive graph adapter plus mandatory trusted resolver; a later generic request version is justified only if multiple domains require typed reference arrays. Caller-supplied digests, unverified evidence, or a policy that merely checks digest presence must deny. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:169-225] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:235-276] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:542-569]

3. **Graph execution events extend the domain registry; compiler/admission refusals extend a separate authority-zero evidence family — EXTEND iterations 7–8.** Missing graph domain variants are `graph.run.started@1`, `graph.task.held@1`, `graph.task.resumed@1`, `graph.node.attempt-started@1`, `graph.node.state-committed@1`, `graph.route.selected@1`, and `graph.run.terminated@1`. Each state-changing event uses the ordinary domain ledger and authorization reference. `graph.transition.refused@1` belongs instead in a schema-closed, non-domain refusal journal whose emitter accepts only a complete `TransitionRefusalV1`; it cannot enter domain reducers, mint `GatewayAllowProof`, satisfy an approval, or decode as an effect/command. Gateway denials remain `authorization.decision.recorded@1` in the existing audit stream and must not be copied into the refusal journal merely to make one combined log. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts:19-43] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts:143-160] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:63-71] [INFERENCE: graph event/refusal split applies iterations 7–8 to the shipped domain/audit separation]

4. **Verifier ownership follows evidence production order and is rechecked at the last mutable boundary — CONFIRM Decision 2 and EXTEND iteration 10's earliest-owner rule.** Admission verifies proposal and dependency closure; the seal verifier owns executable content; the organization-policy compiler owns source-rule provenance; the gate service owns authenticated human decision and dependency freshness; budget authority owns reservations, debits, settlements, leases, and budget heads; the graph evidence resolver verifies their immutable references and current heads; the 036 gateway alone owns authorization; the fenced writer alone owns final head/epoch/fence and exact append; effect authority separately owns `EffectIntent` and recovery. A downstream verifier may validate a prior receipt but may not reinterpret or repair it. The authorization audit must precede its domain event, all admission/gate/budget references must already be durable, and an effect intent must reference the committed graph event or its durable receipt rather than an approval or refusal. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:93-96] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:279-310] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:677-732]

5. **Approval, budget, and effects are referenced authorities with different lifecycles — CONFIRM iterations 6 and 9 and CONTRADICT any bearer-capability interpretation.** A graph evidence bundle may reference a terminal approval decision and a live budget reservation, but the gateway must independently verify exact graph/artifact, policy, role, epoch, expiry, resource, and head bindings. Approval releases only the held transition after a durable authorized resume append; it neither debits budget nor authorizes effects. Budget grant is capacity authority in the budget ledger, not domain-transition authority. A graph domain receipt may become evidence for a separately authorized effect intent, but `GatewayAllowProof`, approval, admission, refusal, and budget receipt are invalid effect capabilities. This preserves reference closure without collapsing ledgers or creating one omnibus graph receipt. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:54-56] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:127-129] [INFERENCE: separation is the runtime composition of iterations 6 and 9]

6. **Compatibility is additive, versioned, and authority-neutral until the 036 cutover plane selects it — REFINE iterations 4, 8, and 10.** Existing V1 authorization requests, decision events, frame bytes, registry digests, and replay remain unchanged. Add graph payload definitions at version 1, a graph evidence verifier/adapter, and a refusal evidence reader; introduce an adjacent event upcaster only when a stored graph payload genuinely changes. Dark integration uses the existing adapter behavior: legacy result remains authoritative on graph allow, deny, or typed-ledger failure. Unknown graph types, evidence versions, reference kinds, or upcast gaps fail closed; an upcaster cannot invent admission, approval, budget, or effect evidence. Cutover is mode/resource scoped, and selected-writer failure freezes and invokes governed rollback rather than falling through to legacy in the same request. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md:84-94] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts:110-177] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:97-98]

7. **The governance corpus inserts mutants at the existing owners plus the new evidence resolver — EXTEND iteration 10.** M01/M02/M07 target admission-proof decode and partial-refusal exclusion before authorization; M05/M06 target seal verification; M09/M14 target gate reference freshness and resume receipt; M11–M13 target budget authority; M15 targets gateway proof/head/epoch and fenced append; M16/M17 target effect intent/recovery; M18/M19 target verified replay/projection. New ledger-specific mutants must also force `evidence_digest_verified=false`, swap one referenced ledger head while preserving the bundle digest field, reorder an audit decision after its domain event, attach a denial/refusal as authorization, reuse one allow for a second graph event, and inject an unknown graph event/refusal version. Every case fails at its earliest owner and proves zero unauthorized domain, budget, gate-release, or effect mutation. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:252-490] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:904-976] [INFERENCE: mutant insertion applies iteration 10's M01–M19 to the observed runtime seams]

## Mechanism-to-Runtime Matrix

| GraphARC mechanism | Disposition | Exact reuse/adaptation | Rejected substitution |
|---|---|---|---|
| `AdmissionResult` and proposal fingerprint | **ADAPT** | Emit/verify `GraphAdmissionProofV1`; place its immutable reference and current dependency-head observations in `GraphTransitionEvidenceV1` | Treating `ADMITTED`, a Python object, or proposal fingerprint as authorization |
| `Materializer` / `CompiledGraphARC` | **ADAPT** | Produce and verify `SealedCompiledGraphV1`; authorize the exact registered domain event containing its digest | Executing a process-local compiled object or sealing a live capability/fence |
| `PolicyEngine` ALLOW/DENY/ASK | **ADAPT** | Compile `OrganizationGraphPolicyV1` to immutable 036 policy identity, evaluator identity, captured authorization-state digest, and source rule IDs | Using GraphARC mode registry or first-match result as tenant authority |
| Approval callback/session hold | **ADAPT** | Durable gate request/decision refs in evidence; authorized `graph.task.held` and later fresh `graph.task.resumed` appends | Callback return, checkpoint flag, or approval row as bearer capability |
| `AdmissionRejection` / `PolicyDecision` explanation | **ADAPT** | Closed complete `TransitionRefusalV1` in non-domain refusal evidence; gateway denial remains in authorization audit | Refusal as command, effect, authorization, successful receipt, or domain transition |
| Trace/replay/session JSONL | **ADAPT** | Projection over verified graph domain events plus closed referenced gate/budget/effect cuts | Trace, OTel, session, or checkpoint as canonical history or authority |
| `BudgetMeter` / `SpendMeter` | **ADAPT** | Local observations feed hierarchical budget reservation/debit/settlement; evidence carries verified receipts/heads | Graph-local canonical balance or resetting spend on retry/resume |
| Graph execution state transitions | **ADOPT** | Canonical envelope, `EventTypeRegistry`, 036 gateway, decision audit, proof-required `AppendOnlyLedger`, fenced writer, durable receipt, verified replay | Parallel graph ledger, proof-free append, or direct mutation |
| Stage 0–6 tests and local negatives | **ADAPT** | Fixture families plus earliest-owner governance mutants and closed shadow observations | Stage number or green count as promotion/cutover evidence |
| Graph advice/planning with no durable consequence | **REJECT ledger use** | Keep pure proposal generation outside authorized append until it requests a governed transition | Logging every thought/token as an authorized domain event |

## Graph Evidence and Event Extensions

The missing authorization-side object is a canonical, resolver-produced reference bundle, not a second proof:

```ts
interface GraphTransitionEvidenceV1 {
  schema_version: 'graph-transition-evidence@1';
  graph_id: string;
  graph_version: number;
  run_id: string;
  transition_id: string;
  admission: { proof_id: string; proof_digest: string; dependency_heads_digest: string };
  sealed_artifact: { artifact_id: string; artifact_digest: string; registry_digest: string };
  organization_policy: { policy_id: string; policy_version: number; policy_digest: string };
  gate: null | { gate_id: string; decision_id: string; decision_digest: string; head: string; expires_at: string };
  budget: { reservation_id: string; receipt_digest: string; scope_path_digest: string; head: string; lease_expires_at: string };
  resources: readonly { resource_id: string; version: string; head: string }[];
  causality: { parent_event_id: string | null; attempt_id: string; correlation_id: string };
  evidence_digest: string;
}
```

The trusted graph evidence resolver loads each referenced immutable record, validates its owner-specific signature/hash/schema, compares the current dependency heads and expiries, canonicalizes ordered resource references, recomputes `evidence_digest`, and pins that digest through `AuthorizationGatewayOptions.identityResolver`. Graph policy requires the resulting decision to record `evidence_digest_verified=true`. The bundle contains no verdict, `GatewayAllowProof`, fence capability, domain receipt, effect capability, or mutable projection.

Graph domain event payloads use the existing canonical envelope and registry. Their common payload prefix binds `graph_id`, `graph_version`, `run_id`, `transition_id`, `sealed_artifact_digest`, `evidence_digest`, and task/node/attempt causality as applicable. Authorization decisions continue to use only `authorization.decision.recorded`; refusal evidence uses only `graph.transition.refused@1`. No combined “graph ledger event” union is allowed to make audit, refusal, domain, budget, gate, and effect records interchangeable.

## Verification and Append Sequence

1. Decode the requested current-version graph domain event and `GraphTransitionEvidenceV1`; unknown or extra variants refuse before policy evaluation.
2. Admission verifier authenticates `GraphAdmissionProofV1`, proposal identity, dependency set, checker versions, and expiry.
3. Seal verifier recomputes `SealedCompiledGraphV1` content identity against the event's graph/artifact references.
4. Policy compiler/verifier resolves current organization policy and source-rule provenance; a digest match without rule provenance is insufficient.
5. Gate service verifies a terminal authenticated decision when required, including role, exact consequence, policy/resource/epoch/head vector, winner, and expiry.
6. Budget authority verifies reservation, scope ancestry, amount, lease, cumulative attempt identity, and current budget head. It alone performs later debit/settlement.
7. Graph evidence resolver verifies all immutable references, current heads, causality, and canonical ordering; it recomputes and pins the one `evidenceDigest`.
8. The 036 gateway validates identity, capability, event registry/digest, prior domain head/state, current authority state/epoch, exact policy identity, and verified evidence, then durably appends allow or deny to the authorization-audit ledger.
9. On allow only, the fenced writer acquires the current resource lease, rechecks the audit proof, event, domain head, epoch/state, freshness, and fence capability, then appends the exact immutable domain frame and returns its durable receipt.
10. Resume/routing consumes the exact domain receipt. Budget debit/settlement and any external effect proceed through their own authorities; an effect intent references the committed graph event/receipt and receives independent authorization and recovery.
11. Replay verifies each ledger separately, then verifies cross-ledger references over a declared closed cut. Projections consume only verified effective events and expose missing/later/stale references as failure, never synthesized history.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-625] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:690-766] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:677-759]

## Authority-Zero Invariants

- Compiler/admission refusal may advance only the bounded refusal-evidence journal. It creates no gateway allow, domain sequence, graph projection state, gate release, budget reservation/debit, idempotency success, or effect intent.
- Gateway deny may advance only the existing authorization-audit stream. It cannot append the requested domain event, issue a domain receipt, release a task, consume budget, or trigger an effect.
- Missing, malformed, unknown, unverified, expired, later-than-use, or head-inconsistent evidence defaults to deny. “Evidence exists” and digest equality are not validity.
- Admission proof, seal, policy compilation, approval, budget receipt, refusal, parity certificate, trace, and projection each carry zero transition/effect authority by themselves.
- An unapplied allow remains audit evidence only. Exact idempotent retry may apply its exact event if the shipped freshness/head/epoch rules still permit; it cannot be retargeted.
- No verifier repairs evidence, rewrites history, silently narrows a multi-failure refusal, or substitutes a later successful observation for an earlier failed prerequisite.

## Compatibility Boundaries

- **Add, do not reinterpret:** register new graph domain payloads and refusal payloads; do not change meanings of V1 envelope, decision, authorization reference, or frame fields.
- **Version at storage boundaries:** changed stored graph payload semantics require `event_type@N+1` and a pure adjacent upcaster. Unknown/future types or missing edges expose no effective event.
- **Never upcast authority:** old trace/session/admission rows cannot be converted into verified approval, budget, authorization, or effect receipts because those facts were not recorded.
- **Dark before selected:** graph adapters may compare and record the dark ledger while returning exact legacy outcomes. A later mode-scoped 036 transition, current certificate, and rollback plan select authority.
- **One selected writer:** after cutover, failure freezes new admission and follows governed epoch/fence rollback. Same-request legacy fallback would create ambiguous history and is forbidden.
- **Preserve ledger ownership:** gate, budget, authorization audit, graph domain, refusal evidence, and effects keep distinct schemas and writers. Cross-ledger projections join immutable references; they do not coalesce authority.

## Mutant Insertions

| Mutant | Injection seam | Owning verifier | Required outcome |
|---|---|---|---|
| Unverified evidence digest allowed | Graph adapter/gateway resolver | Graph evidence resolver | deny; no domain append |
| Admission or artifact ref swapped | Evidence bundle decode | Admission/seal verifier | refusal/deny before gateway allow |
| Gate decision stale but digest stable | Gate reference resolution | Gate service | `gate.invalidated`; no resume |
| Budget head/reservation changed | Budget reference resolution | Budget authority | stale/exhausted/conflict; no domain/effect mutation |
| Denial/refusal supplied as allow proof | Append proof decode | 036 ledger | authorization invalid |
| Audit allow ordered after target | Replay fixture | Authorization replay | linkage/order failure |
| One allow reused for second event | Append retry boundary | 036 ledger | exact retry only; conflicting event rejected |
| Head/epoch changes after allow | Under-lock append | Fenced writer | stale authorization/fence; no frame |
| Unknown graph/refusal version | Registry/read boundary | Event/refusal registry | fail closed; no effective event |
| Effect invoked from approval/domain result | Effect adapter | Effect authority | missing `EffectIntent` refusal; zero live calls |

These extend rather than replace M01–M19. The authoritative ledger suite already supplies proof-free append, wrong event/ledger, idempotency conflict, stale input, audit-only denial, unavailable authority/storage, forged identity, torn tail, replay linkage, and unapplied-allow seeds. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:252-535] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:775-976]

## Non-Applicability and Forbidden Duplications

Do not use the authorized ledger for pure graph proposal search, model scratch reasoning, deterministic in-memory reducer steps, read-only queries, ephemeral progress telemetry, OTel spans, or cache entries that neither claim durable truth nor request a governed consequence. Use it when a graph transition changes durable domain state, creates a resumable/held lifecycle fact, or becomes a causal prerequisite for budget/effect authority.

Forbidden duplications are a graph-specific authorization verdict, graph-local authority epoch, graph-local canonical budget balance, graph-only fence token, parallel effect receipt, combined refusal/authorization event, trace-as-ledger, or projection-as-source-of-truth. The only graph-specific additions are registered payloads, the closed evidence resolver, the authority-zero refusal evidence family, and projections over verified cuts.

## Approaches Ruled Out

- Treating `evidenceDigest` presence or equality as proof that graph evidence was verified.
- Creating a parallel graph authorization ledger, allow token, append API, budget ledger, fence, or effect receipt.
- Encoding compiler/admission refusal as a domain transition or authorization decision.
- Letting approval, admission, seal, budget grant, parity, trace, or projection authorize a transition or effect directly.
- Upcasting historical trace/session data into evidence facts it never contained.
- Coalescing independently owned ledgers into an omnibus graph event stream.
- Falling through to the legacy writer inside a request after the graph writer has been selected.

## Edge-Case Analysis

- **Contradictory evidence:** the current request schema appears to support graph evidence through `evidenceDigest`, but runtime tests prove the field may remain unverified while policy allows. The resolution is not a second gateway: require a graph evidence resolver that pins the canonical digest and make verified evidence a mandatory graph policy invariant.
- **Partial failure:** a durable allow without a graph domain append is an unapplied authorization. A durable graph domain event without its referenced gate/budget prerequisites or earlier allow is invalid replay, not a projection repair opportunity.
- **Ordering ambiguity:** timestamps never establish cross-ledger order. Reference closure uses immutable ledger identity, sequence/head, record/event digest, and declared cut; causation fields supplement but do not replace those links.
- **Non-applicability:** read-only or speculative graph activity stays outside the ledger until it requests durable governed state or an effect intent.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/implementation-summary.md`
- Graph-arch lineage iterations 3–10

## Reflection

- Findings: 7
- New-information ratio: 0.71
- Calculation: 3 fully new findings (typed evidence resolver gap, event/refusal extension map, verifier/ordering map) plus 4 partially new runtime mappings (authority spine, separated references, compatibility, mutants): `(3 + 0.5 * 4) / 7 = 0.714`, rounded to `0.71`.
- Questions answered: The exact authorized-ledger reuse points, evidence/event/refusal extensions, forbidden duplications, verifier owners, cross-ledger order, authority-zero behavior, compatibility path, and mutant seams are decided at design level.
- Questions remaining: The corresponding mapping onto locks-and-fencing still needs an equally concrete pass, especially multi-resource acquisition and graph task/run lease ownership.
- What changed: Iterations 3–10 described evidence and authority roles abstractly; this pass found that the existing `evidenceDigest` slot is usable only with a mandatory trusted resolver because the shipped gateway intentionally permits an unverified digest unless configured otherwise.
- What I would do differently: The next pass should trace a single `graph.node.state-committed@1` request through the actual fencing APIs, including multi-resource order, capability minting, crash recovery, and stale lease mutants.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `11/11`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Actions: 5 bounded research actions; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Next Focus

Cross-cutting runtime mapping — locks and fencing. Map graph run/task/node ownership, multi-resource ordering, leases, epochs, capabilities, stale-worker exclusion, recovery, approval/budget coordination, and mutant insertion onto the current 036 locks-and-fencing implementation without creating graph-local locks or letting a lease become authorization.
