---
title: "Changelog: Preconditions and Build (Playbook Run Phase 001)"
description: "Both MCP servers were built and verified, environment flags confirmed, evidence workspaces created, and CLI executors authenticated, establishing a known-good baseline for the 46-scenario playbook run."
trigger_phrases:
  - "playbook preconditions changelog"
  - "skill advisor build precondition"
  - "028 phase 001 changelog"
  - "MCP server build verification"
  - "playbook run environment setup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/001-preconditions-and-build` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation`

### Summary

This phase brought the environment to a known-good state before any scenario ran. Both MCP servers compile clean, the hook-disable flag is unset, evidence workspaces exist, and both CLI executors are authenticated. The 46-scenario run that follows will measure the real system instead of a stale build.

### Added

- Both MCP servers built from source, producing current dist artifacts with devin hook runtime present for the advisor

### Changed

- None.

### Fixed

- None.

### Verification

- system-spec-kit build: PASS (dist/api/index.js, dist/cli.js, dist/context-server.js emitted)
- system-skill-advisor build: PASS (exit 0, dist/hooks/devin/user-prompt-submit.js present)
- Hook disable flag: PASS (unset)
- advisor_status: PASS (live, generation 4463, skillCount 23)
- devin auth: PASS (Logged in)
- opencode providers: PASS (DeepSeek, OpenCode Go, OpenAI configured)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `system-spec-kit/mcp_server/dist/**` | Build artifact | Compiled runtime (untracked) |
| `system-skill-advisor/mcp_server/dist/**` | Build artifact | Advisor runtime plus hooks (untracked) |
| `/tmp/skill-advisor-playbook/`, `/tmp/devin-hook-playbook/` | Created | Evidence workspaces |

### Follow-Ups

- Shell `DEEPSEEK_API_KEY` is unset. Dispatch works because opencode reads its own credential store, but a raw-shell DeepSeek call would still need the env var.
- `skill_graph_status` reports 21 skills versus `advisor_status` 23. The graph DB indexes 21 while the advisor counts 23 discovered `graph-metadata.json` files (2 extra are non-graph entries). This is expected and documented in phase 002.
