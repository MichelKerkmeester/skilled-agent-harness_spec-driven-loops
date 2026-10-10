---
title: "Feature Specification: Repoint the clickup_official Code Mode manual to the hosted ClickUp MCP and fix stale ClickUp docs"
description: "The clickup_official manual in .utcp_config.json launches an npm package that returns 404, so Code Mode never registers it and no ClickUp task can be created. The skill docs already describe the hosted route."
trigger_phrases:
  - "clickup hosted route fix"
  - "repoint the clickup official code mode manual"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repoint the clickup_official Code Mode manual to the hosted ClickUp MCP and fix stale ClickUp docs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-09 |
| **Branch** | `main` (no branch created) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `clickup_official` manual in `.utcp_config.json` runs `npx -y @clickup/mcp-server`, and `npm view @clickup/mcp-server` returns a 404. Code Mode therefore does not register the manual, and a ClickUp task create fails with `clickup_official is not defined`. The `mcp-click-up` skill docs already describe the hosted server reached through `mcp-remote`, so the shipped config contradicts its own documentation.

### Purpose
Code Mode registers `clickup_official` against the hosted ClickUp MCP once the operator restarts the client and approves the OAuth prompt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint the `clickup_official` manual to `npx -y mcp-remote https://mcp.clickup.com/mcp` and drop its `env` block
- Correct the root README line that still names the retired package and API-key variables
- Remove the ClickUp key lines from `.env.example`, which nothing in the repo reads once the manual stops using them

### Out of Scope
- The `mcp-click-up` skill docs, which already describe the hosted route (checked 2026-10-09)
- The ClickUp key lines in `SECURITY.md` and `.skilled/skills/mcp-code-mode/scripts/install.sh`, which are reported to the operator rather than changed
- The OAuth approval and client restart, which only the operator can do
- Pushing the two Product Owner tickets to ClickUp

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.utcp_config.json` | Modify | `clickup_official` args and env |
| `README.md` | Modify | One line in the Code Mode manual list |
| `.env.example` | Modify | Drop the ClickUp key pairs and the example that used them |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `clickup_official` launches the hosted server through `mcp-remote` with no API-key env | A node check finds args `["-y","mcp-remote","https://mcp.clickup.com/mcp"]` and no `env` key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The edited config still passes the shipped UTCP validator | `validate_config.py .utcp_config.json` prints `VALIDATION PASSED` |
| REQ-003 | The README line no longer names the retired package or key variables | `grep` for `@clickup/mcp-server` in `README.md` and `.utcp_config.json` returns nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The config check that fails today passes after the edit
- **SC-002**: Registration itself is not proven here, because it needs a client restart and an OAuth approval from the operator
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `mcp-remote` on npm and the hosted endpoint | Manual still fails to start | `npm view mcp-remote` resolved to 0.14.3 and the endpoint answered 401 on 2026-10-09 |
| Risk | Another consumer of the old env keys | Low | A search of non-spec code found no reader of `clickup_*` or `clickup__official_*` keys outside `.env.example` and `install.sh`. cupt's help text shows no env-key option |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `SECURITY.md` and `install.sh` also drop their ClickUp key lines?
<!-- /ANCHOR:questions -->

---

