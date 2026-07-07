---
title: "Task Breakdown: CLI Devin Code Graph Hook"
description: "Atomic Phase C and Phase D tasks for the code-graph Devin hook, mk-code-graph rename, bridge rename, tests, docs, and verification."
trigger_phrases:
  - "tasks"
  - "code-graph"
  - "mk-code-graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/018-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T17:35:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 40
    open_questions: []
    answered_questions: []
---

# Task Breakdown: CLI Devin Code Graph Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---
<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T#.# [P?] Description (file path)`. Phase C tasks remain unchecked until implementation evidence exists.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| ID | Task | Evidence Anchor |
|----|------|-----------------|
| T1.1 | Rename `.opencode/plugins/spec-kit-compact-code-graph.js` to `.opencode/plugins/mk-code-graph.js` and flip `PLUGIN_ID` to `mk-code-graph`. | F006/Q6 |
| T1.2 | Rename bridge module to `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`. | F007/Q7 |
| T1.3 | Update bridge import paths in all consumers. | F007/Q7 |
| T1.4 | Confirm no code-graph legacy env-var alias is required. | F006/Q6 |
| T1.5 | Update `.opencode/plugins/README.md` with `mk-code-graph` plugin and `mk-code-index` MCP asymmetry. | F008/Q8 |
| T1.6 | Update `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md`. | F007/Q7, F010/Q10 |
| T1.7 | Update `.opencode/skills/system-code-graph/SKILL.md` with hook-source asymmetry and naming rationale. | F002/Q2, F008/Q8 |
| T1.8 | Update `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`. | F010/Q10 |
| T1.9 | Update `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md`. | F010/Q10 |
| T1.10 | Rename/update tests and fixtures matching old plugin name. | F006/Q6 |
| T1.11 | Update `.opencode/skills/cli-devin/references/devin_tools.md:106` Hooks row from `No` to `Yes - Claude-compatible hooks`. | F001/Q1 |
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| ID | Task | Evidence Anchor |
|----|------|-----------------|
| T2.1 | Create `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts`, mirroring Claude `session-prime.ts`, calling `getStartupBriefFromMarker()`, and emitting `kind=startup` block. | F002/Q2, F003/Q3, F004/Q4 |
| T2.2 | Compile to `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js` with strict typecheck and no emit on error. | F004/Q4 |
| T2.3 | Create/update `.devin/hooks.v1.json` with `bash -c 'cd "${DEVIN_PROJECT_DIR}" && node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js'` and `timeout: 3`. | F001/Q1, F003/Q3 |
| T2.4 | Verify `.devin/config.json` keeps `read_config_from.claude=true` as safety net. | F001/Q1, ADR-003 |
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| ID | Task | Evidence Anchor |
|----|------|-----------------|
| T3.1 | Extend existing SessionStart tests with Devin variant fixture. | F004/Q4 |
| T3.2 | Add 5-runtime startup parity smoke for Claude, Gemini, Codex, OpenCode, Devin. | F003/Q3, F004/Q4 |
| T3.3 | Run `tsc --noEmit`; it must pass. | F009/Q9 |
| T3.4 | Run `vitest run` on touched code-graph/session-start test files; all must be green. | F009/Q9 |
| T3.5 | Run sk-doc DQI rescore on touched authored docs; target >= 4.0 each. | F010/Q10 |
| T3.6 | Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook --strict`; exit 0 required unless frozen research warnings are explicitly recorded. | F010/Q10 |
| T4.1 | Run code-graph MCP server boot smoke and verify all 10 public tools respond. | F009/Q9 |
| T4.2 | Run 5-runtime SessionStart hook smoke across Claude, Gemini, Codex, OpenCode, and Devin. | F003/Q3, F004/Q4 |
| T4.3 | Run Devin live `/hooks` slash command and startup smoke. | F001/Q1, ADR-003 |
| T4.4 | Run post-extraction grep cleanup: zero current hits for legacy `spec-kit-compact-code-graph` plugin/bridge names outside `z_archive/`, changelogs, and frozen historical specs. | F006/Q6, F007/Q7 |
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 25 tasks have Phase C/D evidence.
- [ ] No blocked task remains without an issue entry.
- [ ] Strict validation passes or frozen research citation warning is escalated.
<!-- /ANCHOR:completion -->

---
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision Record**: See `decision-record.md`.
- **Resource Map**: See `resource-map.md`.
- **Task Count**: 25 atomic tasks.
<!-- /ANCHOR:cross-refs -->
