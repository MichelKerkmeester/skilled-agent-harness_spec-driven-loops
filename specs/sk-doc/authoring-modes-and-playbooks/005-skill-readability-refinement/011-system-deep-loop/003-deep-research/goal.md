---
title: "Goal: deep-research"
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
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/011-system-deep-loop/003-deep-research"
    last_updated_at: "2026-11-04T08:10:38Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: deep-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every in-scope doc of the `.skilled/skills/system-deep-loop/deep-research` mode reads in order, renders as written and follows its sk-doc template, with every claim it made before still present.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The leaf writes only the files in `scratch/scope.txt`, plus a playbook line whose section number has to follow a moved section |
| D2 | Every heading and section number listed in `scratch/inbound-anchors.txt` keeps its text and number |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 -I specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/011-system-deep-loop/003-deep-research/scratch/scope.txt` prints `render_warnings=0 invalid=0`
- [ ] The highest-numbered `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/011-system-deep-loop/003-deep-research/scratch/review-N.md` opens with `VERDICT: PASS`, or `specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/011-system-deep-loop/003-deep-research/scratch/findings.md` holds no line starting `- [P1]` or `- [P2]`
- [ ] `python3 -I specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-links.py specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/011-system-deep-loop/003-deep-research/scratch/scope.txt` prints `broken=0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/011-system-deep-loop/003-deep-research --strict` prints `RESULT: PASSED`
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
| Goal authored | Done | `check-goal.cjs` run at authoring |

### Deviations and findings

| Item | Note |
|------|------|
| Criteria source | The Level 1 children carry no `acceptance-criteria.md`, so the criteria come from each `spec.md` success criteria and the parent phase handoff table |
<!-- /ANCHOR:log -->
