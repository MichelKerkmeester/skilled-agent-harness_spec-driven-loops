# Iteration 011 — P6 recovery semantics by enforcing boundary

## Focus

Close P6 by specifying stable advisory actions, retry preconditions, zero-mutation guarantees, and evidence/telemetry boundaries for compile, claim/fence, budget, human-gate, nogood, and belief/staleness refusals; audit where Graphene cannot satisfy that contract.

## Findings

### 1. REFINE repo #1 — stable actions describe recovery families, not executable steps

`TransitionRefusalV1` needs a closed, versioned action enum independent of surface prose: `fix-proposal`, `refresh-and-recompile`, `rebind-and-reclaim`, `wait-for-claim-release`, `choose-other-work`, `request-budget-change`, `reduce-scope`, `await-human-decision`, `resolve-gate-evidence`, `refresh-belief-context`, `supply-distinct-source`, `remove-nogood-member`, `run-effect-recovery`, `verify-already-applied`, and `contact-operator`. Each action is advisory and contains only non-secret subject/evidence references; the `(code, code_version, boundary)` registry determines retry class and prerequisites. Graphene's `Suggestion` enum is useful, but `AdvanceGraphState`, `ReduceScopeOrRaiseBudget`, and `RebindAndReclaim` each collapse recovery paths with different authority and freshness conditions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:18-50] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:81-147] [INFERENCE: proposed action names and versioned registry]

**When not to use:** Do not treat an action as a command, permission, retry token, or promise that a prerequisite will become true. Never branch on reason, summary, or rendered fix text.

### 2. EXTEND repo #1 — compile refusal requires changed immutable input, not transient retry

A compile refusal uses `boundary=compile`, `disposition=not-submitted`, and a closed code such as `wrong-document-kind`, `duplicate-symbol`, `unknown-reference`, `malformed-node`, `unsupported-capability`, `unsafe-write-set`, or `invalid-gate-policy`. Retrying identical proposal bytes with the same compiler, organization, registry, and policy identities is forbidden because the result is deterministic. `fix-proposal` requires a changed proposal digest; `refresh-and-recompile` is allowed only after a named compiler or policy input changed. Graphene correctly rejects wrong kind, duplicate names, unknown names, and malformed human timeout policy before producing nodes, but exposes `PlanError` rather than the common refusal envelope and does not bind the failure to compiler/policy/topology identities. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-cli/src/plan.rs:110-194] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-cli/src/plan.rs:197-230] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23-31] [INFERENCE: compile code vocabulary and retry conditions]

No graph is sealed; domain, effect, budget, and claim state do not change; no gateway decision is minted. Non-authoritative compiler telemetry may carry proposal/compiler digests and the stable code within the caller's information boundary.

**When not to use:** Parser corruption, unavailable storage, compiler crashes, and unknown internal exceptions are faults, not proposal refusals; do not advertise proposal repair as sufficient.

### 3. CONTRADICT Graphene — claim/fence recovery must be claimant-addressed and fully reauthorized

`already-claimed` permits `wait-for-claim-release` or `choose-other-work`, never automatic takeover. `stale-premise`, `claim-revoked`, `stale-claim`, `stale-fence`, and `stale-head` require refresh plus a new attempt/request identity, current exact claim, current per-resource fence, expected version/head, and full gateway authorization. A holder, claim, head, or fence returned in a refusal is only an observation at the rejecting boundary and may already be stale. Graphene validates claimability, premises, budget, and ownership transactionally at claim time, but completion and adjacent claim-derived APIs resolve ownership from the node and can accept a stale worker under a successor claim; its `RebindAndReclaim` suggestion therefore overstates safety until the P4 commit-time fence contract exists. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:245-367] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:450-515] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:1047-1066] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-745]

A rejected claim/fence operation changes no domain head, claim projection, checkpoint, budget, effect intent, or output. Exactly one non-domain authorization denial is expected only if the request reached the gateway; a local guard refusal carries no forged decision reference.

**When not to use:** Do not auto-retry on lease expiry, evade affinity/write conflicts by claiming arbitrary work, or reuse a newly observed fence/head beyond the atomic check that observed it.

### 4. REFINE repo #1 — budget recovery requires governed resource or scope change

`budget-exhausted` and `limit-exceeded` identify scope, dimension, budget-policy/version, allocation identity, committed debit, reservation, requested delta, and exact observation head. `reduce-scope` is retryable only after compiling a smaller intent; `request-budget-change` only after an independently authorized allocation/version change. Resume never mints a fresh root budget, resets spend, drops prior debits, or weakens evidence/gate requirements. Graphene usefully models integer tokens, micro-USD, and wall time, reports limit/actual, and checks admission at claim; however, actual spend is recorded at node completion and the broad suggestion does not distinguish caller-correctable scope from authority-owned allocation. Node-addressed completion also makes spend attribution inherit the stale-successor hole. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/budget.rs:1-8] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/budget.rs:69-82] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/budget.rs:113-147] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:450-515] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:93-97]

A budget refusal performs zero debit/reservation mutation. Existing debit events remain visible; telemetry records only the observed allocation/debit version and requested delta, not private cost evidence.

**When not to use:** Do not retry because time passed, split work to evade a parent limit, translate unknown cost to zero, or turn a suggestion into self-service budget authority.

### 5. EXTEND repo #1 — human recovery separates wait, context refresh, timeout, and conflict

`await-human-decision` is not a retry: it preserves one open gate and waits for an authorized decision or timeout. `resolve-gate-evidence` creates a new gate version only after topology/evidence/belief context changes; changed options or consequence edges require recompile. A decision refusal such as `stale-gate-version`, `stale-gate-context`, `unauthorized-principal`, `expired-gate`, or `invalid-choice` changes neither gate nor domain state. A declared timeout is instead a separate authorized domain transition; silence never becomes approval. Graphene compiles explicit options, consequence maps, and timeout policy and renders pending belief context, but `HumanResolve` and timeout sweeping are node-addressed rather than fenced commands bound to gate version, topology/evidence/belief digests, principal, and expected state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-cli/src/plan.rs:197-230] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:387-470] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:599-710] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:829-887] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:53-59]

Evidence exposure is a digest-bound access-filtered snapshot with current truth labels. Telemetry may report pending, denied, or expired without revealing sealed evidence or identities.

**When not to use:** Do not redispatch on every poll, infer approval from timeout, reuse a decision against another gate version, or let a refusal select a consequence edge.

### 6. REFINE Graphene — belief/nogood recovery is predicate-specific

The action registry preserves why a premise is unusable. A stale source uses `refresh-belief-context`; `NEITHER` with missing support waits for or supplies named support; `BOTH` requires contradiction evidence rather than winner selection; same-source corroboration uses `supply-distinct-source`; invalid supersession uses `observe-again`; and a candidate completing a nogood uses `remove-nogood-member` or `contact-operator`. An already-dirty all-`IN` nogood requires quarantine/operator recovery, not a candidate refusal attributed to the next transition. Every retry recomputes the fixed point at an exact verified head. Graphene has four-valued/staleness detail and fixed-point invalidation, but G8 sees an already-invalid nogood only after mutation and generic suggestions do not distinguish absent, withdrawn, contested, stale, or unenforceable support. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:83-169] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:717-770] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:888-935] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:417-438]

A prospective refusal changes no belief, validity interval, relation, projection, claim, budget, or effect. It exposes minimal predicate/member/evidence references; full evidence stays sealed or separately authorized.

**When not to use:** Do not auto-retract, choose a `BOTH` side by confidence, count repeated same-source evidence, repair a dirty base during candidate admission, or claim minimal repair without proof.

### 7. CONFIRM repo #1 — response, denial audit, and telemetry are separate persistence boundaries

There are three outputs: (1) a non-authoritative refusal response; (2) an immutable authorization-audit denial only when the gateway evaluated the attempt; and (3) bounded operational telemetry for local boundary observations. The refusal fixes `domain_append=false` and `effect_authorized=false`; budget, claim/fence, gate, belief, projection/checkpoint, output, and receipts remain unchanged by the rejected operation. The audit denial binds exact request/head/state/policy/authority/evidence identities but is not a domain event. Graphene's stdout/exit-0 outcome makes expected denial legible, while 036 makes gateway denial replayable; parity needs both plus unchanged authoritative heads. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:1-12] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:126-145] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:168-225] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-776] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:878-895] [INFERENCE: parity must prove unchanged authority plus the expected non-domain observations]

Allowlisted telemetry is code/version, boundary, attempt/correlation, subject digests, version identifiers, retry class, action, latency, and outcome. Raw prompts, policy internals, evidence bodies, secrets, capabilities, leases/fences, and executable payloads are excluded.

**When not to use:** Do not require “no append anywhere” when a gateway denial is audited, count telemetry as domain mutation, mint an audit decision for compiler failure, or infer permission from missing refusal telemetry.

## Recovery matrix

| Family | Stable action | Retry condition | Rejected-operation mutation | Durable visibility |
|---|---|---|---|---|
| Compile | `fix-proposal` / `refresh-and-recompile` | changed proposal or named compile input | none | operational diagnostic |
| Claim held | `wait-for-claim-release` / `choose-other-work` | release/expiry plus fresh admission | none | guard telemetry; denial if gateway reached |
| Stale claim/fence/head | `rebind-and-reclaim` | fresh claim, fence, head, versions, request, authorization | none | observations plus linked denial |
| Budget | `reduce-scope` / `request-budget-change` | new compile or governed allocation | no debit | observed totals without private evidence |
| Human | `await-human-decision` / `resolve-gate-evidence` | wait same gate or mint new version | refused decision: none | timeout/decision are separate events |
| Belief | `refresh-belief-context` / `supply-distinct-source` | new evidence/head and fixed point | none | minimal predicate/evidence refs |
| Nogood | `remove-nogood-member` / `contact-operator` | candidate change or dirty-base recovery | none | refusal or quarantine evidence |
| Effect in doubt | `run-effect-recovery` | verified not-applied plus retry policy | no re-execution | recovery receipt chain |

## Negative controls

1. Re-submit byte-identical compile input under identical identities: same refusal, no graph/gateway/domain artifact.
2. Use a stale-fence refusal's observed fence after takeover: rejection; only the live claimant may mutate.
3. Resume after budget exhaustion: prior debits and root allocation remain.
4. Poll one open gate repeatedly: no duplicate gate, decision, effect, or debit; timeout is a separate event.
5. Make a premise `BOTH`: claim/retry remains blocked until a new exact-head fixed point is usable.
6. Complete a nogood prospectively: prior domain head is unchanged; an already-dirty base follows quarantine.
7. A gateway denial has exactly one audit decision and zero domain/effect receipts; a compiler refusal has neither.

## Assessment

- `newInfoRatio`: **0.48**.
- Novelty: Iteration 010 defined the envelope and generic recovery classes; this pass resolves P6 with boundary-specific actions, retry predicates, non-mutation assertions, audit-versus-telemetry persistence, and concrete Graphene mismatch findings.
- Confidence: High for observed Graphene and 036 boundaries; medium-high for the proposed action/code vocabulary because implementation placement remains undecided.

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- Graphene `plan.rs`, `refusal.rs`, `budget.rs`, `belief.rs`, `fold.rs`, `gates.rs`, and `graphene-exec/src/lib.rs`
- 036 `authorized-ledger-types.ts` and `transition-authorization-gateway.ts`

## Reflection

- What worked: Deriving recovery from failure code, enforcing boundary, and exact observed state exposed where one friendly suggestion hides materially different authority.
- What failed: A universal retryable boolean and surface-local suggestions cannot safely express compile defects, claim races, governed budget changes, human waiting, dirty nogoods, or in-doubt effects.
- Ruled out: executable suggestions, same-request stale retries, new budgets on resume, node-only human decisions, implicit timeout approval, generic belief advancement, dirty-base repair during admission, and “no append anywhere.”

## Recommended Next Focus

P7 human gates over live belief context and invalidation semantics.

