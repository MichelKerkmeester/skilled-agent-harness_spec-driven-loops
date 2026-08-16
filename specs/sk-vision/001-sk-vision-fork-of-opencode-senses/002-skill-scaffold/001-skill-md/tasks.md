---
title: "Tasks: sk-vision SKILL.md"
description: "Executable tasks for sk-vision SKILL.md."
trigger_phrases:
  - "sk-vision skill md"
  - "sk-vision when to use"
  - "sk-vision reserved paths"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/001-skill-md"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-002-skill-scaffold-001-skill-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision SKILL.md

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm 001-research is Complete (`specs/sk-vision/001-sk-vision-fork-of-opencode-senses/001-research/`) — evidence: `001-research/spec.md` Status Complete
- [x] T002 Create skill directories (`.opencode/skills/sk-vision/references/`) — evidence: `mkdir -p` exit 0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write SKILL.md from File 1 skeleton (`.opencode/skills/sk-vision/SKILL.md`) — evidence: file exists, 86 lines, verbatim from spec.md File 1
- [x] T004 Add references stub (`.opencode/skills/sk-vision/references/.gitkeep`) — evidence: `test -f` exit 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Prove SKILL.md and .gitkeep exist — evidence: `test -f` both exit 0
- [x] T006 Confirm vision-runtime absent and no sk_vision_query — evidence: `test ! -e vision-runtime` exit 0; `sk_vision_query` only in WHEN NOT TO USE prose (expected)
- [x] T007 Run validate.sh --strict on this child — evidence: RESULT PASSED errors=0 warnings=0; process exit 2 from repo-wide COMMAND_TREE_PARITY only
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
