# Iteration 3: grok-03 — The goal hook and compaction, what the outside world tried

## Focus

What npm `jevctl`'s compaction hook, pi-jev-context, and the Hermes comments teach about goal judgment and context reduction, and what broke. Focus Area is `grok-03`. Carries the iteration 2 rule that a live call does not belong inside a short hook deadline, and the iteration 1 rule that a missing answer is not a passing score.

## Actions Taken

Opened the jevctl compaction hook, pi-jev-context's prune path and its request builder, this repository's heuristic goal verifier, and the Claude compact-inject deadline. The Hermes cache warning was opened in iteration 2 and is cited again. No live `jev` call. Python `jev-cli` and npm `jevctl` stay named apart.

## Findings

npm `jevctl` treats a goal as an optional string on the compaction config, not as a verdict. `resolveHookConfig` copies `options.goal` onto the config only when it is a non-empty string. The hook's job is to replace the summary with verbatim kept messages. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts:86-87] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts:1-4]

That hook is on unless the option `compaction` is set to false. `enabled: options['compaction'] !== false`. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts:73-75]

When the reduction ratio is under `minReductionRatio` (default 0.25), or when the call throws, the hook logs and returns `next(event)`, which is the built-in summary. It does not install a partial compaction. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts:26-28] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts:277-285]

pi-jev-context defaults the other way. `enabled` is false, `threshold` is 0.8, `cache` is true, `timeoutMs` is 60000. Turning it on tells the operator that candidate history and recent conversation are sent to TypeSafe. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts:26-32] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts:315-316]

A missing key throws "Run /login typesafe, then /jev on." A failed scan sets `paused` and does not install partial decisions. The comment says cancellation or errors cannot install partial decisions. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts:184] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts:194] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts:201]

`prune` drops a candidate only when a judgment exists and its keep-probability is less than or equal to the threshold. An unknown key is kept, because `probability === undefined` continues. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/context.ts:115-125]

The cache key is a sha256 of identity plus text, so unchanged tool output is not asked again. The request refuses to send a body over 28000 bytes and refuses to echo error bodies. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/context.ts:14-18] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/jev.ts:4-5] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/jev.ts:95-107]

This repository's goal check is a keyword heuristic. Blocking language forces `not-met`. Short, truncated, or off-objective evidence stays `unclear`. Only an explicit completion signal tied to the objective returns `met`, with confidence hardcoded at 0.72 and `source: 'heuristic'`. The shared kill switch is `isPluginDisabled`, which reads `isHookEnabled('goal')`. [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:148-149] [SOURCE: .skilled/hooks/goal/lib/goal-core.cjs:586-619]

Claude compact-inject has no judgment slot with time to spare. `HOOK_TIMEOUT_MS` is 1800. Optional snapshot work is skipped when fewer than 50 ms remain. The deadline is `performance.now() + HOOK_TIMEOUT_MS` at the start of `main`. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:12] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:63] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:447-448] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:494]

The Hermes comment opened in iteration 2 still binds this angle. Deleting tool calls on a relevance score can remove critical state, and editing history can hurt prompt caching. The benchmark they discuss measures compression, not whether the agent still works. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - Integrated the Jev context engine into Hermes.md:112-118]

### Idea: Python `jev-cli` `noul` as the goal verifier

| Field | Content |
|---|---|
| **Idea** | Replace `verifyGoalHeuristic` with a Python `jev-cli` `noul`: the transcript shows the objective is met. |
| **Value** | A verdict that understands a paraphrase the keyword list misses. |
| **Seam** | `.skilled/hooks/goal/lib/goal-core.cjs:596` |
| **Metric, baseline, harness** | Agreement with a labeled set of met / not-met / unclear transcripts. No such set was opened. The measurement digest's compaction and goal rows are the gap. Baseline UNKNOWN. Smallest harness is a replay of saved goal state files against the heuristic, then a shadow `noul` on the same text. |
| **Cost, latency, privacy** | One call per verification. The objective and a slice of the transcript leave the machine. The heuristic itself is synchronous and local. A network call on the goal path is inferred to be felt on every turn that verifies. |
| **Opt-in and no key** | The goal hook already fails open when `isHookEnabled('goal')` is false. A Jev verifier needs its own flag, default off. No key or exit 3: return the heuristic result unchanged, including its `source: 'heuristic'`. Do not copy a score into `confidence`. |
| **Complexity** | About 40 lines beside `verifyGoalHeuristic`, plus the flag. Callers of the verdict object stay put if the shape is unchanged. |
| **Verdict** | later. The heuristic's refusal to say `met` on blocking language is the safety property. A model that says `met` anyway is worse than the keywords. |
| **Confidence** | Confirmed for the heuristic and the kill switch. The paraphrase gain is inferred. |
| **Kill criterion** | On a labeled set, if the shadow `noul` says met on any transcript the heuristic marks `not-met` because of blocking language, drop the verifier. |

### Idea: pi-jev-style prune inside compact-inject

| Field | Content |
|---|---|
| **Idea** | A Python `jev-cli` `noul` per tool result, drop when keep-probability is at or under 0.8, as `prune` does. |
| **Value** | A shorter transcript before the next model call. |
| **Seam** | `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:494`, under the 1800 ms budget in `shared.ts:12`. |
| **Metric, baseline, harness** | Tokens removed, and whether the next turn repeats work. The Hermes comment says compression benchmarks do not measure the second. Baseline UNKNOWN. No local harness was opened that replays a compacted transcript. |
| **Cost, latency, privacy** | Many `noul`s, or one batched `run`. Tool-result text leaves the machine. pi-jev caps a request at 28000 bytes and times out at 60 seconds, which is thirty times the compact-inject budget. |
| **Opt-in and no key** | pi-jev's default `enabled: false` is the pattern. jevctl's `compaction !== false` is the pattern to refuse. No key: do not prune. `prune` already keeps unknown keys. A missing key must look like an unknown key, not like a low score. |
| **Complexity** | A new branch in compact-inject plus a cache file. It edits the transcript the model will see, which is the cache-break the Hermes comment describes. |
| **Verdict** | drop. 1800 ms cannot hold the call, and a prune that changes history is the failure the outside comments already named. |
| **Confidence** | Confirmed for both deadlines and for `prune`'s unknown-key behavior. |

### Idea: pass the goal string into a compressor, jevctl's `goal` option

| Field | Content |
|---|---|
| **Idea** | If a shadow compaction is ever built, pass the objective as state the way `resolveHookConfig` passes `goal`, and keep the built-in summary when reduction is under 0.25. |
| **Value** | The compressor sees what the session is for, without becoming the verifier. |
| **Seam** | The outside pattern is `fast-jev.ts:86`. The local place that would have to grow a shadow is still `compact-inject.ts:494`, which has no goal field today. |
| **Metric, baseline, harness** | Same as the prune idea, and still UNKNOWN. |
| **Cost, latency, privacy** | The objective leaves the machine with the transcript. |
| **Opt-in and no key** | Off by default. On failure, `next(event)` as in `fast-jev.ts:285`. |
| **Complexity** | Not a separate feature until a compaction shadow exists. |
| **Verdict** | drop as a build. Keep the fallback shape as a constraint on any later compaction idea. |
| **Confidence** | Confirmed from `fast-jev.ts`. There is no local caller. |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/context.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/jev.ts`
- `.skilled/hooks/goal/lib/goal-core.cjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`
- Hermes post lines opened in iteration 2
- Iterations 1 and 2

## Assessment

newInfoRatio: 0.7

Novelty justification: The on-by-default jevctl compaction flag, the unknown-key keep in `prune`, the hardcoded 0.72 heuristic confidence, and the 1800 ms compact budget are new. The cache-break warning was already in iteration 2.

Convergence telemetry: ratios 1.0, 0.72, 0.7. Mode is off. Continue to wave 2.

## Reflection

What worked: reading `enabled` defaults side by side. jevctl compaction is on unless turned off. pi-jev and this repository's goal kill switch are off unless turned on.

What failed: looking for a goal verdict inside jevctl. The `goal` option is a string of context, not a judgment.

Ruled out: a live prune inside compact-inject, and replacing the heuristic with a `noul` that can say met when blocking language is present.

## Recommended Next Focus

`grok-04`: whether one-model-is-one-opinion rules out a Jev stop signal.

## Hand-off

- Pattern that carries: unknown or failed judgment keeps prior behavior (`prune` skips undefined, `fast-jev` calls `next(event)`, pi-jev pauses and does not commit a partial scan).
- Pattern that does not: `enabled: options['compaction'] !== false`.
- Kill criterion for a goal `noul`: any `met` on a transcript the heuristic marks `not-met` for blocking language.
- Kill criterion for compaction: the call cannot finish inside 1800 ms, or a missing key prunes anything.
- Cache risk: a content-hash cache is safe to copy. Rewriting history is not.
- Wave 2 must read the newest sibling iteration files before arguing about stop signals.
