# Iteration 6: md-generator Expansion Leverage

## Focus

Identify the highest-leverage reference and asset additions for `design-md-generator`.

## Findings

- Do not expand measured extraction first. The skill already captures real CSS across five viewports, emits `tokens.json`, writes a v3 Style Reference, validates fidelity, and has examples [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:22], [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:84].
- Add a forward-authoring reference, not a new backend. `stitch-skill` describes generating `DESIGN.md` files from atmosphere, color, typography, component behaviors, layout, motion, and anti-patterns rather than measured extraction [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/stitch-skill.md:17].
- Preserve cardinal fidelity boundaries. Current `design_md_format.md` requires every value to come verbatim from `tokens.json`, no false systems, and no invention [SOURCE: .opencode/skills/sk-design/design-md-generator/references/design_md_format.md:27]. A forward-authoring path must label inferred/brief-provided values differently from measured extraction.
- Add prompt assets that distinguish measured extraction, brief-authored style reference, and hybrid extension. The current writing guide already defines named, confident, restrained prose, so the asset should route the source of truth before writing [SOURCE: .opencode/skills/sk-design/design-md-generator/references/writing_style_guide.md:29].
- Extend component documentation with state/decision logic rather than more examples. The current component taxonomy already requires Use lines, state matrices, and component choice decision rules [SOURCE: .opencode/skills/sk-design/design-md-generator/references/component_taxonomy.md:347].

## Sources Consulted

- `.opencode/skills/sk-design/design-md-generator/SKILL.md:22`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:84`
- `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:27`
- `.opencode/skills/sk-design/design-md-generator/references/writing_style_guide.md:29`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/stitch-skill.md:17`

## Assessment

- newInfoRatio: 0.39
- Novelty: Medium. The key gap is a mode distinction, not missing extraction detail.
- Confidence: High.

## Reflection

What worked: reading current pipeline detail prevented recommending duplicate extraction docs.
What failed: a broad `design-spec` child recommendation is out of phase scope.
Ruled out: changing `md-generator`'s canonical role in this research phase.

## Recommended Next Focus

Extract cross-mode assets and explicit do-not-add rules.
