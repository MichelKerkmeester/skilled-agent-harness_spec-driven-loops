# DESIGN.md Writing Style Guide

Writing quality standard for publication-level DESIGN.md files. Every rule here is derived from what separates the best DESIGN.md files (Vercel, Stripe, Linear, Notion) from the forgettable ones.

---

## 1. Overall Tone

Write like a senior design systems engineer explaining a system to a peer who will implement it tomorrow. The reader already knows CSS, typography, and color theory -- never explain fundamentals.

**Voice characteristics:**
- Precise but not dry. Opinions are welcome when backed by observable evidence.
- Technical but not jargon-heavy. Prefer concrete values over abstract concepts.
- Confident but not promotional. The writing describes what IS, not what the marketing team wishes it were.
- Dense. Every sentence must carry at least one piece of information that would change how someone implements the design. If a sentence could be deleted without losing implementation guidance, delete it.

**Audience model:** A frontend engineer who has 30 minutes to absorb a design system before building a component. They need values, rationale, and traps to avoid -- not inspiration or motivation.

---

## 2. Banned Words

NEVER use these words in descriptive prose. They communicate nothing specific and signal that the writer ran out of things to observe:

`clean`, `modern`, `sleek`, `professional`, `user-friendly`, `intuitive`, `elegant`, `beautiful`, `stunning`, `gorgeous`, `polished`, `refined`, `sophisticated`, `seamless`, `cutting-edge`, `state-of-the-art`, `next-generation`, `innovative`, `revolutionary`, `world-class`, `premium` (when used as a vague adjective rather than a pricing tier), `crisp`, `delightful`, `lovely`, `nice`, `simple` (when used approvingly without specifics)

**The replacement rule:** Every banned word is a placeholder for a specific observation you have not yet made. Find the observation.

| Banned phrase | What to write instead |
|---|---|
| "clean design" | "gallery-like emptiness where section padding exceeds 80px and the only color signal comes from three workflow-specific accents" |
| "modern typography" | "Inter Variable at weight 510 with OpenType `cv01` and `ss03` -- a between-weight that creates emphasis without the heaviness of traditional medium" |
| "sleek interface" | "near-black canvas (`#08090a`) where content emerges through four luminance steps of semi-transparent white backgrounds" |
| "professional color palette" | "achromatic system with a single chromatic accent (`#5e6ad2`) reserved exclusively for interactive elements" |
| "intuitive layout" | "single-column hero with 80-120px vertical padding, collapsing to 2-3 column card grids at the feature section level" |
| "elegant shadows" | "multi-layer shadow stacks where blue-tinted `rgba(50,50,93,0.25)` sits at 30px offset while neutral `rgba(0,0,0,0.1)` sits closer at 18px, creating parallax depth" |

---

## 3. Opening Paragraph Rules

The opening paragraph is ONE sentence. It must do three things simultaneously:

1. **Capture the design system's essence** -- not its parameters, but its personality and position
2. **Use a unique metaphor or precise framing** that makes this system distinguishable from every other
3. **Let a reader who has never seen the site form a mental image** that would survive comparison with the real thing

### What the opening is NOT

- A parameter list: "Uses Inter font, dark backgrounds, and purple accents."
- A compliment: "A beautifully designed system that showcases modern web design."
- A category label: "A minimalist dark-mode design system."

### What the opening IS

An essence capture -- one sentence that makes someone say "I know exactly what this looks like."

### Examples from reference files

> "Vercel's website is the visual thesis of developer infrastructure made invisible -- a design system so restrained it borders on philosophical."

> "Stripe's website is the gold standard of fintech design -- a system that manages to feel simultaneously technical and luxurious, precise and warm."

> "Linear's website is a masterclass in dark-mode-first product design -- a near-black canvas (`#08090a`) where content emerges from darkness like starlight."

> "Notion's website embodies the philosophy of the tool itself: a blank canvas that gets out of your way."

### Structure pattern

`[Subject]'s website is [unique framing] -- [elaboration that adds a second dimension or tension]`

The em-dash separates the macro observation from the micro insight. The elaboration should introduce a contradiction or tension that makes the system interesting: "simultaneously technical and luxurious," "so restrained it borders on philosophical," "a blank canvas that gets out of your way."

### Opening paragraph test

Ask: "Could this sentence describe three other websites?" If yes, it fails. An opening must be so specific that swapping it onto a different site would feel wrong.

---

## 4. Layered Expansion (Paragraphs 2-4)

After the opening sentence, the atmosphere section expands through three distinct zoom levels. Each paragraph MUST include at least two concrete values (hex codes, pixel values, font weights, opacity numbers) as supporting evidence.

### Paragraph 2: Macro -- Color and Space

What does the overall canvas feel like? What is the dominant color relationship? How much space exists between elements?

> "The page opens on a clean white canvas (`#ffffff`) with deep navy headings (`#061b31`) and a signature purple (`#533afd`) that functions as both brand anchor and interactive accent. This isn't the cold, clinical purple of enterprise software; it's a rich, saturated violet that reads as confident and premium."

Note: two hex codes, one personality sentence about the purple, one contrast with what it is NOT.

### Paragraph 3: Meso -- Typography Character and Mood

What font defines the system? What makes its usage distinctive? What is the typographic personality?

> "The custom sohne-var variable font is the defining element of Stripe's visual identity. Every text element enables the OpenType `ss01` stylistic set, which modifies character shapes for a distinctly geometric, modern feel. At display sizes (48px-56px), sohne-var runs at weight 300 -- an extraordinarily light weight for headlines that creates an ethereal, almost whispered authority."

Note: font name, OpenType feature, specific size range, specific weight, personality description ("whispered authority"), and a contrast with convention ("the opposite of the bold hero headline convention").

### Paragraph 4: Micro -- Unique Technique or Decision

What single technical decision makes this system different from its peers? This should be something a developer would not guess without reading the DESIGN.md.

> "What distinguishes Vercel from other monochrome design systems is its shadow-as-border philosophy. Instead of traditional CSS borders, Vercel uses `box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08)` -- a zero-offset, zero-blur, 1px-spread shadow that creates a border-like line without the box model implications."

Note: names the technique, provides the exact CSS value, and explains the architectural reason (box model implications).

### Paragraph test

Each paragraph should be deletable without making the others incomprehensible, but their combined effect should be a complete picture: canvas > letterforms > signature technique.

---

## 5. Key Characteristics Format

Each key characteristic follows a strict two-part structure joined by an em-dash:

```
- [Design intent / what it achieves] -- [implementation parameters / how to do it]
```

The front half tells you WHY. The back half tells you WHAT. Neither half works alone.

### Good key characteristics

```
- Geist Sans with extreme negative letter-spacing (-2.4px to -2.88px at display) -- text as compressed infrastructure
- Shadow-as-border technique: `box-shadow 0px 0px 0px 1px` replaces traditional borders throughout
- Weight 300 as the signature headline weight -- light, confident, anti-convention
- Dark-mode-native: `#08090a` marketing background, `#0f1011` panel background, `#191a1b` elevated surfaces
```

### Bad key characteristics

```
- Uses a nice dark color palette (no values, no contrast, "nice" is banned)
- The font is Inter (no weight, no features, no personality)
- Has good spacing (no values, no philosophy)
- Borders are thin (how thin? what technique? why?)
```

### Quantity

8-12 key characteristics. Fewer means you missed something. More means you are listing parameters instead of characteristics. A characteristic is a parameter + its design significance.

---

## 6. Color Descriptions

Every color entry needs three components:

1. **Identity**: Name, hex value, CSS variable if applicable
2. **Role**: Where it appears and what it does
3. **Personality**: One sentence about why this specific color was chosen and what it feels like

### Good color descriptions

> **Deep Navy** (`#061b31`): Primary heading color. Not black, not gray -- a very dark blue that adds warmth and depth to text.

> **Marketing Black** (`#010102` / `#08090a`): The deepest background -- the canvas for hero sections and marketing pages. Near-pure black with an imperceptible blue-cool undertone.

> **Warm White** (`#f6f5f4`): Background surface tint, section alternation, subtle card fill. The yellow undertone is key.

### Bad color descriptions

> **Primary** (`#533afd`): Used for buttons. (No personality, no context about what makes this purple distinctive)

> **Background** (`#ffffff`): White background. (Restating the hex value in words adds zero information)

> **Text** (`#171717`): Text color. (No explanation of why it is not pure black, which is the interesting decision)

### The personality sentence

This sentence answers: "If I showed someone two purples and asked which one is Stripe's, what would they look for?" It should describe visual quality, not emotional reaction. "Rich, saturated violet" tells you something measurable. "Beautiful purple" does not.

---

## 7. Value Embedding

Design values (font sizes, letter-spacing, weights, hex codes, opacity values) must be woven into prose. They never stand alone as facts.

### The rule

A value without context is a spec sheet entry. A value inside a sentence that explains its effect is design documentation.

### Good value embedding

> "The aggressive negative letter-spacing (-2.4px at display sizes) creates text that feels minified for production."

> "The 510 weight sits between regular and medium, creating a subtle emphasis that doesn't shout."

> "Individual shadow layer opacity never exceeds 0.05, producing ambient occlusion that feels like natural light rather than computer-generated depth."

### Bad value embedding

> "Letter spacing: -2.4px. This creates compression."

Two sentences where one would do. The value and its effect are separated, making the reader do assembly work.

> "The letter-spacing is -2.4px."

A fact with no consequence. Why should someone care that it is -2.4px? What does -2.4px produce that -1px or -0.5px does not?

> "Font size: 48px, Weight: 600, Line height: 1.00, Letter spacing: -2.4px"

A parameter dump. This belongs in a table, not in prose. Prose exists to explain what tables cannot: the relationships between parameters and the reasons behind choices.

### Where values DO stand alone

Tables, component specs, and agent prompt guides. These are reference contexts where scanability matters more than narrative. In those contexts, every value should be present and findable. In prose sections, values are evidence for claims.

---

## 8. Do's and Don'ts Quality

The Do's and Don'ts section is where most DESIGN.md files fail. Generic advice wastes the reader's time. Every entry must pass the specificity test.

### Don'ts: The Counter-Intuitive Test

A good Don't tells the reader something they would naturally do that is WRONG in this specific system. It should surprise someone who knows CSS and design but does not know this particular system.

**Each Don't needs three components:**
1. What not to do
2. Why it is wrong in THIS system (not in general)
3. What to do instead (with at least one specific value)

### Good Don'ts

> "Don't use weight 600-700 for sohne-var headlines -- weight 300 is the brand voice"

Counter-intuitive: most systems use heavy weights for headlines. The reader would default to 600+ without this warning.

> "Don't skip the inner `#fafafa` ring in card shadows -- it's the glow that makes the elevation system work"

Counter-intuitive: a developer building a card shadow would include the obvious layers (border, elevation) and skip the inner ring because it seems decorative. This Don't explains that it is structural.

> "Don't use solid colored backgrounds for buttons -- transparency is the system (rgba white at 0.02-0.05)"

Counter-intuitive: every instinct says to give buttons a solid background color. Linear's system is built on near-zero opacity.

### Bad Don'ts

> "Don't use too many colors"

No threshold, no alternative, applicable to every design system ever created.

> "Don't forget accessibility"

Not a design system rule. This is a general web development principle.

> "Don't make things too large"

Too large relative to what? No values, no system-specific context.

### Do's: The Implementation Shortcut Test

A good Do gives a reader an implementation shortcut. After reading it, they should be able to write correct CSS faster.

### Good Do's

> "Use shadow-as-border (`0px 0px 0px 1px rgba(0,0,0,0.08)`) instead of traditional CSS borders"

Gives the exact value and names the technique. A developer can copy this into their code immediately.

> "Use `#171717` instead of `#000000` for primary text -- the micro-warmth matters"

Names both the correct value AND the common mistake, with a one-phrase rationale.

---

## 9. Agent Prompt Guide

Agent prompts must be SELF-CONTAINED. A developer copies one prompt into an AI tool and gets a correct component without needing the rest of the DESIGN.md.

### Requirements

- **Complete hex values** for every color mentioned
- **Font family, size, weight, and line-height** for every text element
- **Letter-spacing** where the system uses non-default tracking
- **Padding, radius, and shadow values** for every container or interactive element
- **OpenType features** if the system uses them
- **100-200 words each** -- long enough to be complete, short enough to fit in a prompt window

### Good agent prompt

> "Create a hero section on white background. Headline at 48px Geist weight 600, line-height 1.00, letter-spacing -2.4px, color #171717. Subtitle at 20px Geist weight 400, line-height 1.80, color #4d4d4d. Dark CTA button (#171717, 6px radius, 8px 16px padding) and ghost button (white, shadow-border rgba(0,0,0,0.08) 0px 0px 0px 1px, 6px radius)."

Every value is present. No lookups required.

### Bad agent prompt

> "Create a hero section using the brand colors and primary font. Make the headline large and the subtitle smaller. Add a primary and secondary button."

Every value is missing. The AI tool would guess, and every guess would be wrong.

### Prompt coverage

Include prompts for at least:
- Hero section
- Card component
- Badge/pill
- Navigation
- One system-specific component (workflow pipeline, command palette, dark section)

---

## 10. Information Density

### The deletion test

Read every sentence. Ask: "If I delete this, does the reader lose implementation-relevant information?" If no, delete it.

### Banned transition phrases

Never write:
- "Let's look at..."
- "In this section, we'll explore..."
- "Now let's move on to..."
- "As we can see..."
- "It's worth noting that..."
- "It's important to mention..."
- "Another key aspect is..."

These phrases exist in drafts. They do not exist in published technical writing. They add words without adding information.

### No restating tables

If a value appears in a table, do not repeat it in the prose below the table unless the prose adds NEW information about that value (rationale, relationship to another value, historical context).

### Paragraph density target

Each paragraph in the atmosphere section should contain 2-4 concrete values (hex codes, pixel values, weights, opacities). A paragraph with zero values is an opinion. A paragraph with one value is an observation. A paragraph with 2-4 values is documentation.

---

## 11. Ten Good/Bad Writing Comparisons

### 1. Atmosphere Description

**BAD:**
> "The website has a clean, modern design with a dark color scheme that looks very professional and sleek."

**GOOD:**
> "Linear's website is a masterclass in dark-mode-first product design -- a near-black canvas (`#08090a`) where content emerges from darkness like starlight. The overall impression is one of extreme precision engineering: every element exists in a carefully calibrated hierarchy of luminance, from barely-visible borders (`rgba(255,255,255,0.05)`) to soft, luminous text (`#f7f8f8`)."

**Why the good version works:** Three specific values, a metaphor that communicates visual quality ("starlight"), and a structural observation (luminance hierarchy) instead of a vague adjective.

---

### 2. Color Description

**BAD:**
> "The primary color is a nice shade of purple (#533afd) that is used for buttons and links."

**GOOD:**
> "**Stripe Purple** (`#533afd`): Primary brand color, CTA backgrounds, link text, interactive highlights. A saturated blue-violet that anchors the entire system. This isn't the cold, clinical purple of enterprise software; it's a rich, saturated violet that reads as confident."

**Why the good version works:** Names the color, lists all its roles (not just buttons), provides a personality sentence, and contrasts it with what it is NOT (cold, clinical enterprise purple).

---

### 3. Key Characteristics

**BAD:**
> "- Uses a custom font with negative letter spacing for a modern look"

**GOOD:**
> "- Geist Sans with extreme negative letter-spacing (-2.4px to -2.88px at display) -- text as compressed infrastructure"

**Why the good version works:** Names the font, gives the exact range, and the back-half metaphor ("compressed infrastructure") tells you the design intent in four words.

---

### 4. Do Entry

**BAD:**
> "- Use the correct colors for your design"

**GOOD:**
> "- Use `#171717` instead of `#000000` for primary text -- the micro-warmth matters"

**Why the good version works:** Names both the correct value and the common mistake. A developer who reads this will never accidentally use pure black.

---

### 5. Don't Entry

**BAD:**
> "- Don't use too many font weights"

**GOOD:**
> "- Don't use weight 700 (bold) on body text -- 600 is the maximum, used only for headings"

**Why the good version works:** Gives the exact prohibited weight, the exact maximum allowed weight, and the scope of the rule (body text vs. headings). A developer knows exactly what to check.

---

### 6. Component Documentation

**BAD:**
> "Cards have a white background with subtle shadows and rounded corners for a polished appearance."

**GOOD:**
> "Cards use white background with no CSS border. Shadow stack: `rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, #fafafa 0px 0px 0px 1px`. Radius 8px. Title at 24px Geist weight 600, letter-spacing -0.96px. Body at 16px weight 400, `#4d4d4d`."

**Why the good version works:** Every value is present. A developer can build this card from this description alone without looking at anything else.

---

### 7. Typography Note

**BAD:**
> "The typography creates a nice hierarchy with different sizes and weights that guide the user through the content."

**GOOD:**
> "Three weights, strict roles: 400 (body/reading), 500 (UI/interactive), 600 (headings/emphasis). No bold (700) except for tiny micro-badges. This narrow weight range creates hierarchy through size and tracking, not weight."

**Why the good version works:** Names every weight, assigns each weight a role, states the exception, and explains the architectural principle (hierarchy through size/tracking, not weight).

---

### 8. Layout Description

**BAD:**
> "The layout uses generous whitespace for a clean, breathable feel with well-organized content sections."

**GOOD:**
> "Gallery emptiness: massive vertical padding between sections (80px-120px+). The white space IS the design. Compressed text with aggressive negative letter-spacing on headlines is counterbalanced by vast surrounding whitespace. Section separation comes from borders and spacing alone -- no color variation between sections."

**Why the good version works:** Gives the exact padding range, names the technique ("gallery emptiness"), describes the tension between compressed text and expanded space, and states what is NOT used (no color variation) which is equally important.

---

### 9. Agent Prompt Guide

**BAD:**
> "Create a card component using the design system's colors, typography, and spacing. It should look like the rest of the site."

**GOOD:**
> "Design a card: white background, 1px solid #e5edf5 border, 6px radius. Shadow: rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px. Title at 22px sohne-var weight 300, letter-spacing -0.22px, color #061b31, 'ss01'. Body at 16px weight 300, #64748d."

**Why the good version works:** Every single value needed to build the card is present. The AI tool receiving this prompt has zero ambiguity about any visual property.

---

### 10. Section Opening

**BAD:**
> "In this section, we'll explore the depth and elevation system used throughout the design. Shadows play an important role in creating visual hierarchy."

**GOOD:**
> "Stripe's shadow system is built on a principle of chromatic depth. Where most design systems use neutral gray or black shadows, Stripe's primary shadow color (`rgba(50,50,93,0.25)`) is a deep blue-gray that echoes the brand's navy palette."

**Why the good version works:** No throat-clearing. Immediately states the principle (chromatic depth), names the specific technique (blue-tinted shadows), gives the exact value, and contrasts with the conventional approach.

---

## 12. Shadow Philosophy Pattern

Every DESIGN.md should include a shadow philosophy paragraph. This paragraph answers: "What is the THEORY behind this system's shadow usage?"

### Structure

1. Name the principle (chromatic depth, shadow-as-border, luminance stepping)
2. Contrast with the conventional approach
3. Explain the architectural benefit
4. Provide 1-2 specific values as evidence

### Example

> "Vercel has arguably the most sophisticated shadow system in modern web design. Rather than using shadows for elevation in the traditional Material Design sense, Vercel uses multi-value shadow stacks where each layer has a distinct architectural purpose: one creates the 'border' (0px spread, 1px), another adds ambient softness (2px blur), another handles depth at distance (8px blur with negative spread), and an inner ring (`#fafafa`) creates the subtle highlight that makes the card 'glow' from within."

---

## 13. Section Structure Checklist

Every DESIGN.md section should follow this structure:

| Section | Purpose | Density Target |
|---------|---------|----------------|
| Visual Theme & Atmosphere | Essence + macro/meso/micro expansion | 6-10 values in 4 paragraphs |
| Key Characteristics | Scannable list of system-defining traits | 8-12 items with em-dash format |
| Color Palette & Roles | Complete color inventory with personality | 3 components per color entry |
| Typography Rules | Font stack + hierarchy table + principles | Table + 3-4 principle paragraphs |
| Component Stylings | Copy-paste-ready component specs | Every value present per component |
| Layout Principles | Spacing, grid, whitespace philosophy | Named techniques + values |
| Depth & Elevation | Shadow system table + philosophy paragraph | Table + 1 dense paragraph |
| Do's and Don'ts | Counter-intuitive system-specific rules | 8-10 each, all with values |
| Responsive Behavior | Breakpoints + collapsing strategy | Table + specific px transitions |
| Agent Prompt Guide | Self-contained copy-paste prompts | 5+ prompts at 100-200 words each |

---

## 14. Final Quality Gate

Before publishing a DESIGN.md, run these checks:

- [ ] Opening sentence passes the "could this describe three other sites?" test -- NO
- [ ] Zero banned words in descriptive prose
- [ ] Every paragraph in the atmosphere section has 2+ concrete values
- [ ] Key characteristics use em-dash format with intent + implementation
- [ ] Every color has name + hex + role + personality sentence
- [ ] Values are embedded in prose (not standalone facts) in narrative sections
- [ ] Values are standalone and scannable in tables and component specs
- [ ] Every Don't is counter-intuitive (would surprise a competent developer)
- [ ] Every agent prompt is self-contained (copy-paste ready, no DESIGN.md lookups)
- [ ] No transition phrases ("let's look at," "in this section")
- [ ] No restating of table data in adjacent prose
- [ ] Shadow philosophy paragraph exists and names the principle
- [ ] Information density: no sentence survives the deletion test without losing information

---

## 15. Comparative Framing Pattern

The best DESIGN.md files position the system relative to convention. Comparative framing tells the reader not just what the system does, but what it chose NOT to do -- and that negative space is where design intent lives.

### Sentence templates

- "Where most systems use X, this system uses Y"
- "Unlike the typical approach of X, this system..."
- "This is not the [common thing]; it is [the specific thing]"
- "The conventional choice would be X; here, Y signals [intent]"
- "Rather than defaulting to X, the system [specific verb] Y"

### Good/Bad example pairs

**1. Shadow philosophy**

BAD: "The system uses subtle shadows for depth."

GOOD: "Where most systems use neutral gray shadows, this system tints its elevation shadows with brand navy (`rgba(50,50,93,0.25)`), creating chromatic depth rather than flat Material-style layering."

**2. Typography weight**

BAD: "Headlines use a light weight for a refined look."

GOOD: "Unlike the convention of bold (700) headlines that shout for attention, this system uses weight 300 at display sizes -- whispered authority that trusts its content to carry the page."

**3. Border technique**

BAD: "Borders are implemented with box-shadow."

GOOD: "This is not a traditional CSS border; it is a zero-blur box-shadow (`0 0 0 1px rgba(0,0,0,0.08)`) that achieves a border-like hairline without participating in the box model, preventing the 1px layout shifts that CSS borders cause."

**4. Color palette**

BAD: "The color palette is mostly neutral with one accent."

GOOD: "Rather than the typical SaaS approach of warm gray neutrals with a blue CTA, this system commits to a true achromatic neutral scale (`#171717` to `#fafafa`) and reserves all chromaticity for a single accent (`#5e6ad2`), making every colored pixel a deliberate signal."

**5. Spacing**

BAD: "The system uses generous whitespace."

GOOD: "The conventional 40-60px section spacing would feel timid here. At 80-120px between sections, the whitespace IS the design -- gallery-like emptiness that frames compressed, tightly-tracked headlines as precious objects."

**6. Button design**

BAD: "Buttons have a minimal style."

GOOD: "Where most design systems give buttons solid backgrounds and obvious affordance, this system builds buttons from near-transparent overlays (`rgba(255,255,255,0.04)`) -- the button is barely there until hover reveals it, trusting the user to recognize interactive patterns."

### When to use comparative framing

- Opening paragraphs (1-2 comparisons max)
- Shadow philosophy paragraph
- Typography principles section
- Any key characteristic that contradicts convention
- Do's and Don'ts entries where the "Don't" IS the convention

---

## 16. Named Principle Pattern

Every major design decision should get a memorable name. Unnamed decisions get forgotten. Named decisions become system vocabulary that the team can reference in code reviews, Slack, and PRs.

### Naming formula

**Pattern A:** [adjective] + [noun]
**Pattern B:** [technique]-as-[metaphor]
**Pattern C:** [quality] + [domain]

### 10+ examples across design domains

**Color:**
- **Chromatic depth** -- shadows tinted with brand hue rather than neutral black
- **Achromatic commitment** -- zero chromatic color in the neutral scale; all saturation reserved for accents
- **Single-hue discipline** -- one accent hue across the entire system; no secondary chromatic colors

**Typography:**
- **Whispered authority** -- headline weight 300 at display sizes; light weight as signature
- **Compressed infrastructure** -- extreme negative letter-spacing (-2.4px+) that makes text feel minified for production
- **Bilingual parallelism** -- dual-language text set with identical visual weight and spacing regardless of script

**Shadow:**
- **Shadow-as-border** -- zero-blur box-shadow replaces CSS border throughout the system
- **Ambient occlusion** -- individual shadow layers never exceeding 0.05 opacity; light that feels natural rather than rendered
- **Parallax depth** -- multi-layer shadow stacks where tinted and neutral layers sit at different offsets

**Layout:**
- **Gallery emptiness** -- section spacing exceeding 80px; whitespace as the primary design element
- **Content density polarity** -- compressed text set against vast surrounding whitespace; the tension IS the layout

**Interaction:**
- **Transparency-first affordance** -- interactive elements built from near-zero opacity overlays; the component reveals itself on hover
- **Light weight as signature** -- the system's identity is defined by what it does NOT do (no bold, no heavy shadows, no solid backgrounds)

### How to introduce a named principle

Introduce it in the prose where the observation first appears, then reference it by name in later sections:

> "Stripe's shadow system is built on a principle of **chromatic depth**: where most systems use neutral gray or black shadows, Stripe's primary shadow color (`rgba(50,50,93,0.25)`) is a deep blue-gray that echoes the brand's navy palette."

Later: "The card shadow follows the **chromatic depth** principle established in the elevation section."

---

## 17. Frequency Interpretation Pattern

Frequency data transforms a flat color/shadow/radius list into a narrative of intent. Raw frequency is noise; interpreted frequency is design strategy.

### Interpretation framework

| Frequency tier | What it signals | How to narrate it |
|---|---|---|
| Dominant (>40% of usage) | System default, workhorse, structural backbone | "The system's foundation is X -- it appears on Y% of surfaces and defines the baseline from which all variation departs." |
| Common (15-40%) | Supporting role, secondary structure | "X serves as the structural companion to [dominant], appearing wherever [context]." |
| Moderate (5-15%) | Intentional accent, tactical emphasis | "X is deployed with precision -- frequent enough to feel systemic, rare enough to draw the eye." |
| Rare (<5%) | Exception, special case, reserved signal | "X appears only in [specific context], reserved as a high-salience signal that breaks the dominant pattern." |
| Absent (0% in expected role) | Deliberate omission, conscious refusal | "The absence of X is the design decision. Where most systems would [convention], this system [alternative]." |

### Good frequency narration examples

> "Of the 14 distinct colors extracted, `#171717` accounts for 62% of text usage -- it IS the reading experience. The accent blue (`#5e6ad2`) appears on just 3% of elements, but 100% of those elements are interactive. Frequency reveals intent: the system is achromatic by default, chromatic only by action."

> "`border-radius: 6px` appears on 78% of rounded elements. The system has exactly one other radius value: `9999px` for pills and avatars. This binary radius vocabulary -- sharp rectangle, soft rectangle, or full circle -- eliminates the gradation that creates visual noise in most systems."

> "The `0 0 0 1px rgba(0,0,0,0.08)` shadow appears 4x more frequently than any elevation shadow. This is not a depth system; it is a border system wearing shadow syntax."

### Zero-frequency narration

The most interesting frequency observation is often what is MISSING:

> "No color in the extracted palette falls in the warm spectrum (red, orange, yellow outside of semantic status colors). The absence is deliberate: this is a cool-only brand, and any warm tone introduced by an implementer would violate the system's thermal identity."

---

## 18. Intent Narration Pattern

Intent narration bridges the gap between WHAT a system does and WHY it does it. Every design decision is a choice among alternatives; intent narration names the road not taken.

### Sentence templates

- "The system uses X because Y"
- "[Value] at [context] signals [meaning]"
- "This choice trades [sacrifice] for [benefit]"
- "X over Y because [rationale]"
- "[Observation] -- a deliberate trade of [cost] for [gain]"

### 5+ examples

> "Weight 510 sits between regular (400) and medium (500) -- a micro-emphasis that creates distinction without the visual interruption of a full weight jump. The system trades conventional weight stops for in-between precision."

> "`#171717` instead of `#000000` for primary text signals a system that values reading comfort over maximum contrast. The 2% lightness shift is invisible in isolation but measurable across 2000 words of body copy."

> "Individual shadow layer opacity never exceeds 0.05 -- the system chooses ambient realism over Material-style elevation theatrics. The shadows feel like natural light rather than computer-generated depth."

> "Letter-spacing of -2.4px at display sizes compresses character width by roughly 8%, creating text that feels like infrastructure -- minified, efficient, engineered. The system trades readability at glance for density of meaning."

> "Section padding at 96px vertical when the conventional range is 40-60px -- the system spends screen real estate on emptiness, signaling that the content within each section is complete and self-contained rather than a continuous scroll."

### Intent narration test

Ask: "Does this sentence tell me something I could not infer from looking at the CSS value alone?" If no, the sentence is observation without intent. Add the WHY.

---

## 19. Brand Voice Detection Pattern

When the extracted data includes `sampleTexts` from tokens.json, UI text from buttons, headings, and labels, or microcopy from forms and errors, these are signals of the brand's content voice.

### How to infer tone from sampleTexts

1. **Sentence length**: Short, punchy sentences (3-5 words) signal directness and confidence. Long, qualified sentences signal formality or caution.
2. **Punctuation**: Exclamation marks suggest enthusiasm or consumer-facing energy. Periods-only suggests restraint. Em-dashes and semicolons suggest editorial sophistication.
3. **Person**: "You/your" signals conversational, user-centric voice. "We" signals partnership. Absence of pronouns signals institutional formality.
4. **Jargon density**: Technical terms without explanation signal expert audience. Explained terms signal broader audience.

### How to detect casing conventions from button labels

| Observed pattern | Convention name | Brand signal |
|---|---|---|
| "Get Started" | Title Case | Traditional, corporate, formal |
| "Get started" | Sentence case | Modern, approachable, lowercase-friendly |
| "GET STARTED" | All caps | Commanding, urgent, action-oriented |
| "get started" | All lowercase | Ultra-casual, startup, counter-cultural |
| "はじめる" / "始める" | Localized verb | Japanese-native, not translated |

### How to identify emoji policy

- **Emojis in headings or buttons**: Consumer-facing, playful, younger demographic
- **Emojis in body text only**: Light personality injection, still professional
- **Emojis in documentation/help**: Approachable support tone
- **Zero emojis anywhere**: Formal, enterprise, or conservative brand -- document this as a deliberate absence
- **Emoji as icon substitute**: Functional, not decorative (e.g., checkmark emoji replacing an icon)

### How to distinguish formal vs informal voice

| Signal | Formal | Informal |
|---|---|---|
| Contractions | "do not", "cannot" | "don't", "can't" |
| Error messages | "An error has occurred" | "Something went wrong" |
| Empty states | "No results found" | "Nothing here yet" |
| Button text | "Submit Request" | "Send it" |
| Success messages | "Operation completed successfully" | "Done!" |

### Documentation format

In the DESIGN.md Content & Voice section:

```markdown
## Content & Voice

**Tone**: [adjective], [adjective], [adjective] (e.g., "precise, restrained, institutional")
**Casing**: [Sentence case / Title Case / ALL CAPS] on buttons and headings
**Emoji policy**: [None / Functional only / Decorative in body / Throughout]
**Person**: [Second person "you" / First person plural "we" / Impersonal]
**Sample voice**: "[exact button text]", "[exact heading]", "[exact error message]"
```

---

## 20. Self-Containment Checklist (Agent Prompt Guide)

Every agent prompt must be fully self-contained. The test: "Can an AI agent copy-paste this prompt and build the component with zero lookups into the rest of the DESIGN.md?"

### Required values in every prompt

- [ ] Font family name (exact string, e.g., `"Inter"`, `"sohne-var"`)
- [ ] Font size in px
- [ ] Font weight as numeric value
- [ ] Line-height (unitless ratio or px)
- [ ] Letter-spacing (px or em, including `0` if default)
- [ ] All hex color values for every element (background, text, border, icon)
- [ ] Padding (all sides, shorthand or explicit)
- [ ] Border-radius in px
- [ ] Box-shadow (full CSS value or `none`)
- [ ] Transition (property, duration, easing)
- [ ] OpenType features if the system uses them (`ss01`, `cv01`, etc.)
- [ ] Border (width, style, color) or explicit `none`

### Self-containment test

1. Copy the prompt into a blank AI chat
2. Ask: "Build this component"
3. If the AI asks a clarifying question about any visual property, the prompt fails
4. If the AI guesses any value (defaulting to `border-radius: 8px` because no radius was specified), the prompt fails

### Failure examples and fixes

**FAILS**: "Create a button with the primary brand color" -- which color?
**PASSES**: "Create a button with background `#5e6ad2`, text `#ffffff`"

**FAILS**: "Use the system font at heading size" -- which font, which size?
**PASSES**: "Use Inter at 32px weight 600 line-height 1.2 letter-spacing -0.96px"

**FAILS**: "Add the standard card shadow" -- what is standard?
**PASSES**: "Add shadow `0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.08)`"
