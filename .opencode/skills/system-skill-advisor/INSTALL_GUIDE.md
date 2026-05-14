---
title: "System Skill Advisor Install Guide"
description: "Stub install guide for the future standalone System Skill Advisor MCP server registration handled by child 004."
trigger_phrases:
  - "system skill advisor install"
  - "skill-advisor-launcher.cjs"
  - "system_skill_advisor mcp registration"
---

# System Skill Advisor Install Guide

This is a stub for child 004. Child 002 only creates the package envelope.

---

## 1. CURRENT STATE

The package is envelope-only per `015/009/002-scaffold-system-skill-advisor-package`.

Runtime source, tests, and database path resolution still live under:

```text
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/
```

The standalone MCP server is not registered yet. Do not add runtime config entries in child 002.

---

## 2. FUTURE MCP SERVER REGISTRATION

Child 004 will author the real install flow.

Planned steps:

1. Add `.opencode/bin/skill-advisor-launcher.cjs`.
2. Add the standalone MCP server entrypoint under `.opencode/skills/system-skill-advisor/mcp_server/`.
3. Register `system_skill_advisor` in:
   - `opencode.json`
   - `.codex/config.toml`
   - `.claude/mcp.json`
   - `.gemini/settings.json`
4. Keep public tool ids stable:
   - `advisor_recommend`
   - `advisor_status`
   - `advisor_rebuild`
   - `advisor_validate`
5. Verify the database path:

```text
.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
```

TODO for child 004: replace this stub with executable setup, config snippets, cold-start build behavior, and verification commands.

---

## 3. MIGRATION NOTE

The legacy advisor runtime remains co-located with `system-spec-kit` until child 003 moves source, tests, and database ownership into this package. Child 004 wires launch and runtime configs after that move.
