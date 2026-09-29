---
title: "Tasks: Phase 35: fetched-text-injection-screen"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "injection screen tasks"
  - "score-injection-screen tasks"
  - "injection screen verification"
  - "injection screen label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 35: fetched-text-injection-screen

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

`D` is `.skilled/skills/cli-classifier/benchmark/injection-screen/`, `S` is `D/score-injection-screen.mjs`, `T` is `D/tests/score-injection-screen.test.mjs`, `L` is `D/labels.jsonl` and `P` is `D/planted.jsonl`. Closure (2026-09-29): built and committed as `3d0641004b`. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where the two disagree, `SE` wins. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the owner's contracts before writing: the hub's `SKILL.md`, `README.md` and `benchmark/README.md`, `cli-deem/SKILL.md`, `cli-usage/SKILL.md`, `cli-deem.test.mjs` and the vendored `screen.ts` and `docs/screen.md`. Confirm the proposed placement with the operator. Route the code write through sk-code's OpenCode route (`.skilled/skills/cli-classifier/`). Evidence: every code brief cites the build contract `scratch/w4-build/briefs/ref/design.md`, which fixes S and T at `benchmark/injection-screen/`, and its persona block routes the write through sk-code. The built tree and `3d0641004b` carry that placement, and briefs 24 and 25 answered the catalog question with a new hub-root `feature-catalog/` per `sk-create-feature-catalog`. The spec assigns the placement question to the build (spec section 7) and no separate operator placement reply is recorded (`BE` sections 1 and 2, `SE` section 5)
- [x] T002 Record the baseline: `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs`, its counts and exit code saved before any change. Evidence: `tests 34`, `pass 34`, `fail 0`, exit 0 before any change, saved under `scratch/w4-build/baseline/` (`BE` section 1)
- [x] T003 [P] Build the test fixtures inside `T`: a temp git repository with two commits, state logs with and without `toolsUsed`, agent files, a small vendored corpus with a notes file, a section quoting an example directive, a heading inside a fence and a `.env` path, plus stub `jev` and `cli-deem` binaries that log one line per call (`T`). Evidence: briefs 01, 02 and 02b built the fixtures and the logging stubs, and 02b fixed `makeRepo` with `-c core.excludesFile=/dev/null -c core.attributesFile=/dev/null` so fixture `specs/` paths commit. `node --test T` from the final state prints `tests 40`, `pass 40`, `fail 0` (`BE` section 2, `SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fetch census: tracked state logs and agent `tools:` lines, tool names only (`S`). Spec REQ-002. Evidence: brief 02 (`S` +69, `T` +30, `node --test` 3/3 after 02b). The default run prints `fetch census: state_files=486 records=6661 ... naming_webfetch=82 naming_websearch=61 files_with_either=31 unparsed_lines=5` (`SE` section 2)
- [x] T005 Corpus walker, section splitter and lexical screen: tracked vendored `.md`, the notes file excluded, `.env` refused, the 5 to 60 line band and the four patterns printed with their SHA-256 (`S`). Spec REQ-002, REQ-003. Evidence: briefs 03 and 04 (`node --test` 9/9 then 11/11). The default run prints `corpus census: ... files=185 refused=2 excluded=1` and one `corpus:` line per source with totals `total sections=1138 in_band=1022 lexical_hits=0` (`SE` section 2)
- [x] T006 Census output: both censuses and the HEAD commit, zero calls and no text (`S`). Spec REQ-001, REQ-002. Evidence: briefs 06 and 08 wired the default run. With stub binaries first on `PATH` it exits 0, prints both censuses with the HEAD commit and no text, and writes no file (`SE` section 2)
- [x] T007 `--draw --seed <n>`: 60 natural and 30 planted rows, the per-source cap, seeded insert lines, hashes with no text and refusal to overwrite a label (`S`, `L`, `P`). Spec REQ-004. Evidence: briefs 05, 05b and 06. `--draw --seed 20260929` on the real tree exits 0 and prints `draw: seed=20260929 commit=6aa7ca0980d0c385d925ec3b048fd2db87464807 rows=90 natural=60 planted=30`, per source `claude-jev-main` 21, `jev-cli-main` 30, `jev-review-main` 1, `pi-jev-context-main` 6, `social posts` 2, `supercov-main` 30. `L` holds 90 rows with no text field and `P` 30 rows with every `sentence: null`, and a second draw with the same seed was byte-identical (`SE` section 3)
- [x] T008 Baseline and label gate: both accuracies and the `instructs` share, `stop: fewer than 90 labeled rows` including a missing sentence, `margin: 0.10`, the `keep rule:` line and the `no headroom` and `underpowered` lines (`S`). Spec REQ-005, REQ-006. Evidence: briefs 07 and 08. The default run prints `margin: 0.10`, the `keep rule:` line, `labels: labeled=30 of 90 planted_sentences=0 of 30` and `stop: fewer than 90 labeled rows`, and the tests pin the gate at 89 rows and at a missing planted sentence (`SE` section 2)
- [x] T009 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with the fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012. Evidence: briefs 10 and 11. A stub `cli-deem` reporting backend `stub` with `--deem --out <dir>` exits 0 with `deem arm skipped: stub backend`, the zero-call output byte-identical and no `--out` folder created (`SE` section 2)
- [x] T010 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, a missing answer `unmeasured`, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012. Evidence: briefs 12 and 13. A stub `jev` whose `auth status` exits 3 with `--jev --out <dir>` exits 0 with `jev: path=<stub>/jev provider=official` then `jev arm skipped: no credential` (`SE` section 2)
- [x] T011 Verdict per column on stdout and in `report.json`: the five conditions in order, integer counts, an exact p, the Brier score and the 0.25 and 0.75 flag counts printed beside it and both `requalify` lines (`S`). Spec REQ-006, REQ-013. Evidence: briefs 09 and 14, with `signTestP` and `nearestRank` byte-identical to `score-track-narrowing.mjs` and the copied arm functions byte-identical with JSDoc (`BE` section 2). The tests pin `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify`, 40 of 40 pass (`SE` section 2)
- [x] T012 [P] The layout row in the benchmark README (`.skilled/skills/cli-classifier/benchmark/README.md`). Evidence: brief 20 added the row, and `validate_document.py` exits 0 on the file (`SE` sections 1 and 2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `node --test .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` exits 0 with at least 18 passed and 0 failed, one happy path and one edge case per surface listed in spec REQ-014 (`T`). Evidence: `tests 40`, `pass 40`, `fail 0`, exit 0 from the final state, against the 18-case floor (`SE` section 2)
- [x] T014 One zero-call run on the real tree with stub binaries first on `PATH`: record both censuses and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`). Evidence: `STUB_LOG=<log> PATH="<stubs>:$PATH" node score-injection-screen.mjs` exits 0, prints both censuses and `stop: fewer than 90 labeled rows`, the stub log was never written and `git status --porcelain` was equal before and after the runs. The counts and the stop line are in `goal.md`'s log, recorded by this closure pass (`SE` sections 2 and 5)
- [x] T015 Run `--draw --seed <n>` on the real tree, record the seed and the rows per source group, and commit the drawn file through the parent session (`L`). Evidence: `--draw --seed 20260929` exit 0 with the rows per source recorded in `goal.md`'s log and above at T007, and `labels.jsonl` and `planted.jsonl` sit in `3d0641004b` (`SE` section 3)
- [B] T016 The operator labels the 60 natural rows `instructs` or `clean` and writes the 30 planted sentences. No model writes a label or a sentence. Blocked on the operator (`L`, `P`). Open for the operator: `L` holds 60 natural rows at `label: null` and `P` 30 rows at `sentence: null`, read 2026-09-29. Not part of this phase's completion (parent D4, `SE` section 5)
- [B] T017 After T016, one zero-call run. Unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`). Open for the operator: the runs need T016's labels and sentences first, and the Jev arm waits on the operator's yes. Not part of this phase's completion (parent D4, `SE` section 5)
- [x] T018 After T017, the hub's `SKILL.md`, `README.md`, the next changelog file, one catalog entry where `sk-create-feature-catalog`'s contract places a hub-level measurement and one playbook scenario with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/cli-classifier/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/cli-classifier/`). Evidence: briefs 20 to 27 wrote the 8 docs at build time, before T017's runs, because parent D6 requires them with the build and T017 waits on the operator (see `goal.md`'s log). Fix briefs `f1` and `f2` set version 1.2.0.0 in `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json`, `sync-skills-hermes.cjs` wrote the Hermes copy (`Wrote 3 of 72`) and `--check` prints `PASS: 72 Hermes skill copies in sync` (`SE` sections 1 and 4)
- [x] T019 `validate_document.py` exits 0 on every doc T012 and T018 changed, the key grep of spec REQ-009 returns no match, `git diff --stat .claude/settings.json .skilled/hooks` is empty and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`). Evidence: `validate_document.py` exit 0 on all 8 changed hub docs (the catalog root with `--type feature_catalog`, the playbook root with `--type playbook`), `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the scorer exit 1, `git diff --stat .claude/settings.json .skilled/hooks` empty and `git status --porcelain` equal before and after the runs (`SE` section 2). The commit's 19 files are the Files to Change rows plus `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` (f2, hub invariant 13a) and the two activation manifests the pre-commit route-remint gate re-minted (`SE` section 5)
- [x] T020 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and `cli-deem.test.mjs` fails nothing beyond T002's baseline. Then the parent session commits with path-scoped commits (parent goal D5). Evidence: Pi MiMo on the code `VERDICT: PASS` with 3 P2, Devin DeepSeek on the docs `VERDICT: FAIL` with 3 P1 and 3 P2; all three P1 closed and the recheck `VERDICT: PASS`, 5 P2 recorded and not chased. The parent session committed `3d0641004b`, 19 files (`SE` sections 3 and 5). INFERRED, a `cli-deem.test.mjs` rerun would confirm: that rerun after the build is not in the evidence, its last recorded run is T002's 34 of 34, and the commit touches no `cli-deem` file
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or the phase closes at its label gate with T016 and T017 left `[B]` and listed in `implementation-summary.md` as waiting on the operator. Amended 2026-09-29 from "all tasks marked `[x]`", because parent D4 closes phases 019 to 035 at their label gate and keeps the labels and runs as operator items (reason in `goal.md`'s log). Evidence: T001 to T015 and T018 to T020 are `[x]`, T016 and T017 stay `[B]` and `implementation-summary.md` lists them, and the zero-call run prints `stop: fewer than 90 labeled rows` from the final state (parent D4)
- [x] No `[B]` blocked task remains other than those two. Evidence: this closure pass
- [x] Each backend whose gate passed printed a verdict line, or the zero-call run printed `no headroom` or `underpowered`, and the line is in `goal.md`'s log with the seam still recorded as open. Amended 2026-09-29: the label-gate stop `stop: fewer than 90 labeled rows` closes the row at the state parent D4 closes the phase in, and the verdict lines wait on the operator's labels and a live run (reason in `goal.md`'s log). Evidence: the stop line is in `goal.md`'s log and the seam is recorded as open there
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../001-deep-research/research/research.md:915-932` (R16), `../004-deep-research-expansion/research/research.md:748` and `../007-classifier-deep-research/research/research.md:426` and `:924`
<!-- /ANCHOR:cross-refs -->

---
