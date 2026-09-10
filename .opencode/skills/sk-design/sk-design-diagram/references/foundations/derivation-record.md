---
title: "Diagram Palette Derivation Record"
description: "Classifies every diagram-skin color value as hand-picked, derived by a stated rule, never re-themed or exempt, and records the rule or source behind each."
trigger_phrases:
  - "palette derivation record"
  - "color value origins"
  - "diagram token derivation"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Diagram Palette Derivation Record

Where every diagram-skin color comes from, and what stays fixed when the skin changes.

---

## 1. OVERVIEW

Every color role the diagram skin themes appears in exactly one of three lists: LIGHT (§2), DARK (§3) and TERMINAL (§4). Every value in those lists is exactly one of four kinds:

- **primary**: a value chosen by hand, stated verbatim. A re-theme replaces primaries and nothing else.
- **derived**: computed from a primary by a stated rule, for example `ink` at an alpha. This is stricter than the style guide's prose, which also calls `soft` and `link` "derived" although no rule reproduces them.
- **fixed**: a value that never re-themes. Onboarding and hand-edits of the skin leave it untouched.
- **untokenized**: a kind that applies to files, not values. It marks a file that carries its own fixed skin and is exempt from this record. Today exactly one: `assets/examples/example-sequence-oauth-dark.html`.

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
| `rule-solid` | `#bfc0c0` | primary | Silver from the brand palette |
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
| hairlines | ungated | `rule` and `rule-solid`, decoration reviewed by eye |

### Recorded departures

| Departure | Measures | Note |
|---|---|---|
| `accent` (#eb6c36) on `paper` (#f5f5f5) | 2.863:1 | Against the 3.0:1 mark gate; kept as the brand accent by decision; never re-derived |
| `soft` (#7a8399) on `paper` | 3.48:1 | Above the 3.0:1 mark gate, below the 4.5:1 text gate. May not carry sublabel or eyebrow text. |

---

## 6. PINS

The four template files under the skill's `assets/templates/` are the stock skin's source of values. A pin that stops matching means a template changed without this record being updated.

| File | sha256 |
|---|---|
| `template-dark.html` | `11578e5d3d3c4c68e352ff58c1327e6ee7408fc545dfd19fc11255d48a69f603` |
| `template-full.html` | `1a93dfb1b62d8b4bc29d0d970f8b3ec00746deeb48fbae95aa9d0948fde95a41` |
| `template-terminal.html` | `baf735921a713edd97196e3275f907d362b0631dc27f2a4b8291ef6e7ca64728` |
| `template.html` | `4cf48c02bd393440b2a83f3f46b018caacf8f93b27fb966d38cb2d2153473846` |

---

## 7. TOLERANCES

Derived alphas are exact: a value recorded as `ink` at 0.12 must re-derive to `rgba(45,49,66,0.12)` with no rounding and no alternate notation. Contrast ratios are compared at two decimals, so 2.863:1 is recorded in full but gates as 2.86 against 3.0.
