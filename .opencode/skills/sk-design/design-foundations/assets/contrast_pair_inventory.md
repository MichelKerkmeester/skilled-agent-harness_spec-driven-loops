---
title: Contrast Pair Inventory
description: Fill-in worksheet for foreground and background text or surface pairs changed during UI build work.
trigger_phrases:
  - "contrast pair inventory"
  - "foreground background pairs"
  - "wcag contrast worksheet"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Contrast Pair Inventory

Fill this in for any UI build that changes text, icon, control, or surface color pairs. Use actual token names and values from the surface, not palette intentions. Every ratio recorded here must trace to `../scripts/contrast_check.py` (e.g. `python3 ../scripts/contrast_check.py "#787878" "#ffffff"`) rather than an eyeballed estimate — a calculator, not eyeballs; it exits non-zero when a pair fails the 4.5:1 body target. `foundations` itself is a read-only `Read`/`Glob`/`Grep` mode and never runs this script; the script runs downstream, in whichever step actually builds or ships the surface (typically `sk-code` implementation, a human check, or CI). Until that run has produced a value, mark `Tested by` (Section 2) and the row's `Result` (Section 3) `not assessed` rather than guessing. Full repair logic lives in `../references/color/oklch_workflow.md`; the shared gate is `../../shared/context_loading_contract.md`.

---

## 1. OVERVIEW

This worksheet proves that changed foreground/background pairs were checked against the target surface rather than assumed from palette intent. It travels with the foundations output when color, token, surface, or UI-control changes affect readability.

---

## 2. SET THE SURFACE

| Field | Value |
|---|---|
| Surface (page / route / component / file) | `__________` |
| Register (from `../../shared/register.md`) | [ ] Brand (design IS the product) [ ] Product (design SERVES the product) |
| Source of token values | `__________` |
| Tested by | manual check / browser / script / not assessed |

---

## 3. INVENTORY THE PAIRS

| Foreground token/value | Background token/value | Surface | Target | Result | Fix if fail |
|---|---|---|---|---|---|
| `__________` | `__________` | body text / control / icon / state / data | WCAG AA 4.5:1 body / 3:1 large-UI; APCA where available | pass\|fail\|not assessed | `__________` |
| `__________` | `__________` | body text / control / icon / state / data | WCAG AA 4.5:1 body / 3:1 large-UI; APCA where available | pass\|fail\|not assessed | `__________` |
| `__________` | `__________` | body text / control / icon / state / data | WCAG AA 4.5:1 body / 3:1 large-UI; APCA where available | pass\|fail\|not assessed | `__________` |
| `__________` | `__________` | body text / control / icon / state / data | WCAG AA 4.5:1 body / 3:1 large-UI; APCA where available | pass\|fail\|not assessed | `__________` |
| `__________` | `__________` | body text / control / icon / state / data | WCAG AA 4.5:1 body / 3:1 large-UI; APCA where available | pass\|fail\|not assessed | `__________` |

---

## 4. USE RULES

- A pair is not assessed until the actual foreground and background values are known.
- Body text targets WCAG AA 4.5:1 unless the product has a stricter bar.
- Large text, icons, visible focus, and UI controls target at least 3:1.
- When APCA is available, record it alongside WCAG rather than replacing the WCAG target.
- If a pair fails, repair with OKLCH lightness first, then retest and update the row.
- A failed required pair blocks the ready claim until fixed or explicitly scoped out.
