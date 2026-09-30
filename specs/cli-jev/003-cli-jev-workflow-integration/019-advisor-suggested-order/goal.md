---
title: "Goal: Phase 19: advisor-suggested-order"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "advisor suggested order goal"
  - "score-suggested-order completion criteria"
  - "near-tie order keep rule"
  - "advisor child budget verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order"
    last_updated_at: "2026-09-30T10:07:58Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Recorded the operator's live Jev run and its kill verdict"
    next_safe_action: "Orchestrator commits the phase docs and the parent goal's log"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-019-advisor-suggested-order"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: advisor-suggested-order

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem choice that reorders the skill advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget when every call is timed inside a child spawned like the prompt shim's.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-suggested-order.mjs` in system-skill-advisor's `runtime/scripts/routing-accuracy/`, new `runtime/tests/parity/score-suggested-order.vitest.ts`, two folder README rows and, per parent D6, the advisor's `SKILL.md` (description and Keywords unchanged), README, changelog, catalog and playbook, with the playbook test's pin moved to 49. Phase 002's script is imported, never edited. No hook, scorer, ratchet or corpus file changes |
| D2 | The default run makes zero calls. It prints 002's census, three zero-call orders and the advisor-only child p50 and p95. Below 5 movable rows, or with an advisor p95 over 2,200 ms, it prints `no headroom` and no arm calls |
| D3 | A column's order is the cluster sorted by mean probability over three left rotations. Each call runs inside a child spawned with `process.execPath`, a 2,500 ms timeout and `SIGKILL`, which runs the advisor first. A partial probability map is `unmeasured` |
| D4 | Spec section 4's Keep Rule decides each column, in order: coverage `10*M >= 9*K`, `kill` when P(X >= L) <= 0.05, a mean reciprocal-rank gain of at least 0.05 over the best zero-call order, sign test p < 0.05, flips `10*F <= 3*M` and child p95 <= 2,200 ms. It prints `verdict <backend>: keep`, `kill` or `stop (<reason>)` with its identity. A keep serves nothing |
| D5 | Jev first, else Deem (parent D1). Each arm runs only behind its own switch and 002's gate: `jev 0.6.2` with `jev auth status --provider P` exiting 0, or a passing `cli-deem health`. A failed gate prints one skip line and exits 0. A `--jev` run happens only on the operator's flag. No key in any file and no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` exits 0 and prints `holdout_top1=53/70`, `advisor child: p50=`, `margin: 0.05` and either `no headroom` or `planned calls:`, while stub `jev` and `cli-deem` binaries first on `PATH` log zero calls (proof P1)
- [x] With `--deem --out <dir>` and a stub `cli-deem health` reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub whose `auth status --provider official` exits 3 it prints `jev arm skipped: no credential`. Both exit 0, and `diff` against criterion 1's stdout shows only the `deem arm skipped:` or `jev arm skipped:` line (proof P2)
- [x] From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/parity/score-suggested-order.vitest.ts` exits 0 with at least 20 passed tests and 0 failed (proof P3)
- [x] Either a run with no switch printed `no headroom`, or one `--deem --out <dir>` run printed a `verdict deem:` line and wrote a `calls.jsonl` whose every line holds a child wall time, a model commit and a source commit (proof P4)
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-suggested-order.mjs` exits 1, and `git status --porcelain` is identical before and after the runs in criteria 1, 2 and 4 (proof P5)
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED` (closure pass)
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
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R3, docs only |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: 18 single-change briefs from `scratch/w4-build/briefs/`, Devin 12 and Pi 6, each `STATUS: DONE`. `score-suggested-order.mjs` 710 lines, its test 856 lines with 45 cases, 9 skill docs. Source: `scratch/w4-build/build-evidence.md` and `scratch/w4-build/evidence-tail.draft.md` section 3 |
| Proof plan P1 to P5 | Done | Rerun from the final state by the session: the zero-call run, both gate skips, 45 tests, the live Deem run and the grep and porcelain checks. Source: `scratch/w4-session/session-evidence.md` section 2 |
| Live Deem run | Done | `node score-suggested-order.mjs --deem --out scratch/w4-session/p4-deem`, exit 0 in 597 s, 333 calls, 5 `unmeasured_timeout`. Verdict lines below. Source: `scratch/w4-session/p4.stdout.txt` |
| Live Jev run | Done | 2026-09-30: the operator answered "Yes, run it" and the session ran `node score-suggested-order.mjs --jev --out <dir>`, exit 0 in 558 s, 333 calls, 0 timeouts, all 334 `calls.jsonl` records `measured` on attempt 1, so every probability map held every submitted key. Advisor p50 718 ms, p95 1,088 ms, 0 over 2,200 ms. Verdict below. Source: `scratch/w4-session/jev-run/` |
| Cross-family review | Done | Pi MiMo on the code and Devin DeepSeek on the docs, both `VERDICT: PASS`, no open P0 or P1, 4 P2 below. Source: `scratch/w4-session/session-evidence.md` section 3 |
| Commit | Done | `6aa7ca0980`, 15 files, not pushed. The trigger index rebuild follows in its own commit. Source: `scratch/w4-session/session-evidence.md` section 4 |
| Phase docs | Done | 2026-09-29 closure pass: `tasks.md`, `spec.md`, `plan.md`, this goal and `implementation-summary.md` record the build, and the four gates are in `implementation-summary.md` Verification |

### Verdict lines

`verdict deem: kill K=111 M=108 W=9 L=35 F=86 p=1.0000 mrr=0.6176/0.7750 p95_ms=1686 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`

`verdict jev: kill K=111 M=111 W=13 L=25 F=13 p=0.9832 mrr=0.7260/0.7811 p95_ms=1490 jev_version=0.6.2 provider=official model=jev-1.13.0`

The Jev column's mean reciprocal rank of 0.7260 sits below the scorer's 0.7811 on the same 111 rows, with 13 wins and 25 losses. Its in-child p95 was 1,490 ms, under the 2,200 ms ceiling. With Deem's `kill` above, both backends now print `kill` for this phase. Nothing is served and the advisor's order is unchanged. Source: `scratch/w4-session/jev-run/stdout.txt` and `report.json`.

Zero-call lines beside it: `advisor child: p50=629 p95=929 max=2500 over_2200=4 children=241 killed=1` on the build's final zero-call run, `advisor child: p50=779 p95=1011 max=1787 over_2200=0 children=241 killed=0` in the Deem run and `advisor child: p50=718 p95=1088 max=1668 over_2200=0 children=241 killed=0` in the Jev run.

T008 map check: every Deem non-timeout answer carried a probability for every submitted key (328 of 333 `calls.jsonl` lines `measured`, 5 `unmeasured_timeout`, `scratch/w4-session/p4-deem/calls.jsonl`), and every Jev `choice` call was `measured` on attempt 1, so every map held every submitted key, with each row's three option orders returning the same key set (`scratch/w4-session/jev-run/calls.jsonl`).

### Deviations and findings

Sources below: build tail is `scratch/w4-build/evidence-tail.draft.md`, session record is `scratch/w4-session/session-evidence.md`.

| Item | Note |
|------|------|
| Prior verdicts | Phase 002 printed `kill` on both backends for the pick-first form: Jev `decided=38 wins=11 losses=27 p_loss=0.0069` on `jev-1.13.0`, Deem `decided=38 wins=8 losses=30 flip=0.3123` on `8cbabbb`/`c8a5523`. This phase tests the whole-cluster order and the in-child budget, which 002 did not |
| Seam lines rechecked 2026-09-29 | Commit `9ccb4dd416` moved the shim's budget clamp from `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105-108` to `:106-111` and its spawn from `:109-117` to `:113-120`, with the 2,200 ms ceiling unchanged. `user-prompt-submit.ts:22-24`, `ambiguity.ts:22-36`, `:44-58`, `lane-registry.ts:21-29`, `:33-38`, `fusion.ts:69`, `:111-114` and `shadow-sink.ts:86-100`, `:144-155` resolve unchanged |
| Latency prior | 002's `calls.jsonl` files give `choice` p95 of 340 ms on Deem and 2,830 ms on Jev, timed outside the advisor child. The Jev figure alone exceeds 2,200 ms |
| Deviation 1 | Deem health timeout: the imported `deemGate` holds `HEALTH_TIMEOUT_MS` 10,000 ms, not the 2,000 ms REQ-002 first named. The gate runs unchanged, and the close pass picked the imported bound (build tail §8) |
| Deviation 2 | A gate skip re-measures `advisor child:`, so its output is byte-identical apart from that one line. P2 compares with the line masked (build tail §8) |
| Deviation 3 | The `--out` refusal exits 2 before any output, this phase's REQ-010 order, where 002's script refused after its gate (build tail §8) |
| Deviation 4 | The verdict line's `p=` prints the sign-test P(X >= W), and the loss test goes to `report.json` as `p_loss` (build tail §8) |
| Deviation 5 | F counts, per measured row, 3 minus the count of the most common top answer, so a three-way split adds 2 flips (build tail §8) |
| Deviation 6 | The margin compare `20*(SA-SB) >= M` uses a 1e-9 tolerance, so a float sum at the margin is not lost to rounding (build tail §8) |
| Deviation 7 | `none` abstains only when its mean is strictly above every cluster key's. A top tie reorders the cluster, and the close pass corrected the spec sentence to match (build tail §8) |
| Deviation 8 | One `optionArgs` helper appends ` [key]` when two cluster skills share a projection description, so no two options are identical text (build tail §8) |
| Deviation 9 | `childEnv` sets `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=1`, so the capture-env daemon idles out after a minute instead of 30 (build tail §8) |
| Deviation 10 | Size: the script is 710 lines and the test 856 with 45 cases, over the plan's 350 to 500 estimate. The extra is the timed child, both arms' exit handling and the report (build tail §8) |
| Deviation 11 | `ci-skill-root-metadata.cjs --fix` ran scoped to `system-skill-advisor`, because another skill's root was stale from another worker (build tail §8) |
| Re-dispatch 06b | Brief 06's latency test pinned `killed=0` and flaked under machine load. The test-only re-dispatch dropped the pin and asserts `p95 > 2200` (build tail §7) |
| Review P2 1 | Pi: abstention needs `none` strictly above every cluster key, so a tie at the top reorders instead of abstaining. Recorded, not chased (session record §3) |
| Review P2 2 | Pi: the `auth_test` line in `calls.jsonl` holds `wall_ms` rather than `child_wall_ms`, no row id, order or probabilities, and reuses `measured\|unmeasured` (session record §3) |
| Review P2 3 | Devin: `SKILL.md:383` names Jev and Deem but not the literal `--jev` and `--deem` switches (session record §3) |
| Review P2 4 | Devin: the catalog entry and changelog say each arm asks every eligible row three times, which omits the Deem arm's 25-key cluster cap (session record §3) |
| Close amendment, REQ-002 | The 2,000 ms health bound became 002's `HEALTH_TIMEOUT_MS` of 10,000 ms, on the build record's deviation 1, which asks the phase docs to pick one |
| Close amendment, none tie | The order sentence now says `none`'s mean strictly above every cluster key's, the built rule, from the build record's deviation 7 and review P2 1 |
| Close amendment, T018 and criterion 1 | T018's `done as not requested` clause and the `all` wording in `tasks.md` Completion Criteria now leave T008 and T018 open for the operator, parent D4 (2026-09-29) |
| Premises at close | The Deem source commit is `3883f79261e5c61d3e8f230cad02b50c6d2b1891`, where 002's docs hold `c8a5523`. `cli-deem` is not on `PATH` and resolved through the repo client. A real `jev` sits at `~/.local/bin/jev`, so every stub run pinned stubs first on `PATH`. Advisor timing is load-sensitive (build tail §9) |
<!-- /ANCHOR:log -->
