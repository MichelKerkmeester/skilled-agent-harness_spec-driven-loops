# Patch — Style Reference
> electric blueprint on drafting paper

**Theme:** light

Patch uses a loud, electric-blue blueprint aesthetic: a vivid indigo canvas (#1f00ff) alternates with stark white cards, and every interface element either lives inside a crisp hairline border or against the full-bleed blue. Typography is aggressive and condensed — PP Right at weight 800 with sub-1.0 line heights makes headlines feel architectural rather than friendly, while Archivo keeps body text quiet and functional. A single warm orange (#ff622b) punctures the blue/white duopoly as the only fill color used for primary actions. Hand-drawn line illustrations (sketchy people, objects) sit centered inside white cards, reinforcing a 'marketing blueprint' mood. The overall feel is a confident, slightly retro-tech agency identity — medical marketing pitched as engineering, not healthcare.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Indigo | `#1f00ff` | `--color-electric-indigo` | Full-bleed hero canvas, section backgrounds, heading text on light surfaces, all primary borders and dividers — the single chromatic color that defines the entire system |
| Patch Orange | `#ff622b` | `--color-patch-orange` | Filled CTA buttons and active nav markers — the only warm color, reserved exclusively for conversion moments |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, hero reverse text, card surfaces, icon fills — the neutral that makes the indigo vibrate |
| Fog Gray | `#f2f2f2` | `--color-fog-gray` | Secondary card surfaces, subtle elevation between cards and canvas |
| Bone | `#f8f8f8` | `--color-bone` | Tertiary card backgrounds, muted surface layer |
| Mist | `#ececec` | `--color-mist` | Input backgrounds, hairline borders on light sections, disabled states |
| Gridline | `#d3d3d3` | `--color-gridline` | Major section dividers, muted heading accents, structural borders on the blue canvas |
| Ink | `#212121` | `--color-ink` | Primary body text, dark card backgrounds, button borders — near-black with a slight warmth |

## Tokens — Typography

### PP Right — All display headings, hero text, section titles, and the bold '01' section markers. The tight sub-1.0 line height at 800-weight is the signature — headlines stack like concrete blocks, not flowing prose. Substitute: Bebas Neue for similar industrial condensed feel, or Anton for heavier display weight · `--font-pp-right`
- **Weights:** 400, 800
- **Sizes:** 12, 13, 14, 19, 21, 24, 29, 33, 38, 48, 62, 67, 90, 95, 133, 152, 200
- **Line height:** 0.79–1.20 for display, 1.57–2.00 for small
- **Letter spacing:** 0.02–0.05em across all sizes, consistent moderate tracking
- **OpenType features:** `"ss01" on (if available in substitute) for alternate character forms`
- **Role:** All display headings, hero text, section titles, and the bold '01' section markers. The tight sub-1.0 line height at 800-weight is the signature — headlines stack like concrete blocks, not flowing prose. Substitute: Bebas Neue for similar industrial condensed feel, or Anton for heavier display weight

### Archivo — Body copy, navigation, buttons, footer text, captions, form inputs. Weight 300 for subtle secondary text, 400 for body, 600 for small uppercase labels and nav. The low x-height and geometric forms keep it quiet against PP Right's display dominance · `--font-archivo`
- **Substitute:** Inter or DM Sans as drop-in alternatives
- **Weights:** 300, 400, 600
- **Sizes:** 10, 11, 13, 14, 17, 19, 23, 24, 29, 38
- **Line height:** 1.00–2.00
- **Letter spacing:** 0.0100em, 0.0200em, 0.0310em, 0.0500em, 0.1000em
- **Role:** Body copy, navigation, buttons, footer text, captions, form inputs. Weight 300 for subtle secondary text, 400 for body, 600 for small uppercase labels and nav. The low x-height and geometric forms keep it quiet against PP Right's display dominance

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 17px | 1.4 | — | `--text-body` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading-sm | 38px | 0.94 | — | `--text-heading-sm` |
| heading | 62px | 0.9 | — | `--text-heading` |
| heading-lg | 90px | 0.86 | — | `--text-heading-lg` |
| display | 133px | 0.85 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 17 | 17px | `--spacing-17` |
| 19 | 19px | `--spacing-19` |
| 21 | 21px | `--spacing-21` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 33 | 33px | `--spacing-33` |
| 35 | 35px | `--spacing-35` |
| 38 | 38px | `--spacing-38` |
| 48 | 48px | `--spacing-48` |
| 90 | 90px | `--spacing-90` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 5px |
| inputs | 5px |
| buttons | 5px |
| navTabs | 5px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24-38px
- **Element gap:** 11-24px

## Components

### Full-Bleed Hero Section
**Role:** Opening viewport with maximum brand impact

Background #1f00ff covering full viewport. Headline in PP Right 800 at 90–133px, line-height 0.85, color #ffffff, uppercase. Optional faint gridline overlay using #d3d3d3 at 20% opacity. White sketch illustration centered below headline in a #ffffff card with 5px radius and 1px #1f00ff border.

### Filled Orange CTA Button
**Role:** Primary conversion action — only filled button in the system

Background #ff622b, text #ffffff in Archivo 600 uppercase at 13–14px, letter-spacing 0.03em. Padding 10px 24px. Radius 5px. No shadow. Hover deepens to #e54f1f. This is the ONLY filled chromatic button — every other interactive element is outlined or text.

### Ghost White CTA Button
**Role:** Secondary action on the indigo hero

Transparent background, 1px #ffffff border, text #ffffff in Archivo 600 uppercase at 13px. Padding 10px 24px. Radius 5px. Sits on the #1f00ff hero canvas.

### Tabbed Navigation Toggle
**Role:** Mode switcher in the header (Patch OG / Patch AI)

Container: 1px #ffffff border, 5px radius, transparent fill on #1f00ff canvas. Two equal-width tabs. Active tab: #ffffff background, #1f00ff text. Inactive tab: transparent, #ffffff text. PP Right or Archivo 600 at 13px uppercase.

### Numbered Section Header
**Role:** Section markers and in-content anchors

Two-digit number (01, 02, 03…) in PP Right 800 at ~29px, color #1f00ff on light sections, #ffffff on indigo sections. Often placed in a small bordered box (1px border, 5px radius) or as a standalone element with a 01–04 progression. Paired with a heading in the same or larger PP Right weight.

### White Illustration Card
**Role:** Showcase container for sketch-style artwork

Background #ffffff, 1px #1f00ff border, 5px radius, padding ~24–38px. Contains a centered black-line sketch illustration (no fill, 1–2px stroke). Sits on either the #1f00ff hero canvas or a #f2f2f2 surface.

### Pricing Tier Card
**Role:** Service plan comparison — Beginner, Intermediate, Advanced

Background #ffffff, 1px #d3d3d3 border, 5px radius. Tier name in PP Right 800 at 24–29px uppercase, color #1f00ff. Commitment text in Archivo 400 at 14px, color #212121. Contains a filled orange INQUIRE button. Three cards arranged in a 3-column grid on a #f2f2f2 surface.

### Promise Sidebar
**Role:** Sticky left-column note on scrolled content

1px #1f00ff border, 5px radius, padding 17px. Title in Archivo 600 uppercase at 13px, color #1f00ff. Body in Archivo 400 at 14px. Two small icon buttons (camera, smile) in the top-right corner of the card.

### Feature List Row
**Role:** Numbered capability list with hover state

Each row: 1px #d3d3d3 left/top border, padding 14–17px vertical. Small '01'–'04' marker in a bordered square. Heading in PP Right 800 uppercase, 24–38px. Inactive rows show heading in #d3d3d3 (muted). Active/hovered row: heading in #1f00ff, border in #1f00ff. Transition is instant — no animation.

### Square Corner Marker
**Role:** Decorative section corner indicator with number

Small square (~40–50px) with 1px #1f00ff border on light sections, #ffffff border on indigo sections. Contains a two-digit number in PP Right 800. Positioned absolutely in the top-right of sections as a structural anchor.

### Input Field
**Role:** Form input on light surfaces

Background #ffffff, 1px #ececec border, 5px radius. Padding 11px vertical, 14px horizontal. Text in Archivo 400 at 14px, color #212121. Placeholder in #d3d3d3. Focus ring: 1px #1f00ff.

### Social Proof Icon Cluster
**Role:** Footer/hero trust indicators

Small 32–40px square icons with 1px #1f00ff border, 5px radius, white background. Black glyph or letter inside. Arranged horizontally with 5–10px gap.

## Do's and Don'ts

### Do
- Use #1f00ff as the dominant chromatic — backgrounds, borders, headings, links. It should appear in nearly every section.
- Use PP Right 800 with line-height 0.85–0.94 for all display headings. Never set PP Right body copy at body sizes — it's a display face only.
- Use #ff622b exclusively for filled CTA buttons. No other element should use a filled chromatic background.
- Use 1px borders in #1f00ff (on light) or #ffffff (on indigo) to define all card and button edges. Shadows are absent — borders carry the structural weight.
- Use 5px border-radius consistently across buttons, cards, inputs, and tabs. Do not introduce larger or smaller radii.
- Pair every section with a two-digit square corner marker (01, 02, 03…) as a structural anchor.
- Use Archivo 400 for body, 300 for secondary muted text, 600 for uppercase labels and buttons.

### Don't
- Do not use filled blue (#1f00ff) buttons — the CTA is always orange. Blue is for canvas and borders only.
- Do not set PP Right body text below 21px — its tight tracking and heavy forms become illegible at small sizes.
- Do not add drop shadows. The system uses borders, not elevation, to define surfaces.
- Do not introduce colors outside the indigo/orange/white/grayscale palette. No greens, purples, or pastels.
- Do not use rounded corners beyond 5px. The slightly sharp radius is part of the blueprint/architectural feel.
- Do not use light or thin weights (100–200) for any text — the system lives at 300/400/600/800 only.
- Do not center body text. Headlines can center; body copy and feature descriptions are always left-aligned.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background on light sections |
| 1 | Bone Card | `#f8f8f8` | Subtle card elevation on light sections |
| 2 | Fog Card | `#f2f2f2` | Secondary card surface, pricing tier containers |
| 3 | Indigo Field | `#1f00ff` | Full-bleed hero, alternating dark sections, blueprint canvas |
| 4 | Ink Plate | `#212121` | Dark-mode cards or inverted sections if introduced |

## Imagery

Hand-drawn black-line sketch illustrations are the sole visual content — no photography, no 3D, no gradients. Illustrations are flat, single-weight line art (1–2px stroke), often depicting people in casual poses (walking, standing), objects (magnifying glass, net, baseball cap), or abstract symbols. They sit centered inside white cards with 1px indigo borders, always on either the full-bleed indigo hero or a light gray section. The sketch style is intentionally loose and human — it softens the aggressive blue typography and signals approachability. Icons throughout the site are small, square, bordered containers with simple black glyphs. No image-heavy sections, no lifestyle photography, no product screenshots.

## Layout

Full-bleed alternating sections: the hero is a 100vw indigo field, then sections alternate between #ffffff and #f2f2f2 light bands, with occasional return to full-bleed #1f00ff. Content is max-width ~1200px centered. The hero is a single full-screen statement with centered headline and illustration. Feature sections use a 2-column layout — a sticky left sidebar (the Promise card) and a right content column with numbered list rows. Pricing uses a 3-column card grid. A 2-column split (text-left, illustration-right or vice versa) appears in mid-page sections. Vertical rhythm is spacious with ~80px between major sections. Navigation is a simple top bar with logo left, tabbed toggle center, and orange CTA right. The gridline pattern on the indigo background creates a subtle drafting-paper texture without using actual grid images.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #212121
- Background: #ffffff
- Border: #1f00ff (on light) / #ffffff (on indigo)
- Accent: #ff622b (CTA fills only)
- Brand canvas: #1f00ff
- primary action: #ff622b (filled action)

**Example Component Prompts**
1. **Full-bleed indigo hero**: Background #1f00ff, full viewport. Headline in PP Right 800 at 90px, line-height 0.85, color #ffffff, uppercase. Centered. Below: a 400×400px white card with 1px #1f00ff border and 5px radius containing a centered black-line sketch illustration.
2. Create a Primary Action Button: #ff622b background, #212121 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
3. **Numbered feature row**: 1px #d3d3d3 top border, padding 17px. '01' marker in a 40px square with 1px #d3d3d3 border, text in PP Right 800 at 14px, color #1f00ff. Heading in PP Right 800 at 24px, color #d3d3d3 (inactive) or #1f00ff (active).
4. **Ghost button on indigo**: Transparent background, 1px #ffffff border, 5px radius, padding 10px 24px. Text in Archivo 600 at 13px uppercase, color #ffffff, letter-spacing 0.03em.
5. **Input field**: Background #ffffff, 1px #ececec border, 5px radius, padding 11px 14px. Text in Archivo 400 at 14px, color #212121. Focus: border becomes 1px #1f00ff.

**Color System Philosophy**
This is a two-color system: #1f00ff carries all brand identity, #ff622b is a single conversion accent. White and a 4-step gray scale handle all structural surfaces. Do not introduce additional chromatic colors.

## Similar Brands

- **Linear** — Same aggressive condensed display type paired with a single vivid accent color and hairline-border component style
- **Vercel** — Full-bleed dark/light section alternation, tight line-height display headings, and a minimal palette with one strong accent
- **Frame.io** — Bold display typography with near-1.0 line heights, numbered section markers, and a blueprint-style structural grid
- **Cargo (agency site)** — Sketch illustration aesthetic, bordered white cards on saturated color fields, and a single warm CTA accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-indigo: #1f00ff;
  --color-patch-orange: #ff622b;
  --color-pure-white: #ffffff;
  --color-fog-gray: #f2f2f2;
  --color-bone: #f8f8f8;
  --color-mist: #ececec;
  --color-gridline: #d3d3d3;
  --color-ink: #212121;

  /* Typography — Font Families */
  --font-pp-right: 'PP Right', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 17px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 38px;
  --leading-heading-sm: 0.94;
  --text-heading: 62px;
  --leading-heading: 0.9;
  --text-heading-lg: 90px;
  --leading-heading-lg: 0.86;
  --text-display: 133px;
  --leading-display: 0.85;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-35: 35px;
  --spacing-38: 38px;
  --spacing-48: 48px;
  --spacing-90: 90px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24-38px;
  --element-gap: 11-24px;

  /* Border Radius */
  --radius-md: 4.7619px;
  --radius-lg: 9.52381px;

  /* Named Radii */
  --radius-cards: 5px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;
  --radius-navtabs: 5px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-bone-card: #f8f8f8;
  --surface-fog-card: #f2f2f2;
  --surface-indigo-field: #1f00ff;
  --surface-ink-plate: #212121;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-indigo: #1f00ff;
  --color-patch-orange: #ff622b;
  --color-pure-white: #ffffff;
  --color-fog-gray: #f2f2f2;
  --color-bone: #f8f8f8;
  --color-mist: #ececec;
  --color-gridline: #d3d3d3;
  --color-ink: #212121;

  /* Typography */
  --font-pp-right: 'PP Right', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-archivo: 'Archivo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 17px;
  --leading-body: 1.4;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 38px;
  --leading-heading-sm: 0.94;
  --text-heading: 62px;
  --leading-heading: 0.9;
  --text-heading-lg: 90px;
  --leading-heading-lg: 0.86;
  --text-display: 133px;
  --leading-display: 0.85;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-33: 33px;
  --spacing-35: 35px;
  --spacing-38: 38px;
  --spacing-48: 48px;
  --spacing-90: 90px;

  /* Border Radius */
  --radius-md: 4.7619px;
  --radius-lg: 9.52381px;
}
```
