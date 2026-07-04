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
    packet_pointer: "deep-loops/036-command-contract-compiler/003-generalization-probes"
    last_updated_at: "2026-07-04T15:24:43Z"
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
- [x] **T004** Focused set N=1: CXB-004 fallback, ACB-005 fix + fallback, RVB-REPROBE fix — lever reset to `fallback` + fixtures restored after.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T005** Score each run (D1-D5, classification, delegation) — council fix `pass` (D3=2) vs fallback `stuck_no_progress` (D3=0); context confounded; review re-probe `missing_artifact` (D3=1).
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
