---
title: Token Retint Checklist
description: Pre-flight and proof checklist for a Pi Remote token retint (semantic role or component token).
trigger_phrases:
  - "token retint checklist"
  - "retint a pi remote role"
  - "retint a component token"
  - "before claiming a color change works"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Token Retint Checklist

Use this checklist before, during, and before claiming completion of any `--pi-*`-derived color or
component-token change in `apps/pi-remote-web/`. Pair with `references/retint-recipes.md` for the full
worked steps.

## 1. PRE-FLIGHT

□ Identified the exact token to change (semantic role, e.g. `--accent-ink`, or component token, e.g.
  `--model-sheet-accent`) — not the primitive it ultimately derives from
□ Confirmed the token is **not** a `--pi-*` primitive (`token-library.md` §1 — those 8 names are frozen)
□ Picked the right layer for the intended blast radius:
  - Semantic role → every surface playing that role moves (`retint-recipes.md` Recipe A)
  - Component token → exactly one surface moves (`retint-recipes.md` Recipe B)
□ Located every declaration of the token: light block, explicit dark block, and the
  `prefers-color-scheme: dark` system block (`theme-remap.md`) — checked whether all three currently
  hold the same value or diverge (e.g. `--accent-strong`, `--surface-code`; `theme-remap.md` §2–3)
□ Checked `component-tokens.md` / `theme-remap.md` for any role or token that shares the same primitive
  source, to confirm it will (or will not) move too

## 2. DURING THE EDIT

□ Copied `style.css` to a scratch copy before running any resolver experiment (`verification.md` §2) —
  the real file stays byte-identical until the edit itself is applied there directly
□ Resolved every custom property and declaration to its final value per theme, **before** the edit
□ Applied the edit to every theme block that should change (and left untouched every block that
  shouldn't)
□ Did not touch any `@ds guardrail: do-not-edit` fence while making the change
  (`assets/guardrail-audit-checklist.md`)

## 3. PROOF (before any "done" claim)

□ Resolved every custom property and declaration to its final value per theme, **after** the edit
□ Diffed BEFORE vs AFTER: `VANISHED` = 0, `ADDED` = 0
□ Diffed BEFORE vs AFTER: `CHANGED` covers exactly the declarations the recipe predicted — no surface
  outside the intended blast radius appears
□ Reloaded the catalog (`catalog.html`) and the app in both themes — the change shows up where expected
  and nowhere else
□ `npm run typecheck` — exit 0
□ `npm run build` — exit 0 (app + catalog entries)
□ `npm run test:web` — exit 0, including `contrast.test.tsx` green in both themes
□ No `--pi-*` primitive value, security boundary, or `@ds guardrail: do-not-edit` fence changed

## 4. CLAIMING FORMAT

### Correct
```
Retinted --model-sheet-accent (component token, model-effort-sheet surface only) from
#8a452f/#f0b19a to <new value> in both light and dark blocks. Resolver diff: CHANGED=6,
VANISHED=0, ADDED=0, all six inside .model-sheet-overlay. typecheck/build/test:web pass;
contrast.test.tsx green in both themes. Catalog + app reload confirm no leak into the
slash panel or diff view.
```

### Incorrect
```
Changed the accent color, looks right in the screenshot.
```
Screenshots do not prove color here — the app's CSP renders it unstyled under headless CDP
(`verification.md` §1). The resolver diff and the command gate are the evidence.

## 5. IF THE DIFF SHOWS UNEXPECTED CHANGES

□ A surface outside the intended blast radius changed → the edit likely landed on the wrong layer
  (semantic role instead of component token, or vice versa) — re-check `component-tokens.md` /
  `theme-remap.md` and retarget
□ A theme block you didn't intend to touch changed → check whether that block was aliasing the same
  primitive/role you edited (`theme-remap.md` §1) rather than holding its own literal
□ `contrast.test.tsx` fails → the retint dropped a pair below WCAG AA in one theme; pick a value that
  holds AA in both themes before proceeding

## 6. RELATED RESOURCES

- [retint-recipes.md](../references/retint-recipes.md) — the full worked recipes
- [component-tokens.md](../references/component-tokens.md) — the component-token inventory and blast radius
- [theme-remap.md](../references/theme-remap.md) — which role reads which primitive per theme
- [verification.md](../references/verification.md) — the resolver method and command gate in full
