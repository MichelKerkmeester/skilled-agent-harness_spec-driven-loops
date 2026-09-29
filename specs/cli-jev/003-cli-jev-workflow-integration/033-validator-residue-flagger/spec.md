---
title: "Feature Specification: Phase 33: validator-residue-flagger"
description: "Test offline whether a Jev or Deem noul flags correctness and traceability defects in document passages better than the review table does today, which is not at all. A zero-call census of committed deep-review finding rows prints first, the operator confirms 50 finding-cited passages and judges 50 others clean, and each backend column ends in keep, kill or stop under a rule fixed here. Planned, released 2026-09-29."
trigger_phrases:
  - "validator residue flagger"
  - "score-residue-flagger"
  - "correctness traceability flagger"
  - "review finding residue"
  - "residue flagger keep rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 33: validator-residue-flagger

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 33 of 35 |
| **Predecessor** | 032-citation-drift-scan |
| **Successor** | 034-hvr-reader-needed-lens |
| **Handoff Criteria** | The zero-call run has printed the finding-row census and either `stop: fewer than 100 labeled rows` or the flag-nothing baseline on the labeled rows with a headroom line. After the operator's labels, each backend whose gate passed has printed one `verdict <backend>:` line from a live `--out` run with its `calls.jsonl`, or its skip line. The verdict lines go in `goal.md`'s log for the parent goal's log |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 33** of the cli-jev workflow integration specification. It is one of the Planned test phases 019 to 035 that turn each item the round-3 synthesis parked as `later` into a measured verdict, per the operator on 2026-09-29: "I want a phase per later item not yet planned or implemented so we can test everything". Its item is R26, the validator-residue flagger (`../007-classifier-deep-research/research/research.md:886-905`).

**Scope Boundary**: One new read-only measurement script in deep-review's `scripts/`, its Node test, one labels file and the deep-review docs parent goal D6 requires. It adds no column to any review table, edits no review template, reducer, iteration file or finding, and changes no severity or verdict, so every review runs as today.

**Dependencies**:
- Phase 008 (`008-cli-classifier-hub`) is Complete (`ee3a1b057c`). Its `cli-deem` client and `health` check serve the Deem arm only.
- Phase 009 (`009-cli-jev-hub-move`) is Complete (`ea883967d4`). The Jev transport's contract now lives at `.skilled/skills/cli-classifier/cli-usage/SKILL.md`, and the Jev arm needs the Python `jev-cli` 0.6.2 on `PATH` with a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- For the Deem arm only: the local Deem server passing the check in `.skilled/skills/cli-classifier/cli-deem/SKILL.md:49-57`.
- The operator's 100 labels (the label gate, REQ-004). No model writes a label.
- Release. Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.

**Deliverables**:
- `score-residue-flagger.cjs` (proposed) with the finding-row census, a `--draw` mode that writes the unlabeled sample, the label gate, the flag-nothing baseline, a `--jev` arm and a `--deem` arm (proposed switches)
- `score-residue-flagger.test.cjs` (proposed) against fixture review folders in a temp git repository, with stub `jev` and `cli-deem` binaries
- `residue-flagger-labels.jsonl` (proposed) with 100 drawn rows and no text
- One zero-call report and, once the labels exist, one live report per backend whose gate passed, in a directory the operator names
- The deep-review docs parent goal D6 names, written through sk-doc: `SKILL.md`, `README.md`, one changelog file, one feature-catalog entry and one manual-testing-playbook entry

**Changelog**:
- The parent packet has no `../changelog/` folder, so there is no packet changelog to refresh at close. The skill changelog this phase writes is listed under Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A document can pass every validator and still hold a correctness or traceability defect, because no validator checks either (`research.md:475`). Reviewers find them later: mimo-02 counted 2,075 severity-bearing finding rows in committed review files, of which 1,000 carry a canonical dimension cell, 337 traceability and 320 correctness (lineage-reported, `research.md:894`). Deep-review records a finding's severity and dimension (`deep-review/SKILL.md:306-313`, `assets/prompt-pack-iteration.md.tmpl:53`, `:157`), and nothing flags a passage before a reviewer reads it.

The synthesis parked R26 as `later` (`research.md:890`, `:900`) because those rows label positives only: every row is a finding, so no passage is labeled clean and precision cannot be measured. Two more facts weaken what the research carried. First, R26's rate of "62 post-pass findings a week" is mimo-02's post-validation edit count, which the invocation-only rerun cut to a frame of 193 passing invocations followed by any `.md` edit in 40 days, not yet scoped to the validated folder, and mimo-08's zero was a path artifact (K9, `research.md:113`, and `../007-classifier-deep-research/research/lineages/mimo/steer.md:152`). Second, glm-04's "about 50 true and 12 false flags a week" came from that retired rate (same file, `:204`). No reviewer has named what a flag column would change (`research.md:905`).

This phase answers the missing-negatives reason directly: the operator judges 50 passages clean and confirms 50 finding-cited passages as defects, because a finding is a reviewer's claim until confirmed. It answers the weak counts by recounting the finding rows from committed files with zero calls. It stays offline, so no reader has to exist before a verdict does.

### Purpose

Produce one verdict per backend column that settles whether a Jev or Deem `noul` flags correctness and traceability defects in document passages better than the flag-nothing baseline, under a keep rule fixed before the build, with a default run that makes zero model calls and prints the finding-row census first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census of finding tables in tracked `*.md` under `specs/` whose path holds `/review/` or `/ai-council/`, outside `/context/` and `/scratch/` (mimo-02's bounded corpus). Tables are read by header: a severity column (`Severity` or `Sev`) holding `P0` to `P2`, a `Dimension` column and a location column (`File:Line`, `File` or `Evidence`). It prints rows per severity, per canonical dimension (correctness, security, traceability, maintainability), per header shape, the tables it skipped for an unrecognized header and the correctness and traceability rows whose location resolves.
- A location resolves when it names a tracked `.md` file and a line that exists at the reviewed commit, taken as the first parent of the commit that added the review file.
- A `--draw` mode that writes 100 unlabeled rows with a recorded seed (REQ-004).
- A flag-nothing baseline, the state of every review table today.
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, one `noul` per labeled row for that row's category, each under its own gate, each with its own verdict column.
- Jev first, else Deem, per parent goal D1. With both switches set and both gates passing, both columns run, each with its own verdict. A failed gate never starts the other backend.
- A per-call `calls.jsonl` and a `report.json`, written to a directory the operator names.
- The deep-review docs parent goal D6 requires (REQ-014).

### Out of Scope

- A flag column in any review table, template or reducer, or any live or hook-time call. glm-04 required the flags to land in the review table, never beside it (`../007-classifier-deep-research/research/lineages/glm/iterations/iteration-004.md`, F3). That is a served form, which needs a `keep` here, a reviewer naming what the column changes and a later phase, and opening it is the operator's call.
- Any classifier that writes or gates severity or a verdict (BASE1 row 15, `../001-deep-research/research/research.md:1059`, and row 97, `research.md:1047`), or drops a finding live on a low score (BASE1 row 8, `:1052`).
- Classifiers on the other validator residue: description fit, agent tool lists and marginal DQI bands (row 92, `research.md:1042`), and voice or placeholder flaggers (row 95, `:1045`).
- One judgment over a whole document. R26 asks per passage and category (`research.md:1076`).
- Security and maintainability rows. R26 names correctness and traceability only.
- A shared Jev or Deem client library, one shared backend flag or silent failover (rows 110, 80 and 81).
- Reading an untracked file, a `.env` file or anything outside `git ls-files`.
- A dollar figure in any cost line.

### Files to Change

Owner of every path below: `system-deep-loop`, in its `deep-review` packet. The script sits beside `render-contract-snapshot.cjs` and its test beside `reduce-state-summary-fallback.test.cjs`. Code follows sk-code's OpenCode route, and the docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id. Every name below is proposed.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` | Create | Census, commit and location resolution, `--draw`, label gate, flag-nothing baseline, `--jev` and `--deem` arms and the per-column verdicts. About 450 to 550 LOC (estimate) |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` | Create | `node --test` cases on fixture review folders with stub `jev` and `cli-deem` binaries |
| `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl` | Create | 100 drawn rows, no text. The build writes ids and hashes. The operator fills every label |
| `.skilled/skills/system-deep-loop/deep-review/scripts/README.md` and `scripts/tests/README.md` | Modify | One row each |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` and its Hermes copy `.hermes/skills/deep-review/SKILL.md` | Modify and regenerate | One sentence naming the offline measurement, its zero-call default and its two switches, and saying it adds no column. The copy is regenerated with `sync-skills-hermes.cjs` |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | Modify | One line naming the script, its default and its switches |
| `.skilled/skills/system-deep-loop/deep-review/changelog/v<next>.md` | Create | The next version after the newest at build time (`v1.11.0.36.md` at planning), through `sk-create-changelog` |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/residue-flagger-measurement.md` and `feature-catalog/feature-catalog.md` | Create and Modify | One entry and its index row, through `sk-create-feature-catalog` |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/<category>/residue-flagger-measurement.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | One scenario covering the zero-call run and a stub-backend skip, plus its index row, through `sk-create-manual-testing-playbook`. The category is chosen at build |
| `<operator-named report dir>/` | Create at run time | `report.json`, and `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **The default run makes zero model calls.** | Without `--jev` or `--deem`, the script prints the census and the label-gate line or the baseline with the headroom line, never spawns `jev` or `cli-deem` and writes no file. Stub `jev` and `cli-deem` binaries first on `PATH`, each logging one line per call, log nothing |
| REQ-002 | **The census counts finding rows from committed files by header.** | It reads only `git ls-files` paths matching the In Scope rule. It prints finding rows per severity, per canonical dimension and per header shape, the count of tables skipped for an unrecognized header, the correctness and traceability rows whose location resolves and the HEAD commit. No finding text, title or passage text is printed |
| REQ-003 | **A passage is read at the commit the review read, and nothing private is read.** | The reviewed commit is the first parent of the commit that added the review file (`git log --diff-filter=A`). A location resolves when it names a tracked `.md` and a line that exists at that commit, read with `git show`. A location outside `git ls-files`, or any basename starting `.env`, is never opened and is counted as `refused`. A row with no resolvable commit or location is counted and dropped |
| REQ-004 | **The labels exist before any model verdict, and no model writes one.** | `--draw --seed <n>` writes `residue-flagger-labels.jsonl` with 100 rows `{id, source, category, doc, line, window_start, window_end, commit, window_sha12, kind, label, labeler}` and no text. 50 rows are positives drawn from resolvable finding rows, 25 correctness and 25 traceability, each window 10 lines each side of the cited line. 50 rows are negatives drawn from the same documents at the same commits, 25 per category, never within 20 lines of any cited line. Every `label` and `labeler` is null. The operator labels each row `defect` or `clean` for its category, because a finding is a reviewer's claim until confirmed. `--draw` refuses to overwrite a file that holds a label. Until 100 rows carry a label, every run prints `stop: fewer than 100 labeled rows` and no arm calls, even with a switch set |
| REQ-005 | **The baseline is the review table as it is today.** | Flag-nothing never flags, so it is right on every row labeled `clean`. The report prints its accuracy on the labeled rows beside the sample's `defect` share |
| REQ-006 | **The keep rule is fixed before any model run and applies per backend column.** | See the Keep Rule below. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-007 | **The Deem arm is dormant unless `--deem` is set and the Deem check passes.** | With `--deem`, `cli-deem health` (on `PATH`, else the repo copy under `node`, as `score-track-narrowing.mjs:1076-1080` does) runs once within 2,000 ms and prints the backend, the model id and the commit pair. A failure prints one of `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming the id found or `deem arm skipped: bad health response`, leaves the zero-call output and any Jev column byte-identical and exits 0. The script never starts the server and passes `cli-deem` no key |
| REQ-008 | **The Jev arm is dormant unless `--jev` is set and the Jev gate passes.** | With `--jev`, one identity line prints first: the resolved `jev` path and the provider P. Then `command -v jev` (else `jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (else `jev arm skipped: version` and a details line with the version found and the binary's path) and `jev auth status --provider P` exiting 0 (else `jev arm skipped: no credential`). Each skip leaves the zero-call output and any Deem column byte-identical and exits 0. The same `--provider P` goes to one `jev auth test --provider P` at the start of the arm and to every judgment |
| REQ-009 | **No key in any file, and the payload stays bounded.** | The script never reads, stores, logs or passes a key and holds no key literal or key variable name. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' score-residue-flagger.cjs` returns no match. A request carries only the category's fixed `-q` instruction and, on stdin, the passage window read from a tracked committed document |
| REQ-010 | **The phase is read-only and offline.** | A default run and each model run leave `git status --porcelain` as it was, except a report directory the operator named inside the repository. No review file, template, reducer or finding changes. The build's changed paths are the Files to Change rows and this phase folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | **The call shape is fixed.** | Each labeled row gets one `noul` for its own category. The two instructions are fixed here and printed verbatim with their SHA-256 before any call, drawn from deep-review's own key questions (`deep-review/SKILL.md:310`, `:312`): correctness, `-q "Does this passage claim behavior that its own text shows to be wrong or inconsistent?"`, and traceability, `-q "Does this passage name a spec item or requirement that the text it describes does not match or does not contain?"`. The window goes on stdin, closed after writing. The answer is the probability of yes, and a row is flagged `defect` when it is at least 0.5, fixed here. The served Deem reports temperature 1.0 (`deem-local.md:53`), so the report also prints each column's Brier score and never lets it decide. Jev asks each row 3 times with no answer cache. Deem asks once, because a repeat returns the same answer (`deem-local.md:92`) |
| REQ-012 | **Every call and exit has one handling, and the operator sees the cost first.** | Before its first call the Deem arm prints "nothing leaves the machine", the planned calls (100) and an estimated wall time at the `noul` p50 of 60.5 ms (`deem-local.md:38`). Before `jev auth test` the Jev arm prints the payload class (windows of committed documents), the planned calls (301) and the estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call with row id, rerun index, `wallMs`, `exitCode`, backend, probability, flag and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines add `modelId`, `modelCommit` and `sourceCommit`. Jev lines add the `jev` version, provider and model. Exits follow 017's REQ-008 table (`../017-deem-search-narrowing-arm/spec.md:148`), including `jev arm stopped: key rejected`, `deem arm stopped: backend refused`, `deem arm stopped: model commit changed mid-run`, `deem arm stopped: server gone` and `interrupted` on 130. A stopped arm prints finished rows as `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any call |
| REQ-013 | **A keep holds only for what it was measured on.** | The report records the Deem commit pair or the Jev version, provider and model per column. A later run on a different Deem pair prints `requalify: model commit changed`, and one on a different Jev provider or model prints `requalify: model changed`, before its verdict |
| REQ-014 | **Tests cover every public surface, and the changed skill's docs stay true to the code (parent goal D6).** | `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` exits 0 with at least 18 cases, a happy path and one edge case each: the table parser and a skipped header shape, commit resolution and an untracked review file, location resolution and a refused `.env` target, `--draw` reproducibility, its 20-line spacing and its refusal to overwrite labels, the label gate at 99 rows, the default run's zero stub calls, the Deem gate pass and stub-backend skip, the Jev gate pass and `no credential` skip, `--out` required, one `--provider` on every stub `jev` call, Deem exit 4 with a changed pair, Jev exit 3 after the gate and the verdicts `keep`, `kill (precision)`, `stop (coverage)` with 2 of 10 rows unmeasured and `stop (margin)`, plus a `requalify` line. deep-review's `SKILL.md`, `README.md`, one changelog file, one catalog entry and one playbook entry each name the script, its zero-call default and both switches, and `validate_document.py` exits 0 on each. No doc names a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

Inputs, per backend column. K counts labeled rows. M counts the rows that backend measured: every call returned a probability after REQ-012's handling. On a measured row the backend's flag is its modal flag over its calls. A counts measured rows the backend gets right and B the measured rows flag-nothing gets right. W counts rows only the backend gets right and L rows only flag-nothing gets right, so W is the backend's true `defect` flags and L its false ones. TP and FP count the backend's `defect` flags that are and are not labeled `defect`. F sums each Jev row's non-modal flags, 3 minus the count of its most common flag.

The script checks five conditions in this order and prints the first that fails.

1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Precision, the synthesis's kill line (`research.md:899`): TP+FP at least 1 and `5*TP >= 4*(TP+FP)`, a precision of at least 0.8, else `kill (precision)`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points over flag-nothing, else `stop (margin)`.
4. Sign test: the exact one-sided binomial p of W or more successes in W+L fair trials is below 0.05, with p 1 when W+L is 0, else `stop (sign test)`.
5. Stability: for Jev, `10*F <= 3*M`, a flip rate of at most 0.10 over 3 reruns, else `stop (flips)`. A Deem `noul` has no option order to permute and repeats itself exactly, so its stability is its commit pair, as 006 set for its Deem arm (`../006-goal-criteria-lint/spec.md:166`), and the report prints `flips: not applicable (deem noul)`.

All five passing prints `verdict <backend>: keep`. Counts stay integers and p is exact. Before any call the script prints `margin: 0.10` and one `keep rule:` line naming all five thresholds. When flag-nothing is right on more than 90 percent of the K rows, a 10-point gain cannot fit, so the zero-call run prints `no headroom`, and when fewer than 5 rows are labeled `defect` the sign test cannot reach 0.05, so it prints `underpowered`. Neither arm calls after either line. The draw's 50 positives leave both lines unlikely, and the lines stay because the operator's labels can turn a drawn positive `clean`. The verdict line prints on stdout and in that column of `report.json` with K, M, A, B, W, L, TP, FP, F, p and what the column was measured on (REQ-013). The synthesis's second kill clause, true flags a week below the reading cost of the false ones (`research.md:899`), needs a served column and a weekly count, so it binds the later phase that would serve one. A stub, fake-server or test keep never counts. This phase is offline only: serving a column needs a later phase and a `keep`, and opening it is the operator's call.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call and before any label, the operator reads how many correctness and traceability finding rows exist in committed review files, how many resolve to a passage and how the sample is drawn.
- **SC-002**: After the labels, one live run per available backend prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` with a per-call record, so R26 is settled on a counted number. Jev runs first, else Deem.
- **SC-003**: A run with neither switch, or with every requested gate failing, changes nothing and calls nothing.

### Proof Plan

1. `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` with stub `jev` and `cli-deem` first on `PATH` exits 0, prints the census and `stop: fewer than 100 labeled rows`, and both stub logs stay empty. Boundary: a stub log line fails REQ-001.
2. The same with `--deem --out <tmp>` and a stub health reporting backend `stub` prints `deem arm skipped: stub backend`, and with `--jev --out <tmp>` and a stub whose `auth status --provider official` exits 3 prints the identity line then `jev arm skipped: no credential`. `diff` against run 1 shows only those lines.
3. `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` exits 0 with at least 18 passed and 0 failed.
4. After the operator's labels: one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Each prints one verdict line, and every `calls.jsonl` line holds `wallMs` and `exitCode`, with `modelCommit` and `sourceCommit` on Deem lines and `provider` and `model` on Jev lines.
5. `git status --porcelain` is the same before and after each run, and the key grep of REQ-009 returns no match.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's 100 labels | No verdict can print | The build stops at the label gate with the drawn file and the gate line, the way 003 and 006 closed. About 3.5 hours at mimo-02's 2 minutes a label (estimate, `../007-classifier-deep-research/research/lineages/mimo/iterations/iteration-002.md`, Q4) |
| Dependency | Phase 008's `cli-deem` and a served Deem | The Deem arm cannot run | The arm prints its skip line |
| Dependency | `jev` 0.6.2 and a credential for provider P | The Jev arm cannot run | The arm prints its skip line |
| Risk | Finding tables change shape across the corpus's history | Med. The census undercounts | The census prints the rows per header shape and every skipped table, so the frame it measured is visible |
| Risk | The reviewed commit is approximated by the parent of the commit that added the review file | Med. A passage can differ from what the reviewer read | Rows with no resolvable commit or location drop and are counted. The operator labels each window as it reads at that commit |
| Risk | Most cited locations are code files, not documents | Med. The positive frame could fall under 50 | The census prints the resolvable frame first. With fewer than 25 per category the draw exits 2 and names the shortfall, and the operator decides whether to amend the category split |
| Risk | A window shows the passage but not the code or spec it describes, so a defect a reviewer found from context is invisible to the model | Med | The keep rule can fail. A `kill` or `stop` here is a result this phase exists to record |
| Risk | Deem's only measured `noul` so far carried close to no signal: R21's calibration printed F1 0.4432 against 0.9843 (`../002-advisor-jev-tiebreak-arm/implementation-summary.md:104`, `:107`) | Med | As above |
| Risk | Precision on a 50/50 sample overstates live precision | Med | The report prints the sample's `defect` share beside the census's counts. A served column must remeasure at live prevalence |
| Risk | Windows leave the machine on the Jev arm | Low. Committed documents in a public repository (parent goal log, "Conflict: 002 corpus privacy against D7") | Tracked files only, `.env` refused, payload line first (REQ-003, REQ-009, REQ-012). None of it is the operator's private text, so 003's payload-acceptance gate (D9, `../003-goal-verifier-jev-shadow/goal.md:64`) does not bind this offline run. A served form over private text would need that gate, with Deem running when it is not accepted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What would a flag column change for a reviewer? The synthesis promotes R26 when a reviewer names it (`research.md:905`). This phase measures without one, and the answer is the operator's.
- Are the two `-q` instructions the right wording? They are fixed here so the build cannot tune them. Changing one is an amendment before the first model run.
- Should confirmed positives weight dispositions a review file records, such as a finding later marked fixed? Out of scope here. The operator's label decides.
- Does a week of live reviews produce enough true flags to pay for the false ones, the synthesis's second kill clause? Only a served form can count it.
<!-- /ANCHOR:questions -->

---
