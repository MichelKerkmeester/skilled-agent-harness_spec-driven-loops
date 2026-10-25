---
title: "Goal: Manual claim command with live settings"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "manual claim live settings goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/003-manual-claim-live-settings"
    last_updated_at: "2026-10-25T13:42:28Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-manual-claim-live-settings"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Manual claim command with live settings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The manual claim command the wrapper prints starts the receiver on the sender's live model and effort, not the first launch's.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The manual template is built from the consumed record's live model and effort when they pass the runtime's checks, and from the settings the current hop launched on otherwise |
| D2 | The live values follow the same effort rule phase 001 set for relaunches |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/003-manual-claim-live-settings --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A wrapper test with a record carrying a live model and effort prints a manual command holding both and not the launch model, and fails on the code before the change
- [ ] A Cursor wrapper test with a model from the Cursor live reader prints that model in the manual command
- [ ] A wrapper test with no live values prints the same manual command it printed before the change
- [ ] A wrapper test whose first hop switched from Sonnet to Opus and whose later decline record holds no live values prints a manual command holding Opus, not Sonnet, and fails on the code before the change
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/003-manual-claim-live-settings.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
