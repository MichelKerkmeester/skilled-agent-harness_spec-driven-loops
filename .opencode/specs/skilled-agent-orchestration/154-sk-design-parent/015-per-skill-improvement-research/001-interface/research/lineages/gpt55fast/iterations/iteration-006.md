# Iteration 6: Prioritized Improvement Synthesis And Explicit Do-Not List

## Focus

Consolidate the evidence into prioritized improvements, dependencies, and negative knowledge.

## Findings

1. P0: encode route-away outcomes for non-design prompts. ID-005 is the lowest score and first-fails at routed-intra [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:55]. The skill already states pure logic routes to `sk-code` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:36]. The router output should make that observable.
2. P1: split overloaded grounding routes. Keep `design_inventory.md` for owned design systems and `design_references_mcp.md` plus one tool catalog for real-world Mobbin/Refero references. This should improve D3 rows where grounding currently routes 5-6 resources.
3. P1: align mechanical preflight routing and benchmark expectations. The preflight card references dials, mechanical defaults, and content gate [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:18], but ID-011 still first-fails at routed-intra [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:321]. Treat this as a fixture/router alignment task.
4. P1: add a narrow redesign intake. Use greenfield/preserve/overhaul and never-change-silently rules from the external corpus, but keep it small to avoid resource overload [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:787] [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:825].
5. P1: require a design-to-build handoff manifest when interface hands to `sk-code`. The current manifest is optional [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:90]. This is one of the strongest usefulness upgrades because it preserves token, interaction, quality-gate, and open-risk context.
6. P2: fold visual-asset strategy into existing content/real-UI guidance rather than adding a broad new asset. The current content gate already covers image seed and fake screenshot failures [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:121], while external corpus adds useful priority order for image generation and real imagery [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/taste-skill.md:266].
7. P2: add static verification around playbook structure and benchmark router regressions. The playbook explicitly says recursive validation is missing [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:516].

## Sources Consulted

- Prior iteration findings
- `design-interface/SKILL.md`
- `interface_preflight_card.md`
- `real_ui_loop.md`
- `copy_and_mock_data.md`
- `taste-skill.md`
- benchmark report artifacts
- manual playbook

## Assessment

- newInfoRatio: 0.04
- Novelty justification: No materially new source class was found; this iteration consolidated priorities and negative knowledge.
- Confidence: High for prioritization relative to the observed benchmark and current packet; implementation effort remains to be verified.

## Reflection

What worked: convergence reached after all key questions had evidence-backed answers.

What failed or was ruled out: more aesthetic presets and bulk corpus import.

## Recommended Next Focus

Implement P0/P1 router and handoff changes in a separate gated packet, then rerun benchmark and playbook checks.
