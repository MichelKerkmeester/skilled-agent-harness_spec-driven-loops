# Iteration 020 — Terminal completeness audit and synthesis-ready verdicts

## Focus

Audit the full lineage at the configured terminal boundary for unresolved contradictions, decision conflicts, evidence gaps, repo-1 deltas, exact P1–P7 verdicts, and dependency-safe implementation order. This iteration does not synthesize `research.md`.

## Terminal Verdict

All seven research questions are answered at design-decision level. No unresolved contradiction or decision conflict blocks synthesis. The remaining gaps require implementation, adversarial fixtures, or measured shadow evidence; they block promotion or cutover, not synthesis. The run stops because iteration 20 equals `maxIterations`; convergence remains telemetry only. [RELATION: REFINE repo-1 terminal audit] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-config.json:1-39] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-state.jsonl:16-21] [INFERENCE: evidence gaps assigned to implementation do not reopen a settled design question]

## Contradiction and Decision-Conflict Closure

| Conflict | Resolution | Terminal status |
|---|---|---|
| Graphene calls its SQLite log authoritative and can delete fold-equivalent events, while 036 requires immutable domain and authorization history | Consume only verified 036 ledgers; checkpoints and graph state are disposable; never compact committed authority history | Resolved by P2 |
| Graphene documentation implies revoked claims cannot complete, while `done(node, ...)` identifies no claimant or fence | Every protected mutation is claimant-addressed and validates the current per-resource fence and expected version atomically at commit | Resolved by P4 |
| Graphene defines observed-time supersession ordering, while the production fold closes validity without that comparator | Semantic ordering uses `(observedAt, authorizedSequence)`; replay order remains ledger sequence; competing or non-increasing successors are refused prospectively | Resolved by P5 |
| Graphene describes add-time nogood rejection, while the fold admits the set and G8 detects it afterward | Preview and settle every truth-affecting candidate against one serializable admission head; retain G8 as replay/import corruption backstop | Resolved by P5 |
| Golden fixture names advertise mechanisms not present in their event shapes | Require semantic manifests, independent closed-prefix checkpoints, and pinned plausible-wrong mutants | Resolved by P3 |
| A structured refusal includes actionable advice and may travel over a successful transport result | `TransitionRefusalV1` is an authority-zero, non-command outcome; every suggestion requires a fresh authenticated request | Resolved by P6 |
| A human allow can be valid when minted but stale before consequence append | Atomically revalidate gate fence/version and the declared semantic dependency vector at append; effect authorization remains separate | Resolved by P7 |
| Graphene's bounded settlement loop can exit without proving quiescence | Publish only a checked fixed point; reject cycles, oscillation, repeated state, or bound exhaustion | Resolved by P1 |

The first seven conflicts were evidenced directly in the orientation and adversarial iterations; the fixed-point-cap conflict was added by the cross-contract audit. [RELATION: EXTEND repo-1 with Graphene-specific negative knowledge] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:30-69] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:9-58]

## Synthesis-Ready P1–P7 Verdicts

### P1 — `BeliefProjectionV1`

**Verdict:** Adopt a derived, replayable belief projection over verified 036 events with orthogonal provenance, source identity, fidelity, validity, staleness, support, supersession, and `IN|OUT|BOTH|NEITHER` truth. Only current `IN` premises are usable. Settlement must prove quiescence and fail closed on cycles, oscillation, repeated state, or bound exhaustion. Required-answer-path blockers precede novelty and coverage telemetry, and every control consumer must verify selected authority state/epoch before using the projection. [RELATION: REFINE repo-1 Decisions 5 and 8; EXTEND with executable truth maintenance] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61-67] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:85-91] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:9-21]

**When not to use:** direct immutable facts, a one-pass validated DAG with no derived support, explanation-only outputs, or surfaces where legacy evidence/coverage signals already answer the decision without truth-state control.

### P2 — `GraphProjectionReducerV1`, `ProjectionCutV1`, and `GraphCheckpointV1`

**Verdict:** Fold only exact-version or registered deterministic-no-op 036 events. Bind every checkpoint to a reference-closed pair of independent domain and authorization-audit cuts, immutable replay-contract/code digests, topology/schema identities, and canonical output bytes. Accept a checkpoint only after closure and fingerprint verification; otherwise full-replay and atomically publish. Point-in-time reads are explicit dual cuts, never timestamp order or a synthetic cross-ledger sequence. Committed authority events are never physically compacted. [RELATION: REFINE repo-1 Decision 4; CONTRADICT Graphene authority-log compaction] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:53-59] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:29-34] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-state.jsonl:4-5]

**When not to use:** small streams where genesis replay is cheap, domain-only reads that intentionally exclude denial history, or any replay where event/upcaster/closure identity is unknown.

### P3 — `CrossAdapterTraceV1` parity

**Verdict:** Compare ordered operation prefixes, authorization decisions, outcomes, accepted domain ranges, budget/effect observations, and independent projection checkpoints. Accepted and refused operations have different dual-ledger rules; refusals require zero domain/budget/effect mutation plus one linked audit denial. Nondeterminism is only a manifest-declared partial order over proven-disjoint operations. Every positive scenario carries a single-defect mutant with an expected divergence class and earliest mismatch. [RELATION: REFINE repo-1 Decision 6; EXTEND terminal parity to causal-prefix parity] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:69-75] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-016.md:7-33] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:71-81]

**When not to use:** UI rendering, token streaming, transport throughput, intentionally non-semantic formatting, or a local deterministic unit whose direct oracle is stronger and cheaper.

### P4 — `GraphMutationCommandV1`

**Verdict:** Every protected mutation carries exact session/claim identity, immutable claim version, operation identity, payload digest, and a complete canonical target set; each target binds resource identity, current monotonic fence, and expected version or ledger head. Claim, authorization, idempotency, all fences, all expected states, and transition rules are revalidated in one authoritative protected-store commit. Multi-resource fences prevent stale writes but do not create cross-store crash atomicity; persist one authoritative ledger transition and derive views/effect intents. Graphene read sets and claimability may inform planning only. [RELATION: CONFIRM repo-1 Decision 2; REFINE lease insufficiency into an exact commit API] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33-41] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:23-28] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-state.jsonl:8-9]

**When not to use:** read-only queries and immutable content-addressed writes that cannot replace, alias, debit, append to, or externally effect a protected identity and have no takeover race.

### P5 — temporal supersession and serializable truth admission

**Verdict:** Order semantic supersession by the composite observation key `(observedAt, authorizedSequence)` while replay remains ledger-sequence ordered. Preserve half-open validity and immutable history. All support, contradiction, supersession, scope, staleness, and nogood candidates preview against one exact clean base and settle to a checked fixed point under one serializable belief-admission version/fence before sequence allocation. Refuse non-increasing successors, cycles, competing active successors, or completed nogoods with stable evidence; keep G8-like full replay as an independent corruption/import backstop. [RELATION: EXTEND repo-1 Decision 8; CONTRADICT Graphene's production supersession and post-admission nogood behavior] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:85-91] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:38-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:35-42]

**When not to use:** proven-disjoint offline/import-only data quarantined from control, immutable evidence with no truth-affecting relations, or a static invariant fully enforced by a simpler transactional constraint.

### P6 — `TransitionRefusalV1`

**Verdict:** Add a versioned refusal envelope with stable boundary/code, typed details, retryability, violated invariants, exact request/head/policy/fence identities, bounded repairs, audit-decision reference, and `authority: none`. It is an operation outcome, never a domain event, command union member, capability, allow proof, or executable repair. Unknown versions and codes fail closed; suggestions require a new authenticated, authorized request. [RELATION: EXTEND repo-1 failure-path semantics; REFINE Graphene actionable refusal with authority-zero typing] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:43-50] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:180-205]

**When not to use:** local deterministic parse/input errors with no gateway decision, presentation-only errors, or transports whose existing bounded typed error already supplies the complete stable contract.

### P7 — durable fenced human gate

**Verdict:** Open a durable gate against exact topology/evidence/belief cuts, allowed principals/capabilities, explicit options and consequence map, gate version/fence, expiry, timeout edge, and a minimal semantic dependency vector. At consequence append, atomically revalidate identity, decision idempotency, current gate fence/version, authority epoch, principal capability, expiry, topology, and every declared dependency; invalidate/reopen rather than reinterpret stale decisions. Edge selection and external effect remain separately authorized transitions. [RELATION: REFINE repo-1 Decision 4; EXTEND with live belief-context invalidation] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:53-59] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:51-58] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:207-215]

**When not to use:** informational acknowledgements, display-only preferences, or interactions with no consequence-bearing edge, mutation, budget change, or downstream effect.

## Repo-1 Delta Summary

Repo 1's seven-plane architecture, typed IR, gateway authority, safe-wave rule, structural verdicts, durable replay, typed subgraphs, organization/work split, and non-authoritative hybrid retrieval remain intact. This lineage changes no authority owner. It adds: executable belief maintenance to the knowledge/evidence plane (P1); a reference-closed dual-ledger replay identity and explicit non-compaction decision (P2); causal-prefix parity with independent oracles and mutants (P3); a claimant-addressed protected-store commit contract (P4); prospective temporal/nogood truth admission (P5); authority-zero recovery outcomes (P6); and live dependency-fenced human consequences (P7). [RELATION: CONFIRM repo-1 architecture; REFINE seven concrete contracts] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:13-91] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:233-241]

## Dependency-Safe Implementation Order

1. **Freeze shared wire and authority vocabulary; add P6 first.** Ship only additive, authority-zero refusal decoding plus unknown-version fail-closed tests. [RELATION: EXTEND repo-1 rollout] [SOURCE: iterations/iteration-018.md:180-205,235-241]
2. **Implement P2 in shadow.** Introduce the dual-ledger cut, deterministic no-op registry, full replay, disposable checkpoint, and checkpoint-delete/rebuild negative control. [RELATION: REFINE repo-1 replay] [SOURCE: iterations/iteration-017.md:29-34] [INFERENCE: all later projection and trace identities need one closed cut]
3. **Implement P3 before any control consumer.** Pilot on deep-research adapters with isolated roots, suppressed effects, independent checkpoints, A1–A7 schedules, and mutant survival as a hard failure. [RELATION: EXTEND repo-1 parity] [SOURCE: iterations/iteration-018.md:124-132,237-237]
4. **Harden P4 one protected store at a time.** Shadow target completeness, then canary one reversible writer; retain the old writer only behind governed authority rollback, never request-local fallback. [RELATION: CONFIRM repo-1 safe waves] [SOURCE: iterations/iteration-019.md] [INFERENCE: writer safety must precede new truth or human writers]
5. **Add P5 prospective truth admission.** Replay and quarantine dirty bases, dual-run previews, serialize all truth-affecting candidates through one admission version, and retain the independent replay backstop. [RELATION: EXTEND repo-1 knowledge semantics] [SOURCE: iterations/iteration-017.md:35-42] [INFERENCE: P1 control cannot be trusted while unsafe truth writes remain possible]
6. **Add P1 as advisory, then selected per consumer.** Prove settlement termination, shadow blocker decisions, and bind each promotion to P2/P3 evidence and the 036 authority CAS; retain legacy convergence for rollback. [RELATION: REFINE repo-1 projection boundary] [SOURCE: iterations/iteration-017.md:9-21] [SOURCE: iterations/iteration-019.md]
7. **Adopt P7 last and in three steps.** Render-only context, then a reversible non-effectful consequence edge, then a separately authorized effect with recovery receipts. [RELATION: EXTEND repo-1 human gates] [SOURCE: iterations/iteration-018.md:207-215,241-241]
8. **Retire nothing until independent gates pass.** Keep legacy readers/writers, upcasters, fixtures, rollback anchors, archival replay, and effect recovery until zero-use plus historical-read evidence authorizes retirement. [RELATION: CONFIRM repo-1 durable replay] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/deep-research-state.jsonl:21]

No step may promote a checkpoint, trace, refusal, human choice, alert, or projection into authority by interpretation. [RELATION: CONFIRM repo-1 authority separation] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-017.md:9-14,43-58]

## Evidence Gaps Assigned to Implementation

| Gap | What would close it | Consequence now |
|---|---|---|
| Exact package/file and final field names are proposed, not shipped | Scoped implementation plan plus schema review | Does not reopen P1–P7 semantics |
| P1 termination measure is not machine-proved | Cycle/oscillation/repeated-state/bound-exhaustion mutants and property tests | P1 remains advisory |
| P2 dual-cut closure and checkpoint identity are unimplemented | Genesis replay, corruption, missing-ref, same-version-drift, and delete/rebuild tests | No checkpoint control use |
| P3 trace normalization and A1–A7 mutants have not run cross-adapter | Sealed fixtures, independent expected prefixes, mutant matrix, first-mismatch evidence | No promotion certificate |
| P4 target enumeration and protected-store atomic commit are not wired across every caller | Caller inventory plus stale-successor and partial-mutation negative controls | No writer cutover |
| P5 conflict-key/storage choice and throughput are unmeasured | Serializable schedule tests and contention/latency baseline | No truth-control cutover |
| P7 dependency invalidation and effect recovery are not drilled | Post-allow invalidation, timeout/reopen, stale principal, and in-doubt effect fixtures | No consequence/effect cutover |
| No quality, latency, or cost benefit is measured | Shadow baseline and canary deltas against the legacy path | Design is not a business or rollout certificate |

These are evidence-class gaps rather than source-corpus gaps; more document-only iterations would not close them. [RELATION: REFINE repo-1 terminal audit] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:119-127] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-018.md:255-267] [INFERENCE: the next confirming instrument is executable shadow evidence]

## Ruled Out / Do Not Adopt

- A unified Graphene authority stack or graph-wide kill switch: it collapses independently reversible projection, parity, writer, truth, gate, and effect risks.
- Authority-log compaction, timestamp replay order, or a synthetic domain/audit sequence: each destroys required history or invents unsupported order.
- Projection freshness, terminal parity, repeat-green, checkpoint validity, or transport success as authority evidence.
- Node-only completion, preflight-only fences, or wave/lease admission as mutation authority.
- Post-admission nogood detection, last-write-wins supersession, or retroactive historical rewriting.
- Executable refusal advice, implicit human approval, or a human decision that directly carries effect authority.
- Applying P1–P7 wholesale to direct transforms, cheap replay, immutable reads, local parse errors, or informational acknowledgements.

## Sources Consulted

- Full lineage config, canonical JSONL state, strategy, and registry.
- `orientation.md` and repo-1 `001-agent-swarms/research/research.md`.
- Iterations 014–019, with emphasis on the P1–P7 integration matrix, P3 exact trace schema, adversarial A1–A7 audit, implementation seams, and rollback/when-not-use matrix.
- Underlying code and 036 contracts were inspected only through conflict-resolving evidence already cited by those iterations; no new source conflict required reopening.

## Assessment

- **newInfoRatio:** 0.46
- **Novelty justification:** the contracts were individually settled, but this terminal audit adds the single conflict-closure ledger, explicitly separates synthesis blockers from promotion blockers, freezes exact P1–P7 verdict language, and produces one dependency-safe implementation sequence.
- **Questions addressed:** P1, P2, P3, P4, P5, P6, P7.
- **Questions answered:** P1, P2, P3, P4, P5, P6, P7.
- **Decision conflicts remaining:** none.
- **Evidence gaps remaining:** implementation and measurement only; all are assigned explicit closing checks above.
- **Convergence:** telemetry only; not the stop authority.
- **Stop reason:** `maxIterationsReached` at run 20.
- **Confidence:** high for authority, replay, fencing, parity, refusal, temporal/nogood, and human-gate boundaries; medium-high for proposed module and wire names until implementation review.

## Reflection

- **What worked:** treating every apparent contradiction as a typed boundary—authority versus projection, semantic time versus replay order, claim identity versus fence, refusal versus command, decision versus effect—removed the remaining cross-contract ambiguity.
- **What failed:** no additional corpus pass can substitute for executable mutants, transactional race tests, shadow traces, or cost/latency measurement.
- **Ruled out:** reopening settled P1–P7 decisions because promotion evidence is not yet available; that would confuse research completeness with rollout readiness.

## Recommended Next Focus

`phase_synthesis`
