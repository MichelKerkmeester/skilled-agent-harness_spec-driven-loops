---
title: "Tasks: sk-vision 010 quality gate"
description: "Executable tasks for the quality gate child."
trigger_phrases:
  - "sk-vision 010 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/010-quality-gate"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 010 task list."
    next_safe_action: "Complete T001-T012 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-010-quality-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 010 quality gate

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

- [ ] T001 Confirm 006-009 folders exist with their gate targets on disk
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Run `ci-skill-root-metadata.cjs` (fleet) — record output
- [ ] T003 Run `validate_skill_package.py` + `package_skill.py --check` — record output
- [ ] T004 Run `validate_document.py` on SKILL.md, README, references/runtime-reference.md, catalog root + 16 leaves, playbook root — record outputs
- [ ] T005 Run `validate_catalog_package.cjs` + `validate-playbook-package.cjs` — record outputs
- [ ] T006 Run `extract_structure.py` on SKILL.md (DQI) — record score
- [ ] T007 Run `bun run build && bun test` in vision-runtime — record output
- [ ] T008 Run advisor smoke (`advisor_recommend --warm-only`) — record result or cold-daemon note
- [ ] T009 Reconcile metadata: 002-001 `completion_pct` → 100; parent `last_active_child_id` → current; refresh description/graph via generate-context.js if available
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run parent `validate.sh --recursive --strict` — record output
- [ ] T011 Final sweep: no `.venv`, no temp/bak files, no hub JSON on skill root, `context/` diff empty; run `validate.sh --strict` on this child
- [ ] T012 All tasks marked `[x]` with evidence; no `[B]` remaining
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
