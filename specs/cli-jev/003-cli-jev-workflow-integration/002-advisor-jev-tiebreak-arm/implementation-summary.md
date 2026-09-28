---
title: "Implementation Summary: Offline Advisor Jev Tie-Break Arm"
description: "score-jev-tiebreak.mjs now measures offline whether a Jev or local Deem choice beats the skill advisor's own order inside its near-tie cluster. The default run is a zero-call census, and each model arm runs only behind its own switch and gate. Both live runs printed kill, so no Deem keep unlocks phase 009. Built as 807ce287be and 3d3885274d."
trigger_phrases:
  - "advisor jev tie-break summary"
  - "score-jev-tiebreak status"
  - "jev tie-break results"
  - "deem tie-break verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm"
    last_updated_at: "2026-09-28T15:55:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed from build and session evidence, 7 of 7 criteria ticked"
    next_safe_action: "Orchestrator commits the phase docs"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts"
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Do alias keys such as memory:save and command-memory-save count as one answer in the modal pick"
      - "Should the Jev half of the Gate 3 calibration also run at no headroom"
    answered_questions:
      - "23 rows are movable, 22 labeled and 1 holdout"
      - "A Deem choice does not beat the scorer's order: kill, 8 wins and 30 losses"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-advisor-jev-tiebreak-arm |
| **Status** | Complete |
| **Completed** | 2026-09-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor now has an offline way to ask whether a model should break its near-ties, and the first answer is no for both backends. The Jev column and the Deem column each printed `kill` under the Keep Rule fixed before any run, so neither moves the advisor's order and neither unlocks phase 009.

### Phase 2: advisor-jev-tiebreak-arm

**The zero-call census.** `score-jev-tiebreak.mjs` sits beside the advisor's other routing-accuracy evals. Run with no switch, it scores every skill-firing row of the labeled and holdout files with the built scorer, under the same env the baseline capture uses. It then reads each row's near-tie cluster from the scorer's own `ambiguousWith` list. It counts the rows a tie-break could move, scores the scorer's order against three zero-call comparators and prints a power line, all without spawning `jev` or `cli-deem`. This is the census every run prints first, unchanged:

```text
census: file=labeled rows=177 eligible=93 movable=22 gold_first=61 gold_outside=10 gold_top3=164 tau03=18 over25=0
census: file=holdout rows=64 eligible=18 movable=1 gold_first=15 gold_outside=2 gold_top3=49 tau03=0 over25=0
census: split=train rows=121 eligible=54 movable=9 gold_first=38 gold_outside=7 gold_top3=106 tau03=7 over25=0
census: split=test rows=120 eligible=57 movable=14 gold_first=38 gold_outside=5 gold_top3=107 tau03=11 over25=0
baseline: holdout_top1=53/70
comparator: name=scorer rows=111 mrr=0.7811 right1=76 right3=99
comparator: name=confidence rows=111 mrr=0.7766 right1=75 right3=99
comparator: name=always_second rows=111 mrr=0.5498 right1=25 right3=99
comparator: name=rerank rows=57 mrr=0.7588 right1=37 right3=51
power: movable=23 decided_ceiling=99 min_wins=16 win_rate_80=0.749
```

With 23 movable rows the census was neither `no headroom` nor `underpowered`, so both `choice` arms ran. A `keep` needed at least 16 wins, and 80% power needed a true win rate of 0.749.

**The two model arms.** `--jev` runs the Jev arm only after three checks pass: `jev` on PATH, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. `--deem` runs the Deem arm only after `cli-deem health` passes the pinned check. A failed gate prints one skip line, leaves the census byte-identical and exits 0. A passing gate that would call needs `--out <dir>`, where the arm writes one `calls.jsonl` line per call and a `report.json`. Without `--out` the script exits 2 before any call. The Jev arm asks one `jev choice` per eligible row in three passes with no answer cache. The Deem arm asks one `cli-deem choice` per row in three option orders and then runs R21's 195 `noul` calibration calls. Each column applies the Keep Rule of `spec.md` section 4 and prints one verdict line. The script never reads a key and never starts the Deem server.

**What the live runs found.** The keyed Jev run, provider `official`, made 334 calls:

```text
column: backend=jev rows=111 measured=109 wins=11 losses=27 ties=61 abstentions=10 unmeasured=2 unstable=0
column: backend=jev movable_wins=11 gold_demotions=21 none_on_gold_in_cluster=7 p_win=0.9975 p_loss=0.0069 flip=0.0153
column: backend=jev tau03_inside_wins=2 tau03_inside_losses=3 tau03_outside_wins=9 tau03_outside_losses=24
column: backend=jev mrr=0.7301 right1=64 right3=95 scorer_mrr=0.7771 confidence_mrr=0.7725 always_second_mrr=0.5508 heldout_mrr=0.7091 rerank_mrr=0.7500
column: backend=jev latency_p50_ms=377 latency_p95_ms=2830
verdict: kill backend=jev decided=38 wins=11 losses=27 p_win=0.9975 p_loss=0.0069 flip=0.0153 provider=official model=jev-1.13.0
```

The deciding Deem run, after the review fixes, made 528 local calls on one commit pair:

```text
deem: health backend=torch model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc
deem: nothing leaves the machine planned_calls=528 est_wall_s=34.6 unmeasured_over25=0
column: backend=deem rows=111 measured=111 wins=8 losses=30 ties=44 abstentions=12 unmeasured=0 unstable=17
column: backend=deem movable_wins=8 gold_demotions=24 none_on_gold_in_cluster=9 p_win=0.9999 p_loss=0.0002 flip=0.3123
column: backend=deem tau03_inside_wins=1 tau03_inside_losses=6 tau03_outside_wins=7 tau03_outside_losses=24
column: backend=deem mrr=0.7015 right1=60 right3=97 scorer_mrr=0.7811 confidence_mrr=0.7766 always_second_mrr=0.5498 heldout_mrr=0.7047 rerank_mrr=0.7588
column: backend=deem latency_p50_ms=241 latency_p95_ms=340
verdict: kill backend=deem decided=38 wins=8 losses=30 p_win=0.9999 p_loss=0.0002 flip=0.3123 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=c8a5523c5a7ead9a2132363edfcffd1ec86a6dbc
calibration: backend=deem n=195 measured=195 accuracy=0.4974 f1=0.4432 brier=0.4217 ece5=0.4137 temperature=10.00 archived_f1=0.9843
```

Both verdicts are `kill`, because each column's losses outweigh its wins with a one-sided p at or below 0.05. Each column's MRR fell below the scorer's own on the same rows, 0.7301 against 0.7771 for Jev and 0.7015 against 0.7811 for Deem. Deem's order-flip rate of 0.3123 is also more than three times the 0.10 a `keep` allows. Its R21 calibration scored F1 0.4432 against the classifier's archived 0.9843, and the fitted temperature sits at the top of its 0.05 to 10.00 grid. The build record reads that as raw `noul` probabilities carrying close to no signal for this question. No `compare:` line printed, because each live run had one column. The Jev half of the calibration runs only at `underpowered`, so it did not run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Created | The census, comparators, power line, both gates and arms, both calibration halves, the column comparison and `report.json`. Briefs 01 to 17 and 30 to 36 |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts` | Created | 55 cases with stub `jev` and `cli-deem` binaries and a fake Deem server. Briefs 01 to 18, 12b and 30 to 37 |
| `feature-catalog/scorer-fusion/tie-break-eval.md` and `feature-catalog/feature-catalog.md` | Created, Modified | The catalog entry and its index row, 43 to 44 features. Briefs 22, 23 and 38 |
| `manual-testing-playbook/scorer-fusion/tie-break-eval.md` and `manual-testing-playbook/manual-testing-playbook.md` | Created, Modified | Scenario SC-006 and its index row, 47 to 48 scenarios. Briefs 24 and 25 |
| `runtime/tests/manual-testing-playbook.vitest.ts` | Modified | Its six pinned `47`s moved to `48` for the new scenario. Brief 26, deviation 1 |
| `changelog/v0.13.0.0.md` | Created | The release note. Briefs 27 and 40, deviation 2 |
| `SKILL.md` | Modified | Version 0.11.1.0 to 0.13.0.0 and one pointer bullet, with `description` and the Keywords comment unchanged. Brief 28 |
| `README.md` | Modified | The "Offline tie-break eval" row. Briefs 29 and 39 |
| `runtime/scripts/routing-accuracy/README.md` and `runtime/tests/parity/README.md` | Modified | A row for each new file. Briefs 20 and 21 |
| `leaf-manifest.json` and `leaf-aliases.json` | Regenerated | The two new routed leaves, by `ci-skill-root-metadata.cjs --fix` |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerated | The Hermes copy, by `sync-skills-hermes.cjs` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its three fixtures | Regenerated | Rebuilt from `git archive HEAD` in their own commit, `64968e9b58` |
| `scratch/w3-build/` | Created | The build record: `build-evidence.md`, the briefs and their bodies, the doc sidecars, the probe, the logs and the run outputs |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

Every path above except the trigger index, the Hermes copy and this folder is under `.skilled/skills/system-skill-advisor/`. The build commit `807ce287be` holds 443 files, 15 build paths and 428 record files. The follow-up `3d3885274d` holds 71, 5 skill files and 66 record files. The index commit `64968e9b58` holds 4. `git diff --name-only 31cf3bf2af HEAD`, with this folder left out, lists 19 paths, each one a row of `spec.md` Files to Change.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator released the phase on 2026-09-28 (parent `goal.md` D3), and it was built third, after 008 and 016. A build orchestrator, Opus 5.5 at xhigh, took a baseline and ran a read-only planning probe. It then sent 40 single-change briefs from `scratch/w3-build/briefs/` by Bash: 23 to Cursor `grok-4.7-xhigh-fast`, 5 to Devin `deepseek-v4-1-flash-max` and 12 to Pi `cline-pass/cline-pass/deepseek-v4.1-flash` at xhigh. Every handback read `STATUS: DONE` on first dispatch, and each tree diff held only the files its brief named. The one corrective brief, 12b, updated a gate test that brief 12's new arm had made stale.

The orchestrator session made both live runs and got four cross-family reviews of the code from a Claude `review` agent. Round 1 failed on one P0 and two P1s, fixed by briefs 30 to 34. Round 2 failed on one P1 that a fix had introduced, fixed by brief 35. Round 3 passed with two P2s. The session committed the build as `807ce287be` and rebuilt the trigger index as `64968e9b58`. It then closed the two P2s with briefs 36 to 38, and round 4 passed with one doc P2, closed by briefs 39 and 40. The session committed that follow-up as `3d3885274d` and reran the gates from the final state. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new script instead of extending `score-outcome-rerank.mjs` | That script promises a read-only eval of outcome weights, runs on import and its flip rule decides that flag, so a network arm inside it would change what it means. A separate file deletes cleanly |
| The default run makes zero calls and prints the power line first | The census can end the work at zero movable rows before anything is billed, and the power line tells the operator whether a `keep` is reachable at all |
| Gold-first rows count as decided rows | A movable-only deck cannot lose, so a pick that demotes correct rows could still earn `keep`. Here the gold was demoted on 21 Jev rows and 24 Deem rows |
| An aggregate flip rate replaces a per-row one | With 3 reruns a row's rate is 0, 1/3 or 2/3, so a per-row limit of 0.10 is a unanimity test |
| One `--provider` on the gate, `auth test` and every judgment | `auth status` defaults to `official` while judgments follow `JEV_PROVIDER`, so an unscoped check can pass or fail for the wrong key |
| Every gate failure exits 0 with the census intact | Dormant is the normal state without a key, so the report says which check stopped the arm instead of failing the run |
| A passing gate needs `--out` before it calls | REQ-009 says every call is recorded, and without `--out` a run spent calls and kept no record. The refusal sits after the gate, so a failed gate still exits 0 (parent D1) |
| The keep rule is fixed in full before any run, and pre-fix Deem runs are VOID | Parent D4 lets a Deem `keep` here unlock phase 009, so its inputs, order and verdict line cannot change after the numbers are seen. The Deem run computed with the old flip count stays on disk as VOID, and the deciding run came after the fix |
| The Jev run was not repeated after the fixes | Its `calls.jsonl` holds no exit 4 and no three-way row, and a recompute with the fixed code gives the same verdict line byte for byte, so a second paid run would measure nothing new |
| `SKILL.md`'s `description` and Keywords line stay unchanged | The advisor's projection reads both, so a doc edit there could move the pinned 53/70 and void every run. The census still reads 53/70 after every doc edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

`E` is `scratch/w3-build/build-evidence.md`, `R` is `scratch/w3-build/runs` and `S` is the script. The session rows come from the orchestrator session's record, which reran the gates from the final state and wins where the two records differ.

| Check | Result |
|-------|--------|
| Build, baseline at HEAD `10697dcceb` | `npm run build` exit 0. Full advisor suite `Test Files 129 passed (129)`, `Tests 971 passed \| 6 skipped (977)`, exit 0. Typecheck clean. `validate_document.py` 9 of 9 exit 0. Playbook `scenarios=47 violations=0`, skill-root metadata 16 of 16, Hermes 73 in sync (`E` section 1) |
| Build, each brief | `node --check` exit 0 after every script brief, and the eval file green after each one, 7 cases after brief 01 up to 55 after brief 37 (`E` sections 3, 10, 11 and 13) |
| Build, proof P1 default run with logging stubs first on PATH | Census, `baseline: holdout_top1=53/70`, four comparators and the power line, exit 0, neither stub log created, porcelain unchanged (`E` section 5) |
| Build, proof P2 gate skips | `jev arm skipped: no credential` with `provider=openrouter`, `jev arm skipped: version` with `found="jev 0.2.3"`, `deem arm skipped: stub backend` and `deem arm skipped: model` with `found="deem-1.5"`. Each exit 0 with the census as a byte-identical prefix and no judgment in the stub logs |
| Build, proof P3 no key and one provider | `grep -nE 'API_KEY\|TYPESAFE' S` no match, exit 1. Jev stub log 336 lines, 335 with exactly `--provider openrouter` and the other `--version`. `cli-deem` stub log 529 lines, none with `--provider` or a key-like word |
| Build, proof P6 read-only | Porcelain identical before and after the census, P1 to P3, the Jev run and the Deem run |
| Live, keyed Jev run, 16:10:17 to 16:16:26 | Exit 0, 334 calls, the verdict line above. Cost line before the first billed call: `planned_calls=334 est_input_tokens=76857`, no dollar figure |
| Live, deciding Deem run, 16:59:13 to 17:01:05 | Exit 0, 528 calls on one commit pair, the column, verdict and calibration lines above. `server.log` grew by 1 health line and 528 decisions |
| Session, host checks after the build | `grep -nE 'API_KEY\|TYPESAFE'` exit 1. `validate_document.py` 10 of 10 changed skill docs exit 0. The playbook test diff holds only the 47 to 48 counts |
| Session, the gate-skip path from the final state | With a PATH holding only `node`: `--jev` exit 0, `jev: path=none provider=official`, `jev arm skipped: jev not on PATH`. With `CLI_DEEM_URL=http://127.0.0.1:1`: `deem arm skipped: not reachable`, exit 0. Live `--deem` without `--out`: exit 2, `--deem needs --out <dir> so every call is recorded`, the census an identical prefix |
| Session, eval file from the final state | `vitest run tests/parity/score-jev-tiebreak.vitest.ts`: 55 passed, exit 0 |
| Session, full advisor suite from the final state | `Test Files 130 passed`, `Tests 1026 passed`, 6 skipped, exit 0. Against the baseline: +1 file, +55 tests, 0 failures. The `ps` table stayed near 210 KB, well under the 1 MiB helper buffer |
| Session, typecheck and changed docs | `npm run typecheck` exit 0, 0 `error TS`. `validate_document.py` exit 0 on the catalog entry, README and changelog the follow-up changed |
| Session, trigger index | Rebuilt from `git archive HEAD`: generator exit 0, 0 scratch-path leaks, `--check` exit 0 with 23,314 documents, 0 stale, 0 obsolete and 0 untrusted |
| Review round 1 (Claude `review` agent, stub runs) | FAIL: one P0 (a three-way split counted 2 non-modal answers where the Keep Rule counts 3), two P1s (a Deem verdict printed before the `noul` pass, an exit-4 first attempt missing from `calls.jsonl` and p50/p95) and one P2 folded in (`--jev` without `--out`). The reviewer recomputed the Jev `kill` independently: decided 38, wins 11, losses 27 |
| Review round 2 | FAIL: the round-1 findings fixed, one new P1 (the `--out` refusal ran before the census and the gate). Two P2s recorded as open items. The reviewer recomputed the Deem `kill`: decided 38, wins 8, losses 30 |
| Review round 3 | PASS: the P1 closed on every path, with zero paid spawns wherever the gate fails. Two P2s, closed by briefs 36 and 37 |
| Review round 4 | PASS: the `--deem` refusal adds no call before it and the tests assert behavior. One doc P2, closed by briefs 39 and 40. No open P0 or P1 on this phase's code |
| Closure pass, read-only | Every `calls.jsonl` line carries its required fields: 334 of 334 Jev lines, and 333 Deem `choice` lines plus 195 `noul` lines, all on one commit pair (`node` over `R/jev/` and `R/deem-review/`). `cmp` of the pre and post porcelain snapshots of the Jev, Deem and default runs: identical. `cmp` of `R/r38-default.stdout.txt` and `R/p1-default.stdout.txt`: exit 0. The three commits' paths match Files to Change. The test file has no exit 130 case and no answer outside the submitted keys |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0: the graph metadata re-derived from the closed docs |
| Closure pass: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines. `STATUS_CROSS_DOC_CONSISTENCY` reads Complete in both `spec.md` and this file |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `packet_budget=unknown` and `packet_durable_chars=9481`, as expected for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **The playbook inventory test.** `runtime/tests/manual-testing-playbook.vitest.ts` pins the scenario count and failed at 48, and `spec.md` Files to Change did not list it. Parent D6 requires the scenario and parent criterion 4 requires no new suite failure, so brief 26 changed its six `47`s to `48`. The host judged it a mechanical consequence of the new scenario, and Files to Change now lists it.
2. **Changelog number.** The spec numbered the entry after `v0.11.1.0.md`, but `main` already carries `v0.11.2.0.md` and `v0.12.0.0.md`. The entry is `v0.13.0.0.md` so nothing collides on merge.
3. **Literal text by sidecar.** The three new docs were too long for a short brief, so their text sat in `scratch/w3-build/content/` and Pi copied it byte for byte, `cmp` exit 0 each.
4. **Report directories inside the repository.** The live runs wrote to `scratch/w3-build/runs/`, which the build prompt named, not a directory outside the repository. REQ-006 allows that, and the porcelain was the same before and after.
5. **Four live Deem runs, not one.** The first found the server down, the second stopped on a duplicate option description, the third is VOID because it used the old flip count, and the fourth decided. Nothing left the machine.
6. **A refusal the spec did not name.** A passing gate that would call now needs `--out`, to meet REQ-009. A failed gate is unchanged.
7. **Alias options for Deem.** `cli-deem` refuses two options with the same text, so the Deem arm appends ` [key]` to a description two keys in one cluster share, such as `memory:save` and `command-memory-save`.
8. **Corpus privacy.** `spec.md` section 7 asked the operator to decide before the keyed run. The session settled it under parent D7, because the corpus is committed and on `origin/main` of a public repository.
9. **Index regeneration.** The build leaf moved two gitignored local files aside and back while rebuilding the index, sha1 identical. The session instead rebuilt the committed index from a HEAD archive in its own commit.
10. **Criteria amended at close.** Criterion 4 now names the spawn cap rather than a 90 s hang, because the test injects a 1,500 ms cap. Criterion 6 now reads the three commits rather than a live `git status`, and it names the playbook inventory test. `goal.md` logs both reasons.
11. **No changelog refresh.** The phase metadata asks for a refresh under `../changelog/`, which does not exist, and no phase of this packet wrote one.
12. **Devin permission mode.** The session's pre-flight logged cli-devin's `--permission-mode dangerous` approval as a deviation for the operator. This phase's dispatch records name only the executor, so whether its Devin briefs used that mode is not recorded.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No Deem keep, so phase 009 stays locked.** Both columns printed `kill`. The decision on 009 passes to phase 017.
2. **Open Keep Rule question: alias keys.** The modal pick counts `memory:save` and `command-memory-save` as two answers. Counting them as one gives 13 unstable rows and a flip rate of 0.2643, still `kill`. The reviewer reports decided 38, and the build leaf's recount gives decided 37 with 29 losses, a difference that stays UNKNOWN until one canonical rule is fixed. Settle it before any rerun on a new commit pair.
3. **Two tasks left open.** No test drives exit 130, which the script handles at `S:949`, `:991`, `:1082` and `:1173` (T025). No stub run or test answers a key outside the submitted set, a branch read at `S:1067-1077` and not run (T014).
4. **The alias-option test stub ignores option text.** It proves the ` [key]` suffix reaches the argument list, not that the real client accepts the options or maps the answer back. The reviewer of round 2 confirmed that brief 30 maps every live Deem answer to the right key.
5. **An adjacent advisor test helper.** `runtime/tests/skill-advisor-cli-test-utils.ts:224-229` calls `spawnSync('ps')` with the default 1 MiB buffer. It fails 3 orphan-reaping tests with ENOBUFS when the process table is larger, which the session saw at 1.4 MB during the 008 build. This is environmental and outside this phase's code.
6. **Deem estimates ran low.** The cost line's `est_wall_s=34.6` used the planning p50 of 65.6 ms. The run measured 241 ms at p50 and 340 ms at p95 per call.
7. **The Deem update fix is not yet proven.** The session gave the update job `AbandonProcessGroup`, so a restart inside the job should outlive it. That the next real release leaves the server running is INFERRED until one lands under launchd.
8. **Untested live paths.** The Jev half of the calibration and the column comparison each passed their tests but never ran live, because the census was not `underpowered` and each run had one column.
9. **Older README gaps.** `runtime/scripts/routing-accuracy/README.md` tables 3 of its folder's 8 code files and `runtime/tests/parity/README.md` 2 of 7 test files. The build added only its own rows.
<!-- /ANCHOR:limitations -->

---
