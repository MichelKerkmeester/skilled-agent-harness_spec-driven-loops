---
title: "Tasks: Phase 27: stop-second-rater"
description: "Ordered build and verification tasks for the offline stop second-rater replay: lineage set, gold, zero-call methods, label gate, both model arms, the Keep Rule, tests, runs and the parent D6 skill docs."
trigger_phrases:
  - "stop rater tasks"
  - "score-stop-rater tasks"
  - "stop gold label gate tasks"
  - "novelty score arm tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 27: stop-second-rater

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

`S` below is `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` and `V` is `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts`. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds ran in number order. Code tasks went to the CLI executors of parent D5 as single-change briefs. Closure (2026-09-29): built and committed as `709b1078ee`, with the compiled-contract fix `24473df4fa`. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the dispatch briefs in `scratch/w4-build/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the runtime vitest baseline at HEAD: from `.skilled/skills/system-deep-loop/runtime`, `npx vitest run` pass, fail and skip counts, in `goal.md`'s log (`goal.md`). Evidence: the baseline `Test Files 124 passed (124)`, `Tests 2392 passed (2392)` was recorded on 2026-09-29 at 18:48, before c1 wrote the test file; the row is in `goal.md`'s log, recorded by this closure pass (`SE` section 2; `notes.md`)
- [x] T002 [P] Reopen every cited seam before the first brief and log any drift: `runtime/scripts/convergence.cjs:480-486`, `:506-549`, `:618-631`, `:805-808`, `runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19`, `deep-research/scripts/reduce-state.cjs:950-990`, `deep-research/references/convergence/convergence-signals.md:41-73` and `.skilled/commands/deep/assets/deep-research-confirm.yaml:637-661` (`goal.md`). Evidence: the `goal.md` log row "Seam check (2026-09-29)" records every R8 citation resolving in today's tree with no line drift
- [x] T003 [P] Build a fixture lineage corpus in a temp directory inside `V`: a movable lineage with a known gold, a `max-iterations` lineage, a `convergenceMode` `off` lineage, a lineage with no cited source, an inert-window lineage and a lineage whose `legacy` stop lands on its gold (`V`). Evidence: `V` builds each fixture lineage in a temp directory and prints `Tests 36 passed (36)`; the rechecks read the fixtures for the sampler, the headroom case and the oversize case (`SE` section 3; `scratch/w4-session/logs/recheck-pi.last.txt`; `scratch/w4-session/logs/recheck-ds.last.txt`)
- [x] T004 [P] Write stub `jev` and `cli-deem` binaries inside `V` that log each call and answer per case, for the gate, exit-code and verdict cases (`V`). Evidence: the tests put a stub directory first on `PATH` and pin the Jev gate pass and its skips, the Deem fake health and stub-backend skips, the exit-4 recheck and the `keep`, `kill` and `stop (coverage)` verdicts on scripted stub answers (`SE` section 2; design section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the lineage walker: tracked `deep-research-state.jsonl` files, the config beside each, REQ-002's movable rule, the `deltas/` check and the sample order (inert window first, then SHA-256 of the lineage path), K at most 25 (`S`). Evidence: the census prints `lineages: tracked 486 no config 37 forced 235 no deltas 92 kept 122 no gold 106 sampled 16 inert 4`; fix c9f orders each group by the SHA-256 of the lineage path and c9h checks 30 lineages against that order (`SE` sections 2 and 3)
- [x] T006 Write the gold deriver: first-appearance sources from `type: finding` delta records, g as the last iteration with one, `no gold` counted (`S`). Evidence: the default run prints `gold: derived on 16 of 16 sampled` and the census counts `no gold 106`; the docs review reproduced the full census line from the final state (`SE` section 2; `scratch/w4-session/logs/review-docs-ds.last.txt`)
- [x] T007 Write the vote replayer for REQ-003: rolling average, MAD noise floor, question coverage where counts exist, weight redistribution, the 0.60 bar, `minIterations` and a recorded `STOP_BLOCKED` graph event. One function takes the ratio series as input (`S`). Evidence: `V` pins `legacy` on `minIterations` and on a `STOP_BLOCKED` event and the vote's weight redistribution without counts, and the method lines print `method legacy: right 5 of 16` and `method sources: right 4 of 16` (`SE` section 2; design section 3)
- [x] T008 Write the three zero-call methods (`recorded`, `legacy`, `sources`), the right-on-lineage test, the baseline pick with its tie order and the census lines, ending in `no headroom` above 90 percent or `planned calls:` (`S`). Evidence: the default run prints the three method lines, `baseline: legacy right 5 of 16`, `question counts: 12 of 16 sampled lineages carry key/answered counts` and `planned calls: deem 239 jev 718`; fix c9g closes both arms with `<backend> arm skipped: no headroom` and c9i pins it with agreeing reads for all ten lineages (`SE` sections 2 and 3)
- [x] T009 Write the label gate of REQ-006: `--gold-reads`, the five lineages the census names, `stop: fewer than 5 confirmed lineages` and `stop: derived gold disagrees on <k> of 5 lineages` (`S`). Evidence: `--jev --deem --out <dir>` with no reads file adds only `stop: fewer than 5 confirmed lineages`, with both stub logs empty and only `report.json` written; `V` pins both stop lines and the malformed-row exit 2 (`SE` section 2; design section 3)
- [x] T010 Add the Jev gate and arm: identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2`, `jev auth status --provider P`, one `jev auth test --provider P`, the payload notice, the published-only check with `git cat-file -e origin/main:<path>`, three `jev score` calls per iteration with the median level, the 90 s cap and REQ-009's Jev exits (`S`). Evidence: `V` pins the gate pass, the version and `no credential` skips, the published-only check, three calls per iteration with the median and one `--provider` on every logged `jev` call; the review marks REQ-008 and REQ-009 met, and on the real tree the label gate stops first, so the arm's live path is fixture-only (parent D4; `SE` sections 2, 3 and 6)
- [x] T011 Add the Deem gate and arm: `cli-deem health` within 2,000 ms with its four skip lines, the notice, one `cli-deem score` per iteration, the 24,000-character bound and REQ-009's Deem exits with the exit-4 recheck (`S`). Evidence: `V` pins the fake-health pass, the stub-backend skip byte-identically, one call per iteration, the bound and the exit-4 recheck with a new pair; the recheck reads the fixed `oversize state is withheld` case at `vitest.ts:963-1005` (parent D4; `SE` section 3)
- [x] T012 Add the Keep Rule of spec section 4 in its fixed order, the verdict line on stdout and in `report.json`, the requalify lines of REQ-010 and the `--out` refusal before any call (`S`). Evidence: `V` pins `keep`, `kill`, `stop (coverage)` and `stop (margin)` and the requalify line before the verdict; `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call, and the `keep rule:` line prints on every default run (`SE` section 2)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Write `V` with a happy path and one edge case per surface: movable filter, gold deriver, each zero-call method with `minIterations`, `no headroom`, both label-gate stops, Jev gate pass and `no credential` skip, Deem gate pass and stub-backend skip with byte-identical output, a Deem exit 4 with a new pair, an unpublished lineage withheld from Jev, `keep`, `kill` and `stop (coverage)` on scripted answers and one `--provider` on every logged `jev` call. Expect at least 20 passed tests (`V`). Evidence: `V` holds 36 `it(` cases in 1,150 lines and prints `Tests 36 passed (36)`; the docs review's P2 3 records that the withheld-path case asserts the helpers only and never runs the Jev arm (`SE` section 3; `scratch/w4-session/logs/recheck-ds.last.txt`)
- [x] T014 Proof step 1: the default run on the real tree with logging stubs first on `PATH`. Read exit 0, the census lines, the headroom line and two absent stub logs (`goal.md`). Evidence: the default run exits 0 in about 1 s and prints the census, the gold, the three methods, the baseline, the question counts, the `keep rule:` and power lines and `planned calls: deem 239 jev 718`; neither stub log was written (`SE` section 2; `scratch/w4-session/docs/facts.txt`)
- [x] T015 Proof steps 2 and 3: the label-gate stop with `--jev --deem --out <tmp>`, then each gate skip on stubs, each exit 0 with the census unchanged (`goal.md`). Evidence: `--deem --out` and `--jev --out` each add only `stop: fewer than 5 confirmed lineages` and write only `report.json`, and the same run with a failing Jev auth and a stub Deem backend prints the same; the past-gate skips (`no credential`, `stub backend`, `no headroom`) rest on the `V` fixtures, because the operator's reads file does not exist (parent D4; `SE` sections 2 and 6)
- [x] T016 Proof step 5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` prints nothing, and `git status --porcelain` is the same before and after each run (`goal.md`). Evidence: the key grep exits 1, `git status --porcelain` was equal before and after every run, and the Python comment hygiene checker exits 0 on `S` and `V` (`SE` section 2)
- [B] T017 Only when the operator's reads file exists and the gate passes: one `--deem --out` run against the local server and, on the operator's flag, one `--jev --out` run. Read each verdict line and every `calls.jsonl` line for a status and wall time. Blocked on the operator's five-lineage read (`goal.md`). The phase closes on the gate stop `stop: fewer than 5 confirmed lineages` from the final state (parent D4; `SE` sections 2 and 6)
- [x] T018 Write the parent D6 docs through sk-doc after the runs: `SKILL.md`, `runtime/README.md`, `runtime/scripts/README.md`, a new runtime changelog file, the scoring catalog entry and the scoring playbook entry with their index rows. Run `validate_document.py` on each and read exit 0 (`.skilled/skills/system-deep-loop/`). Evidence: the eight docs landed in `709b1078ee` (`SKILL.md`, both READMEs, `changelog/v1.6.0.0.md`, catalog F056 with its index and playbook DLR-056 with its index); `validate_document.py` exits 0 on each; the docs review's P1 (34 to 36 tests in three places) and the tie-rule P2 are closed by f1 with a `VERDICT: PASS` recheck (`SE` sections 3 and 4)
- [x] T019 Rerun the runtime vitest suite and compare with T001, then run `validate.sh --strict` and `check-goal.cjs` on this phase and read `RESULT: PASSED` on each (`implementation-summary.md`). Evidence: the suite from the committed state printed `Test Files 2 failed | 123 passed (125)` and `Tests 5 failed | 2423 passed (2428)` against the baseline's 124 files and 2,392 tests, and all five failures were this phase's compiled-contract drift; fix `24473df4fa` recompiles the three contracts, and in its export `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` and the two failing files print `Tests 42 passed (42)`. `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` from this closure pass (`SE` sections 2 and 5)
- [x] T020 Record the census numbers and every stop or verdict line in `implementation-summary.md` and `goal.md`'s log for the parent's log (`implementation-summary.md`). Evidence: the census line and `stop: fewer than 5 confirmed lineages` are in `goal.md`'s log and `implementation-summary.md` Verification, recorded by this closure pass; no run printed a verdict line (`SE` section 2; `scratch/w4-session/docs/facts.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or T017 left `[B]` with the label-gate stop line recorded as the phase's result
- [x] No other `[B]` blocked tasks remaining
- [x] Manual verification passed: the default run and the gate runs were read by the orchestrator session
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
