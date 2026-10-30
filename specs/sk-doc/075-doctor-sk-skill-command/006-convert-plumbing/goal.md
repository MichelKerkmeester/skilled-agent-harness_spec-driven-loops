---
title: "Goal: Phase 6: convert-plumbing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "convert plumbing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/006-convert-plumbing"
    last_updated_at: "2026-10-30T05:21:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-convert-plumbing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: convert-plumbing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `/doctor:sk-skill convert` a doctor route that prints a conversion plan, writes the skill only after an explicit yes, and is reachable through the advisor.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The workflow YAML follows the `doctor-ci-scaffold.yaml` shape: plan, one approval prompt, write, re-read, undo, with statuses `OK`, `CANCELLED` and `FAIL`. |
| D2 | Any answer other than yes counts as no and writes nothing. |
| D3 | Generated files (bridges, command mirrors) change only through their generator or sync script. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with a `/doctor:sk-skill` `convert` route marked `mutating: mutates`
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and prints every suite PASS
- [ ] `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 and lists a convert phrase reaching `/doctor:sk-skill`
- [ ] A manual `/doctor:sk-skill convert` run on a scratch skill prints `STATUS=CANCELLED` on "no" and `STATUS=OK` on "yes"
- [ ] A convert run on a `local-`-prefixed scratch skill prints `REFUSE:` and `STATUS=FAIL`
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
| None yet | No work has started |
<!-- /ANCHOR:log -->
