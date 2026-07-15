---
title: "Tasks: card-relocation-and-guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "card relocation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/013-card-relocation-and-guard"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 013 task list"
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
# Tasks: card-relocation-and-guard

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

- [x] T001 Map inbound refs (~15), the card's outbound links, the guard's canonical path, sk-prompt graph-metadata card refs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 git mv cli_prompt_quality_card.md from sk-prompt to the hub (sk-prompt-models/assets/)
- [x] T003 Repoint 11 cli-* consumer refs (sibling path swap)
- [x] T004 Hub SKILL.md §5 reference → local `./assets/`
- [x] T005 Fix the card's own outbound links (framework defs → `../../sk-prompt/references/`)
- [x] T006 Clean sk-prompt/graph-metadata.json of the card (enhance_when, key_files, entities, source_docs)
- [x] T007 Update the guard's canonical-path comment (check-prompt-quality-card-sync.sh)
- [x] T008 Version bumps + changelogs (sk-prompt 2.1.0.0, hub 0.7.2.0, advisor 0.6.0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 guard green; no active file references the old sk-prompt card path; card + links resolve
- [x] T010 sk-prompt/graph-metadata.json valid + card-free; git tracks the card as a rename
- [ ] T011 validate.sh --recursive --strict exit 0; commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Card relocated + all refs repointed + guard green
- [ ] validate --strict exit 0 + committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Guard**: `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`
<!-- /ANCHOR:cross-refs -->
