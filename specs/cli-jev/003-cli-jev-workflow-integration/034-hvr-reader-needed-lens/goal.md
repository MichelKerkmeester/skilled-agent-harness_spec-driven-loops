---
title: "Goal: Phase 34: hvr-reader-needed-lens"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hvr reader-needed lens goal"
  - "hvr_reader_lens completion criteria"
  - "reader-needed lens keep rule"
  - "voice category flag verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens"
    last_updated_at: "2026-09-30T06:38:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build 2588231589 committed; phase closed at its label gate"
    next_safe_action: "Operator: draw and label 150 rows, then run the two backend arms"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-034-hvr-reader-needed-lens"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The 150-row draw, the operator's yes or no label on each row, then a live Deem run and a Jev run on the operator's yes"
      - "The five recorded P2 findings"
      - "A served form once a keep exists"
    answered_questions: []
---
# Goal: Phase 34: hvr-reader-needed-lens

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem `noul` flags synonym cycling, significance inflation and false ranges in skill-doc sections better than the HVR scanner's floor and the standard's lexical rules, through one read-only script beside the unchanged scanner, with a zero-call default that prints the census first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `hvr_reader_lens.py`, `hvr-reader-lens-labels.jsonl` and `tests/test_hvr_reader_lens.py` in the voice packet's `scripts/`, plus the parent D6 docs through sk-doc. `hvr_scan.py`, its test, its fixtures and the standard never change |
| D2 | Labels: 150 seeded rows from flagged sections of 5 to 80 lines, 50 per category, false ranges and significance inflation up to half from their comparator's candidates. The operator labels every row `yes` or `no`, never a model. Until 150 exist every run prints `stop: fewer than 150 labeled rows` |
| D3 | Each category's baseline is the better of flag-nothing (the scanner's floor) and its lexical rule, where the standard gives one. Tracked committed docs only, never `.env` or a draft |
| D4 | Keep rule per column: coverage of at least 90 percent in every category, `kill (precision)` when precision is below 0.6 in every category, and `keep` when at least two categories each pass precision at least 0.8, a 10-point gain, a one-sided sign test below 0.05 and a Jev flip rate of at most 0.10 over 3 reruns (a Deem `noul` holds by its commit pair). Fewer than two categories with headroom and power prints `stop: fewer than 2 categories can pass`. Offline only |
| D5 | Jev first, else Deem. A Jev arm runs behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A Deem arm runs behind `--deem` after `cli-deem health` passes. A failure prints one skip line and changes nothing. One `--provider P`, no key in any file, no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` exits 0, prints flagged sections and candidates per comparator and either `stop: fewer than 150 labeled rows` or each category's baseline and headroom line, and stub `jev` and `cli-deem` first on `PATH` log zero calls
- [x] With `--deem --out <dir>` and a stub health reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub `jev` whose `auth status --provider official` exits 3 it prints the identity line, then `jev arm skipped: no credential`. Each exits 0 with its other output byte-identical to the default run
- [x] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` exits 0 and prints `ALL PASS` with at least 18 checks, and `test_hvr_scan.py` still prints `ALL PASS`
- [x] The build closed at its label gate: the zero-call run from the final state printed `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, so the verdict half waits on the operator's 150 labels (amended at close under parent D4; the log records the amendment)
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git diff --stat` on `hvr_scan.py` is empty, `git status --porcelain` is the same before and after each run and `validate_document.py` exits 0 on each changed skill doc
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
| Spec authoring | Done | 2026-09-29, docs only, from `../004-deep-research-expansion/research/research.md:711-729` (R22) and `:124` (K17), and `../007-classifier-deep-research/research/research.md:97` (C13), `:429`, `:471`, `:927`, `:1045-1047` and `:1076`. Status Planned |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: design (DeepSeek through Cline after Devin's quota ran out) and briefs c1 to c13, c8f, c10f, c11f, c11g, c11h, c12f, c12g, c13f, c13g and d11 to d18 from `scratch/w4-build/briefs/`, run by the CLI executors of parent D5. The code steps and every fix ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`, the last test run printing 42 `PASS` lines and `ALL PASS`; the eight docs ran on Pi `llmgateway/mimo-v2.6-pro` at `high` from `scratch/w4-session/docs/facts.txt`. Source: `SE` sections 1 and 5 |
| Session verification from the final state | Done | With logging stubs first on `PATH`: the default run exits 0 in 207 s with `census: ... files=7920 sections=107218 flagged=51057 in_band_5_80=40965 refused=5`, `candidates=0`, `candidates=2` and `candidates=786`, the three questions, `margin: 0.10`, the keep rule, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, and the stub log was never written; `--deem --out <dir>` adds only `deem arm skipped: stub backend` after one health call; `--jev --out <dir>` adds only the identity line and `jev arm skipped: no credential`; neither writes a file; `--deem` without `--out` exits 2 before any call; the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. Source: `SE` section 2 |
| Label gate stop recorded | Done | The draw proof wrote 150 rows at seed 20260929 with `candidate_rows` 0, 2 and 25 and every label empty into the session scratchpad; no labels file is committed (parent D4), so the default run ends `stop: fewer than 150 labeled rows` and the phase closes there. Source: `SE` section 2 |
| Tests | Done | `test_hvr_reader_lens.py` prints 42 `PASS` lines and `ALL PASS`; the unchanged `test_hvr_scan.py` prints 11 and `ALL PASS`; sk-doc's `run-script-tests.sh` prints 26 PASS lines with the same one failing file as 032's baseline, and `test-frontmatter-version.mjs` prints `PASS` with 23 passed and 0 failed. Source: `SE` section 2 |
| Docs and packages | Done | Eight docs landed and `validate_document.py` exits 0 on each; `parent-skill-check.cjs` prints `OK`, 0 warnings; the catalog package prints `violations=6`, HEAD's count; the playbook package `scenarios=10`, `violations=0`, `warnings=0`; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`. Source: `SE` section 4 |
| Review and fixes | Done | Code, read by Pi MiMo: `VERDICT: FAIL`, 2 P1 and 3 P2; the Deem fallback fixed by c11f and c11g and the `report.json` check added by c11h, recheck `VERDICT: PASS`; the session's own census finding fixed by c12f and c12g, recheck `VERDICT: PASS`. Docs, read by DeepSeek on Cline: `VERDICT: FAIL`, 1 P1 and no P2; the `tracked_files` index finding fixed by c13f and c13g, recheck Pi MiMo `VERDICT: PASS`; the playbook package's baked transcript fixed by f0. The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `2588231589` feat(sk-doc): the script, its test, the eight docs and the Hermes copy, 11 files staged; the pre-commit route-remint gate re-minted `sk-doc` and staged both manifests, 13 files in all, not pushed. The staged set passed the key grep (exit 1). After the commit `compiled-route-guard.cjs` lists `sk-doc` fresh. The trigger index follows in its own commit. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. The 150-row draw, the operator's `yes` or `no` label on each row, then a live Deem run and a Jev run on the operator's yes. 2. The five P2 findings below. 3. A served form once a keep exists. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam checked | `hvr_scan.py:17-21` (the reader-needed list and the floor) and `:26` (`--json`) resolve at the worktree HEAD on 2026-09-29 |
| Citation corrected | K17 says the scanner loads the standard at `hvr_scan.py:51-53`. Those lines are a section banner. The path constant sits at `:55-57` and `load_rules` at `:192`, so `:51-53 -> :55-57` |
| Rough census | A scratch count on 2026-09-29 over the scanner's own functions: 7,889 tracked skill `.md` files, 103,594 sections, 50,999 flagged, 40,946 flagged of 5 to 80 lines, of which 2 hold a listed significance phrase and 786 a `from X to Y` construction. The draw design follows from it |
| Design executor swap | The design step ran on Devin first and exited 1 when Devin's daily quota ran out; the session reran it on DeepSeek V4.1 Flash through Cline, which then ran every code step and fix (parent D5 as amended). Source: `SE` section 1; `scratch/w4-build/logs/design.status` and `design-cline.status` |
| Fix c8f (FLAG_AT) | After c8 the test run stopped at `NameError: name 'FLAG_AT' is not defined`: the design lists the constant, but no step defined it. c8f defined it and reported two remaining failures, both the design's step order (step 10 adds `summarize_column` and wires `main`). Source: `SE` section 1; `notes.md` |
| Fix c10f (test slice) | The final test run failed one check: it counted `auth test` calls with `call[:1] == ["auth", "test"]`, which is never true. c10f corrected the slice and the test file printed `ALL PASS`. Source: `SE` section 1 |
| Fix c11f, c11g and c11h (code P1s) | The Deem fallback pointed one folder too high and ran the `.mjs` client with Python, where REQ-007 names `node`; c11f corrected it and c11g added the check. No check read `report.json`; c11h added the check that each column's stored verdict line, categories and identity fields match the printed run. Recheck `VERDICT: PASS`. Source: `SE` section 3 |
| Fix c12f and c12g (census from committed text) | The census read each section's text at the recorded commit, but the scanner ran on the working tree, so two runs at one commit printed different counts while other skill docs were edited (REQ-002). c12f writes the committed text into a temporary folder outside the repository and scans that; c12g checks that a working-tree edit leaves the census unchanged. Recheck `VERDICT: PASS`. Source: `SE` section 3 |
| Fix c13f and c13g (HEAD's tree, not the index) | The docs review found `tracked_files` listed the git index while the census reads each file at HEAD, so a staged, uncommitted file killed the default and `--draw` runs with a traceback (REQ-002). c13f lists HEAD's tree (`git ls-tree -r -z --name-only HEAD`) and c13g adds the check "census leaves out a staged, uncommitted doc". Recheck Pi MiMo `VERDICT: PASS`. Source: `SE` section 3 |
| Fix f0 (baked transcript) | The packet playbook package failed with `BAKED_RUN_TRANSCRIPT`: a dated session run with live counts sat in the scenario's Expected paragraph. f0 deleted that sentence; the package then printed `PASS ... scenarios=10 ... violations=0 warnings=0`. Source: `SE` section 3 |
| Design steps 11 and 15 deviation (labels file) | The labels file gets no README row of its own and no catalog source row, since it does not exist and the session commits none. Parent D4 outranks the phase's ruling 4, which had the session commit the draw, so the draw ran only as a proof in the scratchpad and is the operator's first step. Source: `SE` sections 1 and 2; `notes.md` |
| Criterion 4 amended at close | Criterion 4's wording demanded the operator's labels before any verdict. Parent D4 closes phases 019 to 035 at their label gate, so the criterion now reads as the label-gate close and the operator's branch. No verdict line has printed. Source: parent `goal.md` D4; `SE` sections 2 and 6 |
| P2 findings | Five recorded, not chased (parent D5): a coverage or kill column prints its three category lines before its verdict, where the design says the verdict prints alone; every column line prints `p50=none p95=none`, where the design fixes the measured latencies; K counts non-refused rows, not the category's labeled rows; `scan_batch`'s docstring still calls its second parameter the repository and a relative scanner path through `deps` would resolve against the temporary folder; the default run takes about 3.5 minutes on the real tree. Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header; this closure pass |
| Premise corrections at close | `spec.md`'s Status and description now say Complete and its handoff row records the gate stop; its `git ls-files` mechanism text in REQ-002, REQ-003 and Out of Scope now names HEAD's tree, which c13f made current. `plan.md`'s roster states parent D5 as amended on 2026-09-29 and its step 7 records that no labels file is committed. `tasks.md`'s notation carries the closure record. Recorded by this closure pass |
<!-- /ANCHOR:log -->
