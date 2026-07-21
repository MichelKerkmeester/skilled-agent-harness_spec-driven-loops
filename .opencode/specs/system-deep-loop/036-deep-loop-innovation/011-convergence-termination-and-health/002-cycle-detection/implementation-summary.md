---
title: "Implementation Summary: Cycle Detection"
description: "Delivered deterministic cycle observations, bounded replay, progress-gated detection, typed health events, and evidence-only shadow handoff."
trigger_phrases:
  - "cycle detection implementation"
  - "cycle detector verification"
  - "cycle health evidence"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/002-cycle-detection"
    last_updated_at: "2026-07-21T11:31:40Z"
    last_updated_by: "codex"
    recent_action: "Verified no-starvation and fail-closed fixes"
    next_safe_action: "Keep cycle evidence dark until stopping-clock arbitration is implemented"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/cycle-detection/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/cycle-detection.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Coverage progress floor is 100 basis points in detector policy v1"
      - "Confirmed cycle evidence contributes to the clock but cannot authorize stop"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cycle-detection |
| **Completed** | 2026-07-21 |
| **Level** | 3 |
| **Status** | Complete |
| **Repository baseline** | `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Detector policy** | `cycle-detector-policy-v1` |
| **History reducer** | `cycle-history-reducer-v1` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runtime can now recognize deterministic degeneration across committed iteration boundaries without changing the shipped
convergence decision. It records typed semantic state, detects exact short cycles at the third traversal, reports every
qualifying focus and claim repetition under composite drift, and emits authorized health evidence that cannot represent a stop decision.

### Canonical Typed Observation

`CycleObservation` binds one run lineage, iteration, monotonic ledger cursor, and projection watermark to three signatures.
The focus signature keeps recorded candidate and region identities, ranked typed frontier, and scoring-policy version while
excluding prompt text and display labels. The claim-frontier signature sorts typed claim references and folds lifecycle,
epistemic, unresolved-match, and contradiction state. Composite state adds versioned coverage and blockers. Recorded phase-010
digests remain audit evidence outside the semantic comparison digest.

### Bounded Replay and Detection

One immutable reducer drives incremental application and full replay. It retains the latest 12 observations, records the exact
eviction boundary, and hash-chains evicted fingerprints. The detector checks exact suffix periods one through four before the
secondary heuristic and confirms only after three complete traversals. The independent three-in-eight check groups focus and
claim-frontier fingerprints without consulting composite equality. It evaluates every qualifying kind in deterministic priority
order, then exposes the first item as primary evidence for existing consumers.

### Progress, Events, and Authority Isolation

The versioned progress gate accepts new independent evidence, a material typed claim change, contradiction or blocker
resolution, or a 100-basis-point net end-versus-start path/community coverage gain. Missing progress is an explicit variant and never becomes
no-progress evidence. Suspected, confirmed, and cleared events use current event-envelope and authorized-ledger contracts,
deterministic identities, exact semantic retry handling, and a shadow-only transition policy. The stopping-clock handoff fixes
`authority` to `evidence_only` and `stop_decision` to `null`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All runtime code is additive under `runtime/lib/cycle-detection/`. The unit suite uses the shipped phase-010 APIs to build real
next-focus decisions and typed claim projections, then drives the projector through fixed points, period-two-to-four sequences,
paraphrases, composite drift, every progress category, missing data, gaps, reducer drift, resume, replay, health authorization,
and shadow authority isolation. No detector module imports or edits `convergence.cjs`, claim-continuity, next-focus, or the
authorized substrate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hash typed semantic focus state instead of the recorded presentation-sensitive candidate digest | Phase-010 candidate fingerprints include labels; retaining that digest as audit evidence avoids making wording part of cycle identity |
| Run exact period matching before secondary repetition | A genuine period-one-to-four suffix must confirm at its third traversal without being downgraded to suspicion |
| Evaluate every independently qualifying repetition kind | Focus priority remains deterministic without starving a co-occurring claim-frontier cycle |
| Require complete typed progress data | A missing signal cannot prove absence of progress |
| Use one reducer for incremental and replay paths | Sharing the reducer removes an alternate implementation that could drift at eviction boundaries |
| Return the authoritative result by object identity | Additive-dark behavior is directly testable and cannot silently rewrite the legacy decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Leaf Vitest command | PASS, 1 file and 28 tests |
| Pinned TypeScript 5.9.3 compiler | PASS, exit 0 with `--noEmit` |
| Canonical typed digest | PASS, reordered claims and changed wording preserve semantic fingerprints while source audit digests change |
| Three-traversal boundary | PASS, periods one through four reject the prior observation count and confirm at `period × 3` |
| Progress and missing data | PASS, five progress categories break candidates; a transient coverage peak does not; missing signal returns `not_evaluable` |
| Secondary repetition | PASS, focus-only and claim-only repetition suspect under composite churn; co-occurring focus and claim evidence both report before the claim fingerprint leaves the next window |
| Claim watermark integrity | PASS, null required claim watermark raises `INVALID_INPUT` and a non-null mismatch raises `MIXED_WATERMARK` |
| Replay stability | PASS, 16 observations produce identical retained order, eviction boundary, eviction chain, full projection, and history hash |
| Health evidence and authority | PASS, authorized append plus idempotent retry leaves one ledger event; clock input has `stop_decision: null` |
| Frozen-source audit | PASS, no detector import of `convergence.cjs` and no diff in the frozen source paths |
| Strict packet validation | PASS, exit 0 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow only**: The module emits evidence but does not activate stopping-clock arbitration or change convergence behavior.
2. **Compiler selection**: The repository-pinned TypeScript 5.9.3 compiler passes. The workstation-global TypeScript 6.0.3 rejects the existing `moduleResolution=node10` setting before source checking.
3. **Dirty shared worktree**: The worktree already contained unrelated modified and untracked files. Scope proof therefore uses the leaf path delta and frozen-path diff, not a globally clean status.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
