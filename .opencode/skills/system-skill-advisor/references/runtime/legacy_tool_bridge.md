---
title: "Legacy Tool Bridge"
description: "Compatibility policy for stable advisor_* tool ids during the standalone System Skill Advisor MCP migration."
trigger_phrases:
  - "legacy advisor tool bridge"
  - "advisor_* compatibility"
  - "stable advisor tool ids"
---

# Legacy Tool Bridge

Compatibility policy for stable advisor_* tool ids during the standalone System Skill Advisor MCP migration.

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Purpose

Documents compatibility policy for preserving stable advisor tool ids during and after standalone MCP migration.

### When to Use

- Reviewing old callers that still use bridge surfaces.
- Checking whether a tool id can be renamed.
- Explaining why server namespace changes must not alter per-tool vocabulary.

### Core Principle

Server boundaries may move; public `advisor_*` and `skill_graph_*` tool ids stay stable unless a later ADR changes them.

### Key Sources

- [`standalone_mcp_shape.md`](./standalone_mcp_shape.md)
- [`tool_ids_reference.md`](./tool_ids_reference.md)


---

<!-- ANCHOR:2-policy -->
## 2. POLICY

Keep these public tool ids stable:

- `advisor_recommend`
- `advisor_rebuild`
- `advisor_status`
- `advisor_validate`

The MCP server namespace changes to `mk_skill_advisor`. The tool ids do not change.

<!-- /ANCHOR:2-policy -->

---

<!-- ANCHOR:3-why -->
## 3. WHY

Live consumers already call `advisor_*` ids from:

- Prompt-time hooks.
- Python compatibility shims.
- OpenCode plugin bridge code.
- Doctor workflows.
- Install guides and operator docs.
- MCP test suites.

A public rename would force broad consumer churn at the same time as the process move. ADR-001 chooses compatibility first.

<!-- /ANCHOR:3-why -->

---

<!-- ANCHOR:4-bridge-window -->
## 4. BRIDGE WINDOW

During migration, `mk-spec-memory` may keep deprecated proxy tools or fail fast with a migration hint. That bridge exists only to protect callers while runtime configs and hooks move.

After child 006, advisor tool ownership belongs to the standalone server.

<!-- /ANCHOR:4-bridge-window -->
