# Iteration 3: Third-Archetype Migration and Schema Safety

## Route Proof

`target_agent:"deep-research"`

`resolved_route:"Resolved route: mode=research target_agent=deep-research"`

- Iteration: `3`
- Run: `3`
- Agent definition loaded: `true`
- Execution: `single_iteration`
- State source: `externalized_files`
- Mode switching: disabled

## Focus

This iteration specifies an additive schema and migration contract for a third, defer-routed hub archetype. It separates selection policy from recommendation metadata, traces the `defaultApplied` compatibility ripple, defines rollout and rollback gates, and stress-tests contextual defaults, multi-dominant requests, degenerate registries, stale registries, detection-routed hubs, and null-induced fallback behavior.

## Findings

1. **The smallest safe schema separates the hub's selection archetype from its optional recommendation.** Add `routerPolicy.selectionPolicy` with exactly `"keyword-default" | "defer" | "detect"`, plus `routerPolicy.recommendationMode` as a registered `workflowMode` or `null`. `keyword-default` means hub-generic scoring vocabulary has one deliberate mode owner; `defer` means zero-signal or discovery-only evidence asks a question and may present `recommendationMode`; `detect` means an external surface/runtime detector supplies the route and no static recommendation participates in selection. This makes the missing third archetype expressible without pretending that a suggested child was selected. The current canon permits only a registered `defaultMode` or null specifically for a surface-primary hub, then describes only keyword-routed and detection-routed catch-all placement; by contrast, `mcp-tooling` already implements defer routing with discovery-only classes and a fallback-only child suggestion. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:81-89] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:225-229] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:20-29] [INFERENCE: `selectionPolicy` and `recommendationMode` are proposed field names; no shipped schema currently defines them.]

2. **`defaultApplied` needs a dual-write migration, not a flag-only rename.** Current replay computes `defaultApplied` only when no mode scored and a named `defaultMode` exists, while `workflowMode` remains null and `deferReason` becomes `no-mode-scored`; therefore neither `defaultConfigured` alone nor the old flag alone fully describes the event. During compatibility, emit `defaultConfigured = (legacy defaultMode != null || recommendationMode != null)`, `defaultConsulted = (selectedModes.length === 0 && defaultConfigured)`, `recommendationMode`, and `selectionPolicy`, while retaining `defaultApplied` as a deprecated alias of `defaultConsulted`. Reports and gold fixtures must migrate to the new fields before the alias is removed. The terminology surface includes replay code, generated benchmark reports, and direct test assertions, so changing only the producer would break consumers or silently reinterpret historical JSON. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts:71] [INFERENCE: archived `skill-benchmark-report.json` files containing `defaultApplied` should remain immutable historical evidence; readers need legacy normalization rather than artifact rewrites.]

3. **Validator rollout must be additive first and archetype-specific second.** Phase A accepts legacy packets and validates new fields when present: enum membership; `recommendationMode` registry membership; and no unknown modes. Phase B requires `selectionPolicy` and enforces invariants: `keyword-default` requires one recommendation/default owner and catch-all identity on that mode only; `defer` requires `defaultMode: null`, permits a nullable recommendation, requires any recommendation resource to be `fallback-only`, and forbids `discoveryClasses` from mode scoring; `detect` requires `defaultMode: null`, no static recommendation, and a declared detection/surface contract. Empty registries are invalid; a single-mode registry is still required to declare policy rather than receiving an implicit first-mode default. The existing doctor check validates only absent/null/registered `defaultMode`, so it cannot distinguish these archetypes or catch a stale recommendation after a registry rename. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:814-824] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:20-29] [SOURCE: .opencode/skills/sk-code/hub-router.json:5-15] [INFERENCE: the exact validator phases and invariants are migration design, not current behavior.]

4. **Rollout order must preserve old readers, and rollback must reverse dependency order rather than flipping live hubs first.** Safe sequence: (1) add schema/parser support and legacy normalization; (2) dual-emit telemetry and teach reports/tests both names; (3) add fixture snapshots for all three archetypes plus empty, single-mode, stale-reference, and registry-rename failures; (4) update canon/templates; (5) annotate hubs without changing their effective routing; (6) run deterministic and the iteration-2 live factorial gates; (7) only then consider policy-value changes hub by hub; (8) remove the old field only after a repository-wide consumer scan is clean. Rollback signals are unknown-policy parse failures, legacy/new mismatch counts, zero-signal wrong-pick and freeze deltas, unexpected defer-rate changes by hub/stratum, stale-mode validation failures, and fallback-resource exposure without `defaultConsulted`. Roll back hub values first, then templates/canon, but keep tolerant readers and dual telemetry until old artifacts age out. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:814-824] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:643-702] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:23-29] [INFERENCE: rollout order and rollback thresholds are proposed safety controls; no current migration runner provides them.]

5. **Contextual and multi-dominant behavior must remain outside a static recommendation field.** A runtime-dependent preference, such as excluding the current CLI executor or selecting from detected stack markers, belongs in detector evidence or scored constraints and should produce telemetry such as `selectionSource: "detector" | "score" | "explicit-hint" | "defer"`; it must not be encoded as a context-sensitive `recommendationMode` callback inside JSON. Likewise, multiple explicitly requested modes remain `orderedBundle` in `tieBreak` order, not a "multi-default". The existing base contract already distinguishes single, ordered bundle, defer, and optional surface bundle, while the deep-loop hub gives explicit mode hints precedence over dominant-intent classification. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:801-812] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:102-111] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:53-70] [INFERENCE: `selectionSource` is recommended telemetry, not a proposed schema input.]

6. **Null policy creates second-order failure modes unless neutral fallback behavior is validated.** A null/defer hub can still bias a child through `defaultResource`, silently choose `tieBreak[0]`, lose all discoverability when no helper is loaded, fan out when hub identity remains on every sibling, or drift when `recommendationMode` references a removed registry entry. The contrasting live shapes expose the required distinctions: `mcp-tooling` keeps discovery classes unscored and a child resource fallback-only; `sk-doc` has null plus a neutral shared helper; `sk-code` has null but shared identity scoring because detection owns selection. These are three different contracts and must not be normalized into one generic `defaultMode: null` rule. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:20-29] [SOURCE: .opencode/skills/sk-doc/hub-router.json:5-20] [SOURCE: .opencode/skills/sk-code/hub-router.json:5-19] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:225-229] [INFERENCE: first-mode fallback and helper starvation are anti-patterns to fixture-test; they were not observed as current replay branches.]

## Proposed Compatibility Matrix

| `selectionPolicy` | Selection owner | `recommendationMode` | Legacy bridge | Required zero-signal behavior |
|---|---|---|---|---|
| `keyword-default` | Scoring; one catch-all mode owner | Required registered mode | `defaultMode == recommendationMode` during dual-write | Hub identity may score that mode; true no-signal still records defer/consultation |
| `defer` | No child | Optional registered mode | `defaultMode: null`; recommendation is separate | Ask one targeted question; optional fallback-only suggestion |
| `detect` | External surface/runtime detector | `null` | `defaultMode: null` | Detector route or defer when detection is absent/ambiguous |

Legacy packets cannot be classified safely from `defaultMode` alone: a non-null value can currently coexist with authored defer behavior, and null can mean either defer routing or detection routing. Migration therefore requires explicit per-hub annotation, not an automatic codemod. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:5-29] [SOURCE: .opencode/skills/sk-code/hub-router.json:5-15]

## Benchmark and Rollback Gates

- Schema gate: reject unknown policies, empty registries, stale `recommendationMode`, and incompatible archetype fields.
- Compatibility gate: legacy and new readers produce the same `workflowMode`, resources, and defer reason for unchanged hub fixtures.
- Telemetry gate: every no-score trace distinguishes configured, consulted, recommended, and selected state; `defaultApplied` equals `defaultConsulted` during the window.
- Route-gold gate: one zero-signal fixture per archetype, plus single-mode, multi-dominant, discovery-only, detector-miss, and stale-registry fixtures.
- Live gate: use iteration 2's policy-by-helper matrix; no immediate live flips, and promote only after hub-specific wrong-pick/friction margins pass.
- Rollback alarm: any unknown-policy error, legacy/new semantic mismatch, fallback resource without consultation, or statistically material wrong-pick/freeze regression blocks the next stage.

## Ruled Out

- **Inferring the archetype from `defaultMode` nullability.** Null conflates defer and detection, while non-null can coexist with defer-time-only recommendation behavior. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:5-29] [SOURCE: .opencode/skills/sk-code/hub-router.json:5-15]
- **Replacing `defaultApplied` directly with `defaultConfigured`.** The old field is conditional on no scored mode; a pure rename would hide the distinction between configuration and consultation. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-353]
- **Encoding contextual defaults or multi-dominant defaults in static JSON.** Context belongs to detection/scoring evidence, and multi-mode intent already has an ordered-bundle contract. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:102-111]
- **Flipping shipped hubs before readers, validators, telemetry, fixtures, and live gates are ready.** Current validation proves only mode-or-null membership and cannot protect the new semantics. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:814-824]

## Dead Ends

- A backward-compatible automatic codemod was considered and rejected because current values do not uniquely identify the intended archetype. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:5-29] [SOURCE: .opencode/skills/sk-code/hub-router.json:5-15]
- Adding a generalized executable recommendation resolver was rejected: it would turn static policy metadata into a second router and create two competing selection authorities. [INFERENCE: contextual selection is already representable as detector/scoring evidence.]

## Sources Consulted

- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:801-824`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:315-356,643-702`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts:71`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:60-111,225-229`
- `.opencode/skills/mcp-tooling/hub-router.json:5-29`
- `.opencode/skills/sk-code/hub-router.json:5-19`
- `.opencode/skills/sk-doc/hub-router.json:5-20`
- `.opencode/skills/system-deep-loop/SKILL.md:53-70`

## Assessment

- New information ratio: 0.82
- Novelty justification: The iteration adds an exact three-archetype field model, dual telemetry semantics, validator invariants, an ordered compatibility rollout, reverse rollback strategy, and explicit treatment of contextual, multi-dominant, degenerate-registry, and null-induced edge cases.
- Questions addressed: third-archetype safety; binary-policy edge cases; second-order anti-patterns.
- Questions answered: the three remaining key questions now have evidence-backed migration and test contracts, with live policy effects intentionally left to the preregistered benchmark.
- Confidence: high on current validator/replay/canon behavior; medium-high on the proposed schema and sequencing because they remain unimplemented and require fixture/live validation.

## Reflection

- What worked and why: comparing validator permissiveness, replay telemetry, canon language, and three distinct null/non-null hub shapes exposed why nullability cannot carry archetype semantics.
- What did not work and why: repository evidence cannot set production rollback-rate thresholds or establish contextual request prevalence; those require the iteration-2 live benchmark and operational traces.
- Ruled out: nullability inference, a direct telemetry rename, executable contextual defaults, multi-defaults, and policy flips before compatibility scaffolding.

## Recommended Next Focus

Synthesis should reconcile the three iterations into a decision package that preserves the contrarian named-recommendation case, the factorial live benchmark, and this additive migration contract without authorizing immediate hub flips.
