# Iteration 5: Onboarding and Backward Compatibility

## Focus

Define how existing skills and user habits migrate into the recommended child family.

## Findings

1. Existing `sk-design-interface` should become the compatibility name for the visual craft child. It already owns UI work involving palette, typography, layout, motion, interface copy, and anti-template design [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:20-31].
2. `sk-design-interface` also has integration references to `sk-code`, `sk-code-review`, browser screenshot self-critique, Figma, Mobbin, and Refero [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:194-207]. These should move to parent shared routing plus child-specific craft guidance.
3. Existing `sk-design-md-generator` should remain a named child or compatibility alias because it has an embedded extract-write-validate pipeline and explicit cardinal fidelity rule [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:206-250]. It should feed `sk-design-system-reference`, not be flattened into general craft.
4. `sk-design-md-generator` already says downstream consumers include `sk-design-interface`, `sk-code`, and AI coding agents [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-402]. In the new family, the parent should route DESIGN.md generation before craft or code implementation when measured tokens are required.
5. The designer-skills sequence says research informs strategy, strategy shapes UI, UI patterns become systems, and systems flow into ops [SOURCE: external/designer-skills-main/README.md:202-208]. Onboarding should teach this sequence while still allowing direct child invocation.
6. Output and presentation-specific material should be routed to delivery-ops, not craft, because `output-skill` is about exhaustive deliverable completion [SOURCE: external/output-skill.md:22-49] and `apple-bento-grid` is about static presentation graphics and screenshots [SOURCE: external/apple-bento-grid-main/SKILL.md:81-118].
7. Backward compatibility should include name redirects, trigger phrase preservation, and a deprecation plan only after parent routing has telemetry or manual validation.

## Sources Consulted

- `.opencode/skills/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design-md-generator/SKILL.md`
- `external/designer-skills-main/README.md`
- `external/output-skill.md`
- `external/apple-bento-grid-main/SKILL.md`

## Assessment

- newInfoRatio: 0.12
- Novelty: compatibility details were new, but taxonomy and structure were stable.
- Confidence: high.

## Reflection

What worked: using current internal skill contracts as compatibility anchors.

What failed: immediate rename/delete would break existing references and user muscle memory.

Ruled out: folding `sk-design-md-generator` into general interface craft.

## Recommended Next Focus

Converged. Synthesize final recommendation.
