---
title: "Goal: Phase 11: readme-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "readme guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/011-readme-guards"
    last_updated_at: "2026-11-18T12:04:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "3984aaec-9181-4f22-ae90-fe5d131a5589"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: readme-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** No template asks for Mermaid, the validator keeps it out of READMEs, and every README this program touched passes both README checkers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A correct path or count the checkout cannot prove gets a `readme-check` marker with a reason. Prose the checker misreads is reworded instead. |
| D2 | The Mermaid check keys on the file name `README.md` and skips a fence nested in a longer one. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] Both README checkers print `fail=0` on the 19 files, and `rg -n -i mermaid` over the sk-doc template assets prints only lines that rule it out
- [x] `test_structure_validation.py` passes with the two new tests, and the check flags 0 tracked READMEs
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED` and the phase commit is on origin/main
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
| Templates and checklist | Done | No Mermaid left in the sk-create-skill assets, checklist `hard blockers: 0` |
| Mermaid check | Done | 1 failed then 14 passed, 0 hits over 1,303 tracked READMEs |
| README fixes | Done | Both checkers `fail=0` on the 19, 18 reviewer passes and 1 confirmed finding fixed |

### Deviations and findings

| Item | Note |
|------|------|
| The program goal kept the validator out of scope | Recorded as a fourth amendment in the parent goal and as Q014 in the parent decision record |
<!-- /ANCHOR:log -->
