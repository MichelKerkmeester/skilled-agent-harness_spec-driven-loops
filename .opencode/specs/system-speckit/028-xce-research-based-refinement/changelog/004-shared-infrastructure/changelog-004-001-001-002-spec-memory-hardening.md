---
title: "Changelog: 001-spec-memory-cli / 002-hardening-and-tests"
description: "Spec-memory CLI hardening shipped: four Vitest suites locking dual-spawn, dual-client concurrency, lifecycle, and 37-tool parity."
trigger_phrases:
  - "spec-memory cli hardening changelog"
  - "dual spawn vitest changelog"
  - "cli parity suite changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli`

### Summary

The spec-memory CLI hardening phase shipped four Vitest suites that regression-lock the critical safety contracts of the dual-stack deployment. The suites cover dual-spawn hardening (with and without reelection), dual-client MCP and CLI concurrency against one daemon, lifecycle cleanup and transparent recycle behavior, and 37-tool parity with CLI help output. Exit-69 recovery help text was added to `spec-memory-cli.ts`. Host daemons stayed untouched throughout.

### Added

- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-dual-spawn-hardening.vitest.ts` — dual-spawn hardening including reelection-on and reelection-off cases
- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` — real MCP client and CLI client running concurrently against one daemon
- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-lifecycle-hardening.vitest.ts` — N-probe reap gating and SIGTERM transparent recycle behavior
- `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` — 37-tool parity lock and CLI help output verification

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` — added exit-69 recovery help text

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Clean build | PASS |
| Vitest hardening suites | 10/10 green in sandbox |
| Dual-spawn coverage | Reelection-on and reelection-off cases covered |
| Dual-client coverage | Real MCP and CLI clients covered concurrently |
| Lifecycle coverage | N-probe reap gating and SIGTERM transparent recycle covered |
| Parity coverage | 37-tool parity locked against `TOOL_DEFINITIONS` |
| Host isolation | Host daemons untouched |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-dual-spawn-hardening.vitest.ts` | Added | Dual-spawn hardening including reelection on and off |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` | Added | Real MCP and CLI clients concurrently against one daemon |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-lifecycle-hardening.vitest.ts` | Added | N-probe reap gating and SIGTERM transparent recycle |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` | Added | 37-tool parity lock and help output |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | Updated | Added exit-69 recovery help text |

### Follow-Ups

- Full end-to-end multi-runtime transport-down behavior is intentionally deferred to `003-runtime-integration`
