---
title: "Feature Specification: Build system-skilled-doctor and the doctor overlay command"
description: "A project that vendors Skilled keeps its local changes only through private scripts, and ten Skilled integration doctor commands are credited to skills whose purpose does not cover them. These six phases add system-skilled-doctor, which owns those commands and a new /doctor:overlay command that applies, checks and re-pins a vendored copy's overlays, then fit the engine to a real vendoring project with its own overlay folder."
trigger_phrases:
  - "skill and overlay build phase parent spec"
  - "system skilled doctor build"
  - "doctor overlay build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Build system-skilled-doctor and the doctor overlay command

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-06 |
| **Branch** | `worktrees/320-system-skilled-doctor` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skilled-doctor |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All six children pass `validate.sh --strict`, and their acceptance criteria are Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A project that vendors Skilled by archive, as Barter does, keeps its local changes across a new pin only through a private overlay engine, guard adapters in each runtime, a manual runbook and scratch scripts written for each re-pin. Each re-pin still meets the same traps: no rollback for an untracked tree, a lock nothing enforces, a blocked apply that needs a hand-written restore script, and in-place fixes the next copy reverts. Separately, ten doctor commands about putting Skilled into a project are credited to `system-spec-kit` or `sk-doc`.

### Purpose
One standalone skill, `system-skilled-doctor`, owns the doctor commands for supporting and integrating Skilled into a project, and its new `/doctor:overlay` command lets any vendoring project record its divergences, apply and check them, and re-pin in one guarded run with a backup and a rollback.

The decided design, its research and the operator's eight rulings are in `research/`: `design-spec.md` holds REQ-001 to REQ-013, `design-plan.md` the architecture, `research.md` the evidence, and `design-decisions.md` the rulings Q001 to Q008.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `system-skilled-doctor` skill and the ten moved `skill_agent` tags.
- The overlay engine with its `status` and `apply` targets.
- The `repin` target with stage, drift scan, backup, copy, apply, check and rollback.
- The pre-write guard hook and its runtime adapters.

### Out of Scope
- Barter's own cutover to `/doctor:overlay`, which a later Barter packet does after a re-pin brings the skill in.
- Any write under Barter's tree. Its files are read as the port source only.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skilled-doctor/` | Create | 001 | The skill, its router, README, metadata, changelog and playbook |
| `.skilled/commands/doctor/*.md` (ten routers) | Modify | 001 | The `skill_agent` tag |
| `.skilled/commands/doctor/overlay.md` and its assets | Create | 002, 003 | The command router, workflows and presentation asset |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` and its tests | Create | 002, 003 | The engine |
| `.skilled/hooks/overlay-guard/` and `hook-registry.json` | Create, Modify | 004 | The guard hook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-skill-and-tag-move/ | The skill and the ten tag moves (REQ-008) | Complete |
| 2 | 002-overlay-engine/ | The engine, `status` and `apply` (REQ-003, 004, 005, 009, 011, 012) | Complete |
| 3 | 003-repin/ | The `repin` target (REQ-006, 007, 010) | Complete |
| 4 | 004-guard-hook/ | The pre-write guard hook (REQ-013) | Complete |
| 5 | 005-barter-parity/ | Adoption by a real vendoring project: per-entry protected-path refusal, `.dsh` and not-copied changes in a re-pin, adoption docs and routing, Barter's tree on the engine | Complete |
| 6 | 006-setup-guide/ | A root `SETUP.md` that guides linking and copying with overlays, and a root README that points to it | Complete |
| 7 | 007-doctor-ux-research/ | [Phase 7 scope] | Pending |
| 8 | 008-overlay-first-write-checks/ | Opt-in write checks for a vendoring project: a strict `--guard` behind the manifest's `strictWrites`, `apply --adopt`, a `generated` list, a `pre-commit` check and a `root-file` line in the re-pin report | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-skill-and-tag-move | 002-overlay-engine | The skill exists and owns the ten commands | Doctor tests 1005 of 1005, every moved bridge names the skill |
| 002-overlay-engine | 003-repin | `status` and `apply` pass the ported tests and one test per engine requirement | `node --test` on the engine tests |
| 003-repin | 004-guard-hook | `repin`, `--stage` and `--rollback` pass their tests | `node --test` on the engine tests |
| 004-guard-hook | 005-barter-parity | The guard hook ships and the engine passes its own tests | `node --test` on the engine tests |
| 005-barter-parity | 006-setup-guide | The engine runs on a real copy and its docs match it | Barter's tree passes `status` and the doctor suite passes |
| 006-setup-guide | 007-doctor-ux-research | [Criteria TBD] | [Verification TBD] |
| 007-doctor-ux-research | 008-overlay-first-write-checks | None. Phase 8 builds on phases 2 to 4 and does not wait on the research | `node --test` on the overlay engine tests |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator decided every design question, Q001 to Q008 in `research/design-decisions.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Design**: See `research/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
