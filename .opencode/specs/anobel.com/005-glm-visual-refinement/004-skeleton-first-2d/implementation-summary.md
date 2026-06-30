---
title: "Implementation Summary: skeleton-first-2d (geometry kernel)"
description: "Planning-only placeholder. No implementation has started; this records the intended build and the gate that opens it."
trigger_phrases:
  - "skeleton-first 2d summary"
  - "geometry kernel summary"
  - "implementation summary"
  - "impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/004-skeleton-first-2d"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Revised to A7 renderer-first after the 5-model panel"
    next_safe_action: "Run the GLM plan-obedience pilot + verifier re-baseline before any build"
    blockers:
      - "Depends on 001 gate + failure-JSON and 002 primitive routing"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: skeleton-first-2d (geometry kernel)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | anobel.com/005-glm-visual-refinement/004-skeleton-first-2d |
| **Completed** | Not started (planning only) |
| **Level** | 3 |
| **Status** | Pending — awaiting 001 gate + 002 primitive routing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is in planning. The spec, plan, tasks, checklist, and decision record are authored; no code exists. This placeholder will be filled once implementation runs.

The intended build is the geometry kernel: a deterministic skeleton-compute module (`.opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/skeleton/compute-skeleton.mjs`) for 2D-positioned tiles (matrix, node, routing, funnel, popover), a skeleton-to-GLM render contract wired into `.opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/gen-tile.mjs` that forbids model-owned coordinates, a best-of-3 upstream recompute (`skeleton/verify-skeleton.mjs`) on first verifier failure, and a downgrade (`skeleton/downgrade.mjs`) to linear/stacked/compact primitives on second failure. The audit hook lands in `.opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/_audit.mjs`. The target is to close the RC-1/RC-2/RC-3 geometry defects and shrink the ~41-point diagram-vs-linear gap toward 16-23 points.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Delivery is gated on Phase 001 (deterministic gate plus per-tile failure-JSON) and Phase 002 (primitive routing that labels 2D-positioned tiles). The planned task order is in `tasks.md` (T001-T017): freeze the schema, build the skeleton math and preflight, wire the render contract, then add best-of-3 and downgrade, then verify on the 2D holdout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Recorded in `decision-record.md`:
- ADR-001: geometry is computed upstream; GLM is demoted to a renderer.
- ADR-002: best-of-3 is an upstream skeleton recompute, not three GLM calls.
- ADR-003: the skeleton is represented as A7 semantic plan (A5 coords = renderer output), with A7 layout modes used for the downgrade path.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

None performed. Acceptance criteria SC-001 through SC-005 (`spec.md`) and the checklist items (`checklist.md`) remain unverified. Verification will run the 2D holdout with a blind audit and confirm the linear-flow negative control does not regress.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Implementation has not started; all metrics in `spec.md` are predicted, not measured.
- The reserved title-region height (104px vs 112px) is unresolved pending production Dutch copy measurement.
- Whether the deterministic skeleton makes the 005 GPT-5.5 escalation optional is open until the holdout runs.
<!-- /ANCHOR:limitations -->
