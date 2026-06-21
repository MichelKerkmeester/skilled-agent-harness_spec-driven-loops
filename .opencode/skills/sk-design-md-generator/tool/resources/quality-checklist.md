# Design System Documentation Quality Checklist

Use this checklist to validate every generated design system document before delivery. Each item includes verification steps, common failure modes, and fixes.

---

## 1. Numerical Accuracy

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

## 2. Semantic Correctness

- [ ] **[SC-01]** Color roles match actual usage, not just hue similarity
  - Check: Verify that "primary" is assigned to the most prominent brand/action color, not just the first color listed
  - Fail reason: LLM assigned "primary" to a blue because blue is common, but the site uses orange for all CTAs
  - Fix: Assign roles based on usage frequency and context (buttons, links, headings) not hue stereotype

- [ ] **[SC-02]** Typography roles match typical HTML element usage
  - Check: Confirm that "heading-1" maps to the largest heading style actually used for `<h1>`, not just the largest font found
  - Fail reason: LLM assigned display/hero font size to "heading-1" when it is only used in the hero section
  - Fix: Map typography roles to their actual DOM usage; hero/display styles get their own role, not h1

- [ ] **[SC-03]** Component variants are named correctly
  - Check: Variant names reflect actual visual/behavioral differences (e.g., "outline" vs "ghost" vs "solid")
  - Fail reason: LLM used generic variant names without verifying they match the component's actual states
  - Fix: Name variants based on observed visual properties (fill, border, shadow) and interaction patterns

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

## 3. Completeness

- [ ] **[CP-01]** All 9 core sections are present
  - Check: Verify document contains: Overview, Color, Typography, Spacing, Components, Shadows/Depth, Layout, Dark Mode (if applicable), Agent Prompt Guide
  - Fail reason: LLM omitted a section because the extraction data was sparse for that category
  - Fix: Include all sections; use "Limited data extracted" notes rather than omitting entire sections

- [ ] **[CP-02]** Minimum 8 colors documented
  - Check: Count distinct color entries in the color section
  - Fail reason: LLM documented only primary/accent colors and skipped neutrals, borders, or backgrounds
  - Fix: Include full neutral scale, semantic colors (success/error/warning/info), and all surface colors

- [ ] **[CP-03]** Typography table has 8+ rows
  - Check: Count rows in the typography scale table
  - Fail reason: LLM collapsed similar sizes or omitted caption/overline/label styles
  - Fix: Document every distinct text style observed: display, h1-h6, body, small, caption, label, overline, code

- [ ] **[CP-04]** At least 3 component types documented
  - Check: Count distinct component categories (Button, Input, Card, Navigation, etc.)
  - Fail reason: LLM only documented buttons because they had the richest extraction data
  - Fix: Document all identifiable components; even minimal entries (base style + one state) add value

- [ ] **[CP-05]** Hover/focus states documented for interactive components
  - Check: Every button, link, and input has at least hover and focus state descriptions
  - Fail reason: LLM documented only the default/resting state
  - Fix: Extract or infer hover (color shift, shadow change), focus (outline, ring), active (scale, darken) states

- [ ] **[CP-06]** Shadow scale has 3+ levels
  - Check: Count distinct shadow definitions in the depth/shadow section
  - Fail reason: LLM documented only one shadow value
  - Fix: Look for shadows across components (cards, modals, dropdowns, buttons); document each unique shadow

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

- [ ] **[CP-12]** Agent prompt guide has 5+ examples
  - Check: Count example prompts in the agent guide section
  - Fail reason: LLM wrote 2-3 generic examples instead of covering different design scenarios
  - Fix: Include examples for: color usage, typography pairing, spacing, component creation, layout, responsive, dark mode

---

## 4. Description Quality

- [ ] **[DQ-01]** No banned words used
  - Check: Search for: "sleek", "modern", "clean", "minimalist", "beautiful", "stunning", "elegant", "seamless", "intuitive", "cutting-edge", "state-of-the-art", "leverage", "utilize", "robust"
  - Fail reason: LLM defaulted to generic marketing language instead of specific design descriptions
  - Fix: Replace with concrete descriptors: "high-contrast" not "bold", "24px section gaps" not "generous spacing"

- [ ] **[DQ-02]** Opening sentence is differentiating
  - Check: Read the first sentence and ask "could this describe any other design system?" — if yes, it fails
  - Fail reason: LLM wrote a generic opener like "A clean, modern design system for web applications"
  - Fix: Lead with what makes this system unique: specific color temperature, typography personality, density philosophy

- [ ] **[DQ-03]** Key characteristics include specific values
  - Check: Every characteristic mentioned includes at least one measurable value (hex, px, ratio, font name)
  - Fail reason: LLM described characteristics abstractly ("uses generous spacing") without numbers
  - Fix: Embed values inline: "generous vertical rhythm anchored at 48px section gaps and 24px component spacing"

- [ ] **[DQ-04]** Color personality descriptions are present
  - Check: Each primary/accent color has a personality description beyond just the role name
  - Fail reason: LLM listed colors as a table without explaining the palette's character or relationships
  - Fix: Add 1-2 sentences per color group explaining warmth/coolness, saturation strategy, and emotional register

- [ ] **[DQ-05]** Numeric values are embedded in prose, not just tables
  - Check: The descriptive paragraphs contain inline values, not just "see table below"
  - Fail reason: LLM separated description from data, making the prose content-free
  - Fix: Weave key values into sentences: "Body text at 16px/1.6 in Inter provides high-density readability"

- [ ] **[DQ-06]** Do's include specific values
  - Check: Every "Do" recommendation contains at least one concrete value or token reference
  - Fail reason: LLM wrote vague do's like "Use consistent spacing"
  - Fix: Make specific: "Use 8px padding inside badges and 16px padding inside cards"

- [ ] **[DQ-07]** Don'ts are counter-intuitive or surprising
  - Check: At least 3 don'ts would surprise someone unfamiliar with this design system
  - Fail reason: LLM listed obvious don'ts ("Don't use random colors") that apply to any system
  - Fix: Derive don'ts from the system's specific constraints: "Don't pair the accent orange with the warning yellow — use accent only on interactive elements"

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

- [ ] **[DQ-11]** Typography principles are explained
  - Check: A rationale exists for the type scale — why these sizes, why this line-height strategy
  - Fail reason: LLM presented the type scale as raw data without explaining the system logic
  - Fix: Explain the scale relationship (modular, linear, custom), line-height strategy, and intended reading contexts

- [ ] **[DQ-12]** Depth/shadow philosophy is described
  - Check: The shadow section explains the elevation model — how shadow levels map to UI hierarchy
  - Fail reason: LLM listed shadow values without explaining when to use each level
  - Fix: Describe the elevation model: "Level 1 for cards at rest, Level 2 for hover/raised state, Level 3 for modals and popovers"

---

## 5. Publication Quality

- [ ] **[PQ-01]** Passes the "10 tech companies" differentiation test
  - Check: Give the document to someone unfamiliar; ask "could this be from any of 10 different companies?" — should be clearly one
  - Fail reason: LLM produced a generic template that reads like boilerplate
  - Fix: Audit every section for specificity; add the unique values, constraints, and personality of this particular system

- [ ] **[PQ-02]** At least 3 do/don'ts that would surprise a reader
  - Check: Count surprising or non-obvious guidelines that are specific to this design system
  - Fail reason: All do/don'ts are generic best practices applicable to any system
  - Fix: Derive system-specific constraints: unusual color pairings to avoid, specific spacing exceptions, component-specific rules

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

## 6. Brand Context

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

## 7. Content & Voice

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

## 8. Accessibility Contract

- [ ] **[AC-01]** WCAG conformance level is stated
  - Check: The document specifies a target WCAG level (AA or AAA) or notes the observed conformance level
  - Fail reason: LLM documented colors without connecting them to accessibility standards
  - Fix: State the target level; if unknown, default to "WCAG 2.1 AA minimum" and verify key color pairs meet it

- [ ] **[AC-02]** Contrast ratios are documented for primary text/background pairs
  - Check: At least the text-primary/background and text-secondary/background pairs have calculated contrast ratios
  - Fail reason: LLM listed hex values without computing whether they meet WCAG requirements
  - Fix: Calculate contrast ratios for all text/background pairs; flag any below 4.5:1 (AA normal text) or 3:1 (AA large text)

- [ ] **[AC-03]** Focus indicator specification exists
  - Check: A focus ring or focus indicator is documented with color, width, offset, and style
  - Fail reason: LLM documented interactive states but omitted keyboard focus indicators
  - Fix: Extract focus styles from `:focus-visible` or `:focus` pseudo-class; document the ring color, width, and offset

- [ ] **[AC-04]** Touch target minimums are stated
  - Check: Interactive element minimum sizes are documented (typically 44x44px for WCAG, 48x48px for mobile)
  - Fail reason: LLM documented button padding without computing whether the resulting target meets minimum size
  - Fix: Calculate minimum clickable area from padding + content; state the minimum and verify it meets 44x44px

- [ ] **[AC-05]** Reduced motion strategy is documented
  - Check: The document states how animations behave under `prefers-reduced-motion: reduce`
  - Fail reason: LLM documented animations and transitions without addressing motion sensitivity
  - Fix: Add a note for each transition/animation: "Respects `prefers-reduced-motion`: [disables / reduces duration / replaces with opacity fade]"

---

## 9. State Matrix

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

## 10. Iconography

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

## 11. Frequency Data

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
