---
title: "Goal: Phase 27: stop-second-rater"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "stop second-rater goal"
  - "score-stop-rater completion criteria"
  - "stop gold keep rule"
  - "research r8 test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater"
    last_updated_at: "2026-09-29T19:50:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed the phase at its label gate and set Status Complete"
    next_safe_action: "Operator: write five lineage gold reads, then order a live Deem run"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-027-stop-second-rater"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Write the five-lineage gold-reads file with a labeler field"
      - "Order a live Deem run, then a Jev run on the operator's yes"
      - "Who would read a kept rater"
    answered_questions: []
---
# Goal: Phase 27: stop-second-rater

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle, offline and on a counted number per backend, whether a Jev or Deem novelty score per iteration moves a replayed deep-research stop onto the stop each archived lineage should have made, through one read-only script whose default run makes zero model calls and prints the zero-call stop methods first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/score-stop-rater.cjs` and `runtime/tests/unit/score-stop-rater.vitest.ts` in `system-deep-loop`, plus its `SKILL.md`, runtime READMEs, changelog, scoring catalog and playbook. No convergence code, reducer, workflow YAML or state file changes |
| D2 | Lineages: tracked research state whose config lets a stop move and whose `deltas/` exists. Gold: the last iteration with a first-appearance cited source. Sample: at most 25, inert windows first, then SHA-256 of the path |
| D3 | A stop s is right when gold <= s <= gold + 1. The baseline is the best of `recorded`, `legacy` (the workflow's three-signal vote on self-reported `newInfoRatio`) and `sources` (the same vote on the source ratio), ties to `legacy` |
| D4 | Keep rule per backend column, in order: at least 90 percent of sampled lineages measured, `kill` when the one-sided sign test favors the baseline at 0.05, a gain of at least 10 points, a one-sided sign test below 0.05 and, for Jev, a flip rate of at most 0.10. A baseline right on more than 90 percent prints `no headroom` |
| D5 | The operator's read of five named lineages gates every model call. Fewer than five reads, or one disagreement with the derived gold, stops the arms. No model writes a gold row |
| D6 | Each iteration gets one `score` over the five rubric levels, 3 Jev reruns with the median or 1 Deem call. Jev receives only lineages published at `origin/main`. A keep serves nothing |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` without `--jev` or `--deem` exits 0, prints `lineages:`, `gold:`, `method recorded:`, `method legacy:`, `method sources:`, `baseline:` and either `no headroom` or `planned calls:`, and stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] With `--jev --deem --out <dir>` and fewer than 5 operator gold reads the script prints `stop: fewer than 5 confirmed lineages` and both stub logs stay empty. Past the gate, a stub `jev` whose `auth status --provider official` exits 3 gives a line naming the `jev` path and provider `official`, then `jev arm skipped: no credential`, and a stub `cli-deem health` reporting backend `stub` gives `deem arm skipped: stub backend`. Each run exits 0
- [x] From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-stop-rater.vitest.ts` exits 0 with at least 20 passed tests and 0 failed
- [x] The default run printed `no headroom`, or the gate printed a `stop:` line, or one live `--deem --out <dir>` run past the gate printed `verdict deem: keep`, `verdict deem: kill` or `verdict deem: stop (<reason>)` with its commit pair and wrote a `calls.jsonl` whose every line holds a status and a wall time
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and the build commit touches only `system-deep-loop` files, generated copies and this phase folder
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and the Planned `implementation-summary.md`, authored 2026-09-29 by a spec leaf from `../007-classifier-deep-research/research/research.md` section 12 and `../001-deep-research/research/research.md` section 11 `### R8.` |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: briefs c1 to c8, c1f, c9f to c9j, d1 to d6b and f1 from `scratch/w4-build/briefs/`, run by the CLI executors of parent D5, every step `STATUS: DONE`. Committed as `709b1078ee` (13 files) with the compiled-contract fix `24473df4fa` (3 files), neither pushed. Source: `SE` sections 1 and 5 |
| Baseline | Done | From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run` recorded `Test Files 124 passed (124)` and `Tests 2392 passed (2392)` on 2026-09-29 at 18:48, before the new test file existed. Source: `SE` section 2; `notes.md` |
| Census and label gate | Done | The default run with logging stubs for `jev` and `cli-deem` first on `PATH` exits 0 in about 1 s and prints `lineages: tracked 486 no config 37 forced 235 no deltas 92 kept 122 no gold 106 sampled 16 inert 4`, `gold: derived on 16 of 16 sampled`, the three method lines, `baseline: legacy right 5 of 16`, `question counts: 12 of 16 sampled lineages carry key/answered counts`, the `keep rule:` and power lines and `planned calls: deem 239 jev 718`, and neither stub log was written. `--jev --deem --out <dir>` adds only `stop: fewer than 5 confirmed lineages` and writes only `report.json`, and the same run with a failing Jev auth and a stub Deem backend prints the same. No run printed a verdict line. Source: `SE` section 2; `scratch/w4-session/docs/facts.txt` |
| Tests | Done | `score-stop-rater.vitest.ts` prints `Tests 36 passed (36)`, exit 0. The runtime suite from the committed state printed 2 failed files and 123 passed of 125, and 5 failed tests and 2423 passed of 2428, against the baseline's 124 files and 2,392 tests. All five failures were this phase's compiled-contract drift, and fix `24473df4fa` closes them. Source: `SE` sections 2 and 5 |
| Docs and packages | Done | Doc briefs d1 to d6b wrote `runtime/scripts/README.md`, `SKILL.md`, `runtime/README.md`, `changelog/v1.6.0.0.md`, catalog F056 with its index and playbook DLR-056 with its index, all in `709b1078ee`, and `validate_document.py` exits 0 on each. `sync-skills-hermes.cjs --check` was regenerated to `PASS: 72 Hermes skill copies in sync`, the catalog package reads `violations=173`, warn tier, with one added `packet_history_metadata` warning on the new F056 line, the playbook package reads `PASS ... scenarios=55 ... violations=0 warnings=1`, `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`, README verdict parity prints `PARITY PASS`, README manifest prints `manifest=reproducible`, and `compiled-route-guard.cjs` exits 0 after the commit. Source: `SE` sections 3 and 4 |
| Review and fixes | Done | Code, read by Pi MiMo (534 s, read only): `VERDICT: FAIL`, 2 P1 and 2 P2. The P1s are `no headroom` never closing an arm, fixed by c9g with c9i, and each sample group ordered by the path string, fixed by c9f with c9h. c9j gave the `oversize state is withheld` test the other Deem arm tests' shape, and the recheck (404 s) printed `VERDICT: PASS`. Docs, read by DeepSeek on Cline (257 s, read only): `VERDICT: FAIL`, 1 P1 and 2 P2, fixed by f1 (108 s) with a `VERDICT: PASS` recheck (51 s). The three remaining P2 findings are recorded below, not chased (parent D5), and the SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit and regression fix | Done | `709b1078ee` feat(deep-loop): the script, its test, the eight docs and the Hermes copy, 11 files, plus both route manifests the pre-commit gate re-minted, 13 in all, not pushed. The runtime suite then failed 5 tests in the two compiled-contract test files, since the hub `SKILL.md` sentence left the three deep command contracts stale. Fix `24473df4fa` recompiles them from an export of the commit's tree, and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` with the two files at `Tests 42 passed (42)`. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. At least 5 confirmed lineages in a gold-reads file (`--gold-reads <file>`), then a live Deem run, and a Jev run on the operator's yes. 2. The three P2 findings below. 3. A kept rater serves nothing, and a live form needs a later phase. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam check (2026-09-29) | Every R8 citation resolves in today's tree with no line drift: `runtime/scripts/convergence.cjs:506-549` (`buildNoveltyCorroboration`), `:618-631` (`applyNoveltyCorroborationGuard`), `:805-808` (the guard's call), `runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-19`, `deep-research/scripts/reduce-state.cjs:965-989` and `deep-research/references/convergence/convergence-signals.md:41-47`, `:55-73`. The vote the replay copies is at `.skilled/commands/deep/assets/deep-research-confirm.yaml:648-661` |
| Corpus drift | The record's 178 archived lineages is now 449 tracked lineages with a config, of which 203 can move their stop and 115 keep `deltas/` (1,160 iteration records, 9 with three consecutive ratios at or above 0.9). Rough counts by one `node` pass of this leaf. The final census prints 486 tracked, 37 without a config, 235 forced, 122 kept, 106 with no gold, 16 sampled and 4 with an inert window |
| `novelty_signal_inert` is not persisted | No tracked `deep-research-state.jsonl` holds the event: the reducer computes it at reduce time (`reduce-state.cjs:950-990`). The replay recomputes inert windows from recorded ratios |
| Executor roster | Parent D5 was amended on 2026-09-29: no Claude leaves, and DeepSeek V4.1 Flash on Cline at `xhigh`, then OpenCode Go, then LLM Gateway at `max`, with `llmgateway/mimo-v2.6-pro` at `high`. Step c1 ran on Pi MiMo (1,122 s) after Devin's daily quota ran out, c2 to c8 and the code fixes ran on DeepSeek V4.1 Flash through Cline, and docs d1 to d6b and fix f1 ran on Pi MiMo at `high`. No Claude leaf wrote a file. Source: `SE` section 1; `scratch/w4-session/orchestration-log.md` |
| Fixture hook failure and c1f | The c1 check failed 5 of 6 because the fixture's `git commit` hit the machine's global commit-msg hook. Fix c1f passes `-c core.hooksPath=/dev/null`, and the same rule went into every remaining phase's `rulings.md`. Source: `SE` section 1; `rulings.md` 5 |
| Step c6 check | The c6 check failed on `summarizeColumn`, which design step 8 adds, so c7 and c8 ran with no per-step check and the test file ran once after c8: `Tests 34 passed (34)`. Source: `SE` section 1; `notes.md` |
| Code review P1 1: no headroom | The review found `no headroom` never closed an arm, so a saturated sample with agreeing reads would still call the backends. Fix c9g closes both arms with `<backend> arm skipped: no headroom`, and c9i pins it with agreeing reads for all ten lineages. Source: `SE` section 3 |
| Code review P1 2: sample order | The review found each sample group ordered by the path string where the spec orders by the SHA-256 of the lineage path. Fix c9f sorts by the hash, and c9h checks 30 lineages against the hash order. Source: `SE` section 3 |
| Code review follow-up: c9j | After c9g, `oversize state is withheld` failed: it had passed only because arms ignored headroom. Fix c9j gives it the three-iteration shape of the other Deem arm tests. Source: `SE` section 3 |
| Docs review P1 and tie P2 (f1) | The docs review found the playbook and its index stating 34 passing tests in three places where the suite prints 36, and, rated P2 but fixed, the catalog saying ties keep `legacy` where `pickBaseline` gives a tie to the first of `legacy`, `sources` and `recorded`. Fix f1 closed both, and the recheck ran the file (`Tests 36 passed (36)`) and read `pickBaseline`. Source: `SE` section 3 |
| Compiled-contract regression | The runtime suite after the build commit failed 5 tests in `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`, since the three compiled deep command contracts record the hub `SKILL.md` by SHA-256 and the new sentence left them stale. Fix `24473df4fa` recompiles them from an export of the commit's tree. Source: `SE` section 5; `scratch/w4-session/orchestration-log.md` |
| Past-gate skips rest on fixtures | The past-gate skip lines need an operator gold-reads file, which carries a `labeler` field. The session wrote none (parent D4), and the tests cover both skip lines on fixtures. Source: `SE` sections 2 and 6 |
| No verdict line | No run has printed a `verdict` line, since every run stopped at the label gate. The docs claim none. Source: `scratch/w4-session/docs/facts.txt`; `rulings.md` 3 |
| P2 1: C counts only calls behind a full median | MiMo: a Jev iteration answered 0, 0, unparseable adds 0 to C and F although `calls.jsonl` holds two `measured` rows. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 2: planned calls count every iteration record | MiMo: the planned-calls line counts every iteration record while the arms score only non-`thought` iterations. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 3: the withheld-path test asserts helpers only | DeepSeek: the "unpublished lineage is withheld from jev" test never runs `runJevArm`, so the arm's skip of withheld paths is untested. Recorded, not chased (parent D5). Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header |
| Premise corrections at close | `spec.md`'s Status and description now say Complete, its corpus counts are the final census, its changelog row names `v1.6.0.0.md`, and its catalog and playbook rows name F056 and DLR-056. `plan.md`'s builder roster now states parent D5 as amended on 2026-09-29. Recorded by this closure pass |
| Gold and lineage-filter fixes (2026-10-01) | The operator chose "Both fixes" after phase 042's reads disagreed with the derived gold on 3 of 5 lineages. Luna 6 max added `findingSources()`: a source is a file from a finding's `source` string or its `sources` or `evidence` arrays, with any trailing line reference dropped and tool entries such as `Glob:...` skipped. `isMovable()` now also reads `antiConvergence.convergenceMode`, which departs from REQ-002, where only `stopPolicy` falls back. Suite: 41 pass (36 before), 0 failing. Census after: `lineages: tracked 486 no config 37 forced 242 no deltas 92 kept 115 no gold 72 sampled 25 inert 4` (before: forced 235, kept 122, no gold 106, sampled 16), `method recorded: right 15 of 25`, `planned calls: deem 279 jev 838`. The two read lineages still sampled now agree with their reads (sol-high-fast 5 and 032 relocation sol 5). The other three read lineages left the sample, and three new ones entered with no read, so the label gate needs three new reads before any arm |
<!-- /ANCHOR:log -->
