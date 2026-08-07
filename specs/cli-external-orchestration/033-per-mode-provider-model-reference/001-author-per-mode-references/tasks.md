---
title: "Tasks: Phase 1 — author per-mode providers-and-models references"
description: "Task list for authoring the six per-mode providers-and-models.md catalogs (Complete)."
trigger_phrases:
  - "author per-mode provider model references tasks"
  - "providers-and-models.md task list"
  - "cli catalog authoring tasks"
  - "per-mode model catalog tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference/001-author-per-mode-references"
    last_updated_at: "2026-07-29T09:18:33Z"
    last_updated_by: "implementer"
    recent_action: "Authored six per-mode providers-and-models.md catalogs"
    next_safe_action: "Register the new leaves and wire pointers (phase 002)"
    blockers: []
    key_files:
      - "cli-opencode/references/providers-and-models.md"
      - "cli-codex/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-033-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — author per-mode providers-and-models references

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

- [x] T001 Read the reference-file template (`sk-doc/create-skill/assets/skill/skill-reference-template.md`)
- [x] T002 Read each mode's `cli-reference.md` model section + `SKILL.md` roster for exact model ids
- [x] T003 [P] Confirm external authority paths resolve (`model-profiles.json`, `executor-config.ts`, `fanout-run.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `cli-opencode/references/providers-and-models.md` as the golden exemplar (deepseek default + kimi/glm/minimax/xiaomi/GPT-5.6)
- [x] T005 [P] Author `cli-claude-code` (Anthropic + `--effort`) and `cli-codex` (GPT-5.5/5.6 + `-c model_reasoning_effort=` ladder)
- [x] T006 [P] Author `cli-cursor` (Composer + inline enforced 10-id allowlist) and `cli-devin` (adaptive + sub-model roster)
- [x] T007 Author `cli-pi` (multi-provider passthrough + `--thinking`, no fabricated default); link external authorities, never copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify 5-field frontmatter + uniform 7-section structure across all six files — [evidence: 6/6 `providers-and-models.md` PASS frontmatter + uniform 7-section structure]
- [x] T009 Verify relative `.md` links and external authority paths resolve (stray `dispatch-model.cjs` mention removed)
- [x] T010 Run `validate.sh 001-author-per-mode-references --strict` — Errors: 0
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

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
