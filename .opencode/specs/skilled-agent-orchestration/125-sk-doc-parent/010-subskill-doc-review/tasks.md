---
title: "Tasks: Sub-skill doc template-alignment + 4-iteration GPT deep review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc subskill doc review tasks"
  - "125 sk-doc phase 010 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-010 tasks"
    next_safe_action: "Run T003-T008 (remaining review iterations)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Tasks: Sub-skill doc template-alignment + 4-iteration GPT deep review

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the template-type validator's 0-blocking result is recorded for all 10 packets (`.opencode/skills/sk-doc/shared/scripts/`)
- [ ] T002 Confirm each packet's review lineage is scaffolded (`010-subskill-doc-review/00N-<packet>/review/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 create-readme: run iteration 4 (`010-subskill-doc-review/002-create-readme/review/`)
- [ ] T004 create-agent: run iteration 4 (`010-subskill-doc-review/003-create-agent/review/`)
- [ ] T005 [P] create-feature-catalog: run iterations 1-4 (`010-subskill-doc-review/005-create-feature-catalog/review/`)
- [ ] T006 [P] create-benchmark: run iterations 1-4 (`010-subskill-doc-review/007-create-benchmark/review/`)
- [ ] T007 [P] create-flowchart: run iterations 1-4 (`010-subskill-doc-review/008-create-flowchart/review/`)
- [ ] T008 [P] doc-quality: run iterations 1-4 (`010-subskill-doc-review/010-doc-quality/review/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Apply accepted P0/P1 findings across all 10 packets
- [ ] T010 Fresh-Sonnet verification pass per packet
- [ ] T011 Record the final verdict per packet in `deep-review-state.jsonl`
- [ ] T012 Re-run the template-type validator on every touched packet post-fix
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 10 review lineages show 4/4 iterations with a recorded final verdict
- [ ] Zero open P0 findings across all packets
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
