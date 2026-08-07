---
title: "Tasks: references + assets lane reorg"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "references-assets-lane-reorg tasks"
  - "lane reorg tasks"
  - "deep-agent-improvement reorg tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/010-reorganize-two-lane-references-assets"
    last_updated_at: "2026-05-29T08:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 010 tasks for references and assets lane reorg"
    next_safe_action: "Run T001 grep inventory of SKILL path literals"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/references"
      - ".opencode/skills/deep-agent-improvement/assets"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-reorganize-two-lane-references-assets"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: references + assets lane reorg

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

- [ ] T001 Capture grep inventory of references/ and assets/ literals (SKILL.md)
- [ ] T002 Confirm lane mapping against the actual file list (plan.md Lane Mapping)
- [ ] T003 [P] Create the three lane subdirs under references/ and assets/
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 git mv model-benchmark + shared references docs into lane subdirs (references/)
- [ ] T005 git mv agent-improvement references docs into lane subdir (references/)
- [ ] T006 git mv benchmark and agent-improvement assets into lane subdirs (assets/)
- [ ] T007 Rewrite all references/ and assets/ path literals (SKILL.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 grep old function-dir + flat-asset literals returns zero (SKILL.md)
- [ ] T009 Read-through resolves every SKILL resource literal to an existing file
- [ ] T010 Refresh skill graph-metadata moved paths (graph-metadata.json)
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
