---
title: "Feature Specification: Phase 22: alignment-folder-suggestion"
description: "Test research R13 offline: whether a Jev or Deem choice among the folders a low-alignment save already lists picks the right folder more often than staying with the target or taking the top-scored alternative. R13 waited on gold, since no archived record says which folder a below-50 save should have used. A zero-call census counts below-50 events per path, confirms which path lists alternatives at all and stops at a 30-row label gate. Released 2026-09-29, built and closed at its label gate the same day, commit ba70806077."
trigger_phrases:
  - "alignment folder suggestion"
  - "score-alignment-suggestion"
  - "below-50 alignment census"
  - "low alignment save suggestion"
  - "r13 alignment gold"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 22: alignment-folder-suggestion

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 35 |
| **Predecessor** | 021-stage2-leaf-route-replay |
| **Successor** | 023-reply-harness-blinded-judge |
| **Handoff Criteria** | The zero-call census has printed below-50 events per save path and source, and the path replay has shown which path lists alternatives. The phase then closes at its label gate: the scorer prints `stop: fewer than 30 labeled rows` on the unlabeled rows and its keep rule is proven on synthetic labels. Past the gate, outside this phase's completion, each model run the operator asks for prints `verdict jev:` or `verdict deem:` with `keep`, `kill` or `stop (<reason>)`. A `keep` serves nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the cli-jev workflow integration specification. It tests research R13, a suggested folder for a below-50 alignment save. The sources are `../001-deep-research/research/research.md` (the record `### R13.` in section 11, the spec-alignment row in section 7 and the promote-when row in section 13) and `../007-classifier-deep-research/research/research.md` (the carried table in section 12 and the R13 row in section 4, which keeps it later for want of gold). On 2026-09-29 the operator asked for one phase per later item "so we can test everything".

**Scope Boundary**: One new read-only eval script in system-spec-kit's CLI package, its test and the docs parent D6 requires. It imports the alignment validator read-only, never edits the validator, the folder detector or the save, and serves nothing.

**Dependencies**:
- `runtime/cli/spec-folder/alignment-validator.ts`, imported read only for its exports (`:700-712`).
- Phase 008 (`008-cli-classifier-hub`), Complete, for `cli-deem` on the Deem arm only.
- The operator's labels past the gate. This phase closes at the label gate, as 003 and 006 did under parent D4, and no model writes a label.
- Release: released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Build roles: parent D5 (`plan.md` section 4). Skill docs: parent D6.

**Deliverables**:
- `score-alignment-suggestion.ts` (proposed) with the zero-call census, the path replay, the unlabeled-row writer, the scorer, the label gate, a `--jev` arm and a `--deem` arm (proposed switches)
- `score-alignment-suggestion.vitest.ts` (proposed) with synthetic logs, a synthetic specs tree, synthetic labels and stub backends
- One census report and one unlabeled rows file at paths the operator names, outside the repository
- The system-spec-kit docs of section 3, written through sk-doc

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A save checks how well its content matches the target spec folder. The thresholds are 70 and 50 (`.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:73-75`), and the branches are at `:503-520`.

**Below 50, what the save does:**
- It prints a warning and scores the numbered folders it can see.
- It lists at most three that score higher than the target (`:522-545`).
- In a non-interactive run it proceeds with the target (`:556`), or it hard-blocks below 20 (`:552-554`, `:593-595`).
- It suggests nothing.

The printed percentage is the base score, while the decision uses the higher of the base and domain-aware scores (`:489-493`). So only the decision line tells which band a save fell in.

R13 would suggest one of the listed folders. The research parked it as later because no archived gold says which folder a low-alignment save should have used, and it fails Q1. Its smallest slice is "count archived below-50 saves first", and it is promoted when "enough archived below-50 saves with their final folder exist".

**Committed text today (recounted 2026-09-29):**
- The only below-50 events are two 0% saves in `specs/sk-doc/z_archive/016-create-diff-mode/001-research-and-requirements/research/lineages/document-diff-2/logs/fanout-lineage.out`. Both hard-blocked, and neither listed an alternative.
- One scratch trace holds a 60% moderate event.
- No committed record pairs a below-50 save with its final folder.

**Two save paths, and only one can use a suggestion.**
- **The CLI path.** The documented save passes the folder as an argument (`references/memory/save-workflow.md:211-213`). That reaches `validateContentAlignment` with the specs root as the folder list (`runtime/cli/spec-folder/folder-detector.ts:1034-1045`). The specs root holds track folders and 0 folders matching `^\d{3}-`, so this path lists no alternatives. This was INFERRED from the code and a listing; the 2026-09-29 path replay confirms it: `replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0`. Even a chosen alternative is ignored on this path (`ALIGNMENT_BYPASSED`, `:1047-1049`).
- **The data path.** `validateFolderAlignment` (`folder-detector.ts:1160-1167`) lists the target's numbered siblings and does switch.

### Purpose

Count below-50 saves per path with zero calls, confirm which path can list a folder to suggest, build the gold R13 lacks up to a 30-row label gate, and past that gate settle on counted numbers per backend whether a model's pick beats the free answers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **The committed-text census.** It makes zero calls and scans the repository's committed text files, skipping source code, for the validator's decision lines on both paths:
  - CLI path: `Content aligns with target folder`, `Moderate alignment (`, `ALIGNMENT WARNING: Content may not match` and `INFRASTRUCTURE ALIGNMENT WARNING`.
  - Data path: `Good alignment with selected folder`, `Moderate alignment - proceeding`, `LOW ALIGNMENT WARNING` and `INFRASTRUCTURE MISMATCH (`.
  - Also counted: hard blocks, listed alternatives (`Better matching folders found` or `Better matching alternatives` with their numbered lines) and interactive picks (`Switching to:`, `Continuing with`).
  - The report prints, per path: events in each band, below-50 events with and without alternatives, hard blocks and picks.
- **The transcript census** behind `--transcripts <dir>` (proposed). The same scan over a directory the operator names prints counts only, never text. Without the flag it prints `transcript events: not measured`.
- **The path replay.** Zero calls. It imports `validateContentAlignment` and `validateFolderAlignment` and runs each non-interactively on synthetic save data, with stdout captured:
  - Once against the real specs root, read only, to confirm the CLI path lists no alternatives there.
  - Once against a synthetic tree of numbered siblings, to show the data path lists them.
- **The rows writer** behind `--rows-out <file>` (proposed), for transcript events only. Each line is one below-50 event with listed alternatives, holding:
  - An id, the path, the target and the alternatives.
  - `state`: the `sessionSummary` of the save call that produced the event, where the transcript pairs them (proposed), else `null`.
  - `gold`: an interactive pick when the transcript holds one.
  - An empty `label`.
  - The file is the operator's private text. It must sit outside the repository, and the writer refuses a path inside it.
- **The scorer** over a rows file. A labeled row has an operator `label` or a `gold` pick, and its value is the target, one of the alternatives or `none_of_these`. Under 30 labeled rows it prints `stop: fewer than 30 labeled rows` and runs nothing further. A row with `state` `null` is counted and never called.
- **The zero-call baseline:** the better of staying with the target (today's non-interactive result) and the top listed alternative (the validator's own best score), by correct count over the labeled rows. It is chosen before any call, and a tie goes to the target.
- **The model arms.** A Jev arm behind `--jev` and a Deem arm behind `--deem` (proposed), past the label gate. Each asks one `choice` per labeled row per option order, over the target, the alternatives and `none_of_these`, in three left rotations.
- **Backend order.** Jev first, then Deem (parent D1). The payload is the operator's session text, so Jev also needs the payload-acceptance and redaction gate that 003's D9 names: `--accept-payload` (proposed) after the operator strips secrets. Without it Jev prints `jev arm skipped: payload not accepted` (proposed) and Deem runs. A failed gate never starts the other backend.
- The Keep Rule in section 4, fixed here, and the docs parent D6 requires.

### Out of Scope

- **Serving.** A suggestion in the save, the validator or the folder detector. A `keep` serves nothing.
- **Other choices.** A choice over every sibling folder rather than the listed alternatives, or changing the thresholds.
- **Fixing the CLI path.** Making it list alternatives or honor one belongs to the save owner (section 7).
- **Rows from committed text.** The two committed events listed no alternative, so they are counted and never written as rows.
- **Writing a label.** Labels are the operator's, past the gate (parent D4's rule for 003 and 006).
- **Shared or spend surfaces.** A shared client, a global switch, the npm `jevctl` or a dollar figure.

### Files to Change

Owner of every code path below: `system-spec-kit`, whose CLI package owns the save and the alignment validator. Code follows sk-code's OpenCode route and the docs go through sk-doc (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Create | Census, path replay, rows writer, scorer, label gate, both arms and verdicts. Proposed name. About 400 to 500 LOC (estimate) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | Create | Cases on synthetic logs, a synthetic specs tree, synthetic labels and stub `jev` and `cli-deem` |
| `runtime/cli/spec-folder/alignment-validator.ts`, `folder-detector.ts` | Read only | The exports and the two call sites |
| `<operator-named report dir>/`, `<operator-named rows file>` | Create at run time, outside the repository | `report.json`, the rows file and `calls.jsonl` from a model run |
| `system-spec-kit/SKILL.md`, `README.md`, `changelog/v<next>.md` | Modify, Create | Parent D6, through sk-doc: the script, its zero-call default, its gate and its switches |
| `feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md`, `feature-catalog.md` | Create, Modify | Parent D6: one entry beside `spec-folder-detection-and-description.md`, with its index row. Proposed name |
| `manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md`, `manual-testing-playbook.md` | Create, Modify | Parent D6: a census scenario and the label-gate stop, with the index row. Proposed name |
| `runtime/cli/evals/README.md`, `runtime/cli/tests/README.md` | Modify | One row each |
| `.hermes/skills/system-spec-kit/SKILL.md`, the trigger index | Regenerate | By their generators after the doc edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The census makes zero model calls and changes nothing | Without `--jev` or `--deem` the script prints the census and never spawns `jev` or `cli-deem`. Stub binaries first on `PATH` log nothing. `git status --porcelain` is the same before and after |
| REQ-002 | The label gate stops the phase | On a rows file with fewer than 30 labeled rows the scorer prints `stop: fewer than 30 labeled rows (<n> labeled)`, exits 0 and runs no arm, even with `--jev` or `--deem`. A label outside the row's options is rejected by row id with exit 2 |
| REQ-003 | Each arm is dormant unless its switch is set and its gate passes | Jev: an identity line with the `jev` path and provider P, then `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P` exiting 0 and `--accept-payload`, else `jev arm skipped: jev not on PATH`, `version` with a details line, `no credential` or `payload not accepted`. Deem: `cli-deem health` within 2,000 ms, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. A skip leaves the other output byte-identical and exits 0 |
| REQ-004 | No key, and private text stays private | The script never reads, logs or passes a key. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' score-alignment-suggestion.ts` returns no match. The census and the report print counts only. Row text is written only to an operator-named file outside the repository. A Jev request carries the row's `state` on stdin, the fixed `-q` instruction and the options only |
| REQ-005 | The path replay tells the truth about alternatives | On the real specs root, the CLI-path replay prints how many alternatives it listed, as `alternatives listed: <n>` (proposed), and the data-path replay prints the same line. On the synthetic tree, the data-path replay lists the higher-scoring siblings. Neither run prompts, since both run non-interactively |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The call shape is fixed | The options are the target, the listed alternatives and `none_of_these`. Each folder's description is its `description.json` `description`, verbatim and hashed (proposed). `none_of_these` reads "None of these folders" (proposed). The `-q` instruction is "Which spec folder should this save go to?" (proposed), printed verbatim before the first call. Three left rotations run, each a fresh call with no answer cache. The modal pick is the row's pick, and three different picks make it `unstable` |
| REQ-007 | Every call and exit has one handling | `calls.jsonl` holds row id, order index, wall ms, exit code, backend, pick, its probability and a status of `measured`, `unmeasured` or `unmeasured_timeout`, and never the row's text. Deem lines carry the commit pair, and Jev lines carry the `jev` version, provider and model. Exits follow 002's handling for both backends. A Jev spawn past 90 s is `unmeasured_timeout`. A stopped arm prints finished rows `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any output |
| REQ-008 | The operator sees the cost first | Jev prints the payload class (the operator's session summaries and folder descriptions), planned calls (3 times the callable labeled rows, plus 1) and estimated input tokens. Deem prints "nothing leaves the machine", planned calls and a wall estimate at its measured p50. No dollar figure |
| REQ-009 | Tests cover every public surface | The vitest file exits 0, with a happy path and one edge case for each surface below. At least 18 cases |
| REQ-010 | The changed skill's docs stay true to the code (parent D6) | The docs of section 3 name the script, its zero-call default, the 30-row gate, the payload gate and the two switches, and `validate_document.py` exits 0 on each |

REQ-009's surfaces:
- The line scan bands a synthetic log on both paths by its decision line, not its printed percentage, and counts an unknown line as nothing.
- The transcript census finds an event and prints no text.
- The path replay lists no alternative on a root with no numbered folder, and lists siblings on the synthetic tree.
- The rows writer leaves every `label` empty, sets `state` to `null` when no save call pairs, and refuses a path inside the repository.
- The gate prints its stop at 29 labeled rows and passes at 30, and a foreign label exits 2.
- The baseline picks the target on a tie.
- Both gates pass a stub and print each skip line, `payload not accepted` among them, with byte-identical output.
- The verdict prints `keep`, `kill`, `stop (margin)` and `stop (coverage)` on synthetic labels.

### Keep Rule (fixed 2026-09-29, before any model run)

Each backend column is judged on its own inputs. Changing this rule after the first model run is an amendment that voids every earlier verdict.

**Inputs.**
- K: the labeled rows with a non-null `state`, at least 30.
- M: rows whose three calls each returned a submitted key.
- On a measured row the column is right when its modal pick equals the label, and `unstable` counts as wrong. The baseline is right when its answer equals the label.
- A and B: the M rows the column gets right, and the rows the baseline gets right.
- W and L: rows only the column gets right, and rows only the baseline gets right.
- F: each row's non-modal picks, summed.

**Headroom.** Before any call, when the baseline is right on more than 90 percent of the K rows, the script prints `no headroom` and neither arm calls.

**Thresholds, checked in this order.**
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: the exact one-sided P(X >= L) for X ~ Binomial(W+L, 0.5) at or below 0.05 prints `kill`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W+L is 0, else `stop (sign test)`.
5. Flips: `10*F <= 3*M`, a flip rate of at most 0.10, else `stop (flips)`.
6. Otherwise `keep`.

**The verdict line.** `verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> F=<F> p=<p> baseline=<target|top>`. Deem adds `model= model_commit= source_commit=` and Jev adds `jev_version= provider= model=`. The line goes to stdout and to `report.json`. Before any call the script prints `margin: 0.10` and one `keep rule:` line.

**What a verdict means.** A `keep` serves nothing: a served suggestion needs the save owner, a later phase and the operator's call. A `kill` closes that backend's folder suggestion at that identity. A stub or synthetic verdict never counts.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With zero calls, the operator reads how many below-50 saves the repository and, on request, their own sessions hold on each path, and whether the CLI path can list a folder at all.
- **SC-002**: The operator has an unlabeled rows file, outside the repository, and a tested scorer that refuses to judge below 30 labels.
- **SC-003**: Past the gate, each model run gives one verdict per column, and a run with neither switch calls nothing.

### Proof Plan

Commands run from `.skilled/skills/system-spec-kit/runtime/cli`. `S` is `evals/score-alignment-suggestion.ts` and `STUB` a directory of logging `jev` and `cli-deem` stubs.

1. `PATH="$STUB:$PATH" npx tsx $S --report <dir>` prints per-path band counts and the path replay's alternative counts, and `transcript events: not measured`. It exits 0, and both stub logs stay empty. Boundary: the two 0% hard blocks in the archived fanout log appear with no alternatives.
2. `npx tsx $S --report <dir> --transcripts <synthetic dir> --rows-out <file outside the repo>` writes rows with every `label` empty. `npx tsx $S --score <that file>` prints `stop: fewer than 30 labeled rows (<n> labeled)` and exits 0.
3. On a synthetic file of 30 labeled rows, a stub `cli-deem` answering the label on every row prints `verdict deem: keep`, and one answering the target prints `stop (margin)` when the target baseline is right on 27 rows.
4. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' $S` exits 1.
5. `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` exits 0 with at least 18 passing tests.

**Kill criterion.** A `kill` closes that backend's folder suggestion. `stop: fewer than 30 labeled rows`, `no headroom`, `stop (<reason>)` and every skip line close nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Below-50 saves are rare and mostly on the CLI path, which lists nothing | High. The gate may stay shut for good | The census count is the answer, and a shut gate is a finding for the save owner |
| Risk | The rows hold the operator's session text | High if sent to Jev | Rows go only to a file outside the repository. Jev needs 003's D9 payload-acceptance and redaction gate, with secrets stripped by the operator, and Deem runs when that gate is not accepted |
| Risk | The transcript may not pair an event with its save call | Med | Unpaired rows keep `state` `null`, are counted and are never called |
| Risk | The path replay's import may cross the evals import policy | Med | T002 checks `check-architecture-boundaries.ts` before the write, and the census falls back to a subprocess run of the built validator if the policy refuses the import (proposed) |
| Dependency | The operator's labels | The model arms cannot run | The phase closes at the gate. The labels are the operator's, after this phase |
| Dependency | Another build changing system-spec-kit's `SKILL.md`, README or changelog | Two builds touching one file would collide | This build runs when no other is changing those files |
| Dependency | The served Deem, or a Jev credential for provider P | That column cannot run | Skip line, exit 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Should the CLI path list and honor alternatives?** Today it scores against the specs root, which holds no numbered folder, and it bypasses any pick. A suggestion there has nothing to choose, so this is the save owner's decision before R13 could serve.
- **How often do below-50 saves happen in real use?** The transcript census answers it for the directory the operator names. A durable count needs an alignment event log, which is the save owner's seam.
- **Is 30 rows enough?** At 30 rows a 10-point gain is 3 rows. The gate and the margin are fixed here so the build cannot tune them.
<!-- /ANCHOR:questions -->

---
