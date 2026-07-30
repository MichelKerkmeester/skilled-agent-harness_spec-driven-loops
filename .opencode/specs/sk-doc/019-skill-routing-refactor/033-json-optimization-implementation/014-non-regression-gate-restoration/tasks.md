---
title: "Task Breakdown: Restore and Wire the Non-Regression Gate"
description: "Tasks for restore and wire the non-regression gate."
trigger_phrases:
  - "gate restoration task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/014-non-regression-gate-restoration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored and CI-wired the ratchet"
    next_safe_action: "Proceed to phase 015"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/014-non-regression-gate-restoration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Restore and Wire the Non-Regression Gate

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Record the ratchet's current failure modes and confirm no workflow references it [evidence: ran 5/7 failing — hash pin, holdout count, ambiguity, minN, full-corpus; `grep -rn scorer-eval-baseline-ratchet .github/workflows/` returned nothing]
- [x] T-02 Determine which failures are corpus-pin drift and which are genuine metric movement [evidence: the committed baseline was pinned to a stale 200/78/25 corpus (hashes/counts drift); the genuine movement was the 013 regression, now fixed — the re-pin uses the live corpus hashes]
- [x] T-03 Decide whether the review bucket reaches its minimum by adding prompts or by changing the minimum [evidence: lowered `REVIEW_MIN_N` 32→31; growing the corpus is out of scope and the frozen corpus has exactly 31 review rows]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Set the ratchet baseline from the upstream disposition, never from a blind regeneration [evidence: re-pinned via capture against the 013-fixed build → holdout 53/72, delegation 10/11, capturedAtSha `f0a9574664` (the fix commit)]
- [x] T-05 Resolve the corpus hash pin, recording the previous hashes so a corpus change stays distinguishable from a scorer change [evidence: new pin corpus `9f30cc..`/holdout `88a7f7..`/ambiguity `07cd2c..`; prior pin (corpus `529f65..`, holdout `90dbee..`, ambiguity `e07cac..`, sha `37ebd31720`) recorded in the impl-summary]
- [x] T-06 Resolve the review bucket condition per the decision above [evidence: `REVIEW_MIN_N` set to 31 with a rationale comment at the constant]
- [x] T-07 Add the ratchet suite to the routing workflow alongside the existing suites [evidence: a "Scorer-eval baseline ratchet" step added to the `golden-prompt-gate` job in `routing-registry-drift.yml`, after the golden-prompt suite]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Confirm the ratchet passes locally before the wiring lands, never as a standalone red commit [evidence: `vitest run` on the ratchet exited 0, 7/7 passed, before the workflow step and the docs land in the same commit]
- [~] T-09 Confirm a real CI run fails when the ratchet fails [evidence: operator-gated — a GitHub Actions run needs a push this program forbids; wiring is landed and correct and the suite passes locally, recorded as spec Amendment A-001]
- [x] T-10 Introduce a deliberate routing mutation, observe the gate fail, record the output, and revert [evidence: `evidence/ratchet-mutation-proof.txt` — reverting the fix failed 2 assertions (holdout 51≠53, delegation 8≠10); restored via `git checkout` and re-run 7/7 green]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The ratchet passes 7 of 7; the corpus hash pin matches live with prior hashes recorded; the review bucket meets its minimum or the minimum changes with written rationale; a real CI run shows the job failing when the ratchet fails; a deliberate mutation is observed to trip the gate; and both declared floors keep their current values.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
