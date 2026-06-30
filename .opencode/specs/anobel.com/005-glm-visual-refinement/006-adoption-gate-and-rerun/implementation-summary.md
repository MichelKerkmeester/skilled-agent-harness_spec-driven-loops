---
title: "Implementation Summary: adoption-gate-and-rerun"
description: "Planning-state summary for the final adoption gate plus the measured 45-tile re-run. Nothing is implemented yet - this records the planned delivery so the Level 2 packet is complete and resumable."
trigger_phrases:
  - "adoption gate implementation summary"
  - "rerun delivery summary"
  - "measured re-run planning state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/006-adoption-gate-and-rerun"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folded panel: pre-registered ADOPT rule, de-circular gate, recovered-2D floor"
    next_safe_action: "Implement adoption-gate + ground-truth calibration before the re-run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: adoption-gate-and-rerun

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

> **Status: PLANNING ONLY - not yet implemented.** This file exists so the Level 2 packet is structurally complete and resumable. It records the planned delivery; it will be rewritten with measured evidence once phases 001-005 ship and the re-run runs.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-adoption-gate-and-rerun |
| **Completed** | Not yet (planning) |
| **Level** | 2 |
| **Phase** | 6 of 6 (final) under anobel.com/005-glm-visual-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. When implemented, this phase will add the final adoption gate (pipeline step 11) and the measured re-run that proves whether the 001-005 program closed the bento-tile quality gap. The planned surface is the adoption-gate decision function, the 45-tile re-run driver, the metrics computer, and the lift report.

### Planned Deliverables

| File | Action | Purpose |
|------|--------|---------|
| `004-bento-visuals/research/rerun/adoption-gate.mjs` | Create (planned) | Five-sub-gate AND decision: ship / keep-prior / downgrade |
| `004-bento-visuals/research/rerun/rerun-45.mjs` | Create (planned) | Drive 45 tiles through 001-005 + the gate; write JSONL ledger |
| `004-bento-visuals/research/rerun/compute-lift.mjs` | Create (planned) | SHIP rate, diagram-vs-linear delta, contrast exit-0, cost, paired deltas |
| `004-bento-visuals/research/rerun/rerun-report.md` | Create (planned) | Lift report vs 60% / ~41-pt baseline + adopt/iterate/reject verdict |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned approach reuses the existing `gen-tile.mjs` harness and the phase-001 audit gate (`audit-concept.sh`); the re-run driver wires the 001-005 stages plus the adoption gate and records per-tile telemetry. Confidence will come from calibrating the gate against a hand-labeled stratified sample before trusting the full batch, and from human spot-checks of accepted tiles for slop the deterministic gates cannot catch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Measurement, not new generation.** This phase adds only the adoption gate and the lift measurement; it does not change the 001-005 mechanisms.
- **Paired tile-level deltas over independent angle sums.** Because n=45 (1 tile = 2.2 pts) and A1/A3/A4/A5 gains overlap, lift is measured per tile against a single baseline snapshot.
- **Conservative gate on uncertainty.** A tile with unknown MiniMax status is blocked from ship, not assumed to pass.
- **Downgrade inflation is surfaced, not hidden.** Newly-shipped tiles are tagged recovered-2D vs downgraded-to-linear so SHIP gains are honest.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet verified. Planned verification: `validate.sh --strict` on this folder during planning; for the implemented phase, the SC-001..SC-005 thresholds (SHIP 80-84%+, delta 14-20 pts or better, contrast exit-0 95-100% as a sub-metric, cost within ceiling, zero locked-field regressions) checked against the measured ledger, plus the adopt/iterate/reject decision rule in `checklist.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Deterministic gates (geometry, contrast) cannot catch RC-7 visual slop; a human spot-check remains necessary.
- Contrast exit-0 is near-tautological for a hard gate and must not be read as the headline lift.
- The re-run depends on paid external APIs (MiniMax, GPT-5.5) and a latency tail (6-161s); a too-tight timeout biases the experiment downward.
- This summary is a planning placeholder and carries no measured results until the phase is implemented.
<!-- /ANCHOR:limitations -->
