---
title: MCP Server Authoring Checklist
description: Checklist for authoring MCP servers with launcher/direct-dist registration, daemon/socket contracts, Code Mode split, schemas, and dist freshness.
trigger_phrases:
  - "mcp server authoring checklist"
  - "mcp tool registration"
  - "mcp schema validation"
  - "mcp error envelopes"
importance_tier: normal
contextType: implementation
version: 1.0.0.14
---

# MCP Server Authoring Checklist

Checklist for authoring or modifying OpenCode MCP servers with correct `opencode.json` registration, launcher or direct-dist startup, daemon/socket contracts, schema validation, typed responses, Code Mode separation, and dist freshness.

## 1. OVERVIEW

### Purpose

This checklist covers the foundation needed for a new OpenCode MCP server to be discoverable, typed, and operationally safe. It helps authors match the live registration pattern, wire daemon/socket behavior when needed, register tools correctly, and keep built `dist/` output fresh for the runtime that actually launches it.

### Usage

- Use this when authoring a new MCP server under an existing skill-local `mcp-server/` directory, such as `.opencode/skills/system-spec-kit/mcp-server/` or `.opencode/skills/system-code-graph/mcp-server/`.
- Use this when adding or changing MCP tools, input schemas, registry entries, or response envelopes.
- Use this when porting a shell or CLI workflow into an MCP-accessible service.
- Use this when changing Python or TypeScript MCP server startup behavior.
- Use this when deciding whether a tool belongs in native OpenCode MCP registration or in Code Mode's `.utcp_config.json` manual-call registry.

---

## 2. PRE-CHECKS

- [ ] Read `opencode.json` before changing MCP registration; it is the native MCP registration surface for this repo.
- [ ] Read native MCP examples at `.opencode/skills/system-spec-kit/mcp-server/`, `.opencode/skills/system-code-graph/mcp-server/`, `.opencode/skills/system-skill-advisor/mcp-server/`, and `.opencode/skills/mcp-code-mode/mcp-server/`.
- [ ] Identify the startup pattern in `opencode.json`.
  - Launcher pattern: `mk-spec-memory`, `mk_skill_advisor`, and `mk_code_index` run through `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, and `.opencode/bin/mk-code-index-launcher.cjs`.
  - Direct-dist pattern: `code_mode` runs `/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node` with `.opencode/skills/mcp-code-mode/mcp-server/dist/index.js` directly.
- [ ] For launcher-backed services, account for the three-tier assembly: launcher process, daemon/server `dist/` entrypoint, and socket path configured through `SPECKIT_IPC_SOCKET_DIR`.
- [ ] For Code Mode, keep external MCP tools in `.utcp_config.json` under `manual_call_templates`; do not add those tools as native `opencode.json` MCP servers unless they need native OpenCode tool registration.
- [ ] Decide whether the server should be TypeScript based on the owning skill runtime, dependencies, and typed schema needs.
- [ ] Verify MCP tool registration in the relevant registry, schema file, or server entrypoint.
- [ ] Define input schema validation before implementing handler logic.
- [ ] Confirm response shape uses the local success/error envelope convention.
- [ ] Plan tests for schema rejection, happy path, and handler error behavior.
- [ ] Plan a dist-freshness step: MCP servers are launched from built `dist/`, so edits to TypeScript source must be rebuilt before runtime verification.

---

## 3. STEPS

1. Choose the server entrypoint that matches the owning skill and the live `opencode.json` pattern.
2. For launcher-backed services, wire launcher, daemon/server entrypoint, socket directory, and lease/bridge behavior together; do not treat the launcher as the whole server.
3. For direct-dist services, keep `opencode.json` pointed at the built `dist/` entrypoint and keep the package `main`/`bin` aligned with that entrypoint.
4. Add tool schemas before handler implementation.
5. Register each tool in the MCP server registry or dispatch table.
6. Implement handlers with explicit validation, bounded filesystem access, and structured responses.
7. Use the shared error envelope or response helpers used by the nearest canonical server.
8. Add tests or fixture checks that cover malformed input, successful output, and thrown errors.
9. Rebuild the owning package after TypeScript edits so the launched `dist/` tree reflects source changes.
10. Document install or runtime requirements in the owning skill when users must configure the server.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` against the owning spec folder when the MCP server change is part of a spec folder.
- [ ] grep verification for native MCP registration: `rg -n "mk-spec-memory|mk_skill_advisor|mk_code_index|code_mode|dist/index\\.js|launcher" opencode.json`.
- [ ] grep verification for Code Mode external tools: `rg -n "manual_call_templates|call_template_type|mcpServers|chrome_devtools_1|figma|github|open_design" .utcp_config.json`.
- [ ] Run the owning package build after TypeScript edits. Verified package build scripts include `.opencode/skills/system-spec-kit/mcp-server/package.json`, `.opencode/skills/system-spec-kit/scripts/package.json`, `.opencode/skills/system-code-graph/package.json`, `.opencode/skills/system-skill-advisor/mcp-server/package.json`, and `.opencode/skills/mcp-code-mode/mcp-server/package.json`.
- [ ] Run the targeted TypeScript or package test command used by the owning MCP server.
- [ ] Cross-runtime advertisement check if an agent, command, or skill advertises the new MCP capability.

---

## 5. RELATED RESOURCES

- Native registration: `opencode.json`
- Code Mode external-tool registry: `.utcp_config.json`
- Launcher examples: `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, `.opencode/bin/mk-code-index-launcher.cjs`
- Direct-dist example: `.opencode/skills/mcp-code-mode/mcp-server/dist/index.js`
- MCP server examples: `.opencode/skills/system-spec-kit/mcp-server/`, `.opencode/skills/system-code-graph/mcp-server/`, `.opencode/skills/system-skill-advisor/mcp-server/`, `.opencode/skills/mcp-code-mode/mcp-server/`
- Verification recipes: `.opencode/skills/sk-code/code-opencode/assets/checklists/typescript-checklist.md`, `.opencode/skills/sk-code/code-opencode/assets/checklists/python-checklist.md`
