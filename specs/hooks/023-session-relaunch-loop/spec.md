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
| **Branch** | worktrees/142-session-relaunch-loop |
| **Parent Spec** | None |
| **Parent Packet** | specs/hooks/023-session-relaunch-loop |
| **Predecessor** | 022-smart-rule-injection |
| **Successor** | None |
| **Handoff Criteria** | All four children are Complete, recursive strict validation reports RESULT: PASSED, the Claude live relaunch is proven and every drift gate is at baseline or better. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A session near the context limit needs to write a handoff note, end and restart in the same terminal. The operator wants the Skilled repo to own this behavior as a hook and command across its CLI runtimes.

### Purpose
The four child phases define a runtime-neutral core, the runtime-specific triggers and commands, and the evidence needed to close the work. The overall outcome is a Claude relaunch at 80% with auto-compaction unchanged as the fallback when a hop fails.

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
