---
title: "Implementation Plan: Repoint the clickup_official Code Mode manual to the hosted ClickUp MCP and fix stale ClickUp docs"
description: "Edit one manual entry in .utcp_config.json to launch the hosted ClickUp MCP through mcp-remote, correct one README line, and verify with a config check and the shipped UTCP validator."
trigger_phrases:
  - "clickup hosted route fix plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Repoint the clickup_official Code Mode manual to the hosted ClickUp MCP and fix stale ClickUp docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config, Markdown |
| **Framework** | Code Mode (UTCP) with an MCP stdio manual |
| **Storage** | None |
| **Testing** | Node config check, `validate_config.py`, `validate.sh --strict` |

### Overview
The manual keeps its name and stdio transport. Only its launch arguments change, from the retired npm package to `mcp-remote` pointed at the hosted server, and the API-key env block goes because the hosted server uses OAuth. One README line that names the old package is corrected to match.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative config edit, no code.

### Key Components
- **`.utcp_config.json`**: the `clickup_official` entry under `manual_call_templates`
- **`mcp-click-up` skill**: already documents the hosted route and is the source for the target arguments

### Data Flow
Code Mode reads the manual, launches `npx -y mcp-remote https://mcp.clickup.com/mcp` over stdio, and the first launch asks the operator to approve OAuth in the browser.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The config check in spec REQ-001 failed before the edit (baseline observed 2026-10-09) and must pass after it. The shipped validator passed on 14 manuals before the edit, so it is rerun in full afterwards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`mcp-remote` on the public npm registry and the hosted endpoint at `https://mcp.clickup.com/mcp`. Both were reachable on 2026-10-09.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To undo this: `git checkout -- .utcp_config.json README.md` while the edits are uncommitted, or `git revert` the commit afterwards.
<!-- /ANCHOR:rollback -->

---

