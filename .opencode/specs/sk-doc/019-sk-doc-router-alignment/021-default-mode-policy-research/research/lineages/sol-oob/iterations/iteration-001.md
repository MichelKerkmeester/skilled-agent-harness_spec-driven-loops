# Iteration 1: Direct Layer-0-to-Mode Selection

## Focus

This iteration tested the narrowest reading of abolishing the hub-router layer: Layer 0 would select a nested mode directly, while packet directories remain modular. It evaluated whether that change preserves packet identity, packet-local context loading, authority boundaries, and deterministic replay. The practical keep-versus-null question was excluded because the strategy marks it saturated.

## Findings

1. Packet modularity does not intrinsically depend on keyword scoring in `hub-router.json`. The registry already names every packet, its kind, tool surface, folder, aliases, and advisor-routing class, and is explicitly the packet source of truth. A direct selector could therefore return a stable `(hub, workflowMode)` without flattening packet contents. The hub-level graph identity would still need to remain because nested packets deliberately have no independent advisor identity. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:49] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:60] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:94]

2. Current Layer 0 cannot generally perform that direct selection. New-hub modes normally use `routingClass: metadata`, which produces no advisor map entry, while the advisor's `workflowMode` publication is a generated, deep-loop-specific projection and the handler resolves modes through those special alias functions. Abolishing hub-local selection without first generalizing this projection would make most nested modes invisible at the decision point. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:108] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/scorer_fusion/projection.md:26] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:261]

3. Directly naming one mode is insufficient for hubs whose local result is a composition. In `sk-code`, the hub handles unknown-mode fallback, loads the selected packet, adds zero or more surface evidence packets, and keeps surface detection in shared hub context. Moving only the primary classification to Layer 0 would silently drop surface bundles and fallback resources; moving all of it would reproduce the hub router inside Layer 0. [SOURCE: .opencode/skills/sk-code/SKILL.md:50] [SOURCE: .opencode/skills/sk-code/SKILL.md:86] [SOURCE: .opencode/skills/sk-code/SKILL.md:108] [SOURCE: .opencode/skills/sk-code/SKILL.md:120]

4. Authority should remain packet-local even if selection moves upward. The registry carries allowed and forbidden tools plus mutation state, nested surfaces are explicitly read-only, and the advisor's own routing contract yields to exact skill names or explicit user direction. Therefore Layer 0 can safely recommend a mode, but the selected packet or a thin hub-container resolver must still load and enforce the packet contract; a recommendation cannot itself grant authority. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:60] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:83] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59] [INFERENCE: tool authority belongs to the loaded packet contract, while advisor output is a precedence-bounded selection]

5. Full removal also deletes the current offline oracle: the benchmark's deterministic CI mode replays `hub-router.json` together with `mode-registry.json`. The deep-loop projection demonstrates a viable replacement pattern—compile mode policy into a hash-checked artifact and publish `workflowMode`—but it is intentionally generated and drift-tested, not learned or read dynamically at runtime. The safe architecture is therefore a semantic collapse, not a governance collapse: one canonical registry-derived policy can feed Layer 0, while a thin local resolver validates the returned mode, assembles bundles/resources, applies defer behavior, and enforces packet authority. [SOURCE: .opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:60] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/scorer_fusion/projection.md:26] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:159] [INFERENCE: replacing both local resolution and its replayable artifact with an opaque Layer-0 choice would weaken reproducibility]

## Ruled Out

- Fully removing hub-local resolution while leaving Layer 0 unchanged: metadata-routed modes are not generally projected to the advisor, and composite local outcomes would be lost.
- Promoting every nested packet to an independent advisor identity: this contradicts the deliberate single graph identity and makes advisor-invisible evidence packets independently routable.
- Replacing deterministic router replay with live-only evaluation: this removes the current offline CI oracle rather than replacing it.

## Dead Ends

- A one-field `workflowMode` handoff cannot represent ordered bundles, surfaces, fallback resources, confidence, or defer semantics. Treating it as a complete replacement is a dead end unless the handoff becomes a typed route plan.

## Edge Cases

- Ambiguous input: none; the selected interpretation was direct selection with packet modularity retained, not deletion of packet containers.
- Contradictory evidence: none. The deep-loop projection shows direct mode publication is feasible, but its special generation and drift guard limit rather than contradict that evidence.
- Missing dependencies: none; the absent resource map was declared by config and did not block source-level architecture evidence.
- Partial success: none; the first key question is answered conditionally from current contracts.

## Sources Consulted

- `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/spec.md:107`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:49`
- `.opencode/skills/sk-code/SKILL.md:48`
- `.opencode/skills/system-skill-advisor/feature_catalog/scorer_fusion/projection.md:20`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:261`
- `.opencode/skills/system-skill-advisor/SKILL.md:59`
- `.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:60`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:145`

## Assessment

- New information ratio: 1.0 (5 fully new findings / 5 total findings; the lineage registry was empty)
- Questions addressed: Can Layer 0 safely eliminate hub-local routing while preserving modular packets, local context loading, and explicit authority boundaries?
- Questions answered: Yes, conditionally—the current hub keyword scorer can be collapsed only if a deterministic registry-derived policy and thin packet-local resolver preserve bundles, context loading, defer behavior, replay, and authority. Full elimination under the current contract is unsafe.

## Reflection

- What worked and why: comparing the canonical hub doctrine with a concrete composite hub and the advisor's only direct-mode projection separated packet containment from routing policy.
- What did not work and why: broad repository search produced substantial historical and template noise; narrow line-range reads were needed to distinguish current contracts from old assumptions.
- What I would do differently: model the next proposal as an explicit typed route-plan schema early, then test each field against offline replay and correction telemetry.

## Recommended Next Focus

Investigate a deterministic/adaptive hybrid that learns from corrections without making offline replay irreproducible. In particular, test a versioned, hash-addressed correction overlay that can influence Layer-0 scores while every decision records the immutable base-policy hash, overlay hash, features, and selected typed route plan for exact replay.
