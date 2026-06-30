---
title: "Implementation Summary: spatial-contract-and-gate"
description: "Planning-state summary. Implementation has not started; this phase ships the SAFE_LINEAR_560 contract, preflight rubric, deterministic gate, and one failure-only repair pass in a later code phase."
trigger_phrases:
  - "spatial contract and gate"
  - "implementation summary"
  - "SAFE_LINEAR_560"
  - "deterministic gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/001-spatial-contract-and-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 planning docs for phase 001"
    next_safe_action: "Begin Phase 1 Setup and pin the headless-render engine"
    blockers: []
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: spatial-contract-and-gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-spatial-contract-and-gate |
| **Completed** | Not yet (planning only) |
| **Level** | 2 |
| **Status** | Not Started |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This document is a planning placeholder so the Level 2 packet is complete; it records the intended deliverables and will be rewritten with measured results after the 45-tile pilot. The phase turns the four worst recurring defects from the 004 run (RC-1 overflow, RC-2 2D collisions, RC-3 title-band breaks, RC-4 casing/glyph drift, RC-5 contrast) from unenforced prose into checkable invariants.

### Planned Deliverables

When implemented, this phase adds the `SAFE_LINEAR_560` hard spatial contract and a reason-then-build preflight to the generator, a deterministic headless gate that measures every tile and emits per-tile failure JSON, and one failure-only repair pass. The gate doubles as the measurement surface that phases 002-006 read.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs` | Modified (planned) | Add `a1Block()` contract + preflight, arm output isolation, repair call |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/a1-gate.mjs` | Created (planned) | Deterministic DOM/CSS gate emitting per-tile failure JSON |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/a1-repair.mjs` | Created (planned) | One-shot failure-only repair driver |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/contrast.mjs` | Created (planned) | Computed-CSS contrast helper with as-text vs as-fill distinction |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The plan runs a paired A/B (control, a1_prompt, a1_gate_repair) across all 45 cells, then measures SHIP rate, diagram-vs-linear delta, and contrast exit-0 against the 60% / ~41-pt baseline before claiming any lift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lock the card at 560x480 (`SAFE_LINEAR_560`) | The existing harness renders 560x480; changing size would confound the layout-primitive experiment |
| Make the gate deterministic, not model-judged | GLM emits valid-looking preflight JSON but violates it in HTML; only the rendered DOM is trustworthy |
| Repair only on failure, exactly once | Self-refine on passing tiles wastes calls and risks false-fixes; deeper recovery is deferred to phases 004-005 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate self-test (known-bad fail, known-good pass) | Not run (planning) |
| 45-tile pilot (C0 / T1 / T2) | Not run (planning) |
| SHIP rate / delta / contrast vs baseline | Not measured (planning) |
| `validate.sh --strict` on this packet | See checklist; planning docs authored |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning artifact only.** No code exists yet; every result row above is pending the later implementation phase.
2. **2D recovery is partial here.** This phase reduces 2D exposure via primitive caps and the gate, but full coordinate-skeleton recovery is phase 004.
3. **Card size is fixed at 560x480.** Retargeting the production 480x480 size is an open question deferred to phase 006.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Planning-state placeholder so the Level 2 packet is complete
- Rewrite with measured deltas after the 45-tile pilot
- No completion claims: status is Not Started
-->
