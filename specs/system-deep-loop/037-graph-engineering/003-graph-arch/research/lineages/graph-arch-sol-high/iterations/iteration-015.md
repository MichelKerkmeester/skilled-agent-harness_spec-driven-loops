# Iteration 15: 036 Authority-Plane Integration and Verification Order

## Focus

This iteration synthesizes iterations 3–14 into one fail-closed graph transition protocol over the shipped 036 authority plane. It distinguishes facts 036 independently derives, immutable evidence it verifies by digest/reference through a trusted graph evidence resolver, facts owned by other ledger services, and observations that never bear authority. The explicit iteration prompt governs this pass; the reducer's narrower recovery note is incorporated into refusal and recovery mapping.

## Findings

1. **The graph remains a compiled projection and transition proposer over one 036 authority plane — CONFIRM studies 1–2 and iterations 1, 8, and 11.** Proposal, organization graph, work graph, compiled execution graph, and evidence graph have distinct owners, but none owns domain truth, effect execution, budget accounting, fencing, or cutover. Every state-changing graph step becomes a canonical event request to the existing gateway and ledger; creating a graph-local authorization or history plane would duplicate ordering and split authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:5-7] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/README.md:12-29]

2. **The exact protocol needs a quote-before-gate and reservation-after-gate split — REFINE iteration 14 and EXTEND iterations 4 and 6.** A deterministic compiler first emits admission proof, compiled policy reference, and materialization seal; a budget quote proves only that the request is presently plausible. Any ASK gate binds those immutable digests and suspends without a reservation or lease. On resume, the graph adapter verifies the durable decision, rechecks immutable bindings, refreshes live heads/policy/identity, then obtains the authoritative ancestor-wide budget reservation and bounded claim/fence. This prevents approving unknown executable bytes while also avoiding capacity/lease retention across human delay. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:55-59] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md:69-77] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/approval.py:1-6]

3. **Graph integration must make evidence and identity resolution mandatory; the generic gateway does not do so by itself — EXTEND iteration 11 and CONTRADICT any reading that a caller-supplied evidence digest is automatically verified.** `TransitionAuthorizationRequest` carries actor, capability, and evidence digest, but the shipped `identityResolver` is optional. When absent or noncommittal, decisions honestly mark those fields unverified, and a policy can still allow. The graph authority adapter must configure a trusted resolver that validates the closed evidence bundle and positively pins all three fields; the graph transition policy must reject any `*_verified=false`. The evidence bundle verifier, not untrusted request data, resolves and verifies admission proof, seal, compiled organization policy, gate receipt, budget reservation, protected resource/fence claim, and their subject/freshness bindings. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:213-348] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-831] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:542-677]

4. **036 re-derives a narrow live core and verifies the graph-specific remainder by closed digest/reference — REFINE iterations 3–6, 9, 12, and 14.** The gateway independently obtains the verified domain head and current per-mode authority snapshot, checks event registry identity, exact epoch, trusted identity bindings, exact registered policy/digest, and deterministic policy result. Canonical envelope preflight/append independently reconstructs event bytes and digest; the fenced writer revalidates the current resource capability. It does not independently rerun the graph compiler, admission solver, human deliberation, usage provider, or materializer. Those owners emit immutable receipts whose bytes and subject bindings the resolver verifies; policy consumes their combined evidence digest plus captured authorization state. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:571-777] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:138-194] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:65-92]

5. **Every refusal belongs to the earliest owner and changes only that owner's stream — CONFIRM iterations 7, 10, and 13.** Compiler/admission refusal produces authority-zero refusal evidence and no 036 authorization decision. Gate pending/denied/expired changes only gate state. Budget denial/exhaustion changes only the budget ledger. Lock timeout/stale fence changes only lock evidence. Gateway denial advances only its non-domain audit stream. Failed proof linkage or append advances no domain sequence. Effect refusal advances no effect confirmation, and replay mismatch exposes no projection. A later owner must never relabel an earlier refusal as its own deny, and no refusal receipt authorizes a transition or effect. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:79-101] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md:83-110] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/admission.py:976-1012]

6. **Circular dependencies are broken with preflight identities and receipt-linked sagas, not cross-ledger atomicity — EXTEND iteration 14.** Admission proof and seal bind proposal/content, never a future domain sequence. The graph evidence bundle binds the observed prior head, while the gateway re-reads that head immediately before decision. A fence is acquired before event construction so its resource/token can be bound into the requested event; the append frame independently records the capability's fence token. Budget reservation binds stable dispatch identity, not a future executor receipt. Effect intent is durably authorized before invocation, and confirmation binds the intent. A durable allow followed by a crash is visibly unapplied and is retried only with exact idempotency/freshness; ambiguity after external invocation goes to reconciliation, never blind replay. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:213-317] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:103-128] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts:745-924]

7. **Replay proves history and deterministic derivation; telemetry only projects verified results — CONFIRM iterations 8 and 13 and REFINE study 1's trace proposal.** Verified replay checks stored frame order/hash/authorization linkage, effective event/upcaster identity, reducer/projection identity, and final fingerprint. It can detect an unapplied allow, divergence, or stale dependency but cannot retroactively authorize, execute an effect, repair history, or create a new expected baseline. Only after replay succeeds may graph status, OTel spans, dashboards, evidence graphs, GraphARC trace views, or checkpoints project the result; loss or corruption of those projections never changes ledger truth. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:83-119] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-replay.ts:56-149] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:55-57]

## Numbered Verification Sequence

1. **Canonicalize proposal.** The proposal owner assigns stable proposal/work-graph identity and canonical bytes. It has no execution capability.
2. **Compile and admit statically.** The deterministic compiler checks schema, topology, ports, reducers, capabilities, write sets, gates, resource declarations, bounded cycles, and policy references; it emits either a complete refusal set or `AdmissionProofV1` bound to proposal and compiler/registry versions.
3. **Compile organization policy.** The policy compiler resolves canonical mode, tenant/role assignment, resource class, platform/mode ceilings, rule provenance, and gate requirement into an immutable registered policy identity plus captured authorization-state digest. Organization policy may narrow, never widen, platform/mode capability ceilings.
4. **Seal materialization.** The materializer resolves node bodies, adapters, arguments, schemas, reducers, gates, effects, and compiler flags into `MaterializationSealV1`. It creates no runnable authority and performs no effect.
5. **Quote budget.** The budget owner evaluates a non-authoritative quote against the sealed workload. A quote is informative, expires, and cannot dispatch.
6. **Resolve gate.** If compiled policy yields ASK, append a durable gate request bound to proposal, proof, policy, seal, quote, subject, allowed principals, and expiry; release local resources and wait. Deny/timeout is terminal for this candidate. On approval, verify the signed/durable gate receipt and re-enter at step 7.
7. **Refresh live evidence.** Re-resolve canonical subject identity, current organization/mode policy projection, authority state/epoch, relevant ledger heads, resource registry, pricing, and replay inputs. Any drift invalidating the gate or seal returns to compile/gate rather than being normalized.
8. **Reserve budget authoritatively.** Create an idempotent reservation across every program/mode/lineage/iteration ancestor and all four dimensions for stable `(run, dispatch)` identity. Denial stops before claim or dispatch.
9. **Acquire canonical claim/fence.** Resolve the minimal protected resource set, sort unique resources by `orderKey`, acquire bounded leases, and bind resource digests, lease IDs, and fence tokens. No external call or human wait occurs under a fence guard.
10. **Assemble closed evidence.** Create `GraphTransitionEvidenceV1` referencing exact proposal, admission, policy, seal, gate, budget, resource/fence, prior-state/replay, actor, capability, correlation/causation, and authority identities. Canonicalize and hash it.
11. **Preflight event.** Construct the registered current-version graph event whose immutable envelope identity includes current authority epoch and whose payload binds transition coordinates, evidence digest, reservation/dispatch identity, and resource/fence facts. Canonical envelope preflight supplies the event digest.
12. **Resolve trusted identity/evidence.** The deployment-owned graph resolver loads every referenced artifact/receipt from its authoritative owner, verifies integrity, subject, freshness, non-revocation, exact event binding, and current applicability, then returns the expected actor ID, capability ID, and evidence digest. Any unverified field denies.
13. **Authorize through 036.** The gateway rejects invalid/recursive/unsupported input, re-reads verified domain head, re-reads current authority state/epoch, checks the trusted identity triple, resolves exact registered policy and digest, evaluates it under timeout, and durably appends allow or deny to the non-domain audit stream.
14. **Fenced domain append.** For allow only, enter `withFences`; revalidate every current lease, verify event/proof/ledger/freshness/head/epoch/policy/idempotency linkage, append immutable canonical bytes, fsync, and return the durable domain receipt. A deny or append error produces no graph-domain sequence or effect.
15. **Dispatch and attempt debit.** Persist/verify the dispatch receipt, then durably charge the attempt before executor spawn. A crash between authorization and domain append is an unapplied allow; between dispatch and spawn it is recovered by stable dispatch/attempt identity.
16. **Execute computation.** Pure computation may emit outputs and proposed transitions/effect intents only. It cannot mutate graph authority directly.
17. **Authorize each effect separately.** Derive a replay-stable logical effect key, validate a replay-safe/conclusively reconcilable adapter, durably append the effect intent through its gateway/fence, elect one owner, invoke, and durably confirm. Ambiguity invokes reconcile/operator resolution.
18. **Settle budget.** Validate normalized terminal usage against dispatch, replay fingerprint, pricing digest, units, deadline, and reservation. Commit incurred spend and release only proven unused capacity; unknown/mismatch creates an unreconciled block.
19. **Append terminal graph transition.** Under a fresh graph-state fence and gateway decision, append terminal state referencing dispatch, attempt, effect, settlement/anomaly, output/artifact, and causal receipts.
20. **Replay before projection.** Verify authorization/domain linkage, stored/effective event sequences, reducer/upcaster/schema/config identities, and fingerprint. Only then update disposable status/checkpoint/OTel/evidence projections.

## Owner and Fact Matrix

| Fact or transition | Sole owner | 036 treatment | Never inferred from |
|---|---|---|---|
| Proposal bytes/topology intent | Proposal service | Verify referenced canonical digest | Prompt prose, trace, filename |
| Static admission/refusal | Deterministic graph compiler | Resolver verifies proof subject/compiler/registry and digest | `AdmissionResult` object construction or caller Boolean |
| Organization/mode policy | Policy compiler + immutable transition-policy registry | Resolve exact ID/version/digest; re-evaluate captured state | Alias, mode metadata, executor self-report |
| Executable artifact | Materialization/seal service | Resolver verifies complete manifest/content bindings | Returned compiled object or proposal fingerprint alone |
| Human gate | Durable gate ledger | Resolver verifies principal, decision, subject, version, expiry, revocation | Callback, session field, CLI command |
| Budget capacity/spend | Hierarchical budget ledger | Resolver verifies reservation/dispatch receipt; later settlement remains budget-owned | Quote, local meter, estimate, successful execution |
| Resource ownership | Fencing coordinator | Resolver/event bind claim; fenced writer independently validates current capability | PID, nonce, timestamp, lease object alone |
| Actor/capability/evidence | Deployment identity + graph evidence resolver | Gateway must positively pin all three | Caller-supplied strings |
| Current domain head | Append-only ledger | Gateway independently reads and compares | Evidence bundle claim or checkpoint |
| Authority state/epoch | Per-mode authority provider | Gateway independently reads and compares twice-bound event/request epoch | Policy metadata or gate approval |
| Authorization verdict | 036 gateway/audit ledger | Exact deterministic evaluation; durable allow proof or deny receipt | Admission, approval, budget, fence, certificate |
| Domain history/order | Fenced typed ledger | Validate proof/fence/head/event and append immutable frame | Authorization audit alone, telemetry |
| External effect | Effect intent/recovery service | Separate gateway/fence and confirmation/reconciliation | Node return, graph terminal state, approval |
| Replay truth | Verified ledger + registered replay components | Recompute stored/effective/projection fingerprint | Checkpoint, OTel, GraphARC trace |
| Telemetry/evidence graph | Projection/export owner | Consume verified receipts/events only | May never feed authority without a new admitted request |

## Trust-Boundary Diagram

```text
UNTRUSTED / NON-AUTHORITATIVE
  proposer / generator / GraphARC objects / model output / local trace / checkpoint
             |
             v
DETERMINISTIC EVIDENCE PRODUCERS
  compiler+admission -> policy compile -> materialization seal -> budget quote
             |                              |
             +-------- immutable digests ---+
                            |
                     durable human gate
                            |
                            v
AUTHORITATIVE CONTROL SERVICES
  identity/evidence resolver -> budget reservation -> lease/fence coordinator
             |                       |                    |
             +----------- GraphTransitionEvidenceV1 -----+
                                      |
                                      v
036 MUTATION BOUNDARY
  envelope preflight -> gateway + decision audit -> fenced typed append -> receipt
                                      |
                       +--------------+--------------+
                       v                             v
                executor attempt             effect intent gateway
                       |                             |
                       +-- usage/effect receipts ---+
                                      |
                              settlement + terminal append
                                      |
                                      v
VERIFIED READ BOUNDARY
  integrity -> upcast -> reduce -> replay fingerprint -> telemetry/checkpoints/views
```

Only downward arrows into a new owner transfer evidence; they never transfer the preceding owner's authority. Every return into the 036 mutation boundary is a new request evaluated against current state.

## Re-Derive, Verify, and No-Authority Classification

| Class | Exact contents |
|---|---|
| 036 independently re-derives | Canonical envelope/preflight digest; registered type/version and registry digest; verified current domain head; current authority state/epoch; exact policy registry entry/digest; deterministic policy verdict; append sequence/hash/receipt; current fence at commit; replay component digests |
| Trusted resolver verifies by bytes/reference | Proposal digest; admission proof and compiler inputs; organization-policy compilation provenance; materialization seal closure; human-gate decision; budget reservation; protected resource/claim facts; actor/capability subject; replay/artifact/config references; revocation/freshness conditions |
| Other authority owns, 036 only consumes receipt identity | Budget lifecycle and settlement; gate lifecycle; fence-token high-water; effect intent/confirmation/reconciliation; cutover certificate/state |
| Never authority-bearing | GraphARC trace/replay/session files; OTel spans; dashboards; evidence/knowledge graphs; model explanations; planner feedback; aliases; local meter/callbacks; timestamps as order; checkpoints; parity reports/certificates before explicit cutover consumption |

## Refusal and Recovery Mapping

| Failure/refusal | Owner-visible record | Graph-domain consequence | Recovery |
|---|---|---|---|
| Schema/compiler/admission failure | Complete typed refusal evidence | No gateway call, domain sequence, reservation, or effect | New immutable candidate after explicit remedy |
| Policy compile unknown/contradictory | Compiler refusal | No gate or transition | Fix governed source/version; recompile |
| Gate pending/deny/timeout/stale | Gate event | No reservation/lease/dispatch | Await, terminal candidate, or new gate after revalidation |
| Budget exhausted/stale/unreconciled | Budget denial/anomaly | No claim or dispatch | New authorized allotment or reconcile receipt |
| Lock contention/timeout/order error | Lock lifecycle evidence | No mutation | Bounded retry with canonical set; never force unlock |
| Stale fence/takeover | Typed stale-fence rejection | Old worker cannot append/effect/settle another attempt | Successor replays and continues under higher token |
| Identity/evidence unverified | Gateway deny audit | No domain append | Repair resolver/evidence; new request identity if content changes |
| Stale head/epoch/policy | Gateway deny audit | No domain append | Refresh all live evidence and reauthorize |
| Audit storage failure | No valid allow proof | No domain append | Restore audit service, reevaluate |
| Durable allow, append absent | Unapplied allow in audit replay | No domain state | Exact retry while valid, otherwise fresh decision; never invent append |
| Append crash/torn tail | Ledger integrity/recovery evidence | No receipt until durable commit | Verify/quarantine; retry exact event according to idempotency |
| Dispatch/attempt ambiguity | Existing receipt/event cut | No guessed spawn state | Replay stable IDs; preserve debit; reconcile or retry as new attempt |
| Effect ambiguity | Intent without confirmation | Terminal success blocked | Conclusive adapter reconcile or operator resolution; never blind resend |
| Usage missing/mismatch | Budget anomaly/unreconciled | New admissions blocked; terminal records anomaly | Later normalized receipt/reconciliation |
| Replay mismatch | Typed component divergence | No trusted projection/certificate | Restore historical component or stop; never rebaseline in verifier |
| Telemetry export failure | Exporter-local error | No authority/state change | Retry export from verified ledger cut |

## Circular Dependencies and Ordering Hazards

- The proposal/admission proof cannot include the eventual ledger sequence or append receipt; it binds canonical candidate inputs only.
- A gate must approve the sealed executable identity, but must not hold a reservation or lease. Therefore quote and seal precede the gate; authoritative reservation and claim follow approval.
- The evidence bundle observes a prior head, while the gateway independently checks that head immediately before decision. It never trusts a head merely because it was hashed into evidence.
- The event must bind resource/fence facts, so lease acquisition precedes event preflight; safety still comes from revalidation inside fenced append, not the recorded token.
- Authorization must precede domain append, while the append receipt cannot be part of its own request. The allow proof binds the exact event digest and prior head; the append frame adds sequence, record hash, and authorization/fence reference.
- Budget reservation precedes dispatch, but actual settlement follows executor/effect receipts. Unknown usage cannot be solved by rewriting the reservation or assuming the estimate.
- Terminal state depends on effect and settlement receipts; those services never infer their outcome from the proposed terminal state.
- Replay fingerprints exclude their own attestation range and never make telemetry an input to authoritative reconstruction.

## Integration Mutants

| ID | Injected defect | Earliest owner |
|---|---|---|
| AP15-01 | Caller constructs an admitted-looking object without compiler proof | Graph evidence resolver |
| AP15-02 | Gate approves proposal digest but not materialization seal | Gate verifier |
| AP15-03 | Hold reservation or lease throughout approval wait | Gate/orchestrator composition |
| AP15-04 | Policy alias or executor self-report selects capability | Policy compiler/identity resolver |
| AP15-05 | `identityResolver` absent or leaves any graph field unpinned | Graph transition policy/gateway composition |
| AP15-06 | Evidence digest matches bytes but receipt subject/run/attempt differs | Graph evidence resolver |
| AP15-07 | Evidence bundle head is accepted without live ledger comparison | 036 gateway |
| AP15-08 | Event epoch differs from current authority epoch | 036 gateway |
| AP15-09 | Policy implementation matches but captured authorization state drifted | Policy registry/gateway |
| AP15-10 | Fence token recorded in payload but no current capability at append | Fenced writer |
| AP15-11 | Deny appended into graph domain stream | Gateway/ledger type boundary |
| AP15-12 | Durable allow treated as applied after crash without domain receipt | Authorization replay/orchestrator |
| AP15-13 | Executor spawns before dispatch receipt or attempt debit | Dispatch/budget barrier |
| AP15-14 | Approval directly invokes external effect | Effect gateway |
| AP15-15 | Effect confirmation reused for different intent/input/adapter | Effect verifier |
| AP15-16 | Missing usage settles estimate and releases remainder | Budget authority |
| AP15-17 | Checkpoint or GraphARC trace overwrites replayed state | Replay boundary |
| AP15-18 | Telemetry failure changes terminal result | Projection/export boundary |

Each mutant must prove earliest-owner refusal, zero later authoritative mutation/effect, stable reason code, immutable prior evidence, deterministic replay, and iteration-13 causal-prefix attribution.

## No-Authority List

- Proposal generators, planners, LLM outputs, remediation text, evaluator prose, and `AdmissionResult` instances.
- Organization/work/evidence/knowledge graph projections, aliases, routing metadata, and executor capability self-reports.
- Materialized/compiled objects without a verified complete seal and current referenced registries.
- Human callbacks, CLI commands, session approval fields, and unsigned or stale gate decisions.
- Budget quotes, estimates, local meters, usage callbacks, and successful process exit.
- Lease objects, PIDs, nonces, timestamps, filenames, checkpoints, and pre-write fence checks.
- Authorization denies, refusal receipts, unapplied allows, parity certificates, replay reports, and cutover evidence unless consumed by their explicit next authority transition.
- GraphARC trace/replay, OTel, logs, dashboards, metrics, status views, caches, and exported evidence graphs.

## Compatibility

- Before cutover, the legacy writer/result remains authoritative. The dark graph path runs only after the legacy result is fixed, returns it unchanged for allow, deny, or typed-ledger failure, suppresses effects, and records divergences.
- The compatibility adapter maps legacy proposal, admission, approval, budget, trace, session, and output observations into the iteration-13 graph parity schema; it does not convert them into authoritative receipts.
- Mixed-version reads use registered adjacent upcasters while preserving original bytes. Unknown future versions or missing chains fail closed; old readers route or refuse rather than guess.
- Cutover is per canonical mode at a new authority epoch and requires fresh graph parity/mutant/replay/effect/budget/fencing evidence plus rollback rehearsal. Post-cutover requests never fall back to legacy inside the request.
- Rollback freezes admission, fences the current spine writer, reconciles in-flight dispatch/effect/budget state, restores legacy authority at a higher epoch, preserves both histories, and emits a rollback certificate.

## Non-Applicability

- Use a direct harness action for one deterministic command or small transform; no graph governance layer is justified.
- Use a single loop when all work is sequential and topology is exploratory or every step needs direct operator approval.
- Do not represent an ordinary bounded retry as a subgraph without independent state, roles, gates, or convergence.
- Do not use graph governance to replace 036 ledger, authorization, effects, budget, fencing, identity, certificate, or cutover owners.
- Do not use the current single-host fencing backend for multi-host coordination.
- Do not parallelize unknown/conflicting writes, impose full barriers where streaming readiness suffices, or create coarse graph locks for immutable/read-only work.
- Do not autonomously gate irreversible production writes, expand capability/budget/data access through topology, or use a knowledge/evidence graph as authorization.
- Do not add this protocol merely for visualization or novelty; require real branching/gating/subgraph/recovery needs and measured value over a simpler harness/loop.

## Ruled Out

- Treating the generic gateway's optional identity resolver as sufficient without graph-specific mandatory pinning.
- Asking 036 to rerun the graph compiler/materializer or human decision instead of verifying their immutable owner receipts.
- Calling budget reservation before an unbounded human gate or materializing unsealed bytes after approval.
- Folding denial into domain history, treating an allow audit event as an applied transition, or using telemetry/replay as a writer.
- A cross-ledger transaction or graph-local authority plane; receipt-linked recovery is the supported composition.

## Dead Ends

- Broad cross-repository searches again produced noisy legacy references. Narrow reads of the gateway/ledger/effect implementations, their unit tests, the owning phase-004/006 specs, and the two prior syntheses supplied the enforceable boundaries.

## Edge Cases

- Ambiguous input: The prompt's topic list could imply budget reservation before human wait. This iteration distinguishes a non-authoritative quote before the gate from the authoritative reservation after approval, consistent with iteration 14 and bounded resource ownership.
- Contradictory evidence: The gateway spec describes actor/capability/invariant evidence as complete authorization inputs, but the implementation permits unverified identity/evidence when no resolver pins them. The integration resolves this by requiring a graph-specific resolver and a policy that denies any unverified field; the generic gateway alone is not claimed to verify graph proof semantics.
- Missing dependencies: No shipped `GraphTransitionEvidenceV1` resolver or graph-domain policy exists; this iteration specifies that required integration seam rather than claiming implementation.
- Partial success: None; five focused local research actions answered the design question.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types,transition-authorization-gateway,append-only-ledger,authorization-replay,transition-policy-registry}.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/{types,effect-gateway,authorized-writer}.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/receipts-and-effect-recovery.vitest.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/{002-typed-append-only-ledger,003-replay-fingerprints,004-transition-authorization-gateway}/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/{001-receipts-and-effect-recovery,004-hierarchical-typed-budgets,006-locks-and-fencing}/spec.md`
- `specs/system-deep-loop/037-graph-engineering/{001-agent-swarms,002-graphene-main}/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/`
- Graph-arch lineage iterations 3–14

## Assessment

- New information ratio: 0.79
- Calculation: 4 fully new findings (quote/gate/reserve sequence, mandatory resolver gap, re-derive-versus-verify boundary, circular-dependency closure) and 3 partially new findings (one authority plane, refusal ownership, replay/telemetry boundary): `(4 + 0.5 × 3) / 7 = 0.786`, rounded to `0.79`.
- Questions addressed: What exact verification sequence integrates graph proof, policy, seal, gate, budget, fence, identity, authorization, append, effect, settlement, replay, and telemetry into 036 without duplicated authority?
- Questions answered: The 20-step sequence, sole owners, trust boundaries, re-derivation/reference split, refusal and recovery behavior, circular-dependency closure, mutants, compatibility, no-authority list, and non-applicability are decided at design level.

## Reflection

- What worked and why: Reading the shipped gateway types and tests beside the normative spec exposed the difference between a field being present and being positively verified, which made the graph evidence resolver seam explicit.
- What did not work and why: Broad study and GraphARC scans were noisy because they mixed design conclusions with local implementation claims; targeted authority-boundary anchors recovered the useful contrast.
- What I would do differently: In the blog synthesis passes, index each claim first by this owner/fact matrix so product guidance cannot silently contradict the authority protocol.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `15/15`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 5; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

Blog corpus synthesis, posts 1–6. Classify each product claim, architecture recommendation, and example against the owner/fact matrix and 20-step verification protocol; retain useful graph design guidance, mark authority-neutral pedagogy, and explicitly contradict any shortcut that treats generation, local budgets, approval callbacks, traces, or evaluation confidence as authorization.
