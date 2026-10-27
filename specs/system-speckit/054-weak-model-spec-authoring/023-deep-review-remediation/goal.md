---
title: "Goal: Phase 23: deep-review-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep review remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/023-deep-review-remediation"
    last_updated_at: "2026-10-27T07:26:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 23: deep-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every finding of the 2026-10-27 deep review of packet 054 is fixed, or recorded with its reason, with no change to an existing packet's verdict.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | SOL-001 is settled by narrowing phase 010 REQ-001; symlinked `--track` values keep working. |
| D2 | The legacy (pre-v2.3) fence toggle stays as it is; only the token-gated path changes. |
| D3 | Each code fix lands with a test that fails without it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] The nested-fence and `--path` symlink tests fail on the old code and pass on the new
- [ ] `validate.sh specs/system-speckit/054-weak-model-spec-authoring --strict --recursive` prints `RESULT: PASSED` for every folder
- [ ] Every row of this phase's `acceptance-criteria.md` reads Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 020 audit dispositions | Done | `findings.json` holds 46 entries, all `fixed`, each with its evidence |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | - |
<!-- /ANCHOR:log -->
