---
title: "Tasks: next-focus semantics (recommendations implementation phase 010 child 004)"
description: "Tasks for implementing typed next-focus candidates, deterministic scoring and selection, and replayable ledger recording."
trigger_phrases:
  - "next-focus semantics tasks"
  - "deep-loop focus selection tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-21T09:03:07Z"
    last_updated_by: "codex"
    recent_action: "Canonicalized rejected candidates and verified reordered retries"
    next_safe_action: "Retain shadow-only operation until a later authority phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/next-focus/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/next-focus.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Next-Focus Semantics

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin BASE and inventory the typed-ledger writer, transition gateway, replay fingerprint, projection watermark, and current-focus seams
  - [EVIDENCE: BASE `012652b479`; frozen contracts read before implementation]
- [x] T002 Capture protected behavior from `runtime/lib/deep-loop/pivot-candidates.ts`, `runtime/lib/deep-loop/divergent-pivot.ts`, and the phase placement in `manifest/phase-tree.json`
  - [EVIDENCE: pivot 4/4 and divergent-pivot 14/14 fixtures pass]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Define the `NextFocusCandidate` union for coverage gaps, open contradictions, and under-covered communities with stable identity, evidence, boundary, fingerprint, provenance, watermark, and normalized signals
  - [EVIDENCE: `next-focus-types.ts` and per-region leaf fixtures]
- [x] T004 Implement candidate validation and pivot-compatible exact/material-similarity deduplication with typed fail-closed errors
  - [EVIDENCE: `next-focus-candidates.ts`; duplicate-ID, exact, and material parity fixtures]
- [x] T005 Implement single-watermark signal adapters and checked basis-point scoring for coverage gap, contradiction urgency, and novelty decay
  - [EVIDENCE: `next-focus-selection.ts`; integer/range and mixed-snapshot fixtures]
- [x] T006 Implement the total deterministic comparator and order-independent selected/no-eligible outcome
  - [EVIDENCE: leaf Vitest 18/18 covers all five comparator tiers and three permutations]
- [x] T007 Add transition-authorized `next_focus_selected` and `next_focus_unavailable` ledger events with the ranked frontier, policy version, source fingerprint, previous focus, and comparator evidence
  - [EVIDENCE: `next-focus-events.ts`; selected and unavailable ledger round trips pass]
- [x] T008 Add replay reduction, idempotent duplicate handling, conflicting-payload refusal, and candidate-set fingerprint validation
  - [EVIDENCE: `next-focus-replay.ts`; retry, conflict, and fingerprint-drift fixtures pass]
- [x] T009 Wire additive-dark shadow comparison without granting the new selector current-focus authority
  - [EVIDENCE: shadow fixture retains `legacy focus`; frozen divergent-pivot 14/14]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify: Candidate model completeness — all three kinds validate and every malformed field fails with a stable typed error
  - [EVIDENCE: leaf Vitest field-family and per-kind fixtures pass]
- [x] T011 Verify: Snapshot consistency — mixed, stale, or unsupported watermarks and missing required evidence fail before scoring
  - [EVIDENCE: leaf Vitest mixed-snapshot and required-evidence fixtures pass]
- [x] T012 Verify: Deterministic scoring — integer golden vectors, overflow guards, policy versions, and candidate fingerprints are stable across repeated runs
  - [EVIDENCE: 18/18 leaf fixtures; source fingerprint `14f717be7155...`]
- [x] T013 Verify: Total selection — every tie-break tier and input permutation produces the same ordered frontier and winner
  - [EVIDENCE: leaf Vitest 18/18 passes comparator and byte-for-byte permutation tests]
- [x] T014 Verify: Ledger replay — selected and no-eligible outcomes restore from recorded events without prompt state or live projection access
  - [EVIDENCE: leaf Vitest 18/18 passes stored selected and unavailable replay tests]
- [x] T015 Verify: Conflict handling — same decision/same payload is idempotent and same decision/different payload is rejected
  - [EVIDENCE: recomputed retries with reversed invalid-candidate input order have byte-identical payloads and one ledger frame; conflict raises `CONFLICTING_REPLAY`]
- [x] T016 Verify: Compatibility — existing pivot candidate and divergent-pivot tests pass without altered Council quorum, veto, budgets, recursion, or artifacts
  - [EVIDENCE: pivot 4/4 and divergent-pivot 14/14 fixtures, both exit 0]
- [x] T017 Verify: Additive-dark posture — shadow evidence is append-only and authoritative current focus remains unchanged
  - [EVIDENCE: `git diff --name-only` is empty for frozen paths; shadow Vitest passes]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
