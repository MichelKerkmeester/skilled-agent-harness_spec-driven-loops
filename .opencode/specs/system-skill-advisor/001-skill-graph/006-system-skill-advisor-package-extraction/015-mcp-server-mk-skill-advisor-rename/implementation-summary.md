---
title: "Implementation Summary: Rename system_skill_advisor MCP server to mk_skill_advisor"
description: "Evidence summary for packet 015 runtime identity rename."
trigger_phrases:
  - "013/009/015 implementation summary"
  - "mk_skill_advisor summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename"
    last_updated_at: "2026-05-14T20:45:00Z"
    last_updated_by: "codex"
    recent_action: "mk_skill_advisor rename verified"
    next_safe_action: "Commit scoped rename"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "description.json"
      - "graph-metadata.json"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `015-mcp-server-mk-skill-advisor-rename` |
| **Completed** | 2026-05-14 |
| **Level** | 3 |
| **Status** | Complete |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Skill Advisor MCP runtime identity is now `mk_skill_advisor`. The launcher moved to `.opencode/bin/mk-skill-advisor-launcher.cjs`, its state file moved to `.mk-skill-advisor-launcher.json`, all four runtime configs now register the mk-prefixed server, and live namespace consumers use `mcp__mk_skill_advisor__*`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.gemini/settings.json` | Modified | Rename MCP config key, launcher path, and namespace note. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Renamed/modified | mk-prefixed launcher filename, logs, lockdir, state path, and payload command. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json` | Renamed/modified | mk-prefixed launcher state identity. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modified | MCP server registers as `mk_skill_advisor`; startup logs use mk launcher prefix. |
| Doctor commands, YAMLs, plugin bridge, install guides, feature catalog, playbooks, and package docs | Modified | Live server-id and namespace references updated. |
| Parent `013/009/handover.md` and `graph-metadata.json` | Modified | Child 015 added and marked active. |
| Packet 015 docs | Created/modified | Level 3 spec, plan, tasks, checklist, ADRs, metadata, and summary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation followed the `mk_code_index` rename precedent: rename launcher and state file first, rename server registration, update runtime configs, then sweep live consumers. A first launcher smoke exposed stale generated `dist` output with the old log prefix; rebuilding the advisor package made the smoke exercise the updated server source.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `mk_skill_advisor` as server id | Matches custom MCP snake_case pattern. |
| Keep `system-skill-advisor` folder | Preserves graph `skill_id` invariant from packet 010. |
| Keep tool ids unchanged | Preserves caller stability. |
| Rename launcher state file | Keeps on-disk launcher diagnostics aligned with new binary name. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor package typecheck | PASS: `npm run typecheck` in `.opencode/skills/system-skill-advisor/mcp_server`. |
| Spec-kit MCP typecheck | PASS: `npx tsc --noEmit` in `.opencode/skills/system-spec-kit/mcp_server`. |
| Launcher smoke | PASS: `timeout 8 node .opencode/bin/mk-skill-advisor-launcher.cjs`; mk-prefixed logs and skill graph scan observed. |
| OpenCode MCP list | PASS: `mk_skill_advisor` connected. |
| Old namespace grep | PASS: `mcp__system_skill_advisor__` live count is 0 outside specs/changelog/dist/node_modules. |
| Strict validation | PASS: packet 015 strict validation. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Existing long-lived MCP sessions may need restart or reconnect to drop cached `system_skill_advisor` entries.
2. Generated SQLite and runtime state files were dirtied by local MCP smoke/list commands; unrelated database churn was kept out of the scoped commit.
<!-- /ANCHOR:limitations -->
