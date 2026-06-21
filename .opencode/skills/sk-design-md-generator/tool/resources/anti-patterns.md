# DESIGN.md Anti-Pattern Catalog

A catalog of common mistakes when generating DESIGN.md files from extracted design data. Each entry documents the mistake, why it degrades output quality, and how to avoid it.

---

### AP-01: Phantom Color
**Description**: Outputting a hex color value that does not exist in the extracted `tokens.json` or style data. Often caused by rounding, autocomplete, or confusing similarly-named values.
**Bad Example**:
```markdown
| Role    | Value   |
|---------|---------|
| Primary | #2563eb |
```
**Why It's Wrong**: The actual extracted token was `#2564eb`. A one-digit difference creates a color that was never present in the source design. Downstream consumers (code generators, theme builders) will produce output that diverges from the real product.
**Correct Approach**:
```markdown
| Role    | Value   |
|---------|---------|
| Primary | #2564eb |
```
Always copy hex values verbatim from the extracted data. Never round, correct, or "normalize" color values to well-known palette values.
**Detection**: Diff every hex value in the output against the source token file. Any value absent from the source is a phantom.

---

### AP-02: Generic Description
**Description**: Using vague, meaningless adjectives to describe the design system instead of concrete, measurable characteristics.
**Bad Example**:
```markdown
## Overview
The application uses a clean and modern design with a professional color palette
and elegant typography choices.
```
**Why It's Wrong**: "Clean", "modern", "professional", and "elegant" carry zero actionable information. They describe every design system ever created and distinguish nothing. A code generator cannot act on these words.
**Correct Approach**:
```markdown
## Overview
The application uses a high-contrast light theme with a single accent hue
(blue #2564eb) against neutral grays. Typography relies on Inter at five
weight stops (400-700) with a 1.25 type scale. Spacing follows an 8px base grid.
```
Replace every adjective with a specific value, ratio, or named convention.
**Detection**: Search the output for these banned terms: clean, modern, elegant, professional, sleek, beautiful, stunning, polished, sophisticated, minimalist (when used as a standalone descriptor without supporting metrics).

---

### AP-03: Semantic Misattribution
**Description**: Labeling a color as "primary" based on its hue (e.g., blue = primary) rather than its actual usage frequency and role in the interface.
**Bad Example**:
```markdown
- Primary: #2564eb (blue)
- Secondary: #6b7280 (gray)
```
**Why It's Wrong**: If `#6b7280` appears on 80% of text and UI surfaces while `#2564eb` appears only on 3 buttons, then gray is functionally the dominant color. Calling the rarely-used blue "primary" misleads theme generation and creates incorrect weight in the output system.
**Correct Approach**:
```markdown
- Text/UI Base: #6b7280 (gray) — used across body text, labels, borders; highest frequency
- Action Accent: #2564eb (blue) — used on CTAs and active states; low frequency, high salience
```
Assign semantic roles based on measured frequency and functional role, not on hue conventions.
**Detection**: Cross-reference the semantic label with frequency data. If a color labeled "primary" ranks below 3rd in usage frequency, flag it.

---

### AP-04: Missing Interaction States
**Description**: Documenting only the default/rest state of interactive elements and omitting hover, focus, active, and disabled states.
**Bad Example**:
```markdown
## Buttons
- Background: #2564eb
- Text: #ffffff
- Border radius: 6px
- Padding: 8px 16px
```
**Why It's Wrong**: A button specification without interaction states is incomplete. Any implementation built from this spec will either invent states (introducing inconsistency) or ship without them (failing accessibility and UX).
**Correct Approach**:
```markdown
## Buttons
| State    | Background | Text    | Border          | Shadow            |
|----------|------------|---------|-----------------|-------------------|
| Default  | #2564eb    | #ffffff | none            | 0 1px 2px rgba(0,0,0,0.05) |
| Hover    | #1d4ed8    | #ffffff | none            | 0 2px 4px rgba(0,0,0,0.1)  |
| Focus    | #2564eb    | #ffffff | 2px solid #93c5fd | 0 0 0 3px rgba(37,100,235,0.3) |
| Active   | #1e40af    | #ffffff | none            | inset 0 1px 2px rgba(0,0,0,0.1) |
| Disabled | #93c5fd    | #ffffff | none            | none              |

- Border radius: 6px
- Padding: 8px 16px
```
Document every state present in the extracted data. If the source data lacks states, note the gap explicitly rather than omitting silently.
**Detection**: For every interactive component (button, link, input, toggle, checkbox), verify that at least hover and focus states are documented.

---

### AP-05: Over-inference
**Description**: Extrapolating a design principle or pattern from a single occurrence or low-frequency observation.
**Bad Example**:
```markdown
## Design Principles
- All cards use a left blue accent border to indicate importance hierarchy.
```
**Why It's Wrong**: If only 1 out of 14 cards in the extracted data has a left blue border, this is not a system-wide principle. It may be a one-off treatment for a specific context. Elevating it to a principle causes over-application in generated output.
**Correct Approach**:
```markdown
## Card Variants
- **Standard card**: White background, 1px #e5e7eb border, 8px radius
- **Highlighted card** (1 occurrence): Adds left 3px #2564eb border accent
```
State the frequency. Distinguish one-off treatments from system patterns. A pattern requires at minimum 3 consistent occurrences to be stated as a convention.
**Detection**: Every stated "principle" or "always" claim should have a frequency annotation. If the backing data shows fewer than 3 instances, demote from principle to variant note.

---

### AP-06: Format Inconsistency
**Description**: Mixing incompatible formats for the same type of value within the document.
**Bad Example**:
```markdown
- Background: #FFF
- Text: #1a1a2e
- Border: rgb(229, 231, 235)
- Accent: #2564EB
- Font weight: bold
- Heading weight: 700
```
**Why It's Wrong**: Inconsistent casing (`#FFF` vs `#2564EB`), mixed notation (`hex` vs `rgb`), and mixed weight formats (`bold` vs `700`) make the document unreliable for programmatic consumption. Parsers and theme generators will choke or produce inconsistent results.
**Correct Approach**:
```markdown
- Background: #ffffff
- Text: #1a1a2e
- Border: #e5e7eb
- Accent: #2564eb
- Font weight: 700
- Heading weight: 700
```
Pick one format per value type and enforce it: lowercase 6-digit hex for colors, numeric values for font weights, px for absolute sizes, rem for relative sizes.
**Detection**: Regex scan for mixed hex formats (`#[A-F]` mixed with `#[a-f]`, or 3-digit mixed with 6-digit), mixed color notations, or `bold`/`normal` mixed with numeric weights.

---

### AP-07: Typography Table Gaps
**Description**: Documenting heading and body text levels but omitting monospace/code font, caption, overline, or other specialized type levels present in the data.
**Bad Example**:
```markdown
## Typography Scale
| Level | Size | Weight | Font       |
|-------|------|--------|------------|
| H1    | 36px | 700    | Inter      |
| H2    | 30px | 700    | Inter      |
| H3    | 24px | 600    | Inter      |
| Body  | 16px | 400    | Inter      |
| Small | 14px | 400    | Inter      |
```
**Why It's Wrong**: If the extracted data includes a monospace font (e.g., `JetBrains Mono` at 14px/400 used in code blocks), omitting it leaves a gap that implementers will fill with arbitrary choices.
**Correct Approach**:
```markdown
## Typography Scale
| Level    | Size | Weight | Font            | Line Height |
|----------|------|--------|-----------------|-------------|
| H1       | 36px | 700    | Inter           | 1.2         |
| H2       | 30px | 700    | Inter           | 1.25        |
| H3       | 24px | 600    | Inter           | 1.3         |
| Body     | 16px | 400    | Inter           | 1.5         |
| Small    | 14px | 400    | Inter           | 1.4         |
| Caption  | 12px | 400    | Inter           | 1.4         |
| Code     | 14px | 400    | JetBrains Mono  | 1.6         |
```
Include every distinct type treatment found in the data, including code, caption, overline, and label levels.
**Detection**: Search extracted data for font-family values not represented in the typography table. Check for monospace fonts specifically.

---

### AP-08: Meaningless Don'ts
**Description**: Stating prohibitions that are too vague to be actionable by a human or machine.
**Bad Example**:
```markdown
## Don'ts
- Don't use too many colors
- Don't make text too small
- Don't overcrowd the layout
```
**Why It's Wrong**: "Too many" is undefined. "Too small" is undefined. "Overcrowd" is undefined. No system or person can evaluate compliance with these rules. They occupy space without constraining anything.
**Correct Approach**:
```markdown
## Constraints
- Limit each view to the palette colors listed in Section 2 (max 6 distinct hues per screen)
- No text below 12px / 0.75rem
- Maintain minimum 16px gap between adjacent interactive elements (touch target spacing)
```
Every constraint must include a threshold, value, or enumerable condition.
**Detection**: Flag any "Don't" entry that lacks a numeric value, specific color, named element, or testable condition.

---

### AP-09: Non-Self-Contained Prompts
**Description**: Writing an agent prompt section that references tokens by semantic name without including the actual values, requiring the agent to look elsewhere in the document.
**Bad Example**:
```markdown
## Agent Prompt
When generating UI, use the primary color for call-to-action buttons and the
secondary color for less prominent actions. Apply the standard border radius
to all interactive elements.
```
**Why It's Wrong**: An LLM consuming this prompt in isolation (e.g., as a system message) has no idea what "the primary color" resolves to. It will hallucinate a value. The prompt must be self-contained.
**Correct Approach**:
```markdown
## Agent Prompt
When generating UI, apply these exact values:
- CTA buttons: background #2564eb, text #ffffff, border-radius 6px
- Secondary buttons: background #ffffff, text #374151, border 1px solid #d1d5db, border-radius 6px
- All interactive elements: border-radius 6px
- Focus ring: 0 0 0 3px rgba(37,100,235,0.3)
```
Inline every referenced value directly in the prompt. The prompt must function correctly even if extracted from the document and used standalone.
**Detection**: Search the agent prompt section for semantic color names (primary, secondary, accent, etc.) or relative references (the standard, the default) without an accompanying literal value on the same line.

---

### AP-10: Shadow-Border Confusion
**Description**: Classifying a zero-blur box-shadow used as a border substitute as an "elevation shadow," conflating two distinct visual techniques.
**Bad Example**:
```markdown
## Elevation
| Level | Shadow                        |
|-------|-------------------------------|
| Low   | 0 0 0 1px rgba(0,0,0,0.1)    |
| Medium| 0 4px 6px rgba(0,0,0,0.1)    |
| High  | 0 10px 15px rgba(0,0,0,0.1)  |
```
**Why It's Wrong**: `0 0 0 1px` has no offset and no blur; it renders as a 1px solid border. Grouping it with elevation shadows misrepresents its visual function and causes agents to apply border-like effects when elevation is requested.
**Correct Approach**:
```markdown
## Borders
- Hairline border (box-shadow): 0 0 0 1px rgba(0,0,0,0.1)
- Standard border (CSS): 1px solid #e5e7eb

## Elevation
| Level  | Shadow                            |
|--------|-----------------------------------|
| Low    | 0 1px 3px rgba(0,0,0,0.1)        |
| Medium | 0 4px 6px rgba(0,0,0,0.1)        |
| High   | 0 10px 15px rgba(0,0,0,0.1)      |
```
Separate zero-blur box-shadows into a border section. Only shadows with non-zero blur or offset belong in elevation.
**Detection**: In the elevation/shadow table, flag any entry where both X-offset, Y-offset, and blur are zero (pattern: `0 0 0 Npx`).

---

### AP-11: Dark Mode Omission
**Description**: Failing to document dark mode color mappings when the extracted data clearly contains them.
**Bad Example**:
```markdown
## Color Palette
| Role       | Value   |
|------------|---------|
| Background | #ffffff |
| Text       | #1a1a2e |
| Surface    | #f9fafb |
```
*(No mention of dark mode despite tokens.json containing `dark.background: #0f172a`, etc.)*
**Why It's Wrong**: Ignoring dark mode data produces a DESIGN.md that only works for light theme. Agents generating dark-mode UI will invent colors rather than using the documented values.
**Correct Approach**:
```markdown
## Color Palette
| Role       | Light   | Dark    |
|------------|---------|---------|
| Background | #ffffff | #0f172a |
| Text       | #1a1a2e | #f1f5f9 |
| Surface    | #f9fafb | #1e293b |
| Border     | #e5e7eb | #334155 |
```
If the source data contains dark/light variants, always present both in a single table.
**Detection**: Search the source data for keys containing "dark", "night", or theme-variant identifiers. If present but not reflected in the output, flag the omission.

---

### AP-12: Vague Color Names
**Description**: Using generic indexed names like "Blue 1" or "Gray Light" that carry no functional meaning and create ambiguity.
**Bad Example**:
```markdown
## Colors
- Blue 1: #2564eb
- Blue 2: #1d4ed8
- Blue 3: #93c5fd
- Gray Light: #f9fafb
- Gray Dark: #374151
```
**Why It's Wrong**: "Blue 1" and "Blue 2" give no indication of when to use which. An implementer or agent must guess. Sequential numbering provides ordering but not purpose.
**Correct Approach**:
```markdown
## Colors
- Action Default: #2564eb — button backgrounds, link text
- Action Hover: #1d4ed8 — interactive hover states
- Action Subtle: #93c5fd — focus rings, light highlights
- Surface: #f9fafb — card and panel backgrounds
- Text Secondary: #374151 — supporting body text, labels
```
Each name should encode its function (where/when it is used), not just its hue and relative lightness.
**Detection**: Flag color names that are purely `{Hue} {Number}` or `{Hue} {Relative}` without a functional descriptor.

---

### AP-13: Key Characteristics Without Values
**Description**: Stating a design characteristic as a qualitative observation without the specific values that define it.
**Bad Example**:
```markdown
## Key Characteristics
- Tight spacing throughout the interface
- Large, bold headings
- Subtle borders between sections
```
**Why It's Wrong**: "Tight" could mean 4px or 12px. "Large" could mean 24px or 48px. "Subtle" could mean 0.5px solid #eee or 1px solid rgba(0,0,0,0.05). Without values, these statements are useless for implementation.
**Correct Approach**:
```markdown
## Key Characteristics
- Spacing: 8px component gaps, 16px section gaps, 4px inline element spacing
- Headings: H1 at 36px/700, H2 at 30px/700, H3 at 24px/600
- Section dividers: 1px solid #e5e7eb (light mode), 1px solid #334155 (dark mode)
```
Every characteristic must include the measured value from the extracted data.
**Detection**: Flag any bullet point in a characteristics or principles section that lacks at least one numeric value (px, rem, hex, percentage, ratio).

---

### AP-14: Cross-Section Terminology Drift
**Description**: Referring to the same design token by different names in different sections of the document.
**Bad Example**:
```markdown
## Section 2: Color Palette
- Primary Blue: #2564eb

## Section 5: Buttons
- Background uses the Brand Blue (#2564eb)

## Section 9: Agent Prompt
Apply the Main Blue for interactive elements.
```
**Why It's Wrong**: "Primary Blue", "Brand Blue", and "Main Blue" all reference `#2564eb`, but an agent or reader cannot be sure they are the same without checking hex values. Inconsistent naming erodes trust in the document and causes duplication in generated code.
**Correct Approach**:
```markdown
## Section 2: Color Palette
- Action Default: #2564eb

## Section 5: Buttons
- Background: Action Default (#2564eb)

## Section 9: Agent Prompt
Interactive element background: #2564eb (Action Default)
```
Choose one canonical name per token and use it consistently across every section. Always parenthetically include the hex value on first use in each section.
**Detection**: Extract all semantic color names and their hex values. Group by hex value. If any hex value maps to more than one name, flag the drift.

---

### AP-15: Do's Without Specifics
**Description**: Listing "Do" guidelines that restate a principle without specifying the exact values to apply.
**Bad Example**:
```markdown
## Do's
- Use consistent spacing between elements
- Maintain visual hierarchy with font sizes
- Apply the brand colors consistently
```
**Why It's Wrong**: Every design system aims for "consistent spacing." This tells the reader nothing about which spacing values constitute consistency in this specific system. It is a tautology.
**Correct Approach**:
```markdown
## Do's
- Use the 8px spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Set heading hierarchy: H1 36px > H2 30px > H3 24px > Body 16px > Small 14px
- Limit accent color (#2564eb) to interactive elements and active indicators
```
Every "Do" must reference specific values, tokens, or enumerable conditions from the design data.
**Detection**: Flag any "Do" entry that contains words like "consistent", "appropriate", "proper", or "correct" without accompanying numeric values or token references.

---

### AP-16: Redundant Information
**Description**: Restating information from a table in prose immediately below it, adding no new context.
**Bad Example**:
```markdown
## Spacing Scale
| Token | Value |
|-------|-------|
| xs    | 4px   |
| sm    | 8px   |
| md    | 16px  |
| lg    | 24px  |
| xl    | 32px  |

The spacing scale uses 5 levels. The smallest is 4px (xs), followed by 8px (sm),
then 16px (md), 24px (lg), and the largest at 32px (xl).
```
**Why It's Wrong**: The prose adds zero information beyond what the table already states. It wastes tokens, increases document length, and creates a maintenance burden where two representations must be kept in sync.
**Correct Approach**:
```markdown
## Spacing Scale
| Token | Value |
|-------|-------|
| xs    | 4px   |
| sm    | 8px   |
| md    | 16px  |
| lg    | 24px  |
| xl    | 32px  |

Base unit: 4px. The scale doubles at each major step (4 → 8 → 16 → 32) with 24px as an intermediate for component-level gaps.
```
Prose following a table should add context, rationale, or relationships not visible in the table itself.
**Detection**: Compare prose sentences to table content. If more than 80% of the prose is a direct restatement of table values, flag it as redundant.

---

### AP-17: Wrong Component Classification
**Description**: Misclassifying a UI element, most commonly calling a styled anchor/link a "button variant" or a chip/tag a "badge."
**Bad Example**:
```markdown
## Button Variants
- Primary Button: #2564eb background, white text
- Secondary Button: transparent background, #2564eb text, #2564eb border
- Text Button: no background, #2564eb text, underline on hover
```
**Why It's Wrong**: A "Text Button" with underline on hover is semantically and functionally a link (`<a>`), not a button (`<button>`). Misclassifying it causes agents to generate `<button>` elements where `<a>` is correct, harming accessibility and SEO.
**Correct Approach**:
```markdown
## Buttons
- Primary: #2564eb background, white text, border-radius 6px
- Secondary: transparent background, #2564eb text, 1px #2564eb border, border-radius 6px

## Links
- Inline Link: #2564eb text, underline on hover, no background
- Standalone Link: #2564eb text, no underline at rest, underline on hover
```
Classify elements by their semantic role (navigates vs. performs action) and HTML element, not by visual similarity.
**Detection**: Check for "button" entries that mention underline behavior or entries that describe navigation as their function.

---

### AP-18: Gradient Over-Simplification
**Description**: Describing a complex multi-stop or angled gradient with a vague label like "blue gradient" instead of the full gradient definition.
**Bad Example**:
```markdown
## Hero Section
- Background: blue gradient
```
**Why It's Wrong**: "Blue gradient" could mean any of thousands of combinations. The extracted data specifies `linear-gradient(135deg, #2564eb 0%, #7c3aed 50%, #ec4899 100%)` -- a three-stop, three-hue gradient at a specific angle. The oversimplification loses all of this.
**Correct Approach**:
```markdown
## Hero Section
- Background: linear-gradient(135deg, #2564eb 0%, #7c3aed 50%, #ec4899 100%)
- Fallback solid: #2564eb
```
Always include the full gradient definition: type, angle/direction, each color stop with position.
**Detection**: Search for the word "gradient" in the output. If it appears without an accompanying `linear-gradient(...)` or `radial-gradient(...)` value, flag it.

---

### AP-19: Layout Without Numbers
**Description**: Describing layout structure with qualitative terms instead of concrete grid specifications.
**Bad Example**:
```markdown
## Layout
- Responsive grid layout
- Content is centered with appropriate max width
- Cards arranged in a flexible grid
```
**Why It's Wrong**: "Responsive grid" could mean 1-12 columns with any breakpoint set. "Appropriate max width" could be 960px or 1440px. No implementer or code generator can reproduce the layout from this description.
**Correct Approach**:
```markdown
## Layout
- Max content width: 1280px, centered with auto margins
- Grid: 12 columns, 24px gutter
- Breakpoints:
  - ≥1024px: 12 columns
  - ≥768px: 8 columns
  - <768px: 4 columns
- Card grid: auto-fill, min 280px per card, 24px gap
- Section padding: 64px vertical, 24px horizontal (mobile: 32px vertical, 16px horizontal)
```
Provide column counts, gutter widths, breakpoints, max-widths, and specific gap values.
**Detection**: Flag any layout section that lacks at least: a max-width value, column count, and one breakpoint definition.

---

### AP-20: Ignoring Framework Context
**Description**: Failing to mention the detected CSS framework (Tailwind, Bootstrap, Material UI, etc.) or misrepresenting utility classes as custom CSS.
**Bad Example**:
```markdown
## Styling
The application uses custom CSS with consistent spacing and color application.

## Border Radius
- Small: 4px
- Medium: 6px
- Large: 8px
```
**Why It's Wrong**: If the extracted data shows Tailwind utility classes (`rounded-md`, `bg-blue-600`, `px-4`), the DESIGN.md should state this. Omitting the framework means the generated code will use raw CSS instead of the project's actual utility system, creating inconsistency. Additionally, the "custom" border radius values are actually Tailwind defaults (`rounded-sm`, `rounded-md`, `rounded-lg`).
**Correct Approach**:
```markdown
## Styling Framework
Tailwind CSS v3.x detected. All values below map to Tailwind utility classes.

## Border Radius
| Level  | Value | Tailwind Class |
|--------|-------|----------------|
| Small  | 4px   | rounded-sm     |
| Medium | 6px   | rounded-md     |
| Large  | 8px   | rounded-lg     |
| Full   | 9999px| rounded-full   |
```
State the framework explicitly. Where possible, provide both raw values and framework-specific class names or tokens.
**Detection**: Search extracted data for framework indicators: Tailwind (`class="bg-"`, `tailwind.config`), Bootstrap (`class="btn-"`, `class="col-"`), Material UI (`MuiButton`, `sx={{`), etc. If detected but not mentioned in the output, flag the omission.

---

### AP-21: Missing Brand Context
**Description**: Writing design system values without identifying who the brand is, who the audience is, or what market position the system supports.
**Bad Example**:
```markdown
## Overview
The design system uses a blue accent (#2564eb) with Inter font and an 8px spacing grid.
```
**Why It's Wrong**: This describes parameters without identity. The same sentence could describe a healthcare dashboard, a developer tool, or a children's learning platform. Without brand context, the DESIGN.md cannot guide decisions about tone, voice, or component appropriateness.
**Correct Approach**:
```markdown
## Overview
Stripe's design system reflects fintech infrastructure made visible -- a system
serving developers and finance teams where precision signals trustworthiness.
The accent blue-violet (#533afd) anchors interactive elements across a palette
that balances institutional confidence with approachable warmth.
```
Name the brand, signal the audience, connect visual choices to brand position.
**Detection**: Check the opening section for a company/product name and at least one audience or market-position signal. If both are absent, flag AP-21.

---

### AP-22: Generic Voice
**Description**: Using casual, enthusiastic, or Silicon Valley-default copy conventions for brands where they are inappropriate.
**Bad Example**:
```markdown
## Content & Voice
- Button text: "Get Started!", "Let's Go!", "Try It Free!"
- Error messages: "Oops! Something went wrong 😅"
- Empty state: "Nothing here yet! Start creating ✨"
```
*(For a Japanese utility company's customer portal)*
**Why It's Wrong**: Exclamation marks, emoji, and casual contractions violate the formality expectations of the brand's audience and market. A utility company in Japan communicating with residential customers requires institutional respect, not startup enthusiasm.
**Correct Approach**:
```markdown
## Content & Voice
- Button text: "お申し込み", "確認する", "次へ"
- Error messages: "入力内容をご確認ください。"
- Empty state: "現在、表示できるデータはありません。"
- Tone: Formal, respectful, institutional. No emoji. No exclamation marks in UI text.
```
Derive voice from the brand's actual UI text, not from Western SaaS conventions.
**Detection**: Compare button text and microcopy against the identified brand category. Flag if casual/enthusiastic copy appears for formal/institutional brands.

---

### AP-23: No Accessibility Contract
**Description**: Documenting colors, typography, and components without stating WCAG conformance level, contrast ratios, focus specifications, or touch target requirements.
**Bad Example**:
```markdown
## Color Palette
| Role       | Value   |
|------------|---------|
| Background | #ffffff |
| Text       | #6b7280 |
| Accent     | #3b82f6 |
```
*(No contrast ratios, no WCAG level, no focus ring spec)*
**Why It's Wrong**: `#6b7280` on `#ffffff` has a contrast ratio of 4.6:1, which barely passes WCAG AA for normal text but fails for large text expectations that many teams apply universally. Without stating the ratio, implementers cannot evaluate compliance.
**Correct Approach**:
```markdown
## Color Palette
| Role       | Value   | On Background | Contrast | WCAG AA |
|------------|---------|---------------|----------|---------|
| Text       | #6b7280 | #ffffff       | 4.6:1    | Pass (normal) |
| Accent     | #3b82f6 | #ffffff       | 3.1:1    | Fail (normal), Pass (large) |

## Accessibility Contract
- Target: WCAG 2.1 AA
- Focus ring: 2px solid #3b82f6, 2px offset
- Minimum touch target: 44x44px
```
**Detection**: Search for "WCAG", "contrast", "focus ring", "touch target" in the document. If none are present, flag AP-23.

---

### AP-24: State Blindness
**Description**: Documenting only the default/resting state of components, ignoring loading, empty, error, disabled, and success states.
**Bad Example**:
```markdown
## Data Table
Background: #ffffff | Header: #f9fafb | Border: 1px solid #e5e7eb
Row text: 14px Inter weight 400 | Header text: 12px weight 600 uppercase
```
**Why It's Wrong**: A data table is empty when filtered results return nothing, loading when fetching, errored when the API fails, and may show selected rows. Documenting only the data-present state means implementers will invent the other states, creating visual inconsistency.
**Correct Approach**:
```markdown
## Data Table
| State | Description |
|---|---|
| Default | Background #ffffff, header #f9fafb, row text 14px/400 |
| Loading | Skeleton rows: 3 shimmer rows at 40px height, #f3f4f6 to #e5e7eb animation |
| Empty | Centered illustration + "No results found" at 14px #6b7280 + optional CTA |
| Error | Inline error banner above table: #fef2f2 background, #991b1b text |
| Row hover | Background #f9fafb |
| Row selected | Background #eff6ff, left border 2px solid #3b82f6 |
```
**Detection**: For each interactive or data-dependent component, check for at least 3 states beyond default. If only the default state is documented, flag AP-24.

---

### AP-25: Unnamed Principles
**Description**: Describing what the system does technically without naming the design principle behind the decision.
**Bad Example**:
```markdown
## Shadows
The system uses blue-tinted shadows with rgba(50,50,93,0.25) instead of
standard black shadows.
```
**Why It's Wrong**: The observation is correct but unmemorable. Without a name, the principle cannot be referenced in code reviews, design critiques, or component discussions. It becomes a floating fact instead of a system concept.
**Correct Approach**:
```markdown
## Shadows
The system follows a principle of **chromatic depth**: where most systems use
neutral gray or black shadows, this system tints elevation shadows with brand
navy (`rgba(50,50,93,0.25)`), creating shadows that feel integrated with the
palette rather than generically applied.
```
Name the principle in bold on first use. Reference it by name in subsequent sections.
**Detection**: Check the atmosphere, shadow, typography, and color sections for bold-formatted principle names. If no section contains a named principle, flag AP-25.

---

### AP-26: Convention Assumption
**Description**: Documenting a system's choices without contrasting them with the typical approach, leaving the reader unable to understand what makes this system distinctive.
**Bad Example**:
```markdown
## Typography
Headlines use weight 300 at 48px with -2.4px letter-spacing.
```
**Why It's Wrong**: The reader has no frame of reference. They do not know that weight 300 for headlines is unusual (most systems use 600-700), or that -2.4px letter-spacing is extreme (most systems use -0.5px to -1px). Without the contrast, the distinctive choices feel like arbitrary parameters.
**Correct Approach**:
```markdown
## Typography
Headlines use weight 300 at 48px -- the opposite of the conventional 600-700
headline weight. This whispered authority trusts whitespace and size, not
boldness, to create hierarchy. The -2.4px letter-spacing is 3-4x more
aggressive than the typical -0.5px to -1px, creating text that feels
compressed and infrastructure-like.
```
State the convention, then state how this system departs from it.
**Detection**: Check for comparative language ("unlike", "where most", "rather than", "instead of", "the conventional") in the atmosphere and typography sections. If none appears in a document with distinctive choices, flag AP-26.

---

### AP-27: Frequency Ignorance
**Description**: Documenting colors, shadows, or radius values without indicating which ones dominate the system and which are rare exceptions.
**Bad Example**:
```markdown
## Colors
- #171717 — text color
- #5e6ad2 — accent
- #fafafa — surface
- #e5e7eb — border
```
**Why It's Wrong**: This flat list implies all four colors have equal importance. In reality, `#171717` may appear on 62% of text elements while `#5e6ad2` appears on only 3%. Without frequency, a developer might use the accent color as freely as the text color, breaking the system's restraint.
**Correct Approach**:
```markdown
## Colors
- #171717 — text color [dominant: 62% of text elements]
- #fafafa — surface [dominant: primary background for cards and panels]
- #e5e7eb — border [common: appears on most bordered elements]
- #5e6ad2 — accent [rare: 3% of elements, reserved for interactive states]
```
Frequency data transforms a color list into a usage strategy.
**Detection**: Check the color section for frequency indicators (percentage, rank, tier like dominant/common/rare, or usage count). If no color has frequency data, flag AP-27.

---

### AP-28: Emoji in Formal Brand
**Description**: Including emoji in copy guidelines, empty states, or error messages for a brand whose tone is formal, institutional, or conservative.
**Bad Example**:
```markdown
## Content Voice
- Success: "Changes saved! 🎉"
- Error: "Something went wrong 😕 Please try again."
- Empty: "No projects yet ✨ Create your first one!"
```
*(For a B2B financial services platform)*
**Why It's Wrong**: Emoji in a financial services context undermines the institutional trust the brand requires. The extracted UI text contained zero emoji, but the LLM added them from training data defaults.
**Correct Approach**:
```markdown
## Content Voice
- Emoji policy: None. All feedback uses text and icons only.
- Success: "Changes saved successfully."
- Error: "An error occurred. Please try again or contact support."
- Empty: "No projects found. Create a new project to get started."
```
Match the emoji policy to the brand's observed behavior. If the source contains no emoji, the output must contain no emoji.
**Detection**: If the brand is classified as formal/institutional and the document contains emoji in copy examples, flag AP-28. Also flag if the extracted source text contains zero emoji but the output introduces them.

---

## Summary Checklist

Use this checklist when reviewing a generated DESIGN.md:

- [ ] **AP-01**: All hex values exist in source data
- [ ] **AP-02**: No banned vague adjectives without supporting values
- [ ] **AP-03**: Semantic roles match usage frequency, not hue assumptions
- [ ] **AP-04**: Interactive elements have hover, focus, active, and disabled states
- [ ] **AP-05**: Principles backed by 3+ occurrences; one-offs labeled as variants
- [ ] **AP-06**: Consistent format for hex case, color notation, and weight format
- [ ] **AP-07**: All font families in the data appear in the typography table
- [ ] **AP-08**: Every constraint includes a measurable threshold
- [ ] **AP-09**: Agent prompt section is self-contained with inline values
- [ ] **AP-10**: Zero-blur box-shadows separated from elevation shadows
- [ ] **AP-11**: Dark mode documented when present in source data
- [ ] **AP-12**: Color names encode function, not just hue and index
- [ ] **AP-13**: Every characteristic includes measured values
- [ ] **AP-14**: One canonical name per token, consistent across all sections
- [ ] **AP-15**: Every "Do" entry includes specific values or token references
- [ ] **AP-16**: Prose after tables adds context, not repetition
- [ ] **AP-17**: Components classified by semantic role, not visual similarity
- [ ] **AP-18**: Gradients include full definition with stops and angle
- [ ] **AP-19**: Layout specs include column count, max-width, and breakpoints
- [ ] **AP-20**: Detected CSS framework named and mapped to output values
- [ ] **AP-21**: Brand context present -- not writing design values in a vacuum
- [ ] **AP-22**: Voice matches brand -- no generic enthusiasm for formal brands
- [ ] **AP-23**: Accessibility contract present -- contrast ratios, focus specs, touch targets
- [ ] **AP-24**: All component states documented -- not just the happy path
- [ ] **AP-25**: Design principles are named -- decisions have vocabulary, not just values
- [ ] **AP-26**: System contrasted with convention -- reader knows what makes this system different
- [ ] **AP-27**: Frequency data present -- reader knows which values dominate
- [ ] **AP-28**: Emoji policy matches brand -- no emoji in formal copy, no sterility in playful brands
