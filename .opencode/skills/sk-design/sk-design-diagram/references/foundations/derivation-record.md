---
title: "Diagram Palette Derivation Record"
description: "Every colour role of the diagram skill's three skins, each value in one of four kinds, with the gates it must clear, the departures on record, and the pins that say which files the values were read from."
trigger_phrases:
  - "diagram derivation record"
  - "palette kinds and pins"
  - "diagram colour gates"
importance_tier: "important"
contextType: "reference"
version: 1.1.0.0
---

# Diagram Palette Derivation Record

The applicator of a later phase reads this file to theme the corpus, and the corpus check re-derives every derived value from it. Prose about colour lives in [style-guide.md](style-guide.md); this file is what a check can hold.

---

## 1. OVERVIEW

Three lists, one per skin: light, dark, terminal. A file carries one skin; the source carries all three. Every value is one of four kinds:

| Kind | Meaning |
|---|---|
| primary | chosen by hand and stated verbatim |
| derived | computed from a primary by a stated rule, such as ink at an alpha |
| fixed | never re-themes, whichever skin a file carries |
| untokenized | a file carrying its own fixed skin, exempt from this record; today only `assets/examples/example-sequence-oauth-dark.html` |

---

## 2. LIGHT

| Role | Value | Kind | Rule or source |
|---|---|---|---|
| `paper` | `#f5f5f5` | primary | white-smoke; page and default node fill |
| `paper-2` | `#ececec` | primary | container and secondary fill |
| `ink` | `#2d3142` | primary | jet-black; text and primary stroke |
| `muted` | `#4f5d75` | primary | blue-slate; secondary text, default arrow stroke |
| `soft` | `#7a8399` | primary | sublabels and boundary labels; may not carry sublabel or eyebrow text at 9px, see GATES |
| `rule` | `rgba(45,49,66,0.12)` | derived | ink at 0.12 |
| `rule-solid` | `#bfc0c0` | primary | silver; stronger borders and baselines |
| `accent` | `#eb6c36` | primary | atomic-tangerine; the one focal colour |
| `accent-tint` | `rgba(235,108,54,0.08)` | derived | accent at 0.08 |
| `link` | `#2e5aa8` | primary | HTTP, API and external arrows |
| `backend-fill` | `#ffffff` | primary | the backend, API and step node fill; 40 occurrences in 13 files; never a paper substitute |
| `high-level-chevron` | `#3d4460` | primary | type-scoped: used by type-high-level only |

---

## 3. DARK

| Role | Value | Kind | Rule or source |
|---|---|---|---|
| `paper` | `#2d3142` | primary | jet-black as the ground |
| `paper-2` | `#393e53` | primary |  |
| `ink` | `#f5f5f5` | primary | white-smoke |
| `muted` | `#bfc0c0` | primary | silver |
| `soft` | `#8e98ac` | primary |  |
| `rule` | `rgba(245,245,245,0.12)` | derived | ink at 0.12 |
| `rule-solid` | `rgba(191,192,192,0.25)` | derived | muted at 0.25 |
| `accent` | `#f08a59` | primary | hand-picked; not a lightness shift of the light accent |
| `accent-tint` | `rgba(240,138,89,0.10)` | derived | accent at 0.10 |
| `link` | `#6a95d8` | primary |  |

---

## 4. TERMINAL

| Role | Value | Kind | Rule or source |
|---|---|---|---|
| `terminal-page` | `#0a0a0a` | primary | page behind the window |
| `terminal-paper` | `#141414` | primary | window body and node fill |
| `terminal-bar` | `#1b1b1b` | primary | titlebar strip |
| `terminal-border` | `#2b2b2b` | primary | window border and hairlines |
| `terminal-ink` | `#f5f5f5` | primary | the same white-smoke as the default ink |
| `terminal-muted` | `#9a9a9a` | primary |  |
| `terminal-soft` | `#5c5c5c` | primary | inactive dots and spokes |
| `terminal-accent` | `#ff5a36` | primary | the one accent |
| `terminal-accent-tint` | `rgba(255,90,54,0.12)` | derived | terminal-accent at 0.12 |

---

## 5. GATES

| Gate | Threshold | Applies to |
|---|---|---|
| text-on-paper | 4.5:1 | ink, muted, and any role that carries text, against its own ground |
| mark-on-paper | 3.0:1 | any stroke or fill that carries meaning |
| accent-against-ink | 1.5:1 | the accent against the ink of the same skin |
| hairlines | ungated | rule and rule-solid are decoration, reviewed by eye |

Connectors are structure and sit with the hairlines unless painted with the accent, in which case that instance takes the mark gate.

### Recorded departures

| Role | Measured | Against | Decision |
|---|---|---|---|
| accent `#eb6c36` on `#f5f5f5` | 2.863:1 | mark-on-paper 3.0:1 | kept as the brand accent; never re-derived |
| soft `#7a8399` on `#f5f5f5` | 3.48:1 | text-on-paper 4.5:1 | may not carry sublabel or eyebrow text; structural use only |

---

## 6. PINS

The four templates are the stock skin's source of values. A pin that stops matching means a template changed without this record being updated.

| File | sha256 |
|---|---|
| `assets/templates/template-dark.html` | `49e81f271efb699d26c7bcc57962d758841065fa2842587aa003be90f9226436` |
| `assets/templates/template-full.html` | `1061260c6d021ea00df1385391092fe06c2f3e4bdf5082b7164bace24f1ec07d` |
| `assets/templates/template-terminal.html` | `6d000bd0308a737afeb1a11f453945d315abeea9d2a9f357fba534590ea391f9` |
| `assets/templates/template.html` | `b0da611ef61bfecb0a3d775071dc7b237b14c7386cbc7b2d0241d1da36bd7510` |

---

## 7. TOLERANCES

Derived alphas are exact. Contrast ratios are compared at two decimals.
