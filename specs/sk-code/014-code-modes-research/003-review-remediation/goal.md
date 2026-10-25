---
title: "Goal: Phase 3: review-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/003-review-remediation"
    last_updated_at: "2026-10-25T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Applied the deep review findings and the quality floor split"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Apply the confirmed findings of the packet's deep review to the research closure documents and to the sk-code-quality and sk-code-review folders, without touching the hub routing files.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Edits stay inside this packet, `.skilled/skills/sk-code/sk-code-quality/` and `.skilled/skills/sk-code/sk-code-review/`. No hub routing file and no `sk-code-ci/` file changes. |
| D2 | S-P2-13 and S-P2-14 are not applied. The review profile is not built, per the operator's ruling of 2026-10-25. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0.
- [x] `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` exits 0.
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type playbook .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` prints `VALID`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research --recursive --strict` prints `RESULT: PASSED`.
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
| Findings applied | Done | S-P1-01, S-P1-02, S-P2-01 to S-P2-12, the Extension Floors item and the floor split |
| Checks | Done | Canary exit 0, canary suite exit 0, quality playbook root `VALID`, recursive strict validation recorded in the parent goal log |

### Deviations and findings

| Item | Note |
|------|------|
| Quality floor | The brief first held the floor for an operator decision. The operator then chose the split on 2026-10-25, recorded as ADR-001. |
| Review profile | The operator ruled for no review profile on 2026-10-25, recorded as ADR-002. Review ranks 1, 3 and 5 close as decided. |
<!-- /ANCHOR:log -->
