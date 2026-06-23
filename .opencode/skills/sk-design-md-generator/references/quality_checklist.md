---
title: Design System Documentation Quality Checklist
description: Validation checklist for generated design system documents covering numerical accuracy, semantic correctness, completeness, and publication quality.
trigger_phrases:
  - quality checklist
  - numerical accuracy validation
  - semantic correctness check
  - description quality
  - accessibility contract checklist
  - publication quality gate
  - brand context requirements
  - state matrix validation
importance_tier: normal
contextType: general
---
# Design System Documentation Quality Checklist

Use this checklist to validate every generated design system document before delivery. Each item includes verification steps, common failure modes, and fixes.

---

## 1. OVERVIEW

Use this checklist to validate every generated design system document before delivery. The current output is the v3 **Style Reference** (`design_md_format.md`): a named, confident, restrained design-system handoff whose value-bearing sections (`## Tokens — Colors`, `## Tokens — Spacing & Shapes`, `## Surfaces`, `## Quick Start`) are pre-rendered deterministically by `backend/scripts/formatters-v3.ts` and pasted unchanged. The agent writes prose only. Many checks below therefore verify that the pre-rendered sections were not edited and that the prose is named, grounded, and honest. Each item includes verification steps, common failure modes, and fixes.

**Named, deterministic, and honest.** Colours are NAMED evocatively (Obsidian Ink, Voltage) with clean `--color-<slug>` tokens; components are NAMED by function (Primary CTA, Card, Badge), never "Variant-N" or "div". Because the value tables are pre-rendered, value-fidelity failures mean the block was edited after pasting — restore it. The Quick Start is checked by `checkQuickStartFidelity` (every hex traces to a token; `--page-max-width` matches `tokens.maxContentWidth`). Elevation is never omitted — when 0 shadows it is rendered FLAT and the prose states how depth is achieved (border contrast, whitespace), never "gradient-as-depth".

**Data-driven, not fabrication-driven.** Conditional sections (e.g. Imagery) are gated on token presence. When a section has no backing token data, stamp it ABSENT (`_No <X> data was extracted._`) — never invent content, a minimum count, comparative framing, or a named principle to fill it. "All sections present and non-empty" is a data-driven expectation, not a mandate to fabricate. Every interpretive claim must cite a token or be labelled `[INFERRED]`. `validate.ts` enforces this with prose-discipline and section-coverage checks (both WARNING-tier) and reports a dual score — `valuesScore` (hex/section/format fidelity) and `claimsScore` (prose provenance) — and `isPass` requires `score >= 80` AND `claimsScore >= 80`.

---

## 2. Numerical Accuracy

- [ ] **[NA-01]** All hex values originate from tokens.json or extracted data
  - Check: Cross-reference every hex in the document against the source token file or extraction output
  - Fail reason: LLM hallucinated a "close enough" hex value instead of copying verbatim
  - Fix: Search-replace with the exact hex from the source data; never round or adjust color values

- [ ] **[NA-02]** All px values come from extracted data, not estimated
  - Check: Grep all `px` values in the output and trace each back to a source measurement
  - Fail reason: LLM inferred a spacing value from visual context instead of reading the computed style
  - Fix: Replace with the exact value from the extraction output; flag any value without a source

- [ ] **[NA-03]** No invented or interpolated values appear anywhere
  - Check: Every numeric value (hex, px, rem, %, ms) must have a traceable source
  - Fail reason: LLM filled gaps in a scale by guessing intermediate values (e.g., inventing a 14px step between 12px and 16px)
  - Fix: Remove invented values; note gaps explicitly with "not observed in source" if the scale is incomplete

- [ ] **[NA-04]** Hex format is consistent: 6-digit lowercase
  - Check: Regex match all hex values against `#[0-9a-f]{6}` — no 3-digit shorthand, no uppercase
  - Fail reason: Mixed formats copied from different sources without normalization
  - Fix: Normalize all hex to 6-digit lowercase; expand 3-digit shorthand (e.g., `#fff` to `#ffffff`)

- [ ] **[NA-05]** Font-weight values are numeric only, never keyword
  - Check: Search for `font-weight` references; reject `bold`, `normal`, `light` — require `700`, `400`, `300`
  - Fail reason: LLM used CSS keyword instead of the numeric equivalent from the source
  - Fix: Replace keywords with numeric values: normal=400, bold=700, light=300, medium=500, semibold=600

- [ ] **[NA-06]** Spacing values match the documented token scale
  - Check: Every spacing value used in component docs or layout docs appears in the spacing scale table
  - Fail reason: A component doc references `20px` padding but the spacing scale only has `16px` and `24px`
  - Fix: Verify the value exists in the extraction; if it does, add it to the scale; if not, use the nearest documented value

- [ ] **[NA-07]** Shadow values are verbatim from extraction, not paraphrased
  - Check: Compare each `box-shadow` string character-by-character against source data
  - Fail reason: LLM reordered shadow parameters or rounded blur/spread values
  - Fix: Copy the exact shadow string from extraction output; preserve parameter order and precision

- [ ] **[NA-08]** Border-radius values come from extracted data
  - Check: Trace every radius value to a source measurement
  - Fail reason: LLM assigned a "standard" radius (e.g., 8px) when the actual value was 6px
  - Fix: Use the exact extracted radius; document the full radius scale from observed values

- [ ] **[NA-09]** Breakpoint values match extracted or configured data
  - Check: Compare breakpoint values against media queries found in source CSS or framework config
  - Fail reason: LLM used generic Bootstrap/Tailwind breakpoints instead of the site's actual breakpoints
  - Fix: Extract breakpoints from actual media queries in the source; never assume framework defaults

- [ ] **[NA-10]** Contrast ratios are correctly calculated
  - Check: Recalculate WCAG contrast ratios for documented color pairs using the WCAG 2.1 algorithm
  - Fail reason: LLM estimated contrast ratios or used an incorrect formula
  - Fix: Use a verified contrast calculation function; report ratios to one decimal place (e.g., 4.5:1)

---

## 3. Semantic Correctness

- [ ] **[SC-01]** Color roles match actual usage, not just hue similarity
  - Check: Verify that "primary" is assigned to the most prominent brand/action color, not just the first color listed
  - Fail reason: LLM assigned "primary" to a blue because blue is common, but the site uses orange for all CTAs
  - Fix: Assign roles based on usage frequency and context (buttons, links, headings) not hue stereotype

- [ ] **[SC-02]** Typography roles match typical HTML element usage
  - Check: Confirm that "heading-1" maps to the largest heading style actually used for `<h1>`, not just the largest font found
  - Fail reason: LLM assigned display/hero font size to "heading-1" when it is only used in the hero section
  - Fix: Map typography roles to their actual DOM usage; hero/display styles get their own role, not h1

- [ ] **[SC-03]** Components are NAMED by function, never "Variant-N"
  - Check: Every component heading is a functional name (Primary CTA, Secondary Button, Ghost Link, Nav Header, Card, Badge, Footer). No "Variant-1", "Color 2", or raw DOM tag ("div") survives into the doc
  - Fail reason: LLM carried the extractor's auto-indexed labels or DOM tags into the named Style Reference (AP-31)
  - Fix: Name each component by what it does and where it is used; map a variant that cannot be characterized into the nearest named component or describe it by its distinguishing property ("a lighter green status variant")

- [ ] **[SC-04]** Spacing "section" vs "component" distinction is accurate
  - Check: Section-level spacing (vertical rhythm between page sections) is separated from component-internal spacing
  - Fail reason: LLM mixed component padding values into the section spacing scale
  - Fix: Categorize spacing by scope: section (>= 32px typical), component (4-24px typical), inline (2-8px typical)

- [ ] **[SC-05]** Shadow type classification is correct
  - Check: Shadows labeled "elevation-1/2/3" actually correspond to increasing visual depth
  - Fail reason: LLM classified shadows by complexity of the CSS value rather than visual elevation
  - Fix: Order shadow scale by perceived elevation (smallest blur/offset = lowest level); verify visually

- [ ] **[SC-06]** Gradient location labels are correct
  - Check: Gradient descriptions ("hero background", "card overlay") match where gradients actually appear
  - Fail reason: LLM guessed gradient location from color values instead of tracing them to DOM elements
  - Fix: Document gradients with their actual DOM location and CSS property (background, border-image, etc.)

- [ ] **[SC-07]** Dark mode diffs reflect real changes, not assumed inversions
  - Check: Each dark mode token change is verified against actual dark mode CSS/variables
  - Fail reason: LLM assumed dark mode inverts light colors to dark equivalents without checking actual values
  - Fix: Extract dark mode values from actual `prefers-color-scheme: dark` or `.dark` class rules

- [ ] **[SC-08]** Framework detection matches reality
  - Check: Stated framework/library matches actual dependencies (package.json, imports, class naming conventions)
  - Fail reason: LLM guessed "Tailwind" from utility-like classes that were actually custom CSS
  - Fix: Verify framework from package.json, import statements, or distinctive class patterns (e.g., `chakra-`, `MuiButton`)

---

## 4. Completeness

- [ ] **[CP-01]** Sections present per the data-driven gate
  - Check: Core value sections (Color, Typography, Spacing, Components, Shadows/Depth, Layout) are present when their tokens exist. Conditional sections (§0, §6, §6.5, §7, §9, §11, §12) are present-and-filled when backing tokens exist, or ABSENT-stamped (`_No <X> data was extracted._`) when the backing field is empty. Dark Mode is omitted entirely when no dark palette was detected.
  - Fail reason: LLM either omitted a section with backing data, or invented content for a section with no backing data
  - Fix: Drive section presence from token presence. When data exists, write the section; when it is empty, stamp ABSENT rather than fabricating filler. Do not require a fixed section count.

- [ ] **[CP-02]** Every extracted color is documented
  - Check: Count distinct color entries; cross-check against the L1/L2 color tokens in tokens.json
  - Fail reason: LLM documented only primary/accent colors and skipped neutrals, borders, or backgrounds that ARE present in the tokens
  - Fix: Include every extracted L1/L2 color (neutrals, borders, surfaces, semantic colors). Do not pad to a minimum count with invented colors; if the system genuinely has few colors, document only those.

- [ ] **[CP-03]** Typography table covers every extracted level
  - Check: Compare table rows against the typography levels in tokens.json
  - Fail reason: LLM collapsed distinct extracted sizes into fewer rows
  - Fix: Document every distinct text style present in the tokens. Do not invent caption/overline/label styles to reach a row count if they were not extracted.

- [ ] **[CP-04]** At least 3 component types documented
  - Check: Count distinct component categories (Button, Input, Card, Navigation, etc.)
  - Fail reason: LLM only documented buttons because they had the richest extraction data
  - Fix: Document all identifiable components; even minimal entries (base style + one state) add value

- [ ] **[CP-05]** Captured interaction states are documented; uncaptured states are not invented
  - Check: Interaction capture runs by default, so hover/focus/active data is normally present in tokens.json — document the states that were captured for each interactive component
  - Fail reason: LLM documented only the default/resting state despite captured states, OR fabricated states that were not captured
  - Fix: Document hover/focus/active from the captured interaction tokens. If a state was not captured, note its absence rather than inferring a color shift or ring. Never assert focus consistency when `focusIndicator.captured` is false.

- [ ] **[CP-06]** Every extracted shadow is documented; flat systems say so
  - Check: Compare the depth/shadow section against the shadow tokens in tokens.json
  - Fail reason: LLM documented fewer shadows than were extracted, OR invented a multi-level scale for a system with zero or one shadow
  - Fix: Document each unique extracted shadow. When zero shadows were extracted, the §6 Depth section is rendered FLAT by construction (no box-shadow elevation) — do not fabricate an elevation scale, and never label a gradient as depth.

- [ ] **[CP-07]** Border-radius scale documented
  - Check: A radius scale or set of radius tokens is present
  - Fail reason: LLM mentioned radius in component docs but never consolidated a scale
  - Fix: Extract all unique radius values, order them, and present as a scale (none, sm, md, lg, full/pill)

- [ ] **[CP-08]** Breakpoints listed
  - Check: Responsive breakpoints section exists with specific pixel values
  - Fail reason: LLM assumed breakpoints were obvious and skipped them
  - Fix: Extract from media queries in source CSS; if none found, note "no custom breakpoints detected"

- [ ] **[CP-09]** Font-face information included
  - Check: Font family names, weights available, and source (Google Fonts, self-hosted, system) are documented
  - Fail reason: LLM listed font-family CSS values without researching the actual font source
  - Fix: Include font name, available weights, loading strategy, and source URL or hosting method

- [ ] **[CP-10]** Dark mode section present if dark mode detected
  - Check: If source has dark mode, a dedicated section documents the color/shadow/surface changes
  - Fail reason: LLM detected dark mode variables but did not create a separate section
  - Fix: Create a dark mode section showing changed tokens with light vs dark value comparison table

- [ ] **[CP-11]** Layout max-width documented
  - Check: Container max-width and content width constraints are specified
  - Fail reason: LLM focused on spacing and missed the overall layout container dimensions
  - Fix: Extract max-width from container/wrapper elements; document content width at each breakpoint if available

- [ ] **[CP-12]** Agent prompt guide examples are grounded in extracted tokens
  - Check: Each example prompt embeds real token values from tokens.json (hex, px, font names)
  - Fail reason: LLM wrote generic examples not tied to the extracted system, or padded to a count with invented scenarios
  - Fix: Write examples that exercise the system's actual extracted tokens (color usage, typography pairing, spacing, component creation, layout, responsive, dark mode where data exists). Cover the scenarios the tokens support rather than meeting a fixed example count.

---

## 5. Description Quality

- [ ] **[DQ-01]** No banned words used
  - Check: Search for: "sleek", "modern", "clean", "minimalist", "beautiful", "stunning", "elegant", "seamless", "intuitive", "cutting-edge", "state-of-the-art", "leverage", "utilize", "robust"
  - Fail reason: LLM defaulted to generic marketing language instead of specific design descriptions
  - Fix: Replace with concrete descriptors: "high-contrast" not "bold", "24px section gaps" not "generous spacing"

- [ ] **[DQ-02]** Opening sentence is differentiating
  - Check: Read the first sentence and ask "could this describe any other design system?" -- if yes, it fails
  - Fail reason: LLM wrote a generic opener like "A clean, modern design system for web applications"
  - Fix: Lead with what makes this system unique: specific color temperature, typography personality, density philosophy

- [ ] **[DQ-03]** Key characteristics include specific values
  - Check: Every characteristic mentioned includes at least one measurable value (hex, px, ratio, font name)
  - Fail reason: LLM described characteristics abstractly ("uses generous spacing") without numbers
  - Fix: Embed values inline: "generous vertical rhythm anchored at 48px section gaps and 24px component spacing"

- [ ] **[DQ-04]** Color descriptions stay grounded in token data
  - Check: Any description of a color's character cites a measurable property (hue, saturation, usage frequency) from the tokens; it is not a free-floating "personality" claim
  - Fail reason: LLM invented an emotional register or palette "character" with no token backing
  - Fix: Describe only what the tokens support (e.g., "low-saturation neutral used on 62% of surfaces"). Do not fabricate a personality narrative; an interpretive read must cite a token or be labelled `[INFERRED]`. A bare color table with no descriptive prose is acceptable when the data does not support more.

- [ ] **[DQ-05]** Numeric values are embedded in prose, not just tables
  - Check: The descriptive paragraphs contain inline values, not just "see table below"
  - Fail reason: LLM separated description from data, making the prose content-free
  - Fix: Weave key values into sentences: "Body text at 16px/1.6 in Inter provides high-density readability"

- [ ] **[DQ-06]** Do's include specific values
  - Check: Every "Do" recommendation contains at least one concrete value or token reference
  - Fail reason: LLM wrote vague do's like "Use consistent spacing"
  - Fix: Make specific: "Use 8px padding inside badges and 16px padding inside cards"

- [ ] **[DQ-07]** Don'ts are derived from token evidence, not a surprise quota
  - Check: Each don't traces to a specific extracted constraint (a token relationship, a usage pattern, a frequency)
  - Fail reason: LLM either listed generic don'ts that apply to any system, or invented "surprising" constraints with no token backing to hit a count
  - Fix: Write only the don'ts the extracted data supports, citing the token (e.g., "accent orange appears only on interactive elements — don't use it for static text"). There is no required number of surprising don'ts; an inference with no token backing is a fabrication.

- [ ] **[DQ-08]** Agent prompts are self-contained
  - Check: Each example prompt includes enough context that an AI agent could act on it without reading the rest of the document
  - Fail reason: LLM wrote prompts that reference "the primary color" without specifying the actual hex value
  - Fix: Embed key token values directly in prompts: "Create a button with background #2563eb, white text, 8px 16px padding, 6px radius"

- [ ] **[DQ-09]** No transition filler phrases
  - Check: Search for: "Let's dive into", "Moving on to", "Now let's look at", "As we can see", "It's worth noting"
  - Fail reason: LLM padded sections with conversational transitions
  - Fix: Remove all filler; start each section directly with its content

- [ ] **[DQ-10]** Component docs include state change descriptions
  - Check: Every interactive component describes what changes between states (not just lists the states)
  - Fail reason: LLM listed "hover, focus, active" without describing the visual transitions
  - Fix: Describe transitions: "Hover: background shifts from #2563eb to #1d4ed8, shadow adds 0 2px 4px rgba(0,0,0,0.1)"

- [ ] **[DQ-11]** Any typography rationale is backed by the measured scale
  - Check: If the doc characterizes the type scale (modular, linear, custom), the claim is verifiable from the extracted size ratios; it is not asserted as a named principle without evidence
  - Fail reason: LLM invented a scale rationale or named principle the tokens do not demonstrate
  - Fix: State only what the measured sizes show (e.g., "sizes step ~1.25x: 16/20/25/31px"). A bare size table is acceptable; do not fabricate a system-logic narrative or label an unobserved principle. Mark any genuine inference `[INFERRED]`.

- [ ] **[DQ-12]** Any depth/elevation description matches the extracted shadows
  - Check: If the doc describes an elevation model, each level maps to an actual extracted shadow token
  - Fail reason: LLM invented an elevation hierarchy, or labelled a gradient as depth, with no shadow tokens to back it
  - Fix: Describe only the elevation the shadow tokens support. When zero shadows were extracted, the system is FLAT — say so and do not fabricate levels. Never frame a gradient as a depth/elevation system.

---

## 6. Publication Quality

- [ ] **[PQ-01]** Specificity comes from token values, not invented differentiation
  - Check: The document reads as specific because it is full of this system's real extracted values (hexes, sizes, frequencies), not because comparative or personality framing was added
  - Fail reason: LLM produced generic boilerplate, OR padded with invented "unique personality" claims to pass a differentiation test
  - Fix: Achieve specificity by surfacing the real extracted values and usage data. Do not fabricate differentiation or comparative framing ("unlike most systems") — `validate.ts` flags that as interpretive fabrication.

- [ ] **[PQ-02]** Do/don'ts are token-derived, with no surprise quota
  - Check: Each guideline traces to an extracted constraint (a usage pattern, frequency, or token relationship)
  - Fail reason: All do/don'ts are generic best practices, OR invented to meet a "surprising guideline" count
  - Fix: Write only the do/don'ts the tokens support, citing the evidence. There is no minimum number of surprising guidelines; an unbacked claim is a fabrication.

- [ ] **[PQ-03]** Example prompts work standalone
  - Check: Copy each agent prompt into an AI tool without the rest of the document; it should produce a reasonable result
  - Fail reason: Prompts rely on context defined elsewhere in the document
  - Fix: Include all necessary token values, constraints, and context within each prompt

- [ ] **[PQ-04]** Terminology is consistent across sections
  - Check: The same concept uses the same term everywhere (e.g., don't switch between "accent", "secondary", and "highlight" for one color)
  - Fail reason: LLM used synonyms in different sections without realizing they referred to the same token
  - Fix: Define terminology in the first section where it appears; use that term consistently afterward

- [ ] **[PQ-05]** No redundancy between sections
  - Check: The same information is not repeated in multiple sections
  - Fail reason: Color values appear in both the Color section and the Component section without cross-referencing
  - Fix: State values once in their primary section; reference by token name or link in other sections

- [ ] **[PQ-06]** Table formatting is correct
  - Check: All markdown tables render properly — aligned columns, correct header separators, no broken rows
  - Fail reason: LLM misaligned table columns or omitted the header separator row
  - Fix: Validate table syntax: header row, separator row with dashes, data rows with matching column count

- [ ] **[PQ-07]** Markdown renders cleanly
  - Check: Render the markdown in a preview tool; verify headings, lists, tables, code blocks all display correctly
  - Fail reason: Unclosed code blocks, missing blank lines before lists, or nested list indentation errors
  - Fix: Run through a markdown linter; ensure blank lines before/after headings, lists, and code blocks

- [ ] **[PQ-08]** Overall document length is 250-400 lines
  - Check: Count total lines (including blank lines)
  - Fail reason: Document is either too sparse (<250 lines, missing detail) or too verbose (>400 lines, redundant content)
  - Fix: If under 250, add missing sections or detail; if over 400, consolidate redundant descriptions and tighten prose

---

## 7. Brand Context

- [ ] **[BC-01]** Company or product identity is stated in the opening
  - Check: The first paragraph names the company/product and positions the design system within its brand context
  - Fail reason: LLM treated the design system as a generic artifact without identifying who it belongs to
  - Fix: State the company name and one sentence about its market position or product category

- [ ] **[BC-02]** Target audience is stated or inferable
  - Check: The document indicates who the design system serves (developers, enterprise users, consumers, creative professionals)
  - Fail reason: LLM described visual properties without connecting them to the audience they are designed for
  - Fix: Add an audience signal in the atmosphere section or key characteristics: "designed for [audience], reflected in [specific choice]"

- [ ] **[BC-03]** Personality adjectives are grounded in evidence
  - Check: Every personality descriptor (e.g., "confident", "restrained", "warm") is followed by a specific value or technique that justifies it
  - Fail reason: LLM used personality words as decoration rather than derived observations
  - Fix: Each personality claim needs a proof: "restrained -- only 3 chromatic colors in the entire palette" not just "restrained design"

- [ ] **[BC-04]** Data sources are listed or referenced
  - Check: The document states where its data comes from (tokens.json, extracted CSS, Figma export, live site analysis)
  - Fail reason: LLM produced values without provenance, making accuracy unverifiable
  - Fix: Add a brief "Source" note at the top or bottom: "Extracted from [URL] on [date] using [tool]"

---

## 8. Content & Voice

- [ ] **[CV-01]** Tone is defined with specific adjectives
  - Check: A Content & Voice or Brand Voice section exists with 2-4 tone adjectives backed by evidence from UI text
  - Fail reason: LLM skipped content voice because it focused only on visual properties
  - Fix: Analyze extracted button labels, headings, error messages, and microcopy; derive tone adjectives from observed patterns

- [ ] **[CV-02]** Casing convention is documented
  - Check: Button text, heading, and label casing rules are explicitly stated (Title Case, sentence case, ALL CAPS)
  - Fail reason: LLM documented typography sizing but ignored casing conventions
  - Fix: Survey all extracted button and heading text; identify the dominant casing pattern and document it

- [ ] **[CV-03]** Button text patterns are documented
  - Check: Common button text patterns are listed with examples (e.g., "verb + noun: 'Create project', 'Send message'")
  - Fail reason: LLM documented button styling but not button content conventions
  - Fix: Extract 5+ button labels from the source; identify the pattern (verb-first, noun-first, single-word, etc.)

- [ ] **[CV-04]** Error message template exists
  - Check: At least one error message template is documented with structure guidance (e.g., "[What happened] + [What to do]")
  - Fail reason: LLM treated error states as visual-only (red border) without documenting error copy patterns
  - Fix: If extracted data contains error text, document the template; if not, note "Error message pattern not observed in source"

- [ ] **[CV-05]** Voice examples use real extracted text
  - Check: At least 3 voice examples are direct quotes from the extracted UI text, not invented
  - Fail reason: LLM fabricated example copy instead of using actual observed text
  - Fix: Pull real button labels, headings, and microcopy from the extraction output and quote them verbatim

- [ ] **[CV-06]** Emoji policy is stated
  - Check: The document explicitly states whether emoji are used in the UI, and if so, where and how
  - Fail reason: LLM did not examine text content for emoji presence/absence
  - Fix: Search extracted text for emoji characters; state "Emoji: none observed" or "Emoji: used in [context]"

---

## 9. Accessibility Contract

- [ ] **[AC-01]** WCAG conformance level is stated
  - Check: The document specifies a target WCAG level (AA or AAA) or notes the observed conformance level
  - Fail reason: LLM documented colors without connecting them to accessibility standards
  - Fix: State the target level; if unknown, default to "WCAG 2.1 AA minimum" and verify key color pairs meet it

- [ ] **[AC-02]** Contrast ratios are documented for primary text/background pairs
  - Check: At least the text-primary/background and text-secondary/background pairs have calculated contrast ratios
  - Fail reason: LLM listed hex values without computing whether they meet WCAG requirements
  - Fix: Calculate contrast ratios for all text/background pairs; flag any below 4.5:1 (AA normal text) or 3:1 (AA large text)

- [ ] **[AC-03]** Focus indicator reflects captured state honestly
  - Check: The a11y `focusIndicator` carries a `captured` boolean. When `captured` is true, document the ring color, width, offset, and the `consistent` flag. When `captured` is false, state that no focus indicator data was captured — do NOT assert the focus ring is consistent.
  - Fail reason: LLM asserted "focus indicators are consistent" on empty data (the extractor no longer fabricates `consistent:true`)
  - Fix: Gate the focus claim on `focusIndicator.captured`. `validate.ts` flags an unbacked "focus is consistent" claim as prose fabrication.

- [ ] **[AC-04]** Touch target minimums are stated
  - Check: Interactive element minimum sizes are documented (typically 44x44px for WCAG, 48x48px for mobile)
  - Fail reason: LLM documented button padding without computing whether the resulting target meets minimum size
  - Fix: Calculate minimum clickable area from padding + content; state the minimum and verify it meets 44x44px

- [ ] **[AC-05]** Reduced motion strategy reflects captured a11y data
  - Check: Per-page async a11y now populates reduced-motion support (alongside page language, skip-link, tab order, alt-text coverage). Document what was captured.
  - Fail reason: LLM documented animations without addressing motion sensitivity, OR invented a reduced-motion behavior the tokens do not show
  - Fix: Report the captured `reducedMotionSupport` data. If the tokens show no reduced-motion handling, note its absence rather than asserting one.

---

## 10. State Matrix

- [ ] **[SM-01]** Loading states are documented for data-dependent components
  - Check: Components that display dynamic data (cards, tables, lists) have loading/skeleton state documentation
  - Fail reason: LLM only documented the data-present "happy path" state
  - Fix: Add skeleton/shimmer specs: background color, animation, placeholder dimensions for each component

- [ ] **[SM-02]** Empty states are documented for collection components
  - Check: Components that can be empty (tables, lists, search results) have empty state documentation
  - Fail reason: LLM assumed all components always have content
  - Fix: Document empty state: illustration (if any), heading, body text, CTA, and layout

- [ ] **[SM-03]** Error states are documented for fallible components
  - Check: Components that can fail (forms, data loaders, API-driven content) have error state documentation
  - Fail reason: LLM documented the success state but not the failure state
  - Fix: Document error state: border color change, error text color, icon, inline message placement

---

## 11. Iconography

- [ ] **[IC-01]** Icon system is identified
  - Check: The document states which icon library is used (Lucide, Heroicons, Material Symbols, custom SVG, etc.)
  - Fail reason: LLM documented components with icon references ("with icon") but never identified the icon system
  - Fix: Detect icon library from class names, SVG structure, or import paths; state the library name and version

- [ ] **[IC-02]** Icon sizing scale is documented
  - Check: Icon sizes are listed as a scale (e.g., 16px, 20px, 24px) with usage context
  - Fail reason: LLM used icons in component docs at various sizes without consolidating a scale
  - Fix: Extract all observed icon sizes; present as a scale with context: "16px: inline with body text, 20px: buttons, 24px: navigation"

- [ ] **[IC-03]** Icon alignment rules are documented
  - Check: Icon alignment relative to text is specified (optical center, baseline, flex center)
  - Fail reason: LLM placed icons in component specs without stating alignment
  - Fix: Note the alignment method and any optical adjustment: "Icons vertically centered with `align-items: center`; 1px optical lift on 16px icons"

---

## 12. Frequency Data

- [ ] **[FQ-01]** Color usage frequencies are present
  - Check: The color palette includes frequency or prevalence data (percentage, rank, or tier like "dominant/common/rare")
  - Fail reason: LLM listed colors as equals without indicating which ones dominate the system
  - Fix: Add frequency tier to each color: "dominant (62% of text)", "rare (3% of elements, 100% interactive)"

- [ ] **[FQ-02]** Shadow usage frequencies are present
  - Check: The shadow/elevation table includes frequency data indicating which shadow level is most common
  - Fail reason: LLM presented shadows as an equal-weight scale without indicating which level appears most
  - Fix: Add occurrence count or frequency tier: "shadow-border: 47 occurrences, elevation-1: 12, elevation-2: 3"

- [ ] **[FQ-03]** Border-radius usage frequencies are present
  - Check: The radius scale includes frequency data showing the dominant radius value
  - Fail reason: LLM listed radius values without indicating which one is the system default
  - Fix: Add frequency: "6px (78% of rounded elements), 9999px (pill, 15%), 12px (cards, 7%)"

---

## 13. Validator Semantic Checks (validate.ts)

`validate.ts` recognizes the v3 **Style Reference** schema (detected by the `# … — Style Reference` header plus `## Tokens — Colors`) as well as the legacy v2 layout. These items mirror its WARNING-tier semantic checks, its v3 Quick-Start fidelity check, and the dual score and pass gate it reports. Each warning is a fabrication or coverage signal to resolve before delivery.

- [ ] **[VS-01]** Prose-discipline: no interpretive fabrication
  - Check: Scan for unbacked interpretive phrasing — comparison to other systems ("unlike most", "most systems", "the conventional approach"), "gradient-as-depth" / "replaces shadow elevation", and an "is consistent" focus claim when the data does not support it
  - Fail reason: AP-29 Interpretive Fabrication — an interpretive claim (relationship, cause, consistency, or named principle) with no token backing
  - Fix: Remove the claim, or cite the token it rests on, or label a genuine inference `[INFERRED]`. `validate.ts` `checkProseDiscipline` flags these as WARNING-tier.

- [ ] **[VS-02]** Section-coverage: no filled-but-empty high-risk section
  - Check: No section is written with content when its backing token field is empty
  - Fail reason: A conditional section (e.g., imagery, accessibility, iconography) was filled with invented content instead of being stamped ABSENT
  - Fix: Stamp the empty section `_No <X> data was extracted._`. `validate.ts` `checkSectionCoverage` flags "present but backing field empty" as WARNING-tier. (Elevation is the exception — it is never omitted; when 0 shadows it is rendered FLAT, see CP-06.)

- [ ] **[VS-03]** Dual score reviewed (valuesScore + claimsScore)
  - Check: Both scores from `validate.ts` are reviewed — `valuesScore` (hex/section/format/stability fidelity) AND `claimsScore` (prose provenance: interpretive claims cited or `[INFERRED]`)
  - Fail reason: A high `valuesScore` masked invented prose because `claimsScore` was ignored — a doc cannot hide fabricated claims behind hex fidelity
  - Fix: Resolve the prose-fabrication and section-coverage warnings that lower `claimsScore`, not just the value-level findings.

- [ ] **[VS-04]** Quick-Start fidelity (v3): every Quick Start value traces to a token
  - Check: `checkQuickStartFidelity` verifies every hex in the `## Quick Start` CSS `:root` and Tailwind `@theme` blocks traces back to a token (a phantom hex is a CRITICAL failure), and that `--page-max-width` matches `tokens.spacingSystem.maxContentWidth`
  - Fail reason: A Quick Start hex with no token row (phantom), or a `--page-max-width` that disagrees with the tokens (the "100rem where tokens say 100%" class)
  - Fix: Because the Quick Start is pre-rendered by `formatters-v3.ts`, a failure means it was edited after pasting — restore the pre-rendered block unchanged. Every `--color-*` slug must match a §3 row; every `--text-*`/`--spacing-*` must match §4/§5.

- [ ] **[VS-05]** Pass gate: `isPass` requires score >= 80 AND claimsScore >= 80
  - Check: `isPass` returns true only when `score >= 80` AND `claimsScore >= 80` AND there is no critical failure (e.g. a phantom hex)
  - Fail reason: A doc with a passing `valuesScore` but `claimsScore < 80` still FAILS — fabricated prose cannot be bought back with hex fidelity
  - Fix: Drive `claimsScore` to >= 80 by removing every unbacked interpretive claim and every filled-but-empty section before reporting completion.
