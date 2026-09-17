---
title: Story Coverage Upkeep Checklist
description: The Pi Remote component/story upkeep gate — co-located stories from real fixtures, coverage green, catalog renders in both themes, allowlist justified.
trigger_phrases:
  - "story coverage gate"
  - "storybook upkeep pi remote"
  - "story new scaffold"
  - "catalog smoke render"
  - "story coverage green"
  - "component story required"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# Story Coverage Upkeep Checklist

Use this whenever a renderable component changes. See the repo-root `STORYBOOK.md` for the full
catalog contract.

---

## 1. OVERVIEW

### Purpose

Storybook is the read-only catalog of every visual piece; the coverage gate keeps it complete as
the app grows by failing on any renderable component with no story or any stale allowlist entry.

### Usage

Work through the sections in order — every component has a story, stories show real values,
coverage gate green, catalog renders in both themes, and allowlist discipline — before claiming
a component change is complete, then confirm against THE GATE.

---

## 2. EVERY COMPONENT HAS A STORY

- [ ] Every renderable `*.svelte` change created or updated its co-located `*.stories.ts` (same
  directory, same stem)
- [ ] Scaffolded new ones with the real tool, not by hand:
  `npm run story:new app-mobile/src/<path>/<component>.svelte` (writes a CSF3 stub via
  `scripts/new-story.mjs` — meta + `autodocs` tag + a `Default` story)

---

## 3. STORIES SHOW REAL VALUES

- [ ] Filled each story's `args` from real demo fixtures (`$shared/data/demo`) — NEVER invented
  values; the catalog must show what the app actually renders
- [ ] One story per meaningful state (not a single default), and a provider `decorators` entry
  added where the component reads context — copy the shape from a sibling `*.stories.ts`

---

## 4. COVERAGE GATE GREEN

- [ ] `npm run story:coverage` exits 0 (`scripts/story-coverage.mjs`). A red gate is a FAILING
  test, not a warning — it fails on any renderable component with no story, or any stale
  allowlist entry

---

## 5. CATALOG RENDERS IN BOTH THEMES

- [ ] `node scripts/catalog-smoke-cdp.mjs` exits 0 — every story renders in light AND dark with
  zero throws (build-only checks miss runtime throws; exit 2 = a story threw)
- [ ] `npm run build-storybook -w @pi-remote/web` — the catalog compiles

---

## 6. ALLOWLIST DISCIPLINE

- [ ] Any entry in `scripts/story-coverage-allowlist.json` is genuinely non-renderable (route
  wrapper, context provider, compositional sub-part) and carries a WRITTEN reason
- [ ] Did not silence a real gap with an allowlist entry — the gate prunes an entry once the
  component gains a story or is deleted (a stale entry fails the gate)

---

## 7. VERIFY

- [ ] `npm run test:web` green (the web suite covers the components whose stories you touched)

---

## 8. THE GATE

Done only when: every changed renderable component has a co-located story built from real
`$shared/data/demo` fixtures; `npm run story:coverage` exits 0; `catalog-smoke-cdp.mjs` renders
every story clean in both themes and `build-storybook` compiles; every allowlist entry is
justified and non-stale; and `npm run test:web` is green.
