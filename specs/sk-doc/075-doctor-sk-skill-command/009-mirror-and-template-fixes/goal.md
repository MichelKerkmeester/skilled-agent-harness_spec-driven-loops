---
title: "Goal: Phase 9: mirror-and-template-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mirror and template fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/009-mirror-and-template-fixes"
    last_updated_at: "2026-10-30T05:21:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-mirror-and-template-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: mirror-and-template-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `/doctor:runtime-mirrors` check the Hermes skill copies CI already checks, and remove the stale router-in-SKILL.md wording from the skill templates.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The route gains `sync-skills-hermes.cjs --check` and `sync-prompts-hermes.cjs --check`, the two Hermes checks CI runs. |
| D2 | An absent `.hermes/` directory gives an n/a row and is never created. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c "sync-skills-hermes.cjs --check"` prints 1 or more for both `.skilled/commands/doctor/_routes.yaml` and `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`
- [ ] `rg -c "sync-prompts-hermes.cjs --check"` prints 1 or more for both `.skilled/commands/doctor/_routes.yaml` and `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` exits 0
- [ ] `rg -n "in-SKILL.md router" .skilled/skills` exits 1
- [ ] `skill-leaf-manifest-config-template.json` parses with `JSON.parse` without error
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
| Phase planned | Pending | Spec docs authored 2026-10-30 |

### Deviations and findings

| Item | Note |
|------|------|
| CI also runs `sync-prompts-hermes.cjs --check` | Seen at `command-tree-parity.yml:122`; brought into scope on 2026-10-30 because the operator keeps nothing deferred |
<!-- /ANCHOR:log -->
