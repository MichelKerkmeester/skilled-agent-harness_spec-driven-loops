---
title: "Tasks: Standalone MCP launcher and runtime configs"
description: "Task breakdown for adding skill-advisor-launcher.cjs, four system_skill_advisor runtime registrations, and standalone advisor MCP smoke verification."
trigger_phrases:
  - "system_skill_advisor tasks"
  - "skill advisor launcher tasks"
  - "runtime config tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/004-standalone-mcp-launcher-and-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffold authored"
    next_safe_action: "Run setup inventory"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Standalone MCP launcher and runtime configs

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
## PHASE 1: SETUP

- [ ] T001 Read `.opencode/bin/spec-kit-memory-launcher.cjs` and list reusable bootstrap pieces.
- [ ] T002 Confirm advisor package entrypoint, build script, and expected `dist/` artifact under `.opencode/skills/system-skill-advisor/mcp_server/`.
- [ ] T003 Verify Claude MCP registration surface is `.claude/mcp.json`.
- [ ] T004 Snapshot or diff baseline `spec_kit_memory` blocks in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`.
- [ ] T005 Define launcher state, lock, and DB log paths under the advisor package database directory.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T006 Create `.opencode/bin/skill-advisor-launcher.cjs`.
- [ ] T007 Implement repo env loading in the launcher consistent with the memory launcher.
- [ ] T008 Implement advisor artifact detection and build-if-missing bootstrap.
- [ ] T009 Implement advisor-scoped lock/state file handling.
- [ ] T010 Implement DB path resolution and startup logging for `SYSTEM_SKILL_ADVISOR_DB_DIR` and the package default.
- [ ] T011 Add `system_skill_advisor` to `opencode.json`.
- [ ] T012 Add `system_skill_advisor` to `.codex/config.toml`.
- [ ] T013 Add `system_skill_advisor` to `.claude/mcp.json`.
- [ ] T014 Add `system_skill_advisor` to `.gemini/settings.json`.
- [ ] T015 Re-check that all `spec_kit_memory` blocks are unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T016 Parse `opencode.json`, `.claude/mcp.json`, and `.gemini/settings.json` as JSON.
- [ ] T017 Parse or runtime-load `.codex/config.toml`.
- [ ] T018 Smoke launcher with existing `dist/` artifacts.
- [ ] T019 Smoke launcher with `system-skill-advisor/mcp_server/dist/` temporarily absent.
- [ ] T020 Verify launcher logs the default DB path.
- [ ] T021 Verify launcher logs the env override DB path.
- [ ] T022 List OpenCode MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`.
- [ ] T023 List Codex MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`.
- [ ] T024 List Claude MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`.
- [ ] T025 List Gemini MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`.
- [ ] T026 Run packet strict validation and update implementation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` have evidence.
- [ ] Runtime configs show `system_skill_advisor` alongside unchanged `spec_kit_memory`.
- [ ] `advisor_recommend` is callable from the standalone advisor server.
- [ ] Strict validation for this spec folder exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
