---
title: .db-* Class-Rename Checklist
description: Gate a .db-* class rename across the Note Database plugin's single 18,931-line stylesheet — injective map, static and dynamic sites, fixture parity, orphan awareness, render proof.
trigger_phrases:
  - "db class rename checklist"
  - "rename a db- class"
  - "styles.css class rename obsidian plugin"
  - "dynamic db class construction site"
  - "orphaned db class rename"
  - "verify class rename against fixtures"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# .db-* Class-Rename Checklist

Use this BEFORE claiming a `.db-*` class rename in the Note Database plugin is complete. There is
one stylesheet, `styles.css` — 18,931 lines, 1,196 distinct `.db-*` classes measured — with no
component-scoped styles anywhere, so a rename's blast radius is the whole file plus every renderer
and every screenshot fixture that references the name.

---

## 1. OVERVIEW

### Purpose

A rename that looks complete after a text-editor find-and-replace still breaks silently at three
sites this checklist forces you to check: a template-literal class built at runtime, a screenshot
fixture that never got updated, and an orphaned class that collides with a name already used
elsewhere in the 1,196-class grammar.

### Usage

Work through the sections in order — injective map, static occurrences, dynamic construction
sites, fixture and scenario sites, orphan awareness, and render proof — before claiming a rename
is complete, then confirm against THE GATE.

---

## 2. INJECTIVE MAP

- [ ] Wrote an explicit old->new map; it is injective — no two old classes collapse onto one new
  class, and no new class collides with a name already in the 1,196-class grammar
- [ ] For each new class, `rg -n "<new-class>" styles.css src` shows only the sites intended
- [ ] Checked the new name does not accidentally match one of the 11 `note-database`-prefixed
  classes or a `status-*` class — those are separate naming families the fixture guard also scans

---

## 3. STATIC OCCURRENCES

- [ ] Every literal occurrence replaced at word boundaries:
  `rg -nw "<old-class>" styles.css src` returns 0
- [ ] Checked both the stylesheet and the renderers — `styles.css` (the only stylesheet; no
  component-scoped styles exist to also check) and every `.ts` file under `src/`

---

## 4. DYNAMIC CONSTRUCTION SITES

`src/views/*Renderer.ts` builds several classes at runtime rather than writing them literally.
Enumerate them before declaring the rename complete:

`rg -n "class(Name)?\s*=.*\\\`|classList\.(add|toggle)\(\`" src -g '*.ts'`

- [ ] Template-literal forms (`` `db-group-header--depth-${depth}` ``, `` `db-${kind}-field-value` ``)
  realigned — grep the literal prefix/suffix, not just the base name, since the interpolated part
  never appears as a literal string
- [ ] Parameter-passed classes realigned in every call site: `CardFieldRenderer` takes
  `labelClass`/`valueClass`/`fieldClass` as constructor or call arguments, and each view passes its
  own literal (e.g. `db-board-card-field-label`, `db-gallery-field-value`, `db-list-field-value`) —
  renaming the class without updating every caller's argument leaves that view's fields unstyled
- [ ] Conditional/ternary forms (`cond ? "db-x" : "db-y"`, `is-active` toggles) realigned

---

## 5. FIXTURE AND SCENARIO SITES

The screenshot harness hand-writes markup independent of the renderers — a rename that only
touches `src/` leaves the fixtures describing the old name.

- [ ] `rg -nw "<old-class>" tools/screenshots/scenarios` returns 0 — every scenario's `html()`
  string updated to the new name
- [ ] `npx vitest run` includes `src/views/screenshot-fixtures.test.ts` green — it fails any fixture
  class absent from both `styles.css` and `src/`, which catches a fixture left on the old name
  (now absent from the renamed stylesheet) as well as a renderer left on the old name

---

## 6. ORPHAN AWARENESS

- [ ] If the renamed class is among the 769 measured as orphaned (referenced by no screenshot
  fixture), the rename is still real work — it changes what a future author greps for — but confirm
  it truly has zero fixture references before skipping §5's fixture pass, via
  `rg -c "<old-class>" tools/screenshots/scenarios`
- [ ] Did not assume "orphaned" means "unused" — an orphaned class can still be emitted by a
  renderer with no matching screenshot scenario; `rg -n "<old-class>" src` is the real usage check,
  not the fixture count

---

## 7. RENDER PROOF

- [ ] `npx tsc --noEmit` exit 0
- [ ] `npm run build` exit 0, no unexpected tracked diff
- [ ] `npx vitest run` — 386 passing across 49 files stays the floor (renaming should not drop this
  count; a dropped count means a test hard-coded the old class name)
- [ ] `npm run screenshots` rerun for every scenario whose `sources` list includes a file the rename
  touched, then `npm run screenshots:verify` exit 0
- [ ] Opened the regenerated PNGs for the renamed surface in both themes — the rename must be
  visually inert; any pixel change means the rename touched more than a name

---

## 8. THE GATE

The rename is "done" only when: the map is injective; `rg -nw "<old-class>"` is 0 across
`styles.css`, `src/`, and `tools/screenshots/scenarios/`; every template-literal and
parameter-passed construction site resolves to the new name; orphan status was checked, not
assumed; `tsc`, `build`, and `vitest run` (≥386 passing) are clean; `ScreenshotFixtures.test.ts`
and `screenshots:verify` both pass; and the regenerated PNGs for affected scenarios were opened and
show no visual change.
