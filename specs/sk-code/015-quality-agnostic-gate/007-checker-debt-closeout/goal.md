---
title: "Goal: Phase 7: checker-debt-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "checker debt closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/007-checker-debt-closeout"
    last_updated_at: "2026-10-26T06:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive, the decisions and seven completion criteria"
    next_safe_action: "Land the phase on main; every completion criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: checker-debt-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every checker limitation phase 001 left, so the ceiling report and the checker read comment text one way, every bare Python string statement is checked, the whole tree reports zero findings and the live CI failure run is on record.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The ceiling report reads language, family and comment text only through the checker's functions, loaded from the checker file (ADR-001). |
| D2 | Template literals and shell heredoc bodies are strings in that one extraction, for both tools (ADR-002). |
| D3 | Every bare string statement is comment text, and an f-string is data in every position (ADR-004). |
| D4 | Live comments are rewritten to their durable reason. Frozen evidence keeps its text and gains a per-line `hygiene-ok`, and no path-wide exclusion is added (ADR-005). |
| D5 | Versions are pre-assigned: the hub moves to 3.5.0.0 and sk-code-quality to 1.9.0.0. The coordinator re-picks them at landing if phases 003 and 004 land in another order. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The whole tree is clean: `git ls-files -z | xargs -0 python3 -B .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh -- 2>&1 | wc -l` prints `0`.
- [ ] The ceiling report holds no scanner of its own: `rg -c 'def (find_unquoted_comment|comment_text|family_reader)' .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` prints nothing and exits 1.
- [ ] Both comment suites pass: `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed`, and `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` prints `All ceiling report test cases passed`.
- [ ] No touched packet validates worse: the join of `evidence/validate-before.tsv` and `evidence/validate-after.tsv` in T022 prints `worse=0`.
- [ ] The live CI run is recorded: `rg -c 'actions/runs/40276844110' specs/sk-code/015-quality-agnostic-gate/007-checker-debt-closeout/tasks.md` prints a number of 1 or more.
- [ ] Phase 001 leaves nothing deferred: `sed -n '/ANCHOR:limitations/,/\/ANCHOR:limitations/p' specs/sk-code/015-quality-agnostic-gate/001-honest-checker/implementation-summary.md | rg -c '007-checker-debt-closeout'` prints `4`.
- [ ] The versions are released: `rg -n '^version: 1\.9\.0\.0$' .skilled/skills/sk-code/sk-code-quality/SKILL.md` and `rg -n '^version: 3\.5\.0\.0$' .skilled/skills/sk-code/SKILL.md` each print one line.

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
| Setup (T001 to T004) | Done | T001 to T004 recorded the suite, tree and validator baselines in `tasks.md` |
| One extraction for both tools (T005 to T011) | Done | T005 to T011, with the missing-checker exit 2 and the five ceiling string cases |
| Bare string statements (T012 to T015) | Done | T012 to T015, and T015 ran the new cases against the base checker as a negative control |
| Clear the tree (T016 to T023) | Done | T016 to T023 took the tree from 63 findings in 41 files to 0, on a 3-line delta |
| Live CI record (T024) | Done | Run `40276844110`, job conclusion `failure`, annotation on `ci-hygiene-proof.sh` line 2, confirmed with `gh run view` on 2026-10-26 |
| Phase 001 limitations, docs and versions (T025 to T030) | Pending conductor | T025 to T029 are done. T030, the packet changelog, waits on the conductor |
| Verification (T031 to T036) | Pending conductor | T031 to T034 passed. T035, the strict validator, and T036, the scratch cleanup, wait on the conductor |

### Deviations and findings

| Item | Note |
|------|------|
| The template literal and heredoc cases need a checker change | With one extraction the report lists what the checker reads, and the checker read both probe strings as comment text, so ADR-002 changes the checker as well as the report |
| The parent goal has no binding row for this phase | The parent `goal.md` is outside this phase's authoring scope. The coordinator adds the row with `/create:goal` phase-add, and its six-phase completion count moves to seven |
| `006-measurement/spec.md` still reads `6 of 6` | It does not yet name this phase as a dependency. That file is outside this phase's scope |
<!-- /ANCHOR:log -->
