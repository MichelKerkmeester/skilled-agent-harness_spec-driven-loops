---
title: "Tasks: Compiled-Contract Generalization Probes"
description: "Task breakdown for phase 003 of packet 036 — generalization probes on gpt-fast-med."
trigger_phrases:
  - "036 phase 003 tasks"
  - "generalization probe tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/003-generalization-probes"
    last_updated_at: "2026-07-04T16:07:46Z"
    last_updated_by: "claude-code"
    recent_action: "All probe tasks complete"
    next_safe_action: "None -- phase complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-003-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Compiled-Contract Generalization Probes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` pending. Evidence cited inline; full scored results in `results.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Reconstruct CXB-004 (context), ACB-005 (council), and RVB-REPROBE (command-kind review) scenario cells from the real 033 contracts; confirm fixtures (fx-001 reused for context, fx-003 council).
- [x] **T002** Confirm the rollout JSON lever + fixture-restore recipe.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T003** Pilot: CXB-004 fix N=1 — the lever bites (GPT dispatched `deep-context`), but the should-halt cell scores `setup_misbind`.
- [x] **T004** Probe matrix to N=2: focused set (CXB-004 fallback, ACB-005 fix + fallback, RVB-REPROBE fix), then second samples for both CXB-004 and ACB-005 arms — lever reset to `fallback` + fixtures restored after each run.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T005** Score each run (D1-D5, classification, delegation) — at N=2: council fix split 1/2 (`pass` then `stuck_no_progress`) vs fallback 0/2; context lever-null (arms lockstep both samples); review re-probe `missing_artifact` (D3=1).
- [x] **T006** Write the generalization verdict + follow-ups in `results.md` and the implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Probes run, scored, and the generalization verdict recorded. Complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `results.md` — full scored results + verdict
- `spec.md` / `plan.md` — method
- `implementation-summary.md` — outcome summary
<!-- /ANCHOR:cross-refs -->
