---
title: "Tasks: doc-divider-sweep-and-sk-prompt-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "divider sweep tasks"
  - "name"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/014-doc-divider-sweep-and-sk-prompt-cleanup"
    last_updated_at: "2026-06-03T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dividers applied + verified; sk-prompt SKILL.md scrubbed"
    next_safe_action: "Validate then commit phase 014"
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
# Tasks: doc-divider-sweep-and-sk-prompt-cleanup

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

- [x] T001 Scout the 5 cli skills' `references/`+`assets/` for H2 divider gaps (`/tmp/divider_scout.py`)
- [x] T002 Confirm the sk-doc divider rule against `sk-prompt-models/assets/cli_prompt_quality_card.md` and `sk-doc/assets/template_rules.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dry-run the fence-aware fixer and audit all 188 insertion points (`/tmp/divider_fix.py`)
- [x] T004 Apply dividers to the 22 clean cli reference/asset docs
- [x] T005 Reword §1 prose card mention in `sk-prompt/SKILL.md`
- [x] T006 Remove broken Core-References card link + §8 FAST-PATH ASSET section; renumber §9/§10 → §8/§9; drop card from §9 resource list (`sk-prompt/SKILL.md`)
- [x] T007 Bump `sk-prompt` version 2.1.0.0 → 2.1.1.0 and add `changelog/v2.1.1.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-scout the 5 cli skills: 0 gaps
- [x] T009 Content-skeleton diff vs HEAD: clean for the 22 swept files; isolate the 3 pre-existing-WIP files
- [x] T010 [P] Adversarial `verify-cli-dividers` workflow: PASS for all 5 skills
- [x] T011 `validate.sh --recursive --strict` on the 130 parent exit 0; card-sync guard green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed (scout, skeleton diff, workflow, validate --strict)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
