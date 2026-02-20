---
name: mcp-code-mode
description: "MCP orchestration via TypeScript execution for efficient multi-tool workflows. Use Code Mode for ALL MCP tool calls (ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.). Provides 98.7% context reduction, 60% faster execution, and type-safe invocation. Mandatory for external tool integration."
allowed-tools: [code_mode_register_manual, code_mode_deregister_manual, code_mode_search_tools, code_mode_list_tools, code_mode_get_required_keys_for_tool, code_mode_tool_info, code_mode_call_tool_chain]
version: 1.2.0
---

# MCP Code Mode Orchestrator

Execute TypeScript code with direct access to 200+ MCP tools through progressive disclosure. Code Mode eliminates context overhead by loading tools on-demand, enabling complex multi-tool workflows in a single execution with state persistence and built-in error handling.

> **Navigation note:** This is a supplemental deep-dive index. `SKILL.md` remains the primary entrypoint for activation rules, routing logic, and core behavior. Use this index for focused content on specific topics.

## Map of Content (MOC)

### Foundation & Context
- [[nodes/when-to-use|When To Use Code Mode]] — Identifying when to use Code Mode vs Native MCP tools.
- [[nodes/how-it-works|How It Works]] — Architecture of the UTCP typescript environment.
- [[nodes/project-configuration|Project Configuration]] — How to set up `.utcp_config.json` manually or via discovery.

### Operations & Usage
- [[nodes/quick-reference|Quick Reference]] — Read-to-use templates for tool discovery, chaining, and error handling.
- [[nodes/rules|Rules]] — Mandatory ALWAYS and NEVER rules for script execution.
- [[nodes/success-criteria|Success Criteria]] — Validation metrics for scripts.

### External Resources
- [[references/architecture|Full Architecture Details]]
- [[references/workflows|Operational Workflows]]
