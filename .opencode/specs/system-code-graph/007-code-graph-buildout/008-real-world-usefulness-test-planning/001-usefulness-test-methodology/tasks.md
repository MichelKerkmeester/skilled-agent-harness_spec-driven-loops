---
title: "Tasks: Real-World Usefulness Test"
description: "Scenario, CLI matrix, and analysis task list for the later execution pass."
trigger_phrases:
  - "real-world usefulness tasks"
  - "scenario runtime cells"
  - "026/007/012 tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/001-usefulness-test-methodology"
    last_updated_at: "2026-05-05T00:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored scenario and matrix task list"
    next_safe_action: "Execution pass marks tasks with evidence after user approval"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "026-007-012-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
# Tasks: Real-World Usefulness Test

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
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or scenario id)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create planning scaffold directory (`011-real-world-usefulness-test-planning/`)
- [x] T002 [P] Create Level 2 spec document (`spec.md`)
- [x] T003 [P] Create execution plan (`plan.md`)
- [x] T004 [P] Create task list (`tasks.md`)
- [x] T005 [P] Create execution checklist (`checklist.md`)
- [x] T006 [P] Create methodology ADRs (`decision-record.md`)
- [x] T007 [P] Create placeholder implementation summary (`implementation-summary.md`)
- [x] T008 [P] Create child metadata files (`description.json`, `graph-metadata.json`)
- [x] T009 Update parent metadata to include child (`../graph-metadata.json`)
- [x] T010 Run strict child validation (`validate.sh --strict`)
- [x] T011 Run strict parent validation (`validate.sh --strict`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Major Scenario Tasks

- [ ] T020 Define and execute S-CG-01 caller lookup trials after approval (`S-CG-01`)
- [ ] T021 Define and execute S-CG-02 module touch-map trials after approval (`S-CG-02`)
- [ ] T022 Define and execute S-CG-03 refactor blast-radius preview trials after approval (`S-CG-03`)
- [ ] T023 Define and execute S-CG-04 structural invariant trials after approval (`S-CG-04`)
- [ ] T024 Define and execute S-HK-01 session-prime context trials after approval (`S-HK-01`)
- [ ] T025 Define and execute S-HK-02 skill advisor routing trials after approval (`S-HK-02`)
- [ ] T026 Define and execute S-HK-03 Gate 3 classifier precision trials after approval (`S-HK-03`)
- [ ] T027 Define and execute S-HK-04 compaction recovery trials after approval (`S-HK-04`)
- [ ] T028 Define and execute S-PL-01 startup context runtime trials after approval (`S-PL-01`)
- [ ] T029 Define and execute S-PL-02 in-session memory retrieval trials after approval (`S-PL-02`)
- [ ] T030 Define and execute S-PL-03 external dispatch consistency trials after approval (`S-PL-03`)
- [ ] T031 Define and execute S-PL-04 sk-code routing trials after approval (`S-PL-04`)

### CLI Matrix Cell Tasks

- [ ] T100 [P] Run S-CG-01 on `claude-code-native`
- [ ] T101 [P] Run S-CG-01 on `cli-codex-55-high`
- [ ] T102 [P] Run S-CG-01 on `opencode-native`
- [ ] T103 [P] Run S-CG-01 on `cli-gemini-31-pro`
- [ ] T104 [P] Run S-CG-02 on `claude-code-native`
- [ ] T105 [P] Run S-CG-02 on `cli-codex-55-high`
- [ ] T106 [P] Run S-CG-02 on `opencode-native`
- [ ] T107 [P] Run S-CG-02 on `cli-gemini-31-pro`
- [ ] T108 [P] Run S-CG-03 on `claude-code-native`
- [ ] T109 [P] Run S-CG-03 on `cli-codex-55-high`
- [ ] T110 [P] Run S-CG-03 on `opencode-native`
- [ ] T111 [P] Run S-CG-03 on `cli-claude-code-external`
- [ ] T112 [P] Run S-CG-04 on `claude-code-native`
- [ ] T113 [P] Run S-CG-04 on `cli-codex-55-high`
- [ ] T114 [P] Run S-CG-04 on `opencode-native`
- [ ] T115 [P] Run S-CG-04 on `cli-copilot-default`
- [ ] T116 [P] Run S-HK-01 on `claude-code-native`
- [ ] T117 [P] Run S-HK-01 on `cli-codex-54-medium`
- [ ] T118 [P] Run S-HK-01 on `cli-codex-55-high`
- [ ] T119 [P] Run S-HK-01 on `cli-copilot-default`
- [ ] T120 [P] Run S-HK-01 on `cli-gemini-31-pro`
- [ ] T121 [P] Run S-HK-01 on `cli-claude-code-external`
- [ ] T122 [P] Run S-HK-01 on `opencode-native`
- [ ] T123 [P] Run S-HK-02 on `claude-code-native`
- [ ] T124 [P] Run S-HK-02 on `cli-codex-54-medium`
- [ ] T125 [P] Run S-HK-02 on `cli-codex-55-high`
- [ ] T126 [P] Run S-HK-02 on `cli-copilot-default`
- [ ] T127 [P] Run S-HK-02 on `cli-gemini-31-pro`
- [ ] T128 [P] Run S-HK-02 on `cli-claude-code-external`
- [ ] T129 [P] Run S-HK-02 on `opencode-native`
- [ ] T130 [P] Run S-HK-03 on `claude-code-native`
- [ ] T131 [P] Run S-HK-03 on `cli-codex-55-high`
- [ ] T132 [P] Run S-HK-03 on `cli-copilot-default`
- [ ] T133 [P] Run S-HK-03 on `opencode-native`
- [ ] T134 [P] Run S-HK-04 on `claude-code-native`
- [ ] T135 [P] Run S-HK-04 on `cli-codex-55-high`
- [ ] T136 [P] Run S-HK-04 on `opencode-native`
- [ ] T137 [P] Run S-PL-01 on `claude-code-native`
- [ ] T138 [P] Run S-PL-01 on `cli-codex-54-medium`
- [ ] T139 [P] Run S-PL-01 on `cli-codex-55-high`
- [ ] T140 [P] Run S-PL-01 on `cli-copilot-default`
- [ ] T141 [P] Run S-PL-01 on `cli-gemini-31-pro`
- [ ] T142 [P] Run S-PL-01 on `cli-claude-code-external`
- [ ] T143 [P] Run S-PL-01 on `opencode-native`
- [ ] T144 [P] Run S-PL-02 on `claude-code-native`
- [ ] T145 [P] Run S-PL-02 on `cli-codex-54-medium`
- [ ] T146 [P] Run S-PL-02 on `cli-codex-55-high`
- [ ] T147 [P] Run S-PL-02 on `cli-copilot-default`
- [ ] T148 [P] Run S-PL-02 on `cli-gemini-31-pro`
- [ ] T149 [P] Run S-PL-02 on `cli-claude-code-external`
- [ ] T150 [P] Run S-PL-02 on `opencode-native`
- [ ] T151 [P] Run S-PL-03 on `cli-codex-55-high`
- [ ] T152 [P] Run S-PL-03 on `cli-copilot-default`
- [ ] T153 [P] Run S-PL-03 on `cli-gemini-31-pro`
- [ ] T154 [P] Run S-PL-03 on `cli-claude-code-external`
- [ ] T155 [P] Run S-PL-04 on `claude-code-native`
- [ ] T156 [P] Run S-PL-04 on `cli-codex-54-medium`
- [ ] T157 [P] Run S-PL-04 on `cli-codex-55-high`
- [ ] T158 [P] Run S-PL-04 on `cli-copilot-default`
- [ ] T159 [P] Run S-PL-04 on `cli-gemini-31-pro`
- [ ] T160 [P] Run S-PL-04 on `cli-claude-code-external`
- [ ] T161 [P] Run S-PL-04 on `opencode-native`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T200 Capture baseline/control measurements for every scenario.
- [ ] T201 Capture quantitative metrics for each included scenario-runtime trial.
- [ ] T202 Capture qualitative relevance and usefulness scores for each included scenario-runtime trial.
- [ ] T203 Aggregate metrics by scenario, axis, and CLI variant.
- [ ] T204 Classify systems as useful, mixed, or overhead.
- [ ] T205 Create file:line-cited improvement backlog for overhead systems.
- [ ] T206 Write synthesis report.
- [ ] T207 Update checklist with execution evidence.
- [ ] T208 Update implementation summary with execution results.
- [ ] T209 Run strict validation after execution docs are updated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Scaffold criteria: planning artifacts exist.
- [x] Scaffold criteria: strict child validation passes.
- [x] Scaffold criteria: strict parent validation passes.
- [ ] Execution criteria: every included matrix cell has at least three assisted trials or a documented deferral.
- [ ] Execution criteria: every scenario has a control comparison.
- [ ] Execution criteria: synthesis report and backlog exist.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Methodology ADRs**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
