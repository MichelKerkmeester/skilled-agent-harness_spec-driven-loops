---
title: Accessibility Quick Fixes
description: Snippet-level accessibility fixes the audit report cites by reference. Accessible names, keyboard, focus and dialogs, semantics, forms and errors, live-region announcements, contrast and motion.
trigger_phrases:
  - "accessibility quick fixes"
  - "a11y snippet fixes"
  - "accessible name fix"
  - "focus trap fix snippet"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Accessibility Quick Fixes

A snippet-level fix reference for common accessibility defects found during design audits.

## 1. OVERVIEW

### Purpose

This is a fix-reference card, not a workflow. This card is the snippet layer underneath `../references/accessibility-performance.md`: the smallest correct change for each common defect.

### Usage

When the audit files an accessibility finding, it points the owner here for the concrete shape of the fix, then `sk-code` makes the change once the user accepts it. The audit cites these snippets, it does not apply them. The priority order, the user-impact framing, plus the contrast and touch numbers all live in `../references/accessibility-performance.md`. Two rules hold across every fix below. Prefer native HTML before adding ARIA, because a real `button` beats a div wearing a role. And keep the change minimal, because an accessibility fix is a targeted repair, not a license to refactor the surrounding component.

---

## 2. ACCESSIBLE NAMES

Every interactive control needs a name a screen reader can announce.

| Defect | Fix |
|---|---|
| Icon-only button with no name | Add `aria-label`, hide the glyph with `aria-hidden="true"` |
| Input, select or textarea with no label | Associate a `<label for>`, or use `aria-label` when no visible label fits |
| Link text that says "click here" or "read more" | Rewrite to name the destination |
| Decorative icon announced as content | Add `aria-hidden="true"` |

```html
<button aria-label="Close"><svg aria-hidden="true">...</svg></button>
```

---

## 3. KEYBOARD ACCESS

Every action reachable by mouse must be reachable by keyboard.

| Defect | Fix |
|---|---|
| `div` or `span` wired as a button | Use a native `button`, which brings focus and key handling for free |
| Control not reachable by Tab | Make it a native interactive element or give it the correct role and tabindex of 0 |
| `tabindex` greater than 0 | Remove it, fix the source order instead |
| Overlay that traps the user | Make Escape close it |

```html
<!-- before --> <div onclick="save()">Save</div>
<!-- after -->  <button type="button" onclick="save()">Save</button>
```

---

## 4. FOCUS AND DIALOGS

A dialog that mismanages focus strands keyboard and screen-reader users.

| Defect | Fix |
|---|---|
| Focus escapes an open modal | Trap focus inside the dialog while it is open |
| Focus lost when a dialog closes | Restore focus to the trigger that opened it |
| Dialog opens with focus nowhere useful | Set initial focus to the first control or the heading |
| Page jumps when a dialog opens | Open without an unexpected scroll |

```html
<div role="dialog" aria-modal="true" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Confirm</h2>
  <!-- trap focus here, restore to trigger on close -->
</div>
```

---

## 5. SEMANTICS

Native semantics carry meaning that role hacks have to rebuild by hand.

| Defect | Fix |
|---|---|
| Role-based widget where a native element exists | Use the native element first |
| A role with its required attributes missing | Add the attributes the role demands, or drop the role |
| List markup built from divs | Use `ul` or `ol` with `li` |
| Heading levels skipped | Keep the heading order unbroken |
| Data table without header cells | Use `th` for headers, with `scope` when needed |

---

## 6. FORMS AND ERRORS

Form errors must reach the field, the screen reader and the user at the same moment.

| Defect | Fix |
|---|---|
| Error text not linked to its field | Link it with `aria-describedby` |
| Invalid field not flagged to assistive tech | Set `aria-invalid="true"` on the field |
| Required field not announced | Mark it required, not by color alone |
| Helper text floating loose | Associate it with the input by id |
| Disabled submit with no reason | Explain why the action is unavailable |

```html
<input id="email" aria-describedby="email-err" aria-invalid="true" />
<span id="email-err">Email addresses need an @ symbol.</span>
```

---

## 7. LIVE-REGION ANNOUNCEMENTS

A change a sighted user sees must also be a change a screen-reader user hears.

| Defect | Fix |
|---|---|
| Critical form error shown visually only | Place it in an `aria-live` region |
| Loading state silent to assistive tech | Use `aria-busy` or status text |
| Toast is the only channel for critical information | Add a persistent, non-toast path as well |
| Expand and collapse state not announced | Add `aria-expanded` and `aria-controls` to the trigger |

```html
<div aria-live="polite" role="status">Saving your changes...</div>
```

---

## 8. CONTRAST AND STATES

Meaning must survive low vision, and it must not depend on color alone. The pass and fail ratios and the touch-target size live in `../references/accessibility-performance.md`. Measure against those numbers, do not eyeball a contrast fix.

| Defect | Fix |
|---|---|
| Text or icon below the contrast floor | Raise the foreground or lower the background to meet the ratio in the reference |
| Hover-only interaction with no keyboard path | Give the same affordance a focus and keyboard equivalent |
| Disabled or status state shown by color alone | Add a label, an icon or text alongside the color |
| Focus outline removed | Replace it with a visible focus style, never remove without a replacement |

---

## 9. MOTION

Non-essential motion must yield to a user who has asked for less of it.

| Defect | Fix |
|---|---|
| Non-essential animation ignores the user preference | Honor `prefers-reduced-motion` |
| Media autoplays with sound | Remove autoplay, or start muted with a control |
| Speech video with no captions | Provide captions when the speech carries meaning |

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. HOW THE REPORT USES THIS CARD

1. The audit files the accessibility finding with its evidence and severity from `../references/audit-contract.md`.
2. The finding points at the matching section here for the fix shape.
3. The owner is `foundations` for a token-level fix such as contrast, otherwise `sk-code` for the markup change.
4. The audit stops at naming the fix. Applying it is `sk-code` work after the user accepts the recommendation.
