# Iteration 5: Q5 / Thread 10 — Null-Hub Identity and Anti-Bias Contracts

## Focus

Answer the forced final-depth Q5 without reopening Q1–Q4 or the Run 1 keep/flip policy. “Hub identity” is interpreted as the runtime replay's `workflowMode`, `packet`, and `backendKind` fields; the question is whether `defaultMode` supplies any of them or changes the signal score, then what an explicit null-hub replacement contract must test.

## Findings

1. **Confirmed — `defaultMode` does not enter current replay scoring or mode identity.** `scoreIntents()` derives scores solely from `intentSignals`, and `selectIntents()` retains only scored modes within the ambiguity delta. `buildHubRouteTelemetry()` derives `workflowMode`, `packet`, and `backendKind` from that selected-mode list before it computes `defaultApplied`; the sole `defaultMode` read is the post-selection boolean `selectedModes.length === 0 && policy.defaultMode != null`. Thus a non-null value is observed as telemetry, not inserted as a score, selected mode, packet, or backend identity. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702]
2. **Confirmed — the `sk-doc` policy separates the null default from discovery signals.** Its policy declares `defaultMode: null`, while mode discovery is represented by independently weighted `routerSignals`; its documented outcomes reserve `defer` for unclear or contradictory input. `defaultResource` is a separate fallback-resource field, not a workflow-mode identifier. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35]
3. **Confirmed — the current benchmark has a suitable enforcement seam but not a demonstrated anti-bias schema.** Hub skills enable route gold by default, D5 executes before scenarios, every authored-gold row is sent through `evaluateRouteGold`, and enforced structural/registry/route-gold failures return a non-zero exit code. The runner therefore provides the place to enforce null-hub invariants, but these sources do not demonstrate that its existing gold schema already checks the proposed telemetry fields below. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:246-298]
4. **Proposed replacement contracts and assertions:** (a) define a `HubDefer` result with `workflowMode: null`, scored `candidateModes`, `matchedAliases`, and a `deferReason`; `packet` and `backendKind` remain empty until a signal-selected mode exists; (b) replace any future catch-all default with a neutral `DiscoverabilityHelper` that asks one discriminating question and may describe the hub, but carries no mode id, child packet path, synthetic alias, or score; and (c) make `defaultMode` nullable only as a policy compatibility field, with `null` required for a null hub and any non-null value rejected by a static anti-implicit-selection check. Route-gold should then assert: **Z** zero-signal gives null mode, empty aliases/packet/backend, `defaultApplied: false`, and `no-mode-scored`; **W** weak-signal gives exactly its signal-selected mode and no default; **A** ambiguous input retains candidates while deferring and loads no child mode resource; and alias-order/paraphrase variants preserve Z/A abstention. A mutation control with a non-null `defaultMode` must fail the new policy lint or these invariants, so discoverability cannot silently become auto-dispatch. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480] [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-89] [INFERENCE: the proposal preserves the observed separation between scoring, identity, fallback, and benchmark enforcement while making a future regression fail explicitly]

## Ruled Out

- Inferring that `defaultMode` anchors runtime identity or catch-all scoring from its field name: in the inspected replay it is read only after selection to compute telemetry. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:456-480]
- Treating the current route-gold runner as proof that it already enforces the proposed null-hub telemetry assertions: the inspected runner invokes route gold and hard-gates its verdict, but does not itself establish those new expectation fields. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:289-298]

## Dead Ends

- `defaultApplied` alone cannot prove a mode was selected or a child was loaded: it is true only for zero selected modes with a non-null policy value, while runtime identity arrays are derived from the selected modes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:325-355]
- A neutral fallback resource must not be treated as a covert mode: the hub policy models `defaultResource` separately from `defaultMode` and `routerSignals`. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-35]

## Edge Cases

- Ambiguous input: “hub identity” could mean static registry membership or runtime route output. This iteration selected the latter because Q5 asks about catch-all scoring and the local replay exposes `workflowMode`, `packet`, and `backendKind`; static registry identity was not substituted for route behavior. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356]
- Contradictory evidence: none found.
- Missing dependencies: none required for the answer. The proposed route-gold telemetry schema is intentionally labeled proposed; no claim is made that it is already implemented.
- Partial success: none. Q5 is answered as confirmed current behavior plus a clearly separated replacement/test design; no source or benchmark implementation was changed or run.

## Sources Consulted

- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356, 456-480, 538-702
- .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:10-20, 65-89, 196-208, 246-298
- .opencode/skills/sk-doc/hub-router.json:4-35
- command output: Glob `.opencode/skills/**/*router*.cjs` (identified `router-replay.cjs` as the relevant shared replay implementation)

## Assessment

- New information ratio: 0.85
- Questions addressed: **Q5 (thread 10):** If `defaultMode` currently anchors hub identity or catch-all scoring, what exact replacement contracts and benchmark assertions keep a null hub discoverable without recreating hidden auto-default bias?
- Questions answered: **Q5 (thread 10):** If `defaultMode` currently anchors hub identity or catch-all scoring, what exact replacement contracts and benchmark assertions keep a null hub discoverable without recreating hidden auto-default bias?
- Demonstrated versus proposed: current replay scoring, mode identity, telemetry, policy separation, and benchmark gates are demonstrated; `HubDefer`, `DiscoverabilityHelper`, policy lint, and the Z/W/A route-gold assertions are proposed replacements.

## Reflection

- What worked and why: tracing `defaultMode` from policy through the replay's scoring, selection, telemetry, identity, and benchmark boundaries isolated its one current use instead of inferring behavior from configuration names.
- What did not work and why: the inspected benchmark runner establishes the route-gold execution seam but not the proposed expected-field schema, so asserting that those exact checks already exist would overclaim implementation evidence.
- What I would do differently: during implementation, add the proposed expected telemetry/resource fields to the route-gold evaluator and run the Z/W/A plus mutation-control corpus before changing any hub policy.

## Recommended Next Focus

No further forced-depth research iteration remains. For implementation planning, turn the proposed `HubDefer`/`DiscoverabilityHelper` schema and Z/W/A/mutation-control assertions into an explicit route-gold evaluator extension, then validate it against the unchanged null `sk-doc` policy. [INFERENCE: Q5 is now reduced to a bounded contract-and-test implementation task]
