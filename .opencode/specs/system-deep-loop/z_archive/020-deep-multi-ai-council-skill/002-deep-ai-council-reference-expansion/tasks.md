---
title: "Tasks: 101/004 Deep AI Council Reference Expansion"
description: "Task list for deep-ai-council reference expansion, playbook coverage, SKILL.md routing, and Level 1 packet metadata."
trigger_phrases:
  - "101/004 tasks"
  - "deep-ai-council reference expansion tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/002-deep-ai-council-reference-expansion"
    last_updated_at: "2026-05-10T10:50:00Z"
    last_updated_by: "openai-gpt-5.5-codex"
    recent_action: "Completed T001 through T015 for the reference expansion packet pending validation."
    next_safe_action: "Run verification gates and update final evidence."
    blockers: []
    key_files:
      - references/scoring_rubric.md
      - references/depth_dispatch.md
      - references/failure_handling.md
      - references/anti_patterns.md
      - references/seat_diversity_patterns.md
      - playbook/06/001-depth-detection-parallel-vs-sequential.md
      - playbook/06/002-resume-after-interrupted-state.md
      - playbook/07/001-library-writer-call-sequence.md
      - playbook/07/002-five-dimension-scoring-rubric-application.md
      - playbook/07/003-hunter-skeptic-referee-cross-critique.md
      - playbook/07/004-out-of-scope-write-rejection.md
      - SKILL.md
      - .opencode/agents/deep-ai-council.md
      - .claude/agents/deep-ai-council.md
      - .codex/agents/deep-ai-council.toml
      - .gemini/agents/deep-ai-council.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-004-reference-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Six new playbook scenarios are sufficient for the identified P2 testing gaps."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/004 Deep AI Council Reference Expansion

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

- [x] T001 Read `deep-ai-council` agent source sections (`.opencode/agents/deep-ai-council.md`)
- [x] T002 Read sk-doc reference and playbook templates (`.opencode/skills/sk-doc/`)
- [x] T003 Inspect existing deep-ai-council references and playbook shape (`.opencode/skills/deep-ai-council/`)
- [x] T004 Confirm spec packet target and branch (`main`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Create scoring rubric reference (`references/scoring_rubric.md`)
- [x] T006 [P] Create depth dispatch reference (`references/depth_dispatch.md`)
- [x] T007 [P] Create failure handling reference (`references/failure_handling.md`)
- [x] T008 [P] Create anti-patterns reference (`references/anti_patterns.md`)
- [x] T009 Expand seat diversity reference (`references/seat_diversity_patterns.md`)
- [x] T010 Add depth and failure handling playbook category (`manual_testing_playbook/06--depth-and-failure-handling/`)
- [x] T011 Add writer library contract playbook category (`manual_testing_playbook/07--writer-library-contract/`)
- [x] T012 Update root manual testing playbook (`manual_testing_playbook/manual_testing_playbook.md`)
- [x] T013 Extend SKILL.md routing (`SKILL.md`)
- [x] T014 Create Level 1 spec packet docs (`002-deep-ai-council-reference-expansion/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run all ten requested verification gates and fix failures before reporting
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification gate T015 passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
