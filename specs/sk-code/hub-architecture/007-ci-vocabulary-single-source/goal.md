---
title: "Goal: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ci vocabulary single source goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/007-ci-vocabulary-single-source"
    last_updated_at: "2026-11-14T17:35:49Z"
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
# Goal: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the three copies of the `sk-code-ci` routing keywords one set, the one in `hub-router.json`, and make the router-sync guard fail when they differ.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | `hub-router.json` is the authority. No keyword in its two CI classes is added, removed or reworded. |
| D2 | The guard's code and its test do not change. The surface is listed under `vocabularyMirrors` and nothing else is built. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -c '"vocabularyMirrors": \["sk-code-frontend", "sk-code-ci"\]' .skilled/skills/sk-code/hub-router.json` prints 1, and `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2` and exits 0.
- [x] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/007-ci-vocabulary-single-source --strict --quiet` prints `RESULT: PASSED`.
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
| Spec, plan, tasks and acceptance criteria authored | Done | Written on 2026-11-14 from audit row `H7` and a set comparison of the three copies |
| Operator answers 2026-11-14 | Done | A new packet with `hub-router.json` as the authority, built on the current branch of worktree 379 |
| Packet closed | Done | Code 4becdb1e35. Six criteria Met. Both CI_WORKFLOW rows hold the 72 keywords of hub-router.json, sk-code-ci is under vocabularyMirrors, hub version 3.12.1.0 and packet version 1.1.16.0 |
| Edge cases | Recorded | A prompt with no CI word selects no intent in the packet router. Each row holds 72 keywords. Removing ci job from the packet row made check 2 exit 1, and it exited 0 after the restore |
| Deviation: the commit gate required seven advisor signals | Recorded | The skill-authoring gate blocked the commit until generate-router-intent-signals.cjs wrote the hub row's seven new multi-word phrases into graph-metadata.json. The scope table gained that file and the route manifest. advisor_validate printed the same counts on both signal lists |
| Deviation: the edits were made by a script, with no DeepSeek dispatch | Recorded | The dispatch instruction was given for the audit packet. Each row is one line derived from the JSON |
| Finding: seven CI phrases now count for the hub in the advisor | Open | strategy matrix and trigger-index rebuild are among them. rebuild the trigger index still picks system-spec-kit first, and its second pick is now sk-code in place of sk-doc. The phrases come from the CI classes, which decision D1 does not edit |

### Deviations and findings

| Item | Note |
|------|------|
| The packet is Level 2 where `recommend-level.sh` printed Level 0 | The scaffold ran at Level 2 before the helper's answer was read. The acceptance criteria are kept because the change touches routing vocabulary |
<!-- /ANCHOR:log -->
