---
title: "Goal: Phase 6: goal-criteria-lint"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal criteria lint goal"
  - "lint-goal-criteria completion criteria"
  - "goal criteria rubric labels"
  - "r20 stop line"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint"
    last_updated_at: "2026-09-27T05:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Operator adopts the rubric, then write the lint"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which rubric does the operator adopt for rules 4 and 5"
    answered_questions: []
---
# Goal: Phase 6: goal-criteria-lint

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `sk-create-goal` rules 4 and 5 their first machine check, a zero-call lexical lint of goal criteria beside `check-goal.cjs` that is scored against about 100 operator labels under a rubric the operator adopts first, with a Jev arm built only past the stop rule.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lint is a separate advisory script, `lint-goal-criteria.cjs`, that always exits 0. `check-goal.cjs` is never edited, its `CHECKS` list keeps four names and its exit codes 0, 1 and 2 are unchanged |
| D2 | The operator adopts the rubric before any label is written. Every label row carries that rubric's id, and the scorer refuses a labels file with mixed rubrics. Until the operator chooses, `mimo-02-strict-v1` is the working default, not a decision |
| D3 | The first slice makes zero Jev calls and needs no key. A Jev arm exists only when the labeled violation rate is at least 0.05, the lint's F1 leaves room for a 0.2 gain and 002 has a latency record. It then runs behind `--jev` with parent D5's gate and one `--provider` for every check and call |
| D4 | The population skips `z_archive` and every `scratch` path, and the scratch count prints apart |
| D5 | Label rows store `id` and `text_sha12`, never criterion text |
| D6 | `create-goal-auto.yaml` gains its one advisory line only with per-rule precision of at least 0.8 and sk-doc's approval |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all` prints violation counts for rule 4 and rule 5 and a `scratch_excluded=` count, and exits 0, while a stub `jev` first on PATH logs zero invocations
- [ ] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes, including seven `lint-goal-criteria.test.cjs` cases: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded
- [ ] `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` exits 0
- [ ] `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` holds 100 or more rows, each with `id`, `text_sha12`, `rubric`, `rule4_ok`, `rule5_ok` and `labeler`, and every row has the same `rubric` value
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` prints precision, recall and F1 for rule 4 and rule 5, a labeled violation rate with a Wilson 95% interval and a `stale=` count, and prints `r20 jev arm not built: labeled_violation_rate<0.05` if that rate is below 0.05
- [ ] `grep -n API_KEY` on `lint-goal-criteria.cjs` and `score-goal-lint.cjs` returns no match
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and this goal authored from `004-deep-research-expansion/research/research.md` R20 and its proposed phase 006 |
| Rubric | Pending | Open question 34 is the operator's. Candidates A to D and the working default are in `spec.md` section 4 |
| Build | Pending | Nothing is built. The phase is Planned |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title | The scaffold titled every document "Phase 2". This phase is Phase 6 of 6, as this title and the `spec.md` metadata now say |
| Phase slug | The synthesis renamed the phase from `006-goal-criteria-jev-lint` to `006-goal-criteria-lint`, because the first slice makes no Jev call |
| Test file location | The research places the test beside `check-goal.cjs`. It goes in `scripts/tests/`, where the existing `node --test` command already looks |
| Scorer input | swe-04's design passes the lint's JSON with `--lint`. That flag stays optional, and without it the scorer runs the lint in process over the active tree, so the criterion above needs only `--labels` |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from `spec.md` REQ-001 to REQ-010 and its proof plan |
<!-- /ANCHOR:log -->
