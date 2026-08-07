# Iteration 1: RESOURCE_MAP Co-occurrence Clusters

## Focus
Map which of the 17 INTENT_SIGNALS share RESOURCE_MAP entries.

## Findings (confirmed)
1. **Motion cluster (6 intents)** share `animation-decision-framework.md`. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:148-153]
2. **Preflight/register bridge** — MECHANICAL_PREFLIGHT shares `brief-to-dials.md` with REGISTER_DIALS and `copy-and-mock-data.md` with COPY_MOCK_DATA. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:142-143]
3. **DEFAULT_RESOURCE** loads on every task. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:112]
4. **Isolated loaders** — DESIGN_PRINCIPLES, VARIATION_DIVERSITY, REDESIGN_INTAKE, TRANSFORM_APPLICATION, REAL_SYSTEM_GROUNDING, REAL_WORLD_REFERENCE, VISUAL_SYSTEM, UX_QUALITY have no pairwise resource overlap except motion/preflight bridges.

## Assessment
- newInfoRatio: 0.92
