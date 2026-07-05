---
title: "Implementation Summary: Compiled-Contract Generalization Probes"
description: "Phase 003 of the compiled-contract-compiler track (007) — fix-vs-fallback probes on gpt-fast-med at N=2. Council NOT confirmed (fix arm split 1/2 vs fallback 0/2; seat-convergence stall dominates); context lever-null on the natural cell and method-moot (surface deprecated concurrently); leaf-reliability lift an honest negative on the review re-probe."
trigger_phrases:
  - "036 phase 003 summary"
  - "generalization probe results"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/003-generalization-probes"
    last_updated_at: "2026-07-04T16:07:46Z"
    last_updated_by: "claude-code"
    recent_action: "N=2 completion scored; council verdict revised (fix arm split 1/2)"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Compiled-Contract Generalization Probes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Completed** | 2026-07-04 |
| **Parent Packet** | ../ (036-command-contract-compiler) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three behavior-benchmark scenario cells (`scenarios/CXB-004.md`, `ACB-005.md`, `RVB-REPROBE.md`) and nine scored runs on `gpt-fast-med` (`runs/`): a CXB-004 fix pilot, the focused set (CXB-004 fallback, ACB-005 fix + fallback, RVB-REPROBE fix), then second samples for both CXB-004 and ACB-005 arms to complete the N≥2 gate. Full scored tables + the verdict are in `results.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rollout JSON toggled each command fix/fallback per run; fixtures were restored between runs and the lever reset to `fallback` after. A pilot N=1 surfaced the should-halt confound early, which scoped the rest to a focused set rather than a confusing full N=2 matrix on the natural cells.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Focused set first, N=2 completion after.** The pilot showed CXB-004 (a should-halt cell) scores `setup_misbind` in both arms, so the matrix ran as a focused set first; the N≥2 gate was then completed with paired parallel second samples — which overturned the N=1 council read, vindicating the gate.
- **Command-kind review re-probe as the clean control.** RVB-REPROBE (`--command deep/review`) tests the lever directly, unlike the natural CXB/ACB cells.
- **Reported the honest negative.** The leaf-reliability check did not lift the review re-probe to pass; it makes the incomplete leaf detectable but its re-dispatch is model-followed in the single-executor loop.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Cell / arm | Sample 1 | Sample 2 | Read |
|---|---|---|---|
| ACB-005 council fix | `pass` (D3=2) | `stuck_no_progress` (D3=0) | Split 1/2 — directional signal, not a reliable flip |
| ACB-005 council fallback | `stuck_no_progress` | `stuck_no_progress` | Stall reproduces (033 baseline) |
| CXB-004 context fix | `setup_misbind` (dispatched leaf) | `pass` (halt honored) | Arms move in lockstep both samples |
| CXB-004 context fallback | `setup_misbind` | `pass` | Lever-null on the natural cell, confirmed at N=2 |
| RVB-REPROBE review fix | `missing_artifact` (D3=1) | — | Leaf dispatched but artifact/route-proof incomplete; re-dispatch not mechanically enforced |

**Verdict (N=2):** council NOT confirmed (fix 1/2 vs fallback 0/2 — the only pass was under fix, but the seat-convergence stall dominates both arms); context lever-null and method-moot (surface being deprecated concurrently); the proven flips remain review/research; the leaf-reliability check adds detectability, not a mechanical rescue, in single-executor mode. Full analysis + recommendations in `results.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **N=2 per cell.** The N=2 completion overturned the N=1 "decisive" council read (fix arm split 1/2) — the sample count is recorded per arm in the verification table; bounding the true council fix pass rate needs N≥3 after the stall fix.
2. **Autonomous-precedence over-triggers on should-halt asks** (context CXB-004) — a follow-up should add a setup-confirm carve-out.
3. **Model-followed re-dispatch.** The leaf-reliability retry is not mechanically enforced in the single-executor loop; a runner-owned retry (fan-out) is the follow-up.
<!-- /ANCHOR:limitations -->
