# Iteration 2: Dominant-Child Rule and Five Hub Verdicts

## Focus

Derive a falsifiable rule for deciding whether a parent hub may select a child on a zero-signal request, then apply it consistently to the five hubs whose `hub-router.json` currently names a child `defaultMode`. The evaluated condition is deliberately narrow: an input that reaches the correct hub but supplies no discriminating child-mode signal after explicit mode hints, commands, and deterministic detection have been considered. Provider choice, task type, or target-surface evidence that does score a mode is outside the default branch.

## Actions Taken

1. Located fleet router-policy and fallback language without repeating the saturated `sameSet` implementation search.
2. Compared the five hubs' mode registries to establish whether the candidate default is a general mode or one peer among materially distinct workflows/transports.
3. Read each parent `SKILL.md` routing contract to determine what low-confidence, ambiguous, or missing-input requests are supposed to do.
4. Read all five `hub-router.json` files to compare named defaults, weights, signals, outcomes, and fallback resources.
5. Used the two shipped null models as controls: `sk-doc` defers when authoring intent is unclear, while `sk-code` defers workflow selection but can separately detect and bundle a code surface.

## Findings

1. **A dominant child is justified only by lower expected zero-signal loss, not by array order, a tie-break, mode breadth, or the fact that it is already configured.** For hub `h`, candidate child `D`, zero-signal population `Z`, true modes `i`, mis-default cost `C_wrong(D,i)`, and defer/detection cost `C_defer(i)`, keep `D` only when `sum_i P(i|Z) * C_wrong(D,i) < sum_i P(i|Z) * C_defer(i)`. The claim is falsifiable with a representative held-out corpus of `Z` requests, adjudicated true modes, and explicit cost grades. Until that evidence exists, a child can provisionally pass only when the parent contract establishes that it remains semantically safe for the plausible alternatives and requires no missing provider, workflow, target, or permission choice. This explains both null controls: `sk-doc` asks for the workflow, target, inputs, and validation expectations when intent is unclear, while `sk-code` asks for workflow/action details but can independently detect and bundle a surface. [SOURCE: .opencode/skills/sk-doc/SKILL.md:80-97] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-117] [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-20] [SOURCE: .opencode/skills/sk-code/hub-router.json:4-15] [INFERENCE: the expected-loss inequality operationalizes the two control contracts and makes the dominant-child claim empirically refutable]

2. **`sk-prompt` provisionally KEEPS `prompt-improve`, but this is the only keep verdict and still needs traffic validation.** The parent explicitly characterizes it as the higher-traffic, more general mode; a bare small-model name leans `prompt-models`; the model-profile route has a stronger weight of 6 versus 4; and the low-confidence path loads the improve packet only as context before returning `UNKNOWN_FALLBACK`. Thus recognizable model-profile requests should not reach the default branch, while a true zero-signal miss has a bounded cost: extra prompt-improvement framing/context before clarification, not silent execution of the authoring workflow. The verdict flips to `null` if a representative `Z` corpus fails the expected-loss inequality or shows model-dispatch/profile requests being biased toward prompt authoring. [SOURCE: .opencode/skills/sk-prompt/SKILL.md:66-83] [SOURCE: .opencode/skills/sk-prompt/hub-router.json:4-25] [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:17-41] [INFERENCE: these contracts make prompt-improve safer and more plausibly dominant than the other named defaults, while not substituting for observed traffic]

3. **`cli-external-orchestration` provisionally FLIPS `cli-opencode` to `null`.** All three providers are primary, independently routable workflows with equal weight 4; the parent says genuine ambiguity must not silently default to OpenCode. Choosing a provider is a material user/runtime decision, and the OpenCode child additionally refuses ordinary self-invocation from an OpenCode runtime. The mis-default cost is therefore selecting the wrong provider/model/auth/runtime contract, consuming context on the wrong executor packet, or reaching a predictable self-invocation refusal; one clarification is cheaper. No consulted artifact supplies traffic evidence that outweighs those costs. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:39-64] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:17-77] [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:31-53]

4. **`system-deep-loop` provisionally FLIPS `research` to `null`.** Seven modes have equal router weight 4, and the parent contract already says low confidence or no dominant mode returns a checklist instead of loading a guessed packet. The modes have different convergence math, state shape, artifacts, permissions, and mutation posture, so research is not a safe umbrella. The mis-default cost is running or framing the wrong state machine, creating the wrong artifact family, applying the wrong convergence semantics, or allowing WebFetch where another lane is inward-only; these costs dominate a single mode clarification. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:46-72] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-53] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:55-101] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:103-198]

5. **`mcp-tooling` provisionally FLIPS `mcp-chrome-devtools` to `null`; its authored semantics already behave like defer-plus-suggestion.** Six equal-weight modes span three workspace workflows and three external design transports. The router explicitly declares `defaultResource` fallback-only and says a zero-signal request defers while Chrome DevTools is merely suggested; the parent likewise says genuine ambiguity must not silently default to Chrome. The mis-default cost is selecting the wrong external system, permission/mutation posture, authentication path, or design transport and potentially omitting the mandatory `sk-design` pairing. Null makes the metadata match the authored behavior. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-30] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:31-91] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:42-65] [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:17-30] [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:32-251]

6. **`sk-design` provisionally FLIPS `interface` to `null`.** The parent requires manager intake before routing and a focused question whenever an unknown fact changes the route or acceptance bar. Its six modes separate interface creation, foundations, motion, audit, extraction, and transport; five design-judgment modes even have dedicated commands, while transport requires prior judgment. A no-signal interface guess can turn an audit into creation advice, flatten a token/motion/extraction request into visual direction, or route before required inputs and proof expectations are known. Those relevance and acceptance-bar costs exceed one focused intake question, and no consulted traffic evidence establishes interface dominance over the zero-signal population. [SOURCE: .opencode/skills/sk-design/SKILL.md:40-71] [SOURCE: .opencode/skills/sk-design/SKILL.md:73-103] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-25] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5-24] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-164]

### Provisional Fleet Verdict

| Hub | Current child | Verdict | Explicit mis-default cost |
|---|---|---|---|
| `sk-prompt` | `prompt-improve` | **KEEP, provisional** | Extra improve-packet context and authoring bias before clarification; flip if corpus evidence shows profile/dispatch harm. |
| `cli-external-orchestration` | `cli-opencode` | **NULL** | Wrong provider/runtime/auth contract or OpenCode self-invocation refusal. |
| `system-deep-loop` | `research` | **NULL** | Wrong state machine, artifact root, convergence math, or permission posture. |
| `mcp-tooling` | `mcp-chrome-devtools` | **NULL** | Wrong external system/tool permissions and potentially omitted design pairing. |
| `sk-design` | `interface` | **NULL** | Creation framing substituted for audit/foundations/motion/extraction and intake skipped. |

## Ruled Out

- **Tie-break or registry order as dominance evidence.** The peer modes in CLI, deep-loop, MCP, and design carry equal weights; ordering resolves ties but does not measure `P(mode|Z)`. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-30] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-50] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-91] [SOURCE: .opencode/skills/sk-design/hub-router.json:4-91]
- **Existing `defaultMode` as proof of genuine dominance.** Multiple parent contracts explicitly defer on ambiguity even while their router metadata names a child, so the configuration is the hypothesis under test, not evidence for itself. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65]
- **Mode count alone as the policy.** `sk-doc` has many modes and nulls, but the decisive property is unresolved choice/cost; `sk-code` also nulls despite being able to detect and bundle a surface separately. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-34] [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57]

## Dead Ends

- No consulted canonical hub artifact contains representative zero-signal traffic counts or adjudicated misroute-cost telemetry. Therefore all verdicts remain provisional; repeating policy prose cannot turn them into empirical dominance claims. The smallest decisive evidence is a labeled held-out corpus for each hub's zero-signal branch. [INFERENCE: based on the five mode registries, five hub routers, and five parent routing contracts consulted this iteration]

## Edge Cases

- **Ambiguous input:** The phrase “dominant child” could mean largest overall hub traffic or largest share specifically after no mode scores. This iteration chose the narrower, behaviorally relevant `P(mode|Z)` interpretation because `defaultMode` is a zero-signal fallback rather than a scored-route selector; overall traffic is deferred. [INFERENCE: based on .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-356 and iteration 1's established fallback semantics]
- **Contradictory evidence:** Named defaults coexist with parent prose that requires defer on genuine ambiguity in CLI, deep-loop, and MCP. The provisional null verdicts preserve the safer authored behavior; final reconciliation requires benchmark/implementation work outside this iteration. [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:4-13] [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:56-64] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-13] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:51-68] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-30] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:59-65]
- **Missing dependencies:** Representative route traffic and cost labels are absent; direct repository contracts were used as the fallback, and verdict confidence is explicitly provisional.
- **Partial success:** None. The rule and all five provisional verdicts are supported, while empirical confirmation is correctly left open.

## SCOPE VIOLATIONS

None. No researched hub, reducer-owned file, or synthesis file was modified.

## Sources Consulted

- `.opencode/skills/sk-prompt/SKILL.md:66-83`
- `.opencode/skills/sk-prompt/hub-router.json:4-25`
- `.opencode/skills/sk-prompt/mode-registry.json:17-41`
- `.opencode/skills/cli-external-orchestration/SKILL.md:39-64`
- `.opencode/skills/cli-external-orchestration/hub-router.json:4-30`
- `.opencode/skills/cli-external-orchestration/mode-registry.json:17-77`
- `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:31-53`
- `.opencode/skills/system-deep-loop/SKILL.md:46-72`
- `.opencode/skills/system-deep-loop/hub-router.json:4-50`
- `.opencode/skills/system-deep-loop/mode-registry.json:30-198`
- `.opencode/skills/mcp-tooling/SKILL.md:42-65`
- `.opencode/skills/mcp-tooling/hub-router.json:4-91`
- `.opencode/skills/mcp-tooling/mode-registry.json:17-30,32-251`
- `.opencode/skills/sk-design/SKILL.md:40-103`
- `.opencode/skills/sk-design/hub-router.json:4-91`
- `.opencode/skills/sk-design/mode-registry.json:5-24,39-164`
- `.opencode/skills/sk-doc/SKILL.md:80-97`
- `.opencode/skills/sk-doc/hub-router.json:4-34`
- `.opencode/skills/sk-code/SKILL.md:50-117`
- `.opencode/skills/sk-code/hub-router.json:4-15`

## Assessment

- New information ratio: **1.00** (6 of 6 findings are fully new to the packet; the iteration reuses iteration 1's fallback semantics but adds the decision rule and every per-hub verdict).
- Questions addressed: evidence-backed dominant-child decision rule; five auto-defaulting hub verdicts and misroute costs; null-model constraints.
- Questions answered: “What evidence-backed decision rule distinguishes a genuine dominant child from a presumptive default?”; “Which of the five auto-defaulting hubs should keep its child default, and which should flip to `null`, based on mode mix and misroute cost?”

## Questions Answered

1. The dominant-child rule is the cost-weighted inequality over the zero-signal population, with safe-defer as the burden-of-proof default when representative evidence is absent.
2. Provisional verdicts are `sk-prompt: keep`; `cli-external-orchestration: null`; `system-deep-loop: null`; `mcp-tooling: null`; `sk-design: null`.

## Questions Remaining

1. How should the `sk-doc` defer model and `sk-code` detect-and-bundle model be expressed as distinct fleet policy variants rather than merely controls?
2. What exact create-skill canon should force authors to declare and justify `default`, `defer`, or `detect`?
3. What exact route-gold schema and assertions should make named-child, null-defer, and detect-and-bundle outcomes observable despite iteration 1's replay limitation?

## Reflection

- **What worked and why:** Reading each hub's router metadata beside its parent contract exposed whether the named child agreed with authored behavior; the control hubs made the rule depend on unresolved-choice cost rather than mode count.
- **What did not work and why:** The canonical artifacts contain qualitative claims but no representative traffic or adjudicated cost dataset, so a statistically empirical dominance result was impossible.
- **What I would do differently:** In a validation iteration, construct route-gold zero-signal fixtures and a small cost rubric first, then test the provisional verdicts instead of rereading policy prose.

## Next Focus

Specify the exact create-skill canon and route-gold benchmark encoding for three deliberate policies—named-child default, null/defer, and null/detect-and-bundle—including an observable fallback assertion that does not mistake `defaultApplied` telemetry for child selection.

## Recommended Next Focus

Use the provisional 1-keep/4-null verdict set as fixtures while defining the canon fields, evidence burden, route-gold zero-signal cases, expected defer/detect outcome, and explicit mis-default cost annotation.
