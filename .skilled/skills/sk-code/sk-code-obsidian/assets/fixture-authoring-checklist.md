---
title: Screenshot Fixture Authoring Checklist
description: Gate a new or edited screenshot fixture in the Note Database plugin — real classes only, the guard test, the card-field parameter trap, and runtime-vars/theme stand-ins.
trigger_phrases:
  - "fixture authoring checklist"
  - "write a screenshot scenario fixture"
  - "never invent a db class"
  - "screenshot fixture guard test"
  - "runtime-vars stand-in gap"
  - "card field renderer parameter classes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Screenshot Fixture Authoring Checklist

Use this BEFORE writing or editing a scenario's hand-written markup in
`tools/screenshots/scenarios/`. Fixtures are markup written independently of the real renderers —
nothing forces them to describe the plugin's actual output except the guard test in this
checklist.

---

## 1. OVERVIEW

### Purpose

`tools/screenshots/` renders hand-written fixture markup against the shipped `styles.css` in
headless Chrome via `playwright-core`; it does not invoke the real renderers, which need a live
Obsidian `App`, vault, and metadata cache the harness never constructs. That gap is exactly where
an invented or misremembered class slips through and photographs unstyled markup while the capture
still exits clean.

### Usage

Work through the sections in order — real classes only, the guard test, the card-field parameter
trap, runtime-vars and theme stand-ins, the sources list, and device/body class — before claiming a
new or edited fixture is complete, then confirm against THE GATE.

---

## 2. REAL CLASSES ONLY

- [ ] Every `db-*`, `note-database*`, and `status-*` class in the fixture's `html()` string was
  confirmed present in `styles.css` **or** emitted by a renderer under `src/` — via
  `rg -n "<class>" styles.css src` — before it was typed, not after
- [ ] Did not invent a class name that "should" exist by analogy to a sibling class — a class the
  plugin never emits and no rule ever styles renders as unstyled markup that still looks like a
  successful capture

---

## 3. THE GUARD TEST

- [ ] Ran `npx vitest run src/views/screenshot-fixtures.test.ts` (or the full suite) after writing
  the fixture — it reads every `.mjs` file under `tools/screenshots/scenarios/`, collects every
  `db-*`/`note-database*`/`status-*` class referenced, and fails any absent from both `styles.css`
  and all of `src/`
- [ ] Understood what the guard does **not** catch: it only checks that a class exists somewhere in
  the plugin — it cannot tell you the fixture's DOM *structure* matches what the renderer actually
  produces (wrapper nesting, attribute order, sibling elements). That gap is closed only by §1 of
  `assets/screenshot-coverage-checklist.md` — opening the rendered PNG

---

## 4. THE CARD-FIELD PARAMETER TRAP

- [ ] `CardFieldRenderer` takes `labelClass`/`valueClass`/`fieldClass` as call parameters, not fixed
  classes — each view passes its own literal (`db-board-card-field-label`,
  `db-gallery-field-value`, `db-list-field-value`, and peers)
- [ ] Did not write the generic parameter name (`labelClass`, `fieldClass`) directly into fixture
  markup — nothing styles those names; a fixture that does renders label and value with no
  separator, a mistake this exact trap has already produced twice in this codebase
- [ ] Confirmed which view's card-field classes apply by checking the calling renderer
  (`BoardRenderer.ts`, `GalleryRenderer.ts`, `ListRenderer.ts`), not by guessing from the parameter
  name

---

## 5. RUNTIME-VARS AND THEME STAND-INS

- [ ] `theme.css` supplies the host Obsidian theme plus a form-control baseline; `runtime-vars.css`
  supplies the roughly 50 custom properties the plugin computes and sets from JavaScript at
  runtime (row heights, calendar cell sizes, and similar) — neither is a defect in the plugin, both
  are stand-ins for what Obsidian would provide
- [ ] `runtime-vars.css` loads after the stylesheet and targets `.note-database-container` as well
  as `:root` — a custom property set only at `:root` never reaches a nested element that expects
  the container-scoped value, since a property inherits from the nearest ancestor that sets it
- [ ] If a captured surface looks wrong (a viewport-derived size floating in dead space, a missing
  color), checked `theme.css`/`runtime-vars.css` for a missing stand-in **before** treating it as a
  plugin defect

---

## 6. SOURCES LIST

- [ ] `sources: [...]` lists every renderer/controller file whose class output the fixture depicts
  — this is what the staleness checker in `verify.mjs` hashes; an inaccurate list makes the
  freshness gate silently wrong (see `assets/screenshot-coverage-checklist.md` §3 for the full
  accuracy checklist)

---

## 7. DEVICE AND BODY CLASS

- [ ] A fixture meant to show the mobile layout is captured with `bodyClass: "is-phone"` — Obsidian
  marks phone layouts with that class, and a large part of the responsive CSS keys off it; a bare
  narrow viewport with no `is-phone` renders only a cramped desktop, never the mobile design
- [ ] Confirmed the `group` field (`"views"` vs `"components"`) matches the intended capture mode —
  a view renders inside a device frame at desktop/phone size, a component renders at its own size
  on a transparent ground

---

## 8. THE GATE

A fixture is "done" only when: every class in its markup was confirmed against `styles.css`/`src/`
before writing, not after; `ScreenshotFixtures.test.ts` passes; the card-field parameter classes
(if used) came from the actual calling view, not the generic parameter name; any surface that looks
wrong was checked against `theme.css`/`runtime-vars.css` before being called a plugin defect; the
`sources` list is accurate; and phone-intent fixtures carry `bodyClass: "is-phone"`.
