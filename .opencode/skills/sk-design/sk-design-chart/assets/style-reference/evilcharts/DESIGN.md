# evilcharts — Style Reference
> Neutral paper, one saturated accent per series, nothing decorative behind the data

**Theme:** light

evilcharts is a chart component library built on shadcn's tokens. Its language is a near-white
canvas, near-black ink and a hairline grey rule, with all of the colour spent on the series
themselves: five saturated chart hues that appear nowhere else in the interface. Chrome is
deliberately colourless, so a figure's only saturated marks are the ones carrying data. Corners sit
at a single 8.4px radius with a four-step ladder derived from it, and every figure is set in a
grotesque with a monospace reserved for numerals and code. The dark theme re-chooses its five chart
hues rather than lightening the light ones, which is the decision worth borrowing.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#ffffff` | `--background` | Page and card ground — pure white, the flattest possible backdrop for saturated marks |
| Surface | `#f8f8f8` | `--surface` | Raised panel and sidebar ground, one step off the canvas |
| Wash | `#f5f5f5` | `--muted` | Muted and secondary fills, the quietest occupied surface |
| Highlight | `#f2f2f2` | `--code-highlight` | Emphasised row inside a code block or table |
| Chalk | `#e8e8e8` | `--sidebar-accent` | Selected navigation ground |
| Rule | `#e5e5e5` | `--border` | Hairline borders, dividers and input outlines |
| Path | `#dfdfdf` | `--path` | Gridlines and axis paths inside a figure — one step below the rule so structure gives way to data |
| Halo | `#a1a1a1` | `--ring` | Focus ring |
| Slate | `#747474` | `--code-number` | Line numbers and the quietest legible label |
| Ash | `#484848` | `--muted-foreground` | Secondary text, axis ticks and captions |
| Ink | `#0a0a0a` | `--foreground` | Primary text and the primary action fill — near-black, never pure |
| Graphite | `#0b0b0b` | `--primary` | Primary button ground, a shade off the text ink |
| Flame | `#f54900` | `--chart-1` | First series — the orange that opens every multi-series figure |
| Teal | `#009689` | `--chart-2` | Second series — the cool counterweight to Flame |
| Deep | `#104e64` | `--chart-3` | Third series — the darkest chart hue, reads at small sizes |
| Gold | `#ffb900` | `--chart-4` | Fourth series — bright amber, intended for fills rather than thin strokes |
| Amber | `#fe9a00` | `--chart-5` | Fifth series — between Flame and Gold |
| Alarm | `#e32d36` | `--destructive` | Destructive action and error state; not a series colour |
| Pitch | `#090909` | `--background` (dark) | Dark canvas — the ground the dark chart set is chosen against |
| Snow | `#fafafa` | `--foreground` (dark) | Primary text on the dark ground |
| Slab | `#171717` | `--card` (dark) | Card ground on the dark theme, one step off the canvas |
| Cobalt | `#1447e6` | `--chart-1` (dark) | First series on the dark ground — the blue that opens a dark multi-series figure |
| Jade | `#00bc7d` | `--chart-2` (dark) | Second series on the dark ground |
| Violet | `#ad46ff` | `--chart-4` (dark) | Fourth series on the dark ground; the one hue that carries a slot on both |
| Rose | `#ff2056` | `--chart-5` (dark) | Fifth series on the dark ground |

## Tokens — Typography

### Geist Sans — Primary typeface for headings, body, navigation and every figure label. A neutral grotesque chosen so nothing in the type competes with the series colour; weights stay at 400 and 500 and headlines carry no bold. · `--font-geist-sans`
- **Substitute:** Inter, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 16px, 20px, 24px, 32px
- **Line height:** 1.20–1.60
- **Letter spacing:** 0 at body, tightening to -0.02em above 24px
- **Role:** Primary typeface for headings, body, navigation and every figure label.

### JetBrains Mono — Monospace for every number a reader compares: tooltip values, axis figures, table cells, code and metadata. Tabular figures are the reason it exists here, so a column of numbers aligns on the decimal. · `--font-jetbrains-mono`
- **Substitute:** ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 13px
- **Line height:** 1.40
- **OpenType features:** `"tnum"`
- **Role:** Monospace for numerals, code and metadata — the technical voice.

### Inter — Secondary sans carried for documentation prose alongside the primary grotesque · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial
- **Weights:** 400, 500
- **Sizes:** 14px, 16px
- **Role:** Secondary sans for documentation prose.

### Type Scale

| Step | Size | Line height | Use |
|------|------|-------------|-----|
| caption | 12px | 1.40 | Axis ticks, legend labels, captions |
| body | 14px | 1.50 | Body copy and table cells |
| lead | 16px | 1.50 | Card subtitles |
| title | 20px | 1.30 | Card headlines |
| display | 32px | 1.20 | Page headings |

## Tokens — Spacing & Shapes

### Spacing Scale

| Step | Value |
|------|-------|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 6 | 24px |
| 8 | 32px |

### Border Radius

| Element | Value |
|---------|-------|
| inputs | 4.4px |
| buttons | 6.4px |
| cards | 8.4px |
| tiles | 8.4px |
| modals | 12.4px |

### Shadows

| Level | Value |
|-------|-------|
| flat | none — surfaces separate by a hairline border, not by elevation |
| raised | 0 1px 2px rgba(0, 0, 0, 0.05) |

### Layout

| Property | Value |
|----------|-------|
| Sidebar breakpoint | 940px |
| Figure ground | Flat; no pattern, texture or image behind a plot |

## Dark Theme

The dark ground is `#090909` with `#fafafa` ink and `#a1a1a1` for secondary text. The five chart
hues are **re-chosen, not lightened**: Cobalt, Jade, Amber, Violet and Rose replace the light set
rather than deriving from it. Only Amber appears in both, and it moves from fifth position on paper
to third on ink. Both sets sit in the colour table above, because both are tokens this reference
ships. Measured against the two grounds at the 3:1 a mark needs, four clear on both — Flame, Teal,
Violet and Rose. Deep and Cobalt clear only on white, and Gold, Amber and Jade only on ink, so
neither set on its own offers four hue-separated candidates for both themes. That is the decision this
reference is worth reading for: a hue that carries a slot on a white ground cannot always reach the
lightness that slot needs on a dark one, so the set is re-picked per ground.

## Do's and Don'ts

- **Do** spend colour only on the marks. Chrome here is grey by construction, and a figure whose
  axis, rule and labels are neutral leaves the series as the only saturated thing on the page.
- **Do** set every number in the monospace with tabular figures, so a column aligns.
- **Don't** put a pattern, texture or gradient wash behind a plot. The ground is flat.
- **Don't** read Gold or Amber as thin strokes on white. Measured against this reference's own
  canvas they reach 1.72:1 and 2.13:1, below the 3:1 a mark needs; they are fill colours here.
