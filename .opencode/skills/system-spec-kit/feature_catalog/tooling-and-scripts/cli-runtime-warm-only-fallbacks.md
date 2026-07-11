---
title: "Warm-only CLI hook fallbacks and plugin bridges"
description: "Runtime integrations for the 028 CLI program: prompt-time hooks in Claude and OpenCode adapters gain a warm-only CLI fallback (socket probe first, fast fail-open, no prompt-time cold spawn), and the OpenCode plugins route over CLI/IPC with zero in-process DB imports."
trigger_phrases:
  - "warm-only hook fallback"
  - "cli fallback hooks"
  - "transport-down fail-open"
  - "opencode plugin cli bridge"
  - "mk-spec-memory plugin"
version: 3.6.0.1
---

# Warm-only CLI hook fallbacks and plugin bridges

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A CLI nobody's runtime calls does not close the transport-down incident class, so every 028 CLI workstream shipped paired runtime integrations. Prompt-time hooks for Claude Code and OpenCode gained a shared warm-only CLI fallback helper per system: the hook probes the daemon socket first, uses the CLI when the daemon is warm, and fails open in about a millisecond when no socket exists. Cold spawn stays confined to SessionStart, explicit prewarm, cron, or non-prompt maintenance contexts.

OpenCode gained a per-system plugin route: a NEW `mk-spec-memory` plugin (memory access in OpenCode was MCP-only before 028), a REPAIRED `mk-code-graph` bridge that replaced the reverted in-process dist/DB imports with the CLI route and blocks maintenance tools at prompt time, and a CLI fallback route in `mk-skill-advisor` that leaves the primary bridge path untouched. All plugin bridges use CLI/IPC transport only — zero in-process database imports, so the dual-writer hazard that forced the earlier revert cannot return.

## 2. HOW IT WORKS

### Warm-only helpers per system

`spec-memory-cli-fallback.ts` and `code-index-cli-fallback.ts` (system-spec-kit hooks) and `skill-advisor-cli-fallback.ts` (system-skill-advisor hooks) wrap the CLI with a socket probe and `--warm-only --timeout-ms` invocation. No socket means a fast fail-open return (measured around 1 ms; warm calls measured 117-198 ms), and the hook result simply omits the CLI-backed extras rather than blocking the prompt.

### Hook wiring

Claude adapters `session-prime.ts`, `compact-inject.ts`, and `session-stop.ts` plus OpenCode `session-start.ts` use the spec-memory and code-index helpers; the Claude and OpenCode `user-prompt-submit.ts` advisor hooks use the skill-advisor helper. The one-shot native bridge (measured 824.8 ms) stays banned from the prompt path.

### Allowlists and guidance

`.opencode/settings.json` allowlists the CLI invocations for OpenCode (the Claude allowlist lives in local-only settings by decision), and `AGENTS.md` carries the transport-down fallback and maintenance-tool policy guidance.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/hooks/spec-memory-cli-fallback.ts` | Hook helper | Shared warm-only spec-memory CLI fallback |
| `mcp_server/hooks/code-index-cli-fallback.ts` | Hook helper | Shared warm-only code-index CLI fallback |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Hook helper | Shared warm-only skill-advisor CLI fallback |
| `mcp_server/hooks/claude/session-prime.ts` | Hook adapter | Claude session priming with CLI warm path |
| `mcp_server/hooks/claude/compact-inject.ts` | Hook adapter | Claude compaction path with CLI fallback |
| `mcp_server/hooks/claude/session-stop.ts` | Hook adapter | Claude stop hook with CLI fallback |
| `mcp_server/hooks/opencode/session-start.ts` | Hook adapter | OpenCode session-start with CLI warm path |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Hook adapter | Claude advisor hook with CLI fallback |
| `.opencode/skills/system-skill-advisor/hooks/opencode/user-prompt-submit.ts` | Hook adapter | OpenCode advisor hook with CLI fallback |
| `.opencode/plugins/mk-spec-memory.js` | OpenCode plugin | New spec-memory plugin surface |
| `mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` | Plugin bridge | CLI/IPC bridge, zero in-process DB imports |
| `.opencode/plugins/mk-code-graph.js` | OpenCode plugin | Synthesizes its transport contract from the status payload |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | Plugin bridge | Repaired to the CLI route; maintenance tools blocked at prompt time |
| `.opencode/plugins/mk-skill-advisor.js` | OpenCode plugin | Advisor plugin with CLI fallback routing |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Plugin bridge | CLI fallback route with primary path untouched |
| `.opencode/settings.json` | Runtime config | OpenCode allowlist for CLI use |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` | Automated test | MCP and CLI clients concurrently against one daemon |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts` | Automated test | Real MCP+CLI dual-client coverage for code-index |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` | Automated test | Dual-client MCP + CLI coverage for the advisor daemon |

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling-and-scripts/cli-runtime-warm-only-fallbacks.md`
Related references:
- [spec-memory-cli-daemon-backed-surface.md](spec-memory-cli-daemon-backed-surface.md) — Daemon-backed spec-memory CLI surface
