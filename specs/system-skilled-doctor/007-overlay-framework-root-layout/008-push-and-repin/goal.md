---
title: "Goal: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "push and repin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin"
    last_updated_at: "2026-11-20T16:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-push-and-repin"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Skilled `origin/main` carries every overlay engine fix on a merged main whose gates pass, and Barter's vendored tree is re-pinned onto the commit named on this phase's Target Skilled commit line with every Barter gate green.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `origin/main` comes into local main by a merge commit, never a rebase, and main is pushed without force or `--no-verify`. |
| D2 | A merge that conflicts, or touches a file another session has dirty, stops the push and is reported, not resolved by guesswork. |
| D3 | The re-pin targets the pushed main HEAD recorded on the Target Skilled commit line, and does not start while that line reads `<C>`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In Skilled, `git rev-parse origin/main` equals `git rev-parse main` after the push, and `git merge-base --is-ancestor <C> origin/main` exits 0.
- [ ] On the merged main, the engine suite, the guard suite and the contract test print `fail 0` with exit 0, and `route-validate` exits 0.
- [ ] In ai-speckit, `node -p "require('./overlays/overlay-manifest.json').pin.commit"` prints the id on the Target Skilled commit line.
- [ ] In ai-speckit, `status --audit` prints `RESULT: PASSED` with `offLayout=[]`, both checks print `RESULT: PASSED` and `bash tests/run-all.sh` exits 0.
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this phase and for the parent with `--recursive`.
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
| Baseline gates on local main | Done | engine 262/262, guard 20/20, contract 9/9, each exit 0; `route-validate` exit 0, 32 routes |
| Merge with origin and push | Pending | |
| Re-pin in ai-speckit | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
