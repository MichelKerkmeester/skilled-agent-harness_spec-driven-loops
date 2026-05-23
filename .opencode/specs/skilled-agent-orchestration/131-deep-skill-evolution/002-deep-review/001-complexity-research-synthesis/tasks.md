---
title: "Tasks: Deep Review Complexity Research"
description: "Task list for the Level 3 evidence-only research packet comparing deep-review depth against focused deep-research bug finding."
trigger_phrases:
  - "deep-review complexity tasks"
  - "deep-review research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/001-complexity-research-synthesis"
    last_updated_at: "2026-05-22T08:35:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed 15 research iterations and expanded synthesis"
    next_safe_action: "Use research recommendations to scope a follow-up implementation packet"
    blockers: []
    key_files:
      - "tasks.md"
      - "research/iterations/"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "116-deep-review-complexity-auto-research"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep Review Complexity Research

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Use existing packet folder selected by the user (`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/`)
- [x] T002 Replace scaffold placeholders in `spec.md`
- [x] T003 Replace scaffold placeholders in `plan.md`
- [x] T004 Refresh `description.json` and `graph-metadata.json`
- [x] T005 Run strict spec validation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Initialize `research/deep-research-config.json` with `cli-codex`, `gpt-5.5`, `high`, `fast`
- [x] T007 Create strategy, state log, prompt, iteration, and delta directories
- [x] T008 Run iteration 001 and validate artifacts
- [x] T009 Run iteration 002 and validate artifacts
- [x] T010 Run iteration 003 and validate artifacts
- [x] T011 Run iteration 004 and validate artifacts
- [x] T012 Run iteration 005 and validate artifacts
- [x] T013 Run iteration 006 and validate artifacts
- [x] T014 Run iteration 007 and validate artifacts
- [x] T015 Run iteration 008 and validate artifacts
- [x] T016 Run iteration 009 and validate artifacts
- [x] T017 Run iteration 010 and validate artifacts
- [x] T023 Run iteration 011 with `cli-codex`, `gpt-5.5`, `xhigh`, `fast` and validate artifacts
- [x] T024 Run iteration 012 with `cli-codex`, `gpt-5.5`, `xhigh`, `fast` and validate artifacts
- [x] T025 Run iteration 013 with `cli-codex`, `gpt-5.5`, `xhigh`, `fast` and validate artifacts
- [x] T026 Run iteration 014 with `cli-codex`, `gpt-5.5`, `xhigh`, `fast` and validate artifacts
- [x] T027 Run iteration 015 with `cli-codex`, `gpt-5.5`, `xhigh`, `fast` and validate artifacts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Produce `research/research.md` synthesis from all iteration evidence
- [x] T019 Confirm no deep-review implementation files changed
- [x] T020 Run strict spec validation after research artifacts exist
- [x] T021 Index packet docs and research synthesis with Spec Kit Memory
- [x] T022 Present findings and recommendations to the user
- [x] T028 Run strict spec validation after continuation artifacts exist
- [ ] T029 Index continuation-updated packet docs with Spec Kit Memory [B] MCP returned `Not connected`
- [x] T030 Present expanded findings and refined recommendations to the user
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required research artifacts exist and are non-empty
- [x] Every completed iteration has a narrative markdown file, state-log iteration record, and delta iteration record
- [x] Final synthesis ranks findings and recommendations
- [x] No implementation changes are made outside this packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
