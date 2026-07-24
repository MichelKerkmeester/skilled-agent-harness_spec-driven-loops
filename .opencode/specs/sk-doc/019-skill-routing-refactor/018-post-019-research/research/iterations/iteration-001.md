# Iteration 1: Threshold-Recovery-Provenance Across Routing Archetypes

## Focus

This iteration tested whether Threshold, Recovery, and Provenance form a sufficient decomposition across the twelve live skill hubs, and whether authority belongs beside them as a fourth coordinate. The narrow interpretation is policy decomposition: what causes a router to commit, what it does when commitment is unsafe or fails, and where route evidence comes from. Execution authorization was evaluated separately because the seed packet explicitly left open whether authority is a coordinate or a cross-cutting constraint. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/001-research/009-oob-idea-deep-dives/008-trp-decomposition/spec.md:171]

## Actions Taken

1. Reconstructed the live fleet from top-level skill metadata, router policies, mode registries, and leaf manifests.
2. Compared the named-default, ordered-bundle, surface-bundle, transport, same-packet-mode, and singular-hub shapes.
3. Traced the candidate decomposition from its unvalidated seed packet into the compiled contract schema and executable validation harness.
4. Tested the authority hypothesis against transport boundaries, route-decision authority states, and destination-local verification semantics.

## Findings

1. **The live fleet is seven multi-mode routers plus five singular hubs.** The multi-mode set is `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, and `system-deep-loop`; the singular set is `mcp-code-mode`, `sk-git`, `system-code-graph`, `system-skill-advisor`, and `system-spec-kit`. This yields the twelve hubs named by the research charter. The singular shape is not an exception to the contract family: the compiled-contract packet requires the `N=1` shape to differ from multi-mode routing only by cardinality and empty collections. [INFERENCE: bounded inventory of `.opencode/skills/*/graph-metadata.json`, `hub-router.json`, `mode-registry.json`, and `leaf-manifest.json`] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/spec.md:55]

2. **Threshold-Recovery-Provenance holds as a policy posture, but archetype structure remains necessary.** Threshold is represented by admission, score margin, ambiguity, or a bounded default; Recovery is represented by `defer`, clarification, fallback, ordered bundles, or handoff; Provenance is represented by vocabulary classes, metadata routing classes, command bridges, and serving-policy identity. The archetypes cannot be flattened into three scalar enums: `sk-prompt` has a named default, `sk-doc` has a create-then-quality ordered bundle, `sk-code` distinguishes ordered and surface bundles, and `mcp-tooling` carries transport-specific tool surfaces. [SOURCE: .opencode/skills/sk-prompt/hub-router.json:5] [SOURCE: .opencode/skills/sk-doc/hub-router.json:8] [SOURCE: .opencode/skills/sk-code/hub-router.json:8] [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:140]

3. **Authority is required in the complete routing-to-execution model, but the evidence falsifies “authority as a fourth scalar routing coordinate.”** The compiled policy stores an `authorityGraph` alongside the `(T,R,P)` posture; route decisions keep authority `WithheldUntilVerify`; negative decisions keep it `Withheld`; and route proof explicitly cannot grant commit capability. This is a relation over destinations and execution state, not another preference knob like threshold or recovery. The stronger model is therefore `(T,R,P)` for selection policy plus an independent authority invariant/graph for destination-local PREPARE→VERIFY→COMMIT. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/spec.md:105] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/spec.md:107] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/spec.md:110] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/harness/validate-contracts.cjs:384]

4. **Provenance needs typed sub-kinds to avoid absorbing authority by accident.** Route-signal provenance answers “why was this destination selected?” Serving provenance answers “which compiled or legacy policy is active?” Neither answers “may this destination act?” The live front doors self-gate on serving authority, while `mcp-tooling` explicitly says its transports are not the design-taste authority. Treating all three as one `P` value would recreate the conflation the decomposition is meant to remove. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:46] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:35] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:48]

## Questions Answered

- **Does the Threshold-Recovery-Provenance decomposition hold across the fleet's routing archetypes, and is authority a required fourth coordinate?**
  - **Answered with qualification:** `(T,R,P)` holds as a common policy posture across all twelve hubs, with degenerate values for singular hubs and additional structure for bundles/transports. Authority is required for the complete system but should remain a separate destination-local constraint and verification graph, not a fourth scalar coordinate.

## Questions Remaining

- How should advisor confidence and selective auto-routing be calibrated from operational evidence when the `0.82` floor is a quantized policy value rather than a probability?
- What minimum cross-runtime telemetry proves ordered, successful, causally attributable leaf use?
- Does two-tier required/supplemental leaf selection beat monolithic unioning on sealed-holdout recall within a preregistered route budget?
- Do authored route-gold and typed fixtures predict behavior on unseen natural prompts, or are they overfit?
- The missing primary hypothesis file prevents direct comparison with the two claimed post-019 surveys; locate or reconstruct its provenance before final synthesis.

## Ruled Out

- **Authority as a fourth scalar coordinate:** ruled out because authority is destination-relative, withheld until verification, and represented as a graph plus execution-state invariant.
- **One non-degenerate `(T,R,P)` enum tuple for every hub:** ruled out because singular hubs have trivial internal selection while bundle and transport hubs require ordered targets, roles, and tool-surface constraints.

## Dead Ends

- The strategy's primary hypothesis path, `.opencode/specs/sk-doc/019-skill-routing-refactor/research/post-019-angles/research-angles.md`, does not exist in the live tree. Repository-wide discovery found only an unrelated `research-angles.md` under the system-speckit program. The fallback evidence was the TRP seed packet, live hub artifacts, and compiled contract schema.

## Edge Cases

- Ambiguous input: “authority as a fourth coordinate” could mean a policy knob or a full-system dimension. This iteration evaluated both and preserves the distinction.
- Contradictory evidence: none. The seed packet presents the fourth-coordinate question as unresolved; the later compiled contract consistently models authority separately.
- Missing dependencies: the strategy's primary hypothesis file is missing; direct survey-provenance validation remains open.
- Partial success: all live hub shapes were inventoried, but no natural-prompt or runtime telemetry experiment was run in this iteration.

## Sources Consulted

- `.opencode/specs/sk-doc/019-skill-routing-refactor/001-research/009-oob-idea-deep-dives/008-trp-decomposition/spec.md`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/spec.md`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/harness/validate-contracts.cjs`
- `.opencode/skills/*/graph-metadata.json`
- `.opencode/skills/*/hub-router.json`
- `.opencode/skills/*/mode-registry.json`
- `.opencode/skills/*/leaf-manifest.json`
- `.opencode/skills/mcp-tooling/SKILL.md`
- `.opencode/skills/cli-external-orchestration/SKILL.md`

## Assessment

- New information ratio: `0.85`
- Novelty justification: two findings were fully new, two refined the seed hypothesis, and resolving the authority ambiguity earned the simplicity bonus.
- Questions addressed: 1
- Questions answered: 1
- Confidence: high for the contract-shape conclusion; medium for fleet behavioral completeness because no natural-prompt execution was sampled.

## Reflection

- What worked and why: contrasting the live router archetypes with the compiled contract separated policy-selection concerns from execution authority.
- What did not work and why: the recorded primary hypothesis source is absent, so the claimed two-survey lineage could not be audited directly.
- What I would do differently: begin the next iteration from emitted advisor decisions and observed route outcomes rather than authored policy documents.

## SCOPE VIOLATIONS

- Progressive synthesis is enabled, which would normally update `research/research.md`. The dispatch allowed writes only to this narrative, the append-only state log, and this iteration's delta file, so the synthesis mutation was not executed.

## Next Focus

Calibrate advisor confidence and selective auto-routing from operational evidence: identify what the `0.82` floor actually measures, separate rank score from probability, and compare abstention/error behavior across high-risk and low-risk routing slices.
