---
title: Web Cascade and Selectors
description: CSS cascade order, selector specificity and modern selector behavior.
trigger_phrases:
  - "css cascade layer order"
  - "css selector specificity"
  - "native css nesting"
importance_tier: important
contextType: implementation
version: 1.0.2.0
---

# Web Cascade and Selectors

How the CSS cascade decides between declarations, and how modern selectors match and weigh.

---

## 1. OVERVIEW

### Purpose

This file covers cascade order, selector specificity and modern selector behavior, one rule per mechanism.

### When to Use

- Changing how competing declarations resolve across origin, cascade layers, specificity and source order.
- Rewriting a selector that relies on `:is()`, `:where()` or `:has()` matching, or on a specificity calculation.
- Adding native nesting or an `@scope` boundary to existing selectors.
- Registering a custom property with `@property`.

### Boundaries

- **Baseline CSS architecture.** The baseline CSS architecture rules remain in [web-markup-and-css.md](web-markup-and-css.md).
- **State selectors.** The state selector contract is owned by [web-markup-and-css.md Section 7](web-markup-and-css.md#7-css-architecture), and the visible keyboard focus rule by [web-accessibility-patterns.md A5](web-accessibility-patterns.md#a5-focus-visible-styling).

---

## 2. CASCADE AND SPECIFICITY

### CS1. Cascade decision order

- **Rule:** Resolve competing declarations by origin and importance, layer order, specificity, scope proximity when scoped rules apply, then source order.
- **Why:** The cascade compares these criteria in order, so a later rule cannot win by source order when an earlier criterion already decided the result.
- **When not to:** Skip the comparison when the declarations do not apply to the same element and property.
- **Pitfall:** Normal unlayered declarations outrank normal declarations in named layers, while important declarations reverse layer precedence.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)

### CS2. Global cascade layer order

- **Rule:** Declare the cascade layer order once in a global stylesheet before component styles load.
- **Why:** Layer order is established the first time each layer name appears. Component style injection can vary with load order, so per-component layer blocks cannot define a reliable shared order.
- **When not to:** Use unlayered styles only when the app deliberately relies on the unlayered precedence boundary.
- **Pitfall:** A deeply scoped rule inside a layer loses to an unlayered rule even when its selector looks stronger.
- **Support:** Baseline widely available since 2024-09-14 (web-features `cascade-layers`). Chrome 99 / Firefox 97 / Safari 15.4.
- **See also:** [MDN: CSS cascade layers (@layer)](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)

### CS3. Specificity arithmetic

- **Rule:** Count IDs, class-like selectors and type selectors in separate specificity columns before changing a selector.
- **Why:** IDs add to the first column, classes, attributes and pseudo-classes add to the second, and type selectors and pseudo-elements add to the third. A component-scoping attribute such as `[data-scope]` adds one class-like unit.
- **When not to:** Do not raise specificity when the actual conflict comes from origin, importance or cascade layer order.
- **Pitfall:** A selector such as `.card[data-scope]` has specificity `0-2-0`, not `0-1-0`.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

---

## 3. SELECTOR LOGIC

### CS4. Zero-specificity and maximum-argument selectors

- **Rule:** Wrap low-priority defaults in `:where()` and use `:is()` when the matching alternatives should share the strongest argument's specificity.
- **Why:** `:where()` contributes zero specificity, while `:is()` contributes the specificity of its most specific argument.
- **When not to:** Keep a direct class selector when the alternatives would obscure which component states match.
- **Pitfall:** Adding a high-specificity selector to one `:is()` alternative raises the specificity of the entire selector.
- **Support:** Baseline widely available since 2023-07-21 (web-features `is`). Chrome 88 / Firefox 82 / Safari 14. Baseline widely available since 2023-07-21 (web-features `where`). Chrome 88 / Firefox 82 / Safari 14.
- **See also:** [MDN: :is()](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)

### CS5. Narrow relational matching with :has()

- **Rule:** Keep `:has()` selectors narrow and close to the component that owns the matching relationship.
- **Why:** The browser reevaluates relational matches as the relevant DOM changes, and a broad ancestor selector can increase style invalidation work.
- **When not to:** Prefer an existing direct selector when the relationship is already represented by a simple parent or sibling structure.
- **Pitfall:** A broad rule such as `body:has(.is-open)` makes unrelated subtree changes relevant to a page-level selector.
- **Support:** Baseline widely available since 2026-06-19 (web-features `has`). Chrome 105 / Firefox 121 / Safari 15.4.
- **See also:** [MDN: :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)

---

## 4. NESTING, SCOPE AND PROPERTIES

### CS6. Native nesting and the nesting selector

- **Rule:** Use `&` to make the parent selector explicit inside native CSS nesting.
- **Why:** The nesting selector represents the full parent selector, so `&:hover` and `.theme &` express relationships without Sass-style string concatenation.
- **When not to:** Keep a selector flat when nesting would hide its reach or increase selector complexity.
- **Pitfall:** `&-active` does not append a suffix to a class name as it would in Sass.
- **Support:** Baseline widely available since 2026-06-11 (web-features `nesting`). Chrome 120 / Firefox 117 / Safari 17.2.
- **See also:** [MDN: Using CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting)

### CS7. Scoped selector boundaries

- **Rule:** Use `@scope` to limit a rule to a component subtree when the required browsers support it.
- **Why:** Scoped rules stop at the declared scope boundary, and scope proximity breaks a tie after specificity without changing the selector's specificity.
- **When not to:** Use the established component scoping mechanism when a target browser does not support `@scope`.
- **Pitfall:** A scope boundary does not prevent unscoped rules from matching the same descendants. In Safari 26.0 through 26.3, rules inside `@scope` do not apply to `<input>` and `<textarea>`; support is complete from 26.4.
- **Support:** Baseline newly available since 2026-03-24 (web-features `scope`). Chrome 143 / Firefox 146 / Safari 26.4.
- **See also:** [MDN: CSS @scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)

### CS8. Registered custom properties

- **Rule:** Register a custom property with `@property` when its type, inheritance behavior or animation behavior must be explicit.
- **Why:** Registration gives the browser a syntax, an `inherits` setting and an initial value, which lets typed values interpolate during animation.
- **When not to:** Keep an unregistered property when it only carries an inherited token and needs no typed animation.
- **Pitfall:** A registered property with the wrong `inherits` value can stop a theme token from reaching its descendants.
- **Support:** Baseline newly available since 2024-07-09 (web-features `registered-custom-properties`). Chrome 85 / Firefox 128 / Safari 16.4.
- **See also:** [MDN: CSS @property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)

### CS9. Existing state selector contract

- **Rule:** Follow the state selector contract in [web-markup-and-css.md Section 7](web-markup-and-css.md#7-css-architecture).
- **Why:** The web layer already owns how exposed state reaches CSS selectors, so this file does not define a second state source. See [A5](web-accessibility-patterns.md#a5-focus-visible-styling) for the visible keyboard focus rule.
- **When not to:** Use a class for a visual-only state that has no semantic state in the markup.
- **Pitfall:** A store-owned `.is-open` class can drift from the expanded state already present on the control.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

---

## 5. SUPPORT

Support summaries show each feature's web-features Baseline classification and browser versions.

| Feature | Chrome | Firefox | Safari | Baseline |
|---|---:|---:|---:|---|
| `@layer` | 99 | 97 | 15.4 | widely available since 2024-09-14 (web-features `cascade-layers`) |
| `:is()` and `:where()` | 88 | 82 | 14 | widely available since 2023-07-21 (web-features `is`); widely available since 2023-07-21 (web-features `where`) |
| `:has()` | 105 | 121 | 15.4 | widely available since 2026-06-19 (web-features `has`) |
| Native nesting | 120 | 117 | 17.2 | widely available since 2026-06-11 (web-features `nesting`) |
| `@scope` | 143 | 146 | 26.4 | newly available since 2026-03-24 (web-features `scope`) |
| `@property` | 85 | 128 | 16.4 | newly available since 2024-07-09 (web-features `registered-custom-properties`) |
