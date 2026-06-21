# Component Taxonomy

Reference for identifying, classifying, and documenting UI components extracted from a live site. Use this taxonomy to produce consistent component documentation in DESIGN.md output.

---

## Standard Component Definitions

### Button
- **DOM signals**: `<button>`, `<a role="button">`, `<input type="submit">`, elements with `cursor: pointer` and `background-color` + `padding` + `border-radius` combination. Class patterns: `.btn`, `.button`, `[class*="cta"]`, `MuiButton`, `chakra-button`.
- **Required properties**: Background color, text color, font size, font weight, padding, border-radius, border (if any), min-height/min-width, box-shadow, transition properties.
- **Required states**: Default, hover, active/pressed, focus-visible, disabled, loading (if present).
- **Common variants**: Primary, secondary, outline/ghost, destructive/danger, icon-only, link-style, size (sm/md/lg).
- **Doc format example**:
  ```
  Button — Primary
  Background: #2563EB | Hover: #1D4ED8 | Active: #1E40AF
  Text: #FFFFFF, 14px, weight 600
  Padding: 10px 20px | Radius: 6px
  Focus: 2px ring #93C5FD offset 2px
  Disabled: opacity 0.5, cursor not-allowed
  Transition: background-color 150ms ease
  ```

### Link
- **DOM signals**: `<a>` with `href`, `color` distinct from surrounding text, optional `text-decoration: underline`. Class patterns: `.link`, `.text-link`, `a:not(.btn)`.
- **Required properties**: Text color, text-decoration (style, offset, thickness), font weight (if different from body).
- **Required states**: Default, hover, visited (if styled), active, focus-visible.
- **Common variants**: Inline, standalone, nav-link, footer-link, breadcrumb, with-icon, external (with icon).
- **Doc format example**:
  ```
  Link — Inline
  Color: #2563EB | Hover: #1D4ED8
  Decoration: underline, offset 2px
  Visited: #7C3AED (if distinct)
  ```

### Input
- **DOM signals**: `<input type="text|email|password|number|search|tel|url">`, `<input>` without type. Class patterns: `.input`, `.form-control`, `.text-field`, `MuiInput`, `MuiTextField`.
- **Required properties**: Background color, text color, placeholder color, border color, border-radius, padding, height, font size, caret color, box-shadow (if used for focus ring).
- **Required states**: Default, hover, focus, filled, error/invalid, disabled, read-only.
- **Common variants**: Text, search (with icon), password (with toggle), number (with stepper), with-prefix, with-suffix, outlined, filled/solid, underlined.
- **Doc format example**:
  ```
  Input — Default
  Background: #FFFFFF | Border: 1px solid #D1D5DB | Radius: 6px
  Text: #111827, 14px | Placeholder: #9CA3AF
  Padding: 8px 12px | Height: 40px
  Focus: border-color #2563EB, ring 0 0 0 3px rgba(37,99,235,0.1)
  Error: border-color #EF4444
  Disabled: background #F9FAFB, opacity 0.6
  ```

### Select
- **DOM signals**: `<select>`, custom dropdowns with `role="listbox"` or `role="combobox"`, elements with chevron/arrow indicator. Class patterns: `.select`, `.dropdown-trigger`, `MuiSelect`.
- **Required properties**: Same as Input, plus chevron/arrow icon, dropdown panel background, panel shadow, panel border-radius, option hover color, selected option indicator, max-height.
- **Required states**: Default, open, focus, disabled, option-hover, option-selected.
- **Common variants**: Native select, custom dropdown, multi-select, searchable/combobox, grouped options.
- **Doc format example**:
  ```
  Select — Custom
  Trigger: inherits Input styles + chevron-down icon #6B7280
  Panel: background #FFFFFF, shadow 0 4px 12px rgba(0,0,0,0.1), radius 8px, max-height 240px
  Option: padding 8px 12px | Hover: background #F3F4F6 | Selected: background #EFF6FF, text #2563EB
  ```

### Textarea
- **DOM signals**: `<textarea>`, `<div contenteditable="true">` with multiline appearance. Class patterns: `.textarea`, `.text-area`, `MuiTextarea`.
- **Required properties**: Same as Input, plus min-height, max-height, resize behavior (none/vertical/horizontal/both), line-height.
- **Required states**: Default, focus, filled, error/invalid, disabled, character-count (if present).
- **Common variants**: Fixed-height, auto-expanding, with-character-count, with-toolbar (rich text).
- **Doc format example**:
  ```
  Textarea — Default
  Inherits Input styling
  Min-height: 80px | Resize: vertical | Line-height: 1.5
  ```

### Card
- **DOM signals**: `<article>`, `<div>` with `border-radius` + `box-shadow` or `border` + internal structure (image/title/body/footer). Class patterns: `.card`, `.panel`, `.tile`, `MuiCard`, `MuiPaper`.
- **Required properties**: Background color, border-radius, border (if any), box-shadow, padding, gap between internal sections, overflow behavior.
- **Required states**: Default, hover (if interactive -- shadow/border/transform changes), selected (if selectable), loading/skeleton.
- **Common variants**: Content card, product card, profile card, stat/metric card, media card (image-heavy), horizontal/vertical layout, elevated, outlined.
- **Doc format example**:
  ```
  Card — Default
  Background: #FFFFFF | Border: 1px solid #E5E7EB | Radius: 12px
  Shadow: 0 1px 3px rgba(0,0,0,0.06)
  Padding: 24px | Gap: 16px between sections
  Hover (if interactive): shadow 0 4px 12px rgba(0,0,0,0.1), translateY(-2px)
  ```

### Navigation
- **DOM signals**: `<nav>`, `<header>` containing links/buttons, `role="navigation"`, `role="menubar"`. Class patterns: `.navbar`, `.nav`, `.header`, `.sidebar`, `.top-bar`.
- **Required properties**: Background color, height/width, padding, link color, active item indicator (underline/background/border), logo size and placement, spacing between items, position (fixed/sticky/static), backdrop-filter (if glassmorphism).
- **Required states**: Default, sticky/scrolled (if behavior changes), mobile/collapsed, item-active, item-hover, mobile-open.
- **Common variants**: Top bar, sidebar, bottom tab bar, mega-menu, breadcrumb trail, hamburger/mobile drawer.
- **Doc format example**:
  ```
  Navigation — Top Bar
  Background: #FFFFFF | Border-bottom: 1px solid #E5E7EB
  Height: 64px | Padding: 0 24px | Position: sticky top 0
  Links: #374151, 14px, weight 500, gap 32px
  Active: color #2563EB, border-bottom 2px solid #2563EB
  Scrolled: shadow 0 1px 3px rgba(0,0,0,0.06)
  ```

### Badge/Tag
- **DOM signals**: `<span>` or `<div>` with small `font-size`, `padding`, `border-radius`, and `display: inline-flex`. Class patterns: `.badge`, `.tag`, `.chip`, `.pill`, `.label`, `MuiBadge`, `MuiChip`.
- **Required properties**: Background color, text color, font size, font weight, padding, border-radius, border (if outline style).
- **Required states**: Default, removable (with dismiss icon hover), interactive/clickable (if toggleable).
- **Common variants**: Status (colored by semantic role), category, count/number, dot-only, removable, outline, solid, subtle/soft, size (sm/md/lg).
- **Doc format example**:
  ```
  Badge — Success
  Background: #DCFCE7 | Text: #166534, 12px, weight 600
  Padding: 2px 8px | Radius: 9999px (pill)
  ```

### Hero
- **DOM signals**: First `<section>` or prominent block after `<header>`, large `font-size` heading (`h1`), full-width or near-full-width layout, often with background image/gradient/illustration. Class patterns: `.hero`, `.banner`, `.jumbotron`, `.splash`.
- **Required properties**: Background (color/image/gradient), heading font size and weight, subheading style, CTA button style, vertical padding/height, text alignment, overlay (if over image), content max-width.
- **Required states**: Default only (heroes are typically static). Note any scroll-triggered animations.
- **Common variants**: Text-only, split (text + image/illustration), video background, full-bleed image, gradient overlay, animated/interactive, minimal.
- **Doc format example**:
  ```
  Hero — Centered
  Background: linear-gradient(135deg, #1E3A5F, #0F172A)
  Headline: 64px/1.1, weight 800, #FFFFFF, max-width 720px
  Subheading: 20px/1.5, weight 400, #CBD5E1, max-width 560px
  CTA: Primary Button variant, margin-top 32px
  Min-height: 100vh | Padding: 120px 24px
  ```

### Footer
- **DOM signals**: `<footer>`, last major block on page, typically contains links/copyright/social icons. Class patterns: `.footer`, `.site-footer`.
- **Required properties**: Background color, text color, link color, padding, column layout/grid (count, gap), separator style, copyright text style, social icon styling.
- **Required states**: Default only. Link hover states.
- **Common variants**: Simple (single row), multi-column, mega-footer (with newsletter/CTA), minimal (copyright only), branded.
- **Doc format example**:
  ```
  Footer — Multi-column
  Background: #111827 | Text: #9CA3AF | Links: #D1D5DB, hover #FFFFFF
  Columns: 4, gap 48px | Padding: 64px 24px
  Copyright: 12px, #6B7280, margin-top 48px
  Border-top: 1px solid #1F2937
  ```

### Modal/Dialog
- **DOM signals**: `<dialog>`, `role="dialog"`, `role="alertdialog"`, element with `position: fixed` + overlay backdrop + high `z-index`. Class patterns: `.modal`, `.dialog`, `.overlay`, `MuiModal`, `MuiDialog`.
- **Required properties**: Background color, border-radius, box-shadow, max-width, padding, overlay/backdrop color and opacity, header/body/footer section spacing, close button style.
- **Required states**: Open (entry animation), closing (exit animation), with-form, scrollable-body.
- **Common variants**: Confirmation dialog, form dialog, full-screen (mobile), side-sheet/drawer, alert dialog, bottom-sheet.
- **Doc format example**:
  ```
  Modal — Default
  Overlay: rgba(0,0,0,0.5)
  Panel: background #FFFFFF, radius 16px, shadow 0 25px 50px rgba(0,0,0,0.25)
  Width: max-width 560px | Padding: 24px
  Entry: fade-in 200ms + scale from 0.95
  Close: top-right, 32px hit area, #6B7280 icon
  ```

### Dropdown
- **DOM signals**: `role="menu"`, `role="listbox"` triggered by a button, floating panel with option list. Class patterns: `.dropdown`, `.menu`, `.popover-menu`, `MuiMenu`.
- **Required properties**: Panel background, border-radius, box-shadow, padding, item height/padding, item hover color, separator style, max-height (if scrollable), positioning offset.
- **Required states**: Open, item-hover, item-active/selected, item-disabled, with-submenu.
- **Common variants**: Action menu, context menu, nested/cascading, with-icons, with-checkmarks, grouped with headers.
- **Doc format example**:
  ```
  Dropdown — Menu
  Panel: background #FFFFFF, shadow 0 4px 16px rgba(0,0,0,0.12), radius 8px
  Item: padding 8px 16px, 14px, #374151
  Item hover: background #F3F4F6
  Separator: 1px solid #E5E7EB, margin 4px 0
  Width: min 180px
  ```

### Toast
- **DOM signals**: Element with `position: fixed` anchored to viewport edge, auto-dismissing, `role="alert"` or `role="status"`, `aria-live="polite"`. Class patterns: `.toast`, `.notification`, `.snackbar`, `MuiSnackbar`.
- **Required properties**: Background color per type (success/error/warning/info), text color, icon, border-radius, box-shadow, padding, max-width, position on screen, auto-dismiss duration.
- **Required states**: Entering (entry animation), visible, exiting/dismissing, hover (pause timer if applicable).
- **Common variants**: Success, error, warning, info, neutral, with-action, with-close, with-progress-bar, stacked/queued.
- **Doc format example**:
  ```
  Toast — Success
  Background: #FFFFFF | Left border: 4px solid #22C55E
  Icon: check-circle, #22C55E | Text: #111827, 14px
  Shadow: 0 4px 12px rgba(0,0,0,0.1) | Radius: 8px
  Position: top-right, offset 16px | Auto-dismiss: 5000ms
  Entry: slide-in-right 200ms
  ```

### Tooltip
- **DOM signals**: `role="tooltip"`, `[data-tooltip]`, small floating element appearing on hover/focus near trigger, often with arrow/caret. Class patterns: `.tooltip`, `MuiTooltip`, `[data-radix-tooltip]`.
- **Required properties**: Background color, text color, font size, padding, border-radius, arrow/caret style, max-width, show delay.
- **Required states**: Visible (single state; hidden is absence).
- **Common variants**: Dark (default), light, error (for validation), rich content (multi-line with formatting).
- **Doc format example**:
  ```
  Tooltip — Dark
  Background: #1F2937 | Text: #F9FAFB, 12px
  Padding: 4px 8px | Radius: 4px | Max-width: 240px
  Arrow: 6px, same background color
  Show delay: 300ms | Animation: fade 150ms
  ```

### Avatar
- **DOM signals**: `<img>` with `border-radius: 50%` or `border-radius: 9999px`, often small and square, sometimes with initials fallback. Class patterns: `.avatar`, `MuiAvatar`, `.user-avatar`, `.profile-pic`.
- **Required properties**: Size (width/height), border-radius (circle vs rounded square), border (if present), fallback background color, fallback text style (for initials), status indicator (position, size, color).
- **Required states**: With-image, fallback/initials, with-status-indicator (online dot), hover (if clickable), group/stack overlap.
- **Common variants**: Circle, rounded square, with-ring/border, with-status-dot, group/stacked, size (xs/sm/md/lg/xl).
- **Doc format example**:
  ```
  Avatar — Medium
  Size: 40px | Radius: 50%
  Border: 2px solid #FFFFFF (for stacking)
  Fallback: background #E5E7EB, text #374151, 14px weight 600
  Status dot: 10px, bottom-right, #22C55E, border 2px solid #FFFFFF
  ```

### Table
- **DOM signals**: `<table>`, `role="grid"`, `role="table"`, repeating row structure with `<th>`/`<td>`. Class patterns: `.table`, `.data-table`, `MuiTable`, `MuiDataGrid`.
- **Required properties**: Header background, header text style (color, size, weight, transform), row background, alternating row color (if striped), border/separator style, cell padding, row hover color.
- **Required states**: Default, row-hover, row-selected, column-sorted, loading/skeleton.
- **Common variants**: Striped, bordered, borderless, compact, with-sticky-header, with-selection, with-sorting, with-pagination, responsive.
- **Doc format example**:
  ```
  Table — Default
  Header: background #F9FAFB, text #6B7280, 12px weight 600 uppercase, padding 12px 16px
  Body row: text #111827, 14px, padding 12px 16px
  Border: bottom 1px solid #E5E7EB per row
  Hover: background #F9FAFB
  Selected: background #EFF6FF
  ```

### Code Block
- **DOM signals**: `<pre><code>`, `<code>` with `font-family: monospace`, syntax-highlighted spans. Class patterns: `.code-block`, `.hljs`, `.prism-code`, `.shiki`, `[data-language]`.
- **Required properties**: Background color, text color, font family, font size, line-height, padding, border-radius, border (if any), syntax colors (keyword, string, comment, function, number, operator), overflow behavior, copy button style (if present).
- **Required states**: Default, with-line-numbers, with-copy-button, copy-success, scrollable.
- **Common variants**: Inline code, block code, with-filename-tab, with-diff-highlighting, terminal/console style, dark theme, light theme.
- **Doc format example**:
  ```
  Code Block — Dark
  Background: #1E1E2E | Text: #CDD6F4
  Font: "JetBrains Mono", monospace, 13px/1.6
  Padding: 16px 20px | Radius: 8px
  Keywords: #CBA6F7 | Strings: #A6E3A1 | Comments: #6C7086
  Copy button: top-right, #6C7086 icon, hover #CDD6F4
  ```

### Tabs
- **DOM signals**: `role="tablist"` with `role="tab"` children, `role="tabpanel"`, horizontal list of clickable labels with one active indicator. Class patterns: `.tabs`, `.tab-list`, `MuiTabs`, `[data-radix-tabs]`.
- **Required properties**: Tab text color (active/inactive), active indicator style (underline/background/border), tab padding, tab gap, font size/weight, tab panel padding.
- **Required states**: Default/inactive, active/selected, hover, disabled, focus-visible.
- **Common variants**: Underline, pill/filled, bordered/boxed, vertical, with-icons, with-counts/badges, scrollable, segmented-control.
- **Doc format example**:
  ```
  Tabs — Underlined
  Container: border-bottom 1px solid #E5E7EB
  Tab: text #6B7280, 14px weight 500, padding 8px 16px
  Active: text #111827, border-bottom 2px solid #2563EB, font-weight 600
  Hover: text #374151, background #F9FAFB
  ```

---

## Distinctive Components

How to identify unique visual elements not covered by the standard categories above.

### Identification Method

If an element does not match any standard component definition above, it is likely a distinctive component specific to the brand or product. Apply these tests:

1. **Visual uniqueness test**: Does the element look meaningfully different from any standard component? If it cannot be described as a variant of Button, Card, Input, etc., it is distinctive.
2. **Brand specificity test**: Would this component only make sense in this particular product?
3. **Composite test**: Does the element combine multiple standard components into a single cohesive unit with its own interaction model?
4. **Data visualization test**: Does the element present data in a way that goes beyond standard HTML?

### Common Distinctive Patterns

**Brand-specific metric cards** -- Numbers/stats displayed with custom layouts, often featuring large display typography, colored icons, trend indicators (arrows/sparklines), and branded color accents. Distinct from generic Cards by their data-heavy, dashboard-oriented purpose. Document: number formatting, trend color coding, sparkline styling, comparison period labels.

**Workflow diagrams** -- Step sequences, flow charts, or process visualizations using connected nodes, arrows, progress lines, or numbered steps. May use SVG, canvas, or pure CSS. Look for sequential numbering, connecting lines, and status-colored nodes. Document: node styling, connector lines, active/complete/pending states, directional indicators.

**Trust/social proof bars** -- Logo strips, testimonial carousels, review aggregations, "as seen in" sections, or partner logo grids. Identified by repeating small images (logos), uniform sizing, grayscale treatment, and horizontal scroll or marquee behavior. Document: logo sizing/spacing/grayscale treatment, quote styling, rating component.

**Bento grid layouts** -- Asymmetric grid compositions where cards vary in size (1x1, 2x1, 1x2, 2x2) to create editorial-style layouts. Distinguished from uniform card grids by deliberate size variation and visual hierarchy within the grid. Document: grid template, cell size variants, gap spacing, content alignment per cell, responsive reflow.

**Custom data visualization** -- Charts, graphs, gauges, or visual data representations beyond standard HTML tables. Look for SVG/canvas elements, D3 bindings, chart library wrappers, or custom-drawn visual elements with axis labels and legends. Document: chart type, axis styling, color scheme, legend position, tooltip format.

**Pricing tables** -- Multi-column comparison layouts with plan names, prices, feature lists (often with check/cross icons), and CTA buttons per plan. Distinguished from generic tables by their vertical comparison structure and promotional styling (highlighted/recommended plan). Document: column widths, highlight treatment, feature check/cross icons, CTA variant per tier, billing toggle style.

**Feature comparison matrices** -- Grid-like layouts comparing features across products/tiers with check marks, cross marks, or partial indicators. Similar to pricing tables but focused on feature parity rather than pricing. Document: header styling, row alternation, indicator icons, sticky header behavior, responsive collapse.

### Documentation Approach for Distinctive Components

When a distinctive component is identified:

1. **Name it descriptively** -- Use the product's own terminology if visible (e.g., "Metric Dashboard Card" not "Custom Card 1").
2. **Capture the full visual specification** -- Background, typography, spacing, colors, icons, borders, shadows.
3. **Note the layout structure** -- Grid template, flex direction, gap values, responsive breakpoints.
4. **Document interactive behavior** -- Hover effects, click actions, animations, transitions.
5. **Screenshot or describe the visual** -- Distinctive components benefit from visual reference since they lack standard conventions.

### When NOT to Create a Distinctive Component Entry

- The element is a minor visual decoration (gradient divider, decorative dot pattern) -- document inline in the relevant section.
- The element is a standard component with unusual content but standard styling -- document as a variant of the standard type.
- The element appears only once on the site and has no reuse potential -- mention in context but do not elevate to a component.

---

## Component Extraction Checklist

Before finalizing component documentation:

- [ ] Every interactive element on the page is classified
- [ ] All states are captured (not just default)
- [ ] Hover/focus styles are recorded separately from default
- [ ] Responsive behavior is noted where layout changes
- [ ] Spacing values use the site's actual values, not approximations
- [ ] Colors reference the semantic role names from the color taxonomy
- [ ] Typography references the type scale defined elsewhere in the design system
- [ ] Distinctive components are named and documented with full specification

---

## "Use:" Line Requirement

Every component entry in the DESIGN.md must include a **Use:** line that answers: "When does a developer reach for this component instead of another?"

### Format

```
Component — Variant
Use: [1-2 sentence description of when to use this component]
[... rest of spec ...]
```

### Examples

```
Button — Primary
Use: For the single most important action on a page or in a dialog. Limit to one primary button per visible viewport.
Background: #2563EB | Hover: #1D4ED8 | Active: #1E40AF
...
```

```
Toast — Error
Use: For transient errors that do not block the user's workflow (failed background save, network hiccup). For blocking errors, use Dialog — Error instead.
Background: #FFFFFF | Left border: 4px solid #EF4444
...
```

```
Badge — Status
Use: For displaying the current state of an entity (order status, deployment status, user online/offline). Not for counts -- use Badge — Count for numeric indicators.
Background: varies by status | Text: varies, 12px, weight 600
...
```

### Why the "Use:" line matters

Without it, developers choose components by visual similarity ("this looks like a card") rather than semantic purpose. The "Use:" line prevents:
- Modals used where toasts should appear
- Cards used where list items belong
- Buttons used where links are semantically correct
- Badges used where tooltips are more appropriate

---

## State Matrix Template

Every interactive or data-dependent component must document its states beyond the default. Use this template:

### State matrix format

```markdown
### Component — Variant

| State | Visual changes | Trigger |
|---|---|---|
| Default | [base appearance] | Initial render |
| Hover | [what changes on hover] | Mouse enter |
| Active/Pressed | [what changes on press] | Mouse down / touch |
| Focus | [focus ring spec] | Tab / keyboard navigation |
| Disabled | [opacity, cursor, color changes] | `disabled` attribute |
| Loading | [spinner, skeleton, shimmer] | Async operation in progress |
| Empty | [empty state illustration, text, CTA] | No data / first use |
| Error | [error border, message, icon] | Validation failure / API error |
| Success | [confirmation indicator] | Successful completion |
```

### Which states apply to which components

| Component | Hover | Active | Focus | Disabled | Loading | Empty | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Button | required | required | required | required | optional | -- | -- | optional |
| Input | required | -- | required | required | -- | -- | required | optional |
| Card | if interactive | if interactive | if interactive | optional | required | -- | optional | -- |
| Table | row hover | row select | cell focus | -- | required | required | required | -- |
| Select | required | -- | required | required | -- | required | required | -- |
| Toast | pause timer | -- | -- | -- | -- | -- | -- | -- |
| Modal | -- | -- | focus trap | -- | optional | -- | -- | -- |
| Dropdown | item hover | item select | item focus | item disabled | -- | required | -- | -- |

### Documenting states you did NOT observe

If the extraction data lacks a state that should exist, document the gap explicitly:

```
Focus: not observed in extraction — implement with 2px ring matching primary color, 2px offset
Error: not observed — apply border-color change to destructive color (#EF4444)
```

This is better than silent omission, which causes implementers to invent states that may conflict with the system.

---

## Decision Logic: When to Use Which Component

Some components serve overlapping purposes. This decision logic helps the DESIGN.md document the right component for each communication need.

### Feedback to the user: Dialog vs Toast vs Banner

| Question | Dialog (Modal) | Toast (Snackbar) | Banner (Inline) |
|---|---|---|---|
| Does it need user action? | Yes -- confirm, choose, input | No -- informational only | Sometimes -- dismissible with optional CTA |
| Is it blocking? | Yes -- interrupts workflow | No -- appears and auto-dismisses | No -- persistent but non-blocking |
| Is it contextual to a specific element? | No -- full-page overlay | No -- viewport-anchored | Yes -- appears near the relevant content |
| Can the user miss it? | No -- requires dismissal | Yes -- may auto-dismiss before read | Unlikely -- persists until dismissed |
| Examples | "Delete this project?", payment confirmation | "Changes saved", "Link copied" | "Your trial expires in 3 days", form-level error |

### Content display: Card vs List Item vs Table Row

| Question | Card | List Item | Table Row |
|---|---|---|---|
| Is the content visually rich (images, stats)? | Yes | Minimal | No |
| Are items being compared? | Poorly suited | Poorly suited | Yes |
| Is the collection scannable? | At ~4-8 items | At ~5-20 items | At ~10-100+ items |
| Does each item need its own visual container? | Yes | No | No |
| Is the layout responsive? | Reflows columns | Stays single-column | Collapses or scrolls |

### Selection: Dropdown vs Radio vs Segmented Control

| Question | Dropdown (Select) | Radio Group | Segmented Control |
|---|---|---|---|
| How many options? | 5+ | 2-5 | 2-4 |
| Is the current selection always visible? | No (collapsed) | Yes | Yes |
| Does it need minimal space? | Yes | No | Moderate |
| Is it a mode switch (affects visible content)? | Rarely | Sometimes | Yes |

### Document these decision rules in the DESIGN.md when the system contains multiple components that serve overlapping purposes. Include them as a subsection under Components or as a dedicated "Component Selection Guide" section.
