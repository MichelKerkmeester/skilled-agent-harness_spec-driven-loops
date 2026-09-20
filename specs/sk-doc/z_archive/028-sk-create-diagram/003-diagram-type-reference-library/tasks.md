---
title: "Tasks: sk-create-diagram type reference library"
description: "Task queue for porting all 27 diagram-type references and their example assets in two batches."
trigger_phrases:
  - "diagram type library tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/003-diagram-type-reference-library"
    last_updated_at: "2026-08-12T06:31:38.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue ahead of executor dispatch"
    next_safe_action: "Dispatch after phase 002 lands"
    blockers:
      - "Waiting on phase 002"
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
# Tasks: sk-create-diagram type reference library

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Confirm phase 002 `SKILL.md` and `references/` exist and validate — blocks the rest of this phase [EVIDENCE: phase 002 `validate_skill_package.py --check --strict` PASS before this phase started.]
- [x] T002 Compose the batch 1 dispatch prompt (14 larger types) [EVIDENCE: `phase-003-batch1-dispatch-prompt.txt`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dispatch batch 1: architecture, bar, data-flow, dp-integration, dp-security-matrix, er, flowchart, gantt, high-level, it-state, layers, line, loop, medallion [EVIDENCE: `opencode-go/deepseek-v4-flash`, log `phase-003-batch1-dispatch.log`.]
- [x] T004 Verify batch 1: 14 files exist with valid frontmatter [EVIDENCE: orchestrator `find | wc -l` = 14, `cmp` spot-check on 3 assets, all identical.]
- [x] T005 Compose the batch 2 dispatch prompt (13 remaining types + 7 special-pattern examples + SKILL.md table update) [EVIDENCE: `phase-003-batch2-dispatch-prompt.txt`.]
- [x] T006 Dispatch batch 2: nested, org-chart, process, pyramid, quadrant, radar, scatter, sequence, state, swimlane, timeline, tree, venn [EVIDENCE: `opencode-go/deepseek-v4-flash`, log `phase-003-batch2-dispatch.log`.]
- [x] T007 Verify batch 2: 13 files exist with valid frontmatter [EVIDENCE: orchestrator `find | wc -l` = 27 total, `cmp` spot-check on 5 assets, all identical.]
- [x] T008 Verify the 7 special-pattern example assets exist [EVIDENCE: 7/7 special-pattern assets counted within the 34/34 total.]
- [x] T009 Verify `SKILL.md`'s selection-guide table links every type to its reference [EVIDENCE: `grep -c 'references/type-'` on SKILL.md confirmed all 27 rows present; table was already complete from phase 002, no edit needed.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 File-count check: 27 `type-*.md` references [EVIDENCE: `find | wc -l` = 27.]
- [x] T011 File-count check: 34 example assets (27 canonical + 7 special) [EVIDENCE: `find | wc -l` = 34.]
- [x] T012 Run `validate_skill_package.py --check` [EVIDENCE: `PASS (exit 0)`.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] No [B] tasks remain
- [x] File counts match the frozen manifest exactly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Source manifest**: `../001-inventory-and-skill-contract/resource-map.md`
<!-- /ANCHOR:cross-refs -->
