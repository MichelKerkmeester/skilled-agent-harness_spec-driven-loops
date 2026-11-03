---
title: Web Accessibility Patterns
description: Widget contracts, focus handling and browser accessibility preferences for web interfaces.
trigger_phrases:
  - "web accessibility patterns"
  - "aria widget keyboard behavior"
  - "browser accessibility preferences"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Web Accessibility Patterns

The web layer keeps native element choice and baseline semantics in [`web-markup-and-css.md`](web-markup-and-css.md). This file covers widget behavior, focus and browser accessibility preferences.

---

## 1. MODAL DIALOG CONTRACT

Support summaries use the web-features Baseline classifications and browser-version data.

### A1. Modal dialog

**Rule.** Use native `<dialog>` with `showModal()` or a component library's documented modal behavior.
**Why.** These mechanisms provide top-layer placement, Escape handling, focus containment and an inert background.
**When not to.** Use a non-modal dialog when the surrounding page must remain interactive.
**Pitfall.** Setting `aria-modal="true"` on an ordinary element hides the rest of the page from assistive technology without making the page inert.
**Support.** Baseline widely available since 2024-09-14 (web-features `dialog`). Chrome 37 / Firefox 98 / Safari 15.4.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

---

## 2. LIBRARY MAPPING

| Pattern | Integration boundary |
|---|---|
| Modal dialog | Close through the dialog lifecycle so focus returns to the opener. |
| Menu button | Use a disclosure and navigation list for site navigation; a menu role promises menu keyboard behavior. |
| Tabs, listbox or combobox | Do not add tabindex values or arrow-key handlers when a component manages roving focus; treat its autocomplete as a combobox and do not redeclare supplied roles. |
| Accordion, disclosure or tooltip | Keep expanded state aligned; disabled controls may not receive focus, and a tooltip cannot be the only label. |
| Status region, table or grid | Keep the live region mounted before changing its text; set `aria-sort` on the sorted header when needed. |
| Focus styling | Keep a visible replacement if an outline is removed. |

When a component library provides widget roles, state, focus movement or announcements, use that behavior as the source of truth. For hand-written widgets, implement the complete pattern described below.

## 3. NAMES AND FOCUS

### A2. Accessible name order

**Rule.** Prefer `aria-labelledby` that points to visible text, and preserve the order `aria-labelledby`, `aria-label`, host-language label, then `title`.
**Why.** A higher-priority naming source replaces lower-priority sources in the computed accessible name.
**When not to.** Omit ARIA naming attributes when a native label already provides the intended name.
**Pitfall.** An `aria-label` of `Send` replaces visible `Submit` text and can break speech input that uses the visible label.
**Support.** Judgment, no version gate.
**See also.** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Accessible_name_calculation

### A3. Roving tabindex and active descendant

**Rule.** Use roving tabindex for items that move DOM focus, and use `aria-activedescendant` when focus stays on a text input.
**Why.** Roving tabindex moves browser focus, while `aria-activedescendant` exposes an active child without moving focus from its owner.
**When not to.** Use neither pattern for ordinary links or buttons that already provide the needed keyboard behavior.
**Pitfall.** The active descendant must reference a rendered element with a stable ID, so virtualized options can leave a dangling reference.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

### A4. Focus return through the dialog reference

**Rule.** Close a library-managed overlay through its documented lifecycle so it can restore focus to the opener.
**Why.** The component lifecycle can return focus after the modal leaves the top layer.
**When not to.** Focus a logical successor when the opener no longer exists after the interaction.
**Pitfall.** Removing a dialog through application state can bypass the component lifecycle and leave focus on `body`.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

### A5. Focus-visible styling

**Rule.** Use `:focus-visible` for browser-selected focus styling and retain a clear keyboard focus indicator.
**Why.** The browser tracks input modality and matches the selector when it determines a focus indicator is needed. Use [CS9](web-cascade-and-selectors.md#cs9-existing-state-selector-contract) for the state-selector contract that applies to focus styling.
**When not to.** Add an explicit focus state when a programmatic focus change must always display a ring.
**Pitfall.** Programmatic focus may not match `:focus-visible`, even when the newly focused container needs an indicator.
**Support.** Baseline widely available since 2024-09-14 (web-features `focus-visible`). Chrome 86 / Firefox 85 / Safari 15.4.
**See also.** https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible

### A6. Inert background

**Rule.** Set `inert` on the background while a custom modal is open, and leave the modal subtree interactive.
**Why.** Inert removes descendants from sequential focus and interaction, while `aria-hidden` only changes the accessibility tree.
**When not to.** Do not set `inert` when the surface is a non-modal overlay that leaves the page usable.
**Pitfall.** Applying `inert` to the overlay itself makes its controls unreachable.
**Support.** See [EA4](web-elements-and-attributes.md#ea4-inert-background-boundary) for browser support.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

---

## 4. ANNOUNCEMENTS AND PREFERENCES

### A7. Live-region timing

**Rule.** Mount a live-region container before updating its text, set `aria-atomic="true"` when the whole message must be read and reserve assertive announcements for interrupting errors.
**Why.** Assistive technology observes changes to an existing live region and may miss a region created with its first message.
**When not to.** Do not add a live region to content already announced through ordinary navigation or focus movement.
**Pitfall.** Recreating an alert region for each render can repeat the same message or fail to announce it.
**Support.** Judgment, no version gate.
**See also.** https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live

### A8. Forced colors

**Rule.** Use system colors such as `Canvas`, `CanvasText`, `Highlight` and `HighlightText` for essential text, and use borders rather than shadows for boundaries in forced-colors mode.
**Why.** The browser can replace author colors and remove background images when forced colors are active.
**When not to.** Use `forced-color-adjust: none` only when preserving a specific color is necessary to convey meaning.
**Pitfall.** Hard-coded SVG fills and shadow-only borders can disappear from the high-contrast presentation.
**Support.** Baseline widely available since 2025-03-12 (web-features `forced-colors`). Chrome 89 / Firefox 89 / Safari 16.
**See also.** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors

### A9. Reduced motion

**Rule.** Put optional motion inside `prefers-reduced-motion: no-preference` and keep progress feedback available in both modes.
**Why.** The default path remains safe when the preference is unknown or reduced, while the opt-in applies motion only to users who allow it.
**When not to.** Do not add an animation when a state change is already clear without motion.
**Pitfall.** A global animation reset can remove a loading spinner and leave no visible progress cue.
**Support.** Baseline widely available since 2022-07-15 (web-features `prefers-reduced-motion`). Chrome 74 / Firefox 63 / Safari 10.1.
**See also.** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

### A10. Contrast, color scheme and transparency preferences

**Rule.** Set `color-scheme` for supported themes, honor contrast preferences, and treat reduced-transparency styling as a feature-detected enhancement over an opaque baseline.
**Why.** The media preferences expose user display choices, while `color-scheme` lets browser controls adapt to the declared theme.
**When not to.** Keep the opaque baseline when the interface has no transparency effect to reduce.
**Pitfall.** Depending on `prefers-reduced-transparency` alone leaves Safari users without the fallback, and Firefox support requires a preference flag.
**Support.** Baseline widely available since 2024-11-30 (web-features `prefers-contrast`). Chrome 96 / Firefox 101 / Safari 14.1.
**Support.** Baseline widely available since 2022-07-15 (web-features `prefers-color-scheme`). Chrome 76 / Firefox 67 / Safari 12.1.
**Support.** Baseline widely available since 2024-08-03 (web-features `color-scheme`). Chrome 98 / Firefox 96 / Safari 13.
**Support.** Baseline limited availability (web-features `prefers-reduced-transparency`). Chrome 119 / Firefox unsupported / Safari unsupported.
**See also.** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast

---

## 5. WIDGET PATTERNS

### A11. Carousel

**Rule.** Provide a visible rotation control, pause rotation on hover and focus and set `aria-live="off"` while it rotates.
**Why.** Rotation changes content without user input, so a pause control and controlled announcements preserve predictable navigation.
**When not to.** Omit rotation controls when the carousel never rotates automatically.
**Pitfall.** Previous and next buttons without labels leave their direction unclear to screen-reader users.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

### A12. Table and grid

**Rule.** Use a native table for static data and use `role="grid"` only when the widget implements its full keyboard interaction model.
**Why.** A grid role promises managed focus and keyboard navigation beyond a table's row and column relationships.
**When not to.** Use a grid when users edit, select or navigate cells as an interactive widget.
**Pitfall.** A sortable table needs `aria-sort` on the currently sorted header.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/grid/

### A13. Menu button

**Rule.** Pair `aria-haspopup="menu"` and `aria-expanded` with Up or Down to open, Home and End, typeahead, Escape to close and return focus and Tab to close.
**Why.** The menu-button pattern exposes a popup menu whose items use composite-widget keyboard behavior.
**When not to.** Use a disclosure button and navigation list for site navigation.
**Pitfall.** Applying `role="menu"` to ordinary site navigation changes assistive-technology expectations without supplying menu keyboard behavior.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

### A14. Tooltip

**Rule.** Give supplemental content `role="tooltip"`, associate its trigger through `aria-describedby`, show it on hover and focus and let Escape dismiss it.
**Why.** The described-by relationship makes the tooltip's supplemental text available when the trigger receives focus.
**When not to.** Use a dialog or popover when the content contains interactive controls.
**Pitfall.** A tooltip on a disabled control may never appear, and a tooltip cannot provide the control's only name.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

---

## 6. FORMS AND VALIDATION

### A15. Angular owns constraint validation

**Rule.** For forms handled by a framework validation layer, render app feedback and confirm whether the framework disables native browser validation. Keep native constraint attributes so the framework can read them.
**Why.** A framework may add `novalidate` or otherwise replace browser validation bubbles while still using attributes such as `required` and `min` as validator inputs.
**When not to.** Use browser-native validation when its message UI is the intended path.
**Pitfall.** `setCustomValidity()` does not restore browser validation UI while `novalidate` remains on the form.
**Support.** Judgment, no version gate.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation

### A16. Error association in Angular Material and hand-written fields

**Rule.** Inside a component library's form-field wrapper, let the library associate its error and hint messages. In a hand-written field, bind the visible message ID and invalid state to the control.
**Why.** A library may add message IDs to the input's `aria-describedby` list and update its `aria-invalid` state. For a hand-written field, give each message an ID, reference it from the control and set the invalid state when validation fails.
**When not to.** Do not add a duplicate `aria-describedby` ID or invalid-state binding when the component already manages both.
**Pitfall.** A library may show an error when a control is invalid and touched or when the form is submitted. A hand-written component that shows errors only when dirty behaves differently.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/tutorials/forms/notifications/

### A17. Error summary and focus on submit

**Rule.** After a failed submit, focus the first invalid control or an error summary that links to each invalid control.
**Why.** The summary gives assistive technology users one place to review errors and jump to the affected fields.
**When not to.** A single-field form, such as a search box, can keep focus on its field and show the inline error there.
**Pitfall.** After a submit handler calls `markAllAsTouched()`, focus remains on the submit button unless code moves it. Newly rendered error text is not automatically announced.
**Support.** Judgment, no version gate.
**See also.** https://www.w3.org/WAI/tutorials/forms/notifications/

### A18. Async validator pending state

**Rule.** Block submission while a form is pending as well as when it is invalid. Expose validation progress with `aria-busy` on the field group or a polite status message.
**Why.** An asynchronous validator can leave a form pending while both its valid and invalid states are false.
**When not to.** A form with no async validators needs only the `invalid` check.
**Pitfall.** A submit check that reads only `form.invalid` can run before async validation finishes. A disabled control leaves the tab order and is excluded from the form's aggregate value.
**Support.** Judgment, no version gate.
**See also.** https://angular.dev/api/forms/AbstractControl
