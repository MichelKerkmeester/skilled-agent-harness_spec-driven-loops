---
title: "Implementation Summary: next-focus semantics"
description: "Verified pivot-compatible next-focus derivation, deterministic scoring, ledger replay, and dark comparison."
trigger_phrases:
  - "next-focus implementation"
  - "next-focus verification"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-21T09:03:07Z"
    last_updated_by: "codex"
    recent_action: "Canonicalized rejected candidates and verified reordered retries"
    next_safe_action: "Keep recommendations shadow-only while parity evidence accumulates"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/next-focus/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/next-focus.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Next-Focus Semantics

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-next-focus-semantics |
| **Completed** | 2026-07-21 |
| **Level** | 3 |
| **Status** | Complete |
| **Baseline revision** | `012652b479` plus the scoped additive working-tree delta |
| **Scoring policy** | `next-focus-equal-components-bps-v1` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Implemented an additive next-focus sidecar that derives evidence-linked candidates for coverage gaps, open contradictions,
and under-covered semantic communities from one immutable projection snapshot. It delegates generic validation and
deduplication to the shipped pivot gate, ranks accepted candidates with an integer-only versioned policy, records the complete
selected or unavailable decision through the transition-authorized append-only ledger, and replays only stored outcomes.

| File | Purpose |
|------|---------|
| `next-focus-types.ts` | Region, signal, source, score, decision, replay, and shadow-comparison contracts |
| `next-focus-errors.ts` | Typed fail-closed selection and replay errors |
| `next-focus-candidates.ts` | Snapshot construction, per-kind adapters, and pivot-first validation |
| `next-focus-selection.ts` | Basis-point scoring, total ordering, canonical rejection ordering, shipped deduplication, and dark comparison |
| `next-focus-events.ts` | Typed event schemas, canonical payload preflight, authorized append, and conflict handling |
| `next-focus-replay.ts` | Stored-event ordering and integrity checks plus recorded-focus restoration |
| `index.ts` | Public API |
| `next-focus.vitest.ts` | Adversarial candidate, ordering, ledger, replay, and authority fixtures |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation adds seven runtime files, one leaf suite, and this leaf's Level 3 documentation. No pivot-candidate,
divergent-pivot, event-envelope, authorized-ledger, replay-fingerprint, coverage-graph, sibling packet, or substrate file was
edited. The selector exposes only a recommendation comparison; the supplied legacy focus is returned as authoritative and no
runtime state writer is accepted or imported.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

### Architecture Decision Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Pivot-gated deterministic shadow selector | Accepted | Adds replayable recommendations without moving focus authority |

See `decision-record.md` for alternatives, consequences, and rollback.

| Decision | Rationale |
|----------|-----------|
| Call the shipped pivot gate directly | Validation, exact fingerprints, material similarity, and threshold semantics cannot drift |
| Canonical single-snapshot fingerprint | Mixed watermark, version, or evidence inputs fail before scoring |
| Integer equal-component policy | Scores remain byte-stable and contain no runtime float accumulation |
| Canonical rejection ordering | Candidate ID, candidate fingerprint, and rejection details make retry payload bytes independent of input arrival order |
| Deterministic event ID from decision identity | Same semantics are idempotent; conflicting reuse closes at two boundaries |
| Replay from verified event payload | Later projections cannot change historical focus |
| Observation-only dark comparison | Divergent-pivot Council endorsement remains the sole current-focus authority |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Leaf Vitest | PASS | 18/18 fixtures |
| Pivot compatibility | PASS | 4/4 frozen pivot-candidate fixtures |
| Divergent-pivot compatibility | PASS | 14/14 frozen transaction fixtures |
| TypeScript | PASS | Repository TypeScript compiler, exit 0 |
| Comment hygiene | PASS | Zero violations across all new TypeScript files |
| Strict packet validation | PASS | Errors 0, warnings 0, exit 0 |

The fixtures cover all three region kinds, field-family rejection, required-evidence enforcement, explicit non-applicable
zeros, integer range rejection, the exact score formula, each comparator tier, input permutations, typed unavailable output,
typed event contents, transition authorization, recomputed retry idempotency across reordered invalid candidates, conflicting identity reuse, stored-event replay,
candidate-set fingerprint drift, and unchanged legacy focus authority. The source fixture fingerprint is
`14f717be7155fb2454cc8a7f50851747d055d59ed9423112f99b2b66fa83bf70`.
<!-- /ANCHOR:verification -->

### Milestone Achievement

| Milestone | Status | Evidence |
|-----------|--------|----------|
| Typed candidate adapters | Complete | Per-region derivation and field-family fixtures |
| Deterministic selection | Complete | Integer formula, comparator-tier, and permutation fixtures |
| Durable decisions | Complete | Selected and unavailable authorized-ledger round trips |
| Conflict-safe replay | Complete | Reordered recomputation retry, conflicting reuse, and fingerprint-drift fixtures |
| Additive-dark posture | Complete | Frozen compatibility suites and unchanged focus assertion |

<!-- ANCHOR:limitations -->
## Known Limitations

1. Upstream projection owners supply normalized basis-point observations and evidence IDs; this leaf does not calibrate them.
2. The novelty-decay comparator tier is defensive under the fixed formula because prior equal tiers mathematically imply equal decay.
3. Recommendations remain shadow-only; authority cutover belongs to a later staged phase.
<!-- /ANCHOR:limitations -->

## Risks Realized

| Risk | Occurred | Resolution |
|------|----------|------------|
| Concurrent unrelated typecheck regression | Yes | Held scope; reran after the unrelated edit settled; full compiler returned exit 0 |
| Existing unrelated dirty worktree | Yes | Used baseline-aware, path-filtered scope proof and preserved all unrelated changes |

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Level 2 packet | Level 3 documentation | Runtime and test additions exceed the repository Level 3 threshold |
| Candidate commit SHA | Scoped content fingerprint | No commit was requested; the working tree already contained unrelated concurrent changes |

## Follow-Up Items

No implementation work remains in this leaf. Signal calibration, projection transactions, convergence consumption, and any
authority cutover remain owned by their existing later phases.
