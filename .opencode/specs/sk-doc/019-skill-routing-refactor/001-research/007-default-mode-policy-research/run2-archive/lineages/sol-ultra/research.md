# Parent-Hub defaultMode Policy: Divergent Run 2 Synthesis

## 1. Executive Summary

The central correction from this lineage is semantic: current deterministic replay does not select a named `routerPolicy.defaultMode` when no mode scores. It emits `workflowMode: null` and `deferReason: "no-mode-scored"` while `defaultApplied: true` reports only that a named default was configured. The policy debate therefore cannot be reduced to "named value means silent child route" versus "null means defer." [SOURCE: iterations/iteration-001.md:7-15]

The strongest named-default case is narrower than run 1 assumed: a named mode can be useful as a recommendation or prior, especially for a two-mode hub such as `sk-prompt`, without being the selected route. However, authored playbooks cannot prove an approximately 80% natural traffic share. [SOURCE: iterations/iteration-001.md:11-15]

The recommended policy model has three explicit archetypes, not a binary field:

| Selection policy | Selection owner | Optional recommendation | Zero-signal behavior |
|---|---|---|---|
| `keyword-default` | Scoring with one deliberate catch-all owner | Required registered mode | True no-score still defers; the recommendation is recorded |
| `defer` | No child | Optional registered mode, fallback-only | Ask one targeted question |
| `detect` | Runtime/surface detector | None | Detector route or defer |

[SOURCE: iterations/iteration-003.md:20-42]

No shipped default should be flipped from this research alone. First add compatibility readers, explicit telemetry, archetype fixtures, and the live policy-by-helper benchmark designed in iteration 2. [SOURCE: iterations/iteration-002.md:16-36] [SOURCE: iterations/iteration-003.md:44-51]

## 2. Scope And Method

This run intentionally diverged from run 1 across three fresh-context passes:

1. Contrarian semantics and strongest case against the run-1 verdict.
2. Runnable empirical benchmark for named versus null policy and fallback-resource shape.
3. Additive schema, validator, migration, rollback, and edge-case design.

The work inspected repository code, schemas, router configs, playbooks, and benchmark contracts. It did not change shipped router behavior or execute the proposed 4,320-dispatch screening matrix. [SOURCE: iterations/iteration-001.md:3-5] [SOURCE: iterations/iteration-002.md:12-18] [SOURCE: iterations/iteration-003.md:16-18]

## 3. Confirmed Current Semantics

On a zero-signal request, replay returns no selected intents. Telemetry reports a configured default through `defaultApplied`, but `workflowMode` remains null and resource assembly receives the empty intent set. Thus `defaultApplied` is a misleading name for configuration consultation, not evidence of route selection. [SOURCE: iterations/iteration-001.md:9]

Current gold artifacts already permit a named configured value and a defer outcome simultaneously. CLI and MCP ambiguous scenarios explicitly expect defer; the MCP playbook treats its Chrome child as a suggestion only. [SOURCE: iterations/iteration-001.md:13]

## 4. Strongest Contrarian Case

`sk-prompt` is the best bounded case for a named recommendation: it has one broad mutating workflow and one niche read-only model-profile lookup. A recommendation toward `prompt-improve` can reduce needless uncertainty without proving that the router should silently select it. [SOURCE: iterations/iteration-001.md:11]

This weakens any proposal to erase every named value immediately. It does not validate the field name `defaultMode`, nor establish dominance from traffic. The field currently conflates recommendation metadata with selection policy.

## 5. Per-Hub Implication

| Hub | Current research implication | Evidence gap |
|---|---|---|
| `sk-prompt` | Preserve the named value as a recommendation candidate; do not infer silent selection | Natural mode frequency |
| `cli-external-orchestration` | Runtime dependence argues for `defer` or detector evidence, with no static selection default | Live wrong-provider commitment rate |
| `system-deep-loop` | Seven materially different lanes make wrong default selection costly | Live wrong-loop launch rate |
| `mcp-tooling` | Existing defer plus fallback-only suggestion is already the third archetype in practice | Helper-shape effect |
| `sk-design` | Six modes need empirical comparison of defer, detector cues, and compressed helper | Whether design intent can be detected reliably |
| `sk-doc` | Null plus neutral helper is the defer reference pattern | Null friction by prompt stratum |
| `sk-code` | Null plus surface detection is a distinct detect reference pattern | Detector-miss behavior |

[SOURCE: iterations/iteration-002.md:28-36] [SOURCE: iterations/iteration-003.md:30-42]

## 6. Fallback Resource Policy

Fallback helper shape must be tested independently from selection policy. The live benchmark should cross policy `{named, null}` with helper `{full registry, compressed card, child hint, none}`. A full registry can add operational noise; a child hint can anchor; no helper can starve discovery. The compressed card is the purpose-built neutral candidate: mode id, one use-when cue, one discriminating question, and one exclusion cue per mode, with no default badge. [SOURCE: iterations/iteration-002.md:18-24]

Prefer the compressed card only if it is non-inferior to the full registry within three percentage points and reduces measured input tokens by at least 20%. Token efficiency remains unknown when model input accounting is unavailable. [SOURCE: iterations/iteration-002.md:92-98]

## 7. Live Experiment Design

Use isolated fixture snapshots rather than editing live hubs. Within each matched block, only `routerPolicy.defaultMode`/new policy metadata and helper payload may differ. Reject fixtures whose normalized diff escapes those fields. [SOURCE: iterations/iteration-002.md:18] [SOURCE: iterations/iteration-002.md:38-59]

Build 12 stems per hub across zero-signal, boundary, and weak-but-resolvable strata. Hide mode ids and reserve one third as holdouts. Cross five hubs, 12 stems, eight policy-helper arms, three model families, and three screening replays for 4,320 dispatches. Confirm threshold-touching effects with ten replays. [SOURCE: iterations/iteration-002.md:20-26]

## 8. Grading And Falsification

Blind two graders to arm identity. Record one terminal outcome from `correct_pick`, `targeted_question`, `unsupported_pick`, `arbitrary_pick`, `freeze`, or `invented_mode`, plus repository-standard 0/1/2 evidence dimensions. Preserve raw trace fields and adjudicate material disagreements. [SOURCE: iterations/iteration-002.md:24] [SOURCE: iterations/iteration-002.md:61-90]

Named policy is falsified as harmless when it materially raises unsupported or arbitrary picks on defer/question strata. Null is falsified as preferable when it materially raises freezes or unnecessary questions without reducing wrong picks. Use the hub-specific practical margins recorded in iteration 2 rather than claiming one fleet-wide effect size. [SOURCE: iterations/iteration-002.md:28-36]

## 9. Proposed Schema

Add `routerPolicy.selectionPolicy` with `keyword-default | defer | detect`, and `routerPolicy.recommendationMode` as a registered mode or null. Do not place contextual callbacks in JSON. Context-dependent choices belong to detector/scoring evidence; explicit multi-mode requests remain ordered bundles. [SOURCE: iterations/iteration-003.md:22] [SOURCE: iterations/iteration-003.md:30]

Legacy `defaultMode` cannot identify the archetype automatically. A non-null value can coexist with defer behavior, while null can mean either defer or detect. Each hub therefore needs explicit annotation rather than an automatic codemod. [SOURCE: iterations/iteration-003.md:34-42]

## 10. Telemetry Compatibility

Dual-emit:

- `defaultConfigured`: a legacy default or recommendation exists.
- `defaultConsulted`: no mode scored and a configured recommendation was considered.
- `recommendationMode`: the optional recommendation.
- `selectionPolicy`: the declared archetype.
- `selectionSource`: result telemetry such as detector, score, explicit hint, or defer.

Retain `defaultApplied` temporarily as a deprecated alias of `defaultConsulted`, not `defaultConfigured`. Migrate reports and tests before removing it; normalize archived artifacts at read time rather than rewriting historical evidence. [SOURCE: iterations/iteration-003.md:24]

## 11. Migration And Rollback

Safe order:

1. Add tolerant schema/parser support and legacy normalization.
2. Dual-emit telemetry and update reports/tests.
3. Add fixtures for all archetypes and degenerate cases.
4. Update create-skill canon and templates.
5. Annotate hubs without changing effective routing.
6. Run deterministic and live gates.
7. Consider policy-value changes hub by hub.
8. Remove legacy fields only after consumer scans are clean.

Rollback hub values before templates and canon, while retaining tolerant readers and dual telemetry. Alarm on unknown policies, legacy/new semantic mismatches, stale recommendations, fallback exposure without consultation, and material wrong-pick/freeze regressions. [SOURCE: iterations/iteration-003.md:28] [SOURCE: iterations/iteration-003.md:44-51]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Treat `defaultApplied` as actual child selection | `workflowMode` remains null | `router-replay.cjs` trace | 1 |
| Use replay alone as a live-model proxy | Live traces are a separate advisory surface | benchmark command contract | 1 |
| Use a two-arm named/null test | Confounds policy with helper shape | factorial experiment analysis | 2 |
| Assume full registry is best | Registry carries non-routing implementation noise | registry and smart-routing evidence | 2 |
| Use one run per case | Below the repository stability floor | stability helper and benchmark summary | 2 |
| Infer archetype from nullability | Null conflates defer and detect; non-null can still defer | live hub configs | 3 |
| Rename `defaultApplied` directly to `defaultConfigured` | Loses consultation semantics | replay condition | 3 |
| Encode contextual or multi-default callbacks | Creates a second router and duplicates ordered-bundle/detector logic | schema and hub contracts | 3 |
| Flip live hubs before scaffolding | Current validator cannot enforce the proposed semantics | doctor validator | 3 |

## Divergence Map

| Territory | Result | Remaining Frontier |
|---|---|---|
| Contrarian semantics | Named recommendation can be coherent; named selection is unproven | Natural traffic distribution |
| Live-mode reality | Runnable factorial benchmark specified | Execute across model families |
| Fallback-resource shape | Four independent arms defined | Measure correctness and token cost |
| Third archetype | `keyword-default`, `defer`, `detect` specified | Validate names and compatibility in fixtures |
| Migration and rollback | Dependency-ordered rollout and reverse rollback defined | Set operational thresholds from traces |
| Contextual/multi-dominant modes | Keep out of static recommendation fields | Test detector misses and ordered bundles |
| Null anti-patterns | Bias, helper starvation, tie-break leakage, fan-out, and stale refs identified | Add explicit negative fixtures |

## 12. Open Questions

1. What effects will the preregistered policy-by-helper benchmark observe across model families?
2. What privacy-safe corpus can estimate natural hub request distributions without turning production prompts into governance data?
3. Should final field names be `selectionPolicy`/`recommendationMode`, or another vocabulary validated against operators and telemetry consumers?

## 13. Risks

- A schema-only migration can create the appearance of safety while live models still anchor on recommendations.
- A null/defer policy can increase clarification friction or arbitrary choices when helper resources are poor.
- A detection policy can silently degrade to arbitrary routing when detector-miss behavior is unspecified.
- Archived telemetry can be misread if readers do not normalize legacy `defaultApplied` semantics.

## 14. Canon And Benchmark Implications

The create-skill canon should require deliberate archetype selection, document archetype-specific invariants, and forbid deriving policy from mode count or copying a neighboring hub. Route-gold must include a first-class defer/disambiguate outcome and zero-signal fixtures for all three archetypes. [SOURCE: iterations/iteration-003.md:26-28]

The benchmark must keep deterministic replay as the gating trace and live model runs as advisory empirical evidence until reproducibility and grading gates mature. [SOURCE: iterations/iteration-001.md:15] [SOURCE: iterations/iteration-002.md:24-26]

## 15. Recommendation

Adopt the three-archetype model as the design target, preserve named values only as explicit recommendations where justified, and postpone every shipped policy flip until compatibility telemetry, archetype fixtures, and the live factorial benchmark pass. This supersedes a fleet-wide immediate keep/flip action with an evidence-gated migration sequence.

## 16. References

- [SOURCE: iterations/iteration-001.md]
- [SOURCE: iterations/iteration-002.md]
- [SOURCE: iterations/iteration-003.md]
- [SOURCE: resource-map.md]

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 3
- Charter questions answered: 5 / 5
- Empirical follow-ups remaining: 2
- newInfoRatio trend: 1.00 -> 0.90 -> 0.82
- Average newInfoRatio: 0.9067
- Convergence threshold: 0.05, telemetry only under `max-iterations`
- Quality guards: source diversity passed; focus alignment passed; no single-weak-source conclusions used for policy promotion
- Divergence result: three distinct territories completed without early synthesis
