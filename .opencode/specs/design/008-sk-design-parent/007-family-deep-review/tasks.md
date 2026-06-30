---
title: "Tasks: Phase 7: family-deep-review"
description: "Executed steps for the sk-design family deep review and remediation. Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design family deep review tasks"
  - "sk-design family remediation steps"
  - "sk-design two-model review tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/007-family-deep-review"
    last_updated_at: "2026-06-25T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the Level-2 task list for the family deep-review and remediation phase"
    next_safe_action: "Validate the 007 docs strict, then resolve the deferred repo-wide derived-sync"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "review/triage-final.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/007-family-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: family-deep-review

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Smoke-check each of the six family skills is review-ready
- [x] T002 [P] Run five Opus 4.8 iterations per skill in skill-target mode (`reviewTargetType=skill`)
- [x] T003 [P] Run five GPT-5.5-fast xhigh iterations per skill in skill-target mode
- [x] T004 Produce the twelve per-skill reports (`review/<skill>/{opus48,gpt55xhigh}/review-report.md`, ~58 iterations total)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Consolidate the twelve reports into `review/triage-final.md` (verdict matrix, Tier-1/Tier-2, themes)
- [x] T006 Verify each single-model (Tier-2) finding at source before fixing (finding = hypothesis)
- [x] T007 [P] Run the per-skill fix agents to remediate confirmed/verified findings (P1/P2/P3/decorative)
- [x] T008 Bump each remediated skill's version and write its dated changelog entry
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `package_skill.py --check` for each of the six skills; confirm PASS
- [x] T010 Run `sk-design-md-generator` typecheck + vitest; confirm 68/68
- [x] T011 Rebuild the advisor and confirm SPEC/DESIGN routing resolves to `sk-design-md-generator`
- [x] T012 Record the deferred repo-wide graph-metadata derived-sync as a known follow-up
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All six skills pass `package_skill.py --check`
- [x] Every confirmed finding remediated; versions bumped and changelogged
- [x] Advisor rebuilt; SPEC/DESIGN routes to `sk-design-md-generator`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Triage**: See `review/triage-final.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
