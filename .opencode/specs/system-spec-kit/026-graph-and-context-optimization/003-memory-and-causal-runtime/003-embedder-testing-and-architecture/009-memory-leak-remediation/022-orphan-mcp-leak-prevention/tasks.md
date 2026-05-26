---
title: "Tasks: Orphan MCP Leak Prevention"
description: "Task list for dry-run-first MCP process cleanup, Claude Stop cleanup, and MCP idle self-exit."
trigger_phrases:
  - "orphan mcp leak prevention tasks"
  - "mcp cleanup task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T06:58:36Z"
    last_updated_by: "codex"
    recent_action: "implemented dry-run MCP leak prevention packet"
    next_safe_action: "operator reviews dry-run output before LaunchAgent activation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "2026-05-24-orphan-mcp-leak-prevention-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Orphan MCP Leak Prevention

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

- [x] T001 Create Level 3 child packet (`022-orphan-mcp-leak-prevention`)
- [x] T002 Update parent phase map and graph metadata (`009-memory-leak-remediation`)
- [x] T003 [P] Replace template placeholders in spec docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create orphan MCP sweeper (`.opencode/scripts/orphan-mcp-sweeper.sh`)
- [x] T005 Create LaunchAgent template (`.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist`)
- [x] T006 Create Claude cleanup script (`.opencode/scripts/claude-session-cleanup.sh`)
- [x] T007 Chain cleanup into existing Stop hook (`.claude/settings.local.json`)
- [x] T008 Add IPC `onActivity` callback to the three socket-server modules
- [x] T009 Add idle timeout manager to Spec Kit Memory MCP server
- [x] T010 Add idle timeout manager to Skill Advisor MCP server
- [x] T011 Add idle timeout manager to Code Graph MCP server
- [x] T012 Add targeted sweeper and idle timeout tests
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `bash -n` on both scripts
- [x] T014 Run JSON validation for `.claude/settings.local.json`
- [x] T015 Run sweeper `--dry-run --verbose`
- [x] T016 Run targeted vitest suites
- [x] T017 Run targeted typechecks/builds
- [x] T018 Run OpenCode alignment verifier
- [x] T019 Run strict spec validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Dry-run verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
