---
title: MCP Server Authoring Checklist
description: Checklist for authoring MCP servers with registration, schema validation, typed responses, and error envelopes.
trigger_phrases:
  - "mcp server authoring checklist"
  - "mcp tool registration"
  - "mcp schema validation"
  - "mcp error envelopes"
importance_tier: normal
contextType: implementation
---

# MCP Server Authoring Checklist

Checklist for authoring or modifying OpenCode MCP servers with correct tool registration, schema validation, typed responses, and consistent error envelopes.

## 1. OVERVIEW

### Purpose

This checklist covers the foundation needed for a new OpenCode MCP server to be discoverable, typed, and operationally safe. It helps authors choose Python versus TypeScript patterns, register tools correctly, and keep response/error behavior consistent with existing servers.

### Usage

- Use this when authoring a new MCP server under `.opencode/skills/<skill-name>/mcp_server/`.
- Use this when adding or changing MCP tools, input schemas, registry entries, or response envelopes.
- Use this when porting a shell or CLI workflow into an MCP-accessible service.
- Use this when changing Python or TypeScript MCP server startup behavior.

---

## 2. PRE-CHECKS

- [ ] Read canonical MCP server examples at `.opencode/skills/system-spec-kit/mcp_server/`, `.opencode/skills/system-code-graph/mcp_server/`, and `.opencode/skills/system-skill-advisor/mcp_server/` when present.
- [ ] Decide whether the server should be Python or TypeScript based on existing skill runtime, dependencies, and typed schema needs.
- [ ] Verify MCP tool registration in the relevant registry or server entrypoint.
- [ ] Define input schema validation before implementing handler logic.
- [ ] Confirm response shape uses the local success/error envelope convention.
- [ ] Plan tests for schema rejection, happy path, and handler error behavior.

---

## 3. STEPS

1. Choose the server language and entrypoint that matches the owning skill.
2. Add tool schemas before handler implementation.
3. Register each tool in the MCP server registry or dispatch table.
4. Implement handlers with explicit validation, bounded filesystem access, and structured responses.
5. Use the shared error envelope or response helpers used by the nearest canonical server.
6. Add tests or fixture checks that cover malformed input, successful output, and thrown errors.
7. Document install or runtime requirements in the owning skill when users must configure the server.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict` when the MCP server change is part of a spec folder.
- [ ] grep verification: `rg -n "schema|register|tool|error|envelope|success" .opencode/skills/<skill-name>/mcp_server`.
- [ ] Run the targeted Python, TypeScript, or package test command used by the owning MCP server.
- [ ] Cross-runtime mirror parity check if an agent, command, or skill mirror advertises the new MCP capability.

---

## 5. RELATED RESOURCES

- sk-doc references/skill_creation.md (source-of-truth for skill packaging around MCP assets)
- Prior examples: `.opencode/skills/system-spec-kit/mcp_server/`, `.opencode/skills/system-code-graph/mcp_server/`, `.opencode/skills/system-skill-advisor/mcp_server/`
- Verification recipes: `.opencode/skills/sk-code/assets/opencode/checklists/typescript_checklist.md`, `.opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md`
