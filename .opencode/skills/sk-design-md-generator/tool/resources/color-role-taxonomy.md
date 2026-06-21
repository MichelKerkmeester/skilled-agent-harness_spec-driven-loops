# Color Role Taxonomy

Reference for assigning semantic roles to extracted color values. Use this taxonomy to transform raw hex values into a meaningful, structured palette.

---

## Semantic Role Definitions

### primary
- **Definition**: The dominant brand/action color used for primary interactive elements and key visual anchors.
- **Typical uses**: Primary buttons, active navigation items, primary links, progress indicators, selected states.
- **Identification signals**:
  - CSS variable patterns: `--color-primary`, `--brand`, `--accent` (when only one accent exists), `--btn-primary`
  - Frequency: Appears on the most prominent interactive elements across multiple pages
  - Properties: `background-color` on buttons, `color` on links, `border-color` on active inputs
- **Confused with**: `accent` (accent supplements primary; primary carries the core brand identity and is used more frequently)

### secondary
- **Definition**: A supporting color used for less prominent interactive elements or secondary visual emphasis.
- **Typical uses**: Secondary/outline buttons, category tags, secondary navigation highlights, supporting illustrations.
- **Identification signals**:
  - CSS variable patterns: `--color-secondary`, `--btn-secondary`, `--brand-secondary`
  - Frequency: Used less than primary but more than accent; often appears alongside primary as a visual pair
  - Properties: `background-color` on secondary buttons, `border-color` on secondary controls
- **Confused with**: `primary` (secondary is always subordinate in visual weight) or `accent` (secondary has a broader role than accent)

### accent
- **Definition**: A high-contrast color used sparingly for emphasis, highlights, and drawing attention to specific elements.
- **Typical uses**: Badges, notification dots, promotional banners, hover highlights, decorative elements.
- **Identification signals**:
  - CSS variable patterns: `--accent`, `--highlight`, `--color-accent`, `--pop`
  - Frequency: Low frequency but high visual impact; often a saturated or complementary hue
  - Properties: `background-color` on badges/chips, `border-left` or `border-bottom` for emphasis lines
- **Confused with**: `primary` (accent is used sparingly for emphasis, primary is the workhorse) or `highlight` (highlight is for text/content emphasis, accent is for UI elements)

### background
- **Definition**: The base page background color that defines the overall canvas.
- **Typical uses**: `<body>` background, main content area background, full-bleed section backgrounds.
- **Identification signals**:
  - CSS variable patterns: `--bg`, `--background`, `--color-bg`, `--page-bg`
  - Frequency: Applied to the largest surface area; typically the lightest (light mode) or darkest (dark mode) color
  - Properties: `background-color` on `body`, `html`, or main wrapper elements
- **Confused with**: `surface` (surface is a raised layer above background; background is the base canvas)

### surface
- **Definition**: The background color for content containers that sit on top of the page background.
- **Typical uses**: Cards, panels, modals, sidebar backgrounds, form containers.
- **Identification signals**:
  - CSS variable patterns: `--surface`, `--card-bg`, `--panel-bg`, `--color-surface`
  - Frequency: Second most common background color after `background`
  - Properties: `background-color` on cards, panels, and container elements; often paired with a shadow
- **Confused with**: `background` (surface is elevated above background) or `surface-raised` (surface-raised is a further elevation above surface)

### surface-raised
- **Definition**: A higher-elevation surface color for elements that float above standard surfaces.
- **Typical uses**: Dropdown menus, popovers, tooltips, modal overlays, hover-revealed panels.
- **Identification signals**:
  - CSS variable patterns: `--surface-raised`, `--surface-elevated`, `--popover-bg`, `--dropdown-bg`
  - Frequency: Less common than surface; appears on overlay/floating elements
  - Properties: `background-color` on dropdowns, tooltips, popovers; always paired with higher shadows
- **Confused with**: `surface` (surface-raised has a higher shadow/elevation and often a slightly different tint)

### text-primary
- **Definition**: The default body text color with highest contrast against the background.
- **Typical uses**: Body paragraphs, headings, primary labels, navigation text.
- **Identification signals**:
  - CSS variable patterns: `--text`, `--text-primary`, `--color-text`, `--foreground`
  - Frequency: Most frequently used text color across the site
  - Properties: `color` on `body`, `p`, `h1`-`h6`, `label` elements
- **Confused with**: `text-secondary` (text-primary has the highest contrast; text-secondary is deliberately lower)

### text-secondary
- **Definition**: A lower-contrast text color for supporting or supplementary content.
- **Typical uses**: Subtitles, meta information, timestamps, helper text, breadcrumbs.
- **Identification signals**:
  - CSS variable patterns: `--text-secondary`, `--text-muted`, `--text-subtle`, `--muted-foreground`
  - Frequency: Second most common text color
  - Properties: `color` on `<small>`, `.subtitle`, `.meta`, `.helper-text` elements
- **Confused with**: `text-muted` (text-secondary is readable supporting text; text-muted is deliberately de-emphasized to near-invisible)

### text-muted
- **Definition**: The lowest-contrast text color, used for content that should be visible but not compete for attention.
- **Typical uses**: Placeholder text, disabled labels, footnotes, watermarks, input placeholders.
- **Identification signals**:
  - CSS variable patterns: `--text-muted`, `--text-disabled`, `--placeholder`, `--text-tertiary`
  - Frequency: Least common text color; used on low-priority content
  - Properties: `color` on `::placeholder`, `.disabled`, `.footnote` elements
- **Confused with**: `text-secondary` (text-muted has noticeably lower contrast; borderline WCAG compliance)

### text-inverted
- **Definition**: Text color for use on dark/colored backgrounds where the default text color would be unreadable.
- **Typical uses**: Text on primary-colored buttons, text on dark hero sections, text on colored banners.
- **Identification signals**:
  - CSS variable patterns: `--text-inverted`, `--text-on-primary`, `--text-on-dark`
  - Frequency: Appears wherever colored or dark backgrounds are used
  - Properties: `color` on elements with `background-color` set to primary/dark values
- **Confused with**: `background` (text-inverted is typically white or near-white but is a text role, not a surface role)

### border
- **Definition**: The default border color for subtle element separation.
- **Typical uses**: Card borders, input borders, table cell borders, divider lines, separator rules.
- **Identification signals**:
  - CSS variable patterns: `--border`, `--border-color`, `--divider`, `--separator`
  - Frequency: Very high; appears on most bordered elements
  - Properties: `border-color`, `outline-color`, `border-bottom` on dividers
- **Confused with**: `border-strong` (default border is subtle/low-contrast; strong is higher contrast for emphasis)

### border-strong
- **Definition**: A higher-contrast border color for elements requiring stronger visual separation.
- **Typical uses**: Active input borders, focused element outlines, section dividers, table headers.
- **Identification signals**:
  - CSS variable patterns: `--border-strong`, `--border-emphasis`, `--border-active`
  - Frequency: Lower than default border; appears on active/focused states
  - Properties: `border-color` on `:focus` states, strong dividers, emphasized containers
- **Confused with**: `border` (border-strong has noticeably higher contrast) or `focus` (focus ring is specifically for keyboard focus indication)

### link
- **Definition**: The color for inline text links, distinct from surrounding body text.
- **Typical uses**: Inline hyperlinks, "Read more" links, breadcrumb links, footer links.
- **Identification signals**:
  - CSS variable patterns: `--link`, `--link-color`, `--color-link`
  - Frequency: Moderate; appears on all `<a>` elements in content areas
  - Properties: `color` on `a` elements; often has a distinct `:hover` shade
- **Confused with**: `primary` (link color often matches primary but serves a different semantic role; link is for text navigation, primary is for UI actions)

### focus
- **Definition**: The color used for keyboard focus indicators (focus rings, outlines).
- **Typical uses**: Focus rings on buttons, input focus outlines, focused card borders, skip-link indicators.
- **Identification signals**:
  - CSS variable patterns: `--focus`, `--focus-ring`, `--outline-color`, `--ring`
  - Frequency: Appears only on `:focus-visible` or `:focus` states
  - Properties: `outline-color`, `box-shadow` (as focus ring), `border-color` on `:focus` state
- **Confused with**: `primary` (focus may match primary hue but is a distinct accessibility concern) or `border-strong` (border-strong is static; focus is state-dependent)

### destructive
- **Definition**: The color signaling destructive, dangerous, or error states.
- **Typical uses**: Delete buttons, error messages, form validation errors, destructive action confirmations, alert banners.
- **Identification signals**:
  - CSS variable patterns: `--destructive`, `--error`, `--danger`, `--red`, `--color-error`
  - Frequency: Low; appears only in error/danger contexts
  - Properties: `background-color` on error alerts, `color` on error text, `border-color` on invalid inputs
- **Confused with**: `warning` (destructive signals actual danger/errors; warning signals caution without immediate danger)

### success
- **Definition**: The color indicating successful completion, positive state, or confirmation.
- **Typical uses**: Success toast messages, completed step indicators, valid input borders, positive metrics.
- **Identification signals**:
  - CSS variable patterns: `--success`, `--green`, `--color-success`, `--positive`
  - Frequency: Low; appears only in success/confirmation contexts
  - Properties: `background-color` on success alerts, `color` on success text/icons, `border-color` on valid inputs
- **Confused with**: `primary` (if primary happens to be green) or `info` (info is neutral notification; success is affirmative)

### warning
- **Definition**: The color indicating caution, pending action, or attention-needed states.
- **Typical uses**: Warning banners, pending status badges, expiring items, cautionary form hints.
- **Identification signals**:
  - CSS variable patterns: `--warning`, `--yellow`, `--caution`, `--color-warning`
  - Frequency: Low; amber/yellow tones in notification contexts
  - Properties: `background-color` on warning alerts, `color` on warning text/icons
- **Confused with**: `accent` (if accent is warm-toned) or `destructive` (warning is cautionary; destructive is critical/error)

### info
- **Definition**: The color for neutral informational messages and non-urgent notifications.
- **Typical uses**: Info banners, help tooltips, informational badges, neutral status indicators.
- **Identification signals**:
  - CSS variable patterns: `--info`, `--color-info`, `--notice`
  - Frequency: Low; blue tones in notification contexts (distinct from primary blue if applicable)
  - Properties: `background-color` on info banners, `color` on info icons
- **Confused with**: `primary` (info is for notifications/status; primary is for actions) or `link` (info is a status color; link is for navigation)

### highlight
- **Definition**: The color used to draw attention to specific content within text or data.
- **Typical uses**: Search result highlights, selected text, new/updated badges, promotional callouts.
- **Identification signals**:
  - CSS variable patterns: `--highlight`, `--mark`, `--selection`, `--color-highlight`
  - Frequency: Very low; appears in search contexts or content emphasis
  - Properties: `background-color` on `<mark>`, `::selection`, search result highlight spans
- **Confused with**: `accent` (highlight is for content emphasis; accent is for UI element emphasis) or `warning` (yellow highlight vs yellow warning)

### overlay
- **Definition**: The semi-transparent color used for backdrop overlays behind modals, drawers, and lightboxes.
- **Typical uses**: Modal backdrops, drawer overlays, lightbox backgrounds, loading screen overlays.
- **Identification signals**:
  - CSS variable patterns: `--overlay`, `--backdrop`, `--scrim`, `--color-overlay`
  - Frequency: Very low; appears only when overlay elements are active
  - Properties: `background-color` with alpha (rgba/hsla), applied to full-viewport overlay elements
- **Confused with**: `background` (overlay is always semi-transparent and layered above content; background is opaque and behind content)

---

## Role Assignment Priority

When assigning a semantic role to an extracted color, evaluate evidence in this order. Higher priority signals override lower ones.

1. **CSS variable name carries semantic meaning** (strongest) -- `--color-primary` maps directly to `primary`; `--bg-surface` maps to `surface`. Trust the variable name unless it is demonstrably wrong (e.g., `--primary` appears on a single decorative element but never on buttons or links).

2. **Framework convention** -- If a known framework is detected, use its naming convention. Tailwind: `bg-primary`, `text-muted-foreground`. shadcn/ui: `--primary`, `--destructive`, `--muted`. MUI: `palette.primary.main`, `palette.error.main`. Chakra: `colorScheme` prop values.

3. **Usage frequency + context combination** -- Count how often the color appears and in what context. Most frequent `background-color` on interactive elements = likely `primary`. Most frequent `color` on body text = likely `text-primary`. A color appearing only on error states = likely `destructive`.

4. **Visual position on page** (weaker) -- CTA button background suggests `primary`. Header/nav bar color may indicate `primary` or `surface`. Footer text color may indicate `text-secondary` or `text-muted`.

5. **Color hue alone** (weakest, never use alone) -- Red does not automatically mean `destructive` (it could be a brand color). Blue does not automatically mean `primary` (it could be `info` or `link`). Gray does not automatically mean `text-muted` (it could be `text-primary` in a low-contrast system).

---

## Recommended Grouping Order for DESIGN.md Output

When presenting the final color palette in the design system document, use this ordering:

1. **Primary** -- The main brand/action color
2. **Secondary / Accent** -- Supporting brand colors
3. **Workflow / Branding** -- Additional brand-specific colors (gradient endpoints, illustration palette)
4. **Interactive** -- Link, focus, destructive (colors tied to interaction states)
5. **Neutral Scale** -- text-primary, text-secondary, text-muted, text-inverted
6. **Surface** -- background, surface, surface-raised
7. **Shadows** -- Box shadow color values if extracted
8. **Semantic** -- success, warning, info, highlight
9. **Console / Code** -- Syntax highlighting colors if present (keyword, string, comment, etc.)
10. **Gradients** -- Document as complete gradient definitions, not individual color stops

Within each group, order from most prominent/saturated to least.

---

## Ambiguity Resolution

When a color could reasonably be assigned to multiple roles:

1. **Check usage count.** The role with the highest usage count wins.
2. **Check element types.** Buttons/controls suggest interactive roles; text elements suggest text roles; backgrounds suggest surface roles.
3. **Assign the more specific role.** If a color could be `primary` or `link`, and it appears on both buttons and inline links, assign `primary` (the broader role) and note that link color matches primary.
4. **Document the ambiguity.** If genuinely unclear, assign the most likely role and add a note: "Also used as [alternative role]."
5. **Never leave a frequently-used color unassigned.** Every color that appears more than incidentally must have a role.

---

## Frequency Interpretation by Role

Each color role has an expected frequency range. Deviations from these expectations are design signals worth narrating.

| Role | Expected frequency | What high frequency means | What low/zero frequency means |
|---|---|---|---|
| primary | Moderate-high (appears on all CTAs, key links) | Brand-heavy system; primary color carries the identity | Achromatic system; brand color is accent-only |
| secondary | Moderate (less than primary, more than accent) | Multi-brand system with visual pairing | Single-brand system; secondary role may not exist |
| accent | Low (badges, highlights, special emphasis) | System uses chromatic variety for differentiation | System relies on weight/size hierarchy, not color |
| background | Dominant (largest surface area) | Standard -- this IS the canvas | Dark mode or gradient-based system without a single background |
| surface | High (cards, panels, containers) | Card-heavy, modular layout | Flat design without layered surfaces |
| text-primary | Dominant (most text on the page) | Standard reading experience | Display-only system (rare) |
| text-secondary | Moderate (meta, labels, helpers) | Information-dense UI with clear hierarchy | Minimal UI with binary text treatment (on/off) |
| border | High (separators, input outlines, card edges) | Structured, compartmentalized layout | Shadow-as-border system or borderless design |
| destructive | Low (only in error/danger contexts) | Standard -- danger signals are rare by design | System omits explicit error styling (flag this as a gap) |
| success/warning/info | Low (status indicators only) | Standard -- semantic colors are situational | System uses a single color for all status (document this) |

### Narrating frequency deviations

When an extracted frequency deviates from the expected range, narrate the deviation:

> "The `primary` blue appears on only 3% of elements -- far below the typical primary frequency. This system treats its brand color as an accent, not a foundation. The real primary is the achromatic scale."

> "The `border` role has zero occurrences of CSS `border` properties. Instead, 47 elements use `box-shadow: 0 0 0 1px` as border substitute. The system's border philosophy is shadow-native."

---

## Brand vs Structural Color Classification

Not all colors serve the same strategic purpose. Classify each color as **Brand** or **Structural** to help the DESIGN.md reader understand which colors are negotiable (structural) and which are identity-critical (brand).

### Brand colors

Colors that define the company's visual identity. Changing them changes the brand.

- Primary brand hue and its tints/shades
- Secondary brand hue (if part of the brand identity, not just a UI convenience)
- Gradient endpoints that appear in the logo or marketing
- Any color specified in brand guidelines

**Identification signals:**
- Appears in the logo or favicon
- Used consistently across marketing site, app, and printed materials
- Matches a specific Pantone or brand spec

### Structural colors

Colors that serve functional or UI-architectural purposes. They could change without changing the brand.

- Neutral text scale (text-primary, text-secondary, text-muted)
- Surface and background colors
- Border and divider colors
- Semantic status colors (success, warning, destructive, info)
- Focus ring color (unless it matches the brand color)
- Shadow tint colors

**Identification signals:**
- Serves a functional UI role (readability, separation, status)
- Similar across many different brands (most neutrals, most status colors)
- Would be replaced in a white-label scenario

### Documentation format

In the DESIGN.md color section, group or tag colors:

```markdown
### Brand Colors
- **Stripe Purple** (`#533afd`) — [brand] Primary identity color, CTA backgrounds

### Structural Colors
- **Text Primary** (`#0a2540`) — [structural] Body text, headings
- **Surface** (`#f6f9fc`) — [structural] Card and panel backgrounds
```

---

## CSS Variable Naming Conventions

When the extracted data contains CSS custom properties, document the naming convention to help implementers maintain consistency.

### Common naming patterns

| Pattern | Example | Framework signal |
|---|---|---|
| `--color-{role}` | `--color-primary`, `--color-surface` | Custom / vanilla CSS |
| `--{role}` | `--primary`, `--destructive`, `--muted` | shadcn/ui, Radix Themes |
| `--{component}-{property}` | `--btn-bg`, `--card-border` | Component-scoped tokens |
| `--{scale}-{step}` | `--gray-100`, `--blue-500` | Palette-scale systems (Tailwind-like) |
| `--{semantic}-{variant}` | `--text-primary`, `--bg-surface` | Semantic token layer |

### What to document

1. **The naming convention itself** -- which pattern the system uses
2. **The token layer** -- whether tokens are primitive (raw values) or semantic (role-based aliases)
3. **Dark mode strategy** -- whether dark mode swaps token values or uses separate token names
4. **Any inconsistencies** -- naming deviations that break the pattern (document as potential tech debt)

### Example documentation block

```markdown
## CSS Variable Naming

Convention: `--{category}-{role}` (semantic layer over a `--{hue}-{step}` primitive layer)
Dark mode: Same variable names, values swapped via `.dark` class on `<html>`
Inconsistency: `--accent` exists alongside `--color-accent`; likely legacy alias
```
