---
title: "Legacy Tool Bridge"
description: "Compatibility policy for stable advisor_* tool ids during the standalone System Skill Advisor MCP migration."
trigger_phrases:
  - "legacy advisor tool bridge"
  - "advisor_* compatibility"
  - "stable advisor tool ids"
---

# Legacy Tool Bridge

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-policy -->
## 1. POLICY

Keep these public tool ids stable:

- `advisor_recommend`
- `advisor_rebuild`
- `advisor_status`
- `advisor_validate`

The MCP server namespace changes to `mk_skill_advisor`; the tool ids do not change.

---

<!-- /ANCHOR:1-policy -->

<!-- ANCHOR:2-why -->
## 2. WHY

Live consumers already call `advisor_*` ids from:

- Prompt-time hooks.
- Python compatibility shims.
- OpenCode plugin bridge code.
- Doctor workflows.
- Install guides and operator docs.
- MCP test suites.

A public rename would force broad consumer churn at the same time as the process move. ADR-001 chooses compatibility first.

---

<!-- /ANCHOR:2-why -->

<!-- ANCHOR:3-bridge-window -->
## 3. BRIDGE WINDOW

During migration, `spec_kit_memory` may keep deprecated proxy tools or fail fast with a migration hint. That bridge exists only to protect callers while runtime configs and hooks move.

After child 006, advisor tool ownership belongs to the standalone server.

<!-- /ANCHOR:3-bridge-window -->
