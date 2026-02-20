---
name: workflows-chrome-devtools
description: "Chrome DevTools orchestrator providing intelligent routing between CLI (bdg) and MCP (Code Mode) approaches. CLI prioritized for speed and token efficiency; MCP fallback for multi-tool integration scenarios."
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.0.7.0
---

# Chrome DevTools Orchestrator

Orchestrates browser debugging workflows by routing between the CLI (`bdg`) and MCP (Code Mode) approaches based on task complexity, token efficiency, and multi-tool integration requirements.

## Map of Content (MOC)

### Foundation
- [[nodes/when-to-use|When to Use]] — Activation triggers, use cases, and exclusion criteria for this skill.
- [[nodes/rules|Rules]] — Mandatory ALWAYS, NEVER, and ESCALATE behavioral rules for DevTools operations.
- [[nodes/success-criteria|Success Criteria]] — Completion checklist and quality targets for Chrome DevTools workflows.

### Architecture
- [[nodes/how-it-works|How It Works]] — Core architecture overview comparing CLI, MCP, and framework approaches.
- [[nodes/smart-routing|Smart Routing]] — Intent scoring, resource loading levels, and routing pseudocode.
- [[nodes/routing-decision|Routing Decision]] — Decision logic for selecting between CLI (bdg) and MCP (Code Mode) approaches.

### Approaches
- [[nodes/cli-approach|CLI Approach]] — CLI (bdg) usage: installation, discovery, session management, and commands.
- [[nodes/mcp-approach|MCP Approach]] — MCP (Code Mode) configuration, isolated instances, tool invocation, and session cleanup.

### Reference
- [[nodes/quick-reference|Quick Reference]] — Cheat sheet of essential CLI commands, MCP tool patterns, and error handling templates.
- [[nodes/integration-points|Integration Points]] — Framework integration, related skills, and external tool dependencies.
