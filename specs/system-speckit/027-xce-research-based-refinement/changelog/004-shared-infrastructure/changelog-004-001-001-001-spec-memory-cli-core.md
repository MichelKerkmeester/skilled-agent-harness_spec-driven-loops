---
title: "Changelog: 001-spec-memory-cli / 001-cli-core"
description: "Daemon-backed spec-memory CLI shipped: compiled spec-memory-cli.ts behind bin/spec-memory.cjs, 37 subcommands from TOOL_DEFINITIONS, Zod argv validation, IPC call path, and live daemon smoke passing."
trigger_phrases:
  - "spec-memory cli core changelog"
  - "cli subcommand codegen changelog"
  - "spec-memory shim changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-07

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/001-cli-core` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli`

### Summary

The spec-memory CLI core shipped as a thin IPC client over the unchanged mk-spec-memory daemon. The implementation generates its 37-subcommand map at runtime from `TOOL_DEFINITIONS`, validates argv with the existing Zod schemas, sends `tools/call` JSON-RPC frames over the daemon socket, auto-spawns via the existing launcher when the daemon probe fails, and renders `json`, `jsonl`, or text output. The existing MCP surface was left untouched. Live daemon smoke confirmed `memory_stats` returns real data.

### Added

- `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` — daemon-backed CLI entrypoint with runtime command generation from `TOOL_DEFINITIONS`
- `.opencode/bin/spec-memory.cjs` — stable executable shim with dist-freshness guard (exit 69) and socket-path default for `SPECKIT_IPC_SOCKET_DIR`
- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts` — parser, IPC, retryable error, and protocol-drift test coverage

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/package.json` — added `spec-memory` package bin entry
- `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` — included `spec-memory-cli.ts` in builds

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| CLI regression tests (`cli.vitest.ts` + `spec-memory-cli.vitest.ts`) | 11 passed |
| TypeScript (`npm run typecheck`) | PASS |
| Build (`npm run build`) | PASS |
| Shim list-tools smoke | `TOOL_DEFINITIONS` surface returned |
| Live daemon smoke (`memory_stats`) | Returned 9492 memories across 1123 folders |
| Comment hygiene | PASS on changed CLI/shim/test files |
| Strict spec validation | PASS (0 errors, 0 warnings) |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | Created | Daemon-backed CLI entrypoint and runtime command generation |
| `.opencode/bin/spec-memory.cjs` | Created | Stable executable shim with dist-freshness and socket-path guards |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts` | Created | Parser, IPC, retryable, and protocol-drift coverage |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Updated | Added `spec-memory` package bin |
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Updated | Included `spec-memory-cli.ts` in builds |

### Follow-Ups

- Dual-spawn races, dual-client parity, full 37-command invocation matrix, and runtime allowlists remain phase 002/003 work
