---
title: "Goal: Phase 14: review-wording-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review wording fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/014-review-wording-fixes"
    last_updated_at: "2026-11-14T06:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied four verifier corrections to the plan"
    next_safe_action: "Build the phase from tasks.md in two commits, the first made in T019"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/commands/speckit/handoff.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-review-wording-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: review-wording-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The session-relaunch README, three comment sites in three code files and the handoff command document say what the relaunch code does, and the summary of phase 10 names the session id the ended-goal mark depends on.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Wording only. No line that runs changes. In the three code files every changed line is a comment line. |
| D2 | A comment or a document has no test that can fail first. Parent D1 is met by a search for each old phrase, a comment-only check of the first commit of this phase and the suites at the baseline count. |
| D3 | The Stop comment and the test note at `tests/claude-adapters.test.cjs:959` change only after five existing tests show that the path stamps the record and that a prompt withdraws a stamped record. The note at `:708` on the background-task path stays. |
| D4 | A record with an empty `handoff` stays readable, as phase 6 decided. Only the comment that named a writer of it changes. |
| D5 | The handoff command document is edited on a tree that holds `main`. Merging `main` into this branch needs the operator, per parent D4. |
| D6 | No changed comment names a packet, phase, task or finding number. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -n "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled/hooks/session-relaunch` prints one line, which starts with `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:708:`. That note is on the background-task path, where the next Stop does retry, and it stays. Result: observed 2026-11-14, exit 0.
- [x] `scratch/withdraw-tests.txt` shows `tests 5`, `pass 5` and `fail 0` for the five existing tests, run before the Stop comment changed. Result: observed 2026-11-14, exit 0.
- [x] `git merge-base --is-ancestor main HEAD` exits 0 and `rg -c 'goal_ended' .skilled/commands/speckit/handoff.md` prints 1. Result: observed 2026-11-14, exit 0 and 1.
- [x] `rg -c 'matched on the session id' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry/implementation-summary.md` prints 1. Result: observed 2026-11-14, 1.
- [ ] In the first of this phase's two commits, every changed line of `lib/relaunch-core.cjs`, `claude/stop-arm.mjs` and `tests/claude-adapters.test.cjs` under `.skilled/hooks/session-relaunch` starts with `//` after its indent. Waits on `FIX`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`. Result: observed 2026-11-14, tests 1550, pass 1550, fail 0, exit 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/014-review-wording-fixes --strict` prints `RESULT: PASSED`. Result: observed 2026-11-14, exit 0.
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
| Review findings | Done | 2026-11-14. Review B, P1: the README sentence at line 309 went false with phase 11. Reviews A and B, P2: the comment at `relaunch-core.cjs:1299` names a writer that does not exist. Review B, P2: the comment at `stop-arm.mjs:132` and a test note are stale since phase 5. Review A, P2: `handoff.md` does not name `goal_ended`. Review A, P2: the ended-goal mark depends on a session id that can change |
| Orchestrator checks | Done | 2026-11-14: the core comment and the README sentence are confirmed against the code. The Stop comment is confirmed as text only, and whether a prompt withdraws the record first was not run |
| Code read | Done | 2026-11-14 at `be1aebb9f3`. The output is quoted in `spec.md` Measured Behavior. A third copy of the Stop phrase was found at `tests/claude-adapters.test.cjs:708`, which neither review named |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is still the scaffold and is written after the build |
| Build | Done except the two commits | Tasks T001 to T018 ran and each result is in `tasks.md`. T019 and T014 are the orchestrator's, which makes the two commits |
| Merge of `main` | Done | 2026-11-14: the operator answered "Merge before building (Recommended)". `main` is in this branch as merge commit `be56fabc7b`, and `git merge-base --is-ancestor main HEAD` exits 0 there. T011 finds nothing left to merge unless `main` has moved since, and T012 and T017 no longer wait |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Comments in a documents child | Three of the six texts are comments in code files. They are grouped with the documents because they change no behavior. The operator can move them if that reading of parent D1 is wrong |
| Trial merge not run | The planner did not run a trial merge. `git diff --stat 4f57ea6ac8..main` over the relaunch paths lists `handoff.md`, `lib/nudge.cjs` and `tests/nudge.test.cjs`, and this branch changed none of the three, so no conflict is expected. Task T005 runs it |
| Hardening rejected | Review B suggested reading an empty `handoff` as absent. Phase 6 decision D2 keeps it readable and no writer produces it, so only the comment changes |
| Session id not checked | Whether `/clear` changes a Claude session id is not confirmed. The limit is written down and the code is left alone until the operator compares `CLAUDE_CODE_SESSION_ID` before and after `/clear` |
| Note at line 708 kept | 2026-11-14: a verifier found that the note at `tests/claude-adapters.test.cjs:708` is no copy of the stale comment. `git log -L708,708` names `5c0b9372d9` of 2026-10-24, and the note sits in the background-task test, where the next Stop does retry. `git log -L959,959` names the phase 5 commit `eaf24f999e` for the stale note. Line 708 was dropped from T009 and the file table, and SC-001, T013, AC-003 and criterion 1 now expect it as the one remaining line |
| Two commits | 2026-11-14: the tree could not be clean for T011 with scratch files and open edits in it. Task T019 now commits the wording fixes and this phase's packet documents first. The `handoff.md` sentence and a rebuilt trigger index form the second commit. The trigger index was added to Files to Change as a generated file |
| Objective count | The verifier counted four comment sites in three files while line 708 was still in scope. With line 708 kept as it is, three sites change: `relaunch-core.cjs:1299`, `stop-arm.mjs:132` and `claude-adapters.test.cjs:959`. The objective says three |
| Merge overtook the plan | 2026-11-14: a verifier found that merge `be56fabc7b` overtook two tasks. T005 is dropped, because a trial merge before the real merge can no longer happen, and no later row or task runs it. T011 is marked done by that merge. REQ-007 and AC-007 now check `git merge-base --is-ancestor main HEAD`. T019 gained a precondition: the documents of children 004 to 013 are committed first, so the summary of phase 10 is tracked before T010. T016 expects one baseline count, 1550 |
| Rebuild side effect | 2026-11-14: `generate-trigger-index.mjs` without `--check` also rewrote `retrieval/fixtures/corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. Those three files are outside this packet's scope, so they were restored to their committed content and only `runtime/data/trigger-index.json` is changed |
<!-- /ANCHOR:log -->
