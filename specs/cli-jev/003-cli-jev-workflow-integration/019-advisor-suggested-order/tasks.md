---
title: "Tasks: Phase 19: advisor-suggested-order"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "suggested order tasks"
  - "score-suggested-order tasks"
  - "advisor child timing tasks"
  - "near-tie order verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: advisor-suggested-order

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

`S` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` and `T` is `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts`, both created in this build. Parent D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel.

Evidence comes from two records. `E` is `scratch/w4-build/build-evidence.md`, the build orchestrator's record, with its dispatch log, proof results, deviations and premises in `scratch/w4-build/evidence-tail.draft.md` (`E-tail`) and its raw logs and runs in `scratch/w4-build/logs/` and `scratch/w4-build/runs/` (`R`). `SE` is `scratch/w4-session/session-evidence.md`, the orchestrator session's record, with its live Deem run in `scratch/w4-session/p4-deem/` (`RS`). The session reran the gates from the final state and wins where the two records differ. The build is committed as `6aa7ca0980`, with the trigger index rebuild in its own follow-up commit. T008 and T018 stay open for the operator under parent D4: both wait on the operator's `--jev` run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build the advisor `dist`, run the H1 ratchet and read 53/70, then record the advisor package's vitest pass and fail counts as the baseline (`.skilled/skills/system-skill-advisor/runtime/`). Evidence: `dist-freshness.cjs` reported `dist is fresh` at the build's starting HEAD `bf830c3d47`, so no rebuild ran; the full advisor suite, which holds the H1 ratchet `tests/parity/scorer-eval-baseline-ratchet.vitest.ts`, printed `Test Files 130 passed (130)`, `Tests 1030 passed | 6 skipped (1036)`, exit 0; the census read `baseline: holdout_top1=53/70` (`E` section 1, `R/p1-final.stdout.txt`)
- [x] T002 Read the owner's contracts before writing: `score-jev-tiebreak.mjs` and its exports, `capture-scorer-eval-baseline.mjs:35-46`, `hooks/claude/user-prompt-submit.ts` around `handleClaudeUserPromptSubmit` (`:252`) and the shim `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22-24`, `:106-120`. Record what the hook writes when run under the capture env, and route the code write through sk-code's OpenCode route. Evidence: the build's planning probes ran the built hook in children spawned like the shim and recorded that it writes diagnostics to `os.tmpdir()/speckit-skill-advisor-metrics/` only under `SKILL_ADVISOR_DEBUG`, that the directive-lifecycle store and the observed-policy recorder write nothing without a session id, and that the advisor CLI starts a daemon for the temp `SYSTEM_SKILL_ADVISOR_DB_DIR` (`E` section 1). Brief 01 fixed the OpenCode patterns the code write follows, a MODULE banner with the durable why, exported pure functions with JSDoc and 2-space ESM, and the session's comment-hygiene checker exited 0 on `S`, `T` and the playbook pin test (`E-tail` section 3, `SE` section 2). No dispatch record shows a sk-code router call, noted in `implementation-summary.md`
- [x] T003 [P] Build the synthetic corpora for `T`: one with 4 movable rows, one with 6 movable rows and clusters of 2 to 4 keys, and a stub advisor child that sleeps a set time (`T`). Evidence: `censusOf(movable)` builds the 4-movable and 6-movable corpora (`T:419-423`) and `stubChild()` sleeps 2,300 or 5,000 ms by prompt prefix (`T:53`), with 20-row keep-rule corpora beside them. The built corpora use 2-key clusters with a 1-key solo row, and the order-builder case is 3-key (`T:178`): no 4-key cluster case was built, recorded in `implementation-summary.md`. All 45 tests passed (`E` section 5, `SE` section 2, P3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Census and zero-call orders from 002's exports under the capture env: per-file counts, holdout top-1, MRR, right@1 and right@3 for the scorer's order, confidence order and always-second on identical rows, the rerank on held-out rows only, and `baseline mismatch: comparison void` on any number but 53/70 (`S`). Evidence: every run prints `baseline: holdout_top1=53/70`, `comparator: name=scorer rows=111 mrr=0.7811 right1=76 right3=99`, `confidence rows=111 mrr=0.7766 right1=75 right3=99`, `always_second rows=111 mrr=0.5498 right1=25 right3=99`, `rerank rows=57 mrr=0.7588 right1=37 right3=51`, and the void case returns 1 and prints `baseline mismatch: comparison void` (`R/p1-final.stdout.txt`, `RS/p4.stdout.txt`, `T:507-509`)
- [x] T005 Advisor-only timing: one child per skill-firing prompt, `process.execPath`, `timeout: 2500`, `SIGKILL`, running `handleClaudeUserPromptSubmit`, and the line `advisor child: p50=<ms> p95=<ms> max=<ms> over_2200=<n>` (`S`). Evidence: `advisor child: p50=629 p95=929 max=2500 over_2200=4 children=241 killed=1` on the build's final zero-call run and `p50=779 p95=1011 max=1787 over_2200=0 children=241 killed=0` in the session's Deem run (`R/p1-final.stdout.txt`, `RS/p4.stdout.txt`)
- [x] T006 Power line, `no headroom (movable)` below 5 movable rows, `no headroom (latency)` when the advisor-only p95 is over 2,200 ms, `margin: 0.05` and the `keep rule:` line, all before any call (`S`). Evidence: `power: movable=23 decided_ceiling=99 min_wins=16 win_rate_80=0.749`, `planned calls: jev=334 deem=333`, `margin: 0.05` and the `keep rule:` line print before any gate or cost line (`R/p1-final.stdout.txt`), and both headroom lines pass in vitest at 4 movable rows and with a stub child over 2,200 ms (`T:399-415`, `:500`)
- [x] T007 Stop point: when the real-tree zero-call run prints `no headroom`, record the line in `goal.md`'s log and skip T008 to T012. Evidence: not triggered. The real-tree run printed `planned calls: jev=334 deem=333`, not `no headroom` (`R/p1-final.stdout.txt`, `RS/p4.stdout.txt`), so T008 to T012 were built and the Deem arm ran
- [ ] T008 Read one real `cli-deem choice` answer and, only on the operator's `--jev`, one real `jev choice` answer. Record in `goal.md`'s log whether each `probabilities` map holds every submitted key (`goal.md`). Open for the operator under parent D4, not a failure. The Deem half is done and recorded in `goal.md`'s log: the session's live run read 333 real `cli-deem choice` answers and every non-timeout map held every submitted key, 328 of 333 `calls.jsonl` lines `measured` and 5 `unmeasured_timeout` (`RS/p4-deem/calls.jsonl`). The Jev read runs only on the operator's `--jev`, and whether Jev returns a probability for every submitted key stays UNKNOWN until then (`SE` section 5)
- [x] T009 Gates through 002's `jevGate` and `deemGate`, the payload and cost lines of REQ-010 and the exit 2 refusal of `--jev` or `--deem` without `--out` before any output (`S`). Evidence: briefs 05, 07 and 08 wired `main`, both gates and both arms, the refusal exits 2 with empty stdout and stderr `--jev and --deem need --out <dir> so every call is recorded` (`S:650`, `T:457-472`), and proof P2 printed `deem arm skipped: stub backend`, `jev: path=<stub>/jev provider=official` and `jev arm skipped: no credential`, each exit 0 (`R/p2-deem.stdout.txt`, `R/p2-jev.stdout.txt`). Note: the imported gate holds `HEALTH_TIMEOUT_MS` 10,000 ms (brief 08), not the 2,000 ms REQ-002 first named; corrected at close
- [x] T010 Timed child for the arms: advisor, then `cli-deem health` for Deem, then one `choice` through 002's `spawnCall`, returning wall, advisor and call ms, exit code and the full map. A kill at 2,500 ms marks the row `unmeasured_timeout` (`S`). Evidence: briefs 03 and 06 (`childMain`, `runTimedChild`, `childEnv`, `runArm`), and every `calls.jsonl` line of the session's Deem run carries `child_wall_ms`, `advisor_ms`, `health_ms`, `call_ms`, `exit_code`, the raw `probabilities` and a status, with 5 lines `unmeasured_timeout` at `child_wall_ms` 2500 (`RS/p4-deem/calls.jsonl`)
- [x] T011 Both arms: three left rotations per eligible row, REQ-009's exit handling, `calls.jsonl` with the identity fields, and the order builder with mean probabilities, scorer-order ties, `reorderSlots`, `none` as abstention and a partial map as `unmeasured` (`S`). Evidence: briefs 06, 07 and 08. The vitest cases cover a tie kept in scorer order, a `none`-first row kept as scorer order, a partial map `unmeasured`, a Deem backend-refused stop (`T:626-636`) and one `--provider` on every stub `jev` call (`E` section 5, P3). The built rule keeps the scorer's order only when `none`'s mean is strictly above every cluster key's, so a tie at the top reorders the cluster (deviation 7 in `E-tail` section 8, review P2 1)
- [x] T012 Verdict per column, the Keep Rule's seven steps in order with integer comparisons, 002's `binomTail` and the verdict line on stdout and in `report.json` (`S`). Evidence: briefs 02 and 09 (`judgeColumn`, `verdictLineFor`, `columnLine`, `buildReport`). The session's Deem run printed `verdict deem: kill K=111 M=108 W=9 L=35 F=86 p=1.0000 mrr=0.6176/0.7750 p95_ms=1686 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`, and `RS/p4-deem/report.json` holds the same line under `columns.deem.verdict`. The five verdict shapes `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (latency)` pass in vitest (`E` section 5, P3)
- [x] T013 [P] One row each in the two folder READMEs (`runtime/scripts/routing-accuracy/README.md`, `runtime/tests/parity/README.md`). Evidence: brief 16 (pi), `STATUS: DONE`, a row and the folder count 4 code files in the first, a tree line and a row in the second, each grep-checked (`E-tail` section 3)
- [x] T014 After the runs, the system-skill-advisor docs through sk-doc: `SKILL.md` version line and pointer with `description` and Keywords unchanged, README, the next changelog file, catalog entry `feature-catalog/scorer-fusion/suggested-order-eval.md` with its index row and playbook scenario `manual-testing-playbook/scorer-fusion/suggested-order-eval.md` with its index row (`.skilled/skills/system-skill-advisor/`). Evidence: briefs 10 to 15 (pi), `STATUS: DONE`. `SKILL.md` moved 0.13.0.0 to 0.14.0.0 with `description` and the Keywords comment unchanged, `README.md` gained the §8 verification row, `changelog/v0.14.0.0.md`, the catalog entry landed with its index row (45 features, scorer-fusion 8) and the playbook scenario with its index row (49 scenarios). `validate_document.py` exited 0 on all 9 changed docs (`SE` section 2, G2). The three new doc texts were typed with `validate_document.py --type` and copied byte for byte from `scratch/w4-build/content/` (`E-tail` section 4)
- [x] T015 Move the six `48` pins in `runtime/tests/manual-testing-playbook.vitest.ts:45-55` to `49`, then regenerate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`, the Hermes copy with `sync-skills-hermes.cjs` and the trigger index when its `--check` reports stale docs. Evidence: brief 13 moved the pins, brief 17 ran `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` (`checked=1 passed=1 failed=0`, scoped because another skill's root was stale from another worker, deviation 11), the session ran `sync-skills-hermes.cjs` (`system-skill-advisor` in sync) and `skill_graph_compiler.py --validate-only` `VALIDATION PASSED`, and the trigger index was rebuilt from an archive of HEAD in its own commit (`SE` sections 2 and 4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/parity/score-suggested-order.vitest.ts` exits 0 with at least 20 passed tests: the happy path and edge case of each REQ-011 surface, including `no headroom (movable)`, `no headroom (latency)`, a `none`-first row, a partial map, a child killed at 2,500 ms, each gate skip with byte-identical output and the five verdict shapes (`T`). Evidence: `Test Files 1 passed (1)`, `Tests 45 passed (45)`, exit 0 (`SE` section 2, P3; `E` section 5, P3). The gate-skip cases inject the timing, so their lines compare byte for byte; a real run re-measures `advisor child:`, deviation 2
- [x] T017 One zero-call run on the real tree with stub `jev` and `cli-deem` first on `PATH`. Both stub logs stay empty. Record the census totals, the three MRRs, the advisor child line and the headroom line in `goal.md`'s log. Evidence: the session reran it from the final state, exit 0, `baseline: holdout_top1=53/70`, the four `comparator:` lines, `power:`, `advisor child:`, `planned calls: jev=334 deem=333`, `margin: 0.05` and the `keep rule:` line, with no stub log written (0 calls) (`SE` section 2, P1). Recorded in `goal.md`'s log from `R/p1-final.stdout.txt`: labeled `rows=177 eligible=93 movable=22`, holdout `rows=64 eligible=18 movable=1`, `movable=23`, MRR scorer 0.7811, confidence 0.7766, always_second 0.5498 and rerank 0.7588 on 57 rows, `advisor child: p50=629 p95=929 max=2500 over_2200=4 children=241 killed=1`
- [ ] T018 Only when the operator passes `--jev`: one `--jev --out <dir>` run. Record the identity line, the verdict line and p50 and p95 in `goal.md`'s log. The build never waits for the flag (parent D7). With no flag by close, parent D4 (2026-09-29) leaves this row open for the operator instead of done as not requested, and the close pass amended that clause for that reason. Open for the operator: the live `--jev` run sends routing-corpus prompts and skill projection descriptions (both committed) to the hosted classifier, about 334 calls, and waits on the operator's yes (`SE` section 5). Command: `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs --jev --out <dir>`
- [x] T019 Unless T017 printed `no headroom`: one `--deem --out <dir>` run against the served instance. Record the verdict line with its commit pair and p50 and p95 in `goal.md`'s log. Evidence: the session ran `node score-suggested-order.mjs --deem --out scratch/w4-session/p4-deem`, exit 0 in 597 s (`SE` section 2, P4; `RS/p4.stdout.txt`): `advisor child: p50=779 p95=1011 max=1787 over_2200=0 children=241 killed=0`, `deem: health backend=torch model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`, `deem: calls=333 timeouts=5`, `column deem: rows=111 measured=108 wins=9 losses=35 ties=64 abstentions=13 flips=86 baseline=scorer p_loss=0.0001 calls=333 p50_ms=1140 p95_ms=1686` and `verdict deem: kill K=111 M=108 W=9 L=35 F=86 p=1.0000 mrr=0.6176/0.7750 p95_ms=1686 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`. Recorded in `goal.md`'s log
- [x] T020 `git status --porcelain` is identical before and after T017 to T019, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `S` exits 1. In a passing stub `--jev` run every logged call carries one `--provider` value. Evidence: the grep exits 1 and the advisor-side porcelain was the same before and after P1, P2 and the live Deem run (`SE` sections 2 and 5, `E` section 5). The passing stub Jev runs in vitest log one `--provider` on every call and none on `--version`, and the P2 stub log holds only `--version` and `auth status --provider official` (`E` section 5, P2 and P3)
- [x] T021 Rerun the H1 ratchet and the census after the doc edits and read 53/70, then run the advisor package's full vitest suite and compare with T001's baseline. Evidence: the session reran the census from the final state, `baseline: holdout_top1=53/70` (`SE` section 2, P1), and the full suite printed `Test Files 131 passed (131)`, `Tests 1075 passed | 6 skipped (1081)`, exit 0, against T001's baseline of 130 files, 1,030 passed and 6 skipped: +1 file, +45 tests, 0 new failures. The H1 ratchet sits inside that suite (`SE` section 2, G1)
- [x] T022 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every skill doc T013 and T014 changed (parent D6). Evidence: exit 0 on all 9 changed docs, and the comment hygiene checker exit 0 on the script, its test and the playbook pin test (`SE` section 2, G2)
- [x] T023 A cross-family review of `S` and `T` leaves no open P0 or P1 finding (parent D5), then the parent orchestrator commits with path-scoped commits. Evidence: Pi MiMo on the code Devin wrote, `VERDICT: PASS` with 2 P2, and Devin DeepSeek on the docs Pi wrote, `VERDICT: PASS` with 2 P2 and REQ-001 to REQ-012 met; SHA-1 over the 14 reviewed files `331370a87a0ce94e9e5a13266a4846eabcc5bb63` before and after both runs; no P0 or P1 open. The session committed the build as `6aa7ca0980`, 15 files, not pushed (`SE` sections 3 and 4). The four P2 findings are recorded in `goal.md`'s log and `implementation-summary.md`, not chased (parent D5)
- [x] T024 Copy every verdict line into `implementation-summary.md` and `goal.md`'s log, and run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`. Evidence: the verdict line and every run line are in both docs, and `validate.sh <this phase> --strict` printed `RESULT: PASSED` in the close pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, except T008 and T018, which parent D4 (2026-09-29) leaves open for the operator because both wait on the operator's `--jev` run. The close pass amended this row's `all` wording for that reason and logged it in `goal.md`'s log
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the zero-call run and the live Deem run ran on the real tree, both rerun from the final state (`SE` section 2, P1 and P4). The `--jev` run is the operator's call
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior verdicts**: See `../002-advisor-jev-tiebreak-arm/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
