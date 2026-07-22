---
title: "Tasks: Surgical Fixes to Existing sk-design Modes"
description: "Phase 1 task breakdown for the five surgical Hallmark-adoption heuristic fixes across the sk-design interface, audit, and foundations mode reference trees."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 1 task breakdown (planned)"
    next_safe_action: "Begin Phase 1 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Surgical Fixes to Existing sk-design Modes

<!-- ANCHOR:notation -->
## Task Notation

- Tasks use ID `T00N` in ascending order across all three phases.
- Every task is unchecked (`- [ ]`) because this packet is Planned; none have been executed.
- `[SOURCE: <planned ref>]` names the requirement, spec section, or research pointer that will justify the task at implementation time — it is not yet execution evidence.
- Completion (`- [x]`) is only valid once the task's output exists on disk and its source reference has been verified against it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the exact target reference file per workstream (`design-principles.md`, `redesign-intake.md`, `variation-diversity.md`, `anti-patterns-production.md`, `ai-fingerprint-tells.md`, `ai-slop-check.md`, `audit-contract.md`, `typography-system.md`, `layout-responsive.md`) and record any needed renames. [SOURCE: planned — spec.md §3 Files to Change]
- [ ] T002 Re-read the relevant `014-hallmark-design-skill-research` syntheses per workstream to confirm the grounding cited in spec.md before drafting adapted heuristic text. [SOURCE: planned — ../../014-hallmark-design-skill-research/001-research/research/]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Draft and land the hero/media signature-role decision + deletion test + Tier 0 typography-only pass rule into the interface mode's design-process reference. [SOURCE: planned — REQ-001]
- [ ] T004 Draft and land the multi-page MUST-SHARE/MAY-DIFFER axis table + amend-don't-override rule, including the diversification-rule inversion once a design.md lock exists. [SOURCE: planned — REQ-002]
- [ ] T005 Draft and land the ~7-15 new anti-slop probes with cognitive/perceptual rationale fields, including the AI-nav and AI-footer fingerprint probes, sequenced after the existing 6-axis pre-emit self-critique. [SOURCE: planned — REQ-003]
- [ ] T006 Add the evidence-first P0-P3 severity-model reaffirmation to the audit contract reference, explicitly forbidding an all-or-nothing gate posture. [SOURCE: planned — REQ-004]
- [ ] T007 Draft and land the fallback-font metric-override requirement (`size-adjust`/`ascent-override`/`descent-override`/`line-gap-override`/`font-display: swap`) plus the CLS-score verification requirement into the foundations typography reference. [SOURCE: planned — REQ-005]
- [ ] T008 Draft and land the target-derived responsive proof matrix (320/375/414/768 CSS-px floor, pointer/hover feature queries, clickable-text-never-wraps fix order) into the foundations responsive reference, flagging the orientation/zoom extension as net-new. [SOURCE: planned — REQ-006]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify a Tier 0 (typography-only) hero passes the new deletion test using at least one existing sk-design exemplar. [SOURCE: planned — checklist.md Fix Completeness]
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` against this spec folder and reconcile `checklist.md` evidence before any completion claim. [SOURCE: planned — CLAUDE.md Completion Verification Rule]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All of T001 through T010 are checked with evidence; REQ-001 through REQ-006 in `spec.md` are satisfied; `checklist.md` is fully verified; `validate.sh --strict` reports 0 errors; no new sk-design modes or commands exist on disk.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`, `plan.md`, `checklist.md` (this folder)
- `../spec.md` — parent packet `016-hallmark-adoption`
- `../../014-hallmark-design-skill-research/001-research/research/` — Hallmark adoption research syntheses
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE` — MIT license source
<!-- /ANCHOR:cross-refs -->
