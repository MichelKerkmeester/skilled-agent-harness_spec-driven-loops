---
title: "Feature Specification: Surface setup build"
description: "Phase parent that builds the 028 surface setup recommendations: the clone path and message fixes R1, R2, R4 and R5 in one child, and the read-only /doctor:sk-code setup command R3 in a second child that prints the first child's repair texts."
trigger_phrases:
  - "surface setup build phase parent spec"
  - "surface setup build"
  - "doctor sk-code setup build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build"
    last_updated_at: "2026-10-13T19:00:00Z"
    last_updated_by: "planner"
    recent_action: "Planned two build phases from the 028 final recommendations"
    next_safe_action: "Build 001, then build 002 from origin/main once 001 is on it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Surface setup build

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-13 |
| **Branch** | `worktrees/133-surface-setup-build` for planning and 001; 002 builds in its own worktree from origin/main |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 028-surface-setup-hardening-research |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An external user who clones the repository and follows the README block "What Adapting `sk-code` Looks Like" cannot reach a green check battery. In a fresh clone, `parent-skill-check.cjs` and `ci-skill-root-metadata.cjs` fail on a missing `@spec-kit/shared` build, the second with a raw Node stack, and the block names neither the provision command nor the hook trust setting. After a hand add, the guard's stale-manifest line prints only `Re-mint: sk-code`. The removal recipe sends the user to the wrong tool for `graph-metadata.json`, leaves out the feature catalog and never names `leaf-scopes.json`. The last battery leg, the route probe, exits 0 on the legacy stub. The 028 research verified each of these with a file read or a copy run and ended in five recommendations (`../028-surface-setup-hardening-research/research/research.md` sections 6 and 8).

### Purpose
Build the five recommendations in two phases, so that a user who reads only the README block reaches a green battery from a fresh clone, every failure on the way names its fix, and one read-only doctor command runs the battery and names the repair for each failing leg.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1, R2, R4 and R5 of research section 6: the clone-path lines, the guard's stale-manifest line, the README corrections and the named failure of the contract library.
- R3: `/doctor:sk-code` with one read-only target, `setup`.

### Out of Scope
- The rejected ideas X1 to X11 of research section 7, among them a `sk-code-setup` hub mode, a target under `/doctor:skill-advisor`, mutating repairs inside the doctor and a surface add or remove script.
- The optional retitle of the `provision` usage line in `worktree-naming.sh`: a usage string does not justify a sk-git release.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `README.md` | Modify | 001 | "Before you start" lines and the removal and add corrections |
| `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | 001 | Stale-manifest line names the commands |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`, `ci-skill-root-metadata.cjs`, `tests/root-router-contract.test.cjs` | Modify | 001 | Named failure for an unprovisioned tree |
| `.skilled/commands/doctor/sk-code.md`, `_routes.yaml`, `assets/doctor-sk-code-setup.yaml` and presentation, `.skilled/commands/README.txt`, three reference lines | Create, Modify | 002 | `/doctor:sk-code setup` |

### Traceability

| Item | Child | Acceptance check |
|------|-------|------------------|
| R1 | 001-clone-path-and-messages | In a fresh clone, the provision command the block names exits 0, then `parent-skill-check.cjs .skilled/skills/sk-code` and `ci-skill-root-metadata.cjs` exit 0; the block names `skilled.trustRepoHooks` |
| R2 | 001-clone-path-and-messages | In a copy with stale sk-code routing, the guard exits 1 and prints the refresh command and both manifest paths; following them brings the guard and sync `--check` to exit 0 |
| R4 | 001-clone-path-and-messages | The block names `regenerate-skill-derived.cjs`, the feature catalog, `leaf-scopes.json` and the surface-count files |
| R5 | 001-clone-path-and-messages | In an unprovisioned clone, `ci-skill-root-metadata.cjs` exits 1 with one line naming the provision command and no stack |
| R3 | 002-doctor-sk-code-setup | `route-validate.sh` exits 0 with the `setup` route; the target passes a pristine tree and names the failing leg and its repair after a hand add |

Five items, five rows, two children. No item is unmapped and none is mapped twice.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-clone-path-and-messages/ | R1, R2, R4 and R5: the README block reaches a green battery from a fresh clone, the guard's stale line names its commands, and an unprovisioned checker names the provision command | Complete |
| 2 | 002-doctor-sk-code-setup/ | R3: a read-only `/doctor:sk-code setup` that runs the battery and prints one repair command per failing leg | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- 002 starts from origin/main once the operator has pushed 001, because it prints 001's repair texts

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-clone-path-and-messages | 002-doctor-sk-code-setup | 001's goal criteria pass and 001 is on origin/main | 001 `goal.md` criteria; `git log origin/main` shows 001's `Spec:` trailer |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether `/doctor:sk-code setup` also runs `test_readme_manifest.py` in check mode (research section 12); 002 decides while building.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Research**: See `../028-surface-setup-hardening-research/research/research.md` sections 6 to 8
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
