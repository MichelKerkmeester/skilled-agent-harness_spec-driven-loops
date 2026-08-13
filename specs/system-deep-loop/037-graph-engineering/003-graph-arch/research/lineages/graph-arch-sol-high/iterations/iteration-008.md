# Iteration 8: Ledger-First Graph Observability and OTel Projection

## Focus

This iteration specifies `GraphExecutionEventV1` and `GraphExecutionProjectionV1`: graph lifecycle facts are typed events in the 036 ledger, replay is a deterministic fold over reference-closed ledger cuts, and OpenTelemetry is an idempotently managed but non-authoritative export. It classifies GraphARC's trace, policy audit, session database, checkpoints, cost, replay, and spans; defines gap, corruption, redaction, and disagreement behavior; and maps causal-prefix comparison into the existing shadow-parity runtime.

## Findings

1. **GraphARC has several locally useful records but no single reference-closed source of truth — CONFIRM Decision 4 and CONTRADICT the trace module's audit-trail claim.** Trace JSONL captures observed node/sub-step activity and drives replay, cost, metrics, and OTel, but truncates values, omits reducer identity, infers parentage, and is disconnected from policy JSONL and session SQLite. Policy audit can be absent on compiled paths; session rows and checkpoints separately describe inputs, status, and state. The system contract therefore makes verified 036 domain, authorization-audit, refusal-evidence, budget, and effect records canonical for their own facts and joins them only through explicit references and closed cuts. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:19-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/engine.py:10-29] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/store.py:1-21]

2. **`GraphExecutionEventV1` is a registered 036 domain-event family, not a second graph-local log or telemetry envelope — EXTEND Decisions 1 and 4.** It records durable run, task/attempt, node, route, state-commit, gate/refusal, budget, and effect-reference facts using sealed graph/topology/reducer identities plus explicit correlation, causation, and parent-event references. Sequence/hash/authority remain properties of the existing event envelope and append receipt. Durations, token chunks, host/PID, span IDs, and rendered state are observations or projections and do not decide replay order or authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99-145] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:215-235]

3. **Deterministic replay requires reference-closed multi-ledger cuts and exact reducer identity — CONFIRM Graphene P2 and REFINE GraphARC replay.** Domain and authorization ledgers have independent sequences; a valid cut includes every authorization reference required by its domain range and classifies applied allows, unapplied allows, and denials. Replay verifies hash chains, schemas, upcasters, canonicalizers, graph/topology/reducer versions, causal references, and sealed payload/artifact digests before folding domain events in ledger sequence. Unknown versions, open references, corruption, nondeterminism, or checkpoint drift make the projection unavailable; they never yield GraphARC's last-write-wins approximation as trusted state. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99-145] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:199-223] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:83-85]

4. **OTel export is a redacted projection with stable identities and recovery receipts, never execution evidence — REFINE Decision 6 and CONFIRM Decision 4.** Span trace/parent IDs derive from canonical run/event/causation identities; attributes carry ledger sequences, cut digest, graph/reducer versions, and bounded redacted observations. Export batches are keyed by projection cut, exporter contract, sink, and redaction policy. Exact retries return a stored export receipt; a crash after send but before receipt becomes `export_unknown` and is queried or reconciled rather than blindly resent. Provider duplicates, lag, sampling, outage, or missing SDK never change ledger state or runtime outcome. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/otel.py:1-33] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/otel.py:148-265] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/otel.py:280-318]

5. **Disagreement is durable evidence with asymmetric failure semantics — EXTEND Decision 6 and Graphene P3.** If trace, cost, session, checkpoint, or OTel disagrees with a verified closed ledger projection, quarantine and rebuild the projection, preserve both digests, and emit the earliest discrepancy; never rewrite the ledger. If canonical ledgers themselves fail reference closure or hash/schema verification, the graph projection is unavailable and the incident blocks dependent reads/promotion. Under pre-cutover shadow authority, legacy remains selected and disagreement cannot mutate authority; after cutover, a legacy-only action absent from the selected ledger is a critical missing-event divergence rather than evidence that legacy should silently win. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147-208] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:186-247] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:105-114]

6. **Shadow parity must compare causal prefixes and closed observation classes, not only final projection digests — EXTEND Decision 6 and Graphene P3.** The current runtime already freezes required observations, sealed inputs, projection bytes/reader results, effect suppression, earliest divergence ownership, and authority-mutation false. Add per-operation prefix rows joining request, decision/refusal, accepted event range, before/after cuts, budget/effect state, artifacts, and checkpoint digest. Terminal equality cannot erase an earlier missing authorization, reordered route, temporary effect, or zero-mutation violation; normalization may remove only manifest-declared transport noise. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:26-64] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:104-159] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:179-247] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:147-224]

7. **Observability mutants must target inference, duplication, omission, and false completeness — CONFIRM Decision 8 and EXTEND its governance corpus.** Required mutants include reordered file lines, torn/corrupt records, truncated state, absent reducer/upcaster, inferred fan-out parent, orphan sub-step, duplicate model/node cost, failed-node spend omission, missing policy/session linkage, open audit/domain cut, same final state after different causal prefix, redaction leak, replay/export retry duplication, and a checkpoint or OTel span that disagrees with the ledger. Each must fail at its earliest owner while canonical history remains unchanged and effects stay suppressed in shadow. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:25-58] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:226-286] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/cost.py:18-33] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:210-224]

## Source-of-Truth Matrix

| Surface | Facts it contains | Classification | System-deep-loop disposition |
|---|---|---|---|
| 036 domain ledger | Authorized graph lifecycle/state transitions and their ordered effective event bytes | **Canonical per domain stream** | Sole source for graph-state fold; never compacted because a projection matches. |
| 036 authorization audit ledger | Allow/deny decision, exact request/policy/identity/head/epoch, allow-to-domain linkage | **Canonical authorization evidence** | Independent sequence; selected cut must close every domain authorization reference. |
| Refusal evidence stream | Compile/admission authority-zero refusal, observed dependencies, causation | **Canonical refusal evidence, non-authoritative** | May advance without domain progress; cannot satisfy command unions. |
| Budget ledger and effect intent/receipt records | Reservations/debits/releases and external-effect recovery state | **Canonical for their owned lifecycle** | Referenced from graph events; graph telemetry never recalculates authoritative spend/effect success. |
| GraphARC trace JSONL | Node/sub-step observations, deltas, durations, tokens, errors, appended file order | **Duplicated/incomplete observation** | Compatibility projection only; rebuild from ledger plus adapter observations where possible. |
| GraphARC policy audit JSONL | Policy calls that actually traverse `PolicyEngine` | **Disconnected partial audit** | Map to the 036 authorization audit; compiled adapter gaps are divergences. |
| Session SQLite rows/events/transitions | Local session status, queued input, consume markers, holds, status history | **Local coordination and projection** | Input commands must become authorized events; session views rebuild from ledger. Pre-cutover authority is explicitly versioned. |
| LangGraph checkpoint | Folded graph state and pending work | **Disposable cache** | Accept only against exact cut/reducer/topology/checksum/fingerprint; delete and rebuild on mismatch. |
| `observe.replay` | Trace reconstruction and caller-supplied state fold | **Derived and partly inferred** | Replaced for trusted reads by exact ledger replay; retained for compatibility diagnostics. |
| `observe.cost` | Recorded cost, estimates, unpriced tokens, error-spend caveats | **Derived report** | Never budget authority; label completeness and evidence references. |
| OTel spans | Exported timing/status/attribute view with inferred/derived parentage and duration | **Derived telemetry** | Rebuildable, sampleable, redactable, lag-tolerant, and non-authoritative. |

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/audit.py:41-88] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/events.py:1-45] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:31-65]

## Event and Projection Schemas

```ts
interface GraphExecutionEventV1 {
  graph_event_version: 'graph-execution-event@1';
  graph_event_type:
    | 'run.opened' | 'run.closed'
    | 'task.ready' | 'task.claimed'
    | 'node.attempt.started' | 'node.attempt.completed' | 'node.attempt.failed'
    | 'route.selected' | 'state.commit.recorded'
    | 'gate.bound' | 'refusal.observed'
    | 'budget.bound' | 'effect.bound';
  event_id: string;
  operation_id: string;
  run_id: string;
  session_id: string | null;
  thread_id: string;
  graph: {
    sealed_graph_id: string;
    sealed_graph_digest: string;
    topology_digest: string;
    reducer_id: string;
    reducer_version: string;
    reducer_digest: string;
  };
  execution: {
    boundary_id: string;
    task_id: string | null;
    node_id: string | null;
    edge_id: string | null;
    attempt: number;
    outcome: 'pending' | 'applied' | 'failed' | 'refused' | 'cancelled';
  };
  causality: {
    correlation_id: string;
    causation_event_id: string | null;
    parent_event_id: string | null;
    predecessor_event_ids: readonly string[];
  };
  references: {
    authorization_decision_ref: string | null;
    admission_proof_digest: string | null;
    gate_receipt_ref: string | null;
    refusal_ref: string | null;
    budget_ref: string | null;
    effect_intent_ref: string | null;
    effect_receipt_ref: string | null;
    state_delta_artifact_ref: string | null;
  };
  payload_schema: string;
  payload_digest: string;
  payload: Record<string, unknown>;
  occurred_at: string;
}

interface GraphExecutionProjectionV1 {
  projection_version: 'graph-execution-projection@1';
  projection_id: string;
  authority_state: string;
  cut: {
    domain_head: LedgerHead;
    authorization_audit_head: LedgerHead;
    refusal_head: LedgerHead | null;
    budget_head: LedgerHead | null;
    effect_head: LedgerHead | null;
    reference_closure_digest: string;
    applied_allow_refs: readonly string[];
    unapplied_allow_refs: readonly string[];
    denial_refs: readonly string[];
  };
  contracts: {
    event_registry_digest: string;
    upcaster_registry_digest: string;
    reducer_id: string;
    reducer_version: string;
    reducer_digest: string;
    canonicalizer_version: string;
    redaction_policy_digest: string;
  };
  run_ids: readonly string[];
  causal_prefix_digest: string;
  canonical_state_digest: string;
  checkpoint_digest: string | null;
  completeness: {
    canonical_closed: boolean;
    missing_optional_observations: readonly string[];
    open_discrepancy_ids: readonly string[];
  };
  projection_digest: string;
  built_at: string;
}
```

The existing versioned event envelope owns stream, sequence, previous hash, authority epoch, canonical bytes, and append receipt; `GraphExecutionEventV1` does not duplicate or override them. `occurred_at` and `built_at` are query metadata only. Large/sensitive state deltas are sealed artifact references; payloads contain bounded governance facts, never raw prompts, secrets, or unrestricted model output. [INFERENCE: schema specializes Graphene P2/P3 for graph execution while preserving the existing 036 envelope owner]

## Replay and Export Algorithm

1. Resolve the requested `GraphExecutionProjectionV1` cut. Verify every ledger head, frame hash chain, canonical event hash, event registry, and supported event/upcaster version.
2. Prove reference closure: every domain graph event's allow exists inside the authorization cut; every gate, refusal, budget, effect, artifact, and causation reference exists in its selected stream/store. Equal sequence numbers across ledgers have no meaning.
3. Reject audit recursion, missing references, duplicate conflicting IDs, non-contiguous accepted ranges, unknown schemas, and incompatible authority epochs. Classify authorization audit entries as applied allow, unapplied allow, or deny.
4. Resolve the exact sealed graph, topology, reducer, upcaster, and canonicalizer identities. If a supplied checkpoint matches the cut, checksum, fingerprint, and repeat-reduction digest, use it; otherwise discard it and replay from the last verified checkpoint or genesis.
5. Fold domain events strictly by domain ledger sequence. Use explicit causation/predecessor references to build a causal DAG. Do not sort by timestamp, GraphARC step, filename, or a cross-ledger synthetic sequence.
6. Verify a final no-write repeat fold and compute state, prefix, closure, checkpoint, and projection digests. Publish atomically only when the canonical cut is closed.
7. Apply the versioned redaction policy to an immutable projection view. Missing redaction rules for classified data fail export, not canonical replay. Record original-field digests and redacted-result digests without exposing the original values.
8. Derive OTel trace IDs from run identity and span IDs from canonical event identity; parent by explicit causation/parent reference. A stable topological order emits parents first while representing disjoint events as concurrent, not falsely serial.
9. Compute `export_key = digest(sink_id, projection_digest, exporter_version, redaction_policy_digest, batch_digest)`. A prior verified receipt returns success; conflicting bytes under the same key fail.
10. Send the batch and durably record `TelemetryExportReceiptV1`. On definite failure leave the cursor unchanged and retry. On send/receipt ambiguity mark `export_unknown`; query/reconcile if supported, otherwise require operator policy before resend. Export state cannot affect ledger or projection authority.

[SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:105-145] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:9-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/otel.py:148-265]

## Ordering, Correlation, and Redaction

- Per-ledger `sequence` is authoritative only within its ledger. Cross-ledger ordering is a partial order expressed by references; presentation order is deterministic but not evidence of wall-clock interleaving.
- `operation_id` joins request, authorization/refusal, accepted domain range, budget/effect lifecycle, and export. `correlation_id` joins a wider user/run objective; `causation_event_id`, `parent_event_id`, and predecessor IDs encode actual graph ancestry.
- A task instance, not merely a node name, is the unit of execution identity; fan-out siblings cannot share a span/event identity.
- Timestamps, durations, and provider measurements retain source and precision. Derived end times are labeled derived; missing measurements remain null/incomplete, never zero.
- Redaction is field-classification based and versioned. Raw state, prompts, secrets, credentials, unbounded errors, tool arguments, and provider payloads stay in governed sealed storage or are omitted. Spans carry digests/references and bounded safe summaries.
- Sampling is allowed only after canonical projection and cannot remove required shadow-parity observations or alter export receipt truth.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:195-220] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:226-286] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/otel.py:15-27]

## Audit Disagreement Failure Semantics

| Disagreement | Result |
|---|---|
| Domain event references allow beyond/missing from audit cut | Projection unavailable; `open-reference` incident; no checkpoint/export publication. |
| Stored authorization decision re-evaluates differently under its historical policy | Preserve history; emit `authorization-replay-divergence`; block parity/promotion and investigate policy/evaluator drift. |
| Checkpoint digest/state differs from exact replay | Quarantine/delete checkpoint and rebuild; ledger unchanged. |
| GraphARC trace/session/policy JSONL says work occurred but selected ledger has no event | `legacy-only-observation` divergence. In shadow, legacy remains selected; post-cutover, incident and no silent backfill. |
| Ledger says work occurred but trace/OTel lacks it | Projection/export gap; rebuild/re-export. Runtime success remains ledger-derived. |
| Cost report differs from budget/effect receipts | Cost projection is wrong/incomplete; authoritative budget/effect records win and discrepancy remains visible. |
| OTel sink rejects, drops, duplicates, samples, or is unavailable | Export health failure only; no graph rollback or authority change. |
| Canonical ledger hash/schema corruption | Stop trusted replay at last verified head, make dependent projection unavailable, preserve bytes, and enter storage incident workflow. |

No resolver chooses the record with the newest timestamp. No repair rewrites committed history. Reconciliation creates new evidence/projection records linked to the disagreement. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:83-85] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:109-114]

## Shadow-Parity Mapping

| Existing observation/class | Ledger-first input | Extension |
|---|---|---|
| `ordered-transitions` | Effective `GraphExecutionEventV1` range and causal prefix | Compare each operation prefix, not only the terminal event digest. |
| `terminal-status`, `return-value`, `error-halt` | Exact reducer result at a closed cut | Bind reducer/upcaster/canonicalizer and checkpoint digests. |
| `effect-receipts` | Effect intent/receipt references and suppressed shadow receipts | Any live dark effect is an immediate effect-owner divergence. |
| `budgets` | Reservation/debit/release head and delta digest | Never infer authoritative spend from trace cost. |
| `emitted-artifacts`, `reader-results` | Projection bytes, reader result, watermark/integrity digest | Include redaction and projection contract identities. |
| `projection-semantic` | `GraphExecutionProjectionV1.projection_digest` | Report earliest prefix/component/sequence, not just final mismatch. |
| `missing-observation` | Required reference or manifest observation absent | Fail closed; do not normalize absence. |
| `legacy-byte` | Compatibility trace/session/JSONL bytes | Byte parity is separate from semantic/authority parity. |

Normalization may scrub sandbox roots, transport IDs, record timestamps, token chunks, and presentation prose only when the manifest declares them non-semantic and reversible. Actor, capability, policy, authority epoch, claim/fence, semantic deadline, causation, refusal, budget, effect, task identity, and checkpoint identity are never normalized away. Every pass retains `authorityState='legacy_authoritative'` and `authorityMutation=false` until the separate promotion workflow changes authority. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:259-289] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:153-208]

## Mutants

1. Sort trace events by `step` or timestamp and change a nested node/sub-step order.
2. Remove, duplicate, reorder, truncate, or corrupt a ledger/trace line; skip it and still publish a complete projection.
3. Replay a reduced field without its exact reducer, or change reducer code without version/digest change.
4. Parent an ambiguous fan-out sub-step to an arbitrary open node; reuse a node-level span ID across task instances.
5. Count a model sub-event and its enclosing node total twice, or report missing failed-node spend as zero/complete.
6. Accept a domain event whose authorization reference is outside the audit cut, or assume equal audit/domain sequences align.
7. Let policy audit, session SQLite, checkpoint, trace, or OTel override a verified ledger event because its timestamp is newer.
8. Reach the same final state through a different authorization/refusal/effect prefix and declare parity.
9. Normalize away actor, authority epoch, policy, fence, refusal, budget, effect, or causation differences.
10. Export raw prompt/state/tool arguments or use an old redaction policy under the same projection/export identity.
11. Retry an ambiguous OTel send automatically and claim exactly-once delivery without provider reconciliation.
12. Allow missing SDK, exporter failure, sampling, or telemetry lag to fail/roll back the graph transition.
13. Trust a checkpoint whose cut/checksum matches but whose reducer/topology/fingerprint identity drifted.
14. Observe a live dark effect or selected-ledger write during shadow parity and still issue a pass certificate.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:9-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/cost.py:18-33] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:186-247]

## Runtime Integration

- Register graph lifecycle payloads in the existing event registry and authorized-ledger append path; do not create a graph-local authoritative store.
- Add `runtime/lib/graph-projection/` for reducer registry, cut closure, checkpoint validation, replay, discrepancy records, and atomic publication; put shared cut logic beside `authorized-ledger` as Graphene P2 specifies.
- Add `runtime/lib/graph-observability/` for redacted projection-to-trace/span mapping, stable IDs, exporter state, and `TelemetryExportReceiptV1`; this package has read-only ledger access and no transition/effect capability.
- Treat GraphARC trace, policy audit, session DB, checkpoint, cost, replay, and OTel as compatibility readers/exporters during shadow. Capture their bytes and reader results in `ParityProjectionObservation`.
- Extend `shadow-parity` with operation-prefix comparison and the new mutants while preserving isolated roots, sealed inputs, suppressed effects, earliest divergence, and zero authority mutation.
- Link authorization, refusal, gate, budget, and effect records by canonical references in `GraphExecutionEventV1`; do not copy their verdict or lifecycle fields into a competing authority record.

## When Not to Use

- Do not build a full ledger-to-OTel pipeline for a local deterministic unit, short single-process script, or read-only transform whose direct test oracle is stronger and no governed graph history is required.
- Do not require causal-prefix parity for presentation-only rendering, token streaming, transport throughput, or telemetry dashboards that cannot influence authority; use bounded projection checks.
- Do not export OTel when sensitive-data policy, offline operation, or sink guarantees make export inappropriate. Canonical ledger/replay continues without it.
- Do not put raw state, prompts, secrets, tool arguments, or full model responses into span attributes merely because the trace format permits arbitrary dictionaries.
- Do not use OTel, trace JSONL, session SQLite, checkpoints, cost reports, or projection watermarks to authorize, resume, debit, release a gate, or prove an effect.
- Do not sample or compact canonical domain/authorization/effect/refusal history. Sampling and retention apply only to rebuildable projections and telemetry.
- Do not force one global total order across independent ledgers or genuinely concurrent disjoint tasks; preserve per-ledger order plus explicit causal partial order.

## Ruled Out

- Treating GraphARC trace JSONL or OTel spans as canonical evidence.
- A graph-local authoritative ledger parallel to 036.
- Timestamp, step, or filename sorting as replay order.
- Checkpoint acceptance without cut/reducer/topology/fingerprint verification.
- Last-write-wins replay for fields whose reducers are unknown.
- Whole-trace sorting or terminal-state equality as shadow parity.
- OTel export failure affecting graph authority or success.
- Blind resend after an ambiguous telemetry export.

## Dead Ends

None promoted. GraphARC's observe modules remain useful compatibility projections once their inference and completeness limits are explicit.

## Edge Cases

- Ambiguous input: “authoritative `GraphExecutionEventV1`/projection contract” could imply a new graph-local ledger. Resolved by making the event a registered payload family inside the existing 036 ledger and the projection a rebuildable multi-ledger fold. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:143-145]
- Contradictory evidence: GraphARC calls trace JSONL both replay points and audit trail, while its own replay documents truncation, missing reducer identity, and inferred parentage. Resolved by preserving trace as compatibility observation and moving trusted replay to closed 036 ledger cuts. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:19-35]
- Missing dependencies: none.
- Partial success: none; matrix, schemas, replay/export algorithm, disagreement semantics, shadow mapping, mutants, runtime integration, and non-applicability are decided at design level.

## Sources Consulted

- `context/graph-arch/grapharc/observe/{trace.py,replay.py,otel.py,cost.py}` and observe tests
- `context/graph-arch/grapharc/policy/audit.py`
- `context/graph-arch/grapharc/session/{events.py,store.py,runtime.py}` and session tests
- `context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md`
- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/`
- `036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/{spec.md,plan.md}`
- `002-graphene-main/research/research.md` P2/P3
- Lineage iterations 1–7 and reducer-owned state.

## Assessment

- New information ratio: 0.86 (5 fully new matrix/schema/replay/export/disagreement decisions and 2 partially new parity/mutant refinements: `(5 + 0.5 × 2) / 7 = 0.857`, rounded).
- Questions addressed: Which authoritative event/projection contract preserves graph evidence while making replay, cost, trace, and OTel rebuildable and non-authoritative?
- Questions answered: Source-of-truth ownership, event/projection schemas, replay/export algorithm, ordering/correlation/redaction, disagreement failure semantics, shadow-parity mapping, mutants, runtime integration, and when-not-to-use boundaries are decided at design level.
- Questions remaining: Budget lifecycle, dedicated runtime-package mapping, promotion mutants, and cross-blog synthesis remain open.

## Reflection

- What worked and why: Tracing every reader backward to its producer exposed duplication and inference directly; mapping each fact to one ledger owner then made replay and export failure semantics mechanical.
- What did not work and why: A broad blog scan was noisy because generic “audit” and “trace” language appeared in unrelated examples; the targeted observability passage plus P2/P3 supplied the load-bearing boundary.
- What I would do differently: Fix this projection contract as the evidence substrate and trace one reservation through estimate, authorize, reserve, debit, effect receipt, release/refund, replay, and cost projection.

## Recommended Next Focus

Specify the durable graph budget lifecycle: hierarchical allocation, estimate versus reservation, authorization binding, atomic debit/release/refund, nested graph and retry identities, provider receipts, crash recovery, and reconciliation with ledger-derived cost projections.
