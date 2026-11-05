---
title: Web Motion and Interaction
description: Motion principles, the enforceable motion ruleset and the implementation details for inputs, touch, focus, performance and feedback.
trigger_phrases:
  - "ui animation duration"
  - "spring versus easing curve"
  - "when not to animate"
  - "touch target size"
  - "focus ring and keyboard behavior"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Web Motion and Interaction

The motion values and the interaction details that make a web interface behave as well as it looks.

---

## 1. OVERVIEW

### Purpose

This file covers the twelve animation principles, the enforceable motion ruleset and the implementation details for inputs, touch, focus, performance and feedback.

### When to Use

- Adding or reviewing any transition, animation or gesture.
- Choosing between a spring and an easing curve, or deciding whether something should animate at all.
- Implementing a component, form, menu, tooltip or dialog.
- Reviewing UI code rather than a static frame.
- The interface feels janky, feels slow or misbehaves under a thumb or a keyboard.

### Boundaries

- **Widget contracts and focus mechanics.** Modal contracts, accessible names, focus movement and browser accessibility preferences remain in [web-accessibility-patterns.md](web-accessibility-patterns.md).
- **Value scales.** Spacing, type, colour and elevation scales remain in [web-visual-values.md](web-visual-values.md). The duration scale is [V4](web-visual-values.md#v4-motion-duration-bands).
- **Stacking and containing blocks.** The mechanics behind an overlay's `z-index` remain in [web-layout-and-sizing.md](web-layout-and-sizing.md).

---

## 2. INPUTS AND FORMS

### M1. Label, form and input type

- **Rule:** Clicking an input's label focuses the input and every input sits inside a `<form>` so Enter submits. Each input carries an appropriate `type` such as `password`, `email`, `tel` or `url`, and uses the `required` attribute where the value is mandatory.
- **Why:** The label is the click target as well as the name, the form wrapper gives Enter a submit path and a real input type selects the right keyboard and the right validation.
- **When not to:** Use `type="text"` when no specific type describes the value, and add `novalidate` only when a validation layer replaces the native messages.
- **Pitfall:** A placeholder used as the only label disappears when typing starts and leaves the field with no name.
- **Support:** Judgment, no version gate.
- **See also:** [A15](web-accessibility-patterns.md#a15-framework-validation-layers) and [web-markup-and-css.md](web-markup-and-css.md#3-forms).

### M2. Autocomplete and spellcheck

- **Rule:** Disable `spellcheck` and `autocomplete` on inputs where they are noise, which is most free-text fields.
- **Why:** Browser spell and history suggestions cover the content with red underlines or stale values the field does not want.
- **When not to:** Keep `autocomplete` and its token on identity, contact, address, payment and credential fields, as [web-markup-and-css.md](web-markup-and-css.md#3-forms) sets out.
- **Pitfall:** Disabling `autocomplete` on a password or address field breaks password managers and autofill.
- **Support:** Judgment, no version gate.
- **See also:** [web-markup-and-css.md](web-markup-and-css.md#3-forms).

### M3. Prefix and suffix decorations

- **Rule:** Position prefix and suffix decorations such as icons absolutely on top of the input with matching padding, never beside it.
- **Why:** A decoration placed beside the field adds a sibling box and breaks the field's own width and alignment.
- **When not to:** Place a decoration beside the field when it is a separate control with its own hit area.
- **Pitfall:** Padding that does not match the decoration lets typed text run under the icon.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v1-spacing-and-sizing-scale) for the spacing scale that sets the padding.

### M4. Submit guards and toggles

- **Rule:** Disable the submit button after submission so a double click does not fire two requests, and let a toggle take effect immediately with no confirm step.
- **Why:** A second request duplicates the write, and a confirm step on a toggle adds a decision the user already made.
- **When not to:** Keep the button enabled when the request is idempotent and the user may legitimately repeat it.
- **Pitfall:** A disabled button leaves the tab order, so pair it with a pending status for assistive technology.
- **Support:** Judgment, no version gate.
- **See also:** [A18](web-accessibility-patterns.md#a18-async-validator-pending-state).

---

## 3. POINTERS, TOUCH AND HIT AREAS

### M5. Hover behind a hover capability query

- **Rule:** Guard hover states with `@media (hover: hover)`.
- **Why:** A touch press can leave a stuck hover state that no pointer move will clear.
- **When not to:** Skip the guard when the control exists only on a pointer-driven surface, such as a desktop-only toolbar.
- **Pitfall:** An unguarded hover style leaves a card looking selected after a tap.
- **Support:** Judgment, no version gate.
- **See also:** [web-cascade-and-selectors.md](web-cascade-and-selectors.md) for state selectors.

### M6. Touch input size and autofocus

- **Rule:** Keep input font size at 16px or larger and never autofocus an input on a touch device.
- **Why:** A smaller font makes iOS zoom the page on focus, and an autofocus summons the keyboard over the content on arrival.
- **When not to:** Autofocus on a pointer device when the field is the single purpose of the screen.
- **Pitfall:** `maximum-scale=1` as a zoom workaround removes pinch zoom for everyone.
- **Support:** Judgment, no version gate.
- **See also:** [web-markup-and-css.md](web-markup-and-css.md#5-responsive).

### M7. Inline video and tap highlight

- **Rule:** Apply `muted` and `playsinline` to a `<video>` that plays inline on mobile, and set `-webkit-tap-highlight-color: rgba(0,0,0,0)` to remove the default iOS tap highlight.
- **Why:** Without both attributes the video takes over the screen or refuses to start, and the default highlight flashes a grey box over the control.
- **When not to:** Keep the tap highlight when the platform default is the only press feedback a control has.
- **Pitfall:** An inline video that autoplays with sound is blocked, so the first frame freezes with no cue.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md).

### M8. Custom pan and zoom

- **Rule:** Set `touch-action` to `none` only on a component that implements its own pan and zoom.
- **Why:** The property tells the browser to stop claiming the gesture, so the component's own handler receives every move.
- **When not to:** Leave the default when the component only needs a click, since the browser handles scroll and pinch better than a custom handler.
- **Pitfall:** `touch-action: none` on ordinary content blocks scrolling for the whole page.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) for scroll geometry.

### M9. Hit areas, 44px and the 32px floor

- **Rule:** Make every target a thumb operates at least 44 by 44px and treat 32px as the absolute minimum for a dense pointer-driven interface. Expand a small target with padding or a negative-inset pseudo-element rather than by growing the visual box.
- **Why:** A thumb covers more area than a cursor and lands off centre, while a dense pointer layout can keep its density only if the hit area grows without the visible box.
- **When not to:** Use the 32px floor only where a pointer is the expected input and the density is the point.
- **Pitfall:** A target that meets the size only through margin leaves the space between targets dead.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) for Fitts's Law.

### M10. No dead space between targets

- **Rule:** Interactive elements in a vertical or horizontal list must have no dead areas between them. Increase their `padding` rather than adding margin, so every pixel between two targets belongs to one of them.
- **Why:** A dead strip is a miss even when the visual gap looks small.
- **When not to:** Keep the gap when the elements are not targets, such as a list of static rows.
- **Pitfall:** Padding on the row plus margin on the row doubles the space and leaves a strip that hits nothing.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v1-spacing-and-sizing-scale).

### M11. Selection and decorative pointer events

- **Rule:** Disable `user-select` on the inner content of interactive elements, and set `pointer-events: none` on decorative elements such as glows and gradients.
- **Why:** A fast double click otherwise selects label text, and a decoration otherwise swallows a click meant for the control beneath it.
- **When not to:** Keep text selectable inside a control when the user needs to copy it, such as a code block with a copy button.
- **Pitfall:** `pointer-events: none` on a wrapper instead of the decoration removes the whole subtree from hit testing.
- **Support:** Judgment, no version gate.
- **See also:** [web-cascade-and-selectors.md](web-cascade-and-selectors.md).

---

## 4. TYPOGRAPHY IMPLEMENTATION

### M12. Font smoothing and subsetting

- **Rule:** Apply `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility`. Subset each font to the content, alphabet or languages the product uses.
- **Why:** The smoothing rules even out stem weight on a dark background, and a subset is the difference between one small file and a full character set download.
- **When not to:** Skip subsetting when the font already ships a single small weight and the full character set is in use.
- **Pitfall:** A subset that drops a glyph shows a fallback face for that character in the middle of a word.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md) for the font loading path.

### M13. Stable weight across states

- **Rule:** Never change font weight on hover or on a selected state. Change colour instead.
- **Why:** A weight change alters glyph width and shifts the layout of everything after it.
- **When not to:** Use weight for a state that does not sit in flow, such as a badge whose box is already sized for the heavier weight.
- **Pitfall:** A hover weight change makes a navigation row jump by a pixel, so the whole row appears to twitch.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v6-font-weight).

### M14. Weight floor and heading weight

- **Rule:** Never use a weight below 400, and set medium-sized headings at 500 to 600.
- **Why:** Thin stems lose contrast against the background at body size and read as broken rendering.
- **When not to:** Use a lighter weight for a very large display line where the size already carries the emphasis.
- **Pitfall:** A 300 weight at body size on a low-resolution screen reads as a rendering fault rather than a style choice.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v6-font-weight).

### M15. Numerals and text size adjust

- **Rule:** Apply `font-variant-numeric: tabular-nums` to numbers in tables, dashboards and anywhere a digit change would shift the layout, and set `-webkit-text-size-adjust: 100%` to stop unexpected text resizing in iOS landscape.
- **Why:** Tabular figures give every digit the same advance width, so a counter does not jitter, and the text size adjustment keeps the declared scale instead of letting the platform rescale it.
- **When not to:** Keep proportional numerals in running prose, where they sit better between letters.
- **Pitfall:** Tabular numerals in a large headline leave visible gaps around narrow digits such as 1.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v10-numerals-and-typeface-selection).

### M16. The `clamp()` tension

- **Rule:** Clamp between two adjacent steps of the type scale and never between arbitrary numbers. Restrict it to large display type where the jump is visible, while body text and UI text stay on fixed steps.
- **Why:** Free viewport interpolation produces values that are on no scale, while fixed per-breakpoint sizes produce a visible jump in the middle of the range on a large headline. Both failures are real and they pull in opposite directions.
- **When not to:** Keep body text and UI text on fixed scale steps even when their container changes width, since no visible jump appears there.
- **Pitfall:** `clamp(48px, 5vw, 72px)` on a heading can land between scale steps at most widths, which is the defect the scale exists to prevent.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v5-type-scale-and-units) and [web-markup-and-css.md](web-markup-and-css.md#5-responsive).

The rule that large elements shrink faster than small ones still decides which two steps to pick.

---

## 5. FOCUS, KEYBOARD AND SCREEN READERS

### M17. A focus indicator that survives forced colors

- **Rule:** Keep a visible focus indicator on every focusable control, using `:focus-visible` for the browser-selected ring and a boundary that stays visible in forced-colors mode.
- **Why:** A replacement drawn only as a shadow can disappear when the browser replaces author colours and drops shadows for boundaries, which leaves the keyboard user with no position.
- **When not to:** Add an explicit focus style when a programmatic focus change must always show an indicator, as [A5](web-accessibility-patterns.md#a5-focus-visible-styling) notes.
- **Pitfall:** `outline: none` with no replacement is a serious accessibility defect, and a replacement that depends on one visual channel fails the moment that channel is overridden.
- **Support:** Judgment, no version gate.
- **See also:** [A5](web-accessibility-patterns.md#a5-focus-visible-styling) and [A8](web-accessibility-patterns.md#a8-forced-colors).

### M18. Keyboard navigation in lists

- **Rule:** Make focusable elements in a sequential list navigable with `↑` and `↓`, and deletable with `⌘ Backspace`.
- **Why:** A list that only responds to Tab turns three items into three tab stops and a long list into a trap.
- **When not to:** Leave the native behaviour when the items are ordinary links inside a paragraph rather than a list widget.
- **Pitfall:** Arrow handlers that do not call `preventDefault` also scroll the page.
- **Support:** Judgment, no version gate.
- **See also:** [A3](web-accessibility-patterns.md#a3-roving-tabindex-and-active-descendant).

### M19. Dropdown open on mousedown

- **Rule:** Trigger a dropdown on `mousedown`, not `click`, so the menu is open by the time the button is released.
- **Why:** A click fires after the release, so the menu appears a beat later than the press the user already felt.
- **When not to:** Use `click` when the control also responds to keyboard activation, where `mousedown` never fires.
- **Pitfall:** A `click` handler adds a perceptible delay to every menu open, and the delay reads as lag rather than as caution.
- **Support:** Judgment, no version gate.
- **See also:** [web-elements-and-attributes.md](web-elements-and-attributes.md).

### M20. Names for icon-only controls and images

- **Rule:** Give an icon-only control an explicit name and an illustration built from HTML an explicit `aria-label`, following the name order in [A2](web-accessibility-patterns.md#a2-accessible-name-order). Always render a content image with `<img>`.
- **Why:** Without a name a screen reader announces an unlabeled button, an HTML illustration is read as its raw DOM tree and a background image is not read at all.
- **When not to:** Omit the name when the control already has visible text or a native label.
- **Pitfall:** An `aria-label` that differs from the visible text breaks speech input, as A2 notes.
- **Support:** Judgment, no version gate.
- **See also:** [A2](web-accessibility-patterns.md#a2-accessible-name-order).

### M21. Disabled controls and tooltips

- **Rule:** Never put a tooltip on a disabled control, and never put interactive content in a tooltip that opens on hover, for the reasons in [A14](web-accessibility-patterns.md#a14-tooltip).
- **Why:** A disabled control is not focusable, so its tooltip is unreachable by keyboard.
- **When not to:** Use a dialog or popover when the content needs controls.
- **Pitfall:** A tooltip that carries the control's only name leaves the control unnamed once the tooltip is dismissed.
- **Support:** Judgment, no version gate.
- **See also:** [A14](web-accessibility-patterns.md#a14-tooltip).

### M22. The nested menu prediction cone

- **Rule:** Treat the triangular area between the cursor and an open submenu as still inside the parent menu.
- **Why:** A diagonal path to the submenu otherwise crosses a sibling item and closes the menu the user was reaching for.
- **When not to:** Skip the cone when the submenu opens on click rather than hover, since there is no path to predict.
- **Pitfall:** A strict rectangular boundary makes the menu feel like it is fighting the cursor.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md) for menu keyboard behaviour.

---

## 6. MOTION AT THE IMPLEMENTATION LEVEL

The values that drive these items, including the duration bands and the easing choices, are in Section 10.

### M23. Theme swap suppression

- **Rule:** Suppress transitions and animations for the duration of a theme swap.
- **Why:** Otherwise every element with a transition animates at once and the swap reads as a flicker.
- **When not to:** Allow the transition when a single element is deliberately changing with the theme and nothing else moves.
- **Pitfall:** A global transition rule on `*` makes the theme swap the slowest moment in the session.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v19-dark-mode).

### M24. Frequent and low-novelty actions

- **Rule:** Give frequent, low-novelty actions no extraneous animation.
- **Why:** Context menus, list item operations and trivial button hovers repeat many times per session, so the animation becomes a tax paid on every one.
- **When not to:** Add motion when the action changes the layout in a way the user must follow.
- **Pitfall:** A tasteful 200ms hover that fires a hundred times an hour is the most expensive animation in the product.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset) for the full exclusion list.

### M25. Off-screen loops

- **Rule:** Pause a looping animation when it is off screen.
- **Why:** An off-screen loop keeps the compositor and the main thread busy for no visible benefit and drains the battery.
- **When not to:** Keep the loop running when its state must be current the instant it returns to view, such as a live chart.
- **Pitfall:** An off-screen carousel that keeps rotating arrives back on screen at the wrong item.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

### M26. Smooth in-page anchors

- **Rule:** Use `scroll-behavior: smooth` for in-page anchors, with an offset that accounts for a fixed header.
- **Why:** The smooth scroll keeps the reader oriented, while the offset stops the target heading from landing behind the header.
- **When not to:** Leave the jump instant for a target already on screen, where the movement adds nothing.
- **Pitfall:** A smooth scroll to a section under a fixed header stops with the heading hidden behind it.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) for scroll geometry.

---

## 7. PERFORMANCE

### M27. Large blur

- **Rule:** Avoid large `blur()` values on `filter` and `backdrop-filter`.
- **Why:** Both force an expensive offscreen pass whose cost grows with the blurred area.
- **When not to:** Use a large blur once on a static decorative layer that never repaints.
- **Pitfall:** A blurred backdrop on a scrolling header repaints on every frame.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

### M28. Banding on filled rectangles

- **Rule:** Use a radial gradient instead of scaling or blurring a filled rectangle.
- **Why:** Scaling or blurring a flat fill exposes the steps between adjacent colours as visible bands.
- **When not to:** Keep a flat fill when the surface is small enough that no band appears.
- **Pitfall:** A blurred box used as a glow shows rings on a wide-gamut display.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md) for colour ramps.

### M29. GPU promotion and `will-change`

- **Rule:** Use `transform: translateZ(0)` sparingly as a fix for a measured problem, and toggle `will-change` on for the duration of an unperformant scroll animation and off afterwards.
- **Why:** Both promote a layer, and a permanent promotion costs memory and can change how text is rasterized.
- **When not to:** Leave the element unpromoted when the animation already holds its frame budget.
- **Pitfall:** A permanent `will-change` is its own leak.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

### M30. Media autoplay and framework render loops

- **Rule:** Limit how many videos autoplay at once on iOS, and read real-time values such as pointer position through a ref rather than the render lifecycle in React.
- **Why:** Decoding several videos at once chokes a phone, and a pointer position kept in state re-renders the tree on every move.
- **When not to:** Keep the value in state when the rendered output actually depends on it.
- **Pitfall:** A pointer position in state drops frames on exactly the interaction that must feel smooth.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

### M31. Capability detection

- **Rule:** Detect hardware and network capability and adapt, rather than assuming a fast device.
- **Why:** The machine a change is built on is usually the fastest one that will run it.
- **When not to:** Skip the probe when the feature has a cheap fallback the browser applies on its own.
- **Pitfall:** A heavy effect that runs only on the developer's machine passes review and fails on a mid-range phone.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

---

## 8. FEEDBACK AND STATE

### M32. Optimistic update and rollback

- **Rule:** Update data locally first and roll back when the server reports an error.
- **Why:** The interface responds in the same frame as the input, which is what makes a click feel like it did something.
- **When not to:** Wait for the server when the action is irreversible or the result changes what the user sees next.
- **Pitfall:** A rollback with no message leaves the interface silently disagreeing with the server, and the next reload looks like data loss.
- **Support:** Judgment, no version gate.
- **See also:** [frontend-practice.md](frontend-practice.md#3-values-and-precedence).

### M33. Server-side authentication redirect

- **Rule:** Perform authentication redirects on the server before the client loads.
- **Why:** A client-side check renders protected content for a frame before the redirect, which is a flash of data the user should not see.
- **When not to:** Redirect on the client when the session expires while the page is already open. That redirect is UX only. The server still refuses every data request from the expired session, and the client clears any protected data it cached.
- **Pitfall:** A client-only guard shows the page shell and its data before the redirect lands.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md).

### M34. Selection styling

- **Rule:** Style `::selection`, and unset any gradient on `::selection` so selected text stays visible.
- **Why:** The default selection colour is chosen against the page background, so a custom text fill can make a selected run vanish into it.
- **When not to:** Leave the default when the text sits on an ordinary background and no custom selection colour is in use.
- **Pitfall:** Gradient text with no `::selection` rule makes the selected run disappear into the background.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md).

### M35. A favicon that follows the colour scheme

- **Rule:** Ship an SVG favicon with an inline style tag that follows `prefers-color-scheme`.
- **Why:** One file then serves both themes and the mark stays legible in a light or dark tab strip.
- **When not to:** Ship a single static favicon when the mark must not change with the theme.
- **Pitfall:** A dark favicon disappears in a dark tab strip.
- **Support:** Judgment, no version gate.
- **See also:** [A10](web-accessibility-patterns.md#a10-contrast-color-scheme-and-transparency-preferences).

### M36. Feedback beside its trigger

- **Rule:** Display feedback relative to its trigger. A copy button shows an inline checkmark, and a form error highlights the offending input.
- **Why:** Feedback far from its cause makes the user hunt for the connection.
- **When not to:** Use a page-level status region when the result belongs to the whole page rather than one control.
- **Pitfall:** A toast in the corner for a field error leaves the field looking valid.
- **Support:** Judgment, no version gate.
- **See also:** [A17](web-accessibility-patterns.md#a17-error-summary-and-focus-on-submit).

### M37. Empty states

- **Rule:** Prompt the user to create the first item, optionally with templates.
- **Why:** An empty surface is the one moment when the next action is not obvious, so it is the cheapest place to teach the product.
- **When not to:** Show a plain message when the user cannot create the item, such as a read-only view.
- **Pitfall:** An empty state that only says there are no results leaves the user with nothing to do.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md).

---

## 9. THE TWELVE ANIMATION PRINCIPLES

The principles say what motion should express. Section 10 says which values express it.

### M38. Squash and stretch

- **Rule:** Fake mass with momentary deformation, kept inside the 0.95 to 1.05 range.
- **Why:** Digital objects have no physics, so a small deformation is what tells the eye about weight, material and energy.
- **When not to:** Skip deformation on a large surface where the distortion reads as a layout bug.
- **Pitfall:** Too much squash and stretch turns professional software into a cartoon, which is why the bound exists.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset) for the physics item.

### M39. Anticipation

- **Rule:** Prepare the user for what comes next with a small cue before the main movement.
- **Why:** A pull-to-refresh gesture reveals a hint as the drag passes the threshold, and the elastic resistance says something will happen on release.
- **When not to:** Reserve anticipation for moments that matter, since a wind-up on every micro-interaction makes the product feel sluggish.
- **Pitfall:** Anticipation with no payoff trains the user to ignore the cue.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset).

### M40. Staging

- **Rule:** Bring one element into focus and dim the rest.
- **Why:** When a complex panel opens, the eye needs one landing point. If everything animates at once, the answer is nothing and attention scatters.
- **When not to:** Stage a group rather than one element when the group is the message, such as a set of totals arriving together.
- **Pitfall:** A modal that animates its title, body and footer at once has no focal point.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset) for the staging rules.

### M41. Straight ahead action and pose to pose

- **Rule:** Define the key moments, meaning the start, the end and occasionally a midpoint, and let the browser interpolate between them.
- **Why:** The web works pose to pose, so nailing the important states matters more than obsessing over every frame. The same reasoning says not everything needs to move, which is why a context menu used constantly animates on exit only.
- **When not to:** Use a continuous simulation when the motion answers to live input, where there are no fixed key states to define.
- **Pitfall:** Hand-tuned intermediate frames are wasted work the browser overwrites on the next interpolation.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset).

### M42. Follow through and overlapping action

- **Rule:** Let a spring carry the overshoot and settle that an easing curve cannot reproduce.
- **Why:** Nothing in nature moves as a rigid unit, so a small lag between parts reads as organic.
- **When not to:** Keep the stagger off critical paths, since too much of it makes the interface feel like it is thinking too hard.
- **Pitfall:** A long settle on a control the user must press again delays the second press.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset) for the spring choices.

### M43. Slow in and slow out

- **Rule:** Use `ease-out` for entrances, `ease-in` for exits and `ease-in-out` for deliberate movement such as a panel crossing the screen.
- **Why:** Nothing starts or stops instantly, so the curve is the cornerstone of a comfortable transition.
- **When not to:** Use `linear` only for progress or elapsed time, where a constant rate is the meaning.
- **Pitfall:** Linear motion on a state change reads as mechanical, which is why it is reserved for progress.
- **Support:** Judgment, no version gate.
- **See also:** [Section 10](#10-the-enforceable-motion-ruleset) for the full easing table.

### M44. Arcs

- **Rule:** Use a gentle curve for a hero moment or a playful interaction, and a straight line everywhere else.
- **Why:** Movement along a curve feels organic, while movement in a straight line feels mechanical.
- **When not to:** Arcs are hard to get right in a utilitarian interface, so a straight line is the correct default there.
- **Pitfall:** An arc applied to a list reorder reads as an accident rather than as style.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) for the hierarchy a playful moment must not disturb.

### M45. Secondary action

- **Rule:** Add a small flourish that supports the main action without stealing it, such as a checkmark that pops and then sparkles after a successful submit.
- **Why:** The sparkle is not the message. It reinforces the message, and sound can play the same role.
- **When not to:** Skip the flourish on a repeated action, where the reinforcement becomes the thing the user waits for.
- **Pitfall:** A secondary action that outshines the confirmation makes the user remember the sparkle and not the success.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) for emphasis and de-emphasis.

### M46. Timing

- **Rule:** Keep user-initiated interactions under 300ms and reuse one timing scale everywhere.
- **Why:** A tooltip at 150ms feels responsive and the same tooltip at 400ms feels broken. The information did not change, only the wait. If buttons animate at 200ms, every button animates at 200ms.
- **When not to:** Animation the user did not initiate can run longer, but it still needs a stated reason.
- **Pitfall:** Inconsistent timing creates a subconscious sense that something is wrong even when nobody can articulate it.
- **Support:** Judgment, no version gate.
- **See also:** [V4](web-visual-values.md#v4-motion-duration-bands).

### M47. Exaggeration

- **Rule:** Amplify motion past physical accuracy only in onboarding, empty states, confirmations and error notifications.
- **Why:** A theatrical gesture makes the point land in a moment the user will remember.
- **When not to:** Everywhere else it is noise.
- **Pitfall:** An exaggerated transition on a routine action turns a tool into a toy.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md).

### M48. Solid drawing

- **Rule:** Give depth with layered surfaces and CSS `perspective`, so a 3D transform has real depth rather than flat rotation.
- **Why:** Shadows suggest depth and layering implies hierarchy, which is how a flat screen reads as three-dimensional.
- **When not to:** Skip the 3D treatment when the element must read as flat, such as an icon inside a dense toolbar.
- **Pitfall:** An icon that rotates in 3D and then reads flat or inverted breaks the one model of depth the surface holds.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v21-one-light-source-for-raised-and-inset).

### M49. Appeal

- **Rule:** Treat appeal as the sum of the other eleven principles applied with care.
- **Why:** It is the difference between software people tolerate and software they recommend.
- **When not to:** Appeal is not a pass to add decoration to a surface whose structure is still wrong.
- **Pitfall:** Appeal chased as a separate layer of ornament reads as noise on top of a sound interface.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md).

---

## 10. THE ENFORCEABLE MOTION RULESET

These rules are checkable in a diff. They are grouped by what they govern.

### M50. When not to animate

- **Rule:** Do not animate high-frequency interactions, keyboard navigation, context menu entrances or theme switches.
- **Why:** A search input that reacts to every keystroke pays the animation cost on every keystroke, and focus movement must stay instant so the keyboard stays predictable.
- **When not to:** A context menu may animate on exit, which this rule permits, and its entrance stays instant.
- **Pitfall:** A `transition` on `*` or on a container animates all four cases by accident.
- **Support:** Judgment, no version gate.
- **See also:** [Section 6](#6-motion-at-the-implementation-level).

### M51. Reduced motion

- **Rule:** Wrap optional motion in `prefers-reduced-motion: no-preference` as [A9](web-accessibility-patterns.md#a9-reduced-motion) requires. Under `reduce`, replace movement with an instant change or a short opacity fade, and never auto-play motion.
- **Why:** A vestibular-sensitive user can be made ill by large movement, while a fade carries the state change without the travel. A native shell reads the platform setting, iOS Reduce Motion or Android Remove animations, through its accessibility API.
- **When not to:** Keep essential feedback such as progress and a state change in both modes.
- **Pitfall:** A global animation reset can remove a loading spinner and leave no progress cue, which is the trap A9 names.
- **Support:** Judgment, no version gate.
- **See also:** [A9](web-accessibility-patterns.md#a9-reduced-motion).

### M52. Timing bands

- **Rule:** Choose a duration from the band that matches the interaction, and never let a user-initiated animation exceed 300ms.
- **Why:** A fixed set of bands makes the interface feel consistent and stops each component from inventing its own sense of speed. When something feels slow, shorten the duration before touching the curve, because the curve shapes the ends while the duration sets the wait.
- **When not to:** Animation the user did not initiate can run longer, but it still needs a stated reason.
- **Pitfall:** A unique duration per component makes the interface feel inconsistent even when each value looks smooth alone.
- **Support:** Judgment, no version gate.
- **See also:** [V4](web-visual-values.md#v4-motion-duration-bands).

| Interaction | Duration |
|---|---|
| Press and hover | 120 to 180ms |
| Small state change such as a toggle, dropdown or tooltip | 180 to 260ms |
| Layout transition such as a modal, drawer or accordion | up to 500ms |
| Context menu | no entrance animation, exit only |
| Stagger between similar items | under 50ms per item |
| Similar elements | identical timing values, no exceptions |

### M53. Easing and springs

- **Rule:** Pick the curve from the situation, and reserve `linear` for progress or elapsed time.
- **Why:** An easing curve describes a start and an end, while a spring describes a force, so only the spring can be interrupted and redirected mid-flight.
- **When not to:** Use an easing curve for a system state change, where an overshoot would report a state the system never entered.
- **Pitfall:** A spring used for a toggle overshoots past the on state and suggests the value is still settling.
- **Support:** Judgment, no version gate.
- **See also:** [V4](web-visual-values.md#v4-motion-duration-bands).

| Situation | Use |
|---|---|
| Entrance | `ease-out` |
| Exit | `ease-in` |
| View or mode transition | `ease-in-out` |
| Progress or elapsed time | `linear`, and nothing else uses linear |
| System state change | an easing curve |
| Gesture-driven motion such as drag, flick or swipe | a spring |
| Interruptible motion | a spring |
| Overshoot and settle | a spring, not an easing curve |
| Decay of a value over time | an exponential ramp, not a linear one |

### M54. Spring release velocity and parameters

- **Rule:** Pass the input velocity into the spring when a gesture ends, and keep the parameters balanced.
- **Why:** The release preserves the energy the user put in, and a balanced spring settles rather than oscillating.
- **When not to:** Use a curve when the motion has no input velocity to carry.
- **Pitfall:** `stiffness: 1000, damping: 5` oscillates like a toy, while something near `stiffness: 500, damping: 30` settles.
- **Support:** Judgment, no version gate.
- **See also:** [V4](web-visual-values.md#v4-motion-duration-bands).

### M55. Physics

- **Rule:** Give every interactive element an `:active` state with a scale transform and keep deformation inside 0.95 to 1.05. Scale the value to the trigger so a dialog enters from about `0.8` while a button presses to about `0.96`.
- **Why:** Without an `:active` state the control feels unresponsive under the finger, and a fixed deformation reads wrong at both ends of the size range.
- **When not to:** Skip the press scale on a control whose whole surface is the feedback, such as a full-screen map.
- **Pitfall:** `scale(0.8)` on a tap is a cartoon.
- **Support:** Judgment, no version gate.
- **See also:** [frontend-practice.md](frontend-practice.md#3-values-and-precedence) for the shared interaction rules.

### M56. Staging rules

- **Rule:** Animate one element prominently at a time and give every animated element an explicit `z-index`. Dim the background of a modal or dialog rather than using a transparent overlay.
- **Why:** Two competing animations split attention and neither reads. A transparent scrim isolates nothing, and an overlay without a `z-index` renders behind the content it must cover.
- **When not to:** Show two movements at once when they are one gesture, such as a sheet and its backdrop moving together.
- **Pitfall:** A tooltip or overlay without a `z-index` disappears behind the content it must cover.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md#l2-stacking-context-triggers).

### M57. Reconciling the duration guidance

- **Rule:** Resolve the competing ceilings by what each one measures, which is direct feedback, user-initiated state change or layout transition.
- **Why:** They are measuring different things, so the disagreement is real rather than a rounding difference.
- **When not to:** Do not average the ceilings into one number, since that value is too slow for feedback and too fast for a layout transition.
- **Pitfall:** Taking the 200ms figure as a global ceiling makes a drawer feel rushed, and taking 500ms as a global ceiling makes a press feel dead.
- **Support:** Judgment, no version gate.
- **See also:** [V4](web-visual-values.md#v4-motion-duration-bands).

| Guidance | Values |
|---|---|
| Direct feedback ceiling | not more than 200ms, for interactions to feel immediate |
| This ruleset | 300ms ceiling, 120 to 180ms press and hover, 180 to 260ms small state |
| Layered bands | 100 to 150ms feedback, 200 to 300ms state change, 300 to 500ms layout transition |

The 200ms figure is about direct feedback, meaning the response to a press or hover, where any perceptible lag reads as unresponsiveness. The 300ms ceiling is about user-initiated state changes, which are allowed slightly more room because something visibly changed. The 300 to 500ms band covers layout transitions such as a drawer or modal, which do not block a further input.

The consistency rule outranks all of these. A single value reused everywhere beats a perfectly tuned value used once.

Use this resolution:

- **Direct feedback** for press, hover or tap: 120 to 180ms. Never above 200ms.
- **State change** for a toggle, dropdown, tooltip or tab: 180 to 260ms. Never above 300ms.
- **Layout transition** for a modal, drawer or accordion: up to 500ms, and only when it is not blocking the next input.
- **One earned entrance** per surface may run 500 to 800ms. Repeated page-load choreography is not earned.

---

## 11. REFERENCES AND RELATED RESOURCES

- [web-visual-values.md](web-visual-values.md) holds the spacing, type, colour and elevation scales, and [V4](web-visual-values.md#v4-motion-duration-bands) holds the duration bands this file enforces.
- [web-accessibility-patterns.md](web-accessibility-patterns.md) holds the widget contracts, the focus-visible contract in A5, the forced-colors rule in A8 and the reduced-motion rule in A9.
- [web-visual-hierarchy.md](web-visual-hierarchy.md) holds the hierarchy method, the UX laws behind the hit-area and feedback items, and the visual review pass.
