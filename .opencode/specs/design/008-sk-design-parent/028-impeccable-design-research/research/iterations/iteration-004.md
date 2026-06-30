# Focus

Read the brand/product/register and visual-craft command references named by iteration 3: `brand.md`, `product.md`, `colorize.md`, `typeset.md`, and `layout.md`. Crosswalk their design-methodology content against current `sk-design` shared register, foundations color/type/layout references, interface process gates, audit production checks, and motion strategy. Carry forward the iteration 3 blocker: detector catalog semantics cannot be extracted from the scoped `detect-antipatterns.mjs` facade alone.

# Actions Taken

1. Read the current strategy, state log, and iterations 1-3 to avoid repeating covered slices. Prior work covered shared laws, audit/critique/polish/harden, the detector facade, and STYLE prose.
2. Read scoped impeccable sources: `skill/reference/brand.md`, `product.md`, `colorize.md`, `typeset.md`, and `layout.md`.
3. Opened current `sk-design` targets before classifying candidates: `shared/register.md`, `design-foundations/references/type/typography_system.md`, `design-foundations/references/color/palette_theming.md`, `design-foundations/references/layout/layout_responsive.md`, `design-interface/references/design-process/design_principles.md`, `brief_to_dials.md`, `mechanical_defaults.md`, `ux_quality_reference.md`, `design-interface/assets/interface_preflight_card.md`, `design-interface/references/design-process/copy_and_mock_data.md`, `design-audit/references/anti_patterns_production.md`, `design-audit/references/critique_hardening.md`, `design-motion/references/motion_strategy.md`, and `shared/design_token_vocabulary.md`.
4. Ran targeted searches for register wording, font-selection/reflex defaults, imagery requirements, product fixed type scales, component states, skeleton/empty states, modal/affordance rules, semantic color vocabulary, density, and product/brand posture.

# Findings

## Net-New Or More Specific Adoption Candidates

| ID | Classification | Impeccable source | Verified sk-design target | Finding | Minimal surgical edit |
| --- | --- | --- | --- | --- | --- |
| I4-F001 | NET-NEW brand typography procedure | `skill/reference/brand.md` lines 19-32 and 34-42; `typeset.md` lines 164-179 | `design_principles.md` lines 48 and 64-68 already require deliberate, non-default typography; `typography_system.md` lines 60-67 covers pairing by job, but no font-selection ritual, no physical-object words, no catalog browsing, and no reflex-reject list. | Impeccable adds a usable procedure for greenfield Brand type: name three concrete voice words, list reflex fonts, browse real catalogs against the brand as a physical object, and reject saturated defaults unless identity-preservation wins. | Add a short Brand-only font-selection ritual to `design_principles.md` near the typography paragraph, with a pointer to `typography_system.md` for implementation. Keep the named font list as a dated watchlist, not a permanent ban. |
| I4-F002 | NET-NEW product type-scale split | `skill/reference/product.md` lines 13-16; `typeset.md` lines 7-10 and 223-233 | `shared/register.md` lines 55-58 sets Product density/motion/color/copy; `typography_system.md` lines 52-56 says dense UI prefers fewer sizes, but does not explicitly say Product UI should use fixed `rem` type scales while Brand/content headings may use fluid `clamp()`. | The fixed-vs-fluid type rule is sharper than current sk-design guidance and prevents landing-page typography mechanics from leaking into app shells, sidebars, data tables, and admin UI. | Add a register-aware note to `typography_system.md` Section 3: Product UI uses fixed `rem` ramps with optional breakpoint adjustments; Brand/content display may use bounded `clamp()`, while body stays stable. |
| I4-F003 | NET-NEW image-led brand requirement refinement | `skill/reference/brand.md` lines 73-84 and 90-99 | `copy_and_mock_data.md` lines 129-141 and `interface_preflight_card.md` lines 106-116 already require real/generated imagery before placeholders, good seeds, aspect ratios, no fake screenshots, and real alt text. `design_principles.md` lines 44-47 covers asset language, but does not say brief-implied image-led Brand surfaces must ship at least one decisive real/generated/stock visual or search for the subject's physical object. | sk-design already catches fake imagery, but impeccable adds the stronger Brand rule: for restaurants, hotels, fashion, travel, photography, product pages, and similar briefs, zero imagery is a design failure, not restraint. | Add one Brand-specific sentence to `design_principles.md` or `copy_and_mock_data.md`: when the subject is image-led, ship a decisive real/generated/stock visual and search for the physical object or scene, not the generic category. |
| I4-F004 | NET-NEW product standard-affordance warning | `skill/reference/product.md` lines 30-36 and 44-52 | `anti_patterns_production.md` lines 80-94 covers missing states, anatomy, variants, focus, loading, empty, error, success, selected, destructive states. `ux_quality_reference.md` lines 74-82 covers product flow floors. Current targets do not explicitly warn against reinventing standard controls for flavor or defaulting to modals before inline/progressive alternatives. | Component-state completeness is already covered; the missing value is the Product-specific affordance rule: familiar controls are a virtue, and modals are not the first design move. | Add to `ux_quality_reference.md` Compact Product Flow Floor or `anti_patterns_production.md`: Product surfaces should use standard controls unless a deviation improves the task; exhaust inline/progressive disclosure before a modal. |
| I4-F005 | NET-NEW but likely low-priority layer scale refinement | `skill/reference/product.md` lines 22-24 and `brand.md` line 71 connect state vocab and responsive grids; iteration 1 also found semantic layer token absence. | `shared/design_token_vocabulary.md` lines 81-88 has state token vocabulary and lines 69-77 names Layer, but no layer order. `anti_patterns_production.md` line 35 reports one-off z-index values. | This reinforces iteration 1's semantic layer candidate: sk-design names Layer but lacks a canonical order for sticky, popover, modal, toast, and tooltip. | Keep as carried-forward foundations/shared backlog from I1 rather than a new duplicate item. |

## Already Covered

| Impeccable slice | Verified sk-design coverage |
| --- | --- |
| Brand vs Product register as first decision | `shared/register.md` lines 16-29 and 32-60 already define Brand as design IS the product, Product as design SERVES it, and route six dials across density, motion, color, copy, anti-slop, and audit severity. |
| Color strategy axis and product/brand color dosage | `shared/register.md` lines 62-69 and `palette_theming.md` lines 35-47 already encode Restrained, Committed, Full palette, and Drenched, including Product restrained defaults and Brand permission to exceed the 10 percent accent rule. |
| Semantic colors and stable state meaning | `palette_theming.md` lines 60-73 and 110-127 already cover primary/accent, semantic, surface, border, text, action/selection/focus, color-never-alone, foreground tokens on colored backgrounds, and stable semantic meaning. |
| Tinted neutrals, OKLCH, default warm-cream avoidance, dark-mode surface scale, alpha-heavy palette smell | `palette_theming.md` lines 77-80, 83-106, and 110-117 already cover this. Impeccable's colorize details mostly repeat the current foundations slice. |
| 60-30-10 as visual weight, not pixel count | `palette_theming.md` lines 44-46 already covers this with the correct Product/Brand caveat. |
| Product component states and release-hardening state coverage | `anti_patterns_production.md` lines 80-94, `critique_hardening.md` lines 101-105, and `ux_quality_reference.md` lines 79-82 already cover missing empty/loading/error/success, default/hover/focus-visible/active/disabled/loading/empty/error/success/selected/destructive states, and holding fallback states to the primary-flow craft bar. |
| Product motion budget and no decorative motion | `shared/register.md` line 56 and `motion_strategy.md` lines 35-55 and 93-105 already encode short Product transitions, state/feedback motion, no scattered effects, and no high-frequency motion in dense admin surfaces. |
| Spacing scale, density modes, clamp spacing, flex-vs-grid, container queries, card restraint, nested cards, rhythm, optical adjustments, touch targets | `layout_responsive.md` lines 35-55, 58-100, 119-147, and 151-158 already cover these. |
| Mechanical hero, bento, eyebrow, CTA, layout-family repetition, mobile collapse, imagery, copy, and AI-tell gates | `mechanical_defaults.md` lines 41-115 and `interface_preflight_card.md` lines 36-159 already cover the checkable pass/fail version. |
| Copy register and image-seed discipline | `copy_and_mock_data.md` lines 108-141 and 145-161 already cover posture-matched copy register, descriptive image seeds, alt text, no fake screenshots, aspect ratio, and no sketchy SVG fallback. |

## Out Of Scope Or Ruled Out

| Impeccable slice | Classification | Reason |
| --- | --- | --- |
| Live-mode slider params (`color-amount`, `scale`, `density`, `structure`) from `colorize.md`, `typeset.md`, and `layout.md` | OUT-OF-SCOPE-INFRA | These are interactive variant-control mechanics for impeccable's live preview system. sk-design's register and dials are internal calibration, and `brief_to_dials.md` lines 129-134 explicitly says the dials are not surfaced as choosable knobs. |
| Unsplash URL-shape and command handoff details from `brand.md` lines 79 and `colorize.md` / `typeset.md` / `layout.md` final handoff lines | OUT-OF-SCOPE-INFRA | Asset verification and command chaining are build/workflow mechanics. The reusable design rule is "use real, verified imagery when the brief implies it," not adopting a specific provider URL shape or impeccable command runner handoff. |
| Permanent ban of every named typeface in `brand.md` line 32 | RULED OUT AS STATIC POLICY | The watchlist is useful as a dated saturation check, but a hard permanent ban would fight identity-preservation and existing brand systems. sk-design should adopt the procedure, not freeze the 2026 list as law. |

# Questions Answered

- Q1 is partially answered for five more command references. The brand/product/color/type/layout cluster is mostly already covered by the 024-027 register/foundations/interface adoptions, but four genuinely useful refinements remain: Brand font-selection ritual, Product fixed type scale, image-led Brand requirement, and Product standard-affordance/modal restraint.
- Q2 is partially answered with homes: Brand font-selection and image-led requirements belong in `design-interface` with a foundations pointer; Product fixed-vs-fluid type belongs in `design-foundations`; Product affordance/modal restraint belongs in the Product flow floor or production anti-pattern reference.
- Q3 is partially answered for structural ideas in this slice: keep register-as-first-class, but do not adopt live-mode sliders or choosable design knobs; they conflict with sk-design's internal Design Read model.
- Q4 gained backlog candidates but remains open until remaining command flows are read and candidates are prioritized across all modes.

# Questions Remaining

- Q1 remains open for `animate.md`, `delight.md`, `interaction-design.md`, `bolder.md`, `quieter.md`, `shape.md`, `distill.md`, `clarify.md`, `craft.md`, `extract.md`, `document.md`, `optimize.md`, `adapt.md`, `live.md`, `onboard.md`, `codex.md`, `hooks.md`, `init.md`, and `overdrive.md`.
- Q1 also remains open for actual anti-pattern catalog semantics because the scoped detector facade did not expose rule IDs or detector descriptions.
- Q4 remains open for prioritized adoption order and final no-new-mode verdict.

# Next Focus

Read the motion and interaction slices next: `animate.md`, `delight.md`, and `interaction-design.md`, then crosswalk them against `design-motion/references/motion_strategy.md`, `micro_interactions.md`, `advanced_craft.md`, `performance_reduced_motion.md`, and the interface Product/Brand register. The likely split is high overlap on timing/reduced-motion, with possible net-new interaction-craft specifics.
