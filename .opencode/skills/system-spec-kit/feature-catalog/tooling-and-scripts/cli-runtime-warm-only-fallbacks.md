---
title: "Warm-only CLI hook fallbacks and plugin bridges"
description: "Runtime integrations for the 028 CLI program: prompt-time hooks in Claude and OpenCode adapters gain a warm-only CLI fallback (socket probe first, fast fail-open, no prompt-time cold spawn), and the OpenCode plugins route over CLI/IPC with zero in-process DB imports."
trigger_phrases:
  - "warm-only hook fallback"
  - "cli fallback hooks"
  - "transport-down fail-open"
  - "opencode plugin cli bridge"
version: 3.6.0.1
---

# Warm-only CLI hook fallbacks and plugin bridges

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A CLI nobody's runtime calls does not close the transport-down incident class, so every 028 CLI workstream shipped paired runtime integrations. Prompt-time hooks for Claude Code and OpenCode gained a shared warm-only CLI fallback helper per system: the hook probes the daemon socket first, uses the CLI when the daemon is warm, and fails open in about a millisecond when no socket exists. Cold spawn stays confined to SessionStart, explicit prewarm, cron, or non-prompt maintenance contexts.

OpenCode gained a plugin route with a CLI fallback in `system-skill-advisor` that leaves the primary bridge path untouched. The bridge uses CLI/IPC transport only — zero in-process database imports, so the dual-writer hazard that forced the earlier revert cannot return.

The `spec-memory` and `code-index` halves of this integration were removed with their servers. `system-skill-advisor` is the only system still behind this contract, and it is the one that powers Gate 2.

---

## 2. HOW IT WORKS

### Warm-only helpers per system

`skill-advisor-cli-fallback.ts` (system-skill-advisor hooks) wraps the CLI with a socket probe and `--warm-only --timeout-ms` invocation. No socket means a fast fail-open return (measured around 1 ms; warm calls measured 117-198 ms), and the hook result simply omits the CLI-backed extras rather than blocking the prompt.

### Hook wiring

The Claude and OpenCode `user-prompt-submit.ts` advisor hooks use the skill-advisor helper. The one-shot native bridge (measured 824.8 ms) stays banned from the prompt path.

### Allowlists and guidance

`.opencode/settings.json` allowlists the CLI invocations for OpenCode (the Claude allowlist lives in local-only settings by decision), and `AGENTS.md` carries the transport-down fallback and maintenance-tool policy guidance.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Hook helper | Shared warm-only skill-advisor CLI fallback |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Hook adapter | Claude advisor hook with CLI fallback |
| `.opencode/plugins/system-skill-advisor.js` | OpenCode plugin | Advisor plugin with CLI fallback routing |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` | Plugin bridge | CLI fallback route with primary path untouched |
| `.opencode/settings.json` | Runtime config | OpenCode allowlist for CLI use |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-advisor-cli-dual-client.vitest.ts` | Automated test | Dual-client MCP + CLI coverage for the advisor daemon |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/cli-runtime-warm-only-fallbacks.md`
