---
title: "Tasks: A10 Per-Surface Gates [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "per-surface gates tasks"
  - "skill-doc frontmatter gate"
  - "route-validate generalization"
  - "workflow yaml schema gate"
  - "trigger vocabulary canary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/010-a10-per-surface-gates"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown from plan"
    next_safe_action: "Author checklist and impl scaffold"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-tasks-010-a10-per-surface-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A10 Per-Surface Gates

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Read the shipped route-validate assertion harness (`.opencode/commands/doctor/scripts/route-validate.py`)
- [ ] T002 Read the advisor rebuild and validate contracts (`.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-rebuild.ts`)
- [ ] T003 [P] Confirm the warn-tier entry shape (`.opencode/skills/system-spec-kit/scripts/validation/validator-registry.json`)
- [ ] T004 Resolve the canonical SKILL.md version grammar with the operator (`vX.Y` versus `version: N`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Build the SKILL.md frontmatter grammar and uniformity detector (`.opencode/skills/system-spec-kit/scripts/validation/`)
- [ ] T006 [P] Build the workflow-YAML schema detector (`.opencode/skills/system-spec-kit/scripts/validation/`)
- [ ] T007 Generalize route-validate assertions D, E, F across all 28 command docs (`.opencode/commands/doctor/scripts/route-validate.py`)
- [ ] T008 Wire advisor_rebuild to advisor_validate as a check tier (`.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-rebuild.ts`)
- [ ] T009 Build the triple-copy trigger-vocabulary canary across the three hand-synced copies
- [ ] T010 Register all five gates as default-off warn-tier entries (`.opencode/skills/system-spec-kit/scripts/validation/validator-registry.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run each detector over its target corpus and confirm warn-tier non-blocking
- [ ] T012 Mutate one canary copy and confirm a drift finding
- [ ] T013 Update spec, plan, and tasks
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
