# Iteration 005

## Focus

Identify the cost and operator-friction defects that dominate live deep-loop execution after correcting route proof and unrestricted council-seat startup.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, prior iteration, and deep-research operator contract to preserve the active focus and avoid the exhausted council-delta direction. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-state.jsonl:1-19] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:77-135] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-004.md:38-53]
2. Traced fan-out liveness from schema defaults through the per-lineage heartbeat and stall-watchdog wiring. The host-generated heartbeat updates the same timestamp the watchdog treats as lineage activity. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:272-282] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1131-1187,1426-1435,1652-1671]
3. Compared council cost-guard validation with actual seat dispatch and the manual contract. Guard values are required to be positive but have no upper caps, and every requested seat is started concurrently. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:15-21,61-77,94-100] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169] [SOURCE: .opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/cost-guards.md:13-29]
4. Examined timeout and retry containment at the subprocess boundary. Council seats receive only one direct-child `SIGTERM`, while fan-out preflight budget estimates exclude up to five configured retries of the full lineage. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:189-241] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:658-700,1059-1071,1534-1559] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:618-653]

## Findings

### F-ITER005-001 (P1): Synthetic progress heartbeats prevent the lineage stall watchdog from detecting a hung executor

`progressHeartbeatSeconds` defaults to 60 seconds and `stallWatchdogMs` defaults to five minutes. Each host timer heartbeat calls `markLineageEvent`, resetting the exact timestamp consumed by `startLineageStallWatchdog`; therefore a silent child can remain alive while host-generated progress records continuously defer the watchdog. Even if the watchdog fires, it emits only a warning and does not abort. The expensive fallback is the lineage timeout, which defaults to `min(iterations * 900s * 2, 4h)`. This is the largest operator-friction defect because the default observability mechanism can make a stalled process look live for hours. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:272-282] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:646-655,1059-1071,1131-1187,1652-1671]

### F-ITER005-002 (P1): Council cost guards calculate an upper bound but do not enforce upper caps or concurrency

The default upper bound is 45 seat outputs, but `normalizeCostGuards` accepts any positive integer for topics, rounds, and seats. `dispatchCouncilSeats` then maps the entire seat list into one `Promise.all`, with no concurrency cap. The manual contract says configs exceeding caps are rejected, but no maximum is encoded. An operator typo or generated config can consequently launch an arbitrarily wide process burst and an arbitrarily large session. Route-proof correction alone does not contain this startup risk. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:15-21,40-77,80-100] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:107-169] [SOURCE: .opencode/skills/system-deep-loop/runtime/manual_testing_playbook/council/cost-guards.md:15-29]

### F-ITER005-003 (P1): Council seat timeout can leave a process tree alive after the round records failure

At the ten-minute default timeout, `runSeatSubprocess` sends `SIGTERM` only to the direct child and immediately rejects. It does not spawn a detached process group, wait for exit, or escalate to `SIGKILL`. A CLI child that ignores `SIGTERM` or owns descendants can therefore continue consuming resources after the seat has been marked failed. The shared executor runtime already demonstrates the stronger process-group TERM-to-KILL pattern, so council dispatch is the weaker containment boundary. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:37,189-241] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:974-1031] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit-process-group.vitest.ts:51-66]

### F-ITER005-004 (P1): Fan-out budget approval ignores the default six-attempt worst case

The lineage budget preflight computes `iterations * cost_units_per_iteration`, with the cap disabled by default (`0`). Independently, fan-out defaults `maxRetries` to five and requeues retryable full-lineage failures, permitting six attempts. The budget check runs inside every attempt but evaluates the same single-attempt estimate, so even an enabled cap cannot represent cumulative retry consumption. A lineage approved at exactly its cap can consume up to six times that estimate before retry exhaustion; the command surface exposes timeout and concurrency but not this cost cap. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:658-700,1534-1578] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:272-282] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:618-653] [SOURCE: .opencode/commands/deep/research.md:1-4]

## Questions Answered

- **Which cost and operator-friction defects dominate?** First, fan-out liveness can falsely remain healthy until an hours-scale timeout. Second, council width and session size have no hard upper caps despite a cost-guard contract. Third, council timeouts may orphan expensive subprocesses. Fourth, fan-out cost approval excludes the default retry multiplier.
- **Are the existing controls merely undocumented?** No. The main defects are behavioral: heartbeat activity masks silence, council validation permits arbitrary positive dimensions, seat timeout does not guarantee reaping, and budget arithmetic omits retries.

## Questions Remaining

- How do deep-improvement candidate prompts and reducer boundaries compare with the review and council failure patterns?
- Are review prompt/validator schema mismatches covered outside skill-local tests?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?
- Should the council seat executor schema separate executor family, effective primary agent, requested mode, seat id, lens, and model?
- Which shared-runtime and command-contract tests are missing for the four cost/liveness defects found here?

## Next Focus

Examine deep-improvement candidate dispatch and reducer boundaries, then identify cross-command tests that should detect schema, cost, and liveness drift rather than relying on dogfood failures.

## Ruled-Out Directions

- Treating host-generated fan-out heartbeat rows as evidence that the child executor is progressing is ruled out: the timer is emitted by the parent and updates the watchdog timestamp without observing child output or state advancement. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1131-1178,1652-1671]
- Treating the council upper-bound calculator as a hard cap is ruled out: it returns arithmetic metadata after accepting any positive dimensions; no maximum comparison occurs. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:61-100]

## SCOPE VIOLATIONS

None. No researched runtime, skill, command, agent, config, or test file was modified.
