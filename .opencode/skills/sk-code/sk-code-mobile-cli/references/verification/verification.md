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
- `scripts/token-identity.mjs` — the value oracle: resolves every token chain to final literals per theme

### The Two Halves

The colour and spacing truth lives in `var()` token chains, not in pixels. Resolve those chains to
final literals from the CSS source across every theme and compare the literals. **The browser is
used only to prove the app still mounts and runs, never to read a value.**

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

## 7. THE VALUE ORACLE — TOKEN IDENTITY

`token-identity.mjs` parses the CSS, builds a raw declaration map per theme, and resolves every
`var()` chain (same-context first, then document scope, with cycle and fallback handling) to a final
literal. It resolves three theme states — **light** (base `:root`), **dark**
(`:root[data-theme='dark']`), and **system** (the `prefers-color-scheme: dark` block) — so one edit
is checked in all three at once. It has three subcommands:

```bash
# Capture a baseline before the change.
node scripts/token-identity.mjs snapshot app-mobile/src/app.css --out baseline.json

# After the change, diff resolved values against the baseline (exit 2 = any diff).
node scripts/token-identity.mjs diff baseline.json app-mobile/src/app.css

# Cross-check global roles against the hand-verified goldens (exit 2 = mismatch).
node scripts/token-identity.mjs verify app-mobile/src/app.css
```

When a component's scoped `<style>` is what changed, add the `.svelte` file to the input list — the
resolver reads `<style>` bodies out of a `.svelte` input and concatenates them with `app.css` (corpus
mode). The `diff` report names every `CHANGED` / `VANISHED` / `ADDED` role per theme, so a value that
moved where it should not is caught by name, not by eye.

---

## 8. THE STRUCTURAL GATES — CDP MOUNT CHECKS

The `*-cdp.mjs` scripts drive a headless Chromium over CDP to prove the built output **mounts and
does not throw**. Because CSP strips styling in that context, they are structural render checks, not
color oracles. Run the one that covers the surface you touched:

```bash
node scripts/design-system-cdp.mjs     # 390px demo baseline mounts
node scripts/rich-content-cdp.mjs      # rich message / artifact content renders
node scripts/file-preview-cdp.mjs      # file preview surfaces render
node scripts/inbound-media-cdp.mjs     # inbound media cards render
node scripts/runtime-smoke-cdp.mjs     # runtime boots, no throws
node scripts/catalog-smoke-cdp.mjs     # every Storybook story renders, both themes
```

Each exits `0` clean, `2` on a throw, `1` if the harness could not run.

---

## 9. THE WORKSPACE GATE — EVERY CHANGE

Independent of what surface changed, three whole-workspace gates run on every change:

```bash
npm run test:web      # Svelte + logic suites (includes app-mobile/tests/contrast.test.ts)
npm run typecheck     # workspace typecheck
npm run build         # the app builds
```

`test:web` carries the arithmetic contrast proof, so a value change that fails WCAG AA fails here.
Read the actual output and exit status of each — a tailed or piped invocation can report the wrong
process's exit code.

---

## 10. THE RECIPE, IN ORDER

1. `snapshot` the resolved tokens to a baseline before touching CSS.
2. Make the scoped edit in `app-mobile/src/app.css` or the component `<style>`.
3. `diff` against the baseline; confirm only the intended roles moved, in the intended themes.
4. `verify` the global-role goldens still match across light / dark / system.
5. Run the surface's `*-cdp.mjs` structural gate, then `test:web`, `typecheck`, and `build`.
6. Only a clean read of every exit status counts as proof — never a screenshot.

---

## 11. RELATED REFERENCES

- [`skill-reference-integrity.md`](skill-reference-integrity.md) — the drift guard that keeps every app path this surface names resolvable.

- [`../design-system/retint-recipes.md`](../design-system/retint-recipes.md) — applies this resolver method to two worked, step-by-step recipes.
- `assets/ds-verification-checklist.md` — this gate as a checklist.
