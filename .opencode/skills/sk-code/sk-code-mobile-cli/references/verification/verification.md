---
title: Pi Remote Verification Gate
description: The browser-free resolver method and the command set that prove a design-system change preserved every frozen value in both themes.
trigger_phrases:
  - "browser-free verification gate"
  - "css resolver method"
  - "value preservation check"
  - "pi remote design system verification"
  - "resolve css custom properties"
  - "typecheck build test web"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Verification Gate

The authoritative value-preservation gate for `app-mobile/` is **browser-free**. This reference
is why, and the exact checks a workflow runs before any "done" claim.

---

## 1. OVERVIEW

### Core Principle

Resolve `app-mobile/src/app.css` together with the changed component's scoped `<style>` block directly to final values per theme instead of screenshot/pixel diffing, because the app's CSP renders headless Chrome unstyled.

### When to Use

- Before claiming any Pi Remote design-system change preserved every frozen value in both themes
- When verifying a retint, a literal-to-token refactor, or an annotation-only pass against `app-mobile/src/app.css` and the changed component's scoped `<style>` block
- When running the pre-"done" command set (`typecheck`, `build`, `test:web`) for a design-system change
- When deciding whether a structural (headless mount) check or a resolver check applies to the change being verified

### Key Sources

- `app-mobile/src/app.html` — ships the strict CSP that blocks headless-Chrome style injection
- `app-mobile/src/app.css` — the CSS foundation the resolver method resolves per theme, together with the changed component's scoped `<style>` block
- [`../design-system/retint-recipes.md`](../design-system/retint-recipes.md) — applies this resolver method to two worked, step-by-step recipes
- `assets/ds-verification-checklist.md` — this gate expressed as a checklist

---

## 2. WHY BROWSER-FREE (the CSP insight)

The app's `app.html` ships a strict CSP (`style-src 'self'`, no `'unsafe-inline'`). Under headless
Chrome/CDP in dev, Vite's injected styles are blocked — the CSS lands in neither `document.styleSheets`
nor `adoptedStyleSheets`, so the app renders **unstyled**. Screenshot/pixel diffing therefore proves
nothing about color. The gate instead resolves `app-mobile/src/app.css` together with the changed
component's scoped `<style>` block directly to final values.

---

## 3. THE RESOLVER METHOD

Resolve every CSS custom property and every declaration to its final value **per theme**
(light / dark / system), following `var()` chains against the full token map, directly from the
stylesheet text — immune to the CSP problem. Compare a BEFORE and AFTER resolution:

- **Value preservation** — `CHANGED / VANISHED / ADDED` must all be **0** for a migration meant to
  preserve values (e.g. a literal→token refactor or an annotation-only pass).
- **Intended change** — for a retint, every intended declaration changes and nothing else does (e.g. a
  `--pi-clay` retint moves exactly the 45 accent declarations).

Run experiments on a **copy** of `app-mobile/src/app.css` (and the changed component's scoped `<style>`
block) so the real files stay byte-identical. This method caught a real regression where theme-invariant
literals were wrongly mapped to theme-varying tokens.

**Limitation:** the resolvers prove selector→value identity, not element→computed-style identity. A
className re-point / rule hoist changes which selector applies to an element and is **not** verifiable
this way (and headless CDP is unstyled here) — defer such physical refactors until a real-browser
visual-diff harness exists.

---

## 4. STRUCTURAL CHECKS THAT DO WORK HEADLESS

Against the **built** output (`vite build` emits real linked CSS, which is CSP-safe), a headless mount
check confirms structure at true 390px: the app `#root` and the catalog `#catalog-root` get children,
`scrollWidth == innerWidth` (zero horizontal overflow), and zero uncaught exceptions. Use these to guard
the shell from white-screening and the catalog from overflow — theme-independent, so both themes hold.

---

## 5. THE COMMAND SET

```bash
npm run typecheck     # tsc -b, exit 0
npm run build         # tsc -b && vite build, exit 0 (app + catalog entries)
npm run test:web      # vitest; includes contrast.test.ts (WCAG AA, both themes)
```

`npm run test:web` also carries the reduced-motion, focus, and state suites. A note on flakiness:
`app-mobile/tests/viewer-history.svelte.test.ts` is a known timing-sensitive test (an async `setTimeout(0)`
focus-restore raced by a synchronous assertion) — it is not a design-system signal.

---

## 6. THE GATE

A change is "done" only when: `typecheck`, `build`, and `test:web` pass; the resolver shows the intended
value delta and nothing more; `contrast.test.ts` is green in both themes; and no `--pi-*` value,
security boundary, or `Do not edit — <why>` guardrail fence changed.

---

## 7. RELATED REFERENCES

- [`../design-system/retint-recipes.md`](../design-system/retint-recipes.md) — applies this resolver method to two worked, step-by-step recipes.
- `assets/ds-verification-checklist.md` — this gate as a checklist.
