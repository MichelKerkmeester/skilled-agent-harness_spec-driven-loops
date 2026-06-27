# Iteration 1: Corpus Inventory And Initial Coverage Hypothesis

## Focus

Iteration 1 read the external `make-interfaces-feel-better` corpus end to end and mapped its techniques against the current `sk-design` hub, mode registry, shared register, and a skim of the five mode packets. This pass is inventory-first: it identifies candidate improvements and obvious coverage levels without editing live `sk-design`.

## Actions Taken

1. Read the five external corpus files: `SKILL.md`, `surfaces.md`, `typography.md`, `animations.md`, and `performance.md`.
2. Read the `sk-design` hub and `mode-registry.json` to confirm ownership boundaries: hub routes only; each mode owns its workflow; shared references provide vocabulary.
3. Skimmed mode and shared references with targeted reads/searches for the corpus techniques: surfaces, typography, motion, performance, hit targets, audit tells, and extracted token coverage.

## Findings

### Technique Inventory

| Technique | Gist | Corpus Source |
|---|---|---|
| Concentric border radius | Nested rounded surfaces should follow `outerRadius = innerRadius + padding`, except widely separated layers. | `external/.../surfaces.md:5`, `external/.../surfaces.md:7`, `external/.../surfaces.md:13` |
| Optical over geometric alignment | Icons, play triangles, asymmetric SVGs, and text-plus-icon buttons need visual nudges rather than pure centering. | `external/.../surfaces.md:57`, `external/.../surfaces.md:63`, `external/.../surfaces.md:87`, `external/.../surfaces.md:103` |
| Shadow-as-border depth | For buttons/cards/containers needing depth, prefer transparent layered shadows over solid borders; keep layout dividers as borders. | `external/.../surfaces.md:117`, `external/.../surfaces.md:121`, `external/.../surfaces.md:123`, `external/.../surfaces.md:168` |
| Dark-mode shadow simplification | In dark mode, a simple low-opacity white ring often replaces layered depth shadows. | `external/.../surfaces.md:140`, `external/.../surfaces.md:147` |
| Image outline rule | Images get an inset 1px neutral outline; pure black/white alpha only, never tinted palette neutrals. | `external/.../surfaces.md:178`, `external/.../surfaces.md:182`, `external/.../surfaces.md:217` |
| Expanded hit areas | Small visible controls need 40-44px hit areas, extendable with pseudo-elements, with no overlap between adjacent targets. | `external/.../surfaces.md:221`, `external/.../surfaces.md:235`, `external/.../surfaces.md:254` |
| Text-wrap split | Use `text-wrap: balance` for short headings and `text-wrap: pretty` for short-to-medium body/UI text; leave long text alone. | `external/.../typography.md:7`, `external/.../typography.md:35`, `external/.../typography.md:57` |
| Root font smoothing | Apply macOS font smoothing once at the root, not per component. | `external/.../typography.md:65`, `external/.../typography.md:82`, `external/.../typography.md:99` |
| Tabular dynamic numbers | Dynamic counters, timers, prices, and numeric tables need tabular numerals to avoid layout shift and improve scan. | `external/.../typography.md:101`, `external/.../typography.md:117`, `external/.../typography.md:127` |
| Interruptible interaction animation | CSS transitions suit hover/toggle/open-close state changes because they retarget mid-animation; keyframes fit one-shot staged sequences. | `external/.../animations.md:5`, `external/.../animations.md:11`, `external/.../animations.md:40` |
| Split and stagger enters | Do not animate one large container; split semantic chunks and stagger, combining opacity, blur, and small translate. | `external/.../animations.md:42`, `external/.../animations.md:48`, `external/.../animations.md:51` |
| Softer exits | Exit motion should be shorter and softer than enter motion, often a fixed small translate rather than a full-height departure. | `external/.../animations.md:120`, `external/.../animations.md:179`, `external/.../animations.md:182` |
| Contextual icon swaps | State/hover icons should cross-fade with opacity, scale, and blur; use Motion when already present, CSS cross-fade otherwise. | `external/.../animations.md:185`, `external/.../animations.md:213`, `external/.../animations.md:255`, `external/.../animations.md:275` |
| Press scale with escape hatch | Buttons get tactile `scale(0.96)` press feedback, never below `0.95`, with a `static` prop when motion distracts. | `external/.../animations.md:281`, `external/.../animations.md:317` |
| Suppress default-state first render | Use `AnimatePresence initial={false}` for default-state icon swaps/toggles/tabs, but not for intentional page entrances. | `external/.../animations.md:344`, `external/.../animations.md:364`, `external/.../animations.md:366` |
| Transition and layer hygiene | Never use `transition: all`; name changed properties. Use `will-change` only surgically for compositor-friendly properties after observed stutter. | `external/.../performance.md:5`, `external/.../performance.md:41`, `external/.../performance.md:45`, `external/.../performance.md:86` |

### Initial Coverage Hypothesis

| Technique | Coverage In sk-design | Likely Home | Evidence |
|---|---|---|---|
| Concentric border radius | Net-new as a concrete formula. Current audit catches over-rounding and one-off radii, but not nested radius math. | `foundations` plus `audit` detector | Audit has over-rounded cards and ghost-card checks at `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md:46`, and token drift at `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:31`. |
| Optical alignment | Partially covered. The interface layout gate names 1-2px optical nudges; foundations says icons may need optical centering. The corpus adds specific icon-side padding and SVG-fix heuristics. | `interface` or `foundations/layout` | `.opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:106`; `.opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md:127`. |
| Shadow-as-border depth | Partially covered, mostly as anti-pattern and token fidelity. The corpus offers a constructive decision matrix and layer recipe. | `foundations` with `audit` rule | Ghost-card border-plus-shadow is a tell at `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md:38`; md-generator captures shadows/radii as measured tokens at `.opencode/skills/sk-design/design-md-generator/SKILL.md:23`. |
| Dark-mode shadow simplification | Partially covered. Foundations says dark mode should use lightness/contrast rather than shadows, but the corpus gives a practical white-ring fallback. | `foundations/color` | `.opencode/skills/sk-design/design-foundations/SKILL.md:269`. |
| Image outline rule | Net-new. I found no current image-outline craft rule or pure neutral outline requirement. | `foundations` or `interface` preflight, with audit check | Current relevant coverage is only general surface/tell language; no direct match in targeted search. |
| Expanded hit areas | Already covered for floor sizing, partially covered for pseudo-element technique and collision rule. | `audit` and `interface`; possible shared polish note | `.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:61`; `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md:42`; pseudo-elements can expand targets at `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:60`. |
| Text-wrap split | Partially/already covered. Foundations lists `balance` and `pretty`, but not the corpus's line-count and long-text constraints. | `foundations/type` | `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:70`, `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:71`, `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:72`. |
| Root font smoothing | Net-new. No direct root `antialiased`/font-smoothing guidance surfaced. | `foundations/type` and `md-generator` Quick Start if extracted/declared | Targeted search found no current coverage beyond general typography roles. |
| Tabular dynamic numbers | Already covered in foundations and data viz; corpus adds dynamic-layout-shift framing and caveat about numeral appearance. | `foundations/type`; audit can cite when numbers shift | `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:44`, `.opencode/skills/sk-design/design-foundations/references/type/typography_system.md:93`; data tables at `.opencode/skills/sk-design/design-foundations/references/data_viz.md:104`. |
| Interruptible interaction animation | Already covered strongly. | `motion` | `.opencode/skills/sk-design/design-motion/references/micro_interactions.md:48`, `.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:116`. |
| Split and stagger enters | Partially covered. Motion strategy allows staggered lists and a single focal moment, but the corpus gives a semantic split recipe and concrete delays. | `motion` | `.opencode/skills/sk-design/design-motion/references/motion_strategy.md:71`, `.opencode/skills/sk-design/design-motion/references/motion_strategy.md:76`. |
| Softer exits | Already/partially covered. sk-design has the 75-percent exit rule and AnimatePresence exit wiring; corpus adds fixed small translate guidance. | `motion` | `.opencode/skills/sk-design/design-motion/references/motion_strategy.md:55`; `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:29`. |
| Contextual icon swaps | Partially covered. sk-design has morphing-icon rules and bounce-zero spring guidance, but not the exact opacity/scale/blur cross-fade fallback. | `motion` | `.opencode/skills/sk-design/design-motion/references/micro_interactions.md:79`, `.opencode/skills/sk-design/design-motion/references/micro_interactions.md:52`. |
| Press scale with escape hatch | Already covered strongly for scale range and press requirement; `static` prop pattern is under-covered implementation detail. | `motion` | `.opencode/skills/sk-design/design-motion/references/micro_interactions.md:39`, `.opencode/skills/sk-design/design-motion/references/micro_interactions.md:46`, `.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:46`. |
| Suppress default-state first render | Already covered strongly in the AnimatePresence checklist. | `motion` | `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:46`, `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:50`, `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:51`. |
| Transition and layer hygiene | Already covered strongly. Corpus is a concise reinforcing source, not a net-new import. | `motion` and `audit` | `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:50`, `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:55`, `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:56`; `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md:74`. |

### Most Promising Techniques For Iteration 2 Deep Mapping

1. **Concentric border radius** - high-leverage, small edit. It converts a common polish feeling into a formula and fits `foundations` plus an `audit` check.
2. **Image outline rule** - net-new, very specific, and easy to add as a surfaces/image craft rule without broad taste drift.
3. **Shadow-as-border decision matrix** - useful, but needs careful reconciliation with sk-design's current ghost-card anti-pattern so it does not normalize border-plus-shadow slop.
4. **Contextual icon swap recipe** - under-covered exact recipe for hover/state icons; likely belongs in `motion` as a companion to morphing icons.
5. **Root font smoothing and text-wrap caveats** - typography micro-polish that is small but actionable; likely `foundations/type`, with font smoothing as net-new and text-wrap as a precision upgrade.

### Initial Ruled-Out Or Caution Areas

- Do not import the external skill's "Review Output Format" table as-is. sk-design modes already have their own output contracts and audit finding formats; adopting another global response format would conflict with the hub's mode-specific ownership. Source: `external/.../SKILL.md:100`; sk-design hub keeps per-mode behavior out of the hub at `.opencode/skills/sk-design/SKILL.md:83`.
- Do not hard-code every numeric corpus value globally. Values like `0.96`, `initial={false}`, and no `transition: all` are already appropriate in motion; surface numbers such as radius and shadow values need posture/token context before becoming defaults.
- Do not put per-mode logic in the hub. Any adoption must land in mode packets or shared vocabulary, because the hub explicitly stays routing-only. Source: `.opencode/skills/sk-design/SKILL.md:15`, `.opencode/skills/sk-design/SKILL.md:92`.

## Questions Answered

- **Q1 partially answered.** The corpus's distinctive contribution is not broad design philosophy; it is exact micro-craft: nested radius math, neutral image outlines, shadow-as-border recipes, root font smoothing, contextual icon transitions, transition hygiene, and hit-target mechanics.
- **Q2 initially answered at owner level.** Most adoptable items map to `foundations` (surface and typography rules), `motion` (icon swaps and animation specifics), or `audit` (detectors and finding language). The hub should not receive per-mode logic.
- **Q3 initially answered for obvious conflicts.** The external global review format and wholesale numeric defaults are likely not adoptable without bloat or conflict.

## Questions Remaining

- **Q2 needs precise anchors.** Iteration 2 should deep-read the relevant target files and name exact insert locations for each promising technique.
- **Q3 needs conflict analysis.** Especially shadow-as-border versus ghost-card anti-patterns, and image outline rules versus existing token/dark-mode guidance.
- **Q4 remains open.** No prioritized implementation backlog yet; this iteration only creates the inventory and first coverage map.

## Next Focus

Deep-map the five promising under-covered techniques to surgical targets:

1. `foundations/type` for root font smoothing and text-wrap caveats.
2. `foundations` and `audit` for concentric radius and surface depth rules.
3. `motion` for contextual icon swap recipe and any gaps in split/stagger/exit specifics.
4. `interface` preflight and `audit` detector paths for image outlines, hit-area collision, and optical alignment checks.
5. `md-generator` only where the extracted Style Reference should record measured radius/shadow/outline/touch-target evidence rather than author new taste.
