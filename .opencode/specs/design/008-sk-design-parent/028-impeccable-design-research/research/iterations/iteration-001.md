# Focus

Sweep the shared design laws in `external/impeccable-main/skill/SKILL.src.md`, especially color, typography, layout, motion, interaction, absolute bans, and the `<codex>` / `<gemini>` defect blocks. Crosswalk each concrete rule onto current `sk-design` targets and classify it as `NET-NEW`, `ALREADY-COVERED`, or `OUT-OF-SCOPE-INFRA`.

# Actions Taken

1. Loaded the `deep-research` quick reference and the `sk-design` hub to confirm this is a LEAF research iteration and that `sk-design` is a five-mode hub, not a place to add per-mode logic.
2. Read `external/impeccable-main/skill/SKILL.src.md` and extracted the concrete shared laws from lines 32-118: contrast, typography thresholds, layout recipes, motion rules, interaction clipping, new-project color laws, absolute bans, Codex/Gemini defect blocks, and category-reflex tests.
3. Opened current target files under `sk-design`: `design-foundations/SKILL.md`, `references/type/typography_system.md`, `references/color/oklch_workflow.md`, `references/color/palette_theming.md`, `references/layout/layout_responsive.md`, `design-motion/SKILL.md`, `references/motion_strategy.md`, `references/performance_reduced_motion.md`, `references/advanced_craft.md`, `design-audit/references/ai_fingerprint_tells.md`, `design-audit/references/anti_patterns_production.md`, `design-audit/references/accessibility_performance.md`, `shared/anti_slop_principles.md`, `shared/register.md`, and `design-interface/references/design-process/mechanical_defaults.md`.
4. Ran targeted searches across the same sk-design target set for the numeric and named rules: `6rem`, `-0.04em`, `65-75ch`, `text-wrap`, semantic `z-index`, `auto-fit`, anti-cream OKLCH bands, motion easing curves, dropdown clipping, absolute bans, and model-specific tells.
5. Checked the research state and strategy files. This is iteration 1, so no prior iteration narrative or delta existed to avoid.

# Findings

## Net-New Or More Specific Adoption Candidates

| ID | Classification | Impeccable source | Verified sk-design target | Finding | Minimal surgical edit |
| --- | --- | --- | --- | --- | --- |
| F001 | NET-NEW as authoring guidance; already covered as audit detector | `SKILL.src.md` lines 40, 43-45 | `design-foundations/references/type/typography_system.md` opened; it says avoid letter-spacing by reflex but has no `-0.04em` floor. `design-audit/references/ai_fingerprint_tells.md` already has the detector. | Display tracking floor is present in audit but missing from foundations authoring. | Add one sentence to `typography_system.md` pairing/scale guidance: display headings should not go tighter than `-0.04em`, with `-0.02em` to `-0.03em` the usual tight range. |
| F002 | NET-NEW refinement | `SKILL.src.md` line 38 | `design-foundations/references/type/typography_system.md` opened; pairing guidance separates display/body jobs but does not explicitly ban near-duplicate font pairings. | "Do not pair similar-but-not-identical typefaces" is a useful rule because it catches two geometric or two humanist sans faces that read as accidental. | Add to `typography_system.md` Section 4: pair on a contrast axis, or use one family with multiple weights. |
| F003 | NET-NEW recipe | `SKILL.src.md` line 53 | `design-foundations/references/layout/layout_responsive.md` opened; it covers flex-vs-grid, grid contracts, and container queries but not the `repeat(auto-fit, minmax(280px, 1fr))` pattern. | Responsive grids without breakpoints get a concrete safe default. | Add a short "simple responsive grid" example to `layout_responsive.md` Section 4, framed as a starting recipe, not a mandate. |
| F004 | NET-NEW threshold/system | `SKILL.src.md` line 54 | `shared/design_token_vocabulary.md` mentions `Layer`; `design-audit/references/anti_patterns_production.md` reports one-off z-index values; no opened target defines the semantic scale. | sk-design catches arbitrary z-index misuse but does not define the semantic layer order. | Add semantic layer token guidance to `shared/design_token_vocabulary.md` or `layout_responsive.md`: dropdown/popover, sticky, backdrop, modal, toast, tooltip; ban `999`/`9999` except as imported legacy evidence. |
| F005 | NET-NEW numeric anti-cream detector | `SKILL.src.md` line 79 | `shared/register.md`, `shared/anti_slop_principles.md`, and `design-audit/references/ai_fingerprint_tells.md` opened; they reject cream/sand backgrounds but do not carry the OKLCH band `L 0.84-0.97, C < 0.06, hue 40-100`. | The anti-cream rule is already conceptually covered, but impeccable contributes a checkable OKLCH band and broader token-name denylist. | Add the numeric band and extra token names (`flour`, `parchment`, `wheat`, `biscuit`) to `ai_fingerprint_tells.md` and optionally cross-link from `palette_theming.md`. |
| F006 | NET-NEW theme-selection ritual | `SKILL.src.md` line 81 | `shared/register.md` opened; it sets Brand/Product posture and color strategy. `palette_theming.md` opened; it covers dark mode as a separate surface system, but not a physical-scene sentence before choosing dark vs light. | A one-sentence physical context before light/dark choice would strengthen foundations without adding a new mode. | Add to `palette_theming.md` Section 2 or 6: before choosing light/dark, name who uses the surface, where, under what ambient light, and in what mood. |
| F007 | NET-NEW production interaction warning | `SKILL.src.md` line 68 | `design-motion/references/advanced_craft.md` opened; it covers origin-aware popovers and tooltips but not overflow-clipping escape hatches. `accessibility_performance.md` covers dialog focus but not clipping. | Dropdown/popover clipping inside `overflow: hidden/auto` containers is a concrete interaction defect missing from sk-design. | Add to `advanced_craft.md` or `anti_patterns_production.md`: use native `dialog`/popover, fixed positioning, or a portal when an overlay must escape a clipping/stacking context. |
| F008 | NET-NEW motion authoring refinement; already covered as audit risk | `SKILL.src.md` line 63 | `design-audit/references/ai_fingerprint_tells.md` opened; it escalates uniform section reveals if content ships blank. `design-motion/references/performance_reduced_motion.md` opened; it warns against default fade-and-rise but does not explicitly require visible default content. | Reveal animations should enhance already-visible content; content visibility must not depend on a class-triggered transition. | Add one rule to `performance_reduced_motion.md` Section 5 or `motion_strategy.md` staging: no reveal may gate content visibility. |
| F009 | NET-NEW anti-slop refinement | `SKILL.src.md` lines 115-118 | `shared/anti_slop_principles.md` opened; it has first-order category-default critique. `design-interface/references/design-process/design_principles.md` and `variation_diversity.md` were searched; they cover median defaults but not the explicit second-order "category plus anti-reference" trap. | The second-order reflex check is valuable: avoiding the obvious default can still land in the next saturated family. | Add a compact second-order check to `shared/anti_slop_principles.md`: after rejecting the category default, reject the predictable anti-default too. |

## Already Covered

| Impeccable slice | Verified coverage |
| --- | --- |
| WCAG contrast thresholds, placeholder/form contrast, and gray text on colored backgrounds | `design-audit/references/accessibility_performance.md` has body/large/UI thresholds; `design-interface/references/design-process/mechanical_defaults.md` covers buttons, forms, placeholders, and labels; `design-foundations/references/color/palette_theming.md` says colored backgrounds need foreground tokens, not default gray text. |
| OKLCH as default palette workflow and tinted neutrals `C 0.005-0.015` | `design-foundations/references/color/oklch_workflow.md`, `palette_theming.md`, and `assets/token_starter.md` already cover OKLCH mechanics and tinted-neutral chroma. |
| Color strategy commitment axis | `shared/register.md` already has Restrained, Committed, Full palette, and Drenched with Brand/Product defaults. |
| Body readable measure and text wrapping | `typography_system.md` already covers 45-75 characters, `text-wrap: balance`, `text-wrap: pretty`, line-count caveats, localization, and script-specific checks. Impeccable's 65-75ch cap is not worth narrowing product UI guidance globally. |
| Hero clamp max around `6rem` and text overflow | `design-interface/references/design-process/mechanical_defaults.md` and `assets/interface_preflight_card.md` already cover hero clamp ceilings, 2-3 line hero checks, and breakpoint overflow. |
| Spacing rhythm, card restraint, nested cards, flex-vs-grid | `layout_responsive.md` already covers rhythm, hierarchy, containment restraint, flex vs grid, card use, and nested-card avoidance. |
| Motion intent, timing, ease-out quart/quint/expo, no casual layout animation, motion materials, reduced motion | `design-motion/SKILL.md`, `motion_strategy.md`, and `performance_reduced_motion.md` already encode the motion budget, exact easing curves, layout-animation warnings, bounded materials, and reduced-motion alternatives. |
| Uniform fade-and-rise as AI tell | `ai_fingerprint_tells.md` already classifies uniform section fade-and-rise; motion authoring still needs the visible-default refinement above. |
| Gemini image-hover animation | `design-audit/references/ai_fingerprint_tells.md` already has the exact Gemini image-hover tell and severity. |
| Absolute bans: side-stripe borders, gradient text, decorative glassmorphism, hero metrics, identical card grids, repeated eyebrows, numbered section markers | `design-interface/assets/interface_preflight_card.md`, `mechanical_defaults.md`, `shared/anti_slop_principles.md`, and `anti_patterns_production.md` already cover these. |
| Codex ghost-card, over-rounding, sketchy SVG, stripe backgrounds | `design-audit/references/ai_fingerprint_tells.md` already has these exact Codex tells. |
| Codex meta-criticism copy | `design-interface/references/design-process/copy_and_mock_data.md` already bans ironic strawman/mock-poetic copy and says to make the specific claim instead. |

## Out Of Scope Or Ruled Out

- No new sk-design mode is justified. The shared laws split cleanly across foundations, motion, audit, interface, and shared register vocabulary.
- No parallel detector/scoring system should be proposed. The anti-pattern detector engine itself belongs to build/CLI infrastructure, while the rule semantics belong in audit/interface/foundations as refinements.
- The impeccable setup/router machinery, context scripts, palette script, command pinning, hooks, and provider trees are outside this iteration's allowed design-methodology scope.

# Questions Answered

- Q1 is partially answered for `SKILL.src.md`: most shared laws are already covered; nine concrete refinements are net-new or more specific.
- Q2 is partially answered with file-level homes for each net-new item. Most edits belong to `design-foundations` and `design-motion`, with one shared anti-slop refinement and one audit detector threshold.
- Q3 is partially answered for structural ideas in this slice: register-first, color-strategy commitment, and per-model defect catalogs already exist in sk-design; adopt refinements into those systems rather than adding new structures.

# Questions Remaining

- Q1 remains open for the 23 command references, `detect-antipatterns.mjs` semantics, and `docs/STYLE.md`.
- Q2 remains open for command-flow-derived edits and the prose denylist's correct home.
- Q3 remains open for the anti-pattern engine semantics and prose denylist, but this iteration strongly suggests "crosswalk into existing audit/interface gates" rather than new infrastructure.
- Q4 remains open until later iterations produce a prioritized backlog across every allowed corpus slice.

# Next Focus

Read the highest-leverage command references next, starting with `reference/audit.md`, `reference/critique.md`, `reference/polish.md`, and `reference/harden.md`. Crosswalk their flow semantics into `design-audit` first, then separate already-covered audit contract material from genuinely net-new hardening or scoring refinements.
