# Iteration 010 — `TransitionRefusalV1`

## Focus

P6: define the stable refusal envelope for attempted graph transitions across compilation, claims, budgets, gates, beliefs/nogoods, authorization, and mutation fencing. A refusal must explain the denied attempt without becoming a capability, command, or prose-driven retry protocol.

## Findings

### 1. REFINE repo #1 — response and enforcing decision are different artifacts

Repo #1 correctly requires every transition intent to pass through the 036 gateway. `TransitionRefusalV1` is therefore a typed response/projection over one failed attempt, not a domain event and not an authorization proof. Give it `boundary: compile|preflight|authorization-gateway|claim-guard|mutation-fence|budget|gate|belief-admission|effect-recovery` and `disposition: not-submitted|denied|commit-guard-rejected|indeterminate`. Only a gateway denial carries an immutable authorization-decision reference; a compiler refusal says no decision occurred, and a fence refusal names the commit guard. Every variant fixes `domain_append=false` and `effect_authorized=false`; absence of a refusal never implies permission. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23-31] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-776] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:878-895] [INFERENCE: naming the enforcing boundary prevents a local diagnostic from masquerading as an authoritative denial]

### 2. EXTEND repo #1 — version code identity and attempted-transition provenance independently

Use `schema_version:1`, a closed `code`, and `code_version:1`; never derive behavior from `reason`. Bind `refusal_id` and canonical `refusal_digest` to `request_id`, `attempt_id`, `operation_id`, and `attempted_transition {mode, stream/run/graph/node refs, event type/version/digest, expected source state, proposed target state, actor_id, non-secret capability_id}`. `authority` carries state/epoch and exact policy identity plus optional `decision_ref {audit_ledger_id,audit_sequence,audit_record_hash,decision_id,decision_digest,request_digest}`. This reuses the ledger's decision identity instead of minting a second authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:81-121] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:27-38] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:161-188] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:826-875]

### 3. CONFIRM repo #1 — typed detail drives clients; prose is display-only

Graphene already models refusals as outcomes with code, suggestion, reason, and structured detail. Preserve an optional `summary` for humans, but clients select only on `(schema_version,code,code_version,boundary,retry.class)` and a discriminated detail. The closed union should include `CompileFailureDetail`, `ClaimFailureDetail`, `BudgetFailureDetail`, `GateFailureDetail`, `BeliefFailureDetail`, `NogoodFailureDetail`, `StaleHeadDetail`, `StaleFenceDetail`, `PolicyDenialDetail`, and `EffectRecoveryDetail`. Unknown detail variants remain renderable but make automation fail closed. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:52-78] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:123-169] [INFERENCE: a stable code whose semantics can change without a code-version bump is not stable]

### 4. EXTEND repo #1 — distinguish expected, boundary-observed, and response-current facts

`observations` carries typed expected-versus-observed pairs for domain head `{ledger_id,sequence,record_hash}`, state `{version,fingerprint}`, authority epoch, graph/topology/compiler/reducer/policy versions, claim identity/version, and each protected resource `{resource_digest,supplied_fence,current_fence}`. The load-bearing value is `observed_at_boundary` inside the authorization or commit-guard atomic scope. Optional `response_current` is informational because it may already be stale when delivered. A stale-head refusal reports supplied and verified heads; stale-fence reports supplied and current tokens. Neither current value is a reusable grant. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-25] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:212-232] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-745] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:432-482] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:1119-1151]

### 5. EXTEND repo #1 — retryability is a code-owned state machine, not a boolean

Define `retry {class,same_intent_allowed,requires_new_request,earliest_condition,max_automatic_attempts,backoff_policy_id?}` where `class` is `do-not-retry|refresh-and-recompute|after-prerequisites|after-resource-change|after-policy-change|operator-required|idempotent-success|indeterminate-recover-first`. A registry keyed by `(code,code_version,boundary)` owns the mapping. Stale head/fence/claim failures require refresh, recomputation, new request identity, and full reauthorization; gate/belief prerequisites require a typed state change; budget exhaustion waits for a governed budget/scope change; compile/schema/type defects are not transient; `already-applied` means verify receipt, not retry; an in-doubt effect enters recovery and must not re-execute. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:101-120] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:126-145] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts:268-355] [INFERENCE: every retry is a fresh attempted transition and re-enters every authority and fence check]

### 6. REFINE repo #1 — prerequisites and suggestions are bounded evidence, never executable authority

Each prerequisite is `{predicate_kind,predicate_version,subject_ref,required_state,observed_state,status,evidence_ref_ids}` with `status:satisfied|unsatisfied|unknown`. `suggested_actions` uses a closed advisory enum such as `refresh-head|recompile|rebind-claim|wait-for-release|resolve-findings|await-human|reduce-scope|request-budget-change|supply-distinct-source|remove-candidate-member|run-effect-recovery|contact-operator`, with typed non-secret parameters. Every action fixes `advisory_only:true` and `requires_new_authorization:true`; it cannot contain a shell/tool command, bearer token, lease capability, callback, or presigned transition. Graphene's total-suggestion invariant is useful for teachability, but automation additionally requires proof-backed prerequisites. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:18-50] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:175-199] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:43-51] [INFERENCE: recovery advice describes how to form a future request; it never grants that request]

### 7. EXTEND repo #1 — replayable evidence and causal linkage do not prove authority

Carry `correlation_id`, nullable `causation_id`, `operation_id`, and sorted immutable `evidence_refs {ref_kind,artifact_id,digest,locator,scope}`. The refusal digest binds these references, the attempted transition, exact boundary observations, and decision reference; raw evidence, secrets, capability material, and mutable prose stay outside. Correlation groups observations and causation names the direct predecessor, but neither satisfies authorization. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:168-188] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:838-870] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:93-97] [INFERENCE: evidence references explain a decision but cannot be replayed as credentials]

## Minimal wire shape

```text
TransitionRefusalV1 {
  schema_version, refusal_id, refusal_digest,
  code, code_version, boundary, disposition,
  request_id, attempt_id, operation_id,
  attempted_transition { mode, graph/run/node/stream refs, event {type,version,digest}, from, to },
  authority { state, epoch, policy_ref, decision_ref?, domain_append:false, effect_authorized:false },
  detail: <closed discriminated union>, prerequisites[],
  observations { expected, observed_at_boundary, response_current? },
  retry { class, same_intent_allowed, requires_new_request, earliest_condition,
          max_automatic_attempts, backoff_policy_id? },
  evidence_refs[], correlation_id, causation_id?,
  suggested_actions[] { action, action_version, parameters,
                        advisory_only:true, requires_new_authorization:true },
  summary?, emitted_at
}
```

Canonicalization sorts prerequisites by predicate key, evidence by `(ref_kind,artifact_id,digest)`, protected resources by digest, and suggestions by `(action,canonical parameters)`. The semantic digest excludes `summary`, localized display text, and `response_current`, so presentation and delivery-time refreshes cannot change refusal identity. [INFERENCE: stable replay identity requires separating semantic and display fields]

## Recovery matrix

| Failure family | Retry class | Required fresh proof |
|---|---|---|
| Compile/schema/type | `do-not-retry` or `after-prerequisites` | corrected proposal and new compile digest |
| Stale head/state/version | `refresh-and-recompute` | verified head, rebuilt preview, new request |
| Claim lost/stale fence | `refresh-and-recompute` | current claim and fence at commit |
| Budget/limit | `after-resource-change` | authorized budget/scope version |
| Human/deterministic gate | `after-prerequisites` | new gate version and satisfying evidence |
| Belief/nogood | `after-prerequisites` or `operator-required` | new fixed point at exact head |
| Policy denial | `after-policy-change` or `do-not-retry` | governed policy/input change, never prose reinterpretation |
| Already applied | `idempotent-success` | verify receipt; do not repeat mutation |
| Effect in doubt | `indeterminate-recover-first` | recovery classification before execution |

## Ruled out and when not to use

- **Refusal as a domain event or authorization proof:** the gateway decision or commit guard rejects; domain history must not record a transition that did not occur. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:878-895]
- **Refusal as a replacement for faults:** use typed errors for malformed storage, bugs, corruption, and unavailable infrastructure; a refusal is an expected evaluated outcome. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:11-12]
- **Refusal as success/receipt:** it never proves commit or effect; `already-applied` must link an independently verified receipt. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:40-70]
- **Refusal as recovery command/capability:** never embed executable code, fences, leases, tokens, or pre-authorized follow-ups.
- **Refusal as prose protocol:** unknown variants render but do not automate; clients never branch on `summary`, `reason`, or matched-rule prose.
- **Refusal as an oracle after an in-doubt effect:** recover first; do not automatically retry.
- **Refusal as unrestricted diagnostics:** expose authorized locators/digests, not sensitive policy/evidence/identity material. [INFERENCE: explanation remains inside the attempted transition's information-access boundary]

## Negative controls

1. Changing only `summary` leaves `refusal_digest` and client behavior unchanged.
2. Changing code semantics without incrementing `code_version` fails registry conformance.
3. Replaying a stale-head/fence refusal as a command cannot append: it carries no capability and a new request must pass current checks.
4. An unknown detail variant renders as unknown and triggers no automated suggestion.
5. A gateway denial has exactly one valid decision reference and zero domain/effect receipts; a compiler refusal has no forged decision reference.
6. Correlation or causation equality never satisfies policy, head, claim, fence, gate, budget, or belief prerequisites.

## Novelty and next focus

- `newInfoRatio`: **0.61**.
- Novelty: repo #1 and iteration 009 established typed denials and zero domain mutation; this iteration adds stable wire identity, boundary/disposition separation, a closed detail union, three-time observations, code-owned recovery classes, non-authorizing prerequisite/action contracts, and causal/evidence rules across the requested failure families.
- Next focus: **P6 recovery semantics across compile claim budget gate and belief failures**.

