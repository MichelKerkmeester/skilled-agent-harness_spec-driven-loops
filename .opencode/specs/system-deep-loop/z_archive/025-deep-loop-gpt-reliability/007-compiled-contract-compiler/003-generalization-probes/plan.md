---
title: "Plan: Compiled-Contract Generalization Probes"
description: "Plan for phase 003 of packet 036 — run behavior-benchmark probes on gpt-fast-med to test whether the compiled-contract flip generalizes to context and council, and whether the leaf-reliability check lifts the review re-probe."
trigger_phrases:
  - "036 phase 003 plan"
  - "generalization probe plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/007-compiled-contract-compiler/003-generalization-probes"
    last_updated_at: "2026-07-04T16:07:46Z"
    last_updated_by: "claude-code"
    recent_action: "Probes complete; plan reflects the focused-set method"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Compiled-Contract Generalization Probes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run behavior-benchmark cells fix-vs-fallback on `gpt-fast-med` to test whether the compiled-command-contract flip generalizes to context (task_dispatch) and council (seat_artifacts), plus a command-kind review re-probe to check the leaf-reliability check's effect. The rollout JSON is the lever; fixtures are restored between runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each cell runs cleanly through the harness on fix and fallback (or a documented confound explains an absent delta).
- Fix/fallback deltas and the generalization verdict are recorded in results.md.
- The rollout lever is reset to `fallback` and fixtures restored after the runs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`behavior-bench-run.cjs --scenario <cell.md> --leg gpt-fast-med --samples N` spawns the deep command via the leg. The `command-injection-rollout.json` per-command value (`fix`/`fallback`) selects the compiled-contract render inside the command subprocess. Delegation is scored by task events + route-proof (task_dispatch modes) or seat artifacts (council). A pilot N=1 de-risks the stall-prone cells before scaling.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Prep** — reconstruct CXB-004, ACB-005, and a command-kind review re-probe cell from the real 033 contracts; confirm fixtures.
2. **Pilot** — CXB-004 fix N=1 to test whether the lever bites on a natural cell.
3. **Focused set** — CXB-004 fallback, ACB-005 fix + fallback, review re-probe fix (N=1), given the should-halt confound the pilot surfaced.
4. **Verdict** — score deltas; write the generalization verdict + follow-ups.
5. **N=2 completion** — second samples for both cells' arms (paired parallel waves: fix arms together, then fallback arms) to satisfy the N≥2 gate; revise the verdict on the aggregate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The probes ARE the test. Each run emits a scored result.json (D1-D5 + classification + delegation evidence). The fix-vs-fallback delta per cell is the signal; the command-kind review re-probe is the clean lever control.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the leaf-reliability check being wired into the auto YAMLs (so fix-mode runs exercise it) and on the compiled contracts existing for all four deep commands. Uses the 033 fixtures (fx-001 review target reused for context; fx-003 council target).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The probes are read-mostly: they write run artifacts under `runs/` and temporarily toggle the rollout JSON + fixture dirs, both restored after each run. Deleting `runs/` and confirming the rollout is all-`fallback` fully reverts the phase's runtime side effects.
<!-- /ANCHOR:rollback -->
