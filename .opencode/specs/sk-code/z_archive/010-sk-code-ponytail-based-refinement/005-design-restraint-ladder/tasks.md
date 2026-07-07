---
title: "Tasks: Phase 5 — Design Restraint Ladder"
description: "Task breakdown for the pre-write Design Restraint Ladder + integration proof."
trigger_phrases:
  - "phase 5 tasks design restraint ladder"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/005-design-restraint-ladder
    last_updated_at: 2026-06-13T17:10:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 5 implemented + verified; router-sync guard green"
    next_safe_action: "/speckit:plan Phase 6 (optional)"
---
# Tasks: Phase 5 — Design Restraint Ladder

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` pending.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm `code_quality_standards.md` is in DEFAULT_RESOURCE and NOT a RESOURCE_MAP intent key (subsection adds no routable entry).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add `### Design Restraint Ladder (pre-write)` (~13 lines) in code_quality_standards.md §1 — post-read, surface-flavored rungs; YAGNI routes through scope-amendment; explicit "does not change surface precedence or the Iron Law"; cross-ref CLAUDE.md anti-patterns.
- [x] T-003 Augment the `0 -> 1` transition in phase_detection.md (implementation-intent gated).
- [x] T-004 Augment the Phase 1 Requirement cell in the SKILL.md Phase Overview (no new phase row).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-005 `verify_alignment_drift.py` → exit 0.
- [x] T-006 INTEGRATION PROOF: `sk-code-router-sync.vitest.ts` → 4/4 pass (orchestrator-run).
- [x] T-007 Surface precedence / detection logic untouched (grep proof); scope = the 3 edited files only.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Ladder present in the always-loaded doc; transition + Phase 1 row augmented; no new route.
- [x] Router-sync guard green; surface precedence + Iron Law preserved.
- [x] Alignment-drift clean; scope clean.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Summary: `implementation-summary.md`
- Research: `../research/research.md` (rec #1; round-2 risk note) · Guard: `deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts`

<!-- /ANCHOR:cross-refs -->
