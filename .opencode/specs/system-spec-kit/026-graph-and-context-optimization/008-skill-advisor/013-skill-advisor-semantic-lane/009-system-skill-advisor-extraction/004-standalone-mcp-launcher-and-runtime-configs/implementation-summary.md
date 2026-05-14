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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/004-standalone-mcp-launcher-and-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffold authored"
    next_safe_action: "Implement launcher"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | `004-standalone-mcp-launcher-and-runtime-configs` |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet will activate the extracted advisor as a standalone MCP server. The planned implementation adds a repo-local launcher, registers `system_skill_advisor` in OpenCode, Codex, Claude, and Gemini, and proves the stable `advisor_*` tools are callable without changing the existing `spec_kit_memory` registrations.

### Launcher

The launcher will mirror the reliable parts of `spec-kit-memory-launcher.cjs`: repo env loading, build-if-missing bootstrap, lock/state file handling, child process signal forwarding, and explicit failure logs. The advisor version narrows those mechanics to `.opencode/skills/system-skill-advisor/mcp_server/` and logs the resolved `skill-graph.sqlite` path.

### Runtime Configs

The config change will add one sibling MCP server named `system_skill_advisor` to `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`. The existing `spec_kit_memory` blocks stay unchanged.

### Tool Contract

The public tool ids remain `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`. The server id changes the runtime boundary; the tool ids do not change.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation should proceed in three phases: setup inventory, launcher/config edits, and runtime verification. Verification should include config parsing, default and override DB path checks, cold-start build behavior, and MCP tool listing from all four runtimes.
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
| Strict validation for this spec folder | Pending until scaffold validation run. |
| JSON parse for `graph-metadata.json` | Pending until metadata is written. |
| JSON parse for `description.json` | Pending until metadata is written. |
| Runtime smoke | Not run; implementation is planned. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Implementation not landed.** This packet is currently planned; launcher and runtime config files have not been edited by this scaffold dispatch.
2. **Runtime smoke pending.** MCP server/tool listing belongs to the implementation phase after launcher/config edits exist.
<!-- /ANCHOR:limitations -->
