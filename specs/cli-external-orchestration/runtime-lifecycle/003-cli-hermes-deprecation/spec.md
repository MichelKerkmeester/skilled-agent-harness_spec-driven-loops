---
title: "Feature Specification: Deprecate and remove the cli-hermes executor and the .hermes runtime folder"
description: "Remove the cli-hermes executor, the .hermes runtime folder and every live Hermes reference, because the runtime saw almost no use and cost steady mirror upkeep."
trigger_phrases:
  - "cli hermes deprecation phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation"
    last_updated_at: "2026-11-07T00:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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

# Feature Specification: Deprecate and remove the cli-hermes executor and the .hermes runtime folder

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `worktrees/321-deprecate-cli-hermes` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation |
| **Predecessor** | `071-cli-hermes-creation` (the build this packet removes) |
| **Successor** | None |
| **Handoff Criteria** | No live file outside `specs/` and released changelogs mentions Hermes, and every touched test suite matches its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hermes Agent was wired in as a seventh CLI runtime: the `cli-hermes` executor mode, a `.hermes/` folder of 67 generated skill copies, 44 prompt stubs and a repo-guards plugin, session-relaunch adapters, dispatch rules and deep-loop executor support. Its own session store shows 215 sessions, 187 of them during the build on 2026-09-14 and 2026-09-15, five interactive sessions in total and none after 2026-10-25, while git shows 553 commits touching `.hermes/`. Hermes is designed as a user-level personal agent, so the per-repo layer served almost no one and cost steady upkeep.

### Purpose
Remove Hermes from Skilled completely: delete the executor, the runtime folder and the sync tooling, take Hermes out of every runtime list, registry, hook, test and document, and regenerate the derived indexes so nothing routes to or advertises Hermes. The operator chose removal with no archive and no deprecation stubs; git history is the backup.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Runtime code and tests: deep-loop executors, hooks, launcher, git hooks, doctor scripts and their tests
- Docs and registries: the cli-external-orchestration hub surfaces, system-spec-kit docs, root README, AGENTS.md and the agent mirrors
- Regeneration of the trigger index, retrieval fixtures and advisor graph, then an alignment sweep for residue

### Out of Scope
- `specs/` history, including packet 071, which records what was built
- Released changelog files, which record past releases
- The user-level Hermes install under `~/.hermes/` and the user's shell profile

### Files to Change
Summary of the files touched across all phases. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.hermes/` | Delete | 002 | The Hermes runtime folder |
| `.skilled/skills/cli-external-orchestration/cli-hermes/` | Delete | 002 | The executor mode |
| `.skilled/skills/system-deep-loop/**`, `.skilled/hooks/**`, `.skilled/bin/**`, `.skilled/commands/**` | Modify/Delete | 001 | Hermes executor and runtime support |
| `README.md`, `AGENTS.md`, hub registries | Modify | 002 | Hermes references |
| `trigger-index.json`, retrieval fixtures | Regenerate | 003 | Derived indexes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-runtime-code-and-tests/ | Remove Hermes from runtime code and tests | Complete |
| 2 | 002-docs-and-registries/ | Remove Hermes from docs, registries and runtime mirrors | Complete |
| 3 | 003-regeneration-and-alignment-sweep/ | Regenerate derived indexes and sweep for residue | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-runtime-code-and-tests | 002-docs-and-registries | Touched suites match baseline | Rerun of each baseline command |
| 002-docs-and-registries | 003-regeneration-and-alignment-sweep | Hub gate passes without the mode | Per-hub gate with the hub path |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator chose full removal with no backup on 2026-11-07.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
