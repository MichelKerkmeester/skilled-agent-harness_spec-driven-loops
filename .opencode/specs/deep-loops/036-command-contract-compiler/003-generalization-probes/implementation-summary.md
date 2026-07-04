---
title: "Implementation Summary: Compiled-Contract Generalization Probes"
description: "Phase 003 of packet 036 — ran fix-vs-fallback probes on gpt-fast-med. Council flip confirmed (fix pass vs fallback stall); context mechanism confirmed but should-halt-confounded; leaf-reliability lift not demonstrated on the review re-probe."
trigger_phrases:
  - "036 phase 003 summary"
  - "generalization probe results"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/036-command-contract-compiler/003-generalization-probes"
    last_updated_at: "2026-07-04T15:24:43Z"
    last_updated_by: "claude-code"
    recent_action: "Probes scored; council flip confirmed, verdict written"
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

Three behavior-benchmark scenario cells (`scenarios/CXB-004.md`, `ACB-005.md`, `RVB-REPROBE.md`) and five scored runs on `gpt-fast-med` (`runs/`): a CXB-004 fix pilot, then CXB-004 fallback, ACB-005 fix + fallback, and the RVB-REPROBE review-fix. Full scored tables + the verdict are in `results.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rollout JSON toggled each command fix/fallback per run; fixtures were restored between runs and the lever reset to `fallback` after. A pilot N=1 surfaced the should-halt confound early, which scoped the rest to a focused set rather than a confusing full N=2 matrix on the natural cells.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Focused set over full N=2.** The pilot showed CXB-004 (a should-halt cell) scores `setup_misbind` in both fix and fallback, so a full N=2 on the confounded natural cells would not add clean signal.
- **Command-kind review re-probe as the clean control.** RVB-REPROBE (`--command deep/review`) tests the lever directly, unlike the natural CXB/ACB cells.
- **Reported the honest negative.** The leaf-reliability check did not lift the review re-probe to pass; it makes the incomplete leaf detectable but its re-dispatch is model-followed in the single-executor loop.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Cell / mode | Classification | D3 | Read |
|---|---|---|---|
| ACB-005 council fix | `pass` | 2 | Seats convened in-CLI — the flip generalizes to the seat-mode |
| ACB-005 council fallback | `stuck_no_progress` | 0 | Silent stall (033 baseline) — clear fix-vs-fallback delta |
| CXB-004 context fix | `setup_misbind` | · | Dispatched `deep-context` (mechanism bites) but scored misbind (should-halt) |
| CXB-004 context fallback | `setup_misbind` | · | Also misbinds — classification cannot separate the modes |
| RVB-REPROBE review fix | `missing_artifact` | 1 | Leaf dispatched but artifact/route-proof incomplete; re-dispatch not mechanically enforced |

**Verdict:** the flip generalizes to council decisively and to context at the mechanism level; the leaf-reliability check adds detectability but not a mechanical rescue in single-executor mode. Full analysis + recommendations in `results.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **N=1 per cell.** The focused set ran one sample each; the council delta is stark but not N-scaled. The should-halt confound made larger N on the natural cells low-value.
2. **Autonomous-precedence over-triggers on should-halt asks** (context CXB-004) — a follow-up should add a setup-confirm carve-out.
3. **Model-followed re-dispatch.** The leaf-reliability retry is not mechanically enforced in the single-executor loop; a runner-owned retry (fan-out) is the follow-up.
<!-- /ANCHOR:limitations -->
