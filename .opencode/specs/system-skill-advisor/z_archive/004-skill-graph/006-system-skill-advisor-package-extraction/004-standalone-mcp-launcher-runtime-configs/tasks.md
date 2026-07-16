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
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation landed"
    next_safe_action: "Continue to 005"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 92
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

- [x] T001 Read `.opencode/bin/spec-kit-memory-launcher.cjs` and list reusable bootstrap pieces. Evidence: launcher mirrors env loading, build-if-missing, lock/state, child process, and signal handling.
- [x] T002 Confirm advisor package entrypoint, build script, and expected `dist/` artifact under `.opencode/skills/system-skill-advisor/mcp_server/`. Evidence: added `advisor-server.ts`, `build`, `main`, and verified `dist/system-skill-advisor/mcp_server/advisor-server.js`.
- [x] T003 Verify Claude MCP registration surface is `.claude/mcp.json`. Evidence: required reading and config edit targeted `.claude/mcp.json`; runtime-manager caveat recorded below.
- [x] T004 Snapshot or diff baseline `spec_kit_memory` blocks in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`. Evidence: copied baselines to `/tmp/013009004-baseline` and compared raw blocks after edits.
- [x] T005 Define launcher state, lock, and DB log paths under the advisor package database directory. Evidence: `.skill-advisor-launcher.lockdir` and `.skill-advisor-launcher.json` under `system-skill-advisor/mcp_server/database/`; DB log prints resolved `skill-graph.sqlite`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T006 Create `.opencode/bin/skill-advisor-launcher.cjs`. Evidence: file exists and launches the standalone advisor server.
- [x] T007 Implement repo env loading in the launcher consistent with the memory launcher. Evidence: smoke logs showed `.env.local` and `.env` loads before startup.
- [x] T008 Implement advisor artifact detection and build-if-missing bootstrap. Evidence: deleting generated `dist/` caused launcher to run `npm run build` and recreate the entrypoint.
- [x] T009 Implement advisor-scoped lock/state file handling. Evidence: launcher uses `.skill-advisor-launcher.lockdir` and `.skill-advisor-launcher.json` in advisor DB dir.
- [x] T010 Implement DB path resolution and startup logging for `SYSTEM_SKILL_ADVISOR_DB_DIR` and the package default. Evidence: default path and `/tmp/test-advisor-db/skill-graph.sqlite` override both logged.
- [x] T011 Add `system_skill_advisor` to `opencode.json`. Evidence: JSON parse and `opencode mcp list` showed connected.
- [x] T012 Add `system_skill_advisor` to `.codex/config.toml`. Evidence: `python3.13` TOML parse and `codex mcp list` showed enabled.
- [x] T013 Add `system_skill_advisor` to `.claude/mcp.json`. Evidence: JSON parse showed the block with `env` notes; CLI manager did not surface it.
- [x] T014 Add `system_skill_advisor` to `.gemini/settings.json`. Evidence: JSON parse showed the block with `cwd: "."` and `trust: true`; CLI manager did not surface it.
- [x] T015 Re-check that all `spec_kit_memory` blocks are unchanged. Evidence: raw block comparison reported UNCHANGED for all four configs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T016 Parse `opencode.json`, `.claude/mcp.json`, and `.gemini/settings.json` as JSON. Evidence: Node JSON parse passed.
- [x] T017 Parse or runtime-load `.codex/config.toml`. Evidence: `python3.13` + `tomllib` parsed and asserted the advisor entry.
- [x] T018 Smoke launcher with existing `dist/` artifacts. Evidence: launcher stayed alive and logged DB path.
- [x] T019 Smoke launcher with `system-skill-advisor/mcp_server/dist/` temporarily absent. Evidence: generated `dist/` was removed, launcher rebuilt, and entrypoint existed afterward.
- [x] T020 Verify launcher logs the default DB path. Evidence: logged package-local `.../system-skill-advisor/mcp_server/database/skill-graph.sqlite`.
- [x] T021 Verify launcher logs the env override DB path. Evidence: `SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/test-advisor-db` logged `/tmp/test-advisor-db/skill-graph.sqlite`.
- [x] T022 List OpenCode MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`. Evidence: `opencode mcp list` showed `system_skill_advisor connected`; direct MCP tool list returned `advisor_recommend`.
- [x] T023 List Codex MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`. Evidence: `codex mcp list` showed `system_skill_advisor enabled`; direct MCP tool list returned `advisor_recommend`.
- [B] T024 List Claude MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`. Blocked: `.claude/mcp.json` parses with the entry, but `claude mcp list` did not surface it in this session; direct MCP tool list returned `advisor_recommend`.
- [B] T025 List Gemini MCP servers and tools; confirm `system_skill_advisor` and `advisor_recommend`. Blocked: `.gemini/settings.json` parses with the entry, but `gemini mcp list --debug` only reported `sequential_thinking`; direct MCP tool list returned `advisor_recommend`.
- [x] T026 Run packet strict validation and update implementation evidence. Evidence: `validate.sh .../004-standalone-mcp-launcher-runtime-configs --strict` exited 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` have evidence.
- [x] Runtime configs show `system_skill_advisor` alongside unchanged `spec_kit_memory`.
- [x] `advisor_recommend` is callable from the standalone advisor server.
- [x] Strict validation for this spec folder exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
