---
title: "Goal: Phase 2: scorer-deem-arms"
description: "Remove every scorer's --deem arm with its tests and docs, so each scorer's default run and --jev arm behave as they did before."
trigger_phrases:
  - "remove scorer deem arm"
  - "scorer deem flag removal"
  - "jev only scorer"
  - "deem arm tests"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-002-scorer-deem-arms"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: scorer-deem-arms

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove every scorer's `--deem` arm with its tests and docs, so each scorer's default run and `--jev` arm behave as they did before.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The scorers are the ones `../001-removal-plan/inventory.md` assigns to 002. A shared Deem helper goes when its last caller does |
| D2 | Each scorer's default output stays the same apart from the Deem fields it printed, which go, and its `--jev` arm is unchanged. `--deem` reaches the scorer's existing unknown-flag path |
| D3 | A test that covers only the Deem arm is removed. A test that covers both arms keeps its Jev half |
| D4 | Workers: Luna 6 max fast (cli-codex) and DeepSeek V4.1 Flash max (cli-pi, Cline then OpenCode Go). The session verifies, runs the suites and makes path-scoped commits. DeepSeek takes the one-arm scorers in batches and Luna takes 023 and 027, which run both arms side by side |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git grep -n -i -P '\bdeem(\b|[-_])'` over the files `../001-removal-plan/inventory.md` assigns to 002 prints only lines that inventory marks keep
- [x] For each scorer in that inventory, the default run's stdout on the same input before and after the removal differs only in removed Deem lines or fields, and `scratch/default-diff.txt` records each scorer's `diff`
- [x] Every suite that covered a removed arm passes with 0 failing, and `implementation-summary.md` lists each removed test by name
- [x] Each scorer run with `--deem` exits non-zero through its unknown-flag path, and `scratch/deem-flag.txt` records the exit status per scorer
- [x] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this folder
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
| Planned | Done | Scoped 2026-10-02 from the operator's request to remove Deem and keep Jev |
| Removal | Done | DeepSeek V4.1 Flash max in six batches and Luna 6 max on 023 and 027, commits `5a3e2a39bc` to `fa3cb972ab` |
| Grep | Done | Criterion 1 grep over the 99 assigned files prints nothing |
| Default output | Done | `scratch/default-diff.txt`: 16 identical, three lose only a Deem planned-calls field, 019 differs only in a timing line |
| `--deem` | Done | `scratch/deem-flag.txt`: 20 of 20 exit 2 |
| Suites | Done | 24 inventory suites 0 fail, the 13 suites the coverage sweep changed 426 of 426 |
| Reviews | Done | Luna on DeepSeek's batches, DeepSeek on Luna's. Six P1 fixed in `13991d53f8` |
| Coverage sweep | Done | All 153 removed tests audited, 32 restored as Jev-only tests in `0cf0eadc93`. DeepSeek's review found one more gap, the goal-lint requalify line, fixed in `0c1ca648e8`. The 14 changed suites pass 446 of 446 |

### Deviations and findings

| Item | Note |
|------|------|
| D2 amended (2026-10-02) | Luna found that 027's default run prints a planned-calls line naming both backends, so a byte-identical default and a removed Deem could not both hold. The operator's "deprecate deem completely" decides: the Deem fields leave the default output, and the diff must show nothing else |
| Comparison method | 017's corpus and 032's scan read the docs this phase edits, so the old and new scorer code run side by side on the same tree, the old copy beside the new one, rather than before and after on a changing tree |
| P1 coverage lost | Fixed in `13991d53f8`: the withheld alignment payload, a stopped arm in both advisor reports, the judge-agreement verdict rules, the `--jev` without `--out` guard and the stop-rater requalify line |
| Coverage sweep | The reviews checked their own commits only. A session audit found more deleted tests that were the only cover of live Jev logic, such as the completion-claim keep and kill verdicts, so all 153 were audited |
| P2 one-item backend loops | Kept: twelve scorers loop over a one-entry `[['jev', jev]]` list. The loops are correct, and collapsing them is a refactor outside a removal |
| P2 unused `backend` parameter | Kept: `decideVerdict` in injection-screen, judge-agreement and stop-rater still takes a `backend` its body no longer reads |
| P2 always-true Jev checks | Kept: `score-alignment-suggestion.ts:1000` keeps `model`, `modelCommit` and `sourceCommit` on its gate type, and judge-agreement keeps two `backend === 'jev'` guards |
| P2 dead constant and comments | Kept: `HEALTH_TIMEOUT_MS` in `score-stop-rater.cjs`, comments that say both arms, and a `F: number|null` return type that is now always a number |
| P2 singleton stub loops in tests | Kept: five test files write their one Jev stub through a loop |
| P2 judge-agreement requalify | Kept: the Jev requalify branch at `judge-agreement.mjs:966` had no test before the removal either |
| P2 Jev exit-4 retry | Kept: the exit-4 retry branch in severity-replay, stop-rater, fanout-pairs, jev-tiebreak and track-narrowing has no Jev test. The deleted exit-4 tests drove Deem's commit-pair path |
| P2 compaction-recall count | Kept: its catalog and playbook pages say twelve cases where the suite has 24. The count did not change here, one test out and one in |
<!-- /ANCHOR:log -->
