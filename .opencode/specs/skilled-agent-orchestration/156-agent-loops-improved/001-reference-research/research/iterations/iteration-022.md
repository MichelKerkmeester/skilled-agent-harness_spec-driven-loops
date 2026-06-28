# Focus

[S3-06] Map whether `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` should add a kasper-style improvement-effect signal by comparing this iteration's composite convergence score to the prior persisted snapshot, so the loop can detect "new but not getting better" behavior.

# Actions Taken

1. Rechecked prior S2-01 output to avoid duplicating the causal `score_before` / `outcome_score_delta` backlog.
2. Read kasper's pending score-delta closeout path in `src/evaluate.ts`, one-time persistence in `src/state.ts`, and helped/hurt delta summary in `src/handlers.ts`.
3. Read our convergence score, snapshot, momentum, decision, and JSON output paths in `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.
4. Checked snapshot storage order and metrics shape in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` and the existing reusable `computeMomentum` helper in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

# Findings

## S3-06A: Add an explicit current-vs-prior `scoreDelta` signal

Reference mechanism: kasper computes an improvement effect as `after - score_before` once later aggregate score is available, then persists the rounded delta only if the improvement does not already have one [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:49`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:53`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:378`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:381`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: our script already computes a composite `score` before snapshot persistence and stores that `score` in snapshot metrics [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:428`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:484`]. Add `scoreDelta = score - priorSnapshot.metrics.score` immediately after `score` is computed, using the last existing snapshot from `db.getSnapshots(...)`, so the current run reports improvement-effect without waiting until the next invocation. Port difficulty: easy. Tag: quick-win.

## S3-06B: Do not rely on current `momentum.score` for the current iteration

Reference mechanism: kasper closes pending deltas in the same evaluation pass after the new session is recorded, so the reported delta reflects the just-observed score rather than a previous pair of observations [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:308`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:319`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:345`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: `convergence.cjs` currently computes `momentum` from the last two snapshots already in the DB, then persists the current snapshot afterward [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:466`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:471`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:474`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:484`]. That means `momentum.score` is one run behind for the current score. A dedicated `scoreDelta` should compare `score` to `snapshots.at(-1).metrics.score` before `createSnapshot()`. Port difficulty: easy. Tag: quick-win.

## S3-06C: Add an `improvementEffect` trace gate for novelty-without-score-gain

Reference mechanism: kasper's status path turns completed deltas into helped/hurt counts and an average, making negative or flat impact visible instead of reporting only that a change occurred [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:283`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:287`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:289`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:292`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: research convergence already has a novelty corroboration trace/blocker path, but it checks whether reported novelty agrees with graph novelty, not whether the composite convergence score is actually improving [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:429`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:455`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:461`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:493`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:500`]. Add a trace entry such as `improvementEffect` with `scoreDelta`, `priorScore`, and `currentScore`; optionally block `STOP_ALLOWED` when effective novelty is positive but `scoreDelta <= 0` for the current or rolling window. Port difficulty: med. Tag: quick-win.

## S3-06D: Keep snapshot score-delta separate from S2-01 causal outcome-delta

Reference mechanism: kasper's causal delta chooses the "after" score in the same scope as the changed target, using agent aggregate when an agent prompt changed and global aggregate otherwise [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:49`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:50`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:51`; `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:52`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: S2-01 already identified the heavier backlog item for pending improvement records. S3-06 should be a lighter observational signal scoped to the current `specFolder` / `loopType` / `sessionId`, matching how snapshots are queried in ascending iteration order [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:392`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:788`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:794`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:803`]. Naming it `scoreDelta` avoids falsely implying causal attribution to a specific runtime change. Port difficulty: easy. Tag: quick-win.

# Questions Answered

- Yes, `convergence.cjs` should add a kasper-inspired score-delta signal, but the first port should be an observational current-vs-prior snapshot `scoreDelta`, not the full causal `outcome_score_delta` mechanism from S2-01.
- The target already has enough inputs: current composite `score`, prior snapshots, session-scoped snapshot lookup, JSON output, and trace/blocker plumbing.
- Existing `momentum` is close but insufficient for this focus because it compares two prior persisted snapshots before the current snapshot is inserted.

# Questions Remaining

- What threshold should count as "not getting better": `scoreDelta <= 0`, a small epsilon such as `< 0.01`, or a rolling-window average?
- Should a flat/negative `scoreDelta` block STOP immediately, or only add a warning until repeated across N iterations?
- Should this signal apply only to research novelty loops first, or to review/context convergence too once the trace vocabulary is stable?

# Next Focus

[S3-07] Continue the target-mapping segment with the next uncovered convergence/runtime mechanism from the strategy queue.
