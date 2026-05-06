---
title: "Tasks: Skill Description Budget Trim"
description: "Mechanical trim tasks for 16 skill + 20 command frontmatter descriptions across the project."
trigger_phrases:
  - "tasks"
  - "trim"
  - "skill description"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/083-skill-description-budget-trim"
    last_updated_at: "2026-05-06T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 13 tasks complete (T001–T013)"
    next_safe_action: "Memory save via generate-context.js"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-083"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Description Budget Trim

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

- [x] T001 Audit current description-byte totals (skill + command)
- [x] T002 Calculate per-file trim targets (≤130 skill / ≤110 command)
- [x] T003 Scaffold spec folder (`spec.md`, `plan.md`, `tasks.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Trim 16 SKILL.md descriptions (`/tmp/trim-skill-descriptions.py`)
- [x] T005 [P] Trim 20 command descriptions (`/tmp/trim-command-descriptions.py`)
- [x] T006 Skip 3 already-short commands (`memory/learn`, `memory/save`, `agent_router`)
- [x] T007 Revert `SLASH_COMMAND_TOOL_CHAR_BUDGET` env var so default 8,000 governs (`~/.claude/settings.json`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run audit; confirm `TOTAL ≤ 5,600 chars`
- [x] T009 Confirm harness reminder shows all 49 visible skills with trimmed descriptions
- [x] T010 Spot-check 3 trimmed descriptions retain primary keyword (sk-prompt, sk-code, doctor:code-graph)
- [x] T011 Run `validate.sh --strict`
- [x] T012 Write `implementation-summary.md`
- [x] T013 Save context via `generate-context.js`

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Audit confirms ≤5,600 chars total

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
