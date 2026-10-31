---
title: "Implementation Summary: Phase 17: deem-search-narrowing-arm"
description: "score-track-narrowing.mjs measures offline whether a Deem or Jev pick of the spec track beats ripgrep and the trigger-index lookup at naming the right track. The live Deem run printed verdict deem: stop (margin), 10 right against ripgrep's 68 of 256. The one live Jev run printed verdict jev: keep, 97 right against 68, for jev 0.6.2, provider official and model jev-1.13.0. Built and committed as f7ae1ff44c, 14 of 14 acceptance criteria Met."
trigger_phrases:
  - "deem search narrowing arm implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm"
    last_updated_at: "2026-09-28T22:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase: 14 of 14 AC Met, stop (margin)"
    next_safe_action: "Orchestrator commits the phase docs"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts"
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-017-deem-search-narrowing-arm"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the Jev service accept 17 options? Yes. The live --jev run of 2026-09-29 measured 256 of 256 rows with 0 unmeasured"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 17: deem-search-narrowing-arm

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-deem-search-narrowing-arm |
| **Status** | Complete |
| **Completed** | 2026-09-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now measure, offline and on a counted number, whether one classifier pick of the spec track would help search find the right track. The answer for Deem is no.

### Phase 17: deem-search-narrowing-arm

**The measurement.** `score-track-narrowing.mjs` builds a test set from the descriptions of live packets under `specs/`, where each description is a question and its track is the answer. It drops placeholders and any description that names a track or a hub, and it keeps at most 20 rows per track. It then scores two searches that make no model call, the trigger-index lookup and ripgrep, at track level on the same rows, with each question's own folder excluded. The better of the two is the baseline. A default run stops there, spawns no model binary and writes no file.

**The two arms.** Behind `--deem` and a passing `cli-deem health`, or `--jev` and phase 002's Jev gate, the script asks one `choice` per question over the 16 tracks plus `none`, in three option orders, and takes the modal pick. It records every call in `calls.jsonl` and writes `report.json` to the `--out` directory. `--deem` or `--jev` without `--out` exits 2 before any output or call. The keep rule of `spec.md` REQ-004 decides each column: at least 90 percent of rows measured, a gain of at least 10 points over the baseline, a sign test below 0.05 and a flip rate of at most 0.10, checked in that order.

**The result.** On the real tree the test set kept 256 rows across 16 tracks. The lookup named the right track on 17 of them and ripgrep on 68, so ripgrep is the baseline and a 10-point gain fit. The live Deem run printed `verdict deem: stop (margin) K=256 M=256 A=10 B=68 W=5 L=63 F=461 p=1.000` on the commit pair `8cbabbb`/`c8a5523`. Deem measured all 256 rows and named the right track on 10. Its picks follow option position, with 209 rows unstable across the three orders. The Deem `stop (margin)` stands. Phase 009 no longer waits on a Deem `keep`, because the operator amended parent goal D4 on 2026-09-29 so that 009 unlocks once 008 is Complete, and that amendment releases it. The verdicts on record before the amendment are 002's Jev `kill`, 002's Deem `kill` and this `stop (margin)`.

**The Jev run.** On the operator's "Yes, one run (Recommended)" of 2026-09-29, one live `--jev` run on `jev 0.6.2`, provider `official` and model `jev-1.13.0` printed `verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330`. Jev measured all 256 rows with 17 options each and named the right track on 97. It abstained on 57, which count as wrong, and 3 rows were unstable. Its latency was p50 330 ms and p95 391 ms. The session recounted the column from `calls.jsonl` and recomputed p. This keep serves nothing, because serving a pick needs a later phase, and opening one is the operator's call.

**The skill docs.** `system-spec-kit`'s `SKILL.md`, README, a new changelog file, a feature-catalog entry and a manual-testing-playbook scenario, with their index rows, each name the script, its zero-call default and both switches (parent goal D6). None of them names a verdict.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Created | The measurement, 2,049 lines with JSDoc on every export. Briefs 01 to 12 and 23 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Created | 33 cases, 1,241 lines, on fixture corpora with stub `cli-deem` and `jev` binaries. Briefs 01 to 12 and 23 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modified | The script row, the tree line and the probe-reader note, +4/-2. Brief 13 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | One sentence in the retrieval section, and version 4.1.3.0 to 4.2.0.0, +3/-1. Brief 14 |
| `.skilled/skills/system-spec-kit/README.md` | Modified | A four-line paragraph in the retrieval section, +5. Brief 15 |
| `.skilled/skills/system-spec-kit/changelog/v4.2.0.0.md` | Created | 28 lines. Brief 16 |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/track-narrowing-measurement.md` | Created | The catalog entry, 67 lines. Briefs 17 and 22 |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modified | The index block under section 8, +16. Brief 18 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/track-narrowing-measurement.md` | Created | Scenario 459, 97 lines. Briefs 19 and 21 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modified | One row in section 7.8. Brief 20 |
| `.hermes/skills/system-spec-kit/SKILL.md` | Modified | The Hermes copy, regenerated by the session with `sync-skills-hermes.cjs` |
| `scratch/w3-build/` | Created | The build record: `build-evidence.md`, the briefs and content files, logs, baselines, final gate output and the runs with their reports, 281 files |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

`f7ae1ff44c` holds 292 files: the 11 paths above outside this folder and 281 under `scratch/w3-build/` (`git show --name-only f7ae1ff44c`). The session then rebuilt the trigger index and its three fixtures from committed content as `2d101bd6d8`. The index, its fixtures, the lookup, the generator, `lib/`, every hook and `AGENTS.md` are unchanged by the build.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator released the phase on 2026-09-28 (parent `goal.md` D3). A build orchestrator, Opus 5.5 at xhigh, captured the baselines at HEAD `64968e9b58` and wrote 23 single-change briefs, each with an `Accept when` line, into `scratch/w3-build/briefs/`. It ran them by Bash in 24 dispatches. Cursor on `grok-4.7-xhigh-fast` built the test set, both baselines and the probes (briefs 01 to 05). Its attempt at brief 06 sat 23 minutes with no output and was killed, so Devin on `deepseek-v4-1-flash-max` took the verdict, the entry point, both gates, both arms and the report (briefs 06 to 12). Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at xhigh wrote the skill docs, copying the new ones byte for byte from content files the orchestrator wrote to sk-doc's templates (briefs 13 to 22). After every dispatch the orchestrator diffed `git status --porcelain` and ran the brief's own check. It then ran the zero-call run and the live Deem run, each with a hold rule and a `git status` check before and after.

The orchestrator session checked the result on the host and recounted the live verdict from `calls.jsonl`. It had the code reviewed by a second model family. Round 1 found one P1, the late `--out` refusal, and brief 23 on Devin DeepSeek, after the operator's switch to Devin DeepSeek and Pi MiMo, fixed it. Round 2 passed. The session regenerated the Hermes copy of `SKILL.md`, committed the build as `f7ae1ff44c` and rebuilt the trigger index as `2d101bd6d8`. This closure pass recorded that evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The live run's verdict stands for the final script | The live run used the script with SHA-256 `b9197509...`. The final `594e3eff...` differs only in where the `--out` refusal sits, moved by brief 23 to close the review's P1. Round 2 diffed the two: the zero-call path, both gates, both arms, the verdict code and `buildReport` are byte-identical. The keep rule did not change, so REQ-004's void clause does not apply, and no second live run was made |
| Close T018 as not requested | The build never waits for the operator's `--jev` flag (parent D7), and no flag came by close. The operator's one live run of 2026-09-29 then replaced that closure (T018) |
| Amend REQ-008 and NFR-P02, not the code | The script also asks the 14 gold-bearing probes, so the probe line can report model hits. The reviewer rated that honest and asked for the spec to follow |
| Keep the coverage condition in the keep rule | The session accepted it before any run: it tightens the rule and stops a keep resting only on the rows a backend answered |
| Wall time on stderr | Stdout stays byte-identical run to run (NFR-R01), which the byte-identical skip checks rely on |
| Record the review's P2s, fix only P0 and P1 | The operator's decision of 2026-09-28, in parent D5 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-28, and the orchestrator session reran the gates from the final state. `W` is `scratch/w3-build`.

| Check | Result |
|-------|--------|
| Build baseline, HEAD `64968e9b58`: the `cli` vitest project | `Test Files 156 passed \| 3 skipped (159)`, `Tests 1569 passed \| 19 skipped (1588)`, exit 0, 7m47s (`W/baseline/cli-vitest.txt`) |
| Build baseline: `generate-trigger-index.mjs --check` and a scratch rebuild | `trigger index matches the corpus`, 23,316 documents, 0 stale, exit 0. The scratch rebuild matched the committed index on 12,386 paths, and `git status` was unchanged |
| Build: `node --check` on the script | No output, exit 0 |
| Build and session: `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script | No match, exit 1 |
| Build: comment-hygiene grep for requirement, task, phase or packet ids in both code files | No match, exit 1 |
| Build and session: focused vitest `tests/score-track-narrowing.vitest.ts` after brief 23 | `Tests 33 passed (33)`, exit 0 |
| Build: the `cli` vitest project, final | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, exit 0, 361.9 s. Delta: +1 file, +33 tests, 0 new failures. The two earlier runs each failed one test: the workflow-invariance ban on "manifest", fixed by brief 22, and a load timeout in `progressive-validation.vitest.ts`, which passed alone 52 of 52 |
| Build: zero-call run `W/runs/zero-call-final` | Exit 0, 1,944.1 s, no stub call, `git status` unchanged, `baseline lookup: 17/256 right (0.0664)`, `baseline ripgrep: 68/256 right (0.2656)`, `headroom: a 10-point gain fits above 68/256` |
| Build: live Deem run `W/runs/deem-live-1` | 18:26:14Z to 19:02:58Z, exit 0, `verdict deem: stop (margin) K=256 M=256 A=10 B=68 W=5 L=63 F=461 p=1.000`, the same pair in `cli-deem health` before and after, p50 703 ms and p95 728 ms, `git status` unchanged |
| Session: recount of `calls.jsonl` | 810 lines, 0 missing `wallMs`, `exitCode`, `modelId`, `modelCommit` or `sourceCommit`. K=256, M=256, A=10, F=461, matching the report. `10*(A-B)` is -580 against `M` 256, so `stop (margin)` holds |
| Session: live Jev run `W/runs/jev-live-1` | 05:35:03Z to 05:57:23Z on 2026-09-29, exit 0, `verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330`, provider `official`, model `jev-1.13.0`, p50 330 ms and p95 391 ms, `git status` unchanged |
| Session: recount of the Jev `calls.jsonl` | 811 lines, 1 `auth_test`, 768 `test` and 42 `probe`, each `measured` with exit code 0 on attempt 1. M=256, A=97, F=47, 3 unstable and 57 abstained, matching the report. The exact one-sided sign test on W 78 and L 49, recomputed in Python, gives p 0.00633034 |
| Session, after brief 23: `node S --deem` and `node S --jev` without `--out`, stub binaries first on `PATH` | Exit 2 each in 0 s, empty stdout, stderr `--<arm> needs --out <dir> so every call is recorded`, no stub call logged |
| Build and session: `validate_document.py` on the 8 changed skill docs | Exit 0 each. The two index files keep the `document_type_fallback` warning they had at baseline |
| Build: `validate-playbook-package.cjs --package system-spec-kit` | `PASS`, `scenarios=85`, `warnings=1`, exit 0 (84 scenarios at baseline) |
| Build: `validate_catalog_package.py --package system-spec-kit` | `WARN tier=warn violations=85`, 0 fail, exit 0, the same as the baseline |
| Build: `ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0`, exit 0 |
| Session: `sync-skills-hermes.cjs`, then `--check` | `DRIFT system-spec-kit` before, 1 of 73 written, then `PASS: 73 Hermes skill copies in sync` |
| Build: protected-path diff over `runtime/data`, `retrieval/lib`, `retrieval/fixtures`, `.skilled/hooks` and `AGENTS.md` | Empty |
| Session: trigger index rebuilt from `git archive HEAD` as `2d101bd6d8` | Generate exit 0, 0 leaks, `--check` exit 0: 23,317 documents, 0 stale, 0 obsolete, 0 untrusted |
| Review, round 1 (Claude `review` agent, a different family from the Grok and DeepSeek writers) | FAIL on one P1, the `--out` refusal after the zero-call report and a passing gate. The verdict recomputed independently: `stop (margin)` |
| Review, round 2 | PASS. Only the refusal moved, and no P0 or P1 is open. One new P2 recorded |
| Closure pass, read-only: `shasum -a 256` on the script, `git show --name-only f7ae1ff44c`, `cmp` of the status files of both runs and the doc greps | `594e3eff...`, the 11 paths plus 281 under `W`, `cmp` exit 0 on each pair, `score-track-narrowing` found in all five docs, and the verdict grep exits 1 while it matches the live stdout |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving the graph metadata after each doc change |
| Closure pass: `validate.sh <this phase> --strict` | First run: `RESULT: PASSED` with `AC_COVERAGE` advisory 0/14, because no Verification cell cited a resolvable `file:line`. The citations were added, and a run before the repair failed `GENERATED_METADATA_INTEGRITY` on a stale fingerprint, as expected. Final run after the repair: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines, `AC_COVERAGE` 14/14 and `AC_CLOSURE` 14/14 |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `STATUS=OK`, `packet_budget=unknown` and `packet_durable_chars=6571`, as expected for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Planned calls include the probes.** REQ-008 said rows times 3, 768. The script plans 3 × (256 rows + 14 gold-bearing probes) = 810, so the probe line can report model hits. The reviewer asked for the spec to be amended, and REQ-008 and NFR-P02 now say so.
2. **Late `--out` refusal, fixed.** The build first refused `--deem` or `--jev` without `--out` only after the zero-call report and a passing gate, following the session's brief, which pointed at phase 002's pattern. Brief 23 moved the refusal to right after argument parsing.
3. **Skill README paragraph.** The plan said one line. It is four, because the file wraps at 100 columns and REQ-014 needs the name, the default and both switches.
4. **Version 4.2.0.0.** `SKILL.md` moved from 4.1.3.0 to 4.2.0.0 with `changelog/v4.2.0.0.md`, a minor bump for a new feature.
5. **Deem updater schedule.** The build prompt had it wrong, :15 past 00, 06, 12 and 18Z, where the updater fires near 20:27Z and 02:27Z. It was corrected mid-build, and the live run, 18:26Z to 19:03Z, avoided both hold windows.
6. **Executors.** Cursor 5 briefs, Devin 8 with brief 23 and Pi on Cline 10. All but brief 23 ran before the operator's switch to Devin DeepSeek and Pi MiMo (parent D5, amended in `3cbe44727e`). Brief 06 moved from Cursor to Devin after its Cursor attempt stalled.
7. **Hermes copy.** The session regenerated `.hermes/skills/system-spec-kit/SKILL.md` with `sync-skills-hermes.cjs`, and the build commit carries it.
8. **Goal criterion 6, AC-007 and AC-013 amended at close.** Criterion 6 now reads the build commit instead of a live `git status`, as phase 002 did. AC-007 and AC-013 asked for 17 `-o` pairs in the stub Jev run, which a two-track fixture cannot show, and now ask for the run's own option set. `goal.md`'s log gives each reason, and the operator can revert them.
9. **Skill docs before the live run.** Plan step 7 put them after the runs. Briefs 13 to 22 finished by 17:53Z and the live run began at 18:26:14Z. No doc names a verdict.
10. **Smaller items.** New `no headroom` skip lines for both arms. Wall time on stderr. 2,049 lines against a 450 to 550 LOC estimate. The retrieval README says "All six scripts". The fixtures hold two tracks, not three. The hold rule was widened mid-build to exempt `/scratch/` paths, after the live run had passed the stricter one. `scratch/w3-build/` stays as the committed build record.
11. **No changelog refresh.** The parent packet has no `../changelog/` folder.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The stub Jev run sends 3 options, not 17.** The one live `--jev` run of 2026-09-29 showed the Jev service takes 17: 256 of 256 rows measured, 0 unmeasured. Its keep holds only for `jev 0.6.2`, provider `official` and model `jev-1.13.0`.
2. **Open P2s from the review, recorded, not fixed (parent D5).** A reused `--out` dir truncates the earlier `calls.jsonl` and `report.json`. A model or backend recheck failure prints `server gone`. The stub-backend and wrong-model stubs exit 0 where the real `cli-deem` exits 3. No test covers a Deem exit-4 passing recheck, `server gone`, the Jev exit-4 backoff or the 90 s timeout. Brief 23 removed the only assertions of the passing Deem health line and of `JEV_PROVIDER` reaching the identity line and `auth status`. Inside `jevGate` a local `path` shadows the `node:path` import.
3. **Deem answers by option position.** Order 0 picks `agents` on 238 of 256 rows and order 2 `cli-jev` on 208, a flip rate of 0.6003. Nothing was tuned.
4. **Never run it beside the `cli` suite.** The ripgrep baseline exits 2 when a directory under `specs/` vanishes mid-walk, as the suite's temp fixture did once.
5. **The index hash moved.** The zero-call and Deem runs read `manifestHash` `fdebd12a...`, and the Jev run read `9481e0d6...`. After `2d101bd6d8` a rerun prints `7bc9bd5b...`, and a keep holds only for what it was measured on (REQ-009).
6. **`report.json` renders p as a float**, `0.9999999999999971` here, while the decision uses an exact comparison and stdout prints `p=1.000`.
7. **No case covers both switches at once, or a switch under `no headroom`.** The code for the second is read, not tested.
<!-- /ANCHOR:limitations -->

---
