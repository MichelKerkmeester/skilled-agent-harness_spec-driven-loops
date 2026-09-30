---
title: "Goal: Phase 30: fanout-merge-shadow-record"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout shadow pair goal"
  - "score-fanout-pairs completion criteria"
  - "pair judgment keep rule"
  - "research r15 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record"
    last_updated_at: "2026-09-30T07:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build committed as fe84dd1899, closed at its label gate"
    next_safe_action: "Operator: name a pair-sheet path, then label 40 pairs and 10 cross-body"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-030-fanout-merge-shadow-record"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A pair-sheet path outside the repository, 40 labeled pairs with 10 cross-body, then a live Deem run and a Jev run on the operator's yes"
      - "The six recorded P2 findings"
    answered_questions: []
---
# Goal: Phase 30: fanout-merge-shadow-record

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem same-or-different judgment on fan-out finding pairs near the merge's title line or across different bodies matches the operator's labels better than the merge's own decision, while the merge stays unchanged and its reader stays an open question.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-fanout-pairs.cjs` and `runtime/tests/unit/score-fanout-pairs.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, fanout catalog and playbook. `fanout-merge.cjs` is read through its exports and never edited |
| D2 | Pairs are cross-lineage findings within one tracked fan-out run. `near-line`: equal body keys and title overlap from 0.05 up to 0.30. `cross-body`: different body keys and overlap of at least 0.5 |
| D3 | The baseline is the merge's own collapse decision, the better of dedup on and dedup off on the labeled pairs, dedup off on a tie. Above 90 percent right it prints `no headroom` |
| D4 | Gold is the operator's `same` or `different` label. Fewer than 40 labeled pairs or 10 cross-body ones stops every arm. No model writes a label |
| D5 | Keep rule per backend column, in order: at least 90 percent of labeled pairs measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and a flip rate of at most 0.10 across the pair orders |
| D6 | One `noul` per pair: Deem in orders AB and BA, Jev AB, BA and AB. Jev receives only registries published at `origin/main`. Every verdict names its reader, `none named` until the operator names one |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` without `--jev` or `--deem` exits 0 and prints `runs:`, `pairs:`, `class near-line:`, `class cross-body:` and `merge decisions:`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] `--write-pair-sheet` with a path inside the repository exits 2 and writes nothing. With `--jev --deem --out <dir>` and a labels file of 39 pairs the script prints `stop: fewer than 40 labeled pairs` and both stub logs stay empty. Past the gate a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`, and a stub `jev` whose `auth status --provider official` exits 3 gives `jev arm skipped: no credential`
- [x] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` exits 0 with at least 22 passed tests and 0 failed
- [x] The phase closed on a `stop: fewer than` line or `no headroom`, or one live `--deem --out <dir>` run printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` ending `reader=none named` with its commit pair
- [x] `git diff --stat` on `fanout-merge.cjs` is empty, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
- [x] `validate_document.py` exits 0 on every changed skill doc, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R15.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-30: the design and the briefs in `scratch/w4-build/briefs/`, run by the CLI executors of parent D5. The design ran on DeepSeek V4.1 Flash through Cline after Devin's daily quota ran out; code steps c1 to c9 and every code fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`, each checked by the test file, and the docs d1 to d6 ran on Pi MiMo at `high`, written from `scratch/w4-session/docs/facts.txt`. Committed as `fe84dd1899`, 16 files, not pushed. Source: `SE` sections 1, 3 and 5 |
| Baseline | Done | The runtime suite after 029 held 127 files and 2,489 tests; the final suite holds 128 files and 2,531 tests, this phase's one file and its 42 tests more, with no failure. Source: `SE` section 2 |
| Session verification from the final state | Done | With logging stubs first on `PATH`: the default run exits 0 in 1 s with `runs: research=57 review=46`, `pairs: research=19 review=105`, `class near-line: research=0 review=0`, `class cross-body: research=19 review=105`, the four `merge decisions:` lines, the `title rule:` and `body fields:` lines, `merge undecidable: 12` and `stop: fewer than 40 labeled pairs`; the stub log was never written. `--deem --out <dir>` and `--jev --out <dir>` each add only `<backend> arm skipped: label gate`, call no stub and write only `report.json`; `--deem` without `--out` exits 2 before any call; `--write-pair-sheet ./.pair-sheet.jsonl` exits 2 with `refusing to write the pair sheet inside the repository` and writes no file, and outside the repository the sheet holds 60 rows. `git status --porcelain` was equal before and after, the key grep exits 1, and `fanout-merge.cjs` is unchanged. Source: `SE` section 2 |
| Tests | Done | `score-fanout-pairs.vitest.ts` prints `Tests 42 passed (42)`, against the floor of 22, and the runtime suite prints 128 files passed and 2,531 tests passed with no failure. Source: `SE` section 2 |
| Label gate stop recorded | Done | The final-state default run printed `stop: fewer than 40 labeled pairs`, the accepted end of this build under parent D4 and parent criterion 2. Source: `SE` sections 2 and 6 |
| Docs and packages | Done | Eight docs landed (briefs d1 to d6 plus the three new files) and `validate_document.py` exits 0 on each; `sync-skills-hermes.cjs` wrote 1 of 72 copies and the session staged the Hermes `SKILL.md`; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3`; `parent-skill-check.cjs` printed `OK, 0 warnings`; the catalog package reported `violations=176` with one new `packet_history_metadata` warning on the F059 entry, a line every runtime entry carries; the playbook package printed `PASS ... scenarios=58 ... violations=0`, one scenario more than 029's 57; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`. Source: `SE` sections 1 and 4 |
| Review and fixes | Done | Code, read by Pi MiMo: `VERDICT: FAIL`, 1 P0, 1 P1 and 4 P2; c11f and c11g closed the P0, c11h and c11i the P1, and the recheck printed `VERDICT: PASS`. Docs, read by DeepSeek on Cline: `VERDICT: FAIL`, 2 P1 and 4 P2; f1 (Pi MiMo) closed both and the recheck printed `VERDICT: PASS` with REQ-011 met across all six docs it names. The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `fe84dd1899` feat(deep-loop): the script, its test, the eight docs, the Hermes copy and the three recompiled contracts, 16 files with both re-minted activation manifests, not pushed; the staged set passed the key grep (exit 1) and after the commit `compiled-route-guard.cjs` lists `system-deep-loop` fresh. The trigger index follows in its own commit. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-30: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, corrected the executor roster, the changelog premise and the 027 to 029 status, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. A pair-sheet path outside the repository, at least 40 labeled pairs with 10 cross-body, then a live Deem run and a Jev run on the operator's yes. 2. The six P2 findings below. 3. A served form needs a later phase and the operator's call. 4. A reader for a shadow record stays unnamed. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam drift (2026-09-29) | Phase 015's `7de30fb16f` moved the merge. The record's `fanout-merge.cjs:341` (the 0.15 line) is now `:392` (`TITLE_DISTINCT_OVERLAP_THRESHOLD`), and `:348-351` (the body-key gate before the title check) is now `:399-402` (`nearDuplicateMatches`). The body key is `nearDuplicateContentKey` at `:345-354`, title overlap is `:376-383` |
| Dedup is opt-in | The near-duplicate pass runs only when `SPECKIT_FANOUT_NEAR_DUP_DEDUP` or `enableNearDuplicateDedup` is set (`fanout-merge.cjs:504-510`). A default merge never reaches the 0.15 line. The baseline therefore reads both decisions |
| Corpus preview | Counted by this leaf over `git ls-files`: 59 research and 46 review fan-out runs with two or more lineage registries. 230 research lineage registries hold 4,396 findings (1,022 with a merge body field, 579 with a title) and 225 review ones hold 1,299 (401 with a body field, 1,243 with a title) |
| Executor substitution | The design ran on DeepSeek V4.1 Flash through Cline after Devin's daily quota ran out. Code steps c1 to c9 and every code fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`, each checked by the test file; the docs d1 to d6 ran on Pi MiMo at `high`. Source: `SE` section 1; `notes.md` |
| Design step D7 did not run | Ruling 3 runs the version pass only when `parent-skill-check.cjs` reports `13b-version`, and it reported `PASS: 13b-version: SKILL.md version 3.0.1.0 matches the newest changelog entry`, so the hub version stays as it was. Source: `SE` section 1; `../w4-build/rulings.md` 3 |
| Fix c10f (maxBuffer) | A session finding carried from 033: `spawnSync` stops at its 1 MB `maxBuffer` default, and `git ls-files -z` prints 15.7 MB on this repository, so the default census on the real tree failed. c10f sets `maxBuffer` on the listing call; the check exits 0. Source: `SE` section 1; `notes.md` |
| P0 fix c11f and test c11g | The code review found `mergeDecision` read a one-side drop as `same`. c11f asks the merge about each side alone first and returns `undecidable` when either side does not survive alone, and c11g adds the test. On the real tree all nine `same` decisions were one-side drops: the cross-body review line moved from `same=9` to `same=0` under both settings, and `merge undecidable` from 3 to 12. Source: `SE` section 3 |
| P1 fix c11h and c11i (test only) | No test ran the requalify lines. c11h and c11i add one test per arm, with a stored identity that differs and one that does not. Source: `SE` section 3 |
| Docs P1 fix f1 | The docs review found the hub `SKILL.md` sentence and the `runtime/scripts/README.md` row named neither the gate nor a switch. f1 (Pi MiMo) names the 40-pair and 10-cross-body gate, both stop lines, `--jev`, `--deem` and `--out <dir>` in both; the recheck printed `VERDICT: PASS` with REQ-011 met. Source: `SE` section 3 |
| Proof scope for the label fixtures | The 39-row fixture, the 40-row cross-body fixture and the past-gate stub-backend and exit-3 runs need label files the session does not write (parent D4). The tests cover them; the session ran the pair sheet inside and outside and the K=0 stop. Source: `SE` section 2 |
| Census counts at close | The final census reads the live tree: 57 research and 46 review runs, 19 research and 105 review pairs, all 124 pairs cross-body, 0 near-line, 2,233 research and 1,039 review findings across the walked runs, and 12 undecidable pairs. The planning preview counted every tracked lineage registry, so its totals are larger. Source: `SE` section 2; `facts.txt` |
| P2 findings recorded, not chased (parent D5) | 1. `C = expected * M` leaves out the measured calls of a partly measured pair, where the Keep Rule says C is the column's measured calls (both reviews). 2. `nearestRank` is exported with no caller and no test. 3. The test helper `labeledFixture` is never called. 4. The Jev withholding check proves the registry paths exist at `origin/main`, but the text sent is read from the working tree, so a tracked registry edited locally sends unpublished text (both reviews). 5. The stub-backend skip test drives `deemGate` alone instead of comparing census bytes around it. 6. The Jev withholding guard reads `registries.length > 0` where both lookups must resolve, a case `main` cannot reach. Source: `SE` section 3 |
| Completion rows amended at close | T016 is an operator item: the pair sheet goes to a path the operator names outside the repository. The `tasks.md` completion rows now carve out T016 beside T017, as parent D4 leaves the sheet path and every label to the operator. No goal criterion wording changed. Source: this closure pass; parent `goal.md` D4 |
| No build-evidence.md | The build left no `../w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header; this closure pass |
| Premise corrections at close | `spec.md`'s Status, description, handoff row, deliverables and Files to Change rows now record the build; `plan.md`'s roster states parent D5 and its dependency row records 027 to 029 as Complete; `tasks.md`'s notation carries the closure record. Recorded by this closure pass |
<!-- /ANCHOR:log -->
