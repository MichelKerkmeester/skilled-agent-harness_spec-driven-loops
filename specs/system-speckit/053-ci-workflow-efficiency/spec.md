---
title: "Feature Specification: CI workflow efficiency, speed and operator control"
description: "Phased packet to cut the CI load of the 33 GitHub Actions workflows, give clones an on/off control, and add a /doctor:ci command and an sk-code-ci standard. Phase 001 is the research; 002-008 are proposed implementation."
trigger_phrases:
  - "ci workflow efficiency phase parent spec"
  - "053 ci workflow efficiency"
  - "github actions efficiency packet"
  - "doctor ci and sk-code-ci packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency"
    last_updated_at: "2026-10-23T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed phase 001 research and added proposed phases 002-008 to the map"
    next_safe_action: "Create and plan 002-trigger-surgery from 001-research/research/research.md section 15"
    blockers: []
    key_files:
      - "001-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-ci-workflow-efficiency"
      parent_session_id: null
    completion_pct: 13
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: CI workflow efficiency, speed and operator control

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates strict on its own; the research phase's `research.md` is the plan the implementation phases follow |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository's 33 workflows spend about 3,812 runner-minutes a day. More than half comes from a bot commit that re-runs 13 workflows on files they never read, and nothing is cached. Almost nothing cancels superseded runs, and one serial test project sets the wall-clock tail. A clone of the repo cannot switch workflows off without editing YAML, and the rules for writing a workflow are scattered and mostly unenforced.

### Purpose
Cut the CI load and the time to a signal, give base repos and clones an on/off control that defaults to everything on, and give workflow authoring one standard (`sk-code-ci`) and one operator command (`/doctor:ci`).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measuring CI cost and designing the fixes (phase 001, complete).
- Trigger and path-filter changes, caching and provisioning dedupe, slow and failing suites.
- A `vars.*` on/off control, workflow hygiene (timeouts, permissions), and a consolidation decision.
- The `sk-code-ci` standards surface and the `/doctor:ci` command.

### Out of Scope
- Moving CI off GitHub Actions or onto self-hosted runners.
- Changing what any check verifies, as distinct from when and how it runs.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/` | Create | 001 | Research run and synthesis |
| `.github/workflows/*.yml`, `.github/workflows/README.md` | Modify | 002, 003, 005, 006, 008 | Triggers, caching, switches, hygiene, consolidation, test speed |
| `.github/actions/` (composite setup action) | Create | 003 | Shared cached setup |
| `.skilled/skills/sk-code/` (sk-code-ci surface and hub registration) | Create/Modify | 004, 007 | Standards surface and review wiring |
| `.skilled/commands/doctor/ci.md` and its route assets | Create | 007 | The `/doctor:ci` router |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Phase 001 is research; phases 002 onward are implementation and are proposed only, with no folder created yet.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | Research: 20-iteration measured study and phase plan (`research/research.md`) | Complete |
| 2 | 002-trigger-surgery/ | Implementation: ignore the 4 generated paths on 13 workflows (~2,073 runner-min/day), PR cancel-in-progress, narrow path filters, advisory-checks cleanup. Low-medium risk, low effort, no dependency | Pending |
| 3 | 003-caching-and-provision-dedupe/ | Implementation: composite setup action with `actions/cache`, pinned bun, npm dedupe, then merge hooks-node-tests into opencode-plugin-tests (~227-247 runner-min/day). Medium risk and effort; before 006 and 008 | Pending |
| 4 | 004-sk-code-ci-surface/ | Implementation: read-only sk-code-ci surface (rules, protected set, switch shape, templates) and its hub registration. Low risk, medium effort; before 005, 006, 007 | Pending |
| 5 | 005-ci-on-off-control/ | Implementation: `vars.SKILLED_CI*` job-level switches defaulting on, timeouts, least-privilege permissions, dependabot job split. Low risk, medium effort; after 002, 003, 004 | Pending |
| 6 | 006-consolidation-decision/ | Implementation: re-measure, then decide whether to merge the always-run workflows inside one switch group. High risk; after 003 and 005 | Pending |
| 7 | 007-doctor-ci/ | Implementation: `/doctor:ci` router (`report` read-only default, `scaffold` confirmed write, toggle), advisor bridges, then the CI surface value in sk-code-review. Medium risk; after 004 | Pending |
| 8 | 008-slow-tests-and-flakiness/ | Implementation: parallelize or shard spec-kit-check's CLI vitest project (~450 runner-min/day, ~525 s wall); fix deep-loop-runtime and the other real failures. Medium risk; after 003 | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `research/research.md` sections 14-15 hold the ranked plan | `001-research/acceptance-criteria.md` all Met |
| 003 | 006, 008 | Cache landed and re-measured, so later numbers use the new baseline | Fresh `gh run view --json jobs` medians |
| 004 | 005, 007 | sk-code-ci rules and templates stable | sk-code hub gates green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Are the spec-kit CLI tests safe under `fileParallelism: true`, or does phase 008 need sharding?
- Can the owner's token write repository variables, so that `/doctor:ci` toggle writes rather than prints?
- How does message-contract's single required context stay satisfied on rebuild commits once generated paths are ignored?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research**: `001-research/research/research.md`
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
