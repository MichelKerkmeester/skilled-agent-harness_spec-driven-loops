---
title: "Goal: Phase 1: layout-tooling-and-pilot"
description: "The rewrite driver, briefs and fact lock turn an old changelog into the v4.1.0.0 layout without losing a fact, proven on a pilot."
trigger_phrases:
  - "layout tooling and pilot goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/001-layout-tooling-and-pilot"
    last_updated_at: "2026-11-17T18:13:00Z"
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
# Goal: Phase 1: layout-tooling-and-pilot

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The rewrite driver, briefs and fact lock turn an old changelog into the v4.1.0.0 layout without losing a fact, proven on a pilot.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The writer is Hy4 Flash Free at high thinking through cli-opencode, with Devin's free `glm-5-2` as the only fallback. No paid model writes |
| D2 | A draft lands only after the fact lock, the shape check and the voice scan pass. Anything else is restored from the saved original |
| D3 | The pilot covers every list, so each family's entry shapes are tried before its phase runs |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `../scratch/lists/` holds 12 lists whose line counts add up to 1,576
- [ ] `rewrite-driver.cjs --dry-run` exits 0 and prints the writer as `opencode-go/hy4-flash-free#high`
- [ ] The 20 pilot files in `../scratch/lists/pilot.txt` record `pass` in the driver state
- [ ] `check_changelog_shape.py` fails no rule on a pilot rewrite that it did not fail on the original
- [ ] `validate.sh --strict` on `001-layout-tooling-and-pilot` prints `RESULT: PASSED`
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

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
