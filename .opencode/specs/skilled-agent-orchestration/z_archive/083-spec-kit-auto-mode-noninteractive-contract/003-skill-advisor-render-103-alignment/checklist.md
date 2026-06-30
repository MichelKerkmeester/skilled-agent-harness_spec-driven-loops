---
title: "Verification Checklist: 103/003 Skill Advisor Render-Layer 103 Alignment"
description: "Level 1 acceptance checklist for render-layer mandate wording under the 103 noninteractive contract."
trigger_phrases:
  - "103 phase 003"
  - "skill advisor render 103 alignment"
  - "render.ts MUST invoke FIRST"
  - "advisor first-action under 103 contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Verify render wording, threshold gate, fallback hint, cap safety, and scorer no-diff"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-103-003-skill-advisor-render-103-alignment-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 103/003 Skill Advisor Render-Layer 103 Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `render.ts` read before editing.
- [ ] CHK-002 [P0] Existing render tests read before fixture changes.
- [ ] CHK-003 [P1] Current skill labels inventoried.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Mandate wording emitted only after `passes_threshold === true`.
- [ ] CHK-011 [P0] `render.ts:124-133` threshold gate preserved.
- [ ] CHK-012 [P0] `lib/scorer/` has no diff.
- [ ] CHK-013 [P1] Unknown/future labels use safe fallback hint.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Passing recommendation fixture contains `MUST invoke`.
- [ ] CHK-021 [P0] Below-threshold fixture does not contain `MUST invoke`.
- [ ] CHK-022 [P0] High-uncertainty or non-passing fixture does not contain mandate wording.
- [ ] CHK-023 [P1] Long label/hint fixture remains capped by existing render cap.
- [ ] CHK-024 [P1] Unknown label fixture renders fallback hint, not `undefined`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] `spec.md`, `plan.md`, and `tasks.md` stay synchronized.
- [ ] CHK-031 [P1] `implementation-summary.md` records test evidence after implementation.
- [ ] CHK-032 [P1] 027/005 remains cancelled and points to this packet as the implementation home.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-11
<!-- /ANCHOR:summary -->
