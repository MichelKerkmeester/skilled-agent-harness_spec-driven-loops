---
title: "Goal: Name the file in plan phase lines"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines"
    last_updated_at: "2026-11-12T00:15:09Z"
    last_updated_by: "markdown"
    recent_action: "Recorded final phase closeout evidence"
    next_safe_action: "No follow-up action remains for this packet."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "T006 exit=0 is recorded in scratch/build-evidence.md line 152."
---
# Goal: Name the file in plan phase lines

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A plan written from the template or the authoring card names the file each phase touches.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Proof stays on task lines. No `Verify:` rule is added to plan lines. |
| D2 | `AGENTS.md` is not edited. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The GOOD example at the phases FILL comment in `plan.md.tmpl` names a file for each phase
- [x] The matching example in `spec-authoring-card.md` names a file for each phase
- [x] `SKILL.md` in system-spec-kit reads "A plan or implement request starts with `references/workflows/spec-authoring-card.md`."
- [x] The regenerated scaffold snapshot differs by 4 lines in and 4 out, and the scaffold golden snapshot test passes without update mode
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | goal.md records the objective and four phase criteria. |
| Closeout | Complete | T001 through T005 checks returned the expected counts. The captured no-update run has exit=0, 12 tests passed and 0 obsolete-or-written lines (../scratch/build-evidence.md:152). T007 records strict validation. |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and get rechecked against the reviewed spec |
<!-- /ANCHOR:log -->
