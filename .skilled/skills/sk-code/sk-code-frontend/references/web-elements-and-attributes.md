---
title: Web Elements and Attributes
description: HTML element and attribute behavior for dialogs, popovers, forms, media hints and document language.
trigger_phrases:
  - "html dialog and popover behavior"
  - "form submission attributes"
  - "html resource loading attributes"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Web Elements and Attributes

This file keeps the detailed HTML element and attribute mechanics. The baseline web markup rules remain in [web-markup-and-css.md](web-markup-and-css.md).

---

## 1. OVERLAYS

### EA1. Modal and non-modal dialog APIs

**Rule.** Call `showModal()` for a modal `<dialog>`, and call `show()` only when the page must stay interactive. Treat `closedby` as an enhancement, feature-detect it and keep Escape plus an explicit close button available.
**Why.** `showModal()` places the dialog in the top layer, creates a `::backdrop`, moves focus into the dialog and keeps sequential focus inside it. Escape dispatches a cancel request that closes the dialog unless the handler prevents it. `show()` does not make the rest of the page inert or establish modal focus behavior.
**When not to.** Use `show()` for a non-modal prompt that leaves the surrounding page usable.
**Pitfall.** Setting `aria-modal="true"` after calling `show()` does not create modal focus behavior.
**Support.** Baseline widely available since 2024-09-14 (web-features `dialog`). Chrome 37 / Firefox 98 / Safari 15.4.
**Support.** Baseline limited availability (web-features `dialog-closedby`). Chrome 134 / Firefox 141 / Safari unsupported.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog

### EA2. Popover states and invokers

**Rule.** Use `popover="auto"` for light-dismiss behavior or `popover="manual"` when the project owns dismissal, and connect declarative controls with `popovertarget`. Feature-detect the `source` option and `popover="hint"`; keep an explicit anchor and an auto or manual popover path.
**Why.** An auto popover joins the browser's auto popover stack and closes on light dismissal. A manual popover stays open until code or an explicit control closes it. `showPopover({ source })` can set the invoker as the implicit anchor for CSS anchor positioning.
**When not to.** Use a dialog when the surface needs modal focus behavior or blocks the page behind it.
**Pitfall.** `popover="hint"` can layer hint popovers without replacing an open auto popover, but its support is not uniform across the declared browsers.
**Support.** Baseline newly available since 2025-01-27 (web-features `popover`). Chrome 116 / Firefox 125 / Safari 17.
**Support.** Baseline: no web-features entry. Chrome 137 / Firefox 144 / Safari 26.
**Support.** Baseline limited availability (web-features `popover-hint`). Chrome 151 / Firefox 153 / Safari unsupported.
**See also.** https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using

---

## 2. DISCLOSURE AND INERT CONTENT

### EA3. Exclusive details and find-in-page content

**Rule.** Use `<summary>` as the first child of `<details>`, and share a `name` only when one-open-at-a-time disclosure is intended.
**Why.** The summary is the disclosure's activation control, and details elements with the same name form an exclusive group. When `hidden="until-found"` is supported, listen for `beforematch` to reveal a containing disclosure before the browser scrolls to a match. Keep an explicit reveal control as the baseline.
**When not to.** Leave details elements unnamed when readers need to compare several open sections.
**Pitfall.** Removing or collapsing a hidden ancestor after `beforematch` can hide the found text again before the browser scrolls to it. The `beforematch` compatibility row is unconfirmed, so keep an explicit reveal control.
**Support.** Baseline newly available since 2024-09-03 (web-features `details-name`). Chrome 120 / Firefox 130 / Safari 17.2.
**Support.** Baseline limited availability (web-features `hidden-until-found`). Chrome 102 / Firefox 148 / Safari unsupported.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden

### EA4. Inert background boundary

**Rule.** Set `inert` only on the background subtree that must stop receiving focus and interaction while a custom modal is open.
**Why.** The attribute makes descendant controls unavailable for focus and user interaction until it is removed. See [A6](web-accessibility-patterns.md#a6-inert-background) for the modal decision about when the background needs this boundary.
**When not to.** Do not inert the background for a non-modal surface that leaves page controls usable.
**Pitfall.** If the overlay sits inside the subtree marked `inert`, its own controls become unavailable too.
**Support.** Baseline widely available since 2025-10-11 (web-features `inert`). Chrome 102 / Firefox 112 / Safari 15.5.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert

---

## 3. INPUT AND SUBMISSION ATTRIBUTES

### EA5. Keyboard hints and autocomplete tokens

**Rule.** Set `inputmode` for the expected data, `enterkeyhint` for the next action and `autocomplete` for the field's actual purpose.
**Why.** Keyboard hints influence the virtual keyboard without validating the value. Autocomplete tokens let browsers and credential managers identify fields by meaning. Use `username`, `current-password`, `new-password`, `one-time-code` and `webauthn` for sign-in, password, verification and passkey flows. Use `cc-name`, `cc-given-name`, `cc-additional-name`, `cc-family-name`, `cc-number`, `cc-exp`, `cc-exp-month`, `cc-exp-year`, `cc-csc` and `cc-type` for payment-card fields. Use `tel-national` for a national phone number and `address-line1`, `address-line2` or `address-line3` for separate address lines.
**When not to.** Omit a keyboard hint when the default keyboard already fits the input and its next action.
**Pitfall.** Using `autocomplete="off"` on sign-in or payment fields can block useful credential or payment autofill.
**Support.** Baseline widely available since 2024-06-07 (web-features `inputmode`). Chrome 66 / Firefox 95 / Safari 12.1.
**Support.** Baseline widely available since 2024-05-02 (web-features `enterkeyhint`). Chrome 77 / Firefox 94 / Safari 13.1.
**Support.** Baseline: no web-features entry. Chrome Unknown / Firefox Unknown / Safari Unknown.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

### EA6. Form owner and submitter overrides

**Rule.** Set `form` when a control belongs to a form elsewhere in the document, and read the activated submitter's override when handling submission.
**Why.** A control's `form` attribute associates it with a form by ID. The submitter's `formaction` overrides the owning form's `action` for that submission.
**When not to.** Omit these attributes when every control is inside its form and all submitters share one destination.
**Pitfall.** Reading only `form.action` ignores a submit button's `formaction` destination.
**Support.** Judgment, no version gate.
**See also.** https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm

---

## 4. LINKS, EMBEDS AND RESOURCE HINTS

### EA7. Link isolation and request credentials

**Rule.** Add `rel="noopener noreferrer"` to a new-tab link when it must not control the opener, and choose `referrerpolicy` and `crossorigin` for the request's privacy and CORS needs. Common referrer policy values include `no-referrer`, `origin` and `strict-origin-when-cross-origin`.
**Why.** `noopener` removes the new browsing context's access to its opener. `noreferrer` also suppresses the referrer. `crossorigin` selects how a media request uses CORS credentials.
**When not to.** Keep the referrer when the destination depends on it for a documented analytics or return-flow contract.
**Pitfall.** Adding `noreferrer` without checking the destination can remove attribution that the product expects.
**Support.** Baseline widely available since 2024-03-20 (web-features `referrer-policy`). Chrome 85 / Firefox 87 / Safari 15.
**Support.** Baseline: no web-features entry. Chrome 13 / Firefox 8 / Safari 6.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener

### EA8. Image loading and decoding hints

**Rule.** Treat `fetchpriority` as a scheduler hint, `loading` as a fetch timing hint and `decoding` as a display scheduling hint.
**Why.** These attributes affect different stages of image work and do not replace reserved dimensions or correct source selection.
**When not to.** Leave default priority on ordinary images that are neither urgent nor a known loading bottleneck.
**Pitfall.** Lazy-loading an image that becomes the largest contentful paint delays the page's primary visual response. See the [LCP resource rule](web-performance-and-loading.md#p1-largest-contentful-paint-resource).
**Support.** Baseline newly available since 2024-10-29 (web-features `fetch-priority`). Chrome 103 / Firefox 132 / Safari 17.2.
**Support.** Baseline widely available since 2026-06-19 (web-features `loading-lazy`). Chrome 77 / Firefox 121 / Safari 16.4.
**Support.** Baseline: no web-features entry. Chrome 65 / Firefox 63 / Safari 11.1.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img

### EA9. Document language and translation hints

**Rule.** Keep `lang`, `dir` and `translate` aligned with the language and direction of the content.
**Why.** These attributes expose language and text direction to browser features and assistive technology, while `translate="no"` marks names or code that machine translation should retain. Inline language, bidirectional text and locale formatting details are in [web-internationalization.md](web-internationalization.md#1-language-and-direction).
**When not to.** Do not set a local language or direction override when the text follows the surrounding passage.
**Pitfall.** A missing inline language or direction override can make a short foreign phrase render or sound incorrectly inside otherwise correct page metadata.
**Support.** Baseline widely available since 2018-01-29 (web-features `lang-attr`). Chrome 1 / Firefox 1 / Safari ≤4.
**Support.** Baseline widely available since 2018-01-29 (web-features `dir`). Chrome 1 / Firefox 1 / Safari 3.
**Support.** Baseline widely available since 2025-09-14 (web-features `translate`). Chrome 19 / Firefox 111 / Safari 6.
**See also.** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang

---

## 5. SUPPORT

Support summaries show each feature's web-features Baseline classification and browser versions.

| Feature | Chrome | Firefox | Safari | Baseline |
|---|---:|---:|---:|---|
| Dialog | 37 | 98 | 15.4 | widely available since 2024-09-14 (web-features `dialog`) |
| `closedby` | 134 | 141 | unsupported | limited availability (web-features `dialog-closedby`) |
| Popover auto/manual | 116 | 125 | 17 | newly available since 2025-01-27 (web-features `popover`) |
| Popover source option | 137 | 144 | 26 | Baseline: no web-features entry. |
| Popover hint | 151 | 153 | unsupported | limited availability (web-features `popover-hint`) |
| Details `name` | 120 | 130 | 17.2 | newly available since 2024-09-03 (web-features `details-name`) |
| `hidden="until-found"` | 102 | 148 | unsupported | limited availability (web-features `hidden-until-found`) |
| `inert` | 102 | 112 | 15.5 | widely available since 2025-10-11 (web-features `inert`) |
| `inputmode` | 66 | 95 | 12.1 | widely available since 2024-06-07 (web-features `inputmode`) |
| `enterkeyhint` | 77 | 94 | 13.1 | widely available since 2024-05-02 (web-features `enterkeyhint`) |
| `autocomplete` tokens | Unknown | Unknown | Unknown | Baseline: no web-features entry. |
| `referrerpolicy` | 85 | 87 | 15 | widely available since 2024-03-20 (web-features `referrer-policy`) |
| `crossorigin` | 13 | 8 | 6 | Baseline: no web-features entry. |
| `fetchpriority` | 103 | 132 | 17.2 | newly available since 2024-10-29 (web-features `fetch-priority`) |
| `loading` | 77 | 121 | 16.4 | widely available since 2026-06-19 (web-features `loading-lazy`) |
| `decoding` | 65 | 63 | 11.1 | Baseline: no web-features entry. |
| `lang` | 1 | 1 | ≤4 | widely available since 2018-01-29 (web-features `lang-attr`) |
| `dir` | 1 | 1 | 3 | widely available since 2018-01-29 (web-features `dir`) |
| `translate` | 19 | 111 | 6 | widely available since 2025-09-14 (web-features `translate`) |
