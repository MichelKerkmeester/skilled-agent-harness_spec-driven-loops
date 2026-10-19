---
title: "Feature Specification: Session relaunch loop"
description: "This packet defines a phased relaunch loop for CLI sessions near the context limit. Auto-compaction settings stay unchanged and compaction remains the fallback when a hop fails."
trigger_phrases:
  - "session relaunch loop"
  - "auto-handoff near the context limit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
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

# Feature Specification: Session relaunch loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | worktrees/148-session-relaunch-deep-review |
| **Parent Spec** | None |
| **Parent Packet** | specs/hooks/023-session-relaunch-loop |
| **Predecessor** | 022-smart-rule-injection |
| **Successor** | None |
| **Handoff Criteria** | All nine children are Complete, recursive strict validation reports RESULT: PASSED, the Claude live relaunch is proven and every drift gate is at baseline or better. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A session near the context limit needs to write a handoff note, end and restart in the same terminal. The operator wants the Skilled repo to own this behavior as a hook and command across its CLI runtimes.

### Purpose
The nine child phases define a runtime-neutral core, the runtime-specific triggers and commands, and the evidence needed to close the work. The overall outcome is a Claude relaunch at 80% with auto-compaction unchanged as the fallback when a hop fails.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 001 builds the Claude relaunch path at 80%, including the shared core, Claude hooks, wrapper, handoff command, tests, documentation and live run.
- Phase 002 verifies Pi and OpenCode events and adds automatic triggers only where the spike supports them.
- Phase 003 verifies Codex, Cursor, Devin and Hermes entry points and uses the command trigger unless a spike confirms an automatic event.
- Phase 004 reviews the combined changes, updates the cross-phase docs, runs final live checks and closes the packet.
- Phase 005 fixes the twelve P2 advisories the deep review left, aligns the new code with the sk-code-opencode checklists and refreshes the docs the fixes touch.
- Phase 006 fixes what the second deep review finds against the closed phases, aligns the touched code with the sk-code-opencode checklists and refreshes the docs those fixes change.
- Phase 007 lets a session with no Gate 3 answer write its handoff note without an operator prompt, and pins the OpenCode default model.
- Phase 008 fixes the fifteen findings of the third deep review, a DeepSeek and Luna fan-out run after phase 007.
- Phase 009 fixes the verified findings of the DeepSeek and Luna research run after phase 008, moves the decisions every adapter repeats into the shared core and adds an adapter conformance suite.

### Out of Scope
- Changing autoCompactEnabled or autoCompactWindow.
- Adding resume flags to the wrapper.
- Editing existing hooks beyond the registry rows and documentation updates named by each phase.
- Supporting runtimes beyond Claude, Pi, OpenCode, Codex, Cursor, Devin and Hermes.
- Committing, pushing or merging.

### Files to Change
This is a phase-level file summary. Each child plan owns the detailed file list.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| .skilled/hooks/session-relaunch/, .skilled/bin/skilled-loop, .skilled/commands/speckit/handoff.md, hook-registry.json and generated Claude settings rows | Create and modify | 001-claude-relaunch-loop | Shared core, Claude hooks, wrapper, handoff command, tests and Claude documentation. |
| .skilled/hooks/session-relaunch/pi/, session-relaunch/opencode/, .pi/extensions/, OpenCode plugin files and wrapper case arms | Create and modify | 002-pi-opencode-adapters | Pi and OpenCode adapters, verified wrapper arms and runtime documentation. |
| .skilled/bin/skilled-loop runtime arms, verified adapters, registry rows and command mirrors | Modify | 003-command-trigger-runtimes | Codex, Cursor, Devin and Hermes entry points based on spike evidence. |
| Root README, system-spec-kit README, catalog and playbook indexes | Modify | 004-integration-review-and-docs-closure | Cross-phase doc rollup, review and closure evidence. |
| .skilled/hooks/session-relaunch/lib/ and its adapter folders, their tests, .skilled/bin/skilled-loop, the session-relaunch READMEs, the plugins-and-hooks playbook page, the Pi Fast Mode extension and the sk-doc README checklist script | Create and modify | 005-deep-review-remediation | Advisory fixes with one test per code finding, shared adapter helpers, a balanced Skip suffix and the docs the fixes change. |
| .skilled/hooks/session-relaunch/lib/, bin/, pi/, claude/, codex/, hermes/, opencode plugin, their tests, the hook registry, .claude/settings.json, .codex/hooks.json, the sk-doc version check, the session-relaunch READMEs, the env reference, the three plugins-and-hooks playbook pages, the feature catalog and the two benchmark run folders | Create and modify | 006-deep-review-2-remediation | Fixes for the second deep review's twelve findings, the code alignment pass, the live-playbook gaps G1 to G25, the docs those fixes change and the dated live-run records. |
| The spec-gate core and its test, the spec-gate README, AGENTS.md, opencode.json, the session-relaunch playbooks and one benchmark run folder | Modify | 007-handoff-gate-exemptions | The runtime-state exemption in the spec gate and in the Gate 2 and Gate 3 sentences, the OpenCode default model and the run-10 live records. |
| .skilled/hooks/session-relaunch/lib/ and its tests, the handoff command, the env reference, the phase 002, 006 and 007 records, the run-10 benchmark folder and this parent's spec and goal | Modify | 008-review-3-remediation | Code fixes with a test each, the doc corrections the third review found and the parent's seven-to-eight phase update. |
| .skilled/hooks/session-relaunch/lib/, bin/, claude/, codex/, hermes/, pi/, the OpenCode plugin, .skilled/bin/skilled-loop, their tests and the new adapter conformance suite, the session-relaunch READMEs, the handoff command, the env reference, the feature catalog entry, the phase 002 record, the research folder and this parent's spec and goal | Create and modify | 009-research-fixes-and-core-consolidation | Research fixes with a failing-first test each, shared nudge and kill-target helpers in the core, the conformance suite, the doc drift the research found and the parent's eight-to-nine phase update. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-claude-relaunch-loop/ | Claude session hops at 80%, with auto-compaction untouched as the fallback. | complete |
| 2 | 002-pi-opencode-adapters/ | Automatic triggers for Pi and OpenCode where verified, using the shared core. | complete |
| 3 | 003-command-trigger-runtimes/ | Codex, Cursor, Devin and Hermes enter the loop by command unless a spike confirms an automatic event. | complete |
| 4 | 004-integration-review-and-docs-closure/ | Cross-phase review, doc rollup, final live runs and closure. | complete |
| 5 | 005-deep-review-remediation/ | Fix the twelve P2 advisories from the deep review, align the new code with sk-code-opencode and refresh the docs it touches. | complete |
| 6 | 006-deep-review-2-remediation/ | Fix what the second deep review finds against the closed phases, align the touched code with the sk-code-opencode checklists and refresh the docs the fixes change. | complete |
| 7 | 007-handoff-gate-exemptions/ | Runtime-state handoff notes pass the spec gate and stay out of Gate 2 and Gate 3, and the OpenCode default model is pinned. | complete |
| 8 | 008-review-3-remediation/ | Fix the fifteen findings of the third deep review: five code fixes with tests, two adapter test gaps and the doc and evidence records that claimed more than they showed. | complete |
| 9 | 009-research-fixes-and-core-consolidation/ | Fix the verified research findings with a failing-first test each, move the decisions every adapter repeats into the core, add an adapter conformance suite and correct the doc drift. | complete |
| 10 | 010-post-fix-research/ | Five more research iterations after phase 009, DeepSeek V4.1 Flash max through cli-pi on LLM Gateway, with each finding verified. | complete |

### Phase Transition Rules

- Each phase must pass strict validation independently before the next phase begins.
- This map tracks aggregate phase progress.
- Use /speckit:resume with the selected child path to resume a phase.
- Run recursive strict validation on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-claude-relaunch-loop | 002-pi-opencode-adapters | the from-phase is Done per plan section 7 (all its AC seeds Met, gate PG passed) | validate.sh <child> --strict RESULT: PASSED plus its acceptance-criteria.md rows Met |
| 002-pi-opencode-adapters | 003-command-trigger-runtimes | the from-phase is Done per plan section 7 (all its AC seeds Met, gate PG passed) | validate.sh <child> --strict RESULT: PASSED plus its acceptance-criteria.md rows Met |
| 003-command-trigger-runtimes | 004-integration-review-and-docs-closure | the from-phase is Done per plan section 7 (all its AC seeds Met, gate PG passed) | validate.sh <child> --strict RESULT: PASSED plus its acceptance-criteria.md rows Met |
| 004-integration-review-and-docs-closure | 005-deep-review-remediation | the deep review of the closed phases has a report with a finding registry | `review-archive/20261018T184826Z/review-report.md` exists with verdict and registry |
| 005-deep-review-remediation | 006-deep-review-2-remediation | the second deep review has a report with a finding registry | `review-archive/20261019T144809Z/review-report.md` exists with verdict and registry |
| 006-deep-review-2-remediation | 007-handoff-gate-exemptions | phase 006 is Complete, and its live runs recorded the Gate 3 and sk-doc prompts G20 and G21 that phase 007 removes | `validate.sh 006-deep-review-2-remediation --strict` RESULT: PASSED, and G20 and G21 are in the 006 implementation summary |
| 007-handoff-gate-exemptions | 008-review-3-remediation | phase 007 is Complete and the third deep review has a report with a finding registry | `validate.sh 007-handoff-gate-exemptions --strict` RESULT: PASSED, and `review/review-report.md` exists with verdict and registry |
| 008-review-3-remediation | 009-research-fixes-and-core-consolidation | phase 008 is Complete and the research run after it has a merged report with a verification table | `validate.sh 008-review-3-remediation --strict` RESULT: PASSED, and `research/research.md` exists with its verified findings |
| 009-research-fixes-and-core-consolidation | 010-post-fix-research | phase 009 is Complete and merged to main | `validate.sh 009-research-fixes-and-core-consolidation --strict` RESULT: PASSED |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Do pre-commit and CI run sync checks with --check?
- Do the Pi and OpenCode spikes verify their usage events, nudge APIs, arm events and interactive seed and name flags well enough for an AUTO verdict?
- What interactive seed syntax, Stop or sessionEnd events and command mirror forms do the Codex, Cursor, Devin and Hermes spikes verify, and which verdict does each runtime receive?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Phase 001: 001-claude-relaunch-loop/spec.md, plan.md and tasks.md
- Phase 002: 002-pi-opencode-adapters/spec.md and plan.md
- Phase 003: 003-command-trigger-runtimes/spec.md and plan.md
- Phase 004: 004-integration-review-and-docs-closure/spec.md and plan.md
- Phase 005: 005-deep-review-remediation/spec.md and plan.md
- Phase 006: 006-deep-review-2-remediation/spec.md and plan.md
