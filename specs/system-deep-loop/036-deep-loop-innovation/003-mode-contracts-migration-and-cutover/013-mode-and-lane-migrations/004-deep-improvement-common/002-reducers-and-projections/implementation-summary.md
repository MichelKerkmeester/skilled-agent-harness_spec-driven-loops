---
title: "Implementation Summary: Deep Improvement Common Reducers and Projections"
description: "The additive-dark shared Deep Improvement ledger now folds into deterministic iteration, artifact, score, canary, promotion, and per-mode projections."
trigger_phrases:
  - "deep improvement common reducer implementation"
  - "deep improvement shared projection contract"
  - "deep improvement deterministic replay"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
    last_updated_at: "2026-07-23T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Added exact-duplicate replay idempotency coverage"
    next_safe_action: "Wrap the common fold branch in the agent, model, and skill variant reducers"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-reducers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-common-reducers-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The landed common event union is the only base reducer input"
      - "Variants wrap the common branch without widening its projection"
      - "Raw observations and normalized scores remain separate histories"
      - "Hard vetoes dominate weighted aggregates and external authorization"
      - "Checkpoint integrity binds canonical projection identity to the source tail"
      - "Literal duplicate events leave projection state and integrity unchanged"
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
| **Posture** | Additive-dark; legacy Deep Improvement execution remains unchanged and authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The landed `deep-improvement-common-ledger-schema` now replays into one closed, recursively frozen projection with three common families:

1. **Iteration and convergence** — run generation, evaluator epochs, candidate progress, evaluation budgets, canary lifecycle, promotion lifecycle, unresolved evidence, hard vetoes, stop reason, session outcome, and convergence disposition.
2. **Candidate and artifact index** — candidate lineage, mutation operator, profile scope, immutable artifact references, raw observations, separately versioned normalized scores, receipts, availability, and supersession links.
3. **Shared per-mode status** — one fixed shape for common, agent, model, and skill workstreams, including offline acceptance, active profile, profile-scoped incumbent, canary and promotion stages, authority state, rollback target, and blocking vetoes.

`DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH` is the downstream extension point. Variant reducers place its state under a `common` key, route common stems through its reducer surface, and fold lane-specific stems into a sibling-owned namespaced branch. The outer variant fold owns ordering across the combined event stream. This keeps the common projection closed and prevents agent, model, or skill fields from widening the shared shape.

### Replay and integrity

`foldDeepImprovementCommonEvents` validates every event with the real landed registry, handles exact duplicates idempotently, refuses distinct sequence reuse and gaps, and returns named `rebuild_required` outcomes for incompatible schema, reducer, codec, ordering, checkpoint, cursor, or source-tail state. Projection identity is deterministic. Checkpoint identity additionally binds `sourceTailSequence`, so a forged tail cannot conceal a dropped event.

The focused replay suite now repeats one event verbatim inside the complete valid sequence. Folding that input produces the same projection bytes, integrity digest, source tail, seen-event cardinality, and cursors as folding the sequence once, while the separate gap/out-of-order case continues to exercise distinct invalid ordering.

Every public projection is cloned through canonical JSON and recursively frozen. The reducer surface declares one owner for every persisted top-level field and includes a determinism/immutability ownership probe using the real shared `ModeContract.reduce` signature.

### Evidence, scoring, and transition discipline

Candidate, evaluator, observation, canary, promotion, rollback, and completion references must resolve to previously folded events of the expected family, candidate, evaluator epoch, and payload digest. Phantom producers fail with `referential-integrity`. Candidate lineage, derived-score observation references, artifact producers, evaluator epochs, and incumbents are rechecked across projection arrays.

Raw observations remain append-only in `rawObservations`; normalized score vectors remain separate in `derivedScores`, keyed by score-policy version and the pinned `backend:deep-improvement-score` backend. Re-reduction never overwrites raw evidence. Canary, evaluator-integrity, verification, and promotion failures become typed hard vetoes. A perfect weighted aggregate, canary aggregate, or external authorization cannot clear one.

The status machine rejects impossible candidate, evaluator, canary, promotion, rollback, and terminal transitions. It distinguishes offline acceptance, shadow, canary, ship eligibility, shipped, paused, aborted, rolled back, inconclusive, blocked, and quarantined states. The candidate-facing derived view is a separate closed redacted projection with no evaluator, fixture, observation, evidence, digest, receipt, reference, or hidden-material fields.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-improvement-common-reducers/deep-improvement-common-projection-types.ts` | Created | Closed projection, checkpoint, status, result, and extension types |
| `runtime/lib/deep-improvement-common-reducers/deep-improvement-common-projection-schema.ts` | Created | Closed field-kind validation, cross-array integrity, and immutable cloning |
| `runtime/lib/deep-improvement-common-reducers/deep-improvement-common-reducer.ts` | Created | Pure event folds, service-state transitions, replay integrity, extension branch, and derived views |
| `runtime/lib/deep-improvement-common-reducers/index.ts` | Created | Stable public exports for the three downstream variants |
| `runtime/tests/unit/deep-improvement-common-reducers.vitest.ts` | Created | Real typed-event determinism, exact-duplicate idempotency, fail-closed, veto, checkpoint, redaction, and full-parity fixtures |
| Leaf packet docs | Updated | Completion state, checklist evidence, verification, and generated metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is additive-dark: it imports the landed common schema and exposes a pure reducer surface without changing legacy writers, runtime gates, or downstream lane behavior. Verification used the project-pinned Vitest and TypeScript toolchain, source scans for effect and comment-hygiene leaks, a strict packet validator, and a path-scoped status review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep one closed common projection under a variant-owned `common` branch | Downstream lanes can add namespaced state without changing shared field ownership or the common replay contract |
| Separate raw observations from policy-versioned derived scores | Re-scoring remains auditable and cannot erase source evidence |
| Bind checkpoints to projection identity and the exact source tail | A valid projection digest cannot conceal omitted or reordered source events |
| Model vetoes as monotonic typed state | Aggregate scores and external authorization cannot override evaluator, security, canary, verification, or promotion failures |
| Produce candidate-facing state through a separate redacted projection | Candidate mutation code cannot receive evaluator or evidence internals through the common reducer API |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 10 tests |
| Determinism and immutability | PASS: identical events produce byte-identical frozen state, checkpoints, and fingerprints |
| Exact-duplicate idempotency | PASS: one event repeated verbatim leaves projection bytes, integrity digest, source tail, seen-event cardinality, and cursors unchanged |
| Fail-closed replay | PASS: gap, distinct sequence reuse, phantom source, forged tail, and impossible transition cases hit the real fold and assert their specific guards |
| Score separation and veto precedence | PASS: one raw observation survives two derived score policies; a perfect later aggregate cannot clear a security veto |
| Complete legacy parity | PASS: the full frozen legacy structure is compared without scalar-subset projection |
| Candidate redaction | PASS: the complete candidate view contains no evaluator or evidence internals |
| Real substrate | PASS: `substrateImportsReal: true`; implementation and tests import the landed common ledger schema, event registry/producer, canonical envelope codec, and shared mode contract |
| Runtime TypeScript project | PASS: project-pinned `tsc --noEmit -p runtime/tsconfig.json` exited 0; own-module error lines 0 |
| Purity and comment hygiene | PASS: source scan found no filesystem, network, clock, randomness, logging, `any`, or ephemeral artifact labels |
| Strict spec validation | PASS: exit 0 with 0 errors and 0 warnings after metadata refresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No sealed artifact format.** The next sibling owns sealing; this leaf records immutable references, digests, receipts, availability, and lineage only.
2. **No authoritative writer or cutover.** The reducer is dark and read-only. It adds no gate, switch, certificate, effect execution, rollback action, or legacy-writer mutation.
3. **No variant-specific projection fields.** Agent, model, and skill reducers must wrap the exported common branch and keep their own fields namespaced.
4. **No invented cost or latency values.** The landed common ledger schema exposes budget references but no numeric cost or latency observations, so the reducer preserves the available references instead of fabricating measurements.
<!-- /ANCHOR:limitations -->
