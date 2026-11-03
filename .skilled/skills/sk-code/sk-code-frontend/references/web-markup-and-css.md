---
title: Web Markup and CSS Practice
description: Web rules for semantic markup, forms, layout, responsive behavior, media, CSS architecture and framework examples.
trigger_phrases:
  - "semantic web markup"
  - "responsive css practice"
  - "web forms and layout"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Web Markup and CSS Practice

The web layer for the frontend practice core, with framework examples kept beside the platform rules they express.

---

## 1. OVERVIEW AND BOUNDARY

This file is the web layer of [`frontend-practice.md`](frontend-practice.md). It expresses all eleven core principles through web markup, forms, layout, responsive behavior, media and framework patterns.

This file owns web mechanics. It does not own:

- **Values.** Use the project's installed tokens and report a missing token, as [core principle 7](frontend-practice.md#2-the-eleven-principles) requires. When the tokens or the frame leave a value open, use [sk-design-fundamentals](../../../sk-design/sk-design-fundamentals/SKILL.md) for guidance.
- **Interaction details.** Form behavior, touch and hit areas, typography implementation, focus and keyboard behavior, motion, performance and feedback are in [`interaction-craft.md`](../../../sk-design/sk-design-fundamentals/references/interaction-craft.md) Sections 2–8. This file links to them and does not repeat their detail.
- **Figma translation.** The shared rules and five-pass check are in [`figma-to-code.md`](figma-to-code.md) and [core Section 4](frontend-practice.md#4-figma-as-reference).
- **The project's own conventions.** A project or stack mode may replace, extend or disable one core or stack-layer statement for its surface. Follow the core's [overrides rule](frontend-practice.md#5-overrides). The mode declares its choice under a Frontend overrides heading in its own SKILL.md.
- **Visual direction.** A frame records appearance and states. Resolve values the frame and installed tokens leave open through [sk-design-fundamentals](../../../sk-design/sk-design-fundamentals/SKILL.md).

---

## 2. STRUCTURE AND SEMANTICS

- Use landmarks: one `<header>`, `<nav>`, `<main>` and `<footer>` per page shell, and `<aside>` or `<section>` with a heading for distinct regions.
- Use one `<h1>` per page. Choose heading levels by the document outline, never by visual size. Type size comes from a type token.
- Use `<button>` for an action and `<a href>` for navigation, as [core principle 1](frontend-practice.md#2-the-eleven-principles) requires. A clickable `<div>` or `<span>` has no keyboard support, role or disabled state.
- Give every `<button>` inside a `<form>` an explicit `type`: `type="button"` unless it submits the form.
- Use `<ul>` or `<ol>` for lists of things, and `<table>` for tabular data with a `<caption>` and `<th scope="col">` or `<th scope="row">`. Do not build a data grid from nested `div`s when a table fits.
- Use native elements before ARIA: `<dialog>`, `<details>` and `<summary>`, `<select>` or `<input type="checkbox">`. ARIA fills a gap the platform leaves. It does not replace an available native element.
- Give a custom widget its state with `aria-expanded` and `aria-controls` on a disclosure trigger, `aria-current="page"` on the active navigation link, `aria-selected` in a tablist and `aria-live="polite"` on a region whose text changes without a page load. This expresses [core principle 2](frontend-practice.md#2-the-eleven-principles).
- Set `lang` on `<html>` and on any inline passage in another language.
- Hide content with the `hidden` attribute. Make a background region non-interactive with `inert` while a modal is open.
- Use a visually hidden utility class for text meant only for screen readers. Do not use `display: none` or `visibility: hidden`, which also hide the text from assistive technology.

**Deeper:** [Elements and attributes](web-elements-and-attributes.md) and [accessibility patterns](web-accessibility-patterns.md).
---

## 3. FORMS

Form behavior such as label focus, the form wrapper, input `type`, `required`, decorations and double submits is in [`interaction-craft.md`](../../../sk-design/sk-design-fundamentals/references/interaction-craft.md) Section 2. The web markup adds these requirements. It expresses [core principles 2 and 3](frontend-practice.md#2-the-eleven-principles):

- Give every control a visible label with `<label for="id">` or a wrapping `<label>`. A placeholder is not a label.
- Group related controls in `<fieldset>` with a `<legend>`. Radio and checkbox groups require this context.
- Give every control a `name`, so the form serializes and autofill can match it.
- Set `inputmode` (`numeric`, `decimal`, `email`, `tel`, `url` or `search`) to choose the right mobile keyboard. Set `enterkeyhint` (`next`, `done`, `search` or `send`) when the Enter key has a specific action.
- Link help and error text with `aria-describedby`. Set `aria-invalid="true"` while a control has an error.
- Use native constraints (`required`, `min`, `max`, `step`, `pattern` and `maxlength`) so the browser validates before the app.

**The `autocomplete` disagreement.** `interaction-craft.md` Section 2 advises disabling `autocomplete` on most inputs. That holds for free-text fields where browser history adds noise, such as comments, in-app search filters and admin entry of someone else's data. It does not hold for fields about the user. Identity, contact, address, payment and credential fields need the right token so autofill and password managers work and the input purpose is machine-readable:

| Field | Token |
|-------|-------|
| Email, phone | `email`, `tel` |
| Names | `given-name`, `family-name`, `name` |
| Address | `street-address`, `postal-code`, `country-name`, `address-level2` |
| Organization | `organization` |
| Sign-in password | `current-password` |
| New or changed password | `new-password` |
| SMS or email code | `one-time-code` |

**Deeper:** [Elements and attributes](web-elements-and-attributes.md).
---

## 4. LAYOUT

- Start from normal flow. Most content needs no layout code, as [core principle 4](frontend-practice.md#2-the-eleven-principles) requires.
- Use flexbox for one axis and grid for two. Use `gap` for space between siblings instead of margins on the children.
- Use `position: absolute` for overlays, badges and decorations anchored to a positioned parent. Ordinary content stays in the flow.
- Set `min-width: 0` on a flex or grid child that holds text, or long words can push the container wider than its track.
- Prefer `max-width`, `min-height` and `aspect-ratio` to fixed `width` and `height`. Content and translations vary in length.
- Use intrinsic sizing: `fit-content`, `minmax()` and `repeat(auto-fit, minmax(<token>, 1fr))` for card grids.
- Use logical properties (`margin-inline`, `padding-block` and `inset-inline-start`) so the layout survives a right-to-left language.
- Give long strings `overflow-wrap: anywhere`, or truncate with `text-overflow: ellipsis` on a child that also has `min-width: 0`.
- Take `z-index` from a named scale (base, dropdown, sticky, overlay, modal or toast), never a magic number such as `9999`.

**Deeper:** [Layout and sizing](web-layout-and-sizing.md) and [internationalization](web-internationalization.md).
---

## 5. RESPONSIVE

- Write mobile-first: base styles for a narrow screen, then `@media (min-width: ...)` steps at the breakpoints the project's tokens define. This is part of [core principle 9](frontend-practice.md#2-the-eleven-principles).
- Use container queries when a component's layout depends on its available width. See [L6](web-layout-and-sizing.md#l6-container-queries-and-container-units).

**Support.** Baseline widely available since 2025-08-14 (web-features `container-queries`). Chrome 105 / Firefox 110 / Safari 16.
- Size type in `rem` so it scales with the root font size, and use the installed typography tokens.
- Use `clamp()` only between two adjacent steps of the type scale for large display type. [`interaction-craft.md`](../../../sk-design/sk-design-fundamentals/references/interaction-craft.md) Section 4 explains the reasoning.
- On mobile, use `100dvh` or `100svh` instead of `100vh`, which ignores the browser toolbar.
- Respect the core safe-area principle with `env(safe-area-inset-*)` padding and `viewport-fit=cover` in the viewport meta tag.
- Never set `user-scalable=no` or `maximum-scale=1`. People must be able to zoom.
- Respect the core reduced-motion principle: wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`, or remove it under `reduce`.

**Deeper:** [Layout and sizing](web-layout-and-sizing.md) and [accessibility patterns](web-accessibility-patterns.md).
---

## 6. MEDIA

- Give every `<img>` an `alt` decision. Describe what the image adds, or use `alt=""` when it is decorative. This expresses [core principle 6](frontend-practice.md#2-the-eleven-principles).
- Set `width` and `height` attributes on images, so the browser reserves space and the layout does not shift.
- Use `loading="lazy"` below the fold, `fetchpriority="high"` on the largest image above the fold and `decoding="async"` on the rest.
- Serve sizes with `srcset` and `sizes`, or use `<picture>` for art direction and modern formats.
- Fit images into their box with `object-fit: cover` or `contain`, not by distorting the element.
- Give inline SVG icons `aria-hidden="true"`. Put the accessible name on the control that holds the icon. Fill icons with `currentColor`, so they follow the text color token.

**Deeper:** [Elements and attributes](web-elements-and-attributes.md) and [performance and loading](web-performance-and-loading.md).
---

## 7. CSS ARCHITECTURE

- Read values from custom properties with `var(--token)`. A raw hex, `rgb()` or pixel value that a token covers is a defect. Report a missing token, as [core principle 7](frontend-practice.md#2-the-eleven-principles) requires.
- Scope styles to a component through the framework's scoping mechanism or the project's CSS convention, and keep specificity low. See [CS4](web-cascade-and-selectors.md#cs4-zero-specificity-and-maximum-argument-selectors). Do not use IDs in selectors.
- Do not use `!important` outside utility classes that exist to win.
- Express state with pseudo-classes and attributes: `:hover`, `:focus-visible`, `:disabled`, `[aria-expanded="true"]`, `[aria-current="page"]` and `[aria-invalid="true"]`. A duplicated `.is-open` class can drift from the state screen readers read. This expresses [core principle 2](frontend-practice.md#2-the-eleven-principles).
- Never remove a focus indicator without a `:focus-visible` replacement. [`interaction-craft.md`](../../../sk-design/sk-design-fundamentals/references/interaction-craft.md) Section 5 describes the focus ring.
- Animate `transform` and `opacity`. Animating `width`, `height`, `top` or `left` forces layout on every frame.

**Deeper:** [Cascade and selectors](web-cascade-and-selectors.md) and [accessibility patterns](web-accessibility-patterns.md).
---

## 8. FRAMEWORK SECTIONS

The entries below are examples of how common frameworks express shared DOM and CSS rules. Apply an example only when that framework is in use; the underlying rule remains the platform rule.

### Angular

- Use native elements in templates. A component that wraps a button keeps the `<button>` inside rather than putting click handling on a non-interactive host.
- Bind ARIA state to DOM attributes. In Angular, use attribute binding such as `[attr.aria-expanded]`, `[attr.aria-controls]` and `[attr.aria-label]`.
- Track repeated items by stable data identity. Angular's built-in control flow expresses this as `@for (item of items; track item.id)`.
- Where Angular's optimized image directive is already used, provide `ngSrc`, `width` and `height`.
- When a component's host renders a box, set a layout display value if its default display is inline.
- Theme component libraries through installed token variables, not private implementation class names.

### React

- Use the framework's HTML attribute equivalents, such as `htmlFor` and `className`. Generate label and description IDs with a stable ID utility such as `useId()`.
- Give repeated list items a stable key from their data. An index key can move state when the list reorders.
- Return a fragment instead of a wrapper element that exists only to satisfy the component syntax.
- Set `type` on every `<button>`.

### Next.js

- The React examples apply.
- Use the framework's image optimization and internal-link components where the project already uses them. Provide intrinsic dimensions or a rendered-size description.
- Set `lang` on `<html>` in the root layout.

### Figma Check on the Web

Every recipe below ran against a live page with `bdg` 0.6.10. For methods with parameters, use `bdg cdp <Domain.method> --params '<json>'`; `bdg cdp --help` confirms the form.

Open the rendered build in a `bdg` session.

- Set the viewport to the frame's authored width W in CSS pixels with `bdg cdp Emulation.setDeviceMetricsOverride --params '{"width":<w>,"height":<h>,"deviceScaleFactor":1,"mobile":<bool>}'`.
- Set the colour scheme the frame shows before capturing, because a headless browser follows the system setting: `bdg cdp Emulation.setEmulatedMedia --params '{"features":[{"name":"prefers-color-scheme","value":"light"}]}'`.
- Capture with `bdg dom screenshot <path>`.
- Read resolved styles for Pass 3a with `bdg cdp Runtime.evaluate --params '{"expression":"getComputedStyle(document.querySelector(\"<css>\")).<property>","returnByValue":true}'`. `bdg dom eval` failed with "Session target not found" in the same session, so use `Runtime.evaluate`.
- **Pass 2, state by state:**
  1. Enable the domains once per session: `bdg cdp DOM.enable`, then `bdg cdp CSS.enable`. `CSS.forcePseudoState` needs the CSS domain enabled.
  2. Resolve the document with `bdg cdp DOM.getDocument` and use its `root.nodeId` as `<rootId>`. Resolve the element with `bdg cdp DOM.querySelector --params '{"nodeId":<rootId>,"selector":"<css>"}'` and use the result's `nodeId` as `<id>`.
  3. Emulate reduced motion first, `bdg cdp Emulation.setEmulatedMedia --params '{"features":[{"name":"prefers-reduced-motion","value":"reduce"}]}'`. A style read straight after forcing a state otherwise returns a mid-transition value.
  4. Force each state with its own call, `bdg cdp CSS.forcePseudoState --params '{"nodeId":<id>,"forcedPseudoClasses":["hover"]}'`, then `["active"]` and `["focus"]`. Force `focus-visible` only when `bdg cdp --describe CSS.forcePseudoState` confirms support. Clear with an empty `forcedPseudoClasses` list before the next state.
  5. The disabled state comes from the element's `disabled` attribute, not a forced class.
  6. Capture each state with `bdg dom screenshot <path>`, and confirm the capture shows the state.
  7. Check dark mode with the same `setEmulatedMedia` method and `{"name":"prefers-color-scheme","value":"dark"}`, only where the project supports dark mode. Reset with `--params '{"features":[]}'`.
  8. If CDP cannot run, use real hover, click and keyboard focus. If neither path runs, record `NOT RUN` with the reason.
- **Pass 5, range and access:**
  1. Test narrow, medium and wide widths below and above W with `Emulation.setDeviceMetricsOverride`. Reset with `bdg cdp Emulation.clearDeviceMetricsOverride`.
  2. Check 200 percent zoom with `bdg cdp Emulation.setPageScaleFactor --params '{"pageScaleFactor":2}'`, and reset with `1`.
  3. Traverse the page with real Tab presses, and record the focus order and any trap.
  4. Check names, roles and states with `bdg cdp Accessibility.getFullAXTree`, or with a manual screen-reader pass.
  5. Read computed text and background colours with `Runtime.evaluate` as above, then check contrast against the target `sk-design-fundamentals` sets.
  6. Record any check that cannot run as `NOT RUN` with the reason.
- Use [mcp-aside-devtools](../../../mcp-tooling/mcp-aside-devtools/SKILL.md) as the fallback renderer. Its `aside repl` is Playwright-compatible and can capture screenshots, but it has no CDP-domain parity, so it cannot force states or emulate media. Keep `bdg` for those checks.

See [mcp-chrome-devtools](../../../mcp-tooling/mcp-chrome-devtools/SKILL.md) for documented `bdg` commands.

**Deeper:** [Elements and attributes](web-elements-and-attributes.md), [accessibility patterns](web-accessibility-patterns.md), [performance and loading](web-performance-and-loading.md) and [internationalization](web-internationalization.md).

## 9. PRE-COMPLETION CHECKLIST

- [ ] Every action uses a `<button>` with a `type`, and every navigation uses an `<a href>`.
- [ ] Headings follow the outline, with one `<h1>`.
- [ ] Every form control has a visible label, a `name` and the right `autocomplete`, `inputmode` and `aria-describedby`.
- [ ] Custom widgets expose state with `aria-*` attributes, and styles read those attributes.
- [ ] Layout uses flow, flexbox or grid with `gap`. `position: absolute` appears only for overlays or decorations.
- [ ] No fixed `width` or `height` sits on a box that holds text.
- [ ] The view works at a narrow phone width, a tablet width and a desktop width, and at 200 percent zoom.
- [ ] Every image has an `alt` decision and reserved dimensions.
- [ ] No raw hex, `rgb()` or pixel value appears where a token covers it.
- [ ] Every interactive element shows a visible `:focus-visible` state, and the page works with the keyboard alone.
- [ ] The affected page was checked with a screen reader.
- [ ] No `user-scalable=no` or mobile `100vh` remains, and motion respects `prefers-reduced-motion`.
