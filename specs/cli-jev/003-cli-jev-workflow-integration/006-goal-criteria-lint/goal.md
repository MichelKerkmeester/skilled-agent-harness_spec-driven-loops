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
    last_updated_at: "2026-09-28T09:19:12Z"
    last_updated_by: "opus-5.5-xhigh-leaf"
    recent_action: "Amended for wave 3: label gate, build route, skill docs, moved citations"
    next_safe_action: "Build to the label gate in parent D3 order, then hand rubric and labels to the operator"
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

**Objective:** Give `sk-create-goal` rules 4 and 5 their first machine check, a zero-call lexical lint of goal criteria beside `check-goal.cjs` with a tested scorer and a drawn sample of about 100 criterion lines, built up to the label gate where the operator adopts a rubric and labels, with a model arm on Deem or Jev built only past the stop rule.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lint is a separate advisory script, `lint-goal-criteria.cjs`, that always exits 0. `check-goal.cjs` is never edited, its `CHECKS` list keeps its five names and its exit codes 0, 1 and 2 are unchanged |
| D2 | The operator adopts the rubric before any label is written. Every label row carries that rubric's id, and the scorer refuses a labels file with mixed rubrics. Until the operator chooses, `mimo-02-strict-v1` is the working default, not a decision |
| D3 | The first slice makes zero model calls and needs no key or server, and the lint takes no classifier. A model arm, Deem preferred, exists only when the labeled violation rate is at least 0.05 and the lint's F1 leaves room for a 0.2 gain. A Jev arm also needs 002's latency record. Each backend runs behind its own switch and parent D1 check: `--deem` (proposed) through `cli-deem health` (proposed), never starting the server, and `--jev` with one `--provider` for every check and call. Below 0.05 the scorer prints `r20 model arm not built: labeled_violation_rate<0.05` (proposed) for both backends |
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

- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all` prints violation counts for rule 4 and rule 5 and a `scratch_excluded=` count, and exits 0, while stub `jev` and `cli-deem` binaries first on PATH log zero invocations
- [ ] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes, including seven `lint-goal-criteria.test.cjs` cases: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded
- [ ] `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` exits 0
- [ ] `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` holds 100 or more rows, each with `id` and `text_sha12` and no criterion text, and `rubric`, `rule4_ok`, `rule5_ok` and `labeler` are null on every row
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` exits 0 and prints `unlabeled=` equal to that file's row count and no rate, and `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` passes cases for precision, recall and F1 on rule 4 and rule 5, a Wilson 95% interval, a `stale=` count and `r20 model arm not built: labeled_violation_rate<0.05` for a rate below 0.05
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
| Rubric | At the gate | Open question 34 is the operator's, at the label gate (parent D4). The build runs under working default A. Candidates A to D are in `spec.md` section 4 |
| Build | Pending | Nothing is built. The phase is Planned, released by parent D3, and builds seventh in the order 008, 016, 002, 017, 003, 005, 006, 009 |
| Wave 3 amendment | Done | 2026-09-28: amended for the parent's wave 3 directive (D1, D4, D5, D6) and for checker citations the syncs with main moved. Rows below. The phase stays Planned |
| Two-backend amendment | Done | 2026-09-27: amended for two backends per 007 `research.md` section 14 (`### 006-goal-criteria-lint (Planned, amended)`), R20 and condition C12, and parent goal D1 and D5. The parent's D5 and its fourth criterion direct these amendments, so the operator approval section 14 asks for is already given. The phase stays Planned and keeps its folder name |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title | The scaffold titled every document "Phase 2". This phase is Phase 6 of 6, as this title and the `spec.md` metadata now say |
| Phase slug | The synthesis renamed the phase from `006-goal-criteria-jev-lint` to `006-goal-criteria-lint`, because the first slice makes no Jev call |
| Test file location | The research places the test beside `check-goal.cjs`. It goes in `scripts/tests/`, where the existing `node --test` command already looks |
| Scorer input | swe-04's design passes the lint's JSON with `--lint`. That flag stays optional, and without it the scorer runs the lint in process over the active tree, so the criterion above needs only `--labels` |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from `spec.md` REQ-001 to REQ-010 and its proof plan |
| Objective and D3 amended | The later arm now runs on Deem or Jev, Deem preferred, and the lint takes no classifier (007 `research.md` section 12 R20, C12). The switch `--deem` and the client `cli-deem` do not exist yet and are marked proposed. Source: 007 `research.md` section 14 and parent goal D1 and D5 |
| Stop line renamed | `r20 jev arm not built` became `r20 model arm not built` (proposed) in D3, criterion 5 and the trigger phrases of `spec.md`, because the stop is the same for both backends (007 `research.md` section 14, rows `:9`, `:149`, `:191`) |
| Criterion 1 amended | The zero-call proof now covers stub `jev` and `cli-deem` binaries (007 `research.md` section 14, REQ-006 and SC-002 rows) |
| Parent decision id | The key gate this phase cited as parent D5 is now parent D1, since the round-3 parent goal renumbered its decisions. `spec.md`, `plan.md`, `tasks.md` and D3 above now cite D1 |
| Deem arm contract by reference | `spec.md` REQ-012 gains the Deem gate half from section 14's shared text. REQ-013 carries the per-backend call counts and keep rule, and points at the shared gate contract in 007 `research.md` section 12 for Deem exit handling, records, requalification and the payload notice. No requirement id was added |
| Label gate (source: parent D4) | 2026-09-28. The phase stops where a human labels, and no model writes a label. The objective now ends the build at the label gate. Criterion 4 required 100 labeled rows with one `rubric`, which only the operator can write, so it now requires 100 drawn rows with every label field null. Criterion 5 required per-rule numbers from real labels, so it now requires `unlabeled=` and no rate on the drawn file, with the per-rule numbers, the interval, `stale=` and the stop line proven on synthetic fixture labels in a new `score-goal-lint.test.cjs` (proposed). The other five criteria are unchanged. In `spec.md`: handoff, scope, dependencies, deliverables, REQ-001 and REQ-008 to REQ-011, SC-001, proof plan step 4, the stop rule and the kill criterion now place the rubric, the labels, the numbers, the arm and the workflow line after the gate. In `tasks.md`: T001, T012, T014, T015, T016 and T022 are marked after the gate, and T026 and T028 are new. `plan.md`'s ready check no longer waits on a rubric |
| Build route (source: parent D5) | 2026-09-28. `spec.md` Phase Context and `plan.md` Technical Context now name the build route: a fresh Opus 5.5 xhigh build orchestrator, single-change briefs, CLI executors by Bash only (Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh`, Cursor `grok-4.7-xhigh-fast`), then the orchestrator session verifying, getting a cross-family review of the code and committing. No builder, reviewer or release wording contradicted it before |
| Skill docs (source: parent D6) | 2026-09-28. The file list gains sk-create-goal's `SKILL.md`, `README.md` and `scripts/README.md`, a changelog entry, a playbook scenario and an sk-doc hub catalog entry, because the phase adds scripts to that skill and listed none of its docs. sk-create-goal ships no catalog, so the catalog entry lands in the hub's `document-validation` category. The out-of-scope line that deferred the `scripts/README.md` listing is gone, since D6 outranks it. Code follows sk-code's OpenCode route. T027 and T029 are new |
| Two backends (source: parent D1) | 2026-09-28. Confirmed, no change. REQ-012 gates Jev on `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0, and Deem on `cli-deem health` within 2,000 ms. With neither switch set, or with every gate failing, the output is byte-identical to the default run and no binary is spawned, and SC-002 says a machine with no key and no server sees no call |
| Stale premises (2026-09-28) | The citations matched `check-goal.cjs` at `00480a8d5c`, and the syncs with main since then moved it. Corrected in place: `:44-49` to `:46-52`, `:13-18` to `:13-19`, `:135-144` to `:140-149`, `:162-201` to `:167-206`, `:207-212` to `:212-217`, `:193-199` to `:198-204`, `:417-441` to `:440-464`, `:659-675` to `:695-716`, `:681-689` to `:722-731` and `create-goal-auto.yaml:220-221` to `:228-229`. The parser and walker spans are byte-identical after the move. The checker now has five checks, so D1 and `spec.md` say five, not four. The scratch count moved from 14 files to 30. The new `SKDOC_SKIP_VALIDATION` switch is a risk row and an open question. `SKILL.md:121-122` and `goal-set-string-playbook.md:55-57` still hold |
<!-- /ANCHOR:log -->
