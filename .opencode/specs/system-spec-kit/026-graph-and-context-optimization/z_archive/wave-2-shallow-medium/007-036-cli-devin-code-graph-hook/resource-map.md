---
title: "Resource Map: CLI Devin Code Graph Hook"
description: "Categorized file inventory for Phase C code-graph Devin SessionStart hook, mk-code-graph rename, bridge rename, tests, docs, and hands-off paths."
trigger_phrases:
  - "resource map"
  - "code-graph"
  - "mk-code-graph"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T17:35:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "resource-map.md"
    completion_pct: 40
    open_questions: []
    answered_questions: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---
<!-- ANCHOR:summary -->
## Summary

- **Total references**: 34 explicit entries plus plugin rename refs classified by Phase A.
- **By category**: READMEs=3, Documents=9, Skills=11, Specs=10, Tests=4, Config=2, Scripts=2
- **Missing on disk**: 2 planned paths before Phase C (`hooks/devin/session-start.ts`, `.devin/hooks.v1.json`)
- **Scope**: Packet-level map for Phase C files to create, update, move, validate, or keep hands-off for packet 036.
- **Generated**: 2026-05-15T17:35:00+02:00

Action vocabulary: `Created`, `Updated`, `Analyzed`, `Validated`, `Moved`, `Renamed`, `Hands-off`.
Status vocabulary: `OK`, `MISSING`, `PLANNED`.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/plugins/README.md` | Updated | OK | Plugin table and `mk-code-index` asymmetry per F008. |
| `.opencode/skills/system-code-graph/README.md` | Updated | OK | Rename references if present. |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md` | Updated | OK | Bridge rename per F007/F010. |
<!-- /ANCHOR:readmes -->

---
<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-code-graph/SKILL.md` | Updated | OK | Hook-source and naming asymmetry docs. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Updated | OK | Plugin rename refs if present. |
| `.opencode/skills/system-code-graph/SET-UP_GUIDE.md` | Updated | OK | Empty/stale doc gap per F010. |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Updated | OK | Plugin rename and Devin variant docs. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Devin `/hooks` and startup smoke. |
| `.opencode/skills/cli-devin/references/devin_tools.md` | Updated | OK | Hooks row line 106. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/research/research.md` | Analyzed | OK | Frozen Phase A synthesis, 362 lines. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/research/iterations/iteration-01.md` | Analyzed | OK | Devin SessionStart uncertainty. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/research/iterations/iteration-05.md` | Analyzed | OK | Freshness handling. |
<!-- /ANCHOR:documents -->

---
<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Analyzed | OK | Existing pattern; F001/F005. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Analyzed | OK | Existing runtime path. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-prime.ts` | Analyzed | OK | Existing runtime path. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` | Created | PLANNED | Explicit Devin variant; ADR-001/003. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js` | Created | PLANNED | Compile output. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` | Analyzed | OK | Intentional boundary interface; F002/F004/F009. |
| `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts` | Analyzed | OK | Startup payload contract; F004. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs` | Analyzed | OK | Build process risk; F002. |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/spec-kit-compact-code-graph-bridge.mjs` | Renamed | OK | Old bridge path; F007. |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` | Created | PLANNED | New bridge filename. |
| `.opencode/skills/system-code-graph/hooks/` | Hands-off | MISSING | Do not create; migration deferred per ADR-001. |
<!-- /ANCHOR:skills -->

---
<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/spec.md` | Updated | OK | Phase B planning-complete spec. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/plan.md` | Updated | OK | Phase A-E plan. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/tasks.md` | Updated | OK | 25 atomic tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/decision-record.md` | Updated | OK | ADR-001..003 accepted. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/checklist.md` | Updated | OK | Phase D verification slots. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/handover.md` | Updated | OK | Continuity completion_pct 40. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/resource-map.md` | Created | OK | This file. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/implementation-summary.md` | Analyzed | OK | Left placeholder by design. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/description.json` | Analyzed | OK | Metadata untouched in Phase B. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/graph-metadata.json` | Analyzed | OK | Metadata untouched in Phase B. |
<!-- /ANCHOR:specs -->

---
<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/**/session-start*.vitest.ts` | Updated | OK | Devin fixture and parity coverage. |
| `.opencode/skills/system-code-graph/mcp_server/tests/**/plugin-bridge*.vitest.ts` | Updated | OK | Bridge rename coverage. |
| `.opencode/skills/system-code-graph/mcp_server/tests/**/spec-kit-compact-code-graph*.vitest.ts` | Renamed | OK | Rename fixtures/files matching old plugin name. |
| `.opencode/skills/system-code-graph/mcp_server/tests/**/fixtures/**` | Updated | OK | Startup/plugin fixture updates. |
<!-- /ANCHOR:tests -->

---
<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.devin/hooks.v1.json` | Created | PLANNED | Shared final merge with packet 025; SessionStart entry. |
| `.devin/config.json` | Validated | OK | Verify `read_config_from.claude=true` and `mk_code_index` MCP name. |
<!-- /ANCHOR:config -->

---
<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Renamed | OK | Old plugin file source; F006. |
| `.opencode/plugins/mk-code-graph.js` | Created | PLANNED | New plugin file with `PLUGIN_ID='mk-code-graph'`. |
<!-- /ANCHOR:scripts -->

---
<!-- ANCHOR:hands-off -->
## Hands-Off

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/**/research/**` | Hands-off | OK | Frozen Phase A outputs. |
| `.opencode/**/z_archive/**` | Hands-off | OK | Historical rename refs excluded. |
| `.opencode/changelog/**` | Hands-off | OK | Historical changelog refs excluded. |
| `.opencode/skills/system-code-graph/hooks/` | Hands-off | MISSING | Do not create in this packet. |
| `.claude/**` | Hands-off | OK | Phase C may verify but Phase B does not modify. |
<!-- /ANCHOR:hands-off -->
