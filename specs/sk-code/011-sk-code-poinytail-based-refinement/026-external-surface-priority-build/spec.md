---
title: "Feature Specification: External surface priority build"
description: "Phase parent that builds the verified final recommendations of the external surface priority research, R1, R2, R3, R4, R7, R8 and R9, plus dropping ROUTER.md from doctor check 13a, so an external user can remove the example sk-code surfaces and add their own ahead of sk-code-skilled."
trigger_phrases:
  - "external surface priority build phase parent spec"
  - "external surface priority build"
  - "sk-code surface insertion rule build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "planner"
    recent_action: "Planned five build phases from the 025 final recommendations and the 13a ruling"
    next_safe_action: "Operator merges the planning branch, then sets the 026 goal to build 001 to 005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: External surface priority build

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-13 |
| **Branch** | `worktrees/124-surface-priority-round-two` (planning); each child builds in its own worktree as its goal says |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 025-external-surface-priority-research |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An external user who deletes the Webflow and Obsidian example surfaces from sk-code, or adds a surface of their own, today ends on 113 doctor failures, a guard that reports fresh while a deleted packet still routes, drift guards that throw on the missing example, and an added surface that sorts after `sk-code-skilled` and loses every keyword tie. The README tells them to replace the native OpenCode surface and to edit a ROUTER.md map without naming the steps that make the checks green. The 025 research, verified claim by claim on 2026-10-13, ends in seven final recommendations (`../025-external-surface-priority-research/research/research.md` section 14). Separately, doctor check 13a still requires a hub `ROUTER.md` to carry the `SKILL.md` version, while the operator ruled that `ROUTER.md` keeps its own version, as `frontmatter-versioning.md` already says for every doc but `SKILL.md`.

### Purpose
Build every final recommendation and the 13a change in five independently verifiable phases, so that a user who reads only the README adaptation block can remove the examples, add their own surface ahead of OpenCode and reach a green doctor, guard, sync and drift battery.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seven final recommendations R1, R9, R3, R2, R7, R4 and R8 of research section 14, each as the verification pass narrowed or restructured it.
- Dropping `ROUTER.md` from doctor check 13a, by operator decision; the JSON routing files keep matching `SKILL.md`.
- The next Skilled release note under `.skilled/changelog/skilled/`, newer than the shipped v4.0.0.4.

### Out of Scope
- R5: decided by the operator, sk-code-skilled keeps its generic language keywords. No work.
- R6 (X21), R10 (X22), X20, X23, X24 and a removal command (X11): rejected in the verification pass, research section 14.2.
- Moving the authored compiled-routing closure out of `specs/` (X16), a rank field or native flag (X1, X2), auto-generated canary cases (X10) and a re-mint inside the scaffold (X14).
- Editing the shipped v4.0.0.4 release note.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml`, `create-skill-parent-auto.yaml`; `parent-hub-router-schema.md`, `parent-skills-nested-packets.md` | Modify | 001 | Insertion rule and completion-report follow-ups |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/commands/doctor/assets/doctor-update-apply.yaml`, `.skilled/bin/compiled-route-guard.cjs`, `.skilled/bin/compiled-route-sync.cjs`, their tests | Modify | 002 | Repair pointers and named failures |
| `sk-code-skilled/assets/scripts/verify-router-sync.cjs`, `verify-doc-claims.cjs`, their tests | Modify | 003 | Drift guards that tolerate a removed example |
| `parent-skill-check.cjs` check 13a and its test, `create-changelog-confirm.yaml`, `create-changelog-auto.yaml`, `frontmatter-versioning.md` | Modify | 004 | ROUTER.md keeps its own version |
| `README.md`, `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/README.md`, the next `.skilled/changelog/skilled/` note | Modify, Create | 005 | External-user guide, example markers, release note |

### Traceability

Every final recommendation and the 13a item maps to exactly one child. The acceptance check is research section 14's, with the verification-pass corrections the child spec carries.

| Item | Child | Acceptance check |
|------|-------|------------------|
| R1 | 001-scaffold-surface-placement | The two YAML `tieBreak` lines are byte-identical; in a full-tree copy, the update workflow for a stand-in surface yields `[sk-code-quality, sk-code-review, <stand-in>, sk-code-skilled, sk-code-obsidian, sk-code-webflow]`, the doctor passes 5e and 5i, and after re-mint a prompt that ties the stand-in with OpenCode routes `[<stand-in>, sk-code-skilled]` |
| R8 | 001-scaffold-surface-placement | A `--surfaces` run's completion report contains the canary line and the commit-with-hooks line; following them clears 5k-canary and leaves the guard and sync `--check` at exit 0 |
| R3 | 002-doctor-guard-sync-messages | In a copy, a deleted packet prints a 3c line naming the README block; a reorder plus refresh prints a guard line naming the runtime activation manifest and its authored twin; applying the repair string verbatim ends with the guard and sync `--check` at exit 0; the doctor and guard test suites pass |
| R7 | 002-doctor-guard-sync-messages | In a specs-pruned copy, sync `--check` exits 1 with one line naming `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` and no stack, and the guard exits 1 naming the missing authored manifest; in the 019-only copy both exit 0 |
| R2 | 003-example-tolerant-drift-guards | `run-all-drift-guards.sh` exits 0 on the live tree; in a copy after the removal recipe, router-sync checks 1a to 4 pass, and still pass with ROUTER.md's Webflow prose section removed; doc-claims `surfaces` accepts "two surfaces" when the registry has two; one new test per change passes |
| 13a | 004-router-version-parity | A `ROUTER.md` version that differs from `SKILL.md` no longer fails 13a, a JSON routing file that differs still does, and the changelog workflow stops copying the release version into `ROUTER.md` |
| R4 | 005-external-user-guide | `SKILL.md:40`, `README.md:800` and `:1384` and the sk-code README table mark OpenCode native and the two examples optional; `run-all-drift-guards.sh` exits 0 on the live tree; the sk-doc validators pass on the touched docs; the next release note states the rule |
| R9 | 005-external-user-guide | In a fresh full-tree copy, an agent that reads only the README adaptation block removes both examples and adds a stand-in surface, then parent-skill-check, `ci-skill-root-metadata.cjs`, the guard, sync `--check` and `run-all-drift-guards.sh` all exit 0, and a tied prompt routes `[<stand-in>, sk-code-skilled]` |

Nine items, nine rows, five children. No item is unmapped and none is mapped twice.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-scaffold-surface-placement/ | R1 and R8: the scaffold places a new surface after the workflow modes and ahead of the existing surfaces, and its completion report names the canary and commit follow-ups | Complete |
| 2 | 002-doctor-guard-sync-messages/ | R3 and R7: the doctor, guard and sync messages point at the fix, and a missing authored closure is a named failure | Complete |
| 3 | 003-example-tolerant-drift-guards/ | R2: the sk-code drift guards tolerate a removed example surface | Complete |
| 4 | 004-router-version-parity/ | Doctor check 13a stops requiring `ROUTER.md` to carry the `SKILL.md` version | Complete |
| 5 | 005-external-user-guide/ | R4 and R9: the README adaptation block becomes the external-user guide, OpenCode is marked native, and the next release note states the rule | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- 001, 002 and 003 are independent and may build in parallel; each finished phase goes to main after the operator's go-ahead; 004 starts from origin/main once 002 is on it; 005 builds last, from origin/main once 001 to 004 are on it

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-scaffold-surface-placement | 002-doctor-guard-sync-messages | None for the build; 001, 002 and 003 build in parallel from origin/main | Each child's goal criteria |
| 002-doctor-guard-sync-messages | 003-example-tolerant-drift-guards | None for the build; parallel | Each child's goal criteria |
| 003-example-tolerant-drift-guards | 004-router-version-parity | 002's goal criteria pass on its branch; 004 branches from it because both edit `parent-skill-check.cjs` and its invariants test | 002 `goal.md` criteria |
| 004-router-version-parity | 005-external-user-guide | 001 to 004 goal criteria pass; all four are on origin/main | 005 `goal.md` criteria |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. The release-note version and the merge order are recorded as decisions in `goal.md`; each child's questions are in its own spec.md.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Research**: See `../025-external-surface-priority-research/research/research.md` sections 13 and 14
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
