---
title: "Tasks: Phase 007 Deep Review Remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 007 tasks"
  - "deep review remediation tasks"
  - "P0 narrative cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation"
    last_updated_at: "2026-05-05T17:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed finding-level remediation task list"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 007 Deep Review Remediation

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
- [x] T002 Read Phase 002/003/004 target files before editing (`../002-skill-folder-rename`, `../003-opencode-internals`, `../004-runtime-mirrors`)
- [x] T003 Read changelog symlink state (`.opencode/changelog`)
- [x] T004 Read advisor graph JSON source (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`)
- [x] T005 Author Phase 007 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 P0-004 Restore Phase 002 self-rename narrative (`../002-skill-folder-rename/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `graph-metadata.json`)
- [x] T007 P0-004 Restore Phase 003 self-rename narrative (`../003-opencode-internals/spec.md`, `graph-metadata.json`)
- [x] T008 P0-004 Restore Phase 004 self-rename narrative (`../004-runtime-mirrors/spec.md`, `graph-metadata.json`)
- [x] T009 P1-001 Replace stale changelog symlinks (`.opencode/changelog`)
- [x] T010 P1-002 Add deep-review positive signals (`skill-graph.json`)
- [x] T011 P1-002 Add sk-code-review anti-signals (`skill-graph.json`)
- [x] T012 P1-003 Document internal `sk-deep` family bucket deferral (`decision-record.md`)
- [x] T013 P1-004 Document pre-existing `sk-code` entity kind validation deferral (`decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify no identity-rename strings remain in Phase 002/003/004 docs (evidence: targeted grep returned zero rows, exit 1 with no output)
- [x] T015 Verify changelog symlinks point to renamed folders and old symlinks are absent (evidence: `deep-review -> ../skill/deep-review/changelog`; `deep-research -> ../skill/deep-research/changelog`; no `sk-deep-*` rows)
- [x] T016 Verify `skill-graph.json` parses and contains requested signals (evidence: Python assertion printed `OK: signals updated`)
- [x] T017 Run Phase 007 strict validation (evidence: strict validation exit 0)
- [x] T018 Run parent packet strict validation (evidence: strict validation exit 0)
- [x] T019 Record final evidence in checklist and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Every deep review finding is fixed or documented as deferred.
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
