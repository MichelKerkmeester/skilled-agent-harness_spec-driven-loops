---
title: "Implementation Summary: Deep Review Reducers and Projections"
description: "The additive-dark Deep Review ledger now folds into deterministic iteration, artifact, finding, and status projections while the legacy path remains authoritative."
trigger_phrases:
  - "deep review reducer implementation"
  - "deep review projection contract"
  - "deep review deterministic replay"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-23T19:01:48Z"
    last_updated_by: "codex"
    recent_action: "Replaced opaque stream sorting with causal replay order"
    next_safe_action: "Consume the closed projection contract downstream"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-reducers-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The landed Deep Review event union is the only reducer input"
      - "Each stream resumes from its own checkpointed sequence"
      - "Open hard vetoes block until a typed terminal resolution"
      - "Finding resolution requires the target finding's own adjudication"
      - "Finding transitions must name the actual projected prior lifecycle"
      - "Every legal token separator preserves hard-veto classification"
      - "A finding identity maps to one candidate and cannot be renamed after first adjudication"
      - "An evidence identity maps to one candidate and remains stable across reconciliation"
      - "Every completed terminal re-derives blockers for all four verdict values"
      - "Completed terminals cite the most-recent clean convergence evaluation"
      - "Incomplete and blocked terminal lifecycles may retain unresolved review state"
      - "Run-level artifact lineages project only from the initialization-established stream"
      - "Entity artifact lineage follows owner across streams"
      - "Typed input sequence is causal because the closed envelope has no global position"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-reducers-and-projections |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy Deep Review remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Review typed events now replay into deterministic, recursively frozen projections without consulting a clock, filesystem, network, logger, random source, or mutable singleton. The public module mirrors the landed Deep Research reducer surface, but its projection families follow the Deep Review contract: iteration and convergence state, an immutable artifact index, per-mode status, and factored finding evidence with derived P0/P1/P2 presentation.

### Pure fold and replay integrity

`foldDeepReviewEvents` validates every input through the landed `deep-review-ledger-schema` registry, preserves the typed input sequence as causal ledger order, detects sequence gaps, applies exact duplicates idempotently, and returns either a complete projection or an explicit `rebuild_required` result. The closed event envelope has no global append position: `stream_id` is opaque and `stream_sequence` is local to one stream. Producer-relative collections, latest-event selection, status provenance, replay position, and checkpoint tails therefore follow captured input order under `causal-input-order@1`; they never infer chronology from the stream label.

Gap detection scans that same causal sequence, resumes each stream from its highest checkpointed `seenEvents` sequence, and defaults never-seen streams to zero, so their first accepted event must be position one. Interleaved streams advance independently, swapping a continuation onto a shorter stream fails closed, and any otherwise valid event submitted before `run_initialized` is rejected as pre-genesis. Projection identity binds schema, reducer, codec, ordering policy, and canonical state. Checkpoint identity additionally binds the causal applied-event position and tail event digest, so a forged cursor cannot hide a dropped-event gap.

Projection assertions use closed field sets and semantic-kind validation for identifiers, versions, references, selectors, ratios, integers, enums, and digests. Every output is cloned through canonical JSON and recursively frozen.

### Projection families

The iteration and convergence projection retains scope, ordered dimensions, pass outcomes, required coverage cells, review-depth and protocol obligations, convergence evaluations, terminal decisions, blockers, and the last applied sequence. `reduceSharedReviewLoopBackbone` is the reusable mode-neutral fold for required coverage, obligations, active P0/P1 findings, hard vetoes, graph state, and stop eligibility. Deep Review supplies typed event mappings and `mode: review`; Deep Alignment can supply its own mappings and `mode: alignment` without copying the backbone.

Convergence evaluation and completed terminal application now call the same current-state derivation before the shared backbone. Completion freshness and the final terminal guard share one `terminalStatus === 'completed'` predicate, independent of the review outcome in `verdict`. The guard freshly recomputes missing required coverage, unresolved required obligations, accepted P0/P1 findings, and open hard vetoes, while sourcing explicit convergence blockers, P0/P1 resolution state, finding stability, graph decision, stop candidacy, and evaluator decision from the most-recent folded convergence evaluation. A completed terminal must cite that exact latest event, and the evaluator itself must say `converged`, nominate a stop candidate, and carry no explicit blockers. It therefore uses both fresh derived substate and the latest evaluator judgment; neither cached `reviewLoop.blockerIds` nor a superseded clean evaluation is authoritative. A protocol or review-depth obligation recorded after convergence stays unresolved, a late accepted P1 or hard veto fails completion for every verdict, and a converged evaluation followed by `continue` or `blocked` cannot be resurrected through an old citation. Terminal lifecycles marked `incomplete` or `blocked` do not claim completion, so they may legitimately cite the latest open convergence state and retain unresolved findings or obligations.

The finding projection keeps impact, confidence, reachability, exploitability, evidence type, evidence strength, evidence scope, lifecycle, semantic fingerprint, and adjudication separately from presentation severity. Hard schema, build, security, and regression classes remain vetoes even when weighted convergence signals are perfect. Exact veto roots and root-prefixed classes separated by any legal code-token separator (`-`, `.`, `_`, `:`, `/`, or `@`) block; non-separated superstrings do not. A hard-veto candidate blocks from emission through candidate, adjudicated, and accepted lifecycles; only the schema's explicit terminal resolved states, `dismissed` or `fixed`, remove it.

Caller-supplied ledger references are validated against ownership, not global membership. A state change must cite the target finding record's own `adjudicationEventId`, its `predecessorEventRef` must resolve within that finding's provenance, and its `priorState` must equal the lifecycle currently projected for that finding. Candidate and adjudication records cite pass and evidence producers scoped to the same iteration, dimension, candidate, or finding as applicable. The first adjudication must carry a null predecessor because no adjudication exists yet; every later adjudication must cite the finding's current `adjudicationEventId` exactly. Null and stale or foreign non-null values fail closed, so a re-adjudication cannot dismiss an accepted veto without chaining through its current provenance. Terminal projections independently recheck every finding evidence reference against evidence owned by that candidate rather than accepting a ledger-global evidence identity.

The chaining sweep covered every reducer event that advances evidence, finding lineage, adjudication, or lifecycle state. Evidence reconciliation, finding lineage, and finding-state events have schema-required non-null predecessor fields and already enforce candidate or finding ownership; finding-state changes additionally require the stored adjudication and actual projected prior lifecycle. Adjudication was the only nullable advancing reference and the only null-guard that could skip chaining.

### Identity-field audit

| Identity | Uniqueness | Stability | Ownership | Result |
|---|---|---|---|---|
| `runId` + `sessionId` | One pair per projection | Every folded event must retain the initialized pair | Projection-wide run boundary | Existing guard retained |
| `eventId` | One canonical event per ID | Reuse with different canonical bytes rejects | Event is accepted only after the run boundary matches | Existing guard retained |
| `streamId` + `streamSequence` | One contiguous position per stream | Checkpoint replay resumes from that stream's own cursor | Stream positions stay inside the initialized run | Existing guard retained |
| `iterationId` + `dimensionId` + pass provenance | Coverage cells use the composite scope; pass revisions retain producer identity | Candidate references must match the same iteration and dimension | The cited pass owns the candidate source edge | Existing guard retained |
| `candidateId` | Exactly one finding record per candidate | Adjudication and evidence look up the captured candidate rather than replacing it | Candidate stays dimension-scoped and owns its evidence and finding | Existing guard plus projection invariant retained |
| `findingId` | Exactly one candidate per finding ID | First adjudication assigns the public ID; later adjudications must keep it | The candidate↔finding mapping is checked before artifact derivation | New reducer guard and projection invariant |
| `evidenceId` | One candidate owner; immutable revisions may repeat the ID for that owner | Reconciliation must keep the predecessor's evidence ID | The predecessor and every evidence reference stay candidate-scoped | New reducer guard and projection invariant |
| `artifactId` + `logicalArtifactId` | Immutable artifact IDs reject conflicting content; entity logical IDs group one owner across producer streams, while run-level logical IDs retain run and established-stream scope | Revision lineage appends without rewriting earlier records | Entity artifacts inherit candidate or finding ownership; run-level artifacts project only from the initialization-established stream | Kind-specific owner and run identity models preserve the correct lineage boundary |
| Derived obligation and blocker IDs | Namespaced IDs prevent protocol, depth, coverage, and finding collisions | Repeated observations update the same derived logical obligation | Each value is derived inside the current run projection | Existing derivation retained |

### Artifact logical-identity scoping

Every logical artifact ID has the form `<kind>:sha256(canonical(identity-key))`. Entity artifacts use only their stable owning entity, so a valid revision produced on another stream remains in the same logical group. Run-level artifacts retain the run, session, and initialization-established stream boundary from the prior hardening; continuity also retains its packet owner.

| Artifact kind | Logical identity key | Revision model | Cross-stream behavior |
|---|---|---|---|
| Raw finding | `candidateId` | The candidate is the stable entity owner | The same candidate retains one group across producer streams |
| Evidence / verification output | `evidenceId` | Reconciliation explicitly cites the predecessor event for the same candidate-owned evidence ID | Cross-stream revisions preserve bidirectional artifact lineage |
| Adjudication | `findingId` | Re-adjudication explicitly cites the current adjudication for the same finding | Cross-stream revisions preserve bidirectional artifact lineage |
| Review report | `runId` + `sessionId` + established `streamId` | A later report on the established stream supersedes the earlier report | Off-established-stream reports are ignored by the run-level artifact projection |
| Continuity save | `runId` + `sessionId` + established `streamId` + `targetPacket` | Request/completion/failure revisions for one packet group on the established stream | Off-established-stream continuity events are ignored by the run-level artifact projection |

### Referential ownership audit

| Caller-supplied reference | Enforced owner |
|---|---|
| Candidate `sourcePassEventId` | Pass from the candidate's iteration and dimension |
| Candidate `evidenceRefs` | No referenced evidence identity may be owned by another candidate; later evidence insertion enforces the inverse edge |
| Evidence `candidateId` | Captured candidate in the same dimension |
| Evidence `evidenceId` | One candidate owner; reconciled revisions retain the predecessor's logical ID |
| Evidence `supersedesEvidenceEventId` | Earlier evidence producer for the same candidate |
| Adjudication `evidenceRefs` | Evidence records owned by the adjudicated candidate |
| Adjudication `findingId` | One candidate owner; immutable after the candidate's first adjudication |
| Adjudication `predecessorAdjudicationEventId` | Null only for the first adjudication; otherwise exactly the current adjudication provenance of the same finding |
| Finding-lineage `predecessorEventRef` | Candidate, adjudication, or prior lineage producer owned by the same finding |
| Finding-state `adjudicationEventId` | Adjudication provenance stored on the target finding |
| Finding-state `predecessorEventRef` | Candidate, adjudication, or lineage provenance owned by the target finding |
| Completion evidence references | Evidence owned by each finding's candidate, rechecked before terminal application |
| Completion event references | Event in the same run projection with the required synthesis, report, or continuity role; completed terminals must cite the most-recent clean convergence evaluation |
| Terminal ledger-tail hash | Exact predecessor hash carried by the completion envelope |
| Artifact producer and supersession references | Applied event from the same run and session; entity supersession inherits candidate or finding ownership and may cross producer streams; report and continuity producers must be on the initialization-established stream |

The artifact index records stable logical identity, artifact kind, producer event, reviewed input identity, content digest, availability, and bidirectional supersession. It derives new immutable records instead of changing ledger evidence. Evidence reconciliation and re-adjudication apply their explicit predecessor edges directly, so the run-level temporal grouping pass cannot overwrite entity lineage. Run-level reports and continuity saves remain single lineages owned by the run's initialization-established stream. An auxiliary-stream run-level event remains in `seenEvents` but cannot enter or supersede those lineages. A genuine later revision on the established stream still supersedes canonically. The status projection replays typed transition provenance and rejects impossible edges rather than guessing a lifecycle state.

### Shadow parity surface

`projectDeepReviewLegacyView` emits the complete canonical comparison structure: current iteration, status, terminal decision, coverage, findings, artifacts, and projection health. Its parity fingerprint covers that whole structure. The result is frozen and explicitly marked `shadow-only` with `legacyAuthority: unchanged`; this leaf does not implement the later shadow harness or authority cutover.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-review-reducers/deep-review-projection-types.ts` | Created | Closed projection, checkpoint, shared-backbone, result, status, and ownership types |
| `runtime/lib/deep-review-reducers/deep-review-projection-schema.ts` | Created | Closed semantic-kind validation, referential integrity, and immutable cloning |
| `runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Created | Event routing, projection folds, shared current-state blocker derivation, reusable review-loop backbone, replay integrity, and legacy view |
| `runtime/lib/deep-review-reducers/index.ts` | Created | Stable mode-renamed exports for sibling consumers |
| `runtime/tests/unit/deep-review-reducers.vitest.ts` | Created | Real typed-event replay, adversarial failure, hard-veto, and full parity fixtures |
| `decision-record.md` | Created | Shared-backbone and additive-dark boundary decision |
| Leaf packet docs | Updated | Completion state, checklist evidence, verification, and generated metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reducer imports the landed Deep Review ledger schema and the frozen envelope and mode-contract substrates. Tests build real registered typed envelopes and drive both the exported fold and `DEEP_REVIEW_REDUCER_SURFACE` through real `VerifiedLedgerEvent` frames; `reduceDeepReviewVerifiedEvent` is checked against the fold oracle. No reducer or schema mock replaces the substrate. The module adds no writer, seal, certificate, receipt, rollback switch, mode gate, authority decision, or legacy-path mutation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Export one mode-neutral review-loop backbone | Deep Review and Deep Alignment need identical coverage, obligation, finding, veto, and convergence semantics with different typed mappings. |
| Keep presentation severity derived | Impact and evidentiary factors remain independently replayable, and a weighted score cannot erase a hard veto. |
| Reject phantom producers | A finding or artifact cannot become credible by naming a pass, evidence record, or predecessor absent from the folded ledger. |
| Bind checkpoints to sequence and tail digest | Cursor-gap checks trust the checkpoint tail, so checkpoint integrity must cover the same tail identity. |
| Resume each stream from its own cursor | A global tail can accept silently dropped events on a never-seen or shorter stream and reject valid interleaving. |
| Preserve typed input order as causal order | The envelope has no global position, and an opaque stream label cannot define cross-stream chronology. |
| Treat every nonterminal hard veto as open | Omitting an unadjudicated candidate would let convergence override the veto by never triaging it. |
| Bind resolution to owned provenance and actual state | Ledger-wide adjudication membership permits one finding to spend another finding's resolution; unchecked from-state claims violate the append-only lifecycle. |
| Require exact re-adjudication chaining | Treating null as "no check" lets a later event replace an accepted veto without acknowledging the current adjudication. |
| Treat finding and evidence IDs as owned logical identities | Cross-owner collisions corrupt lookups and supersession; renames orphan earlier logical artifacts. |
| Separate entity and run-level logical artifact identity | Entity revisions must follow candidate, evidence, or finding ownership across producer streams; reports and continuity remain bound to the run's established stream. |
| Project reports and continuity only from the established run stream | These are run-level singletons used by completion, so auxiliary streams cannot author their authoritative lineage. |
| Re-derive blockers and require the latest evaluator for every completed lifecycle | Verdict describes review outcome, while `terminalStatus` drives lifecycle completion; cached convergence eligibility and superseded evaluator judgments are evidence of earlier states only. |
| Match veto roots only across legal token separators | This covers every schema-valid class spelling without false-matching unrelated superstrings. |
| Scope every internal reference to its subject | Global membership lets one candidate or finding spend another subject's valid pass, evidence, or predecessor. |
| Compare the complete legacy structure | A scalar subset could report parity while coverage, artifacts, findings, or status provenance diverged. |
| Keep the module additive-dark | Later siblings own sealing, parity execution, rollback, mode gating, and authority cutover. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 90 tests |
| Causal cross-stream replay | PASS: both `aaaa-*` and `zzzzz-*` auxiliary streams accept valid evidence reconciliation and re-adjudication after their cited predecessors; a full genesis replay with an earlier-sorting auxiliary stream completes |
| Determinism | PASS: repeated folds of the same causal multi-stream input produce byte-identical frozen projections and fingerprints; a causally invalid reversed submission fails closed with `cursor-gap` |
| Fail-closed replay | PASS: pre-genesis events, new-stream gaps, stream-label swaps, version mismatch, payload tampering, impossible transition, and forged checkpoint tail block or throw through the real fold export; valid causal interleaving projects |
| Referential integrity | PASS: borrowed pass, evidence, evidence-supersession, adjudication predecessor, lineage predecessor, state predecessor, state adjudication, finding-ID collision/rename, and evidence-ID collision/rename throw `referential-integrity`; terminal evidence is candidate-scoped; own-scope controls project |
| Adjudication chaining | PASS: second adjudication with null or wrong non-null predecessor rejects; exact current predecessor projects; first adjudication with null projects; rejected re-adjudication leaves the hard veto and convergence blocker intact |
| Finding lifecycle transition | PASS: a transition whose `priorState` differs from the target finding's projected lifecycle throws `projection-field-invalid` |
| Hard-veto precedence | PASS: perfect weighted signals cannot override accepted or never-adjudicated security vetoes; only a `fixed` transition backed by that finding's own adjudication clears the veto |
| Terminal blocker freshness | PASS: completed terminals combine freshly derived coverage, obligation, finding, and veto state with the most-recent evaluator judgment; stale clean citations, latest `continue`, and original citations across blocked/reset evaluations reject, while a cited latest clean convergence completes |
| Terminal lifecycle separation | PASS: `terminalStatus: incomplete` and `terminalStatus: blocked` accept a latest `continue` evaluation and project terminal `incomplete` and `failed` status respectively |
| Artifact identity scope | PASS: cross-stream evidence reconciliation and re-adjudication preserve bidirectional artifact lineage matching the finding ledger; same-stream reconciliation remains linked; unrelated evidence IDs never group; auxiliary report and continuity events cannot demote established-stream artifacts; genuine established-stream revisions still supersede normally |
| Guard falsifiers | PASS: four causal-order tests fail against lexical `stream_id` ordering; the prior identity and lineage falsifiers still fail against stream-baked entity grouping; removing convergence recency accepts both the superseded clean citation and the original pre-block/reset citation; restoring verdict-gated freshness leaves all six non-`pass` late-P1 and late-obligation cases incorrectly accepted; removing finding/evidence uniqueness and stability makes four collision/rename tests fail; narrowing separators fails four spelling fixtures; restoring the adjudication null-skip fails the null-predecessor regression; restoring ledger-global terminal evidence membership fails the candidate-ownership schema regression |
| Verified reducer surface | PASS: surface verification and direct verified-event reduction match the fold oracle |
| Complete legacy parity | PASS: frozen inline fixture compares the complete canonical legacy view and fingerprint |
| Runtime TypeScript project | PASS: TypeScript 5.9.3 whole-runtime `tsc -p runtime/tsconfig.json --noEmit` exits 0; diagnostics for `runtime/lib/deep-review-reducers/` = 0 |
| Strict spec validation | PASS: Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No sealed artifacts or certificates.** Later siblings consume artifact references and own construction, sealing, signing, and certification.
2. **No shadow replay harness.** This leaf supplies the complete legacy view and parity fingerprint; the shadow-parity sibling runs the dual-path comparison.
3. **No rollback or authority switch.** The reducer remains dark and read-only until the later mode gate and phase-014 cutover.
4. **Deep Alignment cross-verification is pending.** Mode 008 has no reducer yet, so shared-backbone reuse is structurally ready but cannot be verified end to end until that reducer consumes `reduceSharedReviewLoopBackbone`.
5. **No open projection shapes.** Sibling clones must consume the exported closed types and must not widen evidence or artifact records to open dictionaries.
<!-- /ANCHOR:limitations -->
