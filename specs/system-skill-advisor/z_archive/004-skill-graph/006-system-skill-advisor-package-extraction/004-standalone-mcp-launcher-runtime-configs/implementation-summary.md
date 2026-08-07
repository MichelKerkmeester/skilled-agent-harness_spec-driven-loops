---
title: "Implementation Summary: Standalone MCP launcher and runtime configs"
description: "Planned-state summary for child 004. The packet will add the advisor launcher and runtime registrations, but no code or config implementation has landed yet."
trigger_phrases:
  - "system_skill_advisor implementation summary"
  - "skill advisor launcher planned"
  - "013/009/004 summary"
importance_tier: "critical"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Launcher implemented"
    next_safe_action: "Continue to 005"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Standalone MCP launcher and runtime configs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `004-standalone-mcp-launcher-runtime-configs` |
| **Status** | In Progress |
| **Created** | 2026-05-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet activates the extracted advisor as a standalone MCP server. The implementation adds a repo-local launcher, registers `system_skill_advisor` in OpenCode, Codex, Claude, and Gemini config files, and proves the stable `advisor_*` tools are callable from the standalone server without changing the existing `spec_kit_memory` registrations.

### Launcher

Created `.opencode/bin/skill-advisor-launcher.cjs`. It mirrors the useful memory launcher mechanics: repo env loading, build-if-missing bootstrap, advisor-scoped lock/state files, child process signal forwarding, and explicit failure logs. It narrows those mechanics to `.opencode/skills/system-skill-advisor/mcp_server/` and logs the resolved `skill-graph.sqlite` path.

Created `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts`. The server uses `@modelcontextprotocol/sdk/server/index.js`, `StdioServerTransport`, local advisor tool descriptors, and package-local handlers. It registers exactly `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.

### Runtime Configs

Added one sibling MCP server named `system_skill_advisor` to `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`. The existing `spec_kit_memory` blocks were compared against pre-edit snapshots and remained byte-for-byte unchanged.

### Tool Contract

The public tool ids remain `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`. Direct MCP stdio smoke returned all four tool ids and an `advisor_recommend` call returned `ok:stale:3`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded in three phases: setup inventory, launcher/config edits, and runtime verification. Verification covered config parsing, default and override DB path checks, cold-start build behavior, direct MCP tool listing, OpenCode/Codex runtime manager listing, and strict packet validation.

Runtime-manager caveat: `claude mcp list` did not surface `.claude/mcp.json`'s new entry even when invoked with `--mcp-config=.claude/mcp.json`; `gemini mcp list --debug` only reported `sequential_thinking` despite `.gemini/settings.json` parsing with `system_skill_advisor`. The config files contain the required blocks, but those two manager-list checks remain blocked for child 005/runtime cutover diagnosis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standalone MCP server | Parent ADR-001 requires advisor process ownership outside `spec_kit_memory`. |
| Server id `system_skill_advisor` | It matches existing snake_case MCP server ids such as `spec_kit_memory`. |
| Stable `advisor_*` tool ids | Server-level namespacing is enough; renaming tools would create avoidable caller churn. |
| Env-first DB path | Tests and CI need isolation, while production defaults remain package-local. |
| Build-if-missing launcher | Clean runtime startup should not require a manual TypeScript build first. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor package build | PASS: `npm run build` emitted `dist/system-skill-advisor/mcp_server/advisor-server.js`. Initial build exposed `*.bench.ts` inclusion; `tsconfig.build.json` now excludes benchmark test entrypoints. |
| Advisor package typecheck | PASS: `npm run typecheck`. |
| Advisor package tests | BLOCKED: `npm test` now starts, but the broader suite fails on out-of-scope child 005 surfaces, missing hook/plugin bridge paths, legacy parity fixtures, and package-local migration assumptions. |
| Strict validation for this spec folder | PASS: `validate.sh .../004-standalone-mcp-launcher-runtime-configs --strict` exited 0. |
| JSON config parse | PASS: `opencode.json`, `.claude/mcp.json`, and `.gemini/settings.json`. |
| TOML config parse | PASS: `python3.13` + `tomllib` parsed `.codex/config.toml`. |
| `spec_kit_memory` block preservation | PASS: raw block comparison against `/tmp/013009004-baseline` showed all four unchanged. |
| Cold-start smoke | PASS: deleting generated `dist/` caused the launcher to run `npm run build` and recreate the advisor entrypoint. |
| Default DB log | PASS: `[skill-advisor-launcher] DB: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. |
| Env override DB log | PASS: `SYSTEM_SKILL_ADVISOR_DB_DIR=/tmp/test-advisor-db` logged `/tmp/test-advisor-db/skill-graph.sqlite`. |
| Direct MCP tool list | PASS: `advisor_recommend,advisor_rebuild,advisor_status,advisor_validate`. |
| Direct `advisor_recommend` call | PASS: returned `ok:stale:3`. |
| OpenCode runtime manager | PASS: `opencode mcp list` showed `system_skill_advisor connected`. |
| Codex runtime manager | PASS: `codex mcp list` showed `system_skill_advisor enabled`. |
| Claude runtime manager | BLOCKED: `claude mcp list` did not show `system_skill_advisor` from `.claude/mcp.json`. |
| Gemini runtime manager | BLOCKED: `gemini mcp list --debug` did not show project settings entries beyond `sequential_thinking`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full package tests are not green.** The suite now loads after adding local Vitest metadata, but failures are concentrated in out-of-scope child 005 consumer surfaces and legacy fixtures. The standalone server build and direct MCP smoke pass.
2. **Claude/Gemini manager listing is blocked.** The committed config files contain `system_skill_advisor`, but the local CLI manager commands did not surface those project config entries in this session.
<!-- /ANCHOR:limitations -->
