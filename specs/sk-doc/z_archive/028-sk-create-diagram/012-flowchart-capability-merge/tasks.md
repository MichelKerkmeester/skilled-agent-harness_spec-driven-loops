---
title: "Tasks: sk-create-diagram flowchart capability merge"
description: "Task queue for the flowchart-into-diagram capability merge."
trigger_phrases:
  - "diagram flowchart merge tasks"
importance_tier: "important"
contextType: "planning"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/012-flowchart-capability-merge"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue"
    next_safe_action: "Resolve T004/T006 blockers, then rerun strict gates"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram flowchart capability merge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Map both skills' file trees, hub registry shapes, and command surface; author `decision-record.md` [EVIDENCE: full tree diff of both skills, `hub-router.json`/`mode-registry.json` schema inspection, command file inventory.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Dispatch the merge build to GPT-5.6-luna-fast (max) [EVIDENCE: implementation executed in this dispatch against decision-record.md D1-D5.]
- [x] T003 Independently verify: 9 ported files, SKILL.md format dial, hub JSON validity, flowchart redirect, command wiring [EVIDENCE: `SKILL.md` and `.opencode/skills/sk-doc/hub-router.json:1` checks passed; byte-identity checks and JSON/YAML parses also passed.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run `validate_skill_package.py --strict` [EVIDENCE: requested path `.opencode/skills/sk-doc/shared/scripts/validate_skill_package.py` is absent; available `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` returned `PASS (exit 0)` in the final worktree state.]
- [x] T005 Smoke-test `validate-flowchart.sh` from its new location [EVIDENCE: exits 0 with one warning on simple-workflow.md.]
- [B] T006 Run packet-wide `validate.sh --recursive --strict` [EVIDENCE: child packet `012-flowchart-capability-merge` passes strict validation; parent scan remains blocked by existing phase-link/content/child-drift warnings and template/anchor failures in phases `010-benchmark-artifact-embedding` and `011-reference-template-alignment`.]
- [x] T007 Write `implementation-summary.md` [EVIDENCE: implementation-summary.md added with verification results and blockers.]
- [x] T008 Write `checklist.md` [EVIDENCE: checklist.md added with P0/P1 evidence and open blockers.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required tasks marked [x]
- [ ] No [B] tasks remain
- [ ] All gates clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
