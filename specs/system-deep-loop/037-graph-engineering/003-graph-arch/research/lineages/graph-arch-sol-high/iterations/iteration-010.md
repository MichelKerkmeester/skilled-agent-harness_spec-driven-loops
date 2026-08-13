# Iteration 10: Governance Mutant Corpus and Staged Promotion

## Focus

This iteration converts the GraphARC stage examples and negative tests into a promotion-blocking governance corpus for the combined decisions from iterations 1–9. It does not treat stages 0–6 as increasing authority. They are capability archetypes used to seed closed, single-defect mutant cases; actual promotion proceeds mode by mode through manifest closure, negative controls, race/recovery evidence, shadow parity, reversible canary, separately authorized effects, and a current 036 pre-cutover certificate.

## Findings

1. **GraphARC stages are fixture families, not promotion levels — REFINE Decision 8 and CONFIRM studies 1–2.** Stage 0 proves local atomic-file restart; stages 1 and 4 prove bounded convergence; stage 2 proves validated routing and trace attribution; stage 3 proves isolated fan-out and deduplication; stage 5 proves evidence-gated independent review; stage 6 proves supersession-preserving memory. None proves admission/authorization separation, durable approval, cross-process fencing, ledger closure, effect recovery, or authority cutover. The promotion manifest must therefore classify each stage behavior as an observation case, then add the governance mutants below. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/examples/stage0_dag.py:1-8] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/examples/stage1_loop.py:1-10] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/examples/stage6_memory.py:1-7] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:541-552]

2. **Every mutant has one injected defect, one earliest owning gate, and a closed expected outcome — EXTEND Decision 6 and Graphene P3.** A case may produce many downstream symptoms, but its promotion result is keyed to the earliest deterministic mismatch in the ordered contract chain. Admission bypass belongs to admission-proof verification even if replay later diverges; stale approval belongs to gate freshness even if the writer also rejects; effect leakage belongs to the effect boundary even if terminal bytes happen to match. This prevents downstream errors from laundering a missing upstream gate and makes ownership actionable. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:166-208] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:64-156] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:196-224]

3. **Promotion requires a closed evidence bundle, not a green test count — CONFIRM Decisions 4, 6, and 8.** The manifest binds immutable BASE, candidate/build identities, sealed inputs, mutation operator/version, expected owner/refusal/invariants, required observations, replay contracts, reference artifacts, and rollback anchors. A certificate requires every case in the closed mode set, zero open divergence, stable deterministic reruns, current contract/build bindings, legacy authority, and no authority mutation. A skipped, duplicate-conflict, missing-observation, unverifiable, or stale case blocks promotion even when all executed tests pass. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:107-246] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:253-387] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/checklist.md:64-76]

4. **Promotion stages change evidence exposure before they change authority — CONFIRM Decision 4 and the 036 authority plane.** Static and unit gates prove contracts; transactional races and recovery prove durability; shadow runs compare identical sealed inputs with dark effects suppressed; advisory and reversible canaries expose one consumer at a time. Only a separate mode-scoped 036 transition may select a writer or reader, and effectful canaries require their own `EffectIntent` authorization/recovery. Parity evidence cannot flip a flag, redirect a reader, disable legacy, or authorize an effect. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/plan.md:34-42] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/plan.md:68-87] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:513-521]

5. **Existing negative tests are strong local seeds but leave promotion-blocking cross-boundary gaps — REFINE Decisions 3–7.** Admission tests kill rename laundering, incomplete estimates, nested denial, full rejection loss, subclass fingerprint lies, and mutable registry widening. Policy tests kill deny-order, tenant leakage, unhandled approval, and unmatched-resource gaps. Stage tests kill prose routing, correlated reviewer instances, duplicate evidence, double supersession, and local crash duplication. Missing are sealed-argument escalation, stale gate dependencies, direct compiled-graph/session bypass, atomic budget reservation races, cross-ledger trace/audit disagreement, current fences, unknown schema/version decoding, unauthorized resume, and live-effect suppression. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:280-399] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:425-599] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py:1058-1124] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage5_gate.py:100-191]

6. **Required shadow observations are semantic and boundary-specific — EXTEND Decision 6 and CONFIRM iteration 8.** Every case declares terminal status/return value, error/halt, ordered transitions, effect intents/receipts, budget balances/reservations, emitted artifacts, and reader-visible results as applicable. Governance cases additionally require refusal/decision receipts, authority epoch and ledger heads, sealed artifact/proposal/policy/gate identities, attempt/debit and resume receipts, earliest causal prefix, authority snapshots, and shadow-effect sink evidence. Missing observations are a blocking result, never permission to compare the available subset. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:26-64] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:104-159] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/checklist.md:52-75]

7. **Promotion abort, projection disablement, and authority rollback are distinct gates — CONFIRM Decision 8 and Graphene's rollback decision.** Any live effect, authoritative-path collision, authority mutation, surviving mutant, nondeterministic rerun, missing observation, open divergence, or stale certificate aborts promotion while legacy remains selected. A post-cutover writer failure freezes admission, advances the epoch, fences writers, reconciles immutable evidence, and uses a governed rollback transition; it must not fall through to legacy inside the failing request. Disabling a derived projection or shadow harness does not roll back authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:476-490] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:552-554] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/plan.md:152-164]

## Earliest-Owner Rules

The runner evaluates owners in this strict order and records the first determinable failure. Later symptoms remain evidence but cannot replace the owner.

1. **Case compiler:** manifest closure, one mutation, immutable BASE/candidate, sealed-input equality, expected observation set.
2. **Isolation harness:** separate roots, path guards, dark effect sink, deterministic schedule, complete capture.
3. **Schema/decoder:** closed versions, canonical bytes, unknown-field/version refusal, no command decoding from evidence.
4. **Compile/admission:** registry membership, node/edge policy, bounds, complete refusal, quote completeness.
5. **Materialization seal:** exact proposal, registry body, arguments, writes, reducers, compiler flags, topology, artifact digest.
6. **Human gate:** request/version, authenticated principal/role, policy/resource/budget/authority freshness, terminal-decision winner.
7. **Budget authority:** ancestor reservation, lease, attempt debit, settlement/reconciliation, expected head/fence.
8. **036 transition gateway:** exact candidate, policy, identity, current heads/epoch, admission/gate/budget evidence.
9. **Fenced ledger writer:** current lease/fence, expected head, authorized event bytes, durable append receipt.
10. **Effect boundary:** authorized `EffectIntent`, idempotency/recovery receipt, no shadow/live dispatch.
11. **Replay/projection:** closed ledger cuts, reducer/upcaster identities, causal prefix, checkpoint/reference fingerprints.
12. **Reader/telemetry comparator:** legacy bytes, reader shapes, bounded redaction, derived trace/OTel disagreement.

[SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/plan.md:68-87] [INFERENCE: ordered by the combined producer-to-consumer boundaries specified in iterations 3–9]

## Mutant Matrix

`A/E invariant` abbreviates “no authoritative mutation / no external effect” unless the expected case explicitly reaches an authorized append or suppressed effect intent.

| ID | Single injected defect and prior decision | Earliest owner | Expected refusal/evidence | A/E invariant | First blocking promotion gate | Required shadow observations |
|---|---|---|---|---|---|---|
| M01 | Replace an admitted proposal with different bytes or a lying subclass — D3 | Compile/admission proof | `admission_proof_mismatch` / exact candidate digests | Zero / zero | G2 boundary mutants | sealed inputs, refusal, domain/budget heads |
| M02 | Directly invoke compiled graph without admission proof — D1/D3 | Compile/admission boundary | decoder/precondition refusal | Zero / zero | G2 | entrypoint, node-execution count, refusal receipt |
| M03 | Rename denied `deploy` instance to `helper` — D5 | Policy/admission | `node_denied` or `edge_denied`, source rule ID | Zero / zero | G1 negative controls | kind/name, compiled rule provenance, full refusals |
| M04 | Put permitted name on denied kind — D5 | Policy/admission | same policy refusal | Zero / zero | G1 | kind-resolution transcript, rule identity |
| M05 | Change forwarded args after admission or smuggle privileged args — D4/D5 | Materialization seal | artifact/argument digest mismatch | Zero / zero | G2 | proposal/artifact bytes, factory/node count |
| M06 | Widen/freeze-bypass registry or swap node body after decision — D4 | Materialization seal | registry/body digest mismatch | Zero / zero | G2 | registry version/digest, compiled artifact, fence |
| M07 | Execute legal subset of multi-failure rejection — D7 | Compile/admission | complete `TransitionRefusalV1`; no partial artifact | Zero / zero | G2 | all rejection codes, zero node/budget/effect deltas |
| M08 | Convert ASK to allow/deny or route denied work to approver — D5/D7 | Policy compiler | typed ASK/refusal with exact rule/role | Zero / zero | G1 | policy decision, approval-call count, audit receipt |
| M09 | Reuse approval after policy, role, budget, graph, head, epoch, or expiry change — D6 | Human gate | `gate.invalidated`; new gate version if replanned | Zero / zero | G2 | gate dependencies, current heads, decision receipts |
| M10 | Two terminal decisions or timeout fabricated as human reject — D6 | Human gate | first-valid-wins / typed timeout | Zero / zero | G3 race/recovery | ordered gate events, principal auth, timer fence |
| M11 | Reuse reservation after retry/resume resets local meter — D9 | Budget authority | exhaustion/conflict or cumulative receipt | Zero / zero | G3 | ancestor balances, attempts, reservation/lease/head |
| M12 | Race siblings for final budget remainder — D9 | Budget authority/fence | one grant, one exhaustion/stale-head outcome | Authorized grant only / zero | G3 | both requests, fence epochs, ordered budget events |
| M13 | Release committed or unknown spend as refund — D9 | Budget settlement | anomaly + blocked scope/reconciliation | No extra authority / zero | G3 | usage completeness, committed/released balances |
| M14 | Resume gated task from checkpoint/session without current append receipt — D6 | Human gate/036 | stale or missing-receipt refusal | Zero / zero | G2 | checkpoint, gate, domain receipt, node count |
| M15 | Reuse stale 036 allow or fence after head/epoch change — D1/D2 | 036/fenced writer | authorization/fence/head refusal | Zero / zero | G3 | request/decision, current head, fence capability |
| M16 | Invoke effect from approval/refusal/graph result without `EffectIntent` — D6/D7 | Effect boundary | command-union decode refusal | Zero / zero | G2 | intent absence, adapter calls, effect sink/receipts |
| M17 | Crash after effect/append and blindly execute again — D2/D6 | Effect recovery | prior receipt or in-doubt reconciliation | One authorized mutation / no duplicate effect | G3 | append/effect receipts, adapter call count, recovery path |
| M18 | Make trace, session, checkpoint, or OTel disagree with ledger — D4/D8 | Replay/projection | earliest immutable divergence; rebuild derived view | Ledger unchanged / zero | G4 shadow parity | closed cuts, causal prefixes, both projection digests |
| M19 | Drop/misorder trace line but preserve final state — D8 | Replay/projection | prefix/observation divergence | Zero / zero | G4 | ordered transitions, missing observation, final bytes |
| M20 | Route stage-2 model prose instead of validated event — D8 | Runtime router | typed parse/refusal route | Zero / zero | G1 | model output, validated event, selected edge |
| M21 | Count duplicate stage-3 evidence as independent confidence — D8 | Reducer/fan-in | projection-semantic divergence | Zero / suppressed | G1 then G4 | worker identities, source keys, reduced evidence |
| M22 | Treat failed/hung fan-out as success or partial input as complete — D8/D9 | Fan-in contract | incomplete/error route, not target-met unless declared | Zero / suppressed | G1 then G4 | branch outcomes, completeness contract, budget receipts |
| M23 | Let stage-1/4 cycle rediscover rejected/dead-end work or omit stop cap — D8/D9 | Convergence/budget gate | no-progress/max-attempt/exhaustion | No post-stop mutation / zero | G1 | seen/dead-end set, rounds, attempts, terminal reason |
| M24 | Same reviewer instance, unparseable/non-Boolean verdict, or quote-mined negation accepted — D8 | Evidence gate | fail-closed rejection | Zero / zero | G1 | author/reviewer identity, source window, verdict shape |
| M25 | Overwrite stage-6 claim history, double-supersede, self-supersede, or collide normalized entities — D4 | Truth/memory admission | typed refusal; history preserved | Zero / zero | G1 then G4 | before/after claim graph, provenance, reader result |
| M26 | Omit any required observation or normalize authority/effect/refusal/budget field — D6/D8 | Case compiler/comparator | `missing-observation` or manifest failure | Zero / suppressed | G4 | manifest and captured class-set equality |
| M27 | Produce nondeterministic classification on identical sealed rerun — D6 | Isolation/replay harness | `nondeterministic` divergence | Zero / suppressed | G4 | repeated transcripts, schedules, component digests |
| M28 | Reuse certificate after build, manifest, seal, replay, reducer, adapter, or comparator drift — D8 | Promotion preflight | stale-certificate refusal | Legacy remains / zero | G5+ | all certificate bindings and current identities |

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py:280-399] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage0_gate.py:23-71] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage6_gate.py:120-142] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/checklist.md:68-75]

## Stage and Promotion Gates

GraphARC stage numbers remain fixture tags; `G0–G7` below are promotion gates.

| Gate | Authority state | Blocking evidence |
|---|---|---|
| **G0 — Case closure/static** | Legacy only | Closed mode manifest; every stage behavior, governance boundary, observation class, mutant, BASE/candidate, mutation operator, expected owner/outcome, and rollback anchor mapped exactly once. Zero unexplained exclusions. |
| **G1 — Deterministic local negatives** | Legacy only | Stage 0–6 positive/negative tests plus schema/property tests. Every local mutant dies; no test-only global residue. |
| **G2 — Cross-boundary governance mutants** | Legacy only | Admission, policy, argument/seal, stale gate, partial denial, direct-entrypoint, unauthorized resume/effect, and decoder mutants die at their earliest owner with authority/effect invariants. |
| **G3 — Transaction/race/recovery** | Legacy only | Sibling reservations, head/fence races, competing approvals, crash windows, idempotent retry, effect recovery, and reconciliation schedules pass under multi-process-capable fixtures. |
| **G4 — Closed shadow parity** | Legacy authoritative; candidate dark | Identical sealed inputs, isolated roots, suppressed effects, complete semantic observations, stable reruns, full mutant kill matrix, zero open divergence, current mode certificate. |
| **G5 — Advisory/reversible canary** | Legacy selected | One non-effectful consumer reads candidate output behind a mode-scoped gate. Rollback drill, reader parity, latency/cost/quality baseline, no authority mutation. |
| **G6 — Authorized writer/effect canary** | One explicitly selected mode/resource only | Fresh G4 certificate, 036 transition, current fence, one reversible writer; effects enabled separately with `EffectIntent`, receipts, in-doubt recovery, and rollback rehearsal. |
| **G7 — Mode cutover/retirement eligibility** | Candidate selected by 036 per mode | Current certificate and bindings, configured rollback duration/successful-run minima, zero divergence, measured SLOs, recovery/rollback drills. Legacy rollback assets retire only through separate consumer-specific gates. |

The Roadmap's progression from contracts through fan-out, routing, verification, isolation, convergence, cost, and self-routing is useful fixture taxonomy, but it supplies no authority or promotion evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:52-104] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:155-217] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:240-266]

## Promotion Evidence Bundle

```ts
interface GovernancePromotionEvidenceV1 {
  schema_version: 'governance-promotion-evidence@1';
  mode: string;
  promotion_gate: 'G0' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7';
  base_sha: string;
  candidate_build_digest: string;
  case_manifest_digest: string;
  mutation_registry_digest: string;
  case_ids: readonly string[];
  mutant_results: readonly {
    mutant_id: string;
    injected_defect_digest: string;
    expected_owner: string;
    observed_owner: string;
    expected_outcome_digest: string;
    observed_outcome_digest: string;
    required_observation_digest: string;
    authority_before_digest: string;
    authority_after_digest: string;
    effect_sink_digest: string;
    rerun_evidence_digests: readonly string[];
    status: 'killed' | 'survived' | 'invalid' | 'nondeterministic';
  }[];
  reference_set_digests: readonly string[];
  replay_attestation_digests: readonly string[];
  divergence_records: readonly string[];
  open_divergence_count: 0;
  authority_state: 'legacy_authoritative';
  authority_mutation: false;
  shadow_effects_suppressed: true;
  measured_baseline_digest: string | null;
  rollback_drill_receipt_digest: string | null;
  parity_certificate_digest: string | null;
  generated_at: string;
}
```

The bundle is immutable evidence, not a bearer capability. A promotion preflight independently checks current BASE, build, manifest, mutation registry, seals, replay/reducer, adapters, comparator, certificate, policy, heads, and authority epoch. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:259-289] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:253-387]

## Coverage Gaps

| Existing coverage | What it establishes | Promotion-blocking gap |
|---|---|---|
| Stage 0 crash before atomic rename | Local report exactly once after checkpoint resume | No fenced ledger append, external effect intent/receipt, crash-after-send ambiguity, or unauthorized resume case. |
| Stages 1/4 stop tests | Target/no-progress/round-cap precedence | No durable attempt debit, cumulative reservation across resume, or authority-zero exhaustion evidence. |
| Stage 2 attribution/replay | Bad model output is traceable; routing uses typed state | Trace/checkpoint is non-canonical; no closed ledger cut, audit linkage, missing-observation, or same-final-state prefix mutant. |
| Stage 3 fan-out | Failure isolation, timeout, dedupe, concurrency cap | “Surviving workers may synthesize” is not universally valid; completeness must be a sealed per-fan-in contract with budget/effect receipts. |
| Stage 5 verifier | Fresh reviewer instance, bounded source, fail-closed parsing | Model-instance inequality is not organizational independence, authenticated role, current policy, or 036 authorization. |
| Stage 6 memory | Supersession history and backend parity | No truth-admission head, concurrent correction race, claimant authority, purpose-bound reader, or ledger projection proof. |
| Admission/policy/planner negatives | Strong local bypass and TOCTOU seeds | No cross-process current-head/fence, durable approval, budget reservation, effect, or certificate freshness coverage. |
| Current shadow runtime | Closed observation classes, earliest divergence, certificate bindings | No GraphARC-specific compiled manifest and mutant runner wiring yet; stage tests have not produced promotion evidence. |

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage0_gate.py:23-71] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage3_gate.py:17-108] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage6_gate.py:85-142] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:532-552]

## Runtime Mapping

| Responsibility | Runtime owner | Required GraphARC integration |
|---|---|---|
| Case/observation manifest | `runtime/lib/shadow-parity` manifest types | Compile stage examples, prior D1–D9 contracts, entrypoints, readers, artifacts, budgets, effects, and mutants into one closed mode set. |
| Mutant runner | New adapter beside shadow-parity harness | Apply one registered mutation at a time; reject accidental multi-defect or no-op cases before execution. |
| Earliest divergence | `shadow-parity-harness.ts` | Extend owner vocabulary with admission, materialization, human-gate, budget, 036, fence, effect, replay, and reader boundaries. |
| Admission/policy/refusal | GraphARC tests + `TransitionRefusalV1` adapters | Preserve complete stable codes/source rules and prove zero mutation at every downstream boundary. |
| Authorization/append | `authorized-ledger` + `locks-and-fencing` | Run stale-head/epoch/fence, direct-entrypoint, recovery, and receipt-consumption mutants. |
| Budget | `hierarchical-budgets` | Run sibling race, retry/reset, unknown spend, reconciliation, and exhaustion-routing mutants. |
| Effects | `receipts-and-effect-recovery` + shadow effect sink | Suppress dark effects while comparing exact intent/receipt evidence; later canary enables one separately authorized adapter. |
| Replay/readers | replay fingerprints + GraphExecution projection | Compare causal prefixes, reference-closed cuts, checkpoints, trace/OTel projections, and reader-visible bytes. |
| Certificate | `parity-certificates.ts` | Bind GraphARC manifest/mutation/adapters and reject drift before every canary or cutover transition. |
| Promotion/cutover | 036 per-mode gates | Consume evidence as a fail-closed precondition only; authority changes through a separate fenced transition. |

[SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/plan.md:95-115] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/checklist.md:99-108]

## When Not to Use

- Do not run the full promotion corpus for a local pure function with no authority, persistence, concurrency, resume, budget, reader compatibility, or external effect; focused unit/property tests are proportionate.
- Do not infer promotion maturity from GraphARC stage number, test count, line coverage, or a happy-path demo.
- Do not require terminal byte equality for intentionally changed user-visible semantics; define a versioned migration oracle and separately prove governance invariants.
- Do not normalize away policy, identity, authority, refusal, budget, fence, effect, causation, or receipt differences.
- Do not run dark effect paths against live destinations. Compare suppressed intent and synthetic/isolated receipts until a separately authorized effect canary.
- Do not use a parity certificate as authority, approval, budget, fence, or effect capability.
- Do not promote all modes or governance mechanisms as one stack. Gate each consumer/resource independently and retain rollback assets until its own retirement gate passes.
- Do not auto-rebaseline a surviving mutant or divergence. Change the manifest only through a reviewed version with the previous evidence retained.

## Ruled Out

- Treating stage 0–6 completion as a maturity ladder or cutover signal.
- Passing promotion because all discovered tests ran while required cases or observations were absent.
- Classifying a mutant by its last visible symptom instead of its earliest owning gate.
- Allowing shadow parity, triage, normalization, or certificate issuance to change authority or emit live effects.
- Falling back to legacy inside a post-cutover request after a selected writer fails.

## Dead Ends

- The prompt's `context/graph-arch/examples/` path does not exist. Repository discovery found the canonical examples under `context/graph-arch/grapharc/examples/`; retrying the stale path is exhausted for this packet. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/examples/stage0_dag.py:1-8]
- Reusing the Roadmap's 14 pedagogical steps as promotion stages cannot supply authority, evidence closure, recovery, or rollback semantics; it remains a fixture-taxonomy source only. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:22-266]

## Edge Cases

- Ambiguous input: “stage/promotion gates” could mean GraphARC example stages or deployment gates. Resolved by preserving stage 0–6 as fixture tags and defining independent promotion gates G0–G7.
- Contradictory evidence: Stage 3 intentionally synthesizes surviving workers, while the Roadmap recommends fan-ins tolerate missing inputs; some governed fan-ins require all branches. Resolved with a sealed completeness contract per fan-in—partial survival is legal only when declared and remains observable. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage3_gate.py:50-74] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:195-207]
- Missing dependencies: the prompt's example directory was stale. Direct repository discovery found all seven examples under `grapharc/examples`, so evidence coverage is complete after Tier-1 recovery.
- Partial success: none. Five productive research actions plus one recovered stale-path attempt supplied sufficient evidence.

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/examples/stage0_dag.py` through `stage6_memory.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_stage0_gate.py` through `test_stage6_gate.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_admission.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_policy_engine.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_loop.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_approval.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_replay.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_budget_enforcement.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py`
- `specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md`
- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/`
- `.opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/`
- `specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md`
- Iterations 1–9 in this lineage.

## Assessment

- New information ratio: 0.79
- Questions addressed: Which mutants block promotion, which gate owns each defect, which refusal/evidence and authority/effect invariants are required, how promotion stages use shadow observations, and what current tests do not prove.
- Questions answered: The mutant matrix, G0–G7 promotion gates, earliest-owner rules, evidence bundle, coverage gaps, runtime mapping, rollback distinctions, and non-applicability boundaries are decided at design level.
- Questions remaining: Concrete authorized-ledger, mode-registry, shadow-parity, hierarchical-budget/fencing, and final 036 integration mappings remain in iterations 11–15.

## Reflection

- What worked and why: Treating each prior governance decision as a fault boundary, then assigning one injected defect to the earliest owner, converted a broad test inventory into a promotion-blocking oracle instead of a checklist of filenames.
- What did not work and why: The prompt's example directory was stale, and broad governance-test scans truncated because the negative corpus is large. Repository discovery plus narrow stage, admission, parity, and certificate ranges recovered the authoritative paths and semantics.
- What I would do differently: For the authorized-ledger mapping, begin from M01/M07/M09/M14–M17 and trace the exact request, decision, refusal, append, and effect receipt schemas through existing runtime APIs.

## Recommended Next Focus

Map the combined graph contracts to `runtime/lib/authorized-ledger`: exact event types, gateway request fields, proof/refusal unions, append receipts, idempotency and head/epoch checks, projection/replay ownership, missing adapters, and the M01/M07/M09/M14–M17 insertion points.
