---
title: Web Internationalization
description: HTML language and direction, bidirectional text, locale formatting and translation-tolerant layout.
trigger_phrases:
  - "html direction and bidi text"
  - "javascript locale formatting"
  - "translation tolerant layout"
importance_tier: important
contextType: implementation
version: 1.0.2.0
---

# Web Internationalization

HTML language and direction, bidirectional text, locale formatting and translation-tolerant layout.

---

## 1. OVERVIEW

### Purpose

This file keeps browser language, direction and locale formatting mechanics. Support summaries use the web-features Baseline classifications and browser-version data.

### When to Use

- Setting language tags or text direction
- Isolating bidirectional text
- Following the writing mode or mirroring directional icons
- Formatting dates, numbers and plurals by locale
- Testing layouts for translated text growth

### Boundaries

- Baseline web markup rules: [web-markup-and-css.md](web-markup-and-css.md).
- Logical property mechanics and writing modes: [web-layout-and-sizing.md](web-layout-and-sizing.md).
- Element and attribute mechanics for `lang`, `dir` and `translate`: [web-elements-and-attributes.md](web-elements-and-attributes.md).

---

## 2. LANGUAGE AND DIRECTION

### I1. Language tags

- **Rule:** Set a valid BCP 47 `lang` on the document and on inline spans whose language differs from the surrounding text.
- **Why:** Browsers and assistive technology use language metadata for pronunciation, hyphenation, spellcheck and language-aware selectors.
- **When not to:** Omit a local override when the phrase uses the surrounding language.
- **Pitfall:** A correct document language does not identify a foreign-language name or phrase inside an otherwise different-language paragraph.
- **Support:** Baseline widely available since 2018-01-29 (web-features `lang-attr`). Chrome 1 / Firefox 1 / Safari ≤4.
- **See also:** [MDN: lang global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)

### I2. Direction and automatic direction

- **Rule:** Set `dir="rtl"` for a right-to-left document and use `dir="auto"` for user-provided strings with unknown direction.
- **Why:** Automatic direction follows the first strong directional character, while an explicit document direction controls the page's base writing direction.
- **When not to:** Keep the inherited direction when a string is known to follow the surrounding content.
- **Pitfall:** Under `dir="auto"`, an Arabic username that begins with a Latin brand name is treated as left-to-right, because the first strong character decides. Digits are weak and do not decide.
- **Support:** Baseline widely available since 2018-01-29 (web-features `dir`). Chrome 1 / Firefox 1 / Safari 3.
- **See also:** [MDN: dir global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)

### I3. Bidirectional isolation

- **Rule:** Wrap interpolated user text in `<bdi>` or isolate an inline span with `unicode-bidi: isolate`.
- **Why:** Isolation keeps the embedded text's directional ordering from affecting adjacent text and punctuation.
- **When not to:** Skip an isolate when the embedded text is already in a separate block with its own direction.
- **Pitfall:** An RTL name interpolated into an LTR sentence can move the trailing punctuation to the wrong visual side.
- **Support:** Baseline widely available since 2022-07-15 (web-features `bdi`). Chrome 16 / Firefox 10 / Safari 6.
- **See also:** [MDN: bdi element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi)

---

## 3. LAYOUT AND DIRECTIONAL ICONS

### I4. Logical properties and writing modes

- **Rule:** Use the CSS mapping in [web-layout-and-sizing.md](web-layout-and-sizing.md#6-logical-properties) when dimensions and edges must follow the writing mode.
- **Why:** The layout reference owns the physical-to-logical property mechanics and their interaction with writing modes.
- **When not to:** Keep physical coordinates for intentionally physical surfaces such as a canvas whose origin is fixed to the left edge.
- **Pitfall:** Mixing physical and logical sides in one rule lets declaration order choose the edge in one direction and a different edge in another.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: CSS logical properties and values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)

### I5. Directional icon mirroring

- **Rule:** Mirror arrows and chevrons whose meaning follows inline reading direction, and keep direction-neutral or physical icons unchanged.
- **Why:** Directional icons encode forward or backward movement, while a logo, clock, checkmark or media control keeps the same meaning in either writing direction.
- **When not to:** Do not mirror an icon whose symbol depicts a fixed physical object or an invariant action.
- **Pitfall:** Mirroring a play or checkmark icon reverses a symbol whose meaning does not depend on text direction.
- **Support:** Judgment, no version gate.
- **See also:** [W3C International: Script direction and languages](https://www.w3.org/International/questions/qa-scripts)

---

## 4. LOCALE FORMATTING

### I6. Intl formatting and plural categories

- **Rule:** Pass the active locale explicitly to `Intl.DateTimeFormat`, `NumberFormat`, `PluralRules`, `RelativeTimeFormat`, `ListFormat`, `Collator`, `Segmenter` and `DisplayNames`.
- **Why:** An explicit locale keeps formatting aligned with the app language instead of the browser's unrelated default. `PluralRules` exposes locale-specific categories, including six categories in Arabic and few or many categories in Polish.
- **When not to:** Use a locale-independent representation when the value is an identifier or machine protocol field rather than reader-facing text.
- **Pitfall:** A `count === 1` branch assumes two plural forms and fails for languages with additional categories.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

### I7. Date-only parsing

- **Rule:** Parse date-only values as calendar dates in the intended locale and time zone instead of converting them through UTC timestamps.
- **Why:** JavaScript parses an ISO date-only string such as `2026-11-02` at UTC midnight, which can display as the previous local date in a negative offset.
- **When not to:** Use a timestamp when the input represents an exact instant rather than a calendar date.
- **Pitfall:** Calling `toISOString().slice(0, 10)` on a local date can serialize a different calendar day.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

---

## 5. TRANSLATION-TOLERANT TEXT

### I9. Expansion and pseudo-localization

- **Rule:** Test layouts with pseudo-localized text and leave room for German and Dutch strings that can grow by about 30 to 35 percent.
- **Why:** Translation changes word length and line breaks, which can push fixed-width controls past their available space.
- **When not to:** Use a fixed measure only when the content has a documented hard limit, such as a machine identifier.
- **Pitfall:** A button that fits the source language can clip its translated label when its width is fixed.
- **Support:** Judgment, no version gate.
- **See also:** [MDN: Localization and plurals](https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals)
