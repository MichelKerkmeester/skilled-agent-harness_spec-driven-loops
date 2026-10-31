---
title: "Implementation Summary"
description: "Complete at its label gate. score-stop-rater.cjs replays the archived deep-research lineages offline, prints the three zero-call stop methods and their baseline with zero model calls and stops at stop: fewer than 5 confirmed lineages; its 36 tests cover the census, the label gate, the no-headroom arm close and both dormant arms on stubs, and the system-deep-loop docs describe it. Built as 709b1078ee with the compiled-contract fix 24473df4fa."
trigger_phrases:
  - "stop second rater implementation summary"
importance_tier: "normal"
contextType: "general"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-stop-second-rater |
| **Status** | Complete |
| **Completed** | 2026-09-29, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many archived deep-research lineages can move their stop, where each of three zero-call stop rules lands against a derived stop gold and whether a Jev or Deem novelty score could beat them. Past the operator's five-lineage read, `--jev` and `--deem` each open one arm that scores every iteration and prints one verdict under the Keep Rule in `spec.md` section 4. The phase closes at the label gate, so no model run, no verdict line and no live Jev run exist.

### Phase 27: stop-second-rater

**The script.** `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` (1,957 lines, CommonJS) walks every tracked `deep-research-state.jsonl`, keeps the lineages whose config lets a stop move and whose `deltas/` folder exists, derives each one's gold from its first-appearance cited sources and replays three zero-call stop methods: `recorded`, `legacy` (the workflow's three-signal vote on recorded `newInfoRatio`) and `sources` (the same vote on the source ratio). The sample is at most 25 lineages, inert windows first, then the SHA-256 of the lineage path. Its usage is `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs [--jev] [--deem] [--out <dir>] [--gold-reads <file>]`, run from the repository root. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`:

```text
lineages: tracked 486 no config 37 forced 235 no deltas 92 kept 122 no gold 106 sampled 16 inert 4
gold: derived on 16 of 16 sampled
method recorded: right 5 of 16
method legacy: right 5 of 16
method sources: right 4 of 16
baseline: legacy right 5 of 16
question counts: 12 of 16 sampled lineages carry key/answered counts
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
power: a keep needs at least 5 wins with no loss, since 0.5^5 = 0.03125 < 0.05
planned calls: deem 239 jev 718
```

Exit 0 in about 1 s, no file written, and neither stub log was created. A stop is right when gold <= s <= gold + 1; the baseline is the best method, ties going to the first of `legacy`, `sources` and `recorded` in that order, and a baseline right on more than 90 percent prints `no headroom` and closes both arms.

**The label gate and the arms.** `--gold-reads <file>` holds the operator's reads, one JSON object per line with `lineage`, `gold_iteration` and `labeler`. Until 5 named lineages are confirmed, `--jev --deem --out <dir>` adds only `stop: fewer than 5 confirmed lineages`, calls nothing and writes only `report.json`. Past the gate the Jev gate runs first, then Deem. Jev sends only lineages whose delta files exist at `origin/main`, three `score` calls per iteration with the median level and one `--provider P`. Deem asks once per iteration, with `cli-deem health` bounded to 2,000 ms and the 24,000-character state bound. Each arm replays the legacy vote on its levels, and the Keep Rule's fixed order prints one verdict per column. A switch without `--out` exits 2 with `--jev needs --out <dir> so every call is recorded` or the `--deem` line, before any call.

**The tests.** `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` (1,150 lines, 36 cases) runs the script over a fixture lineage corpus and stub `jev` and `cli-deem` binaries in temp directories. It covers the movable filter, the gold deriver, each zero-call method with `minIterations`, the `no headroom` arm close, both label-gate stops, the Jev gate pass and its skips, the Deem fake-health pass and stub-backend skip, the Deem exit-4 recheck, the 24,000-character bound, the `keep`, `kill` and `stop (coverage)` verdicts on scripted answers and the sample order against the SHA-256 of each path.

**The docs (parent D6, through sk-doc).** `runtime/scripts/README.md`, `SKILL.md`, `runtime/README.md`, `changelog/v1.6.0.0.md`, the catalog entry `feature-catalog/scoring/stop-rater-replay.md` (F056) with its index block, and the playbook scenario `manual-testing-playbook/scoring/stop-rater-replay.md` (DLR-056) with its index row. Each passed `validate_document.py`. No doc names a verdict line, since none was printed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Created | The lineage walker, gold deriver, three zero-call methods, label gate, both arms and the per-column verdicts, 1,957 lines. Briefs c1 to c8, c9f and c9g |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Created | 36 cases over every public surface with stub backends, 1,150 lines. Briefs c1, c1f, c9h, c9i and c9j |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modified | One inventory row for the script. Brief d1 |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modified | One runtime sentence naming the offline replay and that it changes no stop. Brief d2 |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modified | One line naming the script, its zero-call default and both switches. Brief d3 |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.6.0.0.md` | Created | The next changelog entry after `v1.5.0.1.md`. Brief d4 |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` | Created | One catalog entry, F056, version 1.6.0.0. Brief d5a, fix f1 |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | Modified | The index block and the entry count. Brief d5b |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-rater-replay.md` | Created | Scenario DLR-056 covering the zero-call run and a stub-backend skip. Brief d6a, fix f1 |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | Modified | The scenario index row and the counts. Brief d6b, fix f1 |
| `.hermes/skills/system-deep-loop/SKILL.md` | Regenerated | The Hermes copy of the hub `SKILL.md`, in sync at 72 copies |
| `.skilled/bin/lib/compiled-routing/.../activation/system-deep-loop/manifest.json` and `specs/sk-doc/.../activation/system-deep-loop/manifest.json` | Regenerated | Both route manifests the pre-commit route-remint gate staged, since the hub `SKILL.md` is a routing input |
| `.skilled/commands/deep/assets/compiled/deep-{ai-council,research,review}.contract.md` | Regenerated | The three compiled command contracts, recompiled by the fix commit. Fix `24473df4fa` |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`709b1078ee` feat(deep-loop): add a zero-call replay census for a second stop rater holds 13 files: the script, its test, the eight docs, the Hermes copy and both route manifests the pre-commit gate re-minted. Not pushed. `24473df4fa` fix(deep-loop): recompile the deep command contracts for the new SKILL.md holds the three contracts. The trigger index follows in its own commit. No live path changed: no convergence code, reducer, workflow YAML or state file is touched, so every loop stops exactly as today.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/`, ran the build through CLI executors and verified each result itself. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. Step c1 ran on Pi MiMo (1,122 s) after Devin's daily quota ran out; c2 to c8 and the code fixes ran on DeepSeek V4.1 Flash through Cline; the docs d1 to d6b and fix f1 ran on Pi MiMo at `high`, each written from a facts file the session built from its own runs.

The build deviated from the design twice. Step c1's check failed 5 of 6 because the fixture's `git commit` hit the machine's global commit-msg hook; fix c1f passes `-c core.hooksPath=/dev/null`, and the same rule went into every remaining phase's `rulings.md`. Step c6's check failed on `summarizeColumn`, which design step 8 adds, so c7 and c8 ran without a per-step check and the test file ran once after c8: `Tests 34 passed (34)`.

The session then reran the proof plan from the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`. The default run exits 0 and prints the census, the derived gold, the three method lines, the baseline, the question counts, the `keep rule:` and power lines and `planned calls: deem 239 jev 718`; neither stub log was created. `--deem --out <dir>` and `--jev --out <dir>` each add only `stop: fewer than 5 confirmed lineages` and write only `report.json`, and the same run with a failing Jev auth and a Deem health reporting backend `stub` prints the same, because the label gate runs before either backend gate. `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call. `git status --porcelain` was equal before and after, the key grep exits 1, and the Python comment hygiene checker exits 0 on the script and its test. The past-gate skip lines need an operator gold-reads file, which the session did not write (parent D4), so the tests cover both on fixtures. No run printed a verdict line.

The runtime suite ran from the committed state: `Test Files 2 failed | 123 passed (125)` and `Tests 5 failed | 2423 passed (2428)` in 1,131 s, against the baseline's 124 files and 2,392 tests. All five failures sat in `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`: the three compiled deep command contracts record the hub `SKILL.md` by SHA-256 and this phase's new sentence left them stale. The session recompiled them with the repository's own `compile-command-contracts.cjs --write` against an export of the commit's tree, and in that export `check-contract-drift.cjs` printed `[CONTRACT DRIFT] OK commands=3` at exit 0 and the two test files printed `Tests 42 passed (42)`. Only the digest line changed in each. The suite was not rerun whole after the fix.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (534 s, `review-code-pi.md`) and printed `VERDICT: FAIL` with 2 P1 and 2 P2: `no headroom` never closed an arm, so a saturated sample with agreeing reads would still call the backends, and each sample group was ordered by the path string where the spec orders it by the SHA-256 of the lineage path. Fixes c9f and c9g changed the sample order and the arm close, c9h and c9i pinned them, and c9j gave the `oversize state is withheld` test the three-iteration shape of the other Deem arm tests after the headroom fix exposed it. The recheck (404 s) printed `VERDICT: PASS` with all closed and nothing new at P0 or P1. DeepSeek on Cline reviewed the docs (257 s, `review-docs-ds.md`) and printed `VERDICT: FAIL` with 1 P1 and 2 P2: the playbook scenario and its index said 34 passing tests in three places where the suite prints 36, and, rated P2 but fixed because the docs stay true to the code, the catalog said ties keep `legacy` where `pickBaseline` gives a tie to the first of `legacy`, `sources` and `recorded`. Fix f1 (MiMo, 108 s) closed both, and the recheck (51 s) ran the test file (`Tests 36 passed (36)`) and read `pickBaseline`. The three remaining P2 findings are recorded, not chased (parent D5).

The session committed the build as `709b1078ee`, 13 files, not pushed, after the pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests. The trigger index follows in its own commit. The regression surfaced after the commit and was fixed in `24473df4fa`, 3 files, not pushed: every later commit that stages a hub or `deep-review` `SKILL.md` recompiles the contracts from its staged tree first. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the zero-call `sources` rule in the baseline | It reads the same deltas the gold comes from, so a model must beat it to be worth a call. A saturated baseline answers R8 with no model at all |
| Gate every model call on the operator's five-lineage read | The research left open whether the derived gold matches the iteration prose (question 8). A gold nobody checked would make any verdict unreadable, and one disagreement stops every arm |
| Close the arms on `no headroom` (fix c9g) | A saturated baseline cannot be beaten on the sampled lineages, so calling a backend would spend money and change nothing |
| Order each sample group by the SHA-256 of the path (fix c9f) | The spec fixes the sample, and the path-string order would pick a different 25 lineages on the real tree |
| A `keep` serves nothing | D6 and What Not To Build row 13 drop a model input to STOP, so a result changes behavior only through a later phase and the operator's call |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its gate stop from the final state is Complete, and only the operator writes labels |
| Fix every P1 and record P2 | Parent D5 as amended on 2026-09-29. Both P1 findings and the docs review's P1 are closed and rechecked; the three P2 findings are recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the measured facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Zero-call census, stubs first on `PATH` | Exit 0 in about 1 s with the census, the derived gold, the three method lines, the baseline, `question counts:`, `margin: 0.10`, the `keep rule:` and power lines and `planned calls: deem 239 jev 718`; no file written and neither stub log created (`SE` section 2) |
| `--jev --deem --out <dir>` with no reads file | Exit 0, only `stop: fewer than 5 confirmed lineages` added, both stub logs empty, `report.json` written (`SE` section 2) |
| The same run with a failing Jev auth and a stub Deem health | Identical stdout, since the label gate runs before either backend gate (`scratch/w4-session/docs/facts.txt`; `SE` section 2) |
| `--deem` without `--out` | Exit 2 with `--deem needs --out <dir> so every call is recorded`, before any call (`SE` section 2) |
| Past-gate skips | `jev arm skipped: no credential`, `deem arm skipped: stub backend` and `<backend> arm skipped: no headroom` are pinned on `V` fixtures, since the operator's reads file does not exist (parent D4; `SE` sections 2, 3 and 6) |
| `npx vitest run tests/unit/score-stop-rater.vitest.ts` | `Tests 36 passed (36)`, exit 0, against goal criterion 3's floor of 20 (`scratch/w4-session/logs/recheck-ds.last.txt`) |
| Runtime suite from the committed state | 125 files and 2,428 tests against the baseline's 124 files and 2,392 tests, with 5 failures in the two compiled-contract test files; `24473df4fa` recompiles the contracts, and in its export those files print `Tests 42 passed (42)` with `check-contract-drift.cjs` at `[CONTRACT DRIFT] OK commands=3` (`SE` sections 2 and 5) |
| Key grep, porcelain and comment hygiene | The key grep exits 1; `git status --porcelain` was equal before and after every run; the Python comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the eight changed docs | Exit 0 on each, including both index roots (`SE` sections 3 and 4; the doc briefs' checks) |
| Generators and packages | `sync-skills-hermes.cjs --check` regenerated to `PASS: 72 Hermes skill copies in sync`; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; `compiled-route-guard.cjs` exit 0 after the commit; catalog package `violations=173`, warn tier, with one added `packet_history_metadata` warning on the new F056 line; playbook package `scenarios=55 violations=0 warnings=1` (`SE` section 4) |
| Cross-family review | Pi MiMo on the code `VERDICT: FAIL` (534 s, 2 P1, 2 P2) closed by c9f, c9g and c9j, recheck `VERDICT: PASS` (404 s); DeepSeek on Cline on the docs `VERDICT: FAIL` (257 s, 1 P1, 2 P2) closed by f1 (108 s), recheck `VERDICT: PASS` (51 s); 3 P2 findings recorded. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build and fix commits | `709b1078ee` feat(deep-loop), 13 files, and `24473df4fa` fix(deep-loop), 3 files, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0: `graph-metadata.json` re-derived, `description.json` unchanged |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, exit 0 |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3956`, at or under 4000; `packet_budget=unknown` by design for a phase child; exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every model call waits.** No gold-reads file exists, so `--jev --deem --out <dir>` prints `stop: fewer than 5 confirmed lineages` and calls nothing. T017 waits on at least 5 confirmed lineages, and parent D4 puts that outside this phase's completion.
2. **A live Deem run needs the labels.** After 5 confirmed lineages: `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs --deem --out <dir> --gold-reads <file>`. No model was called in this build: every run used the logging stubs.
3. **A live Jev run needs the labels and the operator's yes.** Plus `jev` 0.6.2, a credential that `jev auth status --provider P` resolves, and only lineages published at `origin/main`.
4. **No verdict line exists.** Every run stopped at the label gate, so the Keep Rule's verdict path is pinned only on scripted stub answers and no live backend has been measured.
5. **Serving is not in this phase.** A `keep` wires nothing: a live rater or a new iteration-record field needs a later phase and the operator's call.
6. **The whole suite was not rerun after the fix commit.** The five failures from the committed state sat only in the two compiled-contract test files, and both pass 42 of 42 in the fix commit's export, but the full 125-file run was not repeated.
7. **3 review P2 findings are recorded, not fixed** (parent D5): C counts only calls behind a full median; the planned-calls line counts every iteration record while the arms score only non-`thought` iterations; and the withheld-path test asserts the helpers only, never the Jev arm.
8. **The past-gate skip lines are fixture-only.** `jev arm skipped: no credential`, `deem arm skipped: stub backend` and the `no headroom` close are covered by `V`, since no gold-reads file exists to pass the gate on the real tree.
9. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
10. **Premise corrections at close.** `spec.md`'s Status and description now say Complete at commits `709b1078ee` and `24473df4fa`, its corpus counts are the final census, its changelog, catalog and playbook rows name `v1.6.0.0.md`, F056 and DLR-056, and its handoff row records that the gate stop wrote `report.json` and no `calls.jsonl`. `plan.md`'s builder roster states parent D5 as amended on 2026-09-29, and `tasks.md`'s notation carries the closure record.
<!-- /ANCHOR:limitations -->

---
