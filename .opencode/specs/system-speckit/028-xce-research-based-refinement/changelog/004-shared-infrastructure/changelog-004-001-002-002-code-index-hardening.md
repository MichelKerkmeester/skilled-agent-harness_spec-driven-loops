---
title: "Changelog: 002-code-index-cli / 002-hardening-and-tests"
description: "Code-index CLI hardening shipped: six Vitest suites covering dual-client safety, owner lease respawn, blocked-read rendering, schema parity, and teardown cleanliness."
trigger_phrases:
  - "code-index hardening changelog"
  - "code-index phase 2 changelog"
  - "code-index cli dual-client changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli`

### Summary

The code-index CLI hardening phase shipped six Vitest suites that regression-lock the critical failure modes identified in the research delta set. The suites exercise real MCP and CLI paths in a sandbox harness, with D8 covering real dual-client concurrency, D9 reading the real `.code-graph-owner.json` lease for fresh-launcher takeover, blocked-read rendering asserting `status:blocked` and `requiredAction` across 9 stale cases, parity locking all 8 schema-declared tools, and teardown verifying zero orphaned processes. Host daemons stayed untouched.

### Added

- `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts` — shared sandbox harness for CLI/MCP daemon tests
- `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts` — D8 real MCP and CLI dual-client coverage
- `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts` — D9 real owner-lease and fresh-launcher takeover coverage
- `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts` — stale-readiness blocked output coverage (9 cases)
- `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` — 8-tool lock from `CODE_GRAPH_TOOL_SCHEMAS`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-teardown.vitest.ts` — zero-orphan teardown verification
- `.opencode/skills/system-code-graph/mcp_server/tests/tsconfig.tests.json` — test-only TypeScript configuration

### Changed

- None

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Typecheck (`tsc` 5.9.3) | Exit 0 |
| Vitest | 16/16 green in sandbox |
| D8 dual-client | Real MCP + CLI path verified |
| D9 owner respawn | Real lease read and fresh-launcher takeover verified |
| Blocked-read suite | 9 stale cases assert `status:blocked` and `requiredAction` |
| Parity suite | 8 tools locked from `CODE_GRAPH_TOOL_SCHEMAS` |
| Teardown | Zero orphan teardown; host daemons untouched |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts` | Added | Shared sandbox harness |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts` | Added | D8 real MCP + CLI dual-client |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts` | Added | D9 real lease and fresh-launcher takeover |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Added | 9-case blocked-read coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` | Added | 8-tool parity lock |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-teardown.vitest.ts` | Added | Zero-orphan teardown |
| `.opencode/skills/system-code-graph/mcp_server/tests/tsconfig.tests.json` | Added | Test-only TypeScript config |

### Follow-Ups

- None identified; runtime integration proceeds in `003-runtime-integration`
