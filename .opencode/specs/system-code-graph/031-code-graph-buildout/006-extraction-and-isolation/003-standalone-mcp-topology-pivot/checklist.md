---
title: "Checklist: MCP topology pivot"
description: "Verification checklist CHK-200..230 for ADR-002 standalone MCP topology pivot."
trigger_phrases:
  - "mcp topology pivot"
  - "system code graph standalone mcp"
  - "ADR-002 code graph topology"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/003-standalone-mcp-topology-pivot"
    last_updated_at: "2026-05-14T09:24:15Z"
    last_updated_by: "claude"
    recent_action: "Validated ADR-002 standalone MCP topology pivot"
    next_safe_action: "Restart MCP children to pick up system_code_graph"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140007"
      session_id: "007-mcp-topology-pivot"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: MCP topology pivot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate 007 packet. Evidence: `validate.sh .../007-mcp-topology-pivot --strict` final exit recorded as 0.
- [x] CHK-201 [P0] Recursive strict validate 014 parent. Evidence: `validate.sh .../013-system-code-graph-extraction --strict --recursive` final exit recorded as 0.
- [x] CHK-202 [P0] Typecheck system-spec-kit. Evidence: `npx tsc --noEmit -p mcp_server/tsconfig.json` exit 0.
- [x] CHK-203 [P0] Typecheck system-code-graph. Evidence: local TypeScript binary ran `tsc --noEmit -p tsconfig.json` exit 0.
- [x] CHK-204 [P1] Smoke Vitest at new system-code-graph test location. Evidence: `vitest run mcp_server/tests/code-graph-scan.vitest.ts` passed 39 tests.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] Gate 3 pre-answered by user.
- [x] CHK-211 [P0] ADR-001 Q3 reversal explicit.
- [x] CHK-212 [P0] Historical 001-006 docs protected except graph metadata and implementation summaries.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-213 [P0] No code-graph algorithm, parsing, scoring, scan-scope, or query semantic changes. Evidence: changes were limited to topology/config/docs/schema ownership and TypeScript project wiring.
- [x] CHK-214 [P0] Standalone entrypoint registers code-graph tools only. Evidence: `mcp_server/index.ts` lists `CODE_GRAPH_TOOL_SCHEMAS` and dispatches through system-code-graph tools.
- [x] CHK-215 [P1] spec_kit_memory keeps direct lib imports but no longer dispatches code-graph MCP tools. Evidence: spec-kit schemas grep count is 0 and tools/index.ts retains only ADR-002 comment marker.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-216 [P0] opencode.json parses and includes system_code_graph. Evidence: JSON parse assertion passed and spec_kit_memory no longer carries code-graph index env flags.
- [x] CHK-217 [P0] system-code-graph launcher exists and is executable. Evidence: `.opencode/bin/system-code-graph-launcher.cjs` exists with executable bit.
- [x] CHK-218 [P0] system-code-graph entrypoint exists. Evidence: `.opencode/skills/system-code-graph/mcp_server/index.ts` exists.
- [x] CHK-219 [P1] Tool schema migration count recorded. Evidence: system-code-graph tool schema grep count is 10 and spec-kit remaining count is 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-220 [P0] Agent/command MCP namespace grants updated. Evidence: two command files changed and old spec_kit_memory code-graph namespace grep is empty.
- [x] CHK-221 [P0] doctor/update.md mutation boundary paths fixed. Evidence: target table rows use `.opencode/skills/.../mcp_server/database/...` prefixes.
- [x] CHK-222 [P0] Stub DB deleted or holder documented. Evidence: no stale `system-spec-kit/mcp_server/database/code-graph.sqlite*` files remain.
- [x] CHK-223 [P1] Parent 014 and parent 005-code-graph metadata updated. Evidence: 014 status is complete, last active child points at 007, and 005-code-graph marks 014 complete.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-224 [P0] No secrets required.
- [x] CHK-225 [P0] No network fetch required by implementation.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-226 [P1] ADR-002 written.
- [x] CHK-227 [P1] SKILL.md/README.md updated for standalone MCP topology.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-228 [P0] Code-graph schemas live in system-code-graph.
- [x] CHK-229 [P1] Plugin bridge and stress tests live in system-code-graph.
- [x] CHK-230 [P0] Final metrics recorded in implementation-summary.md. Evidence: required key/value block appears under Verification.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All checklist items have direct file, grep, or command evidence. Final strict validator exits are recorded in implementation-summary.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-231 [P2] Smoke Vitest completes under timeout. Evidence: smoke Vitest completed inside the 120s timeout.
<!-- /ANCHOR:perf-verify -->
