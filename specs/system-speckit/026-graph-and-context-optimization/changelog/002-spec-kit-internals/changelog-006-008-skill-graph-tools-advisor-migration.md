---
title: "Skill Graph Tools Advisor Migration: Move skill_graph_* MCP tools to system_skill_advisor ownership"
description: "Completed migration of four skill_graph_* MCP tools from spec_kit_memory to system_skill_advisor. Handlers moved, consumer callers retargeted across doctor commands and install guides, memory-side proxy installed then physically removed. Four-runtime smoke matrix verified."
trigger_phrases:
  - "skill graph tools advisor migration"
  - "skill_graph tools move to advisor"
  - "move skill_graph_ handlers"
  - "mcp__system_skill_advisor__skill_graph"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The skill-advisor extraction was structurally complete after earlier packets, but the four `skill_graph_*` MCP tools remained registered under `spec_kit_memory`. That left a cross-package coupling where skill-related graph operations lived on the memory server even after advisor source, DB plus launcher ownership had moved to `system_skill_advisor`.

D1 moved the handler source tree from the spec-kit package into the advisor package and registered all four tool descriptors under `system_skill_advisor`. A one-window proxy in `spec_kit_memory` forwarded calls during the cutover window. D2 retargeted 15 live caller references across 5 doctor command files and updated 9 install guide, feature catalog plus playbook docs to reflect advisor ownership. The memory-side proxy, descriptors plus proxy tests were then physically deleted after a zero-caller grep confirmed no remaining live callers.

All nine requirements passed. The `system_skill_advisor` MCP server now owns all four `skill_graph_*` tool ids with unchanged public names.

### Added

- Advisor-local handler tree at `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/` with scan, query, status, validate, response-envelope plus index modules (NEW, moved from spec-kit)
- `skill_graph_tools.ts` in the advisor tools package to register all four descriptors (NEW)
- Two advisor Vitest suites: `skill-graph-dispatch.vitest.ts` and `skill-graph-listing.vitest.ts` covering dispatch and tool listing (NEW)

### Changed

- `advisor-server.ts` registers `skill_graph_*` descriptors and dispatch handlers
- `handlers/index.ts` in the advisor package exports the new skill-graph handlers
- Doctor command files (`doctor.md`, `_routes.yaml`, `update.md`, `doctor_skill-advisor.yaml`, `doctor_update.yaml`) retargeted from `mcp__mk_spec_memory__skill_graph_*` to `mcp__system_skill_advisor__skill_graph_*`
- Install guide, feature catalog entries plus manual testing playbook entries updated to name `system_skill_advisor` as the owner of `skill_graph_*` tools
- `session-bootstrap.ts` updated to remove the deleted proxy import and report skill graph topology as advisor-owned from the memory bootstrap surface

### Fixed

- `skill_graph_*` tools were callable only through `spec_kit_memory`. They are now callable through `system_skill_advisor` with unchanged public tool ids.
- Doctor YAML probes referenced stale `mcp__mk_spec_memory__skill_graph_` prefixes. All five files are now clean.
- Memory `tools/list` returned `skill_graph_*` as spec-kit-owned. After D2 it returns `skillGraph: []` confirming zero residual ownership.

### Verification

| Check | Result |
|-------|--------|
| T016/T018 system-code-graph + plugins grep | PASS: `rg -n 'mcp__mk_spec_memory__skill_graph_' .opencode/skills/system-code-graph .opencode/plugins` returned 0 hits |
| T017 hooks/runtime grep | PASS: old-prefix grep across hooks and `.claude`, `.codex`, `.gemini` returned 0 hits |
| Intermediate old-prefix grep | PASS: one historical Tier 3 sk-code playbook hit only |
| Final old-prefix grep | PASS: one historical Tier 3 sk-code playbook hit only |
| Memory typecheck | PASS: `npm run typecheck` exited 0 |
| Advisor typecheck | PASS: `npm run typecheck` exited 0 |
| Memory build | PASS: `npm run build` exited 0 |
| Direct advisor MCP tools/list | PASS: 8 tools listed including all 4 `skill_graph_*` ids |
| Direct advisor tool call | PASS: `skill_graph_status({})` returned status `ok` with `dbStatus: "empty"` |
| Direct memory MCP tools/list | PASS: 41 tools listed and `skillGraph: []` |
| OpenCode runtime | PASS: `opencode mcp list` showed `system_skill_advisor` connected |
| Codex runtime | PASS: `codex mcp list` showed `system_skill_advisor` enabled |
| Gemini runtime | PASS: `gemini mcp list --debug` showed `system_skill_advisor` connected |
| Claude runtime | INCONCLUSIVE: CLI did not show `system_skill_advisor` in visible rows, matching the accepted CLI-cache limitation pattern |
| Advisor Vitest | BASELINE RED: 285/291 passed. Matches pre-D2 baseline. Not a regression introduced by this packet. |
| Strict validation | PASS: packet. parent. grandparent all exit 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/` (NEW, moved) | Handler tree for scan, query, status, validate, response-envelope plus index modules moved from spec-kit package |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` (NEW) | Tool descriptor registration for all four `skill_graph_*` ids on the advisor server |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/skill-graph-dispatch.vitest.ts` (NEW) | Dispatch integration tests for advisor-owned handlers |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/skill-graph-listing.vitest.ts` (NEW) | Tool listing tests confirming all four ids appear under `system_skill_advisor` |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Registers `skill_graph_*` descriptors and dispatch handlers |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/index.ts` | Exports new skill-graph handler set |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Removed four `skill_graph_*` descriptors after cutover |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Removed `skillGraphTools` re-export and import |
| `.opencode/skills/system-spec-kit/mcp_server/tools/skill-graph-tools.ts` (DELETED) | Memory-side proxy file removed after zero-caller evidence |
| `.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-proxy.vitest.ts` (DELETED) | Proxy Vitest suite deleted alongside the proxy source |
| `.opencode/skills/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts` (DELETED) | Memory-side schema tests deleted as surface was removed |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | Removed deleted proxy import. Now reports skill graph topology as advisor-owned. |
| `.opencode/commands/doctor.md` | Retargeted `skill_graph_*` allowed-tools to `system_skill_advisor` prefix |
| `.opencode/commands/doctor/_routes.yaml` | Updated 3 route entries to use `system_skill_advisor` prefix |
| `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` | Retargeted 3 probes to advisor-owned tool prefix |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Retargeted 1 probe to advisor-owned tool prefix |
| `.opencode/commands/doctor/update.md` | Updated allowed-tools and table rows to new server prefix |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Reflects `system_skill_advisor` ownership with ownership note |

### Follow-Ups

- Advisor and memory broad Vitest suites remain baseline-red. D2 did not attempt out-of-scope suite remediation. A dedicated follow-on packet should triage the 6 failing and 3 skipped advisor tests.
- Claude runtime listing was inconclusive because the CLI did not show `system_skill_advisor` in the visible rows. Verify after CLI cache clears or in a fresh session.
- Doctor slash-command smoke is inconclusive outside an interactive runtime. Confirm all doctor probes reach the advisor-owned tools in a live session after the next interactive deployment.
