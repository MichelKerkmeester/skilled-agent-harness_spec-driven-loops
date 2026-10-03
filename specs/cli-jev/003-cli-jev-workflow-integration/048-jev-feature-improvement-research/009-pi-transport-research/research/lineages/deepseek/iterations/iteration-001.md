---
title: "Iteration 1: What drove the measured result"
trigger_phrases: []
---
# Iteration 1: What drove the measured result

## Focus

The anatomy of `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5
median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022`: the keep rule's arithmetic, the per-row
structure of agreement and disagreement, the probability-distance and latency composition, and the
cost model behind the adopted number.

## Actions Taken

- Read the comparison scorer `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`
  end to end: keep-rule bounds, `judge`, `metricsFor`, `buildReplayPlan`, the Pi arm's cost read and the
  verdict line.
- Rebuilt the whole comparison from the recorded calls: grouped
  `037/scratch/live-run/calls.jsonl` (Pi) and `019/scratch/w4-session/jev-run/calls.jsonl` (CLI) by row,
  recomputed mean maps, top keys, agreement, the median absolute probability difference, and the latency
  percentiles with the scorer's own definitions (`nearestRank`, `topKey`).
- Decomposed the five disagreement rows at order level and mean level, and measured how disagreements
  distribute against each row's top-2 margin.
- Checked the cost model's inputs against what the recorded calls actually store.

## Findings

1. The verdict is the keep rule's three fixed bounds, checked in order: coverage >= 90, agreement >= 95,
   Pi p95 <= 1.5x CLI p95; only when all three hold does `judge` return `adopt`
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:70-73]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1075-1081].
   The adopted number is `round1(106/111 * 100) = 95.5`
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1054-1055]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:992-993];
   one more disagreement is `round1(105/111 * 100) = 94.6`, below the bound, so the verdict holds on a
   one-row margin.

2. Every headline number reproduces from the recorded calls alone: 106 of 111 rows agree on the
   mean-top key; the per-order-key median absolute difference is exactly 0.0100 over 1,689
   order-key pairs (3 orders x 6 keys x 111 rows, minus none); Pi p50/p95 = 249/340 ms against the
   CLI's 326/387 ms; coverage is total, `excluded=0`, `unmeasured=0`, `timeouts=0`
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/calls.jsonl]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl].

3. All five disagreements live inside the 12 rows where either side's top-2 mean margin is under 0.10,
   and the other 99 rows agree 100 percent. The five, with each side's top-2 means: `rr-iter3-071`
   Pi sk-doc 0.517 / system-spec-kit 0.440 vs CLI system-spec-kit 0.557 / sk-doc 0.360;
   `rr-iter3-081` Pi system-spec-kit 0.527 / sk-prompt 0.433 vs CLI sk-prompt 0.503 / system-spec-kit
   0.440; `rr-iter3-125` Pi system-spec-kit 0.340 / system-deep-loop 0.287 vs CLI system-deep-loop
   0.3167 / none 0.3167; `rr-iter3-127` Pi system-deep-loop 0.343 / system-spec-kit 0.320 vs CLI
   system-spec-kit 0.320 / system-deep-loop 0.310; `P1-MCP-002` Pi mcp-code-mode 0.550 / sk-code 0.340
   vs CLI sk-code 0.497 / mcp-code-mode 0.427. Three of the five flip on a mean gap under 0.07 on at
   least one side [SOURCE: both calls.jsonl files, recomputed; rows joined on `row_id`].

4. Agreement is a mean-of-orders construct, and the per-order view is slightly worse, not better:
   per-order top-key agreement is 317 of 333 = 95.2 percent against the row-level 95.5 percent. The
   mean and the 2-of-3 majority select the same 106 rows. The gap is one row: `rr-iter3-127` has
   identical top keys on all three order pairs (system-deep-loop, system-spec-kit, system-deep-loop)
   yet counts as a disagreement because the averaged means cross (Pi prefers system-deep-loop by
   0.023, CLI prefers system-spec-kit by 0.010)
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1042-1056]
   [SOURCE: both calls.jsonl files, per-order recomputation].

5. `rr-iter3-125`'s CLI top key is decided by an exact tie and the option order. The CLI means for
   `system-deep-loop` and `none` are both 0.3166666..., and `topKey` walks the submitted keys in order
   keeping the earlier key, so the first key wins the tie
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:118-124].
   The rebuilt key set appends `none` last, so `none` can only win a tie if it is strictly greater
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:586-589].
   The 037 record's shorthand that the CLI picked `none` on this row is the tie's losing side.

6. Rotation sensitivity is real on both sides: 9 of 111 Pi rows and 12 of 111 CLI rows split their top
   key across the three cyclic orders, so a third of the disagreement pool is positional rather than a
   stable preference [SOURCE: both calls.jsonl files; order construction at
   .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:66-68].

7. The cost figure cannot be reproduced from the run's records. `cost_per_100` is the mean of each
   call's `result.usage.cost.total` times 100
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:616-618]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:756-758],
   but the Pi records store no usage field, so `0.0022` exists only in `report.json` and the session's
   in-process numbers [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run/calls.jsonl
   record keys: backend, kind, row_id, order, attempt, call_ms, exit_code, stop_reason, status,
   probabilities, replay, model, provider, pi_version, state_sha12].

8. Pi's latency win is consistent but modest: mean 260 vs 332 ms, p50 249 vs 326, p95 340 vs 387 (ratio
   0.878 against the 1.5 bound). The whole live run was 333 calls in about 1 min 29 s
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run.stdout.txt]
   [SOURCE: the two calls.jsonl files, `call_ms` recomputation].

9. The two sides asked the same nominal model through different providers — Pi on `openrouter`
   `typesafe/jev-1.13`, the CLI on `official` `jev-1.13.0` — so 95.5 percent is cross-provider
   agreement of one model family, and the five flips are backend/provider effects, not a model
   mismatch [SOURCE: report.json `pi.model`/`cli.model`, `pi.provider`/`cli.provider`]
   [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:47-52].

10. The latency pair is not same-day: the Pi column is a fresh 2026-09-30 run while the CLI column is
    the recorded 2026-09-29 019 run; the scorer's `--pi --cli` both-sides path exists and has never
    run [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/implementation-summary.md
    Known Limitations 2] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1217-1226].

11. `state_sha12` travels with every Pi call and is the only in-record proof of what was sent
    (`sha256(state).slice(0,12)`); the CLI records carry `advisor_ms`, `child_wall_ms` and `health_ms`
    instead, so the two call shapes are not symmetric
    [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:604-608]
    [SOURCE: both calls.jsonl record keys].

## Ruled Out

- "The five disagreements are sampling noise that a rerun would erase": at least `rr-iter3-127` is a
  metric artifact (identical order picks, crossing means) and `rr-iter3-125` rests on an exact tie;
  but `rr-iter3-071` and `P1-MCP-002` show stable 2-of-3 or 3-of-3 preferences on both sides, so the
  set is a mix of artifact and real near-tie preference, not pure noise.
- "Coverage or latency decided anything": coverage is 100 with zero excluded/unmeasured/timeouts, and
  the latency ratio is far inside the bound; agreement alone decided the verdict.
- "The CLI side is a subset or otherwise smaller": K=111 M=111 on both sides, 333 calls each, all rows
  paired one-to-one on `row_id`.

## Next Focus

Iteration 2 — Q2: how to raise its accuracy or lower its cost, from the anatomy above (tie handling,
rotation/early-stop policy, provider-arm choice, and the reproducibility of the cost figure).

## Sources

- `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/{calls.jsonl,report.json,live-run.stdout.txt}`
- `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-session/jev-run/calls.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/implementation-summary.md`
