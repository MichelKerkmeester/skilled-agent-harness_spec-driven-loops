---
title: The Browser-Free Value-Preservation Recipe
description: How Pi Remote proves a style change preserved its resolved token values without a styled browser, because a strict CSP renders the app unstyled under headless CDP.
trigger_phrases:
  - "browser-free value preservation"
  - "token identity snapshot diff verify"
  - "csp unstyled headless screenshot"
  - "resolve var token chain themes"
  - "cdp structural mount gate"
  - "prove css change no regression"
  - "light dark system token resolver"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The Browser-Free Value-Preservation Recipe

A style change to the Pi Remote phone app is proven by resolving token values from source, not by
comparing screenshots. The app ships a strict Content-Security-Policy, so a headless CDP browser
renders it **unstyled** — a screenshot is not the value oracle. This reference is the recipe that
replaces the screenshot.

---

## 1. OVERVIEW

### Core Principle

The color and spacing truth lives in `var()` token chains, not in pixels. Resolve those chains to
final literals from the CSS source across every theme and compare the literals. The browser is used
only to prove the app still **mounts and runs**, never to read a value.

### When to Use

- Editing `app-mobile/src/app.css` or a component's scoped `<style>` and needing to prove no role
  moved unintentionally
- Decomposing or retinting tokens and needing a before/after value diff
- Confirming a change did not throw at runtime in the rendered output

### Key Sources

- `scripts/token-identity.mjs`
- `app-mobile/src/app.css`

---

## 2. THE VALUE ORACLE — TOKEN IDENTITY

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

## 3. THE STRUCTURAL GATES — CDP MOUNT CHECKS

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

## 4. THE WORKSPACE GATE — EVERY CHANGE

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

## 5. THE RECIPE, IN ORDER

1. `snapshot` the resolved tokens to a baseline before touching CSS.
2. Make the scoped edit in `app-mobile/src/app.css` or the component `<style>`.
3. `diff` against the baseline; confirm only the intended roles moved, in the intended themes.
4. `verify` the global-role goldens still match across light / dark / system.
5. Run the surface's `*-cdp.mjs` structural gate, then `test:web`, `typecheck`, and `build`.
6. Only a clean read of every exit status counts as proof — never a screenshot.

---

## 6. RELATED REFERENCES

- `a11y-parity.md` — the accessibility contract these gates cannot see, and how it is preserved.
- `comment-grammar.md` — the natural purpose comments that identify the token seam a change targets.
- [`storybook/component-story-upkeep.md`](storybook/component-story-upkeep.md) — how `catalog-smoke-cdp.mjs` fits the Storybook coverage contract.
