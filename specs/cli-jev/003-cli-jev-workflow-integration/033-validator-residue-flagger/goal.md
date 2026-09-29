---
title: "Goal: Phase 33: validator-residue-flagger"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "validator residue flagger goal"
  - "score-residue-flagger completion criteria"
  - "residue flagger keep rule"
  - "correctness traceability flag verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger"
    last_updated_at: "2026-09-29T21:57:25Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build c13e968a58 committed; phase closed at its label gate"
    next_safe_action: "Operator: draw from a corpus with resolvable rows, then label 100 rows"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-033-validator-residue-flagger"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A corpus with at least 25 resolvable correctness rows, then the draw and 100 operator labels"
      - "A live Deem run and a Jev run on the operator's yes"
      - "The five recorded P2 findings"
    answered_questions: []
---
# Goal: Phase 33: validator-residue-flagger

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem `noul` flags correctness and traceability defects in document passages better than today's review table, which flags none, through one read-only deep-review script whose default run makes zero model calls and counts the committed finding rows first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-residue-flagger.cjs` and `residue-flagger-labels.jsonl` in `.skilled/skills/system-deep-loop/deep-review/scripts/`, new `scripts/tests/score-residue-flagger.test.cjs`, two README rows and, per parent D6, deep-review's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No review table, template, reducer or finding changes, and no column is added |
| D2 | Labels: 100 passages drawn with a recorded seed, each read at the first parent of the commit that added its review file. 50 cited by a correctness or traceability finding and 50 from the same documents that no finding cites, 25 per category each. The operator labels all 100, because a finding is a reviewer's claim. No model writes a label. Until 100 exist every run prints `stop: fewer than 100 labeled rows` |
| D3 | The baseline is flag-nothing, the review table today. Only tracked files are read, never `.env` |
| D4 | Keep rule per column, in order: at least 90 percent of rows measured, precision at least 0.8 else `kill (precision)`, a 10-point gain, a one-sided sign test below 0.05 and a Jev flip rate of at most 0.10 over 3 reruns (a Deem `noul` holds by its commit pair). Baseline above 0.90 prints `no headroom`, and under 5 `defect` rows `underpowered`. Offline only |
| D5 | Jev first, else Deem. A Jev arm runs behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A Deem arm runs behind `--deem` after `cli-deem health` passes. A failure prints one skip line and changes nothing. One `--provider P`, no key in any file, no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` exits 0, prints finding rows per severity and dimension and either `stop: fewer than 100 labeled rows` or a `baseline:` and headroom line, and stub `jev` and `cli-deem` first on `PATH` log zero calls
- [x] With `--deem --out <dir>` and a stub health reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub `jev` whose `auth status --provider official` exits 3 it prints the `jev` path and provider, then `jev arm skipped: no credential`. Each exits 0 with its other output byte-identical to the default run
- [x] `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` exits 0 with at least 18 passed and 0 failed
- [x] After the operator labels 100 rows, each backend whose gate passed printed one `verdict <backend>:` line of `keep`, `kill (precision)` or `stop (<reason>)` from a live `--out` run with a `calls.jsonl` holding `wallMs` and `exitCode` on every line, or the zero-call run printed `no headroom` or `underpowered`. The final run stopped at the label gate (parent D4)
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and `validate_document.py` exits 0 on each changed deep-review doc
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
| Spec authoring | Done | 2026-09-29, docs only, from `../007-classifier-deep-research/research/research.md:886-905` (R26), `:460-480`, `:113` (K9), `:1042`, `:1045`, `:1047` and `:1076`, plus the glm-04, mimo-02 and mimo-08 iterations and the mimo lead's steer, with the initial Status Planned |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: the design and the briefs in `scratch/w4-build/briefs/`, run by the CLI executors of parent D5. The design ran on Devin `deepseek-v4-1-flash-max` (382 s), then its daily quota ran out, so c1 ran on Pi MiMo (1,707 s); c2 to c6 and c7f to c7h ran on DeepSeek V4.1 Flash through Cline at `--thinking xhigh`, each checked by the test file, and d8a to d10h ran on Pi MiMo at `high`, written from `scratch/w4-session/docs/facts.txt`. Committed as `c13e968a58`, 13 files, not pushed. Source: `SE` sections 1, 3 and 5 |
| Baseline | Done | `node --test` on `deep-review/scripts/tests/` printed `tests 1`, `pass 1`, `fail 0` before any change (`../w4-build/baseline/node-test-before.txt`). Source: `SE` section 1 |
| Session verification from the final state | Done | With logging stubs first on `PATH`: the default run exits 0 in 134 s with 90,510 bytes, `census: commit=c91420429b7e files=5862 tables=115 rows=796 skipped=525`, the six `header` lines, `resolvable: correctness=0 traceability=7 refused=125 dropped=664`, `margin: 0.10`, the keep rule and the two instruction lines, `stop: fewer than 100 labeled rows` and 525 `census skipped:` lines; the stub log was never written. `--deem --out <dir>` with a stub backend adds only `deem arm skipped: stub backend` after one `cli-deem health` call; `--jev --out <dir>` with `auth status` exit 3 adds only the identity line and `jev arm skipped: no credential`; neither writes a file. `--deem` without `--out` exits 2 before any call. `git status --porcelain` was equal before and after, the key grep exits 1 and the comment hygiene checker exits 0 on the script and its test. Source: `SE` section 2 |
| Tests | Done | The final-state folder run prints `tests 37`, `pass 37`, `fail 0`, the baseline's 1 plus this phase's 36; the recheck recorded `tests 36`, `pass 36`, `fail 0` for the test file alone, against the goal's floor of 18. Source: `SE` sections 2 and 3 |
| Label gate stop recorded | Done | `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0`, writes no file and calls no stub, so no labels file can be drawn from today's corpus and the phase closes on `stop: fewer than 100 labeled rows` (parent D4). Source: `SE` sections 2 and 6 |
| Docs and packages | Done | Nine docs landed (briefs d8a to d10h) and `validate_document.py` exits 0 on each; `sync-skills-hermes.cjs` regenerated the deep-review copy; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3`; the catalog package reads `violations=101`, HEAD's count; the playbook package `scenarios=56` against HEAD's 55, `violations=0`, three warnings; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`. Source: `SE` sections 1 and 4; `notes.md` |
| Review and fixes | Done | Code, read by Pi MiMo: `VERDICT: PASS`, 3 P2. Docs and step c1, read by DeepSeek on Cline: `VERDICT: FAIL`, 2 P1 and 4 P2; the staged-file abort closed by c8f and c8g, the Hermes copy regenerated at commit, the docs fixes by f1 and f2, all with rechecks `VERDICT: PASS`. The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `c13e968a58` feat(deep-review): the script, its test, the nine docs, the Hermes copy and the recompiled deep-review contract, 13 files, not pushed; the staged set passed the key grep (exit 1), the pre-commit route remint re-minted `system-deep-loop` with unchanged manifests, and after the commit `compiled-route-guard.cjs` lists every hub fresh. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. A corpus with at least 25 resolvable correctness rows, then `--draw`, then 100 operator labels, then a live Deem run and a Jev run on the operator's yes. 2. The five P2 findings below. 3. A served form needs a later phase and the operator's call. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam pinned | R26's seam row names no `file:line`, only "the deep-review findings tables". Pinned 2026-09-29: the four dimensions at `deep-review/SKILL.md:306-313`, the severity scale at `assets/prompt-pack-iteration.md.tmpl:53`, the iteration narrative at `:113` and the JSONL finding record at `:157` |
| Count corrected | R26's metric carries "62 post-pass findings a week". That is mimo-02's post-validation edit rate, cut by the invocation-only rerun to 193 passing invocations in 40 days, unscoped (K9 and the mimo lead's steer at `:152`). glm-04's 50 true and 12 false flags a week rest on it (`:204`). This phase recounts from committed files and uses neither |
| Rough corpus count | 5,862 tracked `.md` files match the review corpus rule on 2026-09-29 (this leaf's `git ls-files` count, against mimo-02's 5,830). Finding tables use several header shapes, so the census reads by header |
| Executor substitution | The design ran on Devin `deepseek-v4-1-flash-max` (382 s), then its daily quota ran out, so code step c1 ran on Pi MiMo (1,707 s). The other code steps and fixes ran on DeepSeek V4.1 Flash through Cline, and the docs on Pi MiMo. Source: `SE` section 1; `notes.md`; the c1p status |
| Fix c7f (buffer) | The first session proof failed: the default run on the real tree exited 1 with `Error: git ls-files -z exited null`, because `git ls-files -z` prints 15.7 MB and `spawnSync` stops at its 1 MB default buffer. c7f raises the buffer as the 035 sibling does and adds a test that reads a 2,000,000-character tracked file. Source: `SE` section 1; `notes.md` |
| Ruling 6: skipped tables and commit resolution | After c7f the default run printed 928 KB with 5,620 skipped lines, and resolving every review file's commit took about 6 minutes. Ruling 6 counts a table as skipped only when it holds a `P0` to `P2` cell and resolves a file's reviewed commit only when it holds a parsed row. c7g and c7h brought the run to 90,510 bytes, 525 skipped lines and 1 min 48 s. Source: `rulings.md` 6; `SE` section 1 |
| Design step 10 deviation (version sync) | The design syncs `SKILL.md`'s `version:` with `frontmatter-version.mjs apply --skill deep-review`. Its dry run matched 0 files, and `apply` rewrites every in-scope doc's version from history, far wider than this phase, so step d10h set `version: 1.11.0.37` by hand, the convention the skill already kept (1.11.0.36 beside `v1.11.0.36.md`). Source: `SE` section 1; `notes.md`; the d10h log |
| Docs review P1: staged-file abort | A review file in the git index but not at HEAD aborted the run, because `trackedFiles` listed the index while every read is `git show HEAD:<path>`. Fixed at the source by c8f, which lists HEAD's tree, and c8g adds the `staged review file` test; recheck `VERDICT: PASS`. Source: `SE` section 3 |
| Docs review P1: Hermes copy | The Hermes copy of the deep-review `SKILL.md` was not regenerated. The session regenerated it with `sync-skills-hermes.cjs` at commit. Source: `SE` sections 3 and 4 |
| Docs fixes f1 and f2 | f1 corrected the catalog leaf's run wording, the changelog's HEAD wording and the playbook leaf's version after the docs review. f2, from the session's own finding, set the playbook census to 56 scenarios (40 in the first 7 categories) and the catalog overview to 5 review-dimension features; the playbook package then printed `PASS ... scenarios=56 ... violations=0 warnings=3`. Both rechecks `VERDICT: PASS`. Source: `SE` section 3 |
| Labels file not written (draw shortfall) | `--draw --seed 20260929` exits 2 with `draw needs 25 resolvable rows in correctness, found 0` and writes no file, since no correctness finding's location resolves (`resolvable: correctness=0`). The draw waits on a corpus with resolvable correctness rows, an operator item under parent D4. Source: `SE` sections 2 and 6 |
| Criterion wording amended at close | Goal criterion 4 and the `tasks.md` completion rows now treat the label gate stop as the accepted end of this build, since parent D4 stops 019 to 035 at their label gate and parent criterion 2 calls the phase Complete there. The live branch stays the operator's. Source: this closure pass; parent `goal.md` D4 and criterion 2 |
| Runtime suite timing flake | The runtime suite, leaving out the in-progress test files of 029 and 030, printed `Test Files 1 failed | 125 passed (126)` and `Tests 1 failed | 2455 passed (2456)`. The failure is `fanout-run.vitest.ts`, whose checkpoint is due 800 ms after its own clock; the file alone passed 3 of 3, phase 028's suite run passed it, and this phase touches no fan-out code, so it is a timing flake, not a regression. Source: `SE` section 2 |
| P2 findings recorded, not chased (parent D5) | 1. `labelGate` completes only at exactly 100 labeled rows, so a hand-edited file with 101 prints the stop line; `--draw` always writes 100. 2. The unmeasured-row exclusion is never driven through an arm; the 2-of-10 case hand-feeds the counts. 3. `parseArgs`' error branches, `readJsonl`'s corrupt-line throw and a run with both switches have no test, and `censusLines`' format is only prefix-checked. 4. The deep-review `README.md` frontmatter says 1.11.0.36 at HEAD too, so the drift predates this phase. 5. The default run still reads each of the 5,862 review files with one `git show`, about 1 min 48 s. Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header; this closure pass |
| Premise corrections at close | `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, its deliverable and Files to Change rows name what was built and the draw shortfall, and its Files to Change paragraph names the recompiled contract. `plan.md`'s roster states parent D5, its step 7 records the draw shortfall and its dependencies record the gate. `tasks.md`'s notation carries the closure record and T015 to T017 stay `[B]`. Recorded by this closure pass |
<!-- /ANCHOR:log -->
