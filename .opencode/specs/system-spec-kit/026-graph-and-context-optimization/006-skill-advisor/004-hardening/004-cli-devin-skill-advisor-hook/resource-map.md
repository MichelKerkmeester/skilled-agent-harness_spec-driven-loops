---
title: "Resource Map: CLI Devin Skill Advisor Hook"
description: "Categorized file inventory for Phase C advisor Devin hook, mk-skill-advisor rename, bridge move, tests, docs, and hands-off paths."
trigger_phrases:
  - "resource map"
  - "skill-advisor"
  - "mk-skill-advisor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook"
    last_updated_at: "2026-05-15T17:30:00Z"
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

- **Total references**: 35 explicit entries plus 293 rename hits classified by Phase A.
- **By category**: READMEs=3, Documents=10, Skills=10, Specs=10, Tests=4, Config=2, Scripts=2
- **Missing on disk**: 3 planned paths before Phase C (`hooks/devin/user-prompt-submit.ts`, advisor bridge directory, `.devin/hooks.v1.json`)
- **Scope**: Packet-level map for Phase C files to create, update, move, validate, or keep hands-off for packet 025.
- **Generated**: 2026-05-15T17:30:00+02:00

Action vocabulary: `Created`, `Updated`, `Analyzed`, `Validated`, `Moved`, `Renamed`, `Hands-off`.
Status vocabulary: `OK`, `MISSING`, `PLANNED`.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/plugins/README.md` | Updated | OK | Plugin table and bridge list rename per F004/Q4. |
| `.opencode/skills/system-skill-advisor/README.md` | Updated | OK | Current plugin references if present; DQI baseline HIGH per F009/Q9. |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/README.md` | Created | PLANNED | Bridge README after move per F005/Q5 and F009/Q9. |
<!-- /ANCHOR:readmes -->

---
<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/SKILL.md` | Updated | OK | Rename and Devin hook docs if touched; DQI baseline HIGH. |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Updated | OK | Rename and bridge ownership details if present. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Updated | OK | Stale plugin refs; DQI baseline MEDIUM per F009/Q9. |
| `.opencode/skills/system-skill-advisor/SET-UP_GUIDE.md` | Updated | OK | Stale plugin refs and runtime hook table per F002/F009. |
| `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/*` | Updated | OK | Current feature catalog plugin refs per F009/Q9. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/*` | Updated | OK | Manual hook/plugin smoke entries per F009/Q9. |
| `.opencode/skills/cli-devin/references/devin_tools.md` | Updated | OK | Hooks row line 106: `No` to `Yes - Claude-compatible hooks`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/research/research.md` | Analyzed | OK | Frozen Phase A synthesis, 200 lines. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/research/iterations/iteration-01.md` | Analyzed | OK | Devin context injection uncertainty. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/research/iterations/iteration-05.md` | Analyzed | OK | Bridge duplicate audit. |
<!-- /ANCHOR:documents -->

---
<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Analyzed | OK | Source pattern for Devin variant; F001/F002. |
| `.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts` | Analyzed | OK | Existing runtime parity pattern; F002. |
| `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts` | Analyzed | OK | Existing runtime parity pattern; F002. |
| `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` | Created | PLANNED | Explicit Devin variant; ADR-001. |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` | Analyzed | OK | outDir preserves nested dist structure; F003. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts` | Analyzed | OK | Justified shared utility import; F006. |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Created | PLANNED | New bridge owner path; ADR-003. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Moved | OK | Legacy bridge source; F005. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` | Analyzed | OK | Existing shim pattern; F003. |
| `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` | Created | PLANNED | Compile output; F003. |
<!-- /ANCHOR:skills -->

---
<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/spec.md` | Updated | OK | Phase B planning-complete spec. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/plan.md` | Updated | OK | Phase A-E plan. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/tasks.md` | Updated | OK | 25 atomic tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/decision-record.md` | Updated | OK | ADR-001..003 accepted. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/checklist.md` | Updated | OK | Phase D verification slots. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/handover.md` | Updated | OK | Continuity completion_pct 40. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/resource-map.md` | Created | OK | This file. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/implementation-summary.md` | Analyzed | OK | Left placeholder by design. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/description.json` | Analyzed | OK | Metadata untouched in Phase B. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook/graph-metadata.json` | Analyzed | OK | Metadata untouched in Phase B. |
<!-- /ANCHOR:specs -->

---
<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts` | Updated | OK | Bridge path currently legacy per F006. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/**/runtime-parity.vitest.ts` | Created | PLANNED | 5-runtime parity if absent; F007. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/**/spec-kit-skill-advisor*.vitest.ts` | Renamed | OK | Rename fixtures/files matching old plugin name. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/**/fixtures/**` | Updated | OK | Plugin/env fixture updates. |
<!-- /ANCHOR:tests -->

---
<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.devin/hooks.v1.json` | Created | PLANNED | Shared final merge with packet 036; advisor UserPromptSubmit entry. |
| `.devin/config.json` | Validated | OK | Verify `read_config_from.claude=true` safety net. |
<!-- /ANCHOR:config -->

---
<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Renamed | OK | Old plugin file source; F004. |
| `.opencode/plugins/mk-skill-advisor.js` | Created | PLANNED | New plugin file with `PLUGIN_ID='mk-skill-advisor'`. |
<!-- /ANCHOR:scripts -->

---
<!-- ANCHOR:hands-off -->
## Hands-Off

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/**/research/**` | Hands-off | OK | Frozen Phase A outputs. |
| `.opencode/**/z_archive/**` | Hands-off | OK | Historical rename refs excluded. |
| `.opencode/changelog/**` | Hands-off | OK | Historical changelog refs excluded. |
| `.claude/**` | Hands-off | OK | Phase C may verify but Phase B does not modify. |
<!-- /ANCHOR:hands-off -->
