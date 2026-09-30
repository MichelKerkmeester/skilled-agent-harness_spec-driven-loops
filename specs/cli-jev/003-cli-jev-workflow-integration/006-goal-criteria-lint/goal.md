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
    last_updated_at: "2026-09-28T23:15:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: 7 of 7 criteria ticked, build commit 2139eb8c0d"
    next_safe_action: "Orchestrator commits the phase docs. The operator adopts a rubric and labels the 100 drawn rows"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
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
| D3 | The first slice makes zero model calls and needs no key or server, and the lint takes no classifier. A model arm, Jev first and then Deem (operator, 2026-09-29), exists only when the labeled violation rate is at least 0.05 and the lint's F1 leaves room for a 0.2 gain. A Jev arm also needs 002's latency record. Each backend runs behind its own switch and parent D1 check: `--deem` (proposed) through `cli-deem health` (proposed), never starting the server, and `--jev` with one `--provider` for every check and call. Below 0.05 the scorer prints `r20 model arm not built: labeled_violation_rate<0.05` (proposed) for both backends |
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

- [x] `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all` prints violation counts for rule 4 and rule 5 and a `scratch_excluded=` count, and exits 0, while stub `jev` and `cli-deem` binaries first on PATH log zero invocations
- [x] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes, including seven `lint-goal-criteria.test.cjs` cases: rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, a goal with no criteria and a scratch path excluded
- [x] `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` exits 0
- [x] `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` holds 100 or more rows, each with `id` and `text_sha12` and no criterion text, and `rubric`, `rule4_ok`, `rule5_ok` and `labeler` are null on every row
- [x] `node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` exits 0 and prints `unlabeled=` equal to that file's row count and no rate, and `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` passes cases for precision, recall and F1 on rule 4 and rule 5, a Wilson 95% interval, a `stale=` count and `r20 model arm not built: labeled_violation_rate<0.05` for a rate below 0.05
- [x] `grep -n API_KEY` on `lint-goal-criteria.cjs` and `score-goal-lint.cjs` returns no match
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Build | Done | Released by the operator on 2026-09-28 (parent `goal.md` D3) and built from `scratch/w3-build/briefs/`: 17 single-change briefs, Devin DeepSeek on 5 and Pi MiMo on 12, each under 90 lines, none failed or re-dispatched. Committed as `2139eb8c0d`. Source: build record sections 3 and 4, session record |
| Wave 3 amendment | Done | 2026-09-28: amended for the parent's wave 3 directive (D1, D4, D5, D6) and for checker citations the syncs with main moved. Rows below. The phase stays Planned |
| Two-backend amendment | Done | 2026-09-27: amended for two backends per 007 `research.md` section 14 (`### 006-goal-criteria-lint (Planned, amended)`), R20 and condition C12, and parent goal D1 and D5. The parent's D5 and its fourth criterion direct these amendments, so the operator approval section 14 asks for is already given. The phase stays Planned and keeps its folder name |
| Baseline | Done | HEAD `996cf85eef`, `SKDOC_SKIP_VALIDATION` unset: `check-goal.cjs --all` printed `goals_scanned=353` with one stderr `ERROR` line and exit 2, sha256 `4bf117a9...aadcd6`. sk-create-goal suite 20 of 20, playbook package 8 scenarios and 0 violations, catalog package 0 fail and 6 warn, phase strict validate `RESULT: PASSED`. Source: build record section 1 |
| Lint (T005 to T010) | Done | Briefs 01 to 06. `--all` under stub `jev` and `cli-deem`: `goals_scanned=323 scratch_excluded=30 criteria=1543 scored=1485 rule4_violations=1017 rule5_violations=41 both_violations=40`, exit 0, no stub log. These match the planning prototype's counts. Missing packet, bad option and unreadable file each print one `ERROR` line and exit 0. Source: build record sections 1 and 4, P1 and P8 |
| Label draw (T011) | Done | `node draw-labels.cjs 20260928 100`: seed 20260928, 100 rows over 21 strata by track group and goal kind, from 1,357 distinct scored hashes. Every row has the six keys, a 12-hex hash and four null label fields. Source: build record sections 3 and 4, P4 |
| Scorer (T013, T026) | Done | Briefs 07 and 08. On the drawn file, with and without `--lint`: `unlabeled=100`, `no labeled rows`, no rate, exit 0. Mixed rubrics print `rubric mismatch:` and no rate. Scorer tests 8 of 8. Source: build record section 4, P5 and P10 |
| Skill docs (T027) | Done | Briefs 09 to 17, byte copies of the orchestrator's text. `validate_document.py` exit 0 on all eight docs, playbook package 9 scenarios and 0 violations, catalog package the same six warnings as baseline. Source: build record section 4, G2 and G3 |
| Final checks | Done | Suite 40 of 40 (baseline 20, +20). `check-goal.cjs` unchanged, its `--all` output byte-identical. No `API_KEY` or `child_process` match. `create-goal-auto.yaml` unchanged. Source: build record sections 4 and 5 |
| Session reruns | Done | From the final state: P1, P2, P3, P4, P5 under the stub `PATH`, P6, P9, P11, G2 and G3 with the same results, 0 em dashes in the four scripts and three new docs and no comment-hygiene match. Source: session record |
| Review | Done | Claude `review` agent, a different family from DeepSeek and MiMo: PASS, no P0 and no P1, six P2 recorded and not fixed (parent D5). Source: session record |
| Build commit | Done | `2139eb8c0d`, 207 paths: 13 build files, the Hermes copy, two hook-regenerated manifests and the `scratch/w3-build` record. Staged set checked against an allowlist, and the key and secret scan found no match. Source: session record, `git show --name-only 2139eb8c0d` |
| Labels and rubric | Operator | T001 and T012, past the label gate: adopt a rubric, fill the 100 rows, then run the scorer. Not part of this phase's completion (parent D4) |
| Phase docs | Done | Closure pass, 2026-09-29: `tasks.md`, this log, `implementation-summary.md`, `spec.md` and `plan.md` record the evidence and correct the stale premises. Gate results are in `implementation-summary.md` Verification |

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
| Deviation: `scripts/README.md` doc-truth fixes (source: build record section 6, item 1) | Beyond the lint lines, "four things" became five and the `--all` sentence now says it exits 2 when a goal cannot be read. The tests row now reads `pass 40`. All three sit in a file the build had to change. The review later found that sentence still narrower than `check-goal.cjs:703`, which also exits 2 on an unclosed frontmatter fence (P2 4) |
| Deviation: five extra lint tests (source: build record section 6, item 2) | Parser parity, line and hash, the placeholder and unscored classes, the command line and the report, each failing for a reason the named seven do not cover |
| Deviation: the draw dedupes by hash (source: build record section 6, item 3) | The draw takes scored lines only, one per `text_sha12`, so no label goes to a placeholder or a repeated line. The scorer joins on the hash, so a moved `path:line` id does not stale a label |
| Deviation: one version bump (source: build record section 6, item 4) | Only `SKILL.md` moved, 1.2.0.0 to 1.3.0.0. The new docs took the anchor's major and minor, and the other changed docs kept theirs |
| Deviation: em dashes removed (source: build record section 6, item 5) | Em dashes from the orchestrator's brief headers and Pi's JSDoc reached the first lint and test files. Brief 06 removed them, and the two scratch briefs were fixed after dispatch |
| Deviation: three pre-existing em dashes kept (source: build record section 6, item 6) | The hub `feature-catalog.md` keeps the three it held at HEAD, one on the line the build extended, because rewriting them would edit text outside this change |
| Deviation: brief 17 (source: build record section 6, item 7) | A one-line follow-up after the dispatch plan removed a serial comma from the orchestrator's own SCG-009 scenario text. It is not a retry |
| Deviation: executor roster (source: build record section 6, premise 4, and section 3) | The operator's roster of 2026-09-28 at about 20:30 governed: Devin `deepseek-v4-1-flash-max` and Pi on `llmgateway/mimo-v2.6-pro`, Cursor retired. Pi on Cline and Cursor ran nothing. `spec.md` and `plan.md` now say so. The Build route row above keeps the earlier roster as history |
| Deviation: checker baseline without a `RESULT` line (source: build record section 6, premise 2) | Corpus mode prints no `RESULT` line (`check-goal.cjs:540-555`) and exits 2 whenever its error list is not empty. P3 compared the full stdout, stderr and exit code instead, which is stricter. REQ-003, proof plan step 2, the plan's first slice and test rows and T002 and T017 now say so |
| Deviation: `CHECKS` has five names (source: build record section 6, premise 1) | REQ-003 said four. `check-goal.cjs:46-52` lists five, and REQ-003 now says five |
| Finding: validator path is a symlink (source: build record section 6, premise 3) | `plan.md` names `.skilled/skills/sk-doc/scripts/validate_document.py`, a symlink to `../shared/scripts/validate_document.py`, so both run the same file. No change needed |
| Deviation: three derived paths in the commit (source: session record) | The SKILL.md change drifted the Hermes copy. The session ran `sync-skills-hermes.cjs` (`Wrote 1 of 73`, then `PASS: 73 Hermes skill copies in sync`), and the commit hook regenerated two `activation/sk-doc/manifest.json` files. None is in `spec.md`'s file list, and all three are in `2139eb8c0d` |
| Finding: six review P2s open (source: session record) | The scorer's F1 prints `n/a` on a zero denominator, and a null-rubric labeled row is scored. Its in-process lint run drops errors. `scripts/README.md:93` and `:100` state exit 2 too narrowly. The scorer tests always pass `--lint`. Recorded, not fixed, under parent D5 |
| Finding: HEAD moved during the build (source: build record section 7, item 6) | From `996cf85eef` to `1da5b193d2`, five commits from other sessions, none under `sk-doc/` or this phase |
| Finding: lexical_unscored count (source: build record section 4, P1) | The first `--all` run counted 7 `lexical_unscored` lines. Whether they are non-English was not checked, so `spec.md`'s open question stays open |
| Finding: left to others (source: session record, build record section 7) | The trigger index rebuild is deferred until 005 is committed. `spec.md` asks for a refresh of `../changelog/` at close, but the parent has no `changelog/` directory and this pass may write only this folder |
| Amendment: Jev first (2026-09-29) | Source: the operator's "Flip now" of 2026-09-29 and the parent goal's D1, now "Features run on Jev first, else Deem". D3 "A model arm, Deem preferred, exists only when" became "A model arm, Jev first and then Deem (operator, 2026-09-29), exists only when". `plan.md` "Deem is preferred (007's research section 12, R20 and condition C12)" became "Jev runs first, then Deem, the operator's order of 2026-09-29, which replaces the Deem preference of 007's research section 12, R20 and condition C12". `spec.md` Phase Context "the arm may run on Deem or Jev, Deem preferred" became "the arm may run on Jev or Deem, Jev first and then Deem by the operator's order of 2026-09-29 where the research preferred Deem". No gate changed: the stop rule, 002's latency record, each switch and parent D1's checks stand word for word. The row "Objective and D3 amended" above quotes the old wording as history |
<!-- /ANCHOR:log -->
