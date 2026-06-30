# Iteration 1: Corpus Topology and Routing Models

## Focus

Identify the structural patterns in the design corpus before naming children.

## Findings

1. `ui-skills-root` is a parent router, not a content-heavy design skill. It tells the agent to identify the UI category, inspect that category, select the smallest useful skill set, and load only selected skills [SOURCE: external/ui-skills-root.md:22-29]. It also caps normal selection at one to three skills [SOURCE: external/ui-skills-root.md:41-49].
2. `designer-skills-main` uses collection and plugin boundaries as the principal structure: design practice contains 97 skills and 30 commands across 9 plugins [SOURCE: external/designer-skills-main/README.md:61-77]. This is strong evidence for sibling-family decomposition rather than one huge packet.
3. The `designer-skills-main` README distinguishes skills as domain knowledge units and commands as workflows that chain skills [SOURCE: external/designer-skills-main/README.md:113-119]. The proposed `sk-design` parent should follow that distinction: route and sequence, but do not absorb every child workflow.
4. `impeccable` is the strongest counterexample: one broad user-invocable hub exposes many commands in a single surface [SOURCE: external/impeccable.md:119-147]. It demonstrates that a hub can work, but it also shows high setup coupling because every run must load context, command reference, existing design system, and a register reference [SOURCE: external/impeccable.md:13-21].
5. The current internal skills already have different operational boundaries: `sk-design-interface` owns distinctive direction and visual judgment [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:14-17], while `sk-design-md-generator` owns measured CSS extraction and DESIGN.md fidelity [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:10-14].

## Sources Consulted

- `external/ui-skills-root.md`
- `external/designer-skills-main/README.md`
- `external/impeccable.md`
- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-md-generator/SKILL.md`

## Assessment

- newInfoRatio: 1.00
- Novelty: first pass established source topology and the hub-versus-router tension.
- Confidence: high.

## Reflection

What worked: reading router and collection docs first prevented premature child naming.

What failed: treating all standalone docs as equal units would ignore the corpus's own router and command distinctions.

Ruled out: flat one-child-per-doc taxonomy.

## Recommended Next Focus

Map visual creation sources to the minimum viable child set.
