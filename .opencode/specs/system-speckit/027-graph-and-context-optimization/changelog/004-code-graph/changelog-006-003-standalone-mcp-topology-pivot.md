---
title: "Code Graph 006-003: Standalone MCP Topology Pivot (ADR-002)"
description: "Pivoted code-graph MCP registration from co-resident under spec_kit_memory to a standalone system_code_graph server. Migrated 10 tool schemas, created launcher plus server entrypoint, moved stress tests plus bridge assets. Cleaned stale stub database."
trigger_phrases:
  - "standalone mcp topology pivot"
  - "ADR-002 code graph topology"
  - "system code graph standalone mcp"
  - "code graph tool schema migration"
  - "mcp topology pivot 006-003"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation/003-standalone-mcp-topology-pivot` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation`

### Summary

ADR-001 Q3 had registered code-graph MCP tools as co-resident under the `spec_kit_memory` server. The user reversed that decision on 2026-05-14 and required a standalone MCP server for code-graph tooling. At the same time, the physical source tree had already been flattened so runtime code lived at `system-code-graph/mcp_server/{lib,handlers,tools,tests}/` rather than under an intermediate `code_graph/` subdirectory.

ADR-002 was authored to supersede ADR-001 Q3 while leaving Q1, Q2, Q4 through Q8 plus Constraint A intact. The standalone server launcher, server entrypoint, plus 10 migrated tool schemas were created. Tool schemas were removed from `spec_kit_memory`. Stress tests, the plugin bridge, plus pure internal external tests were moved to system-code-graph ownership. The stale stub database at the old spec-kit path was deleted. Six historical child-packet metadata files were recalibrated to reflect the new canonical layout.

All typechecks passed. The full 395-test Vitest suite passed. Strict packet validation passed at completion.

### Added

- `system-code-graph-launcher.cjs` standalone MCP launcher with `artifactsReady()` check
- `.opencode/skills/system-code-graph/mcp_server/index.ts` standalone MCP server entrypoint registering only code-graph tools
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` exporting 10 migrated code-graph tool schemas
- `decision-record.md` ADR-002 explicitly superseding ADR-001 Q3

### Changed

- `opencode.json` updated to register `system_code_graph` server entry pointing to the new launcher
- Agent and command tool grant namespace updated from `mcp__mk_spec_memory__*` to `mcp__system_code_graph__*` for code-graph tools
- Code-graph indexing environment defaults relocated from spec-kit server entry to standalone server entry
- 6 historical child-packet `graph-metadata.json` and `implementation-summary.md` files recalibrated to reflect the flattened layout
- `doctor/update.md` mutation boundary paths corrected to `.opencode/skills/system-code-graph/mcp_server/database/...` prefixes
- `system-code-graph` `SKILL.md` and `README.md` updated to reflect standalone ownership

### Fixed

- `spec_kit_memory` still registered all 10 code-graph MCP tool schemas after the source tree was flattened. Schemas migrated and removed from spec-kit.
- `doctor/update.md` mutation boundary table rows referenced the old co-resident path. Corrected to the standalone path.
- Stale stub database at `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` (and WAL/SHM sidecars) was deleted. Live 53 MB index remains at the canonical standalone path.

### Verification

| Check | Result |
|-------|--------|
| 007 strict validate | exit 0 |
| 014 recursive strict validate | exit 0 |
| system-spec-kit typecheck (post-SDK-restore) | exit 0 |
| system-code-graph typecheck (post-SDK-restore) | exit 0 |
| system-code-graph build to dist/ | exit 0. Redirect stub at `mcp_server/dist/index.js` created. |
| system-code-graph full Vitest | exit 0. 395 passed, 9 skipped across 40 files. 6 stale-path bugs fixed post-handover. |
| system-spec-kit tool-input-schema + review-fixes Vitest | exit 0. 74 passed. 3 dead describe-blocks removed. Tool count 55 to 49. |
| system-spec-kit P1 stress tests | exit 0. 2 passed (w10-degraded-readiness, gate-d-benchmark-session-resume). |
| spec-kit remaining code-graph schema grep | 0 matches |
| system-code-graph migrated schema grep | 10 schemas confirmed |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/system-code-graph-launcher.cjs` (NEW) | Standalone launcher with `artifactsReady()` check and redirect stub. Renamed to `mk-code-index-launcher.cjs` in a later packet. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` (NEW) | Standalone MCP server entrypoint registering 10 code-graph tools. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` (NEW) | Exports `CODE_GRAPH_TOOL_SCHEMAS` with 10 migrated schema definitions. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Removed all `code_graph_*`, `ccc_*`, plus `detect_changes` schema definitions. |
| `opencode.json` | Added `system_code_graph` server entry. Relocated code-graph env defaults. |
| `003-standalone-mcp-topology-pivot/decision-record.md` (NEW) | ADR-002 superseding ADR-001 Q3 with preserved Q1/Q2/Q4-Q8 decisions. |

### Follow-Ups

- MCP children must be restarted before the new standalone server becomes visible to clients. The implementation-summary records this as a known limitation at handover.
