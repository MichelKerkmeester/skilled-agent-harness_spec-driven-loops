# Iteration 7: Authority-Zero Transition Refusal

## Focus

This iteration specifies the compile and admission variants of `TransitionRefusalV1`. It preserves GraphARC's complete multi-check diagnostics and replanning utility while enforcing Graphene P6's stronger rule: a refusal is non-command data with zero authority. Stable codes and typed details can explain a failed candidate, but remedies cannot mutate it, authorize a subset, reserve budget, release a gate, append a domain transition, or execute an effect.

## Findings

1. **Complete multi-check rejection is diagnostic completeness, never partial admission — EXTEND Decision 7 and CONFIRM Graphene P6.** GraphARC runs registry, node policy, edge policy, budget, depth, optional reachability, and optional acyclicity checks before constructing one sorted result. It intentionally returns every failure instead of stopping at the first, executes no factory, touches no state, and only reads budget. `TransitionRefusalV1` should preserve the complete configured check set and every diagnostic, but the candidate disposition is indivisible: one denying diagnostic rejects the whole candidate and no legal-looking subset may run. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:23-41] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:551-600] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:825-881]

2. **Compile and admission refusals share an authority-zero envelope but require distinct typed detail variants — EXTEND Decision 1 and Graphene P6.** A compile refusal says an immutable candidate could not become a sealed executable artifact; an admission refusal says an exact canonical candidate was checked against a named profile and failed one or more governed preconditions. Both bind request/candidate digests, observed dependencies, code-owned retry predicates, and a new-request requirement. Neither contains an admitted Boolean, command payload, allow proof, capability, lease, fence, effect intent, executable callback, auto-applicable patch, or transferable idempotency identity. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330-370] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:457-477] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-003.md:52-86]

3. **Stable code means a namespaced closed taxonomy plus typed detail, not durable prose — REFINE Decision 7 and the 036 reason-code contract.** GraphARC correctly separates `check`, stable `code`, scoped `subject`, human `detail`, and `remedy`, but its free-text detail/remedy should be a rendering layer. The durable form is `stage/check/code`, a typed subject, a versioned detail schema with bounded safe fields, and code-owned advisory action kinds. Unknown codes remain displayable but fail closed for automation; policy ASK codes are gate requirements, not denials. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:101-149] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:616-970] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:126-145]

4. **Refusal has authority exactly zero even when its audit evidence is durable — CONFIRM Decision 4 and Graphene P6.** A refusal may identify observed heads and may have a durable non-domain evidence receipt, but it cannot satisfy an authorization, append, claim, fence, gate, budget, or effect command union. A gateway denial may advance the authorization audit stream while domain head, projection, success-idempotency set, receipts, budget state, and effects remain unchanged. Compile and admission guards must not fabricate a 036 authorization decision because no authorization evaluation occurred. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:370-384] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62-85] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:109-112]

5. **A remedy describes prerequisites for a new candidate; it never patches the refused candidate — REFINE Decision 1 and EXTEND Decision 8's replanning boundary.** GraphARC hands bounded refusal feedback back to the planner, never trims a fan-out, drops a denied edge, negotiates a verdict, or executes the refused round. The next turn must produce a new candidate ID and canonical digest with `supersedes_candidate_id`/causation pointing to the refused attempt; it then repeats compile, admission, gate, and 036 checks from scratch. An identical request retry may return the existing refusal receipt, but any changed candidate under the old identity is an idempotency conflict. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:26-32] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:488-506] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py:891-940]

6. **Refusal audit mapping must distinguish evidence events, authorization denials, and telemetry projections — REFINE Decision 4 and CONFIRM Decision 6.** GraphARC admission emits a trace event with status, fingerprint, checks, estimate, and error codes, while its policy engine has a separate append-only decision audit and an acknowledged compiled-policy path that writes no audit. In system-deep-loop, a durable run may append a restricted non-domain `transition.refusal.recorded@1` evidence event; a later 036 denial remains the sole authorization decision and is referenced rather than duplicated; OTel/trace is derived. A local compile refusal with no durable run returns the typed response and bounded telemetry rather than inventing an audit decision. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:975-1005] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/audit.py:1-13] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:10-29]

7. **Runtime decoders and partial-rejection mutants must prove refusal cannot cross a command boundary — EXTEND Decision 6 and Graphene P6's insertion point.** Place the branded schema in `runtime/lib/authorized-ledger/transition-refusal.ts`, add compile/admission producers, and make gateway, ledger writer, gate, budget, claim/fence, and effect adapters reject it as a command. Tests must mutate aggregation, subset execution, ASK handling, identity reuse, remedy interpretation, audit linkage, and budget side effects; the oracle is unchanged protected state plus readable refusal evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:374-384] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:583-603] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py:1127-1142]

## Refusal Schema Variants

```ts
interface TransitionRefusalBaseV1 {
  refusal_version: 'transition-refusal@1';
  refusal_id: string;
  outcome: 'refused';
  authority: 'none';
  boundary: 'compile' | 'admission';
  request_id: string;
  request_digest: string;
  candidate_id: string | null;
  candidate_digest: string;
  supersedes_candidate_id: string | null;
  correlation_id: string;
  causation_id: string | null;
  mode: string;
  run_id: string | null;
  code: string;
  detail_schema: string;
  observed_dependencies: readonly {
    kind: string;
    resource_id: string;
    version: string;
    digest: string;
    head: string | null;
  }[];
  advisory_actions: readonly {
    action_kind: string;
    prerequisite_codes: readonly string[];
  }[];
  retry: {
    allowed: boolean;
    new_request_required: true;
    predicate_codes: readonly string[];
  };
  occurred_at: string;
  idempotency_key_digest: string;
}

interface CompileTransitionRefusalV1 extends TransitionRefusalBaseV1 {
  boundary: 'compile';
  detail_schema: 'compile-refusal-detail@1';
  detail: {
    stage:
      | 'decode' | 'canonicalize' | 'typecheck'
      | 'lower' | 'seal' | 'materialize';
    compiler_id: string;
    compiler_version: string;
    compiler_digest: string;
    input_schema_version: string | null;
    diagnostic: RefusalDiagnosticV1;
  };
  audit_decision_ref: null;
}

interface AdmissionTransitionRefusalV1 extends TransitionRefusalBaseV1 {
  boundary: 'admission';
  detail_schema: 'admission-refusal-detail@1';
  detail: {
    proposal_id: string;
    proposal_digest: string;
    admission_profile_id: string;
    admission_profile_version: string;
    admission_profile_digest: string;
    checks_configured: readonly AdmissionCheckCode[];
    checks_run: readonly AdmissionCheckCode[];
    diagnostics: readonly RefusalDiagnosticV1[];
    worst_case: unknown;
    worst_case_complete: boolean;
    budget_head: string | null;
  };
  audit_decision_ref: null;
}

interface RefusalDiagnosticV1 {
  diagnostic_version: 'refusal-diagnostic@1';
  stage: 'compile' | 'admission';
  check: string;
  code: string;
  subject: {
    kind: string;
    path: string;
    resource_id: string | null;
    digest: string | null;
  };
  detail_schema: string;
  detail: Record<string, string | number | boolean | null>;
  human_reason: string;
  advisory_action_kinds: readonly string[];
}
```

The envelope and variants are closed, canonically encoded, and size bounded. Diagnostics are deterministically sorted by configured check order, subject path, then code. `candidate_digest` can be a transport-byte digest when decoding fails before a canonical candidate exists; `candidate_id` is then null. `audit_decision_ref` is deliberately null for compile/admission variants. A 036 denial may be rendered as a refusal projection with an authorization reference, but its canonical record remains `AuthorizationDecisionRecord`, not one of these variants. [INFERENCE: the variants specialize Graphene P6 without duplicating the 036 authorization verdict]

`NEEDS_APPROVAL` is not a refusal. If every non-admitting diagnostic is `node_needs_approval` or `edge_needs_approval`, admission emits a non-command gate requirement and opens `GraphApprovalGateV1`. If any denial exists, the result is an admission refusal; ASK diagnostics remain useful context but cannot soften the denial. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:1009-1014] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-006.md:7-15]

## Code Taxonomy

### Compile refusal codes

| Stable code | Typed subject/detail | Advisory action |
|---|---|---|
| `compile/invalid_candidate_schema` | input schema version, bounded validation locations | `change_candidate` |
| `compile/unsupported_candidate_version` | presented and supported versions | `upgrade_candidate` |
| `compile/canonicalization_failed` | transport digest and canonicalizer version | `change_candidate` |
| `compile/compiler_contract_mismatch` | compiler/schema contract digests | `refresh_compiler_inputs` |
| `compile/undeclared_write` | node/field path and write-contract digest | `declare_or_remove_write` |
| `compile/unsealable_artifact` | missing seal input names | `supply_seal_inputs` |
| `compile/materialization_failed` | deterministic stage/code, never raw exception payload | `change_candidate` |

An infrastructure crash, storage corruption, unavailable compiler dependency, or programmer exception is an operational error, not laundered into a candidate refusal. Only deterministic, candidate-addressable defects use the compile taxonomy. [INFERENCE: separates Graphene's governed refusal from GraphARC's stated boundary between model-caused data failures and operator-code exceptions at planner/loop.py:33-48]

### Admission denial codes

| Check | Stable codes |
|---|---|
| `registry` | `unregistered_node`, `name_collides_with_existing_node`, `unknown_edge_endpoint` |
| `policy` | `node_denied`, `edge_denied`, `unresolved_endpoint_kind` |
| `budget` | `over_token_budget`, `over_iteration_budget`, `over_time_budget` |
| `depth` | `too_deep` |
| `reachability` | `no_entry_edge`, `unreachable_node` |
| `acyclicity` | `cycle` |

Gate-only policy diagnostics are `node_needs_approval` and `edge_needs_approval`; they do not enter the denial taxonomy unless another denial rejects the same candidate. The exact names above preserve GraphARC compatibility, while `detail_schema` supplies the versioned meaning GraphARC's prose currently carries. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:616-970]

## Authority-Zero Invariants

For every compile/admission refusal:

1. `authority` is literally `none`; decoders reject any authority-bearing field.
2. No `GatewayAllowProof`, domain append receipt, capability, lease, fence capability, gate decision, budget reservation/debit/refund, `EffectIntent`, callback, command, or patch is present or derivable.
3. Domain/audit-projection heads, graph state, checkpoint state, success idempotency keys, protected projections, budget state, node-execution counters, and external systems remain unchanged. A dedicated refusal/evidence stream may advance.
4. All configured checks may run only if they are observational and side-effect free; failure of one cannot suppress later diagnostics or authorize earlier successes.
5. `advisory_actions` are inert vocabulary. They must be shown to a planner/operator, never deserialized into executable parameters.
6. An exact refusal retry returns the same refusal/evidence receipt; it never turns retry success into transition success.
7. Missing/unknown schema, code, detail, or boundary stays human-renderable and automation-refused.

[SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:336-382] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:81-85]

## Remedy and Replan Lifecycle

```text
CANDIDATE n
  -> compile checks
     -> compile refusal Rn -> append/emit evidence -> render advice
  -> admission checks
     -> admission refusal Rn -> append/emit evidence -> render advice
     -> gate required -> GraphApprovalGateV1
     -> admitted -> GraphAdmissionProofV1 -> seal -> fresh 036 authorization

rendered advice + original goal + refusal reference
  -> planner creates CANDIDATE n+1
     (new candidate_id + new digest + supersedes_candidate_id=n + causation_id=Rn)
  -> full pipeline again
```

The runtime never edits candidate `n`, applies a remedy, deletes a failed node, reduces fan-out, raises a budget, renames a denied kind, or carries admission/gate/authorization evidence forward. Retryability is determined from the stable code and current prerequisites. Repeating unchanged bytes may return the prior refusal for transport idempotency; changing any candidate byte requires a new identity. Consecutive refusal limits produce a separate stop outcome, still with zero authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:172-192] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:383-399] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py:1127-1142]

## Audit Mapping

| Event/result | Canonical owner | Allowed progress | Forbidden interpretation |
|---|---|---|---|
| Local compile refusal | Typed response; optional bounded telemetry | None | A 036 denial or proof. |
| Durable-run compile/admission refusal | Restricted `transition.refusal.recorded@1` non-domain evidence event | Refusal/evidence stream only | Domain/audit authorization progress. |
| 036 authorization deny | `authorization.decision.recorded@1` in authorization audit ledger | Authorization audit stream only | Domain append, projection, budget, receipt, or effect. |
| Planner feedback / GraphARC trace / OTel | Projection from refusal or authorization evidence | Presentation/telemetry only | Canonical authority or command input. |

`transition.refusal.recorded@1` carries the refusal digest, candidate/request identities, code/detail-schema identities, observed dependency heads, and causation. Its emitter capability is closed to that event type and cannot emit domain or authorization events. When a refusal is a projection of a 036 denial, it references the authorization decision/audit receipt rather than appending a second verdict. [INFERENCE: applies the gateway-only audit-emitter pattern at 036 plan.md:81-85 while honoring Graphene's compiler/local-guard distinction]

## Partial-Rejection Mutants

Each mutant must leave all protected state unchanged while retaining the complete refusal evidence:

1. Stop on the first check and omit later failures or `checks_run` entries.
2. Execute, materialize, reserve budget for, or emit effects from the legal subset of a rejected candidate.
3. Automatically trim an over-budget fan-out or drop a denied/unreachable node or edge.
4. Treat one ASK diagnostic as approval, or let ASK soften a concurrent DENY.
5. Call a node factory or mutate a budget meter while admission checks run.
6. Parse `human_reason`, `remedy`, or `advisory_actions` as a command/patch.
7. Mutate a refused proposal and reuse its candidate ID, fingerprint, refusal receipt, admission proof, or idempotency key.
8. Rename a denied kind to satisfy policy or use incomplete worst-case as zero cost.
9. Feed a refusal into the authorization gateway, fenced writer, gate release, budget, claim, or effect adapter and have it decode as a command.
10. Record an admission refusal as a 036 authorization denial without an authorization evaluation, or duplicate a real 036 denial as a second canonical verdict.
11. Replan successfully but erase the refused candidate/refusal causation link.
12. Report a green trace while the refused node, debit, projection, or effect occurred.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:244-255] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:568-668] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py:891-978]

## Runtime Integration

- Add `transition-refusal.ts` to `runtime/lib/authorized-ledger/` as the branded closed union and decoder; it is adjacent to authority code specifically so no authorized command union can accept it. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:384]
- Add compile/admission constructors that canonicalize diagnostic order, enforce safe detail schemas, derive retry predicates from the code registry, and omit all authority-bearing fields.
- Register `transition.refusal.recorded@1` only for durable graph-run evidence, with a capability restricted to that non-domain type; local compilers need not append it.
- Extend the planner loop to pass only bounded rendered advice plus refusal identity. The planner must return a fresh candidate; the loop validates `supersedes_candidate_id` and refuses identity reuse.
- Map GraphARC `Check/code` pairs to the admission detail variant without changing their stable names. Preserve the full diagnostics list even when the top-level status is rejected.
- Route pure ASK outcomes to the iteration-6 human-gate service. Route actual 036 denies to existing `GatewayDenyResult`; expose a linked refusal view only as a projection.
- Add decoder-negative tests at transition gateway, append-only ledger/fenced writer, human gate, claim/fence, budget, and effect-recovery boundaries, plus the partial-rejection corpus above.

## When Not to Use

- Do not use `TransitionRefusalV1` for ordinary local parser/form validation before a governed candidate/request identity exists; return the local validation type.
- Do not convert programmer exceptions, storage corruption, unavailable infrastructure, or indeterminate effect outcomes into actionable candidate refusals. Fail operationally or enter effect recovery.
- Do not represent pure policy ASK as refusal; open `GraphApprovalGateV1`.
- Do not represent human cancellation, clean no-op, goal completion, convergence, or planned stop as refusal; those are explicit control outcomes.
- Do not use a refusal instead of a 036 authorization denial when the authorization gateway actually evaluated the request.
- Do not require durable refusal-ledger events for ephemeral local compilation with no run/audit boundary; typed response plus bounded telemetry is sufficient.
- Do not expose raw prompts, secrets, arbitrary exception strings, executable payloads, or full candidate arguments in details/remedies.

## Ruled Out

- First-failure-only admission results.
- Partial admission or automatic repair of a rejected proposal.
- Free-text remedy as executable instruction.
- Mutating and resubmitting the same candidate identity.
- Treating `NEEDS_APPROVAL` as denial or approval.
- Fabricating a 036 audit decision for compiler/admission refusal.
- Allowing a refusal evidence receipt to satisfy an authorization or effect boundary.

## Dead Ends

None promoted. GraphARC's existing rejection vocabulary and loop behavior are productive inputs once their trace/audit and authority claims are narrowed.

## Edge Cases

- Ambiguous input: GraphARC names every non-admitting diagnostic a `Rejection`, including ASK, while Graphene reserves refusal for `outcome=refused`. Resolved by routing pure ASK to `GraphApprovalGateV1`; ASK remains diagnostic context only when another failure rejects the candidate. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:117-145] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:1009-1014]
- Contradictory evidence: GraphARC's checker docstring says `AdmissionResult` authorizes, while prior analysis proves it is ordinary caller-constructible data and Graphene requires refusal authority to be none. Resolved by treating admission output as pre-authorization evidence only. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:1-7] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-003.md:9-16]
- Missing dependency: the convenience `context/graphene-main/research.md` mirror named by the prompt was absent; the canonical repo study at `002-graphene-main/research/research.md` supplied P6 directly.
- Partial success: none; schema variants, taxonomy, authority-zero invariants, remedy/replan lifecycle, audit mapping, mutants, runtime integration, and non-applicability are decided at design level.

## Sources Consulted

- `context/graph-arch/grapharc/planner/{admission.py,loop.py}`
- `context/graph-arch/tests/{test_admission.py,test_planner_loop.py}`
- `context/graph-arch/grapharc/policy/{engine.py,audit.py}`
- `002-graphene-main/research/research.md` P6
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types.ts,transition-authorization-gateway.ts}`
- `036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/{spec.md,plan.md,tasks.md}`
- Lineage iterations 1–6 and reducer-owned state.

## Assessment

- New information ratio: 0.86 (5 fully new schema/taxonomy/lifecycle/audit/runtime decisions and 2 partially new authority and mutant refinements: `(5 + 0.5 × 2) / 7 = 0.857`, rounded).
- Questions addressed: How should complete compile/admission rejection become actionable durable evidence without acquiring transition authority?
- Questions answered: Compile/admission variants, stable taxonomy, zero-authority invariants, remedy/replan identity, audit mapping, partial-rejection mutants, runtime integration, and when-not-to-use boundaries are decided at design level.
- Questions remaining: Budget lifecycle remains in the combined contract question; ledger-first observability, runtime mappings, and the full governance mutant corpus remain open.

## Reflection

- What worked and why: Following each diagnostic from deterministic check through planner feedback, audit evidence, new candidate, and 036 boundary separated useful actionability from executable authority.
- What did not work and why: The prompt's convenience Graphene mirror path was absent; the canonical repo-study path recovered P6 without changing scope.
- What I would do differently: Hold refusal and authorization records fixed and trace how canonical ledger events become replay, trace, cost, and OTel projections without letting projection gaps rewrite history.

## Recommended Next Focus

Specify ledger-first observability and replay-to-OTel: canonical refusal/authorization/domain/effect linkage, reference-closed cuts, causal-prefix replay, reducer/topology identities, projection lag/rebuild, and explicit telemetry non-authority boundaries.
