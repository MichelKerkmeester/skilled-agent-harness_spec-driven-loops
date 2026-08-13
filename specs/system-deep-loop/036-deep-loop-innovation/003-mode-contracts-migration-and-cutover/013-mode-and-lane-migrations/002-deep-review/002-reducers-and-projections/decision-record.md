---
title: "Decision Record: Shared Review-Loop Backbone and Dark Projection Boundary"
description: "Records the reusable review-loop convergence fold, complete parity structure, and additive-dark authority boundary for Deep Review projections."
trigger_phrases:
  - "deep review shared reducer backbone"
  - "deep review projection boundary"
  - "deep alignment reducer reuse"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-23T19:01:48Z"
    last_updated_by: "codex"
    recent_action: "Replaced opaque stream sorting with causal replay order"
    next_safe_action: "Reuse the backbone from Deep Alignment"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-projection-types.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Coverage and veto semantics live in a mode-neutral pure backbone"
      - "Typed event mappings remain at each mode edge"
      - "Resolution provenance is owned by the target finding"
      - "Resolution starts from the target's projected lifecycle"
      - "Hard-veto roots recognize every legal token separator"
      - "Internal references are scoped to their candidate, finding, or run"
      - "Null adjudication predecessors are valid only for the first adjudication"
      - "Finding IDs are unique per candidate and immutable after first adjudication"
      - "Evidence IDs cannot cross candidates or change across reconciliation"
      - "Every completed terminal re-derives blockers regardless of review verdict"
      - "Completed terminals must cite the most-recent clean convergence evaluation"
      - "Incomplete and blocked terminal lifecycles may retain unresolved state"
      - "Run-level artifact lineages accept only established-stream producers"
      - "Entity artifact lineages follow owner identity across producer streams"
      - "Typed input sequence is the causal order because the envelope has no global position"
      - "Legacy authority remains unchanged"
---
# Decision Record: Shared Review-Loop Backbone and Dark Projection Boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Export the Shared Review-Loop Fold and Keep Authority Outside It

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-23 |
| **Deciders** | Deep Review reducer and projection owners |

---

<!-- ANCHOR:adr-001-context -->
### Context

Deep Review and Deep Alignment both need one answer to the same convergence questions: whether required cells are covered, obligations are resolved, blocking findings remain, hard vetoes apply, and a typed stop decision is eligible. Copying those rules into each mode would create two authorities that could disagree during replay.

Hard-veto classification is also a convergence boundary. The event schema permits `-`, `.`, `_`, `:`, `/`, and `@` inside finding-class tokens. Recognizing only a hyphen after `build`, `regression`, `schema`, or `security` lets another legal spelling bypass the unoverrideable veto.

Reference validation must prove ownership as well as membership. Checking whether an evidence or predecessor ID appears anywhere in the projection lets one candidate or finding spend another subject's valid record. Treating a null adjudication predecessor as permission to skip validation lets a later adjudication overwrite the current one and silently clear an accepted hard veto. Without an actual from-state check, an append-only transition can also claim a lifecycle the projection never held.

Logical identity needs the same treatment. If two candidates can claim one `findingId`, lookup and hard-veto arrays can refer to different owners while artifact auto-supersession links unrelated adjudications. If a re-adjudication can rename its finding, the earlier logical artifact becomes orphaned. Evidence identities have the same candidate-ownership and reconciliation-stability requirements.

Entity artifact revisions follow ledger ownership rather than transport topology. Evidence reconciliation and re-adjudication may validly cite a predecessor from another producer stream while retaining the same `evidenceId` or `findingId`. Baking the producing stream into those logical IDs splits one entity into singleton groups; the later generic grouping pass then erases the explicit predecessor and successor links from the derived artifact index even though the finding ledger remains correct.

A report or continuity save is not an entity-local artifact. It is a run-level singleton used by `run_completed`, and the run's stream identity is established by `run_initialized`. A global report key or packet-only continuity key lets an auxiliary stream with a canonically later position supersede the run's own cited artifact. The completion guard then rejects honest completion because immutable evidence was grouped under the wrong identity. These run-level logical identities therefore retain the run and established-stream boundary.

A stream identifier is an opaque non-empty string, not a causal coordinate. Sorting the multi-stream ledger by `stream_id` can move a legitimate auxiliary event ahead of `run_initialized` solely because its producer chose a lexically earlier label. The closed event envelope carries no global append index; `stream_sequence` orders only one stream. The reducer's typed event sequence is therefore the available causal ledger order.

A convergence event describes the projection state at its own ledger position. Findings and required obligations can arrive afterward, so terminal completion cannot treat cached eligibility or blocker IDs as proof that the current state remains clear. The evaluator's own decision can also be superseded: citing any earlier `converged` event lets that stale judgment override a later `continue` or `blocked` evaluation. The completion event carries two independent enums: `verdict` records the review outcome, while `terminalStatus` drives the run lifecycle and projected status. Gating freshness on `verdict: pass` therefore lets completed terminals with `fail`, `blocked`, or `incomplete` verdicts reuse stale convergence state.

The reducer leaf may add projections only. Seals, receipts, parity execution, rollback, mode gating, and authority cutover belong to later siblings.

### Constraints

- Each mode retains its own landed typed event union and edge mapping.
- The shared fold remains pure, deterministic, immutable, and independent of writers or external state.
- The submitted typed event sequence is causal: `run_initialized` is genesis and every stream advances contiguously in that sequence.
- Hard schema, build, security, and regression vetoes outrank weighted scores.
- Entity artifact groups use their stable owner identity independently of producer stream.
- Review reports and continuity saves are run-level singletons authored only on the initialization-established stream.
- Legacy Deep Review remains authoritative until the staged cutover.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Export `reduceSharedReviewLoopBackbone` as the mode-neutral convergence fold, with Deep Review-specific event adaptation outside that function.

**How it works**: The backbone accepts required and completed dimensions, unresolved obligations, explicit blockers, active P0/P1 findings, hard vetoes, evidence stability, graph state, and the typed stop decision. It returns only eligibility, outcome, and canonical blocker IDs. One current-state derivation supplies those inputs to both convergence evaluation and completed terminal application. Freshness recomputation and the final terminal guard share the same `terminalStatus === 'completed'` predicate, so every completed lifecycle recomputes missing coverage, unresolved required obligations, accepted P0/P1 findings, open hard vetoes, explicit blockers, P0/P1 resolution, finding stability, and graph blocking from the current projection plus the most-recent folded convergence evaluation. The terminal citation must identify that exact latest evaluation, whose own decision must be `converged`, whose stop candidate must be true, and whose explicit blocker list must be empty. The independent `verdict` remains the review outcome and cannot bypass lifecycle invariants. Cached blocker IDs and superseded evaluator judgments are not authoritative. Terminal lifecycles marked `incomplete` or `blocked` do not enter the completed guard and may retain unresolved state. The Deep Review adapter treats every hard-veto finding as open until the typed lifecycle reaches `dismissed` or `fixed`, including candidates that were never adjudicated. Exact veto roots and root-prefixed classes separated by any schema-valid code-token separator block, while non-separated superstrings do not.

Every internal caller-supplied reference is checked at its owning boundary: pass references against iteration and dimension; evidence and supersession against candidate; adjudication and lineage predecessors against finding; completion event references against the same run and typed role. The first adjudication must cite null, while every subsequent adjudication must cite the target finding's current `adjudicationEventId` exactly. A finding-state transition is accepted only when its `adjudicationEventId` equals the target record's own adjudication provenance, its predecessor is owned by that finding, and its `priorState` equals the target's projected lifecycle. Terminal projection validation scopes evidence identity to the finding's candidate, matching the completion reducer guard. Replay gap detection derives each stream's baseline from that stream's checkpointed `seenEvents`, never from the single global source tail. Deep Review supplies `mode: review` and its typed mapping; Deep Alignment can supply `mode: alignment` without copying the invariant.

Canonical replay preserves input order. Producer-relative collections and status provenance derive temporal order from the captured `seenEvents` sequence, never from `stream_id`. Per-stream sequence validation scans the same causal order and rejects a gap, regression, or non-genesis first event before projection application. Exact repeated events remain idempotent. The ordering policy version is `causal-input-order@1`, which forces stale lexical-order checkpoints to rebuild rather than silently retain the old contract.

Finding identity is a one-to-one candidate mapping. A first adjudication may replace the internal `candidate:<candidateId>` placeholder with its public `findingId`; later adjudications must retain that ID, and no other candidate may claim it. Evidence revisions may repeat one `evidenceId` only for the same candidate, and reconciliation must retain the predecessor's evidence ID. Projection validation repeats both cross-record invariants so corrupt checkpoint state cannot bypass the event-time guards.

Logical artifact identity is `<kind>:sha256(canonical(identity-key))`, selected by artifact kind:

| Artifact kind | Logical identity key |
|---|---|
| Raw finding | `candidateId` |
| Evidence / verification output | `evidenceId` |
| Adjudication | `findingId` |
| Review report | `runId` + `sessionId` + initialization-established `streamId` |
| Continuity save | `runId` + `sessionId` + initialization-established `streamId` + `targetPacket` |

Evidence reconciliation and re-adjudication derive bidirectional artifact links from their explicit predecessor event IDs. Generic temporal grouping is reserved for report and continuity lineages, so it cannot clobber explicit entity links. Report and continuity events from any stream other than the initialization-established stream remain captured ledger events but produce no run-level artifact record. This matches the completion and convergence model: entity truth follows stable ownership, while only the established stream can advance run-level state.

The reducer exports a complete shadow-only legacy view and parity fingerprint, but it performs no dual write, authority decision, seal, rollback, or cutover.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared pure backbone with typed mode edges** | One convergence authority, deterministic reuse, narrow mode adapters | Deep Alignment must map its events into the shared input | 10/10 |
| Copy reducer logic into each mode | Local files appear self-contained | Coverage and veto semantics can drift silently | 2/10 |
| Put Deep Review event types into the shared function | Less adapter code for this mode | Couples Deep Alignment to the wrong event union | 3/10 |
| Add parity and authority switching now | Earlier end-to-end path | Breaks sibling ownership and additive-dark rollout | 1/10 |

**Why this one**: The chosen boundary keeps shared semantics reusable while preserving each mode's typed ledger authority and the staged migration plan.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Deep Review and Deep Alignment can share one coverage and convergence invariant.
- A weighted score cannot override unresolved P0/P1 findings or hard vetoes.
- A completed terminal cannot reuse an earlier clean convergence state after new blocking evidence or obligations arrive, regardless of verdict.
- A completed terminal cannot cite a superseded clean evaluation after a later continue, blocked, or reset evaluation.
- Incomplete and blocked terminal lifecycles remain able to represent unresolved review state without a false completion rejection.
- Legal separator spelling cannot bypass a hard-veto root, and non-separated superstrings remain ordinary classes.
- One candidate cannot cite another candidate's valid pass, evidence, or evidence-supersession producer.
- One finding cannot clear another finding's veto by borrowing a valid adjudication ID.
- A re-adjudication cannot clear its own accepted veto by omitting the current adjudication predecessor.
- One finding cannot borrow another finding's adjudication, lineage, or state predecessor.
- Two candidates cannot share one finding or evidence identity.
- Re-adjudication and evidence reconciliation cannot rename their logical identity.
- Cross-stream evidence reconciliation and re-adjudication retain the same owner group and bidirectional lineage.
- Artifact auto-supersession cannot join unrelated candidate histories through a collided finding ID.
- Auxiliary-stream report or continuity events cannot demote the run's own cited artifact.
- Honest completion remains valid when its cited artifact is the latest established-stream revision.
- Genuine later established-stream revisions still supersede earlier revisions.
- Separate runs never export the same run-level report or continuity group for an equal packet key.
- Lifecycle transitions cannot skip append-only state validation by claiming a false prior state.
- New, shorter, and interleaved streams cannot borrow the global tail to conceal or invent sequence continuity.
- Lexically earlier auxiliary streams cannot be replayed before causal genesis or provenance predecessors.
- Shadow parity compares the full canonical structure instead of a scalar subset.

**What it costs**:
- Deep Alignment needs a small typed adapter. Mitigation: use the exported input, result, and configuration types without widening them.
- Deep Alignment mode 008 has no reducer yet; reuse is structurally ready, and end-to-end cross-verification waits for that reducer.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A mode adapter omits a required blocker | H | Keep typed event routing exhaustive and cover the adapter with shared-backbone fixtures |
| Terminal completion trusts stale convergence state | H | FULLY MITIGATED: completed terminals combine freshly derived substate with the most-recent evaluator judgment, require the citation to name that evaluation, and require its decision to be cleanly converged; incomplete and blocked lifecycle controls remain permissive |
| A legal finding-class spelling bypasses a hard veto | H | Match every schema-valid separator after an exact veto root and prove non-separated negatives |
| A candidate spends another candidate's evidence | H | Filter evidence membership by candidate before adjudication and terminal completion |
| Two candidates claim one finding or evidence ID | H | Reject the event-time collision and repeat the one-owner invariant during projection validation |
| A revision renames its finding or evidence ID | H | Require the predecessor's logical identity on every re-adjudication or evidence reconciliation |
| Opaque stream labels reorder valid cross-stream history | H | FULLY MITIGATED: preserve typed input order, derive producer chronology from captured causal positions, and fail closed on per-stream gaps or pre-genesis events |
| An auxiliary artifact supersedes run-level evidence | H | Project report and continuity artifacts only on the initialization-established stream and include stream identity in the logical scope |
| Equal entity keys appear in separate run projections | L | Artifact indexes are run-scoped and mixed-run folds reject before artifact derivation; only run-level identities require exported run scoping |
| A resolution cites another finding's valid adjudication | H | Compare the cited event ID with the target finding record's own adjudication provenance |
| A re-adjudication omits its current predecessor | H | Require exact equality with the target's current adjudication; allow null only when no prior adjudication exists |
| A lineage or state change cites another finding's predecessor | H | Resolve predecessor references only through provenance owned by the target finding |
| A resolution claims a stale or fabricated from-state | H | Require `priorState` to equal the lifecycle in the projection before applying the transition |
| A downstream caller treats the legacy view as authoritative | H | Freeze the view and mark both authority fields explicitly |
| Later sealing work mutates artifact history | H | Keep this leaf's artifact records referential and immutable |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both modes are named consumers of the phase-012 review-loop contract |
| 2 | **Beyond Local Maxima?** | PASS | The design isolates shared algebra instead of optimizing only Deep Review |
| 3 | **Sufficient?** | PASS | One input, one result, and typed mode adapters cover the required boundary |
| 4 | **Fits Goal?** | PASS | Reducers and projections are the exact leaf scope |
| 5 | **Open Horizons?** | PASS | Later modes can reuse the backbone without changing ledger schemas |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `deep-review-projection-types.ts` exports the mode configuration and shared-backbone input/result types.
- `deep-review-reducer.ts` exports and consumes the pure shared backbone, preserves causal input order, derives stream-local replay baselines, recognizes hard-veto roots across every legal separator, keeps every nonterminal hard veto blocking, and validates candidate/finding ownership plus actual prior lifecycle.
- `projectDeepReviewLegacyView` covers the complete canonical parity structure.
- The 90-test unit suite proves earlier- and later-sorting cross-stream evidence and re-adjudication lineage, full-genesis replay with an earlier auxiliary stream, deterministic repeated causal replay, fail-closed invalid reordering, pre-genesis rejection, same-stream lineage retention, unrelated-entity isolation, established-stream report and continuity scoping, new-stream failure, valid interleaving, stream-label-swap failure, separator-robust hard-veto blocking, non-separated negatives, borrowed-reference rejection, finding/evidence identity collision and rename rejection, stable-identity controls, honest completion after auxiliary injection, established-stream report supersession, cross-run report separation, null/wrong/correct/first adjudication chaining controls, candidate-scoped terminal evidence, wrong-`priorState` rejection, own-adjudication unblocking, late P1 and obligation rejection for every completed verdict, stale convergence citation rejection, latest-continue rejection, blocked/reset/original-citation rejection, clean latest-convergence acceptance, incomplete and blocked lifecycle acceptance with a latest continue decision, and verified-event surface parity.
- No legacy writer, authority, gate, seal, receipt, or rollback code changes.

**How to roll back**: Revert the new reducer module, its unit suite, and this leaf's documentation together. The runtime path is dark, so rollback requires no ledger rewrite or authority migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
