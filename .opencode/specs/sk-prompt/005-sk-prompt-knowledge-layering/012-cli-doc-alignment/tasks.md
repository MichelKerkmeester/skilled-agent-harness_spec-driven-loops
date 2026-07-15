---
title: "Tasks: cli-doc-alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli doc alignment tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/012-cli-doc-alignment"
    last_updated_at: "2026-06-03T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 012 task list"
    next_safe_action: "Validate then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-doc-alignment

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

- [x] T001 Survey the 9 cli-* docs' current H2 structure; read the sk-doc asset + reference templates
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Align 5 cli-* prompt_quality_card.md to the asset template (delegated, verified)
- [x] T003 [P] Align confidence-scoring-rubric.md + 3 cli-opencode references; scrub ephemeral spec refs (delegated, verified)
- [x] T004 Genericize the lone glob-example spec path in permissions-matrix
- [x] T005 Version bumps + changelogs for cli-{opencode,gemini,devin,codex,claude-code}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 All 9 docs open with `## 1. OVERVIEW`; guard green; no framework/CLEAR table inlined
- [x] T007 No ephemeral spec/phase refs in the 9 docs
- [ ] T008 validate.sh --recursive --strict exit 0; scoped commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 9 docs aligned + scrubbed
- [ ] validate --strict exit 0 + committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Templates**: `sk-doc/assets/skill/{skill_asset,skill_reference}_template.md`
<!-- /ANCHOR:cross-refs -->
