---
title: "Tasks: 027/005 Skill Advisor First-Action Mandate"
description: "Task list for render-layer mandate wording, uncertainty guardrails, fallback hints, and fixture migration."
trigger_phrases:
  - "027 004 advisor mandate tasks"
  - "skill advisor first action tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-skill-advisor-first-action-mandate"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned tasks.md with manifest anchors and pt-02 guardrail amendments"
    next_safe_action: "Implement render-layer guard and mandate wording"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Choose renderer-side uncertainty re-check or producer invariant proof."
    answered_questions:
      - "Scorer source remains out of scope."
---
# Tasks: 027/005 Skill Advisor First-Action Mandate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Choose guard strategy: renderer-side uncertainty re-check or producer invariant fixture.
- [ ] T002 Identify current exact-string fixtures in `render.vitest.ts` and `skill-advisor-brief.vitest.ts`.
- [ ] T003 Define concise action hints and safe fallback text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `FIRST_ACTION_HINT` and `FIRST_ACTION_HINT_FALLBACK` in `skill_advisor/lib/render.ts`.
- [ ] T005 Update ambiguous-path `capText` output to render mandate wording only when confidence and uncertainty pass.
- [ ] T006 Update normal-path `capText` output to render mandate wording only when confidence and uncertainty pass.
- [ ] T007 Route unknown labels to fallback hint, never `undefined`.
- [ ] T008 Preserve scorer internals; add producer-side test only if needed to prove the invariant.
- [ ] T009 Migrate renderer and producer exact-string fixtures to directive-shape assertions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add high-uncertainty `passes_threshold` fixture.
- [ ] T011 Add confidence boundary fixtures for 0.79, 0.80, and 0.81 with uncertainty at and over threshold.
- [ ] T012 Add unknown safe-label fallback fixture.
- [ ] T013 Add longest-label and longest-hint token-cap fixtures.
- [ ] T014 Run `npx vitest run skill_advisor/tests/render.vitest.ts`.
- [ ] T015 Run `npm run check`.
- [ ] T016 Run strict validation for this spec folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Mandate wording renders only for threshold-passing recommendations.
- [ ] Unknown hint labels fall back safely.
- [ ] Existing poisoning, null, freshness, cache, cap, and ambiguous-output coverage remains.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research**: `../research/027-xce-research-based-refinement-pt-02/research.md`
<!-- /ANCHOR:cross-refs -->
