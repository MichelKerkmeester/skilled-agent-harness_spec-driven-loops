---
title: Interaction Craft
description: The implementation-level details that make an interface feel right — inputs, touch, focus, keyboard, performance and feedback — grouped as build-time checks.
trigger_phrases:
  - "web interface guidelines"
  - "input and form details"
  - "touch device interface rules"
  - "focus ring and keyboard navigation"
  - "interface feels janky"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Interaction Craft

The details that separate an interface that looks right from one that feels right. Each is a small, checkable implementation decision.

---

## 1. OVERVIEW

### Core Principle

Visual systems decide how an interface looks. These decide how it behaves under a real cursor, a real thumb, a real keyboard, and a real network. A layout can be perfectly scaled and still feel broken.

### When to Use

- Implementing a component, form, menu, tooltip or dialog.
- Reviewing UI code rather than a static design.
- The interface "feels janky", "feels slow", or misbehaves on a phone.
- Keyboard or screen-reader behavior needs to be correct, not merely present.

### Source

Adapted from Rauno Freiberg's Web Interface Guidelines (<https://interfaces.rauno.me/>). Grouped and cross-linked here to the visual systems in `SKILL.md`; the wording is restated, not copied.

---

## 2. INPUTS AND FORMS

- Clicking an input's label should focus the input.
- Wrap inputs in a `<form>` so Enter submits.
- Give inputs an appropriate `type` — `password`, `email`, `tel`, `url`.
- Disable `spellcheck` and `autocomplete` on inputs where they are noise, which is most of them.
- Use the `required` attribute so HTML form validation does the work.
- Absolutely position prefix and suffix decorations such as icons **on top of** the input with padding, not beside it. Placing them next to the field breaks the field's own box.
- Disable buttons after submission so a double click does not fire two requests.
- Toggles take effect immediately; they never require a confirm step.

---

## 3. POINTERS, TOUCH AND HIT AREAS

- Guard hover states with `@media (hover: hover)` so a touch press does not leave a stuck hover state.
- Input font size must be at least 16px, or iOS zooms the page on focus.
- Do not autofocus inputs on touch devices; the keyboard covering the screen on arrival is hostile.
- Apply `muted` and `playsinline` to `<video>` so it can play inline on mobile.
- Disable the default iOS tap highlight with `-webkit-tap-highlight-color: rgba(0,0,0,0)`.
- Disable `touch-action` on custom components that implement their own pan and zoom.
- Disable `user-select` on the inner content of interactive elements, so a fast double click does not select text.
- Disable `pointer-events` on decorative elements such as glows and gradients.
- Interactive elements in a vertical or horizontal list must have **no dead areas between them**. Increase their `padding` rather than adding margin between them, so every pixel between two targets belongs to one of them.

Minimum target size is contested across sources: WCAG 2.5.5 asks for 44 by 44px, while the Laws-of-UX ruleset in [`motion-principles.md`](motion-principles.md) uses 32px as the floor. Use 44px for anything a thumb operates and treat 32px as the absolute minimum for a dense pointer-driven UI. Expand the hit area with padding or a negative-inset pseudo-element rather than by growing the visual box.

---

## 4. TYPOGRAPHY IMPLEMENTATION

- Apply `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility`.
- Subset fonts to the content, alphabet or languages actually used.
- **Font weight must not change on hover or selected state.** The width change causes layout shift. Change color instead — which is also the rule in `SKILL.md` Section 3.
- Nothing below weight 400, matching the visual system. Medium-sized headings generally sit best at 500 to 600.
- Apply `font-variant-numeric: tabular-nums` for numbers in tables, dashboards and anywhere a digit change would shift the layout.
- Prevent unexpected text resizing in iOS landscape with `-webkit-text-size-adjust: 100%`.

### The `clamp()` tension

This guideline set recommends adjusting values fluidly with `clamp()`, for example `clamp(48px, 5vw, 72px)` on a heading. `SKILL.md` Section 3 says the opposite: a fixed hand-picked type scale, and never scale things proportionally across breakpoints.

Both are right about different failures. Free viewport interpolation produces values that are not on any scale, which is the defect the scale exists to prevent. Fixed per-breakpoint sizes produce a visible jump mid-range on a large headline.

Resolve it this way: **clamp between two adjacent steps of the type scale**, never between arbitrary numbers, and only for large display type where the jump is visible. Body text and UI text stay on fixed steps. The rule that large elements shrink *faster* than small ones still governs which two steps to pick.

---

## 5. FOCUS, KEYBOARD AND SCREEN READERS

- Use `box-shadow` for focus rings, not `outline` — `outline` does not respect border radius.
- Focusable elements in a sequential list should be navigable with `↑` and `↓`, and deletable with `⌘ Backspace`.
- Trigger dropdown menus on `mousedown`, not `click`; the menu should be open by the time the button is released.
- Icon-only interactive elements need an explicit `aria-label`.
- Illustrations built from HTML need an explicit `aria-label`, or a screen reader announces the raw DOM tree.
- Images are rendered with `<img>`, always.
- Disabled buttons must not carry tooltips; a disabled element is not focusable, so the tooltip is unreachable.
- Tooltips triggered by hover must not contain interactive content, for the same reason.
- In nested menus, use a "prediction cone" — treat the triangular area between the cursor and the submenu as still inside the menu — so a diagonal mouse path does not close it.

---

## 6. MOTION AT THE IMPLEMENTATION LEVEL

The full motion model is in [`motion-principles.md`](motion-principles.md). These are the implementation-level items:

- Switching themes must not trigger transitions and animations on elements. Suppress transitions for the duration of the swap.
- Animation values are proportional to the trigger size: a dialog scales from about `0.8`, a button presses to about `0.96`.
- Frequent, low-novelty actions get no extraneous animation. Right-click menus, list item operations and trivial button hovers are the usual offenders.
- Looping animations pause when off screen.
- Use `scroll-behavior: smooth` for in-page anchors, with an offset that accounts for any fixed header.

---

## 7. PERFORMANCE

- Large `blur()` values on `filter` and `backdrop-filter` are slow.
- Scaling and blurring filled rectangles causes banding; use radial gradients instead.
- Enable GPU rendering with `transform: translateZ(0)` sparingly. It is a fix for a measured problem, not a default.
- Toggle `will-change` on for the duration of an unperformant scroll animation and off afterwards. A permanent `will-change` is its own leak.
- Auto-playing too many videos on iOS will choke the device.
- In React, bypass the render lifecycle with refs for real-time values such as pointer position.
- Detect and adapt to hardware and network capability rather than assuming a fast device.

---

## 8. FEEDBACK AND STATE

- Optimistically update data locally and roll back on server error.
- Authentication redirects happen on the server before the client loads, so no protected content ever flashes.
- Style the document selection state with `::selection`. Gradient text must unset the gradient on `::selection`, or the selected text disappears.
- Use an SVG favicon with an inline style tag that follows `prefers-color-scheme`.
- **Display feedback relative to its trigger.** A copy button shows an inline checkmark; a form error highlights the offending input. Feedback that appears far from what caused it makes the user hunt for the connection.
- Empty states prompt the user to create the first item, optionally with templates. This is the same finding as the empty-state row in [`diagnosis-table.md`](diagnosis-table.md) Section 6, reached from the implementation side.

---

## 9. REFERENCES AND RELATED RESOURCES

- [`motion-principles.md`](motion-principles.md) — durations, easing, springs, and the twelve animation principles behind the motion items above.
- [`review-checklist.md`](review-checklist.md) — the audit pass that checks these items against real code, with severity tiers.
- [`diagnosis-table.md`](diagnosis-table.md) — the visual symptoms that sit alongside these behavioral ones.
