---
title: "Goal: Phase 6: convert-plumbing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "convert plumbing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/006-convert-plumbing"
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

- [x] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with a `/doctor:sk-skill` `convert` route marked `mutating: mutates`
- [x] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and prints every suite PASS
- [x] `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 and lists a convert phrase reaching `/doctor:sk-skill`
- [x] A manual `/doctor:sk-skill convert` run on a scratch skill prints `STATUS=CANCELLED` on "no" and `STATUS=OK` on "yes"
- [x] A convert run on a `local-`-prefixed scratch skill prints `REFUSE:` and `STATUS=FAIL`
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
| Phase planned | Done | Spec docs authored 2026-10-30 |
| Route, workflow, presentation and bridge | Done | `route-validate.sh` exit 0, `run-all.sh` 7/7 PASS, `doctor-phrase-reach.cjs` `STATUS=OK phrases=130 bridges=24` |
| Manual run | Done | `scratch/t014-convert-run.md`, then `scratch/t018-alignment-run.md` after the engine gained the plain-skill path |
| Alignment with the engine's current interface | Done | Plan, follow-up yeses, plan rerun with the approved flags, `preserve --snapshot`, the engine's printed undo block, and the derived refusal-code test |

### Deviations and findings

| Item | Note |
|------|------|
| The engine moved during review | It grew a plain-skill path, `--description-trim`, `--allowed-tools`, a `preserve --snapshot` check and a printed undo block. The workflow, presentation and contract test were realigned to it rather than freezing the older interface |
| The refusal list is derived, not written by hand | Two engine changes left a hand-written list quoting wording the converter no longer prints, so the contract test now derives every code from the engine source |
<!-- /ANCHOR:log -->
