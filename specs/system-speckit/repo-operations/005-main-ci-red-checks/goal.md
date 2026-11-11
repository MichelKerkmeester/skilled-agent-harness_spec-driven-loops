---
title: "Goal: Repair the five checks that fail on main"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "main ci red checks goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/repo-operations/005-main-ci-red-checks"
    last_updated_at: "2026-11-11T07:47:57Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "main-ci-red-checks-2026-11-11"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Repair the five checks that fail on main

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the five workflows that fail on main pass again, each fixed at its cause.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No check is weakened: no test is skipped, deleted or loosened to pass |
| D2 | Work happens in worktree 346 as local commits. Nothing is pushed without the operator's yes |
| D3 | Each workflow's fix is its own commit, so one can be reverted alone |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] On Node 22, `node --test 'scripts/tests/*.test.cjs'` exits 0 in both corpus skills
- [x] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` exits 0
- [x] `ci-hub-vocabulary-source.cjs` prints `drift=0`
- [x] The three failing Spec-Kit test files pass in the CLI vitest project
- [ ] `gh run list --branch main` shows the five workflows as `success` on the commit with the fixes
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
| Corpus workflows | Done | `6bb42a9f5a`, 88 and 21 tests pass on Node v22.23.4 |
| sk-doc baselines | Done | `c807a36cab`, `all sk-doc script tests passed` |
| Routing drift | Done | `f090583b7d`, `checked=7 hub(s), drift=0` |
| Spec-Kit tests | Done | `72a2a0b3f4`, `Tests 18 passed (18)` |
| CI confirmation on main | Pending | Waits on the push |

### Deviations and findings

| Item | Note |
|------|------|
| The staleness checker had two Linux-only causes | Only Bash 3.2 is installed here. CI on `68359fb3b6` confirmed the array length fix and exposed three bare `(( ))` counters, fixed in `f15ba37e94` |
| Two CLI tests timed out in the full local run | They pass alone and did not fail in CI, so they are outside this packet |
<!-- /ANCHOR:log -->
