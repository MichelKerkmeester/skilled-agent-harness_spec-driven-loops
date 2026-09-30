---
title: "Tasks: Phase 33: validator-residue-flagger"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "residue flagger tasks"
  - "score-residue-flagger tasks"
  - "residue flagger verification"
  - "residue flagger label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 33: validator-residue-flagger

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

`S` is `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`, `T` is `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` and `L` is `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl`. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds ran in number order. Closure (2026-09-29): built and committed as `c13e968a58`, 13 files with the recompiled contract, and closed at its label gate. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the briefs in `scratch/w4-build/briefs/` and the session facts in `scratch/w4-session/docs/facts.txt`. `L` was never written: `--draw --seed 20260929` exits 2 with `draw needs 25 resolvable rows in correctness, found 0`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the owner's contracts before writing: `deep-review/SKILL.md`, `scripts/README.md`, `scripts/tests/README.md`, `assets/prompt-pack-iteration.md.tmpl`, `references/state/state-outputs.md`, `cli-classifier/cli-deem/SKILL.md` and `cli-classifier/cli-usage/SKILL.md`. Route the code write through sk-code's OpenCode route (`.skilled/skills/system-deep-loop/deep-review/`). Evidence: design section 1 rechecked each owner contract (`deep-review/SKILL.md:306-313`, `assets/prompt-pack-iteration.md.tmpl:53`, `:113`, `:157`, `cli-deem/SKILL.md:49-57`), every code brief routes the write through sk-code's OpenCode route, and the c1 run reported `ARTIFACT: sk-code` with the comment hygiene check clean on both files (`../w4-build/logs/c1p.last.txt`; `SE` sections 1 and 2)
- [x] T002 Record the baseline: `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/`, output and exit code saved before any change (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/`). Evidence: `../w4-build/baseline/node-test-before.txt` holds `tests 1`, `pass 1`, `fail 0`, captured before any phase file existed (`SE` section 1)
- [x] T003 [P] Build the test fixtures inside `T`: a temp git repository with two commits, review folders holding three finding-table header shapes and one unrecognized shape, cited documents, an untracked review file and a `.env` location, plus stub `jev` and `cli-deem` binaries that log one line per call (`T`). Evidence: `T` builds that fixture and mounts the stubs first on `PATH`, and its 36 cases pass (`node --test`), with the folder run printing `tests 37`, `pass 37`, `fail 0`, the baseline's 1 plus this phase's 36 (`SE` sections 1 and 2; design section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Corpus walker and table parser: the In Scope path rule over `git ls-files`, header-driven reading of severity, dimension and location, skipped tables counted per header shape (`S`). Spec REQ-002. Evidence: `T` covers `corpus walk`, `parser three shapes`, `parser skipped shape` and `dimension mapping`; the final-state census reads `files=5862 tables=115 rows=796 skipped=525` and prints six `header` lines (`SE` section 2; `facts.txt`). The corpus walks HEAD's tree, not the index, after fix c8f
- [x] T005 Commit and location resolver: the first parent of the commit that added the review file, a tracked `.md` line at that commit, `.env` refused, unresolvable rows counted and dropped (`S`). Spec REQ-003. Evidence: `T` covers `commit resolution`, `untracked review file`, `location resolves`, `location dropped` and `refused .env`; the final-state census prints `resolvable: correctness=0 traceability=7 refused=125 dropped=664`; c7h resolves a file's reviewed commit only when it holds a parsed row, and c8f reads HEAD's tree so a staged review file cannot abort a run, pinned by c8g's `staged review file` (`SE` sections 1 and 2; `facts.txt`)
- [x] T006 Census output: rows per severity, per dimension and per header shape, the skipped tables, the resolvable correctness and traceability rows and the HEAD commit, zero calls and no text (`S`). Spec REQ-001, REQ-002. Evidence: the final-state default run exits 0 in 134 s with `census: commit=c91420429b7e files=5862 tables=115 rows=796 skipped=525`, the severity (`P0=8 P1=394 P2=394`) and dimension (`correctness=271 security=51 traceability=258 maintainability=212`) lines, six `header` lines, `resolvable: correctness=0 traceability=7 refused=125 dropped=664` and 525 `census skipped:` lines, and the stub log was never written (`SE` section 2; `facts.txt`)
- [x] T007 `--draw --seed <n>`: 100 rows, 50 positives and 50 negatives, 25 per category each, 20-line spacing, hashes and no text, the category shortfall exit and refusal to overwrite a label (`S`, `L`). Spec REQ-004. Evidence: `T` covers `draw reproducible`, `draw spacing`, `draw refuses labels` and `draw shortfall`; on the real tree `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0` and writes no file, the shortfall exit this task names (`SE` section 2)
- [x] T008 Baseline and label gate: flag-nothing's accuracy and the `defect` share, `stop: fewer than 100 labeled rows`, `margin: 0.10`, the `keep rule:` line and the `no headroom` and `underpowered` lines (`S`). Spec REQ-005, REQ-006. Evidence: the final-state default run prints `margin: 0.10`, the keep rule line and `stop: fewer than 100 labeled rows`; `T` covers `label gate 99`, `default zero calls`, `baseline and headroom`, `no headroom` and `underpowered` (`SE` sections 1 and 2)
- [x] T009 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with its category's fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012. Evidence: `--deem --out <dir>` with a stub backend adds only `deem arm skipped: stub backend` after one `cli-deem health` call and writes no file; `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded` before any call; `T` covers the gate pass, the stub-backend skip, the exit-4 pair change, `requalify`, `--out` required and `deem keep` (`SE` section 2; `notes.md`)
- [x] T010 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012. Evidence: `--jev --out <dir>` with a stub whose `auth status --provider official` exits 3 prints the identity line and `jev arm skipped: no credential` after `jev --version` and the auth check, and writes no file; `T` covers the gate pass, the `no credential` skip, one `--provider` per call and exit 3 after the gate (`SE` section 2; `notes.md`)
- [x] T011 Verdict per column on stdout and in `report.json`: the five conditions in order, integer counts, an exact p, the Brier score printed beside it and both `requalify` lines (`S`). Spec REQ-006, REQ-013. Evidence: `T` covers `verdict keep`, `verdict kill precision`, `verdict stop coverage`, `verdict stop margin` and `requalify`; no real run printed a verdict, since every run stopped at the label gate (`SE` sections 2 and 3)
- [x] T012 [P] README rows for the script, the labels file and the test (`.skilled/skills/system-deep-loop/deep-review/scripts/README.md`, `scripts/tests/README.md`). Evidence: both rows landed in `c13e968a58` (one line each), and `validate_document.py --type readme` exits 0 on both (`notes.md`; the d8a and d8b logs; `SE` sections 1 and 5)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` exits 0 with at least 18 passed and 0 failed, one happy path and one edge case per surface listed in spec REQ-014 (`T`). Evidence: the final-state folder run prints `tests 37`, `pass 37`, `fail 0`, this phase's own 36 cases against the floor of 18, and the recheck recorded `tests 36`, `pass 36`, `fail 0` for the test file alone (`SE` sections 2 and 3)
- [x] T014 One zero-call run on the real tree with stub binaries first on `PATH`: record the census and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`). Evidence: the final-state default run exits 0 in 134 s with the census, the fixed-rule lines and `stop: fewer than 100 labeled rows`; the stub log was never written and `git status --porcelain` was equal before and after (`SE` section 2). The census and stop line are in `goal.md`'s log
- [B] T015 Run `--draw --seed <n>` on the real tree, record the seed and the counts per category, and commit the drawn file through the parent session. A category shortfall goes to the operator before any label (`L`). Blocked on the corpus: `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0`, writes no file and calls no stub, so `L` was never drawn (parent D4; `SE` sections 2 and 6)
- [B] T016 The operator labels all 100 rows `defect` or `clean` for each row's category. No model writes a label. Blocked on the operator (`L`). No operator label exists, so the phase closed on the label gate stop (parent D4; `SE` sections 2 and 6)
- [B] T017 After T016, one zero-call run. Unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`). Blocked on T016: the zero-call run stopped at the gate, so no `--jev` or `--deem` run started and no verdict line exists (parent D4; `SE` sections 2 and 6)
- [x] T018 deep-review's `SKILL.md`, `README.md`, the next changelog file, one catalog entry in `review-dimensions` with its index row and one playbook scenario with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/deep-review/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/system-deep-loop/deep-review/`). The build wrote the docs from `docs/facts.txt` before any arm run, as design step 10 sets, so no doc names a verdict, and it wrote no `verdict` line. Evidence: the nine docs landed in `c13e968a58`: `SKILL.md` and its Hermes copy at `version: 1.11.0.37`, `README.md`, `changelog/v1.11.0.37.md`, the catalog leaf and its index block, the DRV-069 playbook scenario and its index rows (briefs d8a to d10h; `SE` section 4). `validate_document.py` exits 0 on each; fix f1 corrected the catalog leaf's run wording, the changelog's tracked-file wording and the playbook leaf's version, and f2 set the playbook census to 56 scenarios and the catalog overview to 5 features (`SE` section 3)
- [x] T019 `validate_document.py` exits 0 on every doc T012 and T018 changed, the key grep of spec REQ-009 returns no match and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`). Evidence: all nine docs are `VALID`; the key grep exits 1; `git status --porcelain` was equal before and after each run, and the commit holds the 13 Files to Change and generated paths, with no labels file (parent D4) (`SE` sections 2, 4 and 5; `notes.md`)
- [x] T020 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and the deep-review tests fail nothing beyond T002's baseline. Then the parent session commits with path-scoped commits (parent goal D5). Evidence: the code review by Pi MiMo printed `VERDICT: PASS` with 3 P2 (MiMo wrote c1, so it reviewed DeepSeek's steps); the docs and c1 review by DeepSeek printed `VERDICT: FAIL` with 2 P1 and 4 P2, all fixed by c8f, c8g, f1 and f2 and closed by two rechecks `VERDICT: PASS`; the deep-review folder test prints `tests 37`, `pass 37`, `fail 0`, the baseline's 1 plus this phase's 36; committed as `c13e968a58`, 13 files, not pushed (`SE` sections 1, 2, 3 and 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T015 to T017 left `[B]` with the label gate stop line recorded as the phase's result
- [x] No `[B]` blocked tasks remaining other than T015 to T017, which wait on the operator's labels and a corpus with resolvable correctness rows (parent D4)
- [x] Each backend whose gate passed printed a verdict line, or the zero-call run printed `no headroom`, `underpowered` or the label gate stop line; the final run stopped at the label gate instead, since no labels exist (parent D4), and the stop line is in `goal.md`'s log
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../007-classifier-deep-research/research/research.md:886-905` (R26), `:460-480` (validators) and `:113` (K9)
<!-- /ANCHOR:cross-refs -->

---
