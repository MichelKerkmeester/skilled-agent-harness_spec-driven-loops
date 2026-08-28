---
title: Accessibility — Source-Verified, Not Session-Verified
description: What AccessibilityDefects.test.ts actually proves — focus rings, dialog roles, aria-labels, non-color urgency glyphs, and a live-region announcement — and the explicit caveat that no screen-reader session has run against this plugin.
trigger_phrases:
  - "obsidian plugin accessibility"
  - "accessibilitydefects.test.ts coverage"
  - "focus ring 9 surface roots"
  - "dialog role aria-modal panel"
  - "no screen reader session has run"
  - "urgency glyph deuteranope"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Accessibility — Source-Verified, Not Session-Verified

`src/views/accessibility-defects.test.ts` proves eight specific accessibility fixes exist in
source and in `styles.css`. This reference is exactly what it proves, and the standing caveat
that source verification is not the same as a real assistive-technology session.

---

## 1. OVERVIEW

### Core Principle

Every item this test checks is a static assertion — a string, a regex, or a stylesheet selector
match. It proves the code contains the right attribute or rule; it does not prove a screen reader
announces it correctly, that focus actually traps, or that the touch target measures 44px on a
real device. Treat every claim sourced from this test as "source shows it," never as "verified
with assistive technology," until someone runs one.

### When to Use

- Adding or modifying a dialog-like panel (peek, detail panel, any future modal)
- Adding a selection checkbox or other control that needs an `aria-label`
- Touching the urgency/status color classes
- Reporting an accessibility claim and needing to know what backs it

### Key Sources

- `src/views/accessibility-defects.test.ts` — the eight-item static suite
- `styles.css` — `--db-accent-focus-ring` and the `.urgency-*` glyph rules it asserts against
- `src/views/table-record-peek.ts`, `src/views/record-detail-panel.ts` — the two dialog-role panels

---

## 2. WHAT THE SUITE PROVES

| Item | Claim | How it's checked |
| --- | --- | --- |
| 1 & 3 | A baseline focus ring (`box-shadow: var(--db-accent-focus-ring)`) extends across all 9 surface roots (`.note-database-container`, `.note-database-modal`, `.note-database-settings`, `.db-color-picker-popup`, `.db-icon-picker-popover`, `.db-dropdown-popover`, `.db-cell-option-popover`, `.formula-workbench-modal`, `.db-chart-drilldown-modal`) | `styles.css` string containment |
| 2 | `.db-icon-picker-search:focus-visible` carries the same focus-ring box-shadow | regex against `styles.css` |
| 4 | The peek-panel open button is keyboard reachable — no `tabindex="-1"`, carries `aria-label` | string checks against `TableRecordPeek.ts` |
| 5 | `TableRecordPeek` and `RecordDetailPanel` both set `role="dialog"` and `aria-modal="true"` on their panel element; `RecordDetailPanel` also sets a title-derived `aria-label` | string checks against both files |
| 6 | Selection checkboxes in Board, Gallery, and List renderers carry descriptive `aria-label`s (group key, row filename, or a fallback "no group"/"total" label) | string checks against the three renderer files |
| 7 | Urgency classes (`.urgency-red`, `.urgency-orange`, `.urgency-green`) supply a non-color `::before` glyph for deuteranope clarity — color is never the sole indicator | `styles.css` string containment |
| 8 | Drag-drop feedback announces transactional outcomes through an `aria-live="polite"` region | a mocked-DOM behavioral test against `DragDropFeedbackState` |

`--db-accent-focus-ring` resolves to `0 0 0 2px var(--background-primary), 0 0 0 4px
var(--interactive-accent))` (`styles.css:123`) — a two-layer ring visible against both light and
dark host themes because its inner layer matches the background rather than the page.

---

## 3. WHAT IT DOES NOT PROVE

- **No screen-reader session has run.** `specs/public/HANDOVER.md` (plugin repository) states
  this explicitly for the broader accessibility work this test partially covers: "No screen-reader
  session and no on-device run has happened... treat any accessibility claim here as static
  analysis until someone runs VoiceOver, TalkBack, or NVDA against it." That caveat applies to
  every claim in this reference too.
- **No WCAG contrast test exists in this tree.** Unlike `sk-code-mobile-cli`'s `contrast.test.ts`
  (arithmetic 4.5:1 / 3:1 checks), this plugin has no equivalent automated contrast suite — colors
  route through Obsidian's own theme variables (`theme-variables.md`), which is a reasonable
  contrast argument but not a measured one.
- **No touch-target-size test exists.** `mobile-and-touch.md` documents `isTouchDevice(...)` and
  the 760px layout breakpoint; no automated check measures actual rendered hit-target dimensions
  against the conventional 44px minimum.
- **Two-level card keyboard traversal (Enter/F2 into a card, arrows between fields, Escape out)
  is covered only against a mock DOM**, per `specs/public/HANDOVER.md` — it has not been
  exercised against Obsidian's real re-render cycle.

---

## 4. RELATED REFERENCES

- `mobile-and-touch.md` — the touch-target and long-press interaction model this test does not
  measure directly.
- `theme-variables.md` — the Obsidian color variables the focus ring and urgency glyphs build on.
- `verification.md` — where `AccessibilityDefects.test.ts` sits inside the 386-test `vitest run`
  gate.
