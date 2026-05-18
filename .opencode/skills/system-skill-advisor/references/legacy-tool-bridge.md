---
title: "Legacy Tool Bridge"
description: "Compatibility policy for stable advisor_* tool ids during the standalone System Skill Advisor MCP migration."
trigger_phrases:
  - "legacy advisor tool bridge"
  - "advisor_* compatibility"
  - "stable advisor tool ids"
---

# Legacy Tool Bridge

Compatibility policy that keeps the public `advisor_*` tool ids stable while the MCP server namespace moved to `mk_skill_advisor` during the standalone extraction.

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

### Purpose
Document the public-tool-id stability contract during the standalone System Skill Advisor MCP server extraction, so callers (hooks, plugin bridge, Python shim, doctor workflows, install guides, tests) do not need to change their tool calls when the namespace migrates.

### When to Use
- Reviewing whether a downstream caller needs updates after the namespace migration.
- Auditing the bridge window's lifetime (`mk-spec-memory` proxy versus standalone `mk_skill_advisor`).
- Preparing ADR-001 follow-on work or sunsetting the bridge.

### Core Principle
**Public tool ids stay stable. Only the MCP server namespace changes.** Callers continue to invoke `advisor_*` ids unchanged.

### Key Sources
- ADR-001 (chose compatibility-first over public rename). See `<spec-folder>`.
- [`references/standalone-mcp-shape.md`](./standalone-mcp-shape.md) (the new server's wiring).
- [`references/tool-ids-reference.md`](./tool-ids-reference.md) (canonical tool id list).

<!-- /ANCHOR:1-overview -->

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
