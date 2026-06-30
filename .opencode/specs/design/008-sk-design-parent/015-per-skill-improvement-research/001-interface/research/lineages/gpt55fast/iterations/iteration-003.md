# Iteration 3: Efficiency Improvements In Router Resource Loading

## Focus

Identify the smallest router changes that reduce wasted reads and improve intra-router precision without deleting useful references.

## Findings

1. Do not reduce efficiency by removing broad guidance indiscriminately. D2 discovery is high at `91/100` and D5 connectivity is perfect at `100/100`; the problem is not that resources are unreachable [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:18] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:21].
2. The `GROUNDING` router branch is overloaded. It maps any grounding signal to four references: `design_inventory.md`, `design_references_mcp.md`, `mobbin_tools.md`, and `refero_tools.md` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:119]. In benchmark rows, grounding-heavy scenarios route 5-6 resources and score poorly on D3: ID-008 has `routedCount: 6`, `wastedCount: 5` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:421]; ID-010 has `routedCount: 6`, `wastedCount: 3` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:360].
3. Split `GROUNDING` into at least two intent branches. `REAL_SYSTEM_GROUNDING` should load `design_inventory.md` and likely `real_ui_loop.md` when the brief says existing design system, reuse before generate, registered component, or live system. `REAL_WORLD_REFERENCE` should load `design_references_mcp.md` and then only the matching tool catalog when prompt signals Mobbin/native/app flow or Refero/web/style lookup. This follows the docs: design inventory is for systems you own [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-grounding/design_inventory.md:33], while Mobbin/Refero are third-party shipped UI references [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design-grounding/design_references_mcp.md:35].
4. Encode route-away outcomes for negative cases. `SKILL.md` already says pure logic uses `sk-code` and documentation uses `sk-doc` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:36] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:39]. The parseable router only scores positive design intents. Add a negative-intent branch or response contract that returns `routeAway: sk-code` / `routeAway: sk-doc`, so ID-005 can be measured as a correct abstention rather than an empty non-answer.
5. Tighten `MECHANICAL_PREFLIGHT`. Current map includes `mechanical_defaults.md`, `copy_and_mock_data.md`, and `interface_preflight_card.md` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:117]. The card itself says dial calibration comes from `brief_to_dials.md` [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:18]. Add `brief_to_dials.md` to the mechanical preflight branch or update benchmark expectations if the card-only route is intentionally sufficient.

## Sources Consulted

- `design-interface/SKILL.md`
- `design_inventory.md`
- `design_references_mcp.md`
- `interface_preflight_card.md`
- benchmark JSON rows for ID-008, ID-010, ID-011, ID-005

## Assessment

- newInfoRatio: 0.55
- Novelty justification: This pass produced concrete router surgery rather than broad reference pruning.
- Confidence: High for GROUNDING overload; moderate for preflight expected-resource details pending benchmark fixture inspection.

## Reflection

What worked: D3 row evidence identified where overload happens.

What failed or was ruled out: deleting references to improve D3 globally. The fix should split routing branches, not amputate knowledge.

## Recommended Next Focus

Investigate user-facing UX, handoff, redesign, and tooling gaps.
