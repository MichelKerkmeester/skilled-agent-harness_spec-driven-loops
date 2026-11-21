---
title: "Goal: Phase 15: alignment-command overlay targets"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "alignment command overlay targets goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/015-alignment-command-overlay-targets"
    last_updated_at: "2026-11-20T22:06:36Z"
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
# Goal: Phase 15: alignment-command overlay targets

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Either alignment command, run in a vendored project, can audit and fix that project's overlay folder, which it finds through `.skilled-overlays.json`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One `overlay-layout` topic serves both the overlay folder's READMEs and the engine docs, because no earlier phase planned a separate topic. |
| D2 | Both commands are gitignored private files, so the change lands in the private copy and is recorded here, not committed. |
| D3 | Barter's vendored copy of `local-skilled-alignment` is the ai-speckit session's to mirror; this phase lists the exact change. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/assets/local-skilled-alignment/tests/*.test.cjs` exits 0 with more than 68 tests.
- [x] `node --test .skilled/commands/assets/local-doc-alignment/tests/*.test.cjs` exits 0.
- [x] `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK` and exits 0.
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
| Private asset backup | Done | `/tmp/ovl-gates/private-backup/` |
| Topic and target | Done | lsa 76 of 76, ldoc 10 of 10, route-validate OK, in the worktree and in the Skilled checkout |
| Review | Done | Round 1 FAIL (linked folder), round 2 FAIL (case-variant setting), round 3 PASS |
| Landing | Done | `diff -r` of the worktree copies against the Skilled checkout prints nothing |

### Deviations and findings

| Item | Note |
|------|------|
| Not committed | Both commands are gitignored private files, so the change landed by copy into the Skilled checkout, not by commit |
<!-- /ANCHOR:log -->
