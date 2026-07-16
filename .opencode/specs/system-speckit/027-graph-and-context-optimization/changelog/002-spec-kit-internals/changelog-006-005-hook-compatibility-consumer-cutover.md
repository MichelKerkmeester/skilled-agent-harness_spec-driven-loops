---
title: "Phase 005: Hook Compatibility and Consumer Cutover"
description: "Advisor consumers across plugins, bridges, shims, doctor assets, plus install guides were cut over from the memory MCP boundary to the standalone system_skill_advisor server. A temporary deprecation proxy in spec_kit_memory forwarded calls and logged migration hints for one window."
trigger_phrases:
  - "hook compatibility consumer cutover"
  - "advisor consumer cutover"
  - "spec kit memory advisor proxy"
  - "system skill advisor standalone cutover"
  - "advisor plugin bridge cutover"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

Advisor consumers across the codebase still carried mixed assumptions after the standalone `system_skill_advisor` package was created in child 004. The OpenCode plugin bridge imported the old `dist/skill_advisor/compat/index.js` path. The memory MCP process registered primary `advisor_*` handlers directly. The Python shim pointed at the wrong repo root. Doctor assets probed the old memory-side DB. Install guides described an outdated single-server topology.

All production consumers were inventoried and classified under one of five categories: primary consumer, legacy proxy, docs-only, test fixture, child-006 cleanup. The plugin bridge was updated to call `system_skill_advisor.advisor_recommend` over MCP stdio. The memory MCP `advisorTools` export was converted to a once-per-process deprecation proxy that forwards calls to `system_skill_advisor` and returns a prompt-safe migration hint on failure. The Python shim path and repo root were corrected. Doctor assets now target the standalone advisor DB under `.opencode/skills/system-skill-advisor/mcp_server`. Both install guides document the dual-MCP topology and the temporary proxy window.

### Added

- Deprecation proxy for `spec_kit_memory.advisor_*` handlers forwarding to `system_skill_advisor` with a once-per-process `[advisor-deprecation]` log
- Standalone advisor verification and legacy bridge window section in `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md`
- Dual-MCP topology description in `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` now reads the standalone compat contract and dispatches `advisor_recommend` through `system_skill_advisor` over MCP stdio instead of importing old `skill_advisor` dist paths
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` `advisorTools` export changed from direct handler registration to a temporary ADR-003 deprecation proxy
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` advisor descriptors changed to deprecated proxy descriptors pending child 006 removal
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` Python shim path roots corrected to the standalone package and native dist paths
- `.opencode/commands/doctor/assets/doctor_update.yaml` advisor health and rebuild references updated to point at the standalone advisor DB and `system_skill_advisor.advisor_*` tool names

### Fixed

- OpenCode plugin bridge imported the old `dist/skill_advisor/compat/index.js` path after the source move. Bridge now routes through the standalone MCP boundary.
- Python shim resolved the repo root one level too high. Corrected root and standalone built handler paths so `--force-native`, `--force-local`, `--health` all exit 0.
- Doctor assets probed the memory-side skill-graph DB path. Now target `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.
- Memory MCP registered `advisor_*` as primary handlers after child 004. Now a forwarding proxy so the standalone server owns primary ownership.

### Verification

| Check | Result |
|-------|--------|
| Child 004 availability | PASS: launcher exists. All four runtime configs contain `system_skill_advisor`. Standalone launcher printed DB path. |
| Build | PASS: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` and `npm --prefix .opencode/skills/system-spec-kit run build --workspace=@spec-kit/mcp-server` both succeeded. |
| Plugin bridge smoke | PASS: direct stdin JSON returned `status:"ok"`, `route:"native"`, `Advisor: stale; use system-spec-kit ...`. |
| Memory MCP startup | PASS: `node dist/context-server.js < /dev/null` reached `Context MCP server running on stdio` with no crash. |
| Advisor proxy smoke | PASS: `spec_kit_memory.advisor_recommend` forwarded through `system_skill_advisor`. stderr contained `[advisor-deprecation]`. |
| Standalone advisor smoke | PASS: `node .opencode/bin/skill-advisor-launcher.cjs < /dev/null` printed the package-local DB path and exited cleanly on closed stdin. |
| Python shim smoke | PASS: `--force-native`, `--force-local`, `--health` all exited 0 after standalone path correction. |
| Doctor assets | PASS: Ruby YAML parse passed for `doctor_skill-advisor.yaml` and `doctor_update.yaml`. |
| Hook/plugin Vitest | PARTIAL: OpenCode plugin Vitest passed 30/30. Four hook Vitest suites failed at import time because they reference deleted `../skill_advisor/...` helpers outside the 005 edit whitelist. |
| Strict spec validation | PASS: `validate.sh .../005-hook-compatibility-consumer-cutover --strict` exited 0 with 0 errors and 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modified | Removed old `skill_advisor` dist import path. Now reads standalone compat contract and calls `system_skill_advisor.advisor_recommend` over MCP stdio. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modified | `advisorTools` export converted from direct handler registration to ADR-003 deprecation proxy with once-per-process log. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Advisor descriptors marked as deprecated proxy descriptors for child 006 removal. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified | Repo root and standalone built handler/generation paths corrected. |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Modified | Advisor health probes and rebuild references updated to standalone advisor DB and `system_skill_advisor.advisor_*` tool names. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modified | Added standalone verification steps and legacy bridge deprecation window note. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Added dual-MCP topology section and note on temporary proxy window. |

### Follow-Ups

- Remove memory-side advisor descriptors and proxy dispatch from `tools/index.ts` and `tool-schemas.ts` in child 006.
- Update the four hook Vitest suites that import deleted `../skill_advisor/...` helpers. These are outside the 005 whitelist and need a child-006 or standalone test-fixture update.
- Update the standalone plugin-bridge Vitest that computes repo root one directory too high.
- Run `doctor:update --cleanup-legacy=false` against the standalone advisor path to verify the full mutation route end-to-end.
- Smoke-test operator-facing install-guide examples against a clean environment.
