# Iteration 2: Why plain planning and research prompts score zero

## Focus

Angle 2 (scoring): why plain planning and research prompts return no recommendation, how command intent competes with skill intent in fusion, and what the no-slash penalty and the mutating-command gate cost in recall versus precision.

## Actions Taken

- Reproduced the two measured prompts from `spec.md` and captured the full candidate list with a lowered threshold.
- Read the fusion ranking, confidence calibration, and recommendation threshold code.
- Read the command-bridge projection to check whether `/deep:research` and `/speckit:plan` are routable descriptors.
- Read the deriver's read-only route classification.
- Ran three contrast prompts: literal slash, workflow wording without a slash, and a read-only planning question.

## Findings

1. The default confidence threshold is 0.8 with a 0.35 uncertainty ceiling. For "plan a new feature for the login page" the complete candidate set is `sk-doc` at 0.6202, `sk-code` at 0.5923, and `system-spec-kit` at 0.5887, so every candidate fails the 0.8 bar and `advisor_recommend` returns an empty list. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1245]

2. For "research how our retrieval scoring works in depth" the candidates are `system-spec-kit` at 0.5874, `cli-external-orchestration` at 0.5759, and `sk-prompt` at 0.5747; the `/deep:research` bridge never enters the race because `command-deep-research` is projected with `routingEnabled: false`, empty keywords, empty intent signals, and empty domains. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1061]

3. A typed slash command is the only path that reliably activates the planning bridge: `/speckit:plan a new feature for the login page` returns `command-spec-kit` and `system-spec-kit`, both at 0.82. The bridge's entire keyword and intent-signal set is four slash markers (`/speckit:plan`, `/speckit:resume`, `/deep:research`, `/deep:review`), so it carries no plain-language planning phrase that a chat prompt could match. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:3] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:80]

4. The no-slash penalty is a rank-only adjustment: every candidate of `kind === 'command'` receives `-0.08` when the prompt contains no `/` character. Because it is applied in the sort comparator and not to confidence, it cannot create a recommendation from a failing candidate; its effect is to push command candidates below skill candidates whenever both are otherwise close. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1197]

5. The mutating-command gate lives in `readOnlyRouteAllowed`: a command is lifted off the read-only explainer floor only when `skill.readOnly === true` and one of its keyword phrases matches. The deriver sets that flag only for routes whose manifest value is `mutating === 'read-only'`, so add-only and mutating commands stay gated. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:686] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:305]

6. The gate's recall cost is measurable: "show me the plan for the login page" returns zero recommendations even though the planning command exists. The precision gain is also visible: "run the planning workflow for a new login feature" cannot reach `/speckit:plan` without the slash and instead returns `sk-doc`, `cli-external-orchestration`, and `sk-code` at 0.82, which is a plausible but wrong route for a planning request. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:673]

7. Fusion gives command intent only two entry points: the explicit-author lane (slash markers and declared keyword phrases) and generic lexical token overlap. The active command bridges other than doctor carry sparse, doctor-style diagnostic phrases or bare slash markers, so a chat prompt that expresses planning or research intent reaches a skill hub first and never reaches the command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:522] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4]

## Ruled Out

- Lowering the confidence threshold alone as the fix: at 0.0 the planning prompt surfaces `sk-doc`, `sk-code`, and `system-spec-kit`, not a command, so lowering the bar amplifies wrong-skill routing rather than command recall.
- Treating the no-slash penalty as the cause of zero recommendations: it only reorders candidates that already pass; the zero result is caused by the 0.8 confidence floor and missing command descriptors.

## Dead Ends

- Searching for a dedicated "command intent" lane: no such lane exists; commands are projected into the same five lanes as skills.

## Edge Cases

- Ambiguous input: "no-slash penalty" could be read as a confidence penalty; the code implements a rank bonus of -0.08, so the narrower reading was used and the confidence behavior is reported separately.
- Contradictory evidence: none. The measured candidate lists agree with the threshold code.
- Missing dependencies: the CLI schema rejects top-level `confidenceThreshold`; the threshold had to be passed under `options`, and the default run used the shipped threshold.
- Partial success: none.

## Sources Consulted

- `.skilled/bin/skill-advisor.cjs advisor_recommend` (default and lowered-threshold runs)
- `.skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:9-11`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:673-700,1197-1198,1245`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:80,1061`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:305-307`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-10`

## Assessment

- New information ratio: 0.9
- Questions addressed: Why do plain planning and research prompts return no recommendation, how does command intent compete with skill intent in fusion, and what do the no-slash penalty and mutating-command gate cost in recall versus precision?
- Questions answered: Why do plain planning and research prompts return no recommendation, how does command intent compete with skill intent in fusion, and what do the no-slash penalty and mutating-command gate cost in recall versus precision?

## Reflection

- What worked and why: rerunning the same prompt at a lowered threshold exposed the full candidate field, which turned an empty result into measurable evidence about which skill almost won.
- What did not work and why: the first attempt put `confidenceThreshold` at the top level, which the strict input schema rejected; the schema nests it under `options`.
- What I would do differently: test a command with a rich plain-language keyword set to separate "command intent is weak" from "this bridge has no phrases", which the next iteration can do by reading the output contract.

## Recommended Next Focus

Angle 3 (output contract): what the brief must carry in 80 to 120 tokens for a model to act on a command, and why the current `advisor_recommend` schema has no kind or runnable field.
