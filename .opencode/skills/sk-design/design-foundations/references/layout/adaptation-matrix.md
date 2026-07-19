---
title: Context Adaptation Matrix
description: Device, input and context adaptation across mobile, tablet, desktop, print and constrained surfaces as rethinking for context rather than pixel scaling.
trigger_phrases:
  - "adaptation matrix"
  - "device context adaptation"
  - "mobile tablet desktop print"
  - "input method adaptation"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Context Adaptation Matrix

Device, input and context adaptation across mobile, tablet, desktop, print and constrained surfaces. This reference treats adaptation as rethinking the experience for a new context. It extends the responsive section in `layout-responsive.md` with a matrix of what actually changes per context. It does not re-derive the spacing scale or container-query mechanics, which live there.

---

## 1. OVERVIEW

### Core Principle

Adaptation is rethinking the experience for a new context, not scaling pixels. The same content carries different jobs on a phone in one hand, a desktop on a desk and a sheet of paper, so the layout, the interaction and the content depth each change. The trap is taking the desktop design and shrinking it until it fits, which produces a technically responsive page that feels wrong on every device but the one it was drawn for.

### When to Use

- Moving a design between phone, tablet, desktop, print or a constrained surface.
- Deciding what changes per context across layout, interaction, content and navigation.
- Adapting to input method and orientation rather than to screen width alone.
- Checking that core functionality survives every target context.

---

## 2. THE FOUR ADAPTATION DIMENSIONS

A context is more than a screen width. Read all four dimensions before deciding what changes, because the same width can carry a different input method, orientation and usage posture.

| Dimension | Questions | Why it matters |
| --- | --- | --- |
| Device and viewport | size, resolution, orientation, fixed or fluid | sets how much fits and how the page reflows |
| Input method | touch, mouse, keyboard, stylus, voice, gamepad | sets target size and whether hover can carry meaning |
| Connection and capability | fast, slow, offline, low-power | sets image weight and how much loads up front |
| Usage posture | glance vs focus, on the move vs at a desk | sets content depth and the size of the primary action |

A laptop with a touchscreen and a tablet with a keyboard both prove that screen width does not tell you the input method. Detect the capability, do not infer it from size.

---

## 3. THE ADAPTATION MATRIX

Each context rethinks four things: layout, interaction, content and navigation. Read the column for the target context, then confirm nothing core was dropped rather than rethought.

| Context | Layout | Interaction | Content | Navigation |
| --- | --- | --- | --- | --- |
| Phone | single column, full-width blocks, vertical stacking | tap targets at least 44 by 44 px, swipe where natural, bottom sheets over dropdowns, controls in thumb reach | progressive disclosure, primary content first, body text at least 16 px | bottom bar or drawer, reduced depth, sticky header for context |
| Tablet | two-column or master-detail, panels that follow orientation | touch and pointer both supported, denser than phone but still touch-sized | more visible than phone, less than desktop | side drawer, master-detail list plus detail |
| Desktop | multi-column, max-width cap so content never stretches to a 4K edge | hover for secondary detail, keyboard shortcuts, right-click and drag where they help | more shown up front, data tables with many columns, richer charts | persistent side navigation, breadcrumbs for depth |
| Print | page breaks at logical points, generous margins, limited or no color | none, all interaction removed | expand collapsed content, show full URLs, add page numbers and metadata | removed, replaced by a table of contents or headers |
| Constrained | single focused task, minimal chrome, large hit areas | one clear action, no hover dependence, forgiving targets | only the essential, defer the rest to a fuller surface | linear or single-action, no deep trees |

Constrained covers watches, embedded panels, TV with a remote, in-car displays and email. Email in particular wants a narrow single column near 600 px, inline styles and buttons rather than text links, because the rendering environment is unreliable.

---

## 4. ADAPT TO INPUT, NOT JUST SIZE

Width is a weak proxy for how the surface is touched. Branch on capability with feature queries so the design fits the actual input.

```css
@media (pointer: coarse) {
  .control { min-height: 44px; }
}

@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}

@media (hover: none) {
  .hover-only-detail { display: none; }
}
```

Rules:
- Size targets by pointer type. A coarse pointer needs larger targets and more spacing than a fine pointer.
- Never put functionality behind hover alone. A touch user cannot reach a hover-only menu or detail, so move it to a tap or make it always visible.
- Account for safe areas on devices with notches and home indicators, so fixed bars are not clipped:

```css
.bottom-bar {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

---

## 5. BREAKPOINTS AND IMAGES

Let content choose the breakpoints and let the browser choose the image weight, so adaptation tracks the design rather than a device chart.

- Use content-driven breakpoints. Stretch from narrow until the design breaks, then add a breakpoint there. Device-size guides such as phone, tablet and desktop are a starting hypothesis, not the truth.
- Write mobile-first with `min-width` queries so small screens do not download desktop styles they will not use.
- Use `clamp()` for fluid sizing that breathes between a floor and a ceiling without a breakpoint at every step.
- Serve responsive images with `srcset` width descriptors and `sizes` so the browser picks the file for the viewport and pixel density, and use `<picture>` when the crop itself should change, not just the resolution.
- Use `display: none` sparingly, because a hidden element on most stacks still downloads. Prefer not sending the weight at all on the contexts that do not need it.

---

## 6. WHAT MUST NOT CHANGE

Adaptation rethinks the surface, but some things stay constant across every context. Changing them breaks the user's mental model.

- Keep core functionality available everywhere. If a feature matters, make it work on the phone rather than hiding it.
- Keep one information architecture across contexts. The same content in a different shape is fine, a different structure per device is disorienting.
- Keep platform expectations intact. Mobile users expect mobile patterns, so do not force a desktop pattern onto a phone or the reverse.
- Keep meaning off hover-only and color-only channels, since both fail on a common context.

---

## 7. VERIFICATION

Test on real devices, because emulation shows layout but misses touch, real performance, network latency and font rendering.

- Core functionality works on phone, tablet, desktop and any constrained target in scope.
- Layout, interaction, content and navigation were each rethought for the context, not just scaled.
- The design responds to input method and orientation, not to width alone.
- No horizontal scroll at narrow widths and no content stretched edge to edge on very wide screens.
- Portrait and landscape both hold on phone and tablet.
- The print or export view removes interaction, expands hidden content and adds page context.
- A real phone and a real tablet were checked, not just the device emulator.
