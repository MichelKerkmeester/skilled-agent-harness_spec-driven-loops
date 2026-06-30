# Iteration 2: Visual/style standalone docs and the direction/foundations boundary

## Focus

Cluster the standalone visual/style skills to decide whether they form a single `sk-design-direction` child or split across foundations and motion.

## Findings

1. **The standalone style docs are highly opinionated, archetype-driven direction skills.**
   - `taste-skill.md` is an anti-slop frontend skill for landing pages, portfolios, and redesigns. It requires a one-line "Design Read" (page kind + audience + vibe + design system/aesthetic family) and three explicit dials: `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`. It maps briefs to official design systems when applicable. [SOURCE: file:external/taste-skill.md:1-120]
   - `soft-skill.md` targets "$150k+ agency-level" output with a "Variance Engine" that picks vibe + layout archetypes, bans common fonts/icons/shadows, and mandates haptic micro-aesthetics and motion choreography. [SOURCE: file:external/soft-skill.md:1-98]
   - `bolder.md` amplifies visual impact through typography, color, spatial drama, and motion, while warning that "bold ≠ more AI effects." [SOURCE: file:external/bolder.md:1-120]
   - `brutalist-skill.md` is a narrow industrial/terminal aesthetic skill with strict substrate palette and grid determinism. [SOURCE: file:external/brutalist-skill.md:1-92]
   - `minimalist-skill.md` enforces premium utilitarian minimalism: warm monochrome, spot pastels, bento grids, subtle motion. [SOURCE: file:external/minimalist-skill.md:1-85]
   - `delight.md` adds personality at specific moments (success, empty, loading, achievements) rather than everywhere. [SOURCE: file:external/delight.md:1-120]
   - `polish.md` is a final quality pass covering design-system alignment, spacing, typography, color/contrast, interaction states, and micro-interactions. [SOURCE: file:external/polish.md:1-120]
   - `colorize.md` introduces strategic color systems, OKLCH usage, semantic color, and dosage rules. [SOURCE: file:external/colorize.md:1-120]
   - `oklch-skill.md` is a technical color-space skill for conversion, palette generation, contrast, gamut, and Tailwind v4 theming. [SOURCE: file:external/oklch-skill.md:1-90]

2. **`output-skill.md` is not design-specific.** It is a generic full-output enforcement utility (bans `// ...`, placeholder patterns, truncation). It should not be a child of `sk-design`. [SOURCE: file:external/output-skill.md:1]

3. **Direction/foundations boundary emerges.**
   - *Direction* skills decide **what aesthetic lane to pursue** given a brief (taste, soft, bolder, brutalist, minimalist). They set the high-level vibe, dials, banned defaults, and archetype selection.
   - *Foundations* skills implement the **systematic tokens** that realize that direction: color system, typography scale, layout grid, spacing system (designer-skills `ui-design` cluster + oklch + colorize).
   - *Motion* skills (animate, micro-interactions, 12 principles, fixing-motion-performance) are a separate execution layer that direction skills reference but do not own.
   - `polish.md` sits at the *quality gate* layer and is best treated as a cross-cutting final pass rather than a standalone child.

4. **Candidate child refinement:**
   - `sk-design-direction` — taste/archetype selection, anti-default discipline, design-read, dials, real-system mapping; feeds from `taste-skill`, `soft-skill`, `bolder`, `brutalist-skill`, `minimalist-skill`, `delight`, and the brief-grounding parts of `sk-design-interface`.
   - `sk-design-foundations` — color, typography, spacing, layout/grid, tokens, OKLCH; feeds from designer-skills `ui-design` + `design-systems` + `colorize` + `oklch-skill` + `layout.md`.
   - `sk-design-motion` — animation principles, micro-interactions, motion performance; feeds from designer-skills `interaction-design` + standalone motion docs.
   - `sk-design-critique` — visual/UX critique and accessibility; feeds from `visual-critique`, `polish.md`, `fixing-accessibility`, `audit.md`, `critique.md`.
   - `sk-design-system` — live-site extraction and DESIGN.md fidelity; folds `sk-design-md-generator`.
   - `sk-design-presentation` — bento grids, slides, decks (optional, narrow).

## Sources Consulted

- `external/taste-skill.md` (first 120 lines)
- `external/soft-skill.md`
- `external/bolder.md`
- `external/brutalist-skill.md`
- `external/minimalist-skill.md`
- `external/delight.md` (first 120 lines)
- `external/polish.md` (first 120 lines)
- `external/colorize.md` (first 120 lines)
- `external/oklch-skill.md`
- `external/output-skill.md`

## Assessment

- **newInfoRatio**: 0.85
- **noveltyJustification**: The docs confirm a clear direction-vs-foundations split and identify one non-design doc to exclude.
- **status**: complete

## Reflection

- **What worked**: Reading the full frontmatter of each standalone style skill exposed their archetype-selection patterns.
- **What failed**: None.
- **Ruled out**: `output-skill.md` is not a `sk-design` child (generic output utility).

## Recommended Next Focus

Iteration 3: Read the motion/animation standalone docs and designer-skills motion/interaction skills to scope `sk-design-motion`.
