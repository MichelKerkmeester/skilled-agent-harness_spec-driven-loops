---
title: "Goal: Phase 7: system-spec-kit-changelogs"
description: "Every system-spec-kit changelog reads in the v4.1.0.0 layout and records exactly the facts it recorded before."
trigger_phrases:
  - "system spec kit changelogs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/007-system-spec-kit-changelogs"
    last_updated_at: "2026-11-17T18:13:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: system-spec-kit-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every system-spec-kit changelog reads in the v4.1.0.0 layout and records exactly the facts it recorded before.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Hy4 Flash Free at high thinking through cli-opencode writes whenever it is available. When it is limited or fails, GLM 5.3 Flash at high on the opencode-go provider writes instead. A free model from another family checks the facts |
| D2 | A draft lands only after the fact lock, the shape check and the voice scan pass. Anything else is restored from the saved original |
| D3 | No fact or section the original did not record is added |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `wc -l < ../scratch/lists/007.txt` prints 169, and the driver state records `pass` or `unchanged` for every listed file
- [x] `wave-verify.cjs ../scratch/lists/007.txt` prints 0 failures for the files on disk
- [x] The fact lock reports 0 missing code spans, numbers or spec-folder lines across the listed files
- [x] `hvr_scan.py` reports 0 hard blockers on every listed file
- [x] `validate.sh --strict` on `007-system-spec-kit-changelogs` prints `RESULT: PASSED`
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
| Goal authored | Done | `check-goal.cjs` on this packet |
| Rewrite | Done | `{"listed":169,"pass":168,"unchanged":1,"restored":0,"missing":0,"problems":0,"factMisses":0,"failures":0}` |
| Voice and layout | Done | 0 hard blockers. `SUMMARY files=169 pass=169 fail=0` |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
