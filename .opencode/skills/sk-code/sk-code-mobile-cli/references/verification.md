---
title: Pi Remote Verification Gate
description: The browser-free resolver method and the command set that prove a design-system change preserved every frozen value in both themes.
version: 1.0.0.0
---

# Pi Remote Verification Gate

The authoritative value-preservation gate for `apps/pi-remote-web/` is **browser-free**. This reference
is why, and the exact checks a workflow runs before any "done" claim.

---

## 1. WHY BROWSER-FREE (the CSP insight)

The app's `index.html` ships a strict CSP (`style-src 'self'`, no `'unsafe-inline'`). Under headless
Chrome/CDP in dev, Vite's injected styles are blocked — the CSS lands in neither `document.styleSheets`
nor `adoptedStyleSheets`, so the app renders **unstyled**. Screenshot/pixel diffing therefore proves
nothing about color. The gate instead resolves `src/style.css` directly to final values.

## 2. THE RESOLVER METHOD

Resolve every CSS custom property and every declaration to its final value **per theme**
(light / dark / system), following `var()` chains against the full token map, directly from the
stylesheet text — immune to the CSP problem. Compare a BEFORE and AFTER resolution:

- **Value preservation** — `CHANGED / VANISHED / ADDED` must all be **0** for a migration meant to
  preserve values (e.g. a literal→token refactor or an annotation-only pass).
- **Intended change** — for a retint, every intended declaration changes and nothing else does (e.g. a
  `--pi-clay` retint moves exactly the 45 accent declarations).

Run experiments on a **copy** of `style.css` so the real file stays byte-identical. This method caught a
real regression where theme-invariant literals were wrongly mapped to theme-varying tokens.

**Limitation:** the resolvers prove selector→value identity, not element→computed-style identity. A
className re-point / rule hoist changes which selector applies to an element and is **not** verifiable
this way (and headless CDP is unstyled here) — defer such physical refactors until a real-browser
visual-diff harness exists.

## 3. STRUCTURAL CHECKS THAT DO WORK HEADLESS

Against the **built** output (`vite build` emits real linked CSS, which is CSP-safe), a headless mount
check confirms structure at true 390px: the app `#root` and the catalog `#catalog-root` get children,
`scrollWidth == innerWidth` (zero horizontal overflow), and zero uncaught exceptions. Use these to guard
the shell from white-screening and the catalog from overflow — theme-independent, so both themes hold.

## 4. THE COMMAND SET

```bash
npm run typecheck     # tsc -b, exit 0
npm run build         # tsc -b && vite build, exit 0 (app + catalog entries)
npm run test:web      # vitest; includes contrast.test.tsx (WCAG AA, both themes)
```

`npm run test:web` also carries the reduced-motion, focus, and state suites. A note on flakiness:
`tests/viewer-history.test.tsx` is a known timing-sensitive test (an async `setTimeout(0)` focus-restore
raced by a synchronous assertion) — it is not a design-system signal.

## 5. THE GATE

A change is "done" only when: `typecheck`, `build`, and `test:web` pass; the resolver shows the intended
value delta and nothing more; `contrast.test.tsx` is green in both themes; and no `--pi-*` value,
security boundary, or `@ds guardrail: do-not-edit` fence changed.

---

## 6. RELATED REFERENCES

- `retint-recipes.md` — applies this resolver method to two worked, step-by-step recipes.
- `assets/ds-verification-checklist.md` — this gate as a checklist.
