---
title: "Changelog: 001-spec-memory-cli / 003-runtime-integration"
description: "Spec-memory runtime integration shipped: warm-only CLI fallback in Claude/Codex hooks, OpenCode plugin bridge, allowlist updates, and transport-down guidance."
trigger_phrases:
  - "spec-memory runtime integration changelog"
  - "spec-memory allowlist changelog"
  - "dual-stack rollout changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli`

### Summary

The spec-memory runtime integration wired warm-only CLI fallback into the Claude and Codex prompt-time hook paths and shipped an OpenCode plugin bridge over the CLI/IPC transport. The prompt-time path probes the socket first, fails open in under 1ms when the socket is absent, and never cold-spawns from a prompt-time context. The OpenCode bridge avoids in-process database imports. MCP registrations were left untouched to maintain the dual-stack window.

### Added

- `.opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts` — shared warm-only CLI fallback helper (socket probe first, 1ms fail-open, 117ms warm path)
- `.opencode/plugins/mk-spec-memory.js` — OpenCode spec-memory plugin surface
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` — CLI/IPC bridge with zero in-process DB imports

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` — gains CLI fallback path
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` — gains CLI fallback path
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` — gains CLI fallback path
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` — gains CLI fallback path
- `.codex/settings.json` — Codex allowlist for CLI use
- `.claude/settings.local.json` — Claude allowlist for CLI use
- `AGENTS.md` — transport-down fallback guidance added

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Build | PASS (clean) |
| Hook smoke (no-socket fail-open) | PASS |
| Hook smoke (warm path) | PASS |
| Bridge syntax (`node --check`) | PASS |
| Bridge warm smoke | `status ok`, route `cli` |
| MCP registrations diff | Empty (untouched) |
| Requirements REQ-001 to REQ-008 | PASS (REQ-005 observation in progress by design) |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts` | Added | Shared warm-only CLI fallback helper |
| `.opencode/plugins/mk-spec-memory.js` | Added | OpenCode spec-memory plugin surface |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` | Added | CLI/IPC bridge with zero in-process DB imports |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modified | Claude hook path gains CLI fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Modified | Claude compaction path gains CLI fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modified | Claude stop hook gains CLI fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Modified | Codex session-start hook gains CLI fallback |
| `.codex/settings.json` | Modified | Codex allowlist for CLI use |
| `.claude/settings.local.json` | Modified | Claude allowlist for CLI use |
| `AGENTS.md` | Modified | Transport-down fallback guidance |

### Follow-Ups

- REQ-005 dual-stack observation window remains in progress by design
- Final program-level multi-runtime transport-down drill tracked outside this phase
