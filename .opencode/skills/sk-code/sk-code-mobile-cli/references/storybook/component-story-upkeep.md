---
title: The Storybook Catalog Upkeep Contract
description: The rule that every renderable Pi Remote component carries a co-located story showing what the app actually renders, enforced by the coverage gate and the catalog render gate.
trigger_phrases:
  - "storybook catalog upkeep"
  - "co-located stories.ts component"
  - "story coverage gate fails"
  - "story new scaffold command"
  - "catalog smoke render both themes"
  - "story coverage allowlist reason"
  - "never invent story values"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The Storybook Catalog Upkeep Contract

Storybook is the Pi Remote phone app's live, read-only catalog: every button, card, sheet, and screen
shown on its own, themeable, without running the whole app. The catalog stays complete and honest
only because two gates enforce it. This reference is that contract.

---

## 1. OVERVIEW

### Core Principle

Every renderable component change creates or updates its co-located story, and the story shows what
the app **actually renders** — never invented values. A component with no story, or a stale
allowlist entry, is a failing gate, not a warning.

### When to Use

- Adding a renderable component, or changing what an existing one renders
- The coverage gate went red, or an allowlist entry needs a reason
- Verifying a change did not break any story's rendering

### Key Sources

- `STORYBOOK.md`
- `scripts/story-coverage.mjs`
- `scripts/story-coverage-allowlist.json`

---

## 2. ONE STORY PER RENDERABLE COMPONENT

Every renderable `*.svelte` component has a co-located `*.stories.ts` next to it. Scaffold the stub,
then fill it:

```bash
npm run story:new app-mobile/src/<path>/<Component>.svelte
```

That writes a correct CSF3 stub via `scripts/new-story.mjs` — a `meta` with the `autodocs` tag and a
`Default` story. Then fill its `args` from **real demo fixtures** (`$shared/data/demo`), one story per
meaningful state, and add a provider `decorators` entry if the component reads context. Copy the shape
from a sibling story; never invent values, because the catalog must show what the app actually
renders.

---

## 3. THE COVERAGE GATE

The coverage gate is what keeps the catalog self-maintaining:

```bash
npm run story:coverage
```

It runs `scripts/story-coverage.mjs`, which walks `app-mobile/src`, and **fails** (exit 1) if any
renderable component has no story. Genuinely non-renderable files — route wrappers, context
providers, compositional primitive sub-parts — are exempted in `scripts/story-coverage-allowlist.json`,
each with a written reason. The gate also **prunes stale entries**: it fails if an allowlisted path no
longer exists or has since gained a story, so the allowlist can never hide a real gap. A red gate is a
failing test — fix it by adding the missing story or correcting the allowlist, not by ignoring it.

---

## 4. THE RENDER GATE

Coverage proves a story exists; the render gate proves it still renders. After a change:

```bash
npm run build-storybook -w @pi-remote/web   # the catalog compiles
node scripts/catalog-smoke-cdp.mjs          # every story renders, light + dark, zero throws
```

`catalog-smoke-cdp.mjs` drives a headless browser over CDP and renders **every** story in both
themes, catching runtime throws that a build-only check misses (exit `0` clean, `2` a story threw,
`1` the harness could not run). This local render gate is the deliberate substitute for hosted
visual-regression — there is no paid visual-diff step.

---

## 5. THE ADDONS THAT MAKE THE CATALOG USEFUL

The catalog is not just a render surface. Its addons are part of the contract: **a11y** runs automatic
contrast and accessibility checks on the component in view, **themes** drives the system / light / dark
toolbar through `data-theme` so every surface re-inks through the real tokens, and **autodocs**
generates a per-component docs page from each story's `autodocs` tag. A story authored with real
fixtures makes all three truthful at once.

**designs** is installed but wired to nothing — no story declares a `design:` parameter, because there
is no Figma source for this app; the design system was authored in code with `app.css` as its origin.
The addon stays installed so links can be added if that changes. Treat any claim that a Figma frame
sits beside a surface as false until a `design:` parameter actually exists.

Two further catalog surfaces are tooling rather than product, and live in `.storybook/` so they never
reach the app bundle: a **token playground** that retunes the design system across every story, and an
**editable seams** reference read out of the source at build time.

---

## 6. RELATED REFERENCES

- [`screenshot-archive.md`](screenshot-archive.md) — the tracked archive, and how an agent and a designer each use the catalog.
- [`storybook.md`](storybook.md) — the entry point for this folder: both audiences, and the gates in the order they bite.
- [`../browser-free-verification-recipe.md`](../verification/verification.md) — how `catalog-smoke-cdp.mjs` fits the app's CDP mount gates.
- [`../a11y-parity.md`](../svelte/svelte.md) — the accessibility contract the catalog's a11y panel checks per surface.
- [`../skill-reference-integrity.md`](../verification/skill-reference-integrity.md) — the guard that keeps this reference's paths from rotting.
