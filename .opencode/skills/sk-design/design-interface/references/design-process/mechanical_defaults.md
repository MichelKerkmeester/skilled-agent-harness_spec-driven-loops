---
title: "Mechanical Anti-Default Checklist (the layout gate)"
description: "The mechanical layout gate the aesthetic calibration omits: the 2-3 line hero plus max-width fix, gapless bento math, the meta-label and eyebrow ban, button contrast, and section spacing. Pass or fail checks that catch the structural AI tells a taste read cannot."
trigger_phrases:
  - "mechanical layout defaults"
  - "hero line count fix"
  - "gapless bento math"
  - "eyebrow and meta-label ban"
  - "button contrast check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Mechanical Anti-Default Checklist

The aesthetic direction in `design_principles.md` decides whether a surface is distinctive. This reference decides whether it is mechanically broken. The two are different jobs. A page can pass the taste read, a memorable signature, a grounded palette, a justified risk, and still ship a four-line hero, a bento grid with a dead cell, and an eyebrow above every section. Those are structural defaults the model reaches for by reflex, and they read as AI no matter how good the direction is.

Each check below is binary. It passes or it fails. Run them on any built or planned interface before calling the work done. This is the layout gate that the audit mode also references, so author the rules here once and let audit point at them rather than restate them.

The Brand-vs-Product posture is set first in `../../../shared/register.md`. These mechanical checks hold for both postures, the register only changes how loud the surface is allowed to be, never whether a hero may overflow or a button may hide its own label.

---

## 1. OVERVIEW

### What this gate is for

The model has a stable set of layout reflexes. It wraps headlines into tall walls because it reaches for a narrow container. It leaves blank cells in a grid because it sized the grid before it counted the content. It stamps a small uppercase label above every section because landing pages "do that". It ships button text the same color as the button. None of these are taste failures. They are mechanical failures, and a mechanical pass or fail catches them where a subjective read does not.

### How to run it

Walk every section of the surface against Sections 2 through 6. A single fail means the surface is not done, fix it before delivering. Where a check is countable (eyebrow instances, bento cells, headline lines), count it, do not estimate it. Where a check is a ratio (button contrast), compute it against the real background the element sits on, not against white.

### What it does not cover

This gate does not judge palette, type pairing, signature, or whether the direction is distinctive, that is `design_principles.md`. It does not cover copy quality or mock data plausibility, that is `copy_and_mock_data.md`. It does not cover the objective accessibility and performance floor beyond the few a11y checks that are also layout defaults, that is `ux_quality_reference.md`. Keep the boundaries clean so each reference owns one job.

---

## 2. THE HERO: 2-3 LINE RULE AND THE MAX-WIDTH FIX

The hero is where the narrow-container reflex does the most damage. The fix is mechanical and it is two coupled moves: cap the line count and widen the container.

- **Headline caps at 2 lines on desktop, 3 at the absolute outside.** Four lines is always a font-size error, never a copy-length error. A four, five, or six line headline is a hard fail.
- **The fix is a wider container plus a smaller clamp, not a line break.** Let the words flow horizontally. Reach for a wide measure on the headline (a large `max-w`, or the full content width) and bring the clamp ceiling down so the line count falls out naturally. Do not hand-insert `<br>` tags to fake a 2-line wrap, that breaks at the next viewport.
- **Clamp ceiling.** Keep the display clamp max at or under roughly 6rem (about 96px). Above that the page is shouting, not designing. Default range for most heroes is a mid scale that grows with the viewport, reserve the top of the scale for headlines of three to five words only.
- **Subtext caps at 20 words and 3-4 lines.** If the value proposition does not fit in 20 words, the value proposition is unclear, the rule is not too tight.
- **The whole hero fits the first viewport.** Headline, subtext, and the primary CTA are visible without scrolling. Never push the CTA below the fold.
- **Top padding caps at about 6rem at desktop.** More than that floats the hero content halfway down the viewport and reads as a layout bug. If the hero needs more air, grow the type or the asset, not the top padding.
- **Hero stack stays at or under 4 text elements.** At most one small label (an eyebrow or a brand strip, pick zero or one), the headline, the subtext, and the CTAs (one primary, at most one secondary). A trust micro-strip, a pricing teaser, a feature bullet list, and a tagline under the CTAs all move to dedicated sections below the hero.

**Pass check (mechanical):** count the rendered headline lines at desktop and at the narrowest target width. Count the subtext words. Confirm the CTA is above the fold. If any of those exceed the caps, fail.

---

## 3. THE GAPLESS BENTO: CELL MATH

A bento is a grid of mixed-size tiles. The reflex failure is a grid with a hole in it, a blank cell in the middle or a missing corner, because the grid was shaped before the content was counted. The opposite reflex failure is a uniform card grid pretending to be a bento. Both fail.

- **Cell count equals content count exactly.** Three items means three cells (a 1+2 split, a 2+1, an asymmetric trio). Five items means five cells (2+3, 3+2, a hero plus four). If a cell is empty, the grid was planned wrong, re-shape it, never paste a blank tile to fill the hole.
- **The interlock is verified, not assumed.** Confirm the column spans and row spans actually tile with no gap. When the engine supports a dense flow, use it so tiles backfill, but still confirm the math, dense flow hides a miscount, it does not fix it.
- **A bento is not a uniform card grid.** Equal-size cells with icon, heading, and text repeated across the row is the identical-card-grid default, not a bento. A real bento varies tile size and composition. If every cell is the same size and the same internal layout, it has collapsed into the card-grid tell.
- **Cells carry visual variation.** At least two or three cells in any multi-cell grid need real variation: a real image, a brand-appropriate gradient, a pattern, or a tinted background. An all-text grid of same-colored cells reads as boring default even when the rest of the page is strong.
- **Rhythm, not one-sided repetition.** Do not stack six left-image right-text rows. Alternate full-width feature rows, asymmetric tile sizes, and vertical breaks.

**Pass check (mechanical):** count content items, count grid cells, confirm they are equal with zero empty cells. Confirm at least two cells differ in size or composition from the rest. If counts differ or every cell is identical, fail.

---

## 4. THE META-LABEL AND EYEBROW BAN

The eyebrow is the single most violated layout default. An eyebrow is the small uppercase wide-tracked label sitting above a section headline. Its signature is tiny tracked uppercase text, sometimes monospace, naming the section ("SELECTED WORK", "THE HARDWARE", "PROCESS"). Every AI-built site stamps one above every section, which is the definition of a tell.

- **At most one eyebrow per three sections.** The hero counts as one. A nine-section page may use at most three eyebrows total. If one section has an eyebrow, the next two cannot.
- **The mechanical count.** Count instances of the small-caps tracked label above headlines across all sections. If the count is greater than `ceil(sectionCount / 3)`, fail. This is a count, not a judgment.
- **What to do instead is usually nothing.** The headline alone is enough. The section's position on the page already categorizes it. Drop the eyebrow rather than reword it.
- **Numbered section markers are the same tell one tier deeper.** `01 / About`, `002 / Capabilities`, `06 / how it works` above every section is scaffolding by reflex. Numbers earn their place only when the section genuinely is a sequence (a real ordered process, a typed timeline) and the order carries information the reader needs. One deliberate numbered sequence on one page is voice, numbered markers on every section are AI grammar.
- **Sibling meta-labels are banned too.** Version stamps in the hero (`V0.6`, `BETA`, `INVITE-ONLY`) unless the brief is a launch. Brand-and-number sub-eyebrows (`Brand / No. 01 / The 6-quart`). Range labels as eyebrows (`Index of Work, 2018-2026`). Generic step labels (`Stage 1 / Stage 2`, `Phase 01 / Phase 02`), the step content is the label. Decoration text strips at the hero bottom (`BRAND. MOTION. SPATIAL.`). Scroll cues (`Scroll`, `Scroll to explore`). Locale, city, time, and weather strips unless the brief is genuinely place-focused or globally distributed.
- **The middle dot is rationed.** At most one `·` per metadata line. It is not the default separator for everything. Prefer line breaks, hairlines, or columns.
- **Decorative status dots are off by default.** A colored dot before nav items, list rows, or badges is a tell. Use one only for real semantic state (a live server flag) and sparingly.

**Pass check (mechanical):** count eyebrows, confirm the count is at or under `ceil(sectionCount / 3)`. Sweep for numbered section markers, version stamps, generic step labels, scroll cues, and decoration strips. Any default-reflex meta-label that is not earned by real sequence or real status is a fail.

---

## 5. BUTTON CONTRAST AND CTA DISCIPLINE

A button that hides its own label is the most embarrassing mechanical fail because it is invisible to a taste read and obvious to a user. Check every interactive control against the surface it actually sits on.

- **Every button text passes contrast against its own background.** Body-size label needs a ratio of at least 4.5 to 1, large text (about 18px or bold 14px and up) needs at least 3 to 1. White button with white text, a transparent button over the page with no border, a ghost button over a photo with no scrim, all banned. Compute the ratio against the real background, not against an assumed white.
- **Ghost buttons over imagery get a backdrop.** A scrim, a stroke, or a solid fill. Text floating directly over a photograph fails at the first bright frame.
- **CTA labels fit on one line at desktop.** A label that wraps to two or three lines is broken. Fix by shortening the label (three words max for a primary CTA, ideally one or two) or widening the button. Do not artificially constrain the CTA width.
- **One label per intent across the whole page.** "Get in touch", "Contact us", "Let's talk", and "Start a project" are one intent, pick one label and use it in the nav, the hero, and the footer. Two CTAs with the same intent on one page is a fail. The same holds for "Try free" plus "Get started" plus "Sign up free", and for "View work" plus "See selected work".
- **Form controls pass the same bar.** Inputs, placeholder text, focus rings, helper text, and error text all clear contrast against the section background. A light placeholder on a near-white form, a label grayer than 4.5 to 1, all banned. Label sits above the input, error text below it, never placeholder-as-label.

**Pass check (mechanical):** for each button and form control, compute the text-to-background contrast ratio against its real background and confirm it clears the threshold. Confirm no CTA label wraps at desktop. List the intents on the page and confirm one label per intent. Any failure is a fail.

---

## 6. SECTION SPACING AND LAYOUT REPETITION

Spacing and repetition are where a page either reads as composed or as a stack of identical blocks.

- **Sections breathe with generous, varied vertical spacing.** Major sections get real vertical padding so they read as distinct chapters, not a cramped stack. Vary the rhythm rather than applying one identical gap everywhere, equal padding on every section is its own flatness.
- **Optical spacing over mathematical spacing.** Bottom padding often needs to be slightly larger than top to look balanced. Centering by the math does not always look centered, icons next to text and text inside buttons often need a 1 to 2px optical nudge.
- **Concrete optical examples stay tiny.** Asymmetric icons like stars, arrows, and carets may need a small nudge or an SVG fix to look centered. A play triangle often shifts right about 2px. In an icon-text button, the icon-side padding often lands 2px tighter than the text-side padding (`icon-side padding = text-side padding - 2px`).
- **A layout family appears at most once per page.** Once a section uses a layout family (three-column cards, full-width quote, split text and image), that family cannot return. An eight-section page uses at least four different layout families. "Selected work" must not look like "What we do".
- **The zigzag cap is two.** Alternating left-image right-text then left-text right-image is fine for two sections in a row. The third consecutive image-and-text split is a fail. Break it with a full-width section, a vertical stack, a bento, or a marquee.
- **The split-header pattern is off by default.** A big left headline with a small explainer paragraph floating in the right column is banned as a default section header. Give a section one focused message, stack the headline and body vertically at a readable measure. Reach for the split only when the right column carries a real visual or interactive element, not filler text.
- **A max-width container holds the page.** Content does not stretch edge to edge on wide screens. Use a content container (roughly 1200 to 1440px) with auto margins.
- **Navigation renders on one line at desktop, height at or under 80px.** If items do not fit at the large breakpoint, condense labels, drop secondary items, or move to a hamburger. A two-line desktop nav is broken. A nav that eats 15% of the viewport is broken.
- **Mobile collapse is explicit per section.** For every multi-column layout, declare the narrow-viewport fallback in the same component. No "the framework handles it" assumptions.

**Pass check (mechanical):** confirm a max-width container is present. List the layout family of each section and confirm at most one repeat per family and at most two consecutive zigzag splits. Confirm the nav is one line at desktop. Confirm each multi-column section names its mobile fallback. Any failure is a fail.

---

## 7. THE MECHANICAL SWEEP (RUN BEFORE DELIVERY)

Run this as the last filter. Every box is binary. A single unchecked box means the surface is not done.

- [ ] Hero headline is 2 lines (3 at the outside) at desktop and at the narrowest target width.
- [ ] Hero container is wide and the clamp ceiling is at or under about 6rem, no hand-inserted `<br>` in the headline.
- [ ] Hero subtext is at or under 20 words and 3-4 lines, the primary CTA is above the fold.
- [ ] Hero top padding is at or under about 6rem, the hero holds at or under 4 text elements.
- [ ] Bento cell count equals content count, zero empty cells, the interlock is verified.
- [ ] The grid is a real bento (varied tile size and composition), not a uniform card grid, with two or more cells carrying visual variation.
- [ ] Eyebrow count is at or under `ceil(sectionCount / 3)`, hero counted as one.
- [ ] No numbered section markers, version stamps, generic step labels, scroll cues, decoration strips, or locale strips that are not earned by real sequence or real status.
- [ ] Every button and form control passes contrast against its real background, no wrapped CTA at desktop, one label per intent.
- [ ] A max-width container holds the page, the nav is one line at desktop at or under 80px.
- [ ] At most one repeat per layout family, at most two consecutive zigzag splits, no default split-header.
- [ ] Every multi-column section declares its mobile collapse.

If a single box cannot be honestly checked, fix it before delivering.

---

## 8. RELATED RESOURCES

- [`design_principles.md`](./design_principles.md) owns the aesthetic direction and the anti-default mandate. This gate is the structural complement, it catches what a taste read cannot.
- [`copy_and_mock_data.md`](./copy_and_mock_data.md) owns the content gate: plausible copy, mock data, one copy register, image-seed discipline.
- [`brief_to_dials.md`](./brief_to_dials.md) owns the Design Read intake that sets variance, motion, and density before these mechanical checks apply.
- [`ux_quality_reference.md`](./ux_quality_reference.md) owns the full objective accessibility and performance floor beyond the layout defaults checked here.
- [`../../../shared/register.md`](../../../shared/register.md) sets the Brand-vs-Product posture first, these mechanical checks hold for both postures.
- The audit mode references this gate rather than restating it. Author the mechanical rules here once.
