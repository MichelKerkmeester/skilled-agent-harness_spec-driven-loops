# Iteration 42: S6-07 Quick-Win vs Rewrite Prioritization

## Focus

[S6-07] Which mined mechanisms are under-1-day quick wins versus architectural rewrites, and what is the dependency order?

Dimension: D4 synthesis. This pass does not re-mine the individual mechanisms. It uses prior mined evidence and the full angle bank to turn the backlog into an implementation order.

## Actions Taken

1. Read the deep-research workflow contract, state-output contract, current strategy, findings registry, state log tail, and the S6 angle bank.
2. Checked prior iteration coverage for sparkline dashboard, integrity hash, run-now sentinel, score-delta benchmark, and recent S5 work to avoid duplicating raw mechanism mining.
3. Re-read the reference source lines for the candidate quick wins and rewrites: kasper sparkline/status, kasper state integrity, loop-cli HOME isolation, loop-cli run-now, loop-cli crash-resume delay state, loop-cli wave fan-out, and reference config centralization.
4. Checked our target paths exist for reducer/dashboard, atomic state, deep-research YAML, fan-out, convergence, and runtime tests.

## Findings

1. **Rank 1 - Make runtime tests hermetic before touching state or fan-out.**

   Reference mechanism: loop-cli resolves runtime state through `LOOP_CLI_HOME` before falling back to the real home directory [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/config/paths.ts:5-8`]. Its CLI/background tests create a temp root and pass `LOOP_CLI_HOME` through the spawned process environment [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/tests/background-cli.test.ts:13-23`], and project tests restore the original env after each case [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/tests/projects.test.ts:102-114`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts`.

   Why it helps: this is the dependency floor for every later state, lock, crash-resume, and fan-out change. A shared test helper can isolate `HOME`, runtime DB paths, temp dirs, and child-process env without editing every test first.

   Port-difficulty: easy. Tag: quick-win. Dependency order: first.

2. **Rank 2 - Add the sparkline dashboard as a pure reducer quick win.**

   Reference mechanism: kasper's `renderSparkline(scores)` normalizes recent scores into a compact trend string [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/utils.ts:172-184`], and status renders the trend beside recent percentages [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:262-270`]. Kasper also has an in-progress summarizer, but that part depends on first-class running state [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:36-80`].

   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`.

   Why it helps: `renderDashboard()` already has the ratio history target; a pure text trend is low-risk and immediately improves confirm-mode/operator scanning. The running banner should stay separate until the loop emits a canonical start event.

   Port-difficulty: easy. Tag: quick-win. Dependency order: after or parallel with test isolation.

3. **Rank 3 - Add object-state integrity helpers, but do not stamp append-only JSONL yet.**

   Reference mechanism: kasper computes a SHA-256 hash over state minus `_integrity` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:150-157`], warns and continues on mismatch during init [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:159-177`], then stamps `_integrity` immediately before atomic write [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1048-1059`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.

   Why it helps: registry/config-style JSON can gain tamper detection immediately. JSONL integrity is a separate rewrite because the state log is append-only and has no single top-level object to hash.

   Port-difficulty: easy for object JSON helpers; med for consumer wiring. Tag: quick-win. Dependency order: before crash-resume and before any shared mutable fan-out state.

4. **Rank 4 - Treat the run-now sentinel as a conditional quick win, not a full scheduler port.**

   Reference mechanism: loop-cli's `triggerNow()` rejects active runs, saves the current remaining delay, sets a force-run flag, resumes paused waits, emits `triggered`, and persists through the daemon manager [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:161-176`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:151-156`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:213-219`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`.

   Why it helps: a packet-local `.deep-research-run-now` file can give operators a daemon-free forced iteration path. The under-1-day slice is path definition, pause/run-now precedence, consume-once behavior, and JSONL event emission. Saved cadence restoration belongs with crash-resume.

   Port-difficulty: med. Tag: quick-win if scoped to sentinel admission; deep-rewrite if it includes saved schedule restoration. Dependency order: after the event-name/lifecycle decision for `iteration_started` versus `iteration_start`.

5. **Rank 5 - Freeze a unified convergence spec before adding more convergence signals.**

   Reference mechanism: this is an inference from reference centralization, not a copied feature. Loop-cli validates loop options in one parser/schema boundary [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/loop-config.ts:22-32`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/types.ts:20-31`]. Kasper centralizes bounded runtime scoring fields in a zod schema [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/config.ts:26-48`] and documents the same fields in its config template [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/config.ts:216-240`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

   Why it helps: convergence math is becoming multi-surface: research/review/context/council, graph novelty, anti-convergence floors, and future score-delta signals. A declarative threshold/weight spec plus parity tests should land before more loop-specific branches accrete.

   Port-difficulty: hard. Tag: deep-rewrite. Dependency order: after quick-win observability/integrity; before score-delta, min-iteration, or council parity changes become broader.

6. **Rank 6 - Port crash-resume as a state-machine rewrite, not as a sleep helper.**

   Reference mechanism: loop-cli persists `status`, `nextRunAt`, `remainingDelayMs`, `runHistory`, and `skippedCount` in controller metadata [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:189-205`]. Its delay loop updates `remainingDelayMs` and saves the force-run remainder [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:228-236`], then reconstructs first-run delay from persisted `nextRunAt` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:311-315`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.

   Why it helps: crash-resume prevents killed lineages from restarting all work, but it needs a durable active-state schema, resume classification in the workflow, integrity/tamper behavior, and tests. The sleep primitive alone is not enough.

   Port-difficulty: hard. Tag: deep-rewrite. Dependency order: after integrity helpers, lifecycle/event naming, and minimal run-now semantics.

7. **Rank 7 - Keep push-wave fan-out last because conflict safety is the real feature.**

   Reference mechanism: loop-cli's wave model runs only eligible tasks whose dependencies are done, packs same-file work into one worker, chooses disjoint file sets up to a concurrency cap, commits each successful group, retries failed groups once, and stops on zero progress [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:30-59`]. Its global instructions name the same invariants: push assignment, `depends_on`, disjoint files, checkpoints, max concurrency, explicit stalls, and one retry [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/AGENTS.md:47-58`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`.

   Why it helps: research/review fan-out would stop wasting slots on blocked or overlapping work. But without worktrees or a stronger conflict contract, this is an assignment-model migration, not a pool tweak.

   Port-difficulty: hard. Tag: deep-rewrite. Dependency order: last; requires hermetic tests, telemetry, conflict-safety policy, and likely a separate fan-out ADR.

## Questions Answered

- S6-07 answered: the true under-1-day quick wins are HOME/temp isolation, sparkline dashboard, object-state integrity helpers, and a narrowly scoped run-now sentinel. The architectural rewrites are unified convergence spec, crash-resume, and push-wave fan-out.
- The dependency order is: hermetic tests first; sparkline and integrity in parallel; minimal run-now after lifecycle/event naming; unified convergence spec before new signal families; crash-resume after integrity and lifecycle; push-wave fan-out last.
- "Unified convergence spec" is not directly present in either reference repo. The reference support is their centralization pattern for bounded config and typed loop options, so the backlog item should be phrased as an inferred design import.

## Questions Remaining

- Should run-now override pause like loop-cli, or should pause remain a hard safety latch with `run_now_rejected_pause`?
- Should integrity mismatch remain warning-first everywhere, or should completion/synthesis gates be allowed to fail closed?
- Should the convergence spec be an ADR plus generated config, or a runtime module with parity fixtures first?
- What conflict-safety substrate is required before push-wave fan-out: git worktrees, disjoint touched-file declarations, code graph impact, or a hybrid?

## Next Focus

S6-08: decide whether to keep advisory file-locking with hardened heartbeat or adopt socket-bind single-flight, including cross-platform and multi-host blast radius.
