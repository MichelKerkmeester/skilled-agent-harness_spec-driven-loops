---
name: design-md-generator
description: >
  Generate publication-quality DESIGN.md v2 files from any website URL. Analyzes CSS, typography,
  colors, components, layout, content, accessibility, state patterns, and iconography to produce
  a 17-section design system reference that AI agents can use to reproduce the website's visual
  style. Use when the user wants to extract design tokens, generate DESIGN.md, analyze a website's
  design system, or reverse-engineer UI styles.
---

# Design MD Generator v2

## Overview

This skill generates a publication-quality DESIGN.md v2 from a live website URL. The v2 format produces a 17-section document (14 core + 4 optional) that exceeds what any existing AI design system tool generates.

The process has two distinct phases with a hard boundary between them:

**Phase 1 -- Deterministic Extraction (scripts)**
Node.js scripts crawl the site, extract computed styles, capture screenshots, and produce a structured `tokens.json` file. This phase is mechanical. Every value it produces is ground truth.

**Phase 2 -- Semantic Writing (Claude Code)**
You read the extraction data and screenshots, then write the DESIGN.md. Your job is semantic interpretation: assigning roles to colors, naming typography levels, describing atmosphere, writing do's/don'ts, inferring accessibility contracts, documenting content voice, and composing self-contained agent prompts.

**The cardinal rule:** ALL numerical values in the final DESIGN.md -- every hex code, every pixel value, every font-weight number, every shadow string, every border-radius -- MUST be copied verbatim from `tokens.json` or extraction output. You never estimate, round, normalize, or invent values. If a value is not in the extraction data, it does not appear in the DESIGN.md. This is the single most important constraint. Violating it produces phantom values (anti-pattern AP-01) that make the entire document unreliable.

**Hex value cardinal rules:**
- **NEVER use 3-digit hex shortcuts** (`#000`, `#fff`, `#eee`). ALWAYS use 6-digit lowercase (`#000000`, `#ffffff`, `#eeeeee`).
- **Colors from CSS variables in tokens.json ARE acceptable** if the variable name and value are documented in the `cssVariables` field.
- **Before writing ANY hex value, verify it exists** in either `tokens.colorTokens[].hex` or `tokens.cssVariables[].value`. If not found, do not use it.

**What you DO contribute:**
- Semantic role assignment (which color is "primary," which is "accent")
- Atmospheric descriptions (what the design feels like, its personality)
- Descriptive color names ("Ship Red" instead of "Red 1")
- Typography role mapping (which extracted size is "Display Hero" vs "Body")
- Named design strategies and principles
- Brand context and personality inference
- Content voice analysis from observed copy
- Accessibility contract inference from observed patterns
- State matrix construction from observed component states
- Icon system identification
- Do's and don'ts derived from observed patterns
- Self-contained agent prompts with all values inlined
- Structural observations (shadow-as-border philosophy, compression-as-identity)

**What you NEVER invent:**
- Hex values, px values, rem values, font-weight numbers
- Shadow strings, gradient definitions, border-radius values
- Breakpoint widths, spacing scale entries, transition durations
- Font family names, OpenType feature tags
- Button labels, copy text, or any content not observed on the site

---

## Prerequisites

- Node.js >= 18
- Project located at the `dmdg/` directory (this repo)
- Playwright with Chromium browser

**Auto-install if dependencies are missing:**

```bash
cd /path/to/dmdg && npm install && npx playwright install chromium
```

Verify readiness:

```bash
cd /path/to/dmdg && npx ts-node scripts/extract.ts --help
```

If `ts-node` is not found, install it: `npm install -D ts-node typescript`.

---

## Execution Mode

**FULL AUTO with PARALLEL PIPELINE.** Three phases with maximum parallelism. Target: under 4 minutes for any site.

### Phase 1: Fast Extract (Orchestrator)

Run extraction with speed-optimized defaults:

```bash
cd /path/to/dmdg && npx ts-node scripts/extract.ts <URL> --fast
```

The `--fast` flag sets: maxPages=5, noInteraction=true, concurrency=8. This typically completes in 60-120 seconds.

If the user needs interaction states (hover/focus/active), they can re-run later with `--with-interaction --merge-with output/<domain>/tokens.json`.

After extraction: read tokens.json, check boundary, review extraction report.

### Phase 2: Write + Proof in Parallel

Launch ALL of these in a SINGLE message — 10 writing subagents + 1 proof task, all parallel:

**10 Writing Subagents (opus model):**

Each receives: tokens.json file path + cardinal rules + stability layer rules (L1+L2 only in main content)

| Agent | Sections | Key Data | Est. Time |
|-------|----------|----------|-----------|
| A | §0 Brand Context + §6.5 Motion | meta, motionSystem | ~60s |
| B | §1 Visual Theme | colorTokens, typographyLevels, screenshots | ~60s |
| C | §2 Color Palette + §2.5 Dark Mode | colorTokens, cssVariables, darkMode | ~70s |
| D | §3 Typography | typographyLevels, fontInfo | ~60s |
| E | §4 Components (first half: Link, Button, Input) | componentGroups[0-2], interactions | ~70s |
| F | §4 Components (second half: Card, Nav, Footer + cross-patterns) | componentGroups[3+], interactions | ~70s |
| G | §5 Layout + §6 Depth | spacingSystem, shadowTokens, radiusTokens, layoutPatterns | ~60s |
| H | §7 Content & Voice + §8 Do's/Don'ts | sampleTexts, all tokens for Do/Don't | ~70s |
| I | §9 Accessibility + §10 Responsive + §11 State Matrix | a11yTokens, breakpoints, interactions | ~70s |
| J | §12 Iconography + §13 Agent Prompt Guide | iconSystem, ALL tokens | ~70s |

**Proof Task (run as background Bash command):**

```bash
cd /path/to/dmdg && npx ts-node scripts/proof.ts <URL> output/<domain>/tokens.json output/<domain>/ &
```

Proof only needs tokens.json + live site — does NOT need DESIGN.md. Run it during Phase 2 to save ~40 seconds.

**Subagent prompt template:**

```
You are writing sections [X, Y, Z] of a DESIGN.md v2 for [site]. Use opus model.

CARDINAL RULES:
- ALL hex values must exist in tokens.colorTokens[].hex or cssVariables[].value — NO EXCEPTIONS
- 6-digit lowercase hex only (#ffffff not #fff)
- Numeric font weights only (400 not "regular")
- Include frequency data for colors/shadows/radius
- Use STABILITY CLASSIFICATION: only L1 (infrastructure) + L2 (system) tokens in main content.
  L3 (campaign) in notes marked "Current campaign — subject to change". L4 (content) excluded entirely.
- Include USE: lines on every component variant with real text
- Use NAMED PRINCIPLES with comparative framing
- Agent prompts must be zero-lookup (every value inlined)

tokens.json is at: [path]

Write ONLY your assigned sections. Output as markdown. Do not include sections assigned to other agents.
```

### Phase 3: Assemble & Deliver (Orchestrator)

After all 10 subagents + proof return:

1. **Assemble**: Concatenate sections in order with header comment block. Fix any h1→h2 header issues.
2. **Machine pre-validation**: grep all hex values, verify traceable, fix 3-digit hex / uppercase / phantoms
3. **Run validation**: `npx ts-node scripts/validate.ts` — if score < 80, auto-fix and re-run
4. **Generate preview**: `npx ts-node scripts/preview-gen.ts`
5. **Generate report** (proof-data.json already exists from parallel proof): `npx ts-node scripts/report-gen.ts`
6. **Open report**: `open output/<domain>/report.html`
7. **Present summary**:
   ```
   ✅ Generation complete for [Site].
   Quality: [score]/100 | Fidelity: [coverage]%
   Colors: [N] (L1: [n], L2: [n], L3: [n] campaign) | Typography: [N] | Components: [N]
   DESIGN.md: [lines] lines | Time: [total]s
   📄 report.html opened in browser.
   ```

### Fallback: Sequential Mode

If subagent launching is not available (Cursor, Codex, etc.), run Steps 5-20 sequentially within a single context. Add `--with-interaction` to extraction for full state capture since there's no parallel time saving to protect.

---

## Step 1: Run Extraction

**Command:**

```bash
cd /path/to/dmdg && npx ts-node scripts/extract.ts <URL> --output output/<domain>/
```

Replace `<URL>` with the target website (e.g., `https://vercel.com`) and `<domain>` with the domain name (e.g., `vercel`).

**Expected time:** 30-60 seconds for a typical site. Sites with many pages or heavy JavaScript may take longer.

**Success criteria -- verify ALL of these before proceeding:**

1. `output/<domain>/tokens.json` exists and is non-empty
2. At least 3 screenshot files exist in `output/<domain>/screenshots/`
3. `output/<domain>/extraction-report.json` exists
4. The extraction report has no `fatal` errors (warnings are acceptable)

**Read the extraction report:**

```bash
cat output/<domain>/extraction-report.json
```

Check the `status` field. If `status` is `"success"` or `"partial"`, proceed. If `"failed"`, check `errors` for the cause.

**Failure handling:**

| Failure | Symptom | Fix |
|---------|---------|-----|
| Anti-bot protection | 403/429 status, empty page | Re-run with `--delay 5000 --stealth` flags if available; if not, wait 30 seconds and retry |
| Timeout | Script hangs or reports timeout | Re-run with `--timeout 60000` |
| CAPTCHA | Screenshot shows CAPTCHA challenge | Inform the user: "The site requires CAPTCHA verification. Please complete it manually, then I can retry extraction." |
| No CSS found | tokens.json has empty color/typography sections | The site may load styles dynamically; try adding `--wait-for css` |
| SSL error | Certificate validation failure | Try with `--ignore-ssl-errors` if the site is known-safe |

If the extraction fails after two retries, inform the user with the specific error and suggest alternative approaches (providing a URL to a different page, or manual CSS inspection).

---

## Step 2: Design System Boundary Check

Read the extraction report's `designBoundary` field:

```bash
cat output/<domain>/extraction-report.json | grep -i boundary
```

The boundary determines output structure:

| Boundary Value | Meaning | Output Structure |
|----------------|---------|------------------|
| `unified` | Single coherent design system across all pages | One `DESIGN.md` file |
| `shared-foundation` | Common base tokens with product-specific overrides | Base `DESIGN.md` + per-product `DESIGN-<product>.md` files |
| `independent` | Distinct design systems on different sections | Separate `DESIGN.md` files per section |

**For `shared-foundation` or `independent`:**
Present the detected boundary to the user along with any anomalies listed in the report. Ask for confirmation before proceeding:

> "The extraction detected [boundary type]. The following sections appear to use different design tokens: [list]. Should I proceed with [recommended structure], or would you prefer a single unified file?"

Wait for user confirmation before continuing.

**For `unified`:** Proceed directly to Step 3.

---

## Step 3: Analyze Extracted Data

Read `tokens.json` and build a mental model of the design system:

```bash
cat output/<domain>/tokens.json
```

Report these metrics to the user:

1. **Color count**: Total distinct colors. Expect 15-50 for a well-designed system. Fewer than 8 suggests incomplete extraction. More than 80 suggests the extraction captured too many one-off values.
2. **Typography levels**: Count of distinct font-size/weight/line-height combinations. Expect 12-20.
3. **Component types**: List detected component categories (buttons, cards, inputs, navigation, badges, etc.).
4. **Framework detection**: What CSS framework was detected (Tailwind, Bootstrap, none, etc.).
5. **Dark mode status**: Whether dark mode tokens were extracted.
6. **Font families**: List all detected font families.
7. **Motion data**: Whether transition/animation data exists in `motionSystem`.
8. **Icon data**: Whether icon system information was detected.
9. **Accessibility data**: Whether ARIA attributes and focus styles were captured.
10. **Content samples**: Whether button labels, headlines, and copy text were captured.

### Stability Layer Classification

For each token in `tokens.json`, check the `stability` field (if present) or infer stability from context:

- **L1 Infrastructure** (`stability.layer === 'infrastructure'`): navigation, footer, font system, link color, structural grays, focus rings. Stable forever. → Include in main DESIGN.md sections.
- **L2 System** (`stability.layer === 'system'`): button styles, card patterns, shadow system, spacing scale. Changes with major redesigns. → Include in main DESIGN.md sections.
- **L3 Campaign** (`stability.layer === 'campaign'`): hero sections, promotional banners, launch-specific accents. Changes per product launch. → Include in a "Current Campaign" appendix, marked with extraction date.
- **L4 Content** (`stability.layer === 'content'`): product images, color swatches, pricing, copy text. Changes constantly. → EXCLUDE entirely from DESIGN.md.

Apply this filter throughout all subsequent steps. The DESIGN.md documents the **design system** (permanent rules), not the **website content** (temporary values). Every token should pass the test: "Will this value still be correct 6 months from now?"

**If data seems insufficient** (fewer than 8 colors, fewer than 6 typography levels, or zero components):

> "The extraction captured limited data. This may produce a sparse DESIGN.md. Would you like me to add additional URLs for deeper extraction? For example, a pricing page, documentation page, or dashboard page often reveals more components."

If the user provides additional URLs, re-run extraction with the `--urls` flag or run sequential extractions and merge the output.

---

## Step 4: Review Screenshots

View ALL screenshots in this order:

1. Homepage -- desktop viewport
2. 2-3 additional pages -- desktop viewport
3. Homepage -- mobile viewport
4. Dark mode screenshots (if they exist)

For each screenshot, observe and mentally note:

- **Overall atmosphere**: What is the first impression? What emotion does the color/space balance create?
- **Color presence**: Which colors dominate? Which appear only as accents? Is the palette warm or cool?
- **Typography feel**: Are headlines heavy or light? Is text dense or airy? What is the tracking personality?
- **Whitespace**: Is spacing generous or tight? Is section separation done through space, color, or borders?
- **Component consistency**: Do buttons/cards/badges share a visual language? Are there outliers?
- **Special effects**: Gradients, shadows, glassmorphism, overlapping elements, decorative illustrations?
- **Content/copy tone**: What language do headlines, CTAs, and descriptions use? Formal, casual, technical?
- **Icon style**: Are icons outlined, filled, duo-tone? What library do they appear to be from?
- **State indicators**: Are there loading states, error states, empty states visible?
- **Accessibility signals**: Are focus rings visible? Are ARIA labels present in interactive elements?

This step is critical for multiple sections. The screenshots shape your interpretation of brand context (Section 0), atmosphere (Section 1), content voice (Section 7), and accessibility (Section 9). The tokens.json provides the values; the screenshots provide the feeling. You need both.

---

## Step 5: Generate Section 0 -- Brand Context

**Before writing, identify:**
1. What does the company/product do? (from page content, meta tags, hero text)
2. Who is the target audience? (from language complexity, feature descriptions, pricing)
3. What personality adjectives describe the design? (from visual observations in Step 4)

### Company/Product Identity

Write 1-2 sentences describing what the product is. Use functional language, not marketing copy:

```
Stripe is a payment infrastructure platform providing APIs for online payment processing, billing, and financial operations.
```

### Target Audience

Write 1-2 sentences. Be specific:

```
Target audience: Software developers and engineering teams integrating payment processing into web and mobile applications. Secondary: finance teams managing billing operations.
```

### Brand Personality

List 3-5 adjectives. Each MUST have a parenthetical rationale tied to an observable design decision from tokens.json:

```
- Authoritative (weight 300 headlines -- confidence without visual weight)
- Technical (monospace `SourceCodePro` in data displays; `"tnum"` for tabular numbers)
- Premium (blue-tinted shadows `rgba(50,50,93,0.12)` add atmospheric depth)
- Precise (six-step text-color ladder from `#061b31` to `#7d8ba4`)
```

### Sources Referenced

List the specific pages that were crawled.

**Word count target:** 60-120 words.

---

## Step 6: Generate Section 1 -- Visual Theme & Atmosphere

**Before writing, re-read ALL screenshots one more time.** This section is where writing quality matters most.

### Opening Sentence

Write ONE sentence that captures the design system's essence. This sentence must:

1. Be unique to this specific site -- swapping it onto a different site must feel wrong
2. Use a metaphor or precise framing, not parameter listing
3. Allow a reader who has never seen the site to form a correct mental image

**Structure pattern:** `[Subject]'s website is [unique framing] -- [elaboration with tension or contradiction]`

**Test:** Ask yourself "Could this sentence describe three other websites?" If yes, rewrite.

**Banned words** (never use in any descriptive prose throughout the entire document):
`clean`, `modern`, `sleek`, `professional`, `user-friendly`, `intuitive`, `elegant`, `beautiful`, `stunning`, `gorgeous`, `polished`, `refined`, `sophisticated`, `seamless`, `cutting-edge`, `state-of-the-art`, `next-generation`, `innovative`, `revolutionary`, `world-class`, `premium` (as vague adjective), `crisp`, `delightful`, `lovely`, `nice`, `simple` (without specifics).

The replacement rule: every banned word is a placeholder for a specific observation you have not yet made. Find the observation.

### Paragraphs 2-4: Layered Expansion

Each paragraph zooms into a different layer. Each MUST include at least two concrete values from tokens.json as inline evidence.

- **P2 -- Macro (Color and Space):** What does the overall canvas feel like? What is the dominant color relationship? Reference specific hex values for the primary background, text color, and brand/accent color.
- **P3 -- Meso (Typography Character):** What font defines the system? What makes its usage distinctive? Reference the font name, a specific weight, a specific size, and letter-spacing values.
- **P4 -- Micro (Unique Technique):** What single technical decision makes this system different from its peers? Name the technique, provide the exact CSS value, and explain the architectural reason.

### Named Design Principles

After the prose, name and define the 2-4 most distinctive design principles:

```
**Design Principles:**
- **Chromatic Depth**: Shadows carry brand color rather than neutral gray
- **Compression as Identity**: Aggressive negative tracking defines the typographic voice
```

### Comparative Framing

At least one sentence in the prose must use a comparative structure: "Unlike most systems...", "Where others...", "This is not..."

### Key Characteristics List

Write 8-12 bullet items using the em-dash format:

```
- [Design intent / what it achieves] -- [implementation parameters / how to do it with `css-value`]
```

Every item must have:
- A front half that describes the WHY (design intent, what it achieves visually)
- A back half that describes the WHAT (specific CSS values, font names, pixel measurements)
- At least one value in backticks

**Word count target:** 200-300 words for prose (excluding Key Characteristics list and Design Principles).

**Reference anti-patterns:** AP-02 (generic description), AP-13 (characteristics without values).

---

## Step 7: Generate Section 2 -- Color Palette & Roles

### Read the Color Role Taxonomy

Before assigning any roles, review the role definitions in `resources/color-role-taxonomy.md`. Follow the Role Assignment Priority order:

1. CSS variable name (strongest signal)
2. Framework convention
3. Usage frequency + context
4. Visual position on page
5. Color hue alone (weakest -- never use alone)

### Stability Layer Filtering for Colors

Group colors by stability layer FIRST, then by brand/structural within each layer:

- **Only L1 (Infrastructure) + L2 (System) colors appear in the main palette.** These are the design system's permanent color vocabulary.
- **L3 (Campaign) colors appear in a "Current Campaign Colors" note** at the end of the section, marked with extraction date. These are temporary and will change with the next product launch.
- **L4 (Content) colors are omitted entirely.** Product images, color swatches, and pricing badge colors are not part of the design system.

After listing the palette, add a **"Color Boundary Rules"** subsection that documents the CONSTRAINTS, not just the palette. Example rules:

```
### Color Boundary Rules

- Product accent colors (pink, orange, purple seen in product tiles) are confined to product tile contexts. They are NOT system palette entries and should not be used in navigation, buttons, or form elements.
- Hero gradient endpoints are campaign-level and change per launch cycle. Do not treat them as permanent brand colors.
- Status colors (success green, error red, warning amber) are L2 system tokens. They are stable and should be used consistently across all components.
- Any color appearing at frequency < 3 and only in product imagery is L4 content -- do not document it.
```

### Split into Brand Colors and Structural Colors

**v2 requires a primary split:**

- `### Brand Colors` -- all colors with meaningful hue saturation (chromatic)
- `### Structural Colors` -- all near-neutral, gray-family, near-black, near-white (achromatic)

Within each, organize into `####` sub-groups as needed.

### Write Color Entries (v2 format)

Format for each color:

```
- **Descriptive Name** (`#hexval`): frequency {N}. Used as text ({n}), background ({n}), border ({n}), gradient ({n}). CSS var: `--var-name`. Role description. Personality sentence.
```

**v2 requirements per entry:**
- **Name descriptively**, not generically. Use brand-specific names or role-based names.
- **Hex values are always 6-digit lowercase.** Copy-paste from `tokens.json` `colorTokens`.
- **Frequency count** from extraction data.
- **Usage breakdown** showing text/bg/border/shadow/gradient/icon counts where non-zero.
- **CSS variable names** in backticks if captured.
- **Role description** of where it appears functionally.
- **Personality sentence** describing the visual quality (not emotion). "A saturated blue-violet that reads as financially authoritative" not "A beautiful color that feels premium."

### Minimum Requirements

- At least 8 colors documented across all groups
- Every color hex MUST exist in `tokens.json` `colorTokens` -- cross-reference before finalizing

### Dark Mode Overrides

If `tokens.json` contains dark mode data:
- Add a `### Dark Mode Overrides` subsection
- Show changed tokens with their dark mode values
- Only document colors that CHANGE

**Reference anti-patterns:** AP-01 (phantom color), AP-03 (semantic misattribution), AP-11 (dark mode omission), AP-12 (vague names), AP-14 (terminology drift).

---

## Step 7.5: Generate Section 2.5 -- Dark Mode System

This step produces a full parallel dark mode specification. It is conditional on the extraction data.

### Gate Check

1. Read `tokens.darkMode.supported` from `tokens.json`.
2. If `false` or the `darkMode` field is absent, **skip this step entirely**. Do not generate the section. Proceed to Step 8.
3. If `true`, continue below.

### Read the Variable Diff

Read `tokens.darkMode.variableDiff` to get the full list of CSS variable changes. Also read `tokens.darkMode.detectionMethod` and `tokens.darkMode.detectionSource`.

### Group Variables by Role

Classify each variable in `variableDiff` into one of these groups using the variable name as the primary signal:

| Group | Matching heuristic |
|-------|-------------------|
| Backgrounds & Surfaces | Name contains `bg`, `background`, `surface`, `canvas` |
| Text Colors | Name contains `text`, `foreground`, `fg`, `heading`, `body`, `label` |
| Borders | Name contains `border`, `divider`, `separator`, `outline` |
| Shadows & Elevation | Name contains `shadow`, `elevation`, `ring` |
| Other | Everything that does not match the above |

### Write the Section

Follow the format spec in `resources/design-md-format.md` Section 2.5. Write these subsections in order:

1. **Detection Method** -- state the trigger mechanism and detection source from extraction data.

2. **Color Mapping Table** -- produce the FULL grouped table. Show ALL variables from `variableDiff`, not a subset. Use the `####` sub-headings for each role group. Each row has: Variable, Light Value, Dark Value, Role (inferred from variable name and context).

3. **Dark Surface Stack** -- extract all dark mode background/surface values from the mapping table. Name each surface level descriptively (Void, Deep Surface, Raised Surface, Elevated Surface, etc.). List from darkest to lightest.

4. **Dark Text Ladder** -- extract all dark mode text color values. List from highest contrast (lightest on dark) to lowest contrast (darkest on dark).

5. **Dark Shadow Adjustments** -- compare shadow-related variables between light and dark. If no shadow variables changed, state "Shadows are unchanged between modes."

6. **Dark Component Overrides** -- identify component-specific treatments (badges, inputs, code blocks, etc.) from the variable names. If none are distinguishable, state that explicitly.

7. **Implementation Notes** -- document the CSS variable strategy, toggle mechanism, and transition behavior.

8. **Dark Mode Strategy Name** -- name the approach with an evocative label. Choose from the taxonomy in the format spec or create a custom name that fits.

### Comparative Observation (Required)

After naming the strategy, write 2-3 sentences that explain how the dark mode FEELS different from light mode structurally. Address at least one of these:

- Does the gray ladder compress or expand?
- Do accent colors gain or lose relative visual weight?
- Does the hierarchy flatten or sharpen?
- Does the typography contrast relationship change?

This is NOT "the background becomes dark" -- it is "the hierarchy flattens because the gray ladder compresses from 8 steps to 5, making accent colors carry proportionally more visual weight."

### Cardinal Rule Reminder

All hex values in this section MUST come from `tokens.darkMode.variableDiff`. Do not invent dark mode colors. If a value is not in the extraction data, it does not appear in the section.

---

## Step 8: Generate Section 3 -- Typography Rules

### Stability Filter

Only document L1 (Infrastructure) and L2 (System) typography tokens as the "system." Font families, the hierarchy scale, and named strategies are all L1/L2. If a typography level is used exclusively in a campaign hero or promotional banner, note it as "campaign-specific" rather than including it in the main hierarchy table. Skip L4 content-level text entirely (e.g., product descriptions, pricing copy styles that change per launch).

### Font Family Subsection

List all detected font families with their full fallback stacks from `tokens.json`:

```
- **Primary**: `FontName`, with fallbacks: `fallback1, fallback2, fallback3`
- **Monospace**: `MonoFont`, with fallbacks: `fallback1, fallback2`
- **OpenType Features**: `"liga"` enabled globally; `"tnum"` for tabular numbers.
```

### Font Substitution Notes (v2 new)

For every proprietary/commercial font detected, provide:

```
**Substitution notes:**
- `sohne-var` is proprietary to Stripe. Closest free alternative: `Inter` (similar x-height, geometry) or `DM Sans` (similar weight range). When substituting, preserve the weight 300 signature and apply equivalent letter-spacing.
```

### Hierarchy Table

Build a markdown table with these exact columns:

```
| Role | Font | Size | Weight | Line Height | Letter Spacing | Features | Notes |
```

The `Features` column is REQUIRED in v2 (use `-` when no features apply).

**Column rules:**
- **Role**: Title Case descriptive name. Map each extracted typography level to a semantic role.
- **Font**: Family name only, no fallbacks.
- **Size**: `{px}px ({rem}rem)` format. Calculate rem as px/16, two decimal places.
- **Weight**: Numeric only. Never `bold`, `semibold`, `light`.
- **Line Height**: Unitless ratio (e.g., `1.50`). Add descriptor for extremes.
- **Letter Spacing**: Value in px or `normal`.
- **Features**: OpenType feature tags in backticks or `-` for none.
- **Notes**: Brief usage note. Mention `text-transform: uppercase` when applicable.

**Row count target:** 12-20 rows.

### Named Strategies (v2 replaces "Principles")

Write 3-5 bullet points. Each strategy has a **bold name**, 2-3 supporting values, and an architectural benefit:

```
- **Light weight as signature**: Weight 300 at display sizes (56px, 48px, 44px) replaces the convention of heavy 600-700 headlines. Architectural benefit: text hierarchy is driven by size and tracking, not weight, enabling a single-weight visual identity.
```

The strategy must be NAMED with an evocative label, not just described.

**Reference anti-patterns:** AP-06 (format inconsistency), AP-07 (missing monospace/code font).

---

## Step 9: Generate Section 4 -- Component Stylings

### Stability Filter

Only document L1 (Infrastructure) and L2 (System) component patterns. Buttons, cards, inputs, navigation, and badges are L1/L2. If a component is campaign-specific (e.g., a promotional countdown banner or launch-specific hero layout), note it as "campaign-specific" in a separate subsection rather than mixing it into the system components. Skip L4 content-level components entirely.

### Identify Component Groups

Read `tokens.json` `components` section. Create `###` subsections for each component type present.

### Document Each Component Variant (v2 requirements)

For each variant, use a `**Bold Variant Name**` heading followed by a property list:

```
**Primary Dark**
- Background: `#171717`
- Text: `#ffffff`
- Padding: 8px 16px (vertical horizontal)
- Radius: 6px
- Font: 16px FontName weight 400, `"ss01"`
- Shadow: `rgba(0,0,0,0.08) 0px 0px 0px 1px`
- Hover: background shifts to `#4434d4` -- darkens to signal actionability without changing the color family
- Focus: `2px solid var(--ds-focus-color)` outline
- Transition: `background-color 150ms ease`
- Use: Primary CTA ("Start Deploying", "Get Started", "Contact Sales")
```

**v2 mandatory rules:**

1. **Every variant MUST have a `Use:` line** with 1-3 **real text examples** from the actual site. Not "Primary button" but the actual button labels observed in screenshots or content extraction.

2. **State change rationale** -- every hover/focus/active/disabled line must explain WHY, not just WHAT:
   - Good: `Hover: background shifts to #4434d4 -- darkens to signal actionability`
   - Bad: `Hover: #4434d4`

3. **Transition values** on every interactive component.

Rules:
- All CSS values in backticks.
- Include states: Hover, Focus, Active, Disabled -- whichever were observed.
- Group related variants under the same `###` subsection.

### Look for Distinctive Components

Scan screenshots for site-specific components: workflow pipelines, metric cards, trust bars, command palettes, pricing tables, comparison grids. Document under `### Distinctive Components`.

**Reference anti-patterns:** AP-04 (missing interaction states), AP-17 (wrong component classification).

---

## Step 10: Generate Section 5 -- Layout Principles

### Stability Filter

Only document L1 (Infrastructure) and L2 (System) layout tokens. The spacing scale, grid system, and border-radius scale are L1/L2. Campaign-specific layout overrides (e.g., a promotional full-bleed section with non-standard spacing) should be noted as "campaign-specific" if relevant. Skip L4 content layout entirely.

### Spacing System

From `tokens.json` `layoutPatterns` or `spacingScale`:
- State the base unit
- List the full spacing scale
- **Provide frequency counts** for the top 5-8 most common values:

```
- 16px (181 occurrences) -- dominant horizontal padding
- 8px (80 occurrences) -- compact internal spacing
```

### Grid & Container

- Max content width from extraction data
- Hero layout pattern
- Feature section column counts
- Notable patterns

### Whitespace Philosophy

Write 2-3 **bold-labeled** bullet points. Each MUST:
- Include a **contrast statement** naming what the system does differently from convention
- Include **exact px values** as evidence

```
- **Precision spacing vs. uniform padding**: Unlike systems that use one universal section gap, this system deploys six distinct vertical rhythms (48px, 60px, 64px, 71px, 80px, 96px) -- each tied to a specific content transition.
```

### Border Radius Scale

List radius tokens with frequency counts showing the dominant radius:

```
- Standard (4px): Buttons, functional elements -- 55 occurrences (DOMINANT)
```

**Reference anti-patterns:** AP-19 (layout without numbers).

---

## Step 11: Generate Section 6 -- Depth & Elevation

### Stability Filter

Only document L1 (Infrastructure) and L2 (System) shadow and depth tokens. The shadow scale and depth philosophy are L1/L2. Campaign-specific depth effects (e.g., a promotional hero with custom glassmorphism) should be noted as "campaign-specific" if relevant. Skip L4 content depth entirely.

### Named Principle

State the depth philosophy upfront using a named category:
- Chromatic depth / Shadow-as-border / Luminance stepping / Utilitarian / Minimal/flat / or a custom name

### Shadow Scale Table

Build from `tokens.json` `shadowTokens`:

```
| Level | Treatment | Frequency | Use |
```

Include 4-6 levels. The Frequency column shows occurrence count.

**Call out the most-frequent shadow explicitly:**

```
**Dominant shadow:** `rgba(50,50,93,0.12) 0px 16px 32px 0px` (45 occurrences) -- the defining elevation treatment.
```

### Shadow Philosophy Paragraph

Write 50-100 words that:
1. Name the principle
2. Contrast with the conventional approach
3. Explain the architectural benefit
4. Provide 1-2 specific RGBA values as evidence

**Shadow classification rules:**
- Zero-blur, zero-offset shadows are BORDER shadows. Classify as "Ring" or "Border" level.
- Only shadows with non-zero blur or offset belong in elevation levels.

**Optional subsection:** `### Decorative Depth`

**Reference anti-patterns:** AP-10 (shadow-border confusion).

---

## Step 12: Generate Section 6.5 -- Motion System

**In v2, this section is REQUIRED.** It is no longer optional.

### Stability Filter

Only document L1 (Infrastructure) and L2 (System) motion tokens. Duration scales, easing functions, and reduced-motion policies are L1/L2. Campaign-specific animations (e.g., a launch hero entrance choreography) should be noted as "campaign-specific" if relevant. Skip L4 content motion entirely.

### If motion data exists in tokens.json

Write all of these subsections:

**Motion Philosophy** -- 1-2 sentences describing the system's approach to motion (intent, not just values):

```
**Motion philosophy:** Motion serves as confirmation, not decoration. Transitions are fast enough to feel responsive but never theatrical.
```

**Duration Scale** -- table with frequency counts:

```
| Token | Duration | Frequency | Use |
```

**Easing Functions** -- each curve with CSS value and frequency.

**Enter/Exit Choreography** -- observed patterns for how elements enter/leave viewport. If none observed, state that explicitly.

**Reduced-Motion Fallback** -- observed `prefers-reduced-motion` behavior, or a recommended policy if none was detected:

```
**Observed:** No reduced-motion media queries detected.
**Recommended policy:** Replace transform/opacity animations with instant state changes. Preserve color transitions. Remove parallax and scroll-triggered motion entirely.
```

### If NO motion data exists

Write a minimal section:

```
## 6.5. Motion System

**Motion philosophy:** No transitions or animations were detected in the extraction data. The site relies on instant state changes. When implementing, consider adding subtle transitions (150ms ease for hover states, 300ms for reveals) to prevent visual jarring, while respecting `prefers-reduced-motion`.
```

Do NOT generate fake motion values. Acknowledge the absence honestly.

---

## Step 13: Generate Section 7 -- Content & Voice

**Data sources:** Screenshots (for visible copy), extraction data (for button labels, meta content), and page content captured during crawling.

### Tone (3-5 descriptors)

Each descriptor must have a **real example** from the site:

```
- **Direct**: "Start now" (not "Get started on your journey")
- **Technical**: "API requests per second" (uses technical terminology)
```

### Capitalization Rules

Document observed casing:

```
- Headlines: Sentence case ("Accept payments online")
- Buttons: Sentence case ("Start now", "Contact sales")
- Badges: UPPERCASE with `text-transform: uppercase`
```

### Button Label Patterns

Group real button labels by pattern:

```
- Action + Object: "Start now", "Contact sales"
- Explore: "Learn more", "View documentation"
```

### Error/Empty State Copy

If observed, document patterns. If not observed, state that and provide tone-consistent recommendations.

### Emoji Policy

```
- Observed: No emoji in page content, navigation, or CTAs
```

### Voice Examples

3-5 real copy samples with source location:

```
1. "Financial infrastructure for the internet" (hero headline)
2. "Millions of businesses of all sizes use Stripe" (social proof)
```

### Vibe Paragraph

2-3 sentences capturing brand personality as expressed through copy. Use specific observations:

```
Stripe writes like a senior engineer explaining a product to a peer -- precise, specific, never patronizing. Copy assumes the reader understands technical concepts and values efficiency over friendliness.
```

**Word count target:** 150-250 words across all subsections.

---

## Step 14: Generate Section 8 -- Do's and Don'ts

This section is where most DESIGN.md files fail. Apply extreme rigor.

### Do's (8-12 items)

Each item format:
```
- Action to take -- why it matters, with specific `css-value` or token reference
```

**Quality test for each Do:** Does this give a reader an implementation shortcut? After reading it, can they write correct CSS faster? If the Do is something any competent developer would do anyway (e.g., "Use consistent spacing"), it fails. Replace with a specific instruction that includes actual values.

### Don'ts (8-12 items)

Same format. Each Don't MUST have three components:
1. What not to do (the specific action to avoid)
2. Why it is wrong IN THIS SYSTEM (not in general)
3. What to do instead (with at least one specific value)

**Counter-intuitive test:** Would this surprise a competent developer who knows CSS but does not know this specific system? If a Don't is obvious (e.g., "Don't use too many colors"), it fails. Good Don'ts are counter-intuitive: they warn about things someone would naturally do that are WRONG in this particular system.

Every Don't must include a **specific threshold or value** -- never "Don't use too many..." but "Don't exceed 8px border-radius."

Examples of counter-intuitive Don'ts:
- "Don't use weight 600-700 for headlines -- weight 300 is the brand voice"
- "Don't use traditional CSS border on cards -- use the shadow-border technique"
- "Don't skip the inner `#fafafa` ring in card shadows -- it's the glow that makes the system work"

**Reference anti-patterns:** AP-08 (meaningless don'ts), AP-15 (do's without specifics).

---

## Step 15: Generate Section 9 -- Accessibility Contract

### WCAG Target

Infer the WCAG conformance level from observed behavior:

```
**Inferred target:** WCAG 2.1 AA. Evidence: focus indicators present, contrast ratios exceed 4.5:1 for body text.
```

### Contrast Ratios

Calculate contrast ratios for the most common text/background combinations. Build a table:

```
| Role | Foreground | Background | Ratio | Pass (AA) |
```

Minimum 5 rows. Use the WCAG contrast formula. For normal text, AA requires 4.5:1. For large text (18px+ or 14px+ bold), AA requires 3:1.

### Focus Indicators

Document observed focus styles per component type:

```
- Buttons: `2px solid #533afd` outline with `2px` offset
- Links: underline + color change
- Inputs: border color change to `#b9b9f9`
```

If no focus indicators were observed, state that as an accessibility gap.

### Touch/Click Targets

Calculate minimum observed interactive element dimensions from component padding + font size:

```
- Buttons: minimum 44px height (11.5px + 14px text + 14.5px padding)
- Smallest target observed: 24px -- below 44px WCAG recommendation
```

### Reduced-Motion Support

Cross-reference with Section 6.5 motion data.

### ARIA Patterns

Document observed ARIA attributes. If none observed, state that explicitly and note which patterns would be expected.

---

## Step 16: Generate Section 10 -- Responsive Behavior

### Breakpoints Table

From `tokens.json` `breakpoints`:

```
| Name | Width | CSS Rules | Key Changes |
```

4-7 rows. The `CSS Rules` column shows the count of CSS rules per breakpoint's media query where available. If not available, omit the column.

### Touch Targets

3-5 bullet points on mobile sizing.

### Collapsing Strategy

6-10 bullet points using arrow format with **exact pixel transitions at specific breakpoints**:

```
- Hero headline: 56px -> 44px at 1024px -> 32px at 640px, weight 300 maintained
```

### Image Behavior

3-5 bullet points on responsive image handling.

---

## Step 17: Generate Section 11 -- State Matrix

### Build the State Table

Cross components against states:

```
| Component | Loading | Empty | Error | Disabled | Success |
```

Minimum 4 component rows (buttons, cards/containers, inputs, tables or lists).

For each cell:
- State the visual treatment with specific CSS values where observed
- Use `n/a` when the state does not apply
- Use `-` when the state applies but was not observed

### Skeleton/Shimmer Patterns

If loading skeletons were observed, document:
- Background gradient values
- Animation details
- Shape matching behavior

If none observed, state that explicitly.

**Data source:** If state data is sparse in tokens.json, infer from screenshots and component styling patterns. For unobserved states, use `-` in the table -- do not invent visual treatments.

---

## Step 18: Generate Section 12 -- Iconography

### Identify the Icon System

Look for icon library signals in the extraction data:
- SVG class names (e.g. `lucide-`, `heroicon-`, `fa-`)
- Icon font references
- Consistent SVG dimensions or viewBox values

### Document Icon Properties

```
- **Library detected**: [name or "custom SVG" or "none detected"]
- **Stroke weight**: [value] (if applicable)
- **Grid size**: [value]
- **Style**: Outlined / Filled / Duo-tone
```

### Sizing Scale

Table with frequency:

```
| Size | Frequency | Use |
```

### Icon-to-Text Alignment

Document alignment patterns.

### Substitution Recommendation

If icons are proprietary or custom, recommend the closest open-source alternative with matching parameters.

**If no icons were detected:** Write a minimal section acknowledging the absence and recommending an icon library that matches the system's visual personality.

---

## Step 19: Generate Section 13 -- Agent Prompt Guide

### Stability Constraint

Agent prompts must ONLY use L1 (Infrastructure) and L2 (System) colors. Never reference L3 (Campaign) or L4 (Content) colors in prompts. Include the following warning in the Quick Color Reference:

```
> **Warning:** Product accent colors (pink, orange, purple, etc.) are content-level (L4) and change per launch cycle. Do not hardcode them in agent prompts or component implementations. Only the colors listed below are stable system tokens.
```

### Quick Color Reference

Flat bullet list of 8-12 colors. No grouping, no personality notes -- fast lookup only. Only L1+L2 colors appear here.

### Self-Containment Checklist

Print the checklist that validates every prompt in this section:

```
Every prompt below satisfies:
- [ ] Font family, size, weight, line-height, letter-spacing specified
- [ ] All colors as hex (never "the primary color")
- [ ] Padding, radius, shadow values included
- [ ] OpenType features included if system uses them
- [ ] Hover/focus state values included
- [ ] Transition values included
```

### Example Component Prompts

Write 5-6 self-contained prompt strings. Each prompt is 100-200 words and MUST be a complete instruction that an AI agent can execute WITHOUT referencing any other section.

**Self-containment checklist for each prompt:**
- Font family name included
- Font size, weight, line-height, letter-spacing all specified
- All colors as hex values (never "the primary color")
- Padding, radius, shadow values included for containers
- OpenType features included if the system uses them
- State variations (hover color, focus ring) where relevant
- Transition values included

Format each prompt as a quoted string inside a bullet.

**Cover these component types at minimum:**
1. Hero section
2. Card component
3. Badge/pill
4. Navigation
5. One system-specific component (workflow pipeline, dark section, command palette, etc.)

### Iteration Guide

6-8 numbered steps. Each step is a concise directive with at least one concrete value.

**Reference anti-patterns:** AP-09 (non-self-contained prompts).

---

## Step 20: Generate Optional Sections 14-17

### Section 14 -- Pattern Compositions

**Include when** the site has distinctive multi-component patterns worth documenting as units. Each pattern gets a `### Pattern Name` heading with component list, layout, spacing, and hierarchy notes.

### Section 15 -- Platform Adaptations

**Include when** the site has distinct treatments for different platforms. Document font substitutions, shadow differences, touch targets, and platform-specific components.

### Section 16 -- Internationalization Notes

**Include when** the site supports multiple languages or uses CJK/RTL text. Document font pairings, line-height adjustments, RTL rules, and text expansion allowances.

### Section 17 -- Design Tokens Dictionary

**Include when** the site uses a formal CSS custom property system with 20+ tokens. Build a flat table of all detected tokens.

**For each optional section:** Only include if the extraction data or screenshots provide sufficient evidence. Do NOT generate speculative content for optional sections. If the data is not there, skip the section entirely.

---

## Step 20.5: Machine Pre-Validation (MANDATORY)

Before the self-audit, run machine-checked validation to catch hallucinated or malformed hex values. This step is non-negotiable -- it runs every time, no exceptions.

### a) Extract all hex colors used in DESIGN.md

```bash
grep -oP '#[0-9a-fA-F]{3,8}\b' output/<domain>/DESIGN.md | sort -u
```

Save this list. Every hex value in the output must be accounted for.

### b) Cross-reference against tokens.json

For each hex value found in the DESIGN.md, verify it exists in one of these two locations in `tokens.json`:

1. `colorTokens[].hex` -- the extracted color token hex values
2. `cssVariables[].value` -- CSS custom property values that resolve to hex

Any hex value NOT found in either source is a **phantom color** and MUST be removed or replaced with the nearest matching token from `tokens.json`. Use Euclidean distance in RGB space to find the nearest token if a replacement is needed.

### c) Find and expand 3-digit hex shortcuts

```bash
grep -oP '#[0-9a-fA-F]{3}\b' output/<domain>/DESIGN.md
```

If any 3-digit hex values are found (e.g. `#000`, `#fff`, `#eee`), expand ALL of them to 6-digit lowercase equivalents (`#000000`, `#ffffff`, `#eeeeee`). Then re-verify the expanded value against tokens.json per step (b).

### d) Fix uppercase hex values

```bash
grep -oP '#[0-9a-fA-F]*[A-F][0-9a-fA-F]*' output/<domain>/DESIGN.md
```

Convert any uppercase hex values to lowercase.

### e) Run validation script and check score

```bash
cd /path/to/dmdg && npx ts-node scripts/validate.ts output/<domain>/DESIGN.md output/<domain>/tokens.json
```

Read the validation score. If the score is **< 80**:

1. Parse the validation output for specific failures
2. Auto-fix each failure (phantom colors, format issues, missing sections)
3. Re-run the validation script
4. Repeat until score >= 80

Only proceed to Step 21 when the machine pre-validation passes with score >= 80.

---

## Step 21: Self-Audit

After generating all sections, perform a systematic self-audit.

### Numerical Accuracy Checks (from quality-checklist.md)

- [ ] **[NA-01]** Cross-reference EVERY hex value in the document against `tokens.json`. Any hex not in the source is a phantom -- remove or replace it.
- [ ] **[NA-04]** All hex values are 6-digit lowercase. Search for uppercase hex or 3-digit shorthand.
- [ ] **[NA-05]** All font-weight values are numeric. Search for `bold`, `normal`, `light`, `medium`, `semibold`.
- [ ] **[NA-07]** All shadow strings are verbatim from extraction. Character-by-character comparison.
- [ ] **[NA-08]** All border-radius values come from extracted data.

### Semantic Correctness Checks

- [ ] **[SC-01]** Color roles match actual usage, not just hue similarity.
- [ ] **[SC-02]** Typography roles match typical HTML element usage.
- [ ] **[SC-05]** Shadow type classification is correct -- zero-blur shadows are borders, not elevation.

### Completeness Checks (v2)

- [ ] **[CP-01]** All 14 core sections present (0-13 + 6.5). Section 2.5 present when `darkMode.supported === true`.
- [ ] **[CP-02]** Minimum 8 colors documented with frequency counts and usage breakdowns.
- [ ] **[CP-03]** Typography table has 12+ rows with Features column.
- [ ] **[CP-04]** At least 3 component types documented with Use: lines and state rationale.
- [ ] **[CP-05]** Hover/focus states documented for interactive components.
- [ ] **[CP-06]** Brand Context has 3-5 personality adjectives with design rationale.
- [ ] **[CP-07]** Content & Voice has real copy examples from the site.
- [ ] **[CP-08]** Accessibility Contract has contrast ratio table with 5+ rows.
- [ ] **[CP-09]** State Matrix has 4+ component rows x 5 state columns.
- [ ] **[CP-10]** Iconography section identifies the icon system or documents absence.
- [ ] **[CP-11]** Motion System documents philosophy and reduced-motion policy.
- [ ] **[CP-12]** Agent prompt guide has 5+ self-contained examples.
- [ ] **[CP-13]** Colors split into Brand Colors and Structural Colors.
- [ ] **[CP-14]** Typography includes font substitution notes for proprietary fonts.
- [ ] **[CP-15]** Named design principles in Section 1.
- [ ] **[CP-16]** Comparative framing in Section 1 prose.
- [ ] **[CP-17]** Border radius has frequency counts.
- [ ] **[CP-18]** Spacing system has frequency counts.
- [ ] **[CP-19]** Dark Mode System (Section 2.5) has full variable mapping table, strategy name, and comparative observation when `darkMode.supported === true`.

### Description Quality Checks

- [ ] **[DQ-01]** Zero banned words in descriptive prose.
- [ ] **[DQ-02]** Opening sentence is differentiating (passes "3 other sites" test).
- [ ] **[DQ-03]** Named design principles are present (not just descriptions).
- [ ] **[DQ-04]** Comparative framing present ("Unlike...", "Where others...").
- [ ] **[DQ-05]** State change rationale on all hover/focus/active lines.
- [ ] **[DQ-06]** Voice examples are real quotes from the site, not invented.
- [ ] **[DQ-07]** At least 3 Don'ts that would surprise a reader.
- [ ] **[DQ-08]** All agent prompts are self-contained.
- [ ] **[DQ-09]** No transition filler phrases ("Let's look at...", "In this section...").
- [ ] **[DQ-10]** Personality sentences describe visual quality, not emotion.

### Anti-Pattern Checks

Read through the full anti-pattern catalog and verify:

- [ ] **AP-01** No phantom colors (every hex traceable to source)
- [ ] **AP-02** No generic descriptions (no banned adjectives without supporting values)
- [ ] **AP-03** Semantic roles match usage frequency, not hue assumptions
- [ ] **AP-04** Interactive elements have hover + focus states
- [ ] **AP-06** Consistent format (lowercase hex, numeric weights, px units)
- [ ] **AP-08** Every Don't includes a measurable threshold
- [ ] **AP-09** Agent prompts are self-contained with inline values
- [ ] **AP-10** Zero-blur box-shadows separated from elevation shadows
- [ ] **AP-12** Color names encode function, not just hue + index
- [ ] **AP-14** One canonical name per token, consistent across all sections
- [ ] **AP-16** Prose after tables adds context, not repetition
- [ ] **AP-20** Detected CSS framework named and mapped to output values

Fix any violations found before proceeding.

---

## Step 22: Publication Quality Gate

Run these five final tests. If any test fails, revise the relevant section before proceeding.

### Test 1: Differentiation

Remove the site name from the DESIGN.md mentally. Read the atmosphere section. Can you still identify which site this describes? If the description could apply to three or more other tech sites, rewrite it with more specific observations, unique metaphors, and site-specific values.

### Test 2: Actionability

Pick 3 random items from the Do's and Don'ts section. For each, ask: "Is this self-contained and executable? Could someone write correct CSS from this single bullet point alone?" If any item requires looking up values elsewhere in the document, revise it to include those values inline.

### Test 3: Self-Containment

Pick 1 agent prompt at random. Imagine copying ONLY that prompt into a fresh AI chat with no other context. Would the AI produce a component that visually matches the original site? If the prompt references "the primary color" or "standard spacing" without values, it fails. Revise to include all values inline.

### Test 4: Voice Authenticity

Read Section 7 (Content & Voice). Are ALL voice examples real quotes from the site, or were any invented? Any invented copy must be replaced with actual observed copy. If insufficient copy was observed, reduce the examples rather than fabricate.

### Test 5: Accessibility Completeness

Read Section 9 (Accessibility Contract). Does the contrast ratio table have calculated ratios, or placeholder text? Are focus indicators documented per component type? If any subsection says "not observed" for more than 3 items, flag this as a data gap in the output.

---

## Step 23: Run Validation Script

**Command:**

```bash
cd /path/to/dmdg && npx ts-node scripts/validate.ts output/<domain>/DESIGN.md output/<domain>/tokens.json
```

The validation script checks:
- Structural completeness (all required sections present)
- Hex value traceability (all hex values exist in tokens.json)
- Format consistency (lowercase hex, numeric weights)
- Minimum counts (colors, typography rows, components, prompts)
- Anti-pattern detection (banned words, non-self-contained prompts)
- v2 section requirements (Brand Context, Content & Voice, Accessibility, State Matrix, Iconography, Motion System)

**Read the validation output.** Fix any failures or warnings. Re-run until the score is >= 95.

If specific failures cannot be resolved (e.g., a value the validator flags as phantom but you intentionally derived from an RGBA conversion), document the exception in a comment at the top of the DESIGN.md.

---

## Step 24: Generate preview.html

Create an HTML file that demonstrates all design tokens visually. This file serves two purposes: visual verification against the original site, and a standalone reference for the design system.

### File Structure

The preview.html has two major sections:

**Demo Section** -- Shows the design system in action:
- Hero section with headline, subtitle, and CTA buttons
- Feature cards in a grid layout
- Navigation bar mock
- Badge/pill examples
- Footer section

**Reference Section** -- Exhaustive token display:
- Color palette swatches with hex labels
- Typography scale with every level rendered at its actual size/weight
- Component showcase (every button variant, card variant, badge variant)
- Spacing scale visualization
- Shadow/depth scale visualization
- Border radius scale visualization
- State matrix visual (loading, error, disabled, empty states)
- Icon sizing visualization (if icon data exists)

### Styling Rules

- Style the preview using ONLY values from the DESIGN.md
- Use the exact font families documented (link Google Fonts or use fallbacks)
- If the font is proprietary, use the documented substitution and note it in a comment
- Apply the exact shadow, border-radius, and spacing values
- Include documented hover/focus states via CSS `:hover` and `:focus-visible`
- Include a `prefers-reduced-motion` media query if motion data exists

### Dark Mode Preview

If dark mode overrides exist, include a toggle using CSS custom properties.

---

## Step 25: Final Output

**Auto-generate all deliverables:**

```bash
# Preview
cd /path/to/dmdg && npx ts-node scripts/preview-gen.ts output/<domain>/tokens.json output/<domain>/

# Report (includes validation + proof data if available)
cd /path/to/dmdg && npx ts-node scripts/report-gen.ts output/<domain>/tokens.json output/<domain>/ output/<domain>/DESIGN.md

# Fidelity proof (captures live site, compares pixel-level)
cd /path/to/dmdg && npx ts-node scripts/proof.ts <URL> output/<domain>/tokens.json output/<domain>/

# Re-generate report with proof data embedded
cd /path/to/dmdg && npx ts-node scripts/report-gen.ts output/<domain>/tokens.json output/<domain>/ output/<domain>/DESIGN.md
```

**Then open the report for the user:**

```bash
open output/<domain>/report.html
```

Confirm all files are present:

| File | Required | Description |
|------|----------|-------------|
| `DESIGN.md` | Yes | The complete v2 design system document |
| `tokens.json` | Yes | Extracted design tokens |
| `report.html` | Yes | Quality report + fidelity proof + DESIGN.md viewer |
| `preview.html` | Yes | Visual token preview |
| `screenshots/` | Yes | Site screenshots at 5 viewports |

Display a summary to the user:

```
Generation complete for [SiteName] (v2 format).

Quality: [score]/100 | Fidelity: [coverage]%
Sections: [N]/14 core + [N] optional | Colors: [N] | Typography: [N] levels | Components: [N] types

Key characteristics:
- [2-3 most distinctive design traits]

New in v2:
- Brand Context: [1 personality adjective]
- Content Voice: [1 tone descriptor]
- Accessibility: [WCAG level] inferred
- State Matrix: [N] components x 5 states
- Iconography: [library name or "none detected"]

report.html opened in browser.
DESIGN.md ready -- copy from report or use directly.
```

---

## User Interaction Points

**Default: NONE.** Run Steps 1-25 autonomously without stopping.

Only pause if:
- Extraction fails after 2 retries (Step 1)
- CAPTCHA blocks access (Step 1)
- Validation score < 60 (Step 23) -- show failures, auto-fix, re-validate

Do NOT ask "should I continue?" between sections. Do NOT show intermediate tokens.json contents. The user wants the finished DESIGN.md, not a play-by-play.

---

## Error Handling Reference

| Error | Detection | Response |
|-------|-----------|----------|
| Anti-bot protection | 403/429 status, empty page content | Wait 5 seconds, retry with stealth mode if available. After 2 failures, inform user. |
| Page timeout | Script timeout or partial load | Increase timeout to 60s and retry. If still failing, try with `--no-javascript` for CSS-only extraction. |
| CORS-blocked CSS | External stylesheets return empty | Note in DESIGN.md limitations section. Proceed with whatever CSS was accessible. |
| Insufficient data | < 8 colors or < 6 typography levels | Suggest user provide additional page URLs for deeper extraction. |
| Dark mode incomplete | Some dark mode tokens missing | Document what is available. Add note: "Dark mode extraction was partial." |
| CAPTCHA | Screenshot shows challenge page | Inform user. Skip that page. Proceed with data from other pages. |
| Proprietary fonts | Font files blocked or DRM-protected | Document the font family name, fallbacks, and substitution recommendation. Note in README. |
| Dynamic styles | Styles loaded via JavaScript after render | Re-run extraction with `--wait-for css`. Some runtime-injected styles may not be capturable. |
| No content data | Button labels and copy text not captured | Sections 7 and 11 will be sparse. Acknowledge gaps explicitly. Do not invent copy text. |
| No icon data | No icon system detected in extraction | Section 12 will be minimal. Acknowledge absence and recommend compatible library. |
| No accessibility data | No ARIA or focus data captured | Section 9 contrast table can still be calculated from color data. Document gaps honestly. |

---

## Multi-Product Output

When `designBoundary` is `shared-foundation`:

### Base DESIGN.md

Contains ONLY tokens shared across all products/sections:
- Common color palette (shared backgrounds, text colors, borders)
- Shared typography (font families, base scale)
- Common component styles (if any)
- Shared layout constraints (max-width, base spacing)

### Product DESIGN.md Files

Each product file (`DESIGN-<product>.md`):
- Opens with: `> Extends [Base DESIGN.md](./DESIGN.md). Only overrides and additions are documented below.`
- Documents ONLY tokens that differ from or add to the base
- Uses the same section numbering (skip sections with no overrides)
- References base values by name when showing what changed

### Consistency Rules

- Terminology MUST be consistent across all files.
- Section structure is identical across all files.
- Cross-file references use relative markdown links.

---

## File Header Format

Every generated DESIGN.md begins with exactly three HTML comment lines:

```
<!-- Generated: YYYY-MM-DD | Source: https://example.com | Pages: N | Framework: name|none | Format: v2 -->
<!-- This is not the official design system. Colors, fonts, and spacing may not be 100% accurate. -->
<!-- Generated by design-md-generator (https://github.com/jasonhnd/design-md-generator) -->
```

Followed by a blank line and:

```
# Design System: SiteName
```

---

## Global Formatting Rules

These rules apply across ALL sections of the DESIGN.md:

### Values
- **Hex colors**: Always 6-digit lowercase (`#533afd`, never `#533AFD` or `#53a`)
- **Font weights**: Always numeric (`300`, `400`, `500`, `600`, `700`). Never `light`, `regular`, `medium`, `semibold`, `bold`
- **Sizes**: Primary unit is `px` with rem equivalent: `48px (3.00rem)`. Two decimal places for rem.
- **CSS values**: Always in backticks: `rgba(0,0,0,0.08)`, `#171717`, `"ss01"`, `box-shadow`
- **Font names**: Always in backticks: `Geist`, `sohne-var`, `SourceCodePro`
- **CSS property names**: Always in backticks: `font-feature-settings`, `letter-spacing`

### Text
- **Em-dash** (`--` in markdown source) separates description from technical detail in bullet items
- **No consecutive blank lines.** Maximum one blank line between elements.
- **Section headings** (`##`) preceded by exactly one blank line
- **Subsection headings** (`###`) preceded by exactly one blank line
- No transition phrases: never write "Let's look at...", "In this section, we'll explore...", "Now let's move on to...", "As we can see...", "It's worth noting..."

### Structure
- Sections numbered with period: `## 0.`, `## 1.`, through `## 13.`
- Section 6.5 uses `## 6.5.`
- Optional sections: `## 14.`, `## 15.`, `## 16.`, `## 17.`
- No table of contents
- No YAML front-matter beyond the three HTML comment lines
- File ends with a newline

### Tables
- Standard markdown pipe syntax
- Header row followed by separator row with dashes
- Empty cells use a single dash (`-`) or are left blank

### Overall Length
- Target: 400-650 lines total (core sections only)
- Under 350 indicates missing detail
- Over 700 indicates redundancy -- tighten prose and remove restatements
- Optional sections 14-17 may add 50-150 lines each

---

## Writing Quality Reference

When writing any prose in the DESIGN.md, follow these principles:

**Voice:** Write like a senior design systems engineer explaining a system to a peer who will implement it tomorrow. The reader already knows CSS, typography, and color theory. Never explain fundamentals.

**Density:** Every sentence must carry at least one piece of information that would change how someone implements the design. If a sentence could be deleted without losing implementation guidance, delete it.

**Value embedding:** Values must be woven into prose, not listed as standalone facts. "The aggressive negative letter-spacing (-2.4px at display sizes) creates text that feels minified for production" -- not "Letter spacing: -2.4px."

**Paragraph density:** Each prose paragraph should contain 2-4 concrete values. Zero values = opinion. One value = observation. Two to four values = documentation.

**No restating tables:** If a value appears in a table, do not repeat it in adjacent prose unless the prose adds NEW information (rationale, relationship to another value, historical context).

**Deletion test:** Read every sentence. Ask "If I delete this, does the reader lose implementation-relevant information?" If no, delete it.
