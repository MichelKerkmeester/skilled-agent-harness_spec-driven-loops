---
title: "Tasks: cross-skill propagation"
description: "Phase E task list."
trigger_phrases: ["cross-skill propagation tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/006-budget-pattern-propagation"
    last_updated_at: "2026-05-18T15:04:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 tasks.md"
    next_safe_action: "Author 006 checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000027"
      session_id: "114-006-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: cross-skill propagation

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> cli-opencode mirror.

- [x] T001 Create cli-opencode/references/context-budget.md (sentinel pointer at cli-devin canonical doc) — `.opencode/skills/cli-opencode/references/context-budget.md` created, 54 LOC
- [x] T002 Check if cli-opencode/assets/prompt_templates.md exists; if yes add truncation marker syntax — file exists and Template 1 now includes `[... truncated N tokens]`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> sk-prompt update.

- [x] T003 Update sk-prompt/assets/cli_prompt_quality_card.md §3 with "Budget Awareness" subsection — subsection added after model-profile pointer
- [x] T004 Verify subsection cites Phase C cli-devin source-of-truth — cites `cli-devin/references/context-budget.md` and `sk-prompt/assets/model-profiles.json`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Cross-references.

- [x] T005 Update sk-small-model/references/pattern-index.md with 2 new rows — cli-opencode row marked shipped and sk-prompt budget awareness row added
- [x] T006 Verify all cross-references resolve (no broken links) — `/tmp/phase-006-xrefs.log`
- [x] T007 Update implementation-summary.md — implementation-summary updated with built/how/decisions/verification/limitations
- [x] T008 Memory continuity update — implementation-summary frontmatter continuity updated
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001-T008 marked [x]
- [x] All P0 requirements verified (3/3)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Source-of-truth**: `../004-cli-devin-quality/` (Phase C reference docs)
<!-- /ANCHOR:cross-refs -->
