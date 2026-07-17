---
title: "Tasks: Skill gate (032 phase 012)"
description: "Task breakdown for Skill gate in the 032 sk-design naming subtree."
trigger_phrases:
  - "skill-gate tasks"
  - "sk-design skill gate execution"
  - "032 skill-gate checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate tasks"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill gate (032 phase 012)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|-------|-------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence source)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Confirm the pinned BASE and clean isolated worktree for skill gate.
- [ ] T002 [P] Read the canonical convention/exemption boundary and freeze the phase-owned inventory.
- [ ] T003 [P] Load sibling checklists, evidence reports, and their candidate/base fingerprints.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Check phases 001–011 for complete checklists, pinned evidence, and consistent completion state.
- [ ] T005 Inventory every path under .opencode/skills/sk-design and classify all underscore-bearing names.
- [ ] T006 Sweep Markdown/data/shell path consumers and verify the full surface is clean outside exemptions.
- [ ] T007 Record any missing evidence or unknown candidate as a blocking failure.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify every sibling P0/P1 checklist item and evidence report is present and passing.
- [ ] T009 Verify zero in-scope snake_case filesystem names and zero unknown classifications.
- [ ] T010 Verify zero stale/broken path references and no prohibited semantic/key/Python/tool rename.
- [ ] T011 Publish the read-only rollup verdict for the parent packet.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete with evidence.
- [ ] All requirements in spec.md are satisfied or explicitly blocked.
- [ ] The phase checklist has no unresolved P0 item and no unapproved P1 deferral.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
