---
title: "Tasks: Phase 008 Final Cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 008 tasks"
  - "final cleanup tasks"
  - "deep-loop family tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/008-final-cleanup"
    last_updated_at: "2026-05-05T17:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed finding-level cleanup task list"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP to refresh native routing"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 008 Final Cleanup

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read deep review report (`../review/review-report.md`)
- [x] T002 Read advisor graph source before editing (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`)
- [x] T003 Read compiler validation before editing (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py`)
- [x] T004 Read deep-review and deep-research graph metadata before editing (`.opencode/skills/deep-*/graph-metadata.json`)
- [x] T005 Read sk-code graph metadata before editing (`.opencode/skills/sk-code/graph-metadata.json`)
- [x] T006 Author Phase 008 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 P1-002 Add requested deep-review positive signals (`skill-graph.json`)
- [x] T011 P1-002 Add requested sk-code-review anti-signals (`skill-graph.json`)
- [x] T012 P1-003 Rename `families.sk-deep` to `families.deep-loop` (`skill-graph.json`)
- [x] T013 P1-003 Update compiler family allow-list (`skill_graph_compiler.py`)
- [x] T014 P1-003 Update deep-review metadata family (`deep-review/graph-metadata.json`)
- [x] T015 P1-003 Update deep-research metadata family (`deep-research/graph-metadata.json`)
- [x] T016 P1-004 Normalize `reference-category` to `reference` (`sk-code/graph-metadata.json`)
- [x] T017 Add Phase 008 child ID to parent metadata (`../graph-metadata.json`)
- [x] T018 Create decision record (`decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Verify `deep-review` ranks top-1 for iterative review-loop audit prompt (evidence: `skill_advisor.py --force-local ...` returned `deep-review` first; default native bridge remains stale until orchestrator rebuild)
- [x] T021 Verify family rename via JSON assertion and zero old family metadata grep hits (evidence: JSON assertion printed `OK`; grep exited 1 with no rows)
- [x] T022 Verify `reference-category` has zero hits in `sk-code` graph metadata (evidence: grep exited 1 with no rows)
- [x] T023 Run advisor validation with rejection output (evidence: `VALIDATION PASSED: all metadata files are valid`)
- [x] T024 Run Phase 008 strict validation (evidence: strict validation exit 0)
- [x] T025 Run parent packet strict validation (evidence: strict validation exit 0)
- [x] T026 Record final evidence in checklist and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Every in-scope P1 finding is fixed with evidence.
- [x] Child and parent strict validation exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Review Report**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->
