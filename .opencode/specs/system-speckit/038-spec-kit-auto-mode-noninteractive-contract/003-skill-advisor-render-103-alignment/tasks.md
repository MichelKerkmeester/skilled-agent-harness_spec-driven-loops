---
title: "Tasks: 103/003 Skill Advisor Render-Layer 103 Alignment"
description: "Task list for render-layer FIRST_ACTION_HINT and MUST invoke FIRST wording under the 103 noninteractive contract."
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
    next_safe_action: "Execute T001 through T009 without modifying scorer files"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-103-003-skill-advisor-render-103-alignment-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 103/003 Skill Advisor Render-Layer 103 Alignment

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

- [ ] T001 Read `mcp_server/skill_advisor/lib/render.ts`.
- [ ] T002 Read existing render tests and identify old "use ${label}" fixtures.
- [ ] T003 Inventory currently shipped skill labels for `FIRST_ACTION_HINT`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `FIRST_ACTION_HINT` and fallback hint to `render.ts`.
- [ ] T005 Change only the passing recommendation render path to `MUST invoke ${label} FIRST — ${action_hint}`.
- [ ] T006 Preserve threshold logic at `render.ts:124-133` and avoid any edit under `lib/scorer/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Update render tests for mandate wording, non-passing behavior, fallback hint, and cap safety.
- [ ] T008 Run focused skill advisor render tests.
- [ ] T009 Verify `git diff -- mcp_server/skill_advisor/lib/scorer` is empty.
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Passing threshold output uses 103-owned mandate vocabulary.
- [ ] Non-passing output does not overstate confidence.
- [ ] All currently shipped skills have first-action hints or safe fallback coverage.
- [ ] Scorer files are untouched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Absorbed Source**: `../../../system-spec-kit/027-xce-research-based-refinement/005-skill-advisor-first-action-mandate/spec.md`
- **pt-04 Audit**: `../../../system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-04/research.md`
<!-- /ANCHOR:cross-refs -->
