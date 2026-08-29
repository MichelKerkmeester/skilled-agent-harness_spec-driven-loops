---
title: The Storybook Catalog and Screenshot Archive
description: Entry point for the Pi Remote catalog — what Storybook is used for in this app, the two audiences it serves, the gates that keep it honest, and where each detailed contract lives.
trigger_phrases:
  - "storybook mobile cli"
  - "component catalog pi remote"
  - "catalog and screenshot archive"
  - "storybook entry reference"
  - "designer catalog tuning"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The Storybook Catalog and Screenshot Archive

Storybook is the Pi Remote phone app's live catalog: every button, card, sheet and screen shown on its
own, themeable, without running the whole app. Beside it sits a tracked screenshot archive that
remembers what each surface looked like.

This folder holds the three contracts that keep both honest. Start here, then read the one you need.

---

## 1. OVERVIEW

### Core Principle

A green test suite proves a component mounts and behaves. It says nothing about whether text is
legible, whether two states look different, or whether a control changes anything at all. The catalog
and its archive are the evidence for those, and every one of them is enforced by a gate rather than by
good intentions.

### When to Use

- Adding or changing anything that renders — a component, a token, a shared rule
- A screenshot moved and you need to tell a real change from a flake
- Reviewing a surface without running the whole app
- Retuning the design system, or asking what is safe to change

### Key Sources

- `STORYBOOK.md` at the app repository root — the human-facing guide
- `app-mobile/.storybook/` — the catalog's own tooling, deliberately outside `app-mobile/src`
- `screenshots/` and `screenshots/MANIFEST.json` — the tracked archive
- `scripts/` — `story-coverage.mjs`, `catalog-smoke-cdp.mjs`, `capture-screenshots.mjs`,
  `ui-audit.mjs`, `token-override-check.mjs`, `catalog-state-visibility.mjs`

---

## 2. THE TWO AUDIENCES

The catalog does two different jobs, and confusing them is why parts of it went unmaintained.

**An agent asks: did this change break something a test cannot see?** It renders every story in both
themes, measures contrast and geometry, and compares screenshots. Its tools are `ui-audit.mjs`,
`catalog-smoke-cdp.mjs` and the archive.

**A designer asks: what happens if I change this?** They retune a token and watch every story move,
flip a view's state from a control instead of editing a literal, and read what the system marks
editable or frozen. Their surfaces are the token playground, the state controls and the editable-seams
page, all under `app-mobile/.storybook/`.

Both are covered in [`screenshot-archive.md`](screenshot-archive.md), which is explicit about what
each one can and cannot catch.

---

## 3. WHAT EACH DOCUMENT COVERS

| Document | Read it for |
|---|---|
| [`component-story-upkeep.md`](component-story-upkeep.md) | The rule that every renderable component carries a co-located story showing what the app actually renders, and the two gates that enforce it: `story:coverage` and the CDP render gate. |
| [`screenshot-archive.md`](screenshot-archive.md) | How a shot is taken, why some are transparent and some sit on the page tone, what the archive's determinism is really worth measured rather than assumed, and how an agent and a designer each use the catalog. |

---

## 4. THE GATES, IN THE ORDER THEY BITE

Run these after any rendering change. Each one catches something the others cannot.

```bash
npm run story:coverage                      # every renderable component has a story
npm run build-storybook -w @pi-remote/web   # the catalog compiles
node scripts/catalog-smoke-cdp.mjs          # every story renders, light + dark, zero throws
node scripts/catalog-state-visibility.mjs   # no state is invisible, no age is impossible
node scripts/ui-audit.mjs                   # contrast, clipping, collision, touch targets, both themes
npm run story:shots                         # re-capture the archive
```

**`catalog-state-visibility.mjs` deserves a note**, because it exists for defects that passed every
other gate. It asserts that a published state actually paints differently from its siblings, that a
control renders a difference *at the value its own stories use*, and that no story reports an age the
pinned capture clock makes impossible. Each check was written after that exact failure shipped green.

The archive is captured in one theme, so `ui-audit.mjs` is the only thing that sees the other. An
entire defect class once existed only in dark.

---

## 5. RULES

### ✅ ALWAYS

- Add or update a story with the component change, and fill its args from real demo fixtures.
- Re-capture after any rendering change and commit the shots alongside it.
- Explain every moved shot: an intended change, or a flake proven by a returning re-capture.
- Audit both themes; the archive alone only shows one.
- Read the actual images for the defects no gate can express.

### ❌ NEVER

- Invent story values. The catalog must show what the app actually renders.
- Add production API — a prop, a slot, an export — to make a story render. Use an allowlisted story host.
- Claim byte-identical determinism from one pair of runs.
- Treat "the suite is green" as evidence that a surface renders correctly.

---

## 6. RELATED REFERENCES

- [`../browser-free-verification-recipe.md`](../browser-free-verification-recipe.md) — token resolution without a browser, and how the CDP gates fit.
- [`../verification.md`](../verification.md) — the verification command set for this surface.
- [`../a11y-parity.md`](../a11y-parity.md) — the accessibility contract the catalog's a11y panel checks.
- [`../scoped-style-ownership.md`](../scoped-style-ownership.md) — why a class can render unstyled in the wrong component.
- [`../skill-reference-integrity.md`](../skill-reference-integrity.md) — the guard that keeps these paths from rotting.
- [`../../assets/story-coverage-checklist.md`](../../assets/story-coverage-checklist.md) — the per-change checklist.
