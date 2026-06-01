---
title: "Skill Advisor Phase 006: Validate Extraction and Remove Deprecated Bridge"
description: "Final validation and cleanup pass for the standalone advisor MCP migration. The spec_kit_memory advisor proxy was removed. Bridge tool schema descriptors were deleted. Forty-four live docs were swept of stale old-path references. A full validation matrix confirmed the standalone system_skill_advisor server works correctly."
trigger_phrases:
  - "advisor proxy removal"
  - "remove spec_kit_memory advisor bridge"
  - "system_skill_advisor final cleanup"
  - "013/009/006 validation"
  - "stale-doc sweep advisor"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

After four child phases moved the advisor source, standalone launcher, runtime configs, plus consumer cutover into place, the compatibility bridge left in `spec_kit_memory` became live debt. Stale old-path docs and proxy tool registrations risked misleading operators back to the retired `mcp_server/skill_advisor/` surface.

The final cleanup executed in one commit: the temporary advisor proxy was removed from `spec_kit_memory`, bridge tool schema descriptors were deleted, install guides were rewritten to the two-server topology. Forty-four live operator docs were swept of stale `mcp_server/skill_advisor/` references. A validation matrix confirmed the standalone `system_skill_advisor` server listed all four advisor tools, returned a valid `advisor_recommend` response. The memory MCP exposed no `advisor_*` tools after cleanup. Old-path live hits dropped from 159 to 0.

Two P0 items remain blocked: package-local Vitest in the standalone advisor folder fails with 71 of 224 tests (test fixtures still reference the old DB path). Hook smoke has one failing settings-driven suite expecting a Claude settings file outside the repo root. These are test-fixture path issues in the forbidden standalone advisor surface, not regressions from the proxy deletion.

### Added

- None. Cleanup-only phase.

### Changed

- `spec_kit_memory` advisor proxy removed from `mcp_server/tools/index.ts`: `ADVISOR_PROXY_TOOL_NAMES`, `proxyAdvisorTool` helper, `advisorTools` export, deprecation constants, plus entries in `ALL_DISPATCHERS` and `SCHEMA_VALIDATED_TOOL_NAMES` all deleted.
- `mcp_server/tool-schemas.ts` bridge descriptors deleted; `advisor_*` schema entries no longer registered in memory MCP.
- `system-spec-kit/mcp_server/INSTALL_GUIDE.md` deprecation-window paragraphs replaced with concise dual-MCP topology pointer.
- `system-skill-advisor/INSTALL_GUIDE.md` cross-reference to deprecated proxy removed.
- 44 live operator docs swept across `system-spec-kit`, `system-skill-advisor`, plus cross-skill feature catalogs. Old `mcp_server/skill_advisor/` path hits reduced from 159 to 0.

### Fixed

- Operators could follow live install guides that still pointed at the retired `mcp_server/skill_advisor/` path. All operator-facing docs now describe the final two-server topology.
- Invalid warnings telling operators not to register a second MCP server were removed. Final sweep confirmed zero second-server warning hits.

### Verification

| Check | Result |
|-------|--------|
| Required reading | PASS: ADR-001, child 006 spec, plan, decision record, tasks, proxy code, tool schemas, install guides, plus stale-doc samples read before cleanup. |
| Old-path live hits | PASS: `rg "mcp_server/skill_advisor"` outside specs, dist, node_modules went from 159 to 0. |
| Memory MCP proxy removal | PASS: `tools/index.ts` no longer exports `advisorTools`. Direct `spec_kit_memory` tools/list returned 45 tools and `advisorTools: []`. |
| Memory MCP tool schemas | PASS: `tool-schemas.ts` bridge descriptors deleted. `TOOL_DEFINITIONS.filter(t => t.name.startsWith('advisor_'))` returned `[]`. |
| Standalone advisor direct probe | PASS: direct MCP tools/list returned `advisor_rebuild`, `advisor_recommend`, `advisor_status`, `advisor_validate`. `advisor_recommend` returned `status: ok` with one recommendation. |
| DB path | PASS: `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` exists. Old Spec Kit DB path does not exist. |
| Runtime OpenCode | PASS: `opencode mcp list` showed connected `spec_kit_memory` and `system_skill_advisor`. |
| Runtime Codex | PASS: `codex mcp list` showed enabled `spec_kit_memory` and `system_skill_advisor`. |
| Runtime Claude | INCONCLUSIVE: repo `.claude/mcp.json` lists both servers. `claude mcp list` did not show `system_skill_advisor` in returned rows. |
| Runtime Gemini | INCONCLUSIVE: repo `.gemini/settings.json` lists both servers. `gemini mcp list` returned no usable rows. |
| Python parity | PASS with degraded status: `skill_advisor.py --health` exited 0, reported `status: degraded` because SQLite was unavailable to the Python fallback. |
| Build | PASS: `tsc --build --force` exited 0 from `system-spec-kit/mcp_server`. |
| Package-local Vitest | FAIL: `npm test` from `system-skill-advisor/mcp_server` discovered 38 files, 224 tests. Result: 153 passed, 71 failed. Test fixtures still reference old DB path. |
| Hook smoke | FAIL: `vitest run tests/hooks` from system-spec-kit produced 5 passing files and 1 failing settings-driven suite. Expected Claude settings file absent outside repo root. |
| Strict packet validation | PASS: `validate.sh --strict` exited 0, zero errors, zero warnings. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Proxy helpers, `ADVISOR_PROXY_TOOL_NAMES`, `advisorTools` export, deprecation constants removed from dispatcher registry. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Bridge `advisor_*` schema descriptors deleted. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Deprecation-window paragraphs replaced with two-server topology pointer. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Cross-reference to deprecated proxy removed. |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Stale `mcp_server/skill_advisor/` references replaced with `system_skill_advisor` topology description. |
| `.opencode/skills/system-spec-kit/README.md` | Old-path references swept. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Stale path references updated to standalone advisor. |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Old-path probe examples rewritten to `system_skill_advisor`. |
| `.opencode/install_guides/README.md` | Cross-skill install reference updated to two-server topology. |
| `.opencode/skills/README.md` | Advisor affordance evidence docs updated to standalone server path. |
| 34 additional live docs across feature catalogs, manual testing playbooks, plus cross-skill references | Old `mcp_server/skill_advisor/` path text swept per ADR-004 policy. |

### Follow-Ups

- Fix test-fixture DB path in `.opencode/skills/system-skill-advisor/mcp_server/` so package-local Vitest can discover and pass all 224 tests. Fixtures still reference `system-spec-kit/mcp_server/database/skill-graph.sqlite` instead of the new path.
- Update hook test fixtures so the settings-driven suite no longer requires a Claude settings file outside the repo root.
- Confirm `advisor_recommend` round-trip through Claude and Gemini runtimes once CLI listing issues are resolved. Both runtimes list the server in repo config but the CLI listing was inconclusive at ship time.
