---
title: "Implementation Summary: Agent Improvement Reducers and Projections"
description: "The additive-dark Agent Improvement ledger now folds into deterministic AgentIR iteration, artifact, coverage, classification, and mode-status projections over the shared Deep Improvement reducer."
trigger_phrases:
  - "agent improvement reducer implementation"
  - "agent improvement projection replay"
  - "agent improvement common fold extension"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
    last_updated_at: "2026-07-23T13:54:33Z"
    last_updated_by: "codex"
    recent_action: "Fixed active mutation status lockstep and isolated the immutable mutation identity regression"
    next_safe_action: "Consume the dark projections from the later mode integration leaf"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-improvement-reducers-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The landed Agent Improvement event union is the only variant reducer input"
      - "The common projection remains closed beneath the composite common key"
      - "Every stream carries an independent sequence frontier"
      - "Behavioral classification requires typed score, verification, and canary evidence"
      - "Hard vetoes remain independent of aggregate score"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-reducers-and-projections |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy Agent Improvement execution remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The landed Agent Improvement ledger now replays into one closed, recursively frozen composite projection with three
Agent Improvement families:

1. **Iteration and convergence** — mutation lifecycle, first-divergent trace slices, failure attribution, behavior
   experiments and interventions, behavior coverage, typed behavioral classifications, unresolved evidence, and local
   blocking vetoes.
2. **Candidate and artifact index** — definition snapshots, compiled AgentIR versions, component and locus lineage,
   change contracts, evaluation manifests, fixture exposures, transfer trials, content-addressed artifacts,
   supersession, immutable references, and receipts.
3. **Namespaced mode status** — common workstream reference, active AgentIR and mutation, latest classified candidate,
   profile champions, coverage state, evaluator-integrity state, projection health, failure classes, and combined vetoes.
   The active mutation operator is resolved through the active mutation identity, so canonical record sorting cannot
   leave the status frontier pointing at a predecessor's operator.

The composite state stores the imported `DeepImprovementCommonProjectionState` unchanged under `common`. Common event
stems route through the imported `DEEP_IMPROVEMENT_COMMON_REDUCER_SURFACE`; only Agent Improvement extension stems route
through the sibling `agentImprovement` branch. Initial common state comes from the imported common fold. The extension
therefore does not widen the common projection or bypass its raw-observation, derived-score, verification, canary,
promotion, rollback, receipt, or hard-veto guarantees.

### Replay and integrity

`foldAgentImprovementEvents` validates every raw event with the landed Agent Improvement registry, orders causally while
preserving each stream's own sequence, handles exact duplicates idempotently, and rejects distinct sequence reuse,
per-stream gaps, foreign variants, unsupported schemas, and unresolved producer references. Projection fingerprints
derive from canonical bytes. Checkpoints bind the projection digest to the complete per-stream tail map, so a forged or
truncated tail returns a named rebuild result.

AgentIR definitions, compiled IR, mutation loci, observations, experiments, coverage, and classifications enforce
event-ID and payload-digest referential integrity. A classification is accepted only when its typed common normalized
score, verification, and passed canary events exist. Raw transfer and intervention observations never become derived
score vectors, and a hard veto keeps the mode blocked regardless of a later weighted aggregate.

Mutation proposal identity is now immutable independently of event identity. An exact replay of the same event remains
an idempotent no-op, a new mutation ID appends a distinct lineage record, and a fresh event that reuses an established
mutation ID with different operator, locus, proposal, or digest content fails closed with typed referential-integrity
evidence. The regression fixture keeps the proposal on the valid mutable locus and changes only operator/proposal
content, so removing the mutation-identity conflict guard would admit the event instead of failing through a separate
locus rule. The separate rejection event remains the only typed lifecycle update supported by the frozen vocabulary.

Mode-status frontier derivation now looks up the record named by `activeMutationId` instead of taking the final element
of the canonically sorted mutation array. A ten-proposal fixture proves `mutation-10` carries its own operator while
explicitly rejecting the stale `mutation-9` operator; a single-proposal control proves the same identity-to-operator
relationship without the lexical-order edge case. The frontier audit found no active-locus or active-contract fields in
the closed mode-status type or schema; `activeAgentIrId`, `activeMutationId`, and `activeMutationOperatorRef` are the full
active-frontier set.

The adjacent referential audit replaced global membership checks with owner-bound validation. AgentIR component, edge,
and locus IDs cannot resolve to conflicting content across versions; edges and loci must belong to their defining IR;
mutation loci must be mutable and owned by the exact contract-referenced IR; mutation candidate, change, and parent
links must match their captured owners; trace, experiment, intervention, coverage, transfer, and classification evidence
must belong to the cited candidate and producer chain; and the namespaced profile-champion view must exactly preserve
the common incumbent map. No common-reducer, landed-schema, golden-module, or substrate file changed.

Every public projection is cloned through canonical JSON and recursively frozen. The candidate view is a separate
closed redacted shape. The complete legacy comparison view embeds the common legacy projection and is validated through
the common reducer's own closed-schema assertion; tests compare the entire structure rather than a scalar subset.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/agent-improvement-reducers/agent-improvement-projection-types.ts` | Created | Closed composite, variant, checkpoint, result, view, and reducer-surface types |
| `runtime/lib/agent-improvement-reducers/agent-improvement-projection-schema.ts` | Created | Closed schemas, referential integrity, common-view delegation, and immutable cloning |
| `runtime/lib/agent-improvement-reducers/agent-improvement-reducer.ts` | Created | Pure composed fold, Agent Improvement branches, replay integrity, status derivation, and views |
| `runtime/lib/agent-improvement-reducers/index.ts` | Created | Stable `AGENT_IMPROVEMENT_*` and mode-renamed reducer exports |
| `runtime/tests/unit/agent-improvement-reducers.vitest.ts` | Created | Real typed-event determinism, replay, integrity, veto, parity, and mode-contract tests |
| Leaf packet docs | Updated | Completion state, checklist evidence, verification, limitations, and generated metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module imports the landed `agent-improvement-ledger-schema` and `deep-improvement-common-reducers` directly:
`substrateImportsReal: true`. It adds no writer, runtime gate, certificate, sealed-artifact format, rollback executor, or
authority switch. Verification uses the project-pinned Vitest and TypeScript toolchain, negative cases that call the
real fold with crafted-invalid input, a source-level purity and comment-hygiene scan, strict packet validation, and a
path-scoped status review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the common projection under an unchanged `common` key | The variant can extend the composite without changing common ownership or schema |
| Track sequence frontiers per stream | Independent streams may reuse sequence numbers; a single global tail would reject valid replay and miss local gaps |
| Require typed adjudication evidence before classification | Raw candidates and raw observations cannot self-promote into scored or verified results |
| Merge local and common veto codes monotonically | Weighted aggregates cannot erase integrity, verification, canary, coverage, or policy blockers |
| Bind checkpoints to every stream tail | A correct projection digest cannot be paired with a forged source frontier |
| Bind immutable IDs to owner-scoped records | Global set membership cannot prove that a component, locus, parent, or incumbent belongs to the referenced lineage |
| Preserve only fields present in the frozen event vocabulary | The reducer records immutable references and receipts instead of inventing absent cost, latency, or sealed-artifact values |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 17 tests (session baseline 15; two active-frontier lockstep proofs added) |
| Determinism and immutability | PASS: identical events produce byte-identical recursively frozen projections and fingerprints |
| Reordered and checkpointed replay | PASS: causal reordering and validated checkpoint replay match the complete fold oracle |
| Per-stream ordering | PASS: independent same-number streams are accepted; gaps and distinct sequence reuse are blocked |
| Active mutation frontier | PASS: one and ten sequential proposals preserve ID/operator lockstep; restoring the stale sorted-tail lookup makes the ten-proposal proof fail with `seq-9` instead of `seq-10` |
| Immutable mutation identity | PASS: conflicting reuse is rejected on a mutable locus; byte-identical replay is a no-op; a new mutation ID is accepted without rewriting prior lineage |
| Referential and tail integrity | PASS: owner-scoped AgentIR members, mutable loci, candidate parents, common incumbents, phantom producers, and checkpoint tails reject mismatches |
| Fail-closed dispatch | PASS: foreign and unknown extension events fail schema validation |
| Score separation and veto precedence | PASS: raw evidence stays outside derived scores, score backend stays `backend:deep-improvement-score`, and hard vetoes dominate |
| Mode contract and legacy parity | PASS: a real `VerifiedLedgerEvent` matches the fold oracle and the complete legacy structure is compared |
| Runtime TypeScript project | PASS: whole-runtime `tsc --noEmit` exit 0; own-module diagnostic lines 0 |
| Comment hygiene | PASS: reducer and regression test report zero forbidden comment references |
| Real substrate | PASS: implementation imports the landed Agent Improvement schema and shared common reducer |
| Strict spec validation | PASS: exit 0 after metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No sealed-artifact format or certificate.** The next sibling owns those artifacts; this leaf only records typed
   references, digests, availability, supersession, and receipts already present in events.
2. **No rollback executor or mode gate.** Common rollback state can be projected, but effects and authority decisions
   remain outside this reducer leaf.
3. **No invented metrics.** The frozen Agent Improvement extension vocabulary does not publish numeric cost, latency,
   or Pareto fields, so the reducer cannot synthesize them. Shared score and budget semantics remain owned by the common
   projection.
4. **No cutover.** The legacy comparison view declares `shadow-only` and `legacyAuthority: unchanged`; integration and
   operational authority belong to later phases.
<!-- /ANCHOR:limitations -->
