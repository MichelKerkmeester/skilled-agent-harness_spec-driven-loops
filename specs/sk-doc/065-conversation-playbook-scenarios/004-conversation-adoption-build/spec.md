---
title: "Feature Specification: Conversation adoption build"
description: "Builds the conversation scenarios the adoption research ranked: 30 scenarios across 17 skills and modes, one phase each, plus a decision phase for the six scenarios the runner cannot play yet."
trigger_phrases:
  - "conversation adoption build"
  - "phase 4 conversation adoption build"
  - "playbook conversation conversions"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Conversation adoption build

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/065-conversation-playbook-scenarios |
| **Predecessor** | 003-conversation-adoption-research |
| **Successor** | None |
| **Handoff Criteria** | Every child phase passes `validate.sh --strict`, and each built scenario has a passing live run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The adoption research in `../003-conversation-adoption-research/research/research.md` found 30 playbook scenarios across 17 skills and modes whose behavior shows on a later turn, depends on the user's answer or must survive a restart or compaction, yet each is checked by one prompt or not at all. Six more meet the same test but need runner support that does not exist.

### Purpose
Build those scenarios as `json conversation` scenarios the shared runner replays, one phase per skill or mode in the research's priority order, and decide separately whether to extend the runner for the remaining six.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert or add a conversation companion for each ranked scenario, in the playbook package of its skill or mode
- Prove each with the package validator and a live runner pass on its runtime
- Decide build or skip for the six runner gaps

### Out of Scope
- The skills' own code, hooks and commands
- Building runner adapters or actions without the operator's yes

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md` | Create | 001-cli-pi | PI-020 |
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md` | Create | 001-cli-pi | Pi goal hook |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md` | Modify | 002-cli-opencode | CO-046 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md` | Create | 002-cli-opencode | CO-019 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md` | Create | 002-cli-opencode | CO-018 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md` | Create | 002-cli-opencode | OpenCode goal hook |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` | Modify | 003-system-spec-kit | directive-lifecycle dedup |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin-conversation.md` | Create | 003-system-spec-kit | goal-opencode-plugin |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin-conversation.md` | Create | 003-system-spec-kit | session-cleanup-plugin |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude-conversation.md` | Create | 003-system-spec-kit | session-relaunch (claude, pi-opencode, command-runtimes) |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md` | Modify | 004-doctor-playbook | DOC-367 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md` | Create | 004-doctor-playbook | DOC-370 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md` | Create | 004-doctor-playbook | DOC-372 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md` | Create | 004-doctor-playbook | DOC-359 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md` | Create | 004-doctor-playbook | DOC-394 |
| `.skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md` | Modify | 005-sk-design-diagram | DIA-003 |
| `.skilled/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md` | Modify | 006-sk-prompt | SP-008 |
| `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback-conversation.md` | Create | 007-sk-code-hub | SD-003 |
| `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent-conversation.md` | Create | 008-sk-design-hub | SD-007 |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-and-boundaries/pause-on-ambiguous-component-conversation.md` | Create | 009-sk-create-changelog | CHG-007 |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder-conversation.md` | Create | 010-sk-create-goal | SCG-005 |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/no-observed-failure-refusal-conversation.md` | Create | 011-sk-create-repo-rule | RRD-004 |
| `.skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard-conversation.md` | Create | 012-mcp-code-mode | mcp-route-guard |
| `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md` | Create | 013-cli-external-orchestration | dispatch-preflight authorization |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin-conversation.md` | Create | 014-system-skill-advisor | CL-007 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/resume-specific-session-by-id-conversation.md` | Create | 015-cli-claude-code | CC-016 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/session-continuity/continue-previous-conversation-conversation.md` | Create | 015-cli-claude-code | CC-015 |
| `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork-conversation.md` | Create | 016-cli-codex | CX-017 |
| `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue-conversation.md` | Create | 017-cli-devin | resume-continue |
| `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook-conversation.md` | Create | 017-cli-devin | Devin goal hook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-cli-pi/ | P1: PI-020, Pi goal hook on pi | Complete |
| 2 | 002-cli-opencode/ | P1: CO-046, CO-019, CO-018, OpenCode goal hook on opencode | Complete |
| 3 | 003-system-spec-kit/ | P1: directive-lifecycle dedup, goal-opencode-plugin, session-cleanup-plugin, session-relaunch (claude, pi-opencode, command-runtimes) on claude-code, opencode | Deferred by the operator |
| 4 | 004-doctor-playbook/ | P1: DOC-367, DOC-370, DOC-372, DOC-359, DOC-394 on claude-code; DOC-407, DOC-409, DOC-410 also on opencode | Built; OpenCode: DOC-407 PASS, DOC-409 SKIP (fixture missing), DOC-410 not run (no `gh` write guard); Claude runs wait for the weekly reset |
| 5 | 005-sk-design-diagram/ | P2: DIA-003 on claude-code | Built; OpenCode and Pi tried 2026-11-03 and dropped; Claude run waits for the weekly reset |
| 6 | 006-sk-prompt/ | P2: SP-008 on claude-code | Dropped by the operator: conversion reverted 2026-11-03 |
| 7 | 007-sk-code-hub/ | P2: SD-003 on claude-code | Built; SD-004 OpenCode and Pi tried 2026-11-03 and dropped; Claude run waits for the weekly reset |
| 8 | 008-sk-design-hub/ | P2: SD-007 on claude-code | Dropped by the operator: companion deleted 2026-11-03 |
| 9 | 009-sk-create-changelog/ | P2: CHG-007 on claude-code; CHG-014 also on opencode, pi | Built; CHG-014 PASS on OpenCode and Pi; Claude runs wait for the weekly reset |
| 10 | 010-sk-create-goal/ | P2: SCG-005 on claude-code; SCG-010 also on opencode | Built; SCG-010 PASS on OpenCode, Pi dropped; Claude runs wait for the weekly reset |
| 11 | 011-sk-create-repo-rule/ | P2: RRD-004 on claude-code; RRD-005 also on opencode, pi | Built; RRD-005 PASS on OpenCode and Pi; Claude runs wait for the weekly reset |
| 12 | 012-mcp-code-mode/ | P2: mcp-route-guard on claude-code, opencode, pi | Built; OpenCode and Pi SKIP (no native ClickUp server); Claude run waits for the weekly reset |
| 13 | 013-cli-external-orchestration/ | P2: dispatch-preflight authorization on pi | Complete |
| 14 | 014-system-skill-advisor/ | P3: CL-007 on opencode | Complete |
| 15 | 015-cli-claude-code/ | P3: CC-016, CC-015 on claude-code | Built; live run waits for the Claude weekly reset |
| 16 | 016-cli-codex/ | P3: CX-017 on codex | Complete |
| 17 | 017-cli-devin/ | P3: resume-continue, Devin goal hook on devin | Complete |
| 18 | 018-runner-gaps/ | P3: decide adapters for Cursor, Hermes and Aside, a fork action and a product-restart action | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Every phase starts only after the conversation snippet template exists in the playbook mode's `assets/`

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-cli-pi | 002-cli-opencode | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 002-cli-opencode | 003-system-spec-kit | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 003-system-spec-kit | 004-doctor-playbook | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 004-doctor-playbook | 005-sk-design-diagram | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 005-sk-design-diagram | 006-sk-prompt | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 006-sk-prompt | 007-sk-code-hub | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 007-sk-code-hub | 008-sk-design-hub | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 008-sk-design-hub | 009-sk-create-changelog | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 009-sk-create-changelog | 010-sk-create-goal | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 010-sk-create-goal | 011-sk-create-repo-rule | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 011-sk-create-repo-rule | 012-mcp-code-mode | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 012-mcp-code-mode | 013-cli-external-orchestration | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 013-cli-external-orchestration | 014-system-skill-advisor | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 014-system-skill-advisor | 015-cli-claude-code | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 015-cli-claude-code | 016-cli-codex | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 016-cli-codex | 017-cli-devin | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
| 017-cli-devin | 018-runner-gaps | Independent: the next phase does not need this one. Each needs only the conversation snippet template | The finishing phase's `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Phase 003 edits system-spec-kit playbook files that the decision-capture session owns. Start it only after that session confirms the files are free.
- Phase 018 needs the operator's build-or-skip decision per runner gap.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research**: `../003-conversation-adoption-research/research/research.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
