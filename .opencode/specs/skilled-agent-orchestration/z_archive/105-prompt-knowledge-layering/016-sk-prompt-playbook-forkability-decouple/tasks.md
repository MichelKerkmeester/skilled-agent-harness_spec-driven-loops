---
title: "Tasks: sk-prompt-playbook-forkability-decouple"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "playbook decouple tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/016-sk-prompt-playbook-forkability-decouple"
    last_updated_at: "2026-06-03T14:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Playbook decoupled from hub + cli; scenarios reframed"
    next_safe_action: "Validate then commit phase 016"
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
# Tasks: sk-prompt-playbook-forkability-decouple

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

- [x] T001 Audit the sk-prompt playbook for references to sk-prompt-models and cli-* skills (read-only)
- [x] T002 Confirm the hub has no playbook (move impractical) and sk-prompt's own docs hold the anchor content
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Reframe `06--escalation-tiers/023-...` to test sk-prompt's inline CLEAR fast path (anchor patterns_evaluation.md)
- [x] T004 Reframe `06--escalation-tiers/024-...` to test escalation to @prompt-improver (anchor SKILL.md §7/§4)
- [x] T005 Repoint/remove hub-card source refs in SP-019, SP-021, SP-025, SP-026
- [x] T006 Root playbook: coverage note, test model, preconditions (§8 fix + card drop), §12 SP-023/024, §15 catalog
- [x] T007 Genericize cli-* mentions in the wave-planning operational rules
- [x] T008 Version bump sk-prompt 2.1.2.0 -> 2.1.3.0 + changelog v2.1.3.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Token grep across the playbook: 0 for sk-prompt-models / cli_prompt_quality_card / cli-*
- [x] T010 [P] All rg targets point only at sk-prompt/; SP-023/024 targets resolve
- [x] T011 [P] validate_document.py VALID on root + 6 feature files
- [x] T012 validate.sh --recursive --strict exit 0; card-sync guard green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
