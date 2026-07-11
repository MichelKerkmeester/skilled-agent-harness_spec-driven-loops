---
title: "Task Breakdown: CLI Devin Skill Advisor Hook"
description: "Atomic Phase C and Phase D tasks for the advisor Devin hook, mk-skill-advisor rename, bridge move, tests, docs, and verification."
trigger_phrases:
  - "tasks"
  - "skill-advisor"
  - "mk-skill-advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-advisor-production-hardening/004-devin-advisor-hook-integration"
    last_updated_at: "2026-05-15T17:30:00Z"
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

# Task Breakdown: CLI Devin Skill Advisor Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

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
| T1.1 | Rename `.opencode/plugins/spec-kit-skill-advisor.js` to `.opencode/plugins/mk-skill-advisor.js` and flip `PLUGIN_ID` to `mk-skill-advisor`. | F004/Q4 |
| T1.2 | Move/rename bridge module to `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`. | F005/Q5 |
| T1.3 | Update bridge import paths in all plugin/test consumers. | F005/Q5, F006/Q6 |
| T1.4 | Add canonical `MK_SKILL_ADVISOR_*` env-var aliases while retaining `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. | F004/Q4 |
| T1.5 | Update `.opencode/plugins/README.md` plugin table and bridge list entries. | F004/Q4, F009/Q9 |
| T1.6 | Create/update advisor `mcp_server/plugin_bridges/README.md` for `mk-skill-advisor`. | F005/Q5, F009/Q9 |
| T1.7 | Update advisor `SKILL.md`, `INSTALL_GUIDE.md`, `SET-UP_GUIDE.md`, and `ARCHITECTURE.md` where current plugin/hook names appear. | F009/Q9 |
| T1.8 | Update `feature_catalog/hooks-and-plugin/*` current plugin references. | F009/Q9 |
| T1.9 | Update manual testing playbook entries for `mk-skill-advisor` and Devin hook smoke. | F009/Q9 |
| T1.10 | Rename/update test files and fixtures that match the old plugin name. | F004/Q4, F006/Q6 |
| T1.11 | Update `.opencode/skills/cli-devin/references/devin_tools.md:106` Hooks row from `No` to `Yes - Claude-compatible hooks`. | F001/Q1 |
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| ID | Task | Evidence Anchor |
|----|------|-----------------|
| T2.1 | Create `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`, mirroring Claude variant fail-open behavior, diagnostic JSONL, and dual stdin/argv support. | F001/Q1, F002/Q2 |
| T2.2 | Compile to `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` with strict typecheck and no emit on error. | F003/Q3, F008/Q8 |
| T2.3 | Create/update `.devin/hooks.v1.json` with `bash -c 'cd "${DEVIN_PROJECT_DIR}" && node .opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js'` and `timeout: 3`. | F003/Q3 |
| T2.4 | Verify `.devin/config.json` keeps `read_config_from.claude=true` as safety net, then record double-firing result in Phase D. | F001/Q1, ADR-001 |
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| ID | Task | Evidence Anchor |
|----|------|-----------------|
| T3.1 | Add Devin fixture to existing advisor runtime parity tests, extending `runtime-parity.vitest.ts` if present or creating it if absent. | F007/Q7 |
| T3.2 | Add 5-runtime parity smoke for Claude, Gemini, Codex, OpenCode, and Devin. | F007/Q7 |
| T3.3 | Run strict TypeScript check with `tsc --noEmit`; it must pass. | F008/Q8 |
| T3.4 | Run `vitest run` on touched advisor test files; all must be green. | F008/Q8 |
| T3.5 | Run sk-doc DQI rescore on all touched authored advisor docs; target >= 4.0 each. | F009/Q9 |
| T3.6 | Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-devin-advisor-hook-integration --strict`; exit 0 required unless only reviewed placeholder warnings appear before implementation summary fill. | F010/Q10 |

## Phase 4 - Verification (Phase D)

| ID | Task | Evidence Anchor |
|----|------|-----------------|
| T4.1 | Run advisor MCP server boot smoke and verify all 8 public advisor tools respond. | F008/Q8 |
| T4.2 | Run 5-runtime hook smoke for UserPromptSubmit across Claude, Gemini, Codex, OpenCode, and Devin. | F007/Q7 |
| T4.3 | Run Devin live `/hooks` slash command and prompt smoke; verify explicit variant loaded and double-firing status known. | F001/Q1, ADR-001 |
| T4.4 | Run post-extraction grep cleanup: zero current hits for legacy `spec-kit-skill-advisor` plugin/bridge names outside `z_archive/`, changelogs, and frozen historical specs. | F004/Q4, F006/Q6 |
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 25 tasks have Phase C/D evidence.
- [ ] No blocked task remains without an issue entry.
- [ ] Strict validation passes after implementation.
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
