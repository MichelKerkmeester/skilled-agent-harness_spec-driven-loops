---
title: "Diagram Palette Derivation Record"
description: "Classifies every diagram-skin color value as hand-picked, derived by a stated rule, never re-themed or exempt, and records the rule or source behind each."
trigger_phrases:
  - "palette derivation record"
  - "color value origins"
  - "diagram token derivation"
importance_tier: important
contextType: reference
version: 1.1.0.4
---

# Diagram Palette Derivation Record

Where every diagram-skin color comes from, and what stays fixed when the skin changes.

---

## 1. OVERVIEW

Every color role the diagram skin themes appears in exactly one of three lists: LIGHT (§2), DARK (§3) and TERMINAL (§4). Every value in those lists is exactly one of four kinds:

- **primary**: a value chosen by hand, stated verbatim. A re-theme replaces primaries and nothing else.
- **derived**: computed from a primary by a stated rule, for example `ink` at an alpha. This is stricter than the style guide's prose, which also calls `soft` and `link` "derived" although no rule reproduces them.
- **fixed**: a value that never re-themes. Onboarding and hand-edits of the skin leave it untouched.
- **untokenized** used to be a fourth kind, applying to files rather than values: it marked a file exempt from this record because it carried its own fixed skin. The key is gone. The one file that held the exemption carried a tone the dark skin never defined, at 4.44:1 under the text gate, so the exemption was hiding a defect rather than recording a decision; repointing that tone onto the dark muted role emptied the list and the key went with it. Every form now regenerates from this record.

The opt-in series palette for multi-series charts lives in the style guide, not here. The applicator of a later phase reads this record, and the corpus checker re-derives every value marked **derived** from the primaries recorded here.

---

## 2. LIGHT

| Role | Value | Kind | Rule or source |
|---|---|---|---|
| `paper` | `#f5f5f5` | primary | White-smoke from the five-color brand palette |
| `paper-2` | `#ececec` | primary | Hand-picked, one step darker than `paper` |
| `ink` | `#2d3142` | primary | Jet-black from the brand palette |
| `muted` | `#4f5d75` | primary | Blue-slate from the brand palette |
| `soft` | `#7a8399` | primary | Hand-picked, a lighter slate in the blue-slate family |
| `rule` | `rgba(45,49,66,0.12)` | derived | `ink` at 0.12 |
| `rule-solid` | `rgba(79,93,117,0.25)` | derived | `muted` at 0.25; the templates' value, which settles the disagreement |
| `accent` | `#eb6c36` | primary | Atomic-tangerine from the brand palette |
| `accent-tint` | `rgba(235,108,54,0.08)` | derived | `accent` at 0.08 |
| `link` | `#2e5aa8` | primary | Hand-picked, a saturated variant in the blue-slate hue family |
| `backend-fill` | `#ffffff` | primary | The backend/API/step node fill; 40 occurrences in 13 files; never a paper substitute |
| `high-level-chevron` | `#3d4460` | primary | Type-scoped to `type-high-level` only |

---

## 3. DARK

| Role | Value | Kind | Rule or source |
|---|---|---|---|
| `paper` | `#2d3142` | primary | Jet-black from the brand palette, the light `ink` value reused as ground |
| `paper-2` | `#393e53` | primary | Hand-picked, one step lighter than `paper` |
| `ink` | `#f5f5f5` | primary | White-smoke from the brand palette, the light `paper` value reused |
| `muted` | `#bfc0c0` | primary | Silver from the brand palette |
| `soft` | `#8e98ac` | primary | Hand-picked, a brighter counterpart of the light `soft` |
| `rule` | `rgba(245,245,245,0.12)` | derived | `ink` at 0.12 |
| `rule-solid` | `rgba(191,192,192,0.25)` | derived | `muted` at 0.25, equivalently silver `#bfc0c0` at 0.25 |
| `accent` | `#f08a59` | primary | Hand-picked; not a lightness shift of the light accent |
| `accent-tint` | `rgba(240,138,89,0.10)` | derived | `accent` at 0.10 |
| `link` | `#6a95d8` | primary | Hand-picked, a brighter counterpart of the light `link` |

---

## 4. TERMINAL

The terminal skin is a second, fixed skin. You opt into it per diagram, and onboarding never touches it.

| Role | Value | Kind | Rule or source |
|---|---|---|---|
| `terminal-page` | `#0a0a0a` | fixed | Page background behind the window |
| `terminal-paper` | `#141414` | fixed | Window body, node fill |
| `terminal-bar` | `#1b1b1b` | fixed | Titlebar strip |
| `terminal-border` | `#2b2b2b` | fixed | Window border, hairlines |
| `terminal-ink` | `#f5f5f5` | fixed | Primary text, primary stroke, same white-smoke as the default light `ink` |
| `terminal-muted` | `#9a9a9a` | fixed | Secondary text, sublabels, ring stroke |
| `terminal-soft` | `#5c5c5c` | fixed | Tertiary: inactive dots, spokes |
| `terminal-accent` | `#ff5a36` | fixed | The one accent: focal station, prompt sign, active dot |
| `terminal-accent-tint` | `rgba(255,90,54,0.12)` | derived | `terminal-accent` at 0.12, the fill for accent-bordered boxes |

---

## 5. GATES

| Gate | Threshold | Applies to |
|---|---|---|
| `text-on-paper` | 4.5:1 | `ink`, `muted`, and any text role against its ground |
| `mark-on-paper` | 3.0:1 | Any stroke or fill that carries meaning |
| `accent-against-ink` | 1.5:1 | The `accent` wherever it meets an `ink`-weight ground |
| `text-on-mark` | 4.5:1 | A label set on a coloured mark rather than on the paper: a typed chip, a filled badge |
| hairlines | ungated | `rule` and `rule-solid`, decoration reviewed by eye |

`text-on-mark` was added after a reader measured white chip labels against the text gate by analogy
and found one under it. The analogy was sound and the gate was missing, which is the worse of the two
problems: a rule applied by eye is a rule that holds only while someone is looking. Series values
stay ungated against the paper, because a series mark carries no text; a series value used as a chip
fill is a different use and clears this gate or it does not ship. The one that did not, the second
series, moved two points darker — invisible at a glance, 4.44:1 to 4.56:1 against white, and better
against the paper as well.

### Recorded departures

| Departure | Measures | Note |
|---|---|---|
| `accent` (#eb6c36) on `paper` (#f5f5f5) | 2.863:1 | Against the 3.0:1 mark gate; kept as the brand accent by decision; never re-derived |
| `soft` (#7a8399) on `paper` | 3.48:1 | Above the 3.0:1 mark gate, below the 4.5:1 text gate. May not carry sublabel or eyebrow text. |
| `terminal-soft` (#5c5c5c) on `terminal-paper` (#141414) | 2.76:1 | Decoration: inactive dots and spokes. Never carries text, so the text gate does not apply; recorded rather than exempted so the number is on the page. |

---

## 6. WHAT HOLDS THE STARTERS TO THIS RECORD

This section used to pin each starter file by sha256, on the theory that a pin which stops matching
means a starter changed without the record being updated. Nothing read the pins, and every one of
them was stale: fixing a defect in a starter changes its bytes, which is the point of fixing it.

What holds the relationship now is stronger and needs no upkeep. The applicator regenerates every
form from the values in this record, and the corpus check requires the result to equal the shipped
bytes exactly. A value that drifts from the record fails that comparison by name. A geometry change,
which a hash would have flagged and a reader would then have waved through, is not a drift at all.

## 7. TOLERANCES

Derived alphas are exact: a value recorded as `ink` at 0.12 must re-derive to `rgba(45,49,66,0.12)` with no rounding and no alternate notation. Contrast ratios are compared at two decimals, so 2.863:1 is recorded in full but gates as 2.86 against 3.0.
