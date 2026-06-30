# Iteration 5: Prioritization And Negative Knowledge

## Focus

Convert findings into a priority order and explicit do-not list.

## Findings

1. Highest priority is routing alias expansion in `mode-registry.json`, because it directly targets the operator-provided Mode A score and requires no new content. Add aliases for `layout rhythm`, `grid`, `container queries`, `adaptation matrix`, `data visualization`, `chart type`, `data table`, `color-for-data`, `token starter`, and `sk-code handoff`. [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:27-37], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:31-32]
2. Second priority is reconciling token resource loading. Cross-axis token-system work should load the register, token starter, parent token vocabulary, and color/type/layout references. The current table says this at a high level, while the pseudocode only maps `TOKENS` to corpus map plus token starter. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:92-93], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:115-122]
3. Third priority is a foundations intake and handoff card. The shared register is the first design decision and foundations reads it to set color strategy and density, but the mode router discovery only scans foundations `references/` and `assets/`. A local card can make the register step impossible to miss without duplicating the register. [SOURCE: file:.opencode/skills/sk-design/shared/register.md:16-29], [SOURCE: file:.opencode/skills/sk-design/shared/register.md:73-79], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:140-145]
4. Fourth priority is a worked-example asset. It should be annotated as an example and not a preset, because 009 explicitly rejects bulk import and style-preset expansion as the wrong leverage. [SOURCE: file:.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:16-18], [SOURCE: file:.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:158-176]
5. Fifth priority is a manual-scenario results/benchmark bridge. It is useful, but it should follow routing and handoff fixes because it measures the intended behavior rather than creating it. [SOURCE: file:.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md:28-38]
6. Do not split foundations now. The 001 taxonomy notes foundations is a soft merge with internal color/type/layout folders, and 009 explicitly lists splitting foundations into color/layout children as a do-not. [SOURCE: file:.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/research.md:84-88], [SOURCE: file:.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md:82]

## Sources Consulted

- `mode-registry.json`
- `design-foundations/SKILL.md`
- `shared/register.md`
- `009-reference-asset-expansion/research/research.md`
- `001-corpus-research/research/research.md`
- `manual_testing_playbook/manual_testing_playbook.md`

## Assessment

- newInfoRatio: 0.16
- Novelty: Low to moderate. This pass mostly consolidated earlier evidence into sequence and negative knowledge.
- Confidence: High for priority 1 and 2; medium for priority 4 because examples need careful anti-preset wording.

## Reflection

- What worked: Prior research supplied strong do-not boundaries.
- What failed: No local benchmark file was available to calibrate which missed aliases caused the 17-point gap.
- Ruled out: Splitting the skill, adding basics, and importing corpus volume.

## Recommended Next Focus

Run one final convergence pass and then synthesize.
