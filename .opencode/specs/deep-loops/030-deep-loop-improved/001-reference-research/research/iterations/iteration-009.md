# Focus

[S2-01] How kasper closes the loop on whether an applied improvement actually helped, using `score_before`, `outcome_score_delta`, `setImprovementDelta`, and helped/hurt average reporting.

# Actions Taken

1. Read the deep-research skill contract and quick reference to confirm this is a leaf iteration with narrative, JSONL state, and delta outputs.
2. Checked the current state log and findings registry to avoid duplicating the completed S1-06 through S1-08 findings.
3. Searched the vendored kasper repo for `outcome_score_delta`, `setImprovementDelta`, `score_before`, and aggregate score paths.
4. Read the kasper implementation around improvement recording, post-evaluation delta closure, state storage, and status/history reporting.
5. Read our convergence entrypoint to map the mechanism onto its score, snapshot, momentum, and output contracts.

# Findings

## Finding 1: Capture the pre-change convergence score on the improvement record

Reference mechanism: kasper's `ImprovementRecord` stores both `score_before` and eventual `outcome_score_delta` fields, then records `score_before` when an agent prompt or AGENTS.md improvement is applied [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:229`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:237`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:238`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1464`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1472`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1572`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1580`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: our convergence script computes a composite `score` from current signals and can persist snapshots, but it does not attach a pre-change baseline to a later runtime improvement or routing decision [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:417`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:428`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:474`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:484`]. Port difficulty: med. Tag: quick-win.

## Finding 2: Close pending deltas only after a later evaluation refreshes the aggregate

Reference mechanism: after a session is recorded, kasper refreshes aggregate score state, expires stale improvements, then calls `closePendingScoreDeltas()`; that function finds improvements with `score_before` but no `outcome_score_delta`, computes `after - score_before`, and writes the delta through `setImprovementDelta()` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:308`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:319`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:340`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:345`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:33`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:45`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:53`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:378`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:381`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: our script already compares latest and previous snapshot metrics as generic `momentum`, but it does not close a specific pending improvement with a causal post-change score delta [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:466`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:471`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:493`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:500`]. Port difficulty: med. Tag: quick-win.

## Finding 3: Scope the after-score to the thing that changed

Reference mechanism: kasper uses an agent-specific aggregate when the improvement targeted an agent prompt, and the global aggregate when the improvement targeted AGENTS.md [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:49`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:50`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:51`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:52`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1472`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1474`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1580`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:460`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: our convergence script already branches by `loopType` and computes different signal sets, so outcome deltas should be scoped to the affected loop/session/target rather than one global convergence score [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:359`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:361`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:417`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:425`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:428`]. Port difficulty: hard. Tag: deep-rewrite.

## Finding 4: Report average delta plus helped/hurt counts beside convergence output

Reference mechanism: kasper's status handler collects completed `outcome_score_delta` values, counts positive and negative outcomes, computes the average, and prints a compact "Avg delta ... helped, hurt" line [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:283`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:286`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:287`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:288`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:289`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:292`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: our bridge output already returns `score`, `signals`, `blockers`, `trace`, and `graph_convergence_score`, so an `outcomeDeltaSummary` field could make improvement impact visible without parsing snapshots or logs [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:493`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:496`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:497`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:514`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:519`]. Port difficulty: easy. Tag: quick-win.

# Questions Answered

- [S2-01] kasper measures improvement impact by recording a pre-change score, waiting until later evaluations refresh aggregate score state, then writing a one-time `outcome_score_delta = after - score_before`. It also summarizes completed deltas with helped/hurt counts and an average.

# Questions Remaining

- [S2-02] What is kasper's full LLM-judge hardening stack in `evaluate.ts` and `scorer.ts`, and in what order do retry, fallback score cards, timeout races, format-strip retry, and JSON extraction fire?
- [S2-03] How does kasper enforce `min_observations_for_update` before acting on a weakness?
- [S2-04] How does kasper apply time-decay half-life weighting so stale observations fade?

# Next Focus

[S2-02] Mine kasper's LLM-judge hardening stack and map the ordered fallback behavior to `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`.
