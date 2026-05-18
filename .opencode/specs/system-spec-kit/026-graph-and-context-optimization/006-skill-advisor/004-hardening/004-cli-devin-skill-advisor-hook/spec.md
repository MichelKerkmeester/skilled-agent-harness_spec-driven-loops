---
title: "Feature Specification: CLI Devin Skill Advisor UserPromptSubmit Hook + Plugin Rename + Post-Extraction Audit"
description: "Port the advisor UserPromptSubmit hook to Devin CLI, rename the OpenCode advisor plugin to mk-skill-advisor, audit post-extraction runtime surfaces, and verify sk-code plus sk-doc compliance."
trigger_phrases:
  - "cli-devin"
  - "skill-advisor"
  - "advisor hook"
  - "userpromptsubmit"
  - "plugin rename"
  - "mk-skill-advisor"
  - "post-extraction audit"
  - "004-cli-devin-skill-advisor-hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-cli-devin-skill-advisor-hook"
    last_updated_at: "2026-05-15T17:30:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "checklist.md"
      - "handover.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-phase-b-004-cli-devin-skill-advisor-hook"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "F001/Q1: Devin additionalContext behavior remains empirically unverified; hybrid inheritance plus explicit variant fallback accepted."
      - "F002/Q2: Skill-owned Devin hook source selected for advisor."
      - "F003/Q3: Devin compile target and hooks.v1.json registration shape identified."
      - "F004/Q4: Plugin rename touch list and legacy env-var alias strategy identified."
      - "F005/Q5: Advisor bridge moves from system-spec-kit to system-skill-advisor ownership."
      - "F006/Q6: Post-extraction references classified; test-directory legacy refs need cleanup."
      - "F007/Q7: Five-runtime parity test strategy defined."
      - "F008/Q8: sk-code gate defined."
      - "F009/Q9: sk-doc DQI baseline and stale docs identified."
      - "F010/Q10: Phase B synthesis complete."
---

# Feature Specification: CLI Devin Skill Advisor UserPromptSubmit Hook + Plugin Rename + Post-Extraction Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

Phase A research converged on a scoped Phase C implementation for the advisor packet. The advisor will gain an explicit Devin `UserPromptSubmit` hook variant under the skill-owned hook tree while retaining Devin's `read_config_from.claude=true` inheritance as a safety net, because Devin's documented Claude compatibility does not explicitly prove `hookSpecificOutput.additionalContext` injection for this event (F001/Q1, `research/iterations/iteration-01.md`).

The plugin rename is full-scope: `spec-kit-skill-advisor` becomes `mk-skill-advisor`, the plugin bridge moves from legacy `system-spec-kit` ownership to `system-skill-advisor`, and legacy `SPECKIT_*` environment variables stay as aliases while new `MK_SKILL_ADVISOR_*` names become canonical (F004/Q4, F005/Q5).

**Key Decisions**: ADR-001 accepts the hybrid Devin strategy; ADR-002 accepts the full plugin rename with env-var backcompat; ADR-003 accepts bridge ownership migration.

**Critical Dependencies**: Phase A research is complete; Phase C must run in a worktree-isolated cli-opencode + deepseek-v4-pro implementation pass; Phase D must prove 5-runtime parity, sk-code, sk-doc, strict spec validation, and live Devin `/hooks` visibility.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planning Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Phase** | B synthesis complete; ready for Phase C implementation |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system-skill-advisor` already supports Claude, Gemini, Codex, and OpenCode prompt-time guidance, but Devin CLI has no explicit advisor hook registration. Devin claims Claude-compatible hooks, yet Phase A could not empirically prove that Devin honors Claude's `hookSpecificOutput.additionalContext` field from inside the current runtime (F001/Q1). At the same time, the OpenCode plugin and bridge still use the older `spec-kit-skill-advisor` extraction-era name, and 293 current or historical references need classification before a safe rename (F004/Q4).

### Purpose

Produce an implementation-ready plan for Phase C that adds Devin advisor parity, renames the OpenCode plugin to `mk-skill-advisor`, moves the bridge into advisor-owned source, cleans current stale references, and verifies the result through sk-code, sk-doc, strict spec validation, 5-runtime parity, and live Devin smoke testing.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. Create explicit Devin `UserPromptSubmit` hook source at `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`, mirroring the Claude hook's fail-open behavior, diagnostic JSONL, and dual stdin/argv support (F001/Q1, F002/Q2).
2. Compile the hook to `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` and register it in `.devin/hooks.v1.json` with `bash -c 'cd "${DEVIN_PROJECT_DIR}" && node <dist-path>'` and `timeout: 3` (F003/Q3).
3. Rename `.opencode/plugins/spec-kit-skill-advisor.js` to `.opencode/plugins/mk-skill-advisor.js` and update the `PLUGIN_ID` constant (F004/Q4).
4. Move and rename the plugin bridge from `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` to `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` (F005/Q5).
5. Retain `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` and add canonical `MK_SKILL_ADVISOR_*` aliases, including `MK_SKILL_ADVISOR_HOOK_DISABLED` alongside `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (F004/Q4).
6. Update current advisor docs, feature catalog, manual testing playbook, plugin README entries, and tests that reference the legacy plugin or bridge names (F004/Q4, F006/Q6, F009/Q9).
7. Add or extend 5-runtime parity coverage for Claude, Gemini, Codex, OpenCode, and Devin with byte-equivalent skill slugs and confidence tolerance of +/-0.01 (F007/Q7).

### Out of Scope

- Writing inside `research/`; Phase A outputs are frozen.
- Modifying `.opencode/skills/`, `.devin/`, or `.claude/` during Phase B; those paths are Phase C scope.
- Touching `z_archive/` folders, frozen changelogs, or historical spec references during the rename grep cleanup (F004/Q4).
- Dispatching cli-devin, cli-opencode, SpawnAgent, or any agent dispatch during Phase B.
- Filling `implementation-summary.md`; it remains a template placeholder until post-implementation verification.
- Removing legacy `SPECKIT_*` env-var compatibility in Phase C.

### Files to Change in Phase C

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` | Create | Explicit Devin UserPromptSubmit variant. |
| `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` | Generate | Compiled hook output from strict TypeScript build. |
| `.opencode/plugins/spec-kit-skill-advisor.js` -> `.opencode/plugins/mk-skill-advisor.js` | Rename | OpenCode plugin file and `PLUGIN_ID` rename. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` -> `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Move/Rename | Bridge ownership migration. |
| `.devin/hooks.v1.json` | Create/Update | Devin hook registration, shared final merge point with packet 036. |
| `.devin/config.json` | Verify | Keep `read_config_from.claude=true` as inheritance safety net. |
| `.opencode/skills/system-skill-advisor/**` | Modify | Current docs, tests, README, guide, catalog, and playbook refs scoped by findings. |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement the hybrid Devin strategy accepted in ADR-001. | Explicit Devin variant exists at `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`, and `.devin/config.json` keeps `read_config_from.claude=true` unless Phase D proves double-firing. Evidence: F001/Q1, F002/Q2. |
| REQ-002 | Register Devin UserPromptSubmit without hard-coded local absolute paths. | `.devin/hooks.v1.json` uses `bash -c 'cd "${DEVIN_PROJECT_DIR}" && node .opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js'` with `timeout: 3`. Evidence: F003/Q3. |
| REQ-003 | Rename the OpenCode plugin to `mk-skill-advisor`. | Plugin file is renamed, `PLUGIN_ID='mk-skill-advisor'`, and current refs to `spec-kit-skill-advisor` are removed outside frozen history. Evidence: F004/Q4. |
| REQ-004 | Preserve advisor env-var backcompat while adding canonical names. | `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` remains accepted, and `MK_SKILL_ADVISOR_PLUGIN_DISABLED` plus `MK_SKILL_ADVISOR_HOOK_DISABLED` are documented and tested. Evidence: F004/Q4. |
| REQ-005 | Move bridge ownership to the advisor skill. | Bridge lives only at `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`, and plugin import paths point there. Evidence: F005/Q5. |
| REQ-006 | Keep advisor hooks fail-open. | Devin hook returns/prints no blocking failure on advisor errors and records diagnostics consistently with existing runtime variants. Evidence: F002/Q2, F008/Q8. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Clean current post-extraction references. | The 20 `system-spec-kit/mcp_server` advisor references are either removed, migrated, or documented as justified shared-utils/build/shim refs. Evidence: F006/Q6. |
| REQ-008 | Preserve advisor MCP behavior. | `advisor_status`, `advisor_recommend`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate` respond in smoke tests. Evidence: F008/Q8. |
| REQ-009 | Add 5-runtime parity coverage. | Runtime parity test covers Claude/Gemini/Codex/OpenCode/Devin and verifies skill slugs byte-equivalent with confidence tolerance +/-0.01. Evidence: F007/Q7. |
| REQ-010 | Update stale authored docs. | SKILL.md, README/ARCHITECTURE if touched, SET-UP_GUIDE, INSTALL_GUIDE, feature catalog, manual testing playbook, and bridge README references use current names and score DQI >= 4.0. Evidence: F009/Q9. |
| REQ-011 | Keep historical surfaces hands-off. | `z_archive/`, changelogs, and frozen historical spec references are excluded from rename cleanup. Evidence: F004/Q4. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0, except template-placeholder warnings in `implementation-summary.md` are explicitly reviewed if exit 1 appears.
- **SC-002**: Devin `/hooks` lists the advisor `UserPromptSubmit` hook from `.devin/hooks.v1.json`.
- **SC-003**: Live Devin prompt smoke surfaces the advisor brief or records a fail-open diagnostic; no prompt is blocked.
- **SC-004**: Advisor 5-runtime parity test covers Claude, Gemini, Codex, OpenCode, Devin with byte-equivalent skill slugs and confidence tolerance +/-0.01.
- **SC-005**: `tsc --noEmit` passes for touched advisor TypeScript.
- **SC-006**: `vitest run` passes for touched advisor tests, including plugin bridge and runtime parity fixtures.
- **SC-007**: Advisor MCP boot smoke returns status for advisor and skill-graph tools.
- **SC-008**: Case-insensitive grep for `spec-kit-skill-advisor` returns zero current hits outside `z_archive/`, changelogs, and frozen historical specs.
- **SC-009**: Case-insensitive grep for `spec-kit-skill-advisor-bridge` returns zero current hits outside frozen history.
- **SC-010**: Post-extraction grep for `system-spec-kit/mcp_server` has only justified current advisor refs.
- **SC-011**: sk-doc DQI is >= 4.0 for each touched authored advisor doc.
- **SC-012**: `checklist.md` Phase D evidence slots are filled before any completion claim.
- **SC-013**: `implementation-summary.md` is filled only after Phase D verification.
- **SC-014**: `.devin/config.json` `read_config_from.claude` setting is verified and double-firing outcome is recorded.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Devin may not honor Claude `additionalContext` for UserPromptSubmit. | High | Use hybrid strategy: explicit Devin hook plus `read_config_from.claude=true` safety net; verify live in Phase D. Evidence: F001/Q1. |
| Risk | Devin and inherited Claude hook may double-fire. | Medium | Phase D live `/hooks` and prompt smoke decides whether to disable inheritance or rely on Devin deduplication. Evidence: ADR-001. |
| Risk | Plugin rename breaks OpenCode plugin cold start. | High | Rename plugin/ID first, update bridge import, run cold-start smoke and grep cleanup. Evidence: F004/Q4. |
| Risk | Legacy env-var consumers break. | Medium | Retain `SPECKIT_*` aliases while documenting `MK_*` canonical vars. Evidence: F004/Q4. |
| Risk | Bridge move misses a plugin import path. | High | Move bridge and update plugin import in same Phase 1 slice; run bridge tests. Evidence: F005/Q5. |
| Risk | Post-extraction cleanup removes justified shared utility imports. | Medium | Classify all 20 hits and only remediate legacy test/bridge refs. Evidence: F006/Q6. |
| Risk | sk-doc DQI slips on medium baseline docs. | Medium | Update stale plugin references in setup/install/catalog/playbook docs and rescore. Evidence: F009/Q9. |
| Risk | 5-runtime parity confidence comparison is noisy. | Medium | Use byte-equivalent slugs and +/-0.01 confidence tolerance. Evidence: F007/Q7. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Maintain advisor parity across Claude, Gemini, Codex, OpenCode, and Devin.
- **NFR-002**: Hooks must fail open and avoid blocking prompt submission.
- **NFR-003**: Runtime registrations must use portable repo-relative paths via `DEVIN_PROJECT_DIR`.
- **NFR-004**: TypeScript must remain strict and compile without emit errors.
- **NFR-005**: sk-doc DQI must be >= 4.0 for every touched authored advisor document.
- **NFR-006**: The implementation must stay on `main`, avoid commits, and modify only Phase C scoped files.
<!-- /ANCHOR:nfr -->

---
<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Devin ignores `hookSpecificOutput.additionalContext`; explicit variant must still be live-testable (F001/Q1).
- Devin imports Claude hooks and explicit `.devin/hooks.v1.json` hooks, causing duplicate advisor briefs (ADR-001).
- `.devin/hooks.v1.json` final merge must include both packet 025 and packet 036 hook entries without clobbering either.
- Legacy `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` disables the renamed plugin; both old and new env names must behave consistently (F004/Q4).
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_HOOK_DISABLED` disagree; Phase C must document precedence.
- OpenCode plugin cache still points at `spec-kit-skill-advisor`; cold-start smoke must prove current load behavior.
- Current grep finds historical refs in `z_archive/` or changelogs; those are hands-off and excluded.
- Advisor bridge directory does not exist before the move; Phase C must create `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/` without touching unrelated files (F005/Q5).
- Test READMEs mention legacy `system-spec-kit/mcp_server` paths; cleanup should not remove justified shared utility imports (F006/Q6).
- Runtime parity test sees tiny confidence drift; tolerance is +/-0.01, while skill slugs stay byte-equivalent (F007/Q7).
<!-- /ANCHOR:edge-cases -->

---
<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Hook source, plugin rename, bridge move, tests, docs, and `.devin` config merge. |
| Risk | 20/25 | Devin contract uncertainty, double-fire risk, plugin cache, env-var backcompat. |
| Research | 18/20 | 10 findings complete; Q1 remains low confidence by empirical constraint. |
| Multi-Agent | 8/15 | Later phases use external CLI dispatch, but Phase B does not dispatch. |
| Coordination | 13/15 | Cross-packet `.devin/hooks.v1.json` merge and 5-runtime parity. |
| **Total** | **81/100** | **Level 3; cross-runtime hook and plugin rename scope** |
<!-- /ANCHOR:complexity -->

---
<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Likelihood | Impact | Mitigation | Evidence |
|---------|-------------|------------|--------|------------|----------|
| R-001 | Devin does not inject advisor context through inherited Claude hook. | M | H | Ship explicit Devin variant and live-test `/hooks`. | F001/Q1 |
| R-002 | Explicit Devin hook and inherited Claude hook both run. | M | M | Verify double-firing and disable one path if needed. | ADR-001 |
| R-003 | `mk-skill-advisor` rename breaks plugin load. | M | H | Rename file, `PLUGIN_ID`, bridge, docs, and tests atomically; cold-start smoke. | F004/Q4 |
| R-004 | Legacy `SPECKIT_*` env vars stop working. | L | H | Keep aliases and add tests/docs for both names. | F004/Q4 |
| R-005 | Bridge move leaves stale system-spec-kit bridge path. | M | H | Move bridge to advisor ownership and grep old bridge path. | F005/Q5 |
| R-006 | Cleanup removes justified shared imports. | L | M | Classify 20 hits; only change legacy bridge/test refs. | F006/Q6 |
| R-007 | Runtime parity fails from confidence drift. | M | M | Assert exact slugs, tolerate confidence +/-0.01. | F007/Q7 |
| R-008 | Typecheck misses hook source due to config coverage. | M | M | Verify hook directory is included in `tsconfig` and run strict typecheck. | F008/Q8 |
| R-009 | sk-doc DQI < 4.0 on medium baseline docs. | M | M | Update stale setup/install/catalog/playbook docs and rescore. | F009/Q9 |
| R-010 | Current grep cleanup accidentally edits frozen history. | L | M | Exclude `z_archive/`, changelogs, and historical spec references. | F004/Q4 |
<!-- /ANCHOR:risk-matrix -->

---
<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Devin Advisor Brief (Priority: P0)

**As a** Devin user, **I want** advisor guidance injected during `UserPromptSubmit`, **so that** skill routing works in Devin with the same recommendations I get in Claude, Gemini, Codex, and OpenCode.

**Acceptance Criteria**:
1. Given a Devin `UserPromptSubmit` event, when the hook runs, then it emits the advisor brief or fails open with a diagnostic.
2. Given identical prompt fixtures, when the 5-runtime parity test runs, then skill slugs are byte-equivalent and confidence values are within +/-0.01 (F007/Q7).

### US-002: Plugin Rename Clarity (Priority: P1)

**As a** repo operator, **I want** the advisor plugin named `mk-skill-advisor`, **so that** the plugin name matches the extracted skill identity while legacy env vars still work.

**Acceptance Criteria**:
1. Given current code/docs, when old plugin names are grepped outside frozen history, then no current `spec-kit-skill-advisor` hits remain (F004/Q4).
2. Given legacy deployments, when `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` is set, then the renamed plugin still honors it.

### US-003: Extraction Ownership Cleanup (Priority: P1)

**As a** maintainer, **I want** the advisor bridge owned by `system-skill-advisor`, **so that** future plugin changes do not depend on legacy `system-spec-kit` bridge placement.

**Acceptance Criteria**:
1. Given the bridge move, when plugin bridge tests run, then imports resolve from `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`.
2. Given post-extraction grep output, when the 20 references are reviewed, then only justified shared utility/build/shim refs remain (F006/Q6).
<!-- /ANCHOR:user-stories -->

---
<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- ANSWERED: Devin context injection behavior? Devin docs are silent and empirical testing was blocked; ADR-001 accepts hybrid explicit variant plus inheritance safety net (F001/Q1).
- ANSWERED: Devin hook source location? Skill-owned `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` (F002/Q2).
- ANSWERED: Compile target and registration shape? Dist path and `DEVIN_PROJECT_DIR` command identified (F003/Q3).
- ANSWERED: Plugin rename scope? Full rename with file, `PLUGIN_ID`, bridge, docs, tests, and env aliases; frozen history excluded (F004/Q4).
- ANSWERED: Bridge ownership? Move from `system-spec-kit` to `system-skill-advisor`; no duplicate exists (F005/Q5).
- ANSWERED: Post-extraction audit? 20 refs classified; shared/build refs justified, legacy test refs need cleanup (F006/Q6).
- ANSWERED: Verification strategy? 5-runtime parity, typecheck, vitest, DQI, MCP boot, Devin `/hooks`, grep cleanup (F007-F010).
<!-- /ANCHOR:questions -->

---
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Target**: See `research/research.md`
- **Resource Map**: See `resource-map.md`
