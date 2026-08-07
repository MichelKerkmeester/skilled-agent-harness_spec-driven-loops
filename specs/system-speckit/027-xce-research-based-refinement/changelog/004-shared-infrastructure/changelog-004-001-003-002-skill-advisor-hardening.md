---
title: "Changelog: 003-skill-advisor-cli / 002-hardening-and-tests"
description: "Skill-advisor hardening shipped: parity fixture (10/10 local-vs-native), job semantics, orphan reaping, dual-client suites, and the tri-daemon spawn drill program gate (PASSED)."
trigger_phrases:
  - "skill-advisor hardening changelog"
  - "skill-advisor phase 2 changelog"
  - "tri-daemon drill changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli`

### Summary

The skill-advisor hardening phase shipped parity, job-semantics, orphan-reaping, and dual-client regression suites plus the env-gated tri-daemon spawn drill that serves as the program gate. The parity fixture runs real `python3` local scorer against the native path confirming 10/10 identical top recommendations. The orphan-reaping suite exercises the real launcher via killed parent, removed worktree, and warm adoption scenarios. The tri-daemon drill verified all three CLIs auto-spawning simultaneously with per-launcher single-owner, respawn-lock serialization, divergent SIGTERM reap, and zero orphans. Drill PASSED.

### Added

- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` — D2 10-prompt local-vs-native parity fixture (runs real python3)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-job-semantics.vitest.ts` — D5 rebuild/scan job semantics with measured wall-time under mutation
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` — D6 orphan-reaping against the real launcher (killed parent, removed worktree, warm adoption)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` — dual-client MCP and CLI coverage against one daemon
- `.opencode/skills/system-skill-advisor/mcp_server/tests/tri-daemon-drill.vitest.ts` — env-gated tri-daemon spawn drill (program gate)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-test-utils.ts` — shared sandbox harness and test utilities
- `.opencode/skills/system-skill-advisor/mcp_server/tests/tsconfig.tests.json` — test-only TypeScript configuration

### Changed

- None

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Vitest suites | 9/9 green in sandbox |
| D2 parity fixture | 10/10 identical top recommendations (real python3 vs native) |
| D5 job semantics | Rebuild and scan wall-time measured under mutation |
| D6 orphan reaping | Real-launcher fixtures pass (killed parent, removed worktree, warm adoption) |
| Dual-client | MCP + CLI against one daemon verified |
| Tri-daemon drill (program gate) | PASSED 1/1: per-launcher single-owner, respawn-lock serialization, divergent SIGTERM reap, zero orphans |
| Host isolation | Host daemons untouched |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | Added | D2 10-prompt local-vs-native parity |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-job-semantics.vitest.ts` | Added | D5 rebuild/scan job semantics |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Added | D6 orphan-reaping against real launcher |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` | Added | Dual-client MCP + CLI coverage |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/tri-daemon-drill.vitest.ts` | Added | Env-gated tri-daemon spawn drill |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-test-utils.ts` | Added | Shared sandbox harness |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/tsconfig.tests.json` | Added | Test-only TypeScript config |

### Follow-Ups

- Multi-runtime transport-down drill remains open in `003-runtime-integration`
