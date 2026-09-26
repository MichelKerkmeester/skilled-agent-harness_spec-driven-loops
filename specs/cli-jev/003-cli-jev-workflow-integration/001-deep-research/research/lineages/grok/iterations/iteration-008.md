# Iteration 8: grok-08 — Contest the other lineage

## Focus

Reread the newest sibling iterations, reopen the seams they use, and contest any ranking this lineage would otherwise copy. Focus Area is `grok-08`. MiMo has a lineage directory and no `iterations/` folder, so there is nothing to contest there.

## Actions Taken

Read DeepSeek `iteration-003.md` (newest sibling). Reopened `verifyGoalHeuristic` and the OpenCode verifier mode set. No live `jev` call.

## Findings

DeepSeek iteration 2, already used, drops a live advisor call and ranks an offline routing arm `next`. This lineage adopted that order in iteration 4. Agreement after iteration 4 is not an independent confirmation.

DeepSeek iteration 3 ranks a goal `choice` (`met` / `not_met` / `blocked`) as `next` on the OpenCode plugin, because `VALID_VERIFIER_MODES` is `{heuristic, llm}` and the verifier timeout defaults to 30 seconds. It drops a live keep-or-drop inside Claude `PreCompact`. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/deepseek/iterations/iteration-003.md:29-50]

The mode set is real. [SOURCE: .skilled/plugins/opencode-goal.js:134]

The heuristic's own comment says free-form text can sound conclusive while still describing a blocker, so ambiguous or mixed evidence stays open rather than `met`. Blocking language returns `not-met` before any completion regex runs. `met` is reached only after that gate, with confidence hardcoded to 0.72. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:592-604] [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:619]

A `choice` that may return `met` while `VERIFIER_BLOCKING_PATTERN` matches is the kill criterion from iteration 3 of this lineage. DeepSeek's seam is a better plug-in point than "replace `verifyGoalHeuristic`." The verdict is not. The labeled set they name does not exist yet. Question 1 of the fitness checklist wants a baseline before the build. Ranking the mode `next` puts the call ahead of the measurement.

Compaction agreement is the same conclusion from two readings of `HOOK_TIMEOUT_MS`. It is not a new fact. DeepSeek's extra point, that `compact-inject` builds a brief rather than deleting messages, narrows iteration 3 of this lineage. The drop still holds. The vendored hook is the one that rewrites history.

### Contested list

| Claim | Who | This lineage |
|---|---|---|
| Live advisor tie-break inside the 2500 ms child | DeepSeek iteration 2, drop | Agree. Not independent. |
| Offline routing `choice` before any cached shadow lane | DeepSeek iteration 2, next | Agree, and it corrects this lineage's iteration 2. |
| OpenCode goal `choice` is `next` | DeepSeek iteration 3 | Contest. The mode switch is confirmed. `met` over blocking language is forbidden by `goal-core.cjs:592-604`. Stay `later` until a labeled set exists and the wrapper cannot return `met` when the blocking pattern matches. |
| Live PreCompact keep-or-drop | DeepSeek iteration 3, drop | Agree. |
| Shadow D4 grader, non-authoritative stop shadow, severity `choice`, fail-closed screen, `next_check` | This lineage only | Uncontested because MiMo has no iterations and DeepSeek has not reached those angles. Treat them as single-lens. |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/deepseek/iterations/iteration-003.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/deepseek/iterations/iteration-002.md` (already read)
- `.skilled/hooks/goal/lib/goal-core.cjs`
- `.skilled/plugins/opencode-goal.js`
- MiMo lineage listing: config and ledgers only, no iteration files

## Assessment

newInfoRatio: 0.46

Novelty justification: The OpenCode mode set and the heuristic comment that forbids a conclusive `met` on mixed evidence are new to this lineage. The deadline drop on compaction is not.

Convergence telemetry: the ratio falls because the sibling mostly restated seams this lineage had already judged. Mode is off. Do not stop.

## Reflection

What worked: the comment at `goal-core.cjs:592` is a written kill, not a taste.

What failed: treating "they found a mode switch" as "the verdict should rise." A better seam with the same forbidden output is still later.

Ruled out: promoting the goal `choice` to `next` to match DeepSeek.

## Recommended Next Focus

`grok-09`: run the survivors through the fitness checklist and the red-flag list.

## Hand-off

- Do not rank the goal verifier `next`. Wrapper rule, if it is ever built: when `VERIFIER_BLOCKING_PATTERN` matches, the result stays `not-met` and Jev is not asked.
- First-build candidate remains the offline routing `choice`.
- Single-lens survivors: shadow grader, stop shadow, severity `choice`, screen, `next_check`.
