---
title: "Feature Specification: Phase 18: holdout-row-retirement"
description: "The sealed holdout row suppressed-codex-abstain holds a three-word prompt that the cli-codex mode has listed as an alias since before the row was sealed, so both scorers read it as a routing signal and the row cannot measure held-out reach. This phase runs a count-only leak check first, deletes the row's one line and recaptures the scorer eval baseline with its scoring date unchanged."
trigger_phrases:
  - "holdout row retirement"
  - "phase 18 holdout row retirement"
  - "retire the sealed holdout row"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: holdout-row-retirement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-review-pass-two-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the recaptured baseline reads a holdout total one below the `scratch/before.txt` total with the correct count its rule gives, the leak check after the retirement prints no row in its data line and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It carries out the operator's decision of 2026-11-13 (`../goal.md` line 176): retire the sealed holdout row `suppressed-codex-abstain` in this packet and recapture every baseline that counts it. The decision answers the observation in `../review/review-report.md` section 9, Holdout handling (lines 425 to 428), that the committed `skill-graph.json` holds the full text of that row.

**Scope Boundary**: one sealed row, the one baseline that hashes and counts the sealed file and one README row that describes how the file is kept. The skill metadata and the compiled graph that hold the same text stay as they are.

**Dependencies**:
- Phases 016 and 017 are built and committed before this phase starts. Phase 016 may recapture `scorer-eval-baseline.json`, adds intent phrases to `command-metadata.json` files and edits the routing-accuracy README. Phase 017 edits the same README. So T001 records the before numbers after both, T002 compares the leak check with its planning reading and the README task re-reads its row and marks itself `[B]` when the quoted text is gone.
- The operator answered Q6, the leak-check stop rule, on 2026-11-13 (section 10).

**Deliverables**:
- A sealed holdout with one row fewer and every other line unchanged byte for byte.
- A recaptured scorer eval baseline whose holdout hash and holdout counts match the trimmed file, with the scoring date and every other value unchanged.
- A count-only leak check of every sealed row and every command holdout row, recorded before the retirement and after it.
- A README row that says how a sealed row is retired.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sealed row `suppressed-codex-abstain` is a three-word prompt with gold label `none`. The same three words are an authored alias of the cli-codex mode. `cli-external-orchestration/graph-metadata.json` lists them in `intent_signals` and `derived.trigger_phrases`, the hub router and the mode registry list them as cli-codex alias keywords and the compiler copies `intent_signals` into `skill-graph.json`. Both scorers read that text, so the scorer routes the prompt to `cli-external-orchestration` and the row is a fixed miss against a gold label its own source fixture dropped in August. The row measures the scorer's vocabulary, not its reach on prompts it has not seen.

### Purpose
Remove the row from the sealed set the way the file has already been trimmed once, and recapture the one baseline that counts it, so the holdout aggregate counts only rows whose text the scorer was not given.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran on 2026-11-13 from the worktree root at `087888ec4a`, read-only, while phase 016 was being built in the working tree. Each number is therefore a reading at planning, and T001 records the real before numbers after phases 016 and 017. `RA` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy` and `PL` is this phase's `scratch/planning/`. No command printed a prompt: every `jq` filter deletes the prompt field first and every probe holds prompt text in memory only. Each probe's first comment line says how to run it.

```text
$ jq -r 'del(.prompt) | .source_type' $RA/holdout-prompts.jsonl | sort | uniq -c
   6 holdout-delegation
  20 holdout-harder
  40 holdout-regression
$ jq -c 'del(.prompt) | select(.id=="suppressed-codex-abstain")' $RA/holdout-prompts.jsonl
{"id":"suppressed-codex-abstain","skill_top_1":"none","source_type":"holdout-delegation","origin_fixture":"tests/parity/fixtures/executor-delegation-cases.json"}
$ jq -c 'del(.prompt) | .id' $RA/holdout-prompts.jsonl | grep -n '"suppressed-codex-abstain"'
66:"suppressed-codex-abstain"
$ jq -c '{capturedAt, holdoutSha256, holdout: .metrics.holdout_top1}' $RA/scorer-eval-baseline.json
{"capturedAt":"2026-10-11","holdoutSha256":"sha256:e8c637d3f59fbba18521c78bc238c5c86dc60d9f8b40c2c921c42ac49766a4cf","holdout":{"correct":50,"total":66,"accuracy":0.7576}}
$ shasum -a 256 $RA/holdout-prompts.jsonl | cut -d" " -f1
e8c637d3f59fbba18521c78bc238c5c86dc60d9f8b40c2c921c42ac49766a4cf

# PL/probe-graph-leak-path.mjs, exit 0
row suppressed-codex-abstain: prompt words 3, eight-word runs 0
.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json: hits 1
  {"path":"[\"signals\"][\"cli-external-orchestration\"][9]","kind":"full","valueWords":3}
files not parsed as JSON: 0

# PL/probe-graph-leak-path.mjs over every tracked skill and command JSON file, files with a hit only
.skilled/skills/cli-external-orchestration/graph-metadata.json: hits 4
  {"path":"[\"intent_signals\"][9]","kind":"full","valueWords":3}
  {"path":"[\"derived\"][\"trigger_phrases\"][29]","kind":"full","valueWords":3}
  {"path":"[\"derived\"][\"intent_signals\"][12]","kind":"full","valueWords":3}
  {"path":"[\"intent_signals_generated\"][9]","kind":"full","valueWords":3}
.skilled/skills/cli-external-orchestration/hub-router.json: hits 1
  {"path":"[\"vocabularyClasses\"][\"cli-codex-aliases\"][\"keywords\"][2]","kind":"full","valueWords":3}
.skilled/skills/cli-external-orchestration/mode-registry.json: hits 1
  {"path":"[\"modes\"][2][\"aliases\"][2]","kind":"full","valueWords":3}
.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json: hits 1
  {"path":"[\"signals\"][\"cli-external-orchestration\"][9]","kind":"full","valueWords":3}
.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json: hits 1
  {"path":"[\"cases\"][8][\"prompt\"]","kind":"full","valueWords":3}

# PL/probe-row-history.mjs, exit 0
fixture case holding the sealed prompt, newest first:
  1bf6aec7ac 2026-11-08 ["direct-alias-cli-codex=cli-external-orchestration"]
  6a24503322 2026-11-06 ["direct-alias-cli-codex=cli-external-orchestration"]
  19c2dcf3dd 2026-10-28 ["direct-alias-cli-codex=cli-external-orchestration"]
  463bf14560 2026-10-27 ["direct-alias-cli-codex=cli-external-orchestration"]
  330427cf30 2026-09-17 ["direct-alias-cli-codex=cli-external-orchestration"]
  a87379aa61 2026-09-11 ["direct-alias-cli-codex=cli-external-orchestration"]
  aa11c2b622 2026-09-02 ["direct-alias-cli-codex=cli-external-orchestration"]
  04a391c977 2026-08-28 ["direct-alias-cli-codex=cli-codex"]
  38e2577a55 2026-08-15 ["direct-alias-cli-codex=cli-codex"]
  b052f329a7 2026-07-19 ["suppressed-codex-abstain=none"]
  89d30bf026 2026-07-06 ["suppressed-codex-abstain=none"]
:(glob)**/graph-metadata.json: commits 6, first 5399875c9e 2026-04-13
:(glob)**/executor-delegation-cases.json: commits 1, first 89d30bf026 2026-07-06
:(glob)**/holdout-prompts.jsonl: commits 1, first b743f8702a 2026-07-07
3871b3d5bd rows 66 to 66, removed [], relabelled ["P0-CMD-002"]
35dc706743 rows 66 to 66, removed [], relabelled ["P0-CMD-002"]
d93100d57b rows 70 to 66, removed ["P1-PHRASE-002","P1-PHRASE-003","P1-PHRASE-004","P1-PHRASE-005"], relabelled []

# PL/probe-holdout-row-verdict.mjs, exit 0, against the advisor dist present at planning
scoring date 2026-10-11
holdout total 66, correct 50
row {"id":"suppressed-codex-abstain","gold":"none","got":"cli-external-orchestration","correct":false}

# PL/probe-overlap-counts.mts, exit 0
suppressed-codex-abstain shares its prompt with: ["delegation"]
holdout-delegation|delegation: all 6, without 5
holdout-delegation|intent: all 2, without 2
holdout-harder|delegation: all 2, without 2
holdout-harder|harder: all 20, without 20
holdout-regression|golden: all 5, without 5
holdout-regression|regression: all 40, without 40

# PL/probe-rebuild-drift.mjs, exit 0
builder rows today: 81, committed rows: 66
builder stats: {"rawPool":86,"intraPoolDupes":4,"trainingCollisions":1}
only in the builder output: 16 ["harder:029c6a4fa593","harder:66060fed7ea9","harder:68a980616f38","harder:c2182871dbf3","direct-alias-cli-codex","direct-alias-dsh-headless","split-handoff-delegate-object-to-codex","split-handoff-hand-object-off-to-opencode","split-handoff-prose-delegate-to-team","split-handoff-prose-hand-off-to-qa","workflow-owner-deep-research-loop-cli-pi","workflow-owner-deep-review-cli-codex","workflow-owner-iterative-review-cli-opencode","workflow-owner-spec-folder-cli-codex","runtime-surface-claude-code-stop-hook","runtime-surface-beside-codex-handoff"]
only in the committed file: 1 ["suppressed-codex-abstain"]
same id, different gold: 0 []
suppressed-codex-abstain in the builder output: false

# PL/probe-leak-scan.mjs, exit 0, summary lines
rows checked: sealed 66, command holdout 44
positive control: sealed rows found in their own file 66 of 66, command holdout rows found in their own file 44 of 44
scorer input files scanned: data 50, code 100
rows with a hit: 9 ["negative-guard-following-opencode-standards","P0-UNC-001","P1-ABSTAIN-001","P1-FULLSTACK-001","P1-PHRASE-001","P1-PHRASE-008","P1-REVIEW-005","P1-REVIEW-006","suppressed-codex-abstain"]
rows with a hit in data, three words or more: ["suppressed-codex-abstain"]
rows with a hit in data, under three words: ["P1-ABSTAIN-001","P1-PHRASE-001"]
rows with a hit in code only: ["negative-guard-following-opencode-standards","P0-UNC-001","P1-FULLSTACK-001","P1-PHRASE-008","P1-REVIEW-005","P1-REVIEW-006"]

# PL/probe-leak-scan.mjs --paths over the six planning probes, exit 0
files scanned: 6, rows with a hit: 0 []
```

### Findings per Question
Each finding is marked OBSERVED when a command above or a cited line shows it, and INFERRED when it follows from them without a run that could have contradicted it.

- **How the sealed file is built and pinned.** OBSERVED: `build-holdout.mjs` pools the harder corpus, the regression cases and the delegation cases (`$RA/build-holdout.mjs:52-99`), drops a family that collides with the labeled corpus (`:101-117`) and writes the file only with `--write` (`:130-133`). The committed file is no longer the builder's output: the builder would write 81 rows today, and three commits edited the file by hand (`d93100d57b` removed four rows, `35dc706743` and `3871b3d5bd` relabelled one). The ratchet pins `holdoutSha256` (`scorer-eval-baseline.json:6`, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts:246-250`) and holds `holdout_top1.correct` exactly with a 0.725 floor (`:30`, `:271-277`). The independence gate requires at least 60 rows (`tests/parity/holdout-independent.vitest.ts:32`, `:371-377`), checks every declared overlap still has a shared row (`:395-408`) and holds holdout top-1 at or above the baseline (`:462-469`). Outside `specs/`, the row id appears only in the sealed file, and the hash only in the baseline. `.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs:32` pins 70 holdout rows and throws on a mismatch (`:278-282`). That pin has been stale since `d93100d57b` cut the file to 66, and its tests stub the loader (`tests/score-pi-transport.test.mjs:1074`), so only a live benchmark run reaches it.
- **Where the graph text sits and who reads it.** OBSERVED: the text sits at `signals["cli-external-orchestration"][9]` in `skill-graph.json`, which `skill_graph_compiler.py` builds from each skill's `intent_signals` (`runtime/scripts/skill_graph_compiler.py:1020-1024`, `:1048`). Its source is `cli-external-orchestration/graph-metadata.json`, at `intent_signals[9]` and `derived.trigger_phrases[29]`, with the same alias in `hub-router.json` and `mode-registry.json`. The text entered a `graph-metadata.json` on 2026-04-13, before the delegation fixture took it on 2026-07-06 and the holdout sealed it on 2026-07-07, which settles the review's open question: the graph had the text first. The Python scorer reads `skill-graph.json` signals (`runtime/scripts/skill_advisor.py:253`, `:1443`, `:1452`). The TypeScript scorer reads the same text from `graph-metadata.json` through its filesystem projection (`runtime/lib/scorer/projection.ts:1788`, `:1801`, `:1818`) into the lexical lane (`lanes/lexical.ts:73`), the BM25 lane (`lanes/bm25.ts:172`) and the semantic lane's vector text (`lanes/semantic-shadow.ts:256-265`). So both scorers and the embedder read it. The row scored as a miss at planning: gold `none`, top skill `cli-external-orchestration`.
- **Whether the graph needs a change.** OBSERVED: no. The text is the cli-codex alias the delegation case `direct-alias-cli-codex` routes by, and the operator's decision retires the row, not the alias. Leaving the text breaks nothing: once the row is gone, the leak check's data line names no row at three words or more. INFERRED, not measured: removing the alias would cost the delegation bucket that case.
- **What retired means mechanically.** Delete the row's one line. The file already follows this convention: `d93100d57b` removed four rows by hand and recaptured the baseline without touching the builder, and the independence gate's failure message tells a reader to drop a shared row from the holdout (`holdout-independent.vitest.ts:388-392`). A retired marker loses because the capture, the ratchet, the independence gate and the classifier census would each need a skip, and a reader that missed it would score the row silently. Moving the row into the labeled corpus loses because it changes the training corpus hash, the full corpus counts and the stratified holdout `advisor_validate` carves from that corpus (`runtime/handlers/advisor-validate.ts:327`, `:677`), and it needs a new gold label, since `none` is the label the source fixture dropped. The deletion survives a regeneration: the builder already omits the id, because its source case was renamed `direct-alias-cli-codex` in `38e2577a55`. A rewrite would bring the same three words back under that id with gold `cli-external-orchestration`, beside 15 other new rows, and that resealing needs its own decision.
- **What moves.** OBSERVED from the capture code: `holdout_top1` counts the sealed file only (`capture-scorer-eval-baseline.mjs:191`, `:232`), so its total drops by one, and its correct count stays when the row is a miss and drops by one when it is a hit. `holdoutSha256` and `capturedAtSha` change. The full corpus reads `labeled-prompts.jsonl` only (`:179-189`) and the delegation bucket reads the fixture directly (`:204-209`), so neither moves. The scoring date stays only when the recapture runs without `SPECKIT_EVAL_BASELINE_SCORING_DATE` (`:85-105`). That matters because six other readers replay `capturedAt` from this file: the command capture (`capture-command-routing-baseline.mjs:115`), `doctor-phrase-reach.cjs:153-157` and four advisor tests. One of them, `tests/scorer/ambiguity-slice.vitest.ts:114-118`, also reads `ambiguity_top1`, which this phase leaves alone. No live doc quotes the sealed totals. `changelog/v0.17.30.0.md:28` is a release note, `references/scoring/validation-baselines.md:44` names its table a dated 2026-07-30 snapshot, `feature-catalog/cli-surface/advisor-validate.md:45` describes the stratified holdout of the labeled corpus and `../spec.md:145` is phase 1's handoff criterion. All four stay.
- **Whether other rows leak.** OBSERVED at planning: with the review's normalisation (a full match, or any eight-word run for a row of eight words or more), only `suppressed-codex-abstain` hits a committed data file the scorers load at three words or more. Two sealed rows under three words, `P1-ABSTAIN-001` with one word and `P1-PHRASE-001` with two, hit data files, where a one- or two-word prompt matches any value holding that word. Six more sealed rows hit hand-written phrase rules in the scorer source only. No command holdout row hits anything. The review's own check covered files its lineages wrote, not the scorer source, and left out three rows it judged too short or not distinct (`../review/review-report.md:425`). The literal stop rule ("more rows") would therefore stop this phase at T002, so Q6 asks the operator which hits count.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A. Run the count-only leak check before any edit and apply the stop rule the operator chose in Q6 (T002).
- B. Delete the line of `suppressed-codex-abstain` from the sealed file and recapture the scorer eval baseline with the scoring date unchanged (T003, T004).
- C. Say in the routing-accuracy README how a sealed row is retired (T005).
- D. Rerun the gates and the leak check, check the boundaries and set parent map row 18 to Complete at close-out (T006 to T009, coordinator).

### Out of Scope
- Editing `skill-graph.json`, `cli-external-orchestration/graph-metadata.json`, its `hub-router.json` or its `mode-registry.json`. The text is the cli-codex alias both scorers route by, and the decision retires the row, not the alias.
- Changing `build-holdout.mjs` or resealing the holdout with `--write`, which would write 81 rows at planning and bring the same text back as `direct-alias-cli-codex`.
- Retiring any other row the leak check names. That is a new operator decision.
- The classifier census pin of 70 rows in `replay-helpers.mjs`, stale since 2026-10-11 and owned by the `cli-classifier` benchmark.
- A permanent leak gate in the independence test that fails when a sealed row's text appears in a scorer input.
- The four docs that quote earlier holdout numbers as history.
- `AGENTS.md`, every `package.json` and any phase folder other than this one. The parent `spec.md` changes only in T009.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` | Modify | Delete the one line whose `id` is `suppressed-codex-abstain` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify, generated | Recaptured by `capture-scorer-eval-baseline.mjs --write`, coordinator only |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modify | The `holdout-prompts.jsonl` row says the file is edited by hand and how a row is retired |
| `../spec.md` | Modify | Row 18 status at close-out, coordinator only |

The restraint pass: no code, test, option, helper or module is added or changed. The ratchet's hash check is the test that fails after the deletion and passes after the recapture, so no new test earns a place. A test pinning the retired id could never fail for a real reason, because no source emits that id any more. The README sentence is the one addition, because the row's claim that `build-holdout.mjs` writes the file has been false since `d93100d57b` and this retirement repeats the hand edit, so a reader following it would reseal 81 rows. The six planning probes live in `scratch/planning/` and ship nothing.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The line whose `id` is `suppressed-codex-abstain` is gone from the sealed file and no other byte of it changed: `git diff --numstat` reads one line deleted and none added, and the row count is the before count minus one. |
| REQ-002 | `scorer-eval-baseline.json` is recaptured with `SPECKIT_EVAL_BASELINE_SCORING_DATE` unset. `capturedAt`, `corpusSha256`, `ambiguitySha256` and every metric except `holdout_top1` equal their before values. `holdoutSha256` equals the trimmed file's hash. `holdout_top1.total` is the before total minus one. `holdout_top1.correct` is the before value when T001 recorded the row as a miss and the before value minus one when T001 recorded it as a hit. `holdout_top1.accuracy` is correct divided by total, rounded to four places. |
| REQ-003 | The ratchet, the independence gate and the capture-date test pass, the full advisor suite reports 0 failed and the command capture's four floor lines equal their before lines. |
| REQ-004 | The leak check runs before any edit and prints ids, paths and counts only, its positive control finds every row in its own file and the phase stops at T002 when the stop rule the operator chose in Q6 fires. |
| REQ-005 | No task prints holdout prompt text, runs a capture with `--misses` or shows the sealed file's content through `git diff`, `git show` or `git log -p`. Outside this folder only the three files in section 3 and parent map row 18 change, and the builder, the fixtures, the graph files, `AGENTS.md` and every `package.json` are unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The routing-accuracy README row for `holdout-prompts.jsonl` says the file has been edited by hand since it was sealed and that a sealed row is retired by deleting its line and recapturing the baseline. |
| REQ-007 | After the retirement, the leak check's data line at three words or more prints `[]` and its two other summary lines equal their T002 readings. |
| REQ-008 | No file this phase wrote holds holdout text: the leak check's `--paths` mode over this folder, the README and the baseline prints `rows with a hit: 0 []`. |
| REQ-009 | Parent map row 18 reads Complete at close-out. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/after.txt` shows the holdout total one below `scratch/before.txt`, the correct count its rule gives, every other metric equal and the scoring date unchanged.
- **SC-002**: The three parity tests and the full advisor suite report 0 failed, and the four command capture floor lines equal their before lines.
- **SC-003**: `scratch/leak-after.txt` prints `rows with a hit in data, three words or more: []` and the `--paths` check prints `rows with a hit: 0 []`.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 016 and 017 are committed first and edit the README and may recapture the baseline | A before number or a README anchor moved | T001 records the numbers after both and requires a green ratchet. T005 marks itself `[B]` when its quoted text is gone |
| Dependency | The operator's answer to Q6 | Answered on 2026-11-13: the eight rows found at planning are an advisory and do not stop the phase | T002 applies the answered rule |
| Risk | The recapture absorbs an unrelated scoring change | High: a drift would be pinned as the new normal | T001 requires the live metrics to equal the committed ones before any edit, and T004 requires every metric except the holdout to equal its before value |
| Risk | A worker prints prompt text while deleting the row | High: the row it shows is sealed text | T003 uses one `grep -v` that prints nothing, and every verify reads the file through `--numstat`, a count or a `jq` filter that deletes the prompt |
| Risk | The recapture moves the scoring date | Med: six readers replay `capturedAt` and the command floors would shift | T004 unsets `SPECKIT_EVAL_BASELINE_SCORING_DATE` and checks `capturedAt` equals its before value |
| Risk | A later reseal brings the same text back as `direct-alias-cli-codex` | Low: only a deliberate `--write` does it, and the ratchet hash then forces a recapture | The README row says the file is edited by hand. A leak gate is out of scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The leak check reads 150 files at planning and finished in 0.34 s, so T002 and T007 add no measurable time to the phase.

### Security
- **NFR-S01**: No task prints, quotes or copies holdout prompt text, and every probe holds it in memory only.
- **NFR-S02**: No task starts a model session or writes under the home folder, and each probe removes the temporary folder it makes.

### Reliability
- **NFR-R01**: The deletion and the recapture land in one commit, because the ratchet pins the file's hash and either half alone fails it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The row is a hit at T001 instead of a miss: the correct count drops by one and the accuracy follows the rule in REQ-002.
- Phase 016 recaptured the baseline on a new scoring date: T001 records that date, and T004 keeps it.
- The ratchet is red at T001: the phase stops, because a recapture would pin the red state.
- Phase 016's new intent phrases put another sealed text into a data file: T002's comparison with the planning reading stops the phase.
- The `grep -v` matches nothing because a phase before this one already removed the row: T003's first count prints 0 and the task marks itself `[B]`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Three files outside this folder: one deleted data line, one generated baseline and one README row |
| Risk | 8/25 | The baseline is a shared gate and the sealed file holds text no task may print |
| Research | 9/20 | The row's origin, its readers, the regeneration path and the other rows were traced by six read-only probes |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

- Q1. Retire `suppressed-codex-abstain`? Decision (operator, 2026-11-13, `../goal.md` line 176): yes, in this packet, as phase 018, with every baseline that counts it recaptured.
- Q2. Does the graph text change? Decision (operator): no. The decision retires the row, not the alias, and leaving the text breaks nothing.
- Q3. How is the row retired? Decision: delete its line (Recommended). It is the convention the file already follows, it needs no code and the builder already omits the id. A retired marker and a move into the labeled corpus lose for the reasons in section 2.
- Q4. Does the builder change? Decision: no (Recommended). It already omits the id, and a rewrite is a resealing outside this phase.
- Q5. Does the classifier census pin of 70 rows change? Decision: no (Recommended). It was stale before this phase, it belongs to the `cli-classifier` benchmark and no test reaches it.

- Q6. Which leak-check hits stop the phase? Answered by the operator on 2026-11-13: only `suppressed-codex-abstain` is retired. The phase stops only when a row other than `suppressed-codex-abstain` hits a data file at three words or more, or when any summary line names a row its planning reading in section 2 did not. The two short rows `P1-ABSTAIN-001` and `P1-PHRASE-001` and the six source-only rows are recorded as an advisory for a separate decision. The reason: a one- or two-word prompt matches any value holding that word, and a hit in hand-written phrase rules is a question about how the regression rows were tuned.

### Open

- None.
<!-- /ANCHOR:questions -->
