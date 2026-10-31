# Iteration 2: grok-02 — Active skill-advisor recommendations, the bold version and its rebuttal

## Focus

The boldest Jev role in skill routing, and why suggestion-only or nothing can beat it. Focus Area is `grok-02`. Picks up the hand-off from iteration 1: name the binary, and do not treat a near-threshold number as a route.

## Actions Taken

Opened npm `jevctl`'s routing core and its package contract, the advisor ambiguity cluster, the shadow lane registry, the fusion flag helper, the Claude prompt-submit timeout, the routing-accuracy eval driver, and the two posts' comments on skill selection versus silent routing. No live `jev` call.

## Findings

The bold version already exists, in the other package. npm `jevctl` `buildRouteRequest` asks one `choice` over the handler map plus a reserved `none` option whose description is "None of the handlers applies to this request." `runRoute` then sets `action` to `none`, `auto`, or `review` from `minConfidence`. Policy stays in code. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/route.ts:42] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/route.ts:110-116] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/route.ts:180-192]

That package's own guidelines say option descriptions carry the rules, an escape option belongs on every closed set, and low `choice` confidence means the options were close, not that the model is wrong. Thresholds in the cookbook (0.8 auto-accept and the rest) are starting points, not this repository's numbers. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/guidelines.md:5-13]

The same package's contract says exit `2` means the judgment matched. The Python `jev-cli` that `cli-usage` wraps uses exit `2` for a usage error that spends no quota. A caller that treats exit 2 as one of those meanings will misread the other binary. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/CLAUDE.md:48] [SOURCE: .skilled/skills/cli-jev/cli-usage/SKILL.md:171]

This repository already marks the close-call case without a model. `AMBIGUITY_MARGIN` and `AMBIGUITY_CONFIDENCE_MARGIN` are both 0.05. A passing recommendation joins the cluster when either gap is inside its margin, and `applyAmbiguity` writes `ambiguousWith`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7-8] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:22-36] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:44-57]

A live lane must not be the place a new judge writes. `SHADOW_SCORER_LANE_DEFINITIONS` holds the BM25 lane with `live: false` and `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW`. The comment on the weight env keys says the live channel is never written from the shadow learning loop. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:21-28] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:33-36]

The flags that do change fusion are opt-in and default off. `isAdvisorRrfFusionEnabled` reads `SPECKIT_ADVISOR_RRF_FUSION` through `TRUE_FLAG_VALUES` and returns false when the variable is unset. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:50] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:69] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:111-114]

The advisor child cannot host a network call. The Claude shim spawns it with `timeout: 2500` and `killSignal: 'SIGKILL'`. On timeout, nonzero exit, or invalid JSON it returns `{}`. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:109-125]

The offline bed that could host a shadow arm reports MRR and right-skill@3 on a held-out split, and it says it is read-only against the skill graph. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:6-10] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:22-23]

The posts argue for a narrower boldness. A Hermes commenter says Jev makes more sense for choosing tools and skills than for deleting history. Another says feed Jev the skill list and load on demand. A Pi commenter, answering a skills-hook proposal, wants "at the very least just a suggestion engine" and does not want routing without permission. A separate comment calls per-message model switching madness because of prompt caching, and asks for a status-bar suggestion instead. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - Integrated the Jev context engine into Hermes.md:120] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - Integrated the Jev context engine into Hermes.md:214] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md:304] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md:464-466]

The semantic shadow lane already has a `disabledReason` field for a lane that cannot run. A missing key can use that shape: the lane reports disabled and the live ranking is untouched. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:15-21]

### Idea: live `choice` over the whole skill index, npm `jevctl` `route` shape, called through Python `jev-cli`

| Field | Content |
|---|---|
| **Idea** | On every prompt, a Python `jev-cli` `choice` picks a skill the way npm `jevctl` `route` picks a handler, including a `none` escape, and the advisor returns that skill. |
| **Value** | A huge catalogue could stay out of the model prompt, which is what the Hermes comment asks for. |
| **Seam** | The call would have to finish inside `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:114`. The ranking it would overwrite is produced before `applyAmbiguity` in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:44`. |
| **Metric, baseline, harness** | MRR and right-skill@3. The eval driver names those as the gate. A numeric baseline for the current scorer on the committed corpus was not opened in this iteration, so the baseline is UNKNOWN here. Harness is the routing-accuracy driver (`score-outcome-rerank.mjs`), which the measurement digest calls H5. |
| **Cost, latency, privacy** | One `choice` per prompt. The prompt and every option description leave the machine. The child is killed at 2500 ms. A cold Python `jev-cli` spawn plus a network round trip is inferred not to fit. The 150 ms figure from iteration 1 is a vendor claim about the API, not about this shim. |
| **Opt-in and no key** | A live default would change routing for everyone. With no key the shim already returns `{}` on any child failure, which is today's degrade, and it is the wrong place to learn that the key was missing. |
| **Complexity** | A new lane plus a subprocess. It touches the frozen live-weight channel the registry comment forbids. |
| **Verdict** | drop. The bold route is a second scorer inside a deadline that already fails open to an empty object, and it would write a channel the code keeps frozen. |
| **Confidence** | Confirmed from the shim, the lane comment, and `route.ts`. The spawn-time claim is inferred. A timed local spawn with no network would confirm the budget. |

### Idea: shadow `choice` over the ambiguity cluster only

| Field | Content |
|---|---|
| **Idea** | When `isAmbiguousTopTwo` is true, record a Python `jev-cli` `choice` among those skills plus `none`. Store it on a `live: false` lane. Do not fuse it. |
| **Value** | The operator, and the eval, can see whether Jev breaks ties the 0.05 cluster only tags. Everyone else still gets today's order. |
| **Seam** | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:21` for the lane, and `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:38` for the predicate that decides the call is worth making. The call itself runs in the offline eval, not in the 2500 ms child. |
| **Metric, baseline, harness** | Held-out MRR and right-skill@3, shadow arm versus the similarity-only order. Baseline number UNKNOWN in this iteration. Harness: `score-outcome-rerank.mjs`. |
| **Cost, latency, privacy** | One `choice` per ambiguous held-out prompt during eval, not per live prompt. Option text is the skill descriptions already in the graph. |
| **Opt-in and no key** | Flag `SPECKIT_ADVISOR_JEV_SHADOW`, copied from `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW`, default off, same `TRUE_FLAG_VALUES` set. Missing key: `disabledReason` set, lane skipped, live scores unchanged. Exit 3 from the Python CLI is that skip. Exit 2 must not be read as `jevctl`'s "judgment matched." |
| **Complexity** | About 80 lines: a lane definition, a flag reader, and an eval-only arm. No live fusion change. |
| **Verdict** | next. It is the only routing idea that uses a bounded option map the code already builds, and it can lose without changing a recommendation. |
| **Confidence** | Confirmed that the cluster and the shadow slot exist. Confirmed that the eval reports MRR and @3. Whether Jev beats the scorer there is inferred. |

### Idea: suggestion only, status bar, no route change

| Field | Content |
|---|---|
| **Idea** | Show the shadow `choice` as a line the operator can ignore. Same shape as the Pi comment's status-bar model suggestion. |
| **Value** | The operator sees a disagreement and decides. Nothing routes without permission. |
| **Seam** | There is no status-bar seam in the advisor. The data would come from the shadow record at `lane-registry.ts:21`. Rendering it is a new surface. |
| **Metric, baseline, harness** | Operator overrides of the suggestion, which has no gold set. The routing harness does not measure a line nobody acts on. |
| **Cost, latency, privacy** | Same shadow call, plus a line in the hook output. |
| **Opt-in and no key** | Off unless the shadow flag is on. No key: no line. |
| **Complexity** | The shadow lane plus a display. The display has no current caller. |
| **Verdict** | later. It matches the "suggestion engine" comment, and it is unmeasured until the shadow arm shows a disagreement worth showing. |
| **Confidence** | The comment is confirmed. The operator effect is inferred. |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/route.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/guidelines.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/CLAUDE.md`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs`
- Both Reddit posts, skill-selection and cache comments
- Iteration 1 hand-off

## Assessment

newInfoRatio: 0.72

Novelty justification: The 2500 ms SIGKILL, the frozen live-weight channel, the `none` escape inside `route.ts`, and the exit-2 collision between the two packages are new. The shadow-lane idea itself was already named in the seam digest, so that part is partial.

Convergence telemetry: rolling average of 1.0 and 0.72 is 0.86. Mode is off. The loop continues.

## Reflection

What worked: putting `route.ts` next to `ambiguity.ts`. The bold idea is a whole-catalogue `choice`. The code that already exists is a 0.05 cluster. They are different sizes of problem.

What failed: looking for a status-bar seam in the advisor. It is not there.

Ruled out: a live Jev route inside the 2500 ms child, and reading npm `jevctl` exit 2 as if it were the Python CLI.

## Recommended Next Focus

`grok-03`: what jevctl's compaction hook, pi-jev-context, and the Hermes plugin teach about goal judgment and context reduction.

## Hand-off

- Bold idea that survives: shadow `choice` over the ambiguity cluster, flag `SPECKIT_ADVISOR_JEV_SHADOW`, default off, eval-only.
- Strongest argument against a live route: `user-prompt-submit.ts:114` kills the child at 2500 ms and returns `{}`.
- It would win only if the held-out MRR or right-skill@3 rises and the live ranking stays byte-identical with the flag off.
- Kill criterion: the shadow arm does not beat the similarity-only order on that split.
- Exit 2 means opposite things in the two packages. Later failure-mode work must probe the binary, not the name `jev`.
