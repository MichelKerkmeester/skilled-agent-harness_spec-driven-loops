---
title: "Tasks: Phase 32: citation-drift-scan"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "citation drift tasks"
  - "cite-drift-scan tasks"
  - "citation drift verification"
  - "citation drift label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 32: citation-drift-scan

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

`S` is `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, `T` is `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` and `L` is `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`, all proposed. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds ran in number order. Closure (2026-09-29): built and committed as `c5d3ced36f`, 18 files with the route remint, and closed at its label gate. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the briefs in `scratch/w4-build/briefs/` and the session facts in `scratch/w4-session/docs/facts.txt`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the owner's contracts before writing: `shared/scripts/README.md`, `frontmatter-version.mjs`, `scripts/tests/test-frontmatter-version.mjs`, `scripts/tests/run-script-tests.sh`, `cli-classifier/cli-deem/SKILL.md` and `cli-classifier/cli-usage/SKILL.md`. Route the code write through sk-code's OpenCode route (`.skilled/skills/sk-doc/shared/scripts/`). Evidence: design section 1 rechecked each owner contract (`check-ac-coverage.sh:437`, `validate_catalog_package.py:494`, `validate_document.py:18-21`, `cli-deem/SKILL.md:49-57`), each code brief routes the write through `.skilled/skills/sk-code/SKILL.md`, and the code steps ran on DeepSeek V4.1 Flash through Cline (`scratch/w4-build/logs/c2.status` to `c7.status`; `SE` sections 1 and 2)
- [x] T002 Record the baseline: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs`, output and exit code saved before any change (`.skilled/skills/sk-doc/scripts/tests/`). Evidence: `../w4-build/baseline/run-script-tests.txt` holds 26 PASS and 3 FAIL lines with `1 failing: test_rename_tooling_fixture_harness.py`, and `baseline/test-frontmatter-version.txt` holds `PASS` with 23 passed and 0 failed, captured before any 032 file existed (`SE` section 1)
- [x] T003 [P] Build the test fixtures inside `T`: a temp git repository with two skill folders, docs holding in-range, past-end, ambiguous, fenced and `.env` citations, and stub `jev` and `cli-deem` binaries that log one line per call (`T`). Evidence: `T` builds that fixture and mounts the stubs first on `PATH`, and its 32 cases pass (`node --test` `tests 32`, `pass 32`, `fail 0`) with the stub logs absent on the default run (`SE` sections 1 and 2; design section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extractor and resolver: the citation pattern outside fenced code, the synthesis's resolution order against `git ls-files` only, `.env` basenames refused (`S`). Spec REQ-002, REQ-003. Evidence: `T` covers `extract prose`, `extract fenced skip`, `resolve order`, `resolve ambiguous basename`, `resolve unresolved`, `dead missing target`, `dead past end`, `refused .env` and `refused untracked`, and the final-state run prints `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d` (`SE` section 2)
- [x] T005 Census and dead check: per-skill counts with the HEAD commit, one `cite dead:` line per dead citation, zero calls (`S`). Spec REQ-001, REQ-003. Evidence: the final-state default run exits 0 with the per-skill count lines, the totals line at `commit=709b1078ee5d` and two `cite dead:` lines, and the stub log was never written (`SE` section 2)
- [x] T006 `--draw --seed <n>`: 40 rows at the HEAD commit, 20 live and 20 constructed by the 60-line wrapping offset, hashes and no text, refusal to overwrite an operator label (`S`, `L`). Spec REQ-004. Evidence: `--draw --seed 20260929 --labels <scratchpad file>` exits 0 in 381 s with `draw: path=... seed=20260929 commit=709b1078ee5d rows=40 live=20 constructed=20`; the file holds 20 live rows with `verdict` and `labeler` null and 20 constructed rows with `verdict: contradicts` and `labeler: construction`; `T` covers reproducibility and the refusal (`SE` section 2)
- [x] T007 Comparators and label gate: flag-nothing and identifier overlap on identical rows, the baseline method with flag-nothing winning a tie, `stop: fewer than 40 labeled rows`, `margin: 0.10`, the `keep rule:` line and the `no headroom` and `underpowered` lines (`S`). Spec REQ-005, REQ-006. Evidence: the final-state run prints `margin: 0.10`, the `keep rule:` line and `stop: fewer than 40 labeled rows`, and `T` covers `comparator flags`, `comparator no token`, `comparator token present`, `label gate 39`, `no headroom` and `underpowered` (`SE` section 2)
- [x] T008 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with the fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012. Evidence: `--deem --out <dir>` with a stub backend added only `deem arm skipped: stub backend` after one `cli-deem health` call and wrote no file; `--deem` without `--out` exits 2 with `--deem and --jev need --out <dir> so every call is recorded` before any call; `T` covers the gate pass, the stub-backend skip, the exit-4 pair change and `--out` required (`SE` section 2)
- [x] T009 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012. Evidence: `--jev --out <dir>` with a stub whose `auth status --provider official` exits 3 printed the identity line and `jev arm skipped: no credential` after `jev --version` and the auth check, and wrote no file; `T` covers the gate pass, the `no credential` skip, one `--provider` per call and exit 3 after the gate (`SE` section 2)
- [x] T010 Verdict per column on stdout and in `report.json`: the five conditions in order, integer counts, an exact p, the Brier score printed beside it and both `requalify` lines (`S`). Spec REQ-006, REQ-013. Evidence: `T` covers `verdict keep`, `verdict kill precision`, `verdict stop coverage`, `verdict stop margin` and `verdict requalify`, with the Brier score printed beside the p, and the final-state test run prints `tests 32`, `pass 32`, `fail 0` (`SE` sections 1 and 2)
- [x] T011 [P] README rows for the script, the labels file and the test (`.skilled/skills/sk-doc/shared/scripts/README.md`, `.skilled/skills/sk-doc/scripts/tests/README.md`). Evidence: `shared/scripts/README.md` gets one row, naming `cite-drift-labels.jsonl` as the default file `--draw` writes (design step 8 deviation), and `scripts/tests/README.md` gets one row for the test; `validate_document.py --type readme` exits 0 on both (`scratch/w4-build/logs/d8a.last.txt`, `d8b.last.txt`; `SE` section 1)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` exits 0 with at least 18 passed and 0 failed, one happy path and one edge case per surface listed in spec REQ-014 (`T`). Evidence: the final-state run prints `tests 32`, `pass 32`, `fail 0`, against the floor of 18 (`SE` section 2)
- [x] T013 One zero-call run on the real tree with stub binaries first on `PATH`: record the census, the dead count and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`). Evidence: the final-state default run exits 0 in 171 s with `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d`, two `cite dead:` lines and `stop: fewer than 40 labeled rows`; the stub log was never written and `git status` moved only by the parallel 031 and 033 doc queues (`SE` section 2)
- [x] T014 Run `--draw --seed <n>` on the real tree and record the seed and commit; no labels file is committed (parent D4), so the draw is the operator's first step (`L`). Evidence: the draw ran on the real tree with seed 20260929 at commit 709b1078ee5d, 40 rows, exit 0 in 381 s (`SE` section 2). The drawn file stays in the session scratchpad and is not committed: parent D4 stops the phase at its label gate and the session commits no labels file
- [B] T015 The operator labels the 20 live rows `supports`, `partial` or `contradicts` and may relabel any constructed row. No model writes a label. Blocked on the operator (`L`). No operator label exists, so the phase closed on the label gate stop (parent D4; `SE` sections 2 and 6)
- [B] T016 After T015, one zero-call run. Unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`). Blocked on T015: the zero-call run stopped at the gate, so no `--jev` or `--deem` run started (parent D4; `SE` sections 2 and 6)
- [x] T017 After T016, sk-doc's `SKILL.md`, `README.md`, the next changelog file, one catalog entry in `document-validation` with its index row and one playbook scenario with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/sk-doc/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/sk-doc/`). Evidence: the docs landed in `c5d3ced36f`: `SKILL.md` and the Hermes copy, `README.md`, `changelog/v2.2.3.0.md`, the catalog leaf and its index block, the SD-021 playbook scenario and its index rows, with the five hub version fields at 2.2.3.0 (briefs d10a to d10h; `scratch/w4-build/logs/d10d.last.txt`; `SE` section 4). `validate_document.py` exits 0 on each doc except the playbook index, whose three `missing_required_section` errors are identical at HEAD (pre-existing, out of scope; `SE` section 1)
- [x] T018 `validate_document.py` exits 0 on every doc T011 and T017 changed, the key grep of spec REQ-009 returns no match and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`). Evidence: the key grep exits 1; `git status --porcelain` changed only by the parallel doc queues and the Files to Change paths; `validate_document.py` exits 0 on every changed doc but the playbook index, whose three pre-existing errors match HEAD; `parent-skill-check.cjs` prints `OK`, the catalog package prints `violations=6` (HEAD's count), the playbook package `scenarios=27`, `violations=0`, and `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0` (`SE` sections 1, 2 and 4)
- [x] T019 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and the sk-doc suite fails nothing beyond T002's baseline. Then the parent session commits with path-scoped commits (parent goal D5). Evidence: code reviewed by Pi MiMo `VERDICT: FAIL` (P0 polarity, closed by c8f and c8g, recheck `VERDICT: PASS`); docs reviewed by DeepSeek on Cline `VERDICT: FAIL` (P1 refusal wording, closed by f1, recheck `VERDICT: PASS`); the sk-doc suite prints 26 PASS and 3 FAIL with the same one failing file as the baseline; committed as `c5d3ced36f`, 18 files, not pushed (`SE` sections 1, 3 and 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T015 and T016 left `[B]` with the label gate stop line recorded as the phase's result
- [x] No `[B]` blocked tasks remaining other than T015 and T016, which wait on the operator's labels (parent D4)
- [x] Each backend whose gate passed printed a verdict line, or the zero-call run printed `no headroom` or `underpowered`; the final runs stopped at the label gate instead, since the operator has not written the labels (parent D4), and the stop line is in `goal.md`'s log
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../007-classifier-deep-research/research/research.md:844-863` (R24) and `:460-480` (validators)
<!-- /ANCHOR:cross-refs -->

---
