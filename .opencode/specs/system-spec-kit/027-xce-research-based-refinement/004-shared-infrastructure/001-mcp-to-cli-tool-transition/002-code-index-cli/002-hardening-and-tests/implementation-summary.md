---
title: "Implementation Summary: Phase 2: Hardening and Tests [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/implementation-summary]"
description: "Shipped summary for Phase 2 Hardening and Tests: code-index CLI hardening suites and verification."
trigger_phrases:
  - "code-index hardening and tests result"
  - "002 002-hardening-and-tests result"
  - "code-index phase 2 result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-09T19:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Reconciled shipped code-index hardening evidence"
    next_safe_action: "Use phase as verified handoff for runtime integration"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests |
| **Completed** | Yes - shipped and verified |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code-index CLI hardening phase shipped the regression suites for dual-client safety, owner lease respawn behavior, blocked-read rendering, schema parity, and teardown cleanliness. The shipped test package keeps host daemons untouched while exercising real MCP+CLI paths in sandbox.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts` | Added | Shared sandbox harness for CLI/MCP daemon tests |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts` | Added | D8 real MCP+CLI dual-client coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts` | Added | D9 real owner-lease and fresh-launcher takeover coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Added | Stale-readiness blocked output coverage for 9 cases |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` | Added | Locks 8 code-graph tools from `CODE_GRAPH_TOOL_SCHEMAS` |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-teardown.vitest.ts` | Added | Verifies zero orphan teardown after the suite |
| `.opencode/skills/system-code-graph/mcp_server/tests/tsconfig.tests.json` | Added | Test-only TypeScript configuration |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery used a sandboxed vitest harness rather than host daemon state. D8 covers a real MCP client and CLI client against one daemon. D9 reads the real `.code-graph-owner.json` lease and asserts fresh-launcher takeover. Blocked-read coverage asserts `status:blocked` plus `requiredAction`; parity locks all 8 schema-declared tools; teardown asserts zero orphaned daemon or launcher processes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exercise real lease and client paths in sandbox | The regressions involve daemon ownership, sockets, and MCP/CLI interaction, so mock-only coverage would not lock the failure mode |
| Keep host daemons untouched | The suite must prove lifecycle behavior without disrupting active operator sessions |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck | Exit 0 with `tsc` 5.9.3 |
| Vitest | 16/16 green in sandbox |
| D8 dual-client | Real MCP + CLI path verified |
| D9 owner respawn | Real lease read and fresh-launcher takeover verified |
| Blocked-read suite | 9 stale cases assert `status:blocked` plus `requiredAction` |
| Parity suite | 8 tools locked from `CODE_GRAPH_TOOL_SCHEMAS` |
| Teardown | Zero orphan teardown; host daemons untouched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. None in the supplied verification evidence.
<!-- /ANCHOR:limitations -->
