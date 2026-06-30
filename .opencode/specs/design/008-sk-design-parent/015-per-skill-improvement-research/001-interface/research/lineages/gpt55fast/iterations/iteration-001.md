# Iteration 1: Current Interface Packet Inventory And Post-009 Landed State

## Focus

Establish the actual current interface skill surface before proposing changes. The operator names `.opencode/skills/sk-design/interface`, but the live hub resolves the mode key `interface` to the physical `design-interface` packet.

## Findings

1. The physical packet is `.opencode/skills/sk-design/design-interface/`, not `.opencode/skills/sk-design/interface/`. The packet declares `name: design-interface` and titles itself `Interface Design (interface)` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:1] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:14]. The hub registry maps `workflowMode: interface` to packet `design-interface` [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:16] [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:18].
2. The 009 reference/asset expansion already landed the core interface recommendations. Prior 009 called out interface gaps in preflight, brief dials, mechanical defaults, copy/mock data, and visual-asset strategy [SOURCE: file:.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:55] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:61]. Current `SKILL.md` now always loads the shared register and `brief_to_dials.md`, conditionally loads mechanical/content gates, and lists `interface_preflight_card.md` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:73] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:79].
3. The current asset surface is no longer empty. `assets/interface_preflight_card.md` exists and states it is the binary final filter covering the layout gate, content gate, and dial calibration [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:16] [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:18].
4. The skill's current problem is unlikely to be lack of guidance. The packet now has a broad router, 13 references plus one asset in the interface packet, and shared register use. The README explicitly documents the register/dials, real-UI loop, mechanical gates, and related docs [SOURCE: file:.opencode/skills/sk-design/design-interface/README.md:78] [SOURCE: file:.opencode/skills/sk-design/design-interface/README.md:98].
5. The useful improvement axis should shift from adding more content to improving routing precision, execution ergonomics, and verification. The 009 synthesis itself warned that expansion should be operational rather than bulk import [SOURCE: file:.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:17].

## Sources Consulted

- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-interface/README.md`
- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- `.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md`

## Assessment

- newInfoRatio: 1.00
- Novelty justification: First pass established the live packet, resolved the alias mismatch, and separated landed expansion work from remaining improvement work.
- Confidence: High for path and landed-state claims because they are filesystem and file-content backed.

## Reflection

What worked: inventory before ideation prevented stale recommendations.

What failed or was ruled out: treating `.opencode/skills/sk-design/interface` as a physical folder. The correct physical packet is `design-interface`.

## Recommended Next Focus

Read the routing benchmark artifacts and identify scenario-level bottlenecks.
