---
title: "Feature Specification: system-skilled-doctor owns every doctor command and holds the only doctor playbook"
description: "Moves the six doctor commands other skills owned to system-skilled-doctor and moves the central doctor playbook into the skill's own package."
trigger_phrases:
  - "own all doctor commands phase parent spec"
  - "system-skilled-doctor owns every doctor command"
  - "doctor playbook into the skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/008-own-all-doctor-commands"
    last_updated_at: "2026-11-24T00:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase parent authored"
    next_safe_action: "Implement 001-ownership-transfer"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "own-all-doctor-commands"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: system-skilled-doctor owns every doctor command and holds the only doctor playbook

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/541-own-all-doctor-commands` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skilled-doctor/008-own-all-doctor-commands |
| **Predecessor** | 007-overlay-framework-root-layout |
| **Successor** | None |
| **Handoff Criteria** | Both children pass strict validation and the doctor, advisor and playbook gates match the baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seventeen `/doctor` commands exist, but `system-skilled-doctor` owns only eleven. `/doctor:sk-code` and `/doctor:ci` sit with sk-code, `/doctor:git` with sk-git, `/doctor:sk-skill` with sk-doc, `/doctor:skill-advisor` with system-skill-advisor and `/doctor:deep-loop` with system-deep-loop. Their scenarios live in a playbook at `.skilled/manual-testing-playbook/` that no skill owns. A reader looking for the doctor has to check six skills and one folder outside every skill.

### Purpose
`system-skilled-doctor` is the one owner of every doctor command and the one home of every doctor scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The owner of all seventeen doctor commands: the router `skill_agent` tags, the generated advisor rows, the skill's own Owns statements and the docs that describe ownership.
- The doctor playbook package: its scenario files, its root document, and the tests and lists that pin its path.

### Out of Scope
- Moving engine scripts or workflow YAML out of `.skilled/commands/doctor/`. Ownership is a routing and documentation fact, not a code location.
- Scenarios in other skills' playbooks that test a skill mode through its doctor command, such as the sk-code CI and quality playbooks.
- History under `specs/` and `changelog/`.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/commands/doctor/{ci,deep-loop,git,sk-code,sk-skill,skill-advisor}.md` | Modify | 001-ownership-transfer | `skill_agent` tag names system-skilled-doctor |
| `.skilled/skills/system-skill-advisor/runtime/...` | Modify | 001-ownership-transfer | Regenerated command rows and the tests that pin the old owners |
| `.skilled/skills/system-skilled-doctor/{SKILL.md,README.md}` | Modify | 001-ownership-transfer | Owns all seventeen |
| `.skilled/manual-testing-playbook/` | Move | 002-playbook-consolidation | Into `system-skilled-doctor/manual-testing-playbook/doctor-commands/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-ownership-transfer/ | Six doctor commands change owner to system-skilled-doctor | Complete |
| 2 | 002-playbook-consolidation/ | The central doctor playbook moves into the skill's package | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ownership-transfer | 002-playbook-consolidation | Every doctor bridge row names system-skilled-doctor | `rg -c "ownerSkillId: 'system-skilled-doctor'" command-attach.ts` covers every doctor row |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator decided the owner and the playbook home on 2026-11-24.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
