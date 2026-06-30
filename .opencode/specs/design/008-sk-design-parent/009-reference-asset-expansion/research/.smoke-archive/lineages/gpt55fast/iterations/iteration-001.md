# Iteration 1: Per-Mode Expansion Matrix

## Focus
Map validated corpus gaps and current `sk-design` inventory into a practical reference/asset expansion plan for `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator`, without changing taxonomy or implementing edits.

## Findings
1. The highest-leverage prerequisite is shared, not mode-specific: add a Brand-vs-Product operating register before adding transform, audit, or pre-flight material. Gap analysis marks this as the single must-add and says it gates 04/07/11/N1/N2 [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:16,41,49]. `impeccable` requires reading a matching brand/product register before design work [SOURCE: .opencode/specs/design/008-sk-design-parent/external/impeccable.md:20-21].
2. `design-interface` should receive compact decision assets, not a broad new style library. Current interface already has a two-pass process and anti-default critique [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:97-120], and the corpus adds a useful design read, dials, mechanical hero/bento checks, and realistic-content bans [SOURCE: .opencode/specs/design/008-sk-design-parent/external/taste-skill.md:25-39,43-63,236-260,910-979].
3. `design-foundations` already covers color, type, and layout references [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269-273], so the useful additions are data visualization and handoff/check cards. The gap analysis names data visualization as a should-add for foundations [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:24,51], and the external data-viz skill supplies chart selection, accessibility, responsive alternatives, and real-data testing [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/ui-design/skills/data-visualization/SKILL.md:9-45].
4. `design-motion` has a strong baseline across strategy, micro-interactions, AnimatePresence, and performance [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:81-95,289-293]. Expansion should add advanced/overdrive decision gates and gesture/interaction handoff bridges, because the gap analysis assigns emil advanced interaction craft and overdrive motion to motion [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:19,30,51]. External motion sources emphasize purpose, reduced motion, timing, materials, and progressive enhancement [SOURCE: .opencode/specs/design/008-sk-design-parent/external/animate.md:10-18,41-52,108-158], [SOURCE: .opencode/specs/design/008-sk-design-parent/external/overdrive.md:19-31,93-127].
5. `design-audit` is the most under-expanded mode relative to validated gaps. It already owns severity, five-dimension scoring, anti-patterns, accessibility, and hardening [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:82-96,240-263,312-316], while the gap analysis routes model-specific tells, remediation, realistic mock content, and mechanical pre-flight to audit/interface [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:18,22,26-27,51].
6. `design-md-generator` should stay the extraction and format-fidelity engine while adding an optional authoring reference/template. Current md-generator is explicitly measured extraction and anti-hallucination [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:12-28,42-49], but gap analysis flags forward DESIGN.md/PRODUCT.md authoring from `stitch-skill` as a should-add [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:21]. Stitch supplies the authoring shape for atmosphere, color, typography, components, layout, motion, and anti-patterns [SOURCE: .opencode/specs/design/008-sk-design-parent/external/stitch-skill.md:17-25,115-162].

## Sources Consulted
- `.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/research.md`
- `.opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md`
- `.opencode/specs/design/008-sk-design-parent/external/`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## Assessment
- `newInfoRatio`: 1.0.
- Novelty justification: first and only pass for this lineage; existing corpus gaps were converted into a per-mode reference/asset matrix with do-not-add boundaries.
- Confidence: high for placement of register/audit/interface/foundations/motion/md-generator additions because those are directly grounded in current skill inventory and validated gap-analysis severities. Medium for exact effort sizing because implementation size depends on final template depth.

## Reflection
- What worked: using current mode reference maps prevented duplicate additions and kept suggestions small.
- What failed: direct glob for `external/**/*` returned no files, so directory read was needed to confirm corpus inventory.
- Ruled out: new child skills, implementation edits, and bulk corpus import.

## Recommended Next Focus
No next research focus inside this lineage because `maxIterations` is 1. If implementation is later approved, start with shared `register.md`, then `design-audit` detector/pre-flight assets.
