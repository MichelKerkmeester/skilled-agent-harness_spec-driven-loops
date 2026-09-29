---
title: "Feature Specification: Phase 34: hvr-reader-needed-lens"
description: "Test offline whether a Jev or Deem noul flags three reader-needed voice tells, synonym cycling, significance inflation and false ranges, better than the HVR scanner's floor, which flags none of them. A zero-call census over committed skill docs prints first, the operator labels 150 rows, and each backend column ends in keep, kill or stop under a rule fixed here. Planned, released 2026-09-29."
trigger_phrases:
  - "hvr reader-needed lens"
  - "hvr_reader_lens"
  - "reader-needed voice categories"
  - "synonym cycling significance inflation false ranges"
  - "hvr lens keep rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 34: hvr-reader-needed-lens

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
| **Phase** | 34 of 35 |
| **Predecessor** | 033-validator-residue-flagger |
| **Successor** | 035-fetched-text-injection-screen |
| **Handoff Criteria** | The zero-call run has printed the census and either `stop: fewer than 150 labeled rows` or each category's baseline with its headroom line. After the operator's labels, each backend whose gate passed has printed one `verdict <backend>:` line from a live `--out` run with its `calls.jsonl`, or its skip line, or the zero-call run printed `stop: fewer than 2 categories can pass`. The lines go in `goal.md`'s log for the parent goal's log |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 34** of the cli-jev workflow integration specification. It is one of the Planned test phases 019 to 035 that turn each item the round-3 synthesis parked as `later` into a measured verdict, per the operator on 2026-09-29: "I want a phase per later item not yet planned or implemented so we can test everything". Its item is R22, the HVR reader-needed lens (`../004-deep-research-expansion/research/research.md:711-729`, carried at `../007-classifier-deep-research/research/research.md:927`).

**Scope Boundary**: One new read-only Python script beside `hvr_scan.py`, its test, one labels file and the docs parent goal D6 requires. `hvr_scan.py`, its test and its fixtures are never edited, so the scanner's output stays byte-identical, and no document is rewritten.

**Dependencies**:
- Phase 008 (`008-cli-classifier-hub`) is Complete (`ee3a1b057c`). Its `cli-deem` client and `health` check serve the Deem arm only.
- Phase 009 (`009-cli-jev-hub-move`) is Complete (`ea883967d4`). The Jev transport's contract now lives at `.skilled/skills/cli-classifier/cli-usage/SKILL.md`, and the Jev arm needs the Python `jev-cli` 0.6.2 on `PATH` with a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- For the Deem arm only: the local Deem server passing the check in `.skilled/skills/cli-classifier/cli-deem/SKILL.md:49-57`.
- The operator's 150 labels (the label gate, REQ-004). No model writes a label.
- Release. Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.

**Deliverables**:
- `hvr_reader_lens.py` (proposed) with the census, the two lexical comparators, a `--draw` mode that writes the unlabeled sample, the label gate, the per-category baselines, a `--jev` arm and a `--deem` arm (proposed switches)
- `test_hvr_reader_lens.py` (proposed) against fixture docs in a temp git repository, with stub `jev` and `cli-deem` binaries
- `hvr-reader-lens-labels.jsonl` (proposed) with 150 drawn rows and no text
- One zero-call report and, once the labels exist and at least two categories can pass, one live report per backend whose gate passed, in a directory the operator names
- The docs parent goal D6 names, written through sk-doc: the packet's `SKILL.md` and `README.md`, one changelog file, one feature-catalog entry and one manual-testing-playbook entry

**Changelog**:
- The parent packet has no `../changelog/` folder, so there is no packet changelog to refresh at close. The skill changelog this phase writes is listed under Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Human Voice Rules scanner settles only what a machine can settle without reading for meaning. Its docstring names the rest, "synonym cycling, false ranges, [...] significance inflation, generic conclusions and personality all need a reader", and calls its subtotal "a floor on the deductions" (`hvr_scan.py:17-21`). Every run prints eleven such categories as `NOT scored here` (`hvr_scan.py:531-535`, printed at `:570`). An author who wants that half checked rereads the whole document.

The synthesis parked R22 as `later` for two reasons. No labels exist, so no decision changes until precision is known (`../004-deep-research-expansion/research/research.md:715`, Q1 fails at `:724`). And draft prose would leave the machine, which C13 removes for Deem only (`../007-classifier-deep-research/research/research.md:97`, `:429`). Round 3 kept it `later` for the first reason.

A zero-call count on 2026-09-29 (this leaf, a scratch script over the scanner's own functions) shows a harder problem than missing labels. Of 7,889 tracked `.md` files under `.skilled/skills/` outside changelogs and fixtures, the scanner flags at least one finding in 50,999 of 103,594 heading sections, and 40,946 of those run 5 to 80 lines. Of those 40,946 sections, 2 hold one of the eight significance-inflation phrases the standard lists (`hvr-rules.md:322-329`) and 786 hold a `from X to Y` construction. So a random draw of 50 sections expects no significance-phrase section and about 1 false-range candidate. The committed docs were written under this standard, and the tells may simply be rare in them. That rarity is a result this phase can print before any label or call.

This phase answers the labels reason by drawing and labeling 150 rows, 50 per category, and answers the rarity by drawing false-range and significance rows half from the sections the standard's own lexical rule catches. It measures committed docs only, so no draft leaves the machine and the egress half of the reason stays with a later served form.

### Purpose

Produce one verdict per backend column that settles whether a Jev or Deem `noul` flags synonym cycling, significance inflation and false ranges in skill-doc sections better than the scanner's floor and the standard's lexical rules, under a keep rule fixed before the build, with a default run that makes zero model calls and prints the census first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census over tracked `*.md` under `.skilled/skills/`, outside `/changelog/`, `/fixtures/` and `node_modules`. The script runs `hvr_scan.py --json` (the `:26` seam) over the frame in batches and splits each file into heading sections at ATX headings outside fenced code (proposed). A flagged section holds at least one scanner finding, which is this spec's reading of BASE2's "per flagged section" (proposed). The report prints files, sections, flagged sections, flagged sections of 5 to 80 lines, per-category candidate counts and the HEAD commit.
- Three categories, fixed here from the research's named examples (`../004-deep-research-expansion/research/research.md:716`): synonym cycling (`hvr-rules.md:275-277`), significance inflation (`:317-329`) and false ranges (`:279-288`).
- Two lexical comparators, parsed from the standard at run time the way the scanner parses its lists (`hvr_scan.py:8-11`) (proposed): significance inflation flags a section holding one of the eight listed phrases, and false ranges flags a section matching `\bfrom\s+\S+(\s+\S+){0,3}\s+to\s+\S+`, case-insensitive. The standard gives no lexical rule for synonym cycling, so it has none.
- A `--draw` mode that writes 150 unlabeled rows with a recorded seed (REQ-004).
- Per-category baselines: the better of flag-nothing, which is the scanner's floor for these categories, and the category's lexical comparator.
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, one `noul` per labeled row for that row's category, each under its own gate, each with its own verdict column.
- Jev first, else Deem, per parent goal D1. With both switches set and both gates passing, both columns run, each with its own verdict. A failed gate never starts the other backend.
- A per-call `calls.jsonl` and a `report.json`, written to a directory the operator names.
- The docs parent goal D6 requires (REQ-014).

### Out of Scope

- Any edit to `hvr_scan.py`, its tests, its fixtures or the standard. Its exit contract and output stay as they are (`../004-deep-research-expansion/research/research.md:721`).
- Any classifier inside `validate.sh`, `validate_document.py` or a hook guard, or one that sets a validator's verdict (`../007-classifier-deep-research/research/research.md:1047`, row 97).
- A template-alignment classifier (row 96, `:1046`) or voice and placeholder flaggers counted over the corpus's whole life (row 95, `:1045`).
- One judgment over a whole document. R22 asks per section and category (`:1076`).
- The other eight reader-needed categories. Adding one is an amendment before the first model run.
- A served form over drafts. That payload is the operator's private text, so it would need a payload-acceptance gate like 003's D9 (`../003-goal-verifier-jev-shadow/goal.md:64`), with Deem running when the gate is not accepted, and a later phase after a `keep`.
- A shared Jev or Deem client library, one shared backend flag or silent failover (rows 110, 80 and 81).
- Reading an untracked file, a `.env` file or anything outside `git ls-files`.
- A dollar figure in any cost line.

### Files to Change

Owner of every path below: `sk-doc`, in its `sk-create-with-human-voice` packet, except the catalog rows, which sit in the sk-doc hub's catalog because the packet has none (phase 006's `goal-criteria-lint.md` sits there the same way). The script sits beside `hvr_scan.py` and its test beside `test_hvr_scan.py`. Code follows sk-code's route for Python, and the docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id. Every name below is proposed.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | Create | Census, section split, comparators, `--draw`, label gate, baselines, `--jev` and `--deem` arms and the per-column verdicts. deepseek-04 estimated 80 to 140 LOC for a Jev-only lens (`../004-deep-research-expansion/research/research.md:722`). With the census, the draw, two arms and the verdict, about 400 to 500 (estimate) |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | Create | Plain-runner checks in `test_hvr_scan.py`'s style, ending `ALL PASS`, with stub `jev` and `cli-deem` binaries |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl` | Create | 150 drawn rows, no text. The build writes ids and hashes. The operator fills every label |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md` | Modify | Rows for the script, the test and the labels file |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` and its Hermes copy `.hermes/skills/sk-create-with-human-voice/SKILL.md` | Modify and regenerate | One sentence naming the offline lens, its zero-call default and its two switches, and saying the scanner is unchanged. The copy is regenerated with `sync-skills-hermes.cjs` |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/README.md` | Modify | One line naming the script, its default and its switches |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/changelog/v<next>.md` | Create | The next version after the newest at build time (`v1.1.0.0.md` at planning), through `sk-create-changelog` |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/hvr-reader-needed-lens.md` and `feature-catalog/feature-catalog.md` | Create and Modify | One entry and its index row, through `sk-create-feature-catalog` |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | One scenario covering the zero-call run and a stub-backend skip, plus its index row, through `sk-create-manual-testing-playbook` |
| `<operator-named report dir>/` | Create at run time | `report.json`, and `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **The default run makes zero model calls.** | Without `--jev` or `--deem`, the script prints the census and the label-gate line or each category's baseline with its headroom line, never spawns `jev` or `cli-deem` and writes no file. Stub `jev` and `cli-deem` binaries first on `PATH`, each logging one line per call, log nothing |
| REQ-002 | **The census counts sections from committed files through the unchanged scanner.** | It reads only `git ls-files` paths matching the In Scope rule and gets findings only from `hvr_scan.py --json`. It prints files, sections, flagged sections, flagged sections of 5 to 80 lines, candidate sections per lexical comparator and the HEAD commit. No section text is printed. When the scanner prints `{"skipped": true, ...}` because `SKDOC_SKIP_VALIDATION` is on (`validation_switch.py:32`, `:105-118`), the run prints `stop: scanner skipped` and exits 0, and never counts a skipped file as clean. A scanner exit 2 stops the run with exit 2 |
| REQ-003 | **Nothing private is read.** | A path outside `git ls-files`, or any basename starting `.env`, is never opened and is counted as `refused`. Every drawn section is read at its recorded commit with `git show` |
| REQ-004 | **The labels exist before any model verdict, and no model writes one.** | `--draw --seed <n>` writes `hvr-reader-lens-labels.jsonl` with 150 rows `{id, category, doc, section_start, section_end, commit, section_sha12, candidate, label, labeler}` and no text, drawn from flagged sections of 5 to 80 lines, no more than 5 per skill per category (proposed). Synonym cycling draws 50 rows at random. False ranges and significance inflation each draw up to 25 rows from sections their comparator flags and the rest from sections it does not, and the report prints how many candidate rows each drew. Every `label` and `labeler` is null. The operator labels each row `yes` or `no` for its own category. `--draw` refuses to overwrite a file that holds a label. Until 150 rows carry a label, every run prints `stop: fewer than 150 labeled rows` and no arm calls, even with a switch set |
| REQ-005 | **Each category's baseline is the better of the scanner's floor and the standard's lexical rule.** | Flag-nothing never flags, which is what the scanner does for these categories. The category's comparator flags its candidate rows. Synonym cycling's baseline is flag-nothing. For the other two, the baseline is whichever is right on more labeled rows, flag-nothing on a tie. The report prints both accuracies and the `yes` share per category |
| REQ-006 | **The keep rule is fixed before any model run and applies per backend column.** | See the Keep Rule below. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-007 | **The Deem arm is dormant unless `--deem` is set and the Deem check passes.** | With `--deem`, `cli-deem health` (on `PATH`, else `node .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs`, as `score-track-narrowing.mjs:1076-1080` resolves it) runs once within 2,000 ms and prints the backend, the model id and the commit pair. A failure prints one of `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming the id found or `deem arm skipped: bad health response`, leaves the zero-call output and any Jev column byte-identical and exits 0. The script never starts the server and passes `cli-deem` no key |
| REQ-008 | **The Jev arm is dormant unless `--jev` is set and the Jev gate passes.** | With `--jev`, one identity line prints first: the resolved `jev` path and the provider P. Then `jev` on `PATH` (else `jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (else `jev arm skipped: version` and a details line with the version found and the binary's path) and `jev auth status --provider P` exiting 0 (else `jev arm skipped: no credential`). Each skip leaves the zero-call output and any Deem column byte-identical and exits 0. The same `--provider P` goes to one `jev auth test --provider P` at the start of the arm and to every judgment |
| REQ-009 | **No key in any file, and the payload stays bounded.** | The script never reads, stores, logs or passes a key and holds no key literal or key variable name. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' hvr_reader_lens.py` returns no match. A request carries only the category's fixed `-q` instruction and, on stdin, one section read from a tracked committed document |
| REQ-010 | **The phase is read-only and offline.** | A default run and each model run leave `git status --porcelain` as it was, except a report directory the operator named inside the repository. `hvr_scan.py` and every scanned document are unchanged. The build's changed paths are the Files to Change rows and this phase folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | **The call shape is fixed.** | Each labeled row gets one `noul` for its own category. The three instructions are fixed here, drawn from the standard's own wording, and printed verbatim with their SHA-256 before any call: synonym cycling, `-q "Does this passage refer to the same thing by three or more different words?"` (`hvr-rules.md:277`), significance inflation, `-q "Does this passage declare that something is important or historic instead of stating what happened?"` (`:319`), and false ranges, `-q "Does this passage use a from X to Y construction whose endpoints are not on a meaningful scale?"` (`:281`). The section goes on stdin, closed after writing. The answer is the probability of yes, and a row is flagged `yes` when it is at least 0.5, fixed here. The served Deem reports temperature 1.0 (`deem-local.md:53`), so the report also prints each category's Brier score and never lets it decide. Jev asks each row 3 times with no answer cache. Deem asks once, because a repeat returns the same answer (`deem-local.md:92`) |
| REQ-012 | **Every call and exit has one handling, and the operator sees the cost first.** | Before its first call the Deem arm prints "nothing leaves the machine", the planned calls (150) and an estimated wall time at the `noul` p50 of 60.5 ms (`deem-local.md:38`). Before `jev auth test` the Jev arm prints the payload class (sections of committed skill docs), the planned calls (451) and the estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call with row id, category, rerun index, `wallMs`, `exitCode`, backend, probability, flag and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines add `modelId`, `modelCommit` and `sourceCommit`. Jev lines add the `jev` version, provider and model. Exits follow 017's REQ-008 table (`../017-deem-search-narrowing-arm/spec.md:148`), including `jev arm stopped: key rejected`, `deem arm stopped: backend refused`, `deem arm stopped: model commit changed mid-run`, `deem arm stopped: server gone` and `interrupted` on 130. A stopped arm prints finished rows as `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any call |
| REQ-013 | **A keep holds only for what it was measured on.** | The report records the Deem commit pair or the Jev version, provider and model per column. A later run on a different Deem pair prints `requalify: model commit changed`, and one on a different Jev provider or model prints `requalify: model changed`, before its verdict |
| REQ-014 | **Tests cover every public surface, and the changed skill's docs stay true to the code (parent goal D6).** | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` exits 0 and prints `ALL PASS` with at least 18 checks, a happy path and one edge case each: the section split and a heading inside a fence, the census and a skipped scan, both comparators and a genuine measurable range the false-range pattern still flags, refusal of an untracked or `.env` path, `--draw` reproducibility, its per-skill cap and its refusal to overwrite labels, the label gate at 149 rows, the default run's zero stub calls, the Deem gate pass and stub-backend skip, the Jev gate pass and `no credential` skip, `--out` required, one `--provider` on every stub `jev` call, Deem exit 4 with a changed pair, Jev exit 3 after the gate and the verdicts `keep`, `kill (precision)`, `stop (coverage)` and `stop (categories)`, plus a `requalify` line. `python3 scripts/tests/test_hvr_scan.py` still prints `ALL PASS`. The packet's `SKILL.md`, `README.md`, one changelog file, one catalog entry and one playbook entry each name the script, its zero-call default and both switches, and `validate_document.py` exits 0 on each. No doc names a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

Inputs, per backend column and per category c. K counts the category's labeled rows. M counts the rows that backend measured: every call returned a probability after REQ-012's handling. On a measured row the backend's flag is its modal flag over its calls. A counts measured rows the backend gets right and B the measured rows the category's baseline gets right (REQ-005). W counts rows only the backend gets right and L rows only the baseline gets right. TP and FP count the backend's `yes` flags that are and are not labeled `yes`. F sums each Jev row's non-modal flags, 3 minus the count of its most common flag.

Before any call, per category: when the baseline is right on more than 90 percent of K, the run prints `no headroom (<c>)`, and when fewer than 5 rows are ones the baseline gets wrong, the sign test cannot reach 0.05, because 0.5 to the fourth power is 0.0625, so it prints `underpowered (<c>)`. Neither category can then pass. When fewer than two categories are left, the run prints `stop: fewer than 2 categories can pass` and neither arm calls.

The script then checks, in this order, and prints the first line that applies.

1. Coverage: in every category `10*M >= 9*K`, else `stop (coverage)`.
2. Kill, the research's own clause (`../004-deep-research-expansion/research/research.md:723`): precision below 0.6 in every category, `5*TP < 3*(TP+FP)`, a category with no `yes` flag counting as below, gives `kill (precision)`.
3. Per category, the first failing condition of five, printed as `category <c>: pass` or `category <c>: <condition>`. The five, in order: no headroom or underpowered from the zero-call run. Precision, TP+FP at least 1 and `5*TP >= 4*(TP+FP)`, at least 0.8. Margin, `10*(A-B) >= M`, a gain of at least 10 points over the baseline. Sign test, the exact one-sided binomial p of W or more successes in W+L fair trials below 0.05, with p 1 when W+L is 0. Stability, for Jev `10*F <= 3*M`, a flip rate of at most 0.10 over 3 reruns. A Deem `noul` has no option order to permute and repeats itself exactly, so its stability is its commit pair, as 006 set for its Deem arm (`../006-goal-criteria-lint/spec.md:166`), and the report prints `flips: not applicable (deem noul)`.
4. At least two categories passing prints `verdict <backend>: keep`, the research's keep of precision at least 0.8 on at least two categories (`:723`) with the margin, sign and stability conditions added. Fewer prints `verdict <backend>: stop (categories)`.

Counts stay integers and p is exact. Before any call the script prints `margin: 0.10` and one `keep rule:` line naming every threshold. The verdict line prints on stdout and in that column of `report.json` with each category's K, M, A, B, W, L, TP, FP, F and p and what the column was measured on (REQ-013). Each category is tested at 0.05 on its own, with no correction for three categories, and the two-category keep is the guard. A stub, fake-server or test keep never counts. This phase is offline only: serving a lens needs a later phase and a `keep`, and opening it is the operator's call.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call and before any label, the operator reads how many flagged sections exist in committed skill docs and how many each lexical rule catches, so a likely `underpowered` shows before labeling.
- **SC-002**: After the labels, one live run per available backend prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` with per-category lines and a per-call record, or the zero-call run prints `stop: fewer than 2 categories can pass`, so R22 is settled on a counted number. Jev runs first, else Deem.
- **SC-003**: A run with neither switch, or with every requested gate failing, changes nothing and calls nothing, and `hvr_scan.py`'s output is byte-identical before and after the build.

### Proof Plan

1. `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` with stub `jev` and `cli-deem` first on `PATH` exits 0, prints the census and `stop: fewer than 150 labeled rows`, and both stub logs stay empty. Boundary: a stub log line fails REQ-001.
2. The same with `SKDOC_SKIP_VALIDATION=1` prints `stop: scanner skipped` and no census count.
3. The same with `--deem --out <tmp>` and a stub health reporting backend `stub` prints `deem arm skipped: stub backend`, and with `--jev --out <tmp>` and a stub whose `auth status --provider official` exits 3 prints the identity line then `jev arm skipped: no credential`. `diff` against run 1 shows only those lines.
4. `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` exits 0 and prints `ALL PASS`, and `test_hvr_scan.py` still prints `ALL PASS` with its 11 checks (11 PASS on 2026-09-29, this leaf).
5. After the operator's labels: one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Each prints one verdict line and three category lines, and every `calls.jsonl` line holds `wallMs` and `exitCode`, with `modelCommit` and `sourceCommit` on Deem lines and `provider` and `model` on Jev lines.
6. `git status --porcelain` is the same before and after each run, `git diff --stat` on `hvr_scan.py` is empty and the key grep of REQ-009 returns no match.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's 150 labels | No verdict can print | The build stops at the label gate with the drawn file and the gate line, the way 003 and 006 closed. The time a voice label takes is UNKNOWN, because no lineage measured it |
| Dependency | Phase 008's `cli-deem` and a served Deem | The Deem arm cannot run | The arm prints its skip line |
| Dependency | `jev` 0.6.2 and a credential for provider P | The Jev arm cannot run | The arm prints its skip line |
| Risk | The tells are rare in committed docs: 2 significance-phrase sections and 786 false-range candidates among 40,946 flagged sections (rough, 2026-09-29) | High. Two categories can end `underpowered`, which prints `stop: fewer than 2 categories can pass` with no call | The census prints the counts before labeling. That stop is a result: the lens has little to find in committed docs, and its value would sit in drafts, which a later served form behind a D9-style gate would reach |
| Risk | Candidate-half draws are not a random sample | Med. Precision here overstates or understates live precision | The report prints each category's `yes` share and candidate count. A served lens must remeasure at live prevalence |
| Risk | The false-range pattern also catches genuine ranges, such as "from 1 to 10" | Med. The comparator over-flags | That is the reading the model has to beat. A genuine range labeled `no` counts against the comparator, not for it |
| Risk | Deem's only measured `noul` so far carried close to no signal: R21's calibration printed F1 0.4432 against 0.9843 (`../002-advisor-jev-tiebreak-arm/implementation-summary.md:104`, `:107`) | Med | The keep rule can fail. A `kill` or `stop` here is a result this phase exists to record |
| Risk | Sections leave the machine on the Jev arm | Low. Committed skill docs in a public repository (parent goal log, "Conflict: 002 corpus privacy against D7") | Tracked files only, `.env` refused, payload line first (REQ-003, REQ-009, REQ-012). None of it is the operator's private text, so 003's payload-acceptance gate (D9) does not bind this offline run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which decision would a candidate list change for an author? The synthesis promotes R22 when an author names it (`../004-deep-research-expansion/research/research.md:729`). The answer is the operator's.
- Is "a section with at least one scanner finding" the right reading of "flagged section"? It limits the lens to sections the scanner already marks. Measuring unflagged sections too is an amendment before the first model run.
- Should a draft corpus ever be measured? It would carry the operator's private text, so it needs a D9-style gate and belongs to a later phase.
- Are the three `-q` instructions the right wording? They are fixed here so the build cannot tune them. Changing one is an amendment before the first model run.
<!-- /ANCHOR:questions -->

---
